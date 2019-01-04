----------------------------------------------------------------------------------------
CultureHandler = Class:extends({
	onRequest = function(self, player, netevt, cmdtb)
		local curtime = Util:getTime()
		if cmdtb.subcmd == 1 then
			CultureSender:sendCultures(player)
			CultureSender:sendLearningCulture(player)
		elseif cmdtb.subcmd == 2 then
			LearnCultureHdr:handle(player, cmdtb)
		elseif cmdtb.subcmd == 3 then
			CancelLearningCultureHdr:handle(player, cmdtb)
		end
	end;
})

LearnCultureHdr = Class:extends({
	handle = function(self, player, cmdtb)
		self:getParam(player, cmdtb)
		if not self:isValidId() then return end
		if self:isFullLevel() then return end
		if self:isLearningCulture() then return end
		if not self:isEnoughPreCond() then return end
		if not self:getExpends() then return end
		if not WUtil:isEnoughExpends(self.expends) then return false end
		
		WUtil:subExpends(self.expends)
		self:startLearningCulture()
		self:sendMsg()
	end;
	
	getParam = function(self, player, cmdtb)
		self.player = player
		self.cultureid = Util:getNumber(cmdtb, 'id')
		self.cultureObjs = self.player:getCultures()
		self.learningCulture = self.cultureObjs:getLearningCulture()
	end;
	
	isValidId = function(self)
		return self.cultureid >= FIXID.FIRSTCBUILD and self.cultureid <= FIXID.LASTCBUILD
	end;
	
	isFullLevel = function(self)
		local level = self.cultureObjs:getLevel(self.cultureid)
		local res = ItemResUtil:findItemres(self.cultureid)
		return level >= res.maxlevel
	end;
	
	isLearningCulture = function(self)
		return self.learningCulture.id > 0
	end;
	
	isEnoughPreCond = function(self)
		local curLevel = self.cultureObjs:getLevel(self.cultureid)
		local nextLevelRes = ItemResUtil:findCultureLevelres(self.cultureid, curLevel+1)
		if nextLevelRes == nil then return false end
		
		for _, cond in ipairs(nextLevelRes.conds) do
			if cond.id > 0 then
				if cond.level > self:getMyHasLevel(cond.id) then return false end
			end
		end
		return true
	end;
	
	getMyHasLevel = function(self, condId)
		if (condId >= FIXID.FIRSTINBUILD) and (condId <= FIXID.LASTINBUILD)  then
			return self.player:getCitys():getBuildLevelByResId(condId)
		elseif (condId >= FIXID.FIRSTCBUILD) and (condId <= FIXID.LASTCBUILD)  then
			return self.cultureObjs:getLevel(condId)
		end
		return 0;
	end;
	
	getExpends = function(self)
		local curLevel = self.cultureObjs:getLevel(self.cultureid)
		local needres = ItemResUtil:findCultureLevelres(self.cultureid, curLevel+1)
		local expendress = {}
		local rawExpendRess = {
			{attr=ATTR.MONEY, type=EXPEND_TYPE.MONEY, val=needres.money}
			,{id=FIXID.FOOD, type=EXPEND_TYPE.COMMRES, val=needres.food}
			,{id=FIXID.WOOD, type=EXPEND_TYPE.COMMRES, val=needres.wood}
			,{id=FIXID.STONE, type=EXPEND_TYPE.COMMRES, val=needres.stone}
			,{id=FIXID.IRON, type=EXPEND_TYPE.COMMRES, val=needres.iron}
		}
		
		for _, rawres in ipairs(rawExpendRess) do
			if rawres.val > 0 then
				table.insert(expendress, {attr=rawres.attr, id=rawres.id, type=rawres.type, val=rawres.val})
			end
		end
		
		self.expends = WUtil:createExpendObjs(self.player, nil, expendress)
		return true
	end;
	
	startLearningCulture = function(self)
		local curLevel = self.cultureObjs:getLevel(self.cultureid)
		local needres = ItemResUtil:findCultureLevelres(self.cultureid, curLevel+1)
		
		local roleBrains = self.player:getAttrVal(ATTR.BR_B) + self.player:getAttrVal(ATTR.BR_A)
		local collegeLevel = self.player:getCitys():getBuildLevelByResId(FIXID.COLLEGEBUILD)
		local buffState = self.player:getStateContainer():getEffectState(RES_EFF.ADD_CULTURE_SPEED_AND_MONEY_OUTPUT)
		local buffAdd = 0
		if buffState ~= nil and (buffState:getEffectValUnit() == VAL_UNIT.PER) then
			buffAdd = buffState:getEffectVal()/100
		end
		
		local ntime = res_calc_fact_learn_culture_time(needres.ntime, collegeLevel, roleBrains, buffAdd)
		if self.player:hasVipEffect( VIP_EFF.SPEED_CULTURELEARN) then
			ntime = 0
		end
		
		global.getTimer():start(ntime*1000, {TIMER_EVT.LEARN_CULTURE_STOP, self.cultureid}, self.player:getTimerCaller())

		self.learningCulture.stoptime = Util:getTime() + ntime
		self.learningCulture.id = self.cultureid
	end;
	
	sendMsg = function(self)
		CultureSender:sendLearningCulture(self.player)
	end;
})

CancelLearningCultureHdr = Class:extends({
	handle = function(self, player, cmdtb)
		self:getParam(player)
		if not self:isLearningCulture() then return end
		
		self:clearLearningCulture()
		CultureSender:sendLearningCulture(player)
	end;
	
	getParam = function(self, player)
		self.player = player
		local cultureObjs = player:getCultures()
		self.learningCulture = cultureObjs:getLearningCulture()
	end;
	
	isLearningCulture = function(self)
		return (self.learningCulture.id > 0) and (self.learningCulture.stoptime > 0)
	end;
	
	clearLearningCulture = function(self)
		self.learningCulture.id= 0
		self.learningCulture.stoptime= 0
	end;
})




