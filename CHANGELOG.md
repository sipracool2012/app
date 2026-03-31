# CHANGELOG

All notable changes to the Clear eVisa project are documented in this file.

Format: `## [Date] - Description`

---

## [2026-03-31] - Multi-provider email delivery, OTP sign-in, and Email Providers admin tab

### Added
- **Email Provider Architecture** (`backend/utils/email_providers/`)
  - `__init__.py` — Unified dispatcher with fallback logic: Mandrill → SendPulse → Postmark.
  - `mandrill_provider.py` — Refactored existing Mandrill integration into a `MandrillProvider` class.
  - `sendpulse_provider.py` — New `SendPulseProvider` class using SMTP (ports 465 SSL / 587 STARTTLS).
  - `postmark_provider.py` — New `PostmarkProvider` class using the Postmark HTTP API via `httpx`.

- **Email Provider configuration storage** (`backend/models/email_provider_config.py`)
  - Pydantic models: `EmailProviderConfig`, `EmailProviderConfigUpdate`, `EmailProviderConfigResponse`.
  - Stored in the `email_provider_config` MongoDB collection.

- **Email Provider API routes** (`backend/routes/email_providers.py`)
  - `GET  /api/email-providers/config` — Public-safe summary (enabled/configured flags). Admin+ only.
  - `GET  /api/email-providers/config/admin` — Full config with masked credentials. Super admin only.
  - `PUT  /api/email-providers/config` — Update provider settings. Super admin only.

- **OTP-based sign-in** (`backend/routes/auth.py`)
  - `POST /api/auth/login` — Now dispatches a 6-digit OTP via the active email provider chain instead of returning a token directly.
  - `POST /api/auth/verify-otp` — Validates the OTP and returns a JWT access token. OTPs expire after 5 minutes and are single-use.
  - OTPs stored in the `otp_store` MongoDB collection.

- **OTP email template** (`backend/utils/email.py`)
  - `send_otp_email()` — Sends a styled HTML OTP verification email.

- **EmailProviderSettings admin component** (`frontend/src/components/admin/EmailProviderSettings.jsx`)
  - Super-admin-only UI panel to toggle and configure Mandrill, SendPulse, and Postmark.

- **"Email Providers" tab in Admin Panel** (`frontend/src/pages/AdminPanelNew.jsx`)
  - New tab visible only to super_admin users.

### Changed
- `backend/utils/email.py` — `send_email`, `send_application_confirmation`, and `send_application_status_update` are now `async` and delegate to the unified provider dispatcher.
- `backend/routes/applications.py` — Updated email send calls to `await` the async functions.
- `frontend/src/pages/SignIn.jsx` — Login form is now a 2-step OTP flow (credentials → OTP entry).

### Permissions
- **Country Config tab** — Restricted to super_admin only (was previously accessible to all admins).
- **Email Providers tab** — Super admin only.
- **Payment Gateways tab** — Super admin only (unchanged).
- **User Management tab** — Super admin only (unchanged).

---

<!-- REMINDER FOR DEVELOPERS:
     Every code change must be logged here with:
       - The date of the change (YYYY-MM-DD)
       - A short description: feature added, bug fixed, permission updated, etc.
     Keep entries in reverse-chronological order (newest first).
-->
