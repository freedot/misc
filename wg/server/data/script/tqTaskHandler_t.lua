--*******************************************************************************
require('tqTaskHandler')

local TestCaseTaskHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TaskHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(0):getClass() , GetAllTasksHdr )
		assertEQ ( self.hdr:getHandler(1):getClass() , GetTaskRewardHdr )
		assertEQ ( self.hdr:getHandler(2):getClass() , DoRoleTaskHdr )
		assertEQ ( self.hdr:getHandler(3):getClass() , ChangeEverydayTaskHdr )
		assertEQ ( self.hdr:getHandler(4):getClass() , CompleteEverydayTaskHdr )
		assertEQ ( self.hdr:getHandler(5):getClass() , GetRewardByPrestigeHdr )
		assertEQ ( self.hdr:getHandler(6):getClass() , GetOnlineTaskRewardHdr )
		assertEQ ( self.hdr:getHandler(7):getClass() , GetOnlineTaskInfoHdr )
	end;
})

local TestCaseGetAllTasksHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TaskHandler():getHandler(0)	
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(TaskSender, 'sendCommTasks')
		self.mm:mock(TaskSender, 'sendEveryDayTasks')
		self.mm:mock(TaskSender, 'sendDoingRoleTask')
		self.mm:mock(TaskSender, 'sendPrestigeTask')
		
		self.hdr:handle(self.player)
		
		assertEQ ( self.mm.params['sendCommTasks'], {self.player} )
		assertEQ ( self.mm.params['sendEveryDayTasks'], {self.player} )
		assertEQ ( self.mm.params['sendDoingRoleTask'], {self.player} )
		assertEQ ( self.mm.params['sendPrestigeTask'], {self.player} )
	end;
})

local TestCaseGetTaskRewardHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TaskHandler():getHandler(1)	
		
		res_test_items = { --res_tasks
			{id=1, type=1, state=1, fixShow=1, name='active1', dname='detail active1', time={start=1377336523, duration=3600}, docond={{type=TASK_FINISH_TYPE.FEED_LIGHTLAW, val1=0, val2=0, val3=0}}, dropId=7500001 }
			,{id=2, type=1, state=1, fixShow=1, name='active2', dname='detail active2', time={start=1377336523, duration=3600}, docond={{type=TASK_FINISH_TYPE.SUB_ITEM, val1=FIXID.REFRESHCARD, val2=1, val3=0}}, dropId=7500001 }
			,{id=FIXID.UP_SHUYUAN2, type=1, state=1, fixShow=1, name='active2', dname='detail active2', time={start=1377336523, duration=3600}, docond={{type=TASK_FINISH_TYPE.SUB_ITEM, val1=FIXID.REFRESHCARD, val2=0, val3=0}}, dropId=7500001 }
		}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local r_isCanExec = {false}
		self.mm:mock(self.hdr.dropItemEffector_, 'isCanExec', r_isCanExec)
		self.mm:mock(self.hdr.dropItemEffector_, 'exec')
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		
		self.player:getTask():setTask(1, 0)
		local cmd = {taskId=2}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {taskId=1}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		self.player:getTask():setTask(1, 1)
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['isCanExec'], {self.player, 1, {val=7500001}, {}} )
		
		self.mm:clear()
		r_isCanExec[1] = true
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.mm.params['exec'], {self.player, 1, {val=7500001}, {}} )
		assertEQ ( self.player:getTask():getTaskById(1).state, TASK_STATE.COMPLETE )
		
		self.mm:clear()
		self.player:getTask():setTask(2, 1)
		cmd = {taskId=2}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100164, '"@itemid' .. FIXID.REFRESHCARD .. '",1'} )
		
		self.mm:clear()
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.REFRESHCARD, number=1})})
		assertEQ ( self.player:getPkg():getItemNumber(FIXID.REFRESHCARD), 1)
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getPkg():getItemNumber(FIXID.REFRESHCARD), 0)
		
		self.mm:clear()
		self.player:getTask():setTask(2, 1)
		cmd = {taskId=2, skipSubItem=1}
		assertEQ ( self.hdr:handle(self.player, cmd), true, 'not check item number and sub them' )
	end;
	
	test_handle_newcomerSpiritEnd = function(self)
		self.mm:mock(self.hdr.dropItemEffector_, 'isCanExec', {true})
		self.mm:mock(self.hdr.dropItemEffector_, 'exec')
		self.mm:mock(TaskSender, 'sendStartGlobalTip')
		local cmd = {taskId=FIXID.UP_SHUYUAN2}
		self.player:getTask():setTask(FIXID.UP_SHUYUAN2, 1)
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getTask():getTaskById(FIXID.UP_SHUYUAN2).state, TASK_STATE.COMPLETE )
		assertEQ ( self.player:getTask():getNewcomerTask():isTaskEnd(), true )
		assertEQ ( self.mm.params['sendStartGlobalTip'], {self.player} )
	end;
})

local TestCaseDoRoleTaskHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TaskHandler():getHandler(2)	
		
		res_test_items = {
			{id=1, fixShow=1, roleExp=100, pro=20, multiple=1.5, precond={roleLevel=10}, needps=100, cdtime=10, needtime=60 }
			,{id=2, type=1, fixShow=1, roleExp=100, pro=20, multiple=1.5, precond={roleLevel=10}, needps=100, cdtime=10, needtime=60 }
			,{id=1000, type=4, fixShow=1, roleExp=100, pro=20, multiple=1.5, precond={roleLevel=10}, needps=100, cdtime=10, needtime=60 }
			,{id=1001, type=4, fixShow=1, roleExp=200, pro=20, multiple=2, precond={roleLevel=20}, needps=200, cdtime=20, needtime=120 }
		};
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:travelMock(self.player:getTask():getDoingRoleTask(), 'startDoing')
		self.mm:mock(TaskSender, 'sendDoingRoleTask')
		self.mm:mock(TaskFinisher, 'trigerTask')
		self.player:getTask():getDoingRoleTask():setStopTime(1)
		self.player:getTask():getDoingRoleTask():setCDStopTime(0)
		local cmd = {taskId=1000}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		self.player:getTask():getDoingRoleTask():setStopTime(0)
		self.player:getTask():getDoingRoleTask():setCDStopTime(1)
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		self.player:setLevel(10)
		cmd = {taskId=10000000000}
		self.player:getTask():getDoingRoleTask():setStopTime(0)
		self.player:getTask():getDoingRoleTask():setCDStopTime(0)
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {taskId=1}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {taskId=2}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {taskId=1001}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		Util:setTimeDrt(10)
		cmd = {taskId=1000}
		assertEQ ( self.hdr:handle(self.player, cmd), false, 'no enough role ps' )
		
		self.player:setAttrVal(ATTR.PS, 100)
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getAttrVal(ATTR.PS), 0)
		assertEQ ( self.player:getTask():getDoingRoleTask():getTaskId(), 1000)
		assertEQ ( self.player:getTask():getDoingRoleTask():getCDStopTime(), 0)
		assertEQ ( self.player:getTask():getDoingRoleTask():getStopTime(), Util:getTime() + 60)
		assertEQ ( self.mm.walkLog, 'startDoing,sendDoingRoleTask,trigerTask' )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.FINISH_ONE_ROLETASK} )
		
		self.player:setVipLevel(5)
		self.player:setAttrVal(ATTR.PS, 100)
		self.player:getTask():getDoingRoleTask():setStopTime(0)
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getAttrVal(ATTR.PS), 0)
		assertEQ ( self.player:getTask():getDoingRoleTask():getCDStopTime(), 0)
		assertEQ ( self.player:getTask():getDoingRoleTask():getStopTime(), Util:getTime())
	end;
})

local TestCaseChangeEverydayTaskHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TaskHandler():getHandler(3)	
		
		res_everyday_tasks = {{id=1000, type=4, precond={roleLevel=10}, dropId=7500001}
			,{id=1001, type=4, precond={roleLevel=20}, dropId=7500001} 
			,{id=1002, type=4, precond={roleLevel=30}, dropId=7500001} 
			}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(math, 'random', nil, function(a,b)
			if b ~= nil then return b end
			return a
			end)
			
		self.player:setLevel(10)
		self.player:getTask():getEveryDayTask():_randTasks()
		
		local cmd = {taskId = 1000100}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {taskId = 1000108}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		self.player:getTask():getEveryDayTask():setTaskState(7, 1)
		cmd = {taskId = 1000107}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {taskId = 1000101}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		self.player:setLevel(20)
		self.player:getPkg():addGiftGold(10)
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.player:getPkg():getAllGold(), 10 )
		
		self.player:setLevel(20)
		self.player:getPkg():addGold(10)
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getPkg():getGold(), 0 )
		assertEQ ( self.player:getTask():getEveryDayTask():getTask(1).taskId, 1001 )
		
		self.player:setLevel(20)
		self.player:getPkg():addGold(10)
		self.player:getTask():getEveryDayTask():setTaskState(1, 1)
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getPkg():getGold(), 0 )
		assertEQ ( self.player:getTask():getEveryDayTask():getTask(1).taskId, 1001 )
	end;
})

local TestCaseCompleteEverydayTaskHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TaskHandler():getHandler(4)	
		
		res_everyday_tasks = {{id=1000, type=4, precond={roleLevel=10}, dropId=7500001}
			,{id=1001, type=4, precond={roleLevel=20}, dropId=7500001} 
			,{id=1002, type=4, precond={roleLevel=30}, dropId=7500001} 
			}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask')
			
		self.mm:mock(math, 'random', nil, function(a,b)
			if b ~= nil then return b end
			return a
			end)
			
		self.player:setLevel(10)
		self.player:getTask():getEveryDayTask():_randTasks()
		
		local cmd = {taskId = 1000100}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {taskId = 1000108}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		self.player:getTask():getEveryDayTask():setTaskState(7, 1)
		cmd = {taskId = 1000107}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		cmd = {taskId = 1000101}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		
		assertEQ ( self.hdr.getTaskRewardHdr_:getClass(), GetTaskRewardHdr )
		
		self.player:getPkg():addGold(20)
		local r_getTaskRewardHdr = {false}
		self.mm:mock( self.hdr.getTaskRewardHdr_, 'handle', r_getTaskRewardHdr)
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.player:getPkg():getAllGold(), 20 )
		assertEQ ( self.player:getTask():getEveryDayTask():getTask(1).state, 0 )
		assertEQ ( self.mm.params['handle'], {self.player, {taskId=1000101, skipSubItem=1}} )
		
		r_getTaskRewardHdr[1] = true
		self.player:getPkg():subGold(20)
		self.player:getPkg():addGiftGold(20)
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.player:getPkg():getAllGold(), 20 )
		
		self.player:getPkg():addGold(20)
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.player:getPkg():getGold(), 0 )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.FINISH_PRESTIGE_TASK} )
	end;
})

local TestCaseGetRewardByPrestigeHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TaskHandler():getHandler(5)	
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local r_isCanExec = {false}
		self.mm:mock(self.hdr.dropItemEffector_, 'isCanExec', r_isCanExec)
		self.mm:mock(self.hdr.dropItemEffector_, 'exec')
		self.mm:mock(TaskFinisher, 'trigerTask')
		
		Util:setTimeDrt(1379511396)
		self.player:getTask():setPrestigeLastTime(1379511396-1)
		assertEQ ( self.hdr:handle(self.player), false )
		
		self.player:getTask():setPrestigeLastTime(1379511396 - 24*3600)
		assertEQ ( self.hdr:handle(self.player), false )
		
		self.player:setPrestige(1000)
		assertEQ ( self.hdr:handle(self.player), false )
		assertEQ ( self.mm.params['isCanExec'], {self.player, 1, {val=7500315}, {}} )
		
		self.mm:clear()
		r_isCanExec[1] = true
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( self.mm.params['exec'], {self.player, 1, {val=7500315}, {}} )
		assertEQ ( self.player:getTask():getPrestigeLastTime(), 1379511396 )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.GET_REWARD_BY_PRESTIGE} )
		
		self.mm:clear()
		self.player:getTask():setPrestigeLastTime(1379511396 - 24*3600)
		self.player:setPrestige(5000)
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( self.mm.params['exec'], {self.player, 1, {val=7500316}, {}} )
		
		self.mm:clear()
		self.player:getTask():setPrestigeLastTime(1379511396 - 24*3600)
		self.player:setPrestige(20000)
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( self.mm.params['exec'], {self.player, 1, {val=7500317}, {}} )
	end;
})

local TestCaseGetOnlineTaskRewardHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TaskHandler():getHandler(6)	
		
		res_online_tasks = {
			{id=1790001, precond={taskId=0}, type=TASK_TYPE.ONELINE, circleType=0, duration=15, dropId=7500315}
			,{id=1790002, precond={taskId=1790001}, type=TASK_TYPE.ONELINE, circleType=0, duration=60, dropId=7500316}
			}

		TestCaseHelper:createPlayer(self)
		self.onlineTask = self.player:getTask():getOnlineTask()
		FIXID.FIRST_ONLINE_CIRCLETASK = 1790005
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local r_isCanExec = {false}
		self.mm:mock(self.hdr.dropItemEffector_, 'isCanExec', r_isCanExec)
		self.mm:mock(self.hdr.dropItemEffector_, 'exec')

		Util:setTimeDrt(1379520000)
		self.onlineTask:setTask(0, 0)
		assertEQ ( self.hdr:handle(self.player), false )
		
		self.onlineTask:setTask(1790001, 0)
		Util:setTimeDrt(1379520000 + 10)
		assertEQ ( self.hdr:handle(self.player), false )
		
		Util:setTimeDrt(1379520000 + 15 - TIMER_DRT_TIME)
		assertEQ ( self.hdr:handle(self.player), false )
		assertEQ ( self.mm.params['isCanExec'], {self.player, 1, {val=7500315}, {}} )
		
		r_isCanExec[1] = true
		assertEQ ( self.hdr:handle(self.player), true )
		assertEQ ( self.mm.params['exec'], {self.player, 1, {val=7500315}, {}} )
		assertEQ ( self.player:getTask():getOnlineTask():getTaskId(), 1790002 )
	end;
})

local TestCaseGetOnlineTaskInfoHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TaskHandler():getHandler(7)	
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(TaskSender, 'sendOnlineTask')
		self.hdr:handle(self.player)
		assertEQ ( self.mm.params['sendOnlineTask'], {self.player} )
	end;
})

local TestCaseAddFavoriteTaskHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TaskHandler():getHandler(8)	
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask')
		self.hdr:handle(self.player)
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.FAVORITE_URL} )
	end;
})

local TestCaseNewcommerHelpTaskHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = TaskHandler():getHandler(9)	
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(TaskSender, 'sendOpenTodayAct')
		self.hdr:handle(self.player)
		assertEQ ( self.player:getTask():getNewcomerTask():isGlobalTipEnd(), true )
		assertEQ ( self.mm.params['sendOpenTodayAct'], {self.player} )
	end;
})

tqTaskHandler_t_main = function(suite)
	suite:addTestCase(TestCaseGetAllTasksHdr, 'TestCaseGetAllTasksHdr')
	suite:addTestCase(TestCaseTaskHandler, 'TestCaseTaskHandler')
	suite:addTestCase(TestCaseGetTaskRewardHdr, 'TestCaseGetTaskRewardHdr')
	suite:addTestCase(TestCaseDoRoleTaskHdr, 'TestCaseDoRoleTaskHdr')
	suite:addTestCase(TestCaseChangeEverydayTaskHdr, 'TestCaseChangeEverydayTaskHdr')
	suite:addTestCase(TestCaseCompleteEverydayTaskHdr, 'TestCaseCompleteEverydayTaskHdr')
	suite:addTestCase(TestCaseGetRewardByPrestigeHdr, 'TestCaseGetRewardByPrestigeHdr')
	suite:addTestCase(TestCaseGetOnlineTaskRewardHdr, 'TestCaseGetOnlineTaskRewardHdr')
	suite:addTestCase(TestCaseGetOnlineTaskInfoHdr, 'TestCaseGetOnlineTaskInfoHdr')
	suite:addTestCase(TestCaseAddFavoriteTaskHdr, 'TestCaseAddFavoriteTaskHdr')
	suite:addTestCase(TestCaseNewcommerHelpTaskHdr, 'TestCaseNewcommerHelpTaskHdr')
end;


