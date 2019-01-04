--*******************************************************************************
--*******************************************************************************
PlayerFarm = Class:extends({
	init = function(self, farms)
		self.player = nil
		self.farms = farms
	end;
	
	setPlayer = function(self, player)
		if self.player ~= nil then return end
		self.player = player
		self:initAllBlocks()
	end;
	
	seedBlock = function(self, data)
		local farm = nil
		if self.farms.ucCount < MAX_FARM_CNT then
			block = self.farms.astFarms[self.farms.ucCount]
			block.ulId = data.id
			block.ulResId = data.resid
			block.ucLevel = data.level
			self:reseedBlock(block)
			block.ucState = data.state
			self.farms.ucCount = self.farms.ucCount + 1
			self:_onBlockCountChange()
		else
			LOG('error:1231264')
		end
		return block
	end;
	
	reseedBlock = function(self, block)
		self:_addFarmVer()
		
		block.ulStartTime = Util:getTime()
		block.ulStopTime = block.ulStartTime + res_farmpip_needtime['LV'..block.ucLevel]
		block.ulTotalRes = self:calcTotalRes({level=block.ucLevel, resid=block.ulResId})
		block.ulLeftRes = block.ulTotalRes
		block.ucState = FARM_STATE.SAPLING
		block.collectorCount = 0
		block.seqId = self:_newSeq()
	
		local needtime = block.ulStopTime - Util:getTime()
		global.getTimer():start(needtime*1000, {TIMER_EVT.FARMGROWUP_STOP, block.ulId, block.seqId}, self.player:getTimerCaller())
	end;
	
	delBlock = function(self, blockid)
		if Util:findC(self.farms.astFarms, self.farms.ucCount, 'ulId', blockid) ~= nil then
			self:_addFarmVer()
			self.farms.ucCount = Util:removeElementC(self.farms.astFarms, self.farms.ucCount, Util:getLastFindIdx())
			self:_onBlockCountChange()
		end
	end;
	
	delBlocksByMaxId = function(self, maxid)
		local old = self.farms.ucCount
		local deletedflag = false
		for i=self.farms.ucCount-1, 0, -1 do
			local farm = self.farms.astFarms[i]
			if farm.ulId > maxid then
				self.farms.ucCount = Util:removeElementC(self.farms.astFarms, self.farms.ucCount, i)
				deletedflag = true
			end
		end
		
		if deletedflag then
			self:_onBlockCountChange()
		end
	end;
	
	getWorkforce = function(self)
		return self.farms.ucCount*res_farmblock_needpopu
	end;
	
	calcTotalRes = function(self, farmblock)
		local needtime = res_farmpip_needtime['LV'..farmblock.level];
		local baseout = math.floor(needtime*res_farm_sec_output + FLOAT_DRT);
		
		local teid = 0
		if farmblock.resid == FIXID.FARM then teid = FIXID.FOODCBUILD
		elseif farmblock.resid == FIXID.TIMBERYARD then teid = FIXID.WOODCBUILD
		elseif farmblock.resid == FIXID.QUARRY then teid = FIXID.STONECBUILD
		elseif farmblock.resid == FIXID.IRONORE then teid = FIXID.IRONCBUILD end
		
		local culturelevel = self.player:getCultures():getLevel(teid);
		local wslevel = self:getWorkShopBuildsLevelSum()
		local role_interior = self.player:getAttrVal(ATTR.IN_B) + self.player:getAttrVal(ATTR.IN_A)
		local alli = app:getAlliMgr():getAlliById(self.player:getAlliId())
		local allilevel = alli:getLevel()
		local buffState = self.player:getStateContainer():getEffectState(RES_EFF.ADD_COMMRES_OUTPUT)
		local buffAdd = 0
		if buffState ~= nil and (buffState:getEffectValUnit() == VAL_UNIT.PER) then
			buffAdd = buffState:getEffectVal()/100
		end
		local vipAdd = self.player:getVipEffectVal(VIP_EFF.ADD_COMMRES_OUTPUT)/100
		return res_calc_farm_totalres(baseout, culturelevel, wslevel, role_interior, allilevel, buffAdd, vipAdd)
	end;
	
	getWorkShopBuildsLevelSum = function(self)
		local levelSum = 0
		local builds = self.player:getCitys():getBuildsByResId(FIXID.WORKSHOPBUILD)
		for _, b in ipairs(builds) do
			levelSum = levelSum + b.ucLevel
		end
		return levelSum
	end;
	
	getFarmData = function(self)
		return self.farms
	end;
	
	getBlockCount = function(self)
		return self.farms.ucCount;
	end;
	
	setBlockCount = function(self, cnt)
		self.farms.ucCount = cnt;
	end;
	
	getBlockById = function(self, id)
		return Util:findC(self.farms.astFarms, self.farms.ucCount, 'ulId', id)
	end;
	
	getBlockByIdx = function(self, idx)
		return self.farms.astFarms[idx]
	end;
	
	getBlockRes = function(self, collectorId, block)
		if not self:isCanGather(collectorId, block) then
			return 0
		end
		
		if self.player:getRoleId() == collectorId then
			return self:_getBlockResBySelf(block)
		else
			return self:_getBlockResByOtherCollector(block)
		end
	end;
	
	isFullBlock = function(self)
		
	end;
	
	_getBlockResBySelf = function(self, block)
		if block.ucState == FARM_STATE.COMPLETE then
			return block.ulLeftRes
		elseif block.ucState == FARM_STATE.SAPLING then
			local lapse = Util:getTime() - block.ulStartTime
			local duration = block.ulStopTime - block.ulStartTime
			local per = math.clamp(lapse / duration, 0, 1)
			return math.floor(per*block.ulLeftRes*res_getfarmres_pre + FLOAT_DRT)
		else
			return 0
		end
	end;
	
	_getBlockResByOtherCollector = function(self, block)
		local leftNumber = block.ulLeftRes - math.floor(block.ulTotalRes/2)
		if leftNumber <= 0 then
			return 0
		end
		
		local randGet = math.floor(math.random(5,15)*block.ulTotalRes/100)
		if randGet > leftNumber then
			randGet = leftNumber
		end
		
		return randGet
	end;
	
	addLog = function(self, loginfo)
		if self.farms.ucLogCount == MAX_FARM_LOG_CNT then
			self.farms.ucLogCount = Util:removeElementC(self.farms.astFarmLogs, self.farms.ucLogCount, 0)
		end
		local lognode = self.farms.astFarmLogs[self.farms.ucLogCount]
		lognode.ucType = loginfo.ltype
		lognode.szRName = loginfo.role
		lognode.ulLogTime = Util:getTime()
		lognode.ulParam1 = loginfo.param1
		lognode.ulParam2 = loginfo.param2
		lognode.ulParam3 = loginfo.param3
		lognode.ulParam4 = loginfo.param4
		self.farms.ucLogCount = self.farms.ucLogCount + 1
		self.farms.ulLogVer = self.farms.ulLogVer + 1
	end;
	
	getLogCount = function(self)
		return self.farms.ucLogCount
	end;
	
	getLogIdx = function(self, idx)
		return self.farms.astFarmLogs[idx]
	end;
	
	getLogVer = function(self)
		return self.farms.ulLogVer
	end;
	
	initAllBlocks = function(self)
		for i=self.farms.ucCount-1, 0, -1 do
			local block = self.farms.astFarms[i]
			local needtime = math.max((block.ulStopTime - Util:getTime()), 0)
			if block.ucState == FARM_STATE.SAPLING then
				global.getTimer():start(needtime*1000, {TIMER_EVT.FARMGROWUP_STOP, block.ulId, block.seqId}, self.player:getTimerCaller())
			end
		end
	end;
	
	_onBlockCountChange = function(self)
		if self.player then
			self.player:getCityRes():onPopuChange()
		end
	end;
	
	getFarmVer = function(self)
		return self.farms.farmVer
	end;
	
	isCanGather = function(self, collectorId, block)
		if self.player:getRoleId() == collectorId then
			return true
		end
		
		if block.ucState ~= FARM_STATE.COMPLETE then
			return false
		end
		
		if block.ulLeftRes <= math.floor(block.ulTotalRes/2) then
			return false
		end
		
		if self:_isFullCollector( block ) then
			return false
		end
		
		if self:_isProtectTime( block) then
			return false
		end
		
		return Util:findC(block.collectors, block.collectorCount, nil, collectorId) == nil
	end;
	
	isCanGathers = function(self, collectorId)
		for i=self.farms.ucCount-1, 0, -1 do
			local farm = self.farms.astFarms[i]
			if self:isCanGather(collectorId, farm) and self:isComplete(farm) then
				return true
			end
		end
		return false
	end;
	
	isComplete = function(self, block)
		return block.ucState == FARM_STATE.COMPLETE
	end;
	
	subBlockRes = function(self, block, res)
		if res < 0 then
			return
		end
		
		if res < block.ulLeftRes then
			block.ulLeftRes = block.ulLeftRes - res
		else
			block.ulLeftRes = 0
		end
	end;
	
	addCollector = function(self, collectorId, block)
		if self:_isFullCollector( block ) then
			return
		end
		
		block.collectors[block.collectorCount] = collectorId
		block.collectorCount = block.collectorCount + 1
	end;
	
	_isFullCollector = function(self, block)
		 return block.collectorCount == MAX_COLLECTOR_CNT
	end;
	
	_isProtectTime = function(self, block)
		return Util:getTime() <=  block.protectStopTime
	end;

	_addFarmVer = function(self)
		self.farms.farmVer = self.farms.farmVer + 1
	end;
	
	_newSeq = function(self, seq)
		local seq = self.farms.lastSeqId
		self.farms.lastSeqId = self.farms.lastSeqId + 1
		return seq
	end;
})

NullPlayerFarm = Class:extends({
	init = function(self)
		self.farms = {ucCount=0,astFarms={},ulLogVer=0,ucLogCount=0,astFarmLogs={}}
	end;
	setPlayer = function(self) end;
	seedBlock = function(self) end;
	reseedBlock = function(self) end;
	delBlock = function(self) end;
	delBlocksByMaxId = function(self) end;
	getWorkforce = function(self) 	return 0 end;
	calcTotalRes = function(self) return 0 end;
	getFarmData = function(self) return self.farms end;
	getBlockCount = function(self) return 0 end;
	setBlockCount = function(self) end;
	getBlockById = function(self) return nil end;
	getBlockByIdx = function(self) return nil end;
	getBlockRes = function(self) return 0 end;
	addLog = function(self) end;
	getLogCount = function(self)  return 0 end;
	getLogIdx = function(self) return nil  end;
	getLogVer = function(self) return 0 end;
	getFarmVer = function(self) return 0 end;
	isCanGather = function(self) return 0 end;
	isComplete = function(self) return false end;
	subBlockRes = function(self) end;
	addCollector = function(self) end;
}):new()



