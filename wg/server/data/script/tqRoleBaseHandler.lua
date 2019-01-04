
RoleBaseHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = SendRoleInfoHdr()
		self.handlers[2] = AssignRolePPSHdr()
		self.handlers[3] = ChangeStateCityHdr()
		self.handlers[4] = ClearRolePPSHdr()
		self.handlers[5] = RoleAssignExpHdr()
		self.handlers[6] = ChangeIntroductionHdr()
		self.handlers[7] = SearchRoleForRankHdr()
		self.handlers[8] = GetPageRankRolesHdr()
	end;
})

SendRoleInfoHdr = Class:extends({
	handle = function(self, player, cmdtb)
		RoleBaseSender:sendAll(player)
		RoleAttrSender:sendAttrs(player, player:getAttrs())
		CityBuildValSender:sendAll(player)	
		FarmSender:sendAll(player, player)
	end;
})

AssignRolePPSHdr = Class:extends({
	handle = function(self, player, cmdtb)
		self.player = player
		self:_getParam(cmdtb)
		if not self:_isValid() then return end
		self:_assign();
	end;
	
	_getParam = function(self, cmdtb)
		self.pps = {Util:getNumber(cmdtb, 'p0'),  Util:getNumber(cmdtb, 'p1')}
	end;
	
	_isValid = function(self)
		local attr = self.player:getAttr(ATTR.PP)
		local assignpp = 0
		for i, p in ipairs(self.pps) do
			if p < 0 then return false end
			assignpp = assignpp + p;
		end
		return (attr.ulVal >= assignpp)
	end;
	
	_assign = function(self)
		local attrids = {ATTR.FOR_B, ATTR.IN_B}
		local assignpp = 0
		for i, addPoint in ipairs(self.pps) do
			local attrId = attrids[i]
			self.player:setAttrVal(attrId, self.player:getAttrVal(attrId) + addPoint)
			assignpp = assignpp + addPoint;
		end

		self.player:setAttrVal(ATTR.PP, self.player:getAttrVal(ATTR.PP) - assignpp)
		RoleAttrSender:sendAttrs(self.player, self.player:getAttrs())
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.ASSIGN_ROLE_ATTR)
	end;
})

ChangeStateCityHdr = Class:extends({
	init = function(self)
		self.moveCityUtil = MoveCityUtil:new()
	end;
	
	handle = function(self, player, cmdtb)
		self:_initParam(player, cmdtb)
		self:_createExpends()
		
		if not self:_isValid() then 
			return 
		end
		
		self:_startChange()
	end;

	_initParam = function(self, player, cmdtb)
		self.player = player
		
		self.cityResId = Util:getNumber(cmdtb, 'cid')
		if (self.cityResId < res_city_range.first) or (self.cityResId > res_city_range.last) then 
			self.cityResId = -1 
		end
		
		if self.cityResId == self.player:getCityId() then 
			self.cityResId = -1 
		end
	end;
	
	_createExpends = function(self)
		local expendress = {{attr=ATTR.GOLD,type=EXPEND_TYPE.GOLD,val=self:_getNeedGold()}};
		self.expends = WUtil:createExpendObjs(self.player, nil, expendress)	
	end;	
	
	_isValid = function(self)
		if self.cityResId == -1 then 
			return false
		end
		
		if self.player:getAlliId() ~= 0 then 
			return false 
		end
		
		if Util:getTime() < self.player:getCityCD() then 
			return false
		end
		
		if not WUtil:isEnoughExpends(self.expends) then 
			return false
		end
		
		if not self.moveCityUtil:isHerosStateCanMove(self.player) then 
			return false 
		end
		
		return true
	end;
	
	_startChange = function(self)
		local pos =  app:getCityMgr():getFreeCityPos( self.cityResId )
		if pos == nil then
			WUtil:sendErrorMsgArgs(self.player, 100007, '"@cityid'..self.cityResId..'"')
			return
		end
		
		self:_setPlayerChangeInfo()
		self.moveCityUtil:moveToPos(self.player, pos)
		
		WUtil:subExpends(self.expends)
		
		RoleBaseSender:send(self.player, {'prestige','cityhonor','citycd','cityid','pos'})
		WUtil:sendSuccMsgArgs(self.player, 100008, '"@cityid'..self.cityResId..'",'..pos.x..','..pos.y)
	end;
	
	_setPlayerChangeInfo = function(self)
		self.player:setCityId(self.cityResId)
		self.player:setCityCD(Util:getTime()+3600*res_changecity_cd)
		self.player:setPrestige(self.player:getPrestige()*res_ccity_prestige_per)
		self.player:setCityHonor(0)
	end;
	
	_getNeedGold = function(self)
		if self.player:getState() == ROLE_STATE.YOUNG then
			return 0
		else
			return res_ccity_need_gold
		end
	end;
})

ClearRolePPSHdr = Class:extends({
	handle = function(self, player, cmdtb)
		self.player = player
		self:_getParam(cmdtb)
		if not self:_isValid() then return end
		self:_clear();
	end;
	
	_getParam = function(self, cmdtb)
		self.pps = {Util:getNumber(cmdtb, 'fval'),  Util:getNumber(cmdtb, 'pval')}
	end;
	
	_isValid = function(self)
		if (self.pps[1] < 0) or (self.pps[2] < 0)  then return false end
		if (self.pps[1] + self.pps[2] ) == 0 then return false end
		if self.pps[1] > self:_getAttrValByAddPP(ATTR.FOR_B) then return false end
		if self.pps[2] > self:_getAttrValByAddPP(ATTR.IN_B) then return false end
		if self.pps[1] > self.player:getPkg():getItemNumber(FIXID.CLEARFORCARD) then return false end
		if self.pps[2] > self.player:getPkg():getItemNumber(FIXID.CLEARINCARD) then return false end
		return true;
	end;
	
	_getAttrValByAddPP = function(self, attrid)
		local battr = Util:find(res_role_initdata.attrs, 'attr', attrid)
		return self.player:getAttrVal(attrid) - battr.val;
	end;
	
	_clear = function(self)
		self:_changeAttrs()
		self:_subItems()
		ItemMsgSender:sendByResId(self.player, {FIXID.CLEARFORCARD, FIXID.CLEARBRCARD, FIXID.CLEARINCARD})
		RoleAttrSender:sendAttrs(self.player, self.player:getAttrs())
		WUtil:sendSuccMsg(self.player, rstr.succ.clearppok)
	end;
	
	_changeAttrs = function(self)
		local needattrs = {ATTR.FOR_B, ATTR.IN_B}
		for i, attrid in ipairs(needattrs) do
			self.player:setAttrVal(attrid, self.player:getAttrVal(attrid) - self.pps[i])
			self.player:setAttrVal(ATTR.PP, self.player:getAttrVal(ATTR.PP) + self.pps[i] )
		end
	end;
	
	_subItems = function(self)
		local pkg = self.player:getPkg()
		local resids = {FIXID.CLEARFORCARD, FIXID.CLEARINCARD}
		for i, resid in ipairs(resids) do
			pkg:subItemByResId(resid, self.pps[i])
		end
	end;
})

RoleAssignExpHdr = Class:extends({
	handle = function(self, player, cmdtb)
		self.player = player
		self:_getParam(cmdtb)
		if not self:_isValid() then return end
		self:_assign()
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.ASSIGN_HERO_EXPS)
	end;
	
	_getParam = function(self, cmdtb)
		local heroid = Util:getNumber(cmdtb, 'heroid')
		self.hero = self.player:getHeroMgr():getHeroById(heroid)
		self.exp = Util:getNumber(cmdtb, 'exp')
	end;
	
	_isValid = function(self)
		if self.hero == nil then return false end
		if (self.exp <= 0) or (self.exp > self.player:getAttrVal(ATTR.XPS)) then return false end
		return true
	end;
	
	_assign = function(self)
		self.player:subXPSAttr(self.exp)
		RoleAttrSender:sendAttr(self.player, self.player:getAttr(ATTR.XPS))
		self.hero:addExp(self.player, self.exp)
	end;
})

ChangeIntroductionHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then return false end
		
		self.player:setIntroduction(self.introduction)
		RoleBaseSender:send(self.player, {'introduction'})
		
		return true
	end;
	
	_initParam = function(self, player, cmdtb)
		local intr = Util:getString(cmdtb, 'intr')
		if string.len(intr) > MAX_ROLEINTRO_LEN then
			return false
		end
		
		self.introduction = intr
		self.player = player
		return true
	end;
})

SearchRoleForRankHdr = SearchRankHdrTemplet:extends({
	_getRankObj = function(self)
		return app:getRoleRank()
	end;
	
	_sendRanks = function(self, player, pageNo, pageItemCount, curSelIdx)
		RoleRankSender:sendRanks(player, pageNo, pageItemCount, curSelIdx)
	end;
})

GetPageRankRolesHdr = GetPageRankHdrTemplet:extends({
	_sendRanks = function(self, player, pageNo, pageItemCount, curSelIdx)
		RoleRankSender:sendRanks(player, pageNo, pageItemCount, curSelIdx)
	end;
})


