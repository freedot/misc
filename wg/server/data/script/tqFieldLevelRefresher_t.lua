require('tqFieldLevelRefresher')

local TestCaseFieldLevelRefresher = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		self.ownerPlayer = TestCaseHelper:loadPlayerByUserNameEx('owner', 'owner_r', 200000)
		TestCaseCondition:setPreCond(self.ownerPlayer, nil, { lineups={180001,180002}, heros={{level=10,state=1,soldier={resid=150001010,number=10}} } })
		self.refresher = app:getCityMgr().fieldLevelRefresher
		
		res_fields_level = {{zhanlingdrop=7500141,getiron=10000,level=1,getwood=20000,dantiaodrop=7500151,heros={7600001},getfood=30000,peardropid=7500161,getstone=40000,id=170001001},
								{zhanlingdrop=7500141,getiron=100000,level=2,getwood=200000,dantiaodrop=7500151,heros={7600001},getfood=300000,peardropid=7500161,getstone=400000,id=170001002}}
		res_drops={{roleexp={pro=0,maxnum=0,minnum=0},items={{pro=100,maxnum=1,id=3000085,minnum=1},{pro=100,maxnum=2,id=3000086,minnum=2},{pro=100,maxnum=1,id=3000087,minnum=1},{pro=100,maxnum=1,id=3000088,minnum=1},{pro=100,maxnum=1,id=3000089,minnum=1},{pro=100,maxnum=1,id=3000090,minnum=1},{pro=100,maxnum=1,id=3000091,minnum=1},{pro=0,maxnum=0,id=0,minnum=0},{pro=0,maxnum=0,id=0,minnum=0},{pro=0,maxnum=0,id=0,minnum=0}},credit={pro=0,maxnum=0,minnum=0},heroexp={pro=0,maxnum=0,minnum=0},randtype=0,id=7500161}}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	testRefreshCommFieldLevel = function(self)
		local grid = app:getCityMgr():getGridByGridId(2)
		grid.objType = OBJ_TYPE.FIELD
		
		self.mm:mock(math, 'random', nil, function(maxval) return maxval end )
		self.mm:mock(self.refresher, '_getObjType', {OBJ_TYPE.NONE})
		self.refresher:_refreshCommFieldLevel(grid)
		
		assertEQ ( self.mm.params['_getObjType'], {170006})
		assert ( grid.objType == OBJ_TYPE.NONE )
		assert ( grid.level == 10 )
		assert ( grid.resId == 170006 )
		assert ( grid.modelId == 17000601 )
		assert ( grid.refreshTime == Util:getTime() )
		assert ( getLastSql_t() == "update mapgrids set objType='0', resId='170006', modelId='17000601', level='10' where gridId=2;" )
	end;
	
	testRefreshOwnerFieldLevel_noToZeroLevel = function(self)
		TestCaseHelper:addSelfField(self.ownerPlayer, {x=1, y=0})
		local grid = app:getCityMgr():getGridByGridId(2)
		grid.level = 10
		self.refresher:_refreshOwnerFieldLevel(grid)
		assert ( grid.level == 9 )
		assert ( grid.refreshTime == Util:getTime() )
		assert ( selectSendMsgCnt_t('has@selffields:') == 1 )
		assert ( selectSendMsgCnt_t('has@msgid:100012,params:%[1,0,9%]') == 2 )
		assert ( getLastSql_t() == "update mapgrids set level='9' where gridId=2;" )
	end;
	
	test__refreshOwnerFieldLevel_toZeroLevel = function(self)
		self.mm:nologMock(global.getTimer(), 'start')
		local gridId = 2
		TestCaseHelper:addSelfField(self.ownerPlayer, {x=1, y=0})
		local grid = app:getCityMgr():getGridByGridId(gridId)
		grid.level = 1
		
		self.mm:mock(self.refresher, '_refreshCommFieldLevel')
		
		local army = TestArmyResHelper:createArmyEx(self.ownerPlayer, FieldPlayer(gridId), EXPED_TYPE.PAIQIAN, ARMYDYN_STATE.DISPATCH)
		self.ownerPlayer:getSelfField():startCollect(gridId, 1)
		Util:setTimeDrt(2*3600)
		self.refresher:_refreshOwnerFieldLevel(grid)
		assert ( self.mm.walkLog == '_refreshCommFieldLevel', 'refresh the field by rand level' )
		
		assert ( self.ownerPlayer:getCityRes():getFood() > 0, 'get collect common res' )
		assert ( self.ownerPlayer:getPkg():getItemNumber(3000088) > 0, 'get collect pear res' )
		
		assert ( army.state == ARMYDYN_STATE.RETURN ) 
		assertEQ ( self.mm.params['start'][2][1], TIMER_EVT.EXPED_RETURN_STOP, 'send army return timer' )
		
		assert ( self.ownerPlayer:getSelfField():getCount() == 0, 'delete it from self field' )
		assert ( selectSendMsgCnt_t('eq@{cmd:96,selffields:[{id:2,_d:1}]}') == 1, 'delete it from self field' )
		assert ( selectSendMsgCnt_t('has@msgid:100039,params:%[1,0%]') == 2, 'delete it from self field' )
		
		assert ( grid.roleId == 0 , 'set it to comm field' )
	end;
	
	testRefreshFieldLevel = function(self)
		local grid = app:getCityMgr():getGridByGridId(2)
		grid.objType = OBJ_TYPE.ROLE
		grid.roleId = 0
		
		self.mm:mock(self.refresher, '_refreshCommFieldLevel')
		self.mm:mock(self.refresher, '_refreshOwnerFieldLevel')
		self.refresher:_refreshFieldLevel(grid)
		assert ( self.mm.walkLog == '' )
		
		self.mm:clear()
		grid.objType = OBJ_TYPE.NPCFIELD
		grid.roleId = 0
		self.refresher:_refreshFieldLevel(grid)
		assert ( self.mm.walkLog == '' )
		
		self.mm:clear()
		grid.objType = OBJ_TYPE.FIELD
		grid.roleId = 0
		self.refresher:_refreshFieldLevel(grid)
		assert ( self.mm.walkLog == '_refreshCommFieldLevel' )
		
		self.mm:clear()
		grid.objType = OBJ_TYPE.FIELD
		grid.roleId = 1
		self.refresher:_refreshFieldLevel(grid)
		assert ( self.mm.walkLog == '_refreshOwnerFieldLevel' )
		
		self.mm:clear()
		grid.objType = OBJ_TYPE.NONE
		grid.roleId = 0
		self.refresher:_refreshFieldLevel(grid)
		assert ( self.mm.walkLog == '_refreshCommFieldLevel' )
		
		self.mm:clear()
		grid.objType = OBJ_TYPE.NONE
		grid.roleId = 1
		self.refresher:_refreshFieldLevel(grid)
		assert ( self.mm.walkLog == '' )
	end;
	
	testRefreshFieldsLevel = function(self)
		local methodMock = MethodMock()
		methodMock.grids = {}
		methodMock:mock(self.refresher, '_refreshFieldLevel', function(self, grid) table.insert(methodMock.grids, grid) end)
		
		self.refresher.maxCount = 2
		self.refresher.countInSec = 2
		self.refresher:_refreshFieldsLevel(1)
		methodMock:restore()
		
		assert ( table.getn(methodMock.grids) == 2 )
		assert ( methodMock.grids[1].gridId == 1 )
		assert ( methodMock.grids[2].gridId == 2 )
	end;
	
	testRefreshFieldsLevel_nilGrid = function(self)
		self.mm:mock(app:getCityMgr(), 'getGridByGridId', {nil} )
		self.refresher.maxCount = 2
		self.refresher.countInSec = 2
		self.refresher:_refreshFieldsLevel(1)
	end;
	
	testStart = function(self)
		self.refresher.lastId = 100
		self.refresher.maxCount = 0
		self.refresher:start()
		assert ( self.refresher.lastId == 1 )
		assert ( self.refresher.maxCount == GRIDS_COUNT )
	end;
	
	testRefresh = function(self)
		self.refresher:start()
		
		local methodMock = MethodMock()
		methodMock:mock(self.refresher, '_refreshFieldsLevel', function(self, lastId)  methodMock.lastId = lastId end)
		self.refresher:refresh()
		methodMock:restore()
		
		assert ( methodMock.lastId == 1 )
		assert ( self.refresher.lastId == 1 + self.refresher.countInSec + 1 )
	end;
	
	testIsComplete = function(self)
		self.refresher.lastId = 1
		self.refresher.maxCount = 2
		assert ( self.refresher:isComplete() == false )
		
		self.refresher.lastId = 2
		self.refresher.maxCount = 2
		assert ( self.refresher:isComplete() == true )
		
		self.refresher.lastId = 3
		self.refresher.maxCount = 2
		assert ( self.refresher:isComplete() == true )
	end;
	
	test_giveUpSelfField = function(self)
		self.mm:mock(self.refresher.giveUpSelfFieldHdr, 'handle', {true})
		self.mm:mock(self.refresher, '_sendGiveUpMail')
		self.refresher:_giveUpSelfField({gridId=100, roleId=200000})
		assertEQ ( self.mm.walkLog, 'handle,_sendGiveUpMail' );
		assertEQ ( self.mm.params['handle'], {self.ownerPlayer, {fieldId=100, collectReason=COLLECT_REASON.REFRESH}} );
		assertEQ ( self.mm.params['_sendGiveUpMail'], {self.ownerPlayer, {gridId=100, roleId=200000}} );
	end;
	
	test__getObjType = function(self)
		assertEQ ( self.refresher:_getObjType(FIXID.PINGDIFIELDID), OBJ_TYPE.NONE)
		assertEQ ( self.refresher:_getObjType(FIXID.PINGDIFIELDID-1), OBJ_TYPE.FIELD)
	end;
	
	test__sendGiveUpMail = function(self)
		self.player:setRoleName('role')
		self.mm:mock(app:getMailMgr(), 'addSysMail', {{name='mail'}} )
		self.mm:mock(MailSender, 'sendBriefMail' )
		
		self.refresher:_sendGiveUpMail(self.player, {gridId=2})
		assertEQ ( self.mm.walkLog, 'addSysMail,sendBriefMail' )
		local content = string.format(rstr.mail.content.autoGiveUpField, 1, 0)
		assertEQ ( self.mm.params['addSysMail'], {'role', rstr.mail.title.autoGiveUpField, FIXID.COMM_SYS_MAILTEMP, content} )
		assertEQ ( self.mm.params['sendBriefMail'], {self.player, {name='mail'}} )
	end;
})


tqFieldLevelRefresher_t_main = function(suite)
	suite:addTestCase(TestCaseFieldLevelRefresher, 'TestCaseFieldLevelRefresher')
end;


