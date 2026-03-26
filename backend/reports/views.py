import logging

from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import ViolationReportSerializer

logger = logging.getLogger(__name__)


class ReportCreateView(APIView):
    """
    POST multipart/form-data (React Native FormData + axios):

      - image: file
      - number_plate: string (may be "" if OCR failed — still include the field)
      - latitude, longitude: numbers (strings from FormData are OK)
    """

    authentication_classes = []
    permission_classes = []
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = ViolationReportSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "status": "error",
                    "message": "Invalid or missing data.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        report = serializer.save()

        plate = report.number_plate or ""
        if not plate.strip():
            logger.warning(
                "ViolationReport id=%s: empty number_plate (OCR text may be empty).",
                report.pk,
            )

        try:
            image_path = report.image.path
        except (NotImplementedError, ValueError):
            image_path = report.image.name

        logger.info(
            "ViolationReport id=%s | number_plate=%r | latitude=%s | longitude=%s | image_path=%s",
            report.pk,
            plate,
            report.latitude,
            report.longitude,
            image_path,
        )

        return Response(
            {
                "status": "success",
                "data": {
                    "id": report.pk,
                    "number_plate": plate,
                    "latitude": report.latitude,
                    "longitude": report.longitude,
                },
            },
            status=status.HTTP_201_CREATED,
        )
