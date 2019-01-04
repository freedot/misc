Request = Class:extends({
	--判断txt是否有脏字
	--@param txt 将被判断的文本输入
	--@return 返回true表示有需要过滤的脏字
	HasDirtyWords = function(self, txt)
		return false
	end;
	
	--判断txt是否是输入安全的（没有sql的输入注入）
	--@param txt 将被判断的文本输入
	--@return 返回true表示是安全的
	IsSafeString = function(self, txt)
		return true
	end;
})

--初始化为单件
InitObj(Request)

