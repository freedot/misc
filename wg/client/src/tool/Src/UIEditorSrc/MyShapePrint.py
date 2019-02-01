#-*-coding:utf-8-*- 
STR_TYPE = type('')
USTR_TYPE = type(u'')
INT_TYPE = type(1)
FLOAT_TYPE = type(1.1)
LIST_TYPE = type([])
DICT_TYPE = type({})

NEED_CHECK_MACRO_KEYS = {
	'p' : True
	,'aj' : True
	,'t' : True
	,'w' : True
	,'ad' : True
	,'af' : True
	,'ah' : True
	,'title' : True
};

def IsMacroValue(dkey, d):
	global NEED_CHECK_MACRO_KEYS
	return dkey != None and NEED_CHECK_MACRO_KEYS.get(dkey, False) and d.find('.')>0


class MyPrint:
	def __init__(self):
		self.curline = []
		self.allStrs = []
		self.clientDiffPos = []
		self.valid = True
		self.inLine = False
		
	def getEditStr(self):
		if not self.valid :
			raise NameError, 'this object is invalid'
		return ''.join(self.allStrs)
		
	# 调用此函数后，self.clientDiffPos的内容将被改变,整个对象将失效
	# 再调用 getEditStr 将错误
	# 再调用 getClientStr 将错误
	# 为了性能如此做的
	def getClientStr(self):
		if not self.valid :
			raise NameError, 'this object is invalid'
		self.valid = False
		
		for pos in self.clientDiffPos :
			self.allStrs[pos] = ''
		return ''.join(self.allStrs)
	
	def Print(self, dkey, d):
		if type(d) == DICT_TYPE :
			self._Write('{')
			comma = ''
			for k in d :
				self._Write(comma)
				self._Write('\''+k+'\':')
				self.Print(k, d.get(k))
				comma = ','
			self._Write('}')
		elif type(d) == LIST_TYPE :
			self._Write('[')
			comma = ''
			for k in d :
				self._Write(comma)
				self.Print(None, k)
				comma = ','
			self._Write(']')
		elif type(d) == STR_TYPE or type(d) == USTR_TYPE:
			self._StartInLine()
			if IsMacroValue(dkey, d):
				self._MakeClientDiff( )
			self._Write('\'')
			self._Write(d)
			self._Write('\'')
			self._StopInLine( )
		elif type(d) == INT_TYPE :
			self._Write(str(d))
		elif type(d) == FLOAT_TYPE :
			self._Write('%.4f'%(d))
		else:
			print 'print error ...', dkey, d
			
	def _Write(self, s):
		self.allStrs.append(s);
		self.curline.append(s)
		if (not self._IsInLine()) and (len(''.join(self.curline)) > 100):
			self.allStrs.append('\n')
			self.curline = []
		
	def _MakeClientDiff(self):
		curLen = len(self.allStrs)
		self.clientDiffPos.append(curLen) # 字符串前面的单引号, 在转换成client需要的资源是将被去掉
		self.clientDiffPos.append(curLen+2) # 字符串后面的单引号, 在转换成client需要的资源是将被去掉
		
	def _StartInLine(self):
		self.inLine = True
		
	def _StopInLine(self):
		self.inLine = False
	
	def _IsInLine(self):
		return self.inLine
		
