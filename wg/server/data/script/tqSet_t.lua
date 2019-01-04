--*******************************************************************************
require('tqSet')

local TestCaseSet = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.set = Set('id', 2)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_init = function(self)
		assertEQ ( self.set.list, {} )
		assertEQ ( self.set.keyName, 'id' )
		assertEQ ( self.set.maxCount, 2 )
	end;
	
	test_isFull = function(self)
		assertEQ ( self.set:isFull(), false )
		self.set.list = {{id=1},{id=2}}
		assertEQ ( self.set:isFull(), true )
	end;
	
	test_has = function(self)
		self.set.list = {{id=1}}
		assertEQ ( self.set:has(2), false )
		assertEQ ( self.set:has(1), true )
	end;
	
	test_insert = function(self)
		assertEQ ( self.set:insert({id=1}), true )
		assertEQ ( self.set:getCount(), 1 )
		assertEQ ( self.set:insert({id=1}), false )
		assertEQ ( self.set:getCount(), 1 )
		assertEQ ( self.set:insert({id=2}), true )
		assertEQ ( self.set:getCount(), 2 )
		assertEQ ( self.set:insert({id=3}), false )
		assertEQ ( self.set:getCount(), 2 )
	end;
	
	test_remove = function(self)	
		self.set:insert({id=1})
		self.set:insert({id=2})
		assertEQ ( self.set:getCount(), 2 )
		self.set:remove(1)
		assertEQ ( self.set:getCount(), 1 )
		assertEQ ( self.set:get(0).id, 2 )
	end;
	
	test_removeByIdx = function(self)
		self.set:insert({id=1})
		self.set:insert({id=2})
		assertEQ ( self.set:getCount(), 2 )
		self.set:removeByIdx(0)
		assertEQ ( self.set:getCount(), 1 )
		assertEQ ( self.set:get(0).id, 2 )
	end;
	
	test_getCount = function(self)
		assertEQ ( self.set:getCount(), 0 )
		self.set.list = {{id=1}}
		assertEQ ( self.set:getCount(), 1 )
	end;
	
	test_get = function(self)
		self.set.list = {{id=1},{id=2}}
		assertEQ ( self.set:get(0).id, 1 )
		assertEQ ( self.set:get(1).id, 2 )
	end;
})


tqSet_t_main = function(suite)
	suite:addTestCase(TestCaseSet, 'TestCaseSet')
end;


