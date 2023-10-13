from rest_framework_json_api import serializers
from .models import Role, Admin, User
from django.utils import timezone


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'
        
        def create(self, request, *args, **kwargs):
            role_id = request.data.get('role_id')
            role_name = request.data.get('role_id')
        
                    # Check if the role_id is empty
            if not role_id:
                raise serializers.ValidationError('Role is required')

            if not role_name:
                raise serializers.ValidationError('Role name is required')
            
            return super().create(request, *args, **kwargs)
        
class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'
        
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        
    