--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqFightResultMaker')

local TestCaseFightResultMaker = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		TestCaseCondition:setPreCond(self.player, nil, { heros={{state=1,soldier={resid=150001001,number=4}} } })
		self.hero = self.player:getHeroMgr():getHeroById(1)
		self.hero:setName('hero1')
		self.resultMaker = FightResultMaker()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	testGetRoleInfo = function(self)
		self.player:setRoleName('qjb')
		assert ( self.resultMaker:getRoleInfo(self.player) == 'role:{name:"qjb",icon:0,level:0,objType:1,alli:"--"}')
	end;
	
	testGetHerosInfo = function(self)
		local actors = {}
		local actor = SoldierActor()
		actor:setHero(self.hero)
		actor:subHP(actor:getAttrVal(ATTR.UHP)*3)
		actor:addHP(actor:getAttrVal(ATTR.UHP)*2)
		actor:addExp(3)
		actor:addCredit(1)
		actor:setReviveNumber(1)
		
		table.insert(actors, actor)
		local sheros = self.resultMaker:getHerosInfo(actors)
		assert ( Json.IsValid( '{' .. sheros .. '}' ) == true )
		assert ( sheros == 'heros:[{name:"hero1",level:1,soldier:{resid:150001001,number:4,loss:1,revive:1},addExp:3,addCredit:1}]' )
	end;
	
	testGetLossResInfo = function(self)
		local sloss = self.resultMaker:getLossResInfo({money=1,food=2,wood=3,stone=4,iron=5})
		assert( isInclude(sloss,  'lossres:', 'money:1', 'food:2', 'wood:3' , 'stone:4' , 'iron:5') == true )
	end;
	
	testGetGainResInfo = function(self)
		local sgain = self.resultMaker:getGainResInfo({money=1,food=2,wood=3,stone=4,iron=5})
		assert( isInclude(sgain,  'gainres:', 'money:1', 'food:2', 'wood:3' , 'stone:4' , 'iron:5') == true )
	end;
	
	testGetDropResInfo = function(self)
		res_drops={{id=1, 
			credit={pro=100,maxnum=1,minnum=1},
			items={{id=FIXID.SALVE,pro=100,maxnum=1,minnum=1},{id=FIXID.CHILINGDAN,pro=100,maxnum=2,minnum=2}},
			}}
		DropItemUtil:handle(self.player, {}, {}, 1) 
		local sgain = self.resultMaker:getDropResInfo(DropItemUtil:getLog())
		assert ( sgain == 'getdrop:'..toJIONString(DropItemUtil:getLog()) )
	end;
	
	testGetDefExpendInfo = function(self)
		local cityDef = self.player:getCityDef()
		cityDef:setDefNumber(CITYDEF_TYPE.XIANJING, 1000)
		cityDef:setDefNumber(CITYDEF_TYPE.GUNMU, 1000)
		cityDef:setDefNumber(CITYDEF_TYPE.JUMA, 1000)
		cityDef:setDefNumber(CITYDEF_TYPE.LEISHI, 1000)
		cityDef:setDefNumber(CITYDEF_TYPE.NUJIAN, 1000)
		
		local actor1 = CityDefActor()
		actor1:setCityDef(cityDef, CITYDEF_TYPE.XIANJING)
		actor1:hurtEnd()
		
		local actor2 = CityDefActor()
		actor2:setCityDef(cityDef, CITYDEF_TYPE.GUNMU)
		actor2:hurtEnd()
		actor2:hurtEnd()
		
		local actor3 = CityDefActor()
		actor3:setCityDef(cityDef, CITYDEF_TYPE.JUMA)
		actor3:hurtEnd()
		actor3:hurtEnd()
		actor3:hurtEnd()
		
		local actor4 = CityDefActor()
		actor4:setCityDef(cityDef, CITYDEF_TYPE.LEISHI)
		actor4:hurtEnd()
		actor4:hurtEnd()
		actor4:hurtEnd()
		actor4:hurtEnd()
		
		local actor5 = CityDefActor()
		actor5:setCityDef(cityDef, CITYDEF_TYPE.NUJIAN)
		
		local sdefexpend = self.resultMaker:getDefsExpendInfo({actor1,actor2,actor3,actor4,actor5})
		assert ( isInclude(sdefexpend, 'defexpend:', 'xianjing:50', 'gunmu:100', 'juma:150', 'leishi:200') == true )
		assert ( isNotInclude(sdefexpend, 'nujian:') == true )
	end;
	
	testMakeAttackerSucc = function(self)
		self.player:setRoleName('qjb')
		local attacker = {player=self.player, actors={}, dropLogs={{type='heroexp',val=1}}}
		local defender = {player=self.player, actors={}, lossRes={money=2}, dropLogs={}}
		local fightSuccess = 1
		local s = self.resultMaker:make('party', 1, attacker, defender, fightSuccess)
		local expect = '{result:1'
		expect = expect..',defenderParty:"party"'
		expect = expect..',expedType:1'
		expect = expect..',attacker:{role:{name:"qjb",icon:0,level:0,objType:1,alli:"--"},heros:[],gainres:{money:2},getdrop:[{val:1,type:"heroexp"}]}'
		expect = expect..',defender:{role:{name:"qjb",icon:0,level:0,objType:1,alli:"--"},heros:[],lossres:{money:2},defexpend:{},getdrop:[]}'
		expect = expect..'}'
		assert ( s == expect )
	end;
	
	test_getHeroInfo = function(self)
		local actor = HeroActor()
		actor:setHero(self.hero)
		assert ( self.resultMaker:getHeroInfo('', actor) == '{name:"hero1",level:1,soldier:{resid:0,number:0,loss:0,revive:0},addExp:0,addCredit:0}')

		local actor = SoldierActor()
		actor:setHero(self.hero)
		actor.soldier.lossNumber = 2
		actor.soldier.reviveNumber = 1
		assert ( self.resultMaker:getHeroInfo('', actor) == '{name:"hero1",level:1,soldier:{resid:150001001,number:4,loss:2,revive:1},addExp:0,addCredit:0}' )
	end;
})


tqFightResultMaker_t_main = function(suite)
	suite:addTestCase(TestCaseFightResultMaker, 'TestCaseFightResultMaker')
end;

