--*******************************************************************************
OutFieldHandler = BaseCmdHandler:extends({
	regHandlers = function(self, subcmd)
		self.handlers[1] = GetOutFieldHandler()
		self.handlers[2] = GetFieldDetailHandler()
		self.handlers[3] = RefreshCurFieldsHandler()
		self.handlers[4] = EnterOutFieldHandler()
	end;
})

C_OUTFIELD_BLOCK_W = (320-1)
C_OUTFIELD_BLOCK_H = 160
MAX_CITYMAP_W = C_OUTFIELD_BLOCK_W * GRIDS_COL
MAX_CITYMAP_H = C_OUTFIELD_BLOCK_H * GRIDS_ROW

C_INVALIDCITYRECTS = {}

GetOutFieldHandler = Class:extends({
	init = function(self)
		self.CMD_GETFIELDSBYPOS_INTERVAL = 100
		self.MAX_SCREEN_W = 2048
		self.MAX_SCREEN_H = 1536
	end;
	
	handle = function(self, player, cmdtb)
		if not self:_initParams(player, cmdtb) then
			return false
		end
		
		if not self:_isArrivedInterval() then
			return false
		end
		
		self:_calcNeedSendBlocks()
		self:_sendBlocks()
		
		return true
	end;
	
	_initParams = function(self, player, cmdtb)
		local x = Util:getNumber(cmdtb, 'posX')
		if x < 0 or x >= MAX_CITYMAP_W then
			return false
		end
		
		local y = Util:getNumber(cmdtb, 'posY')
		if y < 0 or y >= MAX_CITYMAP_H then
			return false
		end
		
		self.player = player
		self.pos = {x=x, y=y}
		
		return true
	end;
	
	_isArrivedInterval = function(self)
		return (SPub:getTimeMs() - self.player:getLastGetFieldsTimeMs()) >= self.CMD_GETFIELDSBYPOS_INTERVAL
	end;
	
	_calcNeedSendBlocks = function(self)
		self.curBlockIdxs = self:_calcBlockIdxs(self.pos)
		
		local lastBlockIdxs = self:_calcBlockIdxs(self.player:getLastGetFieldsPos())
		self:_removeLastBlockIdxs(lastBlockIdxs)
		self.player:setLastGetFieldsPos(self.pos.x, self.pos.y)
	end;
	
	_calcBlockIdxsNew = function(self, pos)
		local viewPos = self:_getClientViewPos(pos)
		
		local blockIdxs = {}
		local x0 = math.floor(viewPos.left/C_OUTFIELD_BLOCK_W)
		local x1 = math.floor(viewPos.right/C_OUTFIELD_BLOCK_W)
		local y0 = math.floor(viewPos.top/C_OUTFIELD_BLOCK_H)
		local y1 = math.floor(viewPos.bottom/C_OUTFIELD_BLOCK_H)
		
		x0 = math.clamp(x0, res_mapview[1], res_mapview[3])
		y0 = math.clamp(y0, res_mapview[2], res_mapview[4])
		x1 = math.clamp(x1, res_mapview[1], res_mapview[3] - 1)
		y1 = math.clamp(y1, res_mapview[2], res_mapview[4] - 1)
		
		for y = y0, y1, 1 do
			for x = x0, x1, 1 do
				blockIdxs[y*GRIDS_COL + x] = true
			end
		end
		
		return blockIdxs	
	end;
	
	_calcBlockIdxs = function(self, pos)
		return self:_calcBlockIdxsNew(pos)
	end;
	
	_getClientViewPos = function(self, pos)
		local viewPort = {left=0,top=0,right=0,bottom=0}
		viewPort.left = pos.x - math.floor(self.MAX_SCREEN_W/2)
		viewPort.left = math.clamp(viewPort.left, 0, MAX_CITYMAP_W - self.MAX_SCREEN_W)
		viewPort.right = viewPort.left + self.MAX_SCREEN_W
		
		viewPort.top = pos.y - math.floor(self.MAX_SCREEN_H/2)
		viewPort.top = math.clamp(viewPort.top, 0, MAX_CITYMAP_H - self.MAX_SCREEN_H)
		viewPort.bottom = viewPort.top + self.MAX_SCREEN_H
		
		return viewPort
	end;
	
	_removeLastBlockIdxs = function(self, lastBlockIdxs)
		for id, _ in pairs(self.curBlockIdxs) do
			if lastBlockIdxs[id] == true then
				self.curBlockIdxs[id] = false
			end
		end
	end;
	
	_sendBlocks = function(self)
		local gridIds = {}
		for idx, has in pairs(self.curBlockIdxs) do
			if has then
				table.insert(gridIds, idx+1)
			end
		end
		OutFieldSender:sendFields(self.player, gridIds)
	end;
})

GetFieldDetailHandler = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParams(player, cmdtb) then
			return false
		end
		
		if self:_isDiedRole() then
			WUtil:sendWarningMsgArgs(player, 100170, '')
			return false
		end
		
		if not self:_isRoleField() then
			return false
		end
		
		OutFieldSender:sendFieldDetail(player, self.grid)
		
		return true
	end;
	
	_initParams = function(self, player, cmdtb)
		self.grid = self:_getGridByGridId(cmdtb)
		if self.grid == nil then
			self.grid = self:_getGridByRole(cmdtb)
		end
		
		if self.grid == nil then
			return false
		end		
		
		self.player = player
		
		return true
	end;
	
	_getGridByGridId = function(self, cmdtb)
		local gridId = Util:getNumber(cmdtb, 'gridId')
		if gridId < 1 then
			return nil
		end
		
		if gridId > GRIDS_COUNT then
			return nil
		end
		
		return app:getCityMgr():getGridByGridId(gridId)
	end;
	
	_getGridByRole = function(self, cmdtb)	
		local roleName = Util:getString(cmdtb, 'roleName')
		return app:getCityMgr():getGridByRoleName(roleName)
	end;
	
	_isDiedRole = function(self)
		return self.grid.objType == OBJ_TYPE.DIED_ROLE 
	end;
	
	_isRoleField = function(self)
		return self.grid.objType == OBJ_TYPE.ROLE 
	end;
})

RefreshCurFieldsHandler = Class:extends({
	init = function(self)
		self.getFieldsHdr = GetOutFieldHandler()
	end;
	
	handle = function(self, player)
		local curPos = player:getLastGetFieldsPos()
		local cmd = {posX=curPos.x, posY=curPos.y}
		player:setLastGetFieldsPos(MAX_CITYMAP_W, MAX_CITYMAP_H)
		self.getFieldsHdr:handle(player, cmd)
	end;
})

EnterOutFieldHandler = Class:extends({
	handle = function(self, player)
		local cityRes = player:getCityRes()
		cityRes:cutMoney()
		cityRes:cutCommRes()
	end;
})


