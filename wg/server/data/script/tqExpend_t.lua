require('tqPlayers')
require('tqStrategyHandler')
require('tqExpend')
require('tqMsgSender')

local TestCaseExpend = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		
		res_items = {{id=1, pile=100,nobindid=2},{id=2,pile=100}}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	fillRoleAttrs = function(self)
		local dbvar = self.player:getPersistVar()
		dbvar.stBInfos.stAttrs.ucCount = table.getn(res_role_initdata.attrs)
		for i, a in ipairs(res_role_initdata.attrs) do
			dbvar.stBInfos.stAttrs.astAttrs[i-1].usAttr = a.attr
			dbvar.stBInfos.stAttrs.astAttrs[i-1].ulVal = a.val
		end	
	end;	
	
	fillHeros = function(self)
		TestHeroData:new():make(self.player)
		self.hero = Hero:new(self.player:getPersistVar().stHeros.astHeros[0])
	end;
	
	-- ItemExpend
	testItemExpendEnough = function(self)
		self.player:getPkg():addItems({RawItemEx({resId=1, number=1})})
		local itemexpend = ItemExpend(self.player, {resid=1,val=1})
		assert(itemexpend:isEnough() == true)
	end;
	
	testItemExpendNoEnough = function(self)
		self.player:getPkg():addItems({RawItemEx({resId=1, number=1})})
		local itemexpend = ItemExpend(self.player, {resid=1,val=2})
		assert(itemexpend:isEnough() == false)
	end;
	
	testItemExpendSub = function(self)
		self.player:getPkg():addItems({RawItemEx({resId=1, number=2})})
		local itemexpend = ItemExpend(self.player, {resid=1,val=1})
		
		assert(itemexpend:isEnough() == true)
		itemexpend:sub()
		local item = self.player:getPkg():getItemByResId(1)
		assert(item:getNumber() == 1)
		
		assert(itemexpend:isEnough() == true)
		itemexpend:sub()
		local item = self.player:getPkg():getItemByResId(1)
		assert(item == nil)
		
		self.player:getPkg():addItems({RawItemEx({resId=1, number=2}),RawItemEx({resId=2, number=2})})
		local itemexpend = ItemExpend(self.player, {resid=1,val=3})
		assert(itemexpend:isEnough() == true)
		itemexpend:sub()
		local item = self.player:getPkg():getItemByResId(1)
		assert(item == nil)
		local item = self.player:getPkg():getItemByResId(2)
		assert(item:getNumber() == 1)
	end;
	
	-- RoleAttrExpend
	testRoleAttrExpendEnough = function(self)
		local rattrexpend = RoleAttrExpend(self.player, {attr=ATTR.STP,val=1})
		assert(rattrexpend:isEnough() == true)
	end;
	
	testRoleAttrExpendNoEnough = function(self)
		local rattrexpend = RoleAttrExpend(self.player, {attr=ATTR.STP,val=1000000})
		assert(rattrexpend:isEnough() == false)
	end;
	
	testRoleAttrExpendSub = function(self)
		local oldval = self.player:getAttr(ATTR.STP).ulVal
		local rattrexpend = RoleAttrExpend(self.player, {attr=ATTR.STP,val=1})
		assert(rattrexpend:isEnough() == true)
		rattrexpend:sub()
		assert(self.player:getAttr(ATTR.STP).ulVal == oldval - 1)
	end;
	
	-- HeroAttrExpend
	_testHeroAttrExpendEnough = function(self)
		local hattrexpend = HeroAttrExpend(self.player, self.hero, {attr=ATTR.XP,val=1})
		assert(hattrexpend:isEnough() == true)
	end;
	
	_testHeroAttrExpendNoEnough = function(self)
		local hattrexpend = HeroAttrExpend(self.player, self.hero, {attr=ATTR.XP,val=10000000})
		assert(hattrexpend:isEnough() == false)
	end;
	
	_testHeroAttrExpendSub = function(self)
		local oldval = self.hero:getAttr(ATTR.XP).ulVal
		local hattrexpend = HeroAttrExpend(self.player, self.hero, {attr=ATTR.XP,val=1})
		assert(hattrexpend:isEnough() == true)
		hattrexpend:sub()
		assert(self.hero:getAttr(ATTR.XP).ulVal == oldval - 1)
	end;
	
	-- MoneyExpend
	testMoneyExpendEnough = function(self)
		local cres = self.player:getCityRes()
		cres:setMLastTime(Util:getTime())
		cres:setMoney(2)
		local expend = MoneyExpend(self.player, {attr=ATTR.MONEY,val=2})
		assert(expend:isEnough() == true)
	end;
	
	testMoneyExpendNoEnough = function(self)
		self.mm:mock(WUtil, 'sendErrorMsgArgs')
		local cres = self.player:getCityRes()
		cres:setMLastTime(Util:getTime())
		cres:setMoney(1)
		local mexpend = MoneyExpend(self.player, {attr=ATTR.MONEY,val=3})
		assertEQ(mexpend:isEnough(), false)
		assertEQ(self.mm.params['sendErrorMsgArgs'], {self.player, 100159, 3})
	end;
	
	testMoneyExpendSub = function(self)
		local cres = self.player:getCityRes()
		cres:setMLastTime(Util:getTime())
		cres:setMoney(2)
		
		clearSendMsg_t()
		local mexpend = MoneyExpend(self.player, {attr=ATTR.MONEY,val=2})
		assert(mexpend:isEnough() == true)
		mexpend:sub()
		assert(cres:getMoney() == 0)
		assert(getSendMsg_t() ~= '')
	end;
	
	-- GoldExpend
	testGoldExpendEnough = function(self)
		self.player:getPkg():setGold(1)
		local goldexpend = GoldExpend(self.player, {attr=ATTR.GOLD,val=1})
		assert(goldexpend:isEnough() == true)	
	end;
	
	testGoldExpendNoEnough = function(self)
		self.mm:mock(WUtil, 'sendErrorMsgArgs')
		self.player:getPkg():setGold(1)
		local goldexpend = GoldExpend(self.player, {attr=ATTR.GOLD,val=2})
		assert(goldexpend:isEnough() == false)	
		assertEQ(self.mm.params['sendErrorMsgArgs'], {self.player, 100160, 2})		
	end;
	
	testGoldExpendSub = function(self)
		local pkg = self.player:getPkg()
		pkg:setGold(1)
		
		clearSendMsg_t()
		local goldexpend = GoldExpend(self.player, {attr=ATTR.GOLD,val=1})
		assert(goldexpend:isEnough() == true)
		goldexpend:sub()
		assert(pkg:getGold() == 0)
		assert(getSendMsg_t() == '{cmd:'..NETCMD.PKG..',pkg:{misc:{gold:0}}}')
	end;
	
	--GiftGoldExpend
	testGiftGoldExpendEnough = function(self)
		local pkg = self.player:getPkg()
		pkg:setGold(1)
		pkg:setGiftGold(1)
		local ggoldexpend = GiftGoldExpend(self.player, {attr=ATTR.GIFTGOLD,val=2})
		assert(ggoldexpend:isEnough() == true)	
	end;
	
	testGiftGoldExpendNoEnough = function(self)
		self.mm:mock(WUtil, 'sendErrorMsgArgs')
		local pkg = self.player:getPkg()
		pkg:setGold(1)
		pkg:setGiftGold(1)
		local ggoldexpend = GiftGoldExpend(self.player, {attr=ATTR.GIFTGOLD,val=3})
		assert(ggoldexpend:isEnough() == false)
		assertEQ(self.mm.params['sendErrorMsgArgs'], {self.player, 100161, 3})		
	end;
	
	testGiftGoldExpendSub = function(self)
		local pkg = self.player:getPkg()
		pkg:setGold(1)
		pkg:setGiftGold(1)
		
		clearSendMsg_t()
		local ggoldexpend = GiftGoldExpend(self.player, {attr=ATTR.GIFTGOLD,val=2})
		assert(ggoldexpend:isEnough() == true)	
		ggoldexpend:sub()
		assert(pkg:getAllGold() == 0)
		assert(getSendMsg_t() == '{cmd:'..NETCMD.PKG..',pkg:{misc:{gold:0,giftgold:0}}}')
	end;
	
	testGiftGoldExpendSubFirstSubGiftGold = function(self)
		local pkg = self.player:getPkg()
		pkg:setGold(1)
		pkg:setGiftGold(1)
		local ggoldexpend = GiftGoldExpend(self.player, {attr=ATTR.GIFTGOLD,val=1})
		assert(ggoldexpend:isEnough() == true)	
		ggoldexpend:sub()
		assert(pkg:getGiftGold() == 0)	
	end;
	
	-- CommResExpend
	testCommResExpendEnough = function(self)
		local cres = self.player:getCityRes()
		cres:setFood(3)
		local expend = CommResExpend(self.player, {id=20001,val=3})
		assert(expend:isEnough() == true)
		
		cres:setWood(3)
		local expend = CommResExpend(self.player, {id=20002,val=3})
		assert(expend:isEnough() == true)
		
		cres:setStone(3)
		local expend = CommResExpend(self.player, {id=20003,val=3})
		assert(expend:isEnough() == true)
		
		cres:setIron(3)
		local expend = CommResExpend(self.player, {id=20004,val=3})
		assert(expend:isEnough() == true)
	end;
	
	testCommResExpendNoEnough = function(self)
		local cres = self.player:getCityRes()
		cres:setFood(3)
		local expend = CommResExpend(self.player, {id=20001,val=4})
		assert(expend:isEnough() ~= true)
	end;
	
	testCommResExpendSub = function(self)
		local cres = self.player:getCityRes()
		cres:setFood(3)
		local expend = CommResExpend(self.player, {id=20001,val=1})
		assert(expend:isEnough() == true)
		expend:sub()
		assert(cres:getFood() == 2)
	end;
	
	--IdlePopuExpend
	testIdlePopuExpendEnough = function(self)
		local cres = self.player:getCityRes()
		cres:setIdlePopu(100)

		local expend = IdlePopuExpend(self.player, {attr=ATTR.IDLEPOPU,val=100})
		assert(expend:isEnough() == true)
	end;
	
	testIdlePopuExpendNoEnough = function(self)
		local cres = self.player:getCityRes()
		cres:setIdlePopu(90)

		local expend = IdlePopuExpend(self.player, {attr=ATTR.IDLEPOPU,val=100})
		assert(expend:isEnough() == false)
	end;
	
	testIdlePopuExpendSub = function(self)
		local cres = self.player:getCityRes()
		cres:setIdlePopu(100)

		local expend = IdlePopuExpend(self.player, {attr=ATTR.IDLEPOPU,val=100})
		assert(expend:isEnough() == true)
		
		expend:sub()
		assert(cres:getIdlePopu() == 0)
	end;
	
	--PrestigeExpend
	testPrestigeExpendEnough = function(self)
		self.player:setPrestige(100)

		local expend = PrestigeExpend(self.player, {attr=ATTR.PRESTIGE,val=100})
		assert(expend:isEnough() == true)
	end;
	
	testPrestigeExpendNoEnough = function(self)
		self.player:setPrestige(90)

		local expend = PrestigeExpend(self.player, {attr=ATTR.PRESTIGE,val=100})
		
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		assert(expend:isEnough() == false)
		assert(self.mm.walkLog == 'sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100024, ''} )
	end;
	
	testPrestigeExpendSub = function(self)
		self.player:setPrestige(100)

		local expend = PrestigeExpend(self.player, {attr=ATTR.PRESTIGE,val=100})
		assert(expend:isEnough() == true)
		
		self.mm:mock(RoleBaseSender, 'send')
		
		expend:sub()
		
		assert ( self.mm.walkLog == 'send' )
		assert ( self.mm.params['send'][1] == self.player )
		assert ( self.mm.params['send'][2][1] == 'prestige' )
		assert ( self.player:getPrestige() == 0)
	end;
	
	--HonorExpend
	testHonorExpendEnough = function(self)
		self.player:setCityHonor(100)

		local expend = HonorExpend(self.player, {attr=ATTR.HONOR,val=100})
		assert(expend:isEnough() == true)
	end;
	
	testHonorExpendNoEnough = function(self)
		self.player:setCityHonor(99)

		local expend = HonorExpend(self.player, {attr=ATTR.HONOR,val=100})
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		assert(expend:isEnough() == false)
		assert(self.mm.walkLog == 'sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100197, ''} )
	end;
	
	testHonorExpendSub = function(self)
		self.player:setCityHonor(100)

		local expend = HonorExpend(self.player, {attr=ATTR.HONOR,val=100})
		assert(expend:isEnough() == true)
		
		self.mm:mock(RoleBaseSender, 'send')
		expend:sub()
		assert ( self.mm.walkLog == 'send' )
		assertEQ ( self.mm.params['send'], {self.player, {'cityhonor'} } )
		assert ( self.player:getCityHonor() == 0)
	end;
})



tqExpend_t_main = function(suite)
	suite:addTestCase(TestCaseExpend,'TestCaseExpend')
end;



