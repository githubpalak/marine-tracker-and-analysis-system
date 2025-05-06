# # vessel_api/management/commands/import_ais_data.py
# import json
# import os

# from django.core.management.base import BaseCommand
# from django.conf import settings
# from vessel_api.models import Vessel, VesselPosition

# class Command(BaseCommand):
#     help = 'Import AIS data from a local JSON file'

#     def add_arguments(self, parser):
#         parser.add_argument(
#             '--file',
#             type=str,
#             help='data\ais_data.json',
#             default=os.path.join(settings.BASE_DIR, 'data', 'ais_data.json')
#         )

#     def handle(self, *args, **options):
#         file_path = options['file']
#         self.stdout.write(f'Loading AIS data from {file_path}…')

#         try:
#             with open(file_path, 'r', encoding='utf-8') as f:
#                 ais_entries = json.load(f)
#         except Exception as e:
#             self.stderr.write(self.style.ERROR(f'Failed to read JSON file: {e}'))
#             return

#         count = 0
#         for entry in ais_entries:
#             # Compute length & width if fields A/B/C/D exist, else default
#             try:
#                 length = int(entry.get('A', 0)) + int(entry.get('B', 0))
#                 width  = int(entry.get('C', 0)) + int(entry.get('D', 0))
#             except (TypeError, ValueError):
#                 length = width = 0

#             vessel, created = Vessel.objects.get_or_create(
#                 mmsi=entry.get('MMSI', 'unknown'),
#                 defaults={
#                     'name': entry.get('NAME', 'Unknown'),
#                     'vessel_type': entry.get('TYPE', ''),
#                     'flag': entry.get('FLAG', ''),
#                     'length': length,
#                     'width': width,
#                     'image_url': entry.get('IMAGE_URL', ''),
#                 }
#             )

#             # Always add a new position if lat/lon exist
#             lat = entry.get('LATITUDE')
#             lon = entry.get('LONGITUDE')
#             if lat is not None and lon is not None:
#                 VesselPosition.objects.create(
#                     vessel=vessel,
#                     latitude=float(lat),
#                     longitude=float(lon),
#                     heading=int(entry.get('HEADING', 0)),
#                     speed=float(entry.get('SOG', 0)),
#                     status=str(entry.get('NAVSTAT', '')),
#                 )

#             count += 1

#         self.stdout.write(self.style.SUCCESS(f'Imported {count} AIS entries.'))


import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from django.db import transaction
from vessel_api.models import Vessel, VesselPosition

class Command(BaseCommand):
    help = 'Import AIS data from a local JSON file with optimized batch processing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            help='Path to AIS data JSON file',
            default=os.path.join(settings.BASE_DIR, 'data', 'ais_data.json')
        )
        parser.add_argument(
            '--batch-size',
            type=int,
            help='Number of records to process in each batch',
            default=1000
        )

    def handle(self, *args, **options):
        file_path = options['file']
        batch_size = options['batch_size']
        self.stdout.write(f'Loading AIS data from {file_path} in batches of {batch_size}…')

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                ais_entries = json.load(f)
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Failed to read JSON file: {e}'))
            return

        total_count = len(ais_entries)
        self.stdout.write(f'Found {total_count} entries to process')
        
        vessel_cache = {}  # Cache vessel objects to reduce DB lookups
        count = 0
        vessel_batch = []
        position_batch = []
        
        # Process in batches
        for i, entry in enumerate(ais_entries):
            # Compute length & width if fields A/B/C/D exist, else default
            try:
                length = int(entry.get('A', 0)) + int(entry.get('B', 0))
                width = int(entry.get('C', 0)) + int(entry.get('D', 0))
            except (TypeError, ValueError):
                length = width = 0
            
            mmsi = entry.get('MMSI', 'unknown')
            
            # Check cache first
            if mmsi not in vessel_cache:
                # Create vessel object (not saved yet)
                vessel = Vessel(
                    mmsi=mmsi,
                    name=entry.get('NAME', 'Unknown'),
                    vessel_type=entry.get('TYPE', ''),
                    flag=entry.get('FLAG', ''),
                    length=length,
                    width=width,
                    image_url=entry.get('IMAGE_URL', ''),
                )
                vessel_batch.append(vessel)
                vessel_cache[mmsi] = vessel
            else:
                vessel = vessel_cache[mmsi]
            
            # Add position if lat/lon exist
            lat = entry.get('LATITUDE')
            lon = entry.get('LONGITUDE')
            if lat is not None and lon is not None:
                position = VesselPosition(
                    # Will be set after vessel batch is saved
                    vessel_id=None,
                    latitude=float(lat),
                    longitude=float(lon),
                    heading=int(entry.get('HEADING', 0)),
                    speed=float(entry.get('SOG', 0)),
                    status=str(entry.get('NAVSTAT', '')),
                )
                position_batch.append((mmsi, position))
            
            count += 1
            
            # Process batch when batch size is reached or at the end
            if len(vessel_batch) >= batch_size or i == len(ais_entries) - 1:
                with transaction.atomic():
                    # Use bulk_create with update_conflicts option
                    self.process_batch(vessel_batch, position_batch, vessel_cache)
                    
                    # Clear batches
                    vessel_batch = []
                    position_batch = []
                
                # Report progress
                self.stdout.write(f'Processed {count}/{total_count} entries')
        
        self.stdout.write(self.style.SUCCESS(f'Imported {count} AIS entries.'))
    
    def process_batch(self, vessel_batch, position_batch, vessel_cache):
        # Try to bulk create vessels, but ignore conflicts (for existing vessels)
        if vessel_batch:
            # First get existing vessels to avoid conflicts
            existing_mmsis = list(Vessel.objects.filter(
                mmsi__in=[v.mmsi for v in vessel_batch]
            ).values_list('mmsi', flat=True))
            
            # Filter to only new vessels
            new_vessels = [v for v in vessel_batch if v.mmsi not in existing_mmsis]
            
            # Create new vessels
            if new_vessels:
                Vessel.objects.bulk_create(new_vessels)
            
            # Update vessel cache with database records
            db_vessels = {v.mmsi: v for v in Vessel.objects.filter(
                mmsi__in=[v.mmsi for v in vessel_batch]
            )}
            vessel_cache.update(db_vessels)
        
        # Create positions with correct vessel IDs
        positions_to_create = []
        for mmsi, position in position_batch:
            if mmsi in vessel_cache:
                position.vessel = vessel_cache[mmsi]
                positions_to_create.append(position)
        
        if positions_to_create:
            VesselPosition.objects.bulk_create(positions_to_create)