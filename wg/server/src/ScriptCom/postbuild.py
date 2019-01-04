import shutil
def copyfile(src, des):
	try:	
		shutil.copy(src, des)
	except:
		pass
		
copyfile(r'./libScriptCom_d.so', r'../../lib/')
copyfile(r'./libScriptCom.so', r'../../lib/')

copyfile(r'./libScriptCom_d.so', r'../../../bin/')
copyfile(r'./libScriptCom.so', r'../../../bin/')


