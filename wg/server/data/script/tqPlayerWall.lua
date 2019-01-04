--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
PlayerWall = Class:extends({
	init = function(self, player)
		self.citys = player:getCitys() 
	end;
	
	getHPAndDEF = function(self)
		local level = self.citys:getBuildLevelByResId(FIXID.WALLBUILD)
		local res = ItemResUtil:findBuildLevelres(FIXID.WALLBUILD, level)
		if (res == nil) then return 0 end
		return res.hp, res.def
	end;
})

FieldPlayerWall = Class:extends({
	init = function(self, defRes)
		self.hp = 0
		self.def = 0
		if defRes ~= nil then
			self.hp = defRes.wallhp
			self.def = defRes.walldef
		end
	end;
	
	getHPAndDEF = function(self)
		return self.hp, self.def
	end;
})


