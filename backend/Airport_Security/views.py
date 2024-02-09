from Airport_Security.check_roles import role_required
from django.contrib.auth.decorators import permission_required
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.views import View
from .models import User, Passenger, Staff, Notification, Activity
from django.contrib.auth import authenticate
from .serializers import UserRegistrationSerializer, LoginUserSerializer, UserProfileSerializer, OTPVerificationSerializer, UpdateUserProfileSerializer, PasswordResetSerializer, UserSerializer,FilterUserSerializer, UpdateUserSerializer, AdminChangePasswordSerializer, PassengerSerializer, PassengerDetailsSerializer, PassengerGetSerializer, UpdatePassengerSerializer, FilterPassengerSerializer, StaffRegisterSerializer, StaffGetSerializer, FilterStaffSerializer, UpdateStaffSerializer, StaffDetailsSerializer, ForgetPasswordSerializer, AdminNotificationSerializer,UserNotificationSerializer, AdminActivitiesSerializer, UserActivitiesSerializer
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
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics
from django.core.files.base import ContentFile
import base64
from io import BytesIO
import os
from django.conf import settings
from django.db.models import Q

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
        # Save activity
        activity_data = {
            'activity_description': f"This User {user.user_id} had registered",
            'role': 'Admin',  
            'created_at': timezone.now()
        }
        activity = Activity.objects.create(**activity_data)
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
        try:
            user = User.objects.get(user_id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # if 'password' in request.data:
        
        #     request.data['password'] = make_password(request.data['password'])

        serializer = UpdateUserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            activity_data = {
                'activity_description': f"This User {user.user_id} was updated",
                'role': 'Admin',  
                'created_at': timezone.now()
            }
            activity = Activity.objects.create(**activity_data)
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
            activity_data = {
                'activity_description': f"This User {user.user_id} was deleted",
                'role': 'Admin',  
                'created_at': timezone.now()
            }
            activity = Activity.objects.create(**activity_data)
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
        serializer = AdminChangePasswordSerializer(user, data=self.request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Password Reset successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    

# For passenger registration view
class PassengerRegistrationView(APIView):
        renderer_classes = [UserRenderer]
        permission_classes = [IsAuthenticated]

        @role_required(['Admin', 'User']) 
        def post(self, request, *args, **kwargs):
            email = request.data.get('email', None)
            
            
            # Check if a Passenger with the provided email already exists
            if  Passenger.objects.filter(email=email):
                return Response({"detail": "Passenger with this email already registered."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = PassengerSerializer(data=request.data)
            if serializer.is_valid():
                passenger = serializer.save()
                activity_data = {
                    'activity_description': f"This Passenger {passenger.passenger_id} had register",
                    'role': 'None',  
                    'created_at': timezone.now()
                }
                activity = Activity.objects.create(**activity_data)
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
        


# List of Passengers View to Read    
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
            activity_data = {
                    'activity_description': f"This Passenger {passenger.passenger_id} was  deleted",
                    'role': 'None',  
                    'created_at': timezone.now()
                }
            activity = Activity.objects.create(**activity_data)
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
            passenger = serializer.save()
            activity_data = {
                    'activity_description': f"This Passenger {passenger.passenger_id} was Updated",
                    'role': 'None',  
                    'created_at': timezone.now()
                }
            activity = Activity.objects.create(**activity_data)
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
        

class StaffRegistrationView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    @role_required(['Admin'])
    def post(self, request, *args, **kwargs):
        email = request.data.get('email', None)
        face_id = request.data.get('face_id', None)
        if Staff.objects.filter(email=email):
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        if Staff.objects.filter(face_id=face_id):
            return Response({'error': 'Face ID already exists'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = StaffRegisterSerializer(data=request.data)

        if serializer.is_valid():
            staff  = serializer.save()
            activity_data = {
                    'activity_description': f"This Staff {staff.staff_id} had registered",
                    'role': 'Admin',  
                    'created_at': timezone.now()
                }
            activity = Activity.objects.create(**activity_data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



class StaffView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    @role_required(['Admin']) 
    def get(self, request):
        staffs = Staff.objects.all()
        serializer = StaffGetSerializer(staffs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    



# Delete staff view
class DeleteStaffView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    @role_required(['Admin'])
    def delete(self, request, staff_id):
       
        try:
            staff = get_object_or_404(Staff, staff_id=staff_id)
            staff = get_object_or_404(Staff, staff_id=staff_id)
            face_id = staff.face_id
            binary_file_path = os.path.join(os.path.abspath("./face_dataset/"), F"{face_id}.npy")
            if os.path.exists(binary_file_path):
                os.remove(binary_file_path)

            activity_data = {
                    'activity_description': f"This Staff {staff.staff_id} was deleted",
                    'role': 'Admin',  
                    'created_at': timezone.now()
                }
            activity = Activity.objects.create(**activity_data)
            staff.delete()
            return Response({'msg': 'staff deleted successfully'}, status=status.HTTP_200_OK)
        except Staff.DoesNotExist:
            return Response({'error': 'staff not found'}, status=status.HTTP_404_NOT_FOUND)
        



# filter Passenger view
class FilterStaffView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    @role_required(['Admin'])
    def get(self,request, staff_id):

        try:
            staff = Staff.objects.get(staff_id=staff_id)

            serializer = FilterStaffSerializer(staff, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Passenger.DoesNotExist:
            return Response({'error': 'Staff not found'}, status=status.HTTP_404_NOT_FOUND)
        



# Update Staff view
class UpdateStaffView(APIView):
    # parser_classes = (MultiPartParser, )
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    @role_required(['Admin'])
    def patch(self, request, staff_id):

        try:
            staff = Staff.objects.get(staff_id=staff_id)
        except Staff.DoesNotExist:
            return Response({'error': 'Staff not found'}, status=status.HTTP_404_NOT_FOUND)
        

        serializer = UpdateStaffSerializer(staff, data=request.data)
        if serializer.is_valid():
            staff = serializer.save()
            activity_data = {
                    'activity_description': f"This Staff {staff.staff_id} was updated",
                    'role': 'Admin',  
                    'created_at': timezone.now()
                }
            activity = Activity.objects.create(**activity_data)
            return Response({'msg': 'Staff updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# Display the passenger flight details 
class StaffDetailView(generics.RetrieveAPIView):
    serializer_class = StaffDetailsSerializer

    def get_object(self):
        face_id = self.kwargs.get('face_id')
        try:
            staff = Staff.objects.get(face_id=face_id)
            return staff
        except Staff.DoesNotExist:
            return None

    def get(self, request, *args, **kwargs):
        staff = self.get_object()
        if staff:
            serializer = self.get_serializer(staff)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Unauthorized'}, status=status.HTTP_404_NOT_FOUND)
        


# Send mail of unknown face to Admin
class SendMailToAdminView(APIView):
    def post(self, request):
        admin_users = User.objects.filter(role='Admin')

        if admin_users.count() > 0:
            admin_user = admin_users.first()
            admin_email = admin_user.email

            base64_image_data = request.data.get('imageData', '')

            # Extract base64 part from Data URL
            _, base64_image = base64_image_data.split(',')

            # Convert base64 to BytesIO
            test_image_bytes = base64.b64decode(base64_image)
            test_image_io = BytesIO(test_image_bytes)

                        # Save notification to the database
            notification_data = {
                'notification_name': 'Unauthorized Detected',
                'notification_description': 'Unknown face has detected. Image of unknown face had already sent to your email. Please, check your email.',
                'role': 'Admin'
            }
            notification = Notification.objects.create(**notification_data)

            # Send email using Util class
            email_data = {
                'subject': 'Test Email with Image',
                'body': 'This is a test email with an image. See attached image.',
                'to_email': admin_email,
            }

            attachment = {
                    'filename': 'test_image.jpg',
                    'content': test_image_io.read(),
                    'mimetype': 'image/jpeg',
            }

            # Create EmailMessage instance
            Util.send_email_admin(email_data, attachment)



            print(f"Test Email sent to {admin_email}")
            return Response({'success': 'Admin found'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No admin found'}, status=status.HTTP_404_NOT_FOUND)
        



# Send OTP via mail for forget password
class SendOtpForgetEmailView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        email = request.data.get('email')

        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


        if user.role != 'Admin':
            return Response({'error': 'Permission denied. Your not Admin'}, status=status.HTTP_403_FORBIDDEN)

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

        return Response({'msg': 'OTP sent via email','type':'success', 'user_id': user.user_id}, status=status.HTTP_200_OK)
    



# Verify OTP View for forget password
class VerifyOtpForgetView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = ForgetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_id = serializer.validated_data['user_id']
        otp = serializer.validated_data['otp']

        try:
            user = User.objects.get(user_id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.otp == otp:
            time_limit = timedelta(minutes=1)  
            if user.otp_timestamp and timezone.now() - user.otp_timestamp < time_limit:
                user.otp = None
                user.otp_timestamp = None
                user.save()

                return Response({'msg': 'OTP Verified', 'type':'success', 'user_id': user.user_id}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'OTP has expired. Please,re-enter your email.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Incorrect OTP. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)
        

# Password Reset by using forget password
class ForgetChangePasswordView(APIView):
    renderer_classes = [UserRenderer]

    def put(self, request, user_id):
        try:
            user_change_password = User.objects.get(user_id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = AdminChangePasswordSerializer(user_change_password, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Password changed successfully'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


# Send OTP via mail to User for forget password reset process
class SendOtpForgetUserEmailView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        email = request.data.get('email')

        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


        if user.role != 'User':
            return Response({'error': 'Permission denied. Your not User'}, status=status.HTTP_403_FORBIDDEN)

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

        return Response({'msg': 'OTP sent via email','type':'success', 'user_id': user.user_id}, status=status.HTTP_200_OK)


class SendNotificationView(APIView):
    def post(self, request):
        notification_name = request.data.get('notification_name')
        notification_description = request.data.get('notification_description')
        role = request.data.get('role')

        # Create a notification instance
        notification = Notification.objects.create(
            notification_name=notification_name,
            notification_description=notification_description,
            role=role
        )

        return Response({'message': 'Notification sent successfully'}, status=status.HTTP_200_OK)
    

class AdminNotificationView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    @role_required(['Admin'])
    def get(self, request):
        notifications = Notification.objects.filter(role='Admin')
        admin_notification_serializer = AdminNotificationSerializer(notifications, many=True)
        return Response(admin_notification_serializer.data)
    


class UserNotificationView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    @role_required(['User'])
    def get(self, request):
        notifications = Notification.objects.filter(role='User')
        user_notification_serializer = UserNotificationSerializer(notifications, many=True)
        return Response(user_notification_serializer.data)
    


class UpdateNotificationCheckedAPIView(APIView):
    def put(self, request, notification_id):
        try:
            notification = Notification.objects.get(pk=notification_id)
            notification.checked = True
            notification.save()
            return Response({'message': 'Notification checked successfully'}, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification does not exist'}, status=status.HTTP_404_NOT_FOUND)
        


class AdminActivitiesView(APIView):
    renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    # @role_required(['Admin'])
    def get(self, request):
        notifications = Activity.objects.filter(Q(role='Admin') | Q(role='None'))
        admin_notification_serializer = AdminActivitiesSerializer(notifications, many=True)
        return Response(admin_notification_serializer.data)
        


class UserActivitiesView(APIView):
    renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    # @role_required(['Admin'])
    def get(self, request):
        notifications = Activity.objects.filter(role='None')
        admin_notification_serializer = UserActivitiesSerializer(notifications, many=True)
        return Response(admin_notification_serializer.data)
