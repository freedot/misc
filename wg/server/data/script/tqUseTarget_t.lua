require('tqUseTarget')
require('tqHeroResHandler_t')

local TestCaseUseTarget = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		
		self.hero = HeroTestCaseHelper:createOneNewHero( self.player, self.player:getHeroMgr() )
		clearSendMsg_t()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testBuildingIBuildTarget = function(self)
		local cmd = {ttype=RES_TRG.BUILDING_IBUILD,tid=1,tcid=1}
		local params = UseTarget:parse(self.player, cmd)
		assert( params ~= nil )
		assert( params.build ~= nil )
		assert( params.cityid == 1 )
		assert( params.netcmd == cmd )
	end;
	
	testSelfNewHerosTarget = function(self)
		local cmd = {ttype=RES_TRG.SELF_NEWHEROS}
		local params = UseTarget:parse(self.player, cmd)
		assert( params ~= nil )
		assert( params.netcmd == cmd )
	end;
	
	testSelfHeroTarget = function(self)
		local cmd = {ttype=RES_TRG.SELF_HERO,tid=1}
		local params = UseTarget:parse(self.player, cmd)
		assert( params ~= nil )
		assert( params.hero == self.hero )
		assert( params.netcmd == cmd )
	end;
})

tqUseTarget_t_main = function(suite)
	suite:addTestCase(TestCaseUseTarget, 'TestCaseUseTarget')
end;

