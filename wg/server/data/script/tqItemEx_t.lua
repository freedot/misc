--*******************************************************************************
--  Copyright (C) 2012 Blue Dot Game Studios (BDGS).  All rights reserved.
--*******************************************************************************
require('tqItemEx')

local TestCaseItemEx = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getId = function(self)
		local item = ItemEx({id=1})
		assert ( item:getId() == 1 )
		assert ( item:isRawItem() == false )
	end;
	
	test_getNumber = function(self)
		local item = ItemEx({id=1, resId=2, number=3})
		assert ( item:getNumber() == 3 )
	end;
	
	test_subNumber = function(self)
		local item = ItemEx({id=1, resId=2, number=3})
		item:subNumber(1)
		assert ( item:getNumber() == 2 )
		
		item:subNumber(-1)
		assert ( item:getNumber() == 2 )
		
		item:subNumber(10)
		assert ( item:getNumber() == 0 )
	end;
	
	test_addNumber = function(self)
		local item = ItemEx({id=1, resId=2, number=1})
		item:addNumber( 0 )
		assert ( item:getNumber() == 1 )
		
		item:addNumber( -1 )
		assert ( item:getNumber() == 1 )
		
		item:addNumber( 1 )
		assert ( item:getNumber() == 2 )
	end;
	
	test_setNumber = function(self)
		local item = ItemEx({id=1, resId=2, number=1})
		item:setNumber(-1)
		assert ( item:getNumber() == 1 )
		
		item:setNumber(0)
		assert ( item:getNumber() == 0 )
		
		item:setNumber(1)
		assert ( item:getNumber() == 1 )
	end;
	
	test_setId = function(self)
		local item = ItemEx({id=1, resId=2, number=1})
		item:setId(0)
		assert ( item:getId() == 0 )
		
		item:setId(1)
		assert ( item:getId() == 1 )
	end;
	
	test_setResId = function(self)
		local item = ItemEx({id=1, resId=2, number=1})
		item:setResId(0)
		assert ( item:getResId() == 0 )
		
		item:setResId(1)
		assert ( item:getResId() == 1 )
	end;
	
	test_setForceLevel = function(self)
		local item = ItemEx({id=1, resId=2, number=1, forceLevel=3})
		assert ( item:getForceLevel() == 3 )
		
		item:setForceLevel(-1)
		assert ( item:getForceLevel() == 3 )
		
		item:setForceLevel(0)
		assert ( item:getForceLevel() == 0 )
		
		item:setForceLevel(1)
		assert ( item:getForceLevel() == 1 )
	end;
	
	test_bind = function(self)
		local item = ItemEx({id=1, resId=2, number=1, forceLevel=3, isBind=0})
		assert ( item:isBind() == false )
		item:bind()
		assert ( item:isBind() == true )
	end;
	
	test_clearAttrs = function(self)
		local item = ItemEx({id=1, resId=2, number=1, attrs={count=3}})
		assert ( item:getAttrsCount() == 3 )
		item:clearAttrs() 
		assert ( item:getAttrsCount() == 0 )
	end;
	
	test_addAttr = function(self)
		local g_resItem = {id=1, resId=2, number=3, attrs={count=0,attrs={}}}
		g_resItem.attrs.attrs[0] = {attr=0,val=0,unit=0}
		local item = ItemEx(g_resItem)
		assert ( item:getAttrsCount() == 0 )
		
		item:addAttr({attr=1, val=2, unit=0})
		assert ( item:getAttrsCount() == 1 )
		assert ( item.innerItem.attrs.attrs[0].attr == 1 )
		assert ( item.innerItem.attrs.attrs[0].val == 2 )
		assert ( item.innerItem.attrs.attrs[0].unit == 0 )
		
		local MAX_ITEM_ATTRS_CNT_bak = MAX_ITEM_ATTRS_CNT
		MAX_ITEM_ATTRS_CNT = 1
		
		assert ( item:getAttrsCount() == 1 )
		item:addAttr({attr=2, val=2, unit=0})
		assert ( item:getAttrsCount() == 1 )
		
		MAX_ITEM_ATTRS_CNT = MAX_ITEM_ATTRS_CNT_bak
	end;
	
	test_getAttrByIdx = function(self)
		local g_resItem = {id=1, resId=2, number=3, attrs={count=1,attrs={}}}
		g_resItem.attrs.attrs[0] = {attr=1,val=2,unit=0}
		local item = ItemEx(g_resItem)
		
		local attr = item:getAttrByIdx(0)
		assert ( attr ~= nil )
		
		local attr = item:getAttrByIdx(1)
		assert ( attr == nil )
	end;	
	
	test_clearGems = function(self)
		local item = ItemEx({id=1, resId=2, number=1, gems={count=3}})
		assert ( item:getGemsCount() == 3 )
		item:clearGems() 
		assert ( item:getGemsCount() == 0 )
	end;
	
	test_addGem = function(self)
		local g_resItem = {id=1, resId=2, number=3, gems={count=0,gems={}}}
		g_resItem.gems.gems[0] = 1001
		local item = ItemEx(g_resItem)
		assert ( item:getGemsCount() == 0 )
		
		item:addGem(1002)
		assert ( item:getGemsCount() == 1 )
		assert ( item.innerItem.gems.gems[0] == 1002 )
	end;
	
	test_removeGem = function(self)
		local g_resItem = {id=1, resId=2, number=3, gems={count=0,gems={}}}
		g_resItem.gems.gems[0] = 1001
		g_resItem.gems.gems[1] = 1002
		g_resItem.gems.gems[2] = 1003
		local item = ItemEx(g_resItem)
		
		item:addGem(1001)
		item:addGem(1002)
		item:addGem(1003)
		assert ( item:getGemsCount() == 3 )
		
		item:removeGem(-1)
		assert ( item:getGemsCount() == 3 )
		
		item:removeGem(3)
		assert ( item:getGemsCount() == 3 )
		
		item:removeGem(0)
		assert ( item:getGemsCount() == 2 )
		assert ( item:getGemByIdx(0) == 1002 )
		assert ( item:getGemByIdx(1) == 1003 )
		
		item:removeGem(1)
		assert ( item:getGemsCount() == 1 )
		assert ( item:getGemByIdx(0) == 1002 )
		
		item:removeGem(0)
		assert ( item:getGemsCount() == 0 )
	end;
	
	test_getGemByIdx = function(self)
		local g_resItem = {id=1, resId=2, number=3, gems={count=1,gems={}}}
		g_resItem.gems.gems[0] = 1001
		local item = ItemEx(g_resItem)
		
		assert( item:getGemByIdx(0) == 1001 )
		assert( item:getGemByIdx(1) == nil )
	end;
	
	test_setGemByIdx = function(self)
		local g_resItem = {id=1, resId=2, number=3, gems={count=1,gems={}}}
		g_resItem.gems.gems[0] = 1001
		local item = ItemEx(g_resItem)
		
		item:setGemByIdx(1, 1002)
		item:setGemByIdx(0, 1002)
		assert( item:getGemByIdx(0) == 1002 )
	end;
	
	test_copyFrom = function(self)
		local g_resItem1 = {id=2, resId=3, number=4, forceLevel=5, isBind=1, attrs={count=1,attrs={} }, gems={count=2,gems={}}}
		g_resItem1.attrs.attrs[0] = {attr=1,val=2,unit=0}
		g_resItem1.gems.gems[0] = 1001
		g_resItem1.gems.gems[1] = 1002
		local item1 = ItemEx(g_resItem1)
		
		local g_resItem2 = {id=1, resId=1, number=1, forceLevel=0, isBind=0, attrs={count=0,attrs={} }, gems={count=0,gems={}}}
		local item2 = ItemEx(g_resItem2)
		g_resItem2.attrs.attrs[0] = {attr=0,val=0,unit=0}
		g_resItem2.gems.gems[0] = 0
		
		item2:copyFrom(item1)
		
		assert ( item2:getId() == 2 )
		assert ( item2:getResId() == 3 )
		assert ( item2:getNumber() == 4 )
		assert ( item2:getForceLevel() == 5 )
		assert ( item2:isBind() == true )
		assert ( item2:getAttrsCount() == 1 )
		assert ( item2:getAttrByIdx(0).attr == 1 )
		assert ( item2:getAttrByIdx(0).val == 2 )
		assert ( item2:getAttrByIdx(0).unit == 0 )
		assert ( item2:getGemsCount() == 2 )
		assert ( item2:getGemByIdx(0) == 1001 )
		assert ( item2:getGemByIdx(1) == 1002 )
	end;
	
	test_clear = function(self)
		local g_resItem = {id=2, resId=3, number=4, forceLevel=5, attrs={count=1,attrs={} }, gems={count=1,gems={}}}
		local item = ItemEx(g_resItem)
		item:clear()
		assert ( item:getId() == 0 )
		assert ( item:getResId() == 0 )
		assert ( item:getNumber() == 0 )
		assert ( item:getForceLevel() == 0 )
		assert ( item:getAttrsCount() == 0 )
		assert ( item:getGemsCount() == 0 )
	end;
	
	test_hasAttr = function(self)
		local g_resItem = {id=2, resId=3, number=4, forceLevel=5, attrs={count=0,attrs={} }, gems={count=1,gems={}}}
		g_resItem.attrs.attrs[0] = {attr=0,val=0,unit=0}
		
		local item = ItemEx(g_resItem)
		item:addAttr({attr=ATTR.CO, val=2, unit=1})
		assert ( item:hasAttr(ATTR.CO) == true )
	end;
	
	test_getAttr = function(self)
		local g_resItem = {id=2, resId=3, number=4, forceLevel=5, attrs={count=0,attrs={} }, gems={count=1,gems={}}}
		g_resItem.attrs.attrs[0] = {attr=0,val=0,unit=0}
		
		local item = ItemEx(g_resItem)
		item:addAttr({attr=ATTR.CO, val=2, unit=1})
		
		assert ( item:getAttr(ATTR.CO).attr == ATTR.CO )
		assert ( item:getAttr(ATTR.CO).val == 2 )
		
		assert ( item:getAttr(ATTR.ES) == nil )
	end;
	
	test_toString = function(self)
		local g_resItem = {id=2, resId=3, number=4, forceLevel=5, isBind=1, attrs={count=1,attrs={} }, gems={count=2,gems={}}}
		g_resItem.attrs.attrs[0] = {attr=3,val=2,unit=1}
		g_resItem.gems.gems[0] = 1001
		g_resItem.gems.gems[1] = 1002
		
		local item = ItemEx(g_resItem)
		assert ( item:toString() == '{id=2,resId=3,number=4,isRaw=0,forceLevel=5,isBind=1,attrs={count=1,attrs={{attr=3,val=2,unit=1}}},gems={count=2,gems={1001,1002}}}' )
	end;
})

local TestCaseLuaItemEx = TestCase:extends({
	test_addAttr = function(self)
		local g_resItem = {id=1, resId=2, number=3, attrs={count=0,attrs={}}}
		g_resItem.attrs.attrs[1] = {attr=0,val=0,unit=0}
		local item = LuaItemEx(g_resItem)
		assert ( item:getAttrsCount() == 0 )
		
		item:addAttr({attr=1, val=2, unit=0})
		assert ( item:getAttrsCount() == 1 )
		assert ( item.innerItem.attrs.attrs[1].attr == 1 )
		assert ( item.innerItem.attrs.attrs[1].val == 2 )
		assert ( item.innerItem.attrs.attrs[1].unit == 0 )
	end;
	
	test_getAttrByIdx = function(self)
		local g_resItem = {id=1, resId=2, number=3, attrs={count=1,attrs={}}}
		g_resItem.attrs.attrs[1] = {attr=1,val=2,unit=0}
		local item = LuaItemEx(g_resItem)
		
		local attr = item:getAttrByIdx(0)
		assert ( attr ~= nil )
		
		local attr = item:getAttrByIdx(1)
		assert ( attr == nil )
	end;	
	
	test_hasAttr = function(self)
		local g_resItem = {id=2, resId=3, number=4, forceLevel=5, attrs={count=0,attrs={} }, gems={count=1,gems={}}}
		g_resItem.attrs.attrs[1] = {attr=0,val=0,unit=0}
		
		local item = LuaItemEx(g_resItem)
		item:addAttr({attr=ATTR.CO, val=2, unit=1})
		assert ( item:hasAttr(ATTR.CO) == true )
	end;
	
	test_getAttr = function(self)
		local g_resItem = {id=2, resId=3, number=4, forceLevel=5, attrs={count=0,attrs={} }, gems={count=1,gems={}}}
		g_resItem.attrs.attrs[1] = {attr=0,val=0,unit=0}
		
		local item = LuaItemEx(g_resItem)
		item:addAttr({attr=ATTR.CO, val=2, unit=1})
		assert ( item:getAttr(ATTR.CO).attr == ATTR.CO )
		assert ( item:getAttr(ATTR.ES) == nil )
	end;
	
	test_addGem = function(self)
		local g_resItem = {id=1, resId=2, number=3, gems={count=0,gems={}}}
		g_resItem.gems.gems[1] = 1001
		local item = LuaItemEx(g_resItem)
		assert ( item:getGemsCount() == 0 )
		
		item:addGem(1002)
		assert ( item:getGemsCount() == 1 )
		assert ( item.innerItem.gems.gems[1] == 1002 )
	end;
	
	test_removeGem = function(self)
		local g_resItem = {id=1, resId=2, number=3, gems={count=0,gems={}}}
		g_resItem.gems.gems[1] = 1001
		g_resItem.gems.gems[2] = 1002
		g_resItem.gems.gems[3] = 1003
		local item = LuaItemEx(g_resItem)
		
		item:addGem(1001)
		item:addGem(1002)
		item:addGem(1003)
		assert ( item:getGemsCount() == 3 )
		
		item:removeGem(-1)
		assert ( item:getGemsCount() == 3 )
		
		item:removeGem(3)
		assert ( item:getGemsCount() == 3 )
		
		item:removeGem(0)
		assert ( item:getGemsCount() == 2 )
		assert ( item:getGemByIdx(0) == 1002 )
		assert ( item:getGemByIdx(1) == 1003 )
		
		item:removeGem(1)
		assert ( item:getGemsCount() == 1 )
		assert ( item:getGemByIdx(0) == 1002 )
		
		item:removeGem(0)
		assert ( item:getGemsCount() == 0 )
	end;	
	
	test_getGemByIdx = function(self)
		local g_resItem = {id=1, resId=2, number=3, gems={count=1,gems={}}}
		g_resItem.gems.gems[1] = 1001
		local item = LuaItemEx(g_resItem)
		
		assert( item:getGemByIdx(0) == 1001 )
		assert( item:getGemByIdx(1) == nil )
	end;
	
	test_setGemByIdx = function(self)
		local g_resItem = {id=1, resId=2, number=3, gems={count=1,gems={}}}
		g_resItem.gems.gems[1] = 1001
		local item = LuaItemEx(g_resItem)
		
		item:setGemByIdx(1, 1002)
		item:setGemByIdx(0, 1002)
		assert( item:getGemByIdx(0) == 1002 )
	end;	
})

local TestCaseRawItemEx = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getId = function(self)
		local item = RawItemEx({id=1, resId=2, number=3})
		assert ( item:isRawItem() == true )
		assert ( item:getResId() == 2 )
		assert ( item:getNumber() == 3 )
	end;
	
	test_isBind = function(self)
		local item = RawItemEx({id=1, resId=2, number=3})
		assert ( item:isBind() == false )
		
		local item = RawItemEx({id=1, resId=2, number=3, isBind=1})
		assert ( item:isBind() == true )
		
		local item = RawItemEx({id=1, resId=2, number=3, isBind=0})
		assert ( item:isBind() == false )
	end;
	
	test_copyFrom = function(self)
		local g_resItem1 = {id=2, resId=3, number=4}
		local item1 = ItemEx(g_resItem1)
		
		local g_resItem2 = {id=1, resId=1, number=1}
		local item2 = RawItemEx(g_resItem2)
	
		item2:copyFrom(item1)
		
		assert ( item2:getId() == 1 )
		assert ( item2:getResId() == 3 )
		assert ( item2:getNumber() == 4 )
	end;
	
	test_toString = function(self)
		local g_resItem = {id=1, resId=2, number=3,isBind=0}
		local item = RawItemEx(g_resItem)
		assert ( item:toString() == '{id=1,resId=2,number=3,isRaw=1,forceLevel=0,isBind=0,attrs={count=0,attrs={}},gems={count=0,gems={}}}' )
	end;
})

TestCaseCppTempItemEx = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_setCppVarHdr = function(self)
		local g_hdr = {}
		local item = CppTempItemEx({id=1, resId=2, number=3})
		item:setCppVarHdr( g_hdr )
		assert ( item:getCppVarHdr() == g_hdr )
	end;
})


tqItemEx_t_main = function(suite)
	suite:addTestCase(TestCaseItemEx, 'TestCaseItemEx')
	suite:addTestCase(TestCaseLuaItemEx, 'TestCaseLuaItemEx')
	suite:addTestCase(TestCaseRawItemEx, 'TestCaseRawItemEx')
end;


