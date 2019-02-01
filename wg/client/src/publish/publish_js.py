'''
. packer js file to tmp_js folder
. copy packered js to dst folder
. copy not be packered js file to dst folder ( like loading.js file)
. create scriptlists.js file to dst folder
. create js.py in dst folder
'''
import os, md5, filesVerMgr, syscall, svn, dictfile, shutil, find, re
from publish_setcfg import *

packer_63encode_tool = os.path.join(publish_path, 'tool/packer2/Packer.exe')
packer_comm_tool = os.path.join(publish_path, 'tool/node.exe') + ' ' + os.path.join(publish_path, 'tool/UglifyJS/mypacker.js')

tmp_js_path = os.path.join(output_path, 'tmp_js/')

src_scriptlists_js = os.path.join(src_base_path, 'js/scriptlists.js')

src_js_path = os.path.join(src_base_path, 'js/')
to_js_path = os.path.join(to_base_path, 'js/')
to_scriptlists_js = os.path.join(to_js_path, 'scriptlists.js')

src_js_py = os.path.join(src_base_path, 'js.py')
to_js_py = os.path.join(to_base_path, 'js.py')

def loadJsFilesList():
	f = open(src_scriptlists_js, 'r')
	s = f.read()
	f.close()
	
	s = s.replace('//', '#');
	ggc = {}
	llc = {}
	exec s in ggc, llc
	return llc.get('g_scriptlists')
	
def collectChangedJsFiles(scriptlists):
	changedFiles = []
	verMgr = filesVerMgr.FilesVerMgr(lastfilesver_path)
	for shortFileName in scriptlists:
		if verMgr.isChanged(src_base_path, shortFileName) :
			changedFiles.append(shortFileName)
	return changedFiles
	
def packerJsFilesToTmpFolder(changedFiles):
	curpos = 1
	for shortFileName in changedFiles:
		releaseJsFileName = md5.new(shortFileName).hexdigest() + '.js'
		
		srcJsFullFileName = os.path.join(src_base_path, shortFileName)
		releaseJsFullFileName = os.path.join(tmp_js_path, releaseJsFileName)
		
		packer_tool = packer_comm_tool
		if shortFileName.find('js/res/') == 0 : 	packer_tool = packer_63encode_tool
		
		packer_cmd = packer_tool+' '+srcJsFullFileName+' '+releaseJsFullFileName
		rt = syscall.syscallEx(packer_cmd)
		if rt['ret'] == -1 :
			print ' *** miss semicolon in next file', rt['out']
			print '     src : '+srcJsFullFileName
			print '     des : '+releaseJsFullFileName
			return False
		
		print '   convert js file: '+str(int(curpos*100/len(changedFiles) + 0.5))+'%'
		curpos += 1
		
	svn.add(tmp_js_path)
	svn.commit(tmp_js_path)
	return True
	
def createJsFilesVersion(scriptlists):
	verMgr = filesVerMgr.FilesVerMgr(lastfilesver_path)
	for shortFileName in scriptlists:
		verMgr.add(src_base_path, shortFileName)
	verMgr.save()
	
def createScriptListsJsFileWithVerToDstFolder(scriptlists): # -> scriptlists.js
	release_scriptlist = []
	verMgr = filesVerMgr.FilesVerMgr(lastfilesver_path)
	for shortFileName in scriptlists:
		ver = verMgr.getVer(shortFileName)
		releaseJsFileName = 'js/' + md5.new(shortFileName).hexdigest() + '.js'
		release_scriptlist.append(releaseJsFileName + '?v=' + str(ver))
	dictfile.save(to_scriptlists_js, release_scriptlist, 'g_scriptlists')
	
def copyPackeredJsToDstFolder():
	if os.path.isdir(to_js_path) : shutil.rmtree(to_js_path)
	shutil.copytree(tmp_js_path, to_js_path, ignore = shutil.ignore_patterns('.svn'))
	
def copyNotInScriptListsJsToDstFolder():
	js_list = dictfile.load(src_js_py, 'js_list')
	for fileName in js_list :
		shutil.copy(os.path.join(src_base_path, fileName), to_js_path)
		
def createNotInScriptListsJsVer():
	js_list = dictfile.load(src_js_py, 'js_list')
	verMgr = filesVerMgr.FilesVerMgr(lastfilesver_path)
	for fileName in js_list :
		verMgr.add(to_base_path, fileName)
	verMgr.save()		
	
def copySwfToDstFolder():
	swfs = find.find(src_js_path,  re.compile('.*\.swf$'))
	for fileName in swfs:
		shutil.copy(fileName, to_js_path )
		
def createJsPyFileToDstFolder(): # -> js.py
	js_list = dictfile.load(src_js_py, 'js_list')
	verMgr = filesVerMgr.FilesVerMgr(lastfilesver_path)
	to_js_list = []
	for jsfile in js_list:
		to_js_list.append(jsfile + '?v=' + str(verMgr.getVer(jsfile)))
	dictfile.save(to_js_py, to_js_list, 'js_list')
	
def publish():
	jsFilesList = loadJsFilesList()
	changedFiles = collectChangedJsFiles(jsFilesList)
	if not packerJsFilesToTmpFolder(changedFiles) :
		return
	createJsFilesVersion(jsFilesList)
	copyPackeredJsToDstFolder()
	copyNotInScriptListsJsToDstFolder()
	createScriptListsJsFileWithVerToDstFolder(jsFilesList)
	createNotInScriptListsJsVer()
	copySwfToDstFolder()
	createJsPyFileToDstFolder()
	
if __name__ == '__main__':
	publish()
