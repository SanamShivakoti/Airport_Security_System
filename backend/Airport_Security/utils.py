from django.core.mail import EmailMessage
import os
import random
import string

def generate_otp():
    characters = string.digits
    return ''.join(random.choice(characters) for _ in range(6))

class Util:
    @staticmethod
    def send_email(data):
        email = EmailMessage(
            subject=data['subject'],
            body=data['body'],
            from_email=os.environ.get('EMAIL_FROM'),
            to=[data['to_email']]
        )
        email.send()