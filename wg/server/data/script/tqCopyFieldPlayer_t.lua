--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqCopyFieldPlayer')

local TestCaseCopyFieldPlayer = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		
		res_citydefs={{xianjing=1,gunmu=2,juma=3,leishi=4,nujian=5,walldef=2,wallhp=100,id=1}}
		res_copyfields={{name='一伙暴民',icon=101,taofadrop=7500001,level=1,dantiaodrop=7500001,needtime=8,heros={0,7600001,0,0,0},walllevel=0,lineup=180001,id=171001,citydefid=1}
								,{name='一伙暴民',icon=101,taofadrop=7500001,level=1,dantiaodrop=7500001,needtime=8,heros={7600001},heroName='hero', heroIcon=109, walllevel=0,lineup=180001,id=171002,citydefid=1}}
		self.copyFieldPlayer = CopyFieldPlayer(171001)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	testIsRole = function(self)
		assert ( self.copyFieldPlayer:isRole() == false )
	end;
	
	testGetRes = function(self)
		local res = self.copyFieldPlayer:getRes()
		assert( res.id == 171001 )
	end;
	
	testGetObjType = function(self)
		assert( self.copyFieldPlayer:getObjType() == OBJ_TYPE.COPYFIELD )
	end;
	
	testGetRoleId = function(self)
		assert( self.copyFieldPlayer:getRoleId() == 171001 )
	end;
	
	testGetIcon = function(self)
		assert( self.copyFieldPlayer:getIcon() == 101 )
	end;
	
	testGetCityPos = function(self)
		assert ( self.copyFieldPlayer:getCityPos().x == 0 )
		assert ( self.copyFieldPlayer:getCityPos().y == 0 )
	end;
	
	testGetAlliId = function(self)
		assert ( self.copyFieldPlayer:getAlliId() == 0 )
	end;
	
	testGetRoleName = function(self)
		assert ( self.copyFieldPlayer:getRoleName() == res_copyfields[1].name )
	end;
	
	testGetLevel = function(self)	
		assert ( self.copyFieldPlayer:getLevel() == 1 )
	end;
	
	testSendMsg = function(self)
		self.copyFieldPlayer:sendMsg('xxx')
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testGetCityDef = function(self)
		assert ( self.copyFieldPlayer:getCityDef() ~= nil )

		assert ( self.copyFieldPlayer:getCityDef():getDefNumber(CITYDEF_TYPE.XIANJING) == 1 )
		assert ( self.copyFieldPlayer:getCityDef():getDefNumber(CITYDEF_TYPE.GUNMU) == 2 )
		assert ( self.copyFieldPlayer:getCityDef():getDefNumber(CITYDEF_TYPE.JUMA) == 3 )
		assert ( self.copyFieldPlayer:getCityDef():getDefNumber(CITYDEF_TYPE.LEISHI) == 4 )
		assert ( self.copyFieldPlayer:getCityDef():getDefNumber(CITYDEF_TYPE.NUJIAN) == 5 )
	end;
	
	testGetWall = function(self)
		local wall = self.copyFieldPlayer:getWall()
		assert ( wall ~= nil )
		local hp, def = wall:getHPAndDEF()
		assert ( hp == 100 )
		assert ( def == 2 )
	end;
	
	testGetArmyMgr = function(self)
		assert ( self.copyFieldPlayer:getArmyContainer():getClass() == FieldArmyContainer )
		local defArmy = self.copyFieldPlayer:getArmyContainer():getDefArmy()
		assert ( defArmy.lineupId == 180001)
		assert ( defArmy.heroCount == 5 )
	end;
	
	testDefArmyHeros = function(self)
		local heroMgr = self.copyFieldPlayer:getHeroMgr()
		assert ( heroMgr:getHeroCount() == 1 )
		assert ( heroMgr:getHeroById(2) ~= nil )
	end;
	
	test_createHeroWithFixNameAndIcon = function(self)
		self.copyFieldPlayer = CopyFieldPlayer(171002)
		local heroMgr = self.copyFieldPlayer:getHeroMgr()
		assertEQ ( heroMgr:getHeroCount(), 1 )
		local hero = heroMgr:getHeroById(1)
		assertEQ ( hero ~= nil, true )
		assertEQ ( hero:getName(), 'hero' )
		assertEQ ( hero:getIcon(), 109 )
	end;
})


tqCopyFieldPlayer_t_main = function(suite)
	suite:addTestCase(TestCaseCopyFieldPlayer, 'TestCaseCopyFieldPlayer')
end;


