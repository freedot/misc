--*******************************************************************************
YDGetGiftUtil = Class:extends({
	isValidDiamond = function(self, player)
		return player:isYellowDiamond() 
	end;
	
	getDiamondLevel = function(self, player)
		if player:getQQMembership().yellow_vip_level then
			return player:getQQMembership().yellow_vip_level
		else 
			return 0
		end
	end;	
	
	getXDTask = function(self, player)
		return player:getTask():getYDTask()
	end;	
})

YellowDiamondHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = YDGetNewGiftHandler(YDGetGiftUtil())
		self.handlers[2] = YDGetCommEveryDayGiftHandler(YDGetGiftUtil())
		self.handlers[3] = YDGetYearEveryDayGiftHandler(YDGetGiftUtil())
		self.handlers[4] = YDGetLevelGiftHandler(YDGetGiftUtil())
		self.handlers[5] = YDGetInfoHandler()
	end;
})

XDBaseGetGiftHandler = Class:extends({
	init = function(self, commUtil)
		self._dropItemEffector = DropItemEffector()
		self._commUtil = commUtil
	end;
	
	handle = function(self, player, cmdtb)
		self.player = player
		
		if not self._commUtil:isValidDiamond(player) then
			return false
		end
		
		self.res = self:_getRes(cmdtb)
		if self.res == nil then
			return false
		end
		
		if self.res.ydlvl ~= nil then
			self.res.xdlvl = self.res.ydlvl
		elseif self.res.bdlvl ~= nil then
			self.res.xdlvl = self.res.bdlvl
		end
		
		if self:_isGot() then
			return false
		end
		
		if not self:_isValidLevel() then
			return false
		end
		
		local effectRes = {val= self.res.dropid}
		if not self._dropItemEffector:isCanExec(self.player, 1, effectRes, {}) then
			return false
		end
		
		self._dropItemEffector:exec(self.player, 1, effectRes, {})
		self:_setGotFlag()
		RoleBaseSender:send(self.player, {'xdInfo'})
		
		return true
	end;
	
	_isValidLevel = function(self)
		return true
	end;
})


XDGetNewGiftHandler = XDBaseGetGiftHandler:extends({
	_getRes = function(self, cmdtb)
		return nil
	end;
	
	_isGot = function(self)
		return self._commUtil:getXDTask(self.player):getGotNewGift() == 1
	end;
	
	_setGotFlag = function(self)
		self._commUtil:getXDTask(self.player):setGotNewGift()
	end;
})

XDGetCommEveryDayGiftHandler = XDBaseGetGiftHandler:extends({
	_getRes = function(self)
		return nil
	end;
	
	_isGot = function(self)
		return Util:isCurDay(self._commUtil:getXDTask(self.player):getGotCommGift())
	end;
	
	_setGotFlag = function(self)
		self._commUtil:getXDTask(self.player):setGotCommGift()
	end;
})

XDGetYearEveryDayGiftHandler = XDBaseGetGiftHandler:extends({
	_getRes = function(self)
		return nil
	end;
	
	_isValidYellowDiamond = function(self)
		return self.player:isYearYellowDiamond() 
	end;
	
	_isGot = function(self, player)
		return Util:isCurDay(self._commUtil:getXDTask(self.player):getGotYearGift())
	end;
	
	_setGotFlag = function(self)
		self._commUtil:getXDTask(self.player):setGotYearGift()
	end;
})

XDGetLevelGiftHandler = XDBaseGetGiftHandler:extends({
	_getRes = function(self, cmdtb)
		return nil
	end;
	
	_isGot = function(self, player)
		return self._commUtil:getXDTask(self.player):getGotLvlGifts():has(self.res.id)
	end;
	
	_isValidLevel = function(self)
		if self.res.level > self.player:getLevel() then
			return false
		end
		
		if self.res.xdlvl > self._commUtil:getDiamondLevel(self.player) then
			return false
		end
		
		return true
	end;
	
	_setGotFlag = function(self)
		self._commUtil:getXDTask(self.player):getGotLvlGifts():insert(self.res.id)
	end;
})

-----------------------------------------------------------------------------------
YDGetNewGiftHandler = XDGetNewGiftHandler:extends({
	_getRes = function(self, cmdtb)
		return res_yd_newgifts[1]
	end;
})

YDGetCommEveryDayGiftHandler = XDGetCommEveryDayGiftHandler:extends({
	_getRes = function(self)
		local yellow_level = self._commUtil:getDiamondLevel(self.player)
		if yellow_level == 0 then
			return nil
		end
		return res_yd_everydaygifts[yellow_level]
	end;
})

YDGetYearEveryDayGiftHandler = XDGetYearEveryDayGiftHandler:extends({
	_getRes = function(self)
		return res_yd_yeareverydaygifts[1]
	end;
})

YDGetLevelGiftHandler = XDGetLevelGiftHandler:extends({
	_getRes = function(self, cmdtb)
		local id = Util:getNumber(cmdtb, 'id')
		return Util:qfind(res_yd_lvlgifts, 'id', id)
	end;
})

YDGetInfoHandler = Class:extends({
	handle = function(self, player)
		RoleBaseSender:send(player, {'xdInfo'})
		return true
	end;
})

