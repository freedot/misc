'''
. copy *.py to dst folder
'''
import glob, shutil, os
from publish_setcfg import *

need_copy_py_folders = ['qqsdk', 'cs', '32wan', 'os']
exclude_py_files = ['index.py'] # root folder filter
exclude_py_files_patterns = shutil.ignore_patterns('.svn', 'paytest.py') # sub folder filter

def _isExcludeFile(fileName):
	for excludeFile in exclude_py_files:
		if fileName.find(excludeFile) >= 0: return True
	return False

def publish():
	pys = glob.glob(os.path.join(src_base_path, '*.py') )
	for fileName in pys:
		if _isExcludeFile(fileName) : continue
		shutil.copy(fileName, to_base_path)
		
	def ignoref(p, files):
		return (f for f in files if _isExcludeFile(f) )
		
	for dir in need_copy_py_folders :
		to_dir = os.path.join(to_base_path, dir)
		src_dir = os.path.join(src_base_path, dir)
		if os.path.isdir(to_dir) : shutil.rmtree(to_dir)
		shutil.copytree(src_dir, to_dir, ignore = exclude_py_files_patterns)

if __name__ == '__main__':
	publish()
