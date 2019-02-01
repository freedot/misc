/*******************************************************************************/
require('./tqGongGaoDlg.js')
TestCaseGongGaoDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = GongGaoDlg.snew(this.g);
		this.dlg.openDlg();
		this.items = this.dlg.getItems();		
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, title:rstr.gonggaodlg.title, pos:{x:"center", y:90}, uicfg:uicfg.gonggaodlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this.test_desc = function(){
		assertEQ ( TQ.getTextEx(this.items.desc.getContainerObj()), res_gonggao.desc );
	};
	
	this.test_sendVer = function(){
		this.mm.mock(ClientCfgSender, 'sendGongGaoVer');
		this.dlg.openDlg();
		assertEQ ( this.mm.params['sendGongGaoVer'], [this.g] );
	};
});

tqGongGaoDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseGongGaoDlg, 'TestCaseGongGaoDlg');
};
