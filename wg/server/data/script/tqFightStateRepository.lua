--*******************************************************************************
FightRefStateGateway = Class:extends({
	loadAll = function(self, fightStates)
		local maxId = 0
		local dbRows = app:getDBConn():query('select * from fightstates;')
		local rowCount = dbRows:getRowCount()
		for i=1, rowCount, 1 do
			local dbRow = dbRows:getCurRow()
			local id = dbRow:getFieldVal('id')
			local roleId1 = dbRow:getFieldVal('roleId1')
			local roleId2 = dbRow:getFieldVal('roleId2')
			local state = dbRow:getFieldVal('fightState')
			local stopTime = dbRow:getFieldVal('stopTime')
			fightStates[self:makeKey(roleId1, roleId2)] = {id=id, roleId1=roleId1, roleId2=roleId2, state=state, stopTime=stopTime}
			if id > maxId then
				maxId = id
			end
			dbRows:nextRow()
		end
		return maxId
	end;
	
	insert = function(self, keyId, roleId1, roleId2, state, stopTime)
		app:getDBConn():exec("insert into fightstates values('" .. keyId .. "','" .. roleId1 .. "','" .. roleId2 .. "','" .. state.. "','" .. stopTime .. "');")
	end;
	
	update = function(self, keyId, roleId1, roleId2, state, stopTime)
		app:getDBConn():exec("update fightstates set fightState=" .. state .. ", stopTime=" .. stopTime .. " where id=" .. keyId .. ";")
	end;
	
	delete = function(self, keyId)
		app:getDBConn():exec("delete from fightstates where id=" .. keyId .. ";")
	end;
	
	makeKey = function(self, roleId1, roleId2)
		return roleId1 .. '.' .. roleId2
	end;
}):new()

FightRefStateRepository = Class:extends({
	init = function(self)
		self:_init()
		self._timerCaller = Caller:new(TIMER_ID.FIGHTREFSTATE, self, self._onStateChange)
	end;
	
	loadAll = function(self)
		self:_init()
		self.newKeyId_ = FightRefStateGateway:loadAll(self.fightStates_)
		for _, s in pairs(self.fightStates_) do
			self:_startTimer(s.roleId1, s.roleId2, s.stopTime)
			self:_insertRoleMap(s.roleId1, s.roleId2)
			self:_insertRoleMap(s.roleId2, s.roleId1)
		end
	end;
	
	getRoleMap = function(self, roleId)
		local map = self.roleMaps_[roleId]
		if (map == nil) then return {} end
		return map
	end;
	
	getState = function(self, roleId1, roleId2)
		local state = self:_getState(roleId1, roleId2)
		if state == nil then return 0 end
		return state.state
	end;
	
	getStateObj = function(self, roleId1, roleId2)
		return self:_getState(roleId1, roleId2)
	end;
	
	startDeclareState = function(self, roleId1, roleId2)
		local state = self:_getState(roleId1, roleId2)
		if state ~= nil then return state end
		
		local newKeyId = self:_newKeyId()
		local stopTime = Util:getTime() + res_declare_fight_interval
		local key = FightRefStateGateway:makeKey(roleId1, roleId2)
		self.fightStates_[key] = {id=newKeyId, roleId1=roleId1, roleId2=roleId2, state=REF_ROLESTATE.DECLARING_FIGHT, stopTime=Util:getTime()+res_declare_fight_interval}
		FightRefStateGateway:insert(newKeyId, roleId1, roleId2, REF_ROLESTATE.DECLARING_FIGHT, stopTime)
		self:_startTimer(roleId1, roleId2, stopTime)
		self:_sendMsg(roleId1, roleId2)
		self:_insertRoleMap(roleId1, roleId2)
		self:_insertRoleMap(roleId2, roleId1)
		return self.fightStates_[key]
	end;
	
	getTimerCaller = function(self)
		return self._timerCaller
	end;
	
	_init = function(self)
		self.fightStates_ = {}
		self.roleMaps_ = {}
		self.newKeyId_ = 0
	end;
	
	_startFightState = function(self, roleId1, roleId2)
		local state = self:_getState(roleId1, roleId2)
		if state == nil or state.state ~= REF_ROLESTATE.DECLARING_FIGHT then
			return 
		end
		
		if not self:_isArrivedTime(state) then
			return
		end
		
		state.state = REF_ROLESTATE.FIGHTING
		state.stopTime = state.stopTime + res_fightting_interval
		FightRefStateGateway:update(state.id, state.roleId1, state.roleId2, state.state, state.stopTime)
		self:_startTimer( state.roleId1, state.roleId2, state.stopTime)
		self:_sendMsg(roleId1, roleId2)
	end;
	
	_stopFightState = function(self, roleId1, roleId2)
		local state = self:_getState(roleId1, roleId2)
		if state == nil or state.state ~= REF_ROLESTATE.FIGHTING then
			return 
		end
		
		if not self:_isArrivedTime(state) then
			return
		end
		
		FightRefStateGateway:delete(state.id)
		self.fightStates_[FightRefStateGateway:makeKey(state.roleId1, state.roleId2)] = nil
		self:_sendMsg(roleId1, roleId2)
		self:_removeRoleMap(roleId1, roleId2)
		self:_removeRoleMap(roleId2, roleId1)
	end;
	
	_isArrivedTime = function(self, state)
		return (Util:getTime()+TIMER_DRT_TIME) >= state.stopTime
	end;
	
	_getState = function(self, roleId1, roleId2)
		local state = self.fightStates_[FightRefStateGateway:makeKey(roleId1, roleId2)]
		if state == nil then
			state = self.fightStates_[FightRefStateGateway:makeKey(roleId2, roleId1)]
		end
		return state
	end;
	
	_newKeyId = function(self)
		self.newKeyId_ = (self.newKeyId_ + 1)%MAX_BIGINT
		return self.newKeyId_
	end;
	
	_onStateChange = function(self, timer, seq, curTime, params)
		timer:stop()
		local role1 = params[2]
		local role2 = params[3]
		local curState = self:getState(role1, role2) 
		if curState == REF_ROLESTATE.DECLARING_FIGHT then
			self:_startFightState(role1, role2)
		elseif curState ==  REF_ROLESTATE.FIGHTING then
			self:_stopFightState(role1, role2)
		end
	end;
	
	_startTimer = function(self, role1, role2, stopTime)
		local elapseS = stopTime - Util:getTime()
		global.getTimer():start(elapseS*1000, {TIMER_EVT.FIGHT_REF_STATECHANGE, role1, role2}, self._timerCaller)
	end;
	
	_sendMsg = function(self, roleId1, roleId2)
		FightResStateSender:sendState(ArmyPlayerGetter:getOnlinePlayer(OBJ_TYPE.ROLE, roleId1), roleId2)
		FightResStateSender:sendState(ArmyPlayerGetter:getOnlinePlayer(OBJ_TYPE.ROLE, roleId2), roleId1)
	end;
	
	_insertRoleMap = function(self, role1, role2)
		if self.roleMaps_[role1] == nil then
			self.roleMaps_[role1] = {}
		end
		table.insert(self.roleMaps_[role1], role2)
	end;
	
	_removeRoleMap = function(self, role1, role2)
		local map = self.roleMaps_[role1]
		for i, roleId in ipairs(map) do
			if roleId == role2 then
				table.remove(map, i)
				break
			end
		end
	end;
})

Repository = Class:extends({
	init = function(self)
		self.fightState = FightRefStateRepository()
	end;
	
	load = function(self)
		self.fightState:loadAll()
	end;
	
	getFightState = function(self)
		return self.fightState
	end;
}):new()


