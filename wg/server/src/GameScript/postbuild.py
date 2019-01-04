import shutil
def copyfile(src, des):
	try:	
		shutil.copy(src, des)
	except:
		pass
		
copyfile(r'./libGameScript_d.so', r'../../lib/')
copyfile(r'./libGameScript.so', r'../../lib/')

#publish to script
copyfile(r'./luaut.dll', r'../../../data/script/')

#publish to bin
copyfile(r'./libGameScript_d.so', r'../../../bin/')
copyfile(r'./libGameScript.so', r'../../../bin/')


