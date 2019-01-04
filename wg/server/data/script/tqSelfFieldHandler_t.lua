--*******************************************************************************
--*******************************************************************************
require('tqSelfFieldHandler')

local TestCaseCmdSelfFieldHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.selfFieldHandler = CmdSelfFieldHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assert ( self.selfFieldHandler:getHandler(-1):getClass() == NullHandler )
		assert ( self.selfFieldHandler:getHandler(0):getClass() == GetAllSelfFieldsHandler )
		assert ( self.selfFieldHandler:getHandler(1):getClass() == StartCollectHandler )
		assert ( self.selfFieldHandler:getHandler(2):getClass() == StopCollectHandler )
		assert ( self.selfFieldHandler:getHandler(3):getClass() == GiveUpFieldHandler )
		assert ( self.selfFieldHandler:getHandler(4):getClass() == RecallArmyFieldHandler )
		assert ( self.selfFieldHandler:getHandler(5):getClass() == GetCurCanGetResHandler )
	end;
})

local TestCaseGetAllSelfFieldsHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(PlayerSelfFieldSender, 'sendAllSelfFields')
		GetAllSelfFieldsHandler():handle(self.player)
		assertEQ ( self.mm.walkLog, 'sendAllSelfFields' )
		assertEQ ( self.mm.params['sendAllSelfFields'], {self.player} )
	end;
})

local TestCaseSelfFieldHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = SelfFieldHandler()
		self.hdr.player = self.player
		self.hdr.field = {gridId=1}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_armyReturn = function(self)
		local r_army = {nil}
		local r_needTime = {10}
		self.mm:mock(self.player:getSelfField(), 'getOccupyArmy', r_army)
		self.mm:mock(app:getArmyMgr(), 'getArmyExpedNeedFullTime', r_needTime)
		self.mm:mock(app:getArmyMgr(), 'changeArmy')
		self.mm:mock(MilitarySender, 'sendArmyState')
		
		self.hdr:armyReturn()
		assertEQ ( self.mm.walkLog, 'getOccupyArmy' )
		assertEQ ( self.mm.params['getOccupyArmy'], {1} )
		
		self.mm:clear()
		r_army[1] = {armyId=2}
		self.hdr:armyReturn()
		assertEQ ( self.mm.walkLog, 'getOccupyArmy,getArmyExpedNeedFullTime,changeArmy,sendArmyState' )
		assertEQ ( self.mm.params['getArmyExpedNeedFullTime'], {2} )
		assertEQ ( self.mm.params['changeArmy'], {2,ARMYDYN_STATE.RETURN, FIGHT_FLAG.UNFIGHT, Util:getTime()+10} )
		assertEQ ( self.mm.params['sendArmyState'], {self.player, 2} )
	end;
})

local TestCaseStartCollectHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		self.cmd = {fieldId=2}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testNotSelfField = function(self)
		StartCollectHandler:handle(self.sourcePlayer, self.cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testInCollectState = function(self)
		TestCaseHelper:addSelfField(self.sourcePlayer, {x=1, y=0})
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001}, heros={{state=1,soldier={resid=150001010,number=10}},{state=1,soldier={resid=150002005,number=10}} } })	
		TestArmyResHelper:createArmyEx(self.sourcePlayer, FieldPlayer(2), EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.DISPATCH)
		self.sourcePlayer:getSelfField():getFieldById(2).startTime = 1
		
		StartCollectHandler:handle(self.sourcePlayer, self.cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testNoHasCollectArmy = function(self)
		TestCaseHelper:addSelfField(self.sourcePlayer, {x=1, y=0})
		StartCollectHandler:handle(self.sourcePlayer, self.cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testNoCollectSoldier = function(self)
		TestCaseHelper:addSelfField(self.sourcePlayer, {x=1, y=0})
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001}, heros={{state=1,soldier={resid=150001010,number=0}},{state=1,soldier={resid=150002005,number=0}} } })	
		TestArmyResHelper:createArmyEx(self.sourcePlayer, FieldPlayer(2), EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.DISPATCH)
		
		StartCollectHandler:handle(self.sourcePlayer, self.cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testStartCollectOk = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask')
		TestCaseHelper:addSelfField(self.sourcePlayer, {x=1, y=0})
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001}, heros={{state=1,soldier={resid=150001010,number=10}} } })	
		TestArmyResHelper:createArmyEx(self.sourcePlayer, FieldPlayer(2), EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.DISPATCH)
		
		Util:setTimeDrt(1)
		StartCollectHandler:handle(self.sourcePlayer, self.cmd)
		
		assert ( self.sourcePlayer:getSelfField():getFieldById(2).startTime == Util:getTime(), 'set curTime eq startTime' )
		assert ( self.sourcePlayer:getSelfField():getFieldById(2).soldierNumber == 10 )
		assert ( selectSendMsgCnt_t('has@selffields:') == 1, 'send startTime msg to client' )
		assertEQ ( self.mm.params['trigerTask'], {self.sourcePlayer, TASK_FINISH_TYPE.GET_RES_FROMFIELD} )
	end;
})

local TestCaseStopCollectBase = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		self.cmd = {fieldId=2}
		
		res_fields_level = {{zhanlingdrop=7500141,getiron=10000,level=1,getwood=20000,dantiaodrop=7500151,heros={7600001},getfood=30000,peardropid=7500161,getstone=40000,id=170001001},
								{zhanlingdrop=7500141,getiron=100000,level=2,getwood=200000,dantiaodrop=7500151,heros={7600001},getfood=300000,peardropid=7500161,getstone=400000,id=170001002}}
		res_drops={{roleexp={pro=0,maxnum=0,minnum=0},items={{pro=100,maxnum=1,id=3000085,minnum=1},{pro=100,maxnum=2,id=3000086,minnum=2},{pro=100,maxnum=1,id=3000087,minnum=1},{pro=100,maxnum=1,id=3000088,minnum=1},{pro=100,maxnum=1,id=3000089,minnum=1},{pro=100,maxnum=1,id=3000090,minnum=1},{pro=100,maxnum=1,id=3000091,minnum=1},{pro=0,maxnum=0,id=0,minnum=0},{pro=0,maxnum=0,id=0,minnum=0},{pro=0,maxnum=0,id=0,minnum=0}},credit={pro=0,maxnum=0,minnum=0},heroexp={pro=0,maxnum=0,minnum=0},randtype=0,id=7500161}}
		
		local g_mm = self.mm
		self.mm.sysMailCount = 0
		self.sysMail = {}
		self.mm:mock(app:getMailMgr(), 'addSysMail', {self.sysMail}, function(self)  
			g_mm.sysMailCount = g_mm.sysMailCount + 1 
			end)
		self.mm:mock(MailSender, 'sendBriefMail')
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
})

local TestCaseStopCollectHandler = TestCaseStopCollectBase:extends({
	setCollectPre = function(self, maxGridsCnt, collectReason)
		TestCaseHelper:addSelfField(self.sourcePlayer, {x=1, y=0})
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001}, heros={{state=1,soldier={resid=150001010,number=10}},{state=1,soldier={resid=150002005,number=10}} } })	
		TestArmyResHelper:createArmyEx(self.sourcePlayer, FieldPlayer(2), EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.DISPATCH)
		Util:setTimeDrt(1)
		self.sourcePlayer:getSelfField():startCollect(2, Util:getTime())
		Util:setTimeDrt(3600*2)
		self.sourcePlayer:getPkg():setMaxGridsCnt(maxGridsCnt)
		self.cmd.collectReason = collectReason
	end;
	
	testNotInCollectState = function(self)
		TestCaseHelper:addSelfField(self.sourcePlayer, {x=1, y=0})
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001}, heros={{state=1,soldier={resid=150001010,number=10}},{state=1,soldier={resid=150002005,number=10}} } })	
		TestArmyResHelper:createArmyEx(self.sourcePlayer, FieldPlayer(2), EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.DISPATCH)
		self.sourcePlayer:getSelfField():getFieldById(2).startTime = 0
		
		StopCollectHandler:handle(self.sourcePlayer, self.cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testStopOk_collectReasonManual_hasEnoughPkgSpace = function(self)
		self:setCollectPre(100, 1)
		StopCollectHandler():handle(self.sourcePlayer, self.cmd)
		
		assert ( self.sourcePlayer:getCityRes():getFood() > 0, 'get collect common res' )
		assert ( self.sourcePlayer:getPkg():getItemNumber(3000088) > 0, 'get collect pear res' )
		assert ( self.sourcePlayer:getSelfField():getStartTime(2) == 0, 'stop collect time' )
		
		assert ( selectSendMsgCnt_t('has@selffields:') == 2, 'send startTime msg to client' )
		assert ( selectSendMsgCnt_t('has@res:{cres:{food:') == 1, 'send comm res msg to client' )
		assert ( selectSendMsgCnt_t('has@pkg:{items:') == 1, 'send pear res msg to client' )
	end;
	
	testStopOk_collectReasonManual_noEnoughPkgSpace = function(self)	
		self:setCollectPre(1, 1)
		StopCollectHandler():handle(self.sourcePlayer, self.cmd)
		
		assert ( self.sourcePlayer:getCityRes():getFood() > 0, 'get collect common res' )
		assert ( self.sourcePlayer:getPkg():getItemNumber(3000088) == 0, 'item pkg full' )
		
		assert ( self.mm.sysMailCount == 1, 'send item by mail' )
		assert ( table.getn(self.mm.params['addSysMail'][5]) > 0 , 'send item by mail' )
	end;
	
	testStopOk_ManualCollect_hasEnoughPkgSpace = function(self)
		self:setCollectPre(100, 0)
		StopCollectHandler():handle(self.sourcePlayer, self.cmd)
		
		assert ( self.sourcePlayer:getCityRes():getFood() > 0, 'get collect common res' )
		assert ( self.sourcePlayer:getPkg():getItemNumber(3000088) > 0, 'get collect pear res' )
		assert ( self.sourcePlayer:getSelfField():getStartTime(2) == 0, 'stop collect time' )
	end;
	
	testStopOk_ManualCollect_noEnoughPkgSpace = function(self)
		local handler = StopCollectHandler()
		
		self:setCollectPre(1, 0)
		handler:handle(self.sourcePlayer, self.cmd)
		
		assert ( self.sourcePlayer:getCityRes():getFood() == 0, 'not get collect common res' )
		assert ( self.sourcePlayer:getPkg():getItemNumber(3000088) == 0, 'not get collect pear res' )
		assert ( self.sourcePlayer:getSelfField():getStartTime(2) > 0, 'not stop collect time' )
		
		assert ( self.mm.sysMailCount == 0, 'not send item by mail' )
		
		assert ( selectSendMsgCnt_t('has@msgid:100015,params:') == 2, 'send why not msg tip to client' )
	end;
	
	test_collectItemsRes = function(self)
		local handler = StopCollectHandler()
		
		handler.player = self.player
		handler.player.objType = -1
		assert ( handler:collectItemsRes({}) == false, 'not role' )
		
		local g_items = {}
		local g_dictItemsToListItemsRt = {{}}
		local g_createRawItemsRt = {{}}
		local g_addItemsRt = {true}
		
		self.mm:mock(FieldCollector, 'dictItemsToListItems', g_dictItemsToListItemsRt)
		self.mm:mock(handler.dropItem, 'createRawItems', g_createRawItemsRt)
		self.mm:mock(self.player:getPkg(), 'addItems', g_addItemsRt)
		self.mm:mock(WUtil, 'sendSuccMsgArgs')
		
		handler.player.objType = OBJ_TYPE.ROLE
		assert ( handler:collectItemsRes(g_items) == true )
		assert ( self.mm.walkLog == 'dictItemsToListItems,createRawItems' )
		assertListEQ ( self.mm.params['dictItemsToListItems'], {g_items} )
		assertListEQ ( self.mm.params['createRawItems'], {g_dictItemsToListItemsRt[1]} )
		
		self.mm:clear()
		g_createRawItemsRt[1] = {{},{}}
		assert ( handler:collectItemsRes(g_items) == true )
		assert ( self.mm.walkLog == 'dictItemsToListItems,createRawItems,addItems' )
		assertListEQ ( self.mm.params['addItems'], {g_createRawItemsRt[1]} )
		
		self.mm:clear()
		g_addItemsRt[1] = false
		handler.collectReason = COLLECT_REASON.MANUAL
		assert ( handler:collectItemsRes(g_items) == false )
		assert ( self.mm.walkLog == 'dictItemsToListItems,createRawItems,addItems,sendSuccMsgArgs' )
		assertListEQ ( self.mm.params['sendSuccMsgArgs'], {self.player, 100015, ''} )
		
		self.mm:clear()
		handler.collectReason = COLLECT_REASON.REFRESH
		assert ( handler:collectItemsRes(g_items) == true )
		assert ( self.mm.walkLog == 'dictItemsToListItems,createRawItems,addItems,addSysMail,sendBriefMail' )
		assertListEQ ( self.mm.params['addSysMail'], {self.player:getRoleName(), rstr.mail.title.collectitems, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.collectitems, g_createRawItemsRt[1]} )
		assertListEQ ( self.mm.params['sendBriefMail'], {self.player, self.sysMail} )
	end;
})

local TestCaseGiveUpFieldHandler = TestCaseStopCollectBase:extends({
	test_init = function(self)
		local hdr = GiveUpFieldHandler()
		assertEQ ( hdr.stopCollectHandler:getClass(), StopCollectHandler)
	end;
	
	test_handle = function(self)
		local hdr = GiveUpFieldHandler()
		
		local r_getParam = {false}
		self.mm:mock( hdr, 'getParam', r_getParam)
		self.mm:mock( hdr, '_delayCreateObj')
		self.mm:mock( hdr.stopCollectHandler, 'handle', {true})
		self.mm:mock( hdr, 'armyReturn')
		self.mm:mock( hdr, '_deleteSelfField')
		self.mm:mock( hdr, '_refreshCurFields')
		
		local cmd = {}
		hdr:handle(self.player, cmd)
		assertEQ ( self.mm.walkLog, 'getParam' )
		assertEQ ( self.mm.params['getParam'], {self.player, cmd} )
		
		self.mm:clear()
		r_getParam[1] = true
		hdr.player = self.player
		hdr:handle(self.player, cmd)
		assertEQ ( self.mm.walkLog, 'getParam,_delayCreateObj,handle,armyReturn,_deleteSelfField,_refreshCurFields' )
		assertEQ ( self.mm.params['handle'], {self.player, cmd} )
	end;
	
	test__deleteSelfField = function(self)
		local hdr = GiveUpFieldHandler()
		hdr.player = self.player
		hdr.field = {gridId=2}
		
		self.mm:mock(app:getCityMgr(), 'clearOccupyFieldGrid')
		self.mm:mock(PlayerSelfFieldSender, 'sendDeleteSelfField')
		self.mm:mock(hdr, '_getCollectReasonSysMsgId', {100013})
		self.mm:mock(WUtil, 'sendSuccMsgArgs')
		self.mm:mock(self.player:getSelfField(), 'deleteField')
		
		hdr:_deleteSelfField()
		assertEQ ( self.mm.walkLog, 'sendDeleteSelfField,_getCollectReasonSysMsgId,sendSuccMsgArgs,clearOccupyFieldGrid,deleteField' )
		assertEQ ( self.mm.params['clearOccupyFieldGrid'], {hdr.field.gridId} )
		assertEQ ( self.mm.params['sendDeleteSelfField'], {self.player, hdr.field.gridId} )
		assertEQ ( self.mm.params['sendSuccMsgArgs'], {self.player, 100013, '1,0'} )
		assertEQ ( self.mm.params['deleteField'], {hdr.field} )
	end;
	
	test__getCollectReasonSysMsgId = function(self)
		local hdr = GiveUpFieldHandler()
		hdr.stopCollectHandler.collectReason = COLLECT_REASON.MANUAL
		assertEQ ( hdr:_getCollectReasonSysMsgId(), 100013)
		
		hdr.stopCollectHandler.collectReason = COLLECT_REASON.REFRESH
		assertEQ ( hdr:_getCollectReasonSysMsgId(), 100039)
		
		hdr.stopCollectHandler.collectReason = COLLECT_REASON.BEATTACKED
		assertEQ ( hdr:_getCollectReasonSysMsgId(), 100093)
	end;
	
	test__delayCreateObj = function(self)
		local hdr = GiveUpFieldHandler()
		self.mm:mock(RefreshCurFieldsHandler, 'new', {{name='refreshHdr'}})
		hdr:_delayCreateObj()
		assertEQ ( self.mm.walkLog, 'new' )
		assertEQ ( hdr.refreshCurFieldsHdr, {name='refreshHdr'} )
		
		self.mm:clear()
		hdr:_delayCreateObj()
		assertEQ ( self.mm.walkLog, '', 'only create one time' )
	end;
	
	test__refreshCurFields = function(self)
		local hdr = GiveUpFieldHandler()
		hdr.player = self.player
		hdr:_delayCreateObj()
		self.mm:mock(hdr.refreshCurFieldsHdr, 'handle')
		hdr:_refreshCurFields()
		assertEQ ( self.mm.params['handle'], {self.player} )
	end;
	
	testGiveUpOk = function(self)
		self.mm:nologMock(global.getTimer(), 'start')
		TestCaseHelper:addSelfField(self.sourcePlayer, {x=1, y=0})
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001}, heros={{state=1,soldier={resid=150001010,number=10}},{state=1,soldier={resid=150002005,number=10}} } })	
		
		local army = TestArmyResHelper:createArmyEx(self.sourcePlayer, FieldPlayer(2), EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.DISPATCH)
		Util:setTimeDrt(1)
		self.sourcePlayer:getSelfField():startCollect(2, Util:getTime())
		Util:setTimeDrt(3600*2)
		
		
		GiveUpFieldHandler():handle(self.sourcePlayer, self.cmd)
		
		assert ( self.sourcePlayer:getCityRes():getFood() > 0, 'get collect common res' )
		assert ( self.sourcePlayer:getPkg():getItemNumber(3000088) > 0, 'get collect pear res' )
		
		assert ( selectSendMsgCnt_t('has@selffields:%[{id:2,resid:') == 1, 'send startTime msg to client' )
		assert ( selectSendMsgCnt_t('has@res:{cres:{food:') == 1, 'send comm res msg to client' )
		assert ( selectSendMsgCnt_t('has@pkg:{items:') == 1, 'send pear res msg to client' )
		
		assert ( army.state == ARMYDYN_STATE.RETURN ) 
		assertEQ ( self.mm.params['start'][2][1], TIMER_EVT.EXPED_RETURN_STOP, 'send army return timer' )

		assert ( self.sourcePlayer:getSelfField():getCount() == 0, 'delete it from self field' )
		assert ( selectSendMsgCnt_t('eq@{cmd:96,selffields:[{id:2,_d:1}]}') == 1, 'delete it from self field' )
		assert ( selectSendMsgCnt_t('has@msgid:100013,params:%[1,0') == 2, 'delete it from self field' )
		
		local grid = app:getCityMgr():getGridByGridId(2)
		assert ( grid.roleId == 0 , 'set it to comm field' )
	end;
	
	testGiveUpOkAndDeleteEnemyArmyFromContainers = function(self)
		TestCaseHelper:addSelfField(self.sourcePlayer, {x=1, y=0})
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001}, heros={{state=1,soldier={resid=150001010,number=10}},{state=1,soldier={resid=150002005,number=10}} } })	
		local army = TestArmyResHelper:createArmyEx(self.sourcePlayer, FieldPlayer(2), EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.DISPATCH)
		local grid = app:getCityMgr():getGridByGridId(2)
		grid.objType = OBJ_TYPE.FIELD
		grid.roleId = 200000
		grid.roleName = 'source_r'
		
		local enemyPlayer = TestCaseHelper:loadPlayerByUserNameEx('enemy', 'enemy_r', 200001)
		local enemyArmy = TestArmyResHelper:createArmyEx(enemyPlayer, OwnerFieldPlayer(2), EXPED_TYPE.DANTIAO, ARMYDYN_STATE.DISPATCH)
		
		assertEQ ( self.sourcePlayer:getArmyContainer():getEnemyArmyCount(), 1 )
		GiveUpFieldHandler():handle(self.sourcePlayer, self.cmd)
		assertEQ ( self.sourcePlayer:getArmyContainer():getEnemyArmyCount(), 0 )
	end;
})

local TestCaseRecallArmyFieldHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		self.cmd = {fieldId=2}
		self.recallArmyFieldHandler = RecallArmyFieldHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testNotSelfField = function(self)
		RecallArmyFieldHandler():handle(self.sourcePlayer, self.cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testNoHasCollectArmy = function(self)
		TestCaseHelper:addSelfField(self.sourcePlayer, {x=1, y=0})
		RecallArmyFieldHandler():handle(self.sourcePlayer, self.cmd)
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testRecallArmyOk = function(self)
		local army = TestArmyResHelper:createArmyEx(self.sourcePlayer, FieldPlayer(2), EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.DISPATCH)
		TestCaseHelper:addSelfField(self.sourcePlayer, {x=1, y=0})
		
		local methodMock = MethodMock()
		methodMock:mock(self.recallArmyFieldHandler.stopCollectHandler, 'handle', function(self, player, cmd) 
			methodMock.player = player
			methodMock.cmd = cmd
			methodMock.walkLog = 'stopCollectHandler.handle'
			end)
		methodMock:mock(self.recallArmyFieldHandler, 'armyReturn', function(self) 
			methodMock.walkLog = methodMock.walkLog..',armyReturn'
			end)
		self.recallArmyFieldHandler:handle(self.sourcePlayer, self.cmd)
		methodMock:restore()
		
		assert ( methodMock.player == self.sourcePlayer )
		assert ( methodMock.cmd == self.cmd )
		assert ( methodMock.walkLog == 'stopCollectHandler.handle,armyReturn' )
	end;
})

local TestCaseGetCurCanGetResHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = GetCurCanGetResHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local g_getParamRt = {false}
		local g_isInCollectStateRt = {false}
		self.mm:mock(self.hdr, 'getParam', g_getParamRt)
		self.mm:mock(self.hdr, 'isInCollectState', g_isInCollectStateRt)
		self.mm:mock(PlayerSelfFieldSender, 'sendCanGetRes')
		self.mm:mock(self.hdr, '_sendGetRes')
	
		local g_cmd = {}
		assertEQ ( self.hdr:handle(self.player, g_cmd), false )
		assertEQ ( self.mm.walkLog, 'getParam' )
		assertEQ ( self.mm.params['getParam'], {self.player, g_cmd} )
		
		self.mm:clear()
		self.hdr.field = {gridId=1}
		self.hdr.player = self.player
		g_getParamRt[1] = true
		assertEQ ( self.hdr:handle(self.player, g_cmd), false )
		assertEQ ( self.mm.walkLog, 'getParam,isInCollectState,sendCanGetRes' )
		assertEQ ( self.mm.params['sendCanGetRes'], {self.player, 1, {food=0, wood=0, stone=0, iron=0}} )
		
		self.mm:clear()
		g_isInCollectStateRt[1] = true
		assertEQ ( self.hdr:handle(self.player, g_cmd), true )
		assertEQ ( self.mm.walkLog, 'getParam,isInCollectState,_sendGetRes' )
	end;
	
	test__sendGetRes = function(self)
		self.hdr.field = {gridId=1}
		self.hdr.player = self.player
		
		self.mm:mock(FieldCollector, 'setParam')
		self.mm:mock(FieldCollector, 'getCommRes', { {food=1, wood=2, stone=3, iron=4} })
		self.mm:mock(PlayerSelfFieldSender, 'sendCanGetRes')
		
		self.hdr:_sendGetRes()
		
		assertEQ ( self.mm.walkLog, 'setParam,getCommRes,sendCanGetRes' )
		assertEQ ( self.mm.params['setParam'], {1, Util:getTime()} )
		assertEQ ( self.mm.params['sendCanGetRes'], {self.player, 1, {food=1, wood=2, stone=3, iron=4}} )
	end;
})

tqSelfFieldHandler_t_main = function(suite)
	suite:addTestCase(TestCaseCmdSelfFieldHandler, 'TestCaseCmdSelfFieldHandler')
	suite:addTestCase(TestCaseGetAllSelfFieldsHandler, 'TestCaseGetAllSelfFieldsHandler')
	suite:addTestCase(TestCaseSelfFieldHandler, 'TestCaseSelfFieldHandler')
	suite:addTestCase(TestCaseStartCollectHandler, 'TestCaseStartCollectHandler')
	suite:addTestCase(TestCaseStopCollectHandler, 'TestCaseStopCollectHandler')
	suite:addTestCase(TestCaseGiveUpFieldHandler, 'TestCaseGiveUpFieldHandler')
	suite:addTestCase(TestCaseRecallArmyFieldHandler, 'TestCaseRecallArmyFieldHandler')
	suite:addTestCase(TestCaseGetCurCanGetResHandler, 'TestCaseGetCurCanGetResHandler')
end;

