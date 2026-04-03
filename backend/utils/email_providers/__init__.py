"""
Email Providers Package
=======================
Unified interface for sending transactional emails via multiple providers.
Supported providers: Mandrill, SendPulse (SMTP), Postmark.

Fallback logic: providers are tried in the order [Mandrill, SendPulse, Postmark].
If a provider is disabled or its delivery fails, the next enabled provider is tried.

# CHANGELOG REMINDER: Update CHANGELOG.md when modifying provider logic.
"""

import logging
from typing import Optional

logger = logging.getLogger(__name__)


async def get_email_provider_config():
    """
    Fetch the current email provider configuration from the database.
    Falls back to a default (all disabled) config if the collection is empty.
    """
    from motor.motor_asyncio import AsyncIOMotorClient
    from dotenv import load_dotenv
    from pathlib import Path
    import os

    ROOT_DIR = Path(__file__).parent.parent.parent
    load_dotenv(ROOT_DIR / ".env")

    mongo_url = os.environ.get("MONGO_URL")
    db_name = os.environ.get("DB_NAME", "visa_app")
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

    config = await db.email_provider_config.find_one({})
    client.close()
    return config or {}


async def send_email_via_providers(to_email: str, subject: str, html_content: str) -> bool:
    """
    Send an email using the first available (enabled + configured) provider.
    Provider priority: Mandrill → SendPulse → Postmark.

    Returns True if at least one provider successfully delivered the message.
    # CHANGELOG REMINDER: Update CHANGELOG.md if fallback order changes.
    """
    config = await get_email_provider_config()

    # Import provider implementations
    from utils.email_providers.mandrill_provider import MandrillProvider
    from utils.email_providers.sendpulse_provider import SendPulseProvider
    from utils.email_providers.postmark_provider import PostmarkProvider

    providers = [
        MandrillProvider(config),
        SendPulseProvider(config),
        PostmarkProvider(config),
    ]

    for provider in providers:
        if not provider.is_enabled():
            logger.debug(f"{provider.name} is disabled – skipping")
            continue
        if not provider.is_configured():
            logger.warning(f"{provider.name} is enabled but not configured – skipping")
            continue

        logger.info(f"Attempting email delivery via {provider.name} to {to_email}")
        success = await provider.send(to_email, subject, html_content)
        if success:
            return True
        logger.warning(f"{provider.name} delivery failed – trying next provider")

    logger.error(f"All email providers failed for {to_email}")
    return False
