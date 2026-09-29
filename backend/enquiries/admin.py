from django.contrib import admin
from .models import Enquiry

@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ("company", "name", "email", "service", "created_at")
    search_fields = ("company", "name", "email", "service")
    readonly_fields = ("created_at",)
