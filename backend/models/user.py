from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Annotated
from datetime import datetime
from bson import ObjectId
from pydantic import GetCoreSchemaHandler
from pydantic_core import core_schema

class UserCreate(BaseModel):
    fullName: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    fullName: str
    email: str
    role: str = "user"

    class Config:
        json_encoders = {ObjectId: str}

class TokenResponse(BaseModel):
    token: str
    user: UserResponse

class UserRoleUpdate(BaseModel):
    role: str  # user, admin, super_admin


class OTPVerifyRequest(BaseModel):
    """Request body for /api/auth/verify-otp."""
    email: EmailStr
    otp: str


class LoginInitiateResponse(BaseModel):
    """Returned by /api/auth/login or /api/auth/register when OTP has been dispatched."""
    otp_required: bool = True
    message: str


class SignupOTPVerifyRequest(BaseModel):
    """Request body for /api/auth/verify-signup-otp."""
    email: EmailStr
    otp: str

class User(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    fullName: str
    email: EmailStr
    password: str
    role: str = "user"  # user, admin, super_admin
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
