require('tqBaseClass')
class XmlAssist(BaseClass)
	--从一个字符串中用分割出一系列的number为成员的列表
	--@param strval 指定的字符串
	--@return 返回一个被分割过后的列表
	function GetNumberArray(self, strval)
		local myarrays = {}
		for w in string.gfind(strval, "[+-]?%d+[.]?%d*") do
			table.insert(myarrays, tonumber(w))
		end;
		return myarrays;
	end
	
	--从一个字符串中解析color对象
	--@param strval
	-- 形如'255,255,0,0',分别表示a,r,g,b
	--@return
	-- 返回color对象
	function GetColorFromString(self, strval)
		local mycl = {}
		for w in string.gfind(strval, "%d+") do
			table.insert(mycl, w)
		end;
		
		local color = nil
		if table.getn(mycl) == 4 then
			color = Color(mycl[1], mycl[2], mycl[3], mycl[4])
		end;
		return color;
	end;
	
	--从一个字符串中解析rect对象
	--@param strval
	-- 形如'0,0,100,100',分别表示(l,t,r,b)
	--@return
	-- 返回rect对象
	function GetRectFromString(self, strval)
		local myrt = {}
		for w in string.gfind(strval, "[+-]?%d+") do
			table.insert(myrt, w)
		end;
		
		local rt = nil
		if table.getn(myrt) == 4 then
			rt = Rect_int_(myrt[1], myrt[2], myrt[3], myrt[4])
		end;
		return rt
	end;
	
	--从一个字符串中解析size对象
	--@param strval
	-- 形如'0,0',分别表示(cx,cy)
	--@return
	-- 返回size对象
	function GetSizeFromString(self, strval)
		local mysz = {}
		for w in string.gfind(strval, "[+-]?%d+") do
			table.insert(mysz, w)
		end;
		
		local sz = nil
		if table.getn(mysz) == 2 then
			sz = Size_int_(mysz[1], mysz[2])
		end;
		return sz
	end;
	
	
	--从一个属性table中解析rect tooltip信息
	--@param attrval
	-- 属性table对象
	--@return
	-- 返回rect tooltip信息
	function GetRectTipFromAttrs(self, attrval)
		local recttip = {show=false, delay=false, followcursor=false, text='',}
		if attrval == nil then
			return recttip
		end;
		
		if attrval.show ~= nil then
			recttip.show = (attrval.show == 'true')
		end
		
		if attrval.delay ~= nil then
			recttip.delay = (attrval.delay == 'true')
		end
		
		if attrval.follow ~= nil then
			recttip.followcursor = (attrval.follow == 'true')
		end
		
		if attrval.text ~= nil then
			recttip.text = attrval.text
		end
		return recttip
	end
	
	
	--从一个属性table中解析font对象
	--@param attrval
	-- 属性table对象
	--@return
	-- 返回fontInfo对象
	function GetFontFromAttrs(self, attrval)
		local fontInfo = SFontInfo()
		if attrval == nil then
			return fontInfo
		end;
		
		if attrval.name ~= nil then
			fontInfo:SetName(attrval.name)
		end;
		
		if attrval.edge ~= nil then
			fontInfo.bEdge = (attrval.edge == 1)
		end;
		
		if attrval.bold ~= nil then
			fontInfo.bBold = (attrval.bold == 1)
		end;
		
		if attrval.italic ~= nil then
			fontInfo.bItalic = (attrval.italic == 1)
		end;
		
		if attrval.underline ~= nil then
			fontInfo.bUnderline = (attrval.underline == 1)
		end;
		
		if attrval.strikeout ~= nil then
			fontInfo.bStrikeout = (attrval.strikeout == 1)
		end;
		
		if attrval.color ~= nil then
			local color = self:GetColorFromString(attrval.color)
			if color ~= nil then
				fontInfo.ulColor = color.ulColor
			end;
		end;
		
		if attrval.edgecolor ~= nil then
			local color = self:GetColorFromString(attrval.edgecolor)
			if color ~= nil then
				fontInfo.ulEdgeColor = color.ulColor
			end;
		end;
		
		if attrval.bgcolor ~= nil then
			local color = self:GetColorFromString(attrval.bgcolor)
			if color ~= nil then
				fontInfo.ulBgColor = color.ulColor
			end;
		end;
		return fontInfo
	end;
	
	-- 向当前表插入一个xml条目
	--@param tb 将要被插入的表
	--@param szname 将要被插入的条目名称
	--@param attrs 该条目的属性表
	--@return 返回该插入条目在表的位置索引
	function XmlInsert(self, tb, szname, attrs)
		table.insert(tb, {name=szname, attr=attrs, n=0} )
		if tb.n == nil then
			tb.n = 0
		end
		tb.n = tb.n + 1
		local ipos = table.getn(tb)
		return ipos
	end
end

InitObj(XmlAssist)


