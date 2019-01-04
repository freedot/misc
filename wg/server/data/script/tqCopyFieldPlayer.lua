--*******************************************************************************
--*******************************************************************************
CopyFieldPlayer = BasePlayer:extends({
	init = function(self, fieldId)
		self.objType = OBJ_TYPE.COPYFIELD
		self.res = ItemResUtil:findItemres(fieldId)
		if self.res == nil then
			self.objType = OBJ_TYPE.NONE
			return
		end
		
		self.level = self.res.level
		self.name = self.res.name
		self.pos = {x=0, y=0}
		
		self:createCityDef()
		self:createHeroMgr(self.res)
		self:createArmyMgr(self.res)
	end;
	
	getRoleId = function(self)
		return self.res.id
	end;
	
	getIcon = function(self)
		return self.res.icon
	end;
})



