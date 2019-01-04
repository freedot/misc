MakeHandler = Class:extends({
	OnRequest = function(self, player, netevt, cmdtb)
		local sendmsg = ''
		if cmdtb.subcmd == 1 then
			-- 宝石镶嵌
			local sendmsg = '{cmd:'..NETCMD.PKG..',items:{arm:['
			sendmsg = sendmsg..'{id:2,resid:5000001,number:210,gpos:1,isbind:1,gems:['
			sendmsg = sendmsg..'{resid:5000001},{resid:5000001},{resid:5000001}'
			sendmsg = sendmsg..']}'
			sendmsg = sendmsg..']}}'
			player:sendMsg(sendmsg)
			
			--通知 宝石镶嵌 成功
			sendmsg = '{cmd:'..NETCMD.MAKE..',beset:{result:0,gemidx:2}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 2 then
			-- 宝石摘取
			local sendmsg = '{cmd:'..NETCMD.PKG..',items:{arm:['
			sendmsg = sendmsg..'{id:2,resid:5000001,number:210,gpos:1,isbind:1,gems:['
			sendmsg = sendmsg..'{resid:5000001},{resid:0},{resid:5000001}'
			sendmsg = sendmsg..']}'
			sendmsg = sendmsg..']}}'
			player:sendMsg(sendmsg)
			
			--通知 宝石摘取 成功
			sendmsg = '{cmd:'..NETCMD.MAKE..',pulldown:{result:0,gemidx:1}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 3 then
			-- 宝石合成
			
			--通知 宝石合成 成功
			local sendmsg = '{cmd:'..NETCMD.MAKE..',compose:{result:0}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 4 then
			-- 装备强化
			local sendmsg = '{cmd:'..NETCMD.PKG..',items:{arm:['
			sendmsg = sendmsg..'{id:2,resid:5000001,number:210,gpos:1,isbind:1,ilevel:1}'
			sendmsg = sendmsg..']}}'
			player:sendMsg(sendmsg)
			
			--通知 装备强化 成功
			sendmsg = '{cmd:'..NETCMD.MAKE..',intensify:{result:0}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 5 then
			-- 装备分解
			
			--通知 装备分解 成功
			local sendmsg = '{cmd:'..NETCMD.MAKE..',resolve:{result:0}}'
			player:sendMsg(sendmsg)
		end
	end;
})


