from fastapi import APIRouter, HTTPException, status, Depends
from models.user import UserCreate, UserLogin, UserResponse, TokenResponse, User, UserRoleUpdate, UserEmailRoleUpdate, OTPVerifyRequest, LoginInitiateResponse, SignupOTPVerifyRequest, ForgotPasswordRequest, ResetPasswordRequest
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

@router.post("/register")
async def register(user_data: UserCreate):
    """
    Register a new user.
    If otp_signup_enabled is True in the email provider config, the user is NOT created
    immediately. Instead a 6-digit OTP is dispatched and the client must call
    /verify-signup-otp to complete account creation.
    If disabled (default), the account is created immediately and a token is returned.
    """
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Check if this is the first user (will become super_admin — always skip OTP to avoid bootstrap deadlock)
    user_count = await db.users.count_documents({})
    role = "super_admin" if user_count == 0 else "user"

    hashed_password = get_password_hash(user_data.password)

    # Check OTP config
    config = await db.email_provider_config.find_one({}) or {}
    otp_signup_enabled = config.get("otp_signup_enabled", False) and user_count > 0

    if otp_signup_enabled:
        # Store pending registration + dispatch OTP
        otp = str(secrets.randbelow(900000) + 100000)
        expires_at = datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)

        await db.pending_registrations.update_one(
            {"email": user_data.email},
            {
                "$set": {
                    "email": user_data.email,
                    "fullName": user_data.fullName,
                    "hashed_password": hashed_password,
                    "role": role,
                    "otp": otp,
                    "expires_at": expires_at,
                    "created_at": datetime.utcnow(),
                }
            },
            upsert=True,
        )

        from utils.email import send_otp_email
        sent = await send_otp_email(
            to_email=user_data.email,
            otp=otp,
            full_name=user_data.fullName,
        )

        if not sent:
            logger.warning(
                f"[OTP FALLBACK] Signup OTP for {user_data.email}: {otp}  (expires in {OTP_EXPIRY_MINUTES} min)"
            )

        delivery_message = (
            "A verification code has been sent to your email. It expires in 5 minutes."
            if sent
            else "Email delivery is not configured. Ask your administrator for the one-time code from the server log."
        )
        logger.info(f"Signup OTP {'dispatched via email' if sent else 'logged to console'} for {user_data.email}")
        return LoginInitiateResponse(otp_required=True, message=delivery_message)

    # OTP disabled — create account immediately
    user_doc = {
        "fullName": user_data.fullName,
        "email": user_data.email,
        "password": hashed_password,
        "role": role,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }

    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    access_token = create_access_token(data={"sub": user_id})

    return TokenResponse(
        token=access_token,
        user=UserResponse(id=user_id, fullName=user_data.fullName, email=user_data.email, role=role)
    )

@router.post("/login")
async def login(credentials: UserLogin):
    """
    Sign-in endpoint.
    If otp_login_enabled (default True): validates credentials, dispatches OTP, returns otp_required=True.
      Client must call /verify-otp to obtain a token.
    If otp_login_enabled is False: validates credentials and returns a JWT token directly.
    # CHANGELOG REMINDER: Update CHANGELOG.md when modifying the auth flow.
    """
    # Find user by email
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Check OTP config
    config = await db.email_provider_config.find_one({}) or {}
    otp_login_enabled = config.get("otp_login_enabled", True)

    if not otp_login_enabled:
        # Skip OTP — return token directly
        user_id = str(user["_id"])
        access_token = create_access_token(data={"sub": user_id})
        logger.info(f"Direct login (OTP disabled) for {credentials.email}")
        return TokenResponse(
            token=access_token,
            user=UserResponse(
                id=user_id,
                fullName=user["fullName"],
                email=user["email"],
                role=user.get("role", "user"),
            ),
        )

    # OTP enabled — generate and dispatch
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


@router.post("/verify-signup-otp", response_model=TokenResponse)
async def verify_signup_otp(payload: SignupOTPVerifyRequest):
    """
    Completes OTP-gated account creation.
    Validates the OTP sent during /register, then creates the user and returns a JWT token.
    """
    record = await db.pending_registrations.find_one({"email": payload.email})

    invalid_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired verification code.",
    )

    if not record:
        raise invalid_exc
    if datetime.utcnow() > record["expires_at"]:
        # Clean up expired record
        await db.pending_registrations.delete_one({"email": payload.email})
        raise invalid_exc
    if record["otp"] != payload.otp:
        raise invalid_exc

    # Guard against race condition (email registered between /register and here)
    existing = await db.users.find_one({"email": payload.email})
    if existing:
        await db.pending_registrations.delete_one({"email": payload.email})
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    # Create the user
    user_doc = {
        "fullName": record["fullName"],
        "email": record["email"],
        "password": record["hashed_password"],
        "role": record["role"],
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)

    # Clean up pending record
    await db.pending_registrations.delete_one({"email": payload.email})

    access_token = create_access_token(data={"sub": user_id})
    logger.info(f"Signup OTP verified, account created for {payload.email}")
    return TokenResponse(
        token=access_token,
        user=UserResponse(
            id=user_id,
            fullName=record["fullName"],
            email=record["email"],
            role=record["role"],
        ),
    )


# Password reset token validity (hours)
RESET_TOKEN_EXPIRY_HOURS = 1


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest):
    """
    Initiates a password reset.
    Always returns the same success response to prevent user enumeration.
    If the email exists, a reset link is emailed. If not, the request is silently dropped.
    """
    import os
    frontend_url = os.environ.get("FRONTEND_URL", "https://clearevisa.com").rstrip("/")

    user = await db.users.find_one({"email": payload.email})
    if user:
        token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=RESET_TOKEN_EXPIRY_HOURS)

        await db.password_reset_tokens.update_one(
            {"email": payload.email},
            {
                "$set": {
                    "email": payload.email,
                    "token": token,
                    "expires_at": expires_at,
                    "used": False,
                    "created_at": datetime.utcnow(),
                }
            },
            upsert=True,
        )

        reset_link = f"{frontend_url}/reset-password?token={token}"
        from utils.email import send_password_reset_email
        sent = await send_password_reset_email(
            to_email=payload.email,
            reset_link=reset_link,
            full_name=user.get("fullName", "User"),
        )
        if not sent:
            logger.warning(f"[PASSWORD RESET FALLBACK] Reset link for {payload.email}: {reset_link}")

    # Always return 200 to prevent user enumeration
    return {"message": "If that email is registered, a password reset link has been sent."}


@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest):
    """
    Completes a password reset.
    Validates the token, updates the user's password, and invalidates the token.
    """
    invalid_exc = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="This reset link is invalid or has expired. Please request a new one.",
    )

    record = await db.password_reset_tokens.find_one({"token": payload.token})
    if not record:
        raise invalid_exc
    if record.get("used"):
        raise invalid_exc
    if datetime.utcnow() > record["expires_at"]:
        raise invalid_exc

    # Enforce minimum password length
    if len(payload.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters.",
        )

    hashed = get_password_hash(payload.new_password)
    result = await db.users.update_one(
        {"email": record["email"]},
        {"$set": {"password": hashed, "updatedAt": datetime.utcnow()}},
    )

    if result.matched_count == 0:
        raise invalid_exc

    # Invalidate token
    await db.password_reset_tokens.update_one(
        {"token": payload.token},
        {"$set": {"used": True}},
    )

    logger.info(f"Password reset completed for {record['email']}")
    return {"message": "Your password has been reset successfully. You can now sign in."}


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
    
    # Get only admin and super_admin users
    users = []
    async for user in db.users.find({"role": {"$in": ["admin", "super_admin"]}}):
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

@router.patch("/users/promote", response_model=UserResponse)
async def promote_user_by_email(
    data: UserEmailRoleUpdate,
    current_user_id: str = Depends(get_current_user)
):
    """
    Promote/update a user's role by email address (super_admin only).
    """
    from bson import ObjectId

    current_user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not current_user or current_user.get("role") != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only super admins can update user roles"
        )

    if data.role not in ["admin", "super_admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be 'admin' or 'super_admin'"
        )

    target_user = await db.users.find_one({"email": data.email})
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user found with that email address"
        )

    await db.users.update_one(
        {"_id": target_user["_id"]},
        {"$set": {"role": data.role, "updatedAt": datetime.utcnow()}}
    )

    updated_user = await db.users.find_one({"_id": target_user["_id"]})
    return UserResponse(
        id=str(updated_user["_id"]),
        fullName=updated_user["fullName"],
        email=updated_user["email"],
        role=updated_user["role"]
    )
