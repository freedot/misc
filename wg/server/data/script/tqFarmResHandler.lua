--*******************************************************************************
FarmResHandler = BaseCmdHandler:extends({
	regHandlers = function(self, subcmd)
		self.handlers[1] = GetFarmHdr()
		self.handlers[4] = GetFarmLogHdr()
		self.handlers[5] = GatherFarmResHdr()
		self.handlers[6] = GatherAllFarmResHdr()
		self.handlers[7] = PreGatherFarmResHdr()
		self.handlers[8] = InitFarmBlockHdr()
		self.handlers[9] = SeedFarmHdr()
		self.handlers[10] = GetFarmsGetCanFlagHdr()
	end;
})

GetFarmHdr = Class:extends({
	handle = function(self, player, cmdtb)
		local ver = Util:getNumber(cmdtb, 'ver')
		local roleId = Util:getNumber(cmdtb, 'roleId')
		if roleId < 0 then
			roleId = player:getRoleId()
		end
		
		local targetPlayer = ArmyPlayerGetter:getPlayer(OBJ_TYPE.ROLE, roleId)
		if targetPlayer:isDied() then
			return
		end
		
		if ver == targetPlayer:getFarm():getFarmVer() then
			return
		end
		
		FarmSender:sendAll(player, targetPlayer)
	end;
})

SeedFarmHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then return end
		if not self:_isValid() then return end
		self:_handle()
	end;
	
	_initParam = function(self, player, cmdtb)
		self.player = player
		self.blockId = Util:getNumber(cmdtb, 'blockId')
		local pipresid = Util:getNumber(cmdtb, 'resid')
		if (pipresid < FIXID.PIPSTART) or (pipresid > FIXID.PIPEND) then 
			return false
		end
		
		local pipres = ItemResUtil:findItemres(pipresid)
		self.resid = pipres.bresid
		self.level = pipres.level
		self.expends = WUtil:createExpendObjs(self.player, nil, {{attr=ATTR.IDLEPOPU, type=EXPEND_TYPE.IDLEPOPU, val=res_farmblock_needpopu}})
		
		return true
	end;
	
	_isValid = function(self)
		if not self:_isSeedBlockInMaxRange() then 
			return false 
		end
		
		if self:_hasPipInWillSeekBlock() then
			return false
		end
		
		if not WUtil:isEnoughExpends(self.expends) then 
			return false
		end
		
		return true
	end;
	
	_isValidFarmId = function(self)
		if not self:_isSeedBlockInMaxRange() then
			return false
		end
		
		if self:_hasPipInWillSeekBlock() then
			return false
		end
		
		return true
	end;
	
	_isSeedBlockInMaxRange = function(self)
		local cityres = self.player:getCityRes()
		local farmidx = self.blockId-1
		return (farmidx >= 0) and (farmidx < cityres:getFarmMaxBlockCount())
	end;
	
	_hasPipInWillSeekBlock = function(self)
		local farm = self.player:getFarm()
		return farm:getBlockById(self.blockId) ~= nil
	end;
	
	_handle = function(self)
		WUtil:subExpends(self.expends)
		local farm = self.player:getFarm()
		
		local block = farm:seedBlock({id=self.blockId, level=self.level, resid=self.resid, state=FARM_STATE.SAPLING})
		if block == nil then 
			return 
		end

		FarmSender:sendBlock(self.player, farm, block)
		if self:_isFullSeeded() then
			FarmSender:sendCancelInput(self.player)
		end
		
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.PLANT_ONE_FARMBLOCK)
		TaskFinisher:checkTasks(self.player)
	end;
	
	_isFullSeeded = function(self)
		local farm = self.player:getFarm()
		local cityres = self.player:getCityRes()
		return farm:getBlockCount() >= cityres:getFarmMaxBlockCount()
	end;
})

BaseGatherFarmResHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then 
			return false
		end
		
		if not self:_isValid() then 
			return false
		end
		
		self:_handle()
		self:_endHandle()
		self:_doTasks()
		
		return true
	end;
	
	_initParam = function(self, player, cmdtb)
		self.player = player
		self.roleId = Util:getNumber(cmdtb, 'roleId')
		self.blockId = Util:getNumber(cmdtb, 'blockId')
		self.targetPlayer = ArmyPlayerGetter:getPlayer(OBJ_TYPE.ROLE, self.roleId)
		if self.targetPlayer:isDied() then
			return false
		end
		
		self.farm = self.targetPlayer:getFarm()
		self.isSelfTarget = (self.player == self.targetPlayer)
		return true
	end;
	
	_createExpend = function(self)
	end;
	
	_isValid = function(self)
		if not self:_isValidFarmId() then 
			return false 
		end
		
		if not self:_isValidState() then 
			return false 
		end
		
		if not self:_isEnoughExpend() then
			WUtil:sendWarningMsgArgs(self.player, 100067, '')
			return false
		end
		
		return true
	end;	
	
	_isValidFarmId = function(self)
	end;
	
	_isValidState = function(self)
	end;
	
	_isEnoughExpend = function(self)
		self.expend = RoleAttrExpend:new(self.player, {attr=ATTR.PS, val=self:_getNeedPSAttrVal()})
		return self.expend:isEnough()
	end;
	
	_getNeedPSAttrVal = function(self)
	end;
	
	_handle = function(self)
		self:_initNumsAndBlocks()
		self:_handleCurBlocks()
		self:_sendMsgs()
		self:_addGetSelfResLogs()
	end;
	
	_initNumsAndBlocks = function(self)
		self.nums = {}
		self.blocks = {}
	end;
	
	_handleCurBlocks = function(self)
	end;
	
	_setCurBlockAndId = function(self, block)
		self.block = block
		self.blockId = self.block.ulId
	end;
	
	_handleCurBlock = function(self)
		self:_collectHandledBlocks()
		self:_gatherFarmRes()
		if self.isSelfTarget then
			self.farm:reseedBlock(self.block)
		end
	end;
	
	_collectHandledBlocks = function(self)
		table.insert(self.blocks, self.block)
	end;
	
	_gatherFarmRes = function(self)
		local res = self.farm:getBlockRes(self.player:getRoleId(), self.block)
		self.farm:subBlockRes(self.block, res)
		self.farm:addCollector(self.player:getRoleId(), self.block)
		
		local funName = self:_getResIdMapAddFunName(self.block.ulResId)
		local cityres = self.player:getCityRes()
		cityres[ funName ](cityres, res, true)
		
		self:_collectHandledNums(res)
	end;
	
	_getResIdMapAddFunName = function(self, resId)
		if self.funMaps == nil then -- delay init
			self.funMaps = {}
			self.funMaps[FIXID.FARM] = 'addFood'
			self.funMaps[FIXID.TIMBERYARD] = 'addWood'
			self.funMaps[FIXID.QUARRY] = 'addStone'
			self.funMaps[FIXID.IRONORE] = 'addIron'
		end
		
		return self.funMaps[resId]
	end;
	
	_collectHandledNums = function(self, res)
		table.insert(self.nums, {id=self.blockId, state=self.block.ucState, resid=self.block.ulResId, num=res})
	end;
	
	_sendMsgs = function(self)
		FarmSender:sendBlocks(self.player, self.farm, self.blocks)
		if not self.isSelfTarget then
			FarmSender:sendBlocks(self.targetPlayer,  self.farm, self.blocks)
		end
		CommResSender:sendAll(self.player)
		FarmSender:sendGetResNum(self.player, self.nums)	
		self:_sendCombinedCommRes()
	end;	
	
	_sendCombinedCommRes = function(self)
		local resNumbers = {[FIXID.FARM] = 0, [FIXID.TIMBERYARD] = 0, [FIXID.QUARRY] = 0, [FIXID.IRONORE] = 0}
		for _, v in ipairs(self.nums) do
			resNumbers[v.resid] = resNumbers[v.resid] + v.num
		end
		
		for resid, val in pairs(resNumbers) do
			if val > 0 then
				if resid == FIXID.FARM then 
					WUtil:sendSysMsgArgs(self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid' .. FIXID.FOOD .. '",' .. val )
				elseif resid == FIXID.TIMBERYARD then 
					WUtil:sendSysMsgArgs(self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid' .. FIXID.WOOD .. '",' .. val )
				elseif resid == FIXID.QUARRY then 
					WUtil:sendSysMsgArgs(self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid' .. FIXID.STONE .. '",' .. val )
				elseif resid == FIXID.IRONORE then 
					WUtil:sendSysMsgArgs(self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid' .. FIXID.IRON .. '",' .. val )
				end
			end
		end
	end;
	
	_addGetSelfResLogs = function(self)
		if self.isSelfTarget then
			self:_addGetSelfResLog( self.player, FARMLOG_TYPE.GETSELF, self.player:getRoleName() )
		else
			self:_addGetSelfResLog( self.player, FARMLOG_TYPE.GETOTHER, self.targetPlayer:getRoleName() )
			self:_addGetSelfResLog( self.targetPlayer, FARMLOG_TYPE.OTHERGET, self.player:getRoleName() )
		end
	end;
	
	_addGetSelfResLog = function(self, player, logType, roleName)
		local loginfo = {ltype=logType, role=roleName, param1=0, param2=0, param3=0, param4=0}
		for _, num in ipairs(self.nums) do
			if num.state == FARM_STATE.COMPLETE then
				if num.resid == FIXID.FARM then 
					loginfo.param1 = loginfo.param1 + num.num 
				elseif num.resid == FIXID.TIMBERYARD then 
					loginfo.param2 = loginfo.param2 + num.num
				elseif num.resid == FIXID.QUARRY then 
					loginfo.param3 = loginfo.param3 + num.num
				elseif num.resid == FIXID.IRONORE then 
					loginfo.param4 = loginfo.param4 + num.num 
				end
			end
		end
		
		if (loginfo.param1 + loginfo.param2 + loginfo.param3 + loginfo.param4) > 0 then
			player:getFarm():addLog(loginfo)
		end
	end;
	
	_endHandle = function(self)
		self.expend:sub()
		self:_sendFarmsCanGetFlags()
	end;
	
	_sendFarmsCanGetFlags = function(self)
		if self.isSelfTarget then return end

		local flag = 0
		if self.targetPlayer:getFarm():isCanGathers(self.player:getRoleId()) then
			flag = 1
		end
		
		FarmSender:sendFarmsCanGetFlags(self.player, {{roleId=self.targetPlayer:getRoleId(), flag=flag}} )
	end;
	
	_doTasks = function(self)
	end;
})

GatherFarmResHdr = BaseGatherFarmResHdr:extends({
	_isValidFarmId = function(self)
		self.block = self.farm:getBlockById(self.blockId)
		if self.block == nil then
			return false
		end
		
		return self.farm:isCanGather(self.player:getRoleId(), self.block)
	end;
	
	_isValidState = function(self)
		return self.block.ucState == FARM_STATE.COMPLETE
	end;
	
	_getNeedPSAttrVal = function(self)
		if self.isSelfTarget then
			return 0
		else -- other player
			return 1
		end
	end;
	
	_handleCurBlocks = function(self)
		self:_handleCurBlock()
	end;
})

GatherAllFarmResHdr = BaseGatherFarmResHdr:extends({
	_isValidFarmId = function(self)
		return true
	end;
	
	_isValidState = function(self)
		return self:_getCanGatherCount() > 0
	end;
	
	_getNeedPSAttrVal = function(self)
		if self.isSelfTarget then
			return 0
		end
		
		return self:_getCanGatherCount()*1
	end;
	
	_handleCurBlocks = function(self)
		for i=self.farm:getBlockCount()-1, 0, -1 do
			local block = self.farm:getBlockByIdx(i)
			if self:_isCanGather(block) then
				self:_setCurBlockAndId(block)
				self:_handleCurBlock()
			end
		end
	end;
	
	_isCanGather = function(self, block)
		return self.farm:isCanGather(self.player:getRoleId(), block)
			and block.ucState == FARM_STATE.COMPLETE
	end;
	
	_getCanGatherCount = function(self)
		local canGatherCount = 0
		for i=self.farm:getBlockCount()-1, 0, -1 do
			local block = self.farm:getBlockByIdx(i)
			if self:_isCanGather(block) then
				canGatherCount = canGatherCount + 1
			end
		end
		return canGatherCount
	end;
	
	_doTasks = function(self)
		if self.isSelfTarget then
			TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.GET_ALL_FARMRES)
		else
			TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.GET_ALL_OTHERFARMRES)
		end
	end;
})

PreGatherFarmResHdr = BaseGatherFarmResHdr:extends({
	_isValidFarmId = function(self)
		if not self.isSelfTarget then
			return false
		end
		
		self.block = self.farm:getBlockById(self.blockId)
		return self.block ~= nil
	end;
	
	_isValidState = function(self)
		return true
	end;
	
	_getNeedPSAttrVal = function(self)
		return 0
	end;
	
	_handleCurBlocks = function(self)
		self:_handleCurBlock()
	end;	
})

InitFarmBlockHdr = Class:extends({
	init = function(self)
		self.preGatherHdr = PreGatherFarmResHdr()
	end;
	
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then 
			return false
		end
		
		if not self:_isValidFarmId() then 
			return false
		end
		
		self:_gatherAndInitBlock()
		self:_recalIdlePopu()
		self:_sendMsgs()
		
		return true
	end;
	
	_initParam = function(self, player, cmdtb)
		self.player = player
		self.cmdtb = cmdtb
		self.blockId = Util:getNumber(cmdtb, 'blockId')
		self.farm = self.player:getFarm()
		return true
	end;
	
	_isValidFarmId = function(self)
		self.block = self.farm:getBlockById(self.blockId)
		return self.block ~= nil
	end;
	
	_gatherAndInitBlock = function(self)
		self.preGatherHdr:handle(self.player, self.cmdtb)
		self.farm:delBlock(self.blockId)
	end;
	
	_recalIdlePopu = function(self)
		local cityres = self.player:getCityRes()
		local idlePopu = cityres:getIdlePopu() + res_farmblock_needpopu
		cityres:setIdlePopu(idlePopu)
	end;
	
	_sendMsgs = function(self)
		PopuSender:send(self.player, {'idle'})
		FarmSender:sendDelBlock(self.player, self.blockId)
	end;
})

GetFarmLogHdr = Class:extends({
	handle = function(self, player, cmdtb)
		local ver = Util:getNumber(cmdtb, 'ver')
		if ver == player:getFarm():getLogVer() then
			return
		end
		
		FarmSender:sendLogs(player)
	end;
})

GetFarmsGetCanFlagHdr = Class:extends({
	init = function(self)
		self.C_ITEM_COUNT = 12
	end;
	
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then 
			return false
		end
		
		FarmSender:sendFarmsCanGetFlags(self.player, self:_collects())
		
		return true;
	end;
	
	_initParam = function(self, player, cmdtb)
		local count = Util:getNumber(cmdtb, 'count')
		if count <= 0 or count > self.C_ITEM_COUNT then
			return false
		end
		
		self.roles = {}
		for i=1, count, 1 do
			local roleId = Util:getNumber(cmdtb, 'id' .. i)
			local role = ArmyPlayerGetter:getPlayer(OBJ_TYPE.ROLE, roleId)
			if role:isRole() then
				table.insert(self.roles, role)
			end
		end
	
		self.player = player
		return true
	end;
	
	_collects = function(self)
		local flags = {}
		for _, role in ipairs(self.roles) do
			local flag = 0
			if not role:isDied() and role:getFarm():isCanGathers(self.player:getRoleId()) then
				flag = 1
			end
			table.insert(flags, {roleId=role:getRoleId(), flag=flag})
		end
		return flags
	end;
})



