/*******************************************************************************/
require('./tqRStrUtil.js')

TestCaseRStrUtil = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getCityNameByLevel = function(){
		assertEQ ( RStrUtil.getCityNameByLevel(1), TQ.qfind(res_citylevelneeds, 'level', 1).name);
		assertEQ ( RStrUtil.getCityNameByLevel(100), '');
	};
});

tqRStrUtil_t_main = function(suite) {
	suite.addTestCase(TestCaseRStrUtil, 'TestCaseRStrUtil');
};
