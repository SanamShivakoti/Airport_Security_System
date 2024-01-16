from rest_framework import serializers
from .models import User, Passenger   
from django.contrib.auth.hashers import make_password

# serializer for User Registration
class UserRegistrationSerializer(serializers.ModelSerializer):

    password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)
    class Meta:
        model = User
        fields = ['first_name','middle_name','last_name','email','role','mobile_number','password','password2']
        extra_kwargs={
            'password':{'write_only':True}
        }
    
    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError("Password and Confirm Password doen't match.")

        return attrs

    def create(self, validate_data):
        return User.objects.create_user(**validate_data)

# serializer for Login User
class LoginUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        model = User
        fields = ['email','password']


class UserProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ['user_id', 'first_name','middle_name','last_name','mobile_number','role','email','avatar']


class OTPVerificationSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6, required=True)

class PasswordResetSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True, required=True)
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True, required=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UpdateUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [ 'first_name','middle_name','last_name','mobile_number','role','email','status','avatar']


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [ 'first_name','middle_name','last_name','mobile_number','role','email','status']

class FilterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class AdminChangePasswordSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)
    
    class Meta:
        model = User
        fields = ['password', 'password2']
        extra_kwargs={
            'password':{'write_only':True}
        }


    def validate(self, attrs):

        password = attrs.get('password')
        password2 = attrs.get('password2')

        if password != password2:
            raise serializers.ValidationError("Password and Confirm Password doen't match.")
        else:
             attrs['password'] = make_password(attrs['password'])

        return attrs
    
    def create(self, validate_data):
        return User.objects.create_user(**validate_data)
    

# Passengers Serializers

class PassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passenger
        exclude = ('passenger_id', )


class PassengerDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passenger
        fields = '__all__'


class PassengerGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passenger
        fields = '__all__'


class UpdatePassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passenger
        exclude = ('passenger_id', )

class FilterPassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passenger
        fields = '__all__'