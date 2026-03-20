from fastapi import APIRouter, HTTPException, status, Depends
from models.user import UserCreate, UserLogin, UserResponse, TokenResponse, User, UserRoleUpdate
from utils.auth import get_password_hash, verify_password, create_access_token, get_current_user
from datetime import datetime
from typing import List

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

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """
    Login user
    """
    # Find user by email
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    user_id = str(user["_id"])
    access_token = create_access_token(data={"sub": user_id})
    
    # Get role (default to 'user' for existing users without role)
    role = user.get("role", "user")
    
    # Return token and user info
    user_response = UserResponse(
        id=user_id,
        fullName=user["fullName"],
        email=user["email"],
        role=role
    )
    
    return TokenResponse(token=access_token, user=user_response)

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
