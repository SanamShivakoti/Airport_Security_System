from Airport_Security.check_roles import role_required
from django.contrib.auth.decorators import permission_required
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from Airport_Security.models import User
from django.contrib.auth import authenticate 
from Airport_Security.serializers import UserRegistrationSerializer, LoginUserSerializer
from Airport_Security.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from Airport_Security.serializers import UserProfileSerializer
from rest_framework.permissions import IsAuthenticated

# Generate Token Manually
def get_tokens_for_user(user):
  refresh = RefreshToken.for_user(user)
  return {
      'refresh': str(refresh),
      'access': str(refresh.access_token),
  }

# User Registration
class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    @role_required(['Admin']) 
    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        
        if User.objects.filter(email=email).exists():
            return Response({"error": "User with the same user_id or email already exists."})
        
        user = serializer.save()
        token = get_tokens_for_user(user)
        return Response({'token':token,'msg' : 'Registration Successful'}, status=status.HTTP_201_CREATED)

      
# login User

class LoginUserView(APIView):
    renderer_classes =[UserRenderer]
    def post(self, request, format=None):
        serializer = LoginUserSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get('email')
        password = serializer.data.get('password')
        user = authenticate(email=email, password=password)
        if user is not None:
            token = get_tokens_for_user(user)
            return Response({'token':token,'msg':'Login Success'}, status=status.HTTP_200_OK)
        else:
            return Response({'errors':{'non_field_errors':['Email or Password is not valid']}}, status=status.HTTP_404_NOT_FOUND)


class UserProfileView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def get(self, request, format=None):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)





