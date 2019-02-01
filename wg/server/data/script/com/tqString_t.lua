require('tqString')

local TestCaseComString = TestCase:extends({
	testToJIONString  = function()
		local t1 = {{a=1,b=2},{c='3'},{d=false,e={e1='world',e2=10},f={1,2,3}},32,'hello',true}
		assert ( toJIONString(t1) == '[{a:1,b:2},{c:"3"},{d:0,f:[1,2,3],e:{e1:"world",e2:10}},32,"hello",1]')
	end;
	
	testToJIONString2  = function()
		local t1 = {}
		t1[10] = 'a'
		assert ( toJIONString(t1) == '{"10":"a"}')
	end;
	
	testToLUAString = function()
		local t = {{a=1,b=2},{c='3'},{d=false,e={e1='world',e2=10},f={1,2,3}},32,'hello',true}
		assert ( toLUAString(t) == '{{a=1,b=2},{c="3"},{d=0,f={1,2,3},e={e1="world",e2=10}},32,"hello",true}')
	end;
})

tqString_t_main = function(suite)
	suite:addTestCase(TestCaseComString, 'TestCaseComString')
end;


