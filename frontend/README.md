# Riyadvi website frontend

This folder contains the Next.js frontend only. The Django API and MySQL configuration are in `../backend`.

## Run locally

1. Install Node.js dependencies with `pnpm install` (or `npm install`).
2. Copy `.env.example` to `.env.local`.
3. Set `NEXT_PUBLIC_API_URL=http://localhost:8000` while Django runs locally.
4. Run `pnpm dev` (or `npm run dev`) from this folder.

For hosting, set the deployment root to `frontend/` and configure `NEXT_PUBLIC_API_URL` to the public Django backend URL, without a trailing slash. The Django service must allow the deployed frontend origin in `CORS_ALLOWED_ORIGINS`.
