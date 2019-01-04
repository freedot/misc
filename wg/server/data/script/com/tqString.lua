local array_left_bracket = '['
local array_right_bracket = ']'
local equal_mark = ':'
local boolean_true = '1'
local boolean_false = '0'

__toStringArray = function(elem)
	local sarray = ''
	if type(elem) == 'string' then
		sarray = sarray..'\"'..elem..'\"'
	elseif type(elem) == 'number' then
		sarray = sarray..elem
	elseif type(elem) == 'boolean' then
		if elem then
			sarray = sarray..boolean_true
		else
			sarray = sarray..boolean_false
		end
	elseif type(elem) == 'table' then
		sarray = sarray..__toCommString(elem)
	end
	return sarray
end;

__toStringDict = function(key, val)
	local sdict = ''
	if type(key) == 'number' then
		key = '"'..key..'"'
	end
	
	if type(val) == 'string' then
		sdict = key..equal_mark..'\"'..val..'\"'
	elseif type(val) == 'number' then
		sdict = key..equal_mark..val
	elseif type(val) == 'boolean' then
		if v then
			sdict = key..equal_mark..'1'
		else
			sdict = key..equal_mark..'0'
		end
	elseif type(val) == 'table' then
		sdict = key..equal_mark..__toCommString(val)
	end
	return sdict
end;

__toCommString = function(luaTable)
	local isArray = false
	if table.getn(luaTable) > 0 then
		local sarray = ''
		for _, elem in ipairs(luaTable) do
			if (sarray ~= '') then sarray = sarray..',' end
			sarray = sarray..__toStringArray(elem)
		end
		return array_left_bracket..sarray..array_right_bracket
	else
		local sdict = ''
		for key, val in pairs(luaTable) do
			if (sdict ~= '') then sdict = sdict..',' end
			sdict = sdict..__toStringDict(key, val)
		end
		return '{'..sdict..'}'
	end
end;

toJIONString = function(luaTable)
	array_left_bracket = '['
	array_right_bracket = ']'
	equal_mark = ':'
	boolean_true = '1'
	boolean_false = '0'

	return __toCommString(luaTable)
end

toLUAString = function(luaTable)
	array_left_bracket = '{'
	array_right_bracket = '}'
	equal_mark = '='
	boolean_true = 'true'
	boolean_false = 'false'

	return __toCommString(luaTable)
end




