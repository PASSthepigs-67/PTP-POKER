import time
print('                                                                               =====TEAM B BANK=====\n')

accounts = {}


def addAccount():

    name = input('Enter name: ')
    password = input('Enter a password')
    accounts[name] = (password)
    print(accounts)

    


def depositMoney():
    balance = input('How much money do you want to deposit? (JUST ENTER NUMBER) ')
    
    if balance.isdigit():
        accounts[name] = (f'£{balance}')
        print(f'Deposit pending...')
        time.sleep(2.5)
        print(f'Successful!     {accounts}')

        listServices()

    else:
        print('Enter valid details.')
        addAccount()

def checkBalance():
    print(f'{accounts} \n ----------------------------')
    login = input('Enter your account name: ')

    for x in accounts:
        if x == login:
            val = accounts.get(x)
            print(f'Hello {x}. \nYou\'re available balance is {val}.')
            


       
            


def withdrawMoney():
    pass


def listServices():
    services = ['A: Create new account', 'B: Check balance', 'C: Deposit in to account', 'D: Withdraw money']
    print('Welcome to Team B Bank. Our services are:\n')

    for i in services:
        print(i)
        print('--------------------------')

    service = input('Choose a service. ')
    service = service.upper()

    if service == 'A':
        addAccount()
    elif service == 'B':
        checkBalance()
    elif service == 'C':
        depositMoney()
    elif service == 'D':
        withdrawMoney()

listServices()

