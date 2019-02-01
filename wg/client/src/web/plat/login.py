from mod_python import util
from mod_python import Session
import re,md5,time
from mybase64 import *

import sys, os
sys.path.append(os.path.dirname(__file__))
import userdb
from register import *
Register.reg('UserDB', userdb.UserDB())


sys.path.append(os.path.dirname(__file__) + r'/..')
import comm_config
from game_db import *
g_gameDB = GameDB()

	
class MySession:
	def __init__(self, req):
		self._req = req
		self._req.add_common_vars()
		self._session = Session.Session(self._req)
		
	def handle(self):
		self._parseArgs()
		
		if self._act == 'loginbind' :
			if not self._checkValid() : 
				return '{ret:-1, msg:"用户名或密码错误！"}'
			
			g_gameDB.connect(self._serverid)
			ret = self._canBind()
			if ret != 0 : 
				g_gameDB.close()
				return '{ret:' + str(ret) + ', msg:"绑定错误，该用户名已经在游戏中！"}'
			
			self._bindUser()
			self._saveSession()
			g_gameDB.close()
			return '{ret:0, msg:"绑定成功！"}'
		else :
			if not self._checkValid() :
				self._gotoPage('error')
			else :
				self._saveSession()
				self._gotoPage('ok')
		return ''
		
	def _parseArgs(self):
		self._user = str(self._req.form.getfirst('Username', ''))
		self._psw = str(self._req.form.getfirst('Password', ''))
		self._psw = md5.new(self._psw).hexdigest().lower()
		fields = util.FieldStorage(self._req)
		self._act = str(fields.getfirst('act', '')) 
		msg = str(fields.getfirst('msg', ''))
		msgfields = parse_urlargs(msg)
		if self._act == '': 
			self._act = msgfields.get('act', '')
		if self._act == 'loginbind':
			self._user = msgfields.get('user', '')
			self._psw = msgfields.get('psw', '')
			self._psw = md5.new(self._psw).hexdigest().lower()
			self._guestUser = msgfields.get('guestuser', '')
			self._serverid = msgfields.get('serverid', '')
			self._guestSign = msgfields.get('guestsign', '')
		
	def _checkValid(self):
		if re.match(r'^[\w]{3,16}$', self._user) == None:
			return False
		return Register.get('UserDB').checkUserPsw(self._user, self._psw)
		
	def _canBind(self):
		# check guestsign
		s = self._guestUser + self._serverid + comm_config.keys['game']
		guestsign = md5.new(s).hexdigest().lower()
		if guestsign != self._guestSign : return -2
		
		# check self._guestUser is exist
		if not g_gameDB.isGuestExit(self._guestUser) : return -3
		
		# check isbinded 
		if g_gameDB.isBinded(self._user) : return -4
		
		# check current user is in game
		if g_gameDB.isInGame(self._user) : return -5
		
		return 0
		
	def _bindUser(self):
		g_gameDB.bindGuestName(self._user, self._guestUser)
		
	def _gotoPage(self, ret):
		if self._act == 'index' :
			util.redirect(self._req,'index.py?login=' + ret)
			
	def _saveSession(self):
		self._session['user'] = self._user
		self._session.save()

def index(req):
	return MySession(req).handle()
