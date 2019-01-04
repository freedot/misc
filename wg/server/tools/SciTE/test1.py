import sys
import math
from introspect import *
sys.ps1 = '>>>'
sys.ps2 = '...'
import __main__
globs = locs = __main__.__dict__

def cb(a,b):
	pass
	

class ba:
	def fun_b(self, d, f):
		pass
		

class test(ba):
	class ccc:
		def ccc_fun(self, c):
			pass
			
	def fun1(self,a,b):
		pass
	
	def fun2(self,a,b,c):
		def cb(a,b,c):
			pass
	def fun3(self, a):
		pass
		
a = test()
a.fun2(1,2,3)

print getAutoCompleteList('test.ccc', globs, 0, 0, 0)
print getCallTip('test.ccc.ccc_fun', globs)
print getCallTip('cb', globs)
print getCallTip('math.cos', globs)


#1. look up
# is self, look up the class name , and continue look up to parent 
# last class_name1.class_name2.class_name3....
#





