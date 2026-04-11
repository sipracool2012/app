from fastapi import APIRouter, HTTPException, status, Depends, Query, Response
from fastapi.responses import StreamingResponse
from models.application import ApplicationCreate, Application, ApplicationStatusUpdate
from utils.auth import get_current_user
from utils.email import send_application_confirmation, send_application_status_update
from utils.constants import now_ist
from utils.etourist_csv import save_etourist_csv
from datetime import datetime, timedelta
from typing import List, Optional
from bson import ObjectId
from pathlib import Path
import csv
import io
import os
import secrets

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


def generate_temp_id() -> str:
    """Generate a temporary application ID: TEMP{DDMMYYYY}{HHMMSS}"""
    now = now_ist()
    return f"TEMP{now.strftime('%d%m%Y%H%M%S')}"


async def get_expiry_delta() -> timedelta:
    """Read draft expiry config from utility_settings. Default: 7 days."""
    doc = await db.utility_settings.find_one({})
    if not doc:
        return timedelta(days=7)
    days = doc.get("draft_expiry_days", 7)
    hours = doc.get("draft_expiry_hours", 0)
    minutes = doc.get("draft_expiry_minutes", 0)
    seconds = doc.get("draft_expiry_seconds", 0)
    total = timedelta(days=days, hours=hours, minutes=minutes, seconds=seconds)
    # Ensure at least 1 minute to avoid immediate deletion
    return total if total.total_seconds() > 0 else timedelta(days=7)


# ============ DRAFT ENDPOINTS ============

@router.patch("/draft", response_model=dict)
async def save_draft(
    draft_data: dict,
    user_id: str = Depends(get_current_user)
):
    """Save or update a draft application. Supports multiple drafts per user per visa (family members).
    If __draftId is present in the payload, update that specific draft.
    If not, always create a new draft (no per-visa deduplication).
    Also assigns a TEMP ID on first save and resets/extends expiresAt on every save."""
    now = now_ist()

    # Extract the target draft ID (if updating an existing draft)
    draft_id_str = draft_data.pop("__draftId", None)

    # Remove any _id field from incoming data
    draft_data.pop("_id", None)
    draft_data.pop("id", None)

    # Security: never allow an APP ID to be written via save_draft.
    # APP IDs are assigned exclusively by /assign-id; if the payload carries an APP ID
    # that was already assigned to a *different* or paid application, strip it so we
    # don't accidentally duplicate IDs across documents.
    incoming_app_id = draft_data.get("applicationId", "")
    if incoming_app_id and not incoming_app_id.startswith("TEMP"):
        existing_app = await db.applications.find_one(
            {"applicationId": incoming_app_id, "status": {"$ne": "draft"}}
        )
        if existing_app:
            draft_data.pop("applicationId", None)

    expiry_delta = await get_expiry_delta()
    expires_at = now + expiry_delta

    draft_data.update({
        "userId": user_id,
        "status": "draft",
        "updatedAt": now,
        "expiresAt": expires_at,
    })

    if draft_id_str:
        # Update the specific draft referenced by draftId
        try:
            target_oid = ObjectId(draft_id_str)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid draftId format")

        existing = await db.applications.find_one(
            {"_id": target_oid, "userId": user_id, "status": "draft"}
        )
        if not existing:
            raise HTTPException(status_code=404, detail="Draft not found")

        # Preserve existing APP ID if payload doesn't carry one
        if not draft_data.get("applicationId") and existing.get("applicationId"):
            draft_data["applicationId"] = existing["applicationId"]

        await db.applications.update_one(
            {"_id": target_oid},
            {"$set": draft_data}
        )
        return {
            "message": "Draft updated",
            "draftId": draft_id_str,
            "tempId": draft_data.get("applicationId", existing.get("applicationId", "")),
            "expiresAt": expires_at.isoformat(),
        }
    else:
        # Create a new draft — multiple drafts per visa are supported (e.g. family members)
        draft_data["createdAt"] = now
        if not draft_data.get("applicationId"):
            draft_data["applicationId"] = generate_temp_id()
        result = await db.applications.insert_one(draft_data)
        return {
            "message": "Draft created",
            "draftId": str(result.inserted_id),
            "tempId": draft_data["applicationId"],
            "expiresAt": expires_at.isoformat(),
        }


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


@router.get("/drafts", response_model=dict)
async def get_all_drafts(user_id: str = Depends(get_current_user)):
    """Get all draft applications for the logged-in user, newest first."""
    cursor = db.applications.find(
        {"userId": user_id, "status": "draft"}
    ).sort("updatedAt", -1)
    raw = await cursor.to_list(length=100)
    drafts = []
    for doc in raw:
        doc["id"] = str(doc.pop("_id"))
        drafts.append(doc)
    return {"drafts": drafts}


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


@router.delete("/draft", response_model=dict)
async def delete_my_draft(user_id: str = Depends(get_current_user)):
    """Delete the current user's draft application (no ID needed)."""
    result = await db.applications.delete_one({"userId": user_id, "status": "draft"})
    return {"message": "Draft deleted" if result.deleted_count else "No draft found"}


# ============ MY APPLICATIONS ============

@router.get("/my-applications", response_model=dict)
async def get_my_applications(user_id: str = Depends(get_current_user)):
    """Get all applications for the logged-in user."""
    cursor = db.applications.find({"userId": user_id}).sort("updatedAt", -1)
    applications = await cursor.to_list(length=500)
    
    result = []
    for app in applications:
        # Resolve visaId: stored directly, or fall back to selectedVisaOption.id for older records
        visa_id = app.get("visaId") or (app.get("selectedVisaOption") or {}).get("id", "")
        result.append({
            "id": str(app["_id"]),
            "applicationId": app.get("applicationId", ""),
            "status": app.get("status", "draft"),
            "visaId": visa_id,
            "visaService": app.get("visaService", ""),
            "visaServiceSubtype": app.get("visaServiceSubtype", ""),
            "visaOptionName": (app.get("selectedVisaOption") or {}).get("name", ""),
            "passportName": app.get("passportName", ""),
            "passportDemonym": app.get("passportDemonym", ""),
            "surname": app.get("surname", ""),
            "givenNames": app.get("givenNames", ""),
            "email": app.get("email", ""),
            "nationality": app.get("nationality", ""),
            "passportCountryCode": (visa_id.split("-")[0].upper() if visa_id else ""),
            "currentStep": app.get("currentStep", 1),
            "createdAt": app.get("createdAt", now_ist()).isoformat() if isinstance(app.get("createdAt"), datetime) else str(app.get("createdAt", "")),
            "updatedAt": app.get("updatedAt", now_ist()).isoformat() if isinstance(app.get("updatedAt"), datetime) else str(app.get("updatedAt", "")),
            "submittedDate": app.get("submittedDate", "").isoformat() if isinstance(app.get("submittedDate"), datetime) else str(app.get("submittedDate", "")),
            "paidAt": app.get("paidAt", "").isoformat() if isinstance(app.get("paidAt"), datetime) else str(app.get("paidAt", "")),
            "expiresAt": app["expiresAt"].isoformat() if isinstance(app.get("expiresAt"), datetime) else str(app.get("expiresAt", "")),
        })
    
    return {"applications": result, "total": len(result)}

BASE_DIR = Path(__file__).parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"

def generate_application_id() -> str:
    """Generate unique application ID: APP{timestamp}{6-char hex} to avoid timestamp collisions."""
    timestamp = now_ist().strftime('%Y%m%d%H%M%S')
    suffix = secrets.token_hex(3).upper()  # 6 hex chars
    return f"APP{timestamp}{suffix}"


@router.post("/assign-id", response_model=dict)
async def assign_application_id(
    body: dict = {},
    user_id: str = Depends(get_current_user)
):
    """
    Generate a permanent APP ID for the user's draft and create the upload folder.
    Replaces any existing TEMP ID. Called when the user reaches the Document Upload step.
    Accepts draftId (MongoDB _id string) to scope the lookup to the exact draft,
    falling back to userId+visaId if not provided.
    """
    from bson import ObjectId
    now = now_ist()
    visa_id = body.get("visaId") if body else None
    draft_id_str = body.get("draftId") if body else None

    # Build query scoped to the correct draft
    if draft_id_str:
        try:
            draft_query: dict = {"_id": ObjectId(draft_id_str), "userId": user_id, "status": "draft"}
        except Exception:
            draft_query = {"userId": user_id, "status": "draft"}
            if visa_id:
                draft_query["visaId"] = visa_id
    else:
        draft_query = {"userId": user_id, "status": "draft"}
        if visa_id:
            draft_query["visaId"] = visa_id

    existing = await db.applications.find_one(draft_query)
    existing_id = existing.get("applicationId", "") if existing else ""

    # Assign a new APP ID if there's no ID yet or the current one is a TEMP placeholder
    if not existing_id or existing_id.startswith("TEMP"):
        # Keep generating until we find a unique ID (extremely rare collision guard)
        for _ in range(10):
            candidate = generate_application_id()
            clash = await db.applications.find_one({"applicationId": candidate})
            if not clash:
                application_id = candidate
                break
        else:
            application_id = generate_application_id()  # last resort

        if existing:
            await db.applications.update_one(
                {"_id": existing["_id"]},
                {"$set": {"applicationId": application_id, "updatedAt": now}}
            )
            # Rename the TEMP folder to the new APP folder if it exists
            if existing_id:
                old_folder = UPLOAD_DIR / existing_id
                new_folder = UPLOAD_DIR / application_id
                if old_folder.exists() and not new_folder.exists():
                    old_folder.rename(new_folder)
                    # Rename any files inside that still carry the old TEMP prefix
                    for f in new_folder.iterdir():
                        if f.is_file() and f.name.startswith(existing_id):
                            f.rename(new_folder / f.name.replace(existing_id, application_id, 1))
        else:
            await db.applications.insert_one({
                "userId": user_id,
                "visaId": visa_id,
                "applicationId": application_id,
                "status": "draft",
                "createdAt": now,
                "updatedAt": now
            })
    else:
        application_id = existing_id

    # Create the upload folder for this application (no-op if already exists)
    app_folder = UPLOAD_DIR / application_id
    os.makedirs(app_folder, exist_ok=True)

    return {"applicationId": application_id}


@router.post("/generate-csv", response_model=dict)
async def generate_application_csv(
    application_data: dict,
    user_id: str = Depends(get_current_user)
):
    """
    Generate an eTourist-format CSV fill-in sheet and save it to the
    uploads/{applicationId}/ folder. Called when user clicks Pay.
    """
    application_id = application_data.get("applicationId")
    if not application_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="applicationId is required"
        )

    csv_path = UPLOAD_DIR / application_id / f"{application_id}_application.csv"
    save_etourist_csv(application_data, csv_path)

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
        "submittedDate": now_ist(),
        "createdAt": now_ist(),
        "updatedAt": now_ist()
    })
    
    # Insert into database
    result = await db.applications.insert_one(app_dict)
    
    # Send confirmation email
    try:
        applicant_name = f"{application_data.givenNames} {application_data.surname}"
        await send_application_confirmation(
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
    include_drafts: bool = Query(False),
    user_id: str = Depends(get_current_user)
):
    """
    Get all submitted applications for admin view.
    Pass status=draft to see draft/ongoing applications.
    Pass include_drafts=true to include drafts in the results.
    By default, drafts are excluded.
    """
    # Build query
    if status and status != "all":
        query = {"status": status}
    elif include_drafts:
        # No status restriction — return everything including drafts
        query = {}
    else:
        # Exclude drafts by default
        query = {"status": {"$ne": "draft"}}
    
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
                "updatedAt": now_ist()
            }
        }
    )
    
    # Send status update email
    if status_update.status in ["approved", "rejected"]:
        import logging as _logging
        _logger = _logging.getLogger(__name__)
        try:
            applicant_name = f"{application.get('givenNames', '')} {application.get('surname', '')}".strip()
            email_sent = await send_application_status_update(
                to_email=application["email"],
                application_id=application_id,
                applicant_name=applicant_name,
                status=status_update.status
            )
            if not email_sent:
                _logger.error(
                    f"Email delivery failed for {status_update.status} notification "
                    f"to {application['email']} (app {application_id}) – all providers failed"
                )
        except Exception as e:
            _logger.exception(
                f"Exception sending {status_update.status} email to {application.get('email')} "
                f"(app {application_id}): {e}"
            )
    
    return {
        "id": application_id,
        "status": status_update.status
    }

@router.get("/{application_id}/etourist-csv")
async def download_etourist_csv(
    application_id: str,
    user_id: str = Depends(get_current_user)
):
    """
    Generate and stream an eTourist-format fill-in CSV for a single application.
    Always re-generates from the latest DB data so edits are reflected immediately.
    """
    from utils.etourist_csv import generate_etourist_csv

    application = await db.applications.find_one({"applicationId": application_id})
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    # Remove MongoDB internals before passing to the CSV generator
    application.pop("_id", None)

    csv_content = generate_etourist_csv(application)
    filename = f"{application_id}_application.csv"

    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

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
    filename = f"visa_applications_{now_ist().strftime('%Y%m%d_%H%M%S')}.csv"
    
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
