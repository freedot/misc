--*******************************************************************************
require('tqOpenSvrAct')

local MockFile = Class:extends({
	init = function(self)
		self._filePath = ''
		self._mod = ''
		self._s = ''
	end;
	
	open = function(self, filePath, mod)
		self._filePath = filePath
		self._mod = mod
		if self._mod ~= 'a' then
			self._s = ''
		end
	end;

	write = function(self, s)
		if self._mod == 'a' then
			self._s = self._s .. s
		else 
			self._s = s
		end
	end;
	
	read = function(self)
		return self._s
	end;

	close = function(self)
	end;
	
	getParams = function(self)
		return self._filePath, self._mod
	end;
})

local TestCaseSvrVarDB = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		Service:getSvrVarDB():clearCache()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getValue = function(self)
		clearLastSql_t()
		local expectSQL = "SELECT var FROM svrvar WHERE name='opensvract';"
		assertEQ ( Service:getSvrVarDB():getValue('opensvract'), 0 )
		assertEQ ( getSql_t(1), expectSQL )
		
		Service:getSvrVarDB():clearCache()
		
		local dbRecords = {
			{var=1},
		}
		local queryDB = function(sql, dbrows)
			if sql == expectSQL then
				dbrows:setRecords(dbRecords)
			end
		end;
		app:regDBQuery(queryDB)
		
		clearLastSql_t()
		assertEQ ( Service:getSvrVarDB():getValue('opensvract'), 1 )
	end;
	
	test_setValue = function(self)
		clearLastSql_t()
		Util:setTimeDrt(2000)
		local expectSQL = "INSERT INTO svrvar VALUES('opensvract', '1');"
		Service:getSvrVarDB():setValue('opensvract', 1)
		assertEQ ( getSql_t(2), expectSQL )
		
		Service:getSvrVarDB():clearCache()
		
		local expectSQL = "SELECT var FROM svrvar WHERE name='opensvract';"
		local dbRecords = {
			{var=0},
		}
		local queryDB = function(sql, dbrows)
			if sql == expectSQL then
				dbrows:setRecords(dbRecords)
			end
		end;
		app:regDBQuery(queryDB)
		clearLastSql_t()
		local expectSQL2 = "UPDATE svrvar SET var=1 WHERE name='opensvract';"
		Service:getSvrVarDB():setValue('opensvract', 1)
		assertEQ ( getSql_t(2), expectSQL2 )	
	end;
	
	test_setValue_cache = function(self)
		assertEQ ( Service:getSvrVarDB():getValue('opensvract'), 0 )
		Service:getSvrVarDB():setValue('opensvract', 1)
		assertEQ ( Service:getSvrVarDB():getValue('opensvract'), 1 )
	end;
})


local TestCaseOpenSvrAct = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.svrAct = OpenSvrAct(app)
		global.initTimer()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_recordWhenHasFiveHighHero = function(self)
		self.player:setRoleName('role1')
		local mfile = MockFile()
		self.mm:mock(MyFile, 'new', {mfile})
		Service:getSvrVarDB():setValue('opensvract', 0)
		self.svrAct:recordWhenHasFiveHighHero(self.player)
		assertEQ ( mfile:read(), '' )
		
		self.mm:restore()
		
		TestCaseCondition:setPreCond(self.player, nil, { heros=
			{
				{state=0,soldier={resid=150001001,number=1}}
				,{state=0,soldier={resid=150001001,number=1}}
				,{state=0,soldier={resid=150001001,number=1}} 
				,{state=0,soldier={resid=150001001,number=1}} 
				,{state=0,soldier={resid=150001001,number=1}} 
			} })
		
		self.mm:mock(MyFile, 'new', {mfile})
		self.svrAct:recordWhenHasFiveHighHero(self.player)
		assertEQ ( mfile:read(), 'role1,' )
		self.svrAct:recordWhenHasFiveHighHero(self.player)
		assertEQ ( mfile:read(), 'role1,role1,' )
		
		Service:getSvrVarDB():setValue('opensvract', 1)
		self.svrAct:recordWhenHasFiveHighHero(self.player)
		assertEQ ( mfile:read(), 'role1,role1,' )
		local path, mod = mfile:getParams()
		assertEQ ( path, global.getLogBasePath() .. '/' .. global.getSvrNameId() .. '_highfiveheros.log' )
		assertEQ ( mod, 'a' )
	end;
	
	test_startOpenSvrAct_startedBefore = function(self)
		self.mm:mock(ActTaskUtil, 'getOpenSvrActTime', {1379520000 + 100})
		self.mm:mock(Service:getSvrVarDB(), 'setValue')
		self.mm:mock(Service:getSvrVarDB(), 'getValue', {1})
		
		Util:setTimeDrt(1379520000)
		os.setClockMs(0)
		self.svrAct:start()
		assertStrRepeatCount(self.mm.walkLog, 'setValue', 0) 
		
		self.mm:clear()
		Util:setTimeDrt(1379520000 + 100 )
		os.setClockMs(100*1000)
		global.getTimer():update()
		assertStrRepeatCount(self.mm.walkLog, 'setValue', 0) 
	end;
	
	test_startOpenSvrAct_sendActTowerRankGift_noStartedBefore = function(self)
		local role1 = TestCaseHelper:loadPlayerByUserNameEx('user1', 'role1', 100002)
	
		self.mm:mock(ActTaskUtil, 'getOpenSvrActTime', {1379520000 + 100})
		self.mm:mock(Service:getSvrVarDB(), 'getValue', {0})
		self.mm:mock(Service:getSvrVarDB(), 'setValue')
		local r_ranks = {{{roleName='role1'},{roleName='role2'},{roleName='role3'},{roleName='role4'},{roleName='role5'}}}
		self.mm:mock(app:getActTowerRank(), 'selectRanks', r_ranks)
		self.mm:mock(app:getRoleRank(), 'selectRanks:role_selectRanks', {{}})
		
		self.mm:mock(app:getMailMgr(), 'addSysMail', {'mail'})
		self.mm:mock(MailSender, 'sendBriefMail')
		
		Util:setTimeDrt(1379520000)
		os.setClockMs(0)
		self.svrAct:start()
		assertStrRepeatCount(self.mm.walkLog, 'setValue', 0) 
		
		self.mm:clear()
		Util:setTimeDrt(1379520000 + 100 )
		os.setClockMs(100*1000)
		global.getTimer():update()
		assertEQ ( global.getTimer():isStoped(), true )
		assertEQ ( self.mm.params['setValue'], {'opensvract', 1} )
		assertEQ ( self.mm.params['selectRanks'], {1, 100} )
		assertStrRepeatCount(self.mm.walkLog, 'addSysMail', 5) 
		assertStrRepeatCount(self.mm.walkLog, 'sendBriefMail', 1) 
		local res1 = res_opensvract_tower[1]
		assertEQ ( self.mm.params['addSysMail.1'], {'role1', res1.mailtitle, FIXID.COMM_SYS_MAILTEMP, res1.mailcon, {RawItemEx({id=1, resId=res1.itemid, number=res1.itemnumber})} } )
		local res4 = res_opensvract_tower[4]
		assertEQ ( self.mm.params['addSysMail.4'], {'role4', res4.mailtitle, FIXID.COMM_SYS_MAILTEMP, res4.mailcon, {RawItemEx({id=1, resId=res4.itemid, number=res4.itemnumber})} } )
		assertEQ ( self.mm.params['addSysMail.5'], {'role5', res4.mailtitle, FIXID.COMM_SYS_MAILTEMP, res4.mailcon, {RawItemEx({id=1, resId=res4.itemid, number=res4.itemnumber})} } )
		assertEQ ( self.mm.params['sendBriefMail'], {role1, 'mail'})
	end;
	
	test_startOpenSvrAct_sendRoleRankGift_noStartedBefore = function(self)
		local role1 = TestCaseHelper:loadPlayerByUserNameEx('user1', 'role1', 100002)
	
		self.mm:mock(ActTaskUtil, 'getOpenSvrActTime', {1379520000 + 100})
		self.mm:mock(Service:getSvrVarDB(), 'getValue', {0})
		self.mm:mock(Service:getSvrVarDB(), 'setValue')
		local r_ranks = {{{roleName='role1'},{roleName='role2'},{roleName='role3'},{roleName='role4'},{roleName='role5'}}}
		self.mm:mock(app:getRoleRank(), 'selectRanks', r_ranks)
		self.mm:mock(app:getActTowerRank(), 'selectRanks:tower_selectRanks', {{}})
		
		self.mm:mock(app:getMailMgr(), 'addSysMail', {'mail'})
		self.mm:mock(MailSender, 'sendBriefMail')
		
		Util:setTimeDrt(1379520000)
		os.setClockMs(0)
		self.svrAct:start()
		assertStrRepeatCount(self.mm.walkLog, 'setValue', 0) 
		
		self.mm:clear()
		Util:setTimeDrt(1379520000 + 100 )
		os.setClockMs(100*1000)
		global.getTimer():update()
		assertEQ ( global.getTimer():isStoped(), true )
		assertEQ ( self.mm.params['setValue'], {'opensvract', 1} )
		assertEQ ( self.mm.params['selectRanks'], {1, 10} )
		assertStrRepeatCount(self.mm.walkLog, 'addSysMail', 5) 
		assertStrRepeatCount(self.mm.walkLog, 'sendBriefMail', 1) 
		local res1 = res_opensvract_role[1]
		assertEQ ( self.mm.params['addSysMail.1'], {'role1', res1.mailtitle, FIXID.COMM_SYS_MAILTEMP, res1.mailcon, {RawItemEx({id=1, resId=res1.itemid, number=res1.itemnumber})} } )
		local res4 = res_opensvract_role[4]
		assertEQ ( self.mm.params['addSysMail.4'], {'role4', res4.mailtitle, FIXID.COMM_SYS_MAILTEMP, res4.mailcon, {RawItemEx({id=1, resId=res4.itemid, number=res4.itemnumber})} } )
		assertEQ ( self.mm.params['addSysMail.5'], {'role5', res4.mailtitle, FIXID.COMM_SYS_MAILTEMP, res4.mailcon, {RawItemEx({id=1, resId=res4.itemid, number=res4.itemnumber})} } )
		assertEQ ( self.mm.params['sendBriefMail'], {role1, 'mail'})
	end;
	
	test_startOpenSvrAct_sendAllianceRankGift_noStartedBefore = function(self)
		TestCreateSortedAlliancesHelper()
		
		self.mm:mock(ActTaskUtil, 'getOpenSvrActTime', {1379520000 + 100})
		self.mm:mock(Service:getSvrVarDB(), 'getValue', {0})
		self.mm:mock(app:getRoleRank(), 'selectRanks:role_selectRanks', {{}})
		self.mm:mock(app:getActTowerRank(), 'selectRanks:tower_selectRanks', {{}})
		
		self.mm:mock(app:getMailMgr(), 'addSysMail', {'mail'})
		self.mm:mock(MailSender, 'sendBriefMail')
		
		Util:setTimeDrt(1379520000)
		os.setClockMs(0)
		self.svrAct:start()
		
		self.mm:clear()
		Util:setTimeDrt(1379520000 + 100 )
		os.setClockMs(100*1000)
		global.getTimer():update()
		assertStrRepeatCount(self.mm.walkLog, 'addSysMail', 4) 
		assertStrRepeatCount(self.mm.walkLog, 'sendBriefMail', 4) 
		local res1 = res_opensvract_alli[1]
		assertEQ ( self.mm.params['addSysMail.1'], {'role_1_1', res1.mailtitle, FIXID.COMM_SYS_MAILTEMP, res1.mailcon, {RawItemEx({id=1, resId=res1.itemid, number=res1.itemnumber})} } )
		local res3 = res_opensvract_alli[3]
		assertEQ ( self.mm.params['addSysMail.3'], {'role_3_1', res3.mailtitle, FIXID.COMM_SYS_MAILTEMP, res3.mailcon, {RawItemEx({id=1, resId=res3.itemid, number=res3.itemnumber})} } )
		assertEQ ( self.mm.params['addSysMail.4'], {'role_3_2', res3.mailtitle, FIXID.COMM_SYS_MAILTEMP, res3.mailcon, {RawItemEx({id=1, resId=res3.itemid, number=res3.itemnumber})} } )
		assertEQ ( self.mm.params['sendBriefMail.1'], {app:getPlayerMgr():getPlayerByName('alli1_mem1'), 'mail'})
		assertEQ ( self.mm.params['sendBriefMail.4'], {app:getPlayerMgr():getPlayerByName('alli3_mem2'), 'mail'})
	end;	
	
	test_startOpenSvrAct_sendHasFiveHighHerosGift_noStartedBefore = function(self)
		Service:getSvrVarDB():setValue('opensvract', 0)
	
		local MockReadFile = MockFile:extends({
			read = function(self)
				return 'role1,role1,role2,'
			end;
		})
		
		local mfile = MockReadFile()
		self.mm:mock(MyFile, 'new', {mfile})
	
		self.mm:mock(ActTaskUtil, 'getOpenSvrActTime', {1379520000 + 100})
		self.mm:mock(app:getRoleRank(), 'selectRanks:role_selectRanks', {{}})
		self.mm:mock(app:getActTowerRank(), 'selectRanks:tower_selectRanks', {{}})
		
		self.mm:mock(app:getMailMgr(), 'addSysMail', {'mail'})
		self.mm:mock(MailSender, 'sendBriefMail')
		
		Util:setTimeDrt(1379520000)
		os.setClockMs(0)
		self.svrAct:start()
		
		self.mm:clear()
		Util:setTimeDrt(1379520000 + 100 )
		os.setClockMs(100*1000)
		global.getTimer():update()
		assertStrRepeatCount(self.mm.walkLog, 'addSysMail', 2) 
		local res1 = res_opensvract_hero[1]
		assertEQ ( self.mm.params['addSysMail.1'], {'role2', res1.mailtitle, FIXID.COMM_SYS_MAILTEMP, res1.mailcon, {RawItemEx({id=1, resId=res1.itemid, number=res1.itemnumber})} } )
		assertEQ ( self.mm.params['addSysMail.2'], {'role1', res1.mailtitle, FIXID.COMM_SYS_MAILTEMP, res1.mailcon, {RawItemEx({id=1, resId=res1.itemid, number=res1.itemnumber})} } )
	end;
})


tqOpenSvrAct_t_main = function(suite)
	suite:addTestCase(TestCaseSvrVarDB, 'TestCaseSvrVarDB')
	suite:addTestCase(TestCaseOpenSvrAct, 'TestCaseOpenSvrAct')
end;


