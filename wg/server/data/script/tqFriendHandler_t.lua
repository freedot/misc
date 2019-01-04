--*******************************************************************************
--*******************************************************************************
require('tqFriendHandler')

local TestCaseFriendHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = FriendHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(0):getClass() , NullHandler )
		assertEQ ( self.hdr:getHandler(1):getClass() , GetFriendsHandler )
		assertEQ ( self.hdr:getHandler(2):getClass() , ApplyFriendHandler )
		assertEQ ( self.hdr:getHandler(3):getClass() , AgreeApplyFriendHandler )
		assertEQ ( self.hdr:getHandler(4):getClass() , RejectApplyFriendHandler )
		assertEQ ( self.hdr:getHandler(5):getClass() , DeleteFriendHandler )
		assertEQ ( self.hdr:getHandler(6):getClass() , FriendChatHandler )
	end;
})

local TestCaseGetFriendsHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = GetFriendsHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(FriendSender, 'sendAllFriends' )
		self.mm:mock(FriendSender, 'sendAllApplys' )
		self.hdr:handle(self.player)
		assertEQ ( self.mm.walkLog, 'sendAllFriends,sendAllApplys' )
		assertEQ ( self.mm.params['sendAllFriends'], {self.player} )
		assertEQ ( self.mm.params['sendAllApplys'], {self.player} )
	end;
})

local TestCaseApplyFriendHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ApplyFriendHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.hdr.player = self.player
		self.player:setRoleId(200001)
		self.hdr.target = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200000)
		
		local g_initParamRt = {false}
		local g_addFriendRt = {true}
		self.mm:mock(self.hdr, '_initParam', g_initParamRt)
		self.mm:mock(self.hdr.target:getFriendMgr(), 'addApply', g_addFriendRt)
		
		local g_cmd = {}
		assertEQ ( self.hdr:handle(self.player, g_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam' )
		assertEQ ( self.mm.params['_initParam'], {self.player, g_cmd} )
		
		self.mm:clear()
		g_initParamRt[1] = true
		assertEQ ( self.hdr:handle(self.player, g_cmd), true )
		assertEQ ( self.mm.walkLog, '_initParam,addApply' )
		assertEQ ( self.mm.params['addApply'], {200001} )
	end;
	
	test__initParam = function(self)
		self.player:setRoleName('my')
		local g_cmd = {name='role'}
		
		local g_getGridByRoleIdRt = {nil}
		local g_target = {}
		self.mm:mock(app:getCityMgr(), 'getGridByRoleName', g_getGridByRoleIdRt)
		self.mm:mock(ArmyPlayerGetter, 'getPlayer', {g_target})
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		
		self.mm:clear()
		assertEQ ( self.hdr:_initParam(self.player, g_cmd), false )
		assertEQ ( self.mm.params['getGridByRoleName'], {'role'} )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100050, ''} )
		
		self.mm:clear()
		g_getGridByRoleIdRt[1] = {gridId=1, roleId=1, roleName='my', userName='myuser', objType=OBJ_TYPE.ROLE}
		assertEQ ( self.hdr:_initParam(self.player, g_cmd), false )
		
		self.mm:clear()
		g_getGridByRoleIdRt[1] = {gridId=1, roleId=1, roleName='you', userName='youuser', objType=OBJ_TYPE.ROLE}
		assertEQ ( self.hdr:_initParam(self.player, g_cmd), true )
		assertEQ ( self.hdr.player, self.player )
		assertEQ ( self.hdr.target, g_target )
		assertEQ ( self.mm.params['getPlayer'], {OBJ_TYPE.ROLE, 1} )
	end;
})

local TestCaseAgreeApplyFriendHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AgreeApplyFriendHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.hdr.player = self.player
		self.player:setRoleId(200001)
		self.hdr.applicant = TestCaseHelper:loadPlayerByUserNameEx('applicant', 'applicant_r', 200000)
		
		local g_initParamRt = {false}
		local g_isFullFriendRt1 = {true}
		local g_isFullFriendRt2 = {true}
		
		self.mm:mock(self.hdr, '_initParam', g_initParamRt)
		self.mm:mock(self.player:getFriendMgr(), 'isFullFriend', g_isFullFriendRt1)
		self.mm:mock(self.hdr.applicant:getFriendMgr(), 'isFullFriend', g_isFullFriendRt2)
		self.mm:mock(self.player:getFriendMgr(), 'removeApply')
		self.mm:mock(self.player:getFriendMgr(), 'addFriend')
		self.mm:mock(self.hdr.applicant:getFriendMgr(), 'addFriend')
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		
		local g_cmd = {}
		assertEQ ( self.hdr:handle( self.player, g_cmd ), false )
		assertEQ ( self.mm.walkLog, '_initParam' )
		assertEQ ( self.mm.params['_initParam'], {self.player, g_cmd} )
		
		self.mm:clear()
		g_initParamRt[1] = true
		assertEQ ( self.hdr:handle( self.player, g_cmd ), false )
		assertEQ ( self.mm.walkLog, '_initParam,isFullFriend,sendWarningMsgArgs' )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100046, ''} )
		
		self.mm:clear()
		g_isFullFriendRt1[1] = false
		assertEQ ( self.hdr:handle( self.player, g_cmd ), false )
		assertEQ ( self.mm.walkLog, '_initParam,isFullFriend,isFullFriend,sendWarningMsgArgs' )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100049, ''} )
		
		self.mm:clear()
		g_isFullFriendRt2[1] = false
		assertEQ ( self.hdr:handle( self.player, g_cmd ), true )
		assertEQ ( self.mm.walkLog, '_initParam,isFullFriend,isFullFriend,removeApply,addFriend,addFriend' )
		assertEQ ( self.mm.params['removeApply'], {200000} )
		assertEQ ( self.mm.params['addFriend.1'], {200000} )
		assertEQ ( self.mm.params['addFriend.2'], {200001} )
	end;
	
	test__initParam = function(self)
		local g_cmd = {id=1}
		local g_hasApplyRt = {false}
		local g_getGridByRoleIdRt = {nil}
		local g_applicant = {}
		
		self.mm:mock(self.player:getFriendMgr(), 'hasApply', g_hasApplyRt)
		self.mm:mock(app:getCityMgr(), 'getGridByRoleId', g_getGridByRoleIdRt)
		self.mm:mock(ArmyPlayerGetter, 'getPlayer', {g_applicant})
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		
		assertEQ ( self.hdr:_initParam(self.player, g_cmd), false )
		assertEQ ( self.mm.walkLog, 'hasApply' )
		assertEQ ( self.mm.params['hasApply'], {1} )
		
		self.mm:clear()
		g_hasApplyRt[1] = true
		assertEQ ( self.hdr:_initParam(self.player, g_cmd), false )
		assertEQ ( self.mm.walkLog, 'hasApply,getGridByRoleId,sendWarningMsgArgs' )
		assertEQ ( self.mm.params['getGridByRoleId'], {1} )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100050, ''} )
		
		self.mm:clear()
		g_getGridByRoleIdRt[1] = {objType=OBJ_TYPE.COPYFIELD}
		assertEQ ( self.hdr:_initParam(self.player, g_cmd), false )
		assertEQ ( self.mm.walkLog, 'hasApply,getGridByRoleId,sendWarningMsgArgs' )
		assertEQ ( self.mm.params['getGridByRoleId'], {1} )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100050, ''} )
		
		self.mm:clear()
		g_getGridByRoleIdRt[1] = {objType=OBJ_TYPE.ROLE}
		assertEQ ( self.hdr:_initParam(self.player, g_cmd), true )
		assertEQ ( self.mm.walkLog, 'hasApply,getGridByRoleId,getPlayer' )
		assertEQ ( self.hdr.applicant, g_applicant )
		assertEQ ( self.hdr.player, self.player )
	end;
})

local TestCaseRejectApplyFriendHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = RejectApplyFriendHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.hdr.player = self.player
		self.hdr.roleId = 10000
		
		local g_initParamRt = {false}
		self.mm:mock(self.hdr, '_initParam', g_initParamRt)
		self.mm:mock(self.player:getFriendMgr(), 'removeApply')
		
		local g_cmd = {}
		assertEQ ( self.hdr:handle(self.player, g_cmd), false )
		assertEQ ( self.mm.params['_initParam'], {self.player, g_cmd} )
		
		self.mm:clear()
		g_initParamRt[1] = true
		assertEQ ( self.hdr:handle(self.player, g_cmd), true )
		assertEQ ( self.mm.walkLog, '_initParam,removeApply' )
		assertEQ ( self.mm.params['removeApply'], {10000} )
	end;
	
	test__initParam = function(self)
		local r_hasApply = {false}
		self.mm:mock(self.player:getFriendMgr(), 'hasApply', r_hasApply)
		
		local p_cmdtb = {id=1}
		assertEQ ( self.hdr:_initParam(self.player, p_cmdtb), false )
		assertEQ ( self.mm.params['hasApply'], {1} )
		
		r_hasApply[1] = true
		assertEQ ( self.hdr:_initParam(self.player, p_cmdtb), true )
		assertEQ ( self.hdr.roleId, 1)
		assertEQ ( self.hdr.player, self.player)
	end;
})

local TestCaseDeleteFriendHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = DeleteFriendHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.hdr.player = self.player
		self.player:setRoleId(200001)
		self.hdr.friend = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200000)
		self.hdr.friendRoleId = 200000
		
		local g_initParamRt = {false}
		self.mm:mock(self.hdr, '_initParam', g_initParamRt)
		self.mm:mock(self.hdr.player:getFriendMgr(), 'removeFriend')
		self.mm:mock(self.hdr.friend:getFriendMgr(), 'removeFriend')
		
		local g_cmd = {}
		assertEQ ( self.hdr:handle(self.player, g_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam' )
		assertEQ ( self.mm.params['_initParam'], {self.player, g_cmd} )
		
		self.mm:clear()
		g_initParamRt[1] = true
		assertEQ ( self.hdr:handle(self.player, g_cmd), true )
		assertEQ ( self.mm.walkLog, '_initParam,removeFriend,removeFriend' )
		assertEQ ( self.mm.params['removeFriend.1'], {200000} )
		assertEQ ( self.mm.params['removeFriend.2'], {200001} )
	end;
	
	test__initParam = function(self)
		local r_hasFriend = {false}
		self.mm:mock(self.player:getFriendMgr(), 'hasFriend', r_hasFriend)
		
		local p_cmdtb = {id=1000000}
		assertEQ ( self.hdr:_initParam(self.player, p_cmdtb), false )
		assertEQ ( self.mm.params['hasFriend'], {1000000} )
		
		r_hasFriend[1] = true
		assertEQ ( self.hdr:_initParam(self.player, p_cmdtb), true )
		assertEQ ( self.hdr.friendRoleId, 1000000)
		assertEQ ( self.hdr.friend, NullPlayer)
		assertEQ ( self.hdr.player, self.player)
	end;
})

local TestCaseFriendChatHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = FriendChatHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.hdr.player = TestCaseHelper:loadPlayerByUserNameEx('role', 'role_r', 200000)
		self.hdr.friend = TestCaseHelper:loadPlayerByUserNameEx('friend', 'friend_r', 200001)
		self.hdr.msg = 'msg'
	
		local r_initParam = {false}
		self.mm:mock(self.hdr, '_initParam', r_initParam)
		self.mm:mock(FriendSender, 'sendFriendChat')
		
		local p_player = self.hdr.player
		local p_cmdtb = {}
		assertEQ ( self.hdr:handle(p_player, p_cmdtb), false )
		assertEQ ( self.mm.walkLog, '_initParam' )
		assertEQ ( self.mm.params[ '_initParam'  ], {p_player, p_cmdtb} )
		
		self.mm:clear()
		r_initParam[1] = true
		assertEQ ( self.hdr:handle(p_player, p_cmdtb), true )
		assertEQ ( self.mm.walkLog, '_initParam,sendFriendChat' )
		assertEQ ( self.mm.params[ 'sendFriendChat'  ], {self.hdr.friend, 200000, 'role_r', 'msg'} )
	end;
	
	test__initParam = function(self)
		local r_getGridByRoleId = {nil}
		local r_getPlayerByName = {nil}
		local r_isValidMsg = {false}
		self.mm:mock(app:getCityMgr(), 'getGridByRoleId', r_getGridByRoleId)
		self.mm:mock(app:getPlayerMgr(), 'getPlayerByName', r_getPlayerByName)
		self.mm:mock(self.hdr, '_isValidMsg', r_isValidMsg)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		
		local p_cmdtb = {id=10000, msg="msg"}
		assertEQ ( self.hdr:_initParam(self.player, p_cmdtb), false )
		assertEQ ( self.mm.params['getGridByRoleId'], {10000} )
		
		self.mm:clear()
		r_getGridByRoleId[1] = {userName='user'}
		assertEQ ( self.hdr:_initParam(self.player, p_cmdtb), false )
		assertEQ ( self.mm.params['getPlayerByName'], {'user'} )
		
		self.mm:clear()
		r_getPlayerByName[1] = {name='friendPlayer'}
		assertEQ ( self.hdr:_initParam(self.player, p_cmdtb), false )
		assertEQ ( self.mm.params['_isValidMsg'], {'msg'} )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100060, ''} )
		
		self.mm:clear()
		r_isValidMsg[1] = true
		assertEQ ( self.hdr:_initParam(self.player, p_cmdtb), true )
		assertEQ ( self.hdr.friend, r_getPlayerByName[1] )
		assertEQ ( self.hdr.player, self.player)
		assertEQ ( self.hdr.msg, 'msg')
	end;
	
	test__isValidMsg = function(self)
		self.hdr.MSG_MAX_LEN = 3
		assertEQ ( self.hdr:_isValidMsg(''), false )
		assertEQ ( self.hdr:_isValidMsg('1234'), false )
		assertEQ ( self.hdr:_isValidMsg('123'), true )
	end;
})

tqFriendHandler_t_main = function(suite)
	suite:addTestCase(TestCaseFriendHandler, 'TestCaseFriendHandler')
	suite:addTestCase(TestCaseGetFriendsHandler, 'TestCaseGetFriendsHandler')
	suite:addTestCase(TestCaseApplyFriendHandler, 'TestCaseApplyFriendHandler')
	suite:addTestCase(TestCaseAgreeApplyFriendHandler, 'TestCaseAgreeApplyFriendHandler')
	suite:addTestCase(TestCaseRejectApplyFriendHandler, 'TestCaseRejectApplyFriendHandler')
	suite:addTestCase(TestCaseDeleteFriendHandler, 'TestCaseDeleteFriendHandler')
	suite:addTestCase(TestCaseFriendChatHandler, 'TestCaseFriendChatHandler')
end;


