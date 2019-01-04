import shutil
def copyfile(src, des):
	try:	
		shutil.copy(src, des)
	except:
		pass
		
copyfile(r'./libLogSys.so', r'../../lib/')
copyfile(r'./libLogSys_d.so', r'../../lib/')

copyfile(r'./libLogSys.so', r'../../../bin/')
copyfile(r'./libLogSys_d.so', r'../../../bin/')

