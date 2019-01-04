--*******************************************************************************
require('tqAutoBuildsHandler')

local TestCaseAutoBuildsHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AutoBuildsHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(1):getClass() , StartAutoBuildsHdr )
	end;	
})

local TestCaseStartAutoBuildsHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = AutoBuildsHandler():getHandler(1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.player:getCitys():setStartAutoBuild(0)
		local cmd = {count=-1,id1=2001,id2=1001,id3=3001,id4=3002,id5=3003}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {count=5,id1=2001,id2=1001,id3=3001,id4=3002,id5=3003}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		self.player:setVipLevel(5)
		cmd = {count=5,id1=2001,id2=1001,id3=3001,id4=3002}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {count=5,id1=1001,id2=1002,id3=1003,id4=1004,id5=1005}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		TestCaseCondition:setPreCond(self.player, nil, { 
			food=10000, wood=10000, stone=10000, iron=10000
			,builds={ 
			{id=1,resid=FIXID.GOV_BUILD,level=10,state=1}
			,{id=2,resid=FIXID.WALLBUILD,level=10,state=0}
			,{id=3,resid=FIXID.HOUSEBUILD,level=1,state=0}
			,{id=4,resid=FIXID.HOUSEBUILD,level=1,state=0}
			,{id=5,resid=FIXID.HOUSEBUILD,level=1,state=0}
			,{id=6,resid=FIXID.HOUSEBUILD,level=1,state=0}
		} })
		
		cmd = {count=5,id1=1001,id2=1002,id3=1003,id4=1004,id5=1005}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {count=4,id1=1003,id2=1004,id3=1005,id4=1006}
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getCitys():isStartAutoBuild(), true )
		assertEQ ( self.player:getCitys():getCityById(1):getBuildById(3).ucState, 1 )
		assertEQ ( self.player:getCitys():getCityById(1):getBuildById(4).ucState, 1 )
		assertEQ ( self.player:getCitys():getCityById(1):getBuildById(5).ucState, 1 )
		assertEQ ( self.player:getCitys():getCityById(1):getBuildById(6).ucState, 0 )		
		assertEQ ( self.player:getCitys():getAutoBuilds():getCount(), 1 )
	end;
	
	test_handle_clear = function(self)
		self.mm:mock(AutoBuildSender, 'sendInfo')
		self.player:getCitys():setStartAutoBuild(1)
		local cmd = {count=0}
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getCitys():isStartAutoBuild(), false )
		assertEQ ( self.mm.params['sendInfo'], {self.player} )
	end;
})


tqAutoBuildsHandler_t_main = function(suite)
	suite:addTestCase(TestCaseAutoBuildsHandler, 'TestCaseAutoBuildsHandler')
	suite:addTestCase(TestCaseStartAutoBuildsHdr, 'TestCaseStartAutoBuildsHdr')
end;


