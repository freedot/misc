/*******************************************************************************/
require('./tqTestAnimDlg.js')
/*
requireEx('./handler/tqTestAnimDlg.js', [
	{
		start:'//TestAnimDlg-unittest-start'
		,end:'//TestAnimDlg-unittest-end'
		,items:[]
	}
]);
*/

TestCaseTestAnimDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
});

tqTestAnimDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseTestAnimDlg, 'TestCaseTestAnimDlg');
};
