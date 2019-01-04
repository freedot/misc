import shutil
def copyfile(src, des):
	try:	
		shutil.copy(src, des)
	except:
		pass
		
copyfile(r'./libFileSys_d.so', r'../../lib/')
copyfile(r'./libFileSys.so', r'../../lib/')

copyfile(r'./libFileSys_d.so', r'../../../bin/')
copyfile(r'./libFileSys.so', r'../../../bin/')


