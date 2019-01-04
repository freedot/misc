--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqPlayerCityDef')
require('tqFieldArmyContainer')
require('tqFieldHeroMgr')
require('tqPlayerWall')

CITYDEF_NAMEMAPTYPES = {
	juma=CITYDEF_TYPE.JUMA,
	leishi=CITYDEF_TYPE.LEISHI,
	gunmu=CITYDEF_TYPE.GUNMU,
	nujian=CITYDEF_TYPE.NUJIAN,
	xianjing=CITYDEF_TYPE.XIANJING }
	
BasePlayer = Class:extends({
	init = function(self)
		self.objType = OBJ_TYPE.NONE
		self.name = ''
		self.level = 0
		self.pos = {x=0, y=0}
		self.res = {needtime=0,citydefid=0,lineup=FIXID.DEFAULTLINEUP,heros={}}
		
		self:createCityDef()
		self:createHeroMgr(self.res)
		self:createArmyMgr(self.res)
	end;
	
	createCityDef = function(self)
		self.cityDef = FieldPlayerCityDef(self)
		local cityDefId = self.res.citydefid
		if cityDefId == nil then
			cityDefId = 0
		end
		local cityDefRes = ItemResUtil:findItemres(cityDefId)
		self:loadCityDefRes(cityDefRes)
		self.wall = FieldPlayerWall(cityDefRes)
	end;
	
	createHeroMgr = function(self, defArmyRes) 
		self.heroIds = {0,0,0,0,0}
		self.heroMgr = FieldHeroMgr()
		if  defArmyRes == nil then 
			return 
		end
		
		for pos, fieldHeroId in ipairs(defArmyRes.heros) do
			if fieldHeroId ~= 0 then
				local heroId = pos
				if self.res.heroName ~= nil and self.res.heroIcon ~= nil then
					self.heroMgr:newHero(heroId, fieldHeroId, self.res.heroName, self.res.heroIcon)
				else
					self.heroMgr:newHero(heroId, fieldHeroId)
				end
				self.heroIds[pos] = heroId
			end
		end
	end;	
	
	createArmyMgr = function(self, defArmyRes)
		self.armyContainer = FieldArmyContainer()
		self.armyContainer:initArmy(defArmyRes.lineup, self.heroIds)
	end;
	
	loadCityDefRes = function(self, cityDefRes)
		if (cityDefRes == nil) then return end
		
		for name, defType in pairs(CITYDEF_NAMEMAPTYPES) do
			local number = cityDefRes[name]
			if number > 0 then
				self.cityDef:setDefNumber(defType, number)
			end
		end
	end;	
	
	isRole = function(self)
		return self.objType == OBJ_TYPE.ROLE
	end;
	
	getRes = function(self)
		return self.res
	end;

	getObjType = function(self)
		return self.objType
	end;
	
	getIcon = function(self)
		return 0
	end;
	
	getRoleId = function(self)
		return 0
	end;
	
	getCityPos = function(self)
		return self.pos
	end;
	
	getAlliId = function(self)
		return 0
	end;
	
	setEnemyAlliId = function(self, alliId)
	end;
	
	getName = function(self)
		return ''
	end;
	
	getRoleName = function(self)
		return self.name
	end;
	
	getLevel = function(self)
		return self.level
	end;
	
	sendMsg = function(self, msg)
		-- no need implement
	end;
	
	getHeroMgr = function(self)
		return self.heroMgr
	end;
	
	getArmyContainer = function(self)
		return self.armyContainer
	end;
	
	getCityDef = function(self)
		return self.cityDef
	end;
	
	getWall = function(self)
		return self.wall
	end;
	
	getFriendMgr = function(self)
		return NullFriendMgr
	end;
	
	getFarm = function(self)
		return NullPlayerFarm
	end;
	
	isDied = function(self)
		return false
	end;
})
	
FieldPlayer = BasePlayer:extends({
	init = function(self, fieldGridId)
		self.objType = OBJ_TYPE.FIELD
		self.fieldGridId = fieldGridId
		if not self:initPlayer(fieldGridId) then
			self.objType = OBJ_TYPE.NONE
		end
	end;
	
	initPlayer = function(self, fieldGridId)
		local pos = app:getCityMgr():getPosByGridId( fieldGridId )
		local grid = app:getCityMgr():getGridByGridId( fieldGridId )
		if (grid == nil) or (grid.objType ~= OBJ_TYPE.FIELD) then 
			return false
		end

		self.res = ItemResUtil:findFieldLevelRes(grid.resId, grid.level)
		if self.res == nil then
			return false
		end
		
		local nameRes = ItemResUtil:findItemres(grid.resId)
		if nameRes == nil then
			print ( 'nameRes is nil' )
			return false
		end
		
		self.name = string.format(rstr.fieldplayer.levelname, grid.level, nameRes.name)
		self.pos = {x=pos.x, y=pos.y}
		self.level = grid.level
		
		self:createCityDef()
		self:createHeroMgr(self.res)
		self:createArmyMgr(self.res)
		return true
	end;
	
	getRoleId = function(self)
		return self.fieldGridId
	end;
	
	getIcon = function(self)
		return self.res.icon
	end;
})

NullPlayer = BasePlayer:extends({
}):new()


