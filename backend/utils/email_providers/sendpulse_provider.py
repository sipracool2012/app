"""
SendPulse SMTP Email Provider
==============================
Sends transactional email via SendPulse's SMTP gateway using Python's smtplib.
SMTP credentials are stored in the email_provider_config collection.

Default SMTP settings:
  Host: smtp.sendpulse.com
  Port: 465 (SSL) or 587 (STARTTLS)

# CHANGELOG REMINDER: Update CHANGELOG.md when changing SendPulse configuration.
"""

import os
import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import asyncio
from functools import partial

logger = logging.getLogger(__name__)

FROM_EMAIL = os.environ.get("FROM_EMAIL", "no-reply@clearevisa.com")
FROM_NAME = os.environ.get("FROM_NAME", "Clear eVisa")


class SendPulseProvider:
    """Sends transactional email via SendPulse SMTP."""

    name = "SendPulse"

    def __init__(self, config: dict):
        self._enabled = config.get("sendpulse_enabled", False)
        # DB config takes precedence; fall back to environment variables.
        self._smtp_host = (
            config.get("sendpulse_smtp_host")
            or os.environ.get("SENDPULSE_SMTP_HOST", "smtp-pulse.com")
        )
        self._smtp_port = int(
            config.get("sendpulse_smtp_port")
            or os.environ.get("SENDPULSE_SMTP_PORT", 587)  # 587 STARTTLS; 465 SSL is usually blocked
        )
        self._smtp_user = (
            config.get("sendpulse_smtp_user")
            or os.environ.get("SENDPULSE_SMTP_USER", "")
        )
        self._smtp_password = (
            config.get("sendpulse_smtp_password")
            or os.environ.get("SENDPULSE_SMTP_PASSWORD", "")
        )

    def is_enabled(self) -> bool:
        return bool(self._enabled)

    def is_configured(self) -> bool:
        return bool(self._smtp_user and self._smtp_password)

    def _send_sync(self, to_email: str, subject: str, html_content: str) -> bool:
        """Synchronous SMTP send – run via executor to avoid blocking the event loop."""
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        # Use the verified sender domain (FROM_EMAIL), not the SMTP login credential.
        # SendPulse rejects messages where the From domain is not verified in the account.
        msg["From"] = f"{FROM_NAME} <{FROM_EMAIL}>"
        msg["To"] = to_email
        msg.attach(MIMEText(html_content, "html"))

        try:
            if self._smtp_port == 465:
                # SSL connection
                with smtplib.SMTP_SSL(self._smtp_host, self._smtp_port, timeout=15) as server:
                    server.login(self._smtp_user, self._smtp_password)
                    server.sendmail(FROM_EMAIL, to_email, msg.as_string())
            else:
                # STARTTLS connection (port 587)
                with smtplib.SMTP(self._smtp_host, self._smtp_port, timeout=15) as server:
                    server.ehlo()
                    server.starttls()
                    server.login(self._smtp_user, self._smtp_password)
                    server.sendmail(FROM_EMAIL, to_email, msg.as_string())

            logger.info(f"[SendPulse] Email sent to {to_email}")
            return True

        except smtplib.SMTPAuthenticationError as e:
            logger.error(f"[SendPulse] SMTP authentication failed for {to_email}: {e}")
            return False
        except smtplib.SMTPException as e:
            logger.error(f"[SendPulse] SMTP error for {to_email}: {e}")
            return False
        except Exception as e:
            logger.error(f"[SendPulse] Unexpected error for {to_email}: {e}")
            return False

    async def send(self, to_email: str, subject: str, html_content: str) -> bool:
        """Send email asynchronously by running the sync SMTP call in a thread executor."""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None,
            partial(self._send_sync, to_email, subject, html_content),
        )
