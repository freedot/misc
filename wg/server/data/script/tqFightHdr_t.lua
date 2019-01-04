require('tqFightHdr')

local TestCaseFightEventStream = TestCase:extends({
	setUp = function(self)
		self.stream = FightEventStream()
	end;
	
	test_getEventByReverse = function(self)
		self.stream:pushEvent({event='attack', userid=1, targetid=2})
		self.stream:pushEvent({event='attack', userid=3, targetid=4, seq=1})
		self.stream:pushEvent({event='attack', userid=3, targetid=4, seq=3})
		self.stream:pushEvent({event='miss'})
		
		local evt = self.stream:getEventByReverse({event='miss', userid=3, targetid=4})
		assertEQ ( evt, nil )
		
		local evt = self.stream:getEventByReverse({event='attack', userid=3, targetid=4})
		assertEQ ( evt.seq, 3 )
	end;
});

local TestCaseBaseFightHdr = TestCase:extends({
	setUp = function(self)
		self.mapId = 9920001
		self.fightHdr = FightHdr()
		TestCaseHelper:createPlayer(self)
		TestCaseCondition:setPreCond(self.player, nil, {heros={{state=0,soldier={resid=150002020,number=1}},{state=0,soldier={resid=150001020,number=1}},{state=0,soldier={resid=150003020,number=1}},{state=0,soldier={resid=150005020,number=1}}} })
		self.hero1 = self.player:getHeroMgr():getHeroById(1)
		self.hero2 = self.player:getHeroMgr():getHeroById(2)
		self.hero3 = self.player:getHeroMgr():getHeroById(3)
		self.hero4 = self.player:getHeroMgr():getHeroById(4)
	end;
	
	initFightActor = function(self, actor, p)
		if p.id ~= nil then
			actor:setId(p.id)
		end
		if p.innerHero ~= nil then
			actor:setHero(p.innerHero)
		end
		if p.pos ~= nil then
			actor:setPos(p.pos.x, p.pos.y)
		end
		if p.camp ~= nil then
			actor:setCamp(p.camp)
		end
		if actor:getType() == ACTOR_TYPE.WALL then
			local wallData = WallActorData()
			wallData:setHPAndDEF(100, 1)
			actor:setWallData(wallData)
		end;
		return actor
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
});

local TestCaseFightSortSeqHdr = TestCaseBaseFightHdr:extends({
	testSortHeroAttackSequence = function(self)
		self.attackerArmy = {lineupId=0,actors={HeroActor()}}
		self.defenderArmy = {lineupId=0,actors={HeroActor()}}
		self:initFightActor(self.attackerArmy.actors[1], {innerHero=self.hero1})
		self:initFightActor(self.defenderArmy.actors[1], {innerHero=self.hero2})
		
		self.fightHdr:initParams(self.mapId, self.attackerArmy, self.defenderArmy)
		self.fightHdr:sortAttackSequence()
		local sortActors = self.fightHdr:getSortActors()
		assert( sortActors[1]:getAttackSpeed() >= sortActors[2]:getAttackSpeed() )
	end;
	
	testSortAttackSequence = function(self)
		self.attackerArmy = {lineupId=180001,actors={SoldierActor()}}
		self.defenderArmy = {lineupId=180001,actors={WallActorProxy(),SoldierActor(),CityDefActor()}}
		self:initFightActor(self.attackerArmy.actors[1], {innerHero=self.hero1})
		self:initFightActor(self.defenderArmy.actors[2], {innerHero=self.hero2})
		
		self.fightHdr:initParams(self.mapId, self.attackerArmy, self.defenderArmy)
		self.fightHdr:sortAttackSequence()
		local sortActors = self.fightHdr:getSortActors()

		assert( sortActors[1]:getAttackSpeed() >= sortActors[2]:getAttackSpeed() )
		assert( sortActors[2]:getAttackSpeed() >= sortActors[3]:getAttackSpeed() )
		assert( sortActors[3]:getAttackSpeed() >= sortActors[4]:getAttackSpeed() )
		
		assert( sortActors[1]:getType() == ACTOR_TYPE.SOLDIER )
		assert( sortActors[2]:getType() == ACTOR_TYPE.SOLDIER )
		assert( sortActors[3]:getType() == ACTOR_TYPE.WALL )
		assert( sortActors[4]:getType() == ACTOR_TYPE.DEF )
	end;
})

local TestCaseFightGetRecentlyActorHdr = TestCaseBaseFightHdr:extends({
	testGetRecentlyActorHasWall = function(self)
		self.attackerArmy = {lineupId=180001,actors={SoldierActor(),SoldierActor()}}
		self.defenderArmy = {lineupId=180001,actors={WallActorProxy(),SoldierActor(),SoldierActor(),CityDefActor()}}
		
		self.attacker1 = self:initFightActor(self.attackerArmy.actors[1], {pos={x=0,y=0}, innerHero=self.hero1, camp=FIGHT_CAMP.ATTACK})
		self.attacker2 = self:initFightActor(self.attackerArmy.actors[2], {pos={x=1,y=0}, innerHero=self.hero2, camp=FIGHT_CAMP.ATTACK})
		
		self.defender1 = self:initFightActor(self.defenderArmy.actors[1], {pos={x=3,y=2}, camp=FIGHT_CAMP.DEFEND})
		self.defender2 = self:initFightActor(self.defenderArmy.actors[2], {pos={x=5,y=3}, innerHero=self.hero3, camp=FIGHT_CAMP.DEFEND})
		self.defender3 = self:initFightActor(self.defenderArmy.actors[3], {pos={x=4,y=3}, innerHero=self.hero4, camp=FIGHT_CAMP.DEFEND})
		self.defender4 = self:initFightActor(self.defenderArmy.actors[4], {pos={x=2,y=1}, camp=FIGHT_CAMP.DEFEND})
		
		self.fightHdr:initParams(self.mapId, self.attackerArmy, self.defenderArmy)
		self.fightHdr:sortAttackSequence()
		local recentlyGetter = RecentlyActorGetter()
		recentlyGetter:setActors(self.fightHdr:getSortActors())
		
		local recentlyActor, distance = recentlyGetter:getRecentlyActor(self.attacker1) 
		assert ( distance == 7 )
		assert ( recentlyActor == self.defender3 )
		
		self.defender3:die()
		
		recentlyActor, distance = recentlyGetter:getRecentlyActor(self.attacker1) 
		assert ( distance == 8 )
		assert ( recentlyActor == self.defender2 )
	end;
	
	testGetRecentlyActorHasOnlyWall = function(self)
		self.attackerArmy = {lineupId=180001,actors={SoldierActor()}}
		self.defenderArmy = {lineupId=180001,actors={WallActorProxy(),CityDefActor(),WallActorProxy()}}

		self.attacker1 = self:initFightActor(self.attackerArmy.actors[1], {pos={x=0,y=0}, innerHero=self.hero1, camp=FIGHT_CAMP.ATTACK})
		
		self.defender1 = self:initFightActor(self.defenderArmy.actors[1], {pos={x=4,y=3}, camp=FIGHT_CAMP.DEFEND})
		self.defender2 = self:initFightActor(self.defenderArmy.actors[2], {pos={x=2,y=1}, camp=FIGHT_CAMP.DEFEND})
		self.defender3 = self:initFightActor(self.defenderArmy.actors[3], {pos={x=3,y=2}, camp=FIGHT_CAMP.DEFEND})
		
		self.fightHdr:initParams(self.mapId, self.attackerArmy, self.defenderArmy)
		self.fightHdr:sortAttackSequence()
		local recentlyGetter = RecentlyActorGetter()
		recentlyGetter:setActors(self.fightHdr:getSortActors())
		
		local recentlyActor, distance = recentlyGetter:getRecentlyActor(self.attacker1) 
		assert ( distance == 5 )
		assert ( recentlyActor == self.defender3 )
		
		self.defender3:die()
		recentlyActor, distance = recentlyGetter:getRecentlyActor(self.attacker1) 
		assert ( distance == 7 )
		assert ( recentlyActor == self.defender1 )
	end;
	
	testDefenderGetHorizontalRecentlyActor = function(self)
		--   | attacker1  |  empty  |  defender1 |  defender2 | attacker2 |
		--   | empty        |  empty  |  empty        |  attacker3   |   empty     |
		self.attackerArmy = {lineupId=180001,actors={SoldierActor(),SoldierActor(),SoldierActor()}}
		self.defenderArmy = {lineupId=180001,actors={SoldierActor(),SoldierActor()}}
		self.attacker1 = self:initFightActor(self.attackerArmy.actors[1], {pos={x=0,y=0}, innerHero=self.hero1, camp=FIGHT_CAMP.ATTACK})
		self.attacker2 = self:initFightActor(self.attackerArmy.actors[2], {pos={x=4,y=0}, innerHero=self.hero2, camp=FIGHT_CAMP.ATTACK})
		self.attacker3 = self:initFightActor(self.attackerArmy.actors[3], {pos={x=3,y=1}, innerHero=self.hero2, camp=FIGHT_CAMP.ATTACK})
		
		self.defender1 = self:initFightActor(self.defenderArmy.actors[1], {pos={x=2,y=0}, innerHero=self.hero3, camp=FIGHT_CAMP.DEFEND})
		self.defender2 = self:initFightActor(self.defenderArmy.actors[2], {pos={x=3,y=0}, innerHero=self.hero4, camp=FIGHT_CAMP.DEFEND})
		
		self.fightHdr:initParams(self.mapId, self.attackerArmy, self.defenderArmy)
		self.fightHdr:sortAttackSequence()
		local recentlyGetter = RecentlyActorGetter()
		recentlyGetter:setActors(self.fightHdr:getSortActors())
		
		local recentlyActor, distance = recentlyGetter:getHRecentlyActor(self.defender2) 
		assert ( distance == 3 )
		assert ( recentlyActor == self.attacker1 )
		
		self.attacker1:die()
		recentlyActor, distance = recentlyGetter:getHRecentlyActor(self.defender2) 
		assert ( distance == 0xffff )
		assert ( recentlyActor == nil )
	end;
	
	testAttackerGetHorizontalRecentlyActor = function(self)
		--   | attacker1  |  empty  |  defender1 |  defender2 | attacker2 |
		--   | empty        |  empty  |  empty        |  attacker3   |   empty     |
		self.attackerArmy = {lineupId=180001,actors={SoldierActor(),SoldierActor(),SoldierActor()}}
		self.defenderArmy = {lineupId=180001,actors={SoldierActor(),SoldierActor()}}

		self.attacker1 = self:initFightActor(self.attackerArmy.actors[1], {pos={x=0,y=0}, innerHero=self.hero1, camp=FIGHT_CAMP.ATTACK})
		self.attacker2 = self:initFightActor(self.attackerArmy.actors[2], {pos={x=4,y=0}, innerHero=self.hero2, camp=FIGHT_CAMP.ATTACK})
		self.attacker3 = self:initFightActor(self.attackerArmy.actors[3], {pos={x=3,y=1}, innerHero=self.hero2, camp=FIGHT_CAMP.ATTACK})

		self.defender1 = self:initFightActor(self.defenderArmy.actors[1], {pos={x=2,y=0}, innerHero=self.hero3, camp=FIGHT_CAMP.DEFEND})
		self.defender2 = self:initFightActor(self.defenderArmy.actors[2], {pos={x=3,y=0}, innerHero=self.hero4, camp=FIGHT_CAMP.DEFEND})

		self.fightHdr:initParams(self.mapId, self.attackerArmy, self.defenderArmy)
		self.fightHdr:sortAttackSequence()
		local recentlyGetter = RecentlyActorGetter()
		recentlyGetter:setActors(self.fightHdr:getSortActors())
		
		local recentlyActor, distance = recentlyGetter:getHRecentlyActor(self.attacker1) 
		assert ( distance == 2 )
		assert ( recentlyActor == self.defender1 )
		
		recentlyActor, distance = recentlyGetter:getHRecentlyActor(self.attacker3) 
		assert ( distance == 0xffff )
		assert ( recentlyActor == nil )
	end;
	
	testGetAllInRangeActors = function(self)
		--   | attacker1  |  empty  |  defender1 |  defender2 | attacker2 |
		--   | empty        |  empty  |  empty        |  attacker3   |   empty     |
		self.attackerArmy = {lineupId=180001,actors={SoldierActor(),SoldierActor(),SoldierActor()}}
		self.defenderArmy = {lineupId=180001,actors={SoldierActor(),SoldierActor()}}

		self.attacker1 = self:initFightActor(self.attackerArmy.actors[1], {pos={x=0,y=0}, innerHero=self.hero1, camp=FIGHT_CAMP.ATTACK})
		self.attacker2 = self:initFightActor(self.attackerArmy.actors[2], {pos={x=4,y=0}, innerHero=self.hero2, camp=FIGHT_CAMP.ATTACK})
		self.attacker3 = self:initFightActor(self.attackerArmy.actors[3], {pos={x=3,y=1}, innerHero=self.hero2, camp=FIGHT_CAMP.ATTACK})

		self.defender1 = self:initFightActor(self.defenderArmy.actors[1], {pos={x=2,y=0}, innerHero=self.hero3, camp=FIGHT_CAMP.DEFEND})
		self.defender2 = self:initFightActor(self.defenderArmy.actors[2], {pos={x=3,y=0}, innerHero=self.hero4, camp=FIGHT_CAMP.DEFEND})

		self.fightHdr:initParams(self.mapId, self.attackerArmy, self.defenderArmy)
		self.fightHdr:sortAttackSequence()
		local recentlyGetter = RecentlyActorGetter()
		recentlyGetter:setActors(self.fightHdr:getSortActors())
		
		self.attacker1.getAttackRange = function() return 3 end
		
		local actors = recentlyGetter:getAllInRangeActors(self.attacker1) 
		assert ( table.getn(actors) == 2 )
	end;
	
	testGetAllInRangeActors = function(self)
		--   | attacker1  |  empty  |  defender1 |  defender2 | attacker2 |
		--   | empty        |  empty  |  empty        |  attacker3   |   empty     |
		self.attackerArmy = {lineupId=180001,actors={SoldierActor(),SoldierActor(),SoldierActor()}}
		self.defenderArmy = {lineupId=180001,actors={SoldierActor(),SoldierActor()}}

		self.attacker1 = self:initFightActor(self.attackerArmy.actors[1], {pos={x=0,y=0}, innerHero=self.hero1, camp=FIGHT_CAMP.ATTACK})
		self.attacker2 = self:initFightActor(self.attackerArmy.actors[2], {pos={x=4,y=0}, innerHero=self.hero2, camp=FIGHT_CAMP.ATTACK})
		self.attacker3 = self:initFightActor(self.attackerArmy.actors[3], {pos={x=3,y=1}, innerHero=self.hero2, camp=FIGHT_CAMP.ATTACK})

		self.defender1 = self:initFightActor(self.defenderArmy.actors[1], {pos={x=2,y=0}, innerHero=self.hero3, camp=FIGHT_CAMP.DEFEND})
		self.defender2 = self:initFightActor(self.defenderArmy.actors[2], {pos={x=3,y=0}, innerHero=self.hero4, camp=FIGHT_CAMP.DEFEND})

		self.fightHdr:initParams(self.mapId, self.attackerArmy, self.defenderArmy)
		self.fightHdr:sortAttackSequence()
		local recentlyGetter = RecentlyActorGetter()
		recentlyGetter:setActors(self.fightHdr:getSortActors())
		
		self.attacker1.getAttackRange = function() return 1 end
		
		local actor = recentlyGetter:getHighPriCanAttackActor(self.attacker1) 
		assert ( actor == nil )
		
		self.attacker1.getAttackRange = function() return 2 end
		actor = recentlyGetter:getHighPriCanAttackActor(self.attacker1) 
		assert ( actor == self.defender1 )
		
		-- 兵种相克的优先攻击
		self.attacker1.getAttackRange = function() return 3 end
		self.attacker1:getHero():carrySoldier({resid=150001001,number=1})
		self.attacker1:copyAttrs()
		self.defender1:getHero():carrySoldier({resid=150004001,number=1})
		self.defender1:copyAttrs()
		self.defender2:getHero():carrySoldier({resid=150002001,number=1})
		self.defender2:copyAttrs()
		actor = recentlyGetter:getHighPriCanAttackActor(self.attacker1) 
		assert ( actor == self.defender2 )
		
		-- 可攻击到我的，我优先攻击他
		self.attacker1.getAttackRange = function() return 3 end
		self.attacker1:getHero():carrySoldier({resid=0,number=0})
		self.attacker1:copyAttrs()
		self.defender1:getHero():carrySoldier({resid=0,number=0})
		self.defender1:copyAttrs()
		self.defender1.getAttackRange = function() return 1 end
		self.defender2:getHero():carrySoldier({resid=0,number=0})
		self.defender2:copyAttrs()
		self.defender2.getAttackRange = function() return 3 end
		actor = recentlyGetter:getHighPriCanAttackActor(self.attacker1) 
		assert ( actor == self.defender2 )
		
		-- 其他情况的，我优先攻击最近的
		self.attacker1.getAttackRange = function() return 3 end
		self.attacker1:getHero():carrySoldier({resid=0,number=0})
		self.attacker1:copyAttrs()
		self.defender1:getHero():carrySoldier({resid=0,number=0})
		self.defender1:copyAttrs()
		self.defender1.getAttackRange = function() return 1 end
		self.defender2:getHero():carrySoldier({resid=0,number=0})
		self.defender2:copyAttrs()
		self.defender2.getAttackRange = function() return 1 end
		actor = recentlyGetter:getHighPriCanAttackActor(self.attacker1) 
		assert ( actor == self.defender1 )
		
		self.attacker1.getAttackRange = function() return 3 end
		self.attacker1:getHero():carrySoldier({resid=150001001,number=1})
		self.attacker1:copyAttrs()
		self.defender1:getHero():carrySoldier({resid=150002001,number=1})
		self.defender1.getAttackRange = function() return 3 end
		self.defender1:copyAttrs()
		self.defender2:getHero():carrySoldier({resid=150002001,number=1})
		self.defender2.getAttackRange = function() return 3 end
		self.defender2:copyAttrs()
		actor = recentlyGetter:getHighPriCanAttackActor(self.attacker1) 
		assert ( actor == self.defender1 )
	end;
});

local TestCaseFightMoveHdr = TestCaseBaseFightHdr:extends({
	testMoveActorHorizontalFoward = function(self)
		-- |  attacker1 |  defender1 | empty |  empty | empty | defender2 | empty      | empty         |
		-- |  empty    |  empty           | empty |  empty | empty | empty         | attacker2 | empty         |
		FightMapHdr:initMap(40, 5)
		
		self.attackerArmy = {lineupId=180001,actors={SoldierActor(),SoldierActor()}}
		self.defenderArmy = {lineupId=180001,actors={SoldierActor(),SoldierActor(),WallActorProxy(),CityDefActor()}}
		
		self.attacker1 = self:initFightActor(self.attackerArmy.actors[1], {pos={x=0,y=0}, innerHero=self.hero1, camp=FIGHT_CAMP.ATTACK})
		self.attacker2 = self:initFightActor(self.attackerArmy.actors[2], {pos={x=6,y=1}, innerHero=self.hero2, camp=FIGHT_CAMP.ATTACK})
	
		self.defender1 = self:initFightActor(self.defenderArmy.actors[1], {pos={x=1,y=0}, innerHero=self.hero3, camp=FIGHT_CAMP.DEFEND})
		self.defender2 = self:initFightActor(self.defenderArmy.actors[2], {pos={x=5,y=0}, innerHero=self.hero4, camp=FIGHT_CAMP.DEFEND})
		self.wall = self:initFightActor(self.defenderArmy.actors[3], {pos={x=30,y=0}, camp=FIGHT_CAMP.DEFEND})
		self.def = self:initFightActor(self.defenderArmy.actors[4], {pos={x=30,y=0}, camp=FIGHT_CAMP.DEFEND})
		
		
		self.fightHdr:initParams(self.mapId, self.attackerArmy, self.defenderArmy)
		self.fightHdr:sortAttackSequence()
		local recentlyGetter = RecentlyActorGetter()
		recentlyGetter:setActors(self.fightHdr:getSortActors())
		local actorMoveAI = ActorMoveAI()
		actorMoveAI:setActors(self.fightHdr:getSortActors())
		actorMoveAI:setRecentlyGetter(recentlyGetter)
		
		self.defender2.getMoveRange = function() return 2 end
		self.defender2.getAttackRange = function() return 1 end
		
		local targetActor, targetDis = actorMoveAI:moveActor(self.defender2)
		assert(self.defender2:getPos().x == 3)
		assert(targetActor == self.attacker1)
		assert(targetDis == 3)
		
		-- |  attacker1 |  empty        | defender1 |  empty         | empty | empty       | empty       | defender2         |
		-- |  empty    |  empty           | empty         |  empty        | empty | empty         | attacker2 | empty         |
		self.defender2:moveTo(7,0)
		targetActor, targetDis = actorMoveAI:moveActor(self.defender2)
		assert(self.defender2:getPos().x == 6, 'find can attack actor before moverange end point')
		assert(targetActor == self.attacker2)
		assert(targetDis == 1)
		
		-- |  attacker1 |  empty        | defender1 |  empty         | empty | empty       | empty       | defender2         |
		-- |  empty    |  empty           | empty         |  empty        | empty | empty         | attacker2 | empty         |
		self.defender2:moveTo(7,0)
		self.defender2.getMoveRange = function() return 4 end
		self.defender2.getAttackRange = function() return 3 end
		targetActor, targetDis = actorMoveAI:moveActor(self.defender2)
		assert(self.defender2:getPos().x == 3, 'direct move')
		assert(targetActor == self.attacker1 )
		assert(targetDis == 3 )
		
		-- |  attacker1 |  empty        | defender1 |  empty         | empty | empty       | empty       | defender2         |
		-- |  empty    |  empty           | empty         |  empty        | empty | empty         | attacker2 | empty         |
		self.defender2:moveTo(7,0)
		self.defender2.getMoveRange = function() return 4 end
		self.defender2.getAttackRange = function() return 4 end
		targetActor, targetDis = actorMoveAI:moveActor(self.defender2)
		assert(self.defender2:getPos().x == 4, 'direct move')
		assert(targetActor == self.attacker1 )
		assert(targetDis == 4 )
		
		-- |  attacker1 |  empty        | defender1 |  empty         | empty | empty       | empty       | defender2         |
		-- |  empty    |  empty           | empty         |  empty        | empty | empty         | attacker2 | empty         |
		self.defender2:moveTo(7,0)
		self.defender2.getMoveRange = function() return 6 end
		self.defender2.getAttackRange = function() return 1 end
		targetActor, targetDis = actorMoveAI:moveActor(self.defender2)
		assert( self.defender2:getPos().x == 6, "can't direct move to, find recently attacker2")
		assert( self.defender2:getPos().y == 0 )
		assert(targetActor == self.attacker2 )
		assert(targetDis == 1 )
		
		-- |  attacker1 |  empty        | defender1 |  empty         | wall     | def             | empty        | defender2(die)         |
		-- |  empty    |  empty           | empty         |  empty        | empty | empty         | attacker2 | empty                          |
		self.wall:moveTo(4,0)
		self.def:moveTo(5,0)
		self.defender2:moveTo(7,0)
		self.defender2:die()
		self.attacker2.getMoveRange = function() return 6 end
		self.attacker2.getAttackRange = function() return 2 end
		targetActor, targetDis = actorMoveAI:moveActor(self.attacker2)
		assert ( targetActor == self.defender1 )
		assert ( targetDis == 2 )
		
		-- |  attacker1 |  empty        | defender1(die)  |  empty         | wall     | def             | empty        | defender2(die)         |
		-- |  empty    |  empty           | empty                   |  empty        | empty | empty         | attacker2 | empty                          |
		self.defender1:die()
		self.attacker2:moveTo(6,1)
		targetActor, targetDis = actorMoveAI:moveActor(self.attacker2)
		assert ( targetActor == self.wall )
		assert ( targetDis == 2 )
		assert ( self.attacker2:getPos().x == 5 )
	end;
	
	testMoveActorCommonState = function(self)
		-- |  empty    |  defender1 | empty |  empty | empty  | defender2   | empty      | attacker1         |
		-- |  empty    |  empty           | empty |  empty | empty | empty         | attacker2 | empty         |
		FightMapHdr:initMap(40, 5)
		
		self.attackerArmy = {lineupId=180001,actors={SoldierActor(),SoldierActor()}}
		self.defenderArmy = {lineupId=180001,actors={SoldierActor(),SoldierActor()}}

		self.attacker1 = self:initFightActor(self.attackerArmy.actors[1], {pos={x=7,y=0}, innerHero=self.hero1, camp=FIGHT_CAMP.ATTACK})
		self.attacker2 = self:initFightActor(self.attackerArmy.actors[2], {pos={x=6,y=1}, innerHero=self.hero2, camp=FIGHT_CAMP.ATTACK})

		self.defender1 = self:initFightActor(self.defenderArmy.actors[1], {pos={x=1,y=0}, innerHero=self.hero3, camp=FIGHT_CAMP.DEFEND})
		self.defender2 = self:initFightActor(self.defenderArmy.actors[2], {pos={x=5,y=0}, innerHero=self.hero4, camp=FIGHT_CAMP.DEFEND})
		
		self.fightHdr:initParams(self.mapId, self.attackerArmy, self.defenderArmy)
		self.fightHdr:sortAttackSequence()
		local recentlyGetter = RecentlyActorGetter()
		recentlyGetter:setActors(self.fightHdr:getSortActors())
		local actorMoveAI = ActorMoveAI()
		actorMoveAI:setActors(self.fightHdr:getSortActors())
		actorMoveAI:setRecentlyGetter(recentlyGetter)	
		
		self.defender1.getMoveRange = function() return 4 end
		self.defender1.getAttackRange = function() return 1 end
		actorMoveAI:moveActor(self.defender1)
		assert( self.defender1:getPos().x == 4 )
		assert( self.defender1:getPos().y == 1 )
	end;
});

local TestCaseFightMapHdr = TestCase:extends({
	testGetMask = function(self)
		FightMapHdr:initMap(40, 5)
		assert ( FightMapHdr:getMask(0,0) == 0 )
		assert ( FightMapHdr:getMask(-1,0) == 1 )
		assert ( FightMapHdr:getMask(40,0) == 1 )
		assert ( FightMapHdr:getMask(0,-1) == 1 )
		assert ( FightMapHdr:getMask(0,5) == 1 )
	end;
	
	testSetMask = function(self)
		FightMapHdr:initMap(40, 5)
		FightMapHdr:setMask(1,1,1)
		assert ( FightMapHdr:getMask(1,1) == 1 )
	end;
	
	initMasks = function(self)
		-- | 0 | 0 | 0 | 0 | 0 |
		-- | 0 | 1 | 1 | 1 | 0 |
		-- | 0 | 0 | 0 | 1 | 0 |
		-- | 0 | 0 | 0 | 1 | 0 |
		-- | 0 | 0 | 0 | 0 | 0 |
		FightMapHdr:initMap(5, 5)
		FightMapHdr:setMask(1,1,1)
		FightMapHdr:setMask(2,1,1)
		FightMapHdr:setMask(3,1,1)
		FightMapHdr:setMask(3,2,1)
		FightMapHdr:setMask(3,3,1)
	end;

	testFillDisVal = function(self)
		self:initMasks()
		FightMapHdr:fillDisVal(2,2)
		
		assert(FightMapHdr:getDisVal(0,0) == 4)
		assert(FightMapHdr:getDisVal(1,0) == 5)
		assert(FightMapHdr:getDisVal(2,0) == 6)
		assert(FightMapHdr:getDisVal(3,0) == 7)
		assert(FightMapHdr:getDisVal(4,0) == 8)
		
		assert(FightMapHdr:getDisVal(0,1) == 3)
		assert(FightMapHdr:getDisVal(1,1) == 0xffff)
		assert(FightMapHdr:getDisVal(2,1) == 0xffff)
		assert(FightMapHdr:getDisVal(3,1) == 0xffff)
		assert(FightMapHdr:getDisVal(4,1) == 7)
		
		assert(FightMapHdr:getDisVal(0,2) == 2)
		assert(FightMapHdr:getDisVal(1,2) == 1)
		assert(FightMapHdr:getDisVal(2,2) == 0)
		assert(FightMapHdr:getDisVal(3,2) == 0xffff)
		assert(FightMapHdr:getDisVal(4,2) == 6)
		
		assert(FightMapHdr:getDisVal(0,3) == 3)
		assert(FightMapHdr:getDisVal(1,3) == 2)
		assert(FightMapHdr:getDisVal(2,3) == 1)
		assert(FightMapHdr:getDisVal(3,3) == 0xffff)
		assert(FightMapHdr:getDisVal(4,3) == 5)
		
		assert(FightMapHdr:getDisVal(0,4) == 4)
		assert(FightMapHdr:getDisVal(1,4) == 3)
		assert(FightMapHdr:getDisVal(2,4) == 2)
		assert(FightMapHdr:getDisVal(3,4) == 3)
		assert(FightMapHdr:getDisVal(4,4) == 4)
	end;
	
	testGetMinDisVal = function(self)
		self:initMasks()
		FightMapHdr:fillDisVal(2,2)
		
		local dis, x, y = FightMapHdr:getMinDisVal(0, 2, 1)
		assert ( dis == 1 )
		assert ( x == 1 )
		assert ( y == 2 )
	end;
	
	testFindPaths = function(self)
		self:initMasks()
		FightMapHdr:fillDisVal(2,2)
		
		local paths = FightMapHdr:findPaths(4, 2, 3)
		assert( table.getn(paths) == 3 )
		assert( paths[1].x == 3 )
		assert( paths[1].y == 4 )
		assert( paths[2].x == 2 )
		assert( paths[2].y == 4 )
		assert( paths[3].x == 2 )
		assert( paths[3].y == 3 )
		
		paths = FightMapHdr:findPaths(2, 4, 3)
		assert( table.getn(paths) == 2 )
		assert( paths[1].x == 2 )
		assert( paths[1].y == 4 )
		assert( paths[2].x == 2 )
		assert( paths[2].y == 3 )
		
		paths = FightMapHdr:findPaths(2, 2, 3)
		assert( table.getn(paths) == 0 )
	end;
});

local TestCaseArmyPosIniter = TestCase:extends({
	setUp = function(self)
		self.mapId = 9920003
		self.armyPosIniter = CampsPosIniter()
	end;
	
	testInitSingleHeroFightPos = function(self)
		self.attackerArmy = {lineupId=0,actors={HeroActor()}}
		self.defenderArmy = {lineupId=0,actors={HeroActor()}}
		self.armyPosIniter:initParams(self.mapId, self.attackerArmy, self.defenderArmy)
		self.armyPosIniter:initPos()
		assert ( self.attackerArmy.actors[1]:getPos().x == 0 )
		assert ( self.attackerArmy.actors[1]:getPos().y == 0 )
		assert ( self.defenderArmy.actors[1]:getPos().x == 1 )
		assert ( self.defenderArmy.actors[1]:getPos().y == 0 )
	end;
	
	testInitMultiActorsFightPosWithoutWall = function(self)
		self.attackerArmy = {lineupId=180001,actors={SoldierActor(),SoldierActor(),SoldierActor(),SoldierActor(),SoldierActor()}}
		for i, actor in ipairs(self.attackerArmy.actors) do
			actor:setLineupPos(i)
		end;
		self.defenderArmy = {lineupId=180001,actors={SoldierActor(),SoldierActor(),SoldierActor(),SoldierActor(),SoldierActor()}}
		for i, actor in ipairs(self.defenderArmy.actors) do
			actor:setLineupPos(i)
		end;
		
		self.armyPosIniter:initParams(self.mapId, self.attackerArmy, self.defenderArmy)
		self.armyPosIniter:initPos()
		
		assert ( self.attackerArmy.actors[1]:getPos().x == 2 )
		assert ( self.attackerArmy.actors[1]:getPos().y == 0 )
		assert ( self.attackerArmy.actors[2]:getPos().x == 2 )
		assert ( self.attackerArmy.actors[2]:getPos().y == 1 )
		assert ( self.attackerArmy.actors[3]:getPos().x == 2 )
		assert ( self.attackerArmy.actors[3]:getPos().y == 2 )
		assert ( self.attackerArmy.actors[4]:getPos().x == 1 )
		assert ( self.attackerArmy.actors[4]:getPos().y == 0 )
		assert ( self.attackerArmy.actors[5]:getPos().x == 1 )
		assert ( self.attackerArmy.actors[5]:getPos().y == 1 )
		
		assert ( self.defenderArmy.actors[1]:getPos().x == 17 )
		assert ( self.defenderArmy.actors[1]:getPos().y == 0 )
		assert ( self.defenderArmy.actors[2]:getPos().x == 17 )
		assert ( self.defenderArmy.actors[2]:getPos().y == 1 )
		assert ( self.defenderArmy.actors[3]:getPos().x == 17 )
		assert ( self.defenderArmy.actors[3]:getPos().y == 2 )
		assert ( self.defenderArmy.actors[4]:getPos().x == 18 )
		assert ( self.defenderArmy.actors[4]:getPos().y == 0 )
		assert ( self.defenderArmy.actors[5]:getPos().x == 18 )
		assert ( self.defenderArmy.actors[5]:getPos().y == 1 )
	end;
	
	testInitMultiActorsFightPosWithWall = function(self)
		self.attackerArmy = {lineupId=180001,actors={SoldierActor(),SoldierActor(),SoldierActor(),SoldierActor(),SoldierActor()}}
		for i, actor in ipairs(self.attackerArmy.actors) do
			actor:setLineupPos(i)
		end;
		self.defenderArmy = {lineupId=180001,actors={SoldierActor(),SoldierActor(),SoldierActor(),SoldierActor(),SoldierActor(),WallActorProxy(),WallActorProxy(),WallActorProxy(),CityDefActor(),CityDefActor(),CityDefActor(),CityDefActor(),CityDefActor()}}
		for i, actor in ipairs(self.defenderArmy.actors) do
			actor:setLineupPos(i)
		end;
		
		self.armyPosIniter:initParams(self.mapId, self.attackerArmy, self.defenderArmy)
		self.armyPosIniter:initPos()
		
		assert ( self.attackerArmy.actors[1]:getPos().x == 2 )
		assert ( self.attackerArmy.actors[1]:getPos().y == 0 )
		assert ( self.attackerArmy.actors[2]:getPos().x == 2 )
		assert ( self.attackerArmy.actors[2]:getPos().y == 1 )
		assert ( self.attackerArmy.actors[3]:getPos().x == 2 )
		assert ( self.attackerArmy.actors[3]:getPos().y == 2 )
		assert ( self.attackerArmy.actors[4]:getPos().x == 1 )
		assert ( self.attackerArmy.actors[4]:getPos().y == 0 )
		assert ( self.attackerArmy.actors[5]:getPos().x == 1 )
		assert ( self.attackerArmy.actors[5]:getPos().y == 1 )
		
		assert ( self.defenderArmy.actors[1]:getPos().x == 16 )
		assert ( self.defenderArmy.actors[1]:getPos().y == 0 )
		assert ( self.defenderArmy.actors[2]:getPos().x == 16 )
		assert ( self.defenderArmy.actors[2]:getPos().y == 1 )
		assert ( self.defenderArmy.actors[3]:getPos().x == 16 )
		assert ( self.defenderArmy.actors[3]:getPos().y == 2 )
		assert ( self.defenderArmy.actors[4]:getPos().x == 17 )
		assert ( self.defenderArmy.actors[4]:getPos().y == 0 )
		assert ( self.defenderArmy.actors[5]:getPos().x == 17 )
		assert ( self.defenderArmy.actors[5]:getPos().y == 1 )
		
		assert ( self.defenderArmy.actors[6]:getPos().x == 19 )
		assert ( self.defenderArmy.actors[6]:getPos().y == 0 )
		assert ( self.defenderArmy.actors[7]:getPos().x == 19 )
		assert ( self.defenderArmy.actors[7]:getPos().y == 1 )
		assert ( self.defenderArmy.actors[8]:getPos().x == 19 )
		assert ( self.defenderArmy.actors[8]:getPos().y == 2 )
		
		assert ( self.defenderArmy.actors[9]:getPos().x == 20 )
		assert ( self.defenderArmy.actors[9]:getPos().y == 0 )
		assert ( self.defenderArmy.actors[10]:getPos().x == 20 )
		assert ( self.defenderArmy.actors[10]:getPos().y == 1 )
		assert ( self.defenderArmy.actors[11]:getPos().x == 20 )
		assert ( self.defenderArmy.actors[11]:getPos().y == 2 )
		assert ( self.defenderArmy.actors[12]:getPos().x == 21 )
		assert ( self.defenderArmy.actors[12]:getPos().y == 0 )
		assert ( self.defenderArmy.actors[13]:getPos().x == 21 )
		assert ( self.defenderArmy.actors[13]:getPos().y == 1 )
	end;
});

local TestCaseFightMoveAndAttackHdr = TestCaseBaseFightHdr:extends({
	testHasTargetActor = function(self)
		-- |  attacker           |  defender           |
		FightMapHdr:initMap(40, 5)
		
		self.attackerArmy = {lineupId=180001,actors={SoldierActor()}}
		self.defenderArmy = {lineupId=180001,actors={SoldierActor()}}
		
		self.attacker = self:initFightActor(self.attackerArmy.actors[1], {pos={x=0,y=0}, innerHero=self.hero1, camp=FIGHT_CAMP.ATTACK})
		self.defender = self:initFightActor(self.defenderArmy.actors[1], {pos={x=0,y=1}, innerHero=self.hero2, camp=FIGHT_CAMP.DEFEND})
		
		self.fightHdr:initParams(self.mapId, self.attackerArmy, self.defenderArmy)
		self.fightHdr:sortAttackSequence()
		
		local attacked = false
		self.attacker.attack = function() attacked = true end
		self.attacker:setAttackTarget(self.defender)
		self.fightHdr:attackTarget(self.attacker)
		assert ( attacked == true )
		
		attacked = false
		self.defender:die()
		self.fightHdr:attackTarget(self.attacker)
		assert ( attacked == false )
	end;
	
	testAttackRecentlyTarget = function(self)
		-- |  attacker           |  empty           | defender1 |
		-- |  defender2       |  empty           | empty        | 
		FightMapHdr:initMap(40, 5)
		
		self.attackerArmy = {lineupId=180001,actors={SoldierActor()}}
		self.defenderArmy = {lineupId=180001,actors={SoldierActor(), SoldierActor()}}
		
		self.attacker = self:initFightActor(self.attackerArmy.actors[1], {pos={x=0,y=0}, innerHero=self.hero1, camp=FIGHT_CAMP.ATTACK})
		
		self.defender1 = self:initFightActor(self.defenderArmy.actors[1], {pos={x=2,y=0}, innerHero=self.hero2, camp=FIGHT_CAMP.DEFEND})
		self.defender2 = self:initFightActor(self.defenderArmy.actors[2], {pos={x=0,y=1}, innerHero=self.hero3, camp=FIGHT_CAMP.DEFEND})
		
		self.fightHdr:initParams(self.mapId, self.attackerArmy, self.defenderArmy)
		self.fightHdr:sortAttackSequence()
		
		local target_ = nil
		self.attacker.attack = function(self, target) target_ = target end
		self.fightHdr:attackTarget(self.attacker)
		assert ( target_ == self.defender2 )
	end;
})

	
local TestCaseFightRound = TestCaseBaseFightHdr:extends({
	createArmys = function(self)
		FightMapHdr:initMap(40, 5)
		
		self.attackerArmy = {lineupId=180001,actors={SoldierActor()}}
		self.defenderArmy = {lineupId=180001,actors={SoldierActor()}}
		
		self.attacker = self:initFightActor(self.attackerArmy.actors[1], {pos={x=0,y=0}, innerHero=self.hero1, camp=FIGHT_CAMP.ATTACK})
		self.defender = self:initFightActor(self.defenderArmy.actors[1], {pos={x=0,y=1}, innerHero=self.hero2, camp=FIGHT_CAMP.DEFEND})
		
		self.fightHdr:initParams(self.mapId, self.attackerArmy, self.defenderArmy)
		self.fightHdr:sortAttackSequence()	
	end;
	
	testExecAllEffectBuffs = function(self)
		self:createArmys()
	
		self.attacker:setAttrVal(ATTR.HP, self.attacker:getAttrVal(ATTR.MHP)*0.9)
		self.defender:setAttrVal(ATTR.HP, self.defender:getAttrVal(ATTR.MHP)*0.9)
		self.attacker:clearEffectBuffs()
		self.defender:clearEffectBuffs()
		self.attacker:addProEffect({id=RES_EFF.F_SHENYI, val=10, u=1, isbuff=true, times=1})
		self.fightHdr:execAllEffectBuffs()
		assert( self.attacker:getAttrVal(ATTR.HP) == self.attacker:getAttrVal(ATTR.MHP) )
		assert( self.defender:getAttrVal(ATTR.HP) < self.defender:getAttrVal(ATTR.MHP) )
		
		self.attacker:setAttrVal(ATTR.HP, self.attacker:getAttrVal(ATTR.MHP)*0.9)
		self.defender:setAttrVal(ATTR.HP, self.defender:getAttrVal(ATTR.MHP)*0.9)
		self.attacker:clearEffectBuffs()
		self.defender:clearEffectBuffs()
		self.defender:addProEffect({id=RES_EFF.F_SHENYI, val=10, u=1, isbuff=true, times=1})
		self.fightHdr:execAllEffectBuffs()
		assert( self.attacker:getAttrVal(ATTR.HP) < self.attacker:getAttrVal(ATTR.MHP) )
		assert( self.defender:getAttrVal(ATTR.HP) == self.defender:getAttrVal(ATTR.MHP) )
		
		self.attacker:setAttrVal(ATTR.HP, self.attacker:getAttrVal(ATTR.MHP))
		self.defender:setAttrVal(ATTR.HP, self.defender:getAttrVal(ATTR.MHP))
		self.attacker:clearEffectBuffs()
		self.defender:clearEffectBuffs()
		self.attacker:addProEffect({id=RES_EFF.F_CUIDU3, val=10, u=1, isbuff=true, times=1})
		self.fightHdr:execAllEffectBuffs()
		
		assert( self.attacker:getAttrVal(ATTR.HP) < self.attacker:getAttrVal(ATTR.MHP) )
		assert( self.defender:getAttrVal(ATTR.HP) == self.defender:getAttrVal(ATTR.MHP) )
		
		self.attacker:setAttrVal(ATTR.HP, self.attacker:getAttrVal(ATTR.MHP))
		self.defender:setAttrVal(ATTR.HP, self.defender:getAttrVal(ATTR.MHP))
		self.attacker:clearEffectBuffs()
		self.defender:clearEffectBuffs()
		self.defender:addProEffect({id=RES_EFF.F_CUIDU3, val=10, u=1, isbuff=true, times=1})
		self.fightHdr:execAllEffectBuffs()
		assert( self.attacker:getAttrVal(ATTR.HP) == self.attacker:getAttrVal(ATTR.MHP) )
		assert( self.defender:getAttrVal(ATTR.HP) < self.defender:getAttrVal(ATTR.MHP) )
	end;	
	
	testClearAllEffectBuffs = function(self)
		self:createArmys()
		self.attacker:addProEffect({id=RES_EFF.F_CUIDU3, val=10, u=1, isbuff=true, times=1})
		self.defender:addProEffect({id=RES_EFF.F_CUIDU3, val=10, u=1, isbuff=true, times=1})
		self.fightHdr:clearAllEffectBuffs()
		assert( table.getn(self.attacker:getEffects()) == 0 )
		assert( table.getn(self.defender:getEffects()) == 0 )
	end;
})

local TestCaseFightActorHdr = TestCaseBaseFightHdr:extends({
	testActorDieClearMask = function(self)
		FightMapHdr:initMap(40, 5)
		local evtStream = FightEventStream()
		
		self.attackerArmy = {lineupId=180001,actors={SoldierActor()}}
		self.defenderArmy = {lineupId=180001,actors={}}
		
		self.attacker = self:initFightActor(self.attackerArmy.actors[1], {id=0, pos={x=0,y=0}, innerHero=self.hero1, camp=FIGHT_CAMP.ATTACK})
		self.attacker:setStream(evtStream)
		
		self.fightHdr:initParams(self.mapId, self.attackerArmy, self.defenderArmy)
		self.fightHdr:sortAttackSequence()
		
		assert ( FightMapHdr:getMask(0,0) == 1 )
		self.attacker:die()
		assert ( self.attacker:isDie() == true )
		assert ( FightMapHdr:getMask(0,0) == 0 )
		assert ( evtStream:getEventCnt() == 1 )
		assert ( evtStream:getEvent(0).event == 'die' )
	end;
	
	testActorMoveTo = function(self)
		FightMapHdr:initMap(40, 5)
		local evtStream = FightEventStream()
		
		self.attackerArmy = {lineupId=180001,actors={SoldierActor()}}
		self.defenderArmy = {lineupId=180001,actors={}}
		
		self.attacker = self:initFightActor(self.attackerArmy.actors[1], {id=0, pos={x=0,y=0}, innerHero=self.hero1, camp=FIGHT_CAMP.ATTACK})
		self.attacker:setStream(evtStream)
		
		self.fightHdr:initParams(self.mapId, self.attackerArmy, self.defenderArmy)
		self.fightHdr:sortAttackSequence()
		
		assert ( FightMapHdr:getMask(0,0) == 1 )
		self.attacker:moveTo(1,0)
		assert ( self.attacker:getPos().x == 1 )
		assert ( self.attacker:getPos().y == 0 )
		assert ( FightMapHdr:getMask(0,0) == 0 )
		assert ( FightMapHdr:getMask(1,0) == 1 )
		assert ( evtStream:getEventCnt() == 1 )
		assert ( evtStream:getEvent(0).event == 'move' )
	end;
})

local TestCaseHeroAttack = TestCaseBaseFightHdr:extends({
	createAttackerAndDefender = function(self)
		self.attacker = self:createHeroActor(self.hero1)
		self.attacker:recalcHP()
		self.attacker:setCamp(FIGHT_CAMP.ATTACK)
		
		self.defender = self:createHeroActor(self.hero2)
		self.defender:recalcHP()
		self.defender:setCamp(FIGHT_CAMP.DEFEND)
		
		self.attacker2 = self:createSoldierActor()
		self.attacker2:recalcHP()
		self.attacker2:setCamp(FIGHT_CAMP.ATTACK)
		
		self.defender2 = self:createSoldierActor()
		self.defender2:recalcHP()
		self.defender2:setCamp(FIGHT_CAMP.DEFEND)
		
		self.attacker3 = self:createSoldierActor()
		self.attacker3:recalcHP()
		self.attacker3:setCamp(FIGHT_CAMP.ATTACK)
		
		self.defender3 = self:createWallActor()
		self.defender3:setCamp(FIGHT_CAMP.DEFEND)
		
		self.attacker4 = self:createDefActor()
		self.attacker4:setCamp(FIGHT_CAMP.DEFEND)
		
		self.defender4 = self:createSoldierActor()
		self.defender4:recalcHP()
		self.defender4:setCamp(FIGHT_CAMP.ATTACK)
	end;
	
	createHeroActor = function(self, innerHero)
		local actor = HeroActor()
		actor.recalcAttrs = function() end -- empty this function
		actor:setHero(innerHero)
		return actor
	end;
	
	createWallActor = function(self)
		self.wallData = WallActorData()
		self.wallData:setHPAndDEF(100,1)
		local actor = WallActorProxy()
		actor:setWallData(self.wallData)
		return actor
	end;
	
	createDefActor = function(self)
		local actor = CityDefActor()
		self.cityDef = PlayerCityDef(self.player)
		self.cityDef:setDefNumber(CITYDEF_TYPE.XIANJING, 2000)
		actor:setCityDef(self.cityDef, CITYDEF_TYPE.XIANJING)
		return actor
	end;
	
	createSoldierActor = function(self)
		local actor = SoldierActor()
		actor.recalcAttrs = function() end -- empty this function
		actor:setHero(self.hero1)
		return actor
	end;
	
	testAttackSetTargetActor = function(self)
		self:createAttackerAndDefender()
		self.attacker:attack(self.defender)
		assert( self.attacker:getAttackTarget() == self.defender )
	end;
	
	testCollectFixedSkillEffects = function(self)
		self:createAttackerAndDefender()
		self.attacker.hero:addSkill({resid=6001017, level=1})
		self.attacker:collectFixedSkillEffects()
		assert( table.getn(self.attacker:getEffects()) == 1 )
		assert( self.attacker:getEffects()[1].id == RES_EFF.F_ADD_FULLATTRS )
		assert( self.attacker:getEffects()[1].val == 30 )
	end;
	
	testRecalcAttrsBySkill = function(self)
		self.hero1:addSkill({resid=6001017, level=1})
		self:createAttackerAndDefender()
		self.attacker:collectFixedSkillEffects()
		self.attacker:recalcAttrsBySkill()
		assert ( self.attacker.attrs[ATTR.HI] == self.attacker.hero:getAttrVal(ATTR.HI) )
	end;
	
	testRecalcHP = function(self)
		self:createAttackerAndDefender()
		self.attacker:recalcHP()
		assert ( self.attacker:getAttrVal(ATTR.HP) == res_ps_to_factps*self.attacker.hero:getAttrVal(ATTR.MPS) )
		assert ( self.attacker:getAttrVal(ATTR.HP) == self.attacker:getAttrVal(ATTR.MHP) )
	end;
	
	testSortSkills = function(self)
		self.mm:mock(math, 'random', {100} )
		self:createAttackerAndDefender()
		self.attacker.hero:addSkill({resid=6001009, level=1})
		self.defender.hero:addSkill({resid=6001008, level=1})
		ActorAttackHdr:initParams(self.attacker, self.defender)
		ActorAttackHdr:sortSkills()
		assert(ActorAttackHdr.sortskills[1].pri >  ActorAttackHdr.sortskills[2].pri )
	end;
	
	testTrigerSkills = function(self)
		local rand = 0
		self.mm:mock(math, 'random', nil, function()
			rand = rand + 20
			return rand
		end)
	
		self:createAttackerAndDefender()
		self.attacker.hero:addSkill({resid=6001008, level=100})
		self.attacker.hero:addSkill({resid=6001009, level=100})
		self.attacker.hero:addSkill({resid=6001010, level=100})
		self.attacker.hero:addSkill({resid=6001013, level=100})
		self.defender.hero:addSkill({resid=6001013, level=100})
		ActorAttackHdr:initParams(self.attacker, self.defender)
		ActorAttackHdr:sortSkills()
		
		ActorAttackHdr:trigerSkills()

		assert( table.getn(self.attacker:getEffects()) == 3 )
		assert( self.attacker:getEffects()[1].id == RES_EFF.F_BISHA )
		assert( table.getn(self.defender:getEffects()) == 1 )
	end;
	
	testTrigerSkillsCreateMultiTimesEffect = function(self)
		self:createAttackerAndDefender()
		self.attacker.hero:addSkill({resid=6001012, level=100})
		ActorAttackHdr:initParams(self.attacker, self.defender)
		self.mm:mock(math, 'random', {50} )
		ActorAttackHdr:sortSkills()
		ActorAttackHdr:trigerSkills()
		assert( table.getn(self.attacker:getEffects()) == 0 )
		assert( table.getn(self.defender:getEffects()) == 1 )
		assert( self.defender:getEffects()[1].id == RES_EFF.F_CUIDU3 )
		assert( self.defender:getEffects()[1].times == 3 )
	end;
	
	testClearProEffects = function(self)
		self:createAttackerAndDefender()
		self.attacker:addProEffect({id=RES_EFF.F_BISHA, val=5, u=2, isbuff=false, times=2})
		assert( self.attacker:getEffects()[1].times == 2 )
		self.attacker:clearProEffects()
		assert( self.attacker:getEffects()[1].times == 1 )
	end;
	
	testClearEffectBuffs = function(self)
		self:testTrigerSkillsCreateMultiTimesEffect()
		self.defender:clearEffectBuffs()
		assert( self.defender:getEffects()[1].times == 2 )
		self.defender:clearEffectBuffs()
		assert( self.defender:getEffects()[1].times == 1 )
		self.defender:clearEffectBuffs()
		assert( table.getn(self.defender:getEffects()) == 0 )
	end;
	
	testReplaceEffect = function(self)
		self:testTrigerSkillsCreateMultiTimesEffect()
		self.defender:clearEffectBuffs()
		assert( self.defender:getEffects()[1].times == 2 )
		assert( table.getn(self.defender:getEffects()) == 1 )
		ActorAttackHdr:sortSkills()
		ActorAttackHdr:trigerSkills()
		assert( self.defender:getEffects()[1].times == 3 )
		assert( table.getn(self.defender:getEffects()) == 1 )
	end;
	
	testMorale = function(self)
		self:createAttackerAndDefender()
		self.attacker.hero:setAttrVal(ATTR.MO, 1)
		self.attacker.hero:addSkill({resid=6001008, level=100})
		ActorAttackHdr:initParams(self.attacker, self.defender)
		ActorAttackHdr:sortSkills()
		ActorAttackHdr:trigerSkills()
		assert( table.getn(self.attacker:getEffects()) == 1 )
		assert( self.attacker:getEffects()[1].id == RES_EFF.F_BISHA )
	end;
	
	testCalcSkillEffectBeforeHit = function(self)
		self:createAttackerAndDefender()
		local oldES = self.defender:getAttrVal(ATTR.ES)
		self.defender:addProEffect({id=RES_EFF.F_ADD_ES, val=200, u=1})
		ActorAttackHdr:initParams(self.attacker, self.defender)
		ActorAttackHdr:calcSkillEffectBeforeHit()
		assert(self.defender:getAttrVal(ATTR.ES) == oldES + 2*3 )
	end;
	
	testIsHit = function(self)
		self:createAttackerAndDefender()
		ActorAttackHdr:initParams(self.attacker, self.defender)
		self.attacker:addTmpAttrValInFight(ATTR.HI, 100000)
		assert ( ActorAttackHdr:isHit() == true )
	end;	
	
	testCalcSkillEffectBeforePhyHurt = function(self)
		self:createAttackerAndDefender()
		ActorAttackHdr:initParams(self.attacker, self.defender)
		
		local deVal = self.defender:getAttrVal(ATTR.DE)
		self.attacker:addProEffect({id=RES_EFF.F_JIPO, val=0, u=0, isbuff=false, times=1})
		ActorAttackHdr:calcSkillEffectBeforePhyHurt()
		assert ( self.defender:getAttrVal(ATTR.DE) == 0 )
		
		self.attacker:clearProEffects()
		self.defender:clearFightTmpAddAttrs()
		self.attacker:addProEffect({id=RES_EFF.F_XUERUO, val=20, u=1, isbuff=false,  times=1})
		ActorAttackHdr:calcSkillEffectBeforePhyHurt()
		assert ( floatEQ(self.defender:getAttrVal(ATTR.DE), deVal*0.8) == true )
	end;
	
	testCalcBasePhyHurt = function(self)
		self:createAttackerAndDefender()
		ActorAttackHdr:initParams(self.attacker, self.defender)
		
		ActorAttackHdr:calcBasePhyHurt()
		assert( self.attacker:getBaseHurt() > 0 )
	end;
	
	testCalcBerserkPhyHurt = function(self)
		self:createAttackerAndDefender()
		ActorAttackHdr:initParams(self.attacker, self.defender)
		
		self.attacker:setBaseHurt(100)
		self.attacker:setHurt(100)
		self.attacker:setAttrVal(ATTR.BER, 10000)
		ActorAttackHdr:calcBerserkPhyHurt()
		assert ( self.attacker:getHurt() == res_get_berserkHurt(100) )
		
		self.attacker:setBaseHurt(100)
		self.attacker:setHurt(100)
		self.attacker:setAttrVal(ATTR.BER, 0)
		ActorAttackHdr:calcBerserkPhyHurt()
		assert ( self.attacker:getHurt() >= 100 )
	end;
	
	testCalcSkillPhyHurt = function(self)
		self:createAttackerAndDefender()
		ActorAttackHdr:initParams(self.attacker, self.defender)
		
		self.attacker.isLive = true
		self.defender.isLive = true
		self.attacker:setBaseHurt(100)
		self.attacker:setHurt(100)
		self.defender:setAttrVal(ATTR.HP, 200000)
		self.attacker:addProEffect({id=RES_EFF.F_ADD_HU, val=10, u=1, isbuff=false, times=1})
		ActorAttackHdr:calcSkillPhyHurt()
		assert( self.attacker:getHurt() == 110)
		
		self.attacker.isLive = true
		self.defender.isLive = true
		self.attacker:setBaseHurt(200)
		self.attacker:setHurt(200)
		self.attacker:clearProEffects()
		self.defender:clearProEffects()
		self.attacker:addProEffect({id=RES_EFF.F_BISHA, val=300, pro=0, u=1, isbuff=false, times=1})
		ActorAttackHdr:calcSkillPhyHurt()
		assert( self.attacker:getHurt() == 200)
		
		self.attacker:setBaseHurt(200)
		self.attacker:setHurt(200)
		self.attacker:clearProEffects()
		self.defender:clearProEffects()
		self.attacker:addProEffect({id=RES_EFF.F_BISHA, val=300, pro=100, u=1, isbuff=false, times=1})
		ActorAttackHdr:calcSkillPhyHurt()
		assert( self.attacker:getHurt() == 800)
		
		self.attacker:setBaseHurt(200)
		self.attacker:setHurt(200)
		self.attacker:clearProEffects()
		self.defender:clearProEffects()
		self.attacker:addProEffect({id=RES_EFF.F_BISHA, skillLevel=5, val=300, u=1, isbuff=false, times=1})
		self.defender:addProEffect({id=RES_EFF.F_XINGYUN, skillLevel=5, val=0, u=0, isbuff=false, times=1})
		ActorAttackHdr:calcSkillPhyHurt()
		assert( self.attacker:getHurt() == 200)
		
		self.attacker:setBaseHurt(200)
		self.attacker:setHurt(200)
		self.attacker:clearProEffects()
		self.defender:clearProEffects()
		self.attacker:addProEffect({id=RES_EFF.F_BISHA, skillLevel=5, val=300, u=1, isbuff=false, times=1})
		self.defender:addProEffect({id=RES_EFF.F_XINGYUN, skillLevel=6, val=0, u=0, isbuff=false, times=1})
		ActorAttackHdr:calcSkillPhyHurt()
		assert( self.attacker:getHurt() == 200)
		
		self.attacker:setBaseHurt(200)
		self.attacker:setHurt(200)
		self.attacker:clearProEffects()
		self.defender:clearProEffects()
		self.attacker:addProEffect({id=RES_EFF.F_BISHA, skillLevel=5, pro=10, val=300, u=1, isbuff=false, times=1})
		self.defender:addProEffect({id=RES_EFF.F_XINGYUN, skillLevel=2, val=10, u=1, isbuff=false, times=1})
		ActorAttackHdr:calcSkillPhyHurt()
		assert( self.attacker:getHurt() == 200)
		
		self.attacker:setBaseHurt(200)
		self.attacker:setHurt(200)
		self.attacker:clearProEffects()
		self.defender:clearProEffects()
		self.attacker:addProEffect({id=RES_EFF.F_BISHA, skillLevel=5, pro=110, val=300, u=1, isbuff=false, times=1})
		self.defender:addProEffect({id=RES_EFF.F_XINGYUN, skillLevel=2, val=10, u=1, isbuff=false, times=1})
		ActorAttackHdr:calcSkillPhyHurt()
		assert( self.attacker:getHurt() == 800)
		
		self.attacker.isLive = true
		self.defender.isLive = true
		self.attacker:setBaseHurt(100)
		self.attacker:setHurt(100)
		self.attacker:clearProEffects()
		self.defender:clearProEffects()
		self.attacker:addProEffect({id=RES_EFF.F_LIANJI, val=100, u=1, isbuff=false, times=1})
		ActorAttackHdr:calcSkillPhyHurt()
		assert( self.attacker:getHurt() == 200)
		
		self.attacker.isLive = true
		self.defender.isLive = true
		self.attacker:setBaseHurt(0)
		self.attacker:setHurt(0)
		self.attacker:setAttrVal(ATTR.HU, 200)
		self.defender:setAttrVal(ATTR.HP, 100)
		self.attacker:clearProEffects()
		self.defender:clearProEffects()
		self.attacker:addProEffect({id=RES_EFF.F_HUOGONG, val=10, u=1, isbuff=false, times=1})
		ActorAttackHdr:calcSkillPhyHurt()
		assert( self.defender:getAttrVal(ATTR.HP) == 80)
		
		self.attacker.isLive = true
		self.defender.isLive = true
		self.attacker:setBaseHurt(0)
		self.attacker:setHurt(0)
		self.attacker:setAttrVal(ATTR.HU, 200)
		self.defender:setAttrVal(ATTR.HP, 100)
		self.attacker:clearProEffects()
		self.defender:clearProEffects()
		self.attacker:addProEffect({id=RES_EFF.F_HUOGONG, val=10, u=1, isbuff=false, times=1})
		self.defender:addProEffect({id=RES_EFF.F_ADD_FIREHURT, val=100, u=1, isbuff=false, times=1})
		ActorAttackHdr:calcSkillPhyHurt()
		assert( self.defender:getAttrVal(ATTR.HP) == 60)
		
		self.attacker.isLive = true
		self.defender.isLive = true
		self.attacker:setBaseHurt(200)
		self.attacker:setHurt(200)
		self.defender:setAttrVal(ATTR.HP, 200000)
		self.attacker:clearProEffects()
		self.defender:clearProEffects()
		self.defender:addProEffect({id=RES_EFF.F_CHENGSHANG, val=10, u=1, isbuff=false, times=1})
		ActorAttackHdr.stream = FightEventStream()
		ActorAttackHdr:calcSkillPhyHurt()
		assert( self.attacker:getHurt() == 180)
		
		self.attacker.isLive = true
		self.defender.isLive = true
		self.attacker:setBaseHurt(200)
		self.attacker:setHurt(200)
		self.attacker:setAttrVal(ATTR.MHP, 1000)
		self.defender:setAttrVal(ATTR.HP, 200000)
		local oldHP = self.attacker:getAttrVal(ATTR.HP)
		self.attacker:clearProEffects()
		self.defender:clearProEffects()
		self.attacker:addProEffect({id=RES_EFF.F_XIXUE, val=10, u=1, isbuff=false, times=1})
		ActorAttackHdr:calcSkillPhyHurt()
		assert( oldHP + 20 == self.attacker:getAttrVal(ATTR.HP) )
		
		self.attacker.isLive = true
		self.defender.isLive = true
		self.attacker:setBaseHurt(200)
		self.attacker:setHurt(200)
		self.attacker:setAttrVal(ATTR.MHP, 1000)
		self.defender:setAttrVal(ATTR.HP, 100)
		local oldHP = self.attacker:getAttrVal(ATTR.HP)
		self.attacker:clearProEffects()
		self.defender:clearProEffects()
		self.attacker:addProEffect({id=RES_EFF.F_XIXUE, val=10, u=1, isbuff=false, times=1})
		ActorAttackHdr:calcSkillPhyHurt()
		assert( oldHP + 10 == self.attacker:getAttrVal(ATTR.HP) )
	end;
	
	testCalcFanJiHurt = function(self)
		self:createAttackerAndDefender()
		ActorAttackHdr:initParams(self.attacker, self.defender)
		
		local oldHP = self.attacker:getAttrVal(ATTR.HP)
		self.defender:addProEffect({id=RES_EFF.F_FANJI, val=50, u=1, times=1})
		ActorAttackHdr:calcFanJiHurt()
		assert( self.attacker:getAttrVal(ATTR.HP) < oldHP )
	end;

	testSoldierAttackSoldier = function(self)
		self:createAttackerAndDefender()
		self.attacker2:attack(self.defender2)
	end;
	
	testSoldierAttackWall = function(self)
		self:createAttackerAndDefender()
		self.wallData:setHPAndDEF(100,1)
		
		self.attacker3:setAttrVal(ATTR.HI, 0)
		self.attacker3:setAttrVal(ATTR.HU, 100000000)
		
		local oldHP = self.wallData:getAttrVal(ATTR.HP) 
		assert ( self.defender3:isDie() == false )
		self.attacker3:attack(self.defender3)
		assert ( self.wallData:getAttrVal(ATTR.HP) < oldHP )
		assert ( self.defender3:isDie() == true )
		assert ( self.wallData:isDie() == true )
	end;
	
	testCityDefActor = function(self)
		self:createAttackerAndDefender()
		assert ( self.attacker4:getSoldierResId() == CITYDEF_TYPE.XIANJING )
		assert ( self.attacker4:getAttrVal(ATTR.HU) == res_citydefs_hurt_bytype[CITYDEF_TYPE.XIANJING] )
		assert ( self.attacker4:getFightUnitNumber() == self.cityDef:getDefNumber(CITYDEF_TYPE.XIANJING)*res_citydef_each_need_num_per )
		
		local oldNumber = self.cityDef:getDefNumber(CITYDEF_TYPE.XIANJING)
		self.attacker4:hurtEnd()
		assert ( self.cityDef:getDefNumber(CITYDEF_TYPE.XIANJING) == math.floor(oldNumber - self.attacker4:getFightUnitNumber()) )
	end;
	
	testCityDefActorDie = function(self)
		self:createAttackerAndDefender()
		for i=1, 20, 1 do
			self.attacker4:hurtEnd()
		end
		assert ( self.attacker4:isDie() )
	end;
	
	testCityDefActorFirstDie = function(self)
		local actor = CityDefActor()
		self.cityDef = PlayerCityDef(self.player)
		self.cityDef:setDefNumber(CITYDEF_TYPE.XIANJING, 0)
		actor:setCityDef(self.cityDef, CITYDEF_TYPE.XIANJING)
		assert ( actor:isDie() )
	end;
	
	testCityDefActorReset = function(self)
		self:createAttackerAndDefender()
		local lastInitNumber = self.attacker4:getInitNumber()
		local lastUnitNumber =  self.attacker4:getFightUnitNumber()
		for i=1, 10, 1 do
			self.attacker4:hurtEnd()
		end
		assert ( self.attacker4:getInitNumber() == lastInitNumber )
		assert ( self.attacker4:getFightUnitNumber() == lastUnitNumber )
		
		self.attacker4:reset()
		
		assert ( self.attacker4:getInitNumber() == lastInitNumber/2 )
		assert ( self.attacker4:getFightUnitNumber() == lastUnitNumber/2 )
	end;
	
	testDefAttackSoldier_baseHurt = function(self)
		self:createAttackerAndDefender()
		local baseHurt_ = 0
		self.defender4.subHP = function(self, baseHurt)
			baseHurt_ = baseHurt
		end;
		
		self.attacker4:attack(self.defender4)
		assert ( baseHurt_ == res_citydefs_hurt_bytype[CITYDEF_TYPE.XIANJING] * self.attacker4:getFightUnitNumber() )
	end;
	
	testDefAttackSoldier_subSoldier = function(self)
		self:createAttackerAndDefender()
		local baseHurt_ = res_citydefs_hurt_bytype[CITYDEF_TYPE.XIANJING] * self.attacker4:getFightUnitNumber()
		local oldsoldiernum = self.defender4:getFightUnitNumber()
		self.attacker4:attack(self.defender4)
		local subnumber = math.floor(baseHurt_ / self.defender4:getAttrVal(ATTR.UHP))
		
		assert( self.defender4:getFightUnitNumber() == math.max(0, oldsoldiernum - subnumber) )
		if self.defender4:getFightUnitNumber() == 0 then
			assert( self.defender4:isDie() == true )
		end
		
		self.attacker4 = self:createDefActor()
		self.attacker4:setCamp(FIGHT_CAMP.DEFEND)
		
		self.defender4 = self:createSoldierActor()
		self.defender4:recalcHP()
		self.defender4:setCamp(FIGHT_CAMP.ATTACK)
		
		
	end;
})

local TestCaseSoldierActor = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseCondition:setPreCond(self.player, nil, {heros={{state=0,soldier={resid=150002020,number=1}}} })
		self.hero = self.player:getHeroMgr():getHeroById(1)
		self.actor = SoldierActor()
		self.actor:setHero(self.hero)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	testReviveNumber = function(self)
		self.actor:setReviveNumber(10.4)
		assert ( self.actor:getReviveNumber() == 10 )
		self.actor:setReviveNumber(10.5)
		assert ( self.actor:getReviveNumber() == 11 )
	end;
})

local TestCaseAddLevelByHeroFiveElemAttr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getAddLevelByHeroFiveElemAttr = function(self)
		self.hero:setAttrVal(ATTR.JIN_SKILL_LEVEL, 1)
		self.hero:setAttrVal(ATTR.MU_SKILL_LEVEL, 2)
		self.hero:setAttrVal(ATTR.SHUI_SKILL_LEVEL, 3)
		self.hero:setAttrVal(ATTR.HUO_SKILL_LEVEL, 4)
		self.hero:setAttrVal(ATTR.TU_SKILL_LEVEL, 5)
		
		assert ( AddLevelByHeroFiveElemAttr:getAddLevel(self.hero, {fiveelem=FIVEELEM_TYPE.JIN}) == 1 )
		assert ( AddLevelByHeroFiveElemAttr:getAddLevel(self.hero, {fiveelem=FIVEELEM_TYPE.MU}) == 2 )
		assert ( AddLevelByHeroFiveElemAttr:getAddLevel(self.hero, {fiveelem=FIVEELEM_TYPE.SHUI}) == 3 )
		assert ( AddLevelByHeroFiveElemAttr:getAddLevel(self.hero, {fiveelem=FIVEELEM_TYPE.HUO}) == 4 )
		assert ( AddLevelByHeroFiveElemAttr:getAddLevel(self.hero, {fiveelem=FIVEELEM_TYPE.TU}) == 5 )
		assert ( AddLevelByHeroFiveElemAttr:getAddLevel(self.hero, {}) == 0 )
	end;
})

local TestCaseActorMoveHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		
		self.actorMoveAI = ActorMoveAI()
		self.stream = FightEventStream()
		self.actorMoveHdr = ActorMoveHdr(self.actorMoveAI, self.stream)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	helper_createActors = function(self)
		self.aactor1 = FightActor()
		self.aactor1:setId(1)
		self.aactor1:setPos(2, 0)
		
		self.aactor2 = FightActor()
		self.aactor2:setId(2)
		self.aactor2:setPos(1, 0)
		
		self.aactor3 = FightActor()
		self.aactor3:setId(3)
		self.aactor3:setPos(3, 0)
		self.attackerActors = {self.aactor1, self.aactor2, self.aactor3}
		
		self.dactor1 = FightActor()
		self.dactor1:setId(10)
		self.dactor1:setPos(2, 0)
		
		self.dactor2 = FightActor()
		self.dactor2:setId(20)
		self.dactor2:setPos(1, 0)
		
		self.dactor3 = FightActor()
		self.dactor3:setId(30)
		self.dactor3:setPos(3, 0)
		self.defenderActors = {self.dactor1, self.dactor2, self.dactor3}	
	end;
	
	test_sortMoveSequence = function(self)
		self:helper_createActors()
		self.actorMoveHdr:sortMoveSequence(self.attackerActors, self.defenderActors)
		assertEQ ( self.actorMoveHdr.moveActors_.attackers, {{needMove=false, actor=self.aactor3},{needMove=false, actor=self.aactor1},{needMove=false, actor=self.aactor2}} )
		assertEQ ( self.actorMoveHdr.moveActors_.defenders, {{needMove=false, actor=self.dactor2},{needMove=false, actor=self.dactor1},{needMove=false, actor=self.dactor3}} )
	end;
	
	test_clearNeedMoveMarks = function(self)
		self:helper_createActors()
		self.actorMoveHdr:sortMoveSequence(self.attackerActors, self.defenderActors)
		self.actorMoveHdr.moveActors_.attackers[1].needMove = true
		self.actorMoveHdr.moveActors_.defenders[1].needMove = true
		self.actorMoveHdr.moveActors_.defenders[2].needMove = true
		self.actorMoveHdr.moveActors_.defenders[3].needMove = true
		self.actorMoveHdr:clearNeedMoveMarks()
		assertEQ ( self.actorMoveHdr.moveActors_.attackers[1].needMove, false )
		assertEQ ( self.actorMoveHdr.moveActors_.attackers[2].needMove, false )
		assertEQ ( self.actorMoveHdr.moveActors_.attackers[3].needMove, false )
		assertEQ ( self.actorMoveHdr.moveActors_.defenders[1].needMove, false )
		assertEQ ( self.actorMoveHdr.moveActors_.defenders[2].needMove, false )
		assertEQ ( self.actorMoveHdr.moveActors_.defenders[3].needMove, false )
	end;
	
	test_markNeedMoveActor = function(self)
		self:helper_createActors()
		self.actorMoveHdr:sortMoveSequence(self.attackerActors, self.defenderActors)
		self.actorMoveHdr:markNeedMoveActor(1)
		self.actorMoveHdr:markNeedMoveActor(30)
		assertEQ ( self.actorMoveHdr.moveActors_.attackers[2].needMove, true )
		assertEQ ( self.actorMoveHdr.moveActors_.defenders[3].needMove, true )
	end;
	
	test_actorsMove = function(self)
		self.mm:mock(self.actorMoveAI, 'moveActor')
		
		self:helper_createActors()
		self.actorMoveHdr:sortMoveSequence(self.attackerActors, self.defenderActors)
		
		self.actorMoveHdr:markNeedMoveActor(1)
		self.actorMoveHdr:markNeedMoveActor(20)
		self.actorMoveHdr:markNeedMoveActor(30)
		
		self.actorMoveHdr:actorsMove()
		assertEQ ( self.mm.walkLog, 'moveActor,moveActor,moveActor' )
		assertEQ ( self.mm.params['moveActor.1'], {self.aactor1} )
		assertEQ ( self.mm.params['moveActor.2'], {self.dactor2} )
		assertEQ ( self.mm.params['moveActor.3'], {self.dactor3} )
		assertEQ ( self.stream:getEvent(0), {event='movestart'} )
		assertEQ ( self.stream:getEvent(1), {event='movesplit'} )
		assertEQ ( self.stream:getEvent(2), {event='moveend'} )
	end;
})

tqFightHdr_t_main = function(suite)
	suite:addTestCase(TestCaseFightEventStream, 'TestCaseFightEventStream')
	suite:addTestCase(TestCaseFightSortSeqHdr, 'TestCaseFightSortSeqHdr')
	suite:addTestCase(TestCaseFightGetRecentlyActorHdr, 'TestCaseFightGetRecentlyActorHdr')
	suite:addTestCase(TestCaseFightMoveHdr, 'TestCaseFightMoveHdr')
	suite:addTestCase(TestCaseFightMapHdr, 'TestCaseFightMapHdr')
	suite:addTestCase(TestCaseArmyPosIniter,'TestCaseArmyPosIniter')
	suite:addTestCase(TestCaseFightMoveAndAttackHdr,'TestCaseFightMoveAndAttackHdr')
	suite:addTestCase(TestCaseFightRound,'TestCaseFightRound')
	suite:addTestCase(TestCaseFightActorHdr,'TestCaseFightActorHdr')
	suite:addTestCase(TestCaseHeroAttack,'TestCaseHeroAttack')
	suite:addTestCase(TestCaseSoldierActor,'TestCaseSoldierActor')
	suite:addTestCase(TestCaseAddLevelByHeroFiveElemAttr,'TestCaseAddLevelByHeroFiveElemAttr')
	suite:addTestCase(TestCaseActorMoveHdr,'TestCaseActorMoveHdr')
end;

