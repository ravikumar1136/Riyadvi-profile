# Django + MySQL API

The Django API stores project enquiries in MySQL.

1. Use MySQL 8.0.11 or newer and create the database: `CREATE DATABASE riyadvi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
2. In `backend/`, create and activate a virtual environment, then install dependencies: `pip install -r requirements.txt`.
3. Copy `.env.example` to `.env` and set your MySQL credentials and a random `DJANGO_SECRET_KEY`. Django loads this file automatically.
4. On this development machine, start MySQL 8.4 first with `./start-mysql-local.ps1` from `backend/`. Then run `python manage.py migrate` and `python manage.py runserver` from `backend/`.
5. Set `NEXT_PUBLIC_API_URL=http://localhost:8000` in the Next.js `.env.local` (or point it at the deployed API origin).

On the development machine used for this setup, MySQL 5.7 remains untouched. A separate MySQL 8.4 instance runs locally on port `3307`; its connection details are in the ignored `backend/.env` file.

## Railway deployment

Create a Railway project with a MySQL service, then add this GitHub repository as a service with its root directory set to `/backend`. Railway will build the included `Dockerfile`. The container runs migrations, collects static files, and starts Gunicorn when it launches. Add these variables to the Django service, using Railway's MySQL variable references:

- `DJANGO_SECRET_KEY`: a generated secret
- `DJANGO_DEBUG`: `false`
- `MYSQLHOST`: `${{MySQL.MYSQLHOST}}`
- `MYSQLPORT`: `${{MySQL.MYSQLPORT}}`
- `MYSQLDATABASE`: `${{MySQL.MYSQLDATABASE}}`
- `MYSQLUSER`: `${{MySQL.MYSQLUSER}}`
- `MYSQLPASSWORD`: `${{MySQL.MYSQLPASSWORD}}`

Generate a public domain for the Django service. Railway supplies `RAILWAY_PUBLIC_DOMAIN` automatically. After the frontend has its own public URL, add that origin to `CORS_ALLOWED_ORIGINS`. The frontend should point `NEXT_PUBLIC_API_URL` to the Django domain.

`POST /api/enquiries/` accepts name, company, email, phone, service, and goals as JSON. The Django admin at `/admin/` can be used to review submitted enquiries after creating a superuser with `python manage.py createsuperuser`.
