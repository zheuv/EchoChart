from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class CurrencyPair(models.Model):
    name = models.CharField(max_length=60, primary_key=True)
    symbol = models.CharField(max_length=10, null=True)
    type = models.CharField(max_length=20, null=True)

    def __str__(self):
        return self.name

class Chart(models.Model):
    currency_pair = models.ForeignKey(CurrencyPair, on_delete=models.CASCADE)
    timeframe = models.CharField(max_length=10)
    chart_data = models.JSONField()

    def __str__(self):
        return f'{self.currency_pair} - {self.timeframe}'

class UserPersonal(models.Model):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    pwd = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username

class UserPreferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    design = models.JSONField(default=dict)  # Provide a default value
    fav_pairs = models.JSONField(default=list)  # Add default if needed
    trades = models.JSONField(default=list)  # Add default if needed

    def __str__(self):
        return self.user.username



