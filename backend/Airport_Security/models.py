from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser
from .utils import generate_user_id
from django.core.validators import RegexValidator

class UserManager(BaseUserManager):
    def create_user(self, first_name, middle_name,  last_name, email, mobile_number, password=None, password2=None):
        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            middle_name=middle_name,
            last_name=last_name,
            mobile_number=mobile_number

        )
       
        user.set_password(password)
        user.save(using=self._db)
        return user
    
class User(AbstractBaseUser):
    ADMIN = 'Admin'
    USER = 'User'
    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (USER, 'User'),
    ]

    # Define a regular expression pattern for mobile numbers
    mobile_regex = RegexValidator(
        regex=r'^\d{10}$',  # Modify the pattern to match your requirements
        message='Mobile number must be 10 digits long.'
    )

    user_id = models.CharField(max_length=5, primary_key=True, unique=True, default=generate_user_id())
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(
      verbose_name='Email',
      max_length=255,
      unique=True,
    )
    mobile_number = models.CharField(max_length=15,
        blank=True, 
        validators=[mobile_regex], 
        )
    password = models.CharField(max_length=128) 
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_timestamp = models.DateTimeField(null=True, blank=True)
    role = models.CharField(max_length=5, choices=ROLE_CHOICES, default=USER)
    status = models.CharField(max_length=8, choices=[('active', 'Active'), ('inactive', 'Inactive')], default='active')
    created_date = models.DateField(auto_now_add=True)
    created_time = models.TimeField(auto_now_add=True)
    
    
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['user_id','first_name', 'last_name','password','role','status']

        
    def __str__(self):
        return self.user_id
    

       
        

        
