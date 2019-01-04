#-*- coding:utf-8 -*-  
import config
from G import *
from GameSvrServer import *

class MyGameServerStub:
	def __init__(self):
		self._isshutdown = False
		self._msg = ''
		self._zoneId = 0
	def shutdown(self):
		self._isshutdown = True
	def isShutdown(self):
		return self._isshutdown
	def sendMsg(self, zoneId, msg):
		self._msg = msg
		self._zoneId = zoneId
	def getMsg(self):
		return self._msg
	def getZoneId(self):
		return self._zoneId
		
class SocketStub:
	def setblocking(self, flag):
		pass
	def setsockopt(self, sol, so, buflen):
		pass
	def close(self):
		pass
		
		
class AssistServerStub:
	def __init__(self):
		self._isshutdown = False
	def shutdown(self):
		self._isshutdown = True
	def isShutdown(self):
		return self._isshutdown
		
class HttpServerStub:
	def __init__(self):
		self._isshutdown = False
	def shutdown(self):
		self._isshutdown = True
	def isShutdown(self):
		return self._isshutdown
		
def helper_setGameServer():
	myGameServer = MyGameServerStub()
	G.setGameServer(myGameServer)
	return myGameServer
	
def helper_setAssistServer():
	assistServer = AssistServerStub()
	G.setAssistServer(assistServer)
	return assistServer	
	
def helper_setHttpServer():
	httpServer = HttpServerStub()
	G.setHttpServer(httpServer)
	return httpServer	
	
def helper_connectSvr():
	s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
	s.connect(config.gameServerAddr)
	return s

def test_ClientMsgSender():
	gameSvr = helper_setGameServer()
	sender = ClientMsgSender(gameSvr)
	sender.sendDealMsg(zoneId=1, succ=True, openId='openid', token='token', payitem='20001*100*1')
	assert ( gameSvr.getZoneId() == 1 )
	assert ( gameSvr.getMsg() == '{cmd=110,ret=0,openid="openid",token="token",resid=20001,price=100,number=1}' )
	
	sender.sendDealMsg(zoneId=1, succ=False, openId='openid', token='token', payitem='20001*100*1')
	assert ( gameSvr.getZoneId() == 1 )
	assert ( gameSvr.getMsg() == '{cmd=110,ret=-1,openid="openid",token="token",resid=20001,price=100,number=1}' )
	
def test_GameSvrClient():
	import socket
	connection = SocketStub()
	client_address = {}
	inputs = []
	outputs = []
	gameSvrClt = GameSvrClient(connection, client_address, inputs, outputs)

	# safe stop server
	gameSvr = helper_setGameServer()
	assistSvr = helper_setAssistServer()
	gameSvrClt.handleMsg('{"cmd":0, "user":"bdgame", "psw":"385wflwreifdew213"}#')
	time.sleep( 1 )
	assert ( gameSvr.isShutdown() == True )
	assert ( assistSvr.isShutdown() == True )

	#release client
	assert ( inputs[0] == connection )
	gameSvrClt.release()
	assert ( len(outputs) == 0 )

def test_GameSvrServer():
	myGameServer = GameSvrServer(config.gameServerAddr)
	G.setGameServer(myGameServer)
	class GameSvrServerThread(threading.Thread):
		def run(self):
			G.getGameServer().serve_forever()
	GameSvrServerThread().start()
	
	try:
		# client gamesvr connect this server, error user
		s = helper_connectSvr()
		s.send('{"cmd":1, "user":"error", "psw":"385wflwreifdew213", "zoneId":100')
		s.send('0}#')
		time.sleep(1)
		assert ( myGameServer._getClientByZoneId(1000) == None )
		
		# client gamesvr connect this server, succ
		s = helper_connectSvr()
		s.send('{"cmd":1, "user":"bdgame", "psw":"385wflwreifdew213", "zoneId":100')
		s.send('0}#')
		time.sleep(1)
		client = myGameServer._getClientByZoneId(1000)
		assert ( client != None )
		
		# get buy_goods token fail
		s.send('{"cmd":3,"params":{"appid":100001,"pf":"qzone", "openid":"openid"}}#')
		time.sleep(1)
		assert ( s.recv(1024) == '{cmd=109,openid="openid",ret=1801,msg="sys error!"}#' )
		
		# get buy_goods token succ
		class OpenApiStub:
			def call(self, url, params, method):
				self._url = url
				self._params = params
				self._method = method
				return self._ret
			def setRet(self, ret):
				self._ret = ret
			def getUrl(self):
				return self._url
			def getParams(self):
				return self._params
			def getMethod(self):
				return self._method
		apiStub = OpenApiStub()
		apiStub.setRet({"ret":0, "url_params":"url_params", "token":"token"})
		client.setOpenApi(apiStub)
		cmd = '{"cmd":3,"params":{"appid":100001,"pf":"pengyou", "openid":"openid"}}'
		s.send(cmd + '#')
		time.sleep(1)
		assert ( s.recv(1024) == '{cmd=109,openid="openid",ret=0,url_params="url_params",token="token"}#' )
		assert ( G.getUserPlatform('openid') == 'pengyou' )
		assert ( G.getTokenStamp().hasToken('token') == True )
		assert ( apiStub.getUrl() == '/v3/pay/buy_goods' )
		assert ( apiStub.getParams() == eval(cmd)['params'] )
		assert ( apiStub.getMethod() == 'get' )
		
	finally:
		myGameServer.shutdown()
	
if __name__ == '__main__':
	test_ClientMsgSender()
	test_GameSvrClient()
	test_GameSvrServer()
	print 'run tesk ok'