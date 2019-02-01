g_filecon = r'''/*******************************************************************************/
/*
<name> = JClass.ex({
	_init : function(){
	}
	
	,set : function(){
	}
});
*/

<name> = JBaseDlg.ex({
	_innerInit : function(){
	} 
	
	,_getDlgCfg : function(){
		/*need implement by sub class*/
	}
	
	,_afterCreate : function(){
		/*need implement by sub class*/
	}	
	
	,_setCallers : function(){
		/*need implement by sub class*/
	}
	
	,_initInfo : function(){
		/*need implement by sub class*/
	}
});
'''

# Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.

g_unit_filecon = r'''/*******************************************************************************/
require('./<name>.js')
TestCase<name> = JTestCase.ex({
	setUp : function(){
		TestCaseHelper.setUp(this);
	}
	
	,tearDown : function(){
		TestCaseHelper.tearDown(this);
	}
});

tq<name>_t_main = function(suite) {
	suite.addTestCase(TestCase<name>, 'TestCase<name>');
};
'''

g_unit_require = r''','./handler/<name>_t'
	//<insert require before>'''

g_unit_case = r''','tq<name>_t_main'
	//<insert case before>'''

g_scriptlist_include = r'''"js/handler/<name>.js",
	//<insert include before>'''

import os
import codecs

def getConFileName(className):
	return './js/handler/'+className+'.js'
	
def getUnitFileName(className):
	return './js/handler/'+className+'_t.js'
	
def getInputName():
	className = raw_input('JS class name: ')
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
	allunitFile = open('./js/all_t_scriptlist.js', 'r')
	allCon = allunitFile.read()
	allCon = allCon.replace('//<insert require before>', g_unit_require.replace('<name>',className))
	allCon = allCon.replace('//<insert case before>', g_unit_case.replace('<name>',className))
	allunitFile.close()
	allunitFile = open('./js/all_t_scriptlist.js', 'w')
	allunitFile.write(allCon)
	allunitFile.close()

def insert_scriptlist_file(className):
	rootFile = open('./js/scriptlists.js', 'r')
	rootCon = rootFile.read()
	rootCon = rootCon.replace('//<insert include before>', g_scriptlist_include.replace('<name>',className))
	rootFile.close()
	rootFile = open('./js/scriptlists.js', 'w')
	rootFile.write(rootCon)
	rootFile.close()

def main():
	className = getInputName()
	if className == None : return
	
	createConFile(className)
	createUnitFile(className)
	insert_all_t_File(className)
	insert_scriptlist_file(className)
	
	print 'create js class ['+className+'] ok'
	
main()
