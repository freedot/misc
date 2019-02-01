# -*- coding: utf-8 -*-
# author: bil825
import xlrd
import sys
import pprint
import os
import codecs
import types
import copy
import time

FORMAT_ROW_IDX = 0
DATA_ROW_START_IDX = 2 # skip row0(format row) and row1(title row)
CELL_TYPE_STRING = 1
CELL_TYPE_NUMBER = 2

ROW_NEXT_LINE = 1

FORMAT_FIELD_RESNAME_IDX = 0
FORMAT_FIELD_CS_RANGE_IDX = 1
FORMAT_FIELD_START_IDX = 2

KEYWORD_TAG = '[##keyword##]'


ResStr = {
	'start_convert' : u'开始转换 : [%s] ...'
	,'start_convert_sheet' : u'    sheet : [%s] ...'
	,'invalid_format' : u'错误的格式定义 : %s'
	,'id_exist' : u'发现该ID已经存在 : %d'
	,'error_tag' : u'***<错误>'
	,'convert_ok' : u'转表成功！'
	,'convert_fail' : u'转表失败！'
	,'invalid_outputflag' : u'错误的文件输出类型：%s'
	,'invalid_dictfield' : u'在输出的过程中发现错误的字段类型：%s'
	,'invalid_listidx' : u'数组类型的序号定义错乱,sheet:[%s],第%d列'
	,'loadkeyword_error' : u'加载keywords失败，文件名为：%s'
	,'error_key' : u'无法找到名为  %s  的keyword'
	,'error_arg' : u'命令行参数格式错误！convertxls inputfile'
	,'error_inputfile' : u'输入文件不存在或格式错误！[%s]'
	,'error_inputfile_format' : u'输入文件格式错误！[%s], [%s]'
	,'empty_line' : u'发现第 [%d] 行为空行，或ID错误'
	,'error_cols' : u'格式行的列数和数据行的列数不一致'
	,'error_colformat' : u'错误的列格式,表格的第一行必须是形如 res_copys.[c,s].(int)id 的定义'
	,'error_dateformat' : u'日期格式错误'
}

#__outmsg_encode_type_ = 'utf-8'
__outmsg_encode_type_ = 'gb2312'
def GetResStr(key,*args):
	nargs = []
	for k in range(0, len(args)) :
		if type(args[k]) == types.StringType:
			nargs.append( unicode(args[k], 'utf-8').encode(__outmsg_encode_type_ ) )
		elif type(args[k]) == types.UnicodeType:
			nargs.append( args[k].encode(__outmsg_encode_type_) )
		else:
			nargs.append(args[k])
	args = tuple(nargs)
	if len(args) == 0 :
		return ResStr[key].encode(__outmsg_encode_type_)
	else:
		return ResStr[key].encode(__outmsg_encode_type_) % args

class MySys:
	def __init__(self):
		self.currentId = 0
		self.currentCol = 0
		self.errorCount = 0
		
	def setCurId(self, id):
		self.currentId = id
		
	def setCurCol(self, col):
		self.currentCol = col
		
	def errorExit(self, msg):
		self.printMsg(GetResStr('error_tag') + msg + ' [currentId]:' + str(self.currentId) + ', [currentCol]:' + str(self.currentCol))
		self.errorCount = self.errorCount + 1
		sys.exit(0)
		
	def printMsg(self, msg):
		print msg
		
	def getErrorCount(self):
		return self.errorCount
mysys = MySys()

class MyOutStream:
	def __init__(self):
		self.out = ''
		
	def get(self):
		return self.out
		
	def write(self,s):
		self.out = self.out + s
		
class MyPPrint : 
	def __init__(self,deeplevel,flag):
		self.level = 0
		self.deeplevel = deeplevel
		self.flag = flag
		if flag == 'py' : 
			self.tags = {'list_start':'[', 'list_end':']', 'dict_start':'{', 'dict_end':'}', 'keyeq':'\'%s\':'}
		elif flag == 'lua' : 
			self.tags = {'list_start':'{', 'list_end':'}', 'dict_start':'{', 'dict_end':'}', 'keyeq':'%s='}
		else:
			mysys.errorExit( GetResStr('invalid_outputflag', str(flag)) )
		
	def sprint(self, d, outstream):
		self._print(d, outstream)
	
	def _print(self, d, outstream):
		t = type(d)
		if t == types.ListType :
			self._printList(d, outstream)
		elif t == types.DictType :
			self._printDict(d, outstream)
		elif t == types.StringType :
			if d.find(KEYWORD_TAG) == 0 :
				outstream.write(d[len(KEYWORD_TAG):])
			else:
				outstream.write("'"+d.replace("'", "\\'")+"'")
		elif t == types.IntType :
			outstream.write(str(d))
		elif t == types.FloatType :
			outstream.write('%.4f'%(d))
		else:
			mysys.errorExit( GetResStr('invalid_dictfield', str(t)) )
			
	def _printList(self, d, outstream):
		self._printDictOrList(d, outstream, 'list')
		
	def _printDict(self, d, outstream):
		self._printDictOrList(d, outstream, 'dict')
		
	def _printDictOrList(self, d, outstream, tag):
		self.level += 1
		outstream.write(self.tags[tag+'_start'])
		firstflag = True
		for i in d :
			if not firstflag :
				outstream.write(',')
			if tag == 'dict':
				outstream.write( self.tags['keyeq']%(i) )
				self._print(d[i], outstream)
			elif tag == 'list':
				self._print(i, outstream)
			firstflag = False
		outstream.write(self.tags[tag+'_end'])
		self.level -= 1
		self._printNewLine(outstream)
		
	def _printNewLine(self, outstream):
		if self.level == 0 and self.flag == 'py' :
			outstream.write(";")
		if self.level <= self.deeplevel :
			outstream.write("\n")
		
class FormatRow:
	def __init__(self):
		self.format_rowdict = {}
		self.format_row_fields_info = []
		self.format_row_fields_cs_range = {}
		self.res_name = ''
		self.curcol = 0
		self.sheet = None
		
	def readFormatRow(self, sh):
		self.sheet = sh
		fields = []
		for col in range(self.sheet.ncols) :
			cellvalue = self.sheet.cell_value(FORMAT_ROW_IDX, col).encode('gb2312')
			fields.append( cellvalue.split('.') )
		self._setResName(fields)
		self._handleFormatRow(fields)
		
	def isClientNeed(self, firstfield):
		return self.format_row_fields_cs_range[firstfield]['client']
		
	def isServerNeed(self, firstfield):
		return self.format_row_fields_cs_range[firstfield]['server']
		
	def getResName(self):
		return self.res_name
		
	def newRowdata(self):
		return copy.deepcopy(self.format_rowdict)
		
	def getDictLeafField(self, rowdata, col):
		fieldtype = ''
		dictfieldkey = ''
		nextdictfield = dictfield = rowdata
		fieldinfo = self.format_row_fields_info[col]
		for i in range( len(fieldinfo) ) :
			dictfield = nextdictfield
			fieldtype = fieldinfo[i]['type']
			dictfieldkey = fieldinfo[i]['key']
			nextdictfield = dictfield[dictfieldkey]
		return dictfield, dictfieldkey, fieldtype
		
	def _setResName(self, fields):
		if len(fields) == 0:
			return
		self.res_name = fields[0][FORMAT_FIELD_RESNAME_IDX]
		
	def _getFormatFieldType(self, fmtfield):
		return fmtfield[ (fmtfield.index('(')+1) : fmtfield.index(')') ]
		
	def _getFormatFieldKey(self, fmtfield, islist):
		fieldkey = fmtfield[ (fmtfield.index(')')+1) :  ]
		if islist:
			fieldkey = int(fieldkey)
		return fieldkey
		
	def _handleFormatRow(self, fields):
		self.format_row_fields_info = []
		self.format_rowdict = {}
		for self.curcol in range( len(fields) ) :
			self._handleFormatField(fields[self.curcol])
			
	def _handleFormatField(self, field):
		if str(field[0]).strip() == '' :
			mysys.errorExit( GetResStr('error_cols') )
		self._createFormatRowFields(field)
		self._createFieldsCSRange(field)
				
	def _createFormatRowFields(self, field):
		field_mapto_dict_fmt = []
		next_rowdata = self.format_rowdict
		for i in range( FORMAT_FIELD_START_IDX, len(field) ) : # sample: res_inbuild.[c,s].(int)id, jump res_inbuild and [c,s]
			rowdata = next_rowdata
			fieldtype = self._getFormatFieldType(field[i])
			fieldkey = self._getFormatFieldKey(field[i], (type(rowdata) == types.ListType))
			field_mapto_dict_fmt.append({'type':fieldtype, 'key':fieldkey})
			self._createFieldByType(rowdata, fieldtype, fieldkey)
			next_rowdata = rowdata[ fieldkey ]
		self.format_row_fields_info.append(field_mapto_dict_fmt)
		
	def _createFieldsCSRange(self, field):
		firstfield = 0
		try :
			firstfield = self._getFormatFieldKey(field[FORMAT_FIELD_START_IDX], False)
		except:	
			mysys.errorExit( GetResStr('error_colformat') )
		range = field[FORMAT_FIELD_CS_RANGE_IDX]
		self.format_row_fields_cs_range[firstfield] = ({'client': range.find('c') >= 0, 'server': range.find('s') >= 0 })
		
	def _createFieldByType(self, rowdata, fieldtype, fieldkey):
		if fieldtype == 'string' :
			self._createStringField(rowdata, fieldkey)
		elif fieldtype == 'keyword' :
			self._createStringField(rowdata, fieldkey)
		elif fieldtype == 'date' :
			self._createStringField(rowdata, fieldkey)
		elif fieldtype == 'int' :
			self._createIntField(rowdata, fieldkey)
		elif fieldtype == 'float' :
			self._createFloatField(rowdata, fieldkey)
		elif fieldtype == 'list' :
			self._createListField(rowdata, fieldkey)
		elif fieldtype == 'dict' :
			self._createDictField(rowdata, fieldkey)
		else:
			mysys.errorExit( GetResStr('invalid_format', str(fieldtype) ) )
				
	def _createStringField(self, rowdata, fieldkey):
		self._createField(rowdata, fieldkey, '')
	
	def _createIntField(self, rowdata, fieldkey):
		self._createField(rowdata, fieldkey, 0)
			
	def _createFloatField(self, rowdata, fieldkey):
		self._createField(rowdata, fieldkey, 0.0)
			
	def _createListField(self, rowdata, fieldkey):
		self._createField(rowdata, fieldkey, [])
				
	def _createDictField(self, rowdata, fieldkey):
		self._createField(rowdata, fieldkey, {})
				
	def _createField(self, rowdata, fieldkey, defaultval):
		if type(rowdata) == types.ListType :
			if fieldkey == len(rowdata) :
				rowdata.append(defaultval)
			elif fieldkey > len(rowdata) :
				mysys.errorExit(GetResStr('invalid_listidx', self.sheet.name, self.curcol + 1))
		elif rowdata.get(fieldkey) == None :
			rowdata[ fieldkey ] = defaultval
		
class Convert:
	def __init__(self):
		self.client_datas = {}
		self.server_datas = {}
		self.formatrow = FormatRow()
		self.keywords = {}
			
	def loadKeyword(self, filename):
		ggc = {}
		llc = {}
		execfile(self._encodeFileName(filename),ggc,llc)
		self.keywords = llc.get('keywords')
		if self.keywords == None:
			mysys.errorExit(GetResStr('loadkeyword_error', filename))
		
	def open(self, filename):
		mysys.printMsg(GetResStr('start_convert', filename) )
		bk = xlrd.open_workbook(self._encodeFileName(filename))
		for i in range(bk.nsheets) :
			self._readSheet(bk.sheet_by_index(i))
	
	def save(self, filename, flag):
		def cmpelem ( a, b ):
			return a['id'] - b['id']
		f = open(self._encodeFileName(filename), 'w')
		f.write(codecs.BOM_UTF8)
		myout = MyOutStream()
		printflag, datas = self._getPrintFlagAndDatasByFlag(flag)
		mypprint = MyPPrint(1, printflag)
		for k in datas :
			myout.write(k + '=')
			datas[k].sort(cmp=cmpelem)
			mypprint.sprint(datas[k], myout)
			myout.write('\n\n')
		f.write(myout.get())
		f.close()
		
	def clear(self):
		self.client_datas = {}
		self.server_datas = {}
		
	def _readSheet(self, sh):
		if len(sh.name) > 0 and sh.name[0] == '#' : #skip this sheet
			return
		mysys.printMsg(GetResStr('start_convert_sheet', sh.name) )
		self.formatrow.readFormatRow(sh)
		self._readDataRows(sh)
			
	def _readDataRows(self, sh):
		for row in range(DATA_ROW_START_IDX, sh.nrows):
			self._readDataCols(sh, row)
			
	def _readDataCols(self, sh, row):
		rowdata = self.formatrow.newRowdata()
		for col in range(sh.ncols) :
			self._makeRowData(sh, row, col, rowdata)
		self._pushRowDataIntoDatas(self.client_datas, self._createClientRowData(rowdata))
		self._pushRowDataIntoDatas(self.server_datas, self._createServerRowData(rowdata))

	def _makeRowData(self, sh, row, col, rowdata):
		cellvalue = sh.cell_value(row, col)
		if sh.cell_type(row, col) == CELL_TYPE_STRING :
			cellvalue = cellvalue.encode('utf-8')
		if col == 0 :
			mysys.setCurId( int(cellvalue))
		mysys.setCurCol(col+1)
		self._setRowDataField(rowdata, col, cellvalue)
		
	def _createClientRowData(self, rowdata):
		return self._createClientOrServerRowData(rowdata, self.formatrow.isClientNeed)
		
	def _createServerRowData(self, rowdata):
		return self._createClientOrServerRowData(rowdata, self.formatrow.isServerNeed)
	
	def _createClientOrServerRowData(self, rowdata, isneedfun):
		newrowdata = copy.deepcopy(rowdata)
		for k in rowdata :
			if not isneedfun(k) :
				del newrowdata[k] 
		return newrowdata
	
	def _setRowDataField(self, rowdata, col, cellvalue):
		dictfield, dictfieldkey, fieldtype = self.formatrow.getDictLeafField(rowdata, col)
		if fieldtype == 'string':
			self._setValueByString(dictfield, dictfieldkey, cellvalue)
		elif fieldtype == 'int':
			self._setValueByInt(dictfield, dictfieldkey, cellvalue)
			if dictfield[dictfieldkey] == 0 :
				self._setValueByKeyWord(dictfield, dictfieldkey, cellvalue, False)
		elif fieldtype == 'float':
			self._setValueByFloat(dictfield, dictfieldkey, cellvalue)
		elif fieldtype == 'keyword':
			self._setValueByKeyWord(dictfield, dictfieldkey, cellvalue, True)
		elif fieldtype == 'date':
			self._setValueByDateAndKeyWord(dictfield, dictfieldkey, cellvalue)
			
	def _setValueByString(self, dictfield, dictfieldkey, cellvalue):
		try:
			dictfield[dictfieldkey] = str(cellvalue)
		except:
			dictfield[dictfieldkey] = ''
		
	def _setValueByInt(self, dictfield, dictfieldkey, cellvalue):
		try:
			dictfield[dictfieldkey] = int(cellvalue)
		except:
			dictfield[dictfieldkey] = 0
			
	def _setValueByFloat(self, dictfield, dictfieldkey, cellvalue):
		try:
			dictfield[dictfieldkey] = float(cellvalue)
		except:
			dictfield[dictfieldkey] = 0.0
				
	def _setValueByKeyWord(self, dictfield, dictfieldkey, cellvalue, showError):
		try:
			dictfield[dictfieldkey] = KEYWORD_TAG+self._findKeyWord(str(cellvalue), showError)
		except:
			dictfield[dictfieldkey] = 0
			
	def _setValueByDateAndKeyWord(self, dictfield, dictfieldkey, cellvalue):
		self._setValueByKeyWord(dictfield, dictfieldkey, cellvalue, False)
		if dictfield[dictfieldkey] != 0 : 
			return
		dictfield[dictfieldkey] = self._parseTimeFromDateString(str(cellvalue))
		
	def _parseTimeFromDateString(self, dateStr):
		try: #'2013-08-31 22:10:00'
			return int(time.mktime(time.strptime(dateStr, '%Y-%m-%d %H:%M:%S')))
		except:
			try:#'2013-08-31'
				return int(time.mktime(time.strptime(dateStr, '%Y-%m-%d')))
			except:
				s = GetResStr('error_dateformat') + dateStr + '\n'
				s = s + 'sample: 2013-08-31 22:10:00 or 2013-08-31'
				mysys.errorExit(s)
				return self._safeToInt(dateStr)
			
	def _safeToInt(self, s):
		try:
			return int(s)
		except:
			return 0
			
	def _findKeyWord(self, keyword, showError):
		k = self.keywords.get(keyword)
		if k == None:
			if showError :
				mysys.errorExit(GetResStr('error_key', keyword))
			else :
				return 0
		else:
			return str(k)
			
	def _pushRowDataIntoDatas(self, datas, rowdata):
		resname = self.formatrow.getResName()
		if datas.get(resname) == None:
			datas[resname] = []
			
		if rowdata['id'] == 0 :
			mysys.errorExit(GetResStr('empty_line', len(datas[resname]) + DATA_ROW_START_IDX + ROW_NEXT_LINE )  )
		elif not self._isUniqueRowId(datas[resname], rowdata['id']) :
			mysys.errorExit(GetResStr('id_exist', rowdata['id'])  )
		else:
			datas[resname].append(rowdata)
			
	def _encodeFileName(self, filename):
		return unicode(filename, "utf-8").encode('gb2312')
		
	def _isUniqueRowId(self, resdatas, id):
		for r in resdatas :
			if r.get('id') == id :
				return False
		return True
		
	def _getPrintFlagAndDatasByFlag(self, flag):
		if flag == 'client' :
			return 'py', self.client_datas
		else:
			return 'lua', self.server_datas
			
def checkFormatKey(filename, dict, key):
	if dict.get(key) == None :
		mysys.errorExit(GetResStr('error_inputfile_format', filename, key)) 
		
def main(filename):
	c = Convert()
	llc = {}
	ggc = {}
	try:
		execfile(filename,ggc,llc)
	except:
		mysys.errorExit(GetResStr('error_inputfile', filename))
		
	inputs = llc.get('inputs')
	checkFormatKey(filename, llc, 'inputs')

	for item in inputs :
		checkFormatKey(filename, item, 'srcfiles')
		for v in item['srcfiles'] :
			checkFormatKey(filename, v, 'keywords')
			checkFormatKey(filename, v, 'xls')
			c.loadKeyword(v['keywords'])
			c.open(v['xls'])
		checkFormatKey(filename, item, 'outputfile')
		if item['outputfile'].get('client') != None:
			c.save(item['outputfile']['client'], 'client')
		if item['outputfile'].get('server') != None:
			c.save(item['outputfile']['server'], 'server')
		c.clear()
		
	if mysys.getErrorCount() == 0 :
		mysys.printMsg(GetResStr('convert_ok'))
	else:
		mysys.printMsg(GetResStr('convert_fail'))
	
if __name__ == '__main__':
	if len(sys.argv) == 2 :
		main(sys.argv[1])
	else:
		#main('E:/MyWork/convertinput.py')
		mysys.errorExit(GetResStr('error_arg'))