from django.urls import path
from Airport_Security.views import UserRegistrationView, LoginUserView, UserProfileView, OTPVerifiedPasswordResetView, VerifyOtpView, SendOtpResetEmailView
urlpatterns = [
    path('register/user/', UserRegistrationView.as_view(), name = 'register'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('send_otp_email/', SendOtpResetEmailView.as_view(), name='send_otp_email'),
    path('otp_verification/', VerifyOtpView.as_view(), name='otp_verification'),
    path('password_reset/', OTPVerifiedPasswordResetView.as_view(), name='password_reset'),

]