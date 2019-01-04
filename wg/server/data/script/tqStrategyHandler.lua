StrategyHandler = Class:extends({
	init = function(self)
	end;

	onRequest = function(self, player, netevt, cmdtb)
		if cmdtb.subcmd == 1 then
			self:getStrategyBuffs(player, cmdtb)
		elseif cmdtb.subcmd == 2 then
			self:useStrategy(player, cmdtb)
		end
	end;
	
	getStrategyBuffs = function(self, player, cmdtb)
		--StateMsgSender.sendStates(player, player.getCitys().getStateContainer().getStates())
		--',{id:6000002,stoptime:'..curtime..',target:{type:29,uid:2,name:"test2",pos:{x:10,y:10},cityid:9900001}}' --uid表示roleuid
		--',{id:6000003,stoptime:'..curtime..',target:{type:15,uid:2,name:"test2"}}' -- uid:表示army的id
	end;
	
	useStrategy = function(self, player, cmdtb)
		local _getParam = function(player, cmdtb)
			local _getStrategyRes = function()
				local strategyid = Util:getNumber(self.cmdtb, 'itemid')
				self.strategyres = Util:qfind(res_items, 'id', strategyid)
				return (self.strategyres ~= nil)
			end
			
			local _getTarget = function()
				local targetType = Util:getNumber(self.cmdtb, 'ttype')
				if Util:find(self.strategyres.targets, nil, targetType) == nil then return false end
				local targetUid = Util:getNumber(self.cmdtb, 'tuid')
				self.target = WUtil:getTarget(self.player, targetType, targetUid)
				return (self.target ~= nil) 
			end
			
			local _getExpends = function()
				self.expends = WUtil:createExpendObjs(self.player, nil, self.strategyres.expends)
				return table.getn(self.expends) == table.getn(self.strategyres.expends)
			end
			
			self.player = player
			self.cmdtb = cmdtb
			return _getStrategyRes()
				and _getTarget() 
				and _getExpends()
		end
		
		local _isCanUse = function()
			local _isEnoughExpends = function()
				for _,expend in ipairs(self.expends) do
					if not expend:isEnough() then return false end
				end
				return true
			end
			
			local _isCanAppendBuf = function()
				for _, effect in ipairs(self.strategyres.effects) do
					if self.target:getStateContainer():isCanAppend(effect.id) then return true end
				end
				return false
			end
			
			return _isEnoughExpends() and _isCanAppendBuf()
		end
		
		local _subExpend = function()
			for _,expend in ipairs(self.expends) do
				expend:sub()
			end
		end
		
		local _addStrategyBuff = function()
			local creater = {type=OBJ_TYPE.ROLE,id=self.player:getRoleId(), skillid=self.strategyres.id}
			for _, effect in ipairs(self.strategyres.effects) do
				self.target:getStateContainer():appendState(effect, creater)
			end
		end
		
		if not _getParam(player, cmdtb) then  return false end
		if not _isCanUse() then return false end
		_subExpend()
		_addStrategyBuff()
	end;	
})



