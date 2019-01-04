#-*- coding:utf-8 -*-  
import log
import time
import threading

class TokenStamps:
	def __init__(self):
		self._stamps = {}
		self._mutex = threading.Lock()
		self._timeOut = 15*60

	def addToken(self, token):
		self._mutex.acquire()
		self._stamps[token] = time.time()
		self._mutex.release()
		
	def hasToken(self, token):
		self._mutex.acquire()
		t = self._stamps.get(token, None)
		self._mutex.release()
		return t != None
		
	def tokenTimeout(self, token):
		self._mutex.acquire()
		t = self._stamps.get(token, None)
		self._mutex.release()
		if t == None : return False
		return (time.time() - t) > self._timeOut
			
	def clearToken(self, token):
		self._mutex.acquire()
		self._stamps[token] = None
		self._mutex.release()

	# only for unit test call
	def setTokenStamp(self, token, time_): 
		self._mutex.acquire()
		self._stamps[token] = time_
		self._mutex.release()
		
class __g:
	def __init__(self):
		self._usersPlatform = {}
		self._usersPlatform_mutex = threading.Lock()
		self._tokenStamp = TokenStamps()
		
	def setLOG(self, log):
		self._log = log
	def LOG(self):
		return self._log
		
	def setTimeObj(self, t):
		self._time = t
	def getTime(self):
		return int(self._time.time())
		
	def setGameServer(self, gameServer):
		self._gameServer = gameServer
	def setAssistServer(self, assistServer):
		self._assistServer = assistServer
		
	def getGameServer(self):
		return self._gameServer
	def getAssistServer(self):
		return self._assistServer
		
	def setUserPlatform(self, openid, pf):
		self._usersPlatform_mutex.acquire()
		self._usersPlatform[openid] = pf
		self._usersPlatform_mutex.release()
		
	def getUserPlatform(self, openid):
		self._usersPlatform_mutex.acquire()
		pf = self._usersPlatform.get(openid, 'qzone')
		self._usersPlatform_mutex.release()
		return pf
		
	def getTokenStamp(self):
		return self._tokenStamp
		
G = __g();
G.setLOG(log.Log())
G.setTimeObj(time)
