import shutil
def copyfile(src, des):
	try:	
		shutil.copy(src, des)
	except:
		pass
		
copyfile(r'./libGameSvr_d.a', r'../../lib/')
copyfile(r'./libGameSvr.a', r'../../lib/')

copyfile(r'./libGameSvr_luaut_d.a', r'../../lib/')
copyfile(r'./libGameSvr_luaut.a', r'../../lib/')

# publish to bin
copyfile(r'./GameSvr_d.exe', r'../../../bin/')
copyfile(r'./GameSvr.exe', r'../../../bin/')

