--*******************************************************************************
require('tqSendRewardHandler')

local TestCaseSendFirstHeroRewardHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.player:setLevel(1)
		self.hdr = SendRewardHandler():getHandler(1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(HeroAttrSender, 'sendDetailHero')
		self.mm:mock(WUtil, 'sendNpcMsg')
		assertEQ ( self.hdr:handle(self.player, {nameIdx=-1}), false)
		assertEQ ( self.hdr:handle(self.player, {nameIdx=table.getn(rstr.firstRewardHeroNames)}), false )
		assertEQ ( self.hdr:handle(self.player, {nameIdx=0}), true)
		assertEQ ( self.player:getHeroMgr():getHeroCount(), 1 )
		local hero = self.player:getHeroMgr():getHeroByIdx(0)
		assertEQ ( hero:getAttrVal(ATTR.NAG), res_heronature_max_attrs[HERO_PROF.YONGSHI][ATTR.NST] )
		assertEQ ( hero:getAttrVal(ATTR.NPH), res_heronature_max_attrs[HERO_PROF.YONGSHI][ATTR.NPH] )
		assertEQ ( hero:getAttrVal(ATTR.NST), res_heronature_max_attrs[HERO_PROF.YONGSHI][ATTR.NAG] )
		assertEQ ( hero:getSex(), rstr.firstRewardHeroNames[1].sex )
		assertEQ ( hero:getIcon(), rstr.firstRewardHeroNames[1].icon )
		assertEQ ( hero:getName(), rstr.firstRewardHeroNames[1].name )
		assertEQ ( hero:getLevel(), 1 )
		assertEQ ( hero:getProf(), HERO_PROF.YONGSHI )
		assertEQ ( self.mm.params['sendDetailHero'], {self.player, hero})
		assertEQ ( self.mm.params['sendNpcMsg'], { self.player, string.format(rstr.firstHeroPopMsg, hero:getName()) })
		
		assertEQ ( self.hdr:handle(self.player, {nameIdx=0}), false, 'already sended')
	end;
})


tqSendRewardHandler_t_main = function(suite)
	suite:addTestCase(TestCaseSendFirstHeroRewardHandler, 'TestCaseSendFirstHeroRewardHandler')
end;


