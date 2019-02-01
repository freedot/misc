# -*- coding: utf-8 -*-
#
# v1.3
#
import base64, urllib
def safe_b64encode(s):
	try:
		s = base64.b64encode(s)
		print ( s )
		equalsign_count = 0
		for i in range(len(s)-1, -1, -1):
			if s[i] != '=': break
			equalsign_count = equalsign_count + 1
		s = str(equalsign_count) + s[0:len(s)-equalsign_count]
		s = s[::-1]
		tlen = len(s)
		slen = int(tlen/6)
		s = s[3*slen:4*slen] +  s[2*slen:3*slen] + s[5*slen:tlen] + s[1*slen:2*slen] + s[4*slen:5*slen] + s[0:slen]
		return urllib.quote(s)
	except Exception, e:
		return 'error'
	
def safe_b64decode(s):
	try:
		s = urllib.unquote(s)
		tlen = len(s)
		slen = int(tlen/6)
		leftlen = tlen - 5*slen
		s = s[tlen-1*slen:tlen] + s[tlen-3*slen:tlen-2*slen]  + s[1*slen:2*slen]  + s[0:slen] + s[tlen-2*slen:tlen-1*slen] + s[2*slen:2*slen+leftlen]
		s = s[::-1]
		equalsign_count = 0
		equalsign_count = int(s[0])
		s = s[1:len(s)]
		for i in range(equalsign_count):
			s = s + '='
		return base64.b64decode(s)
	except Exception, e:
		return 'error'
	
def parse_urlargs(urlargs):
	try:
		fields = {}
		pairs = urlargs.split('&')
		for p in pairs :
			ps = p.split('=')
			if len(ps) != 2 : continue
			fields[ps[0]] = ps[1]
		return fields
	except Exception, e:
		return {}
