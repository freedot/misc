/*******************************************************************************/
require('./BindGuestDlg.js')
TestCaseBindGuestDlg = JTestCase.ex({
	setUp : function(){
		TestCaseHelper.setUp(this);
		this.dlg = BindGuestDlg.snew(this.g);
		this.dlg.openDlg();
	}
	
	,tearDown : function(){
		TestCaseHelper.tearDown(this);
	}
	
	,test__getDlgCfg : function(){
		var dlgCfg = {modal:true, pos:{x:"center", y:40}, title:rstr.bindGuestDlg.title, uicfg:uicfg.bindGuestDlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	}
	
	,test_tabTexts : function(){
		assertEQ ( this.dlg.getItems().tabs.getTabText(0),  rstr.bindGuestDlg.tabs[0]);
		assertEQ ( this.dlg.getItems().tabs.getTabText(1),  rstr.bindGuestDlg.tabs[1]);
	}
	
	,test_selectFirstTab : function(){
		assertEQ ( this.dlg.getItems().tabs.getActiveTab(), 0 );
	}
	
	,test_regCheckUserNameValid : function(){
		
	}
	
	,test_cancelRegBtn : function(){
		var items = this.dlg.getItems().tabs.getTabItems(0);
		assertEQ(this.dlg.isShow(), true);
		items.cancel.click();
		assertEQ(this.dlg.isShow(), false);
	}
	
	,test_cancelLoginBtn : function(){
		var items = this.dlg.getItems().tabs.getTabItems(1);
		assertEQ(this.dlg.isShow(), true);
		items.cancel.click();
		assertEQ(this.dlg.isShow(), false);
	}
	
	,test_confirmLoginBtn : function(){
		var items = this.dlg.getItems().tabs.getTabItems(1);
		items.confirm.click();
	}
});

tqBindGuestDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseBindGuestDlg, 'TestCaseBindGuestDlg');
};
