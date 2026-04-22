from fastapi import FastAPI, APIRouter, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from datetime import datetime, timedelta
from pathlib import Path
from urllib.parse import urlparse
from utils.constants import now_ist

# Import routes
from routes import auth, applications, upload, countries, constants, payment_gateways, email_providers, utility

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Clear eVisa Visa Application API")

# Custom middleware to enforce origin restrictions for /api/* routes
class OriginValidationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Only enforce for /api routes
        if request.url.path.startswith("/api/"):
            origin = request.headers.get("origin", "").lower()
            referer = request.headers.get("referer", "").lower()
            
            # Allowed origins
            allowed_origins = [
                "https://clearevisa.com",
                "http://localhost",
                "http://127.0.0.1"
            ]
            
            # Check if origin or referer is valid
            is_valid_origin = any(
                origin == allowed or origin.startswith(allowed) 
                for allowed in allowed_origins
            )
            is_valid_referer = any(
                referer.startswith(allowed) 
                for allowed in allowed_origins
            )
            
            # If origin header exists, must be valid
            if origin and not is_valid_origin:
                return JSONResponse(
                    status_code=404,
                    content={"detail": "Not found"}
                )
            
            # If referer exists but origin doesn't, check referer
            if not origin and referer and not is_valid_referer:
                return JSONResponse(
                    status_code=404,
                    content={"detail": "Not found"}
                )
            
            # Block requests without origin/referer (external scripts, curl, postman)
            if not origin and not referer:
                return JSONResponse(
                    status_code=404,
                    content={"detail": "Not found"}
                )
        
        response = await call_next(request)
        return response

app.add_middleware(OriginValidationMiddleware)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "Clear eVisa Visa Application API", "status": "running"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include routers
app.include_router(auth.router)
app.include_router(applications.router)
app.include_router(upload.router)
app.include_router(countries.router)
app.include_router(constants.router)
app.include_router(payment_gateways.router, prefix="/api/payment-gateways", tags=["payment-gateways"])
app.include_router(email_providers.router, prefix="/api/email-providers", tags=["email-providers"])
app.include_router(utility.router, prefix="/api/utility", tags=["utility"])
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "https://clearevisa.com",
        "http://localhost:3000",  # For development
        "http://127.0.0.1:3000"   # For development
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Clear eVisa Visa Application API")
    logger.info(f"Connected to MongoDB: {os.environ.get('DB_NAME')}")
    asyncio.create_task(draft_expiry_cleanup_loop())
    asyncio.create_task(paid_to_pending_review_loop())


async def draft_expiry_cleanup_loop():
    """Background task: every 60 seconds delete expired draft applications."""
    while True:
        try:
            now = now_ist()
            result = await db.applications.delete_many({
                "status": "draft",
                "expiresAt": {"$lt": now}
            })
            if result.deleted_count:
                logger.info(f"Draft cleanup: deleted {result.deleted_count} expired draft(s).")
        except Exception as e:
            logger.error(f"Draft cleanup error: {e}")
        await asyncio.sleep(60)


async def paid_to_pending_review_loop():
    """Background task: every 60 seconds promote 'paid' applications to 'pending_review'
    once they have been in that state for at least 1 hour."""
    while True:
        try:
            cutoff = now_ist() - timedelta(hours=1)
            result = await db.applications.update_many(
                {
                    "status": "paid",
                    "paidAt": {"$lt": cutoff}
                },
                {
                    "$set": {
                        "status": "pending_review",
                        "updatedAt": now_ist()
                    }
                }
            )
            if result.modified_count:
                logger.info(f"Auto-promoted {result.modified_count} paid application(s) to pending_review.")
        except Exception as e:
            logger.error(f"Paid→pending_review promotion error: {e}")
        await asyncio.sleep(60)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("Shutting down API")
