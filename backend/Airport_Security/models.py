from django.db import models
import random
import string
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser
from django.core.validators import RegexValidator

def generate_user_id():
    while True:
        # Generate a 4-digit random number
        random_number = ''.join(random.choices(string.digits, k=4))
        # Add "U" as a prefix to the random number
        user_id = f'U{random_number}'

        # Check if the generated user_id already exists
        if not User.objects.filter(user_id=user_id).exists():
            return user_id

class UserManager(BaseUserManager):
    def create_user(self, first_name, middle_name,  last_name, email, mobile_number, password=None, password2=None):
        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            middle_name=middle_name,
            last_name=last_name,
            mobile_number=mobile_number,
            # role=role
        )

        user.set_password(password)
        user.save(using=self._db)
        print(user)
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

    user_id = models.CharField(max_length=5, primary_key=True, unique=True)
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(
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
    REQUIRED_FIELDS = ['first_name', 'last_name','password','role','status']

    def __str__(self):
        return self.user_id

    def save(self, *args, **kwargs):
        if not self.user_id:
            self.user_id = generate_user_id()
        super().save(*args, **kwargs)



# for staff model
class Staff(models.Model):
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50)
    mobile_regex = RegexValidator(
        regex=r'^\d{10}$',  
        message='Mobile number must be 10 digits long.'
    )

    email = models.EmailField(
      verbose_name='Email',
      max_length=255,
      unique=True,
    )
    mobile_number = models.CharField(max_length=15,
        blank=True, 
        validators=[mobile_regex], 
        )
    
    address = models.CharField(max_length=50, blank=True, null=True)
    department = models.CharField(max_length=50)
    face_id = models.ForeignKey('Face', on_delete=models.CASCADE)

# for face model
class Face(models.Model):
    face_id = models.CharField(max_length=6, primary_key=True, unique=True)
    faces = models.ImageField(upload_to='face_images/')

# for passenger model
class Passenger(models.Model):
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50)
    mobile_regex = RegexValidator(
        regex=r'^\d{10}$',  
        message='Mobile number must be 10 digits long.'
    )

    email = models.EmailField(
      max_length=255,
      unique=True,
    )
    mobile_number = models.CharField(max_length=15,
        blank=True, 
        validators=[mobile_regex], 
        )
    
    flight_number = models.CharField(max_length=50)
    plane_number = models.CharField(max_length=50)
    booked_Date = models.DateField()
    booked_Time = models.DateTimeField()
    passport_number = models.CharField(max_length=50)
    flight_Destination_from = models.CharField(max_length=50)
    flight_Destination_to = models.CharField(max_length=50)
    flight_Destination_Duration = models.DateTimeField()
    depature_date = models.DateField()
    depature_time = models.DateTimeField()
    arrival_date = models.DateField()
    arrival_time = models.DateTimeField()
    
