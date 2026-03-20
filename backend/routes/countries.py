from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional
import os
from datetime import datetime, timedelta
import uuid

from models.country_visa_config import (
    CountryVisaConfig,
    CountryVisaConfigCreate,
    CountryVisaConfigUpdate,
    VisaOptionResponse
)

router = APIRouter(prefix="/api/countries", tags=["countries"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'clear_evisa')]

# Complete list of countries with their ISO codes and flag emojis
ALL_COUNTRIES = [
    {"code": "AF", "name": "Afghanistan", "flag": "🇦🇫"},
    {"code": "AL", "name": "Albania", "flag": "🇦🇱"},
    {"code": "DZ", "name": "Algeria", "flag": "🇩🇿"},
    {"code": "AD", "name": "Andorra", "flag": "🇦🇩"},
    {"code": "AO", "name": "Angola", "flag": "🇦🇴"},
    {"code": "AG", "name": "Antigua and Barbuda", "flag": "🇦🇬"},
    {"code": "AR", "name": "Argentina", "flag": "🇦🇷"},
    {"code": "AM", "name": "Armenia", "flag": "🇦🇲"},
    {"code": "AU", "name": "Australia", "flag": "🇦🇺"},
    {"code": "AT", "name": "Austria", "flag": "🇦🇹"},
    {"code": "AZ", "name": "Azerbaijan", "flag": "🇦🇿"},
    {"code": "BS", "name": "Bahamas", "flag": "🇧🇸"},
    {"code": "BH", "name": "Bahrain", "flag": "🇧🇭"},
    {"code": "BD", "name": "Bangladesh", "flag": "🇧🇩"},
    {"code": "BB", "name": "Barbados", "flag": "🇧🇧"},
    {"code": "BY", "name": "Belarus", "flag": "🇧🇾"},
    {"code": "BE", "name": "Belgium", "flag": "🇧🇪"},
    {"code": "BZ", "name": "Belize", "flag": "🇧🇿"},
    {"code": "BJ", "name": "Benin", "flag": "🇧🇯"},
    {"code": "BT", "name": "Bhutan", "flag": "🇧🇹"},
    {"code": "BO", "name": "Bolivia", "flag": "🇧🇴"},
    {"code": "BA", "name": "Bosnia and Herzegovina", "flag": "🇧🇦"},
    {"code": "BW", "name": "Botswana", "flag": "🇧🇼"},
    {"code": "BR", "name": "Brazil", "flag": "🇧🇷"},
    {"code": "BN", "name": "Brunei", "flag": "🇧🇳"},
    {"code": "BG", "name": "Bulgaria", "flag": "🇧🇬"},
    {"code": "BF", "name": "Burkina Faso", "flag": "🇧🇫"},
    {"code": "BI", "name": "Burundi", "flag": "🇧🇮"},
    {"code": "CV", "name": "Cabo Verde", "flag": "🇨🇻"},
    {"code": "KH", "name": "Cambodia", "flag": "🇰🇭"},
    {"code": "CM", "name": "Cameroon", "flag": "🇨🇲"},
    {"code": "CA", "name": "Canada", "flag": "🇨🇦"},
    {"code": "CF", "name": "Central African Republic", "flag": "🇨🇫"},
    {"code": "TD", "name": "Chad", "flag": "🇹🇩"},
    {"code": "CL", "name": "Chile", "flag": "🇨🇱"},
    {"code": "CN", "name": "China", "flag": "🇨🇳"},
    {"code": "CO", "name": "Colombia", "flag": "🇨🇴"},
    {"code": "KM", "name": "Comoros", "flag": "🇰🇲"},
    {"code": "CG", "name": "Congo", "flag": "🇨🇬"},
    {"code": "CD", "name": "Congo (DRC)", "flag": "🇨🇩"},
    {"code": "CR", "name": "Costa Rica", "flag": "🇨🇷"},
    {"code": "HR", "name": "Croatia", "flag": "🇭🇷"},
    {"code": "CU", "name": "Cuba", "flag": "🇨🇺"},
    {"code": "CY", "name": "Cyprus", "flag": "🇨🇾"},
    {"code": "CZ", "name": "Czech Republic", "flag": "🇨🇿"},
    {"code": "DK", "name": "Denmark", "flag": "🇩🇰"},
    {"code": "DJ", "name": "Djibouti", "flag": "🇩🇯"},
    {"code": "DM", "name": "Dominica", "flag": "🇩🇲"},
    {"code": "DO", "name": "Dominican Republic", "flag": "🇩🇴"},
    {"code": "EC", "name": "Ecuador", "flag": "🇪🇨"},
    {"code": "EG", "name": "Egypt", "flag": "🇪🇬"},
    {"code": "SV", "name": "El Salvador", "flag": "🇸🇻"},
    {"code": "GQ", "name": "Equatorial Guinea", "flag": "🇬🇶"},
    {"code": "ER", "name": "Eritrea", "flag": "🇪🇷"},
    {"code": "EE", "name": "Estonia", "flag": "🇪🇪"},
    {"code": "SZ", "name": "Eswatini", "flag": "🇸🇿"},
    {"code": "ET", "name": "Ethiopia", "flag": "🇪🇹"},
    {"code": "FJ", "name": "Fiji", "flag": "🇫🇯"},
    {"code": "FI", "name": "Finland", "flag": "🇫🇮"},
    {"code": "FR", "name": "France", "flag": "🇫🇷"},
    {"code": "GA", "name": "Gabon", "flag": "🇬🇦"},
    {"code": "GM", "name": "Gambia", "flag": "🇬🇲"},
    {"code": "GE", "name": "Georgia", "flag": "🇬🇪"},
    {"code": "DE", "name": "Germany", "flag": "🇩🇪"},
    {"code": "GH", "name": "Ghana", "flag": "🇬🇭"},
    {"code": "GR", "name": "Greece", "flag": "🇬🇷"},
    {"code": "GD", "name": "Grenada", "flag": "🇬🇩"},
    {"code": "GT", "name": "Guatemala", "flag": "🇬🇹"},
    {"code": "GN", "name": "Guinea", "flag": "🇬🇳"},
    {"code": "GW", "name": "Guinea-Bissau", "flag": "🇬🇼"},
    {"code": "GY", "name": "Guyana", "flag": "🇬🇾"},
    {"code": "HT", "name": "Haiti", "flag": "🇭🇹"},
    {"code": "HN", "name": "Honduras", "flag": "🇭🇳"},
    {"code": "HU", "name": "Hungary", "flag": "🇭🇺"},
    {"code": "IS", "name": "Iceland", "flag": "🇮🇸"},
    {"code": "IN", "name": "India", "flag": "🇮🇳"},
    {"code": "ID", "name": "Indonesia", "flag": "🇮🇩"},
    {"code": "IR", "name": "Iran", "flag": "🇮🇷"},
    {"code": "IQ", "name": "Iraq", "flag": "🇮🇶"},
    {"code": "IE", "name": "Ireland", "flag": "🇮🇪"},
    {"code": "IL", "name": "Israel", "flag": "🇮🇱"},
    {"code": "IT", "name": "Italy", "flag": "🇮🇹"},
    {"code": "CI", "name": "Ivory Coast", "flag": "🇨🇮"},
    {"code": "JM", "name": "Jamaica", "flag": "🇯🇲"},
    {"code": "JP", "name": "Japan", "flag": "🇯🇵"},
    {"code": "JO", "name": "Jordan", "flag": "🇯🇴"},
    {"code": "KZ", "name": "Kazakhstan", "flag": "🇰🇿"},
    {"code": "KE", "name": "Kenya", "flag": "🇰🇪"},
    {"code": "KI", "name": "Kiribati", "flag": "🇰🇮"},
    {"code": "KP", "name": "North Korea", "flag": "🇰🇵"},
    {"code": "KR", "name": "South Korea", "flag": "🇰🇷"},
    {"code": "KW", "name": "Kuwait", "flag": "🇰🇼"},
    {"code": "KG", "name": "Kyrgyzstan", "flag": "🇰🇬"},
    {"code": "LA", "name": "Laos", "flag": "🇱🇦"},
    {"code": "LV", "name": "Latvia", "flag": "🇱🇻"},
    {"code": "LB", "name": "Lebanon", "flag": "🇱🇧"},
    {"code": "LS", "name": "Lesotho", "flag": "🇱🇸"},
    {"code": "LR", "name": "Liberia", "flag": "🇱🇷"},
    {"code": "LY", "name": "Libya", "flag": "🇱🇾"},
    {"code": "LI", "name": "Liechtenstein", "flag": "🇱🇮"},
    {"code": "LT", "name": "Lithuania", "flag": "🇱🇹"},
    {"code": "LU", "name": "Luxembourg", "flag": "🇱🇺"},
    {"code": "MG", "name": "Madagascar", "flag": "🇲🇬"},
    {"code": "MW", "name": "Malawi", "flag": "🇲🇼"},
    {"code": "MY", "name": "Malaysia", "flag": "🇲🇾"},
    {"code": "MV", "name": "Maldives", "flag": "🇲🇻"},
    {"code": "ML", "name": "Mali", "flag": "🇲🇱"},
    {"code": "MT", "name": "Malta", "flag": "🇲🇹"},
    {"code": "MH", "name": "Marshall Islands", "flag": "🇲🇭"},
    {"code": "MR", "name": "Mauritania", "flag": "🇲🇷"},
    {"code": "MU", "name": "Mauritius", "flag": "🇲🇺"},
    {"code": "MX", "name": "Mexico", "flag": "🇲🇽"},
    {"code": "FM", "name": "Micronesia", "flag": "🇫🇲"},
    {"code": "MD", "name": "Moldova", "flag": "🇲🇩"},
    {"code": "MC", "name": "Monaco", "flag": "🇲🇨"},
    {"code": "MN", "name": "Mongolia", "flag": "🇲🇳"},
    {"code": "ME", "name": "Montenegro", "flag": "🇲🇪"},
    {"code": "MA", "name": "Morocco", "flag": "🇲🇦"},
    {"code": "MZ", "name": "Mozambique", "flag": "🇲🇿"},
    {"code": "MM", "name": "Myanmar", "flag": "🇲🇲"},
    {"code": "NA", "name": "Namibia", "flag": "🇳🇦"},
    {"code": "NR", "name": "Nauru", "flag": "🇳🇷"},
    {"code": "NP", "name": "Nepal", "flag": "🇳🇵"},
    {"code": "NL", "name": "Netherlands", "flag": "🇳🇱"},
    {"code": "NZ", "name": "New Zealand", "flag": "🇳🇿"},
    {"code": "NI", "name": "Nicaragua", "flag": "🇳🇮"},
    {"code": "NE", "name": "Niger", "flag": "🇳🇪"},
    {"code": "NG", "name": "Nigeria", "flag": "🇳🇬"},
    {"code": "MK", "name": "North Macedonia", "flag": "🇲🇰"},
    {"code": "NO", "name": "Norway", "flag": "🇳🇴"},
    {"code": "OM", "name": "Oman", "flag": "🇴🇲"},
    {"code": "PK", "name": "Pakistan", "flag": "🇵🇰"},
    {"code": "PW", "name": "Palau", "flag": "🇵🇼"},
    {"code": "PS", "name": "Palestine", "flag": "🇵🇸"},
    {"code": "PA", "name": "Panama", "flag": "🇵🇦"},
    {"code": "PG", "name": "Papua New Guinea", "flag": "🇵🇬"},
    {"code": "PY", "name": "Paraguay", "flag": "🇵🇾"},
    {"code": "PE", "name": "Peru", "flag": "🇵🇪"},
    {"code": "PH", "name": "Philippines", "flag": "🇵🇭"},
    {"code": "PL", "name": "Poland", "flag": "🇵🇱"},
    {"code": "PT", "name": "Portugal", "flag": "🇵🇹"},
    {"code": "QA", "name": "Qatar", "flag": "🇶🇦"},
    {"code": "RO", "name": "Romania", "flag": "🇷🇴"},
    {"code": "RU", "name": "Russia", "flag": "🇷🇺"},
    {"code": "RW", "name": "Rwanda", "flag": "🇷🇼"},
    {"code": "KN", "name": "Saint Kitts and Nevis", "flag": "🇰🇳"},
    {"code": "LC", "name": "Saint Lucia", "flag": "🇱🇨"},
    {"code": "VC", "name": "Saint Vincent and the Grenadines", "flag": "🇻🇨"},
    {"code": "WS", "name": "Samoa", "flag": "🇼🇸"},
    {"code": "SM", "name": "San Marino", "flag": "🇸🇲"},
    {"code": "ST", "name": "Sao Tome and Principe", "flag": "🇸🇹"},
    {"code": "SA", "name": "Saudi Arabia", "flag": "🇸🇦"},
    {"code": "SN", "name": "Senegal", "flag": "🇸🇳"},
    {"code": "RS", "name": "Serbia", "flag": "🇷🇸"},
    {"code": "SC", "name": "Seychelles", "flag": "🇸🇨"},
    {"code": "SL", "name": "Sierra Leone", "flag": "🇸🇱"},
    {"code": "SG", "name": "Singapore", "flag": "🇸🇬"},
    {"code": "SK", "name": "Slovakia", "flag": "🇸🇰"},
    {"code": "SI", "name": "Slovenia", "flag": "🇸🇮"},
    {"code": "SB", "name": "Solomon Islands", "flag": "🇸🇧"},
    {"code": "SO", "name": "Somalia", "flag": "🇸🇴"},
    {"code": "ZA", "name": "South Africa", "flag": "🇿🇦"},
    {"code": "SS", "name": "South Sudan", "flag": "🇸🇸"},
    {"code": "ES", "name": "Spain", "flag": "🇪🇸"},
    {"code": "LK", "name": "Sri Lanka", "flag": "🇱🇰"},
    {"code": "SD", "name": "Sudan", "flag": "🇸🇩"},
    {"code": "SR", "name": "Suriname", "flag": "🇸🇷"},
    {"code": "SE", "name": "Sweden", "flag": "🇸🇪"},
    {"code": "CH", "name": "Switzerland", "flag": "🇨🇭"},
    {"code": "SY", "name": "Syria", "flag": "🇸🇾"},
    {"code": "TW", "name": "Taiwan", "flag": "🇹🇼"},
    {"code": "TJ", "name": "Tajikistan", "flag": "🇹🇯"},
    {"code": "TZ", "name": "Tanzania", "flag": "🇹🇿"},
    {"code": "TH", "name": "Thailand", "flag": "🇹🇭"},
    {"code": "TL", "name": "Timor-Leste", "flag": "🇹🇱"},
    {"code": "TG", "name": "Togo", "flag": "🇹🇬"},
    {"code": "TO", "name": "Tonga", "flag": "🇹🇴"},
    {"code": "TT", "name": "Trinidad and Tobago", "flag": "🇹🇹"},
    {"code": "TN", "name": "Tunisia", "flag": "🇹🇳"},
    {"code": "TR", "name": "Turkey", "flag": "🇹🇷"},
    {"code": "TM", "name": "Turkmenistan", "flag": "🇹🇲"},
    {"code": "TV", "name": "Tuvalu", "flag": "🇹🇻"},
    {"code": "UG", "name": "Uganda", "flag": "🇺🇬"},
    {"code": "UA", "name": "Ukraine", "flag": "🇺🇦"},
    {"code": "AE", "name": "United Arab Emirates", "flag": "🇦🇪"},
    {"code": "GB", "name": "United Kingdom", "flag": "🇬🇧"},
    {"code": "US", "name": "United States", "flag": "🇺🇸"},
    {"code": "UY", "name": "Uruguay", "flag": "🇺🇾"},
    {"code": "UZ", "name": "Uzbekistan", "flag": "🇺🇿"},
    {"code": "VU", "name": "Vanuatu", "flag": "🇻🇺"},
    {"code": "VA", "name": "Vatican City", "flag": "🇻🇦"},
    {"code": "VE", "name": "Venezuela", "flag": "🇻🇪"},
    {"code": "VN", "name": "Vietnam", "flag": "🇻🇳"},
    {"code": "YE", "name": "Yemen", "flag": "🇾🇪"},
    {"code": "ZM", "name": "Zambia", "flag": "🇿🇲"},
    {"code": "ZW", "name": "Zimbabwe", "flag": "🇿🇼"},
]


@router.get("/all")
async def get_all_countries():
    """Get all countries (for admin management)"""
    # Get all configurations from database
    configs = await db.country_visa_configs.find().to_list(length=300)
    config_dict = {c['country_code']: c for c in configs}
    
    result = []
    for country in ALL_COUNTRIES:
        if country['code'] in config_dict:
            config = config_dict[country['code']]
            result.append({
                **config,
                '_id': str(config.get('_id', ''))
            })
        else:
            # Return default config for this country
            result.append({
                'id': '',
                'country_code': country['code'],
                'country_name': country['name'],
                'flag_emoji': country['flag'],
                'country_enabled': False,
                'tourist_enabled': False,
                'tourist_30d_enabled': False,
                'tourist_30d_govt_fee': 0.0,
                'tourist_30d_our_fee': 0.0,
                'tourist_1yr_enabled': False,
                'tourist_1yr_govt_fee': 0.0,
                'tourist_1yr_our_fee': 0.0,
                'tourist_5yr_enabled': False,
                'tourist_5yr_govt_fee': 0.0,
                'tourist_5yr_our_fee': 0.0,
                'business_enabled': False,
                'business_govt_fee': 0.0,
                'business_our_fee': 0.0,
                'conference_enabled': False,
                'conference_govt_fee': 0.0,
                'conference_our_fee': 0.0,
                'medical_enabled': False,
                'medical_govt_fee': 0.0,
                'medical_our_fee': 0.0,
                'medical_attendant_enabled': False,
                'medical_attendant_govt_fee': 0.0,
                'medical_attendant_our_fee': 0.0,
                'transit_enabled': False,
                'transit_govt_fee': 0.0,
                'transit_our_fee': 0.0,
            })
    
    return result


@router.get("/enabled")
async def get_enabled_countries():
    """Get only enabled countries (for public dropdown)"""
    configs = await db.country_visa_configs.find({'country_enabled': True}).to_list(length=300)
    result = []
    for config in configs:
        result.append({
            'code': config['country_code'],
            'name': config['country_name'],
            'flag': config.get('flag_emoji', '')
        })
    return sorted(result, key=lambda x: x['name'])


@router.get("/{country_code}/visa-options")
async def get_visa_options(country_code: str, purpose: str = None):
    """Get visa options for a specific country"""
    config = await db.country_visa_configs.find_one({'country_code': country_code.upper()})
    
    if not config or not config.get('country_enabled', False):
        return {
            'has_evisa_options': False,
            'country_name': next((c['name'] for c in ALL_COUNTRIES if c['code'] == country_code.upper()), country_code),
            'options': [],
            'message': 'No eVisa options available. Please apply through embassy or consulate.'
        }
    
    options = []
    
    # Calculate approval date (today + 5 days)
    approval_date = (datetime.utcnow() + timedelta(days=5)).strftime('%B %d')
    
    # Helper function to calculate fees
    def calculate_total(govt_fee, our_fee):
        processing_fee = govt_fee * 0.025  # 2.5% of govt fee
        return govt_fee + our_fee + processing_fee, processing_fee
    
    # Filter by purpose if specified
    if purpose is None or purpose.lower() == 'tourist':
        if config.get('tourist_enabled', False):
            if config.get('tourist_30d_enabled', False):
                govt_fee = config.get('tourist_30d_govt_fee', 0)
                our_fee = config.get('tourist_30d_our_fee', 0)
                total_price, processing_fee = calculate_total(govt_fee, our_fee)
                options.append({
                    'id': f"{country_code.lower()}-tourist-30d",
                    'name': '30 day Indian Tourist eVisa',
                    'visa_type': 'tourist',
                    'duration': '30d',
                    'price': round(total_price, 2),
                    'govt_fee': govt_fee,
                    'our_fee': our_fee,
                    'processing_fee': round(processing_fee, 2),
                    'entries': 'Double',
                    'stay_duration': '30 days',
                    'validity': '120 days',
                    'purpose': 'Tourism',
                    'approved_by': approval_date,
                    'approval_days': 5
                })
            
            if config.get('tourist_1yr_enabled', False):
                govt_fee = config.get('tourist_1yr_govt_fee', 0)
                our_fee = config.get('tourist_1yr_our_fee', 0)
                total_price, processing_fee = calculate_total(govt_fee, our_fee)
                options.append({
                    'id': f"{country_code.lower()}-tourist-1yr",
                    'name': '1 year Indian Tourist eVisa',
                    'visa_type': 'tourist',
                    'duration': '1yr',
                    'price': round(total_price, 2),
                    'govt_fee': govt_fee,
                    'our_fee': our_fee,
                    'processing_fee': round(processing_fee, 2),
                    'entries': 'Multiple',
                    'stay_duration': '90 days per visit',
                    'validity': '1 year',
                    'purpose': 'Tourism',
                    'approved_by': approval_date,
                    'approval_days': 5
                })
            
            if config.get('tourist_5yr_enabled', False):
                govt_fee = config.get('tourist_5yr_govt_fee', 0)
                our_fee = config.get('tourist_5yr_our_fee', 0)
                total_price, processing_fee = calculate_total(govt_fee, our_fee)
                options.append({
                    'id': f"{country_code.lower()}-tourist-5yr",
                    'name': '5 year Indian Tourist eVisa',
                    'visa_type': 'tourist',
                    'duration': '5yr',
                    'price': round(total_price, 2),
                    'govt_fee': govt_fee,
                    'our_fee': our_fee,
                    'processing_fee': round(processing_fee, 2),
                    'entries': 'Multiple',
                    'stay_duration': '90 days per visit',
                    'validity': '5 years',
                    'purpose': 'Tourism',
                    'approved_by': approval_date,
                    'approval_days': 5
                })
    
    if purpose is None or purpose.lower() == 'business':
        if config.get('business_enabled', False):
            govt_fee = config.get('business_govt_fee', 0)
            our_fee = config.get('business_our_fee', 0)
            total_price, processing_fee = calculate_total(govt_fee, our_fee)
            options.append({
                'id': f"{country_code.lower()}-business",
                'name': '1 year Indian Business eVisa',
                'visa_type': 'business',
                'duration': '1yr',
                'price': round(total_price, 2),
                'govt_fee': govt_fee,
                'our_fee': our_fee,
                'processing_fee': round(processing_fee, 2),
                'entries': 'Multiple',
                'stay_duration': '180 days per visit',
                'validity': '1 year',
                'purpose': 'Business',
                'approved_by': approval_date,
                'approval_days': 5
            })
    
    if purpose is None or purpose.lower() == 'medical':
        if config.get('medical_enabled', False):
            govt_fee = config.get('medical_govt_fee', 0)
            our_fee = config.get('medical_our_fee', 0)
            total_price, processing_fee = calculate_total(govt_fee, our_fee)
            options.append({
                'id': f"{country_code.lower()}-medical",
                'name': 'Indian Medical eVisa',
                'visa_type': 'medical',
                'duration': '60d',
                'price': round(total_price, 2),
                'govt_fee': govt_fee,
                'our_fee': our_fee,
                'processing_fee': round(processing_fee, 2),
                'entries': 'Triple',
                'stay_duration': '60 days',
                'validity': '60 days',
                'purpose': 'Medical',
                'approved_by': approval_date,
                'approval_days': 5
            })
    
    if purpose is None or purpose.lower() == 'transit':
        if config.get('transit_enabled', False):
            govt_fee = config.get('transit_govt_fee', 0)
            our_fee = config.get('transit_our_fee', 0)
            total_price, processing_fee = calculate_total(govt_fee, our_fee)
            options.append({
                'id': f"{country_code.lower()}-transit",
                'name': 'Indian Transit eVisa',
                'visa_type': 'transit',
                'duration': '4d',
                'price': round(total_price, 2),
                'govt_fee': govt_fee,
                'our_fee': our_fee,
                'processing_fee': round(processing_fee, 2),
                'entries': 'Double',
                'stay_duration': '4 days',
                'validity': '15 days',
                'purpose': 'Transit',
                'approved_by': approval_date,
                'approval_days': 5
            })
    
    if purpose is None or purpose.lower() == 'conference':
        if config.get('conference_enabled', False):
            govt_fee = config.get('conference_govt_fee', 0)
            our_fee = config.get('conference_our_fee', 0)
            total_price, processing_fee = calculate_total(govt_fee, our_fee)
            options.append({
                'id': f"{country_code.lower()}-conference",
                'name': 'Indian Conference eVisa',
                'visa_type': 'conference',
                'duration': '120d',
                'price': round(total_price, 2),
                'govt_fee': govt_fee,
                'our_fee': our_fee,
                'processing_fee': round(processing_fee, 2),
                'entries': 'Single',
                'stay_duration': '120 days',
                'validity': '120 days',
                'purpose': 'Conference',
                'approved_by': approval_date,
                'approval_days': 5
            })
    
    if purpose is None or purpose.lower() == 'medical_attendant':
        if config.get('medical_attendant_enabled', False):
            govt_fee = config.get('medical_attendant_govt_fee', 0)
            our_fee = config.get('medical_attendant_our_fee', 0)
            total_price, processing_fee = calculate_total(govt_fee, our_fee)
            options.append({
                'id': f"{country_code.lower()}-medical-attendant",
                'name': 'Indian Medical Attendant eVisa',
                'visa_type': 'medical_attendant',
                'duration': '60d',
                'price': round(total_price, 2),
                'govt_fee': govt_fee,
                'our_fee': our_fee,
                'processing_fee': round(processing_fee, 2),
                'entries': 'Triple',
                'stay_duration': '60 days',
                'validity': '60 days',
                'purpose': 'Medical Attendant',
                'approved_by': approval_date,
                'approval_days': 5
            })
    
    return {
        'has_evisa_options': len(options) > 0,
        'country_name': config.get('country_name', ''),
        'options': options
    }
    
    if purpose is None or purpose.lower() == 'medical_attendant':
        if config.get('medical_attendant_enabled', False):
            govt_fee = config.get('medical_attendant_govt_fee', 0)
            total_price = govt_fee + payment_fee + processing_fee
            options.append({
                'id': f"{country_code.lower()}-medical-attendant",
                'name': 'Indian Medical Attendant eVisa',
                'visa_type': 'medical_attendant',
                'duration': '60d',
                'price': round(total_price, 2),
                'govt_fee': govt_fee,
                'payment_fee': payment_fee,
                'processing_fee': processing_fee,
                'entries': 'Triple',
                'stay_duration': '60 days',
                'validity': '60 days',
                'purpose': 'Medical Attendant',
                'approved_by': approval_date,
                'approval_days': 5
            })
    
    return {
        'has_evisa_options': len(options) > 0,
        'country_name': config.get('country_name', ''),
        'options': options
    }


@router.get("/{country_code}/purposes")
async def get_enabled_purposes(country_code: str):
    """Get enabled visa purposes for a specific country"""
    config = await db.country_visa_configs.find_one({'country_code': country_code.upper()})
    
    if not config or not config.get('country_enabled', False):
        return {'purposes': []}
    
    purposes = []
    if config.get('tourist_enabled', False):
        purposes.append({'value': 'tourist', 'label': 'Tourism'})
    if config.get('business_enabled', False):
        purposes.append({'value': 'business', 'label': 'Business'})
    if config.get('conference_enabled', False):
        purposes.append({'value': 'conference', 'label': 'Conference'})
    if config.get('medical_enabled', False):
        purposes.append({'value': 'medical', 'label': 'Medical'})
    if config.get('medical_attendant_enabled', False):
        purposes.append({'value': 'medical_attendant', 'label': 'Medical Attendant'})
    if config.get('transit_enabled', False):
        purposes.append({'value': 'transit', 'label': 'Transit'})
    
    return {'purposes': purposes}


@router.put("/{country_code}")
async def update_country_config(country_code: str, config_update: CountryVisaConfigUpdate):
    """Update country visa configuration (Admin only)"""
    existing = await db.country_visa_configs.find_one({'country_code': country_code.upper()})
    
    update_data = {k: v for k, v in config_update.dict().items() if v is not None}
    update_data['updated_at'] = datetime.utcnow()
    
    if existing:
        await db.country_visa_configs.update_one(
            {'country_code': country_code.upper()},
            {'$set': update_data}
        )
    else:
        # Get country info from ALL_COUNTRIES
        country_info = next((c for c in ALL_COUNTRIES if c['code'] == country_code.upper()), None)
        if not country_info:
            raise HTTPException(status_code=404, detail="Country not found")
        
        new_config = {
            'id': str(uuid.uuid4()),
            'country_code': country_code.upper(),
            'country_name': country_info['name'],
            'flag_emoji': country_info['flag'],
            'country_enabled': False,
            'tourist_enabled': False,
            'tourist_30d_enabled': False,
            'tourist_30d_govt_fee': 0.0,
            'tourist_30d_our_fee': 0.0,
            'tourist_1yr_enabled': False,
            'tourist_1yr_govt_fee': 0.0,
            'tourist_1yr_our_fee': 0.0,
            'tourist_5yr_enabled': False,
            'tourist_5yr_govt_fee': 0.0,
            'tourist_5yr_our_fee': 0.0,
            'business_enabled': False,
            'business_govt_fee': 0.0,
            'business_our_fee': 0.0,
            'conference_enabled': False,
            'conference_govt_fee': 0.0,
            'conference_our_fee': 0.0,
            'medical_enabled': False,
            'medical_govt_fee': 0.0,
            'medical_our_fee': 0.0,
            'medical_attendant_enabled': False,
            'medical_attendant_govt_fee': 0.0,
            'medical_attendant_our_fee': 0.0,
            'transit_enabled': False,
            'transit_govt_fee': 0.0,
            'transit_our_fee': 0.0,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            **update_data
        }
        await db.country_visa_configs.insert_one(new_config)
    
    return {"status": "success", "message": f"Configuration for {country_code} updated"}


@router.post("/seed")
async def seed_sample_countries():
    """Seed sample country configurations for testing"""
    # Check if already seeded
    count = await db.country_visa_configs.count_documents({})
    if count > 0:
        return {"status": "already_seeded", "count": count}
    
    # Sample configurations for a few countries
    sample_configs = [
        {
            'id': str(uuid.uuid4()),
            'country_code': 'US',
            'country_name': 'United States',
            'flag_emoji': '🇺🇸',
            'country_enabled': True,
            'tourist_enabled': True,
            'tourist_30d_enabled': True,
            'tourist_30d_govt_fee': 25.00,
            'tourist_1yr_enabled': True,
            'tourist_1yr_govt_fee': 40.00,
            'tourist_5yr_enabled': True,
            'tourist_5yr_govt_fee': 80.00,
            'business_enabled': True,
            'business_govt_fee': 80.00,
            'medical_enabled': True,
            'medical_govt_fee': 25.00,
            'transit_enabled': False,
            'transit_govt_fee': 0.0,
            'payment_fee': 2.62,
            'processing_fee': 45.00,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
        },
        {
            'id': str(uuid.uuid4()),
            'country_code': 'GB',
            'country_name': 'United Kingdom',
            'flag_emoji': '🇬🇧',
            'country_enabled': True,
            'tourist_enabled': True,
            'tourist_30d_enabled': True,
            'tourist_30d_govt_fee': 25.00,
            'tourist_1yr_enabled': True,
            'tourist_1yr_govt_fee': 40.00,
            'tourist_5yr_enabled': True,
            'tourist_5yr_govt_fee': 80.00,
            'business_enabled': True,
            'business_govt_fee': 80.00,
            'medical_enabled': False,
            'medical_govt_fee': 0.0,
            'transit_enabled': False,
            'transit_govt_fee': 0.0,
            'payment_fee': 2.62,
            'processing_fee': 45.00,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
        },
        {
            'id': str(uuid.uuid4()),
            'country_code': 'BE',
            'country_name': 'Belgium',
            'flag_emoji': '🇧🇪',
            'country_enabled': True,
            'tourist_enabled': True,
            'tourist_30d_enabled': True,
            'tourist_30d_govt_fee': 25.00,
            'tourist_1yr_enabled': True,
            'tourist_1yr_govt_fee': 40.00,
            'tourist_5yr_enabled': False,
            'tourist_5yr_govt_fee': 0.0,
            'business_enabled': False,
            'business_govt_fee': 0.0,
            'medical_enabled': False,
            'medical_govt_fee': 0.0,
            'transit_enabled': False,
            'transit_govt_fee': 0.0,
            'payment_fee': 2.62,
            'processing_fee': 45.00,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
        },
        {
            'id': str(uuid.uuid4()),
            'country_code': 'CA',
            'country_name': 'Canada',
            'flag_emoji': '🇨🇦',
            'country_enabled': True,
            'tourist_enabled': True,
            'tourist_30d_enabled': True,
            'tourist_30d_govt_fee': 25.00,
            'tourist_1yr_enabled': True,
            'tourist_1yr_govt_fee': 40.00,
            'tourist_5yr_enabled': True,
            'tourist_5yr_govt_fee': 80.00,
            'business_enabled': True,
            'business_govt_fee': 80.00,
            'medical_enabled': True,
            'medical_govt_fee': 25.00,
            'transit_enabled': True,
            'transit_govt_fee': 25.00,
            'payment_fee': 2.62,
            'processing_fee': 45.00,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
        },
    ]
    
    await db.country_visa_configs.insert_many(sample_configs)
    return {"status": "success", "seeded": len(sample_configs)}
