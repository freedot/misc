# -*- coding: utf-8 -*-
from mod_python import util
import re

def printContent(req):
	req.write('''
<div class=login>
<form method="post" id="formLogin" name="formLogin" action="index.py?act=login" >
<div class=login_ab>
<div class=login_username><input tabindex=1 maxlength=16 type=text name="Username" id="Username" ></div>
<div class=login_password><input tabindex=2 maxlength=16 type=password name="Password" id="Password" ></div>
<div class=login_conform>
<input type="submit" tabindex="5" value="login" class="btn" id="login_button">
</div>
</div>
</form>
</div>''')
	
def login(req):
	req.add_common_vars()
	password = req.form.getfirst('Password', '')
	if password != '123456' :
		return False
		
	username = req.form.getfirst('Username', '')
	if re.match('^test[0-9]{1,5}$', username) == None:
		return False
	
	util.redirect(req, 'zone.py?serverid=1&openid=' + username + '&openkey=123456&pf=bdtest')
	return True
	
def printHead(req):
	req.content_type = 'text/html;charset=UTF-8;'
	req.write('''<html><head><title>index</title></head><body onload="document.formLogin.Username.focus();">''')
	
def printFoot(req):
	req.write('''</body></html>''')
	
def printHtmlWithAlert(req):
	printHead(req)
	printContent(req)
	req.write('''<script language="JavaScript">alert ( "password or username error!" ); </script>''')
	printFoot(req)
	
def printHtml(req):
	printHead(req)
	printContent(req)
	printFoot(req)

def index(req):
	form = util.FieldStorage(req)
	act = req.form.getfirst('act')
	if act == 'login':
		if not login(req) : printHtmlWithAlert(req)
	else:
		printHtml(req)