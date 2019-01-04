--*******************************************************************************
--  
--*******************************************************************************
require('tqSkillEffectUtil')

local TestCaseSkillEffectUtil = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getEffectValFromHeroSkill = function(self)
		assertEQ ( SkillEffectUtil:getAppendValByHeroSkillEffect(nil, 1), 0 )
		
		res_test_items = {{id=1, effects={{id=1, pro='100', val='LV*10', u=0}}}}
		self.mm:mock( self.hero, 'getSkillCount', {1} )
		self.mm:mock( self.hero, 'getSkillByIdx', {{ulResId=1,ucLevel=2}} )
		self.mm:mock( AddLevelByHeroFiveElemAttr, 'getAddLevel', {1} )
		self.mm:mock( SkillEffectUtil, '_calcEffect', {10} )
		
		self.mm:clear()
		assertEQ ( SkillEffectUtil:getAppendValByHeroSkillEffect(self.hero, 1, 5), 10 )
		assertEQ ( self.mm.walkLog, 'getSkillCount,getSkillByIdx,getAddLevel,_calcEffect' )
		assertEQ ( self.mm.params['getSkillByIdx'], {0} )
		assertEQ ( self.mm.params['getAddLevel'], {self.hero, res_test_items[1]} )
		assertEQ ( self.mm.params['_calcEffect'], {1, res_test_items[1].effects[1], 3, 5} )
	end;
	
	test__calcEffect = function(self)
		local p_effect = {id=1, pro='100', val='LV*10', u=VAL_UNIT.VAL}
		assertEQ ( SkillEffectUtil:_calcEffect(2, p_effect, 3, 200), 0 )
		assertEQ ( SkillEffectUtil:_calcEffect(1, p_effect, 3, 200), 30 )
		
		local p_effect = {id=1, pro='100', val='LV*10', u=VAL_UNIT.PER}
		assertEQ ( SkillEffectUtil:_calcEffect(1, p_effect, 3, 200), 60 )
		
		local p_effect = {id=1, pro='100', val='LV*10', u=10000}
		assertEQ ( SkillEffectUtil:_calcEffect(1, p_effect, 3, 200), 0 )
		
		local p_effect = {id=1, pro='0', val='LV*10', u=VAL_UNIT.PER}
		assertEQ ( SkillEffectUtil:_calcEffect(1, p_effect, 3, 200), 0 )
	end;
})


tqSkillEffectUtil_t_main = function(suite)
	suite:addTestCase(TestCaseSkillEffectUtil, 'TestCaseSkillEffectUtil')
end;


