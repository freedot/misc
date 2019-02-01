/*******************************************************************************/
require('./tqMyDict.js')
/*
requireEx('./handler/tqMyDict.js', [
	{
		start:'//MyDict-unittest-start'
		,end:'//MyDict-unittest-end'
		,items:[]
	}
]);
*/

TestCaseMyDict = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_get = function(){
		var dict = MyDict.snew(0);
		assertEQ ( dict.get('key'), 0 );
		
		var dict = MyDict.snew('hello');
		assertEQ ( dict.get('key'), 'hello' );
	};
	
	this.test_set = function(){
		var dict = MyDict.snew(0);
		assertEQ ( dict.get('key'), 0 );
		dict.set('key', 10);
		assertEQ ( dict.get('key'), 10 );
	};
});

tqMyDict_t_main = function(suite) {
	suite.addTestCase(TestCaseMyDict, 'TestCaseMyDict');
};
