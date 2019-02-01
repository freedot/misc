requireEx('./handler/tqCultureDlg.js', [
	{
		start:'//CultureSvrPkgHdr-unittest-start'
		,end:'//CultureSvrPkgHdr-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'_initParam'
			,'_regEvents'
			,'_onLoginOk'
			,'_onSvrPkg'
			,'_onCulturesData'
			,'_onCultureLearningData'
			]
	}
]);

TestCaseCultureDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = CultureDlg.snew(g_app);
		UIM.regDlg('uselistitem', new UseListItemDlg(g_app));
		UIM.regDlg('filteritem', FilterItemDlg.snew(g_app));
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.testOpenDlg = function(){
		this.dlg.openDlg();
		assert( this.dlg.isShow() == true );
	};
	
	this.test_opSpeed = function(){
		this.mm.mock( ItemResUtil, 'findItemres', [{name:'culture'}] );
		this.mm.mock( UIM, 'openDlg' );
		
		var p_learnCulture = {id:0};
		this.dlg.opSpeed(p_learnCulture);
		assertEQ ( this.mm.walkLog, '' );
		
		p_learnCulture = {id:1, stoptime:10};
		this.dlg.opSpeed(p_learnCulture);
		assertEQ ( this.mm.walkLog, 'findItemres,openDlg' );
		assertEQ ( this.mm.params['findItemres'], [1] );
		assertEQ ( this.mm.params['openDlg'], ['uselistitem', [RES_EFF.ACC_CULTURELEARN], {id:1, stoptime:10, name:'culture', type:RES_TRG.SELF_ROLE}] );
	};
	
	this.test_opCancel = function(){
		this.mm.mock( CultureSender, 'sendCancelLearn' );
		p_learnCulture = {};
		this.dlg.opCancel(p_learnCulture);
		assertEQ ( this.mm.walkLog, 'sendCancelLearn' );
		assertEQ ( this.mm.params['sendCancelLearn'], [this.g] );
	};
	
	this.testTabNames = function(){
		this.dlg.openDlg();
		assert ( this.dlg.getCtrl('tablist').getTabCount() == 7 );
		for ( var i=0; i<7; ++i ) {
			assert ( this.dlg.getCtrl('tablist').getTabText(i) == rstr.culturedlg.tabs[i] );
		}
	};
	
	this.testOpenDlgSelectFirstTab = function(){
		this.dlg.openDlg();
		assert ( this.dlg.getCtrl('tablist').getActiveTab() == 0 );
	};
	
	this.testChangeTabSelectFirstListItem = function(){
		this.dlg.openDlg();
		var items = this.dlg.getCtrl('tablist').getTabItems(0);
		assert ( items.list.getCurSel() == 0 );
		
		this.dlg.getCtrl('tablist').activeTab(1);
		var items = this.dlg.getCtrl('tablist').getTabItems(1);
		assert ( items.list.getCurSel() == 0 );
	};
	
	this.testSkillItemShow = function(){
		var resitem = ItemResUtil.findItemres(120006);
		this.dlg.openDlg();
		var items = this.dlg.getCtrl('tablist').getTabItems(1);
		var item = items.list.getItem(0);
		assertInclude ( IMG.getBKImage( item.exsubs.icon ), IMG.makeBigImg(resitem.bigpic) );
		assertNoInclude ( TQ.getTextEx( item.exsubs.name ), 'undefined' );
		assert ( TQ.getTextEx( item.exsubs.level ) == '0' );
		assert ( TQ.getTextEx( item.exsubs.level_bak ) == '0' );
		
		TestCaseCondition.setPreCond(null, { cultures:[{id:120006,level:1}] });
		g_app.sendEvent({eid:EVT.CULTURE_UPDATE,sid:0});
		assert ( TQ.getTextEx( item.exsubs.level ) == '1' );
		assert ( TQ.getTextEx( item.exsubs.level_bak ) == '1' );
	};
	
	this.testCultureDescShow = function(){
		this.dlg.openDlg();
		var desc = this.dlg.getCtrl('desc');
		assertNoInclude( TQ.getTextEx(desc),  'undefined');
		assertNoInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.curleveleff);
		assertInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.nextleveleff);
		assertInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.maxlevel);
		assertInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.learnprecond);
		assertInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.learnneed);
		assertInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.rawneedtime);
		assertInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.needtime);
		assertInclude(TQ.getTextEx(desc), C_TIP_INVALIDCOLOR);
		assertNoInclude(TQ.getTextEx(desc), C_TIP_VALIDCOLOR);
		
		TestCaseCondition.setPreCond(null, { builds:[{resid:110010, level:50}], cultures:[{id:120001,level:10}] });
		g_app.sendEvent({eid:EVT.CULTURE_UPDATE,sid:0});
		assertNoInclude(TQ.getTextEx(desc),  'undefined');
		assertInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.curleveleff);
		assertInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.nextleveleff);
		assertInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.maxlevel);
		assertInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.learnprecond);
		assertInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.learnneed);
		assertInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.rawneedtime);
		assertInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.needtime);
		assertInclude(TQ.getTextEx(desc), C_TIP_VALIDCOLOR);
		assertInclude(TQ.getTextEx(desc), C_TIP_INVALIDCOLOR);
		
		TestCaseCondition.setPreCond(null, { money:10000000, food:10000000, builds:[{resid:110010, level:50}], cultures:[{id:120001,level:10}] });
		g_app.sendEvent({eid:EVT.CULTURE_UPDATE,sid:0});
		assertNoInclude(TQ.getTextEx(desc),  'undefined');
		assertInclude(TQ.getTextEx(desc), C_TIP_VALIDCOLOR);
		assertNoInclude(TQ.getTextEx(desc), C_TIP_INVALIDCOLOR);
		
		TestCaseCondition.setPreCond(null, { cultures:[{id:120001,level:20}] });
		g_app.sendEvent({eid:EVT.CULTURE_UPDATE,sid:0});
		assertNoInclude(TQ.getTextEx(desc),  'undefined');
		assertInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.curleveleff);
		assertNoInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.nextleveleff);
		assertInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.ismaxlevel);
		assertInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.maxlevel);
		assertNoInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.learnprecond);
		assertNoInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.learnneed);
		assertNoInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.rawneedtime);
		assertNoInclude(TQ.getTextEx(desc), rstr.culturedlg.tip.needtime);
		assertNoInclude(TQ.getTextEx(desc), C_TIP_VALIDCOLOR);
		assertNoInclude(TQ.getTextEx(desc), C_TIP_INVALIDCOLOR);
		
		TestCaseCondition.setPreCond(null, { cultures:[{id:120001,level:19}] });
		g_app.getImgr().getRoleRes().vip = 1;
		g_app.sendEvent({eid:EVT.CULTURE_UPDATE,sid:0});
		assertInclude(TQ.getTextEx(desc), TQ.format(rstr.culturedlg.tip.vipimm, 1) );
	};
	
	this.testLearnStateBtn = function(){
		TestCaseCondition.setPreCond(null, { cultures:[{id:120001,level:10}] });
		this.dlg.openDlg();
		assert( this.dlg.getCtrl('learnbtn').isEnable() == false );
		
		TestCaseCondition.setPreCond(null, { money:10000000, food:10000000, builds:[{resid:110010, level:50}], cultures:[{id:120001,level:10}] });
		g_app.sendEvent({eid:EVT.CULTURE_UPDATE,sid:0});
		assert( this.dlg.getCtrl('learnbtn').isEnable() == true );
		
		TestCaseCondition.setPreCond(null, { cultures:[{id:120001,level:20}] });
		g_app.sendEvent({eid:EVT.CULTURE_UPDATE,sid:0});
		assert( this.dlg.getCtrl('learnbtn').isEnable() == false );
	};
	
	this.testCultureTooltip = function(){	
		TestCaseCondition.setPreCond(null, { cultures:[{id:120001,level:10}] });
		this.dlg.openDlg();
		var items = this.dlg.getCtrl('tablist').getTabItems(0);
		var item = items.list.getItem(0);
		var tip = TTIP.getTipById(item.exsubs.tooltips['$item']);
		tip.getTip();
		assertNoInclude(tip.getTipMsg(), 'undefined');
		assertInclude(tip.getTipMsg(), rstr.culturedlg.tip.curleveleff);
		assertInclude(tip.getTipMsg(), rstr.culturedlg.tip.nextleveleff);		
	};
	
	this.testNoLearningToLearningToNoLearning = function(){
		this.dlg.openDlg();
		assertNoInclude(IMG.getBKImage(this.dlg.getCtrl('curicon')), 'images');
		assert(TQ.getTextEx(this.dlg.getCtrl('curname')) === '' );
		assert(TQ.getTextEx(this.dlg.getCtrl('upgradelevel')) === '' );
		assert(TQ.getTextEx(this.dlg.getCtrl('lefttime')) === '' );
		assert( this.dlg.getCtrl('speedbtn').isShow() == false );
		assert( this.dlg.getCtrl('cancelbtn').isShow() == false );
		
		TestCaseCondition.setPreCond(null, { learningculture:{id:120001,stoptime:30} });
		g_app.sendEvent({eid:EVT.CULTURE_UPDATE,sid:0});
		assertInclude(IMG.getBKImage(this.dlg.getCtrl('curicon')), 'images');
		
		TestCaseCondition.setPreCond(null, { learningculture:{id:0,stoptime:0} });
		g_app.sendEvent({eid:EVT.CULTURE_UPDATE,sid:0});
		assertNoInclude(IMG.getBKImage(this.dlg.getCtrl('curicon')), 'images');
		assert(TQ.getTextEx(this.dlg.getCtrl('curname')) === '' );
		assert(TQ.getTextEx(this.dlg.getCtrl('upgradelevel')) === '' );
		assert(TQ.getTextEx(this.dlg.getCtrl('lefttime')) === '' );
		assert( this.dlg.getCtrl('speedbtn').isShow() == false );
		assert( this.dlg.getCtrl('cancelbtn').isShow() == false );
	};
	
	this.testHasLearning = function(){
		g_app.setSvrTimeS(0);
		this.dlg.openDlg();
		TestCaseCondition.setPreCond(null, { learningculture:{id:120001,stoptime:30} });
		g_app.sendEvent({eid:EVT.CULTURE_UPDATE,sid:0});
		
		assertInclude(IMG.getBKImage(this.dlg.getCtrl('curicon')), 'images');
		assertNoInclude(TQ.getTextEx(this.dlg.getCtrl('curname')) , 'undefined' );
		assertInclude(TQ.getTextEx(this.dlg.getCtrl('upgradelevel')) , '0级 -> 1级' );
		assertNoInclude(TQ.getTextEx(this.dlg.getCtrl('lefttime')), 'undefined' );
		assertInclude(TQ.getTextEx(this.dlg.getCtrl('lefttime')), '00:00:30' );
		assert( this.dlg.getCtrl('speedbtn').isShow() == true );
		assert( this.dlg.getCtrl('cancelbtn').isShow() == true );

		g_app.setSvrTimeS(10);
		g_app.update();
		assertInclude( TQ.getTextEx(this.dlg.getCtrl('lefttime')), '00:00:20' );
		
		this.dlg.closeDlg(); // close dialog, stop update at 00:00:20
		g_app.setSvrTimeS(20);
		g_app.update();
		assertInclude( TQ.getTextEx(this.dlg.getCtrl('lefttime')), '00:00:20' );
		
		this.dlg.openDlg();
		assertInclude( TQ.getTextEx(this.dlg.getCtrl('lefttime')), '00:00:10' );
		
		g_app.setSvrTimeS(25);
		g_app.update();
		assertInclude( TQ.getTextEx(this.dlg.getCtrl('lefttime')), '00:00:05' );
		
		g_app.setSvrTimeS(30);
		TestCaseCondition.setPreCond(null, { learningculture:{id:0,stoptime:0} });
		g_app.update();
		assert( TQ.getTextEx(this.dlg.getCtrl('lefttime')) === '' );
	};
	
	this.testClickLearnBtnWhenLearning = function(){
		TestCaseCondition.setPreCond(null, { learningculture:{id:120001,stoptime:30}, money:10000000, food:10000000, builds:[{resid:110010, level:50}], cultures:[{id:120001,level:10}] });
		this.dlg.openDlg();
		assert( this.dlg.getCtrl('learnbtn').isEnable() == true );
		this.dlg.getCtrl('learnbtn').click();
		assert( TestCaseSysTip.getSystip() == rstr.culturedlg.err.learning);
	};
	
	this.testClickLearnBtnOK = function() {
		TestCaseCondition.setPreCond(null, { money:10000000, food:10000000, builds:[{resid:110010, level:50}], cultures:[{id:120001,level:10}] });
		this.dlg.openDlg();
		assert( this.dlg.getCtrl('learnbtn').isEnable() == true );
		this.dlg.getCtrl('learnbtn').click();
		assertNoInclude( g_app.getSendMsg(), 'undefined' );
	};
	
	this.testClickSpeedBtn = function() {
		TestCaseCondition.setPreCond(null, { learningculture:{id:120001,stoptime:30} });
		this.dlg.openDlg();
		assert( this.dlg.getCtrl('speedbtn').isShow() == true );
		this.dlg.getCtrl('speedbtn').click();
		assert( UIM.getDlg('uselistitem').isShow() == true );
	};
	
	this.testClickCancelSpeedBtn = function() {
		TestCaseCondition.setPreCond(null, { learningculture:{id:120001,stoptime:30} });
		this.dlg.openDlg();
		assert( this.dlg.getCtrl('cancelbtn').isShow() == true );
		this.dlg.getCtrl('cancelbtn').click();
		assert( g_app.getGUI().isShowMsgBox() == true );
		g_app.getGUI().msgBoxClick(MB_IDYES);
		assertNoInclude( g_app.getSendMsg(), 'undefined' );
	};

});

TestCaseCultureSvrPkgHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.hdr = CultureSvrPkgHdr.snew(this.g);
		this.lc = this.hdr.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_initParam');
		this.mm.mock(this.lc(), '_regEvents');
		
		this.hdr.init(this.g);
		assertEQ ( this.mm.walkLog, '_initParam,_regEvents' );
		assertEQ ( this.mm.params['_initParam'], [this.hdr, this.g] );
	};
	
	this.test__initParam = function(){
		assertEQ ( this.lc().m_this, this.hdr);
		assertEQ ( this.lc().m_g, this.g);
	};
	
	this.test__regEvents = function(){
		this.mm.mock(this.g, 'regEvent');
		this.lc()._regEvents();
		assertEQ ( this.mm.walkLog, 'regEvent,regEvent' );
		assertEQ ( this.mm.params['regEvent.0'], [EVT.LOGIN_OK, 0, this.hdr, this.lc()._onLoginOk] );
		assertEQ ( this.mm.params['regEvent.1'], [EVT.NET, NETCMD.CULTURE, this.hdr, this.lc()._onSvrPkg] );
	};
	
	this.test__onLoginOk = function(){
		this.mm.mock(CultureSender, 'sendGetCultures' );
		this.lc()._onLoginOk();
		assertEQ ( this.mm.walkLog, 'sendGetCultures' );
		assertEQ ( this.mm.params['sendGetCultures'], [this.g] );
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock( this.lc(), '_onCulturesData' );
		this.mm.mock( this.lc(), '_onCultureLearningData' );
		
		var p_netevent = {data:{}};
		this.lc()._onSvrPkg(p_netevent);
		assertEQ ( this.mm.walkLog, '_onCulturesData,_onCultureLearningData' );
		assertEQ ( this.mm.params['_onCulturesData'], [p_netevent.data] );
		assertEQ ( this.mm.params['_onCultureLearningData'], [p_netevent.data] );
	};
	
	this.test__onCulturesData = function(){
		this.mm.mock( this.g, 'sendEvent' );
		var p_data = {};
		this.lc()._onCulturesData(p_data);
		assertEQ ( this.mm.walkLog, '' );
			
		p_data.cultures = [{id:1}];
		this.lc()._onCulturesData(p_data);
		assertEQ ( this.mm.walkLog, 'sendEvent' );
		assertEQ ( this.mm.params['sendEvent'], [{eid:EVT.CULTURE_UPDATE,sid:0}] );
		assertEQ ( this.g.getImgr().getCultures(), p_data.cultures );
	};
	
	this.test__onCultureLearningData = function(){
		this.mm.mock( TQ, 'dictCopy' );
		this.mm.mock( ItemResUtil, 'initItemres' );
		this.mm.mock( this.g, 'sendEvent' );
		
		var p_data = {};
		this.lc()._onCultureLearningData(p_data);
		assertEQ ( this.mm.walkLog, '' );
		
		p_data.learning = {id:1};
		this.lc()._onCultureLearningData(p_data);
		assertEQ ( this.mm.walkLog, 'dictCopy,initItemres,sendEvent' );
		assertEQ ( this.mm.params['dictCopy'], [this.g.getImgr().getLearningCulture(), p_data.learning] );
		assertEQ ( this.mm.params['initItemres'], [this.g.getImgr().getLearningCulture(), 'id'] );
		assertEQ ( this.mm.params['sendEvent'], [{eid:EVT.CULTURE_UPDATE,sid:0}] );
	};
});

tqCultureDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseCultureDlg, 'TestCaseCultureDlg');
	suite.addTestCase(TestCaseCultureSvrPkgHdr, 'TestCaseCultureSvrPkgHdr');
};