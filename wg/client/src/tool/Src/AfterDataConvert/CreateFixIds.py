# -*- coding: utf-8 -*-
import glob
from FileOperation import *

def makeFixIdsFile(srcBasePath, desFileJs, desFileLua):
	fixid = {}
	files = glob.glob(srcBasePath+'/*.js')
	for file in files :
		dictNames, srcDicts = getSrcDicts(file)
		for dict in srcDicts :
			for item in dict :
				progalias = item.get('progalias', '') 
				if progalias != '' :
					if fixid.get(progalias, None) != None:
						print '***error: reduplicate program alias define: '+ progalias + ' exist:' + str(fixid[progalias]) + ',newval:' + str(item.get('id', 0))
					bindItemId = getBindItemId(srcDicts, item)
					fixid[progalias] = {'progalias':progalias,'id':bindItemId, 'name':item.get('name', '')}
	
	fixidlist = [];
	for k in fixid :
		fixidlist.append(fixid[k])
	def cmpFun(a, b):
		return a['id'] - b['id']		
	fixidlist.sort(cmpFun)
	
	def saveFile(fileName, content):
		f = open(fileName, 'w')
		f.write(codecs.BOM_UTF8)
		f.write(content)
		f.close()
	js_s = ''
	lua_s = ''
	for item in fixidlist :
		s = 'FIXID.' + item['progalias'] + ' = ' + str(item['id']) + ';'
		js_s = js_s + s + ' //' + item['name'] + '\n'
		lua_s = lua_s + s + ' --' + item['name'] + '\n'
	saveFile(desFileJs, js_s)
	saveFile(desFileLua, lua_s)
	
def getBindItemId(srcDicts, curItem):
	curItemId = curItem.get('id', 0)
	if curItemId == 0:
		print '***error: item id == 0'
		return 0
		
	if curItem.get('isbind', 0) == 1:
		return curItemId
		
	for dict in srcDicts :
		for item in dict :
			if item.get('nobindid', 0) == curItemId:
				return item.get('id', 0)
				
	return curItemId