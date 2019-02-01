# -*- coding: utf-8 -*-
from mod_python import util, Session
import socket, datetime
from comm import *
from config import *

class Log:
	def _log(self, file, s):
		now = datetime.datetime.now()
		f = open(file, 'a')
		f.write('[%s] %s\r\n'%(now.strftime('%Y-%m-%d %H:%M:%S'), s))
		f.close( )
		
	def log(self, s):
		self._log(r'e:\log.txt', s)
		
LOG = Log()

def writeNoLoginPage(req):
	req.content_type = 'text/html;charset=UTF-8;'
	req.write( 'error! no login' )
	
def makeZoneList():
	selectzone = '<select name="zoneid" id="zoneid">'
	for zoneId in zone_ids:
		selectzone = selectzone + '<option value="%d">%.3d区</option>' %(zoneId, zoneId)
	selectzone = selectzone + '</select>'
	return selectzone
	
def writeManagerPage(req):
	req.content_type = 'text/html;charset=UTF-8;'
	manager_form = html_manager_form.replace('##selectzone##', makeZoneList())
	req.write( html_res.replace('##form##', manager_form).replace('##alert##', '') )

class CmdHandler:
	def __init__(self, t):
		self._type = t
		
	def handle(self, req, zoneid):
		msg = req.form.getfirst('msg', '').replace('\"', '\'')
		gmmsg = self._getCmdName()
		if msg != '' :
			gmmsg = gmmsg + ' ' + msg
		ret = self._sendGmCmd(zoneid, gmmsg)
		return ret
		
	def _getCmdName(self):
		return self._type
		
	def _sendGmCmd(self, zoneid, gmmsg):
		s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		try:
			s.settimeout(5)
			s.connect(("127.0.0.1", 9100))
			s.send('{"cmd":1,"user":"bdgame","psw":"385wflwreifdew213","zoneId":5000000}#')
			s.send('''{"cmd":10,"zoneid":%s,"t":"%s","gmmsg":"%s"}#'''%(zoneid, self._type, gmmsg) )
			ret = s.recv(102400)
			if ret != None and len(ret) > 1 and ret[-1:] == '#':
				ret = ret[:-1]
			s.close()
			return ret
		except Exception, e:
			return 'error'

g_invalidcmds = [
	'send_sysmsg',
	'send_other_mail',
	'get_onlines',
	'startserver',
	'getserverstat',
	'lockuser',
	
	'callbackallarmys',
	'giveupallfields',
	'movegrids',
	
	'collectplayers1',
	'collectplayers2',
	'collectplayers3',
	'collectplayers4',
	'collectplayers5',
	
	'showpkgitems',
	'subpkgitems1',
	'subpkgitems2',
]
	
def index(req):
	sess=Session.Session(req,timeout=3600)
	if not sess.is_new():sess.load()
	if sess.get('user', '') == '':
		writeNoLoginPage(req)
		return ''
	req.add_common_vars()
	t = req.form.getfirst('t', '')
	if t != '' and (t in g_invalidcmds):
		hdr = CmdHandler(t)
		if hdr != None:
			zoneid = req.form.getfirst('zoneid', '0')
			return hdr.handle(req, zoneid)
		return ''
	
	writeManagerPage(req)
	return ''
