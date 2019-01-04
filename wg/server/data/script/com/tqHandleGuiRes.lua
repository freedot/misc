require('tqBaseClass')
require('tqXmlAssist')
require('tqLoadSkins')

class HandleGuiRes(BaseClass)
	--初始化入口
	function Init(self)
	end;
	
	--装载一个xml资源
	--@param resPathname xml资源路径
	--@param selfWnd 将要被创建的窗体对象
	--@param parentWnd 父窗体对象或nil
	--@param isReCreate 是否被重新创建的
	function Handle(self, resPathname, selfWnd, parentWnd, isReCreate)
		self.stringres = {}
		self.macrosres = {}
		self.parentwnd = parentWnd
		self.currentwnd = selfWnd
		self.selfwnd = selfWnd
		self.isReCreate = isReCreate
		self.wndmanager = GetWndManager()
		self.gameSys = GetGameSys()
		local restable = ParseXmlFile(resPathname)
		if restable ~= nil then
			self:HandleTopItem(restable);
		end
		self:CreateStringRes()
		self:CreateMacrosRes()
		self:CreateEventRegFun()
		self:CreateOtherFun()
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
		if childres.name == 'item' then
			self:HandleWndItem(childres)
		elseif childres.name == 'stringres' then
			self:HandleStringRes(childres)
		elseif childres.name == 'macros' then
			self:HandleMacrosRes(childres)
		else
			for i = 1, childres.n, 1 do
				self:HandleItem(childres[i])
			end;
		end;
	end;
	
	--处理整个window item
	--@param childres
	-- 当前要被处理的子节点集合
	function HandleWndItem(self, childres)
		local attrs = nil
		local innerWnd = nil
		
		-- 获得当前窗体的属性描述表
		for i = 1, childres.n, 1 do
			if childres[i].name == 'attrs' then
				attrs = self:HandleWndAttrs(childres[i])
				break
			end
		end
		
		-- 开始创建或重新设置窗体属性
		if attrs ~= nil then
			if self.isReCreate then
				-- 重新设置已存在的窗体属性
				if self.currentwnd ~= nil then
					innerWnd = self.currentwnd
				else
					local baseinnerWnd = GuiAssist:GetChildById(self.parentwnd, attrs.id, false)
					innerWnd = GuiAssist:CastGuiWnd(baseinnerWnd)
					self.currentwnd = Inherit(self.currentwnd, innerWnd)
					tolua:inherit(self.currentwnd, innerWnd)
				end
				
				if innerWnd ~= nil then
					innerWnd:SetCaption(attrs.caption)
					innerWnd:SetStyle(attrs.style)
					innerWnd:SetExStyle(attrs.exstyle)
					if self.parentwnd == nil then
						oldrect = innerWnd:GetRelativePosition()
						attrs.rect:Offset(oldrect.left-attrs.rect.left, oldrect.top-attrs.rect.top)
					end
					innerWnd:SetRelativePosition(attrs.rect)
				end
			else
				local baseinnerWnd = self.wndmanager:CreateWnd(childres.attr.type,
					attrs.skinname,
					attrs.caption,
					attrs.style,
					attrs.exstyle,
					attrs.rect,
					self.parentwnd,
					attrs.id);
					
				-- 进行窗体对象类型的转换
				innerWnd = GuiAssist:CastGuiWnd(baseinnerWnd)
				
				if innerWnd ~= nil then
					-- 使用tolua.inherit可以将self.currentwnd转换成为userdata类型
					self.currentwnd = Inherit(self.currentwnd, innerWnd)
					tolua:inherit(self.currentwnd, innerWnd)
				end
			end
			
			-- 设置其它一些窗体的属性
			if innerWnd ~= nil then
				if childres.attr.type == 'editbox' and attrs.caption ~= '' then
					if attrs.caption[0] == '<' then
						innerWnd:SetXmlText(attrs.caption)
					else
						innerWnd:SetPureText(attrs.caption)
					end
				end
				
				if attrs.moveheight > 0 and innerWnd.SetMoveHeight ~= nil then
					innerWnd:SetMoveHeight(attrs.moveheight)
				end
				
				innerWnd:SetMaxSize(attrs.maxsize)
				innerWnd:SetMinSize(attrs.minsize)
				innerWnd:SetVisible(attrs.visible)
				innerWnd:SetEnabled(attrs.enabled)
				innerWnd:SetNotClipped(attrs.noclip)
				innerWnd:SetAlignment(attrs.textalign)
				innerWnd:SetToolTipText(attrs.tooltip)
				if attrs.orderlayer ~= nil then
					if attrs.orderlayer ~= innerWnd:GetOrderLayer() then
						innerWnd:SetOrderLayer(attrs.orderlayer)
						local innerParent = innerWnd:GetParent()
						if innerParent ~= nil then
							innerParent:BringToFront(innerWnd)
						end
					end
				end
				
				-- 处理dc列表
				if not self.isReCreate then
					for i, onedc in ipairs(attrs.dclist) do
						local dc = nil
						local brefer = true
						if onedc.guid ~= nil then
							dc = self.gameSys:CreateInterface(onedc.guid)
							brefer = false
						elseif onedc.refer ~= nil then
							dc = GuiAssist:CastVoidToInterface(onedc.refer, self.gameSys:GetUserData(onedc.refer))
							brefer = true
						end
						
						if dc ~= nil then
							if not innerWnd:AppendDC(onedc.key, dc, brefer) then
								self.gameSys:DestroyInterface(dc)
							end
						end
					end
				end
			end
		end
		
		-- 处理子窗体
		if innerWnd ~= nil then
			for i = 1, childres.n, 1 do
				if childres[i].name == 'item' then
					local currentwnd_save = self.currentwnd
					local parentwnd_save = self.parentwnd
					self.parentwnd = self.currentwnd
					self.currentwnd = nil
					attrs = self:HandleWndItem(childres[i])
					self.currentwnd = currentwnd_save
					self.parentwnd = parentwnd_save
				end;
			end;
		end;
		
		-- 装载自定义界面皮肤
		local isLoadSkin = false
		if innerWnd ~= nil then
			for i = 1, childres.n, 1 do
				if childres[i].name == 'skins' then
					LoadSkins:LoadRes(innerWnd:GetSkin(), childres[i], false)
					isLoadSkin = true
					break
				end;
			end;
		end;
		
		-- 如果无自定义界面皮肤配置，则重新初始化自定义界面皮肤
		if not isLoadSkin then
			local customSkin = innerWnd:GetSkin()
			customSkin:ReInit()
		end

		-- 如果是list控件
		for i = 1, childres.n, 1 do
			if childres[i].name == 'imagelist' then
				-- 装载自定义的imagelist属性
				self:HandleImageList(childres[i])
			elseif childres[i].name == 'listhead' then
				-- 装载自定义的listhead属性
				self:HandleListHead(childres[i])
			elseif childres[i].name == 'listitemtemp' then
				-- 装载自定义的listitemtemp属性
				self:HandleListItemTemp(childres[i])
			elseif childres[i].name == 'listitem' then
				-- 装载自定义的listitem属性
				self:HandleListItem(childres[i])
			end
		end
	end;
	
	--获得当前item的attrs
	--@param childres
	-- 当前要被处理的子节点集合
	function HandleWndAttrs(self, childres)
		local attrs = { id=-1;
			 caption='';
			 rect = Rect_int_(0,0,100,100);
			 minsize = Size_int_(0,0);
			 maxsize = Size_int_(0,0);
			 noclip = true;
			 textalign = OR(EAT_LEFT,EAT_TOP);
			 visible = true;
			 enabled = true;
			 style = 0;
			 exstyle = 0;
			 tooltip = '';			 
			 skinname = nil;
			 orderlayer = nil;
			 moveheight=0;
			 dclist = {};
			};
		for i = 1, childres.n, 1 do
			if childres[i].name == 'attr' then
				if childres[i].attr.name == 'Id' then
					attrs.id = -1
					local value = childres[i].attr.value
					if type(value) == 'string' then
						local macroid = self.macrosres[value]
						if macroid ~= nil then
							attrs.id = macroid
						elseif tonumber(value) ~= nil then
							attrs.id = tonumber(value)
						else
							print('*error* the macros is not exist: '..value)
						end
					elseif type(value) == 'number' then
						attrs.id = value
					else
						print('*error* the window or ctrl id is invailed: '..value)
					end
				elseif childres[i].attr.name == 'Caption' then
					attrs.caption = childres[i].attr.value
				elseif childres[i].attr.name == 'Rect' then
					attrs.rect = XmlAssist:GetRectFromString(childres[i].attr.value)
				elseif childres[i].attr.name == 'MinSize' then
					attrs.minsize = XmlAssist:GetSizeFromString(childres[i].attr.value)
				elseif childres[i].attr.name == 'MaxSize' then
					attrs.maxsize = XmlAssist:GetSizeFromString(childres[i].attr.value)
				elseif childres[i].attr.name == 'NoClip' then
					attrs.noclip = loadstring("return " .. childres[i].attr.value)()
				elseif childres[i].attr.name == 'TextAlign' then
					attrs.textalign = loadstring("return " .. childres[i].attr.value)()
				elseif childres[i].attr.name == 'Visible' then
					attrs.visible = loadstring("return " .. childres[i].attr.value)()
				elseif childres[i].attr.name == 'Enabled' then
					attrs.enabled = loadstring("return " .. childres[i].attr.value)()
				elseif childres[i].attr.name == 'Style' then
					attrs.style = loadstring("return " .. childres[i].attr.value)()
				elseif childres[i].attr.name == 'ExStyle' then
					attrs.exstyle = loadstring("return " .. childres[i].attr.value)()
				elseif childres[i].attr.name == 'ToolTip' then
					attrs.tooltip = childres[i].attr.value
				elseif childres[i].attr.name == 'SkinName' then
					attrs.skinname = childres[i].attr.value	
				elseif childres[i].attr.name == 'MoveHeight' then
					attrs.moveheight = tonumber(childres[i].attr.value)	
				elseif childres[i].attr.name == 'AppendDC' then
					if childres[i].attr.guid ~= nil then
						table.insert(attrs.dclist, {key=childres[i].attr.key, guid=childres[i].attr.guid})
					elseif childres[i].attr.refer ~= nil then
						table.insert(attrs.dclist, {key=childres[i].attr.key, refer=childres[i].attr.refer})
					end
				elseif childres[i].attr.name == 'OrderLayer' then
					attrs.orderlayer = loadstring("return " .. childres[i].attr.value)()	
				end
			end;
		end;
		return attrs;
	end;
	
	--处理整个colors
	--@param childres
	-- 当前要被处理的子节点集合
	function HandleStringRes(self, childres)
		for i = 1, childres.n, 1 do
			if childres[i].name == 'def' then
				local attr = childres[i].attr
				if attr.name ~= nil and attr.value ~= nil then
					self.stringres[attr.name] = attr.value
				end;
			end;
		end;
	end;
	
	--处理整个macros
	--@param childres 当前要被处理的子节点集合
	function HandleMacrosRes(self, childres)
		for i = 1, childres.n, 1 do
			if childres[i].name == 'macro' then
				local attr = childres[i].attr
				if attr.name ~= nil and attr.value ~= nil then
					self.macrosres[attr.name] = tonumber(attr.value)
				end;
			end;
		end;	
	end;
	
	--装载自定义的imagelist属性
	--@param childres 当前要被处理的子节点集合
	function HandleImageList(self, childres)
		local imageList = self.currentwnd:GetImageList()
		for i = 1, childres.n, 1 do
			if childres[i].name == 'image' then
				if childres[i].attr.value ~= nil then
					imageList:AddImage(childres[i].attr.value)	
				end
			end
		end
	end
	
	--装载自定义的listhead属性
	--@param childres 当前要被处理的子节点集合
	function HandleListHead(self, childres)
		local listHead = self.currentwnd:GetColumnHead()
		listHead:SetSize(tonumber(childres.attr.width), tonumber(childres.attr.height))
		for i = 1, childres.n, 1 do
			if childres[i].name == 'column' then
				listHead:InsertCol(-1, 0, '', -1)
				childressub = childres[i]
				for j=1, childressub.n, 1 do
					if childressub[j].name == 'sorttype' then
						listHead:SetSortType(j-1, loadstring("return "..childressub[j].attr.value)())
					elseif childressub[j].name == 'imageidx' then
						listHead:SetImage(j-1, tonumber(childressub[j].attr.value))
					elseif childressub[j].name == 'font' then
						local fontinfo = XmlAssist:GetFontFromAttrs(childressub[j].attr)
						listHead:SetFontInfo(j-1, fontinfo)
					elseif childressub[j].name == 'text' then
						listHead:SetText(j-1, childressub[j].attr.value)
					elseif childressub[j].name == 'align' then
						listHead:SetAlign(j-1, loadstring("return "..childressub[j].attr.value)())
					elseif childressub[j].name == 'width' then
						listHead:SetColWidth(j-1, tonumber(childressub[j].attr.value))
					elseif childressub[j].name == 'itemtempsubidx' then
						for w in string.gfind(childressub[j].attr.value, "%d+") do
							listHead:InsertSubItemIndexIntoCol(tonumber(w))
						end
					end
				end
			end
		end
		listHead:SetInitedOk()
	end
	
	--装载自定义的listitemtemp属性
	--@param childres 当前要被处理的子节点集合
	function HandleListItemTemp(self, childres)
		self.currentwnd:SetItemTempCount(childres.n)
		local listItemTemp = GuiListItemTemp()
		for i = 1, childres.n, 1 do
			if childres[i].name == 'onetemp' then
				listItemTemp:Clear()
				listItemTemp:SetSize(tonumber(childres[i].attr.width), tonumber(childres[i].attr.height))
				local subres = childres[i]
				for j=1, subres.n, 1 do
					if subres[j].name == 'sub' then
						local rect = Rect_int_(0,0,0,0)
						listItemTemp:InsertSub(-1, rect)
						local subsubres = subres[j]
						for m=1, subsubres.n, 1 do
							if subsubres[m].name == 'subrect' then
								local subrect = XmlAssist:GetRectFromString(subsubres[m].attr.value)
								listItemTemp:SetSubRect(j-1, subrect)
							elseif subsubres[m].name == 'recttooltip' then
								local recttip = XmlAssist:GetRectTipFromAttrs(subsubres[m].attr)
								listItemTemp:SetSubToolTip(j-1, recttip.show, recttip.delay, recttip.followcursor, recttip.text)
							elseif subsubres[m].name == 'align' then
								listItemTemp:SetAlign(j-1, loadstring("return "..subsubres[m].attr.value)())
							elseif subsubres[m].name == 'font' then
								local fontinfo = XmlAssist:GetFontFromAttrs(subsubres[m].attr)
								listItemTemp:SetFontInfo(j-1, fontinfo)
							elseif subsubres[m].name == 'item' then
								local currentwnd_save = self.currentwnd
								local parentwnd_save = self.parentwnd
								local recreate_save = self.isReCreate
								self.parentwnd = self.currentwnd
								self.currentwnd = nil
								self.isReCreate = false
								attrs = self:HandleWndItem(subsubres[m])
								listItemTemp:SetItemCtrl(j-1,self.currentwnd)
								self.currentwnd = currentwnd_save
								self.parentwnd = parentwnd_save
								self.isReCreate = recreate_save
							end
						end
					end
				end
				self.currentwnd:SetItemTemp(i-1, listItemTemp)
			end
		end
	end
	
	--装载自定义的listitem属性
	--@param childres 当前要被处理的子节点集合
	function HandleListItem(self, childres)
		local listItem = GuiListItem()
		local itemCount = self.currentwnd:GetItemCount()
		if itemCount > 0 then
			return
		end
		
		for i = 1, childres.n, 1 do
			local subres = childres[i]
			if subres.name == 'oneitem' then
				listItem:Clear()
				local normalTempIdx = tonumber(subres.attr.normaltemp)
				local hotTempIdx = tonumber(subres.attr.hottemp)
				local selectTempIdx = tonumber(subres.attr.selecttemp)
				listItem:SetIndex(-1)
				listItem:SetTempIndex(normalTempIdx, hotTempIdx, selectTempIdx)
				for j = 1, subres.n, 1 do
					if subres[j].name == 'sub' then
						local imageIdx = tonumber(subres[j].attr.imageidx)
						listItem:InsertSub(-1, subres[j].attr.text, imageIdx)
					end
				end
				self.currentwnd:InsertItem(listItem)
			end
		end
	end
	
	--在selfwnd中生成一个__res__资源表以及GetRes(strKey)函数
	function CreateStringRes(self)
		self.selfwnd['__res__'] = self.stringres
		if type(self.selfwnd['GetRes']) ~= 'function' then
			self.selfwnd.GetRes = function(self, strKey)
				if strKey ~= nil then
					local strRes = self.__res__[strKey]
					if strRes ~= nil then
						return strRes;
					end
				end
				return "unknow string"
			end
		end
	end;
	
	--在selfwnd中生成一个__mac__宏定义表以及GetMac(strKey)函数
	function CreateMacrosRes(self)
		self.selfwnd['__mac__'] = self.macrosres
		if type(self.selfwnd['GetMac']) ~= 'function' then
			self.selfwnd.GetMac = function(self, strKey)
				if strKey ~= nil then
					local strMac = self.__mac__[strKey]
					if strMac ~= nil then
						return strMac;
					end
				end
				return "unknow string"
			end
		end
	end
	
	--创建事件注册成员函数 self:EvtRegister
	function CreateEventRegFun(self)
		if type(self.selfwnd['EvtRegister']) ~= 'function' then
			self.selfwnd.EvtRegister = function(selfwnd, wnd, eventid, fromid, toid, fun)
				local handle = WndEvtRegister(wnd, eventid, fromid, toid, selfwnd, fun)
				if selfwnd['__evtreg'] == nil then
					selfwnd['__evtreg'] = {}
				end
				
				if handle ~= nil then
					table.insert(selfwnd.__evtreg, {keywnd=selfwnd, handle=handle, basewnd=wnd})
				end
			end
		end
		
		if type(self.selfwnd['EvtUnRegister']) ~= 'function' then
			self.selfwnd.EvtUnRegister = function(selfwnd, basewnd, handle)
				if handle ~= nil and basewnd ~= nil then
					WndEvtUnRegister(basewnd, handle)
				end
			end
		end
		
		if type(self.selfwnd['UnRegisterAll']) ~= 'function' then
			self.selfwnd.UnRegisterAll = function(selfwnd)
				if selfwnd.__evtreg ~= nil then
					local delIdxs = {}
					for i, v in ipairs(selfwnd.__evtreg) do
						if v.keywnd == selfwnd then
							selfwnd:EvtUnRegister(v.basewnd, v.handle)
							table.insert(delIdxs, i)
						end
					end
					
					-- 从后往前删
					local cnt = table.getn(delIdxs)
					for i=cnt, 1, -1 do
						table.remove(selfwnd.__evtreg, delIdxs[i])
					end
				end
			end
		end
	end
	
	--创建一些其他的公用函数
	function CreateOtherFun(self)
		if type(self.selfwnd['IsCreatedOk']) ~= 'function' then
			self.selfwnd.IsCreatedOk = function(selfwnd)
				if selfwnd.__created == nil then
					selfwnd.__created = false
				end
				return selfwnd.__created
			end
		end
		
		-- 在窗体快捷键表中添加一个快捷键
		if type(self.selfwnd['AppendAccel']) ~= 'function' then
			self.selfwnd.AppendAccel = function(selfwnd, accel)
				if selfwnd.__backAccels == nil then
					selfwnd.__backAccels = {}
				end
				table.insert(selfwnd.__backAccels, {accel=accel, keywnd=selfwnd})
				selfwnd:AppendAcceleratorTable(accel)
			end
		end
		
		-- 将窗体快捷键表清除
		if type(self.selfwnd['ClearAccelAll']) ~= 'function' then
			self.selfwnd.ClearAccelAll = function(selfwnd)
				if selfwnd.__backAccels ~= nil then
					local delIdxs = {}
					for i, v in ipairs(selfwnd.__backAccels) do
						if v.keywnd == selfwnd then
							selfwnd:RemoveAcceleratorTable(v.accel)
							table.insert(delIdxs, i)
						end
					end
					
					-- 从后往前删
					local cnt = table.getn(delIdxs)
					for i=cnt, 1, -1 do
						table.remove(selfwnd.__backAccels, delIdxs[i])
					end
				end
			end
		end
	end
end

InitObj(HandleGuiRes)


