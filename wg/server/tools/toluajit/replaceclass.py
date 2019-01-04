# -*- coding:cp936 -*-
import sys, codecs, re, os
reload(sys)
sys.setdefaultencoding('utf-8')

class FileUtil:
	@staticmethod
	def findFiles(basepath, ext=''):
		rfiles = []
		for root, dirs, files in os.walk(basepath):
			for file in files:
				if ext != '' and re.search(r'\.' + ext + r'$', file) == None: continue
				rfiles.append(root + os.sep + file)
		return rfiles
	@staticmethod
	def ReadFileLines(filePath,encoding="utf_8_sig"):
		try:
			with codecs.open(filePath,"r",encoding) as f:
				return f.read().split('\r\n')
		except:
			with codecs.open(filePath,"r","gbk") as f:
				return f.read().split('\r\n')
	@staticmethod
	def WriteFile(filePath,u,encoding="utf_8_sig"):
		with codecs.open(filePath,"w",encoding) as f:
			f.write(u)

class Handler:
	patt_class_define = re.compile(r'\b(extern)\b')
	def handle(self, line):
		pass
		
class ClassHandler(Handler):
	def handle(self, line):
		return re.sub(r'\b(extern)\b', r'extends', line)
		
class Parser:
	def __init__(self):
		self.handlers = [
			ClassHandler()
		]
		
	def parse(self, file):
		outputline = ''
		lines = FileUtil.ReadFileLines(file)
		for line in lines:
			for hander in self.handlers:
				rt = hander.handle(line)
				if rt != None:
					outputline = outputline + rt + '\n'
					break
		return outputline

def main():
	files = FileUtil.findFiles(r'E:\MyWork\TqGame\trunk\data\script', 'lua')
	for fname in files:
		tsfile = fname
		tscon = Parser().parse(fname)
		FileUtil.WriteFile(tsfile, tscon)
	print 'complele! fotal file:', len(files)
	
def test():
	print Parser().parse(r'.\test.lua')
			
if __name__ == '__main__':
	main()
	#test()