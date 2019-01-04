
TaskHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[0] = GetAllTasksHdr()
		self.handlers[1] = GetTaskRewardHdr()
		self.handlers[2] = DoRoleTaskHdr()
		self.handlers[3] = ChangeEverydayTaskHdr()
		self.handlers[4] = CompleteEverydayTaskHdr()
		self.handlers[5] = GetRewardByPrestigeHdr()
		self.handlers[6] = GetOnlineTaskRewardHdr()
		self.handlers[7] = GetOnlineTaskInfoHdr()
		self.handlers[8] = AddFavoriteTaskHdr()
		self.handlers[9] = NewcommerEndTaskHdr()
	end;
})

GetAllTasksHdr = Class:extends({
	handle = function(self, player)	
		TaskSender:sendCommTasks(player)
		TaskSender:sendEveryDayTasks(player)
		TaskSender:sendDoingRoleTask(player)
		TaskSender:sendPrestigeTask(player)
	end;
})

GetTaskRewardHdr = Class:extends({
	init = function(self)
		self.dropItemEffector_ = DropItemEffector()
	end;
	
	handle = function(self, player, cmdtb)	
		local taskId = Util:getNumber(cmdtb, 'taskId')
		local task = player:getTask():getTaskById(taskId)
		if task == nil then
			return false
		end
		
		if task.state ~= TASK_STATE.WAIT_GET then
			return false
		end
		
		local res = ItemResUtil:findItemres(task.taskId)
		local effectRes = {val=res.dropId}
		if not self.dropItemEffector_:isCanExec(player, 1, effectRes, {}) then
			return false
		end
	
		local skipSubItem = Util:getNumber(cmdtb, 'skipSubItem', 0) == 1
		if not skipSubItem and self:_isSubItemFinishType(res)  then
			if not self:_hasEnoughItem(player, res) then
				WUtil:sendWarningMsgArgs(player, 100164, '"@itemid' .. res.docond[1].val1  .. '",' .. res.docond[1].val2 )
				return false
			else
				player:getPkg():subItemByResId(res.docond[1].val1, res.docond[1].val2)
			end
		end
		
		self.dropItemEffector_:exec(player, 1, effectRes, {})
		player:getTask():setTask(taskId, TASK_STATE.COMPLETE)
		
		self:_checkNewcomerSpiritEnd(player, taskId)
		
		return true
	end;
	
	_checkNewcomerSpiritEnd = function(self, player, taskId)
		if taskId == FIXID.UP_SHUYUAN2 then
			player:getTask():getNewcomerTask():setTaskEnd()
			TaskSender:sendStartGlobalTip(player)
		end
	end;
	
	_isSubItemFinishType = function(self, res)
		return res.docond ~= nil and res.docond[1].type ==  TASK_FINISH_TYPE.SUB_ITEM
	end;
	
	_hasEnoughItem = function(self, player, res)
		return player:getPkg():getItemNumber(res.docond[1].val1) >= res.docond[1].val2
	end;
})

DoRoleTaskHdr = Class:extends({
	handle = function(self, player, cmdtb)
		local doingTask = player:getTask():getDoingRoleTask()
		if doingTask:getStopTime() > 0 then
			return false
		end
		
		if doingTask:getCDStopTime() > 0 then
			return false
		end
		
		local taskId = Util:getNumber(cmdtb, 'taskId')
		local res = ItemResUtil:findItemres(taskId)
		if not self:_isValidTaskRes(res) then
			return false
		end
		
		if not self:_isSatisfiedRoleLevel(player, res) then
			return false
		end
		
		local expend = RoleAttrExpend:new(player, {attr=ATTR.PS, val=res.needps})
		if not expend:isEnough() then
			return false
		end
		
		expend:sub()
		doingTask:setTaskId(taskId)
		doingTask:setStopTime(Util:getTime() + self:_getNeedTime(player, res))
		doingTask:startDoing()
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.FINISH_ONE_ROLETASK)
		return true
	end;
	
	_getNeedTime = function(self, player, res)
		if player:hasVipEffect(VIP_EFF.SPEED_ROLETASK) then
			return 0
		else
			return res.needtime
		end
	end;
	
	_isValidTaskRes = function(self, res)
		return (res ~= nil) and (res.type == TASK_TYPE.ROLE)
	end;
	
	_isSatisfiedRoleLevel = function(self, player, res)
		return player:getLevel() >= res.precond.roleLevel
	end;
})

EverydayTaskBaseHdr = Class:extends({
	handle = function(self, player, cmdtb)
		local taskId = Util:getNumber(cmdtb, 'taskId')
		local taskIdx = self:_getTaskIdx(taskId)
		local everydayTask = player:getTask():getEveryDayTask()
		if taskIdx <= 0 or taskIdx > everydayTask:getTaskCount() then
			return false
		end
		
		if not self:_isValidTaskState(everydayTask, taskId) then
			return false
		end
		
		local expend = GoldExpend(player, {attr=ATTR.GOLD,val=self:_getNeedGold()})
		if not expend:isEnough() then
			return false
		end
		
		if not self:_handle(player, everydayTask, taskId) then
			return false
		end
		
		expend:sub()
		return true
	end;
	
	_isValidTaskState = function(self, everydayTask, taskId)
		return everydayTask:getTaskState(taskId) == 0
	end;
	
	_getTaskIdx = function(self, taskId)
		return taskId%100
	end;
})

ChangeEverydayTaskHdr = EverydayTaskBaseHdr:extends({
	_isValidTaskState = function(self, everydayTask, taskId)
		return everydayTask:getTaskState(taskId) ~= TASK_STATE.COMPLETE
	end;
	
	_getNeedGold = function(self)
		return res_change_everyday_task_need_gold
	end;
	
	_handle = function(self, player, everydayTask, taskId)
		everydayTask:randTask(self:_getTaskIdx(taskId))
		return true
	end;
})

CompleteEverydayTaskHdr = EverydayTaskBaseHdr:extends({
	init = function(self)
		self.getTaskRewardHdr_ = GetTaskRewardHdr()
	end;
	
	_getNeedGold = function(self)
		return res_complete_everyday_task_need_gold
	end;
	
	_handle = function(self, player, everydayTask, taskId)
		everydayTask:setTaskState(taskId, TASK_STATE.WAIT_GET)
		local ret = self.getTaskRewardHdr_:handle(player, {taskId=taskId, skipSubItem=1})
		if not ret then -- roll back state
			everydayTask:setTaskState(taskId, 0)
		else
			TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.FINISH_PRESTIGE_TASK)
		end
		return ret
	end;
})

GetRewardByPrestigeHdr = Class:extends({
	init = function(self)
		self.dropItemEffector_ = DropItemEffector()
	end;
	
	handle = function(self, player)
		if Util:isCurDay(player:getTask():getPrestigeLastTime()) then
			return false
		end
		
		local dropId = self:_getDropIdByPrestige(player:getPrestige())
		if dropId < 0 then
			return false
		end
		
		local effectRes = {val=dropId}
		if not self.dropItemEffector_:isCanExec(player, 1, effectRes, {}) then
			return false
		end
		
		self.dropItemEffector_:exec(player, 1, effectRes, {})
		player:getTask():setPrestigeLastTime(Util:getTime())
		
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.GET_REWARD_BY_PRESTIGE)
		
		return true
	end;
	
	_getDropIdByPrestige = function(self, prestige)
		if prestige < 1000 then
			return -1
		elseif prestige < 5000 then
			return 7500315
		elseif prestige < 20000 then
			return 7500316
		else
			return 7500317
		end
	end;
})

GetOnlineTaskRewardHdr = Class:extends({
	init = function(self)
		self.dropItemEffector_ = DropItemEffector()
	end;
	
	handle = function(self, player)
		local onlineTask = player:getTask():getOnlineTask()
		if onlineTask:getTaskId() == 0 then
			return false
		end
		
		if Util:getTime() < onlineTask:getTaskStopTime() - TIMER_DRT_TIME then
			return false
		end
		
		local res = ItemResUtil:findItemres(onlineTask:getTaskId())
		local effectRes = {val=res.dropId}
		if not self.dropItemEffector_:isCanExec(player, 1, effectRes, {}) then
			return false
		end
		
		self.dropItemEffector_:exec(player, 1, effectRes, {})
		onlineTask:setTask(onlineTask:getTaskId(), TASK_STATE.COMPLETE)
		
		return true
	end;
})

GetOnlineTaskInfoHdr = Class:extends({
	handle = function(self, player)
		TaskSender:sendOnlineTask(player)
	end;
})

AddFavoriteTaskHdr = Class:extends({
	handle = function(self, player)
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.FAVORITE_URL)
	end;
})

NewcommerEndTaskHdr = Class:extends({
	handle = function(self, player, cmdtb)
		player:getTask():getNewcomerTask():setGlobalTipEnd()
		TaskSender:sendOpenTodayAct(player)
	end;
})

