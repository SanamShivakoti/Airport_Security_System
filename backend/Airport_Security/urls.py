from django.urls import path
from Airport_Security.views import UserRegistrationView, LoginUserView, UserProfileView
urlpatterns = [
    path('register/user/', UserRegistrationView.as_view(), name = 'register'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),

]