"""
Created on Sun Apr  5 00:00:32 2015

@author: zhengzhang
"""
from chat_utils import *
import json
import os
import sys
import tkinter as tk
import tkinter.messagebox
from tkinter.simpledialog import askstring
import base64
import Crypto
from Crypto.PublicKey import RSA
from Crypto import Random
from Crypto.Cipher import PKCS1_v1_5
#reference: provided video from brightspace
#generate random code by Random method from crypto
random_code = Random.new().read
#receiving rsa code system
rsa = RSA.generate(1024,random_code)

#generate private shared secret for decryption
private_pem = rsa.exportKey()
with open('client-private.pem','wb') as f:
    f.write(private_pem)
#generate public shared secret for encryption
public_pem = rsa.publickey().exportKey()
with open('client-public.pem','wb') as f:
    f.write(public_pem)
#take the message and encrypt it
def C_encrypt(my_msg):
    with open('client-public.pem','r') as f:
        key = f.read()
        rsakey = RSA.importKey(key)
        cipher = PKCS1_v1_5.new(rsakey)
        cipher_text = base64.b64encode(cipher.encrypt(my_msg.encode(encoding="utf-8"))).decode("utf-8")
        return cipher_text
#take the message and decrypt it
def C_decrypt(cipher_text):
    with open('client-private.pem') as f:
        key = f.read()
        rsakey = RSA.importKey(key)
        cipher = PKCS1_v1_5.new(rsakey)
        text = cipher.decrypt(base64.b64decode(cipher_text),"ERROR").decode("utf-8")
        return text

class ClientSM:
    def __init__(self, s):
        self.state = S_OFFLINE
        self.ecrp = False
        self.peer = ''
        self.me = ''
        self.out_msg = ''
        self.s = s
        #dictionary for replacing the emoji representation
        self.emoji = {
        ':-)': chr(0x1F642),
        ':-D': chr(0x1F600),
        ':-(': chr(0x2639),
        ':\'-(': chr(0x1F622),
        ':-O': chr(0x1F62E),
        ';-)': chr(0x1F609),
        ':-P': chr(0x1F61B),
        '>:[': chr(0x1F620),
        ':-/': chr(0x1F914),
        'B-)': chr(0x1F60E),
            }
    #method to replace the emoji representation
    def emoji_message(self,message):
        for (emoticon, emoji) in self.emoji.items():
            message = message.replace(emoticon, emoji)
        return message
    #ask if you want to encrypt the message
    def askcrp(self):   
        self.crpwindow = tk.Tk()
        self.crpwindow.withdraw()
        crp = askstring(title="encrpt or not?",
                prompt="Do you want to allow the server to know your message? yes/no: ", parent = self.crpwindow)

        if crp == 'yes':
            self.ecrp = False
            self.crpwindow.destroy()
        
        else:
            self.ecrp = True
            self.crpwindow.destroy()

    def set_state(self, state):
        self.state = state

    def get_state(self):
        return self.state

    def set_myname(self, name):
        self.me = name

    def get_myname(self):
        return self.me

    def connect_to(self, peer):
        msg = json.dumps({"action":"connect", "target":peer})
        mysend(self.s, msg)
        response = json.loads(myrecv(self.s))
        if response["status"] == "success":
            self.peer = peer
            self.out_msg += 'You are connected with '+ self.peer + '\n'
            return (True)
        elif response["status"] == "busy":
            self.out_msg += 'User is busy. Please try again later\n'
        elif response["status"] == "self":
            self.out_msg += 'Cannot talk to yourself (sick)\n'
        else:
            self.out_msg += 'User is not online, try again later\n'
        return(False)

    def disconnect(self):
        msg = json.dumps({"action":"disconnect"})
        mysend(self.s, msg)
        self.out_msg += 'You are disconnected from ' + self.peer + '\n'
        self.peer = ''
            
    #similar to connect to function,
    #send gaming request to server and ask for gaming client socket
    def connect_gamer(self, peer):
        msg = json.dumps({"action":"game","target":peer})
        mysend(self.s, msg)
        response = json.loads(myrecv(self.s))
        if response["status"] == "success":
            self.game_peer = peer
            self.out_msg += 'connected to game server with '+ self.game_peer + '\n'
            return (True)
        elif response["status"] == "busy":
            self.out_msg += 'User is busy. Please try again later\n'
        elif response["status"] == "self":
            self.out_msg += 'Cannot game with yourself (sick)\n'
        else:
            self.out_msg += 'User is not online, try again later\n'
        return(False)

    def proc(self, my_msg, peer_msg):
        self.out_msg = ''
#==============================================================================
# Once logged in, do a few things: get peer listing, connect, search
# And, of course, if you are so bored, just go
# This is event handling instate "S_LOGGEDIN"
#==============================================================================
        if self.state == S_LOGGEDIN:
            if len(my_msg) > 0:

                if my_msg == 'q':
                    self.out_msg += 'See you next time!\n'
                    self.state = S_OFFLINE

                elif my_msg == 'time':
                    mysend(self.s, json.dumps({"action":"time"}))
                    time_in = json.loads(myrecv(self.s))["results"]
                    self.out_msg += "Time is: " + time_in

                elif my_msg == 'who':
                    mysend(self.s, json.dumps({"action":"list"}))
                    logged_in = json.loads(myrecv(self.s))["results"]
                    self.out_msg += 'Here are all the users in the system:\n'
                    self.out_msg += logged_in

                elif my_msg[0] == 'c':
                    peer = my_msg[1:]
                    peer = peer.strip()
                    if self.connect_to(peer) == True:
                        self.state = S_CHATTING
                        self.askcrp()
                        self.out_msg += 'Connect to ' + peer + '. Chat away!\n\n'
                        self.out_msg += '-----------------------------------\n'
                    else:
                        self.out_msg += 'Connection unsuccessful\n'

                #sending gaming request, really similar to elif my_msg[0] == "c" condition,
                #we send the request and initialize a new client socket for gaming.
                elif my_msg[0] == 'g':
                    game_peer = my_msg[1:]
                    game_peer = game_peer.strip()
                    if self.connect_gamer(game_peer) == True:
                        self.state = S_GAMING
                        self.out_msg += 'Doing Pictionary Game with ' + game_peer + '\n'
                        self.out_msg += '-----------------------------------\n'
                        os.system('pic_client.py')
                    else:
                        self.out_msg += 'Connection unsuccessful\n'


                elif my_msg[0] == '?':
                    term = my_msg[1:].strip()
                    mysend(self.s, json.dumps({"action":"search", "target":term}))
                    search_rslt = json.loads(myrecv(self.s))["results"][1:].strip()
                    if (len(search_rslt)) > 0:
                        self.out_msg += search_rslt + '\n\n'
                    else:
                        self.out_msg += '\'' + term + '\'' + ' not found\n\n'

                elif my_msg[0] == 'p' and my_msg[1:].isdigit():
                    poem_idx = my_msg[1:].strip()
                    mysend(self.s, json.dumps({"action":"poem", "target":poem_idx}))
                    poem = json.loads(myrecv(self.s))["results"]
                    if (len(poem) > 0):
                        self.out_msg += poem + '\n\n'
                    else:
                        self.out_msg += 'Sonnet ' + poem_idx + ' not found\n\n'

                else:
                    self.out_msg += menu

            if len(peer_msg) > 0:
                try:
                    peer_msg = json.loads(peer_msg)
                except Exception as err :
                    self.out_msg += " json.loads failed " + str(err)
                    return self.out_msg
            
                if peer_msg["action"] == "connect":
                    self.peer = peer_msg['from']
                    self.askcrp()
                    self.out_msg += 'Request from ' + self.peer + '\n'
                    self.out_msg += 'Connected to ' + self.peer
                    self.out_msg += '. Chat away!\n\n'
                    self.out_msg += '------------------------------------\n'
                    self.state = S_CHATTING
                #receiving gaming request, really similar to elif peer_msg["action"] == "connect" condition,
                #we receive the request and initialize a new client socket for gaming.
                elif peer_msg["action"] == "game":
                    self.game_peer = peer_msg["from"]
                    self.out_msg += 'Game Request from ' + self.game_peer + '!\n'
                    self.out_msg += 'connected to game server with ' + self.game_peer
                    self.out_msg += '. game away!\n\n'
                    self.out_msg += '------------------------------------\n'
                    
                    self.state = S_GAMING
                    os.system('pic_client.py')

#==============================================================================
# Start chatting, 'bye' for quit
# This is event handling instate "S_CHATTING"
#==============================================================================
        elif self.state == S_CHATTING:
            if len(my_msg) > 0:     # my stuff going out
                #check condition and boolean to see whether encrypt or not
                if self.ecrp:
                    my_msg = C_encrypt(my_msg)
                mysend(self.s, json.dumps({"action":"exchange", "from":"[" + self.me + "]", "message":my_msg, "encrypt": self.ecrp }))
                if my_msg == 'bye':
                    self.disconnect()
                    self.state = S_LOGGEDIN
                    self.peer = ''
            if len(peer_msg) > 0:    # peer's stuff, coming in
                peer_msg = json.loads(peer_msg)
                if peer_msg["action"] == "exchange":
                    #if peer encrypt the message, you decrypt it,
                    #if not, we should just directly display the messsage
                    if peer_msg["encrypt"]:
                        peer_msg["message"] = C_decrypt(peer_msg["message"])
                if peer_msg['action'] == 'connect':
                    self.out_msg += peer_msg['from'] + ' joined\n'
                    self.askcrp()
                elif peer_msg['action'] == 'disconnect':
                    self.state = S_LOGGEDIN
                else:
                    self.out_msg += peer_msg["from"] + self.emoji_message(peer_msg["message"])
        elif self.state == S_GAMING:
            self.out_msg += "you have finish your game? welcome back.\n"
            self.state = S_LOGGEDIN
            self.out_msg += "\n"
            self.out_msg += menu
            
            if self.state == S_LOGGEDIN:
                self.out_msg += menu
#==============================================================================
# invalid state
#==============================================================================
        else:
            self.out_msg += 'How did you wind up here??\n'
            print_state(self.state)

        return self.out_msg
