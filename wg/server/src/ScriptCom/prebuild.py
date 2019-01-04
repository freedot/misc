import platform
import os

# for windows
tolua = '.\\..\\tools\\tolua++\\tolua++'
workpath = '..\\'
cmd = ' -o tqAllTolua.cpp tqAllTolua.pkg'

# linux : sudo apt-get install tolua++
if platform.system() == 'Linux' :
	tolua = 'tolua++5.1'
	workpath = workpath.replace('\\', '/')
	cmd = cmd.replace('\\', '/')
	
os.chdir(workpath)
os.system(tolua + cmd)
