--在结构中对于默认值NULL的替换对照表，即表中的定义全部会被替换成NULL
default_null_table = {'nil', 'null', 'None', 'Null'};

--在转换中类型定义表
typedef_table = {
	int8 = {
		tag = 'c';
		type = 'int8';
		decode = 'D_INT8';
		encode = 'E_INT8';
		a_decode = 'D_ARRAY_INT8';
		a_encode = 'E_ARRAY_INT8';
		str_to_val = '(int8)SafeAsciToInt';
		fmt = '%d';
		type_cast = 'int';
	};
	
	uint8 = {
		tag = 'uc';
		type = 'uint8';
		decode = 'D_UINT8';
		encode = 'E_UINT8';
		a_decode = 'D_ARRAY_UINT8';
		a_encode = 'E_ARRAY_UINT8';
		str_to_val = '(uint8)SafeAsciToULong';
		fmt = '%u';
		type_cast = 'uint';
	};
	
	int16 = {
		tag = 's';
		type = 'int16';
		decode = 'D_INT16';
		encode = 'E_INT16';
		a_decode = 'D_ARRAY_INT16';
		a_encode = 'E_ARRAY_INT16';
		str_to_val = '(int16)SafeAsciToInt';
		fmt = '%d';
		type_cast = 'int';
	};
	
	uint16 = {
		tag = 'us';
		type = 'uint16';
		decode = 'D_UINT16';
		encode = 'E_UINT16';
		a_decode = 'D_ARRAY_UINT16';
		a_encode = 'E_ARRAY_UINT16';
		str_to_val = '(uint16)SafeAsciToULong';
		fmt = '%u';
		type_cast = 'uint';
	};
	
	int32 = {
		tag = 'l';
		type = 'int32';
		decode = 'D_INT32';
		encode = 'E_INT32';
		a_decode = 'D_ARRAY_INT32';
		a_encode = 'E_ARRAY_INT32';
		str_to_val = '(int32)SafeAsciToULong';
		fmt = '%d';
		type_cast = 'int';
	};
	
	uint32 = {
		tag = 'ul';
		type = 'uint32';
		decode = 'D_UINT32';
		encode = 'E_UINT32';
		a_decode = 'D_ARRAY_UINT32';
		a_encode = 'E_ARRAY_UINT32';
		str_to_val = 'SafeAsciToULong';
		fmt = '%u';
		type_cast = 'uint';
	};
	
	int64 = {
		tag = 'll';
		type = 'int64';
		decode = 'D_INT64';
		encode = 'E_INT64';
		a_decode = 'D_ARRAY_INT64';
		a_encode = 'E_ARRAY_INT64';
		str_to_val = '(int64)SafeAsciToUInt64';
		fmt = '%I64d';
	};
	
	uint64 = {
		tag = 'ull';
		type = 'uint64';
		decode = 'D_UINT64';
		encode = 'E_UINT64';
		a_decode = 'D_ARRAY_UINT64';
		a_encode = 'E_ARRAY_UINT64';
		str_to_val = 'SafeAsciToUInt64';
		fmt = '%I64u';
	};
	
	string = {
		tag = 'sz';
		type = 'char';
		decode = 'D_STRING';
		encode = 'E_STRING';
		decode = 'D_STRING';
		encode = 'E_STRING';
		fmt = '\\"%s\\"';
	};
};

typedef_table.char = typedef_table.int8
typedef_table.uchar = typedef_table.uint8
typedef_table.short = typedef_table.int16
typedef_table.ushort = typedef_table.uint16
typedef_table.long = typedef_table.int32
typedef_table.ulong = typedef_table.uint32
typedef_table.longlong = typedef_table.int64
typedef_table.ulonglong = typedef_table.uint64
local g_item_fieldName = {};

function is_number_type(type)
	if type == 'int8'
		or type == 'uint8'
		or type == 'int16'
		or type == 'uint16'
		or type == 'long'
		or type == 'ulong'
		or type == 'int32'
		or type == 'uint32'
		or type == 'int64'
		or type == 'uint64' then
		return true 
	end
	return false
end

--通过item获得字段名
function get_structfieldname_by_item(it)
	local type = it.type
	if it.purename ~= nil then
		return it.purename
	elseif typedef_table[type] ~= nil then
		if it.count == nil then
			return typedef_table[type].tag..it.name
		else -- 数组
			local array_tag = ''
			if type ~= 'string' and type ~= 'tstring' then
				array_tag = 'a'
			end
			return array_tag..typedef_table[type].tag..it.name
		end 
	else
		if it.count == nil then
			return 'st'..it.name
		else -- 数组
			return 'ast'..it.name
		end
	end
	error('error happen')
	return ''
end

function store_structfieldname(it, fieldname)
	if it.purename ~= nil then
		g_item_fieldName[it.purename] = fieldname
	else
		g_item_fieldName[it.name] = fieldname
	end
end

--通过存储的列表中获取字段名
function get_structfieldname_by_stores(name)
	return g_item_fieldName[name]
end

--输出h文件头的定义
function output_begin_h(ofile, tb)
	ofile:write('/** 该文件代码由工具tools_h自动生成，请勿手动修改。 '..os.date()..'*/\n')
	ofile:write('#ifndef _tq_role_338saf3w3_var_h_\n')
	ofile:write('#define _tq_role_338saf3w3_var_h_\n')
	ofile:write('#include <pkgBits.h>\n')
	ofile:write('#include <pkgBase.h>\n')
end

--输出h文件尾的定义
function output_end_h(ofile, tb)
	ofile:write('\n\n#endif //_tq_role_338saf3w3_var_h_\n')
end

--输出常数的定义
function output_const_h(ofile, tb)
	local outstr = '\n\n/**----------------const---------------*/\n'
	if tb.is_out_tolua then
		outstr = outstr..'//tolua_begin\n'
	end
	
	-- 进行输出对齐操作
	for i, c in ipairs(tb.const) do
		local outitemstr = '#define '..c.name
		local itembytes = string.len(outitemstr)
		itembytes = math.floor(itembytes/4)
		itembytes = 13 - itembytes
		if itembytes <= 0 then 
			itembytes = 1
		end
		local k = 1
		for k=1,itembytes do
			outitemstr = outitemstr..'\t'
		end
		outstr = outstr..outitemstr..' '..c.val..'\n'
	end

	if tb.is_out_tolua then
		outstr = outstr..'//tolua_end\n'
	end
	
	ofile:write(outstr)
end

-- 输出结构的成员
function output_struct_defitem(outstr, st)
	for i, it in ipairs(st.item) do
		local outitemstr = ''
		local type = it.type
		local fieldname = get_structfieldname_by_item(it)
		store_structfieldname(it, fieldname)
		if typedef_table[type] ~= nil then
			if it.count == nil then
				outitemstr = outitemstr..'\t'..typedef_table[type].type..' '..fieldname..';'
			else -- 数组
				outitemstr = outitemstr..'\t'..typedef_table[type].type..' '..fieldname
				outitemstr = outitemstr..'['..it.count..'];'
			end 
		else
			if it.count == nil then
				outitemstr = outitemstr..'\t'..it.type..' '..fieldname..';'
			else -- 数组
				outitemstr = outitemstr..'\t'..it.type..' '..fieldname
				outitemstr = outitemstr..'['..it.count..'];'
			end
		end
		
		-- 输出成员说明(进行制表对齐)
		local itembytes = string.len(outitemstr) - 1
		itembytes = math.floor(itembytes/4)
		itembytes = 15 - itembytes
		if itembytes <= 0 then 
			itembytes = 1
		end
		
		local k = 1
		if it.desc ~= nil and it.desc ~= '' then
			for k=1,itembytes do
				outitemstr = outitemstr..'\t'
			end
			outitemstr = outitemstr..'// '..it.desc..'\n'
		else
			outitemstr = outitemstr..'\n'
		end
		outstr = outstr..outitemstr
	end
	return outstr
end

-- 输出构造函数
function output_struct_construct(outstr, st)
	outstr = outstr..'\n\t'..st.name..'()'
	local bfirst = true
	local funtruck = ''
	for i, it in ipairs(st.item) do
		local type = it.type
		if typedef_table[type] ~= nil and it.default ~= nil then
			for k, v in ipairs(default_null_table) do
				if v == it.default then
					it.default = 'NULL'
					break
				end
			end
			
			if bfirst then
				bfirst = false
				outstr = outstr..':'..get_structfieldname_by_item(it)..'('..it.default..')'
			else
				outstr = outstr..',\n\t\t'..get_structfieldname_by_item(it)..'('..it.default..')'
			end
		end
		
		local fieldName = get_structfieldname_by_item(it)
		if type == 'string' then
			funtruck = funtruck..'\t\t'..fieldName..'[0]=0;\n'
		elseif (it.count ~= nil) 
			and (it.refer == nil) 
			and is_number_type(type) then
			funtruck = funtruck..'\t\tmemset('..fieldName..', 0, sizeof('..fieldName..'[0])*'..it.count..');\n'
		end
	end
	if funtruck == '' then
		outstr = outstr..'{}\n'
	else
		outstr = outstr..'{\n'..funtruck..'\t}\n'
	end
	return outstr
end

-- 输出 Decode 成员函数
function output_struct_decode(outstr, st)
	outstr = outstr..'\n\tint Decode(const char* lpInBuf, int iInBufLen, int iPos, int iVer){\n'
	if st.type == 'struct' then
		for i, it in ipairs(st.item) do
			local type = it.type

			-- 求得字段的版本号
			local itemver = 0
			if it.ver ~= nil then
				itemver = it.ver
			end
			
			local cur_decode = 'D_STRUCT'
			local cur_a_decode = 'D_ARRAY_STRUCT'
			if typedef_table[type] ~= nil then
				cur_decode = typedef_table[type].decode
				cur_a_decode = typedef_table[type].a_decode
			end
			
			local bArray = false
			local szCurCount = it.count
			if it.count ~= nil and type ~= 'string' then
				bArray = true
				if it.refer ~= nil then
					szCurCount = get_structfieldname_by_stores(it.refer)
				end
			end
			
			if not bArray then
				outstr = outstr..'\t\t'
				if type == 'string' then
					if it.count == nil then
						errmsg = '**struct define err:'..st.name..'.'..it.name
						errmsg = errmsg..' : must define the string count'
						print(errmsg)
						return
					end
					outstr = outstr..cur_decode..'('..get_structfieldname_by_item(it)..', '..it.count..', '..itemver..');\n'
				else
					outstr = outstr..cur_decode..'('..get_structfieldname_by_item(it)..', '..itemver..');\n'
				end
			else -- 数组  
				outstr = outstr..'\t\t'
				outstr = outstr..cur_a_decode..'('..get_structfieldname_by_item(it)..', '..szCurCount..', '..it.count..', '..itemver..');\n'
			end
		end
	end
	
	outstr = outstr..'\t\treturn iPos;\n'
	outstr = outstr..'\t}\n'
	return outstr
end

-- 输出 Encode 成员函数
function output_struct_encode(outstr, st)
	outstr = outstr..'\n\tint Encode(char* lpOutBuf, int iOutBufLen, int iPos, int iVer){\n'
	if st.type == 'struct' then
		for i, it in ipairs(st.item) do
			local type = it.type
			
			-- 求得字段的版本号
			local itemver = 0
			if it.ver ~= nil then
				itemver = it.ver
			end
			
			local cur_encode = 'E_STRUCT'
			local cur_a_encode = 'E_ARRAY_STRUCT'
			if typedef_table[type] ~= nil then
				cur_encode = typedef_table[type].encode
				cur_a_encode = typedef_table[type].a_encode
			end
			
			local bArray = false
			local szCurCount = it.count
			if it.count ~= nil and type ~= 'string' then
				bArray = true
				if it.refer ~= nil then
					szCurCount = get_structfieldname_by_stores(it.refer)
				end
			end
			
			if not bArray then
				outstr = outstr..'\t\t'
				if type == 'string' then
					if it.count == nil then
						errmsg = '**struct define err:'..st.name..'.'..it.name
						errmsg = errmsg..' : must define the string count'
						print(errmsg)
						return
					end
					outstr = outstr..cur_encode..'('..get_structfieldname_by_item(it)..', '..it.count..', '..itemver..');\n'
				else
					outstr = outstr..cur_encode..'('..get_structfieldname_by_item(it)..', '..itemver..');\n'
				end
			else -- 数组
				outstr = outstr..'\t\t'
				outstr = outstr..cur_a_encode..'('..get_structfieldname_by_item(it)..', '..szCurCount..', '..it.count..', '..itemver..');\n'
			end
		end
	end
	
	outstr = outstr..'\t\treturn iPos;\n'
	outstr = outstr..'\t}\n'
	return outstr
end

-- 输出结构的定义
function output_struct_h(ofile, tb)
	local outstr = '\n\n/**----------------struct---------------*/\n\n'
	outstr = outstr..'#pragma pack(push, 1)\n'
	local db_struct = {}
	for i, st in ipairs(tb.struct) do
		-- 判断该结构是否输出db字段
		if st.binddb ~= nil then
			table.insert(db_struct, st)
		end
		
		-- 输出结构说明
		if st.desc ~= nil and st.desc ~= '' then
			outstr = outstr..'/*\n *  '..st.desc..'\n */\n'
		end
		
		-- 导出到lua中
		if tb.is_out_tolua then
			outstr = outstr..st.type..' '..st.name..' //tolua_export \n\t: public SPkgBase \n{//tolua_export\n\t//tolua_begin\n'
		else
			outstr = outstr..st.type..' '..st.name..' : public SPkgBase {\n'
		end
		
		-- 输出结构的成员
		outstr = output_struct_defitem(outstr, st)
		
		-- 导出到lua中
		if tb.is_out_tolua then
			outstr = outstr..'\t//tolua_end\n'
		end
		
		-- 输出构造函数
		outstr = output_struct_construct(outstr, st)
		
		-- 输出 Decode 成员函数
		outstr = output_struct_decode(outstr, st)
		
		-- 输出 Encode 成员函数
		outstr = output_struct_encode(outstr, st)
		
		if tb.is_out_tolua then
			outstr = outstr..'};//tolua_export\n\n\n'
		else
			outstr = outstr..'};\n\n\n'
		end
	end
	outstr = outstr..'#pragma pack(pop)\n'
	ofile:write(outstr)
end

--输出db的辅助函数
function output_db_assist(outstr)
	--输出VarReadBlobFromDB
	outstr = outstr..[[
	inline int VarReadBlobFromDB(const char* lpBuf, int iBufLen, SPkgBase* lpBase)
	{
		if ( iBufLen >= 2 )
		{
			ushort usVer = ntohs(*((ushort*)lpBuf));
			lpBuf += 2;
			iBufLen -= 2;
			if ( lpBase->Decode(lpBuf, iBufLen, 0, usVer) < 0 )
			{
				return RET_LOGIN_DBFIELD_ERR;
			}
			return RET_LOGIN_OK;
		}
		else if ( iBufLen == 0 )
		{
			// 只是简单的返回
			return RET_LOGIN_OK;
		}
		return RET_LOGIN_DBFIELD_NOENOUGH_LEN;
	}]]
	
	--输出VarWriteBlobForDB
	outstr = outstr..[[
	
	
	inline int VarWriteBlobForDB(IO::IDatabase* lpIDB, char* lpszSql, int iSqlBufLen, char* lpBuf, int iBufLen, const SPkgBase* lpBase)
	{
		lpBuf[0] = 0;
		if ( iBufLen >= 2 )
		{
			*((ushort*)lpszSql) = htons(PKG_CUR_VER);
			int iPackLen = ((SPkgBase*)lpBase)->Encode(lpszSql+2, iSqlBufLen-2, 0, PKG_CUR_VER);
			if ( iPackLen >= 0 )
			{
				iPackLen += 2;
				if ( iBufLen < 2*iPackLen + 1 )
				{
					LOG("COM", "***buffer len must great 2*iPackLen + 1, falied in VarWriteBlobForDB!");
					return RET_CREATEROLE_DBFIELD_ERR;
				}
	
				if ( lpIDB->RealEscapeString(lpBuf, lpszSql, iPackLen) > 0 )
				{
					return RET_CREATEROLE_OK;
				}
			}
		}
		LOG("COM", "***buffer len must great 2, falied in VarWriteBlobForDB!");
		return RET_CREATEROLE_DBFIELD_NOENOUGH_LEN;
	}
	]]
	
	return outstr
end

--通过名称获得指定的数据库定义表
function get_db_by_name(dbtb, name)
	for k, v in ipairs(dbtb) do
		if v.name == name then
			return v
		end
	end
	return nil
end

--通过绑定Db表名称称获得指定的结构表
function get_struct_by_binddb_name(tb, name)
	for k, v in ipairs(tb.struct) do
		if v.binddb == name then
			return v
		end
	end
	return nil
end

--获得db的格式
function get_db_field_format(dbitem, structs)
	for k, v in ipairs(structs.item) do
		if v.dbfield == dbitem.field then
			local t = typedef_table[v.type]
			if t ~= nil then
				return t.fmt
			else
				return '\\"%s\\"'
			end
			break
		end
	end
	
	if dbitem.default_fill ~= nil then
		if dbitem.default_fill.flag == 'const' then
			return dbitem.default_fill.fmt
		elseif dbitem.default_fill.flag == 'var' then
			return dbitem.default_fill.fmt
		end
	end
	return '\\"\\"'
end

function get_structfield_by_dbfieldname(dbitem, structs)
	for k, v in ipairs(structs.item) do
		if v.dbfield == dbitem.field then
			return v
		end
	end
	return nil
end

--通过db的字段获得结构中对应的字段
function get_struct_field_by_dbfield(fieldid, structs)
	for k, v in ipairs(structs.item) do
		if v.dbfield == fieldid then
			return v
		end
	end
	return nil
end

--通过db的字段获得结构中对应的字段的实际值
function get_db_field_value(fieldid, structs)
	for k, v in ipairs(structs.item) do
		if v.dbfield == fieldid then
			return v
		end
	end
	return nil
end

function is_exist_in_dbfield(rdb, fieldname)
	for _, r in ipairs(rdb) do
		if r.field == fieldname then
			return true
		end
	end	
	return false
end

function output_getvar_fromdb(outstr, tb, dbtb, dbtablename, vardef, funname)
	local rdb = get_db_by_name(dbtb, dbtablename)
	local rstruct = get_struct_by_binddb_name(tb, dbtablename)
	if rdb ~= nil and rstruct ~= nil then
		-----------------------------------
		--从db中读出role的信息
		outstr = outstr..'\n\tinline int '..funname..'(IO::IDatabase* lpIDB, '..vardef..' lpDBVar)\n\t{\n'
		outstr = outstr..'\t\tint iRet = 0;\n'
		outstr = outstr..'\t\tint iFieldLen = 0;\n'
		outstr = outstr..'\t\tchar* lpszFieldVar = NULL;\n'
		for i, item in ipairs(rstruct.item) do
			local type = item.type
			local itemname = get_structfieldname_by_item(item)
			if item.dbfield == nil then
			elseif not is_exist_in_dbfield(rdb, item.dbfield) then
				print('*error: <'..rstruct.name..'.'..item.name..'> bind db field name: ['..item.dbfield..'] is not exist in ['..dbtablename..']')
			else
				outstr = outstr..'\t\tlpszFieldVar = lpIDB->GetField("'..item.dbfield..'", &iFieldLen);\n'
				if typedef_table[type] ~= nil then
					if type == 'string' then
						outstr = outstr..'\t\tSafeStrCpy(lpDBVar->'..itemname..', lpszFieldVar, sizeof(lpDBVar->'..itemname..'));\n'
					else
						if typedef_table[type].str_to_val == nil then
							error('can not find str to val fun :'..itemname )
						else
							outstr = outstr..'\t\tlpDBVar->'..itemname..'='..typedef_table[type].str_to_val..'(lpszFieldVar);\n'
						end
					end
				else
					outstr = outstr..'\t\tiRet = VarReadBlobFromDB(lpszFieldVar, iFieldLen, &lpDBVar->'..itemname..');\n'
					outstr = outstr..'\t\tif ( iRet < 0 )\n'
					outstr = outstr..'\t\t{\n'
					outstr = outstr..'\t\t\tLOG("COM", "***roleid=%I64d, rolename=%s iRet=%d decode '..itemname..' from db failed!", \n'
					outstr = outstr..'\t\t\t\tlpDBVar->ullRoleId, lpDBVar->szRName, iRet);\n'
					outstr = outstr..'\t\t\treturn iRet;\n'
					outstr = outstr..'\t\t}\n'
				end
			end
		end
		outstr = outstr..'\t\treturn iRet;\n'
		outstr = outstr..'\t}\n'	
	end
	return outstr
end

function output_convertvar_toblob(outstr, tb, dbtb, dbtablename, vardef, funname)
	local rdb = get_db_by_name(dbtb, dbtablename)
	local rstruct = get_struct_by_binddb_name(tb, dbtablename)
	if rdb ~= nil and rstruct ~= nil then
		-----------------------------------
		--将一个结构的所有字段转换成blob
		outstr = outstr..'\n\tinline int '..funname..'(IO::IDatabase* lpIDB, char* lpszSql, int iSqlBufLen, '..vardef..' lpDBVar, std::vector<char*>& vctBlobs)\n'
		outstr = outstr..'\t{\n'
		
		
		outstr = outstr..'\t\tint iRet = 0;\n'
		outstr = outstr..'\t\tint iPos = 0;\n'
		outstr = outstr..'\t\tchar* lpszBlobBuf = NULL;\n'
		outstr = outstr..'\t\tconst int c_max_buf_len = 204800;\n'
		
		local hasBlob  = false
		for k, v in ipairs(rdb) do
			if v.attr == 'BLOB' then
				local item = get_struct_field_by_dbfield(v.field, rstruct)
				if item ~= nil then
					local type = item.type
					local itemname = get_structfieldname_by_item(item)
					if item.dbfield ~= nil then
						outstr = outstr..'\t\tif ( (int)vctBlobs.size() <= iPos )\n'
						outstr = outstr..'\t\t{\n'
						outstr = outstr..'\t\tlpszBlobBuf = new char[c_max_buf_len];\n'
						outstr = outstr..'\t\tvctBlobs.push_back(lpszBlobBuf);\n'
						outstr = outstr..'\t\t}\n'
						outstr = outstr..'\t\telse\n'
						outstr = outstr..'\t\t{\n'
						outstr = outstr..'\t\tlpszBlobBuf = vctBlobs[iPos];\n'
						outstr = outstr..'\t\t}\n'
						outstr = outstr..'\t\tiRet = VarWriteBlobForDB(lpIDB, lpszSql, iSqlBufLen, lpszBlobBuf, c_max_buf_len, &lpDBVar->'..itemname..');\n'
						outstr = outstr..'\t\tif ( iRet < 0 )\n'
						outstr = outstr..'\t\t{\n'
						outstr = outstr..'\t\t	return iRet;\n'
						outstr = outstr..'\t\t}\n'
						outstr = outstr..'\t\t++iPos;\n\n'
						
						hasBlob = true
					end				
				end
			end
		end
		
		if hasBlob then
			outstr = outstr..'\t\treturn iRet;\n'
		else
			outstr = outstr..'\t\treturn iRet+iPos+c_max_buf_len+(long)lpszBlobBuf;\n'
		end
		outstr = outstr..'\t}\n'	
	end
	return outstr	
end

function output_insertvar_todb(outstr, tb, dbtb, dbtablename, vardef, funname)
	local rdb = get_db_by_name(dbtb, dbtablename)
	local rstruct = get_struct_by_binddb_name(tb, dbtablename)
	if rdb ~= nil and rstruct ~= nil then
		-----------------------------------
		--向数据库中插入一条role的记录
		outstr = outstr..'\n\tinline int '..funname..'(IO::IDatabase* lpIDB, char* lpszSql, int iSqlBufLen, '..vardef..' lpDBVar, std::vector<char*>& vctBlobs)\n'
		outstr = outstr..'\t{\n'
		outstr = outstr..'\t\tint iRet = 0;\n'
		outstr = outstr..'\t\tSafeSprintf(lpszSql, iSqlBufLen, "insert into roles ("\n\t\t\t"'
		--输出所有字段定义
		local isstarted = false
		for k, v in ipairs(rdb) do
			if not isstarted then
				isstarted = true
			else
				outstr = outstr..', '
			end
			outstr = outstr..v.field
		end
		outstr = outstr..') values ("\n\t\t\t"'
		--输出所有字段的格式字符串
		isstarted = false
		for k, v in ipairs(rdb) do
			if not isstarted then
				isstarted = true
			else
				outstr = outstr..', '
			end
			outstr = outstr..get_db_field_format(v, rstruct)
		end
		outstr = outstr..');",\n\t\t\t'
		outstr = outstr..'\t\t\t'
		--输出所有字段的实际值
		isstarted = false
		local pos = 0
		for k, v in ipairs(rdb) do
			local val = nil
			if v.attr == 'BLOB' then
				val = 'vctBlobs['.. pos..']'
				pos = pos + 1
			else
				local it = get_db_field_value(v.field, rstruct)
				if it ~= nil then
					local t = typedef_table[it.type]
					if t ~= nil then
						if t.type_cast ~= nil then
							val = '('..t.type_cast..')(lpDBVar->'..get_structfieldname_by_item(it)..')'
						else
							val = 'lpDBVar->'..get_structfieldname_by_item(it)
						end
					else
						error('happen error')
					end
				else
					if v.default_fill ~= nil then
						if v.default_fill.flag == 'var' then
							val = v.default_fill.val
						end
					end
				end
			end
			if val ~= nil then
				if isstarted then
					outstr = outstr..', '
				else
					isstarted = true
				end
				outstr = outstr..val
			end
		end
		outstr = outstr..');\n'
		outstr = outstr..'\t\tif ( lpIDB->Query(lpszSql, strlen(lpszSql)) )\n'
		outstr = outstr..'\t\t{\n'
		outstr = outstr..'\t\t\tiRet = 0;\n'
		outstr = outstr..'\t\t}\n'
		outstr = outstr..'\t\telse\n'
		outstr = outstr..'\t\t{\n'
		--outstr = outstr..'\t\t\tLOG("COM", "user[%d] create role in db failed! the error: %s", lpDBVar->szUName, lpIDB->GetLastErrorStr());\n'
		outstr = outstr..'\t\t\tiRet = -4;\n'
		outstr = outstr..'\t\t}\n'
		outstr = outstr..'\t\treturn iRet;\n'
		outstr = outstr..'\t}\n'	
	end
	return outstr	
end

UpdateFunCreater = {
	funtempl = [[
	
	inline int $<funname>(IO::IDatabase* lpIDB, char* lpszSql, int iSqlBufLen, $<vardef> lpDBVar, std::vector<char*>& vctBlobs) {
		int iRet = 0;
		SafeSprintf(lpszSql, iSqlBufLen, "UPDATE $<tablename> SET $<setlist> WHERE $<bykey>;"
			$<tablevallist>$<setvallist>$<bykeyval>);
		if ( lpIDB->Query(lpszSql, strlen(lpszSql)) ) {
			iRet = 0;
		} else {
			iRet = -4;
		}
		return iRet;
	} 
	]],
	
	output = function(self,structs, dbtables, dbtablename, vardef, funname) 
		local dbtable = get_db_by_name(dbtables, dbtablename)
		local rstruct = get_struct_by_binddb_name(structs, dbtablename)
		if (dbtable == nil) or (rstruct == nil) then 
			return 
		end
		
		local pos = 0
		self.vardef = vardef
		self.setlist = ''
		self.bykey = ''
		self.setvallist = ''
		self.bykeyval = ''
		for _, dbfield in ipairs(dbtable) do
			local structfield = get_structfield_by_dbfieldname(dbfield, rstruct)
			if structfield == nil then
			elseif structfield.dbupd == 'key' then
				self.bykey = dbfield.field..'='..get_db_field_format(dbfield, rstruct)
				self.bykeyval = ','..self:getFieldVal(rstruct, dbfield, pos)
			elseif structfield.dbupd == 'val' then
				self.setlist = self.setlist..','..dbfield.field..'='..get_db_field_format(dbfield, rstruct)
				self.setvallist = self.setvallist..','..self:getFieldVal(rstruct, dbfield, pos)
			end
			
			if (structfield ~= nil) and (dbfield.attr == 'BLOB') then 
				pos = pos + 1 
			end
		end

		self:cutSetListFirstComma()
		self:createTableValList(dbtable)
		return self:replaceTempl(funname, dbtable)
	end,
	
	cutSetListFirstComma = function(self)
		self.setlist = string.sub(self.setlist, 2, -1)
	end,
	
	createTableValList = function(self, dbtable)
		self.tablevallist = ''
		if string.find(dbtable.table_name, '$<zoneid>') ~= nil then
			self.tablevallist = self.tablevallist..',usZoneId'
		end
		if string.find(dbtable.table_name, '$<tableid>') ~= nil then
			self.tablevallist = self.tablevallist..',iTableIdx'
		end
	end,
	
	replaceTempl = function(self, funname, dbtable)
		local s = string.gsub(self.funtempl, '$<funname>', funname)
		s = string.gsub(s, '$<vardef>', self.vardef)
		
		s = string.gsub(s, '$<tablename>', dbtable.table_name)
		s = string.gsub(s, '$<zoneid>', '%%03d')
		s = string.gsub(s, '$<tableid>', '%%d')
		
		self.setlist = string.gsub(self.setlist, '%%', '%%%%')
		self.bykey = string.gsub(self.bykey, '%%', '%%%%')
		s = string.gsub(s, '$<setlist>', self.setlist)
		s = string.gsub(s, '$<bykey>', self.bykey)
		
		s = string.gsub(s, '$<tablevallist>', self.tablevallist)
		s = string.gsub(s, '$<setvallist>', self.setvallist)
		s = string.gsub(s, '$<bykeyval>', self.bykeyval)
		
		return s
	end,
	
	getFieldVal = function(self, rstruct, dbfield, blob_pos)
		if dbfield.attr == 'BLOB' then
			return 'vctBlobs['.. blob_pos..']'
		end
		
		local it = get_db_field_value(dbfield.field, rstruct)
		if (it == nil) then 
			if (dbfield.default_fill ~= nil) and (dbfield.default_fill.flag == 'var') then
				return dbfield.default_fill.val
			end
			error('error happen')
		end
		
		local t = typedef_table[it.type]
		if t == nil then error('error happen') end
		if t.type_cast ~= nil then
			return '('..t.type_cast..')(lpDBVar->'..get_structfieldname_by_item(it)..')'
		else
			return 'lpDBVar->'..get_structfieldname_by_item(it)
		end
		error('error happen')
	end,
}

function output_common_fun(outstr, tb, dbtb, dbtablename, vardef, funname)
	outstr = output_getvar_fromdb(outstr, tb, dbtb, dbtablename, vardef, funname.getvar)
	outstr = output_convertvar_toblob(outstr, tb, dbtb, dbtablename, vardef, funname.convertvar)
	outstr = output_insertvar_todb(outstr, tb, dbtb, dbtablename, vardef, funname.insertvar)
	outstr = outstr..UpdateFunCreater:output(tb, dbtb, dbtablename, vardef, funname.updatevar)
	return outstr
end

--一些常量字符串的输出
function output_const_str_define(outstr, tb, dbtb)
	outstr = outstr..'\n'
	for k, v in ipairs(tb.const_str) do
		outstr = outstr..'\tstatic const char* '..v.name..' = "'..v.str..'";\n'
	end
	return outstr
end

--输出db的定义
function output_db_define(ofile, tb, dbtb)
	local outstr = '#ifndef _TQ_DB_ASSIST_H_\n'
	outstr = outstr..'#define _TQ_DB_ASSIST_H_\n'
	outstr = outstr..'#include <result.h>\n\n'
	outstr = output_db_assist(outstr)
	
	for i, d in ipairs(tb.outfun) do
		outstr = output_common_fun(outstr, tb, dbtb, d.dbtablename, d.vardef, d.funname )
	end
	
	--outstr = output_db_role_fun(outstr, tb, dbtb)
	outstr = output_const_str_define(outstr, tb, dbtb)
	outstr = outstr..'\n'
	outstr = outstr..'#endif // _TQ_DB_ASSIST_H_\n'
	ofile:write(outstr)
end

--输出h头文件
function output_h(tb, dbtb)
	local ofile = assert(io.open(tb.output_file, "w"))
	output_begin_h(ofile, tb)
	output_const_h(ofile, tb)
	output_struct_h(ofile, tb)
	output_end_h(ofile, tb)
	ofile:close()
	print('create '..tb.output_file..' ok!')
	
	ofile = assert(io.open(tb.output_db_file, "w"))
	output_db_define(ofile, tb, dbtb)
	ofile:close()
	print('create '..tb.output_db_file..' ok!')
end


--独立运行
if package.loaded['lua_tool.tools_h'] == nil then
	print('***不能独立运行！')
end
