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
	patt_line_comment = re.compile(r'(\s*)--(.*)')
	#--
	patt_class_define = re.compile(r'(\s*)(local)?\s*(\w+)\s*=\s*(\w+)\.extern\(\{\s*')
	#--
	patt_member_call = re.compile(r'(\w+)\.(\w+)\s*\(')
	patt_member_call2 = re.compile(r'\)\.(\w+)\s*\(')

	def handle(self, line):
		pass
		
class LineCommentHandler(Handler):
	def handle(self, line):
		match = Handler.patt_line_comment.match(line)
		if match == None: return None
		return line
		
class ClassHandler(Handler):
	def handle(self, line):
		match = Handler.patt_class_define.match(line)
		if match == None: return None
		prespace = match.group(1)
		localdef = match.group(2)
		if localdef == None: 
			localdef = ''
		else:
			localdef = 'local '
		className = match.group(3)
		baseName = match.group(4)
		newline = prespace + localdef + className + ' = ' + baseName + ':extern({'
		return newline
		
class MemberFunCall(Handler):
	def handle(self, line):
		def repl1(mached):
			obj = mached.group(1)
			member = mached.group(2)
			if obj[0:4] == 'res_' \
				or obj == 'table' \
				or obj == 'global' \
				or obj == 'io' \
				or obj == 'os' \
				or obj == 'math' \
				or obj == 'Json' \
				or obj == 'debug' \
				or obj == 'string' :
				return obj + '.' + member + '('
			else:
				return obj + ':' + member + '('
		line = Handler.patt_member_call.sub(repl1, line)
		
		def repl2(mached):
			member = mached.group(1)
			return '):' + member + '('
		line = Handler.patt_member_call2.sub(repl2, line)
		
		return line
		
class Parser:
	def __init__(self):
		self.handlers = [
			LineCommentHandler()
			,ClassHandler()
			,MemberFunCall()
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
	files = FileUtil.findFiles(r'E:\MyWork\TqGame\branches\tots\data\script', 'lua')
	for fname in files:
		tsfile = fname.replace('data\script', 'data\src2').replace('.lua', '.lua')
		tscon = Parser().parse(fname)
		FileUtil.WriteFile(tsfile, tscon)
	print 'complele! fotal file:', len(files)
	
def test():
	print Parser().parse(r'.\test.lua')
			
if __name__ == '__main__':
	main()
	#test()