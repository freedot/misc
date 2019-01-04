------------------------------------------------------------------
--在该类中会提供一些Gui处理上的辅助功能工具
------------------------------------------------------------------
require('tqBaseClass')

class GuiAssist(BaseClass)
	-- 初始化
	function Init(self)
		--用户界面转换器
		self.guiCast = GuiWndCast()
		--事件对象转换器
		self.eventCast = EventCast()
		--窗口管理器
		self.wndManager = GetWndManager()
		--窗口dc转换器
		self.dcCast = DCCast()
		--游戏系统
		self.gameSys = GetGameSys()
		--场景节点转换器
		self.sceneCast = SceneCast()
		--动画控制器类工厂
		self.acFactory = GetAnimCtrlFactory()
		--动画控制器转换器
		self.acCast = ACCast()
	end;
	
	-- 获取当前鼠标屏幕坐标位置
	--@return 返回当前鼠标屏幕坐标位置
	function GetMousePos(self)
		local pos = self.wndManager:GetMousePostion()
		return pos
	end
	
	-- 获取一个鼠标事件相对于本窗口的位置
	-- 目前一个窗口接收到的鼠标事件位置是屏幕的绝对位置
	--@param wnd 获取鼠标事件的窗口对象
	--@param mouseInput 鼠标事件对象
	--@return 返回相对于本窗口的鼠标位置x,y
	function GetMouseRelativePos(self, wnd, mouseInput)
		local arect = wnd:GetAbsolutePosition()
		local x = mouseInput.x - arect.left
		local y = mouseInput.y - arect.top	
		return x, y
	end
	
	-- 通过id获得一个窗口的子控件
	--@param parentWnd 父窗口对象
	--@param id 子控件的id
	--@param isSearchRecursive 是否需要递归地查找（即在子控件中也要查找）
	--@return 返回子控件对象或nil
	function GetChildById(self, parentWnd, id, isSearchRecursive)
		if parentWnd ~= nil then
			local childWnd = parentWnd:GetItemFromId(id, isSearchRecursive)
			if childWnd ~= nil then
				return self:CastGuiWnd(childWnd)
			end
		end
		return nil
	end
	
	-- 通过动画控制器类型创建一个合适的动画控制器对象
	--@param acType 动画控制器类型
	--@return 返回合适的动画控制器对象或nil
	function CreateAC(self, acType)
		local baseAC = self.acFactory:CreateObject(acType)
		return self:CastAC(baseAC)
	end
	
	-- 将一个基础的动画控制器转换成合适的动画控制器
	--@param baseAC 基础的动画控制器
	--@return 返回合适的动画控制器对象或nil
	function CastAC(self, baseAC)
		if baseAC ~= nil then
			local acType = baseAC:GetType()
			if acType == ACTYPE_MOVE then
				return self.acCast:Cast_ACMove(baseAC)
			end
		end
		return nil
	end
	
	-- 将一个基础的窗口对象转换成合适的窗口对象
	--@param baseWnd 基础的窗口对象
	--@return 返回转换后的合适的窗口对象或nil
	function CastGuiWnd(self, baseWnd)
		if baseWnd ~= nil then
			local typeName = baseWnd:GetTypeName()
			if typeName == 'window' then
				return self.guiCast:Cast_GuiWindow(baseWnd)
			elseif typeName == 'button' then
				return self.guiCast:Cast_GuiButton(baseWnd)
			elseif typeName == 'listctrl' then
				return self.guiCast:Cast_GuiListCtrl(baseWnd)
			elseif typeName == 'editbox' then
				return self.guiCast:Cast_GuiEditBox(baseWnd)
			elseif typeName == 'filedialog' then
				return self.guiCast:Cast_GuiFileDialog(baseWnd)
			elseif typeName == 'messagebox' then
				return self.guiCast:Cast_GuiMessageBox(baseWnd)
			elseif typeName == 'checkbox' then
				return self.guiCast:Cast_GuiCheckBox(baseWnd)
			elseif typeName == 'tabctrl' then
				return self.guiCast:Cast_GuiTabCtrl(baseWnd)
			elseif typeName == 'container' then
				return self.guiCast:Cast_GuiContainer(baseWnd)
			elseif typeName == 'combobox' then
				return self.guiCast:Cast_GuiComboBox(baseWnd)
			elseif typeName == 'scrollbar' then
				return self.guiCast:Cast_GuiScrollBar(baseWnd)
			elseif typeName == 'dialog' then
				return self.guiCast:Cast_GuiDialog(baseWnd)
			end
		end
		return nil
	end
	
	-- 将scenenode转换成合适的scene对象
	function CastSceneNode(self, baseNode)
		if baseNode ~= nil then
			local type = baseNode:GetType()
			if type == ESNT_COMMON then
				return baseNode
			elseif type == ESNT_LAYER then
				return self.sceneCast:Cast_SceneLayer(baseNode)
			elseif type == ESNT_ENTITY then
				return self.sceneCast:Cast_SceneEntity(baseNode)
			end
		end
		return nil
	end
	
	-- 将void对象转换成基础窗体对象
	--@param lpvoid void对象
	--@return 返回基础窗体类型对象
	function CastGuiBaseWnd(self, lpvoid)
		if lpvoid ~= nil then
			return self.guiCast:Cast_GuiBaseWnd(lpvoid)
		end
	end
	
	-- 将一个基础的事件对象转换成合适的事件对象
	--@param baseWnd 基础的事件对象
	--@return 返回转换后的合适的事件对象或nil
	function CastEvent(self, baseEvent)
		if baseEvent ~= nil then
			if baseEvent.eEventType >= EET_GUI_EVENT_FIRST and baseEvent.eEventType <= EET_GUI_EVENT_LAST then
				return self.eventCast:Cast_SGuiEvent(baseEvent)
			elseif baseEvent.eEventType >= EET_MOUSE_EVENT_FIRST and baseEvent.eEventType <= EET_MOUSE_EVENT_LAST then
				return self.eventCast:Cast_SMouseInput(baseEvent)
			elseif baseEvent.eEventType >= EET_KEY_EVENT_FIRST and baseEvent.eEventType <= EET_KEY_EVENT_LAST then
				return self.eventCast:Cast_SKeyInput(baseEvent)
			elseif baseEvent.eEventType >= EET_LOG_EVENT_FIRST and baseEvent.eEventType <= EET_LOG_EVENT_LAST then
				return self.eventCast:Cast_SLogEvent(baseEvent)
			elseif baseEvent.eEventType >= EET_NET_EVENT_FIRST and baseEvent.eEventType <= EET_NET_EVENT_LAST then
				return self.eventCast:Cast_SNetEvent(baseEvent)
			end
		end
		return nil
	end
	
	-- 通知wndmanager当前的窗体可以被拖动
	function CanDrag(self)
		self.wndManager:CanDrag()
	end
	
	-- 通知wndmanager当前的被拖动的图片路径名
	function SetDragImage(self, imageName)
		self.wndManager:SetDragImage(imageName)
	end
	
	-- 获得Drop源的用户自定义数据字窜
	function GetDropUserData(self)
		local dropSrc = self.wndManager:GetDropSource()
		local dropStr = dropSrc:GetUserData()
		return loadstring("return " .. dropStr)() 
	end
	
	-- 设置Drop源的用户自定义数据
	--@param strUserData 用户自定义字窜
	function SetDropUserData(self, strUserData)
		local dropSrc = self.wndManager:GetDropSource()
		dropSrc:SetUserData(strUserData, string.len(strUserData))
	end
	
	-- 获得将移动Drop源的item的个数
	function GetDropMoveNumber(self)
		local dropSrc = self.wndManager:GetDropSource()
		return dropSrc:GetMoveNumber()
	end
	
	-- 设置将移动Drop源的item的个数
	--@param number item的个数
	function SetDropMoveNumber(self, number)
		local dropSrc = self.wndManager:GetDropSource()
		dropSrc:SetMoveNumber(number)
	end
	
	-- 获得Drop源的item的最大个数
	function GetDropMaxNumber(self)
		local dropSrc = self.wndManager:GetDropSource()
		return dropSrc:GetMaxNumber()
	end
	
	-- 设置Drop源的item的最大个数
	--@param maxnumber item的最大个数
	function SetDropMaxNumber(self, maxnumber)
		local dropSrc = self.wndManager:GetDropSource()
		dropSrc:SetMaxNumber(number)
	end
	
	-- 设置当前要显示的tooltip内容
	--@param tipText 显示的内容,多个tooltip可以使用<split/>进行分割
	function SetToolTipText(self, tipText)
		self.wndManager:SetToolTipInfo(HEX('04'), false, false, tipText)
	end
	
	-- 设置当前要显示的tooltip的属性
	--@param bdelay true表示延迟显示
	--@param bfollowCursor true表示跟随光标的位置
	function SetToolTipInfo(self, bdelay, bfollowCursor)
		self.wndManager:SetToolTipInfo(OR(HEX('01'),HEX('02')), bdelay, bfollowCursor, '')
	end
	
	-- 弹出一个消息框
	--@param strMsg 字符串的内容
	--@param strTitle 消息框的标题
	--@param flag 消息框的类型
		--EMBT_OK
		--EMBT_OKCANCEL
		--EMBT_ABORTRETRYIGNORE
		--EMBT_YESNOCANCEL
		--EMBT_YESNO
		--EMBT_RETRYCANCEL
		--EMBT_CLOSE
		--EMBT_NOBTN
		--EMBT_BTNMASK
		--EMBT_NOTITLE
	--@return 返回消息框的窗体对象
	function MessageBox(self, strMsg, strTitle, flag)
		local msg = self.wndManager:PopMessageBox(nil, strMsg, strTitle, flag)
		return self:CastGuiWnd(msg)
	end
	
	-- 弹出一个文件对话框
	--@param strDefaultDir 默认的文件路径
	--@param strTitle 对话框标题
	--@param flag 对话框类型
		--EFDT_OPEN
		--EFDT_SAVE
	--@return 返回对话框的窗体对象
	function FileDialog(self, strDefaultDir, strTitle, flag)
		local fdlg = self.wndManager:PopFileDialog(nil, strDefaultDir, strTitle, flag)
		return self:CastGuiWnd(fdlg)
	end
	
	-- 将一个基础dc转换成一个合适的dc对象
	--@param baseDC 基础的dc对象
	--@return 返回合适的dc对象或nil
	function CastDC(self, baseDC)
		if baseDC ~= nil then
			local typeName = baseDC:GetName()
			if typeName == 'cachedc' then
				return self.dcCast:Cast_CacheDC(baseDC)
			elseif typeName == 'scenedc' then
				return self.dcCast:Cast_SceneManager(baseDC)
			else
				return nil
			end
		end
		return nil
	end
	
	-- 将一个void指针转换成一个合适的接口对象对象
	--@param regkeyName 该接口对应注册的关键名字
	--@param voidInterface void接口对象
	--@return 返回合适的接口对象或nil
	function CastVoidToInterface(self, regkeyName, voidInterface )
		if regkeyName == 'ISceneManager' then
			return self.dcCast:Cast_VoidToSceneManager(voidInterface)
		else
			return nil
		end
	end
	
	-- 创建并初始化一个接口对象
	--@param szguid 该对象对应的guid字符串
	--@return 返回接口对象或nil
	function CreateAndInitInterface(self, szguid)
		return self.gameSys:CreateAndInitInterface(szguid)
	end
	
	-- 销毁一个接口对象
	--@param interface 要被销毁的接口对象
	function DestroyInterface(self, interface)
		return self.gameSys:DestroyInterface(interface)
	end
end

InitObj(GuiAssist)




