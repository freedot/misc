import shutil
def copyfile(src, des):
	try:	
		shutil.copy(src, des)
	except:
		pass
		
copyfile(r'./libGameSys_d.so', r'../../lib/')
copyfile(r'./libGameSys.so', r'../../lib/')

copyfile(r'./libGameSys_d.so', r'../../../bin/')
copyfile(r'./libGameSys.so', r'../../../bin/')


