--*******************************************************************************
require('tqDirtyWordChecker')


local TestCaseDirtyWordChecker = TestCase:extends({
	test_getPageCount = function(self)
		--print ( DirtyWordChecker.has('姐') )
		--print ( DirtyWordChecker.has('姐痛') )
		--local a = os.clock()
		--for i=1, 100 do
			--DirtyWordChecker.has('姐痛')
		--end
		--print ( os.clock() - a )
	end;
})

tqDirtyWordChecker_t_main = function(suite)
	suite:addTestCase(TestCaseDirtyWordChecker, 'TestCaseDirtyWordChecker')
end;


