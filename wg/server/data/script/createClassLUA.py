g_filecon = r'''--*******************************************************************************
<name> = Class.extern({
	init = function(self)
	end;
})
'''

# Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.

g_unit_filecon = r'''--*******************************************************************************
require('tq<name>')

local TestCase<name> = TestCase.extern({
	setUp = function(self)
		TestCaseHelper.createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper.clearAll(self)
	end;
})


tq<name>_t_main = function(suite)
	suite.addTestCase(TestCase<name>, 'TestCase<name>')
end;
'''

g_unit_require = r'''require('tq<name>_t')
--<insert require before>'''

g_unit_case = r'''tq<name>_t_main(suite)
--<insert case before>'''

g_root_include = r'''	'tq<name>',
	--<insert include before>'''

import os
import codecs
def getConFileName(className):
	return 'tq'+className+'.lua'
	
def getUnitFileName(className):
	return 'tq'+className+'_t.lua'
	
def getInputName():
	className = raw_input('LUA class name: ')
	className = className.strip()
	if className == '' : 
		print '*error: the class is empty'
		return None 
	
	if os.path.exists(getConFileName(className)) : 
		print '*error: the file ['+getConFileName(className)+'] is exist'
		return None	
	
	if os.path.exists(getUnitFileName(className)) : 
		print '*error: the file ['+getUnitFileName(className)+'] is exist'
		return None
	return className

def createConFile(className):
	conFile = open(getConFileName(className), 'w')
	conFile.write(codecs.BOM_UTF8)
	conFile.write(g_filecon.replace('<name>', className))
	conFile.close()

def createUnitFile(className):
	unitFile = open(getUnitFileName(className), 'w')
	unitFile.write(codecs.BOM_UTF8)
	unitFile.write(g_unit_filecon.replace('<name>', className))
	unitFile.close()

def insert_all_t_File(className):
	allunitFile = open('all_t.lua', 'r')
	allCon = allunitFile.read()
	allCon = allCon.replace('--<insert require before>', g_unit_require.replace('<name>',className))
	allCon = allCon.replace('--<insert case before>', g_unit_case.replace('<name>',className))
	allunitFile.close()
	allunitFile = open('all_t.lua', 'w')
	allunitFile.write(allCon)
	allunitFile.close()

def insert_root_File(className):
	rootFile = open('root.lua', 'r')
	rootCon = rootFile.read()
	rootCon = rootCon.replace('	--<insert include before>', g_root_include.replace('<name>',className))
	rootFile.close()
	rootFile = open('root.lua', 'w')
	rootFile.write(rootCon)
	rootFile.close()

def main():
	className = getInputName()
	if className == None : return
	
	createConFile(className)
	createUnitFile(className)
	insert_all_t_File(className)
	insert_root_File(className)
	
	print 'create class ['+className+'] ok'
	
main()
