/*******************************************************************************/
require('./tqDealByGoldHandler.js')

TestCaseDealByGoldHandler = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		DealByGoldHandler.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_handleSvrPkg = function(){
		g_platform = 'qzone';
		this.mm.mock(fusion2.dialog, 'buy');
		var cmd = {url_params:'url_params'};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.START_BuyByGold, data:cmd});
		//assertEQ ( this.mm.params['buy'][0].disturb, true );
		assertEQ ( this.mm.params['buy'][0].param, 'url_params' );
		//assertEQ ( this.mm.params['buy'][0].sandbox, true );
		assertEQ ( this.mm.params['buy'][0].context, "" );
		
		var data = this.mm.params['buy'][0];
		this.mm.clear();
		this.mm.mock(DealGoldSender, 'sendResultSucc');
		this.mm.mock(DealGoldSender, 'sendResultCancel');
		data.onSuccess();
		assertEQ (this.mm.walkLog, 'sendResultSucc' );
		assertEQ (this.mm.params['sendResultSucc'], [this.g] );
		
		this.mm.clear();
		data.onCancel();
		assertEQ (this.mm.walkLog, 'sendResultCancel' );
		assertEQ (this.mm.params['sendResultCancel'], [this.g] );
	};
});

tqDealByGoldHandler_t_main = function(suite) {
	suite.addTestCase(TestCaseDealByGoldHandler, 'TestCaseDealByGoldHandler');
};
