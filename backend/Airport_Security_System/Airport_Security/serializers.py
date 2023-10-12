from rest_framework_json_api import serializers
from .models import Role, Admin, User
from django.utils import timezone


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'
        
        
        
class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'
        
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        
    def create(self, request, *args, **kwargs):
        # Implement your custom logic for user creation here
        user_id = request.data.get('user_id')
        role_id = request.data.get('role_id')
        password = request.data.get('password')

        # Check if the user_id is empty
        if not user_id:
            raise serializers.ValidationError('User ID is required')

        # Additional validation logic: Check if the user_id already exists in the database
        if User.objects.filter(user_id=user_id).exists():
            raise serializers.ValidationError('User ID already exists')
        
        if not self.first_name:
            raise ValueError('First name is required')
        
        if not self.middle_name:
            self.middle_name = ''  # Set a default value if not provided

        if not self.last_name:
            raise ValueError('Last name is required')

        if not self.email:
            raise ValueError('Email is required')
        
        if not self.mobile_number:
            self.mobile_number = ''  # Set a default value if not provided

        # Check if the role_id is empty
        if not role_id:
            raise serializers.ValidationError('Role is required')

        # Additional validation logic: Check if the role exists in the database
        if not User.objects.filter(role_id=role_id).exists():
            raise serializers.ValidationError('Role does not exist')
        
                # Check if the password is empty
        if not password:
            raise serializers.ValidationError('Password is required')

        # Additional validation logic for password complexity (you can customize this)
        if len(password) < 8:
            raise serializers.ValidationError('Password must be at least 8 characters long')
        if not any(char.isdigit() for char in password):
            raise serializers.ValidationError('Password must contain at least one digit')
        if not any(char.isupper() for char in password):
            raise serializers.ValidationError('Password must contain at least one uppercase letter')
        if not any(char.islower() for char in password):
            raise serializers.ValidationError('Password must contain at least one lowercase letter')
        
        
        # Set default values for fields if not provided
        if not self.created_date:
            self.created_date = timezone.now().date()
        if not self.created_time:
            self.created_time = timezone.now().time()

        return super().create(request, *args, **kwargs)