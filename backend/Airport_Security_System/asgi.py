"""
ASGI config for Airport_Security_System project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Airport_Security_System.settings')
django.setup()

from django.urls import path
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from Airport_Security.consumers import PracticeConsumer, CameraTest, FaceDetectionConsumer

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter([
            path('practice', PracticeConsumer.as_asgi()),
            path('camera/open', CameraTest.as_asgi()),
            path('face/detection', FaceDetectionConsumer.as_asgi()),
        ])
})
