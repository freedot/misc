--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqFieldPlayer')

local TestCaseFieldPlayer = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		
		res_citydefs={{xianjing=1,gunmu=2,juma=3,leishi=4,nujian=5,walldef=2,wallhp=100,id=1}}
		res_fields_level={{zhanlingdrop=7500001,level=1,icon=101,addstone=0,citydefid=1,dantiaodrop=7500001,addwood=0,gem=0,heros={7600001},addiron=0,lineup=180001,id=170001001,addfood=15,taofadrop=7500001}}
		local fieldGridId = 2
		self.fieldPlayer = FieldPlayer(fieldGridId)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	testIsRole = function(self)
		assert ( self.fieldPlayer:isRole() == false )
	end;
	
	testGetRes = function(self)
		local res = self.fieldPlayer:getRes()
		assert( res.id == 170001001 )
	end;
	
	testGetIcon = function(self)
		assert( self.fieldPlayer:getIcon() == 101 )
	end;
	
	testGetRoleId = function(self)
		assert( self.fieldPlayer:getRoleId() == 2 )
	end;
	
	testGetObjType = function(self)
		assert( self.fieldPlayer:getObjType() == OBJ_TYPE.FIELD )
	end;
	
	testGetCityPos = function(self)
		-- fieldGridId is 2, map to (1, 0) coordinate.
		assert ( self.fieldPlayer:getCityPos().x == 1 )
		assert ( self.fieldPlayer:getCityPos().y == 0 )
	end;
	
	testGetAlliId = function(self)
		assert ( self.fieldPlayer:getAlliId() == 0 )
	end;
	
	testGetRoleName = function(self)
		assert ( self.fieldPlayer:getRoleName() == string.format(rstr.fieldplayer.levelname, 1, res_fields[1].name) ) 
	end;
	
	testGetLevel = function(self)	
		assert ( self.fieldPlayer:getLevel() == 1 )
	end;
	
	testSendMsg = function(self)
		self.fieldPlayer:sendMsg('xxx')
		assert ( getSendMsgCnt_t() == 0 )
	end;
	
	testGetCityDef = function(self)
		assert ( self.fieldPlayer:getCityDef() ~= nil )
		assert ( self.fieldPlayer:getCityDef():getDefNumber(CITYDEF_TYPE.XIANJING) == 1 )
		assert ( self.fieldPlayer:getCityDef():getDefNumber(CITYDEF_TYPE.GUNMU) == 2 )
		assert ( self.fieldPlayer:getCityDef():getDefNumber(CITYDEF_TYPE.JUMA) == 3 )
		assert ( self.fieldPlayer:getCityDef():getDefNumber(CITYDEF_TYPE.LEISHI) == 4 )
		assert ( self.fieldPlayer:getCityDef():getDefNumber(CITYDEF_TYPE.NUJIAN) == 5 )
	end;
	
	testGetWall = function(self)
		local wall = self.fieldPlayer:getWall()
		assert ( wall ~= nil )
		local hp, def = wall:getHPAndDEF()
		assert ( hp == 100 )
		assert ( def == 2 )
	end;
	
	testGetArmyMgr = function(self)
		assert ( self.fieldPlayer:getArmyContainer():getClass() == FieldArmyContainer )
		local defArmy = self.fieldPlayer:getArmyContainer():getDefArmy()
		assert ( defArmy.lineupId == 180001)
		assert ( defArmy.heroCount == 5)
	end;
	
	testDefArmyHeros = function(self)
		local heroMgr = self.fieldPlayer:getHeroMgr()
		assert ( heroMgr:getHeroCount() == 1 )
		assert ( heroMgr:getHeroById(1) ~= nil )
	end;
	
	testGetFriendMgr = function(self)
		assert ( self.fieldPlayer:getFriendMgr() == NullFriendMgr )
	end;
})

tqFieldPlayer_t_main = function(suite)
	suite:addTestCase(TestCaseFieldPlayer, 'TestCaseFieldPlayer')
end;


