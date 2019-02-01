/*******************************************************************************/
require('./ChatPanelDlg.js')
TestCaseChatPanelDlg = JTestCase.ex({
	setUp : function(){
		TestCaseHelper.setUp(this);
		this.dlg = ChatPanelDlg.snew(this.g);
		this.dlg.openDlg();
	}
	
	,tearDown : function(){
		TestCaseHelper.tearDown(this);
	}
	
	,test__getDlgCfg : function(){
		assertEQ ( this.dlg._getDlgCfg(), {modal:true, title:rstr.chatPanelDlg.title, pos:{x:"center", y:"vcenter"}, uicfg:uicfg.chatpaneldlg} );
	}
});

tqChatPanelDlg_t_main = function(suite) {
	if ( !TQ.isMobile() )  return;
	suite.addTestCase(TestCaseChatPanelDlg, 'TestCaseChatPanelDlg');
};
