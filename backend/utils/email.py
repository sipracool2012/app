"""
Email utility helpers
======================
All transactional email delivery is delegated to the unified email provider
dispatcher (utils.email_providers), which supports Mandrill, SendPulse, and
Postmark with automatic fallback.

# CHANGELOG REMINDER: Update CHANGELOG.md when adding or changing email templates.
"""

import logging

logger = logging.getLogger(__name__)


async def send_email(to_email: str, subject: str, html_content: str) -> bool:
    """
    Send a transactional email via the active provider chain.
    Delegates to the unified dispatcher in utils.email_providers.
    """
    from utils.email_providers import send_email_via_providers
    return await send_email_via_providers(to_email, subject, html_content)


async def send_otp_email(to_email: str, otp: str, full_name: str) -> bool:
    """
    Send an OTP (one-time password) email for sign-in verification.
    The OTP is valid for 5 minutes.
    """
    subject = "Your Clear eVisa Sign-In Verification Code"
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Clear eVisa&deg;</h1>
            </div>
            <div style="padding: 30px; background-color: #f9fafb;">
                <h2 style="color: #1f2937;">Sign-In Verification</h2>
                <p style="color: #4b5563; font-size: 16px;">Dear {full_name},</p>
                <p style="color: #4b5563; font-size: 16px;">
                    Use the following one-time verification code to complete your sign-in.
                    This code expires in <strong>5 minutes</strong>.
                </p>
                <div style="background-color: #dbeafe; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0; text-align: center;">
                    <p style="margin: 0; color: #1e40af; font-weight: bold; font-size: 14px;">Your Verification Code</p>
                    <p style="margin: 10px 0 0 0; color: #1e40af; font-size: 36px; font-weight: bold; letter-spacing: 8px;">{otp}</p>
                </div>
                <p style="color: #6b7280; font-size: 14px;">
                    If you did not attempt to sign in, please ignore this email and ensure your account is secure.
                </p>
            </div>
            <div style="background-color: #1f2937; padding: 20px; text-align: center;">
                <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                    &copy; 2026 Clear eVisa. All rights reserved.
                </p>
            </div>
        </body>
    </html>
    """
    return await send_email(to_email, subject, html_content)


async def send_password_reset_email(to_email: str, reset_link: str, full_name: str) -> bool:
    """
    Send a password reset email containing a one-time reset link.
    The link expires after 1 hour.
    """
    subject = "Reset Your Clear eVisa Password"
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Clear eVisa&deg;</h1>
            </div>
            <div style="padding: 30px; background-color: #f9fafb;">
                <h2 style="color: #1f2937;">Password Reset Request</h2>
                <p style="color: #4b5563; font-size: 16px;">Dear {full_name},</p>
                <p style="color: #4b5563; font-size: 16px;">
                    We received a request to reset the password for your Clear eVisa account.
                    Click the button below to create a new password. This link expires in <strong>1 hour</strong>.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_link}" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                        Reset My Password
                    </a>
                </div>
                <p style="color: #6b7280; font-size: 13px;">
                    If the button above doesn&apos;t work, copy and paste this link into your browser:
                </p>
                <p style="color: #2563eb; font-size: 13px; word-break: break-all;">{reset_link}</p>
                <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                    If you did not request a password reset, you can safely ignore this email.
                    Your password will not be changed.
                </p>
            </div>
            <div style="background-color: #1f2937; padding: 20px; text-align: center;">
                <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                    &copy; 2026 Clear eVisa. All rights reserved.
                </p>
            </div>
        </body>
    </html>
    """
    return await send_email(to_email, subject, html_content)


async def send_application_confirmation(to_email: str, application_id: str, applicant_name: str) -> bool:
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
                    <li>Our team will review your application within 1 business day</li>
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
    return await send_email(to_email, subject, html_content)

async def send_application_status_update(to_email: str, application_id: str, applicant_name: str, status: str) -> bool:
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
    return await send_email(to_email, subject, html_content)


async def send_contact_form_email(name: str, email: str, category: str, subject_line: str, message: str) -> bool:
    """
    Forward a contact form submission to the support inbox.
    """
    subject = f"[Contact Form] {subject_line or 'New Enquiry'} — {name}"
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Clear eVisa &mdash; Contact Form</h1>
            </div>
            <div style="padding: 30px; background-color: #f9fafb;">
                <table style="width:100%; border-collapse:collapse; font-size:15px; color:#1f2937;">
                    <tr><td style="padding:8px 0; font-weight:bold; width:120px;">From</td><td>{name}</td></tr>
                    <tr><td style="padding:8px 0; font-weight:bold;">Email</td><td><a href="mailto:{email}" style="color:#2563eb;">{email}</a></td></tr>
                    <tr><td style="padding:8px 0; font-weight:bold;">Category</td><td>{category or '(none)'}</td></tr>
                    <tr><td style="padding:8px 0; font-weight:bold;">Subject</td><td>{subject_line or '(none)'}</td></tr>
                </table>
                <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
                <p style="color:#1f2937; font-size:15px; white-space:pre-wrap;">{message}</p>
            </div>
            <div style="background-color: #1f2937; padding: 20px; text-align: center;">
                <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                    &copy; 2026 Clear eVisa Services. All rights reserved.
                </p>
            </div>
        </body>
    </html>
    """
    return await send_email("support@clearevisa.com", subject, html_content)
