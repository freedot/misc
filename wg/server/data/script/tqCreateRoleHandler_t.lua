require('tqCreateRoleHandler')

local TestCaseCreateRole = TestCase:extends({
	setUp = function(self)
		local fixRoleBuildData_ = FixRoleData_t.fixRoleBuildData
		FixRoleData_t.fixRoleBuildData = function() end
		TestCaseHelper:createPlayer(self)
		FixRoleData_t.fixRoleBuildData = fixRoleBuildData_
	end;
	
	tearDown = function(self)	
		TestCaseHelper:clearAll(self)
	end;

	testCheckNameVaild = function(self)
		assert(ValidChecker:isRoleName('') == false)
		assert(getLastErrorStr() == rstr.validname.role.empty)
	
		assert(ValidChecker:isRoleName('abc\'d') == false, 'include invalid char \' ')
		assert(ValidChecker:isRoleName('abc\"d') == false, 'include invalid char \" ') 
		assert(ValidChecker:isRoleName('abc d') == false, 'include invalid char \" ') 
		assert(ValidChecker:isRoleName('abc-d') == false)
		assert(ValidChecker:isRoleName('abc,d') == false)
		assert(getLastErrorStr() == rstr.validname.role.invalid)
		
		assert(ValidChecker:isRoleName('abcd') == true)
		assert(ValidChecker:isRoleName('ab') == false, 'length less then 3 ')
		assert(ValidChecker:isRoleName('帝') == false, 'length less then 3 ')
		assert(getLastErrorStr() == rstr.validname.role.short)
		
		assert(ValidChecker:isRoleName('abdeddsdsdsdw') == false, 'length greater then 12')
		assert(ValidChecker:isRoleName('帝王帝王帝帝1') == false, 'length greater then 12')
		assert(getLastErrorStr() == rstr.validname.role.long)
		
		assert(ValidChecker:isRoleName('ab_fuck') == false, 'has dirty word')
		assert(ValidChecker:isRoleName('abGM') == false, 'has dirty word')
		assert(getLastErrorStr() == rstr.validname.role.mask)
	
		assert(ValidChecker:isNewRoleName('exist') == false)
		assert(getLastErrorStr() == rstr.validname.role.exist)
	end;
	
	testCheckValidCmd = function(self)
		local cmd = {subcmd=1,rname="ab_fuck"}
		clearSendMsg_t()
		CreateRoleHandler():onRequest(self.player, nil, cmd)
		local rtmsg = '{cmd:'..NETCMD.CREATEROLE..',subid:1,check:"rname",result:"'..rstr.validname.role.mask..'"}'
		assert(getSendMsg_t() == rtmsg)
		
		cmd = {subcmd=1,rname="hello"}
		clearSendMsg_t()
		CreateRoleHandler():onRequest(self.player, nil, cmd)
		rtmsg = '{cmd:'..NETCMD.CREATEROLE..',subid:1,check:"rname",result:"OK"}'
		assert(getSendMsg_t() == rtmsg)
	end;
	
	testCreateRoleCmd = function(self)
		res_online_tasks = {
			{id=1790001, precond={taskId=0}, type=TASK_TYPE.ONELINE, circleType=0, duration=15}
			}
		
		local cmd = {subcmd=0,rname='hello',icon=101}
		clearSendMsg_t()
		setLastErrorStr('')
		CreateRoleHandler():onRequest(self.player, nil, cmd)
		assert(getLastErrorStr() == '')
		assert(getSendMsg_t() == '{cmd:'..NETCMD.CREATEROLE..',subid:99,result:0}')
		
		local citys = self.player:getCitys()
		assert(citys:getCityCount() == 1)
		assertEQ ( self.player:getTask():getOnlineTask():getTaskId(), 1790001)
		assertEQ ( self.player:getTask():getNewcomerTask():getCurTaskId(), 1750001)
	end;
	
	test_GetRandName = function(self)
		res_rolenames_xing = {{id=1,name='张'},{id=2,name='王'}}
		res_rolenames_ming = {{id=1,name={'三','花'}},{id=2,name={'四','五'}}}
		
		self.mm:mock(CreateRoleSender, 'sendRandName')
		self.mm:mock(math, 'random', {2})
		local cmd = {subcmd=2, sex=-1}
		CreateRoleHandler():onRequest(self.player, nil, cmd)
		assertEQ ( self.mm.walkLog, '' )
		
		cmd = {subcmd=2, sex=ROLE_SEX.MALE}
		CreateRoleHandler():onRequest(self.player, nil, cmd)
		assertEQ ( self.mm.params['sendRandName'], {self.player, res_rolenames_xing[2].name .. res_rolenames_ming[2].name[ROLE_SEX.MALE+1]} )
		
		cmd = {subcmd=2, sex=ROLE_SEX.FEMALE}
		CreateRoleHandler():onRequest(self.player, nil, cmd)
		assertEQ ( self.mm.params['sendRandName'], {self.player, res_rolenames_xing[2].name .. res_rolenames_ming[2].name[ROLE_SEX.FEMALE+1]} )
	end;
	
	test_GetDieCityRandPos = function(self)
		self.mm:mock(self.player:getCityRes(), 'sendCityDie')
		
		local cmd = {subcmd=3}
		CreateRoleHandler():onRequest(self.player, nil, cmd)
		assertEQ ( self.mm.walkLog, '' )
		
		self.player:getCityRes():setLevel(0)
		self.mm:clear()
		CreateRoleHandler():onRequest(self.player, nil, cmd)
		assertEQ ( self.mm.walkLog, 'sendCityDie' )
	end;
	
	test_SetDieCityPos = function(self)
		Util:setTimeDrt(10)
		local player = TestCaseHelper:loadPlayerByUserNameEx('user1', 'role1', 200001, 604)
		local grid1 = TestCaseHelper:createGrid(601, OBJ_TYPE.NONE, 0, '', '')
		local grid2 = TestCaseHelper:createGrid(602, OBJ_TYPE.FIELD, 0, '', '')
		local grid3 = app:getCityMgr():getGridByGridId(204)
		TestCaseHelper:addCityGrid(grid1)
		TestCaseHelper:addCityGrid(grid2)
		
		self.mm:mock(CityBuildValSender, 'sendAll:citybuildSendAll' )
		self.mm:mock(RoleBaseSender, 'sendAll:roleSendAll' )
		self.mm:mock(CreateRoleSender, 'sendSetCityDiePosOk' )
	
		local cmd = {subcmd=4,x=0,y=1}
		CreateRoleHandler():onRequest(player, nil, cmd)
		assertEQ ( grid1.objType, OBJ_TYPE.NONE )
		
		player:getCityRes():setBuildVal(1000)
		player:getCityRes():setBuildHurtVal(1000)
		assertEQ ( app:getCityMgr():getExileGridByRoleId(200001) ~= nil, true )
		
		CreateRoleHandler():onRequest(player, nil, cmd)
		assertEQ ( grid1.objType, OBJ_TYPE.ROLE )
		assertEQ ( grid1.loginTime, Util:getTime() )
		assertEQ ( app:getCityMgr():getExileGridByRoleId(200001), nil)
		assertEQ ( player:getCityRes():getBuildHurtVal(), 1000 - 1)
		assertEQ ( player:getCityRes():getLevel(), 1)
		assertEQ ( grid1.roleId, 200001 )
		assertEQ ( player:getStateContainer():hasEffectState(RES_EFF.HURT_SPEED_BUILDVAL), true )
		local state = player:getStateContainer():getEffectState(RES_EFF.HURT_SPEED_BUILDVAL)
		assertEQ ( state:getType(), EFFECT_TYPE.PER_MINUTE )
		assertEQ ( state:getEffectVal(), 400 )
		assertEQ ( state:getEffectValUnit(), VAL_UNIT.PER )
		assertEQ ( state:getDuration(), 3*24*3600 )
		assertEQ ( self.mm.params['citybuildSendAll'], {player} ) 
		assertEQ ( self.mm.params['roleSendAll'], {player } ) 
		assertEQ ( self.mm.params['sendSetCityDiePosOk'], {player} ) 
	end;
	
	test_setDieCityPosInvalidPos = function(self)
		local params = {grid3=230*600+230+1, grid1=230*600+230+2+1, grid2=230*600+230+3+1, p1={x=230+2, y=230}, p2={x=350, y=350}}
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		Util:setTimeDrt(10)
		local player = TestCaseHelper:loadPlayerByUserNameEx('user1', 'role1', 200001, params.grid3)
		
		local grid1 = TestCaseHelper:createGrid(params.grid1, OBJ_TYPE.ROLE, 0, '', '')
		local grid2 = TestCaseHelper:createGrid(params.grid2, OBJ_TYPE.NONE, 0, '', '')
		local grid3 = app:getCityMgr():getGridByGridId(params.grid3)
		
		TestCaseHelper:addCityGrid(grid1)
		TestCaseHelper:addCityGrid(grid2)
		
		local cmd = {subcmd=4,x=0,y=1000000000}
		player:getCityRes():setBuildVal(1000)
		player:getCityRes():setBuildHurtVal(1000)
		CreateRoleHandler():onRequest(player, nil, cmd)
		assertEQ ( player:getCityRes():getLevel(), 0, 'invalid pos')
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {player, 100174, ''} )
		
		local curGrid = app:getCityMgr():getGridByPos({x=params.p1.x,y=params.p1.y})
		
		self.mm:clear()
		cmd = {subcmd=4,x=params.p1.x,y=params.p1.y}
		CreateRoleHandler():onRequest(player, nil, cmd)
		assertEQ ( player:getCityRes():getLevel(), 0, 'the pos be occupied')
		
		self.mm:clear()
		cmd = {subcmd=4,x=params.p2.x,y=params.p2.y}
		CreateRoleHandler():onRequest(player, nil, cmd)
		assertEQ ( player:getCityRes():getLevel(), 0, 'not in same city')
	end;
	
	testInitCityResData = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {curtime=10})
		CreateRoleHandler():initCityResData(self.player)
		assert( self.player:getCityRes():getMLastTime() == Util:getTime() )
		assert( self.player:getCityRes():getILastTime() == Util:getTime() )
	end;
	
	testInitRoleAttrs = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {curtime=10})
		CreateRoleHandler():initRoleAttrs(self.player)
		assert( self.player:getNSLastTime() == Util:getTime() )
	end;
	
	test_initLineups = function(self)
		TestCaseCondition:setPreCond(self.player, nil, {curtime=10})
		
		assert ( self.player:hasLineup(FIXID.DEFAULTLINEUP) == false );
		CreateRoleHandler():initLineups(self.player)
		assert ( self.player:hasLineup(FIXID.DEFAULTLINEUP) == true );
	end;
	
	test_initRoleData = function(self)
		local createRoleHandler = CreateRoleHandler()
		
		local methodMock = MethodMock()
		methodMock.walkLog = ''
		methodMock:mock(createRoleHandler, 'initRoleFarmData', function(self) methodMock.walkLog = methodMock.walkLog..'initRoleFarmData' end)
		methodMock:mock(createRoleHandler, 'initRoleBuildData', function(self) methodMock.walkLog = methodMock.walkLog..',initRoleBuildData' end)
		methodMock:mock(createRoleHandler, 'initRoleAttrs', function(self) methodMock.walkLog = methodMock.walkLog..',initRoleAttrs' end)
		methodMock:mock(createRoleHandler, 'initCityResData', function(self) methodMock.walkLog = methodMock.walkLog..',initCityResData' end)
		methodMock:mock(createRoleHandler, 'initCityBuildVal', function(self) methodMock.walkLog = methodMock.walkLog..',initCityBuildVal' end)
		methodMock:mock(createRoleHandler, 'initRoleMilitaryData', function(self) methodMock.walkLog = methodMock.walkLog..',initRoleMilitaryData' end)
		methodMock:mock(createRoleHandler, 'initRolePackageData', function(self) methodMock.walkLog = methodMock.walkLog..',initRolePackageData' end)
		methodMock:mock(createRoleHandler, 'initLineups', function(self) methodMock.walkLog = methodMock.walkLog..',initLineups' end)
		
		createRoleHandler:initRoleData(self.player)
		methodMock:restore()
		
		assert ( methodMock.walkLog == 'initRoleFarmData,initRoleBuildData,initRoleAttrs,initCityResData,initCityBuildVal,initRoleMilitaryData,initRolePackageData,initLineups' )
	end;
	
	test_initRolePackageData = function(self)
		local hdr = CreateRoleHandler()
		
		self.mm:mock(self.player:getPkg(), 'setMaxGridsCnt' )
		self.mm:mock(self.player:getPkg(), 'setGold' )
		self.mm:mock(self.player:getPkg(), 'setGiftGold' )
		self.mm:mock(self.player:getPkg(), 'setLastSalveTime' )
		
		hdr:initRolePackageData(self.player)
		assertEQ ( self.mm.walkLog, 'setMaxGridsCnt,setGold,setGiftGold,setLastSalveTime' )
		assertEQ ( self.mm.params['setMaxGridsCnt'], {res_role_initdata.pkg.maxgridcnt} )
		assertEQ ( self.mm.params['setGold'], {res_role_initdata.pkg.gold} )
		assertEQ ( self.mm.params['setGiftGold'], {res_role_initdata.pkg.giftgold} )
	end;
	
	test_getHasFreeGridCityId = function(self)
		self.mm:mock(app:getCityMgr(), 'hasFreeGrid', nil, function(self, cityId)
			return cityId == 9900002
		end)
		
		local hdr = CreateRoleHandler()
		assertEQ ( hdr:getHasFreeGridCityId(), 9900002)
	end;
	
	test_onGetRandName = function(self)
		res_rolenames_xing = {{id=1,name='张'}}
		res_rolenames_ming = {{id=1,name={'三','花'}}}
		
		self.mm:mock(CreateRoleSender, 'sendRandName')
		
		local hdr = CreateRoleHandler()
		hdr:onGetRandName(self.player, {sex=-1})
		assertEQ ( self.mm.walkLog, '' )
		
		hdr:onGetRandName(self.player, {sex=0})
		assertEQ ( self.mm.params['sendRandName'], {self.player, '张三'} )
		
		self.mm:clear()
		hdr:onGetRandName(self.player, {sex=1})
		assertEQ ( self.mm.params['sendRandName'], {self.player, '张花'} )
	end;
})

tqCreateRoleHandler_t_main = function(suite)
	suite:addTestCase(TestCaseCreateRole, 'TestCaseCreateRole')
end;

