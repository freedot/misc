require('tqItemHandler')

local TestCaseItemHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ItemHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(1):getClass() , GetDetailItemHdr )
	end;
})

local TestCaseGetDetailItemHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ItemHandler():getHandler(1)	
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(ItemMsgSender, 'sendOtherDetailItem')
		self.mm:mock(ItemMsgSender, 'sendOtherDetailItemFail')
		local r_getPlayerByName = {nil}
		local r_getOfflinePlayerByName = {nil}
		self.mm:mock(app:getPlayerMgr(), 'getPlayerByName', r_getPlayerByName)
		self.mm:mock(app:getPlayerMgr(), 'getOfflinePlayerByName', r_getOfflinePlayerByName)
		local cmd = {roleId=1, itemId=2}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100168, ''} )
		assertEQ ( self.mm.params['sendOtherDetailItemFail'], {self.player} )
		
		self.mm:clear()
		local player = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 10000001)
		cmd = {roleId=10000001, itemId=2}
		assertEQ ( self.hdr:handle(player, cmd), false )
		
		self.mm:clear()
		r_getOfflinePlayerByName[1] = player
		local player = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 10000001)
		cmd = {roleId=10000001, itemId=2}
		assertEQ ( self.hdr:handle(player, cmd), false )
		
		self.mm:clear()
		player:getPkg():addItems({RawItemEx({resId=FIXID.HEIMULING, number=1})})
		player:getPkg():addItems({RawItemEx({resId=FIXID.REFRESHCARD, number=1})})
		cmd = {roleId=10000001, itemId=2}
		assertEQ ( self.hdr:handle(player, cmd), true )
		local item = player:getPkg():getItemById(2)
		assertEQ ( self.mm.params['sendOtherDetailItem'], {player, 10000001, item} )
		
		self.mm:clear()
		r_getPlayerByName[1] = player
		r_getOfflinePlayerByName[1] = nil
		assertEQ ( self.hdr:handle(player, cmd), true )
	end;
}) 


tqItemHandler_t_main = function(suite)
	suite:addTestCase(TestCaseItemHandler, 'TestCaseItemHandler')
	suite:addTestCase(TestCaseGetDetailItemHdr, 'TestCaseGetDetailItemHdr')
end;

