from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UtilitySettings(BaseModel):
    show_fee_breakdown: bool = True
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by: str = ""


class UtilitySettingsUpdate(BaseModel):
    show_fee_breakdown: Optional[bool] = None
