from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId

class PaymentGatewayConfig(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    
    # Razorpay Configuration
    razorpay_enabled: bool = False
    razorpay_key_id: str = ""
    razorpay_key_secret: str = ""
    razorpay_webhook_secret: str = ""
    razorpay_mode: str = "sandbox"  # sandbox or live
    
    # PayPal Configuration
    paypal_enabled: bool = False
    paypal_client_id: str = ""
    paypal_secret: str = ""
    paypal_mode: str = "sandbox"  # sandbox or live
    
    # Tazapay Configuration
    tazapay_enabled: bool = False
    tazapay_api_key: str = ""
    tazapay_secret_key: str = ""
    tazapay_webhook_secret: str = ""
    tazapay_mode: str = "sandbox"  # sandbox or live
    
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by: str = ""

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class PaymentGatewayConfigUpdate(BaseModel):
    razorpay_enabled: Optional[bool] = None
    razorpay_key_id: Optional[str] = None
    razorpay_key_secret: Optional[str] = None
    razorpay_webhook_secret: Optional[str] = None
    razorpay_mode: Optional[str] = None
    
    paypal_enabled: Optional[bool] = None
    paypal_client_id: Optional[str] = None
    paypal_secret: Optional[str] = None
    paypal_mode: Optional[str] = None
    
    tazapay_enabled: Optional[bool] = None
    tazapay_api_key: Optional[str] = None
    tazapay_secret_key: Optional[str] = None
    tazapay_webhook_secret: Optional[str] = None
    tazapay_mode: Optional[str] = None

class PaymentGatewayConfigResponse(BaseModel):
    razorpay_enabled: bool
    razorpay_mode: str
    razorpay_configured: bool  # Has keys
    
    paypal_enabled: bool
    paypal_mode: str
    paypal_configured: bool
    
    tazapay_enabled: bool
    tazapay_mode: str
    tazapay_configured: bool
    
    updated_at: datetime
