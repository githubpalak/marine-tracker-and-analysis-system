from django.db import models

class Vessel(models.Model):
    id = models.AutoField(primary_key=True)
    mmsi = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    vessel_type = models.CharField(max_length=100, blank=True, null=True)
    flag = models.CharField(max_length=50, blank=True, null=True)
    length = models.FloatField(blank=True, null=True)
    width = models.FloatField(blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    
    @property
    def last_position(self):
        return self.positions.first()
    
    def __str__(self):
        return f"{self.name} ({self.mmsi})"

class VesselPosition(models.Model):
    id = models.AutoField(primary_key=True)
    vessel = models.ForeignKey(Vessel, on_delete=models.CASCADE, related_name='positions')
    latitude = models.FloatField()
    longitude = models.FloatField()
    heading = models.FloatField(blank=True, null=True)
    speed = models.FloatField(blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
        get_latest_by = 'timestamp'
    
    def __str__(self):
        return f"{self.vessel.name} @ ({self.latitude}, {self.longitude}) on {self.timestamp}"
    

class PositionOffset(models.Model):
    name = models.CharField(max_length=100, default="position_offset")
    value = models.FloatField(default=0.0)

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def get_solo(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj