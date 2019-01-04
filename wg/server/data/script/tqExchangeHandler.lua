--*******************************************************************************
ExchangeHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = ExchangeItemHandler()
	end;
})

ExchangeItemHandler = Class:extends({
	init = function(self)
		self.dropItemEffector_ = DropItemEffector()
	end;
	
	handle = function(self, player, cmdtb)
		local dropId = Util:getNumber(cmdtb, 'dropId' )
		local count = Util:getNumber(cmdtb, 'count' )
		if count < 1 then
			return false
		end
		
		local res = self:_getRes(dropId)
		if res == nil then
			return false
		end
		
		if self:_isArmTarget(res) and count ~= 1 then
			return false
		end
		
		local expends = self:_createMaterialExpends(player, res, count)
		if not WUtil:isEnoughExpends(expends) then
			return false
		end
		
		local effectRes = {val=dropId}
		if not self.dropItemEffector_:isCanExec(player, count, effectRes, {}) then
			return false
		end

		WUtil:subExpends(expends)
		self.dropItemEffector_:exec(player, count, effectRes, {})
		
		return true
	end;
	
	_isArmTarget = function(self, res)
		return res.type == 1
	end;
	
	_createMaterialExpends = function(self, player, res, count)
		local expendRess = {}
		for _, material in ipairs(res.materials) do
			if material.itemId == 0 then
				break
			end
			table.insert(expendRess, {resid=material.itemId, type=EXPEND_TYPE.ITEM,val=material.number*count})
		end
		return WUtil:createExpendObjs(player, nil, expendRess)
	end;
	
	_getRes = function(self, dropId)
		for _, res in ipairs(res_exchanges) do
			if res.dropId == dropId then
				return res
			end
		end
		return nil
	end;
})

