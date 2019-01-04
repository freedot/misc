--******************************************************************************
ActTerraceHdr = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = ActTerraceGetBaseInfoHdr()
		self.handlers[2] = ActTerraceEnterHdr()
		self.handlers[3] = ActTerraceExpedHdr()
		self.handlers[4] = ActTerraceExitHdr()
		self.handlers[5] = ActTerraceStartAutoFightHdr()
		self.handlers[6] = ActTerraceStopAutoFightHdr()
		self.handlers[7] = ActTerraceCheckAutoFightHdr()
	end;
})

ActTerraceGetBaseInfoHdr = Class:extends({
	handle = function(self, player, cmdtb)
		ActTerraceSender:sendBaseInfo(player)
		ActTerraceSender:sendResults(player)
		local actTerrace = player:getActTerrace()
		local curGate = actTerrace:getCurGate()
		if actTerrace:getLeftLifes() > 0 and curGate.subGateId < res_act_terrace_max_subgate_id then
			ActTerraceSender:sendEnterTerrace(player)
		end
	end;
})

ActTerraceEnterHdr = ActBaseEnterHdr:extends({
	_isEnoughRoleLevel = function(self, player)
		return player:getLevel() >= res_enter_terrace_need_rolelevel
	end;
	
	_getStartGate = function(self, player, cmdtb)
		self.startGateId = Util:getNumber(cmdtb, 'gateId')
		if self.startGateId < 1 then
			return false
		end
		
		local actTerrace = self:_getActObject(player)
		if self.startGateId > actTerrace:getMaxGate().gateId then
			return false
		end
			
		return true
	end;
	
	_getActObject = function(self, player)
		return  player:getActTerrace()
	end;
	
	_getArriveMaxTimeTipId = function(self)
		return 100158
	end;	
	
	_getMaxFreeEnterTimes = function(self)
		return res_act_terrace_enter_times + app:getSvrAct():getAdditionByActType(SVR_TODAY_ACT_TYPE.ACT_TERRACE_TIMES_1)
	end;
	
	_getMaxItemEnterTimes = function(self)
		return res_act_terrace_enter_times_useitem
	end;	
	
	_gainGift = function(self, player, cmdtb)
		return true
	end;
	
	_setCurGate = function(self, actTerrace)
		actTerrace:setCurGate({gateId=self.startGateId, subGateId=1})
	end;
		
	_sendEnterMsg = function(self, player)
		ActTerraceSender:sendEnterTerrace(player)	
	end;
})

ActTerraceExpedHdr = ActBaseExpedHdr:extends({
	_getActObject = function(self, player)
		return  player:getActTerrace()
	end;
	
	_isHasLeftLife = function(self, player)
		local actTerrace = player:getActTerrace()
		return actTerrace:getLeftLifes() > 0
	end;
	
	_getHeroActState = function(self)
		return HERO_STATE.ACT_TERRACE
	end;
	
	_isArrivedMaxGate = function(self, actTerrace)
		return actTerrace:getCurGate().gateId > self.MAX_GATE_ID_ 
			or actTerrace:getCurGate().subGateId > self.MAX_SUBGATE_ID_
	end;
	
	_sendSimpleEnterMsg = function(self, player)
		ActTerraceSender:sendEnterTerrace(player)
	end;
	
	_expedSuccess = function(self, player)
		local actTerrace = self:_getActObject(player)
		
		local gate = actTerrace:getCurGate()
		local idx = (gate.gateId - 1)*self.MAX_SUBGATE_ID_ + (gate.subGateId - 1)
		actTerrace:setResult(idx, self.fightResult_)
		ActTerraceSender:sendResult(player, idx)
		
		actTerrace:setMaxGate(gate)
		actTerrace:setCurGate({gateId=gate.gateId, subGateId=gate.subGateId + 1})
		
		self:_clearLeftWhenPassGates(actTerrace)
		self:_resetWhenArrivedMaxSubGate(actTerrace)
		
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.JION_ACT_TERRACE)
		TaskFinisher:checkTasks(player)
	end;
	
	_clearLeftWhenPassGates = function(self, actTerrace)
		if actTerrace:getCurGate().subGateId > self.MAX_SUBGATE_ID_ then
			actTerrace:setLeftLifes(0)
		end
	end;
	
	_resetWhenArrivedMaxSubGate = function(self, actTerrace)
		local curGate = actTerrace:getCurGate()
		local maxGate = actTerrace:getMaxGate()
		if curGate.gateId > maxGate.gateId then
			actTerrace:setMaxGate({gateId=curGate.gateId, subGateId=1})
		end
		
		maxGate = actTerrace:getMaxGate()
		if (curGate.gateId == maxGate.gateId) and (curGate.subGateId > self.MAX_SUBGATE_ID_) then
			actTerrace:setMaxGate({gateId=curGate.gateId+1, subGateId=1})
		end
	end;
	
	_expedFail = function(self, player)
		local actObject = self:_getActObject(player)
		actObject:setLeftLifes(actObject:getLeftLifes() - 1)
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.JION_ACT_TERRACE)
	end;
	
	_sendEnterMsg = function(self, player, lastGateInfo)
		ActTerraceSender:sendEnterTerrace(player, self.fightDemo_)
	end;
})

ActTerraceExitHdr = ActBaseExitHdr:extends({
	_getActObject = function(self, player)
		return  player:getActTerrace()
	end;
	
	_setCurGate = function(self, actObject)
		actObject:setCurGate({gateId=1, subGateId=1})
	end;
	
	_sendSimpleEnterMsg = function(self, player)
		ActTerraceSender:sendExitTerrace(player)
	end;
})

ActTerraceStartAutoFightHdr = ActBaseStartAutoFightHdr:extends({
	_getReplaceState = function(self) -- return old, new
		return HERO_STATE.FREE, HERO_STATE.ACT_TERRACE
	end;	
	
	_startOperate = function(self, player, cmdtb)
		player:getActTerrace():setAutoStartTime(Util:getTime())
		player:getActTerrace():setAutoToSubGateId(Util:getNumber(cmdtb, 'toGate'))
	end;
})

ActTerraceStopAutoFightHdr = ActBaseStopAutoFightHdr:extends({
	_getReplaceState = function(self) -- return old, new
		return HERO_STATE.ACT_TERRACE, HERO_STATE.FREE
	end;
	
	_stopOperate = function(self, player)
		player:getActTerrace():setAutoStartTime(0)
	end;
})

ActTerraceCheckAutoFightHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if player:getActTerrace():getAutoStartTime() > 0 then
			ActTerraceSender:sendInAutoFightState(player)
		end
	end;
})


