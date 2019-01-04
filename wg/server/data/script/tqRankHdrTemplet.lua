--*******************************************************************************
SearchRankHdrTemplet = Class:extends({
	init = function(self)
		self.pageItemCount_ = 12
	end;
	
	handle = function(self, player, cmdtb)
		local roleName = Util:getString(cmdtb, 'role')
		local idx = self:_getRankObj():getIdxByName(roleName)
		if idx < 0 then
			WUtil:sendWarningMsgArgs(player, 100163, '"' .. roleName .. '"')
			return false
		end
		
		local pageNo = math.floor(idx/self.pageItemCount_) + 1
		local curSelIdx = idx%self.pageItemCount_
		self:_sendRanks(player, pageNo, self.pageItemCount_, curSelIdx)
		return true
	end;
})

GetPageRankHdrTemplet = Class:extends({
	init = function(self)
		self.pageItemCount_ = 12
	end;
	
	handle = function(self, player, cmdtb)
		local pageNo = Util:getNumber(cmdtb, 'pageNo')
		local curSelIdx = Util:getNumber(cmdtb, 'curSelIdx', -1)
		self:_sendRanks(player, pageNo, self.pageItemCount_, curSelIdx)
	end;
})


