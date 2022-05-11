import socket, threading
PORT = 5050
IP = socket.gethostbyname(socket.gethostname())
ADDR = (IP,PORT)
server = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
server.bind(ADDR)
conns = []
#reference: https://www.youtube.com/watch?v=_7jWx...
#pass the message to client
def handleclient(conn,addr):  
    conns.append(conn)
    if len(conns) >= 2:
        conns[0].send("drawer".encode("utf-8"))
        for x in conns[1:]:
            x.send("".encode("utf-8"))
    while True:
        msg = conn.recv(64)
        if msg:
            for x in conns:
                x.send(msg)
#giving thread to newly loggin client
def start():
    server.listen()
    print("SERVER LISTENING")
    while True:
        conn,addr = server.accept()
        threading.Thread(target=handleclient,args=(conn,addr)).start()
        print("CLIENT CONNECTED")
start()