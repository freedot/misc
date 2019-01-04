--*******************************************************************************
require('tqQueryGoldHandler')

local TestCaseQueryGoldHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(PkgMiscSender, 'send') --(self.player, {'gold'})
		local player = TestCaseHelper:loadPlayerByUserNameEx('player', 'player_r', 100000)
		local cmd = {openid='player',ret=-1,msg='error'}
		QueryGoldHandler():onRequest(nil, nil, cmd)
		assertEQ ( player:getPkg():getGold(), 0 )
		
		local cmd = {openid='offlineplayer',ret=0,gold=100}
		QueryGoldHandler():onRequest(nil, nil, cmd)
		assertEQ ( player:getPkg():getGold(), 0 )
		
		local cmd = {openid='player',ret=0,gold=100}
		QueryGoldHandler():onRequest(nil, nil, cmd)
		assertEQ ( player:getPkg():getGold(), 100 )
		assertEQ ( self.mm.params['send'], {player, {'gold'}} )
	end;
})


tqQueryGoldHandler_t_main = function(suite)
	suite:addTestCase(TestCaseQueryGoldHandler, 'TestCaseQueryGoldHandler')
end;


