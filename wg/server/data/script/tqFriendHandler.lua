FriendHandler = BaseCmdHandler:extends({
	regHandlers = function(self)
		self.handlers[1] = GetFriendsHandler()
		self.handlers[2] = ApplyFriendHandler()
		self.handlers[3] = AgreeApplyFriendHandler()
		self.handlers[4] = RejectApplyFriendHandler()
		self.handlers[5] = DeleteFriendHandler()
		self.handlers[6] = FriendChatHandler()
	end;
})

GetFriendsHandler = Class:extends({
	handle = function(self, player)
		FriendSender:sendAllFriends(player)
		FriendSender:sendAllApplys(player)
	end;
})

ApplyFriendHandler = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then
			return false
		end
		
		self.target:getFriendMgr():addApply(self.player:getRoleId())
		
		return true
	end;
	
	_initParam = function(self, player, cmdtb)
		local roleName = Util:getString(cmdtb, 'name')
		local grid = app:getCityMgr():getGridByRoleName(roleName)
		if grid == nil then
			WUtil:sendWarningMsgArgs(player, 100050, '')
			return false
		end
		
		if grid.roleName == player:getRoleName() then -- if target is self, return
			return false
		end
		
		self.target = ArmyPlayerGetter:getPlayer(OBJ_TYPE.ROLE, grid.roleId)
		self.player = player
		
		return true
	end;
})

AgreeApplyFriendHandler = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then
			return false
		end
		
		if self.player:getFriendMgr():isFullFriend() then
			WUtil:sendWarningMsgArgs(self.player, 100046, '')
			return false
		end
		
		if self.applicant:getFriendMgr():isFullFriend() then
			WUtil:sendWarningMsgArgs(self.player, 100049, '')
			return false
		end
		
		self.player:getFriendMgr():removeApply(self.applicant:getRoleId())
		self.player:getFriendMgr():addFriend(self.applicant:getRoleId())
		self.applicant:getFriendMgr():addFriend(self.player:getRoleId())
	
		return true
	end;
	
	_initParam = function(self, player, cmdtb)
		local roleId = Util:getNumber(cmdtb, 'id')
		
		if not player:getFriendMgr():hasApply(roleId) then
			return false
		end
		
		local grid = app:getCityMgr():getGridByRoleId(roleId)
		if (grid == nil) or (grid.objType ~= OBJ_TYPE.ROLE) then
			WUtil:sendWarningMsgArgs(player, 100050, '')
			return false
		end
		
		self.applicant = ArmyPlayerGetter:getPlayer(OBJ_TYPE.ROLE, roleId)
		self.player = player
		
		return true
	end;
})

RejectApplyFriendHandler = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then
			return false
		end
		
		self.player:getFriendMgr():removeApply(self.roleId)
		
		return true
	end;
	
	_initParam = function(self, player, cmdtb)
		local roleId = Util:getNumber(cmdtb, 'id')
		
		if not player:getFriendMgr():hasApply(roleId) then
			return false
		end
		
		self.roleId = roleId
		self.player = player
		
		return true
	end;	
})

DeleteFriendHandler = Class:extends({
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then
			return false
		end
		
		self.player:getFriendMgr():removeFriend(self.friendRoleId)
		self.friend:getFriendMgr():removeFriend(self.player:getRoleId())
		
		return true
	end;
	
	_initParam = function(self, player, cmdtb)
		local roleId = Util:getNumber(cmdtb, 'id')
		
		if not player:getFriendMgr():hasFriend(roleId) then
			return false
		end
		
		self.friendRoleId = roleId
		self.player = player
		self.friend = ArmyPlayerGetter:getPlayer(OBJ_TYPE.ROLE, roleId)
		
		return true
	end;
})

FriendChatHandler = Class:extends({
	init = function(self)
		self.MSG_MAX_LEN = 256*3
	end;
	
	handle = function(self, player, cmdtb)
		if not self:_initParam(player, cmdtb) then
			return false
		end
		
		FriendSender:sendFriendChat(self.friend, self.player:getRoleId(), self.player:getRoleName(), self.msg)
		
		return true
	end;
	
	_initParam = function(self, player, cmdtb)
		local roleId = Util:getNumber(cmdtb, 'id')
		local grid = app:getCityMgr():getGridByRoleId(roleId)
		if grid == nil then
			return false
		end
		
		local friend = app:getPlayerMgr():getPlayerByName(grid.userName)
		if friend == nil then
			return false
		end
		
		local msg = Util:getString(cmdtb, 'msg')
		if not self:_isValidMsg(msg) then
			WUtil:sendWarningMsgArgs(player, 100060, '')
			return false
		end
		
		self.friend = friend
		self.player = player
		self.msg = msg
		
		return true
	end;
	
	_isValidMsg = function(self, msg)
		local msgLen = string.len(msg)
		return (msgLen > 0) and (msgLen <= self.MSG_MAX_LEN)
	end;
})

