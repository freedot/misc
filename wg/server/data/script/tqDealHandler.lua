DealHandler = Class:extends({
	OnRequest = function(self, player, netevt, cmdtb)
		if cmdtb.subcmd == 1 then
			-- 出售道具
		elseif cmdtb.subcmd == 2 then
			-- 拉取我已经上架的物品
			local sendmsg = '{cmd:'..NETCMD.DEAL..',dealitems:['
			sendmsg = sendmsg..'{id:1,resid:2000003,number:20,buyprice:10}'
			sendmsg = sendmsg..',{id:2,resid:2000003,number:20,buyprice:20}'
			sendmsg = sendmsg..',{id:3,resid:2000003,number:20,buyprice:30}'
			sendmsg = sendmsg..']}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 3 then
			-- 摊位下架
			-- 加到pkg中
			--- 判断pkg是否已满
			
			-- 摊位下架
			local sendmsg = '{cmd:'..NETCMD.DEAL..',dealitems:['
			sendmsg = sendmsg..'{id:1,resid:2000003,number:20,buyprice:10}'
			sendmsg = sendmsg..',{id:3,resid:2000003,number:20,buyprice:20}'
			sendmsg = sendmsg..']}'
			player:sendMsg(sendmsg)
			
		elseif cmdtb.subcmd == 4 then
			-- 摊位上架
			local sendmsg = '{cmd:'..NETCMD.DEAL..',dealitems:['
			sendmsg = sendmsg..'{id:1,resid:2000003,number:20,buyprice:10}'
			sendmsg = sendmsg..',{id:2,resid:2000003,number:20,buyprice:20}'
			sendmsg = sendmsg..',{id:3,resid:2000003,number:20,buyprice:30}'
			sendmsg = sendmsg..',{id:5,resid:2000003,number:'..cmdtb.number..',buyprice:'..cmdtb.price..'}'
			sendmsg = sendmsg..']}'
			player:sendMsg(sendmsg)
			-- 从pkg中移除
		elseif cmdtb.subcmd == 5 then
			-- 拉取商店列表
			local sendmsg = '{cmd:'..NETCMD.DEAL..',shopslist:{pagecnt:30,list:['
			sendmsg = sendmsg..'{id:1,name:"xxx的小店",rolename:"xxx1",cnt:12}'
			sendmsg = sendmsg..',{id:2,name:"xxx的小店",rolename:"xxx2",cnt:12}'
			sendmsg = sendmsg..',{id:3,name:"xxx的小店",rolename:"xxx3",cnt:12}'
			sendmsg = sendmsg..',{id:4,name:"xxx的小店",rolename:"xxx4",cnt:12}'
			sendmsg = sendmsg..',{id:5,name:"xxx的小店",rolename:"xxx5",cnt:12}'
			sendmsg = sendmsg..',{id:6,name:"xxx的小店",rolename:"xxx6",cnt:12}'
			sendmsg = sendmsg..']}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 6 then
			-- 拉取当前玩家已经上架的物品
			local sendmsg = '{cmd:'..NETCMD.DEAL..',shopitems:['
			sendmsg = sendmsg..'{id:1,resid:2000003,number:20,buyprice:10}'
			sendmsg = sendmsg..',{id:2,resid:2000003,number:20,buyprice:20}'
			sendmsg = sendmsg..',{id:3,resid:2000003,number:20,buyprice:30}'
			sendmsg = sendmsg..']}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 7 then
			-- 购买小店种的某件道具，不能购买自己的
			-- 给买者东西
			-- 扣除卖者东西
		elseif cmdtb.subcmd == 8 then
			-- 查找商店名称
			local sendmsg = '{cmd:'..NETCMD.DEAL..',shopslist:{pagecnt:30,pageidx:3,selidx:2,list:['
			sendmsg = sendmsg..'{id:1,name:"xxx的小店",rolename:"xxx1",cnt:12}'
			sendmsg = sendmsg..',{id:2,name:"xxx的小店",rolename:"xxx2",cnt:12}'
			sendmsg = sendmsg..',{id:3,name:"xxx的小店",rolename:"xxx3",cnt:12}'
			sendmsg = sendmsg..',{id:4,name:"xxx的小店",rolename:"xxx4",cnt:12}'
			sendmsg = sendmsg..',{id:5,name:"xxx的小店",rolename:"xxx5",cnt:12}'
			sendmsg = sendmsg..',{id:6,name:"xxx的小店",rolename:"xxx6",cnt:12}'
			sendmsg = sendmsg..']}}'
			player:sendMsg(sendmsg)
		end
	end;
})



