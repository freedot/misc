--*******************************************************************************
--*******************************************************************************
--[[ 一下说明为参考，以代码实现为准
- 攻击策略-
如果attacker中已有攻击目标，判断是否在攻击距离内
	如果在攻击范围内同时非die，则攻击，同时返回
找前方最近的目标，判断是否在攻击距离内
	如果在攻击范围内，则攻击，同时添加在目标中，同时返回
找地图中最近的可攻击目标，判断是否在攻击距离内
	如果在攻击范围内，则攻击，同时添加在目标中，同时返回

调用移动策略模块，返回最近的目标
判断是否在攻击范围内，则攻击，同时添加在目标中，同时返回

 - 移动策略-
A点前方有目标点B
	通过B点和攻击半径反算一个C点
	如果A到C的距离小于等于攻击半径，且中间无障碍，则直接移动，同时返回
	如果A到C的距离大于攻击半径，则直线逐点移动
		逐点判断是否有可攻击的目标，如果有则停止前行
		如果遇到障碍则停止
		如果达到攻击半径则停止
剩余其他情况
	以A点为原点进行距离值填充，遍历Actors
		如果是同阵营则continue
		如果die，则continue
		如果是Wall，同时还有Soldier，则continue
		计算actor+attackrange的最近点
	返回最近点
]]
require('tqFightActor')

MIN_ATTACKSPEED = 0
MAX_ATTACKRANGE = 0xffffffffff
MIN_ATTACKRANGE = 0
EMPTY_EFFECTS = {}

NullEffectTriger = Class:extends({
	triger = function(self, camp, attacker, target, skillId, skillLevel, effect)
	end;
})

EffectTriger = Class:extends({
	triger = function(self, camp, attacker, target, skillId, skillLevel, effect)
		local user, target = self:getUserAndTarget(camp, attacker, target)
		if (user == nil) or (target == nil) then return end
		if not target:isCanAddEffect(effect.id) then return end

		local pro = eval(effect.pro, {LV=skillLevel}) + res_addskillpro_bymorale(user:getAttrVal(ATTR.MO) )
		if not self:_isInPro(pro) then 
			return 
		end
		
		local useHp = user:getAttrVal(ATTR.HP)
		local targetHp = target:getAttrVal(ATTR.HP)
		local minHp = math.min(useHp, targetHp)
		local val = eval(effect.val, {LV=skillLevel})
		target:addProEffect({id=effect.id, skillId=skillId, skillLevel=skillLevel, pro=pro, val=val, u=effect.u, times=self:getTimes(), isbuff=self:isBuff(), minHp=minHp })
	end;
	
	_isInPro = function(self, pro)
		return math.random(100) <= pro
	end;
	
	getTimes = function(self)
		return 1
	end;
	
	isBuff = function(self)
		return false
	end;
})

AttackerToAttackerEffectTriger = EffectTriger:extends({
	getUserAndTarget = function(self, camp, attacker, target)
		if target:getCamp() == camp then return nil end
		return attacker, attacker
	end;
})

BiShaEffectTriger = AttackerToAttackerEffectTriger:extends({
	_isInPro = function(self, pro)
		return true
	end;
})

AttackerToDefenderEffectTriger = EffectTriger:extends({
	getUserAndTarget = function(self, camp, attacker, target)
		if target:getCamp() == camp then return nil end
		return attacker, target
	end;
})

DefenderToDefenderEffectTriger = EffectTriger:extends({
	getUserAndTarget = function(self, camp, attacker, target)
		if attacker:getCamp() == camp then return nil end
		return target, target
	end;
})

BothToBothEffectTriger = EffectTriger:extends({
	getUserAndTarget = function(self, camp, attacker, target)
		if attacker:getCamp() == camp then
			return attacker, attacker
		else
			return target, target
		end
	end;
})

CuiDuEffectTriger3 = AttackerToDefenderEffectTriger:extends({
	getTimes = function(self)
		return 3
	end;
	
	isBuff = function(self)
		return true
	end;	
})

ShenYiEffectTriger = BothToBothEffectTriger:extends({
	isBuff = function(self)
		return true
	end;	
})

EffectTrigerMgr = Class:extends({
	init = function(self)
		self.trigers = {}
		self.trigers[RES_EFF.F_BISHA] = BiShaEffectTriger:new()
		self.trigers[RES_EFF.F_LIANJI] = AttackerToAttackerEffectTriger:new()
		self.trigers[RES_EFF.F_JIPO] = AttackerToAttackerEffectTriger:new()
		self.trigers[RES_EFF.F_XIXUE] = AttackerToAttackerEffectTriger:new()
		self.trigers[RES_EFF.F_CUIDU3] = CuiDuEffectTriger3:new()
		self.trigers[RES_EFF.F_SHENYI] = ShenYiEffectTriger:new()
		self.trigers[RES_EFF.F_ADD_ES] = DefenderToDefenderEffectTriger:new()
		self.trigers[RES_EFF.F_ADD_FIREHURT] = DefenderToDefenderEffectTriger:new()
		self.trigers[RES_EFF.F_ADD_HU] = AttackerToAttackerEffectTriger:new()
		self.trigers[RES_EFF.F_XINGYUN] = DefenderToDefenderEffectTriger:new()
		self.trigers[RES_EFF.F_ADD_FULLATTRS] = AttackerToAttackerEffectTriger:new()
		self.trigers[RES_EFF.F_XUERUO] = AttackerToAttackerEffectTriger:new()
		self.trigers[RES_EFF.F_HUOGONG] = AttackerToAttackerEffectTriger:new()
		self.trigers[RES_EFF.F_CHENGSHANG] = DefenderToDefenderEffectTriger:new()
		self.trigers[RES_EFF.F_FANJI] = DefenderToDefenderEffectTriger:new()
	end;
	
	getTriger = function(self, effectId)
		local triger = self.trigers[effectId]
		if (triger == nil) then triger = NullEffectTriger end
		return triger
	end;
}):new()

FightHurtCalcHelper = Class:extends({
	calcBasePhyHurt = function(self, attacker, target)
		return self:_calcSinglePhyHurt(attacker, target)*attacker:getFightUnitNumber()
	end;
	
	getRestrictionFactor = function(self, attacker, target)
		local factor = 1.0
		local isRestriction, addfactor = res_get_soldier_restriction(attacker:getSoldierResId(), target:getSoldierResId())
		if isRestriction then
			factor = factor + addfactor
		end
		return factor
	end;	
	
	_calcSinglePhyHurt = function(self, attacker, target)
		local hurtVal = attacker:getAttrVal(ATTR.HU)
		local defVal = target:getAttrVal(ATTR.DE)
		
		local attS =  attacker:getAdaptableFactor() + 0.2*attacker:getSoldierLevel()
		local defS =  target:getAdaptableFactor() + 0.2*target:getSoldierLevel()
		local attQ = attacker:getAttrVal(ATTR.MPS)*attS
		local defQ = target:getAttrVal(ATTR.MPS)*defS
		local H = 1
		if attQ > 3*defQ then
			H =  math.atan(attQ / (3*defQ)) * 1.083 + 0.15
		end
		
		local c = 10
		local D =1
		if 3*attQ > defQ then
			D = math.sqrt((attQ + c)*(defQ + c)) / (defQ + c)
		end
	
		local T = self:getRestrictionFactor(attacker, target)
		local r = (math.random(19) + 90)/100
		local ret = hurtVal*(hurtVal + c)/(hurtVal + defVal + c)*1.5* D*H*T*r
		return ret
	end;
}):new()

FightMapHdr = Class:extends({
	init = function(self)
		self.objects = {}
		self.mapMasks = {}
		self.disVals = {}
		self:initMap(40, 3)
		self.fourDriectDrt = {{-1,0},{1,0},{0,-1},{0,1}}
		self.INVALID_DISVAL = 0xffff
	end;
	
	initMap = function(self, w, h)
		self.w = w
		self.h = h
		self:initMapMask()
		self:initDisVals()
	end;
	
	initMapMask = function(self)
		for row=1, self.h, 1 do
			if self.mapMasks[row] == nil then
				self.mapMasks[row] = {}
			end
			for col=1, self.w, 1 do
				self.mapMasks[row][col] = 0
			end
		end
	end;
	
	initDisVals = function(self)
		for row=1, self.h, 1 do
			if self.disVals[row] == nil then
				self.disVals[row] = {}
			end
			for col=1, self.w, 1 do
				self.disVals[row][col] = self.INVALID_DISVAL
			end
		end
	end;
	
	clearDisVals = function(self)
		for row=1, self.h, 1 do
			for col=1, self.w, 1 do
				self.disVals[row][col] = self.INVALID_DISVAL
			end
		end
	end;
	
	findPaths = function(self, x, y, moveRange)
		local paths = {}
		local maxDis = self:getDisVal(x, y)
		for dis=maxDis, 1, -1 do
			if (dis <= moveRange) then
				table.insert(paths, {x=x, y=y})
			end
			for _, drt in ipairs(self.fourDriectDrt ) do
				local nextX = x + drt[1]
				local nextY = y + drt[2]
				if self:getDisVal(nextX, nextY) < dis then
					x = nextX
					y = nextY
					break
				end
			end
		end
		return paths
	end;
	
	getMask = function(self, x, y)
		if (x < 0) or (self.w <= x) then return 1 end 
		if (y < 0) or (self.h <= y) then return 1 end 
		return self.mapMasks[y+1][x+1]
	end;
	
	setMask = function(self, x, y, maskVal)
		if (x < 0) or (self.w <= x) then return end 
		if (y < 0) or (self.h <= y) then return end 
		self.mapMasks[y+1][x+1] = maskVal
	end;
	
	fillDisVal = function(self, startX, startY)
		self:clearDisVals()
		local queue = {}
		self:setDisVal(startX, startY, 0)
		table.insert(queue, {startX, startY, 0})
		while table.getn(queue) > 0 do
			local x = queue[1][1]
			local y = queue[1][2]
			local curDisVal = queue[1][3]
			table.remove(queue, 1)
			
			for _, drt in ipairs(self.fourDriectDrt) do
				local newX = x+drt[1]
				local newY = y+drt[2]
				if (self:getMask(newX, newY) == 0) and (self:getDisVal(newX, newY) == self.INVALID_DISVAL) then
					self:setDisVal(newX, newY, curDisVal+1)
					table.insert(queue, {newX, newY, curDisVal+1})
				end
			end
		end
	end;
	
	setDisVal = function(self, x, y, val)
		if (x < 0) or (self.w <= x) then return end 
		if (y < 0) or (self.h <= y) then return end 
		self.disVals[y+1][x+1] = val
	end;
	
	getDisVal = function(self, x, y)
		if (x < 0) or (self.w <= x) then return self.INVALID_DISVAL end 
		if (y < 0) or (self.h <= y) then return self.INVALID_DISVAL end 	
		return self.disVals[y+1][x+1]
	end;
	
	getMinDisVal = function(self, x, y, maxRange)
		local minDisVal = self.INVALID_DISVAL
		local rx = 0
		local ry = 0
		for range=maxRange, 1, -1 do
			for dx=-range, range, 1 do
				local dy = range - math.abs(dx)
				minDisVal, rx, ry = self:getMinDisValInner(x+dx, y+dy, minDisVal, rx, ry)
				if dy ~= 0 then
					minDisVal, rx, ry = self:getMinDisValInner(x+dx, y-dy, minDisVal, rx, ry)
				end
			end
		end
		return minDisVal, rx, ry
	end;
	
	getMinDisValInner = function(self, cx, cy, minDisVal, rx, ry)
		local disVal = self:getDisVal(cx, cy)
		if disVal < minDisVal then
			return disVal, cx, cy
		end
		return minDisVal, rx, ry
	end;
}):new()

FightEventStream = Class:extends({
	init = function(self)
		self.events = {}
	end;
	
	clear = function(self)
		self.events = {}
	end;
	
	pushEvent = function(self, evt)
		table.insert(self.events, evt)
	end;
	
	getEventCnt = function(self)
		return table.getn(self.events)
	end;
	
	getEvent = function(self, evtIdx)
		return self.events[evtIdx+1]
	end;
	
	getEvents = function(self)
		return self.events
	end;
	
	getEventByReverse = function(self, evt)
		local idx = table.getn(self.events)
		for idx = idx, 1, -1 do
			local curevt = self.events[idx]
			if (curevt.event == evt.event) 
				and (curevt.userid == evt.userid) 
				and (curevt.targetid == evt.targetid) then
				return curevt
			end
		end
		return nil
	end;
	
	toString = function(self)
		return PPrintTable(self.events)
	end;
})

NullFightEventStream = Class:extends({
	pushEvent = function(self, s)
	end;
	
	toString = function(self)
	end;
})


CampsPosIniter = Class:extends({
	init = function(self)
		self.LINEUP_MAXCOLS = 3
	end;
	
	initParams = function(self, mapId, attackersCamp, defendersCamp)
		self.mapId = mapId
		self.attackersCamp = attackersCamp
		self.defendersCamp = defendersCamp	
	end;
	
	initPos = function(self)
		if self:_isHeroActor() then
			self:initSingleHeroFightPos()
		else
			self:initMultiActorsFightPos()
		end
	end;
	
	_isHeroActor = function(self)
		return table.getn(self.attackersCamp.actors) == 1 
			and self.attackersCamp.actors[1]:getType() == ACTOR_TYPE.HERO
	end;
	
	initSingleHeroFightPos = function(self)
		self.attackersCamp.actors[1]:setPos(0, 0)
		if table.getn(self.defendersCamp.actors) > 0 then
			self.defendersCamp.actors[1]:setPos(1, 0)
		end
	end;
	
	initMultiActorsFightPos = function(self)
		self.mapRes = Util:qfind(res_fightmaps, 'id', self.mapId)
		FightMapHdr:initMap(self.mapRes.blocks.cols, self.mapRes.blocks.rows)
		
		self:initAttackerActorsFightPos()
		self:initDefenderActorsFightPos()
	end;
	
	initAttackerActorsFightPos = function(self)
		self:initActorsFightPosInner(self.mapRes.blocks.cols, self.mapRes.blocks.rows, 
			self.attackersCamp.lineupId, self.attackersCamp.actors, 'left_side')
	end;
	
	initDefenderActorsFightPos = function(self)
		local mapW = self.mapRes.blocks.cols
		local mapH = self.mapRes.blocks.rows
		
		local defActors = self:collectDefActors(self.defendersCamp.actors)
		self:initDefsFightPosInner(mapW+1, mapH, defActors) -- out of grids cols
		
		local wallActors = self:collectWallActors(self.defendersCamp.actors)
		self:initWallFightPosInner(mapW, mapH, wallActors)
		
		local soldierActors = self:collectSoldierActors(self.defendersCamp.actors)
		local hasWallActor = table.getn(wallActors) > 0
		if  hasWallActor then mapW = mapW - 1 end -- left space grid for position wall actor
		self:initActorsFightPosInner(mapW, mapH, self.defendersCamp.lineupId, soldierActors, 'right_side')
	end;
	
	collectWallActors = function(self, actors)
		return self:collectActorsByType(actors, ACTOR_TYPE.WALL)
	end;
	
	collectDefActors = function(self, actors)
		return self:collectActorsByType(actors, ACTOR_TYPE.DEF)
	end;
	
	collectSoldierActors = function(self, actors)
		return self:collectActorsByType(actors, ACTOR_TYPE.SOLDIER)
	end;
	
	collectActorsByType = function(self, actors, actorType)
		local collectActors = {}
		for _, actor in ipairs(actors) do
			if actor:getType() == actorType then
				table.insert(collectActors, actor)
			end
		end
		return collectActors
	end;
	
	initWallFightPosInner = function(self, mapW, mapH, wallActors)
		local ox = mapW - 1
		local oy = 0
		for i, wall in ipairs(wallActors) do
			wall:setPos(ox, oy + (i-1) )
		end
	end;
	
	initDefsFightPosInner = function(self, mapW, mapH, defActors)
		local ox = mapW - 1
		local oy = 0
		for i, def in ipairs(defActors) do
			def:setPos(ox + math.floor((i-1)/mapH), oy + ((i-1)%mapH) )
		end
	end;
	
	initActorsFightPosInner = function(self, mapW, mapH, lineupId, actors, sideFlag)
		local ox = 0
		local oy = math.floor((mapH - self.LINEUP_MAXCOLS)/2)
		if sideFlag == 'right_side' then
			ox = mapW - self.LINEUP_MAXCOLS
		end
		
		local lineupRes = ItemResUtil:findItemres(lineupId)
		for _, actor in ipairs(actors) do
			local gridIdx = lineupRes.grids[actor:getLineupPos()]
			local gridDX, gridDY = 0, 0
			if sideFlag == 'left_side' then
				gridDX, gridDY = self:rotateFaceUpToFaceRight(gridIdx)
			elseif sideFlag == 'right_side' then
				gridDX, gridDY = self:rotateFaceupToFaceLeft(gridIdx)
			end
			actor:setPos(ox+gridDX, oy+gridDY)
		end
	end;
	
	-- clockwise rotate 90 degree
	rotateFaceUpToFaceRight = function(self, lineupGridIdx)
		local gridDX = self.LINEUP_MAXCOLS - math.floor(lineupGridIdx / self.LINEUP_MAXCOLS) - 1
		local gridDY = math.fmod(lineupGridIdx, self.LINEUP_MAXCOLS)
		return gridDX, gridDY
	end;
	
	-- anticlockwise rotate 90 degree
	rotateFaceupToFaceLeft = function(self, lineupGridIdx)
		local gridDX = math.floor(lineupGridIdx / self.LINEUP_MAXCOLS)
		local gridDY = math.fmod(lineupGridIdx, self.LINEUP_MAXCOLS)
		return gridDX, gridDY
	end;
})

RecentlyActorGetter = Class:extends({
	init = function(self)
		self.FAR_AWAY = 0xffff
	end;
	
	setActors = function(self, actors)
		self.actors = actors
		self.campCacheSoldier = {}
	end;
	
	getHighPriCanAttackActor = function(self, attacker)
		local actors = self:getAllInRangeActors(attacker)
		if table.getn(actors) == 0 then return nil end
		if table.getn(actors) == 1 then return actors[1].actor end
		
		local rtActor = nil
		local maxPri = 0
		for _, a in ipairs(actors) do
			local curPri = 0
			local isRestriction, _= res_get_soldier_restriction(attacker:getSoldierResId(), a.actor:getSoldierResId())
			if isRestriction then
				curPri = 1000000
			end
			
			if self:isInAttackRange(a.actor, attacker) then
				curPri = curPri + 100000
			end
			
			curPri = curPri + (10000 - a.distance)
			
			if curPri > maxPri then
				maxPri = curPri
				rtActor = a.actor
			end
		end
		return rtActor
	end;
	
	getAllInRangeActors = function(self, attacker)
		local actors = {}
		for _, actor in ipairs(self.actors) do
			if self:isInAttackRange(attacker, actor) then
				table.insert(actors, {actor=actor, distance=self:calcDistance(attacker, actor)})
			end
		end
		return actors
	end;
	
	isInAttackRange = function(self, attacker, actor)
		if not self:isCanAttack(attacker, actor) then
			return false
		end
		
		local distance = self:calcDistance(attacker, actor)
		if distance > attacker:getAttackRange() then
			return false
		end
		
		return true
	end;
	
	getRecentlyActor = function(self, attacker)
		local recentlyActor = nil
		local minDistance = self.FAR_AWAY
		for _, actor in ipairs(self.actors) do
			recentlyActor, minDistance = self:getRecentlyActorInner(attacker, actor, recentlyActor, minDistance)
		end
		return recentlyActor, minDistance
	end;
	
	getRecentlyActorInner = function(self, attacker, actor, recentlyActor, minDistance)
		if not self:isCanAttack(attacker, actor) then
			return recentlyActor, minDistance 
		end
		
		local distance = self:calcDistance(attacker, actor)
		if distance >= minDistance then
			return recentlyActor, minDistance
		end
		
		return actor, distance
	end;
	
	getHRecentlyActor = function(self, attacker)
		local recentlyActor = nil
		local minDistance = self.FAR_AWAY
		for _, actor in ipairs(self.actors) do
			recentlyActor, minDistance = self:getHRecentlyActorInner(attacker, actor, recentlyActor, minDistance)
		end
		return recentlyActor, minDistance
	end;
	
	getHRecentlyActorInner = function(self, attacker, actor, recentlyActor, minDistance)
		if not self:isCanAttack(attacker, actor) then
			return recentlyActor, minDistance 
		end
		
		if attacker:getPos().y ~= actor:getPos().y then
			return recentlyActor, minDistance
		end
		
		if (attacker:getCamp() == FIGHT_CAMP.ATTACK) and (actor:getPos().x < attacker:getPos().x) then
			return recentlyActor, minDistance
		end
		
		if (attacker:getCamp() == FIGHT_CAMP.DEFEND) and (actor:getPos().x > attacker:getPos().x) then
			return recentlyActor, minDistance
		end
		
		local distance = self:calcDistance(attacker, actor)
		if distance >= minDistance then
			return recentlyActor, minDistance
		end
		
		return actor, distance
	end;
	
	isCanAttack = function(self, attacker, actor)
		if attacker:getCamp() == actor:getCamp() then
			return false
		end
		
		if actor:isDie() then
			return false
		end
		
		if actor:getType() == ACTOR_TYPE.DEF then
			return false
		end
		
		if (actor:getType() == ACTOR_TYPE.WALL) and self:hasSoldierActor(actor:getCamp()) then
			return false
		end
		
		return true
	end;
	
	hasSoldierActor = function(self, camp)
		local cacheSoldier = self.campCacheSoldier[camp]
		if (cacheSoldier ~= nil) and (not cacheSoldier:isDie()) then
			return true
		end
		if cacheSoldier == NullActor then
			return false
		end
		
		for _, actor in ipairs(self.actors) do
			if (actor:getCamp() == camp) 
				and (actor:getType() == ACTOR_TYPE.SOLDIER)
				and (not actor:isDie()) then
				self.campCacheSoldier[camp] = actor
				return true
			end
		end;
		
		self.campCacheSoldier[camp] = NullActor
		return false
	end;
	
	calcDistance = function(self, actor1, actor2) 
		local pos1 = actor1:getPos()
		local pos2 = actor2:getPos()
		return math.abs(pos1.x - pos2.x) + math.abs(pos1.y - pos2.y)
	end;	
})

ActorMoveAI = Class:extends({
	init = function(self)
		self.FAR_AWAY = 0xffff
	end;
	
	setActors = function(self, actors)
		self.actors = actors
	end;
	
	setRecentlyGetter = function(self, recentlyGetter)
		self.recentlyGetter = recentlyGetter
	end;
	
	moveActor = function(self, actor)
		if (actor:getMoveRange() == 0) then
			return nil, self.FAR_AWAY 
		end
		
		local targetActor, distance = self:forwadMove(actor)
		if targetActor ~= nil then return targetActor, distance  end
		
		return self:commMove(actor)
	end;
	
	forwadMove = function(self, actor)
		local horizontalActor, distance = self.recentlyGetter:getHRecentlyActor(actor)
		if (horizontalActor == nil) then return nil, self.FAR_AWAY end
		
		local targetActor, targetDis = self:forwadMoveVeryFarWithTarget(actor, horizontalActor, distance)
		if targetActor ~= nil then return targetActor, targetDis end
		
		return self:forwadMoveInRangeWithTarget(actor, horizontalActor, distance)
	end;
	
	forwadMoveVeryFarWithTarget = function(self, actor, target, distance)
		if (actor:getMoveRange() + actor:getAttackRange()) >= distance then
			return nil, self.FAR_AWAY
		end
	
		local y = actor:getPos().y
		local startX = actor:getPos().x
		local endX = target:getPos().x
		local step = (endX - startX) / math.abs(endX - startX)
		endX = startX + step*actor:getMoveRange()
		for x=startX+step, endX, step do
			if FightMapHdr:getMask(x, y) == 0 then
				actor:moveTo(x, y)
				local recActor, dis = self.recentlyGetter:getRecentlyActor(actor)
				if dis <= actor:getAttackRange() then
					return recActor, dis
				end
			else
				break
			end
		end
		return target, self.recentlyGetter:calcDistance(actor, target)
	end;
	
	forwadMoveInRangeWithTarget = function(self, actor, target, distance )
		if (actor:getMoveRange() + actor:getAttackRange()) < distance then
			return nil, self.FAR_AWAY
		end
		
		local y = actor:getPos().y
		local startX = actor:getPos().x
		local endX = target:getPos().x
		local step = (endX - startX) / math.abs(endX - startX)
		endX = endX - step*actor:getAttackRange()
		local canMoveX = -1
		for x=startX+step, endX, step do
			canMoveX = x
			if FightMapHdr:getMask(x, y) == 1 then
				canMoveX = -1
				break
			end
		end
		if canMoveX >= 0 then
			actor:moveTo(canMoveX, y)
			return target, self.recentlyGetter:calcDistance(actor, target)
		end
		
		return nil, self.FAR_AWAY
	end;
	
	commMove = function(self, attacker)
		local target = nil
		local minDis = self.FAR_AWAY
		local x = 0
		local y = 0
		local startPos = attacker:getPos()
		FightMapHdr:fillDisVal(startPos.x, startPos.y)
		
		for _, actor in ipairs(self.actors) do
			if self.recentlyGetter:isCanAttack(attacker, actor)  then
				local targetPos = actor:getPos()
				local rtminDis, rtx, rty = FightMapHdr:getMinDisVal(targetPos.x, targetPos.y, attacker:getAttackRange())
				if rtminDis < minDis then
					minDis = rtminDis
					x = rtx
					y = rty
					target = actor
				end
			end
		end
		
		if (minDis ~= self.FAR_AWAY) then
			local paths = FightMapHdr:findPaths(x, y, attacker:getMoveRange())
			local len = table.getn(paths)
			for i=len, 1, -1 do
				local path = paths[i]
				attacker:moveTo(path.x, path.y)
			end
			return target, self.recentlyGetter:calcDistance(attacker, target)
		end
		
		return nil, self.FAR_AWAY
	end;
})

ActorMoveHdr = Class:extends({
	init = function(self, actorMoveAI, stream)
		self.actorMoveAI_ = actorMoveAI
		self.stream_ = stream
		self.moveActors_ = {attackers={}, defenders={}}
	end;
	
	sortMoveSequence = function(self, attackerActors, defenderActors)
		self.moveActors_.attackers={}
		self.moveActors_.defenders={}
		
		self:_sortMoveSequence(self.moveActors_.attackers, attackerActors, 1)
		self:_sortMoveSequence(self.moveActors_.defenders, defenderActors, -1)
	end;
	
	clearNeedMoveMarks= function(self)
		self:_clearNeedMoveMarks(self.moveActors_.attackers)
		self:_clearNeedMoveMarks(self.moveActors_.defenders)
	end;
	
	markNeedMoveActor = function(self, actorId)
		if self:_markNeedMoveActor(self.moveActors_.attackers, actorId) then 	return end
		self:_markNeedMoveActor(self.moveActors_.defenders, actorId)
	end;
	
	actorsMove = function(self)
		self.stream_:pushEvent({event='movestart'})
		self:_actorsMove(self.moveActors_.attackers)
		self.stream_:pushEvent({event='movesplit'})
		self:_actorsMove(self.moveActors_.defenders)
		self.stream_:pushEvent({event='moveend'})
	end;
	
	_sortMoveSequence = function(self, sortNodes, actors, mirror)
		for _, actor in ipairs(actors) do
			table.insert(sortNodes, {needMove=false, actor=actor})
		end
		
		table.sort(sortNodes, function(node1, node2) 	
			return node1.actor:getPos().x*mirror > node2.actor:getPos().x*mirror
		end)	
	end;	
	
	_clearNeedMoveMarks = function(self, sortNodes)
		for _, node in ipairs(sortNodes) do
			node.needMove = false
		end
	end;
	
	_markNeedMoveActor = function(self, sortNodes, actorId)
		for _, node in ipairs(sortNodes) do
			if node.actor:getId() == actorId then
				node.needMove = true
				return true
			end
		end
		return false
	end;
	
	_actorsMove = function(self, sortNodes)
		for _, node in ipairs(sortNodes) do
			if node.needMove then
				self.actorMoveAI_:moveActor(node.actor)
			end
		end
	end;
})

ActorAttackHdr = Class:extends({
	init = function(self)
		self.stream = NullFightEventStream
	end;
	
	setStream = function(self, stream)
		self.stream = stream
	end;
	
	attack = function(self, attacker, target, attackersCamp, defendersCamp)
		self:initParams(attacker, target, attackersCamp, defendersCamp)
		self:sortSkills()
		self:trigerSkills()
		self:calcSkillEffectBeforeHit()
		if self:isHit() then
			self:calcSkillEffectBeforePhyHurt()
			self:calcBasePhyHurt()
			self:calcBerserkPhyHurt()
			self:calcSkillPhyHurt()
			self:calcFanJiHurt()
			self.stream:pushEvent({event='attackend'})
		else
			self.stream:pushEvent({event='miss', userid=self.attacker:getId(), targetid=self.target:getId()})
		end
	end;
	
	cityDefAttack = function(self, attacker, target, attackersCamp, defendersCamp)
		self:initParams(attacker, target, attackersCamp, defendersCamp)
		local baseHurt = self.attacker:getAttrVal(ATTR.HU)
		baseHurt = baseHurt*FightHurtCalcHelper:getRestrictionFactor(attacker, target)
		baseHurt = baseHurt*self.attacker:getFightUnitNumber()
		self.stream:pushEvent({event='attack', userid=self.attacker:getId(), targetid=self.target:getId(), val=math.floor(baseHurt)})
		self.target:subHP(baseHurt)
		self.attacker:hurtEnd()
		self.stream:pushEvent({event='attackend'})
	end;
	
	initParams = function(self, attacker, target, attackersCamp, defendersCamp)
		self.attacker = attacker
		self.target = target
		self.attackersCamp = attackersCamp
		self.defendersCamp = defendersCamp
	end;
	
	sortSkills = function(self)
		self.sortskills = {}
		self:pushActorProSkills(self.attacker)
		self:pushActorProSkills(self.target)
		table.sort(self.sortskills, function(ss1, ss2)
			return ss1.pri > ss2.pri
		end)
	end;
	
	pushActorProSkills = function(self, actor)
		local skillCount = actor:getSkillCount()
		for i=0, skillCount-1, 1 do
			local skill = actor:getSkillByIdx(i)
			local skillRes = ItemResUtil:findItemres(skill.ulResId)
			local skillLevel = skill.ucLevel + AddLevelByHeroFiveElemAttr:getAddLevel( actor:getHero(),  skillRes)
			
			for _, effect in ipairs(skillRes.effects) do
				if effect.id == 0 then break end
				if tonumber(effect.pro) ~= 100 then
					table.insert(self.sortskills, {camp=actor:getCamp(), skillId=skillRes.id, level=skillLevel, effect=effect, pri=effect.pri})
				end
			end
		end
	end;
	
	trigerSkills = function(self)
		self.attacker:clearProEffects()
		self.target:clearProEffects()
		for _, ss in ipairs(self.sortskills) do
			local trigerHdr = EffectTrigerMgr:getTriger(ss.effect.id)
			trigerHdr:triger(ss.camp, self.attacker, self.target, ss.skillId, ss.level, ss.effect)
		end
	end;
	
	calcSkillEffectBeforeHit = function(self)
		local needCalcAttrs = {}
		needCalcAttrs[RES_EFF.F_ADD_ES] = true
		self:execAttackerEffects(self.target, self.target, needCalcAttrs)
	end;

	isHit = function(self)
		if not self.target:isCanDodge() then
			return true
		end
		
		local hitVal = self.attacker:getAttrVal(ATTR.HI)
		local esVal = self.target:getAttrVal(ATTR.ES)
		local pro = res_get_hit_pro_val(hitVal, esVal)
		local appendPro = res_get_hit_appendPro_val(self.attacker:getHero():getLevel(), self.target:getHero():getLevel())
		return math.random(100) <= (pro + appendPro)
	end;

	calcSkillEffectBeforePhyHurt = function(self)
		local needCalcAttrs = {}
		needCalcAttrs[RES_EFF.F_JIPO] = true
		needCalcAttrs[RES_EFF.F_XUERUO] = true
		self:execAttackerEffects(self.attacker, self.target, needCalcAttrs)
	end;
	
	calcBasePhyHurt = function(self)
		local baseHurt =  FightHurtCalcHelper:calcBasePhyHurt(self.attacker, self.target)
		self.attacker:setBaseHurt(baseHurt)
		self.attacker:setHurt(baseHurt)
		self.stream:pushEvent({event='attack', userid=self.attacker:getId(), targetid=self.target:getId(), val=math.floor(baseHurt)})
	end;
	
	calcBerserkPhyHurt = function(self)
		local ber = self.attacker:getAttrVal(ATTR.BER)
		local per = math.min(ber*ber/(ber + 5100) + 5, 100)
		if math.random(100) > per then return end
		local baseHurt = self.attacker:getBaseHurt()
		baseHurt = res_get_berserkHurt(baseHurt)
		self.stream:pushEvent({event='berserk', userid=self.attacker:getId(), targetid=self.target:getId(), val=math.floor(baseHurt)})
		
		self.attacker:setBaseHurt(baseHurt)
		self.attacker:setHurt(baseHurt)
	end;
	
	calcSkillPhyHurt = function(self)
		local needCalcAttrs = {}
		needCalcAttrs[RES_EFF.F_ADD_HU] = true
		needCalcAttrs[RES_EFF.F_BISHA] = true
		needCalcAttrs[RES_EFF.F_LIANJI] = true
		needCalcAttrs[RES_EFF.F_HUOGONG] = true
		self:execAttackerEffects(self.attacker, self.target, needCalcAttrs)
		
		needCalcAttrs = {}
		needCalcAttrs[RES_EFF.F_CHENGSHANG] = true
		self:execTargetEffects(self.attacker, self.target, needCalcAttrs)
		
		self:_adjustAttackerHurt()
		needCalcAttrs = {}
		needCalcAttrs[RES_EFF.F_XIXUE] = true
		self:execAttackerEffects(self.attacker, self.attacker, needCalcAttrs)

		self.target:subHP(self.attacker:getHurt())
		
	end;
	
	_adjustAttackerHurt = function(self)
		if self.attacker:getHurt() > self.target:getAttrVal(ATTR.HP) then
			self.attacker:setHurt(self.target:getAttrVal(ATTR.HP))
		end
	end;
	
	calcFanJiHurt = function(self)
		local needCalcAttrs = {}
		needCalcAttrs[RES_EFF.F_FANJI] = true
		self:execAttackerEffects(self.target, self.attacker, needCalcAttrs)
	end;
	
	execAttackerEffects = function(self, user, target, needCalcAttrs)
		self:_execEffects(user, target, user:getEffects(), needCalcAttrs)
	end;
	
	execTargetEffects = function(self, user, target, needCalcAttrs)
		self:_execEffects(user, target, target:getEffects(), needCalcAttrs)
	end;
	
	_execEffects = function(self, user, target, effects, needCalcAttrs)
		for _, effect in ipairs(effects) do
			if needCalcAttrs[effect.id] then
				EffectorMgr:getEffector(effect):exec(user, target, self.stream, effect, self.attackersCamp, self.defendersCamp)
			end
		end
	end;
}):new()

FightHdr = Class:extends({
	init = function(self, stream)
		if stream == nil then 
			stream = NullFightEventStream 
		end
		self.stream = stream
		self.campsPosIniter = CampsPosIniter()
		self.recentlyGetter = RecentlyActorGetter()
		self.actorMoveAI = ActorMoveAI()
		self.actorMoveHdr = ActorMoveHdr(self.actorMoveAI, self.stream)
	end;
	
	getStream = function(self)
		return self.stream
	end;
	
	fight = function(self, mapId, attackersCamp, defendersCamp, maxRounds)
		self:initParams(mapId, attackersCamp, defendersCamp)
		self:sortAttackSequence()
		self:setActorsId()
		self:setActorsStream()
		self.campsPosIniter:initPos()
		self.actorMoveHdr:sortMoveSequence(attackersCamp.actors, defendersCamp.actors)
		self:pushFightStartEventStream(attackersCamp, defendersCamp)
		for round=1, maxRounds, 1 do
			self.stream:pushEvent({event='round', round=round})
			self:fightRound()
			local ret = self:getFightState()
			if (ret ~= FIGHT_RESULT.INPROCESS) then return ret end
		end
		return FIGHT_RESULT.ATTACKFAIL
	end;
	
	pushFightStartEventStream = function(self, attackerCamp, defenderCamp)
		self.stream:pushEvent({event='fightstart',
			attacker=self:getEventCampInfo(attackerCamp),
			defender=self:getEventCampInfo(defenderCamp)
			})
	end;
	
	getEventCampInfo = function(self, camp)
		local campInfo = {role={}, actors={}}
		self:getEventCampRoleInfo(camp, campInfo)
		self:getEventCampActorsInfo(camp, campInfo)
		return campInfo
	end;
	
	getEventCampRoleInfo = function(self, camp, campInfo)
		campInfo.role.name = camp.player:getRoleName()
		campInfo.role.objType = camp.player:getObjType()
	end;
	
	getEventCampActorsInfo = function(self, camp, campInfo)
		if camp.actors == nil then
			return
		end
		
		for _, actor in ipairs(camp.actors) do
			table.insert(campInfo.actors, { id=actor:getId(), name=actor:getName(), type=actor:getType(), pos={x=actor:getPos().x,y=actor:getPos().y}, resid=actor:getSoldierModelResId()} )
			CampActorInfoSetterForDebug:setActorInfo(actor, campInfo.actors[table.getn(campInfo.actors)])
		end
	end;
	
	initParams = function(self, mapId, attackersCamp, defendersCamp)
		self.attackersCamp = attackersCamp
		self.defendersCamp = defendersCamp
		self.mapId = mapId
		self.campsPosIniter:initParams(mapId, attackersCamp, defendersCamp)
	end;
	
	sortAttackSequence = function(self)
		self.actors = {}
		for _, actor in ipairs(self.attackersCamp.actors) do
			table.insert(self.actors, actor)
		end
		for _, actor in ipairs(self.defendersCamp.actors) do
			table.insert(self.actors, actor)
		end
		
		table.sort(self.actors, function(actor1, actor2) 	
			return actor1:getAttackSpeed() > actor2:getAttackSpeed()
		end)
		
		self.recentlyGetter:setActors(self.actors)
		self.actorMoveAI:setActors(self.actors)
		self.actorMoveAI:setRecentlyGetter(self.recentlyGetter)
	end;
	
	setActorsId = function(self)
		for i, actor in ipairs(self.actors) do
			actor:setId(i)
		end
	end;
	
	setActorsStream = function(self)
		for _, actor in ipairs(self.actors) do
			actor:setStream(self.stream)
		end
	end;
	
	getSortActors = function(self)
		return self.actors
	end;
	
	fightRound = function(self)
		self.actorMoveHdr:clearNeedMoveMarks()
		self:attackTargets()
		self.actorMoveHdr:actorsMove()
		self:execAllEffectBuffs()
		self:clearAllEffectBuffs()
	end;
	
	attackTargets = function(self)
		for _, attacker in ipairs(self.actors) do
			self:attackTarget(attacker)
		end;
	end;
	
	execAllEffectBuffs = function(self)
		local needCalcAttrs = {}
		needCalcAttrs[RES_EFF.F_CUIDU3] = true
		needCalcAttrs[RES_EFF.F_SHENYI] = true
		for _, actor in ipairs(self.actors) do
			self:execEffectBuffs(actor, actor, needCalcAttrs)
		end
	end;
	
	clearAllEffectBuffs = function(self)
		for _, actor in ipairs(self.actors) do
			actor:clearEffectBuffs()
		end
	end;
	
	attackTarget = function(self, attacker)
		if attacker:isDie() or (attacker:getAttackRange() == 0) then return end
		
		if self:attackHasTarget(attacker) then return end
		if self:attackRecentlyTarget(attacker) then return end
		
		self.actorMoveHdr:markNeedMoveActor(attacker:getId())
	end;
	
	attackHasTarget = function(self, attacker)
		local target = attacker:getAttackTarget()
		if target == nil then return false end
		if target:isDie() then return false end
		local isBeyondAttackRange = self.recentlyGetter:calcDistance(attacker, target) > attacker:getAttackRange()
		if isBeyondAttackRange then return false end
		
		attacker:attack(target, self.attackersCamp, self.defendersCamp)
		return true
	end;
	
	attackRecentlyTarget = function(self, attacker)
		local target = self.recentlyGetter:getHighPriCanAttackActor(attacker)
		if (target == nil) then return false end

		attacker:attack(target, self.attackersCamp, self.defendersCamp)
		return true	
	end;

	getFightState = function(self)
		if not self:hasLiveInAttackersCamp() then
			return FIGHT_RESULT.ATTACKFAIL
		end
		
		if not self:hasLiveInDefendersCamp() then
			return FIGHT_RESULT.ATTACKSUCC
		end
		
		if self:wallActorDied() then 
			return FIGHT_RESULT.ATTACKSUCC
		end
		
		return FIGHT_RESULT.INPROCESS
	end;
	
	hasLiveInAttackersCamp = function(self)
		return self:hasLiveActor(self.attackersCamp.actors)
	end;
	
	hasLiveInDefendersCamp = function(self)
		return self:hasLiveActor(self.defendersCamp.actors) 
	end;
	
	hasLiveActor = function(self, actors)
		for _, actor in ipairs(actors) do
			if (actor:getType() ~= ACTOR_TYPE.DEF) and (not actor:isDie()) then 
				return true 
			end 
		end
		return false
	end;
	
	wallActorDied = function(self)
		for _, actor in ipairs(self.defendersCamp.actors) do
			if (actor:getType() == ACTOR_TYPE.WALL) and (actor:isDie()) then
				return true
			end
		end
		return false
	end;
	
	execEffectBuffs = function(self, user, target, needCalcAttrs)
		local effects = user:getEffects()
		for _, effect in ipairs(effects) do
			if needCalcAttrs[effect.id] then
				EffectorMgr:getEffector(effect):exec(user, target, self.stream, effect)
			end
		end
	end;
})

AddLevelByHeroFiveElemAttr = Class:extends({
	init = function(self)
		self.fiveElemMapAttrIds = {}
		self.fiveElemMapAttrIds[FIVEELEM_TYPE.JIN] = ATTR.JIN_SKILL_LEVEL
		self.fiveElemMapAttrIds[FIVEELEM_TYPE.MU] = ATTR.MU_SKILL_LEVEL
		self.fiveElemMapAttrIds[FIVEELEM_TYPE.SHUI] = ATTR.SHUI_SKILL_LEVEL
		self.fiveElemMapAttrIds[FIVEELEM_TYPE.HUO] = ATTR.HUO_SKILL_LEVEL
		self.fiveElemMapAttrIds[FIVEELEM_TYPE.TU] = ATTR.TU_SKILL_LEVEL	
	end;
	
	getAddLevel = function(self, hero, skillRes)
		local attrId = self.fiveElemMapAttrIds[skillRes.fiveelem]
		if attrId == nil then
			return 0
		end
		
		return hero:getAttrVal(attrId)
	end;
}):new()


