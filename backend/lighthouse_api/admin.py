# from django.contrib import admin
# from .models import Lighthouse

# @admin.register(Lighthouse)
# class LighthouseAdmin(admin.ModelAdmin):
#     list_display = ('name', 'country', 'height', 'year_built')
#     search_fields = ('name', 'country')

# from django.contrib import admin
# from .models import Lighthouse, DummyLighthouse

# @admin.register(Lighthouse)
# class LighthouseAdmin(admin.ModelAdmin):
#     list_display = ('name', 'country', 'height', 'year_built')
#     search_fields = ('name', 'country')

# @admin.register(DummyLighthouse)
# class DummyLighthouseAdmin(admin.ModelAdmin):
#     list_display = ['id']  # No fields to display, just dummy

from django.contrib import admin
from .models import Lighthouse, DummyLighthouse

@admin.register(Lighthouse)
class LighthouseAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'height', 'year_built')
    search_fields = ('name', 'country')

@admin.register(DummyLighthouse)
class DummyLighthouseAdmin(admin.ModelAdmin):
    list_display = ['id']  # No fields to display, just dummy