allprojs = [
	'EmptyLib'
	,'Luajit'
	,'ToLua'
	,'tinyxml'
	,'Net'
	,'Database'	
	,'LogSys'
	,'GameSys'
	,'UpdateSys'
	,'FileSys'
	,'TimeSys'
	,'EventSys'
	,'ScriptDebuger'
	,'ScriptSys'
	,'ScriptCom'
	,'GameSvr'
	,'Connect'
	,'GameScript'
	,'PkgMaker'
	]

#direct make, not has debug and release
makeprojs = [
	'EmptyLib'
	,'Luajit'
	,'ToLua'
]

import os
import platform
import subprocess
class Builder :
	def __init__(self):
		self._errorcount = 0
		self._curpath = os.getcwd()
		
	def make(self, allprojs, cfg):
		self._updateSrc()
		if platform.system() == 'Linux' :
			self._removeWin32Lib()
			self._createEmptyW2_32Lib()

		errorcnt = 0
		for proj in allprojs:
			print '[' + proj + ']'
			makeFilePath = ''
			cmdtip = ''
			if proj in makeprojs:
				makeFilePath = self._curpath + '/' + proj
				cmdtip = self.getMakeTool() + ' ' + proj
				os.chdir( makeFilePath )
				self.syscall(self.getMakeTool() + ' clean')
				self.syscall(self.getMakeTool() )
			else:
				makeFilePath = self._curpath + '/' + proj + '/' + cfg
				cmdtip = self.getMakeCommand(makeFilePath)
				os.chdir( makeFilePath )
				self.syscall(self.getMakeTool() + ' clean')
				self.syscall(cmdtip)
			errorcnt = errorcnt + self.errorcount()
			if self.errorcount() == 0 :
				print '  ' + cmdtip + ': <ok>'
			else:
				print '  ' + cmdtip + ':'
				print '*error count:' + str(self.errorcount())
		print '-----------'
		if errorcnt == 0 :
			print '<Success>'
		else:
			print '*Failed!!! error count:' + str(errorcnt)
			print ''
			
		self._updateSrc() # restore win32 lib
		self._tempCopyPkgMakerEXE();
		self._publishBin()
		os.chdir( self._curpath )
		
	def isExcludeErrorInfo(self, errstr):
		excludeStrs = 'ar: creating'
		return errstr[0:len(excludeStrs)] == excludeStrs
		
	def syscall(self, cmd):
		self._errorcount = 0
		fp = subprocess.Popen(cmd, stdout=subprocess.PIPE,stderr=subprocess.PIPE,shell=True)
		self.printPopenInfo(fp, cmd)
		
	def printPopenInfo(self, fp, cmd):
		stderrstr = fp.stderr.read()
		if stderrstr != '' and stderrstr != '\n' and stderrstr != '\r' :
			if not self.isExcludeErrorInfo(stderrstr) :
				self._errorcount = self._errorcount + 1
				print '*error:' + stderrstr
			
	def errorcount(self):
		return self._errorcount
		
	def getMakeCommand(self, makeFilePath):
		command = self.getMakeTool() + ' all'
		f = open(makeFilePath + '/makefile')
		for line in f.readlines():
			if not line.startswith('all:') or line.find('pre-build') < 0:
				continue
			targets = line[len('all:'):];
			command = self.getMakeTool() + ' ' + targets.replace('\n', '').replace('\r', '')
		f.close()
		return command
		
	def getMakeTool(self):
		if platform.system() == 'Linux' :
			return 'make'
		else:
			return 'mingw32-make'
			
	def _updateSrc(self):
		os.chdir( self._curpath )
		self.syscall('svn up')
		
	def _removeWin32Lib(self):
		os.chdir( self._curpath )
		self.syscall('rm -rf ./lib/mysql')
		
	def _createEmptyW2_32Lib(self):
		pass
		
	def _tempCopyPkgMakerEXE(self):
		import shutil
		print '*<need delete>'
		try:
			shutil.copy('./PkgMaker/Release/PkgMaker.exe', '../bin/')
		except:
			print 'error....'
			pass
		
	def _publishBin(self):
		#os.chdir( self._curpath )
		#self.syscall('python publish.py')
		pass
		
	

import sys
def main():
	if len(sys.argv) == 2: # python build.py Debug 
		Builder().make(allprojs, sys.argv[1])
	elif len(sys.argv) == 3: # python build.py Debug GameSvr
		Builder().make([sys.argv[2]], sys.argv[1])
	else: # python build.py
		print '======================= Debug ======================='
		Builder().make(allprojs, 'Debug')
		print '======================= Release ======================='
		Builder().make(allprojs, 'Release')
		
main()
