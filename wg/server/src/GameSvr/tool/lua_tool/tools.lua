--输出所有创建表的sql文件
--@param tb 将要被创建的描述表
function output_dbsql(tb)
	local zone_id = string.format('%03d', tb.zone_id)
	for k, v in ipairs(tb) do
		--进行通配符的替换
		local output_file = string.gsub(v.output_file, '$<zoneid>', zone_id)
		local table_name = string.gsub(v.table_name, '$<zoneid>', zone_id)
		table_name = string.gsub(v.table_name, '$<zoneid>', zone_id)
		if v.table_id ~= nil then
			local table_id = string.format('%d', v.table_id)
			table_name = string.gsub(table_name, '$<tableid>', table_id)
			output_file = string.gsub(output_file, '$<tableid>', table_id)
		end
		
		--输出字段的定义
		local has_first = false
		local sql_outstr = ''
		sql_outstr = sql_outstr..'DROP TABLE IF EXISTS '..table_name..';\n'
		sql_outstr = sql_outstr..'SET @saved_cs_client     = @@character_set_client;\n'
		sql_outstr = sql_outstr..'SET character_set_client = utf8;\n'
		sql_outstr = sql_outstr..'CREATE TABLE '..table_name..' (\n'
		for kk, vv in ipairs(v) do
			if has_first then
				sql_outstr = sql_outstr..',\n'
			else
				has_first = true
			end
			sql_outstr = sql_outstr..'\t`'..vv.field..'` '..vv.attr
		end
		
		--输出关键字的定义
		for kk, vv in ipairs(v) do
			if vv.keytype == 'PRIMARY' then
				sql_outstr = sql_outstr..',\n\tPRIMARY KEY(`'..vv.field..'`)'
			elseif vv.keytype == 'UNIQUE' then
				sql_outstr = sql_outstr..',\n\tUNIQUE KEY `'..vv.field..'` (`'..vv.field..'`)'
			end
		end
		sql_outstr = sql_outstr..'\n)ENGINE=InnoDB DEFAULT CHARSET=utf8;\n'
		sql_outstr = sql_outstr..'SET character_set_client = @saved_cs_client;\n'
		
		--写入文件中
		local sql_outfile = assert(io.open(output_file, "w"))
		sql_outfile:write(sql_outstr)
		
		--写入附加的sql语句
		if v.append_sql ~= nil then
			sql_outfile:write(v.append_sql)
		end
		
		sql_outfile:close()
		print('create '..output_file..' ok!')
	end
end

--独立运行
if package.loaded['tools'] == nil and package.loaded['lua_tool.tools'] == nil then
	print('***不能独立运行！')
end