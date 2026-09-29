import json
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.db import DatabaseError, connection
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import Enquiry

MAX_LENGTHS = {"name": 100, "company": 120, "email": 254, "phone": 30, "service": 100, "goals": 3000}

def api_root(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    except DatabaseError:
        return JsonResponse({"service": "Riyadvi API", "status": "error", "database": "unavailable"}, status=503)
    return JsonResponse({
        "service": "Riyadvi API",
        "status": "ok",
        "database": "connected",
        "endpoints": {"enquiries": "POST /api/enquiries/", "admin": "/admin/"},
    })

@csrf_exempt
@require_POST
def create_enquiry(request):
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Please submit valid JSON."}, status=400)
    if not isinstance(data, dict):
        return JsonResponse({"error": "Please submit a valid enquiry."}, status=400)
    values = {}
    for field, limit in MAX_LENGTHS.items():
        value = data.get(field)
        if not isinstance(value, str) or not value.strip() or len(value.strip()) > limit:
            return JsonResponse({"error": f"Please provide a valid {field}."}, status=400)
        values[field] = value.strip()
    try:
        validate_email(values["email"])
    except ValidationError:
        return JsonResponse({"error": "Please enter a valid email address."}, status=400)
    enquiry = Enquiry.objects.create(**values)
    return JsonResponse({"ok": True, "id": enquiry.pk}, status=201)
