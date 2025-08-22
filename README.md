# BlendFi Monorepo

NPM workspaces monorepo with:
- `apps/mobile` — React Native (Expo)
- `apps/backend` — Koa API (Plaid + Supabase)
- `packages/*` — reserved for future shared libraries

## Prerequisites
- Node.js 18+
- Expo CLI (optional) for mobile
- Supabase project and Plaid sandbox credentials

## Install
```bash
npm install
```

## Backend
See `apps/backend/README.md` for details. Quickstart:
```bash
# setup env
cp apps/backend/.env.example apps/backend/.env
# run dev server
npm run dev -w @blendfi/backend
```

If the dev server fails to start, kill old runners or run the compiled server:
```bash
pkill -f 'ts-node-esm|nodemon|tsx watch src/server.ts' || true
npm run build -w @blendfi/backend
PORT=3000 node apps/backend/dist/server.js
```

## Mobile (Expo)
Set Expo envs (can use `.env` or your shell):
- `EXPO_PUBLIC_API_URL` (e.g., http://localhost:3000)
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_KEY`

Run:
```bash
npm run start -w @blendfi/mobile
# or clear cache after monorepo move
npm run start -w @blendfi/mobile -- -c
```

Metro and monorepo: if you later import local packages from `packages/*`, add a `metro.config.js` to include the monorepo root in watchFolders.

Plaid on native: `react-plaid-link` works for web; for iOS/Android, consider `react-native-plaid-link-sdk`.

## Conventions
- TypeScript strict mode
- SOLID-oriented structure
- Environment variables validated at startup
- Encrypted storage for sensitive tokens
