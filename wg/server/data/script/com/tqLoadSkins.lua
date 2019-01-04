require('tqBaseClass')
require('tqXmlAssist')

class LoadSkins(BaseClass)
	--初始化入口
	function Init(self)
		self.skinLoader = rinit(self.skinLoader, nil)
		self.isGlobalLoader = rinit(self.isGlobalLoader, true)
		self.wndManager = rinit(self.wndManager, GetWndManager())
	end;
	
	--装载一个xml文件描述的skin资源
	--@param skinloader
	-- 装载器对象
	--@param pathname,
	-- xml文件路径
	--@param isglobalLoader
	-- skinloader是否是全局装载器
	function LoadXmlFile(self, skinloader, pathname, isglobalLoader)
		self.skinLoader = skinloader
		self.isGlobalLoader = isglobalLoader
		local restable = ParseXmlFile(pathname)
		if restable ~= nil then
			self:HandleTopItem(restable);
		end;
	end;
	
	--装载一个lua表描述的skin资源
	--@param skinloader
	-- 装载器对象
	--@param restable
	-- lua表描述的skin资源
	--@param isglobalLoader
	-- skinloader是否是全局装载器
	function LoadRes(self, skinloader, restable, isglobalLoader)
		self.skinLoader = skinloader
		self.isGlobalLoader = isglobalLoader
		if restable ~= nil then
			self:HandleTopItem(restable);
		end;
	end;
	
	--处理xml的顶层节点
	--@param res
	-- 顶层节点集合
	function HandleTopItem(self, res)
		for i = 1, res.n, 1 do
			self:HandleItem(res[i])
		end;
	end;
	
	--递归处理每个节点
	--@param childres
	-- 当前要被处理的子节点集合
	function HandleItem(self, childres)
		if childres.name == 'defaultwndskin' then
			self:HandleDefaultWndSkin(childres)
		elseif childres.name == 'regtipwnd' then
			self:HandleRegTipWnd(childres)
		elseif childres.name == 'stateskins' then
			self:HandleSkins(childres)			
		elseif childres.name == 'sizes' then
			self:HandleSizes(childres)
		elseif childres.name == 'colors' then
			self:HandleColors(childres)
		elseif childres.name == 'images' then
			self:HandleImages(childres)
		elseif childres.name == 'sounds' then
			self:HandleSounds(childres)
		elseif childres.name == 'texts' then
			self:HandleTexts(childres)
		else
			for i = 1, childres.n, 1 do
				self:HandleItem(childres[i])
			end;
		end;
	end;
	
	-- 处理窗体类型默认的皮肤定义
	function HandleDefaultWndSkin(self, childres)
		for i = 1, childres.n, 1 do
			if childres[i].name == 'wndskin' then
				local attr = childres[i].attr
				self.skinLoader:SetWndDefaultSkinName(attr.wndtypename, attr.skinname)
			end;
		end;
	end
	
	-- 处理tip窗体类型的注册
	function HandleRegTipWnd(self, childres)
		for i = 1, childres.n, 1 do
			if childres[i].name == 'tipwnd' then
				self:HandleOneRegTipWnd(childres[i])
			end
		end
	end
	
	-- 处理单个tip窗体类型的注册
	function HandleOneRegTipWnd(self, childres)
		attrs = {keyname=nil, skinname=nil, showms=3, infaderms=1, outfaderms=1, minwidth=60, maxwidth=350, style=0, exstyle=0, orderlayer=EOL_TOOLTIP, instancecount=0}
		for i = 1, childres.n, 1 do
			local attr = childres[i].attr
			if childres[i].name == 'keyname' then
				attrs.keyname = attr.value
			elseif childres[i].name == 'skinname' then
				attrs.skinname = attr.value
			elseif childres[i].name == 'showms' then
				attrs.showms = tonumber(attr.value)
			elseif childres[i].name == 'infaderms' then
				attrs.infaderms = tonumber(attr.value)
			elseif childres[i].name == 'outfaderms' then
				attrs.outfaderms = tonumber(attr.value)
			elseif childres[i].name == 'minwidth' then
				attrs.minwidth = tonumber(attr.value)
			elseif childres[i].name == 'maxwidth' then
				attrs.maxwidth = tonumber(attr.value)
			elseif childres[i].name == 'instancecount' then
				attrs.instancecount = tonumber(attr.value)	
			elseif childres[i].name == 'style' then
				attrs.style = loadstring("return " .. attr.value)()
			elseif childres[i].name == 'exstyle' then
				attrs.exstyle = loadstring("return " .. attr.value)()
			elseif childres[i].name == 'orderlayer' then
				attrs.orderlayer = loadstring("return " .. attr.value)()				
			end
		end
		if attrs.keyname ~= nil then
			self.wndManager:AppendTipWnd(attrs.keyname,
				attrs.skinname,
				attrs.showms,
				attrs.infaderms,
				attrs.outfaderms,
				attrs.minwidth,
				attrs.maxwidth,
				attrs.style,
				attrs.exstyle,
				attrs.orderlayer,
				attrs.instancecount)
		end
	end
	
	--处理整个skins
	--@param childres
	-- 当前要被处理的子节点集合
	function HandleSkins(self, childres)
		for i = 1, childres.n, 1 do
			if childres[i].name == 'skin' then
				self:HandleOneSkin(childres[i], i)
			end;
		end;
	end;
	
	--处理整个sizes
	--@param childres
	-- 当前要被处理的子节点集合
	function HandleSizes(self, childres)
		for i = 1, childres.n, 1 do
			if childres[i].name == 'size' then
				local attr = childres[i].attr
				self.skinLoader:SetSkinSize(attr.name, attr.value)
			end;
		end;
	end;
	
	--处理整个colors
	--@param childres
	-- 当前要被处理的子节点集合
	function HandleColors(self, childres)
		for i = 1, childres.n, 1 do
			if childres[i].name == 'color' then
				local attr = childres[i].attr
				local color = XmlAssist:GetColorFromString(attr.value)
				self.skinLoader:SetSkinColor(attr.name, color)
			end;
		end;
	end;
	
	--处理整个images
	--@param childres
	-- 当前要被处理的子节点集合
	function HandleImages(self, childres)
		for i = 1, childres.n, 1 do
			if childres[i].name == 'image' then
				local attr = childres[i].attr
				self.skinLoader:SetSkinImage(attr.name, attr.value)
			end;
		end;
	end;
	
	--处理整个sounds
	--@param childres
	-- 当前要被处理的子节点集合
	function HandleSounds(self, childres)
		for i = 1, childres.n, 1 do
			if childres[i].name == 'sound' then
				local attr = childres[i].attr
				self.skinLoader:SetSkinSound(attr.name, attr.value)
			end;
		end;
	end;
	
	--处理整个texts
	--@param childres
	-- 当前要被处理的子节点集合
	function HandleTexts(self, childres)
		for i = 1, childres.n, 1 do
			if childres[i].name == 'text' then
				local attr = childres[i].attr
				self.skinLoader:SetSkinText(attr.name, attr.value)
			end;
		end;
	end;
		
	--处理单个skin
	--@param childres
	-- 当前要被处理的子节点集合
	function HandleOneSkin(self, childres, skinid)
		local skinType = childres.attr.name
		for i = 1, childres.n, 1 do
			if childres[i].name == 'state' then
				local stateType = childres[i].attr.name
				retState = self:HandleOneState(childres[i])
				if self.isGlobalLoader then
					self.skinLoader:SetSkinByName(skinType, 
					 skinid,
					 stateType,
					 retState.imagepath, 
					 retState.bgcolor, 
					 retState.fontinfo, 
					 retState.loop);
				else
					self.skinLoader:SetSkinByName(
					 stateType,
					 retState.imagepath, 
					 retState.bgcolor, 
					 retState.fontinfo, 
					 retState.loop);
				end;
			end;
		end;
	end;
	
	--处理单个state
	--@param childres
	-- 当前要被处理的子节点集合
	function HandleOneState(self, childres)
		local retState = {imagepath=nil, bgcolor=nil, fontinfo=nil, loop=0,};
		for i = 1, childres.n, 1 do
			if childres[i].name == 'bgcolor' then
				retState.bgcolor = XmlAssist:GetColorFromString(childres[i].attr.value)
			elseif childres[i].name == 'bgimage' then
				retState.imagepath = childres[i].attr.path
			elseif childres[i].name == 'font' then
				retState.fontinfo = XmlAssist:GetFontFromAttrs(childres[i].attr)
			end;
		end;
		return retState;
	end;
end

InitObj(LoadSkins)

