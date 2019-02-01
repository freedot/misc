from mod_python import util
from mod_python import Session
import re,md5,time
	
class MySession:
	def __init__(self, req):
		self._req = req
		self._req.add_common_vars()
		self._session = Session.Session(self._req)
		
	def handle(self):
		if self._session.has_key('user'):
			del self._session['user']
			self._session.save()
		self._gotoPage()
		
	def _gotoPage(self):
		fields = util.FieldStorage(self._req)
		if str(fields.getfirst('act', '')) == 'index' :
			util.redirect(self._req,'index.py')

def index(req):
	return MySession(req).handle()
