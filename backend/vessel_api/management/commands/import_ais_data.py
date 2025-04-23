# vessel_api/management/commands/import_ais_data.py
import json
import os

from django.core.management.base import BaseCommand
from django.conf import settings
from vessel_api.models import Vessel, VesselPosition

class Command(BaseCommand):
    help = 'Import AIS data from a local JSON file'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            help='data\ais_data.json',
            default=os.path.join(settings.BASE_DIR, 'data', 'ais_data.json')
        )

    def handle(self, *args, **options):
        file_path = options['file']
        self.stdout.write(f'Loading AIS data from {file_path}…')

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                ais_entries = json.load(f)
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Failed to read JSON file: {e}'))
            return

        count = 0
        for entry in ais_entries:
            # Compute length & width if fields A/B/C/D exist, else default
            try:
                length = int(entry.get('A', 0)) + int(entry.get('B', 0))
                width  = int(entry.get('C', 0)) + int(entry.get('D', 0))
            except (TypeError, ValueError):
                length = width = 0

            vessel, created = Vessel.objects.get_or_create(
                mmsi=entry.get('MMSI', 'unknown'),
                defaults={
                    'name': entry.get('NAME', 'Unknown'),
                    'vessel_type': entry.get('TYPE', ''),
                    'flag': entry.get('FLAG', ''),
                    'length': length,
                    'width': width,
                    'image_url': entry.get('IMAGE_URL', ''),
                }
            )

            # Always add a new position if lat/lon exist
            lat = entry.get('LATITUDE')
            lon = entry.get('LONGITUDE')
            if lat is not None and lon is not None:
                VesselPosition.objects.create(
                    vessel=vessel,
                    latitude=float(lat),
                    longitude=float(lon),
                    heading=int(entry.get('HEADING', 0)),
                    speed=float(entry.get('SOG', 0)),
                    status=str(entry.get('NAVSTAT', '')),
                )

            count += 1

        self.stdout.write(self.style.SUCCESS(f'Imported {count} AIS entries.'))
