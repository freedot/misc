import pprint

class _MyOut:
	def __init__(self):
		self._out = ''
		
	def get(self):
		return self._out
		
	def write(self,s):
		self._out += s
		
def load(fileName, dictName):
	f = open(fileName, 'r')
	s = f.read()
	f.close()
	
	s = s.replace('//', '#');
	ggc = {}
	llc = {}
	exec s in ggc, llc
	return llc.get(dictName)
		
def save(fileName, dict, dictName):
	myout = _MyOut()
	pprint.pprint(dict, myout, 1, 256)
	f = open(fileName,'w')
	s = myout.get()
	if s[-1] == '\n' or s[-1] == '\r':
		s = s[0:len(s)-1] + ';'
	f.write(dictName + '=' + s)
	f.close()
	
