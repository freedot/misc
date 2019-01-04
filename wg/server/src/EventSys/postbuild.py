import shutil
def copyfile(src, des):
	try:	
		shutil.copy(src, des)
	except:
		pass
		
copyfile(r'./libEventSys_d.so', r'../../lib/')
copyfile(r'./libEventSys.so', r'../../lib/')

copyfile(r'./libEventSys_d.so', r'../../../bin/')
copyfile(r'./libEventSys.so', r'../../../bin/')


