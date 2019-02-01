/*******************************************************************************/
requireEx('./handler/tqFilterItemDlg.js', [
	{
		start:'//FilterItemDlg-unittest-start'
		,end:'//FilterItemDlg-unittest-end'
		,items:[
			'm_g'
			,'C_MAX_CNT'
			,'C_ITEM_H'
			,'m_this'
			,'m_dlg'
			,'m_caller'
			,'m_filters'
			,'m_curfilter'
			,'m_items'
			,'m_resitems'
			,'m_itemInfoGetters'
			,'m_paramdata'
			,'_onUpdateNumber'
			,'_registerFilter'
			,'_registerItemInfoGetters'
			,'_initParams'
			,'_initFilter'
			,'_initDlg'
			,'_createDlg'
			,'_setCallers'
			,'_openDlg'
			,'_initInfo'
			,'_resetResItems'
			,'_resetDlgSize'
			,'_initTarget'
			,'_initList'
			,'_startUpdater'
			,'_hasEffect'
			,'_getItemInfo'
			,'_getDurationTimeToStopTime'
			,'_onDlgEvent'
			,'_getFitListHeight'
			,'_resetListScrollerHeight'
			,'_resetDlgPanelHeight'
			,'_onUseItem'
			,'_onUpdate'
			,'_getItemInfoGetter'
			]
	}
]);
	
TestCaseFilterItemDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.filterItemDlg = FilterItemDlg.snew(this.g);
		this.dlg = this.filterItemDlg;
		this.lc = this.filterItemDlg.lc;		
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.g, 'regEvent');
		this.mm.mock(this.lc(), '_registerFilter');
		this.mm.mock(this.lc(), '_registerItemInfoGetters');
		this.dlg.init(this.g);
		assertEQ ( this.mm.walkLog, 'regEvent,_registerFilter,_registerItemInfoGetters' );
		assertEQ ( this.mm.params['regEvent'], [EVT.PKG_CHANGE,0,this.dlg,this.lc()._onUpdateNumber]);
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.dlg );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initParams');
		this.mm.mock(this.lc(), '_initFilter');
		this.mm.mock(this.lc(), '_initDlg');
		this.mm.mock(this.lc(), '_openDlg');
		this.mm.mock(this.lc(), '_initInfo');
		this.mm.mock(this.lc(), '_startUpdater');
		
		this.lc().m_dlg = new function(){ this.getParent = function(){};};
		
		var p_data = {title:'xxx', filter:'effect', targetitem:{}};
		this.dlg.openDlg(p_data);
		assertEQ ( this.mm.walkLog, '_initParams,_initFilter,_initDlg,_openDlg,_initInfo,_startUpdater' );
		assertEQ ( this.mm.params['_initParams'], [p_data] );
	};
	
	this.test_setCaller = function(){
		var p_caller = {self:this, caller:function(){}};
		this.dlg.setCaller(p_caller);
		assertEQ ( this.lc().m_caller, p_caller );
	};
	
	this.test_isShow = function(){
		assertEQ ( this.dlg.isShow(), false );
		this.lc()._createDlg();
		this.lc().m_dlg.show();
		assertEQ ( this.dlg.isShow(), true );
		this.lc().m_dlg.hide();
		assertEQ ( this.dlg.isShow(), false );
	};
	
	this.test_clickItem = function(){
		this.lc()._createDlg();
		this.lc().m_items.itemlist.setItemCount(1);
		this.mm.mock(this.lc().m_items.itemlist.getItem(0).exsubs.usebtn, 'click');
		this.dlg.clickItem(0);
		assertEQ ( this.mm.walkLog, 'click' );
	};
	
	this.test__registerFilter = function(){
		assertEQ ( this.lc().m_filters['effect'] instanceof UseItemByEffectFilter, true );
		assertEQ ( this.lc().m_filters['itemids'] instanceof UseItemByItemIdsFilter, true );
	};
	
	this.test__registerItemInfoGetters = function(){
		assertEQ ( this.lc().m_itemInfoGetters['comm'] instanceof CommItemInfoGetter, true );
		assertEQ ( this.lc().m_itemInfoGetters['buildGold'] instanceof BuildGoldItemInfoGetter, true );
		assertEQ ( this.lc().m_itemInfoGetters['cultureGold'] instanceof CultureLearnGoldItemInfoGetter, true );
		assertEQ ( this.lc().m_itemInfoGetters['skeletonGold'] instanceof SkeletonSteelGoldItemInfoGetter, true );
		assertEQ ( this.lc().m_itemInfoGetters['skillGold'] instanceof SkillSteelGoldItemInfoGetter, true );
		assertEQ ( this.lc().m_itemInfoGetters['cityDefGold'] instanceof CityDefGoldItemInfoGetter, true );
	};
	
	this.test__initParams = function(){
		var p_data = {title:'xxx', filter:'effect', targetitem:{}};
		this.lc()._initParams(p_data);
		assertEQ ( this.lc().m_paramdata, p_data );
	};
	
	this.test__initFilter = function(){
		var p_data = {title:'xxx', filter:'effect', targetitem:{}};
		this.lc()._initParams(p_data);
		this.lc()._initFilter();
		assertEQ ( this.lc().m_curfilter, this.lc().m_filters[p_data.filter] );
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = {name:'dlg'};
		this.mm.mock(this.lc(), '_createDlg');
		this.mm.mock(this.lc(), '_setCallers');
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_dlg = null;
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_setCallers' );
	};
	
	this.test__createDlg = function(){
		var r_dlg = MockDialog.snew(this.g);
		this.mm.mock(Dialog, 'snew', [r_dlg]);
		this.mm.mock(this.g.getGUI(), 'initDlg');
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snew,initDlg' );
		assertEQ ( this.mm.params['snew'], [this.g, {modal:false, title:'.', pos:{x:'center', y:25}} ] );
		assertEQ ( this.mm.params['initDlg'], [r_dlg, uicfg.useitem.filterdlg, this.lc().m_items] );
		assertEQ ( this.lc().m_dlg, r_dlg );
	};
	
	this.test__setCallers = function(){
		this.lc()._createDlg();
		this.mm.mock(this.lc().m_dlg, 'setCaller');
		this.lc()._setCallers();
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg,caller:this.lc()._onDlgEvent}] );
	};
	
	this.test__openDlg = function(){
		this.lc()._createDlg();
		this.lc().m_dlg.hide();
		this.lc()._openDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
	};
	
	this.test__initInfo = function(){
		this.lc()._createDlg();
		
		this.lc().m_paramdata = {title:'xxx'};
		
		this.mm.mock(this.lc().m_dlg, 'setTitle' );
		this.mm.mock(this.lc(), '_resetResItems' );
		this.mm.mock(this.lc(), '_resetDlgSize' );
		this.mm.mock(this.lc(), '_initTarget' );
		this.mm.mock(this.lc(), '_initList' );
		
		this.lc()._initInfo();
		assertEQ ( this.mm.walkLog, 'setTitle,_resetResItems,_resetDlgSize,_initTarget,_initList' );
		assertEQ ( this.mm.params['setTitle'], ['xxx'] );
	};
	
	this.test__resetDlgSize = function(){
		this.mm.mock(this.lc(), '_getFitListHeight', [10]);
		this.mm.mock(this.lc(), '_resetListScrollerHeight' );
		this.mm.mock(this.lc(), '_resetDlgPanelHeight' );
		this.lc()._resetDlgSize();
		assertEQ ( this.mm.walkLog, '_getFitListHeight,_resetListScrollerHeight,_resetDlgPanelHeight' );
		assertEQ ( this.mm.params['_resetListScrollerHeight'], [10] );
		assertEQ ( this.mm.params['_resetDlgPanelHeight'], [10] );
	};
	
	this.test__getFitListHeight = function(){
		this.lc().m_resitems = []; 
		
		this.lc().m_resitems.length = 1;
		assertEQ ( this.lc()._getFitListHeight(), this.lc().C_ITEM_H * 1 );
		
		this.lc().m_resitems.length = this.lc().C_MAX_CNT;
		assertEQ ( this.lc()._getFitListHeight(), this.lc().C_ITEM_H * this.lc().C_MAX_CNT  );
		
		this.lc().m_resitems.length = this.lc().C_MAX_CNT + 1;
		assertEQ ( this.lc()._getFitListHeight(), this.lc().C_ITEM_H * this.lc().C_MAX_CNT  );
	};
	
	this.test__resetListScrollerHeight = function(){
		this.lc()._createDlg();
		this.mm.mock(this.lc().m_items.itemlist.getScroller(), 'setSize' );
		this.mm.mock(this.lc().m_items.itemlist.getScroller(), 'refresh' );
		
		var p_listh = 10;
		this.lc()._resetListScrollerHeight(p_listh);
		assertEQ ( this.mm.walkLog, 'setSize,refresh' );
		assertEQ ( this.mm.params['setSize'], [-1, p_listh] );
	};
	
	this.test__resetDlgPanelHeight = function(){
		this.lc()._createDlg();
		this.mm.mock(this.lc().m_dlg, 'refreshBack' );
		this.lc()._resetDlgPanelHeight(10);
		assertEQ ( this.mm.walkLog, 'refreshBack' );
	};
	
	this.test__initTarget = function(){
		this.lc()._createDlg();
		this.lc().m_paramdata = {name:'name', desc:'desc'};
		this.lc()._initTarget();
		assertEQ ( TQ.getTextEx(this.lc().m_items.desc), 'desc' );
		
		this.lc().m_paramdata = {name:'name', desc:function(){return 'desc';}};
		this.lc()._initTarget();
		assertEQ ( TQ.getTextEx(this.lc().m_items.desc), 'desc' );
	};
	
	this.test__initList = function(){
		this.lc()._createDlg();
		this.lc().m_paramdata = {btntext:'use'};
		this.lc().m_resitems = [{itemres:{bigpic:101, name:'name1'}, number:1, desc:'desc1'},{itemres:{bigpic:102, name:'name2'}, number:2, desc:'desc2'}];
		this.lc().m_items.itemlist.setItemCount(3);
		this.mm.mock(this.lc().m_items.itemlist.getItem(0).exsubs.usebtn, 'setCaller');
		this.mm.mock(this.lc().m_items.itemlist.getItem(1).exsubs.usebtn, 'setCaller');
		this.mm.mock(this.lc().m_items.itemlist, 'scrollPos');
		this.lc()._initList();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller,scrollPos' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.dlg, caller:this.lc()._onUseItem}] );
		assertEQ ( this.mm.params['scrollPos'], [0] );
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_items.itemlist.getItem(0).exsubs.icon), '101.gif'), true);
		assertEQ ( TQ.getTextEx(this.lc().m_items.itemlist.getItem(0).exsubs.name), ItemNameColorGetter.getColorVal(1,'name1') );
		assertEQ ( TQ.getTextEx(this.lc().m_items.itemlist.getItem(0).exsubs.number), 1 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.itemlist.getItem(0).exsubs.desc), 'desc1' );
		assertEQ ( this.lc().m_items.itemlist.getItem(0).exsubs.usebtn.getText(), 'use' );
		assertEQ ( this.lc().m_items.itemlist.getItem(0).exsubs.usebtn.getId(), 0 );
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_items.itemlist.getItem(1).exsubs.icon), '102.gif'), true);
		assertEQ ( this.lc().m_items.itemlist.getItem(1).exsubs.usebtn.getText(), 'use' );
		assertEQ ( this.lc().m_items.itemlist.getItem(1).exsubs.usebtn.getId(), 1 );
	};
	
	this.test__startUpdater = function(){
		this.lc().m_paramdata = {};
		this.mm.mock( this.g, 'regUpdater' );
		this.lc()._startUpdater();
		assertEQ ( this.mm.walkLog, '' );
			
		this.mm.clear();
		this.lc().m_paramdata = {targetitem:{stoptime:1}};
		this.lc()._startUpdater();
		assertEQ ( this.mm.walkLog, 'regUpdater' );
		assertEQ ( this.mm.params['regUpdater'], [this.dlg, this.lc()._onUpdate, 1000] );
		
		this.mm.clear();
		this.lc().m_paramdata = {targetitem:{starttime:1}};
		this.lc()._startUpdater();
		assertEQ ( this.mm.walkLog, 'regUpdater' );
		
		this.mm.clear();
		this.lc().m_paramdata = {desc:function(){}, targetitem:{}};
		this.lc()._startUpdater();
		assertEQ ( this.mm.walkLog, 'regUpdater' );
	};
	
	this.test__onUseItem = function(){
		this.lc()._createDlg();
		
		this.lc().m_caller = null;
		this.mm.mock(this.lc().m_dlg, 'hide');
		
		var p_idx = 0;
		this.lc()._onUseItem(p_idx);
		
		var r_ret = RET_END;
		var p_item = null;
		this.lc().m_caller = {self:this, caller:function(item){
			p_item = item;
			return r_ret;  }};
		this.lc().m_resitems = [{id:1}];
		this.lc()._onUseItem(p_idx);
		assertEQ ( this.mm.walkLog, 'hide' );
		assertEQ ( p_item, {id:1} );
		
		this.mm.clear();
		r_ret = RET_CONTINUE;
		this.lc()._onUseItem(p_idx);
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__onUpdate = function(){
		this.lc()._createDlg();
		this.g.setSvrTimeS(2);
		
		var r_max = 10;
		this.mm.mock(Math, 'max', [r_max]);
		this.mm.mock(TQ, 'setTextEx');
		
		this.lc().m_paramdata = {targetitem:{stoptime:8}};
		this.lc()._onUpdate();
		assertEQ ( this.mm.params['max'], [0, 8 - 2] );
		assertEQ ( this.mm.params['setTextEx'], [this.lc().m_items.desc, TQ.formatTime(0, r_max)] );
		
		this.mm.clear();
		this.lc().m_paramdata = {targetitem:{starttime:1}};
		this.lc()._onUpdate();
		assertEQ ( this.mm.params['max'], [0, 2- 1] );
		assertEQ ( this.mm.params['setTextEx'], [this.lc().m_items.desc, TQ.formatTime(0, r_max)] );
		
		this.mm.clear();
		this.lc().m_paramdata = {targetitem:{}, desc:function(){return 'desc';}};
		this.lc()._onUpdate();
		assertEQ ( this.mm.params['setTextEx'], [this.lc().m_items.desc, 'desc'] );
	};
	
	this.test__onUpdateNumber = function(){
		this.lc()._createDlg();
		this.lc().m_items.itemlist.setItemCount(2);
		this.lc().m_resitems = [{number:1},{number:2}];
		
		var r_isShow = [false];
		this.mm.mock(this.dlg, 'isShow', r_isShow );
		this.mm.mock(this.lc(), '_resetResItems' );
		this.mm.mock(TQ, 'setTextEx' );
		this.mm.mock(this.lc().m_items.itemlist, 'scrollPos' );
		
		this.lc()._onUpdateNumber();
		assertEQ ( this.mm.walkLog, 'isShow' );
		
		this.mm.clear();
		r_isShow[0] = true;
		this.lc()._onUpdateNumber();
		assertEQ ( this.mm.walkLog, 'isShow,_resetResItems,setTextEx,setTextEx,scrollPos' );
		assertEQ ( this.mm.params['setTextEx.0'], [this.lc().m_items.itemlist.getItem(0).exsubs.number, 1] );
		assertEQ ( this.mm.params['setTextEx.1'], [this.lc().m_items.itemlist.getItem(1).exsubs.number, 2] );
		assertEQ ( this.mm.params['scrollPos'], [0] );
	};
	
	this.test__resetResItems = function(){
		this.lc().m_paramdata = {filter:'effect'};
		this.lc()._initFilter();
		
		this.mm.mock( this.lc().m_curfilter, 'filter', [[{id:1},{id:2}]]);
		this.mm.mock( this.lc(), '_getItemInfo', [{needNumber:1, isGiftGold:true, number:2, desc:'desc'}] );
		
		this.lc()._resetResItems();
		assertEQ ( this.mm.walkLog, 'filter,_getItemInfo,_getItemInfo' );
		assertEQ ( this.mm.params['filter'], [this.lc().m_paramdata] );
		assertEQ ( this.mm.params['_getItemInfo.0'], [this.lc().m_resitems[0]]);
		assertEQ ( this.mm.params['_getItemInfo.1'], [this.lc().m_resitems[1]]);
		assertEQ ( this.lc().m_resitems, [{id:1,needNumber:1, isGiftGold:true, number:2, desc:'desc'},{id:2,needNumber:1, isGiftGold:true, number:2, desc:'desc'}]);
	};
	
	this.test__onDlgEvent = function(){
		this.mm.mock(this.g, 'unregUpdater' );
		
		this.lc()._onDlgEvent(C_SYS_DLG_HIDE+1);
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc()._onDlgEvent(C_SYS_DLG_HIDE);
		assertEQ ( this.mm.walkLog, 'unregUpdater' );
		assertEQ ( this.mm.params['unregUpdater'], [this.dlg, this.lc()._onUpdate] );
	};
	
	this.test__getItemInfo = function(){
		var r_itemInfoGetter = this.lc().m_itemInfoGetters['comm'];
		this.mm.mock(this.lc(), '_getDurationTimeToStopTime', [10] );
		this.mm.mock(this.lc(), '_getItemInfoGetter', [r_itemInfoGetter]);
		this.mm.mock(r_itemInfoGetter, 'getInfo', [{needNumber:1}]);
		
		var p_item = {id:1};
		this.lc()._getItemInfo(p_item);
		assertEQ ( this.mm.walkLog, '_getItemInfoGetter,_getDurationTimeToStopTime,getInfo' );
		assertEQ ( this.mm.params['_getItemInfoGetter'], [p_item] );
		assertEQ ( this.mm.params['getInfo'], [p_item, 10] );
	};
	
	this.test__getItemInfoGetter = function(){
		var p_item = {itemres:{effects:[{id:RES_EFF.FULL_ACC_BUILDING_USEGIFTGOLD}]}};
		assertEQ ( this.lc()._getItemInfoGetter(p_item),  this.lc().m_itemInfoGetters['buildGold']);
		p_item = {itemres:{effects:[{id:RES_EFF.FULL_ACC_CULTURELEARN_USEGIFTGOLD}]}};
		assertEQ ( this.lc()._getItemInfoGetter(p_item),  this.lc().m_itemInfoGetters['cultureGold']);
		p_item = {itemres:{effects:[{id:RES_EFF.FULL_ACC_SKELETONSTEEL_USEGIFTGOLD}]}};
		assertEQ ( this.lc()._getItemInfoGetter(p_item),  this.lc().m_itemInfoGetters['skeletonGold']);
		p_item = {itemres:{effects:[{id:RES_EFF.FULL_ACC_SKILLSTEEL_USEGIFTGOLD}]}};
		assertEQ ( this.lc()._getItemInfoGetter(p_item),  this.lc().m_itemInfoGetters['skillGold']);
		p_item = {itemres:{effects:[{id:RES_EFF.FULL_ACC_CITYDEF_USEGIFTGOLD}]}};
		assertEQ ( this.lc()._getItemInfoGetter(p_item),  this.lc().m_itemInfoGetters['cityDefGold']);
		p_item = {itemres:{effects:[{id:RES_EFF.FULL_ACC_TRADING_USEGIFTGOLD}]}};
		assertEQ ( this.lc()._getItemInfoGetter(p_item),  this.lc().m_itemInfoGetters['tradingGold']);
		p_item = {itemres:{effects:[{id:RES_EFF.FULL_ACC_TASK_USEGIFTGOLD}]}};
		assertEQ ( this.lc()._getItemInfoGetter(p_item),  this.lc().m_itemInfoGetters['roletaskGold']);
		p_item = {itemres:{effects:[{id:RES_EFF.FULL_ACC_SKILLSTEEL_USEGIFTGOLD+100000}]}};
		assertEQ ( this.lc()._getItemInfoGetter(p_item),  this.lc().m_itemInfoGetters['comm']);
	};
	
	this.test_hasEffect = function(){
		assert ( this.lc()._hasEffect({itemres:{effects:[{id:1}]}}, 1) == true );
		assert ( this.lc()._hasEffect({itemres:{effects:[{id:1}]}}, 2) == false );
	};
	
	this.test__getDurationTimeToStopTime = function(){
		this.lc().m_paramdata = {targetitem:{}};
		assert ( this.lc()._getDurationTimeToStopTime() == 0 );
		
		this.lc().m_paramdata = {targetitem:{stoptime:this.g.getSvrTimeS()-1}};
		assert ( this.lc()._getDurationTimeToStopTime() == 0 );
		
		this.lc().m_paramdata = {targetitem:{stoptime:this.g.getSvrTimeS()+1}};
		assert ( this.lc()._getDurationTimeToStopTime() == 1 );
	};	
});

tqFilterItemDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseFilterItemDlg, 'TestCaseFilterItemDlg');
};
