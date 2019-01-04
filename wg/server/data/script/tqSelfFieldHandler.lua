--*******************************************************************************
--*******************************************************************************
CmdSelfFieldHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[0] = GetAllSelfFieldsHandler()
		self.handlers[1] = StartCollectHandler()
		self.handlers[2] = StopCollectHandler()
		self.handlers[3] = GiveUpFieldHandler()
		self.handlers[4] = RecallArmyFieldHandler()
		self.handlers[5] = GetCurCanGetResHandler()
	end;
})

GetAllSelfFieldsHandler = Class:extends({
	handle = function(self, player, cmd)
		PlayerSelfFieldSender:sendAllSelfFields(player)
	end;
})

SelfFieldHandler = Class:extends({
	getParam = function(self, player, cmd)
		local fieldId = Util:getNumber(cmd, 'fieldId')
		local field = player:getSelfField():getFieldById(fieldId)
		if field == nil then 
			return false
		end
		
		self.field = field
		self.player = player
		return true
	end;
	
	isInCollectState = function(self)
		return self.player:getSelfField():getFieldById(self.field.gridId).startTime > 0
	end;
	
	armyReturn = function(self)
		local occupyArmy = self.player:getSelfField():getOccupyArmy(self.field.gridId)
		if occupyArmy == nil then
			return
		end
		
		local needTime = app:getArmyMgr():getArmyExpedNeedFullTime(occupyArmy.armyId)
		local stopTime = Util:getTime() + needTime
		app:getArmyMgr():changeArmy(occupyArmy.armyId, ARMYDYN_STATE.RETURN, FIGHT_FLAG.UNFIGHT, stopTime)
		MilitarySender:sendArmyState(self.player, occupyArmy.armyId)
	end;
})

StartCollectHandler = SelfFieldHandler:extends({
	handle = function(self, player, cmd)
		if not self:getParam(player, cmd) then
			return 
		end
		
		if self:isInCollectState() then
			return
		end
		
		if not self:_hasOccupyArmySoldier() then
			return 
		end
		
		self.player:getSelfField():startCollect(self.field.gridId, Util:getTime())
		PlayerSelfFieldSender:sendSelfField(self.player, self.field.gridId)
		
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.GET_RES_FROMFIELD)
	end;
	
	_hasOccupyArmySoldier = function(self)
		return self.player:getSelfField():getCurOccupySoldierNumber(self.field.gridId) > 0
	end;
})

StopCollectHandler = SelfFieldHandler:extends({
	init = function(self)
		self.dropItem = DropItem()
	end;
	
	handle = function(self, player, cmd)
		if not self:getParam(player, cmd) then
			return false
		end
		
		if not self:isInCollectState() then
			return false
		end
		
		if not self:collectRes() then
			return false
		end
		
		self.player:getSelfField():stopCollect(self.field.gridId)
		PlayerSelfFieldSender:sendSelfField(self.player, self.field.gridId)
		PlayerSelfFieldSender:sendCanGetRes(self.player, self.field.gridId, {food=0, wood=0, stone=0, iron=0})
		return true
	end;
	
	getParam = function(self, player, cmd)
		if not SelfFieldHandler.getParam(self, player, cmd) then
			return false
		end
		
		self.collectReason = Util:getNumber(cmd, 'collectReason', COLLECT_REASON.MANUAL)
		return true
	end;
	
	collectRes = function(self)
		FieldCollector:setParam(self.field.gridId, Util:getTime())
		local items = FieldCollector:getItems()
		if not self:collectItemsRes( items ) then
			return false
		end
		
		if not self:collectCommRes( FieldCollector:getCommRes() ) then
			return false
		end
		
		return true
	end;
	
	collectItemsRes = function(self, items)
		if not self.player:isRole() then
			return false
		end
			
		local listItems = FieldCollector:dictItemsToListItems(items)
		local rawItems = self.dropItem:createRawItems(listItems)
		if table.getn(rawItems) == 0 then
			return true
		end
		
		if self.player:getPkg():addItems(rawItems) then
			return true
		end
		
		if self.collectReason == COLLECT_REASON.MANUAL then
			WUtil:sendSuccMsgArgs(self.player, 100015, '') --  pkg no space
			return false
		end
		
		local mail = app:getMailMgr():addSysMail(self.player:getRoleName(), rstr.mail.title.collectitems, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.collectitems, rawItems)
		MailSender:sendBriefMail(self.player, mail)
		
		return true
	end;
	
	collectCommRes = function(self, ress)
		self.player:getCityRes():addFood(ress.food)
		self.player:getCityRes():addWood(ress.wood)
		self.player:getCityRes():addStone(ress.stone)
		self.player:getCityRes():addIron(ress.iron)
		CommResSender:sendAll(self.player)
		return true
	end;
	
	getCollectReason = function(self)
		return self.collectReason
	end;
})

GiveUpFieldHandler = SelfFieldHandler:extends({
	init = function(self)
		self.stopCollectHandler = StopCollectHandler()
	end;
	
	handle = function(self, player, cmd)
		if not self:getParam(player, cmd) then
			return false 
		end
		
		self:_delayCreateObj()
		self.stopCollectHandler:handle(player, cmd)
		self:armyReturn()
		self:_deleteSelfField()
		self:_deleteEnemyArmyFromContainer()
		self:_refreshCurFields()
		return true
	end;

	_deleteSelfField = function(self)
		PlayerSelfFieldSender:sendDeleteSelfField(self.player, self.field.gridId)
		
		local pos = app:getCityMgr():getPosByGridId(self.field.gridId)
		WUtil:sendSuccMsgArgs(self.player, self:_getCollectReasonSysMsgId(), pos.x..','..pos.y)
		
		app:getCityMgr():clearOccupyFieldGrid(self.field.gridId)
		self.player:getSelfField():deleteField(self.field)
	end;
	
	_deleteEnemyArmyFromContainer = function(self)
		local container = self.player:getArmyContainer()
		for i=container:getEnemyArmyCount()-1, 0, -1 do
			local armyId = container:getEnemyArmyId(i)
			local army = app:getArmyMgr():getArmyById(armyId)
			if army ~= nil and army.targetType == OBJ_TYPE.FIELD and army.targetId == self.field.gridId then
				container:removeArmyId(armyId)
			end
		end
	end;
	
	_getCollectReasonSysMsgId = function(self)
		local collectReasonMsgIds = {}
		collectReasonMsgIds[COLLECT_REASON.MANUAL] = 100013
		collectReasonMsgIds[COLLECT_REASON.REFRESH] = 100039
		collectReasonMsgIds[COLLECT_REASON.BEATTACKED] = 100093
		return collectReasonMsgIds[self.stopCollectHandler:getCollectReason()]
	end;
	
	_delayCreateObj = function(self)
		if self.refreshCurFieldsHdr == nil then
			self.refreshCurFieldsHdr = RefreshCurFieldsHandler:new()
		end
	end;
	
	_refreshCurFields = function(self)
		self.refreshCurFieldsHdr:handle(self.player)
	end;
})

RecallArmyFieldHandler = SelfFieldHandler:extends({
	init = function(self)
		self.stopCollectHandler = StopCollectHandler()
	end;
	
	handle = function(self, player, cmd)
		if not self:getParam(player, cmd) then
			return 
		end
		
		if not self:hasOccupyArmy() then
			return
		end
		
		self.stopCollectHandler:handle(player, cmd)
		self:armyReturn()
	end;
	
	hasOccupyArmy = function(self)
		return self.player:getSelfField():getOccupyArmy(self.field.gridId) ~= nil
	end;
})

GetCurCanGetResHandler = SelfFieldHandler:extends({
	handle = function(self, player, cmd)
		if not self:getParam(player, cmd) then
			return false
		end
		
		if not self:isInCollectState() then
			PlayerSelfFieldSender:sendCanGetRes(self.player, self.field.gridId, {food=0, wood=0, stone=0, iron=0})
			return false
		end
		
		self:_sendGetRes()
		
		return true
	end;
	
	_sendGetRes = function(self)
		FieldCollector:setParam(self.field.gridId, Util:getTime())
		PlayerSelfFieldSender:sendCanGetRes(self.player, self.field.gridId, FieldCollector:getCommRes())
	end;
})


