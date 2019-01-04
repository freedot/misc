--*******************************************************************************
require('tqPlayerClientCfg')

local TestCasePlayerClientCfg = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.clientCfg = self.player:getClientCfg()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	check_force = function(self, node, ttype, lineup, heros, msg)
		assertEQ ( node.type, ttype, msg)
		assertEQ ( node.lineup, lineup, msg)
		assertEQ ( node.heroCount, #heros, msg)
		for i=0, #heros-1, 1 do
			assertEQ ( node.heroIds[i], heros[i+1], msg .. ':' .. i  )
		end
	end;
	
	test_getForceLineupCount = function(self)
		assertEQ ( self.clientCfg:getForceLineupCount(), 0 )
		local ttype = 1; local lineup = 180001; local heros = {1,0,2}
		assertEQ ( self.clientCfg:addForceLineup(ttype, lineup, heros), true )
		assertEQ ( self.clientCfg:getForceLineupCount(), 1 )
		self:check_force(self.clientCfg:getForceLineup(0), ttype, lineup, heros, 'check first node')
		
		ttype = 1; lineup = 180002; heros = {1,0,2,3}
		assertEQ ( self.clientCfg:addForceLineup(ttype, lineup, heros), true )
		assertEQ ( self.clientCfg:getForceLineupCount(), 1 )
		self:check_force(self.clientCfg:getForceLineup(0), ttype, lineup, heros, 'check first node, be replaced')
		
		ttype = 2; lineup = 180003; heros = {1,0,3}
		assertEQ ( self.clientCfg:addForceLineup(ttype, lineup, heros), true )
		assertEQ ( self.clientCfg:getForceLineupCount(), 2 )
		self:check_force(self.clientCfg:getForceLineup(1), ttype, lineup, heros, 'check sec node')
		
		ttype = 3; lineup = 180003; heros = {1,0,3}
		assertEQ ( self.clientCfg:addForceLineup(ttype, lineup, heros), false )
		assertEQ ( self.clientCfg:getForceLineupCount(), 2 )
	end;
	
	test_getToggleMapFlag = function(self)
		assertEQ ( self.clientCfg:getToggleMapFlag(0), 0 )
		assertEQ ( self.clientCfg:getToggleMapFlag(1), 0 )
		assertEQ ( self.clientCfg:getToggleMapFlag(2), 0 )
		assertEQ ( self.clientCfg:getToggleMapFlag(3), 0 )
		
		self.clientCfg:setToggleMapFlag(0, 1)
		assertEQ ( self.clientCfg:getToggleMapFlag(0), 1 )
	end;
	
	test_getHelpTips = function(self)
		local helpTips = self.clientCfg:getHelpTips()
		helpTips:insert({id=1, times=10})
		assertEQ ( helpTips:has(1), true )
		assertEQ ( helpTips:has(2), false )
		assertEQ ( helpTips:getByValKey(1).times, 10 )
	end;
})

tqPlayerClientCfg_t_main = function(suite)
	suite:addTestCase(TestCasePlayerClientCfg, 'TestCasePlayerClientCfg')
end;


