"""
Email Provider Configuration Model
=====================================
Pydantic models for the email_provider_config MongoDB collection.

Providers: Mandrill (API), SendPulse (SMTP), Postmark (API).
# CHANGELOG REMINDER: Update CHANGELOG.md when changing this model.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId


class EmailProviderConfig(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)

    # --- Mandrill ---
    mandrill_enabled: bool = True   # Default ON so existing setups keep working
    mandrill_api_key: str = ""

    # --- SendPulse SMTP ---
    sendpulse_enabled: bool = False
    sendpulse_smtp_host: str = "smtp-pulse.com"
    sendpulse_smtp_port: int = 587  # 465 is blocked on most servers; 587 STARTTLS is the safe default
    sendpulse_smtp_user: str = ""
    sendpulse_smtp_password: str = ""

    # --- Postmark API ---
    postmark_enabled: bool = False
    postmark_server_token: str = ""

    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by: str = ""

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class EmailProviderConfigUpdate(BaseModel):
    mandrill_enabled: Optional[bool] = None
    mandrill_api_key: Optional[str] = None

    sendpulse_enabled: Optional[bool] = None
    sendpulse_smtp_host: Optional[str] = None
    sendpulse_smtp_port: Optional[int] = None
    sendpulse_smtp_user: Optional[str] = None
    sendpulse_smtp_password: Optional[str] = None

    postmark_enabled: Optional[bool] = None
    postmark_server_token: Optional[str] = None


class EmailProviderConfigResponse(BaseModel):
    """Public response — never exposes raw API keys/passwords."""
    mandrill_enabled: bool
    mandrill_configured: bool

    sendpulse_enabled: bool
    sendpulse_configured: bool
    sendpulse_smtp_host: str
    sendpulse_smtp_port: int

    postmark_enabled: bool
    postmark_configured: bool

    updated_at: datetime
