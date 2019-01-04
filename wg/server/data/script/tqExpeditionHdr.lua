--*******************************************************************************
--*******************************************************************************
NullExpeditionHdr = Class:extends({
	handle = function(self, player, cmdtb)
	end;
})

ExpeditionHdr = Class:extends({
	init = function(self)
		self.herosHdr = NetCmdHerosHdr:new()
	end;
	
	handle = function(self, player, cmdtb)
		if not self:getParam(player, cmdtb) then return false end
		if self.herosHdr:isEmptyHeros() then return false end
		if self.herosHdr:hasBusyHeros() then return false end
		if self.herosHdr:hasRepeatHeros() then return false end
		if self.herosHdr:hasDeepWoundHeros() then return false end
		if not ArmyCampActorsGetter:isHeroExped(self.expedType) then
			if self.herosHdr:hasEmptyCarrySoldierHeros() then return false end
		end
		
		if not self:isValidSource() then return false end
		if not self:isValidTarget() then return false end
		if not self:isValidHerosCount() then return false end
		
		if not self:innerHandle() then return false end
		self:sendMsg()
		return true,  self.army
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		self.army = nil
		
		local lineupId = Util:getNumber(cmdtb, 'lineup')
		if not self.player:hasLineup(lineupId) then
			return false
		end
		
		local expedType = Util:getNumber(cmdtb, 'expedType')
		if expedType < EXPED_TYPE.FIRST then
			return fasle
		end

		local targetType = Util:getNumber(cmdtb, 'ttype')
		if targetType <= OBJ_TYPE.NONE then
			return fasle
		end
		
		local targetId = Util:getNumber(cmdtb, 'tid')
		if targetId <= 0 then
			return false
		end
		
		if not self.herosHdr:handleParam(self.player, cmdtb, MAX_DEFAULTTEAM_HERO_CNT) then
			return false
		end

		self.isMemArmy_ = Util:getNumber(cmdtb, 'isMemArmy') == 1
		self.lineupId = lineupId
		self.expedType = expedType
		self.targetType = targetType
		self.targetId = targetId
		self.heros = self.herosHdr:getHeros()
		self.heroIds = self.herosHdr:getHeroIds()
		self.targetPlayer = ArmyPlayerGetter:getPlayer(self.targetType, self.targetId)
		return true
	end;
	
	isValidSource = function(self)
		return true
	end;
	
	isValidTarget = function(self)
		return true
	end;
	
	isValidHerosCount = function(self)
		return true
	end;
	
	innerHandle = function(self)
		if not self:isCanAddArmy() then 
			return false 
		end
		
		if not self:addArmy() then 
			return false 
		end
		
		self:setHerosState()
		return true
	end;
	
	isCanAddArmy = function(self)
		if self.player:getArmyContainer():isSelfArmyFull() then
			WUtil:sendErrorMsgArgs(self.player, 100094, '')
			return false
		end
		
		return true
	end;
	
	addArmy = function(self)
		local speed = self:getMinSpeedFromHeros(self.heros)
		speed = self:_recalcSpeed(speed)
		local needTime = self:getMoveNeedTime(self.player, self.targetPlayer, self.expedType, speed)
		self.army = app:getArmyMgr():addArmy(self.player, self.targetPlayer, self.lineupId, self.heroIds, self.expedType, needTime,self.isMemArmy_)
		return (self.army ~= nil)
	end;
	
	sendMsg = function(self)
		if not self.army.isMem then
			HeroAttrSender:sendHerosState(self.player, self.heros)
		end
		WUtil:sendSuccMsgArgs(self.player, 100011, '')	
	end;
	
	setHerosState = function(self)
		for _, hero in ipairs(self.heros) do
			hero:setState(HERO_STATE.EXPED)
		end
	end;
	
	isSameAlliance = function(self)
		return  (self.player:getAlliId() == self.targetPlayer:getAlliId() ) and ( self.player:getAlliId() > 0 )
	end;
	
	getMoveNeedTime = function(self, fromPlayer, toPlayer, expedType, speed)
		if fromPlayer:getObjType() == OBJ_TYPE.COPYFIELD then
			local res = fromPlayer:getRes()
			return res.needtime * 3
		elseif toPlayer:getObjType() == OBJ_TYPE.COPYFIELD then
			local res = toPlayer:getRes()
			return res.needtime
		elseif self:_isCountryFight(fromPlayer, toPlayer, expedType) then --toPlayer:getObjType() == OBJ_TYPE.ROLE and then
			return res_countryfight_needtime
		elseif expedType == EXPED_TYPE.TIAOXIN then
			return res_tiaoxin_needtime
		end
		return self:_getDistanceTime(fromPlayer, toPlayer, speed)
	end;
	
	_isCountryFight = function(self, fromPlayer, toPlayer, expedType)
		if toPlayer:getObjType() ~= OBJ_TYPE.ROLE then
			return false
		end
		
		if expedType ~= EXPED_TYPE.TAOFA 
			and expedType ~= EXPED_TYPE.CUIHUI 
			and expedType ~= EXPED_TYPE.TIAOXIN then
			return false
		end

		return fromPlayer:getCityId() ~= toPlayer:getCityId()
	end;
	
	_getDistanceTime = function(self, fromPlayer, toPlayer, speed)
		local fromPos = fromPlayer:getCityPos()
		local toPos = toPlayer:getCityPos()
		local distance = math.sqrt((fromPos.x - toPos.x)*(fromPos.x - toPos.x) + (fromPos.y - toPos.y)*(fromPos.y - toPos.y))
		local timeHour = distance / speed
		local timeSecond = math.floor(timeHour*3600) + res_army_preparetime*res_hero_base_move_speed/speed
		return timeSecond
	end;
	
	getMinSpeedFromHeros = function(self, heros)
		local retMinSpeed = 0xffffffff
		for _, hero in ipairs(heros) do
			local curSpeed = hero:getAttrVal(ATTR.SP)
			if curSpeed < retMinSpeed then
				retMinSpeed = curSpeed
			end
		end
		
		if retMinSpeed == 0xffffffff then
			retMinSpeed = res_hero_base_move_speed
		end
		
		return retMinSpeed
	end;
	
	_recalcSpeed = function(self, speed)
		return speed
	end;
})

ExpeditionFightHdr = ExpeditionHdr:extends({
	innerHandle = function(self)
		if not ExpeditionHdr.innerHandle(self) then
			return false
		end
		
		self:_subItem()
		self:_addToTargetEnemyList()
		self:_addTodayFightTimes()
		MilitarySender:sendTodayFTimes(self.player)
		return true
	end;	
	
	_addToTargetEnemyList = function(self)
	end;	
	
	_addTodayFightTimes = function(self)
	end;
	
	_subItem = function(self)
		if self.targetPlayer:getObjType() ~= OBJ_TYPE.OWNERFIELD and
			self.targetPlayer:getObjType() ~= OBJ_TYPE.ROLE then
			return
		end
	
		if not self:isBeyondTodayTimes() then
			return
		end
		
		local itemNumber = 1
		self.player:getPkg():subItemByResId(FIXID.CHUSHILING, itemNumber)
	end;
	
	hasEnoughItemWhenBeyondTimes = function(self)
		if not self:isBeyondTodayTimes() then
			return true
		end
		
		if self.player:getPkg():getItemNumber(FIXID.CHUSHILING) > 0 then
			return true
		end
		
		return false
	end;	
	
	isBeyondTodayTimes = function(self)
		local todayTimes = self.player:getTodayFightTimes()
		local totalTimes = todayTimes.taofa + todayTimes.cuihui + todayTimes.tiaoxin + todayTimes.fightowner
		return totalTimes >= res_max_attack_player_times
	end;		
})

ExpeditionTaofaCopyFieldHdr = ExpeditionHdr:extends({
	isValidTarget = function(self)
		if self.targetPlayer:getObjType() ~= OBJ_TYPE.COPYFIELD then
			WUtil:sendErrorMsgArgs(self.player, 100071, '')
			return false
		end
		
		return true
	end;
})

ExpeditionDantiaoCopyFieldHdr = ExpeditionTaofaCopyFieldHdr:extends({
})

ExpeditionFightPlayerHdr = ExpeditionFightHdr:extends({
	isValidSource = function(self)
		if self.player:getState() == ROLE_STATE.YOUNG then
			WUtil:sendErrorMsgArgs(self.player, 100089, '')
			return false
		end
		
		if self.player:getState() == ROLE_STATE.REST then
			WUtil:sendErrorMsgArgs(self.player, 100090, '')
			return false
		end
		
		return true
	end;
	
	isValidTarget = function(self)
		if not self.targetPlayer:isRole() then
			WUtil:sendErrorMsgArgs(self.player, 100073, '')
			return false
		end
		
		if self.targetPlayer:isDied() then
			WUtil:sendErrorMsgArgs(self.player, 100173, '')
			return false
		end
		
		if self.targetPlayer:getState() == ROLE_STATE.YOUNG then
			WUtil:sendErrorMsgArgs(self.player, 100074, '')
			return false
		end
		
		if self.targetPlayer:getState() == ROLE_STATE.REST then
			WUtil:sendErrorMsgArgs(self.player, 100075, '')
			return false
		end
		
		if self.player:getFightRefState(self.targetId) ~= REF_ROLESTATE.FIGHTING then
			WUtil:sendErrorMsgArgs(self.player, 100076, '')
			return false
		end
		
		if self:isSameAlliance() then
			WUtil:sendErrorMsgArgs(self.player, 100077, '')
			return false
		end
		
		if self.targetPlayer:getCityRes():getLevel() == 0 then
			WUtil:sendErrorMsgArgs(self.player, 100156, '')
			return false
		end;
		
		if not self:hasEnoughItemWhenBeyondTimes() then
			WUtil:sendErrorMsgArgs(self.player, 100078, '')
			return false
		end

		return true
	end;
	
	isCanAddArmy = function(self)
		if self.player:getArmyContainer():isSelfArmyFull() then
			WUtil:sendErrorMsgArgs(self.player, 100094, '')
			return false
		end
		
		if self.targetPlayer:getArmyContainer():isEnemyArmyFull() then
			WUtil:sendErrorMsgArgs(self.player, 100095, '')
			return false
		end
		
		return true
	end;
	
	_addToTargetEnemyList = function(self)
		local enemyContainer = self.targetPlayer:getEnemyContainer()
		enemyContainer:add( self.player:getRoleId() )
		
		self:_trigerHonourFightTask()
	end;
	
	_trigerHonourFightTask = function(self)
		if self:_isCountryFight() then
			TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.FIGHT_PLAYER_FOR_HONOR)
		end
	end;
	
	_isCountryFight = function(self)
		return self.player:getCityId() ~= self.targetPlayer:getCityId()
	end;
	
	sendMsg = function(self)
		ExpeditionFightHdr.sendMsg(self)
		MilitarySender:sendEnemys(self.targetPlayer)
	end;
})

ExpeditionTaofaPlayerHdr = ExpeditionFightPlayerHdr:extends({
	_addTodayFightTimes = function(self)
		local times = self.player:getTodayFightTimes()
		self.player:setTodayFightTimes({taofa=times.taofa + 1, cuihui=times.cuihui, tiaoxin=times.tiaoxin, fightowner=times.fightowner})
	end;
})

ExpeditionCuihuiPlayerHdr = ExpeditionFightPlayerHdr:extends({
	_addTodayFightTimes = function(self)
		local times = self.player:getTodayFightTimes()
		self.player:setTodayFightTimes({taofa=times.taofa, cuihui=times.cuihui+1, tiaoxin=times.tiaoxin, fightowner=times.fightowner})
	end;
})

ExpeditionTiaoxinPlayerHdr = ExpeditionFightPlayerHdr:extends({
	_addTodayFightTimes = function(self)
		local times = self.player:getTodayFightTimes()
		self.player:setTodayFightTimes({taofa=times.taofa, cuihui=times.cuihui, tiaoxin=times.tiaoxin+1, fightowner=times.fightowner})
	end;
})

ExpeditionPaiqianPlayerHdr = ExpeditionHdr:extends({
	isValidTarget = function(self)
		if not self.targetPlayer:isRole() then
			WUtil:sendErrorMsgArgs(self.player, 100073, '')
			return false
		end
		
		if self.targetPlayer:isDied() then
			WUtil:sendErrorMsgArgs(self.player, 100172, '')
			return false
		end
		
		if not self:isSameAlliance() then
			WUtil:sendErrorMsgArgs(self.player, 100079, '')
			return false
		end
		
		return true
	end;
	
	isCanAddArmy = function(self)
		if self.player:getArmyContainer():isSelfArmyFull() then
			WUtil:sendErrorMsgArgs(self.player, 100094, '')
			return false
		end
		
		if self.targetPlayer:getArmyContainer():isAllianceArmyFull() then
			WUtil:sendErrorMsgArgs(self.player, 100096, '')
			return false
		end
		
		return true
	end;	
	
	_recalcSpeed = function(self, speed)
		local level = self.player:getCitys():getBuildLevelByResId(FIXID.ALLIINBUILD)
		return speed + speed*(0.1*level)
	end;
	
})

ExpeditionFightFieldHdr = ExpeditionFightHdr:extends({
	isValidHerosCount = function(self)
		return table.getn(self.heros) == 1
	end;
	
	isValidSource = function(self)
		if self.player:getState() == ROLE_STATE.YOUNG then
			WUtil:sendErrorMsgArgs(self.player, 100089, '')
			return false
		end
		
		if self.player:getState() == ROLE_STATE.REST then
			WUtil:sendErrorMsgArgs(self.player, 100090, '')
			return false
		end
		
		return true
	end;
	
	isValidTarget = function(self)
		if (self.targetPlayer:getObjType() ~= OBJ_TYPE.FIELD) 
			and (self.targetPlayer:getObjType() ~= OBJ_TYPE.OWNERFIELD) then
			WUtil:sendErrorMsgArgs(self.player, 100080, '')
			return false
		end
		
		if not self:isValidOwnerPlayerWhenOwnerField() then
			return false
		end
		
		if self.targetPlayer:getObjType() == OBJ_TYPE.OWNERFIELD then
			if not self:hasEnoughItemWhenBeyondTimes() then
				WUtil:sendErrorMsgArgs(self.player, 100078, '')
				return false
			end
		end
		
		if SelfFieldChecker:isSelfField(self.player, self.targetPlayer) then
			WUtil:sendErrorMsgArgs(self.player, 100081, '')
			return false
		end
		
		if self:isAlliPlayerField() then
			WUtil:sendErrorMsgArgs(self.player, 100082, '')
			return false
		end
		
		return true
	end;
	
	isValidOwnerPlayerWhenOwnerField  = function(self)
		if self.targetPlayer:getObjType() ~= OBJ_TYPE.OWNERFIELD then
			return true
		end
		
		local ownerPlayer = self.targetPlayer:getOwnerPlayer()
		if ownerPlayer:getState() == ROLE_STATE.YOUNG then
			WUtil:sendErrorMsgArgs(self.player, 100091, '')
			return false
		end
		
		if ownerPlayer:getState() == ROLE_STATE.REST then
			WUtil:sendErrorMsgArgs(self.player, 100092, '')
			return false
		end
		
		return true
	end;
	
	isAlliPlayerField = function(self)
		local sourcePlayer = self.player
		if sourcePlayer:getAlliId() == 0 then
			return false
		end
		
		local targetPlayer = self.targetPlayer
		local grid = app:getCityMgr():getGridByPos( targetPlayer:getCityPos() )
		if grid == nil then
			return false
		end
		
		if grid.objType ~= OBJ_TYPE.FIELD then
			return false
		end
		
		if grid.roleId == 0 then
			return false
		end
		
		local roleGrid = app:getCityMgr():getGridByRoleId(grid.roleId)
		if roleGrid == nil then
			return false
		end
		
		return sourcePlayer:getAlliId() == roleGrid.allianceId
	end;
	
	isCanAddArmy = function(self)
		if self.player:getArmyContainer():isSelfArmyFull() then
			WUtil:sendErrorMsgArgs(self.player, 100094, '')
			return false
		end
		
		if self:isOwnerEnemyArmyFullWhenOwnerField() then
			WUtil:sendErrorMsgArgs(self.player, 100097, '')
			return false
		end
		
		return true
	end;	
	
	isOwnerEnemyArmyFullWhenOwnerField  = function(self)
		if self.targetPlayer:getObjType() ~= OBJ_TYPE.OWNERFIELD then
			return false
		end
		
		local ownerPlayer = self.targetPlayer:getOwnerPlayer()
		return ownerPlayer:getArmyContainer():isEnemyArmyFull()
	end;
	
	_addTodayFightTimes = function(self)
		if self.targetPlayer:getObjType() ~= OBJ_TYPE.OWNERFIELD then
			return false
		end
		
		local times = self.player:getTodayFightTimes()
		self.player:setTodayFightTimes({taofa=times.taofa, cuihui=times.cuihui, tiaoxin=times.tiaoxin, fightowner=times.fightowner+1})
	end;		
})

ExpeditionDantiaoFieldHdr = ExpeditionFightFieldHdr:extends({
})

ExpeditionZhanlingFieldHdr = ExpeditionFightFieldHdr:extends({
	isCanAddArmy = function(self)
		if self.player:getSelfField():isFull() then
			WUtil:sendErrorMsgArgs(self.player, 100098, '')
			return false
		end
		
		return ExpeditionFightFieldHdr.isCanAddArmy(self)
	end;	
})

ExpeditionPaiqianFieldHdr = ExpeditionHdr:extends({
	isValidHerosCount = function(self)
		return table.getn(self.heros) == 1
	end;
	
	isValidTarget = function(self)
		if (self.targetPlayer:getObjType() ~= OBJ_TYPE.OWNERFIELD) then
			WUtil:sendErrorMsgArgs(self.player, 100071, '')
			return false
		end
		
		if not SelfFieldChecker:isSelfField(self.player, self.targetPlayer) then
			WUtil:sendErrorMsgArgs(self.player, 100083, '')
			return false
		end
		
		return true
	end;
	
	isCanAddArmy = function(self)
		if self.player:getArmyContainer():isSelfArmyFull() then
			WUtil:sendErrorMsgArgs(self.player, 100094, '')
			return false
		end
		
		if SelfFieldChecker:hasSelfArmyInField(self.player, self.targetPlayer) then
			WUtil:sendErrorMsgArgs(self.player, 100099, '')
			return false
		end
		
		return true
	end;
	
	_recalcSpeed = function(self, speed)
		return speed*10
	end;
})


ExpeditionMgr = Class:extends({
	init = function(self)
		self.expedHdrs = {}
		self.expedHdrs[self:makeKey(EXPED_TYPE.TAOFA, OBJ_TYPE.ROLE)] = ExpeditionTaofaPlayerHdr:new()
		self.expedHdrs[self:makeKey(EXPED_TYPE.CUIHUI, OBJ_TYPE.ROLE)] = ExpeditionCuihuiPlayerHdr:new()
		self.expedHdrs[self:makeKey(EXPED_TYPE.TIAOXIN, OBJ_TYPE.ROLE)] = ExpeditionTiaoxinPlayerHdr:new()
		
		self.expedHdrs[self:makeKey(EXPED_TYPE.PAIQIAN, OBJ_TYPE.ROLE)] = ExpeditionPaiqianPlayerHdr:new()
		
		self.expedHdrs[self:makeKey(EXPED_TYPE.DANTIAO, OBJ_TYPE.FIELD)] = ExpeditionDantiaoFieldHdr:new()
		self.expedHdrs[self:makeKey(EXPED_TYPE.ZHANLING, OBJ_TYPE.FIELD)] = ExpeditionZhanlingFieldHdr:new()
		self.expedHdrs[self:makeKey(EXPED_TYPE.PAIQIAN, OBJ_TYPE.FIELD)] = ExpeditionPaiqianFieldHdr:new()
		
		self.expedHdrs[self:makeKey(EXPED_TYPE.TAOFA, OBJ_TYPE.COPYFIELD)] = ExpeditionTaofaCopyFieldHdr:new()
		self.expedHdrs[self:makeKey(EXPED_TYPE.ACT_TOWER, OBJ_TYPE.COPYFIELD)] = ExpeditionTaofaCopyFieldHdr:new()
		self.expedHdrs[self:makeKey(EXPED_TYPE.ACT_TERRACE, OBJ_TYPE.COPYFIELD)] = ExpeditionDantiaoCopyFieldHdr:new()
		self.expedHdrs[self:makeKey(EXPED_TYPE.ACT_WORLDBOSS, OBJ_TYPE.COPYFIELD)] = ExpeditionTaofaCopyFieldHdr:new()
	end;
	
	handle = function(self, player, cmdtb)
		local hdr = self:getHandler(cmdtb)
		return hdr:handle(player, cmdtb)
	end;
	
	getHandler = function(self, cmdtb)
		local expedType = Util:getNumber(cmdtb, 'expedType')
		local targetType = Util:getNumber(cmdtb, 'ttype')
		local hdr = self.expedHdrs[self:makeKey(expedType, targetType)]
		if hdr == nil then
			return NullExpeditionHdr
		end
		
		return hdr
	end;
	
	makeKey = function(self, expedType, defenderType)
		return expedType*100 + defenderType
	end;
}):new()


