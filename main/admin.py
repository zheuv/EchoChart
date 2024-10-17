from django.contrib import admin

# Register your models here.
from .models import CurrencyPair, Chart, UserPersonal, UserPreferences

admin.site.register(CurrencyPair)
admin.site.register(Chart)
admin.site.register(UserPersonal)
admin.site.register(UserPreferences)
