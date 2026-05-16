#username gen
import random
import string

letters = string.ascii_letters
numbers = string.digits
username = ''

username = ''.join(random.choice(letters + numbers) for _ in range(12))

print(username)
    



