--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqPlayerHeroMgr')

local TestCasePlayerHeroMgr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	
		self.heroMgr = self.player:getHeroMgr()
		self.newHeros = self.heroMgr:getNewHeros()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_isAllHerosFree = function(self)
		self.heroMgr.innerHeros.ucCount = 2
		self.heroMgr.innerHeros.astHeros[0].ucState = 0
		self.heroMgr.innerHeros.astHeros[1].ucState = 0
		self.heroMgr:_createAllHeroObjs()
		
		assert ( self.heroMgr:isAllHerosFree() == true )
		
		self.heroMgr.innerHeros.astHeros[1].ucState = 1
		self.heroMgr:_createAllHeroObjs()
		
		assert ( self.heroMgr:isAllHerosFree() == false )
	end;
	
	test_allocHeroId = function(self)
		self.heroMgr.innerHeros.ucCount = 0
		self.heroMgr:_createAllHeroObjs()
		assert ( self.heroMgr:_allocHeroId() == 1 )

		self.heroMgr.innerHeros.ucCount = 3
		self.heroMgr.innerHeros.astHeros[0].ullId = 1
		self.heroMgr.innerHeros.astHeros[1].ullId = 5
		self.heroMgr.innerHeros.astHeros[2].ullId = 3
		self.heroMgr:_createAllHeroObjs()
		assert ( self.heroMgr:_allocHeroId() == 6 )
	end;
	
	test_allocInnerHero_arriveMaxCount = function(self)
		local _MAX_HERO_CNT = MAX_HERO_CNT
		MAX_HERO_CNT = 0
		assert ( self.heroMgr:_allocInnerHero() == nil )
		MAX_HERO_CNT = _MAX_HERO_CNT
	end;
	
	test_allocInnerHero = function(self)
		local mm = MMock()
		mm:mock(SPub, 'ClearInnerHero' )
		mm:mock(self.heroMgr, '_allocHeroId', {2} )
			
		local innerHero = self.heroMgr:_allocInnerHero()
		mm:restore()
		
		assert ( mm.walkLog == 'ClearInnerHero,_allocHeroId' )
		assert ( innerHero ~= nil )
		assert ( innerHero.ullId == 2 )
		assertListEQ ( mm.params['ClearInnerHero'], {innerHero} )
	end;
	
	test_createHeroObj = function(self)
		local g_innerHero = {}
		local g_hero = {}
		
		self.heroMgr.heros = {}
		local mm = MMock()
		mm:mock(Hero, 'new', {g_hero})
		mm:mock(HeroAttrHelper, 'initAttrs')
		mm:mock(HeroAttrHelper, 'recalcBaseAttrs')
		mm:mock(HeroAttrHelper, 'recalcDynAttrs')
		
		local hero = self.heroMgr:_createHeroObj(g_innerHero)
		mm:restore()
		
		assert ( hero == g_hero )
		assert ( mm.walkLog == 'new,initAttrs,recalcBaseAttrs,recalcDynAttrs' )
		assertListEQ ( mm.params['new'], {self.player, g_innerHero} )
		assertListEQ ( mm.params['initAttrs'], {g_hero} )
		assertListEQ ( mm.params['recalcBaseAttrs'], {self.player, g_hero} )
		assertListEQ ( mm.params['recalcDynAttrs'], {self.player, g_hero} )
		assert ( table.getn(self.heroMgr.heros) == 1 )
		assert ( self.heroMgr.heros[1] == g_hero )
	end;
	
	test_createHero_allocInnerHeroFail = function(self)
		local g_newHero = {}
		
		local mm = MMock()
		mm:mock(self.heroMgr, '_allocInnerHero', nil)
		mm:mock(self.heroMgr, '_copyFromNewHero')
		
		assert ( self.heroMgr:createHero(g_newHero) == nil )
		assert ( mm.walkLog == '_allocInnerHero' )
		mm:restore()
	end;
	
	test_createHero = function(self)
		local g_innerHero = {}
		local g_newHero = {}
		local g_heroObj = {}
		
		self.mm:mock(self.heroMgr, '_allocInnerHero', {g_innerHero} )
		self.mm:mock(self.heroMgr, '_copyFromNewHero')
		self.mm:mock(self.heroMgr, '_createHeroObj', {g_heroObj} )
		self.mm:mock(Service:getOpenSvrAct(), 'recordWhenHasFiveHighHero' )
		
		assert ( self.heroMgr:createHero(g_newHero) == g_heroObj )
		assertEQ ( self.mm.walkLog, '_allocInnerHero,_copyFromNewHero,_createHeroObj,recordWhenHasFiveHighHero' )
		assertListEQ ( self.mm.params['_copyFromNewHero'], {g_innerHero, g_newHero} )
		assertListEQ ( self.mm.params['_createHeroObj'], {g_innerHero} )
		assertListEQ ( self.mm.params['recordWhenHasFiveHighHero'], {self.player} )
	end;
	
	test_getHeroIdxById = function(self)
		local g_hero = Hero(nil, {stWears={count=0,wears={}}})
		g_hero.getId = function() return 2 end
		self.heroMgr.heros = {}
		table.insert( self.heroMgr.heros, g_hero )
		
		assert ( self.heroMgr:_getHeroIdxById(1) == -1 )
		assert ( self.heroMgr:_getHeroIdxById(2) == 1 )
	end;
	
	test_destroyHeroObj = function(self)
		local g_hero1 = Hero(nil, {stWears={count=0,wears={}}})
		local g_hero2 = Hero(nil, {stWears={count=0,wears={}}})
		self.heroMgr.heros = {}
		table.insert( self.heroMgr.heros, g_hero1 )
		table.insert( self.heroMgr.heros, g_hero2 )
		
		self.heroMgr:_destroyHeroObj(0)
		self.heroMgr:_destroyHeroObj(3)
		assert ( table.getn(self.heroMgr.heros) == 2 )
		
		local mm = MMock()
		mm:mock(g_hero1, 'copy')
		
		self.heroMgr:_destroyHeroObj(1)
		mm:restore()
		
		assert ( table.getn(self.heroMgr.heros) == 1 )
		assert ( mm.walkLog == 'copy' )
		assertListEQ ( mm.params['copy'], {g_hero2} )
	end;
	
	test_freeInnerHero = function(self)
		self.heroMgr.innerHeros.ucCount = 2
		self.heroMgr.innerHeros.astHeros[0].ullId = 1
		self.heroMgr.innerHeros.astHeros[1].ullId = 2
		
		self.heroMgr:_freeInnerHero(0)
		assert ( self.heroMgr.innerHeros.ucCount == 2 )
		
		self.heroMgr:_freeInnerHero(3)
		assert ( self.heroMgr.innerHeros.ucCount == 2 )
		
		self.heroMgr:_freeInnerHero(1)
		assert ( self.heroMgr.innerHeros.ucCount == 1 )
		self.heroMgr.innerHeros.astHeros[0].ullId = 2
	end;
	
	test_destroyHero = function(self)
		local mm = MMock()
		mm:mock(self.heroMgr, '_getHeroIdxById', {10})
		mm:mock(self.heroMgr, '_destroyHeroObj')
		mm:mock(self.heroMgr, '_freeInnerHero')
		
		self.heroMgr:destroyHero(1)
		mm:restore()
		
		assert ( mm.walkLog == '_getHeroIdxById,_freeInnerHero,_destroyHeroObj' )
		assertListEQ ( mm.params['_getHeroIdxById'], {1} )
		assertListEQ ( mm.params['_destroyHeroObj'], {10} )
		assertListEQ ( mm.params['_freeInnerHero'], {10} )
	end;
	
	testRefreshNewHeros = function(self)
		local _isValidHero = function(idx, id, prof)
			local hero = self.newHeros:getNewHero(idx)
			return ( hero.ulId == id )
				and ( hero.szName ~= '' )
				and ( hero.ucProf == prof )
				and ( hero.ucLevel >= 1 )
				and ( hero.ulIcon > 0 )
				and ( hero.ucAttrCount == 9 )		
				and ( hero.astAttrs[8].ulVal > 0 )
		end
		
		local city = self.player:getCitys():getCityById(BUILDCITY_ID.MAIN)
		local build = city:addBuild({id=1,resid=FIXID.TAVERNBUILD,level=1,state=0})
		
		assert(self.newHeros:getNewHeroLastTime() == 0 )
		assert(self.newHeros:getNewHerosCount() == 0 )
		Util:setTimeDrt(1000)
		self.newHeros:refreshNewHeros()
		assert(self.newHeros:getNewHeroLastTime() == 1000 )
		assert(self.newHeros:getNewHerosCount() == 1 )
		assert( _isValidHero(0, 1, 3) == true )

		build.ucLevel = 2
		self.newHeros:refreshNewHeros()
		assert(self.newHeros:getNewHerosCount() == 6 )
		assert( _isValidHero(0, 1, 1) == true )
		assert( _isValidHero(1, 2, 2) == true )
		assert( _isValidHero(2, 3, 3) == true )
		assert( _isValidHero(3, 4, 4) == true )
		assert( _isValidHero(4, 5, 5) == true )
		assert( _isValidHero(5, 6, 6) == true )
	end;
	
	testGetHeroById = function(self)
		TestCaseHelper:createHero(self)
		assert ( self.heroMgr:getHeroById( self.hero:getId() ) == self.hero )
	end;
	
	testCanUseSkillSteelTime = function(self)
		assert ( self.heroMgr:getCanUseSkillSteelTime() == 0 )
		self.heroMgr:setCanUseSkillSteelTime(10)
		assert ( self.heroMgr:getCanUseSkillSteelTime() == 10 )
	end;
})



tqPlayerHeroMgr_t_main = function(suite)
	suite:addTestCase(TestCasePlayerHeroMgr, 'TestCasePlayerHeroMgr')
end;


