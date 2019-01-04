--*******************************************************************************
TaskFinishChecker = Class:extends({
	init = function(self)
		self:_initTypeCheckers()
		self:_initNeedImmCheckTypes()
	end;
	
	_initTypeCheckers = function(self)
		self.typeCheckers_ = {
			[TASK_FINISH_TYPE.FARMPOPU] = 2
			,[TASK_FINISH_TYPE.HAS_BUILD] = 4
			,[TASK_FINISH_TYPE.CARRY_SOLDIER] = 3
			,[TASK_FINISH_TYPE.TRAIN_SOLDIER] = 3
			,[TASK_FINISH_TYPE.MAX_POPU] = 2
			,[TASK_FINISH_TYPE.MENOY_OUTPUT] = 2
			,[TASK_FINISH_TYPE.CITY_BUILD_VAL] = 2
			,[TASK_FINISH_TYPE.NEWSOLIDER_MAX] = 2
			,[TASK_FINISH_TYPE.HAS_CITY_DEF] = 3
			,[TASK_FINISH_TYPE.BUILD_CITY_DEF] = 3
			,[TASK_FINISH_TYPE.ALLI_MEM_NUM] = 2
			,[TASK_FINISH_TYPE.HAS_ITEM_NUM] = 3
			,[TASK_FINISH_TYPE.SUB_ITEM] = 3
			,[TASK_FINISH_TYPE.USE_ITEM] = 5
			,[TASK_FINISH_TYPE.WIN_ACT_TOWER] = 2
			,[TASK_FINISH_TYPE.LEARN_CULTURE] = 3
			,[TASK_FINISH_TYPE.CITY_LEVEL] = 2
			,[TASK_FINISH_TYPE.HERO_UPGRADE] = 2
			,[TASK_FINISH_TYPE.BUILD_SUBCITY] = 2
			,[TASK_FINISH_TYPE.ROLE_UPGRADE] = 2
			,[TASK_FINISH_TYPE.WIN_ACT_TERRACE] = 2
			,[TASK_FINISH_TYPE.GET_ALLICONTRI_BYCOMMITRES] = 2
			,[TASK_FINISH_TYPE.ZHANLING_FIELD] = 2
			,[TASK_FINISH_TYPE.DANTIAO_FIELD] = 2
		}
	end;	
	
	_initNeedImmCheckTypes = function(self)
		self.immediatelyTypes_ = {
			[TASK_FINISH_TYPE.FARMPOPU] = true
			,[TASK_FINISH_TYPE.HAS_BUILD] = true
			,[TASK_FINISH_TYPE.WIN_ACT_TOWER] = true
			,[TASK_FINISH_TYPE.MAX_POPU] = true
			,[TASK_FINISH_TYPE.LEARN_CULTURE] = true
			,[TASK_FINISH_TYPE.MENOY_OUTPUT] = true
			,[TASK_FINISH_TYPE.CITY_LEVEL] = true
			,[TASK_FINISH_TYPE.JION_ALLI] = true
			,[TASK_FINISH_TYPE.STEEL_HERO_JING_MAI] = true
			,[TASK_FINISH_TYPE.HAS_ONE_ARM] = true
			,[TASK_FINISH_TYPE.CITY_BUILD_VAL] = true
			,[TASK_FINISH_TYPE.NEWSOLIDER_MAX] = true
			,[TASK_FINISH_TYPE.HAS_CITY_DEF] = true
			,[TASK_FINISH_TYPE.BUILD_SUBCITY] = true
			,[TASK_FINISH_TYPE.ROLE_UPGRADE] = true
			,[TASK_FINISH_TYPE.WIN_ACT_TERRACE] = true
			,[TASK_FINISH_TYPE.ALLI_MEM_NUM] = true
			,[TASK_FINISH_TYPE.HAS_ITEM_NUM] = true
			,[TASK_FINISH_TYPE.SUB_ITEM] = true
			,[TASK_FINISH_TYPE.RECRUIT_HERO] = true
		}
	end;
	
	check = function(self, docond, doType, doVal1, doVal2, doVal3)
		if self.typeCheckers_[doType] == 2 then
			return self:_check2(docond, doType, doVal1, doVal2, doVal3)
		elseif self.typeCheckers_[doType] == 3 then
			return self:_check3(docond, doType, doVal1, doVal2, doVal3)
		elseif self.typeCheckers_[doType] == 4 then
			return self:_check4(docond, doType, doVal1, doVal2, doVal3)
		elseif self.typeCheckers_[doType] == 5 then
			return self:_check5(docond, doType, doVal1, doVal2, doVal3)
		else
			return self:_check1(docond, doType, doVal1, doVal2, doVal3)
		end
	end;
	
	immCheck = function(self, player, docond)
		if docond == nil then 
			return false 
		end
		
		if not self:isNeedCheck(docond[1].type) then
			return false
		end
		
		local doType, doVal1, doVal2, doVal3 = self:_getImmCheckParam(player, docond)
		return self:check(docond, doType, doVal1, doVal2, doVal3)
	end;
	
	isNeedCheck = function(self, doType)
		return self.immediatelyTypes_[doType] == true
	end;
	
	_check1 = function(self, docond, doType, doVal1, doVal2, doVal3)
		return docond[1].type == doType 
			and docond[1].val1 == doVal1 
			and docond[1].val2 == doVal2 
			and docond[1].val3 == doVal3
	end;
	
	_check2 = function(self, docond, doType, doVal1, doVal2, doVal3)
		return docond[1].type == doType 
			and docond[1].val1 <= doVal1 
			and docond[1].val2 == doVal2 
			and docond[1].val3 == doVal3
	end;
	
	_check3 = function(self, docond, doType, doVal1, doVal2, doVal3)
		return docond[1].type == doType 
			and docond[1].val1 == doVal1 
			and docond[1].val2 <= doVal2 
			and docond[1].val3 == doVal3
	end;
	
	_check4 = function(self, docond, doType, doVal1, doVal2, doVal3)
		return docond[1].type == doType 
			and docond[1].val1 == doVal1 
			and docond[1].val2 == doVal2 
			and docond[1].val3 <= doVal3
	end;
	
	_check5 = function(self, docond, doType, doVal1, doVal2, doVal3)
		return docond[1].type == doType and (docond[1].val1 == doVal1 or docond[1].val1 == doVal2)
	end;
	
	_getImmCheckParam = function(self, player, docond)
		local doType = docond[1].type
		local doVal1 = 0
		local doVal2 = 0
		local doVal3 = 0
		
		if doType == TASK_FINISH_TYPE.FARMPOPU then
			doVal1 = player:getFarm():getWorkforce()
		elseif doType == TASK_FINISH_TYPE.HAS_BUILD then
			doVal1 = docond[1].val1  -- resid
			doVal2 = docond[1].val2 -- level
			local mainCity = player:getCitys():getCityById(BUILDCITY_ID.MAIN)
			if mainCity ~= nil then
				doVal3 = mainCity:getBuildCountByResIdLevel(doVal1, doVal2)
			end
		elseif doType == TASK_FINISH_TYPE.WIN_ACT_TOWER then	
			doVal1 = player:getActTower():getMaxLayer()
		elseif doType == TASK_FINISH_TYPE.MAX_POPU then
			doVal1 = player:getCitys():getMaxPopu()
		elseif doType == TASK_FINISH_TYPE.LEARN_CULTURE then
			doVal1 = docond[1].val1 -- culture resid
			doVal2 = player:getCultures():getLevel(doVal1)
		elseif doType == TASK_FINISH_TYPE.MENOY_OUTPUT then
			doVal1 = player:getCityRes():getMoneyOutput()
		elseif doType == TASK_FINISH_TYPE.CITY_LEVEL then
			doVal1 = player:getCityRes():getLevel()
		elseif doType == TASK_FINISH_TYPE.JION_ALLI then
			doVal1 = -1
			if player:getAlliId() > 0 then
				doVal1 = 0
			end
		elseif doType == TASK_FINISH_TYPE.STEEL_HERO_JING_MAI then
			doVal1 = -1
			local heroMgr = player:getHeroMgr()
			local endIdx = heroMgr:getHeroCount() - 1
			for i=0, endIdx, 1 do
				local hero = heroMgr:getHeroByIdx(i)
				if hero:getSkeletonLevel() > 0 then
					doVal1 = 0
					break
				end
			end
		elseif doType == TASK_FINISH_TYPE.HAS_ONE_ARM then
			doVal1 = -1
			local pkg = player:getPkg()
			local endIdx = pkg:getItemsCount() - 1
			for i=0, endIdx, 1 do
				local item = pkg:getItemByIdx(i)
				local res = ItemResUtil:findItemres(item:getResId())
				if res.apos ~= nil then
					doVal1 = 0
					break
				end
			end
		elseif doType == TASK_FINISH_TYPE.CITY_BUILD_VAL then
			doVal1 = player:getCityRes():getBuildVal()
		elseif doType == TASK_FINISH_TYPE.NEWSOLIDER_MAX then
			doVal1 = player:getAttrVal(ATTR.MNAF)
		elseif doType == TASK_FINISH_TYPE.HAS_CITY_DEF then
			doVal1 = docond[1].val1  -- resid
			doVal2 = player:getCityDef():getDefNumber(CityDefUtil:getDefTypeFromResId(doVal1))
		elseif doType == TASK_FINISH_TYPE.BUILD_SUBCITY then
			doVal1 = player:getCitys():getCityCount() - 1
		elseif doType == TASK_FINISH_TYPE.ROLE_UPGRADE then
			doVal1 = player:getLevel()
		elseif doType == TASK_FINISH_TYPE.WIN_ACT_TERRACE then
			local maxGate = player:getActTerrace():getMaxGate()
			local passGateId = maxGate.gateId
			if maxGate.subGateId < res_act_terrace_max_subgate_id then
				passGateId = passGateId - 1
			end
			doVal1 = passGateId
		elseif doType == TASK_FINISH_TYPE.ALLI_MEM_NUM then
			local alliance = app:getAlliMgr():getAlliById(player:getAlliId() )
			doVal1 =  alliance:getMemberCount()
		elseif doType == TASK_FINISH_TYPE.HAS_ITEM_NUM or doType == TASK_FINISH_TYPE.SUB_ITEM then	
			doVal1 = docond[1].val1  -- resid
			doVal2 = player:getPkg():getItemNumber(doVal1)
		elseif doType == TASK_FINISH_TYPE.RECRUIT_HERO then
			doVal1 = -1
			local prof = docond[1].val1
			local heroMgr = player:getHeroMgr()
			local endIdx = heroMgr:getHeroCount() - 1
			for i=0, endIdx, 1 do
				local hero = heroMgr:getHeroByIdx(i)
				if hero:getProf() == prof then
					doVal1 = prof
					break
				end
			end
		end
	
		return doType, doVal1, doVal2, doVal3
	end;
})

TasksTravel = Class:extends({
	init = function(self, commChecker, newcomerChecker, actvalChecker)
		self.travels_ = {}
		table.insert(self.travels_, ActValTasksTravel(actvalChecker))
		table.insert(self.travels_, ActTasksTravel(commChecker))
		table.insert(self.travels_, GrowupTasksTravel(commChecker))
		table.insert(self.travels_, EverydayTasksTravel(commChecker))
		table.insert(self.travels_, NewcomerTasksTravel(newcomerChecker))
	end;
	
	-- static creation method
	createTrigerTravel = function() 
		return TasksTravel(
			CommTasksTrigerChecker(TaskFinishChecker())
			,NewcomerTasksTrigerChecker(TaskFinishChecker()) 
			,ActValTasksTrigerChecker(TaskFinishChecker()) )
	end;
	
	-- static creation method
	createCheckTravel = function()
		return TasksTravel(
			CommTasksCheckChecker(TaskFinishChecker()) 
			,NewcomerTasksCheckChecker(TaskFinishChecker()) 
			,ActValTasksCheckChecker(TaskFinishChecker()) )
	end;
	
	travel = function(self, player, doType, doVal1, doVal2, doVal3)
		for _, travel in ipairs(self.travels_) do
			travel:travel(player, doType, doVal1, doVal2, doVal3)
		end
	end;
})

BaseTasksTravel = Class:extends({
	init = function(self, checker)
		self.checker_ = checker
	end;
})

ActTasksTravel = BaseTasksTravel:extends({
	travel = function(self, player, doType, doVal1, doVal2, doVal3)
		local curTime = Util:getTime()
		local tasks = player:getTask():getActTask():getTasks()
		local count = tasks:getCount()
		for i=0, count-1, 1 do
			local task = tasks:get(i)
			if self:_isInActTime(curTime, task) and self.checker_:check(player, task, doType, doVal1, doVal2, doVal3) then
				player:getTask():setTask(task.taskId, TASK_STATE.WAIT_GET)
				break
			end
		end
	end;
	
	_isInActTime = function(self, curTime, task)
		return curTime >= task.startTime and curTime < task.stopTime
	end;
})

GrowupTasksTravel = BaseTasksTravel:extends({
	travel = function(self, player, doType, doVal1, doVal2, doVal3)
		local tasks = player:getTask():getCommTasks()
		local count = tasks:getCount()
		for i=0, count-1, 1 do
			local task = tasks:get(i)
			if self.checker_:check(player, task, doType, doVal1, doVal2, doVal3) then
				player:getTask():setTask(task.taskId, TASK_STATE.WAIT_GET)
				break
			end
		end
	end;
})

EverydayTasksTravel = BaseTasksTravel:extends({
	travel = function(self, player, doType, doVal1, doVal2, doVal3)
		local everydayTasks = player:getTask():getEveryDayTask()
		local count = everydayTasks:getTaskCount()
		local sortIdxs = self:_sortTaskByResId(player)
		for _, idxnode in ipairs(sortIdxs) do
			local task = everydayTasks:getTask(idxnode.idx)
			if self.checker_:check(player, task,  doType, doVal1, doVal2, doVal3) then
				player:getTask():setTask(task.taskId*100 + idxnode.idx, TASK_STATE.WAIT_GET)
				break
			end
		end
	end;
	
	_sortTaskByResId = function(self, player)
		local taskIdxs = {}
		local everydayTasks = player:getTask():getEveryDayTask()
		local count = everydayTasks:getTaskCount()
		for i=1, count, 1 do
			local task = everydayTasks:getTask(i)
			table.insert(taskIdxs, {resId=task.taskId, idx=i})
		end
		
		table.sort(taskIdxs, function(a,b)
			return a.resId > b.resId
		end)
		return taskIdxs
	end;
})

ActValTasksTravel = BaseTasksTravel:extends({
	travel = function(self, player,  doType, doVal1, doVal2, doVal3)
		local activityVal = player:getTask():getActivityVal()
		local count = activityVal:getTaskCount()
		for i=1, count, 1 do
			local task = activityVal:getTask(i)
			if self.checker_:check(player, task,  doType, doVal1, doVal2, doVal3) then
				local res = ItemResUtil:findItemres(task.taskId)
				activityVal:setTodayVal(activityVal:getTodayVal() + res.val + self:_getVipEffectVal(player, doType) )
				activityVal:addTaskTimes(i)
				break
			end
		end
	end;
	
	_getVipEffectVal = function(self, player, doType)
		if doType ~= TASK_FINISH_TYPE.ROLELOGIN_EVERYDAY then
			return 0
		end
		
		return player:getVipEffectVal(VIP_EFF.ADD_ACTVAL)
	end;
})

NewcomerTasksTravel = BaseTasksTravel:extends({
	travel = function(self, player,  doType, doVal1, doVal2, doVal3)
	end;
})

BaseTasksChecker = Class:extends({
	init = function(self, checker)
		self.innerChecker_ = checker
	end;
})

CommTasksTrigerChecker = BaseTasksChecker:extends({
	check = function(self, player, task, doType, doVal1, doVal2, doVal3)
		if task.state ~= TASK_STATE.WAIT_COMPLETE then
			return false
		end
		
		local res = ItemResUtil:findItemres(task.taskId)
		if res == nil then
			return false
		end
		
		return self.innerChecker_:check(res.docond, doType, doVal1, doVal2, doVal3)
	end;
})

CommTasksCheckChecker = BaseTasksChecker:extends({
	check = function(self, player, task)
		if task.state ~= TASK_STATE.WAIT_COMPLETE then
			return false
		end
		
		local res = ItemResUtil:findItemres(task.taskId)
		if res == nil then
			return false
		end
		
		return self.innerChecker_:immCheck(player, res.docond)
	end;
})

NewcomerTasksTrigerChecker = BaseTasksChecker:extends({
	check = function(self, player, newcomerTask, res, doType, doVal1, doVal2, doVal3)
		return true
	end;
})

NewcomerTasksCheckChecker = BaseTasksChecker:extends({
	check = function(self, player, newcomerTask, res)
		return true
	end;
})

ActValTasksTrigerChecker = BaseTasksChecker:extends({
	check = function(self, player, task, doType, doVal1, doVal2, doVal3)
		local res = ItemResUtil:findItemres(task.taskId)
		if res == nil or task.times >= res.times then
			return false
		end
		return self.innerChecker_:check(res.docond, doType, doVal1, doVal2, doVal3)	
	end;
})

ActValTasksCheckChecker = BaseTasksChecker:extends({
	check = function(self, player, task, doType, doVal1, doVal2, doVal3)
		return false
	end;
})

TaskFinisher = Class:extends({
	init = function(self)
		self.checker = TaskFinishChecker:new()
		self.trigerTravel = TasksTravel:createTrigerTravel()
		self.checkTravel = TasksTravel:createCheckTravel()
	end;
	
	--@ remark 该行为没有持久记录，只能在出发时进行检查
	trigerTask = function(self, player, doType, doVal1, doVal2, doVal3)
		if self.checker:isNeedCheck(doType) then
			self:checkTasks(player)
			return 
		end
		
		if doVal1 == nil then doVal1 = 0 end
		if doVal2 == nil then doVal2 = 0 end
		if doVal3 == nil then doVal3 = 0 end
		
		self.trigerTravel:travel(player, doType, doVal1, doVal2, doVal3)
	end;
	
	--@ remark 该行为可以被收集检查到
	checkTasks = function(self, player)
		self.checkTravel:travel(player)
	end;
	
	isImmFinish = function(self, player, docond)
		return self.checker:immCheck(player, docond)
	end;
}):new()


