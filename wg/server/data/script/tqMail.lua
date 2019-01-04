--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
Mail = Class:extends({
	init = function(self)
		self.id = 0
		self.receiver = ''
		self.sender = ''
		self.isSysFlag = 0
		self.isReadFlag = 0
		self.title = ''
		self.tempId = 0
		self.content = ''
		self.addTime = 0
		self.items = {}
		self.hasItem_ = false;
	end;
	
	setId = function(self, id)
		self.id = id
	end;
	
	getId = function(self)
		return self.id
	end;
	
	setHasItem = function(self, hasItem)
		self.hasItem_ = hasItem
	end;
	
	hasItem = function(self)
		return self.hasItem_
	end;
	
	setReceiver = function(self, receiver)
		self.receiver = receiver
	end;
	
	getReceiver = function(self)
		return self.receiver
	end;
	
	setSender = function(self, sender)
		self.sender = sender
	end;
	
	getSender = function(self)
		return self.sender
	end;

	setSysFlag = function(self, flag)
		self.isSysFlag = flag
	end;
	
	isSys = function(self)
		return self.isSysFlag
	end;
	
	setReadFlag = function(self, flag)
		self.isReadFlag = flag
	end;
	
	isRead = function(self)
		return self.isReadFlag
	end;
	
	setTitle = function(self, title)
		self.title = title
	end;
	
	getTitle = function(self)
		return self.title
	end;
	
	setTempId = function(self, tempId)
		self.tempId = tempId
	end;
	
	getTempId = function(self)
		return self.tempId
	end;
	
	setContent = function(self, content)
		self.content = content
	end;
	
	getContent = function(self)
		return self.content
	end;
	
	setTime = function(self, time)
		self.addTime = time
	end;
	
	getTime = function(self)
		return self.addTime
	end;
	
	getItems = function(self)
		return self.items
	end;
	
	clearItems = function(self)
		self.items = {}
	end;
	
	getItemCount = function(self)
		return table.getn(self.items)
	end;
	
	getItemByIdx = function(self, idx) -- idx from 1 to n
		return self.items[idx]
	end;
	
	addItem = function(self, item)
		table.insert(self.items, item)
	end;
	
	itemsToString = function(self)
		local s = ''
		for _, item in ipairs(self.items) do
			if s ~= '' then
				s = s .. ','
			end
			
			s = s .. item:toString()
		end
		
		return '{' .. s .. '}'
	end;
})


