require('tqExpeditionTimerHdr')
require('tqTowerPlayer_t')

local TestCaseExpeditionTimerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testInitParam = function(self)
		local hdr = ExpeditionTimerHdr()
		assert ( hdr.fighted == nil )
		hdr:initParams({stopTime=0}, {}, {})
		assert ( hdr.fighted == 0 )
	end;
	
	testFight = function(self)
		local hdr = ExpedFightTimerHdr()
		assert ( hdr.fighted == nil )
		hdr:initParams({stopTime=0}, {}, {})
		hdr:fight()
		assert ( hdr.fighted == 1 )
	end;
})

local TestCaseExpedTimerHdrMgr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001,180002}, heros={{state=1,soldier={resid=150001010,number=10}},{state=1,soldier={resid=150002005,number=10}} } })
		self.army1 = TestArmyResHelper:createArmyEx(self.sourcePlayer, CopyFieldPlayer(171001), EXPED_TYPE.TAOFA, ARMYDYN_STATE.GOTO)
		self.army2 = TestArmyResHelper:createArmyEx(self.sourcePlayer, CopyFieldPlayer(171001), EXPED_TYPE.TAOFA, ARMYDYN_STATE.RETURN)
		
		
		clearSendMsg_t()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( ExpedTimerHdrMgr:getHandler(EXPED_TYPE.ACT_TOWER, OBJ_TYPE.ROLE, OBJ_TYPE.COPYFIELD):getClass(), ExpedFightActTowerTimerHdr )
		assertEQ ( ExpedTimerHdrMgr:getHandler(EXPED_TYPE.ACT_WORLDBOSS, OBJ_TYPE.ROLE, OBJ_TYPE.COPYFIELD):getClass(), ExpedFightWorldBossTimerHdr )
	end;
	
	testInvalidArmyId = function(self)
		TestCaseCondition:setPreCond(sourcePlayer, nil, {curtime= self.army1.stopTime})
		clearLastTimer_t()
		ExpedTimerHdrMgr:handle(self.army1.armyId + 10)
		assert ( getLastTimer_t().eventid < 0 )
	end;
	
	testInvalidStoptime = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {curtime=self.army1.stopTime - 5})
		clearLastTimer_t()
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		assert ( getLastTimer_t().eventid < 0 )
	end;
	
	testInvalidState = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {curtime=self.army2.stopTime})
		clearLastTimer_t()
		ExpedTimerHdrMgr:handle(self.army2.armyId)
		assert ( getLastTimer_t().eventid < 0 )
	end;
	
	testHandleOk = function(self)
		self.mm:mock(global.getTimer(), 'start')
		TestCaseCondition:setPreCond(self.player, nil, {curtime=self.army1.stopTime})
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		assert ( self.army1.state == ARMYDYN_STATE.RETURN )
		assertEQ ( self.mm.params['start'], {20*1000, {TIMER_EVT.EXPED_RETURN_STOP, self.army1.armyId}, app:getArmyMgr():getTimerCaller()} )
		assert ( selectSendMsgCnt_t("has@{cmd:74,armys:{list:%[{id:1,state:2,fighted:1,stopTime:") == 1 )
	end;
});

local TestCaseExpedFightTimerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseCondition:setPreCond(self.player, nil, { lineups={180001,180002}, heros={{level=11,state=1,soldier={resid=150001010,number=10}},{state=1,soldier={resid=150002001,number=1}} } })
		self.hero = self.player:getHeroMgr():getHeroById(1)
		self.hero:setName('hero')
		
		self.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200000)
		self.army1 = TestArmyResHelper:createArmyEx(CopyFieldPlayer(171001), self.targetPlayer, EXPED_TYPE.TAOFA, ARMYDYN_STATE.GOTO)
		self.army2 = TestArmyResHelper:createArmyEx(CopyFieldPlayer(171001), self.targetPlayer, EXPED_TYPE.TAOFA, ARMYDYN_STATE.RETURN)
		
		clearSendMsg_t()
		
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testCopyFieldToMy = function(self)
		local attackerActor = HeroActor()
		attackerActor:setId(1)
		attackerActor:setHero(self.hero)
		attackerActor:setPos(1,2)
		
		local defenderActor = HeroActor()
		defenderActor:setId(2)
		defenderActor:setHero(self.hero)
		defenderActor:setPos(3,4)
		
		local towerLevel = 1
		local towerPlayer = TestCaseTowerPlayer:createTowerPlayer(towerLevel)
		local attackerCamp = {player=towerPlayer, actors={attackerActor}}
		local defenderCamp = {player=CopyFieldPlayer(171001) , actors={defenderActor}}
		local hdr = ExpedFightTimerHdr().fightHdr
		hdr:pushFightStartEventStream(attackerCamp, defenderCamp)
		local streamEvent = hdr.stream:getEvent(0)
		assert ( streamEvent.event == 'fightstart' )
		assert ( streamEvent.attacker.role.objType == OBJ_TYPE.TOWER )
		assert ( streamEvent.defender.role.objType == OBJ_TYPE.COPYFIELD )
		
		assert ( streamEvent.attacker.actors[1].name == attackerActor:getName() )
		assert ( streamEvent.attacker.actors[1].id == attackerActor:getId() )
		assert ( streamEvent.attacker.actors[1].pos.x == attackerActor:getPos().x )
		assert ( streamEvent.attacker.actors[1].pos.y == attackerActor:getPos().y )
		assert ( streamEvent.attacker.actors[1].type == attackerActor:getType() )
		assert ( streamEvent.attacker.actors[1].resid == 0 )
		
		assert ( streamEvent.defender.actors[1].name == defenderActor:getName() )
		assert ( streamEvent.defender.actors[1].id == defenderActor:getId() )
		assert ( streamEvent.defender.actors[1].pos.x == defenderActor:getPos().x )
		assert ( streamEvent.defender.actors[1].pos.y == defenderActor:getPos().y )
		assert ( streamEvent.defender.actors[1].type == defenderActor:getType() )
		assert ( streamEvent.defender.actors[1].resid == 0 )
	end;
	
	testResetCityDefs = function(self)
		self.targetPlayer:getCityDef():setDefNumber(CITYDEF_TYPE.XIANJING, 10)
		
		local defenderCamp = {player=self.targetPlayer, actors={} }
		ArmyCampActorsGetter:createCityDefActors(self.targetPlayer, defenderCamp.actors)
		local lastInitNumber = defenderCamp.actors[1]:getInitNumber()
		defenderCamp.actors[1]:hurtEnd()
		defenderCamp.actors[1]:hurtEnd()
		defenderCamp.actors[1]:hurtEnd()
		defenderCamp.actors[1]:hurtEnd()
		
		local hdr = ExpedFightTimerHdr()
		hdr:resetCityDefs(defenderCamp)
		
		assert( defenderCamp.actors[1]:getInitNumber() < lastInitNumber )
	end;
	
	
	testInvalidArmyId = function(self)
		TestCaseCondition:setPreCond(self.targetPlayer, nil, {curtime=self.army1.stopTime})
		clearLastTimer_t()
		ExpedTimerHdrMgr:handle(-1 )
		assert ( getLastTimer_t().eventid < 0 )
	end;
	
	testInvalidStoptime = function(self)
		TestCaseCondition:setPreCond(self.targetPlayer, nil, {curtime=self.army1.stopTime-5})
		clearLastTimer_t()
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		assert ( getLastTimer_t().eventid < 0 )
	end;

	testInvalidState = function(self)
		TestCaseCondition:setPreCond(self.targetPlayer, nil, {curtime=self.army2.stopTime})
		clearLastTimer_t()
		ExpedTimerHdrMgr:handle(self.army2.armyId)
		assert ( getLastTimer_t().eventid < 0 )
	end;
	
	test_init = function(self)
		local hdr = ExpedFightTimerHdr()
		assertEQ ( hdr.refreshCurFieldsHdr:getClass(), RefreshCurFieldsHandler)
		assertEQ ( hdr.giveUpSelfFieldHdr:getClass(), GiveUpFieldHandler)
	end;
	
	test__removeArmyFromLastOwner = function(self)
		local hdr = ExpedFightTimerHdr()
		self.mm:mock(self.player:getArmyContainer(), 'removeArmyId')
		
		local army = {armyId=10}
		local defenderPlayer = FieldPlayer(2)
		local attackerCamp = {player=self.player}
		local defenderCamps = {{player=defenderPlayer}}
		hdr:initParams(army, attackerCamp, defenderCamps)
		
		hdr:_removeArmyFromLastOwner()
		assertEQ ( self.mm.walkLog, '' )
		
		defenderCamps[1].player = OwnerFieldPlayer(2)
		defenderCamps[1].player.objType = OBJ_TYPE.OWNERFIELD
		defenderCamps[1].player.ownerPlayer = self.player
		hdr:_removeArmyFromLastOwner()
		assertEQ ( self.mm.walkLog, 'removeArmyId' )
		assertEQ ( self.mm.params['removeArmyId'], {10} )
	end;
	
	test__lastOwnerGiveUpField = function(self)
		local hdr = ExpedFightTimerHdr()
		self.mm:mock(hdr.giveUpSelfFieldHdr, 'handle')
		self.mm:mock(hdr, '_sendLastOwnerGiveUpMail')
		
		local army = {name='army'}
		local defenderPlayer = FieldPlayer(2)
		local attackerCamp = {player=self.player}
		local defenderCamps = {{player=defenderPlayer}}
		hdr:initParams(army, attackerCamp, defenderCamps)
		
		hdr:_lastOwnerGiveUpField()
		assertEQ ( self.mm.walkLog, '' )
		
		defenderCamps[1].player = OwnerFieldPlayer(2)
		defenderCamps[1].player.objType = OBJ_TYPE.OWNERFIELD
		defenderCamps[1].player.ownerPlayer = self.player
		hdr:_lastOwnerGiveUpField()
		assertEQ ( self.mm.walkLog, 'handle,_sendLastOwnerGiveUpMail' )
		assertEQ ( self.mm.params['handle'], {self.player, {fieldId=2, collectReason=COLLECT_REASON.BEATTACKED}} )
		assertEQ ( self.mm.params['_sendLastOwnerGiveUpMail'], {self.player, 2} )
	end;
	
	test__sendLastOwnerGiveUpMail = function(self)
		local hdr = ExpedFightTimerHdr()
		local army = {name='army'}
		local attackerCamp = {player=TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)}
		local defenderCamps = {{player=OwnerFieldPlayer(2)}}
		hdr:initParams(army, attackerCamp, defenderCamps)
		
		self.mm:mock(app:getMailMgr(), 'addSysMail', {{name='mail'}})
		self.mm:mock(MailSender, 'sendBriefMail')
		
		hdr:_sendLastOwnerGiveUpMail(self.player, 2)
		assertEQ ( self.mm.walkLog, 'addSysMail,sendBriefMail' )
		local sourcePos = attackerCamp.player:getCityPos()
		local content = string.format(rstr.mail.content.beAttackedGiveUpField, 1, 0, attackerCamp.player:getRoleName(), sourcePos.x, sourcePos.y)
		assertEQ ( self.mm.params['addSysMail'], {self.player:getRoleName(), rstr.mail.title.beAttackedGiveUpField, FIXID.COMM_SYS_MAILTEMP, content} )
		assertEQ ( self.mm.params['sendBriefMail'], {self.player, {name='mail'}} )
	end;
	
	test_addToAttackerSelfFieldList = function(self)
		local hdr = ExpedFightTimerHdr()
		local army = {name='army'}
		local defenderPlayer = FieldPlayer(2)
		local attackerCamp = {player=self.player}
		local defenderCamps = {{player=defenderPlayer}}
		hdr:initParams(army, attackerCamp, defenderCamps)
		
		self.mm:mock(hdr.refreshCurFieldsHdr, 'handle')
		hdr:addToAttackerSelfFieldList()
		assertEQ ( self.mm.params['handle'], {self.player})
	end;
});

local TestCaseExpedPVETimerHdrBase = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001,180002}, heros={{level=11,state=1,soldier={resid=150001010,number=10}},{state=1,soldier={resid=150002001,number=1}} } })
		self.sourcePlayer:setLevel(1)
		self.hero1 = self.sourcePlayer:getHeroMgr():getHeroById(1)
		self.hero2 = self.sourcePlayer:getHeroMgr():getHeroById(2)
		self.hero1:setAttrVal(ATTR.HEALTH, 100)
		self.hero1:setAttrVal(ATTR.MO, 100)
		self.hero2:setAttrVal(ATTR.HEALTH, 100)
		self.hero2:setAttrVal(ATTR.MO, 100)
		self.hero1:setName('hero1')
		self.hero2:setName('hero2')
		
		self.army = TestArmyResHelper:createArmyEx(self.sourcePlayer, CopyFieldPlayer(171001), EXPED_TYPE.TAOFA, ARMYDYN_STATE.GOTO)
		self.army2 = TestArmyResHelper:createArmyEx(self.sourcePlayer, CopyFieldPlayer(171020), EXPED_TYPE.TAOFA, ARMYDYN_STATE.GOTO)
		
		res_drops={{roleexp={pro=100,maxnum=1,minnum=1},items={{pro=100,maxnum=2,id=FIXID.SALVE,minnum=2}},credit={pro=100,maxnum=3,minnum=3},heroexp={pro=100,maxnum=5,minnum=5},randtype=0,id=7500001}}
		res_citydefs={{juma=1,leishi=1,gunmu=1,nujian=1,walldef=2,wallhp=100,xianjing=1,id=1}}
		
		self.copyfieldRes = ItemResUtil:findItemres(171001)
		self.taofadrop_ = self.copyfieldRes.taofadrop
		self.fieldtaofadrop_ = self.copyfieldRes.fieldtaofadrop
		self.citydefid_ = self.copyfieldRes.citydefid
		self.copyfieldRes.taofadrop = 7500001
		self.copyfieldRes.fieldtaofadrop = 7500001
		self.copyfieldRes.citydefid = 1
		
		clearSendMsg_t()
		
		
		local g_mm = self.mm
		self.mm.sysMailCount = 0
		self.mm:mock(app:getMailMgr(), 'addSysMail', nil, function(self)  
			g_mm.sysMailCount = g_mm.sysMailCount + 1 
			end)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
		
		self.copyfieldRes.taofadrop = self.taofadrop_
		self.copyfieldRes.fieldtaofadrop = self.fieldtaofadrop_
		self.copyfieldRes.citydefid = self.citydefid_
	end;
})

local TestCaseExpedPVETimerHdr = TestCaseExpedPVETimerHdrBase:extends({
	checkSendMsg = function(self, armyId)
		local lastMsgIdx = getSendMsgCnt_t()
		assert ( isInclude(getSendMsg_t(lastMsgIdx-0), '{cmd:82,type:1,flag:0,msg:"#%[f:'..armyId..':') == true )
		assert ( isInclude(getSendMsg_t(lastMsgIdx-1), '{cmd:74,fightdemo:{id:'..armyId..',') == true )
		assert ( isInclude(getSendMsg_t(lastMsgIdx-2), '{cmd:74,armys:{list:' ) == true )
		assert ( isInclude(getSendMsg_t(lastMsgIdx-3), 'heros:', 'attrs:', tostring(ATTR.HEALTH), tostring(ATTR.MO) ) == true )
		assert ( isInclude(getSendMsg_t(lastMsgIdx-4), 'heros:', 'soldier:' ) == true )	
	end;
	
	testAttackerSuccess = function(self)
		local hero_cangetdrop_leveldrt_ = hero_cangetdrop_leveldrt
		hero_cangetdrop_leveldrt = 10
		self.mm:mock(global.getTimer(), 'start')
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army.stopTime})
		
		local hero1OldHealth = self.hero1:getAttrVal(ATTR.HEALTH)
		local hero2OldHealth = self.hero2:getAttrVal(ATTR.HEALTH)
		local hero1OldExp = self.hero1:getAttrVal(ATTR.XP)
		local hero2OldExp = self.hero2:getAttrVal(ATTR.XP)
		local hero1OldCre = self.hero1:getAttrVal(ATTR.CRE)
		local hero2OldCre = self.hero2:getAttrVal(ATTR.CRE)
		ExpedTimerHdrMgr:handle(self.army.armyId)
		assert ( self.army.state == ARMYDYN_STATE.RETURN )
		assertEQ ( self.mm.params['start'], {20*1000, {TIMER_EVT.EXPED_RETURN_STOP, self.army.armyId}, app:getArmyMgr():getTimerCaller()} )
		
		--add sys mail
		assert ( self.mm.sysMailCount == 1 )
		
		-- test drop item, exp, ...
		assert ( self.hero1:getAttrVal(ATTR.XP) == hero1OldExp )
		assert ( self.hero1:getAttrVal(ATTR.CRE) == hero1OldCre )
		assert ( self.hero2:getAttrVal(ATTR.XP) == hero2OldExp+5, '只有等级在 副本等级+9 之内的英雄才可以获得掉落'  )
		assert ( self.hero2:getAttrVal(ATTR.CRE) == hero2OldCre+3, '只有等级在 副本等级+9 之内的英雄才可以获得掉落'  )
		assert ( self.sourcePlayer:getPkg():getItemNumber(FIXID.SALVE) == 2 )
		assert ( self.sourcePlayer:getAttrVal(ATTR.XP) == 1 )
		
		-- sub health
		assert ( self.hero1:getAttrVal(ATTR.HEALTH) == hero1OldHealth - res_exped_low_expend_health)
		assert ( self.hero2:getAttrVal(ATTR.HEALTH) == hero2OldHealth - res_exped_low_expend_health)
		
		self:checkSendMsg(1) --armyid
		hero_cangetdrop_leveldrt = hero_cangetdrop_leveldrt_
	end;
	
	testAttackerFail = function(self)
		self.mm:mock(global.getTimer(), 'start')
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army2.stopTime})
		
		local hero2OldHealth = self.hero2:getAttrVal(ATTR.HEALTH)
		local hero2OldExp = self.hero2:getAttrVal(ATTR.XP)
		local hero2OldCre = self.hero2:getAttrVal(ATTR.CRE)
		local hero2SoldierNumber = self.hero2:getSoldier().number
		
		self.sourcePlayer:setState(ROLE_STATE.YOUNG)
		
		ExpedTimerHdrMgr:handle(self.army2.armyId)
		
		assert ( self.army2.state == ARMYDYN_STATE.RETURN )
		assertEQ ( self.mm.params['start'], {20*1000, {TIMER_EVT.EXPED_RETURN_STOP, self.army2.armyId}, app:getArmyMgr():getTimerCaller()} )
		
		--add sys mail
		assert ( self.mm.sysMailCount == 1 )
		
		-- test no drop item, exp, ...
		assert ( self.hero2:getAttrVal(ATTR.XP) == hero2OldExp )
		assert ( self.hero2:getAttrVal(ATTR.CRE) == hero2OldCre )
		assert ( self.sourcePlayer:getPkg():getItemNumber(FIXID.SALVE) == 0 )
		assert ( self.sourcePlayer:getAttrVal(ATTR.XP) == 0 )
		
		-- sub health
		assert ( self.hero2:getAttrVal(ATTR.HEALTH) == hero2OldHealth - res_exped_high_expend_health)
		
		-- is young, revive attacker player all soldier 
		assert ( self.hero2:getSoldier().number == hero2SoldierNumber )
		
		self:checkSendMsg(2) --armyid
	end;
})

local TestCaseExpedFightCopyFieldTimerHdr = TestCaseExpedPVETimerHdrBase:extends({
	test_attackerSuccessNotify = function(self)
		local mm = MMock()
		mm:mock( MilitarySender, 'sendSuccCopyFields' )
		mm:mock( TaskFinisher, 'trigerTask' )
		
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army.stopTime})
		ExpedTimerHdrMgr:handle(self.army.armyId)
		mm:restore()
		
		assert ( self.sourcePlayer:getsuccCopyFields():getCount() == 1 )
		assert ( self.sourcePlayer:getsuccCopyFields():get(0) == 171001 )
		assert ( mm.walkLog == 'trigerTask,sendSuccCopyFields' )
		assertListEQ ( mm.params['trigerTask'] , {self.sourcePlayer, TASK_FINISH_TYPE.TAOFA_COPYFIELD, 171001} )
		assertListEQ ( mm.params['sendSuccCopyFields'] , {self.sourcePlayer} )
	end;
})

local TestCaseExpedFightFieldTimerHdrBase = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		
		res_fields_level={
			{zhanlingdrop=7500002,level=1,icon=101,addstone=0,citydefid=1,dantiaodrop=7500001,addwood=0,gem=0,heros={7600001},addiron=0,lineup=180001,id=170001001,addfood=15,taofadrop=7500001}
			,{zhanlingdrop=7500002,level=2,icon=101,addstone=0,citydefid=1,dantiaodrop=7500001,addwood=0,gem=0,heros={7600035},addiron=0,lineup=180001,id=170001002,addfood=15,taofadrop=7500001}}
		
		GridsMgr.grids[1].objType = OBJ_TYPE.FIELD
		GridsMgr.grids[1].resId = 170001
		GridsMgr.grids[1].roleId = 0
		GridsMgr.grids[1].roleName = ''
		GridsMgr.grids[1].level = 1
		
		GridsMgr.grids[2].objType = OBJ_TYPE.FIELD
		GridsMgr.grids[2].resId = 170001
		GridsMgr.grids[2].roleId = 0
		GridsMgr.grids[2].roleName = ''
		GridsMgr.grids[2].level = 2
		
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001}, heros={{state=1,level=11,soldier={resid=150001010,number=20}} } })
		self.army1 = TestArmyResHelper:createArmyEx(self.sourcePlayer, FieldPlayer(1), EXPED_TYPE.ZHANLING, ARMYDYN_STATE.GOTO)
		self.army2 = TestArmyResHelper:createArmyEx(self.sourcePlayer, FieldPlayer(2), EXPED_TYPE.ZHANLING, ARMYDYN_STATE.GOTO)
		self.army3 = TestArmyResHelper:createArmyEx(self.sourcePlayer, FieldPlayer(2), EXPED_TYPE.DANTIAO, ARMYDYN_STATE.GOTO)
		
		self.dantiaoFieldHdr = ExpedTimerHdrMgr:getHandler(EXPED_TYPE.DANTIAO, OBJ_TYPE.ROLE, OBJ_TYPE.FIELD)
		self.zhanlingFieldHdr = ExpedTimerHdrMgr:getHandler(EXPED_TYPE.ZHANLING, OBJ_TYPE.ROLE, OBJ_TYPE.FIELD)
		
		
		clearSendMsg_t()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
})

local TestCaseExpedFightFieldTimerHdr = TestCaseExpedFightFieldTimerHdrBase:extends({
	testCannotFight_isSelfField = function(self)
		TestCaseHelper:addSelfField(self.sourcePlayer, {x=1, y=0})
		
		local methodMock = MethodMock()
		methodMock:mock(self.dantiaoFieldHdr, 'expedComplete', function(self) methodMock.completed = true end)
		
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army3.stopTime})
		ExpedTimerHdrMgr:handle(self.army3.armyId)
		methodMock:restore()
		
		assert ( methodMock.completed == nil )
	end;
	
	test_targetIsNotField = function(self)
		local methodMock = MethodMock()
		methodMock:mock(self.dantiaoFieldHdr, 'expedComplete', function(self) methodMock.completed = true end)

		TestCaseCondition:setPreCond(self.player, nil, {curtime=self.army3.stopTime})
		GridsMgr.grids[2].objType = OBJ_TYPE.NONE
		ExpedTimerHdrMgr:handle(self.army3.armyId)
		methodMock:restore()
		
		assert ( methodMock.completed == nil )
	end;
	
	testCannotFight_isAlliPlayerField = function(self)
		GridsMgr.grids[1].objType = OBJ_TYPE.ROLE
		GridsMgr.grids[1].resId = 0
		GridsMgr.grids[1].roleId = 10001
		GridsMgr.grids[1].roleName = 'friend_r'
		GridsMgr.grids[1].allianceId = 2
		
		GridsMgr.grids[2].objType = OBJ_TYPE.FIELD
		GridsMgr.grids[2].resId = 170001
		GridsMgr.grids[2].roleId = 10001
		GridsMgr.grids[2].roleName = ''

		GridsMgr:MapRoleIdToGridId(10001, 1)
		
		self.sourcePlayer:setAlliId(2)
		
		local methodMock = MethodMock()
		methodMock:mock(self.dantiaoFieldHdr, 'expedComplete', function(self) methodMock.completed = true end)
		
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army3.stopTime})
		ExpedTimerHdrMgr:handle(self.army3.armyId)
		methodMock:restore()
		
		assert ( methodMock.completed == nil )
	end;
	
	testCanFight = function(self)
		local methodMock = MethodMock()
		methodMock:mock(self.dantiaoFieldHdr, 'expedComplete', function(self) methodMock.completed = true end)
		methodMock:mock(TaskFinisher, 'trigerTask', function(self, player, doType, doVal1, doVal2, doVal3) 
			methodMock.player = player
			methodMock.doType = doType
			methodMock.doVal1 = doVal1
			methodMock.doVal2 = doVal2
			methodMock.doVal3 = doVal3
		end)

		TestCaseCondition:setPreCond(self.player, nil, {curtime=self.army3.stopTime})
		ExpedTimerHdrMgr:handle(self.army3.armyId)
		methodMock:restore()
		
		assert ( methodMock.completed == true )
		assert ( methodMock.player == self.sourcePlayer )
		assert ( methodMock.doType == TASK_FINISH_TYPE.DANTIAO_FIELD )
		assert ( methodMock.doVal1 == 2 )
	end;
})

local TestCaseExpedZhanlingFieldTimerHdr = TestCaseExpedFightFieldTimerHdrBase:extends({
	testIsCanNotFight_selfFieldFull = function(self)
		self.mm:mock(global.getTimer(), 'start')
		self.sourcePlayer:getSelfField():addField({gridId=1, resId=3, level=4})
		TestCaseCondition:setPreCond(self.targetPlayer, nil, {curtime=self.army1.stopTime})
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		
		assert ( self.army1.state == ARMYDYN_STATE.RETURN )
		assertEQ ( self.mm.params['start'], {20*1000, {TIMER_EVT.EXPED_RETURN_STOP, self.army1.armyId}, app:getArmyMgr():getTimerCaller()} )
	end;
	
	testHandleOk_Success = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask')
		assertEQ ( self.sourcePlayer:getHeroMgr():getHeroByIdx(0):getState(), HERO_STATE.EXPED )
 		TestCaseCondition:setPreCond(self.targetPlayer, nil, {curtime=self.army1.stopTime})
		clearLastTimer_t()
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		assert ( self.zhanlingFieldHdr.fightRet == FIGHT_RESULT.ATTACKSUCC )
		assertEQ ( self.sourcePlayer:getHeroMgr():getHeroByIdx(0):getState(), HERO_STATE.DISPATCHFIELD )
		
		assert ( self.army1.state == ARMYDYN_STATE.DISPATCH )
		assert ( getLastTimer_t().eventid < 0 )
		assert ( selectSendMsgCnt_t('has@{cmd:74,armys:{list:%[{id:1,state:3,fighted:1,stopTime:') == 2 )
		
		assert ( self.sourcePlayer:getSelfField():getCount() == 1 )
		assert ( selectSendMsgCnt_t('has@{cmd:'..NETCMD.SELFFIELD..',selffields:') == 1 )
		assertEQ ( self.mm.params['trigerTask'], {self.sourcePlayer, TASK_FINISH_TYPE.ZHANLING_FIELD, 1} )
	end;
	
	testHandleOk_Fail = function(self)
		self.mm:mock(global.getTimer(), 'start')
		TestCaseCondition:setPreCond(self.targetPlayer, nil, {curtime=self.army2.stopTime})
		ExpedTimerHdrMgr:handle( self.army2.armyId)
		assert ( self.zhanlingFieldHdr.fightRet == FIGHT_RESULT.ATTACKFAIL )
		
		assert ( self.army2.state == ARMYDYN_STATE.RETURN )
		assertEQ ( self.mm.params['start'], {20*1000, {TIMER_EVT.EXPED_RETURN_STOP, self.army2.armyId}, app:getArmyMgr():getTimerCaller()} )
	end;	
	
	test_attackerGetDropItems = function(self)
		local hdr = ExpedZhanlingFieldTimerHdr()
		local army = {name='army'}
		local defenderPlayer = FieldPlayer(2)
		local attackerCamp = {player=self.player}
		local defenderCamps = {{player=defenderPlayer}}
		hdr:initParams(army, attackerCamp, defenderCamps)
		
		self.mm:mock(hdr, 'collectCanGetDropAttackerActors', {{name='actors'}})
		self.mm:mock(DropItemUtil, 'handle')
		self.mm:mock(DropItemUtil, 'getLog', {'log'})
		hdr:attackerGetDropItems()
		assertEQ ( self.mm.params['collectCanGetDropAttackerActors'], {defenderPlayer:getRes().level} )
		assertEQ ( self.mm.params['handle'], {self.player, {name='actors'}, 'nil', defenderPlayer:getRes().zhanlingdrop} )
		assertEQ ( attackerCamp.dropLogs, 'log' )
	end;
})

local TestCaseExpedEVPTimerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		
		res_drops={{roleexp={pro=100,maxnum=1,minnum=1},items={{pro=100,maxnum=2,id=FIXID.SALVE,minnum=2}},credit={pro=100,maxnum=3,minnum=3},heroexp={pro=100,maxnum=5,minnum=5},randtype=0,id=7500002}}
		res_citydefs={{juma=1,leishi=1,gunmu=1,nujian=1,walldef=2,wallhp=100,xianjing=1,id=1}}
		self.copyfieldRes = ItemResUtil:findItemres(171001)
		self.fieldtaofadrop_ = self.copyfieldRes.fieldtaofadrop
		self.copyfieldRes.fieldtaofadrop = 7500002

		self.hdr = ExpedTimerHdrMgr:getHandler(EXPED_TYPE.TAOFA, OBJ_TYPE.COPYFIELD, OBJ_TYPE.ROLE)
		
		local sourcePlayer1 = CopyFieldPlayer(171001)
		local sourcePlayer2 = CopyFieldPlayer(171001)
		local sourcePlayer3 = CopyFieldPlayer(171015)
		
		self.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200000)
		-- set defend army, heros, city defend, wall
		TestCaseCondition:setPreCond(self.targetPlayer, nil, { lineups={180001}, heros={{state=0,level=11,soldier={resid=150001010,number=10}}, {state=0,level=10,soldier={resid=150001011,number=10}} } })
		self.hero1 = self.targetPlayer:getHeroMgr():getHeroById(1)
		self.hero2 = self.targetPlayer:getHeroMgr():getHeroById(2)
		self.hero1:setName('hero1')
		self.hero2:setName('hero2')	
		self.hero1:setAttrVal(ATTR.HEALTH, 100)
		self.hero2:setAttrVal(ATTR.HEALTH, 100)
		-- set  city defend, wall
		self.targetPlayer:getArmyContainer():setDefArmy(180001, {0,1,2,0,0})
		self.targetPlayer:getCityDef():setDefNumber(CITYDEF_TYPE.XIANJING, 1)
		-- set tower player
		TestCaseCondition:setPreCond(self.targetPlayer, nil, { builds={ {id=12,resid=FIXID.TOWERBUILD,level=1,state=0} } })
		-- assign tower soldier
		self.targetPlayer:getArmyContainer():setAllTowerSoldiers({{resid=150001010,number=10}})
		
		self.army1 = TestArmyResHelper:createArmyEx(sourcePlayer1, self.targetPlayer, EXPED_TYPE.TAOFA, ARMYDYN_STATE.GOTO)
		self.army2 = TestArmyResHelper:createArmyEx(sourcePlayer2, self.targetPlayer, EXPED_TYPE.TAOFA, ARMYDYN_STATE.RETURN)
		self.army3 = TestArmyResHelper:createArmyEx(sourcePlayer3, self.targetPlayer, EXPED_TYPE.TAOFA, ARMYDYN_STATE.GOTO)
		
		self.alliancePlayer = TestCaseHelper:loadPlayerByUserNameEx('alliance', 'alliance_r', 200001)
		-- add alliance player valid hero 
		TestCaseCondition:setPreCond(self.alliancePlayer, nil, { lineups={180001}, heros={{state=1,soldier={resid=150001010,number=10}},{state=1,soldier={resid=150002005,number=10}} } })		
		
		self.allianceArmy = TestArmyResHelper:createArmyEx(self.alliancePlayer, self.targetPlayer, EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.DISPATCH)
		
		clearSendMsg_t()
		
		
		local g_mm = self.mm
		self.mm.sysMailCount = 0
		self.mm:mock(app:getMailMgr(), 'addSysMail', nil, function(self)  
			g_mm.sysMailCount = g_mm.sysMailCount + 1 
			end)		
	end;
	
	tearDown = function(self)
		self.copyfieldRes.fieldtaofadrop = self.fieldtaofadrop_
		TestCaseHelper:restoreRes()
		TestCaseHelper:clearAll(self)
	end;
	
	testSendAttackerFightDemo = function(self)
		local methodMock = MethodMock()
		methodMock:mock(ExpedFightTimerHdr, 'sendPartyPlayer', function(self, player)
			methodMock.player = player
		end)
		ExpedFightTimerHdr.attackerCamp = {player = {}}
		ExpedFightTimerHdr:sendAttackerFightDemo()
		methodMock:restore()
		assert ( methodMock.player == ExpedFightTimerHdr.attackerCamp.player )
	end;
	
	testSendDefenderFightDemo = function(self)
		local defenderPlayer = {}
		local methodMock = MethodMock()
		methodMock:mock(ExpedFightTimerHdr, 'sendPartyPlayer', function(self, player)
			methodMock.player = player
		end)
		methodMock:mock(ExpedFightTimerHdr, 'getDefenderPlayer', function(self)
			return defenderPlayer
		end)
		
		ExpedFightTimerHdr:sendDefenderFightDemo()
		methodMock:restore()
		assert ( methodMock.player == defenderPlayer )
	end;
	
	testAttackerFail = function(self)
		local hero_cangetdrop_leveldrt_ = hero_cangetdrop_leveldrt
		hero_cangetdrop_leveldrt = 10
		
		self.mm:mock(global.getTimer(), 'start')
		local hero1OldExp = self.hero1:getAttrVal(ATTR.XP)
		local hero2OldExp = self.hero2:getAttrVal(ATTR.XP)
		local hero1OldCre = self.hero1:getAttrVal(ATTR.CRE)
		local hero2OldCre = self.hero2:getAttrVal(ATTR.CRE)
		
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army1.stopTime})
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		
		-- refresh army simpleHeros
		assert ( self.army1.simpleHeros[2].soldier.number == 0 )
		
		assert ( self.hdr.fightRet == FIGHT_RESULT.ATTACKFAIL )
		assertEQ ( self.mm.params['start'], {20*1000, {TIMER_EVT.EXPED_RETURN_STOP, self.army1.armyId}, app:getArmyMgr():getTimerCaller()} )

		--add sys mail, attacker-alliance, attacker-tower, attacker-defender
		assert ( self.mm.sysMailCount == 2 )
		
		-- test drop item, exp, ...
		assert ( self.hero1:getAttrVal(ATTR.XP) == hero1OldExp )
		assert ( self.hero1:getAttrVal(ATTR.CRE) == hero1OldCre )
		assert ( self.hero2:getAttrVal(ATTR.XP) == hero2OldExp+5 )
		assert ( self.hero2:getAttrVal(ATTR.CRE) == hero2OldCre+3 )
		assert ( self.targetPlayer:getPkg():getItemNumber(FIXID.SALVE) == 2 )
		assert ( self.targetPlayer:getAttrVal(ATTR.XP) == 1 )
		
		-- sub defender heros health
		assert ( self.hero1:getAttrVal(ATTR.HEALTH) == 100 )
		assert ( self.hero2:getAttrVal(ATTR.HEALTH) == 100 )
		
		-- sub defender alliance heros heath
		local alliHero = self.alliancePlayer:getHeroMgr():getHeroById(1)
		assert ( alliHero:getAttrVal(ATTR.HEALTH) == 100 )

		-- test send msg
		assert ( selectSendMsgCnt_t('has@{cmd:95,tower:{lineupId:180004,soldiers:') == 1 )
		
		assert ( selectSendMsgCnt_t('eq@{cmd:94,citydefs:[1,0,0,0,0]}') == 1 )
		
		assert ( selectSendMsgCnt_t('eq@{cmd:82,type:1,flag:0,msg:"#[f:1:1]"}') == 2 )
		
		assert ( selectSendMsgCnt_t('eq@{cmd:78,heros:[{id:2,attrs:{"2":{val:5,u:0}}}]}') == 1 )
		assert ( selectSendMsgCnt_t('has@{cmd:78,heros:%[{id:1,soldier:{resid:150001010,number:') == 2 )
		assert ( selectSendMsgCnt_t('has@{cmd:78,heros:%[{id:2,soldier:{resid:150001011,number:') == 1 )
		
		assert ( selectSendMsgCnt_t('has@{cmd:74,fightdemo:{id:1,fightId:1,mapId:9920002,actions:') == 2 )
		assert ( selectSendMsgCnt_t('eq@{cmd:74,armys:{list:[{id:1,state:2,fighted:1,stopTime:' .. self.army1.stopTime .. '}]}}') == 1 )
		
		hero_cangetdrop_leveldrt = hero_cangetdrop_leveldrt_
	end;
	
	testAttackerSuccess = function(self)
		self.mm:mock(global.getTimer(), 'start')
		local fightTime = self.army3.stopTime
		
		local hero1OldExp = self.hero1:getAttrVal(ATTR.XP)
		local hero2OldExp = self.hero2:getAttrVal(ATTR.XP)
		local hero1OldCre = self.hero1:getAttrVal(ATTR.CRE)
		local hero2OldCre = self.hero2:getAttrVal(ATTR.CRE)
		TestCaseCondition:setPreCond(self.targetPlayer, nil, {curtime=self.army3.stopTime})
		self.targetPlayer:setState(ROLE_STATE.FREE)
		ExpedTimerHdrMgr:handle(self.army3.armyId)
		assert ( self.hdr.fightRet == FIGHT_RESULT.ATTACKSUCC )
		assertEQ ( self.mm.params['start.1'], {20*1000, {TIMER_EVT.EXPED_RETURN_STOP, self.army3.armyId}, app:getArmyMgr():getTimerCaller()} )
		
		
		--add sys mail, attacker-alliance, attacker-tower, attacker-defender
		assert ( self.mm.sysMailCount == 4 )
		
		-- test defender not get drop item, exp, ...
		assert ( self.hero1:getAttrVal(ATTR.XP) == hero1OldExp )
		assert ( self.hero1:getAttrVal(ATTR.CRE) == hero1OldCre )
		assert ( self.hero2:getAttrVal(ATTR.XP) == hero2OldExp )
		assert ( self.hero2:getAttrVal(ATTR.CRE) == hero2OldCre )
		assert ( self.targetPlayer:getPkg():getItemNumber(FIXID.SALVE) == 0 )
		assert ( self.targetPlayer:getAttrVal(ATTR.XP) == 0 )
		
		assert (self.army3.state == ARMYDYN_STATE.RETURN)
		
		assert (self.allianceArmy.state == ARMYDYN_STATE.RETURN)
		local needTime = app:getArmyMgr():getArmyExpedNeedFullTime(self.allianceArmy.armyId)
		assert (self.allianceArmy.stopTime == fightTime+needTime) 
		assertEQ ( self.mm.params['start.2'], {20*1000, {TIMER_EVT.EXPED_RETURN_STOP, 4}, app:getArmyMgr():getTimerCaller()} )
			
		--refresh alliance refer army 
		assert ( self.allianceArmy.simpleHeros[1].soldier.number == 0 )
		assert ( self.allianceArmy.simpleHeros[2].soldier.number == 0 )
		
		-- revive defender tower soldier
		local towerPlayer = self.targetPlayer:getArmyContainer():getTowerPlayer()
		local towerArmy = self.targetPlayer:getArmyContainer():getTowerArmy()
		local heroMgr = towerPlayer:getHeroMgr()
		assert ( heroMgr:getHeroById(1):getSoldierNumber() == 2 );
		
		-- revive defender soldier
		assert ( self.hero1:getSoldierNumber() == 2 )
		assert ( self.hero2:getSoldierNumber() == 2 )
		
		-- sub defender heros health
		assert ( self.hero1:getAttrVal(ATTR.HEALTH) == 100 - res_exped_high_expend_health )
		assert ( self.hero2:getAttrVal(ATTR.HEALTH) == 100 - res_exped_high_expend_health )
		
		-- sub defender alliance heros heath
		local alliHero = self.alliancePlayer:getHeroMgr():getHeroById(1)
		assert ( alliHero:getAttrVal(ATTR.HEALTH) == 100 - res_exped_high_expend_health )
		
		--test alliance army msg
		assert ( selectSendMsgCnt_t('has@{cmd:74,armys:{list:%[{id:4,') == 4 )
	end;
	
	testAttackerSuccess_DefenderIsYoung = function(self)
		TestCaseCondition:setPreCond(self.targetPlayer, nil, {curtime=self.army3.stopTime})
		self.targetPlayer:setState(ROLE_STATE.YOUNG)
		
		ExpedTimerHdrMgr:handle(self.army3.armyId)
		
		-- revive defender young player soldier
		assert ( self.hero1:getSoldierNumber() == 10 )
		assert ( self.hero2:getSoldierNumber() == 10 )
	end;
})

local TestCaseExpedPVPTimerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ExpedPVPTimerHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_addAlliFlagToDefender = function(self)
		--self.hdr
	end;
})

local TestCasePVPBase = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		
		res_inbuild = {
			{stone=25,conds={{id=0,level=0},{id=0,level=0}},newsoldiers=0,money=0,hp=0,refreshtime=0,popunum=0,id=110001001,wood=15,food=0,iron=10,storesalve=0,ntime=120,storenum=100000,def=0},
			{addresoutper=0,stone=40,iron=5,conds={{id=110013,level=1}},money=0,addresstorenum=0,addinterior=0,addwallhpper=0,adddefspaceper=0,needpopu=0,food=0,wood=5,addresprotectnum=10,addsacrificetimes=0,ntime=20,id=110015001},
			{addresoutper=0,stone=40,iron=5,conds={{id=110013,level=1}},money=0,addresstorenum=0,addinterior=0,addwallhpper=0,adddefspaceper=0,needpopu=0,food=0,wood=5,addresprotectnum=20,addsacrificetimes=0,ntime=20,id=110015002},
			}
		
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001}, heros={{state=1,level=11,soldier={resid=150001010,number=100}} } })
		self.sourceHero = self.sourcePlayer:getHeroMgr():getHeroById(1)
		self.sourceHero:setAttrVal(ATTR.HEALTH, 100)
		self.sourceHero:setAttrVal(ATTR.MMO, 150)
		self.sourceHero:setAttrVal(ATTR.MO, 100)
		
		self.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200001)
		TestCaseCondition:setPreCond(self.targetPlayer, nil, { builds={ {id=10,resid=FIXID.DIJIAOBUILD,level=1,state=0} } })
		-- set four res and money
		self.targetPlayer:getCityRes():setMoney(10)
		self.targetPlayer:getCityRes():setFood(60)
		self.targetPlayer:getCityRes():setWood(70)
		self.targetPlayer:getCityRes():setStone(80)
		self.targetPlayer:getCityRes():setIron(90)
		-- set defend army, heros, city defend, wall
		TestCaseCondition:setPreCond(self.targetPlayer, nil, { lineups={180001}, heros={{state=0,level=11,soldier={resid=150001001,number=10}} } })
		self.targetPlayer:getHeroMgr():getHeroById(1):setName('hero')
		self.targetPlayer:getArmyContainer():setDefArmy(180001, {0,1,0,0,0})
		self.targetPlayer:getCityDef():setDefNumber(CITYDEF_TYPE.XIANJING, 1)
		-- set target hero health, morale
		self.targetHero = self.targetPlayer:getHeroMgr():getHeroById(1)
		self.targetHero:setAttrVal(ATTR.HEALTH, 100)
		self.targetHero:setAttrVal(ATTR.MMO, 150)
		self.targetHero:setAttrVal(ATTR.MO, 100)	
		
		--set refer between sourcePlayer and targetPlayer
		self.sourcePlayer:addDeclareState(self.targetPlayer:getRoleId()).state = REF_ROLESTATE.FIGHTING
		self.army1 = TestArmyResHelper:createArmyEx(self.sourcePlayer, self.targetPlayer, EXPED_TYPE.TAOFA, ARMYDYN_STATE.GOTO)
		self.army2 = TestArmyResHelper:createArmyEx(self.sourcePlayer, self.targetPlayer, EXPED_TYPE.CUIHUI, ARMYDYN_STATE.GOTO)
		self.army3 = TestArmyResHelper:createArmyEx(self.sourcePlayer, self.targetPlayer, EXPED_TYPE.TIAOXIN, ARMYDYN_STATE.GOTO)
		
		self.taoFaHdr = ExpedTimerHdrMgr:getHandler(EXPED_TYPE.TAOFA, OBJ_TYPE.ROLE, OBJ_TYPE.ROLE)
		self.cuiHuiHdr = ExpedTimerHdrMgr:getHandler(EXPED_TYPE.CUIHUI, OBJ_TYPE.ROLE, OBJ_TYPE.ROLE)
		
		clearSendMsg_t()
		
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
})

local TestCaseExpedPVPTiaoxinTimerHdr = TestCasePVPBase:extends({
	testAttackerSuccess = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask')
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army3.stopTime})
		ExpedTimerHdrMgr:handle(self.army3.armyId)
		
		-- add today taofa fight times
		assertEQ ( self.mm.params['trigerTask'], {self.sourcePlayer, TASK_FINISH_TYPE.PROVOKE_PLAYER} )
	end;
})

local TestCaseExpedPVPTaofaTimerHdr = TestCasePVPBase:extends({
	testAttackerSuccess = function(self)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army1.stopTime})
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		assert ( self.taoFaHdr.fightRet == FIGHT_RESULT.ATTACKSUCC )
		
		local money = 10/10
		local food = math.floor( (60 - 10) / 5 )
		local wood = math.floor( (70 - 10) / 5 )
		local stone = math.floor( (80 - 10) / 5 )
 		local iron = math.floor( (90 - 10) / 5 )
		local totalres = money + food + wood + stone + iron 
		
		local cap = self.sourceHero:getAttrVal(ATTR.FC)*320
		local getpre = math.min(1, cap/totalres)
		local gmoney = math.floor(getpre*money)
		local gfood = math.floor(getpre*food)
		local gwood = math.floor(getpre*wood)
		local gstone = math.floor(getpre*stone)
 		local giron = math.floor(getpre*iron)

		--defender loss res
		assert ( self.targetPlayer:getCityRes():getMoney() == 10 - gmoney )
		assert ( self.targetPlayer:getCityRes():getFood() == 60 - gfood )
		assert ( self.targetPlayer:getCityRes():getWood() == 70 - gwood )
		assert ( self.targetPlayer:getCityRes():getStone() == 80 - gstone )
		assert ( self.targetPlayer:getCityRes():getIron() == 90 - giron )
		
		--defender loss res log
		assert ( self.taoFaHdr:getDefenderCamp().lossRes.money == gmoney )
		assert ( self.taoFaHdr:getDefenderCamp().lossRes.food == gfood )
		assert ( self.taoFaHdr:getDefenderCamp().lossRes.wood == gwood )
		assert ( self.taoFaHdr:getDefenderCamp().lossRes.stone == gstone )
		assert ( self.taoFaHdr:getDefenderCamp().lossRes.iron == giron )
		
		-- attacker get res
		assert ( self.sourcePlayer:getCityRes():getMoney() == gmoney )
		assert ( self.sourcePlayer:getCityRes():getFood() == gfood )
		assert ( self.sourcePlayer:getCityRes():getWood() == gwood )
		assert ( self.sourcePlayer:getCityRes():getStone() == gstone )
		assert ( self.sourcePlayer:getCityRes():getIron() == giron )
		
		-- defender res send msg
		assert ( selectSendMsgCnt_t('eq@{cmd:'..NETCMD.CITYRES..',res:{cres:{food:50,wood:58,stone:66,iron:74}}}') == 1 )
		assert ( selectSendMsgCnt_t('eq@{cmd:'..NETCMD.CITYRES..',res:{money:{cur:9}}}') == 1 )
		
		-- attacker res send msg
		assert ( selectSendMsgCnt_t('eq@{cmd:'..NETCMD.CITYRES..',res:{cres:{food:10,wood:12,stone:14,iron:16}}}') == 1 )
		assert ( selectSendMsgCnt_t('eq@{cmd:'..NETCMD.CITYRES..',res:{money:{cur:1}}}') == 1 )
		
		-- sub attacker health
		assert ( self.sourceHero:getAttrVal(ATTR.HEALTH) == 100 - res_exped_low_expend_health )
		
		-- sub defender health
		assert ( self.targetHero:getAttrVal(ATTR.HEALTH) == 100 - res_exped_high_expend_health )
		
		-- add attacker morale
		assert ( self.sourceHero:getAttrVal(ATTR.MO) == 101 )
		
		-- sub defender morale
		assert ( self.targetHero:getAttrVal(ATTR.MO) == 99 )
	end;
	
	testAttackerFail = function(self)
		self.targetPlayer:getCityDef():setDefNumber(CITYDEF_TYPE.XIANJING, 1000000)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army1.stopTime})
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		assert ( self.taoFaHdr.fightRet == FIGHT_RESULT.ATTACKFAIL )
		
		-- sub attacker health
		assert ( self.sourceHero:getAttrVal(ATTR.HEALTH) == 100 - res_exped_high_expend_health )
		
		-- sub defender health
		assert ( self.targetHero:getAttrVal(ATTR.HEALTH) == 100 - res_exped_low_expend_health )
		
		-- add attacker morale
		assert ( self.sourceHero:getAttrVal(ATTR.MO) == 98 )
		
		-- sub defender morale
		assert ( self.targetHero:getAttrVal(ATTR.MO) == 101 )
	end;
	
	test_getProtectResNumber = function(self)
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=5,resid=FIXID.DIJIAOBUILD,level=1,state=0},{id=6,resid=FIXID.DIJIAOBUILD,level=2,state=0} } })
		local level1Res = ItemResUtil:findBuildLevelres(FIXID.DIJIAOBUILD, 1)
		local level2Res = ItemResUtil:findBuildLevelres(FIXID.DIJIAOBUILD, 2)
		assertEQ ( ExpedPVPTaofaTimerHdr():getProtectResNumber(self.player), level1Res.addresprotectnum + level2Res.addresprotectnum)
	end;
	
	test_attackerSuccess_countryFight = function(self)
		self.mm:mock(RoleBaseSender, 'send')
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army1.stopTime})
		self.sourcePlayer:setCityId(9900001)
		self.targetPlayer:setCityId(9900002)
		Util:setTimeDrt(1370516597)
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		assert ( self.taoFaHdr.fightRet == FIGHT_RESULT.ATTACKSUCC )
		assertEQ ( self.sourcePlayer:getCityHonor(), 3 )
		assertEQ ( self.sourcePlayer:getTodayGetHonor(), 3 )
		assertEQ ( self.targetPlayer:getTodayHasHonor(), res_today_init_has_honor - 3 )
		assertEQ ( self.mm.params['send'], {self.sourcePlayer, {'cityhonor'}} )
		assertEQ ( self.taoFaHdr:getDefenderCamp().lossRes.honor, 3 )
	end;
	
	test_attackerSuccess_countryFight_invalidLevel = function(self)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army1.stopTime})
		self.sourcePlayer:setCityId(9900001)
		self.targetPlayer:setCityId(9900002)
		Util:setTimeDrt(1370516597)
		self.sourcePlayer:setLevel(10)
		self.targetPlayer:setLevel(10+10)
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		assert ( self.taoFaHdr.fightRet == FIGHT_RESULT.ATTACKSUCC )
		assertEQ ( self.sourcePlayer:getCityHonor(), 0 )
	end;
	
	test_attackerSuccess_countryFight_defenderNoHasHonor = function(self)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army1.stopTime})
		self.sourcePlayer:setCityId(9900001)
		self.targetPlayer:setCityId(9900002)
		Util:setTimeDrt(1370516597)
		self.sourcePlayer:setLevel(10)
		self.targetPlayer:setLevel(10+9)
		self.targetPlayer:subTodayHasHonor(self.targetPlayer:getTodayHasHonor())
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		assert ( self.taoFaHdr.fightRet == FIGHT_RESULT.ATTACKSUCC )
		assertEQ ( self.sourcePlayer:getCityHonor(), 0 )
		assertEQ ( self.taoFaHdr:getDefenderCamp().lossRes.honor, nil )
	end;
	
	test_attackerSuccess_countryFight_attackerGetFullHonor = function(self)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army1.stopTime})
		self.sourcePlayer:setCityId(9900001)
		self.targetPlayer:setCityId(9900002)
		Util:setTimeDrt(1370516597)
		self.sourcePlayer:setLevel(10)
		self.targetPlayer:setLevel(10+9)
		self.sourcePlayer:addTodayGetHonor(res_today_max_get_honor)
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		assert ( self.taoFaHdr.fightRet == FIGHT_RESULT.ATTACKSUCC )
		assertEQ ( self.sourcePlayer:getCityHonor(), 0 )
		assertEQ ( self.taoFaHdr:getDefenderCamp().lossRes.honor, nil )
	end;
	
	test_attackerFail_countryFight = function(self)
		self.mm:mock(RoleBaseSender, 'send')
		self.targetPlayer:getCityDef():setDefNumber(CITYDEF_TYPE.XIANJING, 1000000)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army1.stopTime})
		self.sourcePlayer:setCityId(9900001)
		self.targetPlayer:setCityId(9900002)
		Util:setTimeDrt(1370516597)
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		assert ( self.taoFaHdr.fightRet == FIGHT_RESULT.ATTACKFAIL )
		assertEQ ( self.targetPlayer:getCityHonor(), 3 )
		assertEQ ( self.targetPlayer:getTodayGetHonor(), 0 )
		assertEQ ( self.targetPlayer:getTodayHasHonor(), res_today_init_has_honor - 3 )
		assertEQ ( self.mm.params['send'], {self.targetPlayer, {'cityhonor'}} )
		assertEQ ( self.taoFaHdr:getDefenderCamp().lossRes.honor, 3 )
	end;
	
	test_attackerFail_countryFight_invalidLevel = function(self)
		self.targetPlayer:getCityDef():setDefNumber(CITYDEF_TYPE.XIANJING, 1000000)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army1.stopTime})
		self.sourcePlayer:setCityId(9900001)
		self.targetPlayer:setCityId(9900002)
		Util:setTimeDrt(1370516597)
		self.sourcePlayer:setLevel(10)
		self.targetPlayer:setLevel(10+10)
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		assert ( self.taoFaHdr.fightRet == FIGHT_RESULT.ATTACKFAIL )
		assertEQ ( self.sourcePlayer:getCityHonor(), 0 )
		assertEQ ( self.targetPlayer:getCityHonor(), 0 )
	end;
	
	test_attackerFail_countryFight_defenderNoHasHonor = function(self)
		self.targetPlayer:getCityDef():setDefNumber(CITYDEF_TYPE.XIANJING, 1000000)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army1.stopTime})
		self.sourcePlayer:setCityId(9900001)
		self.targetPlayer:setCityId(9900002)
		Util:setTimeDrt(1370516597)
		self.sourcePlayer:setLevel(10)
		self.targetPlayer:setLevel(10+9)
		self.targetPlayer:subTodayHasHonor(self.targetPlayer:getTodayHasHonor())
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		assert ( self.taoFaHdr.fightRet == FIGHT_RESULT.ATTACKFAIL )
		assertEQ ( self.sourcePlayer:getCityHonor(), 0 )
		assertEQ ( self.targetPlayer:getCityHonor(), 0 )
	end;
	
	test_attackerFail_countryFight_defenderGetFullHonor = function(self)
		self.targetPlayer:getCityDef():setDefNumber(CITYDEF_TYPE.XIANJING, 1000000)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army1.stopTime})
		self.sourcePlayer:setCityId(9900001)
		self.targetPlayer:setCityId(9900002)
		Util:setTimeDrt(1370516597)
		self.sourcePlayer:setLevel(10)
		self.targetPlayer:setLevel(10+9)
		self.sourcePlayer:addTodayGetHonor(res_today_max_get_honor)
		self.targetPlayer:addTodayGetHonor(res_today_max_get_honor)
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		assert ( self.taoFaHdr.fightRet == FIGHT_RESULT.ATTACKFAIL )
		assertEQ ( self.sourcePlayer:getCityHonor(), 0 )
		assertEQ ( self.targetPlayer:getCityHonor(), 3 )
		assertEQ ( self.targetPlayer:getTodayGetHonor(), res_today_max_get_honor )
	end;
})

local TestCaseExpedPVPCuihuiTimerHdr = TestCasePVPBase:extends({
	testAttackerSuccess = function(self)
		local hdr = ExpedTimerHdrMgr:getHandler(EXPED_TYPE.CUIHUI, OBJ_TYPE.ROLE, OBJ_TYPE.ROLE)
		self.mm:mock(hdr, '_handleAllianceHonour')
		self.sourcePlayer:getCityRes():setBuildVal(10000)
		self.targetPlayer:getCityRes():setBuildVal(10000)
		
		self.sourcePlayer:getCityRes():setIdlePopu(0)
		self.targetPlayer:getCityRes():setIdlePopu(10)
		assert ( self.targetPlayer:getCityRes():getIdlePopu() == 10 )
		
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army2.stopTime})
		
		ExpedTimerHdrMgr:handle(self.army2.armyId)
		assert ( self.cuiHuiHdr.fightRet == FIGHT_RESULT.ATTACKSUCC )
		
		--defender loss popu number
		local lossPopu = 10/5
		assert ( self.targetPlayer:getCityRes():getIdlePopu() == 10 - lossPopu )
		assert ( self.cuiHuiHdr:getDefenderCamp().lossRes.popu == lossPopu )
		assert ( self.sourcePlayer:getCityRes():getIdlePopu() == lossPopu )
		assert ( selectSendMsgCnt_t('eq@{cmd:60,res:{popu:{idle:8}}}') == 1 )
		assert ( selectSendMsgCnt_t('eq@{cmd:60,res:{popu:{idle:2}}}') == 1 )
		
		--defender loss build value
		assert( self.targetPlayer:getCityRes():getBuildHurtVal() > 0 )
		assert( self.targetPlayer:getCityRes():getBuildHurtVal() ==  self.targetPlayer:getCityRes():getTodayLostedBuildVal() )
		assert ( selectSendMsgCnt_t('eq@{cmd:60,res:{buildval:{hurt:'..self.targetPlayer:getCityRes():getBuildHurtVal()..'}}}') == 1 )
		assertEQ ( self.mm.params['_handleAllianceHonour'], {self.targetPlayer:getCityRes():getTodayLostedBuildVal()} )
		
		-- sub attacker health
		assert ( self.sourceHero:getAttrVal(ATTR.HEALTH) == 100 - res_exped_low_expend_health )
		
		-- sub defender health
		assert ( self.targetHero:getAttrVal(ATTR.HEALTH) == 100 - res_exped_high_expend_health )
		
		-- add attacker morale
		assert ( self.sourceHero:getAttrVal(ATTR.MO) == 101 )
		
		-- sub defender morale
		assert ( self.targetHero:getAttrVal(ATTR.MO) == 99 )
	end;
	
	testAttackerFail = function(self)
		self.sourcePlayer:getCityRes():setBuildVal(10000)
		self.targetPlayer:getCityRes():setBuildVal(10000)
		
		self.targetPlayer:getCityDef():setDefNumber(CITYDEF_TYPE.XIANJING, 1000000)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army2.stopTime})
		ExpedTimerHdrMgr:handle(self.army2.armyId)
		assert ( self.cuiHuiHdr.fightRet == FIGHT_RESULT.ATTACKFAIL )
		
		-- sub attacker health
		assert ( self.sourceHero:getAttrVal(ATTR.HEALTH) == 100 - res_exped_high_expend_health )
		
		-- sub defender health
		assert ( self.targetHero:getAttrVal(ATTR.HEALTH) == 100 - res_exped_low_expend_health )
		
		-- add attacker morale
		assert ( self.sourceHero:getAttrVal(ATTR.MO) == 98 )
		
		-- sub defender morale
		assert ( self.targetHero:getAttrVal(ATTR.MO) == 101 )		
	end;
	
	test__handleAllianceHonour = function(self)
		local hdr = ExpedTimerHdrMgr:getHandler(EXPED_TYPE.CUIHUI, OBJ_TYPE.ROLE, OBJ_TYPE.ROLE)
		hdr.attackerCamp.player = self.sourcePlayer
		hdr.defenderCamps = {{player=self.targetPlayer}}

		self.mm:mock(app:getAlliMgr(), 'addAllianceEvent')
		hdr:_handleAllianceHonour(2001)
		assertEQ ( self.mm.walkLog, '' )
		
		local sourceAlliance = app:getAlliMgr():createAlliance(self.sourcePlayer, 'sourcealli', 's')
		sourceAlliance:setHonour(10000)
		self.sourcePlayer:setAlliId(sourceAlliance:getId())
		self.mm:clear()
		hdr:_handleAllianceHonour(2001)
		assertEQ ( self.mm.walkLog, '' )
		assertEQ ( sourceAlliance:getHonour(), 10000)
		
		local targetAlliance = app:getAlliMgr():createAlliance(self.targetPlayer, 'targetalli', 't')
		targetAlliance:setHonour(10000)
		self.targetPlayer:setAlliId(targetAlliance:getId())
		self.mm:clear()
		hdr:_handleAllianceHonour(2001)
		assertEQ ( self.mm.walkLog, 'addAllianceEvent,addAllianceEvent' )
		assertEQ ( sourceAlliance:getHonour(), 10000+2)
		assertEQ ( targetAlliance:getHonour(), 10000-2)
		assertEQ ( self.mm.params['addAllianceEvent.1'], {sourceAlliance, 'pkAttacker', {attacker=self.sourcePlayer:getRoleName(), defender=self.targetPlayer:getRoleName(), addHonour=2}} )
		assertEQ ( self.mm.params['addAllianceEvent.2'], {targetAlliance, 'pkDefender', {attacker=self.sourcePlayer:getRoleName(), defender=self.targetPlayer:getRoleName(), subHonour=2}} )
	end;
})

local TestCaseExpedPaiqianFieldTimerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001,180002}, heros={{level=11,state=1,soldier={resid=150001010,number=10}},{state=1,soldier={resid=150002001,number=1}} } })
		local targetPlayer = FieldPlayer(2)
		self.army1 = TestArmyResHelper:createArmyEx(self.sourcePlayer, targetPlayer, EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.GOTO)
		self.army2 = TestArmyResHelper:createArmyEx(self.sourcePlayer, targetPlayer, EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.GOTO)
		
		clearSendMsg_t()
				
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	setSelfArmyInField = function(self)
		self.army2.state = ARMYDYN_STATE.DISPATCH
	end;
	
	testPaiqianFail_NoSelfField = function(self)
		self.mm:mock(global.getTimer(), 'start')
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army1.stopTime})
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		
		assert ( self.army1.state == ARMYDYN_STATE.RETURN )
		assertEQ ( self.mm.params['start'], {20*1000, {TIMER_EVT.EXPED_RETURN_STOP, self.army1.armyId}, app:getArmyMgr():getTimerCaller()} )
	end;
	
	testPaiqianFail_HasSelfArmyInField = function(self)
		TestCaseHelper:addSelfField(self.sourcePlayer, {x=1, y=0})
		self:setSelfArmyInField()
		
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army1.stopTime})
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		
		assert ( self.army1.state == ARMYDYN_STATE.RETURN )
	end;
	
	testPaiqianOK = function(self)
		TestCaseHelper:addSelfField(self.sourcePlayer, {x=1, y=0})
		
		assertEQ ( self.sourcePlayer:getHeroMgr():getHeroByIdx(0):getState(), HERO_STATE.EXPED )
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, {curtime=self.army1.stopTime})
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		assertEQ ( self.sourcePlayer:getHeroMgr():getHeroByIdx(0):getState(), HERO_STATE.DISPATCHFIELD )
		
		assert ( self.army1.state == ARMYDYN_STATE.DISPATCH )
		assert ( self.army1.stopTime == Util:getTime() )
	end;
})

local TestCaseExpedPaiqianPlayerTimerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		
		self.alliancePlayer = TestCaseHelper:loadPlayerByUserNameEx('friend1', 'friend1_r', 200001)
		self.alliancePlayer2 = TestCaseHelper:loadPlayerByUserNameEx('friend2', 'friend2_r', 200002)
		self.alliancePlayer3 = TestCaseHelper:loadPlayerByUserNameEx('friend3', 'friend3_r', 200003)
		self.alliancePlayer4 = TestCaseHelper:loadPlayerByUserNameEx('friend4', 'friend4_r', 200004)
		self.alliancePlayer5 = TestCaseHelper:loadPlayerByUserNameEx('friend5', 'friend5_r', 200005)
		self.alliancePlayer6 = TestCaseHelper:loadPlayerByUserNameEx('friend6', 'friend6_r', 200006)
		
		self.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200000)
		
		self.army1 = TestArmyResHelper:createArmyEx(self.alliancePlayer, self.targetPlayer, EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.GOTO)
		self.army2 = TestArmyResHelper:createArmyEx(self.alliancePlayer2, self.targetPlayer, EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.GOTO)
		self.army3 = TestArmyResHelper:createArmyEx(self.alliancePlayer3, self.targetPlayer, EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.GOTO)
		self.army4 = TestArmyResHelper:createArmyEx(self.alliancePlayer4, self.targetPlayer, EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.GOTO)
		self.army5 = TestArmyResHelper:createArmyEx(self.alliancePlayer5, self.targetPlayer, EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.GOTO)
		self.army6 = TestArmyResHelper:createArmyEx(self.alliancePlayer6, self.targetPlayer, EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.GOTO)
	
		self.paiqianAlliHdr = ExpedTimerHdrMgr:getHandler(EXPED_TYPE.PAIQIAN, OBJ_TYPE.ROLE, OBJ_TYPE.ROLE)
		
		clearSendMsg_t()
		
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	setFullPaiqianArmys = function(self)
		self.army2.state = ARMYDYN_STATE.DISPATCH
		self.army3.state = ARMYDYN_STATE.DISPATCH
		self.army4.state = ARMYDYN_STATE.DISPATCH
		self.army5.state = ARMYDYN_STATE.DISPATCH
		self.army6.state = ARMYDYN_STATE.DISPATCH
	end;
	
	testPaiqianFail_differAlliance = function(self)
		self.mm:mock(global.getTimer(), 'start')
		self.targetPlayer:setAlliId(1)
		self.alliancePlayer:setAlliId(0)
		
		TestCaseCondition:setPreCond(self.targetPlayer, nil, {curtime=self.army1.stopTime})
		ExpedTimerHdrMgr:handle(self.army1.armyId)

		assert ( self.army1.state == ARMYDYN_STATE.RETURN )
		assertEQ ( self.mm.params['start'], {20*1000, {TIMER_EVT.EXPED_RETURN_STOP, self.army1.armyId}, app:getArmyMgr():getTimerCaller()} )
	end;
	
	testPaiqianFail_fullPaiqianArmys = function(self)
		self.targetPlayer:setAlliId(1)
		self.alliancePlayer:setAlliId(1)
		self:setFullPaiqianArmys()
		
		TestCaseCondition:setPreCond(self.targetPlayer, nil, {curtime=self.army1.stopTime})
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		
		assert ( self.army1.state == ARMYDYN_STATE.RETURN )
	end;
	
	testPaiqianOk = function(self)
		self.targetPlayer:setAlliId(1)
		self.alliancePlayer:setAlliId(1)
		
		TestCaseCondition:setPreCond(self.targetPlayer, nil, {curtime=self.army1.stopTime})
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		
		assert ( self.army1.state == ARMYDYN_STATE.DISPATCH )
		assert ( self.army1.stopTime == Util:getTime() )
		assert ( selectSendMsgCnt_t('eq@{cmd:74,armys:{list:[{id:1,state:3,fighted:0,stopTime:'..self.army1.stopTime..'}]}}') == 2 )
	end;
})

local TestCaseExpedDantiaoHasOwnerFieldTimerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		
		res_fields_level = {{zhanlingdrop=7500141,getiron=10000,level=1,getwood=20000,dantiaodrop=7500151,heros={7600001},getfood=30000,peardropid=7500161,getstone=40000,id=170001001},
								{zhanlingdrop=7500141,getiron=100000,level=2,getwood=200000,dantiaodrop=7500151,heros={7600001},getfood=300000,peardropid=7500161,getstone=400000,id=170001002}}
		res_drops={{roleexp={pro=0,maxnum=0,minnum=0},items={{pro=100,maxnum=1,id=3000085,minnum=1},{pro=100,maxnum=2,id=3000086,minnum=2},{pro=100,maxnum=1,id=3000087,minnum=1},{pro=100,maxnum=1,id=3000088,minnum=1},{pro=100,maxnum=1,id=3000089,minnum=1},{pro=100,maxnum=1,id=3000090,minnum=1},{pro=100,maxnum=1,id=3000091,minnum=1},{pro=0,maxnum=0,id=0,minnum=0},{pro=0,maxnum=0,id=0,minnum=0},{pro=0,maxnum=0,id=0,minnum=0}},credit={pro=0,maxnum=0,minnum=0},heroexp={pro=0,maxnum=0,minnum=0},randtype=0,id=7500161}}
		
		GridsMgr.grids[2].objType = OBJ_TYPE.FIELD
		GridsMgr.grids[2].resId = 170001
		GridsMgr.grids[2].roleId = 200001
		GridsMgr.grids[2].roleName = ''
		GridsMgr.grids[2].level = 1
		
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		self.ownerPlayer = TestCaseHelper:loadPlayerByUserNameEx('owner', 'owner_r', 200001)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001}, heros={{state=1,level=11,soldier={resid=150001010,number=10}} } })
		self.sourcePlayer:getHeroMgr():getHeroById(1):setName('sourceHero')
		
		self.army = TestArmyResHelper:createArmyEx(self.sourcePlayer, FieldPlayer(2), EXPED_TYPE.DANTIAO, ARMYDYN_STATE.GOTO)

		self.dantiaoOwnerFieldHdr = ExpedTimerHdrMgr:getHandler(EXPED_TYPE.DANTIAO, OBJ_TYPE.ROLE, OBJ_TYPE.OWNERFIELD)

		
		clearSendMsg_t()		
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	testEmptyTarget_succ = function(self)
		local methodMock = MethodMock()
		methodMock:mock(self.dantiaoOwnerFieldHdr, 'expedComplete', function(self) methodMock.completed = true end)

		TestCaseCondition:setPreCond(nil, nil, {curtime=self.army.stopTime})
		ExpedTimerHdrMgr:handle(self.army.armyId)
		methodMock:restore()
		
		assert ( self.dantiaoOwnerFieldHdr.fightRet == FIGHT_RESULT.ATTACKSUCC )
		assert ( methodMock.completed == true )
	end;
	
	testGetRes_succ = function(self) -- 不打断正在采集的
		local gridId = 2
		TestCaseCondition:setPreCond(self.ownerPlayer, nil, { lineups={180001}, heros={{state=1,level=1,soldier={resid=150001010,number=10}} } })
		self.ownerPlayer:getHeroMgr():getHeroById(1):setName('onwerHero')
		TestArmyResHelper:createArmy(self.ownerPlayer, FieldPlayer(gridId), EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.DISPATCH)
		self.ownerPlayer:getSelfField():addField({gridId=gridId, resId=170001})
		self.ownerPlayer:getSelfField():startCollect(gridId, 1)
		self.ownerPlayer:getPkg():setMaxGridsCnt(100)
		local arriveTime = self.army.stopTime + 3600
		self.army.stopTime = arriveTime
		
		local methodMock = MethodMock()
		methodMock:mock(self.dantiaoOwnerFieldHdr, 'isCanSeizeRes', function(self) return true end)
		methodMock:mock(math, 'random', function(self) return 1 end)
		
		TestCaseCondition:setPreCond(nil, nil, {curtime=self.army.stopTime})
		ExpedTimerHdrMgr:handle(self.army.armyId)
		methodMock:restore()
		
		assert ( self.dantiaoOwnerFieldHdr.fightRet == FIGHT_RESULT.ATTACKSUCC )

		assert ( self.ownerPlayer:getSelfField():getStartTime(gridId) == arriveTime )
		local seizeFood = self.sourcePlayer:getCityRes():getFood()
		local leftFood = self.ownerPlayer:getCityRes():getFood()
		assert ( seizeFood > 0 )
		assert ( leftFood > 0 )
		assert ( floatEQ(seizeFood/(seizeFood + leftFood), res_fight_ownerfield_getres_ratio/100) == true )

		assert( self.ownerPlayer:getPkg():getItemNumber(3000088) == 0 )
		assert( self.ownerPlayer:getPkg():getItemNumber(3000086) == 2 )
		assert( self.sourcePlayer:getPkg():getItemNumber(3000088) == 1 )
	end;
	
	testAddItems = function(self)
		self.player.objType = -1
		assert ( self.dantiaoOwnerFieldHdr:addItems(self.player, {}) == false, 'not role' )
		
		local g_items = {}
		local g_dictItemsToListItemsRt = {{}}
		local g_createRawItemsRt = {{}}
		local g_addItemsRt = {true}
		local g_mailRt = {{}}
		
		self.mm:mock(FieldCollector, 'dictItemsToListItems', g_dictItemsToListItemsRt)
		self.mm:mock(self.dantiaoOwnerFieldHdr.dropItem, 'createRawItems', g_createRawItemsRt)
		self.mm:mock(self.player:getPkg(), 'addItems', g_addItemsRt)
		self.mm:mock(app:getMailMgr(), 'addSysMail', g_mailRt)
		self.mm:mock(MailSender, 'sendBriefMail' )
		
		self.player.objType = OBJ_TYPE.ROLE
		assert ( self.dantiaoOwnerFieldHdr:addItems(self.player, g_items) == true )
		assert ( self.mm.walkLog == 'dictItemsToListItems,createRawItems' )
		assertListEQ ( self.mm.params['dictItemsToListItems'], {g_items} )
		assertListEQ ( self.mm.params['createRawItems'], {g_dictItemsToListItemsRt[1]} )
		
		self.mm:clear()
		g_createRawItemsRt[1] = {{},{}}
		assert ( self.dantiaoOwnerFieldHdr:addItems(self.player, g_items) == true )
		assert ( self.mm.walkLog == 'dictItemsToListItems,createRawItems,addItems' )
		assertListEQ ( self.mm.params['addItems'], {g_createRawItemsRt[1]} )
		
		self.mm:clear()
		g_addItemsRt[1] = false
		assert ( self.dantiaoOwnerFieldHdr:addItems(self.player, g_items) == true )
		assert ( self.mm.walkLog == 'dictItemsToListItems,createRawItems,addItems,addSysMail,sendBriefMail' )
		assertListEQ ( self.mm.params['addSysMail'], {self.player:getRoleName(), rstr.mail.title.dropitem, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.dropitem, g_createRawItemsRt[1]} )
		assertListEQ ( self.mm.params['sendBriefMail'], {self.player, g_mailRt[1]} )
	end;
	
	testCaijiGet_failed = function(self)
		local gridId = 2
		TestCaseCondition:setPreCond(self.ownerPlayer, nil, { lineups={180001}, heros={{state=1,level=15,soldier={resid=150001010,number=10}} } })
		TestArmyResHelper:createArmy(self.ownerPlayer, FieldPlayer(gridId), EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.DISPATCH)
		self.ownerPlayer:getSelfField():addField({gridId=gridId, resId=170001})
		self.ownerPlayer:getSelfField():startCollect(gridId, 1)
		local arriveTime = self.army.stopTime + 3600
		self.army.stopTime = arriveTime
		
		local methodMock = MethodMock()
		methodMock:mock(self.dantiaoOwnerFieldHdr, 'isCanSeizeRes', function(self) return true end)
		methodMock:mock(math, 'random', function() return 1 end)
		
		TestCaseCondition:setPreCond(nil, nil, {curtime=self.army.stopTime})
		ExpedTimerHdrMgr:handle(self.army.armyId)
		methodMock:restore()
		
		assert ( self.dantiaoOwnerFieldHdr.fightRet == FIGHT_RESULT.ATTACKFAIL )
	end;
})

TestCaseExpedZhanlingHasOwnerFieldTimerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		
		res_fields_level = {{zhanlingdrop=7500141,getiron=10000,level=1,getwood=20000,dantiaodrop=7500151,heros={7600001},getfood=30000,peardropid=7500161,getstone=40000,id=170001001},
								{zhanlingdrop=7500141,getiron=100000,level=2,getwood=200000,dantiaodrop=7500151,heros={7600001},getfood=300000,peardropid=7500161,getstone=400000,id=170001002}}
		res_drops={{roleexp={pro=0,maxnum=0,minnum=0},items={{pro=100,maxnum=1,id=3000085,minnum=1},{pro=100,maxnum=2,id=3000086,minnum=2},{pro=100,maxnum=1,id=3000087,minnum=1},{pro=100,maxnum=1,id=3000088,minnum=1},{pro=100,maxnum=1,id=3000089,minnum=1},{pro=100,maxnum=1,id=3000090,minnum=1},{pro=100,maxnum=1,id=3000091,minnum=1},{pro=0,maxnum=0,id=0,minnum=0},{pro=0,maxnum=0,id=0,minnum=0},{pro=0,maxnum=0,id=0,minnum=0}},credit={pro=0,maxnum=0,minnum=0},heroexp={pro=0,maxnum=0,minnum=0},randtype=0,id=7500161}}
		
		GridsMgr.grids[2].objType = OBJ_TYPE.FIELD
		GridsMgr.grids[2].resId = 170001
		GridsMgr.grids[2].roleId = 200001
		GridsMgr.grids[2].roleName = ''
		GridsMgr.grids[2].level = 1
		
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		self.ownerPlayer = TestCaseHelper:loadPlayerByUserNameEx('owner', 'owner_r', 200001)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001}, heros={{state=1,level=11,soldier={resid=150001010,number=10}} } })
		self.sourcePlayer:getHeroMgr():getHeroById(1):setName('sourceHero')
		
		self.army = TestArmyResHelper:createArmyEx(self.sourcePlayer, FieldPlayer(2), EXPED_TYPE.ZHANLING, ARMYDYN_STATE.GOTO)

		self.zhanlingOwnerFieldHdr = ExpedTimerHdrMgr:getHandler(EXPED_TYPE.ZHANLING, OBJ_TYPE.ROLE, OBJ_TYPE.OWNERFIELD)

		
		clearSendMsg_t()		
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	testZhanling_succ = function(self)
		local gridId = 2
		TestCaseCondition:setPreCond(self.ownerPlayer, nil, { lineups={180001}, heros={{state=1,level=1,soldier={resid=150001001,number=10}} } })
		self.ownerPlayer:getHeroMgr():getHeroById(1):setName('onwerHero')
		self.ownerArmy = TestArmyResHelper:createArmyEx(self.ownerPlayer, FieldPlayer(gridId), EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.DISPATCH)
		self.ownerPlayer:getSelfField():addField({gridId=gridId, resId=170001})
		self.ownerPlayer:getSelfField():startCollect(gridId, 1)
		self.ownerPlayer:getPkg():setMaxGridsCnt(100)
		local arriveTime = self.army.stopTime + 3600
		self.army.stopTime = arriveTime
		
		local methodMock = MethodMock()
		methodMock:mock(self.zhanlingOwnerFieldHdr, 'isCanSeizeRes', function(self) return true end)
		methodMock:mock(math, 'random', function(self) return 1 end)
		
		assertEQ ( self.sourcePlayer:getHeroMgr():getHeroByIdx(0):getState(), HERO_STATE.EXPED )
		TestCaseCondition:setPreCond(nil, nil, {curtime=self.army.stopTime})
		ExpedTimerHdrMgr:handle(self.army.armyId)
		methodMock:restore()
		assertEQ ( self.sourcePlayer:getHeroMgr():getHeroByIdx(0):getState(), HERO_STATE.DISPATCHFIELD )
		
		assert ( self.zhanlingOwnerFieldHdr.fightRet == FIGHT_RESULT.ATTACKSUCC )
		assert ( self.zhanlingOwnerFieldHdr:isNeedCurArmyStayWhenAttackSuccess() == true )
		assert ( self.ownerArmy.state == ARMYDYN_STATE.RETURN)
		assert ( self.ownerPlayer:getSelfField():getCount() == 0 )
		assert ( selectSendMsgCnt_t('eq@{cmd:96,selffields:[{id:2,_d:1}]}') == 1 )
		
		assert ( self.sourcePlayer:getSelfField():getCount() == 1 )
		assert ( self.army.state == ARMYDYN_STATE.DISPATCH )
		assert ( selectSendMsgCnt_t('eq@{cmd:96,selffields:[{id:2,resid:170001,level:1,startTime:0}]}') == 1 )
	end;
})

TestCaseExpedFightActTowerTimerHdr = TestCase:extends({
	setUp = function(self)
		TestHelperServerActEffectClear(app:getSvrAct())
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		self.hdr = ExpedTimerHdrMgr:getHandler(EXPED_TYPE.ACT_TOWER, OBJ_TYPE.ROLE, OBJ_TYPE.COPYFIELD)
		self:helper_exped()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	helper_exped = function(self)
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001}, heros={{state=1,level=11,soldier={resid=150001010,number=20}} } })
		self.army1 = TestArmyResHelper:createArmyEx(self.sourcePlayer, CopyFieldPlayer(171001), EXPED_TYPE.ACT_TOWER, ARMYDYN_STATE.GOTO)
		TestCaseCondition:setPreCond(self.player, nil, {curtime=self.army1.stopTime})
		ExpedTimerHdrMgr:handle(self.army1.armyId)
	end;
	
	test_isCanFight = function(self)
		assertEQ ( self.hdr:isCanFight(), true )
	end;
	
	test_attackerGetDropItems = function(self)
		self.mm:mock(DropItemUtil, 'handle')
		self.mm:mock(DropItemUtil, 'getLog', {{name='drop'}})
		self.hdr:attackerGetDropItems()
		assertEQ ( self.mm.params['handle'], {self.sourcePlayer, self.hdr.attackerCamp.actors, 'nil', 7500001, {heroExp={mult=1}}} )
		assertEQ ( self.hdr.attackerCamp.dropLogs, {name='drop'} )
		
		self.mm:clear()
		TestHelperServerActEffectClear(app:getSvrAct())
		TestHelperServerActEffectSet(app:getSvrAct(), SVR_TODAY_ACT_TYPE.ACT_TOWER_EXP_2)
		self.hdr:attackerGetDropItems()
		assertEQ ( self.mm.params['handle'], {self.sourcePlayer, self.hdr.attackerCamp.actors, 'nil', 7500001, {heroExp={mult=2}}} )

		self.mm:clear()
		TestHelperServerActEffectClear(app:getSvrAct())
		TestHelperServerActEffectSet(app:getSvrAct(), SVR_TODAY_ACT_TYPE.ACT_TOWER_EXP_3)
		self.hdr:attackerGetDropItems()
		assertEQ ( self.mm.params['handle'], {self.sourcePlayer, self.hdr.attackerCamp.actors, 'nil', 7500001, {heroExp={mult=3}}} )
		
		self.mm:clear()
		TestHelperServerActEffectClear(app:getSvrAct())
		self.sourcePlayer:setVipLevel(6)
		self.hdr:attackerGetDropItems()
		assertEQ ( self.mm.params['handle'], {self.sourcePlayer, self.hdr.attackerCamp.actors, 'nil', 7500001, {heroExp={mult=1.5}}} )
		
		self.mm:clear()
		TestHelperServerActEffectClear(app:getSvrAct())
		TestHelperServerActEffectSet(app:getSvrAct(), SVR_TODAY_ACT_TYPE.ACT_TOWER_EXP_2)
		TestHelperServerActEffectSet(app:getSvrAct(), SVR_TODAY_ACT_TYPE.ACT_TOWER_EXP_3)
		self.sourcePlayer:setVipLevel(6)
		self.hdr:attackerGetDropItems()
		assertEQ ( self.mm.params['handle'], {self.sourcePlayer, self.hdr.attackerCamp.actors, 'nil', 7500001, {heroExp={mult=(2 + 3 + 1.5)}}} )
	end;	
	
	test__afterAttackerSuccess = function(self)
		local params = {}
		self.hdr.observer_ = function(self, ty, value)
			table.insert(params, {ty=ty, value=value})
		end;
		
		local actor = self.hdr.attackerCamp.actors[1]
		actor:getHero():getSoldier().number = 0
		self.hdr:_afterAttackerSuccess()
		assertEQ ( params[1], {ty='fightResult', value=5} )
		assertEQ ( params[2], {ty='isSuccess', value=true} )
		assertEQ ( self.hdr.isCanSendMail_, false )
	end;
	
	test__afterAttackerFail = function(self)
		local params = {}
		self.hdr.observer_ = function(self, ty, value)
			table.insert(params, {ty=ty, value=value})
		end;
		
		local actor = self.hdr:getDefenderCamp().actors[1]
		actor:getHero():getSoldier().number = 0
		self.hdr:_afterAttackerFail()
		assertEQ ( params[1], {ty='fightResult', value=0} )
		assertEQ ( params[2], {ty='isSuccess', value=false} )
		assertEQ ( self.hdr.isCanSendMail_, false )
	end;
	
	test__getActorsFightCap = function(self)
		local actor = self.hdr.attackerCamp.actors[1]
		table.insert(self.hdr.attackerCamp.actors, actor)
		assertEQ ( self.hdr:_getActorsFightCap(self.hdr.attackerCamp.actors),  2*HeroAttrHelper:getFCAttrVal(actor:getHero()))
	end;
	
	test__getFightResult = function(self)
		assertEQ ( self.hdr:_getFightResult(0.1), 0 )
		assertEQ ( self.hdr:_getFightResult(0.2), 0 )
		assertEQ ( self.hdr:_getFightResult(0.21), 1 )
		assertEQ ( self.hdr:_getFightResult(0.4), 1 )
		assertEQ ( self.hdr:_getFightResult(0.41), 2 )
		assertEQ ( self.hdr:_getFightResult(0.6), 2 )
		assertEQ ( self.hdr:_getFightResult(0.61), 3 )
		assertEQ ( self.hdr:_getFightResult(0.8), 3 )
		assertEQ ( self.hdr:_getFightResult(0.81), 4 )
		assertEQ ( self.hdr:_getFightResult(1.0), 4 )
		assertEQ ( self.hdr:_getFightResult(1.1), 4 )
	end;
	
	test__getAppendAttackerRevivePre = function(self)
		self.hdr.attackerCamp = {player=self.player}
		assertEQ ( self.hdr:_getAppendAttackerRevivePre(), 0.8 )
		
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=24*3600, effect={id=RES_EFF.TOWER_RECOVER_SOLDIER,val=10,unit=1}}
		self.player:getStateContainer():appendState(stateRes, {type=0,id=0,skillId=0})
		
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=24*3600, effect={id=RES_EFF.TOWER_RECOVER_SOLDIER_BYACT,val=5,unit=1}}
		self.player:getStateContainer():appendState(stateRes, {type=0,id=0,skillId=0})
		
		assertFloatEQ ( self.hdr:_getAppendAttackerRevivePre(), 0.95 )
	end;
})

TestCaseExpedFightWorldBossTimerHdr = TestCase:extends({
	setUp = function(self)
		TestHelperServerActEffectClear(app:getSvrAct())
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		self.hdr = ExpedTimerHdrMgr:getHandler(EXPED_TYPE.ACT_WORLDBOSS, OBJ_TYPE.ROLE, OBJ_TYPE.COPYFIELD)
		self:helper_exped()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	helper_exped = function(self)
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001}, heros={{state=1,level=11,soldier={resid=150001010,number=20}} } })
		self.army1 = TestArmyResHelper:createArmyEx(self.sourcePlayer, CopyFieldPlayer(171001), EXPED_TYPE.ACT_WORLDBOSS, ARMYDYN_STATE.GOTO)
		TestCaseCondition:setPreCond(self.player, nil, {curtime=self.army1.stopTime})
		ExpedTimerHdrMgr:handle(self.army1.armyId)	
	end;	
	
	test_isCanFight = function(self)
		assertEQ ( self.hdr:isCanFight(), true )
	end;
	
	test_attackerGetDropItems = function(self)
		self.mm:mock(DropItemUtil, 'handle')
		self.mm:mock(DropItemUtil, 'getLog', {{name='drop'}})
		self.hdr:attackerGetDropItems()
		assertEQ ( self.mm.params['handle'], {self.sourcePlayer, self.hdr.attackerCamp.actors, 'nil', 7500001} )
		assertEQ ( self.hdr.attackerCamp.dropLogs, {name='drop'} )
	end;	
	
	test_getAppendAttackerRevivePre = function(self)
		assertEQ ( self.hdr:_getAppendAttackerRevivePre(), 1.0 )
	end;
	
	helper_afterAttacker = function(self, before, after, isSuccess, msg)
		local params = {}
		self.hdr.observer_ = function(self, ty, value)
			table.insert(params, {ty=ty, value=value})
		end;
		
		local actor = self.hdr:getDefenderCamp().actors[1]
		actor:setAttrVal(ATTR.HP, actor:getAttrVal(ATTR.MHP) - 10.1)
		self.hdr[before](self.hdr)
		self.hdr[after](self.hdr)
		assertEQ ( params[1], {ty='fightResult', value=10}, msg )
		assertEQ ( params[2], {ty='isSuccess', value=isSuccess}, msg )
		assertEQ ( self.hdr.isCanSendMail_, false, msg )	
		assertEQ ( self.hdr.isCanSendFightDemoTip_, false, msg )	
	end;

	test_afterAttackerSuccess = function(self)
		self:helper_afterAttacker('_beforeAttackerSuccess', '_afterAttackerSuccess', true, 'afterAttackerSuccess')
	end;	
	
	test_afterAttackerFail = function(self)
		self:helper_afterAttacker('_beforeAttackerFail', '_afterAttackerFail', false, 'afterAttackerFail')
	end;
	
	test_resetAttackerAttr = function(self)
		local oldAttackerAttrHU = self:helper_getAttackerActorAttr(ATTR.HU)
		local oldAttackerAttrDE = self:helper_getAttackerActorAttr(ATTR.DE)
		
		self.hdr.attackerCamp.player:getTask():getWorldBoss():setGuwuLevel(2)
		self:helper_exped()
		
		local attrVal = self:helper_getAttackerActorAttr(ATTR.HU)
		assertEQ ( attrVal, oldAttackerAttrHU*(1+2*0.1) )
		
		local attrVal = self:helper_getAttackerActorAttr(ATTR.DE)
		assertEQ ( attrVal, oldAttackerAttrDE*(1+2*0.1) )
		
		assertEQ ( self:helper_getAttackerActor():getAttackRange(), 1000000 )
	end;
	
	test_resetDefenderAttr = function(self)
		assertEQ ( self:helper_getDefenderActor():getAttackRange(), 1000000 )
		assertEQ ( self:helper_getDefenderActor():getSoldierModelResId(), 150300 )
	end;
	
	helper_getDefenderActor = function(self)
		return  self.hdr:getDefenderCamp().actors[1]
	end;
	
	helper_getAttackerActor = function(self)
		return self.hdr.attackerCamp.actors[1]
	end;
	
	helper_getAttackerActorAttr = function(self, attrId)
		local guwuLevel = self.hdr.attackerCamp.player:getTask():getWorldBoss():getGuwuLevel()
		local actor = self.hdr.attackerCamp.actors[1]
		return actor:getAttrVal(attrId)
	end;
})

TestCaseExpedFightActTerraceTimerHdr = TestCase:extends({
	setUp = function(self)
		TestHelperServerActEffectClear(app:getSvrAct())
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		self.hdr = ExpedTimerHdrMgr:getHandler(EXPED_TYPE.ACT_TERRACE, OBJ_TYPE.ROLE, OBJ_TYPE.COPYFIELD)
		
		local res = ItemResUtil:findItemres(171001)
		res.dantiaodrop = 7500001
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001}, heros={{state=1,level=100,soldier={resid=150001001,number=1}} } })
		self.army1 = TestArmyResHelper:createArmyEx(self.sourcePlayer, CopyFieldPlayer(171001), EXPED_TYPE.ACT_TERRACE, ARMYDYN_STATE.GOTO)
		TestCaseCondition:setPreCond(self.player, nil, {curtime=self.army1.stopTime})
		ExpedTimerHdrMgr:handle(self.army1.armyId)
		
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001}, heros={{state=1,level=1,soldier={resid=150001001,number=1}} } })
		self.army2 = TestArmyResHelper:createArmyEx(self.sourcePlayer, CopyFieldPlayer(171001), EXPED_TYPE.ACT_TERRACE, ARMYDYN_STATE.GOTO)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	test_isCanFight = function(self)
		assertEQ ( self.hdr:isCanFight(), true )
	end;
	
	test_attackerGetDropItems = function(self)
		self.mm:mock(DropItemUtil, 'handle')
		self.mm:mock(DropItemUtil, 'getLog', {{name='drop'}})
		self.hdr:attackerGetDropItems()
		assertEQ ( self.mm.params['handle'], {self.sourcePlayer, self.hdr.attackerCamp.actors, 'nil', 7500001, {heroIForce={mult=1}}} )
		assertEQ ( self.hdr.attackerCamp.dropLogs, {name='drop'} )
		
		self.mm:clear()
		TestHelperServerActEffectClear(app:getSvrAct())
		TestHelperServerActEffectSet(app:getSvrAct(), SVR_TODAY_ACT_TYPE.ACT_TERRACE_IF_2)
		self.hdr:attackerGetDropItems()
		assertEQ ( self.mm.params['handle'], {self.sourcePlayer, self.hdr.attackerCamp.actors, 'nil', 7500001, {heroIForce={mult=2}}} )

		self.mm:clear()
		TestHelperServerActEffectClear(app:getSvrAct())
		TestHelperServerActEffectSet(app:getSvrAct(), SVR_TODAY_ACT_TYPE.ACT_TERRACE_IF_3)
		self.hdr:attackerGetDropItems()
		assertEQ ( self.mm.params['handle'], {self.sourcePlayer, self.hdr.attackerCamp.actors, 'nil', 7500001, {heroIForce={mult=3}}} )
	end;
	
	test__afterAttackerSuccess = function(self)
		local params = {}
		self.hdr.observer_ = function(self, ty, value)
			table.insert(params, {ty=ty, value=value})
		end;
		
		self.hdr:_afterAttackerSuccess()
		assertEQ ( params[1], {ty='fightResult', value=5} )
		assertEQ ( params[2], {ty='isSuccess', value=true} )
		assertEQ ( self.hdr.isCanSendMail_, false )
	end;
	
	test__afterAttackerFail = function(self)
		ExpedTimerHdrMgr:handle(self.army2.armyId)
		
		local params = {}
		self.hdr.observer_ = function(self, ty, value)
			table.insert(params, {ty=ty, value=value})
		end;
		
		self.hdr:_afterAttackerFail()
		assertEQ ( params[1], {ty='fightResult', value=0} )
		assertEQ ( params[2], {ty='isSuccess', value=false} )
		assertEQ ( self.hdr.isCanSendMail_, false )
	end;
	
	test__getFightResult = function(self)
		assertEQ ( self.hdr:_getFightResult(0.1), 1 )
		assertEQ ( self.hdr:_getFightResult(0.2), 1 )
		assertEQ ( self.hdr:_getFightResult(0.21), 2 )
		assertEQ ( self.hdr:_getFightResult(0.4), 2 )
		assertEQ ( self.hdr:_getFightResult(0.41), 3 )
		assertEQ ( self.hdr:_getFightResult(0.6), 3 )
		assertEQ ( self.hdr:_getFightResult(0.61), 4 )
		assertEQ ( self.hdr:_getFightResult(0.8), 4 )
		assertEQ ( self.hdr:_getFightResult(0.81), 5 )
		assertEQ ( self.hdr:_getFightResult(1.0), 5 )
		assertEQ ( self.hdr:_getFightResult(1.1), 5 )
	end;
})

tqExpeditionTimerHdr_t_main = function(suite)
	suite:addTestCase(TestCaseExpeditionTimerHdr, 'TestCaseExpeditionTimerHdr')
	suite:addTestCase(TestCaseExpedTimerHdrMgr, 'TestCaseExpedTimerHdrMgr')
	suite:addTestCase(TestCaseExpedFightTimerHdr, 'TestCaseExpedFightTimerHdr')
	suite:addTestCase(TestCaseExpedPVETimerHdr, 'TestCaseExpedPVETimerHdr')
	suite:addTestCase(TestCaseExpedFightCopyFieldTimerHdr, 'TestCaseExpedFightCopyFieldTimerHdr')
	suite:addTestCase(TestCaseExpedFightFieldTimerHdr, 'TestCaseExpedFightFieldTimerHdr')
	suite:addTestCase(TestCaseExpedEVPTimerHdr, 'TestCaseExpedEVPTimerHdr')
	suite:addTestCase(TestCaseExpedPVPTimerHdr, 'TestCaseExpedPVPTimerHdr')
	suite:addTestCase(TestCaseExpedPVPTiaoxinTimerHdr, 'TestCaseExpedPVPTiaoxinTimerHdr')
	suite:addTestCase(TestCaseExpedPVPTaofaTimerHdr, 'TestCaseExpedPVPTaofaTimerHdr')
	suite:addTestCase(TestCaseExpedPVPCuihuiTimerHdr, 'TestCaseExpedPVPCuihuiTimerHdr')
	suite:addTestCase(TestCaseExpedPaiqianFieldTimerHdr, 'TestCaseExpedPaiqianFieldTimerHdr')
	suite:addTestCase(TestCaseExpedPaiqianPlayerTimerHdr, 'TestCaseExpedPaiqianPlayerTimerHdr')
	suite:addTestCase(TestCaseExpedZhanlingFieldTimerHdr, 'TestCaseExpedZhanlingFieldTimerHdr')
	suite:addTestCase(TestCaseExpedDantiaoHasOwnerFieldTimerHdr, 'TestCaseExpedDantiaoHasOwnerFieldTimerHdr')
	suite:addTestCase(TestCaseExpedZhanlingHasOwnerFieldTimerHdr, 'TestCaseExpedZhanlingHasOwnerFieldTimerHdr')
	suite:addTestCase(TestCaseExpedFightActTowerTimerHdr, 'TestCaseExpedFightActTowerTimerHdr')
	suite:addTestCase(TestCaseExpedFightWorldBossTimerHdr, 'TestCaseExpedFightWorldBossTimerHdr')
	suite:addTestCase(TestCaseExpedFightActTerraceTimerHdr, 'TestCaseExpedFightActTerraceTimerHdr')
end;

