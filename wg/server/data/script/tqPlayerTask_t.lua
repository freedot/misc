--*******************************************************************************
require('tqPlayerTask')

local TestCaseActTaskUtil = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getOpenSvrActTime = function(self)
		res_svr_mics_cfg.svrOpenActTime = nil
		ActTaskUtil:init()
		assertEQ ( ActTaskUtil:getOpenSvrActTime(), os.time() + 360*24*3600 )
		res_svr_mics_cfg.svrOpenActTime = '2014-10-14 11:22:00'
		ActTaskUtil:init()
		assertEQ ( ActTaskUtil:getOpenSvrActTime(), 1413256920 )
	end;
})

local TestCasePlayerTask = TestCase:extends({
	setUp = function(self)
		res_growup_tasks = {}
		TestCaseHelper:createPlayer(self)
	
		res_active_tasks = {
			{id=2001, type=1, fixShow=0,state=1, times=2, time={start=1382025600, duration=0}, dropId=7500001 }
			,{id=2002, type=1, fixShow=0,state=1, times=1, time={start=1382025600+1000, duration=100}, dropId=7500001}
			,{id=2003, type=1, fixShow=0,state=0, times=2, time={start=1382025600 + 24*3600 + 1000, duration=2*24*3600}, dropId=7500001}
			,{id=2004, type=1, fixShow=1,state=0, times=1, time={start=TASK_STARTTIME.SVR_OPEN, duration=100}, dropId=7500001}
			,{id=2005, type=1, fixShow=0,state=1, times=1, time={start=TASK_STARTTIME.FIRST_LOGIN, duration=100}, dropId=7500001}
			,{id=2006, type=1, fixShow=0,state=0, times=1, time={start=TASK_STARTTIME.FIRST_LOGIN+1, duration=100}, dropId=7500001}
			}
			
		res_test_items = { --res_tasks
			{id=1001, type=2, fixShow=1, precond={taskId=0}, docond={{type=1, val1=1, val2=0, val3=0}}}
			,{id=1002, type=2, fixShow=1, precond={taskId=1001}, docond={{type=TASK_FINISH_TYPE.CITY_LEVEL, val1=2, val2=0, val3=0}}}
			,{id=1003, type=2, fixShow=1, precond={taskId=1002}}
			,{id=1004, type=2, fixShow=1, precond={taskId=0}}
			,{id=1005, type=2, fixShow=0, precond={taskId=1004}}
			,{id=1006, type=2, fixShow=1, precond={taskId=1005}}
			
			,res_active_tasks[1]
			,res_active_tasks[2]
			,res_active_tasks[3]
			,res_active_tasks[4]
			,res_active_tasks[5]
			,res_active_tasks[6]
			}		
		
		res_everyday_tasks = {{id=1001, type=4, precond={roleLevel=10}, dropId=7500001}
			}
			
		res_growup_tasks = {
			res_test_items[1]
			,res_test_items[2]
			,res_test_items[3]
			,res_test_items[4]
			,res_test_items[5]
			,res_test_items[6]
		}
		
		
		self:helper_setSvrOpenTimeAndRegTime()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	helper_setSvrOpenTimeAndRegTime = function(self)
		res_svr_mics_cfg.svrOpenTime = '2013-10-20'
		self.player:getPersistVar().regTime = 1382025600 + 3*24*3600 + 3000
		ActTaskUtil:init()
	end;
	
	test_initGrowupTasks = function(self)
		assertEQ ( self.player:getTask():getTaskById(1001), nil )
		assertEQ ( self.player:getTask():getTaskById(1002), nil )
		assertEQ ( self.player:getTask():getTaskById(1003), nil )
		assertEQ ( self.player:getTask():getTaskById(1004), nil )
		
		self.player:getTask():initGrowupTasks()
		
		assertEQ ( self.player:getTask():getTaskById(1001).taskId, 1001 )
		assertEQ ( self.player:getTask():getTaskById(1001).state, 0 )
		assertEQ ( self.player:getTask():getTaskById(1002), nil )
		assertEQ ( self.player:getTask():getTaskById(1003), nil )
		assertEQ ( self.player:getTask():getTaskById(1004).taskId, 1004 )
		assertEQ ( self.player:getTask():getTaskById(1004).state, 0 )
		
		self.player:getTask():setTask(1001, 1)
		self.player:getTask():initGrowupTasks()
		assertEQ ( self.player:getTask():getTaskById(1001).taskId, 1001 )
		assertEQ ( self.player:getTask():getTaskById(1001).state, 1, 'can only init one times' )
	end;
	
	test_setPrestigeLastTime = function(self)
		self.mm:mock(TaskSender, 'sendPrestigeTask')
		assertEQ ( self.player:getTask():getPrestigeLastTime(), 0 )
		self.player:getTask():setPrestigeLastTime(1)
		assertEQ ( self.player:getTask():getPrestigeLastTime(), 1 )
		assertEQ ( self.mm.params['sendPrestigeTask'], {self.player} )
	end;
	
	test_getTaskById = function(self)
		self.player:setLevel(10)
		self.player:getTask():getEveryDayTask():_randTasks()
		self.player:getTask():setTask(1, 0)
		
		assertEQ ( self.player:getTask():getTaskById(1).taskId, 1, 'get from exist tasks' )
		assertEQ ( self.player:getTask():getTaskById(100101).taskId, 1001, 'get from everyday tasks' )
		assertEQ ( self.player:getTask():getTaskById(100201), nil, 'not find from everyday tasks' )
		assertEQ ( self.player:getTask():getTaskById(100108), nil, 'not find from everyday tasks' )
		assertEQ ( self.player:getTask():getTaskById(100100), nil, 'not find from everyday tasks' )
	end;
	
	
	test_refreshActTasks_firstTime = function(self)
		Util:setTimeDrt(1382025600 - 1)
		self.player:getTask():getActTask():start()
		
		assertEQ ( self.player:getTask():getTaskById(2001), nil )
		
		Util:setTimeDrt(1382025600)
		self.player:getTask():getActTask():start()
		
		assertEQ ( self.player:getTask():getTaskById(2001).taskId, 2001 )
		assertEQ ( self.player:getTask():getTaskById(2001).state, 1 )
		assertEQ ( self.player:getTask():getTaskById(2001).times, 1 )
		assertEQ ( self.player:getTask():getTaskById(2001).maxTimes, 2 )
		assertEQ ( self.player:getTask():getTaskById(2001).startTime, 1382025600 )
		assertEQ ( self.player:getTask():getTaskById(2001).stopTime, 4294967295 )
		
		assertEQ ( self.player:getTask():getTaskById(2002).taskId, 2002 )
		assertEQ ( self.player:getTask():getTaskById(2002).state, 1 )
		assertEQ ( self.player:getTask():getTaskById(2002).times, 1 )
		assertEQ ( self.player:getTask():getTaskById(2002).maxTimes, 1 )
		assertEQ ( self.player:getTask():getTaskById(2002).startTime, 1382025600+1000 )
		assertEQ ( self.player:getTask():getTaskById(2002).stopTime, 1382025600+1000+100 )
	end;
	
	test_refreshActTasks_holdNoOutDateTask = function(self)
		Util:setTimeDrt(1382025600)
		self.player:getTask():getActTask():start()
		
		-- next day
		Util:setTimeDrt(1382025600 + 24*3600 + 1)
		self.player:getTask():getActTask():start()
		
		assertEQ ( self.player:getTask():getTaskById(2001).taskId, 2001 )
		assertEQ ( self.player:getTask():getTaskById(2001).state, 1 )
		assertEQ ( self.player:getTask():getTaskById(2001).times, 1)
	end;
	
	test_refreshActTasks_holdWaitGetRewardTask = function(self)
		Util:setTimeDrt(1382025600)
		self.player:getTask():getActTask():start()
		
		-- next day
		Util:setTimeDrt(1382025600 + 24*3600 + 1)
		self.player:getTask():getActTask():start()
		
		assertEQ ( self.player:getTask():getTaskById(2002).taskId, 2002 )
		assertEQ ( self.player:getTask():getTaskById(2002).state, 1 )
		assertEQ ( self.player:getTask():getTaskById(2002).times, 1)
	end;
	
	test_refreshActTasks_holdNeedFixShowTask_whenLaskStateIsComplete = function(self)
		Util:find(res_active_tasks, 'id', 2002).fixShow = 1
		Util:setTimeDrt(1382025600)
		self.player:getTask():getActTask():start()
		self.player:getTask():setTask(2002, TASK_STATE.COMPLETE)
		
		-- next day
		Util:setTimeDrt(1382025600 + 24*3600 + 1)
		self.player:getTask():getActTask():start()
		assertEQ ( self.player:getTask():getTaskById(2002).state, TASK_STATE.COMPLETE )
		
		Util:find(res_active_tasks, 'id', 2002).fixShow = 0 -- restore 		
	end;
	
	test_refreshActTasks_removeNeedFixShowTask_whenLaskStateIsWaitComplete = function(self)
		Util:find(res_active_tasks, 'id', 2002).fixShow = 1
		Util:setTimeDrt(1382025600)
		self.player:getTask():getActTask():start()
		self.player:getTask():setTask(2002, TASK_STATE.WAIT_COMPLETE)
		
		-- next day
		Util:setTimeDrt(1382025600 + 24*3600 + 1)
		self.player:getTask():getActTask():start()
		assertEQ ( self.player:getTask():getTaskById(2002), nil )
		
		Util:find(res_active_tasks, 'id', 2002).fixShow = 0 -- restore 		
	end;
	
	test_refreshActTasks_removeOutDateTask_whenLaskStateIsWaitComplete = function(self)
		Util:setTimeDrt(1382025600)
		self.player:getTask():getActTask():start()
		self.player:getTask():setTask(2002, TASK_STATE.WAIT_COMPLETE)
		
		-- next day
		Util:setTimeDrt(1382025600 + 24*3600 + 1)
		self.player:getTask():getActTask():start()
		
		assertEQ ( self.player:getTask():getTaskById(2002), nil )
	end;
	
	test_refreshActTasks_removeOutDateTask_whenLaskStateIsComplete = function(self)
		Util:setTimeDrt(1382025600)
		self.player:getTask():getActTask():start()
		self.player:getTask():setTask(2002, TASK_STATE.COMPLETE)
		
		-- next day
		Util:setTimeDrt(1382025600 + 24*3600 + 1)
		self.player:getTask():getActTask():start()
		
		assertEQ ( self.player:getTask():getTaskById(2002), nil )
	end;
	
	test_refreshActTasks_removeOutDateTask_whenSetToCompleteState = function(self)
		Util:setTimeDrt(1382025600)
		self.player:getTask():getActTask():start()
		
		-- next day
		Util:setTimeDrt(1382025600 + 24*3600 + 1)
		self.player:getTask():getActTask():start()
		
		self.mm:mock(TaskSender, 'sendActTask')
		self.mm:mock(TaskSender, 'sendDelActTask')
		
		self.player:getTask():setTask(2002, TASK_STATE.COMPLETE)
		assertEQ ( self.player:getTask():getTaskById(2002), nil )
		assertEQ ( self.mm.params['sendActTask'], {self.player, 2002} )
		assertEQ ( self.mm.params['sendDelActTask'], {self.player, 2002} )
	end;
	
	test_refreshActTasks_addNoOutDateTaskTimes_whenLastStateComplete = function(self)
		Util:setTimeDrt(1382025600)
		self.player:getTask():getActTask():start()
		
		self.player:getTask():setTask(2001, 2)
		assertEQ ( self.player:getTask():getTaskById(2001).state, 2 )
	
		-- next day
		Util:setTimeDrt(1382025600 + 24*3600 + 1)
		self.player:getTask():getActTask():start()
		
		assertEQ ( self.player:getTask():getTaskById(2001).taskId, 2001 )
		assertEQ ( self.player:getTask():getTaskById(2001).state, 1 )
		assertEQ ( self.player:getTask():getTaskById(2001).times, 2 )
	end;
	
	test_refreshActTasks_addNoOutDateTaskTimesByMaxTimesLimit_whenLastStateComplete = function(self)
		Util:setTimeDrt(1382025600)
		self.player:getTask():getActTask():start()
		
		self.player:getTask():setTask(2001, 2)
		assertEQ ( self.player:getTask():getTaskById(2001).state, 2 )
	
		-- next day
		Util:setTimeDrt(1382025600 + 24*3600 + 1)
		self.player:getTask():getActTask():start()
		self.player:getTask():setTask(2001, 2)
		
		Util:setTimeDrt(1382025600 + 24*3600 + 1)
		self.player:getTask():getActTask():start()
		
		assertEQ ( self.player:getTask():getTaskById(2001).taskId, 2001 )
		assertEQ ( self.player:getTask():getTaskById(2001).state, 2 )
		assertEQ ( self.player:getTask():getTaskById(2001).times, 2 )
	end;
	
	test_refreshActTasks_svrOpenTime = function(self)
		Util:setTimeDrt(1382025600 + 2*24*3600 + 1)
		self.player:getTask():getActTask():start()
		assertEQ ( self.player:getTask():getTaskById(2001).state, 1 )
		assertEQ ( self.player:getTask():getTaskById(2004).state, 0 )
	end;
	
	test_refreshActTasks_firstLoginTime = function(self)
		Util:setTimeDrt(1382025600 + 3*24*3600 + 1)
		self.player:getTask():getActTask():start()
		assertEQ ( self.player:getTask():getTaskById(2001).state, 1 )
		assertEQ ( self.player:getTask():getTaskById(2005).state, 1 )
	end;
	
	test_refreshActTasks_secLoginTime = function(self)
		Util:setTimeDrt(1382025600 + 4*24*3600 + 1)
		self.player:getTask():getActTask():start()
		assertEQ ( self.player:getTask():getTaskById(2001).state, 1 )
		assertEQ ( self.player:getTask():getTaskById(2006).state, 0 )
	end;
	
	test_refreshActTasks_fixTimerRefresh = function(self)
		Util:setTimeDrt(1382025600)
		self.player:getTask():getActTask():start()
		
		-- next day
		Util:setTimeDrt(1382025600 + 24*3600 + 2)
		os.setClockMs( (24*3600 + 2)*1000 )
		global.getTimer():update()
		assertEQ ( self.player:getTask():getTaskById(2003).state, 0 )
	end;
	
	test_sendTaskWhenRefreshActTasks = function(self)
		self.mm:mock(TaskSender, 'sendActTasks' )
		Util:setTimeDrt(1382025600 + 4*24*3600 + 1)
		self.player:getTask():getActTask():start()
		assertEQ ( self.mm.params['sendActTasks'], {self.player} )
	end;
	
	test_setTask = function(self)
		self.mm:mock(TaskSender, 'sendCommTask')
	
		self.player:setLevel(10)
		self.player:getTask():getEveryDayTask():_randTasks()
		assertEQ ( self.player:getTask():getTaskById(100101).state, 0 )
		self.player:getTask():setTask(100101, 1)
		assertEQ ( self.player:getTask():getTaskById(100101).state, 1 )
		
		self.mm:clear()
		assertEQ ( self.player:getTask():getTaskById(1), nil )
		self.player:getTask():setTask(1,0) 
		assertEQ ( self.player:getTask():getTaskById(1).state, 0 )
		assertEQ ( self.mm.walkLog, 'sendCommTask' )
		assertEQ ( self.mm.params['sendCommTask'], {self.player, 1, 0} )
		
		self.mm:clear()
		self.player:getTask():setTask(1001,1) 
		assertEQ ( self.player:getTask():getTaskById(1001).state, 1 )
		assertEQ ( self.mm.walkLog, 'sendCommTask' )
		
		self.mm:clear()
		self.player:getTask():setTask(1001,2) 
		assertEQ ( self.player:getTask():getTaskById(1001).state, 2 )
		assertEQ ( self.player:getTask():getTaskById(1002).state, 0 )
		assertEQ ( self.mm.walkLog, 'sendCommTask,sendCommTask' )
		assertEQ ( self.mm.params['sendCommTask.1'], {self.player, 1001, 2} )
		assertEQ ( self.mm.params['sendCommTask.2'], {self.player, 1002, 0} )
				
		self.mm:clear()
		self.player:getTask():setTask(1003,2) 
		assertEQ ( self.player:getTask():getTaskById(1003).state, 2 )
		assertEQ ( self.mm.walkLog, 'sendCommTask' )
		
		self.mm:clear()
		self.player:getTask():setTask(2005,2) 
		assertEQ ( self.player:getTask():getTaskById(2005).state, 2, 'can not delete task, when is active task' )
		
		self.mm:clear()
		self.player:getTask():setTask(1005,2) 
		assertEQ ( self.player:getTask():getTaskById(1005), nil, 'delete complete task, when is not fix show' )
		assertEQ ( self.player:getTask():getTaskById(1006).state, 0 )
		
		self.mm:clear()
		self.player:getCityRes():setLevel(2)
		self.player:getTask():setTask(1001,2) 
		assertEQ ( self.player:getTask():getTaskById(1001).state, 2 )
		assertEQ ( self.player:getTask():getTaskById(1002).state, 1 )
		assertEQ ( self.mm.walkLog, 'sendCommTask,sendCommTask' )
		assertEQ ( self.mm.params['sendCommTask.1'], {self.player, 1001, 2} )
		assertEQ ( self.mm.params['sendCommTask.2'], {self.player, 1002, 1} )
	end;
})

local TestCaseNewcomerTask = TestCase:extends({
	setUp = function(self)
		res_tasks = res_tasks_
		res_online_tasks = res_online_tasks_
		res_newhelp_tasks = res_newhelp_tasks_
		res_everyday_tasks = res_everyday_tasks_
		res_growup_tasks = res_growup_tasks_
		res_active_tasks = res_active_tasks_
		
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_resetNewcomerTask = function(self)
		self.mm:mock(NewcomerTaskSender, 'sendCurTask')
		self.player:getTask():setTask(1600001, 2)
		assertEQ ( self.player:getTask():getTaskById(1600002).state, 0 )
		assertEQ ( self.player:getTask():getNewcomerTask():getCurTaskId(), 1750002 )
		assertEQ ( self.mm.params['sendCurTask'], {self.player} )
		
		self.mm:clear()
		self.player:getTask():setTask(1600002, 0)
		assertEQ ( self.player:getTask():getNewcomerTask():getCurTaskId(), 1750002 )
		assertEQ ( self.mm.walkLog, '' )
		
		self.player:getTask():setTask(1600002, 1)
		self.player:getTask():setTask(1600080, 0)
		assertEQ ( self.player:getTask():getNewcomerTask():getCurTaskId(), 1750002 )
		
		self.player:getTask():setTask(1600002, 5) -- invalid state, just for test
		self.player:getTask():setTask(1600080, 0)
		assertEQ ( self.player:getTask():getNewcomerTask():getCurTaskId(), 0 )
	end;
})

local TestCaseDoingRoleTask = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		global.initTimer()
		self.doing = self.player:getTask():getDoingRoleTask()
		
		res_test_items = { --res_tasks
			{id=1001, type=4, roleExp=10, pro=20, multiple=1.5, precond={roleLevel=10}, needps=100, cdtime=10, needtime=60, commmsg='commmsg',  berserkmsg='berserkmsg'}
			}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_start = function(self)
		self.mm:mock(self.doing, 'startDoing')
		self.mm:mock(self.doing, '_startCoolDown')
		self.doing:start()
		assertEQ ( self.mm.walkLog, 'startDoing,_startCoolDown' )
	end;
	
	test_setStopTime = function(self)
		assertEQ ( self.doing:getStopTime(), 0)
		self.doing:setStopTime(1)
		assertEQ ( self.doing:getStopTime(), 1)
	end;
	
	test_setTaskId = function(self)
		assertEQ ( self.doing:getTaskId(), 0)
		self.doing:setTaskId(1)
		assertEQ ( self.doing:getTaskId(), 1)
	end;
	
	test_setCDStopTime = function(self)
		assertEQ ( self.doing:getCDStopTime(), 0)
		self.doing:setCDStopTime(1)
		assertEQ ( self.doing:getCDStopTime(), 1)
	end;
	
	helper_createAlliance = function(self, player)
		local alliance = app:getAlliMgr():createAlliance(player, 'alliance', 'f')
		alliance:setLevel(1)
		player:setAlliId(alliance:getId())
		return alliance
	end;
	
	test_startDoing = function(self)
		local r_random = 20
		self.mm:mock(math, 'random', nil, function(a,b) return r_random end)
		
			
		self.mm:mock(TaskSender, 'sendDoingRoleTask')
		self.mm:mock(self.doing, '_startCoolDown')
		self.mm:mock(WUtil, 'sendPopBoxMsg')
		self.doing:startDoing()
		assertEQ ( self.mm.walkLog, '' )
		
		self.mm:clear()
		Util:setTimeDrt(20)
		self.doing:setStopTime(30)
		self.doing:startDoing()
		assertEQ ( self.mm.walkLog, '' )
		
		self.mm:clear()
		Util:setTimeDrt(20)
		self.doing:setTaskId(1001)
		self.doing:setStopTime(30)
		self.doing:startDoing()
		assertEQ ( self.mm.params['sendDoingRoleTask'], {self.player} )
		
		self.mm:clear()
		Util:setTimeDrt(29)
		os.setClockMs( (29-20)*1000 )
		global.getTimer():update()
		
		local oldXP =  self.player:getAttrVal(ATTR.XP)
		self.mm:clear()
		Util:setTimeDrt(31 - 1) -- 模拟1秒的误差
		os.setClockMs( (31-20)*1000 )
		global.getTimer():update()
		assertEQ ( self.doing:getTaskId(), 0 )
		assertEQ ( self.doing:getStopTime(), 0 )
		assertEQ ( self.doing:getCDStopTime(), 30 + 10 )
		assertEQ ( self.player:getAttrVal(ATTR.XP), oldXP + 15, 'berserk drop' )
		assertEQ ( self.mm.walkLog, 'random,sendPopBoxMsg,_startCoolDown,sendDoingRoleTask' )
		assertEQ ( self.mm.params['sendDoingRoleTask'], {self.player} )
		assertEQ ( self.mm.params['sendPopBoxMsg'], {self.player, 'berserkmsg'} )
		
		self.mm:clear()
		Util:setTimeDrt(50)
		os.setClockMs( (50-20)*1000 )
		global.getTimer():update()
		assertEQ ( self.mm.walkLog, '' )
		assertEQ ( self.player:getAttrVal(ATTR.XP), oldXP + 15 )
		
		self.player:setVipLevel(5)
		r_random = 100
		oldXP =  self.player:getAttrVal(ATTR.XP)
		self.mm:clear()
		Util:setTimeDrt(60)
		self.doing:setTaskId(1001)
		self.doing:setStopTime(70)
		self.doing:startDoing()
		self.mm:clear()
		Util:setTimeDrt(70)
		os.setClockMs( (50-20 + 70-60)*1000 )
		global.getTimer():update()
		assertEQ ( global.getTimer():isStoped(), true )
		assertEQ ( self.player:getAttrVal(ATTR.XP), oldXP + 10, 'comm drop' )
		assertEQ ( self.mm.params['sendPopBoxMsg'], {self.player, 'commmsg'} )
		assertEQ ( self.doing:getCDStopTime(), 70 )
		
		
		self.mm:clear()
		self.doing:setTaskId(1001)
		self.doing:setStopTime(80)
		self.doing:startDoing()
		self.mm:clear()
		Util:setTimeDrt(80-2) -- 模拟以前的一个废弃的时钟节点
		os.setClockMs( (50-20 + 70-60 + 80-70)*1000 )
		global.getTimer():update()
		assertEQ ( global.getTimer():isStoped(), true )
		assertEQ ( self.mm.walkLog, '', '模拟以前的一个废弃的时钟节点')
		
		self.mm:clear()
		self.doing:setTaskId(1001)
		self.doing:setStopTime(90)
		self.doing:startDoing()
		self.mm:clear()
		Util:setTimeDrt(90)
		os.setClockMs( (50-20 + 70-60 + 80-70 + 90-80 + 2)*1000 )
		self.doing:setTaskId(0) -- 清空当前doing的taskid
		self.doing:setStopTime(0) --  清空当前doing的stoptime
		global.getTimer():update()
		assertEQ ( global.getTimer():isStoped(), true )
		assertEQ ( self.mm.walkLog, '', '当前已经不是doing状态')
	end;
	
	test_roleTaskAddAllianceHonour = function(self)
		self.mm:travelMock(app:getAlliMgr(), 'addAllianceEvent')
		
		Util:setTimeDrt(20)
		self.doing:setTaskId(1001)
		self.doing:setStopTime(30)
		self.doing:startDoing()
		Util:setTimeDrt(31 - 1)
		os.setClockMs( (31-20)*1000 )
		global.getTimer():update()
		assertEQ ( self.doing:getTaskId(), 0 )
		assertEQ ( self.mm.walkLog, '', 'has no alliance' )
		
		self.mm:clear()
		local alliance = self:helper_createAlliance(self.player)
		local oldHonour = alliance:getHonour()
		local oldEventCount =alliance:getEventsCount()
		Util:setTimeDrt(60)
		self.doing:setTaskId(1001)
		self.doing:setStopTime(70)
		self.doing:startDoing()
		Util:setTimeDrt(70)
		os.setClockMs( (70-20)*1000 )
		res_test_items[1].needps = 90
		global.getTimer():update()
		assertEQ ( self.doing:getTaskId(), 0 )
		local addHonour = 1 --max (1, res_test_items[1].needps/100 )
		assertEQ ( self.mm.params['addAllianceEvent'], {alliance, 'roleTask', {roleName=self.player:getRoleName(), addHonour=addHonour}} )
		assertEQ ( alliance:getHonour(),  oldHonour + addHonour  )
		assertEQ ( alliance:getEventsCount(), oldEventCount + 1 )
		local event = string.format(rstr.alliance.events.roleTask, self.player:getRoleName(), 1 )
		assertEQ ( alliance:getEventByIdx(0), {event=event, createTime=Util:getTime()} )
		
		self.mm:clear()
		oldHonour = alliance:getHonour()
		Util:setTimeDrt(70)
		self.doing:setTaskId(1001)
		self.doing:setStopTime(80)
		self.doing:startDoing()
		Util:setTimeDrt(80)
		os.setClockMs( (80-20)*1000 )
		res_test_items[1].needps = 210
		global.getTimer():update()
		assertEQ ( self.doing:getTaskId(), 0)
		local addHonour = 2 --floor(res_test_items[1].needps/100)
		assertEQ ( alliance:getHonour(),  oldHonour + addHonour  )
	end;
	
	test__startCoolDown = function(self)
		self.mm:mock(TaskSender, 'sendDoingRoleTask')
		self.doing:_startCoolDown()
		assertEQ ( self.mm.walkLog, '' )
		
		self.mm:clear()
		Util:setTimeDrt(20)
		self.doing:setCDStopTime(30)
		self.doing:_startCoolDown()
		assertEQ ( self.mm.params['sendDoingRoleTask'], {self.player} )
		
		self.mm:clear()
		Util:setTimeDrt(30 - 1) -- 模拟1秒的误差
		os.setClockMs((30 - 20)*1000)
		global.getTimer():update()
		assertEQ ( self.doing:getCDStopTime(), 0 )
		assertEQ ( self.mm.params['sendDoingRoleTask'], {self.player} )
		
		self.mm:clear()
		Util:setTimeDrt(40)
		os.setClockMs((40 - 20)*1000)
		global.getTimer():update()
		assertEQ ( self.mm.walkLog, '' )
		
		self.doing:setCDStopTime(50)
		self.doing:_startCoolDown()
		self.mm:clear()
		Util:setTimeDrt(48)
		os.setClockMs((50 - 20)*1000)
		global.getTimer():update()
		assertEQ ( self.mm.walkLog, '', '模拟以前一个废弃的时钟节点，时间没有达到' )
	end;
})

local TestCaseEveryDayTask = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		global.initTimer()
		self.everyday = self.player:getTask():getEveryDayTask()
		
		res_everyday_tasks = {{id=1000, type=4, precond={roleLevel=10}, dropId=7500001}
			,{id=1001, type=4, precond={roleLevel=20}, dropId=7500001} 
			,{id=1002, type=4, precond={roleLevel=30}, dropId=7500001} 
			}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_randTasks = function(self)
		self.mm:mock(math, 'random', nil, function(a,b)
			if b ~= nil then return b end
			return a
			end)
			
		Util:setTimeDrt(1379520000)
		self.player:getPersistVar().tasks.refreshTime = 1379520000
		assertEQ ( self.everyday:getTaskCount(), 0 )

		self.player:setLevel(10)
		self.everyday:randTasks()
		assertEQ ( self.everyday:getTaskCount(), 7 )
		assertEQ ( self.everyday:getTask(1).taskId, 1000 )
		
		self.player:setLevel(20)
		self.everyday:randTasks()
		assertEQ ( self.everyday:getTask(1).taskId, 1000 )
		
		self.player:setVipLevel(1)
		self.player:getPersistVar().tasks.refreshTime = 1379520000 + 24*3600
		self.everyday:randTasks()
		assertEQ ( self.everyday:getTask(1).taskId, 1001 )
		assertEQ ( self.everyday:getTaskCount(), 7 + 1 )
	end;
	
	test__randTasks = function(self)
		self.mm:mock(TaskSender, 'sendDelEveryDayTasks')
		self.mm:mock(TaskSender, 'sendEveryDayTasks')
		assertEQ ( self.everyday:getTaskCount(), 0 )
		self.player:setLevel(1)
		self.everyday:_randTasks()
		assertEQ ( self.everyday:getTaskCount(), 0 )
		
		self.player:setLevel(10)
		self.everyday:_randTasks()
		assertEQ ( self.everyday:getTaskCount(), 7 )
		
		assertEQ ( self.everyday:getTask(1).taskId, 1000 )
		assertEQ ( self.everyday:getTask(1).state, 0 )
		assertEQ ( self.everyday:getTask(2).taskId, 1000 )
		assertEQ ( self.everyday:getTask(3).taskId, 1000 )
		assertEQ ( self.everyday:getTask(4).taskId, 1000 )
		assertEQ ( self.everyday:getTask(5).taskId, 1000 )
		assertEQ ( self.everyday:getTask(6).taskId, 1000 )
		assertEQ ( self.everyday:getTask(7).taskId, 1000 )
		assertEQ ( self.mm.params['sendDelEveryDayTasks'], {self.player} )
		assertEQ ( self.mm.params['sendEveryDayTasks'], {self.player} )
		
		self.player:setLevel(20)
		self.everyday:_randTasks()
		assertEQ ( self.everyday:getTaskCount(), 7 )
		assertEQ ( self.everyday:getTask(1).taskId < 1002, true )
		assertEQ ( self.everyday:getTask(2).taskId < 1002, true )
		assertEQ ( self.everyday:getTask(3).taskId < 1002, true )
		assertEQ ( self.everyday:getTask(4).taskId < 1002, true )
		assertEQ ( self.everyday:getTask(5).taskId < 1002, true )
		assertEQ ( self.everyday:getTask(6).taskId < 1002, true )
		assertEQ ( self.everyday:getTask(7).taskId < 1002, true )
	end;
	
	test_randTask = function(self)
		self.mm:travelMock(TaskSender, 'sendDelEveryDayTask')
		self.mm:travelMock(TaskSender, 'sendEveryDayTask')
		
		self.player:setLevel(10)
		self.everyday:_randTasks()
		assertEQ ( self.everyday:getTask(1).taskId, 1000 )
		
		self.mm:mock(math, 'random', nil, function(a,b)
			if b ~= nil then return b end
			return a
			end)
			
		self.player:setLevel(1)
		self.everyday:randTask(1)
		assertEQ ( self.everyday:getTask(1).taskId, 1000 )
		
		self.player:setLevel(20)
		clearSendMsg_t()
		self.everyday:randTask(1)
		assertEQ ( self.everyday:getTask(1).taskId, 1001 )
		assertEQ ( self.mm.params['sendDelEveryDayTask'], {self.player, 1} )
		assertEQ ( self.mm.params['sendEveryDayTask'], {self.player, 1} )
		assertEQ ( isInclude(getSendMsg_t(1),  'id:100001,_d:1'), true )
		assertEQ ( isInclude(getSendMsg_t(2),  'id:100101,state:0'), true )
	end;
	
	test_setTimer_refreshTime_longAgo = function(self)
		self.mm:mock(math, 'random', nil, function(a,b)
			if b ~= nil then return b end
			return a
			end)
			
		local startTime = 1379511396 - 24*3600
		Util:setTimeDrt(1379511396)
		TestCaseHelper:createPlayer(self, function(player)
			player:setLevel(10)
			player:getPersistVar().tasks.refreshTime = startTime
		end)
		self.everyday = self.player:getTask():getEveryDayTask()
		
		assertEQ ( self.everyday:getTaskCount(), 7 )
		assertEQ ( self.everyday:getTask(1).taskId, 1000 )
		assertEQ ( self.player:getPersistVar().tasks.refreshTime, 1379511396 + 10)
		
		self.player:setLevel(20)
		Util:setTimeDrt(1379520000-1)
		os.setClockMs( (1379520000 - startTime - 1)*1000 )
		global.getTimer():update()
		assertEQ ( self.everyday:getTaskCount(), 7 )
		assertEQ ( self.everyday:getTask(1).taskId, 1000 )
		assertEQ ( self.player:getPersistVar().tasks.refreshTime, 1379511396 + 10)
		
		Util:setTimeDrt(1379520000)
		os.setClockMs( (1379520000 -startTime )*1000 )
		global.getTimer():update()
		assertEQ ( self.everyday:getTaskCount(), 7 )
		assertEQ ( self.everyday:getTask(1).taskId, 1001 )
		assertEQ ( self.player:getPersistVar().tasks.refreshTime, 1379520000 + 10)
		
		self.player:setLevel(30)
		Util:setTimeDrt(1379520000 + 24*3600 - 1)
		os.setClockMs( (1379520000 + 24*3600 - 1 - startTime )*1000 )
		global.getTimer():update()
		assertEQ ( self.everyday:getTaskCount(), 7 )
		assertEQ ( self.everyday:getTask(1).taskId, 1001 )
		assertEQ ( self.player:getPersistVar().tasks.refreshTime, 1379520000 + 10)
		
		self.player:setLevel(30)
		Util:setTimeDrt(1379520000 + 24*3600)
		os.setClockMs( (1379520000 + 24*3600 - startTime )*1000 )
		global.getTimer():update()
		assertEQ ( self.everyday:getTaskCount(), 7 )
		assertEQ ( self.everyday:getTask(1).taskId, 1002 )
		assertEQ ( self.player:getPersistVar().tasks.refreshTime, 1379520000 + 24*3600 + 10)
	end;
	
	test_setTimer_refreshTime_today = function(self)
		self.mm:mock(math, 'random', nil, function(a,b)
			if b ~= nil then return b end
			return a
			end)
			
		Util:setTimeDrt(1379511396)
		TestCaseHelper:createPlayer(self, function(player)
			player:setLevel(10)
			player:getPersistVar().tasks.refreshTime = 1379511396
		end)
		self.everyday = self.player:getTask():getEveryDayTask()
		
		assertEQ ( self.everyday:getTaskCount(), 0 )
		assertEQ ( self.player:getPersistVar().tasks.refreshTime, 1379511396)
		
		self.player:setLevel(20)
		Util:setTimeDrt(1379520000)
		os.setClockMs( (1379520000 - 1379511396)*1000 )
		global.getTimer():update()
		assertEQ ( self.everyday:getTaskCount(), 7 )
		assertEQ ( self.everyday:getTask(1).taskId, 1001 )
		assertEQ ( self.player:getPersistVar().tasks.refreshTime, 1379520000 + 10)
	end;
	
	test_setTaskState = function(self)
		self.mm:mock(TaskSender, 'sendEveryDayTask')
		self.mm:mock(TaskFinisher, 'trigerTask')
		self.player:setLevel(10)
		self.everyday:_randTasks()
		assertEQ ( self.everyday:getTaskState(100001), 0 )
		self.everyday:setTaskState(100001, 1)
		assertEQ ( self.everyday:getTaskState(100001), 1 )
		assertEQ ( self.mm.walkLog, 'sendEveryDayTask' )
		assertEQ ( self.mm.params['sendEveryDayTask'], {self.player, 1} )
		
		self.mm:clear()
		self.everyday:setTaskState(100001, TASK_STATE.COMPLETE)
		assertEQ ( self.everyday:getTaskState(100001), TASK_STATE.COMPLETE )
		assertEQ ( self.mm.walkLog, 'sendEveryDayTask,trigerTask' )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.FINISH_ONE_EVERYDAYTASK} )
	end;
})

local TestCaseActivityVal = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.activityVal = self.player:getTask():getActivityVal()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_setGotActReward = function(self)
		local gotActRewards = self.activityVal:getGotActRewards()
		assertEQ ( gotActRewards:isGotReward(1), false)
		assertEQ ( gotActRewards:isGotReward(2), false)
		assertEQ ( gotActRewards:isGotReward(3), false)
		assertEQ ( gotActRewards:isGotReward(4), false)
		
		Util:setTimeDrt(1379520000)
		gotActRewards:setGotReward(1)
		assertEQ ( gotActRewards:isGotReward(1), true)
		gotActRewards:setGotReward(2)
		assertEQ ( gotActRewards:isGotReward(2), true)
		gotActRewards:setGotReward(3)
		assertEQ ( gotActRewards:isGotReward(3), true)
		
		Util:setTimeDrt(1379520000 + 24*3600)
		assertEQ ( gotActRewards:isGotReward(1), false)
		gotActRewards:setGotReward(2)
		assertEQ ( gotActRewards:isGotReward(2), true)
		assertEQ ( gotActRewards:isGotReward(3), false)
	end;
	
	test_setTodayVal = function(self)
		self.mm:mock(ActivityValSender, 'sendVal')
		assertEQ ( self.activityVal:getTodayVal(), 0 )
		Util:setTimeDrt(1379520000)
		self.activityVal:setTodayVal(1)
		assertEQ ( self.activityVal:getTodayVal(), 1 )
		self.activityVal:setTodayVal(2)
		assertEQ ( self.activityVal:getTodayVal(), 2 )
		self.activityVal:setTodayVal(101)
		assertEQ ( self.activityVal:getTodayVal(), 100 )
		assertEQ ( self.mm.params['sendVal'], {self.player} )
		Util:setTimeDrt(1379520000 + 24*3600)
		assertEQ ( self.activityVal:getTodayVal(), 0 )
		
	end;
	
	test_todaySign = function(self)
		assertEQ ( self.activityVal:getSigninDays(), 0 )
		assertEQ ( self.activityVal:isTodaySigned(), false )
		Util:setTimeDrt(1377964800)
		self.activityVal:todaySign()
		assertEQ ( self.activityVal:isTodaySigned(), true )
		assertEQ ( self.activityVal:getSigninDays(), 1 )
		self.activityVal:todaySign()
		assertEQ ( self.activityVal:getSigninDays(), 1, 'same day sign, not inc signindays' )
		
		Util:setTimeDrt(1377964800 + 24*3600)
		assertEQ ( self.activityVal:isTodaySigned(), false )
		self.activityVal:todaySign()
		assertEQ ( self.activityVal:isTodaySigned(), true )
		assertEQ ( self.activityVal:getSigninDays(), 2)
		for day=1, 29, 1 do
			Util:setTimeDrt(1377964800 + day*24*3600)
			self.activityVal:todaySign()
		end
		assertEQ ( self.activityVal:getSigninDays(), res_max_signin_days )
		
		Util:setTimeDrt(1377964800 + 40*24*3600)
		assertEQ ( self.activityVal:getSigninDays(), 0, 'next month')
		self.activityVal:todaySign()
		assertEQ ( self.activityVal:getSigninDays(), 1, 'next month')
	end;
	
	test_setGotSigninReward = function(self)
		local gotSigninRewards = self.activityVal:getGotSigninRewards()
		
		assertEQ ( gotSigninRewards:isGotReward(1), false)
		assertEQ ( gotSigninRewards:isGotReward(2), false)
		assertEQ ( gotSigninRewards:isGotReward(3), false)
		
		Util:setTimeDrt(1379520000)
		gotSigninRewards:setGotReward(1)
		assertEQ ( gotSigninRewards:isGotReward(1), true)
		gotSigninRewards:setGotReward(2)
		assertEQ ( gotSigninRewards:isGotReward(2), true)
		gotSigninRewards:setGotReward(3)
		assertEQ ( gotSigninRewards:isGotReward(3), true)
		
		Util:setTimeDrt(1379520000 + 24*3600)
		assertEQ ( gotSigninRewards:isGotReward(1), true)
		gotSigninRewards:setGotReward(2)
		assertEQ ( gotSigninRewards:isGotReward(2), true)
		assertEQ ( gotSigninRewards:isGotReward(3), true)	
		
		Util:setTimeDrt(1379520000 + 20*24*3600)
		assertEQ ( gotSigninRewards:isGotReward(1), false)
		gotSigninRewards:setGotReward(2)
		assertEQ ( gotSigninRewards:isGotReward(2), true)
		assertEQ ( gotSigninRewards:isGotReward(3), false)	
	end;
	
	test_getTaskCount = function(self)
		res_activityval_tasks = {}
		assertEQ ( self.activityVal:getTaskCount(), 0 )
		res_activityval_tasks = {
			{id=7001, type=7, times=2, val=3, docond={{type=TASK_FINISH_TYPE.FEED_LIGHTLAW, val1=0, val2=0, val3=0}}}
			,{id=7002, type=7, times=2, val=3, docond={{type=TASK_FINISH_TYPE.FEED_LIGHTLAW, val1=0, val2=0, val3=0}}}
			}
		assertEQ ( self.activityVal:getTaskCount(), 2 )
	end;
	
	test_getTask = function(self)
		Util:setTimeDrt(1379520000)
		res_activityval_tasks = {
			{id=7001, type=7, times=2, val=3, docond={{type=TASK_FINISH_TYPE.FEED_LIGHTLAW, val1=0, val2=0, val3=0}}}
			,{id=7002, type=7, times=2, val=3, docond={{type=TASK_FINISH_TYPE.FEED_LIGHTLAW, val1=0, val2=0, val3=0}}}
			}
		assertEQ ( self.activityVal:getTask(1).taskId, 7001 )
		assertEQ ( self.activityVal:getTask(1).times, 0 )
		
		self.activityVal:addTaskTimes(1)
		assertEQ ( self.activityVal:getTask(1).times, 1 )
		self.activityVal:addTaskTimes(1)
		assertEQ ( self.activityVal:getTask(1).times, 2 )
		
		assertEQ ( self.activityVal:getTask(2).taskId, 7002 )
		assertEQ ( self.activityVal:getTask(2).times, 0 )
		
		self.activityVal:addTaskTimes(2)
		assertEQ ( self.activityVal:getTask(2).times, 1 )
		self.activityVal:addTaskTimes(2)
		assertEQ ( self.activityVal:getTask(2).times, 2 )
		
		Util:setTimeDrt(1379520000 + 24*3600)
		assertEQ ( self.activityVal:getTask(1).times, 0 )
		assertEQ ( self.activityVal:getTask(2).times, 0 )
	end;
	
	test_addTaskTimes = function(self)
		Util:setTimeDrt(1379520000)
		self.mm:mock(TaskSender, 'sendActValTask')
		self.activityVal:addTaskTimes(1)
		assertEQ ( self.activityVal:getTask(1).times, 1 )
		assertEQ ( self.mm.params['sendActValTask'], {self.player, 7001, 1})
		
		self.activityVal:addTaskTimes(1)
		assertEQ ( self.mm.params['sendActValTask'], {self.player, 7001, 2})
		
		Util:setTimeDrt(1379520000 + 24*3600)
		self.activityVal:addTaskTimes(1)
		assertEQ ( self.mm.params['sendActValTask'], {self.player, 7001, 1})
	end;
	
	test_todayGetOnlineGoods = function(self)
		local r_onlineGoods = {0}
		self.mm:mock(	app:getSvrAct(), 'getOnlineGoods', r_onlineGoods)
		self.mm:mock(	WUtil, 'sendWarningMsgArgs')
		assertEQ ( self.activityVal:isTodayGotOnlineGoods(), false )
		Util:setTimeDrt(1377964800)
		self.activityVal:todayGetOnlineGoods()
		assertEQ ( self.activityVal:isTodayGotOnlineGoods(), false, 'today has not gift goods' )
		assertEQ ( self.mm.walkLog, 'getOnlineGoods' )
		
		self.mm:clear()
		self.player:getPkg():setMaxGridsCnt(0)
		r_onlineGoods[1] = 2500001
		self.activityVal:todayGetOnlineGoods()
		assertEQ ( self.activityVal:isTodayGotOnlineGoods(), false, 'has no enough pkg space' )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100129, ''} )
		
		self.mm:clear()
		self.player:getPkg():setMaxGridsCnt(10)
		self.activityVal:todayGetOnlineGoods()
		assertEQ ( self.activityVal:isTodayGotOnlineGoods(), true)
		assertEQ ( self.player:getPkg():getItemNumber(2500001), 1 )
		
		self.activityVal:todayGetOnlineGoods()
		assertEQ ( self.player:getPkg():getItemNumber(2500001), 1 )
		
		Util:setTimeDrt(1377964800 + 1)
		self.activityVal:todayGetOnlineGoods()
		assertEQ ( self.player:getPkg():getItemNumber(2500001), 1 )
		
		Util:setTimeDrt(1377964800 + 24*3600)
		self.activityVal:todayGetOnlineGoods()
		assertEQ ( self.player:getPkg():getItemNumber(2500001), 2 )
	end;
})

local TestCaseOnlineTask = TestCase:extends({
	setUp = function(self)
		res_online_tasks = {
			{id=1790001, precond={taskId=0}, type=TASK_TYPE.ONELINE, circleType=0, duration=15}
			,{id=1790002, precond={taskId=1790001}, type=TASK_TYPE.ONELINE, circleType=0, duration=60}
			,{id=1790003, precond={taskId=1790002}, type=TASK_TYPE.ONELINE, circleType=0, duration=180}
			,{id=1790004, precond={taskId=1790003}, type=TASK_TYPE.ONELINE, circleType=0, duration=300}
			
			,{id=1790005, precond={taskId=1790004}, type=TASK_TYPE.ONELINE, circleType=1, duration=3600}
			,{id=1790006, precond={taskId=1790005}, type=TASK_TYPE.ONELINE, circleType=1, duration=3600*2}
			}

		TestCaseHelper:createPlayer(self)
		self.onlineTask = self.player:getTask():getOnlineTask()
		FIXID.FIRST_ONLINE_CIRCLETASK = 1790005
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	-- when create player, need add two taskid
	test_whenCreatePlayer = function(self)
		self.mm:mock(TaskSender, 'sendOnlineTask')
		Util:setTimeDrt(1379520000)
		self.onlineTask:setTask(1790001, 0)
		assertEQ ( self.onlineTask:getTaskId(), 1790001 )
		assertEQ ( self.onlineTask:getTaskStopTime(), 1379520000 + 15 )
		assertEQ ( self.mm.walkLog, 'sendOnlineTask' )
		assertEQ ( self.mm.params['sendOnlineTask'], {self.player} )
		
		Util:setTimeDrt(1379520000 + 14)
		assertEQ ( self.onlineTask:getTaskStopTime(), 1379520000 + 15 )
		
		Util:setTimeDrt(1379520000 + 15)
		assertEQ ( self.onlineTask:getTaskStopTime(), 1379520000 + 15 )
		
		Util:setTimeDrt(1379520000 + 16)
		assertEQ ( self.onlineTask:getTaskStopTime(), 1379520000 + 15 )
		
		
		self.onlineTask:setTask(0, 0)
		assertEQ ( self.onlineTask:getTaskStopTime(), 0, 'when taskId is 0' )
	end;
	
	test_savePlayer = function(self)
		Util:setTimeDrt(1379520000)
		self.onlineTask:setTask(1790001, 0)
		Util:setTimeDrt(1379520000+5)
		self.player:save()
		
		assertEQ ( self.onlineTask:_getLastTime(), 1379520000+5 )
		assertEQ ( self.onlineTask.onlineTask.lastLapsed, 5 )
		
		assertEQ ( self.onlineTask:getTaskStopTime(), 1379520000 + 15 )
	end;
	
	test_onLogin =  function(self)
		Util:setTimeDrt(1379520000)
		self.onlineTask:setTask(1790001, 0)
		Util:setTimeDrt(1379520000+5)
		self.player:save()
		
		assertEQ ( self.onlineTask:_getLastTime(), 1379520000+5 )
		assertEQ ( self.onlineTask:_getStartTime(), 1379520000 )
		assertEQ ( self.onlineTask.onlineTask.lastLapsed, 5 )
		
		Util:setTimeDrt(1379520000 + 100)
		self.player:loginStart()
		
		assertEQ ( self.onlineTask:_getLastTime(), 1379520000+100 )
		assertEQ ( self.onlineTask:_getStartTime(), 1379520000 )
		assertEQ ( self.onlineTask.onlineTask.lastLapsed, 5 )
		assertEQ ( self.onlineTask:getTaskStopTime(), 1379520000+100+(15-5)  )
	end;
	
	test_taskComplete = function(self)
		Util:setTimeDrt(1379520000)
		self.onlineTask:setTask(1790001, 0)
		Util:setTimeDrt(1379520000+5)
		self.player:save()
		
		assertEQ ( self.onlineTask:_getLastTime(), 1379520000+5 )
		assertEQ ( self.onlineTask.onlineTask.lastLapsed, 5 )
		
		self.mm:mock(TaskSender, 'sendOnlineTask')
		Util:setTimeDrt(1379520000 + 100)
		self.onlineTask:setTask(1790001, TASK_STATE.COMPLETE)
		assertEQ ( self.onlineTask:getTaskId(), 1790002 )
		assertEQ ( self.onlineTask:_getLastTime(), 1379520000 + 100)
		assertEQ ( self.onlineTask.onlineTask.lastLapsed, 0 )
		assertEQ ( self.onlineTask:getTaskStopTime(), 1379520000 + 100 + 60 )
		assertEQ ( self.mm.walkLog, 'sendOnlineTask' )
		assertEQ ( self.mm.params['sendOnlineTask'], {self.player} )
		assertEQ ( self.onlineTask:isCircled(), false)
		
		self.onlineTask:setTask(1790004, TASK_STATE.COMPLETE)
		assertEQ ( self.onlineTask:getTaskId(), 1790005 )
		assertEQ ( self.onlineTask:isCircled(), true)
		
		self.onlineTask:setTask(1790006, TASK_STATE.COMPLETE)
		assertEQ ( self.onlineTask:getTaskId(), 0 )
	end;
	
	test_acrossOneDay_noCircelTask = function(self)
		self.onlineTask.onlineTask.isCircled = 0
		
		Util:setTimeDrt(1379520000)
		self.onlineTask:setTask(1790001, 0)
		Util:setTimeDrt(1379520000 + 10)
		self.player:save()
		
		Util:setTimeDrt(1379520000 + 24*3600 + 10)
		self.player:loginStart()
		assertEQ ( self.onlineTask.onlineTask.lastLapsed, 10 )
		assertEQ ( self.onlineTask.onlineTask.lastTime, 1379520000 + 24*3600 + 10 )
		assertEQ ( self.onlineTask:_getStartTime(), 1379520000 )
		assertEQ ( self.onlineTask:getTaskId(), 1790001 )
	end;
	
	test_acrossOneDay_circelTask = function(self)
		self.onlineTask.onlineTask.isCircled = 1
		
		Util:setTimeDrt(1379520000)
		self.onlineTask:setTask(1790005, 0)
		Util:setTimeDrt(1379520000 + 3600/2)
		self.player:save()
		assertEQ ( self.onlineTask.onlineTask.lastLapsed, 3600/2 )
		
		Util:setTimeDrt(1379520000 + 23*3600 + 3600 - 600) -- 23:50 再次登录，时间是累计的
		self.player:loginStart()
		Util:setTimeDrt(1379520000 + 24*3600 + 600) -- 00:10 一直到次日凌晨
		assertEQ ( self.onlineTask:getTaskStopTime(), 1379520000 + 24*3600 + 2*600 ) -- 结束时间是 次日 00:20
		
		self.onlineTask:setTask(1790006, 0)
		Util:setTimeDrt(1379520000 + 24*3600 + 600 + 3600) --次日
		self.player:save()
		assertEQ ( self.onlineTask.onlineTask.lastLapsed , 3600)
		
		Util:setTimeDrt(1379520000 + 24*3600 + 24*3600 + 600) -- 第三天登录
		self.player:loginStart()
		assertEQ ( self.onlineTask:getTaskId(), 1790005 )  -- 初始化taskId为起始的可循环id
		assertEQ ( self.onlineTask.onlineTask.lastLapsed , 0)  -- 上次的流逝时间清空
		assertEQ ( self.onlineTask:_getLastTime(), 1379520000 + 24*3600 + 24*3600 + 600)
		
		self.onlineTask:setTask(1790006, TASK_STATE.COMPLETE)
		assertEQ ( self.onlineTask:getTaskId(), 0 )
		Util:setTimeDrt(1379520000 + 24*3600 + 72*3600 + 600)
		assertEQ ( self.onlineTask:getTaskId(), 0, '用户在线一直都不刷新' )
	end;
})

local TestCaseNewcomerTask_ = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.newTask = self.player:getTask():getNewcomerTask()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_setCurTaskId = function(self)
		assertEQ ( self.newTask:getCurTaskId(), 1750001 )
		self.newTask:setCurTaskId(1)
		assertEQ ( self.newTask:getCurTaskId(), 1 )
	end;
	
	test_setTaskEnd = function(self)
		assertEQ ( self.newTask:isTaskEnd(), false )
		self.newTask:setTaskEnd()
		assertEQ ( self.newTask:isTaskEnd(), true )
	end;
	
	test_setGlobalTipEnd = function(self)
		assertEQ ( self.newTask:isGlobalTipEnd(), false )
		self.newTask:setGlobalTipEnd()
		assertEQ ( self.newTask:isGlobalTipEnd(), true )
	end;
})

local TestCaseYellowDiamondTask = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.ydTask = self.player:getTask():getYDTask()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_setGotNewGift = function(self)
		assertEQ ( self.ydTask:getGotNewGift(), 0 )
		self.ydTask:setGotNewGift()
		assertEQ ( self.ydTask:getGotNewGift(), 1 )
	end;
	
	test_setGotCommGift = function(self)
		Util:setTimeDrt(1000)
		assertEQ ( self.ydTask:getGotCommGift(), 0 )
		self.ydTask:setGotCommGift()
		assertEQ ( self.ydTask:getGotCommGift(), 1000 )
	end;
	
	test_setGotYearGift = function(self)
		Util:setTimeDrt(1000)
		assertEQ ( self.ydTask:getGotYearGift(), 0 )
		self.ydTask:setGotYearGift()
		assertEQ ( self.ydTask:getGotYearGift(), 1000 )
	end;
	
	test_getGotLvlGifts = function(self)
		local gifts = self.ydTask:getGotLvlGifts()
		assertEQ ( gifts:getCount(), 0 )
		gifts:insert(1)
		assertEQ ( gifts:getCount(), 1 )
		assertEQ ( gifts:has(1), true )
	end;
})

local TestCasePayActTask = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.payAct = self.player:getTask():getPayAct()
		
		res_pay_act_gifts={{itemid=3000246,itemtip='内含武将经验卡*20、精力卡*10、初级招贤榜*20，黑木令*5、高级迁城令*1、斗王弓*1',pri=1,id=1,allpay=1000}
		,{itemid=3000248,itemtip='内含武将经验卡*30、精力卡*10、初级精华宝盒*10、初级任务箱包*10、排程卡*2、高级免战牌*1、斗王盔*1',pri=2,id=2,allpay=2000}
		,{itemid=3000250,itemtip='内含武将经验卡*20、精力卡*10、中级精华宝盒*10、中级任务箱包*10、4级灵石礼包*1、斗王甲*1',pri=3,id=3,allpay=5000}
		,{itemid=3000252,itemtip='内含武将经验卡*30、精力卡*10、人和密卷*1、山羊*1、4级灵石礼包*3、斗王靴*1',pri=4,id=4,allpay=10000}
		,{itemid=3000254,itemtip='内含武将经验卡*40、精力卡*20、地利密卷*1、阵法残页盒*1、5级灵石礼包*1、斗王珮*1、斗王环*1',pri=5,id=5,allpay=20000}
		,{itemid=3000256,itemtip='内含武将经验卡*50、精力卡*25、天时密卷*1、惊帆*1、5级灵石礼包*3、狂战斧*1',pri=6,id=6,allpay=50000}
		}

		res_pay_act_returns={{id=1,returnper=40,allpay=1000}
		,{id=2,returnper=50,allpay=3000}
		,{id=3,returnper=55,allpay=5000}
		,{id=4,returnper=65,allpay=10000}
		,{id=5,returnper=80,allpay=20000}
		,{id=6,returnper=85,allpay=50000}
		,{id=7,returnper=100,allpay=99999999}
		}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		res_dayacts = {
			{id=1, date=1379520000 + 0*24*3600, acts={}}
			,{id=2, date=1379520000 + 1*24*3600, acts={SVR_TODAY_ACT_TYPE.ACT_PAY_1}}
			,{id=3, date=1379520000 + 2*24*3600, acts={SVR_TODAY_ACT_TYPE.ACT_PAY_1}}
			,{id=4, date=1379520000 + 3*24*3600, acts={SVR_TODAY_ACT_TYPE.ACT_PAY_1}}
			,{id=5, date=1379520000 + 4*24*3600, acts={SVR_TODAY_ACT_TYPE.ACT_PAY_1}}
			,{id=6, date=1379520000 + 5*24*3600, acts={}}
			,{id=7, date=1379520000 + 6*24*3600, acts={SVR_TODAY_ACT_TYPE.ACT_PAY_1}}
			,{id=8, date=1379520000 + 7*24*3600, acts={SVR_TODAY_ACT_TYPE.ACT_PAY_1}}
			,{id=9, date=1379520000 + 8*24*3600, acts={}}
		}
		app:getSvrAct():start()
	end;
	
	test_getAllGold = function(self)
		self.payAct:addGold(1)
		assertEQ ( self.payAct:getAllGold(), 1 )
		self.payAct:addGold(1)
		assertEQ ( self.payAct:getAllGold(), 2 )
	end;
	
	test_getActAllGold = function(self)
		self.mm:mock(ActivityValSender, 'sendPayActAllGold')
		Util:setTimeDrt(1379520000)
		app:getSvrAct():start()
		
		self.payAct:addGold(1)
		assertEQ ( self.payAct:getActAllGold(), 0 )
		
		Util:setTimeDrt(1379520000 + 2*24*3600)
		app:getSvrAct():start()
		self.payAct:addGold(1)
		assertEQ ( self.payAct:getActAllGold(), 1 )
		assertEQ ( self.mm.params['sendPayActAllGold'], {self.player} )
		
		Util:setTimeDrt(1379520000 + 3*24*3600)
		app:getSvrAct():start()
		self.payAct:addGold(2)
		assertEQ ( self.payAct:getActAllGold(), 3 )
		
		Util:setTimeDrt(1379520000 + 6*24*3600)
		app:getSvrAct():start()
		self.payAct:addGold(1)
		assertEQ ( self.payAct:getActAllGold(), 1 )
		
		Util:setTimeDrt(1379520000 + 7*24*3600)
		app:getSvrAct():start()
		self.payAct:addGold(1)
		assertEQ ( self.payAct:getActAllGold(), 2 )
	end;
	
	test_getGetGiftFlag = function(self)
		self.mm:mock(ActivityValSender, 'sendPayGiftGots')
		Util:setTimeDrt(1379520000)
		app:getSvrAct():start()
		self.payAct:addGold(10000)
		assertEQ ( self.payAct:getActAllGold(), 0 )
		
		self.payAct:setGetGiftFlag(0, 1)
		assertEQ ( self.payAct:getGetGiftFlag(0), 1 )
		assertEQ ( self.mm.params['sendPayGiftGots'], {self.player} )
		
		Util:setTimeDrt(1379520000 + 2*24*3600)
		app:getSvrAct():start()
		self.payAct:addGold(10000)
		assertEQ ( self.payAct:getActAllGold(), 10000 )
		self.payAct:setGetGiftFlag(0, 1)
		assertEQ ( self.payAct:getGetGiftFlag(0), 1 )
		
		Util:setTimeDrt(1379520000 + 6*24*3600)
		app:getSvrAct():start()
		assertEQ ( self.payAct:getActAllGold(), 10000, 'no clear when no add gold' )
		assertEQ ( self.payAct:getGetGiftFlag(0), 1 )
	end;
	
	test_check = function(self)
		self.player:setRoleName('role')
		self.mm:mock(app:getMailMgr(), 'addSysMail', {'mail'})
		self.mm:mock(MailSender, 'sendBriefMail')
		self.mm:mock(ActivityValSender, 'sendPayGiftGots')
		self.mm:mock(ActivityValSender, 'sendPayActAllGold')
		
		Util:setTimeDrt(1379520000 + 2*24*3600)
		app:getSvrAct():start()
		self.payAct:addGold(10000)
		assertEQ ( self.payAct:getActAllGold(), 10000 )
		
		Util:setTimeDrt(1379520000 + 5*24*3600)
		app:getSvrAct():start()
		self.payAct:check()
		assertEQ ( self.payAct:getActAllGold(), 0 )
		
		local number = math.ceil((10000*0.8)/10)
		local rawItems = {RawItemEx({id=0, resId=FIXID.GIFTGOLD_CARD_10, number=number})}
		assertEQ ( self.mm.params['addSysMail'], {'role', rstr.mail.title.payAct, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.payAct,  rawItems} )
		assertEQ ( self.mm.params['sendBriefMail'], {self.player, 'mail'} )
		assertEQ ( self.mm.params['sendPayGiftGots'], {self.player} )
		assertEQ ( self.mm.params['sendPayActAllGold'], {self.player} )
	end;
	
	test_check_noPayGold = function(self)
		self.mm:travelMock(app:getMailMgr(), 'addSysMail')
		
		Util:setTimeDrt(1379520000 + 2*24*3600)
		app:getSvrAct():start()
		self.payAct:addGold(0)
		assertEQ ( self.payAct:getActAllGold(), 0 )
		
		Util:setTimeDrt(1379520000 + 5*24*3600)
		app:getSvrAct():start()
		self.payAct:check()
		assertEQ ( self.payAct:getActAllGold(), 0 )
		assertEQ ( self.mm.walkLog, '' )
	end;
	
	test_getCount = function(self)
		assertEQ ( self.payAct:getCount(), MAX_PAYACT_GIFT_CNT )
	end;
	
	test_getGift = function(self)
		Util:setTimeDrt(1379520000 + 2*24*3600)
		app:getSvrAct():start()
		self.payAct:addGold(999)
		assertEQ ( self.payAct:getActAllGold(), 999 )
		assertEQ ( self.payAct:getGift(0), 0 )
		
		self.payAct:addGold(1)
		assertEQ ( self.payAct:getGift(0), 3000246 )
		assertEQ ( self.payAct:getGift(1), 0 )
		
		self.payAct:addGold(1000)
		assertEQ ( self.payAct:getGift(1), 3000248 )
		
		self.payAct:setGetGiftFlag(1, 1)
		assertEQ ( self.payAct:getGift(1), 0 )
	end;
})

local TestCaseWorldBossTask = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.worldboss = self.player:getTask():getWorldBoss()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_setTodayTimes = function(self)
		Util:setTimeDrt(1379520000)
		assertEQ ( self.worldboss:getTodayTimes(), 0 )
		self.worldboss:setTodayTimes(1)
		assertEQ ( self.worldboss:getTodayTimes(), 1 )
		Util:setTimeDrt(1379520000 + 24*3600)
		assertEQ ( self.worldboss:getTodayTimes(), 0 )
	end;
	
	test_setGuwuLevel = function(self)
		Util:setTimeDrt(1379520000)
		assertEQ ( self.worldboss:getGuwuLevel(), 0 )
		self.worldboss:setGuwuLevel(1)
		assertEQ ( self.worldboss:getGuwuLevel(), 1 )
		Util:setTimeDrt(1379520000 + 24*3600)
		assertEQ ( self.worldboss:getGuwuLevel(), 0 )
	end;
	
	test_setGotGift = function(self)
		Util:setTimeDrt(1379520000)
		assertEQ ( self.worldboss:getGotGift(), 0 )
		self.worldboss:setGotGift(1)
		assertEQ ( self.worldboss:getGotGift(), 1 )
		Util:setTimeDrt(1379520000 + 24*3600)
		assertEQ ( self.worldboss:getGotGift(), 0 )
	end;
	
	test_setPersonRankGiftTime = function(self)
		assertEQ ( self.worldboss:getPersonRankGiftTime(), 0 )
		self.worldboss:setPersonRankGiftTime(10)
		assertEQ ( self.worldboss:getPersonRankGiftTime(), 10 )
	end;
	
	test_setCountryRankGiftTime = function(self)
		assertEQ ( self.worldboss:getCountryRankGiftTime(), 0 )
		self.worldboss:setCountryRankGiftTime(10)
		assertEQ ( self.worldboss:getCountryRankGiftTime(), 10 )
	end;
})

local TestCaseSendRewardTask = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.rewardTask = self.player:getTask():getSendReward()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_xxx = function(self)
		assertEQ ( self.rewardTask:isSendedFirstHero(), false )
		self.rewardTask:setSendedFirstHero()
		assertEQ ( self.rewardTask:isSendedFirstHero(), true )
	end;
})

tqPlayerTask_t_main = function(suite)
	suite:addTestCase(TestCaseActTaskUtil, 'TestCaseActTaskUtil')
	suite:addTestCase(TestCasePlayerTask, 'TestCasePlayerTask')
	suite:addTestCase(TestCaseDoingRoleTask, 'TestCaseDoingRoleTask')
	suite:addTestCase(TestCaseEveryDayTask, 'TestCaseEveryDayTask')
	suite:addTestCase(TestCaseActivityVal, 'TestCaseActivityVal')
	suite:addTestCase(TestCaseOnlineTask, 'TestCaseOnlineTask')
	suite:addTestCase(TestCaseNewcomerTask, 'TestCaseNewcomerTask')
	suite:addTestCase(TestCaseNewcomerTask_, 'TestCaseNewcomerTask_')
	suite:addTestCase(TestCaseYellowDiamondTask, 'TestCaseYellowDiamondTask')
	suite:addTestCase(TestCasePayActTask, 'TestCasePayActTask')
	suite:addTestCase(TestCaseWorldBossTask, 'TestCaseWorldBossTask')
	suite:addTestCase(TestCaseSendRewardTask, 'TestCaseSendRewardTask')
end;


