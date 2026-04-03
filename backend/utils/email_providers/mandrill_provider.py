"""
Mandrill (Mailchimp Transactional) Email Provider
==================================================
Wraps the existing Mandrill integration as a provider class.

# CHANGELOG REMINDER: Update CHANGELOG.md when changing Mandrill configuration.
"""

import os
import logging
import mailchimp_transactional
from mailchimp_transactional.api_client import ApiClientError

logger = logging.getLogger(__name__)

FROM_EMAIL = os.environ.get("FROM_EMAIL", "no-reply@clearevisa.com")
FROM_NAME = os.environ.get("FROM_NAME", "Clear eVisa")


class MandrillProvider:
    """Sends transactional email via the Mandrill (Mailchimp Transactional) API."""

    name = "Mandrill"

    def __init__(self, config: dict):
        # DB config takes precedence; fall back to environment variable.
        self._enabled = config.get("mandrill_enabled", True)
        self._api_key = config.get("mandrill_api_key") or os.environ.get("MANDRILL_API_KEY", "")

    def is_enabled(self) -> bool:
        return bool(self._enabled)

    def is_configured(self) -> bool:
        return bool(self._api_key)

    async def send(self, to_email: str, subject: str, html_content: str) -> bool:
        """Send a transactional email via Mandrill API."""
        try:
            client = mailchimp_transactional.Client(self._api_key)
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

            if isinstance(response, list) and response:
                sent_status = response[0].get("status")
                if sent_status in ("sent", "queued", "scheduled"):
                    logger.info(f"[Mandrill] Email sent to {to_email} (status: {sent_status})")
                    return True
                logger.warning(f"[Mandrill] Unexpected status '{sent_status}' for {to_email}")
                return False

            logger.warning(f"[Mandrill] Unexpected response format: {response}")
            return False

        except ApiClientError as e:
            logger.error(f"[Mandrill] API error for {to_email}: {e.text}")
            return False
        except Exception as e:
            logger.error(f"[Mandrill] Unexpected error for {to_email}: {e}")
            return False
