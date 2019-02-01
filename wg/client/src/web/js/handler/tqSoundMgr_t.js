/*******************************************************************************/
require('./tqSoundMgr.js')

TestCaseSoundMgr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_xxx = function(){
	};
});

tqSoundMgr_t_main = function(suite) {
	suite.addTestCase(TestCaseSoundMgr, 'TestCaseSoundMgr');
};
