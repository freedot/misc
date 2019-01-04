require('tqBaseClass')

class NetPkg(BaseClass)
	-- 初始化入口
	function Init(self)
	end

	-- 计算一个对值包的大小
	--@param msgpkg 典型结构如下,其中byte记录了当前value在网络包占的字节个数
	--   {byte,value}, { {byte,value}, {byte,value}, {byte,value}, }, {{byte,value},{byte,value}, }, }
	--@return 返回对值包占的网络字节个数	
	function PairvalueSize(self, msgpkg)
		local bytes = 0
		if msgpkg ~= nil then
			local cnt = table.getn(msgpkg)
			for i = 1, cnt, 1 do
				local subpkg = msgpkg[i]
				if table.getn(subpkg) > 0 then
					bytes = bytes + PairvalueSize(subpkg)
				else
					bytes = bytes + subpkg.byte
				end
			end
		end
		return bytes
	end
end

InitObj(NetPkg)


