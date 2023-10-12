from rest_framework import viewsets, serializers
from .models import Role, Admin, User
from .serializers import RoleSerializer, AdminSerializer, UserSerializer
from .utils import generate_user_id

# Create a RoleViewSet
class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer

# Create an AdminViewSet
class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    
    
    def validate(self, data):
        user_id = data.get('user_id')
        role = data.get('role_id')
        password = data.get('password')

        # Check if the user_id and role_id exist in the database
        if not Admin.objects.filter(user_id=user_id).exists():
            raise serializers.ValidationError('User does not exist')

        if not Admin.objects.filter(role_id=role).exists():
            raise serializers.ValidationError('Role does not exist')

        # Check the user's password
        user = Admin.objects.get(user_id=user_id)
        if not user.check_password(password):
            raise serializers.ValidationError('Invalid password')

        return data
    

# Create a UserViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
      
    
    def create(self, validated_data):
        # Get the role_name from the form data
            role_name = validated_data.get('role_name')
        
        # Look up the Role object based on role_name or create if it doesn't exist
            role, created = Role.objects.get_or_create(role_name=role_name)
        
        # Generate a unique User_id
            user_id = generate_user_id()
        
        # Assign the Role object to the User instance
            validated_data['role'] = role
        
        # Create the User instance with User_id and the assigned Role
            user = User.objects.create(user_id=user_id, **validated_data)
            return user
        
        
    def update(self, instance, validated_data):
        # Get the role_name from the form data
            role_name = validated_data.get('role_name')
        
        # Look up the Role object based on role_name or create if it doesn't exist
            role, created = Role.objects.get_or_create(role_name=role_name)
        
        # Update the Role field in the User instance
            instance.role = role
        
        # Update other fields if needed
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
        
        # Save the updated User instance
            instance.save()
            return instance