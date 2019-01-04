--*******************************************************************************
require('tqTaskFinisher')

local TestCaseTaskFinisher = TestCase:extends({
	setUp = function(self)
		
		TestCaseHelper:createPlayer(self)
		
		res_activityval_tasks = {
			{id=7001, type=7, times=2, val=3, docond={{type=TASK_FINISH_TYPE.FEED_LIGHTLAW, val1=0, val2=0, val3=0}}}
			,{id=7002, type=7, times=2, val=5, docond={{type=TASK_FINISH_TYPE.SPEED_BUILDING, val1=0, val2=0, val3=0}}}
			,{id=7003, type=7, times=1, val=2, docond={{type=TASK_FINISH_TYPE.ROLELOGIN_EVERYDAY, val1=0, val2=0, val3=0}}}
			}
		
		res_test_items = { --res_tasks
			{id=1001, type=1, fixShow=1, state=1, time={start=1377336523, duration=0}, docond={{type=1, val1=1, val2=0, val3=0}}, dropId=7500001 }
			,{id=1002, type=1, fixShow=1, state=0, time={start=1377336523-200, duration=100}, docond={{type=1, val1=2, val2=0, val3=0}}, dropId=7500001}
			,{id=1003, type=1, fixShow=1, state=0, time={start=1377336523, duration=100}, docond={{type=2, val1=3, val2=0, val3=0}}, dropId=7500001}
			,{id=1004, type=1, fixShow=1, state=0, time={start=1377336523, duration=100}, docond={{type=2, val1=3, val2=0, val3=0}}, dropId=7500001}
			,{id=1005, type=1, fixShow=1, state=0, time={start=1377336523, duration=100}, docond={{type=3, val1=4, val2=0, val3=0}}, dropId=7500001}
			
			,{id=2001, type=2, fixShow=1, docond={{type=5, val1=1, val2=2, val3=3}}, dropId=7500001}
			,{id=2002, type=2, fixShow=1, docond={{type=5, val1=1, val2=2, val3=3}}, dropId=7500001}
			,{id=2003, type=2, fixShow=1, docond={{type=5, val1=2, val2=0, val3=0}}, dropId=7500001}
			,{id=2004, type=2, fixShow=1, docond={{type=6, val1=1, val2=0, val3=0}}, dropId=7500001}
			,{id=2005, type=2, fixShow=1, docond={{type=6, val1=0, val2=0, val3=0}}, dropId=7500001}

			,{id=4001, type=4, fixShow=1, precond={roleLevel=10}, docond={{type=6, val1=7, val2=0, val3=0}}, dropId=7500001}
			,{id=4002, type=4, fixShow=1, precond={roleLevel=20}, docond={{type=TASK_FINISH_TYPE.FARMPOPU, val1=2, val2=0, val3=0}}, dropId=7500001}
			,{id=4003, type=4, fixShow=1, precond={roleLevel=30}, docond={{type=TASK_FINISH_TYPE.CARRY_SOLDIER, val1=3, val2=4, val3=0}}, dropId=7500001}
			,{id=4004, type=4, fixShow=1, precond={roleLevel=40}, docond={{type=TASK_FINISH_TYPE.HAS_CITY_DEF, val1=5, val2=6, val3=0}}, dropId=7500001}
			,{id=4005, type=4, fixShow=1, precond={roleLevel=50}, docond={{type=TASK_FINISH_TYPE.USE_ITEM, val1=1001, val2=0, val3=0}}, dropId=7500001}
			
			,res_activityval_tasks[1]
			,res_activityval_tasks[2]
			
			,{id=1000001, pile=1, apos=1} -- 装备
			}
			
		res_active_tasks = {
			res_test_items[1], res_test_items[2], res_test_items[3], res_test_items[4], res_test_items[5],
			}
		
		res_growup_tasks = {}
			
		res_everyday_tasks = {
			res_test_items[11], res_test_items[12], res_test_items[13], res_test_items[14], res_test_items[15] 
			}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_trigerTask = function(self)
		local r_isNeedCheck = {false}
		self.mm:travelMock(self.player:getTask(), 'setTask')
		self.mm:nologMock(TaskFinisher.checker, 'isNeedCheck', r_isNeedCheck)
		self.mm:mock(TaskFinisher, 'checkTasks')
		
		-- check active tasks
		self.player:getTask():getCommTasks():clear()
		Util:setTimeDrt(1377336523-1)
		TaskFinisher:trigerTask(self.player, 1, 1)
		assertEQ ( self.mm.walkLog, '' )
		assertEQ ( self.mm.params['isNeedCheck'], {1} )
		

		self.mm:clear()
		TaskFinisher:trigerTask(self.player, 1, 2)
		assertEQ ( self.mm.walkLog, '' )

		self.mm:clear()
		self.player:getTask():getActTask():getTasks():insert({taskId=1003, state=0, times=1, maxTimes=2, startTime=1377336523, stopTime=1377336523 + 100})
		TaskFinisher:trigerTask(self.player, 2, 3)
		assertEQ ( self.player:getTask():getTaskById(1003).state, 0 )
		Util:setTimeDrt(1377336523+100)
		TaskFinisher:trigerTask(self.player, 2, 3)
		assertEQ ( self.player:getTask():getTaskById(1003).state, 0 )
		Util:setTimeDrt(1377336523)
		TaskFinisher:trigerTask(self.player, 2, 3)
		assertEQ ( self.player:getTask():getTaskById(1003).state, 1 )
		

		self.player:getTask():setTask(1005, 2)
		self.mm:clear()
		TaskFinisher:trigerTask(self.player, 3, 4)
		assertEQ ( self.mm.walkLog, '' )
		
		-- check growup tasks
		self.player:getTask():getCommTasks():clear()
		self.player:getTask():setTask(2001, 0)
		self.player:getTask():setTask(2002, 0)
		self.player:getTask():setTask(2003, 1)
		self.player:getTask():setTask(2005, 0)
		self.mm:clear()
		TaskFinisher:trigerTask(self.player, 5, 1, 2, 3)
		assertEQ ( self.mm.walkLog, 'setTask' )
		assertEQ ( self.player:getTask():getTaskById(2001).state, 1 )
		
		self.mm:clear()
		TaskFinisher:trigerTask(self.player, 5, 2)
		assertEQ ( self.mm.walkLog, '', '2003 task is finished wait for get reward' )
		
		self.mm:clear()
		TaskFinisher:trigerTask(self.player, 6, 1, 'has no 2004 task in list')
		assertEQ ( self.mm.walkLog, '' )
		
		self.mm:clear()
		TaskFinisher:trigerTask(self.player, 6)
		assertEQ ( self.mm.walkLog, 'setTask' )
		assertEQ ( self.player:getTask():getTaskById(2005).state, 1, 'doVal1, doVal2, doVal3 default value need init to 0' )
		
		
		-- check everyday tasks
		self.player:getTask():getCommTasks():clear()
		self.mm:mock(math, 'random', nil, function(a,b)
			if b ~= nil then return b end return a  end)
		self.player:setLevel(10)
		self.player:getTask():getEveryDayTask():_randTasks()
		self.player:setLevel(20)
		self.player:getTask():getEveryDayTask():randTask(3)  -- 4002
		self.player:setLevel(30)
		self.player:getTask():getEveryDayTask():randTask(4) -- 4003
		self.player:setLevel(40)
		self.player:getTask():getEveryDayTask():randTask(5) -- 4004
		self.player:setLevel(50)
		self.player:getTask():getEveryDayTask():randTask(6) -- 4005
		self.mm:clear()
		TaskFinisher:trigerTask(self.player, 6, 7)
		assertEQ ( self.mm.walkLog, 'setTask' )
		assertEQ ( self.player:getTask():getTaskById(4001*100 + 1).state, 1 )
		assertEQ ( self.player:getTask():getTaskById(4001*100 + 2).state, 0 )
		
		self.mm:clear()
		TaskFinisher:trigerTask(self.player, 6, 7)
		assertEQ ( self.mm.walkLog, 'setTask' )
		assertEQ ( self.player:getTask():getTaskById(4001*100 + 1).state, 1 )
		assertEQ ( self.player:getTask():getTaskById(4001*100 + 2).state, 1 )
		
		self.mm:clear()
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.FARMPOPU, 1)
		assertEQ ( self.mm.walkLog, '' )
		
		self.mm:clear()
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.FARMPOPU, 2)
		assertEQ ( self.mm.walkLog, 'setTask' )
		
		self.mm:clear()
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.FARMPOPU, 2)
		assertEQ ( self.mm.walkLog, '' )
		
		self.mm:clear()
		self.player:getTask():getEveryDayTask():setTaskState(400203, 0)
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.FARMPOPU, 3)
		assertEQ ( self.mm.walkLog, 'setTask' )
		
		self.mm:clear()
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.CARRY_SOLDIER, 4, 3)
		assertEQ ( self.mm.walkLog, '' )
		
		self.mm:clear()
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.CARRY_SOLDIER, 3, 2)
		assertEQ ( self.mm.walkLog, '' )
		
		self.mm:clear()
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.CARRY_SOLDIER, 3, 4)
		assertEQ ( self.mm.walkLog, 'setTask' )
		
		self.mm:clear()
		self.player:getTask():getEveryDayTask():setTaskState(400304, 0)
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.CARRY_SOLDIER, 3, 5)
		assertEQ ( self.mm.walkLog, 'setTask' )
		
		self.mm:clear()
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.HAS_CITY_DEF, 5, 5, 5)
		assertEQ ( self.mm.walkLog, '' )
		
		self.mm:clear()
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.HAS_CITY_DEF, 5, 6, 5)
		assertEQ ( self.mm.walkLog, '' )
		
		self.mm:clear()
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.HAS_CITY_DEF, 5, 6, 0)
		assertEQ ( self.mm.walkLog, 'setTask' )
		
		self.mm:clear()
		self.player:getTask():getEveryDayTask():setTaskState(400405, 0)
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.HAS_CITY_DEF, 5, 7)
		assertEQ ( self.mm.walkLog, 'setTask' )
		
		self.mm:clear()
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.USE_ITEM, 1002, 1003 )
		assertEQ ( self.mm.walkLog, '' )
		
		self.mm:clear()
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.USE_ITEM, 1002, 1001 )
		assertEQ ( self.mm.walkLog, 'setTask' )
		
		self.mm:clear()
		self.player:getTask():getEveryDayTask():setTaskState(400506, 0)
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.USE_ITEM, 1001, 1002 )
		assertEQ ( self.mm.walkLog, 'setTask' )
		
		self.mm:clear()
		r_isNeedCheck[1] = true
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.USE_ITEM, 1001, 1002 )
		assertEQ ( self.mm.walkLog, 'checkTasks' )
		assertEQ ( self.mm.params['isNeedCheck'], {TASK_FINISH_TYPE.USE_ITEM} )
		assertEQ ( self.mm.params['checkTasks'], {self.player} )
	end;
	
	test_trigerTask_actValTask = function(self)
		Util:setTimeDrt(1379520000)
		self.mm:nologMock(TaskFinisher.checker, 'isNeedCheck', {false})
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.FEED_LIGHTLAW )
		assertEQ ( self.player:getTask():getActivityVal():getTodayVal(), 3 )
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.FEED_LIGHTLAW )
		assertEQ ( self.player:getTask():getActivityVal():getTodayVal(), 3+3 )
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.FEED_LIGHTLAW )
		assertEQ ( self.player:getTask():getActivityVal():getTask(1).times, 2 )
		assertEQ ( self.player:getTask():getActivityVal():getTodayVal(), 3+3 )
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.SPEED_BUILDING )
		assertEQ ( self.player:getTask():getActivityVal():getTask(2).times, 1 )
		assertEQ ( self.player:getTask():getActivityVal():getTodayVal(), 3+3+5 )
	end;
	
	test_trigerTask_actValTask_playerHasVip = function(self)
		self.player:setVipLevel(1)
		Util:setTimeDrt(1379520000)
		self.mm:nologMock(TaskFinisher.checker, 'isNeedCheck', {false})
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.ROLELOGIN_EVERYDAY )
		assertEQ ( self.player:getTask():getActivityVal():getTodayVal(), 2 + 5 )
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.SPEED_BUILDING )
		assertEQ ( self.player:getTask():getActivityVal():getTodayVal(), 2 + 5 + 5 )
	end;
	
	test_isImmFinish = function(self)
		local docond = {{type=0, val1=0, val2=0, val3=0}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		
		-- form popu
		docond = {{type=TASK_FINISH_TYPE.FARMPOPU, val1=400, val2=0, val3=0}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		self.player:getFarm():seedBlock({id=1,resid=FIXID.FARM,level=1,state=FARM_STATE.COMPLETE})
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		self.player:getFarm():seedBlock({id=2,resid=FIXID.FARM,level=1,state=FARM_STATE.COMPLETE})
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		
		-- has build number
		docond = {{type=TASK_FINISH_TYPE.HAS_BUILD, val1=FIXID.BARBACK, val2=2, val3=2}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=6,resid=FIXID.BARBACK,level=1,state=0} } })
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=7,resid=FIXID.BARBACK,level=2,state=0} } })
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=8,resid=FIXID.BARBACK,level=3,state=0} } })
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=9,resid=FIXID.BARBACK,level=2,state=0} } })
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		
		-- win act tower
		docond = {{type=TASK_FINISH_TYPE.WIN_ACT_TOWER, val1=10, val2=0, val3=0}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		self.player:getActTower():setMaxLayer(10)
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		self.player:getActTower():setMaxLayer(11)
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		
		-- max popu number 
		docond = {{type=TASK_FINISH_TYPE.MAX_POPU, val1=2000, val2=0, val3=0}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=10,resid=FIXID.HOUSEBUILD, level=10,state=0} } } )
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		
		-- culture level
		docond = {{type=TASK_FINISH_TYPE.LEARN_CULTURE, val1=120001, val2=2, val3=0}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		TestCaseCondition:setPreCond(self.player, nil, { cultures={{id=120001, level=2}} })
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		TestCaseCondition:setPreCond(self.player, nil, { cultures={{id=120001, level=3}} })
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		
		-- menoy output 
		docond = {{type=TASK_FINISH_TYPE.MENOY_OUTPUT, val1=1000, val2=0, val3=0}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		self.player:getCityRes():setIdlePopu(1000)
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		
		-- city level 
		docond = {{type=TASK_FINISH_TYPE.CITY_LEVEL, val1=2, val2=0, val3=0}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		self.player:getCityRes():setLevel(2)
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		self.player:getCityRes():setLevel(3)
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		
		-- has alliance
		docond = {{type=TASK_FINISH_TYPE.JION_ALLI, val1=0, val2=0, val3=0}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		self.player:setAlliId(1)
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		
		-- steel hero jing mai
		docond = {{type=TASK_FINISH_TYPE.STEEL_HERO_JING_MAI, val1=0, val2=0, val3=0}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		TestCaseCondition:setPreCond(self.player, nil, {heros={{state=0}} })
		local hero = self.player:getHeroMgr():getHeroById(1)
		hero:setSkeletonLevel(1)
		hero:setProf(HERO_PROF.YONGSHI + 1)
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		
		-- has one arm
		docond = {{type=TASK_FINISH_TYPE.HAS_ONE_ARM, val1=0, val2=0, val3=0}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		self.player:getPkg():addItems({RawItemEx({resId=1000001, number=1})})
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		
		-- city build val
		docond = {{type=TASK_FINISH_TYPE.CITY_BUILD_VAL, val1=100, val2=0, val3=0}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		self.player:getCityRes():setBuildVal(100)
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		self.player:getCityRes():setBuildVal(200)
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		
		-- new solider max number
		docond = {{type=TASK_FINISH_TYPE.NEWSOLIDER_MAX, val1=100, val2=0, val3=0}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=11,resid=FIXID.BARBACK, level=10,state=BUILD_STATE.UPGRADE} } } )
		self.player:recalMaxNewSoldier()
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		
		-- city def number
		docond = {{type=TASK_FINISH_TYPE.HAS_CITY_DEF, val1=FIXID.FIRSTCITYDEF + 1, val2=2, val3=0}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		self.player:getCityDef():setDefNumber(CITYDEF_TYPE.FIRST+1, 2)
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		
		-- sub city no.
		docond = {{type=TASK_FINISH_TYPE.BUILD_SUBCITY, val1=2, val2=0, val3=0}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		self.player:getCitys():addCity(CITY_TYPE.SUBRES)
		self.player:getCitys():addCity(CITY_TYPE.SUBRES)
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		self.player:getCitys():addCity(CITY_TYPE.SUBRES)
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		
		-- role level
		docond = {{type=TASK_FINISH_TYPE.ROLE_UPGRADE, val1=2, val2=0, val3=0}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		self.player:setLevel(2)
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		self.player:setLevel(3)
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		
		-- win act terrace
		docond = {{type=TASK_FINISH_TYPE.WIN_ACT_TERRACE, val1=2, val2=0, val3=0}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		self.player:getActTerrace():setMaxGate({gateId=2, subGateId=1})
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		self.player:getActTerrace():setMaxGate({gateId=2, subGateId=ActBaseExpedHdr().MAX_SUBGATE_ID_})
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		self.player:getActTerrace():setMaxGate({gateId=3, subGateId=1})
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		
		-- alliance member number
		docond = {{type=TASK_FINISH_TYPE.ALLI_MEM_NUM, val1=1, val2=0, val3=0}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		local alliance = app:getAlliMgr():createAlliance(self.player, 'alli1', 'a')
		self.player:setAlliId(alliance:getId())
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		
		-- has item number
		docond = {{type=TASK_FINISH_TYPE.HAS_ITEM_NUM, val1=FIXID.LINGWUDAN, val2=1, val3=0}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.LINGWUDAN, number=1})})
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		
		-- sub item
		docond = {{type=TASK_FINISH_TYPE.SUB_ITEM, val1=FIXID.SALVE, val2=1, val3=0}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.SALVE, number=1})})
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
		
		-- recruit hero
		docond = {{type=TASK_FINISH_TYPE.RECRUIT_HERO, val1=HERO_PROF.YONGSHI, val2=0, val3=0}}
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		TestCaseCondition:setPreCond(self.player, nil, {
			heros={{state=0,level=2,soldier={resid=150001001,number=10}}
				}  })
		hero = self.player:getHeroMgr():getHeroById(2)
		hero:setProf(HERO_PROF.YONGSHI + 1)
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), false )
		hero:setProf(HERO_PROF.YONGSHI )
		assertEQ ( TaskFinisher:isImmFinish(self.player, docond), true )
	end;
	
	test_checkTasks = function(self)
		res_test_items = { --res_tasks
			{id=1003, type=1, fixShow=1, state=0, time={start=1377336523, duration=100}, docond={{type=TASK_FINISH_TYPE.FARMPOPU, val1=3, val2=0, val3=0}}, dropId=7500001}			
			,{id=2001, type=2, fixShow=1, docond={{type=TASK_FINISH_TYPE.HAS_BUILD, val1=FIXID.BARBACK, val2=2, val3=3}}, dropId=7500001}
			,{id=4001, type=4, fixShow=1, precond={roleLevel=10}, docond={{type=TASK_FINISH_TYPE.CITY_LEVEL, val1=10, val2=0, val3=0}}, dropId=7500001}
			,{id=4002, type=4, fixShow=1, precond={roleLevel=10}, docond={{type=TASK_FINISH_TYPE.CITY_LEVEL, val1=10, val2=0, val3=0}}, dropId=7500001}
			}
			
		res_active_tasks = {
			res_test_items[1]
			}
		
		res_growup_tasks = {}
			
		res_everyday_tasks = {
			res_test_items[3]
			
			}		
		
		-- check active tasks
		self.player:getTask():getCommTasks():clear()
		Util:setTimeDrt(1377336523)
		TaskFinisher:checkTasks(self.player)
		self.player:getTask():getActTask():getTasks():insert({taskId=1003, state=0, times=1, maxTimes=2, startTime=1377336523, stopTime=1377336523 + 100})
		assertEQ ( self.player:getTask():getTaskById(1003).state, 0 )
		self.player:getFarm():seedBlock({id=1,resid=FIXID.FARM,level=1,state=FARM_STATE.COMPLETE})
		TaskFinisher:checkTasks(self.player)
		assertEQ ( self.player:getTask():getTaskById(1003).state, 1 )
		
		-- check growup tasks
		self.player:getTask():getCommTasks():clear()
		self.player:getTask():setTask(2001, 0)
		self.mm:clear()
		TaskFinisher:checkTasks(self.player)
		assertEQ ( self.player:getTask():getTaskById(2001).state, 0 )
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=5,resid=FIXID.BARBACK, level=10,state=0},{id=6,resid=FIXID.BARBACK, level=2,state=0},{id=7,resid=FIXID.BARBACK, level=1,state=0} } } )
		TaskFinisher:checkTasks(self.player)
		assertEQ ( self.player:getTask():getTaskById(2001).state, 0 )
		TestCaseCondition:setPreCond(self.player, nil, { builds={ {id=8,resid=FIXID.BARBACK, level=3,state=0} } } )
		TaskFinisher:checkTasks(self.player)
		assertEQ ( self.player:getTask():getTaskById(2001).state, 1 )
		
		-- check everyday tasks
		self.player:getTask():getCommTasks():clear()
		self.player:setLevel(10)
		self.player:getTask():getEveryDayTask():_randTasks()
		self.mm:clear()
		TaskFinisher:checkTasks(self.player)
		assertEQ ( self.player:getTask():getTaskById(4001*100 + 1).state, 0 )
		self.player:getCityRes():setLevel(10)
		TaskFinisher:checkTasks(self.player)
		assertEQ ( self.player:getTask():getTaskById(4001*100 + 1).state, 1 )
		
		--check everyday tasks order by taskid desc
		local rand_times = 0
		self.mm:mock(math, 'random', nil, function()
			rand_times = rand_times + 1
			if rand_times == 2 then 
				return 2
			else
				return 1
			end
		end)
		res_everyday_tasks = {
			res_test_items[3],
			res_test_items[4],
			}		
		self.player:getTask():getCommTasks():clear()
		self.player:setLevel(10)
		self.player:getTask():getEveryDayTask():_randTasks()
		self.player:getCityRes():setLevel(1)
		TaskFinisher:checkTasks(self.player)
		assertEQ ( self.player:getTask():getTaskById(4001*100 + 1).state, 0 )
		assertEQ ( self.player:getTask():getTaskById(4002*100 + 2).state, 0 )
		self.player:getCityRes():setLevel(10)
		TaskFinisher:checkTasks(self.player)
		assertEQ ( self.player:getTask():getTaskById(4001*100 + 1).state, 0 )
		assertEQ ( self.player:getTask():getTaskById(4002*100 + 2).state, 1 )
	end;
})


tqTaskFinisher_t_main = function(suite)
	suite:addTestCase(TestCaseTaskFinisher, 'TestCaseTaskFinisher')
end;



