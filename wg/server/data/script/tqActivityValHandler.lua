--*******************************************************************************
ActivityValHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = ActivityValGetAllInfoHdr()
		self.handlers[2] = ActivityValGetActRewardHdr()
		self.handlers[3] = ActivityValSignInHdr()
		self.handlers[4] = ActivityValGetSignRewardHdr()
		self.handlers[5] = ActivityValGetOnlineGoodsHdr()
		self.handlers[6] = ActivityValGetPayGiftHdr()
	end;
})

ActivityValGetAllInfoHdr = Class:extends({
	handle = function(self, player, cmdtb)
		ActivityValSender:sendVal(player)
		ActivityValSender:sendGotActRewards(player)
		ActivityValSender:sendGotSigninRewards(player)
		ActivityValSender:sendSignin(player)
		ActivityValSender:sendDayActs(player)
		ActivityValSender:sendPayActTime(player)
		ActivityValSender:sendGotOnlineGoods(player)
		ActivityValSender:sendOnlineGoodsId(player)
		TaskSender:sendActValTasks(player)
	end;
})

ActivityValSignInHdr = Class:extends({
	handle = function(self, player, cmdtb)
		local activityVal = player:getTask():getActivityVal()
		activityVal:todaySign()
		ActivityValSender:sendSignin(player)
	end;
})

ActivityValGetRewardHdr = Class:extends({
	init = function(self)
		self.dropItemEffector_ = DropItemEffector()
	end;
	
	handle = function(self, player, cmdtb)
		local res = self:_getRes(Util:getNumber(cmdtb, 'id'))
		if res == nil then
			return false 
		end
		
		local gotRewardsObj = self:_getGotActRewards(player)
		if gotRewardsObj:isGotReward(res.id) then
			return false
		end
		
		if not self:_hasEnoughVal(player, res) then
			return false
		end
		
		local effectRes = {val=res.dropId, val2=res.dropId2}
		if not self.dropItemEffector_:isCanExec(player, 1, effectRes, {}) then
			return false
		end
		
		self.dropItemEffector_:exec(player, 1, effectRes, {})
		gotRewardsObj:setGotReward(res.id)
		self:_sendMsg(player)
		self:_doTask(player)
		
		return true
	end;
	
	_doTask = function(self, player)
	end;
})

ActivityValGetActRewardHdr = ActivityValGetRewardHdr:extends({
	_getRes = function(self, id)
		return Util:qfind(res_activityval_rewards, 'id', id)
	end;
	
	_getGotActRewards = function(self, player)
		return player:getTask():getActivityVal():getGotActRewards()
	end;
	
	_hasEnoughVal = function(self, player, res)
		return player:getTask():getActivityVal():getTodayVal() >= res.val
	end;
	
	_sendMsg = function(self, player)
		ActivityValSender:sendGotActRewards(player)
	end;
	
	_doTask = function(self, player)
		TaskFinisher:trigerTask(player, TASK_FINISH_TYPE.FINISH_GET_VITALITY_GIFT)
	end;
})

ActivityValGetSignRewardHdr = ActivityValGetRewardHdr:extends({
	_getRes = function(self, id)
		return Util:qfind(res_signin_rewards, 'id', id)
	end;
	
	_getGotActRewards = function(self, player)
		return player:getTask():getActivityVal():getGotSigninRewards()
	end;
	
	_hasEnoughVal = function(self, player, res)
		return player:getTask():getActivityVal():getSigninDays() >= res.days
	end;
	
	_sendMsg = function(self, player)
		ActivityValSender:sendGotSigninRewards(player)
	end;
})

ActivityValGetOnlineGoodsHdr = Class:extends({
	handle = function(self, player)
		player:getTask():getActivityVal():todayGetOnlineGoods()
		ActivityValSender:sendGotOnlineGoods(player)
	end;
})

ActivityValGetPayGiftHdr = Class:extends({
	handle = function(self, player, cmdtb)
		local idx = Util:getNumber(cmdtb, 'idx')
		if idx >= #res_pay_act_gifts or idx < 0 then
			return false
		end
		
		local itemId = player:getTask():getPayAct():getGift(idx)
		if itemId == 0 then
			return false
		end
		
		local number = 1
		if not player:getPkg():addItems({RawItemEx({resId=itemId, number=number})}) then
			WUtil:sendWarningMsgArgs(player, 100015, '')
			return false
		else
			LOG('<pay return giftitem>role:' .. player:getRoleName() .. ', resId:' .. itemId .. ', number:' .. number )
		end
		
		player:getTask():getPayAct():setGetGiftFlag(idx, 1)
		
		return true
	end;
})

