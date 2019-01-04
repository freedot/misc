--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqFavoriteContainer')

local TestCaseFavoriteContainer = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.favoriteContainer = self.player:getFavoriteContainer()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_init = function(self)
		assertEQ ( self.favoriteContainer.player, self.player )
	end;
	
	testAdd = function(self)
		self.mm:mock(self.favoriteContainer, '_removeFirstElemWhenFull')
		self.mm:mock(MilitarySender, 'sendAddFavorite')
		
		self.favoriteContainer:add(2)
		assertEQ ( self.mm.walkLog, '_removeFirstElemWhenFull,sendAddFavorite' )
		assertEQ ( self.favoriteContainer:getCount(),  1 )
		assertEQ ( self.favoriteContainer:getByIdx(0), 2 )
		assertEQ ( self.mm.params['sendAddFavorite'], {self.player, 2} )
	end;
	
	testDelete = function(self)
		self.mm:mock(MilitarySender, 'sendDelFavorite' )
		self.favoriteContainer:add(2)
		self.favoriteContainer:delete(2)
		assertEQ ( self.favoriteContainer:getCount(), 0 )
		assertEQ ( self.mm.params['sendDelFavorite'], {self.player, 2} )
	end;	
	
	test__removeFirstElemWhenFull = function(self)
		local MAX_FAVORITE_CNT_ = MAX_FAVORITE_CNT
		MAX_FAVORITE_CNT = 2
		
		self.favoriteContainer:add(1)
		self.favoriteContainer:_removeFirstElemWhenFull()
		assertEQ ( self.favoriteContainer:getCount(), 1 )
		assertEQ ( self.favoriteContainer:getByIdx(0), 1 )
		
		self.favoriteContainer:add(2)
		assertEQ ( self.favoriteContainer:getCount(), 2 )
		
		self.favoriteContainer:_removeFirstElemWhenFull()
		assertEQ ( self.favoriteContainer:getCount(), 1 )
		assertEQ ( self.favoriteContainer:getByIdx(0), 2 )
		
		MAX_FAVORITE_CNT = MAX_FAVORITE_CNT_
	end;
	
	testAddRepeatFieldId = function(self)
		self.favoriteContainer:add(1)
		assert ( self.favoriteContainer:getCount() == 1 )
		assert ( self.favoriteContainer:getByIdx(0) == 1 )
		
		self.favoriteContainer:add(1)
		assert ( self.favoriteContainer:getCount() == 1 )
		assert ( self.favoriteContainer:getByIdx(0) == 1 )
	end;
	
	testHas = function(self)
		self.favoriteContainer:add(1)
		assert ( self.favoriteContainer:has(1) == true )
	end;
})


tqFavoriteContainer_t_main = function(suite)
	suite:addTestCase(TestCaseFavoriteContainer, 'TestCaseFavoriteContainer')
end;


