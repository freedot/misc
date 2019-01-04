require('tqBaseClass')

class Search(BaseClass)
	-- 初始化入口
	function Init(self)
	end
	
	-- 用二分法查找val在array中合适的位置
	--@param array 将要被查找的数组
	--@param val 用该值在表中进行查找
	--@param field val将在array中进行查找比较的字段名
	--@param flag 'e'-表示相等,'le'-表示小于等于,'ge'-表示大于等于,'l'-表示小于,'g'-表示大于
	--@return 返回查找到的数组下标，-1表示没有找到
	function BinSearch(self, array, val, field, flag)
		local tlen = table.getn(array)
		if flag == 'e' then
			local firstPos = 1
			local lastPos = tlen + 1
			local midPos = nil
			local midVal = nil
			while firstPos < lastPos do
				midPos = math.floor(( firstPos + lastPos ) / 2);
				if field == nil then
					midVal = array[midPos]
				else
					midVal = array[midPos][field]
				end
				if val == midVal then
					return midPos
				elseif val < midVal then
					lastPos = midPos
				else
					firstPos = midPos + 1
				end
			end
		elseif flag == 'g' then
			local firstPos = 1
			local lastPos = tlen + 1
			local midPos = nil
			local midVal = nil
			while firstPos < lastPos do
				midPos = math.floor(( firstPos + lastPos ) / 2);
				if field == nil then
					midVal = array[midPos]
				else
					midVal = array[midPos][field]
				end
				if val >= midVal then
					firstPos = midPos + 1
				else
					if midPos > 1 then
						if field == nil then
							midVal = array[midPos-1]
						else
							midVal = array[midPos-1][field]
						end
					end
					
					if midPos == 1 or val >= midVal then
						return midPos
					else
						lastPos = midPos
					end
				end
			end
		end
		return -1
	end
end

InitObj(Search)



