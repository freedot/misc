# -*- coding: utf-8 -*-

game_urls = {
	'kzsg':r'http://localhost:8899/game/index.py'
}

import comm_html_res

html_res = {
'body_frame' : r'''
 <div class="game-box">
  <iframe id="gameFrame" class="gameFrame" src="${gameurl}?${loginargs}" frameborder="0"></iframe>
 </div>
'''
}

from mod_python import util
from mod_python import Session
import re,md5,time
import config
	
class MySession:
	def __init__(self, req):
		self._req = req
		self._req.add_common_vars()
		self._session = Session.Session(self._req)
		self._guest = '*Guest*'
		self._user = self._session.get('user', self._guest)
		
	def handle(self):
		self._printHtml()
		return ''
		
	def _printHtml(self):
		self._req.content_type = 'text/html;charset=UTF-8;'
		html = comm_html_res.MainFrame(self._req, self._user).make()
		
		html = html.replace('${pagebody}', html_res['body_frame'])
		html = html.replace('${loginargs}', self._makeLoginArgs())
		html = html.replace('${gameurl}', game_urls['kzsg'])
		
		self._req.write(html)
		
	def _makeLoginArgs(self):
		key = config.keys['kzsg']
		stamp = str(int(time.time()))
		s = self._user + stamp + key
		sign = md5.new(s).hexdigest().lower()
		return 'user=%s&stamp=%s&sign=%s' % (self._user, stamp, sign)

def index(req):
	return MySession(req).handle()
