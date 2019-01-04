MAX_ALLI_INTRODUCE_LEN = 600
MAX_ALLI_BULLETIN_LEN = 600
MAX_QQ_GROUP = 99999999999

ALLI_OP_TYPE = {
	GETALLI = 1,
	UPGRADE = 2,
	INVITE = 3,
	DISMISS = 4,
	CANCELDISMISS = 5,
	EXIT = 6,
	MODIFY = 7,
	GAIN = 8,
	UPGRADE_LAWLIGHT = 9,
	BESTOW_LAWLIGHT = 10,
	FEED_LAWLIGHT = 11,
	GET_ALEADER = 12,
	TRANSFER = 13,
	CANCEL_TRANSFER = 14,
	CONTRIBUTE_RES = 15,
	APPOINT = 16,
	FIREMEM = 17,
	AGREEAPPLY = 18,
	IGNOREAPPLY = 19,
	GET_EVENTS = 20,
	GET_APPLYMERGES = 21,
	APPLYMERGE = 22,
	AGREEMERGE = 23,
	IGNOREMERGE = 24,
}

ALLI_POS_OP_AUTHORITY = {
	[ALLI_OP_TYPE.GETALLI] = ALLI_POS.MEM,
	[ALLI_OP_TYPE.UPGRADE] = ALLI_POS.LEADER,
	[ALLI_OP_TYPE.INVITE] = ALLI_POS.ELDER,
	[ALLI_OP_TYPE.DISMISS] = ALLI_POS.LEADER,
	[ALLI_OP_TYPE.CANCELDISMISS] = ALLI_POS.LEADER,
	[ALLI_OP_TYPE.EXIT] = ALLI_POS.MEM,
	[ALLI_OP_TYPE.MODIFY] = ALLI_POS.LEADER,
	[ALLI_OP_TYPE.GAIN] = ALLI_POS.MEM,
	[ALLI_OP_TYPE.UPGRADE_LAWLIGHT] = ALLI_POS.LEADER,
	[ALLI_OP_TYPE.BESTOW_LAWLIGHT] = ALLI_POS.LEADER,
	[ALLI_OP_TYPE.FEED_LAWLIGHT] = ALLI_POS.MEM,
	[ALLI_OP_TYPE.GET_ALEADER] = ALLI_POS.LEADER,
	[ALLI_OP_TYPE.TRANSFER] = ALLI_POS.LEADER,
	[ALLI_OP_TYPE.CANCEL_TRANSFER] = ALLI_POS.LEADER,
	[ALLI_OP_TYPE.CONTRIBUTE_RES] = ALLI_POS.MEM,
	[ALLI_OP_TYPE.APPOINT] = ALLI_POS.ALEADER,
	[ALLI_OP_TYPE.FIREMEM] = ALLI_POS.ELDER,
	[ALLI_OP_TYPE.AGREEAPPLY] = ALLI_POS.ELDER,
	[ALLI_OP_TYPE.IGNOREAPPLY] = ALLI_POS.ELDER,
	[ALLI_OP_TYPE.GET_EVENTS] = ALLI_POS.MEM,
	[ALLI_OP_TYPE.GET_APPLYMERGES] = ALLI_POS.LEADER,
	[ALLI_OP_TYPE.APPLYMERGE] = ALLI_POS.LEADER,
	[ALLI_OP_TYPE.AGREEMERGE] = ALLI_POS.LEADER,
	[ALLI_OP_TYPE.IGNOREMERGE] = ALLI_POS.LEADER,
}

AllianceHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = CreateAllianceHdr()
		self.handlers[2] = ApplyJoinAllianceHdr()
		self.handlers[3] = GetCurApplyingAllianceHdr()
		self.handlers[4] = GetAllianceDetailHdr()
		self.handlers[5] = GetInviteListAllianceHdr()
		self.handlers[6] = AgreeInviteAllianceHdr()
		self.handlers[7] = IgnoreInviteAllianceHdr()
		self.handlers[8] = GetAllianceListHdr()
		self.handlers[9] = SearchAllianceHdr()
		self.handlers[10] = GetSelfAllianceMemsHdr()
		self.handlers[11] = GetOtherAllianceMemsHdr()
		self.handlers[12] = GetMyAllianceDetailHdr()
		self.handlers[13] = UpgradeAllianceHdr()
		self.handlers[14] = ModifyQQGroupHdr()
		self.handlers[15] = InviteAllianceMemberHdr()
		self.handlers[16] = DismissAllianceHdr()
		self.handlers[17] = CancelDismissAllianceHdr()
		self.handlers[18] = ExitAllianceHdr()
		self.handlers[19] = ModifyAllianceIntroducHdr()
		self.handlers[20] = ModifyAllianceBulletinHdr()
		self.handlers[21] = GainAllianceTodayGiftHdr()
		self.handlers[22] = UpgradeLawLightHdr()
		self.handlers[23] = LawLightBestowHdr()
		self.handlers[24] = LawLightFeedHdr()
		self.handlers[25] = GetALeadersHdr()
		self.handlers[26] = TransferLeaderAllianceHdr()
		self.handlers[27] = CancelTransferAllianceHdr()
		self.handlers[28] = ContributeAllianceResHdr()
		self.handlers[29] = GetTodaySortMemsHdr()
		self.handlers[30] = GetAllSortMemsHdr()
		self.handlers[31] = AppointAlliMemberHdr()
		self.handlers[32] = FireAlliMemberHdr()
		self.handlers[33] = AgreeApplyJoinAllianceHdr()
		self.handlers[34] = IgnoreApplyJoinAllianceHdr()
		self.handlers[35] = GetAllianceEventsHdr()
		self.handlers[36] = GetApplyAllianceMergesHdr()
		self.handlers[37] = ApplyMergeAllianceHdr()
		self.handlers[38] = AgreeMergeAllianceHdr()
		self.handlers[39] = IgnoreMergeAllianceHdr()
		self.handlers[40] = GetAllianceAuctionInfoHdr()
		self.handlers[41] = AllianceAuctionBuyItemHdr()
		self.handlers[42] = SellItemToAllianceHdr()
		self.handlers[43] = CancelAllianceSellItemHdr()
		self.handlers[44] = GetAllianceSellItemsHdr()
	end;
})

SelfAllianceOpBaseHdr = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_isHasAlliance(player) then
			return false
		end
		
		if not self:_isHasOpAuthority( self:_getOpType() ) then
			return false
		end
		
		return self:_handle(cmdtb)
	end;
	
	_isHasAlliance = function(self, player)
		self.player = player
		self.alliance = app:getAlliMgr():getAlliById( self.player:getAlliId() )
		if self.alliance:getId() == 0 then
			return false
		end
		return true
	end;
	
	_getOpType = function(self)
		return ALLI_OP_TYPE.GETALLI
	end;
	
	_isHasOpAuthority = function(self, opType)
		local needAlliPos = ALLI_POS_OP_AUTHORITY[opType]
		self.member = self.alliance:getMemberById(self.player:getRoleId())
		return self.member ~= nil and self.member:getAlliPos() >= needAlliPos
	end;
})

BaseAllianceChecker = Class:extends({
	isCan = function(self)
		return false
	end;
	
	getExpends = function(self)
		return nil
	end;
	
	_setParam = function(self, player, allianceId)
		self.player = player
		self.alliance = app:getAlliMgr():getAlliById(allianceId)
	end;
	
	_hasExistAlliance = function(self)
		return self.player:getAlliId() > 0
	end;
	
	_hasExitAlliBuff = function(self)
		return self.player:getStateContainer():hasEffectState(RES_EFF.EXIT_ALLIANCE)
	end;
	
	_hasNeedBuild = function(self)
		return self.player:getCitys():getBuildsLevelSum(FIXID.ALLIINBUILD) > 0
	end;		
	
	_isSameStateAlliance = function(self)
		return self.alliance:getCityResId() == self.player:getCityId()
	end;
})

CreateAllianceChecker = BaseAllianceChecker:extends({
	isCan = function(self, player, allianceId)
		self:_setParam(player, allianceId)
		
		if self:_hasExistAlliance() then
			WUtil:sendWarningMsgArgs(self.player, 100106, '')
			return false
		end
		
		if self:_hasExitAlliBuff() then
			WUtil:sendWarningMsgArgs(self.player, 100103, '')
			return false
		end
		
		if not self:_hasNeedBuild() then
			WUtil:sendWarningMsgArgs(self.player, 100104, '')
			return false
		end
		
		if not self:_hasEnoughLevel() then
			WUtil:sendWarningMsgArgs(self.player, 100105, '')
			return false
		end
		
		if not self:_hasEnoughMoney() then
			return false
		end
		
		return true
	end;
	
	getExpends = function(self)
		return self.expends
	end;
	
	_hasEnoughLevel = function(self)
		return self.player:getLevel() >= res_create_alli_need_rolelevel
	end;
	
	_hasEnoughMoney = function(self)
		local expendress = {{attr=ATTR.MONEY, type=EXPEND_TYPE.MONEY, val=res_create_alli_need_money}}
		self.expends = WUtil:createExpendObjs(self.player, nil, expendress)
		return WUtil:isEnoughExpends(self.expends)
	end;
})

ApplyJoinAllianceChecker = BaseAllianceChecker:extends({
	isCan = function(self, player, allianceId)
		self:_setParam(player, allianceId)
		
		if not self:_isValidAlliance() then
			return false
		end
		
		if not self:_isValidPlayer() then
			return false
		end
		
		return true;
	end;
	
	_isValidAlliance = function(self)
		if self.alliance:isNull() then
			WUtil:sendWarningMsgArgs(self.player, 100111, '')
			return false
		end
		
		if not self:_isSameStateAlliance() then
			WUtil:sendWarningMsgArgs(self.player, 100112, '')
			return false
		end
		
		if self.alliance:isFullMember() then
			WUtil:sendWarningMsgArgs(self.player, 100113, '')
			return false
		end	
		
		if self.alliance:isDismissing() then
			WUtil:sendWarningMsgArgs(self.player, 100114, '')
			return false
		end
			
		return true
	end;
	
	_isValidPlayer = function(self)
		if self:_hasExistAlliance() then
			WUtil:sendWarningMsgArgs(self.player, 100107, '')
			return false
		end
		
		if self:_hasExitAlliBuff() then
			WUtil:sendWarningMsgArgs(self.player, 100108, '')
			return false
		end
		
		if not self:_hasNeedBuild() then
			WUtil:sendWarningMsgArgs(self.player, 100109, '')
			return false
		end

		return true
	end;
})

AgreeApplyJoinAllianceChecker = BaseAllianceChecker:extends({
	isCan = function(self, operator, applyer, allianceId)
		self:_setParam(operator, applyer, allianceId)

		if not self:_isValidPlayer() then
			return false
		end
		
		if not self:_isValidAlliance() then
			return false
		end
		
		return true;
	end;
	
	_setParam = function(self, operator, applyer, allianceId)
		self.operator = operator
		self.player = applyer
		self.alliance = app:getAlliMgr():getAlliById(allianceId)
	end;
	
	_isValidAlliance = function(self)
		if not self:_isSameStateAlliance() then
			WUtil:sendWarningMsgArgs(self.operator, 100134, '')
			return false
		end
		
		if self.alliance:isFullMember() then
			WUtil:sendWarningMsgArgs(self.operator, 100113, '')
			return false
		end	

		if self.alliance:isDismissing() then
			WUtil:sendWarningMsgArgs(self.operator, 100114, '')
			return false
		end

		return true
	end;
	
	_isValidPlayer = function(self)
		if self.player == nil then
			WUtil:sendWarningMsgArgs(self.operator, 100050, '')
			return false 
		end
		
		if not self.alliance:getApplyRoleIdsSet():has(self.player:getRoleId()) then
			WUtil:sendWarningMsgArgs(self.operator, 100133, '')
			return false
		end
		
		if self:_hasExistAlliance() then
			WUtil:sendWarningMsgArgs(self.operator, 100126, '')
			return false
		end
		
		if self:_hasExitAlliBuff() then
			WUtil:sendWarningMsgArgs(self.operator, 100135, '')
			return false
		end
		
		if not self:_hasNeedBuild() then
			WUtil:sendWarningMsgArgs(self.operator, 100136, '')
			return false
		end
		
		return true
	end;
})

InviteAllianceMemberChecker = BaseAllianceChecker:extends({
	isCan = function(self, operator, applyer, allianceId)
		self:_setParam(operator, applyer, allianceId)

		if not self:_isValidPlayer() then
			return false
		end
		
		if not self:_isValidAlliance() then
			return false
		end
		
		return true;
	end;
	
	_setParam = function(self, operator, applyer, allianceId)
		self.operator = operator
		self.player = applyer
		self.alliance = app:getAlliMgr():getAlliById(allianceId)
	end;
	
	_isValidPlayer = function(self)
		if self.player == nil then
			WUtil:sendWarningMsgArgs(self.operator, 100050, '')
			return false
		end
		
		if self:_hasExistAlliance() then
			WUtil:sendWarningMsgArgs(self.operator, 100126, '')
			return false
		end
		
		if  self.player:getInviteJoinAlliances():isFull() then
			WUtil:sendWarningMsgArgs(self.operator, 100124, '')
			return false
		end
		
		if  self.player:getInviteJoinAlliances():has(self.alliance:getId()) then
			WUtil:sendWarningMsgArgs(self.operator, 100125, '')
			return false
		end	
		
		if self:_hasExitAlliBuff() then
			WUtil:sendWarningMsgArgs(self.operator, 100135, '')
			return false
		end
		
		if not self:_hasNeedBuild() then
			WUtil:sendWarningMsgArgs(self.operator, 100136, '')
			return false
		end

		return true
	end;	
	
	_isValidAlliance = function(self)
		if self.alliance:isFullMember() then
			WUtil:sendWarningMsgArgs(self.operator, 100123, '')
			return false 
		end
		
		if not self:_isSameStateAlliance() then
			WUtil:sendWarningMsgArgs(self.operator, 100134, '')
			return false
		end
		
		if self.alliance:isDismissing() then
			WUtil:sendWarningMsgArgs(self.operator, 100114, '')
			return false
		end

		return true
	end;	
})

AgreeInviteAllianceChecker = BaseAllianceChecker:extends({
	isCan = function(self, operator, applyer, allianceId)
		self:_setParam(operator, applyer, allianceId)

		if not self:_isValidPlayer() then
			return false
		end
		
		if not self:_isValidAlliance() then
			return false
		end
		
		return true;
	end;
	
	_setParam = function(self, operator, applyer, allianceId)
		self.operator = operator
		self.player = applyer
		self.alliance = app:getAlliMgr():getAlliById(allianceId)
	end;
	
	_isValidPlayer = function(self)
		if self:_hasExistAlliance() then
			WUtil:sendWarningMsgArgs(self.operator, 100107, '')
			return false
		end
		
		if self:_hasExitAlliBuff() then
			WUtil:sendWarningMsgArgs(self.operator, 100108, '')
			return false
		end
		
		if not self:_hasNeedBuild() then
			WUtil:sendWarningMsgArgs(self.operator, 100109, '')
			return false
		end

		return true
	end;	
	
	_isValidAlliance = function(self)
		if self.alliance:isNull() then
			WUtil:sendWarningMsgArgs(self.operator, 100111, '')
			return false
		end
		
		if not self.player:getInviteJoinAlliances():has(self.alliance:getId()) then
			WUtil:sendWarningMsgArgs(self.operator, 100137, '')
			return false
		end
		
		if self.alliance:isFullMember() then
			WUtil:sendWarningMsgArgs(self.operator, 100113, '')
			return false 
		end
		
		if not self:_isSameStateAlliance() then
			WUtil:sendWarningMsgArgs(self.operator, 100138, '')
			return false
		end
		
		if self.alliance:isDismissing() then
			WUtil:sendWarningMsgArgs(self.operator, 100114, '')
			return false
		end

		return true
	end;	
})

CreateAllianceHdr = Class:extends({
	init = function(self)
		self.checker = CreateAllianceChecker()
	end;
	
	handle = function(self, player, cmdtb)
		self:_initParam(player, cmdtb)
		
		if not self.checker:isCan(player) then
			return false
		end
		
		if not self:_isValidName() then
			WUtil:sendWarningMsg(self.player, getLastErrorStr())
			return false
		end
		
		if self:_isExistName() then
			WUtil:sendWarningMsg(self.player, getLastErrorStr())
			return false
		end
		
		if not self:_isValidFlagName() then
			WUtil:sendWarningMsg(self.player, getLastErrorStr())
			return false
		end
		
		if self:_isExistFlagName() then
			WUtil:sendWarningMsg(self.player, getLastErrorStr())
			return false
		end
		
		self:_createAlliance()
		
		return true;
	end;
	
	_initParam = function(self, player, cmdtb)
		self.player = player
		self.name = Util:getString(cmdtb, 'name')
		self.flag = Util:getString(cmdtb, 'flag')
	end;
	
	_isValidName = function(self)
		return ValidChecker:isAllianceName(self.name)
	end;
	
	_isExistName = function(self)
		return not ValidChecker:isNewAllianceName(self.name)
	end;
	
	_isValidFlagName = function(self)
		return ValidChecker:isAllianceFlagName(self.flag)
	end;
	
	_isExistFlagName = function(self)
		return not ValidChecker:isNewAllianceFlagName(self.flag)
	end;
	
	_createAlliance = function(self)
		WUtil:subExpends(self.checker:getExpends())
		local alliance = app:getAlliMgr():createAlliance(self.player, self.name, self.flag)
		self.player:setAlliId(alliance:getId())
		RoleBaseSender:send(self.player, {'alliance'})
		AllianceSender:sendCreateAlliance(self.player)
		TaskFinisher:checkTasks(self.player)
	end;
})

ApplyJoinAllianceHdr = Class:extends({
	init = function(self)
		self.checker = ApplyJoinAllianceChecker()
	end;
	
	handle = function(self, player, cmdtb)	
		self:_initParam(player, cmdtb)
		
		if not self.checker:isCan(self.player, self.alliance:getId()) then
			return false
		end
		
		if self:_existInApplyList() then
			WUtil:sendWarningMsgArgs(self.player, 100115, '')
			return false
		end
		
		if self:_isFullApplyList() then
			WUtil:sendWarningMsgArgs(self.player, 100110, '')
			return false
		end
		
		self:_addApplyJoin()
		
		return true;
	end;
	
	_initParam = function(self, player, cmdtb)
		self.player = player
		self.alliance = app:getAlliMgr():getAlliByName(Util:getString(cmdtb, 'name'))
	end;
	
	_existInApplyList = function(self)
		return self.alliance:getApplyRoleIdsSet():has(self.player:getRoleId())
	end;
	
	_isFullApplyList = function(self)
		return self.alliance:getApplyRoleIdsSet():isFull()
	end;	
	
	_addApplyJoin = function(self)
		self.alliance:getApplyRoleIdsSet():insert(self.player:getRoleId())
		self.player:setCurApplyAlliance(self.alliance:getName())
		AllianceSender:sendApplyListToLeaders(self.alliance)
		AllianceSender:sendCurApplying(self.player)
	end;
})

AgreeApplyJoinAllianceHdr = SelfAllianceOpBaseHdr:extends({
	init = function(self)
		self.addAllianceHdr = AddAllianceHdr(AgreeApplyJoinAllianceChecker())
	end;
	
	_getOpType = function(self)
		return ALLI_OP_TYPE.AGREEAPPLY
	end;
	
	_handle = function(self, cmdtb)
		local roleId = Util:getNumber(cmdtb, 'roleId')
		local applyer = app:getPlayerMgr():getOrLoadPlayerByRoleId( roleId )
		local ret = self.addAllianceHdr:handle(self.player, applyer, self.alliance:getId())
		self.alliance:getApplyRoleIdsSet():remove(roleId)
        AllianceSender:sendDeleteApply(self.player, roleId) 
		return ret
	end;
})

IgnoreApplyJoinAllianceHdr = SelfAllianceOpBaseHdr:extends({
	_getOpType = function(self)
		return ALLI_OP_TYPE.IGNOREAPPLY
	end;
	
	_handle = function(self, cmdtb)
		local roleId = Util:getNumber(cmdtb, 'roleId')
		self.alliance:getApplyRoleIdsSet():remove(roleId)
		AllianceSender:sendDeleteApply(self.player, roleId)
		return true
	end;
})

GetCurApplyingAllianceHdr = Class:extends({
	handle = function(self, player)
		AllianceSender:sendCurApplying(player)
	end;
})

GetAllianceDetailHdr = Class:extends({
	handle = function(self, player, cmdtb)
		alliance = app:getAlliMgr():getAlliByName( Util:getString(cmdtb, 'name') )
		if alliance:getId() == 0 then
			WUtil:sendWarningMsgArgs(player, 100116, '')
			return false
		end
		
		AllianceSender:sendAllianceDetail(player, alliance)
		return true
	end;
})

GetInviteListAllianceHdr = Class:extends({
	handle = function(self, player)
		AllianceSender:sendGetInviteList(player)
	end;
})

AddAllianceHdr = Class:extends({
	init = function(self, checker)
		self.checker = checker
	end;
	
	handle = function(self, operator, target, allianceId)
		self:_initParam(operator, target, allianceId)
		
		if not self.checker:isCan(self.operator, self.target, self.alliance:getId()) then
			return false
		end
		
		self:_addAlliance()
		return true
	end;
	
	_initParam = function(self, operator, target, allianceId)
		self.operator = operator
		self.target = target
		self.alliance = app:getAlliMgr():getAlliById(allianceId)
	end;
	
	_addAlliance = function(self)
		self.target:setAlliId(self.alliance:getId())
		
		local member = AllianceMember()
		member:setId(self.target:getRoleId())
		member:setAlliPos(ALLI_POS.MEM)
		self.alliance:addMember(member)
		
		app:getAlliMgr():saveAlliance(self.alliance)
		RoleBaseSender:send(self.target, {'alliance'})
		AllianceSender:sendSelfAllianceDetail(self.operator, self.alliance)
		TaskFinisher:checkTasks(self.target)
	end;
})

InviteAllianceMemberHdr = SelfAllianceOpBaseHdr:extends({
	init = function(self)
		self.checker = InviteAllianceMemberChecker()
	end;
	
	_handle = function(self, cmdtb)
		self.target = app:getPlayerMgr():getOrLoadPlayerByRoleName( Util:getString(cmdtb, 'role') )
		if not self.checker:isCan(self.player, self.target, self.alliance:getId()) then
			return false
		end
	
		self:_invite()
		return true
	end;
	
	_getOpType = function(self)
		return ALLI_OP_TYPE.INVITE
	end;
	
	_invite = function(self)
		local invites = self.target:getInviteJoinAlliances()
		invites:insert({allianceId=self.alliance:getId(), roleId=self.target:getRoleId()})
		WUtil:sendSuccMsgArgs(self.player, 100127, '')
		AllianceSender:sendGetInviteList(self.target)
	end;
})

ReponseInviteAllianceHdr = Class:extends({
	removeFromInviteSet = function(self, player, allianceId)
		player:getInviteJoinAlliances():remove(allianceId)
		AllianceSender:sendDeleteInvite(player, allianceId)	
	end;
})

AgreeInviteAllianceHdr = ReponseInviteAllianceHdr:extends({
	init = function(self)
		self.addAllianceHdr = AddAllianceHdr(AgreeInviteAllianceChecker())
	end;
	
	handle = function(self, player, cmdtb)
		local allianceId = Util:getNumber(cmdtb, 'alliId')
		local ret = self.addAllianceHdr:handle(player, player, allianceId)
		self:removeFromInviteSet(player, allianceId)
		return ret
	end;
})

IgnoreInviteAllianceHdr = ReponseInviteAllianceHdr:extends({
	handle = function(self, player, cmdtb)
		local allianceId = Util:getNumber(cmdtb, 'alliId')
		self:removeFromInviteSet(player, allianceId)
	end;
})

PageCalculator = Class:extends({
	getPageCntAndPageNo = function(self, itemCount, pageItemCount, rawPageNo)
		local pageCnt = math.ceil(itemCount/pageItemCount)
		local pageNo = math.clamp(rawPageNo, 1, pageCnt)
		return pageCnt, pageNo
	end;
	
	getPageRange = function(self, pageItemCount, pageNo)
		local pageIdx = pageNo - 1
		local startIdx = pageIdx*pageItemCount
		local endIdx = startIdx + pageItemCount - 1
		return {startIdx=startIdx, endIdx=endIdx}
	end;
}):new()

GetAllianceListHdr = Class:extends({
	init = function(self)
		self.pageItemCount = 12
	end;
	
	handle = function(self, player, cmdtb)
		local cityResId = Util:getNumber(cmdtb, 'cityResId')
		if cityResId == 0 then
			self:_sendAllAlliances(cityResId, player, cmdtb)
		else
			self:_sendAlliancesFromCountry(cityResId, player, cmdtb)
		end
	end;
	
	_sendAllAlliances = function(self, cityResId, player, cmdtb)
		local pageCnt = Service:getAllianceRank():getPageCount(self.pageItemCount)
		local pageNo = Util:getNumber(cmdtb, 'pageNo')
		local ranks = Service:getAllianceRank():selectRanks(pageNo, self.pageItemCount)
		local alliances = {}
		for _, rank in ipairs(ranks) do
			local alliance = app:getAlliMgr():getAlliById(rank.id)
			table.insert(alliances, alliance)
		end		
		local curSelIdx = Util:getNumber(cmdtb, 'curSelIdx', -1)
		AllianceSender:sendAlliances(player, cityResId, alliances, (pageNo-1)*self.pageItemCount, pageCnt, pageNo, curSelIdx, ranks)	
	end;
	
	_sendAlliancesFromCountry = function(self, cityResId, player, cmdtb)
		local count = app:getAlliMgr():getSortAlliCount(cityResId)
		local pageCnt, pageNo = PageCalculator:getPageCntAndPageNo(count, self.pageItemCount, Util:getNumber(cmdtb, 'pageNo'))
		
		local alliances = {}
		local range = PageCalculator:getPageRange(self.pageItemCount, pageNo)
		for i=range.startIdx, range.endIdx, 1 do
			local alliance = app:getAlliMgr():getSortAlliBy(cityResId, i)
			table.insert(alliances, alliance)
		end
		
		local curSelIdx = Util:getNumber(cmdtb, 'curSelIdx', -1)
		AllianceSender:sendAlliances(player, cityResId, alliances, (pageNo-1)*self.pageItemCount, pageCnt, pageNo, curSelIdx)	
	end;
})

SearchAllianceHdr = Class:extends({
	init = function(self)
		self.pageItemCount = 12
		self.getAllianceListHdr = GetAllianceListHdr()
	end;
	
	handle = function(self, player, cmdtb)
		local cityResId = Util:getNumber(cmdtb, 'cityResId')
		local name = Util:getString(cmdtb, 'name')
		local alliance = app:getAlliMgr():getAlliByName(name)
		
		if not self:_isValidAlliance(alliance, cityResId) then
			WUtil:sendWarningMsgArgs(player, self:_getMsgTipId(cityResId), '')
			return
		end
		
		local idx = self:_findInSortListIdx(cityResId, alliance:getName())
		if idx < 0 then
			WUtil:sendWarningMsgArgs(player, self:_getMsgTipId(cityResId), '')
			return
		end
		
		local pageNo = math.floor(idx/self.pageItemCount) + 1
		local curSelIdx = idx%self.pageItemCount
		self.getAllianceListHdr:handle(player, {cityResId=cityResId, pageNo=pageNo, curSelIdx=curSelIdx})
	end;
	
	_getMsgTipId = function(self, cityResId)
		if cityResId == 0 then
			return 100116
		else
			return 100117
		end
	end;
	
	_isValidAlliance = function(self, alliance, cityResId)
		if alliance:getId() == 0 then -- alliance is empty
			return false
		end
		
		if cityResId == 0 then -- find in all sort alliances
			return true
		end
		
		return alliance:getCityResId() == cityResId
	end;
	
	_findInSortListIdx = function(self, cityResId, findName)
		if cityResId == 0 then
			return Service:getAllianceRank():getIdxByName(findName)
		else
			return self:_findInSortListIdxFromCountry(cityResId, findName)
		end
	end;
	
	_findInSortListIdxFromCountry = function(self, cityResId, findName)
		local count = app:getAlliMgr():getSortAlliCount(cityResId)
		for i=0, count-1, 1 do
			local alliance = app:getAlliMgr():getSortAlliBy(cityResId, i)
			if alliance:getName() == findName then
				return i
			end
		end
		return -1
	end;
})

BaseGetAllianceMemsHdr = Class:extends({
	init = function(self)
		self.pageItemCount = 12
	end;
	
	handle = function(self, player, cmdtb)
		local alliance = self:_getAlliance(player, cmdtb)
		if alliance:isNull() then
			return 
		end
		
		local memCount = alliance:getMemberCount()
		local pageCnt, pageNo = PageCalculator:getPageCntAndPageNo(memCount, self.pageItemCount, Util:getNumber(cmdtb, 'pageNo'))
		
		local sortMems = self:_sortMembers(self:_collectAllMems(alliance))
		local range = PageCalculator:getPageRange(self.pageItemCount, pageNo)
		local mems = self:_collectCurPageMems(sortMems, range)
		
		self:_sendMsg(player, alliance, mems, pageCnt, pageNo)
	end;
	
	_collectCurPageMems = function(self, sortMems, range)
		local mems = {}
		for i=range.startIdx, range.endIdx, 1 do
			local mem = sortMems[i+1]
			table.insert(mems, mem)
		end
		return mems
	end;	
	
	_collectAllMems = function(self, alliance)
		local allMems = {}
		local memCount = alliance:getMemberCount()
		for i=0, memCount-1, 1 do
			table.insert(allMems, alliance:getMemberByIdx(i))
		end
		return allMems
	end;	
	
	_sortMembers = function(self, allMems)
		local sortFunc = function(a, b)
			return a:getAlliPos() > b:getAlliPos()
		end
		table.sort(allMems, sortFunc)
		return allMems
	end;
})

GetSelfAllianceMemsHdr = BaseGetAllianceMemsHdr:extends({
	_getAlliance = function(self, player, cmdtb)
		return  app:getAlliMgr():getAlliById(player:getAlliId())
	end;
	
	_sendMsg = function(self, player, alliance, mems, pageCnt, pageNo)
		AllianceSender:sendSelfAlliMems(player, alliance, mems, pageCnt, pageNo)
	end;
})

GetTodaySortMemsHdr = BaseGetAllianceMemsHdr:extends({
	_getAlliance = function(self, player, cmdtb)
		return  app:getAlliMgr():getAlliById(player:getAlliId())
	end;
	
	_collectAllMems = function(self, alliance)
		local allMems = {}
		local memCount = alliance:getMemberCount()
		for i=0, memCount-1, 1 do
			local mem = alliance:getMemberByIdx(i)
			if mem:getTodayRes() > 0 or mem:getTodayCard() > 0 then
				table.insert(allMems, alliance:getMemberByIdx(i))
			end
		end
		return allMems
	end;	
	
	_sortMembers = function(self, allMems)
		local sortFunc = function(a, b)
			return (a:getTodayRes() + a:getTodayCard()*100) > (b:getTodayRes() + b:getTodayCard()*100)
		end
		table.sort(allMems, sortFunc)
		return allMems
	end;
	
	_sendMsg =  function(self, player, alliance, mems, pageCnt, pageNo)
		AllianceSender:sendTodaySortMems(player, alliance, mems, pageCnt, pageNo)
	end;	
})

GetAllSortMemsHdr = BaseGetAllianceMemsHdr:extends({
	_getAlliance = function(self, player, cmdtb)
		return  app:getAlliMgr():getAlliById(player:getAlliId())
	end;
	
	_sortMembers = function(self, allMems)
		local sortFunc = function(a, b)
			return (a:getTotalRes() + a:getTotalCard()*100) > (b:getTotalRes() + b:getTotalCard()*100)
		end
		table.sort(allMems, sortFunc)
		return allMems
	end;
	
	_sendMsg =  function(self, player, alliance, mems, pageCnt, pageNo)
		AllianceSender:sendAllSortMems(player, alliance, mems, pageCnt, pageNo)
	end;
})


GetOtherAllianceMemsHdr = BaseGetAllianceMemsHdr:extends({
	_getAlliance = function(self, player, cmdtb)
		return app:getAlliMgr():getAlliByName( Util:getString(cmdtb, 'name') )
	end;
	
	_sendMsg = function(self, player, alliance, mems, pageCnt, pageNo)
		AllianceSender:sendOtherAlliMems(player, alliance, mems, pageCnt, pageNo)
	end;
})


GetMyAllianceDetailHdr = SelfAllianceOpBaseHdr:extends({
	_handle = function(self, cmdtb)
		AllianceSender:sendSelfAllianceDetail(self.player, self.alliance)
		AllianceSender:sendSelfMember(self.player, self.alliance)
		AllianceSender:sendSelfLawLight(self.player, self.alliance)
		local member = self.alliance:getMemberById(self.player:getRoleId())
		if member:getAlliPos() ~= ALLI_POS.MEM then
			AllianceSender:sendApplyListToPlayer(self.player, self.alliance)
		end
		return true
	end;
})

UpgradeAllianceHdr = SelfAllianceOpBaseHdr:extends({
	_handle = function(self, cmdtb)
		if not self:_isValidState() then
			return false
		end
		
		self:_upgrade()
		return true
	end;
	
	_getOpType = function(self)
		return ALLI_OP_TYPE.UPGRADE
	end;
	
	_isValidState = function(self)
		if self.alliance:isFullLevel() then
			return false
		end
		
		if self.alliance:getBuildVal() < self.alliance:getUpgradeNeedBuildVal() then
			return false
		end
		
		if self.alliance:isUpgrading() then
			WUtil:sendWarningMsgArgs(self.player, 100122, '')
			return false 
		end
		
		return true
	end;
	
	_upgrade = function(self)
		self.alliance:setBuildVal( self.alliance:getBuildVal() - self.alliance:getUpgradeNeedBuildVal() )
		self.alliance:setUpgradeStartTime( Util:getTime() )
		self.alliance:setUpgradeStopTime( Util:getTime() + self.alliance:getUpgradeNeedTime() )
		
		AllianceSender:sendSelfAllianceDetail(self.player, self.alliance)
	end;
})



DismissAllianceHdr = SelfAllianceOpBaseHdr:extends({
	_handle = function(self, cmdtb)
		if not self:_isValidState() then
			return false
		end
		
		self:_dismiss()
		return true	
	end;
	
	_getOpType = function(self)
		return ALLI_OP_TYPE.DISMISS
	end;
	
	_isValidState = function(self)
		if self.alliance:isDismissing() then
			return false 
		end
		
		if self.alliance:isTransfering() then
			return false 
		end
		
		return true
	end;
	
	_dismiss = function(self)
		self.alliance:setDismissStartTime(Util:getTime())
		AllianceSender:sendSelfAllianceDetail(self.player, self.alliance)
	end;
})

CancelDismissAllianceHdr = SelfAllianceOpBaseHdr:extends({
	_handle = function(self, cmdtb)
		if not self:_isValidState(player) then
			return false
		end
		
		self:_cancelDismiss()
		return true	
	end;
	
	_getOpType = function(self)
		return ALLI_OP_TYPE.CANCELDISMISS
	end;
	
	_isValidState = function(self, player)
		if not self.alliance:isDismissing() then 
			return false
		end
		
		return true
	end;
	
	_cancelDismiss = function(self)
		self.alliance:setDismissStartTime(0)
		AllianceSender:sendSelfAllianceDetail(self.player, self.alliance)
	end;	
})

ExitAllianceHdr = SelfAllianceOpBaseHdr:extends({
	_getOpType = function(self)
		return ALLI_OP_TYPE.EXIT
	end;
	
	_handle = function(self, player)
		if not self:_isValidAlliPos(player) then
			return false
		end
		
		self:_exitAlliance()
		return true
	end;
	
	_isValidAlliPos = function(self)
		return self.member:getAlliPos() < ALLI_POS.LEADER 
	end;
	
	_exitAlliance = function(self)
		if self.alliance:getTransferTarget() == self.player:getRoleName() then
			self.alliance:setTransferStartTime(0)
			self.alliance:setTransferTarget('')
		end
		
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=12*3600, effect={id=RES_EFF.EXIT_ALLIANCE,val=0,unit=0}}
		local creator = {type=0,id=0,skillId=0}
		self.player:getStateContainer():appendState(stateRes, creator)
		self.player:exitAlliance(self.member)
		self.alliance:removeMemberById(self.player:getRoleId())
		RoleBaseSender:send(self.player, {'alliance'})
	end;
})

ModifyAllianceInfoBase = SelfAllianceOpBaseHdr:extends({
	_getOpType = function(self)
		return ALLI_OP_TYPE.MODIFY
	end;
	
	_handle = function(self, cmdtb)
		if not self:_isValidModifyInfo(cmdtb) then
			return false
		end
		
		self:_modify()
		self:_sendMsg()
		
		return true
	end;
	
	_isValidModifyInfo = function(self)
	end;
	
	_modify = function(self)
	end;
	
	_sendMsg = function(self)
		AllianceSender:sendSelfAllianceDetail(self.player, self.alliance)
	end;
})

ModifyQQGroupHdr = ModifyAllianceInfoBase:extends({
	_isValidModifyInfo = function(self, cmdtb)
		self.qqGroup = Util:getNumber(cmdtb, 'qq')
		return self.qqGroup <= MAX_QQ_GROUP
	end;
	
	_modify = function(self)
		self.alliance:setQQGroup(self.qqGroup)
	end;
})

ModifyAllianceIntroducHdr = ModifyAllianceInfoBase:extends({
	_isValidModifyInfo = function(self, cmdtb)
		self.introduce = Util:getString(cmdtb, 'introduce')
		return string.len(self.introduce) <= MAX_ALLI_INTRODUCE_LEN
	end;
	
	_modify = function(self)
		self.alliance:setIntroduction(self.introduce)
	end;
})

ModifyAllianceBulletinHdr = ModifyAllianceInfoBase:extends({
	_isValidModifyInfo = function(self, cmdtb)
		self.bulletin = Util:getString(cmdtb, 'bulletin')
		return string.len(self.bulletin) <= MAX_ALLI_BULLETIN_LEN
	end;
	
	_modify = function(self)
		self.alliance:setBulletin(self.bulletin)
	end;
})

GainAllianceTodayGiftHdr = SelfAllianceOpBaseHdr:extends({
	_getOpType = function(self)
		return ALLI_OP_TYPE.GAIN
	end;
	
	_handle = function(self, player)
		if not self:_isValid(player) then
			return false
		end
		
		self:_gain()
		
		return true
	end;
	
	_isValid = function(self)
		if self.member:getGainGiftCount() > 0 then
			return false
		end
		
		if self.member:getContributes() < self.alliance:getGainNeedContribute() then
			WUtil:sendWarningMsgArgs(self.player, 100128, '')
			return false 
		end
		
		local effector = EffectorMgr:getEffector(self:_makeDropEffect())
		if not effector:isCanExec(self.player, 1, self:_makeDropEffect(), {}) then
			return false
		end
		
		return true
	end;
	
	_gain = function(self)
		local effector = EffectorMgr:getEffector(self:_makeDropEffect())
		effector:exec(self.player, 1, self:_makeDropEffect(), {})
		
		local member = self.alliance:getMemberById(self.player:getRoleId())
		member:setContributes( member:getContributes() - self.alliance:getGainNeedContribute() )
		member:setGainGiftCount( {count=1, lastTime=Util:getTime()} )
		
		AllianceSender:sendSelfMember(self.player, self.alliance)
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.GET_ALLI_GIFT)
	end;
	
	_makeDropEffect = function(self)
		return {id=RES_EFF.DROPITEM, val=self.alliance:getGainDropId()}
	end;
})

UpgradeLawLightHdr = SelfAllianceOpBaseHdr:extends({
	_getOpType = function(self)
		return ALLI_OP_TYPE.UPGRADE_LAWLIGHT
	end;
	
	_handle = function(self, player)
		if not self:_isValid(player) then
			return false
		end
		
		self:_upgrade()
	
		return true
	end;
	
	_isValid = function(self, player)
		local lawLight = self.alliance:getLawLight()
		if lawLight:isFullLevel() then
			return false 
		end
		
		if  self.alliance:getBuildVal() < lawLight:getUpgradeNeedBuildVal()
			or self.alliance:getCardNumber() < lawLight:getUpgradeNeedCard() then
			return false
		end
		
		return true
	end;
	
	_upgrade = function(self)
		local lawLight = self.alliance:getLawLight()
		self.alliance:setBuildVal(self.alliance:getBuildVal() - lawLight:getUpgradeNeedBuildVal() )
		self.alliance:setCardNumber(self.alliance:getCardNumber() - lawLight:getUpgradeNeedCard() )
		lawLight:setLevel(self.alliance:getLawLight():getLevel() + 1)
		self.alliance:addHonour(200)
		app:getAlliMgr():addAllianceEvent(self.alliance, 'upgradeLawLight', {level=lawLight:getLevel(), addHonour=200})
		
		AllianceSender:sendSelfAllianceDetail(self.player, self.alliance)
		AllianceSender:sendSelfLawLight(self.player, self.alliance)
		WUtil:sendSuccMsgArgs(self.player, 100130, '')	
	end;
})

LawLightBestowHdr = SelfAllianceOpBaseHdr:extends({
	_getOpType = function(self)
		return ALLI_OP_TYPE.BESTOW_LAWLIGHT
	end;
	
	_handle = function(self, cmdtb)
		if not self:_isValid() then
			return false
		end
		
		self:_bestow()
		return true
	end;
	
	_isValid = function(self, player)
		if not self.alliance:getLawLight():isFullGrowupVal() then
			return false
		end
		
		local effector = EffectorMgr:getEffector(self:_makeDropEffect())
		if not effector:isCanExec(self.player, 1, self:_makeDropEffect(), {}) then
			return false
		end
		
		return true
	end;
	
	_bestow = function(self)
		self.alliance:getLawLight():setGrowupVal(0)
		self:_dropItemsToMembers()
		self:_addHonour()
	end;
	
	_dropItemsToMembers = function(self)
		local effector = EffectorMgr:getEffector(self:_makeDropEffect())
		local memCount = self.alliance:getMemberCount()
		for i=0, memCount-1, 1 do
			local mem = self.alliance:getMemberByIdx(i)
			local memPlayer = app:getPlayerMgr():getOnlinePlayerByRoleId(mem:getId())
			if memPlayer ~= nil then
				effector:exec(memPlayer, 1, self:_makeDropEffect(), {})
			end
		end
	end;
	
	_addHonour = function(self)
		self.alliance:addHonour(200)
		app:getAlliMgr():addAllianceEvent(self.alliance, 'lawLightBestow', {addHonour=200} )
	end;
	
	_makeDropEffect = function(self)
		return {id=RES_EFF.PASSIVITY_DROPITEM, val=self.alliance:getLawLight():getBestowDropId()}
	end;
})

LawLightFeedHdr = SelfAllianceOpBaseHdr:extends({
	_getOpType = function(self)
		return ALLI_OP_TYPE.FEED_LAWLIGHT
	end;
	
	_handle = function(self, cmdtb)
		local canFeedCount = self:_getCanFeedCount(cmdtb)
		if canFeedCount == 0 then
			return false
		end
		
		local effector = EffectorMgr:getEffector(self:_makeDropEffect())
		if not effector:isCanExec(self.player, canFeedCount, self:_makeDropEffect(), {}) then
			return false
		end
		
		effector:exec(self.player, canFeedCount, self:_makeDropEffect(), {})
		
		local lawLight = self.alliance:getLawLight()
		lawLight:setGrowupVal(lawLight:getGrowupVal() + canFeedCount)
		self.member:setContributes(self.member:getContributes() - lawLight:getFeedNeedContribute()*canFeedCount)
		self.member:setFeedCount({lastTime=Util:getTime(), count=self.member:getFeedCount() + canFeedCount})
		
		AllianceSender:sendSelfMember(self.player, self.alliance)
		AllianceSender:sendSelfLawLight(self.player, self.alliance)
		
		for i=1, canFeedCount do
			TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.FEED_LIGHTLAW)
		end
		
		return true
	end;
	
	_getCanFeedCount = function(self, cmdtb)
		local lawLight = self.alliance:getLawLight()
		local countByContributes = math.floor(self.member:getContributes()/lawLight:getFeedNeedContribute())
		local factFeedMaxCount = lawLight:getCanFeedMaxCount() + self.player:getVipEffectVal(VIP_EFF.ADD_LAWLIGHTFEED_TIMES)
		local countByLeft = factFeedMaxCount - self.member:getFeedCount()
		local count = math.min(countByContributes, countByLeft)
		
		local isAll = Util:getNumber(cmdtb, 'isAll')
		if isAll == 0 then
			return math.min( count, 1 )
		else
			return count
		end
	end;
	
	_makeDropEffect = function(self)
		return {id=RES_EFF.DROPITEM, val=self.alliance:getLawLight():getFeedDropId()}
	end;
})

GetALeadersHdr = SelfAllianceOpBaseHdr:extends({
	_getOpType = function(self)
		return ALLI_OP_TYPE.GET_ALEADER
	end;
	
	_handle = function(self, cmdtb)
		AllianceSender:sendALeaders(self.player, self.alliance)
		return true
	end;
})

TransferLeaderAllianceHdr = SelfAllianceOpBaseHdr:extends({
	_getOpType = function(self)
		return ALLI_OP_TYPE.TRANSFER
	end;
	
	_handle = function(self, cmdtb)
		local targetName = Util:getString(cmdtb, 'role')
		local targetId = app:getCityMgr():getRoleIdByRoleName(targetName)
		if targetId < 0 then
			return false
		end
		
		local targetMember = self.alliance:getMemberById( targetId )
		if targetMember == nil then
			return false
		end
		
		if targetMember:getAlliPos() ~= ALLI_POS.ALEADER then
			return false 
		end
		
		if self.alliance:isTransfering() then
			return false
		end
		
		if self.alliance:isDismissing() then
			return false
		end
		
		self:_setTransferStart(targetName)
		self:_sendMailToTarget(targetName)
		self:_sendMsgs(targetId)
		
		return true
	end;
	
	_setTransferStart = function(self, targetName)
		self.alliance:setTransferStartTime(Util:getTime()) 
		self.alliance:setTransferTarget(targetName)
	end;
	
	_sendMailToTarget = function(self, targetName)
		local content = string.format(rstr.mail.content.transferingLeader, self.player:getRoleName())
		self.mail = app:getMailMgr():addSysMail(targetName, rstr.mail.title.transferLeader, FIXID.COMM_SYS_MAILTEMP, content, nil)
	end;
	
	_sendMsgs = function(self, targetId)
		local target = app:getPlayerMgr():getOnlinePlayerByRoleId(targetId)
		if target ~= nil then
			MailSender:sendBriefMail(target, self.mail)
			AllianceSender:sendSelfAllianceDetail(target, self.alliance)
		end
		AllianceSender:sendSelfAllianceDetail(self.player, self.alliance)	
	end;
})

CancelTransferAllianceHdr = SelfAllianceOpBaseHdr:extends({
	_getOpType = function(self)
		return ALLI_OP_TYPE.CANCEL_TRANSFER
	end;
	
	_handle = function(self, cmdtb)
		if not self.alliance:isTransfering() then
			return false
		end
		
		self.alliance:setTransferStartTime(0)
		AllianceSender:sendSelfAllianceDetail(self.player, self.alliance)	
		
		return true 
	end;
})

CommResContributeOp = Class:extends({
	init = function(self)
		self.ops = {
			[0] = {get='getFood', sub='subFood'},
			[1] = {get='getWood', sub='subWood'},
			[2] = {get='getStone', sub='subStone'},
			[3] = {get='getIron', sub='subIron'}, }
	end;
	
	hasEnoughTimes = function(self, player, resIdx, times)
		local op = self.ops[resIdx]
		local res = player:getCityRes()
		local canTimes = math.floor(res[op.get](res)/10000)
		return times <= canTimes
	end;
	
	sub = function(self, player, resIdx, times)
		local op = self.ops[resIdx]
		local res = player:getCityRes()
		res[op.sub](res, times*10000)
	end;
	
	add = function(self, player, alliance, member, times)
		alliance:setBuildVal(alliance:getBuildVal() + times)
		member:setContributes(member:getContributes() + times)
		WUtil:sendPopBoxMsg(player, string.format(rstr.alliance.events.resContribute, times, times))
		member:setLastRes({lastTime=Util:getTime(), val=member:getTodayRes() + times})
		member:setTotalRes( member:getTotalRes() + times )
	end;
}):new()

CardContributeOp = Class:extends({
	hasEnoughTimes = function(self, player, resIdx, times)
		return SubItemHdr:hasEnoughNumber(player, 0, FIXID.ALLI_CARD, times)
	end;
	
	sub = function(self, player, resIdx, times)
		SubItemHdr:subItem(player, 0, FIXID.ALLI_CARD, times)
	end;
	
	add = function(self, player, alliance, member, times)
		member:setContributes(member:getContributes() + times*100)
		WUtil:sendPopBoxMsg(player, string.format(rstr.alliance.events.cardContribute, times, times*100))
		member:setLastCard({lastTime=Util:getTime(), val=member:getTodayCard() + times})
		member:setTotalCard( member:getTotalCard() + times )	
		alliance:setCardNumber(alliance:getCardNumber() + times)
	end;
}):new()

NullContributeOp = Class:extends({
	hasEnoughTimes = function(self, player, resIdx, times) 
		return false
	end;
	
	sub = function(self, player, resIdx, times)
	end;
	
	add = function(self, player, alliance, member, times)
	end;
}):new()

ContributeAllianceResHdr = SelfAllianceOpBaseHdr:extends({
	_getOpType = function(self)
		return ALLI_OP_TYPE.CONTRIBUTE_RES
	end;
	
	_handle = function(self, cmdtb)
		local resIdx = Util:getNumber(cmdtb, 'resIdx')
		local op = self:_getOpByResIdx(resIdx)
		
		local times = Util:getNumber(cmdtb, 'times')
		if times <= 0 then 
			return false 
		end
		
		if not op:hasEnoughTimes(self.player, resIdx, times) then
			return false
		end
		
		op:sub(self.player, resIdx, times)
		op:add(self.player, self.alliance, self.member, times)
		TaskFinisher:trigerTask(self.player, TASK_FINISH_TYPE.GET_ALLICONTRI_BYCOMMITRES, times)
		
		self:_sendMsgs()

		return true
	end;
	
	_getOpByResIdx = function(self, resIdx)
		if resIdx >= 0 and resIdx < 4 then
			return CommResContributeOp
		elseif resIdx == 4 then
			return CardContributeOp
		else 
			return NullContributeOp
		end
	end;
	
	_sendMsgs = function(self)
		local leaderMember = AllianceUtil:searchLeader(self.alliance)
		local leader = app:getPlayerMgr():getOnlinePlayerByRoleId(leaderMember:getId())
		if leader ~= nil  and leader ~= self.player then
			self:_sendAllianceMsgToPlayer(leader)
		end
		
		self:_sendAllianceMsgToPlayer(self.player)
		
		CommResSender:sendAll(self.player)	
	end;
	
	_sendAllianceMsgToPlayer = function(self, player)
		AllianceSender:sendSelfAllianceDetail(player, self.alliance)
		AllianceSender:sendSelfMember(player, self.alliance)
	end
})

AppointAlliMemberHdr = SelfAllianceOpBaseHdr:extends({
	_getOpType = function(self)
		return ALLI_OP_TYPE.APPOINT
	end;
	
	_handle = function(self, cmdtb)
		local appointAlliPos = Util:getNumber(cmdtb, 'alliPos')
		if appointAlliPos <= ALLI_POS.NONE then
			return false
		end
		
		if self.member:getAlliPos() <= appointAlliPos then
			return false
		end
		
		local targetName = Util:getString(cmdtb, 'role')
		local targetId = app:getCityMgr():getRoleIdByRoleName(targetName)
		local targetMember = self.alliance:getMemberById(targetId)
		if targetMember == nil then
			return false
		end
		
		if self.member:getAlliPos() <= targetMember:getAlliPos() then
			return false
		end
		
		if targetMember:getAlliPos() == appointAlliPos then
			return false
		end
		
		if self:_isFullPosition(appointAlliPos)  and  targetMember:getAlliPos() < appointAlliPos then
			WUtil:sendWarningMsgArgs(self.player, 100175, '' )
			return false
		end
		
		targetMember:setAlliPos(appointAlliPos)
		app:getAlliMgr():addAllianceEvent(self.alliance, 'changeAlliPos', {roleId=targetMember:getId(), alliancePos=appointAlliPos})
		WUtil:sendSuccMsgArgs( self.player, 100131, '' )
		self:_sendMailToTarget(targetName, appointAlliPos)
		self:_sendMsgsToTarget(targetId)

		return true
	end;
	
	_sendMailToTarget = function(self, targetName, appointAlliPos)
		local content = string.format(rstr.mail.content.appointAlliPos, rstr.alliance.alliPoss[appointAlliPos])
		self.mail = app:getMailMgr():addSysMail(targetName, rstr.mail.title.appointAlliPos, FIXID.COMM_SYS_MAILTEMP, content, nil)
	end;
	
	_sendMsgsToTarget = function(self, targetId)
		local target = app:getPlayerMgr():getOnlinePlayerByRoleId(targetId)
		if target ~= nil then
			MailSender:sendBriefMail(target, self.mail)
			AllianceSender:sendSelfMember(target, self.alliance)
		end	
	end;
	
	_isFullPosition = function(self, appointAlliPos)
		if appointAlliPos == ALLI_POS.ALEADER then
			return self:_getMemCountByPos(appointAlliPos) >= 2
		elseif appointAlliPos == ALLI_POS.ELDER then
			return self:_getMemCountByPos(appointAlliPos) >= (self.alliance:getLevel() + 2)
		else
			return false
		end
	end;
	
	_getMemCountByPos = function(self, pos)
		local retcnt = 0
		local cnt = self.alliance:getMemberCount()
		for i=0, cnt-1, 1 do
			local mem = self.alliance:getMemberByIdx(i)
			if mem:getAlliPos() == pos then
				retcnt = retcnt + 1
			end
		end
		return retcnt
	end;
})

FireAlliMemberHdr = SelfAllianceOpBaseHdr:extends({
	_getOpType = function(self)
		return ALLI_OP_TYPE.FIREMEM
	end;
	
	_handle = function(self, cmdtb)
		local targetName = Util:getString(cmdtb, 'role')
		local targetId = app:getCityMgr():getRoleIdByRoleName(targetName)
		local targetMember = self.alliance:getMemberById(targetId)
		if targetMember == nil then
			return false
		end
		
		if self.member:getAlliPos() <= targetMember:getAlliPos() then
			return false
		end
		
		if self.member:isTodayFireFull() then
			WUtil:sendWarningMsgArgs( self.player, 100139, '' )
			return false
		end;
		
		self:_fireTarget(targetName, targetMember)
		self:_sendMsgToTarget()
		self:_sendMsgsToOperator()
		
		return true
	end;
	
	_fireTarget = function(self, targetName, targetMember)
		self.target = app:getPlayerMgr():getOrLoadPlayerByRoleName( targetName )
		self.target:exitAlliance(targetMember)
		self.alliance:removeMemberById(targetMember:getId())
		local stateRes = {type=EFFECT_TYPE.PERDURE, duration=24*3600, effect={id=RES_EFF.EXIT_ALLIANCE,val=0,unit=0}}
		local creator = {type=0,id=0,skillId=0}
		self.target:getStateContainer():appendState(stateRes, creator)	
		self.member:addTodayFireCount()
	end;
	
	_sendMsgToTarget = function(self)
		local mail = app:getMailMgr():addSysMail(self.target:getRoleName(), rstr.mail.title.fireAlliMem, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.fireAlliMem, nil)
		MailSender:sendBriefMail(self.target, mail)
		RoleBaseSender:send(self.target, {'alliance'})	
	end;
	
	_sendMsgsToOperator = function(self)
		WUtil:sendSuccMsgArgs(self.player, 100132, '' )
		AllianceSender:sendSelfAllianceDetail(self.player, self.alliance)	
	end;
})

GetAllianceEventsHdr = SelfAllianceOpBaseHdr:extends({
	init = function(self)
		self.pageItemCount = 12
	end;
	
	_getOpType = function(self)
		return ALLI_OP_TYPE.GET_EVENTS
	end;
	
	_handle = function(self, cmdtb)
		local eventsCount = self.alliance:getEventsCount()
		local pageCnt, pageNo = PageCalculator:getPageCntAndPageNo(eventsCount, self.pageItemCount, Util:getNumber(cmdtb, 'pageNo'))
		local range = PageCalculator:getPageRange(self.pageItemCount, pageNo)

		local events = {}
		for i=range.startIdx, range.endIdx, 1 do
			local event = self.alliance:getEventByIdx(i)
			table.insert(events, event)
		end
		
		AllianceSender:sendAlliEvents(self.player, events, pageCnt, pageNo)
		return true
	end;
})

GetApplyAllianceMergesHdr = SelfAllianceOpBaseHdr:extends({
	_getOpType = function(self)
		return ALLI_OP_TYPE.GET_APPLYMERGES
	end;
	
	_handle = function(self, cmdtb)
		AllianceSender:sendApplyMerges(self.player, self.alliance)
		return true
	end;
})

BaseMergeAllianceChecker = Class:extends({
	isCan = function(self)
		return false
	end;
	
	sortAlliancesByDesc = function(self, targetAlliance)
		local maxAlliance = self.alliance
		local minAlliance = targetAlliance
		if AllianceUtil:compareAlliance(targetAlliance, self.alliance) then
			maxAlliance = targetAlliance
			minAlliance = self.alliance
		end
		return maxAlliance, minAlliance
	end;
	
	_setParams = function(self, player, alliance)
		self.player = player
		self.alliance = alliance
	end;
	
	_isBeyondMaxMemberWhenMerge = function(self, maxAlliance, minAlliance)
		local sumCount = maxAlliance:getMemberCount() + minAlliance:getMemberCount()
		local memMaxCount = maxAlliance:getMaxMember()
		return sumCount > memMaxCount
	end;	
})

ApplyMergeAllianceChecker = BaseMergeAllianceChecker:extends({
	isCan = function(self, player, alliance, targetAlliance)
		self:_setParams(player, alliance)
		
		if targetAlliance:isNull() then
			WUtil:sendWarningMsgArgs( self.player, 100111, '' )
			return false
		end
		
		if targetAlliance:getId() == self.alliance:getId() then
			WUtil:sendWarningMsgArgs( self.player, 100140, '' )
			return false
		end
		
		if targetAlliance:getCityResId() ~= self.alliance:getCityResId() then
			WUtil:sendWarningMsgArgs( self.player, 100141, '' )
			return false
		end
		
		if targetAlliance:getApplyMergesSet():isFull() then
			WUtil:sendWarningMsgArgs( self.player, 100142, '' )
			return false
		end
		
		if targetAlliance:getApplyMergesSet():has(self.alliance:getId()) then
			WUtil:sendWarningMsgArgs( self.player, 100144, '' )
			return false
		end
		
		local maxAlliance, minAlliance = self:sortAlliancesByDesc(targetAlliance)
		if self:_isBeyondMaxMemberWhenMerge(maxAlliance, minAlliance) then
			WUtil:sendWarningMsgArgs( self.player, 100143, '' )
			return false
		end

		return true
	end;
})

AgreeMergeAllianceChecker = BaseMergeAllianceChecker:extends({
	isCan = function(self, player, alliance, targetAlliance)
		self:_setParams(player, alliance)
		
		if targetAlliance:isNull() then
			WUtil:sendWarningMsgArgs( self.player, 100111, '' )
			return false
		end
		
		if not self.alliance:getApplyMergesSet():has(targetAlliance:getId()) then
			WUtil:sendWarningMsgArgs( self.player, 100145, '' )
			return false
		end
		
		if targetAlliance:getCityResId() ~= self.alliance:getCityResId() then
			WUtil:sendWarningMsgArgs( self.player, 100141, '' )
			return false
		end
		
		local maxAlliance, minAlliance = self:sortAlliancesByDesc(targetAlliance)
		if self:_isBeyondMaxMemberWhenMerge(maxAlliance, minAlliance) then
			WUtil:sendWarningMsgArgs( self.player, 100143, '' )
			return false
		end
		
		return true	
	end;
})

ApplyMergeAllianceHdr = SelfAllianceOpBaseHdr:extends({
	init = function(self)
		self.checker =  ApplyMergeAllianceChecker()
	end;
	
	_getOpType = function(self)
		return ALLI_OP_TYPE.APPLYMERGE
	end;
	
	_handle = function(self, cmdtb)
		local targetAlliance = app:getAlliMgr():getAlliByName(Util:getString(cmdtb,'name'))
		if not self.checker:isCan(self.player, self.alliance, targetAlliance) then
			return false
		end
		
		targetAlliance:getApplyMergesSet():insert(self.alliance:getId())
		
		local targetLeaderMem = AllianceUtil:searchLeader(targetAlliance)
		self:_sendSysMailToTarget(targetLeaderMem)
		self:_sendMsgs(targetLeaderMem, targetAlliance)
		
		return true
	end;
	
	_sendSysMailToTarget = function(self, targetLeaderMem)
		local targetLeaderName = app:getCityMgr():getRoleNameByRoleId(targetLeaderMem:getId())
		local mailContent = string.format(rstr.mail.content.applyMergeAlliance, self.alliance:getName(), self.player:getRoleName())
		self.mail = app:getMailMgr():addSysMail(targetLeaderName, rstr.mail.title.applyMergeAlliance, FIXID.COMM_SYS_MAILTEMP, mailContent, nil)
	end;
	
	_sendMsgs = function(self, targetLeaderMem, targetAlliance)
		local targetLeader = app:getPlayerMgr():getOnlinePlayerByRoleId(targetLeaderMem:getId())
		if targetLeader ~= nil then
			MailSender:sendBriefMail(targetLeader, self.mail)
			AllianceSender:sendApplyMerges(targetLeader, targetAlliance)
		end
	end;	
})

AgreeMergeAllianceHdr = SelfAllianceOpBaseHdr:extends({
	init = function(self)
		self.checker = AgreeMergeAllianceChecker()
	end;
	
	_getOpType = function(self)
		return ALLI_OP_TYPE.AGREEMERGE
	end;
	
	_handle = function(self, cmdtb)
		local applyAlliance = app:getAlliMgr():getAlliByName(Util:getString(cmdtb,'name'))
		if not self.checker:isCan(self.player, self.alliance, applyAlliance) then
			return false
		end
		
		local maxAlliance, minAlliance = self.checker:sortAlliancesByDesc(applyAlliance)
		self:_mergeAlliance(maxAlliance, minAlliance)
		self:_addHonour(maxAlliance, minAlliance)
		self:_sendMsgs(maxAlliance)
		
		return true
	end;
	
	_mergeAlliance = function(self, maxAlliance, minAlliance)
		self:_mergeMemberToMaxAlliance(maxAlliance, minAlliance)
		maxAlliance:setBuildVal( maxAlliance:getBuildVal() + minAlliance:getBuildVal() )
		app:getAlliMgr():exitAlliance(minAlliance)
		maxAlliance:getApplyMergesSet():clear()
		minAlliance:getApplyMergesSet():clear()	
	end;
	
	_mergeMemberToMaxAlliance = function(self, maxAlliance, minAlliance)
		local minMemCount = minAlliance:getMemberCount()
		for i=0, minMemCount-1, 1 do
			local mem = minAlliance:getMemberByIdx(i)
			local player = app:getPlayerMgr():getOrLoadPlayerByRoleId( mem:getId() )
			if player ~= nil then
				player:setAlliId(maxAlliance:getId())
				mem:setAlliPos(ALLI_POS.MEM)
				maxAlliance:addMember(mem)
				self:_sendMailToMem(player, maxAlliance)
			end
		end
	end;
	
	_sendMailToMem = function(self, player, maxAlliance)
		local content = string.format(rstr.mail.content.mergeAlliance, maxAlliance:getName())
		local mail = app:getMailMgr():addSysMail(player:getRoleName(), rstr.mail.title.mergeAlliance, FIXID.COMM_SYS_MAILTEMP, content, nil)
		MailSender:sendBriefMail(player, mail)
	end;
	
	_addHonour = function(self, maxAlliance, minAlliance)
		local addHonour = 200
		maxAlliance:addHonour(addHonour)
		app:getAlliMgr():addAllianceEvent(maxAlliance, 'mergeAlliance', {minAlliance=minAlliance:getName(), maxAlliance=maxAlliance:getName(), addHonour=addHonour})
	end;
	
	_sendMsgs = function(self, maxAlliance)
		AllianceSender:sendSelfAllianceDetail(self.player, maxAlliance)
		AllianceSender:sendSelfMember(self.player, maxAlliance)
		AllianceSender:sendSelfLawLight(self.player, maxAlliance)
		AllianceSender:sendApplyMerges(self.player, maxAlliance)
		RoleBaseSender:send(self.player, {'alliance'})
	end;	
})

IgnoreMergeAllianceHdr = SelfAllianceOpBaseHdr:extends({
	_getOpType = function(self)
		return ALLI_OP_TYPE.IGNOREMERGE
	end;
	
	_handle = function(self, cmdtb)
		local applyAlliance = app:getAlliMgr():getAlliByName(Util:getString(cmdtb,'name'))
		if applyAlliance:isNull() then
			return false
		end
		
		if not self.alliance:getApplyMergesSet():has(applyAlliance:getId()) then
			return false
		end
		
		self.alliance:getApplyMergesSet():remove(applyAlliance:getId())
		AllianceSender:sendApplyMerges(self.player, self.alliance)
		
		return true
	end;
})

GetAllianceAuctionInfoHdr = SelfAllianceOpBaseHdr:extends({
	_handle = function(self, cmdtb)
		AllianceSender:sendSelfContributes(self.player, self.alliance)
		AllianceSender:sendAuctionItems(self.player, self.alliance)
		return true
	end;
})

AllianceAuctionBuyItemHdr = SelfAllianceOpBaseHdr:extends({
	_handle = function(self, cmdtb)
		local itemId = Util:getNumber(cmdtb, 'id')
		local price = Util:getNumber(cmdtb, 'price')
		local item = self.alliance:getItemPkg():getItemById(itemId)
		if item == nil then
			return false
		end
		
		if price < (item.cur + 10) and price ~= item.fixed then
			WUtil:sendWarningMsgArgs(self.player, 100194, '')
			AllianceSender:sendAuctionItem(self.player, self.alliance, itemId)
			return false
		end
		
		if item.buyer == self.player:getRoleName() then
			return false
		end
		
		if item.seller == self.player:getRoleName() then
			return false
		end
		
		if (item.fixed ~= nil and item.fixed > 0) and price > item.fixed then
			return false
		end
		
		if self.member:getContributes() < price then	
			WUtil:sendWarningMsgArgs(self.player, 100194, '')
			AllianceSender:sendAuctionItem(self.player, self.alliance, itemId)
			return false
		end
		
		self.alliance:getItemPkg():returnContributeToBuyer(item)
		
		item.buyer = self.player:getRoleName() 
		item.cur = price
		
		if not self:_isFixedBuy(item, price) then
			LOG('<alliance auction>notfixed buy item, the buyer:' .. item.buyer .. ', seller:' .. self:_getSellerName(item) .. ', resid:' .. item.resid .. ', num:' .. item.num )
			AllianceSender:sendAuctionItem(self.player, self.alliance, itemId)
		else
			local seller = item.seller
			if seller == nil or seller == '' then
				seller = '[sys]'
			end
			LOG('<alliance auction>fixed buy item, the buyer:' .. item.buyer .. ', seller:' .. self:_getSellerName(item) .. ', resid:' .. item.resid .. ', num:' .. item.num )
			self.alliance:getItemPkg():gainContributesSellItemSucc(item)
			AddItemToPkgHelper:addItems(self.player, {{resid=item.resid, number=item.num}})
			self.alliance:getItemPkg():removeById(itemId)
			AllianceSender:sendDelAuctionItem(self.player, self.alliance, itemId)
		end

		self.member:setContributes(self.member:getContributes() - price)
		AllianceSender:sendSelfMember(self.player, self.alliance)
	
		return true
	end;
	
	_getSellerName = function(item)
		local seller = item.seller
		if seller == nil or seller == '' then
			seller = '[sys]'
		end
		return seller
	end;
	
	_isFixedBuy = function(self, item, price)	
		if item.fixed == nil or item.fixed == 0 then
			return false
		end
		
		return item.fixed == price
	end;
})

SellItemToAllianceHdr = SelfAllianceOpBaseHdr:extends({
	_handle = function(self, cmdtb)
		local itemId = Util:getNumber(cmdtb, 'id')
		local number = Util:getNumber(cmdtb, 'number')
		local auctionPrice = Util:getNumber(cmdtb, 'auctionPrice')
		local fixedPrice = Util:getNumber(cmdtb, 'fixedPrice')
		
		if auctionPrice < 1 or auctionPrice >= fixedPrice then
			return false
		end
		
		local item = self.player:getPkg():getItemById(itemId)
		if item == nil then
			return false
		end
		
		if number < 1 or number > item:getNumber() then
			return false
		end
		
		if item:isBind() then
			return false
		end
		
		local sellingCount = self:_getMySellingItemCount()
		if sellingCount >= 5 then
			return false
		end
		
		item:subNumber(number)
		local sellItem = {resid=self:_getItemResId(item), num=number, sptime=Util:getTime()+72*3600, cur=auctionPrice, fixed=fixedPrice, seller=self.player:getRoleName(), buyer=''}
		local rsellItem = self.alliance:getItemPkg():addItem(sellItem)
		AllianceSender:sendAuctionItem(self.player, self.alliance, rsellItem.id)
		AllianceSender:sendMySellingItem(self.player, self.alliance, rsellItem.id)

		if item:getNumber() == 0 then
			ItemMsgSender:sendDelItem(self.player, item:getId())
			self.player:getPkg():delItemById(item:getId())
		else
			ItemMsgSender:sendNumber(self.player, item)
		end
		
		return true
	end;
	
	_getMySellingItemCount = function(self)
		local count = 0
		local itemPkg = self.alliance:getItemPkg()
		for i=0, itemPkg:getItemCount() - 1 do
			local item = itemPkg:getItemByIdx(i)
			if item.seller == self.player:getRoleName() then
				count = count + 1
			end
		end
		return count
	end;
	
	_getItemResId = function(self, item)
		local res = ItemResUtil:findItemres(item:getResId())
		if res.nobindid ~= nil and res.nobindid > 0 then
			return res.nobindid
		else
			return res.id
		end
	end;
})

CancelAllianceSellItemHdr = SelfAllianceOpBaseHdr:extends({
	_handle = function(self, cmdtb)
		local itemId = Util:getNumber(cmdtb, 'id')
		local item = self.alliance:getItemPkg():getItemById(itemId)
		if item == nil then
			return false
		end
		
		if item.seller ~= self.player:getRoleName() then
			return false
		end
		
		if item.buyer ~= '' then
			WUtil:sendWarningMsgArgs(self.player, 100195, '')
			AllianceSender:sendMySellingItem(self.player, self.alliance, item.id)
			AllianceSender:sendAuctionItem(self.player, self.alliance, item.id)
			return false
		end
		
		AllianceSender:sendDelMySellingItem(self.player, self.alliance, item.id)
		AllianceSender:sendDelAuctionItem(self.player, self.alliance, item.id)
		
		AddItemToPkgHelper:addItems(self.player, {{resid=item.resid, number=item.num}})
		self.alliance:getItemPkg():removeById(item.id)
		
		return true
	end;
})

GetAllianceSellItemsHdr = SelfAllianceOpBaseHdr:extends({
	_handle = function(self, cmdtb)
		AllianceSender:sendMySellingItems(self.player, self.alliance)
		return true
	end;
})


