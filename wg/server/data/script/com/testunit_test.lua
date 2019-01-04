require('testunit')

WasRun = TestCase:extends({
	setUp = function(self)
		self.log = 'setUp'
	end;
	
	testMethod = function(self)
		self.log = self.log..' testMethod'
	end;
	
	tearDown = function(self)
		self.log = self.log..' tearDown'
	end;
})

SetUpFailed = TestCase:extends({
	setUp = function(self)
		self.log = 'setUp'
		error()
	end;
	
	testMethod = function(self)
		self.log = self.log..' testMethod'
	end;
	
	tearDown = function(self)
		self.log = self.log..' testMethod'
	end;
})

TestCaseTest = TestCase:extends({
	testTemplateMethod = function(self)
		local test = WasRun:new('testMethod')
		local result = test:run()
		assert('setUp testMethod tearDown' == test.log)
	end;
	
	testResult = function(self)
		local test = WasRun:new('testMethod')
		local suite = TestSuite:new()
		local  result = test:run()
		assert('1 run, 0 failed' == result:summary())
	end;
	
	testFailedResultFormatting = function(self)
		local result= TestResult:new()
		result:testStarted()
		result:testFailed()
		result:testStarted()
		result:testFailed()
		assert("2 run, 2 failed" == result:summary() )
	end;
	
	testSetUpFailed = function(self)
		local test = SetUpFailed:new()
		test:run()
		assert('setUp' == test.log)
	end;
	
	testSuite = function(self)
		local suite = TestSuite:new()
		suite:add( WasRun:new('testMethod') )
		suite:add( WasRun:new('testBrokenMethod') )
		local result = suite:run()
		assert("2 run, 1 failed" == result:summary() )
	end;
})


local suite = TestSuite:new()
suite:add(TestCaseTest:new('testTemplateMethod'))
suite:add(TestCaseTest:new('testResult'))
suite:add(TestCaseTest:new('testFailedResultFormatting'))
suite:add(TestCaseTest:new('testSetUpFailed'))
suite:add(TestCaseTest:new('testSuite'))
local result = suite:run()
print(result:summary())





