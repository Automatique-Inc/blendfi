# Backend Architecture and Routes

## Overview
Koa-based API implementing Plaid link flow with Supabase-auth authentication and secure token storage.

## Folder Structure
- `src/server.ts` — process entry; starts the HTTP server.
- `src/config/env.ts` — environment loading/validation via dotenv.
- `src/config/app.ts` — Koa app setup (CORS, bodyparser, routing, error handler).
- `src/middleware/errorHandler.ts` — centralized error handling.
- `src/middleware/auth.ts` — validates Supabase bearer token and populates `ctx.state.user`.
- `src/routes/index.ts` — defines `/api` routes.
- `src/controllers/plaid.controller.ts` — Plaid endpoints: create link token, exchange public token.
- `src/controllers/bankConnection.controller.ts` — list and delete bank connections.
- `src/services/plaid.service.ts` — Plaid client configuration using env.
- `src/services/bankConnection.service.ts` — persistence against Supabase table.
- `src/utils/supabase.ts` — Supabase admin client and user extraction.
- `src/utils/crypto.ts` — AES‑256‑GCM encryption utilities for secrets.

## Request Lifecycle
1. `server.ts` loads `app` and starts listening on `PORT`.
2. `app.ts` applies middleware in order:
   - CORS
   - `errorHandler`
   - `bodyParser`
   - `/api` router
3. Authenticated routes use `requireAuth` to validate Supabase token and attach `ctx.state.user`.
4. Controllers invoke services (Plaid, DB) and return JSON.

## Routes
Base: `/api`

- `GET /api/health`
  - Liveness probe. Returns `{ ok: true }`.

- `POST /api/plaid/create-link-token`
  - Auth required. Uses Supabase user id as `client_user_id`.
  - Returns `{ linkToken, expiration }` from Plaid.

- `POST /api/plaid/exchange-public-token`
  - Auth required. Body: `{ publicToken, accountId, institutionName }`.
  - Exchanges `public_token` for `access_token` and `item_id`.
  - Encrypts `access_token` using AES‑GCM and upserts `bank_connections` row with `user_id`, `account_id`, `institution_name`, `item_id`.
  - Returns `{ success: true }`.

- `GET /api/bank-connections`
  - Auth required. Lists `{ account_id, institution_name }` for the user.

- `DELETE /api/bank-connections/:accountId`
  - Auth required. Deletes a connection for the user.

## Environment
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — server-side Supabase admin client.
- `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV` — Plaid configuration.
- `ENCRYPTION_KEY` — base64 32 bytes; AES‑256‑GCM key.
- `PORT` — http port, default 3000.

## Data Model (Supabase)
Table `public.bank_connections` with unique `(user_id, account_id)` and columns:
- `access_token_encrypted` (TEXT)
- `item_id` (TEXT)
- `institution_name` (TEXT)

Suggested DDL is in `apps/backend/README.md`.

## Security Notes
- Supabase auth token must be validated on every request.
- Plaid secret never exposed to the client.
- Access tokens are encrypted at rest.
- Add HTTPS, rate limiting, and request logging in production.

## Extensibility
- Add webhooks for Plaid/Bridge in `src/routes` and controllers.
- Introduce repository layer if moving from Supabase to another DB.
- Add domain models and DTO validation with zod/yup for stricter payloads.
