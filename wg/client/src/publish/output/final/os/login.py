# -*- coding: utf-8 -*-
from mod_python import util, Session
import time, cgi
import md5
from urllib import quote
from comm import *
from config import *

def writeLoginPage(req):
	req.content_type = 'text/html;charset=UTF-8;'
	req.write( html_res.replace('##form##', html_login_form).replace('##alert##', '') )
	
def writeLoginErrorPage(req):
	req.content_type = 'text/html;charset=UTF-8;'
	req.write( html_res.replace('##form##', html_login_form).replace('##alert##', 'alert("用户名或密码错误！");') )
	
def index(req):
	sess=Session.Session(req,timeout=3600)
	if not sess.is_new():sess.load()
		
	req.add_common_vars()
	username = req.form.getfirst('username', '')
	password = req.form.getfirst('password', '')
	if username == '' :
		writeLoginPage(req)
		return
	
	password = md5.new(password).hexdigest().lower()
	if user_pwds.get(username, '') != password :
		writeLoginErrorPage(req)
		return
	
	sess['user'] = username
	sess.save()
	
	util.redirect(req, './manager.py')	
	
if __name__ == "__main__":
    print md5.new('xxx').hexdigest().lower()
