--[[
LuaClass = {
	extend = function(self, subClass)
		if subClass == nil then
			subClass = {}
		else
			subClass._super = self
		end
		setmetatable(subClass, self)
		self.__index = self
		return subClass
	end;
	
	new = function(self, ...)
		local newo = self:extend(nil)
		if type(newo._init) == 'function' then
			newo:_init(...)
		elseif type(newo.init) == 'function' then
			newo:init(...)
		end
		return newo
	end;
}
settabletype(LuaClass, class_type)
]]

-- myclass.new() 和 myclass() 没有任何区别
TABLE_CLASS = 1
TABLE_INSTANCE = 2

string.split = function(s, p)
	local rtlist = {}
	string.gsub(s, '[^'..p..']+', function(w) table.insert(rtlist, w) end )
	return rtlist
end

string.triml = function(s)
	local s, _ = string.gsub(s, '^%s*(.-)', '%1' )
	return s
end

string.trimr = function(s)
	local s, _ = string.gsub(s, '(.-)%s*$', '%1' )
	return s
end

string.trim = function(s)
	local s, _ = string.gsub(s, '^%s*(.-)%s*$', '%1' )
	return s
end

function table.copyfun(des, src)
	for k, v in pairs(src) do
		local t = type(v)
		if t == 'function' then
			des[k] = v
		end
	end
end

Class = {
	extends = function(self, subClass)
		setmetatable(subClass, self)
		self.__index = self
		self.__call = self.new
		return subClass
	end;
	
	new = function(self, ...)
		local newo = self:extends({})
		if type(newo.init) == 'function' then
			newo:init(...)
		end
		return newo
	end;
	
	rnew = function(self, ...)
		return self:new(...)
	end;
	
	getClass = function(self)
		return getmetatable(self)
	end;
}

_no_implement_ = function()
	error('no implement method')
end;


