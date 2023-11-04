from django.db import models
from .utils import generate_user_id
from django.contrib.auth.hashers import make_password, check_password
from django.core.validators import RegexValidator

class User(models.Model):
    ADMIN = 'Admin'
    USER = 'User'
    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (USER, 'User'),
    ]
    
    # print(check_password('12345','pbkdf2_sha256$600000$QybzmztV2uz8oIKnFTymEX$ukCd53I0ON3Y+sUlootdctH6DE9UfJiVYiH3Pu/IEjk='))
    
    # Define a regular expression pattern for mobile numbers
    mobile_regex = RegexValidator(
        regex=r'^\d{10}$',  # Modify the pattern to match your requirements
        message='Mobile number must be 10 digits long.'
    )

  
    user_id = models.CharField(max_length=5, primary_key=True, unique=True, default=generate_user_id())
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    mobile_number = models.CharField(max_length=15,
        blank=True, 
        validators=[mobile_regex], 
        )
    password = models.CharField(max_length=128)  # You should hash and store passwords securely
    role = models.CharField(max_length=5, choices=ROLE_CHOICES, default=USER)
    status = models.CharField(max_length=8, choices=[('active', 'Active'), ('inactive', 'Inactive')], default='active')
    created_date = models.DateField(auto_now_add=True)
    created_time = models.TimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):

        # Hash the password using make_password before saving
        self.password = make_password(self.password)
        
        super(User, self).save(*args, **kwargs)
   
        
    def __str__(self):
        return self.user_id
    

        
        

        
