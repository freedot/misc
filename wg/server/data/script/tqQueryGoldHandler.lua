--*******************************************************************************
QueryGoldHandler = Class:extends({
	onRequest = function(self, none, nevt, cmdtb)
		local ret = Util:getNumber(cmdtb, 'ret')
		if ret ~= 0 then
			return
		end
		
		local userName = Util:getString(cmdtb, 'openid')
		local player = app:getPlayerMgr():getPlayerByName(userName)
		if player == nil then
			return
		end
		
		local gold = Util:getNumber(cmdtb, 'gold')
		player:getPkg():setGold(gold)
		PkgMiscSender:send(player, {'gold'})
	end;
})



