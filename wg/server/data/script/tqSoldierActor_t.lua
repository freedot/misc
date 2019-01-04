--*******************************************************************************
--*******************************************************************************
require('tqSoldierActor')

local TestCaseSoldierActor = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseCondition:setPreCond(self.player, nil, { heros={{state=0,soldier={resid=150001001,number=10}}} })
		self.hero = self.player:getHeroMgr():getHeroByIdx(0)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testGetName = function(self)
		local actor = SoldierActor()
		actor:setHero(self.hero)
		assert ( actor:getName() == actor:getHero():getName() )
	end;
	
	test_calcActorAttrs = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {  cultures={{id=120007, level=1},{id=120008, level=2},{id=120009, level=3}} })
		
		local actor = SoldierActor()
		actor:setHero(self.hero)
		actor:calcActorAttrs()
		
		local res = ItemResUtil:findItemres(150001)
		local localenv = {LV=1}
		local basestr = eval(res.str, localenv)
		local basephy = eval(res.phy, localenv)
		local baseagile = eval(res.agile, localenv)
		local mspeed = eval(res.mspeed, localenv)
		local arange = eval(res.arange, localenv)
		local aspeed = eval(res.aspeed, localenv)
		
		assert ( actor.soldierAttr.mspeed == mspeed )
		assert ( actor.soldierAttr.arange == arange )
		assert ( actor.soldierAttr.aspeed == aspeed )
	end;
	
	test_subHP = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {  cultures={{id=120007, level=1},{id=120008, level=2},{id=120009, level=3}} })
		local actor = SoldierActor()
		actor:setHero(self.hero)
		local hp = actor:getAttrVal(ATTR.HP)
		local uhp = actor:getAttrVal(ATTR.UHP)
		assertEQ ( actor:getHero():getSoldierNumber(), 10 )
		actor:subHP(uhp)
		assertEQ ( actor:getHero():getSoldierNumber(), 9 )
		actor:addHP(uhp)
		assertEQ ( actor:getHero():getSoldierNumber(), 10 )
		actor:subHP(uhp)
		assertEQ ( actor:getHero():getSoldierNumber(), 9 )
		actor:subHP(uhp/5)
		assertEQ ( actor:getHero():getSoldierNumber(), 8 )
		actor:subHP(uhp/5)
		assertEQ ( actor:getHero():getSoldierNumber(), 8 )
		actor:subHP(uhp*9)
		assertEQ ( actor:getHero():getSoldierNumber(), 0 )
		assertEQ ( actor:isDie(), true )
	end;
	
	test_getSoldierLevel = function(self)
		local actor = SoldierActor()
		actor:setHero(self.hero)
		assertEQ ( actor:getSoldierLevel() , 1 )
	end;
	
	test_getAdaptableFactor = function(self)
		local actor = SoldierActor()
		actor:setHero(self.hero)
		assertEQ ( actor:getAdaptableFactor() , actor:getHero():getAdaptableFactor() )
	end;

})


tqSoldierActor_t_main = function(suite)
	suite:addTestCase(TestCaseSoldierActor, 'TestCaseSoldierActor')
end;


