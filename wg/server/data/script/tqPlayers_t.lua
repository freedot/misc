require('tqDefs')
require('tqStrategyHandler')
require('tqPlayers')

local TestCasePlayer = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		self.bak_res_rolelevelexps = res_rolelevelexps
		res_rolelevelexps={{id=1,needexp=1,level=1,maxps=10}
			,{id=2,needexp=100,level=2,maxps=20}
			,{id=3,needexp=120,level=3,maxps=30}
			,{id=4,needexp=140,level=4,maxps=40}}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		res_rolelevelexps = self.bak_res_rolelevelexps
	end;
	
	testIsRole = function(self)
		assert ( self.player:isRole() == true )
	end;
	
	helper_createAlliances = function(self, alliName, alliFlag, userName, roleName, roleId)
		local player = TestCaseHelper:loadPlayerByUserNameEx(userName, roleName, roleId )
		local alliance = app:getAlliMgr():createAlliance(player, alliName, alliFlag)
		player:setAlliId(alliance:getId())
		local mem = alliance:getMemberById(player:getRoleId())
		return {
			player = player,
			alliance = alliance,
			mem = mem,
		}
	end;
	
	test_exitAlliance_setAlliIdZero = function(self)
		local r = self:helper_createAlliances('alli1', 'a', 'user1', 'role1', 100000)
		assertEQ ( r.player:getAlliId(), r.alliance:getId() )
		assertEQ ( r.player:getAlliId() > 0, true )
		r.player:exitAlliance(r.mem)
		assertEQ ( r.player:getAlliId(), 0 )
	end;
	
	test_exitAlliance_returnContributeCard = function(self)
		self.mm:mock(app:getMailMgr(), 'addSysMail', {'mail'})
		self.mm:mock(MailSender, 'sendBriefMail' )
		local r = self:helper_createAlliances('alli1', 'a', 'user1', 'role1', 100000)
		r.mem:setContributes(100)
		r.player:exitAlliance(r.mem)
		assertEQ ( self.mm.walkLog, '' )
		
		r.mem:setContributes(1100)
		r.player:exitAlliance(r.mem)
		local rawItems = DropItem():createRawItems({{resid=FIXID.ALLI_CONTRIB_CARD,number=math.floor((1100*0.6)/100)}})
		assertEQ ( self.mm.params['addSysMail'], {'role1', rstr.mail.title.exitAlliReturnContrib, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.exitAlliReturnContrib, rawItems} )
		assertEQ ( self.mm.params['sendBriefMail'], {r.player, 'mail'} )
	end;
	
	test_exitAlliance_returnItems = function(self)
		self.mm:mock(app:getMailMgr(), 'addSysMail', {'mail'})
		self.mm:mock(MailSender, 'sendBriefMail' )
		self.mm:mock(AllianceSender, 'sendSelfContributes')
		
		local r1 = self:helper_createAlliances('alli1', 'a', 'user1', 'role1', 100001)
		local r2 = self:helper_createAlliances('alli2', 'b', 'user2', 'role2', 100002)
		
		r1.alliance:getItemPkg():addItem({id=1, resid=5000043, num=10, sptime=10000, cur=1000, seller='unkown', buyer='role2'})
		r1.alliance:getItemPkg():addItem({id=2, resid=5000043, num=10, sptime=10000, cur=1000, seller='role1', buyer='unkown'})
		r1.player:exitAlliance(r1.mem)
		local rawItems = DropItem():createRawItems({{resid=5000043,number=10}})
		assertEQ ( self.mm.walkLog, 'addSysMail,sendBriefMail' )
		assertEQ ( self.mm.params['addSysMail'], {'role1', rstr.mail.title.returnSellItemWhenExitAlli, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.returnSellItemWhenExitAlli, rawItems} )
		assertEQ ( self.mm.params['sendBriefMail'], {r1.player, 'mail'} )
		assertEQ ( r1.alliance:getItemPkg():getItemCount(), 1 )
		assertEQ ( r1.alliance:getItemPkg():getItemById(2), nil )
		
		----
		self.mm:clear()
		r1.alliance:getItemPkg():removeItemByIdx(0)
		r1.player:setAlliId(r1.alliance:getId())
		assertEQ ( r1.alliance:getItemPkg():getItemCount(), 0 )
		
		r1.alliance:getItemPkg():addItem({id=1, resid=5000043, num=10, sptime=10000, cur=1000, seller='unkown', buyer='role2'})
		r1.alliance:getItemPkg():addItem({id=2, resid=5000043, num=10, sptime=10000, cur=1000, seller='role1', buyer='role2'})
		r1.player:exitAlliance(r1.mem)
		assertEQ ( r2.mem:getContributes(), 1000 )
		assertEQ ( self.mm.walkLog, 'addSysMail,sendBriefMail,sendSelfContributes,addSysMail,sendBriefMail' )
		assertEQ ( self.mm.params['addSysMail.1'], {'role2', rstr.mail.title.returnContributeWhenExitAlli, FIXID.COMM_SYS_MAILTEMP, string.format(rstr.mail.content.returnContributeWhenExitAlli, 1000)} )
		assertEQ ( self.mm.params['sendBriefMail.1'], {r2.player, 'mail'} )
		assertEQ ( self.mm.params['sendSelfContributes'], {r2.player, r2.alliance} )
	end;
	
	test_isDied = function(self)
		self.player:setCityGrid(nil)
		assertEQ ( self.player:isDied(), false )
		
		self.player:setCityGrid({objType=OBJ_TYPE.ROLE})
		assertEQ ( self.player:isDied(), false )
		
		self.player:setCityGrid({objType=OBJ_TYPE.DIED_ROLE})
		assertEQ ( self.player:isDied(), true )
	end;
	
	test_getVipLevel = function(self)
		assertEQ ( self.player:getVipLevel(), 0 )
		self.player:setVipLevel(1)
		assertEQ ( self.player:getVipLevel(), 1 )
	end;
	
	test_checkUpgradeVipLevel = function(self)
		self.mm:mock(MoneySender, 'sendAll')
		self.mm:mock(PkgMiscSender, 'send:send1')
		self.mm:mock(AutoBuildSender, 'sendInfo')
		self.mm:mock(RoleBaseSender, 'send:send2')
		self.mm:mock(self.player:getCitys(), 'handleAutoBuilds')
		assertEQ ( self.player:getVipLevel(), 0 )
		self.player:getTask():getPayAct():addGold(200)
		self.player:checkUpgradeVipLevel()
		assertEQ ( self.player:getVipLevel(), 1 )
		assertStrRepeatCount ( self.mm.walkLog, 'handleAutoBuilds', 1 );
		assertEQ ( self.player:getFriendMgr():getMaxCount(), 100 )
		assertEQ ( self.mm.params['sendAll'], {self.player} )
		assertEQ ( self.mm.params['send1'], {self.player, {'maxgrids'}} )
		assertEQ ( self.mm.params['sendInfo'], {self.player} )
		assertEQ ( self.mm.params['send2'], {self.player, {'vip'}} )
		
		self.mm:clear()
		self.player:getTask():getPayAct():addGold(201)
		self.player:checkUpgradeVipLevel()
		assertEQ ( self.player:getVipLevel(), 1 )
		assertEQ ( self.player:getFriendMgr():getMaxCount(), 100 )
		assertEQ ( self.mm.walkLog, '' )
		
		self.player:getTask():getPayAct():addGold(800)
		self.player:checkUpgradeVipLevel()
		assertEQ ( self.player:getVipLevel(), 3 )
		assertEQ ( self.player:getFriendMgr():getMaxCount(), 100+30 )
		assertEQ ( self.player:getPkg():getItemNumber(3000267), 1 )
		assertEQ ( self.player:getPkg():getItemNumber(3000268), 1 )
		assertEQ ( self.player:getPkg():getItemNumber(3000269), 1 )
	end;
	
	test_recalRoleAppendAttrs = function(self)
		self.mm:mock(RoleAttrSender, 'sendAttrsByIds')
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=4,resid=FIXID.SITUSHU,level=1,state=0} } })
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=5,resid=FIXID.SITUSHU,level=2,state=0} } })
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=6,resid=FIXID.SIMASHU,level=1,state=0} } })
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=7,resid=FIXID.SIMASHU,level=2,state=0} } })
		self.player:recalRoleAppendAttrs()
		assertEQ ( self.player:getAttrVal(ATTR.IN_A), 3 )
		assertEQ ( self.player:getAttrVal(ATTR.FOR_A), 3 )
		assertEQ ( self.mm.params['sendAttrsByIds'], {self.player, {ATTR.IN_A, ATTR.FOR_A}} )
	end;
	
	test_appendYoungEffectStateWhenSetState = function(self)
		self.player:getStateContainer():stopState(RES_EFF.YOUNG_STATE)
		assertEQ ( self.player:getStateContainer():hasEffectState(RES_EFF.YOUNG_STATE), false )
		self.player:setState(ROLE_STATE.FREE)
		assertEQ ( self.player:getStateContainer():hasEffectState(RES_EFF.YOUNG_STATE), false )
		self.player:setState(ROLE_STATE.YOUNG)
		assertEQ ( self.player:getStateContainer():hasEffectState(RES_EFF.YOUNG_STATE), true )
		local state = self.player:getStateContainer():getEffectState(RES_EFF.YOUNG_STATE)
		assertEQ ( state:getDuration(), res_young_days*24*3600 )
	end;
	
	test_removeYoungEffectStateWhenSetState = function(self)
		self.player:setState(ROLE_STATE.YOUNG)
		assertEQ ( self.player:getStateContainer():hasEffectState(RES_EFF.YOUNG_STATE), true )
		self.player:setState(ROLE_STATE.FREE)
		assertEQ ( self.player:getStateContainer():hasEffectState(RES_EFF.YOUNG_STATE), false )
		
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=res_young_days*24*3600, effect={id=RES_EFF.YOUNG_STATE, val=0, unit=0}}
		local creator = {type=0,id=0,skillId=0}
		self.player:getStateContainer():appendState(stateRes, creator)
		self.player:setState(ROLE_STATE.FREE)
		assertEQ ( self.player:getStateContainer():hasEffectState(RES_EFF.YOUNG_STATE), true )
	end;
	
	test_addDeclareState = function(self)
		self.mm:mock(self.player:getFightRefStateObj(), 'addDeclareState', {{name='node'}})
		assertEQ ( self.player:addDeclareState(10000), {name='node'})
		assertEQ ( self.mm.params['addDeclareState'], {10000} )
	end;
	
	test_isFullFightRefState = function(self)
		local r_isFull = {false}
		self.mm:mock(self.player.fightRefState, 'isFull', r_isFull)
		assertEQ ( self.player:isFullFightRefState(), false )
		r_isFull[1] = true
		assertEQ ( self.player:isFullFightRefState(), true )
	end;
	
	test_getFightRefStateObj = function(self)
		assertEQ ( self.player:getFightRefStateObj(), self.player.fightRefState )
	end;
	
	test_getObjType = function(self)
		assert ( self.player:getObjType() == OBJ_TYPE.ROLE )
	end;
	
	test_setChatLastTime = function(self)
		assertEQ ( self.player:getChatLastTime(CHAT_TARGET.WORLD), 0 )
		self.player:setChatLastTime(CHAT_TARGET.WORLD, 10)
		assertEQ ( self.player:getChatLastTime(CHAT_TARGET.WORLD), 10 )
	end;
	
	test_setLastGetFieldsTimeMs = function(self)
		assert ( self.player:getLastGetFieldsTimeMs() == 0 )
		self.player:setLastGetFieldsTimeMs(1)
		assert ( self.player:getLastGetFieldsTimeMs() == 1 )
	end;
	
	test_setLastGetFieldsPos = function(self)
		assert ( self.player:getLastGetFieldsPos().x == MAX_CITYMAP_W )
		assert ( self.player:getLastGetFieldsPos().y == MAX_CITYMAP_H )
		self.player:setLastGetFieldsPos(1,2)
		assert ( self.player:getLastGetFieldsPos().x == 1 )
		assert ( self.player:getLastGetFieldsPos().y == 2 )
	end;
	
	test_clear = function(self)
		self.mm:mock(global.getTimer(), 'clearCaller' )
		self.player:clear()
		assertEQ ( self.mm.params['clearCaller'], {self.player:getTimerCaller():getId()} )
	end;
	
	test_isOffline = function(self)
		assert ( self.player:isOffline() == false )
		
		self.player:setGameState(EGUS_OFFLINE_INGAME)
		
		assert ( self.player:isOffline() == true )
	end;
	
	test_getTask = function(self)
		assertEQ ( self.player:getTask():getClass(), PlayerTask )
	end;
	
	test_setEnemyAlliId = function(self)
		self.player:setEnemyAlliId(1)
		assert ( self.player.cityGrid.enemyAlliId == 1 )
	end;
	
	test_getBuildLevelByResId = function(self)
		local r_builds = {{}}
		local r_city = self.player:getCitys():getCityById(1)
		self.mm:mock(r_city, 'getBuildsByResId', r_builds )
		
		local p_resid = 110002
		assertEQ ( r_city:getBuildLevelByResId(p_resid), 0 )
		assertEQ ( self.mm.params['getBuildsByResId'], {p_resid} )
		
		r_builds[1] = {{ucLevel=1},{ucLevel=3},{ucLevel=2}}
		assertEQ ( r_city:getBuildLevelByResId(p_resid), 3 )
	end;
	
	test_setAttrVal = function(self)
		self.mm:mock(self.player, '_onAttrValChange')
		self.player:setAttrVal(ATTR.FOR_B, 100)
		assertEQ ( self.player:getAttrVal(ATTR.FOR_B), 100 )
		assertEQ ( self.mm.params['_onAttrValChange'], {ATTR.FOR_B} )
		
		self.mm:clear()
		self.player:setAttrVal(ATTR.FOR_B+100, 100)
		assertEQ ( self.mm.walkLog, '' )
	end;
	
	test__onAttrValChange = function(self)
		self.mm:mock(self.player, '_recalHerosAttrs')
		self.player:_onAttrValChange(ATTR.FOR_B+100)
		assertEQ ( self.mm.walkLog, '' )
		
		self.mm:clear()
		self.player:_onAttrValChange(ATTR.FOR_B)
		assertEQ ( self.mm.walkLog, '_recalHerosAttrs' )
		
		self.mm:clear()
		self.player:_onAttrValChange(ATTR.FOR_A)
		assertEQ ( self.mm.walkLog, '_recalHerosAttrs' )
	end;
	
	test__recalHerosAttrs = function(self)
		self.mm:mock(HeroAttrHelper, 'recalcAttrs')
		self.player:_recalHerosAttrs()
		assertEQ ( self.mm.walkLog, 'recalcAttrs' )
		assertEQ ( self.mm.params['recalcAttrs'], {self.player, self.hero} )
	end;
	
	testPlayerAlliId = function(self)
		assert( self.player:getAlliId() ~= nil )
	end;
	
	testTodayFightTimes = function(self)
		Util:setTimeDrt(0)
		self.player:setTodayFightTimes({taofa=1,cuihui=2,tiaoxin=3,fightowner=4})
		assert(self.player:getTodayFightTimes().taofa == 1)
		assert(self.player:getTodayFightTimes().cuihui == 2)
		assert(self.player:getTodayFightTimes().tiaoxin == 3)
		assert(self.player:getTodayFightTimes().fightowner == 4)
		
		Util:setTimeDrt(24*3600+1)
		assert(self.player:getTodayFightTimes().taofa == 0)
		assert(self.player:getTodayFightTimes().cuihui == 0)
		assert(self.player:getTodayFightTimes().tiaoxin == 0)
		
		self.player:setTodayFightTimes({taofa=10,cuihui=20,tiaoxin=30, fightowner=40})
		assert(self.player:getTodayFightTimes().taofa == 10)
		assert(self.player:getTodayFightTimes().cuihui == 20)
		assert(self.player:getTodayFightTimes().tiaoxin == 30)
		assert(self.player:getTodayFightTimes().fightowner == 40)
		
		self.player:setTodayFightTimes({taofa=-1,cuihui=1,tiaoxin=2,fightowner=3})
		assert(self.player:getTodayFightTimes().taofa == 10)
		assert(self.player:getTodayFightTimes().cuihui == 20)
		assert(self.player:getTodayFightTimes().tiaoxin == 30)
		assert(self.player:getTodayFightTimes().fightowner == 40)
	end;
	
	testPlayerIdlePopu = function(self)
		local farm = self.player:getFarm()
		local citys = self.player:getCitys()
		local cres = self.player:getCityRes()
		cres:setLevel(1)
		assert( cres:getILastTime() == 0 )
		
		cres:setIdlePopu(10)
		assert( cres:getIdlePopu() == 10)
		
		Util:setTimeDrt(1)
		cres:refreshIdlePopu()
		assert( cres:getIdlePopu() == 10 + math.floor(1*res_idlepopu_output*citys:getMaxPopu()) )
		
		Util:setTimeDrt(1000000000)
		cres:refreshIdlePopu()
		assert( cres:getIdlePopu() == (citys:getMaxPopu() - farm:getWorkforce()) )
		
		farm.getWorkforce = function() return citys:getMaxPopu() + 100 end;
		assert( cres:getIdlePopu() == -100 )
	end;
	
	testPlayerPopu = function(self)
		local cres = self.player:getCityRes()
		local farm = self.player:getFarm()
		cres:setIdlePopu(1)
		assert( cres:getIdlePopu() == 1)
		assert((farm:getWorkforce() + cres:getIdlePopu()) == 1)
	end;
	
	testPlayerMaxPopu = function(self)
		local citys = self.player:getCitys()
		assert( citys:getMaxPopu() > 0 )
	end;
	
	testPlayerMoneyBaseOutput = function(self)
		local farm = self.player:getFarm()
		farm:seedBlock({id=1,resid=FIXID.FARM,level=1,state=0})
		local cres = self.player:getCityRes()
		cres:setIdlePopu(100)
		assert(cres:getMoneyOutput() == math.floor((farm:getWorkforce()+ 100)*1))
	end;
	
	testPlayerMoney = function(self)
		Util:setTimeDrt(3600)
		local farm = self.player:getFarm()
		farm:seedBlock({id=1,resid=FIXID.FARM,level=1,state=0})
		local cres = self.player:getCityRes()
		cres:setIdlePopu(100)
		cres:setTax(1.2)
		cres:refreshMoney()
		assert(cres:getMoney() == cres:getMoneyOutput()*1)
	end;
	
	testPlayerMaxMoney = function(self)
		local citys = self.player:getCitys()
		assert(citys:getMaxMoney() > 0 )
		local cres = self.player:getCityRes()
		cres:setMoney( citys:getMaxMoney()+100 )
		assert( cres:getMoney() == (citys:getMaxMoney()+100) )
	end;
	
	testPlayerAddMoney = function(self)
		local cres = self.player:getCityRes()
		local citys = self.player:getCitys()
		cres:addMoney(100+citys:getMaxMoney())
		assert( 100+citys:getMaxMoney() == cres:getMoney() )
	end;
	
	testPlayerSubMoney = function(self)
		local cres = self.player:getCityRes()
		local citys = self.player:getCitys()
		cres:addMoney(citys:getMaxMoney())
		cres:subMoney(citys:getMaxMoney() + 100)
		assert( cres:getMoney() == 0 )
	end;
	
	testPlayerRefreshMoney = function(self)
		Util:setTimeDrt(0)
		local cres = self.player:getCityRes()
		local citys = self.player:getCitys()
		cres:setIdlePopu(1)
		
		Util:setTimeDrt(3600)
		cres:refreshMoney()
		assert(cres:getMoney() == 1)
		
		Util:setTimeDrt(3600*2)
		cres:refreshMoney()
		assert(cres:getMoney() == 2)

		Util:setTimeDrt(3600*citys:getMaxMoney())
		cres:refreshMoney()
		assert(cres:getMoney() == citys:getMaxMoney())
		
		Util:setTimeDrt(3600*(citys:getMaxMoney()+1))
		cres:refreshMoney()
		assert(cres:getMoney() == citys:getMaxMoney())
		
		cres:addMoney(1)
		assert( cres:getMoney() == (citys:getMaxMoney() + 1) )
		Util:setTimeDrt(3600*(citys:getMaxMoney()+100))
		cres:refreshMoney()
		assert( cres:getMoney() == (citys:getMaxMoney() + 1), 'if cur money beyond maxmoney, refresh not add new money' )
		assert( cres:getMLastTime() == 3600*(citys:getMaxMoney()+100), 'if cur money beyond maxmoney, refresh only reset lasttime' )
	end;
	
	testPlayerFormatMoney = function(self)
		local citys = self.player:getCitys()
		local cres = self.player:getCityRes()
		cres:setMoney(10*citys:getMaxMoney())
		cres:setMLastTime(Util:getTime())
		cres:cutMoney()
		assert(cres:getMoney() == citys:getMaxMoney())
	end;
	
	testPlayerCityFarm = function(self)
		local farm = self.player:getFarm()
		assert(farm:getWorkforce() == 0 )
	end;
	
	testFormatRangeTool = function(self)
		assert(WUtil:formatRange(0, 100, -1) == 0)
		assert(WUtil:formatRange(0, 100, 0) == 0)
		assert(WUtil:formatRange(0, 100, 50) == 50)
		assert(WUtil:formatRange(0, 100, 100) == 100)
		assert(WUtil:formatRange(0, 100, 101) == 100)
	end;
	
	test_isArriveMaxLevel = function(self)
		self.player:setLevel(1)
		assert ( self.player:isArriveMaxLevel() == false )
		
		local maxLevel = res_rolelevelexps[table.getn(res_rolelevelexps)].level
		self.player:setLevel(maxLevel)
		assert ( self.player:isArriveMaxLevel() == true )
		
		local maxLevel = res_rolelevelexps[table.getn(res_rolelevelexps)].level
		self.player:setLevel(maxLevel + 1)
		assert ( self.player:isArriveMaxLevel() == true )
	end;
	
	test_isCanUpgrade = function(self)
		local g_maxLevelRt = {true}
		local mm = MMock()
		mm:mock( self.player, 'isArriveMaxLevel', g_maxLevelRt)
		assert ( self.player:isCanUpgrade() == false )
		
		g_maxLevelRt[1] = false
		self.player:getAttr(ATTR.XP).ulVal = 10
		self.player:getAttr(ATTR.NXP).ulVal = 1000
		assert ( self.player:isCanUpgrade() == false )
		
		g_maxLevelRt[1] = false
		self.player:getAttr(ATTR.XP).ulVal = 1000
		self.player:getAttr(ATTR.NXP).ulVal = 1000
		assert ( self.player:isCanUpgrade() == true )
		
		mm:restore()
	end;
	
	test_upgradeLevel = function(self)
		self.player:setLevel(1)
		self.player:getAttr(ATTR.XP).ulVal = 1100
		self.player:getAttr(ATTR.NXP).ulVal = 1000
		
		self.mm:mock(self.player, 'addPPs')
		self.mm:mock(self.player, 'setNextXP')
		self.mm:mock(self.player, 'setMaxPS')
		self.mm:mock(TaskFinisher, 'checkTasks')
		self.mm:mock(self.player:getTask():getEveryDayTask(), 'randTasks')
		
		self.player:upgradeLevel()
		
		assert ( self.mm.walkLog == 'addPPs,setNextXP,setMaxPS,checkTasks,randTasks' )
		assertEQ ( self.mm.params['addPPs'], {2} )
		
		assert ( self.player:getAttr(ATTR.XP).ulVal == 100 )
		assert ( self.player:getLevel() == 2 )
		assertEQ ( self.mm.params['checkTasks'], {self.player } )
		local res = Util:qfind(res_rolelevelexps, 'level', 2)
		assertEQ ( self.player:getAttrVal(ATTR.PS), res.maxps )
	end;
	
	test_setMaxPS = function(self)
		self.player:setLevel(1)
		self.player:setMaxPS()
		assertEQ ( self.player:getAttrVal(ATTR.MPS), 10 )
		
		self.player:setLevel(2)
		self.player:setMaxPS()
		assertEQ ( self.player:getAttrVal(ATTR.MPS), 20 )
	end;
	
	test_addRawExp = function(self)
		self.player:getAttr(ATTR.XP).ulVal = 0
		self.player:addRawExp(10000)
		assert ( self.player:getAttr(ATTR.XP).ulVal == 10000 )
	end;
	
	test_upgradeLevels = function(self)
		local mm = MethodMock()
		mm.times = 0
		mm.calledTimes = 0
		mm:mock(self.player, 'isCanUpgrade', function()
			if mm.times == 3 then
				return false
			else
				mm.times = mm.times + 1
				return true
			end
			end)
		mm:mock(self.player, 'upgradeLevel', function()
			mm.calledTimes = mm.calledTimes + 1
			end)
		
		self.player:upgradeLevels()
		mm:restore()
		
		assert ( mm.calledTimes == 3 )
	end;
	
	test_clearExpValWhenArriveMaxLevel = function(self)
		self.player:getAttr(ATTR.XP).ulVal = 1
		local g_isArriveMaxLevelRt = {false}
		local mm = MMock()
		mm:mock(self.player, 'isArriveMaxLevel', g_isArriveMaxLevelRt )
		self.player:clearExpValWhenArriveMaxLevel()
		assert ( self.player:getAttr(ATTR.XP).ulVal == 1 )
		
		g_isArriveMaxLevelRt[1] = true
		self.player:clearExpValWhenArriveMaxLevel()
		assert ( self.player:getAttr(ATTR.XP).ulVal == 0 )
		
		mm:restore()
	end;
	
	test_sendMsgWhenAddExp = function(self)
		local mm = MMock()
		self.mm:mock(RoleAttrSender, 'sendAttrsByIds' )
		self.mm:mock(RoleBaseSender, 'send' )
		self.mm:mock(WUtil, 'sendSysMsgArgs' )
		
		self.player:sendMsgWhenAddExp(10)
		
		assertEQ ( self.mm.walkLog, 'sendAttrsByIds,send,sendSysMsgArgs' )
		assertEQ ( self.mm.params['sendAttrsByIds'][1], self.player )
		assertEQ ( self.mm.params['sendAttrsByIds'][2][1], ATTR.XP )
		assertEQ ( self.mm.params['sendAttrsByIds'][2][2], ATTR.NXP )
		assertEQ ( self.mm.params['sendAttrsByIds'][2][3], ATTR.PP )
		assertEQ ( self.mm.params['send'][1], self.player )
		assertEQ ( self.mm.params['sendSysMsgArgs'], {self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid'..FIXID.ROLEEXP..'",10'} )
	end;
	
	test_addExp = function(self)
		self.mm:mock(self.player, 'addRawExp' )
		self.mm:mock(self.player, 'upgradeLevels' )
		self.mm:mock(self.player, 'clearExpValWhenArriveMaxLevel' )
		self.mm:mock(self.player, 'sendMsgWhenAddExp' )
		
		self.player:addExp(1000.1)
		assertEQ ( self.mm.walkLog, 'addRawExp,upgradeLevels,clearExpValWhenArriveMaxLevel,sendMsgWhenAddExp' )
		assertEQ ( self.mm.params['addRawExp'], {1000} )
		assertEQ ( self.mm.params['sendMsgWhenAddExp'], {1000} )
		
		self.mm:clear()
		self.player:addExp(-1)
		assert ( self.mm.walkLog == '' )
		
		self.mm:clear()
		self.player:addExp(0)
		assert ( self.mm.walkLog == '' )
	end;
	
	test_subExp = function(self)
		self.mm:mock(RoleAttrSender, 'sendAttrsByIds')
		assertEQ ( self.player:getAttrVal(ATTR.XP), 0 )
		self.player:subExp(-1)
		assertEQ ( self.player:getAttrVal(ATTR.XP), 0 )
		self.player:subExp(2)
		assertEQ ( self.mm.params['sendAttrsByIds'], {self.player, {ATTR.XP}} )
		assertEQ ( self.player:getAttrVal(ATTR.XP), -2 )
		self.player:addExp(1)
		assertEQ ( self.player:getAttrVal(ATTR.XP), -1 )
	end;
	
	test_subXPSAttr = function(self)
		local xpsAttr = self.player:getAttr(ATTR.XPS)
		xpsAttr.ulVal = 10
		self.player:subXPSAttr(-1)
		assert ( xpsAttr.ulVal == 10 )
		
		self.player:subXPSAttr(0)
		assert ( xpsAttr.ulVal == 10 )
		
		self.player:subXPSAttr(1)
		assert ( xpsAttr.ulVal == 9 )
		
		self.player:subXPSAttr(10)
		assert ( xpsAttr.ulVal == 0 )
	end;
	
	test_addXPSAttr = function(self)
		self.mm:mock(RoleAttrSender, 'sendAttrsByIds')
		self.mm:mock(WUtil, 'sendSysMsgArgs' )
		
		self.player:setLevel(1)
		local mxpsAttr = self.player:getAttr(ATTR.MXPS)
		local xpsAttr = self.player:getAttr(ATTR.XPS)
		xpsAttr.ulVal = 0
		
		self.player:addXPSAttr(-1)
		assert ( xpsAttr.ulVal == 0 )
		
		self.player:addXPSAttr(0)
		assert ( xpsAttr.ulVal == 0 )
		
		self.player:addXPSAttr(1)
		assert ( xpsAttr.ulVal == 1 )
		assertEQ ( self.mm.params['sendAttrsByIds'], {self.player, {ATTR.XPS}} )
		assertEQ ( self.mm.params['sendSysMsgArgs'], {self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid'..FIXID.HEROSEXP..'",1'} )
		
		self.player:addXPSAttr(mxpsAttr.ulVal + 1)
		assert ( xpsAttr.ulVal == mxpsAttr.ulVal )
	end;
	
	testAttrMXPS = function(self) -- 英雄经验池的最大值
		local attr = self.player:getAttr(ATTR.MXPS)
		assert(attr ~= nil)
		
		self.player:setLevel(1)
		self.player:setAttrVal(ATTR.IN_B, 10)
		self.player:setAttrVal(ATTR.IN_A, 10)
		
		attr = self.player:getAttr(ATTR.MXPS)
		assert(attr.ulVal == res_calc_attr_MXPS(1, 20))
	end;
	
	testAttrMAF = function(self) -- 兵力上限
		local attr = self.player:getAttr(ATTR.MAF)
		assert(attr ~= nil)
		
		self.player:setLevel(1)
		self.player:setAttrVal(ATTR.FOR_B, 10)
		self.player:setAttrVal(ATTR.FOR_A, 10)

		attr = self.player:getAttr(ATTR.MAF)
		assert(attr.ulVal == res_calc_attr_MAF(1, 20, 0))
		
		local city = self.player:getCitys():getCityById(BUILDCITY_ID.MAIN)
		city:addBuild({id=10,resid=FIXID.FHQBUILD,level=10,state=0})
		
		local city = self.player:getCitys():addCity(CITY_TYPE.SUBARMY)
		city:addBuild({id=15,resid=FIXID.FHQBUILD,level=5,state=0})
		
		addval = ItemResUtil:findBuildLevelres(FIXID.FHQBUILD, 10).storesoldiernum + ItemResUtil:findBuildLevelres(FIXID.FHQBUILD, 5).storesoldiernum
		
		attr = self.player:getAttr(ATTR.MAF)
		assert(attr.ulVal == res_calc_attr_MAF(1, 20, addval))
	end;
	
	testRefreshNewSoldiers = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {curtime=0})
		self.player:refreshNewSoldiers()
		assert ( self.player:getNSLastTime() == Util:getTime() )
		assert ( self.player:getAttrVal(ATTR.NAF) == 0 )
		
		TestCaseCondition:setPreCond(self.player, nil, {curtime=3600, player={ attrs={{id=ATTR.NAFO,val=10},{id=ATTR.MNAF,val=5} } } })
		self.player:refreshNewSoldiers()
		assert ( self.player:getNSLastTime() == Util:getTime() )
		assert ( self.player:getAttrVal(ATTR.NAF) == 5 )
	end;
	
	testGetSelfField = function(self)
		assert ( self.player:getSelfField() ~= nil )
	end;
	
	_testSetAlliId = function(self)
		self.mm:mock(self.player, 'refreshCityGrid')
		self.player:setAlliId(1)
		assert ( self.player:getAlliId() == 1 )
		assert ( self.mm.walkLog, 'refreshCityGrid' )
	end;
	
	testSetSex = function(self)
		self.mm:mock(self.player, 'refreshCityGrid')
		self.player:setSex(1)
		assert ( self.player:getSex() == 1 )
		assert ( self.mm.walkLog, 'refreshCityGrid' )
	end;
	
	testSetRoleName = function(self)
		self.mm:mock(self.player, 'refreshCityGrid')
		self.player:setRoleName('trole')
		assert ( self.player:getRoleName() == 'trole' )
		assert ( self.mm.walkLog, 'refreshCityGrid' )
	end;
	
	testSetLevel = function(self)
		self.mm:mock(self.player, 'refreshCityGrid')
		self.player:setLevel(10)
		assert ( self.player:getLevel() == 10 )
		assert ( self.mm.walkLog, 'refreshCityGrid' )
	end;
	
	testSetCityModel = function(self)
		self.mm:mock(self.player, 'refreshCityGrid')
		self.player:getCityRes():setLevel(5)
		assert ( self.player:getCityModel() == 170501 )
		assert ( self.mm.walkLog, 'refreshCityGrid' )
	end;
	
	testSetState = function(self)
		self.mm:mock(self.player, 'refreshCityGrid')
		self.player:setState(1)
		assert ( self.player:getState() == 1 )
		assert ( self.mm.walkLog, 'refreshCityGrid' )
	end;
	
	testSetIcon = function(self)
		self.mm:mock(self.player, 'refreshCityGrid')
		self.player:setIcon(1)
		assert ( self.player:getIcon() == 1 )
		assert ( self.mm.walkLog, 'refreshCityGrid' )
	end;
	
	testEnemyContainer = function(self)
		assert ( self.player:getEnemyContainer() ~= nil )
	end;
	
	testFavoriteContainer = function(self)
		assert ( self.player:getFavoriteContainer() ~= nil )
	end;
	
	testRefreshCityGrid = function(self)
		local methodMock = MethodMock()
		methodMock.walkCount = 0
		methodMock:mock(self.player, 'refreshCityGrid', function(self) 
			methodMock.walkCount = methodMock.walkCount + 1
			end)
		self.player:loginStart()
		assert ( methodMock.walkCount == 1 )
		
		self.player:setAlliId(0)
		assert ( methodMock.walkCount == 2 )
		
		self.player:setRoleName('aaa')
		assert ( methodMock.walkCount == 3 )
		
		self.player:setLevel(1)
		assert ( methodMock.walkCount == 4 )
		
		self.player:setState(1)
		assert ( methodMock.walkCount == 5 )
		
		self.player:setRoleId(1)
		assert ( methodMock.walkCount == 6 )
		
		self.player:setName('')
		assert ( methodMock.walkCount == 7 )
		
		self.player:setIcon(1)
		assert ( methodMock.walkCount == 8 )
		
		methodMock:restore()
		
		Util:setTimeDrt(20)
		self.player:setQQMembership({is_yellow_vip=1, yellow_vip_level = 2})
		self.player:getActTower():setMaxLayer(99)
		self.player:getCityRes():setLevel(10)
		self.player:getActTerrace():setMaxGate({gateId=8, subGateId=2})
		assertEQ ( self.player:getCityGrid().misc.towerLayer, 99 )
		assertEQ ( self.player:getCityGrid().misc.towerTime, 20 )
		assertEQ ( self.player:getCityGrid().misc.terraceGate, 8-1 )
		assertEQ ( self.player:getCityGrid().misc.cityMaxLevel, 10 )
		assertEQ ( self.player:getCityGrid().misc.is_yellow_vip, 1 )
		assertEQ ( self.player:getCityGrid().misc.yellow_vip_level, 2 )
		
		self.player:getActTerrace():setMaxGate({gateId=8, subGateId=res_act_terrace_max_subgate_id})
		assertEQ ( self.player:getCityGrid().misc.terraceGate, 8 )
	end;
	
	test__getSubCitysStr = function(self)
		assertEQ ( self.player:_getSubCitysStr(), '' )
		
		self.player:getCitys():addCity(CITY_TYPE.SUBARMY)
		assertEQ ( self.player:_getSubCitysStr(), '' .. CITY_TYPE.SUBARMY)
		
		self.player:getCitys():addCity(CITY_TYPE.SUBRES)
		assertEQ ( self.player:_getSubCitysStr(), CITY_TYPE.SUBARMY .. ',' .. CITY_TYPE.SUBRES )
	end;
	
	test_save = function(self)
		self.player:setCityGrid({name='grid', objType=OBJ_TYPE.ROLE})
		self.mm:mock(SPub, 'RoleSave')
		self.mm:mock(app:getCityMgr(), 'saveAllGrids')
		self.player:save()
		assertEQ ( self.mm.walkLog, 'RoleSave,saveAllGrids' )
		assertEQ ( self.mm.params['RoleSave'], {self.player:getPersistVar()} )
		assertEQ ( self.mm.params['saveAllGrids'], {{name='grid', objType=OBJ_TYPE.ROLE}} )
		
		self.mm:clear()
		self.player:setCityGrid({name='grid', objType=OBJ_TYPE.DIED_ROLE})
		self.player:save()
		assertEQ ( self.mm.walkLog, 'RoleSave' )
		
		self.mm:clear()
		self.player:setCityGrid(nil)
		self.player:save()
		assertEQ ( self.mm.walkLog, 'RoleSave' )
	end;
	
	test_setIntroduction = function(self)
		self.player:setIntroduction('intro')
		assertEQ ( self.player:getIntroduction(), 'intro' )
	end;
	
	test_getFriendMgr = function(self)
		assertEQ ( self.player:getFriendMgr():getClass(), PlayerFriendMgr )
	end;
	
	test_refreshPSAttr = function(self)
		local curDate = os.date("*t", Util:getTime())
		self.mm:mock( self.player, 'getAttrVal', {10000} )
		self.mm:mock( self.player, 'setAttrVal', {10000} )
		
		self.player.dbvar.stBInfos.stAttrs.lastPSRefreshDay = curDate.yday
		self.player:refreshPSAttr()
		assertEQ ( self.mm.walkLog, '' )
		
		self.mm:clear()
		self.player.dbvar.stBInfos.stAttrs.lastPSRefreshDay = curDate.yday + 1
		self.player:refreshPSAttr()
		assertEQ ( self.mm.walkLog, 'getAttrVal,setAttrVal' )
		assertEQ ( self.mm.params['getAttrVal'], {ATTR.MPS})
		assertEQ ( self.mm.params['setAttrVal'], {ATTR.PS, 10000})
		assertEQ ( self.player.dbvar.stBInfos.stAttrs.lastPSRefreshDay, curDate.yday )
	end;
	
	test_addAttrPs = function(self)
		self.mm:mock(WUtil, 'sendSysMsgArgs' )
		self.player:setAttrVal(ATTR.MPS, 100)
		self.player:setAttrVal(ATTR.PS, 50)
		
		self.mm:mock(RoleAttrSender, 'sendAttrsByIds')
		self.player:addAttrPs(60, true)
		assertEQ ( self.player:getAttrVal(ATTR.PS), 110 )
		assertEQ ( self.mm.params['sendAttrsByIds'], {self.player, {ATTR.PS}} )
		assertEQ ( self.mm.params['sendSysMsgArgs'], {self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid'..FIXID.ROLEPS..'",60'} )
		
		self.mm:clear()
		self.player:addAttrPs(20, false)
		assertEQ ( self.player:getAttrVal(ATTR.PS), 100 )
		assertEQ ( self.mm.params['sendAttrsByIds'], {self.player, {ATTR.PS}} )
	end;
	
	test_calcAttrMAF = function(self)
		self.player:setLevel(1)
		self.mm:mock(self.player:getCitys(), 'getBuildsLevelResSum', {20} )
		local role_force = self.player:getAttrVal(ATTR.FOR_B) + self.player:getAttrVal(ATTR.FOR_A)
		assertEQ ( self.player:calcAttrMAF().ulVal, res_calc_attr_MAF(1, role_force, 20) )
		assertEQ ( self.mm.params['getBuildsLevelResSum'], {FIXID.FHQBUILD, 'storesoldiernum'})
	end;
	
	test_recalcAttrs = function(self)
		self.mm:mock(self.player, 'calcAttrMXPS')
		self.mm:mock(self.player, 'calcAttrMAF')
		self.mm:mock(self.player, 'calcAttrAF')
		self.player:recalcAttrs()
		assertEQ ( self.mm.walkLog, 'calcAttrMXPS,calcAttrMAF,calcAttrAF' )
	end;
	
	test_recalcAttr = function(self)
		self.mm:mock(self.player, 'calcAttrMXPS')
		self.mm:mock(self.player, 'calcAttrMAF')
		self.mm:mock(self.player, 'calcAttrAF')
		
		self.player:recalcAttr({usAttr=ATTR.MXPS})
		assertEQ ( self.mm.walkLog, 'calcAttrMXPS' )
		
		self.mm:clear()
		self.player:recalcAttr({usAttr=ATTR.MAF})
		assertEQ ( self.mm.walkLog, 'calcAttrMAF' )
		
		self.mm:clear()
		self.player:recalcAttr({usAttr=ATTR.AF})
		assertEQ ( self.mm.walkLog, 'calcAttrAF' )
	end;
	
	test_getAttrs = function(self)
		self.mm:mock(self.player, 'recalcAttrs')
		assertEQ ( self.player:getAttrs(), self.player:getPersistVar().stBInfos.stAttrs )
		assertEQ ( self.mm.walkLog, 'recalcAttrs' )
	end;
	
	test_getAttr = function(self)
		self.mm:mock(self.player, 'recalcAttr')
		assertEQ ( self.player:getAttr(-1), nil )
		
		local attr = self.player:getAttr(ATTR.AF)
		assertEQ ( attr.usAttr, ATTR.AF )
		assertEQ ( self.mm.params['recalcAttr'], {attr})
	end;
	
	test_loginStart = function(self)
		self.mm:mock(app:getCityMgr(), 'getGridByRoleId', {{name='grid'}} ) --(  ) 
		self.mm:mock(self.player, 'setCityGrid')
		self.mm:mock(PlayerFightRefState, 'new', {self.player.fightRefState})
		
		self.player:loginStart()
		assertEQ ( self.mm.walkLog, 'getGridByRoleId,setCityGrid,new' )
		assertEQ ( self.mm.params['getGridByRoleId'], {self.player:getRoleId()} )
		assertEQ ( self.mm.params['setCityGrid'], {{name='grid'}} )
	end;

	test_setCityGrid = function(self)
		self.player:setCityGrid({name='grid'})
		assertEQ ( self.player:getCityGrid() , {name='grid'} )
	end;
	
	test_setCurApplyAlliance = function(self)
		assertEQ ( self.player:getCurApplyAlliance(), '' )
		self.player:setCurApplyAlliance('name')
		assertEQ ( self.player:getCurApplyAlliance(), 'name' )
	end;
	
	test_getInviteJoinAlliances = function(self)
		local set = self.player:getInviteJoinAlliances()
		set:insert({allianceId=10, roleId=1})
		set:insert({allianceId=11, roleId=2})
		set:insert({allianceId=11, roleId=3})
		assertEQ	( set:getCount() , 2)
		assertEQ ( set:get(0).allianceId, 10 )
		assertEQ ( set:get(0).roleId, 1 )
	end;
	
	test_getTradingArea = function(self)
		assertEQ ( self.player:getTradingArea():getClass(), TradingArea )
	end;
	
	test__initObjects = function(self)
	end;
	
	test_loginOk = function(self)
		self.mm:mock(self.player:getTradingArea(), 'start:tradingStart')
		self.mm:mock(self.player:getTask():getEveryDayTask(), 'start:everydayStart')
		self.mm:mock(self.player:getTask():getDoingRoleTask(), 'start:doingroleStart')
		self.mm:mock(self.player:getTask():getActTask(), 'start:actStart')
		self.mm:mock(self.player:getCityRes(), 'start:cityResStart')
		self.player:loginOk()
		assertEQ ( self.mm.walkLog, 'tradingStart,everydayStart,doingroleStart,actStart,cityResStart' )
	end;
	
	test_getRegTime = function(self)
		assertEQ ( self.player:getRegTime(), 0 )
		self.player:setRegTime(2000)
		assertEQ ( self.player:getRegTime(), 2000 )
	end;
})

local TestCaseCityRes = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testCitysBuildVal = function(self)
		local cres = self.player:getCityRes()
		assert(cres:getBuildVal() ~= nil)
		cres:setBuildVal(1)
		assert(cres:getBuildVal() == 1)
	end;
	
	testCitysMaxBuildVal = function(self)
		local cres = self.player:getCityRes()
		assert(cres:getMaxBuildVal() ~= nil)
		assert(cres:getMaxBuildVal() > 0)	
	end;
	
	testTodayLostedBuildVal = function(self)
		local cres = self.player:getCityRes()
		Util:setTimeDrt(0)
		cres:setTodayLostedBuildVal(1)
		assert(cres:getTodayLostedBuildVal() == 1)
		Util:setTimeDrt(24*3600+1)
		assert(cres:getTodayLostedBuildVal() == 0)
		cres:setTodayLostedBuildVal(10)
		assert(cres:getTodayLostedBuildVal() == 10)
		cres:setTodayLostedBuildVal(20)
		assert(cres:getTodayLostedBuildVal() == 20)
		cres:setTodayLostedBuildVal(-1)
		assert(cres:getTodayLostedBuildVal() == 20)
	end;
	
	testCitysLevel = function(self)
		self.mm:mock(app:getMailMgr(), 'addSysMail', {{name='mail'}})
		self.mm:mock(WUtil, 'sendPopBoxMsg' )
		self.mm:mock(MailSender, 'sendBriefMail')
		
		local cres = self.player:getCityRes()
		assert(cres:getLevel() ~= nil)
		cres:setLevel(1)
		assert(cres:getLevel() == 1)	
		
		clearSendMsg_t()
		cres:setLevel(1)
		assert( getSendMsg_t() == '' )
		
		clearSendMsg_t()
		cres:setLevel(2)
		assert( getSendMsg_t() ~= '' )
		
		clearSendMsg_t()
		self.player:setState(ROLE_STATE.YOUNG)
		cres:setLevel(5)
		assert ( self.player:getState() ~= ROLE_STATE.YOUNG )
		assert( getSendMsg_t() ~= '' )
		assertEQ ( self.mm.walkLog, 'addSysMail,sendBriefMail,sendPopBoxMsg' )
		assertEQ ( self.mm.params['addSysMail'], {self.player:getRoleName(), rstr.mail.title.youngStateEnd, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.youngStateEnd} ) 
		assertEQ ( self.mm.params['sendBriefMail'], {self.player, {name='mail'}} ) 
		assertEQ ( self.mm.params['sendPopBoxMsg'], {self.player, rstr.mail.content.youngStateEnd} ) 
	end;
	
	testCitysBuildHurtVal = function(self)
		local cres = self.player:getCityRes()
		assert(cres:getBuildHurtVal() ~= nil)
		cres:setBuildVal(1)
		cres:setBuildHurtVal(1)
		assert(cres:getBuildHurtVal() == 1)	
		
		cres:setBuildVal(1)
		cres:setBuildHurtVal(2)
		assert(cres:getBuildHurtVal() == 1)
	end;
	
	testGetLevelByBuildVal = function(self)
		local cres = self.player:getCityRes()
		assert ( cres:getLevelByBuildVal(0) == 0 )
		assert ( cres:getLevelByBuildVal(9) == 1 )
		assert ( cres:getLevelByBuildVal(49000) == 5 )
		assert ( cres:getLevelByBuildVal(59000) == 5 )
		assert ( cres:getLevelByBuildVal(73000) == 6 )
		assert ( cres:getLevelByBuildVal(93000) == 6 )
		assert ( cres:getLevelByBuildVal(10000000000) > 100 )
	end;
	
	testResetCityLevel = function(self)
		local cres = self.player:getCityRes()
		cres:setLevel(10)
		assert(cres:getLevel() == 10)
		
		cres:setBuildVal(0xffffffff)
		cres:setBuildHurtVal(0)
		assert(cres:getLevel() == 10)
		
		cres:setBuildHurtVal(0xffffffff)
		assert(cres:getLevel() == 0)
		
		cres:setBuildHurtVal(0)
		cres:setBuildVal(0xffffffff)
		cres:setLevel(10)
		assert(cres:getLevel() == 10)
		
		cres:setBuildHurtVal(1)
		assert(cres:getLevel() == 10)
		
		cres:setBuildVal(1)
		assert(cres:getLevel() == 0)
	end;
	
	testGetFarmMaxBlockCnt = function(self)
		local cityres = self.player:getCityRes()
		cityres:setLevel(2)
		
		local expectcount = Util:qfind(res_citylevelneeds, 'level', 2).farmBlock
		assert( cityres:getFarmMaxBlockCount() ==  expectcount )
		
		cityres:setLevel(100)
		assert( cityres:getFarmMaxBlockCount() ==  0 )
	end;
	
	testGetFarmMaxBlockId = function(self)
		local cityres = self.player:getCityRes()
		cityres:setLevel(2)
		assert( cityres:getFarmMaxBlockId() ==  cityres:getFarmMaxBlockCount() )
	end;
	
	testCityLevelChange = function(self)
		local cityres = self.player:getCityRes()
		local farm = self.player:getFarm()
		cityres:setLevel(1)
		local delmaxid = false
		farm.delBlocksByMaxId = function(self, maxid) delmaxid = maxid; end;
		cityres:setLevel(2)
		assert( delmaxid == cityres:getFarmMaxBlockId() )
		
		delmaxid = 0
		cityres:setLevel(2)
		assert( delmaxid == 0 )
	end;
	
	testSetIdlePopu = function(self)
		local cityres = self.player:getCityRes()
		assert( cityres:getILastTime() == 0 )
		local oldidle = cityres:getIdlePopu() 
		assert( oldidle ~= nil )
		Util:setTimeDrt(10000)
		cityres:setIdlePopu( oldidle )
		assert( cityres:getILastTime() == 0 )
	end;
	
	testSetMoney = function(self)
		local cityres = self.player:getCityRes()
		assert( cityres:getMLastTime() == 0 )
		local oldmoney = cityres:getMoney()
		assert( oldmoney ~= nil )
		Util:setTimeDrt(10000)
		cityres:setMoney( oldmoney )
		assert( cityres:getMLastTime() == 0 )
	end;
	
	testAddFood = function(self)	
		local cityres = self.player:getCityRes()
		cityres:setFood(1)
		cityres:addFood(-1)
		assert(cityres:getFood() == 1)
		cityres:addFood(1)
		assert(cityres:getFood() == 2)
	end;
	
	testAddWood = function(self)	
		local cityres = self.player:getCityRes()
		cityres:setWood(1)
		cityres:addWood(-1)
		assert(cityres:getWood() == 1)
		cityres:addWood(1)
		assert(cityres:getWood() == 2)
	end;
	
	testAddStone = function(self)	
		local cityres = self.player:getCityRes()
		cityres:setStone(1)
		cityres:addStone(-1)
		assert(cityres:getStone() == 1)
		cityres:addStone(1)
		assert(cityres:getStone() == 2)
	end;
	
	testAddIron = function(self)	
		local cityres = self.player:getCityRes()
		cityres:setIron(1)
		cityres:addIron(-1)
		assert(cityres:getIron() == 1)
		cityres:addIron(1)
		assert(cityres:getIron() == 2)
	end;
	
	testSubFood = function(self)	
		local cityres = self.player:getCityRes()
		cityres:setFood(1)
		cityres:subFood(-1)
		assert(cityres:getFood() == 1)
		cityres:subFood(1)
		assert(cityres:getFood() == 0)
		cityres:subFood(1)
		assert(cityres:getFood() == 0)
	end;
	
	testSubWood = function(self)	
		local cityres = self.player:getCityRes()
		cityres:setWood(1)
		cityres:subWood(-1)
		assert(cityres:getWood() == 1)
		cityres:subWood(1)
		assert(cityres:getWood() == 0)
		cityres:subWood(1)
		assert(cityres:getWood() == 0)
	end;
	
	testSubStone = function(self)	
		local cityres = self.player:getCityRes()
		cityres:setStone(1)
		cityres:subStone(-1)
		assert(cityres:getStone() == 1)
		cityres:subStone(1)
		assert(cityres:getStone() == 0)
		cityres:subStone(1)
		assert(cityres:getStone() == 0)
	end;
	
	testSubIron = function(self)	
		local cityres = self.player:getCityRes()
		cityres:setIron(1)
		cityres:subIron(-1)
		assert(cityres:getIron() == 1)
		cityres:subIron(1)
		assert(cityres:getIron() == 0)
		cityres:subIron(1)
		assert(cityres:getIron() == 0)
	end;	
})

local TestCasePlayerCity = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		
		local citys = self.player:getCitys()
		self.city = citys:getCityById(BUILDCITY_ID.MAIN)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testGetBuildCount = function(self)
		local city = self.player:getPersistVar().stCitys.astCitys[0]
		local pcity = PlayerCity:new(self.player, city)
		pcity:setBuildCount(0)
		assert(pcity:getBuildCount() == 0)
	end;
	
	testGetSomeVal = function(self)
		local city = self.player:getPersistVar().stCitys.astCitys[0]
		local pcity = PlayerCity:new(self.player, city)
		assert(pcity:getType() ~= nil)
	end;
	
	testAddBuild = function(self)
		local city = self.player:getPersistVar().stCitys.astCitys[0]
		local pcity = PlayerCity:new(self.player, city)
		pcity:setBuildCount(0)
		local build = pcity:addBuild({id=1,resid=120001,level=0,state=1,stoptime=Util:getTime()+15})
		assert(build.ulId == 1)
		assert(pcity:getBuildCount() == 1)
		assert(build.ucLevel == 0 )
		assert(build.ulResId == 120001 )
		assert(build.ucState == 1 )
		assert(build.ulStoptime == Util:getTime()+15 )
	end;
	
	testHouseBuildLevelChangeResetIdlePopu = function(self)
		Util:setTimeDrt(0)
		
		local citys = self.player:getCitys()
		local cityres = self.player:getCityRes()
		cityres:setLevel(1)
		assert( cityres:getILastTime() == 0);

		local city = self.player:getPersistVar().stCitys.astCitys[0]
		local pcity = PlayerCity:new(self.player, city)
		pcity:setBuildCount(0)
		
		local time0 = 10000;
		Util:setTimeDrt(time0)
		cityres:refreshIdlePopu()
		local oldidle = cityres:getIdlePopu()
		
		
		clearSendMsg_t()
		local time1 = 20000;
		Util:setTimeDrt(time1)
		cityres:refreshIdlePopu()
		local build = pcity:addBuild({id=1,resid=FIXID.HOUSEBUILD,level=0,state=1,stoptime=Util:getTime()+15})
		for i=1, 10 do
			pcity:addBuildLevel(build)
		end
		assert( cityres:getIdlePopu() == oldidle )
		assert( cityres:getILastTime() == Util:getTime());
		assert( getSendMsg_t() ~= '' )
		
		local time2 = 20100;
		Util:setTimeDrt(time2)
		cityres:refreshIdlePopu()
		
		assert( cityres:getIdlePopu() == oldidle + math.floor((time2 - time1)*res_idlepopu_output*citys:getMaxPopu() ) )
		
		clearSendMsg_t()
		pcity:subBuildLevel(build)
		assert( cityres:getILastTime() == Util:getTime());
		assert( getSendMsg_t() ~= '' )

	end;
	
	test_getBuildCountByResIdLevel = function(self)
		local citys = self.player:getCitys()
		local city = citys:getCityById(BUILDCITY_ID.MAIN)
		city.city.stInBuilds.astInBuilds[0].ulResId = 110005
		city.city.stInBuilds.astInBuilds[0].ucLevel = 3
		city.city.stInBuilds.astInBuilds[1].ulResId = 110005
		city.city.stInBuilds.astInBuilds[1].ucLevel = 3
		city.city.stInBuilds.astInBuilds[2].ulResId = 110005
		city.city.stInBuilds.astInBuilds[2].ucLevel = 4
		city.city.stInBuilds.astInBuilds[3].ulResId = 110006
		city.city.stInBuilds.astInBuilds[3].ucLevel = 3
		city.city.stInBuilds.ucTotal = 4
		assertEQ ( city:getBuildCountByResIdLevel(110005, 3), 3 )
	end;
	
	testGovBuildLevelChangeResetMaxMoney = function(self)
		local citys = self.player:getCitys()
		local city = citys:getCityById(BUILDCITY_ID.MAIN)
		local lastmax = citys:getMaxMoney()
		
		clearSendMsg_t()
		local build = city:getBuildByResId(FIXID.GOV_BUILD)
		city:addBuildLevel(build)
		assert(citys:getMaxMoney() > lastmax )
		assert( getSendMsg_t() ~= '' )
	end;
	
	test_onBuildLevelChange = function(self)
		local p_build = {ulResId=FIXID.GOV_BUILD}
		local citys = self.player:getCitys()
		local city = citys:getCityById(BUILDCITY_ID.MAIN)
		
		self.mm:mock(MoneySender, 'sendAll' )
		self.mm:mock(CommResSender, 'send' )
		self.mm:mock(self.player:getCityRes(), 'onPopuChange' )
		self.mm:mock(self.player, 'recalSendMaxNewSoldier' )
		self.mm:mock(ExchangeHeroExpSender, 'sendTodayTimes' )
		self.mm:mock(city, '_recalcHerosCommandAttr' )
		self.mm:mock(self.player, 'refreshCityGrid' )
		self.mm:mock(ItemMsgSender, 'sendSalveMax')
		self.mm:mock(self.player, 'recalRoleAppendAttrs')
		
		city:onBuildLevelChange(p_build, 1, 2)
		assertEQ ( self.mm.walkLog, 'sendAll,refreshCityGrid' )
		assertEQ ( self.mm.params['sendAll'], {self.player} )
		
		self.mm:clear()
		p_build.ulResId = FIXID.STOREINBUILD
		city:onBuildLevelChange(p_build, 1, 2)
		assertEQ ( self.mm.walkLog, 'send,refreshCityGrid' )
		assertEQ ( self.mm.params['send'], {self.player, {FIXID.MAXCRESCNT}} )
		
		self.mm:clear()
		p_build.ulResId = FIXID.WORKSHOPBUILD
		city:onBuildLevelChange(p_build, 1, 2)
		assertEQ ( self.mm.walkLog, 'send,refreshCityGrid' )
		assertEQ ( self.mm.params['send'], {self.player, {FIXID.MAXCRESCNT}} )
		
		self.mm:clear()
		p_build.ulResId = FIXID.HOUSEBUILD
		city:onBuildLevelChange(p_build, 1, 2)
		assertEQ ( self.mm.walkLog, 'onPopuChange,refreshCityGrid' )
		
		self.mm:clear()
		p_build.ulResId = FIXID.BARBACK
		city:onBuildLevelChange(p_build, 1, 2)
		assertEQ ( self.mm.walkLog, 'recalSendMaxNewSoldier,refreshCityGrid' )
		
		self.mm:clear()
		p_build.ulResId = FIXID.JITANBUILD
		city:onBuildLevelChange(p_build, 1, 2)
		assertEQ ( self.mm.params['sendTodayTimes'], {self.player } )
		
		self.mm:clear()
		p_build.ulResId = FIXID.JIAOLIANBUILD
		city:onBuildLevelChange(p_build, 1, 2)
		assertEQ ( self.mm.walkLog, '_recalcHerosCommandAttr,refreshCityGrid' )
		
		self.mm:clear()
		p_build.ulResId = FIXID.HOSPITALBUILD
		city:onBuildLevelChange(p_build, 1, 2)
		assertEQ ( self.mm.walkLog, 'sendSalveMax,refreshCityGrid' )
		assertEQ ( self.mm.params['sendSalveMax'], {self.player } )
		
		self.mm:clear()
		p_build.ulResId = FIXID.SIMASHU
		city:onBuildLevelChange(p_build, 0, 1)
		assertEQ ( self.mm.params['recalRoleAppendAttrs'], {} )
	end;
	
	test__recalcHerosCommandAttr = function(self)
		self.mm:mock( self.hero, 'recalcCommandAttr' )
		self.mm:mock( HeroAttrSender, 'sendAttr' )
		self.mm:mock( self.hero, 'uncarrySoldierBeyondCommand' )
		
		self.city:_recalcHerosCommandAttr()
		assertEQ ( self.mm.walkLog, 'recalcCommandAttr,sendAttr,uncarrySoldierBeyondCommand' )
		assertEQ ( self.mm.params['sendAttr'], {self.player, self.hero, self.hero:getAttr(ATTR.CO)} )
	end;
})

local TestCasePlayerCitys = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_addCity = function(self)
		local r_isArrivedMaxCityCount = {true}
		local r_isAddMainCityExist = {true}
		self.mm:mock(self.player:getCitys(), '_isArrivedMaxCityCount', r_isArrivedMaxCityCount)
		self.mm:mock(self.player:getCitys(), '_isAddMainCityExist', r_isAddMainCityExist)
		self.mm:mock(self.player:getCitys(), '_createCity', {{name='city'}})
		self.mm:mock(self.player, 'refreshCityGrid')
		
		assertEQ ( self.player:getCitys():addCity(CITY_TYPE.MAIN), nil)
		assertEQ ( self.mm.walkLog, '_isArrivedMaxCityCount' )
		
		self.mm:clear()
		r_isArrivedMaxCityCount[1] = false
		assertEQ ( self.player:getCitys():addCity(CITY_TYPE.MAIN), nil)
		assertEQ ( self.mm.walkLog, '_isArrivedMaxCityCount,_isAddMainCityExist' )
		assertEQ ( self.mm.params['_isAddMainCityExist'], {CITY_TYPE.MAIN} )
		
		self.mm:clear()
		r_isAddMainCityExist[1] = false
		assertEQ ( self.player:getCitys():addCity(CITY_TYPE.SUBARMY), {name='city'} )
		assertEQ ( self.mm.walkLog, '_isArrivedMaxCityCount,_isAddMainCityExist,_createCity,refreshCityGrid' )
		assertEQ ( self.mm.params['_createCity'], {CITY_TYPE.SUBARMY} )
	end;
	
	test__isArrivedMaxCityCount = function(self)
		self.player:getPersistVar().stCitys.ucTotal = MAX_CITY_CNT - 1
		assertEQ ( self.player:getCitys():_isArrivedMaxCityCount(), false )
		
		self.player:getPersistVar().stCitys.ucTotal = MAX_CITY_CNT
		assertEQ ( self.player:getCitys():_isArrivedMaxCityCount(), true )
	end;
	
	test__isAddMainCityExist = function(self)
		self.player:getPersistVar().stCitys.ucTotal = 1
		assertEQ ( self.player:getCitys():_isAddMainCityExist(CITY_TYPE.SUBARMY), false )
		
		self.player:getPersistVar().stCitys.ucTotal = 0
		assertEQ ( self.player:getCitys():_isAddMainCityExist(CITY_TYPE.MAIN), false )
		
		self.player:getPersistVar().stCitys.ucTotal = 1
		assertEQ ( self.player:getCitys():_isAddMainCityExist(CITY_TYPE.MAIN), true )
	end;
	
	test__createCity = function(self)
		self.player:getPersistVar().stCitys.ucTotal = self.player:getCitys():getCityCount()
		local city = self.player:getCitys():_createCity(CITY_TYPE.SUBARMY)
		assertEQ ( city:getType(),  CITY_TYPE.SUBARMY )
		assertEQ ( city:getBuildCount(), 0 )
		assertEQ ( self.player:getCitys():getCityCount(), 2 )
		assertEQ ( self.player:getPersistVar().stCitys.ucTotal, 2 )
	end;
	
	test_getMaxCRes = function(self)
		self.mm:mock(self.player:getCitys(), 'getMaxCResByStore', {1})
		self.mm:mock(self.player:getCitys(), 'getAddMaxCResByWorkShop', {2})
		assertEQ ( self.player:getCitys():getMaxCRes(), 3 )
	end;
	
	test_getMaxCResByStore = function(self)
		assertEQ ( self.player:getCitys():getMaxCResByStore(), res_commres_basestorenum )
		
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=4,resid=FIXID.STOREINBUILD,level=0,state=0} } })
		assertEQ ( self.player:getCitys():getMaxCResByStore(), res_commres_basestorenum )
		
		local build = self.player:getCitys():getBuildsByResId(FIXID.STOREINBUILD)[1]
		build.ucLevel = 1
		local res = ItemResUtil:findBuildLevelres(FIXID.STOREINBUILD, 1)
		assertEQ ( self.player:getCitys():getMaxCResByStore(), res.storenum )
	end;
	
	test_getAddMaxCResByWorkShop = function(self)
		self.mm:mock(self.player:getCitys(), 'getBuildsLevelResSum', {1} )
		assertEQ ( self.player:getCitys():getAddMaxCResByWorkShop(), 1 )
		assertEQ ( self.mm.params['getBuildsLevelResSum'], {FIXID.WORKSHOPBUILD, 'addresstorenum'})
	end;
	
	test_getExchangeExpTodayTimes = function(self)
		self.mm:mock( self.player:getCitys(), 'resetExchangeExpCurTimes' )
		self.mm:mock( self.player:getCitys(), 'resetExchangeExpMaxTimes' )
		assertEQ ( self.player:getCitys():getExchangeExpTodayTimes().curTimes, 0 )
		assertEQ ( self.mm.walkLog, 'resetExchangeExpCurTimes,resetExchangeExpMaxTimes' )
		assertEQ ( self.player:getCitys():getExchangeExpTodayTimes().maxTimes, 0 )
	end;
	
	test_resetExchangeExpCurTimes = function(self)	
		local timeS = 1354896058
		Util:setTimeDrt(timeS)
		self.player:getCitys():addExchangeExpTodayTimes(1)
		
		Util:setTimeDrt(timeS + 10*3600)
		self.player:getCitys():resetExchangeExpCurTimes()
		assertEQ ( self.player:getCitys():getExchangeExpTodayTimes().curTimes, 1 )
		
		Util:setTimeDrt(timeS + 24*3600)
		self.player:getCitys():resetExchangeExpCurTimes()
		assertEQ ( self.player:getCitys():getExchangeExpTodayTimes().curTimes, 0 )
	end;
	
	test_resetExchangeExpMaxTimes = function(self)
		self.mm:mock(self.player:getCitys(), 'getBuildsLevelResSum', {1} )
		self.player:getCitys():resetExchangeExpMaxTimes()
		assertEQ ( self.player:getCitys():getExchangeExpTodayTimes().maxTimes, 1 )
		assertEQ ( self.mm.params['getBuildsLevelResSum'], {FIXID.JITANBUILD, 'addsacrificetimes'})
	end;
	
	test_getBuildsLevelResSum = function(self)
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=4,resid=FIXID.WORKSHOPBUILD,level=0,state=0},{id=5,resid=FIXID.WORKSHOPBUILD,level=10,state=0},{id=6,resid=FIXID.WORKSHOPBUILD,level=11,state=0} } })
		local level10Res = ItemResUtil:findBuildLevelres(FIXID.WORKSHOPBUILD, 10)
		local level11Res = ItemResUtil:findBuildLevelres(FIXID.WORKSHOPBUILD, 11)
		assertEQ ( self.player:getCitys():getBuildsLevelResSum(FIXID.WORKSHOPBUILD, 'addresstorenum'), level10Res.addresstorenum + level11Res.addresstorenum)
	end;
	
	test_getBuildsLevelSum = function(self)
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=4,resid=FIXID.WORKSHOPBUILD,level=0,state=0},{id=5,resid=FIXID.WORKSHOPBUILD,level=10,state=0},{id=6,resid=FIXID.WORKSHOPBUILD,level=11,state=0} } })
		assertEQ ( self.player:getCitys():getBuildsLevelSum(FIXID.WORKSHOPBUILD), 10+11 )
	end;
	
	test_addExchangeExpTodayTimes = function(self)
		self.player:getCitys():addExchangeExpTodayTimes(-1)
		assertEQ ( self.player:getCitys():getExchangeExpTodayTimes().curTimes, 0 )
		
		self.player:getCitys():addExchangeExpTodayTimes(1)
		assertEQ ( self.player:getCitys():getExchangeExpTodayTimes().curTimes, 1 )
		assertEQ ( self.player:getCitys():getExchangeExpTodayTimes().lastTime, Util:getTime() )
	end;
	
	test_getMaxPopu = function(self)
		self.mm:mock(self.player:getCitys(), 'getBuildsLevelResSum', {1} )
		assertEQ ( self.player:getCitys():getMaxPopu(), res_initmaxpopu + 1 )
		assertEQ ( self.mm.params['getBuildsLevelResSum'], {FIXID.HOUSEBUILD, 'popunum'})
	end;
	
	test_getMaxMoney = function(self)
		self.mm:mock(self.player:getCitys(), 'getBuildsLevelResSum', {1} )
		assertEQ ( self.player:getCitys():getMaxMoney(), 1 )
		assertEQ ( self.mm.params['getBuildsLevelResSum'], {FIXID.GOV_BUILD, 'storenum'})
	end;
	
	test_getAutoBuilds = function(self)
		assertEQ ( self.player:getCitys():getAutoBuilds():getCount(), 0 )
		self.player:getCitys():getAutoBuilds():insert(2001)
		assertEQ ( self.player:getCitys():getAutoBuilds():getCount(), 1 )
		self.player:getCitys():getAutoBuilds():insert(2001)
		assertEQ ( self.player:getCitys():getAutoBuilds():getCount(), 1 )
	end;
	
	test_isStartAutoBuild = function(self)
		assertEQ ( self.player:getCitys():isStartAutoBuild(), false )
		self.player:getCitys():setStartAutoBuild(1)
		assertEQ ( self.player:getCitys():isStartAutoBuild(), true )
		self.player:getCitys():setStartAutoBuild(0)
		assertEQ ( self.player:getCitys():isStartAutoBuild(), false )
	end;
	
	test_getCanMaxBuildingCnt = function(self)
		assert ( self.player:getCitys():_getCanMaxBuildingCnt() == res_max_building_cnt )
		
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=1, effect={id=RES_EFF.ADD_THREE_BUILDINGPOS,val=3,unit=0}}
		local creator = {type=0,id=0,skillId=0}
		self.player:getStateContainer():appendState(stateRes, creator)
		
		assert ( self.player:getCitys():_getCanMaxBuildingCnt() == res_max_building_cnt + 3 )
		
		self.player:setVipLevel(5)
		assert ( self.player:getCitys():_getCanMaxBuildingCnt() == res_max_building_cnt + 3 + 1 )
	end;
	
	helper_setForAutoBuilds = function(self)
		self.player:getCitys():setStartAutoBuild(1)
		TestCaseCondition:setPreCond(self.player, nil, { 
		food=10000, wood=10000, stone=10000, iron=10000
		,builds={ 
			{id=1,resid=FIXID.GOV_BUILD,level=10,state=0}
			,{id=2,resid=FIXID.WALLBUILD,level=10,state=0}
			
			,{id=3,resid=FIXID.HOUSEBUILD,level=1,state=0}
			,{id=4,resid=FIXID.HOUSEBUILD,level=1,state=0}
			,{id=5,resid=FIXID.HOUSEBUILD,level=1,state=0}
			,{id=6,resid=FIXID.HOUSEBUILD,level=1,state=0}
		} })
		
		self.player:getCitys():getAutoBuilds():insert(1003)
		self.player:getCitys():getAutoBuilds():insert(1004)
		self.player:getCitys():getAutoBuilds():insert(1005)
		self.player:getCitys():getAutoBuilds():insert(1006)
	end;
	
	test_handleAutoBuilds = function(self)
		self.mm:mock(AutoBuildSender, 'sendInfo')
		self.mm:mock(WUtil, 'sendPopBoxMsg')
		self:helper_setForAutoBuilds()
		self.player:getCitys():setStartAutoBuild(0)
		self.player:getCitys():handleAutoBuilds()
		assertEQ ( self.player:getCitys():getCityById(1):getBuildById(3).ucState, 0 )
		assertEQ ( self.player:getCitys():getCityById(1):getBuildById(4).ucState, 0 )
		assertEQ ( self.player:getCitys():getCityById(1):getBuildById(5).ucState, 0 )
		assertEQ ( self.player:getCitys():getCityById(1):getBuildById(6).ucState, 0 )
		assertEQ ( self.player:getCitys():isStartAutoBuild(), false )
		
		self:helper_setForAutoBuilds()
		self.player:getCitys():setStartAutoBuild(1)
		TestCaseCondition:setPreCond(self.player, nil, {food=0, wood=0, stone=0, iron=0})
		self.player:getCitys():handleAutoBuilds()
		assertEQ ( self.player:getCitys():getCityById(1):getBuildById(3).ucState, 0 )
		assertEQ ( self.player:getCitys():getCityById(1):getBuildById(4).ucState, 0 )
		assertEQ ( self.player:getCitys():getCityById(1):getBuildById(5).ucState, 0 )
		assertEQ ( self.player:getCitys():getCityById(1):getBuildById(6).ucState, 0 )
		assertEQ ( self.player:getCitys():isStartAutoBuild(), false )
		assertEQ ( self.player:getCitys():getAutoBuilds():getCount(), 0 )
		assertEQ ( self.mm.params['sendPopBoxMsg'], {self.player, rstr.autobuild.stop} )
		
		self:helper_setForAutoBuilds()
		self.player:getCitys():setStartAutoBuild(1)
		self.player:getCitys():handleAutoBuilds()
		assertEQ ( self.player:getCitys():getCityById(1):getBuildById(3).ucState, 1 )
		assertEQ ( self.player:getCitys():getCityById(1):getBuildById(4).ucState, 1 )
		assertEQ ( self.player:getCitys():getCityById(1):getBuildById(5).ucState, 1 )
		assertEQ ( self.player:getCitys():getCityById(1):getBuildById(6).ucState, 0 )
		assertEQ ( self.player:getCitys():isStartAutoBuild(), true )
		assertEQ ( self.player:getCitys():getAutoBuilds():getCount(), 1 )
		assertEQ ( self.mm.params['sendInfo'], {self.player} )
	end;
	
})

local TestCaseRecalcRoleAttr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	testCalcAttrAF = function(self)
		assert(self.player:getAttrVal(ATTR.AF) == 0)
		
		local soldierMgr = self.player:getSoldierMgr()
		soldierMgr:addSoldier({resid=150001001, number=1})
		soldierMgr:addSoldier({resid=150001002, number=1})
		assert(self.player:getAttrVal(ATTR.AF) == 2)
		
		self.hero:carrySoldier({resid=150001002, number=2})
		assert(self.player:getAttrVal(ATTR.AF) == 4)
	end;
})

local TestCaseHeroAttrHelper = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	testGetFCAttrVal = function(self)
		assert ( HeroAttrHelper:getFCAttrVal(self.hero) == 0 )
		
		self.hero:carrySoldier({resid=150001001,number=1})
		assert ( HeroAttrHelper:getFCAttrVal(self.hero) > 0 )
	end;
})

local TestCasePlayerLineup = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self);
	end;
	
	testAddDefaultLineup = function(self)
		self.player:addLineup(FIXID.DEFAULTLINEUP)
		assert ( self.player:getLineups().count == 1 )
		assert ( self.player:hasLineup(FIXID.DEFAULTLINEUP) == true )
	end;
	
	testClearLineup = function(self)
		self.player:addLineup(FIXID.DEFAULTLINEUP)
		assert ( self.player:getLineups().count == 1 )
		self.player:clearLineups()
		assert ( self.player:getLineups().count == 0 )
	end;
})

tqPlayers_t_main = function(suite)
	suite:addTestCase(TestCasePlayer, 'TestCasePlayer')
	suite:addTestCase(TestCaseCityRes, 'TestCaseCityRes')
	suite:addTestCase(TestCasePlayerCity, 'TestCasePlayerCity')
	suite:addTestCase(TestCasePlayerCitys, 'TestCasePlayerCitys')
	suite:addTestCase(TestCaseRecalcRoleAttr, 'TestCaseRecalcRoleAttr')
	suite:addTestCase(TestCaseHeroAttrHelper, 'TestCaseHeroAttrHelper')
	suite:addTestCase(TestCasePlayerLineup, 'TestCasePlayerLineup')
end;



