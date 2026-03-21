import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import logging

logger = logging.getLogger(__name__)

# Email Configuration
SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
FROM_EMAIL = os.environ.get("FROM_EMAIL", SMTP_USER)

def send_email(to_email: str, subject: str, html_content: str) -> bool:
    """
    Send email using SMTP
    Args:
        to_email: Recipient email address
        subject: Email subject
        html_content: HTML email body
    Returns:
        True if sent successfully, False otherwise
    """
    if not SMTP_USER or not SMTP_PASSWORD:
        logger.warning("SMTP credentials not configured, skipping email")
        return False
    
    try:
        # Create message
        message = MIMEMultipart('alternative')
        message['Subject'] = subject
        message['From'] = FROM_EMAIL
        message['To'] = to_email
        
        # Attach HTML content
        html_part = MIMEText(html_content, 'html')
        message.attach(html_part)
        
        # Send email
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(message)
        
        logger.info(f"Email sent successfully to {to_email}")
        return True
    
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        return False

def send_application_confirmation(to_email: str, application_id: str, applicant_name: str) -> bool:
    """
    Send application confirmation email
    """
    subject = f"Visa Application Confirmation - {application_id}"
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Clear eVisa°</h1>
            </div>
            <div style="padding: 30px; background-color: #f9fafb;">
                <h2 style="color: #1f2937;">Application Submitted Successfully!</h2>
                <p style="color: #4b5563; font-size: 16px;">Dear {applicant_name},</p>
                <p style="color: #4b5563; font-size: 16px;">
                    Thank you for submitting your visa application. We have received your application and it is being processed.
                </p>
                <div style="background-color: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #1e40af; font-weight: bold;">Your Application ID:</p>
                    <p style="margin: 5px 0 0 0; color: #1e40af; font-size: 24px; font-weight: bold;">{application_id}</p>
                </div>
                <h3 style="color: #1f2937;">What happens next?</h3>
                <ul style="color: #4b5563; line-height: 1.8;">
                    <li>Our team will review your application within 5 business days</li>
                    <li>You will receive an email notification once your application status changes</li>
                    <li>Once approved, your eVisa will be sent to your email address</li>
                </ul>
                <p style="color: #4b5563; font-size: 14px; margin-top: 30px;">
                    If you have any questions, please contact our support team.
                </p>
            </div>
            <div style="background-color: #1f2937; padding: 20px; text-align: center;">
                <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                    © 2026 Clear eVisa. All rights reserved.
                </p>
            </div>
        </body>
    </html>
    """
    return send_email(to_email, subject, html_content)

def send_application_status_update(to_email: str, application_id: str, applicant_name: str, status: str) -> bool:
    """
    Send application status update email
    """
    status_messages = {
        'approved': {
            'title': 'Visa Application Approved!',
            'message': 'Congratulations! Your visa application has been approved.',
            'color': '#10b981'
        },
        'rejected': {
            'title': 'Visa Application Update',
            'message': 'Unfortunately, your visa application has been rejected. Please contact support for more information.',
            'color': '#ef4444'
        }
    }
    
    status_info = status_messages.get(status, status_messages['approved'])
    
    subject = f"Visa Application Update - {application_id}"
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Clear eVisa</h1>
            </div>
            <div style="padding: 30px; background-color: #f9fafb;">
                <h2 style="color: #1f2937;">{status_info['title']}</h2>
                <p style="color: #4b5563; font-size: 16px;">Dear {applicant_name},</p>
                <p style="color: #4b5563; font-size: 16px;">
                    {status_info['message']}
                </p>
                <div style="background-color: #dbeafe; border-left: 4px solid {status_info['color']}; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #1e40af; font-weight: bold;">Application ID:</p>
                    <p style="margin: 5px 0 0 0; color: #1e40af; font-size: 20px; font-weight: bold;">{application_id}</p>
                    <p style="margin: 10px 0 0 0; color: #1e40af; font-weight: bold;">Status: <span style="text-transform: uppercase;">{status}</span></p>
                </div>
                <p style="color: #4b5563; font-size: 14px; margin-top: 30px;">
                    If you have any questions, please contact our support team.
                </p>
            </div>
            <div style="background-color: #1f2937; padding: 20px; text-align: center;">
                <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                    © 2026 Clear eVisa. All rights reserved.
                </p>
            </div>
        </body>
    </html>
    """
    return send_email(to_email, subject, html_content)
