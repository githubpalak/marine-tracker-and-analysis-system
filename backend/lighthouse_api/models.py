# from django.db import models

# class Lighthouse(models.Model):
#     name = models.CharField(max_length=100)
#     country = models.CharField(max_length=100)
#     latitude = models.FloatField()
#     longitude = models.FloatField()
#     height = models.FloatField(blank=True, null=True)
#     year_built = models.IntegerField(blank=True, null=True)
#     image_url = models.URLField(blank=True, null=True)
    
#     def __str__(self):
#         return f"{self.name}, {self.country}"

# from django.db import models

# class Lighthouse(models.Model):
    
#     name = models.CharField(max_length=100)
#     country = models.CharField(max_length=100)
#     latitude = models.FloatField()
#     longitude = models.FloatField()
#     height = models.FloatField(blank=True, null=True)
#     year_built = models.IntegerField(blank=True, null=True)
#     image_url = models.URLField(blank=True, null=True)
    
#     def __str__(self):
#         return f"{self.name}, {self.country}"

# class DummyLighthouse(models.Model):
#     """
#     Dummy model for when we're reading from CSV instead of database.
#     No database table will be created for this model.
#     """
#     class Meta:
#         managed = False
#         app_label = 'lighthouse_api'

from django.db import models

class Lighthouse(models.Model):
    """
    Model for lighthouse data. 
    This is kept as a reference but actual data will be read from CSV.
    """
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    height = models.FloatField(blank=True, null=True)
    year_built = models.IntegerField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.name}, {self.country}"

class DummyLighthouse(models.Model):
    """
    Dummy model for when we're reading from CSV instead of database.
    No database table will be created for this model.
    """
    class Meta:
        managed = False
        app_label = 'lighthouse_api'