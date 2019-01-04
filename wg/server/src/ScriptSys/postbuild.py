import shutil
def copyfile(src, des):
	try:	
		shutil.copy(src, des)
	except:
		pass
		
copyfile(r'./libScriptSys_d.so', r'../../lib/')
copyfile(r'./libScriptSys.so', r'../../lib/')

# publish to bin
copyfile(r'./libScriptSys_d.so', r'../../../bin/')
copyfile(r'./libScriptSys.so', r'../../../bin/')



