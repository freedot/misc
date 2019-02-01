-- 测试用例
-- unit-test/myclass.lua, unit-test/testclasslex.lua
function handle_comment(tcodes)
	-- 处理注释
	local ik = 0
	local cnt = table.getn(tcodes)
	for i=1, cnt, 1 do
		local v = tcodes[i]
		if v.flag == 0 then
			local icommet, _ = string.find(v.code, '%-%-', 1)
			-- 将v.code进行切分，同时将后续所有的v.flag都设置为1
			if icommet ~= nil then
				ik = i
				table.remove(tcodes, ik)
				if icommet > 1 then
					table.insert(tcodes, ik, {flag=0, code=string.sub(v.code, 1, icommet-1)})
					ik = ik + 1
				end
				
				table.insert(tcodes, ik, {flag=1, code=string.sub(v.code, icommet, -1)})
				break
			end
		end
	end
	--print(ik)
	if ik ~= nil and ik >= 1 then
		cnt = table.getn(tcodes)
		for i=1, cnt, 1 do
			local v = tcodes[i]
			if i >= ik then
				v.flag = 1
			end
		end
	end
end


function handle_blockquote_end(str_level, sline, tcodes)
	if str_level > 0 then
		local i3, i4 = string.find(sline, '%]%]', 1)
		local slen = string.len(sline)
		if i3 == nil then
			table.insert(tcodes, {flag=1, code=sline})
		else
			table.insert(tcodes, {flag=1, code=string.sub(sline, 1, i4)})
			if i4 < slen then
				table.insert(tcodes, {flag=0, code=string.sub(sline, i4+1, slen)})
			end
			str_level = 0
		end
	else
		table.insert(tcodes, {flag=0, code=sline})
	end
	return str_level
end


function handle_quote_start(str_level, tcodes)
	for k, v in ipairs(tcodes) do
		if v.flag == 0 then
			-- 解析单行字符串 '...'  "..."
			local tbquote_line = get_quoted_part(v.code)
			
			-- 解析块字符串
			local tbquote_block = {}
			local i1 = 0
			local i2 = 0
			while true do
				i1, i2 = string.find(v.code, '%[%[', i1 + 1)
				if i1 == nil then
					break
				end
				
				if i1 ~= nil then
					local inquoted = false
					for kk, vv in ipairs(tbquote_line) do
						if i1 > vv.a and i1 < vv.b then
							inquoted = true
							break
						end
					end
					
					-- 如果 [[ 不被字符串包括
					if not inquoted then
						str_level = 1
					end
					
					-- 查找同行是否有 ]]
					if str_level == 1 then
						_, i2 = string.find(v.code, '%]%]', i1+1)
						if i2 ~= nil then
							str_level = 0
							-- 记录该块
							table.insert(tbquote_block, {a=i1, b=i2})
							i1 = i2
						else
							table.insert(tbquote_block, {a=i1, b=0x7fffffff})
							break
						end
					end
				end
			end
			
			if table.getn(tbquote_line) ~= 0 or table.getn(tbquote_block) ~= 0 then
				table.remove(tcodes, k)
				
				-- 合并当行引号和块引号的区间
				local isfindinLine = false
				for k1, v1 in ipairs(tbquote_block) do
					isfindinLine = false
					for k2, v2 in ipairs(tbquote_line) do
						if v2.a >= v1.a and v2.a <= v1.b then
							-- 当前的行注释的头在块注释中
							v2.a = math.max(v2.a, v1.a)
							v2.b = math.max(v2.b, v1.b)
							isfindinLine = true
						end
					end
					
					if not isfindinLine then
						table.insert(tbquote_line, {a=v1.a, b=v1.b})
					end
				end
				
				-- 进行新区间的添加
				local lasta = -1
				local lastb = -1
				local inpos = k
				local lastpos = 1
				for k1, v1 in ipairs(tbquote_line) do
					if v1.a ~= lasta and v1.b ~= lastb then
						if v1.a > lastpos then
							table.insert(tcodes, inpos, {flag=0, code=string.sub(v.code, lastpos, v1.a-1)})
							inpos = inpos + 1
						end
						table.insert(tcodes, inpos, {flag=1, code=string.sub(v.code, v1.a, v1.b)})
						inpos = inpos + 1
						lastpos = v1.b + 1
						lasta = v1.a
						lastb = v1.b
					end
				end
				
				if lastpos <= string.len(v.code) then
					table.insert(tcodes, inpos, {flag=0, code=string.sub(v.code, lastpos, -1)})
				end
			end
			
			break -- 最多只有一个
		end
	end
	return str_level
end

function is_class(sline)
	local hasParam = true
	local classname = ''
	local ii, _, classname = string.find(sline, "^%s*class%s+([a-zA-Z0-9_]+)%s*[%(].-[%)]")
	if ii == nil then
		ii, _, classname = string.find(sline, "^%s*class%s+([a-zA-Z0-9_]+)%s*")
		hasParam = false
	end
	if ii ~= nil then
		return true, hasParam, classname
	end
	return false, false, ''
end


function tran_class(sline, hasparam)
	local src = ''
	if hasparam then
		src,_ = string.gsub(sline, "^%s*(class)%s+([a-zA-Z0-9_]+)%s*([%(])(.-)([%)])(.)", "%2 = BeginReloadClass(%2,%4)%6")
	else
		src,_ = string.gsub(sline, "^%s*(class)%s+([a-zA-Z0-9_]+)(.)", "%2 = BeginReloadClass(%2,nil)%3") 
	end
	return src
end

function is_classfunction(sline)
	local i, _ = string.find(sline, "^%s*function%s+[a-zA-Z0-9]+%s*%(%s*self[%s%),]", 1) 
	if i ~= nil then
		return true
	end
	return false
end

function tran_classfunction(sline, classname)
	local src,_ = string.gsub(sline, "^(%s*function%s+)([a-zA-Z0-9]+)(%s*%(%s*self[%s%),])", "%1"..classname..".%2%3")
	return src
end

function get_keyword(sline)
	local keytb = {}
	local s = string.gsub(sline, "([{}])", " %1 ")
	for w in string.gmatch(s, "[^%s,;=()]+") do
		table.insert(keytb, w)
	end
	return keytb
end

function get_quoted_part(s)
	local tb = {}
	local a = 0
	local b = 0
	while true do
		a, b, _, _ = string.find(s, "([\"\'])(.-)[^\\]%1", a+1)
		if a ~= nil then
			table.insert(tb, {a=a, b=b})
			a = b
		else
			break
		end
	end
	return tb
end

function tran_to_class(s, fname)
	local i1 = 0
	local i2 = 0
	local lex_level = 0
	local str_level = 0
	local linenum = 0
	local sline = ''
	local sline_start = ''
	local sline_mid = ''
	local sline_end = ''
	local ds = ''
	local cur_class_name = ''
	
	local behandle = false
	local alllen = string.len(s)
	while i1 < alllen do
		i2 = string.find(s, "[\n;]", i1+1)    -- find 'next' newline
		if i2 == nil then 
			if i1 + 1 <= alllen then
				i2 = alllen
			else
				break 
			end
		end
		sline = string.sub(s, i1+1, i2)
		linenum = linenum + 1
		i1 = i2
		
		local tcodes = {}
		
		-- 解析当前行 --
		
		-- 当前行还处在字符串的包围中
		str_level = handle_blockquote_end(str_level, sline, tcodes)
		
		-- 处理字符串开始的情况
		str_level = handle_quote_start(str_level, tcodes)
		
		-- 处理注释 --
		handle_comment(tcodes)
		
		-- 处理语法
		for k, v in ipairs(tcodes) do
			if v.flag == 0 then
				local keytb = get_keyword(v.code)
				if table.getn(keytb) == 0 then
					ds = ds..v.code
				end
				local bhasAdd = false
				for kk, key in ipairs(keytb) do
					if lex_level == 0 then
						-----------------------------
						-- 还没有进入class内
						local isClass, hasParam 
						isClass, hasParam, cur_class_name = is_class(v.code)
						if isClass then
							lex_level = lex_level + 1
							v.code = tran_class(v.code, hasParam)
						end
						if not bhasAdd then
							ds = ds..v.code
							bhasAdd = true
						end
					else
						-----------------------------
						--已经进入class内
						if key == 'function' and lex_level == 1 then
							-- 开始替换<进行语法检查，出错立即返回>，同时 lex_level ++
							lex_level = lex_level + 1
							if not is_classfunction(v.code) then
								error('class function lex error: file:'..fname..', line:'..linenum)
								return
							end
							v.code = tran_classfunction(v.code, cur_class_name)
							if not bhasAdd then
								ds = ds..v.code
								bhasAdd = true
							end
						elseif key == 'end' and lex_level == 1 then
							lex_level = lex_level - 1
							if not bhasAdd then
								ds = ds..string.gsub(v.code, "(%s*)end([%s\n]*)", "%1 %2")
								bhasAdd = true
							end
						else 
							if key == 'if' 
							  or key == 'while' 
							  or key == 'for' 
							  or key == 'function'
							  or key == '{'
							  or key == 'repeat' then
								lex_level = lex_level + 1
							elseif key == 'end' 
							  or key == '}' 
							  or key == 'until' then
								lex_level = lex_level - 1
							end
							if not bhasAdd then
								ds = ds..v.code
								bhasAdd = true
							end
						end
					end
				end
			else
				-- 注释或字符串
				ds = ds..v.code
			end
		end
	end
	return ds
end

function import(fname, isshow)
	local f = io.open(fname, "r")
	if f ~= nil then
		local s = f:read("*all")
		f:close()
		local ds = tran_to_class(s, fname)
		if isshow then
			print('================================ class file start ===============================')
			print(ds)
			print('================================= class file end ================================')
		end
		loadstring(ds)()
	end
end


