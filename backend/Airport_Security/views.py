from rest_framework import viewsets, serializers
from .models import User
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework import status

import json


# Create a UserViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
      

        
        





