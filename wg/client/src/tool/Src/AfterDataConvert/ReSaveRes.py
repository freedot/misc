# -*- coding: utf-8 -*-
from FileOperation import *

def isEmtyField(data):
	datatype = type(data)
	if datatype == STR_TYPE :
		return data == ''
	elif datatype == INT_TYPE :
		return data == 0
	elif datatype == FLOAT_TYPE :
		return data > -0.000001 and data < 0.000001
	elif datatype == LIST_TYPE:
		for d in data:
			if not isEmtyField(d) :
				return False
		return True
	elif datatype == DICT_TYPE:
		for k in data:
			if not isEmtyField(data[k]) :
				return False
		return True
	
	return True
	
def deleteEmptyFields(srcDict):
	for rowItem in srcDict:
		needDeleteKeys = []
		if type(rowItem) != DICT_TYPE :
			continue
		for k in rowItem:
			if isEmtyField(rowItem[k]) :
				needDeleteKeys.append(k)
		for k in needDeleteKeys:
			del rowItem[k]
	return srcDict
	
def deleteSecondLayerEmptyFields(srcDict):
	for rowItem in srcDict:
		for k in rowItem:
			if type(rowItem[k]) == LIST_TYPE :
				deleteEmptyFields( rowItem[k] )
				
def resaveRes(srcFile):
	dictNames, srcDicts = getSrcDicts(srcFile)
	for srcDict in srcDicts:
		deleteEmptyFields(srcDict)
		deleteSecondLayerEmptyFields(srcDict)
	desFile = srcFile
	saveDesDicts(desFile, srcDicts, dictNames, 'js')
