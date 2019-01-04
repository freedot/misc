import platform
import shutil
def copyfile(src, des):
	try:
		shutil.copy(src, des)
	except:
		pass
	
# for windows
if platform.system() != 'Linux' :	
	copyfile(r'./cgame.pyd', r'C:/Python25/DLLs/')



