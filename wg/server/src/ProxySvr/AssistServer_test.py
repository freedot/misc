#-*- coding:utf-8 -*-  
from AssistServer import *
from G import *
import config

class TimeOjbStub:
	def __init__(self):
		self._time = 0
	def time(self):
		return self._time
	def setTime(self, t):
		self._time = t
		
class LogStub:
	def __init__(self):
		self._msg = {'dealSucc':[], 'dealFail':[]}
	def dealSucc(self, s):
		self._msg['dealSucc'].append(s)
	def dealFail(self, s):
		self._msg['dealFail'].append(s)
	def getMsgs(self):
		return self._msg
	def clear(self):
		self._msg = {'dealSucc':[], 'dealFail':[]}
		
g_timeObj = TimeOjbStub()		
g_logObj = LogStub()		
G.setTimeObj(g_timeObj)
G.setLOG(g_logObj)

class OpenApiStub:
	def __init__(self):
		self._ret = {'ret':-1}
	def call(self, url, params, method):
		self._url = url
		self._params = params
		self._method = method
		return self._ret
	def getUrl(self):
		return self._url
	def getParams(self):
		return self._params
	def getMethod(self):
		return self._method	
	def setRet(self, ret):
		self._ret = ret
		
def test_shutdown():
	assistServer = AssistServer()
	class AssistThread(threading.Thread):
		def run(self):
			openApi = OpenApiStub()
			openApi.setRet({'ret':0, 'is_lost':0, 'msg':'OK'})  
			assistServer.setOpenApi(openApi)
			assistServer.serve_forever()
	AssistThread().start()
	g_timeObj.setTime(1)
	assistServer.sendConfirmDeliveryMsg({'zoneid':'1','openid':'2','billno':'3'})
	g_timeObj.setTime(11)
	assistServer.shutdown()

def test_sendConfirmDeliveryMsg():
	assistServer = AssistServer()
	assistServer.sendConfirmDeliveryMsg({'zoneid':'1'})
	assert ( len(assistServer.getMsgs()) == 1 )
	assistMsgNode = assistServer.getMsgs()[0]
	assert ( assistMsgNode['triggerTime'] == G.getTime() + 10 )
	assert ( assistMsgNode['times'] == 0 )
	assert ( assistMsgNode['params']['zoneid'] == '1' )
	
def test_handleMsgs():
	g_logObj.clear()
	assistServer = AssistServer()
	openApi = OpenApiStub()
	assistServer.setOpenApi(openApi)
	g_timeObj.setTime(1)
	assistServer.sendConfirmDeliveryMsg({'zoneid':'1'})
	assistServer.handleMsgs()
	assistMsgNode = assistServer.getMsgs()[0]
	assert ( assistMsgNode['times'] == 0 )
	g_timeObj.setTime(10)
	assistServer.handleMsgs()
	assistMsgNode = assistServer.getMsgs()[0]
	assert ( assistMsgNode['times'] == 0 )
	g_timeObj.setTime(11)
	assistServer.handleMsgs()
	assert ( openApi.getUrl() == 'v3/pay/confirm_delivery' )
	assert ( openApi.getMethod() == 'get' )
	assert ( openApi.getParams()['zoneid'] == '1' )
	assert ( openApi.getParams()['ts'] == G.getTime() )
	assert ( openApi.getParams()['appid'] == config.appId )
	assert ( openApi.getParams()['provide_errno'] == 0 )
	
def test_handleMsgs_oneTimesOk(ret):
	g_logObj.clear()
	assistServer = AssistServer()
	openApi = OpenApiStub()
	openApi.setRet({'ret':ret, 'is_lost':0, 'msg':'OK'})  
	assistServer.setOpenApi(openApi)
	g_timeObj.setTime(1)
	assistServer.sendConfirmDeliveryMsg({'zoneid':'1','openid':'2','billno':'3'})
	assistServer.sendConfirmDeliveryMsg({'zoneid':'2','openid':'3','billno':'4'})
	g_timeObj.setTime(11)
	assistServer.sendConfirmDeliveryMsg({'zoneid':'3','openid':'4','billno':'5'})
	assistServer.handleMsgs()
	assert( len(assistServer.getMsgs()) == 1 )
	assert( len(g_logObj.getMsgs()['dealSucc']) == 2 )
	assert( g_logObj.getMsgs()['dealSucc'][0] == '<delivery>openid:3;billno:4' )
	assert( g_logObj.getMsgs()['dealSucc'][1] == '<delivery>openid:2;billno:3' )
	
def test_handleMsgs_oneTimesFailed_canNotRepeat(ret):
	g_logObj.clear()
	assistServer = AssistServer()
	openApi = OpenApiStub()
	openApi.setRet({'ret':ret, 'is_lost':0, 'msg':'error'+str(ret)})
	assistServer.setOpenApi(openApi)
	g_timeObj.setTime(1)
	assistServer.sendConfirmDeliveryMsg({'zoneid':'1','openid':'2','billno':'3'})
	g_timeObj.setTime(11)
	assistServer.handleMsgs()
	assert( len(assistServer.getMsgs()) == 0 )
	assert( len(g_logObj.getMsgs()['dealSucc']) == 0 )
	assert( len(g_logObj.getMsgs()['dealFail']) == 1 )
	assert( g_logObj.getMsgs()['dealFail'][0] == '<delivery>openid:2;billno:3;ret:%s;msg:%s'%(str(ret), 'error' + str(ret)) )
	
def test_handleMsgs_repeatThreeTimesFailed(ret):
	g_logObj.clear()
	assistServer = AssistServer()
	openApi = OpenApiStub()
	openApi.setRet({'ret':ret, 'is_lost':0, 'msg':'error'+str(ret)})
	assistServer.setOpenApi(openApi)
	g_timeObj.setTime(1)
	assistServer.sendConfirmDeliveryMsg({'zoneid':'1','openid':'2','billno':'3'})
	g_timeObj.setTime(11)
	assistServer.handleMsgs()
	assert ( len(assistServer.getMsgs()) == 1 )
	assert ( assistServer.getMsgs()[0]['times'] == 1 )
	assert ( assistServer.getMsgs()[0]['triggerTime'] == G.getTime() + 2 )
	assert ( len(g_logObj.getMsgs()['dealSucc']) == 0 )
	assert ( len(g_logObj.getMsgs()['dealFail']) == 0 )
	g_timeObj.setTime(12)
	assistServer.handleMsgs()
	assert ( assistServer.getMsgs()[0]['times'] == 1 )
	g_timeObj.setTime(13)
	assistServer.handleMsgs()
	assert ( assistServer.getMsgs()[0]['times'] == 2 )
	g_timeObj.setTime(15)
	assistServer.handleMsgs()
	assert ( assistServer.getMsgs()[0]['times'] == 3 )
	g_timeObj.setTime(17)
	assistServer.handleMsgs()
	assert ( len(assistServer.getMsgs()) == 0 )
	assert( len(g_logObj.getMsgs()['dealSucc']) == 0 )
	assert( len(g_logObj.getMsgs()['dealFail']) == 1 )
	assert( g_logObj.getMsgs()['dealFail'][0] == '<delivery>openid:2;billno:3;ret:%s;msg:%s'%(str(ret), 'error' + str(ret)) )
	
if __name__ == '__main__':
	test_sendConfirmDeliveryMsg()
	test_shutdown()
	test_handleMsgs()
	test_handleMsgs_oneTimesOk(0)
	test_handleMsgs_oneTimesOk(1069)# 1069 交易已成功结束，通知过晚（已扣款）
	test_handleMsgs_oneTimesFailed_canNotRepeat(1001) #请求参数错误
	test_handleMsgs_oneTimesFailed_canNotRepeat(1059) #TOKEN超时
	test_handleMsgs_oneTimesFailed_canNotRepeat(1060) #订单已回滚
	test_handleMsgs_oneTimesFailed_canNotRepeat(1063) #订单不存在
	test_handleMsgs_oneTimesFailed_canNotRepeat(1068) #交易已失败结束，通知过晚（未扣款）
	test_handleMsgs_repeatThreeTimesFailed(1062) #通知过早订单尚未挂起，请稍候再试
	test_handleMsgs_repeatThreeTimesFailed(1099) #系统繁忙，请稍候再试
	print 'run tesk ok'