# -*- coding: utf-8 -*-
from mod_python import util
from urllib import quote
import md5
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
		if not self._isValidInfo() :
			self._printError()
			return
		self._jumpGame()
		
	def _printError(self):
		self._req.content_type = 'text/html;charset=UTF-8;'
		self._req.write( '参数错误' )
		
	def _getUserInfo(self):
		fields = util.FieldStorage(self._req)
		self._user = str(fields.getfirst('username', '')) # username
		try:
			self._serverid = int(fields.getfirst('serverid', 0))
			self._time = int(fields.getfirst('time', 0))
			self._isadult = int(fields.getfirst('isadult', 0))
		except Exception, e:
			self._serverid = 0
			self._addgold = 0
			self._isadult = 0
		self._flag = str(fields.getfirst('flag', ''))

	def _isValidInfo(self):
		if not self._isValidServerId() or not self._isValidUserName() or not self._isValidSign():
			return False
		return True		
		
	def _isValidServerId(self):
		return self._serverid > 0
		
	def _isValidUserName(self):
		if len(self._user) < 2 or len(self._user) > 32 :
			return False
		if self._user.find('\'') >= 0 or self._user.find('\"') >= 0:
			return False
		return True
		
	def _isValidSign(self):
		s = self._user + str(self._serverid) + str(self._isadult) + str(self._time) + comm_config.keys['32wan']
		flag = md5.new(s).hexdigest().lower()
		#self._req.write(flag)
		return flag == self._flag
		
		
	def _jumpGame(self):
		factUrl = config.server_urls.get(str(self._serverid), None)
		if factUrl == None:
			self._printError()
			return 
		
		pf = '32wan'
		s = pf + str(self._serverid) + self._user + str(self._time) + comm_config.keys['32wan']
		pfkey = md5.new(s).hexdigest().lower()
		mirrorid = factUrl['mirrorid']
		url = factUrl['url'] + '/zone.py?mid=%d&pf=%s&serverid=%d&openid=%s&time=%d&pfkey=%s'%(mirrorid, pf, self._serverid, quote(self._user), self._time, pfkey)
		util.redirect(self._req, url)

def index(req):
	MySession(req).handle()
	return ''
	