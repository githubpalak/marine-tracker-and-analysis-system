from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Fleet
from .serializers import FleetSerializer, FleetDetailSerializer
from vessel_api.models import Vessel

class FleetViewSet(viewsets.ModelViewSet):
    queryset = Fleet.objects.all()
    serializer_class = FleetSerializer
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return FleetDetailSerializer
        return FleetSerializer
    
    @action(detail=True, methods=['post'])
    def add_vessel(self, request, pk=None):
        """Add a vessel to a fleet"""
        try:
            fleet = self.get_object()
            mmsi = request.data.get('mmsi')
            
            if not mmsi:
                return Response({"error": "MMSI is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                vessel = Vessel.objects.get(mmsi=mmsi)
                fleet.vessels.add(vessel)
                return Response({"message": f"Vessel {vessel.name} added to fleet {fleet.name}"}, status=status.HTTP_200_OK)
            except Vessel.DoesNotExist:
                return Response({"error": f"No vessel found with MMSI {mmsi}"}, status=status.HTTP_404_NOT_FOUND)
                
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'])
    def remove_vessel(self, request, pk=None):
        """Remove a vessel from a fleet"""
        try:
            fleet = self.get_object()
            mmsi = request.data.get('mmsi')
            
            if not mmsi:
                return Response({"error": "MMSI is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                vessel = Vessel.objects.get(mmsi=mmsi)
                if vessel in fleet.vessels.all():
                    fleet.vessels.remove(vessel)
                    return Response({"message": f"Vessel {vessel.name} removed from fleet {fleet.name}"}, status=status.HTTP_200_OK)
                else:
                    return Response({"error": f"Vessel {vessel.name} is not in fleet {fleet.name}"}, status=status.HTTP_400_BAD_REQUEST)
            except Vessel.DoesNotExist:
                return Response({"error": f"No vessel found with MMSI {mmsi}"}, status=status.HTTP_404_NOT_FOUND)
                
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
