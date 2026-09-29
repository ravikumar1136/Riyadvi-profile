# Riyadvi Software Technologies

The application is split into two deployable folders:

- `frontend/` — Next.js website. Use this as the project/root directory when deploying the frontend.
- `backend/` — Django REST API with MySQL. Deploy this as a separate service.

For local development, start Django from `backend/` and Next.js from `frontend/`. Configure `NEXT_PUBLIC_API_URL` in `frontend/.env.local` to point at the Django server. For hosted services, use the public backend URL and allow the public frontend origin in Django's `CORS_ALLOWED_ORIGINS`.
