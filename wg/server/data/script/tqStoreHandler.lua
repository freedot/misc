StoreHandler = Class:extends({
	OnRequest = function(self, player, netevt, cmdtb)
		local sendmsg = ''
		if cmdtb.subcmd == 1 then
			--拉去当前的资源保护分配列表
			local sendmsg = '{cmd:'..NETCMD.STORE..',assign:[20,25,25,30]}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 2 then
			--保存资源保护分配列表
		end
	end;
})



