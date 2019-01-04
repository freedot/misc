--*******************************************************************************
--  
--*******************************************************************************
require('tqGemUtil')

local TestCaseGemUtil = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_isGem = function(self)
		assert ( GemUtil:isGem(FIXID.FIRSTGEM-1) == false )
		assert ( GemUtil:isGem(FIXID.LASTGEM+1) == false )
		assert ( GemUtil:isGem(FIXID.FIRSTGEM) == true )
	end;
	
	test_isMaxGemLevel = function(self)
		res_test_items = {{id=1,gemLevel=1},{id=2,gemLevel=res_max_gem_level},{id=3,gemLevel=res_max_gem_level+1}}
		assert ( GemUtil:isMaxGemLevel(1) == false )
		assert ( GemUtil:isMaxGemLevel(2) == true )
		assert ( GemUtil:isMaxGemLevel(3) == true )
	end;
	
	test_isValidCombineLevel = function(self)
		assert ( GemUtil:isValidCombineLevel(-1) == false )
		assert ( GemUtil:isValidCombineLevel(0) == false )
		assert ( GemUtil:isValidCombineLevel(1) == true )
		assert ( GemUtil:isValidCombineLevel(1) == true )
		assert ( GemUtil:isValidCombineLevel(1) == true )
		assert ( GemUtil:isValidCombineLevel(4) == true )
		assert ( GemUtil:isValidCombineLevel(5) == false )
	end;
	
	test_getCombineNeedNumber = function(self)
		assert ( GemUtil:getCombineNeedNumber(1) == res_gem_combinelevels[1].needNumber)
	end;
	
	test_getCombineSuccPro = function(self)
		assert ( GemUtil:getCombineSuccPro(1) == res_gem_combinelevels[1].per)
	end;
	
	test_getCombineLevel = function(self)
		assert ( GemUtil:getCombineLevel(0) == nil )
		assert ( GemUtil:getCombineLevel(1) == res_gem_combinelevels[1] )
	end;
	
	test_getNextLevelResId = function(self)
		assert ( GemUtil:getNextLevelResId(1) == 2 )
		assert ( GemUtil:getNextLevelResId(2) == 3 )
	end;
	
	test_getAttr = function(self)
		local attr = GemUtil:getAttr(FIXID.FIRSTGEM-1)
		assert ( attr.val == 0 )
		assert ( attr.attr == 0 )
		
		local attr = GemUtil:getAttr(FIXID.LASTGEM+1)
		assert ( attr.val == 0 )
		assert ( attr.attr == 0 )
		
		local attr = GemUtil:getAttr(FIXID.FIRSTGEM)
		assert ( attr.attr > 0 )
		assert ( attr.val > 0 )
	end;
	
	test_hasAttr = function(self)
		local g_resItem = {id=2, resId=3, number=4, forceLevel=5, attrs={count=6,attrs={} }, gems={count=1,gems={}}}
		g_resItem.gems.gems[0] =  FIXID.LASTGEM - 4
		local g_arm = ItemEx(g_resItem)
		
		assert ( GemUtil:hasAttr(g_arm, ATTR.CO) == true )
		assert ( GemUtil:hasAttr(g_arm, ATTR.PH_B) == false )
	end;
})


tqGemUtil_t_main = function(suite)
	suite:addTestCase(TestCaseGemUtil, 'TestCaseGemUtil')
end;


