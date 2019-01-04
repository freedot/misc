MAIL_RET = {
	OK = 0,
	NOMAIL = -1,
	DELETEHASITEMS = -2,
}

MailMgr = Class:extends({
	init = function(self, gapp)
		self.gapp = gapp
	end;
	
	getMailCount = function(self, receiver)
		self.mails = {}
		
		local dbConn = self.gapp:getDBConn()
		local selectSql = 'select mailId, receiver, sender, isSys, isRead, title, tempId, addTime, itemCount '
		selectSql = selectSql .. "from mails where receiver='"..receiver.."';"
		local dbRows = dbConn:query(selectSql)
		if dbRows == nil then 
			return table.getn(self.mails)
		end
		
		local rowCount = dbRows:getRowCount()
		for i=1, rowCount, 1 do
			local dbRow = dbRows:getCurRow()
			
			local mail = self:_makeMail(dbRow:getFieldVal('mailId')
				,dbRow:getFieldVal('sender')
				,dbRow:getFieldVal('receiver')
				,dbRow:getFieldVal('isSys')
				,dbRow:getFieldVal('isRead')
				,dbRow:getFieldVal('title')
				,dbRow:getFieldVal('tempId')
				,'' -- bcontent
				,dbRow:getFieldVal('addTime')
				,dbRow:getFieldVal('itemCount')
				,'{}'
				)
			table.insert(self.mails, mail)
			
			dbRows:nextRow()
		end
		
		return table.getn(self.mails)
	end;
	
	getBriefMailByIdx = function(self, idx) -- from 1 to n
		return self.mails[idx]
	end;
	
	getMailById = function(self, mailId)
		local dbConn = self.gapp:getDBConn()
		local selectSql = "select * from mails where mailId="..mailId..";"
		local dbRows = dbConn:query(selectSql)
		if dbRows == nil or dbRows:getRowCount() == 0 then 
			return nil
		end
		
		local dbRow = dbRows:getCurRow()
		local mail = self:_makeMail(dbRow:getFieldVal('mailId')
			,dbRow:getFieldVal('sender')
			,dbRow:getFieldVal('receiver')
			,dbRow:getFieldVal('isSys')
			,dbRow:getFieldVal('isRead')
			,dbRow:getFieldVal('title')
			,dbRow:getFieldVal('tempId')
			,dbRow:getFieldVal('bcontent')
			,dbRow:getFieldVal('addTime')
			,dbRow:getFieldVal('itemCount')
			,dbRow:getFieldVal('bpkg') )
		return mail
	end;
	
	addPlayerMail = function(self, sender, receiver, title, content)
		self:_removeOverdueMail(receiver)
		return self:_addPlayerMail(sender, receiver, title, content)
	end;	
	
	addSysMail = function(self, receiver, title, tempId, content, addItems)
		self:_removeOverdueMail(receiver)
		return self:_addSysMail(receiver, title, tempId, content, addItems)
	end;
	
	setReaded = function(self, mailId)
		local updateSql = "update mails set isRead=1 where mailId="..mailId..";"
		self.gapp:getDBConn():exec(updateSql)
	end;
	
	deleteMail = function(self, receiver, mailId)
		local selectSql = "select itemCount from mails where mailId="..mailId..";"
		local dbRows = self.gapp:getDBConn():query(selectSql)
		if dbRows == nil or dbRows:getRowCount() == 0 then 
			return MAIL_RET.NOMAIL
		end
		
		local dbRow = dbRows:getCurRow()
		if dbRow:getFieldVal('itemCount') > 0 then
			return MAIL_RET.DELETEHASITEMS
		end
		
		local deleteSql = "delete from mails where receiver='" .. receiver .. "' and mailId="..mailId..";"
		self.gapp:getDBConn():exec(deleteSql)
		
		return MAIL_RET.OK
	end;
	
	clearItems = function(self, receiver, mail)
		mail:clearItems()
		local updataSql = "update mails set itemCount=0, bpkg='{}' where receiver='" .. receiver .. "' and mailId=" .. mail:getId() .. ";"
		self.gapp:getDBConn():exec(updataSql)
	end;

	_removeOverdueMail = function(self, receiver)
		local removeSql = "delete from mails where receiver='"..receiver.."' and itemCount=0 and addTime<"..(Util:getTime() - res_mail_timeout_s)..";"
		self.gapp:getDBConn():exec(removeSql)
	end;
	
	_addPlayerMail = function(self, sender, receiver, title, content)
		local mail = self:_makeMail(UUIDMgr:newMailId(), 
			sender, receiver, 0, 0, title, 0, content, Util:getTime(), 0)
		self:_insertMailToDB(mail)
		return mail
	end;
	
	_addSysMail = function(self, receiver, title, tempId, content, addItems)
		local mail = self:_makeMail(UUIDMgr:newMailId(), 
			'', receiver, 1, 0, title, tempId, content, Util:getTime(), 0)
		self:_addItems(mail, addItems)
		self:_insertMailToDB(mail)
		return mail
	end;
	
	_makeMail = function(self, id, sender, receiver, sysFlag, readFlag, title, tempId, content, addTime, itemCount, pkg)
		local mail = Mail()
		mail:setId(id)
		mail:setReceiver(receiver)
		mail:setSender(sender)
		mail:setSysFlag(sysFlag)
		mail:setReadFlag(readFlag)
		mail:setTitle(title)
		mail:setTempId(tempId)
		mail:setContent(content)
		mail:setTime(addTime)
		mail:setHasItem(itemCount>0)
		
		if itemCount == 0 then
			return mail
		end
		
		local resItems = eval(pkg)
		if #resItems == 0 then
			return mail
		end
		
		local resItems = eval(pkg)
		for i=1, itemCount, 1 do
			local resItem = resItems[i]
			if resItem.isRaw == 1 then
				mail:addItem( RawItemEx(resItem) )
			else
				mail:addItem( LuaItemEx(resItem) )
			end
		end
		
		return mail
	end;
	
	_addItems = function(self, mail, addItems)
		if addItems == nil then
			return
		end
		
		for _, item in ipairs(addItems) do
			mail:addItem(item)
		end
	end;
	
	_insertMailToDB = function(self, mail)
		local value = "'" .. mail:getId() .. "'"
		value = value..",'" .. mail:getReceiver() .. "'"
		value = value..",'" .. mail:getSender() .. "'"
		value = value..",'" .. mail:isSys() .. "'"
		value = value..",'" .. mail:isRead() .. "'"
		value = value..",'" .. self.gapp:getDBConn():escape( mail:getTitle() ) .. "'"
		value = value..",'" .. mail:getTempId() .. "'"
		value = value..",'" .. self.gapp:getDBConn():escape( mail:getContent() ) .. "'"
		value = value..",'" .. mail:getItemCount() .. "'"
		value = value..",'" .. self.gapp:getDBConn():escape( mail:itemsToString() ) .. "'"
		value = value..",'" .. mail:getTime() .. "'"
		local insertSQL = "insert into mails values(" .. value .. ");"
		self.gapp:getDBConn():exec(insertSQL)
	end;
})



