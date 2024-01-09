from django.urls import path
from Airport_Security.views import UserRegistrationView, LoginUserView, UserProfileView, OTPVerifiedPasswordResetView, UserView, UpdateUserView, DeleteUserView,VerifyOtpView, SendOtpResetEmailView, FilterUserView, AdminChangePasswordView, PassengerRegistrationView 
from .views import open_camera, flight_details_view

urlpatterns = [
    path('register/user/', UserRegistrationView.as_view(), name = 'register'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('send_otp_email/', SendOtpResetEmailView.as_view(), name='send_otp_email'),
    path('otp_verification/', VerifyOtpView.as_view(), name='otp_verification'),
    path('users_list/', UserView.as_view(), name='users_list'),
    path('user_update/<str:user_id>/', UpdateUserView.as_view(), name='user_update'),
    path('user_delete/<str:user_id>/', DeleteUserView.as_view(), name='user_delete'),
    path('user_filter/<str:user_id>/', FilterUserView.as_view(), name='user_filter'),
    path('change_password/', AdminChangePasswordView.as_view(), name='change_password'),
    path('passport_scan/', open_camera, name='passport_scan'), # Route for open camera
    path('register/passenger/', PassengerRegistrationView.as_view(), name = 'register_passenger'),
    path('flight_details/', flight_details_view.as_view(), name='flight_details'),


]