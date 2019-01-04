#-*- coding:utf-8 -*-  
import platform

httpServerAddr = ("127.0.0.1", 9001)
if platform.system() == 'Linux' :
	print 'Linux'
	httpServerAddr = ("10.232.24.60", 9002)
	
gameServerAddr = ("127.0.0.1", 9100)

commKey = '589fgjsk5239rq32'
appKey = 'F36F10C5B74353A92D63F0AF7074778C849CB3E4'
appId = 1101114844
qqIpLists = ('openapi.tencentyun.com',)
#qqIpLists = ('119.147.19.43',)
