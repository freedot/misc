require('tqUtil')

local TestCaseUtil = TestCase:extends({
	test_getRoundRand  = function(self)
		local vals = {{per=50,val=1},{per=50,val=2}}
		assert ( Util:getRoundRandVal( vals, 0 ).val == 1 )
		assert ( Util:getRoundRandVal( vals, 1 ).val == 1 )
		assert ( Util:getRoundRandVal( vals, 50 ).val == 1 )
		assert ( Util:getRoundRandVal( vals, 51 ).val == 2 )
		assert ( Util:getRoundRandVal( vals, 100 ).val == 2 )
		assert ( Util:getRoundRandVal( vals, 101 ) == nil )
	end;
	
	test_insertUnique = function(self)
		local p_array = {1,2}
		Util:insertUnique(p_array, nil, 1)
		assertEQ ( p_array, {1,2} )
		
		Util:insertUnique(p_array, nil, 3)
		assertEQ ( p_array, {1,2,3} )
		
		p_array = {{id=1},{id=2}}
		Util:insertUnique(p_array, 'id', {id=1})
		assertEQ ( p_array, {{id=1},{id=2}} )
		
		p_array = {{id=1},{id=2}}
		Util:insertUnique(p_array, 'id', {id=3})
		assertEQ ( p_array, {{id=1},{id=2},{id=3}} )
	end;
	
	test_pairListToDict = function(self)
		local d = Util:pairListToDict({100,1, 200, 2})
		assertEQ ( d[100], 1 )
		assertEQ ( d[200], 2 )
	end;
	
	test_getFixNextTime = function(self)
		local curTime = 1336395600 -- 2012-5-6 21:00:00
		Util:setTimeDrt(curTime)
		assertEQ ( Util:getFixNextTime(curTime, 22, 0, 0) - curTime, 3600 )
		assertEQ ( Util:getFixNextTime(curTime, 21, 0, 0) - curTime, 0 )
		assertEQ ( Util:getFixNextTime(curTime, 20, 0, 0) - curTime, 3600*23 )	
	end;
	
	test_getFixPreTime = function(self)
		local curTime = 1336395600 -- 2012-5-6 21:00:00
		Util:setTimeDrt(curTime)
		assertEQ ( curTime - Util:getFixPreTime(curTime, 22, 0, 0), 23*3600 )
		assertEQ ( curTime - Util:getFixPreTime(curTime, 21, 0, 0), 0 )
		assertEQ ( curTime - Util:getFixPreTime(curTime, 20, 0, 0), 3600 )	
	end;
	
	test_isInRects = function(self)
		local p_rects = {{x=0, y=0, w=2, h=2}}
		assertEQ ( Util:isInRects(p_rects, 0, 0), true )
		assertEQ ( Util:isInRects(p_rects, 1, 1), true )
		assertEQ ( Util:isInRects(p_rects, 1, 2), false )
		assertEQ ( Util:isInRects(p_rects, 2, 0), false )
		assertEQ ( Util:isInRects(p_rects, -1, 0), false )
		assertEQ ( Util:isInRects(p_rects, 0, -1), false )
	end;
	
	test_isCurDay = function(self)
		local timesec = 1368715763
		Util:setTimeDrt(timesec)
		assertEQ ( Util:isCurDay(timesec-1), true )
		assertEQ ( Util:isCurDay(timesec+1), true )
		assertEQ ( Util:isCurDay(timesec+3600*24), false )
	end;
	
	test_isCurMonth = function(self)
		local timesec = 1368715763
		Util:setTimeDrt(timesec)
		assertEQ ( Util:isCurMonth(timesec+3600*24), true )
		assertEQ ( Util:isCurMonth(timesec-3600*24), true )
		assertEQ ( Util:isCurMonth(timesec+20*3600*24), false )
	end;
})

tqUtil_t_main = function(suite)
	suite:addTestCase(TestCaseUtil, 'TestCaseUtil')
end;


