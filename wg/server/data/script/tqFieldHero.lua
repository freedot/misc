
FieldHero = Class:extends({
	init = function(self)
		self.attrs = {}
		self.soldier = {resid=0,number=0}
		self.resId = 0
		self.id = 0
		self.level = 0
		self.prof = 0
		self.name = ''
		local iconIdx = math.random(table.getn(res_hero_icons))
		self.icon = res_hero_icons[iconIdx].icon
	end;
	
	getPlayer = function(self)
		return nil
	end;
	
	setIcon = function(self, icon)
		self.icon = icon
	end;
	
	getIcon = function(self)
		return self.icon
	end;
	
	setResId = function(self, resId)
		self.resId = resId
		local res = Util:qfind(res_fieldheros, 'id', self.resId)
		self:initBaseInfo(res)
		self:initSoldier(res)
		self:initAttrs(res)
	end;
	
	setId = function(self, id)
		self.id = id
	end;
	
	getId = function(self)
		return self.id
	end;
	
	setState = function(self, state)
	end;
	
	initBaseInfo = function(self, res)
		self.level = res.level
		self.prof = res.prof
		self.name = string.format(rstr.fieldhero.levelname, self.level, rstr.herotypenames[self.prof])
	end;
	
	initSoldier = function(self, res)
		self.soldier.resid = 0
		self.soldier.number = 0
		if (res.soldiernum > 0) and (self.prof ~= HERO_PROF.YONGSHI) then
			local profToSoldierMaps = {}
			profToSoldierMaps[HERO_PROF.DAOJIANG] = FIXID.DAOBING
			profToSoldierMaps[HERO_PROF.JIJIANG] = FIXID.JIBING
			profToSoldierMaps[HERO_PROF.GONGJIANG] = FIXID.GONGBING
			profToSoldierMaps[HERO_PROF.QIJIANG] = FIXID.QIBING
			profToSoldierMaps[HERO_PROF.QIXIE] = FIXID.QIXIE
			self.soldier.resid = profToSoldierMaps[self.prof]*1000 + res.soldierlevel
			self.soldier.number = res.soldiernum
		end
	end;
	
	initAttrs = function(self, res)
		self:setAttrVal(ATTR.HEALTH, 100*ATTR_PRECISION)
		self:setAttrVal(ATTR.MHEALTH, 100)
		self:setAttrVal(ATTR.MO, 100*ATTR_PRECISION)
		self:setAttrVal(ATTR.MMO, 100)
		self:setAttrVal(ATTR.IF, 0)
		
		self:setAttrVal(ATTR.FC, res.fightcap)
		self:setAttrVal(ATTR.SFC, res.singlefightcap)
		self:setAttrVal(ATTR.CO, res.maxnum)
		self:setAttrVal(ATTR.AG_B, res.agile)
		self:setAttrVal(ATTR.AG_A, 0)
		self:setAttrVal(ATTR.HI, res_calchero_hit_attr(self.prof, res.agile, 0, res_base_nature, 0) )
		self:setAttrVal(ATTR.HU, res_calchero_hurt_attr(self.prof, res.str, 0, res_base_nature, 0) )
		self:setAttrVal(ATTR.DE, res_calchero_def_attr(self.prof, res.phy, 0, res_base_nature, 0) )
		self:setAttrVal(ATTR.ES, res_calchero_esc_attr(self.prof, res.agile, 0, res_base_nature, 0) )
		self:setAttrVal(ATTR.BER, res_calchero_batkper_attr(self.prof, res.agile, 0, res_base_nature, 0) )
		self:setAttrVal(ATTR.MPS, res_calchero_maxphy_attr(self.prof, res.phy, 0, res_base_nature, 0) )
	end;
	
	setName = function(self, name)
		self.name = name
	end;
	
	getName = function(self)
		return self.name
	end;
	
	getSkillCount = function(self)
		return 0
	end;
	
	getCurTacticSkillId = function(self)
		return 0
	end;
	
	getLevel = function(self)
		return self.level
	end;
	
	getProf = function(self)
		return self.prof
	end;
	
	getSubject = function(self, idx)
		return res_hero_init_subjects[self.prof][idx+1]
	end;
	
	getAttrRawVal = function(self, attrid)
		local val = self.attrs[attrid]
		if val == nil then return 0 end
		return val
	end;
	
	getAttrVal = function(self, attrid)	
		local val = self:getAttrRawVal(attrid)
		if self:_needPrecisionFormat(attrid) then
			return math.floor(val / ATTR_PRECISION)
		else
			return val
		end
	end;
	
	getAttrRawVal = function(self, attrid)	
		local val = self.attrs[attrid]
		if val == nil then
			val = 0
		end
		
		return val
	end;
	
	setAttrVal = function(self, attrid, val)
		self.attrs[attrid] = val
	end;
	
	getSoldier = function(self)
		return self.soldier
	end;
	
	bindSoldier = function(self, innerSoldier)
		self.soldier = innerSoldier
	end;
	
	carrySoldier = function(self, soldier)
		self.soldier.resid = soldier.resid
		self.soldier.number = 0
		self:addSoldierNumber(soldier.number)
	end;
	
	addSoldierNumber = function(self, number)
		self.soldier.number = self.soldier.number + number
		self:formatSoldierNumber()
	end;
	
	subSoldierNumber = function(self, number)
		if self.soldier.number < number then
			self.soldier.number = 0
		else
			self.soldier.number = self.soldier.number - number
		end
		self:formatSoldierNumber()
	end;
	
	setSoldierNumber = function(self, number)
		if (number < 0) then number = 0 end
		self.soldier.number = number
		self:formatSoldierNumber()
	end;
	
	getSoldierNumber = function(self)
		return self.soldier.number
	end;
	
	formatSoldierNumber = function(self)
		local attrCommand = self:getAttrVal(ATTR.CO)
		if self.soldier.number > attrCommand  then
			self.soldier.number = attrCommand
		end
	end;
	
	getAdaptableFactor = function(self)
		if (self.soldier.resid == 0) then return 0 end
		
		local baseResid, _ = ItemResUtil:splitResidLevel(self.soldier.resid)
		local soldierInSubjectIdx = baseResid - FIXID.FIRSTSOLDIER
		local adaptableVal = self:getSubject(soldierInSubjectIdx)
		return res_get_subject_adaptablefactor(adaptableVal)
	end;	
	
	_needPrecisionFormat = function(self, attrId)
		for _, needAttrId in ipairs(res_need_precision_attrs) do
			if needAttrId == attrId then return true end
		end
		return false
	end;
})


