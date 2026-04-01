# CHANGELOG

All notable changes to the Clear eVisa project are documented in this file.

Format: `## [Date] - Description`

---

## [2026-04-01] - Super Admin unrestricted status override (AdminPanel.jsx)

### Enhanced
- **Super Admin can set any application status** (`frontend/src/pages/AdminPanel.jsx`)
  - Super Admin's status dropdown shows all 6 statuses (`pending`, `submitted`, `paid`, `processed`, `approved`, `rejected`) regardless of the current state — allowing corrections and manual overrides.
  - Regular Admin retains the enforced `ALLOWED_TRANSITIONS` rules; terminal states still show a read-only badge.

---

## [2026-04-01] - Application status workflow with enforced transitions (AdminPanel.jsx)

### Added
- **Status workflow** (`frontend/src/pages/AdminPanel.jsx`)
  - Defined five distinct application statuses reflecting the full lifecycle:
    - `pending` — Application started but not yet submitted (user has not reached the payment step).
    - `submitted` — User clicked the Pay button.
    - `paid` — Payment confirmed.
    - `processed` — Admin has reviewed and processed the application.
    - `approved` / `rejected` — Admin's final decision (terminal states).
  - `ALLOWED_TRANSITIONS` map enforces one-way, forward-only status changes. Admins can only move an application to the next valid state(s); backward transitions are impossible via the UI.
  - Per-row action dropdown shows **only the allowed next statuses** for each application's current state. Once `approved` or `rejected`, the dropdown is replaced by a read-only badge — preventing accidental changes to terminal states.
  - Stats bar expanded from 4 to 6 cards: Total · Pending · Submitted · Paid · Approved · Rejected.
  - Status filter dropdown updated to include all 6 statuses.
  - `getStatusBadge` updated with distinct colours for all statuses: yellow (pending), blue (submitted), indigo (paid), purple (processed), green (approved), red (rejected).

### Notes
- Status transitions for `submitted` (user pays) and `paid` (payment webhook) are set by the system/payment flow; the AdminPanel enforces the admin-side transitions only (`paid → processed → approved/rejected`).

---

## [2026-04-01] - SendPulse SMTP fix, admin panel deduplication, and bootstrap OTP fallback

### Fixed
- **SendPulse SMTP delivery broken** (`backend/utils/email_providers/sendpulse_provider.py`)
  - SMTP host changed from unreachable `smtp.sendpulse.com` to `smtp-pulse.com` (confirmed reachable).
  - Default port changed from `465` (SSL, firewall-blocked) to `587` (STARTTLS, open).
  - Envelope `MAIL FROM` was incorrectly set to the SMTP login credential (`smtp_user`). SendPulse rejected this with `554 5.9.2 Sender domain is not valid`. Fixed to use `FROM_EMAIL` (the verified sender domain) for both the `From:` header and the SMTP envelope sender.
  - DB record updated: `sendpulse_smtp_port` corrected from `465` → `587`.
  - Model and route defaults updated to match (`backend/models/email_provider_config.py`, `backend/routes/email_providers.py`).

- **OTP falling back to console log** (`backend/routes/auth.py`)
  - Root cause was the broken SendPulse delivery above. After the SMTP fix all three issues were resolved and OTPs now deliver to the user's inbox via SendPulse.
  - OTP console fallback is retained as a safety net only for the case where no email provider is configured at all (bootstrap scenario).

- **Approve/Reject email errors silently swallowed** (`backend/routes/applications.py`)
  - Replaced bare `except: print(...)` with `logger.exception(...)` so SMTP failures are now visible in `/tmp/backend.log`.
  - Also hardened `applicant_name` construction to use `.get()` instead of direct key access to avoid `KeyError` on incomplete records.

- **Site crash on load — `JSON.parse("undefined")` in AuthProvider** (`frontend/src/utils/auth.js`)
  - A prior failed login stored the literal string `"undefined"` in `localStorage.currentUser`.
  - `AuthProvider` called `JSON.parse("undefined")` on every page load, crashing React before anything rendered.
  - Fixed `getCurrentUser()` to guard against the strings `"undefined"` and `"null"`, wrap `JSON.parse` in try/catch, and auto-clear the corrupted key.

- **`mgt.clearMarks is not a function` console error** (`frontend/build/index.html`, `frontend/public/index.html`)
  - PostHog session-recording script references `performance.clearMarks` which is absent in some browsers.
  - Added a polyfill for `performance.clearMarks`, `clearMeasures`, and `clearResourceTimings` before any other script runs.
  - Extended the existing error suppressor to catch remaining PostHog-originated `"is not a function"` errors.

### Changed
- **Admin panel deduplication** (`frontend/src/pages/AdminPanel.jsx`)
  - All new functionality (Email Providers tab, Super Admin restrictions) migrated into the canonical `AdminPanel.jsx`.
  - `AdminPanelNew.jsx` deleted — it was an unused duplicate never referenced by the router.
  - `Country Config` tab trigger and `TabsContent` restricted to `super_admin` only.
  - `Email Providers` tab added with `<EmailProviderSettings />` component, visible to `super_admin` only.
  - Tab grid updated from `grid-cols-4` to `grid-cols-5` for super_admin.
  - Imported `EmailProviderSettings` and `Mail` icon into `AdminPanel.jsx`.

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
