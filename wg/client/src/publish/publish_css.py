'''
. create css.py to dst folder
'''
import filesVerMgr, dictfile, os
from publish_setcfg import *

src_css_py = os.path.join(src_base_path, 'css.py')
to_css_py = os.path.join(to_base_path, 'css.py')

def createCssPyFileToDstFolder(css_list): # -> css.py
	verMgr = filesVerMgr.FilesVerMgr(lastfilesver_path)
	to_css_list = []
	for cssfile in css_list:
		to_css_list.append(cssfile + '?v=' + str(verMgr.getVer(cssfile)))
	dictfile.save(to_css_py, to_css_list, 'css_list')

def publish():
	css_list = dictfile.load(src_css_py, 'css_list')
	createCssPyFileToDstFolder(css_list)
	
if __name__ == '__main__':
	publish()
