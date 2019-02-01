# -*- coding: utf-8 -*-
from FileOperation import *

def makeResEffectItemsDict(srcDict):
	resEffItems = {}
	for item in srcDict :
		effects = item.get('effects', None)
		if effects == None : 
			continue
		for effect in effects:
			if effect['id'] == 0 :
				continue
			if resEffItems.get(str(effect['id']), None) == None:
				resEffItems[str(effect['id'])] = {}
			resEffItems[str(effect['id'])][str(item['id'])] = 1
	return resEffItems
	
def convertResEffectItemsForSave(resEffItems):
	outResEffItems = []
	for effectid in resEffItems :
		effectItems = {'id':int(effectid), 'items':[]}
		for item in resEffItems[effectid] :
			effectItems['items'].append(int(item))
		effectItems['items'].sort()
		outResEffItems.append(effectItems)
	def compareFun(a, b) :
		return a['id'] - b['id']
	outResEffItems.sort(compareFun)
	return outResEffItems
	
def makeResEffectItemsFile(srcFiles, desFile, desDictName):
	srcItems = []
	for srcFile in srcFiles:
		dictNames, srcDicts = getSrcDicts(srcFile)
		for item in srcDicts[0] :
			srcItems.append(item)
	
	resEffItems = makeResEffectItemsDict(srcItems)
	outResEffItems = convertResEffectItemsForSave(resEffItems)
	
	saveDesDicts(desFile, [outResEffItems], [desDictName], 'js')

