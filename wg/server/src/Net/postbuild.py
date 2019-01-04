import shutil
def copyfile(src, des):
	try:	
		shutil.copy(src, des)
	except:
		pass
		
copyfile(r'../IpHelper.h', r'../../include/')
copyfile(r'../NetIO.h', r'../../include/')
copyfile(r'../DataProcessor.h', r'../../include/')
copyfile(r'../Messager.h', r'../../include/')
copyfile(r'../Socket.h', r'../../include/')
copyfile(r'./libNet.a', r'../../lib/')
copyfile(r'./libNet_d.a', r'../../lib/')

