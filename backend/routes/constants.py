from fastapi import APIRouter
from utils.constants import (
    PORTS_OF_ARRIVAL, 
    COUNTRIES, 
    RELIGIONS, 
    EDUCATIONAL_QUALIFICATIONS,
    TOURIST_SUBTYPES,
    BUSINESS_SUBTYPES,
    CONFERENCE_SUBTYPES,
    MEDICAL_ATTENDANT_SUBTYPES,
    TRANSIT_SUBTYPES,
    COUNTRY_PHONE_CODES
)

router = APIRouter()

@router.get("/api/constants/ports")
async def get_ports_of_arrival():
    """Get list of all ports of arrival in India"""
    return {"ports": PORTS_OF_ARRIVAL}

@router.get("/api/constants/countries")
async def get_countries():
    """Get list of all countries"""
    return {"countries": COUNTRIES}

@router.get("/api/constants/religions")
async def get_religions():
    """Get list of religions"""
    return {"religions": RELIGIONS}

@router.get("/api/constants/educational-qualifications")
async def get_educational_qualifications():
    """Get list of educational qualifications"""
    return {"qualifications": EDUCATIONAL_QUALIFICATIONS}

@router.get("/api/constants/visa-subtypes/{visa_type}")
async def get_visa_subtypes(visa_type: str):
    """Get visa service subtypes for a given visa type"""
    subtypes_map = {
        "tourist": TOURIST_SUBTYPES,
        "business": BUSINESS_SUBTYPES,
        "conference": CONFERENCE_SUBTYPES,
        "medical_attendant": MEDICAL_ATTENDANT_SUBTYPES,
        "transit": TRANSIT_SUBTYPES,
        "medical": []  # Medical visa has no subtypes
    }
    
    visa_type_lower = visa_type.lower().replace(" ", "_")
    subtypes = subtypes_map.get(visa_type_lower, [])
    
    return {"visa_type": visa_type, "subtypes": subtypes}

@router.get("/api/constants/phone-codes")
async def get_phone_codes():
    """Get list of country phone codes"""
    return {"phone_codes": COUNTRY_PHONE_CODES}

@router.get("/api/constants/all")
async def get_all_constants():
    """Get all constants in one call"""
    return {
        "ports": PORTS_OF_ARRIVAL,
        "countries": COUNTRIES,
        "religions": RELIGIONS,
        "qualifications": EDUCATIONAL_QUALIFICATIONS,
        "phone_codes": COUNTRY_PHONE_CODES,
        "visa_subtypes": {
            "tourist": TOURIST_SUBTYPES,
            "business": BUSINESS_SUBTYPES,
            "conference": CONFERENCE_SUBTYPES,
            "medical_attendant": MEDICAL_ATTENDANT_SUBTYPES,
            "transit": TRANSIT_SUBTYPES
        }
    }
