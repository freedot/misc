/*******************************************************************************/
require('./tqRedDot.js')

TestCaseRedDot = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
});

tqRedDot_t_main = function(suite) {
	suite.addTestCase(TestCaseRedDot, 'TestCaseRedDot');
};
