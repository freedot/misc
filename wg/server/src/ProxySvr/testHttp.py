#-*- coding:utf-8 -*-  
import socket
import config
s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
s.connect(config.httpServerAddr)
s.send('GET /pay.py?openid=test001&appid=33758&ts=1328855301&payitem=323003*8*1&token=53227955F80B805B50FFB511E5AD51E025360&billno=-APPDJT18700-20120210-1428215572&version=v3&zoneid=1&providetype=0&amt=80&payamt_coins=20&pubacct_payamt_coins=10&sig=VvKwcaMqUNpKhx0XfCvOqPRiAnU%3D HTTP/1.1\n\n')
print s.recv(1024)
s.close()


