from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import User
from .serializers import UserRegistrationSerializer
from rest_framework.response import Response
from rest_framework import status

import json

class UserRegistrationView(APIView):
    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        
        if User.objects.filter(email=email).exists():
            return Response({"error": "User with the same user_id or email already exists."})
        
        user = serializer.save()
        return Response({'msg' : 'Registration Successful'}, status=status.HTTP_201_CREATED)

      

        
        





