from django.db import models
from .utils import generate_role_id, generate_user_id
from django.contrib.auth.hashers import make_password
from django.core.validators import RegexValidator

class Role(models.Model):
    ADMIN = 'Admin'
    USER = 'User'
    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (USER, 'User'),
    ]

    role_id = models.CharField(max_length=5, primary_key=True, unique=True)
    role_name = models.CharField(max_length=5, choices=ROLE_CHOICES, default=USER)
    
    # def save(self, *args, **kwargs):
    #     if not self.role_id:
    #         # Generate a unique role_id if it's not provided
    #         self.role_id = generate_role_id()
    #     super(User, self).save(*args, **kwargs)

    def __str__(self):
        return self.role_id

class Admin(models.Model):
    
    # Define a regular expression pattern for mobile numbers
    mobile_regex = RegexValidator(
        regex=r'^\d{10}$',  # Modify the pattern to match your requirements
        message='Mobile number must be 10 digits long.'
    )

    user_id = models.CharField(max_length=5, primary_key=True, default=generate_user_id, unique=True)
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    mobile_number = models.CharField(max_length=15,
        blank=True, 
        validators=[mobile_regex], 
        )
    password = models.CharField(max_length=128)  # You should hash and store passwords securely
    role_id = models.ForeignKey(Role, on_delete=models.CASCADE)
    status = models.CharField(max_length=8, choices=[('active', 'Active'), ('inactive', 'Inactive')], default='active')
    created_date = models.DateField(auto_now_add=True)
    created_time = models.TimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.first_name} {self.middle_name} {self.last_name}'
    
       # Override the save method to hash the password before saving
    def save(self, *args, **kwargs):
        # Hash the password using make_password before saving
        self.password = make_password(self.password)
        super(Admin, self).save(*args, **kwargs)

class User(models.Model):
    # Define a regular expression pattern for mobile numbers
    mobile_regex = RegexValidator(
        regex=r'^\d{10}$',  # Modify the pattern to match your requirements
        message='Mobile number must be 10 digits long.'
    )
    user_id = models.CharField(max_length=5, primary_key=True, unique=True)
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    mobile_number = models.CharField(max_length=15,
        blank=True, 
        validators=[mobile_regex], 
        )
    password = models.CharField(max_length=128)  # You should hash and store passwords securely
    role_id = models.ForeignKey(Role, on_delete=models.CASCADE)
    status = models.CharField(max_length=8, choices=[('active', 'Active'), ('inactive', 'Inactive')], default='active')
    created_date = models.DateField(auto_now_add=True)
    created_time = models.TimeField(auto_now_add=True)
    
           # Override the save method to hash the password before saving
    def save(self, *args, **kwargs):
        # Hash the password using make_password before saving
        self.password = make_password(self.password)
        super(User, self).save(*args, **kwargs)
        
    def save(self, *args, **kwargs):
        if not self.user_id:
            # Generate a unique user_id if it's not provided
            self.user_id = generate_user_id()
        super(User, self).save(*args, **kwargs)
        
    def __str__(self):
        return self.user_id
    

        
        

        
