#-*- coding:utf-8 -*-  
import socket
import config
s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
s.connect(config.gameServerAddr)
s.send('{"cmd":1, "user":"bdgame", "psw":"385wflwreifdew213", "zoneId":1}#')
s.send('{"cmd":0, "user":"bdgame", "psw":"385wflwreifdew213", "zoneId":1}#')
