from fastapi import APIRouter, HTTPException, status, Depends
from models.user import UserCreate, UserLogin, UserResponse, TokenResponse, User, UserRoleUpdate, OTPVerifyRequest, LoginInitiateResponse
from utils.auth import get_password_hash, verify_password, create_access_token, get_current_user
from datetime import datetime, timedelta
from typing import List
import secrets
import logging

logger = logging.getLogger(__name__)

# OTP validity window (minutes)
OTP_EXPIRY_MINUTES = 5

router = APIRouter(prefix="/api/auth", tags=["authentication"])

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

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    """
    Register a new user
    First user becomes super_admin, rest are regular users
    """
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if this is the first user
    user_count = await db.users.count_documents({})
    role = "super_admin" if user_count == 0 else "user"
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user document
    user_doc = {
        "fullName": user_data.fullName,
        "email": user_data.email,
        "password": hashed_password,
        "role": role,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    # Insert into database
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id})
    
    # Return token and user info
    user_response = UserResponse(
        id=user_id,
        fullName=user_data.fullName,
        email=user_data.email,
        role=role
    )
    
    return TokenResponse(token=access_token, user=user_response)

@router.post("/login", response_model=LoginInitiateResponse)
async def login(credentials: UserLogin):
    """
    Step 1 of 2-factor sign-in.
    Validates credentials, then dispatches a 6-digit OTP to the user's email.
    Returns otp_required=True; the client must call /verify-otp to obtain a token.
    # CHANGELOG REMINDER: Update CHANGELOG.md when modifying the auth flow.
    """
    # Find user by email
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        # Use a generic message to avoid user enumeration
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Generate a cryptographically secure 6-digit OTP
    otp = str(secrets.randbelow(900000) + 100000)
    expires_at = datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)

    # Upsert OTP record (one active OTP per email at a time)
    await db.otp_store.update_one(
        {"email": credentials.email},
        {
            "$set": {
                "email": credentials.email,
                "otp": otp,
                "expires_at": expires_at,
                "used": False,
                "created_at": datetime.utcnow(),
            }
        },
        upsert=True,
    )

    # Dispatch OTP via the active email provider chain
    from utils.email import send_otp_email
    sent = await send_otp_email(
        to_email=credentials.email,
        otp=otp,
        full_name=user.get("fullName", "User"),
    )

    if not sent:
        # No email provider is configured or all providers failed.
        # Bootstrap fallback: print OTP to server console so a super admin with
        # server access can complete first-time login and configure providers.
        # SECURITY NOTE: this log line is intentional for bootstrapping only.
        # Once email providers are configured this path will not be reached.
        # CHANGELOG REMINDER: Update CHANGELOG.md when modifying the auth flow.
        logger.warning(
            f"[OTP FALLBACK] No email provider available. "
            f"OTP for {credentials.email}: {otp}  (expires in {OTP_EXPIRY_MINUTES} min)"
        )

    delivery_message = (
        "A verification code has been sent to your email address. It expires in 5 minutes."
        if sent
        else "Email delivery is not configured. Your one-time code has been printed to the server log. "
             "Please ask your server administrator for the code."
    )

    logger.info(f"OTP {'dispatched via email' if sent else 'logged to console'} for {credentials.email}")
    return LoginInitiateResponse(
        otp_required=True,
        message=delivery_message,
    )


@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp(payload: OTPVerifyRequest):
    """
    Step 2 of 2-factor sign-in.
    Validates the OTP and returns a JWT access token on success.
    # CHANGELOG REMINDER: Update CHANGELOG.md when modifying the auth flow.
    """
    record = await db.otp_store.find_one({"email": payload.email})

    invalid_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired verification code.",
    )

    if not record:
        raise invalid_exc
    if record.get("used"):
        raise invalid_exc
    if datetime.utcnow() > record["expires_at"]:
        raise invalid_exc
    if record["otp"] != payload.otp:
        raise invalid_exc

    # Mark OTP as used to prevent replay attacks
    await db.otp_store.update_one({"email": payload.email}, {"$set": {"used": True}})

    # Fetch user and create token
    user = await db.users.find_one({"email": payload.email})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user_id = str(user["_id"])
    access_token = create_access_token(data={"sub": user_id})

    return TokenResponse(
        token=access_token,
        user=UserResponse(
            id=user_id,
            fullName=user["fullName"],
            email=user["email"],
            role=user.get("role", "user"),
        ),
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(user_id: str = Depends(get_current_user)):
    """
    Get current user information
    """
    from bson import ObjectId
    
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=str(user["_id"]),
        fullName=user["fullName"],
        email=user["email"],
        role=user.get("role", "user")
    )

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(current_user_id: str = Depends(get_current_user)):
    """
    Get all users (admin and super_admin only)
    """
    from bson import ObjectId
    
    # Get current user to check role
    current_user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not current_user or current_user.get("role") not in ["admin", "super_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )
    
    # Get all users
    users = []
    async for user in db.users.find():
        users.append(UserResponse(
            id=str(user["_id"]),
            fullName=user["fullName"],
            email=user["email"],
            role=user.get("role", "user")
        ))
    
    return users

@router.patch("/users/{user_id}/role", response_model=UserResponse)
async def update_user_role(
    user_id: str,
    role_update: UserRoleUpdate,
    current_user_id: str = Depends(get_current_user)
):
    """
    Update user role (super_admin only)
    """
    from bson import ObjectId
    
    # Get current user to check if they are super_admin
    current_user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not current_user or current_user.get("role") != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only super admins can update user roles"
        )
    
    # Validate role
    if role_update.role not in ["user", "admin", "super_admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Must be 'user', 'admin', or 'super_admin'"
        )
    
    # Update user role
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "role": role_update.role,
                "updatedAt": datetime.utcnow()
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get updated user
    updated_user = await db.users.find_one({"_id": ObjectId(user_id)})
    
    return UserResponse(
        id=str(updated_user["_id"]),
        fullName=updated_user["fullName"],
        email=updated_user["email"],
        role=updated_user["role"]
    )
