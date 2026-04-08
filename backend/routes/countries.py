from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
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
    {"code": "AF", "name": "Afghanistan", "flag": "🇦🇫", "demonym": "Afghan"},
    {"code": "AL", "name": "Albania", "flag": "🇦🇱", "demonym": "Albanian"},
    {"code": "DZ", "name": "Algeria", "flag": "🇩🇿", "demonym": "Algerian"},
    {"code": "AD", "name": "Andorra", "flag": "🇦🇩", "demonym": "Andorran"},
    {"code": "AO", "name": "Angola", "flag": "🇦🇴", "demonym": "Angolan"},
    {"code": "AI", "name": "Anguilla", "flag": "🇦🇮", "demonym": "Anguillan"},
    {"code": "AG", "name": "Antigua and Barbuda", "flag": "🇦🇬", "demonym": "Antiguan"},
    {"code": "AR", "name": "Argentina", "flag": "🇦🇷", "demonym": "Argentine"},
    {"code": "AM", "name": "Armenia", "flag": "🇦🇲", "demonym": "Armenian"},
    {"code": "AW", "name": "Aruba", "flag": "🇦🇼", "demonym": "Aruban"},
    {"code": "AU", "name": "Australia", "flag": "🇦🇺", "demonym": "Australian"},
    {"code": "AT", "name": "Austria", "flag": "🇦🇹", "demonym": "Austrian"},
    {"code": "AZ", "name": "Azerbaijan", "flag": "🇦🇿", "demonym": "Azerbaijani"},
    {"code": "BS", "name": "Bahamas", "flag": "🇧🇸", "demonym": "Bahamian"},
    {"code": "BH", "name": "Bahrain", "flag": "🇧🇭", "demonym": "Bahraini"},
    {"code": "BD", "name": "Bangladesh", "flag": "🇧🇩", "demonym": "Bangladeshi"},
    {"code": "BB", "name": "Barbados", "flag": "🇧🇧", "demonym": "Barbadian"},
    {"code": "BY", "name": "Belarus", "flag": "🇧🇾", "demonym": "Belarusian"},
    {"code": "BE", "name": "Belgium", "flag": "🇧🇪", "demonym": "Belgian"},
    {"code": "BZ", "name": "Belize", "flag": "🇧🇿", "demonym": "Belizean"},
    {"code": "BJ", "name": "Benin", "flag": "🇧🇯", "demonym": "Beninese"},
    {"code": "BT", "name": "Bhutan", "flag": "🇧🇹", "demonym": "Bhutanese"},
    {"code": "BO", "name": "Bolivia", "flag": "🇧🇴", "demonym": "Bolivian"},
    {"code": "BA", "name": "Bosnia and Herzegovina", "flag": "🇧🇦", "demonym": "Bosnian"},
    {"code": "BW", "name": "Botswana", "flag": "🇧🇼", "demonym": "Botswanan"},
    {"code": "BR", "name": "Brazil", "flag": "🇧🇷", "demonym": "Brazilian"},
    {"code": "BN", "name": "Brunei", "flag": "🇧🇳", "demonym": "Bruneian"},
    {"code": "BG", "name": "Bulgaria", "flag": "🇧🇬", "demonym": "Bulgarian"},
    {"code": "BF", "name": "Burkina Faso", "flag": "🇧🇫", "demonym": "Burkinabé"},
    {"code": "BI", "name": "Burundi", "flag": "🇧🇮", "demonym": "Burundian"},
    {"code": "CV", "name": "Cabo Verde", "flag": "🇨🇻", "demonym": "Cape Verdean"},
    {"code": "KH", "name": "Cambodia", "flag": "🇰🇭", "demonym": "Cambodian"},
    {"code": "CM", "name": "Cameroon", "flag": "🇨🇲", "demonym": "Cameroonian"},
    {"code": "CA", "name": "Canada", "flag": "🇨🇦", "demonym": "Canadian"},
    {"code": "CF", "name": "Central African Republic", "flag": "🇨🇫", "demonym": "Central African"},
    {"code": "TD", "name": "Chad", "flag": "🇹🇩", "demonym": "Chadian"},
    {"code": "KY", "name": "Cayman Islands", "flag": "🇰🇾", "demonym": "Caymanian"},
    {"code": "CL", "name": "Chile", "flag": "🇨🇱", "demonym": "Chilean"},
    {"code": "CN", "name": "China", "flag": "🇨🇳", "demonym": "Chinese"},
    {"code": "CO", "name": "Colombia", "flag": "🇨🇴", "demonym": "Colombian"},
    {"code": "KM", "name": "Comoros", "flag": "🇰🇲", "demonym": "Comorian"},
    {"code": "CG", "name": "Congo", "flag": "🇨🇬", "demonym": "Congolese"},
    {"code": "CD", "name": "Congo (DRC)", "flag": "🇨🇩", "demonym": "Congolese"},
    {"code": "CK", "name": "Cook Islands", "flag": "🇨🇰", "demonym": "Cook Islander"},
    {"code": "CR", "name": "Costa Rica", "flag": "🇨🇷", "demonym": "Costa Rican"},
    {"code": "HR", "name": "Croatia", "flag": "🇭🇷", "demonym": "Croatian"},
    {"code": "CU", "name": "Cuba", "flag": "🇨🇺", "demonym": "Cuban"},
    {"code": "CY", "name": "Cyprus", "flag": "🇨🇾", "demonym": "Cypriot"},
    {"code": "CZ", "name": "Czech Republic", "flag": "🇨🇿", "demonym": "Czech"},
    {"code": "DK", "name": "Denmark", "flag": "🇩🇰", "demonym": "Danish"},
    {"code": "DJ", "name": "Djibouti", "flag": "🇩🇯", "demonym": "Djiboutian"},
    {"code": "DM", "name": "Dominica", "flag": "🇩🇲", "demonym": "Dominican"},
    {"code": "DO", "name": "Dominican Republic", "flag": "🇩🇴", "demonym": "Dominican"},
    {"code": "EC", "name": "Ecuador", "flag": "🇪🇨", "demonym": "Ecuadorian"},
    {"code": "EG", "name": "Egypt", "flag": "🇪🇬", "demonym": "Egyptian"},
    {"code": "SV", "name": "El Salvador", "flag": "🇸🇻", "demonym": "Salvadoran"},
    {"code": "GQ", "name": "Equatorial Guinea", "flag": "🇬🇶", "demonym": "Equatorial Guinean"},
    {"code": "ER", "name": "Eritrea", "flag": "🇪🇷", "demonym": "Eritrean"},
    {"code": "EE", "name": "Estonia", "flag": "🇪🇪", "demonym": "Estonian"},
    {"code": "SZ", "name": "Eswatini", "flag": "🇸🇿", "demonym": "Swazi"},
    {"code": "ET", "name": "Ethiopia", "flag": "🇪🇹", "demonym": "Ethiopian"},
    {"code": "FJ", "name": "Fiji", "flag": "🇫🇯", "demonym": "Fijian"},
    {"code": "FI", "name": "Finland", "flag": "🇫🇮", "demonym": "Finnish"},
    {"code": "FR", "name": "France", "flag": "🇫🇷", "demonym": "French"},
    {"code": "GA", "name": "Gabon", "flag": "🇬🇦", "demonym": "Gabonese"},
    {"code": "GM", "name": "Gambia", "flag": "🇬🇲", "demonym": "Gambian"},
    {"code": "GE", "name": "Georgia", "flag": "🇬🇪", "demonym": "Georgian"},
    {"code": "DE", "name": "Germany", "flag": "🇩🇪", "demonym": "German"},
    {"code": "GH", "name": "Ghana", "flag": "🇬🇭", "demonym": "Ghanaian"},
    {"code": "GI", "name": "Gibraltar", "flag": "🇬🇮", "demonym": "Gibraltarian"},
    {"code": "GR", "name": "Greece", "flag": "🇬🇷", "demonym": "Greek"},
    {"code": "GD", "name": "Grenada", "flag": "🇬🇩", "demonym": "Grenadian"},
    {"code": "GT", "name": "Guatemala", "flag": "🇬🇹", "demonym": "Guatemalan"},
    {"code": "GG", "name": "Guernsey", "flag": "🇬🇬", "demonym": "from Guernsey"},
    {"code": "GN", "name": "Guinea", "flag": "🇬🇳", "demonym": "Guinean"},
    {"code": "GW", "name": "Guinea-Bissau", "flag": "🇬🇼", "demonym": "Bissau-Guinean"},
    {"code": "GY", "name": "Guyana", "flag": "🇬🇾", "demonym": "Guyanese"},
    {"code": "HT", "name": "Haiti", "flag": "🇭🇹", "demonym": "Haitian"},
    {"code": "HN", "name": "Honduras", "flag": "🇭🇳", "demonym": "Honduran"},
    {"code": "HU", "name": "Hungary", "flag": "🇭🇺", "demonym": "Hungarian"},
    {"code": "IS", "name": "Iceland", "flag": "🇮🇸", "demonym": "Icelandic"},
    {"code": "IN", "name": "India", "flag": "🇮🇳", "demonym": "Indian"},
    {"code": "ID", "name": "Indonesia", "flag": "🇮🇩", "demonym": "Indonesian"},
    {"code": "IR", "name": "Iran", "flag": "🇮🇷", "demonym": "Iranian"},
    {"code": "IQ", "name": "Iraq", "flag": "🇮🇶", "demonym": "Iraqi"},
    {"code": "IE", "name": "Ireland", "flag": "🇮🇪", "demonym": "Irish"},
    {"code": "IM", "name": "Isle of Man", "flag": "🇮🇲", "demonym": "Manx"},
    {"code": "IL", "name": "Israel", "flag": "🇮🇱", "demonym": "Israeli"},
    {"code": "IT", "name": "Italy", "flag": "🇮🇹", "demonym": "Italian"},
    {"code": "CI", "name": "Ivory Coast", "flag": "🇨🇮", "demonym": "Ivorian"},
    {"code": "JM", "name": "Jamaica", "flag": "🇯🇲", "demonym": "Jamaican"},
    {"code": "JP", "name": "Japan", "flag": "🇯🇵", "demonym": "Japanese"},
    {"code": "JE", "name": "Jersey", "flag": "🇯🇪", "demonym": "from Jersey"},
    {"code": "JO", "name": "Jordan", "flag": "🇯🇴", "demonym": "Jordanian"},
    {"code": "KZ", "name": "Kazakhstan", "flag": "🇰🇿", "demonym": "Kazakhstani"},
    {"code": "KE", "name": "Kenya", "flag": "🇰🇪", "demonym": "Kenyan"},
    {"code": "KI", "name": "Kiribati", "flag": "🇰🇮", "demonym": "I-Kiribati"},
    {"code": "KP", "name": "North Korea", "flag": "🇰🇵", "demonym": "North Korean"},
    {"code": "KR", "name": "South Korea", "flag": "🇰🇷", "demonym": "South Korean"},
    {"code": "KW", "name": "Kuwait", "flag": "🇰🇼", "demonym": "Kuwaiti"},
    {"code": "KG", "name": "Kyrgyzstan", "flag": "🇰🇬", "demonym": "Kyrgyz"},
    {"code": "LA", "name": "Laos", "flag": "🇱🇦", "demonym": "Laotian"},
    {"code": "LV", "name": "Latvia", "flag": "🇱🇻", "demonym": "Latvian"},
    {"code": "LB", "name": "Lebanon", "flag": "🇱🇧", "demonym": "Lebanese"},
    {"code": "LS", "name": "Lesotho", "flag": "🇱🇸", "demonym": "Basotho"},
    {"code": "LR", "name": "Liberia", "flag": "🇱🇷", "demonym": "Liberian"},
    {"code": "LY", "name": "Libya", "flag": "🇱🇾", "demonym": "Libyan"},
    {"code": "LI", "name": "Liechtenstein", "flag": "🇱🇮", "demonym": "Liechtensteiner"},
    {"code": "LT", "name": "Lithuania", "flag": "🇱🇹", "demonym": "Lithuanian"},
    {"code": "LU", "name": "Luxembourg", "flag": "🇱🇺", "demonym": "Luxembourgish"},
    {"code": "MG", "name": "Madagascar", "flag": "🇲🇬", "demonym": "Malagasy"},
    {"code": "MW", "name": "Malawi", "flag": "🇲🇼", "demonym": "Malawian"},
    {"code": "MY", "name": "Malaysia", "flag": "🇲🇾", "demonym": "Malaysian"},
    {"code": "MV", "name": "Maldives", "flag": "🇲🇻", "demonym": "Maldivian"},
    {"code": "ML", "name": "Mali", "flag": "🇲🇱", "demonym": "Malian"},
    {"code": "MT", "name": "Malta", "flag": "🇲🇹", "demonym": "Maltese"},
    {"code": "MH", "name": "Marshall Islands", "flag": "🇲🇭", "demonym": "Marshallese"},
    {"code": "MR", "name": "Mauritania", "flag": "🇲🇷", "demonym": "Mauritanian"},
    {"code": "MU", "name": "Mauritius", "flag": "🇲🇺", "demonym": "Mauritian"},
    {"code": "MX", "name": "Mexico", "flag": "🇲🇽", "demonym": "Mexican"},
    {"code": "FM", "name": "Micronesia", "flag": "🇫🇲", "demonym": "Micronesian"},
    {"code": "MD", "name": "Moldova", "flag": "🇲🇩", "demonym": "Moldovan"},
    {"code": "MC", "name": "Monaco", "flag": "🇲🇨", "demonym": "Monégasque"},
    {"code": "MN", "name": "Mongolia", "flag": "🇲🇳", "demonym": "Mongolian"},
    {"code": "ME", "name": "Montenegro", "flag": "🇲🇪", "demonym": "Montenegrin"},
    {"code": "MS", "name": "Montserrat", "flag": "🇲🇸", "demonym": "Montserratian"},
    {"code": "MA", "name": "Morocco", "flag": "🇲🇦", "demonym": "Moroccan"},
    {"code": "MZ", "name": "Mozambique", "flag": "🇲🇿", "demonym": "Mozambican"},
    {"code": "MM", "name": "Myanmar", "flag": "🇲🇲", "demonym": "Burmese"},
    {"code": "NA", "name": "Namibia", "flag": "🇳🇦", "demonym": "Namibian"},
    {"code": "NR", "name": "Nauru", "flag": "🇳🇷", "demonym": "Nauruan"},
    {"code": "NP", "name": "Nepal", "flag": "🇳🇵", "demonym": "Nepali"},
    {"code": "NL", "name": "Netherlands", "flag": "🇳🇱", "demonym": "Dutch"},
    {"code": "NZ", "name": "New Zealand", "flag": "🇳🇿", "demonym": "New Zealander"},
    {"code": "NI", "name": "Nicaragua", "flag": "🇳🇮", "demonym": "Nicaraguan"},
    {"code": "NE", "name": "Niger", "flag": "🇳🇪", "demonym": "Nigerien"},
    {"code": "NG", "name": "Nigeria", "flag": "🇳🇬", "demonym": "Nigerian"},
    {"code": "NU", "name": "Niue", "flag": "🇳🇺", "demonym": "Niuean"},
    {"code": "MK", "name": "North Macedonia", "flag": "🇲🇰", "demonym": "Macedonian"},
    {"code": "NO", "name": "Norway", "flag": "🇳🇴", "demonym": "Norwegian"},
    {"code": "OM", "name": "Oman", "flag": "🇴🇲", "demonym": "Omani"},
    {"code": "PK", "name": "Pakistan", "flag": "🇵🇰", "demonym": "Pakistani"},
    {"code": "PW", "name": "Palau", "flag": "🇵🇼", "demonym": "Palauan"},
    {"code": "PS", "name": "Palestine", "flag": "🇵🇸", "demonym": "Palestinian"},
    {"code": "PA", "name": "Panama", "flag": "🇵🇦", "demonym": "Panamanian"},
    {"code": "PG", "name": "Papua New Guinea", "flag": "🇵🇬", "demonym": "Papua New Guinean"},
    {"code": "PY", "name": "Paraguay", "flag": "🇵🇾", "demonym": "Paraguayan"},
    {"code": "PE", "name": "Peru", "flag": "🇵🇪", "demonym": "Peruvian"},
    {"code": "PH", "name": "Philippines", "flag": "🇵🇭", "demonym": "Filipino"},
    {"code": "PL", "name": "Poland", "flag": "🇵🇱", "demonym": "Polish"},
    {"code": "PT", "name": "Portugal", "flag": "🇵🇹", "demonym": "Portuguese"},
    {"code": "QA", "name": "Qatar", "flag": "🇶🇦", "demonym": "Qatari"},
    {"code": "RO", "name": "Romania", "flag": "🇷🇴", "demonym": "Romanian"},
    {"code": "RU", "name": "Russia", "flag": "🇷🇺", "demonym": "Russian"},
    {"code": "RW", "name": "Rwanda", "flag": "🇷🇼", "demonym": "Rwandan"},
    {"code": "KN", "name": "Saint Kitts and Nevis", "flag": "🇰🇳", "demonym": "Kittitian"},
    {"code": "LC", "name": "Saint Lucia", "flag": "🇱🇨", "demonym": "Saint Lucian"},
    {"code": "VC", "name": "Saint Vincent and the Grenadines", "flag": "🇻🇨", "demonym": "Vincentian"},
    {"code": "WS", "name": "Samoa", "flag": "🇼🇸", "demonym": "Samoan"},
    {"code": "SM", "name": "San Marino", "flag": "🇸🇲", "demonym": "Sammarinese"},
    {"code": "ST", "name": "Sao Tome and Principe", "flag": "🇸🇹", "demonym": "São Toméan"},
    {"code": "SA", "name": "Saudi Arabia", "flag": "🇸🇦", "demonym": "Saudi Arabian"},
    {"code": "SN", "name": "Senegal", "flag": "🇸🇳", "demonym": "Senegalese"},
    {"code": "RS", "name": "Serbia", "flag": "🇷🇸", "demonym": "Serbian"},
    {"code": "SC", "name": "Seychelles", "flag": "🇸🇨", "demonym": "Seychellois"},
    {"code": "SL", "name": "Sierra Leone", "flag": "🇸🇱", "demonym": "Sierra Leonean"},
    {"code": "SG", "name": "Singapore", "flag": "🇸🇬", "demonym": "Singaporean"},
    {"code": "SK", "name": "Slovakia", "flag": "🇸🇰", "demonym": "Slovak"},
    {"code": "SI", "name": "Slovenia", "flag": "🇸🇮", "demonym": "Slovenian"},
    {"code": "SB", "name": "Solomon Islands", "flag": "🇸🇧", "demonym": "Solomon Islander"},
    {"code": "SO", "name": "Somalia", "flag": "🇸🇴", "demonym": "Somali"},
    {"code": "ZA", "name": "South Africa", "flag": "🇿🇦", "demonym": "South African"},
    {"code": "SS", "name": "South Sudan", "flag": "🇸🇸", "demonym": "South Sudanese"},
    {"code": "ES", "name": "Spain", "flag": "🇪🇸", "demonym": "Spanish"},
    {"code": "LK", "name": "Sri Lanka", "flag": "🇱🇰", "demonym": "Sri Lankan"},
    {"code": "SD", "name": "Sudan", "flag": "🇸🇩", "demonym": "Sudanese"},
    {"code": "SR", "name": "Suriname", "flag": "🇸🇷", "demonym": "Surinamese"},
    {"code": "SE", "name": "Sweden", "flag": "🇸🇪", "demonym": "Swedish"},
    {"code": "CH", "name": "Switzerland", "flag": "🇨🇭", "demonym": "Swiss"},
    {"code": "SY", "name": "Syria", "flag": "🇸🇾", "demonym": "Syrian"},
    {"code": "TW", "name": "Taiwan", "flag": "🇹🇼", "demonym": "Taiwanese"},
    {"code": "TJ", "name": "Tajikistan", "flag": "🇹🇯", "demonym": "Tajik"},
    {"code": "TZ", "name": "Tanzania", "flag": "🇹🇿", "demonym": "Tanzanian"},
    {"code": "TH", "name": "Thailand", "flag": "🇹🇭", "demonym": "Thai"},
    {"code": "TL", "name": "Timor-Leste", "flag": "🇹🇱", "demonym": "Timorese"},
    {"code": "TG", "name": "Togo", "flag": "🇹🇬", "demonym": "Togolese"},
    {"code": "TO", "name": "Tonga", "flag": "🇹🇴", "demonym": "Tongan"},
    {"code": "TT", "name": "Trinidad and Tobago", "flag": "🇹🇹", "demonym": "Trinidadian"},
    {"code": "TC", "name": "Turks and Caicos Islands", "flag": "🇹🇨", "demonym": "Turks and Caicos Islander"},
    {"code": "TN", "name": "Tunisia", "flag": "🇹🇳", "demonym": "Tunisian"},
    {"code": "TR", "name": "Turkey", "flag": "🇹🇷", "demonym": "Turkish"},
    {"code": "TM", "name": "Turkmenistan", "flag": "🇹🇲", "demonym": "Turkmen"},
    {"code": "TV", "name": "Tuvalu", "flag": "🇹🇻", "demonym": "Tuvaluan"},
    {"code": "UG", "name": "Uganda", "flag": "🇺🇬", "demonym": "Ugandan"},
    {"code": "UA", "name": "Ukraine", "flag": "🇺🇦", "demonym": "Ukrainian"},
    {"code": "AE", "name": "United Arab Emirates", "flag": "🇦🇪", "demonym": "Emirati"},
    {"code": "GB", "name": "United Kingdom", "flag": "🇬🇧", "demonym": "British"},
    {"code": "US", "name": "United States", "flag": "🇺🇸", "demonym": "American"},
    {"code": "UY", "name": "Uruguay", "flag": "🇺🇾", "demonym": "Uruguayan"},
    {"code": "UZ", "name": "Uzbekistan", "flag": "🇺🇿", "demonym": "Uzbek"},
    {"code": "VU", "name": "Vanuatu", "flag": "🇻🇺", "demonym": "Ni-Vanuatu"},
    {"code": "VA", "name": "Vatican City", "flag": "🇻🇦", "demonym": "Vatican"},
    {"code": "VE", "name": "Venezuela", "flag": "🇻🇪", "demonym": "Venezuelan"},
    {"code": "VN", "name": "Vietnam", "flag": "🇻🇳", "demonym": "Vietnamese"},
    {"code": "YE", "name": "Yemen", "flag": "🇾🇪", "demonym": "Yemeni"},
    {"code": "ZM", "name": "Zambia", "flag": "🇿🇲", "demonym": "Zambian"},
    {"code": "ZW", "name": "Zimbabwe", "flag": "🇿🇼", "demonym": "Zimbabwean"},
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
                '_id': str(config.get('_id', '')),
                'flag_emoji': config.get('flag_emoji') or country['flag']
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
        country_code = config['country_code']
        demonym = next((c.get('demonym', '') for c in ALL_COUNTRIES if c['code'] == country_code), '')
        result.append({
            'code': country_code,
            'name': config['country_name'],
            'flag': config.get('flag_emoji', ''),
            'demonym': demonym,
        })
    return sorted(result, key=lambda x: x['name'])


@router.get("/{country_code}/visa-options")
async def get_visa_options(country_code: str, purpose: str = None):
    """Get visa options for a specific country"""
    config = await db.country_visa_configs.find_one({'country_code': country_code.upper()})
    
    if not config or not config.get('country_enabled', False):
        _country_meta = next((c for c in ALL_COUNTRIES if c['code'] == country_code.upper()), {})
        return {
            'has_evisa_options': False,
            'country_name': _country_meta.get('name', country_code),
            'country_demonym': _country_meta.get('demonym', ''),
            'options': [],
            'message': 'No eVisa options available. Please apply through embassy or consulate.'
        }
    
    options = []
    
    # Calculate approval date (today + 5 days)
    approval_date = (datetime.utcnow() + timedelta(days=5)).strftime('%B %d')
    
    # Per-country discount amount (used by with_discount display mode on frontend)
    country_discount = config.get('discount_amount', 0) or 0

    # Helper function to calculate fees
    def calculate_total(govt_fee, our_fee):
        processing_fee = govt_fee * 0.025  # 2.5% of govt fee
        return govt_fee + our_fee + processing_fee, processing_fee
    
    # Filter by purpose if specified
    if purpose is None or purpose.lower() == 'tourist':
        if config.get('tourist_enabled', False):
            if config.get('tourist_30d_enabled', False):
                # Season-based govt fee: April–June vs July–March
                current_month = datetime.utcnow().month
                if current_month in (4, 5, 6):
                    govt_fee = config.get('tourist_30d_govt_fee_apr_jun') or config.get('tourist_30d_govt_fee', 0)
                else:
                    govt_fee = config.get('tourist_30d_govt_fee_jul_mar') or config.get('tourist_30d_govt_fee', 0)
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

    # Attach country-level discount to every option (used by "with_discount" display mode)
    for opt in options:
        opt['discount_amount'] = round(country_discount, 2)

    _country_meta = next((c for c in ALL_COUNTRIES if c['code'] == country_code.upper()), {})
    return {
        'has_evisa_options': len(options) > 0,
        'country_name': config.get('country_name', ''),
        'country_demonym': _country_meta.get('demonym', ''),
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


class BulkVisaFeesRequest(BaseModel):
    # Tourist 30d (seasonal)
    tourist_30d_govt_fee_apr_jun: Optional[float] = None
    tourist_30d_govt_fee_jul_mar: Optional[float] = None
    tourist_30d_our_fee: Optional[float] = None
    # Tourist 1yr
    tourist_1yr_govt_fee: Optional[float] = None
    tourist_1yr_our_fee: Optional[float] = None
    # Tourist 5yr
    tourist_5yr_govt_fee: Optional[float] = None
    tourist_5yr_our_fee: Optional[float] = None
    # Business
    business_govt_fee: Optional[float] = None
    business_our_fee: Optional[float] = None
    # Conference
    conference_govt_fee: Optional[float] = None
    conference_our_fee: Optional[float] = None
    # Medical
    medical_govt_fee: Optional[float] = None
    medical_our_fee: Optional[float] = None
    # Medical Attendant
    medical_attendant_govt_fee: Optional[float] = None
    medical_attendant_our_fee: Optional[float] = None
    # Transit
    transit_govt_fee: Optional[float] = None
    transit_our_fee: Optional[float] = None
    # Discount
    discount_amount: Optional[float] = None

@router.post("/bulk-visa-fees")
async def bulk_set_visa_fees(payload: BulkVisaFeesRequest):
    """
    Upsert visa fee defaults (all types) + discount_amount for every country.
    Only updates the supplied fields — never touches any enabled/disabled toggles.
    Returns counts of created vs updated documents.
    """
    fee_fields = {k: v for k, v in payload.dict().items() if v is not None}
    if not fee_fields:
        raise HTTPException(status_code=400, detail="No fee values provided")

    fee_fields['updated_at'] = datetime.utcnow()

    created = 0
    updated = 0

    for country_info in ALL_COUNTRIES:
        code = country_info['code']
        existing = await db.country_visa_configs.find_one({'country_code': code})
        if existing:
            await db.country_visa_configs.update_one(
                {'country_code': code},
                {'$set': fee_fields}
            )
            updated += 1
        else:
            new_doc = {
                'id': str(uuid.uuid4()),
                'country_code': code,
                'country_name': country_info['name'],
                'flag_emoji': country_info.get('flag', ''),
                'country_enabled': False,
                'tourist_enabled': False,
                'tourist_30d_enabled': False,
                'tourist_30d_govt_fee': 0.0,
                'tourist_30d_govt_fee_apr_jun': 0.0,
                'tourist_30d_govt_fee_jul_mar': 0.0,
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
                'discount_amount': 0.0,
                'created_at': datetime.utcnow(),
                **fee_fields,
            }
            await db.country_visa_configs.insert_one(new_doc)
            created += 1

    return {
        'status': 'success',
        'created': created,
        'updated': updated,
        'total': created + updated,
    }

# Keep old endpoint as alias for backward compatibility
@router.post("/bulk-tourist-fees")
async def bulk_set_tourist_fees_alias(payload: BulkVisaFeesRequest):
    return await bulk_set_visa_fees(payload)


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
            'tourist_30d_govt_fee_apr_jun': 0.0,
            'tourist_30d_govt_fee_jul_mar': 0.0,
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
            'discount_amount': 0.0,
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

    def base_doc(code, name, flag):
        return {
            'id': str(uuid.uuid4()),
            'country_code': code,
            'country_name': name,
            'flag_emoji': flag,
            'country_enabled': False,
            'tourist_enabled': False,
            'tourist_30d_enabled': False,
            'tourist_30d_govt_fee': 0.0,
            'tourist_30d_govt_fee_apr_jun': 0.0,
            'tourist_30d_govt_fee_jul_mar': 0.0,
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
            'discount_amount': 0.0,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
        }

    sample_configs = [
        {
            **base_doc('US', 'United States', '🇺🇸'),
            'country_enabled': True,
            'tourist_enabled': True,
            'tourist_30d_enabled': True,
            'tourist_30d_govt_fee_apr_jun': 10.0,
            'tourist_30d_govt_fee_jul_mar': 25.0,
            'tourist_30d_our_fee': 47.0,
            'tourist_1yr_enabled': True,
            'tourist_1yr_govt_fee': 40.0,
            'tourist_1yr_our_fee': 47.0,
            'tourist_5yr_enabled': True,
            'tourist_5yr_govt_fee': 160.0,
            'tourist_5yr_our_fee': 47.0,
            'business_enabled': True,
            'business_govt_fee': 80.0,
            'business_our_fee': 47.0,
            'medical_enabled': True,
            'medical_govt_fee': 25.0,
            'medical_our_fee': 47.0,
        },
        {
            **base_doc('GB', 'United Kingdom', '🇬🇧'),
            'country_enabled': True,
            'tourist_enabled': True,
            'tourist_30d_enabled': True,
            'tourist_30d_govt_fee_apr_jun': 10.0,
            'tourist_30d_govt_fee_jul_mar': 25.0,
            'tourist_30d_our_fee': 47.0,
            'tourist_1yr_enabled': True,
            'tourist_1yr_govt_fee': 40.0,
            'tourist_1yr_our_fee': 47.0,
            'tourist_5yr_enabled': True,
            'tourist_5yr_govt_fee': 484.0,
            'tourist_5yr_our_fee': 47.0,
            'business_enabled': True,
            'business_govt_fee': 80.0,
            'business_our_fee': 47.0,
        },
        {
            **base_doc('BE', 'Belgium', '🇧🇪'),
            'country_enabled': True,
            'tourist_enabled': True,
            'tourist_30d_enabled': True,
            'tourist_30d_govt_fee_apr_jun': 10.0,
            'tourist_30d_govt_fee_jul_mar': 25.0,
            'tourist_30d_our_fee': 47.0,
            'tourist_1yr_enabled': True,
            'tourist_1yr_govt_fee': 40.0,
            'tourist_1yr_our_fee': 47.0,
        },
        {
            **base_doc('CA', 'Canada', '🇨🇦'),
            'country_enabled': True,
            'tourist_enabled': True,
            'tourist_30d_enabled': True,
            'tourist_30d_govt_fee_apr_jun': 10.0,
            'tourist_30d_govt_fee_jul_mar': 25.0,
            'tourist_30d_our_fee': 47.0,
            'tourist_1yr_enabled': True,
            'tourist_1yr_govt_fee': 40.0,
            'tourist_1yr_our_fee': 47.0,
            'tourist_5yr_enabled': True,
            'tourist_5yr_govt_fee': 200.0,
            'tourist_5yr_our_fee': 47.0,
            'business_enabled': True,
            'business_govt_fee': 80.0,
            'business_our_fee': 47.0,
            'medical_enabled': True,
            'medical_govt_fee': 25.0,
            'medical_our_fee': 47.0,
            'transit_enabled': True,
            'transit_govt_fee': 25.0,
            'transit_our_fee': 47.0,
        },
    ]

    await db.country_visa_configs.insert_many(sample_configs)
    return {"status": "success", "seeded": len(sample_configs)}
