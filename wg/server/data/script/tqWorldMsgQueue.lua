--*******************************************************************************
WorldMsgQueue = Class:extends({
	init = function(self, gapp)
		self.msgQueue = {}
		self.lastTime = 0
		self.lastSended = false
		self._timerCaller = Caller:new(TIMER_ID.WORLD_MSG, self, self._onTimer)
		global.getTimer():start(1*1000, {TIMER_EVT.WORLD_CHANNEL_UPDATE}, self._timerCaller)
	end;
	
	appendMsg = function(self, fromId, fromName, msg)
		table.insert(self.msgQueue, {fromId=fromId, fromName=fromName, msg=msg})
	end;
	
	clear = function(self)
		self.msgQueue = {}
		self.lastTime = 0
		self.lastSended = false
	end;
	
	_onTimer = function(self)
		self:_sendNextMsgNode()
		self:_sendClearMsg()
	end;
	
	_hasMsg = function(self)
		return table.getn(self.msgQueue) > 0
	end;
	
	_arrivedSendNextTime = function(self)
		return (Util:getTime() - self.lastTime) >= res_world_msg_replace_interval
	end;
	
	_sendNextMsgNode = function(self)
		if not self:_hasMsg() or not self:_arrivedSendNextTime() then
			return 
		end
	
		self.lastTime = Util:getTime()
		self.lastSended = true
		self:_sendAllOnlinePlayers(self.msgQueue[1])
		table.remove(self.msgQueue, 1)
	end;
	
	_arrivedSendClearTime = function(self)
		return (Util:getTime() - self.lastTime) >= res_world_msg_clear_interval
	end;
	
	_sendClearMsg = function(self)
		if not self.lastSended or self:_hasMsg() or not self:_arrivedSendClearTime() then
			return
		end
	
		self:_sendAllOnlinePlayers({fromId=CHAT_SYSPLAYER.SYS, fromName='', msg=''})
		self.lastSended = false
	end;
	
	_sendAllOnlinePlayers = function(self, msgNode)
		local roleGrid = app:getCityMgr():getGridByRoleId(msgNode.fromId)
		local appendInfo = self:_getAppendInfo(roleGrid)
		local players = app:getPlayerMgr():getAllOnlinePlayers()
		for _, player in pairs(players) do
			ChatSender:sendMsg(player, 0, msgNode.fromId, msgNode.fromName, appendInfo, CHAT_CHANNEL.WORLD, msgNode.msg)
		end
	end;
	
	_getAppendInfo = function(self, grid)
		local appendInfo = {vip=0,blue={level=0,year=0,super=0,grow=0}}
		if grid ~= nil then 
			appendInfo.vip = grid.misc.vip_level
			appendInfo.blue.level = grid.misc.blue_vip_level
			appendInfo.blue.year = grid.misc.is_blue_year_vip
			appendInfo.blue.super = grid.misc.is_super_blue_vip
			appendInfo.blue.grow = grid.misc._3366_grow_level
		end
		return appendInfo
	end;
})


