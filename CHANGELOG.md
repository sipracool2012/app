# CHANGELOG

All notable changes to the Clear eVisa project are documented in this file.

Format: `## [Date] - Description`
---

## [2026-04-10] - IST timezone throughout; Admin Panel table improvements; My Applications countdown + date fix

### Changed
- **IST timezone — all backend timestamps** (`backend/utils/constants.py`, `backend/routes/applications.py`, `backend/routes/auth.py`, `backend/routes/payment_gateways.py`, `backend/server.py`)
  - Added `now_ist()` helper in `backend/utils/constants.py` — returns current naive datetime in IST (UTC+05:30) using `datetime.now(timezone(timedelta(hours=5, minutes=30))).replace(tzinfo=None)`
  - Replaced every `datetime.utcnow()` call across all backend route files and background tasks with `now_ist()`
  - Affected: OTP expiry, password reset token expiry, draft creation/update/expiry, application submission timestamps, `paidAt`, `updatedAt`, `createdAt`, background cleanup loop comparisons

- **IST timezone — all frontend date displays** (`frontend/src/pages/MyApplications.jsx`, `frontend/src/pages/AdminPanel.jsx`)
  - `formatDate()` in `MyApplications.jsx` updated to use `timeZone: 'Asia/Kolkata'` with `en-IN` locale → displays as `10 Apr 2026, 10:15 PM`
  - Admin Panel Submitted column updated to `toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', ... })` including time with AM/PM

- **Admin Panel — Applications table** (`frontend/src/pages/AdminPanel.jsx`, `backend/routes/applications.py`)
  - **Name column**: now shows `GivenNames Surname` (first name first) instead of reversed order
  - **Nationality column**: shows flag icon (via `FlagIcon` component) + passport country name side by side
  - **Visa Type column**: replaced raw visa string with short labels — `Tourist 30D`, `Tourist 1Y`, `Tourist 5Y`, `Business`, `Medical`, `Med. Attendant`, `Conference`, `Transit`
  - **Submitted column**: shows `paidAt` (IST) for any status in paid/pending_review/submitted/processed/approved/rejected; falls back to `submittedDate` otherwise; formatted with time
  - Backend `my-applications` response now includes `nationality`, `passportCountryCode` (derived from visaId prefix), and `paidAt` fields

### Added
- **Live IST clock banner** (`frontend/src/pages/MyApplications.jsx`, `frontend/src/pages/VisaApplication.jsx`)
  - `ISTClock` component renders a blue info banner on the My Applications page and on every step of the visa application form (between the progress stepper and the step content card)
  - Ticks every second using `setInterval`
  - Displays: `Time in India (UTC+05:30) — 10:15:30 PM · Friday, 10 April 2026`

- **Expiry countdown timer on draft cards** (`frontend/src/pages/MyApplications.jsx`)
  - `ExpiryCountdown` component shows remaining time until draft expires below the status badge
  - Format: `2d 3h 14m remaining` / `5h 22m 10s remaining` / `14m 30s remaining`
  - Colour: grey (> 24h), orange (< 24h), red (< 1h), red "Expired" when time is up
  - Live ticking via `setInterval`, cleans up on unmount

- **Submitted date fix** (`frontend/src/pages/MyApplications.jsx`)
  - For paid/processed/approved/rejected statuses, shows `paidAt` (actual payment timestamp) instead of the previously empty `submittedDate`

---

## [2026-04-10] - India Tourism landing page + default route change

### Added
- **India Tourism page** (`frontend/src/pages/IndiaTourism.jsx`) — new purely visual page accessible at `/india-tourism` and now the default root route (`/`)
  - Full-screen hero with Unsplash imagery, headline "Discover the Soul of India", and dual CTAs
  - Stats bar: 28+ States, 40 UNESCO Heritage Sites, 193+ Nationalities Welcome
  - Destinations grid: 6 iconic locations (Taj Mahal, Kerala Backwaters, Rajasthan, Goa, Varanasi, Himachal Pradesh) with image cards and category tags
  - "Why India" split section: 6 experience tiles (Cuisine, Heritage, Coastline, Wildlife, Festivals, Photography)
  - Photo mosaic: 5-tile grid with hover zoom effects
  - eVisa process steps band (4-step consultancy flow, dark blue background)
  - Best time to visit: 3 seasonal cards (Peak/Summer/Monsoon)
  - FAQ accordion: 5 India travel + eVisa questions
  - Final full-bleed CTA section with Holi festival background image
  - All "Get Your India eVisa" buttons navigate to `/home` (the visa application widget)
  - No API calls or auth required — fully static/visual page

### Changed
- **App.js** (`frontend/src/App.js`)
  - Root route `/` changed from `Home` to `IndiaTourism` — `clearevisa.com` now lands on the India Tourism page
  - `Home` (visa application widget) moved to `/home`
  - `IndiaTourism` retained as alias at `/india-tourism`
  - `IndiaTourism` import added

---

## [2026-04-10] - Legal/static pages: real business details + Indian eVisa consultancy positioning

### Changed
- **About Us** (`frontend/src/pages/AboutUs.jsx`)
  - Mission and Vision rewritten to describe Indian eVisa document verification & preparation consultancy (not an application submission service)
  - Stats updated: `50K+ Clients Assisted`, `193+ Passport Nationalities Served`, `India eVisa Specialist`, `24/7 Support`
  - Fake placeholder team (John Smith, Sarah Johnson, Michael Chen) replaced with real team member: **Sipra Satpathi — Sole Proprietor**
  - Added **Legal Information** section: entity name `Clear eVisa Services`, registered address, phone `+91-9474475384`, email `admin@clearevisa.com`

- **Contact Us** (`frontend/src/pages/ContactUs.jsx`)
  - Legal entity name and full registered address updated
  - Phone number `+91-9474475384` added (was commented out)
  - General email updated to `admin@clearevisa.com`
  - Contact form now submits to `POST /api/utility/contact` (real email delivery to support@clearevisa.com) instead of silently resetting; includes loading state and error fallback

- **Privacy Policy** (`frontend/src/pages/PrivacyPolicy.jsx`)
  - Section 12 Contact: replaced generic "Visa Application Platform" with real entity name, email, and phone

- **Terms of Service** (`frontend/src/pages/TermsOfService.jsx`)
  - Section 4 Service Description: rewritten to describe document verification + preparation; customer submits on official portal themselves; added no-Government-affiliation disclaimer
  - Section 5 Visa Application Process: removed "we submit on your behalf"; added "you submit on indianvisaonline.gov.in"
  - Section 7 Refund Policy: tied to work commenced/completed, not Government submission
  - Section 16 Contact: updated with real entity name, email, and phone

- **Refund Policy** (`frontend/src/pages/RefundPolicy.jsx`)
  - All "submitted on your behalf" / "forwarded to Government on your behalf" language removed
  - Government fee clarified as paid directly by the customer on the official portal
  - Section 4 Our Services: explicitly states we don't submit on behalf of customers

- **FAQ** (`frontend/src/pages/FAQ.jsx`)
  - 7 answers rewritten: platform description, legality, service scope (India eVisa only, 5 visa types, 193+ nationalities), document checklist, fee breakdown, processing time, refunds

- **Help Center** (`frontend/src/pages/HelpCenter.jsx`)
  - 3 articles rewritten: application process, consultancy fee description, processing timeline

### Added
- **`POST /api/utility/contact`** (`backend/routes/utility.py`, `backend/utils/email.py`)
  - New public endpoint that forwards contact form submissions to `support@clearevisa.com` via the existing email provider chain
  - `send_contact_form_email()` helper added to `backend/utils/email.py`
  - `ContactFormRequest` Pydantic model (name, EmailStr, category, subject, message)

---

## [2026-04-09] - Forgot Password flow; scroll-to-top on navigation + button

### Added
- **Forgot Password / Reset Password flow** (`backend/routes/auth.py`, `backend/models/user.py`, `backend/utils/email.py`, `frontend/src/pages/ForgotPassword.jsx`, `frontend/src/pages/ResetPassword.jsx`, `frontend/src/pages/SignIn.jsx`, `frontend/src/App.js`)
  - New `POST /api/auth/forgot-password` endpoint — generates a `secrets.token_urlsafe(32)` reset token, stores it in a `password_reset_tokens` collection (1-hour expiry), and emails a reset link. Always returns 200 to prevent user enumeration.
  - New `POST /api/auth/reset-password` endpoint — validates token (expiry + single-use flag), enforces 8-character minimum, hashes and saves the new password, marks the token used.
  - `send_password_reset_email()` added to `backend/utils/email.py` with a styled HTML email matching the OTP template.
  - `ForgotPasswordRequest` and `ResetPasswordRequest` Pydantic models added to `backend/models/user.py`.
  - New `ForgotPassword.jsx` page at `/forgot-password` — email input form with success confirmation screen.
  - New `ResetPassword.jsx` page at `/reset-password?token=…` — new password + confirm fields, success state, and invalid-token guard.
  - "Forgot password?" link added below the Sign In button in `SignIn.jsx`.
  - Both routes registered as public in `App.js`.
  - Reset link domain controlled by `FRONTEND_URL` env variable (defaults to `https://clearevisa.com`).

- **Scroll-to-top on navigation + floating button** (`frontend/src/components/ScrollToTop.jsx`, `frontend/src/App.js`)
  - `ScrollToTopOnNav` — placed inside `<BrowserRouter>`, scrolls to top instantly on every route change so footer links always land at page top.
  - `ScrollToTopButton` — fixed blue circle button (↑) in the bottom-right corner; appears after scrolling 300 px; smoothly returns to top on click.

---

## [2026-04-08] - Feature: multiple draft applications per visa (family members)

Users can now have multiple draft applications for the same visa (e.g. for family members travelling together).

### What changed

**Backend (`backend/routes/applications.py`)**
- `PATCH /api/applications/draft` — reworked upsert logic:
  - If `__draftId` (MongoDB `_id` string) is present in the payload, the specific draft is updated
  - If not, a **new draft is always created** (no more one-per-visa deduplication)
  - Existing APP/TEMP ID preservation and security checks still apply
- `GET /api/applications/drafts` — now includes each draft's `_id` as an `id` field in the response (was excluded); results sorted newest-first
- `POST /api/applications/assign-id` — now accepts `draftId` in the body to scope the lookup to the exact draft; falls back to `userId+visaId` when omitted

**Frontend (`frontend/src/pages/VisaApplication.jsx`)**
- Added `draftIdRef` (`useRef`) to track the active draft's MongoDB `_id` throughout the session
- `loadDraft` logic rewritten:
  - If `location.state.draftId` is set (navigating from My Applications "Continue") → directly loads that specific draft, no popup
  - If same-visa drafts exist (and no specific draftId in nav state) → shows a **"Continue existing application?" popup** listing all drafts with applicant name, step progress, and last-saved date; plus a "Start New Application" button
  - If no drafts for this visa → fresh start with no popup (other-visa drafts are now silently ignored; old "conflict modal" removed)
- `saveDraft` — injects `__draftId` into every payload save so the backend updates the correct document; captures the returned `draftId` from the first new-draft creation response
- `assign-id` call — passes `draftId: draftIdRef.current` alongside `visaId` so the upload folder is associated with the correct draft

**Frontend (`frontend/src/pages/MyApplications.jsx`)**
- "Continue" button now navigates with `state: { draftId: app.id }` so `VisaApplication` can load the exact draft directly without showing the popup


- Backend: all 3 payment gateways (PayPal, Razorpay, Tazapay) now set `status: "paid"` + `paidAt` timestamp on successful payment (was `"submitted"`)
- Backend (`server.py`): new `paid_to_pending_review_loop()` background task — every 60 s promotes applications where `status == "paid"` and `paidAt < now - 1 hour` to `"pending_review"` automatically
- Frontend `AdminPanel.jsx`: updated `ALLOWED_TRANSITIONS` map (`paid → pending_review → submitted → processed → approved/rejected`); `getStatusBadge` includes `pending_review`; stats cards updated (Paid, Pending Review, Submitted, Processed, Approved, Rejected); filter dropdown and super_admin select updated; labels formatted correctly
- Frontend `MyApplications.jsx`: `statusConfig` and `WORKFLOW_STEPS` updated to new order (Paid → Pending Review → Submitted → Processed → Approved); legacy `pending` status mapped to `pending_review` in stepper


- `with_discount` display mode now shows `our_fee - discount_amount` everywhere (was `full_total - discount` or `price - discount`)
- Strikethrough "original price" now shows `our_fee` (not the full total / visa price)
- Affected files: `Home.jsx` (visa cards), `VisaDetail.jsx` (pricing sidebar), `Step10Payment.jsx` (fee breakdown)

## [2026-04-08] - User Management: show only admins, add promote-by-email form
- Backend: `GET /api/auth/users` now returns only `admin` and `super_admin` users (excludes regular users)
- Backend: new `PATCH /api/auth/users/promote` endpoint — accepts `{email, role}` to promote any user to admin/super_admin by email (super_admin only)
- Backend: added `UserEmailRoleUpdate` Pydantic model in `models/user.py`
- Frontend: User Management page now lists only admins and super admins
- Frontend: added "Assign Admin Role" form — enter a user's email, select Admin or Super Admin, click Save to apply the role and return to the user list

## [2026-04-07] - Transactions tab added to Admin Panel (super admin only)
- Backend: all 3 payment gateways (PayPal, Razorpay, Tazapay) now record a document in the `payments` MongoDB collection on successful payment
- Backend: new `GET /api/payment-gateways/transactions` endpoint (super_admin only) with filters: gateway, date range, full-text search, pagination
- Frontend: new `TransactionsPanel.jsx` component with summary cards, filter bar, paginated table
- Frontend: "Transactions" tab added to Admin Panel, visible to super_admin only (grid-cols updated to 7)

## [2026-04-07] - Refund Policy page added at /refund-policy
- Created `frontend/src/pages/RefundPolicy.jsx` with content adapted from indiasevisa.org/refund, styled to match the ClearEVisa theme
- Registered `/refund-policy` route in `App.js`

## [2026-04-07] - Demonym field added to countries; label format updated site-wide

### Added
- **`demonym` field on all 193 countries** (`backend/routes/countries.py` — `ALL_COUNTRIES`)
  - Every country now has a `demonym` key (e.g. `"Albanian"`, `"French"`, `"Emirati"`).

### Changed
- **`GET /api/countries/enabled`**
  - Response now includes a `demonym` field alongside `code`, `name`, and `flag`.
- **`GET /api/countries/{code}/visa-options`**
  - Response now includes `country_demonym` at the top level (alongside `country_name`), available for both the no-options and options-available responses.
- **`GET /api/applications/my-applications`** (`backend/routes/applications.py`)
  - Added `passportDemonym` field to each application record in the response (reads from the stored draft document).
- **VisaDetail page** (`frontend/src/pages/VisaDetail.jsx`)
  - Fetches `country_demonym` from the visa-options API on load, stored in `countryDemonym` state.
  - Page header title changed from `"India {visaName} for {passportName} Citizens"` → `"{visaName} for {demonym} Citizens"` (drops "India" prefix, uses demonym).
  - VISA_DESCRIPTION helper now uses demonym (e.g. `"Albanian passport holders"`).
  - `handleStartApplication` passes `passportDemonym` alongside `passportName` in navigation state.
- **VisaApplication page** (`frontend/src/pages/VisaApplication.jsx`)
  - `formData` seeded with `passportDemonym` from `location.state?.passportDemonym` or draft on load.
  - Blue subtitle on all 10 steps changed from `"India {visaName} for {passportName}"` → `"{visaName} for {demonym} Citizens"`.
- **Step 10 Payment** (`frontend/src/components/application-steps/Step10Payment.jsx`)
  - Label changed from `"India {visaName} for {passportName}"` → `"{visaName} for {demonym} Citizens"` using `passportDemonym` with fallback to `passportName`.
- **My Applications cards** (`frontend/src/pages/MyApplications.jsx`)
  - Card title changed from `"India {visaOptionName} for {passportName}"` → `"{visaOptionName} for {demonym} Citizens"` using `passportDemonym` with fallback to `passportName`.
- **Home page Learn More section** (`frontend/src/pages/Home.jsx`)
  - `getSelectedCountryDemonym()` helper added; used in learnMoreTitle and learnMoreSubtitle so they show e.g. `"Albanian"` instead of `"Albania"`.
- **i18n strings** (`frontend/src/i18n/locales/en-US.json`, `en.json`)
  - `learnMoreTitle`: updated from `"…for {{country}} passport holders"` → `"…for {{country}} citizens"`.

---

## [2026-04-06] - "India (Visa) for (Country)" label on My Applications cards

### Changed
- **`GET /api/applications/my-applications`** (`backend/routes/applications.py`)
  - Added two new fields to every application record in the response:
    - `visaOptionName` — resolved from `selectedVisaOption.name` stored in the draft/application document.
    - `passportName` — the passport country name stored in the document.

- **My Applications card title** (`frontend/src/pages/MyApplications.jsx`)
  - Application cards now display `"India {visaOptionName} for {passportName}"` when `visaOptionName` is available, matching the format used on the application form steps and payment page.
  - Falls back to the plain `visaService` string for older applications that predate the `selectedVisaOption` field.
  - The `passportName` suffix is omitted if the field is empty (e.g. applications started before this change).

---

## [2026-04-06] - Payment step syncs fees live from database on load

### Changed
- **Step 10 Payment — live fee refresh on mount** (`frontend/src/components/application-steps/Step10Payment.jsx`)
  - Added `fetchLiveFees()` called in `useEffect` alongside the existing gateway and utility-settings fetches.
  - Uses `data.visaId` (or `selectedVisaOption.id` as fallback) to call `GET /api/countries/{code}/visa-options` and find the matching option by ID.
  - Introduces `liveVisaOption` state — when the fetch succeeds the fee breakdown (govt fee, our fee, processing fee, discount, total) is recalculated from the freshest DB values; if the fetch fails, the draft-locked `selectedVisaOption` fees are used as a silent fallback.
  - Ensures that if an admin updates fees between when the user started filling the form and when they reach payment, the payment page always shows (and charges) the current pricing.

---

## [2026-04-06] - "India (Visa) for (Country)" label on all application steps

### Added
- **Visa + passport country subtitle on every step** (`frontend/src/pages/VisaApplication.jsx`)
  - A blue subtitle `"India {visaName} for {passportName}"` now appears below the step name in the progress card header on all 10 steps.
  - Hidden if `selectedVisaOption` is not yet resolved.

### Changed
- **`passportName` stored in `formData` and persisted to draft** (`frontend/src/pages/VisaApplication.jsx`)
  - `passportName` is seeded from `location.state.passportName` (passed by `VisaDetail`) on fresh starts.
  - All three draft-load paths (existing draft, conflict modal background, fresh) resolve `passportName` — preferring nav state, then draft's stored value, then `selectedVisaOption.country_name` as fallback.
- **`VisaDetail.jsx` — pass `passportName` to application form**
  - `handleStartApplication` now navigates to `/apply/{visaId}` with `{ state: { passportName } }` so the name survives into the form without re-fetching.
- **Step 10 Payment fee breakdown label** (`frontend/src/components/application-steps/Step10Payment.jsx`)
  - Replaced the plain grey `visaOption.name` text before the fee table with a styled blue `"India {visaName} for {passportName}"` label, consistent with other steps.

---

## [2026-04-06] - TEMP Application ID replaced by APP ID at Document Upload step

### Fixed
- **TEMP ID never replaced** (`frontend/src/pages/VisaApplication.jsx`, `backend/routes/applications.py`)
  - Drafts receive a `TEMP{timestamp}` ID on first save; the frontend condition `!applicationId` meant `assign-id` was never called when a TEMP ID already existed.
  - **Frontend:** condition changed to `!applicationId || applicationId.startsWith('TEMP')` so `assign-id` is always triggered on entering step 9 with a TEMP ID.
  - **Backend `POST /api/applications/assign-id`:** now detects TEMP IDs (`startswith("TEMP")`), generates a proper `APP{timestamp}` ID, updates the DB record, renames `uploads/TEMP…/` folder to `uploads/APP…/`, and renames any files inside that folder that carry the old TEMP prefix.
  - Upload folder and all uploaded file names now consistently use the `APP…` prefix from step 9 onwards.

---

## [2026-04-06] - Learn More section on Home page (1-year Tourist eVisa)

### Added
- **"Learn more" info section** (`frontend/src/pages/Home.jsx`)
  - Appears directly after the (hidden) partner logos block, before "How Clear eVisa Works".
  - Only renders when a country is selected **and** the visa options include a `1 year` / `Tourism` eVisa — hidden completely otherwise.
  - **Title:** `"Learn more: {visaName} for {Country} passport holders"` with a blue accent underline, matching Sherpa layout.
  - **Two-column layout:**
    - Left: "Everything you need to know for {Country} citizens" narrative (4 paragraphs covering stay limits, eVisa process, flight boarding rules, airport/seaport entry).
    - Right: Quick Summary bullets (purpose, max stay duration, email delivery, 5-day submission lead time) + "What do I need to apply?" with required-for-purchase and can-add-later document checklists + "Apply Now" button wired to the 1-year tourist visa.
  - **3 FAQ blocks** below the two-column layout, dynamically populated from live visa data (`stay_duration`, `validity`, `name`).
  - Visa lookup uses regex matching (`/1\s*year/i` on `validity`, `/tourism/i` on `purpose`) so it works regardless of exact name casing.
  - All strings added to `en-US.json` and `en.json` translation files (`learnMoreTitle`, `learnMoreSubtitle`, `learnMorePara1–4`, `quickSummary`, `summaryPurpose/Stay/Email/Submit`, `whatDoINeedTitle`, `requiredForPurchase/Later`, `requirementAccommodation/Passport/Headshot`, `faq1–3Title/Ans`).
  - `CheckCircle2` icon imported from `lucide-react`.

---

## [2026-04-06] - Hide partner logos section; fix Requirements country dropdown

### Fixed
- **Requirements page country dropdown empty** (`frontend/src/pages/Requirements.jsx`)
  - `GET /api/countries/all` returns `country_code`, `country_name`, `flag_emoji` — page was incorrectly mapping `c.code`, `c.name`, `c.flag` (all `undefined`).
  - Corrected mapping so all 193 countries now populate the searchable dropdown.

### Changed
- **Partner logos section hidden** (`frontend/src/pages/Home.jsx`)
  - "Clear eVisa is trusted by the best travel brands" section (blue background with partner logo images) commented out temporarily.

---

## [2026-04-06] - Requirements page (/requirements)

### Added
- **`Requirements.jsx`** (`frontend/src/pages/Requirements.jsx`)
  - New public page at `/requirements` — Sherpa-style visa requirement checker for India eVisa.
  - **Left sidebar:** fixed Destination (India), searchable passport-country dropdown (all 193 countries), 6 travel-purpose buttons (Tourist, Business, Medical, Medical Attendant, Conference, Transit), "Check Requirements" CTA.
  - **Status banner:** green "eVisa available" or orange "Embassy visa required" based on API response.
  - **Visa options cards:** pulled live from `GET /api/countries/{code}/visa-options?purpose=` — shows name, price, entries, stay duration, validity, estimated approval date, and "Apply Now" button routing to `/visa/:visaId`.
  - **Required Documents** checklist with info tooltips, per travel purpose.
  - **Entry Requirements** tiles: passport validity, blank pages, entry type, minors rule.
  - **How to Apply** 4-step timeline.
  - **CTA banner:** "View All Visa Options" link back to Home with country pre-selected.
  - URL query params supported: `/requirements?from=US&purpose=tourist` auto-triggers search on load.
  - No new backend endpoint needed — reuses existing `/api/countries/all` and `/api/countries/{code}/visa-options`.

- **`App.js`** — `/requirements` route updated from `<Home />` placeholder to `<Requirements />`.

---

## [2026-04-06] - Added 9 missing countries; fixed seed_sample_countries() schema

### Added
- **9 missing countries added to `ALL_COUNTRIES`** (`backend/routes/countries.py`)
  - Cayman Islands (KY), Cook Islands (CK), Gibraltar (GI), Guernsey (GG), Isle of Man (IM), Jersey (JE), Montserrat (MS), Niue (NU), Turks and Caicos Islands (TC).
  - Source: `Etourist_fee_final.csv` government fee sheet (175 country rows cross-referenced against existing list).

### Fixed
- **`seed_sample_countries()` schema updated** (`backend/routes/countries.py`)
  - Removed stale fields: `payment_fee`, `processing_fee` (flat), `tourist_30d_govt_fee` (single non-seasonal).
  - Added `base_doc()` helper closure — all 35+ current schema fields default to `0.0` / `False`; sample countries only override what they enable.
  - Added missing fields per sample country: `tourist_30d_govt_fee_apr_jun` / `tourist_30d_govt_fee_jul_mar` (seasonal split), `_our_fee` per visa type, `conference_*`, `medical_attendant_*`, `transit_*`, `discount_amount`.
  - Govt fees aligned to CSV values: US 5yr = $160, GB 5yr = $484, CA 5yr = $200.

---

## [2026-04-05] - Fix: with_discount mode shows only total, no line items

### Fixed
- **`with_discount` display mode** (`frontend/src/pages/VisaDetail.jsx`, `frontend/src/components/application-steps/Step10Payment.jsx`)
  - Previously showed all three fee rows (Government, Processing, Service) plus a Discount row.
  - Now shows **only** the discounted total. A single green "Discount applied: -$X" line is shown below the total as confirmation — no individual fee rows are exposed.

---

## [2026-04-06] - Pricing Display Mode (4-way enum replacing toggle)

### Changed
- **`show_fee_breakdown: bool`** → **`fee_display_mode: str`** across backend and frontend.
  - Old boolean removed from `UtilitySettings` and `UtilitySettingsUpdate` models (`backend/models/utility_settings.py`).
  - Backward-compat migration in GET/PATCH handlers (`backend/routes/utility.py`): existing `show_fee_breakdown=True` records are automatically read as `full_breakdown`; `False` → `total_only`.
  - Validation added: PATCH rejects unknown mode strings.
  - `fee_display_mode` is exposed on `GET /api/utility/settings` (public).

- **Four pricing display modes:**
  | Value | Behaviour |
  |---|---|
  | `full_breakdown` | Shows Government Fee + Processing Fee + Service Fee + Total |
  | `total_only` | Shows only the final Total (no line items) |
  | `our_fee_only` | Shows only the Service (our) Fee |
  | `with_discount` | Shows full breakdown + Discount row, final total is price minus `discount_amount` |

### Added
- **`discount_amount` included in every visa option** (`backend/routes/countries.py`)
  - The per-country `discount_amount` from `country_visa_configs` is now included in each entry of `GET /api/countries/{code}/visa-options` as `discount_amount`.
  - Required by the `with_discount` display mode on the frontend.

- **Pricing Display radio cards in Admin Utility Settings** (`frontend/src/components/admin/UtilitySettings.jsx`)
  - Replaced the single toggle with a 2×2 radio card grid, one card per mode.
  - Each card shows an icon, label, and description. Selected card is highlighted blue.
  - `Switch` import removed; added `DollarSign`, `Tag`, `AlignLeft`, `Percent` icons.

- **Home.jsx visa cards** now respect `fee_display_mode`:
  - `our_fee_only` → shows only the service fee with label "Service fee".
  - `with_discount` → shows discounted price; original price struck through above it.
  - `full_breakdown` / `total_only` → shows `visa.price` (no change from before).

- **VisaDetail intermediate page** (`frontend/src/pages/VisaDetail.jsx`):
  - `full_breakdown` → shows all three fee rows.
  - `total_only` → shows only the total (no fee rows).
  - `our_fee_only` → shows only the Service Fee row.
  - `with_discount` → shows all three fee rows + a green Discount row; displayed unit price and total use `price - discount_amount`.

- **Step 10 Payment page** (`frontend/src/components/application-steps/Step10Payment.jsx`):
  - Same four-mode logic as VisaDetail.
  - `with_discount`: discount row shown in green; Total row shows struck-through full price above the discounted amount.



### Added
- **`discount_amount: float`** field (`backend/models/country_visa_config.py`)
  - Added to all three Pydantic classes (`CountryVisaConfig`, `CountryVisaConfigCreate`, `CountryVisaConfigUpdate`).
  - Defaults to `0.0`.

- **`POST /api/countries/bulk-visa-fees`** (`backend/routes/countries.py`)
  - Replaces the tourist-only bulk endpoint. Now accepts fees for all visa types: tourist 30d (Apr–Jun / Jul–Mar), tourist 1yr, tourist 5yr, business, conference, medical, medical_attendant, transit — plus `discount_amount`.
  - `POST /api/countries/bulk-tourist-fees` kept as a backward-compatible alias.

- **Expanded "Bulk Set Visa Fee Defaults" panel** (`frontend/src/pages/AdminPanel.jsx`)
  - Renamed from "Bulk Set Tourist Fee Defaults".
  - Tourist section: 30 Day (Apr–Jun + Jul–Mar govt fees, our fee, live totals), 1 Year, 5 Year.
  - Other visa types section: Business, Conference, Medical, Medical Attendant, Transit — each with govt fee, our fee, and live total.
  - Discount section: single flat discount_amount input applied to all countries.

- **Per-country Discount Amount field** (`frontend/src/pages/AdminPanel.jsx`)
  - New input row above the Save button in the per-country expanded config view.
  - Saved via the existing `saveCountryConfig` call.

## [2026-04-05] - Bulk tourist fee defaults in Admin panel

### Added
- **`POST /api/countries/bulk-tourist-fees`** (`backend/routes/countries.py`)
  - New endpoint that upserts tourist fee values across every country in the system at once.
  - Accepts any combination of: `tourist_30d_govt_fee_apr_jun`, `tourist_30d_govt_fee_jul_mar`, `tourist_30d_our_fee`, `tourist_1yr_govt_fee`, `tourist_1yr_our_fee`, `tourist_5yr_govt_fee`, `tourist_5yr_our_fee`.
  - For existing country configs it performs a `$set` update (only the supplied fields). For countries with no config yet it creates a new record with all toggles set to `false` — no country or visa type is enabled automatically.
  - Returns `{ created, updated, total }` counts.

- **Bulk Set Tourist Fee Defaults panel** (`frontend/src/pages/AdminPanel.jsx`)
  - Collapsible card at the top of the Country Config tab (super_admin only).
  - Three column layout: 30 Day (with Apr–Jun and Jul–Mar seasonal govt fees + our fee), 1 Year, 5 Year.
  - Live total preview per sub-type using the 2.5% processing fee formula.
  - "Apply to All Countries" button calls the new endpoint; only non-empty fields are sent so partially-filled forms don't accidentally zero out existing values.
  - Country list refreshes automatically after a successful bulk save.

---

## [2026-04-05] - Seasonal 30-day tourist govt fee; VisaDetail improvements

### Added
- **Seasonal government fee for 30-day tourist eVisa** (`backend/models/country_visa_config.py`, `backend/routes/countries.py`, `frontend/src/pages/AdminPanel.jsx`)
  - Two new fee fields per country: `tourist_30d_govt_fee_apr_jun` (April–June) and `tourist_30d_govt_fee_jul_mar` (July–March).
  - The `/api/countries/{code}/visa-options` endpoint automatically selects the correct seasonal fee based on the current month; falls back to legacy `tourist_30d_govt_fee` if seasonal fields are zero.
  - Admin panel 30 Days section now shows two labelled govt fee inputs ("Govt Fee (Apr–Jun)" and "Govt Fee (Jul–Mar)") with live per-season total previews.

### Changed
- **`VisaDetail.jsx`** — Fee breakdown section (government fee, processing fee, service fee rows) is now controlled by the **Utility → Pricing Display** toggle; fetches `GET /api/utility/settings` on mount and hides the breakdown when `show_fee_breakdown` is `false`.
- **`VisaDetail.jsx`** — Info tooltips now drop **below** the icon (`top-full + mt-1`) instead of above, preventing clipping at the top of the page.
- **`VisaDetail.jsx`** — Removed `overflow-hidden` from the sticky pricing sidebar card so tooltips inside the sidebar are no longer clipped.

---

## [2026-04-05] - Visa detail intermediate page before application

### Added
- **`VisaDetail` page** (`frontend/src/pages/VisaDetail.jsx`)
  - New intermediate page at `/visa/:visaId` shown when a user clicks "Apply Online" on a visa card in the Home page.
  - Displays visa metadata (entries, maximum stay, validity, travel purpose) with icons and tooltip info popovers.
  - Dynamic description per visa type (tourist / business / medical / medical_attendant / conference / transit).
  - "What you need" section listing required documents per visa type.
  - Collapsible FAQ accordion (7 standard India eVisa questions).
  - Sticky right-hand pricing sidebar with travellers counter (±), per-traveller price, running total, and full fee breakdown (government fee, processing fee, service fee).
  - "Start Application" button navigates to `/apply/:visaId`.
  - Page-level top bar shows back arrow, India flag, and dynamic title: **"India {visa name} for {Passport Country} Citizens"**.

### Changed
- **`Home.jsx`** — "Apply Online" button now navigates to `/visa/:visaId?passport=XX&passportName=...` instead of directly to `/apply/:visaId`, routing users through the new detail page first.
- **`App.js`** — Added `/visa/:visaId` route (public, no auth required).

## [2026-04-05] - Draft application expiry, TEMP ID, admin expiry config

### Added
- **TEMP application ID** (`backend/routes/applications.py`)
  - Every new draft is automatically assigned a temporary ID in the format `TEMP{DDMMYYYY}{HHMMSS}` (e.g. `TEMP05042026143022`) at creation time, visible in My Applications before a real `APP…` ID is assigned at submission.
  - `PATCH /api/applications/draft` response now includes `tempId` and `expiresAt` fields.

- **Draft expiry — auto-delete** (`backend/server.py`, `backend/routes/applications.py`)
  - Drafts now store an `expiresAt` timestamp computed from the configurable expiry duration.
  - Every `PATCH /api/applications/draft` call (save/update) resets the `expiresAt` to now + configured duration, effectively extending the timer when the user revisits.
  - A background `asyncio` task runs every 60 seconds and hard-deletes any documents where `status == "draft"` and `expiresAt < now`.
  - `GET /api/applications/my-applications` now includes `expiresAt` per application so the frontend can display the countdown.

- **Draft expiry configuration — Admin Utility Settings** (`backend/models/utility_settings.py`, `backend/routes/utility.py`, `frontend/src/components/admin/UtilitySettings.jsx`)
  - New fields on `utility_settings`: `draft_expiry_days`, `draft_expiry_hours`, `draft_expiry_minutes`, `draft_expiry_seconds`. Default: 7 days.
  - `GET /api/utility/settings` and `PATCH /api/utility/settings` now include these fields.
  - New "Draft Application Expiry" card in Admin → Utility Settings with four number inputs (Days / Hours / Minutes / Seconds), a live "Total:" summary line, and saved via the existing Save button.

## [2026-04-05] - Favicon installation

### Added
- **Favicon & web manifest** (`frontend/public/`)
  - Added `apple-touch-icon.png`, `favicon-16x16.png`, `favicon-32x32.png`, `favicon.ico`, `android-chrome-192x192.png`, `android-chrome-512x512.png`, and `site.webmanifest` to the public root.
  - Added corresponding `<link>` tags to `frontend/public/index.html`:
    - `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`
    - `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">`
    - `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">`
    - `<link rel="manifest" href="/site.webmanifest">`

---

## [2026-04-04] - Multi-draft application support; Continue button fix

### Added
- **Multi-draft applications** (`backend/routes/applications.py`, `frontend/src/pages/VisaApplication.jsx`)
  - Users can now have multiple concurrent draft applications, one per visa type.
  - `PATCH /api/applications/draft` upsert is now scoped by `userId + visaId`, so drafts for different visa options are stored independently.
  - New `GET /api/applications/drafts` endpoint returns all drafts for the logged-in user (up to 100).
  - `VisaApplication.jsx` loads all drafts on mount, matches the current `visaId` to resume the correct draft at its saved step.
  - If the user navigates to a visa option while having existing draft(s) for *other* visa options, a conflict modal is shown with clickable cards for each existing draft (resume from step 1) and a "No, Start New Application" button that dismisses without deleting any drafts.

- **My Applications — Continue button fix** (`backend/routes/applications.py`, `frontend/src/pages/MyApplications.jsx`)
  - `GET /api/applications/my-applications` now returns `visaId` for each application (with fallback to `selectedVisaOption.id` for older records).
  - `handleContinueDraft` navigates to `/apply/{visaId}` so each draft's Continue button routes to the correct visa application form at the saved step.

### Changed
- `backend/routes/applications.py`: `my-applications` response includes `visaId` field.
- `frontend/src/pages/MyApplications.jsx`: guard added to show an error toast if `visaId` is missing (legacy records).

---

## [2026-04-04] - Razorpay & Tazapay payment integration

### Added
- **Razorpay integration** (`backend/routes/payment_gateways.py`, `frontend/src/components/application-steps/Step10Payment.jsx`)
  - `POST /api/payment-gateways/razorpay/create-order` — authenticates with Razorpay REST API, creates an order (amount converted to smallest currency unit), persists `razorpay_order_id` on the application, returns `{order_id, amount, currency, key_id}`.
  - `POST /api/payment-gateways/razorpay/verify-payment` — validates the Razorpay HMAC-SHA256 payment signature; on success marks application `status = submitted` and stores `razorpay_payment_id`.
  - Frontend: dynamically loads Razorpay Checkout SDK (`checkout.razorpay.com/v1/checkout.js`) on demand, opens the inline payment modal, and on handler success calls verify then redirects to `/payment-return?gateway=razorpay&transaction_id=...`.
  - Payment cancellation (modal dismissed) is handled gracefully — processing state is reset without an error toast.

- **Tazapay integration** (`backend/routes/payment_gateways.py`, `frontend/src/components/application-steps/Step10Payment.jsx`)
  - `POST /api/payment-gateways/tazapay/create-checkout` — calls Tazapay `/v2/checkout`, persists `tazapay_session_id` on the application, returns `{redirect_url, session_id}`.
  - `GET /api/payment-gateways/tazapay/verify/{session_id}?application_id=...` — fetches session status from Tazapay; accepted statuses `success`/`completed`/`paid` mark application `submitted`.
  - Sandbox base URL `api.sandbox.tazapay.com` / live `api.tazapay.com` selected from config `tazapay_mode`.
  - Frontend redirects to Tazapay hosted page; on return, `PaymentReturn` detects `gateway=tazapay` and calls the verify endpoint.

- **`PaymentReturn.jsx` — multi-gateway support**
  - Detects `gateway` query param (`paypal` / `razorpay` / `tazapay`) and branches accordingly:
    - `razorpay` — verification already done inline; reads `transaction_id` from URL and shows success.
    - `tazapay` — calls backend verify endpoint, then shows success or failure.
    - `paypal` (default) — existing capture flow unchanged.
  - "Transaction ID" label made gateway-agnostic (removed PayPal-specific label text).

### Changed
- `backend/routes/payment_gateways.py`: added `import hmac`, `import hashlib`; new request models `RazorpayCreateOrderRequest`, `RazorpayVerifyRequest`, `TazapayCheckoutRequest`; defined `RAZORPAY_BASE`, `TAZAPAY_SANDBOX_BASE`, `TAZAPAY_LIVE_BASE` constants.

---

## [2026-04-04] - Admin-controlled fee breakdown visibility; new Utility tab; progress stepper; payment gateway radio cards; declaration

### Added
- **Utility Settings — admin toggle for fee breakdown visibility** (`backend/models/utility_settings.py`, `backend/routes/utility.py`, `backend/server.py`, `frontend/src/components/admin/UtilitySettings.jsx`, `frontend/src/pages/AdminPanel.jsx`, `frontend/src/components/application-steps/Step10Payment.jsx`)
  - New `utility_settings` MongoDB collection with a `show_fee_breakdown` boolean field (default `true`).
  - New backend model `UtilitySettings` / `UtilitySettingsUpdate` (`backend/models/utility_settings.py`).
  - New routes registered at `/api/utility`:
    - `GET /api/utility/settings` — public, returns current settings.
    - `PATCH /api/utility/settings` — admin/super_admin only, updates settings.
  - New **Utility** tab added to Admin Panel (super_admin only), with a **"Show Fee Breakdown to Customers"** toggle and Save button (`frontend/src/components/admin/UtilitySettings.jsx`).
  - Admin Panel tab grid updated from `grid-cols-5` → `grid-cols-6` to accommodate the new tab.
  - Payment step (`Step10Payment`) now fetches `/api/utility/settings` on load and conditionally renders the itemised fee rows (Government Fee, Processing Fee, Our Fee). The **Fee Breakdown heading**, **visa option name**, and **Total Amount** are always shown regardless of the toggle.

- **Application form progress stepper** (`frontend/src/pages/VisaApplication.jsx`)
  - Replaced the flat black linear progress bar with a connected stepper.
  - Each completed step shows a green circle with a white tick; the active step shows a blue circle with the step number; future steps are grey.
  - Connector lines between dots fill green as each step is completed.
  - Step labels remain visible on large screens (`lg:block`); dots are always shown on all screen sizes.
  - Removed the now-unused `Progress` component import.

- **Payment step — gateway radio cards, logos, and declaration** (`frontend/src/components/application-steps/Step10Payment.jsx`)
  - Replaced the dropdown gateway selector with clickable radio cards — one card per enabled gateway, with a radio indicator, logo image, description text, and a Test Mode badge.
  - Logo images loaded from CDN (PayPal, Razorpay SVGs) with automatic fallback to a `CreditCard` icon + name if the image fails to load.
  - Added a **Declaration of Applicant** section (blue header matching theme) with two mandatory checkboxes:
    1. I declare the information is truthful, complete and correct.
    2. I have read and understood the terms and conditions, refund policy, and privacy policy.
  - The **Pay Now** button is disabled until a gateway is selected and both declaration checkboxes are ticked.
  - Fixed duplicate-declaration colour: Declaration header changed from custom `#1a85b8` to `bg-blue-600` to match the site theme.
  - Fixed compile error caused by duplicate component declaration (old code left appended after rewrite); removed the stale block.

---

## [2026-04-03] - Configurable PayPal currency; fix "seller doesn't accept payments in your currency"

### Fixed
- **PayPal sandbox error: "This seller doesn't accept payments in your currency"** (`backend/routes/payment_gateways.py`, `backend/models/payment_gateway_config.py`, `frontend/src/components/admin/PaymentGatewaySettings.jsx`)
  - Root cause: currency was hardcoded to `USD` in the PayPal `create-order` call, but the sandbox merchant account's primary currency was different.
  - Added `paypal_currency` field (default `"USD"`) to `PaymentGatewayConfig` and `PaymentGatewayConfigUpdate` models.
  - `create-order` endpoint now reads `config.paypal_currency` instead of hardcoding `"USD"`.
  - Admin Panel → Payment Gateways → PayPal now has a **Currency** dropdown (USD, GBP, EUR, AUD, CAD, SGD, HKD, JPY, MYR, THB, PHP) with a note that the value must match the primary currency of the PayPal account and that INR is not supported by PayPal.

## [2026-04-03] - *Draft applications visible in Admin Panel"



### Added
- **Draft applications visible in Admin Panel** (`backend/routes/applications.py`, `frontend/src/pages/AdminPanel.jsx`)
  - Backend `GET /api/applications` now accepts `include_drafts=true` query param to include draft records in the response.
  - Passing `status=draft` explicitly also works to fetch only drafts.
  - Admin panel initial load now fetches all applications including drafts so stat cards are accurate.
  - New **"Draft"** stat card showing count of in-progress applications alongside Pending, Submitted, Paid, Approved, Rejected.
  - **"Draft / In Progress"** option added to the status filter dropdown.
  - "All Status" filter continues to exclude drafts (admins must explicitly select Draft to see them).
  - Table rows for draft applications handle missing data gracefully:
    - Application ID shows "Not assigned" (italic) when the draft hasn't reached the document upload step yet.
    - Name, email, nationality, visa type show "—" if not yet filled in.
    - Submitted date shows "Not submitted" for drafts.
    - No status-change selector or CSV download button shown for draft rows; they display "In Progress" instead.

## [2026-04-03] - OTP verification for sign-up; admin toggle for login/signup OTP

### Added
- **OTP-gated sign-up flow** (`backend/routes/auth.py`, `frontend/src/pages/SignUp.jsx`)
  - When `otp_signup_enabled` is `True` in the email provider config, `/api/auth/register` no longer creates the account immediately. Instead it stores a pending registration (hashed password + role) in a `pending_registrations` collection, dispatches a 6-digit OTP, and returns `otp_required: true`.
  - New endpoint `POST /api/auth/verify-signup-otp` validates the OTP, creates the user, cleans up the pending record, and returns a JWT token — identical flow to login OTP.
  - Bootstrap guard: the very first user (who becomes `super_admin`) always bypasses signup OTP regardless of config, preventing a chicken-and-egg lockout.
  - `SignUp.jsx` handles both response shapes: if `otp_required` is present it switches to an OTP entry step (same design as `SignIn` OTP step); otherwise it logs the user in directly.

- **Conditional OTP for login** (`backend/routes/auth.py`, `frontend/src/pages/SignIn.jsx`)
  - `/api/auth/login` now checks `otp_login_enabled` from the DB config (default `True` to preserve existing behaviour).
  - If `False`, credentials are validated and a JWT token is returned directly — no OTP dispatch.
  - `SignIn.jsx` `handleCredentialsSubmit` now reads the response: if `data.token` is present it completes the login immediately; otherwise it falls through to the OTP step.

- **OTP Verification settings card in Admin Panel Email Providers tab** (`frontend/src/components/admin/EmailProviderSettings.jsx`)
  - New card at the top of the Email Providers panel (before Mandrill) with two toggles:
    - **Require OTP on Login** — maps to `otp_login_enabled` (default `True`).
    - **Require OTP on Sign Up** — maps to `otp_signup_enabled` (default `False`).
  - Saved alongside other provider settings via `PUT /api/email-providers/config`.

### Changed
- **`backend/models/email_provider_config.py`**: Added `otp_login_enabled: bool = True` and `otp_signup_enabled: bool = False` to `EmailProviderConfig`, `EmailProviderConfigUpdate`, and `EmailProviderConfigResponse`.
- **`backend/routes/email_providers.py`**: Both OTP fields included in GET `/config`, GET `/config/admin`, and handled by PUT `/config`.
- **`backend/models/user.py`**: Added `SignupOTPVerifyRequest` model (email + otp).

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
