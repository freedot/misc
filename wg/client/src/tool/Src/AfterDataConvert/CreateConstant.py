# -*- coding: utf-8 -*-
G_JSDefs = {}

g_newIDFun = r'''
def _newEID():
	global G_EID
	ret = G_EID
	G_EID = G_EID + 1
	return ret

'''

import types

def getSrcDictsEx(srcFile):
	f = open(srcFile, 'r')
	content = f.read()
	content = content.replace('//<newIDFun>', g_newIDFun)
	content = content.replace('//', '#')
	content = content.replace('/*', '#')
	content = content.replace('*/', '#')
	content = content.replace('G_EID++', '_newEID()')
	f.close()
	
	llc = {}
	exec(content, None, llc)
	return llc

def createConstant(srcFile):
	dicts = getSrcDictsEx(srcFile)
	
	s = ''
	for className in dicts :
		classMembers = dicts[className]
		if type(classMembers) == types.FunctionType :
			continue
		s += 'class ' + className + ':\n'
		for mem in classMembers:
			s += '    ' + mem + ' = ' + str(classMembers[mem]) + '\n'
	
	global G_JSDefs
	exec(s, None, G_JSDefs)
