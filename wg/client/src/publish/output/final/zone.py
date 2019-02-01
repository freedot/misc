# -*- coding: utf-8 -*-
from mod_python import util
from zone_html import *
from encrypt import *
import zone_config
import re, random, time, datetime
from css import *
from js import *
import gm
import specuser
import md5
import comm_config
from game_db import *
from mybase64 import *

class Log:
	def log(self, file, s):
		now = datetime.datetime.now()
		f = open(file, 'a')
		f.write('[%s] %s\r\n'%(now.strftime('%Y-%m-%d %H:%M:%S'), s))
		f.close( )
LOG = Log()
g_gameDB = GameDB()

class BrowserChecker:
	def isIE6(self, req):
		return self._isSpecVerIE(req, 6.0 + 1)

	def _isSpecVerIE(self, req, maxVer):
		userAgent = req.subprocess_env.get('HTTP_USER_AGENT')
		if userAgent == None : 
			req.write('no find HTTP_USER_AGENT')
			return False
		
		p = re.compile(r'MSIE( )(\d+(\.\d+)?)')
		s = p.search(userAgent)
		if s == None : return False
		
		strver = s.group(2)
		if strver == None: return False
		
		try:
			ver = float(strver)
			if ver < maxVer: return True
		except:
			pass
		return False

class MySession:
	def __init__(self, req):
		self._guest = '*Guest*'
		self._debug = zone_config.is_debug
		self._req = req
		self._req.add_common_vars()
		self._bdbrowser = 0
		self._orginUser = ''
		self._qqMembership = {
			'is_yellow_vip' : 0
			,'is_yellow_year_vip' : 0
			,'yellow_vip_level' : 0
			,'is_yellow_high_vip' : 0
			,'is_blue_vip' : 0
			,'is_blue_year_vip' : 0
			,'blue_vip_level' : 0
			,'is_super_blue_vip' : 0
			,'_3366_grow_level' : 0
		}
		
		self._zone_config = {
			'zoneid' : zone_config.zoneid
			,'payZoneId' : zone_config.payZoneId
			,'url' : zone_config.url
			,'port' : zone_config.port
			,'proxy' : {'type':zone_config.proxy['type'], 'url':zone_config.proxy['url'] }
		}
		
		self._getUserInfo()
	
	def handle(self):
		if not self._checkUserValid() :
			self._printError()
			return
			
		#if not self._debug:
		#	self._req.content_type = 'text/html;charset=UTF-8;'
		#	self._req.write( html_res['login_stopserver'] )
		#	return
		
		notifyMsg = specuser.find(self._userId)
		if notifyMsg != '' :
			self._printNotify(notifyMsg)
			return
			
		self._pageHead()
		self._req.write( html_body_res[ 'for_scrollbar' ] )
		self._req.write( html_body_res[ 'game_body' ] )
		self._createLogout()
		self._createGameObject()
		self._writeGuestInfo()
		self._pageFoot()
		
	def _printNotify(self, msg):
		self._req.content_type = 'text/html;charset=UTF-8;'
		self._req.write( html_res['login_notify']%msg )
		
	def _getUserInfo(self):
		fields = util.FieldStorage(self._req)
		data = str(fields.get('data', ''))
		if data != '': fields = parse_urlargs(safe_b64decode(data))
		
		try:
			self._time = int(fields.get('time', 0))
			self._serverid = int(fields.get('serverid', 0))
		except Exception, e:
			self._time = 0
			self._serverid = 0
			
		g_gameDB.connect(self._serverid)
		self._openId = str(fields.get('openid', '')) # username
		#handle guest
		self._orginUser = self._openId
		if self._isGuest() :
			self._openId = g_gameDB.createGuestUser()
		else :
			self._openId = g_gameDB.getMapName(self._openId)
			
		self._userId = self._openId
		self._openKey = str(fields.get('openkey', ''))
		self._pfKey = str(fields.get('pfkey', ''))
			
		try:
			self._mirrorId = int(fields.get('mid', 0))
		except Exception, e:
			self._mirrorId = self._serverid
			
		self._platForm = { 
				'pf':str(fields.get('pf', ''))
				,'openid':self._openId
				,'openkey':str(fields.get('openkey', ''))
				,'pfkey':str(fields.get('pfkey', ''))
				,'appid':str(zone_config.appId)
			}
		
	def _checkUserValid(self):
		if self._debug and ( self._platForm.get('pf', '') == 'bdtest' or self._platForm.get('pf', '') == 'qzone' or self._platForm.get('pf', '') == '3366'):
			self._qqMembership = {
				'is_yellow_vip' : 1
				,'is_yellow_year_vip' : 1
				,'yellow_vip_level' :4
				,'is_yellow_high_vip' : 1
				,'is_blue_vip' : 1
				,'is_blue_year_vip' : 1
				,'blue_vip_level' : 5
				,'is_super_blue_vip' : 1
				,'_3366_grow_level' : 6
			}
			return True
		
		if gm.isGm(self._userId):
			self._userId = gm.spyUserId(self._userId)
			self._debug = True
		
		if self._platForm.get('pf', '') == '32wan' :
			self._changeCfgFor32Wan()
			return self._check32WanValid()
			
		if self._platForm.get('pf', '') == 'game' :
			self._changeCfgForGame()
			return self._checkGameValid()
			
		if re.match('^([0-9A-F]{32})$', self._openId) == None:
			return False
		if self._openKey == '':
			return False
			
		import qqsdk
		api = qqsdk.OpenAPIV3(zone_config.appId, self._getAppKey(), zone_config.qqIpLists)
		jdata2 = api.call('/v3/user/get_info', {
			'pf': self._platForm.get('pf', ''),
			'openid': self._openId,
			'openkey': self._openKey
		})
		
		self._qqMembership = {
			'is_yellow_vip' : jdata2.get('is_yellow_vip', 0)
			,'is_yellow_year_vip' : jdata2.get('is_yellow_year_vip', 0)
			,'yellow_vip_level' : jdata2.get('yellow_vip_level', 0)
			,'is_yellow_high_vip' : jdata2.get('is_yellow_high_vip', 0)
			,'is_blue_vip' : jdata2.get('is_blue_vip', 0)
			,'is_blue_year_vip' : jdata2.get('is_blue_year_vip', 0)
			,'blue_vip_level' : jdata2.get('blue_vip_level', 0)
			,'is_super_blue_vip' : jdata2.get('is_super_blue_vip', 0)
			,'_3366_grow_level' : jdata2.get('3366_grow_level', 0)
		}
		
		return jdata2.get('ret', -1) == 0
		
	def _changeCfgFor32Wan(self):
		if self._mirrorId == 0 :
			url = zone_config.url_base_32wan
		else:
			url = zone_config.url_32wan%self._mirrorId
		port = 8000 + self._serverid
		self._zone_config['zoneid'] = self._serverid
		self._zone_config['payZoneId'] = self._serverid
		self._zone_config['url'] = url
		self._zone_config['port'] = port
		self._zone_config['proxy'] = {'type':'TGW', 'url':url + ':' + str(port) }
		
	def _check32WanValid(self):
		s = self._platForm.get('pf', '') + str(self._serverid) + self._orginUser + str(self._time) + comm_config.keys['32wan']
		pfkey = md5.new(s).hexdigest().lower()
		return pfkey == self._pfKey
		
	def _changeCfgForGame(self):
		pass
		#if self._mirrorId == 0 :
		#	url = zone_config.url_base_32wan
		#else:
		#	url = zone_config.url_32wan%self._mirrorId
		#port = 8000 + self._serverid
		#self._zone_config['zoneid'] = self._serverid
		#self._zone_config['payZoneId'] = self._serverid
		#self._zone_config['url'] = url
		#self._zone_config['port'] = port
		#self._zone_config['proxy'] = {'type':'NONE', 'url':url + ':' + str(port) }
		
	def _checkGameValid(self):
		s = self._platForm.get('pf', '') + str(self._serverid) + self._orginUser + str(self._time) + comm_config.keys['game']
		pfkey = md5.new(s).hexdigest().lower()
		if pfkey != self._pfKey : return False
		return time.time() < self._time + 30*60;
		
	def _pageHead(self):
		self._req.content_type = 'text/html;charset=UTF-8;'
		self._req.write( html_res['html_start_tag'] )
		self._req.write( html_res['head_start_tag'] )
		self._req.write( html_res['title'] )
		self._req.write( html_res['shortcut_icon'] )
		self._req.write( html_res['head_meta'] )
		
		self._req.write( html_res['image_base_url']%zone_config.image_base_url )
		self._req.write( html_res['debug_flag'] )
		self._req.write( html_res['util_id_asccomp'] )
		self._req.write( html_res['util_log'] )
		
		if BrowserChecker().isIE6(self._req) : 
			self._req.write( html_res['fix_ie6_bugs'] )
		
		for jsFile in js_list:
			self._req.write( html_res['js_script_tmp']%jsFile )
		
		for cssFile in css_list:
			self._req.write( html_res['css_script_tmp']%cssFile )
			
		fusionPlatForm = self._platForm.get('pf', '')
		if fusionPlatForm == '' or fusionPlatForm == 'bdtest' :
			fusionPlatForm = 'bdgame'
			
		self._req.write( html_res['global_info']%(self._zone_config['payZoneId'], fusionPlatForm, zone_config.appId) )	
		
		if self._platForm.get('pf', '') == 'pengyou' or self._platForm.get('pf', '') == 'qzone':
			self._req.write( html_res['fusion2_api']%(zone_config.appId, fusionPlatForm) )
		elif self._platForm.get('pf', '') == '3366' :
			self._req.write( html_res['3366_api'] )
			
		self._req.write( html_res['socket_object'] )			
		
		self._req.write( html_res['leave_page'] )
		self._req.write( html_res['head_end_tag'] )
		
		self._req.write( html_res['body_start_tag'] )
		self._req.write( html_res['socket_object_alter'] )
		self._req.write( html_res['loading'] )
		
	def _createLogout(self):
		if self._debug :
			self._req.write( html_body_res[ 'for_debug' ] )
	
	def _createGameObject(self):
		self._req.write( html_body_res[ 'loading_object' ]%(self._zone_config['url'], self._zone_config['port'], self._zone_config['proxy']['type'], self._zone_config['proxy']['url'], self._createSig()) )
		if self._debug:
			self._req.write( '''<script>/* %s */</script>'''%(self._makeFlatForm()) )
		
	def _createSig(self):
		curtm = int(time.time())
		newsig = '{cmd=51,user="%s",zoneid=%d,stamp=%d,bd=%d,platform=%s,qqmembership=%s}'%(self._userId, self._zone_config['zoneid'], curtm, self._bdbrowser, self._makeFlatForm(), self._makeQQMembership())
		return encrypt(newsig, self._getLoginKey())
		
	def _writeGuestInfo(self):
		if not self._isGuest() : 
			self._req.write( '''<script>g_isguest = false;</script>''' )
			return
		
		s = self._userId + str(self._serverid) + comm_config.keys['game']
		guestsign = md5.new(s).hexdigest().lower()
		
		self._req.write( '''<script>
		g_isguest = true;
		g_guestuser = '%s';
		g_serverid = '%s';
		g_guestsign = '%s';
		</script>'''%(self._userId, str(self._serverid), guestsign) )
		
	def _isGuest(self):
		return self._orginUser == self._guest
		
	def _pageFoot(self):
		self._req.write( html_res['body_end_tag'] )
		self._req.write( html_res['html_end_tag'] )
		
	def _printError(self):
		self._req.content_type = 'text/html;charset=UTF-8;'
		self._req.write( html_res['login_error'] )
		
	def _getAppKey(self):
		return decrypt(zone_config.appKey, zone_config.keyForKey)
		
	def _getLoginKey(self):
		return decrypt(zone_config.loginKey, zone_config.keyForKey)
		
	def _makeFlatForm(self):
		return self._makeDictStr(self._platForm)
		
	def _makeQQMembership(self):
		return self._makeDictStr(self._qqMembership)
		
	def _makeDictStr(self, dict):
		s = ''
		for key in dict:
			val = dict[key]
			if type(val) == type('') :
				s = s + key + '="' + str(dict[key]) + '",'
			else:
				s = s + key + '=' + str(dict[key]) + ','
		return '{' + s + '}'
		
def index(req):
	MySession(req).handle()
	g_gameDB.close()
	return ''
