--*******************************************************************************
ExileRolesRefresher = Class:extends({
	init = function(self)
		self.isComplete_ = false
	end;
	
	start = function(self)
		self.isComplete_ = false
	end;
	
	refresh = function(self)
		if (self.isComplete_) then return end
		
		app:getCityMgr():refreshExileRoleIds()
		self.isComplete_ = true
	end;
	
	isComplete = function(self)
		return self.isComplete_
	end;	
})


