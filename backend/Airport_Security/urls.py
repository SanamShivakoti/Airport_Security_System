from django.urls import path
from Airport_Security.views import UserRegistrationView, LoginUserView, UserProfileView, OTPVerifiedPasswordResetView, UserView, UpdateUserView,UpdateUserProfileView, DeleteUserView,VerifyOtpView, SendOtpResetEmailView, FilterUserView, AdminChangePasswordView, PassengerRegistrationView, PassengerDetailView , PassengerView,UpdatePassengerView, DeletePassengerView, FilterPassengerView, StaffRegistrationView, StaffView, DeleteStaffView, FilterStaffView, UpdateStaffView, StaffDetailView
from .views import flight_details_view

urlpatterns = [
    path('register/user/', UserRegistrationView.as_view(), name = 'register'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('send_otp_email/', SendOtpResetEmailView.as_view(), name='send_otp_email'),
    path('otp_verification/', VerifyOtpView.as_view(), name='otp_verification'),
    path('users_list/', UserView.as_view(), name='users_list'),
    path('user_update/profile/<str:user_id>/', UpdateUserProfileView.as_view(), name='user_update_profile'),
    path('user_update/<str:user_id>/', UpdateUserView.as_view(), name='user_update'),
    path('user_delete/<str:user_id>/', DeleteUserView.as_view(), name='user_delete'),
    path('user_filter/<str:user_id>/', FilterUserView.as_view(), name='user_filter'),
    path('change_password/', AdminChangePasswordView.as_view(), name='change_password'),
    path('register/passenger/', PassengerRegistrationView.as_view(), name = 'register_passenger'),
    path('flight_details/', flight_details_view.as_view(), name='flight_details'),
    path('passenger/<str:passport_number>/', PassengerDetailView.as_view(), name='passenger-detail'),
    path('passengers_list/', PassengerView.as_view(), name='passengers_list'),
    path('passengers_delete/<str:passenger_id>/', DeletePassengerView.as_view(), name='passengers_delete'),
    path('passenger_filter/<str:passenger_id>/', FilterPassengerView.as_view(), name='passenger_filter'),
    path('passenger_update/<str:passenger_id>/', UpdatePassengerView.as_view(), name='passenger_update'),
    path('register/Staff/', StaffRegistrationView.as_view(), name='staff_register'),
    path('staffs_list/', StaffView.as_view(), name='staffs_list'),
    path('staffs_delete/<str:staff_id>/', DeleteStaffView.as_view(), name='staffs_delete'),
    path('staffs_filter/<str:staff_id>/', FilterStaffView.as_view(), name ='staffs_filter'),
    path('staffs_update/<str:staff_id>/', UpdateStaffView.as_view(), name='staffs_update'),
    path('staff/<str:face_id>/', StaffDetailView.as_view(), name='staff-detail'),

]