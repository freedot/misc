import shutil
def copyfile(src, des):
	try:	
		shutil.copy(src, des)
	except:
		pass
		
copyfile(r'./libUpdateSys_d.so', r'../../lib/')
copyfile(r'./libUpdateSys.so', r'../../lib/')

copyfile(r'./libUpdateSys_d.so', r'../../../bin/')
copyfile(r'./libUpdateSys.so', r'../../../bin/')


