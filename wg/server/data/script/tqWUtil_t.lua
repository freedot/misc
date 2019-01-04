require('tqPlayers')
require('tqStrategyHandler')
require('tqExpend')
require('tqWUtil')

local TestCaseWUtil = TestCase:extends({
	setUp = function(self)
	end;
	
	tearDown = function(self)
	end;
	
	testCreateExpendObjs = function(self)
		local expendobj = WUtil:createExpendObjs(self.player, self.hero, {
			{attr=ATTR.XP, type=EXPEND_TYPE.HEROATTR, val=1},
			{attr=ATTR.XP, type=EXPEND_TYPE.ROLEATTR, val=1},
			{resid=1, type=EXPEND_TYPE.ITEM, val=1},
			{attr=ATTR.MONEY, type=EXPEND_TYPE.MONEY, val=1},
			{attr=ATTR.GOLD, type=EXPEND_TYPE.GOLD, val=1},
			{attr=ATTR.GIFTGOLD, type=EXPEND_TYPE.GIFTGOLD, val=1},
			{attr=ATTR.IDLEPOPU, type=EXPEND_TYPE.IDLEPOPU, val=1},
			{attr=ATTR.PRESTIGE, type=EXPEND_TYPE.PRESTIGE, val=1},
			})
		assert(expendobj[1]:getClass() == HeroAttrExpend)
		assert(expendobj[2]:getClass() == RoleAttrExpend)
		assert(expendobj[3]:getClass() == ItemExpend)
		assert(expendobj[4]:getClass() == MoneyExpend)
		assert(expendobj[5]:getClass() == GoldExpend)
		assert(expendobj[6]:getClass() == GiftGoldExpend)
		assert(expendobj[7]:getClass() == IdlePopuExpend)
		assert(expendobj[8]:getClass() == PrestigeExpend)
	end;
})

tqWUtil_t_main = function(suite)
	suite:addTestCase(TestCaseWUtil, 'TestCaseWUtil')
end;



