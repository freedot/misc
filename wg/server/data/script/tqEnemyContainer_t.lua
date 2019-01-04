--*******************************************************************************
--*******************************************************************************
require('tqEnemyContainer')

local TestCaseEnemyContainer = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.enemyContainer = self.player:getEnemyContainer()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testAdd = function(self)
		self.enemyContainer:add(2)
		assert ( self.enemyContainer:getCount() == 1 )
		assert ( self.enemyContainer:getByIdx(0) == 2 )
	end;
	
	testDelete = function(self)
		self.enemyContainer:add(2)
		self.enemyContainer:delete(2)
		assert ( self.enemyContainer:getCount() == 0)
	end;
	
	testAddReplaceOldWhenBeyondMaxLength = function(self)
		local res_enemy_base_cnt_ = res_enemy_base_cnt
		res_enemy_base_cnt = 2
		
		self.enemyContainer:add(1)
		self.enemyContainer:add(2)
		assert ( self.enemyContainer:getCount() == 2 )
		assert ( self.enemyContainer:getByIdx(0) == 1 )
		assert ( self.enemyContainer:getByIdx(1) == 2 )
		
		self.enemyContainer:add(3)
		assert ( self.enemyContainer:getCount() == 2 )
		assert ( self.enemyContainer:getByIdx(0) == 2 )
		assert ( self.enemyContainer:getByIdx(1) == 3 )
		
		res_enemy_base_cnt = res_enemy_base_cnt_
	end;
	
	test_getMaxCount = function(self)
		assertEQ ( self.enemyContainer:_getMaxCount(), res_enemy_base_cnt )
		self.player:setVipLevel(3)
		assertEQ ( self.enemyContainer:_getMaxCount(), res_enemy_base_cnt + 30)
	end;
	
	testAddRepeatEnemy = function(self)
		self.enemyContainer:add(1)
		assert ( self.enemyContainer:getCount() == 1 )
		assert ( self.enemyContainer:getByIdx(0) == 1 )
		
		self.enemyContainer:add(1)
		assert ( self.enemyContainer:getCount() == 1 )
		assert ( self.enemyContainer:getByIdx(0) == 1 )
	end;
})


tqEnemyContainer_t_main = function(suite)
	suite:addTestCase(TestCaseEnemyContainer, 'TestCaseEnemyContainer')
end;


