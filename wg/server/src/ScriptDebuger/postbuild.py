import shutil
def copyfile(src, des):
	try:	
		shutil.copy(src, des)
	except:
		pass
		
copyfile(r'./libScriptDebuger_d.so', r'../../lib/')
copyfile(r'./libScriptDebuger.so', r'../../lib/')

copyfile(r'./libScriptDebuger_d.so', r'../../../bin/')
copyfile(r'./libScriptDebuger.so', r'../../../bin/')


