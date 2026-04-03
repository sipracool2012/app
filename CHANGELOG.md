# CHANGELOG

All notable changes to the Clear eVisa project are documented in this file.

Format: `## [Date] - Description`

---

## [2026-04-03] - Fixed country flags not displaying in Admin Country Config tab

### Fixed
- **Country flag showing ISO code text (e.g. "AF") instead of flag image**
  - Root cause 1: The `/api/countries/all` endpoint returned `flag_emoji` by spreading `{**config}` from MongoDB. Records that were created before the `flag_emoji` field was added to the schema had no such field (or empty string), causing the emoji to render as blank or absent.
  - Root cause 2: On Linux servers, Unicode flag emoji (e.g. 🇦🇫) render as the two-letter ISO code ("AF") because the OS lacks a colour emoji font — so even correctly-stored emoji would not show as flags.
  - Fix 1 (`backend/routes/countries.py`): In `get_all_countries()`, explicitly override `flag_emoji` with `config.get('flag_emoji') or country['flag']` so DB records with missing/empty `flag_emoji` always fall back to the in-memory `ALL_COUNTRIES` value.
  - Fix 2 (`frontend/src/pages/AdminPanel.jsx`): Replaced `<span className="text-2xl">{country.flag_emoji}</span>` with `<FlagIcon code={country.country_code} width={32} height={24} />` — uses the existing `FlagIcon` component (flagcdn.com CDN) for reliable cross-platform flag images.

---

## [2026-04-02] - Reverted application switching UI; deferred to todo

### Reverted
- **Conflict resolution screen in `VisaApplication.jsx`** — the implementation had issues (state propagation to child steps, category detection fragility, `handleContinueExisting` redirect timing). Removed from the codebase.
- Unused icon imports (`AlertTriangle`, `RefreshCw`, `PlusCircle`, `ArrowRight`) also removed.

### Kept
- `DELETE /api/applications/draft` (no-ID) endpoint — safe to leave, used later
- `selectedVisaOption` locked in draft on mount — fees still work correctly
- `fetchVisaOption()` helper in `VisaApplication` for re-use when the feature is properly built

### Deferred
- Full spec saved to `/memories/repo/todo-application-switching.md` with:
  - Exact required behaviour for same-category and different-category conflicts
  - Root causes of previous failure
  - Design notes (correct visaId parsing, category detection via `split('-')[1]`)

---

## [2026-04-02] - Fees locked at application start; conflict resolution for duplicate drafts

### Fixed
- **Fees resetting to zero when admin changes rates mid-application** (`frontend/src/pages/VisaApplication.jsx`, `Step10Payment.jsx`)
  - Root cause: Step10 was fetching live rates from the API on every open. If admin disabled/changed a visa type, fees dropped to 0.
  - Fix: `VisaApplication` now fetches `selectedVisaOption` (with all fee fields) once on mount and stores it in `formData`, which auto-saves to the draft. Step10 reads fees directly from `data.selectedVisaOption` — rates are locked to the prices shown when the user started the application.

### Added
- **Conflict resolution screen** (`frontend/src/pages/VisaApplication.jsx`)
  - Triggered when the user navigates to `/apply/:visaId` while they already have a draft saved under a **different** `visaId`.
  - Presents three clearly-labelled options:
    1. **Continue existing application** — redirects to `/apply/{draftVisaId}` so the user picks up where they left off.
    2. **Switch to this visa type (keep my data)** *(only shown when both visas share the same category, e.g. tourist 30d → tourist 1yr)* — copies all filled personal/travel data into the new visa type, resets document uploads and `applicationId`, saves immediately, and starts from step 1 so every page is reviewed.
    3. **Start a new application** — calls `DELETE /api/applications/draft` to wipe the old draft, then starts fresh.

- **`DELETE /api/applications/draft`** (`backend/routes/applications.py`)
  - No-ID variant of the delete endpoint. Finds and deletes the current user's draft by `userId` — used by the "Start fresh" option above.

---

## [2026-04-02] - Fixed Step 10 fees loaded from DB country_visa_config

### Fixed
- **Fee breakdown showing hardcoded values** (`frontend/src/components/application-steps/Step10Payment.jsx`)
  - `govtFee`, `ourFee`, `processing_fee` were falling back to hardcoded `80` / `20` / `2%` because `data.selectedVisaOption` was never populated.
  - Fix: on mount, fetch `GET /api/countries/{countryCode}/visa-options` using the country code parsed from `data.visaId` (e.g. `gb` from `gb-tourist-30d`), find the matching option by `id`, and use its real fees from the database.
  - Fee breakdown now shows the visa option name as a subtitle.
  - Also fixed a variable shadowing bug: inner `const data = await response.json()` in `fetchEnabledGateways` now uses `result` to avoid shadowing the outer `data` prop.

---

## [2026-04-02] - Implemented real PayPal payment flow with success/failure handling

### Added
- **`POST /api/payment-gateways/paypal/create-order`** (`backend/routes/payment_gateways.py`)
  - Authenticates with PayPal, creates a v2 checkout order, persists `paypal_order_id` + `payment_amount` on the application, returns `approval_url`.

- **`POST /api/payment-gateways/paypal/capture-order`** (`backend/routes/payment_gateways.py`)
  - Captures an approved PayPal order, sets application `status` to `submitted`, stores `paypal_transaction_id`.

- **`/payment-return` route + `PaymentReturn.jsx`** (`frontend/src/pages/PaymentReturn.jsx`)
  - Handles the PayPal redirect-back URL (both approval and cancellation).
  - On approval: calls capture-order, shows success page with Application ID + PayPal Transaction ID.
  - On failure or cancellation: shows error page with **Retry Payment** button (re-creates a new PayPal order for the same application) and **Go to My Applications** fallback.

### Changed
- **`Step10Payment.jsx`**: replaced fake `setTimeout → onNext()` with real PayPal redirect.
  - Calls `create-order`, then does `window.location.href = approval_url`.
  - Non-PayPal gateways now show a "not yet integrated" toast instead of silently skipping to success.
  - `return_url` / `cancel_url` encode `application_id` and `amount` for stateless retry on the return page.

---

## [2026-04-02] - Simplified uploaded document filenames

### Changed
- **`/api/upload` filename format** (`backend/routes/upload.py`)
  - Old format: `APP20260402195124_passportDocument_INIVO260320906204426_PHOTO.png` (original camera filename appended, causing very long strings)
  - New format: `APP20260402195124_passport.png` — `{applicationId}_{shortFieldName}.{ext}`
  - "Document" suffix stripped from camelCase field names (`passportDocument` → `passport`, `photoDocument` → `photo`); other field names kept as-is (`businessLetter`, `businessCard`, etc.)
  - Extension derived from original filename; falls back to content-type map if no extension present
  - Re-uploading the same field overwrites the previous file (deterministic name)

---

## [2026-04-02] - Fixed close button overflow on uploaded file in Step 9 Document Upload

### Fixed
- **× (remove file) button unclickable when filename is long** (`Step9DocumentUpload.jsx`)
  - Long auto-generated filenames (e.g. `APP20260402195124_passportDocument_INIVO260320906204426_PHOTO.png`) overflowed the filename `<span>`, pushing the × Button outside the flex container and making it unreachable.
  - Fix: added `min-w-0 flex-1` to the inner icon+name div so it shrinks properly, `truncate` on the filename `<span>` to clip overflow with ellipsis, and `shrink-0` on the Button so it always stays at full size and visible.
  - Rebuilt and deployed.

---

## [2026-04-02] - Fixed SendPulse re-disabled after deploy; git merge doc-upload-folder

### Fixed
- **`/api/applications/assign-id` returning 404 on document upload step**
  - A stale nohup uvicorn process (PID 112918, started April 1) was holding port 8000 with old code that predated the `assign-id` endpoint.
  - The systemd service (`clearevisa.service`) kept failing to bind on every restart because the old process wouldn't release the port.
  - Fix: killed both stale processes, restarted `clearevisa.service` cleanly. Endpoint now returns `401` (requires auth) instead of `404` — confirming it is registered and reachable.
  - Document upload on Step 9 now works correctly.

- **SendPulse disabled in active database** (`test_database` `email_provider_config`)
  - Backend uses `DB_NAME=test_database` but the April 1 SendPulse fix was applied to `visa_app` (a different database).
  - After `./deploy.sh` the service restarted against `test_database` where `sendpulse_enabled` was still `False`, causing OTPs to fall back to the console log again.
  - Fixed: enabled SendPulse in `test_database` with `port=587`, `host=smtp-pulse.com`. Verified `Delivered: True` and confirmed OTP now goes by email.
- **Admin panel super_admin tabs not visible** — root cause was the above; OTP delivery now works, login completes correctly, `/api/auth/me` returns `role: super_admin` and all super_admin tabs render.

### Changed
- **Merged `doc-upload-folder` into `vps/on-refresh-login-page`** (git)
  - Resolved 7 conflicts keeping VPS/AuthProvider/i18n architecture as the base.
  - `Step9DocumentUpload`: kept `useTranslation` + merged Application ID banner from `doc-upload-folder`.
  - `Step10Payment`: merged both `useTranslation` and `getAuthHeaders` imports.
  - `AdminPanelNew.jsx`: accepted HEAD deletion (was a duplicate).
  - `deploy.sh`: kept VPS version with correct `$(dirname "$0")/frontend` path.
  - Pushed to `origin/vps/on-refresh-login-page` at commit `9789625`.

---

## [2026-04-01] - Application status progress stepper on My Applications page

### Added
- **`StatusStepper` component** (`frontend/src/pages/MyApplications.jsx`)
  - Horizontal stepper renders above each non-draft application card on `/my-applications`.
  - Five ordered nodes: **Pending → Submitted → Paid → Processed → Approved**.
  - Completed steps shown in solid blue with a checkmark icon; active step shown as a blue-outlined circle; future steps grayed out.
  - Connector lines between nodes fill blue as steps are completed.
  - **Rejected** applications display a red `XCircle` terminal indicator instead of the stepper.
  - Draft applications suppress the stepper entirely (progress bar not relevant pre-submission).
- Updated `statusConfig` to include `submitted`, `paid`, and `processed` entries with matching badge colours (blue, indigo, purple).

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
