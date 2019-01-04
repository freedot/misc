--*******************************************************************************
out = Class:extends({
	init = function(self)
		self.lastTime = 0
	end;
	
	print = function(self, msg, printTime)
		local pmsg = msg
		if printTime ~= nil and printTime == 'printTime' then
			pmsg = pmsg .. ' [used time]:' .. (os.clock() - self.lastTime)
		end
		print ( pmsg )
		self.lastTime = os.clock()
	end;
}):new()

