import shutil
def copyfile(src, des):
	try:	
		shutil.copy(src, des)
	except:
		pass
		
copyfile(r'./libDatabase_d.so', r'../../lib/')
copyfile(r'./libDatabase.so', r'../../lib/')

copyfile(r'./libDatabase_d.so', r'../../../bin/')
copyfile(r'./libDatabase.so', r'../../../bin/')


