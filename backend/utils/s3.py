import os
import boto3
from botocore.exceptions import ClientError
from fastapi import UploadFile
from typing import Tuple
import logging

logger = logging.getLogger(__name__)

# AWS S3 Configuration
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID", "")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY", "")
AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")
S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME", "visa-documents")

# Initialize S3 client
try:
    s3_client = boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )
    logger.info("S3 client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize S3 client: {e}")
    s3_client = None

async def upload_file_to_s3(file: UploadFile, application_id: str, file_type: str) -> Tuple[bool, str, str]:
    """
    Upload file to S3
    Args:
        file: UploadFile object
        application_id: Application ID (e.g., APP123456)
        file_type: 'passport' or 'photo'
    Returns:
        Tuple of (success: bool, s3_key: str, error_message: str)
    """
    if not s3_client:
        logger.warning("S3 client not initialized, skipping upload")
        return False, "", "S3 not configured"
    
    try:
        # Get file extension
        filename = file.filename
        extension = filename.split('.')[-1] if '.' in filename else 'jpg'
        
        # Create S3 key with naming convention: APP_ID_type.ext
        s3_key = f"{application_id}_{file_type}.{extension}"
        
        # Read file content
        file_content = await file.read()
        
        # Upload to S3
        s3_client.put_object(
            Bucket=S3_BUCKET_NAME,
            Key=s3_key,
            Body=file_content,
            ContentType=file.content_type
        )
        
        logger.info(f"File uploaded successfully: {s3_key}")
        return True, s3_key, ""
    
    except ClientError as e:
        error_msg = f"Failed to upload to S3: {str(e)}"
        logger.error(error_msg)
        return False, "", error_msg
    except Exception as e:
        error_msg = f"Unexpected error during upload: {str(e)}"
        logger.error(error_msg)
        return False, "", error_msg

def generate_presigned_url(s3_key: str, expiration: int = 3600) -> str:
    """
    Generate presigned URL for S3 object
    Args:
        s3_key: S3 object key
        expiration: URL expiration time in seconds (default 1 hour)
    Returns:
        Presigned URL string or empty string on error
    """
    if not s3_client:
        return ""
    
    try:
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': S3_BUCKET_NAME, 'Key': s3_key},
            ExpiresIn=expiration
        )
        return url
    except ClientError as e:
        logger.error(f"Failed to generate presigned URL: {e}")
        return ""
