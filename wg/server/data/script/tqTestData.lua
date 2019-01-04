require('tqClass')
TestHeroDataEx = Class:extends({
	init = function(self)
	end;
	
	make = function(self,player)
		local heros = player:getPersistVar().stHeros
		heros.ucCount = 4
		for i=0, heros.ucCount-1, 1 do
			local hero = heros.astHeros[i]
			self:_makeHeroBase(hero, i)
			self:_makeHeroAttrs(hero)
			self:_makeHeroWears(hero)
			self:_makeHeroSkills(hero)
		end
	end;
	
	_makeHeroBase = function(self, hero, i)
		hero.ulIcon = 140001
		hero.ullId = i+100000
		hero.szName = 'hero'..i
		hero.ucLevel = (i+1)*5
		hero.ucState = 0
		hero.aucSubjects[0] = 1
		hero.aucSubjects[1] = 3
		hero.aucSubjects[2] = 2
		hero.aucSubjects[3] = 1
		hero.aucSubjects[4] = 1
	end;
	
	_makeHeroSkills = function(self, hero)
		local resskills = {{id=6001002,level=3}, {id=6001003,level=1}}
		for i, v in ipairs(resskills) do
			local skill = hero.stSkills.astSkills[i-1]
			skill.ulResId = v.id
			skill.ucLevel = v.level
		end
		hero.stSkills.ucCount = table.getn(resskills)
	end;
	
	_makeHeroAttrs = function(self, hero)
		local needexp = Util:qfind(res_herolevelexps, 'level', hero.ucLevel+1).needexp
		local attrsmap = {
			{id=ATTR.PH_B, val=10, u=0}
			,{id=ATTR.PH_A, val=10, u=0}
			,{id=ATTR.ST_B, val=10, u=0}
			,{id=ATTR.ST_A, val=10, u=0}
			,{id=ATTR.AG_B, val=10, u=0}
			,{id=ATTR.AG_A, val=10, u=0}
			,{id=ATTR.XP, u=0, val=0}
			,{id=ATTR.NXP, u=0, val=100}
			,{id=ATTR.PP, u=0, val=3 }
			,{id=ATTR.SP, u=0, val=10}
			,{id=ATTR.IF, u=0, val=0}
			,{id=ATTR.MIF, u=0, val=10}
			,{id=ATTR.CRE, u=0, val=0}
			,{id=ATTR.CO, u=0, val=10 }
			,{id=ATTR.HI, u=0, val=10 }
			,{id=ATTR.HU, u=0, val=10 }
			,{id=ATTR.DE, u=0, val=10}
			,{id=ATTR.ES, u=0, val=10}
			,{id=ATTR.BER, u=VAL_UNIT.PER, val=10}
			,{id=ATTR.PS, u=0, val=0}
			,{id=ATTR.MPS, u=0, val=10}
			,{id=ATTR.HEALTH, val=100, u=0}
			,{id=ATTR.MHEALTH, val=100, u=0}
			,{id=ATTR.MO, u=0, val=100}
			,{id=ATTR.MMO, u=0, val=150}
			,{id=ATTR.AN, u=0, val=0}
			,{id=ATTR.MAN, u=0, val=100}
			,{id=ATTR.SFC, u=0, val=10}
			,{id=ATTR.FC, u=0, val=0}
		}
		self:_setAttrs(hero.stAttrs, attrsmap)
	end;
	
	_makeHeroWears = function(self, hero)
		local armsmap = {
				{pos=0, id=1, resid=5000001},
				{pos=1, id=2, resid=5000001},
				{pos=6, id=3, resid=5000001},
				{pos=9, id=4, resid=5000001},
			}
		hero.stWears.ucCount = table.getn(armsmap)
		for i,v in ipairs(armsmap) do
			hero.stWears.astWears[i-1].ucArmPos = v.pos
			hero.stWears.astWears[i-1].stArm.ullId = v.id*10 + hero.ullId
			hero.stWears.astWears[i-1].stArm.ulResId = v.resid
			self:_makeArmAttrs(hero.stWears.astWears[i-1].stArm.stAttrs)		
		end
	end;
	
	_makeArmAttrs = function(self, attrs)
		local attrsmap = {
			{id=ATTR.LVL, val=4, u=0}
			}
		self:_setAttrs(attrs, attrsmap)
	end;
	
	_setAttrs = function(self, attrs, attrsmap)
		local sortcmp = function(a, b)
			return a.id < b.id
		end
		table.sort(attrsmap, sortcmp)
		attrs.ucCount = table.getn(attrsmap)
		for i,v in ipairs(attrsmap) do
			attrs.astAttrs[i-1].usAttr = v.id
			attrs.astAttrs[i-1].ulVal = v.val
			attrs.astAttrs[i-1].ucUnit = v.u
		end
	end
}):new()

TestPackageArmData = Class:extends({
	init = function(self)
	end;
	
	make = function(self, player)
		local arms = player:getPersistVar().stItems.stArms
		
		local armsmap = {
				{id=100000, resid=5000001},
				{id=200000, resid=5000001},
			}
		arms.ucCount = table.getn(armsmap)
		for i,v in ipairs(armsmap) do
			arms.astArms[i-1].ullId = v.id
			arms.astArms[i-1].ulResId = v.resid
			self:_makeArmAttrs(arms.astArms[i-1].stAttrs)		
		end
	end;
	
	_makeArmAttrs = function(self, attrs)
		local attrsmap = {
			{id=ATTR.DUR, val=19, u=0}
			,{id=ATTR.MDUR, val=23, u=0}
			,{id=ATTR.LVL, val=4, u=0}
			}
		self:_setAttrs(attrs, attrsmap)
	end;	
	
	_setAttrs = function(self, attrs, attrsmap)
		local sortcmp = function(a, b)
			return a.id < b.id
		end
		table.sort(attrsmap, sortcmp)
		attrs.ucCount = table.getn(attrsmap)
		for i,v in ipairs(attrsmap) do
			attrs.astAttrs[i-1].usAttr = v.id
			attrs.astAttrs[i-1].ulVal = v.val
			attrs.astAttrs[i-1].ucUnit = v.u
		end
	end
}):new()


StrategyTestData = Class:extends({
	init = function(self)
	end;
	
	make = function(self, player)
		local items = player:getPersistVar().stItems.stItems
		items.ucCount = 1
		items.astItems[0].ullId = 0
		items.astItems[0].ulResId = 2000002
		items.astItems[0].ucType = 0
		items.astItems[0].usNumber = 150
	end;
}):new()


