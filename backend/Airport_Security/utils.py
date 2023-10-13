import random
import string

def generate_user_id():
    # Generate a 4-digit random number
    random_number = ''.join(random.choices(string.digits, k=4))
    # Add "U" as a prefix to the random number
    user_id = f'U{random_number}'
    return user_id

def generate_role_id():
    # Generate a 4-digit random number
    random_number = ''.join(random.choices(string.digits, k=4))
    # Add "R" as a prefix to the random number
    role_id = f'R{random_number}'
    return role_id
