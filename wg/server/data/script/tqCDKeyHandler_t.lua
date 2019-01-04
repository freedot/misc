--*******************************************************************************
require('tqCDKeyHandler')

local TestCaseCDKeyHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = CDKeyHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(1):getClass() , SendCDKeyHandler )
	end;
})

local TestCaseSendCDKeyHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.player:setRoleName('role')
		self.hdr = CDKeyHandler():getHandler(1)
		self.hdr:_delayCreateMapper()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		Util:setTimeDrt(1231232132)
		local r_getCDKey = {nil}
		self.mm:mock(self.hdr._mapper, 'getCDKey', r_getCDKey)
		self.mm:mock(self.hdr._mapper, 'setUsed')
		self.mm:mock(app:getMailMgr(), 'addSysMail', {'mail'})
		self.mm:mock(MailSender, 'sendBriefMail')
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(WUtil, 'sendSuccMsgArgs')
		
		local cmd = {}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100183, ''} )
		
		self.mm:clear()
		cmd = {cdkey='XXXC30377AB70B954833'}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100183, ''} )

		self.mm:clear()
		cmd = {cdkey='D5DC30377AB70B954833'}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100183, ''} )
		
		self.mm:clear()
		r_getCDKey[1] = {resid=4500031, ty=1, number=1, createTime=1231232132, isUsed=1}
		cmd = {cdkey='31F86DC8E86E677B1DB4'}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100184, ''} )
		
		self.mm:clear()
		r_getCDKey[1] = {resid=4500031, ty=1, number=1, createTime=1231232132-30*24*3600-1, isUsed=0}
		cmd = {cdkey='13DCFE2D75E87228851C'}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100185, ''} )
		
		self.mm:clear()
		r_getCDKey[1] = {resid=4500031, ty=1, number=1, createTime=1231232132, isUsed=0}
		cmd = {cdkey='13DCFE2D75E87228851C'}
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		
		assertEQ ( self.mm.walkLog, 'getCDKey,setUsed,addSysMail,sendBriefMail,sendSuccMsgArgs' );
		assertEQ ( self.mm.params['setUsed'], {'13DCFE2D75E87228851C'} )
		local rawItems = DropItem():createRawItems({{resid=4500031, number=1}})
		assertEQ ( self.mm.params['addSysMail'], {'role', rstr.mail.title.cdkey, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.cdkey, rawItems} )
		assertEQ ( self.mm.params['sendBriefMail'], {self.player, 'mail'} )
		assertEQ ( self.mm.params['sendSuccMsgArgs'], {self.player, 100182, ''} )
		
		self.mm:clear()
		r_getCDKey[1] = {resid=4500031, ty=1, number=1, createTime=1231232132, isUsed=0}
		cmd = {cdkey='13DCFE2D75E87228851C'}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100186, ''} )
		
		self.mm:clear()
		r_getCDKey[1] = {resid=4500031, ty=2, number=1, createTime=1231232132, isUsed=0}
		cmd = {cdkey='13DCFE2D75E87228851C'}
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		
		self.mm:clear()
		ServerOnlineToggleChecker:setFlag('cdkey', false)
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100181, ''} )
	end;
})

tqCDKeyHandler_t_main = function(suite)
	suite:addTestCase(TestCaseCDKeyHandler, 'TestCaseCDKeyHandler')
	suite:addTestCase(TestCaseSendCDKeyHandler, 'TestCaseSendCDKeyHandler')
end;


