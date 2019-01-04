require('tqPlayers')
require('tqStrategyHandler')
require('tqExpend')
require('tqWUtil')
require('tqHeroResHandler')
require('tqRoleBaseHandler')
require('tqHeroResHandler_t')

local TestCaseRoleBaseHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_regHandlers = function(self)
		local hdr = RoleBaseHandler()
		assert ( hdr:getHandler(1):getClass() == SendRoleInfoHdr )
		assert ( hdr:getHandler(2):getClass() == AssignRolePPSHdr )
		assert ( hdr:getHandler(3):getClass() == ChangeStateCityHdr )
		assert ( hdr:getHandler(4):getClass() == ClearRolePPSHdr )
		assert ( hdr:getHandler(5):getClass() == RoleAssignExpHdr )
		assert ( hdr:getHandler(6):getClass() == ChangeIntroductionHdr )
		assert ( hdr:getHandler(7):getClass() == SearchRoleForRankHdr )
		assert ( hdr:getHandler(8):getClass() == GetPageRankRolesHdr )
	end;
})

local TestCaseRoleBaseHandlerEx = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		self.hero = HeroTestCaseHelper:createOneNewHero(self.player, self.player:getHeroMgr())
		self.rolebasehdr = RoleBaseHandler()
		res_items = {{id=FIXID.CLEARFORCARD, pile=100}} -- add test res_item
	end;
	
	tearDown = function(self)
		TestCaseHelper:restoreRes()
		TestCaseHelper:clearAll(self)
	end;
	
	testGetRoleBaseCmd = function(self)
		local cmd = {cmd=NETCMD.ROLEBASE,subcmd=1}
		RoleBaseHandler():onRequest(self.player, nil, cmd)
		
		local cmd ={cmd=NETCMD.ROLEBASE,subcmd=2,p0=2,p1=1}
		RoleBaseHandler():onRequest(self.player, nil, cmd)
		
		local cmd ={cmd=NETCMD.ROLEBASE,subcmd=3,cid=-2}
		RoleBaseHandler():onRequest(self.player, nil, cmd)
	end;
	
	testAssignRolePPS = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask' )
		clearSendMsg_t()
		self.player:getAttr(ATTR.PP).ulVal = 3
		AssignRolePPSHdr():handle(self.player, {cmd=NETCMD.ROLEBASE,subcmd=2,p0=3,p1=2})
		assert(getSendMsg_t() == '')
		assert(self.player:getAttr(ATTR.PP).ulVal == 3)
		
		clearSendMsg_t()
		self.player:getAttr(ATTR.PP).ulVal = 7
		AssignRolePPSHdr():handle(self.player, {cmd=NETCMD.ROLEBASE,subcmd=2,p0=3,p1=2})
		assert(getSendMsg_t() ~= '')
		assert(self.player:getAttr(ATTR.PP).ulVal == 2)
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.ASSIGN_ROLE_ATTR} )
	end;
	
	testClearRolePPS = function(self)
		local old_for_b = self.player:getAttr(ATTR.FOR_B).ulVal
		self.player:getAttr(ATTR.FOR_B).ulVal = old_for_b + 1
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.CLEARFORCARD, number=1})})
	
		clearSendMsg_t()
		ClearRolePPSHdr:handle(self.player, {cmd=NETCMD.ROLEBASE,subcmd=4,fval=1,pval=1})
		assert(getSendMsg_t() == '')
		
		local old_pp = self.player:getAttrVal(ATTR.PP)
		clearSendMsg_t()
		ClearRolePPSHdr:handle(self.player, {cmd=NETCMD.ROLEBASE,subcmd=4,fval=1,pval=0})
		assert(getSendMsg_t() ~= '') 
		assert(self.player:getPkg():getItemNumber(FIXID.CLEARFORCARD) == 0)
		assert(self.player:getAttr(ATTR.FOR_B).ulVal == old_for_b)
		assertEQ(self.player:getAttrVal(ATTR.PP), old_pp + 1  )
	end;
	
	testRoleAssignExp = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask')
		local heroxp = self.hero:getAttr(ATTR.XP)
		local old_heroxp_val = heroxp.ulVal
		
		local xps = self.player:getAttr(ATTR.XPS)
		xps.ulVal = 20
		
		clearSendMsg_t()
		RoleAssignExpHdr:handle(self.player, {cmd=NETCMD.ROLEBASE,subcmd=5,cid=cityid,heroid=1,exp=10})
		assert(xps.ulVal == 10)
		assert(heroxp.ulVal == old_heroxp_val+10)
		assert(getSendMsg_t() ~= '') 
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.ASSIGN_HERO_EXPS} )
	end;
	
	testRoleAssignExpHeroLevelUp = function(self)
		local heroxp = self.hero:getAttr(ATTR.XP)
		local old_heroxp_val = heroxp.ulVal
		local expval = res_herolevelexps[2].needexp + res_herolevelexps[3].needexp + res_herolevelexps[4].needexp + 100
		local xps = self.player:getAttr(ATTR.XPS)
		xps.ulVal = expval
		
		local oldpp = self.hero:getAttrVal(ATTR.PP)
		
		clearSendMsg_t()
		RoleAssignExpHdr():handle(self.player, {cmd=NETCMD.ROLEBASE,subcmd=5,cid=cityid,heroid=1,exp=expval})
		assert(xps.ulVal == 0)
		assert(heroxp.ulVal == 100)
		assert(getSendMsg_t() ~= '') 
		assert(4 == self.hero:getLevel())
		assert( self.hero:getAttrVal(ATTR.PP) == res_get_hero_ppoint(1).free + res_get_hero_ppoint(2).free + res_get_hero_ppoint(3).free + res_get_hero_ppoint(4).free )
	end;
})

local TestCaseChangeStateCity = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ChangeStateCityHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local r_isValid = {false}
		self.mm:mock(self.hdr, '_initParam' )
		self.mm:mock(self.hdr, '_createExpends' )
		self.mm:mock(self.hdr, '_isValid', r_isValid )
		self.mm:mock(self.hdr, '_startChange' )
		
		local p_cmdtb = {}
		self.hdr:handle(self.player, p_cmdtb)
		assertEQ ( self.mm.walkLog, '_initParam,_createExpends,_isValid' )
		assertEQ ( self.mm.params['_initParam'], {self.player, p_cmdtb} )
		
		self.mm:clear()
		r_isValid[1] = true
		self.hdr:handle(self.player, p_cmdtb)
		assertEQ ( self.mm.walkLog, '_initParam,_createExpends,_isValid,_startChange' )
	end;
	
	test__initParam = function(self)
		local p_cmdtb = {cid=res_city_range.first-1}
		self.hdr:_initParam(self.player, p_cmdtb)
		assertEQ ( self.hdr.cityResId, -1 )
		assertEQ ( self.hdr.player, self.player )
		
		p_cmdtb.cid = res_city_range.last + 1
		self.hdr:_initParam(self.player, p_cmdtb)
		assertEQ ( self.hdr.cityResId, -1 )
		
		p_cmdtb.cid = res_city_range.last-1
		self.hdr:_initParam(self.player, p_cmdtb)
		assertEQ ( self.hdr.cityResId, res_city_range.last-1 )
	end;
	
	test__createExpends = function(self)
		self.hdr.player = self.player
		
		local r_expends = {}
		self.mm:mock(self.hdr, '_getNeedGold', {1})
		self.mm:mock(WUtil, 'createExpendObjs', {r_expends})
		self.hdr:_createExpends()
		assertEQ ( self.hdr.expends, r_expends )
		assertEQ ( self.mm.params['createExpendObjs'],  {self.player, 'nil', {{attr=ATTR.GOLD,type=EXPEND_TYPE.GOLD,val=1}}} )
	end;
	
	test__isValid = function(self)
		self.hdr.player = self.player
		self.hdr.cityResId = -1
		self.hdr.expends ={val=1}
		
		local r_isEnoughExpends = {false}
		local r_isHerosStateCanMove = {false}
		self.mm:mock(WUtil, 'isEnoughExpends', r_isEnoughExpends)
		self.mm:mock(self.hdr.moveCityUtil, 'isHerosStateCanMove', r_isHerosStateCanMove)
	
		assertEQ ( self.hdr:_isValid(), false )
		
		self.player:setAlliId(1)
		self.hdr.cityResId = 1
		assertEQ ( self.hdr:_isValid(), false )
		
		self.player:setAlliId(0)
		self.player:setCityCD(Util:getTime() + 1)
		assertEQ ( self.hdr:_isValid(), false )
		
		self.player:setCityCD(Util:getTime())
		assertEQ ( self.hdr:_isValid(), false )
		assertEQ ( self.mm.params['isEnoughExpends'], {self.hdr.expends})
		
		self.mm:clear()
		r_isEnoughExpends[1] = true
		assertEQ ( self.hdr:_isValid(), false )
		assertEQ ( self.mm.params['isHerosStateCanMove'], {self.player})
		
		self.mm:clear()
		r_isHerosStateCanMove[1] = true
		assertEQ ( self.hdr:_isValid(), true )
	end;
	
	test__startChange = function(self)
		self.hdr.player = self.player
		self.hdr.cityResId = 9900001
		self.hdr.expends = {val=1}
		
		local r_getFreeCityPos = {nil}
		self.mm:mock(app:getCityMgr(), 'getFreeCityPos', r_getFreeCityPos)
		self.mm:mock(WUtil, 'sendErrorMsgArgs')
		self.mm:mock(self.hdr, '_setPlayerChangeInfo')
		self.mm:mock(self.hdr.moveCityUtil, 'moveToPos')
		self.mm:mock(WUtil, 'subExpends')
		self.mm:mock(RoleBaseSender, 'send')
		self.mm:mock(WUtil, 'sendSuccMsgArgs')
		
		self.hdr:_startChange()
		assertEQ ( self.mm.walkLog, 'getFreeCityPos,sendErrorMsgArgs' )
		assertEQ ( self.mm.params['getFreeCityPos'], {9900001} )
		assertEQ ( self.mm.params['sendErrorMsgArgs'], {self.player, 100007, '"@cityid9900001"'} )
		
		self.mm:clear()
		r_getFreeCityPos[1] = {x=1, y=2}
		self.hdr:_startChange()
		assertEQ ( self.mm.walkLog, 'getFreeCityPos,_setPlayerChangeInfo,moveToPos,subExpends,send,sendSuccMsgArgs' )
		assertEQ ( self.mm.params['moveToPos'], {self.player, r_getFreeCityPos[1]} )
		assertEQ ( self.mm.params['subExpends'], {self.hdr.expends} )
		assertEQ ( self.mm.params['send'], {self.player, {'prestige','cityhonor','citycd','cityid','pos'}} )
		assertEQ ( self.mm.params['sendSuccMsgArgs'], {self.player, 100008, '"@cityid9900001",1,2'} )
	end;
	
	test__setPlayerChangeInfo = function(self)
		self.hdr.player = self.player
		self.hdr.cityResId = 9900001
		self.player:setPrestige(1000)
		self.player:setCityHonor(100)
		
		self.hdr:_setPlayerChangeInfo()
		
		assertEQ ( self.player:getCityId(), self.hdr.cityResId )
		assertEQ ( self.player:getCityCD(), Util:getTime()+3600*res_changecity_cd )
		assertEQ ( self.player:getPrestige(), 1000*res_ccity_prestige_per )
		assertEQ ( self.player:getCityHonor(), 0 )
	end;
	
	test__getNeedGold = function(self)
		self.hdr.player = self.player
		self.player:setState(ROLE_STATE.YOUNG)
		assertEQ ( self.hdr:_getNeedGold(), 0 )
		
		self.player:setState(ROLE_STATE.FREE)
		assertEQ ( self.hdr:_getNeedGold(), res_ccity_need_gold )
	end;
})

local TestCaseClearRolePPSHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ClearRolePPSHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
})

local TestCaseChangeIntroductionHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ChangeIntroductionHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local r_initParam = {false}
		self.mm:mock(self.hdr, '_initParam', r_initParam)
		self.mm:mock(self.player, 'setIntroduction')
		self.mm:mock(RoleBaseSender, 'send')
		
		local cmd = {intr="i am good man"}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['_initParam'], {self.player, cmd} )
		
		self.mm:clear()
		r_initParam[1] = true
		self.hdr.player = self.player
		self.hdr.introduction = 'i am good man'
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.mm.walkLog, '_initParam,setIntroduction,send' )
		assertEQ ( self.mm.params['setIntroduction'], {'i am good man'} )
		assertEQ ( self.mm.params['send'], {self.player, {'introduction'}} )
	end;
	
	test__initParam = function(self)
		self.vb:replace(nil, 'MAX_ROLEINTRO_LEN', 5)
		local cmd = {intr="i am good man"}
		assertEQ ( self.hdr:_initParam(self.player, cmd), false )
		
		self.vb:replace(nil, 'MAX_ROLEINTRO_LEN', 5)
		local cmd = {intr="i am "}
		assertEQ ( self.hdr:_initParam(self.player, cmd), true )
		assertEQ ( self.hdr.introduction, 'i am ' )
		assertEQ ( self.hdr.player, self.player )
	end;
})

local TestCaseSearchRoleForRankHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = RoleBaseHandler():getHandler(7)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(app:getRoleRank(), 'getIdxByName', nil, function(self, roleName)
			if roleName == 'unkown' then
				return -1
			else 
				return 13
			end
		end)

		self.mm:mock(RoleRankSender, 'sendRanks')
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		assertEQ ( self.hdr:handle(self.player, {role='unkown'}), false)
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100163, '"unkown"'} )
		
		self.mm:clear()
		assertEQ ( self.hdr:handle(self.player, {role='role'}), true)
		assertEQ ( self.mm.params['sendRanks'], {self.player, 2, 12, 1} )
	end;
})

local TestCaseGetPageRankRolesHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = RoleBaseHandler():getHandler(8)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(RoleRankSender, 'sendRanks')
		self.hdr:handle(self.player, {pageNo=1})
		assertEQ ( self.mm.params['sendRanks'], {self.player, 1, 12, -1} )
	end;
})

tqRoleBaseHandler_t_main = function(suite)
	suite:addTestCase(TestCaseRoleBaseHandler, 'TestCaseRoleBaseHandler')
	suite:addTestCase(TestCaseRoleBaseHandlerEx, 'TestCaseRoleBaseHandlerEx')
	suite:addTestCase(TestCaseChangeStateCity, 'TestCaseChangeStateCity')
	suite:addTestCase(TestCaseChangeIntroductionHdr, 'TestCaseChangeIntroductionHdr')
	suite:addTestCase(TestCaseSearchRoleForRankHdr, 'TestCaseSearchRoleForRankHdr')
	suite:addTestCase(TestCaseGetPageRankRolesHdr, 'TestCaseGetPageRankRolesHdr')
end;


