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
    
    # def create(self, request, *args, **kwargs):
    #     role_data = {
    #         "role_id": request.data.get("role_id"),
    #         "role_name": request.data.get("role_name")
    #     }
    #     role_serializer = self.get_serializer(data=role_data)
    #     if role_serializer.is_valid():
    #         role = role_serializer.save()
    #         role.save()
            
    #         return Response(role_serializer.data, status=status.HTTP_201_CREATED)
    #     else:
    #         return Response(role_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            
        

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
      

        
        
    # def update(self, request, pk=None):  # Include 'request' as the first argument
        
    #     try:
    #         user = User.objects.get(user_id=pk)
    #     except User.DoesNotExist:
    #         return Response({"detail":"User not found"}, status=status.HTTP_404_NOT_FOUND)
        
    #     print(request.data.get('role_id'))
    #     role_id = request.data.get('role_id')
        
        
    #     for attr, value in request.data.items():
    #         setattr(user, attr, value)
            
            
    #     user.save()
        
    #     serializer = UserSerializer(user)
    #     return Response(serializer.data)




