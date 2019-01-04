--*******************************************************************************
--*******************************************************************************
require('tqMailHandler')

local TestCaseMailHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sendAllBriefMails = function(self)
		self.mm:mock(MailSender, 'sendAllBriefMails')
		MailHandler():onRequest(self.player, nil, {subcmd=1})
		
		assertEQ ( self.mm.walkLog, 'sendAllBriefMails' )
		assertListEQ ( self.mm.params['sendAllBriefMails'], {self.player} )
	end;
	
	test_sendDetailMail = function(self)
		self.mm:mock(app:getMailMgr(), 'setReaded')
		self.mm:mock(MailSender, 'sendMail')
		
		MailHandler():onRequest(self.player, nil, {subcmd=2, id=1})
		assertEQ ( self.mm.walkLog, 'setReaded,sendMail' )
		assertListEQ ( self.mm.params['setReaded'], {1} )
		assertListEQ ( self.mm.params['sendMail'], {self.player, 1} )
		
		self.mm:clear()
		MailHandler():onRequest(self.player, nil, {subcmd=2})
		assertEQ ( self.mm.walkLog, 'setReaded,sendMail' )
		assertListEQ ( self.mm.params['setReaded'], {0} )
		assertListEQ ( self.mm.params['sendMail'], {self.player, 0} )
	end;
	
	test_mailSendHandler = function(self)
		local g_cmd = {subcmd=3, id=1}
		self.mm:mock(MailSendHandler, 'handle')
		MailHandler():onRequest(self.player, nil, g_cmd)
		assertEQ ( self.mm.walkLog, 'handle' )
		assertListEQ ( self.mm.params['handle'], {self.player, g_cmd} )
	end;
	
	test_mailDeleteHandler = function(self)
		local g_cmd = {subcmd=4, id=1}
		self.mm:mock(MailDeleteHandler, 'handle')
		MailHandler():onRequest(self.player, nil, g_cmd)
		assertEQ ( self.mm.walkLog, 'handle' )
		assertListEQ ( self.mm.params['handle'], {self.player, g_cmd} )
	end;
})

TestCaseMailSendHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_initParams = function(self)
		assert ( MailSendHandler:_initParams(self.player, {to='', title='', msg=''}) == false )
		assert ( MailSendHandler.fromPlayer == self.player )
		
		assert ( MailSendHandler:_initParams(self.player, {to='aaa', title='', msg=''}) == false )
		assert ( MailSendHandler:_initParams(self.player, {to='aaa', title='bbb', msg=''}) == false )
		assert ( MailSendHandler:_initParams(self.player, {to='aaa', title='bbb', msg='ccc'}) == true )
	end;
	
	test_getToPlayer = function(self)
		local sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		MailSendHandler.to = 'no_r'
		assert ( MailSendHandler:_getToPlayer() == false )
		
		MailSendHandler.to = 'source_r'
		assert ( MailSendHandler:_getToPlayer() == true )
		assert ( MailSendHandler.toPlayer == sourcePlayer )
	end;
	
	test_handle = function(self)
		local g_getParamsRt = true
		local g_getToPlayerRt = true
		local g_player = self.player
		local g_mail = {}
		local g_cmd = {to='role', title='title', msg='msg'}
		self.mm:mock(MailSendHandler, '_initParams', nil, function(self, player, cmd)
			self.fromPlayer = player
			self.to = cmd.to
			self.title = cmd.title
			self.msg = cmd.msg
			return g_getParamsRt
			end)
		self.mm:mock(MailSendHandler, '_getToPlayer', nil, function(self)
			self.toPlayer = g_player
			return g_getToPlayerRt
			end)
		self.mm:mock(app:getMailMgr(), 'addPlayerMail', {g_mail})
		self.mm:mock(MailSender,'sendBriefMail')
		local r_targetIsSelf = {true}
		self.mm:mock(MailSendHandler,'_targetIsSelf', r_targetIsSelf)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		
		g_getParamsRt = false
		MailSendHandler:handle(self.player, g_cmd)
		assert ( self.mm.walkLog == '_initParams' )
		assertListEQ ( self.mm.params['_initParams'], {g_player, g_cmd} )
		assert ( MailSendHandler.fromPlayer == g_player )
		assert ( MailSendHandler.to == g_cmd.to )
		assert ( MailSendHandler.title == g_cmd.title )
		assert ( MailSendHandler.msg == g_cmd.msg )
		
		self.mm:clear()
		g_getParamsRt = true
		g_getToPlayerRt = false
		MailSendHandler:handle(self.player, g_cmd)
		assert ( self.mm.walkLog == '_initParams,_getToPlayer' )
		assert ( MailSendHandler.toPlayer == g_player )
		
		self.mm:clear()
		g_getParamsRt = true
		g_getToPlayerRt = true
		MailSendHandler:handle(self.player, g_cmd)
		assert ( self.mm.walkLog == '_initParams,_getToPlayer,_targetIsSelf,sendWarningMsgArgs' )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100166, ''}, 'can not send to self' )
		
		self.mm:clear()
		r_targetIsSelf[1] = false
		self.player:setCityGrid({objType=OBJ_TYPE.DIED_ROLE})
		MailSendHandler:handle(self.player, g_cmd)
		assert ( self.mm.walkLog == '_initParams,_getToPlayer,_targetIsSelf,sendWarningMsgArgs' )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100169, ''}, 'can not send to died player' )
		
		self.mm:clear()
		self.player:setCityGrid({objType=OBJ_TYPE.ROLE})
		MailSendHandler:handle(self.player, g_cmd)
		assert ( self.mm.walkLog == '_initParams,_getToPlayer,_targetIsSelf,addPlayerMail,sendBriefMail' )
		assertListEQ ( self.mm.params['addPlayerMail'], {g_player:getRoleName(), g_player:getRoleName(), g_cmd.title, g_cmd.msg} )
		assertListEQ ( self.mm.params['sendBriefMail'], {g_player,g_mail} )
	end;
	
	test__targetIsSelf = function(self)
		MailSendHandler.fromPlayer = self.player
		MailSendHandler.toPlayer = self.player
		assertEQ ( MailSendHandler:_targetIsSelf(), true)
		
		MailSendHandler.toPlayer = nil
		assertEQ ( MailSendHandler:_targetIsSelf(), false)
	end;
})

TestCaseMailDeleteHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local g_cmd = {subcmd=4, cnt=2, id1=1, id2=2 }
		local g_getParamsRt = {false}
		
		self.mm:mock(MailDeleteHandler, '_initParams', g_getParamsRt, function(self, player) self.player = player end )
		self.mm:mock(MailDeleteHandler, '_deleteMails')
		
		MailDeleteHandler:handle(self.player, g_cmd)
		assert ( self.mm.walkLog == '_initParams' )
		assertListEQ ( self.mm.params['_initParams'] , {self.player, g_cmd} )
		
		self.mm:clear()
		g_getParamsRt[1] = true
		MailDeleteHandler:handle(self.player, g_cmd)
		assert ( self.mm.walkLog == '_initParams,_deleteMails' )
	end;
	
	test__initParams = function(self)
		local g_cmd = {subcmd=4, cnt=0 }
		assert ( MailDeleteHandler:_initParams(self.player, g_cmd) == false )
		assert ( MailDeleteHandler.player == self.player )
		
		local g_cmd = {subcmd=4, cnt=2, id1=1, id2=2 }
		assert ( MailDeleteHandler:_initParams(self.player, g_cmd) == true )
		assert ( table.getn(MailDeleteHandler.ids) == 2 )
		assert ( MailDeleteHandler.ids[1] == 1 )
		assert ( MailDeleteHandler.ids[2] == 2 )
	end;
	
	test__deleteMails = function(self)
		self.player:setRoleName('my')
		MailDeleteHandler.ids = {1,2}
		MailDeleteHandler.player = self.player
		
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(MailSender, 'sendDelMail')
		self.mm:mock(app:getMailMgr(), 'deleteMail', nil, function(self, receiver, id)
			if id == 1 then return MAIL_RET.OK end
			if id == 2 then return MAIL_RET.DELETEHASITEMS end
		end )
		
		MailDeleteHandler:_deleteMails()
		assertEQ ( self.mm.walkLog, 'deleteMail,sendDelMail,deleteMail,sendWarningMsgArgs' )
		assertEQ ( self.mm.params['deleteMail.1'], {'my', 1})
		assertEQ ( self.mm.params['deleteMail.2'], {'my', 2})
		assertEQ ( self.mm.params['sendWarningMsgArgs'] , {self.player, 100016, ''} )
		assertEQ ( self.mm.params['sendDelMail'] , {self.player, 1} )
	end;
})

TestCaseMailGetItemsHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local g_player = self.player
		local g_cmd = {}
		local g_mail = Mail()
		local g_initParamsRt = {false}
		local g_addItemsRt = {false}
		
		g_mail:addItem({})
		
		self.mm:mock(MailGetItemsHandler, '_initParams', g_initParamsRt, function(self)  
			self.player=g_player
			self.mail=g_mail end)
		self.mm:mock(self.player:getPkg(), 'addItems', g_addItemsRt)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(MailGetItemsHandler, '_clearMailPkgItems')
		
		MailGetItemsHandler:handle(g_player, g_cmd)
		assert ( self.mm.walkLog == '_initParams' )
		assertListEQ ( self.mm.params['_initParams'], {g_player, g_cmd} )
		
		self.mm:clear()
		g_initParamsRt[1] = true
		MailGetItemsHandler:handle(g_player, g_cmd)
		assert ( self.mm.walkLog == '_initParams,addItems,sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['addItems'], { g_mail:getItems() } )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {g_player, 100017, ''} )
		
		self.mm:clear()
		g_addItemsRt[1] = true
		MailGetItemsHandler:handle(g_player, g_cmd)
		assert ( self.mm.walkLog == '_initParams,addItems,_clearMailPkgItems' )
	end;
	
	test_initParams = function(self)
		local g_getMailByIdRt = {nil}
		self.mm:mock(app:getMailMgr(), 'getMailById', g_getMailByIdRt)
		
		assert ( MailGetItemsHandler:_initParams(self.player, {}) == false )
		assert ( MailGetItemsHandler.player == self.player )
		assert ( MailGetItemsHandler:_initParams(self.player, {id=0}) == false )
		assert ( MailGetItemsHandler:_initParams(self.player, {id=1}) == false )
		
		local g_mail = Mail()
		g_mail:setId(2)
		g_getMailByIdRt[1] = g_mail
		assert ( MailGetItemsHandler:_initParams(self.player, {id=g_mail:getId()}) == false )
		
		g_mail:addItem({})
		assert ( MailGetItemsHandler:_initParams(self.player, {id=g_mail:getId()}) == true )
	end;
	
	test_clearMailPkgItems = function(self)
		self.player:setRoleName('receiver')
		MailGetItemsHandler.player = self.player
		MailGetItemsHandler.mail = Mail()
		MailGetItemsHandler.mail:setId(1)
		
		self.mm:mock(app:getMailMgr(), 'clearItems')
		self.mm:mock(MailSender, 'sendMailClearItem')
		
		MailGetItemsHandler:_clearMailPkgItems()
		
		assert ( self.mm.walkLog == 'clearItems,sendMailClearItem' )
		assertListEQ ( self.mm.params['clearItems'], {'receiver', MailGetItemsHandler.mail})
		assertListEQ ( self.mm.params['sendMailClearItem'], {self.player, 1})
	end;
})

tqMailHandler_t_main = function(suite)
	suite:addTestCase(TestCaseMailHandler, 'TestCaseMailHandler')
	suite:addTestCase(TestCaseMailSendHandler, 'TestCaseMailSendHandler')
	suite:addTestCase(TestCaseMailDeleteHandler, 'TestCaseMailDeleteHandler')
	suite:addTestCase(TestCaseMailGetItemsHandler, 'TestCaseMailGetItemsHandler')
end;


