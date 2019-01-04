--*******************************************************************************
CDKeyHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = SendCDKeyHandler()
	end;
})

CDKeyDB = Class:extends({
	init = function(self, gapp)
		self._gapp = gapp
		self._conn = self._gapp:getDBConn()
	end;
	
	getCDKey = function(self, cdkey)
		local dbRows = self._conn:query(string.format("select * from cdkey where cdkey='%s';", cdkey))
		if dbRows == nil then return nil end
		if dbRows:getRowCount() == 0 then return nil end
		
		local dbRow = dbRows:getCurRow()
		local ty = dbRow:getFieldVal('type')
		local resid = dbRow:getFieldVal('resid')
		local number = dbRow:getFieldVal('number')
		local createTime = dbRow:getFieldVal('createTime')
		local isUsed = dbRow:getFieldVal('isUsed')
		return {resid=resid, ty=ty, number=number, createTime=createTime, isUsed=isUsed}
	end;
	
	setUsed = function(self, cdkey)
		local s = string.format("update cdkey set isUsed=1 where cdkey='%s'", cdkey)
		self._conn:exec(s)
	end;
})

SendCDKeyHandler = Class:extends({
	init = function(self)
		self._dropItem = DropItem()
		self._mapper = nil
		self._node = nil
	end;
	
	handle = function(self, player, cmdtb)
		if not ServerOnlineToggleChecker:isCanDo('cdkey') then
			WUtil:sendWarningMsgArgs(player, 100181, '' )
			return false
		end
		
		local cdkey = Util:getString(cmdtb, 'cdkey')
		local ret, tipid = self:_isValidCdKey(player, cdkey)
		if not ret then
			WUtil:sendWarningMsgArgs(player, tipid, '' )
			return false
		end
		
		self._mapper:setUsed(cdkey)
		self:_sendItemMail(player, self._node)
		player:getCdKeys():insert(self._node.ty)
		WUtil:sendSuccMsgArgs(player, tipid, '' )
		return true
	end;
	
	_isValidCdKey = function(self, player, cdkey)
		if cdkey == '' or string.len(cdkey) ~= 20 then
			-- error cdkey
			return false, 100183
		end
		
		if string.match(cdkey, "[^0-9A-F]") ~= nil then
			-- error cdkey
			return false, 100183
		end
		
		self:_delayCreateMapper()
		local node = self._mapper:getCDKey(cdkey)
		if node == nil then
			-- error cdkey
			return false, 100183
		end
		
		if node.isUsed == 1 then
			-- be used
			return false, 100184
		end
		
		if Util:getTime() > node.createTime + 30*24*3600 then
			-- 过期
			return false, 100185
		end
		
		if player:getCdKeys():has(node.ty) then
			-- 已经领取
			return false, 100186
		end
		
		self._node = node
		return true, 100182
	end;
	
	_delayCreateMapper = function(self)
		if self._mapper == nil then
			self._mapper = CDKeyDB(app)
		end
	end;
	
	_sendItemMail = function(self, player, node)
		local rawItems = self._dropItem:createRawItems({{resid=node.resid, number=node.number}})
		local mail = app:getMailMgr():addSysMail(player:getRoleName(), rstr.mail.title.cdkey, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.cdkey, rawItems)
		MailSender:sendBriefMail(player, mail)
	end;
})

