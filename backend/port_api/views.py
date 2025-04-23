from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Port
from .serializers import PortSerializer
import requests
import json
import os
from django.conf import settings

class PortViewSet(viewsets.ModelViewSet):
    queryset = Port.objects.all()
    serializer_class = PortSerializer
    
    @action(detail=False, methods=['post'])
    def import_ports(self, request):
        """Import ports data from a JSON file or API"""
        try:
            # Load sample port data (in a real project, you would fetch from an API or load from a file)
            sample_ports = [
                {"name": "Rotterdam", "country": "Netherlands", "latitude": 51.9225, "longitude": 4.47917, 
                 "size": "Large", "un_locode": "NLRTM"},
                {"name": "Singapore", "country": "Singapore", "latitude": 1.29027, "longitude": 103.851, 
                 "size": "Large", "un_locode": "SGSIN"},
                {"name": "Shanghai", "country": "China", "latitude": 31.2304, "longitude": 121.474, 
                 "size": "Large", "un_locode": "CNSHA"},
                {"name": "Antwerp", "country": "Belgium", "latitude": 51.2194, "longitude": 4.40026, 
                 "size": "Large", "un_locode": "BEANR"},
                {"name": "New York", "country": "United States", "latitude": 40.7128, "longitude": -74.006, 
                 "size": "Large", "un_locode": "USNYC"}
            ]
            
            # Process each port
            created_count = 0
            for port_data in sample_ports:
                _, created = Port.objects.get_or_create(
                    name=port_data['name'],
                    country=port_data['country'],
                    defaults={
                        'latitude': port_data['latitude'],
                        'longitude': port_data['longitude'],
                        'size': port_data.get('size', ''),
                        'un_locode': port_data.get('un_locode', ''),
                        'image_url': port_data.get('image_url', '')
                    }
                )
                if created:
                    created_count += 1
            
            return Response({"message": f"Successfully imported {created_count} ports"}, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search ports by name or country"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({"error": "Query parameter 'q' is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        ports = Port.objects.filter(name__icontains=query) | Port.objects.filter(country__icontains=query)
        serializer = self.get_serializer(ports, many=True)
        return Response(serializer.data)