HeartBeatHandler = Class:extends({
	OnRequest = function(self, player, netevt, cmdtb)
		local curtime = Util:getTime()
		local diff = math.abs(cmdtb.svrtime - curtime);
		if diff > 2 then
			local sendmsg = '{cmd:'..NETCMD.HEARTBEAT..',svrtime:'..curtime..'}'
			player:sendMsg(sendmsg)
		end
	end;
})



