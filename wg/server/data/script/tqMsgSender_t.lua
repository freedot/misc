require('tqPlayers')
require('tqStrategyHandler')
require('tqExpend')
require('tqWUtil')
require('tqHeroResHandler')
require('tqMsgSender')

local TestCaseMsgSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testGetCommListMsg = function(self)
		local callbackItem = function(self, item)
			return item.id
		end
		local rtstr = MsgSender():getCommListMsg({{id=1},{id=2}},1,2,self, callbackItem)
		assert(rtstr == '[1,2]')
	end;
	
	testGetCommDictMsg = function(self)
		local callbackItem = function(self, item)
			return item.id
		end
		local rtstr = MsgSender():getCommDictMsg({{id=1},{id=2}},1,2,self, callbackItem)
		assert(rtstr == '{1,2}')
	end;
	
	testGetHeroInfoSendMsg = function(self)
		local str = MsgSender():getHeroInfoSendMsg(self.hero, 'skills:[]')
		local rt = '{cmd:'..NETCMD.HERORES..',heros:[{id:'..self.hero:getId()..',skills:[]}]}'
		assert(str == rt)
	end;
	
	testGetRoleResInfoSendMsg = function(self)
		local str = MsgSender():getRoleResInfoSendMsg('attrs:{}')
		local rt = '{cmd:'..NETCMD.ROLEBASE..',res:{attrs:{}}}'
		assert(str == rt)
	end;
})

local TestCaseCreateRoleSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendCreateRoleInfoMsg = function(self)
		CreateRoleSender:sendCreateRoleInfoMsg(self.player)
		assertEQ ( getSendMsg_t(), '{cmd:'..NETCMD.CREATEROLE..',subid:0}' )
	end;
	
	test_sendCheckMsg = function(self)
		CreateRoleSender:sendCheckMsg(self.player, 'role', 'OK')
		assertEQ ( getSendMsg_t(), '{cmd:'..NETCMD.CREATEROLE..',subid:1,check:"role",result:"OK"}' )
	end;
	
	test_sendRandName = function(self)
		CreateRoleSender:sendRandName(self.player, 'randname')
		assertEQ ( getSendMsg_t(), '{cmd:'..NETCMD.CREATEROLE..',subid:2,randname:"randname"}' )
	end;
	
	test_sendCreateRoleOkMsg = function(self)
		CreateRoleSender:sendCreateRoleOkMsg(self.player)
		assertEQ ( getSendMsg_t(), '{cmd:'..NETCMD.CREATEROLE..',subid:99,result:0}' )
	end;
	
	test_sendCreateRoleFailedMsg = function(self)
		CreateRoleSender:sendCreateRoleFailedMsg(self.player)
		assertEQ ( getSendMsg_t(), '{cmd:'..NETCMD.CREATEROLE..',subid:99,result:-1}' )
	end;
	
	test_sendCityDieNoPos = function(self)
		CreateRoleSender:sendCityDieNoPos(self.player)
		assertEQ ( getSendMsg_t(), '{cmd:'..NETCMD.CREATEROLE..',subid:3}' )
	end;
	
	test_sendCityDie = function(self)
		CreateRoleSender:sendCityDie(self.player, {x=1, y=2})
		assertEQ ( getSendMsg_t(), '{cmd:'..NETCMD.CREATEROLE..',subid:4,pos:{x:1,y:2}}' )
	end;
	
	test_sendSetCityDiePosOk = function(self)
		CreateRoleSender:sendSetCityDiePosOk(self.player )
		assertEQ ( getSendMsg_t(), '{cmd:'..NETCMD.CREATEROLE..',subid:5}' )
	end;
	
	test_sendCityDieState = function(self)
		CreateRoleSender:sendCityDieState(self.player )
		assertEQ ( getSendMsg_t(), '{cmd:'..NETCMD.CREATEROLE..',subid:6}' )	
	end;
})

local TestCaseSkillMsgSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;

	testMakeOneSkillStr = function(self)
		local skill = CppPlayerVar:allocVar('SSkill', nil)
		skill.var.ulResId = 1
		skill.var.ucLevel = 2
		skill.var.ulDex = 3
		local str = SkillMsgSender:makeSkillStr(skill.var)
		assert(str == 'skills:[{id:1,level:2,dex:3}]')
		CppPlayerVar:freeVar(skill.hdr)
	end;
	
	testMakeSkillsStr = function(self)
		local skills = CppPlayerVar:allocVar('SSkillList', nil)
		skills.var.ucCount = 2
		skills.var.astSkills[0].ucLevel = 1
		skills.var.astSkills[0].ulResId = 1
		skills.var.astSkills[0].ulDex = 1
		skills.var.astSkills[1].ucLevel = 2
		skills.var.astSkills[1].ulResId = 2		
		skills.var.astSkills[1].ulDex = 2		
		local str = SkillMsgSender:makeSkillsStr(skills.var)
		assert(str == 'skills:[{id:1,level:1,dex:1},{id:2,level:2,dex:2}]')
		CppPlayerVar:freeVar(skills.hdr)
	end;
	
	testSendDelSkill = function(self)
		local str = SkillMsgSender:makeDelSkill(1)
		assert(str == 'skills:[{id:1,_d:1}]')
	end;
	
	test_sendReplaceSkillId = function(self)
		local idx = 1
		local oldSkillId = 6000001
		local newSkillId = 6000002
		SkillMsgSender:sendReplaceSkillId(self.player, self.hero, idx, oldSkillId, newSkillId)
		assertEQ ( getSendMsg_t(1), '{cmd:78,heros:[{id:1,skills:[{id:6000001,idx:1}]}]}' )
		assertEQ ( getSendMsg_t(2), '{cmd:78,heros:[{id:1,skills:[{_k:"idx"},{idx:1,id:6000002}]}]}' )
	end;
})

local TestCaseAttrMsgSender = TestCase:extends({
	testMakeOneAttrStr = function(self)
		local attr = CppPlayerVar:allocVar('SAttr', nil)
		attr.var.ucUnit = 0
		attr.var.usAttr = 1
		attr.var.ulVal = 1
		local str = AttrMsgSender():makeAttrStr(attr.var)
		assert(str == 'attrs:{"1":{val:1,u:0}}')
		CppPlayerVar:freeVar(attr.hdr)
	end;
	
	testMakeAttrsStr = function(self)
		local attrs = CppPlayerVar:allocVar('SAttrList', nil)
		attrs.var.ucCount = 2
		attrs.var.astAttrs[0].usAttr = 1		
		attrs.var.astAttrs[0].ucUnit = 0
		attrs.var.astAttrs[0].ulVal = 1
		
		attrs.var.astAttrs[1].usAttr = 2
		attrs.var.astAttrs[1].ucUnit = 1
		attrs.var.astAttrs[1].ulVal = 2
		local str = AttrMsgSender():makeAttrsStr(attrs.var)
		assert(str == 'attrs:{"1":{val:1,u:0},"2":{val:2,u:1}}')
		CppPlayerVar:freeVar(attrs.hdr)
	end;
})

local TestCaseHeroAttrSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testSendAttr = function(self)
		local attr = CppPlayerVar:allocVar('SAttr', nil)
		attr.var.ucUnit = 0
		attr.var.usAttr = 1
		attr.var.ulVal = 1
		local hero = Hero:new(self.player, {ullId=1,stWears={count=0,wears={}}})
		clearSendMsg_t()
		HeroAttrSender:sendAttr(self.player, hero, attr.var)
		local rtsendmsg = '{cmd:'..NETCMD.HERORES..',heros:[{id:1,attrs:{"1":{val:1,u:0}}}]}'
		assert(getSendMsg_t() == rtsendmsg)
		CppPlayerVar:freeVar(attr.hdr)
	end;
	
	testSendSimpleHeros = function(self)
		self.hero:getHeroSteel().steel = {steelType=0, startTime=1, quarters=5, quarterRes=10, quarterMoney=20, hourGold=2}
		HeroAttrSender:sendSimpleHeros(self.player)
		local hs = 'steel:{type:0,steelQuarters:5,startTime:1,quarterRes:10}'
		local expectStr = '{cmd:78,heros:[{id:1,icon:'..self.hero:getIcon()..',name:"'..self.hero:getName()..'",level:1,sex:'..self.hero:getSex()..',state:0,prof:3,skeleton:{level:0},soldier:{resid:0,number:0},' .. hs .. ',attrs:{"'..ATTR.HEALTH..'":{val:100000,u:0},"'..ATTR.MHEALTH..'":{val:100,u:0},"'..ATTR.CO..'":{val:10,u:0},"'..ATTR.SFC..'":{val:10,u:0},"'..ATTR.FC..'":{val:0,u:0},"' .. ATTR.XP .. '":{val:0,u:0},"' .. ATTR.NXP .. '":{val:100,u:0},"' .. ATTR.SP .. '":{val:40,u:0}'
			.. ',"33":{val:0,u:0},"26":{val:2,u:0},"27":{val:0,u:0},"28":{val:2,u:0},"29":{val:0,u:0},"30":{val:2,u:0},"31":{val:0,u:0},"12":{val:0,u:0}}}]}'
		assert(getSendMsg_t() == expectStr )
	end;
	
	testSendHerosState = function(self)
		HeroAttrSender:sendHerosState(self.player, {self.player:getHeroMgr():getHeroById(1)})
		assert(getSendMsg_t() == '{cmd:78,heros:[{id:1,state:0}]}')
	end;
	
	test_sendHeroSteel = function(self)
		HeroAttrSender:sendHeroSteel(self.player, self.player:getHeroMgr():getHeroById(1))
		assertEQ ( getSendMsg_t(), '{cmd:78,heros:[{id:1,steel:{type:0,steelQuarters:0,startTime:0,quarterRes:0}}]}' )
	end;
	
	testSendDetailHero = function(self)
		local hero = self.hero
		HeroAttrSender:sendDetailHero(self.player, hero)
		assert( isInclude(getSendMsg_t(), 'subjects:', 'attrs:', 'soldier:', 'skeleton:', 'stoptime:','skills:',',skillsteel:','curtskill:','isDetail:1','wears:',',steel:') == true )
	end;
	
	testSendHeroSubject = function(self)
		local hero = self.hero
		HeroAttrSender:sendSubjects(self.player, hero)
		assert( getSendMsg_t() == '{cmd:78,heros:[{id:1,subjects:[2,3,1,1,1]}]}' )
	end;
	
	testSendSkillSteel = function(self)
		local hero = self.hero
		HeroAttrSender:sendSkillSteel(self.player, hero)
		assert(getSendMsg_t() == '{cmd:78,heros:[{id:1,skillsteel:{id:0,stoptime:0}}]}' )
	end;
	
	testSendFireHero = function(self)
		local heroid = 1
		HeroAttrSender:sendFireHero(self.player, heroid)
		assert(getSendMsg_t() == '{cmd:78,heros:[{id:1,_d:1}]}' )
	end;
	
	testSendLockHero = function(self)
		local hero = Hero:new(self.player, {ullId=1,ucLockState=HERO_LOCKSTATE.LOCKED,stWears={count=0,wears={}}})
		HeroAttrSender:sendLockHero(self.player, hero)
		assert(getSendMsg_t() == '{cmd:78,heros:[{id:1,lockstate:'..HERO_LOCKSTATE.LOCKED..'}]}' )
	end;
	
	testSendUnLockHero = function(self)
		local unlocktime = Util:getTime() + res_unlock_hero_time
		local hero = Hero:new(self.player, {ullId=1,ucLockState=HERO_LOCKSTATE.UNLOCKING, ulUnlockTime=unlocktime, stWears={count=0,wears={}}})
		HeroAttrSender:sendUnLockHero(self.player, hero)
		assert(getSendMsg_t() == '{cmd:78,heros:[{id:1,lockstate:'..HERO_LOCKSTATE.UNLOCKING..',unlocktime:'..unlocktime..'}]}' )
	end;
	
	testSendUnLockedHero = function(self)
		local hero = Hero:new(self.player, {ullId=1,ucLockState=HERO_LOCKSTATE.NONE, stWears={count=0,wears={}}})
		HeroAttrSender:sendUnLockedHero(self.player, hero)
		assert(getSendMsg_t() == '{cmd:78,heros:[{id:1,lockstate:'..HERO_LOCKSTATE.NONE..'}]}' )
	end;
	
	testSendHeroName = function(self)
		local hero = Hero:new(self.player, {ullId=1,szName="abc",stWears={count=0,wears={}}})
		HeroAttrSender:sendName(self.player, hero)
		assert(getSendMsg_t() == '{cmd:78,heros:[{id:1,name:"abc"}]}' )
	end;
	
	testSendHeroOfficial = function(self)
		local hero = Hero:new(self.player, {ullId=1,ucOfficial=1,stWears={count=0,wears={}}})
		HeroAttrSender:sendOfficial(self.player, hero)
		assert(getSendMsg_t() == '{cmd:78,heros:[{id:1,official:1}]}' )
	end;
	
	testSendStrIFResult = function(self)
		local hero = Hero:new(self.player, {ullId=1,stWears={count=0,wears={}}})
		HeroAttrSender:sendStrIFResult(self.player, hero, {1,2,3,0})
		assert(getSendMsg_t() == '{cmd:78,strifresult:[1,2,3,0]}' )
	end;
	
	testSendSkeleton = function(self)
		local hero = Hero:new(self.player, {ullId=1,ucSkeletonLevel=2,ulSSteelStopTime=3,stWears={count=0,wears={}}})
		HeroAttrSender:sendSkeleton(self.player, hero)
		assert(getSendMsg_t() == '{cmd:78,heros:[{id:1,skeleton:{level:2,stoptime:3}}]}' )
	end;
	
	testSendCarrySoldier = function(self)
		local hero = Hero:new(self.player, {ullId=1, stWears={count=0,wears={}}   })
		hero.getSoldier = function() return {resid=1,number=2} end
		HeroAttrSender:sendCarrySoldier(self.player, hero)
		assert(getSendMsg_t() == '{cmd:78,heros:[{id:1,soldier:{resid:1,number:2}}]}' )
	end;
	
	testSendCarrySoldiers = function(self)
		local hero1 = Hero:new(self.player, {ullId=1,stWears={count=0,wears={}}})
		hero1.getSoldier = function() return {resid=1,number=2} end
		local hero2 = Hero:new(self.player, {ullId=2,stWears={count=0,wears={}}})
		hero2.getSoldier = function() return {resid=3,number=4} end
		
		HeroAttrSender:sendCarrySoldiers(self.player, {})
		assert(getSendMsg_t() == '' )
		
		HeroAttrSender:sendCarrySoldiers(self.player, {hero1, hero2})
		assert(getSendMsg_t() == '{cmd:78,heros:[{id:1,soldier:{resid:1,number:2}},{id:2,soldier:{resid:3,number:4}}]}' )
	end;
	
	testSendAttrsByIds = function(self)
		local hero = self.hero
		hero:setAttrVal(ATTR.HI, 1)
		hero:setAttrVal(ATTR.HU, 2)
		HeroAttrSender:sendAttrsByIds(self.player, hero, {})
		assert(getSendMsg_t() == '{cmd:78,heros:[{id:1,attrs:{}}]}' )
		
		HeroAttrSender:sendAttrsByIds(self.player, hero, {ATTR.HI})
		assert(getSendMsg_t() == '{cmd:78,heros:[{id:1,attrs:{"'..ATTR.HI..'":{val:1,u:0}}}]}' )
		
		HeroAttrSender:sendAttrsByIds(self.player, hero, {ATTR.HI, ATTR.HU})
		assert(getSendMsg_t() == '{cmd:78,heros:[{id:1,attrs:{"'..ATTR.HI..'":{val:1,u:0},"'..ATTR.HU..'":{val:2,u:0}}}]}' )
	end;
	
	testSendCanUseSSTime = function(self)
		local heromgr = self.player:getHeroMgr()
		heromgr:setCanUseSkillSteelTime(10)
		HeroAttrSender:sendCanUseSSTime(self.player)
		assert(getSendMsg_t() == '{cmd:78,canusesstime:10}' )
	end;
	
	testSendCurTacticSkillId = function(self)
		local hero = self.hero
		hero:setCurTacticSkillId(6001001)
		HeroAttrSender:sendCurTacticSkillId(self.player, hero)
		assert ( getSendMsg_t() == '{cmd:78,heros:[{id:1,curtskill:6001001}]}' )
	end;
	
	testSendWear = function(self)
		local g_armPos = 1
		local g_resItem = {id=2, resId=3, number=4, forceLevel=5, isBind=1, attrs={count=1,attrs={} }, gems={count=1,gems={}}}
		g_resItem.attrs.attrs[0] = {attr=1,val=2,unit=0}
		g_resItem.gems.gems[0] = 1001
		local g_arm = ItemEx(g_resItem)
		self.hero:getWearContainer():wear(g_armPos, g_arm)
		
		HeroAttrSender:sendWear(self.player, self.hero, g_armPos+1)
		assert ( getSendMsg_t() == '' )

		HeroAttrSender:sendWear(self.player, self.hero, g_armPos)
		assert ( getSendMsg_t() == '{cmd:78,heros:[{id:1,wears:{"1":{id:2,resid:3,number:4,flevel:5,isBind:1,attrs:{"1":{val:2,u:0}},gems:[{_r:1},1001]}}}]}' )
	end;
	
	testSendUnWear = function(self)
		local g_armPos = 1
		HeroAttrSender:sendUnWear(self.player, self.hero, g_armPos)
		assert ( getSendMsg_t() == '{cmd:78,heros:[{id:1,wears:{"1":{_d:1}}}]}' )
	end;
	
	testMakeWears = function(self)
		local g_armPos = 1
		local g_resItem = {id=2, resId=3, number=4, forceLevel=5, isBind=1, attrs={count=1,attrs={} }, gems={count=1,gems={}}}
		g_resItem.attrs.attrs[0] = {attr=1,val=2,unit=0}
		g_resItem.gems.gems[0] = 1001
		local g_arm = ItemEx(g_resItem)
		self.hero:getWearContainer():wear(g_armPos, g_arm)
		assert ( HeroAttrSender:makeWears(self.hero) == 'wears:{"1":{id:2,resid:3,number:4,flevel:5,isBind:1,attrs:{"1":{val:2,u:0}},gems:[{_r:1},1001]}}' )
	end;
})

local TestCaseRoleAttrSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	testSendAttr = function(self)
		local attr = CppPlayerVar:allocVar('SAttr', nil)
		attr.var.ucUnit = 0
		attr.var.usAttr = 1
		attr.var.ulVal = 1
		local hero = Hero:new(self.player, {ullId=1,stWears={count=0,wears={}}})
		clearSendMsg_t()
		RoleAttrSender:sendAttr(self.player, attr.var)
		local rtsendmsg = '{cmd:'..NETCMD.ROLEBASE..',res:{attrs:{"1":{val:1,u:0}}}}'
		assert(getSendMsg_t() == rtsendmsg)
		CppPlayerVar:freeVar(attr.hdr)
	end;
	
	testSendAttrs = function(self)
		local attrs = CppPlayerVar:allocVar('SAttrList', nil)
		attrs.var.ucCount = 2
		attrs.var.astAttrs[0].usAttr = 1		
		attrs.var.astAttrs[0].ucUnit = 0
		attrs.var.astAttrs[0].ulVal = 1
		
		attrs.var.astAttrs[1].usAttr = 2
		attrs.var.astAttrs[1].ucUnit = 1
		attrs.var.astAttrs[1].ulVal = 2
		clearSendMsg_t()
		RoleAttrSender:sendAttrs(self.player, attrs.var)
		local rtsendmsg = '{cmd:'..NETCMD.ROLEBASE..',res:{attrs:{"1":{val:1,u:0},"2":{val:2,u:1}}}}'
		assert(getSendMsg_t() == rtsendmsg)
		clearSendMsg_t()
		
		CppPlayerVar:freeVar(attrs.hdr)
	end;
	
	testSendAttrsByIds = function(self)
		RoleAttrSender:sendAttrsByIds(self.player, {})
		assert(getSendMsg_t() == '')
		
		RoleAttrSender:sendAttrsByIds(self.player, {ATTR.AF})
		assert(getSendMsg_t() == '{cmd:'..NETCMD.ROLEBASE..',res:{attrs:{"'..ATTR.AF..'":{val:0,u:0}}}}')
		
		RoleAttrSender:sendAttrsByIds(self.player, {ATTR.AF, ATTR.XP})
		assert(getSendMsg_t() == '{cmd:'..NETCMD.ROLEBASE..',res:{attrs:{"'..ATTR.AF..'":{val:0,u:0},"'..ATTR.XP..'":{val:0,u:0}}}}')
	end;
})

local TestCaseItemMsgSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:backRes()
		
		res_items = {{id=1, pile=100},{id=2, pile=100}} -- add test res_item
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	testSendNumber = function(self)
		clearSendMsg_t()
		ItemMsgSender:sendNumber(self.player, ItemEx({id=1,resId=2,number=3}))
		local rt = '{cmd:'..NETCMD.PKG..',pkg:{items:[{id:1,number:3}]}}'
		assert(getSendMsg_t() == rt)
	end;
	
	test_sendItem = function(self)
		clearSendMsg_t()
		
		local pkg = self.player:getPkg()
		pkg:addItems({RawItemEx({resId=1, number=110})})
		local item = pkg:getItemByResId(1)
		
		ItemMsgSender:sendItem(self.player, item)
		local rt = '{cmd:'..NETCMD.PKG..',pkg:{items:[{id:'..item:getId()..',resid:1,number:100,flevel:0,isBind:0,gems:[{_r:1}]}]}}'
		assert(getSendMsg_t() == rt)
	end;
	
	test_sendOtherDetailItemFail = function(self)
		ItemMsgSender:sendOtherDetailItemFail(self.player)
		local rt = '{cmd:'..NETCMD.ITEM..',result:-1}'
		assert(getSendMsg_t() == rt)
	end;
	
	test_sendOtherDetailItem = function(self)
		self.player:getPkg():addItems({RawItemEx({resId=1, number=110})})
		local item = self.player:getPkg():getItemByResId(1)
		ItemMsgSender:sendOtherDetailItem(self.player, 100000, item )
		local rt = '{cmd:'..NETCMD.ITEM..',result:0,roleId:100000,detailitem:{id:'..item:getId()..',resid:1,number:100,flevel:0,isBind:0,gems:[{_r:1}]}}'
		assert(getSendMsg_t() == rt)
	end;
	
	testSendDelItem = function(self)
		clearSendMsg_t()
		ItemMsgSender:sendDelItem(self.player, 1)
		local rt = '{cmd:'..NETCMD.PKG..',pkg:{items:[{id:1,_d:1}]}}'
		assert(getSendMsg_t() == rt)
	end;
	
	testSendByResId = function(self)
		local pkg = self.player:getPkg()
		pkg:addItems({RawItemEx({resId=1, number=110}), RawItemEx({resId=2, number=20})})
		
		clearSendMsg_t()
		ItemMsgSender:sendByResId(self.player, {})
		assert(getSendMsg_t() == '')
		
		clearSendMsg_t()
		ItemMsgSender:sendByResId(self.player, {3})
		assert(getSendMsg_t() == '')
		
		clearSendMsg_t()
		ItemMsgSender:sendByResId(self.player, {1, 2})
		local rt = '{cmd:'..NETCMD.PKG..',pkg:{items:[{id:1,resid:1,number:100,flevel:0,isBind:0,gems:[{_r:1}]},{id:2,resid:1,number:10,flevel:0,isBind:0,gems:[{_r:1}]},{id:3,resid:2,number:20,flevel:0,isBind:0,gems:[{_r:1}]}]}}'
		assert(getSendMsg_t() == rt)
		
		clearSendMsg_t()
		ItemMsgSender:sendAll(self.player)
		assert(getSendMsg_t() == rt)
	end;
	
	testSendChangeItems = function(self)
		local pkg = self.player:getPkg()
		pkg:addItems({RawItemEx({resId=1, number=110}), RawItemEx({resId=2, number=20})})
		
		clearSendMsg_t()
		ItemMsgSender:sendChangeItems(self.player, {})
		assert(getSendMsg_t() == '')
		
		clearSendMsg_t()
		pkg:subItemByResId(1, 109)
		local rt = '{cmd:'..NETCMD.PKG..',pkg:{items:[{id:2,_d:1},{id:1,number:1}]}}'
		assert(getSendMsg_t() == rt)
	end;
	
	test_sendSalveMax = function(self)
		ItemMsgSender:sendSalveMax(self.player)
		local rt = '{cmd:'..NETCMD.PKG..',pkg:{salveMax:0}}'
		assert(getSendMsg_t() == rt)
	end;
})


local TestCasePkgMiscSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testSend = function(self)
		local pkg = self.player:getPkg()
		pkg:setGold(10)
		pkg:setGiftGold(20)
		pkg:setMaxGridsCnt(100)
		
		clearSendMsg_t()
		PkgMiscSender:sendAll(self.player)
		local miscrt = '{cmd:'..NETCMD.PKG..',pkg:{misc:{gold:10,giftgold:20,maxgrids:100}}}'
		assert(getSendMsg_t() == miscrt)
		
		clearSendMsg_t()
		PkgMiscSender:send(self.player, {'gold','maxgrids'})
		local miscrt = '{cmd:'..NETCMD.PKG..',pkg:{misc:{gold:10,maxgrids:100}}}'
		assert(getSendMsg_t() == miscrt)
	end;
})

local TestCaseCityResSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testSend = function(self)
		local cres = self.player:getCityRes()
		cres:setMLastTime(Util:getTime())
		cres:setMoney(1)
		
		clearSendMsg_t()
		MoneySender:send(self.player, {'money'})
		assert(getSendMsg_t() == '{cmd:'..NETCMD.CITYRES..',res:{money:{cur:1}}}')
		
		clearSendMsg_t()
		MoneySender:sendAll(self.player)
		assert(getSendMsg_t() == '{cmd:'..NETCMD.CITYRES..',res:{money:{cur:1,max:'..self.player:getCitys():getMaxMoney()..',output:'..self.player:getCityRes():getMoneyOutput()..'}}}')
	end;
})

local TestCaseRoleBaseSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testSendMsg = function(self)
		res_svr_mics_cfg.svrOpenTime = '2013-8-24 17:45:23'
		self.player:getPersistVar().regTime = 1379864747
		ActTaskUtil:init()
		
		--Util.getFixPreTime
		Util:setTimeDrt(20)
		self.player:getActTower():setMaxLayer(99)
		self.player:getActTerrace():setMaxGate({gateId=8, subGateId=2})
		self.player:getCityRes():setLevel(10)
		self.player:setRoleName('my')
		self.player:setState(1)
		self.player:setLevel(10)
		self.player:setIntroduction('i am good man')
		assert(self.player:getGMFlag() ~= nil)
		clearSendMsg_t()
		RoleBaseSender:send(self.player, {'name','id','uid','prestige','cityhonor','citycd','level','resid','cityid','sex','ranking','state','pos','introduction','gm','svrOpenTime','firstLoginTime','actTower','actTerrace','cityMaxLevel'})
		local rtsendmsg = '{cmd:'..NETCMD.ROLEBASE..',res:{name:"my",id:1,uid:10001,prestige:0,cityhonor:0,citycd:0,level:10,resid:0,cityid:0,sex:0,ranking:0,state:1,pos:{x:0,y:0},introduction:"i am good man",gm:0,svrOpenTime:1377273600,firstLoginTime:1379779200,actTower:99,actTerrace:7,cityMaxLevel:10}}'
		assert(getSendMsg_t() == rtsendmsg)	
		
		self.player:getActTerrace():setMaxGate({gateId=8, subGateId=res_act_terrace_max_subgate_id})
		RoleBaseSender:send(self.player, {'name','id','uid','prestige','cityhonor','citycd','level','resid','cityid','sex','ranking','state','pos','introduction','gm','svrOpenTime','firstLoginTime','actTower','actTerrace','cityMaxLevel'})
		local rtsendmsg = '{cmd:'..NETCMD.ROLEBASE..',res:{name:"my",id:1,uid:10001,prestige:0,cityhonor:0,citycd:0,level:10,resid:0,cityid:0,sex:0,ranking:0,state:1,pos:{x:0,y:0},introduction:"i am good man",gm:0,svrOpenTime:1377273600,firstLoginTime:1379779200,actTower:99,actTerrace:8,cityMaxLevel:10}}'
		assert(getSendMsg_t() == rtsendmsg)	
		clearSendMsg_t()
		
		clearSendMsg_t()
		RoleBaseSender:send(self.player, {'alliance'})
		local rtsendmsg = '{cmd:'..NETCMD.ROLEBASE..',res:{alliance:{uid:0,name:"--"}}}'
		assert(getSendMsg_t() == rtsendmsg)	
	end;
	
	test_sendAll = function(self)
		self.player:setPlatForm({openid='openid1', openkey='openkey1', appid='appid1', pf='qzone', pfkey='pfkey1', zoneid='zoneid1' })
		
		res_svr_mics_cfg.svrOpenTime = '2013-8-24 17:45:23'
		self.player:getPersistVar().regTime = 1379864747
		ActTaskUtil:init()
		
		--Util.getFixPreTime
		Util:setTimeDrt(20)
		self.player:getActTower():setMaxLayer(99)
		self.player:getActTerrace():setMaxGate({gateId=8, subGateId=res_act_terrace_max_subgate_id})
		self.player:getCityRes():setLevel(10)
		self.player:setRoleName('my')
		self.player:setState(1)
		self.player:setLevel(10)
		self.player:setIntroduction('i am good man')
		assert(self.player:getGMFlag() ~= nil)
		clearSendMsg_t()
		RoleBaseSender:sendAll(self.player)
		local rtsendmsg = '{cmd:'..NETCMD.ROLEBASE..',res:{name:"my",id:1,uid:10001,prestige:0,cityhonor:0,citycd:0,level:10,resid:0,cityid:0,sex:0,ranking:0,state:1,pos:{x:0,y:0},alliance:{uid:0,name:"--"},introduction:"i am good man",gm:0,svrOpenTime:1377273600,firstLoginTime:1379779200,actTower:99,actTerrace:8,cityMaxLevel:10,ydInfo:{_e:0},vip:0,firsthero:0}}'
		assert(getSendMsg_t() == rtsendmsg)	
	end;
	
	test_sendYDInfo = function(self)
		self.player:setPlatForm({openid='openid1', openkey='openkey1', appid='appid1', pf='qzone', pfkey='pfkey1', zoneid='zoneid1' })
	
		RoleBaseSender:send(self.player, {'xdInfo'})
		local rtsendmsg = '{cmd:'..NETCMD.ROLEBASE..',res:{ydInfo:{_e:0}}}'
		assert(getSendMsg_t() == rtsendmsg)
		
		self.player:setQQMembership({is_yellow_vip=1})
		RoleBaseSender:send(self.player, {'xdInfo'})
		rtsendmsg = '{cmd:'..NETCMD.ROLEBASE..',res:{ydInfo:{_e:0,is_yellow_vip:1}}}'
		assert(getSendMsg_t() == rtsendmsg)
		
		self.player:getTask():getYDTask():setGotNewGift()
		Util:setTimeDrt(10000)
		self.player:getTask():getYDTask():setGotCommGift()
		Util:setTimeDrt(20000)
		self.player:getTask():getYDTask():setGotYearGift()
		
		self.player:getTask():getYDTask():getGotLvlGifts():insert(1)
		self.player:getTask():getYDTask():getGotLvlGifts():insert(2)
		self.player:getTask():getYDTask():getGotLvlGifts():insert(3)
		
		RoleBaseSender:send(self.player, {'xdInfo'})
		rtsendmsg = '{cmd:'..NETCMD.ROLEBASE..',res:{ydInfo:{_e:0,is_yellow_vip:1,got_newgift:1,got_commgift:10000,got_yeargift:20000,got_lvlgifts:[1,2,3]}}}'
		assert(getSendMsg_t() == rtsendmsg)
	end;
	
	test_sendYDInfo = function(self)
		self.player:setPlatForm({openid='openid1', openkey='openkey1', appid='appid1', pf='3366', pfkey='pfkey1', zoneid='zoneid1' })
	
		RoleBaseSender:send(self.player, {'xdInfo'})
		local rtsendmsg = '{cmd:'..NETCMD.ROLEBASE..',res:{bdInfo:{_e:0}}}'
		assert(getSendMsg_t() == rtsendmsg)
		
		self.player:setQQMembership({is_blue_vip=1})
		RoleBaseSender:send(self.player, {'xdInfo'})
		rtsendmsg = '{cmd:'..NETCMD.ROLEBASE..',res:{bdInfo:{_e:0,is_blue_vip:1}}}'
		assert(getSendMsg_t() == rtsendmsg)
		
		self.player:getTask():getBDTask():setGotNewGift()
		Util:setTimeDrt(10000)
		self.player:getTask():getBDTask():setGotCommGift()
		Util:setTimeDrt(20000)
		self.player:getTask():getBDTask():setGotYearGift()
		Util:setTimeDrt(30000)
		self.player:getTask():getBDTask():setGotHighGift()
		Util:setTimeDrt(40000)
		self.player:getTask():getBDTask():setGot3366Gift()
		
		self.player:getTask():getBDTask():getGotLvlGifts():insert(1)
		self.player:getTask():getBDTask():getGotLvlGifts():insert(2)
		self.player:getTask():getBDTask():getGotLvlGifts():insert(3)
		
		RoleBaseSender:send(self.player, {'xdInfo'})
		rtsendmsg = '{cmd:'..NETCMD.ROLEBASE..',res:{bdInfo:{_e:0,is_blue_vip:1,got_newgift:1,got_commgift:10000,got_yeargift:20000,got_highgift:30000,got_3366gift:40000,got_lvlgifts:[1,2,3]}}}'
		assert(getSendMsg_t() == rtsendmsg)
	end;
})

local TestCaseRoleRankSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendRanks = function(self)
		local _makeItemStr = function(rank, name, roleId, gridId, alli, level, buildVal)
			return '{rank:' .. rank.. ',name:"' .. name .. '",gridId:' .. gridId .. ',roleId:' .. roleId .. ',alli:"' .. alli .. '",level:' .. level .. ',buildVal:' .. buildVal .. '}'
		end;
		
		local pageNo = 1
		local onePageCnt = 4
		local curSelIdx = 0
		RoleRankSender:sendRanks(self.player, pageNo, onePageCnt, curSelIdx)
		
		local rank1 = _makeItemStr(1, 'rrole1', 100000, 100, 'alli1', 10, 1000)
		local rank2 = _makeItemStr(2, 'rrole2', 200000, 200, 'alli2', 20, 2000)
		local rank3 = _makeItemStr(3, 'rrole3', 300000, 300, 'alli3', 30, 3000)
		local rank4 = _makeItemStr(4, 'rrole4', 400000, 400, 'alli4', 40, 4000)
		local expectMsg = '{cmd:' .. NETCMD.ROLEBASE .. ',ranks:[' .. rank1 .. ',' .. rank2 .. ',' .. rank3 .. ',' .. rank4 .. '],pageNo:1,pageCount:3,curSelIdx:0}'
		
		assertEQ ( getSendMsg_t() , expectMsg )
	end;
})

local TestCaseCityBuildValSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testSendMsg = function(self)
		local cres = self.player:getCityRes()
		cres:setLevel(1)
		cres:setBuildVal(4)
		cres:setBuildHurtVal(4)
		assert(cres:getLevel() == 0)
		
		clearSendMsg_t()
		CityBuildValSender:sendAll(self.player)
		local rt = '{cmd:'..NETCMD.CITYRES..',res:{buildval:{level:0,cur:4,hurt:4,max:'..cres:getMaxBuildVal()..'}}}'
		assert(getSendMsg_t() == rt)
		
		clearSendMsg_t()
		CityBuildValSender:send(self.player, {'maxbuildval'})
		local rt = '{cmd:'..NETCMD.CITYRES..',res:{buildval:{max:'..cres:getMaxBuildVal()..'}}}'
		assert(getSendMsg_t() == rt)
	end;
})

local TestCaseCityBuildSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendCitysType = function(self)
		self.player:getCitys():addCity(CITY_TYPE.SUBRES)
		self.player:getCitys():addCity(CITY_TYPE.SUBARMY)
		self.player:getCitys():addCity(CITY_TYPE.SUBRES)
		CityBuildSender:sendCitysType(self.player)
		local rt = '{cmd:'..NETCMD.BUILDRES..',cityTypes:[1,2,3,2]}'
		assert(getSendMsg_t() == rt)
	end;
	
	test_sendAll = function(self)
		self.mm:mock(CityBuildSender, 'sendOneCityAllBuilds' )
		
		self.player:getCitys():addCity(CITY_TYPE.SUBRES)
		CityBuildSender:sendAll(self.player)
		assertEQ ( self.mm.walkLog, 'sendOneCityAllBuilds,sendOneCityAllBuilds' )
		assertEQ ( self.mm.params['sendOneCityAllBuilds.1'], {self.player, 1} )
		assertEQ ( self.mm.params['sendOneCityAllBuilds.2'], {self.player, 2} )
	end;
	
	test_sendOpenMainCity = function(self)
		CityBuildSender:sendOpenMainCity(self.player)
		local rt = '{cmd:'..NETCMD.BUILDRES..',openMainCity:1}'
		assert(getSendMsg_t() == rt)
	end;
	
	test_sendDel = function(self)
		local p_cityId = 1
		local p_buildId = 2
		CityBuildSender:sendDel(self.player, p_cityId, p_buildId)
		local rt = '{cmd:'..NETCMD.BUILDRES..',builds:{cityId:1,list:[{id:2,_d:1}]}}'
		assert(getSendMsg_t() == rt)
	end;
	
	test_sendOneCityAllBuilds = function(self)
		local pcity = self.player:getCitys():getCityById(BUILDCITY_ID.MAIN)
		pcity:setBuildCount(0)
		local b1 = pcity:addBuild({id=1,resid=1,level=1,state=BUILD_STATE.COMM,stoptime=10000})
		local b2 = pcity:addBuild({id=2,resid=2,level=3,state=BUILD_STATE.UPGRADE,stoptime=10000})
		
		clearSendMsg_t()
		CityBuildSender:sendOneCityAllBuilds(self.player, BUILDCITY_ID.MAIN)
		local rt = '{cmd:'..NETCMD.BUILDRES..',builds:{cityId:1,list:[{id:'..b1.ulId..',cid:1,resid:1,state:'..BUILD_STATE.COMM..',level:1},{id:'..b2.ulId..',cid:1,resid:2,state:'..BUILD_STATE.UPGRADE..',level:3,stoptime:10000}]}}'
		assert(getSendMsg_t() == rt)
	end;	
	
	testSendMsg = function(self)
		local pcity = self.player:getCitys():getCityById(BUILDCITY_ID.MAIN)
		pcity:setBuildCount(0)
		local b1 = pcity:addBuild({id=1,resid=1,level=1,state=BUILD_STATE.COMM,stoptime=10000})
		local b2 = pcity:addBuild({id=2,resid=2,level=3,state=BUILD_STATE.UPGRADE,stoptime=10000})
		
		clearSendMsg_t()
		CityBuildSender:send(self.player, BUILDCITY_ID.MAIN, b2.ulId)
		local rt = '{cmd:'..NETCMD.BUILDRES..',builds:{cityId:1,list:[{id:'..b2.ulId..',cid:1,resid:2,state:'..BUILD_STATE.UPGRADE..',level:3,stoptime:10000}]}}'
		assert(getSendMsg_t() == rt)
	end;
})

local TestCaseCommResSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testSendMsg = function(self)
		local cres = self.player:getCityRes()
		cres:setFood(10)
		cres:setWood(20)
		cres:setStone(30)
		cres:setIron(40)
		
		clearSendMsg_t()
		CommResSender:send(self.player, {FIXID.FOOD, FIXID.WOOD, FIXID.STONE, FIXID.IRON})
		assert(getSendMsg_t() == '{cmd:'..NETCMD.CITYRES..',res:{cres:{food:10,wood:20,stone:30,iron:40}}}')
	end;
	
	testSendAllMsg = function(self)
		local cres = self.player:getCityRes()
		cres:setFood(10)
		cres:setWood(20)
		cres:setStone(30)
		cres:setIron(40)
		
		clearSendMsg_t()
		CommResSender:sendAll(self.player)
		assert(getSendMsg_t() == '{cmd:'..NETCMD.CITYRES..',res:{cres:{food:10,wood:20,stone:30,iron:40,max:'..res_commres_basestorenum..'}}}')
	end;
})

local TestCaseFarmSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	makeData = function(self, player)
		player:setRoleName('hello')
		player:getCityRes():setLevel(2)
		
		local bakgettime = Util.getTime
		Util.getTime = function(self) return 0 end
		local farm = player:getFarm()
		farm:seedBlock({id=1,resid=FIXID.FARM,level=1,state=FARM_STATE.COMPLETE})
		farm:seedBlock({id=2,resid=FIXID.FARM,level=2,state=FARM_STATE.SAPLING})
		Util.getTime = bakgettime
	end;
	
	testSendAllMsg = function(self)
		local g_otherPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200000)
		self:makeData(g_otherPlayer)
		local _expectAllMsg = function()
			local ver = g_otherPlayer:getFarm():getFarmVer()
			return '{cmd:84,farm:{ver:' .. ver .. ',role:{uid:200000,name:"hello",citylevel:2},blocks:[{id:1,resid:100001,level:1,state:2,totalres:1200,canGather:1,leftres:1200,pStopTime:0},{id:2,resid:100001,level:2,state:0,totalres:9600,canGather:0,starttime:0,stoptime:14400}]}}'
		end;
		FarmSender:sendAll(self.player, g_otherPlayer)
		assert( getSendMsg_t() == _expectAllMsg() )
	end;
	
	testSendCancelInput = function(self)
		FarmSender:sendCancelInput(self.player)
		assert( getSendMsg_t() == '{cmd:'..NETCMD.FARM..',farminput:{result:-1}}' )
	end;
	
	testSendBlock = function(self)
		local farm = self.player:getFarm()
		local block = farm:seedBlock({id=1,resid=FIXID.FARM,level=1,state=FARM_STATE.COMPLETE})
		
		FarmSender:sendBlock(self.player, farm, block)
		local ver = self.player:getFarm():getFarmVer()
		assert( getSendMsg_t() == '{cmd:84,farm:{ver:' .. farm:getFarmVer() .. ',blocks:[{id:1,resid:100001,level:1,state:2,totalres:1200,canGather:1,leftres:1200,pStopTime:0}]}}' )
	end;
	
	testSendBlocks = function(self)
		local farm = self.player:getFarm()
		local block = farm:seedBlock({id=1,resid=FIXID.FARM,level=1,state=FARM_STATE.COMPLETE})
		
		FarmSender:sendBlocks(self.player, farm, {block})
		assert( getSendMsg_t() == '{cmd:84,farm:{ver:' .. farm:getFarmVer() .. ',blocks:[{id:1,resid:100001,level:1,state:2,totalres:1200,canGather:1,leftres:1200,pStopTime:0}]}}' )
	end;
	
	testSendDelBlock = function(self)
		local blockid = 1
		FarmSender:sendDelBlock(self.player, blockid)
		local ver = self.player:getFarm():getFarmVer()
		assert( getSendMsg_t() == '{cmd:84,farm:{ver:' .. ver .. ',blocks:[{id:1,resid:'..FIXID.EMPTYFARMBLOCK..'}]}}' )
	end;
	
	testSendGetResNum = function(self)
		FarmSender:sendGetResNum(self.player, {{id=1,num=1000},{id=2,num=2000},{id=3,num=3000}})
		assert( getSendMsg_t() == '{cmd:84,farmgets:{nums:[{id:1,num:1000},{id:2,num:2000},{id:3,num:3000}]}}' )
	end;
	
	testSendLogs = function(self)
		Util:setTimeDrt(0)
		local farm = self.player:getFarm()
		farm:addLog({ltype=1, role='xxx', param1=1, param2=1, param3=1, param4=1})
		farm:addLog({ltype=1, role='xxx', param1=1, param2=1, param3=1, param4=1})
		FarmSender:sendLogs(self.player)
		assert( getSendMsg_t() == '{cmd:84,farminfo:{ver:2,list:[[1,"xxx",0,1,1,1,1],[1,"xxx",0,1,1,1,1]]}}' )
	end;
	
	test_sendFarmsCanGetFlags = function(self)
		FarmSender:sendFarmsCanGetFlags(self.player, {})
		assertEQ( getSendMsg_t(), '' )
		FarmSender:sendFarmsCanGetFlags(self.player, {{roleId=100001,flag=1},{roleId=100002,flag=0}})
		assertEQ ( getSendMsg_t(), '{cmd:84,farmflags:[{_k:"roleId"},{roleId:100001,flag:1},{roleId:100002,flag:0}]}' )
	end;
})

local TestCasePopuSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;

	testSend = function(self)
		self.player:getCityRes():setIdlePopu(1)
		
		PopuSender:send(self.player, {'idle'})
		assert( getSendMsg_t() == '{cmd:60,res:{popu:{idle:1}}}' )
		
		PopuSender:send(self.player, {'work'})
		assert( getSendMsg_t() == '{cmd:60,res:{popu:{work:0}}}' )
		
		PopuSender:send(self.player, {'max'})
		assert( getSendMsg_t() == '{cmd:60,res:{popu:{max:'..res_initmaxpopu..'}}}' )
		
		PopuSender:send(self.player, {'idle','work','max'})
		assert( getSendMsg_t() == '{cmd:60,res:{popu:{idle:1,work:0,max:'..res_initmaxpopu..'}}}' )
		
		PopuSender:sendAll(self.player)
		assert( getSendMsg_t() == '{cmd:60,res:{popu:{idle:1,work:0,max:'..res_initmaxpopu..'}}}' )
	end;
})

local TestCaseNewHerosSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	prepareData = function(self)
		local city = self.player:getCitys():getCityById(BUILDCITY_ID.MAIN)
		local build = city:addBuild({id=1,resid=FIXID.TAVERNBUILD,level=1,state=0})
		local heromgr = self.player:getHeroMgr()
		local newheros = heromgr:getNewHeros()
		newheros:refreshNewHeros()
		clearSendMsg_t()
	end;
	
	testNewHerosSender = function(self)
		self:prepareData()
		NewHerosSender:sendAll(self.player)
		assert( isInclude(getSendMsg_t(), 'newheros:', 'stoptime:', 'list:', 'attrs:', '"'..ATTR.NAG..'":', '"'..ATTR.NPH..'":', '"'..ATTR.NST..'":') )
	end;
	
	testNewHerosDelete = function(self)
		self:prepareData()
		NewHerosSender:sendDelHero(self.player, 1)
		assert( isInclude(getSendMsg_t(), 'newheros:', 'del:1', 'list:', 'id:1', '_d:1') )
	end;
})

local TestCaseRoleSoldierSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testSendSoldiers = function(self)
		local soldierMgr = self.player:getSoldierMgr()
		soldierMgr:addSoldier({resid=1,number=3})
		soldierMgr:addSoldier({resid=1,number=3})
		RoleSoldierSender:sendSoldiers(self.player)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.SOLDIERRES..',soldiers:[{id:1,number:6}]}' )
	end;
	
	testSendSoldier = function(self)
		local soldierMgr = self.player:getSoldierMgr()
		soldierMgr:addSoldier({resid=1,number=3})
		soldierMgr:addSoldier({resid=1,number=3})
		RoleSoldierSender:sendSoldier(self.player, 1)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.SOLDIERRES..',soldiers:[{id:1,number:6}]}' )
	end;
	
	testSendSoldiersByIds = function(self)
		local soldierMgr = self.player:getSoldierMgr()
		soldierMgr:addSoldier({resid=1,number=3})
		RoleSoldierSender:sendSoldiersByIds(self.player, {})
		assert ( getSendMsg_t() == '' )
		
		RoleSoldierSender:sendSoldiersByIds(self.player, {1,2,3})
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.SOLDIERRES..',soldiers:[{id:1,number:3},{id:2,_d:1},{id:3,_d:1}]}' )
	end;
})

local TestCaseCultureSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testSendCultures = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {  cultures={{id=120001, level=1}, {id=120006, level=2}} })
		CultureSender:sendCultures(self.player)
		assert ( getSendMsg_t() == '{cmd:85,cultures:[{id:120001,level:1},{id:120006,level:2}]}' )
	end;
	
	testSendLearningCulture = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {   cultures={{id=120001, level=2}}, learningculture={id=120001, stoptime=1} })
		CultureSender:sendLearningCulture(self.player)
		assert ( getSendMsg_t() == '{cmd:85,learning:{id:120001,state:' .. BUILD_STATE.UPGRADE .. ',level:2,stoptime:1}}' )
	end;
	
	testSendCulture = function(self)
		CultureSender:sendCulture(self.player, {id=120001,level=10})
		assert ( getSendMsg_t() == '{cmd:85,cultures:[{id:120001,level:10}]}' )	
	end;
})

local TestCaseMilitarySender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testSendFavorites = function(self)
		self.mm:mock(MilitarySender, '_makeFavoritesListByContainer', {',{}'})
		MilitarySender:sendFavorites(self.player)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.MILITARY..',favorites:[{_k:"gridId"},{}]}' )
		assertListEQ ( self.mm.params['_makeFavoritesListByContainer'], {self.player, self.player:getFavoriteContainer()} )
	end;
	
	test__makeFavoritesListByContainer = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {  favorites={1,2}} )
		GridsMgr.grids[1] = {gridId=1,objType=OBJ_TYPE.ROLE,resId=1,icon=101,sex=0,roleId=10,roleName='role',level=10,allianceId=0}
		GridsMgr.grids[2] = {gridId=2,objType=OBJ_TYPE.FIELD,resId=2,icon=102,sex=1,roleId=20,roleName='',level=3,allianceId=0}

		local expectStr = ',{gridId:1,icon:101,sex:0,roleName:"role",objType:1,roleId:10,resid:1,level:10,alliance:{uid:0,name:"--"}},{gridId:2,icon:102,sex:1,roleName:"",objType:4,roleId:20,resid:2,level:3,alliance:{uid:0,name:"--"}}'
		assert ( MilitarySender:_makeFavoritesListByContainer(self.player, self.player:getFavoriteContainer()) == expectStr )
	end;
	
	testSendDelFavorite = function(self)
		MilitarySender:sendDelFavorite(self.player, 1)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.MILITARY..',favorites:[{_k:"gridId"},{gridId:1,_d:1}]}' )
	end;
	
	test_sendAddFavorite = function(self)
		local g_grid = {gridId=1,objType=OBJ_TYPE.ROLE,resId=1,roleId=10,roleName='role',level=10}
		local g_getGridByGridIdRt = {nil}
		self.mm:mock(app:getCityMgr(), 'getGridByGridId', g_getGridByGridIdRt)
		self.mm:mock(MilitarySender, '_makeGridStr', {',{}'})
		
		MilitarySender:sendAddFavorite(self.player, 1)
		assertEQ ( self.mm.walkLog, 'getGridByGridId' )
		assertEQ ( self.mm.params['getGridByGridId'], {1} )
		assertEQ ( getSendMsg_t(), '' )
		
		self.mm:clear()
		g_getGridByGridIdRt[1] = g_grid
		MilitarySender:sendAddFavorite(self.player, 1)
		assertEQ ( self.mm.walkLog, 'getGridByGridId,_makeGridStr' )
		assertEQ ( self.mm.params['_makeGridStr'], {'', self.player, g_grid} )
		assertEQ ( getSendMsg_t(), '{cmd:'..NETCMD.MILITARY..',favorites:[{_k:"gridId"},{}]}' )
	end;
	
	test_invoke_sendAddFavorite = function(self)
		local g_grid = {gridId=1,objType=OBJ_TYPE.ROLE,resId=1,roleId=10,roleName='role',level=10}
		local g_getGridByGridIdRt = {nil}
		self.mm:mock(app:getCityMgr(), 'getGridByGridId', g_getGridByGridIdRt)
		self.mm:mock(MilitarySender, '_makeGridStr', {',{}'})
		
		MilitarySender:invoke('sendAddFavorite', self.player, 1)
		assertEQ ( self.mm.walkLog, 'getGridByGridId' )
		assertEQ ( self.mm.params['getGridByGridId'], {1} )
		assertEQ ( getSendMsg_t(), '' )
		
		self.mm:clear()
		g_getGridByGridIdRt[1] = g_grid
		MilitarySender:invoke('sendAddFavorite', self.player, 1)
		assertEQ ( self.mm.walkLog, 'getGridByGridId,_makeGridStr' )
		assertEQ ( self.mm.params['_makeGridStr'], {'', self.player, g_grid} )
		assertEQ ( getSendMsg_t(), '{cmd:'..NETCMD.MILITARY..',favorites:[{_k:"gridId"},{}]}' )
	end;
	
	testSendEnemys = function(self)
		self.player:getEnemyContainer():add(1)
		self.player:getEnemyContainer():add(2)
		GridsMgr.grids[2] = {gridId=2,objType=OBJ_TYPE.ROLE,resId=1,roleId=1,roleName='role',icon=101,sex=1,level=10,allianceId=0}
		GridsMgr:MapRoleIdToGridId(1, 2)
		MilitarySender:sendEnemys(self.player)
		assertEQ ( self.player:getEnemyContainer():has(1), true)
		assertEQ ( self.player:getEnemyContainer():has(2), false)
		assertEQ ( getSendMsg_t(), '{cmd:'..NETCMD.MILITARY..',enemys:[{_k:"gridId"},{gridId:2,icon:101,sex:1,roleName:"role",objType:1,roleId:1,resid:1,level:10,alliance:{uid:0,name:"--"}}]}' )
	end;
	
	testSendDelEnemy = function(self)
		MilitarySender:sendDelEnemy(self.player, 1)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.MILITARY..',enemys:[{_k:"gridId"},{gridId:1,_d:1}]}' )
	end;
	
	testSendDefaultTeam = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {  defaultteams={{lineupId=180001,heroIds={1,0,0,0,0},}} } )
		MilitarySender:sendDefaultTeam(self.player, 1)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.MILITARY..',defaultteams:[{id:1,lineup:180001,heros:[1,0,0,0,0]}]}' )
	end;
	
	testSendDefaultTeams = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {  defaultteams={{lineupId=180001,heroIds={1,0,0,0,0}},{lineupId=180002,heroIds={1,0,2,0,0}} } } )
		MilitarySender:sendDefaultTeams(self.player)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.MILITARY..',defaultteams:[{id:1,lineup:180001,heros:[1,0,0,0,0]},{id:2,lineup:180002,heros:[1,0,2,0,0]},{id:3,lineup:0,heros:[0,0,0,0,0]}]}' )	
	end;
	
	testSendLineups = function(self)
		TestCaseCondition:setPreCond(self.player, nil, { lineups={180001,180002} })
		MilitarySender:sendLineups(self.player)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.MILITARY..',lineups:[180001,180002]}' )	
	end;
	
	testSendTodayFTimes = function(self)
		TestCaseCondition:setPreCond(self.player, nil, { todayfighttimes={taofa=1,cuihui=2,tiaoxin=3,fightowner=4} })
		MilitarySender:sendTodayFTimes(self.player)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.MILITARY..',todaytimes:{taofa:1,cuihui:2,tiaoxin:3,fightowner:4}}' )	
	end;
	
	test_sendArmy = function(self)
		local r_getArmyById = {nil}
		local r_getArmyTargetOnwerRoleId = {0}
		self.mm:mock(app:getArmyMgr(), 'getArmyById', r_getArmyById)
		self.mm:mock(MilitarySender, '_sendArmy')
		self.mm:mock(MilitarySender, '_getArmyTargetOnwerRoleId', r_getArmyTargetOnwerRoleId)
		
		local armyId = 1
		MilitarySender:sendArmy(NullPlayer, armyId)
		assertEQ ( self.mm.walkLog, '' )
		
		MilitarySender:sendArmy(self.player, armyId)
		assertEQ ( self.mm.walkLog, 'getArmyById' )
		assertEQ ( self.mm.params['getArmyById'], {armyId} )
		
		self.mm:clear()
		r_getArmyById[1] = {armyId=1, sourceId=self.player:getRoleId(), state=2, fighted=1, stopTime=3}
		MilitarySender:sendArmy(self.player, armyId)
		assertEQ ( self.mm.walkLog, 'getArmyById,_sendArmy' )
		assertEQ ( self.mm.params['_sendArmy'], {self.player, r_getArmyById[1], ARMY_TYPE.SELF} )
		
		self.mm:clear()
		r_getArmyById[1] = {armyId=1, sourceId=self.player:getRoleId()+1, state=2, fighted=1, stopTime=3}
		MilitarySender:sendArmy(self.player, armyId)
		assertEQ ( self.mm.walkLog, 'getArmyById,_getArmyTargetOnwerRoleId' )
		assertEQ ( self.mm.params['_getArmyTargetOnwerRoleId'], { r_getArmyById[1] } )
		
		self.mm:clear()
		r_getArmyTargetOnwerRoleId[1] = self.player:getRoleId()
		r_getArmyById[1] = {armyId=1, sourceId=self.player:getRoleId()+1, targetId=self.player:getRoleId(), expedType=EXPED_TYPE.PAIQIAN, state=2, fighted=1, stopTime=3}
		MilitarySender:sendArmy(self.player, armyId)
		assertEQ ( self.mm.walkLog, 'getArmyById,_getArmyTargetOnwerRoleId,_sendArmy' )
		assertEQ ( self.mm.params['_sendArmy'], {self.player, r_getArmyById[1], ARMY_TYPE.ALLI} )
		
		self.mm:clear()
		r_getArmyTargetOnwerRoleId[1] = self.player:getRoleId()
		r_getArmyById[1] = {armyId=1, sourceId=self.player:getRoleId()+1, targetId=self.player:getRoleId(), expedType=EXPED_TYPE.TIAOXIN, state=2, fighted=1, stopTime=3}
		MilitarySender:sendArmy(self.player, armyId)
		assertEQ ( self.mm.walkLog, 'getArmyById,_getArmyTargetOnwerRoleId,_sendArmy' )
		assertEQ ( self.mm.params['_sendArmy'], {self.player, r_getArmyById[1], ARMY_TYPE.ENEMY} )	
	end;
	
	test__getArmyTargetOnwerRoleId = function()
		local army = {targetType=OBJ_TYPE.ROLE, targetId=1}
		assertEQ ( MilitarySender:_getArmyTargetOnwerRoleId(army), 1 )
		
		local army = {targetType=OBJ_TYPE.COPYFIELD, targetId=2, }
		assertEQ ( MilitarySender:_getArmyTargetOnwerRoleId(army), 2 )
		
		app:getCityMgr():getGridByGridId(1).roleId=0
		local army = {targetType=OBJ_TYPE.FIELD, targetId=1}
		assertEQ ( MilitarySender:_getArmyTargetOnwerRoleId(army), 1 )

		app:getCityMgr():getGridByGridId(1).roleId=4
		local army = {targetType=OBJ_TYPE.FIELD, targetId=1, roleId=4}
		assertEQ ( MilitarySender:_getArmyTargetOnwerRoleId(army), 4 )
	end;
	
	test__sendArmy = function(self)
		local r_getPairBriefPlayer = {false, {name='sourcePlayer'}, {name='targetPlayer'}}
		self.mm:mock(ArmyPlayerGetter, 'getPairBriefPlayer', r_getPairBriefPlayer)
		self.mm:mock(MilitarySender, '_makeArmyStr', {'{isarmystr:1}'})
		
		local p_army = {name='army'}
		local p_armyType = ARMY_TYPE.ENEMY
		MilitarySender:_sendArmy(self.player, p_army, p_armyType)
		assertEQ ( getSendMsg_t(), '' )
		assertEQ ( self.mm.params['getPairBriefPlayer'], { p_army } )
		
		self.mm:clear()
		r_getPairBriefPlayer[1] = true
		MilitarySender:_sendArmy(self.player, p_army, p_armyType)
		assertEQ ( getSendMsg_t(), '{cmd:74,armys:{list:[{isarmystr:1}]}}' )
		assertEQ ( self.mm.params['_makeArmyStr'], { {name='army'}, p_armyType, {name='sourcePlayer'}, {name='targetPlayer'} } )
	end;
	
	test__makeArmyStr = function(self)
		self.mm:mock(MilitarySender, '_getHerosStrByArmy', {'heros'} )
		local p_army = {armyId=2, expedType=3, state=4, stopTime=5, fighted=1}
		local p_armyType = ARMY_TYPE.SELF
		local p_sourcePlayer = FieldPlayer(2)
		local p_targetPlayer = CopyFieldPlayer(171001)
	
		local s = MilitarySender:_makeArmyStr(p_army, p_armyType, p_sourcePlayer, p_targetPlayer)
		assertEQ ( self.mm.params['_getHerosStrByArmy'], {p_army, p_armyType} )
		local expectStr = '{id:2,armyType:'..p_armyType..',expedType:3,sourceRole:"'.. p_sourcePlayer:getRoleName() ..'"'
		expectStr = expectStr..',sourceType:'..p_sourcePlayer:getObjType()..',sourcePos:{x:1,y:0}'
		expectStr = expectStr..',state:4,heros:heros'
		expectStr = expectStr..',targetId:' .. p_targetPlayer:getRoleId() .. ',targetRole:"' .. p_targetPlayer:getRoleName() .. '",targetType:' .. p_targetPlayer:getObjType() .. ',targetPos:{x:0,y:0},stopTime:5,fighted:1}'
		assertEQ ( s, expectStr )
	end;
	
	test__getHerosStrByArmy = function(self)
		self.mm:mock(MilitarySender, '_makeSimpleHero', {'{isSimpleHero:1}'} )
		local p_armyType=ARMY_TYPE.SELF
		local p_army={simpleHeros={4,5}, buff={1}}
		assertEQ ( MilitarySender:_getHerosStrByArmy(p_army, p_armyType), '[{isSimpleHero:1},{isSimpleHero:1}]' )
		assertEQ ( self.mm.params['_makeSimpleHero.1'], {p_army.buff, p_armyType, 4} )
		assertEQ ( self.mm.params['_makeSimpleHero.2'], {p_army.buff, p_armyType, 5} )
		
		p_armyType=ARMY_TYPE.ENEMY
		assertEQ ( MilitarySender:_getHerosStrByArmy(p_army, p_armyType), '[{isSimpleHero:1},{isSimpleHero:1}]' )
	end;
	
	test__makeSimpleHero = function(self)
		local p_armyBuff = {}
		local p_armyType = ARMY_TYPE.ENEMY
		local p_simpleHero = {id=0}
		assertEQ ( MilitarySender:_makeSimpleHero(p_armyBuff, p_armyType, p_simpleHero), '{id:0}')
		
		p_simpleHero = {id=1, name='hero', level=2, attrs={}, soldier={resid=3,number=4}}
		assertEQ ( MilitarySender:_makeSimpleHero(p_armyBuff, p_armyType, p_simpleHero), '{id:1,name:"hero",level:0,attrs:{},soldier:{resid:0,number:0}}')
		
		self.mm:mock(MilitarySender, '_makeAttrsExStr', {'attrs:{"1":10}'})
		p_armyBuff = {ARMY_BUFF.SHOWDETAIL}
		assertEQ ( MilitarySender:_makeSimpleHero(p_armyBuff, p_armyType, p_simpleHero), '{id:1,name:"hero",level:2,attrs:{"1":10},soldier:{resid:3,number:4}}')
		assertEQ ( self.mm.params['_makeAttrsExStr'], {p_simpleHero.attrs, 0} )
		
		p_armyType = ARMY_TYPE.SELF
		p_armyBuff = {}
		assertEQ ( MilitarySender:_makeSimpleHero(p_armyBuff, p_armyType, p_simpleHero), '{id:1,name:"hero",level:2,attrs:{"1":10},soldier:{resid:3,number:4}}')
	end;
	
	test_sendAllArmys = function(self)
		local g_selfArmyId = 10
		local g_enemyArmyId = 20
		local g_allianceArmyId = 30
		
		self.mm:mock(self.player:getArmyContainer(), 'getSelfArmyCount', {1})
		self.mm:mock(self.player:getArmyContainer(), 'getSelfArmyId', {g_selfArmyId})
		self.mm:mock(MilitarySender, 'sendArmy')
		
		self.mm:mock(self.player:getArmyContainer(), 'getEnemyArmyCount', {2})
		self.mm:mock(self.player:getArmyContainer(), 'getEnemyArmyId', {g_enemyArmyId})
		
		self.mm:mock(self.player:getArmyContainer(), 'getAllianceArmyCount', {3})
		self.mm:mock(self.player:getArmyContainer(), 'getAllianceArmyId', {g_allianceArmyId})
		
		MilitarySender:sendAllArmys(self.player)
		assert ( self.mm.walkLog == 'getSelfArmyCount,getSelfArmyId,sendArmy,getEnemyArmyCount,getEnemyArmyId,sendArmy,getEnemyArmyId,sendArmy,getAllianceArmyCount,getAllianceArmyId,sendArmy,getAllianceArmyId,sendArmy,getAllianceArmyId,sendArmy')
		assertListEQ ( self.mm.params['getSelfArmyId'], {0} )
		assertListEQ ( self.mm.params['sendArmy.1'], {self.player, g_selfArmyId} )
		
		assertListEQ ( self.mm.params['getEnemyArmyId.1'], {0} )
		assertListEQ ( self.mm.params['sendArmy.2'], {self.player, g_enemyArmyId} )
		assertListEQ ( self.mm.params['getEnemyArmyId.2'], {1} )
		assertListEQ ( self.mm.params['sendArmy.3'], {self.player, g_enemyArmyId} )
		
		assertListEQ ( self.mm.params['getAllianceArmyId.1'], {0} )
		assertListEQ ( self.mm.params['sendArmy.4'], {self.player, g_allianceArmyId} )
		assertListEQ ( self.mm.params['getAllianceArmyId.2'], {1} )
		assertListEQ ( self.mm.params['sendArmy.5'], {self.player, g_allianceArmyId} )
		assertListEQ ( self.mm.params['getAllianceArmyId.3'], {2} )
		assertListEQ ( self.mm.params['sendArmy.6'], {self.player, g_allianceArmyId} )
	end;
	
	test_sendArmyState = function(self)
		local r_getArmyById = {nil}
		self.mm:mock(app:getArmyMgr(), 'getArmyById', r_getArmyById)
		
		local armyId = 1
		MilitarySender:sendArmyState(NullPlayer, armyId)
		assertEQ ( self.mm.walkLog, '' )
		
		self.mm:clear()
		MilitarySender:sendArmyState(self.player, armyId)
		assertEQ ( self.mm.walkLog, 'getArmyById' )
		assertEQ ( self.mm.params['getArmyById'], {armyId} )
		
		self.mm:clear()
		r_getArmyById[1] = {armyId=10, state=2, fighted=1, stopTime=3}
		MilitarySender:sendArmyState(self.player, armyId)
		local expectStr = '{cmd:'..NETCMD.MILITARY..',armys:{list:[{id:10,state:2,fighted:1,stopTime:3}]}}'
		assert ( getSendMsg_t() == expectStr )
	end;
	
	test_sendDelArmy = function(self)
		MilitarySender:sendDelArmy(self.player, 1)
		local expectStr = '{cmd:'..NETCMD.MILITARY..',armys:{list:[{id:1,_d:1}]}}'
		assert ( getSendMsg_t() == expectStr )
	end;
	
	testSendFightDemo = function(self)
		MilitarySender:sendFightDemo(self.player, 1, 2, 3,  '[]', '[{},{}]')
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.MILITARY..',fightdemo:{id:1,fightId:2,mapId:3,actions:[],result:[{},{}]}}' )
	end;
	
	testSendSuccCopyFields = function(self)
		MilitarySender:sendSuccCopyFields(self.player)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.MILITARY..',succcopyfields:{taofa:[]}}' )
		
		self.player:getsuccCopyFields():insert(1)
		self.player:getsuccCopyFields():insert(2)
		MilitarySender:sendSuccCopyFields(self.player)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.MILITARY..',succcopyfields:{taofa:[1,2]}}' )
	end;
	
	test_sendForceLineupCfg = function(self)
		self.player:getClientCfg():addForceLineup(1, 180001, {1,0,2})
		self.player:getClientCfg():addForceLineup(2, 180002, {1,0,3})
		MilitarySender:sendForceLineupCfg(self.player)
		assertEQ ( getSendMsg_t(), '{cmd:'..NETCMD.MILITARY..',saveforces:[{_k:"type"},{type:1,lineup:180001,heros:[1,0,2]},{type:2,lineup:180002,heros:[1,0,3]}]}' )
	end;
})

local TestCaseMailSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testSendAllBriefMails = function(self)
		self.player:setRoleName('my')
		MailSender:sendAllBriefMails(self.player)
		assert ( getSendMsg_t() == '' )
		
		local expectSQL = "select mailId, receiver, sender, isSys, isRead, title, tempId, addTime, itemCount from mails where receiver='my';"
		local dbRecords = {
			{mailId=1, receiver='receiver1', sender='sender1', isSys=0, isRead=0, title='title1', tempId=0, itemCount=0, addTime=1},
			{mailId=2, receiver='receiver2', sender='sender2', isSys=1, isRead=1, title='title2', tempId=1002, itemCount=0, addTime=2},
		}
		local queryDB = function(sql, dbrows)
			if sql == expectSQL then
				dbrows:setRecords(dbRecords)
			else
				dbrows:setRecords({})
			end
		end;
		app:regDBQuery(queryDB)
		
		MailSender:sendAllBriefMails(self.player)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.MAIL..',mails:[{id:1,hasgoods:0,sys:0,read:0,from:"sender1",title:"title1",time:1},{id:2,hasgoods:0,sys:1,read:1,from:"sender2",title:"title2",time:2}]}' )
	end;
	
	test_sendBriefMail = function(self)
		Util:setTimeDrt(1)
		local mail = app:getMailMgr():addPlayerMail('from', 'to', 'a', 'b')
		clearSendMsg_t()
		Util:setTimeDrt(10)
		
		MailSender:sendBriefMail(self.player, mail)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.MAIL..',mails:[{id:' .. mail:getId() .. ',hasgoods:0,sys:0,read:0,from:"from",title:"a",time:1}]}' )
	end;	
	
	test_sendMail = function(self)
		Util:setTimeDrt(10)
		
		local g_resItem = {id=2, resId=3, number=4, isRaw=0, forceLevel=5, isBind=1, attrs={count=1,attrs={{attr=3,val=2,unit=1}} }, gems={count=2,gems={1001,1002}}}
		local item = LuaItemEx(g_resItem)
		local mail = app:getMailMgr():addSysMail('receiver', 'title', 1001, 'content', {item})
		
		local g_getMailByIdRt =  {nil}
		self.mm:mock(app:getMailMgr(), 'getMailById', g_getMailByIdRt)
		
		MailSender:sendMail( self.player, 1 )
		assertListEQ ( self.mm.params['getMailById'], {1} )
		assert ( getSendMsg_t() == '' )
		
		g_getMailByIdRt[1] = mail
		MailSender:sendMail( self.player, 1 )
		local expectStr = '{cmd:93,mails:[{id:' .. mail:getId() .. ',hasgoods:0,sys:1,read:0,from:"",title:"title",detail:{msg:"content"},items:[{id:2,resid:3,number:4,flevel:5,isBind:1,attrs:{"3":{val:2,u:1}},gems:[{_r:1},1001,1002]}],time:10}]}'
		assert ( getSendMsg_t() == expectStr )
	end;
	
	test_sendCommSysMail = function(self)
		Util:setTimeDrt(10)
		local mail = app:getMailMgr():addSysMail('receiver', 'title', FIXID.COMM_SYS_MAILTEMP, 'content')
		self.mm:mock(app:getMailMgr(), 'getMailById', {mail})
		MailSender:sendMail( self.player, mail:getId() )
		local expectStr = '{cmd:93,mails:[{id:' .. mail:getId() .. ',hasgoods:0,sys:1,read:0,from:"",title:"title",detail:{tempId:' .. FIXID.COMM_SYS_MAILTEMP .. ',tmsg:{con:"content"}},time:10}]}'
		assert ( getSendMsg_t() == expectStr )
	end;
	
	test_sendDelMail = function(self)
		MailSender:sendDelMail(self.player, 1)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.MAIL..',mails:[{id:1,_d:1}]}' )
	end;
	
	test_sendMailClearItem = function(self)
		MailSender:sendMailClearItem(self.player, 1)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.MAIL..',mails:[{id:1,hasgoods:0,items:[{_r:1}]}]}' )
	end;
})

local TestCasePlayerCityDefSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.cityDef = self.player:getCityDef()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testSendDefs = function(self)
		self.cityDef:setDefNumber(CITYDEF_TYPE.XIANJING, 1)
		self.cityDef:setDefNumber(CITYDEF_TYPE.GUNMU, 2)
		self.cityDef:setDefNumber(CITYDEF_TYPE.JUMA, 0)
		self.cityDef:setDefNumber(CITYDEF_TYPE.LEISHI, 3)
		self.cityDef:setDefNumber(CITYDEF_TYPE.NUJIAN, 4)
		PlayerCityDefSender:sendDefs(self.player)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.CITYDEF..',citydefs:[1,2,0,3,4]}' )
	end;
	
	test_sendBuilding = function(self)
		self.cityDef:setBuildingStopTime(1)
		self.cityDef:setBuildingResid(2)
		self.cityDef:setBuildingNumber(3)
		
		PlayerCityDefSender:sendBuilding(self.player)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.CITYDEF..',building:{stoptime:1,id:2,number:3}}' )
	end;
	
	test_sendDefArmy = function(self)
		PlayerCityDefSender:sendDefArmy(self.player)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.CITYDEF..',defarmy:{heros:[0,0,0,0,0],lineupId:0}}' )
	end;
})

local TestCasePlayerTowerSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testSendTowers = function(self)
		self.player:getArmyContainer():setAllTowerSoldiers({{resid=0, number=0},{resid=150001001, number=10},{resid=0, number=0},{resid=0, number=0},{resid=0, number=0}})
		PlayerTowerSender:sendTowers(self.player)
		local expectStr = '{cmd:'..NETCMD.TOWER..',tower:{lineupId:180004,soldiers:[{resid:0,number:0},{resid:150001001,number:10},{resid:0,number:0},{resid:0,number:0},{resid:0,number:0}]}}'
		assert ( getSendMsg_t() == expectStr )
	end;
})

local TestCasePlayerSelfFieldSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendAllSelfFields = function(self)
		PlayerSelfFieldSender:sendAllSelfFields(self.player)
		assertEQ ( getSendMsg_t(), '{cmd:'..NETCMD.SELFFIELD..',selffields:[]}' )
		
		self.mm:mock( self.player:getCitys(), 'getBuildLevelByResId', {100} )
		app:getCityMgr():getGridByGridId(1).resId = 2
		app:getCityMgr():getGridByGridId(1).level = 3
		app:getCityMgr():getGridByGridId(2).resId = 4
		app:getCityMgr():getGridByGridId(2).level = 5
		self.player:getSelfField():addField({gridId=1})
		self.player:getSelfField():addField({gridId=2})
		PlayerSelfFieldSender:sendAllSelfFields(self.player)
		assertEQ ( getSendMsg_t(), '{cmd:'..NETCMD.SELFFIELD..',selffields:[{id:1,resid:2,level:3,startTime:0},{id:2,resid:4,level:5,startTime:0}]}' )
	end;
	
	testSendSelfField = function(self)
		local fieldGrid = 1
		app:getCityMgr():getGridByGridId(1).resId = 2
		app:getCityMgr():getGridByGridId(1).level = 3
		self.player:getSelfField():addField({gridId=1})
		PlayerSelfFieldSender:sendSelfField(self.player, fieldGrid)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.SELFFIELD..',selffields:[{id:1,resid:2,level:3,startTime:0}]}' )
	end;
	
	testSendDeleteSelfField = function(self)
		PlayerSelfFieldSender:sendDeleteSelfField(self.player, 1)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.SELFFIELD..',selffields:[{id:1,_d:1}]}' )
	end;
	
	test_sendCanGetRes = function(self)
		PlayerSelfFieldSender:sendCanGetRes(self.player, 1, {food=1, wood=2, stone=3, iron=4} )
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.SELFFIELD..',selffields:[{id:1,canGetRes:{food:1,wood:2,stone:3,iron:4}}]}' )
	end;
})

local TestCaseItemOpSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendDecomposeResult = function(self)
		ItemOpSender:sendDecomposeResult(self.player, {{armResid=1,forceLevel=2,resid=3,number=4},{armResid=5,forceLevel=6,resid=7,number=8}})
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.ITEMOP..',splitResults:[{armResid:1,forceLevel:2,resid:3,number:4},{armResid:5,forceLevel:6,resid:7,number:8}]}' )
	end;
	
	test_sendIntensifyResult = function(self)
		local resItem = {id=1, resId=2, number=3, forceLevel=4, isBind=1, attrs={count=0,attrs={} }, gems={count=0,gems={}}}
		ItemOpSender:sendIntensifyResult(self.player, ItemEx(resItem))
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.ITEMOP..',intensifyResult:{resid:2,forceLevel:4}}' )
	end;
	
	test_sendBesetResult = function(self)
		local resItem = {id=1, resId=2, number=3, forceLevel=4, isBind=1, attrs={count=0,attrs={} }, gems={count=0,gems={}}}
		ItemOpSender:sendBesetResult(self.player, ItemEx(resItem))
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.ITEMOP..',besetResult:{}}' )
	end;
})

local TestCaseOutFieldSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendFields = function(self)
		local grid2 = {}
		local grid3 = {}
		self.mm:mock(app:getCityMgr(), 'getGridByGridId', nil, function(self, gridId)
			if gridId == 2 then
				return grid2
			elseif gridId == 3 then
				return grid3
			end
			return nil
		end)
		
		self.mm:mock(OutFieldSender, '_getBaseGridInfo', { 'base:1' } )
		self.mm:mock(OutFieldSender, '_getAppendGridRoleInfo', { ',append:2' } )
		
		local gridIds = {1}
		OutFieldSender:sendFields(self.player, gridIds)
		assert ( getSendMsg_t() == '' )
		
		local gridIds = {2,3}
		OutFieldSender:sendFields(self.player, gridIds)
		assert ( getSendMsg_t() == '{cmd:'..NETCMD.OUTFIELD..',outFields:[{_k:"gridId"},{isDetail:0,base:1,append:2},{isDetail:0,base:1,append:2}]}' )
		assertListEQ ( self.mm.params['_getBaseGridInfo.1'], {grid2} )
		assertListEQ ( self.mm.params['_getAppendGridRoleInfo.1'], {grid2} )
		assertListEQ ( self.mm.params['_getBaseGridInfo.2'], {grid3} )
		assertListEQ ( self.mm.params['_getAppendGridRoleInfo.2'], {grid3} )
	end;
	
	test_sendFieldDetail = function(self)
		self.player:setPlatForm({openid='openid1', openkey='openkey1', appid='appid1', pf='qzone', pfkey='pfkey1', zoneid='zoneid1' })
	
		local g_grid = {gridId=1,alliName='alli', cityLevel=1, buildCurVal=3, roleRank=100, introduction='sign', misc={towerLayer=99,terraceGate=8,cityMaxLevel=3} }
		self.mm:mock(OutFieldSender, '_getBaseGridInfo', { 'base:1' } )
		self.mm:mock(OutFieldSender, '_getAppendGridRoleInfo', { ',append:2' } )
		
		OutFieldSender:sendFieldDetail(self.player, g_grid)
		assertEQ ( self.mm.params['_getBaseGridInfo'], {g_grid} )
		assertEQ ( self.mm.params['_getAppendGridRoleInfo'], {g_grid} )
		local expectStr = '{cmd:98,outFields:[{_k:"gridId"},{isDetail:1,base:1,append:2,buildval:{level:1,cur:3},rank:100,introduction:"sign",actTower:99,actTerrace:8,cityMaxLevel:3,ydInfo:{}}]}'
		assertEQ ( getSendMsg_t(), expectStr )
	end;
	
	test__getBaseGridInfo = function(self)
		local grid = {gridId=1,objType=OBJ_TYPE.ROLE, resId=170001, roleId=1000, modelId=17000101, subCitys='1,2,3', roleName='role', userName='user', level=1, sex=0, state=0, icon=0, allianceId=0, enemyAlliId=0, misc={vip_level=1}}
		assert ( OutFieldSender:_getBaseGridInfo(grid) == 'gridId:1,objType:' .. OBJ_TYPE.ROLE .. ',modelId:17000101' .. ',resid:170001,level:1,ydInfo:{},vip:1')
	end;
	
	test__getAppendGridRoleInfo = function(self)
		local grid = {roleId=0, objType=OBJ_TYPE.NONE}
		assert ( OutFieldSender:_getAppendGridRoleInfo(grid) == ',roleId:0,roleName:"",alliance:{uid:0,name:""}' )
		
		self.mm:mock(app:getAlliMgr(), 'getAlliById', nil, function(self, alliId)
			local alli = Alliance()
			alli:setId(0)
			alli:setName('--')
			alli:setLevel('0')
			alli:setFlag('')			
			if alliId == 0 then
				alli:setId(0)
				alli:setFlag('')
			elseif alliId == 1 then
				alli:setId(1)
				alli:setFlag('一')			
			elseif alliId == 2 then
				alli:setId(2)
				alli:setFlag('二')			
			end
			return alli
		end)
		
		local grid = {objType=OBJ_TYPE.ROLE, resId=0, roleId=1000, modelId=17000101, subCitys='1,2,3', roleName='role', userName='user', level=1, sex=0, state=0, icon=102, allianceId=0, enemyAlliId=0}
		assert ( OutFieldSender:_getAppendGridRoleInfo(grid) == ',roleId:1000,roleName:"role",alliance:{uid:0,name:"--"},icon:102,subCitys:[1,2,3]' )
		
		local grid = {objType=OBJ_TYPE.ROLE, resId=0, roleId=1000, modelId=17000101, subCitys='1,2,3', roleName='role', userName='user', level=1, sex=0, state=0, icon=102, allianceId=1, enemyAlliId=2}
		assert ( OutFieldSender:_getAppendGridRoleInfo(grid) == ',roleId:1000,roleName:"role",alliance:{uid:1,name:"--"},icon:102,subCitys:[1,2,3],myAlliFlag:"一",enemyAlliFlag:"二"' )
	end;
})

local TestCaseFriendSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendFriend = function(self)
		local g_roleId = 10000
		local g_grid = {}
		local g_getGridByGridIdRt = {nil}
		
		self.mm:mock(app:getCityMgr(), 'getGridByRoleId', g_getGridByGridIdRt)
		self.mm:mock(FriendSender, '_makeFriendStr', {'{}'})
		FriendSender:sendFriend(self.player, g_roleId)
		assertEQ ( getSendMsg_t(), '' )
		assertEQ ( self.mm.params['getGridByRoleId'], {g_roleId} )
		
		g_getGridByGridIdRt[1] = g_grid
		FriendSender:sendFriend(self.player, g_roleId)
		local expectStr = '{cmd:'..NETCMD.FRIEND..',friends:[{_k:"roleId"},{}]}'
		assertEQ ( getSendMsg_t(), expectStr )
		assertEQ ( self.mm.params['_makeFriendStr'], {self.player, g_grid} )
	end;
	
	test_sendAllFriends = function(self)
		self.mm:mock(FriendSender, '_removeNullFriends')
		self.mm:mock(FriendSender, '_sendAllFriends')
		FriendSender:sendAllFriends(self.player)
		assertEQ ( self.mm.walkLog, '_removeNullFriends,_sendAllFriends' )
	end;
	
	test_sendRemoveFriend = function(self)
		local g_roleId = 10000
		FriendSender:sendRemoveFriend(self.player, g_roleId)
		local expectStr = '{cmd:'..NETCMD.FRIEND..',friends:[{_k:"roleId"},{roleId:' .. g_roleId .. ',_d:1}]}'
		assertEQ ( getSendMsg_t(), expectStr )
	end;
	
	test_sendApply = function(self)
		local g_roleId = 10000
		local g_grid = {}
		local g_getGridByGridIdRt = {nil}
		
		self.mm:mock(app:getCityMgr(), 'getGridByRoleId', g_getGridByGridIdRt)
		self.mm:mock(FriendSender, '_makeApplyStr', {'{}'})
		self.mm:mock(FriendSender, '_sendHasApply')
		FriendSender:sendApply(self.player, g_roleId)
		assertEQ ( self.mm.walkLog, 'getGridByRoleId' )
		assertEQ ( getSendMsg_t(), '' )
		assertEQ ( self.mm.params['getGridByRoleId'], {g_roleId} )
		
		self.mm:clear()
		g_getGridByGridIdRt[1] = g_grid
		FriendSender:sendApply(self.player, g_roleId)
		assertEQ ( self.mm.walkLog, 'getGridByRoleId,_makeApplyStr,_sendHasApply' )
		local expectStr = '{cmd:'..NETCMD.FRIEND..',applys:[{_k:"roleId"},{}]}'
		assertEQ ( getSendMsg_t(), expectStr )
		assertEQ ( self.mm.params['_makeApplyStr'], {g_grid} )
	end;
	
	test_sendAllApplys = function(self)
		self.mm:mock(FriendSender, '_removeNullApplys')
		self.mm:mock(FriendSender, '_sendAllApplys')
		FriendSender:sendAllApplys(self.player)
		assertEQ ( self.mm.walkLog, '_removeNullApplys,_sendAllApplys' )
	end;
	
	test_sendRemoveApply = function(self)
		local g_roleId = 10000
		FriendSender:sendRemoveApply(self.player, g_roleId)
		local expectStr = '{cmd:'..NETCMD.FRIEND..',applys:[{_k:"roleId"},{roleId:' .. g_roleId .. ',_d:1}]}'
		assertEQ ( getSendMsg_t(), expectStr )
	end;
	
	test_sendFriendChat = function(self)
		local g_fromRoleId = 10000
		FriendSender:sendFriendChat(self.player, g_fromRoleId, 'fromRole', 'msg')
		local expectStr = '{cmd:'..NETCMD.FRIEND..',chat:{roleId:10000,roleName:"fromRole",time:' .. Util:getTime() .. ',msg:"msg"}}'
		assertEQ ( getSendMsg_t(), expectStr )
	end;
	
	test__removeNullFriends = function(self)
		local player1 = TestCaseHelper:loadPlayerByUserNameEx('player1', 'player1_r', 200000)
		
		self.player:getFriendMgr():addFriend(10000000)
		self.player:getFriendMgr():addFriend(200000)
		self.player:getFriendMgr():addFriend(10000001)
		assertEQ ( self.player:getFriendMgr():getFriendCount(), 3 )
		FriendSender:_removeNullFriends(self.player)
		assertEQ ( self.player:getFriendMgr():getFriendCount(), 1 )
		assertEQ ( self.player:getFriendMgr():getFriendByIdx(0).roleId, 200000 )
	end;
	
	test__sendAllFriends = function(self)
		local player1 = TestCaseHelper:loadPlayerByUserNameEx('player1', 'player1_r', 200000)
		local player2 = TestCaseHelper:loadPlayerByUserNameEx('player2', 'player2_r', 200001)
		
		local g_grid = {}
		self.mm:mock(app:getCityMgr(), 'getGridByRoleId', {g_grid})
		self.mm:mock(FriendSender, '_makeFriendStr', {'{}'})
		
		FriendSender:_sendAllFriends(self.player)
		assertEQ ( getSendMsg_t(), '' )

		self.player:getFriendMgr():addFriend(200000)
		self.player:getFriendMgr():addFriend(200001)
		clearSendMsg_t()
		
		self.mm:clear()
		FriendSender:_sendAllFriends(self.player)
		local expectStr = '{cmd:'..NETCMD.FRIEND..',friends:[{_k:"roleId"},{},{}]}'
		assertEQ ( getSendMsg_t(), expectStr )
		assertEQ ( self.mm.walkLog, 'getGridByRoleId,_makeFriendStr,getGridByRoleId,_makeFriendStr' )
		assertEQ ( self.mm.params['getGridByRoleId.1'], {200000} )
		assertEQ ( self.mm.params['getGridByRoleId.2'], {200001} )
		assertEQ ( self.mm.params['_makeFriendStr.1'], {self.player, g_grid} )
		assertEQ ( self.mm.params['_makeFriendStr.2'], {self.player, g_grid} )
	end;
	
	test__removeNullApplys = function(self)
		local player1 = TestCaseHelper:loadPlayerByUserNameEx('player1', 'player1_r', 200000)
		
		self.player:getFriendMgr():addApply(10000000)
		self.player:getFriendMgr():addApply(200000)
		self.player:getFriendMgr():addApply(10000001)
		assertEQ ( self.player:getFriendMgr():getApplyCount(), 3 )
		FriendSender:_removeNullApplys(self.player)
		assertEQ ( self.player:getFriendMgr():getApplyCount(), 1 )
		assertEQ ( self.player:getFriendMgr():getApplyByIdx(0), 200000 )	
	end;
	
	test__sendAllApplys = function(self)
		local player1 = TestCaseHelper:loadPlayerByUserNameEx('player1', 'player1_r', 200000)
		local player2 = TestCaseHelper:loadPlayerByUserNameEx('player2', 'player2_r', 200001)
		
		local g_grid = {}
		self.mm:mock(app:getCityMgr(), 'getGridByRoleId', {g_grid})
		self.mm:mock(FriendSender, '_makeApplyStr', {'{}'})
		self.mm:mock(FriendSender, '_sendHasApply')
		
		FriendSender:_sendAllApplys(self.player)
		assertEQ ( getSendMsg_t(), '' )

		self.player:getFriendMgr():addApply(200000)
		self.player:getFriendMgr():addApply(200001)
		clearSendMsg_t()
		
		self.mm:clear()
		FriendSender:_sendAllApplys(self.player)
		local expectStr = '{cmd:'..NETCMD.FRIEND..',applys:[{_k:"roleId"},{},{}]}'
		assertEQ ( getSendMsg_t(), expectStr )
		assertEQ ( self.mm.walkLog, 'getGridByRoleId,_makeApplyStr,getGridByRoleId,_makeApplyStr,_sendHasApply' )
		assertEQ ( self.mm.params['getGridByRoleId.1'], {200000} )
		assertEQ ( self.mm.params['getGridByRoleId.2'], {200001} )
		assertEQ ( self.mm.params['_makeApplyStr.1'], {g_grid} )
		assertEQ ( self.mm.params['_makeApplyStr.2'], {g_grid} )	
	end;
	
	test__sendHasApply = function(self)
		FriendSender:_sendHasApply(self.player)
		assertEQ ( getSendMsg_t(), '{cmd:'..NETCMD.FRIEND..',hasApply:1}' )
	end;
	
	test__makeFriendStr = function(self)
		self.player:setPlatForm({openid='openid1', openkey='openkey1', appid='appid1', pf='qzone', pfkey='pfkey1', zoneid='zoneid1' })
	
		local g_grid = {gridId=1, objType=OBJ_TYPE.ROLE, roleId=10000, roleName='role', sex=0, icon=100, level=20, cityLevel=10, misc={is_yellow_vip=1,yellow_vip_level=2,vip_level=1}}
		local expectStr = '{roleId:10000,died:0,roleName:"role",icon:100,sex:0,level:20,buildval:{level:10},gridId:1,ydInfo:{is_yellow_vip:1,yellow_vip_level:2},vip:1}'
		assertEQ ( FriendSender:_makeFriendStr(self.player, g_grid), expectStr )
		
		local g_grid = {gridId=1, objType=OBJ_TYPE.DIED_ROLE, roleId=10000, roleName='role', sex=0, icon=100, level=20, cityLevel=10, misc={vip_level=0}}
		local expectStr = '{roleId:10000,died:1,roleName:"role",icon:100,sex:0,level:20,buildval:{level:10},gridId:1,ydInfo:{},vip:0}'
		assertEQ ( FriendSender:_makeFriendStr(self.player, g_grid), expectStr )
	end;
	
	test__makeApplyStr = function(self)
		local g_grid = {gridId=1, roleId=10000, roleName='role', icon=100, sex=1, level=20}
		local expectStr = '{roleId:10000,roleName:"role",icon:100,sex:1,level:20,gridId:1}'
		assertEQ ( FriendSender:_makeApplyStr(g_grid), expectStr )
	end;
})

local TestCaseExchangeHeroExpSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendTodayTimes = function(self)
		self.mm:mock(self.player:getCitys(), 'getExchangeExpTodayTimes', {{curTimes=1, maxTimes=2}})
		ExchangeHeroExpSender:sendTodayTimes(self.player)
		assertEQ ( getSendMsg_t(), '{cmd:'..NETCMD.EXCHANGEEXP..',todaytimes:{cur:1,max:2}}' )
	end;
})

local TestCaseFightResStateSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		local SELF = self
		self.mm:mock(FightRefStateGateway, 'loadAll', nil ,function(self, states)
			states[SELF.player:getRoleId() .. '.' .. (SELF.player:getRoleId()+1)] = {id=1, roleId1=SELF.player:getRoleId(), roleId2=SELF.player:getRoleId() + 1, state=REF_ROLESTATE.DECLARING_FIGHT, stopTime=1000000}
			states[SELF.player:getRoleId() .. '.' .. (SELF.player:getRoleId()+2)] = {id=2, roleId1=SELF.player:getRoleId(), roleId2=SELF.player:getRoleId() + 2, state=REF_ROLESTATE.FIGHTING, stopTime=1100000}
			return 1
		end)
		Repository:getFightState():loadAll()		
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendAllStates = function(self)
		local targetRoleId1 = self.player:getRoleId() + 1
		local targetRoleId2= self.player:getRoleId() + 2
		FightResStateSender:sendAllStates(self.player)
		local expectStr =  '{cmd:'..NETCMD.FIGHTREFSTATE..',states:[{id:' .. targetRoleId2 .. ',state:' .. REF_ROLESTATE.FIGHTING .. ',stoptime:1100000},{id:' .. targetRoleId1 .. ',state:' .. REF_ROLESTATE.DECLARING_FIGHT .. ',stoptime:1000000}]}' 
		assertEQ ( getSendMsg_t(), expectStr)
	end;
	
	test_sendState = function(self)
		local p_targetRoleId = self.player:getRoleId() + 3
		FightResStateSender:sendState(self.player, p_targetRoleId)
		assertEQ ( getSendMsg_t(), '{cmd:'..NETCMD.FIGHTREFSTATE..',states:[{id:' ..p_targetRoleId ..',_d:1}]}' )
		
		p_targetRoleId = self.player:getRoleId() + 1
		FightResStateSender:sendState(self.player, p_targetRoleId)
		assertEQ ( getSendMsg_t(), '{cmd:'..NETCMD.FIGHTREFSTATE..',states:[{id:' .. p_targetRoleId .. ',state:' .. REF_ROLESTATE.DECLARING_FIGHT .. ',stoptime:1000000}]}' )
	end;
})

local TestCaseRoleStateSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendStates = function(self)
		local g_innerState1 = {id=1,times=1,type = EFFECT_TYPE.ONETIME,startTime = 1,lastTime=1, duration=1, creator={skillId=1,id=1,type=1}, effect={id=2,val=1,unit=1}}
		local g_state1 = State(self.player, 1, g_innerState1)
		
		self.player:getStateContainer().states = {g_state1}
		RoleStateSender:sendStates(self.player)
		assertEQ(getSendMsg_t(), '', 'not send EFFECT_TYPE.ONETIME state')
		
		g_innerState2 = {id=1,times=1,type = EFFECT_TYPE.PER_SECOND,startTime = 1,lastTime=1, duration=1, creator={skillId=1,id=1,type=1}, effect={id=2,val=1,unit=1}}
		g_state2 = State(self.player, 2, g_innerState2)
		self.player:getStateContainer().states = {g_state1,g_state2}
		
		RoleStateSender:sendStates(self.player)
		local expectMsg = '{cmd:'..NETCMD.ROLESTATE..',states:[{_k:"uid"},{uid:2,id:2,val:1,stoptime:2,target:{type:28}}]}'
		assertEQ(getSendMsg_t(), expectMsg)
	end;
	
	test_sendAddState = function(self)
		local g_innerState = {id=1,times=1,type = EFFECT_TYPE.ONETIME,startTime = 1,lastTime=1, duration=1, creator={skillId=1,id=1,type=1}, effect={id=2,val=1,unit=1}}
		local g_state = State(self.player, 1, g_innerState)
		
		RoleStateSender:sendAddState(self.player, g_state)
		assertEQ(getSendMsg_t(), '', 'not send EFFECT_TYPE.ONETIME state')
		
		g_innerState = {id=1,times=1,type = EFFECT_TYPE.PER_SECOND,startTime = 1,lastTime=1, duration=1, creator={skillId=1,id=1,type=1}, effect={id=2,val=100,unit=1}}
		g_state = State(self.player, 1, g_innerState)
		
		RoleStateSender:sendAddState(self.player, g_state)
		local expectMsg = '{cmd:'..NETCMD.ROLESTATE..',states:[{_k:"uid"},{uid:1,id:2,val:100,stoptime:2,target:{type:28}}]}'
		assertEQ(getSendMsg_t(), expectMsg)
	end;
	
	test_sendDelState = function(self)
		local g_innerState = {id=1,times=1,type = EFFECT_TYPE.ONETIME,startTime = 1,lastTime=1, duration=1, creator={skillId=1,id=1,type=1}, effect={id=2,val=1,unit=1}}
		local g_state = State(self.player, 1, g_innerState)
		
		RoleStateSender:sendDelState(self.player, g_state)
		assertEQ(getSendMsg_t(), '', 'not send EFFECT_TYPE.ONETIME state')
		
		g_innerState = {id=1,times=1,type = EFFECT_TYPE.PER_SECOND,startTime = 1,lastTime=1, duration=1, creator={skillId=1,id=1,type=1}, effect={id=2,val=1,unit=1}}
		g_state = State(self.player, 1, g_innerState)
		
		RoleStateSender:sendDelState(self.player, g_state)
		local expectMsg = '{cmd:'..NETCMD.ROLESTATE..',states:[{_k:"uid"},{uid:1,_d:1}]}'
		assertEQ(getSendMsg_t(), expectMsg)
	end;
})

local TestCaseChatSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendMsg = function(self)
		local fromId = 10000
		local fromName = 'role'
		local channel = 1
		local msg = 'msg"msg'
		local appendInfo = {vip=1,blue={level=2,year=1,super=0,grow=3}}
		ChatSender:sendMsg(self.player, 9900001, fromId, fromName, appendInfo, channel, msg)
		local expectMsg = '{cmd:'..NETCMD.CHAT..',fromCityId:9900001,fromId:10000,fromName:"role",fromInfo:{vip:1,blue:{level:2,year:1,super_:0,grow:3}},channel:1,msg:"msg\'msg"}'
		assertEQ(getSendMsg_t(), expectMsg)
	end;
	
	test_sendPlayerMsg = function(self)
		local fromId = 10000
		local fromName = 'role'
		local toId = 20000
		local toName = 'target'
		local channel = 1
		local msg = 'msg"msg'
		local fromInfo = {vip=1,blue={level=2,year=1,super=0,grow=3}}
		local toInfo = {vip=2,blue={level=3,year=0,super=1,grow=4}}
		ChatSender:sendPlayerMsg(self.player, fromId, fromName, fromInfo, toId, toName, toInfo, channel, msg)
		local expectMsg = '{cmd:'..NETCMD.CHAT..',fromId:10000,fromName:"role",fromInfo:{vip:1,blue:{level:2,year:1,super_:0,grow:3}},toId:20000,toName:"target",toInfo:{vip:2,blue:{level:3,year:0,super_:1,grow:4}},channel:1,msg:"msg\'msg"}'
		assertEQ(getSendMsg_t(), expectMsg)	
	end;
})

local TestCaseAllianceSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendCreateAlliance = function(self)
		AllianceSender:sendCreateAlliance(self.player)
		local expectMsg = '{cmd:'..NETCMD.ALLIANCE..',create:{result:0,allipos:'..ALLI_POS.LEADER..'}}'
		assertEQ(getSendMsg_t(), expectMsg)
	end;
	
	test_sendApplyListToLeaders = function(self)
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		
		local mem1 = AllianceMember()
		mem1:setId(1)
		mem1:setAlliPos(ALLI_POS.MEM)
		local mem2 = AllianceMember()
		mem2:setId(2)
		mem2:setAlliPos(ALLI_POS.ELDER)
		local mem3 = AllianceMember()
		mem3:setId(3)
		mem3:setAlliPos(ALLI_POS.ALEADER)
		alliance:addMember(mem1)
		alliance:addMember(mem2)
		alliance:addMember(mem3)
		
		self.mm:mock(AllianceSender, '_makeApplyListStr', {'msg'})
		self.mm:mock(ArmyPlayerGetter, 'getOnlinePlayer', {NullPlayer})
		self.mm:mock(NullPlayer, 'sendMsg')
		AllianceSender:sendApplyListToLeaders(alliance)
		assertEQ ( self.mm.params['_makeApplyListStr'], {alliance:getApplyRoleIdsSet()} )
		assertEQ ( self.mm.params['getOnlinePlayer.1'], {OBJ_TYPE.ROLE, self.player:getRoleId()} )
		assertEQ ( self.mm.params['getOnlinePlayer.2'], {OBJ_TYPE.ROLE, 2} )
		assertEQ ( self.mm.params['getOnlinePlayer.3'], {OBJ_TYPE.ROLE, 3} )
		assertEQ ( self.mm.params['sendMsg.1'], {'msg'} )
		assertEQ ( self.mm.params['sendMsg.2'], {'msg'} )
		assertEQ ( self.mm.params['sendMsg.3'], {'msg'} )
	end;
	
	test_sendApplyListToPlayer = function(self)
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		self.mm:mock(AllianceSender, '_makeApplyListStr', {'msg'})
		self.mm:mock(self.player, 'sendMsg')
		AllianceSender:sendApplyListToPlayer(self.player, alliance)
		assertEQ ( self.mm.params['_makeApplyListStr'], {alliance:getApplyRoleIdsSet()} )
		assertEQ ( self.mm.params['sendMsg'], {'msg'} )
	end;
	
	test_sendDeleteApply = function(self)
		local roleId = 10001
		AllianceSender:sendDeleteApply(self.player, roleId)
		assertEQ(getSendMsg_t(), '{cmd:'..NETCMD.ALLIANCE..',applys:[{_k:"roleId"},{roleId:10001,_d:1}]}' )
	end;
	
	test_sendCurApplying = function(self)
		self.player:setCurApplyAlliance('alli')
		AllianceSender:sendCurApplying(self.player)
		assertEQ(getSendMsg_t(), '{cmd:'..NETCMD.ALLIANCE..',applyinfo:{alli:"alli"}}' )
	end;
	
	test_sendGetInviteList = function(self)
		self.mm:mock(app:getCityMgr(), 'getGridByRoleId', nil, function(self, roleId)
			if roleId == 2 then
				return nil
			elseif roleId == 3 then
				return {roleName='role'}
			end
		end)
		self.mm:mock(app:getAlliMgr(), 'getAlliById', nil, function(self, allianceId)
			if allianceId == 1 then
				local a = Alliance()
				a:setId(1)
				a:setName('alliance1')
				return a
			elseif allianceId == 2 then
				local a = Alliance()
				a:setId(2)
				a:setName('alliance2')
				return a
			end
		end)
		
		local desc1 = string.format(rstr.alliance.invitejion, '--', 'alliance1')
		local desc2 = string.format(rstr.alliance.invitejion, 'role', 'alliance2')
		
		local set = self.player:getInviteJoinAlliances()
		set:insert({allianceId=1, roleId=2})
		set:insert({allianceId=2, roleId=3})
		AllianceSender:sendGetInviteList(self.player)
		local expectMsg = '{cmd:'..NETCMD.ALLIANCE..',inviteinfo:[{_k:"alliId"},{desc:"' .. desc1 .. '",roleId:2,alliId:1},{desc:"' .. desc2 .. '",roleId:3,alliId:2}]}'
		assertEQ ( getSendMsg_t() , expectMsg )
	end;
	
	test_sendDeleteInvite = function(self)
		AllianceSender:sendDeleteInvite(self.player, 1)
		local expectMsg = '{cmd:'..NETCMD.ALLIANCE..',inviteinfo:[{_k:"alliId"},{alliId:1,_d:1}]}'
		assertEQ ( getSendMsg_t() , expectMsg )
	end;
	
	test_sendAllianceDetail = function(self)
		self.player:setCityId(9900001)
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		alliance:setLevel(1)
		alliance:setBuildVal(2)
		alliance:setCardNumber(3)
		alliance:setHonour(4)
		alliance:setIntroduction('intro')
		
		AllianceSender:sendAllianceDetail(self.player, alliance)
		local expectMsg =  '{cmd:' .. NETCMD.ALLIANCE .. ',detail:{name:"alliance",level:1,flag:"f",leader:"'.. self.player:getRoleName() .. '",cityResId:9900001,mem:1,buildVal:2,card:3,honour:4,introduction:"intro"}}'
		assertEQ ( getSendMsg_t() , expectMsg )
	end;
	
	test_sendAlliances = function(self)
		local alliance1 = app:getAlliMgr():createAlliance(self.player, 'alliance1', 'a')
		local alliance2 = app:getAlliMgr():createAlliance(self.player, 'alliance2', 'b')
		
		alliance1:setRank(100)
		alliance1:setCityResId(9900001)
		alliance1:setLeader('leader1')
		alliance1:setLevel(2)
		alliance1:setHonour(200)
		
		alliance2:setRank(101)
		alliance2:setCityResId(9900002)
		alliance2:setLeader('leader2')
		alliance2:setLevel(3)
		alliance2:setHonour(300)
		
		local alliances = {alliance1,alliance2}
		local pageCount = 3
		local pageNo = 2
		local selectIdx = 1
		AllianceSender:sendAlliances(self.player, 0, alliances, (pageNo-1)*12, pageCount, pageNo, selectIdx)
		
		local alliancesMsg = '[{rank:13,name:"alliance1",cityResId:9900001,leader:"leader1",level:2,mem:1,honour:200},{rank:14,name:"alliance2",cityResId:9900002,leader:"leader2",level:3,mem:1,honour:300}]'
		local expectMsg = '{cmd:' .. NETCMD.ALLIANCE .. ',cityResId:0,alliances:' .. alliancesMsg .. ',pageNo:2,pageCount:3,curSelIdx:1}'
		assertEQ ( getSendMsg_t() , expectMsg )
		
		local ranks = {{lastLevel=4, lastHonour=2000},{lastLevel=5, lastHonour=3000}}
		AllianceSender:sendAlliances(self.player, 0, alliances, (pageNo-1)*12,pageCount, pageNo, selectIdx,ranks)
		local alliancesMsg = '[{rank:13,name:"alliance1",cityResId:9900001,leader:"leader1",level:4,mem:1,honour:2000},{rank:14,name:"alliance2",cityResId:9900002,leader:"leader2",level:5,mem:1,honour:3000}]'
		local expectMsg = '{cmd:' .. NETCMD.ALLIANCE .. ',cityResId:0,alliances:' .. alliancesMsg .. ',pageNo:2,pageCount:3,curSelIdx:1}'
		assertEQ ( getSendMsg_t() , expectMsg )
	end;
	
	test_sendSelfAlliMems = function(self)
		local player = TestCaseHelper:loadPlayerByUserNameEx('source1', 'r1', 200001)
		local alliance = app:getAlliMgr():createAlliance(player, 'alliance', 'f')
		local mems = {alliance:getMemberByIdx(0)}
		local pageCnt = 2
		local pageNo = 1
		
		self.mm:mock(AllianceSender, '_sendSelfAlliMems')
		AllianceSender:sendSelfAlliMems(player, alliance, mems, pageCnt, pageNo)
		assertEQ ( self.mm.params['_sendSelfAlliMems'], {player, alliance, mems, pageCnt, pageNo, 'selfmems'})
	end;
	
	test_sendTodaySortMems = function(self)
		local player = TestCaseHelper:loadPlayerByUserNameEx('source1', 'r1', 200001)
		local alliance = app:getAlliMgr():createAlliance(player, 'alliance', 'f')
		local mems = {alliance:getMemberByIdx(0)}
		local pageCnt = 2
		local pageNo = 1
		
		self.mm:mock(AllianceSender, '_sendSelfAlliMems')
		AllianceSender:sendTodaySortMems(player, alliance, mems, pageCnt, pageNo)
		assertEQ ( self.mm.params['_sendSelfAlliMems'], {player, alliance, mems, pageCnt, pageNo, 'todaysortmems'})
	end;
	
	test_sendAllSortMems = function(self)
		local player = TestCaseHelper:loadPlayerByUserNameEx('source1', 'r1', 200001)
		local alliance = app:getAlliMgr():createAlliance(player, 'alliance', 'f')
		local mems = {alliance:getMemberByIdx(0)}
		local pageCnt = 2
		local pageNo = 1
		
		self.mm:mock(AllianceSender, '_sendSelfAlliMems')
		AllianceSender:sendAllSortMems(player, alliance, mems, pageCnt, pageNo)
		assertEQ ( self.mm.params['_sendSelfAlliMems'], {player, alliance, mems, pageCnt, pageNo, 'allsortmems'})
	end;
	
	test__sendSelfAlliMems = function(self)
		local player1 = TestCaseHelper:loadPlayerByUserNameEx('source1', 'r1', 200001)
		local player2 = TestCaseHelper:loadPlayerByUserNameEx('source2', 'r2', 200002)
		local player3 = TestCaseHelper:loadPlayerByUserNameEx('source3', 'r3', 200003)
		
		local alliance = app:getAlliMgr():createAlliance(player1, 'alliance', 'f')

		local mem1 = AllianceMember()
		mem1:setId(200002)
		mem1:setAlliPos(ALLI_POS.MEM)
		mem1:setTotalRes(100)
		mem1:setTotalCard(200)
		mem1:setLastRes({lastTime=Util:getTime(), val=300})
		mem1:setLastCard({lastTime=Util:getTime(), val=400})	
		mem1:setContributes(500)
		local grid1 = app:getCityMgr():getGridByRoleId( mem1:getId() )
		grid1.level = 9
		grid1.icon = 101
		grid1.buildCurVal = 20
		grid1.roleRank = 1000
		grid1.loginTime = 2000		
		grid1.objType = OBJ_TYPE.ROLE
		
		local mem2 = AllianceMember()
		mem2:setId(200003)
		mem2:setAlliPos(ALLI_POS.ALEADER)
		mem2:setTotalRes(200)
		mem2:setTotalCard(300)
		mem2:setLastRes({lastTime=Util:getTime(), val=400})
		mem2:setLastCard({lastTime=Util:getTime(), val=500})	
		mem2:setContributes(600)
		local grid2 = app:getCityMgr():getGridByRoleId( mem2:getId() )
		grid2.level = 10
		grid2.icon = 102
		grid2.buildCurVal = 30
		grid2.roleRank = 2000
		grid2.loginTime = 3000		
		grid2.objType = OBJ_TYPE.DIED_ROLE
		
		alliance:addMember(mem1)
		alliance:addMember(mem2)
		
		local mems = {mem1, mem2}
		local pageCnt = 2
		local pageNo = 1
		AllianceSender:_sendSelfAlliMems(player3, alliance, mems, pageCnt, pageNo, 'todaysortmems')
		
		local orginmsg = '{cmd:' .. NETCMD.ALLIANCE .. ',todaysortmems:['
		orginmsg = orginmsg .. '{roleId:200002,icon:101,gridId:' .. grid1.gridId .. ',name:"r2",totalRes:100,totalCard:200,todayRes:300,todayCard:400,alliPos:1,contributes:500,level:9,buildCurVal:20,roleRank:1000,loginTime:2000,died:0}'
		orginmsg = orginmsg .. ',{roleId:200003,icon:102,gridId:' .. grid2.gridId .. ',name:"r3",totalRes:200,totalCard:300,todayRes:400,todayCard:500,alliPos:3,contributes:600,level:10,buildCurVal:30,roleRank:2000,loginTime:3000,died:1}'
		orginmsg = orginmsg .. '],pageCount:2,pageNo:1}'
		assertEQ ( getSendMsg_t() , orginmsg )
		
		AllianceSender:_sendSelfAlliMems(player2, alliance, mems, pageCnt, pageNo, 'todaysortmems')
		local formatmsg = string.gsub(orginmsg, 'loginTime:2000', 'loginTime:0')
		formatmsg = string.gsub(formatmsg, 'loginTime:3000', 'loginTime:0')
		assertEQ ( getSendMsg_t() , formatmsg )
	end;
	
	test_sendOtherAlliMems = function(self)
		local player1 = TestCaseHelper:loadPlayerByUserNameEx('source1', 'r1', 200001)
		local player2 = TestCaseHelper:loadPlayerByUserNameEx('source2', 'r2', 200002)
		local player3 = TestCaseHelper:loadPlayerByUserNameEx('source3', 'r3', 200003)
		
		local alliance = app:getAlliMgr():createAlliance(player1, 'alliance', 'f')
		alliance:setCityResId(9900001)

		local mem1 = AllianceMember()
		mem1:setId(200002)
		mem1:setAlliPos(ALLI_POS.MEM)
		mem1:setTotalRes(100)
		mem1:setTotalCard(200)
		mem1:setLastRes({lastTime=Util:getTime(), val=300})
		mem1:setLastCard({lastTime=Util:getTime(), val=400})	
		mem1:setContributes(500)
		local grid1 = app:getCityMgr():getGridByRoleId( mem1:getId() )
		grid1.level = 9
		grid1.buildCurVal = 20
		grid1.roleRank = 1000
		grid1.loginTime = 2000		
		
		local mem2 = AllianceMember()
		mem2:setId(200003)
		mem2:setAlliPos(ALLI_POS.ALEADER)
		mem2:setTotalRes(200)
		mem2:setTotalCard(300)
		mem2:setLastRes({lastTime=Util:getTime(), val=400})
		mem2:setLastCard({lastTime=Util:getTime(), val=500})	
		mem2:setContributes(600)
		local grid2 = app:getCityMgr():getGridByRoleId( mem2:getId() )
		grid2.level = 10
		grid2.buildCurVal = 30
		grid2.roleRank = 2000
		grid2.loginTime = 3000		
		
		alliance:addMember(mem1)
		alliance:addMember(mem2)
		
		local mems = {mem1, mem2}
		local pageCnt = 2
		local pageNo = 1
		AllianceSender:sendOtherAlliMems(self.player, alliance, mems, pageCnt, pageNo)
		
		local expectStr = '{cmd:' .. NETCMD.ALLIANCE .. ',mems:['
		expectStr = expectStr .. '{roleId:200002,gridId:' .. grid1.gridId .. ',name:"r2",alliPos:1,level:9,roleRank:1000}'
		expectStr = expectStr .. ',{roleId:200003,gridId:' .. grid2.gridId .. ',name:"r3",alliPos:3,level:10,roleRank:2000}'
		expectStr = expectStr .. '],pageCount:2,pageNo:1,cityResId:9900001}'
		
		assertEQ ( getSendMsg_t() , expectStr )
	end;
	
	test_sendSelfAllianceDetail = function(self)
		self.player:setCityId(9900001)
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		alliance:setLevel(1)
		alliance:setBuildVal(2)
		alliance:setCardNumber(3)
		alliance:setHonour(4)
		alliance:setIntroduction('intro')
		alliance:setRank(1000)
		alliance:setQQGroup('123456')
		alliance:setBulletin('bulletin')
		alliance:setUpgradeStartTime(100);
		alliance:setUpgradeStopTime(200);
		alliance:setDismissStartTime(0);
		alliance:setTransferStartTime(400);
		alliance:setTransferTarget('t1');
		
		AllianceSender:sendSelfAllianceDetail(self.player, alliance)
		local expectMsg =  '{cmd:' .. NETCMD.ALLIANCE .. ',mydetail:{name:"alliance",level:1,flag:"f",leader:"'.. self.player:getRoleName() .. '",cityResId:9900001,mem:1,buildVal:2,card:3,honour:4,introduction:"intro"'
		expectMsg = expectMsg .. ',rank:1000,qqGroup:"123456",bulletin:"bulletin"'
		expectMsg = expectMsg .. ',upgrade:{startTime:100,stopTime:200}'
		expectMsg = expectMsg .. ',transfer:{name:"t1",startTime:400,stopTime:' .. (400 + 24*3600) .. '}'
		expectMsg = expectMsg .. ',dismiss:{startTime:0,stopTime:0}'
		expectMsg = expectMsg .. '}}'
		assertEQ ( getSendMsg_t() , expectMsg )
	end;
	
	test_sendSelfAllianceDetailToMembers = function(self)
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		
		local mem1 = AllianceMember()
		mem1:setId(1)
		mem1:setAlliPos(ALLI_POS.MEM)
		local mem2 = AllianceMember()
		mem2:setId(2)
		mem2:setAlliPos(ALLI_POS.ELDER)
		alliance:addMember(mem1)
		alliance:addMember(mem2)
		
		self.mm:mock(AllianceSender, '_makeAllianceSelfDetail', {'msg'})
		self.mm:mock(NullPlayer, 'sendMsg')
		AllianceSender:sendSelfAllianceDetailToMembers(alliance)
		assertEQ ( self.mm.params['_makeAllianceSelfDetail'], {alliance } )
		assertEQ ( self.mm.params['sendMsg.1'], {'msg'} )
		assertEQ ( self.mm.params['sendMsg.2'], {'msg'} )
	end;
	
	test_sendAlliEvents = function(self)
		local events = {{event='event1', createTime=1},{event='event2', createTime=2}}
		local pageCnt = 2 
		local pageNo = 1
		AllianceSender:sendAlliEvents(self.player, events, pageCnt, pageNo)
		local expectMsg = '{cmd:' .. NETCMD.ALLIANCE .. ',events:{list:[{desc:"event1",time:1},{desc:"event2",time:2}],pageCount:2,pageNo:1}}'
		assertEQ ( getSendMsg_t() , expectMsg )
	end;
	
	test_sendSelfMember = function(self)
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		local member = alliance:getMemberByIdx(0)
		member:setContributes(100)
		member:setGainGiftCount({count=0, lastTime=10})
		member:setFeedCount({count=1, lastTime=20})
		
		AllianceSender:sendSelfMember(self.player, alliance)
		local expectMsg =  '{cmd:' .. NETCMD.ALLIANCE .. ',selfmem:{alliPos:4,contributes:100,gainGift:{count:0,lastTime:10},feed:{count:1,lastTime:20}}}'
		assertEQ ( getSendMsg_t() , expectMsg )
	end;
	
	test_sendSelfContributes = function(self)
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		local member = alliance:getMemberByIdx(0)
		member:setContributes(100)
		
		AllianceSender:sendSelfContributes(self.player, alliance)
		local expectMsg =  '{cmd:' .. NETCMD.ALLIANCE .. ',selfmem:{contributes:100}}'
		assertEQ ( getSendMsg_t() , expectMsg )
	end;
	
	test_sendSelfLawLight = function(self)
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		local lawLight = alliance:getLawLight()
		lawLight:setLevel(1)
		lawLight:setGrowupVal(2)
		
		AllianceSender:sendSelfLawLight(self.player, alliance)
		local expectMsg =  '{cmd:' .. NETCMD.ALLIANCE .. ',lawlight:{level:1,growup:{val:2}}}'
		assertEQ ( getSendMsg_t() , expectMsg )
	end;
	
	test_sendALeaders = function(self)
		local leader = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r',100000)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		leader:setAlliId(alliance:getId())
		
		local mem = AllianceMember()
		local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('user1', 'role1', 100001)
		memPlayer:setAlliId(alliance:getId())
		mem:setId(memPlayer:getRoleId())
		mem:setAlliPos(ALLI_POS.ALEADER)
		alliance:addMember(mem)
		
		mem = AllianceMember()
		local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('user2', 'role2', 100002)
		memPlayer:setAlliId(alliance:getId())
		mem:setId(memPlayer:getRoleId())
		mem:setAlliPos(ALLI_POS.ALEADER)
		alliance:addMember(mem)
		
		mem = AllianceMember()
		local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('user3', 'role3', 100003)
		memPlayer:setAlliId(alliance:getId())
		mem:setId(memPlayer:getRoleId())
		mem:setAlliPos(ALLI_POS.MEM)
		alliance:addMember(mem)
		
		AllianceSender:sendALeaders(leader, alliance)
		local expectMsg =  '{cmd:' .. NETCMD.ALLIANCE .. ',aleaders:["role1","role2"]}'
		assertEQ ( getSendMsg_t() , expectMsg )
	end;
	
	test_sendApplyMerges = function(self)
		local leader = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r',100000)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		leader:setAlliId(alliance:getId())
		
		local otherLeader1 = TestCaseHelper:loadPlayerByUserNameEx('source1', 'source1_r',100001)
		local otherAlliance1 = app:getAlliMgr():createAlliance(otherLeader1, 'alliance1', 'f1')
		otherAlliance1:setLevel(2)
		
		local otherLeader2 = TestCaseHelper:loadPlayerByUserNameEx('source2', 'source2_r',100002)
		local otherAlliance2 = app:getAlliMgr():createAlliance(otherLeader2, 'alliance2', 'f2')
		otherAlliance2:setLevel(3)
		
		alliance:getApplyMergesSet():insert(otherAlliance1:getId())
		alliance:getApplyMergesSet():insert(otherAlliance2:getId())
		alliance:getApplyMergesSet():insert(otherAlliance2:getId()+1)
		
		AllianceSender:sendApplyMerges(leader, alliance)
		local expectMsg = '{cmd:'..NETCMD.ALLIANCE..',applymerges:[{_r:1},{id:' .. otherAlliance2:getId() .. ',name:"alliance2",level:3,leader:"source2_r"},{id:' .. otherAlliance1:getId() .. ',name:"alliance1",level:2,leader:"source1_r"}]}'
		assertEQ ( getSendMsg_t(), expectMsg )
		assertEQ ( alliance:getApplyMergesSet():getCount(), 2)
	end;
	
	test_sendAuctionItems = function(self)
		self.player:setRoleName('role1')
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alli1', 'f')
		self.player:setAlliId(alliance:getId())		
		alliance:getItemPkg():clearLastItems()
		alliance:getItemPkg():addItem({id=1, resid=2500001, num=10, boss=1, sptime=1000000, cur=100, fixed=1000, buyer=''})
		alliance:getItemPkg():addItem({id=2, resid=2500002, num=11, boss=1, sptime=1000001, cur=101, fixed=1000, buyer='role1'})
		alliance:getItemPkg():addItem({id=3, resid=2500003, num=12, sptime=1000002, cur=102, fixed=200, seller='role3', buyer='role1'})
		alliance:getItemPkg():addItem({id=4, resid=2500004, num=13, sptime=1000003, cur=103, fixed=300, seller='role3', buyer='role2'})
		alliance:getItemPkg():addItem({id=5, resid=2500005, num=14, sptime=1000004, cur=104, fixed=400, seller='role1', buyer=''})
		
		AllianceSender:sendAuctionItems(self.player, alliance)
		
		local sitems = '{id:1,resid:2500001,num:10,ismy:0,isboss:1,owner:"",auction:100,fixed:1000,stopTime:1000000}'
		sitems = sitems .. ',{id:2,resid:2500002,num:11,ismy:1,isboss:1,owner:"",auction:101,fixed:1000,stopTime:1000001}'
		sitems = sitems .. ',{id:3,resid:2500003,num:12,ismy:1,isboss:0,owner:"role3",auction:102,fixed:200,stopTime:1000002}'
		sitems = sitems .. ',{id:4,resid:2500004,num:13,ismy:0,isboss:0,owner:"role3",auction:103,fixed:300,stopTime:1000003}'
		sitems = sitems .. ',{id:5,resid:2500005,num:14,ismy:0,isboss:0,owner:"role1",auction:104,fixed:400,stopTime:1000004}'
		local expectMsg = '{cmd:'..NETCMD.ALLIANCE..',auction:{items:[' .. sitems .. ']}}'
		assertEQ ( getSendMsg_t(), expectMsg )
	end;
	
	test_sendAuctionItem = function(self)
		self.player:setRoleName('role1')
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alli1', 'f')
		self.player:setAlliId(alliance:getId())		
		alliance:getItemPkg():clearLastItems()
		alliance:getItemPkg():addItem({id=1, resid=2500001, num=10, boss=1, sptime=1000000, cur=100, fixed=1000, buyer=''})
		alliance:getItemPkg():addItem({id=2, resid=2500002, num=11, boss=1, sptime=1000001, cur=101, fixed=1000, buyer='role1'})

		AllianceSender:sendAuctionItem(self.player, alliance, 10)
		assertEQ ( getSendMsg_t(), '' )
		
		AllianceSender:sendAuctionItem(self.player, alliance, 1)
		local sitems = '{id:1,resid:2500001,num:10,ismy:0,isboss:1,owner:"",auction:100,fixed:1000,stopTime:1000000}'
		local expectMsg = '{cmd:'..NETCMD.ALLIANCE..',auction:{items:[' .. sitems .. ']}}'
		assertEQ ( getSendMsg_t(), expectMsg )
	end;
	
	test_sendDelAuctionItem = function(self)
		AllianceSender:sendDelAuctionItem(self.player, alliance, 1)
		local expectMsg = '{cmd:'..NETCMD.ALLIANCE..',auction:{items:[{id:1,_d:1}]}}'
		assertEQ ( getSendMsg_t(), expectMsg )
	end;
	
	test_sendMySellingItem = function(self)
		self.player:setRoleName('role1')
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alli1', 'f')
		self.player:setAlliId(alliance:getId())		
		alliance:getItemPkg():clearLastItems()
		alliance:getItemPkg():addItem({id=1, resid=2500005, num=14, sptime=1000004, cur=100, fixed=1000, seller='role1', buyer=''})
		alliance:getItemPkg():addItem({id=2, resid=2500005, num=14, sptime=1000004, cur=100, fixed=1000, seller='role1', buyer='role2'})
		
		AllianceSender:sendMySellingItem(self.player, alliance, 1)
		local expectMsg = '{cmd:'..NETCMD.ALLIANCE..',sellingItems:[{id:1,resid:2500005,number:14,doing:0,cur:100,fixed:1000,stopTime:1000004}]}'
		assertEQ ( getSendMsg_t(), expectMsg )
		AllianceSender:sendMySellingItem(self.player, alliance, 2)
		local expectMsg = '{cmd:'..NETCMD.ALLIANCE..',sellingItems:[{id:2,resid:2500005,number:14,doing:1,cur:100,fixed:1000,stopTime:1000004}]}'
		assertEQ ( getSendMsg_t(), expectMsg )
	end;
	
	test_sendMySellingItems = function(self)
		self.player:setRoleName('role1')
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alli1', 'f')
		self.player:setAlliId(alliance:getId())		
		alliance:getItemPkg():clearLastItems()
		alliance:getItemPkg():addItem({id=1, resid=2500005, num=14, sptime=1000004, cur=100, fixed=1000, seller='role1', buyer=''})
		alliance:getItemPkg():addItem({id=2, resid=2500005, num=14, sptime=1000004, cur=100, fixed=1000, seller='role1', buyer='role2'})
		alliance:getItemPkg():addItem({id=3, resid=2500005, num=14, sptime=1000004, cur=100, fixed=1000, seller='role2', buyer='role3'})
		
		AllianceSender:sendMySellingItems(self.player, alliance)
		local expectMsg = '{cmd:'..NETCMD.ALLIANCE..',sellingItems:[{id:1,resid:2500005,number:14,doing:0,cur:100,fixed:1000,stopTime:1000004},{id:2,resid:2500005,number:14,doing:1,cur:100,fixed:1000,stopTime:1000004}]}'
		assertEQ ( getSendMsg_t(), expectMsg )
	end;
	
	test_sendDelMySellingItem = function(self)
		AllianceSender:sendDelMySellingItem(self.player, alliance, 1)
		local expectMsg = '{cmd:'..NETCMD.ALLIANCE..',sellingItems:[{id:1,_d:1}]}'
		assertEQ ( getSendMsg_t(), expectMsg )
	end;
	
	test__makeApplyListStr = function(self)
		local set = Set(nil, 10)
		set:insert(100001)
		set:insert(100002)
		set:insert(100003)
		
		self.mm:mock(app:getCityMgr(), 'getGridByRoleId', nil, function(self, roleId)
			if roleId == 100001 then
				return {roleId=100001,roleName='role1',level=1,buildCurVal=10}
			elseif roleId == 100002 then
				return {roleId=100002,roleName='role2',level=2,buildCurVal=20}
			elseif roleId == 100003 then
				return nil
			end
		end)
		
		local expectMsg = '{cmd:'..NETCMD.ALLIANCE..',applys:[{_k:"roleId"},{roleId:100001,roleName:"role1",level:1,buildVal:10},{roleId:100002,roleName:"role2",level:2,buildVal:20}]}'
		assertEQ ( AllianceSender:_makeApplyListStr(set), expectMsg )
	end;
})

local TestCaseOtherPlayerInfoSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendBuildAddSpeed = function(self)
		local target = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 100001)
		TestCaseCondition:setPreCond(target, nil, { builds={ {id=6,resid=FIXID.ALLIINBUILD,level=2,state=0} } })
		OtherPlayerInfoSender:sendBuildAddSpeed(self.player, target)
		local expectMsg = '{cmd:' .. NETCMD.OTHERPLAYERINFO .. ',buildAddSpeed:{val:0.2}}'
		assertEQ ( getSendMsg_t() , expectMsg )
	end;
})

local TestCaseTradingAreaSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendStopTime = function(self)
		self.player:getTradingArea():setStopTime(1)
		TradingAreaSender:sendStopTime(self.player)
		local expectMsg = '{cmd:' .. NETCMD.TRADING_AREA .. ',trading:{stopTime:1}}'
		assertEQ ( getSendMsg_t() , expectMsg )
	end;
	
	test_sendBaseInfo = function(self)
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=23, state=0} } })
		TradingAreaSender:sendBaseInfo(self.player)
		local expectMsg = '{cmd:' .. NETCMD.TRADING_AREA .. ',trading:{rate:1,maxCitys:4,capacity:2300}}'
		assertEQ ( getSendMsg_t() , expectMsg )
	end;
	
	test_sendTargets = function(self)
		local aPlayer1 = TestCaseHelper:loadPlayerByUserNameEx('aPlayer1', 'role1', 100002, 301)
		local aPlayer2 = TestCaseHelper:loadPlayerByUserNameEx('aPlayer2', 'role2', 100003, 50000)
		TestCaseCondition:setPreCond(aPlayer1, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=23, state=0} } })
		TestCaseCondition:setPreCond(aPlayer2, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=25, state=0} } })
		local grid2 = app:getCityMgr():getGridByGridId(50000)
		
		local tradingArea = aPlayer1:getTradingArea()
		tradingArea:getTargetsSet():insert(100002)
		tradingArea:getTargetsSet():insert(100003)
		TradingAreaSender:sendTargets(aPlayer1)
		local expectMsg = '{cmd:' .. NETCMD.TRADING_AREA .. ',trading:{totalDis:' .. tradingArea:getTotalDistance() .. ',needTime:' .. tradingArea:getTotalNeedTime() .. ',gain:' .. tradingArea:getTotalGainMoney() .. ',targets:[{_r:1},{roleId:100002,roleName:"role1",gridId:301,buildLevel:23,distance:0},{roleId:100003,roleName:"role2",gridId:50000,buildLevel:25,distance:' .. tradingArea:getTargetDistance(grid2) .. '}]}}'
		assertEQ ( getSendMsg_t() , expectMsg )
	end;
	
	test_sendMembers = function(self)
		self.player = TestCaseHelper:loadPlayerByUserNameEx('player', 'role', 100001, 300)
		local aPlayer1 = TestCaseHelper:loadPlayerByUserNameEx('aPlayer1', 'role1', 100002, 301)
		local aPlayer2 = TestCaseHelper:loadPlayerByUserNameEx('aPlayer2', 'role2', 100003, 50000)
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=20, state=0} } })
		TestCaseCondition:setPreCond(aPlayer1, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=23, state=0} } })
		TestCaseCondition:setPreCond(aPlayer2, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=25, state=0} } })
		local grid1 = app:getCityMgr():getGridByGridId(301)	
		local grid2 = app:getCityMgr():getGridByGridId(50000)	
		
		local tradingArea = self.player:getTradingArea()
		
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		self.player:setAlliId(alliance:getId())
		local mem1 = AllianceMember()
		mem1:setId(100002)
		mem1:setAlliPos(ALLI_POS.MEM)
		
		local mem2 = AllianceMember()
		mem2:setId(100003)
		mem2:setAlliPos(ALLI_POS.ELDER)
		
		local mem3 = AllianceMember()
		mem3:setId(-1)
		
		alliance:addMember(mem1)
		alliance:addMember(mem2)
		alliance:addMember(mem3)
		
		TradingAreaSender:sendMembers(self.player)

		local expectMsg = '{cmd:' .. NETCMD.TRADING_AREA .. ',mems:[{_r:1},{roleId:100001,roleName:"role",gridId:300,buildLevel:20,distance:0},{roleId:100002,roleName:"role1",gridId:301,buildLevel:23,distance:' .. tradingArea:getTargetDistance(grid1) .. '},{roleId:100003,roleName:"role2",gridId:50000,buildLevel:25,distance:' .. tradingArea:getTargetDistance(grid2) .. '}]}'
		assertEQ ( getSendMsg_t() , expectMsg )
	end;
	
	test_sendDetailMember = function(self)
		local aPlayer1 = TestCaseHelper:loadPlayerByUserNameEx('aPlayer1', 'role1', 100002, 300)
		local aPlayer2 = TestCaseHelper:loadPlayerByUserNameEx('aPlayer2', 'role2', 100003, 400)
		TestCaseCondition:setPreCond(aPlayer1, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=23, state=0} } })
		TestCaseCondition:setPreCond(aPlayer2, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=25, state=0} } })
		
		local grid2 = app:getCityMgr():getGridByGridId(400)	
		TradingAreaSender:sendDetailMember(aPlayer1, grid2)
		local gain = aPlayer1:getTradingArea():getFactGain(grid2)
		local needTime = aPlayer1:getTradingArea():getNeedTime(grid2)
		local expectMsg = '{cmd:' .. NETCMD.TRADING_AREA .. ',mems:[{_k:"roleId"},{roleId:100003,isDetail:1,needTime:' .. needTime .. ',gain:' .. gain .. '}]}'
		assertEQ ( getSendMsg_t() , expectMsg )
	end;
	
	test_sendTodayTimes = function(self)
		self.player:getTradingArea():setTodayTimes(1)
		local expectMsg = '{cmd:' .. NETCMD.TRADING_AREA .. ',trading:{todayTimes:{cur:1, max:' .. self.player:getTradingArea():getMaxTimes() .. '}}}'
		TradingAreaSender:sendTodayTimes(self.player)
		assertEQ ( getSendMsg_t() , expectMsg )
	end;
})

local TestCaseActTowerSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestHelperServerActEffectClear(app:getSvrAct())
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendBaseInfo = function(self)
		self.player:getActTower():setMaxLayer(39)
		self.player:getActTower():setTodayEnterTimes(1)
		ActTowerSender:sendBaseInfo(self.player)
		assertEQ ( getSendMsg_t() , '{cmd:' .. NETCMD.ACT_TOWER .. ',baseInfo:{today:{maxTimes:2,freeTimes:1, itemTimes:0}, maxLayer:39}}' )
		
		TestHelperServerActEffectSet(app:getSvrAct(), SVR_TODAY_ACT_TYPE.ACT_TOWER_TIMES_1)
		self.player:getActTower():setTodayEnterTimes(4)
		ActTowerSender:sendBaseInfo(self.player)
		assertEQ ( getSendMsg_t() , '{cmd:' .. NETCMD.ACT_TOWER .. ',baseInfo:{today:{maxTimes:3,freeTimes:3, itemTimes:1}, maxLayer:39}}' )
	end;
	
	test_sendRanks = function(self)
		local _makeItemStr = function(rank, name, roleId, gridId, maxLayer, maxTime)
			return '{rank:' .. rank.. ',name:"' .. name .. '",gridId:' .. gridId .. ',roleId:' .. roleId .. ',maxLayer:' .. maxLayer .. ',maxTime:' .. maxTime .. '}'
		end;
	
		ActTowerSender:sendRanks(self.player, 1, 4, 0)
		
		local rank1 = _makeItemStr(1, 'role1', 10000, 10, 0, 100)
		local rank2 = _makeItemStr(2, 'role2', 20000, 20, 1, 200)
		local rank3 = _makeItemStr(3, 'role3', 30000, 30, 2, 300)
		local rank4 = _makeItemStr(4, 'role4', 40000, 40, 3, 400)
		local expectStr = '{cmd:' .. NETCMD.ACT_TOWER .. ',ranks:[' .. rank1 .. ',' .. rank2 .. ',' .. rank3 .. ',' .. rank4 .. '],pageNo:1,pageCount:3,curSelIdx:0}'
		assertEQ ( getSendMsg_t() , expectStr )
	end;
	
	test_sendEnterTower = function(self)
		self.player:getActTower():setCurLayer(1)
		self.player:getActTower():setLeftLifes(2)
		self.player:getActTower():setStopTime(3)
		ActTowerSender:sendEnterTower(self.player)
		assertEQ ( getSendMsg_t() , '{cmd:' .. NETCMD.ACT_TOWER .. ',enterTower:{curLayer:1,leftLifes:2,stopTime:3}}' )
		
		local fightDemo = {armyId=1, fightId=2}
		local lastLayerInfo = {layer=2, fightResult=1, gift={heroExp=100, items={{id=2500001,number=2}}}}
		ActTowerSender:sendEnterTower(self.player, fightDemo, lastLayerInfo)
		assertEQ ( getSendMsg_t() , '{cmd:' .. NETCMD.ACT_TOWER .. ',enterTower:{curLayer:1,leftLifes:2,stopTime:3,fightDemo:{fightId:2,armyId:1},lastLayerInfo:{fightResult:1,layer:2,gift:{items:[{id:2500001,number:2}],heroExp:100}}}}' )
	end;
	
	test_sendExitTower = function(self)
		self.player:getActTower():setCurLayer(1)
		self.player:getActTower():setLeftLifes(2)
		self.player:getActTower():setStopTime(3)
		ActTowerSender:sendExitTower(self.player)
		assertEQ ( getSendMsg_t() , '{cmd:' .. NETCMD.ACT_TOWER .. ',enterTower:{curLayer:1,leftLifes:2,stopTime:3,isExit:1}}' )
	end;
	
	test_sendInAutoFightState = function(self)
		self.player:getActTower():setAutoToLayer(2)
		ActTowerSender:sendInAutoFightState(self.player)
		assertEQ ( getSendMsg_t() , '{cmd:' .. NETCMD.ACT_TOWER .. ',autoFight:1,autoToLayer:2}' )
	end;
})

local TestCaseActTerraceSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestHelperServerActEffectClear(app:getSvrAct())
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendBaseInfo = function(self)
		self.player:getActTerrace():setMaxGate({gateId=4,subGateId=1})
		self.player:getActTerrace():setCurGate({gateId=3,subGateId=2})
		self.player:getActTerrace():setTodayEnterTimes(1)
		ActTerraceSender:sendBaseInfo(self.player)
		assertEQ ( getSendMsg_t() , '{cmd:' .. NETCMD.ACT_TERRACE .. ',baseInfo:{today:{maxTimes:2,freeTimes:1, itemTimes:0},curGate:{gateId:3,subGateId:2},maxGate:{gateId:4,subGateId:1}}}' )
		
		TestHelperServerActEffectSet(app:getSvrAct(), SVR_TODAY_ACT_TYPE.ACT_TERRACE_TIMES_1)
		self.player:getActTerrace():setTodayEnterTimes(4)
		ActTerraceSender:sendBaseInfo(self.player)
		assertEQ ( getSendMsg_t() , '{cmd:' .. NETCMD.ACT_TERRACE .. ',baseInfo:{today:{maxTimes:3,freeTimes:3, itemTimes:1},curGate:{gateId:3,subGateId:2},maxGate:{gateId:4,subGateId:1}}}' )
	end;
	
	test_sendResult = function(self)
		self.player:getActTerrace():setResult(0, 10)
		self.player:getActTerrace():setResult(1, 20)
		
		ActTerraceSender:sendResult(self.player, 0)
		assertEQ ( getSendMsg_t() , '{cmd:' .. NETCMD.ACT_TERRACE .. ',results:[{id:1,result:10}]}' )
		
		ActTerraceSender:sendResult(self.player, 1)
		assertEQ ( getSendMsg_t() , '{cmd:' .. NETCMD.ACT_TERRACE .. ',results:[{id:2,result:20}]}' )
	end;
	
	test_sendResults = function(self)
		self.player:getActTerrace():setResult(0, 10)
		self.player:getActTerrace():setResult(1, 20)
		
		ActTerraceSender:sendResults(self.player)
		assertEQ ( getSendMsg_t() , '{cmd:' .. NETCMD.ACT_TERRACE .. ',results:[{id:1,result:10},{id:2,result:20}]}' )
	end;
	
	test_sendEnterTerrace = function(self)
		self.player:getActTerrace():setCurGate({gateId=1, subGateId=2})
		self.player:getActTerrace():setLeftLifes(2)
		self.player:getActTerrace():setStopTime(3)
		ActTerraceSender:sendEnterTerrace(self.player)
		assertEQ ( getSendMsg_t() , '{cmd:' .. NETCMD.ACT_TERRACE .. ',enterTerrace:{curGate:{gateId:1,subGateId:2},leftLifes:2,stopTime:3}}' )
		
		local fightDemo = {armyId=1, fightId=2}
		ActTerraceSender:sendEnterTerrace(self.player, fightDemo)
		assertEQ ( getSendMsg_t() , '{cmd:' .. NETCMD.ACT_TERRACE .. ',enterTerrace:{curGate:{gateId:1,subGateId:2},leftLifes:2,stopTime:3,fightDemo:{fightId:2,armyId:1}}}' )
	end;
	
	test_sendExitTerrace = function(self)
		self.player:getActTerrace():setCurGate({gateId=1, subGateId=2})
		self.player:getActTerrace():setLeftLifes(2)
		self.player:getActTerrace():setStopTime(3)
		ActTerraceSender:sendExitTerrace(self.player)
		assertEQ ( getSendMsg_t() , '{cmd:' .. NETCMD.ACT_TERRACE .. ',enterTerrace:{curGate:{gateId:1,subGateId:2},leftLifes:2,stopTime:3,isExit:1}}' )
	end;
	
	test_sendInAutoFightState = function(self)
		self.player:getActTerrace():setAutoToSubGateId(2)
		ActTerraceSender:sendInAutoFightState(self.player)
		assertEQ ( getSendMsg_t() , '{cmd:' .. NETCMD.ACT_TERRACE .. ',autoFight:1,autoToGate:2}' )
	end;
})

local TestCaseStateCitySender = TestCase:extends({
	setUp = function(self)
		res_growup_tasks = {}
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendMapView = function(self)
		StateCitySender:sendMapView(self.player)
		assertEQ ( getSendMsg_t() ,  '{cmd:'..NETCMD.MAP..',mapview:{x1:200,y1:200,x2:400,y2:400}}' )
	end;
	
	test_sendEnter = function(self)
		StateCitySender:sendEnter(self.player, FIXID.FIRSTSTATECITY)
		assertEQ ( getSendMsg_t() ,  '{cmd:'..NETCMD.MAP..',entercity:{id:'..FIXID.FIRSTSTATECITY..'}}' )
	end;
	
	test_sendNpcs = function(self)
		res_citys_npcs = {{id=FIXID.FIRSTSTATECITY, npcs={{id=7000001, pos={x=1, y=2}}, {id=7000002, pos={x=10, y=20}}}}}
		StateCitySender:sendNpcs(self.player, FIXID.FIRSTSTATECITY)
		assertEQ ( getSendMsg_t() ,  '{cmd:'..NETCMD.MAP..',npcs:{cityid:'..FIXID.FIRSTSTATECITY..',add:[{id:7000001,pos:{x:1,y:2}},{id:7000002,pos:{x:10,y:20}}]}}' )
	end;
})

local TestCaseTaskSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		res_everyday_tasks = {{id=1001, type=4, precond={roleLevel=10}, dropId=7500001}
			}
			
		self.player:setLevel(10)
		self.player:getTask():getEveryDayTask():_randTasks()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendEveryDayTask = function(self)
		TaskSender:sendEveryDayTask(self.player, 2)
		assertEQ ( getSendMsg_t() ,  '{cmd:'..NETCMD.TASK..',tasks:[{id:100102,state:0}]}' )
	end;
	
	test_sendDelEveryDayTask = function(self)
		TaskSender:sendDelEveryDayTask(self.player, 2)
		assertEQ ( getSendMsg_t() ,  '{cmd:'..NETCMD.TASK..',tasks:[{id:100102,_d:1}]}' )
	end;
	
	test_sendDelEveryDayTasks = function(self)
		TaskSender:sendDelEveryDayTasks(self.player)
		assertEQ ( getSendMsg_t() ,  '{cmd:'..NETCMD.TASK..',tasks:[{_k:"id"},{id:100101,_d:1},{id:100102,_d:1},{id:100103,_d:1},{id:100104,_d:1},{id:100105,_d:1},{id:100106,_d:1},{id:100107,_d:1}]}' )
	end;
	
	test_sendEveryDayTasks = function(self)
		TaskSender:sendEveryDayTasks(self.player)
		assertEQ ( getSendMsg_t() ,  '{cmd:'..NETCMD.TASK..',tasks:[{_k:"id"},{id:100101,state:0},{id:100102,state:0},{id:100103,state:0},{id:100104,state:0},{id:100105,state:0},{id:100106,state:0},{id:100107,state:0}]}' )
	end;
	
	test_sendDoingRoleTask = function(self)
		local doing = self.player:getTask():getDoingRoleTask()
		doing:setStopTime(1)
		doing:setTaskId(2)
		doing:setCDStopTime(0)
		TaskSender:sendDoingRoleTask(self.player)
		assertEQ ( getSendMsg_t() ,  '{cmd:' .. NETCMD.TASK .. ',roleTask:{doing:{id:2, stopTime:1},cdStopTime:0}}' )
	end;
	
	test_sendCommTask = function(self)
		local taskId = 1001
		local state = 0
		TaskSender:sendCommTask(self.player, taskId, state)
		assertEQ ( getSendMsg_t() ,  '{cmd:' .. NETCMD.TASK .. ',tasks:[{id:1001,state:0}]}' )
	end;
	
	test_sendCommTasks = function(self)
		self.player:getTask():getCommTasks():insert({taskId=1,state=0})
		self.player:getTask():getCommTasks():insert({taskId=2,state=1})
		TaskSender:sendCommTasks(self.player)
		assertEQ ( getSendMsg_t() ,  '{cmd:'..NETCMD.TASK..',tasks:[{_k:"id"},{id:1,state:0},{id:2,state:1}]}' )
	end;
	
	test_sendPrestigeTask = function(self)
		self.player:getTask():setPrestigeLastTime(1000)
		self.mm:clear()
		TaskSender:sendPrestigeTask(self.player)
		assertEQ ( getSendMsg_t() ,  '{cmd:' .. NETCMD.TASK .. ',prestigeTask:{lastTime:1000}}' )
	end;
	
	test_sendActValTasks = function(self)
		res_activityval_tasks = {
			{id=7001, type=7, times=2, val=3, docond={{type=TASK_FINISH_TYPE.FEED_LIGHTLAW, val1=0, val2=0, val3=0}}}
			,{id=7002, type=7, times=2, val=3, docond={{type=TASK_FINISH_TYPE.FEED_LIGHTLAW, val1=0, val2=0, val3=0}}}
			}
		self.player:getTask():getActivityVal():addTaskTimes(1)
		self.player:getTask():getActivityVal():addTaskTimes(2)
		self.player:getTask():getActivityVal():addTaskTimes(2)
		TaskSender:sendActValTasks(self.player)
		assertEQ ( getSendMsg_t() ,  '{cmd:' .. NETCMD.TASK .. ',tasks:[{_k:"id"},{id:7001,times:1},{id:7002,times:2}]}' )
	end;
	
	test_sendActValTask = function(self)
		TaskSender:sendActValTask(self.player, 7001, 1)
		assertEQ ( getSendMsg_t() ,  '{cmd:' .. NETCMD.TASK .. ',tasks:[{id:7001,times:1}]}' )
	end;
	
	test_sendOnlineTask = function(self)
		res_online_tasks = {
			{id=1790001, precond={taskId=0}, type=TASK_TYPE.ONELINE, circleType=0, duration=15}
			}
		Util:setTimeDrt(1379520000)
		self.player:getTask():getOnlineTask():setTask(1790001, 0)
		TaskSender:sendOnlineTask(self.player)
		assertEQ ( getSendMsg_t() ,  '{cmd:' .. NETCMD.TASK .. ',onlinetask:{id:1790001,stopTime:' .. (1379520000+15) .. '}}' )
	end;
	
	test_sendActTasks = function(self)
		self.player:getTask():getActTask():getTasks():clear()
		self.player:getTask():getActTask():getTasks():insert({taskId=1001, state=0})
		self.player:getTask():getActTask():getTasks():insert({taskId=1002, state=1})
		self.player:getTask():getActTask():getTasks():insert({taskId=1003, state=2})
		TaskSender:sendActTasks(self.player)
		local expectStr = '{cmd:'..NETCMD.TASK..',tasks:[{_k:"id"},{id:1001,state:0},{id:1002,state:1},{id:1003,state:2}]}'
		assertEQ ( getSendMsg_t() ,  expectStr )
	end;
	
	test_sendActTask = function(self)
		self.player:getTask():getActTask():getTasks():insert({taskId=1001, state=0})
		TaskSender:sendActTask(self.player, 1001)
		local expectStr = '{cmd:'..NETCMD.TASK..',tasks:[{id:1001,state:0}]}'
		assertEQ ( getSendMsg_t() ,  expectStr )
	end;
	
	test_sendDelActTask = function(self)
		TaskSender:sendDelActTask(self.player, 1001)
		local expectStr = '{cmd:'..NETCMD.TASK..',tasks:[{id:1001,_d:1}]}'
		assertEQ ( getSendMsg_t() ,  expectStr )
	end;
	
	test_sendStartGlobalTip = function(self)
		TaskSender:sendStartGlobalTip(self.player)
		local expectStr = '{cmd:'..NETCMD.TASK..',startGTip:1}'
		assertEQ ( getSendMsg_t() ,  expectStr )
	end;
	
	test_sendOpenTodayAct = function(self)
		TaskSender:sendOpenTodayAct(self.player)
		local expectStr = '{cmd:'..NETCMD.TASK..',openTodayAct:1}'
		assertEQ ( getSendMsg_t() ,  expectStr )
	end;
})

local TestCaseActivityValSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendVal = function(self)
		self.player:getTask():getActivityVal():setTodayVal(10)
		ActivityValSender:sendVal(self.player)
		assertEQ ( getSendMsg_t() ,  '{cmd:' .. NETCMD.ACTIVITY_VAL .. ',actVal:{val:10}}' )
	end;
	
	test_sendGotActRewards = function(self)
		self.player:getTask():getActivityVal():getGotActRewards():setGotReward(1)
		self.player:getTask():getActivityVal():getGotActRewards():setGotReward(3)
		ActivityValSender:sendGotActRewards(self.player)
		assertEQ ( getSendMsg_t() ,  '{cmd:' .. NETCMD.ACTIVITY_VAL .. ',actVal:{gotActRewards:[1,3]}}' )
	end;
	
	test_sendGotSigninRewards = function(self)
		self.player:getTask():getActivityVal():getGotSigninRewards():setGotReward(1)
		self.player:getTask():getActivityVal():getGotSigninRewards():setGotReward(3)
		ActivityValSender:sendGotSigninRewards(self.player)
		assertEQ ( getSendMsg_t() ,  '{cmd:' .. NETCMD.ACTIVITY_VAL .. ',actVal:{signin:{gotRewards:[1,3]}}}' )
	end;	
	
	test_sendSignin = function(self)
		Util:setTimeDrt(1377964800)
		self.player:getTask():getActivityVal():todaySign()
		Util:setTimeDrt(1377964800 + 24*3600)
		self.player:getTask():getActivityVal():todaySign()
		ActivityValSender:sendSignin(self.player)
		assertEQ ( getSendMsg_t() ,  '{cmd:' .. NETCMD.ACTIVITY_VAL .. ',actVal:{signin:{days:2,todaySign:1}}}' )
	end;
	
	test_sendDayActs = function(self)
		res_dayacts = { 
			{id=1, date=1377964800 - 24*3600, acts={1,2,3,4,5,6}}
			,{id=2, date=1377964800 + 0*24*3600, acts={7,8,9,10,0}}
			,{id=3, date=1377964800 + 1*24*3600, acts={1}}
			,{id=4, date=1377964800 + 2*24*3600, acts={2}}
			,{id=5, date=1377964800 + 3*24*3600, acts={200001, 3}}
			,{id=6, date=1377964800 + 4*24*3600, acts={4}}
			,{id=7, date=1377964800 + 5*24*3600, acts={5}}
			,{id=8, date=1377964800 + 7*24*3600, acts={6}}
			,{id=9, date=1377964800 + 8*24*3600, acts={7}}
			,{id=10, date=1377964800 + 9*24*3600, acts={8}}
		}

		Util:setTimeDrt(1377964800)
		ActivityValSender:sendDayActs(self.player)
		local expectStr = '{cmd:' .. NETCMD.ACTIVITY_VAL .. ',actVal:{dayacts:[{day:-1,acts:[1,2,3,4,5,6]},{day:0,acts:[7,8,9,10]},{day:1,acts:[1]},{day:2,acts:[2]},{day:3,acts:[3]},{day:4,acts:[4]},{day:5,acts:[5]},{day:7,acts:[6]}]}}'
		assertEQ ( getSendMsg_t() ,  expectStr )
	end;
	
	test_sendGotOnlineGoods = function(self)
		local ret = {false}
		self.mm:mock(self.player:getTask():getActivityVal(), 'isTodayGotOnlineGoods', ret)
		ActivityValSender:sendGotOnlineGoods(self.player)
		local expectStr = '{cmd:' .. NETCMD.ACTIVITY_VAL .. ',actVal:{gotOnlineGoods:0}}'
		assertEQ ( getSendMsg_t() ,  expectStr )
		
		ret[1] = true
		ActivityValSender:sendGotOnlineGoods(self.player)
		expectStr = '{cmd:' .. NETCMD.ACTIVITY_VAL .. ',actVal:{gotOnlineGoods:1}}'
		assertEQ ( getSendMsg_t() ,  expectStr )
	end;
	
	test_sendOnlineGoodsId = function(self)
		self.mm:mock(app:getSvrAct(), 'getOnlineGoods', {200001})
		ActivityValSender:sendOnlineGoodsId(self.player)
		local expectStr = '{cmd:' .. NETCMD.ACTIVITY_VAL .. ',actVal:{onlineGoodsId:200001}}'
		assertEQ ( getSendMsg_t() ,  expectStr )
	end;
	
	test_sendPayGiftGots = function(self)
		self.player:getTask():getPayAct():setGetGiftFlag(0, 1)
		self.player:getTask():getPayAct():setGetGiftFlag(1, 1)
		ActivityValSender:sendPayGiftGots(self.player)
		local expectStr = '{cmd:' .. NETCMD.ACTIVITY_VAL .. ',payGiftGots:[1,1,0,0,0,0]}'
		assertEQ ( getSendMsg_t() ,  expectStr )
	end;
	
	test_sendPayActAllGold = function(self)
		ActivityValSender:sendPayActAllGold(self.player)
		local expectStr = '{cmd:' .. NETCMD.ACTIVITY_VAL .. ',payActAllGold:0}'
		assertEQ ( getSendMsg_t() ,  expectStr )
	end;
	
	test_sendPayActTime = function(self)
		ActivityValSender:sendPayActTime(self.player)
		local expectStr = '{cmd:' .. NETCMD.ACTIVITY_VAL .. ',payActTime:{start:0,stop:0}}'
		assertEQ ( getSendMsg_t() ,  expectStr )
	end;
})

local TestCaseShopSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendShopSalesList = function(self)
		local sales = {{id=1, name='tag1', list={{id=1001},{id=1002}}}}
		ShopSender:sendShopSalesList(self.player, sales)
		local expectStr =   '{cmd:' .. NETCMD.SHOP .. ',sales:' .. toJIONString(sales) .. '}'
		assertEQ ( getSendMsg_t() ,  expectStr )
	end;
})

local TestCaseNewcomerTaskSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		assertEQ ( SB:isAllFreeForTest(), true )
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendCurTask = function(self)
		self.player:getTask():getNewcomerTask():setCurTaskId(1001)
		NewcomerTaskSender:sendCurTask(self.player)
		local expectStr =   '{cmd:' .. NETCMD.NEWCOMERHELP .. ',newhelp:{id:1001}}'
		assertEQ ( getSendMsg_t(), expectStr )
	end;
})

local TestCaseDealByGoldSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		assertEQ ( SB:isAllFreeForTest(), true )
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendStartBuy = function(self)
		DealByGoldSender:sendStartBuy(self.player, 'url_params')
		local expectStr =   '{cmd:' .. NETCMD.START_BuyByGold .. ',url_params:"url_params"}'
		assertEQ ( getSendMsg_t(), expectStr )
	end;
})

local TestCaseClientCfgSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		assertEQ ( SB:isAllFreeForTest(), true )
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendToggleMap = function(self)
		local clientCfg = self.player:getClientCfg()
		clientCfg:setToggleMapFlag(3, 1)
		
		ClientCfgSender:sendToggleMap(self.player)
		local expectStr =   '{cmd:' .. NETCMD.CLT_CFG .. ',togglemap:[0,0,0,1]}'
		assertEQ ( getSendMsg_t(), expectStr )
	end;
	
	test_sendGongGaoVer = function(self)
		self.player:getClientCfg():setGongGaoVer(11)
		ClientCfgSender:sendGongGaoVer(self.player)
		local expectStr =   '{cmd:' .. NETCMD.CLT_CFG .. ',gongGaoVer:11}'
		assertEQ ( getSendMsg_t(), expectStr )
	end;
	
	test_sendHelpTip = function(self)
		ClientCfgSender:sendHelpTip(self.player, 1--[[id]], 0--[[times]])
		local expectStr =   '{cmd:' .. NETCMD.CLT_CFG .. ',helptips:[{id:1,times:0}]}'
		assertEQ ( getSendMsg_t(), expectStr )
	end;
	
	test_sendHelpTips =  function(self)
		self.player:getClientCfg():getHelpTips():insert({id=1, times=1})
		self.player:getClientCfg():getHelpTips():insert({id=2, times=2})
		ClientCfgSender:sendHelpTips(self.player)		
		local expectStr =   '{cmd:' .. NETCMD.CLT_CFG .. ',helptips:[{id:1,times:1},{id:2,times:2}]}'
		assertEQ ( getSendMsg_t(), expectStr )
	end;
})

local TestCaseServerCfgSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		assertEQ ( SB:isAllFreeForTest(), true )
		TestCaseHelper:clearAll(self)
	end;
	
	test_send = function(self)
		ServerCfgSender:send(self.player)
		local expectStr =   '{cmd:' .. NETCMD.SVRCFG .. ',honorcfg:{taofa:3,cuihui:5,tiaoxin:1,leveldiff:10}}'
		assertEQ ( getSendMsg_t(), expectStr )
	end;
})

local TestCaseAutoBuildSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendInfo = function(self)
		self.player:setVipLevel(3)
		self.player:getCitys():setStartAutoBuild(1)
		self.player:getCitys():getAutoBuilds():insert(1003)
		self.player:getCitys():getAutoBuilds():insert(1004)
		
		AutoBuildSender:sendInfo(self.player)
		
		local expectStr =   '{cmd:' .. NETCMD.AUTOBUILD .. ',autobuild:{max:5,starting:1,list:[1003,1004]}}'
		assertEQ ( getSendMsg_t(), expectStr )
	end;
})

local TestCasePayGoldSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendPayGold = function(self)
		self.player:getTask():getPayAct():addGold(1)
		PayGoldSender:sendPayGold(self.player)
		local expectStr =   '{cmd:' .. NETCMD.PAYGOLD .. ',paygold:1}'
		assertEQ ( getSendMsg_t(), expectStr )
	end;
})

local TestCaseWorldBossSender = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendEvents = function(self)
		app:getAlliMgr():addWorldBossTmpEvent('role5', 1005, 1000005)
		app:getAlliMgr():addWorldBossTmpEvent('role4', 1004, 1000004)
		app:getAlliMgr():addWorldBossTmpEvent('role3', 1003, 1000003)
		app:getAlliMgr():addWorldBossTmpEvent('role2', 1002, 1000002)
		app:getAlliMgr():addWorldBossTmpEvent('role1', 1001, 1000001)
		app:getAlliMgr():addWorldBossTmpEvent('role0', 1000, 1000000)
		
		WorldBossSender:sendEvents(self.player)
		local expectStr =   '{cmd:' .. NETCMD.WORLDBOSS .. ',events:[{role:"role0",hurt:1000,time:1000000},{role:"role1",hurt:1001,time:1000001},{role:"role2",hurt:1002,time:1000002},{role:"role3",hurt:1003,time:1000003},{role:"role4",hurt:1004,time:1000004}]}'
		assertEQ ( getSendMsg_t(), expectStr )
	end;
	
	test_sendTodayInfo = function(self)
		self.mm:mock(Service:getRankRefreshDB(), 'getSortTime', {1000000})
		self.player:getTask():getWorldBoss():setPersonRankGiftTime(1000000-1)
		self.player:getTask():getWorldBoss():setCountryRankGiftTime(1000000)
		
		Util:setTimeDrt(1379520000)
		self.player:getTask():getWorldBoss():setTodayTimes(3)
		self.player:getTask():getWorldBoss():setGuwuLevel(2)
		self.player:getTask():getWorldBoss():setGotGift(1)
		WorldBossSender:sendTodayInfo(self.player)
		local expectStr =   '{cmd:' .. NETCMD.WORLDBOSS .. ',today:{times:3,gotGift:1,guwu:2,gotPRankGift:0,gotCRankGift:1}}'
		assertEQ ( getSendMsg_t(), expectStr )
	end;
	
	test_sendFightDemo = function(self)
		local fightDemo = {armyId=1, fightId=2} 
		local hurt = 10
		WorldBossSender:sendFightDemo(self.player, fightDemo, hurt)
		assertEQ ( getSendMsg_t() , '{cmd:' .. NETCMD.WORLDBOSS .. ',fightDemo:{fightId:2,armyId:1},hurt:10}' )
	end;
	
	test_sendRanks = function(self)
		Util:setTimeDrt(100000000) 
		self.mm:mock(Service:getRoleRankDB(), 'sortWorldBossRank', { {{id=1, name='role1', hurt=1000},{id=2, name='role2', hurt=2000}} })
		Service:getRoleWorldBossRank():start()
		self.mm:mock(Service:getAllianceRankDB(), 'sortWorldBossRank', { {{id=1, name='alli1', hurt=100},{id=2, name='alli2', hurt=200}} })
		Service:getAllianceWorldBossRank():start()
		self.mm:mock(Service:getCountryRankDB(), 'sortWorldBossRank', { {{id=9900001, name='榄忓浗', times=10},{id=9900002, name='', times=20}} })
		Service:getCountryWorldBossRank():start()
		self.mm:mock(Service:getRankRefreshDB(), 'getSortTimes', nil, function(self, name)
			if ( name == Service:getCountryWorldBossRank():getRankName() ) then return 10 end
			return 0
		end)
		
		WorldBossSender:sendRanks(self.player)
		
		local expectStr =   '{cmd:' .. NETCMD.WORLDBOSS .. ',prank:[{rank:1,role:"role1",hurt:1000},{rank:2,role:"role2",hurt:2000}]'
		expectStr = expectStr .. ',arank:[{rank:1,alli:"alli1",hurt:100},{rank:2,alli:"alli2",hurt:200}]'
		expectStr = expectStr .. ',crank:[{rank:1,country:9900001,times:10},{rank:2,country:9900002,times:20}]'
		expectStr = expectStr .. ',crankweek:10}'
		assertEQ ( getSendMsg_t() , expectStr )
	end;
	
	test_sendGetAlliGiftInfo = function(self)
		local alliance1 = app:getAlliMgr():createAlliance(self.player, 'alli1', 'f')
		self.player:setAlliId(alliance1:getId())		
		local leader = TestCaseHelper:loadPlayerByUserNameEx('user', 'leader',100000)
		local alliance2 = app:getAlliMgr():createAlliance(leader, 'alli2', 'f')
		
		Util:setTimeDrt(100000000) 
		self.mm:mock(Service:getAllianceRankDB(), 'sortWorldBossRank', { {{id=alliance1:getId(), name='alli1', hurt=100},{id=alliance2:getId(), name='alli2', hurt=200}} })
		Service:getAllianceWorldBossRank():start()
		
		alliance1:getItemPkg():clearLastItems()
		alliance1:getItemPkg():addLastItem({resid=25000001, num=1})
		alliance1:getItemPkg():addLastItem({resid=25000002, num=2})
		
		alliance2:getItemPkg():clearLastItems()
		alliance2:getItemPkg():addLastItem({resid=25000005, num=5})
		
		WorldBossSender:sendGetAlliGiftInfo(self.player)
		local expectStr =   '{cmd:' .. NETCMD.WORLDBOSS .. ',alligifts:[{alli:"alli1",drops:[{id:25000001,num:1},{id:25000002,num:2}]},{alli:"alli2",drops:[{id:25000005,num:5}]}]}'
		assertEQ ( getSendMsg_t() , expectStr )
	end;
})

tqMsgSender_t_main = function(suite)	
	suite:addTestCase(TestCaseMsgSender, 'TestCaseMsgSender')
	suite:addTestCase(TestCaseCreateRoleSender, 'TestCaseCreateRoleSender')
	suite:addTestCase(TestCaseSkillMsgSender, 'TestCaseSkillMsgSender')
	suite:addTestCase(TestCaseAttrMsgSender, 'TestCaseAttrMsgSender')
	suite:addTestCase(TestCaseHeroAttrSender, 'TestCaseHeroAttrSender')
	suite:addTestCase(TestCaseRoleAttrSender, 'TestCaseRoleAttrSender')
	suite:addTestCase(TestCaseItemMsgSender, 'TestCaseItemMsgSender')
	suite:addTestCase(TestCaseRoleBaseSender, 'TestCaseRoleBaseSender')
	suite:addTestCase(TestCaseRoleRankSender, 'TestCaseRoleRankSender')
	suite:addTestCase(TestCasePkgMiscSender, 'TestCasePkgMiscSender')
	suite:addTestCase(TestCaseCityResSender, 'TestCaseCityResSender')
	suite:addTestCase(TestCaseCityBuildValSender, 'TestCaseCityBuildValSender')
	suite:addTestCase(TestCaseCityBuildSender, 'TestCaseCityBuildSender')
	suite:addTestCase(TestCaseCommResSender, 'TestCaseCommResSender')
	suite:addTestCase(TestCaseFarmSender, 'TestCaseFarmSender')
	suite:addTestCase(TestCasePopuSender, 'TestCasePopuSender')
	suite:addTestCase(TestCaseNewHerosSender, 'TestCaseNewHerosSender')
	suite:addTestCase(TestCaseRoleSoldierSender, 'TestCaseRoleSoldierSender')
	suite:addTestCase(TestCaseCultureSender, 'TestCaseCultureSender')
	suite:addTestCase(TestCaseMilitarySender, 'TestCaseMilitarySender')
	suite:addTestCase(TestCaseMailSender,'TestCaseMailSender')
	suite:addTestCase(TestCasePlayerCityDefSender,'TestCasePlayerCityDefSender')
	suite:addTestCase(TestCasePlayerTowerSender,'TestCasePlayerTowerSender')
	suite:addTestCase(TestCasePlayerSelfFieldSender,'TestCasePlayerSelfFieldSender')
	suite:addTestCase(TestCaseItemOpSender,'TestCaseItemOpSender')
	suite:addTestCase(TestCaseOutFieldSender,'TestCaseOutFieldSender')
	suite:addTestCase(TestCaseFriendSender,'TestCaseFriendSender')
	suite:addTestCase(TestCaseExchangeHeroExpSender,'TestCaseExchangeHeroExpSender')
	suite:addTestCase(TestCaseFightResStateSender,'TestCaseFightResStateSender')
	suite:addTestCase(TestCaseRoleStateSender,'TestCaseRoleStateSender')
	suite:addTestCase(TestCaseChatSender,'TestCaseChatSender')
	suite:addTestCase(TestCaseAllianceSender,'TestCaseAllianceSender')
	suite:addTestCase(TestCaseOtherPlayerInfoSender,'TestCaseOtherPlayerInfoSender')
	suite:addTestCase(TestCaseTradingAreaSender,'TestCaseTradingAreaSender')
	suite:addTestCase(TestCaseActTowerSender,'TestCaseActTowerSender')
	suite:addTestCase(TestCaseActTerraceSender,'TestCaseActTerraceSender')
	suite:addTestCase(TestCaseStateCitySender,'TestCaseStateCitySender')
	suite:addTestCase(TestCaseTaskSender,'TestCaseTaskSender')
	suite:addTestCase(TestCaseActivityValSender,'TestCaseActivityValSender')
	suite:addTestCase(TestCaseShopSender,'TestCaseShopSender')
	suite:addTestCase(TestCaseNewcomerTaskSender,'TestCaseNewcomerTaskSender')
	suite:addTestCase(TestCaseDealByGoldSender,'TestCaseDealByGoldSender')
	suite:addTestCase(TestCaseClientCfgSender,'TestCaseClientCfgSender')
	suite:addTestCase(TestCaseServerCfgSender,'TestCaseServerCfgSender')
	suite:addTestCase(TestCaseAutoBuildSender,'TestCaseAutoBuildSender')
	suite:addTestCase(TestCasePayGoldSender,'TestCasePayGoldSender')
	suite:addTestCase(TestCaseWorldBossSender,'TestCaseWorldBossSender')
end;




