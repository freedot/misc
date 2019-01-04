#-*- coding:utf-8 -*-  
from BaseHTTPServer import *
from qqsdk import *
import urllib, datetime
import config
from encrypt import *
from log import *
from UrlParamsParser import *
from G import *

g_validUrlPaths = ['/sandbox/pay', '/pay.py', '/cgi-bin/temp.py']

class HttpServerRequest:
	def __init__(self):
		self._paramsParser = UrlParamsParser()
		
	def handle(self, wfile, path):
		try:
			'''
			0: 成功
			1: 系统繁忙
			2: token已过期
			3: token不存在
			4: 请求参数错误：（这里填写错误的具体参数）
			'''
			LOG.dealSucc('<test_path>:%s'%path)
			if not self._checkSig(decrypt(config.appKey, config.commKey), path) or not self._hasParams():
				if path.find('/favicon.ico') != 0 :
					wfile.write('''{"ret":4,"msg":"请求参数错误：（sig）"}''')
					LOG.dealFail('<fail>:请求参数错误：（sig） %s'%path)
					self._sendToGameSvr(False)
				return
			
			params = self._paramsParser.getParams()
			token = params.get('token', '')
			if not G.getTokenStamp().hasToken(token):
				wfile.write('''{"ret":3,"msg":"token不存在"}''')
				LOG.dealFail('<fail>:token不存在 %s'%path)
				self._sendToGameSvr(False)
				return
				
			if G.getTokenStamp().tokenTimeout(token):
				wfile.write('''{"ret":2,"msg":"token已过期"}''')
				LOG.dealFail('<fail>:token已过期 %s'%path)
				G.getTokenStamp().clearToken(token)
				self._sendToGameSvr(False)
				return
			
			wfile.write('''{"ret":0,"msg":"OK"}''')
			LOG.dealSucc('<succ>:%s'%path)
			self._sendToGameSvr(True)
		except Exception, e:
			msg = 'exception occur.msg[%s], traceback[%s]' % (str(e), __import__('traceback').format_exc())
			print msg
			LOG.dealFail('<error> except :%s'%msg)
			
	def _checkSig(self, appkey, path):
		rt = self._paramsParser.parse(path)
		if rt == None:
			print 'check sig error 1'
			return False
			
		if rt['url_path'] not in g_validUrlPaths:
			print 'check sig error 2', rt['url_path']
			return False
			
		sig = rt['params'].pop('sig', None)
		if sig == None :
			print 'check sig error 3'
			return False
		
		nsig = pay_helper.hmac_sha1_sig('GET', rt['url_path'], rt['params'], appkey+'&')
		print nsig
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

class HttpServerHandler(BaseHTTPRequestHandler):  
	def __init__(self, request, client_address, server):
		self._serverRequest = HttpServerRequest()
		self.timeout = 5
		BaseHTTPRequestHandler.__init__(self, request, client_address, server)		
		
	def do_GET(self):  
		self._serverRequest.handle(self.wfile, self.path)
		
	def do_POST(self):
		print 'xxxxxx'
