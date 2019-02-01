/*******************************************************************************/
require('./NpcDlg.js')
TestCaseNpcDlg = JTestCase.ex({
	setUp : function(){
		TestCaseHelper.setUp(this);
		this.dlg = NpcDlg.snew(this.g);
	}
	
	,tearDown : function(){
		TestCaseHelper.tearDown(this);
	}
	
	,test_getDlgCfg : function(){
		var dlgCfg = {modal:true, pos:{x:"center", y:"vcenter"}, uiback:uiback.dlg.noborder, uicfg:uicfg.npcdlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	}
	
	,test_setDesc : function(){
		this.dlg.openDlg({desc:'desc'});
		assertEQ ( TQ.getTextEx(this.dlg.getItems().desc), 'desc' );
	}
	
	,test_setOps : function(){
		this.dlg.openDlg({desc:'desc', ops:['op1','op2']});
		assertEQ ( this.dlg.getItems().opslist.getCount(), 2 );
		var item0 = this.dlg.getItems().opslist.getItem(0);
		assertEQ ( TQ.getTextEx(item0.exsubs.name), 'op1' );
		var item1 = this.dlg.getItems().opslist.getItem(1);
		assertEQ ( TQ.getTextEx(item1.exsubs.name), 'op2' );
		
		this.dlg.openDlg({desc:'desc'}); // set option list to empty
		assertEQ ( this.dlg.getItems().opslist.getCount(), 0 );
	}
	
	,test_selOption : function(){
		var opIdx_r = -1;
		this.dlg.openDlg({desc:'desc', ops:['op1','op2'], caller:Caller.snew(this, function(opIdx){
			opIdx_r = opIdx;
		})});
		this.dlg.getItems().opslist.clickItem(null, 0);
		assertEQ ( opIdx_r, 0 );
		assertEQ ( this.dlg.isShow(), false );
		this.dlg.getItems().opslist.clickItem(null, 1);
		assertEQ ( opIdx_r, 1 );
	}
});

tqNpcDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseNpcDlg, 'TestCaseNpcDlg');
};
