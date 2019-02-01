/*******************************************************************************/
require('./WaitingDlg.js')
TestCaseWaitingDlg = JTestCase.ex({
	setUp : function(){
		TestCaseHelper.setUp(this);
		this.dlg = WaitingDlg.snew(this.g);
		this.dlg.openDlg();
	}
	
	,tearDown : function(){
		TestCaseHelper.tearDown(this);
	}
	
	,test__getDlgCfg : function(){
		var dlgCfg = {modal:true, width:350, pos:{x:"center", y:250}, uicfg:uicfg.waitingdlg, uiback:uiback.dlg.npc};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	}
	
	,test_openWithTipMsg : function(){
		this.dlg.openDlg();
		assertEQ ( TQ.getTextEx(this.dlg.getItems().tip), '' );
		this.dlg.openDlg({});
		assertEQ ( TQ.getTextEx(this.dlg.getItems().tip), '' );
		this.dlg.openDlg({tip:'reconnected'});
		assertEQ ( TQ.getTextEx(this.dlg.getItems().tip), 'reconnected' );
		assertEQ ( this.dlg.isShow(), false );
	}
	
	,test_openWithCallback : function(){
		var bcall = false;
		this.dlg.openDlg({callback:Caller.snew(this, function(){
			bcall = true;
		})});
		assertEQ ( bcall, true );
	}
	
	,test_openWithHideWaiticon : function(){
		this.dlg.openDlg({hideicon:true});
		assertEQ ( TQ.getCSS(this.dlg.getItems().waiticon, 'display'), 'none' );
		this.dlg.openDlg({});
		assertEQ ( TQ.getCSS(this.dlg.getItems().waiticon, 'display'), 'block' );
	}
});

tqWaitingDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseWaitingDlg, 'TestCaseWaitingDlg');
};
