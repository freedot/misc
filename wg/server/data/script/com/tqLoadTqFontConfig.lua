require('tqBaseClass') 

LoadFontConfig = BeginReloadClass(LoadFontConfig, BaseClass)
	--初始化入口
	function LoadFontConfig:Init(self)
		self.fontManager = GetFontManager()
	end;
	
	--装载一个xml资源
	--@param pathname
	-- xml资源路径
	function LoadFontConfig:LoadXml(self, pathname)
		restable = ParseXmlFile(pathname)
		if restable ~= nil then
			LoadFontConfig:HandleTopItem(restable);
		end;
	end;
	
	--处理xml的顶层节点
	--@param res
	-- 顶层节点集合
	function LoadFontConfig:HandleTopItem(self, res)
		for i = 1, res.n, 1 do
			self:HandleItem(res[i])
		end;
	end;
	
	--递归处理每个节点
	--@param childres
	-- 当前要被处理的子节点集合
	function LoadFontConfig:HandleItem(self, childres)
		if childres.name == 'attrs' then
			retAttrs = self:HandleAttrs(childres)
			print(retAttrs.FontName)
			self.fontManager:AddFontType(
				retAttrs.FontName,
				retAttrs.FontFilePath,
				retAttrs.FontFileName,
				retAttrs.FontWidth,
				retAttrs.FontHeight,
				false,
				false,
				false,
				retAttrs.BlockWidth,
				retAttrs.BlockHeight,
				retAttrs.BlockCount);
		else
			for i = 1, childres.n, 1 do
				self:HandleItem(childres[i])
			end;
		end;
	end;
	
	--处理具体的属性列表
	--@param attrsres
	-- 属性节点集合
	--@return
	-- 返回属性的一个table
	function LoadFontConfig:HandleAttrs(self, attrsres)
		local rettable = {FontName='',FontFilePath='',FontFileName='',
			FontWidth=0,FontHeight=0,BlockWidth=0,BlockHeight=0,BlockCount=0,}
		for i = 1, attrsres.n, 1 do
			attr = attrsres[i].attr
			if attr.name == 'FontName' then
				rettable.FontName = attr.value
			elseif attr.name == 'FontFilePath' then
				rettable.FontFilePath = attr.value
			elseif attr.name == 'FontFileName' then
				rettable.FontFileName = attr.value
			elseif attr.name == 'FontWidth' then
				rettable.FontWidth = attr.value
			elseif attr.name == 'FontHeight' then
				rettable.FontHeight = attr.value
			elseif attr.name == 'BlockWidth' then
				rettable.BlockWidth = attr.value
			elseif attr.name == 'BlockHeight' then
				rettable.BlockHeight = attr.value
			elseif attr.name == 'BlockCount' then
				rettable.BlockCount = attr.value
			end;
		end;
		return rettable;
	end;
EndReloadClass(LoadFontConfig)

LoadFontConfig:LoadXml("E:/TqGame/clientbin/fontconfig.xml")

