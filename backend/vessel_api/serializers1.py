# from rest_framework import serializers
# from .models import Vessel, VesselPosition

# class VesselPositionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = VesselPosition
#         fields = ['id', 'latitude', 'longitude', 'heading', 'speed', 'status', 'timestamp']

# class VesselSerializer(serializers.ModelSerializer):
#     last_position = serializers.SerializerMethodField()
    
#     class Meta:
#         model = Vessel
#         fields = ['id', 'mmsi', 'name', 'vessel_type', 'flag', 'length', 'width', 'image_url', 'last_position']
        
#     def get_last_position(self, obj):
#         last_pos = obj.positions.first()
#         if last_pos:
#             serialized = VesselPositionSerializer(last_pos).data
#             # print("Serialized Last Position:", serialized)
#             return VesselPositionSerializer(last_pos).data
#         return None

# class VesselDetailSerializer(serializers.ModelSerializer):
#     positions = VesselPositionSerializer(many=True, read_only=True)
    
#     class Meta:
#         model = Vessel
#         fields = ['id', 'mmsi', 'name', 'vessel_type', 'flag', 'length', 'width', 'image_url', 'positions']



from rest_framework import serializers
from .models import Vessel, VesselPosition, PositionOffset
import math

# def move_position(lat, lon, heading_deg, distance_nm):
#     """Move position from (lat, lon) by heading and distance (in NM)."""
#     R = 6371.0  # Earth radius in km
#     distance_km = distance_nm * 1.852

#     lat_rad = math.radians(lat)
#     lon_rad = math.radians(lon)
#     heading_rad = math.radians(heading_deg)

#     new_lat_rad = math.asin(
#         math.sin(lat_rad) * math.cos(distance_km / R) +
#         math.cos(lat_rad) * math.sin(distance_km / R) * math.cos(heading_rad)
#     )

#     new_lon_rad = lon_rad + math.atan2(
#         math.sin(heading_rad) * math.sin(distance_km / R) * math.cos(lat_rad),
#         math.cos(distance_km / R) - math.sin(lat_rad) * math.sin(new_lat_rad)
#     )

#     return math.degrees(new_lat_rad), math.degrees(new_lon_rad)


def move_position(lat, lon, heading_deg, distance_nm):
    """Move position by heading and distance (in NM), updating only longitude."""
    R = 6371.0  # Earth radius in km
    distance_km = distance_nm * 1.852

    # Convert to radians
    lon_rad = math.radians(lon)
    heading_rad = math.radians(heading_deg)

    # Calculate change in longitude only
    # Approximate latitude circle radius at given latitude
    radius_at_lat = R * math.cos(math.radians(lat))
    delta_lon_rad = (distance_km / radius_at_lat) * math.cos(heading_rad)

    new_lon_rad = lon_rad + delta_lon_rad

    # Keep latitude unchanged
    new_lat = lat
    new_lon = math.degrees(new_lon_rad)

    # Normalize longitude to be between -180 and 180
    if new_lon > 180:
        new_lon -= 360
    elif new_lon < -180:
        new_lon += 360

    return new_lat, new_lon



class VesselPositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VesselPosition
        fields = ['id', 'latitude', 'longitude', 'heading', 'speed', 'status', 'timestamp']


class VesselSerializer(serializers.ModelSerializer):
    last_position = serializers.SerializerMethodField()

    class Meta:
        model = Vessel
        fields = ['id', 'mmsi', 'name', 'vessel_type', 'flag', 'length', 'width', 'image_url', 'last_position']

    def get_last_position(self, obj):
        last_pos = obj.positions.first()
        if last_pos:
            data = VesselPositionSerializer(last_pos).data

            try:
                offset_multiplier = PositionOffset.get_solo()
            except Exception:
                offset_multiplier = 1.0

            if last_pos.heading is not None and offset_multiplier:
                distance_nm = 0.5 * offset_multiplier.value
                lat, lon = move_position(last_pos.latitude, last_pos.longitude, last_pos.heading, distance_nm)
                data['latitude'] = lat
                data['longitude'] = lon

                # Increment offset by 1 and save
                offset_multiplier.value += 1
                offset_multiplier.save()

            return data
        return None


class VesselDetailSerializer(serializers.ModelSerializer):
    positions = VesselPositionSerializer(many=True, read_only=True)

    class Meta:
        model = Vessel
        fields = ['id', 'mmsi', 'name', 'vessel_type', 'flag', 'length', 'width', 'image_url', 'positions']