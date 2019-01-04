--*******************************************************************************
require('tqMapCppSet')

local TestCaseMapCppSet = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.skills = CppPlayerVar:allocVar('SSkillList', nil)
	end;
	
	tearDown = function(self)
		CppPlayerVar:freeVar(self.skills.hdr)
		TestCaseHelper:clearAll(self)
	end;
	
	test_init = function(self)
		self.skills.var.ucCount = 2
		self.skills.var.astSkills[0].ulResId = 1
		self.skills.var.astSkills[1].ulResId = 2		
		
		local set = MapCppSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 3)
		assert ( set.innerLists == self.skills.var )
		assert ( set.countName == 'ucCount' )
		assert ( set.keyName == 'ulResId' )
		assert ( set.maxCount == 3 )
		assert ( set.lists == self.skills.var.astSkills )
	end;
	
	test_isFull = function(self)
		self.skills.var.ucCount = 1
		self.skills.var.astSkills[0].ulResId = 1
		
		local set = MapCppSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 0)
		assert ( set:isFull() == true )
		
		local set = MapCppSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 1)
		assert ( set:isFull() == true )
		
		local set = MapCppSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 2)
		assert ( set:isFull() == false )
	end;
	
	test_has = function(self)
		self.skills.var.ucCount = 1
		self.skills.var.astSkills[0].ulResId = 1
		local set = MapCppSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 2)
		
		assert ( set:has( 2 ) == false )
		assert ( set:has( 1 ) == true )
	end;
	
	test_getByValKey = function(self)
		self.skills.var.ucCount = 1
		self.skills.var.astSkills[0].ulResId = 1
		local set = MapCppSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 2)
		
		assert ( set:getByValKey( 2 ) == nil )
		assert ( set:getByValKey( 1 ) == self.skills.var.astSkills[0] )
	end;
	
	test_getCount = function(self)
		self.skills.var.ucCount = 1
		local set = MapCppSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 2)
		assert ( set:getCount() == 1 )
	end;
	
	test_get = function(self)
		self.skills.var.ucCount = 1
		self.skills.var.astSkills[0].ulResId = 1
		local set = MapCppSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 2)
		assert ( set:get( 0 ) == self.skills.var.astSkills[0] )
	end;
	
	test_insert = function(self)
		self.skills.var.ucCount = 1
		self.skills.var.astSkills[0].ulResId = 1
		
		local set = MapCppSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 2)
		
		self.skills.var.astSkills[4].ulResId = 1 -- only temp var
		assert ( set:insert( self.skills.var.astSkills[4] ) == false )
		assert ( set:getCount() == 1 )
		
		self.skills.var.astSkills[4].ulResId = 2 -- only temp var
		assert ( set:insert( self.skills.var.astSkills[4] ) == true )
		assert ( set:getCount() == 2 )
		assert ( set:get(1).ulResId == 2 )
		
		self.skills.var.astSkills[4].ulResId = 3 -- only temp var
		assert ( set:insert( self.skills.var.astSkills[4] ) == false, 'arrive max count' )
		assert ( set:getCount() == 2 )
	end;
	
	test_remove = function(self)
		self.skills.var.ucCount = 1
		self.skills.var.astSkills[0].ulResId = 1
		
		local set = MapCppSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 2)
		
		set:remove(0)
		assert ( set:getCount() == 1 )
		
		set:remove(1)
		assert ( set:getCount() == 0 )
	end;
	
	test_getKeyVal = function(self)
		self.skills.var.ucCount = 1
		self.skills.var.astSkills[0].ulResId = 1
		local set = MapCppSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 2)
		
		self.skills.var.astSkills[1].ulResId = 2
		assert ( set:_getKeyVal(self.skills.var.astSkills[1]) == 2 )
		
		local smilitary = CppPlayerVar:allocVar('SMilitary', nil)
		smilitary.var.succCopyFieldCount = 1
		smilitary.var.succCopyFields[0] = 1
		local set = MapCppSet(smilitary.var, 'succCopyFieldCount', 'succCopyFields', nil, 2)
		
		assert ( set:_getKeyVal(10) == 10 )
		
		CppPlayerVar:freeVar(smilitary.hdr)
	end;
	
	test_clear = function(self)
		self.skills.var.ucCount = 1
		self.skills.var.astSkills[0].ulResId = 1
		
		local set = MapCppSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 2)
		assertEQ ( set:getCount(), 1 )
		set:clear()
		assertEQ ( set:getCount(), 0 )
	end;
})

local TestCaseMapCppSortSet = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.skills = CppPlayerVar:allocVar('SSkillList', nil)
	end;
	
	tearDown = function(self)
		CppPlayerVar:freeVar(self.skills.hdr)
		TestCaseHelper:clearAll(self)
	end;
	
	test_init = function(self)
		self.skills.var.ucCount = 2
		self.skills.var.astSkills[0].ulResId = 1
		self.skills.var.astSkills[1].ulResId = 2		
		
		local set = MapCppSortSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 3)
		assert ( set.innerLists == self.skills.var )
		assert ( set.countName == 'ucCount' )
		assert ( set.keyName == 'ulResId' )
		assert ( set.maxCount == 3 )
		assert ( set.lists == self.skills.var.astSkills )
	end;
	
	test_isFull = function(self)
		self.skills.var.ucCount = 1
		self.skills.var.astSkills[0].ulResId = 1
		
		local set = MapCppSortSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 0)
		assert ( set:isFull() == true )
		
		local set = MapCppSortSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 1)
		assert ( set:isFull() == true )
		
		local set = MapCppSortSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 2)
		assert ( set:isFull() == false )
	end;
	
	test_has = function(self)
		self.skills.var.ucCount = 1
		self.skills.var.astSkills[0].ulResId = 1
		local set = MapCppSortSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 2)
		
		assert ( set:has( 2 ) == false )
		assert ( set:has( 1 ) == true )
	end;
	
	test_insert = function(self)
		self.skills.var.ucCount = 1
		self.skills.var.astSkills[0].ulResId = 3
		
		local set = MapCppSortSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 2)
		
		self.skills.var.astSkills[4].ulResId = 3 -- only temp var
		assert ( set:insert( self.skills.var.astSkills[4] ) == false )
		assert ( set:getCount() == 1 )
		
		self.skills.var.astSkills[4].ulResId = 2 -- only temp var
		assert ( set:insert( self.skills.var.astSkills[4] ) == true )
		assert ( set:getCount() == 2 )
		assert ( set:get(0).ulResId == 2 )
		assert ( set:get(1).ulResId == 3 )
		
		self.skills.var.astSkills[4].ulResId = 4 -- only temp var
		assert ( set:insert( self.skills.var.astSkills[4] ) == false, 'arrive max count' )
		assert ( set:getCount() == 2 )
		
		
		self.skills.var.ucCount = 0
		local set = MapCppSortSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 2)
		
		self.skills.var.astSkills[4].ulResId = 4 -- only temp var
		assert ( set:insert( self.skills.var.astSkills[4] ) == true )
		assert ( set:getCount() == 1 )
		assert ( set:get(0).ulResId == 4 )
		
		
		self.skills.var.ucCount = 8
		self.skills.var.astSkills[0].ulResId = 10
		self.skills.var.astSkills[1].ulResId = 20
		self.skills.var.astSkills[2].ulResId = 30
		self.skills.var.astSkills[3].ulResId = 40
		self.skills.var.astSkills[4].ulResId = 50
		self.skills.var.astSkills[5].ulResId = 70
		self.skills.var.astSkills[6].ulResId = 80
		self.skills.var.astSkills[7].ulResId = 90
		local set = MapCppSortSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 10)
		
		self.skills.var.astSkills[10].ulResId = 81 -- only temp var
		assert ( set:insert( self.skills.var.astSkills[10] ) == true )
		assert ( set:getCount() == 9 )
		assert ( set:get(6).ulResId == 80 )
		assert ( set:get(7).ulResId == 81 )
		assert ( set:get(8).ulResId ==90 )
		
		
		self.skills.var.ucCount = 8
		self.skills.var.astSkills[0].ulResId = 10
		self.skills.var.astSkills[1].ulResId = 20
		self.skills.var.astSkills[2].ulResId = 30
		self.skills.var.astSkills[3].ulResId = 40
		self.skills.var.astSkills[4].ulResId = 50
		self.skills.var.astSkills[5].ulResId = 70
		self.skills.var.astSkills[6].ulResId = 80
		self.skills.var.astSkills[7].ulResId = 90
		local set = MapCppSortSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 10)
		
		self.skills.var.astSkills[10].ulResId = 71 -- only temp var
		assert ( set:insert( self.skills.var.astSkills[10] ) == true )
		assert ( set:getCount() == 9 )
		assert ( set:get(5).ulResId == 70 )
		assert ( set:get(6).ulResId == 71 )
		assert ( set:get(7).ulResId == 80 )
		assert ( set:get(8).ulResId == 90 )
		
		self.skills.var.ucCount = 8
		self.skills.var.astSkills[0].ulResId = 10
		self.skills.var.astSkills[1].ulResId = 20
		self.skills.var.astSkills[2].ulResId = 30
		self.skills.var.astSkills[3].ulResId = 40
		self.skills.var.astSkills[4].ulResId = 50
		self.skills.var.astSkills[5].ulResId = 70
		self.skills.var.astSkills[6].ulResId = 80
		self.skills.var.astSkills[7].ulResId = 90
		local set = MapCppSortSet(self.skills.var, 'ucCount', 'astSkills', 'ulResId', 10)
		
		self.skills.var.astSkills[10].ulResId = 91 -- only temp var
		assert ( set:insert( self.skills.var.astSkills[10] ) == true )
		assert ( set:getCount() == 9 )
		assert ( set:get(7).ulResId == 90 )
		assert ( set:get(8).ulResId == 91 )
	end;
})


tqMapCppSet_t_main = function(suite)
	suite:addTestCase(TestCaseMapCppSet, 'TestCaseMapCppSet')
	suite:addTestCase(TestCaseMapCppSortSet, 'TestCaseMapCppSortSet')
end;


