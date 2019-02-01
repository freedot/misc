/*******************************************************************************/
require('./MiniChatPanel.js')
TestCaseMiniChatPanel = JTestCase.ex({
	setUp : function(){
		TestCaseHelper.setUp(this);
	}
	
	,tearDown : function(){
		TestCaseHelper.tearDown(this);
	}
});

tqMiniChatPanel_t_main = function(suite) {
	suite.addTestCase(TestCaseMiniChatPanel, 'TestCaseMiniChatPanel');
};
