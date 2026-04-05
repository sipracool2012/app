from fastapi import APIRouter, HTTPException, status, Depends
from models.utility_settings import UtilitySettings, UtilitySettingsUpdate
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
            "show_fee_breakdown": True,
            "draft_expiry_days": 7,
            "draft_expiry_hours": 0,
            "draft_expiry_minutes": 0,
            "draft_expiry_seconds": 0,
        }
    return {
        "show_fee_breakdown": doc.get("show_fee_breakdown", True),
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
            "show_fee_breakdown": True,
            "draft_expiry_days": 7,
            "draft_expiry_hours": 0,
            "draft_expiry_minutes": 0,
            "draft_expiry_seconds": 0,
        }
        defaults.update(set_data)
        await db.utility_settings.insert_one(defaults)

    doc = await db.utility_settings.find_one({})
    return {
        "show_fee_breakdown": doc.get("show_fee_breakdown", True),
        "draft_expiry_days": doc.get("draft_expiry_days", 7),
        "draft_expiry_hours": doc.get("draft_expiry_hours", 0),
        "draft_expiry_minutes": doc.get("draft_expiry_minutes", 0),
        "draft_expiry_seconds": doc.get("draft_expiry_seconds", 0),
    }
