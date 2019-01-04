require('tqClass')

WUtil = Class:extends({
	 
	init = function(self)
		self.lasterror = 'no error' 
	end;
	
	 
	getAddMulVal = function(self, base, addmul)
		if addmul.u == VAL_UNIT.PER then
			return addmul.val*base/100
		else
			return addmul.val
		end	
	end;
	
	 
	findInBuildById = function(self, player, resid)
		local city = player:getPersistVar().stCitys.astCitys[0]
		return Util:findC(city.stInBuilds.astInBuilds, city.stInBuilds.ucTotal, 'ulResId', resid)
	end;
	
	 
	findAllInBuildById = function(self, player, resid)
		local builds = {}
		local city = player:getPersistVar().stCitys.astCitys[0]
		for i = 0, city.stInBuilds.ucTotal-1, 1 do
			local build = city.stInBuilds.astInBuilds[i]
			if build.ulResId == resid then
				return table.insert(builds, build)
			end
		end
		return builds
	end;

	
	isValidHeroName = function(self, name)
		return self:isValidName(name, MIN_HERONAME_LEN, MAX_HERONAME_LEN, 'hero')
	end;
	
	 
	isValidName = function(self, name, minlen, maxlen, rstrkey)
		local rt = false
		if name == nil or name == '' then
			self.lasterror = rstr.validname[rstrkey].empty
		elseif string.len(name) < minlen then
			self.lasterror = rstr.validname[rstrkey].short
		elseif string.len(name) > maxlen then
			self.lasterror = rstr.validname[rstrkey].long
		elseif Request:HasDirtyWords(name) then
			self.lasterror = rstr.validname[rstrkey].mask
		elseif not Request:IsSafeString(name) then
			self.lasterror = rstr.validname[rstrkey].invalid
		else
			rt = true
		end
		return rt
	end;
	
	 
	getLastError = function(self)
		return self.lasterror
	end;
	
	 
	sendSysMsg = function(self, player, ttype, flag, msg)
		local sendmsg = '{cmd:'..NETCMD.SYSMSG..',type:'..ttype..',flag:'..flag..',msg:"'..msg..'"}'
		player:sendMsg(sendmsg)	
	end;
	
	 
	sendErrorMsg = function(self, player, errmsg)
		self:sendSysMsg(player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, errmsg)
		self:sendSysMsg(player, SMSGT.POP, SMT_ERROR, errmsg)	
	end;
	
	 
	sendSuccMsg = function(self, player, msg)
		self:sendSysMsg(player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, msg)
		self:sendSysMsg(player, SMSGT.POP, SMT_NORMAL, msg)	
	end;
	
	 
	sendWarningMsg = function(self, player, msg)
		self:sendSysMsg(player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, msg)
		self:sendSysMsg(player, SMSGT.POP, SMT_WARNING, msg)	
	end;	
	
	
	sendSysMsgArgs = function(self, player, ttype, flag, msgid, params)
		local sendmsg = '{cmd:'..NETCMD.SYSMSG..',type:'..ttype..',flag:'..flag..',msgid:'..msgid..',params:['..params..']}'
		player:sendMsg(sendmsg)	
	end;
	
	 
	sendErrorMsgArgs = function(self, player, msgid, params)
		self:sendSysMsgArgs(player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, msgid, params)
		self:sendSysMsgArgs(player, SMSGT.POP, SMT_ERROR, msgid, params)	
	end;
	
	 
	sendSuccMsgArgs = function(self, player, msgid, params)
		self:sendSysMsgArgs(player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, msgid, params)
		self:sendSysMsgArgs(player, SMSGT.POP, SMT_NORMAL, msgid, params)	
	end;
	
	 
	sendWarningMsgArgs = function(self, player, msgid, params)
		self:sendSysMsgArgs(player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, msgid, params)
		self:sendSysMsgArgs(player, SMSGT.POP, SMT_WARNING, msgid, params)	
	end;

	sendPopBoxMsgArgs = function(self, player, msgid, params)
		self:sendSysMsgArgs(player, SMSGT.POPMSGBOX, SMT_NORMAL, msgid, params)	
	end;
	
	sendPopBoxMsg = function(self, player, msg)
		self:sendSysMsg(player, SMSGT.POPMSGBOX, SMT_NORMAL, msg)	
	end;
	
	sendNpcMsg = function(self, player, msg)
		self:sendSysMsg(player, SMSGT.NPC_MSG, SMT_NORMAL, msg)	
	end;
	 
	getHeroByUId = function(self, player, uid)
		local heros = player:getPersistVar().stHeros
		return Util:findC(heros.astHeros, heros.ucCount, 'ullId', uid)	
	end;
	
	 
	findSteelHero = function(self, player)
		local heros = player:getPersistVar().stHeros
		for i=0, heros.ucCount-1, 1 do
			if heros.astHeros[i].ucState == HERO_STATE.STEEL then
				return heros.astHeros[i]
			end
		end	
		return nil
	end;
	
	
	formatRange = function(self, minval, maxval, var)
		if var < minval then
			return minval
		elseif var > maxval then
			return maxval
		else
			return var
		end	
	end;
	
	 
	getTarget = function(self, player, targettype, targetuid)
		if targettype == RES_TRG.MYCITY then
			return player:getCity()
		elseif targettype== RES_TRG.ENEMYCITY then
		elseif targettype== RES_TRG.SELF_HERO then
		elseif targettype== RES_TRG.ENEMY_HERO then
		elseif targettype== RES_TRG.SELF_ARMY then
		elseif targettype== RES_TRG.ENEMY_ARMY then
		else
			return nil
		end
	end;
	
	getHeroAttr = function(self, hero, attr)
		return Util:qfindC(hero.stAttrs.astAttrs, hero.stAttrs.ucCount, 'usAttr', attr)
	end;
	
	getHeroSkill = function(self, hero, skillid)
		return Util:findC(hero.stSkills.astSkills, hero.stSkills.ucCount, 'ulResId', skillid)
	end;
	
	createExpendObjs = function(self, player, hero, expends)
		local expendobjs = {}
		for _, expend in ipairs(expends) do
			if expend.type == EXPEND_TYPE.ROLEATTR then
				table.insert(expendobjs, RoleAttrExpend(player, expend))
			elseif expend.type == EXPEND_TYPE.HEROATTR then
				table.insert(expendobjs, HeroAttrExpend(player, hero, expend))
			elseif expend.type == EXPEND_TYPE.ITEM then
				table.insert(expendobjs, ItemExpend(player, expend))
			elseif expend.type == EXPEND_TYPE.MONEY then
				table.insert(expendobjs, MoneyExpend(player, expend))
			elseif expend.type == EXPEND_TYPE.GOLD then
				table.insert(expendobjs, GoldExpend(player, expend))
			elseif expend.type == EXPEND_TYPE.GIFTGOLD then
				table.insert(expendobjs, GiftGoldExpend(player, expend))
			elseif expend.type == EXPEND_TYPE.COMMRES then
				table.insert(expendobjs, CommResExpend(player, expend))
			elseif expend.type == EXPEND_TYPE.IDLEPOPU then
				table.insert(expendobjs, IdlePopuExpend(player, expend))
			elseif expend.type == EXPEND_TYPE.PRESTIGE then
				table.insert(expendobjs, PrestigeExpend(player, expend))
			elseif expend.type == EXPEND_TYPE.HONOR then
				table.insert(expendobjs, HonorExpend(player, expend))
			end
		end
		return expendobjs
	end;

	isEnoughExpends = function(self, expends)
		for _,expend in ipairs(expends) do
			if not expend:isEnough() then return false end
		end
		return true	
	end;
	
	subExpends = function(self, expends)
		for _,expend in ipairs(expends) do
			expend:sub()
		end
	end;
	
	makeSoldierResId = function(self, resid, level)	
		return resid * 1000 + level;
	end;
	
	splitSoldierTotalResId = function(self, totalResid)
		local resid = math.floor(totalResid / 1000)
		local level = math.mod(totalResid, 1000)
		return resid, level
	end;
}):new()


