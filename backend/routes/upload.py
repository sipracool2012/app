from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File
from utils.auth import get_current_user
from utils.s3 import upload_file_to_s3
from datetime import datetime

router = APIRouter(prefix="/api/upload", tags=["upload"])

# Get database instance
def get_db():
    from motor.motor_asyncio import AsyncIOMotorClient
    from dotenv import load_dotenv
    from pathlib import Path
    import os
    
    # Load environment variables
    ROOT_DIR = Path(__file__).parent.parent
    load_dotenv(ROOT_DIR / '.env')
    
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME', 'visa_app')
    client = AsyncIOMotorClient(mongo_url)
    return client[db_name]

db = get_db()

@router.post("/passport")
async def upload_passport(
    file: UploadFile = File(...),
    application_id: str = None,
    user_id: str = Depends(get_current_user)
):
    """
    Upload passport document
    """
    if not application_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Application ID is required"
        )
    
    # Validate file type
    allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only JPEG, PNG, and PDF are allowed."
        )
    
    # Upload to S3
    success, s3_key, error_msg = await upload_file_to_s3(file, application_id, "passport")
    
    if not success:
        # If S3 upload fails, store file locally as fallback
        import shutil
        upload_dir = "/app/backend/uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        file_path = f"{upload_dir}/{application_id}_passport_{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        s3_key = f"local:{file_path}"
    
    # Update application with document reference
    await db.applications.update_one(
        {"applicationId": application_id},
        {
            "$set": {
                "passportDocument": s3_key,
                "updatedAt": datetime.utcnow()
            }
        }
    )
    
    return {
        "success": True,
        "key": s3_key,
        "url": f"/api/upload/file/{s3_key}" if s3_key.startswith('local:') else ""
    }

@router.post("/photo")
async def upload_photo(
    file: UploadFile = File(...),
    application_id: str = None,
    user_id: str = Depends(get_current_user)
):
    """
    Upload photo document
    """
    if not application_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Application ID is required"
        )
    
    # Validate file type
    allowed_types = ['image/jpeg', 'image/jpg', 'image/png']
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only JPEG and PNG are allowed."
        )
    
    # Upload to S3
    success, s3_key, error_msg = await upload_file_to_s3(file, application_id, "photo")
    
    if not success:
        # If S3 upload fails, store file locally as fallback
        import shutil
        upload_dir = "/app/backend/uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        file_path = f"{upload_dir}/{application_id}_photo_{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        s3_key = f"local:{file_path}"
    
    # Update application with document reference
    await db.applications.update_one(
        {"applicationId": application_id},
        {
            "$set": {
                "photoDocument": s3_key,
                "updatedAt": datetime.utcnow()
            }
        }
    )
    
    return {
        "success": True,
        "key": s3_key,
        "url": f"/api/upload/file/{s3_key}" if s3_key.startswith('local:') else ""
    }
