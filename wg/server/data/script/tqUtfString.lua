
UtfString = Class:extends({
	init = function(self)
		self.tags = {0,0xc0,0xe0,0xf0,0xf8,0xfc}
	end;
	
	gbklen = function(self, str)
		return self:travel(str, self, self._converttogbkbytes)
	end;
	
	travel = function(self, str, obj, fun)
		local rt = 0
		local len = string.len(str)
		local i = 1
		while i <= len do
			local code = string.byte(str, i)
			local bytes =  self:_findbytes(code)
			rt = fun(obj, i, bytes, code, rt)
			if rt == -1 then break end
			i = i + bytes
		end
		return rt
	end;
	
	_findbytes = function(self, code)
		local rt = 1
		for i, t in ipairs(self.tags) do
			if code >= t then
				rt = i
			else
				break
			end
		end
		return rt
	end;
	
	_converttogbkbytes = function(self, pos, bytes, code, rt)
		if bytes == 1 then
			return rt + 1
		elseif bytes < 4 then
			return rt + 2
		else
			return rt + 4
		end
	end	
}):new()


