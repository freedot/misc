# -*- coding: utf-8 -*-
STR_TYPE = type('')
INT_TYPE = type(1)
FLOAT_TYPE = type(1.1)
LIST_TYPE = type([])
DICT_TYPE = type({})

def MyPrintForJs( d, sout, maxlevel=1, curlevel=0 ):
	MyPrintInner(d, sout,  {'list_start':'[', 'list_end':']', 'keyeq':'\'%s\':'}, maxlevel, curlevel)

def MyPrintForLua( d, sout, maxlevel=1, curlevel=0 ):
	MyPrintInner(d, sout, {'list_start':'{', 'list_end':'}', 'keyeq':'%s='}, maxlevel, curlevel)	
		
def MyPrintInner( d, sout, tags, maxlevel=1, curlevel=0 ):
	if type(d) == DICT_TYPE :
		sout.write('{')
		comma = ''
		for k in d :
			sout.write(comma)
			sout.write(tags['keyeq']%(k))
			MyPrintInner(d.get(k), sout, tags, maxlevel, curlevel+1)
			comma = ','
		sout.write('}')
		if curlevel <= maxlevel and curlevel > 0 :
			sout.write('\n')
	elif type(d) == LIST_TYPE :
		sout.write(tags['list_start'])
		comma = ''
		for k in d :
			sout.write(comma)
			MyPrintInner(k, sout, tags, maxlevel, curlevel+1)
			comma = ','
		sout.write(tags['list_end'])
		if curlevel <= maxlevel and curlevel > 0 :
			sout.write('\n')
	elif type(d) == STR_TYPE :
		sout.write('\''+d+'\'')
	elif type(d) == INT_TYPE :
		sout.write(str(d))
	elif type(d) == FLOAT_TYPE :
		sout.write('%.4f'%(d))
		
class MyOutStream:
	def __init__(self):
		self.out = ''
		
	def get(self):
		return self.out
		
	def write(self,s):
		self.out = self.out + s
