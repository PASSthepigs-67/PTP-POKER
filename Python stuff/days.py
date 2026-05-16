import random
import string

def generatePassword(len):
    chars = string.ascii_letters + string.digits
    password = ''.join(random.choice(chars) for _ in range(len))

    print(password)

while True:
    length = int(input('How long do you want the password? '))
    generatePassword(length)

