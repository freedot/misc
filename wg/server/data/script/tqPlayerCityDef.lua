--*******************************************************************************
--*******************************************************************************
PlayerCityDef = Class:extends({
	init = function(self, player)
		self.player = player
		self.def = self.player:getPersistVar().stCitys.cityDef
	end;
	
	setDefNumber = function(self, defType, number)
		self.def.defs[defType-CITYDEF_TYPE.FIRST] = number
	end;
	
	getDefNumber = function(self, defType)
		return self.def.defs[defType-CITYDEF_TYPE.FIRST]
	end;
	
	setBuildingStopTime = function(self, stopTime)
		self.def.stopTime = stopTime
	end;

	getBuildingStopTime = function(self)
		return self.def.stopTime
	end;
	
	setBuildingResid = function(self, resId)
		self.def.buildResId = resId
	end;
	
	getBuildingResid = function(self)
		return self.def.buildResId
	end;
	
	setBuildingNumber = function(self, number)
		self.def.buildNumber = number
	end;
	
	getBuildingNumber = function(self)
		return self.def.buildNumber
	end;
})

FieldPlayerCityDef = Class:extends({
	init = function(self, player)
		self.player = player
		self.defs = {}
		self.defs[0] = 0
		self.defs[1] = 0
		self.defs[2] = 0
		self.defs[3] = 0
		self.defs[4] = 0
	end;
	
	setDefNumber = function(self, defType, number)
		self.defs[defType-CITYDEF_TYPE.FIRST] = number
	end;
	
	getDefNumber = function(self, defType)
		return self.defs[defType-CITYDEF_TYPE.FIRST]
	end;	
	
	setBuildingStopTime = function(self, stopTime)
	end;

	getBuildingStopTime = function(self)
	end;
	
	setBuildingResid = function(self, resId)
	end;
	
	getBuildingResid = function(self)
	end;
	
	setBuildingNumber = function(self, number)
	end;
	
	getBuildingNumber = function(self)
	end;	
})


