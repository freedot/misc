import shutil
def copyfile(src, des):
	try:	
		shutil.copy(src, des)
	except:
		pass
# publish to bin
copyfile(r'./Connect_d.exe', r'../../../bin/')
copyfile(r'./Connect.exe', r'../../../bin/')

