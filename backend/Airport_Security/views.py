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
from Airport_Security.utils import generate_otp, Util
from django.utils import timezone
from datetime import timedelta
from Airport_Security.serializers import OTPVerificationSerializer, PasswordResetSerializer
from django.urls import reverse
from django.http import HttpResponseRedirect, HttpResponse

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
  


class SendOtpResetEmailView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
            user = request.user
            otp = generate_otp()
            user.otp = otp
            user.otp_timestamp = timezone.now()
            user.save()
            subject = 'Password Reset OTP'
            message = f'Your OTP is: {otp}'
            to_email = user.email

            email_data = {
                'subject': subject,
                'body': message,
                'to_email': to_email,
            }

            Util.send_email(email_data)

            return Response({'msg': 'OTP sent via email'}, status=status.HTTP_200_OK)
    


class VerifyOtpView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        serializer = OTPVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        otp = serializer.validated_data['otp']
        

        user = request.user
        if user.otp == otp:
            time_limit = timedelta(minutes=5)  # Adjust the time limit as needed
            if user.otp_timestamp and timezone.now() - user.otp_timestamp < time_limit:
                user.otp = None
                user.otp_timestamp = None
                user.save()

                password_change_url = reverse('password_reset')
                return HttpResponseRedirect(password_change_url)
            else:
                return Response({'error': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)



class OTPVerifiedPasswordResetView(APIView):

    def OTPVerifiedPasswordReset(request):
        user = request.user

        if user.otp:
            return HttpResponseRedirect(reverse('otp_verification'))
        else:
            if request.method =='POST':
                serializer = PasswordResetSerializer(data=request.POST)
                if serializer.is_valid():
                    new_password = serializer.validated_data['password']
                    user.set_password(new_password)
                    user.save()

                    return Response({'error':'Password changed successfully'}, status=status.HTTP_200_OK) 
                else:
                    return Response({'error': 'Password changed Unsuccessful'}, status=status.HTTP_400_BAD_REQUEST)
                
            return Response({'error':'!! Sorry, something went wrong !!'})





