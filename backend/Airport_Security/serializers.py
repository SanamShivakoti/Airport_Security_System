from rest_framework import serializers
from .models import User    

# serializer for User Registration
class UserRegistrationSerializer(serializers.ModelSerializer):

    password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)
    class Meta:
        model = User
        fields = ['user_id','first_name','middle_name','last_name','email','mobile_number','password','password2']
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
    fields = ['user_id', 'first_name','middle_name','last_name','mobile_number','role','email']