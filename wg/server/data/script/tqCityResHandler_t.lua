require('tqCityResHandler')

local TestCaseCityResHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testGetCityResCmd = function(self)
		clearSendMsg_t()
		local cmd = {cmd=NETCMD.CITYRES, subcmd=1}
		CityResHandler():onRequest(self.player, nil, cmd)
		assert(getSendMsg_t() ~= '')
	end;
	
	testUpgradeCityLevelCmd = function(self)
		self.mm:mock(CityBuildValSender, 'sendAll')
		self.mm:mock(RoleBaseSender, 'send:roleSend')
		self.mm:mock(TaskFinisher, 'checkTasks')
		local cres = self.player:getCityRes()
		cres:setBuildVal(100000)
		local level = cres:getLevel()
		clearSendMsg_t()
		local cmd = {cmd=NETCMD.CITYRES, subcmd=2}
		CityResHandler():onRequest(self.player, nil, cmd)
		assert(getSendMsg_t() ~= '')
		assert(cres:getLevel() == level+1)
		assertEQ ( self.mm.params['sendAll'], {self.player} )
		assertEQ ( self.mm.params['checkTasks'], {self.player} )
		assertEQ ( self.mm.params['roleSend'], {self.player, {'cityMaxLevel'}} )
	end;
})

tqCityResHandler_t_main = function(suite)
	suite:addTestCase(TestCaseCityResHandler, 'TestCaseCityResHandler')
end;

