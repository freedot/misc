import shutil
def copyfile(src, des):
	try:	
		shutil.copy(src, des)
	except:
		pass
		
copyfile(r'./libtinyxml_d.a', r'../../lib/')
copyfile(r'./libtinyxml.a', r'../../lib/')


