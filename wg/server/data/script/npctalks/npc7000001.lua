RES_NPCTALKS.n7000001={
	onBeset = function(player)
		local sendmsg = '{cmd:'..NETCMD.MAKE..',maketype:0}'
		player:sendMsg(sendmsg)
	end,
	
	onCompose = function(player)
		local sendmsg = '{cmd:'..NETCMD.MAKE..',maketype:1}'
		player:sendMsg(sendmsg)
	end,
	
	onIntensify = function(player)
		local sendmsg = '{cmd:'..NETCMD.MAKE..',maketype:2}'
		player:sendMsg(sendmsg)
	end,
	
	onResolve = function(player)
		local sendmsg = '{cmd:'..NETCMD.MAKE..',maketype:3}'
		player:sendMsg(sendmsg)
	end,
	
	onCreateShop = function(player, poscnt)
		local sendmsg = '{cmd:'..NETCMD.DEAL..',manageshop:1,poscnt:'..poscnt..'}'
		player:sendMsg( sendmsg)
	end,
	
	onCreateShop06 = function(player)
		RES_NPCTALKS.n7000001:onCreateShop(player, 6)
	end,
	
	onCreateShop12 = function(player)
		RES_NPCTALKS.n7000001:onCreateShop(player, 12)
	end,
	
	onCreateShop21 = function(player)
		RES_NPCTALKS.n7000001:onCreateShop(player, 21)
	end,
	
	onDestoryShop = function(player)
		-- 当月的租金的返回
	end,
	
	onSeeShop = function(player)
		local sendmsg = '{cmd:'..NETCMD.DEAL..',showshops:1}'
		player:sendMsg(sendmsg)
	end
}

RES_NPCTALKS.n7000001.nodes={
	{--node1
		npcid=7000001,
		say="我是制造师",
		ops={
			{
				s="镶嵌",script=RES_NPCTALKS.n7000001.onBeset,
			},
			{
				s="合成",script=RES_NPCTALKS.n7000001.onCompose,
			},
			{
				s="强化",script=RES_NPCTALKS.n7000001.onIntensify,
			},
			{
				s="分解",script=RES_NPCTALKS.n7000001.onResolve,
			},
			{
				s="6 展位店，每月租金60",script=RES_NPCTALKS.n7000001.onCreateShop06,
			},
			{
				s="12展位店，每月租金120",script=RES_NPCTALKS.n7000001.onCreateShop12,
			},
			{
				s="21展位店，每月租金210",script=RES_NPCTALKS.n7000001.onCreateShop21,
			},
			{
				s="注销店面",script=RES_NPCTALKS.n7000001.onDestoryShop,
			},
			{
				s="我要逛店",script=RES_NPCTALKS.n7000001.onSeeShop,
			},
			{
				s="退出"
			},
		}
	}
}


