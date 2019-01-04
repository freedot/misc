import glob
import shutil
def copyfile(src, des):
	try:	
		shutil.copy(src, des)
	except:
		print 'error: ' + src + ' -> ' + des
		pass

todir = r'../../game/bin/'
for fname in glob.glob(r'../bin/*.so'):
	copyfile(fname, todir)
for fname in glob.glob(r'../bin/*.exe'):
	copyfile(fname, todir)
#for fname in glob.glob(r'../bin/*.xml'):
#	copyfile(fname, todir)
