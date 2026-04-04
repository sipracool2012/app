from fastapi import APIRouter, HTTPException, status, Depends
from models.payment_gateway_config import (
    PaymentGatewayConfig,
    PaymentGatewayConfigUpdate,
    PaymentGatewayConfigResponse
)
from utils.auth import get_current_user
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel
import httpx
import logging
import hmac
import hashlib

logger = logging.getLogger(__name__)

PAYPAL_SANDBOX_BASE = "https://api-m.sandbox.paypal.com"
PAYPAL_LIVE_BASE = "https://api-m.paypal.com"
RAZORPAY_BASE = "https://api.razorpay.com/v1"
TAZAPAY_SANDBOX_BASE = "https://api.sandbox.tazapay.com"
TAZAPAY_LIVE_BASE = "https://api.tazapay.com"

class PayPalCreateOrderRequest(BaseModel):
    application_id: str
    amount: float
    return_url: str
    cancel_url: str

class PayPalCaptureOrderRequest(BaseModel):
    order_id: str
    application_id: str

class RazorpayCreateOrderRequest(BaseModel):
    application_id: str
    amount: float
    currency: str = "USD"

class RazorpayVerifyRequest(BaseModel):
    application_id: str
    order_id: str
    payment_id: str
    signature: str

class TazapayCheckoutRequest(BaseModel):
    application_id: str
    amount: float
    email: str
    success_url: str
    failure_url: str

router = APIRouter()

# Import database
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(MONGO_URL)
db = client[os.environ.get('DB_NAME')]

@router.get("/config", response_model=PaymentGatewayConfigResponse)
async def get_payment_gateway_config(current_user_id: str = Depends(get_current_user)):
    """
    Get payment gateway configuration (public info only)
    Returns which gateways are enabled and configured, but not the keys
    """
    # Get current user to check role
    user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get payment gateway config
    config = await db.payment_gateway_config.find_one({})
    
    if not config:
        # Return default disabled config
        return PaymentGatewayConfigResponse(
            razorpay_enabled=False,
            razorpay_mode="sandbox",
            razorpay_configured=False,
            paypal_enabled=False,
            paypal_mode="sandbox",
            paypal_configured=False,
            tazapay_enabled=False,
            tazapay_mode="sandbox",
            tazapay_configured=False,
            updated_at=datetime.utcnow()
        )
    
    return PaymentGatewayConfigResponse(
        razorpay_enabled=config.get("razorpay_enabled", False),
        razorpay_mode=config.get("razorpay_mode", "sandbox"),
        razorpay_configured=bool(config.get("razorpay_key_id")),
        paypal_enabled=config.get("paypal_enabled", False),
        paypal_mode=config.get("paypal_mode", "sandbox"),
        paypal_configured=bool(config.get("paypal_client_id")),
        tazapay_enabled=config.get("tazapay_enabled", False),
        tazapay_mode=config.get("tazapay_mode", "sandbox"),
        tazapay_configured=bool(config.get("tazapay_api_key")),
        updated_at=config.get("updated_at", datetime.utcnow())
    )

@router.get("/config/admin")
async def get_payment_gateway_config_admin(current_user_id: str = Depends(get_current_user)):
    """
    Get full payment gateway configuration (super_admin only)
    Includes API keys
    """
    # Get current user to check role
    user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not user or user.get("role") != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only super admins can access full payment configuration"
        )
    
    # Get payment gateway config
    config = await db.payment_gateway_config.find_one({})
    
    if not config:
        # Return default config
        return {
            "razorpay_enabled": False,
            "razorpay_key_id": "",
            "razorpay_key_secret": "",
            "razorpay_webhook_secret": "",
            "razorpay_mode": "sandbox",
            "paypal_enabled": False,
            "paypal_client_id": "",
            "paypal_secret": "",
            "paypal_mode": "sandbox",
            "tazapay_enabled": False,
            "tazapay_api_key": "",
            "tazapay_secret_key": "",
            "tazapay_webhook_secret": "",
            "tazapay_mode": "sandbox",
            "updated_at": datetime.utcnow(),
            "updated_by": ""
        }
    
    return {
        "razorpay_enabled": config.get("razorpay_enabled", False),
        "razorpay_key_id": config.get("razorpay_key_id", ""),
        "razorpay_key_secret": config.get("razorpay_key_secret", ""),
        "razorpay_webhook_secret": config.get("razorpay_webhook_secret", ""),
        "razorpay_mode": config.get("razorpay_mode", "sandbox"),
        "paypal_enabled": config.get("paypal_enabled", False),
        "paypal_client_id": config.get("paypal_client_id", ""),
        "paypal_secret": config.get("paypal_secret", ""),
        "paypal_mode": config.get("paypal_mode", "sandbox"),
        "tazapay_enabled": config.get("tazapay_enabled", False),
        "tazapay_api_key": config.get("tazapay_api_key", ""),
        "tazapay_secret_key": config.get("tazapay_secret_key", ""),
        "tazapay_webhook_secret": config.get("tazapay_webhook_secret", ""),
        "tazapay_mode": config.get("tazapay_mode", "sandbox"),
        "updated_at": config.get("updated_at", datetime.utcnow()),
        "updated_by": config.get("updated_by", "")
    }

@router.put("/config")
async def update_payment_gateway_config(
    config_update: PaymentGatewayConfigUpdate,
    current_user_id: str = Depends(get_current_user)
):
    """
    Update payment gateway configuration (super_admin only)
    """
    # Get current user to check role
    user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not user or user.get("role") != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only super admins can update payment configuration"
        )
    
    # Get existing config
    existing_config = await db.payment_gateway_config.find_one({})
    
    # Prepare update data
    update_data = config_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    update_data["updated_by"] = current_user_id
    
    if existing_config:
        # Update existing config
        result = await db.payment_gateway_config.update_one(
            {"_id": existing_config["_id"]},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment gateway configuration not found"
            )
    else:
        # Create new config
        new_config = {
            "razorpay_enabled": False,
            "razorpay_key_id": "",
            "razorpay_key_secret": "",
            "razorpay_webhook_secret": "",
            "razorpay_mode": "sandbox",
            "paypal_enabled": False,
            "paypal_client_id": "",
            "paypal_secret": "",
            "paypal_mode": "sandbox",
            "tazapay_enabled": False,
            "tazapay_api_key": "",
            "tazapay_secret_key": "",
            "tazapay_webhook_secret": "",
            "tazapay_mode": "sandbox",
            **update_data
        }
        await db.payment_gateway_config.insert_one(new_config)
    
    return {"message": "Payment gateway configuration updated successfully"}

@router.get("/enabled-gateways")
async def get_enabled_gateways():
    """
    Get list of enabled payment gateways (public endpoint)
    Used by frontend to show available payment options
    """
    config = await db.payment_gateway_config.find_one({})
    
    if not config:
        return {"gateways": []}
    
    enabled_gateways = []
    
    if config.get("razorpay_enabled") and config.get("razorpay_key_id"):
        enabled_gateways.append({
            "id": "razorpay",
            "name": "Razorpay",
            "description": "Credit/Debit Card, UPI, Net Banking",
            "mode": config.get("razorpay_mode", "sandbox")
        })
    
    if config.get("paypal_enabled") and config.get("paypal_client_id"):
        enabled_gateways.append({
            "id": "paypal",
            "name": "PayPal",
            "description": "PayPal & Credit/Debit Cards",
            "mode": config.get("paypal_mode", "sandbox")
        })
    
    if config.get("tazapay_enabled") and config.get("tazapay_api_key"):
        enabled_gateways.append({
            "id": "tazapay",
            "name": "Tazapay",
            "description": "International Payments (70+ markets)",
            "mode": config.get("tazapay_mode", "sandbox")
        })
    
    return {"gateways": enabled_gateways}


async def _paypal_access_token(client_id: str, secret: str, mode: str) -> str:
    base_url = PAYPAL_SANDBOX_BASE if mode == "sandbox" else PAYPAL_LIVE_BASE
    async with httpx.AsyncClient() as http:
        resp = await http.post(
            f"{base_url}/v1/oauth2/token",
            data={"grant_type": "client_credentials"},
            auth=(client_id, secret),
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=20,
        )
        resp.raise_for_status()
        return resp.json()["access_token"]


@router.post("/paypal/create-order")
async def paypal_create_order(
    req: PayPalCreateOrderRequest,
    current_user_id: str = Depends(get_current_user),
):
    """Create a PayPal order and return the approval URL for redirect."""
    config = await db.payment_gateway_config.find_one({})
    if not config or not config.get("paypal_enabled") or not config.get("paypal_client_id"):
        raise HTTPException(status_code=400, detail="PayPal is not configured or enabled")

    client_id = config["paypal_client_id"]
    secret = config["paypal_secret"]
    mode = config.get("paypal_mode", "sandbox")
    currency = config.get("paypal_currency", "USD")
    base_url = PAYPAL_SANDBOX_BASE if mode == "sandbox" else PAYPAL_LIVE_BASE

    try:
        access_token = await _paypal_access_token(client_id, secret, mode)
        async with httpx.AsyncClient() as http:
            resp = await http.post(
                f"{base_url}/v2/checkout/orders",
                json={
                    "intent": "CAPTURE",
                    "purchase_units": [{
                        "reference_id": req.application_id,
                        "description": f"Visa application {req.application_id}",
                        "amount": {
                            "currency_code": currency,
                            "value": f"{req.amount:.2f}"
                        }
                    }],
                    "application_context": {
                        "return_url": req.return_url,
                        "cancel_url": req.cancel_url,
                        "brand_name": "Clear eVisa",
                        "user_action": "PAY_NOW"
                    }
                },
                headers={"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"},
                timeout=20,
            )
            resp.raise_for_status()
            order = resp.json()

        # Persist order_id and amount on the application for retry
        await db.applications.update_one(
            {"applicationId": req.application_id},
            {"$set": {"paypal_order_id": order["id"], "payment_amount": req.amount, "updatedAt": datetime.utcnow()}}
        )

        approval_url = next(l["href"] for l in order["links"] if l["rel"] == "approve")
        return {"order_id": order["id"], "approval_url": approval_url}

    except httpx.HTTPStatusError as e:
        logger.exception("PayPal create-order failed")
        raise HTTPException(status_code=502, detail=f"PayPal error: {e.response.text}")
    except Exception as e:
        logger.exception("PayPal create-order unexpected error")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/paypal/capture-order")
async def paypal_capture_order(
    req: PayPalCaptureOrderRequest,
    current_user_id: str = Depends(get_current_user),
):
    """Capture an approved PayPal order and mark the application as submitted."""
    config = await db.payment_gateway_config.find_one({})
    if not config or not config.get("paypal_client_id"):
        raise HTTPException(status_code=400, detail="PayPal is not configured")

    client_id = config["paypal_client_id"]
    secret = config["paypal_secret"]
    mode = config.get("paypal_mode", "sandbox")
    base_url = PAYPAL_SANDBOX_BASE if mode == "sandbox" else PAYPAL_LIVE_BASE

    try:
        access_token = await _paypal_access_token(client_id, secret, mode)
        async with httpx.AsyncClient() as http:
            resp = await http.post(
                f"{base_url}/v2/checkout/orders/{req.order_id}/capture",
                headers={"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"},
                timeout=30,
            )
            resp.raise_for_status()
            capture = resp.json()

        if capture.get("status") != "COMPLETED":
            raise HTTPException(status_code=400, detail=f"PayPal capture status: {capture.get('status')}")

        transaction_id = capture["purchase_units"][0]["payments"]["captures"][0]["id"]

        # Mark application as submitted + record transaction
        await db.applications.update_one(
            {"applicationId": req.application_id},
            {"$set": {
                "status": "submitted",
                "paypal_transaction_id": transaction_id,
                "paypal_capture": capture,
                "updatedAt": datetime.utcnow()
            }}
        )

        return {"success": True, "transaction_id": transaction_id, "status": "COMPLETED"}

    except httpx.HTTPStatusError as e:
        logger.exception("PayPal capture failed")
        raise HTTPException(status_code=502, detail=f"PayPal error: {e.response.text}")
    except Exception as e:
        logger.exception("PayPal capture unexpected error")
        raise HTTPException(status_code=500, detail=str(e))


# ─── Razorpay ──────────────────────────────────────────────────────────────────

@router.post("/razorpay/create-order")
async def razorpay_create_order(
    req: RazorpayCreateOrderRequest,
    current_user_id: str = Depends(get_current_user),
):
    """Create a Razorpay order and return order details for the frontend checkout."""
    config = await db.payment_gateway_config.find_one({})
    if not config or not config.get("razorpay_enabled") or not config.get("razorpay_key_id"):
        raise HTTPException(status_code=400, detail="Razorpay is not configured or enabled")

    key_id = config["razorpay_key_id"]
    key_secret = config["razorpay_key_secret"]

    try:
        async with httpx.AsyncClient() as http:
            resp = await http.post(
                f"{RAZORPAY_BASE}/orders",
                json={
                    "amount": int(req.amount * 100),  # Razorpay expects smallest currency unit
                    "currency": req.currency,
                    "receipt": req.application_id[:40],
                    "notes": {"application_id": req.application_id},
                },
                auth=(key_id, key_secret),
                timeout=20,
            )
            resp.raise_for_status()
            order = resp.json()

        await db.applications.update_one(
            {"applicationId": req.application_id},
            {"$set": {"razorpay_order_id": order["id"], "payment_amount": req.amount, "updatedAt": datetime.utcnow()}}
        )

        return {
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key_id": key_id,
        }

    except httpx.HTTPStatusError as e:
        logger.exception("Razorpay create-order failed")
        raise HTTPException(status_code=502, detail=f"Razorpay error: {e.response.text}")
    except Exception as e:
        logger.exception("Razorpay create-order unexpected error")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/razorpay/verify-payment")
async def razorpay_verify_payment(
    req: RazorpayVerifyRequest,
    current_user_id: str = Depends(get_current_user),
):
    """Verify Razorpay payment signature and mark the application as submitted."""
    config = await db.payment_gateway_config.find_one({})
    if not config or not config.get("razorpay_key_secret"):
        raise HTTPException(status_code=400, detail="Razorpay is not configured")

    key_secret = config["razorpay_key_secret"]

    # HMAC-SHA256 verification
    body = f"{req.order_id}|{req.payment_id}"
    expected = hmac.new(key_secret.encode(), body.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, req.signature):
        raise HTTPException(status_code=400, detail="Invalid payment signature")

    await db.applications.update_one(
        {"applicationId": req.application_id},
        {"$set": {
            "status": "submitted",
            "razorpay_payment_id": req.payment_id,
            "razorpay_order_id": req.order_id,
            "updatedAt": datetime.utcnow(),
        }}
    )

    return {"success": True, "transaction_id": req.payment_id}


# ─── Tazapay ───────────────────────────────────────────────────────────────────

@router.post("/tazapay/create-checkout")
async def tazapay_create_checkout(
    req: TazapayCheckoutRequest,
    current_user_id: str = Depends(get_current_user),
):
    """Create a Tazapay checkout session and return the redirect URL."""
    config = await db.payment_gateway_config.find_one({})
    if not config or not config.get("tazapay_enabled") or not config.get("tazapay_api_key"):
        raise HTTPException(status_code=400, detail="Tazapay is not configured or enabled")

    mode = config.get("tazapay_mode", "sandbox")
    base_url = TAZAPAY_SANDBOX_BASE if mode == "sandbox" else TAZAPAY_LIVE_BASE
    api_key = config["tazapay_api_key"]
    secret_key = config["tazapay_secret_key"]

    try:
        async with httpx.AsyncClient() as http:
            resp = await http.post(
                f"{base_url}/v2/checkout",
                json={
                    "reference_id": req.application_id,
                    "buyer_email": req.email,
                    "currency": "USD",
                    "amount": req.amount,
                    "description": f"Visa application {req.application_id}",
                    "success_url": req.success_url,
                    "failure_url": req.failure_url,
                },
                auth=(api_key, secret_key),
                timeout=20,
            )
            resp.raise_for_status()
            data = resp.json()

        redirect_url = data["data"]["redirect_url"]
        session_id = data["data"].get("session_id", "")

        await db.applications.update_one(
            {"applicationId": req.application_id},
            {"$set": {"tazapay_session_id": session_id, "payment_amount": req.amount, "updatedAt": datetime.utcnow()}}
        )

        return {"redirect_url": redirect_url, "session_id": session_id}

    except httpx.HTTPStatusError as e:
        logger.exception("Tazapay create-checkout failed")
        raise HTTPException(status_code=502, detail=f"Tazapay error: {e.response.text}")
    except Exception as e:
        logger.exception("Tazapay create-checkout unexpected error")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tazapay/verify/{session_id}")
async def tazapay_verify(
    session_id: str,
    application_id: str,
    current_user_id: str = Depends(get_current_user),
):
    """Verify a Tazapay session and mark the application as submitted."""
    config = await db.payment_gateway_config.find_one({})
    if not config or not config.get("tazapay_api_key"):
        raise HTTPException(status_code=400, detail="Tazapay is not configured")

    mode = config.get("tazapay_mode", "sandbox")
    base_url = TAZAPAY_SANDBOX_BASE if mode == "sandbox" else TAZAPAY_LIVE_BASE

    try:
        async with httpx.AsyncClient() as http:
            resp = await http.get(
                f"{base_url}/v1/session/{session_id}",
                auth=(config["tazapay_api_key"], config["tazapay_secret_key"]),
                timeout=20,
            )
            resp.raise_for_status()
            data = resp.json()

        payment_status = data.get("data", {}).get("payment_status", "")
        if payment_status not in ("success", "completed", "paid"):
            raise HTTPException(status_code=400, detail=f"Payment not completed: {payment_status}")

        await db.applications.update_one(
            {"applicationId": application_id},
            {"$set": {
                "status": "submitted",
                "tazapay_session_id": session_id,
                "updatedAt": datetime.utcnow(),
            }}
        )

        return {"success": True, "transaction_id": session_id}

    except HTTPException:
        raise
    except httpx.HTTPStatusError as e:
        logger.exception("Tazapay verify failed")
        raise HTTPException(status_code=502, detail=f"Tazapay error: {e.response.text}")
    except Exception as e:
        logger.exception("Tazapay verify unexpected error")
        raise HTTPException(status_code=500, detail=str(e))
