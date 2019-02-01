# -*- coding: utf-8 -*-
import sys
from CreateConstant import *
from CreateResEffectItems import *
from ReSaveRes import *
from CreateFixIds import *
from FileOperation import *


def getConfig(cfgFile):
	keyNames, srcDicts = getSrcDicts(cfgFile)
	return srcDicts[0]

def main(cfgFile):
	cfg = getConfig(cfgFile)
	createConstant(cfg['defFile'])
	makeResEffectItemsFile(cfg['srcItem'], cfg['desEffItem'], cfg['desEffItemName'])
	for fname in cfg['needResaveFiles'] :
		resaveRes(fname)
	makeFixIdsFile(cfg['fixid']['srcpaths'], cfg['fixid']['desjs'], cfg['fixid']['deslua'])
	print '------------'
	print 'After Convert res Success !'

if __name__ == '__main__':
	if len(sys.argv) == 2 :
		main(sys.argv[1])
	else:
		print '''
		arg error: res_defs_forpy.js res_items.js res_efftiems.js ["res_items.js","res_inbuilds.js"]
		first arg res_defs_forpy.js
		sec arg is res_items.js
		three arg is res_efftiems.js
		last arg is need resave js files list
		'''
