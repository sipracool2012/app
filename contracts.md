# API Contracts & Integration Plan

## Overview
This document outlines the API contracts between frontend and backend for the Sherpa Visa Application Clone.

## Current Mock Data (to be replaced with actual APIs)
- `mockData.js`: Contains visa options, countries, testimonials
- `localStorage`: Used for users, applications, authentication

## API Endpoints

### 1. Authentication APIs

#### POST /api/auth/register
**Request:**
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "string",
    "fullName": "string",
    "email": "string"
  }
}
```

#### POST /api/auth/login
**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "string",
    "fullName": "string",
    "email": "string"
  }
}
```

#### GET /api/auth/me
**Headers:** Authorization: Bearer {token}
**Response:**
```json
{
  "id": "string",
  "fullName": "string",
  "email": "string"
}
```

### 2. Visa Application APIs

#### POST /api/applications
**Headers:** Authorization: Bearer {token}
**Request:** (All form data from 13 steps)
```json
{
  "passportType": "string",
  "nationality": "string",
  ...all other fields from CSV
}
```
**Response:**
```json
{
  "id": "APP123456",
  "status": "pending",
  "submittedDate": "ISO date string"
}
```

#### GET /api/applications
**Headers:** Authorization: Bearer {token}
**Query Params:** ?status=pending&search=term
**Response:**
```json
{
  "applications": [
    {
      "id": "string",
      "status": "pending|approved|rejected",
      "submittedDate": "ISO date",
      "surname": "string",
      "givenNames": "string",
      "email": "string",
      ...
    }
  ],
  "total": 0
}
```

#### PATCH /api/applications/{id}/status
**Headers:** Authorization: Bearer {token}
**Request:**
```json
{
  "status": "pending|approved|rejected"
}
```
**Response:**
```json
{
  "id": "string",
  "status": "string"
}
```

#### GET /api/applications/export
**Headers:** Authorization: Bearer {token}
**Query Params:** ?ids=APP001,APP002 or no ids for all
**Response:** CSV file download

### 3. File Upload APIs

#### POST /api/upload/passport
**Headers:** Authorization: Bearer {token}
**Request:** multipart/form-data with file
**Response:**
```json
{
  "url": "s3_url",
  "key": "APP_ID_passport.ext"
}
```

#### POST /api/upload/photo
**Headers:** Authorization: Bearer {token}
**Request:** multipart/form-data with file
**Response:**
```json
{
  "url": "s3_url",
  "key": "APP_ID_photo.ext"
}
```

#### GET /api/applications/{id}/documents
**Headers:** Authorization: Bearer {token}
**Response:**
```json
{
  "passport": "s3_presigned_url",
  "photo": "s3_presigned_url"
}
```

### 4. Email Notifications
**Triggered automatically on:**
- Application submission → Send confirmation email with APP_ID
- Status change to "approved" → Send approval email with eVisa details
- Status change to "rejected" → Send rejection email

## Database Models

### User Model
```python
{
  "_id": ObjectId,
  "fullName": str,
  "email": str (unique),
  "password": str (hashed),
  "createdAt": datetime,
  "updatedAt": datetime
}
```

### Application Model
```python
{
  "_id": ObjectId,
  "id": str (APP123456),
  "userId": ObjectId,
  "status": str (pending|approved|rejected),
  "submittedDate": datetime,
  
  # Step 1: Basic Info
  "passportType": str,
  "nationality": str,
  "portOfArrival": str,
  "dateOfBirth": str,
  "email": str,
  "expectedArrivalDate": str,
  "visaService": str,
  "visaServiceSubtype": str,
  
  # Step 2: Applicant Details
  "surname": str,
  "givenNames": str,
  "gender": str,
  "applicantDateOfBirth": str,
  "townOfBirth": str,
  "countryOfBirth": str,
  "citizenshipNo": str,
  "religion": str,
  "visibleMarks": str,
  "educationalQualification": str,
  "qualificationFrom": str,
  "applicantNationality": str,
  "nationalityByBirth": str,
  "livedTwoYears": str,
  
  # Step 3: Passport Details
  "passportNumber": str,
  "placeOfIssue": str,
  "dateOfIssue": str,
  "dateOfExpiry": str,
  "otherPassportHeld": str,
  
  # Step 4: Address Details
  "houseNoStreet": str,
  "villageTownCity": str,
  "country": str,
  "stateProvince": str,
  "postalCode": str,
  "phoneNo": str,
  "mobileNo": str,
  "emailAddress": str,
  
  # Step 5: Family Details
  "fatherName": str,
  "fatherNationality": str,
  "fatherPlaceOfBirth": str,
  "fatherCountryOfBirth": str,
  "motherName": str,
  "motherNationality": str,
  "motherPlaceOfBirth": str,
  "motherCountryOfBirth": str,
  "maritalStatus": str,
  "spouseName": str,
  "spouseNationality": str,
  "spousePlaceOfBirth": str,
  "spouseCountryOfBirth": str,
  "pakistanConnection": str,
  
  # Step 6: Professional Details
  "presentOccupation": str,
  "employerName": str,
  "designation": str,
  "employerAddress": str,
  "employerPhone": str,
  "militaryService": str,
  
  # Step 7: Visa Details
  "typeOfVisa": str,
  "visaServiceType": str,
  "placesToVisit": str,
  "durationOfVisa": str,
  "numberOfEntries": str,
  "portOfArrivalIndia": str,
  
  # Step 8: Previous Visit
  "visitedIndiaBefore": str,
  
  # Step 9: Other Info
  "countriesVisited": str,
  "visitedSAARCCountries": str,
  
  # Step 10: References
  "indiaReferenceName": str,
  "indiaReferenceAddress": str,
  "indiaReferencePhone": str,
  "homeReferenceName": str,
  "homeReferenceAddress": str,
  "homeReferencePhone": str,
  
  # Step 11: Additional Questions
  "arrestedConvicted": str,
  "refusedEntry": str,
  "humanTrafficking": str,
  "cyberCrime": str,
  "terroristViews": str,
  "asylumSought": str,
  
  # Step 12: Documents
  "passportDocument": str (S3 key),
  "photoDocument": str (S3 key),
  
  # Payment
  "paymentStatus": str,
  
  "createdAt": datetime,
  "updatedAt": datetime
}
```

## Frontend Integration Changes

### Files to Update:
1. **SignIn.jsx** - Replace localStorage with API call to /api/auth/login
2. **SignUp.jsx** - Replace localStorage with API call to /api/auth/register
3. **VisaApplication.jsx** - Replace localStorage save with API call to /api/applications
4. **Step12DocumentUpload.jsx** - Implement actual S3 upload via /api/upload/*
5. **AdminPanel.jsx** - Replace localStorage with API calls to /api/applications
6. **App.js** - Add token management and API interceptor

### New Files to Create:
1. **utils/api.js** - Axios instance with interceptors
2. **utils/auth.js** - Token storage/retrieval helpers

## AWS S3 Configuration
- Bucket name: Will be configured via environment variable
- File naming: `{APP_ID}_passport.{ext}` and `{APP_ID}_photo.{ext}`
- Access: Private with presigned URLs for admin access

## Email Configuration
- SMTP server details via environment variables
- Templates for: confirmation, approval, rejection emails
