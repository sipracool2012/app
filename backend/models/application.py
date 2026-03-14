from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId

class ApplicationCreate(BaseModel):
    # Step 1: Basic Info
    passportType: str
    nationality: str
    portOfArrival: str
    dateOfBirth: str
    email: EmailStr
    confirmEmail: EmailStr
    expectedArrivalDate: str
    visaService: str
    visaServiceSubtype: str
    
    # Step 2: Applicant Details
    surname: str
    givenNames: str
    gender: str
    applicantDateOfBirth: str
    townOfBirth: str
    countryOfBirth: str
    citizenshipNo: Optional[str] = "NA"
    religion: str
    visibleMarks: Optional[str] = "none"
    educationalQualification: str
    qualificationFrom: str
    applicantNationality: str
    nationalityByBirth: str
    livedTwoYears: str
    
    # Step 3: Passport Details
    passportNumber: str
    placeOfIssue: str
    dateOfIssue: str
    dateOfExpiry: str
    otherPassportHeld: str
    
    # Step 4: Address Details
    houseNoStreet: str
    villageTownCity: str
    country: str
    stateProvince: str
    postalCode: str
    phoneNo: str
    mobileNo: Optional[str] = ""
    emailAddress: EmailStr
    
    # Step 5: Family Details
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
    pakistanConnection: str
    
    # Step 6: Professional Details
    presentOccupation: str
    employerName: str
    designation: Optional[str] = ""
    employerAddress: str
    employerPhone: Optional[str] = ""
    pastOccupation: Optional[str] = ""
    militaryService: str
    pastOccupationIfAny: Optional[str] = ""
    
    # Step 7: Visa Details
    typeOfVisa: str
    visaServiceType: str
    placesToVisit: str
    placesToVisitLine2: Optional[str] = ""
    hotelBooked: str
    durationOfVisa: str
    numberOfEntries: str
    portOfArrivalIndia: str
    expectedPortOfExit: Optional[str] = ""
    
    # Step 8: Previous Visit
    visitedIndiaBefore: str
    
    # Step 9: Other Info
    countriesVisited: str
    visitedSAARCCountries: str
    
    # Step 10: References
    indiaReferenceName: str
    indiaReferenceAddress: str
    indiaReferencePhone: str
    homeReferenceName: str
    homeReferenceAddress: str
    homeReferencePhone: str
    
    # Step 11: Additional Questions
    arrestedConvicted: str
    refusedEntry: str
    humanTrafficking: str
    cyberCrime: str
    terroristViews: str
    asylumSought: str
    
    # Step 12: Documents (will be added after upload)
    passportDocument: Optional[str] = ""
    photoDocument: Optional[str] = ""
    
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
    
    # All fields from ApplicationCreate
    passportType: str
    nationality: str
    portOfArrival: str
    dateOfBirth: str
    email: EmailStr
    confirmEmail: EmailStr
    expectedArrivalDate: str
    visaService: str
    visaServiceSubtype: str
    surname: str
    givenNames: str
    gender: str
    applicantDateOfBirth: str
    townOfBirth: str
    countryOfBirth: str
    citizenshipNo: Optional[str] = "NA"
    religion: str
    visibleMarks: Optional[str] = "none"
    educationalQualification: str
    qualificationFrom: str
    applicantNationality: str
    nationalityByBirth: str
    livedTwoYears: str
    passportNumber: str
    placeOfIssue: str
    dateOfIssue: str
    dateOfExpiry: str
    otherPassportHeld: str
    houseNoStreet: str
    villageTownCity: str
    country: str
    stateProvince: str
    postalCode: str
    phoneNo: str
    mobileNo: Optional[str] = ""
    emailAddress: EmailStr
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
    pakistanConnection: str
    presentOccupation: str
    employerName: str
    designation: Optional[str] = ""
    employerAddress: str
    employerPhone: Optional[str] = ""
    pastOccupation: Optional[str] = ""
    militaryService: str
    pastOccupationIfAny: Optional[str] = ""
    typeOfVisa: str
    visaServiceType: str
    placesToVisit: str
    placesToVisitLine2: Optional[str] = ""
    hotelBooked: str
    durationOfVisa: str
    numberOfEntries: str
    portOfArrivalIndia: str
    expectedPortOfExit: Optional[str] = ""
    visitedIndiaBefore: str
    countriesVisited: str
    visitedSAARCCountries: str
    indiaReferenceName: str
    indiaReferenceAddress: str
    indiaReferencePhone: str
    homeReferenceName: str
    homeReferenceAddress: str
    homeReferencePhone: str
    arrestedConvicted: str
    refusedEntry: str
    humanTrafficking: str
    cyberCrime: str
    terroristViews: str
    asylumSought: str
    passportDocument: Optional[str] = ""
    photoDocument: Optional[str] = ""
    paymentStatus: Optional[str] = "completed"
    
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
