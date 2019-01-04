DefResHandler = Class:extends({
	OnRequest = function(self, player, netevt, cmdtb)
		if cmdtb.subcmd == 1 then
			-- 拉取整个城市防御
			local sendmsg = '{cmd:'..NETCMD.DEFRES..',defs:['
			sendmsg = sendmsg..'{id:1,resid:160001,number:300}'
			sendmsg = sendmsg..',{id:2,resid:160002,number:400}'
			sendmsg = sendmsg..',{id:3,resid:160003,number:500}'
			sendmsg = sendmsg..',{id:4,resid:160004,number:600}'
			sendmsg = sendmsg..',{id:5,resid:160005,number:700}'
			sendmsg = sendmsg..']}'
			player:sendMsg(sendmsg)
		end
	end;
})



