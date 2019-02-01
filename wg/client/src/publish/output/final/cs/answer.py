# -*- coding: utf-8 -*-
from mod_python import util
import time, cgi
import sqlite3 as sqlite
from comm import *

def selectbyId(id):
	conn = sqlite.connect(request_db)
	conn.text_factory = str
	cu = conn.cursor()
	cu.execute( "SELECT * FROM request WHERE id=?", (id,) )
	results = cu.fetchall()
	conn.close()
	return results
	
def answerToId(id, txt):
	conn = sqlite.connect(request_db)
	conn.text_factory = str
	cu = conn.cursor()
	cu.execute( "UPDATE request SET answer=?, atime=? WHERE id=?", (txt, int(time.time()), id,) )
	conn.commit()
	conn.close()
	
def index(req):
	req.add_common_vars()
	id = req.form.getfirst('id', '-1')
	act = req.form.getfirst('act', '')
	key = req.form.getfirst('key', '')
	if key != 'bdgamelangdetianxia' :
		return 'error!'
	
	#id title stype qq zone content rtime answer atime
	#0, 1       2,     3,  4,    5,         6,      7,         8
	req.content_type = 'text/html;charset=UTF-8;'
	req.write('<html><head><title>manage</title></head><body style="font-size:12px">')
	
	if act == 'submit' :
		txtContent = req.form.getfirst('txtContent', '')
		answerToId(id, txtContent)
		req.write('''
		<script language="javascript"  type="text/javascript"> window.close();</script>
		''')
	else:
		results = selectbyId(id)
		for r in results :
			req.write('标题:<b>' + r[1] + '</b><br/>' )
			req.write('类型:' + r[2] + ' | ' + 'qq:' + r[3] + ' | ' +  '君主:' + r[4] + ' | ' + '时间:' + formatTime( r[6]) + '<br/>')
			req.write('内容:<br/><b>' + r[5] + '</b><br/>' )
			req.write('''<form action="./answer.py?act=submit&id=%s&key=%s" method="post" >'''%(id,key) )
			req.write('''答复:<br/><textarea name="txtContent" rows="10" cols="50">%s</textarea><br/><br/>'''%r[7] )
			req.write('''<input type="submit" name="sub" value="提交">''' )
			req.write('</form>' )
			
	req.write('</body></html>')
