--*******************************************************************************
QuestionAct = Class:extends({
	init = function(self)
		self._period = {tstart=20, tend=21} -- hours
		self._interval = 30*60 -- secs
		self._duration = 50 -- secs
		self._nextTime = 0
		self._fixTimer = FixTimer:new()
		self._timerCaller = TimerCaller:new(TIMER_ID.QUESTION_ACT)
		self._timerCaller:register(TIMER_EVT.QUESTION_ACT, Caller:new(0, self, self._onTimer))	
		self:_reset()
	end;
	
	setTimePeriod = function(self, period)
		self._period = period
	end;
	
	start = function(self)
		global.getTimer():start(10*1000, {TIMER_EVT.QUESTION_ACT}, self._timerCaller)
	end;
	
	isCorrect = function(self, answer)
		if not self:_isInState() then
			return false
		end
		return self._questionRes.answer == answer
	end;
	
	sendGift = function(self, player)
		AddItemToPkgHelper:addItems(player, res_questions_gift[1].items)
	end;
	
	appendToRanks = function(self, roleName)
		if table.getn(self._ranks) == 5 then
			return -1
		end
		
		table.insert(self._ranks, roleName)
		return table.getn(self._ranks)
	end;
	
	_onTimer = function(self)
		if self:_isInState() then
			self:_endAct()
		else
			self:_startAct()
		end
	end;
	
	_isInState = function(self)
		return self._questionRes ~= nil
	end;
	
	_startAct = function(self, res)
		if not self:_isInTimePeriod() then
			return 
		end
			
		if not self:_isArrivedNextTime() then
			return
		end
			
		self:_setNextTime()
		self:_makeRankQuestion()
		self:_sendQuestionToPlayers()
	end;
	
	_endAct = function(self)
		if not self:_isArrivedEndTime() then
			return 
		end

		self:_sendQuestionEndToPlayers()
		self:_sendRankGiftToPlayers()
		self:_reset()
	end;
	
	_isInTimePeriod = function(self)
		local hour = os.date('*t', Util:getTime()).hour
		return hour >= self._period.tstart and hour <= self._period.tend
	end;
	
	_isArrivedNextTime = function(self)
		return Util:getTime() >= self._nextTime
	end;
	
	_setNextTime = function(self)
		self._startTime = Util:getTime()
		self._nextTime = self._startTime + self._interval;
	end;	
	
	_makeRankQuestion = function(self)
		local idx = math.random(#res_questions)
		self._questionRes = res_questions[idx]	
	end;
	
	_sendQuestionToPlayers = function(self)
		local players = app:getPlayerMgr():getAllOnlinePlayers()
		for _, player in pairs(players) do
			WUtil:sendSysMsg(player, SMSGT.SYS_POPBAR, SMT_NORMAL, self._questionRes.content)
			WUtil:sendSysMsg(player, SMSGT.CHAT_CHANNEL, CHAT_TAG.SYS, self:_makeQuestionString())
		end
	end;	
	
	_makeQuestionString = function(self)
		local s = string.format(rstr.questions.starttip, self._period.tstart, self._period.tend+1, math.floor(self._interval/60), self._duration)
		s = s .. '<br/><font color=#30ff30>' .. self._questionRes.content .. '</font><font color=#30ffff>'
		for _, op in ipairs(self._questionRes.ops) do
			if op == '' then
				break
			end
			s = s .. '<br/>'
			s = s .. op
		end
		return s .. '</font>'
	end;
	
	_isArrivedEndTime = function(self)
		return Util:getTime() >= (self._startTime + self._duration)
	end;
	
	_sendQuestionEndToPlayers = function(self)
		local players = app:getPlayerMgr():getAllOnlinePlayers()
		for _, player in pairs(players) do
			WUtil:sendSysMsg(player, SMSGT.CHAT_CHANNEL, CHAT_TAG.SYS, self:_makeQuestionEndString())
		end
	end;
	
	_makeQuestionEndString = function(self)
		if #self._ranks == 0 then
			return rstr.questions.endtip
		end
		
		local s = rstr.questions.endranktip
		for _, roleName in ipairs(self._ranks) do
			s = s .. '<br/>'
			s = s .. roleName
		end
		return '<font color=#30ff30>' .. s .. '</font>'
	end;
	
	_sendRankGiftToPlayers = function(self)
		for _, roleName in ipairs(self._ranks) do
			local player = app:getPlayerMgr():getOrLoadPlayerByRoleName(roleName)
			AddItemToPkgHelper:addItems(player, res_questions_gift[2].items)
		end
	end;
	
	_reset = function(self)
		self._ranks = {}
		self._startTime = 0
		self._questionRes = nil
	end;
})

ServerActEffect = Class:extends({
	init = function(self, gapp)
		self.app_ = gapp
		self.recoverSoldierEffector_ = AddTowerRecoverSoldierByActEffector:new()
		self.todayActs_ = {}
		self.todayOnlineGoods = 0
		self._fixTimer = FixTimer:new()
		self._timerCaller = TimerCaller:new(TIMER_ID.SVR_ACTEFFECT)
		self._timerCaller:register(TIMER_EVT.SVR_ACT_EFFECT_REFRESH, Caller:new(0, self, self._onTimer))	
		self._payActStartTime = 0
		self._payActStopTime = 0
		

		self.additionsByActType_ = {
			[SVR_TODAY_ACT_TYPE.HERO_STEEL_2*10 + 0] = 0, -- not in self.todayActs_
			[SVR_TODAY_ACT_TYPE.HERO_STEEL_2*10 + 1] = 2, -- in self.todayActs_
			
			[SVR_TODAY_ACT_TYPE.HERO_STEEL_3*10 + 0] = 0, 
			[SVR_TODAY_ACT_TYPE.HERO_STEEL_3*10 + 1] = 3, 
			
			[SVR_TODAY_ACT_TYPE.ACT_TERRACE_IF_2*10 + 0] = 0, 
			[SVR_TODAY_ACT_TYPE.ACT_TERRACE_IF_2*10 + 1] = 2, 
			
			[SVR_TODAY_ACT_TYPE.ACT_TERRACE_IF_3*10 + 0] = 0, 
			[SVR_TODAY_ACT_TYPE.ACT_TERRACE_IF_3*10 + 1] = 3, 
			
			[SVR_TODAY_ACT_TYPE.ACT_TERRACE_TIMES_1*10 + 0] = 0, 
			[SVR_TODAY_ACT_TYPE.ACT_TERRACE_TIMES_1*10 + 1] = 1, 
			
			[SVR_TODAY_ACT_TYPE.ACT_TOWER_EXP_2*10 + 0] = 0, 
			[SVR_TODAY_ACT_TYPE.ACT_TOWER_EXP_2*10 + 1] = 2,
			
			[SVR_TODAY_ACT_TYPE.ACT_TOWER_EXP_3*10 + 0] = 0, 
			[SVR_TODAY_ACT_TYPE.ACT_TOWER_EXP_3*10 + 1] = 3,
			
			[SVR_TODAY_ACT_TYPE.ACT_TOWER_TIMES_1*10 + 0] = 0, 
			[SVR_TODAY_ACT_TYPE.ACT_TOWER_TIMES_1*10 + 1] = 1,
			}
	end;

	start = function(self)
		self:_startSvrAct()
	end;
	
	addPlayerState = function(self, player) 
		self:_addPlayerRecoverSoldierEffector(player)
	end;
	
	getAdditionByActType = function(self, actType) 
		local has = 0
		if self:hasActType(actType) then
			has = 1
		end
		
		local key = actType*10 + has
		return self.additionsByActType_[key]
	end;
	
	getOnlineGoods = function(self)
		return self.todayOnlineGoods
	end;
	
	hasActType = function(self, actType)
		if actType == SVR_TODAY_ACT_TYPE.HERO_STEEL_2 
			or actType == SVR_TODAY_ACT_TYPE.HERO_STEEL_3 then
			local tm = os.date('*t', Util:getTime())
			if tm.hour < 20 or tm.hour >= 23 then
				return false
			end
		end
			
		return self.todayActs_[actType] == true
	end;	
	
	getCurPayActStartTime = function(self)
		return self._payActStartTime
	end;
	
	getCurPayActStopTime = function(self)
		return self._payActStopTime
	end;
	
	initPayActTime = function(self)
		self:_initPayActTime()
	end;
	
	_startSvrAct = function(self)
		self._fixTimer:start({hour=0, min=0, sec=2}, {TIMER_EVT.SVR_ACT_EFFECT_REFRESH}, self._timerCaller) -- 2 is drt time
		self:_onTimer()
	end;
	
	_addPlayerRecoverSoldierEffector = function(self, player)
		local perVal = self:_getRecoverSoldierEffector()
		if perVal == 0 then
			return 
		end
		
		if not self.recoverSoldierEffector_:isCanExec(player) then
			return
		end
		
		local duration = Util:getFixNextTime(Util:getTime(), 0, 0, 0) - Util:getTime()
		if duration == 0 then
			duration = 24*3600
		end
		AddTowerRecoverSoldierByActEffector():exec(player, 1, {val=perVal, val2=duration}, nil)
	end;
	
	_getRecoverSoldierEffector = function(self)
		if self.todayActs_[SVR_TODAY_ACT_TYPE.ACT_TOWER_RECOVER_10] == true then 
			return 10
		elseif self.todayActs_[SVR_TODAY_ACT_TYPE.ACT_TOWER_RECOVER_20] == true then
			return 20
		else
			return 0
		end
	end;
	
	_onTimer = function(self)
		self:_collectTodayActs()
		self:_addOnlinePlayersEffector()
		self:_initPayActTime()
		self:_checkPayAct()
	end;
	
	_collectTodayActs = function(self)
		self.todayActs_ = {}
		self.todayOnlineGoods = 0
		local curDateTime = Util:getFixPreTime(Util:getTime(), 0, 0, 0)
		local res = Util:qfind(res_dayacts, 'date', curDateTime)
		if res == nil then 
			return
		end
		
		for _, actType in ipairs(res.acts) do
			self.todayActs_[actType] = true
			if actType > SVR_TODAY_ACT_TYPE.ACT_MAX then
				self.todayOnlineGoods = actType
			end
		end
	end;
	
	_addOnlinePlayersEffector = function(self)
		local players = self.app_:getPlayerMgr():getAllOnlinePlayers()
		for _, player in pairs(players) do
			self:addPlayerState(player)
		end
	end;
	
	_initPayActTime = function(self)
		self:_initPayActTimeByResCfg()
		self:_initPayActTimeByOpenSvrTime()
	end;
	
	_initPayActTimeByResCfg = function(self)
		if not self:hasActType(SVR_TODAY_ACT_TYPE.ACT_PAY_1) then
			self._payActStartTime = 0
			self._payActStopTime = 0
			return 
		end
		
		local curDateTime = Util:getFixPreTime(Util:getTime(), 0, 0, 0)
		if not Util:qfind(res_dayacts, 'date', curDateTime) then
			self._payActStartTime = 0
			self._payActStopTime = 0
			return 
		end
		
		local curIdx = Util:getLastFindIdx()
		for i=curIdx, 1, -1 do
			local res = res_dayacts[i]
			if not Util:find(res.acts, nil, SVR_TODAY_ACT_TYPE.ACT_PAY_1) then
				break
			else 
				self._payActStartTime = res.date
			end
		end
		
		for i=curIdx, #res_dayacts do
			local res = res_dayacts[i]
			if not Util:find(res.acts, nil, SVR_TODAY_ACT_TYPE.ACT_PAY_1) then
				break
			else 
				self._payActStopTime = res.date
			end
		end	
	end;
	
	_initPayActTimeByOpenSvrTime = function(self)
		if self._payActStartTime ~= 0 then
			return
		end
		
		local curDateTime = Util:getFixPreTime(Util:getTime(), 0, 0, 0)
		local daysSec = 7*24*3600;
		if curDateTime >= ActTaskUtil:getSvrOpenTime() and curDateTime < ActTaskUtil:getSvrOpenTime() + daysSec  then
			self._payActStartTime = ActTaskUtil:getSvrOpenTime()
			self._payActStopTime = ActTaskUtil:getSvrOpenTime() + daysSec
		end
	end;
	
	_checkPayAct = function(self)
		local players = self.app_:getPlayerMgr():getAllOnlinePlayers()
		for _, p in pairs(players) do
			p:getTask():getPayAct():check()
		end
	end;
})


