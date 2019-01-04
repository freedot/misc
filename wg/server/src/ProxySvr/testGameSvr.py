#-*- coding:utf-8 -*-  
import socket, time
import config
s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
s.connect(config.gameServerAddr)
s.setblocking(0)
s.send('{"cmd":1, "user":"bdgame", "psw":"385wflwreifdew213", "zoneId":1}#')
s.send('{"cmd":3,"params":{"openid":"openid1","openkey":"openkey1","appid":"appid1","pf":"pf1","pfkey":"pfkey1","ts":"11223343","payitem":"5490001*5*2","goodsmeta":"10元宝*10元宝","goodsurl":"url","zoneid":"1"}}#')
'''
ss = '{"cmd":3,"params":{'
ss = ss + '"openid":"6E8A4F26FDD627126B11E489DD1DDFDB"'
ss = ss + ',"openkey":"6152AEA44F188DE8B03B30155B3170D8"'
ss = ss + ',"pfkey":"2b43f38e5c71c935bf4d39e8116a0f85"'
ss = ss + ',"appid":"1101114844"'
ss = ss + ',"pf":"pengyou"'
ss = ss + ',"ts":"' + str(int(time.time())) + '"'
ss = ss + ',"payitem":"5490001*10*1"'
ss = ss + ',"goodsmeta":"10元宝*10元宝"'
ss = ss + ',"goodsurl":"http://1251007151.cdn.myqcloud.com/1251007151/images/office/item/big/5490001.gif"'
ss = ss + ',"zoneid":"1"'
ss = ss + '}}#'
s.send(ss)
'''

t = 1
while t < 3:
	try:
		print s.recv(1024)
	except Exception, e:
		pass
	time.sleep(2)
	t = t + 1

