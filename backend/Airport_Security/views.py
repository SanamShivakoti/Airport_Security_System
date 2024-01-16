from Airport_Security.check_roles import role_required
from django.contrib.auth.decorators import permission_required
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.views import View
from .models import User, Passenger
from django.contrib.auth import authenticate
from .serializers import UserRegistrationSerializer, LoginUserSerializer, UserProfileSerializer, OTPVerificationSerializer, UpdateUserProfileSerializer, PasswordResetSerializer, UserSerializer,FilterUserSerializer, UpdateUserSerializer, AdminChangePasswordSerializer, PassengerSerializer, PassengerDetailsSerializer, PassengerGetSerializer, UpdatePassengerSerializer, FilterPassengerSerializer
from .renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from Airport_Security.utils import generate_otp, Util
from django.utils import timezone
from datetime import timedelta
from django.http import HttpResponseRedirect, JsonResponse
import requests
from django.http import StreamingHttpResponse
from django.shortcuts import get_object_or_404, render
import json
import asyncio
from rest_framework.parsers import MultiPartParser
from rest_framework import generics

# Generate Token Manually
def get_tokens_for_user(user):
  refresh = RefreshToken.for_user(user)
  return {
      'refresh': str(refresh),
      'access': str(refresh.access_token),
  }

# User Registration View
class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    @role_required(['Admin']) 
    def post(self, request, format=None):
        email = request.data.get('email', None)

        if  User.objects.filter(email=email):
                return Response({"detail": "User with this email already registered."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserRegistrationSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()
        token = get_tokens_for_user(user)
        return Response({'msg' : 'Registration Successful'}, status=status.HTTP_201_CREATED)

      
# login User View
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
            
            return Response({'token':token, 'role':user.role, 'msg':'Login Success'}, status=status.HTTP_200_OK)
        else:
            return Response({'errors':{'non_field_errors':['Email or Password is not valid']}}, status=status.HTTP_404_NOT_FOUND)


# User Profile View of Logined Users
class UserProfileView(APIView):
  arser_classes = (MultiPartParser, )
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  
  @role_required(['Admin','User']) 
  def get(self, request, format=None):
    serializer = UserProfileSerializer(request.user)
    
    return Response(serializer.data, status=status.HTTP_200_OK)
  

# Send OTP View Via Email for Password Reset
class SendOtpResetEmailView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    @role_required(['Admin','User']) 
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
    

# Verify OTP View
class VerifyOtpView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    @role_required(['Admin','User']) 
    def post(self, request, format=None):
        serializer = OTPVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        otp = serializer.validated_data['otp']
        

        user = request.user
        if user.otp == otp:
            time_limit = timedelta(minutes=1)  
            if user.otp_timestamp and timezone.now() - user.otp_timestamp < time_limit:
                user.otp = None
                user.otp_timestamp = None
                user.save()

                
                return Response({'msg':'OTP Verified'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Incorrect OTP. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)


# Password Reset View after OTP Verified
class OTPVerifiedPasswordResetView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    @role_required(['Admin','User']) 

    def OTPVerifiedPasswordReset(self,request):
        user = request.user

        if user.otp:
            return HttpResponseRedirect(reverse('otp_verification'))
        else:
            if request.method =='POST':
                serializer = PasswordResetSerializer(data=self.request.POST)
                if serializer.is_valid():
                    new_password = serializer.validated_data['password']
                    user.set_password(new_password)
                    user.save()

                    return Response({'msg':'Password changed successfully'}, status=status.HTTP_200_OK) 
                else:
                    return Response({'error': 'Password changed Unsuccessful'}, status=status.HTTP_400_BAD_REQUEST)
                
            return Response({'error':'!! Sorry, something went wrong !!'})



# List of Users View to Read all Users    
class UserView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    @role_required(['Admin']) 
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class UpdateUserProfileView(APIView):
    parser_classes = (MultiPartParser, )
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    @role_required(['Admin'])
    def patch(self, request, user_id):
        print(request.data)
        try:
            user = User.objects.get(user_id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # if 'password' in request.data:
        
        #     request.data['password'] = make_password(request.data['password'])

        serializer = UpdateUserProfileSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'User updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UpdateUserView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    @role_required(['Admin'])
    def patch(self, request, user_id):
        print(request.data)
        try:
            user = User.objects.get(user_id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # if 'password' in request.data:
        
        #     request.data['password'] = make_password(request.data['password'])

        serializer = UpdateUserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'User updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FilterUserView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    @role_required(['Admin'])
    def get(self,request, user_id):

        try:
            user = User.objects.get(user_id=user_id)

            serializer = FilterUserSerializer(user, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        

class DeleteUserView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    @role_required(['Admin'])
    def delete(self, request, user_id):
       
        try:
            user = get_object_or_404(User, user_id=user_id)
            user.delete()
            return Response({'msg': 'User deleted successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        

class AdminChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    @role_required(['Admin','User'])
    def put(self, request):
        user = request.user
        print(self.request.data)
        serializer = AdminChangePasswordSerializer(user, data=self.request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Password Reset successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    

# For passenger registration view
class PassengerRegistrationView(APIView):
        renderer_classes = [UserRenderer]
        permission_classes = [IsAuthenticated]

        @role_required(['Admin']) 
        def post(self, request, *args, **kwargs):
            email = request.data.get('email', None)
            
            
            # Check if a Passenger with the provided email already exists
            if  Passenger.objects.filter(email=email):
                return Response({"detail": "Passenger with this email already registered."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = PassengerSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

# Display the passenger flight details template view
class flight_details_view(View):
    template_name ='passenger_view.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)

# Display the passenger flight details 
class PassengerDetailView(generics.RetrieveAPIView):
    serializer_class = PassengerDetailsSerializer

    def get_object(self):
        passport_number = self.kwargs.get('passport_number')
        try:
            passenger = Passenger.objects.get(passport_number=passport_number)
            return passenger
        except Passenger.DoesNotExist:
            return None

    def get(self, request, *args, **kwargs):
        passenger = self.get_object()
        if passenger:
            serializer = self.get_serializer(passenger)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Passenger not Found.'}, status=status.HTTP_404_NOT_FOUND)
        


# List of Passengers View to Read all Users    
class PassengerView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    @role_required(['Admin', 'User']) 
    def get(self, request):
        passengers = Passenger.objects.all()
        serializer = PassengerGetSerializer(passengers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


# Delete passenger view
class DeletePassengerView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    @role_required(['Admin','User'])
    def delete(self, request, passenger_id):
       
        try:
            passenger = get_object_or_404(Passenger, passenger_id=passenger_id)
            passenger.delete()
            return Response({'msg': 'Passenger deleted successfully'}, status=status.HTTP_200_OK)
        except Passenger.DoesNotExist:
            return Response({'error': 'Passenger not found'}, status=status.HTTP_404_NOT_FOUND)
        


# Update Passenger view
class UpdatePassengerView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    @role_required(['Admin','User'])
    def patch(self, request, passenger_id):

        try:
            passenger = Passenger.objects.get(passenger_id=passenger_id)
        except Passenger.DoesNotExist:
            return Response({'error': 'Passenger not found'}, status=status.HTTP_404_NOT_FOUND)
        

        serializer = UpdatePassengerSerializer(passenger, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Passenger updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# filter Passenger view
class FilterPassengerView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    @role_required(['Admin','User'])
    def get(self,request, passenger_id):

        try:
            passenger = Passenger.objects.get(passenger_id=passenger_id)

            serializer = FilterPassengerSerializer(passenger, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Passenger.DoesNotExist:
            return Response({'error': 'Passenger not found'}, status=status.HTTP_404_NOT_FOUND)