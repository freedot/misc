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
		local newo = self.extend(nil)
		if type(newo._init) == 'function' then
			newo._init(...)
		end
		return newo
	end;
}

--[[
local s = StringBuffer::alloc()
s.format()
s.puts()
s.toStringAndFree()
]]

Person = LuaClass.extend({
	_init = function(self, name)
		self._name = name
	end;
	
	getName = function(self)
		return self._name
	end;
})

Man = Person.extend({
	_init = function(self, name, age)
		self._super::_init(self, name)
		self._age = age
	end;
	
	getAge = function(self)
		return self._age
	end;
})

local lasttime = os.clock()
for i=0, 100000, 1 do
	local p1 = Person.new('name1')
	local p2 = Person.new('name2')
	local p3 = Man.new('name3', 20)
	local p4 = Man.new('name4', 30)
	p1.getName() 
	p2.getName() 
	p3.getName() 
	p4.getName() 
	p3.getAge() 
	p4.getAge()
end
local curtime = os.clock()
print ( curtime - lasttime )

print ( 0xffffffff )
