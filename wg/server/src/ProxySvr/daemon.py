﻿#-*- coding:utf-8 -*-  
import os, platform
def createDaemon():
	if platform.system() != 'Linux' :
		return
		
	# create - fork 1
	try:
		if os.fork() > 0: 
			os._exit(0)
	except OSError, error:
		print 'fork #1 failed: %d (%s)' % (error.errno, error.strerror)
		os._exit(1)
		
	# it separates the son from the father
	# os.chdir('/')
	os.setsid()
	os.umask(0)
	
	# create - fork 2
	try:
		pid = os.fork()
		if pid > 0:
			print 'Daemon PID %d' % pid
			os._exit(0)
	except OSError, error:
		print 'fork #2 failed: %d (%s)' % (error.errno, error.strerror)
		os._exit(1)
		

