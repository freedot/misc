import shutil
def copyfile(src, des):
	try:	
		shutil.copy(src, des)
	except:
		pass
		
copyfile(r'./libTimeSys_d.so', r'../../lib/')
copyfile(r'./libTimeSys.so', r'../../lib/')


copyfile(r'./libTimeSys_d.so', r'../../../bin/')
copyfile(r'./libTimeSys.so', r'../../../bin/')