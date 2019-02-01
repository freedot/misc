# -*- coding: utf-8 -*-
from mod_python import util
import socket, md5
from urllib import quote
import config
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
			
		self._printUrl()
	
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
		
	def _isValidIp(self):
		return self._ip == '127.0.0.1'
		
	def _printUrl(self):
		s = self._orderno  + self._user + str(self._serverid) + str(self._addgold) + str(self._rmb) + self._paytime +  comm_config.keys['game']
		sign = md5.new(s).hexdigest().lower()
		url = '/32wan/pay.py?orderno=%s&passport=%s&serverid=%s&addgold=%s&rmb=%s&paytime=%s&sign=%s'%(self._orderno, quote(self._user), str(self._serverid), str(self._addgold), str(self._rmb), str(self._paytime), sign)
		self._req.write(url)

def index(req):
	MySession(req).handle()
	return ''
	