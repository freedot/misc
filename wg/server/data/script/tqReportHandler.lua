ReportHandler = Class:extends({
	OnRequest = function(self, player, netevt, cmdtb)
		if cmdtb.subcmd == 1 then
			sendmsg = 'L{cmd='..NETCMD.REPORT..', reports={{id='..cmdtb.id..',flag='..cmdtb.flag..', read=true, detail={msg="d<br>d<br>d<br>d<br>d<br>dd<br>d<br>d<br>dd<br>d<br>d<br>d<br>d<br>d<br>d<br>d<br>d<br>d<br>",pmsg="1. bbbb<br>2. bbbb"}}}}'
			player:SendMsg(sendmsg)
		elseif cmdtb.subcmd == 2 then
			sendmsg = 'L{cmd='..NETCMD.REPORT..', reports={'
			for i, id in ipairs(cmdtb.list) do
				sendmsg = sendmsg..'{id='..id..', del=true},'
			end
			sendmsg = sendmsg..'}, }'
			player:SendMsg(sendmsg)
		end
	end;
})



