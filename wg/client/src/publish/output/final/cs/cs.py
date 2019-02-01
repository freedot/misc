# -*- coding: utf-8 -*-
from mod_python import util
import time, cgi
import sqlite3 as sqlite
from comm import *

def saveRequest(req):
	req.add_common_vars()
	title = req.form.getfirst('txtTitle')
	stype = req.form.getfirst('sType')
	qq = req.form.getfirst('txtQQ')
	zone = req.form.getfirst('txtZone')
	content = req.form.getfirst('txtContent')
	if title == None or stype == None or qq == None or zone == None or content == None:
		return False
	
	conn = sqlite.connect(request_db)
	conn.text_factory = str
	cu = conn.cursor()
	try:
		cu.execute('CREATE TABLE request (id integer primary key autoincrement, title text, stype text, qq text, zone text, content text, rtime integer, answer text, atime integer)')
		conn.commit()
	except:
		pass
	cu.execute('INSERT INTO request VALUES (null,?,?,?,?,?,?,?,?)', 
		(escapeStr(title), escapeStr(stype), escapeStr(qq), escapeStr(zone), escapeStr(content), int(time.time()), '', 0, ))
	conn.commit()
	conn.close()
	
	return True
	
def index(req):
	req.content_type = 'text/html;charset=UTF-8;'
	if saveRequest(req) :
		req.write( html_commit_ok_res );
	else:
		req.write( html_res.replace('##tabbar##', makeTabBar(1)).replace('##form##', html_cs_form).replace('##result##', '' ) )
	return ''