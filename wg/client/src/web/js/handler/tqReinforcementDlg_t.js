/*******************************************************************************/
requireEx('./handler/tqReinforcementDlg.js', [
	{
		start:'//ReinforcementDlg-unittest-start'
		,end:'//ReinforcementDlg-unittest-end'
		,items:[
			'm_this'
			,'m_dlg'
			,'m_items'
			,'m_g'
			,'_onSelfAlliDetail'
			,'_onArmyUpdate'
			,'_initDlg'
			,'_createDlg'
			,'_setCallers'
			,'_showDlg'
			,'_initInfo'
			,'_onClickEnterAlliance'
			,'_onClickRepatriateBtn'
		]
	}
]);
	

TestCaseReinforcementDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = ReinforcementDlg.snew(this.g);
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.g, 'regEvent');
		this.dlg.init(this.g);
		assertEQ ( this.lc().m_this, this.dlg);
		assertEQ ( this.lc().m_g, this.g);
		assertEQ ( this.mm.params['regEvent.0'], [EVT.SELFALLI_DETAIL, 0, this.dlg, this.lc()._onSelfAlliDetail] );
		assertEQ ( this.mm.params['regEvent.1'], [EVT.PERSONAL_ARMY_UPDATE, 0, this.dlg, this.lc()._onArmyUpdate] );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_showDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.dlg.openDlg()
		assertEQ ( this.mm.walkLog, '_initDlg,_showDlg,_initInfo' );	
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock(this.lc(), '_createDlg');
		this.mm.mock(this.lc(), '_setCallers');
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_setCallers' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );		
	};
	
	this.test__createDlg = function(){
		var g_dlg = MockDialog.snew(this.g);
		this.mm.mock( Dialog, 'snew:snewDlg', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snewDlg,initDlg' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snewDlg'], [this.g, {modal:false, title:rstr.alli.reinforcementdlg.title, pos:{x:'center', y:40} }] );
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.alli.reinforcementdlg, this.lc().m_items] ); 
	};
	
	this.test__setCallers = function(){
		this.mm.mock( this.lc().m_items.enterAllianceBtn, 'setCaller' );
		this.lc()._setCallers();
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onClickEnterAlliance}] );
	};
	
	this.test__showDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._showDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );		
	};
	
	this.helper_mock_listitembtn_caller = function(){
		this.lc().m_items.list.setItemCount(2);
		var item0 = this.lc().m_items.list.getItem(0);
		var item1 = this.lc().m_items.list.getItem(1);
		this.mm.mock(item0.exsubs.repatriateBtn, 'setCaller:setCaller0' );
		this.mm.mock(item1.exsubs.repatriateBtn, 'setCaller:setCaller1' );
		this.lc().m_items.list.setItemCount(0);
	};
	
	this.helper_setAllianceDetail = function(){
		var mydetail = {name:'alliance',cityResId:9900001,flag:'F',rank:1000,honour:100,level:1,leader:'leader',mem:10,buildVal:20,card:30,qqGroup:'123456',introduction:'<intro>',bulletin:'<bulletin>',upgrade:{startTime:10, stopTime:30},transfer:{startTime:15, stopTime:35}};
		this.g.getImgr().getMyAlliance().copyDetail(mydetail);
	};
	
	this.helper_setArmys = function(){
		var netcmd = {cmd:74,armys:{
			list:[
			 {id:1,state:0,expedType:5,armyType:ARMY_TYPE.ALLI,sourceRole:'alliance1',sourcePos:{x:0,y:0},heros:[{id:0},{id:2,name:"hero12",level:1,attrs:{"10":{val:100},"52":{val:1}},soldier:{resid:150001001,number:5}},{id:0},{id:0},{id:0}],targetType:1,targetRole:"target",targetPos:{x:203,y:0},stopTime:20}
			,{id:2,state:0,expedType:5,armyType:ARMY_TYPE.ALLI,sourceRole:"alliance2",sourcePos:{x:201,y:0},heros:[{id:0},{id:2,name:"hero12",level:1,attrs:{"10":{val:100},"52":{val:2}},soldier:{resid:150001001,number:5}},{id:0},{id:0},{id:0}],targetRole:"my",targetPos:{x:0,y:0},stopTime:20}
			,{id:3,state:0,expedType:5,armyType:ARMY_TYPE.ENEMY,sourceRole:"enemy",sourcePos:{x:201,y:0},heros:[{id:0},{id:2,name:"hero12",level:1,attrs:{"10":{val:100},"52":{val:3}},soldier:{resid:150001001,number:5}},{id:0},{id:0},{id:0}],targetRole:"my",targetPos:{x:0,y:0},stopTime:20}
			]}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:netcmd});
		var armys = this.g.getImgr().getArmys();
		TQ.dictCopy(armys, netcmd.armys);
	};
	
	this.helper_allianceInfo_checker = function(){
		assertEQ ( TQ.getTextEx(this.lc().m_items.name), 'alliance' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.level), 1 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.leader), 'leader' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.flag), 'F' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.rank), 1000 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.number), '2/5' );
	};
	
	this.helper_armyList_checker = function(){
		assertEQ ( this.lc().m_items.list.getCount(), 2 );
		var item0 = this.lc().m_items.list.getItem(0);
		var item1 = this.lc().m_items.list.getItem(1);
		assertEQ ( item0.exsubs.repatriateBtn.getId(), 0 );
		assertEQ ( TQ.getTextEx(item0.exsubs.roleName), 'alliance1' );
		assertEQ ( TQ.getTextEx(item0.exsubs.fightCap), 1 );
		assertEQ ( item1.exsubs.repatriateBtn.getId(), 1 );
		assertEQ ( TQ.getTextEx(item1.exsubs.roleName), 'alliance2' );
		assertEQ ( TQ.getTextEx(item1.exsubs.fightCap), 2 );
		assertEQ ( this.mm.params['setCaller0'], [{self:this.dlg, caller:this.lc()._onClickRepatriateBtn}] );
		assertEQ ( this.mm.params['setCaller1'], [{self:this.dlg, caller:this.lc()._onClickRepatriateBtn}] );
	};
	
	this.test__initInfo = function(){
		this.helper_mock_listitembtn_caller();
		this.helper_setAllianceDetail();
		this.helper_setArmys();
		this.mm.mock( AllianceSender, 'sendGetMyAllianceDetail' );
		this.lc()._initInfo();
		assertEQ ( this.mm.params['sendGetMyAllianceDetail'], [this.g] );
		this.helper_allianceInfo_checker();
		this.helper_armyList_checker();
	};
	
	this.test__onClickEnterAlliance = function(){
		this.mm.mock(UIM.getDlg('allimain'), 'openDlg');
		this.mm.mock(UIM.getPanel('main').getToolbar(), 'stopAllianceBlinking');
		this.lc()._onClickEnterAlliance();
		assertEQ ( this.mm.walkLog, 'openDlg,stopAllianceBlinking' );
	};
	
	this.test__onClickRepatriateBtn = function(){
		this.helper_setArmys();
		this.mm.mock(MilitarySender, 'sendRepatriateArmy' );
		var listIndex = 1;
		this.lc()._onClickRepatriateBtn(listIndex);
		assertEQ ( this.mm.walkLog, '' );
		assertEQ ( this.g.getGUI().isShowMsgBox(), true);
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.military.opdlg.lbl.confirmRepatriate );
		
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assert ( this.mm.walkLog == 'sendRepatriateArmy' );
		assertListEQ ( this.mm.params['sendRepatriateArmy'], [this.g, 2] );	
	};
	
	this.test__onSelfAlliDetail = function(){
		this.helper_mock_listitembtn_caller();
		this.helper_setAllianceDetail();
		this.helper_setArmys();
		this.lc().m_dlg.hide();
		this.lc()._onSelfAlliDetail();
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.lc().m_dlg.show();
		this.lc()._onSelfAlliDetail();
		this.helper_allianceInfo_checker();
		this.helper_armyList_checker();
	};
	
	this.test__onArmyUpdate = function(){
		this.helper_mock_listitembtn_caller();
		this.helper_setAllianceDetail();
		this.helper_setArmys();
		this.lc().m_dlg.hide();
		this.lc()._onArmyUpdate();
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.lc().m_dlg.show();
		this.lc()._onArmyUpdate();
		this.helper_allianceInfo_checker();
		this.helper_armyList_checker();	
	};
});

tqReinforcementDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseReinforcementDlg, 'TestCaseReinforcementDlg');
};
