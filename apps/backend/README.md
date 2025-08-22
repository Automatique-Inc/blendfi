# @blendfi/backend

Minimal, high-quality Koa backend for Plaid integration and Supabase-authenticated APIs.

## Prerequisites
- Node.js 18+
- Supabase project (URL + Service Role Key)
- Plaid sandbox credentials

## Setup
1. Copy env template and fill values:
```bash
cp .env.example .env
```

2. Install deps at repo root:
```bash
npm install
```

## Scripts
- Dev: hot reloading
```bash
npm run dev -w @blendfi/backend
```
- Typecheck:
```bash
npm run typecheck -w @blendfi/backend
```
- Build:
```bash
npm run build -w @blendfi/backend
```
- Start (built):
```bash
npm run start -w @blendfi/backend
```

## Environment Variables
- `PORT` default 3000
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PLAID_CLIENT_ID`
- `PLAID_SECRET`
- `PLAID_ENV` one of `sandbox|development|production`
- `ENCRYPTION_KEY` base64 32-byte key for AES-256-GCM

Generate encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Endpoints
Base path: `/api`

- Health
  - GET `/api/health` → `{ ok: true }`

- Plaid
  - POST `/api/plaid/create-link-token`
    - Auth: `Authorization: Bearer <supabase_access_token>`
    - Body: `{}` (user inferred from token)
    - Response: `{ linkToken, expiration }`
  - POST `/api/plaid/exchange-public-token`
    - Auth: `Authorization: Bearer <supabase_access_token>`
    - Body: `{ publicToken, accountId, institutionName }`
    - Response: `{ success: true }`

- Bank Connections
  - GET `/api/bank-connections`
    - Response: `{ connections: [{ account_id, institution_name }] }`
  - DELETE `/api/bank-connections/:accountId` → `204`

## Testing (quick)
```bash
# Health
curl -s http://localhost:3000/api/health

# Create link token
curl -s -X POST http://localhost:3000/api/plaid/create-link-token \
  -H "Authorization: Bearer TOKEN"

# Exchange public token
curl -s -X POST http://localhost:3000/api/plaid/exchange-public-token \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"publicToken":"public-sandbox-...","accountId":"acc-123","institutionName":"Chase"}'
```

## Troubleshooting
- Dev server not starting or stuck with old runner (ts-node/nodemon):
```bash
pkill -f 'ts-node-esm|nodemon|tsx watch src/server.ts' || true
npm run dev -w @blendfi/backend
```
- Compile and run built server (fallback):
```bash
npm run build -w @blendfi/backend
PORT=3000 node apps/backend/dist/server.js
```
- Ensure Node 18+ and `ENCRYPTION_KEY` is exactly 32 bytes base64.
- Port already in use: change `PORT` in `.env` or stop the process using 3000.
