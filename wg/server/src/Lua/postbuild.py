import shutil
def copyfile(src, des):
	try:	
		shutil.copy(src, des)
	except:
		pass
		
copyfile(r'./libLua_d.a', r'../../lib/')
copyfile(r'./libLua.a', r'../../lib/')


