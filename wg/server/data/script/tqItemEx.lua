--*******************************************************************************
--*******************************************************************************
ItemEx = Class:extends({
	init = function(self, innerItem)
		self:innerInit(innerItem)
	end;
	
	innerInit = function(self, innerItem)
		self.innerItem = innerItem
		self.innerItem.isRaw = 0	
	end;
	
	copyFrom = function(self, otherItem)
		self:setId( otherItem:getId() )
		self:setResId( otherItem:getResId() )
		self:setNumber( otherItem:getNumber() )
		self:setForceLevel( otherItem:getForceLevel() )
		self:setBind(otherItem:isBind())
		
		self:clearAttrs()
		local attrsCount = otherItem:getAttrsCount()
		for i=1, attrsCount, 1 do
			self:addAttr(otherItem:getAttrByIdx(i-1))
		end
		
		self:clearGems()
		local gemsCount = otherItem:getGemsCount()
		for i=1, gemsCount, 1 do
			self:addGem(otherItem:getGemByIdx(i-1))
		end
	end;
	
	isRawItem = function(self)
		return self.innerItem.isRaw == 1
	end;
	
	getId = function(self)
		return self.innerItem.id
	end;
	
	setId = function(self, id)
		self.innerItem.id = id
	end;	
	
	getResId = function(self)
		return self.innerItem.resId
	end;
	
	setResId = function(self, resId)
		self.innerItem.resId = resId
	end;
	
	getNumber = function(self)
		return self.innerItem.number
	end;
	
	subNumber = function(self, number)
		if number <= 0 then
			return 
		end
		
		if number < self.innerItem.number then
			self.innerItem.number = self.innerItem.number - number
		else
			self.innerItem.number = 0
		end
	end;
	
	addNumber = function(self, number)
		if number <= 0 then
			return
		end
		
		self.innerItem.number = self.innerItem.number + number
	end;
	
	setNumber = function(self, number)
		if number < 0 then
			return
		end
		
		self.innerItem.number = number
	end;
	
	getForceLevel = function(self)
		return self.innerItem.forceLevel
	end;
	
	setForceLevel = function(self, forceLevel)
		if forceLevel < 0 then
			return
		end
		
		self.innerItem.forceLevel = forceLevel
	end;
	
	bind = function(self)
		self.innerItem.isBind = 1
	end;
	
	isBind = function(self)
		return self.innerItem.isBind == 1
	end;	
	
	setBind = function(self, isBind)
		if isBind then
			self.innerItem.isBind = 1
		else
			self.innerItem.isBind = 0
		end
	end;
	
	getAttrsCount = function(self)
		return self.innerItem.attrs.count
	end;
	
	getAttrByIdx = function(self, idx) -- from 0 to n-1
		if (idx < 0) or (idx >= self.innerItem.attrs.count) then
			return nil
		end
		
		return self.innerItem.attrs.attrs[idx]
	end;
	
	clearAttrs = function(self)
		self.innerItem.attrs.count = 0
	end;
	
	addAttr = function(self, attr)
		if self.innerItem.attrs.count == MAX_ITEM_ATTRS_CNT then
			LOG('*error: add item attr count beyond max attr count')
			return
		end
		
		local innerAttr = self.innerItem.attrs.attrs[self.innerItem.attrs.count]
		self.innerItem.attrs.count = self.innerItem.attrs.count + 1
		innerAttr.attr = attr.attr
		innerAttr.val = attr.val
		innerAttr.unit = attr.unit
	end;
	
	hasAttr = function(self, attrId)
		return Util:findC(self.innerItem.attrs.attrs, self.innerItem.attrs.count, 'attr', attrId) ~= nil
	end;
	
	getAttr = function(self, attrId)
		return Util:findC(self.innerItem.attrs.attrs, self.innerItem.attrs.count, 'attr', attrId)
	end;
	
	getGemsCount = function(self)
		return self.innerItem.gems.count
	end;
	
	getGemByIdx = function(self, idx) -- from 0 to n-1
		if (idx < 0) or (idx >= self.innerItem.gems.count) then
			return nil
		end
		
		return self.innerItem.gems.gems[idx]
	end;
	
	setGemByIdx = function(self, idx, gemResId) -- from 0 to n-1
		if (idx < 0) or (idx >= self.innerItem.gems.count) then
			return
		end
		
		self.innerItem.gems.gems[idx] = gemResId
	end;
	
	clearGems = function(self)
		self.innerItem.gems.count = 0
	end;
	
	addGem = function(self, gem)
		self.innerItem.gems.gems[self.innerItem.gems.count] = gem
		self.innerItem.gems.count = self.innerItem.gems.count + 1
	end;
	
	removeGem = function(self, idx)
		if idx < 0 or idx >= self.innerItem.gems.count then
			return
		end
		
		self.innerItem.gems.count = Util:removeElementC(self.innerItem.gems.gems, self.innerItem.gems.count, idx)
	end;
	
	clear = function(self)
		self:setId( 0 )
		self:setResId( 0 )
		self:setNumber( 0 )
		self:setForceLevel( 0 )	
		self:setBind(false)
		self:clearAttrs()	
		self:clearGems()	
	end;
	
	toString = function(self)
		local s = '{'
		s = s .. 'id=' .. self:getId()
		s = s .. ',resId=' .. self:getResId()
		s = s .. ',number=' .. self:getNumber()
		
		if self:isRawItem() then
			s = s .. ',isRaw=1'
		else
			s = s .. ',isRaw=0'
		end
		
		s = s .. ',forceLevel=' .. self:getForceLevel()
		if self:isBind() then
			s = s .. ',isBind=1'
		else
			s = s .. ',isBind=0'
		end

		s = s .. ',' .. self:_attrsToString()
		s = s .. ',' .. self:_gemsToString()
		
		s = s .. '}' -- end
		return s
	end;
	
	_attrsToString = function(self)
		local s = ''
		local attrsCount = self:getAttrsCount()
		for i=1, attrsCount, 1 do
			local attr = self:getAttrByIdx(i-1)
			if s ~= '' then
				s = s .. ','
			end
			
			s = s .. '{attr=' .. attr.attr .. ',val=' .. attr.val .. ',unit=' .. attr.unit .. '}'
		end

		return 'attrs={count=' .. attrsCount .. ',attrs={' .. s .. '}}'
	end;
	
	_gemsToString = function(self)
		local s = ''
		local gemsCount = self:getGemsCount()
		for i=1, gemsCount, 1 do
			local gem = self:getGemByIdx(i-1)
			if s ~= '' then
				s = s .. ','
			end
			s = s .. gem
		end
	
		return 'gems={count=' .. gemsCount .. ',gems={' .. s .. '}}'
	end;
})

LuaItemEx = ItemEx:extends({
	getAttrByIdx = function(self, idx) -- from 0 to n-1
		if (idx < 0) or (idx >= self.innerItem.attrs.count) then
			return nil
		end
		
		return self.innerItem.attrs.attrs[idx + 1]
	end;
	
	addAttr = function(self, attr)
		local innerAttr = self.innerItem.attrs.attrs[self.innerItem.attrs.count + 1]
		self.innerItem.attrs.count = self.innerItem.attrs.count + 1
		innerAttr.attr = attr.attr
		innerAttr.val = attr.val
		innerAttr.unit = attr.unit
	end;
	
	hasAttr = function(self, attrId)
		return Util:find(self.innerItem.attrs.attrs, 'attr', attrId) ~= nil
	end;
	
	getAttr = function(self, attrId)
		return Util:find(self.innerItem.attrs.attrs, 'attr', attrId)
	end;	
	
	getGemByIdx = function(self, idx) -- from 0 to n-1
		if (idx < 0) or (idx >= self.innerItem.gems.count) then
			return nil
		end
		
		return self.innerItem.gems.gems[idx + 1]
	end;
	
	setGemByIdx = function(self, idx, gemResId) -- from 0 to n-1
		if (idx < 0) or (idx >= self.innerItem.gems.count) then
			return
		end
		
		self.innerItem.gems.gems[idx+1] = gemResId
	end;	
	
	addGem = function(self, gem)
		self.innerItem.gems.gems[self.innerItem.gems.count + 1] = gem
		self.innerItem.gems.count = self.innerItem.gems.count + 1
	end;
	
	removeGem = function(self, idx) -- from 0 to n-1
		if (idx < 0) or (idx >= self.innerItem.gems.count) then
			return
		end
		
		table.remove(self.innerItem.gems.gems, idx+1)
		self.innerItem.gems.count = self.innerItem.gems.count - 1
	end;	
})

CppTempItemEx = ItemEx:extends({
	setCppVarHdr = function(self, hdr)
		self.cppVarHdr = hdr
	end;
	
	getCppVarHdr = function(self)
		return self.cppVarHdr
	end;
})

RawItemEx = ItemEx:extends({
	init = function(self, innerItem)
		self:innerInit(innerItem)
		self.innerItem.isRaw = 1
	end;
	
	getForceLevel = function(self)
		return 0
	end;
	
	isBind = function(self)
		if self.innerItem.isBind == nil then
			return false
		end
		
		return self.innerItem.isBind == 1
	end;

	getAttrsCount = function(self)
		return 0
	end;
	
	getGemsCount = function(self)
		return 0
	end;
	
	copyFrom = function(self, otherItem)
		self:setResId( otherItem:getResId() )
		self:setNumber( otherItem:getNumber() )
	end;
})


