# -*- coding: utf-8 -*-
from mod_python import util
import socket, md5
from urllib import quote
import config
import mycurl
import sys  
sys.path.append('..')  
import comm_config


class MySession:
	def __init__(self, req):
		self._req = req
		self._req.add_common_vars()
		self._getUserInfo()
	
	def handle(self):
		if not self._isValidIp() :
			self._req.write('-3') #没有权限
			return
			
		if not self._isValidInfo():
			self._req.write('-4') #校验错误
			return
			
		if self._fact == 0 :
			self._jumpFactUrl()
			return
			
		self._pay()
	
	def _getUserInfo(self):
		fields = util.FieldStorage(self._req)
		self._ip = self._req.subprocess_env.get('REMOTE_ADDR')
		self._user = str(fields.getfirst('passport', '')) # username
		try:
			self._serverid = int(fields.getfirst('serverid', 0))
			self._addgold = int(fields.getfirst('addgold', 0))
			self._rmb = int(fields.getfirst('rmb', 0))
			self._fact = int(fields.getfirst('fact', 0))
		except Exception, e:
			self._serverid = 0
			self._addgold = 0
			self._rmb = 0
			self._fact = 0
		self._orderno = str(fields.getfirst('orderno', ''))
		self._paytime = str(fields.getfirst('paytime', ''))
		self._sign = str(fields.getfirst('sign', ''))
		
	def _jumpFactUrl(self):
		factUrl = config.server_urls.get(str(self._serverid), None)
		if factUrl == None:
			self._req.write('-1')
			return 
		url = factUrl.get('url') + '/32wan/pay.py?fact=1&orderno=%s&passport=%s&serverid=%s&addgold=%s&rmb=%s&paytime=%s&sign=%s'%(self._orderno, quote(self._user), str(self._serverid), str(self._addgold), str(self._rmb), str(self._paytime), self._sign)
		self._req.write(mycurl.getUrlContent(url))
		
	def _isValidIp(self):
		return self._ip in config.pay_ips
		
	def _isValidInfo(self):
		s = self._orderno  + self._user + str(self._serverid) + str(self._addgold) + str(self._rmb) + self._paytime + comm_config.keys['game']
		sign = md5.new(s).hexdigest().lower()
		return sign == self._sign
		
	def _pay(self):
		s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		try:
			s.connect(("127.0.0.1", 9100))
			s.send('{"cmd":1,"user":"bdgame","psw":"385wflwreifdew213","zoneId":4000000}#')
			s.send('''{"cmd":6,"openid":"%s","zoneid":%d,"orderno":"%s","addgold":%d,"rmb":%d}#'''%(
				self._user, self._serverid, self._orderno, self._addgold, self._rmb) )
			ret = s.recv(1024)
			if ret != None and len(ret) > 1 and ret[-1:] == '#':
				ret = ret[:-1]
			s.close()
			self._req.write(ret)
		except Exception, e:
			self._req.write('-7') #游戏服务器繁忙

def index(req):
	MySession(req).handle()
	return ''
	