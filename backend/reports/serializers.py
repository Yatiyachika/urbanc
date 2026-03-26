from rest_framework import serializers

from .models import ViolationReport


class ViolationReportSerializer(serializers.ModelSerializer):
    """
    Multipart form from React Native (axios + FormData).

    Field names must match exactly: image, number_plate, latitude, longitude.
    Strings from FormData are coerced for latitude/longitude.
    number_plate may be "" when OCR returns no text (still send the key).
    """

    image = serializers.ImageField(
        required=True,
        error_messages={"required": "No image file was sent. Append the file as 'image' in FormData."},
    )
    number_plate = serializers.CharField(
        required=True,
        allow_blank=True,
        max_length=32,
        error_messages={"required": "number_plate is required (use an empty string if OCR found nothing)."},
    )
    latitude = serializers.FloatField(required=True)
    longitude = serializers.FloatField(required=True)

    class Meta:
        model = ViolationReport
        fields = ("image", "number_plate", "latitude", "longitude")

    def validate_number_plate(self, value):
        return (value or "").strip()
