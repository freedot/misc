require('tqSelfFieldHandler')

FieldLevelRefresher = Class:extends({
	init = function(self)
		self.lastId = 0
		self.countInSec = 400
		self.giveUpSelfFieldHdr = GiveUpFieldHandler()
	end;
	
	start = function(self)
		self.lastId = 1
		self.maxCount = GRIDS_COUNT
	end;
	
	refresh = function(self)
		self:_refreshFieldsLevel(self.lastId)
		self.lastId = self.lastId + self.countInSec + 1
	end;
	
	isComplete = function(self)
		return self.lastId >= self.maxCount
	end;
	
	_refreshFieldsLevel = function(self, startGridId)
		local endGridId = startGridId + self.countInSec
		if endGridId > self.maxCount then
			endGridId = self.maxCount
		end
		
		for gridId = startGridId, endGridId, 1 do
			local grid = app:getCityMgr():getGridByGridId(gridId)
			if grid ~= nil then
				self:_refreshFieldLevel(grid)
			end
		end
	end;
	
	_refreshFieldLevel = function(self, grid)
		if grid.objType ~= OBJ_TYPE.FIELD and grid.objType ~= OBJ_TYPE.NONE then
			return
		end
		
		if grid.roleId == 0 then
			self:_refreshCommFieldLevel(grid)
		elseif grid.objType == OBJ_TYPE.FIELD then
			self:_refreshOwnerFieldLevel(grid)
		end
	end;
	
	_refreshCommFieldLevel = function(self, grid)
		grid.level = math.random(res_max_field_level)
		local curPer = math.random(100)
		grid.resId = Util:getRoundRandVal( res_refresh_outfields, curPer ).val
		grid.objType = self:_getObjType(grid.resId)
		grid.modelId = res_fields[grid.resId - FIXID.FIRSTFIELDID + 1].models[math.random(4)]
		grid.refreshTime = Util:getTime()
		app:getCityMgr():saveGrid(grid, {'objType', 'resId', 'modelId', 'level'})
	end;
	
	_refreshOwnerFieldLevel = function(self, grid)
		grid.level = grid.level - 1
		grid.refreshTime = Util:getTime()
		
		if grid.level == 0 then
			if not self:_giveUpSelfField(grid) then
				grid.level = 1
				app:getCityMgr():saveGrid(grid, {'level'})
				return
			end
			self:_refreshCommFieldLevel(grid)
		else
			self:_sendGridMsgToOnlineOwner(grid)
			app:getCityMgr():saveGrid(grid, {'level'})
		end
	end;
	
	_sendGridMsgToOnlineOwner = function(self, grid)
		local ownerGrid = app:getCityMgr():getGridByRoleId(grid.roleId)
		local onlinePlayer = app:getPlayerMgr():getPlayerByName(ownerGrid.userName)
		if onlinePlayer ~= nil then
			PlayerSelfFieldSender:sendSelfField(onlinePlayer, grid.gridId)
			local pos = app:getCityMgr():getPosByGridId(grid.gridId)
			WUtil:sendSuccMsgArgs(onlinePlayer, 100012, pos.x..','..pos.y..','..grid.level)
		end
	end;
	
	_giveUpSelfField = function(self, grid)
		local ownerPlayer = ArmyPlayerGetter:getPlayer(OBJ_TYPE.ROLE, grid.roleId)
		if not self.giveUpSelfFieldHdr:handle(ownerPlayer, {fieldId=grid.gridId, collectReason=COLLECT_REASON.REFRESH}) then
			return false
		end
		
		self:_sendGiveUpMail(ownerPlayer, grid)
		return true
	end;
	
	_sendGiveUpMail = function(self, ownerPlayer, grid)
		local pos = app:getCityMgr():getPosByGridId(grid.gridId)
		local content = string.format(rstr.mail.content.autoGiveUpField, pos.x, pos.y)
		local mail = app:getMailMgr():addSysMail(ownerPlayer:getRoleName(), rstr.mail.title.autoGiveUpField, FIXID.COMM_SYS_MAILTEMP, content, nil)
		MailSender:sendBriefMail(ownerPlayer, mail)
	end;
	
	_getObjType = function(self, resId)
		if resId == FIXID.PINGDIFIELDID then
			return OBJ_TYPE.NONE
		else
			return OBJ_TYPE.FIELD
		end
	end;
})


