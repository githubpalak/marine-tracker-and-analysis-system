from django.contrib import admin
from .models import Vessel, VesselPosition

@admin.register(Vessel)
class VesselAdmin(admin.ModelAdmin):
    list_display = ('name', 'mmsi', 'vessel_type', 'flag')
    search_fields = ('name', 'mmsi')

@admin.register(VesselPosition)
class VesselPositionAdmin(admin.ModelAdmin):
    list_display = ('vessel', 'latitude', 'longitude', 'timestamp')
    list_filter = ('timestamp',)