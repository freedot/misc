/*******************************************************************************/
require('./caller.js')
TestCaseCaller = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this._id1 = 0;
		this._id2 = 0;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.onCallback = function(id1, id2){
		this._id1 = id1;
		this._id2 = id2;
	};
	
	this.test_invoke = function(){
		var caller = Caller.snew(this, this.onCallback);
		caller.invoke(1, 2);
		assertEQ ( this._id1, 1 );
		assertEQ ( this._id2, 2 );
	};
});

tqcaller_t_main = function(suite) {
	suite.addTestCase(TestCaseCaller, 'TestCaseCaller');
};
