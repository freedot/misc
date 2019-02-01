# -*- coding: utf-8 -*-
from mod_python import util
import time, cgi
import sqlite3 as sqlite
from comm import *

def selectall():
	conn = sqlite.connect(request_db)
	conn.text_factory = str
	cu = conn.cursor()
	cu.execute( "SELECT * FROM request ORDER by id desc" )
	results = cu.fetchall()
	conn.close()
	return results
	
def index(req):
	req.add_common_vars()
	key = req.form.getfirst('key', '')
	if key != 'bdgamelangdetianxia':
		return 'error!'
	#id title stype qq zone content rtime answer atime
	#0, 1       2,     3,  4,    5,         6,      7,         8
	req.content_type = 'text/html;charset=UTF-8;'
	req.write('<html><head><title>manage</title></head><body style="font-size:12px">')
	results = selectall()
	for r in results :
		req.write('标题:<b>' + r[1] + '</b><br/>' )
		req.write('类型:' + r[2] + ' | ' + 'qq:' + r[3] + ' | ' +  '君主:' + r[4] + ' | ' + '时间:' + formatTime( r[6]) + '<br/>')
		req.write('内容:<br/><b>' + r[5] + '</b><br/>' )
		req.write(('<a href="answer.py?id=%d&key=%s" target="_blank">答复</a>:'%(r[0],key)) + r[7] + '<br/><br/>' )
		req.write('<hr/>' )
	req.write('</body></html>')
