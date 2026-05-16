import random
import time
print('=====GUESS THE NUMBER!=====')

lower = int(input('Enter the smallest possible guess: '))
upper = int(input('Enter the largest possible guess: '))
number = random.randint(lower, upper)
print('=======================')
guesses = 0


if upper > 0 and upper < 51:
     guesses = 2
elif upper > 50 and upper < 101:
    guesses = 4
elif upper > 100 and upper < 251:
    guesses = 5
elif upper > 249 and upper < 501:
    guesses = 6
elif upper > 500 and upper < 1001:
    guesses = 8
else:
    guesses = 10


print(f'Guess between {lower} and {upper}.')

print(f'You have {guesses + 1} tries!')
guess = int(input('Guess the number! '))


while guess != number and guesses > 0:
    
    if guess > number:
        
        guesses -= 1
        print('Guess lower!')
        print(f'You have {guesses + 1} more tries!')
        time.sleep(0.5)
        guess = int(input('Guess the number! '))
        
    elif guess < number:
        
        guesses -= 1
        print('Guess higher!')
        print(f'You have {guesses + 1} more tries!')
        time.sleep(0.5)
        guess = int(input('Guess the number! '))


    if guesses == 0:
        print(f'Oh no! You ran out of guesses! The number was: {number}.')
        break
    
    
if guess == number:
    print('=====WELL DONE! YOU GUESSED THE NUMBER!=====')


