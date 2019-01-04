require('tqClass')

_unit_test_assert_tag = '<unit_assert>'
_inner_assert = assert
assert = function(expl, msg)
	if msg == nil then 	
		msg = _unit_test_assert_tag..'assertion failed!'
	else
		msg = _unit_test_assert_tag..msg
	end
	_inner_assert(expl, msg)
end;

assertListEQ = function(aList, bList, msg)
	if msg == nil then 	
		msg = _unit_test_assert_tag..'assertion failed!'
	else
		msg = _unit_test_assert_tag..msg
	end
	_inner_assert(CompareUtil:eq(aList, bList), msg)
end;

assertEQ = assertListEQ;

assertNotEQ = function(a, b, msg)
	if msg == nil then 	
		msg = _unit_test_assert_tag..'assertion failed!'
	else
		msg = _unit_test_assert_tag..msg
	end
	_inner_assert(a ~= b, msg)
end;

assertFloatEQ = function(a, b, msg)
	if msg == nil then 	
		msg = _unit_test_assert_tag..'assertion failed!'
	else
		msg = _unit_test_assert_tag..msg
	end
	_inner_assert(floatEQ(a, b), msg)
end;

assertStrRepeatCount = function(s, key, count, message)
	local hasCount = 0
	local words = string.split(s, ',')
	for _, w in ipairs(words) do
		if w == key then
			hasCount = hasCount + 1
		end
	end
	
	if msg == nil then 	
		msg = _unit_test_assert_tag..'assertion failed!'
	else
		msg = _unit_test_assert_tag..msg
	end
	_inner_assert(hasCount==count, msg)
end;


Lua_xpcall_errorhdr = function(err)
	local stacks = string.split(debug.traceback(), '\n')
	local _, endpos = string.find(err, _unit_test_assert_tag)
	if endpos ~= nil and table.getn(stacks) >= 5 then
		local line = string.triml(stacks[5])
		line, _ = string.gsub(line, '(.*:%d+:).*', '%1 ')
		print( line..string.sub(err, endpos + 1) )
	else
		print(err)
		for i=1, table.getn(stacks), 1 do
			print( string.triml(stacks[i]) )
		end
	end
end;

TestResult = Class:extends({
	init = function(self, name)
		self.runCount = 0
		self.failedCount = 0
	end;
	
	testStarted = function(self)
		self.runCount = self.runCount + 1
	end;
	
	testFailed = function(self)
		self.failedCount = self.failedCount + 1
	end;
	
	summary = function(self)
		return string.format('%d run, %d failed', self.runCount, self.failedCount)
	end;
})

TestCase = Class:extends({
	init = function(self, name, classname)
		self.name = name
		self.classname = classname
	end;
	
	getClassName = function(self)
		return self.classname
	end;
	
	setUp = function(self)
	end;
	
	run = function(self, result)
		if result == nil then
			result = TestResult:new()
		end	
		result:testStarted()
		local status, _ = xpcall( function()  self:setUp()  end,  Lua_xpcall_errorhdr)
		if not status then
			result:testFailed()
			return result
		end
		
		status, _ = xpcall( function() self[self.name](self) end, Lua_xpcall_errorhdr)
		if not status then
			result:testFailed()
			print('    [casename]: '..self.name)
			self:tearDown()
			return result
		end
		
		status, _ = xpcall( function() self:tearDown() end, Lua_xpcall_errorhdr)
		if not status then
			result:testFailed()
		end
		return result
	end;
	
	tearDown = function(self)
	end;
})

TestSuite = Class:extends({
	init = function(self)
		self.tests = {}
	end;
	
	add = function(self, test)
		table.insert(self.tests, test)
	end;
	
	addTestCase = function(self, testcase, classname)
		if classname == nil then classname = '' end
		for k, f in pairs(testcase) do
			local p, _ = string.find(k,'test')
			if p == 1 and type(f) == 'function' then
				self:add(testcase:new(k, classname))
			end
		end
	end;
	
	run = function(self, result, testcases)
		if result == nil then
			result = TestResult:new()
		end
		for i, t in ipairs(self.tests) do
			if self:isNeedRun(t, testcases) then
				t:run(result)
			end
		end
		return result
	end;
	
	isNeedRun = function(self, curcase, testcases)
		if (testcases == nil) or (table.getn(testcases) == 0) then
			return true
		end
		
		for _, needTestName in ipairs(testcases) do
			if curcase:getClassName() == needTestName then 
				return true
			end
		end
		return false
	end;
})

isInclude = function(str, ...)
	local params = {...}
	for _, p in ipairs(params) do
		if string.find(str, p) == nil then return false end
	end
	return true
end;

isNotInclude = function(str, ...)
	local params = {...}
	for _, p in ipairs(params) do
		if string.find(str, p) ~= nil then return false end
	end
	return true
end;

floatEQ = function(a1, a2)
	return math.abs(a1 - a2) < 0.001
end;

listEQ = function(aList, bList)
	if table.getn(aList) ~= table.getn(bList) then
		return false
	end
	
	for i, aItem in ipairs( aList ) do
		local bItem = bList[i]
		if aItem ~= bItem then
			return false
		end
	end
	
	return true
end;

CompareUtil = Class:extends({
	eq = function(self, a, b)
		return self:_compareDict(a,b)
	end;
	
	_compareDict = function(self, aItem, bItem)
		local aType = type(aItem)
		local bType = type(bItem)
		if (aType ~= bType) then return false end
		if (aItem == bItem) then return true end
		
		if (aType == 'table' ) then
			for k, _ in pairs(bItem) do
				local a = aItem[k]
				local b = bItem[k]
				if ( not self:_compareDict(a, b) ) then
					return false
				end
			end
			
			for k, _ in pairs(aItem) do
				local a = aItem[k]
				local b = bItem[k]
				if ( not self:_compareDict(a, b) ) then
					return false
				end
			end
			
			return true
		else 
			return (aItem == bItem);
		end	
	end;
}):new()


