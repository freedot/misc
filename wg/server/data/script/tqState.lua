--*******************************************************************************
StateCreator = Class:extends({
	init = function(self)
	end;
	
	create = function(self, player, stateId, innerState)
		if innerState.effect.id == RES_EFF.HURT_BUILDVAL then
			return HurtBuildValState(player, stateId, innerState)
		elseif innerState.effect.id == RES_EFF.HURT_SPEED_BUILDVAL then
			return HurtBuildValState(player, stateId, innerState)
		elseif innerState.effect.id == RES_EFF.AVOIDFIGHT then
			return AvoidFightState(player, stateId, innerState)
		elseif innerState.effect.id == RES_EFF.ADD_CULTURE_SPEED_AND_MONEY_OUTPUT then
			return AddCultureSpeedAndMoneyOutputState(player, stateId, innerState)
		elseif innerState.effect.id == RES_EFF.ZHANSHENZHIGUANG then
			return ZhanShenZhiGuangState(player, stateId, innerState)
		else
			return State(player, stateId, innerState)
		end
	end;
}):new()

State = Class:extends({
	init = function(self, player, stateId, state)
		self.player = player
		self.state = state
		self.state.id = stateId
	end;
	
	copy = function(self, otherState)
	end;
	
	getId = function(self)
		return self.state.id
	end;
	
	getType = function(self)
		return self.state.type
	end;
	
	getStopTime = function(self)
		return self.state.lastTime + self.state.duration
	end;
	
	getEffectId = function(self)
		return self.state.effect.id
	end;
	
	getEffectVal = function(self)
		return self.state.effect.val
	end;
	
	getEffectValUnit = function(self)
		return self.state.effect.unit
	end;
	
	getDuration = function(self)
		return self.state.duration
	end;
	
	getElapse = function(self)
		local elapse = Util:getTime() - self.state.lastTime
		if elapse < 0 then
			elapse = 0
		end
		
		if elapse > self.state.duration then
			elapse = self.state.duration
		end
		
		return elapse
	end;
	
	refreshLastTimeAndDuration = function(self)
		local elapse = self:getElapse()
		if elapse == 0 then
			return 
		end
		
		self.state.duration = self.state.duration - elapse
		self.state.lastTime = Util:getTime()
	end;
	
	addDuration = function(self, duration)
		self.state.duration = self.state.duration + duration
	end;
	
	addEffectVal = function(self, effectVal)
		self.state.effect.val = self.state.effect.val + effectVal
	end;
	
	setCreator = function(self, creator)
		self.state.creator.type = creator.type
		self.state.creator.id = creator.id
		self.state.creator.skillId = creator.skillId
	end;
	
	reset = function(self)
	end;
	
	enter = function(self)
	end;
	
	update = function(self)
		local rt = self:innerUpdate(self:getElapse())
		if rt == RET_STATE_END then
			return RET_STATE_END
		end
		
		self:refreshLastTimeAndDuration()
		
		if self:isStateEnd() then
			return RET_STATE_END
		else
			return RET_STATE_CONTINUE
		end
	end;
	
	innerUpdate = function(self, elapse)
	end;
	
	isStateEnd = function(self)
		local stype = self:getType()
		return self:getDuration() <= TIMER_DRT_TIME -- 误差
	end;
	
	leave = function(self)
	end;
})

HurtBuildValState = State:extends({
	innerUpdate = function(self, elapse)
		if self.player:isDied() then
			return RET_STATE_END
		end
		
		local cres = self.player:getCityRes()
		cres:setBuildHurtVal(cres:getBuildHurtVal() - math.floor(self:_getRestoreSpeed(cres:getLevel())/3600*elapse))
		CityBuildValSender:send(self.player, {'hurtval'})
		if cres:getBuildHurtVal() == 0 then
			return RET_STATE_END
		end
		
		return RET_STATE_CONTINUE
	end;
	
	_getRestoreSpeed = function(self, cityLevel)
		local res = Util:qfind(res_citylevelneeds, 'level', cityLevel)
		if res == nil then return 0 end
		if self.state.effect.unit == VAL_UNIT.VAL then
			return res.hurtvalrestorespeed + self.state.effect.val
		elseif self.state.effect.unit == VAL_UNIT.PER then
			return res.hurtvalrestorespeed*(self.state.effect.val/100)
		end
	end;
})

AvoidFightState = State:extends({
	enter = function(self)
		self.player:setState(ROLE_STATE.REST)
		RoleBaseSender:send(self.player, {'state'})
	end;
	
	leave = function(self)
		self.player:setState(ROLE_STATE.FREE)
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=3600*10, effect={id=RES_EFF.AVOIDFIGHTCD,val=1,unit=0}}
		local creator = {type=0,id=0,skillId=0}
		self.player:getStateContainer():appendState(stateRes, creator)
		RoleBaseSender:send(self.player, {'state'})
	end;
})

AddCultureSpeedAndMoneyOutputState = State:extends({
	enter = function(self)
		MoneySender:sendAll(self.player)
	end;
	
	leave = function(self)
		MoneySender:sendAll(self.player)
	end;
})

ZhanShenZhiGuangState = State:extends({
	enter = function(self)
		MoneySender:sendAll(self.player)
	end;
	
	leave = function(self)
		MoneySender:sendAll(self.player)
	end;
})


