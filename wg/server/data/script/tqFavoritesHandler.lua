FavoritesHandler = Class:extends({
	OnRequest = function(self, player, netevt, cmdtb)
		local sendmsg = ''
		if cmdtb.subcmd == 1 then
			-- 拉取所有收藏列表
		elseif cmdtb.subcmd == 2 then
			-- 添加一个地图块到收藏列表
		elseif cmdtb.subcmd == 3 then
			-- 删除指定的一个收藏列表
			sendmsg = 'L{cmd='..NETCMD.CITYRES..', favorites={{id=0,name="xxx1",pos={230,230},},'
			sendmsg = sendmsg..'{id=1,name="ddd2",pos={230,230},},'
			sendmsg = sendmsg..'{id=2,name="ttt3",pos={230,230},},'
			sendmsg = sendmsg..'{id=3,name="rrr4",pos={230,230},},'
			sendmsg = sendmsg..'{id=4,name="sss5",pos={230,230},},'
			sendmsg = sendmsg..'{id=5,name="ddd6",pos={230,230},},'
			sendmsg = sendmsg..'{id=6,name="ccc7",pos={230,230},},'
			sendmsg = sendmsg..'}}'
			player:SendMsg(sendmsg)
		end
	end
})



