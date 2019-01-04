--*******************************************************************************
BDGetGiftUtil = Class:extends({
	isValidDiamond = function(self, player)
		return player:isBlueDiamond() 
	end;
	
	getDiamondLevel = function(self, player)
		if player:getQQMembership().blue_vip_level then
			return player:getQQMembership().blue_vip_level
		else 
			return 0
		end
	end;	
	
	getXDTask = function(self, player)
		return player:getTask():getBDTask()
	end;	
})

BlueDiamondHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = BDGetNewGiftHandler(BDGetGiftUtil())
		self.handlers[2] = BDGetCommEveryDayGiftHandler(BDGetGiftUtil())
		self.handlers[3] = BDGetYearEveryDayGiftHandler(BDGetGiftUtil())
		self.handlers[4] = BDGetLevelGiftHandler(BDGetGiftUtil())
		self.handlers[5] = BDGetInfoHandler(BDGetGiftUtil())
		self.handlers[6] = BDGetHighEveryDayGiftHandler(BDGetGiftUtil())
		self.handlers[7] = BDGet3366LevelGiftHandler(BDGetGiftUtil())
	end;
})

-------------------------------------------------------------------------------
BDGetNewGiftHandler = XDGetNewGiftHandler:extends({
	_getRes = function(self, cmdtb)
		return res_bd_newgifts[1]
	end;
})

BDGetCommEveryDayGiftHandler = XDGetCommEveryDayGiftHandler:extends({
	_getRes = function(self)
		local blue_level = self._commUtil:getDiamondLevel(self.player)
		if blue_level == 0 then
			return nil
		end
		return res_bd_everydaygifts[blue_level]
	end;
})

BDGetYearEveryDayGiftHandler = XDGetYearEveryDayGiftHandler:extends({
	_getRes = function(self)
		return res_bd_yeareverydaygifts[1]
	end;
})

BDGetLevelGiftHandler = XDGetLevelGiftHandler:extends({
	_getRes = function(self, cmdtb)
		local id = Util:getNumber(cmdtb, 'id')
		return Util:qfind(res_bd_lvlgifts, 'id', id)
	end;
})

BDGetInfoHandler = Class:extends({
	handle = function(self, player)
		RoleBaseSender:send(player, {'xdInfo'})
		return true
	end;
})

BDGetHighEveryDayGiftHandler = XDBaseGetGiftHandler:extends({
	_getRes = function(self)
		return res_bd_higheverydaygifts[1]
	end;
	
	_isValidYellowDiamond = function(self)
		return self.player:isHighYellowDiamond() 
	end;
	
	_isGot = function(self, player)
		return Util:isCurDay(self._commUtil:getXDTask(self.player):getGotHighGift())
	end;
	
	_setGotFlag = function(self)
		self._commUtil:getXDTask(self.player):setGotHighGift()
	end;
})

BDGet3366LevelGiftHandler = XDBaseGetGiftHandler:extends({
	_getRes = function(self, cmdtb)
		local level = self.player:get3366Level()
		if level == 0 then
			return nil
		end
		return res_3366_lvlgifts[level]
	end;
	
	_isGot = function(self, player)
		return Util:isCurDay(self._commUtil:getXDTask(self.player):getGot3366Gift())
	end;
	
	_setGotFlag = function(self)
		self._commUtil:getXDTask(self.player):setGot3366Gift()
	end;
})

