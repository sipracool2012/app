import os
import logging
import mailchimp_transactional
from mailchimp_transactional.api_client import ApiClientError

logger = logging.getLogger(__name__)

# Mandrill (Mailchimp Transactional) Configuration
MANDRILL_API_KEY = os.environ.get("MANDRILL_API_KEY", "")
FROM_EMAIL = os.environ.get("FROM_EMAIL", "no-reply@clearevisa.com")
FROM_NAME = os.environ.get("FROM_NAME", "Clear eVisa")


def send_email(to_email: str, subject: str, html_content: str) -> bool:
    """
    Send a transactional email via the Mandrill API.

    Args:
        to_email: Recipient email address
        subject: Email subject line
        html_content: HTML body of the email
    Returns:
        True if the message was queued/sent successfully, False otherwise
    """
    if not MANDRILL_API_KEY:
        logger.warning("MANDRILL_API_KEY not configured – skipping email send")
        return False

    try:
        client = mailchimp_transactional.Client(MANDRILL_API_KEY)

        message = {
            "from_email": FROM_EMAIL,
            "from_name": FROM_NAME,
            "to": [{"email": to_email, "type": "to"}],
            "subject": subject,
            "html": html_content,
            "track_opens": True,
            "track_clicks": True,
            "auto_text": True,
        }

        response = client.messages.send({"message": message})

        # response is a list; each item has a 'status' field
        if isinstance(response, list) and response:
            sent_status = response[0].get("status")
            if sent_status in ("sent", "queued", "scheduled"):
                logger.info(f"Email sent via Mandrill to {to_email} (status: {sent_status})")
                return True
            else:
                logger.warning(f"Mandrill returned unexpected status '{sent_status}' for {to_email}")
                return False

        logger.warning(f"Unexpected Mandrill response format: {response}")
        return False

    except ApiClientError as e:
        logger.error(f"Mandrill API error sending to {to_email}: {e.text}")
        return False
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
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
