# BlendFi Backend Setup Instructions (Koa.js)

## Overview
Backend server to handle Plaid integration with Supabase authentication for the BlendFi React Native app.

## Plaid Sandbox Credentials
- **Client ID**: `689fb113645de1002423c713`
- **Sandbox Secret**: `87543e82e0ae89baef342423b1b0ca`
- **Environment**: `sandbox`

## Required Dependencies

```bash
npm init -y
npm install koa @koa/router @koa/cors koa-bodyparser plaid @supabase/supabase-js dotenv
npm install -D nodemon
```

## Environment Variables (.env)
```
PLAID_CLIENT_ID=689fb113645de1002423c713
PLAID_SECRET=87543e82e0ae89baef342423b1b0ca
PLAID_ENV=sandbox
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3000
```

## Required Endpoints

### 1. POST /api/plaid/create-link-token
Creates a Plaid Link token for the React Native app.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {supabase_access_token}
```

**Request Body:**
```json
{
  "userId": "supabase_user_id"
}
```

**Response:**
```json
{
  "linkToken": "link-sandbox-token-here",
  "expiration": "2024-01-01T00:00:00Z"
}
```

**Key Requirements:**
- Validate Supabase auth token using `supabase.auth.getUser()`
- Use Plaid's `/link/token/create` endpoint
- Set `user.client_user_id` to the Supabase user ID
- Configure for `transactions` and `auth` products
- Set `country_codes` to `['US']`

### 2. POST /api/plaid/exchange-public-token
Exchanges Plaid public token for access token and stores in Supabase.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {supabase_access_token}
```

**Request Body:**
```json
{
  "publicToken": "public-sandbox-token",
  "accountId": "plaid_account_id",
  "institutionName": "Chase Bank",
  "userId": "supabase_user_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bank account connected successfully"
}
```

**Key Requirements:**
- Validate Supabase auth token
- Use Plaid's `/link/token/exchange` endpoint  
- Store access token securely in Supabase (consider encryption)
- Create/update user's bank account record in Supabase

## Supabase Integration Notes

### Authentication Validation
```javascript
// Validate user session on each request
const { data: { user }, error } = await supabase.auth.getUser(token)
if (error || !user) {
  return ctx.throw(401, 'Invalid authentication')
}
```

### Database Schema Suggestions
```sql
-- Table to store user's connected bank accounts
CREATE TABLE user_bank_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  plaid_access_token TEXT NOT NULL, -- Consider encrypting
  plaid_item_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  account_name TEXT,
  account_mask TEXT, -- Last 4 digits
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Testing with React Native App

The app expects these endpoints to be running on `http://localhost:3000` (or update the fetch URLs in `PlaidLinkScreen.tsx`).

**Current React Native integration:**
1. App shows user session (email + user ID)
2. Fetches link token from `/api/plaid/create-link-token` 
3. Opens Plaid Link with real token
4. On success, sends public token to `/api/plaid/exchange-public-token`
5. Shows success message with institution name

## Security Notes
- Always validate Supabase auth tokens server-side
- Never expose Plaid secret key to client
- Consider encrypting stored Plaid access tokens
- Use HTTPS in production
- Implement rate limiting

## Package.json Script
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## Next Steps After Setup
1. Start server: `npm run dev`
2. Update React Native app URLs if not using localhost:3000
3. Test Plaid Link flow with sandbox bank credentials
4. Implement webhook handling for transaction updates (future)