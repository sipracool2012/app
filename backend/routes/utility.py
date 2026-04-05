from fastapi import APIRouter, HTTPException, status, Depends
from models.utility_settings import UtilitySettings, UtilitySettingsUpdate, FEE_DISPLAY_MODES
from utils.auth import get_current_user
from datetime import datetime
from bson import ObjectId
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(MONGO_URL)
db = client[os.environ.get('DB_NAME')]

router = APIRouter()


@router.get("/settings")
async def get_utility_settings():
    """Get utility settings (public — no auth required)."""
    doc = await db.utility_settings.find_one({})
    if not doc:
        return {
            "fee_display_mode": "full_breakdown",
            "draft_expiry_days": 7,
            "draft_expiry_hours": 0,
            "draft_expiry_minutes": 0,
            "draft_expiry_seconds": 0,
        }
    # Backward-compat: if old bool field present but new field absent, migrate
    _mode = doc.get("fee_display_mode")
    if not _mode:
        _mode = "full_breakdown" if doc.get("show_fee_breakdown", True) else "total_only"
    return {
        "fee_display_mode": _mode,
        "draft_expiry_days": doc.get("draft_expiry_days", 7),
        "draft_expiry_hours": doc.get("draft_expiry_hours", 0),
        "draft_expiry_minutes": doc.get("draft_expiry_minutes", 0),
        "draft_expiry_seconds": doc.get("draft_expiry_seconds", 0),
    }


@router.patch("/settings")
async def update_utility_settings(
    update: UtilitySettingsUpdate,
    current_user_id: str = Depends(get_current_user)
):
    """Update utility settings — super_admin only."""
    user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not user or user.get("role") not in ("admin", "super_admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update utility settings"
        )

    if update.fee_display_mode is not None and update.fee_display_mode not in FEE_DISPLAY_MODES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"fee_display_mode must be one of: {', '.join(FEE_DISPLAY_MODES)}"
        )
    set_data = {k: v for k, v in update.model_dump().items() if v is not None}
    set_data["updated_at"] = datetime.utcnow()
    set_data["updated_by"] = str(current_user_id)

    existing = await db.utility_settings.find_one({})
    if existing:
        await db.utility_settings.update_one(
            {"_id": existing["_id"]},
            {"$set": set_data}
        )
    else:
        defaults = {
            "fee_display_mode": "full_breakdown",
            "draft_expiry_days": 7,
            "draft_expiry_hours": 0,
            "draft_expiry_minutes": 0,
            "draft_expiry_seconds": 0,
        }
        defaults.update(set_data)
        await db.utility_settings.insert_one(defaults)

    doc = await db.utility_settings.find_one({})
    _mode = doc.get("fee_display_mode")
    if not _mode:
        _mode = "full_breakdown" if doc.get("show_fee_breakdown", True) else "total_only"
    return {
        "fee_display_mode": _mode,
        "draft_expiry_days": doc.get("draft_expiry_days", 7),
        "draft_expiry_hours": doc.get("draft_expiry_hours", 0),
        "draft_expiry_minutes": doc.get("draft_expiry_minutes", 0),
        "draft_expiry_seconds": doc.get("draft_expiry_seconds", 0),
    }
