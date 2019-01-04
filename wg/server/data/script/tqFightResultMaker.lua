--*******************************************************************************
--*******************************************************************************
FightResultMaker = Class:extends({
	init = function(self)
		self.cdTypeNames = {}
		self.cdTypeNames[CITYDEF_TYPE.XIANJING] = 'xianjing'
		self.cdTypeNames[CITYDEF_TYPE.GUNMU] = 'gunmu'
		self.cdTypeNames[CITYDEF_TYPE.JUMA] = 'juma'
		self.cdTypeNames[CITYDEF_TYPE.LEISHI] = 'leishi'
		self.cdTypeNames[CITYDEF_TYPE.NUJIAN] = 'nujian'
	end;
	
	make = function(self, defenderPartyName, expedType, attackerCamp, defenderCamp, result)
		local s = '{result:'..result
		s = s..',defenderParty:"'..defenderPartyName..'"'
		s = s..',expedType:' .. expedType
		s = s..',attacker:{'..self:getRoleInfo(attackerCamp.player)..','..self:getHerosInfo(attackerCamp.actors)..','..self:getGainResInfo(defenderCamp.lossRes)..','..self:getDropResInfo(attackerCamp.dropLogs)..'}'
		s = s..',defender:{'..self:getRoleInfo(defenderCamp.player)..','..self:getHerosInfo(defenderCamp.actors)..','..self:getLossResInfo(defenderCamp.lossRes)..','..self:getDefsExpendInfo(defenderCamp.actors)..','..self:getDropResInfo(defenderCamp.dropLogs)..'}'
		s = s..'}'
		return s
	end;
	
	getRoleInfo = function(self, player)	
		local alli =  app:getAlliMgr():getAlliById(player:getAlliId())
		return 'role:{name:"'..player:getRoleName()..'",icon:'..player:getIcon()..',level:'..player:getLevel()..',objType:'..player:getObjType()..',alli:"'..alli:getName()..'"}'
	end;
	
	getHerosInfo = function(self, actors)
		local s = ''
		for _, actor in ipairs(actors) do 
			s = self:getHeroInfo(s, actor)
		end
		return 'heros:['..s..']'
	end;
	
	getHeroInfo = function(self, s, actor)
		local rets = s
		
		if (actor:getType() ~= ACTOR_TYPE.SOLDIER)
			and (actor:getType() ~= ACTOR_TYPE.HERO) then 
			return rets 
		end
		
		if (rets ~= '') then rets = rets..',' end
		local hero = actor:getHero()
		local initNumber = 0
		local lossNumber = 0
		local reviveNumber = 0
		local soldierResid = 0
		if (actor:getType() == ACTOR_TYPE.SOLDIER) then
			initNumber = actor:getInitNumber()
			lossNumber = actor:getLossNumber()
			reviveNumber = actor:getReviveNumber()
			soldierResid = hero:getSoldier().resid
		end
		
		local addExp = actor:getAddExp()
		local addCredit = actor:getAddCredit()
		
		return rets..'{name:\"'..hero:getName()..'\",level:'..hero:getLevel()..',soldier:{resid:'..soldierResid..',number:'..initNumber..',loss:'..lossNumber..',revive:'..reviveNumber..'},addExp:'..addExp..',addCredit:'..addCredit..'}'
	end;
	
	getLossResInfo = function(self, lossres)
		return 'lossres:'..toJIONString(lossres)
	end;
	
	getGainResInfo = function(self, gainres)
		return 'gainres:'..toJIONString(gainres)
	end;
	
	getDropResInfo = function(self, dropLogs)
		if table.getn(dropLogs) == 0 then
			return 'getdrop:[]'
		else
			return 'getdrop:'..toJIONString(dropLogs)
		end
	end;
	
	getDefsExpendInfo = function(self, actors)
		local s = ''
		for _, actor in ipairs(actors) do 
			s = self:getDefExpendInfo(s, actor)
		end
		return 'defexpend:{'..s..'}'
	end;
	
	getDefExpendInfo = function(self, s, actor)
		local rets = s
		if actor:getType() ~= ACTOR_TYPE.DEF then return rets end
		
		local lossNumber = math.floor(actor:getInitNumber() - actor:getNumber())
		if (lossNumber == 0) then return rets end
		
		if (rets ~= '') then rets = rets..',' end
		local typeName = self.cdTypeNames[actor:getDefType()]
		return rets..typeName..':'..lossNumber
	end;
})


