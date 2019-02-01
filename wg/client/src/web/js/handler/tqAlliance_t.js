/*******************************************************************************/
require('./tqAlliance.js')
/*
requireEx('./handler/tqAlliance.js', [
	{
		start:'//Alliance-unittest-start'
		,end:'//Alliance-unittest-end'
		,items:[]
	}
]);
*/

TestCaseAlliance = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
});

tqAlliance_t_main = function(suite) {
	suite.addTestCase(TestCaseAlliance, 'TestCaseAlliance');
};
