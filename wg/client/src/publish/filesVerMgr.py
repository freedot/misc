import pprint, hashutil, svn, dictfile, os

class FilesVerMgr:
	def __init__(self, mgrFilePath):
		self._filesVer = {}
		self._mgrFilePath = mgrFilePath
		self._load()
		
	def _load(self):
		self._filesVer = dictfile.load(self._mgrFilePath, 'filesver')
		
	def save(self):
		dictfile.save(self._mgrFilePath, self._filesVer, 'filesver')
		svn.commit(self._mgrFilePath)
		
	def isChanged(self, basePath, shortFile):
		hashVal = hashutil.md5HashFile(os.path.join(basePath, shortFile))
		node = self._filesVer.get(shortFile, None)
		if node == None:
			return True
		return node['hash'] != hashVal
		
	def add(self, basePath, shortFile):
		hashVal = hashutil.md5HashFile(os.path.join(basePath, shortFile))
		node = self._filesVer.get(shortFile, None)
		if node == None:
			self._filesVer[shortFile] = {'ver' : 1, 'hash': hashVal}
		elif node['hash'] != hashVal :
			node['ver'] += 1
			node['hash'] = hashVal
		
	def getVer(self, shortFile):
		node = self._filesVer.get(shortFile, None)
		if node == None:
			return 0
		else :
			return node['ver']
			