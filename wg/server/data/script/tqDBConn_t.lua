--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqDBConn')

local TestCaseDBFieldTypeChecker = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testGetFieldDescType = function(self)
		assert ( DBFieldTypeChecker:getFieldDescType(-1) == DBFieldTypeChecker.NONE )
		
		assert ( DBFieldTypeChecker:getFieldDescType(DB_TYPE.DECIMAL) == DBFieldTypeChecker.NUMBER )
		assert ( DBFieldTypeChecker:getFieldDescType(DB_TYPE.TINY) == DBFieldTypeChecker.NUMBER )
		assert ( DBFieldTypeChecker:getFieldDescType(DB_TYPE.SHORT) == DBFieldTypeChecker.NUMBER )
		assert ( DBFieldTypeChecker:getFieldDescType(DB_TYPE.LONG) == DBFieldTypeChecker.NUMBER )
		assert ( DBFieldTypeChecker:getFieldDescType(DB_TYPE.FLOAT) == DBFieldTypeChecker.NUMBER )
		assert ( DBFieldTypeChecker:getFieldDescType(DB_TYPE.DOUBLE) == DBFieldTypeChecker.NUMBER )
		assert ( DBFieldTypeChecker:getFieldDescType(DB_TYPE.LONGLONG) == DBFieldTypeChecker.NUMBER )
		assert ( DBFieldTypeChecker:getFieldDescType(DB_TYPE.INT24) == DBFieldTypeChecker.NUMBER )
		
		assert ( DBFieldTypeChecker:getFieldDescType(DB_TYPE.STRING) == DBFieldTypeChecker.STRING )
		assert ( DBFieldTypeChecker:getFieldDescType(DB_TYPE.VARCHAR) == DBFieldTypeChecker.STRING )
		assert ( DBFieldTypeChecker:getFieldDescType(DB_TYPE.VAR_STRING) == DBFieldTypeChecker.STRING )
		
		assert ( DBFieldTypeChecker:getFieldDescType(DB_TYPE.TINY_BLOB) == DBFieldTypeChecker.BLOB )
		assert ( DBFieldTypeChecker:getFieldDescType(DB_TYPE.MEDIUM_BLOB) == DBFieldTypeChecker.BLOB )
		assert ( DBFieldTypeChecker:getFieldDescType(DB_TYPE.LONG_BLOB) == DBFieldTypeChecker.BLOB )
		assert ( DBFieldTypeChecker:getFieldDescType(DB_TYPE.BLOB) == DBFieldTypeChecker.BLOB )
	end;
	
	testIsNumber = function(self)
		assert ( DBFieldTypeChecker:isNumber(DB_TYPE.DECIMAL) == true )
		assert ( DBFieldTypeChecker:isNumber(DB_TYPE.BLOB) == false )
		
		local methodMock = MethodMock()
		methodMock:mock(DBFieldTypeChecker, 'getFieldDescType', function(self, fieldType) DBFieldTypeChecker.fieldType = fieldType end)
		DBFieldTypeChecker:isNumber(DB_TYPE.DECIMAL)
		methodMock:restore()
		assert ( DBFieldTypeChecker.fieldType == DB_TYPE.DECIMAL, 'inner call the getFieldDescType method' )
	end;
	
	testIsString = function(self)
		assert ( DBFieldTypeChecker:isString(DB_TYPE.VARCHAR) == true )
		assert ( DBFieldTypeChecker:isString(DB_TYPE.BLOB) == false )
		
		local methodMock = MethodMock()
		methodMock:mock(DBFieldTypeChecker, 'getFieldDescType', function(self, fieldType) DBFieldTypeChecker.fieldType = fieldType end)
		DBFieldTypeChecker:isString(DB_TYPE.VARCHAR)
		methodMock:restore()
		assert ( DBFieldTypeChecker.fieldType == DB_TYPE.VARCHAR, 'inner call the getFieldDescType method' )
	end;
	
	testIsBlob = function(self)
		assert ( DBFieldTypeChecker:isBlob(DB_TYPE.BLOB) == true )
		assert ( DBFieldTypeChecker:isBlob(DB_TYPE.VARCHAR) == false )
		
		local methodMock = MethodMock()
		methodMock:mock(DBFieldTypeChecker, 'getFieldDescType', function(self, fieldType) DBFieldTypeChecker.fieldType = fieldType end)
		DBFieldTypeChecker:isBlob(DB_TYPE.VARCHAR)
		methodMock:restore()
		assert ( DBFieldTypeChecker.fieldType == DB_TYPE.VARCHAR, 'inner call the getFieldDescType method' )
	end;
})

local TestCaseDBConn = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_escape = function(self)
		local dbconn = DBConn()
		dbconn:setConn(SPub:GetDBConn())
		assertEQ ( dbconn:escape(nil), '' )
		assertEQ ( dbconn:escape(''), '' )
	end;
})

tqDBConn_t_main = function(suite)
	suite:addTestCase(TestCaseDBFieldTypeChecker, 'TestCaseDBFieldTypeChecker')
	suite:addTestCase(TestCaseDBConn, 'TestCaseDBConn')
end;


