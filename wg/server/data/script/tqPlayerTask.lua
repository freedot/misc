--*******************************************************************************
ActTaskUtil = Class:extends({
	init = function(self)
		self:_initSvrOpenTime()
		self:_initSvrOpenActTime()
	end;
	
	_initSvrOpenTime = function(self)
		self.fmtSvrOpenTime_ = 0
		local t = os.strptime(res_svr_mics_cfg.svrOpenTime)
		if t ~= nil then
			self.fmtSvrOpenTime_ = Util:getFixPreTime(os.time(t), 0, 0, 0)
		end
	end;
	
	_initSvrOpenActTime = function(self)
		self.fmtSvrOpenActTime_ = os.time() + 360*24*3600 -- 为了不发放奖励，赋值为足够大的时间
		local t = os.strptime(res_svr_mics_cfg.svrOpenActTime)
		if t ~= nil then
			self.fmtSvrOpenActTime_ = os.time(t) -- 发放开服奖励的时间
		end
	end;
	
	isInTodayTime = function(self, time, fmtFirstLoginTime)
		local curTime = Util:getTime()
		
		local start = self:getStartTime(time, fmtFirstLoginTime)
		local startDayTime = Util:getFixPreTime(start, 0, 0, 0)
		local duration = self:_getDurationForTest(time)
		return (curTime >= startDayTime) and (curTime < startDayTime+duration)
	end;
	
	isOutDate = function(self, task)
		if Util:getTime() < task.stopTime then
			return false
		end
		
		if task.state == TASK_STATE.WAIT_COMPLETE then
			return true
		end
		
		local res = Util:qfind(res_active_tasks, 'id', task.taskId)
		if res == nil then
			return true
		end
		
		if res.fixShow == 0 and task.state == TASK_STATE.COMPLETE then
			return true
		end
		
		return false
	end;
	
	getSvrOpenTime = function(self)
		return self.fmtSvrOpenTime_
	end;
	
	getOpenSvrActTime = function(self)
		return self.fmtSvrOpenActTime_
	end;
	
	getStartTime = function(self, time, fmtFirstLoginTime)
		local start = time.start
		if start == TASK_STARTTIME.SVR_OPEN then
			start = self.fmtSvrOpenTime_
		elseif start >= TASK_STARTTIME.FIRST_LOGIN 
			and start < TASK_STARTTIME.MAX_FIRST_LOGIN then
			local days = start - TASK_STARTTIME.FIRST_LOGIN
			start = fmtFirstLoginTime + days*24*3600
		end
		return start
	end;
	
	getStopTime = function(self, time, fmtFirstLoginTime)
		if time.duration == 0 then return 0xffffffff end
		return self:getStartTime(time, fmtFirstLoginTime) + time.duration
	end;
	
	_getDurationForTest = function(self, time)
		local duration = 0
		if time.duration == 0 then
			duration = 10000000000
		elseif time.duration < 24*3600 then
			duration = 24*3600
		else
			duration = time.duration
		end
		return duration
	end;
}):new()

PlayerTask = Class:extends({
	init = function(self, player)
		self.player = player
		self.tasks = MapCppSortSet(player:getPersistVar().tasks, 'count', 'tasks', 'taskId', MAX_TASKS_CNT)
		self.doing = DoingRoleTask(player)
		self.everydayTask = EveryDayTask(player)
		self.onlineTask = OnlineTask(player)
		self.activityVal = ActivityVal(player)
		self.newTask = NewcomerTask(player)
		self.actTask = ActTask(player)
		self.ydTask = YellowDiamondTask(player)
		self.bdTask = BlueDiamondTask(player)
		self.payAct = PayActTask(player)
		self.worldboss = WorldBossTask(player)
		self.sendReward = SendRewardTask(player)
	end;
	
	initGrowupTasks = function(self)
		if self.tasks:getCount() > 0 then
			return
		end
		
		for _, res in ipairs(res_growup_tasks) do
			if res.precond.taskId == 0 then
				self:_setCommTaskState(res.id, 0) -- add new growup task
			end
		end
	end;
	
	getPrestigeLastTime = function(self)
		return self.player:getPersistVar().tasks.prestigeLastTime
	end;
	
	setPrestigeLastTime = function(self, time)
		self.player:getPersistVar().tasks.prestigeLastTime = time
		TaskSender:sendPrestigeTask(self.player)
	end;
	
	--@remark 从这个函数无法获得roletask
	getTaskById = function(self, taskId)
		local task = self.tasks:getByValKey(taskId) 
		if task ~= nil then return task end
	
		task = self.actTask:getTaskById(taskId) 
		if task ~= nil  then return task end
	
		task =  self.everydayTask:getTaskById(taskId)
		return task
	end;	
	
	--@remark 这个函数不能设置roletask state
	setTask = function(self, taskId, taskState)
		local task = self.everydayTask:getTaskById(taskId)
		if task ~= nil then
			self.everydayTask:setTaskState(taskId, taskState)
		else 
			task = self.actTask:getTaskById(taskId)
			if task ~= nil then
				self.actTask:setTaskState(taskId, taskState)
			else
				self:_setCommTaskState(taskId, taskState)
			end
		end
	end;
	
	getDoingRoleTask = function(self)
		return self.doing
	end;
	
	getEveryDayTask = function(self)
		return self.everydayTask
	end;
	
	getCommTasks = function(self)
		return self.tasks
	end;
	
	getActivityVal = function(self)
		return self.activityVal
	end;
	
	getOnlineTask = function(self)
		return self.onlineTask
	end;
	
	getNewcomerTask = function(self)
		return self.newTask
	end;
	
	getActTask = function(self)
		return self.actTask
	end;
	
	getYDTask = function(self)
		return self.ydTask
	end;
	
	getBDTask = function(self)
		return self.bdTask
	end;
	
	getPayAct = function(self)
		return self.payAct
	end;
	
	getWorldBoss = function(self)
		return self.worldboss
	end;
	
	getSendReward = function(self)
		return self.sendReward
	end;
	
	_setCommTaskState = function(self, taskId, state)
		local task = self.tasks:getByValKey(taskId)
		if task ~= nil then
			task.taskId = taskId
			task.state = state
		else
			self.tasks:insert({taskId=taskId, state=state})
		end
		
		TaskSender:sendCommTask(self.player, taskId, state)
		
		if state == TASK_STATE.COMPLETE then
			self:_addNewGrowupTask(taskId)
			self:_deleteCompleteTask(taskId)
		end
		
		self:_resetNewcomerTask()
	end;
	
	_addNewGrowupTask = function(self, taskId)
		for _, res in ipairs(res_growup_tasks) do
			if res.precond.taskId == taskId then
				self:_setCommTaskState(res.id, self:_getTaskState(res.docond) ) -- add new growup task
			end
		end
	end;
	
	_deleteCompleteTask = function(self, taskId)
		local res = ItemResUtil:findItemres(taskId)
		if res.fixShow == 0 and res.type ~= TASK_TYPE.ACTIVE then
			self.tasks:remove(taskId)
		end
	end;
	
	_resetNewcomerTask = function(self)
		local count = self.tasks:getCount()
		for i=0, count-1 do
			local task = self.tasks:get(i)
			if task.state == TASK_STATE.WAIT_COMPLETE then
				local res = Util:find(res_newhelp_tasks, 'bindTaskId', task.taskId)
				if res ~= nil and self.newTask:getCurTaskId() ~= res.id then
					self.newTask:setCurTaskId(res.id)
					NewcomerTaskSender:sendCurTask(self.player)
					return
				end
			end
		end
		
		if self.newTask:getCurTaskId() > 0 then
			local res = Util:find(res_newhelp_tasks, 'id', self.newTask:getCurTaskId())
			if res ~= nil then
				local task = self.tasks:getByValKey(res.bindTaskId)
				if task == nil or task.state >= TASK_STATE.COMPLETE then
					self.newTask:setCurTaskId(0)
					NewcomerTaskSender:sendCurTask(self.player)
				end
			end
		end
	end;
	
	_getTaskState = function(self, docond)
		if TaskFinisher:isImmFinish(self.player, docond) then
			return 1
		else
			return 0
		end
	end;
})

DoingRoleTask = Class:extends({
	init = function(self, player)
		self.player = player
		self.doingRoleTask = player:getPersistVar().tasks.doingRoleTask
		self.player:getTimerCaller():register(TIMER_EVT.DOINGTASK_STOP, Caller:new(0, self, self._onDoingTaskStop))
		self.player:getTimerCaller():register(TIMER_EVT.DOINGTASK_CD_STOP, Caller:new(0, self, self._onDoingTaskCDStop))
	end;
	
	start = function(self)
		self:startDoing()
		self:_startCoolDown()
	end;
	
	getStopTime = function(self)
		return self.doingRoleTask.stopTime
	end;
	
	setStopTime = function(self, stopTime)
		self.doingRoleTask.stopTime = stopTime
	end;
	
	getTaskId = function(self)
		return self.doingRoleTask.taskId
	end;
	
	setTaskId = function(self, taskId)
		self.doingRoleTask.taskId = taskId
	end;
	
	getCDStopTime = function(self)
		return self.doingRoleTask.cdStopTime
	end;
	
	setCDStopTime = function(self, cdStopTime)
		self.doingRoleTask.cdStopTime = cdStopTime
	end;
	
	startDoing = function(self) 
		if self:getStopTime() == 0 then
			return
		end
		
		if self:getTaskId() == 0 then
			return 
		end
		
		local needTime = self:getStopTime() - Util:getTime()
		global.getTimer():start(needTime*1000, {TIMER_EVT.DOINGTASK_STOP}, self.player:getTimerCaller())
		TaskSender:sendDoingRoleTask(self.player)
	end;
	
	_startCoolDown = function(self) 
		if self:getCDStopTime() == 0 then	
			return
		end
		
		local needTime = self:getCDStopTime() - Util:getTime()
		global.getTimer():start(needTime*1000, {TIMER_EVT.DOINGTASK_CD_STOP}, self.player:getTimerCaller())
		TaskSender:sendDoingRoleTask(self.player)
	end;
	
	_onDoingTaskStop = function(self, timer)
		timer:stop()
		if self:getStopTime() == 0 then
			return
		end
		
		if not self:_isArrivedTime(self:getStopTime()) then
			return 
		end
		
		local res = ItemResUtil:findItemres(self:getTaskId())
		self:_addRoleExp(res)
		self:setCDStopTime(self:getStopTime() + self:_getCDTime(res) )
		self:setStopTime(0)
		self:setTaskId(0)
		self:_startCoolDown()
		TaskSender:sendDoingRoleTask(self.player)
		self:_addAllianceHonour(res)
	end;
	
	_getCDTime = function(self, res)
		if self.player:hasVipEffect(VIP_EFF.SPEED_ROLETASK) then
			return 0
		else
			return res.cdtime
		end
	end;
	
	_addAllianceHonour = function(self, res)
		local alliance = app:getAlliMgr():getAlliById(self.player:getAlliId())
		if not alliance:isNull() then
			local addHonour = math.max(1, math.floor(res.needps/100))
			alliance:addHonour(addHonour)
			app:getAlliMgr():addAllianceEvent(alliance, 'roleTask', {roleName=self.player:getRoleName(), addHonour=addHonour} )
		end
	end;
	
	_onDoingTaskCDStop = function(self, timer)
		timer:stop()
		if not self:_isArrivedTime(self:getCDStopTime()) then
			return 
		end
		self:setCDStopTime(0)
		TaskSender:sendDoingRoleTask(self.player)
	end;
	
	_addRoleExp = function(self, res)
		local msg = res.commmsg
		local exp = res.roleExp
		if math.random(100) <= res.pro then
			msg = res.berserkmsg
			exp = exp*res.multiple
		end
		self.player:addExp(exp)
		WUtil:sendPopBoxMsg(self.player, msg)
	end;
	
	_isArrivedTime = function(self, stopTime)
		return (Util:getTime() + TIMER_DRT_TIME) >= stopTime
	end;
})

EveryDayTask = Class:extends({
	init = function(self, player)
		self.player = player
		self.tasks = self.player:getPersistVar().tasks
		self._fixTimer = FixTimer:new()
		self.player:getTimerCaller():register(TIMER_EVT.REFRESH_EVERYDAYTASK, Caller:new(0, self, self._onRefreshTimer))
	end;
	
	start = function(self)
		self._fixTimer:start({hour=0, min=0, sec=0}, {TIMER_EVT.REFRESH_EVERYDAYTASK}, self.player:getTimerCaller())
		if not Util:isCurDay(self.tasks.refreshTime) then
			self:_randTasks()
		end
	end;
	
	randTasks = function(self)
		self:_resetRefreshTime()
		if not Util:isCurDay(self.tasks.refreshTime) then
			self:_randTasks()
		end
	end;
	
	getTaskCount = function(self)
		return self.tasks.everydayCount
	end;
	
	getTask = function(self, idx) -- from 1 to n
		return self.tasks.everydayTasks[idx-1]
	end;	
	
	getTaskById = function(self, taskId)
		local taskIdx = self:_getTaskIdx(taskId)
		if taskIdx < 1 or taskIdx > self:getTaskCount() then return nil end
		
		local resid = self:_getTaskResId(taskId)
		local task = self:getTask(taskIdx)
		if task.taskId ~= resid then return nil end
		return task
	end;
	
	setTaskState = function(self, taskId, state) 
		local taskIdx = self:_getTaskIdx(taskId)
		self.tasks.everydayTasks[taskIdx-1].state = state
		TaskSender:sendEveryDayTask(self.player, taskIdx)
		if state == TASK_STATE.COMPLETE then
			TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.FINISH_ONE_EVERYDAYTASK)
		end
	end;
	
	getTaskState = function(self, taskId) 
		return self.tasks.everydayTasks[self:_getTaskIdx(taskId)-1].state
	end;
	
	randTask = function(self, idx) -- from 1 to n
		local ress = self:_collectTaskRes()
		if #ress == 0 then
			return
		end
		
		TaskSender:sendDelEveryDayTask(self.player, idx)
		
		local resIdx = math.random(#ress)
		self.tasks.everydayTasks[idx-1].taskId = ress[resIdx].id
		self.tasks.everydayTasks[idx-1].state = 0
		
		TaskSender:sendEveryDayTask(self.player, idx)
	end;
	
	_resetRefreshTime = function(self)
		if self:getTaskCount() > 0 then return end
		self.tasks.refreshTime = 0
	end;
	
	_onRefreshTimer = function(self)
		self:_randTasks()
	end;
	
	_randTasks = function(self)
		self.tasks.refreshTime = Util:getTime() + 10 --(drt)
		local ress = self:_collectTaskRes()
		if #ress == 0 then
			return
		end
		
		TaskSender:sendDelEveryDayTasks(self.player)
		
		self.tasks.everydayCount = res_everyday_task_base_cnt + self.player:getVipEffectVal(VIP_EFF.ADD_EVERYDAYTASK)
		for i=1, self.tasks.everydayCount, 1 do
			local idx = math.random(table.getn(ress))
			self.tasks.everydayTasks[i-1].taskId = ress[idx].id
			self.tasks.everydayTasks[i-1].state = 0
		end
		
		TaskSender:sendEveryDayTasks(self.player)
	end;
	
	_collectTaskRes = function(self)
		local roleLevel  = self.player:getLevel()
		local resList = {}
		for _, res in ipairs(res_everyday_tasks) do
			if roleLevel >= res.precond.roleLevel then
				table.insert( resList,  res)
			end
		end
		return resList
	end;
	
	_getTaskIdx = function(self, taskId)
		return taskId%100
	end;
	
	_getTaskResId = function(self, taskId)
		return math.floor(taskId/100)
	end;
})

ActivityVal = Class:extends({
	init = function(self, player)
		self.player = player
		self.activityVal = player:getPersistVar().tasks.activityVal
		self.gotActRewards = GotActRewards(player)
		self.gotSigninRewards = GotSigninRewards(player)
		self.tasks = MapCppSortSet(self.activityVal, 'count', 'tasks', 'taskId', MAX_ACTVALTASKS_CNT)
	end;
	
	getGotActRewards = function(self)
		return self.gotActRewards
	end;
	
	getGotSigninRewards = function(self)
		return self.gotSigninRewards
	end;
	
	getTodayVal = function(self)
		return TodayTimes:get(self.activityVal, 'val', 'refreshActValTime')
	end;
	
	setTodayVal = function(self, val)
		if val > 100 then
			val = 100
		end
		TodayTimes:set(self.activityVal, 'val', 'refreshActValTime', val, Util:getTime())
		ActivityValSender:sendVal(self.player)
	end;
	
	-- for gm 
	setSignDays	= function(self, days )
		if days > 0 then
			self.activityVal.todaySign = 1
			self.activityVal.refreshSigninTime = Util:getTime()
			self.activityVal.signinDaysTime = Util:getTime()
			self.activityVal.signinDays = days
		else
			self.activityVal.todaySign = 0
			self.activityVal.refreshSigninTime = Util:getTime() - 24*3600
			self.activityVal.signinDaysTime = Util:getTime() - 24*3600
			self.activityVal.signinDays = 0
		end
		ActivityValSender:sendSignin(self.player)
	end;
	
	todaySign = function(self)
		if self:isTodaySigned() then
			return
		end
		
		TodayTimes:set(self.activityVal, 'todaySign', 'refreshSigninTime', 1, Util:getTime())
		
		self:_clearSigninDaysOtherMonth()
		self.activityVal.signinDays = self.activityVal.signinDays + 1
		if self.activityVal.signinDays > res_max_signin_days then
			self.activityVal.signinDays = res_max_signin_days
		end
		
		self.activityVal.signinDaysTime = Util:getTime()
	end;
	
	isTodaySigned = function(self)
		return TodayTimes:get(self.activityVal, 'todaySign', 'refreshSigninTime') == 1
	end;
	
	getSigninDays = function(self)
		self:_clearSigninDaysOtherMonth()
		return self.activityVal.signinDays
	end;
	
	getTaskCount = function(self)
		return #res_activityval_tasks
	end;
	
	getTask = function(self, taskIdx) -- idx from 1 to n
		self:_clearTasksOtherDay()
		local res = res_activityval_tasks[taskIdx]
		local task = self.tasks:getByValKey(res.id)
		if task == nil then
			return {taskId=res.id, times=0}
		else
			return task
		end
	end;
	
	addTaskTimes = function(self, taskIdx) -- idx from 1 to n
		self:_clearTasksOtherDay()
		local res = res_activityval_tasks[taskIdx]
		local task = self.tasks:getByValKey(res.id)
		local times = 1
		if task == nil then
			self.tasks:insert({taskId=res.id, times=times})
		else
			task.times = task.times + 1
			times = task.times
		end
		TaskSender:sendActValTask(self.player, res.id, times)
	end;
	
	isTodayGotOnlineGoods = function(self)
		return TodayTimes:get(self.activityVal, 'gotGoodsTimes', 'gotOnlineGoodsTime') == 1
	end;
	
	todayGetOnlineGoods = function(self)
		if self:isTodayGotOnlineGoods() then
			return
		end
		
		local goodsId = app:getSvrAct():getOnlineGoods()
		if goodsId == 0 then
			return 
		end
		
		if not self.player:getPkg():addItems( {RawItemEx({resId=goodsId, number=1})} ) then
			WUtil:sendWarningMsgArgs(self.player, 100129, '')
			return
		end
	
		TodayTimes:set(self.activityVal, 'gotGoodsTimes', 'gotOnlineGoodsTime', 1, Util:getTime())
	end;
	
	_clearTasksOtherDay = function(self)
		if not Util:isCurDay(self.activityVal.refreshTaskTime) then
			self.tasks:clear()
			self.activityVal.refreshTaskTime = Util:getTime()
		end
	end;
	
	_clearSigninDaysOtherMonth = function(self)
		if not Util:isCurMonth(self.activityVal.signinDaysTime) then
			self.activityVal.signinDays = 0
		end
	end;
})

GotRewards = Class:extends({
	init = function(self, player)
		self.player = player
		self.activityVal = player:getPersistVar().tasks.activityVal
	end;
	
	isGotReward = function(self, id)
		return self:_getGotReward(id) == 1
	end;
	
	_getGotReward = function(self, id) -- id from 1 to n
		if not self:_isCurTime(self:_getTime()) then
			return 0
		end
		return self:_getRewards()[id-1]
	end;
	
	setGotReward = function(self, id) -- id from 1 to n
		if not self:_isCurTime(self:_getTime()) then
			for i=self:_getMaxCount(), 1, -1 do
				self:_getRewards()[i-1] = 0
			end
		end
		self:_getRewards()[id-1] = 1
		self:_setTime(Util:getTime())
	end;
})

GotActRewards = GotRewards:extends({
	_getRewards = function(self)
		return self.activityVal.gotActRewards
	end;
	
	_getTime = function(self)
		return self.activityVal.gotActRewardTime
	end;
	
	_setTime = function(self, time)
		self.activityVal.gotActRewardTime = time
	end;
	
	_getMaxCount = function(self)
		return MAX_ACTREWARDS_CNT
	end;
	
	_isCurTime = function(self, time)
		return Util:isCurDay(time)
	end
})

GotSigninRewards = GotRewards:extends({
	_getRewards = function(self)
		return self.activityVal.gotSigninRewardsEx
	end;
	
	_getTime = function(self)
		return self.activityVal.gotSigninRewardTime
	end;
	
	_setTime = function(self, time)
		self.activityVal.gotSigninRewardTime = time
	end;
	
	_getMaxCount = function(self)
		return MAX_SIGNINREWARDS_CNT_EX
	end;
	
	_isCurTime = function(self, time)
		return Util:isCurMonth(time)
	end
})

OnlineTask = Class:extends({
	init = function(self, player)
		self.player = player
		self.onlineTask = self.player:getPersistVar().tasks.onlineTask
	end;
	
	onLoginOk = function(self)
		self:_setLastTime(Util:getTime())
		if self:isCircled() and not Util:isCurDay(self.onlineTask.startTime) then
			self:setTask(FIXID.FIRST_ONLINE_CIRCLETASK, 0)
		end
	end;
	
	onSave = function(self)
		self:_addLastLapsed(Util:getTime() - self:_getLastTime())
		self:_setLastTime(Util:getTime())
	end;

	isCircled = function(self)
		return self.onlineTask.isCircled == 1
	end;
	
	setTask = function(self, taskId, taskState)
		self.onlineTask.taskId = taskId
		self.onlineTask.lastTime = Util:getTime()
		self.onlineTask.startTime = Util:getTime()
		self.onlineTask.lastLapsed = 0
		if taskState == TASK_STATE.COMPLETE then
			self.onlineTask.taskId = self:_findNextTaskId(taskId)
		end
		self:_setCircleFlag()
		TaskSender:sendOnlineTask(self.player)
	end;
	
	getTaskId = function(self)
		return self.onlineTask.taskId
	end;
	
	getTaskStopTime = function(self)
		local res = Util:qfind(res_online_tasks, 'id', self.onlineTask.taskId)
		if res == nil then return 0 end
		
		local curLapsed = Util:getTime() - self.onlineTask.lastTime
		local leftTime = res.duration - curLapsed - self.onlineTask.lastLapsed
		return Util:getTime() + leftTime
	end;
	
	_addLastLapsed = function(self, dur)
		self.onlineTask.lastLapsed = self.onlineTask.lastLapsed + dur
	end;	
	
	_setLastTime = function(self, lastTime)
		self.onlineTask.lastTime = lastTime
	end;	
	
	_getLastTime = function(self)
		return self.onlineTask.lastTime
	end;	
	
	_getStartTime = function(self)
		return self.onlineTask.startTime
	end;
	
	_findNextTaskId = function(self, taskId)
		for _, res in ipairs(res_online_tasks) do
			if res.precond.taskId == taskId then
				return res.id
			end
		end
		return 0
	end;
	
	_setCircleFlag = function(self)
		if self:isCircled() then return end
		
		local res = Util:qfind(res_online_tasks, 'id', self.onlineTask.taskId)
		if res == nil then return  end
		
		if res.circleType == 1 then
			self.onlineTask.isCircled = 1
		end
	end;
})

NewcomerTask = Class:extends({
	init = function(self, player)
		self.player = player
		self.newTask = self.player:getPersistVar().tasks.newComerTask
	end;
	
	getCurTaskId = function(self)
		return self.newTask.curTaskId
	end;
	
	setCurTaskId = function(self, taskId)
		self.newTask.curTaskId = taskId
	end;
	
	setTaskEnd = function(self)
		self.newTask.isEnd = 1
	end;
	
	isTaskEnd = function(self)
		return self.newTask.isEnd == 1
	end;
	
	setGlobalTipEnd = function(self)
		self.newTask.isGlobalTipEnd = 1
	end;
	
	isGlobalTipEnd = function(self)
		return self.newTask.isGlobalTipEnd == 1
	end
})

ActTask = Class:extends({
	init = function(self, player)
		self.player = player
		self.actTasks = MapCppSortSet(player:getPersistVar().tasks, 'actTaskCount', 'actTasks', 'taskId', MAX_ACT_TASKS_CNT)
		self._fixTimer = FixTimer:new()
		self.player:getTimerCaller():register(TIMER_EVT.REFRESH_ACTTASK, Caller:new(0, self, self._onRefreshTimer))
	end;
	
	start = function(self)
		self._fixTimer:start({hour=0, min=0, sec=1}, {TIMER_EVT.REFRESH_ACTTASK}, self.player:getTimerCaller())
		self:_refresh()
	end;
	
	getTaskById = function(self, taskId)
		return self.actTasks:getByValKey(taskId)
	end;
	
	setTaskState = function(self, taskId, state)
		local task = self.actTasks:getByValKey(taskId)
		task.state = state
		TaskSender:sendActTask(self.player, task.taskId)
		if ActTaskUtil:isOutDate(task) then
			TaskSender:sendDelActTask(self.player, task.taskId)
			self.actTasks:remove(task.taskId)
		end
	end;
	
	getTasks = function(self)
		return self.actTasks
	end;
	
	_refresh = function(self)
		self:_removeOutDateActTasks()
		self:_addTodayActTasks()	
		TaskSender:sendActTasks(self.player)
	end;	
	
	_removeOutDateActTasks = function(self)
		local curTime = Util:getTime()
		local count = self.actTasks:getCount()	
		for i=count-1, 0, -1 do
			local task = self.actTasks:get(i)
			if ActTaskUtil:isOutDate(task) then
				self.actTasks:remove(task.taskId)
			end
		end
	end;
	
	_addTodayActTasks = function(self)
		local fmtFirstLoginTime = Util:getFixPreTime(self.player:getRegTime(), 0, 0, 0)
		for _, res in ipairs(res_active_tasks) do
			local task = self.actTasks:getByValKey(res.id)
			if (task ~= nil) and (task.state == TASK_STATE.COMPLETE) then
				if task.times < task.maxTimes then
					task.state = res.state
					task.times = task.times + 1
				end
			elseif ActTaskUtil:isInTodayTime(res.time, fmtFirstLoginTime) then
				self.actTasks:insert({taskId=res.id
					,state=res.state
					,times=1
					,maxTimes=res.times
					,startTime=ActTaskUtil:getStartTime(res.time, fmtFirstLoginTime)
					,stopTime=ActTaskUtil:getStopTime(res.time, fmtFirstLoginTime)
					})
			end
		end
	end;	
	
	_onRefreshTimer = function(self)
		self:_refresh()
	end;
})

YellowDiamondTask = Class:extends({
	init = function(self, player)
		self.player = player
		self.ydtasks = player:getPersistVar().tasks.ydtasks
		self.gotLvlGifts =  MapCppSet(self.ydtasks, 'lvlCount', 'gotLvlGifts', nil, MAX_YD_LVL_IDS_CNT)
	end;
	
	setGotNewGift = function(self)
		self.ydtasks.gotNewgift = 1
	end;
	
	getGotNewGift = function(self)
		return self.ydtasks.gotNewgift
	end;
	
	setGotCommGift = function(self)
		self.ydtasks.gotCommGift = Util:getTime()
	end;
	
	getGotCommGift = function(self)
		return self.ydtasks.gotCommGift
	end;
	
	setGotYearGift = function(self)
		self.ydtasks.gotYearGift = Util:getTime()
	end;
	
	getGotYearGift = function(self)
		return self.ydtasks.gotYearGift
	end;
	
	getGotLvlGifts = function(self)
		return self.gotLvlGifts
	end;
})


BlueDiamondTask = Class:extends({
	init = function(self, player)
		self.player = player
		self.bdtasks = player:getPersistVar().tasks.bdtasks
		self.gotLvlGifts =  MapCppSet(self.bdtasks, 'lvlCount', 'gotLvlGifts', nil, MAX_BD_LVL_IDS_CNT)
	end;
	
	setGotNewGift = function(self)
		self.bdtasks.gotNewgift = 1
	end;
	
	getGotNewGift = function(self)
		return self.bdtasks.gotNewgift
	end;
	
	setGotCommGift = function(self)
		self.bdtasks.gotCommGift = Util:getTime()
	end;
	
	getGotCommGift = function(self)
		return self.bdtasks.gotCommGift
	end;
	
	setGotYearGift = function(self)
		self.bdtasks.gotYearGift = Util:getTime()
	end;
	
	getGotYearGift = function(self)
		return self.bdtasks.gotYearGift
	end;
	
	setGotHighGift = function(self)
		self.bdtasks.gotHighGift = Util:getTime()
	end;
	
	getGotHighGift = function(self)
		return self.bdtasks.gotHighGift
	end;
	
	getGotLvlGifts = function(self)
		return self.gotLvlGifts
	end;
	
	setGot3366Gift = function(self)
		self.bdtasks.got3366Gift = Util:getTime()
	end;
	
	getGot3366Gift = function(self)
		return self.bdtasks.got3366Gift
	end;
})

PayActTask = Class:extends({
	init = function(self, player)
		self.player = player
		self.payAct = player:getPersistVar().tasks.payAct
	end;
	
	check = function(self) -- when login or act end
		self:_clearWhenTimeOut()
	end;
	
	addGold = function(self, gold)
		self:addAllGold(gold)
		
		self:_clearWhenTimeOut()

		if app:getSvrAct():hasActType(SVR_TODAY_ACT_TYPE.ACT_PAY_1) then
			self.payAct.actAllGold = self.payAct.actAllGold + gold
		end
		
		self.payAct.lastPayTime = Util:getTime()
		ActivityValSender:sendPayActAllGold(self.player)
	end;
	
	addAllGold = function(self, gold)
		self.payAct.allGold = self.payAct.allGold + gold
	end;
	
	getActAllGold = function(self)
		return self.payAct.actAllGold
	end;
	
	getAllGold = function(self)
		return self.payAct.allGold
	end;
	
	setGetGiftFlag = function(self, idx, flag)
		self.payAct.giftGots[idx] = flag
		ActivityValSender:sendPayGiftGots(self.player)
	end;
	
	getGetGiftFlag = function(self, idx)
		return self.payAct.giftGots[idx]
	end;
	
	getGift = function(self, idx) -- from 0 to n-1
		local luaIdx = idx + 1
		if luaIdx > self:_findGiftMaxIdx(self.payAct.actAllGold) then
			return 0
		end
		
		if self:getGetGiftFlag(idx) == 1 then
			return 0
		end
		
		return res_pay_act_gifts[luaIdx].itemid
	end;
	
	getCount = function(self)
		return MAX_PAYACT_GIFT_CNT
	end;
	
	_clearWhenTimeOut = function(self)
		if self.payAct.lastPayTime >= app:getSvrAct():getCurPayActStartTime() 
			and app:getSvrAct():getCurPayActStartTime() > 0 then
			return
		end
		
		if self.payAct.actAllGold == 0 then
			return
		end
		
		local returnper = self:_findReturnPer(self.payAct.actAllGold)
		if returnper > 0 then
			local number = math.ceil((self.payAct.actAllGold*returnper/100)/10)
			local rawItems = {RawItemEx({id=0, resId=FIXID.GIFTGOLD_CARD_10, number=number})}
			local mail = app:getMailMgr():addSysMail(self.player:getRoleName(), rstr.mail.title.payAct, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.payAct,  rawItems)
			MailSender:sendBriefMail(self.player, mail)
			LOG('<pay return giftgold>role:' .. self.player:getRoleName() .. ', cardnumber:' .. number )
		end
		self.payAct.actAllGold = 0
		
		for i=0, self:getCount()-1 do
			self.payAct.giftGots[i] = 0
		end
		
		ActivityValSender:sendPayGiftGots(self.player)
		ActivityValSender:sendPayActAllGold(self.player)
	end;
	
	_findReturnPer = function(self, payGold)
		local returnper = 100
		for _, res in ipairs(res_pay_act_returns) do
			if payGold < res.allpay then
				returnper = res.returnper
				break
			end
		end
		return returnper
	end;
	
	_findGiftMaxIdx = function(self, payGold)
		local maxidx = -1
		for idx, res in ipairs(res_pay_act_gifts) do
			if payGold >= res.allpay then
				maxidx = idx
			end
		end
		return maxidx
	end;
})

WorldBossTask = Class:extends({
	init = function(self, player)
		self.player = player
		self.worldboss = player:getPersistVar().tasks.worldboss
	end;
	
	getTodayTimes = function(self)
		self:_clearTodayWhenTimeOut()
		return self.worldboss.times
	end;
	
	setTodayTimes = function(self, times)
		self.worldboss.refreshTime = Util:getTime()
		self.worldboss.times = times
	end;
	
	getGuwuLevel = function(self)
		self:_clearTodayWhenTimeOut()
		return self.worldboss.guwuLevel
	end;
	
	setGuwuLevel = function(self, guwuLevel)
		self.worldboss.refreshTime = Util:getTime()
		self.worldboss.guwuLevel = guwuLevel
	end;
	
	getGotGift = function(self)
		self:_clearTodayWhenTimeOut()
		return self.worldboss.gotGift
	end;
	
	setGotGift = function(self, got)
		self.worldboss.refreshTime = Util:getTime()
		self.worldboss.gotGift = got
	end;
	
	getPersonRankGiftTime = function(self)
		return self.worldboss.getPersonRankGiftTime
	end;
	
	setPersonRankGiftTime = function(self, time)
		self.worldboss.getPersonRankGiftTime = time
	end;
	
	getCountryRankGiftTime = function(self)
		return self.worldboss.getCountryRankGiftTime
	end;
	
	setCountryRankGiftTime = function(self, time)
		self.worldboss.getCountryRankGiftTime = time
	end;

	clear = function(self)
		self.worldboss.times = 0
		self.worldboss.guwuLevel = 0
		self.worldboss.gotGift = 0
		self.worldboss.refreshTime = 0
	end;
	
	_clearTodayWhenTimeOut = function(self)
		if Util:isCurDay(self.worldboss.refreshTime) then
			return
		end		
		self:clear()
		self.worldboss.refreshTime = Util:getTime()
	end;
})

SendRewardTask = Class:extends({
	init = function(self, player)
		self.player = player
		self.sendReward = player:getPersistVar().tasks.sendReward
	end;
	
	isSendedFirstHero = function(self)
		return self.sendReward.sendFirstHero == 1
	end;
	
	setSendedFirstHero = function(self)
		self.sendReward.sendFirstHero = 1
	end;
})


