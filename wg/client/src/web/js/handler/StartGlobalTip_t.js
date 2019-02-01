/*******************************************************************************/
require('./StartGlobalTip.js')
TestCaseStartGlobalTip = JTestCase.ex({
	setUp : function(){
		TestCaseHelper.setUp(this);
		this.dlg = StartGlobalTip.snew(this.g);
	}
	
	,tearDown : function(){
		TestCaseHelper.tearDown(this);
	}
	
	,test_openDlg : function() {
		this.mm.mock(UIM.getDlg('npc'), 'openDlg');		
		this.dlg.openDlg();
		var params = this.mm.params['openDlg'][0];
		assertEQ ( params.desc, TQ.format(rstr.startGlobalTip.desc, IMG.makeImg('reddot/01.png') ) );
		assertEQ ( params.ops, rstr.startGlobalTip.ops );
	}
	
	,test_selectOption : function(){
		this.mm.mock(TaskSender, 'sendNewcomerTaskEnd' );
		this.dlg.openDlg();
		UIM.getDlg('npc').getItems().opslist.clickItem(null, 0);
		assertEQ ( this.mm.params['sendNewcomerTaskEnd'], [ this.g] );
		assertEQ ( UIM.getDlg('npc').isShow(), false);
	}
});

tqStartGlobalTip_t_main = function(suite) {
	suite.addTestCase(TestCaseStartGlobalTip, 'TestCaseStartGlobalTip');
};
