import requests
import logging
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.conf import settings
from .models import Vessel, VesselPosition
from .serializers1 import VesselSerializer, VesselDetailSerializer

logger = logging.getLogger(__name__)

class VesselViewSet(viewsets.ModelViewSet):
    queryset = Vessel.objects.all()
    serializer_class = VesselSerializer
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return VesselDetailSerializer
        return VesselSerializer
    
    # @action(detail=False, methods=['get'])
    # def fetch_live_data(self, request):
    #     """Fetch live vessel data from Global Fishing Watch API"""
    #     try:
    #         # Get parameters from request
    #         lat_min = request.query_params.get('lat_min', '0')
    #         lat_max = request.query_params.get('lat_max', '90')
    #         lon_min = request.query_params.get('lon_min', '-180')
    #         lon_max = request.query_params.get('lon_max', '180')
            
    #         # Build API URL for GFW API
    #         url = "https://gateway.api.globalfishingwatch.org/v1/vessels"
            
    #         # Set headers with token
    #         headers = {
    #             "Authorization": f"Bearer {settings.GFW_API_TOKEN}"
    #         }
            
    #         # Set parameters
    #         params = {
    #             "datasets": "public-global-fishing-vessels:latest",
    #             "limit": 100,
    #             "offset": 0,
    #             "include-position": True,
    #             "latitude-min": lat_min,
    #             "latitude-max": lat_max,
    #             "longitude-min": lon_min,
    #             "longitude-max": lon_max
    #         }
            
    #         # Make request
    #         response = requests.get(url, headers=headers, params=params)
            
    #         if response.status_code == 200:
    #             vessels_data = response.json()
                
    #             # Process each vessel
    #             for vessel_data in vessels_data.get('entries', []):
    #                 # Get or create vessel
    #                 vessel, created = Vessel.objects.get_or_create(
    #                     mmsi=vessel_data.get('mmsi', 'unknown'),
    #                     defaults={
    #                         'name': vessel_data.get('name', 'Unknown Vessel'),
    #                         'vessel_type': vessel_data.get('vesselType', ''),
    #                         'flag': vessel_data.get('flag', ''),
    #                         'length': vessel_data.get('length', 0),
    #                         'width': vessel_data.get('width', 0),
    #                         'image_url': vessel_data.get('imageUrl', '')
    #                     }
    #                 )
                    
    #                 # Update position
    #                 if 'position' in vessel_data and vessel_data['position']:
    #                     position_data = vessel_data['position']
    #                     VesselPosition.objects.create(
    #                         vessel=vessel,
    #                         latitude=position_data.get('lat', 0),
    #                         longitude=position_data.get('lon', 0),
    #                         heading=position_data.get('heading', 0),
    #                         speed=position_data.get('speed', 0),
    #                         status=position_data.get('status', '')
    #                     )
                
    #             return Response({"message": "Vessel data successfully updated"}, status=status.HTTP_200_OK)
    #         else:
    #             logger.error(f"Failed to fetch vessel data: {response.text}")
    #             return Response({"error": "Failed to fetch vessel data"}, status=status.HTTP_400_BAD_REQUEST)
                
    #     except Exception as e:
    #         logger.exception(f"Error fetching vessel data: {str(e)}")
    #         return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # @action(detail=False, methods=['get'])
    # def search(self, request):
        """Search vessels by name or MMSI"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({"error": "Query parameter 'q' is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        vessels = Vessel.objects.filter(name__icontains=query) | Vessel.objects.filter(mmsi__icontains=query)
        serializer = self.get_serializer(vessels, many=True)
        return Response(serializer.data)