MapCppSet = Class:extends({
	init = function(self, innerLists, countName, listName, keyName, maxCount)
		self.innerLists = innerLists
		self.countName = countName
		self.lists = self.innerLists[listName]
		self.keyName = keyName
		self.maxCount = maxCount
	end;
	
	isFull = function(self)
		return self:getCount() >= self.maxCount
	end;
	
	getMaxCount = function(self)
		return self.maxCount
	end;
	
	setMaxCount = function(self, maxCount)
		self.maxCount = maxCount
	end;
	
	has = function(self, valKey)
		return self:getByValKey(valKey) ~= nil
	end;
	
	getByValKey = function(self, valKey)
		return Util:findC(self.lists, self:getCount(), self.keyName, valKey)
	end;
	
	insert = function(self, val)
		if self:has( self:_getKeyVal(val) ) then
			return false
		end
		
		if self:isFull() then
			return false
		end
		
		if type(val) == 'table' then
			Util:dictCopy(self.lists[self:getCount()], val)
		else
			self.lists[self:getCount()] = val
		end
		
		self:_incCount();
		return true
	end;
	
	remove = function(self, valKey)
		if self:getByValKey(valKey) then
			Util:removeElementC( self.lists, self:getCount(), Util:getLastFindIdx() )
			self:_decCount()
		end
	end;
	
	getCount = function(self)
		return self.innerLists[self.countName]
	end;
	
	get = function(self, idx) -- from 0, n-1
		return self.lists[idx]
	end;
	
	clear = function(self)
		self.innerLists[self.countName] = 0
	end;
	
	_getKeyVal = function(self, val)
		if self.keyName ~= nil then
			return val[self.keyName]
		else
			return val
		end
	end;
	
	_incCount = function(self)
		self.innerLists[self.countName] = self.innerLists[self.countName] + 1
	end;
	
	_decCount = function(self)
		self.innerLists[self.countName] = self.innerLists[self.countName] - 1
	end;
})

MapCppSortSet = MapCppSet:extends({
	getByValKey = function(self, valKey)
		return Util:qfindC(self.lists, self:getCount(), self.keyName, valKey)
	end;
	
	insert = function(self, val)
		local valKey = self:_getKeyVal(val)
		if self:has( self:_getKeyVal(val) ) then
			return false
		end
		
		if self:isFull() then
			return false
		end
		
		Util:qinsertElementC(self.lists, self:getCount(), self.keyName, valKey, val)
		self:_incCount();
		return true
	end;
})


