import requests
import logging
from django.core.management.base import BaseCommand
from django.conf import settings
from vessel_api.models import Vessel, VesselPosition

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Fetch initial vessel data from Global Fishing Watch API'
    
    def handle(self, *args, **kwargs):
        try:
            self.stdout.write(self.style.SUCCESS('Fetching vessel data...'))
            
            # Build API URL for GFW API
            url = "https://gateway.api.globalfishingwatch.org/v1/vessels"
            
            # Set headers with token
            headers = {
                "Authorization": f"Bearer {settings.GFW_API_TOKEN}"
            }
            
            # Set parameters
            params = {
                "datasets": "public-global-fishing-vessels:latest",
                "limit": 100,
                "offset": 0,
                "include-position": True
            }
            
            # Make request
            response = requests.get(url, headers=headers, params=params)
            
            if response.status_code == 200:
                vessels_data = response.json()
                self.stdout.write(self.style.SUCCESS(f'Retrieved {len(vessels_data.get("entries", []))} vessels'))
                
                # Process each vessel
                for vessel_data in vessels_data.get('entries', []):
                    # Get or create vessel
                    vessel, created = Vessel.objects.get_or_create(
                        mmsi=vessel_data.get('mmsi', 'unknown'),
                        defaults={
                            'name': vessel_data.get('name', 'Unknown Vessel'),
                            'vessel_type': vessel_data.get('vesselType', ''),
                            'flag': vessel_data.get('flag', ''),
                            'length': vessel_data.get('length', 0),
                            'width': vessel_data.get('width', 0),
                            'image_url': vessel_data.get('imageUrl', '')
                        }
                    )
                    
                    # Output status
                    if created:
                        self.stdout.write(f'Created vessel: {vessel.name} ({vessel.mmsi})')
                    else:
                        self.stdout.write(f'Updated vessel: {vessel.name} ({vessel.mmsi})')
                    
                    # Update position
                    if 'position' in vessel_data and vessel_data['position']:
                        position_data = vessel_data['position']
                        VesselPosition.objects.create(
                            vessel=vessel,
                            latitude=position_data.get('lat', 0),
                            longitude=position_data.get('lon', 0),
                            heading=position_data.get('heading', 0),
                            speed=position_data.get('speed', 0),
                            status=position_data.get('status', '')
                        )
                        self.stdout.write(f'  - Added position: ({position_data.get("lat", 0)}, {position_data.get("lon", 0)})')
                
                self.stdout.write(self.style.SUCCESS('Vessel data import completed successfully'))
            else:
                self.stdout.write(self.style.ERROR(f'Failed to fetch vessel data: {response.text}'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error fetching vessel data: {str(e)}'))
