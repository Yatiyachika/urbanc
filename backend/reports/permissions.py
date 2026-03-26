import ipaddress

from django.conf import settings
from rest_framework.permissions import BasePermission


class AllowedUrbanFlowIP(BasePermission):
    """
    Simple IP whitelist to reduce spam/abuse.

    - Checks requester's remote IP against URBANFLOW_ALLOWED_CIDRS (list of CIDR strings).
    - Default CIDRs are private networks + localhost (good for dev with Expo Go).
    """

    message = "Forbidden: your IP is not allowed to submit reports."

    def has_permission(self, request, view):
        allowed_cidrs = getattr(settings, "URBANFLOW_ALLOWED_CIDRS", [])
        if not allowed_cidrs:
            return False

        remote_ip = request.META.get("HTTP_X_FORWARDED_FOR")
        if remote_ip:
            # If proxies exist, client IP is first entry.
            remote_ip = remote_ip.split(",")[0].strip()
        else:
            remote_ip = request.META.get("REMOTE_ADDR")

        if not remote_ip:
            return False

        try:
            ip_obj = ipaddress.ip_address(remote_ip)
        except ValueError:
            return False

        for cidr in allowed_cidrs:
            try:
                net = ipaddress.ip_network(cidr, strict=False)
            except ValueError:
                continue
            if ip_obj in net:
                return True

        return False

