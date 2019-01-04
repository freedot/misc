--*******************************************************************************
--  
--*******************************************************************************
ExpendResMaker = Class:extends({
	makeExpendRes = function(self, res)
		return self:makeExpendResWithNumber(res, 1)
	end;	
	
	makeExpendResWithNumber = function(self, res, number)
		local expendress = {}
		self:_makeCommExpendRes(res, expendress, number)
		self:_makePopuExpendRes(res, expendress, number)
		self:_makeMoneyExpendRes(res, expendress, number)
		self:_makeItemExpendRes(res, expendress, number)
		return expendress
	end;
	
	_makeCommExpendRes = function(self, res, expendress, number)
		local commres = {food=FIXID.FOOD, wood=FIXID.WOOD, stone=FIXID.STONE, iron=FIXID.IRON}
		for k, id in pairs(commres) do
			if (res[k] ~= nil) and (res[k] > 0) then
				table.insert(expendress, {id=id,type=EXPEND_TYPE.COMMRES,val=res[k]*number})
			end
		end
	end;
	
	_makePopuExpendRes = function(self, res, expendress, number)
		if (res.addpopu == nil) or (res.addpopu == 0) then return end
		table.insert(expendress, {attr=ATTR.IDLEPOPU, type=EXPEND_TYPE.IDLEPOPU, val=res.addpopu*number})
	end;
	
	_makeMoneyExpendRes = function(self, res, expendress, number)
		if (res.money == nil) or (res.money == 0) then return end
		table.insert(expendress, {attr=ATTR.MONEY,type=EXPEND_TYPE.MONEY,val=res.money*number})
	end;
	
	_makeItemExpendRes = function(self, res, expendress, number)
		if res.items == nil then return end
		for _, it in ipairs(res.items) do
			if (it.num > 0) and (it.id > 0) then
				table.insert(expendress, {resid=it.id,type=EXPEND_TYPE.ITEM,val=it.num*number})
			end
		end
	end;	
}):new()

