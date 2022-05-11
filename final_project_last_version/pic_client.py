import sys
from sys import exit
import pygame
import socket, threading
import random
import tkinter as tk
from tkinter.simpledialog import askstring
import tkinter.messagebox
import time
import os
import copy

pygame.init()

#reference: https://www.youtube.com/watch?v=_7jWx...
PORT = 5050
IP = socket.gethostbyname(socket.gethostname())
ADDR = (IP,PORT)
client = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
client.connect(ADDR)
isdrawer = []

motion = []
colors = [(255,0,0),(0,255,0),(0,0,255),(0,0,0)]
colors_pos= [(30,30),(60,30),(90,30),(120,30)]


def recvmesgs():
    colors = [(255,0,0),(0,255,0),(0,0,255),(0,0,0)]
    colors_pos= [(30,30),(60,30),(90,30),(120,30)]
    msg = client.recv(64).decode("utf-8")
    #pass drawing action
    if msg == "drawer":
        isdrawer.append(0)
    while True:
        if not isdrawer:
            a = client.recv(300).decode("utf-8")
            x,y,r,g,b = a.split(" ")
            x = int(x)
            y = int(y)
            r = int(r)
            g = int(g)
            b = int(b)
            color = (r,g,b)
            try:
                board[x//8][y//8] = color
            except:
                pass
 
#creating drawing board, initial setting            
screen = pygame.display.set_mode((600,400))
screen.fill((0,255,255))

width = 600
height = 400
pixels = 8
board = [[(255,255,255) for _ in range(width//pixels)] for _ in range(width//pixels)]


threading.Thread(target = recvmesgs).start()
font = pygame.font.Font('freesansbold.ttf', 15)

text_file=open('words.txt')
text = text_file.read()
words = text.split('\n')
w = copy.deepcopy(words)


pygame.display.set_caption('Pictionary Game')
#PICTURES
#http://www.manicgamer.net/wp/wp-content/images/stories/picultimate/2467Pictionary%20Ultimate%20Edition%20Logo.png
logo = pygame.image.load('logo.png')
restart = pygame.image.load('restart.png')
restart = pygame.transform.scale(restart, (30,30))

#show the word
def show_word():
    w = random.choice(words)
    return w

text_file=open('words.txt')
text = text_file.read()
words = text.split('\n')
w = copy.deepcopy(words)



def show_play():
    play_again_button = font.render('Play Again',True,(255,255,255))
    screen.blit(play_again_button, (450,350))
    screen.blit(restart, (450,350))
def show_eraser():
    erase_button = font.render('Eraser',True,(255,0,0))
    screen.blit(erase_button, (140,20))

def show_clear():
   clear_button = font.render('Clear',True,(255,0,0))
   screen.blit(clear_button, (250,20))      
    
#main game loop, play again and again until you are bored with it
def play_again():
    
    pygame.draw.rect(screen, (0,0,0), (400,10,200,40))
    color = (0,0,0)
    running = True
    drawing = False
    erase = False
    ffont = pygame.font.SysFont('Consolas', 28)
    clock = pygame.time.Clock()
    #set up counter
    counter, count = 35, '30'.rjust(3)
    pygame.time.set_timer(pygame.USEREVENT,1000)
    word = w.pop()
    wordd = font.render(f'{word}',True,(255,255,255))
    screen.blit(wordd, (420,20))
    while running:
        #for event in pygame.event.get():
            #if event.type ==pygame.QUIT:
                #running==False

               # mouse_position=pygame.mouse.get_pos()
        if not isdrawer:
            
            pygame.draw.rect(screen, (0,0,0), (400,10,200,40))
            screen.blit(logo, (120,-20))
            if count =='Time is up!':
                count='35'
                os.system('python test.py')
                play_again()
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                try:
                    os.remove('new_words.txt')
                except:
                    pass
                exit()
            if event.type == pygame.USEREVENT: 
                counter -= 1
                pygame.draw.rect(screen, (255,0,0), (420,100,180,40))
                count = str(counter).rjust(3) if counter > 0 else 'Time is up!'
            elif event.type == pygame.MOUSEMOTION:
                if drawing:
                    if isdrawer:
                        x,y = pygame.mouse.get_pos()
                        r = color[0]
                        g = color[1]
                        b = color[2]
                        client.send(f"{str(x)} {str(y)} {str(r)} {str(g)} {str(b)}".encode("utf-8"))
                        try:
                            board[x//pixels][y//pixels] = color
                        except:
                            pass
            elif event.type == pygame.MOUSEBUTTONUP:
                drawing = False
            elif event.type == pygame.MOUSEBUTTONDOWN:
                drawing = True
                if 425<pygame.mouse.get_pos()[0]<500 and 330<pygame.mouse.get_pos()[1]<370:
                    play_again()
                    
                a = pygame.mouse.get_pos()
                for b in colors_pos:
                    if ((a[0]-b[0])**2 + (a[1]-b[1])**2) <= 10**2:
                        color = colors[colors_pos.index(b)]
                    erase = False
                    drawing = True
            elif event.type == pygame.KEYDOWN:
            #erase
                x,y = pygame.mouse.get_pos()
                try:
                    board[x//pixels][y//pixels] = (255,255,255)
                except:
                    pass
                    #erase the current pixel
                if event.key == pygame.K_TAB:
                    erase = True
                    drawing = False
                    #making screen shot
                elif event.key == pygame.K_s:       
                    pygame.image.save(screen,"latest_drawing.jpg")
        #pass erase message
        if erase:
            color_change=(255,255,255)
            x,y = pygame.mouse.get_pos()
            r = color_change[0]
            g = color_change[1]
            b = color_change[2]
            try:
                board[x//pixels][y//pixels] = (255,255,255)
                client.send(f"{str(x)} {str(y)} {str(r)} {str(g)} {str(b)}".encode("utf-8"))
            except:
                pass


        for i in range(50//8,len(board)-200//8):
            for j in range(50//8,len(board[0])):
                pygame.draw.rect(screen,board[i][j],((i*pixels,j*pixels),(pixels,pixels)))
        
        if isdrawer:
            show_eraser()
            show_clear()
            for x in range(len(colors_pos)):
                pygame.draw.circle(screen,(colors[x]),(colors_pos[x]),10)
        if count =='Time is up!':
            show_play()
 
    
    
        screen.blit(ffont.render(count, True, (0, 0, 0)), (420, 100))
        pygame.display.flip()
        clock.tick(60)
        pygame.display.update()
def erase():
    board=(255,255,255)

if __name__=='__main__':
    play_again()
    #pygame.quit()