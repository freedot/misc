require('com.tqBaseClass') 

local DesktopAccelTable=
{
	--重新载入lua脚本资源(ctrl+r)
	{ctrl=true, shift=false, alt=false, key1=VKEY_R, key2=0, key3=0, cmdid=1000, }, 
	
	--重新载入guixml的配置(ctrl+g)
	{ctrl=true, shift=false, alt=false, key1=VKEY_G, key2=0, key3=0, cmdid=1001, },
}

class Desktop
	-- 初始化
	function Init(self)
		self.wndManager = rinit(self.wndManager, GetWndManager())
		self.eventCast = rinit(self.eventCast, EventCast())
		self.__created = rinit(self.__created, false)
		self.__backAccels = rinit(self.__backAccels, {})
		
		-- 该入口只有窗体被创建以后才会被调用
		if self.__created == true then
			self:RegisterEvent()
			self:RegisterAccel()
		end
	end
	
	-- 创建该窗体-等同于普通窗口的CreateWnd
	function Attach(self, innerWnd)
		self = InheritFromC(self, innerWnd)
		self:RegisterAccel()
		self:RegisterEvent()
		self.__created = true
	end
	
	-- 注册快捷键
	function RegisterAccel(self)
		self:ClearAccelAll()
		for i = 1, table.getn(DesktopAccelTable), 1 do
			local ares = DesktopAccelTable[i]
			local accel = SGuiAccelTable(ares.ctrl,ares.shift,ares.alt,ares.key1,ares.key2,ares.key3,ares.cmdid)
			self:AppendAccel(accel)
		end
	end
	
	-- 添加一个快捷键表
	function AppendAccel(self, accel)
		table.insert(self.__backAccels, {accel=accel, keywnd=self})
		self:AppendAcceleratorTable(accel)
	end
	
	-- 清空上次的快捷键表
	function ClearAccelAll(self)
		local delIdxs = {}
		for i, v in ipairs(self.__backAccels) do
			if v.keywnd == self then
				self:RemoveAcceleratorTable(v.accel)
				table.insert(delIdxs, i)
			end
		end
		
		-- 从后往前删
		local cnt = table.getn(delIdxs)
		for i=cnt, 1, -1 do
			table.remove(self.__backAccels, delIdxs[i])
		end
	end
	
	-- 注册事件回调
	function RegisterEvent(self)
		self:UnRegisterAll()
		self:EvtRegister(self, EET_COMMAND, 1000, 2000, self.OnCommand)
	end
	
	-- 快捷命令处理
	function OnCommand(self, event)
		if event.lId == 1000 then
			self:Reload()
		elseif event.lId == 1001 then
			self:ReLoadGuiXml()
		end
	end
	
	-- 重新载入脚本资源
	function Reload(self)
		package.loaded['tqReload'] = nil
		require('tqReload')
		ReloadCodes()
		print('reload lua res ok!')
	end
	
	-- 重新载入guixml资源
	function ReLoadGuiXml(self) 
		package.loaded['tqReloadGuiXml'] = nil
		require('tqReloadGuiXml')
		ReloadGuiXml()
		print('reload lua gui xml res ok!')	
	end
	
	--向当前窗体注册一个事件
	function EvtRegister(self, wnd, eventid, fromid, toid, fun)
		local handle = WndEvtRegister(wnd, eventid, fromid, toid, self, fun)
		if self.__evtreg == nil then
			self.__evtreg = {}
		end
		 
		if handle ~= nil then
			table.insert(self.__evtreg, {keywnd=self, handle=handle, basewnd=wnd})
		end
	end
	
	--从当前窗体注销一个事件
	function EvtUnRegister(self, basewnd, handle)
		if handle ~= nil and basewnd ~= nil then
			WndEvtUnRegister(basewnd, handle)
		end
	end
	
	--将当前窗体所有事件注销
	function UnRegisterAll(self)
		if self.__evtreg ~= nil then
			local delIdxs = {}
			for i, v in ipairs(self.__evtreg) do
				if v.keywnd == self then
					self:EvtUnRegister(v.basewnd, v.handle)
					table.insert(delIdxs, i)
				end
			end
			
			-- 从后往前删
			local cnt = table.getn(delIdxs)
			for i=cnt, 1, -1 do
				table.remove(self.__evtreg, delIdxs[i])
			end
		end
	end
end

InitObj(Desktop)

