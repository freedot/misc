import shutil, platform
def copyfile(src, des):
	try:	
		shutil.copy(src, des)
	except:
		pass
		
if platform.system() == 'Windows':
	copyfile(r'./libluajit.a', r'../../lib/')
	copyfile(r'./lua51.dll', r'../../../bin/')
else:
	copyfile(r'./libluajit.so', r'../../lib/')
	copyfile(r'./libluajit.so', r'../../../bin/')
	copyfile(r'./libluajit.so', r'/usr/lib/libluajit.so')
	copyfile(r'./libluajit.so', r'/usr/lib/libluajit-5.1.so')
	copyfile(r'./libluajit.so', r'/usr/lib/libluajit-5.1.so.2')
	copyfile(r'./libluajit.so', r'/lib64/libluajit.so')
	copyfile(r'./libluajit.so', r'/lib64/libluajit-5.1.so')
	copyfile(r'./libluajit.so', r'/lib64/libluajit-5.1.so.2')



