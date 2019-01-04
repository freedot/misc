--*******************************************************************************
--*******************************************************************************
DropItem = Class:extends({
	init = function(self)
		self:_initAdditions()
	end;
	
	handle = function(self, dropId, additions)
		self:initParams(dropId, additions)
		self:dropRoleExp()
		self:dropRolePs()
		self:dropHeroExp()
		self:_dropHeroCredit()
		self:_dropRoleMoney()
		self:_dropHeroIForce()
		self:_dropFourres()
		self:_dropIdlePopu()
		self:_dropGiftGold()
		self:_dropGold()
		self:_dropAlliContribute()
		self:_dropPrestige()
		self:_dropStateHonour()
		self:_dropJibing1()
		self:_dropXinbing()
		self:dropItems()
	end;
	
	initParams = function(self, dropId, additions)
		self.logs = {}
		self.drops = {roleExp=0, rolePs=0, heroExp=0, heroCredit=0, roleMoney=0, heroIForce=0, fourres=0, idlePopu=0, giftGold=0, gold=0, alliContribute=0, prestige=0, stateHonour=0, jibing1=0, xinbing=0, items={}}
		self.dropRes = Util:qfind(res_drops, 'id', dropId)
		self.roundRandPro = math.random(100)
		
		self:_initAdditions()
		if additions ~= nil then
			Util:dictCopy(self.additions, additions)
		end
	end;
	
	setDrops = function(self, drops)
		self.drops = drops
	end;
	
	dropRoleExp = function(self)
		self:_dropRes('roleexp', 'roleExp', 'roleexp')
	end;
	
	dropRolePs = function(self)
		self:_dropRes('roleps', 'rolePs', 'roleps')
	end;
	
	dropHeroExp = function(self)
		self:_dropRes('heroexp', 'heroExp', 'heroexp')
	end;
	
	_initAdditions = function(self)
		self.additions = {appendPro=0,
			roleExp={mult=1, add=0}, 
			rolePs={mult=1, add=0},
			heroExp={mult=1, add=0},
			heroCredit={mult=1, add=0},
			roleMoney={mult=1, add=0},
			heroIForce={mult=1, add=0},
			fourres={mult=1, add=0},
			idlePopu={mult=1, add=0},
			giftGold={mult=1, add=0},
			gold={mult=1, add=0},
			alliContribute={mult=1, add=0},
			prestige={mult=1, add=0},
			stateHonour={mult=1, add=0},
			jibing1={mult=1, add=0},
			xinbing={mult=1, add=0},
		}	
	end;
	
	_dropHeroCredit = function(self)
		self:_dropRes('credit', 'heroCredit', 'herocredit')
	end;
	
	_dropRoleMoney = function(self)
		self:_dropRes('money', 'roleMoney', 'rolemoney')
	end;
	
	_dropHeroIForce = function(self)
		self:_dropRes('iforce', 'heroIForce', 'heroiforce')
	end;
	
	_dropFourres = function(self)
		self:_dropRes('fourres', 'fourres', 'fourres')
	end;
	
	_dropIdlePopu = function(self)
		self:_dropRes('idlepopu', 'idlePopu', 'idlepopu')
	end;
	
	_dropGiftGold = function(self)
		self:_dropRes('giftgold', 'giftGold', 'giftgold')
	end;
	
	_dropGold = function(self)
		self:_dropRes('gold', 'gold', 'gold')
	end;
	
	_dropAlliContribute = function(self)
		self:_dropRes('allicontribute', 'alliContribute', 'allicontribute')
	end;
	
	_dropPrestige = function(self)
		self:_dropRes('prestige', 'prestige', 'prestige')
	end;
	
	_dropStateHonour = function(self)
		self:_dropRes('statehonour', 'stateHonour', 'statehonour')
	end;
	
	_dropJibing1 = function(self)
		self:_dropRes('jibing1', 'jibing1', 'jibing1')
	end;
	
	_dropXinbing = function(self)
		self:_dropRes('xinbing', 'xinbing', 'xinbing')
	end;
	
	_dropRes = function(self, resName, dropName, logTypeName)
		if not self:isValidProRes(self.dropRes[resName]) then return end
		local resVal = self:randomDropNum(self.dropRes[resName])
		if (resVal == 0) then return end
		
		resVal = self.additions[dropName].mult*resVal + self.additions[dropName].add
		self.drops[dropName] = resVal
		self:pushLog({type=logTypeName, val=resVal})	
	end;
	
	dropItems = function(self)
		if (self.dropRes.items == nil) then return end
		
		for _, itemRes in ipairs(self.dropRes.items) do
			self:dropItem(itemRes)
		end
	end;
	
	dropItem = function(self, itemRes)
		if (itemRes.pro == 0) then return end
		local itemnum = self:randomDropNum(itemRes)
		if (itemnum == 0) then return end
		table.insert(self.drops.items, {resid=itemRes.id, number=itemnum})
		self:pushLog({type='item', id=itemRes.id, number=itemnum})
	end;
	
	isValidProRes = function(self, res)
		if (res == nil) then return false end
		if (res.pro == 0) then return false end
		return true
	end;
	
	randomDropNum = function(self, res)	
		if res.randtype == RAND_TYPE.ROUNDRAND then
			return self:roundRandDropNum(res)
		else
			return self:fullRandDropNum(res)
		end
	end;
	
	fullRandDropNum = function(self, res)	
		if ((res.pro + self.additions.appendPro) < math.random(100)) then return 0 end
		return self:_getRandNum(res)
	end;
	
	roundRandDropNum = function(self, res)
		if (self.roundRandPro < res.minpro) or (self.roundRandPro > res.maxpro) then return 0 end
		return self:_getRandNum(res)
	end;
	
	_getRandNum = function(self, res)
		if (res.minnum == res.maxnum) then return res.minnum end
		return math.random(res.minnum, res.maxnum)
	end;
	
	pushLog = function(self, log)
		table.insert(self.logs, log)
	end;
	
	getLog = function(self)
		return self.logs
	end;
	
	getDrops = function(self)
		return self.drops
	end;
	
	createRawItems = function(self, items)
		local rawItems = {}
		for id, item in ipairs(items) do
			table.insert( rawItems, RawItemEx({id=id, resId=item.resid,number=item.number}) )
		end
		return rawItems
	end;
})

DropItemUtil = Class:extends({
	init = function(self)
		self.dropItem = DropItem:new()
		self.newSoldierEffector = AddRoleNewSoldierNumEffector:new()
	end;
	
	handle = function(self, player, actors, heros, dropId, additions)
		self:initParams(player, actors, heros, dropId)
		self.dropItem:handle(dropId, additions)
		self:_dropHerosRes()
		self:_dropRoleRes()
		self:_dropItems()
	end;
	
	dropResForRole = function(self, player, dropItem)
		self:_dropResForRole(player, dropItem, false)
	end;
	
	dropResForRoleByItem = function(self, player, dropItem)
		self:_dropResForRole(player, dropItem, true)
	end;
	
	_dropResForRole = function(self, player, dropItem, byItem)
		self.player = player
		local bakDropItem = self.dropItem
		self.dropItem = dropItem
		self:_dropRoleRes(byItem)
		self:_dropSpecRoleRes(byItem)
		self.dropItem = bakDropItem
	end;	
	
	_dropHerosRes = function(self)
		self:_dropHeroExp()
		self:_dropHeroCredit()
		self:_dropHeroIForce()
	end;
	
	_dropRoleRes = function(self, byItem)
		self:_dropRoleExp()
		self:_dropRolePs()
		self:_dropRoleMoney()
		self:_dropFourres()
		self:_dropIdlePopu()
		self:_dropGiftGold()
		self:_dropGold()
		self:_dropAlliContribute()
		self:_dropPrestige()
		self:_dropStateHonour()
		self:_dropJibing1()
		self:_dropXinbing()
	end;
	
	_dropSpecRoleRes = function(self, byItem)
		self:_dropRoleRolesExp(byItem)
	end;
	
	initParams = function(self, player, actors, heros)
		self.player = player 
		self.actors = actors 
		self.heros = heros 
		if (self.heros == nil) then self.heros = {} end
		if (self.actors == nil) then self.actors = {} end
	end;
	
	_dropRoleExp = function(self)
		local drops = self.dropItem:getDrops()
		if drops.roleExp > 0 then
			self.player:addExp(drops.roleExp)
		end
	end;
	
	_dropRolePs = function(self)
		local drops = self.dropItem:getDrops()
		if drops.rolePs > 0 then
			self.player:addAttrPs(drops.rolePs, true) -- true is can beyond max
		end
	end;
	
	_dropRoleMoney = function(self)
		local drops = self.dropItem:getDrops()
		if drops.roleMoney > 0 then
			self.player:getCityRes():addMoney(drops.roleMoney)
		end
	end;
	
	_dropHeroExp = function(self)
		local drops = self.dropItem:getDrops()
		if drops.heroExp == 0 then 
			return
		end
		
		for _, hero in ipairs(self.heros) do
			hero:addExp(self.player, drops.heroExp)
		end
		
		for _, actor in ipairs(self.actors) do
			local hero = actor:getHero()
			hero:addExp(self.player, drops.heroExp)
			actor:addExp(drops.heroExp)
		end
	end;
	
	_dropHeroCredit = function(self)
		local drops = self.dropItem:getDrops()
		if drops.heroCredit == 0 then 
			return
		end
		
		for _, hero in ipairs(self.heros) do
			hero:addCredit(drops.heroCredit)
		end
		
		for _, actor in ipairs(self.actors) do
			local hero = actor:getHero()
			hero:addCredit(drops.heroCredit)
			actor:addCredit(drops.heroCredit)
		end
	end;
	
	_dropHeroIForce = function(self)
		local drops = self.dropItem:getDrops()
		if drops.heroIForce == 0 then 
			return
		end
		
		for _, hero in ipairs(self.heros) do
			hero:addInnerForce(drops.heroIForce)
		end
		
		for _, actor in ipairs(self.actors) do
			local hero = actor:getHero()
			hero:addInnerForce(drops.heroIForce)
			actor:addIForce(drops.heroIForce)
		end
	end;
	
	_dropFourres = function(self)
		local drops = self.dropItem:getDrops()
		if drops.fourres > 0 then
			self.player:getCityRes():addFood(drops.fourres)
			self.player:getCityRes():addWood(drops.fourres)
			self.player:getCityRes():addStone(drops.fourres)
			self.player:getCityRes():addIron(drops.fourres)
			CommResSender:sendAll(self.player)
		end
	end;
	
	_dropIdlePopu = function(self)
		local drops = self.dropItem:getDrops()
		if drops.idlePopu > 0 then
			local idlepopu = self.player:getCityRes():getIdlePopu()
			self.player:getCityRes():setIdlePopu(idlepopu + drops.idlePopu)
			PopuSender:send(self.player, {'idle'})
		end
	end;
	
	_dropGiftGold = function(self)
		local drops = self.dropItem:getDrops()
		if drops.giftGold > 0 then
			self.player:getPkg():addGiftGold(drops.giftGold)
			PkgMiscSender:send(self.player, {'giftgold'})
		end
	end;
	
	_dropGold = function(self)
		local drops = self.dropItem:getDrops()
		if drops.gold > 0 then
			self.player:getPkg():addGold(drops.gold)
		end
	end;
	
	_dropAlliContribute = function(self)
		local drops = self.dropItem:getDrops()
		if drops.alliContribute == 0 then return end
		
		local alliance =  app:getAlliMgr():getAlliById(self.player:getAlliId())
		if alliance == nil then return end
		
		local mem = alliance:getMemberById(self.player:getRoleId())
		if mem == nil then return end
		
		mem:setContributes(mem:getContributes() + drops.alliContribute)
		AllianceSender:sendSelfMember(self.player, alliance)
	end;
	
	_dropPrestige = function(self)
		local drops = self.dropItem:getDrops()
		if drops.prestige > 0 then
			self.player:setPrestige(self.player:getPrestige() + drops.prestige)
			RoleBaseSender:send(self.player, {'prestige'})
		end
	end;
	
	_dropStateHonour = function(self)
		local drops = self.dropItem:getDrops()
		if drops.stateHonour > 0 then
			self.player:setCityHonor(self.player:getCityHonor() + drops.stateHonour)
			RoleBaseSender:send(self.player, {'cityhonor'})
		end
	end;
	
	_dropJibing1 = function(self)
		local drops = self.dropItem:getDrops()
		if drops.jibing1 > 0 then
			local resid = WUtil:makeSoldierResId(FIXID.JIBING, 1)
			self.player:getSoldierMgr():addSoldier({resid=resid, number=drops.jibing1})
			RoleSoldierSender:sendSoldier(self.player, resid)
		end
	end;
	
	_dropXinbing = function(self)
		local drops = self.dropItem:getDrops()
		if drops.xinbing == 0 then return end
		self.newSoldierEffector:exec(self.player, 1, {val=drops.xinbing}, {})
	end;
	
	_dropRoleRolesExp = function(self, byItem)
		local drops = self.dropItem:getDrops()
		if drops.heroExp > 0 then
			self.player:addXPSAttr(drops.heroExp, byItem)
		end
	end;
			
	_dropItems = function(self)
		if not self.player:isRole() then
			return
		end
		
		local drops = self.dropItem:getDrops()
		local rawItems = self.dropItem:createRawItems(drops.items)
		if self.player:getPkg():addItems( rawItems ) then
			return
		end
		
		local mail = app:getMailMgr():addSysMail(self.player:getRoleName(), rstr.mail.title.dropitem, FIXID.COMM_SYS_MAILTEMP, rstr.mail.content.dropitem, rawItems)
		MailSender:sendBriefMail(self.player, mail)
	end;
	
	getLog = function(self)
		return self.dropItem:getLog()
	end;
	
	getDrops = function(self)
		return self.dropItem:getDrops()
	end;
}):new()


