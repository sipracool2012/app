from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class CountryVisaConfig(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    country_code: str  # ISO 3166-1 alpha-2 code
    country_name: str
    flag_emoji: str = ""
    country_enabled: bool = False
    
    # Tourist Visa Configuration
    tourist_enabled: bool = False
    tourist_30d_enabled: bool = False
    tourist_30d_govt_fee: float = 0.0
    tourist_1yr_enabled: bool = False
    tourist_1yr_govt_fee: float = 0.0
    tourist_5yr_enabled: bool = False
    tourist_5yr_govt_fee: float = 0.0
    
    # Business Visa Configuration
    business_enabled: bool = False
    business_govt_fee: float = 0.0
    
    # Medical Visa Configuration
    medical_enabled: bool = False
    medical_govt_fee: float = 0.0
    
    # Transit Visa Configuration  
    transit_enabled: bool = False
    transit_govt_fee: float = 0.0
    
    # Common Fees (applied to all visa types)
    payment_fee: float = 0.0
    processing_fee: float = 0.0
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CountryVisaConfigCreate(BaseModel):
    country_code: str
    country_name: str
    flag_emoji: str = ""
    country_enabled: bool = False
    
    tourist_enabled: bool = False
    tourist_30d_enabled: bool = False
    tourist_30d_govt_fee: float = 0.0
    tourist_1yr_enabled: bool = False
    tourist_1yr_govt_fee: float = 0.0
    tourist_5yr_enabled: bool = False
    tourist_5yr_govt_fee: float = 0.0
    
    business_enabled: bool = False
    business_govt_fee: float = 0.0
    
    medical_enabled: bool = False
    medical_govt_fee: float = 0.0
    
    transit_enabled: bool = False
    transit_govt_fee: float = 0.0
    
    payment_fee: float = 0.0
    processing_fee: float = 0.0

class CountryVisaConfigUpdate(BaseModel):
    country_enabled: Optional[bool] = None
    
    tourist_enabled: Optional[bool] = None
    tourist_30d_enabled: Optional[bool] = None
    tourist_30d_govt_fee: Optional[float] = None
    tourist_1yr_enabled: Optional[bool] = None
    tourist_1yr_govt_fee: Optional[float] = None
    tourist_5yr_enabled: Optional[bool] = None
    tourist_5yr_govt_fee: Optional[float] = None
    
    business_enabled: Optional[bool] = None
    business_govt_fee: Optional[float] = None
    
    medical_enabled: Optional[bool] = None
    medical_govt_fee: Optional[float] = None
    
    transit_enabled: Optional[bool] = None
    transit_govt_fee: Optional[float] = None
    
    payment_fee: Optional[float] = None
    processing_fee: Optional[float] = None

class VisaOptionResponse(BaseModel):
    id: str
    name: str
    visa_type: str  # tourist, business, medical, transit
    duration: str  # 30d, 1yr, 5yr (for tourist) or empty for others
    price: float
    govt_fee: float
    payment_fee: float
    processing_fee: float
    entries: str
    stay_duration: str
    validity: str
    purpose: str
    approval_days: int = 5
