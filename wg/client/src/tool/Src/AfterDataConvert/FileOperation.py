# -*- coding: utf-8 -*-
import codecs
from MyPrint import *
import CreateConstant

def getSrcDicts(srcFile):
	f = open(srcFile, 'r')
	content = f.read()
	f.close()
	
	llc = {}
	exec(content, CreateConstant.G_JSDefs, llc)
	
	dictNames = []
	srcDicts = []
	for reskey in llc :
		dictNames.append(reskey)
		srcDicts.append(llc.get(reskey))
	return dictNames, srcDicts

def saveDesDicts(desFile, srcDicts, dictNames, ext):
	f = open(desFile, 'w')
	f.write(codecs.BOM_UTF8)
	
	for i in range( len(dictNames) ) :
		reskey = dictNames[i]
		srcDict = srcDicts[i]
		desOut = MyOutStream()
		if ext == 'js' :
			MyPrintForJs(srcDict, desOut)
		elif ext == 'lua':
			MyPrintForLua(srcDict, desOut)
		f.write(reskey + '=' + desOut.get() + ';\n\n')
	
	f.close()
	