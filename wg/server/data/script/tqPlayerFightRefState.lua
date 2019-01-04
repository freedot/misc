--*******************************************************************************
PlayerFightRefState = Class:extends({
	init = function(self, player)
		self.player_ = player
	end;
	
	-- player委托调用
	addDeclareState = function(self, roleId)
		return Repository:getFightState():startDeclareState(self.player_:getRoleId(), roleId)
	end;
	
	-- player委托调用
	getRefState = function(self, roleId)
		return Repository:getFightState():getState(self.player_:getRoleId(), roleId)
	end;
	
	-- 有用，在添加的时候
	isFull = function(self) 
		local count = table.getn(Repository:getFightState():getRoleMap(self.player_:getRoleId()))
		return count == res_max_declare_count
	end;
})


