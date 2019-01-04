--*******************************************************************************
require('tqTradingArea')

local TestCaseTradingArea = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		global.initTimer()
		self.player = TestCaseHelper:loadPlayerByUserNameEx('player', 'player_r', 100001, 300)
		self.tradingArea = self.player:getTradingArea()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	helper_calcGetMoney = function(self, nodes)
		local sum = 0
		local fromPos = self.player:getCityPos()
		local fromBuildLevel = self.player:getCitys():getBuildLevelByResId(FIXID.SHICHANGBUILD)
		for _, node in ipairs(nodes) do
			local distance = math.sqrt((fromPos.x - node.pos.x)*(fromPos.x - node.pos.x) + (fromPos.y - node.pos.y)*(fromPos.y - node.pos.y))
			local factD =  math.floor(distance*7.41 + 0.5)
			local decayFactor = math.atan(factD/150 + 0.22)*7.65 - 2.0
			local baseGain = 100*math.min(node.level, fromBuildLevel)
			
			sum = sum + math.floor(2*baseGain*(10 - decayFactor) + 0.5)
		end
		
		return sum
	end;	
	
	helper_calcTotalDistance = function(self, nodes)
		local sum = 0
		local fromPos = self.player:getCityPos()
		local fromBuildLevel = self.player:getCitys():getBuildLevelByResId(FIXID.SHICHANGBUILD)
		for _, node in ipairs(nodes) do
			local distance = math.sqrt((fromPos.x - node.pos.x)*(fromPos.x - node.pos.x) + (fromPos.y - node.pos.y)*(fromPos.y - node.pos.y))
			local factD =  math.floor(distance*7.41 + 0.5)
			sum = sum + factD
		end
		
		return sum	
	end;
	
	test_start = function(self)
		Util:setTimeDrt(10)
		self.tradingArea:setStopTime(0)
	
		self.mm:mock( global.getTimer(), 'start' )
		self.mm:mock( TradingAreaSender, 'sendStopTime' )
	
		self.tradingArea:start()
		assertEQ ( self.mm.walkLog, '' )
		
		self.tradingArea:setStopTime(15)
		self.tradingArea:start()
		assertEQ ( self.mm.params['start'], {5*1000, {TIMER_EVT.TRADING_STOP}, self.player:getTimerCaller()} )
		assertEQ ( self.mm.params['sendStopTime'], {self.player } )
	end;
	
	test_getTargetsSet = function(self)
		local targetsSet  = self.tradingArea:getTargetsSet()
		assertEQ ( targetsSet:has(1), false )
		targetsSet:insert(1)
		assertEQ ( targetsSet:has(1), true )
	end;
	
	test_setStopTime = function(self)
		assertEQ ( self.tradingArea:getStopTime(), 0 )
		self.tradingArea:setStopTime(1)
		assertEQ ( self.tradingArea:getStopTime(), 1 )
	end;
	
	test_getRate = function(self)
		assertEQ ( self.tradingArea:getRate(), 1 )
	end;
	
	test_getMaxCitys = function(self)
		assertEQ ( self.tradingArea:getMaxCitys(), 4 )
	end;
	
	test_getCapacity = function(self)
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=10, state=0} } })
		assertEQ ( self.tradingArea:getCapacity(), 10*100 )
	end;
	
	test_getTotalDistance = function(self)
		local aPlayer1 = TestCaseHelper:loadPlayerByUserNameEx('aPlayer1', 'aPlayer1_r', 100002, 301)
		local aPlayer2 = TestCaseHelper:loadPlayerByUserNameEx('aPlayer2', 'aPlayer2_r', 100003, 640000)
		
		local targetsSet  = self.tradingArea:getTargetsSet()
		targetsSet:insert(self.player:getRoleId())
		targetsSet:insert(aPlayer1:getRoleId())
		targetsSet:insert(aPlayer2:getRoleId())
		targetsSet:insert(-1)
		
		assertEQ (self.tradingArea:getTotalDistance(), self:helper_calcTotalDistance({ {pos=self.player:getCityPos()}, {pos=aPlayer1:getCityPos()}, {pos=aPlayer2:getCityPos()} } ) )
	end;
	
	test_getTotalNeedTime = function(self)
		local aPlayer1 = TestCaseHelper:loadPlayerByUserNameEx('aPlayer1', 'aPlayer1_r', 100002, 301)
		local aPlayer2 = TestCaseHelper:loadPlayerByUserNameEx('aPlayer2', 'aPlayer2_r', 100003, 640000)
		
		local targetsSet  = self.tradingArea:getTargetsSet()
		targetsSet:insert(self.player:getRoleId())
		targetsSet:insert(aPlayer1:getRoleId())
		targetsSet:insert(aPlayer2:getRoleId())
		assertEQ (self.tradingArea:getTotalNeedTime(), 3*600 + self.tradingArea:getTotalDistance()*15 )
	end;
	
	test_getTotalGainMoney = function(self)
		local aPlayer1 = TestCaseHelper:loadPlayerByUserNameEx('aPlayer1', 'aPlayer1_r', 100002, 301)
		local aPlayer2 = TestCaseHelper:loadPlayerByUserNameEx('aPlayer2', 'aPlayer2_r', 100003, 640000)
		
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=10, state=0} } })
		TestCaseCondition:setPreCond(aPlayer1, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=11, state=0} } })
		TestCaseCondition:setPreCond(aPlayer2, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=5, state=0} } })
		
		local targetsSet  = self.tradingArea:getTargetsSet()
		targetsSet:insert(self.player:getRoleId())
		targetsSet:insert(aPlayer1:getRoleId())
		targetsSet:insert(aPlayer2:getRoleId())
		targetsSet:insert(-1)
		
		local expectMoney = self:helper_calcGetMoney({ {pos=self.player:getCityPos(), level=10}, {pos=aPlayer1:getCityPos(), level=11}, {pos=aPlayer2:getCityPos(), level=5} } )
		assertEQ ( self.tradingArea:getTotalGainMoney(), expectMoney ) 
		
		self.player:setVipLevel(7)
		assertEQ ( self.tradingArea:getTotalGainMoney(), expectMoney*(1 + 0.5) ) 
	end;
	
	test_getFactRouteDistance = function(self)
		local aPlayer = TestCaseHelper:loadPlayerByUserNameEx('aPlayer', 'aPlayer_r', 100003, 640000)
		local grid = app:getCityMgr():getGridByGridId(640000)
		assertEQ (self.tradingArea:getTargetDistance(grid), self:helper_calcTotalDistance({ {pos=aPlayer:getCityPos()}  } ) )
	end;
	
	test_checkTargetsInAlliance = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		
		local aPlayer1 = TestCaseHelper:loadPlayerByUserNameEx('aPlayer1', 'aPlayer1_r', 100002, 301)
		aPlayer1:setAlliId(1)
		self.player:setAlliId(1)
		local targetsSet  = self.tradingArea:getTargetsSet()
		targetsSet:insert(self.player:getRoleId())
		targetsSet:insert(aPlayer1:getRoleId())
		
		assertEQ ( self.tradingArea:checkTargetsInAlliance(), true )
		
		self.mm:clear()
		aPlayer1:setAlliId(2)
		assertEQ ( self.tradingArea:checkTargetsInAlliance(), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100146, '"aPlayer1_r"'}, 'has player not in my alliance' )
		
		self.mm:clear()
		aPlayer1:setAlliId(1)
		aPlayer1:getCityRes():setLevel(0)
		assertEQ ( self.tradingArea:checkTargetsInAlliance(), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100155, '"aPlayer1_r"'}, 'has player city is die' )
		
		self.mm:clear()
		aPlayer1:getCityRes():setLevel(1)
		targetsSet:insert(-1)
		assertEQ ( self.tradingArea:checkTargetsInAlliance(), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100147, ''}, 'has player not exist' )
	end;
	
	test_getMaxTimes = function(self)
		assertEQ ( self.tradingArea:getMaxTimes(), res_base_tradingarea_times )
	end;
	
	test_getTodayTimes = function(self)
		assertEQ ( self.tradingArea:getTodayTimes(), 0 )
	end;
	
	test_setTodayTimes = function(self)
		assertEQ ( self.tradingArea:getTodayTimes(), 0 )
		Util:setTimeDrt(1379520000)
		self.tradingArea:setTodayTimes(1)
		assertEQ ( self.tradingArea:getTodayTimes(), 1 )
		self.tradingArea:setTodayTimes(2)
		assertEQ ( self.tradingArea:getTodayTimes(), 2 )
		Util:setTimeDrt(1379520000 + 24*3600)
		assertEQ ( self.tradingArea:getTodayTimes(), 0 )
	end;
	
	test_isTodayFullTimes = function(self)
		Util:setTimeDrt(1379520000)
		self.tradingArea:setTodayTimes(1)
		assertEQ ( self.tradingArea:isTodayFullTimes(), false )
		self.tradingArea:setTodayTimes(self.tradingArea:getMaxTimes())
		assertEQ ( self.tradingArea:isTodayFullTimes(), true )
	end;
	
	test__onTradingStopTimerCommCaller = function(self)
		self.mm:mock(TradingAreaSender, 'sendStopTime')
		
		Util:setTimeDrt(0)
		os.setClockMs(0)
		local targetsSet  = self.tradingArea:getTargetsSet()
		self.tradingArea:setStopTime(10)
		self.tradingArea:start()
		
		self.mm:clear()
		Util:setTimeDrt(10-1) -- 模拟一秒的误差
		os.setClockMs(10*1000)
		global.getTimer():update()
		assertEQ ( global.getTimer():isStoped(), true )
		assertEQ ( self.mm.params['sendStopTime'], {self.player} )
	end;
	
	test__onTradingStopTimerDisuseTimerNode = function(self)
		self.mm:mock(TradingAreaSender, 'sendStopTime')
		
		Util:setTimeDrt(0)
		os.setClockMs(0)
		local targetsSet  = self.tradingArea:getTargetsSet()
		self.tradingArea:setStopTime(10)
		self.tradingArea:start()
		
		self.mm:clear()
		Util:setTimeDrt(10-5) -- 模拟一个废弃的时钟节点
		os.setClockMs(10*1000)
		global.getTimer():update()
		assertEQ ( global.getTimer():isStoped(), true )
		assertEQ ( self.mm.walkLog,'' )
	end;
	
	test__onTradingStopTimerNoInTradingState = function(self)
		self.mm:mock(TradingAreaSender, 'sendStopTime')
		
		Util:setTimeDrt(0)
		os.setClockMs(0)
		local targetsSet  = self.tradingArea:getTargetsSet()
		self.tradingArea:setStopTime(10)
		self.tradingArea:start()
		
		self.mm:clear()
		Util:setTimeDrt(10)
		os.setClockMs(10*1000)
		self.tradingArea:setStopTime(0) -- 清除跑商状态
		global.getTimer():update()
		assertEQ ( global.getTimer():isStoped(), true )
		assertEQ ( self.mm.walkLog,'' )
	end;
	
	test__onTradingStopTimer = function(self)
		local aPlayer1 = TestCaseHelper:loadPlayerByUserNameEx('aPlayer1', 'aPlayer1_r', 100002, 301)
		local aPlayer2 = TestCaseHelper:loadPlayerByUserNameEx('aPlayer2', 'aPlayer2_r', 100003, 640000)
		
		self.mm:mock(global.getTimer(), 'stop')
		self.mm:mock(TradingAreaSender, 'sendStopTime')
		
		self.mm:clear()
		self.tradingArea:setStopTime(1)
		local targetsSet  = self.tradingArea:getTargetsSet()
		targetsSet:insert(self.player:getRoleId())
		self.tradingArea:_onTradingStopTimer(global.getTimer())
		assertEQ (self.player:getCityRes():getMoney(), 0 )
		assertEQ (self.mm.walkLog, 'stop,sendStopTime')
		assertEQ (self.tradingArea:getStopTime(), 0)
		
		
		self.mm:clear()
		self.tradingArea:setStopTime(1)
		self.tradingArea:setCurTimes(1)
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=10, state=0} } })
		self.tradingArea:_onTradingStopTimer(global.getTimer())
		assertEQ (self.player:getCityRes():getMoney(), self:helper_calcGetMoney({ {pos=self.player:getCityPos(), level=10} } ) )
		assertEQ (self.mm.walkLog, 'stop,sendStopTime')
		assertEQ (self.tradingArea:getStopTime(), 0)
		
		self.mm:clear()
		self.player:getCityRes():subMoney(self.player:getCityRes():getMoney())
		self.tradingArea:setCurTimes(2)
		self.tradingArea:setStopTime(1)
		targetsSet:insert(aPlayer1:getRoleId())
		TestCaseCondition:setPreCond(aPlayer1, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=5, state=0} } })
		self.tradingArea:_onTradingStopTimer(global.getTimer())
		assertEQ (self.player:getCityRes():getMoney(), 2*self:helper_calcGetMoney({ {pos=self.player:getCityPos(), level=10}, {pos=aPlayer1:getCityPos(), level=5} } ) )
		
		self.mm:clear()
		self.tradingArea:setCurTimes(1)
		self.player:getCityRes():subMoney(self.player:getCityRes():getMoney())
		self.tradingArea:setStopTime(1)
		targetsSet:insert(aPlayer1:getRoleId())
		TestCaseCondition:setPreCond(aPlayer1, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=10, state=0} } })
		self.tradingArea:_onTradingStopTimer(global.getTimer())
		assertEQ (self.player:getCityRes():getMoney(), self:helper_calcGetMoney({ {pos=self.player:getCityPos(), level=10}, {pos=aPlayer1:getCityPos(), level=10} } ) )
		
		self.mm:clear()
		self.player:getCityRes():subMoney(self.player:getCityRes():getMoney())
		self.tradingArea:setStopTime(1)
		targetsSet:insert(aPlayer2:getRoleId())
		TestCaseCondition:setPreCond(aPlayer2, nil, { builds={ {id=12,resid=FIXID.SHICHANGBUILD, level=10, state=0} } })
		self.tradingArea:_onTradingStopTimer(global.getTimer())
		assertEQ (self.player:getCityRes():getMoney(), self:helper_calcGetMoney({ {pos=self.player:getCityPos(), level=10}, {pos=aPlayer1:getCityPos(), level=10}, {pos=aPlayer2:getCityPos(), level=10} } ) )
		
		self.mm:clear()
		self.player:getCityRes():subMoney(self.player:getCityRes():getMoney())
		self.tradingArea:setStopTime(1)
		targetsSet:insert(-1)
		self.tradingArea:_onTradingStopTimer(global.getTimer())
		assertEQ (self.player:getCityRes():getMoney(), self:helper_calcGetMoney({ {pos=self.player:getCityPos(), level=10}, {pos=aPlayer1:getCityPos(), level=10}, {pos=aPlayer2:getCityPos(), level=10} } ) )
	end;
})


tqTradingArea_t_main = function(suite)
	suite:addTestCase(TestCaseTradingArea, 'TestCaseTradingArea')
end;


