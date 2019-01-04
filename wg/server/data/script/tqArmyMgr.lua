--*******************************************************************************
ArmyDBMapper = Class:extends({
	init = function(self, gapp)
		self.gapp = gapp
		self.cacheArmys_ = {}
	end;
	
	loadAllStopTime = function(self)
		local list = {}
		local dbConn = self.gapp:getDBConn()
		local dbRows = dbConn:query('select armyId, state, stopTime from armys;')
		if dbRows == nil then return list end
		
		local rowCount = dbRows:getRowCount()
		for i=1, rowCount, 1 do
			local dbRow = dbRows:getCurRow()
			
			local armyId = dbRow:getFieldVal('armyId')
			local state = dbRow:getFieldVal('state')
			local stopTime = dbRow:getFieldVal('stopTime')
			table.insert(list, {armyId=armyId, state=state, stopTime=stopTime})
			
			dbRows:nextRow()
		end
		
		return list
	end;
	
	getArmyById = function(self, armyId)
		local cacheArmy = self:_getArmyFromCache(armyId)
		if cacheArmy ~= nil then return cacheArmy end
		
		local loadArmy = self:_loadArmyFromDB(armyId)
		if loadArmy == nil then return nil end
		
		self:_addArmyInCache(loadArmy)
		return loadArmy
	end;
	
	insert = function(self, army)
		if not army.isMem then
			self:_addArmyToDB(army)
		end
		self:_addArmyInCache(army)
	end;
	
	updateState = function(self, army)
		if not army.isMem then
			self:_updateArmyInDB(army)
		end
	end;
	
	delete = function(self, armyId)
		local army = self:getArmyById(armyId)
		if army == nil or not army.isMem then
			self:_removeArmyFromDB(armyId)
		end
		self:_removeArmyFromCache(armyId)
	end;
	
	_getArmyFromCache = function(self, armyId)
		return self.cacheArmys_[armyId]
	end;
	
	_loadArmyFromDB = function(self, armyId)
		local dbConn = self.gapp:getDBConn()
		local dbRows = dbConn:query('select * from armys where armyId='..armyId..';')
		if dbRows == nil or dbRows:getRowCount() == 0 then 
			return nil
		end
		
		local dbRow = dbRows:getCurRow()
		
		army = {}
		army.armyId = dbRow:getFieldVal('armyId')
		army.isMem = false
		army.state = dbRow:getFieldVal('state')
		army.startTime = dbRow:getFieldVal('startTime')
		army.needTime = dbRow:getFieldVal('needTime')
		army.stopTime = dbRow:getFieldVal('stopTime')
		army.fighted = dbRow:getFieldVal('fighted')
		army.sourceId = dbRow:getFieldVal('sourceId')
		army.sourceType = dbRow:getFieldVal('sourceType')
		army.targetId = dbRow:getFieldVal('targetId')
		army.targetType = dbRow:getFieldVal('targetType')
		army.expedType = dbRow:getFieldVal('expedType')
		army.lineupId = dbRow:getFieldVal('lineupId')
		army.buff = eval(dbRow:getFieldVal('buff'))
		army.simpleHeros = eval( dbRow:getFieldVal('simpleHeros') )
		army.heros = {0,0,0,0,0}
		for pos, simpleHero in ipairs(army.simpleHeros) do
			army.heros[pos] = simpleHero.id
		end
		
		return army
	end;
	
	_addArmyToDB = function(self, army)
		local dbConn = self.gapp:getDBConn()
		local bsimpleHeros = dbConn:escape( toLUAString(army.simpleHeros) )
		local bbuff = dbConn:escape( toLUAString(army.buff) )
		local insertSQL = "insert into armys values('"..army.armyId.."', '"..army.sourceId.."', '"..army.sourceType.."', '"..army.targetId.."', '"..army.targetType.."', '"..army.expedType.."', '"..army.lineupId.."', '"..bsimpleHeros.."', '"..army.state.."', '" .. army.startTime .. "', '" .. army.needTime .. "', '" .. army.stopTime.."', '"..army.fighted.."', '" .. bbuff .. "');"
		if not dbConn:exec(insertSQL) then
			LOG('*error: add armyId='..army.armyId..' fail')
		end
	end;	
	
	_addArmyInCache = function(self, army)
		if army == nil then return end
		self.cacheArmys_[army.armyId] = army
	end;
	
	_updateArmyInDB = function(self, army)
		local dbConn = self.gapp:getDBConn()
		local bbuff = dbConn:escape( toLUAString(army.buff) )
		local updSQL = "update armys set state="..army.state..", fighted="..army.fighted..", stopTime="..army.stopTime..", buff='" .. bbuff .. "' where armyId="..army.armyId..";"
		if not dbConn:exec(updSQL) then
			LOG('*error: update armyId='..army.armyId..' fail')
		end
	end;
	
	_removeArmyFromCache = function(self, armyId)
		self.cacheArmys_[armyId] = nil
	end;
	
	_removeArmyFromDB = function(self, armyId)
		local dbConn = self.gapp:getDBConn()
		local deleteSQL = "delete from armys where armyId="..armyId..";"
		if not dbConn:exec(deleteSQL) then
			LOG('*error: delete armyId='..armyId..' fail')
		end
	end;
})

ArmyMgr = Class:extends({
	init = function(self, gapp)
		self.gapp = gapp
		self.mapper = ArmyDBMapper(gapp)
		self._timerCaller = TimerCaller:new(TIMER_ID.ARMY_MGR)
		self._timerCaller:register(TIMER_EVT.EXPED_STOP, Caller:new(0, self, self._onExpedStop) )
		self._timerCaller:register(TIMER_EVT.EXPED_RETURN_STOP, Caller:new(0, self, self._onExpedReturnStop) )
	end;
	
	startTimers = function(self)
		local list = self.mapper:loadAllStopTime()
		for _, node in ipairs(list) do
			self:_startTimer(node.armyId, node.state, node.stopTime)
		end
		return true
	end;
	
	-- for gm tool
	startTimer = function(self, armyId, state, stopTime)
		self:_startTimer(armyId, state, stopTime)
	end;
	
	getArmyById = function(self, armyId)
		return self.mapper:getArmyById(armyId)
	end;
	
	getArmyExpedNeedFullTime = function(self, armyId)
		local army = self:getArmyById(armyId)
		if army == nil then
			return 0
		end
		return army.needTime
	end;
	
	getArmyCallBackNeedTime = function(self, armyId)
		local army = self:getArmyById(armyId)
		if (army == nil) or (army.state ~= ARMYDYN_STATE.GOTO) then
			return 0
		end
		
		return Util:getTime() - army.startTime
	end;
	
	addArmy = function(self, sourceObj, targetObj, lineupId, sourceHeros, expedType, needTime, isMemArmy)
		local army = self:_createArmy(sourceObj, targetObj, lineupId, sourceHeros, expedType, needTime, isMemArmy)
		self.mapper:insert(army)
		self:_addArmyIdToSource(sourceObj, army)
		self:_addArmyIdToTarget(targetObj, army, expedType)
		self:_startTimer(army.armyId, army.state, army.stopTime)
		
		return army
	end;
	
	changeArmy = function(self, armyId, state, fighted, stopTime)
		local army = self:getArmyById(armyId)
		if army == nil then
			return
		end
		
		army.state = state
		army.stopTime = stopTime
		army.fighted = fighted
		self.mapper:updateState(army)
		
		if army.state == ARMYDYN_STATE.RETURN then
			self:_startTimer(army.armyId, army.state, army.stopTime)
		end
	end;
	
	removeArmy = function(self, sourceObj, targetObj, armyId)
		self:_removeArmyIdFromObject(sourceObj, armyId)
		self:_removeArmyIdFromObject(targetObj, armyId)
		self.mapper:delete(armyId)
	end;
	
	getTimerCaller = function(self)
		return self._timerCaller
	end;
	
	_startTimer = function(self, armyId, state, stopTime)
		local needTime = stopTime - Util:getTime()
		if state == ARMYDYN_STATE.GOTO then
			global.getTimer():start(needTime*1000, {TIMER_EVT.EXPED_STOP, armyId}, self._timerCaller)
		elseif state == ARMYDYN_STATE.RETURN then
			global.getTimer():start(needTime*1000, {TIMER_EVT.EXPED_RETURN_STOP, armyId}, self._timerCaller)
		end
	end;	
	
	_onExpedStop = function(self, timer, seq, curTime, params)
		timer:stop()
		local armyId = params[2]
		ExpedTimerHdrMgr:handle(armyId)
	end;
	
	_onExpedReturnStop = function(self, timer, seq, curTime, params)
		timer:stop()
		local armyId = params[2]
		ExpedReturnTimerHdr:handle(armyId)
	end;
	
	_createArmy = function(self, sourceObj, targetObj, lineupId, sourceHeros, expedType, needTime, isMemArmy)
		if isMemArmy == nil then 
			isMemArmy = false
		end
		
		local army = {}
		army.armyId = UUIDMgr:newArmyId()
		army.isMem = isMemArmy
		army.state = ARMYDYN_STATE.GOTO
		army.startTime = Util:getTime()
		army.needTime = needTime
		army.stopTime = Util:getTime() + needTime
		army.sourceId = sourceObj:getRoleId()
		army.sourceType = sourceObj:getObjType()
		army.targetId = targetObj:getRoleId()
		army.targetType = targetObj:getObjType()
		if army.targetType == OBJ_TYPE.OWNERFIELD then
			army.targetType = OBJ_TYPE.FIELD
		end
		army.expedType = expedType
		army.lineupId = lineupId
		army.fighted = 0
		army.buff = {}
		
		army.heros = {0,0,0,0,0}
		army.simpleHeros = {}
		local heroMgr = sourceObj:getHeroMgr()
		for pos, heroId in ipairs(sourceHeros) do
			local simpleHero = {id=0}
			local hero = heroMgr:getHeroById(heroId)
			if hero ~= nil then
				simpleHero.id = heroId
				simpleHero.name = hero:getName()
				simpleHero.level = hero:getLevel()
				simpleHero.soldier = {resid=hero:getSoldier().resid, number=hero:getSoldier().number}
				simpleHero.attrs = {{attr=ATTR.HEALTH, val=hero:getAttrRawVal(ATTR.HEALTH)}
					,{attr=ATTR.SFC, val=hero:getAttrVal(ATTR.SFC)}
					,{attr=ATTR.FC, val=hero:getAttrVal(ATTR.FC)} }
			end
			
			table.insert(army.simpleHeros, simpleHero)
			army.heros[pos] = simpleHero.id
		end

		return army
	end;	

	_addArmyIdToSource = function(self, sourceObj, army)
		if (army == nil) or (not sourceObj:isRole()) then
			return
		end
		
		sourceObj:getArmyContainer():addSelfArmyId(army.armyId)
	end;
	
	_addArmyIdToTarget = function(self, targetObj, army, expedType)
		if army == nil then return end
		
		if targetObj:isRole() and (expedType == EXPED_TYPE.PAIQIAN) then
			targetObj:getArmyContainer():addAllianceArmyId(army.armyId)
		elseif (expedType ~= EXPED_TYPE.PAIQIAN) then
			local targetPlayer = self:_getOwnerPlayerFromObj(targetObj)
			if not targetPlayer:isRole() then return end
			
			targetPlayer:getArmyContainer():addEnemyArmyId(army.armyId)
		end
	end;
	
	_removeArmyIdFromObject = function(self, targetObj, armyId)
		local targetPlayer = self:_getOwnerPlayerFromObj(targetObj)
		if not targetPlayer:isRole() then return end
		
		targetPlayer:getArmyContainer():removeArmyId(armyId)
	end;
	
	_getOwnerPlayerFromObj = function(self, obj)
		if obj:getObjType() == OBJ_TYPE.OWNERFIELD then
			return obj:getOwnerPlayer()
		end
		
		return obj
	end;
})

