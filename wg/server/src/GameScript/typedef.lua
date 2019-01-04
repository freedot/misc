_basic['int64'] = 'number'
_basic['object_id'] = 'number'
_basic['uint64'] = 'number'

--array.lua
-- Write binding functions
function classArray:supcode ()
	local class = self:inclass()
	-- get function ------------------------------------------------
	if class then
		output("/* get function:",self.name," of class ",class," */")
	else
		output("/* get function:",self.name," */")
	end
	self.cgetname = self:cfuncname("tolua_get")
	output("#ifndef TOLUA_DISABLE_"..self.cgetname)
	output("\nstatic int",self.cgetname,"(lua_State* tolua_S)")
	output("{")
	output(" int tolua_index;")

	-- declare self, if the case
	local _,_,static = strfind(self.mod,'^%s*(static)')
	if class and static==nil then
		output(' ',self.parent.type,'*','self;')
		output(' lua_pushstring(tolua_S,".self");')
		output(' lua_rawget(tolua_S,1);')
		output(' self = ')
		output('(',self.parent.type,'*) ')
		output('lua_touserdata(tolua_S,-1);')
	elseif static then
		_,_,self.mod = strfind(self.mod,'^%s*static%s%s*(.*)')
	end

	-- check index
	output('#ifndef TOLUA_RELEASE\n')
	output(' {')
	output('  tolua_Error tolua_err;')
	output('  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))')
	output('   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);')
	output(' }')
	output('#endif\n')
	if flags['1'] then -- for compatibility with tolua5 ?
		output(' tolua_index = (int)tolua_tonumber(tolua_S,2,0)-1;')
	else
		output(' tolua_index = (int)tolua_tonumber(tolua_S,2,0);')
	end
	output('#ifndef TOLUA_RELEASE\n')
	if self.dim and self.dim ~= '' then
		output(' if (tolua_index<0 || tolua_index>='..self.dim..')')
	else
		output(' if (tolua_index<0)')
	end
	output('  tolua_error(tolua_S,"array indexing out of range.",NULL);')
	output('#endif\n')
	
	-- return value
	local t,ct = isbasic(self.type)
	local push_func = get_push_function(t)
	if t then
		if self.type == 'uint64' then --added by qjb
			output(' tolua_push'..t..'(tolua_S,(',ct,')(int64)'..self:getvalue(class,static)..');')
		else
			output(' tolua_push'..t..'(tolua_S,(',ct,')'..self:getvalue(class,static)..');')
		end
	else
		t = self.type
		if self.ptr == '&' or self.ptr == '' then
			output(' ',push_func,'(tolua_S,(void*)&'..self:getvalue(class,static)..',"',t,'");')
		else
			output(' ',push_func,'(tolua_S,(void*)'..self:getvalue(class,static)..',"',t,'");')
		end
	end
	output(' return 1;')
	output('}')
	output('#endif //#ifndef TOLUA_DISABLE\n')
	output('\n')

	-- set function ------------------------------------------------
	if not strfind(self.type,'const') then
	if class then
		output("/* set function:",self.name," of class ",class," */")
	else
		output("/* set function:",self.name," */")
	end
	self.csetname = self:cfuncname("tolua_set")
	output("#ifndef TOLUA_DISABLE_"..self.csetname)
	output("\nstatic int",self.csetname,"(lua_State* tolua_S)")
	output("{")

	-- declare index
	output(' int tolua_index;')

	-- declare self, if the case
	local _,_,static = strfind(self.mod,'^%s*(static)')
	if class and static==nil then
		output(' ',self.parent.type,'*','self;')
		output(' lua_pushstring(tolua_S,".self");')
		output(' lua_rawget(tolua_S,1);')
		output(' self = ')
		output('(',self.parent.type,'*) ')
		output('lua_touserdata(tolua_S,-1);')
	elseif static then
		_,_,self.mod = strfind(self.mod,'^%s*static%s%s*(.*)')
	end

	-- check index
	output('#ifndef TOLUA_RELEASE\n')
	output(' {')
	output('  tolua_Error tolua_err;')
	output('  if (!tolua_isnumber(tolua_S,2,0,&tolua_err))')
	output('   tolua_error(tolua_S,"#vinvalid type in array indexing.",&tolua_err);')
	output(' }')
	output('#endif\n')
	
	if flags['1'] then -- for compatibility with tolua5 ?
	output(' tolua_index = (int)tolua_tonumber(tolua_S,2,0)-1;')
	else
	output(' tolua_index = (int)tolua_tonumber(tolua_S,2,0);')
	end
	
	output('#ifndef TOLUA_RELEASE\n')
	if self.dim and self.dim ~= '' then
	output(' if (tolua_index<0 || tolua_index>='..self.dim..')')
	else
	output(' if (tolua_index<0)')
	end
	output('  tolua_error(tolua_S,"array indexing out of range.",NULL);')
	output('#endif\n')

	-- assign value
	local ptr = ''
	if self.ptr~='' then ptr = '*' end
	output(' ')
	if class and static then
	output(class..'::'..self.name..'[tolua_index]')
	elseif class then
	output('self->'..self.name..'[tolua_index]')
	else
	output(self.name..'[tolua_index]')
	end
	local t = isbasic(self.type)
	output(' = ')
	if not t and ptr=='' then output('*') end
	output('((',self.mod,self.type)
	if not t then
	output('*')
	end
	output(') ')
	local def = 0
	if self.def ~= '' then def = self.def end
	if t then
	output('tolua_to'..t,'(tolua_S,3,',def,'));')
	else
	local to_func = get_to_function(self.type)
	output(to_func,'(tolua_S,3,',def,'));')
	end
	output(' return 0;')
	output('}')
	output('#endif //#ifndef TOLUA_DISABLE\n')
	output('\n')
	end
end

--declaration.lua
-- Return parameter value
function classDeclaration:retvalue ()
 if self.ret ~= '' then
  local t,ct = isbasic(self.type)
  if t and t~='' then
   if self.type == 'uint64' then --added by qjb
     output('   tolua_push'..t..'(tolua_S,(',ct,')(int64)'..self.name..');')
   else
     output('   tolua_push'..t..'(tolua_S,(',ct,')'..self.name..');')
   end
  else
   local push_func = get_push_function(self.type)
   output('   ',push_func,'(tolua_S,(void*)'..self.name..',"',self.type,'");')
  end
  return 1
 end
 return 0
end


--function.lua
-- Write binding function
-- Outputs C/C++ binding function.
function classFunction:supcode (local_constructor)

 local overload = strsub(self.cname,-2,-1) - 1  -- indicate overloaded func
 local nret = 0      -- number of returned values
 local class = self:inclass()
 local _,_,static = strfind(self.mod,'^%s*(static)')
 if class then

 	if self.name == 'new' and self.parent.flags.pure_virtual then
 		-- no constructor for classes with pure virtual methods
 		return
 	end

 	if local_constructor then
		output("/* method: new_local of class ",class," */")
	else
		output("/* method:",self.name," of class ",class," */")
	end
 else
  output("/* function:",self.name," */")
 end

 if local_constructor then
  output("#ifndef TOLUA_DISABLE_"..self.cname.."_local")
  output("\nstatic int",self.cname.."_local","(lua_State* tolua_S)")
 else
  output("#ifndef TOLUA_DISABLE_"..self.cname)
  output("\nstatic int",self.cname,"(lua_State* tolua_S)")
 end
 output("{")

 -- check types
	if overload < 0 then
	 output('#ifndef TOLUA_RELEASE\n')
	end
	output(' tolua_Error tolua_err;')
 output(' if (\n')
 -- check self
 local narg
 if class then narg=2 else narg=1 end
 if class then
		local func = get_is_function(self.parent.type)
		local type = self.parent.type
		if self.name=='new' or static~=nil then
			func = 'tolua_isusertable'
			type = self.parent.type
		end
		if self.const ~= '' then
			type = "const "..type
		end
		output('     !'..func..'(tolua_S,1,"'..type..'",0,&tolua_err) ||\n')
 end
 -- check args
 if self.args[1].type ~= 'void' then
  local i=1
  while self.args[i] do
   local btype = isbasic(self.args[i].type)
   if btype ~= 'value' and btype ~= 'state' then
    output('     '..self.args[i]:outchecktype(narg)..' ||\n')
   end
   if btype ~= 'state' then
	   narg = narg+1
   end
   i = i+1
  end
 end
 -- check end of list
 output('     !tolua_isnoobj(tolua_S,'..narg..',&tolua_err)\n )')
	output('  goto tolua_lerror;')

 output(' else\n')
	if overload < 0 then
	 output('#endif\n')
	end
	output(' {')

 -- declare self, if the case
 local narg
 if class then narg=2 else narg=1 end
 if class and self.name~='new' and static==nil then
  output(' ',self.const,self.parent.type,'*','self = ')
  output('(',self.const,self.parent.type,'*) ')
  local to_func = get_to_function(self.parent.type)
  output(to_func,'(tolua_S,1,0);')
 elseif static then
  _,_,self.mod = strfind(self.mod,'^%s*static%s%s*(.*)')
 end
 -- declare parameters
 if self.args[1].type ~= 'void' then
  local i=1
  while self.args[i] do
   self.args[i]:declare(narg)
   if isbasic(self.args[i].type) ~= "state" then
	   narg = narg+1
   end
   i = i+1
  end
 end

 -- check self
 if class and self.name~='new' and static==nil then
	 output('#ifndef TOLUA_RELEASE\n')
	 output('  if (!self) tolua_error(tolua_S,"'..output_error_hook("invalid \'self\' in function \'%s\'", self.name)..'", NULL);');
	 output('#endif\n')
 end

 -- get array element values
 if class then narg=2 else narg=1 end
 if self.args[1].type ~= 'void' then
  local i=1
  while self.args[i] do
   self.args[i]:getarray(narg)
   narg = narg+1
   i = i+1
  end
 end

 pre_call_hook(self)

 local out = string.find(self.mod, "tolua_outside")
 -- call function
 if class and self.name=='delete' then
  output('  Mtolua_delete(self);')
 elseif class and self.name == 'operator&[]' then
  if flags['1'] then -- for compatibility with tolua5 ?
	output('  self->operator[](',self.args[1].name,'-1) = ',self.args[2].name,';')
  else
    output('  self->operator[](',self.args[1].name,') = ',self.args[2].name,';')
  end
 else
  output('  {')
  if self.type ~= '' and self.type ~= 'void' then
   output('  ',self.mod,self.type,self.ptr,'tolua_ret = ')
   output('(',self.mod,self.type,self.ptr,') ')
  else
   output('  ')
  end
  if class and self.name=='new' then
   output('Mtolua_new((',self.type,')(')
  elseif class and static then
	if out then
		output(self.name,'(')
	else
		output(class..'::'..self.name,'(')
	end
  elseif class then
	if out then
		output(self.name,'(')
	else
	  if self.cast_operator then
	  	--output('static_cast<',self.mod,self.type,self.ptr,' >(*self')
		output('self->operator ',self.mod,self.type,'(')
	  else
		output('self->'..self.name,'(')
	  end
	end
  else
   output(self.name,'(')
  end

  if out and not static then
  	output('self')
	if self.args[1] and self.args[1].name ~= '' then
		output(',')
	end
  end
  -- write parameters
  local i=1
  while self.args[i] do
   self.args[i]:passpar()
   i = i+1
   if self.args[i] then
    output(',')
   end
  end

  if class and self.name == 'operator[]' and flags['1'] then
	output('-1);')
  else
	if class and self.name=='new' then
		output('));') -- close Mtolua_new(
	else
		output(');')
	end
  end

  -- return values
  if self.type ~= '' and self.type ~= 'void' then
   nret = nret + 1
   local t,ct = isbasic(self.type)
   if t and self.name ~= "new" then
   	if self.cast_operator and _basic_raw_push[t] then
		output('   ',_basic_raw_push[t],'(tolua_S,(',ct,')tolua_ret);')
   	else
		if self.type == 'uint64' then --added by qjb
			output('   tolua_push'..t..'(tolua_S,(',ct,')(int64)tolua_ret);')
		else
			output('   tolua_push'..t..'(tolua_S,(',ct,')tolua_ret);')
		end
	end
   else
	t = self.type
	new_t = string.gsub(t, "const%s+", "")
	local owned = false
	if string.find(self.mod, "tolua_owned") then
		owned = true
	end
    local push_func = get_push_function(t)
    if self.ptr == '' then
     output('   {')
     output('#ifdef __cplusplus\n')
     output('    void* tolua_obj = Mtolua_new((',new_t,')(tolua_ret));')
     output('    ',push_func,'(tolua_S,tolua_obj,"',t,'");')
     output('    tolua_register_gc(tolua_S,lua_gettop(tolua_S));')
     output('#else\n')
     output('    void* tolua_obj = tolua_copy(tolua_S,(void*)&tolua_ret,sizeof(',t,'));')
     output('    ',push_func,'(tolua_S,tolua_obj,"',t,'");')
     output('    tolua_register_gc(tolua_S,lua_gettop(tolua_S));')
     output('#endif\n')
     output('   }')
    elseif self.ptr == '&' then
     output('   ',push_func,'(tolua_S,(void*)&tolua_ret,"',t,'");')
    else
	 output('   ',push_func,'(tolua_S,(void*)tolua_ret,"',t,'");')
	 if owned or local_constructor then
      output('    tolua_register_gc(tolua_S,lua_gettop(tolua_S));')
	 end
    end
   end
  end
  local i=1
  while self.args[i] do
   nret = nret + self.args[i]:retvalue()
   i = i+1
  end
  output('  }')

  -- set array element values
  if class then narg=2 else narg=1 end
  if self.args[1].type ~= 'void' then
   local i=1
   while self.args[i] do
    self.args[i]:setarray(narg)
    narg = narg+1
    i = i+1
   end
  end

  -- free dynamically allocated array
  if self.args[1].type ~= 'void' then
   local i=1
   while self.args[i] do
    self.args[i]:freearray()
    i = i+1
   end
  end
 end

 post_call_hook(self)

 output(' }')
 output(' return '..nret..';')

 -- call overloaded function or generate error
	if overload < 0 then

		output('#ifndef TOLUA_RELEASE\n')
		output('tolua_lerror:\n')
		output(' tolua_error(tolua_S,"'..output_error_hook("#ferror in function \'%s\'.", self.lname)..'",&tolua_err);')
		output(' return 0;')
		output('#endif\n')
	else
		local _local = ""
		if local_constructor then
			_local = "_local"
		end
		output('tolua_lerror:\n')
		output(' return '..strsub(self.cname,1,-3)..format("%02d",overload).._local..'(tolua_S);')
	end
 output('}')
 output('#endif //#ifndef TOLUA_DISABLE\n')
 output('\n')

	-- recursive call to write local constructor
	if class and self.name=='new' and not local_constructor then

		self:supcode(1)
	end

end

--operator.lua
function classOperator:supcode_tmp()

	if not _TM[self.kind] then
		return classFunction.supcode(self)
	end

	-- no overload, no parameters, always inclass
	output("/* method:",self.name," of class ",self:inclass()," */")

	output("#ifndef TOLUA_DISABLE_"..self.cname)
	output("\nstatic int",self.cname,"(lua_State* tolua_S)")

	if overload < 0 then
	 output('#ifndef TOLUA_RELEASE\n')
	end
	output(' tolua_Error tolua_err;')
	output(' if (\n')
	-- check self
	local is_func = get_is_function(self.parent.type)
	output('     !'..is_func..'(tolua_S,1,"'..self.parent.type..'",0,&tolua_err) ||\n')
	output('     !tolua_isnoobj(tolua_S,2,&tolua_err)\n )')
	output('  goto tolua_lerror;')

	output(' else\n')
	output('#endif\n') -- tolua_release
	output(' {')

	-- declare self
	output(' ',self.const,self.parent.type,'*','self = ')
	output('(',self.const,self.parent.type,'*) ')
	local to_func = get_to_func(self.parent.type)
	output(to_func,'(tolua_S,1,0);')

	-- check self
	output('#ifndef TOLUA_RELEASE\n')
	output('  if (!self) tolua_error(tolua_S,"'..output_error_hook("invalid \'self\' in function \'%s\'", self.name)..'",NULL);');
	output('#endif\n')

	-- cast self
	output('  ',self.mod,self.type,self.ptr,'tolua_ret = ')
	output('(',self.mod,self.type,self.ptr,')(*self);')

	-- return value
	local t,ct = isbasic(self.type)
	if t then
		if self.type == 'uint64' then --added by qjb
			output('   tolua_push'..t..'(tolua_S,(',ct,')(int64)tolua_ret);')
		else
			output('   tolua_push'..t..'(tolua_S,(',ct,')tolua_ret);')
		end
	else
		t = self.type
		local push_func = get_push_function(t)
		new_t = string.gsub(t, "const%s+", "")
		if self.ptr == '' then
			output('   {')
			output('#ifdef __cplusplus\n')
			output('    void* tolua_obj = Mtolua_new((',new_t,')(tolua_ret));')
			output('    ',push_func,'(tolua_S,tolua_obj,"',t,'");')
			output('    tolua_register_gc(tolua_S,lua_gettop(tolua_S));')
			output('#else\n')
			output('    void* tolua_obj = tolua_copy(tolua_S,(void*)&tolua_ret,sizeof(',t,'));')
			output('    ',push_func,'(tolua_S,tolua_obj,"',t,'");')
			output('    tolua_register_gc(tolua_S,lua_gettop(tolua_S));')
			output('#endif\n')
			output('   }')
		elseif self.ptr == '&' then
			output('   ',push_func,'(tolua_S,(void*)&tolua_ret,"',t,'");')
		else
			if local_constructor then
				output('   ',push_func,'(tolua_S,(void *)tolua_ret,"',t,'");')
				output('    tolua_register_gc(tolua_S,lua_gettop(tolua_S));')
			else
				output('   ',push_func,'(tolua_S,(void*)tolua_ret,"',t,'");')
			end
		end
	end

	output('  }')
	output(' return 1;')

	output('#ifndef TOLUA_RELEASE\n')
	output('tolua_lerror:\n')
	output(' tolua_error(tolua_S,"'..output_error_hook("#ferror in function \'%s\'.", self.lname)..'",&tolua_err);')
	output(' return 0;')
	output('#endif\n')


	output('}')
	output('#endif //#ifndef TOLUA_DISABLE\n')
	output('\n')
end

function outmychecktype(self, narg)
	if self.type == 'char*' then
		return '!tolua_isstring(tolua_S,'..narg..',0,&tolua_err)'
	else 
		return self:outchecktype(narg)
	end
end

--variable.lua
function classVariable:supcode ()

 local class = self:inclass()

	local prop_get,prop_set
	if string.find(self.mod, 'tolua_property') then

		local _,_,type = string.find(self.mod, "tolua_property__([^%s]*)")
		type = type or "default"
		prop_get,prop_set = get_property_methods(type, self.name)
		self.mod = string.gsub(self.mod, "tolua_property[^%s]*", "")
	end

 -- get function ------------------------------------------------
 if class then
  output("/* get function:",self.name," of class ",class," */")
 else
  output("/* get function:",self.name," */")
 end
 self.cgetname = self:cfuncname("tolua_get")
 output("#ifndef TOLUA_DISABLE_"..self.cgetname)
 output("\nstatic int",self.cgetname,"(lua_State* tolua_S)")
 output("{")

 -- declare self, if the case
 local _,_,static = strfind(self.mod,'^%s*(static)')
 if class and static==nil then
  output(' ',self.parent.type,'*','self = ')
  output('(',self.parent.type,'*) ')
  local to_func = get_to_function(self.parent.type)
  output(to_func,'(tolua_S,1,0);')
 elseif static then
  _,_,self.mod = strfind(self.mod,'^%s*static%s%s*(.*)')
 end


 -- check self value
 if class and static==nil then
	 output('#ifndef TOLUA_RELEASE\n')
  output('  if (!self) tolua_error(tolua_S,"'..output_error_hook("invalid \'self\' in accessing variable \'%s\'", self.name)..'",NULL);');
		output('#endif\n')
 end

 -- return value
 if string.find(self.mod, 'tolua_inherits') then
	local push_func = get_push_function(self.type)
 	output('#ifdef __cplusplus\n')
	output('  ',push_func,'(tolua_S,(void*)static_cast<'..self.type..'*>(self), "',self.type,'");')
	output('#else\n')
	output('  ',push_func,'(tolua_S,(void*)(('..self.type..'*)self), "',self.type,'");')
	output('#endif\n')
 else
	local t,ct = isbasic(self.type)
	if t then
		if self.type == 'uint64' then --added by qjb
			output('  tolua_push'..t..'(tolua_S,(',ct,')(int64)'..self:getvalue(class,static,prop_get)..');')
		else
			output('  tolua_push'..t..'(tolua_S,(',ct,')'..self:getvalue(class,static,prop_get)..');')
		end
	else
		local push_func = get_push_function(self.type)
		t = self.type
		if self.ptr == '&' or self.ptr == '' then
			output('  ',push_func,'(tolua_S,(void*)&'..self:getvalue(class,static,prop_get)..',"',t,'");')
		else
			output('  ',push_func,'(tolua_S,(void*)'..self:getvalue(class,static,prop_get)..',"',t,'");')
		end
	end
 end
 output(' return 1;')
 output('}')
 output('#endif //#ifndef TOLUA_DISABLE\n')
 output('\n')

 -- set function ------------------------------------------------
 if not (strfind(self.type,'const%s+') or string.find(self.mod, 'tolua_readonly') or string.find(self.mod, 'tolua_inherits'))  then
  if class then
   output("/* set function:",self.name," of class ",class," */")
  else
   output("/* set function:",self.name," */")
  end
  self.csetname = self:cfuncname("tolua_set")
  output("#ifndef TOLUA_DISABLE_"..self.csetname)
  output("\nstatic int",self.csetname,"(lua_State* tolua_S)")
  output("{")

  -- declare self, if the case
  if class and static==nil then
   output(' ',self.parent.type,'*','self = ')
   output('(',self.parent.type,'*) ')
   local to_func = get_to_function(self.parent.type)
   output(to_func,'(tolua_S,1,0);')
   -- check self value
		end
  -- check types
		output('#ifndef TOLUA_RELEASE\n')
		output('  tolua_Error tolua_err;')
  if class and static==nil then
   output('  if (!self) tolua_error(tolua_S,"'..output_error_hook("invalid \'self\' in accessing variable \'%s\'", self.name)..'",NULL);');
  elseif static then
   _,_,self.mod = strfind(self.mod,'^%s*static%s%s*(.*)')
  end

  -- check variable type
  --output('  if ('..self:outchecktype(2)..')')
  output('  if ('..outmychecktype(self,2)..')')
  output('   tolua_error(tolua_S,"#vinvalid type in variable assignment.",&tolua_err);')
		output('#endif\n')

  -- assign value
		local def = 0
		if self.def ~= '' then def = self.def end
		if self.type == 'char*' and self.dim ~= '' then -- is string
			output(' SafeStrCpy((char*)')
			if class and static then
				output(self.parent.type..'::'..self.name)
			elseif class then
				output('self->'..self.name)
			else
				output(self.name)
			end
			output(',(const char*)tolua_tostring(tolua_S,2,',def,'),',self.dim,');')
		else
			local ptr = ''
			if self.ptr~='' then ptr = '*' end
			output(' ')
			local name = prop_set or self.name
			if class and static then
				output(self.parent.type..'::'..name)
			elseif class then
				output('self->'..name)
			else
				output(name)
			end
			local t = isbasic(self.type)
			if prop_set then
				output('(')
			else
				output(' = ')
			end
			if not t and ptr=='' then output('*') end
			output('((',self.mod,self.type)
			if not t then
				output('*')
			end
			output(') ')
			if t then
				if isenum(self.type) then
					output('(int) ')
				end
				output('tolua_to'..t,'(tolua_S,2,',def,'))')
			else
				local to_func = get_to_function(self.type)
				output(to_func,'(tolua_S,2,',def,'))')
			end
			if prop_set then
				output(")")
			end
			output(";")
		end
  output(' return 0;')
  output('}')
  output('#endif //#ifndef TOLUA_DISABLE\n')
  output('\n')
 end

end
