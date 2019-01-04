--*******************************************************************************
--*******************************************************************************
StateUtil = Class:extends({
	getEffectStateElapse = function(self, state)
		local elapse = 0
		local stype = state:getType()
		if stype == EFFECT_TYPE.PER_SECOND then
			elapse = 1
		elseif stype == EFFECT_TYPE.PER_FIVESECOND then
			elapse = 5
		elseif stype == EFFECT_TYPE.PER_TENSECOND then
			elapse = 10
		elseif stype == EFFECT_TYPE.PER_MINUTE then
			elapse = 60
		elseif stype == EFFECT_TYPE.PER_HOUR then
			elapse = 3600
		elseif stype == EFFECT_TYPE.ONETIME or stype == EFFECT_TYPE.PERDURE then
			elapse = state:getStopTime() - Util:getTime()
			if elapse < 0 then elapse = 0 end
		end
		return elapse
	end;	
}):new()

StateContainer = Class:extends({
	init = function(self, player, states, maxCount)
		self.player = player
		self.innerStates = states
		self.maxCount = maxCount
		if self.innerStates.lastStateId == nil then
			self.innerStates.lastStateId = 1000
		end
		self:_createStateObjs()
	end;
	
	start = function(self)
		self:_startStates()
	end;
	
	getStatesCount = function(self)
		return table.getn(self.states)
	end;
	
	getStateByIdx = function(self, idx) -- from 1 to n
		return self.states[idx]
	end;
	
	appendState = function(self, stateRes, creator)
		if not self:isCanAppend(stateRes.effect.id) then 
			return 
		end
	
		self:_stopStatesByRel(stateRes.effect.id)
		local ref, state = self:_getCanOverlayState(stateRes.effect.id)
		if state ~= nil then
			self:_overlayState(ref, state, stateRes, creator)
		else
			self:_appendNewState(stateRes, creator)
		end
	end;
	
	stopState = function(self, effectId)
		local collectStates = self:_getEffectStates(effectId)
		for _, state in ipairs(collectStates) do
			self:_stopState(nil, state)
		end
	end;
	
	updateState = function(self, timer, stateId)
		local state = self:_getStateById(stateId)
		if state == nil then
			timer:stop()
			return 
		end
		
		if self:_isNeedStopTimer(state) then
			-- 为了将过期的时钟停止掉，增加此句
			timer:stop()
		end
		
		if state:update() == RET_STATE_END then
			self:_stopState(timer, state)
		end
	end;
	
	hasEffectState = function(self, effectId)
		return self:getEffectState(effectId) ~= nil
	end;
	
	_isNeedStopTimer = function(self, state)
		local stype = state:getType()
		return stype == EFFECT_TYPE.ONETIME  or stype == EFFECT_TYPE.PERDURE
	end;
	
	_getEffectStates = function(self, effectId)
		local states = {}
		for i=#self.states, 1, -1 do
			local state = self.states[i]
			if state:getEffectId() == effectId then
				table.insert(states, state)
			end
		end
		return states
	end;
	
	getEffectState = function(self, effectId)
		for _, state in ipairs(self.states) do
			if state:getEffectId() == effectId then
				return state
			end
		end
		
		return nil
	end;
	
	isCanAppend = function(self, effectId)
		for _, state in ipairs(self.states) do
			local rel = res_get_state_relations(state:getEffectId(), effectId)
			if rel == STATE_REL.MUTEX then 
				WUtil:sendWarningMsgArgs(self.player, 100101, '"@effid' .. state:getEffectId() .. '","@effid' .. effectId .. '"')
				return false 
			end
		end
		
		return true
	end;
	
	_allocId = function(self)
		self.innerStates.lastStateId = self.innerStates.lastStateId + 1
		return self.innerStates.lastStateId
	end;
	
	_createStateObjs = function(self)
		self.states = {}
		for i=0, self.innerStates.count-1, 1 do
			self:_createStateObj(self.innerStates.states[i])
		end
	end;
	
	_startStates = function(self)
		for _, state in ipairs(self.states) do
			self:_startState(state)
		end
	end;
	
	_startState = function(self, state)
		local needTime = StateUtil:getEffectStateElapse(state)
		global.getTimer():start(needTime*1000, {TIMER_EVT.PLAYER_BUFF, state:getId()}, self.player:getTimerCaller())
		RoleStateSender:sendAddState(self.player, state)
		state:enter()
	end;
	
	_stopState = function(self, timer, state)
		if timer ~= nil and timer ~= 'nil' then
			timer:stop()
		end
		RoleStateSender:sendDelState(self.player, state)
		self:_removeStateById(state:getId())
		state:leave()
	end;
	
	_getStateById = function(self, stateId)
		return Util:findByFun(self.states, 'getId', stateId)
	end;
	
	_stopStatesByRel = function(self, effectId)
		local len = table.getn(self.states)
		for i=len, 1, -1 do
			local state = self.states[i]
			local rel = res_get_state_relations(state:getEffectId(), effectId)
			if rel == STATE_REL.REPLACE then
				self:_stopState(nil, state)
			end
		end
	end;
	
	_getCanOverlayState = function(self, effectId)
		for _, state in ipairs(self.states) do
			local rel = res_get_state_relations(state:getEffectId(), effectId)
			if (state:getEffectId() == effectId) 
				and (	rel == STATE_REL.REPLACE_ADD_DUR 
						or rel == STATE_REL.REPLACE_ADD_VAL
						or rel == STATE_REL.REPLACE_ADD_DURVAL ) then
				return rel, state 
			end
		end
		
		return nil, nil
	end;
	
	_overlayState = function(self, ref, state, stateRes, creator)
		if (ref == nil) or (state == nil) then
			return
		end
		
		if ref == STATE_REL.REPLACE_ADD_DUR  then
			state:addDuration(stateRes.duration)
		elseif ref == STATE_REL.REPLACE_ADD_VAL then
			state:addEffectVal(stateRes.val)
		elseif ref == STATE_REL.REPLACE_ADD_DURVAL then
			state:addDuration(stateRes.duration)
			state:addEffectVal(stateRes.val)
		else
			return 
		end
		
		state:setCreator(creator)
		self:_startState(state)
	end;
	
	_appendNewState = function(self, stateRes, creator)
		local innerState = self:_allocInnerState()
		if innerState == nil then
			return
		end
		
		self:_initInnerState(innerState, stateRes, creator)
		local state = self:_createStateObj(innerState)
		self:_startState(state)
	end;
	
	_removeStateById = function(self, stateId)
		self:_removeStateByIdx( self:_getStateIdxById(stateId) )
	end;
	
	_getStateIdxById = function(self, stateId)
		Util:findByFun(self.states, 'getId', stateId)
		return Util:getLastFindIdx()
	end;
	
	_removeStateByIdx = function(self, stateIdx)
		self:_destroyStateObj(stateIdx)
		self:_freeInnerState(stateIdx)
	end;
	
	_createStateObj = function(self, innerState)
		local state = StateCreator:create(self.player, self:_allocId(), innerState)
		table.insert(self.states, state)
		return state
	end;	
	
	_destroyStateObj = function(self, stateIdx)
		if stateIdx <= 0 or stateIdx > table.getn(self.states) then
			return
		end
		
		local findIdx = stateIdx
		local lastIdx = table.getn(self.states) - 1
		for i = findIdx, lastIdx, 1 do
			self.states[i]:copy(self.states[i+1])
		end
		table.remove(self.states, lastIdx+1)
	end;
	
	_allocInnerState = function(self)
		if self.innerStates.count < self.maxCount then
			local innerState = self.innerStates.states[self.innerStates.count]
			self.innerStates.count = self.innerStates.count + 1
			return innerState
		else
			LOG('error: no enough states space')
			return nil
		end
	end;
	
	_initInnerState = function(self, innerState, stateRes, creator)
		innerState.startTime = Util:getTime()
		innerState.lastTime = Util:getTime()
		
		innerState.type = stateRes.type
		innerState.duration = stateRes.duration
		
		innerState.effect.id = stateRes.effect.id
		innerState.effect.val = stateRes.effect.val
		innerState.effect.unit = stateRes.effect.unit
		
		innerState.creator.type = creator.type
		innerState.creator.id = creator.id
		innerState.creator.skillId = creator.skillId
	end;
	
	_freeInnerState = function(self, stateIdx) -- from 1 to n
		if stateIdx <= 0 or stateIdx > self.innerStates.count then
			return
		end
		self.innerStates.count = Util:removeElementC(self.innerStates.states, self.innerStates.count, stateIdx-1)
	end;
})

