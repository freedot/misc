require('tqAlliances')

local TestCaseAllianceMember = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.mem = AllianceMember()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getTodayRes = function(self)
		local timesec = 1368715763
		Util:setTimeDrt(timesec)
		self.mem:setLastRes({lastTime=timesec, val=1})
		assertEQ ( self.mem:getTodayRes(), 1 )
		self.mem:setLastRes({lastTime=timesec-24*3600, val=1})
		assertEQ ( self.mem:getTodayRes(), 0 )
	end;	
	
	test_getTodayCard = function(self)
		local timesec = 1368715763
		Util:setTimeDrt(timesec)
		self.mem:setLastCard({lastTime=timesec, val=1})
		assertEQ ( self.mem:getTodayCard(), 1 )
		self.mem:setLastCard({lastTime=timesec-24*3600, val=1})
		assertEQ ( self.mem:getTodayCard(), 0 )
	end;	
	
	test_isTodayFireFull = function(self)
		local timesec = 1368715763
		Util:setTimeDrt(timesec)
		self.mem:setLastFire({lastTime=timesec, count=1})
		assertEQ ( self.mem:isTodayFireFull(), false )
		self.mem:setLastFire({lastTime=timesec, count=3})
		assertEQ ( self.mem:isTodayFireFull(), true )
		self.mem:setLastFire({lastTime=timesec-24*3600, count=3})
		assertEQ ( self.mem:isTodayFireFull(), false )
	end;
})

local TestCaseAllianceLawLight = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.lawLight = AllianceLawLight()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_setGrowupVal = function(self)
		self.lawLight:setLevel(1)
		self.lawLight:setGrowupVal(1)
		assertEQ ( self.lawLight:getGrowupVal(), 1 )
		
		local res = res_alli_lawlight_upd[1]
		self.lawLight:setGrowupVal(res.maxgrowupval+1)
		assertEQ ( self.lawLight:getGrowupVal(), res.maxgrowupval )
	end;
})

local TestCaseAllianceItemPkg = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		global.initTimer()
		self.leader = TestCaseHelper:loadPlayerByUserNameEx('my', 'myrole', 100001)
		self.buyer = TestCaseHelper:loadPlayerByUserNameEx('buy', 'buyrole', 100002)
		self.alliance = app:getAlliMgr():createAlliance(self.leader, 'alli1', 'a')
		self.leader:setAlliId(self.alliance:getId())
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_sysItemTimeOut_hasNoGetter = function(self)
		local baseTime = 1374573632
		local baseClock = 100000
		
		Util:setTimeDrt(baseTime)
		os.setClockMs(baseClock)
		self.alliance:getItemPkg():addItem({id=1, resid=5000043, num=10, boss=1, sptime=baseTime+10, cur=100, buyer=''})
		assertEQ ( self.alliance:getItemPkg():getItemCount(), 1 )
		
		Util:setTimeDrt(baseTime + 9)
		os.setClockMs(baseClock + 9*1000)
		global.getTimer():update()
		assertEQ ( self.alliance:getItemPkg():getItemCount(), 1 )
		
		Util:setTimeDrt(baseTime + 10)
		os.setClockMs(baseClock + 10*1000)
		global.getTimer():update()
		assertEQ ( self.alliance:getItemPkg():getItemCount(), 0 )
		
		Util:setTimeDrt(baseTime + 11)
		os.setClockMs(baseClock + 11*1000)
		global.getTimer():update()
		assertEQ ( self.alliance:getItemPkg():getItemCount(), 0 )
	end;
	
	test_sysItemTimeOut_hasGetter = function(self)
		self.mm:mock( app:getMailMgr(), 'addSysMail', {'mail'} )
		self.mm:mock( MailSender, 'sendBriefMail' )
		local baseTime = 1374573632
		local baseClock = 100000
		
		Util:setTimeDrt(baseTime)
		os.setClockMs(baseClock)
		self.alliance:getItemPkg():addItem({id=1, resid=5000043, num=10, boss=1, sptime=baseTime+10, cur=100, buyer='myrole'})
		assertEQ ( self.alliance:getItemPkg():getItemCount(), 1 )
		
		Util:setTimeDrt(baseTime + 10)
		os.setClockMs(baseClock + 10*1000)
		global.getTimer():update()
		assertEQ ( self.alliance:getItemPkg():getItemCount(), 0 )
		
		local dropRawItems = DropItem():createRawItems({{resid=5000043,number=10}})
		assertEQ ( self.mm.params['addSysMail'], {'myrole', rstr.mail.title.biddingAlliItem, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.biddingAlliItem, dropRawItems} )
		assertEQ ( self.mm.params['sendBriefMail'], {self.leader, 'mail'} )
		
		assertEQ ( self.alliance:getItemPkg():getItemCount(), 0 )
	end;
	
	test_playerItemTImeOut_hasNoGetter = function(self)
		self.mm:mock( app:getMailMgr(), 'addSysMail', {'mail'} )
		self.mm:mock( MailSender, 'sendBriefMail' )
		local baseTime = 1374573632
		local baseClock = 100000
		
		Util:setTimeDrt(baseTime)
		os.setClockMs(baseClock)
		self.alliance:getItemPkg():addItem({id=1, resid=5000043, num=10, sptime=baseTime+10, cur=100, seller='myrole', buyer=''})
		assertEQ ( self.alliance:getItemPkg():getItemCount(), 1 )
		
		Util:setTimeDrt(baseTime + 10)
		os.setClockMs(baseClock + 10*1000)
		global.getTimer():update()
		assertEQ ( self.alliance:getItemPkg():getItemCount(), 0 )
		
		local dropRawItems = DropItem():createRawItems({{resid=5000043,number=10}})
		assertEQ ( self.mm.params['addSysMail'], {'myrole', rstr.mail.title.sellAlliItemTimeOut, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.sellAlliItemTimeOut, dropRawItems} )
		assertEQ ( self.mm.params['sendBriefMail'], {self.leader, 'mail'} )
	end;
	
	test_playerItemTImeOut_hasGetter = function(self)
		self.mm:mock( app:getMailMgr(), 'addSysMail', {'mail'} )
		self.mm:mock( MailSender, 'sendBriefMail' )
		self.mm:mock(AllianceSender, 'sendSelfContributes' )
		local baseTime = 1374573632
		local baseClock = 100000
		
		Util:setTimeDrt(baseTime)
		os.setClockMs(baseClock)
		self.alliance:getItemPkg():addItem({id=1, resid=5000043, num=10, sptime=baseTime+10, cur=100, seller='myrole', buyer='buyrole'})
		assertEQ ( self.alliance:getItemPkg():getItemCount(), 1 )
		
		local mem = self.alliance:getMemberById( self.leader:getRoleId() )
		assertEQ ( mem:getContributes(), 0 )
		
		Util:setTimeDrt(baseTime + 10)
		os.setClockMs(baseClock + 10*1000)
		global.getTimer():update()
		assertEQ ( self.alliance:getItemPkg():getItemCount(), 0 )
		
		local rawItems = DropItem():createRawItems({{resid=5000043,number=10}})
		assertEQ ( self.mm.params['addSysMail.1'], {'buyrole', rstr.mail.title.biddingAlliItem, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.biddingAlliItem, rawItems} )
		assertEQ ( self.mm.params['sendBriefMail.1'], {self.buyer, 'mail'} )
		
		assertEQ ( self.mm.params['addSysMail.2'], {'myrole', rstr.mail.title.sellAlliItemSucc, FIXID.COMM_SYS_MAILTEMP, string.format(rstr.mail.content.sellAlliItemSucc, 100)} )
		assertEQ ( self.mm.params['sendBriefMail.2'], {self.leader, 'mail'} )
		assertEQ ( self.mm.params['sendSelfContributes'], {self.leader, self.alliance} )
		assertEQ ( mem:getContributes(), 100 )
	end;
	
	test_allocItemId = function(self)
		self.alliance:getItemPkg():addItem({id=1, resid=5000043, num=10, sptime=1000000, cur=100, seller='myrole', buyer='buyrole'})
		self.alliance:getItemPkg():addItem({id=4, resid=5000043, num=10, sptime=1000000, cur=400, seller='myrole', buyer='buyrole'})
		self.alliance:getItemPkg():addItem({id=2, resid=5000043, num=10, sptime=1000000, cur=200, seller='myrole', buyer='buyrole'})
		assertEQ ( self.alliance:getItemPkg():getItemCount(), 3 )
		self.alliance:getItemPkg():addItem({resid=5000043, num=10, sptime=1000000, cur=1000, seller='myrole', buyer='buyrole'})
		assertEQ ( self.alliance:getItemPkg():getItemCount(), 4 )
		assertEQ ( self.alliance:getItemPkg():getItemByIdx(3).id, 4 + 1 )
		assertEQ ( self.alliance:getItemPkg():getItemByIdx(3).cur, 1000 )
	end;
	
	test_toString = function(self)
		local items = {
			{id=1, resid=5000043, num=11, sptime=1000000, cur=100, fixed=200, seller='myrole', buyer='buyrole'},
			{id=2, resid=5000043, num=12, sptime=1000000, cur=200, fixed=200, seller='myrole', buyer='buyrole'},
			{id=3, resid=5000043, num=13, sptime=1000000, cur=200, fixed=200, seller='myrole', buyer='buyrole'},
		}
		self.alliance:getItemPkg():addItem(items[1])
		self.alliance:getItemPkg():addItem(items[2])
		self.alliance:getItemPkg():addItem(items[3])
		self.alliance:getItemPkg():addLastItem(items[1])
		local expectStr = 'items=' .. toLUAString(items) .. ',litems=' .. toLUAString({items[1]}) .. ','
		assertEQ ( self.alliance:getItemPkg():toString(), expectStr )
	end;
	
	test_onlyAddItem = function(self)
		local baseTime = 1374573632
		local baseClock = 100000
		
		Util:setTimeDrt(baseTime)
		os.setClockMs(baseClock)
		self.alliance:getItemPkg():onlyAddItem({id=1, resid=5000043, num=10, boss=1, sptime=baseTime+10, cur=100, buyer='myrole'})
		assertEQ ( self.alliance:getItemPkg():getItemCount(), 1 )
		
		Util:setTimeDrt(baseTime + 10)
		os.setClockMs(baseClock + 10*1000)
		global.getTimer():update()
		assertEQ ( self.alliance:getItemPkg():getItemCount(), 1 )
	end;
	
	test_start = function(self)
		local baseTime = 1374573632
		local baseClock = 100000
		
		Util:setTimeDrt(baseTime)
		os.setClockMs(baseClock)
		self.alliance:getItemPkg():onlyAddItem({id=1, resid=5000043, num=10, boss=1, sptime=baseTime+10, cur=100, buyer='myrole'})
		self.alliance:getItemPkg():onlyAddItem({id=2, resid=5000043, num=10, boss=1, sptime=baseTime+10, cur=100, buyer='myrole'})
		assertEQ ( self.alliance:getItemPkg():getItemCount(), 2 )
		
		self.alliance:getItemPkg():start()
		
		Util:setTimeDrt(baseTime + 10)
		os.setClockMs(baseClock + 10*1000)
		global.getTimer():update()
		assertEQ ( self.alliance:getItemPkg():getItemCount(), 0 )
	end;
})

local TestCaseAlliance = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		global.initTimer()
		self.alliance = Alliance(app:getAlliMgr())
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_addHonour = function(self)
		assertEQ ( self.alliance:getHonour(), 0 )
		self.alliance:addHonour(-1)
		assertEQ ( self.alliance:getHonour(), 0 )
		self.alliance:addHonour(1)
		assertEQ ( self.alliance:getHonour(), 1 )
	end;
	
	test_subHonour = function(self)
		self.alliance:addHonour(100)
		self.alliance:subHonour(-1)
		assertEQ ( self.alliance:getHonour(), 100 )
		self.alliance:subHonour(50)
		assertEQ ( self.alliance:getHonour(), 50 )
		self.alliance:subHonour(51)
		assertEQ ( self.alliance:getHonour(), 0 )
	end;
	
	test_addMember = function(self)
		res_task_alli_mems = {}
		res_task_alli_mems[3] = true
		self.mm:mock( TaskFinisher, 'checkTasks' )
		self.mm:mock( app:getAlliMgr(), 'addAllianceEvent' )
		assertEQ ( self.alliance:getHonour(), 0 )
		assertEQ ( self.alliance:getMemberCount(), 0)
		
		local leaderPlayer = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100000)
		local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		
		self.mm:clear()
		local member1 = AllianceMember()
		member1:setId(leaderPlayer:getRoleId())
		self.alliance:addMember(member1)
		
		self.mm:clear()
		local member2 = AllianceMember()
		member2:setId(memPlayer:getRoleId())
		self.alliance:addMember(member2)
		
		assertEQ ( self.alliance:getMemberCount(), 2)
		assertEQ ( self.alliance:getMemberById(member1:getId()), member1)
		assertEQ ( self.alliance:getHonour(), 200 )
		assertEQ ( self.mm.walkLog, 'addAllianceEvent' )
		assertEQ ( self.mm.params['addAllianceEvent'], { self.alliance, 'addMember', {roleId=member2:getId(), addHonour=100} } )
		
		self.mm:clear()
		local member3 = AllianceMember()
		member3:setId(3000000)
		self.alliance:addMember(member3)
		assertEQ ( self.mm.walkLog, 'addAllianceEvent,checkTasks,checkTasks' )
		assertEQ ( self.mm.params['checkTasks.1'], { leaderPlayer } )
		assertEQ ( self.mm.params['checkTasks.2'], { memPlayer } )
	end;
	
	test_removeMember = function(self)
		local member1 = AllianceMember()
		member1:setId(1)
		self.alliance:addMember(member1)
		local member2 = AllianceMember()
		member2:setId(2)
		self.alliance:addMember(member2)
		
		local oldHonour = self.alliance:getHonour()
		self.mm:mock( app:getAlliMgr(), 'addAllianceEvent' )
		self.alliance:removeMember(0)
		assertEQ ( self.alliance:getMemberByIdx(0), member2 )
		assertEQ ( self.alliance:getHonour() + 100, oldHonour )
		assertEQ ( self.mm.params['addAllianceEvent'], { self.alliance, 'delMember', {roleId=1, subHonour=100} } )
		self.alliance:removeMember(0)
		assertEQ ( self.alliance:getMemberCount(), 0 )
	end;
	
	test_setUpgradeStopTime = function(self)
		Util:setTimeDrt(10)
		self.mm:mock(	global.getTimer(), 'start' )
		self.alliance:setId(global.makeInt64(1, 2))
		self.alliance:setUpgradeStopTime( 0 )
		assertEQ ( self.mm.walkLog, '' )
		
		self.alliance:setUpgradeStopTime( Util:getTime() + 20 )
		assertEQ ( self.mm.params['start'], {20*1000, {TIMER_EVT.UPGRADE_ALLIANCE, self.alliance:getId()}, app:getAlliMgr():getTimerCaller()} )
		
		self.alliance:setUpgradeStopTime( Util:getTime() - 2 )
		assertEQ ( self.mm.params['start'], {1*1000, {TIMER_EVT.UPGRADE_ALLIANCE, self.alliance:getId()}, app:getAlliMgr():getTimerCaller()} )
	end;
	
	test_setDismissStartTime = function(self)
		Util:setTimeDrt(10)
		self.mm:mock(	global.getTimer(), 'start' )
		self.alliance:setId(global.makeInt64(1, 2))
		self.alliance:setDismissStartTime( 0 )
		assertEQ ( self.mm.walkLog, '' )
		
		self.alliance:setDismissStartTime( Util:getTime() )
		assertEQ ( self.mm.params['start'], {12*3600*1000, {TIMER_EVT.DISMISS_ALLIANCE, self.alliance:getId()}, app:getAlliMgr():getTimerCaller()} )
	end;
	
	test_setTransferStartTime = function(self)
		Util:setTimeDrt(10)
		self.mm:mock(	global.getTimer(), 'start' )
		self.alliance:setId(global.makeInt64(1, 2))
		self.alliance:setTransferStartTime( 0 )
		assertEQ ( self.mm.walkLog, '' )
		
		self.alliance:setTransferStartTime( Util:getTime() )
		assertEQ ( self.mm.params['start'], {24*3600*1000, {TIMER_EVT.DISMISS_TRANSFER, self.alliance:getId()}, app:getAlliMgr():getTimerCaller()} )
	end;
	
	test_addEvent = function(self)
		Util:setTimeDrt(100000000)
		self.alliance:addEvent({event='event1', createTime=Util:getTime()}, true )
		assertEQ ( self.alliance:getEventsCount(), 1 )
		Util:setTimeDrt(100000000 + res_alli_events_expired_days*24*3600)
		self.alliance:addEvent({event='event2', createTime=Util:getTime()}, true )
		assertEQ ( self.alliance:getEventsCount(), 2 )
		Util:setTimeDrt(100000000 + res_alli_events_expired_days*24*3600+1)
		self.alliance:addEvent({event='event3', createTime=Util:getTime()}, true )
		assertEQ ( self.alliance:getEventsCount(), 2 )
	end;
})

local helper_makeMemberStr = function(id)
	local s = '{'
	s = s .. 'id=' .. id
	s = s .. ',lastRes={val=100,lastTime=12345}'
	s = s .. ',lastCard={val=10,lastTime=123456}'
	s = s .. ',totalRes=200'
	s = s .. ',totalCard=20'
	s = s .. ',alliPos=1'
	s = s .. ',contributes=30'
	s = s .. ',gainGift={count=1,lastTime=1234567}'
	s = s .. ',feed={count=2,lastTime=12345678}'
	s = s .. ',fire={count=3,lastTime=1368715763}'
	s = s .. '}'
	return s
end;

local helper_createMember = function(id)
	local member = AllianceMember()
	member:setId(id)
	member:setLastRes({val=100,lastTime=12345})
	member:setLastCard({val=10,lastTime=123456})
	member:setTotalRes(200)
	member:setTotalCard(20)
	member:setAlliPos(1)
	member:setContributes(30)
	member:setGainGiftCount({count=1,lastTime=1234567})
	member:setFeedCount({count=2,lastTime=12345678})
	member:setLastFire({count=3,lastTime=1368715763})
	return member
end;

local helper_createAlliance = function()
	local alliance = Alliance(app:getAlliMgr())
	alliance:setId(1);
	alliance:setLevel(2);
	alliance:setName('alli');
	alliance:setFlag('a');
	alliance:setCityResId(9900001);
	alliance:setLeader('role');
	alliance:setBuildVal(4);
	alliance:setCardNumber(5);
	alliance:setQQGroup('123');
	alliance:setIntroduction('hi');
	alliance:setBulletin('some');
	
	local lawLight = AllianceLawLight()
	lawLight:setLevel(1);
	lawLight:setGrowupVal(2);
	alliance:setLawLight(lawLight)

	alliance:addMember(helper_createMember(1001))
	alliance:addMember(helper_createMember(1002))
	
	alliance:setHonour(3);
	
	return alliance
end;
	
local TestCaseAllianceMgr = TestCase:extends({
	setUp = function(self)
		global.initTimer()
		app.allianceMgr = AllianceMgr:new(app)
		self.mgr = app:getAlliMgr()
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_init = function(self)
		self.mm:mock(self.mgr, '_init')
		self.mm:mock(self.mgr, '_regTimers')		
		self.mm:mock(self.mgr, '_loadFromDB')
		self.mm:mock(self.mgr, 'sortAlliances')
		self.mm:mock(global.getTimer(), 'start')
		self.mgr:init(app)
		assertEQ ( self.mm.walkLog, '_init,_regTimers,_loadFromDB,sortAlliances,start,start')
		assertEQ ( self.mm.params['_init'], {app} )
		assertEQ ( self.mm.params['start.1'], {10*1000, {TIMER_EVT.SAVE_ALLIANCE}, self.mgr:getTimerCaller()} )
		assertEQ ( self.mm.params['start.2'], {20*1000, {TIMER_EVT.SORT_ALLI_RANK}, self.mgr:getTimerCaller()} )
	end;
	
	test__init = function(self)
		self.mm:mock(self.mgr, 'clear')
		self.mgr:_init(app)
		assertEQ ( self.mgr.gapp, app )
		assertEQ ( self.mgr.emptyalli:getId(), 0 )
		assertEQ ( self.mm.walkLog, 'clear' )
	end;
	
	test__regTimers = function(self)
		self.mm:mock(app:getAlliMgr():getTimerCaller(), 'register')
		self.mgr:_regTimers()
		assertEQ ( self.mm.params['register.1'], {TIMER_EVT.SAVE_ALLIANCE, Caller:new(0, self.mgr.saveAllianceTimer, self.mgr.saveAllianceTimer.onTimer)} )
		assertEQ ( self.mm.params['register.2'], {TIMER_EVT.SORT_ALLI_RANK, Caller:new(0, self.mgr, self.mgr._onSortAlliance)} )
		assertEQ ( self.mm.params['register.3'], {TIMER_EVT.UPGRADE_ALLIANCE, Caller:new(0, self.mgr.upgradeAllianceTimer, self.mgr.upgradeAllianceTimer.onTimer)} )
		assertEQ ( self.mm.params['register.4'], {TIMER_EVT.DISMISS_ALLIANCE, Caller:new(0, self.mgr.dismissAllianceTimer, self.mgr.dismissAllianceTimer.onTimer)} )
		assertEQ ( self.mm.params['register.5'], {TIMER_EVT.DISMISS_TRANSFER, Caller:new(0, self.mgr.transferAllianceTimer, self.mgr.transferAllianceTimer.onTimer)} )
	end;
	
	test_sortAlliances = function(self)
		local alliance1 = self.mgr:createAlliance(self.player, 'alli1', 'a')
		alliance1:setCityResId(9900001)
		alliance1:setLevel(1)
		alliance1:setHonour(10)
		local alliance2 = self.mgr:createAlliance(self.player, 'alli2', 'a')
		alliance2:setCityResId(9900001)
		alliance2:setLevel(1)
		alliance2:setHonour(11)
		local alliance3 = self.mgr:createAlliance(self.player, 'alli3', 'a')
		alliance3:setCityResId(9900001)
		alliance3:setLevel(2)
		alliance3:setHonour(9)
		local alliance4 = self.mgr:createAlliance(self.player, 'alli4', 'a')
		alliance4:setCityResId(9900002)
		alliance4:setLevel(2)
		alliance4:setHonour(8)
		local alliance5 = self.mgr:createAlliance(self.player, 'alli5', 'a')
		alliance5:setCityResId(9900004)
		alliance5:setLevel(1)
		alliance5:setHonour(0)
		
		self.mgr:sortAlliances()
		assertEQ ( self.mgr:getSortAlliCount(0), 5 )
		assertEQ ( self.mgr:getSortAlliBy(0, 0), alliance3 )
		assertEQ ( self.mgr:getSortAlliBy(0, 1), alliance4 )
		assertEQ ( self.mgr:getSortAlliBy(0, 2), alliance2 )
		assertEQ ( self.mgr:getSortAlliBy(0, 3), alliance1 )
		assertEQ ( self.mgr:getSortAlliBy(0, 4), alliance5 )
		assertEQ ( self.mgr:getSortAlliCount(9900001), 3 )
		assertEQ ( self.mgr:getSortAlliBy(9900001, 0), alliance3 )
		assertEQ ( self.mgr:getSortAlliBy(9900001, 1), alliance2 )
		assertEQ ( self.mgr:getSortAlliBy(9900001, 2), alliance1 )
		assertEQ ( self.mgr:getSortAlliCount(9900002), 1 )
		assertEQ ( self.mgr:getSortAlliBy(9900002, 0), alliance4 )
		assertEQ ( self.mgr:getSortAlliCount(9900014), 0, 'invalid cityResId' )
		assertEQ ( alliance3:getRank(), 1 )
		assertEQ ( alliance4:getRank(), 2 )
		assertEQ ( alliance2:getRank(), 3 )
		assertEQ ( alliance1:getRank(), 4 )
	end;
	
	test__loadFromDB = function(self)
		local timesec = 1368715763
		Util:setTimeDrt(timesec)
		
		local expectSQL = "select * from alliances;"
		local expectSQL_allianceEvents = "select * from allianceevents where allianceId=10001 and createTime>" .. (timesec-res_alli_events_expired_days*24*3600) .. " order by createTime desc;"
		local dbRecords = {
			{allianceId=10001, level=1, name='alli1', flagName='a', cityResId=9900001, honour=100, leader='role1', buildVal=200, card=10, qqGroup='123', introduction='intro1', bulletin='bulletin1'
				,member='{' .. helper_makeMemberStr(1) .. ','  .. helper_makeMemberStr(2) .. ',}'
				,lawLight='{level=1,val=100}'
				,misc='{dismiss={start=1},upgrade={start=10,stop=100},transfer={name="t1",start=200},applyRoleIds={1,2},applyMerges={3,4},items={{id=1,resid=2500001,num=10},{id=2,resid=2500001,num=20}},litems={{id=1,resid=2500001,num=10}}}'
				}
			,{allianceId=10002, level=2, name='alli2', flagName='b', cityResId=9900002, honour=200, leader='role2', buildVal=400, card=20, qqGroup='321', introduction='intro2', bulletin='bulletin2', member='{' .. helper_makeMemberStr(3) .. ',}', lawLight='{level=2,val=110}'
				,misc='{dismiss={start=0},upgrade={start=0,stop=0},transfer={name="",start=0},applyRoleIds={},applyMerges={}}'}
		}
		local dbRecords_allianceEvents = {
			{allianceId=10001, event='event2', createTime=1368715763}
			,{allianceId=10001, event='event1', createTime=1368715762}
		}
		local queryDB = function(sql, dbrows)
			if sql == expectSQL then
				dbrows:setRecords(dbRecords)
			elseif sql == expectSQL_allianceEvents then
				dbrows:setRecords(dbRecords_allianceEvents)
			else
				dbrows:setRecords({})
			end
		end;
		app:regDBQuery(queryDB)
		
		self.mgr:_loadFromDB()
		assertEQ ( self.mgr:getAlliById(10001):getId(), 10001 )
		assertEQ ( self.mgr:getAlliByName('alli1'):getId(), 10001 )
		assertEQ ( self.mgr:getAlliByFlagName('a'):getId(), 10001 )
		assertEQ ( self.mgr:getAlliById(10002):getId(), 10002 )
		assertEQ ( self.mgr:getAlliByName('alli2'):getId(), 10002 )
		assertEQ ( self.mgr:getAlliByFlagName('b'):getId(), 10002 )
		
		local alliance1 = self.mgr:getAlliById(10001)
		assertEQ ( alliance1:getId(), 10001 )
		assertEQ ( alliance1:getLevel(), 1 )
		assertEQ ( alliance1:getName(), 'alli1' )
		assertEQ ( alliance1:getFlag(), 'a' )
		assertEQ ( alliance1:getCityResId(), 9900001 )
		assertEQ ( alliance1:getHonour(), 100 )
		assertEQ ( alliance1:getLeader(), 'role1' )
		assertEQ ( alliance1:getLeader(), 'role1' )
		assertEQ ( alliance1:getBuildVal(), 200 )
		assertEQ ( alliance1:getCardNumber(), 10 )
		assertEQ ( alliance1:getQQGroup(), '123' )
		assertEQ ( alliance1:getIntroduction(), 'intro1' )
		assertEQ ( alliance1:getBulletin(), 'bulletin1' )
		assertEQ ( alliance1:getMemberCount(), 2 )
		assertEQ ( alliance1:getMemberByIdx(0):getId(), 1 )
		assertEQ ( alliance1:getMemberByIdx(1):getId(), 2 )
		assertEQ ( alliance1:getLawLight():getLevel(), 1 )
		assertEQ ( alliance1:getLawLight():getGrowupVal(), 100 )
		assertEQ ( alliance1:getDismissStartTime(), 1 )
		assertEQ ( alliance1:getUpgradeStartTime(), 10 )
		assertEQ ( alliance1:getUpgradeStopTime(), 100 )
		assertEQ ( alliance1:getTransferStartTime(), 200 )
		assertEQ ( alliance1:getTransferTarget(), 't1' )
		assertEQ ( alliance1:getMemberByIdx(0):isTodayFireFull(), true )
		
		assertEQ ( alliance1:getApplyRoleIdsSet():getCount(), 2 )
		assertEQ ( alliance1:getApplyRoleIdsSet():get(0), 1 )
		assertEQ ( alliance1:getApplyRoleIdsSet():get(1), 2 )
		
		assertEQ ( alliance1:getApplyMergesSet():getCount(), 2 )
		assertEQ ( alliance1:getApplyMergesSet():get(0), 3 )
		assertEQ ( alliance1:getApplyMergesSet():get(1), 4 )
		assertEQ ( alliance1:getEventsCount(), 2 )
		assertEQ ( alliance1:getEventByIdx(0), {event='event2', createTime=1368715763} )
		assertEQ ( alliance1:getEventByIdx(1), {event='event1', createTime=1368715762} )
		assertEQ ( alliance1:getItemPkg():getItemCount(), 2 )
		assertEQ ( alliance1:getItemPkg():getItemByIdx(0), {id=1, resid=2500001, num=10} )
		assertEQ ( alliance1:getItemPkg():getItemByIdx(1), {id=2, resid=2500001, num=20} )
		assertEQ ( alliance1:getItemPkg():getLastItemCount(), 1 )
		assertEQ ( alliance1:getItemPkg():getLastItemByIdx(0), {id=1, resid=2500001, num=10} )
		
		local alliance2 = self.mgr:getAlliById(10002)
		assertEQ ( alliance2:getId(), 10002 )
		assertEQ ( alliance2:getLawLight():getLevel(), 2 )
		assertEQ ( alliance2:getLawLight():getGrowupVal(), 110 )
		assertEQ ( alliance2:getMemberCount(), 1 )
		assertEQ ( alliance2:getMemberByIdx(0):getId(), 3 )
		assertEQ ( alliance2:getMemberByIdx(0).lastRes, {val=100,lastTime=12345} )
		assertEQ ( alliance2:getMemberByIdx(0).lastCard, {val=10,lastTime=123456} )
		assertEQ ( alliance2:getMemberByIdx(0):getTotalRes(), 200 )
		assertEQ ( alliance2:getMemberByIdx(0):getTotalCard(), 20 )
		assertEQ ( alliance2:getMemberByIdx(0):getAlliPos(), 1 )
		assertEQ ( alliance2:getMemberByIdx(0):getContributes(), 30 )
		assertEQ ( alliance2:getMemberByIdx(0).gainGift, {count=1,lastTime=1234567} )
		assertEQ ( alliance2:getMemberByIdx(0).feed, {count=2,lastTime=12345678} )
		assertEQ ( alliance2:getItemPkg():getItemCount(), 0 )
		assertEQ ( alliance2:getItemPkg():getLastItemCount(), 0 )
	end;
	
	test_createAlliance = function(self)
		self.player:setCityId(9900002)
	
		self.mm:mock(self.mgr, '_insertToDB')
		self.mm:mock(UUIDMgr, 'newAllianceId', {100001})
		self.mm:mock(self.mgr, 'addAllianceEvent')
		
		local newAlliance = self.mgr:createAlliance(self.player, 'alli', 'f')
		assertEQ ( newAlliance:getClass(), Alliance)
		assertEQ ( self.mm.params['_insertToDB'], {self.mgr:getAlliById(100001)} )
		assertEQ ( self.mm.params['addAllianceEvent.1'], {newAlliance, 'upgradeAlliance', {level=1, addHonour=100}} )
		assertEQ ( self.mm.params['addAllianceEvent.2'], {newAlliance, 'addMember', {roleId=self.player:getRoleId(), addHonour=100}} )
		assertEQ ( self.mm.params['addAllianceEvent.3'], {newAlliance, 'upgradeLawLight', {level=1, addHonour=200}} )
		
		assertEQ ( self.mgr:getAlliById(100001):getId(), 100001 )
		assertEQ ( self.mgr:getAlliByName('alli'):getId(), 100001 )
		assertEQ ( self.mgr:getAlliByFlagName('f'):getId(), 100001 )
		
		local alliance = self.mgr:getAlliById(100001)
		assertEQ ( self.mgr:getSortAlliBy(0, 0), alliance )
		
		assertEQ ( alliance:getLevel(), 1 )
		assertEQ ( alliance:getName(), 'alli' )
		assertEQ ( alliance:getFlag(), 'f' )
		assertEQ ( alliance:getCityResId(), 9900002 )
		assertEQ ( alliance:getHonour(), 100 + 100 + 200 )
		assertEQ ( alliance:getLeader(), 'role' )
		assertEQ ( alliance:getBuildVal(), 0 )
		assertEQ ( alliance:getCardNumber(), 0 )
		assertEQ ( alliance:getQQGroup(), '' )
		assertEQ ( alliance:getIntroduction(), '' )
		assertEQ ( alliance:getBulletin(), '' )
		assertEQ ( alliance:getMemberCount(), 1 )
		assertEQ ( alliance:getMemberByIdx(0):getId(), self.player:getRoleId() )
		assertEQ ( alliance:getMemberByIdx(0):getAlliPos(), ALLI_POS.LEADER )
		assertEQ ( alliance:getLawLight():getLevel(), 1 )
		assertEQ ( alliance:getLawLight():getGrowupVal(), 0 )		
		assertEQ ( alliance:getDismissStartTime(), 0 )	
	end;
	
	test__insertToDB = function(self)
		local alliance = helper_createAlliance()
		alliance:setDismissStartTime(10)
		alliance:setUpgradeStartTime(100)
		alliance:setUpgradeStopTime(200)
		alliance:setTransferStartTime(300)
		alliance:setTransferTarget('t1')		
		alliance:getApplyRoleIdsSet():insert(1)
		alliance:getApplyRoleIdsSet():insert(2)
		alliance:getApplyMergesSet():insert(3)
		alliance:getApplyMergesSet():insert(4)
		local honour = alliance:getHonour()
		self.mgr:_insertToDB(alliance)
		
		local misc = '{dismiss={start=10},upgrade={start=100,stop=200},transfer={start=300,name="t1"},applyRoleIds={1,2,},applyMerges={3,4,},items={},litems={},}'
		local s = "insert into alliances values('1','2','alli','a','9900001','" .. honour .. "','role','4','5','123','hi','some','{" .. helper_makeMemberStr(1001) .. "," .. helper_makeMemberStr(1002) .. ",}','{level=1,val=2}','" ..misc.. "','1','2','" .. honour .. "','100000');"
		assertEQ ( getLastSql_t(), s )
	end;
	
	test_saveAlliance = function(self)
		local alliance = helper_createAlliance()
		alliance:setDismissStartTime(10)
		alliance:setUpgradeStartTime(100)
		alliance:setUpgradeStopTime(200)
		alliance:setTransferStartTime(300)
		alliance:setTransferTarget('t1')
		alliance:getApplyRoleIdsSet():insert(1)
		alliance:getApplyRoleIdsSet():insert(2)		
		alliance:getApplyMergesSet():insert(3)
		alliance:getApplyMergesSet():insert(4)		
		self.mgr:saveAlliance(alliance)
		
		local misc = '{dismiss={start=10},upgrade={start=100,stop=200},transfer={start=300,name="t1"},applyRoleIds={1,2,},applyMerges={3,4,},items={},litems={},}'
		
		local sets = "level='2',honour='3',leader='role',buildVal='4',card='5',qqGroup='123',introduction='hi',bulletin='some'"
		sets = sets .. ",member='{" .. helper_makeMemberStr(1001) .. "," .. helper_makeMemberStr(1002) .. ",}'"
		sets = sets .. ",lawLight='{level=1,val=2}'"
		sets = sets .. ",misc='" ..misc.. "'"
		local s = "update alliances set " .. sets .. " where allianceId=1;"
		assertEQ ( getLastSql_t(), s)
	end;
	
	test_safeExit = function(self)
		self.mm:mock( self.mgr, 'saveAlliance' )
		
		local alliance1 = self.mgr:createAlliance(self.player, 'alli1', 'a')
		alliance1:setCityResId(9900001)
		alliance1:setLevel(2)
		alliance1:setHonour(10)
		local alliance2 = self.mgr:createAlliance(self.player, 'alli2', 'a')
		alliance2:setCityResId(9900001)
		alliance2:setLevel(1)
		alliance2:setHonour(10)
		self.mgr:sortAlliances()
		
		self.mgr:safeExit()
		assertEQ ( self.mm.walkLog, 'saveAlliance,saveAlliance' )
		assertEQ ( self.mm.params['saveAlliance.1'],  {alliance1})
		assertEQ ( self.mm.params['saveAlliance.2'],  {alliance2})
	end;
	
	test_exitAlliance = function(self)
		local alliance = self.mgr:createAlliance(self.player, 'alliance', 'a')
		assertEQ ( self.mgr:getAlliById(alliance:getId()), alliance )
		assertEQ ( self.mgr:getAlliByName(alliance:getName()), alliance )
		assertEQ ( self.mgr:getAlliByFlagName(alliance:getFlag()), alliance )
		assertEQ ( self.mgr:getSortAlliBy(0, 0), alliance )
		
		self.mm:mock(self.mgr, '_removeFromDB')
		self.mgr:exitAlliance(alliance)
		assertEQ ( self.mm.params['_removeFromDB'], {alliance})
		assertEQ ( self.mgr:getAlliById(alliance:getId()):getId(), 0 )
		assertEQ ( self.mgr:getAlliByName(alliance:getName()):getId(), 0 )
		assertEQ ( self.mgr:getAlliByFlagName(alliance:getFlag()):getId(), 0 )
		assertEQ ( self.mgr:getSortAlliCount(), 0 )
	end;
	
	test_clear = function(self)
		self.mgr.ids = {1}
		self.mgr.names = {1}
		self.mgr.flagNames = {1}
		self.mgr:clear()
		assertEQ ( self.mgr.ids, {} )
		assertEQ ( self.mgr.names, {} )
		assertEQ ( self.mgr.flagNames, {} )	
	end;
	
	test__removeFromDB = function(self)
		local alliance = self.mgr:createAlliance(self.player, 'alliance', 'a')
		self.mgr:_removeFromDB(alliance)
		local s = "delete from alliances where allianceId=" .. alliance:getId() .. ";"
		assertEQ ( getLastSql_t(), s)
	end;
	
	test__onUpgradeAllianceTimer = function(self)
		local alliance = self.mgr:createAlliance(self.player, 'alliance', 'a')
		self.mm:mock(global.getTimer(), 'stop')
		self.mm:mock(AllianceSender, 'sendSelfAllianceDetailToMembers')
		self.mm:mock(app:getAlliMgr(), 'addAllianceEvent')
		
		local seq = 1
		self.mgr.upgradeAllianceTimer:onTimer(global.getTimer(), seq, os.clockMs(), {TIMER_EVT.UPGRADE_ALLIANCE, alliance:getId()+1} )
		assertEQ ( self.mm.walkLog, 'stop' )
		
		self.mm:clear()
		Util:setTimeDrt(1000)
		alliance.upgrade.stop = 1002
		self.mgr.upgradeAllianceTimer:onTimer(global.getTimer(), seq, os.clockMs(), {TIMER_EVT.UPGRADE_ALLIANCE, alliance:getId()} )
		assertEQ ( self.mm.walkLog, 'stop' )
		
		self.mm:clear()
		Util:setTimeDrt(1001)
		local oldHonour = alliance:getHonour()
		self.mgr.upgradeAllianceTimer:onTimer(global.getTimer(), seq, os.clockMs(), {TIMER_EVT.UPGRADE_ALLIANCE, alliance:getId()} )
		assertEQ ( self.mm.walkLog, 'stop,addAllianceEvent,sendSelfAllianceDetailToMembers' )
		assertEQ ( self.mm.params['sendSelfAllianceDetailToMembers'] , {alliance} )
		assertEQ ( alliance:getUpgradeStartTime(), 0 )
		assertEQ ( alliance:getUpgradeStopTime(), 0 )
		assertEQ ( alliance:getLevel(), 2 )
		assertEQ ( alliance:getHonour(), oldHonour + alliance:getLevel()*100)
		assertEQ ( self.mm.params['addAllianceEvent'], { alliance, 'upgradeAlliance', {level=alliance:getLevel(), addHonour= alliance:getLevel()*100} } )
	end;
	
	test__onSaveAllianceTimer = function(self)
		local alliance1 = self.mgr:createAlliance(self.player, 'alli1', 'a')
		alliance1:setCityResId(9900001)
		alliance1:setLevel(10)
		local alliance2 = self.mgr:createAlliance(self.player, 'alli2', 'a')
		alliance2:setCityResId(9900001)
		alliance2:setLevel(9)
		local alliance3 = self.mgr:createAlliance(self.player, 'alli3', 'a')
		alliance3:setCityResId(9900001)
		alliance3:setLevel(8)
		local alliance4 = self.mgr:createAlliance(self.player, 'alli4', 'a')
		alliance4:setCityResId(9900001)
		alliance4:setLevel(7)
		local alliance5 = self.mgr:createAlliance(self.player, 'alli5', 'a')
		alliance5:setCityResId(9900001)
		alliance5:setLevel(6)
		self.mgr:sortAlliances()
		
		self.mm:mock(self.mgr, 'saveAlliance')
		self.vb:replace(nil, 'SAVE_ALLIANCE_STEP', 3)
		
		self.mgr.saveAllianceTimer:onTimer()
		assertEQ ( self.mm.walkLog, 'saveAlliance,saveAlliance,saveAlliance' )
		assertEQ ( self.mm.params['saveAlliance.1'], {alliance1} )
		assertEQ ( self.mm.params['saveAlliance.2'], {alliance2} )
		assertEQ ( self.mm.params['saveAlliance.3'], {alliance3} )
		
		self.mm:clear()
		self.mgr.saveAllianceTimer:onTimer()
		assertEQ ( self.mm.walkLog, 'saveAlliance,saveAlliance' )
		assertEQ ( self.mm.params['saveAlliance.1'], {alliance4} )
		assertEQ ( self.mm.params['saveAlliance.2'], {alliance5} )
		
		self.mm:clear()
		self.mgr.saveAllianceTimer:onTimer()
		assertEQ ( self.mm.walkLog, 'saveAlliance,saveAlliance,saveAlliance' )
		assertEQ ( self.mm.params['saveAlliance.1'], {alliance1} )
		assertEQ ( self.mm.params['saveAlliance.2'], {alliance2} )
		assertEQ ( self.mm.params['saveAlliance.3'], {alliance3} )
		
		self.mgr:clear()
		self.mgr:sortAlliances()
		
		self.mm:clear()
		self.mgr.saveAllianceTimer:onTimer()
		assertEQ ( self.mm.walkLog, '' )
	end;
	
	test__onDismissAllianceTimer = function(self)
		local leaderPlayer = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100000)
		local alliance = app:getAlliMgr():createAlliance(leaderPlayer, 'alliance', 'f')
		local mem = AllianceMember()
		local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		memPlayer:setAlliId(alliance:getId())
		mem:setId(memPlayer:getRoleId())
		alliance:addMember(mem)
		
		local invalidMem = AllianceMember()
		invalidMem:setId(0)
		alliance:addMember(invalidMem)
		
		self.mm:mock(global.getTimer(), 'stop')
		self.mm:mock(RoleBaseSender, 'send')
		self.mm:mock(app:getMailMgr(), 'addSysMail', {{name='mail'}})
		self.mm:mock(MailSender, 'sendBriefMail')
		
		local seq = 1
		self.mgr.dismissAllianceTimer:onTimer(global.getTimer(), seq, os.clockMs(), {TIMER_EVT.DISMISS_ALLIANCE, alliance:getId()+1} )
		assertEQ ( self.mm.walkLog, 'stop' )
		
		self.mm:clear()
		self.mgr.dismissAllianceTimer:onTimer(global.getTimer(), seq, os.clockMs(), {TIMER_EVT.DISMISS_ALLIANCE, alliance:getId()} )
		assertEQ ( self.mm.walkLog, 'stop' )
		assertEQ ( app:getAlliMgr():getAlliById(alliance:getId()), alliance )
		
		self.mm:clear()
		Util:setTimeDrt(1000 + 12*3600 - 2)
		alliance.dismiss.start = 1000
		self.mgr.dismissAllianceTimer:onTimer(global.getTimer(), seq, os.clockMs(), {TIMER_EVT.DISMISS_ALLIANCE, alliance:getId()} )
		assertEQ ( self.mm.walkLog, 'stop' )
		
		self.mm:clear()
		Util:setTimeDrt(1000 + 12*3600 - 1)
		alliance:setDismissStartTime(1)
		self.mgr.dismissAllianceTimer:onTimer(global.getTimer(), seq, os.clockMs(), {TIMER_EVT.DISMISS_ALLIANCE, alliance:getId()} )
		assertEQ ( self.mm.walkLog, 'stop,send,addSysMail,sendBriefMail,send,addSysMail,sendBriefMail' )
		assertEQ ( self.mm.params['send.1'], {leaderPlayer, {'alliance'}} )
		assertEQ ( self.mm.params['addSysMail.1'], {leaderPlayer:getRoleName(), rstr.mail.title.allianceDismissed, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.allianceDismissed} )
		assertEQ ( self.mm.params['sendBriefMail.1'], {leaderPlayer, {name='mail'}} )
		assertEQ ( self.mm.params['send.2'], {memPlayer, {'alliance'} } )
		assertEQ ( leaderPlayer:getAlliId(), 0 )
		assertEQ ( memPlayer:getAlliId(), 0 )
		assertEQ ( app:getAlliMgr():getAlliById(alliance:getId()):getId(), 0 )
	end;
	
	test__onTransferAllianceTimer = function(self)
		local leaderPlayer = TestCaseHelper:loadPlayerByUserNameEx('leader', 'leader_r', 100000)
		local alliance = app:getAlliMgr():createAlliance(leaderPlayer, 'alliance', 'f')
		local mem = AllianceMember()
		local memPlayer = TestCaseHelper:loadPlayerByUserNameEx('source', 'source_r', 200000)
		memPlayer:setAlliId(alliance:getId())
		mem:setId(memPlayer:getRoleId())
		mem:setAlliPos(ALLI_POS.MEM)
		alliance:addMember(mem)
		
		local otherPlayer = TestCaseHelper:loadPlayerByUserNameEx('other', 'other_r', 300000)
		
		self.mm:mock(global.getTimer(), 'stop')
		self.mm:mock(AllianceSender, 'sendSelfMember');
		self.mm:mock(AllianceSender, 'sendSelfAllianceDetail');
		self.mm:mock(app:getMailMgr(), 'addSysMail', {{name='mail'}});
		self.mm:mock(MailSender, 'sendBriefMail');
		self.mm:travelMock(app:getAlliMgr(), 'addAllianceEvent')
		
		local seq = 1
		self.mgr.transferAllianceTimer:onTimer(global.getTimer(), seq, os.clockMs(), {TIMER_EVT.DISMISS_TRANSFER, alliance:getId()+1} )
		assertEQ ( self.mm.walkLog, 'stop' )
		
		self.mm:clear()
		self.mgr.transferAllianceTimer:onTimer(global.getTimer(), seq, os.clockMs(), {TIMER_EVT.DISMISS_TRANSFER, alliance:getId()} )
		assertEQ ( self.mm.walkLog, 'stop' )
		
		self.mm:clear()
		alliance:setTransferStartTime(1)
		alliance:setTransferTarget('xxx')
		self.mgr.transferAllianceTimer:onTimer(global.getTimer(), seq, os.clockMs(), {TIMER_EVT.DISMISS_TRANSFER, alliance:getId()} )
		assertEQ ( alliance:getMemberById(leaderPlayer:getRoleId()):getAlliPos(), ALLI_POS.LEADER )
		assertEQ ( self.mm.walkLog, 'stop' )
		
		self.mm:clear()
		alliance:setTransferStartTime(1)
		alliance:setTransferTarget('source_r')
		self.mgr.transferAllianceTimer:onTimer(global.getTimer(), seq, os.clockMs(), {TIMER_EVT.DISMISS_TRANSFER, alliance:getId()} )
		assertEQ ( alliance:getMemberById(leaderPlayer:getRoleId()):getAlliPos(), ALLI_POS.LEADER )
		assertEQ ( alliance:getMemberById(memPlayer:getRoleId()):getAlliPos(), ALLI_POS.MEM )
		assertEQ ( self.mm.walkLog, 'stop' )
		
		self.mm:clear()
		Util:setTimeDrt(1000 + 24*3600 - 2)
		alliance:getMemberById(memPlayer:getRoleId()):setAlliPos(ALLI_POS.ALEADER)
		alliance:setTransferStartTime(1000)
		alliance:setTransferTarget('source_r')
		self.mgr.transferAllianceTimer:onTimer(global.getTimer(), seq, os.clockMs(), {TIMER_EVT.DISMISS_TRANSFER, alliance:getId()} )
		assertEQ ( self.mm.walkLog, 'stop' )	

		self.mm:clear()
		Util:setTimeDrt(1000 + 24*3600 - 1)
		alliance:getMemberById(memPlayer:getRoleId()):setAlliPos(ALLI_POS.ALEADER)
		alliance:setTransferStartTime(1000)
		alliance:setTransferTarget('source_r')
		assertEQ ( alliance:getLeader(), 'leader_r' )
		self.mgr.transferAllianceTimer:onTimer(global.getTimer(), seq, os.clockMs(), {TIMER_EVT.DISMISS_TRANSFER, alliance:getId()} )
		assertEQ ( alliance:getMemberById(leaderPlayer:getRoleId()):getAlliPos(), ALLI_POS.ALEADER )
		assertEQ ( alliance:getMemberById(memPlayer:getRoleId()):getAlliPos(), ALLI_POS.LEADER )
		assertEQ ( alliance:getLeader(), 'source_r' )
		assertEQ ( alliance:isTransfering(), false )
		assertEQ ( self.mm.params['sendSelfMember.1'], {memPlayer, alliance} )
		assertEQ ( self.mm.params['sendSelfAllianceDetail.1'], {memPlayer, alliance} )
		assertEQ ( self.mm.params['sendSelfMember.2'], {leaderPlayer, alliance} )
		assertEQ ( self.mm.params['sendSelfAllianceDetail.2'], {leaderPlayer, alliance} )
		assertEQ ( self.mm.params['addSysMail.1'], {memPlayer:getRoleName(),rstr.mail.title.transferLeader, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.becomLeader} )
		assertEQ ( self.mm.params['sendBriefMail.1'], {memPlayer, {name='mail'}} )
		assertEQ ( self.mm.params['addSysMail.2'], {leaderPlayer:getRoleName(),rstr.mail.title.transferLeader, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.verbLeader} )
		assertEQ ( self.mm.params['sendBriefMail.2'], {leaderPlayer, {name='mail'}} )
		assertEQ ( self.mm.params['addAllianceEvent.1'], {alliance, 'changeAlliPos', {roleId=memPlayer:getRoleId(), alliancePos=alliance:getMemberById(memPlayer:getRoleId()):getAlliPos()}} )
		assertEQ ( self.mm.params['addAllianceEvent.2'], {alliance, 'changeAlliPos', {roleId=leaderPlayer:getRoleId(), alliancePos=alliance:getMemberById(leaderPlayer:getRoleId()):getAlliPos()}} )
		
		self.mm:clear()
		alliance:getMemberById(leaderPlayer:getRoleId()):setAlliPos(ALLI_POS.LEADER)
		alliance:setTransferStartTime(1)
		alliance:setTransferTarget(otherPlayer:getRoleName())
		self.mgr.transferAllianceTimer:onTimer(global.getTimer(), seq, os.clockMs(), {TIMER_EVT.DISMISS_TRANSFER, alliance:getId()} )
		assertEQ ( self.mm.walkLog, 'stop' )
		assertEQ ( alliance:getMemberById(leaderPlayer:getRoleId()):getAlliPos(), ALLI_POS.LEADER )
		assertEQ ( alliance:isTransfering(), false )
		
		self.mm:clear()
		alliance:getMemberById(leaderPlayer:getRoleId()):setAlliPos(ALLI_POS.LEADER)
		alliance:getMemberById(memPlayer:getRoleId()):setAlliPos(ALLI_POS.ALEADER)
		alliance:setTransferStartTime(1)
		alliance:setTransferTarget(memPlayer:getRoleName())
		app:getPlayerMgr().onlinePlayers[leaderPlayer:getName()] = nil
		app:getPlayerMgr().onlinePlayers[memPlayer:getName()] = nil
		self.mgr.transferAllianceTimer:onTimer(global.getTimer(), seq, os.clockMs(), {TIMER_EVT.DISMISS_TRANSFER, alliance:getId()} )
		assertEQ ( self.mm.walkLog, 'stop,addAllianceEvent,addAllianceEvent,addSysMail,addSysMail' )
		assertEQ ( alliance:getMemberById(leaderPlayer:getRoleId()):getAlliPos(), ALLI_POS.ALEADER )
		assertEQ ( alliance:getMemberById(memPlayer:getRoleId()):getAlliPos(), ALLI_POS.LEADER )
		assertEQ ( alliance:isTransfering(), false )
	end;
	
	test__onSortAlliance = function(self)
		self.mm:mock(self.mgr, 'sortAlliances' )
		
		Util:setTimeDrt(1374573632-1)
		os.setClockMs(100000)
		global.getTimer():update()
		assertEQ ( self.mm.walkLog, 'sortAlliances' )
		
		self.mm:clear()
		Util:setTimeDrt(1374573632+1)
		os.setClockMs(100000 + 1000)
		global.getTimer():update()
		assertEQ ( self.mm.walkLog, '' )
		
		self.mm:clear()
		Util:setTimeDrt(1374573632+24*3600)
		os.setClockMs(100000 + 24*3600*1000)
		global.getTimer():update()
		assertEQ ( self.mm.walkLog, 'sortAlliances' )
	end;
	
	test_addAllianceEvent = function(self)
		local alliance = Alliance(app:getAlliMgr())
		alliance:setId(1);
		local player = TestCaseHelper:loadPlayerByUserNameEx('player', 'player_r', 100001)
		
		Util:setTimeDrt(100)
		local sql_templ = "insert into allianceevents values('','1','%s','" .. Util:getTime() .. "');"
		
		local event1 = string.format(rstr.alliance.events.addMember, 'player_r', 100)
		local expectMsg = string.format(sql_templ, event1)
		self.mgr:addAllianceEvent(alliance, 'addMember', {roleId=100001,addHonour=100})
		assertEQ ( getLastSql_t(), expectMsg )
		assertEQ ( alliance:getEventByIdx(0), {event=event1, createTime=Util:getTime()} )
		
		local event = string.format(rstr.alliance.events.delMember, 'player_r', 100)
		local expectMsg = string.format(sql_templ, event)
		self.mgr:addAllianceEvent(alliance, 'delMember', {roleId=100001,subHonour=100})
		assertEQ ( getLastSql_t(), expectMsg )
		assertEQ ( alliance:getEventByIdx(0), {event=event, createTime=Util:getTime()} )
		assertEQ ( alliance:getEventByIdx(1), {event=event1, createTime=Util:getTime()} )
		
		local event = string.format(rstr.alliance.events.upgradeAlliance, 1, 100)
		local expectMsg = string.format(sql_templ, event)
		self.mgr:addAllianceEvent(alliance, 'upgradeAlliance', {level=1,addHonour=100})
		assertEQ ( getLastSql_t(), expectMsg )
		
		local event = string.format(rstr.alliance.events.upgradeLawLight, 1, 200)
		local expectMsg = string.format(sql_templ, event)
		self.mgr:addAllianceEvent(alliance, 'upgradeLawLight', {level=1,addHonour=200})
		assertEQ ( getLastSql_t(), expectMsg )
		
		local event = string.format(rstr.alliance.events.lawLightBestow, 200)
		local expectMsg = string.format(sql_templ, event)
		self.mgr:addAllianceEvent(alliance, 'lawLightBestow', {addHonour=200})
		assertEQ ( getLastSql_t(), expectMsg )
		
		local event = string.format(rstr.alliance.events.mergeAlliance, 'min', 'max', 200)
		local expectMsg = string.format(sql_templ, event)
		self.mgr:addAllianceEvent(alliance, 'mergeAlliance', {minAlliance='min', maxAlliance='max', addHonour=200})
		assertEQ ( getLastSql_t(), expectMsg )
		
		local event = string.format(rstr.alliance.events.changeAlliPos, 'player_r', rstr.alliance.alliPoss[1])
		local expectMsg = string.format(sql_templ, event)
		self.mgr:addAllianceEvent(alliance, 'changeAlliPos', {roleId=100001, alliancePos=1})
		assertEQ ( getLastSql_t(), expectMsg )
		
		local event = string.format(rstr.alliance.events.pkAttacker, 'attacker', 'defender', 10)
		local expectMsg = string.format(sql_templ, event)
		self.mgr:addAllianceEvent(alliance, 'pkAttacker', {attacker='attacker', defender='defender', addHonour=10})
		assertEQ ( getLastSql_t(), expectMsg )
		
		local event = string.format(rstr.alliance.events.pkDefender, 'attacker', 'defender', 10)
		local expectMsg = string.format(sql_templ, event)
		self.mgr:addAllianceEvent(alliance, 'pkDefender', {attacker='attacker', defender='defender', subHonour=10})
		assertEQ ( getLastSql_t(), expectMsg )
	end;
})

tqAlliances_t_main = function(suite)
	suite:addTestCase(TestCaseAllianceMember, 'TestCaseAllianceMember')
	suite:addTestCase(TestCaseAllianceItemPkg, 'TestCaseAllianceItemPkg')
	suite:addTestCase(TestCaseAlliance, 'TestCaseAlliance')
	suite:addTestCase(TestCaseAllianceLawLight, 'TestCaseAllianceLawLight')
	suite:addTestCase(TestCaseAllianceMgr, 'TestCaseAllianceMgr')
end;


