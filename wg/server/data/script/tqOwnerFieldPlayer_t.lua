--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqOwnerFieldPlayer')

local TestCaseOwnerFieldPlayer = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	createOwnerFieldPlayer = function(self)
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('owner', 'owner_r', 200000)
		self.sourcePlayer:setIcon(101)
		TestCaseCondition:setPreCond(self.sourcePlayer, nil, { lineups={180001,180002}, heros={{state=1,soldier={resid=150001010,number=10}},{state=1,soldier={resid=150002005,number=10}} } })
		local _, _, armyId, _ = TestArmyResHelper:createArmy(self.sourcePlayer, FieldPlayer(2), EXPED_TYPE.TAOFA, ARMYDYN_STATE.DISPATCH)
		self.ownerArmy = app:getArmyMgr():getArmyById(armyId)
		GridsMgr.grids[2].roleId = 200000
		return OwnerFieldPlayer(2)
	end;
	
	testCreateFail_invalidGrid = function(self)
		local OwnerFieldPlayer = OwnerFieldPlayer(-1)
		assert ( OwnerFieldPlayer:getObjType() == OBJ_TYPE.NONE )
	end;
	
	testCreateFail_invalidObjectType = function(self)
		local OwnerFieldPlayer = OwnerFieldPlayer(1)
		assert ( OwnerFieldPlayer:getObjType() == OBJ_TYPE.NONE )
	end;
	
	testCreateFail_invalidRoleIdIsZero = function(self)
		local OwnerFieldPlayer = OwnerFieldPlayer(2)
		assert ( OwnerFieldPlayer:getObjType() == OBJ_TYPE.NONE )
	end;
	
	testCreateFail_invalidOwnerRoleGrid = function(self)
		GridsMgr.grids[2].roleId = 10000
		local OwnerFieldPlayer = OwnerFieldPlayer(2)
		assert ( OwnerFieldPlayer:getObjType() == OBJ_TYPE.NONE )
	end;
	
	testCreateOk_emptyArmy = function(self)
		self.sourcePlayer = TestCaseHelper:loadPlayerByUserNameEx('owner', 'owner_r', 200000)
		GridsMgr.grids[2].roleId = 200000
		local OwnerFieldPlayer = OwnerFieldPlayer(2)
		assert ( OwnerFieldPlayer:getObjType() == OBJ_TYPE.OWNERFIELD )
		assert ( OwnerFieldPlayer:getArmyContainer():getDefArmy().lineupId == 180001 )
		assert ( OwnerFieldPlayer:getArmyContainer():getDefArmy().heros[1] == 0 )
		assert ( OwnerFieldPlayer:getArmyContainer():getDefArmy().heros[2] == 0 )
		assert ( OwnerFieldPlayer:getArmyContainer():getDefArmy().heros[3] == 0 )
		assert ( OwnerFieldPlayer:getArmyContainer():getDefArmy().heros[4] == 0 )
		assert ( OwnerFieldPlayer:getArmyContainer():getDefArmy().heros[5] == 0 )
	end;
	
	testCreateOk_hasArmy = function(self)
		local ownerFieldPlayer = self:createOwnerFieldPlayer()
		assert ( ownerFieldPlayer:getObjType() == OBJ_TYPE.OWNERFIELD )
		assert ( ownerFieldPlayer:getArmyContainer():getDefArmy().lineupId == 180001 )
		assert ( ownerFieldPlayer:getArmyContainer():getDefArmy().heros[1] == 1 )
		assert ( ownerFieldPlayer:getArmyContainer():getDefArmy().heros[2] == 2 )
		assert ( ownerFieldPlayer:getArmyContainer():getDefArmy().heros[3] == 0 )
		assert ( ownerFieldPlayer:getArmyContainer():getDefArmy().heros[4] == 0 )
		assert ( ownerFieldPlayer:getArmyContainer():getDefArmy().heros[5] == 0 )
	end;
	
	testGetCityDef = function(self)
		local ownerFieldPlayer = self:createOwnerFieldPlayer()
		local cityDef = ownerFieldPlayer:getCityDef()
		assert ( cityDef:getDefNumber(CITYDEF_TYPE.XIANJING) == 0 )
		assert ( cityDef:getDefNumber(CITYDEF_TYPE.GUNMU) == 0 )
		assert ( cityDef:getDefNumber(CITYDEF_TYPE.JUMA) == 0 )
		assert ( cityDef:getDefNumber(CITYDEF_TYPE.LEISHI) == 0 )
		assert ( cityDef:getDefNumber(CITYDEF_TYPE.NUJIAN) == 0 )
	end;
	
	testGetWall = function(self)
		local ownerFieldPlayer = self:createOwnerFieldPlayer()
		local wall = ownerFieldPlayer:getWall()
		assert ( wall ~= nil )
		local hp, def = wall:getHPAndDEF()
		assert ( hp == 0 )
		assert ( def == 0 )	
	end;
	
	testGetIcon = function(self)
		local ownerFieldPlayer = self:createOwnerFieldPlayer()
		assert ( ownerFieldPlayer:getIcon() == 101 )
	end;
	
	testGetGridId = function(self)
		local ownerFieldPlayer = self:createOwnerFieldPlayer()
		assert ( ownerFieldPlayer:getGridId() == 2 )
	end;
	
	test_getRoleId = function(self)
		local ownerFieldPlayer = self:createOwnerFieldPlayer()
		assert ( ownerFieldPlayer:getRoleId() == 2 )
	end;
	
	testGetOwnerPlayer = function(self)
		local ownerFieldPlayer = self:createOwnerFieldPlayer()
		assert ( ownerFieldPlayer:getOwnerPlayer() == self.sourcePlayer )
	end;
	
	testGetOwnerArmy = function(self)
		local ownerFieldPlayer = self:createOwnerFieldPlayer()
		assert ( ownerFieldPlayer:getOwnerArmy() == self.ownerArmy )
	end;
})


tqOwnerFieldPlayer_t_main = function(suite)
	suite:addTestCase(TestCaseOwnerFieldPlayer, 'TestCaseOwnerFieldPlayer')
end;


