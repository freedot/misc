--*******************************************************************************
--*******************************************************************************
require('tqClass')


SB = Class:extends({
	init = function(self)
		self.sbs = {}
	end;
	
	alloc = function(self)
		local node = self:_find()
		if node == nil then
			sb = StringBuffer:new()
			table.insert(self.sbs, {sb=sb, used=true})
			return sb
		else 
			node.used = true
			node.sb:clear()
			return node.sb
		end
	end;
	
	free = function(self)
		for _, node in ipairs(self.sbs) do
			node.used = false
		end
	end;
	
	isAllFreeForTest = function(self)
		for _, node in ipairs(self.sbs) do
			if node.used then 
				return false
			end
		end
		
		return true
	end;
	
	_find = function(self)
		for _, node in ipairs(self.sbs) do
			if not node.used then
				return node
			end
		end
		return nil
	end;
}):new()


StringBuffer = Class:extends({
	init = function(self)
		self.s_ = ''
	end;
	
	clear = function(self)
		self.s_ = ''
	end;
	
	format = function(self, fmt, ... )
		self.s_ = string.format(fmt, unpack(arg))
	end;
	
	puts = function(self, s)
		self.s_ = self.s_ .. s
	end;
	
	get = function(self)
		return self.s_
	end;
})

stringbuf = Class:extends({
	init = function(self)
		self.s_ = ''
	end;
	
	format = function(self, fmt, ... )
		self.s_ = string.format(fmt, unpack(arg))
	end;
	
	puts = function(self, s)
		self.s_ = self.s_ .. s
	end;
	
	toStringAndFree = function(self)
		return self.s_
	end;
})

XDInfoHelper = Class:extends({
	makeInfo = function(self, player, grid)
		local infoLabel, fields = self:getFields(player)
		local s = ''
		for _, k in ipairs(fields) do
			if grid.misc[k] ~= nil and grid.misc[k] > 0 then
				if s ~= '' then s = s .. ',' end
				s = s .. k .. ':' .. grid.misc[k]
			end
		end
		return infoLabel .. ':{' .. s .. '}'
	end;
	
	getFields = function(self, player)
		if player:getPlatForm().pf == 'qzone' then
			return 'ydInfo', g_qqYDFields
		elseif player:getPlatForm().pf == '3366' then
			return 'bdInfo', g_qqBDFields
		else
			return 'xdInfo', {}
		end
	end;
}):new()


MsgSender = Class:extends({
	invoke = function(self, methodName, player, ...)
		if not self:isCanSend(player) then return end
		self[methodName](self, player, unpack(arg))
	end;
	
	getCommListMsg = function(self, items, first, last, obj, combineItemCaller, getitemkey)
		return self:_getCommListOrDictMsg(items, first, last, obj, combineItemCaller, {left='[', right=']'}, getitemkey)
	end;
	
	getCommDictMsg = function(self, items, first, last, obj, combineItemCaller, getitemkey)
		return self:_getCommListOrDictMsg(items, first, last, obj, combineItemCaller, {left='{', right='}'}, getitemkey)
	end;
	
	getHeroSendMsg = function(self, s )
		return '{cmd:'..NETCMD.HERORES..',heros:['..s..']}'
	end;
	
	getHeroInfoSendMsg = function(self, hero, s)
		return self:getHeroSendMsg('{id:'..hero:getId()..','..s..'}')
	end;
	
	getRoleResInfoSendMsg = function(self, str)
		return '{cmd:'..NETCMD.ROLEBASE..',res:{'..str..'}}'
	end;
	
	_getCommListOrDictMsg = function(self, items, first, last, obj, combineItemCaller, tag, getitemkey)
		local s = ''
		for i=first, last, 1 do
			local it = nil
			if getitemkey ~= nil then
				it = items[getitemkey](items, i)
			else
				it = items[i]
			end
			if s ~= '' then s = s..',' end
			s = s..combineItemCaller(obj, it)
		end
		return tag.left..s..tag.right
	end;
	
	isCanSend = function(self, player )
		if not player:isRole() then return false end
		if player:getGameState() == EGUS_OFFLINE_INGAME then return false end
		
		return true
	end;
	
	makeSendMsgItems = function(self, items)
		local s = ''
		for _, item in ipairs(items) do
			if s ~= '' then
				s = s..',' 
			end
			
			s = s..'{'
			s = s..'id:'..item:getId()..',resid:'..item:getResId()..',number:'..item:getNumber()
			
			if not item:isRawItem() then
				s = s..',flevel:'..item:getForceLevel()
				
				if item:isBind() then
					s = s..',isBind:1'
				else
					s = s..',isBind:0'
				end
				
				local attrs = self:makeItemAttrs(item)
				if attrs ~= '' then
					s = s..',attrs:{' .. attrs .. '}' 
				end
				
				local gems = self:makeItemGems(item)
				s = s..',gems:[' .. gems .. ']' 
			end
			
			s = s..'}'
		end
		return s
	end;
	
	makeItemAttrs = function(self, item)
		local s = ''
		local lastIdx = item:getAttrsCount() - 1
		for i=0, lastIdx, 1 do
			if s ~= '' then
				s = s .. ','
			end
			
			local attr = item:getAttrByIdx(i)
			s = s .. '"'..attr.attr..'":{val:'..attr.val..',u:'..attr.unit..'}'
		end
		return s
	end;
	
	makeItemGems = function(self, item)
		local s = '{_r:1}'
		local lastIdx = item:getGemsCount() - 1
		for i=0, lastIdx, 1 do
			s = s .. ','
			s = s .. item:getGemByIdx(i)
		end
		return s	
	end;
})

CreateRoleSender = MsgSender:extends({
	sendCreateRoleInfoMsg = function(self, player)
		local sendmsg = '{cmd:'..NETCMD.CREATEROLE..',subid:0}'
		player:sendMsg(sendmsg)
	end;	

	sendCheckMsg = function(self, player, checkname, rt)
		local sendmsg = '{cmd:'..NETCMD.CREATEROLE..',subid:1,check:"'..checkname..'",result:"'..rt..'"}'
		player:sendMsg(sendmsg)
	end;
	
	sendRandName = function(self, player, randname)
		local sendmsg = '{cmd:'..NETCMD.CREATEROLE..',subid:2,randname:"' .. randname .. '"}'
		player:sendMsg(sendmsg)
	end;	

	sendCreateRoleOkMsg = function(self, player)
		local sendmsg = '{cmd:'..NETCMD.CREATEROLE..',subid:99,result:0}'
		player:sendMsg(sendmsg)
	end;
	
	sendCreateRoleFailedMsg = function(self, player)
		local sendmsg = '{cmd:'..NETCMD.CREATEROLE..',subid:99,result:-1}'
		player:sendMsg(sendmsg)
	end;
	
	sendCityDieNoPos = function(self, player)
		local sendmsg = '{cmd:'..NETCMD.CREATEROLE..',subid:3}'
		player:sendMsg(sendmsg)
	end;
	
	sendCityDie = function(self, player, pos)
		local sendmsg = '{cmd:'..NETCMD.CREATEROLE..',subid:4,pos:{x:' .. pos.x .. ',y:' .. pos.y .. '}}'
		player:sendMsg(sendmsg)
	end;
	
	sendSetCityDiePosOk = function(self, player)
		local sendmsg = '{cmd:'..NETCMD.CREATEROLE..',subid:5}'
		player:sendMsg(sendmsg)
	end;
	
	sendCityDieState = function(self, player)
		local sendmsg = '{cmd:'..NETCMD.CREATEROLE..',subid:6}'
		player:sendMsg(sendmsg)
	end;
}):new();

SkillMsgSender = MsgSender:extends({
	sendSkill = function(self, player, hero, skill)
		local sendmsg = self:getHeroInfoSendMsg(hero, self:makeSkillStr(skill))
		player:sendMsg(sendmsg)
	end;
	
	sendReplaceSkillId = function(self, player, hero, idx, oldSkillId, newSkillId)
		local sb = stringbuf:new()
		sb:format('skills:[{id:%d,idx:%d}]', oldSkillId, idx)
		local sendmsg = self:getHeroInfoSendMsg(hero, sb:toStringAndFree())
		player:sendMsg(sendmsg)
		
		sb = stringbuf:new()
		sb:format('skills:[{_k:"idx"},{idx:%d,id:%d}]', idx, newSkillId)
		sendmsg = self:getHeroInfoSendMsg(hero, sb:toStringAndFree())
		player:sendMsg(sendmsg)
	end;
	
	sendDelSkill = function(self, player, hero, skillid)
		local sendmsg = self:getHeroInfoSendMsg(hero, self:makeDelSkill(skillid))
		player:sendMsg(sendmsg)
	end;
	
	makeSkillStr = function(self, skill)
		return 'skills:['..self:combineSkillItem(skill)..']'
	end;
	
	makeSkillsStr = function(self, skills)
		return 'skills:'..self:getCommListMsg(skills.astSkills, 0, skills.ucCount-1, self, self.combineSkillItem)
	end;
	
	makeDelSkill = function(self, skillid)
		return 'skills:[{id:'..skillid..',_d:1}]'
	end;
	
	combineSkillItem = function(self, skill) 
		return '{id:'..skill.ulResId..',level:'..skill.ucLevel..',dex:'..skill.ulDex..'}'
	end
}):new()

AttrMsgSender = MsgSender:extends({
	makeAttrStr = function(self, attr)
		return 'attrs:{'..self:combineAttrItem(attr)..'}'
	end;
	
	makeAttrsStr = function(self, attrs)
		return 'attrs:'..self:getCommDictMsg(attrs.astAttrs, 0, attrs.ucCount-1, self, self.combineAttrItem)
	end;

	makeLAttrsStr = function(self, attrs)
		return 'attrs:'..self:getCommDictMsg(attrs, 1, table.getn(attrs), self, self.combineAttrItem)
	end;
	
	combineAttrItem = function(self, attr) 
		return '"'..attr.usAttr..'":{val:'..attr.ulVal..',u:'..attr.ucUnit..'}'
	end;
})

HeroAttrSender = AttrMsgSender:extends({
	sendAttr = function(self, player, hero, attr)
		local sendmsg = self:getHeroInfoSendMsg(hero, self:makeAttrStr(attr))
		player:sendMsg(sendmsg)
	end;
	
	sendAttrsByIds = function(self, player, hero, ids)
		local s = self:makeAttrsStrByIds(hero, ids)
		local sendmsg = self:getHeroInfoSendMsg(hero, s)
		player:sendMsg(sendmsg)
	end;
	
	makeAttrsStrByIds = function(self, hero, ids)
		if table.getn(ids) == 0 then 
			return 'attrs:{}'
		end
		
		local attrs = {}
		for _, id in ipairs( ids ) do
			local attr = hero:getAttr(id)
			table.insert(attrs, attr)
		end
		
		return self:makeLAttrsStr(attrs)
	end;
	
	sendSimpleHeros = function(self, player)
		local heromgr = player:getHeroMgr()
		local count = heromgr:getHeroCount()
		local needSendAttrIds = {ATTR.HEALTH, ATTR.MHEALTH, ATTR.CO, ATTR.SFC, ATTR.FC
			, ATTR.XP, ATTR.NXP, ATTR.SP, ATTR.CRE
			,ATTR.PH_B ,ATTR.PH_A, ATTR.ST_B, ATTR.ST_A, ATTR.AG_B, ATTR.AG_A, ATTR.IF}
		local s = ''
		for i=0, count-1, 1 do
			local hero = heromgr:getHeroByIdx(i)
			if s ~= '' then s = s..',' end
			s = s..'{'..self:getHeroBaseInfo(hero)..','..self:makeCarrySoldier(hero)..','.. self:makeHeroSteel(hero)..','..self:makeAttrsStrByIds(hero, needSendAttrIds)..'}'
		end
		player:sendMsg( self:getHeroSendMsg(s) )
	end;
	
	sendHerosState = function(self, player, heros)
		local s = ''
		for _, hero in ipairs(heros) do
			if s ~= '' then s = s..',' end
			s = s..'{id:'..hero:getId()..',state:'..hero:getState()..'}'
		end
		player:sendMsg(self:getHeroSendMsg(s))
	end;
	
	sendHeroSteel = function(self, player, hero)
		local s = '{id:' .. hero:getId() .. ',' .. self:makeHeroSteel(hero) .. '}'
		player:sendMsg( self:getHeroSendMsg(s) )
	end;
	
	sendCarrySoldier = function(self, player, hero)
		self:sendCarrySoldiers(player, {hero})
	end;
	
	sendCarrySoldiers = function(self, player, heros)
		local s = ''
		for _, hero in pairs(heros) do
			if s ~= '' then
				s = s..','
			end
			
			s = s..'{'
			s = s..'id:'..hero:getId()
			s = s..','..self:makeCarrySoldier(hero)
			s = s..'}'
		end
		
		if s == '' then
			return
		end
		
		player:sendMsg(self:getHeroSendMsg(s))		
	end;
	
	sendDetailHero = function(self, player, hero)
		local s = '{'
		s = s..self:getHeroBaseInfo( hero )
		s = s..','..self:getHeroSecInfo( hero )
		s = s..','..self:makeSubjects( hero )
		s = s..','..self:makeAttrsStr( hero:getRawAttrs() )
		s = s..','..self:makeCarrySoldier( hero )
		s = s..','..SkillMsgSender:makeSkillsStr( hero:getSkills() )
		s = s..','..self:makeSkillSteel( hero )
		s = s..','..self:makeCurTSkill( hero )
		s = s..','..self:makeWears( hero )
		s = s..','..self:makeHeroSteel( hero )
		s = s..',isDetail:1'
		s = s..'}'
		player:sendMsg(self:getHeroSendMsg(s))
	end;
	
	sendSubjects = function(self, player, hero)
		local s = '{'
		s = s..'id:'..hero:getId()
		s = s..','..self:makeSubjects(hero)
		s = s..'}'
		player:sendMsg(self:getHeroSendMsg(s))
	end;
	
	sendSkillSteel = function(self, player, hero)
		local s = '{id:'..hero:getId()
		s = s..','..self:makeSkillSteel( hero )
		s = s..'}'
		player:sendMsg(self:getHeroSendMsg(s))
	end;
	
	sendFireHero = function(self, player, heroid)
		local s = '{id:'..heroid..',_d:1}'
		player:sendMsg(self:getHeroSendMsg(s))
	end;
	
	sendHeroLockState = function(self, player, hero)
		local s = '{id:'..hero:getId()..',lockstate:'..hero:getLockState()..'}'
		player:sendMsg(self:getHeroSendMsg(s))
	end;
	
	sendLockHero = function(self, player, hero)
		self:sendHeroLockState(player, hero)
	end;
	
	sendUnLockHero  = function(self, player, hero)
		local s = '{id:'..hero:getId()..',lockstate:'..hero:getLockState()..',unlocktime:'..hero:getUnLockTime()..'}'
		player:sendMsg(self:getHeroSendMsg(s))
	end;
	
	sendUnLockedHero = function(self, player, hero)
		self:sendHeroLockState(player, hero)
	end;
	
	sendName = function(self, player, hero)
		local s = '{id:'..hero:getId()..',name:"'..hero:getName()..'"}'
		player:sendMsg(self:getHeroSendMsg(s))
	end;
	
	sendOfficial = function(self, player, hero)
		local s = '{id:'..hero:getId()..',official:'..hero:getOfficial()..'}'
		player:sendMsg(self:getHeroSendMsg(s))
	end;
	
	sendSkeleton = function(self, player, hero)
		local s = '{id:'..hero:getId()..',skeleton:{level:'..hero:getSkeletonLevel()..',stoptime:'..hero:getSSteelStopTime()..'}}'
		player:sendMsg(self:getHeroSendMsg(s))
	end;
	
	sendStrIFResult = function(self, player, hero, adds)
		local s = ''
		for i, v in ipairs(adds) do
			if i ~= 1 then s = s..',' end
			s = s..v
		end
		player:sendMsg( '{cmd:'..NETCMD.HERORES..',strifresult:['..s..']}' )
	end;
	
	sendCanUseSSTime = function(self, player)
		local heromgr = player:getHeroMgr()
		player:sendMsg( '{cmd:'..NETCMD.HERORES..',canusesstime:'..heromgr:getCanUseSkillSteelTime()..'}' )	
	end;
	
	sendCurTacticSkillId = function(self, player, hero)
		local s = '{id:'..hero:getId()..',curtskill:'..hero:getCurTacticSkillId()..'}'
		player:sendMsg(self:getHeroSendMsg(s))
	end;
	
	sendWear = function(self, player, hero, armPos)
		local wearArm = hero:getWearContainer():getWearArmByArmPos(armPos)
		if wearArm == nil then
			return
		end
		
		local s = '{id:' .. hero:getId() .. ',' .. self:makeWear(wearArm) .. '}'
		player:sendMsg(self:getHeroSendMsg(s))
	end;
	
	sendUnWear = function(self, player, hero, armPos)
		local s = '{id:' .. hero:getId() .. ',wears:{"' .. armPos .. '":{_d:1}}}'
		player:sendMsg(self:getHeroSendMsg(s))
	end;
	
	getHeroBaseInfo = function(self, hero)
		return 'id:'..hero:getId()..',icon:'..hero:getIcon()..',name:"'..hero:getName()..'",level:'..hero:getLevel()..',sex:'..hero:getSex()..',state:'..hero:getState()..',prof:'..hero:getProf()..',skeleton:{level:'..hero:getSkeletonLevel()..'}'
	end;
	
	getHeroSecInfo = function(self, hero)
		return 'skeleton:{level:'..hero:getSkeletonLevel()..',stoptime:'..hero:getSSteelStopTime()..'},official:'..hero:getOfficial()..',lockstate:'..hero:getLockState()..',unlocktime:'..hero:getUnLockTime()
	end;
	
	makeSubjects = function(self, hero)
		local s = ''
		local count = hero:getSubjectsCount()
		for i=1, count, 1 do
			if s ~= '' then s = s..',' end
			s = s..hero:getSubject(i-1)
		end
		return 'subjects:['..s..']'
	end;
	
	makeCarrySoldier = function(self, hero)
		local soldier = hero:getSoldier()
		return 'soldier:{resid:'..soldier.resid..',number:'..soldier.number..'}'
	end;
	
	makeSkillSteel = function(self, hero)
		local ss = hero:getSkillSteel()
		return 'skillsteel:{id:'..ss.ulResId..',stoptime:'..ss.ulStoptime..'}'
	end;
	
	makeCurTSkill = function(self, hero)
		return 'curtskill:'..hero:getCurTacticSkillId()
	end;
	
	makeWear = function(self, wearArm)
		local s = self:makeSendMsgItems({wearArm:getArm()})
		return 'wears:{'..'"'..wearArm:getArmPos()..'":' .. s .. '}'
	end;
	
	makeWears = function(self, hero)
		local s = ''
		local wearContainer = hero:getWearContainer()
		for i=1, wearContainer:getCount(), 1 do
			if s ~= '' then
				s = s .. ','
			end
			
			local wearArm = wearContainer:getWearArmByIdx(i)
			s = s .. '"' .. wearArm:getArmPos() .. '":' .. self:makeSendMsgItems({wearArm:getArm()})
		end
		return 'wears:{' .. s .. '}'
	end;
	
	makeHeroSteel = function(self, hero)
		local hs = hero:getHeroSteel()
		return 'steel:{type:' .. hs:getSteelType() .. ',steelQuarters:' .. hs:getSteelQuarters()..',startTime:' .. hs:getStartTime() .. ',quarterRes:' .. hs:getQuarterRes() .. '}'
	end;
}):new()

RoleAttrSender = AttrMsgSender:extends({
	sendAttr = function(self, player, attr)
		local sendmsg = self:getRoleResInfoSendMsg(self:makeAttrStr(attr))
		player:sendMsg(sendmsg)
	end;
	
	sendAttrsByIds = function(self, player, ids)
		if table.getn(ids) == 0 then 
			return 
		end
		
		local attrs = {}
		for _, id in ipairs( ids ) do
			local attr = player:getAttr(id)
			table.insert(attrs, attr)
		end
		
		local s = self:makeLAttrsStr(attrs)
		local sendmsg = self:getRoleResInfoSendMsg(s)
		player:sendMsg(sendmsg)
	end;
	
	sendAttrs = function(self, player, attrs)
		local sendmsg = self:getRoleResInfoSendMsg(self:makeAttrsStr(attrs))
		player:sendMsg(sendmsg)
	end;
}):new()

PkgSender = MsgSender:extends({
	getPkgSendMsg = function(self, str)
		return '{cmd:'..NETCMD.PKG..',pkg:{'..str..'}}'
	end;
})

ItemMsgSender = PkgSender:extends({
	sendChangeItems = function(self, player, changeitems)
		if table.getn(changeitems) == 0 then
			return
		end
		
		local str = ''
		for _, it in ipairs(changeitems) do
			if str ~= '' then str = str..',' end
			if it.del then
				str = str..'{id:'..it.id..',_d:1}'
			else
				str = str..'{id:'..it.id..',number:'..it.number..'}'
			end
		end
		local sendmsg = self:getPkgSendMsg('items:['..str..']')
		player:sendMsg(sendmsg)
	end;
	
	sendNumber = function(self, player, item)
		if item:getNumber() <= 0 then 
			return 
		end
		
		local sendmsg = self:getPkgSendMsg('items:[{id:'..item:getId()..',number:'..item:getNumber()..'}]')
		player:sendMsg(sendmsg)
	end;
	
	sendItem = function(self, player, item)
		local sendmsg = self:getPkgSendMsg('items:[' .. self:makeSendMsgItems( {item} ) .. ']')
		player:sendMsg(sendmsg)
	end;
	
	sendOtherDetailItemFail = function(self, player)
		local s = '{cmd:'..NETCMD.ITEM..',result:-1}'
		player:sendMsg(s)
	end;
	
	sendOtherDetailItem = function(self, player, targetRoleId, targetItem)
		local s = '{cmd:'..NETCMD.ITEM..',result:0,roleId:' .. targetRoleId .. ',detailitem:' .. self:makeSendMsgItems( {targetItem} ) .. '}'
		player:sendMsg(s)
	end;
	
	sendDelItem = function(self, player, itemid)
		local sendmsg = self:getPkgSendMsg('items:[{id:'..itemid..',_d:1}]')
		player:sendMsg(sendmsg)
	end;
	
	sendByResId = function(self, player, itemids)
		if table.getn(itemids) == 0 then
			return
		end
		
		local pkg = player:getPkg()
		local cnt = pkg:getItemsCount()
		local items = {}
		for i=0, cnt-1, 1 do
			local item = pkg:getItemByIdx(i)
			if Util:find(itemids, nil, item:getResId()) ~= nil then
				table.insert(items, item)
			end
		end
		
		local sitems = self:makeSendMsgItems( items )
		if sitems == '' then
			return
		end
		
		local s = 'items:['..sitems..']'
		player:sendMsg(self:getPkgSendMsg(s))
	end;
	
	sendAll = function(self, player)
		local pkg = player:getPkg()
		local cnt = pkg:getItemsCount()
		local items = {}
		for i=0, cnt-1, 1 do
			local item = pkg:getItemByIdx(i)
			table.insert(items, item)
		end
		
		local s = 'items:['..self:makeSendMsgItems( items )..']'
		player:sendMsg(self:getPkgSendMsg(s))
	end;
	
	sendSalveMax = function(self,player)
		local s = 'salveMax:' .. player:getPkg():getMaxSalveCount()
		player:sendMsg(self:getPkgSendMsg(s))
	end;
	
	combineItem = function(self, item) 
		return '{id:'..item:getId()..',resid:'..item:getResId()..',number:'..item:getNumber()..'}'
	end
}):new()


PkgMiscSender = PkgSender:extends({
	send = function(self, player, keys)
		local pkg = player:getPkg()
		local s = ''
		for _, key in ipairs(keys) do
			if s ~= '' then s = s..',' end
			if key == 'gold' then
				s = s..'gold:'..pkg:getGold()
			elseif key == 'giftgold' then
				s = s..'giftgold:'..pkg:getGiftGold()
			elseif key == 'maxgrids' then
				s = s..'maxgrids:'..pkg:getMaxGridsCnt()
			end
		end
		if s ~= '' then
			player:sendMsg(self:getPkgSendMsg('misc:{'..s..'}'))
		end
	end;
	
	sendAll = function(self, player)
		self:send(player, {'gold','giftgold','maxgrids'})
	end;
}):new()

RoleBaseSender = MsgSender:extends({
	send = function(self, player, baselist)
		local s = ''
		for _, key in ipairs(baselist) do
			if s ~= '' then s = s..',' end
			if key == 'name' then
				s = s..'name:"'..player:getRoleName()..'"'
			elseif key == 'id' then
				s = s..'id:'..player:getId()
			elseif key == 'uid' then
				s = s..'uid:'..player:getRoleId()
			elseif key == 'prestige' then
				s = s..'prestige:'..player:getPrestige()
			elseif key == 'cityhonor' then
				s = s..'cityhonor:'..player:getCityHonor()
			elseif key == 'citycd' then
				s = s..'citycd:'..player:getCityCD()
			elseif key == 'level' then
				s = s..'level:'..player:getLevel()
			elseif key == 'resid' then
				s = s..'resid:'..player:getIcon()
			elseif key == 'cityid' then
				s = s..'cityid:'..player:getCityId()
			elseif key == 'ranking' then
				s = s..'ranking:'..player:getRanking()
			elseif key == 'sex' then
				s = s..'sex:'..player:getSex()
			elseif key == 'pos' then
				local pos = player:getCityPos()
				s = s..'pos:{x:'..pos.x..',y:'..pos.y..'}'
			elseif key == 'state' then
				s = s..'state:'..player:getState()
			elseif key == 'alliance' then
				local alli =  app:getAlliMgr():getAlliById(player:getAlliId())
				s = s..'alliance:{uid:'..alli:getId()..',name:"'..alli:getName()..'"}'
			elseif key == 'introduction' then
				s = s..'introduction:"'..player:getIntroduction()..'"'
			elseif key == 'gm' then
				if player:getGMFlag() < 3 then
					s = s..'gm:0'
				else
					s = s..'gm:1'
				end
			elseif key == 'svrOpenTime' then
				s = s..'svrOpenTime:'..ActTaskUtil:getSvrOpenTime()
			elseif key == 'firstLoginTime' then
				s = s..'firstLoginTime:'..Util:getFixPreTime(player:getRegTime(), 0, 0, 0)
			elseif key == 'actTower' then
				s = s..'actTower:' .. player:getActTower():getMaxLayer()
			elseif key == 'actTerrace' then
				local maxGate = player:getActTerrace():getMaxGate()
				local curMaxGateId = maxGate.gateId
				if maxGate.subGateId < res_act_terrace_max_subgate_id then
					curMaxGateId = curMaxGateId - 1
				end
				s = s..'actTerrace:' .. curMaxGateId
			elseif key == 'cityMaxLevel' then
				s = s..'cityMaxLevel:' .. player:getCityRes():getMaxLevel()
			elseif key == 'xdInfo' then
				local infoLabel, _ = XDInfoHelper:getFields(player)
				s = s.. infoLabel .. ':' .. self:_makeXDInfo(player)
			elseif key == 'vip' then
				s = s..'vip:' .. player:getVipLevel()
			elseif key == 'firsthero' then
				if player:getTask():getSendReward():isSendedFirstHero() then
					s = s..'firsthero:1'
				else
					s = s..'firsthero:0'
				end
			end
		end
		local sendmsg = self:getRoleResInfoSendMsg(s)
		player:sendMsg(sendmsg)
	end;
	
	_makeXDInfo = function(self, player)
		local _, fields = XDInfoHelper:getFields(player)
		local s = '_e:0'
		local mem = player:getQQMembership()
		for _, k in ipairs(fields) do
			if mem[k] > 0 then
				s = s .. ',' .. k .. ':' .. mem[k]
			end
		end
		
		local xdtask = self:_getXDTask(player)
		if xdtask == nil then
			return '{' .. s .. '}'
		end
		
		if xdtask:getGotNewGift() == 1 then
			s = s .. ',got_newgift:1'
		end
		
		if xdtask:getGotCommGift() > 0 then
			s = s .. ',got_commgift:' .. xdtask:getGotCommGift() 
		end
		
		if xdtask:getGotYearGift() > 0 then
			s = s .. ',got_yeargift:' .. xdtask:getGotYearGift() 
		end
		
		if xdtask.getGotHighGift ~= nil and xdtask:getGotHighGift() > 0 then
			s = s .. ',got_highgift:' .. xdtask:getGotHighGift() 
		end
		
		if xdtask.getGot3366Gift ~= nil and xdtask:getGot3366Gift() > 0 then
			s = s .. ',got_3366gift:' .. xdtask:getGot3366Gift() 
		end
		
		local lvlGifts = xdtask:getGotLvlGifts()
		local ss = ''
		for i=0, lvlGifts:getCount()-1 do
			if ss ~= '' then ss = ss .. ',' end
			ss = ss .. lvlGifts:get(i)
		end
		
		if ss ~= '' then
			s = s .. ',got_lvlgifts:[' .. ss ..  ']'
		end
		
		return '{' .. s .. '}'
	end;
	
	_getXDTask = function(self, player)
		if player:getPlatForm().pf == 'qzone' then
			return player:getTask():getYDTask()
		elseif player:getPlatForm().pf == '3366' then
			return player:getTask():getBDTask()
		else
			return nil
		end
	end;
	
	sendAll = function(self, player)
		self:send(player, {'name','id','uid','prestige','cityhonor','citycd','level','resid','cityid','sex','ranking','state','pos','alliance','introduction','gm','svrOpenTime','firstLoginTime','actTower','actTerrace','cityMaxLevel','xdInfo','vip','firsthero'})
	end;
}):new()

RoleRankSender = MsgSender:extends({
	sendRanks = function(self, player, pageNo, onePageCnt, curSelIdx)
		local  pageCount = app:getRoleRank():getPageCount(onePageCnt)
		local ranks = app:getRoleRank():selectRanks(pageNo, onePageCnt)
		local s = ''
		for _, grid in ipairs(ranks) do
			if s ~= '' then s = s .. ',' end
			s = s .. '{'
			s = s .. 'rank:' .. grid.roleRank
			s = s .. ',name:"' .. grid.roleName .. '"'
			s = s .. ',gridId:' .. grid.gridId
			s = s .. ',roleId:' .. grid.roleId
			s = s .. ',alli:"' .. grid.alliName .. '"'
			s = s .. ',level:' .. grid.misc.lastRoleLevel
			s = s .. ',buildVal:' .. grid.misc.lastBuildVal
			s = s .. '}'
		end
		player:sendMsg( self:_makeMsg('ranks:[' .. s .. '],pageNo:' .. pageNo .. ',pageCount:' .. pageCount .. ',curSelIdx:' .. curSelIdx) )
	end;
	
	_makeMsg = function(self, s)
		return '{cmd:'..NETCMD.ROLEBASE..','..s..'}'
	end;
})

RoleSoldierSender = MsgSender:extends({
	sendSoldiers = function(self, player)
		local soldierMgr = player:getSoldierMgr()
		local soldierCnt = soldierMgr:getSoldiersCount()
		local s = 'soldiers:'..self:getCommListMsg(soldierMgr, 0, soldierCnt-1, self, self.combineSoldier, 'getSoldierByIdx')
		player:sendMsg( self:getSoldierSendMsg(s) )
	end;
	
	sendSoldier = function(self, player, resid)
		local soldierMgr = player:getSoldierMgr()
		local soldier = soldierMgr:getSoldierById(resid)
		local s = 'soldiers:['..self:combineSoldier(soldier)..']'
		player:sendMsg( self:getSoldierSendMsg(s) )
	end;
	
	sendSoldiersByIds = function(self, player, resids)
		local soldierMgr = player:getSoldierMgr()
		local s = ''
		for _, resid in ipairs(resids) do
			if s ~= '' then s = s..',' end
			
			local soldier = soldierMgr:getSoldierById(resid)
			if soldier == nil then
				s = s..'{id:'..resid..',_d:1}'
			else
				s = s..self:combineSoldier(soldier)
			end
		end
		
		if s == '' then
			return 
		end
		
		s = 'soldiers:['..s..']'
		player:sendMsg( self:getSoldierSendMsg(s) )
	end;
	
	getSoldierSendMsg = function(self, s)
		return '{cmd:'..NETCMD.SOLDIERRES..','..s..'}' 
	end;
	
	combineSoldier = function(self, soldier)
		return '{id:'..soldier.resid..',number:'..soldier.number..'}'
	end;
}):new()

CityBuildSender = MsgSender:extends({
	sendCitysType = function(self, player)
		local s = '';
		local cityCount = player:getCitys():getCityCount()
		for cityId=1, cityCount, 1 do
			if s ~= '' then
				s = s .. ','
			end
			
			s = s .. player:getCitys():getCityById(cityId):getType()
		end
		
		player:sendMsg(self:getBuildResSendMsg('cityTypes:[' .. s .. ']'))
	end;
	
	sendAll = function(self, player)
		local cityCount = player:getCitys():getCityCount()
		for cityId=1, cityCount, 1 do
			self:sendOneCityAllBuilds(player, cityId)
		end
	end;
	
	sendOpenMainCity = function(self, player)
		local sendmsg = self:getBuildResSendMsg('openMainCity:1')
		player:sendMsg(sendmsg)
	end;
	
	send = function(self, player, cityId, buildid)
		self.cityId = cityId
		local city = player:getCitys():getCityById(cityId)
		if city == nil then return end
		local build = city:getBuildById(buildid)
		if build == nil then 
			self:sendDel(player, cityId, buildid)
			return
		end
		local s = 'builds:{cityId:' .. cityId .. ',list:['..self:combineBuildItem(build)..']}'
		local sendmsg = self:getBuildResSendMsg(s)
		player:sendMsg(sendmsg)
	end;
	
	sendDel = function(self, player, cityId, buildid)
		local s = 'builds:{cityId:' .. cityId .. ',list:[{id:'..buildid..',_d:1}]}'
		local sendmsg = self:getBuildResSendMsg(s)
		player:sendMsg(sendmsg)
	end;
	
	sendOneCityAllBuilds = function(self, player, cityId)
		self.cityId = cityId
		local city = player:getCitys():getCityById(cityId)
		local sendmsg = self:getBuildResSendMsg(self:makeCityStr(city))
		player:sendMsg(sendmsg)
	end;	
	
	getBuildResSendMsg = function(self, s)
		return '{cmd:'..NETCMD.BUILDRES..','..s..'}'
	end;
	
	makeCityStr = function(self, city)
		local builds = city:getBuilds()
		return 'builds:{cityId:' .. self.cityId .. ',list:'..self:getCommListMsg(builds.astInBuilds, 0, builds.ucTotal-1, self, self.combineBuildItem) .. '}'
	end;
	
	combineBuildItem = function(self, build)
		local s = '{id:'..build.ulId..',cid:'..self.cityId..',resid:'..build.ulResId..',state:'..build.ucState..',level:'..build.ucLevel
		if build.ucState ~= BUILD_STATE.COMM then
			s = s..',stoptime:'..build.ulStoptime
		end
		s = s..'}'
		return s
	end;
}):new()

CityResSender = MsgSender:extends({
	getCResSendMsg = function(self, str)
		return '{cmd:'..NETCMD.CITYRES..',res:{'..str..'}}'
	end;
}):new()


MoneySender = CityResSender:extends({
	send = function(self, player, keys)
		local cres = player:getCityRes()
		local citys = player:getCitys()
		local s = ''
		for _, key in ipairs(keys) do
			if s ~= '' then s = s..',' end
			if key == 'money' then
				s = s..'cur:'..cres:getMoney()
			elseif key == 'maxmoney' then
				s = s..'max:'..citys:getMaxMoney()
			elseif key == 'output' then
				s = s..'output:'..cres:getMoneyOutput()
			end
		end
		if s ~= '' then
			player:sendMsg(self:getCResSendMsg('money:{'..s..'}'))
		end
	end;
	
	sendAll = function(self, player)
		self:send(player, {'money', 'maxmoney', 'output'})
	end;
}):new()

CityBuildValSender = CityResSender:extends({
	send = function(self, player, keys)
		local cres = player:getCityRes()
		local s = ''
		for _, key in ipairs(keys) do
			if s ~= '' then s = s..',' end
			
			if key == 'level' then
				s = s..'level:'..cres:getLevel()
			elseif key == 'buildval' then
				s = s..'cur:'..cres:getBuildVal()
			elseif key == 'hurtval' then
				s = s..'hurt:'..cres:getBuildHurtVal()
			elseif key == 'maxbuildval' then
				s = s..'max:'..cres:getMaxBuildVal()
			end
		end
		if s ~= '' then
			player:sendMsg(self:getCResSendMsg('buildval:{'..s..'}'))
		end
	end;
	
	sendAll = function(self, player)
		self:send(player, {'level', 'buildval', 'hurtval', 'maxbuildval'})
	end;
}):new()

CommResSender = CityResSender:extends({
	send = function(self, player, ids)
		local cres = player:getCityRes()
		local citys = player:getCitys()
		local s = ''
		for _, id in ipairs(ids) do
			if s ~= '' then s = s..',' end
			if id == FIXID.FOOD then
				s = s..'food:'..cres:getFood()
			elseif id == FIXID.WOOD then
				s = s..'wood:'..cres:getWood()
			elseif id == FIXID.STONE then
				s = s..'stone:'..cres:getStone()
			elseif id == FIXID.IRON then
				s = s..'iron:'..cres:getIron()
			elseif id == FIXID.MAXCRESCNT then
				s = s..'max:'..citys:getMaxCRes()
			end
		end
		if s ~= '' then
			player:sendMsg(self:getCResSendMsg('cres:{'..s..'}'))
		end
	end;
	
	sendAll = function(self, player)
		self:send(player, {FIXID.FOOD, FIXID.WOOD, FIXID.STONE, FIXID.IRON, FIXID.MAXCRESCNT})
	end;
}):new()

PopuSender = CityResSender:extends({
	send = function(self, player, keys) 
		local cres = player:getCityRes()
		local citys = player:getCitys()
		local farm = player:getFarm()
		local s = ''
		for _, key in ipairs(keys) do
			if s ~= '' then s = s..',' end
			if key == 'idle' then
				s = s..'idle:'..cres:getIdlePopu()
			elseif key == 'work' then
				s = s..'work:'..farm:getWorkforce()
			elseif key == 'max' then
				s = s..'max:'..citys:getMaxPopu()
			end
		end
		
		if s ~= '' then
			player:sendMsg(self:getCResSendMsg('popu:{'..s..'}'))
		end
	end;
	
	sendAll = function(self, player)
		self:send(player, {'idle','work','max'})
	end;
}):new()

FarmSender = MsgSender:extends({
	sendCancelInput = function(self, player)
		player:sendMsg('{cmd:'..NETCMD.FARM..',farminput:{result:-1}}')
	end;
	
	sendBlock = function(self, player, farm, block)
		self.collectorId = player:getRoleId()
		self.farm = farm
		
		local s = 'ver:' .. farm:getFarmVer() .. ',blocks:['..self:combineItem(block)..']'
		player:sendMsg(self:getFarmSendMsg(s))
	end;
	
	sendBlocks = function(self, player, farm, blocks)
		self.collectorId = player:getRoleId()
		self.farm = farm
		
		local s = 'ver:' .. farm:getFarmVer() .. ',blocks:'..self:getCommListMsg(blocks, 1, table.getn(blocks), self, self.combineItem)
		player:sendMsg(self:getFarmSendMsg(s))
	end;
	
	sendAll = function(self, player, farmPlayer)
		self.collectorId = player:getRoleId()
		self.farm = farmPlayer:getFarm()
		
		local farmdata = self.farm:getFarmData()
		local s =  'ver:' .. self.farm:getFarmVer()
		s = s .. ',' .. self:getRoleBrief(farmPlayer)
		s = s .. ',blocks:'..self:getCommListMsg(farmdata.astFarms, 0, farmdata.ucCount-1, self, self.combineItem)
		player:sendMsg(self:getFarmSendMsg(s))
	end;
	
	sendDelBlock = function(self, player, blockid)
		local s = 'ver:' .. player:getFarm():getFarmVer()
		s = s .. ',blocks:[{id:'..blockid..',resid:'..FIXID.EMPTYFARMBLOCK..'}]'
		player:sendMsg(self:getFarmSendMsg(s))
	end;	
	
	sendGetResNum = function(self, player, nums)
		local s = ''
		for _, n in ipairs(nums) do
			if s ~= '' then s = s..',' end
			s = s..'{id:'..n.id..',num:'..n.num..'}'
		end
		if s == '' then return end
		local sendmsg = '{cmd:'..NETCMD.FARM..',farmgets:{nums:['..s..']}}'
		player:sendMsg(sendmsg)
	end;
	
	sendLogs = function(self, player)
		local s = ''
		local farm = player:getFarm()
		for i=farm:getLogCount()-1, 0, -1 do
			local node = farm:getLogIdx(i)
			if s ~= '' then s = s..',' end
			s = s..'['..node.ucType..',"'..node.szRName..'",'..node.ulLogTime..','..node.ulParam1..','..node.ulParam2..','..node.ulParam3..','..node.ulParam4..']'
		end
		
		if s == '' then return end
		
		local sendmsg = '{cmd:'..NETCMD.FARM..',farminfo:{ver:'..farm:getLogVer()..',list:['..s..']}}'
		player:sendMsg(sendmsg)
	end;
	
	sendFarmsCanGetFlags = function(self, player, flags)
		if table.getn(flags) == 0 then 
			return
		end
		
		local s = '{_k:"roleId"}'
		for _, flag in ipairs(flags) do
			s = s .. ',{roleId:' .. flag.roleId .. ',flag:' .. flag.flag .. '}'
		end
		
		local sendmsg = '{cmd:'..NETCMD.FARM..',farmflags:[' .. s .. ']}'
		player:sendMsg(sendmsg)
	end;
	
	getRoleBrief = function(self, player)
		return 'role:{uid:'..player:getRoleId()..',name:"'..player:getRoleName()..'",citylevel:'..player:getCityRes():getLevel()..'}'
	end;
	
	combineItem = function(self, item)
		local canGather = 0
		if self.farm:isCanGather(self.collectorId, item) and self.farm:isComplete(item) then
			canGather = 1
		end
		
		local s = '{id:'..item.ulId..',resid:'..item.ulResId..',level:'..item.ucLevel..',state:'..item.ucState..',totalres:'..item.ulTotalRes..',canGather:'..canGather
		if item.ucState == FARM_STATE.COMPLETE then
			s = s..',leftres:'..item.ulLeftRes
			s = s..',pStopTime:'..item.protectStopTime
		else
			s = s..',starttime:'..item.ulStartTime
			s = s..',stoptime:'..item.ulStopTime
		end
		s = s..'}'
		return s
	end;
	
	getFarmSendMsg = function(self, s)
		return '{cmd:'..NETCMD.FARM..',farm:{'..s..'}}'
	end;

}):new()

NewHerosSender = AttrMsgSender:extends({
	sendAll = function(self, player)
		local heromgr = player:getHeroMgr()
		local newheros = heromgr:getNewHeros()
		local citys = player:getCitys()
		local tlevel = citys:getBuildLevelByResId(FIXID.TAVERNBUILD)
		local res = ItemResUtil:findBuildLevelres(FIXID.TAVERNBUILD, tlevel)
		if res == nil then return end
		
		local stoptime = newheros:getNewHeroLastTime() + res.refreshtime
		local nheros = newheros:getNewHeros()
		local s = self:getCommListMsg(nheros.astNewHeros, 0, nheros.ucNewCount-1, self, self.combineHero)
		player:sendMsg( self:getNHeroSendMsg('stoptime:'..stoptime..',list:'..s) )
	end;
	
	sendDelHero = function(self, player, heroid)
		local s = 'del:1,list:[{id:'..heroid..',_d:1}]'
		player:sendMsg( self:getNHeroSendMsg(s) )
	end;
	
	combineHero = function(self, hero)
		local s = '{id:'..hero.ulId..',prof:'..hero.ucProf..',name:"'..hero.szName..'",level:'..hero.ucLevel..',icon:'..hero.ulIcon..','..self:makeAttrsStr(hero)..'}'
		return s
	end;
	
	makeAttrsStr = function(self, attrs)
		return 'attrs:'..self:getCommDictMsg(attrs.astAttrs, 0, attrs.ucAttrCount-1, self, self.combineAttrItem)
	end;
	
	getNHeroSendMsg = function(self, s)
		return '{cmd:'..NETCMD.HERORES..',newheros:{'..s..'}}'
	end;
}):new()

CultureSender = MsgSender:extends({
	sendCultures = function(self, player)
		local cultures = player:getCultures():getCultures()
		local s = 'cultures:'..self:getCommListMsg(cultures.cultures, 0, cultures.count-1, self, self.combineCulture)
		player:sendMsg( self:getCultureSendMsg(s) )
	end;
	
	sendCulture = function(self, player, culture)
		local s = 'cultures:['..self:combineCulture(culture)..']'
		player:sendMsg( self:getCultureSendMsg(s) )
	end;
	
	sendLearningCulture = function(self, player)
		local learningCulture = player:getCultures():getLearningCulture()
		
		local state = 0
		if learningCulture.stoptime > 0 then
			state = BUILD_STATE.UPGRADE
		end
		
		local level = player:getCultures():getLevel(learningCulture.id)
		
		local s = 'learning:{id:'..learningCulture.id..',state:' .. state .. ',level:' .. level .. ',stoptime:'..learningCulture.stoptime..'}'
		player:sendMsg( self:getCultureSendMsg(s) )
	end;
	
	getCultureSendMsg = function(self, s)
		return '{cmd:'..NETCMD.CULTURE..','..s..'}'
	end;
	
	combineCulture = function(self, culture)
		return '{id:'..culture.id..',level:'..culture.level..'}'
	end;
}):new()

MilitarySender = MsgSender:extends({
	sendFavorites = function(self, player)
		local invalidRoleIds = {}
		local s = self:_makeFavoritesListByContainer(player, player:getFavoriteContainer())
		if s ~= '' then
			player:sendMsg( self:makeMsg('favorites:[{_k:"gridId"}'..s..']') )
		end
	end;
	
	sendAddFavorite = function(self, player, targetId)
		local grid = app:getCityMgr():getGridByGridId(targetId)
		if grid == nil then
			return
		end
		
		local s = ''
		s = self:_makeGridStr(s, player, grid)
		s = 'favorites:[{_k:"gridId"}' .. s .. ']'
		
		player:sendMsg( self:makeMsg(s) )
	end;
	
	sendDelFavorite = function(self, player, targetId)
		local s = 'favorites:[{_k:"gridId"},{gridId:'..targetId..',_d:1}]'
		player:sendMsg( self:makeMsg(s) )
	end;
	
	sendEnemys = function(self, player)
		local invalidRoleIds = {}
		local s = self:_makeBriefRoleListByContainer(player, player:getEnemyContainer())
		if s ~= '' then
			player:sendMsg( self:makeMsg('enemys:[{_k:"gridId"}'..s..']') )
		end	
	end;
	
	sendDelEnemy = function(self, player, enemyId)
		local s = 'enemys:[{_k:"gridId"},{gridId:'..enemyId..',_d:1}]'
		player:sendMsg( self:makeMsg(s) )
	end;
	
	_makeBriefRoleListByContainer = function(self, player, container)
		local s = ''
		local invalidRoleIds = {}
		local count = container:getCount()
		for i=0, count-1, 1 do
			local roleId = container:getByIdx(i)
			local grid = app:getCityMgr():getGridByRoleId(roleId)
			if grid ~= nil then
				s = self:_makeGridStr(s, player, grid)
			else
				table.insert(invalidRoleIds, roleId)
			end
		end
		
		for _, roleId in ipairs(invalidRoleIds) do
			container:delete(roleId)
		end
		
		return s
	end;
	
	_makeFavoritesListByContainer = function(self, player, container)
		local s = ''
		local count = container:getCount()
		for i=0, count-1, 1 do
			local gridId = container:getByIdx(i)
			local grid = app:getCityMgr():getGridByGridId(gridId)
			if grid ~= nil then
				s = self:_makeGridStr(s, player, grid)
			end
		end
		return s
	end;
	
	_makeGridStr = function(self, s, player, grid)
		local alliance = app:getAlliMgr():getAlliById( grid.allianceId )
		local pos = app:getCityMgr():getPosByGridId(grid.gridId)
		return s..',{gridId:' .. grid.gridId ..  ',icon:' .. grid.icon .. ',sex:' .. grid.sex ..  ',roleName:"' ..grid.roleName.. '",objType:' .. grid.objType .. ',roleId:' .. grid.roleId .. ',resid:' .. grid.resId .. ',level:' .. grid.level .. ',alliance:{uid:' .. grid.allianceId .. ',name:"' .. alliance:getName() .. '"}}'
	end;
	
	sendDefaultTeam = function(self, player, teamId)
		local team = player:getDefaultTeam(teamId)
		if team == nil then return end

		local s = 'defaultteams:['..self:makeTeam(teamId, team)..']'
		player:sendMsg( self:makeMsg(s) )
	end;
	
	sendDefaultTeams = function(self, player)
		local s = ''
		for teamId=1, MAX_DEFAULTTEAM_CNT, 1 do
			local team = player:getDefaultTeam(teamId)
			if (s ~= '') then s = s..',' end
			s = s..self:makeTeam(teamId, team)
		end
		local s = 'defaultteams:['..s..']'
		player:sendMsg( self:makeMsg(s) )
	end;
	
	sendLineups = function(self, player)
		local s = ''
		local lineups = player:getLineups()
		for i=0, lineups.count-1, 1 do
			local lineupId = lineups.lineups[i]
			if (s ~= '') then s = s..',' end
			s = s..lineupId
		end
		local s = 'lineups:['..s..']'
		player:sendMsg( self:makeMsg(s) )
	end;
	
	sendTodayFTimes = function(self,player)
		local times = player:getTodayFightTimes()
		local s = 'todaytimes:{taofa:'..times.taofa..',cuihui:'..times.cuihui..',tiaoxin:'..times.tiaoxin..',fightowner:'..times.fightowner..'}'
		player:sendMsg( self:makeMsg(s) )
	end;
	
	sendArmy = function(self, player, armyId)
		if not self:isCanSend(player) then return end
		
		local army = app:getArmyMgr():getArmyById(armyId)
		if army == nil then return end
		
		local targetOnwerRoleId = army.targetId
		
		if player:getRoleId() == army.sourceId then
			self:_sendArmy(player, army, ARMY_TYPE.SELF)
		elseif player:getRoleId() == self:_getArmyTargetOnwerRoleId(army) then
			if army.expedType == EXPED_TYPE.PAIQIAN then
				self:_sendArmy(player, army, ARMY_TYPE.ALLI)
			else
				self:_sendArmy(player, army, ARMY_TYPE.ENEMY)
			end
		end
	end;
	
	_getArmyTargetOnwerRoleId = function(self, army)
		if army.targetType == OBJ_TYPE.FIELD then
			local grid = app:getCityMgr():getGridByGridId(army.targetId)
			if grid == nil or grid.roleId == 0 then
				return army.targetId
			end
			return grid.roleId
		else
			return army.targetId
		end
	end;
	
	_sendArmy = function(self, player, army, armyType)
		local ret, sourcePlayer, targetPlayer = ArmyPlayerGetter:getPairBriefPlayer(army)
		if not ret then return end
		
		local sendmsg = 'armys:{list:['.. self:_makeArmyStr(army, armyType, sourcePlayer, targetPlayer) ..']}'
		player:sendMsg( self:makeMsg(sendmsg) )
	end;
	
	_makeArmyStr = function(self, army, armyType, sourcePlayer, targetPlayer)
		local s = '{id:'..army.armyId
		s = s..',armyType:'..armyType
		s = s..',expedType:'..army.expedType
		s = s..',sourceRole:"'..sourcePlayer:getRoleName()..'"'
		s = s..',sourceType:'..sourcePlayer:getObjType()
		s = s..',sourcePos:{x:'..sourcePlayer:getCityPos().x..',y:'..sourcePlayer:getCityPos().y..'}'
		s = s..',state:'..army.state
		s = s..',heros:'..self:_getHerosStrByArmy(army, armyType)
		s = s..',targetId:'..targetPlayer:getRoleId()
		s = s..',targetRole:"'..targetPlayer:getRoleName()..'"'
		s = s..',targetType:'..targetPlayer:getObjType()
		s = s..',targetPos:{x:'..targetPlayer:getCityPos().x..',y:'..targetPlayer:getCityPos().y..'}'
		s = s..',stopTime:'..army.stopTime
		s = s..',fighted:'..army.fighted
		s = s..'}'
		return s
	end;
	
	_getHerosStrByArmy = function(self, army, armyType)
		local s = ''
		for _, simpleHero in ipairs(army.simpleHeros) do
			if (s ~= '' ) then s = s..',' end
			s = s..self:_makeSimpleHero(army.buff, armyType, simpleHero)
		end
		return '[' .. s .. ']'
	end;		
	
	sendAllArmys = function(self, player)
		if not self:isCanSend(player) then return end
		
		local armyContainer = player:getArmyContainer()
		
		local selfArmyCount = armyContainer:getSelfArmyCount()
		for i=1, selfArmyCount, 1 do
			self:sendArmy(player, armyContainer:getSelfArmyId(i-1))
		end
		
		local enemyArmyCount = armyContainer:getEnemyArmyCount()
		for i=1, enemyArmyCount, 1 do
			self:sendArmy(player, armyContainer:getEnemyArmyId(i-1))
		end
		
		local allianceArmyCount = armyContainer:getAllianceArmyCount()
		for i=1, allianceArmyCount, 1 do
			self:sendArmy(player, armyContainer:getAllianceArmyId(i-1))
		end
	end;
	
	sendArmyState = function(self, player, armyId)
		if not self:isCanSend(player) then return end
		
		local army = app:getArmyMgr():getArmyById(armyId)
		if army == nil then return end
		
		local  sendmsg = 'armys:{list:[{id:'..army.armyId..',state:'..army.state..',fighted:'..army.fighted..',stopTime:'..army.stopTime..'}]}'
		player:sendMsg( self:makeMsg(sendmsg) )
	end;
	
	sendDelArmy = function(self, player, armyId)
		if not self:isCanSend(player) then return end
		
		local sendmsg = 'armys:{list:[{id:'..armyId..',_d:1}]}'
		player:sendMsg( self:makeMsg(sendmsg) )
	end;
	
	sendFightDemo = function(self, player, armyId, fightId, mapId, saction, sresult)
		if not self:isCanSend(player) then return end
		
		local sendmsg = 'fightdemo:{id:'..armyId..',fightId:'..fightId..',mapId:' .. mapId .. ',actions:'..saction..',result:'..sresult..'}'
		player:sendMsg( self:makeMsg(sendmsg) )
	end;
	
	sendSuccCopyFields = function(self, player)
		local succCopyFields = player:getsuccCopyFields()
		
		local s = ''
		for i=0, succCopyFields:getCount()-1, 1 do
			if s ~= '' then
				s = s .. ','
			end
			
			s = s .. succCopyFields:get(i)
		end
		
		local sendmsg = 'succcopyfields:{taofa:['..s..']}'
		player:sendMsg( self:makeMsg(sendmsg) )
	end;
	
	sendForceLineupCfg = function(self, player)
		local s = '{_k:"type"}'
		local count = player:getClientCfg():getForceLineupCount()
		for i=0, count-1, 1 do
			local node = player:getClientCfg():getForceLineup(i)
			s = s .. ',{type:' .. node.type .. ',lineup:' .. node.lineup .. ',heros:' .. self:_makeHeroIds(node.heroCount, node.heroIds) .. '}'
		end
		
		local sendmsg = 'saveforces:[' .. s .. ']'
		player:sendMsg( self:makeMsg(sendmsg) )
	end;
	
	_makeHeroIds = function(self, count, heros)
		local s = ''
		for i=0, count-1, 1 do
			if s ~= '' then s = s .. ',' end
			s = s .. heros[i]
		end
		return '[' .. s .. ']'
	end;
	
	_makeSimpleHero = function(self, armyBuff, armyType, simpleHero)
		if simpleHero.id == 0 then
			return '{id:'..simpleHero.id..'}'
		end
		
		local s = '{id:'..simpleHero.id
		s = s..',name:"'..simpleHero.name..'"'
		if (armyType == ARMY_TYPE.ENEMY) and (Util:find(armyBuff, nil, ARMY_BUFF.SHOWDETAIL) == nil) then
			s = s..',level:0,attrs:{},soldier:{resid:0,number:0}'
		else
			s = s..',level:'..simpleHero.level
			s = s..','..self:_makeAttrsExStr(simpleHero.attrs, table.getn(simpleHero.attrs))
			s = s..',soldier:{resid:'..simpleHero.soldier.resid..',number:'..simpleHero.soldier.number..'}'		
		end
		s = s..'}'
		
		return s
	end;
	
	_makeAttrsExStr = function(self, attrs, count)
		return 'attrs:'..self:getCommDictMsg(attrs, 1, count, self, self.combineAttrExItem)
	end;	
	
	combineAttrExItem = function(self, attr) 
		return '"'..attr.attr..'":{val:'..attr.val..'}'
	end;
	
	makeTeam = function(self, teamId, team)
		local shero = ''
		for i=0, MAX_DEFAULTTEAM_HERO_CNT-1, 1 do
			if (shero ~= '') then shero = shero..',' end
			if (team.lineupId > 0 ) then
				shero = shero..team.heroIds[i]
			else
				shero = shero..'0'
			end
		end
		return '{id:'..teamId..',lineup:'..team.lineupId..',heros:['..shero..']}'
	end;
	
	makeMsg = function(self, s)
		return '{cmd:'..NETCMD.MILITARY..','..s..'}'
	end;
}):new()

MailSender = MsgSender:extends({
	init = function(self)
		self.NOT_SYS_MAIL = 0
		self.SYS_MAIL = 1
	end;
	
	sendAllBriefMails = function(self, player)
		local mailMgr = app:getMailMgr()
		local mailCount = mailMgr:getMailCount( player:getRoleName() )
		
		local s = ''
		for i=1, mailCount, 1 do
			local mail = mailMgr:getBriefMailByIdx(i)
			if s ~= '' then
				s = s..','
			end
			
			s = s .. self:makeBriefMail(mail)
		end
		
		if s == '' then
			return
		end
		
		player:sendMsg( self:makeMsg(s) )	
	end;
	
	sendBriefMail = function(self, player, mail)
		if mail == nil then return end
		
		local s = self:makeBriefMail(mail)
		player:sendMsg( self:makeMsg(s) )
	end;
	
	sendMail = function(self, player, mailId)
		local mail = app:getMailMgr():getMailById(mailId)
		if mail == nil then 
			return 
		end
		
		local sdetail = ''
		local tempRes = ItemResUtil:findItemres(mail.tempId)
		local isNeedTable = (tempRes ~= nil) and (tempRes.needtable == 1)
		if isNeedTable and mail.tempId == FIXID.COMM_SYS_MAILTEMP then
			sdetail = '{tempId:'..mail:getTempId()..',tmsg:{con:\"'..mail:getContent()..'\"}}'
		elseif isNeedTable then
			sdetail = '{tempId:'..mail:getTempId()..',tmsg:'..mail:getContent()..'}'
		else
			sdetail = '{msg:"'..mail:getContent()..'"}'
		end
		
		local sitems = self:makeSendMsgItems( mail:getItems() )
		if sitems ~= '' then
			sitems = ',items:[' .. sitems .. ']'
		end
		
		local hasgoods = 0
		if mail:hasItem() then
			hasgoods = 1
		end		
		local s = '{id:'..mail:getId()..',hasgoods:' .. hasgoods .. ',sys:'..mail:isSys()..',read:'..mail:isRead()..',from:"'..mail:getSender()..'",title:"'..mail:getTitle()..'",detail:'..sdetail..sitems..',time:'..mail:getTime()..'}'
		player:sendMsg( self:makeMsg(s) )
	end;
	
	sendDelMail = function(self, player, mailId)
		local s = '{id:'..mailId..',_d:1}'
		player:sendMsg( self:makeMsg(s) )
	end;	
	
	sendMailClearItem = function(self, player, mailId)
		local s = '{id:'..mailId..',hasgoods:0,items:[{_r:1}]}'
		player:sendMsg( self:makeMsg(s) )
	end;
	
	makeBriefMail = function(self, mail)
		local hasgoods = 0
		if mail:hasItem() then
			hasgoods = 1
		end		
		return '{id:' .. mail:getId() .. ',hasgoods:' .. hasgoods .. ',sys:' .. mail:isSys() .. ',read:' .. mail:isRead() .. ',from:"' .. mail:getSender() .. '",title:"' .. mail:getTitle() .. '",time:' .. mail:getTime() .. '}'
	end;
	
	makeMsg = function(self, s)
		return '{cmd:'..NETCMD.MAIL..',mails:['..s..']}'
	end;
}):new()

PlayerCityDefSender = Class:extends({
	sendDefs = function(self, player)
		local cityDef = player:getCityDef()
		local s = ''
		for t=CITYDEF_TYPE.FIRST, CITYDEF_TYPE.LAST, 1 do
			if (s ~= '') then s = s..',' end
			s = s..cityDef:getDefNumber(t)
		end
		player:sendMsg( self:makeMsg('citydefs:['..s..']') )
	end;
	
	sendBuilding = function(self, player)
		local cityDef = player:getCityDef()
		player:sendMsg( self:makeMsg('building:{stoptime:' .. cityDef:getBuildingStopTime() .. ',id:' .. cityDef:getBuildingResid() .. ',number:' .. cityDef:getBuildingNumber() .. '}') )
	end;
	
	sendDefArmy = function(self, player)
		local defArmy = player:getArmyContainer():getDefArmy()
		local s = toJIONString(defArmy)
		player:sendMsg( self:makeMsg('defarmy:'..s) )
	end;
	
	makeMsg = function(self, s)
		return '{cmd:'..NETCMD.CITYDEF..','..s..'}'
	end;
}):new()

PlayerTowerSender = MsgSender:extends({
	sendTowers = function(self, player)
		local towerArmy = player:getArmyContainer():getTowerArmy()
		local towerSoldiers = towerArmy.soldiers
		
		local s = 'tower:{'
		s = s..'lineupId:'..towerArmy.lineupId
		s = s..','..self:makeSoldierList(towerSoldiers, MAX_TEAM_HERO_CNT)
		s = s..'}'
		
		local sendmsg = '{cmd:'..NETCMD.TOWER..','..s..'}'
		player:sendMsg( sendmsg )
	end;		
	
	makeSoldierList = function(self, soldiers, count)
		return 'soldiers:'..self:getCommListMsg(soldiers, 0, count-1, self, self.combineSoldierItem)
	end;	
	
	combineSoldierItem = function(self, soldier) 
		return '{resid:'..soldier.resid..',number:'..soldier.number..'}'
	end;
}):new()

PlayerSelfFieldSender = Class:extends({
	sendAllSelfFields = function(self, player)
		local s = ''
		local count = player:getSelfField():getCount()
		for i=0, count-1, 1 do
			local selfField = player:getSelfField():getFieldByIdx(i)
			local grid = app:getCityMgr():getGridByGridId(selfField.gridId)
			if grid ~= nil then
				s = self:_getSelfFieldItemStr(s, selfField, grid)
			end
		end
		
		player:sendMsg( self:_makeSelfFieldsMsg(s) )
	end;
	
	sendSelfField = function(self, player, gridId)
		local selfField = player:getSelfField():getFieldById(gridId)
		if selfField == nil then 
			return
		end
		
		local grid = app:getCityMgr():getGridByGridId(selfField.gridId)
		if grid == nil then
			return
		end
		
		local s = self:_getSelfFieldItemStr('', selfField, grid)
		player:sendMsg( self:_makeSelfFieldsMsg(s) )
	end;
	
	sendDeleteSelfField = function(self, player, gridId)
		player:sendMsg( self:_makeSelfFieldsMsg('{id:'..gridId..',_d:1}') )
	end;
	
	sendCanGetRes = function(self, player, gridId, canGetRess)
		local s = '{food:'..canGetRess.food..',wood:'..canGetRess.wood..',stone:'..canGetRess.stone..',iron:'.. canGetRess.iron..'}'
		player:sendMsg( self:_makeSelfFieldsMsg('{id:' .. gridId .. ',canGetRes:' .. s .. '}') )
	end;
	
	_makeSelfFieldsMsg = function(self, s)
		return '{cmd:'..NETCMD.SELFFIELD..',selffields:['..s..']}'
	end;
	
	_getSelfFieldItemStr = function(self, s, selfField, grid)
		local rs = s
		if rs ~= '' then
			rs = rs .. ','
		end
		
		rs = rs .. '{id:'..selfField.gridId..',resid:'..grid.resId..',level:'..grid.level..',startTime:'..selfField.startTime..'}'
		return rs
	end;
}):new()

ItemOpSender = MsgSender:extends({
	sendDecomposeResult = function(self, player, resIds)
		local s = 'splitResults:'..self:getCommListMsg(resIds, 1, table.getn(resIds), self, self._combineSplitResult)
		local sendmsg = '{cmd:'..NETCMD.ITEMOP..','..s..'}'
		player:sendMsg( sendmsg )
	end;
	
	sendIntensifyResult = function(self, player, item)
		local s = 'intensifyResult:{resid:' .. item:getResId() .. ',forceLevel:' .. item:getForceLevel() .. '}'
		local sendmsg = '{cmd:'..NETCMD.ITEMOP..','..s..'}'
		player:sendMsg( sendmsg )
	end;
	
	sendBesetResult = function(self, player, item)
		local s = 'besetResult:{}'
		local sendmsg = '{cmd:'..NETCMD.ITEMOP..','..s..'}'
		player:sendMsg( sendmsg )
	end;
	
	_combineSplitResult = function(self, res)
		return '{armResid:'..res.armResid..',forceLevel:'..res.forceLevel..',resid:'..res.resid..',number:' .. res.number .. '}'
	end;
}):new()

OutFieldSender = MsgSender:extends({
	sendFields = function(self, player, gridIds)
		local s = ''
		for _, gridId in ipairs(gridIds) do
			local grid = app:getCityMgr():getGridByGridId(gridId)
			if grid ~= nil then
				s = s .. ',{'
				s = s .. 'isDetail:0,'
				s = s .. self:_getBaseGridInfo(grid)
				s = s .. self:_getAppendGridRoleInfo(grid)
				s = s .. '}'
			end
		end
		
		if s == '' then
			return
		end
		
		s = 'outFields:[{_k:"gridId"}' .. s .. ']'
		s = '{cmd:'..NETCMD.OUTFIELD..','..s..'}'
		player:sendMsg( s )
	end;
	
	sendFieldDetail = function(self, player, grid)
		local alliName = grid.alliName
		local cityLevel = grid.cityLevel
		local buildCurVal = grid.buildCurVal
		local roleRank = grid.roleRank
		local introduction = grid.introduction

		local s = '{'
		s = s .. 'isDetail:1,'
		s = s .. self:_getBaseGridInfo(grid)
		s = s .. self:_getAppendGridRoleInfo(grid)
		s = s .. ',buildval:{level:' .. cityLevel .. ',cur:' .. buildCurVal .. '}'
		s = s .. ',rank:' .. roleRank
		s = s .. ',introduction:"' .. introduction .. '"'
		s = s .. ',actTower:' .. grid.misc.towerLayer
		s = s .. ',actTerrace:' .. grid.misc.terraceGate
		s = s .. ',cityMaxLevel:' .. grid.misc.cityMaxLevel
		s = s .. ',' .. XDInfoHelper:makeInfo(player, grid)
		s = s .. '}'
		s = 'outFields:[{_k:"gridId"},' .. s .. ']'
		s = '{cmd:'..NETCMD.OUTFIELD..','..s..'}'
		
		player:sendMsg( s )
	end;
	
	_getBaseGridInfo = function(self, grid)
		return 'gridId:' .. grid.gridId .. ',objType:' .. grid.objType .. ',modelId:' .. grid.modelId .. ',resid:' .. grid.resId .. ',level:' .. grid.level .. ',ydInfo:{}' .. ',vip:' .. grid.misc.vip_level
	end;
	
	_getAppendGridRoleInfo = function(self, grid)
		local s = ',roleId:0,roleName:"",alliance:{uid:0,name:""}'
		if grid.roleId > 0 then
			s = ',roleId:' .. grid.roleId .. ',roleName:"' .. grid.roleName .. '"'
			local myAlliance = app:getAlliMgr():getAlliById( grid.allianceId )
			s = s .. ',alliance:{uid:' .. grid.allianceId .. ',name:"' .. myAlliance:getName() .. '"}'
		end
		
		if grid.objType == OBJ_TYPE.ROLE then
			s = s .. ',icon:' ..  grid.icon .. ',subCitys:[' .. grid.subCitys .. ']'
			local myAlliance = app:getAlliMgr():getAlliById( grid.allianceId )
			if myAlliance:getFlag() ~= '' then
				s = s .. ',myAlliFlag:"' .. myAlliance:getFlag() .. '"'
			end
			
			local enemyAlliance = app:getAlliMgr():getAlliById( grid.enemyAlliId )
			if enemyAlliance:getFlag() ~= '' then
				s = s .. ',enemyAlliFlag:"' .. enemyAlliance:getFlag() .. '"'
			end
		end

		return s
	end;
}):new()

FriendSender = MsgSender:extends({
	sendFriend = function(self, player, roleId)
		local grid = app:getCityMgr():getGridByRoleId(roleId)
		if grid == nil then
			return
		end
		
		local s = 'friends:[{_k:"roleId"},' .. self:_makeFriendStr(player, grid) .. ']'
		player:sendMsg( self:_makeMsg(s) )
	end;
	
	sendAllFriends = function(self, player)
		self:_removeNullFriends(player)
		self:_sendAllFriends(player)
	end;
	
	sendRemoveFriend = function(self, player, roleId)
		local s = 'friends:[{_k:"roleId"},{roleId:' .. roleId .. ',_d:1}]'
		player:sendMsg( self:_makeMsg(s) )
	end;
	
	sendApply = function(self, player, roleId)
		local grid = app:getCityMgr():getGridByRoleId(roleId)
		if grid == nil then
			return
		end
		
		local s = 'applys:[{_k:"roleId"},' .. self:_makeApplyStr(grid) .. ']'
		player:sendMsg( self:_makeMsg(s) )
		self:_sendHasApply(player)
	end;
	
	sendAllApplys = function(self, player)
		self:_removeNullApplys(player)
		self:_sendAllApplys(player)	
	end;
	
	sendRemoveApply = function(self, player, roleId)
		local s = 'applys:[{_k:"roleId"},{roleId:' .. roleId .. ',_d:1}]'
		player:sendMsg( self:_makeMsg(s) )
	end;
	
	sendFriendChat = function(self, player, fromRoleId, fromRoleName, msg)
		local s = 'chat:{roleId:' .. fromRoleId .. ',roleName:"' .. fromRoleName .. '",time:' .. Util:getTime() .. ',msg:"' .. msg .. '"}'
		player:sendMsg( self:_makeMsg(s) )
	end;
	
	_removeNullFriends = function(self, player)
		local friendMgr = player:getFriendMgr()
		for i=friendMgr:getFriendCount()-1, 0, -1 do
			local friendNode = friendMgr:getFriendByIdx(i)
			local grid = app:getCityMgr():getGridByRoleId(friendNode.roleId)
			if grid == nil then
				friendMgr:removeFriend(friendNode.roleId)
			end
		end
	end;
	
	_sendAllFriends = function(self, player)
		local s = ''
		local friendCount = player:getFriendMgr():getFriendCount()
		for i=0, friendCount-1, 1 do
			local friendNode = player:getFriendMgr():getFriendByIdx(i)
			local grid = app:getCityMgr():getGridByRoleId(friendNode.roleId)
			
			s = s .. ','
			s = s .. self:_makeFriendStr(player, grid)
		end
		
		if s == '' then
			return 
		end
		
		player:sendMsg( self:_makeMsg( 'friends:[{_k:"roleId"}' .. s .. ']' ) )
	end;
	
	_removeNullApplys = function(self, player)
		local friendMgr = player:getFriendMgr()
		for i=friendMgr:getApplyCount()-1, 0, -1 do
			local roleId = friendMgr:getApplyByIdx(i)
			local grid = app:getCityMgr():getGridByRoleId(roleId)
			if grid == nil then
				friendMgr:removeApply(roleId)
			end
		end	
	end;
	
	_sendAllApplys = function(self, player)
		local s = ''
		local applyCount = player:getFriendMgr():getApplyCount()
		for i=0, applyCount-1, 1 do
			local roleId = player:getFriendMgr():getApplyByIdx(i)
			local grid = app:getCityMgr():getGridByRoleId(roleId)
			
			s = s .. ','
			s = s .. self:_makeApplyStr(grid)
		end
		
		if s == '' then
			return 
		end
		
		player:sendMsg( self:_makeMsg( 'applys:[{_k:"roleId"}' .. s .. ']' ) )
		self:_sendHasApply(player)
	end;
	
	_sendHasApply = function(self, player)
		player:sendMsg( self:_makeMsg( 'hasApply:1' ) )
	end;
	
	_makeFriendStr = function(self, player, grid)
		local died = (grid.objType == OBJ_TYPE.DIED_ROLE) and 1 or 0
		return '{roleId:' .. grid.roleId .. ',died:' .. died .. ',roleName:"' .. grid.roleName .. '",icon:' .. grid.icon .. ',sex:' .. grid.sex .. ',level:' .. grid.level .. ',buildval:{level:' .. grid.cityLevel .. '},gridId:' .. grid.gridId .. ',' .. XDInfoHelper:makeInfo(player, grid) .. ',vip:' .. grid.misc.vip_level .. '}'
	end;
	
	_makeApplyStr = function(self, grid)
		return '{roleId:' .. grid.roleId .. ',roleName:"' .. grid.roleName .. '",icon:' .. grid.icon .. ',sex:' .. grid.sex .. ',level:' .. grid.level .. ',gridId:' .. grid.gridId .. '}'
	end;
	
	_makeMsg = function(self, s)
		return '{cmd:'..NETCMD.FRIEND..','..s..'}'
	end;
}):new()

ExchangeHeroExpSender = MsgSender:extends({
	sendTodayTimes = function(self, player)
		local todayTimes = player:getCitys():getExchangeExpTodayTimes()
		local s = 'todaytimes:{cur:' .. todayTimes.curTimes .. ',max:' .. todayTimes.maxTimes .. '}'
		player:sendMsg( '{cmd:'..NETCMD.EXCHANGEEXP..','..s..'}' )
	end;
}):new()

FightResStateSender = MsgSender:extends({
	sendAllStates = function(self, player)
		local s = ''
		
		local roleId = player:getRoleId()
		local targets = Repository:getFightState():getRoleMap(roleId)
		for _, targetRoleId in ipairs(targets) do
			local stateObj = Repository:getFightState():getStateObj(roleId, targetRoleId)
			if stateObj ~= nil then
				if s ~= '' then 
					s = s..',' 
				end
				s = s..self:_makeStateObj(stateObj, targetRoleId)
			end
		end
		
		if s == '' then return end
		
		player:sendMsg( self:_makeMsg('states:[' .. s ..']') )
	end;
	
	sendState = function(self, player, targetRoleId)
		if not player:isRole() or player == NullPlayer then
			return
		end
		
		local stateObj = Repository:getFightState():getStateObj(player:getRoleId(), targetRoleId)
		if stateObj == nil then
			player:sendMsg( self:_makeMsg('states:[{id:' .. targetRoleId .. ',_d:1}]') )
		else
			player:sendMsg( self:_makeMsg('states:[' .. self:_makeStateObj(stateObj, targetRoleId) ..']') )
		end
	end;
	
	_makeStateObj = function(self, stateObj, targetRoleId)
		return '{id:' .. targetRoleId .. ',state:' .. stateObj.state .. ',stoptime:' .. stateObj.stopTime .. '}'
	end;
	
	_makeMsg = function(self, s)
		return '{cmd:'..NETCMD.FIGHTREFSTATE..','..s..'}'
	end;
}):new()

RoleStateSender = MsgSender:extends({
	sendStates = function(self, player)
		local s = ''
		local container = player:getStateContainer()
		for i=1, container:getStatesCount(), 1 do
			local state = container:getStateByIdx(i)
			s = s .. self:_getAddStateStr(state)
		end
		
		if s == '' then return end
		player:sendMsg( self:_makeStatesMsg(s) )
	end;
	
	sendAddState = function(self, player, state)
		local s = self:_getAddStateStr(state)
		if s == '' then return end
		player:sendMsg( self:_makeStatesMsg(s) )
	end;
	
	sendDelState = function(self, player, state)
		local s = self:_getDeleteStateStr(state)
		if s == '' then return end
		player:sendMsg( self:_makeStatesMsg(s) )
	end;
	
	_getAddStateStr = function(self, state)
		if state:getType() == EFFECT_TYPE.ONETIME then  return ''  end
		return ',{uid:'..state:getId()..',id:'..state:getEffectId()..',val:' .. state:getEffectVal() .. ',stoptime:'..state:getStopTime()..',target:{type:'..RES_TRG.MYCITY..'}}'
	end;
	
	_getDeleteStateStr = function(self, state)
		if state:getType() == EFFECT_TYPE.ONETIME then  return ''  end
		return ',{uid:'..state:getId()..',_d:1}'
	end;
	
	_makeStatesMsg = function(self, s)
		return '{cmd:'..NETCMD.ROLESTATE..',states:[{_k:"uid"}'..s..']}'
	end;
}):new()

ChatSender = MsgSender:extends({
	sendMsg = function(self, player, fromCityId, fromId, fromName, appendInfo, channel, msg)
		msg = string.gsub(msg, '\"', '\'')
		local fromInfoS = self:_makeAppendInfo(appendInfo)
		local sendmsg = '{cmd:'..NETCMD.CHAT..',fromCityId:' .. fromCityId .. ',fromId:' .. fromId .. ',fromName:"' .. fromName .. '",fromInfo:' .. fromInfoS .. ',channel:' .. channel .. ',msg:"' .. msg .. '"}'
		player:sendMsg(sendmsg)
	end;
	
	sendPlayerMsg = function(self, player, fromId, fromName, fromAppend, toId, toName, toAppend, channel, msg)
		msg = string.gsub(msg, '\"', '\'')
		local fromInfoS = self:_makeAppendInfo(fromAppend)
		local toInfoS = self:_makeAppendInfo(toAppend)
		local sendmsg = '{cmd:'..NETCMD.CHAT..',fromId:' .. fromId .. ',fromName:"' .. fromName .. '",fromInfo:' .. fromInfoS .. ',toId:' .. toId .. ',toName:"' .. toName .. '",toInfo:' .. toInfoS .. ',channel:' .. channel .. ',msg:"' .. msg .. '"}'
		player:sendMsg(sendmsg)
	end;
	
	_makeAppendInfo = function(self, info)
		return '{vip:' .. info.vip .. ',blue:{level:' .. info.blue.level  .. ',year:' .. info.blue.year  .. ',super_:' .. info.blue.super  .. ',grow:' .. info.blue.grow .. '}}'
	end;
}):new()

AllianceSender = MsgSender:extends({
	sendCreateAlliance = function(self, player)
		local sendmsg = self:_makeMsg('create:{result:0,allipos:'..ALLI_POS.LEADER..'}')
		player:sendMsg(sendmsg)
	end;
	
	sendApplyListToLeaders = function(self, alliance)
		local msg = self:_makeApplyListStr(alliance:getApplyRoleIdsSet())
		local count = alliance:getMemberCount()
		for i=0, count-1, 1 do
			local member = alliance:getMemberByIdx(i)
			if member:getAlliPos() ~= ALLI_POS.MEM then
				local player = ArmyPlayerGetter:getOnlinePlayer(OBJ_TYPE.ROLE, member:getId())
				player:sendMsg(msg)
			end
		end	
	end;
	
	sendApplyListToPlayer = function(self, player, alliance)
		local msg = self:_makeApplyListStr(alliance:getApplyRoleIdsSet())
		player:sendMsg(msg)
	end;
	
	sendDeleteApply = function(self, player, roleId)
		local s = '{_k:"roleId"},{roleId:' .. roleId .. ',_d:1}'
		player:sendMsg(self:_makeMsg('applys:[' .. s .. ']'))
	end;
	
	sendCurApplying = function(self, player)
		local sendmsg = self:_makeMsg('applyinfo:{alli:"' .. player:getCurApplyAlliance() .. '"}')
		player:sendMsg(sendmsg)
	end;
	
	sendGetInviteList = function(self, player)
		local s = '{_k:"alliId"}'
		local set = player:getInviteJoinAlliances()
		local count = set:getCount()
		for i=0, count-1, 1 do
			local node = set:get(i)
			s = s .. ',{' 
			s = s .. 'desc:"' .. self:_makeInviteDesc(node.roleId, node.allianceId) .. '"'
			s = s .. ',roleId:' .. node.roleId
			s = s .. ',alliId:' .. node.allianceId
			s = s .. '}'
		end
		
		local sendmsg = self:_makeMsg('inviteinfo:[' .. s .. ']')
		player:sendMsg(sendmsg)
	end;
	
	sendDeleteInvite = function(self, player, allianceId)
		local sendmsg = self:_makeMsg('inviteinfo:[{_k:"alliId"},{alliId:' .. allianceId .. ',_d:1}]')
		player:sendMsg(sendmsg)
	end;
	
	sendAllianceDetail = function(self, player, alliance)
		local s = 'detail:{'
		s = s .. self:_makeAllianceCommonDetail(alliance)
		s = s .. '}'
		player:sendMsg( self:_makeMsg(s) )
	end;
	
	sendAlliances = function(self, player, cityResId, alliances, startIdx, pageCount, pageNo, selectIdx, ranks)
		local alliancesStr = ''
		for i, a in ipairs(alliances) do
			if alliancesStr ~= '' then alliancesStr = alliancesStr .. ',' end
			local level = a:getLevel()
			local honour = a:getHonour()
			if ranks ~= nil then
				level = ranks[i].lastLevel
				honour = ranks[i].lastHonour
			end
			
			alliancesStr = alliancesStr .. '{'
			alliancesStr = alliancesStr .. 'rank:' .. (startIdx + i )
			alliancesStr = alliancesStr .. ',name:"' .. a:getName() .. '"'
			alliancesStr = alliancesStr .. ',cityResId:' .. a:getCityResId()
			alliancesStr = alliancesStr .. ',leader:"' .. a:getLeader() .. '"'
			alliancesStr = alliancesStr .. ',level:' .. level
			alliancesStr = alliancesStr .. ',mem:' .. a:getMemberCount()
			alliancesStr = alliancesStr .. ',honour:' .. honour
			alliancesStr = alliancesStr .. '}'
		end
		player:sendMsg( self:_makeMsg('cityResId:' .. cityResId .. ',alliances:[' .. alliancesStr .. '],pageNo:' .. pageNo .. ',pageCount:' .. pageCount .. ',curSelIdx:' .. selectIdx ) )
	end;
	
	sendSelfAlliMems = function(self, player, alliance, mems, pageCnt, pageNo)
		self:_sendSelfAlliMems(player, alliance, mems, pageCnt, pageNo, 'selfmems')
	end;
	
	sendTodaySortMems = function(self, player, alliance, mems, pageCnt, pageNo)
		self:_sendSelfAlliMems(player, alliance, mems, pageCnt, pageNo, 'todaysortmems')
	end;
	
	sendAllSortMems = function(self, player, alliance, mems, pageCnt, pageNo)
		self:_sendSelfAlliMems(player, alliance, mems, pageCnt, pageNo, 'allsortmems')
	end;
	
	_sendSelfAlliMems = function(self, player, alliance, mems, pageCnt, pageNo, tag)
		local s = self:_makeSelfMembersStr(mems)
		if s == '' then return end
		
		if not self:_isManager(alliance, player) then
			s = self:_filtLoginTime(s)
		end
		
		player:sendMsg( self:_makeMsg(tag..':[' .. s .. '],pageCount:' .. pageCnt .. ',pageNo:' .. pageNo) )	
	end;
	
	sendOtherAlliMems = function(self, player, alliance, mems, pageCnt, pageNo)
		local s = self:_makeOtherMembersStr(mems)
		if s == '' then return end
		
		player:sendMsg( self:_makeMsg('mems:[' .. s .. '],pageCount:' .. pageCnt .. ',pageNo:' .. pageNo .. ',cityResId:' .. alliance:getCityResId()) )
	end;
	
	sendSelfAllianceDetail = function(self, player, alliance)
		player:sendMsg( self:_makeAllianceSelfDetail(alliance) )
	end;
	
	sendSelfAllianceDetailToMembers = function(self, alliance)
		local msg = self:_makeAllianceSelfDetail(alliance)
		local count = alliance:getMemberCount()
		for i=0, count-1, 1 do
			local member = alliance:getMemberByIdx(i)
			local player = ArmyPlayerGetter:getOnlinePlayer(OBJ_TYPE.ROLE, member:getId())
			player:sendMsg(msg)
		end			
	end;
	
	sendAlliEvents = function(self, player, events, pageCnt, pageNo)
		local s = ''
		for _, event in ipairs(events) do
			if s ~= '' then s = s .. ',' end
			s = s .. '{desc:"' .. event.event .. '",time:' .. event.createTime .. '}'
		end
		player:sendMsg( self:_makeMsg('events:{list:[' .. s .. '],pageCount:' .. pageCnt .. ',pageNo:' .. pageNo .. '}') )
	end;
	
	_makeAllianceSelfDetail = function(self, alliance)
		local s = self:_makeAllianceCommonDetail(alliance)
		s = s .. self:_makeAllianceAppendDetail(alliance)
		s = s .. ',' .. self:_makeAllianceUpgrade(alliance)
		s = s .. ',' .. self:_makeAllianceTransfer(alliance)
		s = s .. ',' .. self:_makeAllianceDismiss(alliance)
		return self:_makeMsg('mydetail:{' .. s .. '}')
	end;
	
	sendSelfMember = function(self, player, alliance)
		local selfmem = alliance:getMemberById( player:getRoleId() )
		
		local gainGift = selfmem:getGainGift()
		local feed = selfmem:getFeed()
		
		local s = 'alliPos:' .. selfmem:getAlliPos()
		s = s .. ',contributes:' .. selfmem:getContributes()
		s = s .. ',gainGift:{count:' .. gainGift.count .. ',lastTime:' .. gainGift.lastTime .. '}'
		s = s .. ',feed:{count:' .. feed.count .. ',lastTime:' .. feed.lastTime .. '}'
		
		player:sendMsg( self:_makeMsg('selfmem:{' .. s .. '}') )
	end;
	
	sendSelfContributes = function(self, player, alliance)
		local selfmem = alliance:getMemberById( player:getRoleId() )
		local s = 'contributes:' .. selfmem:getContributes()
		player:sendMsg( self:_makeMsg('selfmem:{' .. s .. '}') )
	end;
	
	sendSelfLawLight = function(self, player, alliance)
		local lawLight = alliance:getLawLight()
		local s = 'level:' .. lawLight:getLevel() .. ',growup:{val:' .. lawLight:getGrowupVal() .. '}'
		player:sendMsg( self:_makeMsg('lawlight:{' .. s .. '}') )
	end;
	
	sendALeaders = function(self, player, alliance)
		local s = ''
		local memCount = alliance:getMemberCount()
		for i=0, memCount-1, 1 do
			local mem = alliance:getMemberByIdx(i)
			if mem:getAlliPos() == ALLI_POS.ALEADER then
				local grid = app:getCityMgr():getGridByRoleId( mem:getId() )
				if grid ~= nil then
					if s ~= '' then s = s .. ',' end
					s = s .. '"' .. grid.roleName .. '"'
				end
			end
		end
		player:sendMsg( self:_makeMsg('aleaders:[' .. s .. ']') )
	end;
	
	sendApplyMerges = function(self, player, alliance)
		local s = '{_r:1}'
		local set = alliance:getApplyMergesSet()
		for i=set:getCount()-1, 0, -1 do
			local allianceId = set:get(i)
			local alliance = app:getAlliMgr():getAlliById(allianceId)
			if alliance:isNull() then
				set:remove(allianceId)
			else
				s = s .. ',{'
				s = s .. 'id:' .. allianceId
				s = s .. ',name:"' .. alliance:getName() .. '"'
				s = s .. ',level:' .. alliance:getLevel()
				local leaderMem = AllianceUtil:searchLeader(alliance)
				s = s .. ',leader:"' .. app:getCityMgr():getRoleNameByRoleId(leaderMem:getId()) .. '"'
				s = s .. '}'
			end
		end
		
		player:sendMsg( self:_makeMsg('applymerges:[' .. s .. ']') )
	end;
	
	sendAuctionItems = function(self, player, alliance)
		local s = ''
		local itemPkg = alliance:getItemPkg()
		for i=0, itemPkg:getItemCount()-1 do
			local item = itemPkg:getItemByIdx(i)
			if s ~= '' then s = s .. ',' end
			s = s .. self:_makePkgItem(player, item)
		end
		player:sendMsg( self:_makeMsg('auction:{items:[' .. s .. ']}') )
	end;
	
	sendAuctionItem = function(self, player, alliance, itemId)
		local itemPkg = alliance:getItemPkg()
		local item = itemPkg:getItemById(itemId)
		if item == nil then return end

		local s = self:_makePkgItem(player, item)
		
		player:sendMsg( self:_makeMsg('auction:{items:[' .. s .. ']}') )
	end;
	
	sendDelAuctionItem = function(self, player, alliance, itemId)
		player:sendMsg( self:_makeMsg('auction:{items:[{id:' .. itemId .. ',_d:1}]}') )
	end;
	
	sendMySellingItem = function(self, player, alliance, itemId)
		local itemPkg = alliance:getItemPkg()
		local item = itemPkg:getItemById(itemId)
		if item == nil then return end

		local s = self:_makeMySellingItem(player, item)
		player:sendMsg( self:_makeMsg('sellingItems:[' .. s .. ']') )	
	end;
	
	sendMySellingItems = function(self, player, alliance)
		local s = ''
		local itemPkg = alliance:getItemPkg()
		for i=0, itemPkg:getItemCount()-1 do
			local item = itemPkg:getItemByIdx(i)
			if item.seller == player:getRoleName() then
				if s ~= '' then s = s .. ',' end
				s = s .. self:_makeMySellingItem(player, item)
			end
		end
		player:sendMsg( self:_makeMsg('sellingItems:[' .. s .. ']') )
	end;
	
	sendDelMySellingItem = function(self, player, alliance, itemId)
		player:sendMsg( self:_makeMsg('sellingItems:[{id:' .. itemId .. ',_d:1}]') )
	end;
	
	_makePkgItem = function(self, player, item)
		local sitems = '{'
		sitems = sitems .. 'id:' .. item.id
		sitems = sitems .. ',resid:' .. item.resid
		sitems = sitems .. ',num:' .. item.num
		if item.buyer == player:getRoleName() then
			sitems = sitems .. ',ismy:1'
		else
			sitems = sitems .. ',ismy:0'
		end
		if item.boss == 1 then
			sitems = sitems .. ',isboss:1'
			sitems = sitems .. ',owner:""'
			sitems = sitems .. ',auction:' .. item.cur
		else
			sitems = sitems .. ',isboss:0'
			sitems = sitems .. ',owner:"' .. item.seller .. '"'
			sitems = sitems .. ',auction:' .. item.cur
		end
		sitems = sitems .. ',fixed:' .. item.fixed
		sitems = sitems .. ',stopTime:' .. item.sptime
		sitems = sitems .. '}'
		return sitems
	end;
	
	_makeMySellingItem = function(self, player, item)
		local sitems = '{'
		sitems = sitems .. 'id:' .. item.id
		sitems = sitems .. ',resid:' .. item.resid
		sitems = sitems .. ',number:' .. item.num
		if item.buyer == '' then
			sitems = sitems .. ',doing:0'
		else
			sitems = sitems .. ',doing:1'
		end
		sitems = sitems .. ',cur:' .. item.cur
		sitems = sitems .. ',fixed:' .. item.fixed
		sitems = sitems .. ',stopTime:' .. item.sptime
		sitems = sitems .. '}'
		return sitems	
	end;
	
	_makeInviteDesc = function(self, roleId, allianceId)
		local grid = app:getCityMgr():getGridByRoleId(roleId)
		local roleName = '--'
		if grid ~= nil then
			roleName = grid.roleName
		end
		local alliance = app:getAlliMgr():getAlliById(allianceId)
		return string.format(rstr.alliance.invitejion, roleName, alliance:getName())
	end;
	
	_makeApplyListStr = function(self, roleIdsSet)
		local s = '{_k:"roleId"}'
		local count = roleIdsSet:getCount()
		for i=0, count-1 do
			local grid = app:getCityMgr():getGridByRoleId( roleIdsSet:get(i) )
			if grid ~= nil then
				s = s .. ',{'
				s = s .. 'roleId:' .. grid.roleId
				s = s .. ',roleName:"' .. grid.roleName .. '"'
				s = s .. ',level:' .. grid.level
				s = s .. ',buildVal:' .. grid.buildCurVal
				s = s .. '}'
			end
		end
		return self:_makeMsg('applys:[' .. s .. ']')
	end;
	
	_makeSelfMembersStr = function(self, members)
		local s = ''
		for _, member in ipairs(members) do
			if s ~= '' then s = s .. ',' end
			s = s .. self:_makeSelfMemberStr(member)
		end
		return s
	end;
	
	_makeSelfMemberStr = function(self, member)
		local grid = app:getCityMgr():getGridByRoleId( member:getId() )
		if grid == nil then 
			return ''
		end
		
		local s = '{'
		s = s .. 'roleId:' .. member:getId()
		s = s .. ',icon:' .. grid.icon
		s = s .. ',gridId:' .. grid.gridId
		s = s .. ',name:"' .. grid.roleName .. '"'
		s = s .. ',totalRes:' .. member:getTotalRes()
		s = s .. ',totalCard:' .. member:getTotalCard()
		s = s .. ',todayRes:' .. member:getTodayRes()
		s = s .. ',todayCard:' .. member:getTodayCard()
		s = s .. ',alliPos:' .. member:getAlliPos()
		s = s .. ',contributes:' .. member:getContributes()
		s = s .. ',level:' .. grid.level
		s = s .. ',buildCurVal:' .. grid.buildCurVal
		s = s .. ',roleRank:' .. grid.roleRank
		s = s .. ',loginTime:' .. grid.loginTime
		s = s .. ',died:' .. ((grid.objType == OBJ_TYPE.DIED_ROLE) and 1 or 0)
		s = s .. '}'
		return s
	end;
	
	_makeOtherMembersStr = function(self, members)
		local s = ''
		for _, member in ipairs(members) do
			if s ~= '' then s = s .. ',' end
			s = s .. self:_makeOtherMemberStr(member)
		end
		return s
	end;
	
	_makeOtherMemberStr = function(self, member)
		local grid = app:getCityMgr():getGridByRoleId( member:getId() )
		if grid == nil then 
			return ''
		end
		
		local s = '{'
		s = s .. 'roleId:' .. member:getId()
		s = s .. ',gridId:' .. grid.gridId
		s = s .. ',name:"' .. grid.roleName .. '"'
		s = s .. ',alliPos:' .. member:getAlliPos()
		s = s .. ',level:' .. grid.level
		s = s .. ',roleRank:' .. grid.roleRank
		s = s .. '}'
		return s
	end;
	
	_makeAllianceCommonDetail = function(self, alliance)
		local s = 'name:"' .. alliance:getName() .. '"'
		s = s .. ',level:' .. alliance:getLevel()
		s = s .. ',flag:"' .. alliance:getFlag() .. '"'
		s = s .. ',leader:"' .. alliance:getLeader() .. '"'
		s = s .. ',cityResId:' .. alliance:getCityResId()
		s = s .. ',mem:' .. alliance:getMemberCount()
		s = s .. ',buildVal:' .. alliance:getBuildVal()
		s = s .. ',card:' .. alliance:getCardNumber()
		s = s .. ',honour:' .. alliance:getHonour()
		s = s .. ',introduction:"' .. alliance:getIntroduction() .. '"'
		return s
	end;
	
	_makeAllianceAppendDetail = function(self, alliance)
		local s = ',rank:' .. alliance:getRank()
		s = s .. ',qqGroup:"' .. alliance:getQQGroup() .. '"'
		s = s .. ',bulletin:"' .. alliance:getBulletin() .. '"'
		return s
	end;
	
	_makeAllianceUpgrade = function(self, alliance )
		return 'upgrade:{startTime:' .. alliance:getUpgradeStartTime() .. ',stopTime:' .. alliance:getUpgradeStopTime() .. '}'
	end;
	
	_makeAllianceTransfer = function(self, alliance )
		return 'transfer:{name:"' .. alliance:getTransferTarget() .. '",startTime:' .. alliance:getTransferStartTime() .. ',stopTime:' .. alliance:getTransferStopTime() .. '}'
	end;
	
	_makeAllianceDismiss = function(self, alliance)
		return 'dismiss:{startTime:' .. alliance:getDismissStartTime() .. ',stopTime:' .. alliance:getDismissStopTime() .. '}'
	end;
	
	_isManager = function(self, alliance, player)
		local count = alliance:getMemberCount()
		for i=0, count-1, 1 do
			local mem = alliance:getMemberByIdx(i)
			if mem:getId() == player:getRoleId() then
				return mem:getAlliPos() > ALLI_POS.MEM
			end
		end
		return false
	end;
	
	_filtLoginTime = function(self, msg)
		return string.gsub(msg, 'loginTime:%d+', 'loginTime:0')
	end;
	
	_makeMsg = function(self, s)
		return '{cmd:'..NETCMD.ALLIANCE..',' .. s .. '}'
	end;
}):new()

OtherPlayerInfoSender = MsgSender:extends({
	sendBuildAddSpeed = function(self, player, target)
		local level = target:getCitys():getBuildLevelByResId(FIXID.ALLIINBUILD)
		player:sendMsg( self:_makeMsg('buildAddSpeed:{val:' .. (0.1*level) .. '}') )
	end;
	
	_makeMsg = function(self, s)
		return '{cmd:'..NETCMD.OTHERPLAYERINFO..',' .. s .. '}'
	end;
}):new()

TradingAreaSender = MsgSender:extends({
	sendStopTime = function(self, player)
		local s = self:_makeTradingMsg('stopTime:' .. player:getTradingArea():getStopTime() )
		player:sendMsg(s)
	end;
	
	sendBaseInfo = function(self, player)
		local tradingArea = player:getTradingArea()
		local s = self:_makeTradingMsg('rate:' .. tradingArea:getRate() .. ',maxCitys:' .. tradingArea:getMaxCitys() .. ',capacity:' .. tradingArea:getCapacity() )
		player:sendMsg(s)
	end;
	
	sendTargets = function(self, player)
		local tradingArea = player:getTradingArea()
		local targetsSet = tradingArea:getTargetsSet()
		local ts = ''
		local count = targetsSet:getCount()
		for i=0, count-1, 1 do
			local grid = app:getCityMgr():getGridByRoleId(targetsSet:get(i))
			ts = self:_makeMember(ts, player, grid)
		end
		
		local s = 'totalDis:' .. tradingArea:getTotalDistance()
		s = s .. ',needTime:' .. tradingArea:getTotalNeedTime()
		s = s .. ',gain:' .. tradingArea:getTotalGainMoney()
		s = s .. ',targets:[{_r:1}' .. ts .. ']'
		player:sendMsg( self:_makeTradingMsg(s) )
	end;
	
	sendMembers = function(self, player)
		local alliance = app:getAlliMgr():getAlliById(player:getAlliId())
		if alliance:isNull() then
			return 
		end
		
		local ts = ''
		local count = alliance:getMemberCount()
		for i=0, count-1, 1 do
			local member = alliance:getMemberByIdx(i)
			local grid = app:getCityMgr():getGridByRoleId(member:getId())
			ts = self:_makeMember(ts, player, grid)
		end	
		
		player:sendMsg( self:_makeMsg('mems:[{_r:1}' .. ts .. ']') )
	end;
	
	sendDetailMember = function(self, player, grid)
		local needTime = player:getTradingArea():getNeedTime(grid)
		local gain = player:getTradingArea():getFactGain(grid)
		player:sendMsg( self:_makeMsg('mems:[{_k:"roleId"},{roleId:' .. grid.roleId .. ',isDetail:1,needTime:' .. needTime .. ',gain:' .. gain .. '}]') )
	end;
	
	sendTodayTimes = function(self, player)
		local tradingArea = player:getTradingArea()
		local s = 'todayTimes:{cur:' .. tradingArea:getTodayTimes() .. ', max:' .. tradingArea:getMaxTimes() .. '}'
		player:sendMsg( self:_makeTradingMsg(s) )
	end;
	
	_makeMember = function(self, outstr, fromPlayer, grid)
		if grid == nil then return outstr end
			
		outstr = outstr .. ',{'
		outstr = outstr .. 'roleId:' .. grid.roleId
		outstr = outstr .. ',roleName:"' .. grid.roleName .. '"'
		outstr = outstr .. ',gridId:' .. grid.gridId
		outstr = outstr .. ',buildLevel:' .. grid.misc.shiChangLevel
		outstr = outstr .. ',distance:' .. fromPlayer:getTradingArea():getTargetDistance(grid)
		outstr = outstr .. '}'
		return outstr
	end;
	
	_makeTradingMsg = function(self, s)
		return '{cmd:'..NETCMD.TRADING_AREA..',trading:{' .. s .. '}}'
	end;
	
	_makeMsg = function(self, s)
		return '{cmd:'..NETCMD.TRADING_AREA..',' .. s .. '}'
	end;
}):new()

ActTowerSender = Class:extends({
	sendBaseInfo = function(self, player)
		local actTower = player:getActTower()
		local maxTimes = res_act_tower_enter_times + app:getSvrAct():getAdditionByActType(SVR_TODAY_ACT_TYPE.ACT_TOWER_TIMES_1)
		local freeTimes = math.min(maxTimes, actTower:getTodayEnterTimes())
		local itemTimes =  math.max(0, actTower:getTodayEnterTimes() - maxTimes)
		local s = 'baseInfo:{today:{maxTimes:' .. maxTimes .. ',freeTimes:' .. freeTimes .. ', itemTimes:' .. itemTimes .. '}, maxLayer:' .. actTower:getMaxLayer() .. '}'
		player:sendMsg( self:_makeMsg(s) )
	end;
	
	sendRanks = function(self, player, pageNo, onePageCnt, selectIdx)
		local  pageCount = app:getActTowerRank():getPageCount(onePageCnt)
		local ranks = app:getActTowerRank():selectRanks(pageNo, onePageCnt)
		local s = ''
		for _, grid in ipairs(ranks) do
			if s ~= '' then s = s .. ',' end
			s = s .. '{'
			s = s .. 'rank:' .. grid.misc.towerRank
			s = s .. ',name:"' .. grid.roleName .. '"'
			s = s .. ',gridId:' .. grid.gridId
			s = s .. ',roleId:' .. grid.roleId
			s = s .. ',maxLayer:' .. grid.misc.lastTowerLayer
			s = s .. ',maxTime:' .. grid.misc.lastTowerTime
			s = s .. '}'
		end
		player:sendMsg( self:_makeMsg('ranks:[' .. s .. '],pageNo:' .. pageNo .. ',pageCount:' .. pageCount .. ',curSelIdx:' .. selectIdx) )
	end;
	
	sendEnterTower = function(self, player, fightDemo, lastLayerInfo, isExit)
		local actTower = player:getActTower()
		local s = 'enterTower:{'
		s = s .. 'curLayer:' .. actTower:getCurLayer()
		s = s .. ',leftLifes:' .. actTower:getLeftLifes()
		s = s .. ',stopTime:' .. actTower:getStopTime()
		
		if fightDemo ~= nil then
			s = s .. ',fightDemo:' .. toJIONString(fightDemo)
		end
		
		if lastLayerInfo ~= nil then
			s = s .. ',lastLayerInfo:' .. toJIONString(lastLayerInfo)
		end
		
		if isExit == true then
			s = s .. ',isExit:1'
		end
		
		s = s .. '}'
		player:sendMsg( self:_makeMsg(s) )
	end;
	
	sendExitTower = function(self, player)
		self:sendEnterTower(player, nil, nil, true)
	end;
	
	sendInAutoFightState = function(self, player)
		local toLayer = player:getActTower():getAutoToLayer()
		player:sendMsg( self:_makeMsg('autoFight:1,autoToLayer:' .. toLayer) )
	end;

	_makeMsg = function(self, s)
		return '{cmd:'..NETCMD.ACT_TOWER..',' .. s .. '}'
	end;
}):new()

ActTerraceSender = Class:extends({
	sendBaseInfo = function(self, player)
		local actTerrace = player:getActTerrace()
		local maxTimes = res_act_terrace_enter_times + app:getSvrAct():getAdditionByActType(SVR_TODAY_ACT_TYPE.ACT_TERRACE_TIMES_1)
		local freeTimes = math.min(maxTimes, actTerrace:getTodayEnterTimes())
		local itemTimes =  math.max(0, actTerrace:getTodayEnterTimes() - maxTimes)
		local curGate = actTerrace:getCurGate()
		local maxGate = actTerrace:getMaxGate()
		local s = 'baseInfo:{today:{maxTimes:' .. maxTimes .. ',freeTimes:' .. freeTimes .. ', itemTimes:' .. itemTimes .. '},curGate:' .. self:_makeGate(curGate) .. ',maxGate:' .. self:_makeGate(maxGate) .. '}'
		player:sendMsg( self:_makeMsg(s) )
	end;
	
	sendResult = function(self, player, idx)
		local actTerrace = player:getActTerrace()
		local s = 'results:[{id:' .. (idx + 1) .. ',result:' .. actTerrace:getResultByIdx(idx) .. '}]'
		player:sendMsg( self:_makeMsg(s) )
	end;
	
	sendResults = function(self, player)
		local s = ''
		local actTerrace = player:getActTerrace()
		for i=0, actTerrace:getResultCount()-1, 1 do
			if s ~= '' then s = s..',' end
			s = s .. '{id:' .. (i + 1) .. ',result:' .. actTerrace:getResultByIdx(i) .. '}'
		end
		player:sendMsg( self:_makeMsg('results:[' .. s .. ']') )
	end;
	
	sendEnterTerrace = function(self, player, fightDemo, isExit)
		local actTerrace = player:getActTerrace()
		local s = 'enterTerrace:{'
		s = s .. 'curGate:' .. self:_makeGate(actTerrace:getCurGate())
		s = s .. ',leftLifes:' .. actTerrace:getLeftLifes()
		s = s .. ',stopTime:' .. actTerrace:getStopTime()
		
		if fightDemo ~= nil then
			s = s .. ',fightDemo:' .. toJIONString(fightDemo)
		end
		
		if isExit == true then
			s = s .. ',isExit:1'
		end
		
		s = s .. '}'
		player:sendMsg( self:_makeMsg(s) )
	end;
	
	sendExitTerrace = function(self, player)
		self:sendEnterTerrace(player, nil, true)
	end;
	
	sendInAutoFightState = function(self, player)
		local toGate = player:getActTerrace():getAutoToSubGateId()
		player:sendMsg( self:_makeMsg('autoFight:1,autoToGate:' .. toGate) )
	end;
	
	_makeGate = function(self, gate)
		return '{gateId:' .. gate.gateId .. ',subGateId:' .. gate.subGateId .. '}'
	end;

	_makeMsg = function(self, s)
		return '{cmd:'..NETCMD.ACT_TERRACE..',' .. s .. '}'
	end;
}):new()

StateCitySender = Class:extends({
	sendMapView = function(self, player)
		player:sendMsg( self:_makeMsg('mapview:{x1:' .. res_mapview[1] .. ',y1:' ..res_mapview[2] .. ',x2:' .. res_mapview[3] .. ',y2:' .. res_mapview[4] .. '}') )
	end;
	
	sendEnter = function(self, player, cityId)
		player:sendMsg( self:_makeMsg('entercity:{id:' .. cityId .. '}') )
	end;
	
	sendNpcs = function(self, player, cityId)
		local resNpcs = res_citys_npcs[1].npcs
		local s = ''
		for _, npc in ipairs(resNpcs) do
			if s ~= '' then s = s .. ',' end
			s = s .. '{id:' .. npc.id .. ',pos:{x:' .. npc.pos.x .. ',y:' .. npc.pos.y .. '}}'
		end
		player:sendMsg( self:_makeMsg('npcs:{cityid:' .. cityId .. ',add:[' .. s .. ']}') )
	end;
	
	_makeMsg = function(self, s)
		return '{cmd:'..NETCMD.MAP..',' .. s .. '}'
	end;
}):new()

TaskSender = Class:extends({
	sendEveryDayTask = function(self, player, taskIdx)
		local task = player:getTask():getEveryDayTask():getTask(taskIdx)
		local s = '{id:' .. self:_makeEveryDayTaskId(task.taskId, taskIdx) .. ',state:' .. task.state .. '}'
		player:sendMsg( self:_makeMsg('tasks:[' .. s .. ']') )
	end;
	
	sendDelEveryDayTask = function(self, player, taskIdx)
		local task = player:getTask():getEveryDayTask():getTask(taskIdx)
		local s = '{id:' .. self:_makeEveryDayTaskId(task.taskId, taskIdx) .. ',_d:1}'
		player:sendMsg( self:_makeMsg('tasks:[' .. s .. ']') )
	end;
	
	sendDelEveryDayTasks = function(self, player)
		local everyday = player:getTask():getEveryDayTask()
		local count = everyday:getTaskCount()
		local s = '{_k:"id"}'
		for i=1, count, 1 do
			local task = everyday:getTask(i)
			s = s .. ',{id:' .. self:_makeEveryDayTaskId(task.taskId, i) .. ',_d:1}'
		end
		player:sendMsg( self:_makeMsg('tasks:[' .. s .. ']') )
	end;
	
	sendEveryDayTasks = function(self, player)
		local everyday = player:getTask():getEveryDayTask()
		local count = everyday:getTaskCount()
		local s = '{_k:"id"}'
		for i=1, count, 1 do
			local task = everyday:getTask(i)
			s = s .. ',{id:' .. (task.taskId*100 + i) .. ',state:' .. task.state .. '}'
		end
		player:sendMsg( self:_makeMsg('tasks:[' .. s .. ']') )
	end;
	
	sendDoingRoleTask = function(self, player)
		local doing = player:getTask():getDoingRoleTask()
		local s = 'roleTask:{doing:{id:' .. doing:getTaskId() .. ', stopTime:' .. doing:getStopTime() .. '},cdStopTime:' .. doing:getCDStopTime() .. '}'
		player:sendMsg( self:_makeMsg(s) )
	end;
	
	sendCommTask = function(self, player, taskId, state)
		local s = '{id:' .. taskId .. ',state:' .. state .. '}'
		player:sendMsg( self:_makeMsg('tasks:[' .. s .. ']') )
	end;
	
	sendCommTasks = function(self, player)
		local tasks = player:getTask():getCommTasks()
		local count = tasks:getCount()
		local s = '{_k:"id"}'
		for i=0, count-1, 1 do
			local task = tasks:get(i)
			s = s .. ',{id:' .. task.taskId .. ',state:' .. task.state .. '}'
		end
		player:sendMsg( self:_makeMsg('tasks:[' .. s .. ']') )
	end;
	
	sendPrestigeTask = function(self, player)
		local s = 'prestigeTask:{lastTime:' .. player:getTask():getPrestigeLastTime() .. '}'
		player:sendMsg( self:_makeMsg(s) )
	end;
	
	sendActValTasks = function(self, player)
		local actVal = player:getTask():getActivityVal()
		local count = actVal:getTaskCount()
		local s = '{_k:"id"}'
		for i=1, count, 1 do
			local task = actVal:getTask(i)
			s = s .. ',{id:' .. task.taskId .. ',times:' .. task.times .. '}'
		end
		player:sendMsg( self:_makeMsg('tasks:[' .. s .. ']') )
	end;
	
	sendActValTask = function(self, player, taskId, times)
		player:sendMsg( self:_makeMsg('tasks:[{id:' .. taskId .. ',times:' .. times .. '}]') )
	end;
	
	sendOnlineTask = function(self, player)
		local onlineTask = player:getTask():getOnlineTask()
		player:sendMsg( self:_makeMsg('onlinetask:{id:' .. onlineTask:getTaskId() .. ',stopTime:' .. onlineTask:getTaskStopTime() .. '}') )
	end;
	
	sendActTasks = function(self, player)
		local tasks = player:getTask():getActTask():getTasks()
		local count = tasks:getCount()
		local s = '{_k:"id"}'
		for i=0, count-1, 1 do
			local task = tasks:get(i)
			s = s .. ',{id:' .. task.taskId .. ',state:' .. task.state .. '}'
		end
		player:sendMsg( self:_makeMsg('tasks:[' .. s .. ']') )
	end;
	
	sendActTask = function(self, player, taskId)
		local task = player:getTask():getActTask():getTaskById(taskId)
		player:sendMsg( self:_makeMsg('tasks:[' .. '{id:' .. task.taskId .. ',state:' .. task.state .. '}' .. ']') )
	end;
	
	sendDelActTask = function(self, player, taskId)
		local subBuf = SB:alloc()
		subBuf:format('tasks:[{id:%d,_d:1}]', taskId)
		local msgBuf = self:_makeMsgEx( subBuf:get() )
		player:sendMsg( msgBuf:get() )
		SB:free()
	end;
	
	sendStartGlobalTip = function(self, player)
		local buf = SB:alloc()
		buf:puts('startGTip:1')
		local msgBuf = self:_makeMsgEx( buf:get() )
		player:sendMsg( msgBuf:get() )
		SB:free()
	end;
	
	sendOpenTodayAct = function(self, player)
		local buf = SB:alloc()
		buf:puts('openTodayAct:1')
		local msgBuf = self:_makeMsgEx( buf:get() )
		player:sendMsg( msgBuf:get() )
		SB:free()
	end;
	
	_makeEveryDayTaskId = function(self, resid, idx)
		return resid*100 + idx
	end;
	
	_makeMsgEx = function(self, s)
		local buf = SB:alloc()
		buf:format('{cmd:%d,%s}', NETCMD.TASK, s)
		return buf
	end;
	
	_makeMsg = function(self, s)
		return '{cmd:'..NETCMD.TASK..',' .. s .. '}'
	end;
}):new()

ActivityValSender = Class:extends({
	init = function(self)
		self.refreshDayActsTime_ = 0
		self.acts_ = '[]'
		self.payActTime_ = '{start:0,stop:0}'
	end;
	
	sendVal = function(self, player)
		player:sendMsg( self:_makeActValMsg('val:' .. player:getTask():getActivityVal():getTodayVal() ) )
	end;
	
	sendGotActRewards = function(self, player)
		local rewards = self:_makeRewards(player:getTask():getActivityVal():getGotActRewards(), MAX_ACTREWARDS_CNT)
		player:sendMsg( self:_makeActValMsg('gotActRewards:[' .. rewards .. ']' ) )
	end;
	
	sendGotSigninRewards = function(self, player)
		local rewards = self:_makeRewards(player:getTask():getActivityVal():getGotSigninRewards(), MAX_SIGNINREWARDS_CNT_EX)
		player:sendMsg( self:_makeActValMsg( 'signin:{gotRewards:[' .. rewards .. ']}' ) )
	end;	
	
	sendSignin = function(self, player)
		local activityVal = player:getTask():getActivityVal()
		local todaySign = 0
		if activityVal:isTodaySigned() then todaySign = 1 end
		player:sendMsg( self:_makeActValMsg( 'signin:{days:' .. activityVal:getSigninDays() .. ',todaySign:' .. todaySign .. '}' ) )
	end;
	
	sendDayActs = function(self, player)
		self:_makeDayActs()
		player:sendMsg( self:_makeActValMsg( 'dayacts:' .. self.acts_ ) )
	end;
	
	sendGotOnlineGoods = function(self, player)
		local hasGot = 0
		if player:getTask():getActivityVal():isTodayGotOnlineGoods() then
			hasGot = 1
		end
		player:sendMsg( self:_makeActValMsg( 'gotOnlineGoods:' .. hasGot ) )
	end;
	
	sendOnlineGoodsId = function(self, player)
		player:sendMsg( self:_makeActValMsg( 'onlineGoodsId:' .. app:getSvrAct():getOnlineGoods() ) )
	end;
	
	sendPayGiftGots = function(self, player)
		local payAct = player:getTask():getPayAct()
		local s = ''
		for i=0, (#res_pay_act_gifts-1) do
			if s ~= '' then s = s .. ',' end
			s = s .. payAct:getGetGiftFlag(i)
		end
		player:sendMsg( self:_makeMsg( 'payGiftGots:[' .. s .. ']' ) )
	end;
	
	sendPayActAllGold = function(self, player)
		local payAct = player:getTask():getPayAct()
		player:sendMsg( self:_makeMsg( 'payActAllGold:' .. payAct:getActAllGold() ) )
	end;
	
	sendPayActTime = function(self, player)
		self:_makeDayActs()
		player:sendMsg( self:_makeMsg( 'payActTime:' .. self.payActTime_ ) )
	end;	
	
	_makeDayActs = function(self)
		if Util:isCurDay(self.refreshDayActsTime_) then
			return
		end
		
		self.refreshDayActsTime_ = Util:getTime()
		local curTime = Util:getFixPreTime(self.refreshDayActsTime_, 0, 0, 0)
		local daySec = 24*3600
		local s = ''
		for day = -7, 7, 1 do
			local time = curTime + day*daySec
			local res = Util:qfind(res_dayacts, 'date', time)
			if res ~= nil then
				if s ~= '' then s = s .. ',' end
				s = s .. '{day:' .. day .. ',acts:' ..self:_makeActDayArray(res.acts) .. '}'
			elseif day == 0 then
				if s ~= '' then s = s .. ',' end
				s = s .. '{day:0,acts:[]}'
			end
		end
		self.acts_ = '[' .. s .. ']'
		
		app:getSvrAct():initPayActTime()
		self.payActTime_ = '{start:' .. app:getSvrAct():getCurPayActStartTime() .. ',stop:' .. app:getSvrAct():getCurPayActStopTime() .. '}'
	end;
	
	_makeActDayArray = function(self, acts)
		local s = ''
		for _, act in ipairs(acts) do
			if act == 0 then break end
			if act <= SVR_TODAY_ACT_TYPE.ACT_MAX then
				if s ~= '' then s = s..',' end
				s = s .. act
			end
		end
		return '[' .. s .. ']'
	end;
	
	_makeRewards = function(self, gotRewardsObj, maxCount)
		local rewards = ''
		for id=1, maxCount, 1 do
			if gotRewardsObj:isGotReward(id) then
				if rewards ~= '' then rewards = rewards .. ',' end
				rewards = rewards .. id
			end
		end
		return rewards
	end;
	
	_makeActValMsg = function(self, s)
		return self:_makeMsg('actVal:{' .. s .. '}')
	end;
	
	_makeMsg = function(self, s)
		return '{cmd:'..NETCMD.ACTIVITY_VAL..',' .. s .. '}'
	end;
}):new()

ShopSender = Class:extends({
	sendShopSalesList = function(self, player, sales)
		player:sendMsg( self:_makeMsg( 'sales:' .. toJIONString(sales) ) )
	end;
	
	_makeMsg = function(self, s)
		return '{cmd:'..NETCMD.SHOP..',' .. s .. '}'
	end;
}):new()

NewcomerTaskSender = Class:extends({
	sendCurTask = function(self, player)
		local subBuf = SB:alloc()
		local curTaskId = player:getTask():getNewcomerTask():getCurTaskId()
		subBuf:format('newhelp:{id:%d}', curTaskId)
		local msgBuf = self:_makeMsg( subBuf:get() )
		player:sendMsg( msgBuf:get() )
		SB:free()
	end;
	
	_makeMsg = function(self, s)
		local buf = SB:alloc()
		buf:format('{cmd:%d,%s}', NETCMD.NEWCOMERHELP, s)
		return buf
	end;
}):new()

DealByGoldSender = Class:extends({
	sendStartBuy = function(self, player, url_params)
		player:sendMsg( self:_makeMsg( 'url_params:"' .. url_params .. '"' ) )
	end;
	
	_makeMsg = function(self, s)
		return '{cmd:'..NETCMD.START_BuyByGold..',' .. s .. '}'
	end;	
}):new()

ClientCfgSender = MsgSender:extends({
	sendToggleMap = function(self, player)
		local clientCfg = player:getClientCfg()
		local s = ''
		for i=0, clientCfg:getToggleMapCount()-1, 1 do
			if s ~= '' then s = s .. ',' end
			local flag = clientCfg:getToggleMapFlag(i)
			s = s .. flag
		end
		player:sendMsg( self:_makeMsg( 'togglemap:[' .. s .. ']' ) )
	end;
	
	sendGongGaoVer = function(self, player)
		player:sendMsg( self:_makeMsg( 'gongGaoVer:' .. player:getClientCfg():getGongGaoVer() ) )
	end;
	
	sendHelpTip = function(self, player, id, times)
		player:sendMsg( self:_makeMsg( 'helptips:[{id:' .. id .. ',times:' .. times .. '}]') )
	end;
	
	sendHelpTips = function(self, player)
		local helpTips = player:getClientCfg():getHelpTips()
		local s = ''
		for i=0, helpTips:getCount()-1 do
			if s ~= '' then s = s .. ',' end
			local node = helpTips:get(i)
			s = s .. '{id:' .. node.id .. ',times:' .. node.times .. '}'
		end
		player:sendMsg( self:_makeMsg( 'helptips:[' .. s .. ']') )
	end;
	
	_makeMsg = function(self, s)
		return '{cmd:'..NETCMD.CLT_CFG..',' .. s .. '}'
	end;	
}):new()


ServerCfgSender = MsgSender:extends({
	send = function(self, player)
		player:sendMsg( self:_makeMsg( 'honorcfg:{taofa:' .. res_taofa_honor .. ',cuihui:' .. res_cuihui_honor .. ',tiaoxin:' .. res_tiaoxin_honor .. ',leveldiff:' .. res_get_honor_differ_level .. '}' ) )
	end;

	_makeMsg = function(self, s)
		return '{cmd:'..NETCMD.SVRCFG..',' .. s .. '}'
	end;	
}):new()


AutoBuildSender = MsgSender:extends({
	sendInfo = function(self, player)
		local max = player:getVipEffectVal(VIP_EFF.ADD_BUILD_AUTO_QUEUE)
		local starting = 0
		if player:getCitys():isStartAutoBuild() then
			starting = 1
		end
		
		local autoBuilds = player:getCitys():getAutoBuilds()
		local s = ''
		for i=0, autoBuilds:getCount()-1 do
			if s ~= '' then s = s .. ',' end
			s = s .. autoBuilds:get(i)
		end
		
		player:sendMsg( self:_makeMsg( 'autobuild:{max:' .. max .. ',starting:' .. starting .. ',list:[' .. s .. ']}' ) )
	end;
	
	_makeMsg = function(self, s)
		return '{cmd:'..NETCMD.AUTOBUILD..',' .. s .. '}'
	end;	
}):new()


PayGoldSender = MsgSender:extends({
	sendPayGold = function(self, player )
		local payGold = player:getTask():getPayAct():getAllGold()
		player:sendMsg( self:_makeMsg( 'paygold:' .. payGold ) )
	end;
	
	_makeMsg = function(self, s)
		return '{cmd:'..NETCMD.PAYGOLD .. ',' .. s .. '}'
	end;
}):new()


WorldBossSender = MsgSender:extends({
	sendEvents = function(self, player)
		local s = ''
		local events = app:getAlliMgr():getWorldBossTmpEvents()
		local cnt = table.getn(events)
		for i=cnt, 1, -1 do
			local event = events[i]
			if s ~= '' then s = s .. ',' end
			s = s .. '{role:"' .. event[1] .. '",hurt:' .. event[2] .. ',time:' .. event[3] .. '}'
		end
		player:sendMsg( self:_makeMsg( 'events:[' .. s .. ']') )
	end;
	
	sendTodayInfo = function(self, player)
		local w = player:getTask():getWorldBoss()
		
		local roleSortTime = Service:getRankRefreshDB():getSortTime(Service:getRoleWorldBossRank():getRankName())
		local gotPRankGift = 0
		if w:getPersonRankGiftTime() >= roleSortTime then
			gotPRankGift= 1
		end
		
		local countrySortTime = Service:getRankRefreshDB():getSortTime(Service:getCountryWorldBossRank():getRankName())
		local gotCRankGift = 0
		if w:getCountryRankGiftTime() >= countrySortTime then
			gotCRankGift = 1
		end
		
		local s = 'today:{times:' .. w:getTodayTimes() .. ',gotGift:' .. w:getGotGift() .. ',guwu:' .. w:getGuwuLevel() .. ',gotPRankGift:' .. gotPRankGift .. ',gotCRankGift:' .. gotCRankGift .. '}'
		player:sendMsg( self:_makeMsg( s ) )
	end;
	
	sendFightDemo = function(self, player, fightDemo, hurt)
		local s = 'fightDemo:' .. toJIONString(fightDemo) .. ',hurt:' .. hurt
		player:sendMsg( self:_makeMsg( s ) )
	end;
	
	sendRanks = function(self, player)
		local rankName = Service:getCountryWorldBossRank():getRankName()
		local crankweek = Service:getRankRefreshDB():getSortTimes(rankName)
		
		local pranks = Service:getRoleWorldBossRank():selectRanks(1, 50)
		local spranks = ''
		for rankId, rank in ipairs(pranks) do
			if spranks ~= '' then spranks = spranks .. ',' end
			spranks = spranks .. '{rank:' .. rankId .. ',role:"' .. rank.name .. '",hurt:' .. rank.hurt .. '}'
		end
		
		local aranks = Service:getAllianceWorldBossRank():selectRanks(1, 50)
		local saranks = ''
		for rankId, rank in ipairs(aranks) do
			if saranks ~= '' then saranks = saranks .. ',' end
			saranks = saranks .. '{rank:' .. rankId .. ',alli:"' .. rank.name .. '",hurt:' .. rank.hurt .. '}'
		end
		
		local cranks = Service:getCountryWorldBossRank():selectRanks(1, 50)
		local scranks = ''
		for rankId, rank in ipairs(cranks) do
			if scranks ~= '' then scranks = scranks .. ',' end
			scranks = scranks .. '{rank:' .. rankId .. ',country:' .. rank.id .. ',times:' .. rank.times .. '}'
		end
		
		local s = 'prank:[' .. spranks .. '],arank:[' .. saranks .. '],crank:[' .. scranks .. '],crankweek:' .. crankweek
		player:sendMsg( self:_makeMsg( s ) )
	end;
	
	sendGetAlliGiftInfo = function(self, player)
		local s = ''
		local aranks = Service:getAllianceWorldBossRank():selectRanks(1, 50)
		for _, arank in ipairs(aranks) do
			local alliance = app:getAlliMgr():getAlliById(arank.id)
			s = self:_makeAlliGift(s, alliance, arank)
		end
		player:sendMsg( self:_makeMsg('alligifts:[' .. s .. ']') )
	end;
	
	_makeAlliGift = function(self, s, alliance, arank)
		if alliance:isNull() then return s end
		
		local itemPkg = alliance:getItemPkg()
		local sitems = ''
		for i=0, itemPkg:getLastItemCount()-1 do
			if sitems ~= '' then
				sitems = sitems .. ','
			end
			local item = itemPkg:getLastItemByIdx(i)
			sitems = sitems .. '{id:' .. item.resid .. ',num:' .. item.num .. '}'
		end
		
		if s ~= '' then s = s .. ',' end
		s = s .. '{alli:"' .. arank.name .. '",drops:[' .. sitems .. ']}'
		return s
	end;
	
	_makeMsg = function(self, s)
		return '{cmd:'..NETCMD.WORLDBOSS .. ',' .. s .. '}'
	end;
}):new()

