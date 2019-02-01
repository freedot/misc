# -*- coding: utf-8 -*-
from mod_python import util
import socket

def index(req):
	s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	s.connect(("127.0.0.1", 9100))
	s.send('{"cmd":1, "user":"bdgame", "psw":"385wflwreifdew213", "zoneId":2000000}#')
	s.send('{"cmd":4, "path":"%s"}#'%req.unparsed_uri )
	ret = s.recv(1024)
	if ret != None and len(ret) > 1 and ret[-1:] == '#':
		ret = ret[:-1]
	s.close()
	req.write(ret)
