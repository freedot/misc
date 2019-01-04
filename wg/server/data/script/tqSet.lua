--*******************************************************************************
Set = Class:extends({
	init = function(self, keyName, maxCount)
		self.list = {}
		self.keyName = keyName
		self.maxCount = maxCount
	end;
	
	isFull = function(self)
		return self:getCount() >= self.maxCount
	end;
	
	has = function(self, valKey)
		return Util:find(self.list, self.keyName, valKey) ~= nil
	end;
	
	insert = function(self, val)
		if self:has( self:_getKeyVal(val) ) then
			return false
		end
		
		if self:isFull() then
			return false
		end
		
		table.insert(self.list, val)
		
		return true	
	end;
	
	remove = function(self, valKey)
		if Util:find( self.list, self.keyName, valKey ) then
			table.remove(self.list, Util:getLastFindIdx())
		end
	end;
	
	removeByIdx = function(self, idx) -- from 0, n-1
		table.remove(self.list, idx+1)
	end;
	
	getCount = function(self)
		return table.getn(self.list)
	end;
	
	get = function(self, idx) -- from 0, n-1
		return self.list[idx+1]
	end;
	
	clear = function(self)
		self.list = {}
	end;
	
	_getKeyVal = function(self, val)
		if self.keyName ~= nil then
			return val[self.keyName]
		else
			return val
		end
	end;
})


