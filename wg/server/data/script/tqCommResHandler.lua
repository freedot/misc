CommResHandler = Class:extends({
	OnRequest = function(self, player, netevt, cmdtb)
		if cmdtb.subcmd == 1 then
			self:SendCommonResMsg(player)
		end
	end;
	
	SendCommonResMsg = function(self, player)
		local sendmsg = '{cmd:'..NETCMD.CITYRES..',res:{'
		sendmsg = sendmsg..self:MakeAllCommonRes(player, {'food', 'wood', 'stone', 'iron'})
		sendmsg = sendmsg..'}' -- end res
		sendmsg = sendmsg..'}' -- end cmd
		player:sendMsg(sendmsg)
	end;
	
	MakeAllCommonRes = function(self, player, resmaps)
		local commresmsg = ''
		for _, v in ipairs(resmaps) do
			if commresmsg ~= '' then
				commresmsg = commresmsg..','
			end
			commresmsg = commresmsg..self:MakeOneCommoneResMsg(player, v)
		end	
		return commresmsg
	end;
	
	MakeOneCommoneResMsg = function(self, player, flag)
		local s = flag..':{maxres:'..self:GetMaxRes(player, flag)
		s = s..',maxbaseout:'..self:GetMaxBaseout(player, flag)
		s = s..',curres:'..self:GetCurrentRes(player, flag) 
		s = s..self:MakeAddRes(player, flag)
		s = s..',output:'..self:GetOutputRes(player, flag)
		s = s..'}'
		return s	
	end;
	
	MakeAddRes = function(self, player, flag)
		return ',amryres:'..self:MakeAmryAddMulRes(player, flag)
	end;
	
	GetMaxRes = function(self, player)
		local storenum = res_commres_basestorenum
		local citys = self.player:getCitys()
		local builds = citys:getBuildsByResId(FIXID.STOREINBUILD)
		if table.getn(builds) == 1 then
			local build = builds[1]
			local res = ItemResUtil:findBuildLevelres(build.ulResId, build.ucLevel)
			storenum = res.storenum
		end
		return storenum
	end;
	
	GetMaxBaseout = function(self, player, flag)
		return 0
	end;
	
	GetCurrentRes = function(self, player, flag)
		local cres = player:getCityRes()
		if flag == 'food' then
			return cres:getFood()
		elseif flag == 'wood' then
			return cres:getWood()
		elseif flag == 'stone' then
			return cres:getStone()
		elseif flag == 'iron' then
			return cres:getIron()
		end
		return 0
	end;
	
	MakeAmryAddMulRes = function(self, player, flag)
		local addres = self:GetAmryAddMulRes(player, flag)
		return '{add:'..addres..',mul:0}'
	end;
	
	GetOutputRes = function(self, player, flag)
		return self:GetMaxBaseout(player, flag) + self:GetAmryAddMulRes(player, flag)
	end;
	
	GetAmryAddMulRes = function(self, player, flag)
		if flag == 'food' then
			return self:GetAmryFoodAddMulRes(player)
		else
			return 0
		end
	end;
	
	GetAmryFoodAddMulRes = function(self, player)
		local needfood = self:GetSoldiersNeedFood(player:getPersistVar().stSoldiers)
		local heros = player:getPersistVar().stHeros
		for i=0, heros.ucCount-1, 1 do
			needfood = needfood + self:GetSoldiersNeedFood(heros.astHeros[i].stSoldiers)
		end
		return -needfood
	end;

	GetSoldiersNeedFood = function(self, soldiers )
		local needfood = 0
		for i=0, soldiers.ucCount-1, 1 do
			needfood = needfood + self:GetOneSoldierAddMulRes(soldiers.astSoldiers[i])
		end
		return needfood
	end;
	
	GetOneSoldierAddMulRes = function(self, soldier)
		if soldier.ucState == nil or soldier.ucState == BUILD_STATE.COMM then
			local itemres = Util:qfind(res_items, 'id', soldier.ulResId)
			local attr = Util:find(itemres.battrs, 'id', ATTR.FO)
			return WUtil:getAddMulVal(0, attr)*soldier.ulNumber
		else
			return 0
		end
	end;
})




