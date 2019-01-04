--*******************************************************************************
SendRewardHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = SendFirstHeroRewardHandler()
	end;
})

SendFirstHeroRewardHandler = Class:extends({
	handle = function(self, player, cmdtb)
		local nameIdx = Util:getNumber(cmdtb, 'nameIdx')
		local nameNode = rstr.firstRewardHeroNames[nameIdx+1]
		if nameNode == nil then
			return false
		end
		
		if ( player:getTask():getSendReward():isSendedFirstHero() ) then
			return false
		end
		
		self:_createHero(player, nameNode)
		player:getTask():getSendReward():setSendedFirstHero()
		return true
	end;
	
	_createHero = function(self, player, nameNode)
		local sNewHeroNode = CppPlayerVar:allocVar('SNewHero')
		local newHero = sNewHeroNode.var
		
		local id = 1; local tlevel = 0; local minLevel = 1;
		InitNewHeroUtil:inithero(player, newHero, id, HERO_PROF.YONGSHI, tlevel, minLevel)
		newHero.szName = nameNode.name
		newHero.ulIcon = nameNode.icon
		newHero.ucSex = nameNode.sex
		self:_setFullNAttrs(newHero)
		local hero = player:getHeroMgr():createHero(newHero)

		CppPlayerVar:freeVar(sNewHeroNode.hdr)
		
		HeroAttrSender:sendDetailHero(player, hero)
		WUtil:sendNpcMsg(player, string.format(rstr.firstHeroPopMsg, hero:getName()))
	end;
	
	_setFullNAttrs = function(self, newhero)
		for i=0, newhero.ucAttrCount-1, 1 do
			local attr = newhero.astAttrs[i]
			if (attr.usAttr == ATTR.NST or attr.usAttr == ATTR.NAG or attr.usAttr == ATTR.NPH) then
				attr.ulVal = res_heronature_max_attrs[newhero.ucProf][attr.usAttr]
			end
		end
	end;
})

