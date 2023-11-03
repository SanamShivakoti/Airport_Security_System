from rest_framework import viewsets, serializers
from .models import Role, Admin, User
from .serializers import RoleSerializer, AdminSerializer, UserSerializer
from .utils import generate_user_id
from rest_framework.response import Response
from rest_framework import status

import json
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
      

        
        





