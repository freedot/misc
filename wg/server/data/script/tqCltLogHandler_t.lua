--*******************************************************************************
require('tqCltLogHandler')

local TestCaseCltLogHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = CltLogHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(1):getClass() , CltErrLogHandler )
	end;
})

local TestCaseCltErrLogHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = CltLogHandler():getHandler(1)	
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local LOG_ = LOG
		local r_msg = ''
		LOG = function(msg) 
			r_msg = msg
		end;
		self.player:setRoleName('role1')
		local cmdtb = {browser=1, ver=2, msg='log1'}
		self.hdr:handle(self.player, cmdtb)
		assertEQ (r_msg, '<clienterr> role:role1,browser:1,ver:2,msg:log1' )
		LOG = LOG_
	end;
})

local TestCaseCltSuggestHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = CltLogHandler():getHandler(2)	
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local LOG_ = LOGEX
		local r_msg = ''
		LOGEX = function(ty, msg) 
			r_msg = msg
		end;
		self.player:setName('user1')
		self.player:setRoleName('role1')
		self.player:setLevel(1)
		local cmdtb = {msg='log1'}
		self.hdr:handle(self.player, cmdtb)
		assertEQ (r_msg, '<suggest> user:user1,role:role1,level:1,msg:log1' )
		LOGEX = LOG_
	end;
})

tqCltLogHandler_t_main = function(suite)
	suite:addTestCase(TestCaseCltLogHandler, 'TestCaseCltLogHandler')
	suite:addTestCase(TestCaseCltErrLogHandler, 'TestCaseCltErrLogHandler')
	suite:addTestCase(TestCaseCltSuggestHandler, 'TestCaseCltSuggestHandler')
end;


