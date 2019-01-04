--*******************************************************************************
--*******************************************************************************
MailHandler = Class:extends({
	init = function(self)
	end;
	
	onRequest = function(self, player, netevt, cmdtb)
		if cmdtb.subcmd == 1 then
			MailSender:sendAllBriefMails( player )
		elseif cmdtb.subcmd == 2 then
			local mailId = Util:getNumber(cmdtb, 'id')
			app:getMailMgr():setReaded(mailId)
			MailSender:sendMail( player, mailId )
		elseif cmdtb.subcmd == 3 then
			MailSendHandler:handle(player, cmdtb)
		elseif cmdtb.subcmd == 4 then
			MailDeleteHandler:handle(player, cmdtb)
		elseif cmdtb.subcmd == 5 then
			MailGetItemsHandler:handle(player, cmdtb)
		end
	end;
})

MailSendHandler = Class:extends({
	handle = function(self, player, cmd)
		if not self:_initParams(player, cmd) then
			return
		end
		
		if not self:_getToPlayer() then
			return
		end
		
		if self:_targetIsSelf() then
			WUtil:sendWarningMsgArgs(player, 100166, '')
			return
		end
		
		if self.toPlayer:isDied() then
			WUtil:sendWarningMsgArgs(player, 100169, '')
			return
		end
		
		local mail = app:getMailMgr():addPlayerMail(self.fromPlayer:getRoleName(), self.toPlayer:getRoleName(), self.title, self.msg )
		MailSender:sendBriefMail(self.toPlayer, mail)
	end;
	
	_initParams = function(self, player, cmd)
		self.fromPlayer = player
		
		self.to = Util:getString(cmd, 'to')
		if not ValidChecker:isRoleName(self.to) then
			return false
		end
		
		self.title = Util:getString(cmd, 'title')
		if not ValidChecker:isMailTitle(self.title) then
			return false
		end
		
		self.msg = Util:getString(cmd, 'msg')
		if not ValidChecker:isMailMsg(self.msg) then
			return false
		end
		
		return true
	end;
	
	_getToPlayer = function(self)
		local grid = app:getCityMgr():getGridByRoleName(self.to)
		if grid == nil then 
			return false 
		end
			
		self.toPlayer = app:getPlayerMgr():getOrLoadPlayerByUserName(grid.objType, grid.userName)
		return self.toPlayer ~= nil
	end;
	
	_targetIsSelf = function(self)
		return self.fromPlayer == self.toPlayer
	end;
}):new();

MailDeleteHandler = Class:extends({
	handle = function(self, player, cmd)
		if not self:_initParams(player, cmd) then
			return
		end
		
		self:_deleteMails()
	end;
	
	_initParams = function(self, player, cmd)
		self.player = player
		local count = Util:getNumber(cmd, 'cnt')
		if count == 0 then
			return  false
		end
		
		self.ids = {}
		for i=1, count, 1 do
			table.insert(self.ids, Util:getNumber(cmd, 'id'..i) )
		end
		
		return true
	end;
	
	_deleteMails = function(self)
		local hasItems = false
		for _, id in ipairs(self.ids) do
			if app:getMailMgr():deleteMail(self.player:getRoleName(), id) == MAIL_RET.DELETEHASITEMS then 
				hasItems = true
			else
				MailSender:sendDelMail(self.player, id)
			end
		end
		
		if hasItems then
			WUtil:sendWarningMsgArgs(self.player, 100016, '') --  has item mail
		end
	end;
}):new();

MailGetItemsHandler = Class:extends({
	handle = function(self, player, cmd)
		if not self:_initParams(player, cmd) then
			return
		end
		
		if not self.player:getPkg():addItems( self.mail:getItems() ) then
			WUtil:sendWarningMsgArgs(self.player, 100017, '')
			return
		end
		
		self:_clearMailPkgItems()
	end;
	
	_initParams = function(self, player, cmd)
		self.player = player
		local mailId = Util:getNumber(cmd, 'id')
		if mailId == 0 then
			return  false
		end
		
		self.mail = app:getMailMgr():getMailById(mailId)
		if self.mail == nil then
			return false
		end
		
		if self.mail:getItemCount() == 0 then
			return false
		end
		
		return true
	end;
	
	_clearMailPkgItems = function(self)
		app:getMailMgr():clearItems(self.player:getRoleName(), self.mail )
		MailSender:sendMailClearItem( self.player, self.mail:getId() )
	end;
}):new();


