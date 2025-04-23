from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Vessel, VesselPosition
from .serializers import VesselSerializer, VesselPositionSerializer, VesselListSerializer

class VesselViewSet(viewsets.ModelViewSet):
    queryset = Vessel.objects.all().prefetch_related('positions')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['mmsi', 'name', 'vessel_type']
    search_fields = ['mmsi', 'name']
    ordering_fields = ['name', 'mmsi']

    def get_serializer_class(self):
        if self.action == 'list':
            return VesselListSerializer
        return VesselSerializer

class VesselPositionViewSet(viewsets.ModelViewSet):
    queryset = VesselPosition.objects.all().select_related('vessel')
    serializer_class = VesselPositionSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['vessel__mmsi', 'status']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']