# -*- coding: utf-8 -*-
from mod_python import util
import re, socket
import config
from urllib import quote
import mycurl

class MySession:
	def __init__(self, req):
		self._req = req
		self._req.add_common_vars()
		self._getUserInfo()
	
	def handle(self):
		if self._fact == 0 :
			self._jumpFactUrl()
			return
			
		if not self._isValidInfo() :
			self._req.write('-2') #参数错误
			return
		self._query()
		
	def _getUserInfo(self):
		fields = util.FieldStorage(self._req)
		self._username = str(fields.getfirst('username', '')) # username
		try:
			self._serverid = int(fields.getfirst('serverid', 0))
			self._fact = int(fields.getfirst('fact', 0))
		except Exception, e:
			self._serverid = 0
			self._fact = 0
			
	def _jumpFactUrl(self):
		factUrl = config.server_urls.get(str(self._serverid), None)
		if factUrl == None:
			self._printError()
			return 
		url = factUrl.get('url') + '/32wan/userexists.py?fact=1&serverid=%d&username=%s'%(self._serverid, quote(self._username))
		self._req.write(mycurl.getUrlContent(url))
	
	def _isValidInfo(self):
		if self._serverid <= 0 :
			return False
		if len(self._username) < 2 or len(self._username) > 32 :
			return False
		if self._username.find('\'') >= 0 or self._username.find('\"') >= 0:
			return False
		return True
			
	def _query(self):
		s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		try:
			s.connect(("127.0.0.1", 9100))
			s.send('{"cmd":1,"user":"bdgame","psw":"385wflwreifdew213","zoneId":3000000}#')
			s.send('{"cmd":5,"openid":"%s","zoneid":%d}#'%(self._username, self._serverid) )
			ret = s.recv(1024)
			if ret != None and len(ret) > 1 and ret[-1:] == '#':
				ret = ret[:-1]
			s.close()
			self._req.write(ret)
		except Exception, e:
			self._req.write('-3') #连接服务器错误

def index(req):
	MySession(req).handle()
	return ''
	