import pygame
import time

pygame.init()

SCREEN_WIDTH = 600
SCREEN_HEIGHT = 450
background = pygame.image.load('bg.jpg')
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption('Shooting Tank Thing')
blue = (10, 35, 255)
red = (255, 20, 40)
green = 30, 240, 40
black = (0, 0, 0)
running = True
vel = 3
xPos =  300
yPos = 400
bulletY = 400

pygame.display.flip()

class Player:
    def __init__(self):
        pass
        
    
    def drawToDisplay(self):
        pygame.draw.rect(screen, green, (xPos, yPos, 30, 30))
        pygame.draw.rect(screen, green, (xPos + 7, yPos - 13, 15, 25))

    def drawBullets(self):
        pygame.draw.circle(screen, red, (xPos + 14, bulletY - 20), 5)
        
        

        
while running:
    screen.blit(background, (0, 0))
    tank = Player()
    keys = pygame.key.get_pressed()
    pygame.time.delay(7)
    
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

            
    if keys[pygame.K_LEFT]:
        xPos -= vel
    elif keys[pygame.K_RIGHT]:
        xPos += vel

    if xPos > 566 and not keys[pygame.K_LEFT]:
        vel = 0
    elif keys[pygame.K_LEFT] and xPos < 570:
        vel = 3

    if xPos < 5 and not keys[pygame.K_RIGHT]:
        vel = 0
    elif keys[pygame.K_RIGHT] and xPos > 1 and xPos < 9:
        vel = 3

    if keys[pygame.K_UP]:
         pygame.display.flip()
         tank.drawBullets()
    
    if keys[pygame.K_LEFT] or keys[pygame.K_RIGHT]:
       pygame.display.flip()

    if keys[pygame.K_UP]:
        bulletY -= vel

    elif keys is not [pygame.K_UP]:
        bulletY = 400
    
    tank.drawToDisplay()
    pygame.display.update()
                        




        

      

