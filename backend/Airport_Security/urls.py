from django.urls import path
from Airport_Security.views import UserRegistrationView
urlpatterns = [
    path('register/user/', UserRegistrationView.as_view(), name = 'register'),

]