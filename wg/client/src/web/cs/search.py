# -*- coding: utf-8 -*-
from mod_python import util
import time, cgi
import sqlite3 as sqlite
from comm import *

def search(req):
	req.add_common_vars()
	qq = req.form.getfirst('txtQQ')
	if qq == None:
		return None
	qq = escapeStr(qq)
	
	conn = sqlite.connect(request_db)
	conn.text_factory = str
	cu = conn.cursor()
	cu.execute( "SELECT * FROM request WHERE qq=? ORDER by id desc", (qq,) )
	results = cu.fetchall()
	conn.close()
	return results
	
def writeResult(req, results):
	#id title stype qq zone content rtime answer atime
	#0, 1       2,     3,  4,    5,         6,      7,         8
	if len(results) == 0:
		req.write( html_res.replace('##tabbar##', makeTabBar(2)).replace('##form##', html_search_form).replace('##result##', '*没有找到记录' ) )
		return
	allStr = ''
	for record in results:
		s = html_search_result_res
		s = s.replace('##title##', record[1] )
		s = s.replace('##content##', record[5] )
		s = s.replace('##rtime##', formatTime(record[6]) )
		s = s.replace('##atime##', formatTime(record[8]) )
		if record[7] != '':
			s = s.replace('##answer##', record[7] )
		else:
			s = s.replace('##answer##', '正在处理中，请耐心等待处理结果...' )
		allStr = allStr + s
	req.write( html_res.replace('##tabbar##', makeTabBar(2)).replace('##form##', html_search_form).replace('##result##', allStr ) )

def index(req):
	req.content_type = 'text/html;charset=UTF-8;'
	results = search(req)
	if results == None:
		req.write( html_res.replace('##tabbar##', makeTabBar(2)).replace('##form##', html_search_form).replace('##result##', '' ) )
	else :
		writeResult(req, results)
	return ''