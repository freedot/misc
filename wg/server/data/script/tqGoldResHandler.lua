GoldResHandler = Class:extends({
	init = function(self)
	end;


	onRequest = function(self, player, netevt, cmdtb)
		if cmdtb.subcmd == 1 then
			self:sendPopuResMsg(player)
		elseif cmdtb.subcmd == 2 then
			self:modifyTaxRate(player, Util:getNumber(cmdtb, 'rate'))
			self:sendTaxRateMsg(player)
		end
	end;
	

	modifyTaxRate = function(self, player, newrate)
		player:getCity():getTax():set(newrate)
	end;
	

	sendTaxRateMsg = function(self, player)
		local city = player:getCity()
		city:getTax():sendMsg()
		city:sendBindMoneyMsg()
	end;
	

	sendPopuResMsg = function(self, player)
		self:sendMoraleMsg(player)
		self:sendGoldMsg(player)
		self:sendPopuMsg(player)
	end;
	
	sendMoraleMsg = function(self, player)
		local city = player:getCity()
		local sendmsg = '{cmd:'..NETCMD.GOLDRES..','
		sendmsg = sendmsg..'res:{morale:'..city:getPopu():getMorale()
		sendmsg = sendmsg..',indignation:'..city:getPopu():getIndignation()
		sendmsg = sendmsg..',moralestate:'..city:getPopu():getMoraleState()
		sendmsg = sendmsg..',taxrate:'..city:getTax():get()
		sendmsg = sendmsg..'}' -- res end
		sendmsg = sendmsg..'}'
		player:sendMsg(sendmsg)		
	end;
	
	sendGoldMsg = function(self, player)
		local city = player:getCity()
		local sendmsg = '{cmd:'..NETCMD.GOLDRES..','
		sendmsg = sendmsg..'res:{gold:{curres:'..city:getBindMoney()
		sendmsg = sendmsg..',maxres:'..city:getMaxBindMoney()
		sendmsg = sendmsg..',collection:'..city:getBindMoneyCollection()
		sendmsg = sendmsg..',output:'..city:getBindMoneyOutput()
		sendmsg = sendmsg..'}'--gold end
		sendmsg = sendmsg..'}' -- res end
		sendmsg = sendmsg..'}'
		player:sendMsg(sendmsg)		
	end;
	
	sendPopuMsg = function(self, player)
		local city = player:getCity()
		local sendmsg = '{cmd:'..NETCMD.GOLDRES..','
		sendmsg = sendmsg..'res:{maxpopulace:'..city:getPopu():getMaxPopulace()
		sendmsg = sendmsg..',populace:'..city:getPopu():getAllPopu(player)
		sendmsg = sendmsg..',workforce:'..city:getPopu():getFarm():getWorkforce()
		sendmsg = sendmsg..',idle_populace:'..city:getPopu():getIdlePopu()
		sendmsg = sendmsg..',populace_state:'..city:getPopu():getPopuState()
		sendmsg = sendmsg..'}' -- res end
		sendmsg = sendmsg..'}'
		player:sendMsg(sendmsg)		
	end;
})



