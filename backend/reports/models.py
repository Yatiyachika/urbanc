from django.db import models


class ViolationReport(models.Model):
    """A citizen-submitted parking violation report with photo and location."""

    image = models.ImageField(upload_to="violation_images/%Y/%m/")
    number_plate = models.CharField(max_length=32, blank=True, default="")
    latitude = models.FloatField()
    longitude = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        label = self.number_plate.strip() or "(no plate)"
        return f"{label} @ {self.created_at:%Y-%m-%d %H:%M}"
