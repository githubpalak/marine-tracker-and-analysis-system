"""
URL configuration for marine_tracker project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from vessel_api.views1 import VesselViewSet
from port_api.views import PortViewSet
from lighthouse_api.views import LighthouseViewSet
from fleet_api.views import FleetViewSet
from django.conf import settings
from django.conf.urls.static import static

# Create a router and register our viewsets with it
router = routers.DefaultRouter()
router.register(r'vessels', VesselViewSet)
router.register(r'ports', PortViewSet)
router.register(r'lighthouses', LighthouseViewSet)
router.register(r'fleets', FleetViewSet)

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
