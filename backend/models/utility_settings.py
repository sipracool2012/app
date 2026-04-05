from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# Valid values for fee_display_mode:
#   "full_breakdown"  – show govt fee + processing fee + service fee + total
#   "total_only"      – show only the final total amount
#   "our_fee_only"    – show only the service (our) fee
#   "with_discount"   – show total after deducting country discount_amount
FEE_DISPLAY_MODES = ("full_breakdown", "total_only", "our_fee_only", "with_discount")


class UtilitySettings(BaseModel):
    fee_display_mode: str = "full_breakdown"
    draft_expiry_days: int = 7
    draft_expiry_hours: int = 0
    draft_expiry_minutes: int = 0
    draft_expiry_seconds: int = 0
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by: str = ""


class UtilitySettingsUpdate(BaseModel):
    fee_display_mode: Optional[str] = None
    draft_expiry_days: Optional[int] = None
    draft_expiry_hours: Optional[int] = None
    draft_expiry_minutes: Optional[int] = None
    draft_expiry_seconds: Optional[int] = None
