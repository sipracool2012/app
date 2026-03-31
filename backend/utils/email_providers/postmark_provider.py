"""
Postmark Email Provider
========================
Sends transactional email via the Postmark HTTP API using httpx (already a dependency).
The server token is stored in the email_provider_config collection.

API reference: https://postmarkapp.com/developer/api/email-api

# CHANGELOG REMINDER: Update CHANGELOG.md when changing Postmark configuration.
"""

import os
import logging
import httpx

logger = logging.getLogger(__name__)

FROM_EMAIL = os.environ.get("FROM_EMAIL", "no-reply@clearevisa.com")
FROM_NAME = os.environ.get("FROM_NAME", "Clear eVisa")

POSTMARK_API_URL = "https://api.postmarkapp.com/email"


class PostmarkProvider:
    """Sends transactional email via the Postmark HTTP API."""

    name = "Postmark"

    def __init__(self, config: dict):
        self._enabled = config.get("postmark_enabled", False)
        # DB config takes precedence; fall back to environment variable.
        self._server_token = (
            config.get("postmark_server_token")
            or os.environ.get("POSTMARK_SERVER_TOKEN", "")
        )

    def is_enabled(self) -> bool:
        return bool(self._enabled)

    def is_configured(self) -> bool:
        return bool(self._server_token)

    async def send(self, to_email: str, subject: str, html_content: str) -> bool:
        """Send a transactional email via the Postmark API."""
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-Postmark-Server-Token": self._server_token,
        }
        payload = {
            "From": f"{FROM_NAME} <{FROM_EMAIL}>",
            "To": to_email,
            "Subject": subject,
            "HtmlBody": html_content,
            "MessageStream": "outbound",
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(POSTMARK_API_URL, json=payload, headers=headers)

            if response.status_code == 200:
                data = response.json()
                if data.get("ErrorCode", 0) == 0:
                    logger.info(f"[Postmark] Email sent to {to_email} (MessageID: {data.get('MessageID')})")
                    return True
                logger.warning(
                    f"[Postmark] API error code {data.get('ErrorCode')}: {data.get('Message')} for {to_email}"
                )
                return False

            logger.warning(
                f"[Postmark] HTTP {response.status_code} for {to_email}: {response.text}"
            )
            return False

        except httpx.TimeoutException:
            logger.error(f"[Postmark] Request timed out for {to_email}")
            return False
        except Exception as e:
            logger.error(f"[Postmark] Unexpected error for {to_email}: {e}")
            return False
