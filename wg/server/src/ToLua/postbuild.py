import shutil, platform
def copyfile(src, des):
	try:	
		shutil.copy(src, des)
	except:
		pass
		
if platform.system() == 'Windows':
	copyfile(r'./libtolua.a', r'../lib/')
	copyfile(r'./libtolua.so', r'../../bin/')
else:
	copyfile(r'./libtolua.so', r'../lib/')
	copyfile(r'./libtolua.so', r'../../bin/')
	copyfile(r'./libtolua.so', r'/usr/lib/libtolua.so')
	copyfile(r'./libtolua.so', r'/lib64/libtolua.so')
