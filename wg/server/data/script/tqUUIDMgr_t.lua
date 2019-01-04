--*******************************************************************************
require('tqUUIDMgr')

local TestCaseUUIDMgr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		UUIDMgr.uuids.allianceId = 0
		UUIDMgr.uuids.armyId = 0
		UUIDMgr.uuids.itemId = 0
		UUIDMgr.uuids.mailId = 0
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_load = function(self)
		local expectSQL = "select * from uuids;"
		local dbRecords = {
			{id=1, name='allianceId', uuid=10}
			,{id=2, name='armyId', uuid=20}
			,{id=3, name='itemId', uuid=30}
			,{id=4, name='mailId', uuid=40}
		}
		local queryDB = function(sql, dbrows)
			if sql == expectSQL then
				dbrows:setRecords(dbRecords)
			else
				dbrows:setRecords({})
			end
		end;
		app:regDBQuery(queryDB)
		
		UUIDMgr:load()
		assertEQ ( UUIDMgr.uuids.allianceId, 10)
		assertEQ ( UUIDMgr.uuids.armyId, 20)
		assertEQ ( UUIDMgr.uuids.itemId, 30)
		assertEQ ( UUIDMgr.uuids.mailId, 40)
	end;
	
	testNewArmyId = function(self)
		assert ( UUIDMgr:newArmyId() == 1 )
		assert ( getLastSql_t() == 'update uuids set uuid=1 where name=\'armyId\';' )
	end;
	
	testNewItemId = function(self)
		assert ( UUIDMgr:newItemId() == 1 )
		assert ( getLastSql_t() == 'update uuids set uuid=1 where name=\'itemId\';' )
	end;
	
	test_newAllianceId = function(self)
		assert ( UUIDMgr:newAllianceId() == 1 )
		assert ( getLastSql_t() == 'update uuids set uuid=1 where name=\'allianceId\';' )
	end;
	
	testBackItemId = function(self)
		UUIDMgr:backItemId() 
		UUIDMgr:newItemId()
		UUIDMgr:restoreItemId() 
		assert ( getLastSql_t() == 'update uuids set uuid=0 where name=\'itemId\';' )
	end;
	
	test__newUUID = function(self)
		UUIDMgr.uuids.armyId = 2
		assertEQ ( UUIDMgr:_newUUID('armyId'), global.makeInt64(SPub:GetZoneId(), 3) )
		
		UUIDMgr.uuids.armyId = 0xffffffff
		assertEQ ( UUIDMgr:_newUUID('armyId'), global.makeInt64(SPub:GetZoneId(), 1) )
		assert ( getLastSql_t() == 'update uuids set uuid=1 where name=\'armyId\';' )
	end;
})

tqUUIDMgr_t_main = function(suite)
	suite:addTestCase(TestCaseUUIDMgr, 'TestCaseUUIDMgr')
end;

