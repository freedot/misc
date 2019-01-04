--*******************************************************************************
--*******************************************************************************
PlayerHeroMgr = Class:extends({
	init = function(self, player)
		self.player = player
		self.innerHeros = self.player:getPersistVar().stHeros
		self.newHeros = NewHeros:new(self.player, self.innerHeros)
		self:_createAllHeroObjs()
	end;
	
	isAllHerosFree = function(self)
		for _, hero in ipairs(self.heros) do
			if not hero:isFree() then
				return false
			end
		end
		
		return true
	end;
	
	getHeroMaxCount = function(self)
		return res_gethero_maxcnt( self.player:getLevel() )
	end;
	
	getHeroCount = function(self)
		return self.innerHeros.ucCount
	end;
	
	getHeroByIdx = function(self, idx) -- from 0 to n-1
		if (idx < 0 or idx >= self.innerHeros.ucCount ) then 
			return nil 
		end
		
		return self.heros[idx+1]
	end;
	
	getHeroById = function(self, id)
		if id <= 0 then
			return nil
		end
		
		if Util:findC(self.innerHeros.astHeros, self.innerHeros.ucCount, 'ullId', id) == nil then 
			return nil 
		end
		
		return self.heros[Util:getLastFindIdx()+1]
	end;
	
	getAttrVal = function(self, hero, attrid)
		return Util:qfindC(hero.stAttrs.astAttrs, hero.stAttrs.ucCount, 'usAttr', attrid).ulVal
	end;
	
	getAttrLastTime = function(self)
		return self.innerHeros.ulHeroAttrLastTime
	end;
	
	setAttrLastTime = function(self, lastTime)
		self.innerHeros.ulHeroAttrLastTime = lastTime
	end;
	
	getCanUseSkillSteelTime = function(self)
		return self.innerHeros.ulCanUseSSTime
	end;
	
	setCanUseSkillSteelTime = function(self, sstime)
		self.innerHeros.ulCanUseSSTime = sstime
	end;	
	
	getNewHeros = function(self)
		return self.newHeros
	end;	
	
	createHero = function(self, newhero)
		local innerHero = self:_allocInnerHero()
		if innerHero == nil then
			return nil
		end
		
		self:_copyFromNewHero(innerHero, newhero)
		local hero = self:_createHeroObj(innerHero)
		Service:getOpenSvrAct():recordWhenHasFiveHighHero(self.player)
		return hero
	end;
	
	destroyHero = function(self, id)
		local idx = self:_getHeroIdxById(id)
		self:_freeInnerHero(idx)
		self:_destroyHeroObj(idx)
	end;
	
	_createAllHeroObjs = function(self)
		self.heros = {}
		for i=0, self.innerHeros.ucCount-1, 1 do
			table.insert(self.heros, Hero:new(self.player, self.innerHeros.astHeros[i]))
		end
	end;	
	
	_createHeroObj = function(self, innerHero)
		local heroObj = Hero:new(self.player, innerHero)
		table.insert(self.heros, heroObj)
		
		HeroAttrHelper:initAttrs(heroObj)
		HeroAttrHelper:recalcBaseAttrs(self.player, heroObj)
		HeroAttrHelper:recalcDynAttrs(self.player, heroObj)
		return heroObj
	end;
	
	_allocInnerHero = function(self)
		if self.innerHeros.ucCount >= MAX_HERO_CNT then 
			return nil 
		end
		
		local hero = self.innerHeros.astHeros[ self.innerHeros.ucCount ]
		SPub:ClearInnerHero(hero)
		hero.ullId = self:_allocHeroId()
		
		self.innerHeros.ucCount = self.innerHeros.ucCount + 1
		
		return hero
	end;
	
	_allocHeroId = function(self)
		local maxId = 0
		for _, hero in ipairs(self.heros) do
			if hero:getId() > maxId then
				maxId = hero:getId()
			end
		end
		
		return maxId + 1
	end;
	
	_copyFromNewHero = function(self, hero, newhero)
		hero.ucProf = newhero.ucProf
		hero.szName = newhero.szName
		hero.ucLevel = newhero.ucLevel
		hero.ulIcon = newhero.ulIcon
		hero.ucSex = newhero.ucSex
		
		hero.stAttrs.ucCount = newhero.ucAttrCount
		HeroAttrHelper:copyAttrs(newhero.astAttrs, hero.stAttrs.astAttrs, hero.stAttrs.ucCount)
	end;	
	
	_getHeroIdxById = function(self, heroId)
		Util:findByFun(self.heros, 'getId', heroId)
		return Util:getLastFindIdx()
	end;
	
	_freeInnerHero = function(self, heroIdx) -- from 1 to n
		if heroIdx <= 0 or heroIdx > self.innerHeros.ucCount then
			return
		end
		
		self.innerHeros.ucCount = Util:removeElementC(self.innerHeros.astHeros, self.innerHeros.ucCount, heroIdx - 1)
	end;	
	
	_destroyHeroObj = function(self, heroIdx) -- from 1 to n
		local heroCount = table.getn(self.heros)
		if heroIdx <= 0 or heroIdx > heroCount then
			return
		end
		
		local startIdx = heroIdx
		local lastIdx = heroCount - 1
		for i=startIdx, lastIdx, 1 do
			self.heros[i]:copy(self.heros[i+1])
			self.heros[i]:reset()
		end
		
		table.remove(self.heros, heroCount)
	end;
})

