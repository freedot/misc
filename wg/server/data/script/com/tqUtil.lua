require('tqClass')
all_print_char = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

function floatEQ(f1, f2, drt)
	if drt == nil then drt = 0.001 end
	return math.abs(f1 - f2) < drt
end

function eval( str, localenv )
	if localenv == nil then 
		localenv = {} 
	end
	local func = loadstring("return " .. str)
	setfenv(func, localenv)
	return func()
end

math.clamp = function(val, minVal, maxVal)
	if val < minVal then
		return minVal
	end
	
	if val > maxVal then
		return maxVal
	end
	
	return val
end

-- @datestr -- 形式为 2003-10-10 or 2003-10-10 8:00:00
-- @return -- 
os.strptime = function(datestr)
	if datestr == nil then return nil end
	
	local year, month, day, hour, min, sec = string.match(datestr, '(%d+)-(%d+)-(%d+) (%d+):(%d+):(%d+)')
	if year ~= nil then
		return {year=year, month=month, day=day, hour=hour, min=min, sec=sec}
	end
	
	year, month, day = string.match(datestr, '(%d+)-(%d+)-(%d+)')
	if year ~= nil then
		return {year=year, month=month, day=day, hour=0, min=0, sec=0}
	end
	
	return nil
end

Util = Class:extends({
	----------------------------------------------------------------------------------------------------
	init = function(self)
		self.lastfindidx = -1
		self.timedrt = 0
	end;
	
	----------------------------------------------------------------------------------------------------
	safeEval = function(self, rstr)
		local estr = nil
		pcall( function () estr = loadstring("return "..rstr)() end )
		return estr
	end;
	
	----------------------------------------------------------------------------------------------------
	getNumber = function(self, tb, key, default)
		if tb == nil then
			if default ~= nil then
				return default
			else
				return 0
			end
		end
		if tb[key] == nil or type(tb[key]) ~= 'number' then
			if default ~= nil then
				return default
			else
				return 0
			end
		end
		return tb[key]
	end;
	
	toNumber = function(self, s, default)
		local n =  tonumber(s)
		if n ~= nil then return n end
		
		if default ~= nil then
			return default
		else
			return 0
		end
	end;
	
	----------------------------------------------------------------------------------------------------
	getString = function(self, tb, key)
		if tb == nil then
			return ''
		end
		
		if tb[key] == nil or type(tb[key]) ~= 'string' then
			return ''
		end
		return tb[key]
	end;
	
	----------------------------------------------------------------------------------------------------
	createRandKey = function(self)	
		local key = ''
		local slen = string.len(all_print_char)
		for i=1, 16, 1 do
			local ipos = math.random(slen)
			key = key..string.sub(all_print_char, ipos, ipos)
		end
		return key
	end;
	
	----------------------------------------------------------------------------------------------------
	qfind = function(self, arrays, keyname, keyval) 
		return self:innerQFind(arrays, 1, table.getn(arrays)+1, keyname, keyval) 
	end;
	
	----------------------------------------------------------------------------------------------------
	find = function(self, arrays, keyname, keyval)
		return self:innerFind(arrays, 1, table.getn(arrays), keyname, keyval);
	end;
	
	----------------------------------------------------------------------------------------------------
	qfindC = function(self, arrays, arraylen, keyname, keyval) 
		return self:innerQFind(arrays, 0, arraylen, keyname, keyval) 
	end;
	
	----------------------------------------------------------------------------------------------------
	findC = function(self, arrays, arraylen, keyname, keyval)
		return self:innerFind(arrays, 0, arraylen-1, keyname, keyval)
	end;
	
	----------------------------------------------------------------------------------------------------
	findByFun = function(self, arrays, funName, keyval)
		self.lastfindidx = -1
		for i, v in ipairs(arrays) do
			if v[funName](v) == keyval then
				self.lastfindidx = i
				return v, i
			end
		end
		return nil, -1
	end;
	
	----------------------------------------------------------------------------------------------------
	innerFind = function(self, arrays, from, to, keyname, keyval) 
		self.lastfindidx = -1
		local cvalue = nil
		for i=from, to, 1 do
			local v = arrays[i]
			if keyname == nil then
				cvalue = v
			else
				cvalue = v[keyname]
			end
			if cvalue == keyval then
				self.lastfindidx = i
				return v
			end		
		end
		return nil
	end;
	
	----------------------------------------------------------------------------------------------------
	innerQFind = function(self, arrays, first, last, keyname, keyval) 
		self.lastfindidx = -1
		local mid = first
		local midValue
		while (first<last) do
			mid = math.floor((first+last)/2)
			if keyname == nil then
				midValue = arrays[mid]
			else
				midValue = arrays[mid][keyname]
			end
			if (keyval==midValue) then
				self.lastfindidx = mid
				return arrays[mid], self.lastfindidx, mid
			elseif (keyval<midValue) then
				last=mid
			else
				first=mid+1
			end
		end
		return nil, self.lastfindidx, mid
	end;
	
	----------------------------------------------------------------------------------------------------
	getLastFindIdx = function(self)
		return self.lastfindidx
	end;
	
	removeElementC = function(self, arrays, len, removeidx)
		return self:removeElementsC(arrays, len, removeidx, 1)
	end;
	
	removeElementsC = function(self, arrays, len, removeidx, removelen)
		local lastidx = len - 1 - removelen
		for i=removeidx, lastidx, 1 do
			arrays[i] = arrays[i+removelen]
		end
		return len-removelen
	end;
	
	qinsertElementC = function(self, arrays, arraylen, keyname, keyval, val) 
		local _, findIdx, midIdx = self:qfindC(arrays, arraylen, keyname, keyval)
		local insertIdx = 0
		if findIdx >= 0 then
			insertIdx = findIdx
		elseif arraylen > 0 then
			insertIdx = midIdx
			if keyname == nil and keyval > arrays[insertIdx] then
				insertIdx = insertIdx + 1
			elseif keyname ~= nil and keyval > arrays[insertIdx][keyname] then
				insertIdx = insertIdx + 1
			end
		end
		
		local newLen = arraylen + 1
		local lastIdx = newLen - 1
		for i=lastIdx, insertIdx+1, -1 do
			arrays[i] = arrays[i-1]
		end
		
		if type(val) == 'table' then
			Util:dictCopy(arrays[insertIdx], val)
		else
			arrays[insertIdx] = val
		end
	end;
	
	getTime = function(self)
		return os.time() + self.timedrt
	end;
	
	setTimeDrt = function(self, drt)
		self.timedrt = drt
	end;
	
	isCurDay = function(self, timesec)
		local lastYearDay = os.date("*t", timesec).yday
		local curYearDay = os.date("*t", self:getTime()).yday
		return self:isCurYear(timesec) and (lastYearDay == curYearDay)
	end;
	
	isCurMonth = function(self, timesec)
		local lastMonth = os.date("*t", timesec).month
		local curMonth = os.date("*t", self:getTime()).month
		return self:isCurYear(timesec) and (lastMonth == curMonth)
	end;
	
	isCurYear = function(self, timesec)
		return os.date("*t", timesec).year == os.date("*t", self:getTime()).year
	end;
	
	--@remark 当curtime恰好和 hour:min:sec 重合时，则返回 curtime
	getFixNextTime = function(self, curtime, hour, min, sec)
		if type(curtime) ~= 'number' then
			curtime = 1
		end
		
		local curTM = os.date("*t", curtime)
		local ttime = os.time{year=curTM.year, month=curTM.month, day=curTM.day, hour=hour, min=min, sec=sec}
		if ttime == nil then return curtime end
		
		while ttime < curtime do
			ttime = ttime + 24*3600
		end
		return ttime
	end;
	
	--@remark 当curtime恰好和 hour:min:sec 重合时，则返回 curtime
	getFixPreTime = function(self, curtime, hour, min, sec)
		local t = self:getFixNextTime(curtime, hour, min, sec)
		
		while t > curtime do
			t = t - 24*3600
		end
		return t
	end;
	
	random = function(self, val)
		if val <= 0 then return 0 end
		return math.random(val) 
	end;
	
	stringSub = function(self, s, len)
		if string.len(s) <= len then
			return s
		else
			return string.sub(s, 1, len)
		end
	end;
	
	getRoundRandVal = function(self, vals, curPer)
		local totalPer = 0
		for _, v in ipairs(vals) do
			totalPer = totalPer + v.per
			if curPer <=  totalPer then
				return v
			end
		end
		return nil
	end;
	
	dictCopy = function(self, destb, srctb)
		for k, v in pairs(srctb) do
			if k~= nil then
				if type(v) == 'table' then
					TableCopy(destb[k], v)
				else
					destb[k] = v
				end
			end
		end
	end;
	
	insertUnique = function(self, array, key, val)
		local keyVal = val
		if key ~= nil then
			keyVal = val[key]
		end
		
		if Util:find(array, key, keyVal) == nil then
			table.insert(array, val)
		end
	end;
	
	pairListToDict = function(self, pairList)
		local disc = {}
		local halfLen = table.getn(pairList)/2
		for i=1, halfLen, 1 do
			disc[pairList[2*i-1]] = pairList[2*i];
		end
		return disc
	end;
	
	isInRects = function(self, rects, x, y)
		for _, rect in ipairs(rects) do
			if (x >= rect.x) and x < (rect.x+rect.w) and (y >= rect.y) and y < (rect.y+rect.h) then
				return true
			end
		end
		
		return false
	end;
	
}):new()


