/*******************************************************************************/
require('./tqPlayHelpAviDlg.js')

TestCasePlayHelpAviDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
});

tqPlayHelpAviDlg_t_main = function(suite) {
	suite.addTestCase(TestCasePlayHelpAviDlg, 'TestCasePlayHelpAviDlg');
};
