import os, re, platform

svn_tool = 'E:/MyWork/wg/trunk/publish/tool/svntool/svn.exe'
if platform.system() == 'Linux' :
	svn_tool = 'svn'

def update(path):
	os.system(svn_tool + ' update '+path)

def commit(path, msg='publish'):
	os.system(svn_tool + ' commit -m "' + msg + '" ' + path )
	
def add(path):
	os.system(svn_tool + ' add '+path+'/* --force')

#
'''
def rename(fname, newfname):
	os.system(svn_tool + ' rename '+fname+' '+newfname)
'''

#
'''
__verp = re.compile(r'r(\d+)')
def getVer(fname):
	rt = syscall.syscallEx(svn_tool + ' log -l 1 '+fname)
	if rt['ret'] == -1: return -1
	s = __verp.search(rt['out'])
	if s == None: return -1
	print s.group(1)
	return s.group(1)
'''	

	
