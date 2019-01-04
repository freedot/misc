--*******************************************************************************
--*******************************************************************************
require('tqAllianceHandler')

local TestCaseAllianceHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(0):getClass() , NullHandler )
		assertEQ ( self.hdr:getHandler(1):getClass() , CreateAllianceHdr )
		assertEQ ( self.hdr:getHandler(2):getClass() , ApplyJoinAllianceHdr )
		assertEQ ( self.hdr:getHandler(3):getClass() , GetCurApplyingAllianceHdr )
		assertEQ ( self.hdr:getHandler(4):getClass() , GetAllianceDetailHdr )
		assertEQ ( self.hdr:getHandler(5):getClass() , GetInviteListAllianceHdr )
		assertEQ ( self.hdr:getHandler(6):getClass() , AgreeInviteAllianceHdr )
		assertEQ ( self.hdr:getHandler(7):getClass() , IgnoreInviteAllianceHdr )
		assertEQ ( self.hdr:getHandler(8):getClass() , GetAllianceListHdr )
		assertEQ ( self.hdr:getHandler(9):getClass() , SearchAllianceHdr )
		assertEQ ( self.hdr:getHandler(10):getClass() , GetSelfAllianceMemsHdr )
		assertEQ ( self.hdr:getHandler(11):getClass() , GetOtherAllianceMemsHdr )
		assertEQ ( self.hdr:getHandler(12):getClass() , GetMyAllianceDetailHdr )
		assertEQ ( self.hdr:getHandler(13):getClass() , UpgradeAllianceHdr )
		assertEQ ( self.hdr:getHandler(14):getClass() , ModifyQQGroupHdr )
		assertEQ ( self.hdr:getHandler(15):getClass() , InviteAllianceMemberHdr )
		assertEQ ( self.hdr:getHandler(16):getClass() , DismissAllianceHdr )
		assertEQ ( self.hdr:getHandler(17):getClass() , CancelDismissAllianceHdr )
		assertEQ ( self.hdr:getHandler(18):getClass() , ExitAllianceHdr )
		assertEQ ( self.hdr:getHandler(19):getClass() , ModifyAllianceIntroducHdr )
		assertEQ ( self.hdr:getHandler(20):getClass() , ModifyAllianceBulletinHdr )
		assertEQ ( self.hdr:getHandler(21):getClass() , GainAllianceTodayGiftHdr )
		assertEQ ( self.hdr:getHandler(22):getClass() , UpgradeLawLightHdr )
		assertEQ ( self.hdr:getHandler(23):getClass() , LawLightBestowHdr )
		assertEQ ( self.hdr:getHandler(24):getClass() , LawLightFeedHdr )
		assertEQ ( self.hdr:getHandler(25):getClass() , GetALeadersHdr )
		assertEQ ( self.hdr:getHandler(26):getClass() , TransferLeaderAllianceHdr )
		assertEQ ( self.hdr:getHandler(27):getClass() , CancelTransferAllianceHdr )
		assertEQ ( self.hdr:getHandler(28):getClass() , ContributeAllianceResHdr )
		assertEQ ( self.hdr:getHandler(29):getClass() , GetTodaySortMemsHdr )
		assertEQ ( self.hdr:getHandler(30):getClass() , GetAllSortMemsHdr )
		assertEQ ( self.hdr:getHandler(31):getClass() , AppointAlliMemberHdr )
		assertEQ ( self.hdr:getHandler(32):getClass() , FireAlliMemberHdr )
		assertEQ ( self.hdr:getHandler(33):getClass() , AgreeApplyJoinAllianceHdr )
		assertEQ ( self.hdr:getHandler(34):getClass() , IgnoreApplyJoinAllianceHdr )
		assertEQ ( self.hdr:getHandler(35):getClass() , GetAllianceEventsHdr )
		assertEQ ( self.hdr:getHandler(36):getClass() , GetApplyAllianceMergesHdr )
		assertEQ ( self.hdr:getHandler(37):getClass() , ApplyMergeAllianceHdr )
		assertEQ ( self.hdr:getHandler(38):getClass() , AgreeMergeAllianceHdr )
		assertEQ ( self.hdr:getHandler(39):getClass() , IgnoreMergeAllianceHdr )
		assertEQ ( self.hdr:getHandler(40):getClass() , GetAllianceAuctionInfoHdr )
		assertEQ ( self.hdr:getHandler(41):getClass() , AllianceAuctionBuyItemHdr )
		assertEQ ( self.hdr:getHandler(42):getClass() , SellItemToAllianceHdr )
		assertEQ ( self.hdr:getHandler(43):getClass() , CancelAllianceSellItemHdr )
	end;
})

local TestCaseCreateAllianceChecker = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.checker = CreateAllianceChecker()
		self.mm:travelMock(WUtil, 'sendWarningMsgArgs')
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	helper_enableAllConditions = function(self)
		self.player:setAlliId(0)
		self.player:getStateContainer():stopState(RES_EFF.EXIT_ALLIANCE)
		self.player:setLevel(res_create_alli_need_rolelevel)
		self.player:getCityRes():setMoney(res_create_alli_need_money)
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=6,resid=FIXID.ALLIINBUILD,level=1,state=0} } })
	end;
	
	test_isCan = function(self)
		self:helper_enableAllConditions()
		self.player:setAlliId(1)
		assertEQ ( self.checker:isCan(self.player), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100106, ''}, 'player already has alliance' )
		
		self:helper_enableAllConditions()
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=1, effect={id=RES_EFF.EXIT_ALLIANCE,val=3,unit=0}}
		local creator = {type=0,id=0,skillId=0}
		self.player:getStateContainer():appendState(stateRes, creator)
		assertEQ ( self.checker:isCan(self.player), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100103, ''}, 'player exit alliance time too short' )
		
		self:helper_enableAllConditions()
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=6,resid=FIXID.ALLIINBUILD,level=0,state=0} } })
		assertEQ ( self.checker:isCan(self.player), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100104, ''}, 'player has not alliance build' )
		
		self:helper_enableAllConditions()
		self.player:setLevel(res_create_alli_need_rolelevel-1)
		assertEQ ( self.checker:isCan(self.player), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100105, ''}, 'player level too low' )
		
		self:helper_enableAllConditions()
		self.player:getCityRes():setMoney(res_create_alli_need_money-1)
		assertEQ ( self.checker:isCan(self.player), false, 'player has no enough money' )
		
		self:helper_enableAllConditions()
		assertEQ ( self.checker:isCan(self.player), true )
		assertEQ ( self.checker:getExpends()[1]:getClass(), MoneyExpend)
	end;
	
	test_getExpends = function(self)
		assertEQ ( true, true, 'already test in test_isCan' )
	end;
})

local TestCaseApplyJoinAllianceChecker = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.checker = ApplyJoinAllianceChecker()
		self.alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		self.alliance:setLevel(1)
		self.mm:travelMock(WUtil, 'sendWarningMsgArgs')
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	helper_enableAllConditions = function(self)
		self.player:setCityId(9900001)
		self.alliance:setCityResId(self.player:getCityId())
		self.alliance:setDismissStartTime(0)
		for i=self.alliance:getMemberCount()-1, 1, -1 do
			self.alliance:removeMember(i)
		end
		
		self.player:setAlliId(0)
		self.player:getStateContainer():stopState(RES_EFF.EXIT_ALLIANCE)
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=6,resid=FIXID.ALLIINBUILD,level=1,state=0} } })
	end;
	
	test_isCan = function(self)
		self:helper_enableAllConditions()
		assertEQ ( self.checker:isCan(self.player, 0), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100111, ''}, 'alliance is not exist' )
		
		self:helper_enableAllConditions()
		self.player:setCityId(9900002)
		assertEQ ( self.checker:isCan(self.player, self.alliance:getId()), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100112, ''}, 'the player state city is not same with alliance' )
		
		self:helper_enableAllConditions()
		for i=1, res_alli_upd_needs[1].memmaxcount-1, 1 do 
			self.alliance:addMember(AllianceMember())
		end
		assertEQ ( self.checker:isCan(self.player, self.alliance:getId()), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100113, ''}, 'alliance the member is full' )
		
		self:helper_enableAllConditions()
		self.alliance:setDismissStartTime(1)
		assertEQ ( self.checker:isCan(self.player, self.alliance:getId()), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100114, ''}, 'alliance in dismissing state' )
		
		self:helper_enableAllConditions()
		self.player:setAlliId(1)
		assertEQ ( self.checker:isCan(self.player, self.alliance:getId()), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100107, ''}, 'player already has alliance' )
		
		self:helper_enableAllConditions()
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=1, effect={id=RES_EFF.EXIT_ALLIANCE,val=3,unit=0}}
		local creator = {type=0,id=0,skillId=0}
		self.player:getStateContainer():appendState(stateRes, creator)
		assertEQ ( self.checker:isCan(self.player, self.alliance:getId()), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100108, ''}, 'player exit alliance time too short' )
		
		self:helper_enableAllConditions()
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=6,resid=FIXID.ALLIINBUILD,level=0,state=0} } })
		assertEQ ( self.checker:isCan(self.player, self.alliance:getId()), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100109, ''}, 'player has not alliance build' )
		
		self:helper_enableAllConditions()
		assertEQ ( self.checker:isCan(self.player, self.alliance:getId()), true )
	end;
})

local TestCaseCreateAllianceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(1)
		local cmd = {name='name', flag='号'}
		self.hdr:_initParam(self.player, cmd)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local r_isCan = {false}
		local r_isValidName = {false}
		local r_isExistName = {true}
		local r_isValidFlagName = {false}
		local r_isExistFlagName = {true}
		self.mm:mock(self.hdr, '_initParam')
		self.mm:mock(self.hdr.checker, 'isCan', r_isCan)
		self.mm:mock(self.hdr, '_isValidName', r_isValidName)
		self.mm:mock(self.hdr, '_isExistName', r_isExistName)
		self.mm:mock(self.hdr, '_isValidFlagName', r_isValidFlagName)
		self.mm:mock(self.hdr, '_isExistFlagName', r_isExistFlagName)
		self.mm:mock(self.hdr, '_createAlliance' )
		self.mm:mock(WUtil, 'sendWarningMsgArgs' )
		self.mm:mock(WUtil, 'sendWarningMsg' )
		self.mm:mock(nil, 'getLastErrorStr', {'error'} )
		
		assertEQ ( self.hdr:handle(self.player, {name='alliance'}), false )
		assertEQ ( self.mm.params['_initParam'], {self.player, {name='alliance'}} )
		
		self.mm:clear()
		r_isCan[1] = true
		assertEQ ( self.hdr:handle(self.player, {name='alliance'}), false )
		assertEQ ( self.mm.params['sendWarningMsg'], {self.player, getLastErrorStr()} )
		self.mm:clear()
		r_isValidName[1] = true
		assertEQ ( self.hdr:handle(self.player, {name='alliance'}), false )
		assertEQ ( self.mm.params['sendWarningMsg'], {self.player, getLastErrorStr()} )
		self.mm:clear()
		r_isExistName[1] = false
		assertEQ ( self.hdr:handle(self.player, {name='alliance'}), false )
		assertEQ ( self.mm.params['sendWarningMsg'], {self.player, getLastErrorStr()} )
		self.mm:clear()
		r_isValidFlagName[1] = true
		assertEQ ( self.hdr:handle(self.player, {name='alliance'}), false )
		assertEQ ( self.mm.params['sendWarningMsg'], {self.player, getLastErrorStr()} )
		self.mm:clear()
		r_isExistFlagName[1] = false
		assertEQ ( self.hdr:handle(self.player, {name='alliance'}), true )
		assertEQ ( self.mm.params['_createAlliance'], {} )
	end;
	
	test__initParam = function(self)
		local cmd = {name='name', flag='号'}
		
		assertEQ ( self.hdr.player, self.player )
		assertEQ ( self.hdr.name, 'name' )
		assertEQ ( self.hdr.flag, '号' )
	end;
	
	test__isValidName = function(self)
		assertEQ ( self.hdr:_isValidName(), true )
		self.hdr.name = 'a'
		assertEQ ( self.hdr:_isValidName(), false )
		assertEQ ( getLastErrorStr(), rstr.validname.alli.short )
	end;
	
	test__isExistName = function(self)
		local rt = {false}
		self.mm:mock(ValidChecker, 'isNewAllianceName', rt)
		assertEQ ( self.hdr:_isExistName(), true )
		assertEQ ( self.mm.params['isNewAllianceName'], {self.hdr.name})
		
		rt[1] = true
		assertEQ ( self.hdr:_isExistName(), false )
	end;
	
	test__isValidFlagName = function(self)
		assertEQ ( self.hdr:_isValidFlagName(), true )
		self.hdr.flag = 'aa'
		assertEQ ( self.hdr:_isValidFlagName(), false )
		assertEQ ( getLastErrorStr(), rstr.validname.alliflag.long )
	end;
	
	test__isExistFlagName = function(self)
		local rt = {false}
		self.mm:mock(ValidChecker, 'isNewAllianceFlagName', rt)
		assertEQ ( self.hdr:_isExistFlagName(), true )
		assertEQ ( self.mm.params['isNewAllianceFlagName'], {self.hdr.flag})
		
		rt[1] = true
		assertEQ ( self.hdr:_isExistFlagName(), false )
	end;
	
	test__createAlliance = function(self)
		self.hdr.expends = {{}}
		
		local alliance = Alliance()
		alliance:setId(1)
		self.mm:mock(WUtil, 'subExpends')
		self.mm:mock(app:getAlliMgr(), 'createAlliance', {alliance})
		self.mm:mock(RoleBaseSender, 'send' )
		self.mm:mock(AllianceSender, 'sendCreateAlliance')
		self.mm:mock(TaskFinisher, 'checkTasks' )
		
		self.hdr:_createAlliance()
		assertEQ ( self.mm.walkLog, 'subExpends,createAlliance,send,sendCreateAlliance,checkTasks' )
		assertEQ ( self.mm.params['subExpends'], {self.hdr.checker:getExpends()})
		assertEQ ( self.mm.params['createAlliance'], {self.player, self.hdr.name, self.hdr.flag})
		assertEQ ( self.mm.params['sendCreateAlliance'], {self.player})
		assertEQ ( self.mm.params['send'], { self.player, {'alliance'} })
		assertEQ ( self.player:getAlliId(), 1)
		assertEQ ( self.mm.params['checkTasks'], {self.player } )
	end;
})

local TestCaseApplyJoinAllianceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(2)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local r_isCan = {false}
		local r_existInApplyList = {true}
		local r_isFullApplyList = {true}
		self.mm:travelMock(self.hdr, '_initParam')
		self.mm:mock(self.hdr.checker, 'isCan', r_isCan)
		self.mm:mock(self.hdr, '_existInApplyList', r_existInApplyList)
		self.mm:mock(self.hdr, '_isFullApplyList', r_isFullApplyList)
		self.mm:mock(WUtil, 'sendWarningMsgArgs' )
		self.mm:mock(self.hdr, '_addApplyJoin')
		
		local cmd = {name="alliance"}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['_initParam'], {self.player, cmd})

		self.mm:clear()
		r_isCan[1] = true
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100115, ''})
		
		self.mm:clear()
		r_existInApplyList[1] = false
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100110, ''})
		
		self.mm:clear()
		r_isFullApplyList[1] = false
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.mm.params['_addApplyJoin'], {})
	end;
	
	test__initParam =  function(self)
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		
		local cmd = {name="alliance"}
		self.hdr:_initParam(self.player, cmd)
		assertEQ ( self.hdr.player, self.player)
		assertEQ ( self.hdr.alliance, alliance)
	end;
	
	test__existInApplyList = function(self)
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		local cmd = {name="alliance"}
		self.hdr:_initParam(self.player, cmd)
		
		assertEQ ( self.hdr:_existInApplyList(), false )
		alliance:getApplyRoleIdsSet():insert(self.player:getRoleId())
		assertEQ ( self.hdr:_existInApplyList(), true )
	end;
	
	test__isFullApplyList = function(self)
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		local cmd = {name="alliance"}
		self.hdr:_initParam(self.player, cmd)
		
		for i=1, res_alli_applylist_maxcount-1, 1 do
			alliance:getApplyRoleIdsSet():insert(i)
		end
		assertEQ ( self.hdr:_isFullApplyList(), false )
		
		alliance:getApplyRoleIdsSet():insert(100)
		assertEQ ( self.hdr:_isFullApplyList(), true )
	end;
	
	test__addApplyJoin = function(self)
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		local cmd = {name="alliance"}
		self.hdr:_initParam(self.player, cmd)
		
		self.mm:travelMock(alliance:getApplyRoleIdsSet(), 'insert')
		self.mm:travelMock(self.player, 'setCurApplyAlliance')
		self.mm:mock(AllianceSender, 'sendApplyListToLeaders')
		self.mm:mock(AllianceSender, 'sendCurApplying')
		
		self.hdr:_addApplyJoin()
		assertEQ ( self.mm.walkLog, 'insert,setCurApplyAlliance,sendApplyListToLeaders,sendCurApplying' )
		assertEQ ( alliance:getApplyRoleIdsSet():has(self.player:getRoleId()), true )
		assertEQ ( self.player:getCurApplyAlliance(), 'alliance' )
		assertEQ ( self.mm.params['sendApplyListToLeaders'], {alliance})
		assertEQ ( self.mm.params['sendCurApplying'], {self.player})
	end;
})


local TestCaseGetCurApplyingAllianceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(3)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(AllianceSender, 'sendCurApplying')
		self.hdr:handle(self.player)
		assertEQ ( self.mm.params['sendCurApplying'], {self.player} )
	end;
})

local TestCaseGetAllianceDetailHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(4)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(AllianceSender, 'sendAllianceDetail')
		
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		alliance:setId(1)
		
		local cmd = {name = 'alli'}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100116, ''}, 'alliance is not exist' )
		
		cmd = {name = 'alliance'}
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.mm.params['sendAllianceDetail'], {self.player, alliance} )
	end;
})

local TestCaseGetInviteListAllianceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(5)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(AllianceSender, 'sendGetInviteList')
		self.hdr:handle(self.player)
		assertEQ ( self.mm.params['sendGetInviteList'], {self.player} )
	end;
})

local TestCaseAddAllianceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AddAllianceHdr(ApplyJoinAllianceChecker())
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local r_isCan = {false}
		self.mm:mock(self.hdr.checker, 'isCan', r_isCan)
		self.mm:mock(self.hdr, '_addAlliance')
		
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		assertEQ ( self.hdr:handle(self.player, self.player, alliance:getId()), false )
		assertEQ ( self.mm.walkLog, 'isCan' )
		assertEQ ( self.mm.params['isCan'], {self.player, self.player, alliance:getId()} )
		
		self.mm:clear()
		r_isCan[1] = true
		assertEQ ( self.hdr:handle(self.player, self.player, alliance:getId()), true )
		assertEQ ( self.mm.walkLog, 'isCan,_addAlliance' )
	end;
	
	test__addAlliance = function(self)
		local alliance = app:getAlliMgr():createAlliance(self.player,  'alliance', 'f')
		self.hdr:_initParam(self.player, self.player, alliance:getId())
		
		self.mm:mock(app:getAlliMgr(), 'saveAlliance')
		self.mm:mock(RoleBaseSender, 'send')
		self.mm:mock(TaskFinisher, 'checkTasks' )
		
		self.hdr:_addAlliance()
		assertEQ ( self.player:getAlliId(), alliance:getId() )
		assertEQ ( alliance:getMemberCount(), 2 )
		assertEQ ( alliance:getMemberByIdx(1):getId(), self.player:getRoleId() )
		assertEQ ( alliance:getMemberByIdx(1):getAlliPos(), ALLI_POS.MEM )
		
		assertEQ ( self.mm.params['saveAlliance'], {alliance} )
		assertEQ ( self.mm.params['send'], {self.player, {'alliance'}} )
		assertEQ ( self.mm.params['checkTasks'], {self.player} )
	end;
})

local TestCaseAgreeInviteAllianceHdr = TestCase:extends({
	setUp = function(self)
		alliance = nil
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(6)
		
		self.leader = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100001)
		self.alliance = app:getAlliMgr():createAlliance(self.leader, 'alliance', 'f')
		self.invitedPlayer = TestCaseHelper:loadPlayerByUserNameEx('user1', 'role1', 100002)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	helper_enableAllConditions = function(self)
		self.mm:clear()
		self.invitedPlayer:getInviteJoinAlliances():insert({allianceId=self.alliance:getId(),roleId=self.leader:getRoleId()})
		
		self.invitedPlayer:setCityId(9900001)
		self.alliance:setCityResId(self.invitedPlayer:getCityId())
		self.alliance:setDismissStartTime(0)
		for i=self.alliance:getMemberCount()-1, 1, -1 do
			self.alliance:removeMember(i)
		end
		
		self.invitedPlayer:setAlliId(0)
		self.invitedPlayer:getStateContainer():stopState(RES_EFF.EXIT_ALLIANCE)
		TestCaseCondition:setPreCond(self.invitedPlayer, nil, { builds={ {id=6,resid=FIXID.ALLIINBUILD,level=1,state=0} } })
	end;
	
	test_handle = function(self)
		self.mm:travelMock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(AllianceSender, 'sendDeleteInvite')
		self.mm:mock(app:getAlliMgr(), 'saveAlliance')
		self.mm:mock(RoleBaseSender, 'send')
		self.mm:mock(AllianceSender, 'sendSelfAllianceDetail')

		self:helper_enableAllConditions()
		assertEQ ( self.hdr:handle(self.invitedPlayer, {alliId=0}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.invitedPlayer, 100111, ''}, 'alliance is not exist')
		
		self:helper_enableAllConditions()
		self.invitedPlayer:getInviteJoinAlliances():remove(self.alliance:getId())
		assertEQ ( self.hdr:handle(self.invitedPlayer, {alliId=self.alliance:getId()}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.invitedPlayer, 100137, ''}, 'alliance is not in invite list')
		
		self:helper_enableAllConditions()
		for i=1, res_alli_upd_needs[1].memmaxcount-1, 1 do 
			self.alliance:addMember(AllianceMember())
		end
		assertEQ ( self.hdr:handle(self.invitedPlayer, {alliId=self.alliance:getId()}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.invitedPlayer, 100113, ''}, 'alliance member is full')
		
		self:helper_enableAllConditions()
		self.invitedPlayer:setCityId(9900002)
		assertEQ ( self.hdr:handle(self.invitedPlayer, {alliId=self.alliance:getId()}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.invitedPlayer, 100138, ''}, 'not same city')
		
		self:helper_enableAllConditions()
		self.alliance:setDismissStartTime(1)
		assertEQ ( self.hdr:handle(self.invitedPlayer, {alliId=self.alliance:getId()}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.invitedPlayer, 100114, ''}, 'alliance in dismissing state')
		
		self:helper_enableAllConditions()
		self.invitedPlayer:setAlliId(1)
		assertEQ ( self.hdr:handle(self.invitedPlayer, {alliId=self.alliance:getId()}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.invitedPlayer, 100107, ''}, 'invitedPlayer has alliance')
		
		self:helper_enableAllConditions()
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=1, effect={id=RES_EFF.EXIT_ALLIANCE,val=3,unit=0}}
		local creator = {type=0,id=0,skillId=0}
		self.invitedPlayer:getStateContainer():appendState(stateRes, creator)
		assertEQ ( self.hdr:handle(self.invitedPlayer, {alliId=self.alliance:getId()}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.invitedPlayer, 100108, ''}, 'invitedPlayer in exit alliance state')
		
		self:helper_enableAllConditions()
		TestCaseCondition:setPreCond(self.invitedPlayer, nil, { builds={ {id=6,resid=FIXID.ALLIINBUILD,level=0,state=0} } })
		assertEQ ( self.hdr:handle(self.invitedPlayer, {alliId=self.alliance:getId()}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.invitedPlayer, 100109, ''}, "invitedPlayer has't build for alliance")
		assertEQ ( self.invitedPlayer:getInviteJoinAlliances():has(self.alliance:getId()), false )
		
		self:helper_enableAllConditions()
		assertEQ ( self.hdr:handle(self.invitedPlayer, {alliId=self.alliance:getId()}), true )
		assertEQ ( self.invitedPlayer:getInviteJoinAlliances():has(self.alliance:getId()), false )
		assertEQ ( self.mm.params['sendDeleteInvite'], {self.invitedPlayer, self.alliance:getId()} )
		assertEQ ( self.invitedPlayer:getAlliId(), self.alliance:getId() )
		assertEQ ( self.alliance:getMemberById(self.invitedPlayer:getRoleId()):getAlliPos(), ALLI_POS.MEM  )
		assertEQ ( self.mm.params['saveAlliance'], {self.alliance}  )
		assertEQ ( self.mm.params['send'], {self.invitedPlayer, {'alliance'}}  )
		assertEQ ( self.mm.params['sendSelfAllianceDetail'], {self.invitedPlayer, self.alliance}  )
	end;
})

local TestCaseIgnoreInviteAllianceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(7)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.player:getInviteJoinAlliances():insert({allianceId=1,roleId=2})
		assertEQ ( self.player:getInviteJoinAlliances():has(1), true )
		self.mm:mock(AllianceSender, 'sendDeleteInvite')
		self.hdr:handle(self.player, {alliId=1})
		assertEQ ( self.mm.params['sendDeleteInvite'], {self.player, 1} )
		assertEQ ( self.player:getInviteJoinAlliances():has(1), false )
	end;
})

local TestCaseGetAllianceListHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(8)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle_country = function(self)
		self.player:setCityId(9900001)
		for i=1, 20, 1 do
			local alliance = app:getAlliMgr():createAlliance(self.player, 'alli' .. i, 'a' .. i)
			alliance:setLevel(i)
			alliance:setHonour(i*10)
			if i == 19 then
				alliance:setCityResId(9900002)
			end
		end
		
		app:getAlliMgr():sortAlliances()
		
		self.mm:mock(AllianceSender, 'sendAlliances')
		
		local cmd = {cityResId=9900001,pageNo=1}
		self.hdr:handle(self.player, cmd)
		
		local alliances1  = {}
		local alliances2  = {}
		for i=20, 1, -1 do
			local alliance = app:getAlliMgr():getAlliByName( 'alli' .. i )
			if table.getn(alliances1) < 12 then
				if alliance:getCityResId() == 9900001 then
					table.insert(alliances1, alliance)
				end
			else 
				if alliance:getCityResId() == 9900001 then
					table.insert(alliances2, alliance)
				end
			end
		end
		
		local pageCount = 2
		local pageNo = 1
		local selectIdx = -1
		assertEQ ( self.mm.params['sendAlliances'], {self.player, 9900001, alliances1, (pageNo-1)*12, pageCount, pageNo, selectIdx} )
		
		cmd = {cityResId=9900001,pageNo=-1}
		self.hdr:handle(self.player, cmd)
		assertEQ ( self.mm.params['sendAlliances'], {self.player, 9900001, alliances1, (pageNo-1)*12, pageCount, pageNo, selectIdx} )
		
		cmd = {cityResId=9900001,pageNo=2}
		self.hdr:handle(self.player, cmd)
		pageNo = 2
		assertEQ ( self.mm.params['sendAlliances'], {self.player, 9900001, alliances2, (pageNo-1)*12, pageCount, pageNo, selectIdx} )
		
		cmd = {cityResId=9900001,pageNo=3}
		self.hdr:handle(self.player, cmd)
		pageNo = 2
		assertEQ ( self.mm.params['sendAlliances'], {self.player, 9900001, alliances2, (pageNo-1)*12, pageCount, pageNo, selectIdx} )
		
		cmd = {cityResId=9900003,pageNo=1}
		self.hdr:handle(self.player, cmd)
		pageCount = 0
		pageNo = 0
		assertEQ ( self.mm.params['sendAlliances'], {self.player, 9900003, {}, (pageNo-1)*12, pageCount, pageNo, selectIdx} )
	end;
	
	test_handle = function(self)
		Service:getAllianceRank():clearRanks()
		self.player:setCityId(9900001)
		for i=1, 20, 1 do
			local alliance = app:getAlliMgr():createAlliance(self.player, 'alli' .. i, 'a' .. i)
			alliance:setLevel(i)
			alliance:setHonour(i*10)
		end
		
		self.mm:mock(AllianceSender, 'sendAlliances')
		local cmd = {cityResId=0,pageNo=1}
		self.hdr:handle(self.player, cmd)
		
		alliances1  = {}
		alliances2  = {}
		for i=1, 20, 1 do
			local alliance = app:getAlliMgr():getAlliByName( 'alli' .. i )
			if table.getn(alliances1) < 12 then
				table.insert(alliances1, alliance)
			else 
				table.insert(alliances2, alliance)
			end
		end
		
		pageCount = 2
		pageNo = 1
		local selectIdx = -1
		
		local ranks = Service:getAllianceRank():selectRanks(pageNo, 12)
		assertEQ ( self.mm.params['sendAlliances'], {self.player, 0, alliances1, (pageNo-1)*12, pageCount, pageNo, selectIdx, ranks} )
		
		cmd = {cityResId=0,pageNo=2}
		self.hdr:handle(self.player, cmd)
		pageCount = 2
		pageNo = 2
		ranks = Service:getAllianceRank():selectRanks(pageNo, 12)
		assertEQ ( self.mm.params['sendAlliances'], {self.player, 0, alliances2, (pageNo-1)*12, pageCount, pageNo, selectIdx, ranks} )	
	end;
})

local TestCaseSearchAllianceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(9)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle_country = function(self)
		self.player:setCityId(9900001)
		for i=1, 20, 1 do
			local alliance = app:getAlliMgr():createAlliance(self.player, 'alli' .. i, 'a' .. i)
			alliance:setLevel(i)
			alliance:setHonour(i*10)
			if i == 19 then
				alliance:setCityResId(9900002)
			end
		end
		
		app:getAlliMgr():sortAlliances()
		
		self.mm:mock(self.hdr.getAllianceListHdr, 'handle')
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		
		local cmd = {cityResId=9900001,name="alli100"}
		self.hdr:handle(self.player, cmd)
		assertEQ ( self.mm.walkLog, 'sendWarningMsgArgs' )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100117, ''} )
		
		self.mm:clear()
		cmd = {cityResId=0,name="alli100"}
		self.hdr:handle(self.player, cmd)
		assertEQ ( self.mm.walkLog, 'sendWarningMsgArgs' )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100116, ''} )
		
		self.mm:clear()
		cmd = {cityResId=9900001,name="alli19"}
		self.hdr:handle(self.player, cmd)
		assertEQ ( self.mm.walkLog, 'sendWarningMsgArgs' )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100117, ''} )
		
		self.mm:clear()
		cmd = {cityResId=9900001,name="alli2"}
		self.hdr:handle(self.player, cmd)
		assertEQ ( self.mm.walkLog, 'handle' )
		assertEQ ( self.mm.params['handle'], {self.player, {cityResId=9900001, pageNo=2, curSelIdx=5}} )
	end;
	
	test_handle = function(self)
		self.player:setCityId(9900001)
		for i=1, 20, 1 do
			local name = 'alli' .. i
			local alliance = app:getAlliMgr():createAlliance(self.player, name, 'a' .. i)
			alliance:setLevel(i)
			alliance:setHonour(i*10)
		end
		
		Service:getAllianceRank():clearRanks()
		for i=1, 20, 1 do
			local name = 'alli' .. i
			if i < 20 then
				Service:getAllianceRank():addRank({id=1, name=name})
			end
		end
		
		self.mm:mock(self.hdr.getAllianceListHdr, 'handle')
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		
		local cmd = {cityResId=0, name="alli16"}
		self.hdr:handle(self.player, cmd)
		assertEQ ( self.mm.walkLog, 'handle' )
		assertEQ ( self.mm.params['handle'], {self.player, {cityResId=0, pageNo=2, curSelIdx=3}} )
		
		self.mm:clear()
		cmd = {cityResId=0, name="alli20"}
		self.hdr:handle(self.player, cmd)
		assertEQ ( self.mm.walkLog, 'sendWarningMsgArgs' )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100116, ''} )
	end;
})

local TestCaseGetSelfAllianceMemsHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(10)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local leader = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r',100000)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		leader:setAlliId(alliance:getId())
		for i=1, 20, 1 do 
			local mem = AllianceMember()
			local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 100000 + i)
			memPlayer:setAlliId(alliance:getId())
			mem:setId(memPlayer:getRoleId())
			mem:setAlliPos(ALLI_POS.MEM)
			alliance:addMember(mem)
		end
		
		alliance:getMemberByIdx(11):setAlliPos(ALLI_POS.ALEADER)
		alliance:getMemberByIdx(9):setAlliPos(ALLI_POS.ELDER)
		
		self.mm:mock(AllianceSender, 'sendSelfAlliMems')
		self.hdr:handle( self.player, {pageNo=1} )
		assertEQ ( self.mm.walkLog, '' )
		
		self.hdr:handle( leader, {pageNo=1} )
		local pageCnt = 2
		local pageNo = 1

		assertEQ ( self.mm.params['sendSelfAlliMems'][1], leader)
		assertEQ ( self.mm.params['sendSelfAlliMems'][2], alliance)
		assertEQ ( self.mm.params['sendSelfAlliMems'][3][1]:getAlliPos(), ALLI_POS.LEADER )
		assertEQ ( self.mm.params['sendSelfAlliMems'][3][2]:getAlliPos(), ALLI_POS.ALEADER )
		assertEQ ( self.mm.params['sendSelfAlliMems'][3][3]:getAlliPos(), ALLI_POS.ELDER )
		assertEQ ( self.mm.params['sendSelfAlliMems'][3][4]:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendSelfAlliMems'][3][12]:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendSelfAlliMems'][4], pageCnt)
		assertEQ ( self.mm.params['sendSelfAlliMems'][5], pageNo)
		
		self.mm:clear()
		self.hdr:handle( leader, {pageNo=0} )
		pageCnt = 2
		pageNo = 1
		assertEQ ( self.mm.params['sendSelfAlliMems'][1], leader)
		assertEQ ( self.mm.params['sendSelfAlliMems'][2], alliance)
		assertEQ ( self.mm.params['sendSelfAlliMems'][3][1]:getAlliPos(), ALLI_POS.LEADER )
		assertEQ ( self.mm.params['sendSelfAlliMems'][3][2]:getAlliPos(), ALLI_POS.ALEADER )
		assertEQ ( self.mm.params['sendSelfAlliMems'][3][3]:getAlliPos(), ALLI_POS.ELDER )
		assertEQ ( self.mm.params['sendSelfAlliMems'][3][4]:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendSelfAlliMems'][3][12]:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendSelfAlliMems'][4], pageCnt)
		assertEQ ( self.mm.params['sendSelfAlliMems'][5], pageNo)
		

		self.mm:clear()
		self.hdr:handle( leader, {pageNo=2} )
		pageCnt = 2
		pageNo = 2
		assertEQ ( self.mm.params['sendSelfAlliMems'][1], leader)
		assertEQ ( self.mm.params['sendSelfAlliMems'][2], alliance)
		assertEQ ( self.mm.params['sendSelfAlliMems'][3][1]:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendSelfAlliMems'][3][2]:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendSelfAlliMems'][3][9]:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendSelfAlliMems'][3][10], nil )
		assertEQ ( self.mm.params['sendSelfAlliMems'][4], pageCnt)
		assertEQ ( self.mm.params['sendSelfAlliMems'][5], pageNo)
		
		self.mm:clear()
		self.hdr:handle( leader, {pageNo=3} )
		pageCnt = 2
		pageNo = 2
		assertEQ ( self.mm.params['sendSelfAlliMems'][1], leader)
		assertEQ ( self.mm.params['sendSelfAlliMems'][2], alliance)
		assertEQ ( self.mm.params['sendSelfAlliMems'][3][1]:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendSelfAlliMems'][3][2]:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendSelfAlliMems'][3][9]:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendSelfAlliMems'][3][10], nil )
		assertEQ ( self.mm.params['sendSelfAlliMems'][4], pageCnt)
		assertEQ ( self.mm.params['sendSelfAlliMems'][5], pageNo)
	end;
})

local TestCaseGetOtherAllianceMemsHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(11)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local leader = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r',100000)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		leader:setAlliId(alliance:getId())
		for i=1, 20, 1 do 
			local mem = AllianceMember()
			local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 100000 + i)
			memPlayer:setAlliId(alliance:getId())
			mem:setId(memPlayer:getRoleId())
			mem:setAlliPos(ALLI_POS.MEM)
			alliance:addMember(mem)
		end
		
		alliance:getMemberByIdx(11):setAlliPos(ALLI_POS.ALEADER)
		alliance:getMemberByIdx(9):setAlliPos(ALLI_POS.ELDER)
		
		self.mm:mock(AllianceSender, 'sendOtherAlliMems')
		self.hdr:handle( self.player, {name='xxx', pageNo=1} )
		assertEQ ( self.mm.walkLog, '' )
		
		self.hdr:handle( self.player, {name='alliance', pageNo=1} )
		local pageCnt = 2
		local pageNo = 1
		assertEQ ( self.mm.params['sendOtherAlliMems'][1], self.player)
		assertEQ ( self.mm.params['sendOtherAlliMems'][2], alliance)
		assertEQ ( self.mm.params['sendOtherAlliMems'][3][1]:getAlliPos(), ALLI_POS.LEADER )
		assertEQ ( self.mm.params['sendOtherAlliMems'][3][2]:getAlliPos(), ALLI_POS.ALEADER )
		assertEQ ( self.mm.params['sendOtherAlliMems'][3][3]:getAlliPos(), ALLI_POS.ELDER )
		assertEQ ( self.mm.params['sendOtherAlliMems'][3][4]:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendOtherAlliMems'][3][12]:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendOtherAlliMems'][4], pageCnt)
		assertEQ ( self.mm.params['sendOtherAlliMems'][5], pageNo)
		
		self.mm:clear()
		self.hdr:handle( self.player, {name='alliance', pageNo=0} )
		pageCnt = 2
		pageNo = 1
		assertEQ ( self.mm.params['sendOtherAlliMems'][1], self.player)
		assertEQ ( self.mm.params['sendOtherAlliMems'][2], alliance)
		assertEQ ( self.mm.params['sendOtherAlliMems'][3][1]:getAlliPos(), ALLI_POS.LEADER )
		assertEQ ( self.mm.params['sendOtherAlliMems'][3][2]:getAlliPos(), ALLI_POS.ALEADER )
		assertEQ ( self.mm.params['sendOtherAlliMems'][3][3]:getAlliPos(), ALLI_POS.ELDER )
		assertEQ ( self.mm.params['sendOtherAlliMems'][3][4]:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendOtherAlliMems'][3][12]:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendOtherAlliMems'][4], pageCnt)
		assertEQ ( self.mm.params['sendOtherAlliMems'][5], pageNo)
		
		mems = {}
		table.insert( mems, alliance:getMemberByIdx(12) )
		table.insert( mems, alliance:getMemberByIdx(13) )
		table.insert( mems, alliance:getMemberByIdx(14) )
		table.insert( mems, alliance:getMemberByIdx(15) )
		table.insert( mems, alliance:getMemberByIdx(16) )
		table.insert( mems, alliance:getMemberByIdx(17) )
		table.insert( mems, alliance:getMemberByIdx(18) )
		table.insert( mems, alliance:getMemberByIdx(19) )
		table.insert( mems, alliance:getMemberByIdx(20) )
		
		self.mm:clear()
		self.hdr:handle( self.player, {name='alliance', pageNo=2} )
		pageCnt = 2
		pageNo = 2
		assertEQ ( self.mm.params['sendOtherAlliMems'][1], self.player)
		assertEQ ( self.mm.params['sendOtherAlliMems'][2], alliance)
		assertEQ ( self.mm.params['sendOtherAlliMems'][3][1]:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendOtherAlliMems'][3][2]:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendOtherAlliMems'][3][9]:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendOtherAlliMems'][3][10], nil )
		assertEQ ( self.mm.params['sendOtherAlliMems'][4], pageCnt)
		assertEQ ( self.mm.params['sendOtherAlliMems'][5], pageNo)
		
		self.mm:clear()
		self.hdr:handle( self.player, {name='alliance', pageNo=3} )
		pageCnt = 2
		pageNo = 2
		assertEQ ( self.mm.params['sendOtherAlliMems'][1], self.player)
		assertEQ ( self.mm.params['sendOtherAlliMems'][2], alliance)
		assertEQ ( self.mm.params['sendOtherAlliMems'][3][1]:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendOtherAlliMems'][3][2]:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendOtherAlliMems'][3][9]:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendOtherAlliMems'][3][10], nil )
		assertEQ ( self.mm.params['sendOtherAlliMems'][4], pageCnt)
		assertEQ ( self.mm.params['sendOtherAlliMems'][5], pageNo)
	end;
})

local TestCaseGetMyAllianceDetailHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(12)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local leader = TestCaseHelper:loadPlayerByUserNameEx('user', 'leader',100000)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		leader:setAlliId(0)
		
		self.mm:mock(AllianceSender, 'sendSelfAllianceDetail');
		self.mm:mock(AllianceSender, 'sendSelfMember');
		self.mm:mock(AllianceSender, 'sendSelfLawLight');
		self.mm:mock(AllianceSender, 'sendApplyListToPlayer');
		
		self.hdr:handle(leader)
		assertEQ ( self.mm.walkLog, '' )
		
		leader:setAlliId(alliance:getId())
		self.hdr:handle(leader)
		assertEQ ( self.mm.params['sendSelfAllianceDetail'], {leader, alliance} )
		assertEQ ( self.mm.params['sendSelfMember'], {leader, alliance} )
		assertEQ ( self.mm.params['sendSelfLawLight'], {leader, alliance} )
		assertEQ ( self.mm.params['sendSelfLawLight'], {leader, alliance} )
		assertEQ ( self.mm.params['sendApplyListToPlayer'], {leader, alliance} )
		
		self.mm:clear()
		local mem = AllianceMember()
		local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		memPlayer:setAlliId(alliance:getId())
		mem:setId(memPlayer:getRoleId())
		mem:setAlliPos(ALLI_POS.MEM)
		alliance:addMember(mem)
			
		self.hdr:handle(memPlayer)
		assertEQ ( self.mm.params['sendSelfAllianceDetail'], {memPlayer, alliance} )
		assertEQ ( self.mm.params['sendSelfMember'], {memPlayer, alliance} )
		assertEQ ( self.mm.params['sendSelfLawLight'], {memPlayer, alliance} )
		assertEQ ( self.mm.params['sendSelfLawLight'], {memPlayer, alliance} )
		assertEQ ( self.mm.walkLog, 'sendSelfAllianceDetail,sendSelfMember,sendSelfLawLight' )
	end;
})

local TestCaseUpgradeAllianceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(13)
		alliance = nil
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:travelMock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock( AllianceSender, 'sendSelfAllianceDetail' )
		
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		
		self.player:setAlliId(0)
		alliance:setBuildVal(1000000)
		assertEQ ( self.hdr:handle(self.player), false )
		
		self.player:setAlliId(alliance:getId())
		alliance:setBuildVal(0)
		assertEQ ( self.hdr:handle(self.player), false )
		
		alliance:setLevel(res_alli_max_level)
		alliance:setBuildVal(1000000)
		assertEQ ( self.hdr:handle(self.player), false )
		
		alliance:setLevel(1)
		alliance:getMemberById(self.player:getRoleId()):setAlliPos(ALLI_POS.ALEADER)
		assertEQ ( self.hdr:handle(self.player), false )
		
		self.mm:clear()
		alliance:getMemberById(self.player:getRoleId()):setAlliPos(ALLI_POS.LEADER)
		alliance:setLevel(1)
		local nextNeedRes = res_alli_upd_needs[alliance:getLevel()+1]
		alliance:setBuildVal(nextNeedRes.needbuildval)
		alliance:setUpgradeStartTime(1)
		alliance:setUpgradeStopTime(10)
		assertEQ ( self.hdr:handle(self.player), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100122, ''}, 'alliance in upgrading state' )
		
		Util:setTimeDrt(10)
		self.mm:clear()
		alliance:setUpgradeStartTime(0)
		alliance:setUpgradeStopTime(0)
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( alliance:getLevel(), 1 )
		assertEQ ( alliance:getBuildVal(), 0 )
		assertEQ ( alliance:getUpgradeStartTime(), Util:getTime() )
		assertEQ ( alliance:getUpgradeStopTime(), Util:getTime() + nextNeedRes.needtime )
		assertEQ ( self.mm.params['sendSelfAllianceDetail'], {self.player, alliance} )
	end;
})

local TestCaseModifyQQGroupHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(14)
		alliance = nil
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(AllianceSender, 'sendSelfAllianceDetail');
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		
		self.player:setAlliId(0)
		assertEQ ( self.hdr:handle(self.player, {qq=12345}), false )
		
		self.player:setAlliId(alliance:getId())
		assertEQ ( self.hdr:handle(self.player, {qq=MAX_QQ_GROUP+1}), false )
		
		local member = alliance:getMemberByIdx(0)
		member:setAlliPos(ALLI_POS.ALEADER)
		assertEQ ( self.hdr:handle(self.player, {qq=MAX_QQ_GROUP}), false )
		
		member:setAlliPos(ALLI_POS.LEADER)
		assertEQ ( self.hdr:handle(self.player, {qq=MAX_QQ_GROUP}), true )
		assertEQ ( alliance:getQQGroup(), MAX_QQ_GROUP )
		assertEQ ( self.mm.params['sendSelfAllianceDetail'], {self.player, alliance} )
	end;
})

local TestCaseInviteAllianceMemberHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(15)
		alliance = nil
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(WUtil, 'sendSuccMsgArgs');
		self.mm:mock(WUtil, 'sendWarningMsgArgs');
		self.mm:mock(AllianceSender, 'sendGetInviteList');
		
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		local target = TestCaseHelper:loadPlayerByUserNameEx('targetuser', 'target', 100001)
		target:setCityId(9900001)
		alliance:setCityResId(9900001)
		TestCaseCondition:setPreCond(target, nil, { builds={ {id=6,resid=FIXID.ALLIINBUILD,level=1,state=0} } })
		
		self.player:setAlliId(0)
		assertEQ ( self.hdr:handle(self.player, {role='target'}), false )
		
		self.player:setAlliId(alliance:getId())
		local member = alliance:getMemberByIdx(0)
		member:setAlliPos(ALLI_POS.MEM)
		assertEQ ( self.hdr:handle(self.player, {role='target'}), false )
		
		self.mm:clear()
		member:setAlliPos(ALLI_POS.ELDER)
		for i=1, res_alli_upd_needs[1].memmaxcount-1, 1 do 
			local mem = AllianceMember()
			local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000 + i)
			memPlayer:setAlliId(alliance:getId())
			mem:setId(memPlayer:getRoleId())
			alliance:addMember(mem)
		end
		assertEQ ( self.hdr:handle(self.player, {role='target'}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100123, ''}, 'alliance member is full' )

		self.mm:clear()
		alliance:removeMember(1)
		assertEQ ( self.hdr:handle(self.player, {role='targetxxx'}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100050, ''}, 'the target player is no exist' )
		
		self.mm:clear()
		local invites = target:getInviteJoinAlliances()
		invites:insert({allianceId=alliance:getId(), roleId=self.player:getRoleId()})
		for i=1, 100, 1 do
			invites:insert({allianceId=i, roleId=i})
		end
		assertEQ ( self.hdr:handle(self.player, {role='target'}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100124, ''}, 'the target invite list is full' )
		
		self.mm:clear()
		invites:remove(1)
		assertEQ ( self.hdr:handle(self.player, {role='target'}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100125, ''}, 'the target be invited' )
		
		self.mm:clear()
		invites:remove(alliance:getId())
		target:setAlliId(1)
		assertEQ ( self.hdr:handle(self.player, {role='target'}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100126, ''}, 'the target is in alliance' )
		
		self.mm:clear()
		target:setAlliId(0)
		TestCaseCondition:setPreCond(target, nil, { builds={ {id=6,resid=FIXID.ALLIINBUILD,level=0,state=0} } })
		assertEQ ( self.hdr:handle(self.player, {role='target'}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100136, ''}, 'has no alliance build' )
		
		self.mm:clear()
		TestCaseCondition:setPreCond(target, nil, { builds={ {id=6,resid=FIXID.ALLIINBUILD,level=1,state=0} } })
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=1, effect={id=RES_EFF.EXIT_ALLIANCE,val=3,unit=0}}
		local creator = {type=0,id=0,skillId=0}
		target:getStateContainer():appendState(stateRes, creator)
		assertEQ ( self.hdr:handle(self.player, {role='target'}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100135, ''}, 'the targe has exit alliance buff' )
		
		self.mm:clear()
		target:getStateContainer():stopState(RES_EFF.EXIT_ALLIANCE)
		target:setCityId(9900002)
		assertEQ ( self.hdr:handle(self.player, {role='target'}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100134, ''}, 'not same city' )
		
		self.mm:clear()
		target:setCityId(9900001)
		alliance:setDismissStartTime(1)
		assertEQ ( self.hdr:handle(self.player, {role='target'}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100114, ''}, 'alliance in dismissing state' )
		
		self.mm:clear()
		alliance:setDismissStartTime(0)
		assertEQ ( self.hdr:handle(self.player, {role='target'}), true )
		assertEQ ( invites:has(alliance:getId()), true )
		assertEQ ( self.mm.params['sendSuccMsgArgs'], {self.player, 100127, ''}, 'invite ok' )
		assertEQ ( self.mm.params['sendGetInviteList'], {target}, 'invite ok' )
	end
})

local TestCaseDismissAllianceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(16)
		alliance = nil
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(AllianceSender, 'sendSelfAllianceDetail')
		local leaderPlayer = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100000)
		local alliance = app:getAlliMgr():createAlliance(leaderPlayer, 'alliance', 'f')
		local mem = AllianceMember()
		local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		memPlayer:setAlliId(alliance:getId())
		mem:setId(memPlayer:getRoleId())
		alliance:addMember(mem)
		
		leaderPlayer:setAlliId(0)
		assertEQ ( self.hdr:handle(leaderPlayer), false )
		
		leaderPlayer:setAlliId(alliance:getId())
		local member = alliance:getMemberByIdx(0)
		member:setAlliPos(ALLI_POS.ALEADER)
		assertEQ ( self.hdr:handle(leaderPlayer), false )
		
		member:setAlliPos(ALLI_POS.LEADER)
		alliance:setDismissStartTime(1)
		assertEQ ( self.hdr:handle(leaderPlayer), false )
		
		alliance:setDismissStartTime(0)
		alliance:setTransferStartTime(1)
		assertEQ ( self.hdr:handle(leaderPlayer), false )
		
		Util:setTimeDrt(10)
		alliance:setTransferStartTime(0)
		assertEQ ( self.hdr:handle(leaderPlayer), true )
		assertEQ ( alliance:getDismissStartTime(), 10 )
		assertEQ ( self.mm.params['sendSelfAllianceDetail'], {leaderPlayer, alliance} )
	end;
})

local TestCaseCancelDismissAllianceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(17)
		alliance = nil
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(AllianceSender, 'sendSelfAllianceDetail')
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		
		self.player:setAlliId(0)
		assertEQ ( self.hdr:handle(self.player), false )
		
		self.player:setAlliId( alliance:getId() )
		local member = alliance:getMemberByIdx(0)
		member:setAlliPos(ALLI_POS.ALEADER)
		assertEQ ( self.hdr:handle(self.player), false )
		
		alliance:setDismissStartTime(0)
		member:setAlliPos(ALLI_POS.LEADER)
		assertEQ ( self.hdr:handle(self.player), false )
		
		alliance:setDismissStartTime(1)
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( alliance:isDismissing(), false )
		assertEQ ( self.mm.params['sendSelfAllianceDetail'], {self.player, alliance} )
	end;
})

local TestCaseExitAllianceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(18)
		alliance = nil
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(RoleBaseSender, 'send')
		
		local leaderPlayer = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100000)
		local alliance = app:getAlliMgr():createAlliance(leaderPlayer, 'alliance', 'f')
		local mem = AllianceMember()
		local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		memPlayer:setAlliId(alliance:getId())
		mem:setId(memPlayer:getRoleId())
		mem:setAlliPos(ALLI_POS.MEM)
		alliance:addMember(mem)
		
		leaderPlayer:setAlliId(0)
		assertEQ ( self.hdr:handle(leaderPlayer), false )
		
		leaderPlayer:setAlliId(alliance:getId())
		local member = alliance:getMemberByIdx(0)
		member:setAlliPos(ALLI_POS.LEADER)
		assertEQ ( self.hdr:handle(leaderPlayer), false )
		
		alliance:setTransferStartTime(1)
		alliance:setTransferTarget('source_r')
		
		member:setAlliPos(ALLI_POS.ALEADER)
		assertEQ ( self.hdr:handle(leaderPlayer), true )
		local state = leaderPlayer:getStateContainer():getEffectState(RES_EFF.EXIT_ALLIANCE)
		assertEQ ( state:getDuration(), 12*3600 )
		assertEQ ( leaderPlayer:getAlliId(), 0 )
		assertEQ ( alliance:getMemberCount(), 1 )
		assertEQ ( alliance:getMemberById(memPlayer:getRoleId()):getId(), memPlayer:getRoleId() )
		assertEQ ( self.mm.params['send'], {leaderPlayer, {'alliance'}} )
		assertEQ ( alliance:isTransfering(), true )
		assertEQ ( self.hdr:handle(memPlayer), true )
		assertEQ ( alliance:isTransfering(), false )
	end;
})

local TestCaseModifyAllianceIntroducHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(19)
		alliance = nil
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(AllianceSender, 'sendSelfAllianceDetail');
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		
		self.player:setAlliId(0)
		assertEQ ( self.hdr:handle(self.player, {introduce='introduce'}), false )
		
		self.player:setAlliId( alliance:getId() )
		local member = alliance:getMemberByIdx(0)
		member:setAlliPos(ALLI_POS.ALEADER)
		assertEQ ( self.hdr:handle(self.player), false )
		
		member:setAlliPos(ALLI_POS.LEADER)
		self.player:setAlliId(alliance:getId())
		local introduce = ''
		for i=1, MAX_ALLI_INTRODUCE_LEN+1, 1 do
			introduce = introduce .. '1'
		end
		assertEQ ( self.hdr:handle(self.player, {introduce=introduce}), false )
		
		self.player:setAlliId(alliance:getId())
		assertEQ ( self.hdr:handle(self.player, {introduce='introduce'}), true )
		assertEQ ( alliance:getIntroduction(), 'introduce' )
		assertEQ ( self.mm.params['sendSelfAllianceDetail'], {self.player, alliance} )
	end;
})

local TestCaseModifyAllianceBulletinHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(20)
		alliance = nil
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(AllianceSender, 'sendSelfAllianceDetail');
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		
		self.player:setAlliId(0)
		assertEQ ( self.hdr:handle(self.player, {bulletin='bulletin'} ), false )
		
		self.player:setAlliId( alliance:getId() )
		local member = alliance:getMemberByIdx(0)
		member:setAlliPos(ALLI_POS.ALEADER)
		assertEQ ( self.hdr:handle(self.player), false )
		
		member:setAlliPos(ALLI_POS.LEADER)
		self.player:setAlliId(alliance:getId())
		local bulletin = ''
		for i=1, MAX_ALLI_BULLETIN_LEN+1, 1 do
			bulletin = bulletin .. '1'
		end
		assertEQ ( self.hdr:handle(self.player, {bulletin=bulletin}), false )
		
		self.player:setAlliId(alliance:getId())
		assertEQ ( self.hdr:handle(self.player, {bulletin='bulletin'}), true )
		assertEQ ( alliance:getBulletin(), 'bulletin' )
		assertEQ ( self.mm.params['sendSelfAllianceDetail'], {self.player, alliance} )
	end;
})

local TestCaseGainAllianceTodayGiftHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(21)
		alliance = nil
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local r_isCanExec = {false}
		self.mm:travelMock(WUtil, 'sendWarningMsgArgs')
		self.mm:travelMock(AllianceSender, 'sendSelfMember')
		self.mm:mock(EffectorMgr:getEffector({id=RES_EFF.DROPITEM}), 'isCanExec', r_isCanExec)
		self.mm:mock(EffectorMgr:getEffector({id=RES_EFF.DROPITEM}), 'exec')
		self.mm:mock(TaskFinisher, 'trigerTask' )
		
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		alliance:setLevel(1)
		
		self.mm:clear()
		self.player:setAlliId(0)
		assertEQ ( self.hdr:handle(self.player  ), false )
		
		self.mm:clear()
		self.player:setAlliId(alliance:getId())
		Util:setTimeDrt(1370516597)
		local member = alliance:getMemberByIdx(0)
		member:setGainGiftCount({count=1, lastTime=1370516597})
		assertEQ ( self.hdr:handle(self.player  ), false )
		
		self.mm:clear()
		Util:setTimeDrt(1370516597+24*3600)
		assertEQ ( self.hdr:handle(self.player  ), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100128, ''}, 'no enough contributes' )
		
		self.mm:clear()
		local res = res_alli_upd_needs[1]
		member:setContributes(res.expendcontribute)
		assertEQ ( self.hdr:handle(self.player  ), false )
		assertEQ ( self.mm.walkLog, 'isCanExec' )
		assertEQ ( self.mm.params['isCanExec'], { self.player, 1, {id=RES_EFF.DROPITEM, val=res.getitemdropid}, {} } )
		
		self.mm:clear()
		r_isCanExec[1] = true
		assertEQ ( self.hdr:handle(self.player  ), true )
		assertEQ ( self.mm.walkLog, 'isCanExec,exec,sendSelfMember,trigerTask' )
		assertEQ ( self.mm.params['exec'], { self.player, 1, {id=RES_EFF.DROPITEM, val=res.getitemdropid}, {} } )
		assertEQ ( member:getContributes() , 0 )
		assertEQ ( member:getGainGiftCount() > 0, true )
		assertEQ ( self.mm.params['sendSelfMember'], { self.player, alliance } )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.GET_ALLI_GIFT} )
	end;
})

local TestCaseUpgradeLawLightHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(22)
		alliance = nil
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock( WUtil, 'sendSuccMsgArgs' )
		self.mm:travelMock(AllianceSender, 'sendSelfAllianceDetail')
		self.mm:travelMock(AllianceSender, 'sendSelfLawLight')
		self.mm:travelMock(app:getAlliMgr(), 'addAllianceEvent')
		
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		self.player:setAlliId(0)
		assertEQ ( self.hdr:handle(self.player ), false )
		
		self.player:setAlliId(alliance:getId())
		local member = alliance:getMemberByIdx(0)
		member:setAlliPos(ALLI_POS.ALEADER)
		alliance:setBuildVal(1000000)
		alliance:setCardNumber(1000000)
		assertEQ ( self.hdr:handle(self.player ), false )
		
		member:setAlliPos(ALLI_POS.LEADER)
		alliance:setBuildVal(0)
		alliance:setCardNumber(0)
		assertEQ ( self.hdr:handle(self.player ), false )
		
		alliance:setBuildVal(1000000)
		alliance:setCardNumber(1000000)
		alliance:getLawLight():setLevel(res_alli_lawlight_maxlevel)
		assertEQ ( self.hdr:handle(self.player ), false )

		local oldHonour = alliance:getHonour()
		local nextRes = res_alli_lawlight_upd[1 + 1 ]
		alliance:setBuildVal(nextRes.needbuildval + 1)
		alliance:setCardNumber(nextRes.needcard + 2)
		alliance:getLawLight():setLevel(1)
		assertEQ ( self.hdr:handle(self.player ), true )
		assertEQ ( alliance:getHonour(), oldHonour + 200 )
		assertEQ ( alliance:getBuildVal(), 1 )
		assertEQ ( alliance:getCardNumber(), 2 )
		assertEQ ( alliance:getLawLight():getLevel(), 2 )
		assertEQ ( self.mm.params['addAllianceEvent'], { alliance, 'upgradeLawLight', {level= alliance:getLawLight():getLevel(), addHonour=200}  } )
		assertEQ ( self.mm.params['sendSuccMsgArgs'], {self.player, 100130, ''}, 'lawlight upgrade success!' )
		assertEQ ( self.mm.params['sendSelfAllianceDetail'], {self.player, alliance} )
		assertEQ ( self.mm.params['sendSelfLawLight'], {self.player, alliance} )
	end;
})

local TestCaseLawLightBestowHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(23)
		alliance = nil
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local r_isCanExec = {true}
		self.mm:mock(EffectorMgr:getEffector({id=RES_EFF.PASSIVITY_DROPITEM}), 'isCanExec', r_isCanExec)
		self.mm:mock(EffectorMgr:getEffector({id=RES_EFF.PASSIVITY_DROPITEM}), 'exec')
		self.mm:mock(app:getAlliMgr(), 'addAllianceEvent')
		
		local leader = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100001)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		local mem = AllianceMember()
		local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		memPlayer:setAlliId(alliance:getId())
		mem:setId(memPlayer:getRoleId())
		alliance:addMember(mem)
		mem = AllianceMember()
		self.player:setAlliId(alliance:getId())
		mem:setId(self.player:getRoleId())
		alliance:addMember(mem)
		
		leader:setAlliId(0)
		assertEQ ( self.hdr:handle(leader ), false )
		
		local res = res_alli_lawlight_upd[1]
		leader:setAlliId(alliance:getId())
		alliance:getLawLight():setGrowupVal(res.maxgrowupval)
		local member = alliance:getMemberByIdx(0)
		member:setAlliPos(ALLI_POS.ALEADER)
		assertEQ ( self.hdr:handle(leader ), false )
		
		alliance:getLawLight():setGrowupVal(res.maxgrowupval - 1)
		member:setAlliPos(ALLI_POS.LEADER)
		assertEQ ( self.hdr:handle(leader ), false )
		
		self.mm:clear()
		local oldHonour = alliance:getHonour()
		alliance:getLawLight():setGrowupVal(res.maxgrowupval)
		assertEQ ( self.hdr:handle(leader ), true )
		assertEQ ( self.mm.walkLog, 'isCanExec,exec,exec,addAllianceEvent' )
		assertEQ ( alliance:getHonour(), oldHonour + 200 )
		assertEQ ( alliance:getLawLight():getGrowupVal(), 0 )
		assertEQ ( self.mm.params['isCanExec'], { leader, 1, {id=RES_EFF.PASSIVITY_DROPITEM, val=res.bestowdropid}, {} } )
		assertEQ ( self.mm.params['exec.1'], { leader, 1, {id=RES_EFF.PASSIVITY_DROPITEM, val=res.bestowdropid}, {} } )
		assertEQ ( self.mm.params['exec.2'], { memPlayer, 1, {id=RES_EFF.PASSIVITY_DROPITEM, val=res.bestowdropid}, {} } )
		assertEQ ( self.mm.params['addAllianceEvent'], {alliance, 'lawLightBestow', {addHonour=200} } )
	end;
})

local TestCaseLawLightFeedHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(24)
		alliance = nil
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(AllianceSender, 'sendSelfMember');
		self.mm:mock(AllianceSender, 'sendSelfLawLight');
		self.mm:mock(TaskFinisher, 'trigerTask');
		
		local r_isCanExec = {false}
		self.mm:mock(EffectorMgr:getEffector({id=RES_EFF.DROPITEM}), 'isCanExec', r_isCanExec)
		self.mm:mock(EffectorMgr:getEffector({id=RES_EFF.DROPITEM}), 'exec')
		
		local leader = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100001)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		
		leader:setAlliId(0)
		assertEQ ( self.hdr:handle(leader, {isAll=0} ), false )
		
		alliance:getLawLight():setLevel(1)
		leader:setAlliId(alliance:getId())
		local res = res_alli_lawlight_upd[1]
		
		local member = alliance:getMemberByIdx(0)
		member:setContributes(res.feedneedcontributes-1)
		assertEQ ( self.hdr:handle( leader, {isAll=0} ), false )
		
		Util:setTimeDrt(1370516597)
		member:setContributes(res.feedneedcontributes*2)
		member:setFeedCount({count=res.maxfeedtimes, lastTime=Util:getTime()})
		assertEQ ( self.hdr:handle( leader, {isAll=0} ), false )
		
		Util:setTimeDrt(1370516597+24*3600)
		assertEQ ( self.hdr:handle( leader, {isAll=0} ), false )
		
		local old_growupVal = alliance:getLawLight():getGrowupVal()
		self.mm:clear()
		r_isCanExec[1] = true
		assertEQ ( self.hdr:handle(leader, {isAll=0} ), true )
		assertEQ ( self.mm.params['isCanExec'], {leader, 1, {id=RES_EFF.DROPITEM, val=res.feeddropid}, {}} )
		assertEQ ( self.mm.params['exec'], {leader, 1, {id=RES_EFF.DROPITEM, val=res.feeddropid}, {}} )
		assertEQ ( alliance:getLawLight():getGrowupVal(), old_growupVal + 1 )
		assertEQ ( member:getContributes(), res.feedneedcontributes )
		assertEQ ( member:getFeedCount(), 1 )
		assertEQ ( self.mm.params['sendSelfMember'], {leader, alliance} )
		assertEQ ( self.mm.params['sendSelfLawLight'], {leader, alliance} )
		assertEQ ( self.mm.params['trigerTask'], {leader, TASK_FINISH_TYPE.FEED_LIGHTLAW} )
		
		self.mm:clear()
		old_growupVal = alliance:getLawLight():getGrowupVal()
		member:setFeedCount({lastTime=0, count=0})
		member:setContributes(res.feedneedcontributes*2)
		assertEQ ( self.hdr:handle(leader, {isAll=1} ), true )
		assertEQ ( self.mm.params['exec'], {leader, 2, {id=RES_EFF.DROPITEM, val=res.feeddropid}, {}} )
		assertEQ ( member:getContributes(), 0 )
		assertEQ ( member:getFeedCount(), 2 )
		assertEQ ( alliance:getLawLight():getGrowupVal(), old_growupVal + 2)
		assertStrRepeatCount ( self.mm.walkLog, 'trigerTask', 2, ' trigger task two times')
		
		old_growupVal = alliance:getLawLight():getGrowupVal()
		member:setFeedCount({lastTime=Util:getTime(), count=res.maxfeedtimes-2})
		member:setContributes(res.feedneedcontributes*3)
		assertEQ ( self.hdr:handle(leader, {isAll=1} ), true )
		assertEQ ( self.mm.params['exec'], {leader, 2, {id=RES_EFF.DROPITEM, val=res.feeddropid}, {}} )
		assertEQ ( member:getContributes(), res.feedneedcontributes )
		assertEQ ( member:getFeedCount(), res.maxfeedtimes )
		assertEQ ( alliance:getLawLight():getGrowupVal(), old_growupVal + 2)
		
		member:setFeedCount({lastTime=Util:getTime(), count=res.maxfeedtimes})
		member:setContributes(res.feedneedcontributes*3)
		assertEQ ( self.hdr:handle(leader, {isAll=1} ), false )
		
		member:setFeedCount({lastTime=Util:getTime(), count=res.maxfeedtimes-1})
		member:setContributes(res.feedneedcontributes-1)
		assertEQ ( self.hdr:handle(leader, {isAll=1} ), false )
		
		self.mm:clear()
		leader:setVipLevel(3)
		member:setFeedCount({lastTime=Util:getTime(), count=res.maxfeedtimes-2})
		member:setContributes(res.feedneedcontributes*3)
		assertEQ ( self.hdr:handle(leader, {isAll=1} ), true )
		assertEQ ( self.mm.params['exec'], {leader, 3, {id=RES_EFF.DROPITEM, val=res.feeddropid}, {}} )
	end;
})

local TestCaseGetALeadersHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(25)
		alliance = nil
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(AllianceSender, 'sendALeaders');
		
		local leader = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100001)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		
		leader:setAlliId(0)
		assertEQ ( self.hdr:handle(leader ), false )
		
		leader:setAlliId(alliance:getId())
		local member = alliance:getMemberByIdx(0)
		member:setAlliPos(ALLI_POS.ALEADER)
		assertEQ ( self.hdr:handle(leader ), false )
		
		member:setAlliPos(ALLI_POS.LEADER)
		assertEQ ( self.hdr:handle(leader ), true )
		assertEQ ( self.mm.params['sendALeaders'], {leader, alliance,} )
	end;
})

local TestCaseTransferLeaderAllianceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(26)
		alliance = nil
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(app:getMailMgr(), 'addSysMail', {{name='mail'}});
		self.mm:mock(MailSender, 'sendBriefMail');
		self.mm:mock(AllianceSender, 'sendSelfAllianceDetail');
		
		local leader = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100001)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		local mem = AllianceMember()
		local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('user1', 'role1', 100002)
		memPlayer:setAlliId(alliance:getId())
		mem:setId(memPlayer:getRoleId())
		mem:setAlliPos(ALLI_POS.ALEADER)
		alliance:addMember(mem)
		
		leader:setAlliId(0)
		assertEQ ( self.hdr:handle(leader, {role='role1'}), false )
		
		leader:setAlliId(alliance:getId())
		local member = alliance:getMemberByIdx(0)
		member:setAlliPos(ALLI_POS.ALEADER)
		assertEQ ( self.hdr:handle(leader, {role="role1"}), false )
		
		member:setAlliPos(ALLI_POS.LEADER)
		assertEQ ( self.hdr:handle(leader, {role="xxx"}), false )
		
		assertEQ ( self.hdr:handle(leader, {role="leader_r"}), false )
		
		assertEQ ( self.hdr:handle(leader, {role=self.player:getRoleName()}), false )
		
		alliance:setTransferStartTime(1)
		alliance:setTransferTarget('role1')
		assertEQ ( self.hdr:handle(leader, {role="role1"}), false )
		
		alliance:setTransferStartTime(0)
		alliance:setTransferTarget('')
		alliance:setDismissStartTime(1)
		assertEQ ( self.hdr:handle(leader, {role="role1"}), false )
		
		alliance:setDismissStartTime(0)
		assertEQ ( self.hdr:handle(leader, {role="role1"}), true )
		assertEQ ( alliance:getTransferStartTime(), Util:getTime() )
		assertEQ ( alliance:getTransferTarget(), 'role1' )
		
		assertEQ ( self.mm.params['addSysMail'], {memPlayer:getRoleName(), rstr.mail.title.transferLeader, FIXID.COMM_SYS_MAILTEMP, string.format(rstr.mail.content.transferingLeader, 'leader_r') } )
		assertEQ ( self.mm.params['sendBriefMail'], {memPlayer, {name='mail'}} )
		
		assertEQ ( self.mm.params['sendSelfAllianceDetail.1'], {memPlayer, alliance} )
		assertEQ ( self.mm.params['sendSelfAllianceDetail.2'], {leader, alliance} )
		
		self.mm:clear()
		alliance:setTransferStartTime(0)
		app:getPlayerMgr().onlinePlayers[memPlayer:getName()] = nil
		assertEQ ( self.hdr:handle(leader, {role="role1"}), true )
		assertEQ ( self.mm.walkLog, 'addSysMail,sendSelfAllianceDetail' )
	end;
})

local TestCaseCancelTransferAllianceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(27)
		alliance = nil
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(AllianceSender, 'sendSelfAllianceDetail')
		local leader = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100001)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		
		leader:setAlliId(0)
		assertEQ ( self.hdr:handle(leader), false )
		
		leader:setAlliId(alliance:getId())
		local member = alliance:getMemberByIdx(0)
		member:setAlliPos(ALLI_POS.ALEADER)
		alliance:setTransferStartTime(1)
		alliance:setTransferTarget('role1')
		assertEQ ( self.hdr:handle(leader), false )
		
		member:setAlliPos(ALLI_POS.LEADER)
		alliance:setTransferStartTime(0)
		alliance:setTransferTarget('')
		assertEQ ( self.hdr:handle(leader), false )
		
		alliance:setTransferStartTime(1)
		alliance:setTransferTarget('role1')
		assertEQ ( self.hdr:handle(leader), true )
		assertEQ ( alliance:isTransfering(), false )
		assertEQ ( self.mm.params['sendSelfAllianceDetail'], {leader, alliance} )
	end;
})

local TestCaseContributeAllianceResHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(28)
		alliance = nil
		
		FIXID.ALLI_CARD = 2000001
		res_items = {{id=FIXID.ALLI_CARD, pile=100,nobindid=2}}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(AllianceSender, 'sendSelfAllianceDetail')
		self.mm:mock(AllianceSender, 'sendSelfMember')
		self.mm:mock(ItemMsgSender, 'sendChangeItems')
		self.mm:mock(CommResSender, 'sendAll')
		self.mm:mock(TaskFinisher, 'trigerTask')
		self.mm:mock(WUtil, 'sendPopBoxMsg')
		
		local leader = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100001)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		local mem = AllianceMember()
		local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('user1', 'role1', 100002)
		memPlayer:setAlliId(alliance:getId())
		mem:setId(memPlayer:getRoleId())
		mem:setAlliPos(ALLI_POS.ALEADER)
		alliance:addMember(mem)
		
		memPlayer:setAlliId(0)
		memPlayer:getCityRes():setFood(20000)
		memPlayer:getCityRes():setWood(30000)
		assertEQ ( self.hdr:handle(memPlayer, {resIdx=0,times=1}), false )
		
		memPlayer:setAlliId(alliance:getId())
		assertEQ ( self.hdr:handle(memPlayer, {resIdx=1,times=0}), false )
		
		assertEQ ( self.hdr:handle(memPlayer, {resIdx=5,times=1}), false )
		
		assertEQ ( self.hdr:handle(memPlayer, {resIdx=2,times=1}), false )
		
		Util:setTimeDrt(1370516597)
		assertEQ ( self.hdr:handle(memPlayer, {resIdx=0,times=2}), true )
		assertEQ ( memPlayer:getCityRes():getFood(), 0 )
		assertEQ ( alliance:getBuildVal(), 2 )
		assertEQ ( alliance:getMemberByIdx(1):getContributes(), 2 )
		assertEQ ( alliance:getMemberByIdx(1):getTodayRes(), 2 )
		assertEQ ( alliance:getMemberByIdx(1):getTotalRes(), 2 )
		assertEQ ( self.mm.params['sendSelfAllianceDetail.1'], {leader, alliance} )
		assertEQ ( self.mm.params['sendSelfMember.1'], {leader, alliance} )
		assertEQ ( self.mm.params['sendSelfAllianceDetail.2'], {memPlayer, alliance} )
		assertEQ ( self.mm.params['sendSelfMember.2'], {memPlayer, alliance} )
		assertEQ ( self.mm.params['sendPopBoxMsg'], {memPlayer, string.format(rstr.alliance.events.resContribute, 2, 2) } )
		assertEQ ( self.mm.params['trigerTask'], {memPlayer, TASK_FINISH_TYPE.GET_ALLICONTRI_BYCOMMITRES, 2} )
		
		self.mm:clear()
		Util:setTimeDrt(1370516597+24*3600)
		app:getPlayerMgr().onlinePlayers[leader:getName()] = nil
		assertEQ ( self.hdr:handle(memPlayer, {resIdx=1,times=2}), true )
		assertEQ ( memPlayer:getCityRes():getWood(), 10000 )
		assertEQ ( alliance:getBuildVal(), 2+2 )
		assertEQ ( alliance:getMemberByIdx(1):getContributes(), 2+2 )
		assertEQ ( alliance:getMemberByIdx(1):getTodayRes(), 2 )
		assertEQ ( alliance:getMemberByIdx(1):getTotalRes(), 2+2 )
		assertEQ ( self.mm.params['sendSelfAllianceDetail'], {memPlayer, alliance} )
		assertEQ ( self.mm.params['sendSelfMember'], {memPlayer, alliance} )
		assertEQ ( self.mm.params['sendAll'], {memPlayer} )
		
		self.mm:clear()
		app:getPlayerMgr().onlinePlayers[leader:getName()] = leader
		leader:getCityRes():setFood(20000)
		leader:setAlliId(alliance:getId())
		assertEQ ( self.hdr:handle(leader, {resIdx=0,times=1}), true )
		assertEQ ( self.mm.walkLog, 'sendPopBoxMsg,trigerTask,sendSelfAllianceDetail,sendSelfMember,sendAll' )
		assertEQ ( self.mm.params['sendSelfAllianceDetail'], {leader, alliance} )
		assertEQ ( self.mm.params['sendSelfMember'], {leader, alliance} )
		
		leader:getPkg():addItems({RawItemEx({resId=FIXID.ALLI_CARD, number=3})})
		assertEQ ( self.hdr:handle(leader, {resIdx=4,times=4}), false )
		
		local oldBuildVal = alliance:getBuildVal()
		local oldTodayRes = alliance:getMemberByIdx(0):getTodayRes()
		local oldTotalRes = alliance:getMemberByIdx(0):getTotalRes()
		local oldContributes = alliance:getMemberByIdx(0):getContributes()
		local oldTodayCard = alliance:getMemberByIdx(0):getTodayCard()
		local oldTotalCard = alliance:getMemberByIdx(0):getTotalCard()
		local oldCard = alliance:getCardNumber()
		assertEQ ( self.hdr:handle(leader, {resIdx=4,times=2}), true )
		assertEQ ( leader:getPkg():getItemNumber(FIXID.ALLI_CARD), 1 )
		assertEQ ( self.mm.params['sendChangeItems'], {leader, {{id=1,number=1,del=false,resid=FIXID.ALLI_CARD}}})
		assertEQ ( self.mm.params['trigerTask'], {leader, TASK_FINISH_TYPE.GET_ALLICONTRI_BYCOMMITRES, 2} )
		assertEQ ( self.mm.params['sendPopBoxMsg'], {leader, string.format(rstr.alliance.events.cardContribute, 2, 200) } )
		assertEQ ( alliance:getBuildVal(), oldBuildVal )
		assertEQ ( alliance:getMemberByIdx(0):getTodayRes(), oldTodayRes )
		assertEQ ( alliance:getMemberByIdx(0):getTotalRes(), oldTotalRes )
		assertEQ ( alliance:getMemberByIdx(0):getContributes(), oldContributes + 2*100 )
		assertEQ ( alliance:getMemberByIdx(0):getTodayCard(), oldTodayCard + 2 )
		assertEQ ( alliance:getMemberByIdx(0):getTotalCard(), oldTotalCard + 2 )
		assertEQ ( alliance:getCardNumber(), oldCard + 2)
	end;
})

local TestCaseGetTodaySortMemsHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(29)
		alliance = nil
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		Util:setTimeDrt(1370516597)
		
		local leader = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r',100000)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		leader:setAlliId(alliance:getId())
		for i=1, 20, 1 do 
			local mem = AllianceMember()
			local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 100000 + i)
			memPlayer:setAlliId(alliance:getId())
			mem:setId(memPlayer:getRoleId())
			mem:setLastRes({lastTime=Util:getTime(), val=10000 + i*10})
			alliance:addMember(mem)
		end
		
		alliance:getMemberByIdx(19):setLastRes({lastTime=Util:getTime(), val=alliance:getMemberByIdx(20):getTodayRes()-99})
		alliance:getMemberByIdx(19):setLastCard({lastTime=Util:getTime(), val=1})
		
		local mems = {}
		table.insert( mems, alliance:getMemberByIdx(19) ) -- if res eq, then compare card
		table.insert( mems, alliance:getMemberByIdx(20) ) -- 
		table.insert( mems, alliance:getMemberByIdx(18) )
		table.insert( mems, alliance:getMemberByIdx(17) )
		table.insert( mems, alliance:getMemberByIdx(16) )
		table.insert( mems, alliance:getMemberByIdx(15) )
		table.insert( mems, alliance:getMemberByIdx(14) )
		table.insert( mems, alliance:getMemberByIdx(13) )
		table.insert( mems, alliance:getMemberByIdx(12) )
		table.insert( mems, alliance:getMemberByIdx(11) )
		table.insert( mems, alliance:getMemberByIdx(10) )
		table.insert( mems, alliance:getMemberByIdx(9) )
		
		self.mm:mock(AllianceSender, 'sendTodaySortMems')
		self.hdr:handle( self.player, {pageNo=1} )
		assertEQ ( self.mm.walkLog, '' )
		
		self.hdr:handle( leader, {pageNo=1} )
		local pageCnt = 2
		local pageNo = 1
		assertEQ ( self.mm.params['sendTodaySortMems'], {leader, alliance, mems, pageCnt, pageNo} )
		
		self.mm:clear()
		self.hdr:handle( leader, {pageNo=0} )
		pageCnt = 2
		pageNo = 1
		assertEQ ( self.mm.params['sendTodaySortMems'], {leader, alliance, mems, pageCnt, pageNo} )
		
		
		alliance:getMemberByIdx(8):setLastRes({lastTime=Util:getTime(), val=0})
		alliance:getMemberByIdx(8):setLastCard({lastTime=Util:getTime(), val=0})
		
		alliance:getMemberByIdx(7):setLastCard({lastTime=Util:getTime(), val=(alliance:getMemberByIdx(7):getTodayRes()/100) })
		alliance:getMemberByIdx(7):setLastRes({lastTime=Util:getTime(), val=0})
		
		alliance:getMemberByIdx(6):setLastCard({lastTime=Util:getTime(), val=0})
		
		mems = {}
		--table.insert ( mems, alliance.getMemberByIdx(8) )
		table.insert( mems, alliance:getMemberByIdx(7) )
		table.insert( mems, alliance:getMemberByIdx(6) )
		table.insert( mems, alliance:getMemberByIdx(5) )
		table.insert( mems, alliance:getMemberByIdx(4) )
		table.insert( mems, alliance:getMemberByIdx(3) )
		table.insert( mems, alliance:getMemberByIdx(2) )
		table.insert( mems, alliance:getMemberByIdx(1) )
		--table.insert ( mems, alliance.getMemberByIdx(0) )
		
		self.mm:clear()
		self.hdr:handle( leader, {pageNo=2} )
		pageCnt = 2
		pageNo = 2
		alliance:getMemberByIdx(7)
		assertEQ ( self.mm.params['sendTodaySortMems'][3][1],  alliance:getMemberByIdx(7))
		assertEQ ( self.mm.params['sendTodaySortMems'][3][2],  alliance:getMemberByIdx(6))
		assertEQ ( self.mm.params['sendTodaySortMems'][3][3],  alliance:getMemberByIdx(5))
		assertEQ ( self.mm.params['sendTodaySortMems'][3][4],  alliance:getMemberByIdx(4))
		assertEQ ( self.mm.params['sendTodaySortMems'][3][5],  alliance:getMemberByIdx(3))
		assertEQ ( self.mm.params['sendTodaySortMems'][3][6],  alliance:getMemberByIdx(2))
		assertEQ ( self.mm.params['sendTodaySortMems'][3][7],  alliance:getMemberByIdx(1))
		assertEQ ( self.mm.params['sendTodaySortMems'], {leader, alliance, mems, pageCnt, pageNo}, 'no include zero res and zero card contribute role' )
		
		self.mm:clear()
		self.hdr:handle( leader, {pageNo=3} )
		pageCnt = 2
		pageNo = 2
		assertEQ ( self.mm.params['sendTodaySortMems'], {leader, alliance, mems, pageCnt, pageNo} )
	end;
})

local TestCaseGetAllSortMemsHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(30)
		alliance = nil
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		Util:setTimeDrt(1370516597)
		
		local leader = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r',100000)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		leader:setAlliId(alliance:getId())
		for i=1, 20, 1 do 
			local mem = AllianceMember()
			local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 100000 + i)
			memPlayer:setAlliId(alliance:getId())
			mem:setId(memPlayer:getRoleId())
			mem:setTotalRes( 10000 + i )
			alliance:addMember(mem)
		end
		
		alliance:getMemberByIdx(19):setTotalRes(alliance:getMemberByIdx(20):getTotalRes()-99)
		alliance:getMemberByIdx(19):setTotalCard(1)
		
		local mems = {}
		table.insert( mems, alliance:getMemberByIdx(19) ) -- if res eq, then compare card
		table.insert( mems, alliance:getMemberByIdx(20) ) -- 
		table.insert( mems, alliance:getMemberByIdx(18) )
		table.insert( mems, alliance:getMemberByIdx(17) )
		table.insert( mems, alliance:getMemberByIdx(16) )
		table.insert( mems, alliance:getMemberByIdx(15) )
		table.insert( mems, alliance:getMemberByIdx(14) )
		table.insert( mems, alliance:getMemberByIdx(13) )
		table.insert( mems, alliance:getMemberByIdx(12) )
		table.insert( mems, alliance:getMemberByIdx(11) )
		table.insert( mems, alliance:getMemberByIdx(10) )
		table.insert( mems, alliance:getMemberByIdx(9) )
		
		self.mm:mock(AllianceSender, 'sendAllSortMems')
		self.hdr:handle( self.player, {pageNo=1} )
		assertEQ ( self.mm.walkLog, '' )
		
		self.hdr:handle( leader, {pageNo=1} )
		local pageCnt = 2
		local pageNo = 1
		assertEQ ( self.mm.params['sendAllSortMems'], {leader, alliance, mems, pageCnt, pageNo} )
		
		self.mm:clear()
		self.hdr:handle( leader, {pageNo=0} )
		pageCnt = 2
		pageNo = 1
		assertEQ ( self.mm.params['sendAllSortMems'], {leader, alliance, mems, pageCnt, pageNo} )
		
		mems = {}
		table.insert( mems, alliance:getMemberByIdx(8) )
		table.insert( mems, alliance:getMemberByIdx(7) )
		table.insert( mems, alliance:getMemberByIdx(6) )
		table.insert( mems, alliance:getMemberByIdx(5) )
		table.insert( mems, alliance:getMemberByIdx(4) )
		table.insert( mems, alliance:getMemberByIdx(3) )
		table.insert( mems, alliance:getMemberByIdx(2) )
		table.insert( mems, alliance:getMemberByIdx(1) )
		table.insert( mems, alliance:getMemberByIdx(0) )
		
		self.mm:clear()
		self.hdr:handle( leader, {pageNo=2} )
		pageCnt = 2
		pageNo = 2
		assertEQ ( self.mm.params['sendAllSortMems'], {leader, alliance, mems, pageCnt, pageNo} )
		
		self.mm:clear()
		self.hdr:handle( leader, {pageNo=3} )
		pageCnt = 2
		pageNo = 2
		assertEQ ( self.mm.params['sendAllSortMems'], {leader, alliance, mems, pageCnt, pageNo} )
	end;
})

local TestCaseAppointAlliMemberHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(31)
		alliance = nil
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:travelMock(app:getAlliMgr(), 'addAllianceEvent')
		
		local leader = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100001)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		local mem = AllianceMember()
		local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('user1', 'role1', 100002)
		memPlayer:setAlliId(alliance:getId())
		mem:setId(memPlayer:getRoleId())
		mem:setAlliPos(ALLI_POS.ALEADER)
		alliance:addMember(mem)
		
		leader:setAlliId(0)
		assertEQ ( self.hdr:handle(leader, {role="role1",alliPos=1}), false )
		
		leader:setAlliId(alliance:getId())
		assertEQ ( self.hdr:handle(leader, {role="role1",alliPos=ALLI_POS.LEADER}), false )
		
		assertEQ ( self.hdr:handle(memPlayer, {role="leader_r",alliPos=ALLI_POS.MEM}), false )
		
		assertEQ ( self.hdr:handle(leader, {role="role1",alliPos=ALLI_POS.NONE}), false )
		
		assertEQ ( self.hdr:handle(leader, {role="xxx",alliPos=ALLI_POS.MEM}), false )
		
		assertEQ ( self.hdr:handle(leader, {role="role1",alliPos=ALLI_POS.ALEADER}), false )
		
		self.mm:mock(app:getMailMgr(), 'addSysMail', {{name='mail'}});
		self.mm:mock(MailSender, 'sendBriefMail');
		self.mm:mock(AllianceSender, 'sendSelfMember');
		self.mm:mock(WUtil, 'sendSuccMsgArgs');
		
		assertEQ ( self.hdr:handle(leader, {role="role1",alliPos=ALLI_POS.MEM}), true )
		assertEQ ( mem:getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.params['sendSuccMsgArgs'], {leader, 100131, ''}, 'send success msg' )
		assertEQ ( self.mm.params['addSysMail'], {'role1', rstr.mail.title.appointAlliPos, FIXID.COMM_SYS_MAILTEMP, string.format(rstr.mail.content.appointAlliPos, rstr.alliance.alliPoss[ALLI_POS.MEM])} )
		assertEQ ( self.mm.params['sendBriefMail'], { memPlayer, {name='mail'} } )
		assertEQ ( self.mm.params['sendSelfMember'], { memPlayer, alliance } )
		assertEQ ( self.mm.params['addAllianceEvent'], { alliance, 'changeAlliPos', {roleId=100002, alliancePos=ALLI_POS.MEM} } )
		
		self.mm:clear()
		app:getPlayerMgr().onlinePlayers[memPlayer:getName()] = nil
		assertEQ ( self.hdr:handle(leader, {role="role1",alliPos=ALLI_POS.ALEADER}), true )
		assertEQ ( self.mm.walkLog, 'addAllianceEvent,sendSuccMsgArgs,addSysMail' )
	end;
	
	helper_createAlliance = function(self)
		local leader = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100001)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		alliance:setLevel(1)
		leader:setAlliId(alliance:getId())
		return leader, alliance
	end;
	
	helper_createMemPlayer = function(self, alliance, roleName, roleId, pos)
		local mem = AllianceMember()
		local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('user'..roleName, roleName, roleId)
		memPlayer:setAlliId(alliance:getId())
		mem:setId(memPlayer:getRoleId())
		mem:setAlliPos(pos)
		alliance:addMember(mem)
		return mem, memPlayer
	end;
	
	test_handleMaxAleaderCount = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		local leader, alliance = self:helper_createAlliance()
		local mem1, memPlayer1 = self:helper_createMemPlayer(alliance, 'role1', 100002, ALLI_POS.ALEADER)
		local mem2, memPlayer2 = self:helper_createMemPlayer(alliance, 'role2', 100003, ALLI_POS.MEM)
		local mem3, memPlayer3 = self:helper_createMemPlayer(alliance, 'role3', 100004, ALLI_POS.MEM)
		assertEQ ( self.hdr:handle(leader, {role="role2",alliPos=ALLI_POS.ALEADER}), true )
		assertEQ ( self.mm.walkLog, '')
		assertEQ ( self.hdr:handle(leader, {role="role3",alliPos=ALLI_POS.ALEADER}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {leader, 100175, ''} )
	end;
	
	test_handleMaxElderCount = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		local leader, alliance = self:helper_createAlliance()
		local mem1, memPlayer1 = self:helper_createMemPlayer(alliance, 'role1', 100002, ALLI_POS.ELDER)
		local mem2, memPlayer2 = self:helper_createMemPlayer(alliance, 'role2', 100003, ALLI_POS.ELDER)
		local mem3, memPlayer3 = self:helper_createMemPlayer(alliance, 'role3', 100004, ALLI_POS.MEM)
		local mem4, memPlayer4 = self:helper_createMemPlayer(alliance, 'role4', 100005, ALLI_POS.MEM)
		assertEQ ( self.hdr:handle(leader, {role="role3",alliPos=ALLI_POS.ELDER}), true )
		assertEQ ( self.mm.walkLog, '')
		assertEQ ( self.hdr:handle(leader, {role="role4",alliPos=ALLI_POS.ELDER}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {leader, 100175, ''} )
	end;
	
	test_handleMaxMemCount = function(self)
		local leader, alliance = self:helper_createAlliance()
		local mem1, memPlayer1 = self:helper_createMemPlayer(alliance, 'role1', 100002, ALLI_POS.ELDER)
		local mem2, memPlayer2 = self:helper_createMemPlayer(alliance, 'role2', 100003, ALLI_POS.ELDER)
		local mem3, memPlayer3 = self:helper_createMemPlayer(alliance, 'role3', 100004, ALLI_POS.MEM)
		local mem4, memPlayer4 = self:helper_createMemPlayer(alliance, 'role4', 100005, ALLI_POS.MEM)
		local mem4, memPlayer4 = self:helper_createMemPlayer(alliance, 'role5', 100006, ALLI_POS.MEM)
		local mem4, memPlayer4 = self:helper_createMemPlayer(alliance, 'role6', 100007, ALLI_POS.MEM)
		assertEQ ( self.hdr:handle(leader, {role="role2",alliPos=ALLI_POS.MEM}), true )
	end;
})

local TestCaseFireAlliMemberHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(32)
		alliance = nil
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local timesec = 1368715763
		Util:setTimeDrt(timesec)
		
		self.mm:travelMock(WUtil, 'sendWarningMsgArgs')
		
		local leader = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100001)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		local mem = AllianceMember()
		local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('user1', 'role1', 100002)
		memPlayer:setAlliId(alliance:getId())
		mem:setId(memPlayer:getRoleId())
		mem:setAlliPos(ALLI_POS.ALEADER)
		alliance:addMember(mem)
		
		leader:setAlliId(0)
		assertEQ ( self.hdr:handle(leader, {role="role1"}), false )
		
		leader:setAlliId(alliance:getId())
		assertEQ ( self.hdr:handle(leader, {role="leader_r"}), false )
		
		assertEQ ( self.hdr:handle(leader, {role="xxx"}), false )
		
		assertEQ ( self.hdr:handle(memPlayer, {role="leader_r"}), false )
		
		alliance:getMemberById(leader:getRoleId()):setLastFire({lastTime=timesec, count=3})
		assertEQ ( self.hdr:handle(leader, {role="role1"}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {leader, 100139, ''} )
		
		self.mm:mock(app:getMailMgr(), 'addSysMail', {{name='mail'}});
		self.mm:mock(MailSender, 'sendBriefMail');
		self.mm:mock(RoleBaseSender, 'send');
		self.mm:mock(AllianceSender, 'sendSelfAllianceDetail');
		self.mm:mock(WUtil, 'sendSuccMsgArgs');
		
		alliance:getMemberById(leader:getRoleId()):setLastFire({lastTime=timesec, count=2})
		assertEQ ( self.hdr:handle(leader, {role="role1"}), true )
		assertEQ ( alliance:getMemberById(memPlayer:getRoleId()), nil )
		assertEQ ( memPlayer:getAlliId(), 0 )
		local state = memPlayer:getStateContainer():getEffectState(RES_EFF.EXIT_ALLIANCE)
		assertEQ ( state:getDuration(), 24*3600 )
		assertEQ ( self.mm.params['addSysMail'], {'role1', rstr.mail.title.fireAlliMem, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.fireAlliMem } )
		assertEQ ( self.mm.params['sendBriefMail'], {memPlayer, {name='mail'}} )
		assertEQ ( self.mm.params['send'], {memPlayer, {'alliance'}} )
		assertEQ ( self.mm.params['sendSuccMsgArgs'], {leader, 100132, ''} )
		assertEQ ( self.mm.params['sendSelfAllianceDetail'], {leader, alliance} )
		assertEQ ( alliance:getMemberById(leader:getRoleId()):isTodayFireFull(), true )
	end;
})

local TestCaseAgreeApplyJoinAllianceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(33)
		
		self.leader = TestCaseHelper:loadPlayerByUserNameEx('leader1', 'leader1_r', 200001)
		self.alliance = app:getAlliMgr():createAlliance(self.leader, 'alliance', 'f')
		self.mem = AllianceMember()
		
		self.memPlayer = TestCaseHelper:loadPlayerByUserNameEx('user21', 'role21', 200002)
		self.memPlayer:setAlliId(self.alliance:getId())
		self.mem:setId(self.memPlayer:getRoleId())
		self.alliance:addMember(self.mem)
		
		self.applyPlayer = TestCaseHelper:loadPlayerByUserNameEx('user22', 'role22', 200003)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	helper_enableAllConditions = function(self, alliance)
		self.mm:clear()
		self.applyPlayer:setCityId(9900001)
		self.alliance:setCityResId(self.applyPlayer:getCityId())
		self.alliance:setDismissStartTime(0)
		for i=self.alliance:getMemberCount()-1, 2, -1 do
			self.alliance:removeMember(i)
		end
		
		self.mem:setAlliPos(ALLI_POS.ELDER)
		self.memPlayer:setAlliId(self.alliance:getId())
		
		self.alliance:getApplyRoleIdsSet():insert(self.applyPlayer:getRoleId())
		self.applyPlayer:setAlliId(0)
		self.applyPlayer:getStateContainer():stopState(RES_EFF.EXIT_ALLIANCE)
		TestCaseCondition:setPreCond(self.applyPlayer, nil, { builds={ {id=6,resid=FIXID.ALLIINBUILD,level=1,state=0} } })
	end;
	
	test_handle = function(self)
		self.mm:travelMock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(app:getAlliMgr(), 'saveAlliance')
		self.mm:mock(RoleBaseSender, 'send')
		self.mm:mock(AllianceSender, 'sendSelfAllianceDetail')
		self.mm:mock(AllianceSender, 'sendDeleteApply')		
		
		self:helper_enableAllConditions()
		self.memPlayer:setAlliId(0)
		assertEQ ( self.hdr:handle(self.leader, {roleId=self.applyPlayer:getRoleId()}), false )
		
		self:helper_enableAllConditions()
		self.mem:setAlliPos(ALLI_POS.MEM)
		assertEQ ( self.hdr:handle(self.memPlayer, {roleId=self.applyPlayer:getRoleId()}), false )
		
		self:helper_enableAllConditions()
		self.alliance:getApplyRoleIdsSet():remove(self.applyPlayer:getRoleId())
		assertEQ ( self.hdr:handle(self.memPlayer, {roleId=self.applyPlayer:getRoleId()}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.memPlayer, 100133, ''}, 'the roleId is not in applylist' )
		
		self:helper_enableAllConditions()
		self.applyPlayer:setCityId(9900002)
		assertEQ ( self.hdr:handle(self.memPlayer, {roleId=self.applyPlayer:getRoleId()}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.memPlayer, 100134, ''}, 'the player not in same city' )
		
		self:helper_enableAllConditions()
		self.alliance:getApplyRoleIdsSet():insert(1)
		assertEQ ( self.hdr:handle(self.memPlayer, {roleId=1}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.memPlayer, 100050, ''}, 'the player not exist' )
		
		self:helper_enableAllConditions()
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=1, effect={id=RES_EFF.EXIT_ALLIANCE,val=3,unit=0}}
		local creator = {type=0,id=0,skillId=0}
		self.applyPlayer:getStateContainer():appendState(stateRes, creator)
		assertEQ ( self.hdr:handle(self.memPlayer, {roleId=self.applyPlayer:getRoleId()}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.memPlayer, 100135, ''}, 'the player is in exit alliance state' )
		
		self:helper_enableAllConditions()
		TestCaseCondition:setPreCond(self.applyPlayer, nil, { builds={ {id=6,resid=FIXID.ALLIINBUILD,level=0,state=0} } })
		assertEQ ( self.hdr:handle(self.memPlayer, {roleId=self.applyPlayer:getRoleId()}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.memPlayer, 100136, ''}, 'has no alliance build' )
		
		self:helper_enableAllConditions()
		for i=2, res_alli_upd_needs[1].memmaxcount-1, 1 do 
			self.alliance:addMember(AllianceMember())
		end
		assertEQ ( self.hdr:handle(self.memPlayer, {roleId=self.applyPlayer:getRoleId()}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.memPlayer, 100113, ''}, 'alliance mem is full' )
		assertEQ ( self.alliance:getApplyRoleIdsSet():has(self.applyPlayer:getRoleId()), false )
		
		self:helper_enableAllConditions()
		self.alliance:setDismissStartTime(1)
		assertEQ ( self.hdr:handle(self.memPlayer, {roleId=self.applyPlayer:getRoleId()}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.memPlayer, 100114, ''}, 'alliance in dismissing state' )
	
		self:helper_enableAllConditions()
		assertEQ ( self.hdr:handle(self.memPlayer, {roleId=self.applyPlayer:getRoleId()}), true )
		assertEQ ( self.applyPlayer:getAlliId(), self.alliance:getId() )
		assertEQ ( self.alliance:getMemberById(self.applyPlayer:getRoleId()):getAlliPos(), ALLI_POS.MEM  )
		assertEQ ( self.mm.params['saveAlliance'], {self.alliance}  )
		assertEQ ( self.mm.params['send'], {self.applyPlayer, {'alliance'}}  )
		assertEQ ( self.mm.params['sendSelfAllianceDetail'], {self.memPlayer, self.alliance}  )
		assertEQ ( self.alliance:getApplyRoleIdsSet():has(self.applyPlayer:getRoleId()), false )
		assertEQ ( self.mm.params['sendDeleteApply'], {self.memPlayer, self.applyPlayer:getRoleId()}  )
	end;
})

local TestCaseIgnoreApplyJoinAllianceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(34)
		alliance = nil
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local leader = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100001)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		
		local applyPlayer = TestCaseHelper:loadPlayerByUserNameEx('user2', 'role2', 100003)
		alliance:getApplyRoleIdsSet():insert(applyPlayer:getRoleId())
		
		leader:setAlliId(0)
		assertEQ ( self.hdr:handle(leader, {roleId=applyPlayer:getRoleId()}), false )
		
		leader:setAlliId(alliance:getId())
		alliance:getMemberByIdx(0):setAlliPos(ALLI_POS.MEM)
		assertEQ ( self.hdr:handle(leader, {roleId=applyPlayer:getRoleId()}), false )
		
		self.mm:mock(AllianceSender, 'sendDeleteApply')
		
		leader:setAlliId(alliance:getId())
		alliance:getMemberByIdx(0):setAlliPos(ALLI_POS.LEADER)
		assertEQ ( self.hdr:handle(leader, {roleId=applyPlayer:getRoleId()}), true )
		assertEQ ( alliance:getApplyRoleIdsSet():has(applyPlayer:getRoleId()), false )
		assertEQ ( self.mm.params['sendDeleteApply'], {leader, applyPlayer:getRoleId()}  )
	end;
})

local TestCaseGetAllianceEventsHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(35)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(AllianceSender, 'sendAlliEvents')
		
		local leader = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r',100000)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		leader:setAlliId(alliance:getId())
		for i=1, 20, 1 do 
			alliance:addEvent({event='event'..i, createTime=10000})
		end
		
		leader:setAlliId(0)
		assertEQ ( self.hdr:handle( leader, {pageNo=1} ), false )
		
		local events = {}
		table.insert( events, alliance:getEventByIdx(0) )
		table.insert( events, alliance:getEventByIdx(1) )
		table.insert( events, alliance:getEventByIdx(2) )
		table.insert( events, alliance:getEventByIdx(3) )
		table.insert( events, alliance:getEventByIdx(4) )
		table.insert( events, alliance:getEventByIdx(5) )
		table.insert( events, alliance:getEventByIdx(6) )
		table.insert( events, alliance:getEventByIdx(7) )
		table.insert( events, alliance:getEventByIdx(8) )
		table.insert( events, alliance:getEventByIdx(9) )
		table.insert( events, alliance:getEventByIdx(10) )
		table.insert( events, alliance:getEventByIdx(11) )
		
		local pageNo = 1
		local pageCnt = 2
		leader:setAlliId(alliance:getId())
		assertEQ ( self.hdr:handle( leader, {pageNo=1} ), true )
		assertEQ ( self.mm.params['sendAlliEvents'], {leader, events, pageCnt, pageNo} )
	end;
})

local TestCaseGetApplyAllianceMergesHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(36)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local leader = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100001)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		
		leader:setAlliId(0)
		assertEQ ( self.hdr:handle(leader), false )
		
		leader:setAlliId(alliance:getId())
		alliance:getMemberById(leader:getRoleId()):setAlliPos(ALLI_POS.MEM)
		assertEQ ( self.hdr:handle(leader), false )
		
		self.mm:mock(AllianceSender, 'sendApplyMerges')
		alliance:getMemberById(leader:getRoleId()):setAlliPos(ALLI_POS.LEADER)
		assertEQ ( self.hdr:handle(leader), true )
		assertEQ ( self.mm.params['sendApplyMerges'], {leader, alliance} )
	end;
})

local TestCaseApplyMergeAllianceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(37)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:travelMock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(app:getMailMgr(), 'addSysMail', {{name='mail'}})
		self.mm:mock(MailSender, 'sendBriefMail')
		self.mm:mock(AllianceSender, 'sendApplyMerges')
		
		local leader = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100001)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		alliance:setCityResId(9900001)
		
		local otherLeader1 = TestCaseHelper:loadPlayerByUserNameEx('source1', 'source1_r',100002)
		local otherAlliance1 = app:getAlliMgr():createAlliance(otherLeader1, 'alliance1', 'f1')
		otherAlliance1:setLevel(2)
		otherAlliance1:setCityResId(9900001)
		
		leader:setAlliId(0)
		assertEQ ( self.hdr:handle(leader, {name='alliance1'}), false )
		
		leader:setAlliId(alliance:getId())
		alliance:getMemberById(leader:getRoleId()):setAlliPos(ALLI_POS.MEM)
		assertEQ ( self.hdr:handle(leader, {name='alliance1'}), false )
		
		self.mm:clear()
		alliance:getMemberById(leader:getRoleId()):setAlliPos(ALLI_POS.LEADER)
		assertEQ ( self.hdr:handle(leader, {name='alliancexxx'}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {leader, 100111, ''} , 'alliance is no exist')
		
		self.mm:clear()
		assertEQ ( self.hdr:handle(leader, {name='alliance'}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {leader, 100140, ''}, 'same alliance' )
		
		self.mm:clear()
		otherAlliance1:setCityResId(9900002)
		assertEQ ( self.hdr:handle(leader, {name='alliance1'}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {leader, 100141, ''}, 'not in same city' )
		
		self.mm:clear()
		otherAlliance1:setCityResId(9900001)
		for i=1, res_alli_applymerges_maxcount, 1 do
			otherAlliance1:getApplyMergesSet():insert(i)
		end
		assertEQ ( self.hdr:handle(leader, {name='alliance1'}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {leader, 100142, ''}, 'other alliance apply merge list full' )
		
		self.mm:clear()
		otherAlliance1:getApplyMergesSet():remove(1)
		otherAlliance1:getApplyMergesSet():remove(2)
		otherAlliance1:getApplyMergesSet():remove(3)
		for i=1, 4, 1 do 
			local mem = AllianceMember()
			mem:setId(i*10)
			mem:setAlliPos(ALLI_POS.ALEADER)
			alliance:addMember(mem)
		end
		
		for i=1, res_alli_upd_needs[2].memmaxcount-5, 1 do 
			local mem = AllianceMember()
			mem:setId(i*100)
			otherAlliance1:addMember(mem)
		end
		assertEQ ( self.hdr:handle(leader, {name='alliance1'}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {leader, 100143, ''}, 'member count exceed max count' )
		
		self.mm:clear()
		alliance:removeMemberById(40)
		assertEQ ( self.hdr:handle(leader, {name='alliance1'}), true )
		assertEQ ( self.mm.walkLog, 'addSysMail,sendBriefMail,sendApplyMerges' )
		assertEQ ( otherAlliance1:getApplyMergesSet():has(alliance:getId()), true )
		local mailContent = string.format(rstr.mail.content.applyMergeAlliance, 'alliance', 'leader_r' )
		assertEQ ( self.mm.params['addSysMail'], {otherLeader1:getRoleName(), rstr.mail.title.applyMergeAlliance, FIXID.COMM_SYS_MAILTEMP, mailContent} )
		assertEQ ( self.mm.params['sendBriefMail'], {otherLeader1, {name='mail'}} )
		assertEQ ( self.mm.params['sendApplyMerges'], {otherLeader1, otherAlliance1} )
		
		self.mm:clear()
		assertEQ ( self.hdr:handle(leader, {name='alliance1'}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {leader, 100144, ''}, 'already in merge apply list' )
		
		self.mm:clear()
		app:getPlayerMgr().onlinePlayers[otherLeader1:getName()] = nil
		otherAlliance1:getApplyMergesSet():remove(alliance:getId())
		assertEQ ( self.hdr:handle(leader, {name='alliance1'}), true )
		assertEQ ( self.mm.walkLog, 'addSysMail' )
	end;
})

local TestCaseAgreeMergeAllianceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(38)
		self:help_creator()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	help_creator = function(self)
		self.leader = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100001)
		self.alliance = app:getAlliMgr():createAlliance(self.leader, 'alliance', 'f')
		
		self.applyLeader = TestCaseHelper:loadPlayerByUserNameEx('apply1', 'apply1_r',100002)
		self.applyAlliance = app:getAlliMgr():createAlliance(self.applyLeader, 'applyalliance', 'f1')
		self.applyAlliance:setLevel(2)
	end;
	
	helper_enableAllConditions = function(self)
		self.mm:clear()
		self.leader:setAlliId(self.alliance:getId())
		self.alliance:setCityResId(9900001)
		self.alliance:getMemberById(self.leader:getRoleId()):setAlliPos(ALLI_POS.LEADER)
		self.alliance:getApplyMergesSet():insert(self.applyAlliance:getId())
		self.alliance:setBuildVal(4)
		for i=self.alliance:getMemberCount()-1, 1, -1 do
			self.alliance:removeMember(i)
		end
		
		self.applyLeader:setAlliId(self.applyAlliance:getId())
		self.applyAlliance:setCityResId(9900001)
		self.applyAlliance:setLevel(2)
		self.applyAlliance:setBuildVal(6)
		for i=self.applyAlliance:getMemberCount()-1, 1, -1 do
			self.applyAlliance:removeMember(i)
		end
	end;
	
	test_handle = function(self)
		self.mm:travelMock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(app:getMailMgr(), 'addSysMail', {{name='mail'}})
		self.mm:mock(MailSender, 'sendBriefMail')
		self.mm:mock(AllianceSender, 'sendApplyMerges')
		self.mm:mock(AllianceSender, 'sendSelfAllianceDetail')
		self.mm:mock(AllianceSender, 'sendSelfMember')
		self.mm:mock(AllianceSender, 'sendSelfLawLight')
		self.mm:mock(RoleBaseSender, 'send')
		self.mm:travelMock(app:getAlliMgr(), 'addAllianceEvent')
		
		self:helper_enableAllConditions()
		self.leader:setAlliId(0)
		assertEQ ( self.hdr:handle(self.leader, {name='applyalliance'}), false, 'invalid alliance' )
		
		self:helper_enableAllConditions()
		self.alliance:getMemberById(self.leader:getRoleId()):setAlliPos(ALLI_POS.MEM)
		assertEQ ( self.hdr:handle(self.leader, {name='applyalliance'}), false, 'invalid alliance pos' )
		
		self:helper_enableAllConditions()
		assertEQ ( self.hdr:handle(self.leader, {name='applyalliancexxx'}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.leader, 100111, ''} , 'alliance is no exist')
		
		self:helper_enableAllConditions()
		self.alliance:getApplyMergesSet():remove(self.applyAlliance:getId())
		assertEQ ( self.hdr:handle(self.leader, {name='applyalliance'}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.leader, 100145, ''} , 'not in apply list')
		
		self:helper_enableAllConditions()
		self.alliance:setCityResId(9900002)
		assertEQ ( self.hdr:handle(self.leader, {name='applyalliance'}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.leader, 100141, ''}, 'not in same city' )
		
		self:helper_enableAllConditions()
		for i=1, 4, 1 do 
			local mem = AllianceMember()
			mem:setId(i*10)
			mem:setAlliPos(ALLI_POS.ALEADER)
			self.alliance:addMember(mem)
		end
		
		for i=1, res_alli_upd_needs[2].memmaxcount-5, 1 do 
			local mem = AllianceMember()
			mem:setId(i*100)
			self.applyAlliance:addMember(mem)
		end
		assertEQ ( self.hdr:handle(self.leader, {name='applyalliance'}), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.leader, 100143, ''}, 'member count exceed max count' )
		
		self:helper_enableAllConditions()
		local oldHonour = self.applyAlliance:getHonour()
		assertEQ ( self.hdr:handle(self.leader, {name='applyalliance'}), true )
		assertEQ ( self.applyAlliance:getHonour(), oldHonour + 100 + 200 )
		assertEQ ( self.applyAlliance:getMemberCount(), 2 )
		assertEQ ( self.applyAlliance:getMemberById(self.leader:getRoleId()):getAlliPos(), ALLI_POS.MEM)
		assertEQ ( self.applyAlliance:getBuildVal(), 10 )
		
		assertEQ ( app:getAlliMgr():getAlliById(self.alliance:getId()):isNull(), true )
		
		assertEQ ( self.leader:getAlliId(), self.applyAlliance:getId() )
		assertEQ ( self.alliance:getApplyMergesSet():getCount(), 0 )
		assertEQ ( self.alliance:getApplyMergesSet():getCount(), 0 )
		
		assertEQ ( self.mm.params['addAllianceEvent'], {self.applyAlliance, 'mergeAlliance', {minAlliance=self.alliance:getName(), maxAlliance=self.applyAlliance:getName(), addHonour=200} } )
		assertEQ ( self.mm.params['sendSelfAllianceDetail'], {self.leader, self.applyAlliance} )
		assertEQ ( self.mm.params['sendSelfMember'], {self.leader, self.applyAlliance} )
		assertEQ ( self.mm.params['sendSelfLawLight'], {self.leader, self.applyAlliance} )
		assertEQ ( self.mm.params['sendApplyMerges'], {self.leader, self.applyAlliance} )
		assertEQ ( self.mm.params['send'], {self.leader, {'alliance'}} )
		
		local mailContent = string.format(rstr.mail.content.mergeAlliance, 'applyalliance')
		assertEQ ( self.mm.params['addSysMail'], {self.leader:getRoleName(), rstr.mail.title.mergeAlliance, FIXID.COMM_SYS_MAILTEMP, mailContent} )
		assertEQ ( self.mm.params['sendBriefMail'], {self.leader, {name='mail'}} )
	end;
})

local TestCaseIgnoreMergeAllianceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(39)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local leader = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100001)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		
		local applyLeader = TestCaseHelper:loadPlayerByUserNameEx('apply1', 'apply1_r',100002)
		local applyAlliance = app:getAlliMgr():createAlliance(applyLeader, 'applyalliance', 'f1')
		
		leader:setAlliId(0)
		assertEQ ( self.hdr:handle(leader, {name='applyalliance'}), false, 'invalid alliance' )
		
		leader:setAlliId(alliance:getId())
		alliance:getMemberById(leader:getRoleId()):setAlliPos(ALLI_POS.MEM)
		assertEQ ( self.hdr:handle(leader, {name='applyalliance'}), false,  'invalid alliance pos' )
		
		alliance:getMemberById(leader:getRoleId()):setAlliPos(ALLI_POS.LEADER)
		assertEQ ( self.hdr:handle(leader, {name='applyalliancexxx'}), false,  'invalid apply alliance' )
		
		assertEQ ( self.hdr:handle(leader, {name='applyalliance'}), false,  'not in apply list' )
		
		self.mm:mock(AllianceSender, 'sendApplyMerges')
		
		alliance:getApplyMergesSet():insert(applyAlliance:getId())
		assertEQ ( self.hdr:handle(leader, {name='applyalliance'}), true )
		assertEQ ( alliance:getApplyMergesSet():has(applyAlliance:getId()), false )
		assertEQ ( self.mm.params['sendApplyMerges'], {leader, alliance} )
	end;
})

local TestCaseGetAllianceAuctionInfoHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(40)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alli1', 'f')
		self.player:setAlliId(alliance:getId())	
		
		self.mm:mock(AllianceSender, 'sendSelfContributes')
		self.mm:mock(AllianceSender, 'sendAuctionItems')
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( self.mm.params['sendSelfContributes'], {self.player, alliance} )
		assertEQ ( self.mm.params['sendAuctionItems'], {self.player, alliance} )
	end;
})

local TestCaseAllianceAuctionBuyItemHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(41)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	helper_createAlliance = function(self)
		local leader = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100001)
		local alliance = app:getAlliMgr():createAlliance(leader, 'alliance', 'f')
		alliance:setLevel(1)
		leader:setAlliId(alliance:getId())
		return leader, alliance
	end;
	
	helper_createMemPlayer = function(self, alliance, roleName, roleId, pos)
		local mem = AllianceMember()
		local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('user'..roleName, roleName, roleId)
		memPlayer:setAlliId(alliance:getId())
		mem:setId(memPlayer:getRoleId())
		mem:setAlliPos(pos)
		alliance:addMember(mem)
		return mem, memPlayer
	end;	
	
	test_handle = function(self)
		local leader, alliance = self:helper_createAlliance()
		local mem1, memPlayer1 = self:helper_createMemPlayer(alliance, 'role1', 100002, ALLI_POS.ALEADER)
		local mem2, memPlayer2 = self:helper_createMemPlayer(alliance, 'role2', 100003, ALLI_POS.MEM)
		local mem3, memPlayer3 = self:helper_createMemPlayer(alliance, 'role3', 100004, ALLI_POS.MEM)
		
		alliance:getItemPkg():addItem({id=1, resid=2500001, num=10, boss=1, sptime=1000000, cur=100, buyer=''})
		alliance:getItemPkg():addItem({id=2, resid=2500002, num=11, boss=1, sptime=1000001, cur=101, buyer='role1'})
		alliance:getItemPkg():addItem({id=3, resid=2500003, num=12, sptime=1000002, cur=102, fixed=200, seller='role3', buyer='role1'})
		alliance:getItemPkg():addItem({id=4, resid=2500004, num=13, sptime=1000003, cur=103, fixed=300, seller='role3', buyer='role2'})
		alliance:getItemPkg():addItem({id=5, resid=2500005, num=14, sptime=1000004, cur=104, fixed=400, seller='role1', buyer=''})
		alliance:getItemPkg():addItem({id=6, resid=2500006, num=15, sptime=1000005, cur=100, fixed=109, seller='role3', buyer=''})

		mem1:setContributes(1000)
		mem2:setContributes(0)
		mem3:setContributes(0)
		
		self.mm:travelMock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(AllianceSender, 'sendAuctionItem')
		
		local cmd = {id=0}
		assertEQ ( self.hdr:handle(memPlayer1, cmd), false, 'not find this item' )
		
		self.mm:clear()
		cmd = {id=1, price=109}
		assertEQ ( self.hdr:handle(memPlayer1, cmd), false, 'price must cur + 10' )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {memPlayer1, 100194, ''} )
		assertEQ ( self.mm.params['sendAuctionItem'], {memPlayer1, alliance, 1} )
		
		cmd = {id=3, price=102+10}
		assertEQ ( self.hdr:handle(memPlayer1, cmd), false, 'current is my self' )
		
		cmd = {id=4, price=300+1}
		assertEQ ( self.hdr:handle(memPlayer1, cmd), false, 'too max then fixed' )
		
		
		self.mm:clear()
		mem1:setContributes(300)
		cmd = {id=5, price=300}
		assertEQ ( self.hdr:handle(memPlayer1, cmd), false, 'the seller is self' )
		
		self.mm:clear()
		mem1:setContributes(109)
		cmd = {id=1, price=100 + 10}
		assertEQ ( self.hdr:handle(memPlayer1, cmd), false, 'has no enough contribute' )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {memPlayer1, 100194, ''} )
		assertEQ ( self.mm.params['sendAuctionItem'], {memPlayer1, alliance, 1} )
		
		self.mm:mock(AllianceSender, 'sendSelfMember')
		self.mm:mock(AllianceSender, 'sendDelAuctionItem')
		
		mem1:setContributes(110)
		cmd = {id=1, price=100 + 10}
		assertEQ ( self.hdr:handle(memPlayer1, cmd), true, 'succ buy sys item' )
		assertEQ ( alliance:getItemPkg():getItemById(1).buyer, 'role1' )
		assertEQ ( alliance:getItemPkg():getItemById(1).cur, cmd.price )
		assertEQ ( mem1:getContributes(), 0 )
		assertEQ ( self.mm.params['sendSelfMember'], {memPlayer1, alliance} )
		assertEQ ( self.mm.params['sendAuctionItem'], {memPlayer1, alliance, 1} )
		
		self.mm:clear()
		mem1:setContributes(300)
		cmd = {id=4, price=300}
		assertEQ ( self.hdr:handle(memPlayer1, cmd), true, 'succ fixed buy item' )
		assertEQ ( memPlayer1:getPkg():getItemNumber(2500004), 13 )
		assertEQ ( alliance:getItemPkg():getItemById(4), nil )
		assertEQ ( mem1:getContributes(), 0 )
		assertEQ ( mem2:getContributes(), 103 )
		assertEQ ( mem3:getContributes(), 300 )
		assertEQ ( self.mm.params['sendSelfMember'], {memPlayer1, alliance} )
		assertEQ ( self.mm.params['sendDelAuctionItem'], {memPlayer1, alliance, 4} )
		
		self.mm:clear()
		mem1:setContributes(300)
		cmd = {id=6, price=109}
		assertEQ ( self.hdr:handle(memPlayer1, cmd), true, 'succ fixed buy item' )
	end;
})

local TestCaseSellItemToAllianceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(42)
		self.player:setRoleName('role1')
		self.alliance = app:getAlliMgr():createAlliance(self.player, 'alli1', 'f')
		self.player:setAlliId(self.alliance:getId())
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle_invalidItemId = function(self)
		local cmd = {id=0, number=1, auctionPrice=1, fixedPrice=10}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handle_invalidItemNumber = function(self)
		self.player:getPkg():addItems({RawItemEx({resId=3000070, number=10}) })
		local item = self.player:getPkg():getItemById(1)
		local cmd = {id=item:getId(), number=0, auctionPrice=1, fixedPrice=10}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {id=item:getId(), number=11, auctionPrice=1, fixedPrice=10}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handle_isBindItem = function(self)
		self.player:getPkg():addItems({RawItemEx({resId=3000080, number=10}) })
		local item = self.player:getPkg():getItemById(1)
		local cmd = {id=item:getId(), number=1, auctionPrice=1, fixedPrice=10}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handle_beyond_fiveItems = function(self)
		self.alliance:getItemPkg():addItem({id=1, resid=2500001, num=10, sptime=1000000, cur=100, fixed=200, seller='role1', buyer=''})
		self.alliance:getItemPkg():addItem({id=2, resid=2500002, num=11, sptime=1000001, cur=101, fixed=200, seller='role1', buyer='role1'})
		self.alliance:getItemPkg():addItem({id=3, resid=2500003, num=12, sptime=1000002, cur=102, fixed=200, seller='role1', buyer='role1'})
		self.alliance:getItemPkg():addItem({id=4, resid=2500004, num=13, sptime=1000003, cur=103, fixed=300, seller='role1', buyer='role2'})
		self.alliance:getItemPkg():addItem({id=5, resid=2500005, num=14, sptime=1000004, cur=104, fixed=400, seller='role1', buyer=''})
		
		self.player:getPkg():addItems({RawItemEx({resId=3000070, number=10}) })
		local item = self.player:getPkg():getItemById(1)
		local cmd = {id=item:getId(), number=1, auctionPrice=1, fixedPrice=10}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handle_auctionPriceInValid = function(self)
		self.player:getPkg():addItems({RawItemEx({resId=3000070, number=10}) })
		local item = self.player:getPkg():getItemById(1)
		local cmd = {id=item:getId(), number=1, auctionPrice=0, fixedPrice=10}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {id=item:getId(), number=1, auctionPrice=10, fixedPrice=10}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handle_ok = function(self)
		Util:setTimeDrt(1000000)
		self.mm:mock(ItemMsgSender, 'sendNumber')
		self.mm:mock(AllianceSender, 'sendAuctionItem')
		self.mm:mock(AllianceSender, 'sendMySellingItem')
		self.mm:mock(ItemMsgSender, 'sendDelItem')
		
		self.player:getPkg():addItems({RawItemEx({resId=3000070, number=10}) })
		local item = self.player:getPkg():getItemById(1)
		local itemId = item:getId()
		local cmd = {id=itemId, number=2, auctionPrice=10, fixedPrice=100}
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( item:getNumber(), 10 - 2)
		assertEQ ( self.mm.params['sendNumber'], {self.player, item} )
		local sellItem = self.alliance:getItemPkg():getItemByIdx(0)
		assertEQ ( self.mm.params['sendAuctionItem'], {self.player, self.alliance, sellItem.id} )
		assertEQ ( self.mm.params['sendMySellingItem'], {self.player, self.alliance, sellItem.id} )
		assertEQ ( sellItem, {id=sellItem.id, resid=3000070, num=2, sptime=1000000+72*3600, cur=10, fixed=100, seller='role1', buyer=''})
		
		self.mm:clear()
		cmd = {id=itemId, number=8, auctionPrice=10, fixedPrice=100}
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getPkg():getItemById(1), nil )
		local sellItem = self.alliance:getItemPkg():getItemByIdx(1)
		assertEQ ( sellItem, {id=sellItem.id, resid=3000070, num=8, sptime=1000000+72*3600, cur=10, fixed=100, seller='role1', buyer=''})
		assertEQ ( self.mm.params['sendDelItem'], {self.player, itemId} )
	end;
})

local TestCaseCancelAllianceSellItemHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(43)
		self.player:setRoleName('role1')
		self.alliance = app:getAlliMgr():createAlliance(self.player, 'alli1', 'f')
		self.player:setAlliId(self.alliance:getId())
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle_invalidItemId = function(self)
		local cmd = {id=1}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handle_isNotMySeller = function(self)
		self.alliance:getItemPkg():addItem({id=1, resid=2500001, num=10, sptime=1000000, cur=100, fixed=200, seller='role1', buyer=''})
		self.alliance:getItemPkg():addItem({id=2, resid=2500002, num=10, sptime=1000000, cur=100, fixed=200, seller='role2', buyer=''})
		cmd = {id=2}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handle_hasBuyer = function(self)
		self.mm:mock(AllianceSender, 'sendMySellingItem')
		self.mm:mock(AllianceSender, 'sendAuctionItem')
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.alliance:getItemPkg():addItem({id=1, resid=2500001, num=10, sptime=1000000, cur=100, fixed=200, seller='role1', buyer='role2'})
		cmd = {id=1}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100195, ''} )
		assertEQ ( self.mm.params['sendMySellingItem'], {self.player, self.alliance, 1} )
		assertEQ ( self.mm.params['sendAuctionItem'], {self.player, self.alliance, 1} )
	end;
	
	test_handle_succ = function(self)
		self.mm:mock(AllianceSender, 'sendDelMySellingItem')
		self.mm:mock(AllianceSender, 'sendDelAuctionItem')
		
		self.alliance:getItemPkg():addItem({id=1, resid=3000070, num=10, sptime=1000000, cur=100, fixed=200, seller='role1', buyer=''})
		cmd = {id=1}
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.alliance:getItemPkg():getItemCount(), 0 )
		assertEQ ( self.player:getPkg():getItemNumber(3000070), 10 )
		assertEQ ( self.mm.params['sendDelMySellingItem'], {self.player, self.alliance, 1} )
		assertEQ ( self.mm.params['sendDelAuctionItem'], {self.player, self.alliance, 1} )
	end;
})

local TestCaseGetAllianceSellItemsHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AllianceHandler():getHandler(44)
		self.player:setRoleName('role1')
		self.alliance = app:getAlliMgr():createAlliance(self.player, 'alli1', 'f')
		self.player:setAlliId(self.alliance:getId())
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(AllianceSender, 'sendMySellingItems')
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( self.mm.params['sendMySellingItems'], {self.player, self.alliance} )
	end;
})

tqAllianceHandler_t_main = function(suite)
	suite:addTestCase(TestCaseAllianceHandler, 'TestCaseAllianceHandler')
	suite:addTestCase(TestCaseCreateAllianceChecker, 'TestCaseCreateAllianceChecker')
	suite:addTestCase(TestCaseApplyJoinAllianceChecker, 'TestCaseApplyJoinAllianceChecker')
	suite:addTestCase(TestCaseCreateAllianceHdr, 'TestCaseCreateAllianceHdr')
	suite:addTestCase(TestCaseApplyJoinAllianceHdr, 'TestCaseApplyJoinAllianceHdr')
	suite:addTestCase(TestCaseGetCurApplyingAllianceHdr, 'TestCaseGetCurApplyingAllianceHdr')
	suite:addTestCase(TestCaseGetAllianceDetailHdr, 'TestCaseGetAllianceDetailHdr')
	suite:addTestCase(TestCaseGetInviteListAllianceHdr, 'TestCaseGetInviteListAllianceHdr')
	suite:addTestCase(TestCaseAddAllianceHdr, 'TestCaseAddAllianceHdr')
	suite:addTestCase(TestCaseAgreeInviteAllianceHdr, 'TestCaseAgreeInviteAllianceHdr')
	suite:addTestCase(TestCaseIgnoreInviteAllianceHdr, 'TestCaseIgnoreInviteAllianceHdr')
	suite:addTestCase(TestCaseGetAllianceListHdr, 'TestCaseGetAllianceListHdr')
	suite:addTestCase(TestCaseSearchAllianceHdr, 'TestCaseSearchAllianceHdr')
	suite:addTestCase(TestCaseGetSelfAllianceMemsHdr, 'TestCaseGetSelfAllianceMemsHdr')
	suite:addTestCase(TestCaseGetOtherAllianceMemsHdr, 'TestCaseGetOtherAllianceMemsHdr')
	suite:addTestCase(TestCaseGetMyAllianceDetailHdr, 'TestCaseGetMyAllianceDetailHdr')
	suite:addTestCase(TestCaseUpgradeAllianceHdr, 'TestCaseUpgradeAllianceHdr')
	suite:addTestCase(TestCaseModifyQQGroupHdr, 'TestCaseModifyQQGroupHdr')
	suite:addTestCase(TestCaseInviteAllianceMemberHdr, 'TestCaseInviteAllianceMemberHdr')
	suite:addTestCase(TestCaseDismissAllianceHdr, 'TestCaseDismissAllianceHdr')
	suite:addTestCase(TestCaseCancelDismissAllianceHdr, 'TestCaseCancelDismissAllianceHdr')
	suite:addTestCase(TestCaseExitAllianceHdr, 'TestCaseExitAllianceHdr')
	suite:addTestCase(TestCaseModifyAllianceIntroducHdr, 'TestCaseModifyAllianceIntroducHdr')
	suite:addTestCase(TestCaseModifyAllianceBulletinHdr, 'TestCaseModifyAllianceBulletinHdr')
	suite:addTestCase(TestCaseGainAllianceTodayGiftHdr, 'TestCaseGainAllianceTodayGiftHdr')
	suite:addTestCase(TestCaseUpgradeLawLightHdr, 'TestCaseUpgradeLawLightHdr')
	suite:addTestCase(TestCaseLawLightBestowHdr, 'TestCaseLawLightBestowHdr')
	suite:addTestCase(TestCaseLawLightFeedHdr, 'TestCaseLawLightFeedHdr')
	suite:addTestCase(TestCaseGetALeadersHdr, 'TestCaseGetALeadersHdr')
	suite:addTestCase(TestCaseTransferLeaderAllianceHdr, 'TestCaseTransferLeaderAllianceHdr')
	suite:addTestCase(TestCaseCancelTransferAllianceHdr, 'TestCaseCancelTransferAllianceHdr')
	suite:addTestCase(TestCaseContributeAllianceResHdr, 'TestCaseContributeAllianceResHdr')
	suite:addTestCase(TestCaseGetTodaySortMemsHdr, 'TestCaseGetTodaySortMemsHdr')
	suite:addTestCase(TestCaseGetAllSortMemsHdr, 'TestCaseGetAllSortMemsHdr')
	suite:addTestCase(TestCaseAppointAlliMemberHdr, 'TestCaseAppointAlliMemberHdr')
	suite:addTestCase(TestCaseFireAlliMemberHdr, 'TestCaseFireAlliMemberHdr')
	suite:addTestCase(TestCaseAgreeApplyJoinAllianceHdr, 'TestCaseAgreeApplyJoinAllianceHdr')
	suite:addTestCase(TestCaseIgnoreApplyJoinAllianceHdr, 'TestCaseIgnoreApplyJoinAllianceHdr')
	suite:addTestCase(TestCaseGetAllianceEventsHdr, 'TestCaseGetAllianceEventsHdr')
	suite:addTestCase(TestCaseGetApplyAllianceMergesHdr, 'TestCaseGetApplyAllianceMergesHdr')
	suite:addTestCase(TestCaseApplyMergeAllianceHdr, 'TestCaseApplyMergeAllianceHdr')
	suite:addTestCase(TestCaseAgreeMergeAllianceHdr, 'TestCaseAgreeMergeAllianceHdr')
	suite:addTestCase(TestCaseIgnoreMergeAllianceHdr, 'TestCaseIgnoreMergeAllianceHdr')
	suite:addTestCase(TestCaseGetAllianceAuctionInfoHdr, 'TestCaseGetAllianceAuctionInfoHdr')
	suite:addTestCase(TestCaseAllianceAuctionBuyItemHdr, 'TestCaseAllianceAuctionBuyItemHdr')
	suite:addTestCase(TestCaseSellItemToAllianceHdr, 'TestCaseSellItemToAllianceHdr')
	suite:addTestCase(TestCaseCancelAllianceSellItemHdr, 'TestCaseCancelAllianceSellItemHdr')
	suite:addTestCase(TestCaseGetAllianceSellItemsHdr, 'TestCaseGetAllianceSellItemsHdr')
end;


