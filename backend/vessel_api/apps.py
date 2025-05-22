from django.apps import AppConfig


class VesselApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'vessel_api'

    def ready(self):
        from .models import PositionOffset

        PositionOffset.objects.update_or_create(
            pk=1,
            defaults={
                'name': 'position_offset',
                'value': 1.0
            }
        )