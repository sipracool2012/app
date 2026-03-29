from fastapi import APIRouter, HTTPException, status, Depends, Query, Response
from fastapi.responses import StreamingResponse
from models.application import ApplicationCreate, Application, ApplicationStatusUpdate
from utils.auth import get_current_user
from utils.email import send_application_confirmation, send_application_status_update
from datetime import datetime
from typing import List, Optional
from bson import ObjectId
from pathlib import Path
import csv
import io
import os

router = APIRouter(prefix="/api/applications", tags=["applications"])

# Get database instance
def get_db():
    from motor.motor_asyncio import AsyncIOMotorClient
    from dotenv import load_dotenv
    from pathlib import Path
    import os
    
    # Load environment variables
    ROOT_DIR = Path(__file__).parent.parent
    load_dotenv(ROOT_DIR / '.env')
    
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME', 'visa_app')
    client = AsyncIOMotorClient(mongo_url)
    return client[db_name]

db = get_db()


# ============ DRAFT ENDPOINTS ============

@router.patch("/draft", response_model=dict)
async def save_draft(
    draft_data: dict,
    user_id: str = Depends(get_current_user)
):
    """Save or update a draft application. One draft per user (upsert)."""
    now = datetime.utcnow()
    
    # Remove any _id field from incoming data
    draft_data.pop("_id", None)
    draft_data.pop("id", None)
    
    draft_data.update({
        "userId": user_id,
        "status": "draft",
        "updatedAt": now
    })
    
    existing = await db.applications.find_one({"userId": user_id, "status": "draft"})
    
    if existing:
        await db.applications.update_one(
            {"_id": existing["_id"]},
            {"$set": draft_data}
        )
        return {"message": "Draft updated", "draftId": str(existing["_id"])}
    else:
        draft_data["createdAt"] = now
        result = await db.applications.insert_one(draft_data)
        return {"message": "Draft created", "draftId": str(result.inserted_id)}


@router.get("/draft", response_model=dict)
async def get_draft(user_id: str = Depends(get_current_user)):
    """Get the current user's draft application."""
    draft = await db.applications.find_one(
        {"userId": user_id, "status": "draft"},
        {"_id": 0}
    )
    if not draft:
        return {"draft": None}
    return {"draft": draft}


@router.delete("/draft/{draft_id}", response_model=dict)
async def delete_draft(
    draft_id: str,
    user_id: str = Depends(get_current_user)
):
    """Delete a draft application."""
    result = await db.applications.delete_one(
        {"_id": ObjectId(draft_id), "userId": user_id, "status": "draft"}
    )
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Draft not found or not authorized"
        )
    return {"message": "Draft deleted"}


# ============ MY APPLICATIONS ============

@router.get("/my-applications", response_model=dict)
async def get_my_applications(user_id: str = Depends(get_current_user)):
    """Get all applications for the logged-in user."""
    cursor = db.applications.find({"userId": user_id}).sort("updatedAt", -1)
    applications = await cursor.to_list(length=500)
    
    result = []
    for app in applications:
        result.append({
            "id": str(app["_id"]),
            "applicationId": app.get("applicationId", ""),
            "status": app.get("status", "draft"),
            "visaService": app.get("visaService", ""),
            "visaServiceSubtype": app.get("visaServiceSubtype", ""),
            "surname": app.get("surname", ""),
            "givenNames": app.get("givenNames", ""),
            "email": app.get("email", ""),
            "currentStep": app.get("currentStep", 1),
            "createdAt": app.get("createdAt", datetime.utcnow()).isoformat() if isinstance(app.get("createdAt"), datetime) else str(app.get("createdAt", "")),
            "updatedAt": app.get("updatedAt", datetime.utcnow()).isoformat() if isinstance(app.get("updatedAt"), datetime) else str(app.get("updatedAt", "")),
            "submittedDate": app.get("submittedDate", "").isoformat() if isinstance(app.get("submittedDate"), datetime) else str(app.get("submittedDate", ""))
        })
    
    return {"applications": result, "total": len(result)}

BASE_DIR = Path(__file__).parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"

def generate_application_id() -> str:
    """Generate unique application ID using full timestamp"""
    timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
    return f"APP{timestamp}"


@router.post("/assign-id", response_model=dict)
async def assign_application_id(user_id: str = Depends(get_current_user)):
    """
    Generate an application ID for the user's draft and create the upload folder.
    Called when the user reaches the Document Upload step.
    """
    # Check if draft already has an application ID
    existing = await db.applications.find_one({"userId": user_id, "status": "draft"})
    if existing and existing.get("applicationId"):
        application_id = existing["applicationId"]
    else:
        application_id = generate_application_id()
        now = datetime.utcnow()
        if existing:
            await db.applications.update_one(
                {"_id": existing["_id"]},
                {"$set": {"applicationId": application_id, "updatedAt": now}}
            )
        else:
            await db.applications.insert_one({
                "userId": user_id,
                "applicationId": application_id,
                "status": "draft",
                "createdAt": now,
                "updatedAt": now
            })

    # Create the upload folder for this application
    app_folder = UPLOAD_DIR / application_id
    os.makedirs(app_folder, exist_ok=True)

    return {"applicationId": application_id}


@router.post("/generate-csv", response_model=dict)
async def generate_application_csv(
    application_data: dict,
    user_id: str = Depends(get_current_user)
):
    """
    Generate a transposed CSV file with all application data and save it to the
    uploads/{applicationId}/ folder. Called when user clicks Pay.
    """
    application_id = application_data.get("applicationId")
    if not application_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="applicationId is required"
        )

    app_folder = UPLOAD_DIR / application_id
    os.makedirs(app_folder, exist_ok=True)

    csv_path = app_folder / f"{application_id}_application.csv"

    # Write transposed CSV: one row per field (Field, Value)
    skip_fields = {"_id", "userId", "passportDocument", "photoDocument",
                   "businessLetter", "businessCard", "organizerInvitation",
                   "meaPoliticalClearance", "mhaEventClearance",
                   "medicalInvitationLetter", "confirmedTravelTicket",
                   "destinationVisaOrPassport"}

    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Field", "Value"])
        for key, value in application_data.items():
            if key not in skip_fields:
                writer.writerow([key, value if value is not None else ""])

    return {"success": True, "csvFile": f"{application_id}_application.csv"}


@router.post("", response_model=dict)
async def create_application(
    application_data: ApplicationCreate,
    user_id: str = Depends(get_current_user)
):
    """
    Create a new visa application. Also removes any existing draft for this user.
    """
    # Remove existing draft for this user
    await db.applications.delete_many({"userId": user_id, "status": "draft"})
    
    # Generate application ID
    application_id = generate_application_id()
    
    # Create application document
    app_dict = application_data.dict()
    app_dict.update({
        "applicationId": application_id,
        "userId": user_id,
        "status": "pending",
        "submittedDate": datetime.utcnow(),
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    })
    
    # Insert into database
    result = await db.applications.insert_one(app_dict)
    
    # Send confirmation email
    try:
        applicant_name = f"{application_data.givenNames} {application_data.surname}"
        send_application_confirmation(
            to_email=application_data.email,
            application_id=application_id,
            applicant_name=applicant_name
        )
    except Exception as e:
        print(f"Failed to send confirmation email: {e}")
    
    return {
        "id": application_id,
        "status": "pending",
        "submittedDate": app_dict["submittedDate"].isoformat()
    }

@router.get("", response_model=dict)
async def get_applications(
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    user_id: str = Depends(get_current_user)
):
    """
    Get all submitted applications (excludes drafts) for admin view.
    """
    # Build query - exclude drafts from admin view
    query = {"status": {"$ne": "draft"}}
    
    if status and status != "all":
        query["status"] = status
    
    if search:
        query["$or"] = [
            {"applicationId": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"surname": {"$regex": search, "$options": "i"}},
            {"givenNames": {"$regex": search, "$options": "i"}}
        ]
    
    # Fetch applications
    cursor = db.applications.find(query).sort("submittedDate", -1)
    applications = await cursor.to_list(length=1000)
    
    # Convert ObjectId to string
    for app in applications:
        app["_id"] = str(app["_id"])
        app["id"] = app.get("applicationId", str(app["_id"]))
    
    return {
        "applications": applications,
        "total": len(applications)
    }

@router.patch("/{application_id}/status", response_model=dict)
async def update_application_status(
    application_id: str,
    status_update: ApplicationStatusUpdate,
    user_id: str = Depends(get_current_user)
):
    """
    Update application status
    """
    # Find application
    application = await db.applications.find_one({"applicationId": application_id})
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Update status
    result = await db.applications.update_one(
        {"applicationId": application_id},
        {
            "$set": {
                "status": status_update.status,
                "updatedAt": datetime.utcnow()
            }
        }
    )
    
    # Send status update email
    if status_update.status in ["approved", "rejected"]:
        try:
            applicant_name = f"{application['givenNames']} {application['surname']}"
            send_application_status_update(
                to_email=application["email"],
                application_id=application_id,
                applicant_name=applicant_name,
                status=status_update.status
            )
        except Exception as e:
            print(f"Failed to send status update email: {e}")
    
    return {
        "id": application_id,
        "status": status_update.status
    }

@router.get("/export")
async def export_applications(
    ids: Optional[str] = Query(None),
    user_id: str = Depends(get_current_user)
):
    """
    Export applications to CSV
    """
    # Build query
    query = {}
    if ids:
        app_ids = ids.split(',')
        query["applicationId"] = {"$in": app_ids}
    
    # Fetch applications
    cursor = db.applications.find(query).sort("submittedDate", -1)
    applications = await cursor.to_list(length=10000)
    
    if not applications:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No applications found"
        )
    
    # Create CSV
    output = io.StringIO()
    
    # Define CSV headers matching the required format
    headers = [
        'Application ID', 'Status', 'Submitted Date', 'Passport Type', 'Nationality',
        'Port of Arrival', 'Date of Birth', 'Email', 'Expected Arrival Date',
        'Visa Service', 'Visa Service Subtype', 'Surname', 'Given Names',
        'Gender', 'Town of Birth', 'Country of Birth', 'Religion',
        'Educational Qualification', 'Qualification From', 'Passport Number',
        'Place of Issue', 'Date of Issue', 'Date of Expiry', 'House No/Street',
        'Village/Town/City', 'Country', 'State/Province', 'Postal Code',
        'Phone No', 'Mobile No', 'Father Name', 'Father Nationality',
        'Mother Name', 'Mother Nationality', 'Marital Status', 'Spouse Name',
        'Present Occupation', 'Employer Name', 'Designation', 'Employer Address',
        'Type of Visa', 'Places to Visit', 'Duration of Visa', 'Number of Entries',
        'Port of Arrival India', 'Visited India Before', 'Countries Visited',
        'India Reference Name', 'India Reference Address', 'India Reference Phone',
        'Home Reference Name', 'Home Reference Address', 'Home Reference Phone'
    ]
    
    writer = csv.writer(output)
    writer.writerow(headers)
    
    # Write data rows
    for app in applications:
        row = [
            app.get('applicationId', ''),
            app.get('status', ''),
            app.get('submittedDate', ''),
            app.get('passportType', ''),
            app.get('nationality', ''),
            app.get('portOfArrival', ''),
            app.get('dateOfBirth', ''),
            app.get('email', ''),
            app.get('expectedArrivalDate', ''),
            app.get('visaService', ''),
            app.get('visaServiceSubtype', ''),
            app.get('surname', ''),
            app.get('givenNames', ''),
            app.get('gender', ''),
            app.get('townOfBirth', ''),
            app.get('countryOfBirth', ''),
            app.get('religion', ''),
            app.get('educationalQualification', ''),
            app.get('qualificationFrom', ''),
            app.get('passportNumber', ''),
            app.get('placeOfIssue', ''),
            app.get('dateOfIssue', ''),
            app.get('dateOfExpiry', ''),
            app.get('houseNoStreet', ''),
            app.get('villageTownCity', ''),
            app.get('country', ''),
            app.get('stateProvince', ''),
            app.get('postalCode', ''),
            app.get('phoneNo', ''),
            app.get('mobileNo', ''),
            app.get('fatherName', ''),
            app.get('fatherNationality', ''),
            app.get('motherName', ''),
            app.get('motherNationality', ''),
            app.get('maritalStatus', ''),
            app.get('spouseName', ''),
            app.get('presentOccupation', ''),
            app.get('employerName', ''),
            app.get('designation', ''),
            app.get('employerAddress', ''),
            app.get('typeOfVisa', ''),
            app.get('placesToVisit', ''),
            app.get('durationOfVisa', ''),
            app.get('numberOfEntries', ''),
            app.get('portOfArrivalIndia', ''),
            app.get('visitedIndiaBefore', ''),
            app.get('countriesVisited', ''),
            app.get('indiaReferenceName', ''),
            app.get('indiaReferenceAddress', ''),
            app.get('indiaReferencePhone', ''),
            app.get('homeReferenceName', ''),
            app.get('homeReferenceAddress', ''),
            app.get('homeReferencePhone', '')
        ]
        writer.writerow(row)
    
    # Create response
    output.seek(0)
    filename = f"visa_applications_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.csv"
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/{application_id}/documents")
async def get_application_documents(
    application_id: str,
    user_id: str = Depends(get_current_user)
):
    """
    Get presigned URLs for application documents
    """
    from utils.s3 import generate_presigned_url
    
    # Find application
    application = await db.applications.find_one({"applicationId": application_id})
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Generate presigned URLs
    passport_url = ""
    photo_url = ""
    
    if application.get("passportDocument"):
        passport_url = generate_presigned_url(application["passportDocument"])
    
    if application.get("photoDocument"):
        photo_url = generate_presigned_url(application["photoDocument"])
    
    return {
        "passport": passport_url,
        "photo": photo_url
    }
