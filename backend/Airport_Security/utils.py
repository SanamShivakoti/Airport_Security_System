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


    @staticmethod
    def create_email_message(data, attachment=None):
        try:
            subject = data['subject']
            body = data['body']
            to_email = data['to_email']

            # Create EmailMessage instance
            email = EmailMessage(
                subject=subject,
                body=body,
                from_email=os.environ.get('EMAIL_FROM'),
                to=[to_email],
            )

            # Set content subtype to HTML
            email.content_subtype = 'html'

            # Attach the image if provided
            if attachment:
                email.attach(attachment['filename'], attachment['content'], attachment['mimetype'])

            return email
        except Exception as e:
            
            return None

    @staticmethod
    def send_email_admin(data, attachment=None):
        email = Util.create_email_message(data, attachment)

        if email:
            # Send the email
            try:
                email.send()
                return email
            except Exception as e:
                
                return None

        return None