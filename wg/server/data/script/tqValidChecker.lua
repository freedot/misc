--
ValidChecker = Class:extends({
	init = function(self)
		self.minrolelen = 3
		self.maxrolelen = 12
		self.minherolen = 3
		self.maxherolen = 8
		
		self.minallilen = 3
		self.maxallilen = 12
		
		self.minalliflaglen = 1
		self.maxalliflaglen = 2
		
		self.minMailTitle = 1
		self.maxMailTitle = MAX_MAILTITLE_LEN
		self.minMailMsg = 1
		self.maxMailMsg = MAX_MAILCON_LEN
	end;
	
	isRoleName = function(self, name)
		return self:_isValidName(name, self.minrolelen, self.maxrolelen, rstr.validname.role)
	end;
	
	isHeroName = function(self, name)
		return self:_isValidName(name, self.minherolen, self.maxherolen, rstr.validname.hero)
	end;

	isUserName = function(self, name)
		local errorTip = rstr.validname.role
		local len = string.len(name)
		if len < 3 then
			setLastErrorStr(errorTip.short)
			return false
		elseif len > 32 then
			setLastErrorStr(errorTip.long)
			return false
		elseif UtfString:travel(name, self, self._isInvalidChar) < 0 then
			setLastErrorStr(errorTip.invalid)
			return false
		end
		return true
	end;
	
	isNewRoleName = function(self, name)
		if SPub:IsExistRoleName(name) then
			setLastErrorStr(rstr.validname.role.exist)
			return false
		end
		return true
	end;
	
	isAllianceName = function(self, name)
		return self:_isValidName(name, self.minallilen, self.maxallilen, rstr.validname.alli)
	end;
	
	isNewAllianceName = function(self, name)
		if app:getAlliMgr():getAlliByName(name):getId() > 0 then
			setLastErrorStr(rstr.validname.alli.exist)
			return false
		end
		return true
	end;
	
	isAllianceFlagName = function(self, flag)
		if not self:_isValidName(flag, self.minalliflaglen, self.maxalliflaglen, rstr.validname.alliflag) then
			return false
		end
		
		local len = string.len(flag)
		if len == 1 then
			return true
		end
		
		for i=1, len, 1 do
			local code = string.byte(flag, i)
			if self:_isInvalidChar(i, 1, code, 0) == 0 then
				setLastErrorStr(rstr.validname.alliflag.long)
				return false
			end
		end
		
		return true
	end;
	
	isNewAllianceFlagName = function(self, name)
		if app:getAlliMgr():getAlliByFlagName(name):getId() > 0 then
			setLastErrorStr(rstr.validname.alliflag.exist)
			return false
		end
		return true
	end;
	
	isMailTitle = function(self, title)
		if (string.len(title) < self.minMailTitle) then
			setLastErrorStr(rstr.mail.err.title.short)
			return false
		elseif (string.len(title) > self.maxMailTitle) then
			setLastErrorStr(rstr.mail.err.title.long)
			return false
		end
		return true
	end;
	
	isMailMsg = function(self, msg)
		if (string.len(msg) < self.minMailMsg) then
			setLastErrorStr(rstr.mail.err.msg.short)
			return false
		elseif (string.len(msg) > self.maxMailMsg) then
			setLastErrorStr(rstr.mail.err.msg.long)
			return false
		end
		return true
	end;
	
	_isValidName = function(self, name, minLen, maxLen, errorTip)
		local len = UtfString:gbklen(name)
		if name == '' then
			setLastErrorStr(errorTip.empty)
			return false
		elseif len < minLen then
			setLastErrorStr(errorTip.short)
			return false
		elseif len > maxLen then
			setLastErrorStr(errorTip.long)
			return false
		elseif UtfString:travel(name, self, self._isInvalidChar) < 0 then
			setLastErrorStr(errorTip.invalid)
			return false
		elseif DirtyWordChecker:has(name) then
			setLastErrorStr(errorTip.mask)
			return false
		end
		return true		
	end;
	
	_isInvalidChar = function(self, pos, bytes, code, rt)
		if bytes ~= 1 then return 0 end
		local c = string.char(code)
		if (c >= 'a' and c <= 'z') or (c >= 'A' and c <= 'Z') or (c >= '0' and c <= '9') or c == '_' or c == '*' then -- c == '*' just for guest name
			return 0
		else
			return -1
		end
	end;
	
}):new()




