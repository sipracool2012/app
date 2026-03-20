from fastapi import APIRouter, HTTPException, status, Depends
from models.payment_gateway_config import (
    PaymentGatewayConfig,
    PaymentGatewayConfigUpdate,
    PaymentGatewayConfigResponse
)
from utils.auth import get_current_user
from datetime import datetime
from bson import ObjectId

router = APIRouter()

# Import database
import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(MONGO_URL)
db = client.visa_applications

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
