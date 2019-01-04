require('tqClass')

BaseClass = Class:extends({
	init = function(self, state )
		self.state = state
	end;
	
	getState = function(self)
		return self.state
	end;
	
	setState = function(self, state)
		self.state = state
	end;
})

MyClass = BaseClass:extends({
	getState = function(self)
		return self.state
	end;
	
	setState = function(self, state)
		self.state = state
	end;
})

doTestCase1 = function()
	local myclass = MyClass:new()
	myclass:setState(20)
	assert(myclass:getState() == 20)
end

doTestCase2 = function()
	local baseclass = BaseClass:new()
	baseclass:setState(30)
	local myclass = MyClass:new()
	myclass:setState(20)
	assert(myclass:getState() ~= baseclass:getState())
end

doTestCase3 = function()
	assert(table.gettype(BaseClass) == TABLE_CLASS)
end

doTestCase4 = function()
	local baseclass = BaseClass:new()
	assert(table.gettype(baseclass) == TABLE_INSTANCE)
end

doTestCase5 = function()
	local baseclass = BaseClass:new(100)
	assert(baseclass:getState() == 100)
end

doTestCase6 = function()
	local myclass = MyClass:new(200)
	assert(myclass:getState() == 200)
end

doTestCase7 = function()
	local myclass = MyClass(300)
	assert(myclass:getState() == 300)
	assert(table.gettype(myclass) == TABLE_INSTANCE)
end

doTestCase8 = function()
	local a = MyClass(1)
	local b = MyClass(2)
	assert(a.setState == b.setState)
end

doTestSuit = function()
	print('start test...')
	doTestCase1()
	doTestCase2()
	doTestCase3()
	doTestCase4()
	doTestCase5()
	doTestCase6()
	doTestCase7()
	doTestCase8()
	print('test ok!')
end

doTestSuit()


