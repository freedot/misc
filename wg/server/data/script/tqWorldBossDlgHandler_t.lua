--*******************************************************************************
require('tqWorldBossDlgHandler')

local TestCaseRankRefreshDB = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		Service:getRankRefreshDB():clear()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getRefreshTime = function(self)
		clearLastSql_t()
		local expectSQL = "SELECT refreshTime FROM rankrefresh WHERE name='rankname';"
		assertEQ ( Service:getRankRefreshDB():getRefreshTime('rankname'), 0 )
		assertEQ ( getSql_t(1), expectSQL )
		
		local dbRecords = {
			{refreshTime=1000},
		}
		local queryDB = function(sql, dbrows)
			if sql == expectSQL then
				dbrows:setRecords(dbRecords)
			end
		end;
		app:regDBQuery(queryDB)
		
		clearLastSql_t()
		assertEQ ( Service:getRankRefreshDB():getRefreshTime('rankname'), 1000 )
		
		-- cacha when update
		Util:setTimeDrt(2000)
		Service:getRankRefreshDB():updateRefreshTime('rankname')
		
		clearLastSql_t()
		assertEQ ( Service:getRankRefreshDB():getRefreshTime('rankname'), 2000 )
	end;
	
	test_updateRefreshTime = function(self)
		clearLastSql_t()
		Util:setTimeDrt(2000)
		local expectSQL = "INSERT INTO rankrefresh VALUES('', 'rankname', '2000', '0', '0');"
		Service:getRankRefreshDB():updateRefreshTime('rankname')
		assertEQ ( getSql_t(2), expectSQL )
		
		local dbRecords = {
			{refreshTime=1000},
		}
		local queryDB = function(sql, dbrows)
			dbrows:setRecords(dbRecords)
		end;
		app:regDBQuery(queryDB)
		
		clearLastSql_t()
		local expectSQL2 = "UPDATE rankrefresh SET refreshTime=2000 WHERE name='rankname';"
		Service:getRankRefreshDB():updateRefreshTime('rankname')
		assertEQ ( getSql_t(2), expectSQL2 )
	end;
	
	test_getSortTime = function(self)
		clearLastSql_t()
		local expectSQL = "SELECT sortTime FROM rankrefresh WHERE name='rankname';"
		assertEQ ( Service:getRankRefreshDB():getSortTime('rankname'), 0 )
		assertEQ ( getSql_t(1), expectSQL )
		
		local dbRecords = {
			{sortTime=1000},
		}
		local queryDB = function(sql, dbrows)
			if sql == expectSQL then
				dbrows:setRecords(dbRecords)
			end
		end;
		app:regDBQuery(queryDB)
		
		clearLastSql_t()
		assertEQ ( Service:getRankRefreshDB():getSortTime('rankname'), 1000 )
		
		-- cacha when update
		Util:setTimeDrt(2000)
		Service:getRankRefreshDB():updateSortTime('rankname')
		
		clearLastSql_t()
		assertEQ ( Service:getRankRefreshDB():getSortTime('rankname'), 2000 )
	end;
	
	test_updateSortTime = function(self)
		clearLastSql_t()
		Util:setTimeDrt(2000)
		local expectSQL = "SELECT sortTime FROM rankrefresh WHERE name='rankname';"
		local expectSQL_1 = "SELECT sortTimes FROM rankrefresh WHERE name='rankname';"
		local expectSQL2 = "INSERT INTO rankrefresh VALUES('', 'rankname', '2000', '2000', '0');"
		Service:getRankRefreshDB():updateSortTime('rankname')
		assertEQ ( getSql_t(2), expectSQL2 )
		
		local dbRecords = {
			{sortTime=1000},
		}
		local dbRecords_1 = {
			{sortTimes=3},
		}
		local queryDB = function(sql, dbrows)
			if ( sql == expectSQL ) then
				dbrows:setRecords(dbRecords)
			elseif sql == expectSQL_1 then
				dbrows:setRecords(dbRecords_1)
			end
		end;
		app:regDBQuery(queryDB)
		
		clearLastSql_t()
		Service:getRankRefreshDB():clear()
		local expectSQL2_1 = "UPDATE rankrefresh SET sortTime=2000 WHERE name='rankname';"
		local expectSQL4 = "UPDATE rankrefresh SET sortTimes=4 WHERE name='rankname';"
		Service:getRankRefreshDB():updateSortTime('rankname')
		assertEQ ( getSql_t(2), expectSQL2_1 )
		assertEQ ( getSql_t(4), expectSQL4 )
		assertEQ ( Service:getRankRefreshDB():getSortTimes('rankname'), 4 )
	end;
	
	test_getSortTimes = function(self)
		clearLastSql_t()
		local expectSQL = "SELECT sortTimes FROM rankrefresh WHERE name='rankname';"
		assertEQ ( Service:getRankRefreshDB():getSortTimes('rankname'), 0 )
		assertEQ ( getSql_t(1), expectSQL )
		
		local dbRecords = {
			{sortTimes=3},
		}
		local queryDB = function(sql, dbrows)
			if sql == expectSQL then
				dbrows:setRecords(dbRecords)
			end
		end;
		app:regDBQuery(queryDB)
		
		clearLastSql_t()
		assertEQ ( Service:getRankRefreshDB():getSortTimes('rankname'), 3 )
	end;
})

local TestCaseRoleRankDB = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_addRoleBossHurt = function(self)
		clearLastSql_t()
		Service:getRoleRankDB():addRoleBossHurt(self.player, 1000)
		
		local expectSQL = "SELECT curWorldBossHurt FROM rolerank WHERE roleid=" .. self.player:getRoleId() .. ";"
		assertEQ ( getSql_t(1), expectSQL )
		assertEQ ( getSql_t(2), "INSERT INTO rolerank VALUES('" .. self.player:getRoleId() .. "','" .. self.player:getRoleName() .. "','0','1000','0');" )
	
		local dbRecords = {
			{curWorldBossHurt=1000},
		}
		local queryDB = function(sql, dbrows)
			if sql == expectSQL then
				dbrows:setRecords(dbRecords)
			else
				dbrows:setRecords({})
			end
		end;
		app:regDBQuery(queryDB)
		
		clearLastSql_t()
		Service:getRoleRankDB():addRoleBossHurt(self.player, 1200)
		assertEQ ( getSql_t(1), expectSQL )
		assertEQ ( getSql_t(2), "UPDATE rolerank SET curWorldBossHurt=1200 WHERE roleid=" .. self.player:getRoleId() .. ";" )
		
		clearLastSql_t()
		Service:getRoleRankDB():addRoleBossHurt(self.player, 1000)
		assertEQ ( getSql_t(1), expectSQL )
		assertEQ ( getSql_t(2), '' )
	end;
	
	test_sortWorldBossRank = function(self)
		clearLastSql_t()
		assertEQ ( Service:getRoleRankDB():sortWorldBossRank(), {} )
		assertEQ ( getSql_t(1), "UPDATE rolerank SET worldBossRank=0 WHERE worldBossRank>0;" )
		assertEQ ( getSql_t(2), "SELECT roleid, roleName, curWorldBossHurt FROM rolerank WHERE curWorldBossHurt>0 ORDER BY curWorldBossHurt DESC;" )
		
		local dbRecords = {
			{ roleid=10001, roleName='role1', curWorldBossHurt=30000},
			{ roleid=10002, roleName='role2', curWorldBossHurt=20000},
			{ roleid=10003, roleName='role3', curWorldBossHurt=10000},
		}
		local queryDB = function(sql, dbrows)
			dbrows:setRecords(dbRecords)
		end;
		app:regDBQuery(queryDB)
		
		clearLastSql_t()
		assertEQ ( Service:getRoleRankDB():sortWorldBossRank(), {{id=10001, name='role1', hurt=30000},{id=10002, name='role2', hurt=20000},{id=10003, name='role3', hurt=10000}} )
	end;
	
	test_lastWorldBossRank = function(self)
		clearLastSql_t()
		assertEQ ( Service:getRoleRankDB():lastWorldBossRank(), {} )
		assertEQ ( getSql_t(1), "SELECT roleid, roleName, lastWorldBossHurt FROM rolerank WHERE worldBossRank>0 ORDER BY worldBossRank;" )
		
		local dbRecords = {
			{ roleid=10001, roleName='role1', lastWorldBossHurt=30000},
			{ roleid=10002, roleName='role2', lastWorldBossHurt=20000},
			{ roleid=10003, roleName='role3', lastWorldBossHurt=15000},
		}
		local queryDB = function(sql, dbrows)
			dbrows:setRecords(dbRecords)
		end;
		app:regDBQuery(queryDB)
		clearLastSql_t()
		assertEQ ( Service:getRoleRankDB():lastWorldBossRank(), {{id=10001, name='role1', hurt=30000},{id=10002, name='role2', hurt=20000},{id=10003, name='role3', hurt=15000}} )
	end;
})

local TestCaseAllianceRankDB = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		self.player:setAlliId(self.alliance:getId())
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_addRoleBossHurt = function(self)
		clearLastSql_t()
		Service:getAllianceRankDB():addWorldBossHurt(self.player, 1000)
		local expectSQL = "SELECT curWorldBossHurt FROM allirank WHERE alliid=" .. self.player:getAlliId() .. ";"
		assertEQ ( getSql_t(1), expectSQL )
		assertEQ ( getSql_t(2), "INSERT INTO allirank VALUES('" .. self.alliance:getId() .. "','" .. self.alliance:getName() .. "','0','1000','0');" )

		local dbRecords = {
			{curWorldBossHurt=1000},
		}
		local queryDB = function(sql, dbrows)
			if sql == expectSQL then
				dbrows:setRecords(dbRecords)
			else
				dbrows:setRecords({})
			end
		end;
		app:regDBQuery(queryDB)
		
		clearLastSql_t()
		Service:getAllianceRankDB():addWorldBossHurt(self.player, 1200)
		assertEQ ( getSql_t(1), expectSQL )
		assertEQ ( getSql_t(2), "UPDATE allirank SET curWorldBossHurt=2200 WHERE alliid=" .. self.alliance:getId() .. ";" )
	end;
	
	test_sortWorldBossRank = function(self)
		clearLastSql_t()
		assertEQ ( Service:getAllianceRankDB():sortWorldBossRank(), {} )
		assertEQ ( getSql_t(1), "UPDATE allirank SET worldBossRank=0 WHERE worldBossRank>0;" )
		assertEQ ( getSql_t(2), "SELECT alliid, alliName, curWorldBossHurt FROM allirank WHERE curWorldBossHurt>0 ORDER BY curWorldBossHurt DESC;" )
		
		local dbRecords = {
			{ alliid=10001, alliName='alli1', curWorldBossHurt=30000},
			{ alliid=10002, alliName='alli2', curWorldBossHurt=20000},
			{ alliid=10003, alliName='alli3', curWorldBossHurt=10000},
		}
		local queryDB = function(sql, dbrows)
			dbrows:setRecords(dbRecords)
		end;
		app:regDBQuery(queryDB)
		
		clearLastSql_t()
		assertEQ ( Service:getAllianceRankDB():sortWorldBossRank(), {{id=10001, name='alli1', hurt=30000},{id=10002, name='alli2', hurt=20000},{id=10003, name='alli3', hurt=10000}} )
	end;
	
	test_lastWorldBossRank = function(self)
		clearLastSql_t()
		assertEQ ( Service:getAllianceRankDB():lastWorldBossRank(), {} )
		assertEQ ( getSql_t(1), "SELECT alliid, alliName, lastWorldBossHurt FROM allirank WHERE worldBossRank>0 ORDER BY worldBossRank;" )
		
		local dbRecords = {
			{ alliid=10001, alliName='alli1', lastWorldBossHurt=30000},
			{ alliid=10002, alliName='alli2', lastWorldBossHurt=20000},
			{ alliid=10003, alliName='alli3', lastWorldBossHurt=10000},
		}
		local queryDB = function(sql, dbrows)
			dbrows:setRecords(dbRecords)
		end;
		app:regDBQuery(queryDB)
		clearLastSql_t()
		assertEQ ( Service:getAllianceRankDB():lastWorldBossRank(), {{id=10001, name='alli1', hurt=30000},{id=10002, name='alli2', hurt=20000},{id=10003, name='alli3', hurt=10000}} )
	end;
	
	test_sortRank = function(self)
		clearLastSql_t()
		assertEQ ( Service:getAllianceRankDB():sortRank(), {} )
		assertEQ ( getSql_t(1), "SELECT allianceId, name, level, honour, lastLevel, lastHonour, rank FROM alliances ORDER BY level DESC, honour DESC;" )
		
		local dbRecords = {
			{ allianceId=10001, name='alli1', level=5, honour=30000, lastLevel=2, lastHonour=1000, rank= 2},
			{ allianceId=10002, name='alli2', level=4, honour=20000, lastLevel=2, lastHonour=1000, rank= 3},
			{ allianceId=10003, name='alli3', level=3, honour=10000, lastLevel=2, lastHonour=1000, rank= 1},
		}
		local queryDB = function(sql, dbrows)
			dbrows:setRecords(dbRecords)
		end;
		app:regDBQuery(queryDB)
		
		clearLastSql_t()
		assertEQ ( Service:getAllianceRankDB():sortRank(), {
			{ id=10001, name='alli1', level=5, honour=30000, lastLevel=5, lastHonour=30000, rank= 1},
			{ id=10002, name='alli2', level=4, honour=20000, lastLevel=4, lastHonour=20000, rank= 2},
			{ id=10003, name='alli3', level=3, honour=10000, lastLevel=3, lastHonour=10000, rank= 3},
			} )
	end;
	
	test_lastRank = function(self)
		clearLastSql_t()
		assertEQ ( Service:getAllianceRankDB():lastRank(), {} )
		assertEQ ( getSql_t(1), "SELECT allianceId, name, level, honour, lastLevel, lastHonour, rank FROM alliances ORDER BY rank;" )
		
		local dbRecords = {
			{ allianceId=10001, name='alli1', level=5, honour=30000, lastLevel=2, lastHonour=1000, rank= 1},
			{ allianceId=10002, name='alli2', level=4, honour=20000, lastLevel=2, lastHonour=1000, rank= 2},
			{ allianceId=10003, name='alli3', level=3, honour=10000, lastLevel=2, lastHonour=1000, rank= 3},
		}
		local queryDB = function(sql, dbrows)
			dbrows:setRecords(dbRecords)
		end;
		app:regDBQuery(queryDB)
		clearLastSql_t()
		assertEQ ( Service:getAllianceRankDB():lastRank(), {
			{ id=10001, name='alli1', level=5, honour=30000, lastLevel=2, lastHonour=1000, rank= 1},
			{ id=10002, name='alli2', level=4, honour=20000, lastLevel=2, lastHonour=1000, rank= 2},
			{ id=10003, name='alli3', level=3, honour=10000, lastLevel=2, lastHonour=1000, rank= 3},
			} )
	end;
})

local TestCaseCountryRankDB = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.player:setCityId(9900001)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_addRoleBossHurt = function(self)
		local expectSQL = "SELECT curWorldBossHurt FROM countryrank WHERE id=9900001;"
		local dbRecords = {
			{curWorldBossHurt=1000},
		}
		local queryDB = function(sql, dbrows)
			if sql == expectSQL then
				dbrows:setRecords(dbRecords)
			else
				dbrows:setRecords({})
			end
		end;
		app:regDBQuery(queryDB)
		
		clearLastSql_t()
		Service:getCountryRankDB():addWorldBossHurt(self.player, 1200)
		assertEQ ( getSql_t(1), expectSQL )
		assertEQ ( getSql_t(2), "UPDATE countryrank SET curWorldBossHurt=2200 WHERE id=9900001;" )
	end;
	
	test_sortWorldBossRank = function(self)
		Util:setTimeDrt(1405689740) 
			-- 星期五，计算出谁是最大一次击杀，刷新curtimes，清空curhurt，同时累计周伤害
			-- 返回上周的排行
			
		local expectSQL1 = "SELECT id, country, curWorldBossHurt, weekWorldBossHurt, curWorldBossHurtTimes FROM countryrank WHERE curWorldBossHurt>0 ORDER BY curWorldBossHurt DESC;"
		local expectSQL6 = "SELECT id, country, lastWorldBossHurtTimes FROM countryrank WHERE worldBossRank>0 ORDER BY worldBossRank;"		
		local expectSQL6_1 = "SELECT id, country, curWorldBossHurtTimes FROM countryrank ORDER BY curWorldBossHurtTimes DESC, weekWorldBossHurt DESC;"
		
		local dbRecords = {
			{ id=9900001, country='wei', curWorldBossHurt=30000, weekWorldBossHurt=20000, curWorldBossHurtTimes=2},
			{ id=9900002, country='shu', curWorldBossHurt=20000, weekWorldBossHurt=10000, curWorldBossHurtTimes=0},
			{ id=9900003, country='wu', curWorldBossHurt=10000, weekWorldBossHurt=60000, curWorldBossHurtTimes=1},
		}
		local dbRecords_lastRank = {
			{ id=9900003, country='wu', lastWorldBossHurtTimes=5},
			{ id=9900002, country='shu', lastWorldBossHurtTimes=4},
			{ id=9900001, country='wei', lastWorldBossHurtTimes=3},
		}
		local dbRecords_curRank = {
			{ id=9900003, country='wu', curWorldBossHurtTimes=3},
			{ id=9900002, country='shu', curWorldBossHurtTimes=2},
			{ id=9900001, country='wei', curWorldBossHurtTimes=0},
		}
		local queryDB = function(sql, dbrows)
			if sql == expectSQL1 then
				dbrows:setRecords(dbRecords)
			elseif  sql == expectSQL6 then
				dbrows:setRecords(dbRecords_lastRank)
			elseif  sql == expectSQL6_1 then
				dbrows:setRecords(dbRecords_curRank)
			end
		end;
		app:regDBQuery(queryDB)
		
		clearLastSql_t()
		assertEQ ( Service:getCountryRankDB():sortWorldBossRank(), {{id=9900003, name='wu', times=5},{id=9900002, name='shu', times=4},{id=9900001, name='wei', times=3}} )

		assertEQ ( getSql_t(1), expectSQL1 )
		
		local expectSQL2 = "UPDATE countryrank SET curWorldBossHurtTimes=3 WHERE id=9900001;"		
		assertEQ ( getSql_t(2), expectSQL2 )
		
		local expectSQL3 = "UPDATE countryrank SET curWorldBossHurt=0, weekWorldBossHurt=50000 WHERE id=9900001;"		
		assertEQ ( getSql_t(3), expectSQL3 )
		local expectSQL4 = "UPDATE countryrank SET curWorldBossHurt=0, weekWorldBossHurt=30000 WHERE id=9900002;"		
		assertEQ ( getSql_t(4), expectSQL4 )
		local expectSQL5 = "UPDATE countryrank SET curWorldBossHurt=0, weekWorldBossHurt=70000 WHERE id=9900003;"		
		assertEQ ( getSql_t(5), expectSQL5 )
		assertEQ ( getSql_t(6), expectSQL6 )
		
		
		clearLastSql_t()
		Util:setTimeDrt(1405689740 + 24*3600 + 24*3600) 
			-- 星期日，计算出谁是最大一次击杀，刷新curtimes，清空curhurt，同时累计周伤害，
		    -- 清空以前的排序
			-- 根据击杀次数和累计周伤害重新排序
			-- 将本周的击杀次数移动到上周，
			-- 将周伤害清空
		assertEQ ( Service:getCountryRankDB():sortWorldBossRank(), {{id=9900003, name='wu', times=5},{id=9900002, name='shu', times=4},{id=9900001, name='wei', times=3}} )	
		
		--local expectSQL6_1 = "UPDATE countryrank SET worldBossRank=0 WHERE worldBossRank>0;"
		--assertEQ ( getSql_t(6), expectSQL6_1 )
		
		assertEQ ( getSql_t(6), expectSQL6_1 )
		
		local expectSQL7 = "UPDATE countryrank SET lastWorldBossHurtTimes=3, curWorldBossHurtTimes=0, weekWorldBossHurt=0, worldBossRank=1 where id=9900003;"
		assertEQ ( getSql_t(7), expectSQL7 )
		local expectSQL8 = "UPDATE countryrank SET lastWorldBossHurtTimes=2, curWorldBossHurtTimes=0, weekWorldBossHurt=0, worldBossRank=2 where id=9900002;"
		assertEQ ( getSql_t(8), expectSQL8 )
		local expectSQL9 = "UPDATE countryrank SET lastWorldBossHurtTimes=0, curWorldBossHurtTimes=0, weekWorldBossHurt=0, worldBossRank=0 where id=9900001;"
		assertEQ ( getSql_t(9), expectSQL9 )
		assertEQ ( getSql_t(10), expectSQL6 )
	end;
})

local TestCaseRoleWorldBossRankSorter = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		local ranks = {}
		for i=1, 21 do
			local rank = {id=i, name='role' .. i, hurt=1000 + 21 - i}
			table.insert(ranks, rank)
		end
		self.mm:mock(Service:getRoleRankDB(), 'sortWorldBossRank', {ranks})
		
		self.sorter = RoleWorldBossRankSorter()
		self.sorter:sort()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getCount = function(self)
		assertEQ ( self.sorter:getCount(), 20 )
	end;
	
	test_get = function(self)
		assertEQ ( self.sorter:get(0), {id=1, name='role1', hurt=1000 + 20} )
		assertEQ ( self.sorter:get(1), {id=2, name='role2', hurt=1000 + 19} )
	end;
	
	test_getIdxByName = function(self)
		assertEQ ( self.sorter:getIdxByName('role1'), 0 )
		assertEQ ( self.sorter:getIdxByName('role20'), 19 )
		assertEQ ( self.sorter:getIdxByName('role21'), -1 )
		assertEQ ( self.sorter:getIdxByName('rolexxx'), -1 )
	end;
})

local TestCaseAllianceRankSorter = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		local ranks = {}
		for i=1, 21 do
			local rank = {id=i, name='alli' .. i}
			table.insert(ranks, rank)
		end
		self.mm:mock(Service:getAllianceRankDB(), 'sortRank', {ranks})
		
		self.sorter = AllianceRankSorter()
		self.sorter:sort()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getCount = function(self)
		assertEQ ( self.sorter:getCount(), 21 )
	end;
	
	test_get = function(self)
		assertEQ ( self.sorter:get(0), {id=1, name='alli1'} )
		assertEQ ( self.sorter:get(1), {id=2, name='alli2'} )
	end;
	
	test_getIdxByName = function(self)
		assertEQ ( self.sorter:getIdxByName('alli1'), 0 )
	end;
})

local TestCaseAllianceWorldBossRankSorter = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		local ranks = {}
		for i=1, 10 do
			local rank = {id=i, name='alli' .. i, hurt=1000 + 10 - i}
			table.insert(ranks, rank)
		end
		self.rt_ranks = {ranks}
		self.mm:mock(Service:getAllianceRankDB(), 'sortWorldBossRank', self.rt_ranks)
		
		self.sorter = AllianceWorldBossRankSorter()
		self.sorter:sort()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getCount = function(self)
		assertEQ ( self.sorter:getCount(), 9 )
	end;
	
	test_get = function(self)
		assertEQ ( self.sorter:get(0), {id=1, name='alli1', hurt=1000 + 9} )
		assertEQ ( self.sorter:get(1), {id=2, name='alli2', hurt=1000 + 8} )
	end;
	
	test_getIdxByName = function(self)
		assertEQ ( self.sorter:getIdxByName('alli1'), 0 )
		assertEQ ( self.sorter:getIdxByName('alli9'), 8 )
		assertEQ ( self.sorter:getIdxByName('alli10'), -1 )
		assertEQ ( self.sorter:getIdxByName('allixxx'), -1 )
	end;
	
	test_dropItems = function(self)
		local itemres = ItemResUtil:findItemres(5000043)
		
		Util:setTimeDrt(1000000)
		local alli1 = app:getAlliMgr():createAlliance(self.player, 'alli1', 'f')
		alli1:getItemPkg():addLastItem({resid=5000043, num=10})
		local alli2 = app:getAlliMgr():createAlliance(self.player, 'alli2', 'b')
	
		self.rt_ranks[1] = {{id=alli1:getId(), name='alli1', hurt=1000}, {id=alli2:getId(), name='alli2', hurt=900}}
		self.sorter:sort()
		assertEQ ( alli1:getItemPkg():getItemCount() > 0, true )
		assertEQ ( alli1:getItemPkg():getItemByIdx(0).resid, 5000043)
		assertEQ ( alli1:getItemPkg():getItemByIdx(0).num > 0, true)
		assertEQ ( alli1:getItemPkg():getItemByIdx(0).boss, 1)
		assertEQ ( alli1:getItemPkg():getItemByIdx(0).sptime, 1000000 + 23*3600)
		local itemres = ItemResUtil:findItemres(5000043)
		assertEQ ( alli1:getItemPkg():getItemByIdx(0).cur, itemres.startAuctionPrice*alli1:getItemPkg():getItemByIdx(0).num)
		assertEQ ( alli1:getItemPkg():getItemByIdx(0).fixed, itemres.fixedAuctionPrice*alli1:getItemPkg():getItemByIdx(0).num)
		assertEQ ( alli1:getItemPkg():getItemByIdx(0).buyer, '')
		assertEQ ( alli1:getItemPkg():getItemCount(), alli1:getItemPkg():getLastItemCount() )
		assertEQ ( alli1:getItemPkg():getItemByIdx(0), alli1:getItemPkg():getLastItemByIdx(0) ) 
		assertEQ ( alli1:getItemPkg():getItemByIdx(1), alli1:getItemPkg():getLastItemByIdx(1) ) 
		
		assertEQ ( alli2:getItemPkg():getItemCount() > 0, true )
	end;
})

local TestCaseCountryWorldBossRankSorter = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		local ranks = {}
		for i=1, 10 do
			local rank = {id=i, name='county' .. i, times=11 - i}
			table.insert(ranks, rank)
		end
		
		self.mm:mock(Service:getCountryRankDB(), 'sortWorldBossRank', {ranks})
		
		self.sorter = CountryWorldBossRankSorter()
		self.sorter:sort()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getCount = function(self)
		assertEQ ( self.sorter:getCount(), 3 )
	end;
	
	test_get = function(self)
		assertEQ ( self.sorter:get(0), {id=1, name='county1', times=10} )
		assertEQ ( self.sorter:get(1), {id=2, name='county2', times=9} )
	end;
	
	test_getIdxByName = function(self)
		assertEQ ( self.sorter:getIdxByName('county1'), 0 )
		assertEQ ( self.sorter:getIdxByName('county3'), 2 )
		assertEQ ( self.sorter:getIdxByName('county4'), -1 )
		assertEQ ( self.sorter:getIdxByName('countyxxx'), -1 )
	end;
})

local TestCaseWorldBossDlgHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = WorldBossDlgHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(1):getClass() , WorldBossGetInfoHandler )
	end;
})

local TestCaseWorldBossGetInfoHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = WorldBossDlgHandler():getHandler(1)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(WorldBossSender, 'sendEvents')
		self.mm:mock(WorldBossSender, 'sendTodayInfo')
		self.hdr:handle(self.player)
		assertEQ ( self.mm.params['sendEvents'], {self.player} )
		assertEQ ( self.mm.params['sendTodayInfo'], {self.player} )
	end;
})

local TestCaseExpedWorldBossHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.player:setRoleName('role')
		self.hdr = WorldBossDlgHandler():getHandler(2)
		TestCaseCondition:setPreCond(self.player, nil, { lineups={180001}, heros={{state=0,soldier={resid=150001001,number=1}},{state=1,soldier={resid=150001001,number=1}},{state=7,soldier={resid=150001001,number=1}} } })
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	helper_pre = function(self)
		self.mm:clear()
		Util:setTimeDrt(1000)
		self.player:setAlliId(1)
		self.player:getTask():getWorldBoss():setTodayTimes(0)
		self.cmdtb = {lineup=180001,count=5,hid1=1,hid2=2,hid3=3,hid4=0,hid5=0}
	end;
	
	test_handle = function(self)
		self.mm:mock(Service:getRoleRankDB(), 'addRoleBossHurt')
		self.mm:mock(Service:getAllianceRankDB(), 'addWorldBossHurt:addHurt1')
		self.mm:mock(Service:getCountryRankDB(), 'addWorldBossHurt:addHurt2')
		self.mm:mock(WorldBossSender, 'sendEvents')
		self.mm:mock(WorldBossSender, 'sendTodayInfo')
		self.mm:mock(WorldBossSender, 'sendFightDemo')
		
		local ExpeditionMgr_isValid = false
		local ExpedTimerHdrMgr_isValid = false
		local ExpedReturnTimerHdr_isValid = false
		local p_player = nil
		local p_cmdtb = nil
		self.mm:mock(ExpeditionMgr, 'handle', nil, function(selfObj, player, cmdtb)
			assertEQ ( player:getHeroMgr():getHeroById(1):getState(), 0)
			assertEQ ( player:getHeroMgr():getHeroById(2):getState(), 1)
			assertEQ ( player:getHeroMgr():getHeroById(3):getState(), 0)
			assertEQ ( cmdtb.isMemArmy, 1 )
			
			p_player = player
			p_cmdtb = cmdtb
			return ExpeditionMgr_isValid, {armyId=1}
		end)
		
		local sendOBs = { {'fightResult', 1}, {'isSuccess', false}, {'fightDemo', {armyId=1, fightId=2}} }
		self.mm:mock(ExpedTimerHdrMgr, 'handle', nil, function(selfObj, timerHdr, armyId)
			if ExpedTimerHdrMgr_isValid then
				for _, v in ipairs(sendOBs) do
					selfObj:observer(v[1], v[2])
				end
			end
			return ExpedTimerHdrMgr_isValid
		end)
		
		self.mm:mock(ExpedReturnTimerHdr, 'handle', nil, function(selfObj, timerHdr, armyId)
			return ExpedReturnTimerHdr_isValid
		end)
		
		self:helper_pre()
		ExpeditionMgr_isValid = true
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), false )
		
		self:helper_pre()
		ExpedTimerHdrMgr_isValid = true
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), false )
		
		self:helper_pre()
		ExpedReturnTimerHdr_isValid = true
		self.player:setAlliId(0)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), false )
		
		self:helper_pre()
		self.player:getTask():getWorldBoss():setTodayTimes(3)
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), false )
		
		self:helper_pre()
		assertEQ ( self.hdr:handle(self.player, self.cmdtb), true )
		assertEQ ( self.player:getTask():getWorldBoss():getTodayTimes(), 1 )
		assertEQ ( self.mm.params['addRoleBossHurt'], {self.player, 1} )
		assertEQ ( self.mm.params['addHurt1'], {self.player, 1} )
		assertEQ ( self.mm.params['addHurt2'], {self.player, 1} )
		assertEQ ( app:getAlliMgr():getWorldBossTmpEvents(), {{'role', 1, Util:getTime()}} )
		assertEQ ( self.mm.params['sendEvents'], {self.player} )
		assertEQ ( self.mm.params['sendTodayInfo'], {self.player} )
		assertEQ ( self.mm.params['sendFightDemo'], {self.player, {armyId=1, fightId=2}, 1} )
	end;
})

local TestCaseWorldBossGetTodayGiftHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = WorldBossDlgHandler():getHandler(3)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle_noThreeTimes = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs' )
		self.player:getTask():getWorldBoss():setTodayTimes(0)
		assertEQ ( self.hdr:handle(self.player), false)
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100188, ''} )
	end;
	
	test_handle_alreadyGotGift = function(self)
		Util:setTimeDrt(1405689740)
		self.player:getTask():getWorldBoss():setTodayTimes(3)
		self.player:getTask():getWorldBoss():setGotGift(1)
		assertEQ ( self.hdr:handle(self.player), false)
	end;
	
	test_handle_addItemToPkg = function(self)
		self.mm:mock(WorldBossSender, 'sendTodayInfo')
		Util:setTimeDrt(1405689740)
		self.player:getTask():getWorldBoss():setTodayTimes(3)
		self.player:getTask():getWorldBoss():setGotGift(0)
		self.player:getTask():getWorldBoss():setGuwuLevel(0)
		assertEQ ( self.hdr:handle(self.player), true)
		assertEQ ( self.player:getPkg():getItemNumber(3000308), 1 )
		assertEQ ( self.player:getTask():getWorldBoss():getGotGift(), 1 )
		assertEQ ( self.mm.params['sendTodayInfo'], {self.player} )
	end;
	
	test_handle_addItemToMail = function(self)
		self.mm:mock(app:getMailMgr(), 'addSysMail', {'mail'})
		self.mm:mock(MailSender, 'sendBriefMail' )
		
		self.player:getPkg():setMaxGridsCnt(0)
		Util:setTimeDrt(1405689740)
		self.player:getTask():getWorldBoss():setTodayTimes(3)
		self.player:getTask():getWorldBoss():setGotGift(0)
		self.player:getTask():getWorldBoss():setGuwuLevel(5)
		assertEQ ( self.hdr:handle(self.player), true)
		assertEQ ( self.player:getPkg():getItemNumber(3000310), 0 )
		
		local rawItems = DropItem():createRawItems({{resid=3000310,number=1}})
		assertEQ ( self.mm.params['addSysMail'], {self.player:getRoleName(), rstr.mail.title.sendItemNoEnoughPkg, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.sendItemNoEnoughPkg, rawItems} )
		assertEQ ( self.mm.params['sendBriefMail'], {self.player, 'mail'} )
	end;
})

local TestCaseWorldBossGuwuHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = WorldBossDlgHandler():getHandler(4)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle_invalidType = function(self)
		local cmd = {t=-1, times=1}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		cmd = {t=2, times=1}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handle_invalidTimes = function(self)
		local cmd = {t=0, times=0}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {t=0, times=11}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		self.player:getTask():getWorldBoss():setGuwuLevel(5)
		cmd = {t=0, times=6}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handle_noEnoughGold = function(self)
		local cmd = {t=0, times=1}
		self.player:getPkg():addGiftGold(40)
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handle_noEnoughGiftGold = function(self)
		local cmd = {t=1, times=1}
		self.player:getPkg():addGold(40)
		assertEQ ( self.hdr:handle(self.player, cmd), false )
	end;
	
	test_handle_guwuOneTimeByGoldType = function(self)
		self.mm:mock(WorldBossSender, 'sendTodayInfo')
		self.mm:mock(WUtil, 'sendSuccMsgArgs')
		local cmd = {t=0, times=1}
		self.player:getPkg():addGold(40)
		assertEQ ( self.player:getTask():getWorldBoss():getGuwuLevel(), 0 )
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getPkg():getGold(), 0 )
		assertEQ ( self.player:getTask():getWorldBoss():getGuwuLevel(), 1 )
		assertEQ ( self.mm.params['sendTodayInfo'], {self.player} )
		assertEQ ( self.mm.params['sendSuccMsgArgs'], {self.player, 100189, ''} )
	end;
	
	test_handle_guwuOneTimeByGiftGoldType_succ = function(self)
		self.mm:mock(math, 'random', {1})
		self.mm:mock(WorldBossSender, 'sendTodayInfo')
		self.mm:mock(WUtil, 'sendSuccMsgArgs')
		local cmd = {t=1, times=1}
		self.player:getPkg():addGiftGold(40)
		assertEQ ( self.player:getTask():getWorldBoss():getGuwuLevel(), 0 )
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getPkg():getGiftGold(), 0 )
		assertEQ ( self.player:getTask():getWorldBoss():getGuwuLevel(), 1 )
		assertEQ ( self.mm.params['sendSuccMsgArgs'], {self.player, 100189, ''} )
		assertEQ ( self.mm.params['sendTodayInfo'], {self.player} )
	end;
	
	test_handle_guwuOneTimeByGiftGoldType_fail = function(self)
		self.mm:mock(math, 'random', {0})
		self.mm:mock(WorldBossSender, 'sendTodayInfo')
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		local cmd = {t=1, times=1}
		self.player:getPkg():addGiftGold(40)
		assertEQ ( self.player:getTask():getWorldBoss():getGuwuLevel(), 0 )
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getPkg():getGiftGold(), 0 )
		assertEQ ( self.player:getTask():getWorldBoss():getGuwuLevel(), 0 )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100190, ''} )
		assertEQ ( self.mm.params['sendTodayInfo'], {self.player} )
	end;
	
	test_handle_guwuTimesByGiftGoldType = function(self)
		local random_times = 0
		self.mm:mock(math, 'random', nil, function() 
			random_times = random_times + 1
			if random_times < 3 then return 1
			else return 0 end
		end)
		
		self.mm:mock(WorldBossSender, 'sendTodayInfo')
		self.mm:mock(WUtil, 'sendPopBoxMsg')
		
		local cmd = {t=1, times=4}
		self.player:getPkg():addGiftGold(40*3)
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getPkg():getGiftGold(), 0 )
		assertEQ ( self.player:getTask():getWorldBoss():getGuwuLevel(), 2 )
		
		assertEQ ( self.mm.params['sendTodayInfo'], {self.player} )
		local s = string.format(rstr.worldboss.guwu.succ,1) .. '<br/>'
		s = s .. string.format(rstr.worldboss.guwu.succ,2) ..  '<br/>'
		s = s .. string.format(rstr.worldboss.guwu.fail, 3) ..  '<br/>'
		s = s .. string.format(rstr.worldboss.guwu.nogiftgold, 4) ..  '<br/>'
		assertEQ ( self.mm.params['sendPopBoxMsg'], {self.player, s} )
	end;
})

local TestCaseGetWorldBossPersonRankGiftHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = WorldBossDlgHandler():getHandler(5)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle_noInRank = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		assertEQ ( self.hdr:handle(self.player), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100191, ''} )
	end;
	
	test_handle_alreadyGot = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(Service:getRoleWorldBossRank(), 'getIdxByName', {1})
		self.mm:mock(Service:getRankRefreshDB(), 'getSortTime', {1000000})
		self.player:getTask():getWorldBoss():setPersonRankGiftTime(1000000)
		assertEQ ( self.hdr:handle(self.player), false )
		assertEQ ( self.mm.params['getIdxByName'], {self.player:getRoleName()} )
		assertEQ ( self.mm.params['getSortTime'], {Service:getRoleWorldBossRank():getRankName()} )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100193, ''} )
	end;
	
	test_handle_succ = function(self)
		Util:setTimeDrt(1000000 + 10)
		self.mm:mock(Service:getRoleWorldBossRank(), 'getIdxByName', {1})
		self.mm:mock(Service:getRankRefreshDB(), 'getSortTime', {1000000})
		self.mm:mock(WorldBossSender, 'sendTodayInfo')
		self.player:getTask():getWorldBoss():setPersonRankGiftTime(1000000 - 1)
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( self.player:getTask():getWorldBoss():getPersonRankGiftTime(), 1000000 + 10)
		assertEQ ( self.player:getPkg():getItemNumber(3000321), 1 )
		assertEQ ( self.mm.params['sendTodayInfo'], {self.player} )
	end;
})

local TestCaseGetWorldBossCountryRankGiftHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.player:setCityId(9900001)
		self.hdr = WorldBossDlgHandler():getHandler(6)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle_noInRank = function(self)
		self.mm:mock(Service:getCountryWorldBossRank(), 'getIdxByName', {-1})
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		assertEQ ( self.hdr:handle(self.player), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100192, ''} )
	end;
	
	test_handle_alreadyGot = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(Service:getCountryWorldBossRank(), 'getIdxByName', {1})
		self.mm:mock(Service:getRankRefreshDB(), 'getSortTime', {1000000})
		self.player:getTask():getWorldBoss():setCountryRankGiftTime(1000000)
		assertEQ ( self.hdr:handle(self.player), false )
		assertEQ ( self.mm.params['getIdxByName'], {country_names[9900001]} )
		assertEQ ( self.mm.params['getSortTime'], {Service:getCountryWorldBossRank():getRankName()} )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100193, ''} )
	end;
	
	test_handle_succ = function(self)
		Util:setTimeDrt(1000000 + 10)
		self.mm:mock(Service:getCountryWorldBossRank(), 'getIdxByName', {0})
		self.mm:mock(Service:getRankRefreshDB(), 'getSortTime', {1000000})
		self.mm:mock(WorldBossSender, 'sendTodayInfo')
		self.mm:mock(WUtil, 'sendSuccMsg')
		self.player:getTask():getWorldBoss():setCountryRankGiftTime(1000000 - 1)
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( self.player:getTask():getWorldBoss():getCountryRankGiftTime(), 1000000 + 10)
		local state = self.player:getStateContainer():getEffectState(RES_EFF.ZHANSHENZHIGUANG)
		assertEQ ( state ~= nil, true )
		assertEQ ( state:getEffectVal(), 3 )
		assertEQ ( state:getDuration(), 3*24*3600 )
		assertEQ ( self.mm.params['sendTodayInfo'], {self.player} )
		assertEQ ( self.mm.params['sendSuccMsg'], {self.player, string.format(rstr.zhanshenzhiguang,3)} )
	end;
})

local TestCaseWorldBossGetRankInfoHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = WorldBossDlgHandler():getHandler(7)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(WorldBossSender, 'sendRanks')
		self.mm:mock(WorldBossSender, 'sendTodayInfo')
		self.hdr:handle(self.player)
		assertEQ ( self.mm.params['sendRanks'], {self.player} )
		assertEQ ( self.mm.params['sendTodayInfo'], {self.player} )
	end;
})

local TestCaseWorldBossGetAlliGiftInfoHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = WorldBossDlgHandler():getHandler(8)
		self.alliance = app:getAlliMgr():createAlliance(self.player, 'alliance', 'f')
		self.player:setAlliId(self.alliance:getId())
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle_noInAlliance = function(self)
		self.player:setAlliId(0)
		assertEQ ( self.hdr:handle(self.player), false )
	end;
	
	test_handle = function(self)
		self.mm:mock(WorldBossSender, 'sendGetAlliGiftInfo')
		self.alliance:getItemPkg():addLastItem({resid=25000001, num=1})
		self.alliance:getItemPkg():addLastItem({resid=25000002, num=2})
		self.alliance:getItemPkg():addLastItem({resid=25000003, num=3})
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( self.mm.params['sendGetAlliGiftInfo'], {self.player} )
	end;
})



tqWorldBossDlgHandler_t_main = function(suite)
	suite:addTestCase(TestCaseRankRefreshDB, 'TestCaseRankRefreshDB')
	suite:addTestCase(TestCaseRoleRankDB, 'TestCaseRoleRankDB')
	suite:addTestCase(TestCaseAllianceRankDB, 'TestCaseAllianceRankDB')
	suite:addTestCase(TestCaseCountryRankDB, 'TestCaseCountryRankDB')
	suite:addTestCase(TestCaseRoleWorldBossRankSorter, 'TestCaseRoleWorldBossRankSorter')
	suite:addTestCase(TestCaseAllianceWorldBossRankSorter, 'TestCaseAllianceWorldBossRankSorter')
	suite:addTestCase(TestCaseCountryWorldBossRankSorter, 'TestCaseCountryWorldBossRankSorter')
	suite:addTestCase(TestCaseAllianceRankSorter, 'TestCaseAllianceRankSorter')
	suite:addTestCase(TestCaseWorldBossDlgHandler, 'TestCaseWorldBossDlgHandler')
	suite:addTestCase(TestCaseWorldBossGetInfoHandler, 'TestCaseWorldBossGetInfoHandler')
	suite:addTestCase(TestCaseExpedWorldBossHandler, 'TestCaseExpedWorldBossHandler')
	suite:addTestCase(TestCaseWorldBossGetTodayGiftHandler, 'TestCaseWorldBossGetTodayGiftHandler')
	suite:addTestCase(TestCaseWorldBossGuwuHandler, 'TestCaseWorldBossGuwuHandler')
	suite:addTestCase(TestCaseGetWorldBossPersonRankGiftHandler, 'TestCaseGetWorldBossPersonRankGiftHandler')
	suite:addTestCase(TestCaseGetWorldBossCountryRankGiftHandler, 'TestCaseGetWorldBossCountryRankGiftHandler')
	suite:addTestCase(TestCaseWorldBossGetRankInfoHandler, 'TestCaseWorldBossGetRankInfoHandler')
	suite:addTestCase(TestCaseWorldBossGetAlliGiftInfoHandler, 'TestCaseWorldBossGetAlliGiftInfoHandler')
end;


