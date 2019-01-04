require('misc')
_LOADED_EX = {} 

--执行一个文件
--@param filepath
-- 文件名称
function dofile (filepath)
	local f = assert(loadfile(filepath))
	return f()
end;

--获得文件的大小
--@param filepath
-- 文件名称
function file_size(filepath) 
	local file = assert(io.open(filepath, "rb"))
	local current = file:seek()      -- 得到当前位置
	local size = file:seek("end")    -- 得到文件大小
	file:seek("set", current)        -- 恢复
	file:close()
	return size
end;

--载入某个文件
--@param fileName
-- 文件名称
function require_ex(fileName)
	fsize = file_size(fileName);
	mtime = misc:fileattr(fileName, "modifytime")
	local bNeedReload = false;
	if _LOADED_EX[fileName] == nil then
		_LOADED_EX[fileName] = {modityTime=mtime; fileSize=fsize;};
		bNeedReload = true;
	else
		if _LOADED_EX[fileName].modityTime ~= mtime or _LOADED_EX[fileName].fileSize ~= fsize then
			_LOADED_EX[fileName].modityTime=mtime; 
			_LOADED_EX[fileName].fileSize=fsize;
			bNeedReload = true
		end;
	end;
	
	if bNeedReload == true then
		return dofile(fileName)
	end;
	
	return nil
end;

--[[
print(package.loaders)

for i, v in ipairs(package.loaders) do
	print(i, v)
end
]]




