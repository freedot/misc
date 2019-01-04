ServerStartChecker = Class:extends({
	init = function(self)
		self.isStart_ = false
		self.canStartCdkey_ = true
	end;
	
	start = function(self, flag)
		self.isStart_ = flag
	end;
	
	isStart = function(self)
		return self.isStart_
	end;
	
	isCanLogin = function(self, userName)
		if self.isStart_ then
			return true
		end
		
		local flag = Service:getGmDB():getFlag(userName)
		return flag > 0
	end;
	
	startCdkey = function(self, flag)
		self.canStartCdkey_ = flag
	end;
	
	isStartCdkey = function(self)
		return self.canStartCdkey_
	end;
}):new()


ServerOnlineToggleChecker = Class:extends({
	init = function(self)
		self._flags = {
			cdkey = true,
		}
	end;
	
	setFlag = function(self, keyword, flag)
		self._flags[keyword] = flag
	end;
	
	isCanDo = function(self, keyword)
		local flag = self._flags[keyword]
		if flag == nil then
			return false
		end
		return flag
	end;
}):new()

