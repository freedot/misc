require('tqValidChecker')

local TestCaseValidChecker = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
	end;
	
	tearDown = function(self)	
		TestCaseHelper:clearAll(self)
	end;
	
	test_isRoleName = function(self)
		self.mm:travelMock( ValidChecker, '_isValidName' )
		assertEQ ( ValidChecker:isRoleName('ab\'e'), false )
		assertEQ ( getLastErrorStr(), rstr.validname.role.invalid )
		assertEQ ( self.mm.params['_isValidName'], {'ab\'e', ValidChecker.minrolelen, ValidChecker.maxrolelen, rstr.validname.role} )
	end;
	
	test_isHeroName = function(self)
		self.mm:travelMock( ValidChecker, '_isValidName' )
		assertEQ ( ValidChecker:isHeroName('ab\'e'), false )
		assertEQ ( getLastErrorStr(), rstr.validname.hero.invalid )
		assertEQ ( self.mm.params['_isValidName'], {'ab\'e', ValidChecker.minherolen, ValidChecker.maxherolen, rstr.validname.hero} )
	end;
	
	test_isAllianceName = function(self)
		self.mm:travelMock( ValidChecker, '_isValidName' )
		assertEQ ( ValidChecker:isAllianceName('ab\'e'), false )
		assertEQ ( getLastErrorStr(), rstr.validname.alli.invalid )
		assertEQ ( self.mm.params['_isValidName'], {'ab\'e', ValidChecker.minallilen, ValidChecker.maxallilen, rstr.validname.alli} )
	end;
	
	test_isNewAllianceName = function(self)
		local alli = Alliance()
		alli:setId(0)
		local rt = {alli}
		self.mm:mock(app:getAlliMgr(), 'getAlliByName', rt)
		assertEQ ( ValidChecker:isNewAllianceName('name'), true )
		assertEQ ( self.mm.params['getAlliByName'], {'name'} )
		
		alli:setId(1)
		assertEQ ( ValidChecker:isNewAllianceName('name'), false )
		assertEQ ( getLastErrorStr(), rstr.validname.alli.exist )
	end;
	
	test_isAllianceFlagName = function(self)
		self.mm:travelMock( ValidChecker, '_isValidName' )
		assertEQ ( ValidChecker:isAllianceFlagName('\''), false )
		assertEQ ( getLastErrorStr(), rstr.validname.alli.invalid )
		assertEQ ( self.mm.params['_isValidName'], {'\'', ValidChecker.minalliflaglen, ValidChecker.maxalliflaglen, rstr.validname.alliflag} )
		
		assertEQ ( ValidChecker:isAllianceFlagName('a'), true )
		assertEQ ( ValidChecker:isAllianceFlagName('号'), true )
		assertEQ ( ValidChecker:isAllianceFlagName('ab'), false )
		assertEQ ( getLastErrorStr(), rstr.validname.alliflag.long )
	end;
	
	test_isNewAllianceFlagName = function(self)
		local alli = Alliance()
		alli:setId(0)
		local rt = {alli}
		self.mm:mock(app:getAlliMgr(), 'getAlliByFlagName', rt)
		assertEQ ( ValidChecker:isNewAllianceFlagName('a'), true )
		assertEQ ( self.mm.params['getAlliByFlagName'], {'a'} )
		
		alli:setId(1)
		assertEQ ( ValidChecker:isNewAllianceFlagName('a'), false )
		assertEQ ( getLastErrorStr(), rstr.validname.alliflag.exist )	
	end;
	
	test__isValidName = function(self)
		local minLen = 2
		local maxLen = 4	
		local errorTip = rstr.validname.hero

		assertEQ ( ValidChecker:_isValidName('', minLen, maxLen, errorTip), false )
		assertEQ ( getLastErrorStr(), errorTip.empty )
		assertEQ ( ValidChecker:_isValidName('a', minLen, maxLen, errorTip), false )
		assertEQ ( getLastErrorStr(), errorTip.short )
		assertEQ ( ValidChecker:_isValidName('abcde', minLen, maxLen, errorTip), false )
		assertEQ ( getLastErrorStr(), errorTip.long )
		assertEQ ( ValidChecker:_isValidName('ab\'e', minLen, maxLen, errorTip), false )
		assertEQ ( getLastErrorStr(), errorTip.invalid )
		assertEQ ( ValidChecker:_isValidName('fuck', minLen, maxLen, errorTip), false )
		assertEQ ( getLastErrorStr(), errorTip.mask )
		assertEQ ( ValidChecker:_isValidName('name', minLen, maxLen, errorTip), true )
	end;
})

tqValidChecker_t_main = function(suite)
	suite:addTestCase(TestCaseValidChecker, 'TestCaseValidChecker')
end;

