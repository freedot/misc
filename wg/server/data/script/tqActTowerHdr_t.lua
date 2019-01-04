--*******************************************************************************
require('tqActTowerHdr')

local TestCaseActTowerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActTowerHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(1):getClass() , ActTowerGetBaseInfoHdr )
		assertEQ ( self.hdr:getHandler(2):getClass() , ActTowerEnterHdr )
		assertEQ ( self.hdr:getHandler(3):getClass() , ActTowerExpedHdr )
		assertEQ ( self.hdr:getHandler(4):getClass() , ActTowerExitHdr )
		assertEQ ( self.hdr:getHandler(5):getClass() , ActTowerStartAutoFightHdr )
		assertEQ ( self.hdr:getHandler(6):getClass() , ActTowerStopAutoFightHdr )
		assertEQ ( self.hdr:getHandler(7):getClass() , ActToweSearchRoleForRankHdr )
		assertEQ ( self.hdr:getHandler(8):getClass() , ActTowerGetPageRankRolesHdr )
		assertEQ ( self.hdr:getHandler(9):getClass() , ActTowerCheckAutoFightHdr )
	end;
})



local TestActTowerGetBaseInfoHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActTowerHdr():getHandler(1)	
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(ActTowerSender, 'sendBaseInfo')
		self.mm:mock(ActTowerSender, 'sendRanks')
		self.mm:mock(ActTowerSender, 'sendEnterTower')
		self.hdr:handle(self.player)
		assertEQ ( self.mm.walkLog, 'sendBaseInfo,sendRanks' )
		assertEQ ( self.mm.params['sendBaseInfo'], {self.player} )
		assertEQ ( self.mm.params['sendRanks'], {self.player, 1, 5, -1} )
		
		self.mm:clear()
		self.player:getActTower():setCurLayer(1)
		self.player:getActTower():setLeftLifes(2)
		self.player:getActTower():setStopTime(3)
		
		self.hdr:handle(self.player)
		assertEQ ( self.mm.walkLog, 'sendBaseInfo,sendRanks,sendEnterTower' )
		assertEQ ( self.mm.params['sendEnterTower'], {self.player} )
	end;
}) 

local TestCaseActTowerEnterHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.actTower = self.player:getActTower()
		self.hdr = ActTowerHdr():getHandler(2)	
		self.cmdtb = {startLayer=1, gainGift=0}
		TestHelperServerActEffectClear(app:getSvrAct())
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	helper_pre = function(self)
		self.mm:clear()
		test_helper_actTower_setMaxLayer(self.player, 82)
		self.actTower:setTodayEnterTimes(1)
		self.player:getPkg():subGold( self.player:getPkg():getAllGold() )
		self.player:getPkg():addGold(1000)
		self.player:getPkg():setMaxGridsCnt(100)
		TestCaseHelper:clearPkgItems(self.player)
		self.player:setLevel(res_enter_tower_need_rolelevel)
	end;
	
	test_handle = function(self)
		self.mm:travelMock(WUtil, 'sendWarningMsgArgs')
		self.mm:travelMock( WUtil, 'sendPopBoxMsgArgs' )
		self.mm:travelMock(ActTowerSender, 'sendEnterTower')
		self:helper_pre()
		test_helper_actTower_setMaxLayer(self.player, 0)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		
		self:helper_pre()
		self.cmdtb.startLayer = 0
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), false )
		
		self:helper_pre()
		test_helper_actTower_setMaxLayer(self.player, 39)
		self.cmdtb.startLayer = 41
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), false )
		
		self:helper_pre()
		self.cmdtb.startLayer = 41
		self.player:setLevel(res_enter_tower_need_rolelevel-1)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), false )
		
		self:helper_pre()
		self.cmdtb.startLayer = 41
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		
		self:helper_pre()
		self.actTower:setTodayEnterTimes(3)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100157, ''}, 'today arrive max times' )
		
		self:helper_pre()
		self.actTower:setTodayEnterTimes(2)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), false )
		assertEQ ( self.mm.params['sendPopBoxMsgArgs'], {self.player, 100066, '"@itemid' .. FIXID.HEIMULING .. '",1,0,' .. FIXID.HEIMULING }, "has't item" )
		
		self:helper_pre()
		self.cmdtb.startLayer = 41
		self.cmdtb.gainGift = 1
		self.player:getPkg():subGold( self.player:getPkg():getAllGold() )
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), false )
		
		self:helper_pre()
		self.cmdtb.startLayer = 41
		self.cmdtb.gainGift = 1
		self.player:getPkg():setMaxGridsCnt(1)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), false )
		assertEQ ( self.player:getPkg():getAllGold(), 1000 )
		assertEQ ( self.player:getPkg():getItemsCount() == 0, true )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100129, ''}, 'pkg is full' )
		
		self:helper_pre()
		self.cmdtb.startLayer = 1
		self.actTower:setStopTime(1)
		self.actTower:setTodayEnterTimes(0)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		assertEQ ( self.actTower:getTodayEnterTimes(), 1 )
		assertEQ ( self.mm.params['sendEnterTower'], {self.player})
		assertEQ ( self.actTower:getLeftLifes(), 2 )
		assertEQ ( self.actTower:getCurLayer(), 1)
		assertEQ ( self.actTower:getStopTime(), 0)
		assertEQ ( self.hdr.expends, {})
		
		self:helper_pre()
		self.cmdtb.startLayer = 41
		self.cmdtb.gainGift = 1
		self.player:getPkg():subGold(self.player:getPkg():getGold())
		self.player:getPkg():addGiftGold(1000)
		self.actTower:setStopTime(1)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), false )
		self.player:getPkg():subGiftGold(1000)
		
		self:helper_pre()
		self.cmdtb.startLayer = 41
		self.cmdtb.gainGift = 1
		self.actTower:setStopTime(1)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		assertEQ ( self.player:getPkg():getAllGold(), 1000 - (100 - 82) )
		assertEQ ( self.player:getPkg():getItemsCount() > 1, true )
		assertEQ ( self.actTower:getTodayEnterTimes(), 2 )
		assertEQ ( self.mm.params['sendEnterTower'], {self.player})
		assertEQ ( self.actTower:getLeftLifes(), 2 )
		assertEQ ( self.actTower:getCurLayer(), 41)
		assertEQ ( self.actTower:getStopTime(), 0)
		assertEQ ( self.hdr.expends, {})
		
		self:helper_pre()
		self.cmdtb.startLayer = 41
		self.cmdtb.gainGift = 1
		self.actTower:setStopTime(1)
		self.player:setVipLevel(3)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		assertEQ ( self.player:getPkg():getAllGold(), 1000 - (100 - 82) )
	end;
	
	test_enter41LayerWhenVip = function(self)
		self.mm:travelMock(WUtil, 'sendWarningMsgArgs')
		self.mm:travelMock( WUtil, 'sendPopBoxMsgArgs' )
		self.mm:travelMock(ActTowerSender, 'sendEnterTower')
		
		self:helper_pre()
		self.cmdtb.startLayer = 41
		self.cmdtb.gainGift = 1
		self.actTower:setStopTime(1)
		self.player:setVipLevel(4)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		assertEQ ( self.player:getPkg():getAllGold(), 1000 )
		assertEQ ( self.actTower:getLeftLifes(), 2 )
		assertEQ ( self.actTower:getCurLayer(), 41)
		assertEQ ( self.player:getPkg():getItemsCount() > 0, true )
		
		self:helper_pre()
		self.actTower:setTodayEnterTimes(2)
		self.cmdtb.startLayer = 41
		self.cmdtb.gainGift = 0
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.HEIMULING, number=1})})
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		assertEQ ( self.actTower:getTodayEnterTimes(), 3 )
		assertEQ ( self.actTower:getLeftLifes(), 3)
		assertEQ ( self.player:getPkg():getItemNumber(FIXID.HEIMULING), 0 )
		assertEQ ( self.player:getPkg():getAllGold(), 1000 )
		assertEQ ( self.player:getPkg():getItemsCount() > 0, true )
		
		self:helper_pre()
		TestHelperServerActEffectSet(app:getSvrAct(), SVR_TODAY_ACT_TYPE.ACT_TOWER_TIMES_1)
		self.actTower:setTodayEnterTimes(3)
		self.cmdtb.startLayer = 41
		self.cmdtb.gainGift = 1
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.HEIMULING, number=1})})
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		assertEQ ( self.actTower:getTodayEnterTimes(), 4 )
		assertEQ ( self.actTower:getLeftLifes(), 3)
		assertEQ ( self.player:getPkg():getItemNumber(FIXID.HEIMULING), 0 )	
	end;
}) 

local TestCaseActTowerExpedHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.actTower = self.player:getActTower()
		self.hdr = ActTowerHdr():getHandler(3)	
		TestCaseCondition:setPreCond(self.player, nil, { lineups={180001}, heros={{state=0,soldier={resid=150001001,number=1}},{state=1,soldier={resid=150001001,number=1}},{state=5,soldier={resid=150001001,number=1}} } })
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	helper_pre = function(self)
		self.mm:clear()
		Util:setTimeDrt(1000)
		self.actTower:setLeftLifes(1)
		self.actTower:setStopTime(Util:getTime()-1)
		self.actTower:setCurLayer(1)
		self.cmdtb = {lineup=180001,count=5,hid1=1,hid2=2,hid3=3,hid4=0,hid5=0}
		
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=24*3600, effect={id=RES_EFF.TOWER_RECOVER_SOLDIER,val=10,unit=1}}
		self.player:getStateContainer():appendState(stateRes, {type=0,id=0,skillId=0})
	end;
	
	test_handle = function(self)
		self.mm:mock(ActTowerSender, 'sendEnterTower')
		self.mm:mock(TaskFinisher, 'trigerTask')
		self.mm:mock(TaskFinisher, 'checkTasks')
		self.mm:mock(HeroAttrSender, 'sendHerosState')
		
		local ExpeditionMgr_isValid = false
		local ExpedTimerHdrMgr_isValid = false
		local ExpedReturnTimerHdr_isValid = false
		local p_player = nil
		local p_cmdtb = nil
		self.mm:mock(ExpeditionMgr, 'handle', nil, function(selfObj, player, cmdtb)
			assertEQ ( player:getHeroMgr():getHeroById(1):getState(), 0)
			assertEQ ( player:getHeroMgr():getHeroById(2):getState(), 1)
			assertEQ ( player:getHeroMgr():getHeroById(3):getState(), 0)
			assertEQ ( cmdtb.isMemArmy, 1 )
			
			p_player = player
			p_cmdtb = cmdtb
			return ExpeditionMgr_isValid, {armyId=1}
		end)
		
		local sendOBs = { {'fightResult', 1}, {'isSuccess', false}, {'fightDemo', {armyId=1, fightId=2}} }
		self.mm:mock(ExpedTimerHdrMgr, 'handle', nil, function(selfObj, timerHdr, armyId)
			if ExpedTimerHdrMgr_isValid then
				for _, v in ipairs(sendOBs) do
					selfObj:observer(v[1], v[2])
				end
			end
			return ExpedTimerHdrMgr_isValid
		end)
		
		self.mm:mock(ExpedReturnTimerHdr, 'handle', nil, function(selfObj, timerHdr, armyId)
			return ExpedReturnTimerHdr_isValid
		end)
		
		self:helper_pre()
		self.actTower:setLeftLifes(0)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), false )
		
		self:helper_pre()
		self.actTower:setStopTime(Util:getTime() + 1)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), false )
		
		self:helper_pre()
		self.actTower:setCurLayer(101)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), false )
		
		self:helper_pre()
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), false )
		assertEQ ( self.mm.params['sendEnterTower'], {self.player} )
		
		self:helper_pre()
		ExpeditionMgr_isValid = true
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), false )
		assertEQ ( self.mm.params['sendEnterTower'], {self.player} )
		assertEQ ( self.player:getHeroMgr():getHeroById(1):getState(), 0)
		assertEQ ( self.player:getHeroMgr():getHeroById(2):getState(), 1)
		assertEQ ( self.player:getHeroMgr():getHeroById(3):getState(), 5)
		local heros = {self.player:getHeroMgr():getHeroById(1),
			self.player:getHeroMgr():getHeroById(2),
			self.player:getHeroMgr():getHeroById(3)}
		assertEQ ( self.mm.params['sendHerosState'], {self.player, heros} )
		
		self:helper_pre()
		ExpedTimerHdrMgr_isValid = true
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), false )
		assertEQ ( self.mm.params['sendEnterTower'], {self.player} )
		assertEQ ( self.player:getHeroMgr():getHeroById(1):getState(), 0)
		assertEQ ( self.player:getHeroMgr():getHeroById(2):getState(), 1)
		assertEQ ( self.player:getHeroMgr():getHeroById(3):getState(), 5)
		
		self:helper_pre()
		self.actTower:setLeftLifes(2)
		ExpedReturnTimerHdr_isValid = true
		self.actTower:setStopTime(0)
		assertEQ ( self.player:getStateContainer():hasEffectState(RES_EFF.TOWER_RECOVER_SOLDIER), true )
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		
		assertEQ ( self.player:getHeroMgr():getHeroById(1):getState(), 0)
		assertEQ ( self.player:getHeroMgr():getHeroById(2):getState(), 1)
		assertEQ ( self.player:getHeroMgr():getHeroById(3):getState(), 5)
		
		assertEQ ( self.player:getStateContainer():hasEffectState(RES_EFF.TOWER_RECOVER_SOLDIER), true )
		assertEQ ( self.actTower:getLeftLifes(), 1 )
		assertEQ ( self.actTower:getStopTime(), Util:getTime() + 60 )
		assertEQ ( self.actTower:getCurLayer(), 1 )
		assertEQ ( self.mm.params['sendEnterTower'], {self.player
			,{armyId=1,fightId=2}
			,{layer=self.actTower:getCurLayer(), fightResult=1, gift={heroExp=0,items={}} }
			 } )
			 
		Util:setTimeDrt(Util:getTime() + 61)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		assertEQ ( self.actTower:getLeftLifes(), 0 )
		assertEQ ( self.player:getStateContainer():hasEffectState(RES_EFF.TOWER_RECOVER_SOLDIER), false )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.JION_ACT_TOWER} )
		
		self:helper_pre()
		self.player:setVipLevel(3)
		assertEQ ( self.player:getStateContainer():hasEffectState(RES_EFF.TOWER_RECOVER_SOLDIER), true )
		sendOBs = { {'fightResult', 6}, {'isSuccess', true}, {'fightDemo', {armyId=1, fightId=2}}, {'drop', {heroExp=10, items={{resid=1500001,number=2}} }} }
		self.actTower:setStopTime(0)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		assertEQ ( self.player:getStateContainer():hasEffectState(RES_EFF.TOWER_RECOVER_SOLDIER), true )
		assertEQ ( self.actTower:getLeftLifes(), 1 )
		assertEQ ( self.actTower:getStopTime(), Util:getTime() + (60 - 10) )
		assertEQ ( self.actTower:getCurLayer(), 1+1 )
		assertEQ ( self.actTower:getMaxLayer(), 1 )
		assertEQ ( self.mm.params['sendEnterTower'], {self.player
			,{armyId=1,fightId=2}
			,{layer=self.actTower:getCurLayer()-1, fightResult=6, gift={heroExp=10,items={{id=1500001,number=2}}} }
			 } )
		assertEQ ( self.mm.params['checkTasks'], {self.player} )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.JION_ACT_TOWER} )
		
		self:helper_pre()
		self.actTower:setCurLayer(100)
		assertEQ ( self.player:getStateContainer():hasEffectState(RES_EFF.TOWER_RECOVER_SOLDIER), true )
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		assertEQ ( self.actTower:getLeftLifes(), 0 )
		assertEQ ( self.player:getStateContainer():hasEffectState(RES_EFF.TOWER_RECOVER_SOLDIER), false )
		
		-- last stop time is not zero
		self:helper_pre()
		Util:setTimeDrt(Util:getTime() + 100)
		self.actTower:setStopTime(Util:getTime() - 30)
		self.player:setVipLevel(0)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		assertEQ ( self.actTower:getStopTime(), Util:getTime() + 30 )
		
		self:helper_pre()
		Util:setTimeDrt(Util:getTime() + 110)
		self.actTower:setStopTime(Util:getTime() - 61)
		self.player:setVipLevel(0)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		assertEQ ( self.actTower:getStopTime(), Util:getTime() - 1 )
	end;
	
	helper_expeditionMgr = function(self)
		self.ExpeditionMgr_isValid = false
		self.ExpedTimerHdrMgr_isValid = false
		self.ExpedReturnTimerHdr_isValid = false
		self.p_player = nil
		self.p_cmdtb = nil
		self.mm:mock(ExpeditionMgr, 'handle', nil, function(selfObj, player, cmdtb)
			assertEQ ( player:getHeroMgr():getHeroById(1):getState(), 0)
			assertEQ ( player:getHeroMgr():getHeroById(2):getState(), 1)
			assertEQ ( player:getHeroMgr():getHeroById(3):getState(), 0)
			assertEQ ( cmdtb.isMemArmy, 1 )
			
			self.p_player = player
			self.p_cmdtb = cmdtb
			return self.ExpeditionMgr_isValid, {armyId=1}
		end)
		
		self.sendOBs = { {'fightResult', 6}, {'isSuccess', true}, {'fightDemo', {armyId=1, fightId=2}} }
		self.mm:mock(ExpedTimerHdrMgr, 'handle', nil, function(selfObj, timerHdr, armyId)
			if self.ExpedTimerHdrMgr_isValid then
				for _, v in ipairs(self.sendOBs) do
					selfObj:observer(v[1], v[2])
				end
			end
			return self.ExpedTimerHdrMgr_isValid
		end)
		
		self.mm:mock(ExpedReturnTimerHdr, 'handle', nil, function(selfObj, timerHdr, armyId)
			return self.ExpedReturnTimerHdr_isValid
		end)
	end;
	
	test_sendWorldPopSysMsg = function(self)
		local p1 = TestCaseHelper:loadPlayerByUserNameEx('p1', 'p1_r', 100001)
		local p2 = TestCaseHelper:loadPlayerByUserNameEx('p2', 'p2_r', 100002)
		app:getPlayerMgr():appendPlayerIndex(p1)
		app:getPlayerMgr():appendPlayerIndex(p2)
		
		local r_getCount = {4}
		local r_get = {{misc={lastTowerLayer=30}}}
		self.mm:mock(app:getActTowerRank(), 'getCount', r_getCount)
		self.mm:mock(app:getActTowerRank(), 'get', r_get)
		self.mm:mock(WUtil, 'sendSysMsg')
		
		self:helper_expeditionMgr()
		self.ExpeditionMgr_isValid = true
		self.ExpedTimerHdrMgr_isValid = true
		self.ExpedReturnTimerHdr_isValid = true
		
		self:helper_pre()
		self.actTower:setCurLayer(20)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		assertStrRepeatCount(self.mm.walkLog, 'sendSysMsg', 0)
		
		self:helper_pre()
		self.actTower:setCurLayer(35)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		assertStrRepeatCount(self.mm.walkLog, 'sendSysMsg', 0)
		
		self:helper_pre()
		self.actTower:setCurLayer(40)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		assertEQ ( self.mm.params['get'], {4-1} )
		local msg = string.format(rstr.expedTowerLayer, self.player:getRoleName(), 40)
		assertStrRepeatCount(self.mm.walkLog, 'sendSysMsg', 2)
		assertEQ ( self.mm.params['sendSysMsg.1'], {p2, SMSGT.SYS_POPBAR, SMT_NORMAL, msg} )
		assertEQ ( self.mm.params['sendSysMsg.2'], {p1, SMSGT.SYS_POPBAR, SMT_NORMAL, msg} )
		
		self:helper_pre()
		r_getCount[1] = 0
		self.actTower:setCurLayer(20)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		assertStrRepeatCount(self.mm.walkLog, 'sendSysMsg', 2)
		
		self:helper_pre()
		r_getCount[1] = 100
		self.actTower:setCurLayer(60)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		assertStrRepeatCount(self.mm.walkLog, 'sendSysMsg', 2)
		assertEQ ( self.mm.params['get'], {30-1} )
		
		self:helper_pre()
		self.actTower:setCurLayer(80)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		assertStrRepeatCount(self.mm.walkLog, 'sendSysMsg', 2)
		
		self:helper_pre()
		self.actTower:setCurLayer(100)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		assertStrRepeatCount(self.mm.walkLog, 'sendSysMsg', 2)
	end;
})

local TestCaseActTowerExitHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.actTower = self.player:getActTower()
		self.hdr = ActTowerHdr():getHandler(4)	
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(ActTowerSender, 'sendExitTower')
		self.actTower:setStopTime(1000)
		self.actTower:setLeftLifes(1)
		self.actTower:setCurLayer(2)
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=24*3600, effect={id=RES_EFF.TOWER_RECOVER_SOLDIER,val=10,unit=1}}
		self.player:getStateContainer():appendState(stateRes, {type=0,id=0,skillId=0})
		assertEQ ( self.player:getStateContainer():hasEffectState(RES_EFF.TOWER_RECOVER_SOLDIER), true )
		self.hdr:handle(self.player)
		assertEQ ( self.actTower:getStopTime(), 0 )
		assertEQ ( self.actTower:getLeftLifes(), 0 )
		assertEQ ( self.actTower:getCurLayer(), 0 )
		assertEQ ( self.player:getStateContainer():hasEffectState(RES_EFF.TOWER_RECOVER_SOLDIER), false )
		assertEQ ( self.mm.params['sendExitTower'], {self.player} )
	end;
})

local TestCaseActTowerStartAutoFightHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActTowerHdr():getHandler(5)	
		TestCaseCondition:setPreCond(self.player, nil, { lineups={180001}, heros={{state=0,soldier={resid=150001001,number=1}},{state=1,soldier={resid=150001001,number=1}},{state=5,soldier={resid=150001001,number=1}} } })
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		Util:setTimeDrt(10000)
		self.mm:mock(HeroAttrSender, 'sendHerosState' )
		self.hdr:handle(self.player, {lineup=180001,count=5,hid1=1,hid2=2,hid3=3,hid4=0,hid5=0,toLayer=10})
		local hero1 = self.player:getHeroMgr():getHeroById(1)
		local hero2 = self.player:getHeroMgr():getHeroById(2)
		local hero3 = self.player:getHeroMgr():getHeroById(3)
		assertEQ ( hero1:getState(), 5)
		assertEQ ( hero2:getState(), 1)
		assertEQ ( hero3:getState(), 5)
		assertEQ ( self.mm.params['sendHerosState'], {self.player, {hero1} } )
		assertEQ ( self.player:getActTower():getAutoStartTime(), Util:getTime())
		assertEQ ( self.player:getActTower():getAutoToLayer(), 10)
	end;
})

local TestCaseActTowerStopAutoFightHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActTowerHdr():getHandler(6)	
		TestCaseCondition:setPreCond(self.player, nil, { lineups={180001}, heros={{state=5,soldier={resid=150001001,number=1}},{state=1,soldier={resid=150001001,number=1}},{state=5,soldier={resid=150001001,number=1}} } })
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.player:getActTower():setAutoStartTime(1000)
		self.mm:mock(HeroAttrSender, 'sendHerosState' )
		self.hdr:handle(self.player)
		local hero1 = self.player:getHeroMgr():getHeroById(1)
		local hero3 = self.player:getHeroMgr():getHeroById(3)
		assertEQ ( hero1:getState(), 0)
		assertEQ ( hero3:getState(), 0)
		assertEQ ( self.mm.params['sendHerosState'], {self.player, {hero1, hero3} } )
		assertEQ ( self.player:getActTower():getAutoStartTime(), 0)
	end;
})

TestCaseActToweSearchRoleForRankHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActTowerHdr():getHandler(7)	
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(app:getActTowerRank(), 'getIdxByName', nil, function(self, roleName)
			if roleName == 'unkown' then
				return -1
			else 
				return 13
			end
		end)
		
		self.mm:mock(ActTowerSender, 'sendRanks')
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		assertEQ ( self.hdr:handle(self.player, {role='unkown'}), false)
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100163, '"unkown"'} )
		
		self.mm:clear()
		assertEQ ( self.hdr:handle(self.player, {role='role'}), true)
		assertEQ ( self.mm.params['sendRanks'], {self.player, 2, 12, 1} )
	end;
})

TestCaseActTowerGetPageRankRolesHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActTowerHdr():getHandler(8)	
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(ActTowerSender, 'sendRanks')
		
		self.hdr:handle(self.player, {pageNo=1})
		assertEQ ( self.mm.params['sendRanks'], {self.player, 1, 12, -1} )
	end;
})

TestCaseActTowerCheckAutoFightHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ActTowerHdr():getHandler(9)	
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(ActTowerSender, 'sendInAutoFightState')
		self.player:getActTower():setAutoStartTime(0)
		self.hdr:handle(self.player, {})
		assertEQ ( self.mm.walkLog, '' )
		self.player:getActTower():setAutoStartTime(100000)
		self.hdr:handle(self.player, {})
		assertEQ ( self.mm.params['sendInAutoFightState'],  {self.player})
	end;
})


tqActTowerHdr_t_main = function(suite)
	suite:addTestCase(TestCaseActTowerHdr, 'TestCaseActTowerHdr')
	suite:addTestCase(TestActTowerGetBaseInfoHdr, 'TestActTowerGetBaseInfoHdr')
	suite:addTestCase(TestCaseActTowerEnterHdr, 'TestCaseActTowerEnterHdr')
	suite:addTestCase(TestCaseActTowerExpedHdr, 'TestCaseActTowerExpedHdr')
	suite:addTestCase(TestCaseActTowerExitHdr, 'TestCaseActTowerExitHdr')
	suite:addTestCase(TestCaseActTowerStartAutoFightHdr, 'TestCaseActTowerStartAutoFightHdr')
	suite:addTestCase(TestCaseActTowerStopAutoFightHdr, 'TestCaseActTowerStopAutoFightHdr')
	suite:addTestCase(TestCaseActToweSearchRoleForRankHdr, 'TestCaseActToweSearchRoleForRankHdr')
	suite:addTestCase(TestCaseActTowerGetPageRankRolesHdr, 'TestCaseActTowerGetPageRankRolesHdr')
	suite:addTestCase(TestCaseActTowerCheckAutoFightHdr, 'TestCaseActTowerCheckAutoFightHdr')
end;


