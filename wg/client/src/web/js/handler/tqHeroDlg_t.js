
requireEx('./handler/tqHeroDlg.js', [
	{
		start:'//HeroArmTabView-unittest-start'
		,end:'//HeroArmTabView-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_parent'
			,'m_items'
			,'m_model'
			,'m_presenter'
			,'m_isArmPosItemsChanged'
			,'m_wearListPos'
			,'_initWearListPos'
			,'_setArmsTabText'
			,'_initArmsTab'
			,'_updateWearList'
			,'_clearWearList'
			,'_setWearList'
			,'_updateCurArmList'
			]
	}
	,{
		start:'//HeroDlgModel-unittest-start'
		,end:'//HeroDlgModel-unittest-end'
		,items:['m_g'
			,'m_this'
			,'_initHerosWearsItemres'
			]
	}
	,{
		start:'//HeroArmTabPresenter-unittest-start'
		,end:'//HeroArmTabPresenter-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_model'
			,'m_items'
			,'_setItems'
			,'_regItemChangeEvent'
			,'_setWearListCaller'
			,'_setArmsTabCaller'
			,'_setArmListCaller'
			,'_setWearListTipCaller'
			,'_setArmListTipCaller'
			,'_onItemChanged'
			,'_onClickWearList'
			,'_onClickArmsTab'
			,'_onClickArmList'
			,'_onGetWearArmTip'
			,'_onGetArmTip'
			,'_getWearArmTip'
			,'_getCurArm'
			]
	}
]);

TestCaseAddLevelByHeroFiveElemAttr = TestCase.extern(function(){
	this.test_getAddLevel = function(){
		var hero = {attrs:{}};
		hero.attrs[ATTR.JIN_SKILL_LEVEL] = {val:1};
		hero.attrs[ATTR.MU_SKILL_LEVEL] = {val:2};
		hero.attrs[ATTR.SHUI_SKILL_LEVEL] = {val:3};
		hero.attrs[ATTR.HUO_SKILL_LEVEL] = {val:4};
		hero.attrs[ATTR.TU_SKILL_LEVEL] = {val:5};
			
		assert ( AddLevelByHeroFiveElemAttr.getAddLevel(g_app, hero, {fiveelem:FIVEELEM_TYPE.JIN}) == 1 );
		assert ( AddLevelByHeroFiveElemAttr.getAddLevel(g_app, hero, {fiveelem:FIVEELEM_TYPE.MU}) == 2 );
		assert ( AddLevelByHeroFiveElemAttr.getAddLevel(g_app, hero, {fiveelem:FIVEELEM_TYPE.SHUI}) == 3 );
		assert ( AddLevelByHeroFiveElemAttr.getAddLevel(g_app, hero, {fiveelem:FIVEELEM_TYPE.HUO}) == 4 );
		assert ( AddLevelByHeroFiveElemAttr.getAddLevel(g_app, hero, {fiveelem:FIVEELEM_TYPE.TU}) == 5 );
		assert ( AddLevelByHeroFiveElemAttr.getAddLevel(g_app, hero, {}) == 0 );
	};
});

TestCaseHeroDlgHelper = TestCase.extern(function(){
	this.makeSimpleHerosData = function(){
		var svrcmd = {cmd:78,heros:[ {id:1,icon:101,name:"name1",level:1,state:0,prof:1}
			,{id:2,icon:201,name:"name2",level:1,state:0,prof:1} ]};
		return svrcmd;
	};
	
	this.makeDetailHeroData = function(){
		var svrcmd = {cmd:78,heros:[{id:1,isDetail:1,icon:109,name:"name1",level:20,state:0,prof:1,skeleton:{level:0},skills:[],wears:{},skillsteel:{id:0,stoptime:0},sex:0,official:0,islocked:0,subjects:[2,2,2,2,2],attrs:{"2":{val:0,u:0},"3":{val:100,u:0},"4":{val:0,u:0},"5":{val:54,u:0},"6":{val:0,u:0},"7":{val:100,u:0},"8":{val:100,u:0},"9":{val:150,u:0},"10":{val:100,u:0},"11":{val:100,u:0},"12":{val:0,u:0},"13":{val:20,u:0},"26":{val:10,u:0},"27":{val:0,u:0},"28":{val:10,u:0},"29":{val:0,u:0},"30":{val:10,u:0},"31":{val:0,u:0},"32":{val:3,u:0},"33":{val:0,u:0},"34":{val:10,u:0},"35":{val:15,u:0},"36":{val:10,u:0},"37":{val:10,u:0},"38":{val:10,u:0},"39":{val:5,u:0},"40":{val:0,u:1},"41":{val:16,u:0},"42":{val:1030,u:0},"43":{val:1085,u:0},"44":{val:1003,u:0}},soldier:{resid:0,number:0}}
			]};
		return svrcmd;
	};	
	
	this.makeHeroPPAttr = function(val){
		var svrcmd = {cmd:78,heros:[{id:1,attrs:{"32":{val:val,u:0}}}]};
		return svrcmd;
	};
	
	this.makeFireData = function(heroid){
		var svrcmd = {cmd:78,heros:[{id:heroid,_d:1}]};
		return svrcmd;
	};
	
	this.makeLockData = function(heroid){
		var svrcmd = {cmd:78,heros:[{id:heroid,lockstate:HERO_LOCKSTATE.LOCKED}]};
		return svrcmd;
	};
	
	this.makeUnLockData = function(heroid){
		var svrcmd = {cmd:78,heros:[{id:heroid,lockstate:HERO_LOCKSTATE.UNLOCKING,unlocktime:1}]};
		return svrcmd;
	};
	
	this.makeFreeLockData = function(heroid){
		var svrcmd = {cmd:78,heros:[{id:heroid,lockstate:HERO_LOCKSTATE.NONE}]};
		return svrcmd;
	};
	
	this.makeStrIFResult = function() {
		var svrcmd = {cmd:78,strifresult:[1,2,0]};
		return svrcmd;
	};
	
	this.simulateDetailHeroData = function(){
		var svrcmd = this.makeDetailHeroData();
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.HERORES, data:svrcmd});
	};
	
	this.simulateHeroMeiLuoSteelTime = function(heroid, stoptime){
		var svrcmd = {cmd:78,heros:[{id:heroid,skeleton:{stoptime:stoptime}}]};
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.HERORES, data:svrcmd});
	};
	
	this.simulateHeroCanUseSteelTime = function(){
		var svrcmd = {cmd:78,canusesstime:10};
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.HERORES, data:svrcmd});
	};
	
	this.selectDetailHero = function(testcase){
		this.simulateDetailHeroData();
		testcase.presenter.openDlg();
		testcase.view.getCtrl('herolist').clickItem(null, 0);
	};

	this.makeDetailHerosData = function(){
		var svrcmd = {cmd:78,heros:[{id:1,isDetail:1,icon:109,name:"name1",level:1,state:0,prof:1,skeleton:{level:0},skills:[],skillsteel:{id:0,stoptime:0},sex:0,official:0,islocked:0,subjects:[2,2,2,2,2],attrs:{"2":{val:0,u:0},"3":{val:100,u:0},"4":{val:0,u:0},"5":{val:54,u:0},"6":{val:0,u:0},"7":{val:100,u:0},"8":{val:100,u:0},"9":{val:150,u:0},"10":{val:100,u:0},"11":{val:100,u:0},"12":{val:0,u:0},"13":{val:20,u:0},"26":{val:10,u:0},"27":{val:0,u:0},"28":{val:10,u:0},"29":{val:0,u:0},"30":{val:10,u:0},"31":{val:0,u:0},"32":{val:3,u:0},"33":{val:0,u:0},"34":{val:10,u:0},"35":{val:15,u:0},"36":{val:10,u:0},"37":{val:10,u:0},"38":{val:10,u:0},"39":{val:5,u:0},"40":{val:0,u:1},"41":{val:16,u:0},"42":{val:1030,u:0},"43":{val:1085,u:0},"44":{val:1003,u:0}},soldier:{resid:0,number:0}}
			,{id:2,isDetail:1,icon:109,name:"name2",level:2,state:0,prof:2,skeleton:{level:0},skills:[],skillsteel:{id:0,stoptime:0},sex:0,official:0,islocked:0,subjects:[2,2,2,2,2],attrs:{"2":{val:0,u:0},"3":{val:100,u:0},"4":{val:0,u:0},"5":{val:54,u:0},"6":{val:0,u:0},"7":{val:100,u:0},"8":{val:100,u:0},"9":{val:150,u:0},"10":{val:100,u:0},"11":{val:100,u:0},"12":{val:0,u:0},"13":{val:20,u:0},"26":{val:10,u:0},"27":{val:0,u:0},"28":{val:10,u:0},"29":{val:0,u:0},"30":{val:10,u:0},"31":{val:0,u:0},"32":{val:3,u:0},"33":{val:0,u:0},"34":{val:10,u:0},"35":{val:15,u:0},"36":{val:10,u:0},"37":{val:10,u:0},"38":{val:10,u:0},"39":{val:5,u:0},"40":{val:0,u:1},"41":{val:16,u:0},"42":{val:1030,u:0},"43":{val:1085,u:0},"44":{val:1003,u:0}},soldier:{resid:0,number:0}}
			]};
		return svrcmd;
	};	
	
	this.simulateDetailHerosData = function(){
		var svrcmd = this.makeDetailHerosData();
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.HERORES, data:svrcmd});
	};
	
	this.selectDetailHeros = function(testcase){
		this.simulateDetailHerosData();
		testcase.presenter.openDlg();
		testcase.view.getCtrl('herolist').clickItem(null, 0);
	};
}).snew();


TestCaseHeroDlgModel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.model = HeroDlgModel.snew(g_app);
		this.lc = this.model.lc;
		
		res_items = [
			{id:1, bigpic:1001,  level:2, apos:2, name:'name1'}
			,{id:2, bigpic:1002, level:1, apos:2, name:'name2'}
			];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sortHeros = function(){
		var ndata = {data:{heros:[{id:1,level:10,attrs:{}},{id:2,level:11,attrs:{}},{id:3,level:10,attrs:{}},{id:4,level:10,attrs:{}}]}}
		ndata.data.heros[0].attrs[ATTR.FC] = {val:100, u:0};
		ndata.data.heros[0].attrs[ATTR.SFC] = {val:200, u:0};
		ndata.data.heros[1].attrs[ATTR.FC] = {val:10, u:0};
		ndata.data.heros[1].attrs[ATTR.SFC] = {val:20, u:0};
		ndata.data.heros[2].attrs[ATTR.FC] = {val:110, u:0};
		ndata.data.heros[2].attrs[ATTR.SFC] = {val:20, u:0};
		ndata.data.heros[3].attrs[ATTR.FC] = {val:100, u:0};
		ndata.data.heros[3].attrs[ATTR.SFC] = {val:300, u:0};
		this.model.handleHeroSvrData(ndata);
		assertEQ ( this.g.getImgr().getHeros().list[0].id, 2 );
		assertEQ ( this.g.getImgr().getHeros().list[1].id, 3 );
		assertEQ ( this.g.getImgr().getHeros().list[2].id, 4 );
		assertEQ ( this.g.getImgr().getHeros().list[3].id, 1 );
	};
	
	this.test_handleHeroSvrData = function(){
		this.mm.mock(TQ, 'dictCopy');
		this.mm.mock(this.lc(), '_initHerosWearsItemres');
		this.mm.mock(this.g.getImgr(), 'setHerosDefaultInfo');
		this.mm.mock(this.g, 'pendReplaceEvent');
		
		this.mm.mock(this.g.getImgr(), 'setCanUseSkillSteelTime');
		
		var ndata = {data:{heros:[]}}
		this.model.handleHeroSvrData(ndata);
		
		assert ( this.mm.walkLog == 'dictCopy,_initHerosWearsItemres,setHerosDefaultInfo,pendReplaceEvent' );
		assertListEQ ( this.mm.params['dictCopy'], [this.g.getImgr().getHeros().list, ndata.data.heros] );
		assertListEQ ( this.mm.params['_initHerosWearsItemres'], [this.g.getImgr().getHeros().list] );
		assert ( this.mm.params['pendReplaceEvent'][0].eid == EVT.HERO_UPDATE );
		assert ( this.mm.params['pendReplaceEvent'][0].sid == 0 );
		assert ( this.mm.params['pendReplaceEvent'][0].pendtime == 50 );
		
		ndata.data.canusesstime = 10;
		this.mm.clear();
		this.model.handleHeroSvrData(ndata);
		assert ( this.mm.walkLog == 'dictCopy,_initHerosWearsItemres,setHerosDefaultInfo,pendReplaceEvent,setCanUseSkillSteelTime,pendReplaceEvent' );
		assertListEQ ( this.mm.params['setCanUseSkillSteelTime'], [10] );
		assert ( this.mm.params['pendReplaceEvent.1'][0].eid == EVT.HERO_UPDATE );
		assert ( this.mm.params['pendReplaceEvent.1'][0].sid == 0 );
		assert ( this.mm.params['pendReplaceEvent.1'][0].pendtime == 50 );
	};
	
	this.test__initHerosWearsItemres = function(){
		var heros = [{id:1, wears:{'1':{resid:1},'2':{resid:2}}},{id:2, wears:{'1':null}},{id:3}];
		this.lc()._initHerosWearsItemres(heros);
		assert ( heros[0].wears[1].itemres == res_items[0] );
		assert ( heros[0].wears[2].itemres == res_items[1] );
	};
	
	this.testSimpleHeroSvrPkg = function(){
		var getevent = 0;
		g_app.regEvent(EVT.HERO_UPDATE, 0, this, function(){ getevent++; } );
	
		var svrcmd = TestCaseHeroDlgHelper.makeSimpleHerosData();
		this.model.handleHeroSvrData({data:svrcmd});
		assert( g_app.getImgr().getHerosCount() == 2 );
		assert( getevent == 1 );
	};
	
	this.testDetailHeroSvrPkg = function(){
		var svrcmd = TestCaseHeroDlgHelper.makeDetailHeroData();
		this.model.handleHeroSvrData({data:svrcmd});
		assert( g_app.getImgr().getHerosCount() == 1 );
		assert( g_app.getImgr().getHero(1).attrs != null );
	};
	
	this.testGetSubjectTooltip = function(){
		var svrcmd = TestCaseHeroDlgHelper.makeDetailHeroData();
		this.model.handleHeroSvrData({data:svrcmd});
		var tip = this.model.getSubjectTip(0);
		assertNoInclude( tip, 'undefined' );
		assertInclude( tip, rstr.comm.star );
	};
	
	this.testGetExpBarTooltip = function(){
		var svrcmd = TestCaseHeroDlgHelper.makeDetailHeroData();
		this.model.handleHeroSvrData({data:svrcmd});
		var tip = this.model.getExpBarTip(0);
		assertNoInclude( tip, 'undefined' );
		assertInclude( tip, rstr.herodlg.tips.curexp );
		assertInclude( tip, rstr.herodlg.tips.needexp );
		
		var hero = g_app.getImgr().getHeroByIdx(0);
		hero.level = res_max_hero_level;
		var tip = this.model.getExpBarTip(0);
		assertNoInclude( tip, 'undefined' );
		assertInclude( tip, rstr.herodlg.tips.curexp );
		assertInclude( tip, rstr.herodlg.tips.fulllevel );
	};
	
	this.testSetArmPosArms = function(){
		var g_arms = {};
		this.model.setArmPosArms(0, g_arms);
		assert ( this.model.getArmsByArmPos(0) == g_arms );
		assert ( !this.model.getArmsByArmPos(1) );
	};
});


TestCaseHeroDlgPresenter = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		this.view = HeroDlgView.snew(g_app);
		this.model = HeroDlgModel.snew(g_app);
		this.presenter = HeroDlgPresenter.snew(g_app, this.view, this.model);
		g_app.clearSendMsg();
		UIM.regDlg('inputtext', new InputTextDlg(g_app));
		UIM.regDlg('roleassignexp', RoleAssignExpDlg.snew(g_app));
		
		UIM.regDlg('uselistitem', new UseListItemDlg(g_app));
		UIM.regDlg('filteritem', FilterItemDlg.snew(g_app));
		UIM.regDlg('buyitem', MockDialog.snew());
		g_app.getImgr().clearHeros();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.getSubjectTipObj = function(){
		return TTIP.getTipById( this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_INFO_IDX)['tooltips']['$subject'] );
	};
	
	this.getExpbarTipObj = function(){
		return TTIP.getTipById( this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_INFO_IDX)['tooltips']['$expbar'] );
	};
	
	this.simulateSimpleHerosData = function(){
		var svrcmd = TestCaseHeroDlgHelper.makeSimpleHerosData();
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.HERORES, data:svrcmd});
	};
	
	this.simulateDetailHeroData = function(){
		var svrcmd = TestCaseHeroDlgHelper.makeDetailHeroData();
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.HERORES, data:svrcmd});
	};
	
	this.simulateLockHeroData = function(){
		var svrcmd = TestCaseHeroDlgHelper.makeLockData(1);
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.HERORES, data:svrcmd});
	};
	
	this.simultateUnLockHeroData = function(){
		var svrcmd = TestCaseHeroDlgHelper.makeUnLockData(1);
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.HERORES, data:svrcmd});
	};
	
	this.simultateFreeLockHeroData = function(){
		var svrcmd = TestCaseHeroDlgHelper.makeFreeLockData(1);
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.HERORES, data:svrcmd});
	};
	
	this.simulateFireHeroData = function(heroid){
		var svrcmd = TestCaseHeroDlgHelper.makeFireData(heroid);
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.HERORES, data:svrcmd});
	};
	
	this.selectDetailHero = function(){
		TestCaseHeroDlgHelper.selectDetailHero(this);
	};
	
	this.hasSystip = function(){
		return g_app.getGUI().getSysMsgTip().isShow() && isNotInclude( g_app.getGUI().getSysMsgTip().getMsg(), 'undefined' );
	};
	
	this.eqSystipStr = function(str){
		if ( !this.hasSystip() ) {
			return false;
		}
		
		return g_app.getGUI().getSysMsgTip().getMsg() == str;
	};
	
	this.getSystip = function(){
		return g_app.getGUI().getSysMsgTip().isShow() ?  g_app.getGUI().getSysMsgTip().getMsg() : '' ;
	};
	
	this.testHeroSvrPkg = function(){
		var svrcmd = TestCaseHeroDlgHelper.makeSimpleHerosData();
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.HERORES, data:svrcmd});
		assert( g_app.getImgr().getHerosCount() == 2 );
	};
	
	this.testUpdateHeroEvt = function(){
		this.view.openDlg();
		this.simulateSimpleHerosData();
		assert( this.view.getCtrl('herolist').getCount() == 2 );
	};
	
	this.testOpenDlg = function(){
		var callcnt = 0;
		this.view.openDlg = function() {callcnt++;};
		this.presenter.openDlg();
		assert(callcnt == 1);
	};
	
	this.testClickHeroListItem = function(){
		this.simulateSimpleHerosData();
		this.presenter.openDlg();
		g_app.clearSendMsg();
		this.view.getCtrl('herolist').clickItem(null, 0);
		assert(g_app.getSendMsg() != '');
		
		this.simulateDetailHeroData();
		g_app.clearSendMsg();
		this.view.getCtrl('herolist').clickItem(null, 0);
		assert(g_app.getSendMsg() == '');
	};
	
	this.testGetSubjectTooltip = function(){
		this.selectDetailHero();
		
		var g_heroidx = -1;
		this.model.getSubjectTip = function(heroidx) {g_heroidx=heroidx};
		
		this.getSubjectTipObj().getTip();
		
		assert(g_heroidx == 0);
	};
	
	this.testTabsName = function(){
		this.selectDetailHero();
		assert( this.view.getCtrl('tablist').getTabCount() == rstr.herodlg.tabs.length );
		for ( var i=0; i<rstr.herodlg.tabs.length; ++i ) 
			assert( this.view.getCtrl('tablist').getTabText(i) == rstr.herodlg.tabs[i] );
		assert( this.view.getCtrl('tablist').getActiveTab() == 0 );
	};
	
	this.testEmptyHero = function(){
		this.selectDetailHero();
		var items =this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_INFO_IDX);
		assertInclude( items.expbar.getText(), '%' );
	};
	
	this.testClickAssignExpBtn = function(){
		this.selectDetailHero();
		var items =this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_INFO_IDX);
		items.assignexp.click();
		assert( UIM.getDlg('roleassignexp').isShow() == true );
	};
	
	this.testExpBarTooltip = function(){
		this.selectDetailHero();
		
		var g_heroidx = -1;
		this.model.getExpBarTip = function(heroidx) {g_heroidx=heroidx}
		
		this.getExpbarTipObj().getTip();
		assert( g_heroidx != -1 );
	};
	
	this.testClickTreatmentBtn = function(){
		this.selectDetailHero();
		var items =this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_INFO_IDX);
		var hero = g_app.getImgr().getHeroByIdx(0);
		
		g_app.getImgr().setHeroAttrVal(hero, ATTR.HEALTH, g_app.getImgr().getHeroAttrVal(hero, ATTR.MHEALTH));
		g_app.clearSendMsg();
		items.treatment.click();
		assert( g_app.getGUI().getSysMsgTip().isShow() == true );
		assert(g_app.getSendMsg() == '');
		
		g_app.getImgr().addItem({id:1,resid:FIXID.SALVE,number:1});
		g_app.getImgr().setHeroAttrVal(hero, ATTR.HEALTH, g_app.getImgr().getHeroAttrVal(hero, ATTR.MHEALTH) - 20);
		g_app.clearSendMsg();
		items.treatment.click();
		assert(g_app.getGUI().isShowMsgBox() == true);
		assert(g_app.getSendMsg() == '');
		
		g_app.getImgr().addItem({id:2,resid:FIXID.SALVE,number:19});
		g_app.clearSendMsg();
		items.treatment.click();
		assert(g_app.getSendMsg() != '');
	};
	
	this.testClickAppointBtn = function(){
		this.selectDetailHero();
		var items =this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_INFO_IDX);
		
		assert(this.view.getCtrl('tablist').getActiveTab() == HERODLG_TAB_INFO_IDX );
		items.appoint.click();
		assert(this.view.getCtrl('tablist').getActiveTab() == HERODLG_TAB_OFFI_IDX );
	};
	
	this.testOfficalTabItems = function(){
		TestCaseHeroDlgHelper.selectDetailHeros(this);
		
		var hero = g_app.getImgr().getHeroByIdx(0);
		var items =this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_OFFI_IDX);
		
		assert( TQ.getTextEx(items.name) == hero.name );
		assertInclude( IMG.getBKImage(items.icon), 'gif' );
		assert( TQ.getTextEx(items.official) == rstr.herodlg.lbl.noofficial );
		
		assert( TQ.getTextEx(items.credit) !== '' );
		assert( TQ.getTextEx(items.command) !== '' );
		assert( TQ.getTextEx(items.desc) === rstr.herodlg.lbl.getCreditDesc );
		
		assert( items.list.getCount() == 0 );
		g_app.getImgr().getRoleRes().level = 5;
		this.view.heroUpdate();
		assert( items.list.getCount() == 1 );
		assert( TQ.getTextEx(items.list.getItem(0).exsubs.name) !== '' );
		assertInclude( TQ.getTextEx(items.list.getItem(0).exsubs.num) , '0/1' );
		assert( TQ.getTextEx(items.list.getItem(0).exsubs.add) !== '' );
		assert( TQ.getTextEx(items.list.getItem(0).exsubs.need) !== '' );
		
		hero.official = 1;
		this.view.heroUpdate();
		assertInclude( TQ.getTextEx(items.list.getItem(0).exsubs.num) , '1/1' );
		
		g_app.getImgr().getRoleRes().level = 29;
		this.view.heroUpdate();
		assert( items.list.getCount() == 2 );
		
		this.view.getCtrl('herolist').clickItem(null, 1);
		assert( TQ.getTextEx(items.name) == 'name1' );
	};
	
	this.testOfficialCongeBtnState = function() {
		this.selectDetailHero();
		var hero = g_app.getImgr().getHeroByIdx(0);
		
		var items =this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_OFFI_IDX);
		assert(items.conge.isEnable() == false);
		
		hero.official = 1;
		this.view.heroUpdate();
		assert(items.conge.isEnable() == true);
	};
	
	this.testClickCongeBtn = function() {
		this.selectDetailHero();
		var items =this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_OFFI_IDX);
		var hero = g_app.getImgr().getHeroByIdx(0);
		hero.official = 1;
		this.view.heroUpdate();
		
		hero.soldier.number = 1;
		hero.state = 0;
		g_app.getGUI().getSysMsgTip().clear();
		items.conge.click();
		assert( this.hasSystip() == true );
		
		hero.soldier.number = 0;
		hero.state = 1;
		g_app.getGUI().getSysMsgTip().clear();
		items.conge.click();
		assert( this.hasSystip() == true );
		
		hero.soldier.number = 0;
		hero.state = 0;
		items.conge.click();
		g_app.getGUI().msgBoxClick(MB_IDYES);
		assertNoInclude( g_app.getSendMsg(), 'undefined' );
	};
	
	this.testClickBuyOfficialItemBtn = function() {
		this.view.openDlg();
		var items =this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_OFFI_IDX);
		items.buyitem.click();
		assert( UIM.getDlg('buyitem').isShow() == true );
	};
	
	this.testClickConferOfficialBtn = function() {
		var bak_res_heroofficials = res_heroofficials; res_heroofficials = [];
		TQ.dictCopy(res_heroofficials, bak_res_heroofficials);
		res_heroofficials[0] = {needcredit:20,needitem:10,addcom:100,id:1};
		
		this.selectDetailHero();
		var hero = g_app.getImgr().getHeroByIdx(0);
		var items =this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_OFFI_IDX);
		g_app.getImgr().getRoleRes().level = 5;
		this.view.heroUpdate();
		var conferbtn = items.list.getItem(0).exsubs.confer;
		
		var _createNewHero = function() {
			var newhero = {};
			TQ.dictCopy(newhero, hero);
			newhero.id = 2;
			g_app.getImgr().getHeros().list.push(newhero);
			return newhero;
		};
		var otherhero = _createNewHero();

		var _setPreCondition = function(p) {
			otherhero.official = p.otherofficial
			
			hero.state = p.state
			hero.official = p.official
			g_app.getImgr().getHeroAttr(hero, ATTR.CRE).val = p.credit;
			g_app.getImgr().clearPkgItems();
			g_app.getImgr().addItem({id:1,resid:FIXID.TIGERCARD,number:p.itemnum});
		}
		
		_setPreCondition({state:1, official:0, credit:10000, itemnum:10000, otherofficial:0});
		conferbtn.click();
		assert( this.getSystip() == rstr.herodlg.err.confer.freestate );
		g_app.getGUI().getSysMsgTip().clear();
		
		_setPreCondition({state:0, official:1, credit:10000, itemnum:10000, otherofficial:0});
		conferbtn.click();
		assert( this.getSystip() == rstr.herodlg.err.confer.hasofficial );
		g_app.getGUI().getSysMsgTip().clear();
		
		_setPreCondition({state:0, official:0, credit:10000, itemnum:10000, otherofficial:1});
		conferbtn.click();
		assert( this.getSystip() == rstr.herodlg.err.confer.fullofficial );
		g_app.getGUI().getSysMsgTip().clear();
		
		_setPreCondition({state:0, official:0, credit:0, itemnum:10000, otherofficial:0});
		conferbtn.click();
		assert( this.getSystip() == rstr.herodlg.err.confer.noenoughcredit );
		g_app.getGUI().getSysMsgTip().clear();
		
		_setPreCondition({state:0, official:0, credit:10000, itemnum:0, otherofficial:0});
		conferbtn.click();
		assert( this.getSystip() == rstr.herodlg.err.confer.noenoughitem );
		g_app.getGUI().getSysMsgTip().clear();
		
		_setPreCondition({state:0, official:0, credit:10000, itemnum:10000, otherofficial:0});
		conferbtn.click();
		assert( this.hasSystip() == false );
		assert( g_app.getSendMsg() != '' );
		
		res_heroofficials = bak_res_heroofficials;
	};
	
	
	
	this.testJingmaiTabItems = function(){
		this.view.openDlg();
		this.view.heroUpdate();
		var items =this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_JINGMAI_IDX);
		
		assertNoInclude( IMG.getBKImage(items.jingmai1), 'images/hero/mailuo/disable.gif');
		assertNoInclude( IMG.getBKImage(items.jingmai2), 'images/hero/mailuo/disable.gif');
		assertNoInclude( IMG.getBKImage(items.jingmai8), 'images/hero/mailuo/disable.gif');
		assertEQ ( TQ.getCSS(items.innerForcePanel, 'display'), 'none' );
		assertEQ ( TQ.getCSS(items.jingmaibk, 'display'), 'none' );
		assertEQ ( TQ.getCSS(items.jingMaiInfoPanel, 'display'), 'none' );
		assertEQ ( TQ.getCSS(items.nojingmailabel, 'display'), 'block' );
		
		this.selectDetailHero();
		var hero = g_app.getImgr().getHeroByIdx(0);
		g_app.getImgr().addItem({id:1,resid:FIXID.CHILINGDAN,number:2});
		g_app.getImgr().getHeroAttr(hero, ATTR.IF).val = 10;
		g_app.getImgr().getHeroAttr(hero, ATTR.MIF).val = 100;
		hero.level = res_hero_hasjingmai_minlevel - 1;
		this.view.heroUpdate();
		assertEQ ( TQ.getCSS(items.innerForcePanel, 'display'), 'none' );
		assertEQ ( TQ.getCSS(items.jingmaibk, 'display'), 'none' );
		assertEQ ( TQ.getCSS(items.jingMaiInfoPanel, 'display'), 'none' );
		assertEQ ( TQ.getCSS(items.nojingmailabel, 'display'), 'block' );
		
		hero.level = res_hero_hasjingmai_minlevel;
		this.view.heroUpdate();
		assertEQ( TQ.getClass(items.jingmaibk), 'jingmaibk_nan' );
		
		hero.icon = 201;
		this.view.heroUpdate();
		assertEQ( TQ.getClass(items.jingmaibk), 'jingmaibk_nv' );
		
		assert( TQ.getTextEx(items.curinnerforce) == '10' );
		assert( TQ.getTextEx(items.maxinnerforce) == '100' );
		assert( TQ.getTextEx(items.strneeditem) === rstr.herodlg.lbl.strneeditem + '1' );
		assert( TQ.getTextEx(items.hasstritem) === rstr.herodlg.lbl.hasstritem + '2' );
		assert( TQ.getTextEx(items.strdesc.getContainerObj()) === rstr.herodlg.lbl.ifstrdesc );
		assertNoInclude( TQ.getTextEx(items.steeldesc) , 'undefined' );
		assert( TQ.getTextEx(items.steeltime) === '' );
		assert( items.istrtimes.getVal() === 1 );
		
		assert(items.buyitem.isEnable() == true);
		assert(items.strengthen.isEnable() == true);
		assert(items.steeljingmai.isEnable() == true);
		assert(items.steeljingmai.getText() == rstr.herodlg.btns.steeljingmai);
		assert(items.speedsteel.isShow() == false);
		
		hero.skeleton.level = 8;
		this.view.heroUpdate();
		assertNoInclude( TQ.getTextEx(items.steeldesc) , 'undefined' );
		assert(items.steeljingmai.isShow() == false);
		assert(items.speedsteel.isShow() == false);
		
		hero.skeleton.level = 6;
		hero.skeleton.stoptime = 30;
		g_app.setSvrTimeS(0);
		this.view.heroUpdate();
		assert( TQ.getTextEx(items.steeltime) == rstr.herodlg.lbl.ssteeltime + TQ.formatTime(0, 30) );
		assert(items.speedsteel.isShow() == true);
		assert(items.speedsteel.isEnable() == true);
		assert(items.steeljingmai.isEnable() == false);
		assert(items.steeljingmai.getText() == rstr.herodlg.btns.ssteeling);
		assert(items.istrtimes.getVal() == 1);
		
		hero.skeleton.level = 0;
		this.view.heroUpdate();
		assertNoInclude( IMG.getBKImage(items.jingmai1), 'images/hero/mailuo/sel.gif');
		assertNoInclude( IMG.getBKImage(items.jingmai2), 'images/hero/mailuo/disable.gif');
		assertNoInclude( IMG.getBKImage(items.jingmai8), 'images/hero/mailuo/disable.gif');
		
		hero.skeleton.level = 1;
		this.view.heroUpdate();
		assertNoInclude( IMG.getBKImage(items.jingmai1), 'images/hero/mailuo/normal.gif');
		assertNoInclude( IMG.getBKImage(items.jingmai2), 'images/hero/mailuo/sel.gif');
		assertNoInclude( IMG.getBKImage(items.jingmai8), 'images/hero/mailuo/disable.gif');
		

		this.g.getImgr().addItem({id:2,resid:FIXID.CHILINGDAN,number:3});
		this.g.sendEvent({eid:EVT.PKG_CHANGE,sid:0});
		assert( TQ.getTextEx(items.hasstritem) === rstr.herodlg.lbl.hasstritem + '5' );
		
		this.view.closeDlg();
		this.g.getImgr().addItem({id:3,resid:FIXID.CHILINGDAN,number:1});
		this.g.sendEvent({eid:EVT.PKG_CHANGE,sid:0});
		assert( TQ.getTextEx(items.hasstritem) === rstr.herodlg.lbl.hasstritem + '5' );
		
		assertEQ ( TQ.getCSS(items.innerForcePanel, 'display'), 'block' );
		assertEQ ( TQ.getCSS(items.jingmaibk, 'display'), 'block' );
		assertEQ ( TQ.getCSS(items.jingMaiInfoPanel, 'display'), 'block' );
		assertEQ ( TQ.getCSS(items.nojingmailabel, 'display'), 'none' );
	};
	
	this.testStrIFResult = function() {
		/* 调用有问题，在ie和firefox中没出现问题
		this.selectDetailHero();
		
		var strifresultcmd = TestCaseHeroDlgHelper.makeStrIFResult();
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.HERORES, data:strifresultcmd});
		assert( TQ.getTextEx(items.strdesc.getContainerObj()) !== rstr.herodlg.lbl.ifstrdesc );
		*/
	};
	
	this.testJingmaiNodeTips = function(){
		this.view.openDlg();
		var items = this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_JINGMAI_IDX);
		var tip = TTIP.getTipById(items.tooltips['$jingmai1']);
		
		tip.getTip();
		assert(tip.getTipMsg() === '');
		
		this.selectDetailHero();
		tip.getTip();
		assertNoInclude(tip.getTipMsg() , 'undefined');
	};
	
	this.testChiLingDanInputNumber = function() {
		this.selectDetailHero();
		var items = this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_JINGMAI_IDX);
		
		g_app.getImgr().addItem({id:1,resid:FIXID.CHILINGDAN,number:10});
		assert(TQ.getTextEx(items.strneeditem) == rstr.herodlg.lbl.strneeditem + '1' );
		items.istrtimes.setVal(10);
		assert(TQ.getTextEx(items.strneeditem) == rstr.herodlg.lbl.strneeditem + '10' );
	};
	
	this.testClickBuyChiLingDanBtn = function() {
		this.selectDetailHero();
		var items = this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_JINGMAI_IDX);
		
		items.buyitem.click();
		assert( UIM.getDlg('buyitem').isShow() == true );
	};
	

	this.testClickStrengthenIFBtn = function(){
		this.mm.mock(this.g.getGUI(), 'msgBox');
		this.selectDetailHero();
		var items = this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_JINGMAI_IDX);
		var hero = g_app.getImgr().getHeroByIdx(0);
		
		hero.state = 1;
		items.strengthen.click();
		assert(this.getSystip() == rstr.herodlg.err.strengthen.freestate );
		g_app.getGUI().getSysMsgTip().clear();
		
		hero.state = 0;
		items.strengthen.click();
		assertEQ ( this.mm.params['msgBox'], [rstr.comm.msgts, RStrUtil.makeNoItemBuyMsg(this.g, FIXID.CHILINGDAN, 1),  MB_F_CLOSE, null] );
		
		hero.state = 0;
		g_app.getImgr().addItem({id:1,resid:FIXID.CHILINGDAN,number:10});
		g_app.getImgr().getHeroAttr(hero, ATTR.IF).val = 10;
		g_app.getImgr().getHeroAttr(hero, ATTR.MIF).val = 10;
		items.strengthen.click();
		assert(this.getSystip() == rstr.herodlg.err.strengthen.arrivemaxval );
		g_app.getGUI().getSysMsgTip().clear();
		
		var mm = MethodMock.snew();
		mm.mock(UseItemSender, 'send', function(g, item, needNum, target){
			mm.g = g;
			mm.item = item;
			mm.needNum = needNum;
			mm.target = target;
			});
		hero.state = 0;
		g_app.getImgr().getHeroAttr(hero, ATTR.IF).val = 1;
		g_app.getImgr().getHeroAttr(hero, ATTR.MIF).val = 10;
		g_app.getImgr().addItem({id:1,resid:FIXID.CHILINGDAN,number:10});
		items.istrtimes.setVal(10);
		items.strengthen.click();
		mm.restore();
		
		assert (mm.g == g_app);
		assert (mm.item.resid == FIXID.CHILINGDAN);
		assert (mm.needNum > 0);
		assert (mm.target.type == RES_TRG.SELF_HERO);
		assert (mm.target.id == hero.id);
	};
});

TestCaseHeroDlgView = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.g = g_app;
		this.view = HeroDlgView.snew(g_app);
		this.model = HeroDlgModel.snew(g_app);
		this.presenter = HeroDlgPresenter.snew(g_app, this.view, this.model);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.testGetArmView = function(){
		assert ( this.view.getArmView() instanceof HeroArmTabView );
	};
	
	this.testHasCtrls = function(){
		this.view.openDlg();
		assert( this.view.getCtrl('herolist') );
		assert( this.view.getCtrl('tablist') );
	};
	
	this.testOpenDlgCurSel = function() {
		this.view.openDlg();
		assert( this.view.getCtrl('herolist').getCurSel() == -1 );
	};
	
	this.testSelectHero = function() {
		this.view.openDlg();
		
		var mm = MethodMock.snew();
		mm.mock(this.model, 'setCurHeroIdx', function(idx){
			mm.walkLog = 'setCurHeroIdx';
			mm.idx = idx;
			});
		mm.mock(this.view, 'beforeChangeHero', function(){
			mm.walkLog += ',beforeChangeHero';
			});
		mm.mock(this.view, 'heroUpdate', function(){
			mm.walkLog += ',heroUpdate';
			});
		mm.mock(HeroSender, 'sendGetDetail', function(g, heroId){
			mm.walkLog += ',sendGetDetail';
			mm.g = g;
			mm.heroId = heroId;
			});
		this.view.getCtrl('herolist').clickItem(null, -1);
		mm.restore();
		8
		assert ( mm.walkLog == 'setCurHeroIdx,beforeChangeHero,heroUpdate');
		assert ( mm.idx == -1 );
		
		//--
		var svrcmd = TestCaseHeroDlgHelper.makeSimpleHerosData();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.HERORES, data:svrcmd});
		
		var mm = MethodMock.snew();
		mm.mock(HeroSender, 'sendGetDetail', function(g, heroId){
			mm.walkLog = 'sendGetDetail';
			mm.g = g;
			mm.heroId = heroId;
			});
		
		this.view.getCtrl('herolist').clickItem(null, 0);
		mm.restore();
		
		assert ( mm.walkLog == 'sendGetDetail');
		assert ( mm.g == this.g );
		assert ( mm.heroId == 1 );
	};
	
	this.testEmptyHero_infotab = function() {
		this.view.openDlg();
		var items =this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_INFO_IDX);
		assert( items.expbar.getText() == '' );
	};
	
	this.testEmptyHero_officialtab = function() {
		this.view.openDlg();
		var items =this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_OFFI_IDX);
		assert( items.list.getCount() == 0 );
		
		assert( TQ.getTextEx(items.name) === '' );
		assertNoInclude( IMG.getBKImage(items.icon), 'images');
		assert( TQ.getTextEx(items.official) == '' );
		assert( TQ.getTextEx(items.credit) === '' );
		assert( TQ.getTextEx(items.command) === '' );
		assert( TQ.getTextEx(items.desc) === rstr.herodlg.lbl.getCreditDesc );
		
		assert(items.conge.isEnable() == false);
	};
	
	this.testEmptyHero_jingmaitab = function() {
		this.view.openDlg();
		var items =this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_JINGMAI_IDX);
		
		assert( TQ.getTextEx(items.curinnerforce) === '' );
		assert( TQ.getTextEx(items.maxinnerforce) === '' );
		assert( TQ.getTextEx(items.strneeditem) === '' );
		assert( TQ.getTextEx(items.hasstritem) === '' );
		assert( TQ.getTextEx(items.strdesc.getContainerObj() ) === '' );
		assert( TQ.getTextEx(items.steeldesc) === '' );
		assert( TQ.getTextEx(items.steeltime) === '' );
		assert( items.istrtimes.getVal() === 1 );
		
		assert(items.buyitem.isEnable() == false);
		assert(items.strengthen.isEnable() == false);
		assert(items.steeljingmai.isEnable() == false);
		assert(items.speedsteel.isShow() == false);
		
		assertEQ ( TQ.getClass(items.jingmaibk), 'jingmaibk_nan' );
	};
});


TestCaseHeroSteelJingMai = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.view = HeroDlgView.snew(g_app);
		this.model = HeroDlgModel.snew(g_app);
		this.presenter = HeroDlgPresenter.snew(g_app, this.view, this.model);
		this.initSomething();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.initSomething = function() {
		UIM.regDlg('filteritem', FilterItemDlg.snew(g_app));
		UIM.regDlg('uselistitem', new UseListItemDlg(g_app));
		TestCaseHeroDlgHelper.selectDetailHero(this);
		this.hero = g_app.getImgr().getHeroByIdx(0);
		this.hero.level = res_hero_hasjingmai_minlevel;
		this.items = this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_JINGMAI_IDX);	
	};
	
	this.setPreCond = function(p) {
		g_app.getGUI().getSysMsgTip().clear();
		g_app.getImgr().clearPkgItems();
		g_app.getImgr().setMoney(0);
		res_herojingmai[7].itemid = FIXID.MAILUODAN;
		res_herojingmai[7].needitem = 10;
		res_herojingmai[7].needmoney = 10;
		
		this.hero.skeleton.level = p.slevel;
		this.hero.level = p.herolevel;
		g_app.getImgr().getHeroAttr(this.hero, ATTR.IF).val = p.ifval;
		g_app.getImgr().addItem({id:1,resid:FIXID.MAILUODAN,number:p.itemnum});
		g_app.getImgr().setMoney(p.money);
	};
	
	this.testClickSteelJingmaiBtn_NoEnoughHeroLevel = function() {
		this.setPreCond({slevel:7, herolevel:1, ifval:400, money:1000000, itemnum:1000000});
		this.items.steeljingmai.click();
		assert(TestCaseSysTip.getSystip() == rstr.herodlg.err.skeleton.lowherolevel);
	};
	
	this.testClickSteelJingmaiBtn_NoEnoughInnerForce = function() {
		this.setPreCond({slevel:7, herolevel:150, ifval:0, money:1000000, itemnum:1000000});
		this.items.steeljingmai.click();
		assert(TestCaseSysTip.getSystip() == rstr.herodlg.err.skeleton.noenoughif);
	};
	
	this.testClickSteelJingmaiBtn_NoEnoughMoney = function() {
		this.setPreCond({slevel:7, herolevel:150, ifval:400, money:0, itemnum:1000000});
		this.items.steeljingmai.click();
		assert(TestCaseSysTip.getSystip() == rstr.herodlg.err.skeleton.noenoughmoney);
	};
	
	this.testClickSteelJingmaiBtn_NoEnoughItem = function() {
		this.mm.mock(this.g.getGUI(), 'msgBox');
		this.mm.mock(HeroSender, 'sendSteelSkeleton');
		this.setPreCond({slevel:7, herolevel:150, ifval:400, money:1000000, itemnum:0});
		this.items.steeljingmai.click();
		assertEQ ( this.mm.walkLog, 'msgBox' );
		var need = TQ.qfind(res_herojingmai, 'id', this.hero.skeleton.level + 1);
		assertEQ ( this.mm.params['msgBox'], [rstr.comm.msgts, RStrUtil.makeNoItemBuyMsg(this.g, need.itemid, need.needitem),  MB_F_CLOSE, null] );
	};
	
	this.testClickSteelJingmaiBtn_OK = function() {
		this.setPreCond({slevel:7, herolevel:150, ifval:400, money:1000000, itemnum:1000000});
		this.items.steeljingmai.click();
		assertInclude(g_app.getSendMsg() , 'id='+this.hero.id );
	};
	
	this.testShowSteelTime = function() {
		assert( TQ.getTextEx(this.items.steeltime) === ''  );
		
		g_app.setSvrTimeS(0);
		TestCaseHeroDlgHelper.simulateHeroMeiLuoSteelTime(this.hero.id, 30);
		assertInclude( TQ.getTextEx(this.items.steeltime), '00:00:30'  );
		
		g_app.setSvrTimeS(10);
		g_app.update();
		assertInclude( TQ.getTextEx(this.items.steeltime), '00:00:20'  );
		
		this.view.closeDlg(); // close dialog, stop update at 00:00:20
		g_app.setSvrTimeS(20);
		g_app.update();
		assertInclude( TQ.getTextEx(this.items.steeltime), '00:00:20'  );
		
		this.view.openDlg();
		g_app.setSvrTimeS(25);
		g_app.update();
		assertInclude( TQ.getTextEx(this.items.steeltime), '00:00:05'  );
	};
	
	this.testClickSpeedSteelBtn = function() {
		g_app.setSvrTimeS(0);
		TestCaseHeroDlgHelper.simulateHeroMeiLuoSteelTime(this.hero.id, 30);
		assert( this.items.speedsteel.isShow() == true );
		this.items.speedsteel.click();
		assert( UIM.getDlg('uselistitem').isShow() == true );
	};
});

TestCaseHeroSkillUIlItems = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.view = HeroDlgView.snew(g_app);
		this.model = HeroDlgModel.snew(g_app);
		this.presenter = HeroDlgPresenter.snew(g_app, this.view, this.model);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.selectHero = function(){
		TestCaseHeroDlgHelper.selectDetailHero(this);
		this.items = this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_SKILL_IDX);
		this.hero = g_app.getImgr().getHeroByIdx(0);
		this.hero.level = res_hero_hasskill_minlevel;
		this.view.heroUpdate();
	};
	
	this.testEmptyHero = function() {
		this.view.openDlg();
		var items =this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_SKILL_IDX);
		
		assertNoInclude( IMG.getBKImage(items.icon), 'images');

		assert ( TQ.getCSS(items.noskilllabel, 'display') == 'block' );
		assert ( TQ.getCSS(items.hasskillpanel, 'display') == 'none' );
	};
	
	this.testHasHero = function() {
		this.selectHero();
		var items = this.items;
		
		assert ( TQ.getCSS(items.noskilllabel, 'display') == 'none' );
		assert ( TQ.getCSS(items.hasskillpanel, 'display') == 'block' );
		
		assertInclude( IMG.getBKImage(items.icon), 'images');
		assertNoInclude( IMG.getBKImage(items.curtacticskill), 'images');
		
		assert( items.insight.isEnable() == true );
		assert( items.learn.isEnable() == true );
		assert( items.addtime.isShow() == true );
		
		//assert( TQ.getTextEx(items.cansteeltime) !== '' );
		assert( TQ.getTextEx(items.whichskillsteel) === rstr.herodlg.lbl.noskillsteel );
		assert( TQ.getTextEx(items.steellefttime) === '' );
		
		assert( items.baseskilllist.getCount() == 6 );
		assert( items.tacticskilllist.getCount() == 2 );
		assert( items.specskilllist.getCount() == 5 );
		
		this.hero.level = 1;
		this.view.heroUpdate();
		assert ( TQ.getCSS(items.noskilllabel, 'display') == 'block' );
		assert ( TQ.getCSS(items.hasskillpanel, 'display') == 'none' );
		assertInclude( IMG.getBKImage(items.icon), 'images');
	};
	
	this.testSpecSkillCount = function() {
		this.selectHero();
		
		this.hero.prof = 1;
		this.view.heroUpdate();
		assert( this.items.specskilllist.getCount() == 5 );
		
		this.hero.prof = 2;
		this.view.heroUpdate();
		assert( this.items.specskilllist.getCount() == 0 );
	};
	
	this.testSteelLeftTime = function() {
		this.selectHero();
		
		TestCaseCondition.setPreCond(this.hero, { skillsteel:{id:6001005,stoptime:30} })
		g_app.setSvrTimeS(0);
		this.view.heroUpdate();
		assert( TQ.getTextEx(this.items.whichskillsteel) !== '' );
		assertInclude( TQ.getTextEx(this.items.steellefttime), '00:00:30' );
		
		g_app.setSvrTimeS(0);
		g_app.update();
		assertInclude( TQ.getTextEx(this.items.steellefttime), '00:00:30' );
		
		g_app.setSvrTimeS(10);
		g_app.update();
		assertInclude( TQ.getTextEx(this.items.steellefttime), '00:00:20' );
		
		this.view.closeDlg(); // close dialog, stop update at 00:00:20
		g_app.setSvrTimeS(20);
		g_app.update();
		assertInclude( TQ.getTextEx(this.items.steellefttime), '00:00:20' );
		
		this.view.openDlg();
		assertInclude( TQ.getTextEx(this.items.steellefttime), '00:00:10' );
		
		g_app.setSvrTimeS(25);
		g_app.update();
		assertInclude( TQ.getTextEx(this.items.steellefttime), '00:00:05' );
		
		assert ( this.items.speedsteel.isShow() == true );
		
		TestCaseCondition.setPreCond(this.hero, { skillsteel:{id:0,stoptime:0} })
		this.view.heroUpdate();
		assert( TQ.getTextEx(this.items.whichskillsteel) === rstr.herodlg.lbl.noskillsteel );
		assert( TQ.getTextEx(this.items.steellefttime) === '' );
		assert ( this.items.speedsteel.isShow() == false );
	};
	
	this.testCurTacticSkill = function() {
		this.selectHero();
		
		TestCaseCondition.setPreCond(this.hero, { herocurtacticskill:0 })
		this.view.heroUpdate();
		assertNoInclude( IMG.getBKImage(this.items.curtacticskill), 'images' );
		
		TestCaseCondition.setPreCond(this.hero, { herocurtacticskill:6001001 })
		this.view.heroUpdate();
		assertInclude( IMG.getBKImage(this.items.curtacticskill), 'images' );
	};
	
	this.testCanUseBaseSkillGridCnt = function() {
		this.selectHero();
		this.hero.level = res_hero_hasskill_minlevel;
		this.hero.skills = [{id:6001008,level:1}];
		this.view.heroUpdate();
		assertNoInclude(IMG.getBKImage(this.items.baseskilllist.getItem(0).exsubs.icon), 'undefined' );
		assertInclude( IMG.getBKImage(this.items.baseskilllist.getItem(0).exsubs.icon), 'item/small/' );
		assertNoInclude(IMG.getBKImage(this.items.baseskilllist.getItem(1).exsubs.icon), 'images' );
		assertInclude( IMG.getBKImage(this.items.baseskilllist.getItem(2).exsubs.icon), 'hero/skilllock.gif' );
		assertInclude( IMG.getBKImage(this.items.baseskilllist.getItem(3).exsubs.icon), 'hero/skilllock.gif' );
		assertInclude( IMG.getBKImage(this.items.baseskilllist.getItem(4).exsubs.icon), 'hero/skilllock.gif' );
		assertInclude( IMG.getBKImage(this.items.baseskilllist.getItem(5).exsubs.icon), 'hero/skilllock.gif' );
	};
	
	this.testBaseSkillItemShow = function() {
		this.selectHero();
		this.hero.level = res_hero_hasskill_minlevel;
		this.hero.attrs[ATTR.JIN_SKILL_LEVEL] = {val:2};
		
		this.hero.skills = [{id:6001008,level:1},{id:6001001,level:1},{id:6001022,level:2}];
		this.view.heroUpdate();
		
		assert( TQ.getTextEx(this.items.baseskilllist.getItem(0).exsubs.num) === '1(<font color="' + COLORS.APPEND_ATTR + '">+2</font>)/10' );
		assert( TQ.getTextEx(this.items.baseskilllist.getItem(0).exsubs.bnum) === '1(+2)/10' );
		assert( TQ.getTextEx(this.items.baseskilllist.getItem(1).exsubs.num) === '2/10' );
		assert( TQ.getTextEx(this.items.baseskilllist.getItem(1).exsubs.bnum) === '2/10' );
		
		assert( TQ.getTextEx(this.items.baseskilllist.getItem(2).exsubs.num) === '' );
		assert( TQ.getTextEx(this.items.baseskilllist.getItem(2).exsubs.bnum) === '' );
	};
	
	this.testBaseSkillItemTooltip = function() {
		this.selectHero();
		this.hero.level = res_hero_hasskill_minlevel;
		this.hero.skills = [{id:6001008,level:12,dex:1}];
		this.view.heroUpdate();
		
		var tip = TTIP.getTipById(this.items.baseskilllist.getItem(0).exsubs.tooltips['$item']);
		tip.getTip();
		assertNoInclude(tip.getTipMsg(), 'undefined');
		assertInclude(tip.getTipMsg(), rstr.herodlg.lbl.skilldex );
		assertInclude(tip.getTipMsg(), rstr.herodlg.lbl.nextskill );
		assertInclude(tip.getTipMsg(), '12' );
		assertInclude(tip.getTipMsg(), rstr.herodlg.lbl.steelskilltip );

		var emptytip = TTIP.getTipById(this.items.baseskilllist.getItem(1).exsubs.tooltips['$item']);
		emptytip.getTip(); assertEQ(emptytip.getTipMsg(), '' );

		
		var locktip = TTIP.getTipById(this.items.baseskilllist.getItem(2).exsubs.tooltips['$item']);
		locktip.getTip(); assertEQ(locktip.getTipMsg(), rstr.herodlg.tips.skill.lockedskill[2] );
		locktip = TTIP.getTipById(this.items.baseskilllist.getItem(3).exsubs.tooltips['$item']);
		locktip.getTip(); assertEQ(locktip.getTipMsg(), rstr.herodlg.tips.skill.lockedskill[3] );
		locktip = TTIP.getTipById(this.items.baseskilllist.getItem(4).exsubs.tooltips['$item']);
		locktip.getTip(); assertEQ(locktip.getTipMsg(), rstr.herodlg.tips.skill.lockedskill[4] );
		locktip = TTIP.getTipById(this.items.baseskilllist.getItem(5).exsubs.tooltips['$item']);
		locktip.getTip(); assertEQ(locktip.getTipMsg(), rstr.herodlg.tips.skill.lockedskill[5] );
		
		this.hero.skills = [{id:6001009,level:10,dex:1}];
		this.view.heroUpdate();
		tip.getTip();
		assertNoInclude(tip.getTipMsg(), 'undefined');

		assertNoInclude(tip.getTipMsg(), rstr.herodlg.lbl.skilldex );
		assertNoInclude(tip.getTipMsg(), rstr.herodlg.lbl.steelskilltip );
	};
	
	this.testShowCanUseSteelTime = function() {
		this.selectHero();
		assert( TQ.getTextEx(this.items.cansteeltime) === TQ.format(rstr.herodlg.lbl.leftskillsteeltime, 0)  );
		
		TestCaseHeroDlgHelper.simulateHeroCanUseSteelTime();
		assert( TQ.getTextEx(this.items.cansteeltime) === TQ.format(rstr.herodlg.lbl.leftskillsteeltime, 10)  );
	};	
	
	this.testTacticSkillItemShow = function() {
		this.selectHero();
		
		assertNoInclude(IMG.getBKImage(this.items.tacticskilllist.getItem(0).exsubs.icon), 'undefined' );
		assertInclude( IMG.getBKImage(this.items.tacticskilllist.getItem(0).exsubs.icon), 'item/small/' );
		assert( TQ.getTextEx(this.items.tacticskilllist.getItem(0).exsubs.num) === '0/1' );
		assert( TQ.getTextEx(this.items.tacticskilllist.getItem(0).exsubs.bnum) === '0/1' );
		
		assertNoInclude(IMG.getBKImage(this.items.tacticskilllist.getItem(1).exsubs.icon), 'undefined' );
		assertInclude( IMG.getBKImage(this.items.tacticskilllist.getItem(1).exsubs.icon), 'item/small/' );
		assert( TQ.getTextEx(this.items.tacticskilllist.getItem(1).exsubs.num) === '0/1' );
		assert( TQ.getTextEx(this.items.tacticskilllist.getItem(1).exsubs.bnum) === '0/1' );
		
		TestCaseCondition.setPreCond(this.hero, { heroskills:[{id:6001001,level:1},{id:6001002,level:1}] })
		this.view.heroUpdate();
		assert( TQ.getTextEx(this.items.tacticskilllist.getItem(0).exsubs.num) === '1/1' );
		assert( TQ.getTextEx(this.items.tacticskilllist.getItem(0).exsubs.bnum) === '1/1' );
		assert( TQ.getTextEx(this.items.tacticskilllist.getItem(1).exsubs.num) === '1/1' );
		assert( TQ.getTextEx(this.items.tacticskilllist.getItem(1).exsubs.bnum) === '1/1' );
	};
	
	this.testTacticSkillItemTooltip = function() {
		this.selectHero();
		
		var tip = TTIP.getTipById(this.items.tacticskilllist.getItem(0).exsubs.tooltips['$item']);
		tip.getTip();
		assertNoInclude(tip.getTipMsg(), 'undefined');
		assertInclude(tip.getTipMsg(), rstr.herodlg.lbl.learntacticskilltip );
		
		TestCaseCondition.setPreCond(this.hero, { heroskills:[{id:6001001,level:1}] })
		this.view.heroUpdate();
		tip.getTip();
		assertNoInclude(tip.getTipMsg(), 'undefined');
		assertInclude(tip.getTipMsg(), rstr.herodlg.lbl.weartacticskilltip );
	};
	
	this.testCurTacticSkillTooltip = function(){
		this.selectHero();
		TestCaseCondition.setPreCond(this.hero, { herocurtacticskill:0 })
		var tip = TTIP.getTipById(this.items.tooltips['$curtskill']);
		tip.getTip();
		assert(tip.getTipMsg() === rstr.herodlg.tips.skill.noweartacticskill);
		
		TestCaseCondition.setPreCond(this.hero, { herocurtacticskill:6001002, heroskills:[{id:6001001,level:1}]  })
		tip.getTip();
		assert(tip.getTipMsg() === rstr.herodlg.tips.skill.noweartacticskill);
		
		TestCaseCondition.setPreCond(this.hero, { herocurtacticskill:6001001, heroskills:[{id:6001001,level:1}]  })
		tip.getTip();
		assertNoInclude(tip.getTipMsg(), 'undefined');
	};
	
	this.testSpecSkillItemShow = function() {
		this.selectHero();
		TestCaseCondition.setPreCond(this.hero, {heroprof:1})
		assertNoInclude(IMG.getBKImage(this.items.specskilllist.getItem(0).exsubs.icon), 'undefined' );
		assertInclude( IMG.getBKImage(this.items.specskilllist.getItem(0).exsubs.icon), 'item/small/' );
		assert( TQ.getTextEx(this.items.specskilllist.getItem(0).exsubs.num) === '0/1' );
		
		assertNoInclude(IMG.getBKImage(this.items.specskilllist.getItem(1).exsubs.icon), 'undefined' );
		assertInclude( IMG.getBKImage(this.items.specskilllist.getItem(1).exsubs.icon), 'item/small/' );
		assert( TQ.getTextEx(this.items.specskilllist.getItem(1).exsubs.num) === '0/1' );
		assert( TQ.getTextEx(this.items.specskilllist.getItem(1).exsubs.bnum) === '0/1' );
		
		TestCaseCondition.setPreCond(this.hero, {heroprof:1, heroskills:[{id:6001003,level:1},{id:6001004,level:1}] })
		this.view.heroUpdate();
		assert( TQ.getTextEx(this.items.specskilllist.getItem(0).exsubs.num) === '1/1' );
		assert( TQ.getTextEx(this.items.specskilllist.getItem(0).exsubs.bnum) === '1/1' );
		assert( TQ.getTextEx(this.items.specskilllist.getItem(1).exsubs.num) === '1/1' );
		assert( TQ.getTextEx(this.items.specskilllist.getItem(1).exsubs.bnum) === '1/1' );
		assert( TQ.getTextEx(this.items.specskilllist.getItem(2).exsubs.num) === '0/1' );
		assert( TQ.getTextEx(this.items.specskilllist.getItem(2).exsubs.bnum) === '0/1' );
		assert( TQ.getTextEx(this.items.specskilllist.getItem(3).exsubs.num) === '0/1' );
		assert( TQ.getTextEx(this.items.specskilllist.getItem(3).exsubs.bnum) === '0/1' );
		assert( TQ.getTextEx(this.items.specskilllist.getItem(4).exsubs.num) === '0/1' );
		assert( TQ.getTextEx(this.items.specskilllist.getItem(4).exsubs.bnum) === '0/1' );
		
		TestCaseCondition.setPreCond(this.hero, {heroprof:2, heroskills:[{id:6001003,level:0},{id:6001004,level:0}] })
		this.view.heroUpdate();
		assert( TQ.getTextEx(this.items.specskilllist.getItem(0).exsubs.num) === '1/1' );
		assert( TQ.getTextEx(this.items.specskilllist.getItem(0).exsubs.bnum) === '1/1' );
	};
	
	this.test_specSkillLabelShow = function() {
		this.selectHero();
		TestCaseCondition.setPreCond(this.hero, {heroprof:1, heroskills:[{id:6001003,level:1},{id:6001004,level:1}] })
		this.view.heroUpdate();
		assertEQ ( TQ.getCSS(this.items.zhuanjingskillLbl, 'display'), 'block' );
		
		TestCaseCondition.setPreCond(this.hero, {heroprof:2, heroskills:[{id:6001003,level:1},{id:6001004,level:1}] })
		this.view.heroUpdate();
		assertEQ ( TQ.getCSS(this.items.zhuanjingskillLbl, 'display'), 'none' );
	};
	
	this.testSpecSkillItemTooltip = function() {
		this.selectHero();
		TestCaseCondition.setPreCond(this.hero, {heroprof:1})
		var tip = TTIP.getTipById(this.items.specskilllist.getItem(0).exsubs.tooltips['$item']);
		tip.getTip();
		assertNoInclude(tip.getTipMsg(), 'undefined');
		assertInclude(tip.getTipMsg(), rstr.herodlg.lbl.learnspecskilltip );
		
		TestCaseCondition.setPreCond(this.hero, {heroprof:1,  heroskills:[{id:6001003,level:1}] })
		this.view.heroUpdate();
		tip.getTip();
		assertNoInclude(tip.getTipMsg(), 'undefined');
		assertNoInclude(tip.getTipMsg(), rstr.herodlg.lbl.learnspecskilltip );
	};
});

TestCaseHeroSkillOP = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.view = HeroDlgView.snew(g_app);
		this.model = HeroDlgModel.snew(g_app);
		this.presenter = HeroDlgPresenter.snew(g_app, this.view, this.model);
		this.regDlg();
		this.selectHero();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.regDlg = function() {
		UIM.regDlg('uselistitem', UseListItemDlg.snew(g_app));
		UIM.regDlg('filteritem', FilterItemDlg.snew(g_app));
		UIM.regDlg('buyitem', MockDialog.snew(g_app));
		UIM.regDlg('inputnum', new InputNumDlg(g_app));
	};
	
	this.selectHero = function(){
		TestCaseHeroDlgHelper.selectDetailHero(this);
		this.items = this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_SKILL_IDX);
		this.hero = g_app.getImgr().getHeroByIdx(0);
		this.hero.level = res_hero_hasskill_minlevel;
	};
	
	this.setPreCond = function(p) {
		g_app.getGUI().getSysMsgTip().clear();
		g_app.getImgr().clearPkgItems();
		g_app.getImgr().setMoney(0);
		
		if ( p.herolevel ) {
			this.hero.level = p.herolevel;
		}
		if ( p.item ) {
			g_app.getImgr().addItem({id:1,resid:p.item.id, number:p.item.num, itemres:ItemResUtil.findItemres(p.item.id) });
		}
		if ( p.heroskills ) {
			this.hero.skills = p.heroskills;
		}
		if ( p.skillsteel ) {
			this.hero.skillsteel = p.skillsteel;
		}
		if ( p.canusesstime != undefined ) {
			g_app.getImgr().setCanUseSkillSteelTime(p.canusesstime);
		}
		
		this.view.heroUpdate();
	};
	
	this.getLearnSkillNeedItem = function(effectid, skillid) {
		var effectItems = ItemResUtil.findEffectItems(effectid);
		for ( k in effectItems.items ) {
			var itemid = effectItems.items[k];
			var itemres = ItemResUtil.findItemres(itemid);
			for ( ek in itemres.effects ) {
				var effect = itemres.effects[ek];
				if ( effect.id != effectid )  continue;
				if ( effect.val == skillid ) return itemid;
			}
		}
		return 0;	
	};
	
	this.getLearnTacticSkillNeedItem = function(skillid) {
		return this.getLearnSkillNeedItem(RES_EFF.LEARN_HERO_TSKILL, skillid);
	};	
	
	this.getLearnSpecSkillNeedItem = function(skillid) {
		return this.getLearnSkillNeedItem(RES_EFF.LEARN_HERO_SSKILL, skillid);
	};	
	
	this.testClickInsightBtn_NoHasEmptyGrid = function() {
		this.setPreCond({herolevel:res_hero_hasskill_minlevel, heroskills:[{id:6001008,level:12,dex:1},{id:6001009,level:20}], item:{id:FIXID.LINGWUDAN,num:10000}});
		this.items.insight.click();
		assert( TestCaseSysTip.getSystip() == rstr.herodlg.err.insight.noemptygrid);
	};
	
	this.testClickInsightBtn_NoEnoughItem = function() {
		this.setPreCond({herolevel:res_hero_hasskill_minlevel, heroskills:[{id:6001008,level:12,dex:1}], item:{id:FIXID.LINGWUDAN,num:0}});
		this.items.insight.click();
		assert( g_app.getGUI().isShowMsgBox() == true );
		assertInclude( g_app.getGUI().getMsgBoxMsg(), FIXID.LINGWUDAN );
	};
	
	this.testClickInsightBtn_OK = function() {
		this.setPreCond({herolevel:res_hero_hasskill_minlevel, heroskills:[{id:6001001,level:1},{id:6001008,level:12,dex:1}], item:{id:FIXID.LINGWUDAN,num:10000}});
		this.items.insight.click();
		assert( g_app.getGUI().isShowMsgBox() == true );
		g_app.getGUI().msgBoxClick(MB_IDYES);
		assertNoInclude( g_app.getSendMsg(), 'undefined' );
	};
	
	this.testClickLearnBaseSkillBtn_HasSkillSteeling = function() {
		TestCaseCondition.setPreCond(this.hero, {skillsteel:{id:6001008,stoptime:10}});
		this.items.learn.click();
		assert( TestCaseSysTip.getSystip() == rstr.herodlg.err.learn.skillsteeling);
	};
	
	this.testClickLearnBaseSkillBtn_ExistSkill = function() {
		this.setPreCond({herolevel:res_hero_hasskill_minlevel, heroskills:[{id:6001008,level:1}], item:{id:4000008,num:1} });
		this.items.learn.click();
		assert( UIM.getDlg('uselistitem').isShow() == true );
		UIM.getDlg('uselistitem').clickItem(0);
		assert( TestCaseSysTip.getSystip() == rstr.herodlg.err.learn.existskill);
	};
	
	this.testClickLearnBaseSkillBtn_OK= function() {
		this.setPreCond({herolevel:res_hero_hasskill_minlevel, heroskills:[{id:6001001,level:1}], item:{id:4000008,num:1} });
		this.items.learn.click();
		assert( UIM.getDlg('uselistitem').isShow() == true );
		UIM.getDlg('uselistitem').clickItem(0);
		assertNoInclude( g_app.getSendMsg(), 'undefined' );
	};
	
	this.testClickBaseListItem = function() {
		this.setPreCond({herolevel:res_hero_hasskill_minlevel, heroskills:[{id:6001001,level:1},{id:6001008,level:1}] });
		this.items.baseskilllist.clickItem({pageX:0,pageY:0}, 1);
		assert ( this.items.steelmenu.isShow() == false );
		
		this.items.baseskilllist.clickItem({pageX:0,pageY:0}, 0);
		assert ( this.items.steelmenu.isShow() == true );
		
		this.items.steelmenu.click(0);
		assert ( this.items.steelmenu.isShow() == false );
	};
	
	this.testClickBaseListItem_clickFullLevelSkill = function() {
		this.setPreCond({canusesstime:10,skillsteel:{id:0,stoptime:0},herolevel:res_hero_hasskill_minlevel, heroskills:[{id:6001001,level:1},{id:6001008,level:10}] });
		this.items.baseskilllist.clickItem({pageX:0,pageY:0}, 0);
		assert ( this.items.steelmenu.isShow() == false );
	};
	
	this.testSelectSteelSkillMenu_IsSteelingState = function() {
		this.setPreCond({canusesstime:10,skillsteel:{id:6001008,stoptime:10},herolevel:res_hero_hasskill_minlevel, heroskills:[{id:6001001,level:1},{id:6001008,level:1}] });
		this.items.baseskilllist.clickItem({pageX:0,pageY:0}, 0);
		this.items.steelmenu.click(0);
		assert( TestCaseSysTip.getSystip() == rstr.herodlg.err.ssteel.issteeling);
	};
	
	this.testSelectSteelSkillMenu_HasNoCanUseSteelTime = function() {
		this.setPreCond({canusesstime:0,skillsteel:{id:0,stoptime:0},herolevel:res_hero_hasskill_minlevel, heroskills:[{id:6001001,level:1},{id:6001008,level:1}] });
		this.items.baseskilllist.clickItem({pageX:0,pageY:0}, 0);
		this.items.steelmenu.click(0);
		assert( TestCaseSysTip.getSystip() == rstr.herodlg.err.ssteel.nosstime);
	};
	
	this.testSelectSteelSkillMenu_OK = function() {
		this.setPreCond({canusesstime:1000000,skillsteel:{id:0,stoptime:0},herolevel:res_hero_hasskill_minlevel, heroskills:[{id:6001001,level:1},{id:6001008,level:1}] });
		this.items.baseskilllist.clickItem({pageX:0,pageY:0}, 0);
		this.items.steelmenu.click(0);
		assert ( UIM.getDlg('inputnum').isShow() == true );
		UIM.getDlg('inputnum').click();
		assertNoInclude( g_app.getSendMsg(), 'undefined' );
		assertInclude( g_app.getSendMsg(), ''+res_canuse_sstime_maxnum );
	};
	
	this.testClickSpeedSkillSteelBtn = function() {
		TestCaseCondition.setPreCond(this.hero, { skillsteel:{id:6001005,stoptime:30} });
		this.view.heroUpdate();
		this.items.speedsteel.click();
		assert( UIM.getDlg('uselistitem').isShow() == true );
	};
	
	this.testClickAddtimeBtn = function() {
		this.items.addtime.click();
		assert( UIM.getDlg('uselistitem').isShow() == true );
	};
	
	this.testClickTacticListItem_WearTacticSkill = function() {
		TestCaseCondition.setPreCond(this.hero, { herolevel:res_hero_hasskill_minlevel, heroskills:[{id:6001001,level:1}] })
		this.items.tacticskilllist.clickItem({pageX:0,pageY:0}, 0);
		assert ( this.items.weartskillmenu.isShow() == true );
		
		this.items.weartskillmenu.click(0);
		assert ( this.items.weartskillmenu.isShow() == false );
		assertNoInclude( g_app.getSendMsg(), 'undefined' );
	};
	
	this.testClickTacticListItem_LearnTacticSkill_NoItem = function() {
		TestCaseCondition.setPreCond(this.hero, { herolevel:res_hero_hasskill_minlevel, heroskills:[{id:6001001,level:0}] })
		this.items.tacticskilllist.clickItem({pageX:0,pageY:0}, 0);
		assert ( this.items.learntskillmenu.isShow() == true );
		
		this.items.learntskillmenu.click(0);
		assert ( this.items.learntskillmenu.isShow() == false );
		assert( g_app.getGUI().isShowMsgBox() == true );
		assertInclude( g_app.getGUI().getMsgBoxMsg(), this.getLearnTacticSkillNeedItem(6001001) );
		assert( g_app.getSendMsg() === '' );
	};	
	
	this.testClickTacticListItem_LearnTacticSkill_OK = function() {
		TestCaseCondition.setPreCond(this.hero, { item:{id:this.getLearnTacticSkillNeedItem(6001001),num:1}, herolevel:res_hero_hasskill_minlevel, heroskills:[{id:6001001,level:0}] })
		this.items.tacticskilllist.clickItem({pageX:0,pageY:0}, 0);
		assert ( this.items.learntskillmenu.isShow() == true );
		
		this.items.learntskillmenu.click(0);
		assert ( this.items.learntskillmenu.isShow() == false );
		assertNoInclude( g_app.getSendMsg(), 'undefined' );
	};	
	
	this.testClickSpecListItem_LearnSpecSkill_NoMenu = function() {
		TestCaseCondition.setPreCond(this.hero, { herolevel:res_hero_hasskill_minlevel, heroskills:[{id:6001003,level:1}] })
		this.items.specskilllist.clickItem({pageX:0,pageY:0}, 0);
		assert ( this.items.learnsskillmenu.isShow() == false );
	};	
	
	this.testClickSpecListItem_LearnSpecSkill_NoItem = function() {
		TestCaseCondition.setPreCond(this.hero, { herolevel:res_hero_hasskill_minlevel })
		this.items.specskilllist.clickItem({pageX:0,pageY:0}, 0);
		assert ( this.items.learnsskillmenu.isShow() == true );
		
		this.items.learnsskillmenu.click(0);
		assert ( this.items.learnsskillmenu.isShow() == false );
		assert( g_app.getGUI().isShowMsgBox() == true );
		assertInclude( g_app.getGUI().getMsgBoxMsg(), this.getLearnSpecSkillNeedItem(6001003) );
		assert( g_app.getSendMsg() === '' );
	};	
	
	this.testClickSpecListItem_LearnSpecSkill_OK = function() {
		TestCaseCondition.setPreCond(this.hero, { item:{id:this.getLearnSpecSkillNeedItem(6001003),num:1}, herolevel:res_hero_hasskill_minlevel })
		this.items.specskilllist.clickItem({pageX:0,pageY:0}, 0);
		assert ( this.items.learnsskillmenu.isShow() == true );
		
		this.items.learnsskillmenu.click(0);
		assert ( this.items.learnsskillmenu.isShow() == false );
		assertNoInclude( g_app.getSendMsg(), 'undefined' );
	};
	
	this.testClickCurTacticSkill_NoMenu = function() {
		TestCaseCondition.setPreCond(this.hero, {herocurtacticskill:0})
		this.items.curtacticskill.fireEvent('click', {pageX:0,pageY:0});
		assert ( this.items.unweartskillmenu.isShow() == false );
	};
	
	this.testClickCurTacticSkill_UnWearOK = function() {
		TestCaseCondition.setPreCond(this.hero, {herocurtacticskill:6001001})
		this.items.curtacticskill.fireEvent('click', {pageX:0,pageY:0});
		assert ( this.items.unweartskillmenu.isShow() == true );
		
		this.items.unweartskillmenu.click(0);
		assert ( this.items.unweartskillmenu.isShow() == false );
		assertNoInclude( g_app.getSendMsg(), 'undefined' );
	};
});

	
TestCaseHeroArmTabView = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		this.view = HeroDlgView.snew(g_app);
		this.model = HeroDlgModel.snew(g_app);
		this.presenter = HeroDlgPresenter.snew(g_app, this.view, this.model);
		this.view.openDlg();
		
		this.armView = HeroArmTabView.snew(this.g, this.view);
		this.armView.setModel(this.model);
		this.armView.setPresenter(this.presenter);
		var items =this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_ARM_IDX);
		this.armView.lc().m_items = items;
		
		res_items = [{id:1,bigpic:2},{id:2,bigpic:3},{id:3,bigpic:4}];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assert ( this.armView.lc().m_this == this.armView )
		assert ( this.armView.lc().m_g == this.g )
		assert ( this.armView.lc().m_parent == this.view )
	};
	
	this.test_setPresenter = function(){
		this.armView.setPresenter(this.presenter);
		assert ( this.armView.lc().m_presenter == this.presenter );
	};
	
	this.test_setModel = function(){
		this.armView.setModel(this.model);
		assert ( this.armView.lc().m_model == this.model );
	};
	
	this.test_initDlg = function(){
		var mm = MMock.snew();
		mm.mock(this.armView.lc(), '_initWearListPos');
		mm.mock(this.armView.lc(), '_initArmsTab');
		
		var g_items = {};
		this.armView.initDlg(g_items);
		mm.restore();
		
		assert ( this.armView.lc().m_items = g_items );
		assert ( mm.walkLog == '_initWearListPos,_initArmsTab' );
	};
	
	this.test_initWearListPos = function(){
		this.armView.lc()._initWearListPos();
		assert ( this.armView.lc().m_items.wearList.getCount() == 7 );
		
		var item0 = this.armView.lc().m_items.wearList.getItem(0).item;
		assert ( TQ.getCSS(item0, 'float') == 'none' );
		assert ( TQ.getCSS(item0, 'position') == 'absolute' );
		assert ( TQ.getCSS(item0, 'left') == this.armView.lc().m_wearListPos[0].x + 'px' );
		assert ( TQ.getCSS(item0, 'top') == this.armView.lc().m_wearListPos[0].y + 'px' );
	
		var item6 = this.armView.lc().m_items.wearList.getItem(6).item;
		assert ( TQ.getCSS(item6, 'float') == 'none' );
		assert ( TQ.getCSS(item6, 'position') == 'absolute' );
		assert ( TQ.getCSS(item6, 'left') == this.armView.lc().m_wearListPos[6].x + 'px' );
		assert ( TQ.getCSS(item6, 'top') == this.armView.lc().m_wearListPos[6].y + 'px' );
	};
	
	this.test_initArmsTab = function(){
		var mm = MMock.snew();
		mm.mock(this.armView.lc(), '_setArmsTabText');
		mm.mock(this.armView.lc().m_items.armsTab, 'activeTab');
		
		this.armView.lc()._initArmsTab();
		mm.restore();
		assertEQ ( mm.walkLog, '_setArmsTabText,activeTab' );
		assertListEQ ( mm.params['activeTab'], [1] );
	};
	
	this.test_setArmsTabText = function(){
		this.armView.lc()._setArmsTabText();
		assert ( this.armView.lc().m_items.armsTab.getTabCount() == 8 );
		assert ( this.armView.lc().m_items.armsTab.getTabText(0) == rstr.herodlg.armTabs[0] );
		assert ( this.armView.lc().m_items.armsTab.getTabText(7) == rstr.herodlg.armTabs[7] );
	};
	
	this.test_update = function(){
		var g_isShowRt = [false];
		var mm = MMock.snew();
		mm.mock(this.armView.lc().m_parent, 'isShow', g_isShowRt);
		mm.mock(this.armView.lc(), '_updateWearList');
		mm.mock(this.armView.lc(), '_updateCurArmList');
		
		this.armView.update();
		assert ( mm.walkLog == 'isShow' );
		
		mm.clear();
		g_isShowRt[0] = true;
		this.armView.update();
		assert ( mm.walkLog == 'isShow,_updateWearList,_updateCurArmList' );
		
		mm.restore();
	};
	
	this.test_updateArmList = function(){
		var g_isShowRt = [false];
		var mm = MMock.snew();
		mm.mock(this.armView.lc().m_parent, 'isShow', g_isShowRt);
		mm.mock(this.armView.lc(), '_updateCurArmList');
		
		this.armView.updateArmList();
		assert ( mm.walkLog == 'isShow' );
		
		mm.clear();
		g_isShowRt[0] = true;
		this.armView.updateArmList();
		assert ( mm.walkLog == 'isShow,_updateCurArmList' );
		
		mm.restore();
	};
	
	this.test_updateWearList = function(){
		var g_getCurHeroRt = [null];
		this.mm.mock(this.model, 'getCurHero', g_getCurHeroRt);
		this.mm.mock( this.armView.lc(), '_clearWearList');
		this.mm.mock( this.armView.lc(), '_setWearList');
		
		this.armView.lc()._updateWearList();
		assert ( this.mm.walkLog == 'getCurHero,_clearWearList' );
		
		this.mm.clear()
		g_getCurHeroRt[0] = {id:10000};
		this.armView.lc()._updateWearList();
		assert ( this.mm.walkLog == 'getCurHero,_clearWearList' );
		
		this.mm.clear()
		var g_hero = {id:10000,wears:{'1':{id:12,resid:1}}};
		g_getCurHeroRt[0] = g_hero;
		this.armView.lc()._updateWearList(g_hero);
		assert ( this.mm.walkLog == 'getCurHero,_setWearList' );
		assertListEQ ( this.mm.params['_setWearList'],  [g_hero] );
	};
	
	this.test_clearWearList = function(){
		var wearList = this.armView.lc().m_items.wearList;
		var hero = {id:10000,wears:{'1':{id:12,resid:1},'3':{id:13,resid:2},'7':{id:14,resid:3}}};
		this.armView.lc()._setWearList(hero);
		this.armView.lc()._clearWearList();
		
		assert ( IMG.getBKImage(wearList.getItem(0).exsubs.icon) == "url('')" );
		assert ( IMG.getBKImage(wearList.getItem(1).exsubs.icon) == "url('')" );
		assert ( IMG.getBKImage(wearList.getItem(2).exsubs.icon) == "url('')" );
		assert ( IMG.getBKImage(wearList.getItem(3).exsubs.icon) == "url('')" );
		assert ( IMG.getBKImage(wearList.getItem(4).exsubs.icon) == "url('')" );
		assert ( IMG.getBKImage(wearList.getItem(5).exsubs.icon) == "url('')" );
		assert ( IMG.getBKImage(wearList.getItem(6).exsubs.icon) == "url('')" );
		assert ( TQ.getClass(wearList.getItem(0).exsubs.icon) == "" );
	};
	
	this.test_setWearList = function(){
		var wearList = this.armView.lc().m_items.wearList;
		var hero = {id:10000,wears:{'1':{id:12,resid:1},'3':{id:13,resid:2},'7':{id:14,resid:3}}};
		this.armView.lc()._setWearList(hero);
		
		assert ( isInclude( IMG.getBKImage(wearList.getItem(0).exsubs.icon) , '2.gif' ) == true );
		assert ( IMG.getBKImage(wearList.getItem(1).exsubs.icon) == "url('')" );
		assert ( isInclude( IMG.getBKImage(wearList.getItem(2).exsubs.icon) , '3.gif' ) == true );
		assert ( IMG.getBKImage(wearList.getItem(3).exsubs.icon) == "url('')" );
		assert ( IMG.getBKImage(wearList.getItem(4).exsubs.icon) == "url('')" );
		assert ( IMG.getBKImage(wearList.getItem(5).exsubs.icon) == "url('')" );
		assert ( isInclude( IMG.getBKImage(wearList.getItem(6).exsubs.icon) , '4.gif' ) == true );
		
		var hero = {id:10000,wears:{}};
		this.armView.lc()._setWearList(hero);
		assert ( IMG.getBKImage(wearList.getItem(0).exsubs.icon) == "url('')" );
		assert ( TQ.getClass(wearList.getItem(0).exsubs.icon) == "" );
	};
	
	this.test_updateCurArmList = function(){
		var curTabIdx = 2;
		var curArmPos = curTabIdx;
		this.g.getImgr().getPkgs().items = [{id:1,itemres:{id:2500001,apos:2,bigpic:1001}},{id:2,itemres:{id:2500002,apos:3,bigpic:1002}}];
		this.armView.lc().m_items.armsTab.activeTab(curTabIdx);
		var curArmList = this.armView.lc().m_items.armsTab.getTabItems(curTabIdx).armList;
		this.mm.mock( this.presenter.getArmPresenter(), 'setArmListTipCaller' );
		
		assert ( this.armView.lc().m_isArmPosItemsChanged[curArmPos] == true );
		this.armView.lc()._updateCurArmList();
		assert ( curArmList.getCount() == 1 );
		assert ( isInclude(IMG.getBKImage(curArmList.getItem(0).exsubs.icon), '1001.gif') == true );
		assert ( this.armView.lc().m_isArmPosItemsChanged[curArmPos] == false );
		assert ( this.model.getArmsByArmPos(curArmPos).length == 1 );
		assert ( this.model.getArmsByArmPos(curArmPos)[0].id == 1 );
		assert ( this.mm.walkLog == 'setArmListTipCaller' );
		
		curArmList.setItemCount(0);
		this.model.setArmPosArms(curArmPos, [])
		this.armView.lc()._updateCurArmList();
		assert ( curArmList.getCount() == 0 );
		assert ( this.armView.lc().m_isArmPosItemsChanged[curArmPos] == false );
		assert ( this.model.getArmsByArmPos(curArmPos).length == 0 );
	};
});

TestCaseHeroArmTabPresenter = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		this.view = HeroDlgView.snew(this.g);
		this.model = HeroDlgModel.snew(this.g);
		this.presenter = HeroDlgPresenter.snew(this.g, this.view, this.model);
		this.view.openDlg();
		
		this.armPresenter = HeroArmTabPresenter.snew(this.g, this.presenter, this.view, this.model);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_setCaller = function(){
		this.mm.mock(this.armPresenter.lc(), '_setItems');
		this.mm.mock(this.armPresenter.lc(), '_regItemChangeEvent');
		this.mm.mock(this.armPresenter.lc(), '_setWearListCaller');
		this.mm.mock(this.armPresenter.lc(), '_setArmsTabCaller');
		this.mm.mock(this.armPresenter.lc(), '_setArmListCaller');
		this.mm.mock(this.armPresenter.lc(), '_setWearListTipCaller');
		this.mm.mock(this.armPresenter.lc(), '_setArmListTipCaller');
		
		this.armPresenter.setCaller();
		
		assert ( this.mm.walkLog == '_setItems,_regItemChangeEvent,_setWearListCaller,_setArmsTabCaller,_setArmListCaller,_setWearListTipCaller,_setArmListTipCaller' );
	};
	
	this.test_setArmListTipCaller = function(){
		this.mm.mock(this.armPresenter.lc(), '_setArmListTipCaller');
		this.armPresenter.setArmListTipCaller();
		assert ( this.mm.walkLog == '_setArmListTipCaller' );
	};
	
	this.test_setItems = function(){
		this.armPresenter.lc()._setItems();
		assert ( this.armPresenter.lc().m_items == this.view.getCtrl('tablist').getTabItems(HERODLG_TAB_ARM_IDX) );
	};
	
	this.test_regItemChangeEvent = function(){
		this.mm.mock(this.g, 'regEvent');
		this.armPresenter.lc()._regItemChangeEvent();
		assert ( this.mm.walkLog == 'regEvent' );
		assertListEQ ( this.mm.params['regEvent'], [EVT.PKG_CHANGE, 0, this.armPresenter, this.armPresenter.lc()._onItemChanged] );
	};
	
	this.test_setWearListCaller = function(){
		this.armPresenter.lc()._setItems();
		
		this.mm.mock( this.armPresenter.lc().m_items.wearList, 'setCaller' );
		
		this.armPresenter.lc()._setWearListCaller();
		
		assert ( this.mm.params['setCaller'][0].self == this.armPresenter );
		assert ( this.mm.params['setCaller'][0].caller == this.armPresenter.lc()._onClickWearList );
	};
	
	this.test_setArmsTabCaller = function(){
		this.armPresenter.lc()._setItems();
		
		this.mm.mock( this.armPresenter.lc().m_items.armsTab, 'setCaller' );
		
		this.armPresenter.lc()._setArmsTabCaller();
		this.mm.restore();
		
		assert ( this.mm.params['setCaller'][0].self == this.armPresenter );
		assert ( this.mm.params['setCaller'][0].caller == this.armPresenter.lc()._onClickArmsTab );
	};
	
	this.test_setArmListCaller = function(){
		this.armPresenter.lc()._setItems();
		
		for ( var i=0; i<this.armPresenter.lc().m_items.armsTab.getTabCount(); ++i ) {
			this.mm.mock( this.armPresenter.lc().m_items.armsTab.getTabItems(i).armList, 'setCaller' );
		}
		
		this.armPresenter.lc()._setArmListCaller();

		assert ( this.mm.params['setCaller'][0].self == this.armPresenter );
		assert ( this.mm.params['setCaller'][0].caller == this.armPresenter.lc()._onClickArmList );
	};
	
	this.test_setWearListTipCaller = function(){
		this.armPresenter.lc()._setItems();
		this.mm.mock( TTIP, 'setCallerData' );
		this.armPresenter.lc()._setWearListTipCaller();
		assert ( this.mm.params['setCallerData'][0] == this.armPresenter.lc().m_items.wearList.getItem(6).exsubs.tooltips['$item'] );
		assert ( this.mm.params['setCallerData'][1].self == this.armPresenter );
		assert ( this.mm.params['setCallerData'][1].caller == this.armPresenter.lc()._onGetWearArmTip );
		assert ( this.mm.params['setCallerData'][2].idx == 6 );
		assert ( this.mm.walkLog == 'setCallerData,setCallerData,setCallerData,setCallerData,setCallerData,setCallerData,setCallerData' );
	};
	
	this.test_setArmListTipCaller = function(){
		this.armPresenter.lc()._setItems();
		
		this.view.getArmView().setItemChanged();
		this.g.getImgr().getPkgs().items = [{id:1,itemres:{id:2500001,apos:1,bigpic:1001}},{id:2,itemres:{id:2500002,apos:2,bigpic:1002}}];
		this.armPresenter.lc().m_items.armsTab.activeTab(0);
		this.armPresenter.lc().m_items.armsTab.activeTab(1);
		this.armPresenter.lc().m_items.armsTab.activeTab(2);
		
		this.mm.mock( TTIP, 'setCallerData' );
		this.armPresenter.lc()._setArmListTipCaller();
		
		var item = this.armPresenter.lc().m_items.armsTab.getTabItems(2).armList.getItem(0);
		
		assert ( this.mm.walkLog == 'setCallerData,setCallerData,setCallerData,setCallerData' );
		assert ( this.mm.params['setCallerData'][0] == item.exsubs.tooltips['$item'] );
		assert ( this.mm.params['setCallerData'][1].self == this.armPresenter );
		assert ( this.mm.params['setCallerData'][1].caller == this.armPresenter.lc()._onGetArmTip );
		assert ( this.mm.params['setCallerData'][2].idx == 0 );
	};
	
	this.test_onItemChanged = function(){
		this.armPresenter.lc()._setItems();
		
		this.mm.mock(this.view.getArmView(), 'setItemChanged' );
		this.armPresenter.lc()._onItemChanged();
		assert ( this.mm.walkLog == 'setItemChanged' );
	};
	
	this.test_onClickWearList = function(){
		this.armPresenter.lc()._setItems();
		
		var g_getCurHeroRt = [null];
		
		this.mm.mock(this.model, 'getCurHero', g_getCurHeroRt);
		this.mm.mock(this.armPresenter.lc().m_items.armsTab, 'activeTab');
		this.mm.mock(HeroSender, 'sendUnWearArm');
		
		this.mm.clear();
		this.armPresenter.lc().m_items.wearList.clickItem(null, 0); // armPos = 0 + 1 = 1
		assert ( this.mm.walkLog == 'getCurHero' );
		
		this.mm.clear();
		g_getCurHeroRt[0] = {id:10000,wears:{'2':{id:12,resid:1}}};
		this.armPresenter.lc().m_items.wearList.clickItem(null, 0); // armPos = 0 + 1 = 1
		assert ( this.mm.walkLog == 'getCurHero,activeTab' );
		assertListEQ ( this.mm.params['activeTab'], [0+1] );
		
		this.mm.clear();
		this.armPresenter.lc().m_items.wearList.clickItem(null, 1); // armPos = 1 + 1 = 2
		assert ( this.mm.walkLog == 'getCurHero,activeTab,sendUnWearArm' );
		assertListEQ ( this.mm.params['sendUnWearArm'], [this.g, 10000, 1+1] );
	};
	
	this.test_onClickArmsTab = function(){
		this.armPresenter.lc()._setItems();
		
		this.mm.mock(this.view.getArmView(), 'updateArmList');
		
		this.armPresenter.lc().m_items.armsTab.activeTab(0);
	
		assert ( this.mm.walkLog == 'updateArmList' );
	};
	
	this.test_onClickArmList = function(){
		this.armPresenter.lc()._setItems();
		
		var armPos = 1;
		
		this.armPresenter.lc().m_items.armsTab.activeTab(armPos);
		this.model.setArmPosArms(armPos, [{id:10}]);
		
		var armList = this.armPresenter.lc().m_items.armsTab.getTabItems(armPos).armList;
		armList.setItemCount(1);
		
		var g_getCurHeroRt = [null];
		this.mm.mock(this.model, 'getCurHero', g_getCurHeroRt);
		this.mm.mock(HeroSender, 'sendWearArm');
		
		this.mm.clear();
		armList.clickItem(null, 0);
		assert ( this.mm.walkLog == 'getCurHero' );
		
		this.mm.clear();
		g_getCurHeroRt[0] = {id:10000};
		armList.clickItem(null, -1);
		assert ( this.mm.walkLog == 'getCurHero' );
		
		this.mm.clear();
		armList.clickItem(null, 0);
		assert ( this.mm.walkLog == 'getCurHero,sendWearArm' );
		assertListEQ ( this.mm.params['sendWearArm'], [this.g, 10000, 10] );
	};
	
	this.test_onGetWearArmTip = function(){
		this.mm.mock( this.armPresenter.lc(), '_getWearArmTip', ['tip']);
		
		assert ( this.armPresenter.lc()._onGetWearArmTip({idx:0}) == 'tip' );
		assertListEQ ( this.mm.params['_getWearArmTip'], [1] );
	};

	this.test_onGetArmTip = function(){
		var g_arm = {itemres:{apos:1}};
		var g_getCurArmRt = [null];
		var g_getWearArmTipRt = [''];
		
		this.mm.mock( this.armPresenter.lc(), '_getCurArm', g_getCurArmRt);
		this.mm.mock( TIPM, 'getItemDesc', ['armTip']);
		this.mm.mock( this.armPresenter.lc(), '_getWearArmTip', g_getWearArmTipRt);
		
		assert ( this.armPresenter.lc()._onGetArmTip({idx:0}) == '' );
		assert ( this.mm.walkLog == '_getCurArm' );
		assertListEQ ( this.mm.params['_getCurArm'], [0] );
		
		this.mm.clear();
		g_getCurArmRt[0] = g_arm;
		assert ( this.armPresenter.lc()._onGetArmTip({idx:0}) == 'armTip' );
		assert ( this.mm.walkLog == '_getCurArm,getItemDesc,_getWearArmTip' );
		assertListEQ ( this.mm.params['getItemDesc'], [g_arm] );
		assertListEQ ( this.mm.params['_getWearArmTip'], [1] );
		
		this.mm.clear();
		g_getWearArmTipRt[0] = 'wearTip';
		assert ( this.armPresenter.lc()._onGetArmTip({idx:0}) == 'wearTip<split>armTip' );
	};
	
	this.test_getWearArmTip = function(){
		var g_curHero = {};
		var g_getCurHeroRt = [null];
		this.mm.mock(this.model, 'getCurHero', g_getCurHeroRt);
		this.mm.mock(TIPM, 'getItemDesc', ['desc']);
		
		assert ( this.armPresenter.lc()._getWearArmTip(1) == '' );
		
		g_getCurHeroRt[0] = g_curHero;
		assert ( this.armPresenter.lc()._getWearArmTip(1) == '' );
		
		g_curHero.wears = {};
		assert ( this.armPresenter.lc()._getWearArmTip(1) == '' );
		
		g_curHero.wears[1] = {};
		assert ( this.armPresenter.lc()._getWearArmTip(2) == '' );
		
		this.mm.clear();
		assert ( this.armPresenter.lc()._getWearArmTip(1) == 'desc' );
		assert ( this.mm.walkLog == 'getCurHero,getItemDesc' );
		assertListEQ ( this.mm.params['getItemDesc'], [g_curHero.wears[1], null, true] );	
	};
	
	this.test_getCurArm = function(){
		this.armPresenter.lc()._setItems();
		
		var g_arms = [{}];
		this.mm.mock( this.armPresenter.lc().m_items.armsTab, 'getActiveTab', [1]);
		this.mm.mock( this.model, 'getArmsByArmPos', [g_arms]);
		
		this.armPresenter.lc()._getCurArm({idx:0});
		assert ( this.mm.walkLog == 'getActiveTab,getArmsByArmPos' );
		assertListEQ ( this.mm.params['getArmsByArmPos'], [1] );
	};
});

tqHeroDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseAddLevelByHeroFiveElemAttr, 'TestCaseAddLevelByHeroFiveElemAttr');
	suite.addTestCase(TestCaseHeroDlgModel, 'TestCaseHeroDlgModel');
	suite.addTestCase(TestCaseHeroDlgPresenter, 'TestCaseHeroDlgPresenter');
	suite.addTestCase(TestCaseHeroDlgView, 'TestCaseHeroDlgView');
	suite.addTestCase(TestCaseHeroSteelJingMai, 'TestCaseHeroSteelJingMai');
	suite.addTestCase(TestCaseHeroSkillUIlItems, 'TestCaseHeroSkillUIlItems');
	suite.addTestCase(TestCaseHeroSkillOP, 'TestCaseHeroSkillOP');
	
	suite.addTestCase(TestCaseHeroArmTabView, 'TestCaseHeroArmTabView');
	suite.addTestCase(TestCaseHeroArmTabPresenter, 'TestCaseHeroArmTabPresenter');
};