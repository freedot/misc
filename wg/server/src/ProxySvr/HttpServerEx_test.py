#-*- coding:utf-8 -*-  
from HttpServerEx import *
from GameSvrServer import *
import time

class MyGameServerStub:
	def __init__(self):
		self._msg = ''
		self._sender = ClientMsgSender(self)
	def getSender(self):
		return self._sender
	def getMsg(self):
		return self._msg
	def sendMsg(self, zoneid, msg):
		self._msg = msg
		
class AssistServerStub:
	def __init__(self):
		self._msgs = []
	def sendConfirmDeliveryMsg(self, params):
		self._msgs.append({'triggerTime':int(time.time() + 10), 'times':0, 'params':params})
	def getMsgs(self):
		return self._msgs
		
class ReqStreamStub:
	def __init__(self) : self._s = ''
	def write(self, s) : self._s = self._s + s
	def get(self) : return self._s

def helper_setGameServer():
	myGameServer = MyGameServerStub()
	G.setGameServer(myGameServer)
	return myGameServer
	
def helper_setAssistServer():
	assistServer = AssistServerStub()
	G.setAssistServer(assistServer)
	return assistServer
	
def test_HttpServerRequestErrorSig():
	myGameServer = helper_setGameServer()
	assistServer = helper_setAssistServer()
	path = '''/cgi-bin/temp.py?openid=test001&appid=33758&ts=1328855301&payitem=323003*8*1&token=53227955F80B805B50FFB511E5AD51E025360&billno=-APPDJT18700-20120210-1428215572&version=v3&zoneid=1&providetype=0&amt=80&payamt_coins=20&pubacct_payamt_coins=10&sig=8DwfHxc8gsa57uGIRVUuu763UY0%3A'''
	request = HttpServerRequest()
	reqstream = ReqStreamStub()
	request.handle(reqstream, path)
	assert ( reqstream.get() == '{"ret":4,"msg":"请求参数错误：（sig）"}')
	expectStr = '{cmd=110,ret=-1,openid="test001",token="53227955F80B805B50FFB511E5AD51E025360",resid=323003,price=8,number=1}'
	assert ( myGameServer.getMsg() == expectStr )
	assert ( len(assistServer.getMsgs()) == 0 )
	
def test_HttpServerRequestHasNotToken():
	myGameServer = helper_setGameServer()
	assistServer = helper_setAssistServer()
	path = '''/cgi-bin/temp.py?openid=test001&appid=33758&ts=1328855301&payitem=323003*8*1&token=53227955F80B805B50FFB511E5AD51E025360&billno=-APPDJT18700-20120210-1428215572&version=v3&zoneid=1&providetype=0&amt=80&payamt_coins=20&pubacct_payamt_coins=10&sig=8DwfHxc8gsa57uGIRVUuu763UY0%3D'''
	request = HttpServerRequest()
	reqstream = ReqStreamStub()
	request.handle(reqstream, path)
	assert ( reqstream.get() == '{"ret":3,"msg":"token不存在"}')
	
def test_HttpServerRequestTokenTimeout():
	G.getTokenStamp().setTokenStamp('53227955F80B805B50FFB511E5AD51E025360', time.time() - (15*60 + 1) )
	myGameServer = helper_setGameServer()
	assistServer = helper_setAssistServer()
	path = '''/cgi-bin/temp.py?openid=test001&appid=33758&ts=1328855301&payitem=323003*8*1&token=53227955F80B805B50FFB511E5AD51E025360&billno=-APPDJT18700-20120210-1428215572&version=v3&zoneid=1&providetype=0&amt=80&payamt_coins=20&pubacct_payamt_coins=10&sig=8DwfHxc8gsa57uGIRVUuu763UY0%3D'''
	request = HttpServerRequest()
	reqstream = ReqStreamStub()
	request.handle(reqstream, path)
	assert ( reqstream.get() == '{"ret":2,"msg":"token已过期"}')
	
	
def test_HttpServerRequestSucc():
	G.getTokenStamp().setTokenStamp('53227955F80B805B50FFB511E5AD51E025360', time.time() )
	myGameServer = helper_setGameServer()
	assistServer = helper_setAssistServer()
	#path = '''/cgi-bin/temp.py?openid=test001&appid=33758&ts=1328855301&payitem=323003*8*1&token=53227955F80B805B50FFB511E5AD51E025360&billno=-APPDJT18700-20120210-1428215572&version=v3&zoneid=1&providetype=0&amt=80&payamt_coins=20&pubacct_payamt_coins=10&sig=8DwfHxc8gsa57uGIRVUuu763UY0%3D'''
	path = '''/pay.py?openid=test001&appid=33758&ts=1328855301&payitem=323003*8*1&token=53227955F80B805B50FFB511E5AD51E025360&billno=-APPDJT18700-20120210-1428215572&version=v3&zoneid=1&providetype=0&amt=80&payamt_coins=20&pubacct_payamt_coins=10&sig=kpDT/Us9yY3kGxa4AJ10q/f6Yss%3D'''
	request = HttpServerRequest()
	reqstream = ReqStreamStub()
	request.handle(reqstream, path)
	assert ( reqstream.get() == '{"ret":0,"msg":"OK"}')
	assert ( myGameServer.getMsg() == '{cmd=110,ret=0,openid="test001",token="53227955F80B805B50FFB511E5AD51E025360",resid=323003,price=8,number=1}' )
	assert ( len(assistServer.getMsgs()) == 1 )
	assistMsgNode = assistServer.getMsgs()[0]
	assert ( assistMsgNode['triggerTime'] == int(time.time() + 10) )
	assert ( assistMsgNode['times'] == 0 )
	assert ( assistMsgNode['params']['zoneid'] == '1' )
	assert ( assistMsgNode['params']['token_id'] == '53227955F80B805B50FFB511E5AD51E025360' )
	assert ( assistMsgNode['params']['amt'] == '80' )
	assert ( assistMsgNode['params']['billno'] == '-APPDJT18700-20120210-1428215572' )
	assert ( assistMsgNode['params']['openid'] == 'test001' )
	assert ( assistMsgNode['params']['payamt_coins'] == '20' )
	assert ( assistMsgNode['params']['payitem'] == '323003*8*1' )
	assert ( assistMsgNode['params']['providetype'] == '0' )
	assert ( assistMsgNode['params']['pubacct_payamt_coins'] == '10' )
	assert ( assistMsgNode['params']['version'] == 'v3' )
	
if __name__ == '__main__':
	test_HttpServerRequestErrorSig()
	test_HttpServerRequestHasNotToken()
	test_HttpServerRequestTokenTimeout()
	test_HttpServerRequestSucc()
	print 'run tesk ok'