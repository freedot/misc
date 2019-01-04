#-*- coding:utf-8 -*-  
import time, threading
from qqsdk import *
from  log import *
from G import *
import config

class AssistServer:
	def __init__(self):
		self._msgs = []
		self._mutex = threading.Lock()
		self._openApi = None
		self._okrets = [0, 1069]
		self._needRepeatRets = [1062, 1099]
		self._shutdown_request = False
		self._is_shut_down = threading.Event()
		
	def serve_forever(self):
		self._is_shut_down.clear()
		try:
			while not self._shutdown_request or len(self._msgs) > 0 :
				self.handleMsgs()
				time.sleep(0.001)
		finally:
			self._shutdown_request = False
			self._is_shut_down.set()
		
	def shutdown(self):
		self._shutdown_request = True
		self._is_shut_down.wait()
		
	def setOpenApi(self, api):
		self._openApi = api
		
	def sendConfirmDeliveryMsg(self, params):
		self._mutex.acquire()
		self._msgs.append({'triggerTime':G.getTime() + 10, 'times':0, 'params':params})
		self._mutex.release()
		
	def getMsgs(self):
		return self._msgs
		
	def handleMsgs(self):
		self._mutex.acquire()
		#for msg in reversed(self._msgs):
		for i in range(len(self._msgs)-1, -1, -1):
			msg = self._msgs[i]
			if msg['triggerTime'] > G.getTime(): continue
			self._fillParams(msg['params'])
			retParams = self._openApi.call('/v3/pay/confirm_delivery', msg['params'], 'GET', 'https')
			ret = retParams.get('ret', -1)
			print ( 'delivery ret : ' + str(ret) )
			if ret in self._okrets :
				G.LOG().dealSucc('<delivery>openid:%s;billno:%s'%(msg['params'].get('openid', ''), msg['params'].get('billno', '')) )
				self._msgs.pop(i)
			elif (ret in self._needRepeatRets) and msg['times'] < 3:
				msg['times'] = msg['times'] + 1
				msg['triggerTime'] = G.getTime() + 2				
			else:
				G.LOG().dealFail('<delivery>openid:%s;billno:%s;ret:%s;msg:%s'%(msg['params'].get('openid', ''), msg['params'].get('billno', ''), str(ret), retParams.get('msg', 'unknow') ) )
				self._msgs.pop(i)
		self._mutex.release()
		
	def _fillParams(self, params):
		params['ts'] = G.getTime()
		params['appid'] = config.appId
		params['provide_errno'] = 0		
		