--*******************************************************************************
--  
--*******************************************************************************
PlayerFriendMgr = Class:extends({
	init = function(self, player)
		self.player = player
		self.buddySet = MapCppSet(player:getPersistVar().buddys, 'count', 'buddys', 'roleId', self:_getFriendMaxCount())
		self.applySet = MapCppSet(player:getPersistVar().buddys, 'applyCount', 'applyRoleIds', nil, MAX_BUDDYS_APPLY_CNT)
	end;
	
	isFullFriend = function(self)
		return self.buddySet:isFull()
	end;
	
	addFriend = function(self, roleId)
		if self.buddySet:has(roleId) then
			WUtil:sendWarningMsgArgs(self.player, 100045, '')
			return false
		end
		
		if not self.buddySet:insert({flag=0, roleId=roleId}) then
			return false
		end
		
		FriendSender:sendFriend(self.player, roleId)
		
		return true
	end;
	
	removeFriend = function(self, roleId)
		self.buddySet:remove(roleId)
		FriendSender:sendRemoveFriend(self.player, roleId)
	end;
	
	getFriendCount = function(self)
		return self.buddySet:getCount()
	end;
	
	getFriendByIdx = function(self, idx)  -- from 0, n-1
		return self.buddySet:get(idx)
	end;
	
	hasFriend = function(self, roleId)
		return self.buddySet:has(roleId)
	end;
	
	hasApply = function(self, roleId)
		return self.applySet:has(roleId)
	end;
	
	addApply = function(self, roleId)
		if self.applySet:has(roleId) then
			WUtil:sendWarningMsgArgs(self.player, 100047, '')
			return false
		end
		
		if not self.applySet:insert(roleId) then
			WUtil:sendWarningMsgArgs(self.player, 100048, '')
			return false
		end
		
		FriendSender:sendApply(self.player, roleId)
		
		return true
	end;
	
	getApplyCount = function(self)
		return self.applySet:getCount()
	end;
	
	getApplyByIdx = function(self, idx)  -- from 0, n-1
		return self.applySet:get(idx)
	end;
	
	removeApply = function(self, roleId)
		self.applySet:remove(roleId)
		FriendSender:sendRemoveApply(self.player, roleId)
	end;
	
	resetMaxFriendCount = function(self)
		self.buddySet:setMaxCount(self:_getFriendMaxCount())
	end;
	
	getMaxCount = function(self)
		return self.buddySet:getMaxCount()
	end;
	
	_getFriendMaxCount = function(self)
		return res_friend_base_cnt + self.player:getVipEffectVal(VIP_EFF.ADD_FRIEND_COUNT)
	end;
})

NullFriendMgr = Class:extends({
	addFriend = function(self, roleId)
		return true
	end;
	
	removeFriend = function(self, roleId)
	end;
	
	getFriendCount = function(self)
		return 0
	end;
	
	getFriendByIdx = function(self, idx)  -- from 0, n-1
		return nil
	end;
	
	hasFriend = function(self, roleId)
		return false
	end;
	
	addApply = function(self, roleId)
	end;
	
	getApplyCount = function(self)
		return 0
	end;
	
	getApplyByIdx = function(self, idx)
		return nil
	end;
	
	removeApply = function(self, roleId)
	end;
}):new()


