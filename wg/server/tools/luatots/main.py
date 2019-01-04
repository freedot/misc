# -*- coding:cp936 -*-
import sys, codecs, re, os
reload(sys)
sys.setdefaultencoding('utf-8')

def findFiles(basepath, ext=''):
	rfiles = []
	for root, dirs, files in os.walk(basepath):
		for file in files:
			if ext != '' and re.search(r'\.' + ext + r'$', file) == None: continue
			rfiles.append(root + os.sep + file)
	return rfiles
	
def ReadFileLines(filePath,encoding="utf_8_sig"):
	try:
		with codecs.open(filePath,"r",encoding) as f:
			return f.read().split('\r\n')
	except:
		with codecs.open(filePath,"r","gbk") as f:
			return f.read().split('\r\n')
			
def WriteFile(filePath,u,encoding="utf_8_sig"):
    with codecs.open(filePath,"w",encoding) as f:
        f.write(u)

class Handler:
	patt_line_comment = re.compile(r'(\s*)--(.*)')
	#--
	patt_class_define = re.compile(r'(\s*)(local)?\s*(\w+)\s*=\s*(\w+)\.extern\(\{\s*')
	patt_member_fun = re.compile(r'(\s*)(\w+)\s*=\s*function\(self([^\)]*)')
	#--
	patt_if_then_else_end = re.compile(r'(\s*)if(.*)then(.*)else(.*)end')
	patt_if_then_end = re.compile(r'(\s*)if(.*)then(.*)end')
	patt_if_then = re.compile(r'(\s*)if(.*)then(.*)')
	patt_if = re.compile(r'(\s*)if(.*)')
	#--
	patt_elseif_then_end = re.compile(r'(\s*)elseif(.*)then(.*)end')
	patt_elseif_then = re.compile(r'(\s*)elseif(.*)then(.*)')
	patt_elseif = re.compile(r'(\s*)elseif(.*)')
	#--
	patt_else_end = re.compile(r'(\s*)else(.*)end')
	patt_else = re.compile(r'(\s*)else(.*)')
	#--
	patt_then_end = re.compile(r'(\s*)(.*)then(.*)end')
	patt_then = re.compile(r'(\s*)(.*)then(.*)')
	#--
	patt_for_1_2_3_do = re.compile(r'(\s*)for\s*([\w\.]+)\s*=\s*([\w\.\-\#]+)\s*\,\s*([\w\.\-\#]+)\s*\,\s*([\w\.\-\#]+)\s*do')
	patt_for_1_2_do = re.compile(r'(\s*)for\s*([\w\.]+)\s*=\s*([\w\.\-\#]+)\s*,\s*([\w\.\-\#]+)\s*do')
	patt_for_1_in_ipairs_do = re.compile(r'(\s*)for\s*([\w\.]+)\s*in\s*ipairs\s*\(([\w\.]+)\)\s*do')
	patt_for_1_empty_in_ipairs_do = re.compile(r'(\s*)for\s*([\w\.]+)\s*,\s*_\s*in\s*ipairs\s*\(([\w\.]+)\)\s*do')
	patt_for_empty_1_in_ipairs_do = re.compile(r'(\s*)for\s*_\s*,\s*([\w\.]+)\s*in\s*ipairs\s*\(([\w\.]+)\)\s*do')
	patt_for_1_2_in_ipairs_do = re.compile(r'(\s*)for\s*([\w\.]+)\s*,\s*([\w\.]+)\s*in\s*ipairs\s*\(([\w\.]+)\)\s*do')
	patt_for_1_in_pairs_do = re.compile(r'(\s*)for\s*([\w\.]+)\s*in\s*pairs\s*\(([\w\.]+)\)\s*do')
	patt_for_1_empty_in_pairs_do = re.compile(r'(\s*)for\s*([\w\.]+)\s*,\s*_\s*in\s*pairs\s*\(([\w\.]+)\)\s*do')
	patt_for_empty_1_in_pairs_do = re.compile(r'(\s*)for\s*_\s*,\s*([\w\.]+)\s*in\s*pairs\s*\(([\w\.]+)\)\s*do')
	patt_for_1_2_in_pairs_do = re.compile(r'(\s*)for\s*([\w\.]+)\s*,\s*([\w\.]+)\s*in\s*pairs\s*\(([\w\.]+)\)\s*do')
	#--
	patt_while_do = re.compile(r'(\s*)while(.*)do')
	patt_while = re.compile(r'(\s*)while(.*)')
	patt_do = re.compile(r'(\s*)(.*)do(.*)')
	#--
	patt_end = re.compile(r'(\s*)end[;]?')
	patt_class_end = re.compile(r'(\s*)\}\)')
	#--
	default_patt = {
		'token_op':r'\b(<src_op>)\b'
		,'token_not_op':r'\b(<src_op>)\s+'
	}

	def handle(self, line):
		self._getPatt()
		match = self._getPatt().match(line)
		if match == None: return None
		return self._handle(line, match)
	def _getPatt(self):
		return None
	def _handle(self, line, match):
		return None
	def _defaultHandle(self, line):
		line = self._replaceToken(line, 'or', '||')
		line = self._replaceToken(line, 'and', '&&')
		line = self._replaceToken(line, 'self', 'this')
		line = self._replaceToken(line, 'nil', 'null')
		line = self._replaceToken(line, 'local', 'var')
		line = self._replaceNotOp(line, 'not', '!')
		line = line.replace('~=', '!=')
		line = line.replace('--', '//')
		line = line.replace('..', '+')
		return line
	def _replaceToken(self, line, src_op, to_op):
		return re.sub(Handler.default_patt['token_op'].replace('<src_op>', src_op), r'%s'%to_op, line)
	def _replaceNotOp(self, line, src_op, to_op):
		return re.sub(Handler.default_patt['token_not_op'].replace('<src_op>', src_op), r'%s'%to_op, line)
	
		
class LineCommentHandler(Handler):
	def _getPatt(self):
		return Handler.patt_line_comment
	def _handle(self, line, match):
		prespace = match.group(1)
		con = match.group(2)
		newline = prespace + '//' + con
		return newline
		
class ClassHandler(Handler):
	def _getPatt(self):
		return  Handler.patt_class_define
	def _handle(self, line, match):
		prespace = match.group(1)
		localdef = match.group(2)
		className = match.group(3)
		baseName = match.group(4)
		newline = ''
		if baseName == 'Class':
			newline = prespace + 'class ' + className + ' {'
		else:
			newline = prespace + 'class ' + className + ' extends ' + baseName + ' {'
		return newline
		
class MemberFunHandler(Handler):
	def _getPatt(self):
		return  Handler.patt_member_fun
	def _handle(self, line, match):
		prespace = match.group(1)
		member = match.group(2)
		params = match.group(3).strip(', \t')
		newline = ''
		if member == 'init' :
			newline = prespace + 'constructor(' + params + ') {'
		elif member[0:1] == '_':
			newline = prespace + 'protected ' + member + '(' + params + ') {'
		else:
			newline = prespace + member + '(' + params + ') {'
		return newline

class IfThenElseEndHandler(Handler):
	def _getPatt(self):
		return  Handler.patt_if_then_else_end
	def _handle(self, line, match):
		prespace = match.group(1)
		ex1 = self._defaultHandle(match.group(2).strip(' \t'))
		ex2 = self._defaultHandle(match.group(3).strip(' \t'))
		ex3 = self._defaultHandle(match.group(4).strip(' \t'))
		newline = prespace + 'if (' + ex1 + ') { ' + ex2  + ' } else { ' + ex3 + ' }'
		return newline
		
class IfThenEndHandler(Handler):
	def _getPatt(self):
		return  Handler.patt_if_then_end
	def _handle(self, line, match):
		prespace = match.group(1)
		ex1 = self._defaultHandle(match.group(2).strip(' \t'))
		ex2 = self._defaultHandle(match.group(3).strip(' \t'))
		newline = prespace + self._getKeyWord() + ' (' + ex1 + ') { ' + ex2  + ' }'
		return newline
	def _getKeyWord(self):
		return 'if'
		
class IfThenHandler(Handler):
	def _getPatt(self):
		return  Handler.patt_if_then
	def _handle(self, line, match):
		prespace = match.group(1)
		ex1 = self._defaultHandle(match.group(2).strip(' \t'))
		ex2 = self._defaultHandle(match.group(3).strip(' \t'))
		newline = prespace + self._getKeyWord() + ' (' + ex1 + ') {' + ex2
		return newline
	def _getKeyWord(self):
		return 'if'
		
class IfHandler(Handler):
	def _getPatt(self):
		return  Handler.patt_if
	def _handle(self, line, match):
		prespace = match.group(1)
		ex = self._defaultHandle(match.group(2).strip(' \t'))
		newline = prespace +  self._getKeyWord() + ' (' + ex
		return newline
	def _getKeyWord(self):
		return 'if'
		
class ElseIfThenEndHandler(IfThenEndHandler):
	def _getPatt(self):
		return  Handler.patt_elseif_then_end
	def _getKeyWord(self):
		return '} else if'
		
class ElseIfThenHandler(IfThenHandler):
	def _getPatt(self):
		return  Handler.patt_elseif_then
	def _getKeyWord(self):
		return '} else if'
		
class ElseIfHandler(IfHandler):
	def _getPatt(self):
		return  Handler.patt_elseif
	def _getKeyWord(self):
		return '} else if'
		
class ElseEndHandler(Handler):
	def _getPatt(self):
		return  Handler.patt_else_end
	def _handle(self, line, match):
		prespace = match.group(1)
		ex = self._defaultHandle(match.group(2).strip(' \t'))
		newline = prespace + '} else { ' + ex  + ' }'
		return newline
		
class ElseHandler(Handler):
	def _getPatt(self):
		return Handler.patt_else
	def _handle(self, line, match):
		prespace = match.group(1)
		ex = self._defaultHandle(match.group(2).strip(' \t'))
		newline = prespace + '} else { ' + ex
		return newline
	
class ThenEndHandler(Handler):
	def _getPatt(self):
		return Handler.patt_then_end
	def _handle(self, line, match):
		prespace = match.group(1)
		ex1 = self._defaultHandle(match.group(2).strip(' \t'))
		ex2 = self._defaultHandle(match.group(3).strip(' \t'))
		newline = prespace + ex1 + ') { ' + ex2 + ' }'
		return newline
		
class ThenHandler(Handler):
	def _getPatt(self):
		return Handler.patt_then
	def _handle(self, line, match):
		prespace = match.group(1)
		ex1 = self._defaultHandle(match.group(2).strip(' \t'))
		ex2 = self._defaultHandle(match.group(3).strip(' \t'))
		newline = prespace + ex1 + ') { ' + ex2
		return newline
		
class CommForDoHandler(Handler):
	def _handle(self, line, match):
		prespace = match.group(1)
		varname = self._defaultHandle(match.group(2).strip(' \t'))
		start = self._defaultHandle(match.group(3).strip(' \t'))
		end = self._defaultHandle(match.group(4).strip(' \t'))
		step = self._getStep(match)
		newline = ''
		if start[0:1] == '#' :
			start = 'table.getn(' + start[1:] + ')'
		if end[0:1] == '#' :
			end = 'table.getn(' + end[1:] + ')'
		if step[0:1] == '-' :
			if end == '1':
				newline = prespace + 'for (var ' + varname + '=' + start + '-1; ' + varname + '>=0; ' + varname + '+=' + '(' + step + ')) {'
			else:
				newline = prespace + 'for (var ' + varname + '=' + start + '-1; ' + varname + '>=' + end + '-1; ' + varname + '+=' + '(' + step + ')) {'
		elif step.isdigit():
			if start == '1':
				newline = prespace + 'for (var ' + varname + '=0; ' + varname + '<' + end + '; ' + varname + '+=' +  step + ') {'
			else:
				newline = prespace + 'for (var ' + varname + '=' + start + '-1; ' + varname + '<' + end + '; ' + varname + '+=' +  step + ') {'
		else:
			newline = prespace + '***error \n'
			newline = newline + prespace + 'for (var ' + varname + '=' + start + '-1; ' + varname + '<' + end + '; ' + varname + '+=' + '(' + step + ')) {'
		return newline
		
class For_1_2_3_doHandler(CommForDoHandler):
	def _getPatt(self):
		return Handler.patt_for_1_2_3_do
	def _getStep(self, match):
		return self._defaultHandle(match.group(5).strip(' \t'))
		
class For_1_2_doHandler(CommForDoHandler):
	def _getPatt(self):
		return Handler.patt_for_1_2_do
	def _getStep(self, match):
		return '1'
		
class For_1_in_ipairs_doHandler(Handler):
	def _getPatt(self):
		return Handler.patt_for_1_in_ipairs_do
	def _handle(self, line, match):
		prespace = match.group(1)
		varname = self._defaultHandle(match.group(2).strip(' \t'))
		list = self._defaultHandle(match.group(3).strip(' \t'))
		newline = prespace + 'for (var ' + varname + ' in ' + list + ') {'
		return newline
		
class For_1_empty_in_ipairs_doHandler(Handler):
	def _getPatt(self):
		return Handler.patt_for_1_empty_in_ipairs_do
	def _handle(self, line, match):
		prespace = match.group(1)
		varname = self._defaultHandle(match.group(2).strip(' \t'))
		list = self._defaultHandle(match.group(3).strip(' \t'))
		newline = prespace + 'for (var ' + varname + ' in ' + list + ') {'
		return newline
		
class For_empty_1_in_ipairs_doHandler(Handler):
	def _getPatt(self):
		return Handler.patt_for_empty_1_in_ipairs_do
	def _handle(self, line, match):
		prespace = match.group(1)
		varname = self._defaultHandle(match.group(2).strip(' \t'))
		list = self._defaultHandle(match.group(3).strip(' \t'))
		newline = prespace + 'for (var ' + varname + ' of ' + list + ') {'
		return newline
		
class For_1_2_in_ipairs_doHandler(Handler):
	def _getPatt(self):
		return Handler.patt_for_1_2_in_ipairs_do
	def _handle(self, line, match):
		prespace = match.group(1)
		index = self._defaultHandle(match.group(2).strip(' \t'))
		val = self._defaultHandle(match.group(3).strip(' \t'))
		list = self._defaultHandle(match.group(4).strip(' \t'))
		newline = prespace + 'for (var ' + index + ' in ' + list + ') {\n'
		subpre = '    '
		if prespace[0:1] == '\t': subpre = '\t'
		newline = newline + prespace + subpre + 'var ' + val + ' = ' + list + '[' + index + '];'
		return newline
		
class For_1_in_pairs_doHandler(Handler):
	def _getPatt(self):
		return Handler.patt_for_1_in_pairs_do
	def _handle(self, line, match):
		prespace = match.group(1)
		varname = self._defaultHandle(match.group(2).strip(' \t'))
		list = self._defaultHandle(match.group(3).strip(' \t'))
		newline = prespace + 'for (var ' + varname + ' in ' + list + ') {'
		return newline
		
class For_1_empty_in_pairs_doHandler(Handler):
	def _getPatt(self):
		return Handler.patt_for_1_empty_in_pairs_do
	def _handle(self, line, match):
		prespace = match.group(1)
		varname = self._defaultHandle(match.group(2).strip(' \t'))
		list = self._defaultHandle(match.group(3).strip(' \t'))
		newline = prespace + 'for (var ' + varname + ' in ' + list + ') {'
		return newline
		
class For_empty_1_in_pairs_doHandler(Handler):
	def _getPatt(self):
		return Handler.patt_for_empty_1_in_pairs_do
	def _handle(self, line, match):
		prespace = match.group(1)
		varname = self._defaultHandle(match.group(2).strip(' \t'))
		list = self._defaultHandle(match.group(3).strip(' \t'))
		newline = prespace + 'for (var __key in ' + list + ') {\n'
		subpre = '    '
		if prespace[0:1] == '\t': subpre = '\t'
		newline = newline + prespace + subpre + 'var ' + varname + ' = ' + list + '[__key];'
		return newline
		
class For_1_2_in_pairs_doHandler(Handler):
	def _getPatt(self):
		return Handler.patt_for_1_2_in_pairs_do
	def _handle(self, line, match):
		prespace = match.group(1)
		index = self._defaultHandle(match.group(2).strip(' \t'))
		val = self._defaultHandle(match.group(3).strip(' \t'))
		list = self._defaultHandle(match.group(4).strip(' \t'))
		newline = prespace + 'for (var ' + index + ' in ' + list + ') {\n'
		subpre = '    '
		if prespace[0:1] == '\t': subpre = '\t'
		newline = newline + prespace + subpre + 'var ' + val + ' = ' + list + '[' + index + '];'
		return newline
		
class While_doHandler(Handler):
	def _getPatt(self):
		return Handler.patt_while_do
	def _handle(self, line, match):
		prespace = match.group(1)
		ex = self._defaultHandle(match.group(2).strip(' \t'))
		newline = prespace + 'while (' + ex + ') {'
		return newline
		
class WhileHandler(Handler):
	def _getPatt(self):
		return Handler.patt_while
	def _handle(self, line, match):
		prespace = match.group(1)
		ex = self._defaultHandle(match.group(2).strip(' \t'))
		newline = prespace + 'while (' + ex 
		return newline
		
class DoHandler(Handler):
	def _getPatt(self):
		return Handler.patt_do
	def _handle(self, line, match):
		prespace = match.group(1)
		ex1 = self._defaultHandle(match.group(2).strip(' \t'))
		ex2 = self._defaultHandle(match.group(3).strip(' \t'))
		newline = prespace + ex1 + ') { ' + ex2
		return newline
		
class CommEndHandler(Handler):
	def _getPatt(self):
		return Handler.patt_end
	def _handle(self, line, match):
		prespace = match.group(1)
		newline = prespace + '}'
		return newline
		
class ClassEndHandler(Handler):
	def _getPatt(self):
		return Handler.patt_class_end
	def _handle(self, line, match):
		prespace = match.group(1)
		newline = prespace + '}'
		return newline
		
class DefaultHandler(Handler) :
	def handle(self, line):
		return self._defaultHandle(line)

class Parser:
	def __init__(self):
		self.handlers = [
			LineCommentHandler()
			,ClassHandler()
			,MemberFunHandler()
			,IfThenElseEndHandler()
			,IfThenEndHandler()
			,IfThenHandler()
			,IfHandler()
			,ElseIfThenEndHandler()
			,ElseIfThenHandler()
			,ElseIfHandler()
			,ElseEndHandler()
			,ElseHandler()
			,ThenEndHandler()
			,ThenHandler()
			,For_1_2_3_doHandler()
			,For_1_2_doHandler()
			,For_1_in_ipairs_doHandler()
			,For_1_empty_in_ipairs_doHandler()
			,For_empty_1_in_ipairs_doHandler()
			,For_1_2_in_ipairs_doHandler()
			,For_1_in_pairs_doHandler()
			,For_1_empty_in_pairs_doHandler()
			,For_empty_1_in_pairs_doHandler()
			,For_1_2_in_pairs_doHandler()
			,While_doHandler()
			,WhileHandler()
			,DoHandler()
			,CommEndHandler()
			,ClassEndHandler()
			,DefaultHandler()
		]
		
	def parse(self, file):
		outputline = ''
		lines = ReadFileLines(file)
		for line in lines:
			for hander in self.handlers:
				rt = hander.handle(line)
				if rt != None:
					outputline = outputline + rt + '\n'
					break
		return outputline

def main():
	files = findFiles(r'E:\MyWork\TqGame\branches\tots\data\script', 'lua')
	for fname in files:
		tsfile = fname.replace('data\script', 'data\src').replace('.lua', '.ts')
		tscon = Parser().parse(fname)
		WriteFile(tsfile, tscon)
	print 'complele! fotal file:', len(files)
	
def test():
	print Parser().parse(r'.\test.lua')
			
if __name__ == '__main__':
	main()
	#test()