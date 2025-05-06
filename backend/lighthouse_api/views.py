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

# import csv
# import os
# import logging
# from rest_framework import viewsets, status
# from rest_framework.response import Response
# from rest_framework.decorators import action
# from django.conf import settings
# from .models import Lighthouse, DummyLighthouse
# from .serializers import LighthouseSerializer, LighthouseCsvSerializer

# logger = logging.getLogger(__name__)

# class LighthouseViewSet(viewsets.ReadOnlyModelViewSet):
#     """
#     API endpoint for accessing lighthouse data from CSV file
#     """
#     queryset = DummyLighthouse.objects.none()  # Just to satisfy DRF
#     serializer_class = LighthouseCsvSerializer

#     def list(self, request):
#         """
#         Return a list of all lighthouses from the CSV file
#         """
#         csv_file_path = os.path.join(settings.BASE_DIR, 'data', 'lighthouses.csv')
#         lighthouses = []

#         try:
#             with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
#                 reader = csv.DictReader(csvfile)
#                 for row in reader:
#                     try:
#                         lighthouse = {
#                             "id": int(row.get("id", 0)),
#                             "name": row.get("name", ""),
#                             "latitude": float(row.get("latitude", 0.0)),
#                             "longitude": float(row.get("longitude", 0.0)),
#                             "website": row.get("website", "")
#                         }
#                         lighthouses.append(lighthouse)
#                     except (ValueError, TypeError) as e:
#                         logger.warning(f"Error processing row: {row}, Error: {str(e)}")
#                         continue
#         except FileNotFoundError:
#             return Response({'error': 'CSV file not found'}, status=404)
#         except Exception as e:
#             logger.error(f"Error reading CSV file: {str(e)}")
#             return Response({'error': f'Error reading CSV file: {str(e)}'}, status=500)

#         serializer = self.get_serializer(lighthouses, many=True)
#         return Response(serializer.data)

#     def retrieve(self, request, pk=None):
#         """
#         Return a specific lighthouse by id
#         """
#         csv_file_path = os.path.join(settings.BASE_DIR, 'data', 'lighthouses.csv')
#         lighthouse = None

#         try:
#             with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
#                 reader = csv.DictReader(csvfile)
#                 for row in reader:
#                     try:
#                         if str(row.get("id", "")) == str(pk):
#                             lighthouse = {
#                                 "id": int(row.get("id", 0)),
#                                 "name": row.get("name", ""),
#                                 "latitude": float(row.get("latitude", 0.0)),
#                                 "longitude": float(row.get("longitude", 0.0)),
#                                 "website": row.get("website", "")
#                             }
#                             break
#                     except (ValueError, TypeError) as e:
#                         logger.warning(f"Error processing row: {row}, Error: {str(e)}")
#                         continue
#         except FileNotFoundError:
#             return Response({'error': 'CSV file not found'}, status=404)
#         except Exception as e:
#             logger.error(f"Error reading CSV file: {str(e)}")
#             return Response({'error': f'Error reading CSV file: {str(e)}'}, status=500)

#         if lighthouse is None:
#             return Response({'error': 'Lighthouse not found'}, status=404)

#         serializer = self.get_serializer(lighthouse)
#         return Response(serializer.data)

#     @action(detail=False, methods=['get'])
#     def search(self, request):
#         """
#         Search lighthouses by name
#         """
#         query = request.query_params.get('q', '')
#         if not query:
#             return Response({"error": "Query parameter 'q' is required"}, status=status.HTTP_400_BAD_REQUEST)
        
#         csv_file_path = os.path.join(settings.BASE_DIR, 'data', 'lighthouses.csv')
#         matching_lighthouses = []

#         try:
#             with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
#                 reader = csv.DictReader(csvfile)
#                 for row in reader:
#                     try:
#                         name = row.get("name", "").lower()
#                         if query.lower() in name:
#                             lighthouse = {
#                                 "id": int(row.get("id", 0)),
#                                 "name": row.get("name", ""),
#                                 "latitude": float(row.get("latitude", 0.0)),
#                                 "longitude": float(row.get("longitude", 0.0)),
#                                 "website": row.get("website", "")
#                             }
#                             matching_lighthouses.append(lighthouse)
#                     except (ValueError, TypeError) as e:
#                         logger.warning(f"Error processing row: {row}, Error: {str(e)}")
#                         continue
#         except FileNotFoundError:
#             return Response({'error': 'CSV file not found'}, status=404)
#         except Exception as e:
#             logger.error(f"Error reading CSV file: {str(e)}")
#             return Response({'error': f'Error reading CSV file: {str(e)}'}, status=500)

#         serializer = self.get_serializer(matching_lighthouses, many=True)
#         return Response(serializer.data)

import csv
import os
import logging
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from django.conf import settings
from .models import DummyLighthouse
from .serializers import LighthouseCsvSerializer

logger = logging.getLogger(__name__)

class LighthouseViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for accessing lighthouse data from CSV file
    """
    queryset = DummyLighthouse.objects.none()  # Just to satisfy DRF
    serializer_class = LighthouseCsvSerializer

    def _get_paginated_data(self, data):
        """
        Handle pagination using REST framework's built-in pagination.
        """
        page = self.paginate_queryset(data)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(data, many=True)
        return Response(serializer.data)

    def _read_csv_data(self):
        """
        Read lighthouse data from CSV file.
        """
        csv_file_path = os.path.join(settings.BASE_DIR, 'data', 'lighthouses.csv')
        lighthouses = []

        try:
            with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    try:
                        lighthouse = {
                            "id": int(row.get("id", 0)),
                            "name": row.get("name", ""),
                            "latitude": float(row.get("latitude", 0.0)),
                            "longitude": float(row.get("longitude", 0.0)),
                            "website": row.get("website", "")
                        }
                        lighthouses.append(lighthouse)
                    except (ValueError, TypeError) as e:
                        logger.warning(f"Error processing row: {row}, Error: {str(e)}")
                        continue
        except FileNotFoundError:
            logger.error("CSV file not found: lighthouses.csv")
            return []
        except Exception as e:
            logger.error(f"Error reading CSV file: {str(e)}")
            return []
            
        return lighthouses

    def list(self, request):
        """
        Return a list of all lighthouses from the CSV file
        """
        lighthouses = self._read_csv_data()
        
        if not lighthouses:
            return Response({'error': 'Failed to read lighthouse data'}, status=500)
            
        return self._get_paginated_data(lighthouses)

    def retrieve(self, request, pk=None):
        """
        Return a specific lighthouse by id
        """
        lighthouses = self._read_csv_data()
        
        if not lighthouses:
            return Response({'error': 'Failed to read lighthouse data'}, status=500)
            
        # Find the lighthouse with the matching ID
        lighthouse = next((l for l in lighthouses if str(l["id"]) == str(pk)), None)
        
        if lighthouse is None:
            return Response({'error': 'Lighthouse not found'}, status=404)

        serializer = self.get_serializer(lighthouse)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Search lighthouses by name
        """
        query = request.query_params.get('q', '')
        if not query:
            return Response({"error": "Query parameter 'q' is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        lighthouses = self._read_csv_data()
        
        if not lighthouses:
            return Response({'error': 'Failed to read lighthouse data'}, status=500)
            
        # Filter lighthouses based on name
        matching_lighthouses = [
            lighthouse for lighthouse in lighthouses 
            if query.lower() in lighthouse["name"].lower()
        ]
        
        return self._get_paginated_data(matching_lighthouses)