from django.db import models

class Port(models.Model):
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    size = models.CharField(max_length=50, blank=True, null=True)
    un_locode = models.CharField(max_length=20, blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.name}, {self.country}"