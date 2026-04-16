"""
eTourist CSV generator.

Produces a 3-column CSV (Label, Value, Notes) formatted as a
fill-in reference sheet for the Indian eVisa online portal (eTourist format).

The middle section (rows between VISA SOUGHT and PREVIOUS VISA) is
swapped automatically based on visa type:
  tourist / medical / medical_attendant → MEETINGS FRIENDS/RELATIVES/YOGA
  business                              → BUSINESS DETAILS
  conference                            → CONFERENCE DETAILS
  transit                               → TRANSIT TRAVEL DETAILS

Usage
-----
    from utils.etourist_csv import generate_etourist_csv, save_etourist_csv

    csv_string = generate_etourist_csv(application_data_dict)
    save_etourist_csv(application_data_dict, Path("uploads/APP123/APP123_application.csv"))
"""

import csv
import io
import re
from pathlib import Path
from typing import Any


# ---------------------------------------------------------------------------
# Spouse-conditional fields: blank unless maritalStatus == 'Married'
# ---------------------------------------------------------------------------
SPOUSE_FIELDS = {
    'spouseName', 'spouseNationality', 'spousePreviousNationality',
    'spousePlaceOfBirth', 'spouseCountryOfBirth',
}

# Fields whose spec_c column contains a DATA FIELD NAME (not a note)
# (used for additional-question rows where col-C holds the reason field)
REASON_FIELDS = {
    'arrestedConvictedReason', 'refusedEntryReason', 'humanTraffickingReason',
    'cyberCrimeReason', 'terroristViewsReason', 'asylumSoughtReason',
}

# Static literal values that are copied directly into the output
STATIC_VALUES = {
    'NA', 'Yes', 'NO', 'Tick it', 'e-Visa',
    '<BLANK>', '<SELECT RELEVANT STATE>', '<SELECT RELEVANT DISTRICT>',
    'VisaOnArrival',
}

# Sentinel marker: generate_etourist_rows replaces this entry with the
# correct visa-type-specific section at runtime.
_VISA_TYPE_SECTION = '__VISA_TYPE_SECTION__'


# ---------------------------------------------------------------------------
# Template: (label, spec_b, spec_c, extra_d)
#
#   spec_b / spec_c:
#     ''                          → output empty cell
#     '<<Check passport>>'        → output literal '<<Check passport>>'
#     '<…>'                       → output literal (static instruction)
#     value in STATIC_VALUES      → output literal
#     'fieldA+fieldB'             → concatenate two formData fields
#     any camelCase/snake_case id → look up in flattened formData
#     anything else               → output as-is (plain note text)
# ---------------------------------------------------------------------------
TEMPLATE = [
    # --- FIRST PAGE ---
    ('FIRST PAGE', '', '', ''),
    ('Passport Type', 'passportType', '', ''),
    ('Nationality', '<<Check passport>>', '', ''),
    ('Port of Arrival', 'portOfArrival', '', ''),
    ('Date of Birth', '<<Check passport>>', '', ''),
    ('EMAIL ID', '', '', ''),
    ('Re-enter EMAIL ID', '', '', ''),
    ('Expected Date of Arrival (DD/MM/YYYY)', 'expectedArrivalDate', '', ''),
    ('Visa Service', 'visaService', '', ''),
    ('Visa Service subtype', 'visaServiceSubtype', '', ''),
    ('Enter captcha', '', '', ''),
    ('Check the box', '', '', ''),
    ('Click Continue', '', '', ''),
    ('', '', '', ''),

    # --- APPLICANT DETAILS ---
    ('*****************', '', '', ''),
    ('APPLICANT DETAILS', '', '', ''),
    ('*****************', '', '', ''),
    ('Surname (or family name)', '<<Check passport>>', '', ''),
    ('Given names (or first name)', '<<Check passport>>', '', ''),
    ('', '', '', ''),
    ('Skip over Have you ever changed your name', '', '', ''),
    ('Gender', '<<Check passport>>', '', ''),
    ('Date of Birth  (DD/MM/YYYY)', '<<Check passport>>', '', ''),
    ('Town/City of birth', '<<Check passport>>', '', ''),
    ('Country of birth', '<<Check passport>>', '', ''),
    ('Citizenship/National Id No', 'NA', '', ''),
    ('Religion', 'religion', '', ''),
    ('Visible identification marks', 'visibleMarks', '', ''),
    ('Educational Qualification', 'educationalQualification', '', ''),
    ('Qualification acquired from College/University', 'qualificationFrom', '', ''),
    ('Nationality', 'passportName', '', ''),
    ('Did you acquire Nationality by birth', '', '', ''),
    ('              or by naturalization ?', '<<Check passport>>', '', ''),
    ('Have you lived for at least two years in', '', '', ''),
    ('the country where you are applying visa?', 'Yes', '', ''),
    ('', '', '', ''),

    # --- PASSPORT DETAILS ---
    ('*****************', '', '', ''),
    ('PASSPORT DETAILS', '', '', ''),
    ('*****************', '', '', ''),
    ('Passport Number', '<<Check passport>>', '', ''),
    ('Place of Issue', '<<Check passport>>', '', ''),
    ('Date of Issue', '<<Check passport>>', '', ''),
    ('Date of Expiry', '<<Check passport>>', '', ''),
    ('', '', '', ''),
    ('Any other valid Passport/Identity Certificate(IC) held', 'NO', '', ''),
    ('', '', '', ''),

    # --- APPLICANTS ADDRESS DETAILS ---
    ('**************************', '', '', ''),
    ('APPLICANTS ADDRESS DETAILS', '', '', ''),
    ('**************************', '', '', ''),
    ('House No./Street', 'houseNoStreet', '', ''),
    ('Village/Town/City', 'villageTownCity', '', ''),
    ('Country', 'country', '', ''),
    ('State/Province/District', 'stateProvince', '', ''),
    ('Postal/Zip Code', 'postalCode', '', ''),
    ('Phone No.', 'phoneCountryCode+phoneNumber', '', ''),
    ('Mobile No.', 'phoneCountryCode+phoneNumber', '', ''),
    ('Double check Email Address', '', '', ''),
    ('Click here for same address', 'Tick it', '', ''),
    ('', '', '', ''),

    # --- FAMILY DETAILS ---
    ('***************', '', '', ''),
    ('FAMILY DETAILS', '', '', ''),
    ('***************', '', '', ''),
    ('Fathers name', 'fatherName', '', ''),
    ('Fathers Nationality', 'fatherNationality', '', ''),
    ('Previous  Nationality', 'fatherPreviousNationality', '', ''),
    ('Fathers Place of birth', 'fatherPlaceOfBirth', '', ''),
    ('Fathers Country of birth', 'fatherCountryOfBirth', '', ''),
    ('', '', '', ''),
    ('Mothers name', 'motherName', '', ''),
    ('Mothers Nationality', 'motherNationality', '', ''),
    ('Previous  Nationality', 'motherPreviousNationality', '', ''),
    ('Mothers Place of birth', 'motherPlaceOfBirth', '', ''),
    ('Mothers Country of birth', 'motherCountryOfBirth', '', ''),
    ('', '', '', ''),
    ("Applicant's Marital Status", 'maritalStatus', '', ''),
    ('Spouse name', 'spouseName', '', ''),
    ('Spouses Nationality', 'spouseNationality', '', ''),
    ('Previous  Nationality', 'spousePreviousNationality', '', ''),
    ('Spouses Place of birth', 'spousePlaceOfBirth', '', ''),
    ('Spouses Country of birth', 'spouseCountryOfBirth', '', ''),
    ('Were your Parents/Grandparents Pakistan', '', '', ''),
    ('Nationals or Belong to Pakistan held area ?', 'pakistanConnection', '', ''),
    ('', '', '', ''),

    # --- PROFESSIONAL/OCCUPATION DETAILS ---
    ('*******************************', '', '', ''),
    ('PROFESSIONAL/OCCUPATION DETAILS', '', '', ''),
    ('*******************************', '', '', ''),
    ('Present Occupation', 'presentOccupation', '', ''),
    ('Employer Name/business', 'employerName', '', ''),
    ('Designation', 'designation', '(Use from Business Card if available)', ''),
    ('Address', 'employerAddress', '', ''),
    ('Phone', 'employerPhone', '', ''),
    ('Past Occupation if any', 'pastOccupation', '', ''),
    ('Are/were you in a Military/Semi-Military', '', '', ''),
    ('/Police/Security. Organization?', 'militaryService', '', ''),
    ('', '', '', ''),

    # --- DETAILS OF VISA SOUGHT ---
    ('**********************', '', '', ''),
    ('DETAILS OF VISA SOUGHT', '', '', ''),
    ('***********************', '', '', ''),
    ('Type of Visa', 'e-Visa', '', ''),
    ('Visa Service', 'visa_type', '', ''),
    ('Places to be visited', 'placesToVisit', '', ''),
    ('Places to be visited line 2', '<BLANK>', '', ''),
    ('Have you booked any room in Hotel/Resort', '', '', ''),
    ('         etc. through any Tour Operator?', 'hotelBooked', '', ''),

    # --- Visa-type-specific section (replaced at runtime) ---
    (_VISA_TYPE_SECTION, '', '', ''),

    ('Duration of Visa', 'duration', '', ''),
    ('No. of Entries', 'entries', '', ''),
    ('Port of Arrival in India', 'portOfArrival', '', ''),
    ('Expected Port of Exit from India', '<BLANK>', '', ''),
    ('', '', '', ''),

    # --- PREVIOUS VISA/CURRENTLY VALID VISA ---
    ('***********************************', '', '', ''),
    ('PREVIOUS VISA/CURRENTLY VALID VISA', '', '', ''),
    ('***********************************', '', '', ''),
    ('Have you ever visited India before?', 'visitedIndiaBefore', '', ''),
    ('Address', 'previousAddress', '(Try to fit the full address on multiple lines available)', ''),
    ('Cities previously visited in India', 'citiesPreviouslyVisited', '', ''),
    ('Last Indian Visa No', 'lastIndianVisaNo', '', ''),
    ('Type of Visa', 'oldVisaType', '', ''),
    ('Place of Issue', 'oldVisaIssuePlace', '', ''),
    ('Date of Issue', 'oldVisaIssueDate', '', ''),
    ('', '', '', ''),

    # --- OTHER INFORMATION ---
    ('******************', '', '', ''),
    ('OTHER INFORMATION', '', '', ''),
    ('******************', '', '', ''),
    ('Countries Visited in Last 10 years', 'countriesVisitedLast10Years', '(Do not copy paste look up countries 1 by 1)', ''),
    ('', '', '', ''),

    # --- SAARC COUNTRY VISIT DETAILS ---
    ('******************', '', '', ''),
    ('SAARC COUNTRY VISIT DETAILS', '', '', ''),
    ('******************', '', '', ''),
    ('Have you visited SAARC countries', 'visitedSAARCCountries', '(Answer is typically No)', 'SAARC countries: Afghanistan Bangladesh Bhutan Maldives Nepal Pakistan Sri Lanka'),
    ('', '', '', ''),

    # --- REFERENCE ---
    ('*********', '', '', ''),
    ('REFERENCE', '', '', ''),
    ('*********', '', '', ''),
    ('Reference Name in India', 'indiaReferenceName', 'Host Name:', 'None'),
    ('Address', 'indiaReferenceAddress', '', ''),
    ('Phone', 'indiaReferencePhoneCountryCode+indiaReferencePhoneNumber', '', ''),
    ('', '', '', ''),
    ('Reference Name in home country', 'homeReferenceName', '', ''),
    ('Address', 'homeReferenceAddress', '', ''),
    ('Phone', 'homeReferencePhoneCountryCode+homeReferencePhoneNumber', '', ''),
    ('', '', '', ''),

    # --- ADDITIONAL QUESTION DETAILS ---
    ('***************************', '', '', ''),
    ('ADDITIONAL QUESTION DETAILS', '', '', ''),
    ('***************************', '', '', ''),
    ('Has any applicant been arrested/ prosecuted/ convicted by Court of Law of any country?',
     'arrestedConvicted', 'arrestedConvictedReason', ''),
    ('Has any applicant been refused entry / deported by any country including India?',
     'refusedEntry', 'refusedEntryReason', ''),
    ('Has any applicant been engaged in Human trafficking/ Drug trafficking/ Child abuse/ '
     'Crime against women/ Economic offense / Financial fraud?',
     'humanTrafficking', 'humanTraffickingReason', ''),
    ('Has any applicant been engaged in Cyber crime/ Fake Indian Currency Notes/ '
     'Hawala transactions/ IPR violations?',
     'cyberCrime', 'cyberCrimeReason', ''),
    ('Has any applicant at any time been associated with any organization declared as '
     'terrorist organization by the Government of India OR by any country/ international organization?',
     'terroristViews', 'terroristViewsReason', ''),
    ('Has any applicant sought asylum (political or otherwise) in any country?',
     'asylumSought', 'asylumSoughtReason', ''),
]

# ---------------------------------------------------------------------------
# Visa-type-specific middle sections
# Each is a list of (label, spec_b, spec_c, extra_d) tuples.
# ---------------------------------------------------------------------------

_SECTION_YOGA = [
    ('***********************************', '', '', ''),
    ('   MEETINGS FRIENDS/RELATIVES/YOGA', '', '', ''),
    ('***********************************', '', '', ''),
    ('Details of the Friend/Relative/Yoga', 'yogaInstituteName', '', ''),
    ('Address', 'yogaInstituteAddress', '', ''),
    ('State', '<SELECT RELEVANT STATE>', '', ''),
    ('District', '<SELECT RELEVANT DISTRICT>', '', ''),
    ('Phone No', 'yogaInstitutePhoneCode+yogaInstitutePhone', '', ''),
    ('', '', '', ''),
]

_SECTION_BUSINESS = [
    ('**************************', '', '', ''),
    ('   BUSINESS DETAILS', '', '', ''),
    ('**************************', '', '', ''),
    ('Details of the Applicants Company', '', '', ''),
    ('Name', 'companyName', '', ''),
    ('Address and Phone no', 'companyAddress+companyPhoneCountryCode+companyPhoneNumber', '', ''),
    ('Website', 'companyWebsite', '', ''),
    ('', '', '', ''),
    ('Details of Indian Firm', '', '', ''),
    ('Name', 'indianFirmName', '', ''),
    ('Address and Phone no', 'indianFirmAddress+indianFirmPhoneCountryCode+indianFirmPhoneNumber', '', ''),
    ('Website', 'indianFirmWebsite', '', ''),
    ('', '', '', ''),
]

_SECTION_CONFERENCE = [
    ('**************************', '', '', ''),
    ('   CONFERENCE DETAILS', '', '', ''),
    ('**************************', '', '', ''),
    ('Name/subject of conference', 'conferenceName', '', ''),
    ('Duration of conference', '', '', ''),
    ('Start date', 'conferenceStartDate', '', ''),
    ('End date', 'conferenceEndDate', '', ''),
    ('Venue of conference', '', '', ''),
    ('Full address', 'conferenceAddress', '', ''),
    ('Details of organizer of conference', '', '', ''),
    ('Name of organizer', 'organizerName', '', ''),
    ('Address', 'organizerAddress', '', ''),
    ('Phone no', 'organizerPhoneCountryCode+organizerPhoneNumber', '', ''),
    ('Email id', 'organizerEmail', '', ''),
    ('', '', '', ''),
]

_SECTION_TRANSIT = [
    ('**************************', '', '', ''),
    ('   TRANSIT TRAVEL DETAILS', '', '', ''),
    ('**************************', '', '', ''),
    ('Name of destination country', 'destinationVisaOrPassport', '', ''),
    ('Select as applicable with respect to the destination country', 'VisaOnArrival', '', ''),
    ('', '', '', ''),
]

_FIELD_NAME_RE = re.compile(r'^[a-z][a-zA-Z0-9_]*$')


def _is_field_name(s: str) -> bool:
    """Return True if *s* looks like a camelCase/snake_case identifier."""
    return bool(_FIELD_NAME_RE.match(s.strip()))


def _resolve(spec: str, data: dict) -> str:
    """
    Resolve a single spec token against *data*.

    Resolution order:
      1. Empty → ''
      2. Contains '+' and all parts are field names → concatenate field values
      3. Starts with '<<'                           → return as-is (passport check)
      4. Starts with '<' or is in STATIC_VALUES     → return as-is (static literal)
      5. Looks like a field name                    → data lookup
      6. Otherwise                                  → return as-is (plain note)
    """
    if not spec:
        return ''

    spec = spec.strip()

    # Handle 'fieldA+fieldB' concatenation
    if '+' in spec:
        parts = [p.strip() for p in spec.split('+')]
        if all(_is_field_name(p) for p in parts):
            values = [str(data.get(p) or '') for p in parts]
            return ' '.join(v for v in values if v).strip()

    # Static instructions kept verbatim
    if spec.startswith('<<') or spec in STATIC_VALUES or spec.startswith('<'):
        return spec

    # Field lookup
    if _is_field_name(spec):
        val = data.get(spec)
        if val is None:
            val = data.get(spec.replace('_', ''))  # visa_type → visatype fallback
        return str(val) if val is not None else ''

    # Plain note / instruction text
    return spec


def _flatten(data: dict) -> dict:
    """
    Flatten nested structures so template lookups work on a single dict.

    - Pulls stay_duration / entries / name / purpose out of selectedVisaOption
      and registers them under 'duration', 'entries', 'visa_type', etc.
    - Derives 'visa_category' (tourist/business/conference/transit/medical)
      from visaService string or selectedVisaOption.purpose.
    """
    flat = {k: v for k, v in data.items() if not isinstance(v, dict)}

    visa_option = data.get('selectedVisaOption') or {}
    if isinstance(visa_option, dict):
        flat.setdefault('duration', visa_option.get('stay_duration', ''))
        flat.setdefault('entries', visa_option.get('entries', ''))
        flat.setdefault('visa_type', visa_option.get('name', ''))
        flat.setdefault('visaService', visa_option.get('purpose', flat.get('visaService', '')))
        flat.setdefault('visaServiceSubtype', visa_option.get('name', flat.get('visaServiceSubtype', '')))

    # Detect visa_category for section switching
    combined = ' '.join([
        str(flat.get('visaService', '')),
        str(flat.get('visa_type', '')),
        str((visa_option.get('purpose') if isinstance(visa_option, dict) else '') or ''),
    ]).lower()
    if 'business' in combined:
        flat['visa_category'] = 'business'
    elif 'conference' in combined:
        flat['visa_category'] = 'conference'
    elif 'transit' in combined:
        flat['visa_category'] = 'transit'
    else:
        flat['visa_category'] = 'tourist'  # tourist / medical / medical_attendant all use yoga section

    return flat


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def generate_etourist_rows(data: dict) -> list:
    """
    Return a list of 3-element lists representing the eTourist CSV rows.

    Each row: [Label, Value, Notes/ReasonValue]
    Column D (extra) is intentionally omitted from output.
    Spouse rows are omitted entirely when maritalStatus != 'Married'.
    The middle section is chosen based on visa_category:
      tourist/medical/medical_attendant → MEETINGS/FRIENDS/RELATIVES/YOGA
      business                          → BUSINESS DETAILS
      conference                        → CONFERENCE DETAILS
      transit                           → TRANSIT TRAVEL DETAILS
    """
    flat = _flatten(data)
    is_married = str(flat.get('maritalStatus', '')).strip().lower() == 'married'

    _SECTION_MAP = {
        'business':   _SECTION_BUSINESS,
        'conference': _SECTION_CONFERENCE,
        'transit':    _SECTION_TRANSIT,
    }
    visa_section = _SECTION_MAP.get(flat.get('visa_category', 'tourist'), _SECTION_YOGA)

    rows = []
    for label, spec_b, spec_c, _extra_d in TEMPLATE:
        # Replace sentinel with the visa-type-specific section
        if label == _VISA_TYPE_SECTION:
            for s_label, s_spec_b, s_spec_c, _s_extra in visa_section:
                val_b = _resolve(s_spec_b, flat)
                val_c = s_spec_c  # notes in these sections are plain text
                rows.append([s_label, val_b, val_c])
            continue

        # Skip spouse rows entirely when not married
        if spec_b in SPOUSE_FIELDS and not is_married:
            continue

        # --- Column B (Value) ---
        val_b = _resolve(spec_b, flat)

        # --- Column C (Reason value OR note text) ---
        if spec_c in REASON_FIELDS:
            val_c = _resolve(spec_c, flat)
        else:
            val_c = spec_c

        rows.append([label, val_b, val_c])

    return rows


def generate_etourist_csv(data: dict) -> str:
    """Return the eTourist CSV as a UTF-8 string."""
    output = io.StringIO()
    writer = csv.writer(output)
    for row in generate_etourist_rows(data):
        writer.writerow(row)
    return output.getvalue()


def save_etourist_csv(data: dict, path: Path) -> None:
    """Write the eTourist CSV to *path*, creating parent dirs as needed."""
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        for row in generate_etourist_rows(data):
            writer.writerow(row)
