--require("tqRequireEx")
--------------------------------------------
--Lua表 copy一个table表的功能函数
--没有实现function，cfunction，userdata的copy
--------------------------------------------
function TableCopy(destb, srctb)
	if srctb ~= nil and destb ~= nil then
		for k, v in pairs(srctb) do
			if k~= nil then
				if type(v) == 'table' then
					destb[k] = {}
					TableCopy(destb[k], v)
				elseif type(v) == 'function' then
					destb[k] = v
				else
					destb[k] = v
				end
			end
		end
	end
end 

--------------------------------------------
-- 格式化打印一个table
--------------------------------------------
___defuatmaxlevel___ = 10
___level___ = 0
___maxlevel___ = 10
function tqdb_print_table(tb)
  ___level___ = ___level___ + 1
  local strret = '{'
  for k, v in pairs(tb) do
	if type(v) == 'string' then
		strret = strret..k..'=\"'..v..'\",'
	elseif type(v) == 'function' then
		strret = strret..k..'='..'<function>'..','
	elseif type(v) == 'thread' then
		strret = strret..k..'='..'<thread>'..','
	elseif type(v) == 'userdata' then
		strret = strret..k..'='..'<userdata>'..','
	elseif type(v) == 'proto' then
		strret = strret..k..'='..'<proto>'..','
	elseif type(v) == 'upval' then
		strret = strret..k..'='..'<upval>'..','
	elseif type(v) == 'nil' then
		strret = strret..k..'='..'nil'..','
	elseif type(v) == 'boolean' then
		if v then
			strret = strret..k..'='..'true'..','
		else
			strret = strret..k..'='..'false'..','
		end
	elseif type(v) == 'table' then
		if ___level___ < ___maxlevel___ then
			strret = strret..k..'='..tqdb_print_table(v)..','
		end
	else
		strret = strret..k..'='..v..','
	end
  end
  strret = strret..'}'
  ___level___ = ___level___ - 1
  return strret
end


function PrintTable(b, maxlevel)
	local retstr = ''
	if b ~= nil and type(b) == 'table' then
		if maxlevel == nil then
			___maxlevel___ = ___defuatmaxlevel___
		else
			___maxlevel___ = maxlevel
		end
		
		if ___maxlevel___ <= 0 then
			___maxlevel___ = 1
		end
		
		if ___maxlevel___ > ___defuatmaxlevel___ then
			___maxlevel___ = ___defuatmaxlevel___
		end
		
		___level___ = 0
		print(tqdb_print_table(b))
	end
end

function PPrintTable(b, maxlevel)
	local retstr = ''
	if b ~= nil and type(b) == 'table' then
		if maxlevel == nil then
			___maxlevel___ = ___defuatmaxlevel___
		else
			___maxlevel___ = maxlevel
		end
		
		if ___maxlevel___ <= 0 then
			___maxlevel___ = 1
		end
		
		if ___maxlevel___ > ___defuatmaxlevel___ then
			___maxlevel___ = ___defuatmaxlevel___
		end
		
		___level___ = 0
		retstr = tqdb_print_table(b)
	end
	return retstr
end


--------------------------------------------
--Lua表 单继承的函数
--------------------------------------------
function Inherit(newClass, baseClass)
	baseClass = baseClass or {}
	newClass = newClass or {}
	newClass.newMeta = {}
	setmetatable(newClass, newClass.newMeta)
	newClass.newMeta.__index = baseClass
	newClass.__super = baseClass
	
	--------------------------------------------------------------------
	--newo从当前类继承
	if type(newClass['New']) ~= 'function' then
		newClass.New = function(self, newo)
			newo = newo or {}
			setmetatable(newo, self)
			self.__index = self
			self.__super = newo
			return newo
		end
	end
	
	--------------------------------------------------------------------
	--如果该脚本设计是可重入的：
	--有关函数地址的引用一定要重新设置，原因是重入后函数地址已经改变
	--而变量的初始化一定要使用ReloadInit函数
	if type(newClass['Init']) ~= 'function' then
		newClass.Init = function(self)
		end
	end
	
	--------------------------------------------------------------------
	--定义Clone函数
	if type(newClass['Clone']) ~= 'function' then
		newClass.Clone = function(self)
			local newOther = {}
			TableCopy(newOther, self)
			return newOther
		end
	end
	
	return newClass
end

--------------------------------------------
--Lua表 从c中继承
--------------------------------------------
function InheritFromC(newClass, innerClass)
	local basesuper = newClass
	local super = newClass.__super
	while super ~= nil do
		basesuper = super
		super = super.__super
	end
	basesuper = Inherit(basesuper, innerClass)
	tolua:inherit(basesuper, innerClass)
	return newClass
end

--------------------------------------------------------------------
--定义一个可重入的Lua表的开始
--@param newClass 将要被定义的新表
--@param baseClass 将要被继承的表,可以是nil或{}
--@return 返回新定义的Lua表 
function BeginReloadClass(newClass, baseClass)
	if newClass ~= nil then
		return newClass
	end
	newClass = Inherit(newClass, baseClass)
	return newClass
end;


--------------------------------------------------------------------
--在Init函数中初始化一个变量，替换 self.newObj = val
--@remark 该函数只能在Init函数中使用
--@param newObj 要被初始化的变量对象
--@param val 变量的值
function ReloadInit(newObj, val)
	if newObj == nil or type(val) == 'function' then 
		newObj = val 
	end;
	return newObj;
end;


--------------------------------------------------------------------
--在Init函数中初始化一个变量，替换 self.newObj = val
--@remark 该函数只能在Init函数中使用
--@param newObj 要被初始化的变量对象
--@param val 变量的值
function rinit(newObj, val)
	if newObj == nil or type(val) == 'function' then 
		newObj = val 
	end;
	return newObj;
end;



--------------------------------------------------------------------
--在Init函数中初始化一个常量，替换 self.newObj = val
--@remark 该函数只能在Init函数中使用
--@param newObj 要被初始化的常量对象
--@param val 常量的值
function ConstInit(newObj, val)
	newObj = val
end;


--------------------------------------------------------------------
--在Init函数中初始化一个常量，替换 self.newObj = val
--@remark 该函数只能在Init函数中使用
--@param newObj 要被初始化的常量对象
--@param val 常量的值
function cinit(newObj, val)
	newObj = val
end;


--------------------------------------------------------------------
--初始化一个对象
--@obj 将要被初始化的对象
function InitObj(obj)
	if obj ~= nil and type(obj['Init']) == 'function' then
		local initArray = {}
		table.insert(initArray, obj)
		local super = obj.__super
		while super ~= nil do
			table.insert(initArray, super)
			super = super.__super
		end
		
		--从基类向下依次初始化
		local count = table.getn(initArray)
		for i=count, 1, -1 do
			local o = initArray[i]
			if o.Init ~= nil then
				o:Init()
			end
		end
	end;
end

--------------------------------------------------------------------
--新定义的可重入表的结尾调用
--@remark 该函数会自动调用新表的Init函数
--@param newClass 被定义的新表
function EndReloadClass(newClass)
	InitObj(newClass)
end

--------------------------------------------------------------------
--从类中可重入的new一个对象实例
function rnew(newobj, cls)
	if newobj == nil then
		newobj = {}
	end
	TableCopy(newobj, cls)
	
	-- 调用该实例的构造函数
	InitObj(newobj)
	return newobj
end

function new(cls)
	return rnew(nil, cls)
end



