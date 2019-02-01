/*******************************************************************************/
requireEx('./handler/tqSteelListDlg.js', [
	{
		start:'//SteelListDlg-unittest-start'
		,end:'//SteelListDlg-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_items'
			,'m_dlg'
			,'_initParam'
			,'_regEvents'
			,'_initDlg'
			,'_createDlg'
			,'_setCallers'
			,'_openDlg'
			,'_initInfo'
			,'_updateHerosList'
			,'_isShow'
			,'_setHerosListItems'
			,'_updateSteelTimes'
			,'_updateSteelGetExps'
			,'_setHerosListCallers'
			,'_onClickStopSteel'
			,'_onStopCallback'
			,'_selectOrUnselectAllArms'
			,'_onClickListItem'
			,'_onClickSelectAll'
			,'_onClickUnselectAll'
			,'_onClickStopSteelAll'
			,'_onClickSteel'
			,'_onClickHighSteel'
			,'_onHeroUpdate'
			,'_getSelectCanSteelHeros'
			,'_isArriveMaxBuildLevel'
			,'_onUpdate'
			,'_onDlgEvent'
			,'_transferHeroList'
		]
	}
]);

TestCaseSteelListDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = SteelListDlg.snew(this.g);
		this.lc = this.dlg.lc;
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.STEEL_BUILD, level:1}] });
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock( this.lc(), '_initParam' );
		this.mm.mock( this.lc(), '_regEvents' );
		this.dlg.init(this.g);
		assertEQ ( this.mm.walkLog, '_initParam,_regEvents' );
		assertEQ ( this.mm.params['_initParam'], [this.dlg, this.g] );
	};
	
	this.test__regEvents = function(){
		this.mm.mock( this.g, 'regEvent' );
		this.lc()._regEvents();
		assertEQ ( this.mm.walkLog, 'regEvent,regEvent' );
		assertEQ ( this.mm.params['regEvent.0'], [EVT.HERO_UPDATE, 0, this.dlg, this.lc()._onHeroUpdate] );
	};
	
	this.test_showVipSteelBtn = function(){
		this.g.getImgr().getRoleRes().vip = 1;
		this.g.sendEvent({eid:EVT.ROLEBASE,sid:0});
		this.dlg.openDlg();
		assertEQ ( this.lc().m_items.vip1SteelBtn.isShow(), false );
		assertEQ ( this.lc().m_items.vip2SteelBtn.isShow(), false );
		
		this.g.getImgr().getRoleRes().vip = 7;
		this.g.sendEvent({eid:EVT.ROLEBASE,sid:0});
		assertEQ ( this.lc().m_items.vip1SteelBtn.isShow(), true );
		assertEQ ( this.lc().m_items.vip2SteelBtn.isShow(), false );
		
		this.g.getImgr().getRoleRes().vip = 10;
		this.g.sendEvent({eid:EVT.ROLEBASE,sid:0});
		assertEQ ( this.lc().m_items.vip1SteelBtn.isShow(), true );
		assertEQ ( this.lc().m_items.vip2SteelBtn.isShow(), true );
	};
	
	this.test_openDlg = function(){
		this.mm.mock( this.lc(), '_initDlg' );
		this.mm.mock( this.lc(), '_openDlg' );
		this.mm.mock( this.lc(), '_initInfo' );
		this.dlg.openDlg();
		assertEQ ( this.mm.walkLog, '_initDlg,_openDlg,_initInfo' );
	};
	
	this.test_openDlgWhenHasNoSteelBuild = function(){
		TestCaseSysTip.clearTip();
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.STEEL_BUILD, level:0}] });
		this.dlg.openDlg();
		assertEQ ( TestCaseSysTip.eqSystipStr ( rstr.steellistdlg.tip.hasNoBuild ), true);
	};
	
	this.test__initParam = function(){
		this.lc()._initParam(this.dlg, this.g);
		assertEQ ( this.lc().m_this, this.dlg);
		assertEQ ( this.lc().m_g, this.g);
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock( this.lc(), '_createDlg' );
		this.mm.mock( this.lc(), '_setCallers' );
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_setCallers' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__createDlg = function(){
		var r_dlg = MockDialog.snew(this.g);
		this.mm.mock(Dialog, 'snew', [r_dlg]);
		this.mm.mock(this.g.getGUI(), 'initDlg' );
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snew,initDlg' );
		assertEQ ( this.mm.params['snew'], [this.g,{modal:false, title:rstr.steellistdlg.title, pos:{x:'center', y:50}}] );
		assertEQ ( this.mm.params['initDlg'], [r_dlg, uicfg.hero.steellistdlg, this.lc().m_items] );
		assertEQ ( this.lc().m_dlg, r_dlg);
	};
	
	this.test__setCallers = function(){
		this.lc()._createDlg();
		var items = this.lc().m_items.tabList.getTabItems(0);
		this.mm.mock(items.list, 'setCaller' );
		this.mm.mock(items.selectAllBtn, 'setCaller' );
		this.mm.mock(items.unselectAllBtn, 'setCaller' );
		this.mm.mock(items.stopsteelAllBtn, 'setCaller' );
		this.mm.mock(items.steelBtn, 'setCaller' );
		this.mm.mock(items.highsteelBtn, 'setCaller' );
		this.mm.mock(this.lc().m_dlg, 'setCaller' );
		this.lc()._setCallers();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller,setCaller,setCaller,setCaller,setCaller,setCaller' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.dlg, caller:this.lc()._onClickListItem}] );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.dlg, caller:this.lc()._onClickSelectAll}] );
		assertEQ ( this.mm.params['setCaller.2'], [{self:this.dlg, caller:this.lc()._onClickUnselectAll}] );
		assertEQ ( this.mm.params['setCaller.3'], [{self:this.dlg, caller:this.lc()._onClickStopSteelAll}] );
		assertEQ ( this.mm.params['setCaller.4'], [{self:this.dlg, caller:this.lc()._onClickSteel}] );
		assertEQ ( this.mm.params['setCaller.5'], [{self:this.dlg, caller:this.lc()._onClickHighSteel}] );
		assertEQ ( this.mm.params['setCaller.6'], [{self:this.dlg, caller:this.lc()._onDlgEvent}] );
	};
	
	this.test__openDlg = function(){
		this.lc()._createDlg();
		this.mm.mock(this.lc().m_dlg, 'show');
		this.lc()._openDlg();
		assertEQ ( this.mm.walkLog, 'show' );
	};
	
	this.test__initInfo = function(){
		this.lc()._createDlg();
		
		this.mm.mock(this.lc().m_items.tabList, 'activeTab');
		this.mm.mock(this.lc(), '_updateHerosList');
		this.mm.mock(this.g, 'regUpdater');
		this.lc()._initInfo();
		assertEQ ( this.mm.walkLog, 'activeTab,_updateHerosList,regUpdater' );
		assertEQ ( this.mm.params['activeTab'], [0] );
		assertEQ ( this.mm.params['regUpdater'], [this.dlg, this.lc()._onUpdate, 1000] );
	};
	
	this.test__updateHerosList = function(){
		var r_isShow = [false];
		this.mm.mock(this.lc(), '_isShow', r_isShow );
		this.mm.mock(this.lc(), '_setHerosListItems');
		this.mm.mock(this.lc(), '_updateSteelTimes');
		this.mm.mock(this.lc(), '_updateSteelGetExps');
		this.mm.mock(this.lc(), '_setHerosListCallers');
		this.lc()._updateHerosList();
		assertEQ ( this.mm.walkLog, '_isShow' );
		
		this.mm.clear();
		r_isShow[0] = true;
		this.lc()._updateHerosList();
		assertEQ ( this.mm.walkLog, '_isShow,_setHerosListItems,_updateSteelTimes,_updateSteelGetExps,_setHerosListCallers' );
	};
	
	this.test__isShow = function(){
		assertEQ ( this.lc()._isShow(), false );
		this.lc()._createDlg();
		this.lc().m_dlg.show();
		assertEQ ( this.lc()._isShow(), true );
		this.lc().m_dlg.hide();
		assertEQ ( this.lc()._isShow(), false );
	};
	
	this.test__setHerosListItems = function(){
		this.g.setSvrTimeS(11);
		this.g.getImgr().getHeros().list = [
			{name:'hero1', level:1, state:HERO_STATE.STEEL, attrs:{'2':{val:50},'3':{val:100}}, steel:{type:0,startTime:1,steelQuarters:2,getexp:1000}}
			,{name:'hero2', level:2, state:HERO_STATE.FREE, attrs:{'2':{val:20},'3':{val:200}}, steel:{startTime:0,steelQuarters:0,getexp:0}}
			,{name:'hero3', level:3, state:HERO_STATE.STEEL, attrs:{'2':{val:20},'3':{val:200}}, steel:{type:1,startTime:0,steelQuarters:0,getexp:0}}
			,{name:'hero4', level:4, state:HERO_STATE.STEEL, attrs:{'2':{val:20},'3':{val:200}}, steel:{type:2,startTime:0,steelQuarters:0,getexp:0}}
			,{name:'hero5', level:5, state:HERO_STATE.STEEL, attrs:{'2':{val:20},'3':{val:200}}, steel:{type:3,startTime:0,steelQuarters:0,getexp:0}}
			];
		this.lc()._createDlg();
		this.lc()._setHerosListItems();
		var items = this.lc().m_items.tabList.getTabItems(0);
		assertEQ ( items.list.getCount(), 5 );
		assertEQ ( TQ.getTextEx(items.list.getItem(0).exsubs.name), 'hero1' );
		assertEQ ( TQ.getTextEx(items.list.getItem(0).exsubs.level), 1 );
		assertEQ ( TQ.getTextEx(items.list.getItem(0).exsubs.state), rstr.steellistdlg.lbl.commSteel  );
		assertEQ ( TQ.getTextEx(items.list.getItem(0).exsubs.exp), '50%' );
		assertEQ ( TQ.getTextEx(items.list.getItem(0).exsubs.totalsteeltime), TQ.format(rstr.comm.hour, 2/4) );
		assertEQ ( TQ.getTextEx(items.list.getItem(1).exsubs.totalsteeltime), '--' );
		assertEQ ( TQ.getTextEx(items.list.getItem(1).exsubs.state), rstr.comm.herostate[HERO_STATE.FREE]  );
		assertEQ ( TQ.getTextEx(items.list.getItem(2).exsubs.state), rstr.steellistdlg.lbl.highSteel  );
		assertEQ ( TQ.getTextEx(items.list.getItem(3).exsubs.state), rstr.steellistdlg.lbl.vip1Steel  );
		assertEQ ( TQ.getTextEx(items.list.getItem(4).exsubs.state), rstr.steellistdlg.lbl.vip2Steel  );
	};
	
	this.test__setHerosListCallers = function(){
		this.g.getImgr().getHeros().list = [
			{name:'hero1', level:1, state:HERO_STATE.STEEL}
			,{name:'hero2', level:2, state:HERO_STATE.FREE}
			];
		this.lc()._createDlg();
		var items = this.lc().m_items.tabList.getTabItems(0);
		items.list.setItemCount(2);
		this.mm.mock( items.list.getItem(0).exsubs.opBtn, 'hide' );
		this.mm.mock( items.list.getItem(0).exsubs.opBtn, 'show' );
		this.mm.mock( items.list.getItem(0).exsubs.opBtn, 'setId' );
		this.mm.mock( items.list.getItem(0).exsubs.opBtn, 'setCaller' );
		this.mm.mock( items.list.getItem(1).exsubs.opBtn, 'hide' );
		this.mm.mock( items.list.getItem(1).exsubs.opBtn, 'show' );
		this.mm.mock( items.list.getItem(1).exsubs.opBtn, 'setId' );
		this.mm.mock( items.list.getItem(1).exsubs.opBtn, 'setCaller' );
		this.lc()._setHerosListCallers();
		assertEQ ( this.mm.walkLog, 'show,setId,setCaller,hide' );
		assertEQ ( this.mm.params['setId'], [0] );
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onClickStopSteel}] );
	};
	
	this.test__updateSteelTimes = function(){
		this.g.setSvrTimeS(11);
		this.g.getImgr().getHeros().list = [
			{name:'hero1', state:HERO_STATE.STEEL, steel:{startTime:1,steelQuarters:2}}
			,{name:'hero2', state:HERO_STATE.FREE, steel:{startTime:0,steelQuarters:0}}
			];
		this.lc()._createDlg();
		this.lc()._setHerosListItems();
		var items = this.lc().m_items.tabList.getTabItems(0);
		items.list.setItemCount(2)
		this.lc()._updateSteelTimes();
		assertEQ ( TQ.getTextEx(items.list.getItem(0).exsubs.steeltime), '00:00:10' );
		assertEQ ( TQ.getTextEx(items.list.getItem(1).exsubs.totalsteeltime), '--' );
	};
	
	this.test__updateSteelGetExps = function(){
		var dayacts = this.g.getImgr().getActivityVal().dayacts;
		var todayActs = TQ.find(dayacts, 'day', 0).acts;
		var startTime = 1379520000 + 20*3600;
		this.g.setSvrTimeS(startTime);
		todayActs.push(SVR_TODAY_ACT_TYPE.HERO_STEEL_2);
		todayActs.push(SVR_TODAY_ACT_TYPE.HERO_STEEL_3);
		
		this.g.getImgr().getHeros().list = [
			{name:'hero1', state:HERO_STATE.STEEL, steel:{startTime:startTime,steelQuarters:2,quarterRes:10}}
			,{name:'hero2', state:HERO_STATE.FREE, steel:{startTime:0,steelQuarters:0,quarterRes:0}}
			];
		this.lc()._createDlg();
		this.lc()._setHerosListItems();
		var items = this.lc().m_items.tabList.getTabItems(0);
		items.list.setItemCount(2)
		this.lc()._updateSteelGetExps();
		assertEQ ( TQ.getTextEx(items.list.getItem(0).exsubs.getexp), 0 );
		assertEQ ( TQ.getTextEx(items.list.getItem(1).exsubs.getexp), 0 );
			
		this.g.setSvrTimeS(startTime + (900 - 11));
		this.lc()._updateSteelGetExps();
		assertEQ ( TQ.getTextEx(items.list.getItem(0).exsubs.getexp), 0 );
			
		this.g.setSvrTimeS(startTime + (911 - 11));
		this.lc()._updateSteelGetExps();
		assertEQ ( TQ.getTextEx(items.list.getItem(0).exsubs.getexp), 10*(2+3) );
			
		this.g.setSvrTimeS(startTime + (950 - 11));
		this.lc()._updateSteelGetExps();
		assertEQ ( TQ.getTextEx(items.list.getItem(0).exsubs.getexp), 10*(2+3) );
	};
	
	this.test__transferHeroList = function(){
		this.g.getImgr().getHeros().list = [
			{name:'hero1', state:HERO_STATE.STEEL, steel:{startTime:1,steelQuarters:2,quarterRes:10}}
			,{name:'hero2', state:HERO_STATE.FREE, steel:{startTime:0,steelQuarters:0,quarterRes:0}}
			];
		this.lc()._createDlg();
		var items = this.lc().m_items.tabList.getTabItems(0);
		items.list.setItemCount(2)
			
		var r_params1 = {};
		var notSteelHeroCallBack = function(item, hero, idx){
			r_params1.item = item;
			r_params1.hero = hero;
			r_params1.idx = idx;
		};
		
		var r_params2 = {};
		var steelHeroCallBack = function(item, hero, idx){
			r_params2.item = item;
			r_params2.hero = hero;
			r_params2.idx = idx;
		};
		
		this.lc()._transferHeroList(notSteelHeroCallBack, steelHeroCallBack);
		assertEQ ( r_params1, {item:items.list.getItem(1), hero:this.g.getImgr().getHeros().list[1], idx:1} );
		assertEQ ( r_params2, {item:items.list.getItem(0), hero:this.g.getImgr().getHeros().list[0], idx:0} );
	};
	
	this.test__onUpdate = function(){
		this.mm.mock(this.lc(), '_updateSteelTimes');
		this.mm.mock(this.lc(), '_updateSteelGetExps');
		this.lc()._onUpdate();
		assertEQ ( this.mm.walkLog, '_updateSteelTimes,_updateSteelGetExps' );
	};
	
	this.test__onDlgEvent = function(){
		this.mm.mock(this.g, 'unregUpdater' );
		this.lc()._onDlgEvent(C_SYS_DLG_HIDE+1);
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc()._onDlgEvent(C_SYS_DLG_HIDE);
		assertEQ ( this.mm.walkLog, 'unregUpdater' );
		assertEQ ( this.mm.params['unregUpdater'], [this.dlg, this.lc()._onUpdate] );
	};
	
	this.test__onHeroUpdate = function(){
		this.mm.mock( this.lc(), '_updateHerosList' );
		this.lc()._onHeroUpdate();
		assertEQ ( this.mm.walkLog, '_updateHerosList' );
	};
	
	this.test__onClickStopSteel = function(){
		this.g.getImgr().getHeros().list = [{id:10000}];
		this.mm.mock( HeroSender, 'sendStopHeroSteel' );
		this.lc()._onClickStopSteel(0);
		assertEQ ( this.mm.params['sendStopHeroSteel'], [this.g, 10000] );
	};
	
	this.test__onClickListItem = function(){
		this.lc()._createDlg();
		var items = this.lc().m_items.tabList.getTabItems(0);
		items.list.setItemCount(2);
		
		items.list.getItem(0).exsubs.sel.setCheck(1);
		this.lc()._onClickListItem(null, 100);
		assert ( items.list.getItem(0).exsubs.sel.getCheck() == 1);
		this.lc()._onClickListItem(null, -1);
		assert ( items.list.getItem(0).exsubs.sel.getCheck() == 1);
		
		this.lc()._onClickListItem(null, 0);
		assert ( items.list.getItem(0).exsubs.sel.getCheck() == 0);
		
		this.lc()._onClickListItem(null, 0);
		assert ( items.list.getItem(0).exsubs.sel.getCheck() == 1);
	};
	
	this.test__onClickSelectAll = function(){
		this.mm.mock(this.lc(), '_selectOrUnselectAllArms' );
		this.lc()._onClickSelectAll();
		assertEQ ( this.mm.params['_selectOrUnselectAllArms'], [1] );
	};
	
	this.test__onClickUnselectAll = function(){
		this.mm.mock(this.lc(), '_selectOrUnselectAllArms' );
		this.lc()._onClickUnselectAll();
		assertEQ ( this.mm.params['_selectOrUnselectAllArms'], [0] );
	};
	
	this.test__onClickStopSteelAll = function(){
		this.mm.mock(this.g.getGUI(), 'msgBox' )
		this.lc()._onClickStopSteelAll();
		assertEQ ( this.mm.params['msgBox'], [rstr.comm.msgts, rstr.steellistdlg.lbl.stopAllSteel,  MB_F_YESNO, {self:this.dlg, caller:this.lc()._onStopCallback}] );
	};
	
	this.test__onClickStopSteelAll_onStopCallback = function(){
		this.lc()._onClickStopSteelAll(); // create _onStopCallback function
		
		this.mm.mock( HeroSender, 'sendStopAllHerosSteel' );
		this.lc()._onStopCallback(MB_IDNO);
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc()._onStopCallback(MB_IDYES);
		assertEQ ( this.mm.walkLog, 'sendStopAllHerosSteel' );
		assertEQ ( this.mm.params['sendStopAllHerosSteel'], [this.g] );
	};
	
	this.test__onClickSteel = function(){
		var r_needSteelHeros = [[]];
		this.mm.mock( this.lc(), '_getSelectCanSteelHeros',  r_needSteelHeros);
		this.mm.mock( UIM, 'openDlg' );
		this.lc()._onClickSteel();
		assertEQ ( this.mm.walkLog, '_getSelectCanSteelHeros' );
		assertEQ ( this.mm.params['_getSelectCanSteelHeros'], ['steel'] );
		
		this.mm.clear();
		r_needSteelHeros[0] = [{}];
		this.lc()._onClickSteel();
		assertEQ ( this.mm.walkLog, '_getSelectCanSteelHeros,openDlg' );
		assertEQ ( this.mm.params['openDlg'], ['steelhero', 'steel', r_needSteelHeros[0] ] );
	};
	
	this.test__onClickHighSteel = function(){
		var r_needSteelHeros = [[]];
		this.mm.mock( this.lc(), '_getSelectCanSteelHeros',  r_needSteelHeros);
		this.mm.mock( UIM, 'openDlg' );
		this.lc()._onClickHighSteel();
		assertEQ ( this.mm.walkLog, '_getSelectCanSteelHeros' );
		assertEQ ( this.mm.params['_getSelectCanSteelHeros'], ['highsteel'] );
		
		this.mm.clear();
		r_needSteelHeros[0] = [{}];
		this.lc()._onClickHighSteel();
		assertEQ ( this.mm.walkLog, '_getSelectCanSteelHeros,openDlg' );
		assertEQ ( this.mm.params['openDlg'], ['steelhero', 'highsteel', r_needSteelHeros[0] ] );
	};
	
	this.test_clickVip1SteelBtn = function(){
		this.dlg.openDlg();
		
		var r_needSteelHeros = [[{}]];
		this.mm.mock( this.lc(), '_getSelectCanSteelHeros',  r_needSteelHeros);
		this.mm.mock( UIM, 'openDlg' );
		this.lc().m_items.vip1SteelBtn.click();
		assertEQ ( this.mm.params['openDlg'], ['steelhero', 'vip1steel', r_needSteelHeros[0] ] );
	};
	
	this.test_clickVip2SteelBtn = function(){
		this.dlg.openDlg();
		
		var r_needSteelHeros = [[{}]];
		this.mm.mock( this.lc(), '_getSelectCanSteelHeros',  r_needSteelHeros);
		this.mm.mock( UIM, 'openDlg' );
		this.lc().m_items.vip2SteelBtn.click();
		assertEQ ( this.mm.params['openDlg'], ['steelhero', 'vip2steel', r_needSteelHeros[0] ] );
	};
	
	this.test__selectOrUnselectAllArms = function(){
		this.lc()._createDlg();
		var items = this.lc().m_items.tabList.getTabItems(0);
		items.list.setItemCount(2);
		items.list.getItem(0).exsubs.sel.setCheck(0);
		items.list.getItem(1).exsubs.sel.setCheck(0);
		this.lc()._selectOrUnselectAllArms(1);
		assertEQ ( items.list.getItem(0).exsubs.sel.getCheck(), 1 );
		assertEQ ( items.list.getItem(1).exsubs.sel.getCheck(), 1 );
		
		this.lc()._selectOrUnselectAllArms(0);
		assertEQ ( items.list.getItem(0).exsubs.sel.getCheck(), 0 );
		assertEQ ( items.list.getItem(1).exsubs.sel.getCheck(), 0 );
	};
	
	this.test__getSelectCanSteelHeros = function(){
		this.mm.mock ( this.g.getGUI(), 'sysMsgTips' );
		
		this.lc()._createDlg();
		
		this.g.getImgr().getHeros().list = [
			{name:'hero1', state:HERO_STATE.STEEL, level:59, skeleton:{level:0}}
			,{name:'hero2', state:HERO_STATE.FREE, level:59, skeleton:{level:0}}
			,{name:'hero3', state:HERO_STATE.FREE, level:59, skeleton:{level:0}}
			];
			
		var items = this.lc().m_items.tabList.getTabItems(0);
		items.list.setItemCount(3);
		items.list.getItem(0).exsubs.sel.setCheck(1);
		items.list.getItem(1).exsubs.sel.setCheck(1);
		items.list.getItem(2).exsubs.sel.setCheck(0);
		assertEQ ( this.lc()._getSelectCanSteelHeros('highsteel'), [{name:'hero2', state:HERO_STATE.FREE, level:59, skeleton:{level:0}}] );
		
		this.mm.clear();
		this.g.getImgr().getHeros().list = [
			{name:'hero1', state:HERO_STATE.STEEL, level:59, skeleton:{level:0}}
			,{name:'hero2', state:HERO_STATE.STEEL, level:59, skeleton:{level:0}}
			,{name:'hero3', state:HERO_STATE.STEEL, level:59, skeleton:{level:0}}
			];
		assertEQ ( this.lc()._getSelectCanSteelHeros('highsteel'), [] );
		assertEQ ( this.mm.walkLog, 'sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.steellistdlg.tip.allHerosBusy] );
		
		this.mm.clear();
		this.g.getImgr().getHeros().list = [
			{name:'hero1', state:HERO_STATE.FREE, level:60, skeleton:{level:0}}
			,{name:'hero2', state:HERO_STATE.FREE, level:59, skeleton:{level:0}}
			,{name:'hero3', state:HERO_STATE.STEEL, level:59, skeleton:{level:0}}
			];
		assertEQ ( this.lc()._getSelectCanSteelHeros('highsteel'), [{name:'hero2', state:HERO_STATE.FREE, level:59, skeleton:{level:0}}] );
		assertEQ ( this.mm.walkLog, 'sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.steellistdlg.tip.fullLevelHeros] );
		
		this.mm.clear();
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.STEEL_BUILD, level:1}] });
		this.g.getImgr().getHeros().list = [
			{name:'hero1', state:HERO_STATE.FREE, level:59, skeleton:{level:0}}
			,{name:'hero2', state:HERO_STATE.FREE, level:1, skeleton:{level:0}}
			,{name:'hero3', state:HERO_STATE.STEEL, level:59, skeleton:{level:0}}
			];
		assertEQ ( this.lc()._getSelectCanSteelHeros('steel'), [{name:'hero2', state:HERO_STATE.FREE, level:1, skeleton:{level:0}}] );
		assertEQ ( this.mm.walkLog, 'sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.steellistdlg.tip.arriveMaxBuildLevel] );
	};
	
	this.test__getSelectCanSteelHeros_noSelect = function(){
		this.mm.mock ( this.g.getGUI(), 'sysMsgTips' );
		this.lc()._createDlg();
		var items = this.lc().m_items.tabList.getTabItems(0);
		items.list.setItemCount(3);
		items.list.getItem(0).exsubs.sel.setCheck(0);
		items.list.getItem(1).exsubs.sel.setCheck(0);
		items.list.getItem(2).exsubs.sel.setCheck(0);
		
		this.mm.clear();
		this.g.getImgr().getHeros().list = [
			{name:'hero1', state:HERO_STATE.FREE, level:59, skeleton:{level:0}}
			,{name:'hero2', state:HERO_STATE.FREE, level:59, skeleton:{level:0}}
			,{name:'hero3', state:HERO_STATE.FREE, level:59, skeleton:{level:0}}
			];
		assertEQ ( this.lc()._getSelectCanSteelHeros('highsteel'), [] );
		assertEQ ( this.mm.walkLog, 'sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.steellistdlg.tip.emptySteelHeros] );
	};
	
	this.test__getSelectCanSteelHeros_allFullLevelHeros = function(){
		this.mm.mock ( this.g.getGUI(), 'sysMsgTips' );
		this.lc()._createDlg();
		var items = this.lc().m_items.tabList.getTabItems(0);
		items.list.setItemCount(3);
		items.list.getItem(0).exsubs.sel.setCheck(1);
		items.list.getItem(1).exsubs.sel.setCheck(1);
		items.list.getItem(2).exsubs.sel.setCheck(0);
		
		this.mm.clear();
		this.g.getImgr().getHeros().list = [
			{name:'hero1', state:HERO_STATE.FREE, level:60, skeleton:{level:0}}
			,{name:'hero2', state:HERO_STATE.FREE, level:60, skeleton:{level:0}}
			,{name:'hero3', state:HERO_STATE.FREE, level:59, skeleton:{level:0}}
			];
		assertEQ ( this.lc()._getSelectCanSteelHeros('highsteel'), [] );
		assertEQ ( this.mm.walkLog, 'sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.steellistdlg.tip.allFullLevelHeros] );
	};
	
	this.test__getSelectCanSteelHeros_allArriveMaxBuildLevel = function(){
		this.mm.mock ( this.g.getGUI(), 'sysMsgTips' );
		this.lc()._createDlg();
		var items = this.lc().m_items.tabList.getTabItems(0);
		items.list.setItemCount(3);
		items.list.getItem(0).exsubs.sel.setCheck(1);
		items.list.getItem(1).exsubs.sel.setCheck(1);
		items.list.getItem(2).exsubs.sel.setCheck(0);
		
		this.mm.clear();
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.STEEL_BUILD, level:1}] });
		this.g.getImgr().getHeros().list = [
			{name:'hero1', state:HERO_STATE.FREE, level:59, skeleton:{level:0}}
			,{name:'hero2', state:HERO_STATE.FREE, level:59, skeleton:{level:0}}
			,{name:'hero3', state:HERO_STATE.STEEL, level:59, skeleton:{level:0}}
			];
		assertEQ ( this.lc()._getSelectCanSteelHeros('steel'), [] );
		assertEQ ( this.mm.walkLog, 'sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.steellistdlg.tip.allArriveMaxBuildLevel] );
	};
	
	this.test__isArriveMaxBuildLevel = function(){
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.STEEL_BUILD, level:1}] });
		var res = ItemResUtil.findBuildLevelres(FIXID.STEEL_BUILD, 1);
		
		var p_hero = {level:res.herosteelmaxlevel-1};
		assertEQ ( this.lc()._isArriveMaxBuildLevel(p_hero), false );
		
		var p_hero = {level:res.herosteelmaxlevel};
		assertEQ ( this.lc()._isArriveMaxBuildLevel(p_hero), true );
		
		var p_hero = {level:res.herosteelmaxlevel+1};
		assertEQ ( this.lc()._isArriveMaxBuildLevel(p_hero), true );
	};
});

tqSteelListDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseSteelListDlg, 'TestCaseSteelListDlg');
};
