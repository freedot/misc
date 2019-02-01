/*******************************************************************************/
require('./tqBaseDlg.js')


TestCaseBaseDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_new = function(){
		var dlg = JBaseDlg.snew(this.g);
	};
});

tqBaseDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseBaseDlg, 'TestCaseBaseDlg');
};
