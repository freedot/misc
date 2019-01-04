--*******************************************************************************
local c_wrap_id = 4294967295
UUIDMgr = Class:extends({
	init = function(self)
		self.bakItemId = 0
		self.uuids = {
			armyId=0
			,itemId=0
			,allianceId=0
			,mailId=0 }
	end;
	
	load = function(self)
		local dbRows = app:getDBConn():query('select * from uuids;')
		local rowCount = dbRows:getRowCount()
		for i=1, rowCount, 1 do
			local dbRow = dbRows:getCurRow()
			self.uuids[ dbRow:getFieldVal('name') ] = dbRow:getFieldVal('uuid')
			dbRows:nextRow()
		end
		return true
	end;
	
	newArmyId = function(self)
		return self:_newUUID('armyId')
	end;
	
	newItemId = function(self)
		return self:_newUUID('itemId')
	end;
	
	newMailId = function(self)
		return self:_newUUID('mailId')
	end;
	
	newAllianceId = function(self)
		return self:_newUUID('allianceId')
	end;
	
	backItemId = function(self)
		self.bakItemId = self.uuids.itemId
	end;
	
	restoreItemId = function(self)
		self.uuids.itemId = self.bakItemId
		self:_save('itemId')
	end;
	
	_newUUID = function(self, idName)
		self.uuids[idName] = self.uuids[idName] + 1
		if self.uuids[idName] > c_wrap_id then
			LOG('error: ' .. idName .. ' id is turn up')
			self.uuids[idName] = 1
		end
		self:_save(idName)
		return global.makeInt64(SPub:GetZoneId(), self.uuids[idName])
	end;	
	
	_save = function(self, idName)
		local sql = 'update uuids set uuid=' .. self.uuids[idName] .. ' where name=\''.. idName ..'\';'
		app:getDBConn():exec(sql)
	end;	
}):new()



