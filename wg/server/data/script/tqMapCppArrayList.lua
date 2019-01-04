--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
MapCppArrayList = Class:extends({
	init = function(self, innerLists, countName, listName, maxCount, mapClass)
		self.innerLists = innerLists
		self.countName = countName
		self.listName = listName
		self.lists = self.innerLists[self.listName]
		self.maxCount = maxCount
		self.mapClass = mapClass
		self:_initList()
	end;
	
	getCount = function(self)
	end;
	
	getByIdx = function(self, idx)
	end;
	
	removeByIdx = function(self, idx)
	end;
	
	insert = function(self)
	end;
	
	_initList = function(self)
		self.mapLists = {}
		local count = self.innerList[self.countName]
		for i=1, count, 1 do
			table.insert( self.mapLists, self.mapClass:new(self.lists[i-1]) )
		end
	end;
})


