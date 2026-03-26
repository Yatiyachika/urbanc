from django.contrib import admin

from .models import ViolationReport


@admin.register(ViolationReport)
class ViolationReportAdmin(admin.ModelAdmin):
    list_display = ("number_plate", "latitude", "longitude", "created_at")
    list_filter = ("created_at",)
    readonly_fields = ("created_at",)
