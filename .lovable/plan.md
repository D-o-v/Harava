
# Harava API Integration Plan

Goal: keep the current UI and connect every endpoint in the Postman collection (platform admin, tenant/firm console, client portal, auth + MFA, invitations, companies, QuickBooks connect + data + reports, dashboards, notifications, news, reference data), and fix the invitation-acceptance link that landed on `/finsight?token=…`.

## What ships in this pass

### 1. API foundation (`src/lib/api/`)
- `client.ts` — typed `fetch` wrapper. Reads `NEXT_PUBLIC_API_BASE_URL`, injects `Authorization: Bearer <token>`, auto-refreshes on 401 using `/api/v1/auth/refresh` (staff/portal) or `/api/v1/platform/auth/refresh` (platform). Unwraps the standard `{ data, error }` envelope, throws typed `ApiError`.
- `tokens.ts` — persists `platformToken`, `staffToken`, `portalToken`, `inviteToken` in `localStorage` (with `harava_*` prefix) and exposes helpers.
- `endpoints.ts` — one function per Postman request, grouped by folder (platform, auth, account, invitations, users, mfa, companies, quickbooks, qb-data, portal, portal-dashboard, portal-reports, tenant-dashboard, tenant-reports, notifications, news, reference).
- `hooks.ts` — small `useApi` / `useApiMutation` (no extra deps; SWR-lite around `useState + useEffect`) so pages stay drop-in.

### 2. Auth rewrite (`src/lib/auth.tsx`)
- Replace hardcoded demo users with real `POST /api/v1/auth/login`, `/mfa/verify`, `/refresh`, `/logout`, and `POST /api/v1/platform/auth/login` (platform admin).
- On login, fetch `GET /api/v1/account/me` (staff) or `/api/v1/portal/me` (company user) or platform identity, derive role/products for the existing sidebar logic (super_admin → admin; owner/admin → finsight firm; company_user → portal).
- Route routing after login by scope: platform → `/admin`, firm staff → `/finsight`, company user → `/finsight/clients/me` (portal view — see below).
- Keep demo-login buttons but hide them unless `NEXT_PUBLIC_ENABLE_DEMO_LOGIN=true` (no visible UI change by default in dev).

### 3. Invitation flow (fixes the `?token=…` bug)
- New route `src/app/auth/accept/page.tsx` that reads `?token=` from URL, calls `GET /api/v1/auth/invitations/preview`, shows firm/company + role, then `POST /api/v1/auth/invitations/accept` (staff owner, staff member, or company user — same endpoint). Then routes to the correct dashboard.
- Add a Next `middleware.ts` (or a top-level redirect in `app/layout`) that catches `?token=` on any URL and rewrites to `/auth/accept?token=…`. Fixes `https://harava.netlify.app/finsight?token=…` landing on the wrong place.
- Forgot/reset password screens wired to `/auth/password/forgot` + `/reset` (`/auth/reset-password?token=…`).
- Verify email + resend verification wired.

### 4. MFA (all three factors)
- Settings page card in `src/app/profile/page.tsx` (already exists) gets a real MFA section:
  - TOTP: `POST /account/mfa/totp/setup` (render QR + secret), then confirm via `/totp/enable`.
  - Email MFA enable + step-up OTP send.
  - SMS MFA enable + step-up OTP send.
  - Disable MFA.
- Login flow: if login returns `mfaRequired`, show inline MFA code input and call `/auth/mfa/verify`.

### 5. Platform admin (`/admin/*`)
- `/admin` overview → tenant KPIs from `GET /platform/tenants`.
- `/admin/clients` → `List / Provision / Suspend / Activate tenants` (matches existing "Client Management" page).
- `/admin/users` keeps its shell but the "Add user" modal calls `POST /platform/tenants` for tenant provisioning (owner invite). Existing tenant/staff/company user management moves under `/finsight/*` since those are firm-scoped.
- Broadcast composer wired to `POST /platform/notifications/broadcast`.

### 6. Firm console (owner/admin — mounted under `/finsight`)
- `/finsight/clients` → `GET /tenant/companies` list, actions: view / update / suspend / activate / invite user.
- `/finsight/clients/[id]` → company detail with tabs: Overview (dashboard KPIs), P&L, Cash flow, Balance sheet, A/R, A/P, Sales, Expenses, Inventory, Activity (all 10 dashboard endpoints), Reports (all 22 QB report endpoints), QuickBooks entities browser (dropdown + paged table over all 30+ entities using `/quickbooks/entities` + `/quickbooks/{slug}`), Users (list + invite), QB connection (status/connect/reconnect/disconnect), Notifications broadcast.
- QuickBooks connect: `POST /tenant/quickbooks/connect` returns Intuit URL — open in popup, on callback (`/api/v1/quickbooks/callback`) the server closes the popup and returns success; UI polls `/quickbooks/status`.
- Firm-level: invite staff, list/edit/delete staff (`/account/invitations`, `/account/users`).

### 7. Client portal (company user)
- Company user login lands on portal dashboards, mounted under `/finsight` too but reads from `/portal/*`.
- `/finsight` renders portal dashboards when `role === company_user`, firm summary otherwise.
- All 10 portal dashboard sections + 22 portal reports + all QB entity views + `/portal/me` for branding.

### 8. Reference data
- `src/lib/reference.ts` — cached loaders for `GET /reference/timezones|countries|currencies|countries/{code}`.
- Registration and "Add company" / tenant-provisioning modals use these for real country + currency + timezone dropdowns (replaces any hardcoded lists) — same UI, real data.

### 9. Notifications + News
- Header bell wired to `/notifications/unread-count` (poll every 60s) + `/notifications` list + mark-read.
- Device registration on login for web push (best-effort, silently skips if no permission).
- New `/finsight/news` page (or existing notifications page tab) backed by `/news` with country + category filters.

### 10. Config
- New `.env` keys: `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:8080`), `NEXT_PUBLIC_ENABLE_DEMO_LOGIN`.
- Add a `<ApiConfigBanner>` shown only in dev if the API is unreachable.

## Technical notes
- The Postman collection uses optional DPoP. The header is emitted server-side only if `harava.dpop.enabled=true`. I will NOT ship jsrsasign client-side by default (heavy, and the collection says it's harmless when disabled). If DPoP is enforced I'll add a small helper later — cheap to bolt on.
- All API calls go through the `client.ts` wrapper so a single choke point handles the envelope, 401 refresh, tenant/portal token selection, and `X-Tenant-Subdomain` header when required.
- No visual redesign. Existing pages keep their look; I only swap the data source and add missing pages (`/auth/accept`, `/auth/reset-password`, `/finsight/clients/[id]`, `/finsight/news`).

## Out of scope for this pass
- AccrediAI (`/accrediai/*`) and ProEd (`/proed/*`) — no matching API in the collection. Left untouched.
- Real-time WebSockets — not in the collection.

## Question before I start
The Postman `{{baseUrl}}` is not shown here. Should I default `NEXT_PUBLIC_API_BASE_URL` to `http://localhost:8080` (from your backend dev's link) and ship a Netlify env override note, or do you already have a hosted URL I should hard-wire?
