--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
CityPosPlayer = Class:extends({
	init = function(self, gridId)
		self.pos = app:getCityMgr():getPosByGridId(gridId)
	end;
	
	getObjType = function(self)
		return OBJ_TYPE.CITYPOS
	end;
	
	getCityPos = function(self)
		return self.pos
	end;
})


