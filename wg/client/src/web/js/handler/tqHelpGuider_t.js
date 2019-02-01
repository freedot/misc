/*******************************************************************************/
require('./tqHelpGuider.js')

TestCaseHelpGuider = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
});

tqHelpGuider_t_main = function(suite) {
	suite.addTestCase(TestCaseHelpGuider, 'TestCaseHelpGuider');
};
