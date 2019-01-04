#-*- coding:utf-8 -*-  
import datetime

class Log:
	def log(self, file, s):
		now = datetime.datetime.now()
		f = open(file, 'a')
		f.write('[%s] %s\n'%(now.strftime('%Y-%m-%d %H:%M:%S'), s))
		f.close( )
		
	def dealSucc(self, s):
		self.log('./log/deal_succ.log', s)
		
	def dealFail(self, s):
		self.log('./log/deal_fail.log', s)
LOG = Log()
