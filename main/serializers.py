from rest_framework import serializers
from .models import CurrencyPair

class CurrencyPairSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrencyPair
        fields = ['name', 'symbol', 'type']

