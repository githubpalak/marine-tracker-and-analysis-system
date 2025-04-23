from django.contrib import admin
from .models import Vessel, VesselPosition

class VesselPositionInline(admin.TabularInline):
    model = VesselPosition
    extra = 0
    readonly_fields = ('timestamp',)
    fields = ('latitude', 'longitude', 'heading', 'speed', 'status', 'timestamp')
    ordering = ('-timestamp',)

@admin.register(Vessel)
class VesselAdmin(admin.ModelAdmin):
    list_display = ('name', 'mmsi', 'vessel_type', 'flag', 'last_position_info')
    list_filter = ('vessel_type', 'flag')
    search_fields = ('name', 'mmsi')
    inlines = [VesselPositionInline]
    
    def last_position_info(self, obj):
        if obj.last_position:
            return f"{obj.last_position.timestamp} - ({obj.last_position.latitude}, {obj.last_position.longitude})"
        return "No position data"
    last_position_info.short_description = 'Last Position'

@admin.register(VesselPosition)
class VesselPositionAdmin(admin.ModelAdmin):
    list_display = ('vessel', 'timestamp', 'latitude', 'longitude', 'speed', 'heading')
    list_filter = ('status', 'vessel__vessel_type')
    search_fields = ('vessel__name', 'vessel__mmsi')
    readonly_fields = ('timestamp',)
    ordering = ('-timestamp',)