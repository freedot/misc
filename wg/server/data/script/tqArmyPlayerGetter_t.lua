--*******************************************************************************
--*******************************************************************************
require('tqArmyPlayerGetter')

local TestCaseArmyPlayerGetter = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getPairBriefPlayer = function(self)
		local r_getBriefSourcePlayer = {NullPlayer}
		local r_getBriefTargetPlayer = {NullPlayer}
		self.mm:mock(ArmyPlayerGetter , '_getBriefSourcePlayer', r_getBriefSourcePlayer)
		self.mm:mock(ArmyPlayerGetter , '_getBriefTargetPlayer', r_getBriefTargetPlayer)
		
		local p_army = {armyId=1}
		assertEQ ( ArmyPlayerGetter:getPairBriefPlayer(p_army), false )
		assertEQ ( self.mm.params['_getBriefSourcePlayer'], {p_army} )
		
		r_getBriefSourcePlayer[1] = self.player
		assertEQ ( ArmyPlayerGetter:getPairBriefPlayer(p_army), false )
		assertEQ ( self.mm.params['_getBriefTargetPlayer'], {p_army} )
		
		r_getBriefTargetPlayer[1] = FieldPlayer(2)
		local ret, sourcePlayer, targetPlayer = ArmyPlayerGetter:getPairBriefPlayer(p_army)
		assertEQ ( sourcePlayer, r_getBriefSourcePlayer[1] )
		assertEQ ( targetPlayer, r_getBriefTargetPlayer[1] )
	end;
	
	test__getBriefSourcePlayer = function(self)
		self.mm:mock(ArmyPlayerGetter, '_getBriefPlayer', {self.player})
		local p_army = nil
		assertEQ ( ArmyPlayerGetter:_getBriefSourcePlayer(p_army), NullPlayer )
		p_army = {sourceType=1, sourceId=2}
		assertEQ ( ArmyPlayerGetter:_getBriefSourcePlayer(p_army), self.player )
		assertEQ ( self.mm.params['_getBriefPlayer'], {1,2} )
	end;
	
	test__getBriefTargetPlayer = function(self)
		self.mm:mock(ArmyPlayerGetter, '_getBriefPlayer', {self.player})
		local p_army = nil
		assertEQ ( ArmyPlayerGetter:_getBriefTargetPlayer(p_army), NullPlayer )
		p_army = {targetType=1, targetId=2}
		assertEQ ( ArmyPlayerGetter:_getBriefTargetPlayer(p_army), self.player )
		assertEQ ( self.mm.params['_getBriefPlayer'], {1,2} )
	end;
	
	test__getBriefPlayer = function(self)
		local r_getGridByRoleId = {nil}
		local r_getGridByGridId = {nil}
		self.mm:mock(app:getCityMgr(), 'getGridByRoleId', r_getGridByRoleId)
		self.mm:mock(app:getCityMgr(), 'getGridByGridId', r_getGridByGridId)
		self.mm:mock(BriefRolePlayer, 'new', {{name='rolePlayer'}})
		self.mm:mock(BriefCopyFieldPlayer, 'new', {{name='copyFieldPlayer'}})
		self.mm:mock(BriefFieldPlayer, 'new', {{name='fieldPlayer'}})
		
		local objType = OBJ_TYPE.NONE
		local objId = 1
		assertEQ ( ArmyPlayerGetter:_getBriefPlayer(objType, objId),  NullPlayer )
		
		objType = OBJ_TYPE.ROLE
		assertEQ ( ArmyPlayerGetter:_getBriefPlayer(objType, objId),  NullPlayer )
		assertEQ ( self.mm.params['getGridByRoleId'], {objId} )
		
		self.mm:clear()
		r_getGridByRoleId[1] = {name='grid', objType=OBJ_TYPE.NONE}
		assertEQ ( ArmyPlayerGetter:_getBriefPlayer(objType, objId),  NullPlayer )
		
		self.mm:clear()
		r_getGridByRoleId[1] = {name='grid', objType=OBJ_TYPE.ROLE}
		assertEQ ( ArmyPlayerGetter:_getBriefPlayer(objType, objId),  {name='rolePlayer'} )
		assertEQ ( self.mm.params['new'], {r_getGridByRoleId[1]} )
		
		self.mm:clear()
		objType = OBJ_TYPE.COPYFIELD
		assertEQ ( ArmyPlayerGetter:_getBriefPlayer(objType, objId),  {name='copyFieldPlayer'} )
		assertEQ ( self.mm.params['new'], {objId} )
		
		self.mm:clear()
		objType = OBJ_TYPE.FIELD
		assertEQ ( ArmyPlayerGetter:_getBriefPlayer(objType, objId),  NullPlayer )
		assertEQ ( self.mm.params['getGridByGridId'], {objId} )
		
		self.mm:clear()
		r_getGridByGridId[1] = {name='grid', objType=OBJ_TYPE.NONE}
		assertEQ ( ArmyPlayerGetter:_getBriefPlayer(objType, objId),  NullPlayer )
		
		self.mm:clear()
		r_getGridByGridId[1] = {name='grid', objType=OBJ_TYPE.FIELD}
		assertEQ ( ArmyPlayerGetter:_getBriefPlayer(objType, objId),  {name='fieldPlayer'} )
		assertEQ ( self.mm.params['new'], {r_getGridByGridId[1]} )
	end;
	
	testGetSourceAndTarget_sourceIsCopyFieldPlayer = function(self)
		local sourcePlayer = CopyFieldPlayer(171001)
		
		local targetPlayerId = 10000
		local targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', targetPlayerId)
		
		local sourceHeros = sourcePlayer:getArmyContainer():getSelfArmy().heros
		local army = app:getArmyMgr():addArmy(sourcePlayer, targetPlayer, 180001, sourceHeros, EXPED_TYPE.TAOFA, 10)
		
		assert ( ArmyPlayerGetter:getSourcePlayer(army):getRoleId() == 171001 )
		assert ( ArmyPlayerGetter:getTargetPlayer(army) == targetPlayer )
	end;
	
	testGetSourceAndTarget_sourceIsFieldPlayer = function(self)
		local sourcePlayer = FieldPlayer(2)
		
		local targetPlayerId = 10000
		local targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', targetPlayerId)
		
		local sourceHeros = sourcePlayer:getArmyContainer():getSelfArmy().heros
		local army = app:getArmyMgr():addArmy(sourcePlayer, targetPlayer, 180001, sourceHeros, EXPED_TYPE.TAOFA, 10)

		assert ( ArmyPlayerGetter:getSourcePlayer(army):getRoleId() == 2 )
	end;
	
	testGetPlayer_InvalidRoleId = function(self)
		local obj = ArmyPlayerGetter:getPlayer(OBJ_TYPE.ROLE, 1000000)
		assert ( obj == NullPlayer )
	end;
	
	testGetPlayer_InvalidFieldPlayerGrid = function(self)
		local obj = ArmyPlayerGetter:getPlayer(OBJ_TYPE.FIELD, 201)
		assert ( obj == NullPlayer )
	end;
	
	test_getOnlineSourcePlayer = function(self)
		self.mm:mock(ArmyPlayerGetter, 'getOnlinePlayer', {{name='onlinePlayer'}})
		
		assertEQ ( ArmyPlayerGetter:getOnlineSourcePlayer(nil), NullPlayer)
		assertEQ ( ArmyPlayerGetter:getOnlineSourcePlayer({sourceType= 1, sourceId = 2}), {name='onlinePlayer'})
		assertEQ ( self.mm.params['getOnlinePlayer'], {1, 2} )
	end;
	
	test_getOnlineTargetPlayer = function(self)
		self.mm:mock(ArmyPlayerGetter, 'getOnlinePlayer', {{name='onlinePlayer'}})
		
		assertEQ ( ArmyPlayerGetter:getOnlineTargetPlayer(nil), NullPlayer)
		assertEQ ( ArmyPlayerGetter:getOnlineTargetPlayer({targetType= 1, targetId = 2}), {name='onlinePlayer'})
		assertEQ ( self.mm.params['getOnlinePlayer'], {1, 2} )
	end;
	
	test_getOnlinePlayer = function(self)
		local r_getGridByGridId = {nil}
		self.mm:mock(ArmyPlayerGetter, '_getOnlineRolePlayer', {{name='player'}})
		self.mm:mock(app:getCityMgr(), 'getGridByGridId', r_getGridByGridId)
		
		local objType = OBJ_TYPE.ROLE
		local objId = 1
		assertEQ ( ArmyPlayerGetter:getOnlinePlayer(objType, objId), {name='player'})
		assertEQ ( self.mm.walkLog, '_getOnlineRolePlayer')
		assertEQ ( self.mm.params['_getOnlineRolePlayer'], {objId})
		
		self.mm:clear()
		objType = OBJ_TYPE.OWNERFIELD
		assertEQ ( ArmyPlayerGetter:getOnlinePlayer(objType, objId), NullPlayer)
		assertEQ ( self.mm.params['getGridByGridId'], {objId})
		
		self.mm:clear()
		r_getGridByGridId[1] = {roleId=2}
		assertEQ ( ArmyPlayerGetter:getOnlinePlayer(objType, objId), {name='player'})
		assertEQ ( self.mm.params['_getOnlineRolePlayer'], {2})
		
		objType = OBJ_TYPE.FIELD
		assertEQ ( ArmyPlayerGetter:getOnlinePlayer(objType, objId), {name='player'})
		
		objType = OBJ_TYPE.COPYFIELD
		assertEQ ( ArmyPlayerGetter:getOnlinePlayer(objType, objId), NullPlayer)
	end;
	
	test__getOnlineRolePlayer = function(self)
		local r_getGridByRoleId = {nil}
		local r_getPlayerByName = {nil}
		self.mm:mock(app:getCityMgr(), 'getGridByRoleId', r_getGridByRoleId)
		self.mm:mock(app:getPlayerMgr(), 'getPlayerByName', r_getPlayerByName)
		
		objType = OBJ_TYPE.ROLE
		assertEQ ( ArmyPlayerGetter:_getOnlineRolePlayer(objType, objId), NullPlayer )
		assertEQ ( self.mm.params['getGridByRoleId'], {1} )
		
		r_getGridByRoleId[1] = {userName='playerName'}
		assertEQ ( ArmyPlayerGetter:_getOnlineRolePlayer(objType, objId), NullPlayer )
		assertEQ ( self.mm.params['getPlayerByName'], {'playerName'} )
		
		r_getPlayerByName[1] = {name='player'}
		assertEQ ( ArmyPlayerGetter:_getOnlineRolePlayer(objType, objId), {name='player'} )
	end;
})


tqArmyPlayerGetter_t_main = function(suite)
	suite:addTestCase(TestCaseArmyPlayerGetter, 'TestCaseArmyPlayerGetter')
end;


