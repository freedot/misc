--*******************************************************************************
--  
--*******************************************************************************
require('tqExpendResMaker')

local TestCaseExpendResMaker = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_makeExpendRes = function(self)
		local p_res = {money=1}
		self.mm:mock(ExpendResMaker, 'makeExpendResWithNumber', {{name='expendres'}})
		assertEQ ( ExpendResMaker:makeExpendRes(p_res), {name='expendres'} )
		assertEQ ( self.mm.params['makeExpendResWithNumber'], {p_res, 1} )	
	end;
	
	test_makeExpendResWithNumber = function(self)
		self.mm:mock(ExpendResMaker, '_makeCommExpendRes')
		self.mm:mock(ExpendResMaker, '_makePopuExpendRes')
		self.mm:mock(ExpendResMaker, '_makeMoneyExpendRes')
		self.mm:mock(ExpendResMaker, '_makeItemExpendRes')
		
		local p_res = {money=1}
		local p_number = 2
		assertEQ ( ExpendResMaker:makeExpendResWithNumber(p_res, p_number), {} )
		assertEQ ( self.mm.walkLog, '_makeCommExpendRes,_makePopuExpendRes,_makeMoneyExpendRes,_makeItemExpendRes' )
		assertEQ ( self.mm.params['_makeCommExpendRes'], {p_res, {}, p_number} )
		assertEQ ( self.mm.params['_makePopuExpendRes'], {p_res, {}, p_number} )
		assertEQ ( self.mm.params['_makeMoneyExpendRes'], {p_res, {}, p_number} )
		assertEQ ( self.mm.params['_makeItemExpendRes'], {p_res, {}, p_number} )	
	end;
	
	test__makeCommExpendRes = function(self)
		local p_res = {food=1}
		local p_expendress = {}
		local p_number = 2
		ExpendResMaker:_makeCommExpendRes(p_res, p_expendress,p_number)
		assertEQ ( p_expendress, {{id=FIXID.FOOD,type=EXPEND_TYPE.COMMRES,val=1*2}} )
		
		local p_res = {food=1,wood=2,stone=3,iron=4}
		local p_expendress = {}
		ExpendResMaker:_makeCommExpendRes(p_res, p_expendress,p_number)
		
		assertEQ ( p_expendress, {
			{id=FIXID.WOOD,type=EXPEND_TYPE.COMMRES,val=2*2}
			,{id=FIXID.STONE,type=EXPEND_TYPE.COMMRES,val=3*2} 
			,{id=FIXID.IRON,type=EXPEND_TYPE.COMMRES,val=4*2}
			,{id=FIXID.FOOD,type=EXPEND_TYPE.COMMRES,val=1*2}
			} )
	end;
	
	test__makeMoneyExpendRes = function(self)
		local p_res = {}
		local p_expendress = {}
		local p_number = 2
		ExpendResMaker:_makeMoneyExpendRes(p_res, p_expendress, p_number)
		assertEQ ( p_expendress, {} )
		
		local p_res = {money=1}
		ExpendResMaker:_makeMoneyExpendRes(p_res, p_expendress, p_number)
		assertEQ ( p_expendress, {{attr=ATTR.MONEY,type=EXPEND_TYPE.MONEY,val=1*2}} )
	end;
	
	test__makePopuExpendRes = function(self)
		local p_res = {}
		local p_expendress = {}
		local p_number = 2
		ExpendResMaker:_makePopuExpendRes(p_res, p_expendress, p_number)
		assertEQ ( p_expendress, {} )
		
		local p_res = {addpopu=1}
		ExpendResMaker:_makePopuExpendRes(p_res, p_expendress, p_number)
		assertEQ ( p_expendress, {{attr=ATTR.IDLEPOPU,type=EXPEND_TYPE.IDLEPOPU,val=1*2}} )
	end;
	
	test__makeItemExpendRes = function(self)
		local p_res = {}
		local p_expendress = {}
		local p_number = 2
		ExpendResMaker:_makeItemExpendRes(p_res, p_expendress, p_number)
		assertEQ ( p_expendress, {} )
		
		local p_res = {items={{id=1,num=2},{id=3,num=4}}}
		local p_expendress = {}
		ExpendResMaker:_makeItemExpendRes(p_res, p_expendress, p_number)
		assertEQ ( p_expendress, {{resid=1,type=EXPEND_TYPE.ITEM,val=2*2},{resid=3,type=EXPEND_TYPE.ITEM,val=4*2}} )
	end;
})


tqExpendResMaker_t_main = function(suite)
	suite:addTestCase(TestCaseExpendResMaker, 'TestCaseExpendResMaker')
end;


