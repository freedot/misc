RankingHandler = Class:extends({
	OnRequest = function(self, player, netevt, cmdtb)
		local sendmsg = ''
		if cmdtb.subcmd == 1 then
			--拉取排名列表的个数
			sendmsg = '{cmd:'..NETCMD.RANKING..',ranking:{'
			sendmsg = sendmsg..'roles:{cnt:100}'
			sendmsg = sendmsg..',allis:{cnt:200}'
			sendmsg = sendmsg..'}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 2 then
			--拉取排名列表
			sendmsg = '{cmd:'..NETCMD.RANKING..',ranking:{'
			sendmsg = sendmsg..'roles:{list:['
			sendmsg = sendmsg..self:GetHeros(cmdtb.pidx)
			sendmsg = sendmsg..']}'
			sendmsg = sendmsg..',allis:{list:['
			sendmsg = sendmsg..self:GetAllis(cmdtb.pidx)
			sendmsg = sendmsg..']}'				
			sendmsg = sendmsg..'}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 3 then
			--我的排名
			sendmsg = '{cmd:'..NETCMD.RANKING..',ranking:{'
			sendmsg = sendmsg..'roles:{sel:4,pidx:20,list:['
			sendmsg = sendmsg..self:GetHeros(20)
			sendmsg = sendmsg..']}'
			sendmsg = sendmsg..',allis:{sel:2,pidx:3,list:['
			sendmsg = sendmsg..self:GetAllis(3)
			sendmsg = sendmsg..']}'			
			sendmsg = sendmsg..'}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 4 then
			--获取指定名称的排名
			sendmsg = '{cmd:'..NETCMD.RANKING..',ranking:{'
			sendmsg = sendmsg..'roles:{sel:6,pidx:10,list:['
			sendmsg = sendmsg..self:GetHeros(10)
			sendmsg = sendmsg..']}'
			sendmsg = sendmsg..',allis:{sel:2,pidx:3,list:['
			sendmsg = sendmsg..self:GetAllis(3)
			sendmsg = sendmsg..']}'
			sendmsg = sendmsg..'}}'
			player:sendMsg(sendmsg)
		end
	end;
	
	GetHeros = function(self, pidx)
		local idx = ((pidx-1)*10+1)
		local sendmsg = '{no:'..idx..',role:"xx'..idx..'",alli:"a'..idx..'",level:100,prestige:12000}'
		for i=2, 10, 1 do
			idx = ((pidx-1)*10+i)
			sendmsg = sendmsg..',{no:'..idx..',role:"xx'..idx..'",alli:"a'..idx..'",level:100,prestige:12000}'
		end
		return sendmsg;
	end;
	
	GetAllis = function(self, pidx)
		local idx = ((pidx-1)*10+1)
		local sendmsg = '{no:'..idx..',role:"xx'..idx..'",alli:"a'..idx..'",level:10,num:12,prestige:12000}'
		for i=2, 10, 1 do
			idx = ((pidx-1)*10+i)
			sendmsg = sendmsg..',{no:'..idx..',role:"xx'..idx..'",alli:"a'..idx..'",level:10,num:12,prestige:12000}'
		end
		return sendmsg;
	end;
})









