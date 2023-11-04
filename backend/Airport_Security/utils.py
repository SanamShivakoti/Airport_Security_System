import random
import string

def generate_user_id():
    # Generate a 4-digit random number
    random_number = ''.join(random.choices(string.digits, k=4))
    # Add "U" as a prefix to the random number
    user_id = f'U{random_number}'
    return user_id
