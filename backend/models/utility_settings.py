from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UtilitySettings(BaseModel):
    show_fee_breakdown: bool = True
    draft_expiry_days: int = 7
    draft_expiry_hours: int = 0
    draft_expiry_minutes: int = 0
    draft_expiry_seconds: int = 0
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by: str = ""


class UtilitySettingsUpdate(BaseModel):
    show_fee_breakdown: Optional[bool] = None
    draft_expiry_days: Optional[int] = None
    draft_expiry_hours: Optional[int] = None
    draft_expiry_minutes: Optional[int] = None
    draft_expiry_seconds: Optional[int] = None
