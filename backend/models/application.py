from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId

class ApplicationCreate(BaseModel):
    # Step 1: Basic Info (Updated)
    passportType: str  # Must be "Ordinary" to proceed
    portOfArrival: str  # Dropdown from constants
    expectedArrivalDate: str  # Must be today + 5 days or later
    visaService: str  # Auto-populated from Home page selection
    visaServiceSubtype: str  # Based on visa type
    # Passport fields (moved from Step 3)
    passportNumber: str
    dateOfIssue: str
    dateOfExpiry: str
    otherPassportHeld: str  # Default: "No"
    # Conditional fields for Tourist visa (non-sightseeing)
    yogaInstituteName: Optional[str] = ""
    yogaInstituteAddress: Optional[str] = ""
    yogaInstitutePhone: Optional[str] = ""
    
    # Step 2: Applicant Details (Simplified)
    surname: str
    givenNames: str
    religion: str  # From constants dropdown
    visibleMarks: Optional[str] = "None"  # Default: "None"
    educationalQualification: str  # From constants dropdown
    qualificationFrom: str  # University/College name
    livedTwoYears: str = "Yes"  # Default: "Yes"
    
    # Step 3: Address Details (Updated - removed Step 3 Passport Details)
    houseNoStreet: str
    villageTownCity: str
    country: str  # Searchable dropdown from constants
    stateProvince: str
    postalCode: str
    phoneCountryCode: str  # Country code dropdown
    phoneNumber: str  # Max 12 digits
    
    # Step 4: Family Details
    fatherName: str
    fatherNationality: str  # Country dropdown from constants
    fatherPreviousNationality: Optional[str] = ""  # Country dropdown
    fatherPlaceOfBirth: str
    fatherCountryOfBirth: str  # Country dropdown from constants
    motherName: str
    motherNationality: str  # Country dropdown from constants
    motherPreviousNationality: Optional[str] = ""  # Country dropdown
    motherPlaceOfBirth: str
    motherCountryOfBirth: str  # Country dropdown from constants
    maritalStatus: str
    spouseName: Optional[str] = ""
    spouseNationality: Optional[str] = ""  # Country dropdown
    spousePreviousNationality: Optional[str] = ""  # Country dropdown
    spousePlaceOfBirth: Optional[str] = ""
    spouseCountryOfBirth: Optional[str] = ""  # Country dropdown
    pakistanConnection: str = "No"  # Default: "No", if "Yes" show error
    
    # Step 5: Professional Details
    presentOccupation: str
    employerName: str
    designation: Optional[str] = ""
    employerAddress: str
    employerPhone: Optional[str] = ""
    pastOccupation: Optional[str] = ""
    militaryService: str
    pastOccupationIfAny: Optional[str] = ""
    
    # Step 6: Visa Details (Merged with Previous Visit and Other Info)
    placesToVisit: str
    placesToVisitLine2: Optional[str] = ""
    hotelBooked: str = "No"  # Default: "No"
    # Merged from Previous Visit
    visitedIndiaBefore: str = "No"  # Default: "No"
    previousAddress: Optional[str] = ""
    citiesPreviouslyVisited: Optional[str] = ""
    lastIndianVisaNo: Optional[str] = ""
    oldVisaType: Optional[str] = ""
    oldVisaIssuePlace: Optional[str] = ""
    oldVisaIssueDate: Optional[str] = ""
    # Merged from Other Info
    countriesVisitedLast10Years: Optional[str] = ""  # Optional
    visitedSAARCCountries: str = "No"  # Default: "No"
    
    # Conditional: Business Visa Fields
    companyName: Optional[str] = ""
    companyAddress: Optional[str] = ""
    companyPhoneCountryCode: Optional[str] = ""
    companyPhoneNumber: Optional[str] = ""
    companyWebsite: Optional[str] = ""
    indianFirmName: Optional[str] = ""
    indianFirmAddress: Optional[str] = ""
    indianFirmPhoneCountryCode: Optional[str] = ""
    indianFirmPhoneNumber: Optional[str] = ""
    indianFirmWebsite: Optional[str] = ""
    
    # Conditional: Conference Visa Fields
    conferenceName: Optional[str] = ""
    conferenceStartDate: Optional[str] = ""
    conferenceEndDate: Optional[str] = ""
    conferenceAddress: Optional[str] = ""
    organizerName: Optional[str] = ""
    organizerAddress: Optional[str] = ""
    organizerPhoneCountryCode: Optional[str] = ""
    organizerPhoneNumber: Optional[str] = ""
    organizerEmail: Optional[str] = ""
    
    # Step 7: References (Updated phone format)
    indiaReferenceName: str
    indiaReferenceAddress: str
    indiaReferencePhoneCountryCode: str
    indiaReferencePhoneNumber: str
    homeReferenceName: str
    homeReferenceAddress: str
    homeReferencePhoneCountryCode: str
    homeReferencePhoneNumber: str
    
    # Step 8: Additional Questions (Default "No" with conditional reasons)
    arrestedConvicted: str = "No"
    arrestedConvictedReason: Optional[str] = ""
    refusedEntry: str = "No"
    refusedEntryReason: Optional[str] = ""
    humanTrafficking: str = "No"
    humanTraffickingReason: Optional[str] = ""
    cyberCrime: str = "No"
    cyberCrimeReason: Optional[str] = ""
    terroristViews: str = "No"
    terroristViewsReason: Optional[str] = ""
    asylumSought: str = "No"
    asylumSoughtReason: Optional[str] = ""
    
    # Step 9: Documents (Base documents + conditional based on visa type)
    passportDocument: Optional[str] = ""
    photoDocument: Optional[str] = ""
    # Business Visa specific documents
    businessLetter: Optional[str] = ""
    businessCard: Optional[str] = ""
    # Conference Visa specific documents
    organizerInvitation: Optional[str] = ""
    meaPoliticalClearance: Optional[str] = ""
    mhaEventClearance: Optional[str] = ""
    # Medical Visa specific documents
    medicalInvitationLetter: Optional[str] = ""
    # Transit Visa specific documents
    confirmedTravelTicket: Optional[str] = ""
    destinationVisaOrPassport: Optional[str] = ""
    
    # Payment
    paymentStatus: Optional[str] = "completed"

class ApplicationStatusUpdate(BaseModel):
    status: str

class Application(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    applicationId: str
    userId: str
    status: str = "pending"
    submittedDate: datetime = Field(default_factory=datetime.utcnow)
    
    # All fields from ApplicationCreate - Updated structure
    # Step 1: Basic Info
    passportType: str
    portOfArrival: str
    expectedArrivalDate: str
    visaService: str
    visaServiceSubtype: str
    passportNumber: str
    dateOfIssue: str
    dateOfExpiry: str
    otherPassportHeld: str
    yogaInstituteName: Optional[str] = ""
    yogaInstituteAddress: Optional[str] = ""
    yogaInstitutePhone: Optional[str] = ""
    
    # Step 2: Applicant Details
    surname: str
    givenNames: str
    religion: str
    visibleMarks: Optional[str] = "None"
    educationalQualification: str
    qualificationFrom: str
    livedTwoYears: str = "Yes"
    
    # Step 3: Address Details
    houseNoStreet: str
    villageTownCity: str
    country: str
    stateProvince: str
    postalCode: str
    phoneCountryCode: str
    phoneNumber: str
    
    # Step 4: Family Details
    fatherName: str
    fatherNationality: str
    fatherPreviousNationality: Optional[str] = ""
    fatherPlaceOfBirth: str
    fatherCountryOfBirth: str
    motherName: str
    motherNationality: str
    motherPreviousNationality: Optional[str] = ""
    motherPlaceOfBirth: str
    motherCountryOfBirth: str
    maritalStatus: str
    spouseName: Optional[str] = ""
    spouseNationality: Optional[str] = ""
    spousePreviousNationality: Optional[str] = ""
    spousePlaceOfBirth: Optional[str] = ""
    spouseCountryOfBirth: Optional[str] = ""
    pakistanConnection: str = "No"
    
    # Step 5: Professional Details
    presentOccupation: str
    employerName: str
    designation: Optional[str] = ""
    employerAddress: str
    employerPhone: Optional[str] = ""
    pastOccupation: Optional[str] = ""
    militaryService: str
    pastOccupationIfAny: Optional[str] = ""
    
    # Step 6: Visa Details
    placesToVisit: str
    placesToVisitLine2: Optional[str] = ""
    hotelBooked: str = "No"
    visitedIndiaBefore: str = "No"
    previousAddress: Optional[str] = ""
    citiesPreviouslyVisited: Optional[str] = ""
    lastIndianVisaNo: Optional[str] = ""
    oldVisaType: Optional[str] = ""
    oldVisaIssuePlace: Optional[str] = ""
    oldVisaIssueDate: Optional[str] = ""
    countriesVisitedLast10Years: Optional[str] = ""
    visitedSAARCCountries: str = "No"
    companyName: Optional[str] = ""
    companyAddress: Optional[str] = ""
    companyPhoneCountryCode: Optional[str] = ""
    companyPhoneNumber: Optional[str] = ""
    companyWebsite: Optional[str] = ""
    indianFirmName: Optional[str] = ""
    indianFirmAddress: Optional[str] = ""
    indianFirmPhoneCountryCode: Optional[str] = ""
    indianFirmPhoneNumber: Optional[str] = ""
    indianFirmWebsite: Optional[str] = ""
    conferenceName: Optional[str] = ""
    conferenceStartDate: Optional[str] = ""
    conferenceEndDate: Optional[str] = ""
    conferenceAddress: Optional[str] = ""
    organizerName: Optional[str] = ""
    organizerAddress: Optional[str] = ""
    organizerPhoneCountryCode: Optional[str] = ""
    organizerPhoneNumber: Optional[str] = ""
    organizerEmail: Optional[str] = ""
    
    # Step 7: References
    indiaReferenceName: str
    indiaReferenceAddress: str
    indiaReferencePhoneCountryCode: str
    indiaReferencePhoneNumber: str
    homeReferenceName: str
    homeReferenceAddress: str
    homeReferencePhoneCountryCode: str
    homeReferencePhoneNumber: str
    
    # Step 8: Additional Questions
    arrestedConvicted: str = "No"
    arrestedConvictedReason: Optional[str] = ""
    refusedEntry: str = "No"
    refusedEntryReason: Optional[str] = ""
    humanTrafficking: str = "No"
    humanTraffickingReason: Optional[str] = ""
    cyberCrime: str = "No"
    cyberCrimeReason: Optional[str] = ""
    terroristViews: str = "No"
    terroristViewsReason: Optional[str] = ""
    asylumSought: str = "No"
    asylumSoughtReason: Optional[str] = ""
    
    # Step 9: Documents
    passportDocument: Optional[str] = ""
    photoDocument: Optional[str] = ""
    businessLetter: Optional[str] = ""
    businessCard: Optional[str] = ""
    organizerInvitation: Optional[str] = ""
    meaPoliticalClearance: Optional[str] = ""
    mhaEventClearance: Optional[str] = ""
    medicalInvitationLetter: Optional[str] = ""
    confirmedTravelTicket: Optional[str] = ""
    destinationVisaOrPassport: Optional[str] = ""
    paymentStatus: Optional[str] = "completed"
    
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

