--
DirtyWordChecker = Class:extends({
	init = function(self)
		self.dirtyword = {'fuck','64'}
	end;
	
	has = function(self, str, needLevelMask)
		for key, d in pairs(res_dirtywords_ex) do
			if string.find(str, key) ~= nil then
				for _, w in ipairs(d) do
					if string.find(str, w.words) ~= nil then
						return true
					end
				end
			end
		end
		return false
	end;
	
	replace = function(self, str, needLevelMask)
		for key, d in pairs(res_dirtywords_ex) do
			if string.find(str, key) ~= nil then
				for _, w in ipairs(d) do
					if string.find(str, w.words) ~= nil then
						str = string.gsub(str, w.words, '*')
					end
				end
			end
		end
		return str
	end;
}):new()


