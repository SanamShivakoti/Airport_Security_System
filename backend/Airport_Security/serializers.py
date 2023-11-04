from rest_framework_json_api import serializers
from .models import User
from django.utils import timezone

       
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        
    