/*******************************************************************************/
require('./tqNewcomerSpirit.js')

TestCaseGetTaskAwardsChecker = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.checker = HelpGuider.GetTaskAwardsChecker.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
});

TestCaseNewcomerSpirit = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.spirit = HelpGuider.getNewcomerSpirit();

		this.spirit.dlgs_ = [];
		this.spirit.dlgCheckers_ = {};
		this.spirit.chechers_ = {};
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.__test_onDlgOpen = function(){
		this.mm.mock(this.spirit, '_refreshDlg' );
		var testItems1 = {name:'testItems1'};
		this.spirit.onDlgOpen('test1', testItems1);
		assertEQ ( this.mm.params['_refreshDlg'], ['test1', testItems1] );
		
		var testItems2 = {name:'testItems2'};
		this.spirit.onDlgOpen('test2', testItems2);
		assertEQ ( this.mm.params['_refreshDlg'], ['test2', testItems2] );
		
		testItems1 = {name:'testItems1'};
		this.spirit.onDlgOpen('test1', testItems1);
		assertEQ ( this.mm.params['_refreshDlg'], ['test1', testItems1] );
		assertEQ ( this.spirit.dlgs_.length, 2 );
	};
	
	this.__test_onDlgClose = function(){
		this.mm.mock(this.spirit, '_refreshDlg' );
		this.mm.mock(HelpGuider.getNewcomerSpirit(), 'refreshCurNewcomerTask');
		
		var testItems1 = {name:'testItems1'};
		this.spirit.onDlgOpen('test1', testItems1);
		
		var testItems2 = {name:'testItems2'};
		this.spirit.onDlgOpen('test2', testItems2);
		
		var testItems3 = {name:'testItems3'};
		this.spirit.onDlgOpen('test3', testItems3);
		
		this.mm.clear();
		this.spirit.onDlgClose('test0');
		this.spirit.onDlgClose('test1');
		assertEQ ( this.spirit.dlgs_.length, 2 );
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.spirit.onDlgClose('test3');
		assertEQ ( this.spirit.dlgs_.length, 1 );
		assertEQ ( this.mm.params['_refreshDlg'], ['test2', testItems2] );
		
		this.mm.clear();
		this.spirit.onDlgClose('test2');
		assertEQ ( this.spirit.dlgs_.length, 0 );
		assertEQ ( this.mm.walkLog, 'refreshCurNewcomerTask' );
	};
	
	this.test_onSelBuildDlgOpen_invalidTaskRes = function(){
		this.mm.mock(UIM.getDlg('newcomerhelper'), 'getCurId', [0] );
		this.mm.mock(HelpGuider, 'hideSpirit');
	};
});

tqNewcomerSpirit_t_main = function(suite) {
	suite.addTestCase(TestCaseGetTaskAwardsChecker, 'TestCaseGetTaskAwardsChecker');
	suite.addTestCase(TestCaseNewcomerSpirit, 'TestCaseNewcomerSpirit');
};
