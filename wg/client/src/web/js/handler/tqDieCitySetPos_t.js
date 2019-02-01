/*******************************************************************************/
require('./tqDieCitySetPos.js')

TestCaseDieCitySetPos = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = DieCitySetPos.snew(this.g);
		this.dlg.openDlg({x:1,y:2});
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__init = function(){
		this.mm.mock(this.g, 'regEvent');
		this.dlg._init();
		assertEQ ( this.mm.params['regEvent'], [EVT.NET, NETCMD.CREATEROLE, this.dlg, this.dlg._onSvrPkg] );
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:true, title:null, uiback:uiback.dlg.npc, pos:{x:"center", y:40}, uicfg:uicfg.diecitysetpos};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	/*
	this.test__afterCreate = function(){
		this.mm.mock(this.dlg.items_.changePosBtn, 'setCaller:changePosSetCaller');
		this.mm.mock(this.dlg.items_.confirmBtn, 'setCaller:confirmSetCaller');

		
		m_items.randName.setType(BTN_TYPE.DELAY);
		m_items.randName.setDelay(C_RANDNAMEDELAY);
		
		this.dlg._afterCreate();
		assertEQ ( 
	};
	*/
	this.test__setCallers = function(){
		this.mm.mock(this.dlg.items_.changePosBtn, 'setCaller:changePosSetCaller');
		this.mm.mock(this.dlg.items_.confirmBtn, 'setCaller:confirmSetCaller');
		
		this.dlg._setCallers();
		
		assertEQ ( this.mm.params['changePosSetCaller'], [{self:this.dlg, caller:this.dlg._onClickChangePos}] );
		assertEQ ( this.mm.params['confirmSetCaller'], [{self:this.dlg, caller:this.dlg._onClickConfirm}] );
	};
	
	this.test__initInfo = function(){
		assertEQ ( this.dlg.items_.changePosBtn.getType(), BTN_TYPE.DELAY);
		assertEQ ( this.dlg.items_.confirmBtn.getType(), BTN_TYPE.DELAY);
		assertEQ ( TQ.getTextEx(this.dlg.items_.title), rstr.dieCitySetPos.title );
		assertEQ ( TQ.getTextEx(this.dlg.items_.pos_x), 1 );
		assertEQ ( TQ.getTextEx(this.dlg.items_.pos_y), 2 );
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock(UIM.getDlg('tipmsgbox'), 'openDlg:tipMsgOpenDlg');
		this.mm.mock(UIM.getDlg('actterraceexped'), 'reset:terraceReset');
		this.mm.mock(UIM.getDlg('acttowerexped'), 'reset:towerReset');
		
		assertEQ ( this.dlg.dlg_.isShow(), true );
		var cmd = {data:{subid:3}};
		this.dlg._onSvrPkg(cmd);
		assertEQ ( this.dlg.dlg_.isShow(), false );
		assertEQ ( this.mm.params['tipMsgOpenDlg'], [rstr.dieCitySetPos.lbl.hasNoPos] );
		
		this.mm.clear();
		cmd = {data:{subid:4, pos:{x:10, y:20}}};
		this.dlg._onSvrPkg(cmd);
		assertEQ ( this.dlg.dlg_.isShow(), true );
		assertEQ ( TQ.getTextEx(this.dlg.items_.pos_x), 10 );
		assertEQ ( TQ.getTextEx(this.dlg.items_.pos_y), 20 );	

		this.mm.clear();
		cmd = {data:{subid:5}};		
		this.dlg._onSvrPkg(cmd);
		assertEQ ( this.dlg.dlg_.isShow(), false, 'set pos ok!' );
		
		this.mm.clear();
		cmd = {data:{subid:6}};		
		this.dlg._onSvrPkg(cmd);
		assertEQ ( this.mm.walkLog, 'terraceReset,towerReset', 'city died' );
	};
	
	this.test__onClickChangePos = function(){
		this.mm.mock(CreateRoleSender, 'sendGetRandPos');
		this.dlg._onClickChangePos();
		assertEQ ( this.mm.params['sendGetRandPos'], [this.g] );
	};
	
	this.test__onClickConfirm = function(){
		this.mm.mock(CreateRoleSender, 'sendSetPos');
		this.dlg._onClickConfirm();
		assertEQ ( this.mm.params['sendSetPos'], [this.g, {x:1, y:2}] );
	};
});

tqDieCitySetPos_t_main = function(suite) {
	suite.addTestCase(TestCaseDieCitySetPos, 'TestCaseDieCitySetPos');
};
