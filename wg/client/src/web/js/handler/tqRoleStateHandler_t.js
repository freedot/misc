/*******************************************************************************/
requireEx('./handler/tqRoleStateHandler.js', [
	{
		start:'//RoleStateHandler-unittest-start'
		,end:'//RoleStateHandler-unittest-end'
		,items:['m_g', 'm_this', '_onLoginOk','_onSvrPkg']
	}
]);

TestCaseRoleStateHandler = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.hdr = RoleStateHandler.snew(this.g);
		this.lc = this.hdr.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.g, 'regEvent');
		this.hdr.init (this.g);
		assertEQ ( this.mm.walkLog, 'regEvent,regEvent' );
		assertEQ ( this.mm.params['regEvent.0'], [EVT.LOGIN_OK, 0, this.hdr, this.lc()._onLoginOk] );
		assertEQ ( this.mm.params['regEvent.1'], [EVT.NET, NETCMD.ROLESTATE, this.hdr, this.lc()._onSvrPkg] );
	};
	
	this.test__onLoginOk = function(){
		this.mm.mock(RoleStateSender, 'getAllStates');
		this.lc()._onLoginOk();
		assertEQ ( this.mm.params['getAllStates'], [this.g] );
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock(this.g, 'sendEvent');
		var cmd = {data:{}};
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.mm.walkLog, '' );
		
		cmd = {data:{states:[{id:1,stoptime:10}]}};
		this.lc()._onSvrPkg(cmd);
		assertEQ ( this.mm.params['sendEvent'], [{eid:EVT.ROLESPECSTATE_CHANGE, sid:0}] );
		assertEQ ( this.g.getImgr().getRoleState(1), {id:1,stoptime:10} );
	};
});

tqRoleStateHandler_t_main = function(suite) {
	suite.addTestCase(TestCaseRoleStateHandler, 'TestCaseRoleStateHandler');
};
