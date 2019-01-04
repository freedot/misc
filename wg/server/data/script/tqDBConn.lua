--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
DB_TYPE = { 
	DECIMAL = 0,
	TINY = 1,
	SHORT = 2, 
	LONG = 3,
	FLOAT = 4, 
	DOUBLE = 5,
	NULL = 6, 
	TIMESTAMP = 7,
	LONGLONG = 8,
	INT24 = 9,
	DATE = 10, 
	TIME = 11,
	DATETIME = 12, 
	YEAR = 13,
	NEWDATE = 14,
	VARCHAR = 15,
	BIT = 16,
	NEWDECIMAL=246,
	ENUM=247,
	SET=248,
	TINY_BLOB=249,
	MEDIUM_BLOB=250,
	LONG_BLOB=251,
	BLOB=252,
	VAR_STRING=253,
	STRING=254,
	GEOMETRY=255,
}

DBFieldTypeChecker = Class:extends({
	init = function(self)
		self.NONE = 0
		self.NUMBER = 1
		self.STRING = 2
		self.BLOB = 3
		
		self.fieldsDescs = {}
		self.fieldsDescs[DB_TYPE.DECIMAL] = {type=self.NUMBER}
		self.fieldsDescs[DB_TYPE.TINY] = {type=self.NUMBER}
		self.fieldsDescs[DB_TYPE.SHORT] = {type=self.NUMBER}
		self.fieldsDescs[DB_TYPE.LONG] = {type=self.NUMBER}
		self.fieldsDescs[DB_TYPE.FLOAT] = {type=self.NUMBER}
		self.fieldsDescs[DB_TYPE.DOUBLE] = {type=self.NUMBER}
		self.fieldsDescs[DB_TYPE.LONGLONG] = {type=self.NUMBER}
		self.fieldsDescs[DB_TYPE.INT24] = {type=self.NUMBER}
		
		self.fieldsDescs[DB_TYPE.STRING] = {type=self.STRING}
		self.fieldsDescs[DB_TYPE.VARCHAR] = {type=self.STRING}
		self.fieldsDescs[DB_TYPE.VAR_STRING] = {type=self.STRING}
		
		self.fieldsDescs[DB_TYPE.TINY_BLOB] = {type=self.BLOB}
		self.fieldsDescs[DB_TYPE.MEDIUM_BLOB] = {type=self.BLOB}
		self.fieldsDescs[DB_TYPE.LONG_BLOB] = {type=self.BLOB}
		self.fieldsDescs[DB_TYPE.BLOB] = {type=self.BLOB}
	end;
	
	isNumber = function(self, fieldType)
		return self:getFieldDescType(fieldType) == self.NUMBER
	end;
	
	isString = function(self, fieldType)
		return self:getFieldDescType(fieldType) == self.STRING
	end;
	
	isBlob = function(self, fieldType)
		return self:getFieldDescType(fieldType) == self.BLOB
	end;
	
	getFieldDescType = function(self, fieldType)
		local desc = self.fieldsDescs[fieldType]
		if desc == nil then
			return self.NONE
		end
		return desc.type
	end;
}):new()
			
DBRow = Class:extends({
	init = function(self)
		self.conn = nil
	end;
	
	setConn = function(self, conn)
		self.conn = conn
	end;
	
	getFieldCount = function(self)
		return self.conn:GetFieldCount()
	end;

	getFieldVal = function(self, fieldName)
		local fieldVal, fieldLen, fieldType = self.conn:GetField(fieldName, 0, 0)
		if fieldVal == nil then
			error('* error, db get field val is nil, fieldName:'..fieldName)
			return nil
		end
		
		if DBFieldTypeChecker:isNumber(fieldType) then
			return tonumber(fieldVal)
		elseif DBFieldTypeChecker:isString(fieldType) then
			return fieldVal
		elseif DBFieldTypeChecker:isBlob(fieldType) then
			return fieldVal
		else
			error('* error, db get field type is unknown, fieldName:'..fieldName..', fieldType:'..fieldType)
			return nil
		end
	end;
})

DBRows = Class:extends({
	init = function(self, conn)
		self.conn = nil
		self.dbrow = DBRow()
	end;
	
	setConn = function(self, conn)
		self.conn = conn
		self.dbrow:setConn(self.conn)
	end;
	
	getRowCount = function(self)
		return self.conn:GetRowCount()
	end;
	
	nextRow = function(self)
		return self.conn:GetRow()
	end;
	
	getCurRow = function(self)
		return self.dbrow
	end;
})

NullDBRows = Class:extends({
	init = function(self, conn)
	end;
	
	setConn = function(self, conn)
	end;
	
	getRowCount = function(self)
		return 0
	end;
	
	nextRow = function(self)
		return nil
	end;
	
	getCurRow = function(self)
		return nil
	end;
})

DBConn = Class:extends({
	init = function(self)
		self.conn = nil
		self.dbrows = DBRows()
		self.nullDbRows = NullDBRows()
	end;
	
	setConn = function(self, conn)
		self.conn = conn
		self.dbrows:setConn(self.conn)
	end;
	
	query = function(self, sql)
		if not self.conn:Query(sql) then return self.nullDbRows end
		if not self.dbrows:nextRow() then return self.nullDbRows end -- move first row record
		return self.dbrows
	end;
	
	exec = function(self, sql)
		return self.conn:Query(sql)
	end;
	
	escape = function(self, s)
		if not s then
			return ''
		end
		
		if s == '' then
			return ''
		end
		
		return self.conn:RealEscapeString(s, string.len(s))
	end;
	
	getLastErrorStr = function(self)
		return self.conn:GetLastErrorStr()
	end;
})



