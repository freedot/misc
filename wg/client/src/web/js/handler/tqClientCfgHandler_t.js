/*******************************************************************************/
require('./tqClientCfgHandler.js')

TestCaseClientCfgHandler = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		ClientCfgHandler.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock(SoundMgr, 'playCurBackSound');
		assertEQ ( this.g.getImgr().isCanPlayBackSound(), true );
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.CLT_CFG, data:{ togglemap:[0, 0, 0, 0] }});
		assertEQ ( this.g.getImgr().isCanPlayBackSound(), true );
		assertEQ ( this.mm.params['playCurBackSound'], [] );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.CLT_CFG, data:{ togglemap:[1, 0, 0, 0] }});
		assertEQ ( this.g.getImgr().isCanPlayBackSound(), false );
		
		this.mm.clear();
		this.mm.mock(UIM, 'openDlg');
		res_gonggao.ver = 2;
		res_gonggao.autoshow = true;
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.CLT_CFG, data:{ gongGaoVer:2 }});
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		res_gonggao.ver = 2;
		res_gonggao.autoshow = false;
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.CLT_CFG, data:{ gongGaoVer:3 }});
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		res_gonggao.ver = 4;
		res_gonggao.autoshow = true;
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.CLT_CFG, data:{ gongGaoVer:3 }});
		assertEQ ( this.mm.params['openDlg'], ['gonggao'] );
	};
});

tqClientCfgHandler_t_main = function(suite) {
	suite.addTestCase(TestCaseClientCfgHandler, 'TestCaseClientCfgHandler');
};
