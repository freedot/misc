require('tqDropItemUtil')

local TestCaseDropItem = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		self.dropItem = DropItem()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	test_handle = function(self)
		self.mm:mock(self.dropItem, 'initParams')
		self.mm:mock(self.dropItem, 'dropRoleExp')
		self.mm:mock(self.dropItem, 'dropRolePs')
		self.mm:mock(self.dropItem, 'dropHeroExp')
		self.mm:mock(self.dropItem, '_dropHeroCredit')
		self.mm:mock(self.dropItem, '_dropRoleMoney')
		self.mm:mock(self.dropItem, '_dropHeroIForce')
		
		self.mm:mock(self.dropItem, '_dropFourres')
		self.mm:mock(self.dropItem, '_dropIdlePopu')
		self.mm:mock(self.dropItem, '_dropGiftGold')
		self.mm:mock(self.dropItem, '_dropGold')
		self.mm:mock(self.dropItem, '_dropAlliContribute')
		self.mm:mock(self.dropItem, '_dropPrestige')
		self.mm:mock(self.dropItem, '_dropStateHonour')
		self.mm:mock(self.dropItem, '_dropJibing1')
		self.mm:mock(self.dropItem, '_dropXinbing')
		
		self.mm:mock(self.dropItem, 'dropItems')

		local p_dropId = 1
		local p_addiations = {appendPro=1}
		self.dropItem:handle(p_dropId, p_addiations)
		assertEQ ( self.mm.walkLog, 'initParams,dropRoleExp,dropRolePs,dropHeroExp,_dropHeroCredit,_dropRoleMoney,_dropHeroIForce,_dropFourres,_dropIdlePopu,_dropGiftGold,_dropGold,_dropAlliContribute,_dropPrestige,_dropStateHonour,_dropJibing1,_dropXinbing,dropItems' )
		assertEQ ( self.mm.params['initParams'], {p_dropId, p_addiations} )
	end;
	
	test_initParams = function(self)
		res_drops = {{id=1}}
		
		local p_dropId = 1
		local p_appendPro = 2
		self.dropItem:initParams(p_dropId, {appendPro=p_appendPro})
		assertEQ ( self.dropItem.logs, {} )
		assertEQ ( self.dropItem.drops, {roleExp=0, rolePs=0, heroExp=0, heroCredit=0, roleMoney=0, heroIForce=0, fourres=0, idlePopu=0, giftGold=0, gold=0, alliContribute=0, prestige=0, stateHonour=0, jibing1=0, xinbing=0, items={}} )
		assertEQ ( self.dropItem.additions.appendPro, 2 )
		assertEQ ( self.dropItem.dropRes, res_drops[1] )
		
		self.dropItem:initParams(p_dropId)
		assertEQ ( self.dropItem.additions.appendPro, 0 )
	end;
	
	test_dropRolePs = function(self)
		self.mm:mock(self.dropItem, 'pushLog')
		self.dropItem.appendPro = 0
		self.dropItem.dropRes = {roleps = nil}
		self.dropItem.drops = {rolePs = 0}
		self.dropItem:dropRolePs()
		assertEQ ( self.mm.walkLog, '' )
		assertEQ ( self.dropItem.drops.rolePs, 0 )
		
		self.dropItem.dropRes = {roleps = {pro=100, minnum=1, maxnum=1}}
		self.dropItem:dropRolePs()
		assertEQ ( self.mm.params['pushLog'], {{type='roleps', val=1}} )
		assertEQ ( self.dropItem.drops.rolePs, 1 )
	end;
	
	test__dropRoleMoney = function(self)
		self.mm:mock(self.dropItem, 'pushLog')
		self.dropItem.appendPro = 0
		self.dropItem.dropRes = {money = nil}
		self.dropItem.drops = {roleMoney = 0}
		self.dropItem:_dropRoleMoney()
		assertEQ ( self.mm.walkLog, '' )
		assertEQ ( self.dropItem.drops.roleMoney, 0 )
		
		self.dropItem.dropRes = {money = {pro=100, minnum=1, maxnum=1}}
		self.dropItem:_dropRoleMoney()
		assertEQ ( self.mm.params['pushLog'], {{type='rolemoney', val=1}} )
		assertEQ ( self.dropItem.drops.roleMoney, 1 )
	end;
	
	test__dropHeroIForce = function(self)
		self.mm:mock(self.dropItem, 'pushLog')
		self.dropItem.appendPro = 0
		self.dropItem.dropRes = {iforce = nil}
		self.dropItem.drops = {heroIForce = 0}
		self.dropItem:_dropHeroIForce()
		assertEQ ( self.mm.walkLog, '' )
		assertEQ ( self.dropItem.drops.heroIForce, 0 )
		
		self.dropItem.dropRes = {iforce = {pro=100, minnum=1, maxnum=1}}
		self.dropItem:_dropHeroIForce()
		assertEQ ( self.mm.params['pushLog'], {{type='heroiforce', val=1}} )
		assertEQ ( self.dropItem.drops.heroIForce, 1 )
	end;
	
	test__dropFourres = function(self)
		self.mm:mock(self.dropItem, 'pushLog')
		self.dropItem.appendPro = 0
		self.dropItem.dropRes = {fourres = nil}
		self.dropItem.drops = {fourres = 0}
		self.dropItem:_dropFourres()
		assertEQ ( self.mm.walkLog, '' )
		assertEQ ( self.dropItem.drops.fourres, 0 )
		
		self.dropItem.dropRes = {fourres = {pro=100, minnum=1, maxnum=1}}
		self.dropItem:_dropFourres()
		assertEQ ( self.mm.params['pushLog'], {{type='fourres', val=1}} )
		assertEQ ( self.dropItem.drops.fourres, 1 )	
	end;
	
	test__dropIdlePopu = function(self)
		self.mm:mock(self.dropItem, 'pushLog')
		self.dropItem.appendPro = 0
		self.dropItem.dropRes = {idlepopu = nil}
		self.dropItem.drops = {idlePopu = 0}
		self.dropItem:_dropIdlePopu()
		assertEQ ( self.mm.walkLog, '' )
		assertEQ ( self.dropItem.drops.idlePopu, 0 )
		
		self.dropItem.dropRes = {idlepopu = {pro=100, minnum=1, maxnum=1}}
		self.dropItem:_dropIdlePopu()
		assertEQ ( self.mm.params['pushLog'], {{type='idlepopu', val=1}} )
		assertEQ ( self.dropItem.drops.idlePopu, 1 )	
	end;
	
	test__dropGiftGold = function(self)
		self.mm:mock(self.dropItem, 'pushLog')
		self.dropItem.appendPro = 0
		self.dropItem.dropRes = {giftgold = nil}
		self.dropItem.drops = {giftGold = 0}
		self.dropItem:_dropGiftGold()
		assertEQ ( self.mm.walkLog, '' )
		assertEQ ( self.dropItem.drops.giftGold, 0 )
		
		self.dropItem.dropRes = {giftgold = {pro=100, minnum=1, maxnum=1}}
		self.dropItem:_dropGiftGold()
		assertEQ ( self.mm.params['pushLog'], {{type='giftgold', val=1}} )
		assertEQ ( self.dropItem.drops.giftGold, 1 )
	end;
	
	test__dropAlliContribute = function(self)
		self.mm:mock(self.dropItem, 'pushLog')
		self.dropItem.appendPro = 0
		self.dropItem.dropRes = {allicontribute = nil}
		self.dropItem.drops = {alliContribute = 0}
		self.dropItem:_dropAlliContribute()
		assertEQ ( self.mm.walkLog, '' )
		assertEQ ( self.dropItem.drops.alliContribute, 0 )
		
		self.dropItem.dropRes = {allicontribute = {pro=100, minnum=1, maxnum=1}}
		self.dropItem:_dropAlliContribute()
		assertEQ ( self.mm.params['pushLog'], {{type='allicontribute', val=1}} )
		assertEQ ( self.dropItem.drops.alliContribute, 1 )
	end;
	
	test__dropPrestige = function(self)
		self.mm:mock(self.dropItem, 'pushLog')
		self.dropItem.appendPro = 0
		self.dropItem.dropRes = {prestige = nil}
		self.dropItem.drops = {prestige = 0}
		self.dropItem:_dropPrestige()
		assertEQ ( self.mm.walkLog, '' )
		assertEQ ( self.dropItem.drops.prestige, 0 )
		
		self.dropItem.dropRes = {prestige = {pro=100, minnum=1, maxnum=1}}
		self.dropItem:_dropPrestige()
		assertEQ ( self.mm.params['pushLog'], {{type='prestige', val=1}} )
		assertEQ ( self.dropItem.drops.prestige, 1 )
	end;
	
	test__dropStateHonour = function(self)
		self.mm:mock(self.dropItem, 'pushLog')
		self.dropItem.appendPro = 0
		self.dropItem.dropRes = {statehonour = nil}
		self.dropItem.drops = {stateHonour = 0}
		self.dropItem:_dropStateHonour()
		assertEQ ( self.mm.walkLog, '' )
		assertEQ ( self.dropItem.drops.stateHonour, 0 )
		
		self.dropItem.dropRes = {statehonour = {pro=100, minnum=1, maxnum=1}}
		self.dropItem:_dropStateHonour()
		assertEQ ( self.mm.params['pushLog'], {{type='statehonour', val=1}} )
		assertEQ ( self.dropItem.drops.stateHonour, 1 )
	end;
	
	test__dropJibing1 = function(self)
		self.mm:mock(self.dropItem, 'pushLog')
		self.dropItem.appendPro = 0
		self.dropItem.dropRes = {jibing1 = nil}
		self.dropItem.drops = {jibing1 = 0}
		self.dropItem:_dropJibing1()
		assertEQ ( self.mm.walkLog, '' )
		assertEQ ( self.dropItem.drops.jibing1, 0 )
		
		self.dropItem.dropRes = {jibing1 = {pro=100, minnum=1, maxnum=1}}
		self.dropItem:_dropJibing1()
		assertEQ ( self.mm.params['pushLog'], {{type='jibing1', val=1}} )
		assertEQ ( self.dropItem.drops.jibing1, 1 )
	end;
	
	test__dropXinbing = function(self)
		self.mm:mock(self.dropItem, 'pushLog')
		self.dropItem.appendPro = 0
		self.dropItem.dropRes = {xinbing = nil}
		self.dropItem.drops = {xinbing = 0}
		self.dropItem:_dropXinbing()
		assertEQ ( self.mm.walkLog, '' )
		assertEQ ( self.dropItem.drops.xinbing, 0 )
		
		self.dropItem.dropRes = {xinbing = {pro=100, minnum=1, maxnum=1}}
		self.dropItem:_dropXinbing()
		assertEQ ( self.mm.params['pushLog'], {{type='xinbing', val=1}} )
		assertEQ ( self.dropItem.drops.xinbing, 1 )
	end;
	
	test_randomDropNum = function(self)
		self.mm:mock(self.dropItem, 'fullRandDropNum')
		self.mm:mock(self.dropItem, 'roundRandDropNum')
		
		local res = {randtype=RAND_TYPE.FULLRAND}
		self.dropItem:randomDropNum(res)
		assertEQ ( self.mm.walkLog, 'fullRandDropNum')
		assertEQ ( self.mm.params['fullRandDropNum'], {res} )
		
		self.mm:clear()
		res = {randtype=RAND_TYPE.ROUNDRAND}
		self.dropItem:randomDropNum(res)
		assertEQ ( self.mm.walkLog, 'roundRandDropNum')
		assertEQ ( self.mm.params['roundRandDropNum'], {res} )
	end;
	
	test_fullRandDropNum = function(self)
		local p_res = {pro=0, minnum=10, maxnum=10}
		
		self.dropItem.additions.appendPro = 0
		assertEQ ( self.dropItem:fullRandDropNum(p_res), 0 )
		
		self.dropItem.additions.appendPro = 100
		assertEQ ( self.dropItem:fullRandDropNum(p_res), 10 )	
	end;
	
	test_roundRandDropNum = function(self)
		self.mm:mock(self.dropItem, '_getRandNum', {10} )
		
		local res = {minpro=10, maxpro = 20}
		self.dropItem.roundRandPro = 9
		assertEQ ( self.dropItem:roundRandDropNum(res), 0 )
		self.dropItem.roundRandPro = 21
		assertEQ ( self.dropItem:roundRandDropNum(res), 0 )
		self.dropItem.roundRandPro = 10
		assertEQ ( self.dropItem:roundRandDropNum(res), 10 )
		self.dropItem.roundRandPro = 15
		assertEQ ( self.dropItem:roundRandDropNum(res), 10 )
		self.dropItem.roundRandPro = 20
		assertEQ ( self.dropItem:roundRandDropNum(res), 10 )
	end;
	
	test__getRandNum = function(self)
		self.mm:mock(math, 'random', {20})
		local res = {minnum=10, maxnum=10}
		assertEQ ( self.dropItem:_getRandNum(res), 10)
		res = {minnum=10, maxnum=30}
		assertEQ ( self.dropItem:_getRandNum(res),20)
		assertEQ ( self.mm.params['random'], {10,30} )
	end;
})

local TestCaseDropItemUtil = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		self.player:setLevel(1)
		TestCaseCondition:setPreCond(self.player, nil, {heros={{state=0}} })
		self.hero = self.player:getHeroMgr():getHeroById(1)
		
		local g_mm = self.mm
		self.mm.sysMailCount = 0
		self.sysMail = {}
		self.mm:mock(app:getMailMgr(), 'addSysMail', {self.sysMail}, function(self)  
			g_mm.sysMailCount = g_mm.sysMailCount + 1 
			end)		
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	testDropRoleExp = function(self)
		res_drops={{id=1, roleexp={pro=100,maxnum=2,minnum=2}}}
		self.player:setAttrVal(ATTR.XP, 0)
		DropItemUtil:handle(self.player, {}, {}, 1, {roleExp={mult=2, add=100}})
		assert( 2*2 + 100 == self.player:getAttrVal(ATTR.XP) )
		assert( DropItemUtil:getLog()[1].type == 'roleexp' )
		assert( DropItemUtil:getLog()[1].val == 2*2 + 100 )
	end;
	
	testDropHeroExp = function(self)
		res_drops={{id=1, heroexp={pro=100,maxnum=1,minnum=1}}}
		local actor = HeroActor()
		actor:setHero(self.hero)
		DropItemUtil:handle(self.player, {actor}, nil, 1) 
		assert( 1 == self.hero:getAttrVal(ATTR.XP) )
		assert( 1 == actor:getAddExp() )
		assert( DropItemUtil:getLog()[1].type == 'heroexp' )
		assert( DropItemUtil:getLog()[1].val == 1 )
		
		DropItemUtil:handle(self.player, {actor}, nil, 1, {heroExp={mult=2}}) 
		assert( 1+2 == actor:getAddExp() )
		assert( DropItemUtil:getLog()[1].type == 'heroexp' )
		assert( DropItemUtil:getLog()[1].val == 2 )
		
		DropItemUtil:handle(self.player, {actor}, nil, 1, {heroExp={mult=3, add=100}}) 
		assert( DropItemUtil:getLog()[1].val == 3*1 + 100 )
	end;
	
	testDropHeroCredit = function(self)
		self.mm:mock(HeroAttrSender, 'sendAttr')
		res_drops={{id=1, credit={pro=100,maxnum=2,minnum=2}}}
		DropItemUtil:handle(self.player, nil, {self.hero}, 1, {heroCredit={mult=3, add=100}}) 
		assert( 2*3 + 100 == self.hero:getAttrVal(ATTR.CRE) )
		assert( DropItemUtil:getLog()[1].type == 'herocredit' )
		assert( DropItemUtil:getLog()[1].val == 2*3 + 100 )
		assertEQ ( self.mm.params['sendAttr'], {self.player, self.hero, self.hero:getAttr(ATTR.CRE)} )
	end;
	
	testDropHeroCreditByActor = function(self)
		res_drops={{id=1, credit={pro=100,maxnum=1,minnum=1}}}
		local actor = HeroActor()
		actor:setHero(self.hero)
		DropItemUtil:handle(self.player, {actor}, nil, 1) 
		assert( 1 == self.hero:getAttrVal(ATTR.CRE) )
		assert( 1 == actor:getAddCredit() )
		assert( DropItemUtil:getLog()[1].type == 'herocredit' )
		assert( DropItemUtil:getLog()[1].val == 1 )
	end;
	
	testDropItems_noDropItems = function(self)
		res_drops={{id=1, items={{id=FIXID.SALVE,pro=0,maxnum=1,minnum=1},{id=FIXID.CHILINGDAN,pro=0,maxnum=2,minnum=2}}}}
		DropItemUtil:handle(self.player, {}, {}, 1) 
		assert ( self.player:getPkg():getItemNumber(FIXID.SALVE) == 0 )
		assert( table.getn(DropItemUtil:getLog()) == 0 )
		
		assert ( self.mm.sysMailCount == 0, 'not send item by mail' )
	end;
	
	testDropItems = function(self)
		res_drops={{id=1, items={{id=FIXID.SALVE,pro=100,maxnum=1,minnum=1},{id=FIXID.CHILINGDAN,pro=100,maxnum=2,minnum=2}}}}
		DropItemUtil:handle(self.player, {}, {}, 1) 
		assert ( self.player:getPkg():getItemNumber(FIXID.SALVE) == 1 )
		assert( DropItemUtil:getLog()[1].type == 'item' )
		assert( DropItemUtil:getLog()[1].id == FIXID.SALVE )
		assert( DropItemUtil:getLog()[1].number == 1 )
		assert( DropItemUtil:getLog()[2].type == 'item' )
		assert( DropItemUtil:getLog()[2].id == FIXID.CHILINGDAN )
		assert( DropItemUtil:getLog()[2].number == 2 )		
	end;
	
	testDropItems_noItemPkgSpace = function(self)
		self.mm:mock(MailSender, 'sendBriefMail')
		
		res_drops={{id=1, items={{id=FIXID.SALVE,pro=100,maxnum=1,minnum=1},{id=FIXID.CHILINGDAN,pro=100,maxnum=2,minnum=2}}}}
		self.player:getPkg():setMaxGridsCnt(0)
		DropItemUtil:handle(self.player, {}, {}, 1) 
		assert ( self.player:getPkg():getItemNumber(FIXID.SALVE) == 0 )
		
		assert ( self.mm.sysMailCount == 1, 'send item by mail' )
		assert ( table.getn(self.mm.params['addSysMail'][5] ) == 2, 'send item by mail' )
		assertListEQ ( self.mm.params['sendBriefMail'], {self.player, self.sysMail} )
	end;
	
	test_dropRolePs = function(self)
		DropItemUtil.player = self.player
		local r_getDrops = {{rolePs=0}}
		self.mm:mock(DropItemUtil.dropItem, 'getDrops', r_getDrops)
		self.mm:mock(self.player, 'addAttrPs')
		DropItemUtil:_dropRolePs()
		assertEQ ( self.mm.walkLog, 'getDrops' )
		
		self.mm:clear()
		r_getDrops[1] = {rolePs=1}
		DropItemUtil:_dropRolePs()
		assertEQ ( self.mm.walkLog, 'getDrops,addAttrPs' )
		assertEQ ( self.mm.params['addAttrPs'], {1, true} )
	end;
	
	test__dropRoleMoney = function(self)
		DropItemUtil.player = self.player
		local r_getDrops = {{roleMoney=0}}
		self.mm:mock(DropItemUtil.dropItem, 'getDrops', r_getDrops)
		DropItemUtil:_dropRoleMoney()
		assertEQ ( self.player:getCityRes():getMoney(), 0 )
		
		self.mm:clear()
		r_getDrops[1] = {roleMoney=1}
		DropItemUtil:_dropRoleMoney()
		assertEQ ( self.player:getCityRes():getMoney(), 1 )
	end;
	
	test__dropHeroIForce = function(self)
		self.mm:mock(HeroAttrSender, 'sendAttr')
		local dropId = 7500001
		local res = ItemResUtil:findItemres(dropId)
		res.iforce = {pro = 100, maxnum = 5, minnum = 5}
		TestCaseCondition:setPreCond(self.player, nil, {heros={{state=0},{state=0},{state=0}} })
		local hero1 = self.player:getHeroMgr():getHeroById(1)
		local hero2 = self.player:getHeroMgr():getHeroById(2)
		DropItemUtil:handle(self.player, nil, {hero1, hero2}, dropId, {heroIForce={mult=2,add=3}})
		assertEQ ( hero1:getAttrVal(ATTR.IF), 5*2 + 3 )
		assertEQ ( hero2:getAttrVal(ATTR.IF), 5*2 + 3  )
		
		self.mm:clear()
		local actor1 = HeroActor:new()
		actor1:setHero(hero1)
		local actor2 = HeroActor:new()
		actor2:setHero(hero2)
		local mif = hero1:getAttrVal(ATTR.MIF)
		res.iforce = {pro = 100, maxnum = mif, minnum = mif}
		DropItemUtil:handle(self.player, {actor1, actor2}, nil, dropId)
		assertEQ ( hero1:getAttrVal(ATTR.IF), mif )
		assertEQ ( hero2:getAttrVal(ATTR.IF), mif )
		assertEQ ( self.mm.params['sendAttr'], {self.player, hero2, hero2:getAttr(ATTR.IF)} )
	end;
	
	test__dropFourres = function(self)
		self.mm:mock(CommResSender, 'sendAll')
		local dropId = 7500001
		local res = ItemResUtil:findItemres(dropId)
		res.fourres = {pro = 100, maxnum = 6, minnum = 6}
		DropItemUtil:handle(self.player, nil, nil, dropId)
		assertEQ ( self.player:getCityRes():getFood(), 6 )
		assertEQ ( self.player:getCityRes():getWood(), 6 )
		assertEQ ( self.player:getCityRes():getStone(), 6 )
		assertEQ ( self.player:getCityRes():getIron(), 6 )
		assertEQ ( self.mm.params['sendAll'], {self.player} )
	end;
	
	test__dropIdlePopu = function(self)
		self.mm:mock(PopuSender, 'send')
		local dropId = 7500001
		local res = ItemResUtil:findItemres(dropId)
		res.idlepopu = {pro = 100, maxnum = 7, minnum = 7}
		
		local lastIdlePopu = self.player:getCitys():getMaxPopu() - (7 + 6)
		self.player:getCityRes():setIdlePopu( lastIdlePopu )
		DropItemUtil:handle(self.player, nil, nil, dropId)
		assertEQ ( self.player:getCityRes():getIdlePopu(), lastIdlePopu + 7 )
		
		DropItemUtil:handle(self.player, nil, nil, dropId)
		assertEQ ( self.player:getCityRes():getIdlePopu(), self.player:getCitys():getMaxPopu() )
		assertEQ ( self.mm.params['send'], {self.player, {'idle'}} )
	end;
	
	test__dropGiftGold = function(self)
		self.mm:mock(PkgMiscSender, 'send')
		local dropId = 7500001
		local res = ItemResUtil:findItemres(dropId)
		res.gold = {pro = 0, maxnum = 8, minnum = 8}
		res.giftgold = {pro = 100, maxnum = 8, minnum = 8}
		DropItemUtil:handle(self.player, nil, nil, dropId)
		assertEQ ( self.player:getPkg():getGiftGold(), 8 )
		assertEQ ( self.mm.params['send'], {self.player, {'giftgold'}} )
	end;
	
	test__dropGold = function(self)
		self.mm:mock(PkgMiscSender, 'send')
		local dropId = 7500001
		local res = ItemResUtil:findItemres(dropId)
		res.gold = {pro = 100, maxnum = 8, minnum = 8}
		res.giftgold = {pro = 0, maxnum = 8, minnum = 8}
		DropItemUtil:handle(self.player, nil, nil, dropId)
		assertEQ ( self.player:getPkg():getGold(), 8 )
		assertEQ ( self.mm.params['send'], {self.player, {'gold'}} )
	end;
	
	test__dropAlliContribute = function(self)
		self.mm:mock(AllianceSender, 'sendSelfMember')
		local leaderPlayer = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100000)
		local alliance = app:getAlliMgr():createAlliance(leaderPlayer, 'alliance', 'f')
		local mem = AllianceMember()
		local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		memPlayer:setAlliId(alliance:getId())
		mem:setId(memPlayer:getRoleId())
		mem:setAlliPos(ALLI_POS.MEM)
		alliance:addMember(mem)
		
		local member = alliance:getMemberById(memPlayer:getRoleId())
		member:setContributes( 1 )
		
		local dropId = 7500001
		local res = ItemResUtil:findItemres(dropId)
		res.allicontribute = {pro = 100, maxnum = 9, minnum = 9}
		DropItemUtil:handle(memPlayer, nil, nil, dropId)
		assertEQ ( member:getContributes(), 10 )
		assertEQ ( self.mm.params['sendSelfMember'], {memPlayer, alliance} )
	end;
	
	test__dropPrestige = function(self)
		self.mm:mock(RoleBaseSender, 'send')
		local dropId = 7500001
		local res = ItemResUtil:findItemres(dropId)
		res.prestige = {pro = 100, maxnum = 10, minnum = 10}
		self.player:setPrestige(1)
		DropItemUtil:handle(self.player, nil, nil, dropId)
		assertEQ ( self.player:getPrestige(), 11)
		assertEQ ( self.mm.params['send'], {self.player, {'prestige'}} )
	end;
	
	test__dropStateHonour = function(self)
		self.mm:mock(RoleBaseSender, 'send')
		local dropId = 7500001
		local res = ItemResUtil:findItemres(dropId)
		res.statehonour = {pro = 100, maxnum = 11, minnum = 11}
		self.player:setCityHonor(1)
		DropItemUtil:handle(self.player, nil, nil, dropId)
		assertEQ ( self.player:getCityHonor(), 12 )
		assertEQ ( self.mm.params['send'], {self.player, {'cityhonor'}} )
	end;
	
	test__dropJibing1 = function(self)
		self.mm:mock(RoleSoldierSender, 'sendSoldier')
		local dropId = 7500001
		local res = ItemResUtil:findItemres(dropId)
		res.jibing1 = {pro = 100, maxnum = 12, minnum = 12}
		DropItemUtil:handle(self.player, nil, nil, dropId)
		assertEQ ( self.player:getSoldierMgr():getSoldierNumber( WUtil:makeSoldierResId(FIXID.JIBING, 1) ), 12 )
		assertEQ ( self.mm.params['sendSoldier'], {self.player, WUtil:makeSoldierResId(FIXID.JIBING, 1)} )
	end;
	
	test__dropXinbing = function(self)
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=7,resid=FIXID.BARBACK,level=2,state=0} } })
		self.player:recalSendMaxNewSoldier()
		local maxVal = self.player:getAttrVal(ATTR.MNAF)
		self.mm:mock(RoleAttrSender, 'sendAttr')
		local dropId = 7500001
		local res = ItemResUtil:findItemres(dropId)
		res.xinbing = {pro = 100, maxnum = maxVal - 1, minnum = maxVal - 1}
		DropItemUtil:handle(self.player, nil, nil, dropId)
		assertEQ ( self.player:getAttrVal(ATTR.NAF), maxVal - 1 )
		assertEQ ( self.mm.params['sendAttr'], {self.player, self.player:getAttr(ATTR.NAF)} )
		
		res.xinbing = {pro = 100, maxnum = 2, minnum = 2}
		DropItemUtil:handle(self.player, nil, nil, dropId)
		assertEQ ( self.player:getAttrVal(ATTR.NAF), maxVal )
	end;
	
	test__dropRoleRolesExp = function(self)
		local dropId = 7500001
		local res = ItemResUtil:findItemres(dropId)
		res.heroexp = {pro = 100, maxnum = 1, minnum = 1}
		local dropItem = DropItem()
		dropItem:handle(dropId)
		local lastXPS = self.player:getAttrVal(ATTR.XPS)
		DropItemUtil:dropResForRole(self.player, dropItem)
		assertEQ ( self.player:getAttrVal(ATTR.XPS), lastXPS + 1 )
	end;
})

tqDropItemUtil_t_main = function(suite)
	suite:addTestCase(TestCaseDropItem, 'TestCaseDropItem')
	suite:addTestCase(TestCaseDropItemUtil, 'TestCaseDropItemUtil')
end;



