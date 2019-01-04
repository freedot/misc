--*******************************************************************************
ActTowerHdr = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = ActTowerGetBaseInfoHdr()
		self.handlers[2] = ActTowerEnterHdr()
		self.handlers[3] = ActTowerExpedHdr()
		self.handlers[4] = ActTowerExitHdr()
		self.handlers[5] = ActTowerStartAutoFightHdr()
		self.handlers[6] = ActTowerStopAutoFightHdr()
		self.handlers[7] = ActToweSearchRoleForRankHdr()
		self.handlers[8] = ActTowerGetPageRankRolesHdr()
		self.handlers[9] = ActTowerCheckAutoFightHdr()
	end;
})

ActTowerGetBaseInfoHdr = Class:extends({
	handle = function(self, player, cmdtb)
		ActTowerSender:sendBaseInfo(player)
		ActTowerSender:sendRanks(player, 1, 5, -1)
		local actTower = player:getActTower()
		if actTower:getLeftLifes() > 0 then
			ActTowerSender:sendEnterTower(player)
		end
	end;
})

ActBaseEnterHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_isEnoughRoleLevel(player) then
			return false
		end
		
		if not self:_getStartGate(player, cmdtb) then
			return false
		end
		
		local actObject = self:_getActObject(player)
		if actObject:getTodayEnterTimes() == self:_getMaxTotalEnterTimes() then
			WUtil:sendWarningMsgArgs(player, self:_getArriveMaxTimeTipId(), '')
			return false
		end
		
		if not self:_checkHasEnoughItem(player) then
			return false
		end
		
		if not self:_gainGift(player, cmdtb) then
			return false
		end

		actObject:setTodayEnterTimes(actObject:getTodayEnterTimes() + 1)
		
		if self:_isEnterByUseItem(actObject) then
			actObject:setLeftLifes( 3 )	
			WUtil:subExpends(self.expends)
		else 
			actObject:setLeftLifes( 2 )	
		end
		
		self:_setCurGate(actObject)
		actObject:setStopTime(0)
		self:_sendEnterMsg(player)
				
		return true
	end;
	
	_checkHasEnoughItem = function(self, player)
		self.expends = {}
		local actObject = self:_getActObject(player)
		if actObject:getTodayEnterTimes() == self:_getMaxFreeEnterTimes() then
			local expendRess = {{resid=FIXID.HEIMULING, type=EXPEND_TYPE.ITEM,val=1}}
			self.expends = WUtil:createExpendObjs(player, nil, expendRess)
			if not WUtil:isEnoughExpends(self.expends) then
				local hasItemNum = player:getPkg():getItemNumber(FIXID.HEIMULING)
				WUtil:sendPopBoxMsgArgs(player, 100066, '"@itemid' .. FIXID.HEIMULING .. '",' .. 1 .. ',' .. hasItemNum .. ',' .. FIXID.HEIMULING )
				return false
			end
		end
		return true
	end;
	
	_isEnterByUseItem = function(self, actObject)
		return actObject:getTodayEnterTimes() > self:_getMaxFreeEnterTimes() 
	end;
	
	_getMaxTotalEnterTimes = function(self)
		return self:_getMaxFreeEnterTimes() + self:_getMaxItemEnterTimes()
	end;
})

ActTowerEnterHdr = ActBaseEnterHdr:extends({
	init = function(self)
		self.drop_Item = DropItem()
	end;
	
	_isEnoughRoleLevel = function(self, player)
		return player:getLevel() >= res_enter_tower_need_rolelevel
	end;
	
	_getStartGate = function(self, player, cmdtb)
		self.startGate = Util:getNumber(cmdtb, 'startLayer')
		if self.startGate ~= 1 and self.startGate ~= 41 and self.startGate ~= 81 then	
			return false
		end
		
		local actTower = self:_getActObject(player)
		if actTower:getMaxLayer() + 1 < self.startGate then
			return false
		end
			
		return true
	end;
	
	_getActObject = function(self, player)
		return  player:getActTower()
	end;
	
	_getArriveMaxTimeTipId = function(self)
		return 100157
	end;	
	
	_getMaxFreeEnterTimes = function(self)
		return res_act_tower_enter_times + app:getSvrAct():getAdditionByActType(SVR_TODAY_ACT_TYPE.ACT_TOWER_TIMES_1)
	end;
	
	_getMaxItemEnterTimes = function(self)
		return res_act_tower_enter_times_useitem
	end;	
	
	_gainGift = function(self, player, cmdtb)
		local isGainGift = Util:getNumber(cmdtb, 'gainGift') == 1
		local needGold, canGetGift = self:_getNeedGold(isGainGift, player, self:_getActObject(player), self.startGate)
		if not canGetGift then
			return true
		end
		
		local goldExpend = GoldExpend(player, {attr=ATTR.GOLD,val=needGold})
		if not goldExpend:isEnough() then
			return false
		end
		
		if not self:_addDropItems(player, self.startGate) then
			return false
		end
		
		goldExpend:sub()
		
		return true
	end;
	
	_setCurGate = function(self, actObject)
		actObject:setCurLayer(self.startGate)
	end;
		
	_sendEnterMsg = function(self, player)
		ActTowerSender:sendEnterTower(player)	
	end;
	
	-- @return needGold, canGetGift
	_getNeedGold = function(self, isGainGift, player, actTower, startLayer)
		if player:hasVipEffect(VIP_EFF.SKIP_TOWER) then 
			return 0, true
		end
		
		if not isGainGift then
			return 0, false
		end
		
		local maxLayer = actTower:getMaxLayer()
		if startLayer == 41 then
			return 100 - maxLayer, true
		elseif startLayer == 81 then 
			return 200 - maxLayer, true
		else
			return 0, false
		end
	end;
	
	_addDropItems = function(self, player, startLayer)
		local totalDrops = {roleExp=0, rolePs=0, heroExp=0, heroCredit=0, roleMoney=0, items={}}
		for layer=1, startLayer-1, 1 do
			local layerResId = FIXID.ACT_TOWER_STARTID + layer - 1
			local res = Util:qfind(res_copyfields, 'id', layerResId)
			self.drop_Item:handle(res.taofadrop)
			local drops = self.drop_Item:getDrops()
			for _, item in ipairs(drops.items) do
				table.insert(totalDrops.items, {resid=item.resid, number=item.number} )
			end
		end
		
		if table.getn(totalDrops.items) == 0 then
			return true
		end
		
		local rawItems = self.drop_Item:createRawItems(totalDrops.items)
		if not player:getPkg():addItems( rawItems ) then
			WUtil:sendWarningMsgArgs(player, 100129, '')
			return false
		end

		return true
	end;	
})

ActBaseExpedHdr = Class:extends({
	init = function(self)
		self.herosHdr_ = NetCmdHerosHdr:new()
		self.MAX_GATE_ID_ = res_act_terrace_max_gate_id
		self.MAX_SUBGATE_ID_ = res_act_terrace_max_subgate_id
		self.MAX_LAYER_ = res_act_tower_max_layer
	end;
	
	handle = function(self, player, cmdtb)
		local actObject = self:_getActObject(player)
		
		if not self:_isHasLeftLife(player) then
			return false
		end
		
		if actObject:getStopTime() > Util:getTime() then
			return false
		end
		
		if self:_isArrivedMaxGate(actObject) then
			return false
		end
		
		if not self:_isValid(player) then
			return false
		end
		
		if not self:_exped(player, cmdtb) then
			self:_sendSimpleEnterMsg(player)
			return false
		end
		
		local lastGateInfo = self:_getLastGateInfo(actObject)
		
		local lastStopTime = Util:getTime()
		if actObject:getStopTime() > 0 then
			lastStopTime = actObject:getStopTime()
		end
		
		local stopTime = lastStopTime + (60 - player:getVipEffectVal(VIP_EFF.SPEED_ACTCD) )
		actObject:setStopTime(stopTime)
		
		if self.isSuccess_ then
			self:_expedSuccess(player)
		else
			self:_expedFail(player)
		end
		
		self:_sendEnterMsg(player, lastGateInfo)
		return true
	end;
	
	_isValid = function(self, player)
		return true
	end;
	
	_exped = function(self, player, cmdtb)
		cmdtb.isMemArmy = 1
		self:_resetExped(player, cmdtb)
		
		local ret, army = ExpeditionMgr:handle(player, cmdtb)
		if not ret then
			return self:_returnFalseAndResoreExped(player)
		end
		
		if not ExpedTimerHdrMgr:handle(army.armyId) then
			return self:_returnFalseAndResoreExped(player)
		end
		
		if not ExpedReturnTimerHdr:handle(army.armyId) then
			return self:_returnFalseAndResoreExped(player)
		end
		
		return self:_returnTrueAndRestoreExped(player)
	end;
	
	_resetExped = function(self, player, cmdtb)
		self:_setExpedObserver()
		self:_backHerosState(player, cmdtb)
		self:_clearHerosState()	
	end;
	
	_returnFalseAndResoreExped = function(self, player)
		self:_restoreHerosState(player)
		ExpedTimerHdrMgr:regObserver(nil)
		return false
	end;
	
	_returnTrueAndRestoreExped = function(self, player)
		self:_restoreHerosState(player)
		ExpedTimerHdrMgr:regObserver(nil)
		return true
	end;
	
	_setExpedObserver = function(self)
		self.isExpedOk_ = false
		self.fightResult_ = 1
		self.isSuccess_ = false
		self.fightDemo_ = {armyId=0,fightId=0}
		self.drop_ = {heroExp=0, items={}}
		ExpedTimerHdrMgr:regObserver(function(o, ty, value)
			self.isExpedOk_ = true
			if ty == 'fightResult' then
				self.fightResult_ = value
			elseif ty == 'isSuccess' then
				self.isSuccess_ = value
			elseif ty == 'fightDemo' then
				self.fightDemo_.armyId = value.armyId
				self.fightDemo_.fightId = value.fightId
			elseif ty == 'drop' then
				self.drop_.heroExp = value.heroExp
				for _, item in ipairs(value.items) do
					table.insert(self.drop_.items, {id=item.resid, number=item.number})
				end
			end
		end)
	end;
	
	_backHerosState = function(self, player, cmdtb)
		self.heros_ = {}
		self.herosHdr_:handleParam(player, cmdtb, MAX_DEFAULTTEAM_HERO_CNT)
		local heros = self.herosHdr_:getHeros()
		for _, hero in ipairs(heros) do
			table.insert(self.heros_, {hero=hero, state=hero:getState()})
		end
	end;
	
	_clearHerosState = function(self)
		for _, node in ipairs(self.heros_) do
			if node.hero:getState() == self:_getHeroActState() then
				node.hero:setState(HERO_STATE.FREE)
			end
		end
	end;
	
	_restoreHerosState = function(self, player)
		for _, node in ipairs(self.heros_) do
			node.hero:setState(node.state)
		end
		HeroAttrSender:sendHerosState(player, self.herosHdr_:getHeros())
	end;
	
	_getLastGateInfo = function(self, actTerrace)
		return nil
	end;
})

ActTowerExpedHdr = ActBaseExpedHdr:extends({
	_getActObject = function(self, player)
		return  player:getActTower()
	end;
	
	_isHasLeftLife = function(self, player)
		return player:getActTower():getLeftLifes() > 0
	end;
	
	_getHeroActState = function(self)
		return HERO_STATE.ACT_TOWER
	end;
	
	_isArrivedMaxGate = function(self, actTower)
		return actTower:getCurLayer() > self.MAX_LAYER_
	end;
	
	_sendSimpleEnterMsg = function(self, player)
		ActTowerSender:sendEnterTower(player)
	end;
	
	_expedSuccess = function(self, player)
		self:_sendWorldPopSysMsg(player)
		local actTower = self:_getActObject(player)
		actTower:setMaxLayer(actTower:getCurLayer())
		actTower:setCurLayer(actTower:getCurLayer() + 1)
		self:_resetWhenArrivedMaxLayer(actTower)
		self:_stopRecoverState(player)
		TaskFinisher:checkTasks(player)
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.JION_ACT_TOWER)
	end;
	
	_expedFail = function(self, player)
		local actObject = self:_getActObject(player)
		actObject:setLeftLifes(actObject:getLeftLifes() - 1)
		self:_stopRecoverState(player, actObject)
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.JION_ACT_TOWER)
	end;
	
	_getLastGateInfo = function(self, actTower)
		return {layer=actTower:getCurLayer(), fightResult=self.fightResult_, gift=self.drop_}
	end;
	
	_sendEnterMsg = function(self, player, lastGateInfo)
		ActTowerSender:sendEnterTower(player, self.fightDemo_, lastGateInfo)
	end;
	
	_resetWhenArrivedMaxLayer = function(self, actTower)
		if actTower:getCurLayer() > self.MAX_LAYER_ then
			actTower:setLeftLifes(0)
		end	
	end;
	
	_stopRecoverState = function(self, player)
		local actObject = self:_getActObject(player)
		if actObject:getLeftLifes() ~= 0 then return end
		player:getStateContainer():stopState(RES_EFF.TOWER_RECOVER_SOLDIER)
	end;
	
	_sendWorldPopSysMsg = function(self, player)
		if not self:_isCanSendPopSysMsg(player) then
			return
		end
		
		local actTower = self:_getActObject(player)
		local players = app:getPlayerMgr():getAllOnlinePlayers()
		for _, p in pairs(players) do 
			local msg = string.format(rstr.expedTowerLayer, player:getRoleName(), actTower:getCurLayer())
			WUtil:sendSysMsg(p, SMSGT.SYS_POPBAR, SMT_NORMAL, msg)
		end
	end;
	
	_isCanSendPopSysMsg = function(self, player)
		local actTower = self:_getActObject(player)
		local curLayer = actTower:getCurLayer()
		if curLayer ~= 20 
			and curLayer ~= 40 
			and curLayer ~= 60 
			and curLayer ~= 80 
			and curLayer ~= 100 then
			return false
		end
			
		local minRank = 30
		local minLayer = 0
		local idx = math.min(minRank, app:getActTowerRank():getCount()) - 1
		if idx >= 0 then
			local grid = app:getActTowerRank():get(idx)
			minLayer = grid.misc.lastTowerLayer
		end
		return curLayer >= minLayer
	end;
})

ActBaseExitHdr = Class:extends({
	handle = function(self, player)
		local actObject = self:_getActObject(player)
		actObject:setStopTime(0)
		actObject:setLeftLifes(0)
		self:_setCurGate(actObject)
		self:_clearEffectState(player)
		self:_sendSimpleEnterMsg(player)
	end;
	
	_clearEffectState = function(self, player) 
	end;
	
	_sendSimpleEnterMsg = function(self, player)
	end;
})

ActTowerExitHdr = ActBaseExitHdr:extends({
	_getActObject = function(self, player)
		return  player:getActTower()
	end;
	
	_setCurGate = function(self, actObject)
		actObject:setCurLayer(0)
	end;
	
	_clearEffectState = function(self, player)
		player:getStateContainer():stopState(RES_EFF.TOWER_RECOVER_SOLDIER)
	end;
	
	_sendSimpleEnterMsg = function(self, player)
		ActTowerSender:sendExitTower(player)
	end;	
})

ActBaseAutoFightHdr = Class:extends({
	handle = function(self, player, cmdtb)
		local heros =  self:_collectHeros(player, cmdtb)
		local oldState, newState = self:_getReplaceState()
		self:_replaceHerosState(player, heros, oldState, newState)
		self:_operate(player, cmdtb)
	end;

	_getReplaceState = function(self)end;
	_collectHeros = function(self, player, cmdtb)end;
	_operate = function(self, player)end;
	
	_replaceHerosState = function(self, player, heros, oldState, newState)
		local changedHeros = {}
		for _, hero in ipairs(heros) do
			if hero:getState() == oldState then
				hero:setState(newState)
				table.insert(changedHeros, hero)
			end
		end
		HeroAttrSender:sendHerosState(player, changedHeros)
	end;
})

ActBaseStartAutoFightHdr = ActBaseAutoFightHdr:extends({
	_collectHeros = function(self, player, cmdtb)
		if self.herosHdr_ == nil then
			self.herosHdr_ = NetCmdHerosHdr:new() 
		end
		self.herosHdr_:handleParam(player, cmdtb, MAX_DEFAULTTEAM_HERO_CNT)
		return self.herosHdr_:getHeros()
	end;
	
	_operate = function(self, player, cmdtb)
		self:_startOperate(player, cmdtb)
	end;
	
	_startOperate = function(self, player, cmdtb)
	end;
})

ActBaseStopAutoFightHdr = ActBaseAutoFightHdr:extends({
	_collectHeros = function(self, player, cmdtb)
		local heros = {}
		local count = player:getHeroMgr():getHeroCount()
		for i=0, count-1 do
			local hero = player:getHeroMgr():getHeroByIdx(i)
			table.insert(heros, hero)
		end
		return heros
	end;
	
	_operate = function(self, player)
		self:_stopOperate(player)
	end;
	
	_stopOperate = function(self, player)
	end;
})

ActTowerStartAutoFightHdr = ActBaseStartAutoFightHdr:extends({
	_getReplaceState = function(self)
		return HERO_STATE.FREE, HERO_STATE.ACT_TOWER
	end;
	
	_startOperate = function(self, player, cmdtb)
		player:getActTower():setAutoStartTime(Util:getTime())
		player:getActTower():setAutoToLayer(Util:getNumber(cmdtb, 'toLayer'))
	end;
})

ActTowerStopAutoFightHdr = ActBaseStopAutoFightHdr:extends({
	_getReplaceState = function(self)
		return HERO_STATE.ACT_TOWER, HERO_STATE.FREE
	end;
	
	_stopOperate = function(self, player)
		player:getActTower():setAutoStartTime(0)
	end;
})

ActToweSearchRoleForRankHdr = SearchRankHdrTemplet:extends({
	_getRankObj = function(self)
		return app:getActTowerRank()
	end;
	
	_sendRanks = function(self, player, pageNo, pageItemCount, curSelIdx)
		ActTowerSender:sendRanks(player, pageNo, pageItemCount, curSelIdx)
	end;
})

ActTowerGetPageRankRolesHdr = GetPageRankHdrTemplet:extends({
	_sendRanks = function(self, player, pageNo, pageItemCount, curSelIdx)
		ActTowerSender:sendRanks(player, pageNo, pageItemCount, curSelIdx)
	end;
})

ActTowerCheckAutoFightHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if player:getActTower():getAutoStartTime() > 0 then
			ActTowerSender:sendInAutoFightState(player)
		end
	end;
})


