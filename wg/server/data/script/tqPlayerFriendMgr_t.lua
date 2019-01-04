--*******************************************************************************
--  
--*******************************************************************************
require('tqPlayerFriendMgr')

local TestCasePlayerFriendMgr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.mgr = self.player:getFriendMgr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_isFullFriend = function(self)
		local g_isFullRt = {true}
		self.mm:mock(self.mgr.buddySet, 'isFull', g_isFullRt )
		assertEQ ( self.mgr:isFullFriend(), true )
		
		g_isFullRt[1] = false
		assertEQ ( self.mgr:isFullFriend(), false )
	end;
	
	test_getMaxCount_whenVip = function(self)
		self.player:setVipLevel(3)
		local friendMgr = PlayerFriendMgr(self.player)
		assertEQ (friendMgr.buddySet:getMaxCount(), res_friend_base_cnt + 30)
		
		self.player:setVipLevel(4)
		friendMgr:resetMaxFriendCount()
		assertEQ (friendMgr.buddySet:getMaxCount(), res_friend_base_cnt + 40)
	end;
	
	test_addFriend = function(self)
		local g_hasRt = {true}
		local g_insertRt = {false}
		self.mm:mock(self.mgr.buddySet, 'has', g_hasRt )
		self.mm:mock(self.mgr.buddySet, 'insert', g_insertRt )
		self.mm:mock(WUtil, 'sendWarningMsgArgs' )
		self.mm:mock(FriendSender, 'sendFriend' )
		
		local g_roleId = 1
		assertEQ ( self.mgr:addFriend(g_roleId), false )
		assertEQ ( self.mm.walkLog, 'has,sendWarningMsgArgs' )
		assertEQ ( self.mm.params['has'], {g_roleId} )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100045, ''} )
		
		self.mm:clear()
		g_hasRt[1] = false
		assertEQ ( self.mgr:addFriend(g_roleId), false )
		assertEQ ( self.mm.walkLog, 'has,insert' )
		assertEQ ( self.mm.params['insert'], {{flag=0, roleId=g_roleId}} )
		
		self.mm:clear()
		g_insertRt[1] = true
		assertEQ ( self.mgr:addFriend(g_roleId), true )
		assertEQ ( self.mm.walkLog, 'has,insert,sendFriend' )
		assertEQ ( self.mm.params['sendFriend'], {self.player, g_roleId} )
	end;
	
	test_removeFriend = function(self)
		self.mm:mock(self.mgr.buddySet, 'remove')
		self.mm:mock(FriendSender, 'sendRemoveFriend' )
		
		local g_roleId = 1
		self.mgr:removeFriend(g_roleId)
		assertEQ ( self.mm.walkLog, 'remove,sendRemoveFriend' )
		assertEQ ( self.mm.params['remove'], {g_roleId} )
		assertEQ ( self.mm.params['sendRemoveFriend'], {self.player, g_roleId} )
	end;
	
	test_getFriendCount = function(self)
		self.mm:mock(self.mgr.buddySet, 'getCount', {1})
		assertEQ ( self.mgr:getFriendCount(), 1 )
		assertEQ ( self.mm.walkLog, 'getCount' )
	end;
	
	test_getFriendByIdx = function(self)
		local g_friendNode = {}
		self.mm:mock(self.mgr.buddySet, 'get', {g_friendNode})
		assertEQ ( self.mgr:getFriendByIdx(0), g_friendNode )
		assertEQ ( self.mm.params['get'], {0} )
	end;
	
	test_hasFriend = function(self)
		local g_hasRt = {true}
		self.mm:mock(self.mgr.buddySet, 'has', g_hasRt )
		assertEQ ( self.mgr:hasFriend(10000), true )
		assertEQ ( self.mm.params['has'], {10000} )
		
		g_hasRt[1] = false
		assertEQ ( self.mgr:hasFriend(10000), false )
	end;
	
	test_hasApply = function(self)
		local g_hasRt = {true}
		self.mm:mock(self.mgr.applySet, 'has', g_hasRt )
		assertEQ ( self.mgr:hasApply(10000), true )
		assertEQ ( self.mm.params['has'], {10000} )
		
		g_hasRt[1] = false
		assertEQ ( self.mgr:hasApply(10000), false )
	end;
	
	test_addApply = function(self)
		local g_hasRt = {true}
		local g_insertRt = {false}
		self.mm:mock(self.mgr.applySet, 'has', g_hasRt )
		self.mm:mock(self.mgr.applySet, 'insert', g_insertRt )
		self.mm:mock(WUtil, 'sendWarningMsgArgs' )
		self.mm:mock(FriendSender, 'sendApply' )
		
		local g_roleId = 1
		assertEQ ( self.mgr:addApply(g_roleId), false )
		assertEQ ( self.mm.walkLog, 'has,sendWarningMsgArgs' )
		assertEQ ( self.mm.params['has'], {g_roleId} )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100047, ''} )
		
		self.mm:clear()
		g_hasRt[1] = false
		assertEQ ( self.mgr:addApply(g_roleId), false )
		assertEQ ( self.mm.walkLog, 'has,insert,sendWarningMsgArgs' )
		assertEQ ( self.mm.params['insert'], {g_roleId} )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100048, ''} )
		
		self.mm:clear()
		g_insertRt[1] = true
		assertEQ ( self.mgr:addApply(g_roleId), true )
		assertEQ ( self.mm.walkLog, 'has,insert,sendApply' )
		assertEQ ( self.mm.params['sendApply'], {self.player, g_roleId} )
	end;
	
	test_getApplyCount = function(self)
		self.mm:mock(self.mgr.applySet, 'getCount', {1} )
		assertEQ ( self.mgr:getApplyCount(), 1 )
		assertEQ ( self.mm.walkLog, 'getCount' )
	end;
	
	test_getApplyByIdx = function(self)
		self.mm:mock(self.mgr.applySet, 'get', {10000})
		assertEQ ( self.mgr:getApplyByIdx(0), 10000 )
		assertEQ ( self.mm.params['get'], {0} )
	end;
	
	test_removeApply = function(self)
		self.mm:mock(self.mgr.applySet, 'remove')
		self.mm:mock(FriendSender, 'sendRemoveApply' )
		
		local g_roleId = 1
		self.mgr:removeApply(g_roleId)
		assertEQ ( self.mm.walkLog, 'remove,sendRemoveApply' )
		assertEQ ( self.mm.params['remove'], {g_roleId} )
		assertEQ ( self.mm.params['sendRemoveApply'], {self.player, g_roleId} )
	end;
})


tqPlayerFriendMgr_t_main = function(suite)
	suite:addTestCase(TestCasePlayerFriendMgr, 'TestCasePlayerFriendMgr')
end;


