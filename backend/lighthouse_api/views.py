# from rest_framework import viewsets
# from rest_framework.response import Response
# from rest_framework.decorators import action
# from rest_framework import status
# from .models import Lighthouse
# from .serializers import LighthouseSerializer

# class LighthouseViewSet(viewsets.ModelViewSet):
#     queryset = Lighthouse.objects.all()
#     serializer_class = LighthouseSerializer
    
#     @action(detail=False, methods=['post'])
#     def import_lighthouses(self, request):
#         """Import lighthouse data from a JSON file or API"""
#         try:
#             # Load sample lighthouse data (in a real project, you would fetch from an API or load from a file)
#             sample_lighthouses = [
#                 {"name": "Cape Hatteras Lighthouse", "country": "United States", "latitude": 35.2515, "longitude": -75.5283, 
#                  "height": 210, "year_built": 1870},
#                 {"name": "Lighthouse of Alexandria", "country": "Egypt", "latitude": 31.2139, "longitude": 29.8856, 
#                  "height": 137, "year_built": -280},
#                 {"name": "Tower of Hercules", "country": "Spain", "latitude": 43.3855, "longitude": -8.4063, 
#                  "height": 180, "year_built": 100},
#                 {"name": "Kõpu Lighthouse", "country": "Estonia", "latitude": 58.9156, "longitude": 22.1997, 
#                  "height": 102, "year_built": 1531},
#                 {"name": "Hook Lighthouse", "country": "Ireland", "latitude": 52.1257, "longitude": -6.9292, 
#                  "height": 115, "year_built": 1172}
#             ]
            
#             # Process each lighthouse
#             created_count = 0
#             for lighthouse_data in sample_lighthouses:
#                 _, created = Lighthouse.objects.get_or_create(
#                     name=lighthouse_data['name'],
#                     country=lighthouse_data['country'],
#                     defaults={
#                         'latitude': lighthouse_data['latitude'],
#                         'longitude': lighthouse_data['longitude'],
#                         'height': lighthouse_data.get('height', None),
#                         'year_built': lighthouse_data.get('year_built', None),
#                         'image_url': lighthouse_data.get('image_url', '')
#                     }
#                 )
#                 if created:
#                     created_count += 1
            
#             return Response({"message": f"Successfully imported {created_count} lighthouses"}, status=status.HTTP_201_CREATED)
            
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
#     @action(detail=False, methods=['get'])
#     def search(self, request):
#         """Search lighthouses by name or country"""
#         query = request.query_params.get('q', '')
#         if not query:
#             return Response({"error": "Query parameter 'q' is required"}, status=status.HTTP_400_BAD_REQUEST)
        
#         lighthouses = Lighthouse.objects.filter(name__icontains=query) | Lighthouse.objects.filter(country__icontains=query)
#         serializer = self.get_serializer(lighthouses, many=True)
#         return Response(serializer.data)

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from .models import Lighthouse
from .serializers import LighthouseSerializer

class LighthouseViewSet(viewsets.ModelViewSet):
    queryset = Lighthouse.objects.all()
    serializer_class = LighthouseSerializer
    
    @action(detail=False, methods=['get'])
    def dummy_data(self, request):
        """Create dummy data if not already in the database."""
        if not Lighthouse.objects.exists():  # Check if data already exists
            sample_lighthouses = [
                {"name": "Cape Hatteras Lighthouse", "country": "United States", "latitude": 35.2515, "longitude": -75.5283, 
                 "height": 210, "year_built": 1870},
                {"name": "Lighthouse of Alexandria", "country": "Egypt", "latitude": 31.2139, "longitude": 29.8856, 
                 "height": 137, "year_built": -280},
                {"name": "Tower of Hercules", "country": "Spain", "latitude": 43.3855, "longitude": -8.4063, 
                 "height": 180, "year_built": 100},
                {"name": "Kõpu Lighthouse", "country": "Estonia", "latitude": 58.9156, "longitude": 22.1997, 
                 "height": 102, "year_built": 1531},
                {"name": "Hook Lighthouse", "country": "Ireland", "latitude": 52.1257, "longitude": -6.9292, 
                 "height": 115, "year_built": 1172}
            ]
            
            # Create sample lighthouse data
            created_count = 0
            for lighthouse_data in sample_lighthouses:
                _, created = Lighthouse.objects.get_or_create(
                    name=lighthouse_data['name'],
                    country=lighthouse_data['country'],
                    defaults={
                        'latitude': lighthouse_data['latitude'],
                        'longitude': lighthouse_data['longitude'],
                        'height': lighthouse_data.get('height', None),
                        'year_built': lighthouse_data.get('year_built', None),
                        'image_url': lighthouse_data.get('image_url', '')
                    }
                )
                if created:
                    created_count += 1
            
            return Response({"message": f"Successfully imported {created_count} lighthouses"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "Lighthouse data already exists."}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search lighthouses by name or country"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({"error": "Query parameter 'q' is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        lighthouses = Lighthouse.objects.filter(name__icontains=query) | Lighthouse.objects.filter(country__icontains=query)
        serializer = self.get_serializer(lighthouses, many=True)
        return Response(serializer.data)
