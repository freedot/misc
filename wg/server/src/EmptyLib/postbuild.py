import shutil, platform
def copyfile(src, des):
	try:	
		shutil.copy(src, des)
	except:
		pass
		
if platform.system() == 'Windows':
	pass
else:
	copyfile(r'./libEmptyLib.a', r'../lib/libws2_32.a')



