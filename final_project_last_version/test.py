import tkinter as tk
from tkinter.simpledialog import askstring
import tkinter.messagebox
import random
import os
import time
import copy


try:
    text_file=open('new_words.txt')
    text = text_file.read()
    words = text.split('\n')
    word = words.pop()
    new = '\n'.join(words)
    new_file = open('new_words.txt', 'w').write(new)
except:
    text_file=open('words.txt')
    text = text_file.read()
    words = text.split('\n')
    word = words.pop()
    new = '\n'.join(words)
    new_file = open('new_words.txt', 'w').write(new)
#initiate guessing tkinterface
def main():   
    ROOT = tk.Tk()
    ROOT.withdraw()
    guess = askstring(title="time up!",
            prompt="guess what is it on the drawing board: ")

    if guess == word.lower():
        tkinter.messagebox.showinfo('Correct', 'Correct!')
        
    else:
        tkinter.messagebox.showinfo('Wrong', f'The word on the board is: {word}')
        

if __name__=='__main__':
    main()
