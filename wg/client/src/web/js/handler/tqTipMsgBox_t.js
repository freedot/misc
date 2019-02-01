/*******************************************************************************/
require('./tqTipMsgBox.js')

TestCaseTipMsgBox = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = TipMsgBox.snew(this.g);
		this.dlg.openDlg('msg');
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:true, title:null, uiback:uiback.dlg.npc, pos:{x:"center", y:40}, uicfg:uicfg.comm.tipmsgbox};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this.test__initInfo = function(){
		assertEQ ( TQ.getTextEx(this.dlg.items_.msg), 'msg' );
	};
});

tqTipMsgBox_t_main = function(suite) {
	suite.addTestCase(TestCaseTipMsgBox, 'TestCaseTipMsgBox');
};
