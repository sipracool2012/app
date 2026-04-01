"""
Email Provider Routes
======================
CRUD endpoints for managing email provider configuration.
Only super_admin users may read full config or update settings.

Endpoints:
  GET  /api/email-providers/config          → public-safe summary (enabled + configured flags)
  GET  /api/email-providers/config/admin    → full config including masked keys (super_admin only)
  PUT  /api/email-providers/config          → update config (super_admin only)

# CHANGELOG REMINDER: Update CHANGELOG.md when adding or modifying endpoints here.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from models.email_provider_config import (
    EmailProviderConfig,
    EmailProviderConfigUpdate,
    EmailProviderConfigResponse,
)
from utils.auth import get_current_user
from datetime import datetime
from bson import ObjectId
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / ".env")

_client = AsyncIOMotorClient(os.environ.get("MONGO_URL"))
db = _client[os.environ.get("DB_NAME")]

router = APIRouter()


@router.get("/config", response_model=EmailProviderConfigResponse)
async def get_email_provider_config(current_user_id: str = Depends(get_current_user)):
    """
    Return a public-safe summary of email provider configuration.
    Accessible to any authenticated admin user.
    """
    user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not user or user.get("role") not in ("admin", "super_admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    config = await db.email_provider_config.find_one({}) or {}

    return EmailProviderConfigResponse(
        mandrill_enabled=config.get("mandrill_enabled", True),
        mandrill_configured=bool(config.get("mandrill_api_key")),
        sendpulse_enabled=config.get("sendpulse_enabled", False),
        sendpulse_configured=bool(config.get("sendpulse_smtp_user") and config.get("sendpulse_smtp_password")),
        sendpulse_smtp_host=config.get("sendpulse_smtp_host", "smtp-pulse.com"),
        sendpulse_smtp_port=config.get("sendpulse_smtp_port", 587),
        postmark_enabled=config.get("postmark_enabled", False),
        postmark_configured=bool(config.get("postmark_server_token")),
        updated_at=config.get("updated_at", datetime.utcnow()),
    )


@router.get("/config/admin")
async def get_email_provider_config_admin(current_user_id: str = Depends(get_current_user)):
    """
    Return the full email provider configuration including credentials.
    Restricted to super_admin only.
    Password/token values are masked in the response for display safety.
    """
    user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not user or user.get("role") != "super_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Super admin access required")

    config = await db.email_provider_config.find_one({}) or {}

    def mask(value: str) -> str:
        """Mask a secret: show only the first 4 chars followed by asterisks."""
        if not value:
            return ""
        visible = value[:4]
        return visible + "*" * max(0, len(value) - 4)

    return {
        "mandrill_enabled": config.get("mandrill_enabled", True),
        "mandrill_api_key": mask(config.get("mandrill_api_key", "")),
        "sendpulse_enabled": config.get("sendpulse_enabled", False),
        "sendpulse_smtp_host": config.get("sendpulse_smtp_host", "smtp.sendpulse.com"),
        "sendpulse_smtp_port": config.get("sendpulse_smtp_port", 465),
        "sendpulse_smtp_user": config.get("sendpulse_smtp_user", ""),
        "sendpulse_smtp_password": mask(config.get("sendpulse_smtp_password", "")),
        "postmark_enabled": config.get("postmark_enabled", False),
        "postmark_server_token": mask(config.get("postmark_server_token", "")),
        "updated_at": config.get("updated_at", datetime.utcnow()),
    }


@router.put("/config")
async def update_email_provider_config(
    update: EmailProviderConfigUpdate,
    current_user_id: str = Depends(get_current_user),
):
    """
    Update email provider configuration.
    Restricted to super_admin only.
    Only supplied (non-None) fields are updated (partial update).
    # CHANGELOG REMINDER: Update CHANGELOG.md after modifying provider settings.
    """
    user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not user or user.get("role") != "super_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Super admin access required")

    # Build update document from non-None fields only
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    update_data["updated_by"] = current_user_id

    # Upsert — create the document if it doesn't exist yet
    await db.email_provider_config.update_one(
        {},
        {"$set": update_data},
        upsert=True,
    )

    return {"message": "Email provider configuration updated successfully"}
