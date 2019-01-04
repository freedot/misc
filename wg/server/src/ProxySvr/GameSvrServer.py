	#-*- coding:utf-8 -*-  
import config
import threading
import socket, select, time, urllib
from qqsdk import *
from encrypt import *
from G import *
from log import *
import urllib, datetime
from UrlParamsParser import *

class Orderno32Wan:
	def __init__(self):
		self._path = './32wan_new.orders'
		
	def log(self, orderno, user, addgold):
		f = open(self._path, 'a')
		f.write('orderno:%s,user:%s,addgold:%d\n'%(orderno, user, addgold))
		f.close()
WAN32LOG = Orderno32Wan()


# 游戏服务器发给当前服务器的协议号
SVR_CMD_SafeStop = 0
SVR_CMD_SetZoneId = 1
SVR_CMD_QueryGold = 2
SVR_CMD_GetBuyToken = 3
SVR_CMD_Req = 4
SVR_CMD_UserExist = 5
SVR_CMD_ImmPay = 6
SVR_CMD_UserExistResult = 7
SVR_CMD_ImmPayResult = 8
SVR_CMD_GM = 10
SVR_CMD_GMResult = 11

# 当前服务器发给游戏服务器的协议号
CLT_CMD_QueryGold = 108
CLT_CMD_GetBuyToken = 109
CLT_CMD_DealResult = 110
CLT_CMD_QueryUserExist = 114
CLT_CMD_DealResult32Wan = 115
CLT_CMD_OS_GM = 116

def JsonToString(dict):
	s = ''
	for k in dict:
		s = s + '\'' + k + '\':\'' + str(dict[k]) + '\','
	return '{' + s + '}'

def stopServer ():
	class StopServerThread(threading.Thread):
		def run(self):
			G.getAssistServer().shutdown()
			print 'assist server stoped!'
			G.getGameServer().shutdown()
			print 'game server stoped!'
	StopServerThread().start()

class ClientMsgSender:
	def __init__(self, server):
		self._server = server
		
	def sendDealMsg(self, zoneId, succ, openId, token, payitem):
		msg = '{cmd=' + str(CLT_CMD_DealResult)
		if succ : msg = msg + ',ret=0'
		elif not succ : msg = msg + ',ret=-1'
		msg = msg + ',openid="' + openId + '"'
		msg = msg + ',token="' + token + '"'
		iteminfo = payitem.split('*')
		msg = msg + ',resid=' + iteminfo[0] 
		msg = msg + ',price=' + iteminfo[1] 
		msg = msg + ',number=' + iteminfo[2] 
		msg = msg + '}'
		self._server.sendMsg(zoneId, msg)
		
	def sendQueryUserExistMsg(self, zoneId, clientId, openId):
		msg = '{cmd=' + str(CLT_CMD_QueryUserExist)
		msg = msg + ',clientid=' + str(clientId)
		msg = msg + ',openid="' + openId + '"'
		msg = msg + '}'
		self._server.sendMsg(zoneId, msg)
		
	def sendDealMsg32Wan(self, zoneId, clientId, openId, addgold, orderno):
		msg = '{cmd=' + str(CLT_CMD_DealResult32Wan)
		msg = msg + ',openid="' + openId + '"'
		msg = msg + ',clientid=' + str(clientId)
		msg = msg + ',addgold=' + str(addgold)
		msg = msg + ',orderno="' + str(orderno) + '"'
		msg = msg + '}'
		self._server.sendMsg(zoneId, msg)
		
	def sendGM(self, zoneId, clientId, t, gmmsg):
		msg = '{cmd=' + str(CLT_CMD_OS_GM)
		msg = msg + ',clientid=' + str(clientId)
		msg = msg + ',t="' + str(t) + '"'
		msg = msg + ',gmmsg=[[' + str(gmmsg) + ']]'
		msg = msg + '}'
		self._server.sendMsg(zoneId, msg)
		
class GameClientCmd:
	def __init__(self, svrClient):
		self._client = svrClient
		
class SafeStopServerCmd(GameClientCmd):
	def handle(self, pkg):
		user = pkg.get('user', '')
		psw = pkg.get('psw', '')
		if user == 'bdgame' and psw == '385wflwreifdew213' :
			stopServer()
		return True
			
class SetZoneIdCmd(GameClientCmd):
	def handle(self, pkg):
		zoneId = pkg.get('zoneId', '-1')
		user = pkg.get('user', '')
		psw = pkg.get('psw', '')
		if user != 'bdgame' or psw != '385wflwreifdew213' :
			return False
		print 'zoneId : ' + str(zoneId) + ', client connect ok!'
		self._client.setZoneId(int(zoneId))
		return True
		
class GetQueryGoldCmd(GameClientCmd):
	def handle(self, pkg):
		params = pkg.get('params', {})
		openid = params.get('openid', '')
		jdata = self._client.getOpenApi().call('/v3/pay/get_balance', params, 'get')
		if jdata.get('ret', -1) != 0 :
			self._client.pushSendMsg('{cmd=' + str(CLT_CMD_QueryGold) + ',openid="' + openid + '",ret=' + jdata.get('ret', -1) + ',msg="' + jdata.get('msg', '') + '"}')
		else:
			self._client.pushSendMsg('{cmd=' + str(CLT_CMD_QueryGold) + ',openid="' + openid + '",ret=0,gold=' + jdata.get('balance', 0) + '}')
		return True
		
class GetBuyGoodsTokenCmd(GameClientCmd):
	def handle(self, pkg):
		params = pkg.get('params', {})
		openid = params.get('openid', '')
		LOG.dealSucc('<gettoken> params:' + JsonToString(params))
		jdata = self._client.getOpenApi().call('/v3/pay/buy_goods', params, 'GET', 'https')
		if jdata.get('ret', -1) != 0 :
			self._client.pushSendMsg('{cmd=' + str(CLT_CMD_GetBuyToken) + ',openid="' + openid + '",ret=' + str(jdata.get('ret', -1)) + ',msg="' + jdata.get('msg', '') + '"}')
		else:
			self._client.pushSendMsg('{cmd=' + str(CLT_CMD_GetBuyToken) + ',openid="' + openid + '",ret=0,url_params="' + jdata.get('url_params', '') + '",token="' + jdata.get('token', '') + '"}')
			pf = params.get('pf', 'qzone')
			token =jdata.get('token', None)
			G.setUserPlatform(openid, pf)
			G.getTokenStamp().addToken(token)
		return True
		
class HttpRequestHandler:
	def __init__(self):
		self._paramsParser = UrlParamsParser()
		
	def handle(self, client, path):
		try:
			LOG.dealSucc('<test_path>:%s'%path)
			if not self._checkSig(decrypt(config.appKey, config.commKey), path) or not self._hasParams():
				if path.find('/favicon.ico') != 0 :
					client.pushSendMsg('''{"ret":4,"msg":"请求参数错误：（sig）"}''')
					LOG.dealFail('<fail>:请求参数错误：（sig） %s'%path)
					self._sendToGameSvr(False)
				return
			
			params = self._paramsParser.getParams()
			token = params.get('token', '')
			if not G.getTokenStamp().hasToken(token):
				client.pushSendMsg('''{"ret":3,"msg":"token不存在"}''')
				LOG.dealFail('<fail>:token不存在 %s'%path)
				self._sendToGameSvr(False)
				return
				
			if G.getTokenStamp().tokenTimeout(token):
				client.pushSendMsg('''{"ret":2,"msg":"token已过期"}''')
				LOG.dealFail('<fail>:token已过期 %s'%path)
				G.getTokenStamp().clearToken(token)
				self._sendToGameSvr(False)
				return
			
			client.pushSendMsg('''{"ret":0,"msg":"OK"}''')
			LOG.dealSucc('<succ>:%s'%path)
			self._sendToGameSvr(True)
		except Exception, e:
			msg = 'exception occur.msg[%s], traceback[%s]' % (str(e), __import__('traceback').format_exc())
			LOG.dealFail('<error> except :%s'%msg)
			client.pushSendMsg('''{"ret":4,"msg":"请求参数错误：（sig）"}''')
			
	def _checkSig(self, appkey, path):
		rt = self._paramsParser.parse(path)
		if rt == None:
			print 'check sig error 1'
			return False
			
		sig = rt['params'].pop('sig', None)
		if sig == None :
			print 'check sig error 2'
			return False
		
		nsig = pay_helper.hmac_sha1_sig('GET', rt['url_path'], rt['params'], appkey+'&')
		return ( urllib.unquote(sig) == nsig )
		
	def _hasParams(self):
		params = self._paramsParser.getParams()
		if params == None : return False
		if params.get('zoneid', -1) == -1 : return False
		if params.get('openid', '') == '' : return False
		if params.get('payitem', '') == '' : return False
		if params.get('token', '') == '' : return False
		return True
		
	def _sendToGameSvr(self, succ):
		if not self._hasParams() : 
			return 
		params = self._paramsParser.getParams()
		G.getGameServer().getSender().sendDealMsg(params['zoneid'], succ, params['openid'], params['token'], params['payitem'])
		if succ :
			openid =  params.get('openid', '0')
			deliveryParams = {
				'amt' : params.get('amt', '0'),
				'zoneid' : params.get('zoneid', '0'),
				'token_id' : params.get('token', '0'),
				'billno' : params.get('billno', '0'),
				'openid' : openid,
				'payamt_coins' : params.get('payamt_coins', '0'),
				'payitem' : params.get('payitem', '0*0*0'),
				'providetype' : params.get('providetype', '0'),
				'pubacct_payamt_coins' : params.get('pubacct_payamt_coins', '0'),
				'version' : params.get('version', '0'),
				'pf' : G.getUserPlatform(openid)
			}
			G.getAssistServer().sendConfirmDeliveryMsg(deliveryParams)
		
class HttpReqCmd(GameClientCmd):
	def __init__(self, svrClient):
		self._client = svrClient
		self._requestHandler = HttpRequestHandler()
		
	def handle(self, pkg):
		path = '/'
		try:
			path = pkg.get('path', '')
		except:
			pass
		self._requestHandler.handle(self._client, path)
		return True
		
class ReqUserExistCmd(GameClientCmd):
	def handle(self, pkg):
		zoneid = 0
		openid = ''
		try:
			zoneid = pkg.get('zoneid', 0)
			openid = pkg.get('openid', '')
		except:
			pass
			
		if zoneid <= 0 or openid == '' :
			self._client.pushSendMsg('-2') #参数错误
			return True
			
		zoneClient = G.getGameServer().getClientByZoneId(zoneid)
		if zoneClient == None :
			self._client.pushSendMsg('-2') #参数错误
			return True
			
		G.getGameServer().getSender().sendQueryUserExistMsg(zoneid, self._client.getId(), openid)
		return True
		
class UserExistResultCmd(GameClientCmd):
	def handle(self, pkg):
		ret = pkg.get('ret', -1)
		clientId = pkg.get('clientid', -1)
		client = G.getGameServer().getClientById(clientId)
		if client != None:
			client.pushSendMsg('%d'%ret)
		return True
		
class ImmPayCmd(GameClientCmd):
	def handle(self, pkg):
		zoneid = 0
		openid = ''
		orderno = ''
		addgold = 0
		rmb = 0
		try:
			zoneid = pkg.get('zoneid', 0)
			openid = pkg.get('openid', '')
			orderno = pkg.get('orderno', '')
			addgold = int(pkg.get('addgold', 0))
			rmb = pkg.get('rmb', 0)
		except:
			pass
			
		#maxGold = 10*rmb*3;
		#minGold = int(10*rmb/3);
		if zoneid <= 0 or openid == '' or orderno == '' or addgold <= 0 or rmb <= 0: # or rmb < minGold or rmb > maxGold : # or addgold != (10*rmb) :
			self._client.pushSendMsg('-1') #失败
			return True

		zoneClient = G.getGameServer().getClientByZoneId(zoneid)
		if zoneClient == None :
			self._client.pushSendMsg('-8') #不存在该频道
			return True
			
		WAN32LOG.log(orderno, openid, addgold)
		G.getGameServer().getSender().sendDealMsg32Wan(zoneid, self._client.getId(), openid, addgold, orderno)
		return True
		
class ImmPayResultCmd(UserExistResultCmd):
	pass
	
class GmCmd(GameClientCmd):
	def handle(self, pkg):
		zoneid = 0
		gmmsg = ''
		t = ''
		try:
			zoneid = int(pkg.get('zoneid', 0))
			gmmsg = pkg.get('gmmsg', '')
			t = pkg.get('t', '')
		except:
			pass
			
		if gmmsg == '' :
			self._client.pushSendMsg('{t:"%s",ret:-1,msg:"消息为空"}'%t)
			return True

		zoneClient = G.getGameServer().getClientByZoneId(zoneid)
		if zoneClient == None :
			self._client.pushSendMsg('{t:"%s",ret:-1,msg:"%.3d区不存在！"}'%(t,zoneid) )
			return True

		G.getGameServer().getSender().sendGM(zoneid, self._client.getId(), t, gmmsg)
		return True
		
class GmResultCmd(GameClientCmd):
	def handle(self, pkg):
		t = pkg.get('t', '')
		ret = pkg.get('ret', 0)
		msg = pkg.get('msg', '')
		clientId = pkg.get('clientid', -1)
		client = G.getGameServer().getClientById(clientId)
		if client != None:
			client.pushSendMsg('{t:"%s",ret:%d,msg:"%s"}'%(t,ret,msg))
		return True
		
_client_id_ = 1
class GameSvrClient:
	def __init__(self, connection, client_address, inputs, outputs):
		self._connection = connection
		self._client_address = client_address
		self._inputs = inputs
		self._outputs = outputs
		self._connection.setblocking(0)
		self._connection.setsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF, 102400);
		self._recvMsg = ''
		self._zoneId = -1
		global _client_id_
		_client_id_ = _client_id_ + 1
		if _client_id_ == 0xffffffff :
			_client_id_ = 1
		self._id = _client_id_
		self._sendMsgs = []
		self._inputs.append(self._connection)
		self._openApi = OpenAPIV3(config.appId, decrypt(config.appKey, config.commKey), config.qqIpLists)
		self._regCmds()
		
	def _regCmds(self):
		self._cmds = {}
		self._cmds[SVR_CMD_SafeStop] = SafeStopServerCmd(self)
		self._cmds[SVR_CMD_SetZoneId] = SetZoneIdCmd(self)
		self._cmds[SVR_CMD_QueryGold] = GetQueryGoldCmd(self)
		self._cmds[SVR_CMD_GetBuyToken] = GetBuyGoodsTokenCmd(self)
		self._cmds[SVR_CMD_Req] = HttpReqCmd(self)
		self._cmds[SVR_CMD_Req] = HttpReqCmd(self)
		self._cmds[SVR_CMD_UserExist] = ReqUserExistCmd(self)
		self._cmds[SVR_CMD_ImmPay] = ImmPayCmd(self)
		self._cmds[SVR_CMD_UserExistResult] = UserExistResultCmd(self)
		self._cmds[SVR_CMD_ImmPayResult] = ImmPayResultCmd(self)
		self._cmds[SVR_CMD_GM] = GmCmd(self)
		self._cmds[SVR_CMD_GMResult] = GmResultCmd(self)
		
	def getOpenApi(self):
		return self._openApi
		
	def setOpenApi(self, openApi):
		self._openApi = openApi
		
	def release(self):
		self._removeFromOutputs()
		self._inputs.remove(self._connection)
		self._connection.close()
		
	def handleMsg(self, msg):
		self._recvMsg = self._recvMsg + msg
		pkg = self._getNextPkg()
		while pkg != None:
			cmd = self._cmds.get(pkg.get('cmd', -1))
			if cmd == None: 
				print 'error cmd : ' + str(cmd)
				return False
			if not cmd.handle(pkg) :
				print 'handle failed'
				return False
			pkg = self._getNextPkg()
		return True
		
	def pushSendMsg(self, msg):
		if self._connection not in self._outputs:
			self._outputs.append(self._connection)
		self._sendMsgs.append(msg)
		
	def popSendMsg(self):
		if len(self._sendMsgs) <= 1 :
			self._removeFromOutputs()
		if len(self._sendMsgs) == 0 :
			return None
		return self._sendMsgs.pop(0)

	def getZoneId(self):
		return self._zoneId
		
	def setZoneId(self, zoneId):
		self._zoneId = zoneId
		
	def getId(self):
		return self._id
		
	def _removeFromOutputs(self):
		if self._connection in self._outputs:
			self._outputs.remove(self._connection)
			
	def _getNextPkg(self):
		pos = self._recvMsg.find('#')
		if pos < 0 : return None
		pkg = self._recvMsg[0:pos]
		self._recvMsg = self._recvMsg[pos+1:]
		try:
			return eval(pkg)
		except:
			print 'error pkg : ' + pkg
			return {}		
		
class GameSvrServer:
	def __init__(self, serverAddr):
		try :
			socket.setdefaulttimeout(0.001)
			self._socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
			self._socket.setblocking(False)
			self._socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR  , 1)
			self._socket.bind(serverAddr)
			self._socket.listen(5)
			self._clients = {}
			self._inputs = [self._socket]
			self._outputs = []
			self._mutex = threading.Lock()
			self._sendMsgs = []
			self._sender = ClientMsgSender(self)
			self._shutdown_request = False
			self._is_shut_down = threading.Event()
		except:
			print 'init game server failed!'
	
	def getSender(self):
		return self._sender
		
	def sendMsg(self, zoneId, msg):
		self._mutex.acquire()
		self._sendMsgs.append((zoneId, msg))
		self._mutex.release()
		
	def serve_forever(self, timeout=0.001):
		self._is_shut_down.clear()
		try:
			while not self._shutdown_request:
				self._handleSendMsgs()
				readable , writable , exceptional = select.select(self._inputs, self._outputs, self._inputs, timeout)
				if not (readable or writable or exceptional) :
					continue
					
				for s in readable :
					if s is self._socket:
						connection, client_address = s.accept()
						self._clients[connection] = GameSvrClient(connection, client_address, self._inputs, self._outputs)
						continue
					try:
						data = s.recv(102400)
						if data == '' or not self._clients.get(s).handleMsg(data) :
							self._closeClient(s)
					except:
						self._closeClient(s)
							
				for s in writable:
					gameClient = self._clients.get(s)
					if gameClient == None : continue
					msg = gameClient.popSendMsg()
					if msg != None : s.send(msg + '#')
						
				for s in exceptional:
					self._closeClient(s)
		finally:
			self._shutdown_request = False
			self._is_shut_down.set()
			self._socket.close()
			
	def shutdown(self):
		self._shutdown_request = True
		self._is_shut_down.wait()
		
	def _closeClient(self, s):
		print 'client close!'
		client = self._clients.get(s)
		if client == None : 
			return
		client.release()
		del self._clients[s]
		
	def _handleSendMsgs(self):
		self._mutex.acquire()
		if len(self._sendMsgs) == 0 :
			self._mutex.release()
			return
			
		for msgNode in self._sendMsgs:
			client = self.getClientByZoneId(msgNode[0])
			if client != None:
				client.pushSendMsg(msgNode[1])
		self._sendMsgs = []
		self._mutex.release()
		
	def getClientByZoneId(self, zoneId):
		for k in self._clients:
			client = self._clients.get(k)
			if client == None: continue
			if client.getZoneId() == int(zoneId) :
				return client
		return None
		
	def getClientById (self, clientId):
		for k in self._clients:
			client = self._clients.get(k)
			if client == None: continue
			if client.getId() == clientId :
				return client
		return None
		
	def hasOrderNo ( self, orderno):
		return True
