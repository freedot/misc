//---
requireEx('./handler/tqArmOpDlg.js', [
	{
		start:'//ArmOpDlg-unittest-start'
		,end:'//ArmOpDlg-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_dlg'
			,'m_items'
			,'m_panels'
			,'_initDlg'
			,'_openDlg'
			,'_initInfo'
			,'_updatePanels'
			,'_initTabsText'
			,'_createOpPanels'
			]
	}
	,{
		start:'//ArmListWithHerosAndArmPos-unittest-start'
		,end:'//ArmListWithHerosAndArmPos-unittest-end'
		,items:[
			'm_this'
			,'_onGetMyArmListTip'
			,'_onClickArmPosDropList'
			,'_onClickHeroDropList'
			,'_onHeroUpdate'
			,'_regEvents'
			,'_setCallers'
			,'_setArmPosDropList'
			,'_selectFirstArmInList'
			,'_getCurArmPos'
			,'_getCurSelPkgOrHeroWears'
			,'_filterMyArms'
			,'_resetArmListCurSel'
			,'_isSelectedPkg'
			,'_getCurHeroIdx'
			]
	}
	,{
		start:'//BuyArmOpPanel-unittest-start'
		,end:'//BuyArmOpPanel-unittest-end'
		,items:[
			'm_myCanSaleItems'
			,'m_saleItems'
			,'_regEvents'
			,'_setCallers'
			,'_updateSaleList'
			,'_updateMyItemList'
			,'_onItemChanged'
			,'_onClickSaleList'
			,'_onClickMyItemList'
			,'_createResSaleItemIds'
			,'_createSaleItems'
			,'_setSaleListTipCaller'
			,'_setMyItemListCaller'
			,'_setSaleListItems'
			,'_setMyItemListItems'			
			,'_onGetSaleListTip'			
			,'_onGetMyItemListTip'			
			]
	}
	,{
		start:'//SplitArmOpPanel-unittest-start'
		,end:'//SplitArmOpPanel-unittest-end'
		,items:[
			'm_this'
			,'m_essences'
			,'_setArmLevelDropList'
			,'_regEvents'
			,'_setCallers'
			,'_onItemOpSvrCmd'
			,'_onItemChanged'
			,'_onClickSelectAll'
			,'_onClickArmLevelDropList'
			,'_onClickArmList'
			,'_onClickSplitBtn'
			,'_updateMyArmList'
			,'_updateMyEssenceList'
			,'_filterMyArms'
			,'_setMyArmListItems'
			,'_getMyEssenceItems'
			,'_unselectAllArms'
			,'_setMyEssenceListItems'
			,'_setMyArmListTipCaller'
			,'_setMyEssenceListTipCaller'
			,'_onGetMyArmListTip'
			,'_onGetEssenceListTip'
			]
	}
	,{
		start:'//IntensifyArmOpPanel-unittest-start'
		,end:'//IntensifyArmOpPanel-unittest-end'
		,items:[
			'm_this'
			,'m_armList'
			,'_regEvents'
			,'_setCallers'
			,'_onItemChanged'
			,'_onItemOpSvrCmd'
			,'_onClickArmList'
			,'_onClickBuyStone'
			,'_onClickBuyEssence'
			,'_onClickIntensify'
			,'_clearAllCurArmInfo'
			,'_updateCurArmIconName'
			,'_updateCurArmAttrs'
			,'_updateCurForceLevelDesc'
			,'_updateNextForceLevelDesc'
			,'_updateNextForceLevelNeed'
			,'_updateIntensifySuccessRate'
			,'_isArriveMaxForceLevel'
			,'_hasEnoughExpends'
			,'_updateMyHasMaterials'
			,'_getAttrStr'
			,'_setCurArmTipCaller'			
			,'_onGetCurArmTip'			
			]
	}
	,{
		start:'//CombineGemOpPanel-unittest-start'
		,end:'//CombineGemOpPanel-unittest-end'
		,items:[
			'm_this'
			,'m_myGems'
			,'_regEvents'
			,'_setCallers'
			,'_setCombineLevelList'
			,'_setGemClassDorpList'
			,'_updateMyGemsList'
			,'_filterMyGems'
			,'_mergeSameGems'
			,'_sortGems'
			,'_setMyGemsListItems'
			,'_resetMyGemsListCurSel'
			,'_setMyGemsListTipCaller'
			,'_onGetMyGemsListTip'
			,'_onGetWillGemTip'
			,'_onGetLowGemsTip'
			,'_onClickGemClassDropList'
			,'_onClickMyGemsList'
			,'_onClickCombineLevelList'
			,'_onClickCombineGem'
			,'_onClickCombineGems'
			,'_onClickBuyGem'
			,'_onItemChanged'
			,'_onItemOpSvrCmd'
			,'_doBatchCombineGems'
			,'_doCommCombineGems'
			,'_getWillGem'
			,'_getLowGemByIdx'
			,'_getLowGemResId'
			,'_reselectCombineLevelList'
			,'_calcCanSelMaxCombineLevel'
			,'_getCurNeedLowGemNumber'
			,'_getNeedLowGemNumber'
			,'_getLowGemNumber'
			,'_checkCombineLevelListItem'
			,'_getCombineLevel'
			,'_clearWillGem'
			,'_clearLowGemList'
			,'_updateWillGem'
			,'_updateLowGemList'
			,'_getNextLevelGemResId'
			,'_getCurSelGem'
			,'_clearCombineLevelListAllCheck'
			]
	}
	,{
		start:'//BesetGemOpPanel-unittest-start'
		,end:'//BesetGemOpPanel-unittest-end'
		,items:[
			'm_this'
			,'m_armList'
			,'m_gemPosIdx'
			,'_regEvents'
			,'_setCallers'
			,'_setCurArmTipCaller'
			,'_setCurArmGemsTipCaller'
			,'_onGetCurArmTip'
			,'_onGetCurArmGemsTip'
			,'_onItemChanged'
			,'_onItemOpSvrCmd'
			,'_onClickArmList'
			,'_onClickBuyGem'
			,'_onClickUpgradeGem'
			,'_onClickBesetGem'
			,'_onClickUnbesetAll'
			,'_onSelectBesetGem'
			,'_updateCurArm'
			,'_openSelectGemsDlg'
			,'_getArmGemResIdByIdx'
			,'_clearCurArm'
			,'_updateCurArmIcon'
			,'_updateCurArmGemsList'
			,'_toggleBesetBtnsText'
			,'_toggleUnbesetAllBtnEnableState'
			,'_toggleUpgradeBtnsEnableState'
			,'_enableBesetBtnsEnableState'
			]
	}
	,{
		start:'//UpgradeGemDlg-unittest-start'
		,end:'//UpgradeGemDlg-unittest-end'
		,items:[
			'm_this'
			,'m_dlg'
			,'m_items'
			,'m_heroId'
			,'m_armId'
			,'m_gemPos'
			,'m_srcGemResId'
			,'m_srcGem'
			,'m_desGem'
			,'_initDlg'
			,'_openDlg'
			,'_initInfo'
			,'_setCallers'
			,'_setTipCallers'
			,'_createSrcGemItem'
			,'_createDesGemItem'
			,'_setSrcGemIconAndName'
			,'_setDesGemIconAndName'
			,'_setUpgradeBtnEnableState'
			,'_setCanOrNeedDescVisible'
			,'_createGemItem'
			,'_setGemIconAndName'
			,'_getNextLevelGemResId'
			,'_hasEnoughGems'
			,'_getNoEnoughGemsNumber'
			,'_onClickUpgrade'
			,'_onGetSrcGemTip'
			,'_onGetDesGemTip'
			]
	}
]);
	
TestCaseSysItemMaker = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};	
	
	this.test_make = function(){
		var itemres = {id:10001, effects:[{id:200},{id:201,pro:100,min:2,max:3},{id:202,pro:90,min:2,max:2},{id:203,pro:100,min:3,max:3,unit:1},{id:ATTR.JIN_SKILL_LEVEL,pro:50,min:2,max:3},{id:ATTR.MU_SKILL_LEVEL,pro:50,min:2,max:3}]};
		var item = SysItemMaker.make(1, itemres);
		assert ( item.resid, 10001 );
		assert ( item.id, 1 );
			
		var cnt = 0;
		for ( var k in item.attrs ) {
			cnt++;
		}
		assert ( cnt == 2 );
		assert ( item.attrs[ ARM_EFF_MAP_ATTR[201] ].val == '2' );
		assert ( item.attrs[ ARM_EFF_MAP_ATTR[201] ].u == 0 );
		assert ( item.attrs[ ARM_EFF_MAP_ATTR[203] ].val == 3 );
		assert ( item.attrs[ ARM_EFF_MAP_ATTR[203] ].u == 1 );
		assertEQ ( item.appendDesc, rstr.comm.proget + '金系技能等级 木系技能等级 ');
		
		
		var itemres = {id:10001, effects:[{id:200},{id:201,pro:100,min:2,max:3},{id:202,pro:90,min:2,max:2},{id:203,pro:100,min:3,max:3,unit:1}]};
		var item = SysItemMaker.make(1, itemres);
		assertEQ ( item.appendDesc, '' );
	};
});

TestCaseGemUtil = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_isMaxLevelGem = function(){
		var g_findItemresRt = [{gemLevel:1}];
		this.mm.mock(ItemResUtil, 'findItemres', g_findItemresRt );
		assert ( GemUtil.isMaxGemLevel(1001) == false );
		assertListEQ ( this.mm.params['findItemres'], [1001] );
		
		g_findItemresRt[0] = {gemLevel:res_max_gem_level};
		assert ( GemUtil.isMaxGemLevel(1001) == true );
		
		g_findItemresRt[0] = {gemLevel:res_max_gem_level+1};
		assert ( GemUtil.isMaxGemLevel(1001) == true );
	};
});

TestCaseArmOpDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = ArmOpDlg.snew(this.g);
		m_this = null;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assert ( this.dlg.lc().m_g == this.g );
		assert ( this.dlg.lc().m_this == this.dlg );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.dlg.lc(), '_initDlg' );
		this.mm.mock(this.dlg.lc(), '_openDlg' );
		this.mm.mock(this.dlg.lc(), '_initInfo' );
		this.dlg.openDlg(1);
		assert ( this.mm.walkLog == '_initDlg,_openDlg,_initInfo');
		assertListEQ ( this.mm.params['_initInfo'], [1] );
	};
	
	this.test_isShow = function(){
		assert ( this.dlg.isShow() == false );
		this.dlg.openDlg(0);
		assert ( this.dlg.isShow() == true );
	};
	
	this.test__initDlg = function(){
		this.mm.mock(this.g.getGUI(), 'initDlg' );
		this.mm.mock(this.dlg.lc(), '_initTabsText' );
		this.mm.mock(this.dlg.lc(), '_createOpPanels' );
		this.dlg.lc()._initDlg();
		assert ( this.mm.walkLog == 'initDlg,_initTabsText,_createOpPanels' );
		assertListEQ ( this.mm.params['initDlg'], [this.dlg.lc().m_dlg, uicfg.armopdlg, this.dlg.lc().m_items] );
		
		this.mm.clear();
		this.dlg.lc()._initDlg();
		assert ( this.mm.walkLog == '', 'only init one time' );
	};
	
	this.test__openDlg = function(){
		this.dlg.lc()._initDlg();
	
		this.mm.mock(this.dlg.lc().m_dlg, 'show' );
		this.dlg.lc()._openDlg(0);
		assert ( this.mm.walkLog == 'show' );
	};
	
	this.test__initInfo = function(){
		this.dlg.lc()._initDlg();
		this.mm.mock(this.dlg.lc(), '_updatePanels');
		this.dlg.lc()._initInfo(1);
		assert ( this.dlg.lc().m_items.tabList.getActiveTab() == 1 );
		assert ( this.mm.walkLog == '_updatePanels' );
	};
	
	this.test__updatePanels = function(){
		this.dlg.lc()._initDlg();
		
		this.mm.mock(this.dlg.lc().m_panels[0], 'update');
		this.mm.mock(this.dlg.lc().m_panels[1], 'update');
		this.mm.mock(this.dlg.lc().m_panels[2], 'update');
		this.mm.mock(this.dlg.lc().m_panels[3], 'update');
		this.mm.mock(this.dlg.lc().m_panels[4], 'update');
		this.dlg.lc()._updatePanels();
		assert ( this.mm.walkLog == 'update,update,update,update,update' );
	};
	
	this.test__initTabsTexts = function(){
		this.dlg.lc()._initDlg();
		this.dlg.lc()._initTabsText();
		assert ( this.dlg.lc().m_items.tabList.getTabCount() == 5 );
		assert ( this.dlg.lc().m_items.tabList.getTabText(0) == rstr.armopdlg.tabs[0] );
		assert ( this.dlg.lc().m_items.tabList.getTabText(1) == rstr.armopdlg.tabs[1] );
		assert ( this.dlg.lc().m_items.tabList.getTabText(2) == rstr.armopdlg.tabs[2] );
		assert ( this.dlg.lc().m_items.tabList.getTabText(3) == rstr.armopdlg.tabs[3] );
		assert ( this.dlg.lc().m_items.tabList.getTabText(4) == rstr.armopdlg.tabs[4] );
	};
	
	this.test__createOpPanels = function(){
		this.dlg.lc()._initDlg();
		
		this.dlg.lc()._createOpPanels();
		assert ( this.dlg.lc().m_panels.length == 5 );
		assert ( this.dlg.lc().m_panels[0] instanceof BuyArmOpPanel );
		assert ( this.dlg.lc().m_panels[1] instanceof SplitArmOpPanel );
		assert ( this.dlg.lc().m_panels[2] instanceof IntensifyArmOpPanel );
		assert ( this.dlg.lc().m_panels[3] instanceof CombineGemOpPanel );
		assert ( this.dlg.lc().m_panels[4] instanceof BesetGemOpPanel );
		
		assert ( this.dlg.lc().m_panels[0].g == this.g  );
		assert ( this.dlg.lc().m_panels[0].dlg == this.dlg  );
		assert ( this.dlg.lc().m_panels[0].items == this.dlg.lc().m_items.tabList.getTabItems(0) );
		assert ( this.dlg.lc().m_panels[1].g == this.g  );
		assert ( this.dlg.lc().m_panels[1].dlg == this.dlg  );
		assert ( this.dlg.lc().m_panels[1].items == this.dlg.lc().m_items.tabList.getTabItems(1) );
		assert ( this.dlg.lc().m_panels[2].g == this.g  );
		assert ( this.dlg.lc().m_panels[2].dlg == this.dlg  );
		assert ( this.dlg.lc().m_panels[2].items == this.dlg.lc().m_items.tabList.getTabItems(2) );
		assert ( this.dlg.lc().m_panels[3].g == this.g  );
		assert ( this.dlg.lc().m_panels[3].dlg == this.dlg  );
		assert ( this.dlg.lc().m_panels[3].items == this.dlg.lc().m_items.tabList.getTabItems(3) );
		assert ( this.dlg.lc().m_panels[4].g == this.g  );
		assert ( this.dlg.lc().m_panels[4].dlg == this.dlg  );
		assert ( this.dlg.lc().m_panels[4].items == this.dlg.lc().m_items.tabList.getTabItems(4) );
	};
});

TestCaseArmListWithHerosAndArmPos = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = ArmOpDlg.snew(this.g);
		this.dlg.openDlg(0);
		this.panel = this.dlg.lc().m_panels[2];	
		this.armList = this.panel.lc().m_armList;
		this.lc = this.armList.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_regEvents' );
		this.mm.mock(this.lc(), '_setCallers' );
		this.mm.mock(this.lc(), '_setArmPosDropList' );
		this.armList.init(this.g, this.panel, {});
		assert (this.mm.walkLog == '_regEvents,_setCallers,_setArmPosDropList' );
	};
	
	this.test_getCurSelArm = function(){
		this.armList.myArms = [];
		this.panel.items.armList.setItemCount(2);
		assert ( this.armList.getCurSelArm() == null );
		
		this.armList.myArms = [{flevel:1,itemres:{name:'name'}}, {flevel:2,gems:[1001], itemres:{name:'name2'}}];
		this.panel.items.armList.setCurSel(-1);
		assert ( this.armList.getCurSelArm() == null );
		this.panel.items.armList.setCurSel(0);
		assert ( this.armList.getCurSelArm() == this.armList.myArms[0] );
		assert ( this.armList.getCurSelArm().gems != null );
		assert ( this.armList.getCurSelArm().gems.length == 0 );
		
		this.panel.items.armList.setCurSel(1);
		assert ( this.armList.getCurSelArm() == this.armList.myArms[1] );
		assert ( this.armList.getCurSelArm().gems.length == 1 );
		assert ( this.armList.getCurSelArm().gems[0] == 1001 );
	};
	
	this.test_updateArmList = function(){
		var g_arms = [];
		this.mm.mock(this.lc(), '_filterMyArms', [g_arms] );
		this.mm.mock(this.panel, 'sortArms' );
		this.mm.mock(this.panel, 'setMyArmListItems' );
		this.mm.mock(this.lc(), '_resetArmListCurSel' );
		this.mm.mock(this.panel, 'setListTipCaller' );
		
		this.armList.updateArmList();

		assert ( this.mm.walkLog == '_filterMyArms,sortArms,setMyArmListItems,_resetArmListCurSel,setListTipCaller' )
		assert ( this.armList.myArms == g_arms );
		assertListEQ ( this.mm.params['sortArms'], [g_arms]);
		assertListEQ ( this.mm.params['setMyArmListItems'], [this.panel.items.armList, g_arms]);
		assertListEQ ( this.mm.params['setListTipCaller'], [this.panel.items.armList, this.armList.lc()._onGetMyArmListTip]);
	};	
	
	this.test_updateHeroList = function(){
		this.armList.items.heroDropList.setCurSel(-1);
		
		this.g.getImgr().getHeros().list = [{id:1,name:"name1",level:1},{id:2,name:"name2",level:2}];
		this.armList.updateHeroList();
		assert ( this.armList.items.heroDropList.getCount() == 3 );
		
		this.armList.updateHeroList();
		assert ( this.armList.items.heroDropList.getCount() == 3, 'before update, delete all items' );
		assert ( this.armList.items.heroDropList.getItemText(0) == rstr.comm.pkg );
		assert ( this.armList.items.heroDropList.getItemText(1) == 'name1' );
		assert ( this.armList.items.heroDropList.getItemText(2) == 'name2' );
		assert ( this.armList.items.heroDropList.getCurSel() == 1);
		
		this.armList.items.heroDropList.setCurSel(2);
		this.armList.updateHeroList();
		assert ( this.armList.items.heroDropList.getCurSel() == 2);
		
		this.g.getImgr().getHeros().list = [];
		this.armList.updateHeroList();
		assert ( this.armList.items.heroDropList.getCurSel() == 0 );
		
		this.armList.items.heroDropList.setCurSel(-1);
		this.armList.updateHeroList();
		assert ( this.armList.items.heroDropList.getCurSel() == 0 );
	};	
	
	this.test__getCurHeroId = function(){
		this.g.getImgr().getHeros().list = [{id:1, name:'hero1'}];
		this.armList.items.heroDropList.addItem({text:'hero1'});
		this.armList.items.heroDropList.setCurSel(0);
		
		assert ( this.armList.getCurHeroId() == 0 );
		
		this.armList.items.heroDropList.setCurSel(1);
		assert ( this.armList.getCurHeroId() == 1 );
	};
	
	this.test__regEvents = function(){
		this.mm.mock(this.g, 'regEvent');
		this.lc()._regEvents();
		assert ( this.mm.walkLog == 'regEvent' );
		assertListEQ ( this.mm.params['regEvent'], [EVT.HERO_UPDATE, 0, this.armList, this.lc()._onHeroUpdate] );
	};
	
	this.test__setCallers = function(){
		this.mm.mock( this.panel.items.armPosDropList, 'setCaller' );
		this.mm.mock( this.panel.items.heroDropList, 'setCaller' );
		this.lc()._setCallers();
		assert ( this.mm.walkLog == 'setCaller,setCaller' );
		assert ( this.mm.params['setCaller.0'][0].self == this.armList );
		assert ( this.mm.params['setCaller.0'][0].caller == this.lc()._onClickArmPosDropList );
		assert ( this.mm.params['setCaller.1'][0].self == this.armList );
		assert ( this.mm.params['setCaller.1'][0].caller == this.lc()._onClickHeroDropList );
	};	
	
	this.test__setArmPosDropList = function(){
		this.armList.items.armPosDropList.deleteAllItem();
		this.lc()._setArmPosDropList();
		assert ( this.armList.items.armPosDropList.getCurSel() == 0 );
		assert ( this.armList.items.armPosDropList.getCount() == rstr.armopdlg.intensifyarms.armPosName.length );
	};
	
	this.test__filterMyArms = function(){
		var g_armsByPos = [];
		var g_curSelfPkgOrHeroArms = [];
		var g_armPosFilter = new function() { this.filter = function(){} };
		this.mm.mock(g_armPosFilter, 'filter', [g_armsByPos]);
		this.mm.mock(CanIntensifyArmPosFilter, 'snew', [g_armPosFilter]);
		this.mm.mock(this.lc(), '_getCurArmPos', [1]);
		this.mm.mock(this.lc(), '_getCurSelPkgOrHeroWears', [g_curSelfPkgOrHeroArms]);
		
		assert ( this.lc()._filterMyArms() == g_armsByPos );
		assert ( this.mm.walkLog == 'snew,_getCurArmPos,_getCurSelPkgOrHeroWears,filter' );
		
		assertListEQ ( this.mm.params['snew'], [this.g] );
		assert( this.mm.params['filter'][0].armPos == 1 );
		assert( this.mm.params['filter'][0].items == g_curSelfPkgOrHeroArms );
	};	
	
	this.test__resetArmListCurSel = function(){
		this.armList.myArms = [{id:1,itemres:{name:'name1'}},{id:2,flevel:1,itemres:{name:'name2'}}]
		this.panel.setMyArmListItems(this.armList.items.armList, this.armList.myArms);
		
		this.lc()._resetArmListCurSel(0);
		assert ( this.panel.items.armList.getCurSel() == 0 );
		
		this.lc()._resetArmListCurSel(2);
		assert ( this.panel.items.armList.getCurSel() == 1 );
		
		this.lc()._resetArmListCurSel(1);
		assert ( this.panel.items.armList.getCurSel() == 0 );
	};
	
	this.test__onGetMyArmListTip = function(){
		this.mm.mock( TIPM, 'getItemDesc', ['desc'] );
		this.armList.myArms = [{}];
		assert ( this.armList.lc()._onGetMyArmListTip({idx:0}) == 'desc' );
		assert ( this.mm.params['getItemDesc'], [ this.armList.myArms[0] ] );		
	};
	
	this.test__onClickArmPosDropList = function(){
		this.mm.mock(this.armList, 'updateArmList');
		this.mm.mock(this.lc(), '_selectFirstArmInList');
		this.lc()._onClickArmPosDropList();
		assert ( this.mm.walkLog == 'updateArmList,_selectFirstArmInList' );
	};
	
	this.test__onClickHeroDropList = function(){
		this.mm.mock(this.armList, 'updateArmList');
		this.mm.mock(this.lc(), '_selectFirstArmInList');
		this.lc()._onClickHeroDropList();
		assert ( this.mm.walkLog == 'updateArmList,_selectFirstArmInList' );
	};
	
	this.test__onHeroUpdate = function(){
		this.dlg.lc().m_dlg.show();
		this.mm.mock(this.armList, 'updateArmList');
		this.lc()._onHeroUpdate();
		assert ( this.mm.walkLog == 'updateArmList' );
		
		this.mm.clear();
		this.dlg.lc().m_dlg.hide();
		this.lc()._onHeroUpdate();
		assert ( this.mm.walkLog == '' );	
	};
	
	this.test__selectFirstArmInList = function(){
		this.armList.items.armList.setCurSel(-1);
		this.lc()._selectFirstArmInList();
		assert ( this.armList.items.armList.getCurSel() == 0 );
	};
	
	this.test__getCurArmPos = function(){
		this.armList.items.armPosDropList.setCurSel(1);
		assert ( this.lc()._getCurArmPos() == 1 );
		this.armList.items.armPosDropList.setCurSel(2);
		assert ( this.lc()._getCurArmPos() == 2 );
	};
	
	this.test__getCurSelPkgOrHeroWears = function(){
		var g_isSelectedPkgRt = [true];
		var g_getHeroByIdxRt = [];
		var g_isDetailHeroRt = [false];
		
		this.mm.mock(this.lc(), '_isSelectedPkg', g_isSelectedPkgRt);
		this.mm.mock(this.lc(), '_getCurHeroIdx', [1]);
		this.mm.mock(this.g.getImgr(), 'getHeroByIdx', g_getHeroByIdxRt);
		this.mm.mock(this.g.getImgr(), 'isDetailHero', g_isDetailHeroRt);
		this.mm.mock(HeroSender, 'sendGetDetail');
		assert ( this.lc()._getCurSelPkgOrHeroWears() == this.g.getImgr().getPkgs().items );
		assert ( this.mm.walkLog == '_isSelectedPkg' );
		
		this.mm.clear();
		g_isSelectedPkgRt[0] = false;
		assert ( this.lc()._getCurSelPkgOrHeroWears(false, 1).length == 0 );
		assert ( this.mm.walkLog == '_isSelectedPkg,_getCurHeroIdx,getHeroByIdx' );
		assertListEQ ( this.mm.params['getHeroByIdx'], [1] );
		
		this.mm.clear();
		g_getHeroByIdxRt[0] = {id:2, wears:{'1':{id:1},'2':{id:2},'3':null}};
		assert ( this.lc()._getCurSelPkgOrHeroWears().length == 0 );
		assert ( this.mm.walkLog == '_isSelectedPkg,_getCurHeroIdx,getHeroByIdx,isDetailHero,sendGetDetail' );
		assertListEQ ( this.mm.params['sendGetDetail'], [this.g, 2] );
		
		this.mm.clear();
		g_isDetailHeroRt[0] = true;
		var arms =  this.lc()._getCurSelPkgOrHeroWears();
		assert ( arms.length == 2 );
		assert ( arms[0].id == g_getHeroByIdxRt[0].wears[1].id );
		assert ( arms[1].id == g_getHeroByIdxRt[0].wears[2].id );
		assert ( this.mm.walkLog == '_isSelectedPkg,_getCurHeroIdx,getHeroByIdx,isDetailHero' );	
	};
	
	this.test__isSelectedPkg = function(){
		this.armList.items.heroDropList.addItem({text:'hero1'});
		this.armList.items.heroDropList.setCurSel(0);
		assert ( this.lc()._isSelectedPkg() == true );
		
		this.armList.items.heroDropList.setCurSel(-1);
		assert ( this.lc()._isSelectedPkg() == true );
		
		this.armList.items.heroDropList.setCurSel(1);
		assert ( this.lc()._isSelectedPkg() == false );
	};	
	
	this.test__getCurHeroIdx = function(){
		this.armList.items.heroDropList.addItem({text:'hero1'});
		this.armList.items.heroDropList.setCurSel(1);
		assert ( this.lc()._getCurHeroIdx() == 0 );
	};
});

TestCaseBaseArmOpPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		res_test_items = [{id:1001,smallpic:1001,level:1,gemLevel:1},{id:1002,smallpic:1002,level:2,gemLevel:2},{id:1003,smallpic:1003,level:3,gemLevel:3}];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sortArms = function(){
		var myArms = [
			{id:1,flevel:6,itemres:{apos:1,level:4}}
			,{id:2,flevel:6,itemres:{apos:2,level:4}}
			,{id:3,flevel:6,itemres:{apos:3,level:5}}
			,{id:4,flevel:5,itemres:{apos:1,level:10}}
			,{id:5,itemres:{apos:3,level:1}}
			];
			
		BaseArmOpPanel.snew().sortArms(myArms);

		assert ( myArms[0].id == 3 )
		assert ( myArms[1].id == 1 )
		assert ( myArms[2].id == 2 )
		assert ( myArms[3].id == 4 )
		assert ( myArms[4].id == 5 )
	};
	
	this.test_setMyArmListItems = function(){
		this.dlg = ArmOpDlg.snew(this.g);
		this.dlg.openDlg(0);
		for ( var i=1; i<=2; ++i ) {
			var panel = this.dlg.lc().m_panels[i];
			
			var myArms = [{id:1,itemres:{name:'name1'}},{id:2,flevel:1,itemres:{name:'name2'}}]
			
			panel.setMyArmListItems(panel.items.armList, myArms);
			assert ( panel.items.armList.getCount() == 2 );
			assert ( TQ.getTextEx(panel.items.armList.getItem(0).exsubs.name) == ItemNameColorGetter.getColorVal(1,'name1') );
			assert ( TQ.getTextEx(panel.items.armList.getItem(0).exsubs.levelOrNumber) == '' );
			assert ( TQ.getTextEx(panel.items.armList.getItem(1).exsubs.name) == ItemNameColorGetter.getColorVal(1,'name2') );
			assert ( TQ.getTextEx(panel.items.armList.getItem(1).exsubs.levelOrNumber) == TQ.format(rstr.armopdlg.splitarms.lbl.flevel, 1) );
			
			myArms = []
			panel.setMyArmListItems(panel.items.armList, myArms);
			assert ( panel.items.armList.getCount() == 0 );
		}
		
		if ( true ) {
			var panel = this.dlg.lc().m_panels[4];
			
			var myArms = [{id:1,gems:[1001,1002,1003], itemres:{name:'name1'}}
				,{id:2,flevel:1,itemres:{name:'name2'}}
				,{id:3,gems:[1001,1002],flevel:2,itemres:{name:'name3'}}]
			
			panel.setMyArmListItems(panel.items.armList, myArms);
			assert ( panel.items.armList.getCount() == 3 );
			assert ( TQ.getTextEx(panel.items.armList.getItem(0).exsubs.name) == ItemNameColorGetter.getColorVal(1,'name1') );
			assert ( TQ.getTextEx(panel.items.armList.getItem(0).exsubs.gem1) == '1' );
			assert ( TQ.getTextEx(panel.items.armList.getItem(0).exsubs.gem2) == '2' );
			assert ( TQ.getTextEx(panel.items.armList.getItem(0).exsubs.gem3) == '3' );
			assert ( isInclude(IMG.getBKImage(panel.items.armList.getItem(0).exsubs.gem1), '1001.gif') == true );
			assert ( isInclude(IMG.getBKImage(panel.items.armList.getItem(0).exsubs.gem2), '1002.gif') == true );
			assert ( isInclude(IMG.getBKImage(panel.items.armList.getItem(0).exsubs.gem3), '1003.gif') == true );
			
			assert ( TQ.getTextEx(panel.items.armList.getItem(1).exsubs.name) == ItemNameColorGetter.getColorVal(1,'name2') );
			assert ( TQ.getTextEx(panel.items.armList.getItem(1).exsubs.gem1) == '' );
			assert ( TQ.getTextEx(panel.items.armList.getItem(1).exsubs.gem2) == '' );
			assert ( TQ.getTextEx(panel.items.armList.getItem(1).exsubs.gem3) == '' );
			assert ( IMG.getBKImage(panel.items.armList.getItem(1).exsubs.gem1) == "url('')" );
			assert ( IMG.getBKImage(panel.items.armList.getItem(1).exsubs.gem2) == "url('')" );
			assert ( IMG.getBKImage(panel.items.armList.getItem(1).exsubs.gem3) == "url('')" );
			
			assert ( TQ.getTextEx(panel.items.armList.getItem(2).exsubs.name) == ItemNameColorGetter.getColorVal(1,'name3') );
			assert ( TQ.getTextEx(panel.items.armList.getItem(2).exsubs.gem1) == '1' );
			assert ( TQ.getTextEx(panel.items.armList.getItem(2).exsubs.gem2) == '2' );
			assert ( TQ.getTextEx(panel.items.armList.getItem(2).exsubs.gem3) == '' );
			assert ( isInclude(IMG.getBKImage(panel.items.armList.getItem(2).exsubs.gem1), '1001.gif') == true );
			assert ( isInclude(IMG.getBKImage(panel.items.armList.getItem(2).exsubs.gem2), '1002.gif') == true );
			assert ( IMG.getBKImage(panel.items.armList.getItem(2).exsubs.gem3) == "url('')" );
			
			myArms = []
			panel.setMyArmListItems(panel.items.armList, myArms);
			assert ( panel.items.armList.getCount() == 0 );
		}
	};
});

TestCaseBuyArmOpPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		res_items_ex = [
			{id:1, bigpic:1001,  level:2, apos:2}
			,{id:2, bigpic:1002, level:1, apos:2}
			,{id:3, bigpic:1003, level:3, apos:2}
			,{id:4, bigpic:1004, level:3, apos:1}
			,{'bigpic':3000034,'targets':[28],'desc':'强化装备所需的低劣材料，分解白装获得','name':'白色精华','level':1,'id':3000034,'pile':99}
			,{'bigpic':3000035,'targets':[28],'desc':'强化装备所需的普通材料，分解绿装获得','name':'绿色精华','level':2,'id':3000035,'pile':99}
			,{'bigpic':3000036,'targets':[28],'desc':'强化装备所需的优质材料，分解蓝装获得','name':'蓝色精华','level':3,'id':3000036,'pile':99}
			,{'bigpic':3000037,'targets':[28],'desc':'强化装备所需的上好材料，分解紫装获得','name':'紫色精华','level':4,'id':3000037,'pile':99}
			,{'bigpic':3000038,'targets':[28],'desc':'强化装备所需的完美材料，分解橙装获得','name':'金色精华','level':5,'id':3000038,'pile':99}				
			,{'bigpic':3000034,'isbind':1,'targets':[28],'desc':'强化装备所需的低劣材料，分解白装获得','name':'白色精华(赠)','level':1,'id':3000153,'pile':99,'nobindid':3000034}
			,{'bigpic':3000035,'isbind':1,'targets':[28],'desc':'强化装备所需的普通材料，分解绿装获得','name':'绿色精华(赠)','level':2,'id':3000154,'pile':99,'nobindid':3000035}
			,{'bigpic':3000036,'isbind':1,'targets':[28],'desc':'强化装备所需的优质材料，分解蓝装获得','name':'蓝色精华(赠)','level':3,'id':3000155,'pile':99,'nobindid':3000036}
			,{'bigpic':3000037,'isbind':1,'targets':[28],'desc':'强化装备所需的上好材料，分解紫装获得','name':'紫色精华(赠)','level':4,'id':3000156,'pile':99,'nobindid':3000037}
			,{'bigpic':3000038,'isbind':1,'targets':[28],'desc':'强化装备所需的完美材料，分解橙装获得','name':'金色精华(赠)','level':5,'id':3000157,'pile':99,'nobindid':3000038}
			];
		res_smithy_salelist = [
				{id:1, level:1, sitemIds:'1,2', items:[{resid:2,itemres:res_items_ex[1]},{resid:1,itemres:res_items_ex[0]}] }
				,{id:2, level:2, sitemIds:'1,2,3' }
			];
		
		this.dlg = ArmOpDlg.snew(this.g);
		this.dlg.openDlg(0);
		this.panel = this.dlg.lc().m_panels[0];
		this.lc = this.panel.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_initPanel = function(){
		this.mm.mock(this.lc(), '_regEvents');
		this.mm.mock(this.lc(), '_setCallers');
		this.panel.initPanel();
		assert ( this.mm.walkLog == '_regEvents,_setCallers' );
	};
	
	this.test_update = function(){
		this.mm.mock(this.lc(), '_updateSaleList');
		this.mm.mock(this.lc(), '_updateMyItemList');
		this.panel.update();
		assert ( this.mm.walkLog == '_updateSaleList,_updateMyItemList' );
	};
	
	this.test_saleListHasTooltips = function(){
		this.panel.items.saleList.setItemCount(1);
		assert ( this.panel.items.saleList.getItem(0).exsubs.tooltips != null );
		assert ( this.panel.items.saleList.getItem(0).exsubs.tooltips['$item'] != null );
	};

	this.test_myItemListHasTooltips = function(){
		this.panel.items.myItemList.setItemCount(1);
		assert ( this.panel.items.myItemList.getItem(0).exsubs.tooltips != null );
		assert ( this.panel.items.myItemList.getItem(0).exsubs.tooltips['$item'] != null );
	};		
	
	this.test__regEvents = function(){
		this.mm.mock(this.g, 'regEvent');
		this.lc()._regEvents();
		assert ( this.mm.walkLog == 'regEvent' );
		assertListEQ ( this.mm.params['regEvent'], [EVT.PKG_CHANGE, 0, this.panel, this.lc()._onItemChanged] );
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.panel.items.saleList, 'setCaller');
		this.mm.mock(this.panel.items.myItemList, 'setCaller');
		this.lc()._setCallers();
		assert ( this.mm.walkLog == 'setCaller,setCaller' );
		assert ( this.mm.params['setCaller.0'][0].self == this.panel );
		assert ( this.mm.params['setCaller.0'][0].caller == this.lc()._onClickSaleList );
		assert ( this.mm.params['setCaller.1'][0].self == this.panel );
		assert ( this.mm.params['setCaller.1'][0].caller == this.lc()._onClickMyItemList );
	};
	
	this.test__updateSaleList = function(){
		this.mm.mock( this.lc(), '_setSaleListItems' );
		this.mm.mock( this.lc(), '_setSaleListTipCaller' );
		this.lc()._updateSaleList();
		assert ( this.mm.walkLog == '_setSaleListItems,_setSaleListTipCaller' );
	};	
	
	this.test__updateMyItemList = function(){
		this.mm.mock( this.lc(), '_setMyItemListItems' );
		this.mm.mock( this.lc(), '_setMyItemListCaller' );
		this.lc()._updateMyItemList();
		assert ( this.mm.walkLog == '_setMyItemListItems,_setMyItemListCaller' );
	};	
	
	this.test__setSaleListItems = function(){
		var mm = MethodMock.snew();
		mm.mock(this.lc(), '_createResSaleItemIds', function(res){
			res.items = [{resid:3,itemres:res_items_ex[2]},{resid:2,itemres:res_items_ex[1]},{resid:1,itemres:res_items_ex[0]}]; });
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.SMITHY, level:2}] });
		this.lc()._setSaleListItems();
		assert ( this.panel.items.saleList.getCount() == 3 );
		mm.restore();
		
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.SMITHY, level:3}] });
		this.lc()._setSaleListItems();
		assert ( this.panel.items.saleList.getCount() == 0 );
		
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.SMITHY, level:1}] });
		this.lc()._setSaleListItems();
		assert ( this.panel.items.saleList.getCount() == 2 );
		assert ( isInclude(IMG.getBKImage(this.panel.items.saleList.getItem(0).exsubs.icon), '1002.gif') );
		assert ( isInclude(IMG.getBKImage(this.panel.items.saleList.getItem(1).exsubs.icon), '1001.gif') );
	};
	
	this.test__setMyItemListItems = function(){
		this.g.getImgr().getPkgs().items = [{id:1,itemres:{salePrice:0}},{id:2,itemres:{salePrice:1,bigpic:1001}}];
		this.lc()._setMyItemListItems();
		assert ( this.panel.items.myItemList.getCount() == 1 );
		assert ( isInclude(IMG.getBKImage(this.panel.items.myItemList.getItem(0).exsubs.icon), '1001.gif') );
		
		this.g.getImgr().getPkgs().items = [];
		this.lc()._setMyItemListItems();
		assert ( this.panel.items.myItemList.getCount() == 0 );
	};
	
	this.test__setSaleListTipCaller = function(){
		this.panel.items.saleList.setItemCount(2);
		this.mm.mock( TTIP, 'setCallerData' );
		this.lc()._setSaleListTipCaller();
		assert( this.mm.walkLog == 'setCallerData,setCallerData' );
		
		assert( this.mm.params['setCallerData.0'][0] == this.panel.items.saleList.getItem(0).exsubs.tooltips[TIP_PREFIX + 'item'] );
		assert( this.mm.params['setCallerData.0'][1].self == this.panel );
		assert( this.mm.params['setCallerData.0'][1].caller == this.lc()._onGetSaleListTip );
		assert( this.mm.params['setCallerData.0'][2].idx == 0 );
		
		assert( this.mm.params['setCallerData.1'][0] == this.panel.items.saleList.getItem(1).exsubs.tooltips[TIP_PREFIX + 'item'] );
		assert( this.mm.params['setCallerData.1'][2].idx == 1 );
	};
	
	this.test__setMyItemListCaller = function(){
		this.panel.items.myItemList.setItemCount(2);
		this.mm.mock( TTIP, 'setCallerData' );
		this.lc()._setMyItemListCaller();
		assert( this.mm.walkLog == 'setCallerData,setCallerData' );
		
		assert( this.mm.params['setCallerData.0'][0] == this.panel.items.myItemList.getItem(0).exsubs.tooltips[TIP_PREFIX + 'item'] );
		assert( this.mm.params['setCallerData.0'][1].self == this.panel );
		assert( this.mm.params['setCallerData.0'][1].caller == this.lc()._onGetMyItemListTip );
		assert( this.mm.params['setCallerData.0'][2].idx == 0 );
		
		assert( this.mm.params['setCallerData.1'][0] == this.panel.items.myItemList.getItem(1).exsubs.tooltips[TIP_PREFIX + 'item'] );
		assert( this.mm.params['setCallerData.1'][2].idx == 1 );
	};
	
	this.test__onGetSaleListTip = function(){
		this.mm.mock( TIPM, 'getItemDesc', ['desc'] );
		this.lc().m_saleItems = [{}];
		assert ( this.lc()._onGetSaleListTip({idx:0}) == 'desc' );
		assert ( this.mm.params['getItemDesc'], [ this.lc().m_saleItems[0] ] );
	};
	
	this.test__onGetMyItemListTip = function(){
		this.mm.mock( TIPM, 'getItemDesc', ['desc'] );
		this.lc().m_myCanSaleItems = [{}];
		assert ( this.lc()._onGetMyItemListTip({idx:0}) == 'desc' );
		assert ( this.mm.params['getItemDesc'], [ this.lc().m_myCanSaleItems[0] ] );
	};
	
	this.test__onItemChanged = function(){
		this.dlg.lc().m_dlg.show();
		this.mm.mock(this.lc(), '_updateMyItemList');
		this.lc()._onItemChanged();
		assert ( this.mm.walkLog == '_updateMyItemList' );
		
		this.mm.clear();
		this.dlg.lc().m_dlg.hide();
		this.lc()._onItemChanged();
		assert ( this.mm.walkLog == '' );
	};
	
	this.test__onClickSaleList = function(){
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.SMITHY, level:1}] });
		this.lc()._updateSaleList();
		
		var buyItem = MockDialog.snew(this.g);
		UIM.regDlg('buyitem', buyItem);
		this.mm.mock(buyItem, 'openDlg')
		
		this.mm.clear();
		this.lc()._onClickSaleList(null, 0);
		assert ( this.mm.walkLog == 'openDlg' );
		assert ( this.mm.params['openDlg'][0].id == 0 );
		assert ( this.mm.params['openDlg'][0].resid == 2 );
		assert ( this.mm.params['openDlg'][0].number == 10000 );
		
		this.mm.clear();
		this.lc()._onClickSaleList(null, 1);
		assert ( this.mm.walkLog == 'openDlg' );
		assert ( this.mm.params['openDlg'][0].id == 0 );
		assert ( this.mm.params['openDlg'][0].resid == 1 );
		assert ( this.mm.params['openDlg'][0].number == 10000 );

		this.mm.clear();
		this.lc()._onClickSaleList(null, 2);
		assert ( this.mm.walkLog == '' );
	};
	
	this.test__onClickMyItemList = function(){
		this.g.getImgr().getPkgs().items = [{id:1,itemres:{salePrice:0}},{id:2,itemres:{name:'item2', level:2, salePrice:1,bigpic:1001}}];
		this.lc()._updateMyItemList();
		
		this.mm.mock(ShopSender, 'sendSaleItem');
		
		this.lc()._onClickMyItemList(null, 0);
		assert(this.g.getGUI().isShowMsgBox() == true);
		var name = ItemNameColorGetter.getColorVal(2, 'item2');
		assert(this.g.getGUI().getMsgBoxMsg() == TQ.format(rstr.armopdlg.buyarms.lbl.saleMyItem, name, 1) );
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assert ( this.mm.walkLog == '' );
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assert ( this.mm.walkLog == 'sendSaleItem' );
		assertListEQ ( this.mm.params['sendSaleItem'], [this.g, this.lc().m_myCanSaleItems[0] ] );
		
		this.mm.clear();
		this.lc()._onClickMyItemList(null, 1);
		assert ( this.mm.walkLog == '' );
	};
	
	this.test__createResSaleItemIds = function(){
		var res = {sitemIds:'1,2,3,4,'};
		this.lc()._createResSaleItemIds(res);
		assert ( res.items.length == 4 );
		assert ( res.items[0].resid == 4 );
		assert ( res.items[0].isBind == 1 );
		assert ( res.items[0].itemres == ItemResUtil.findItemres(4) );
		assert ( res.items[1].resid == 3 );
		assert ( res.items[1].isBind == 1 );
		assert ( res.items[1].itemres == ItemResUtil.findItemres(3) );
		assert ( res.items[2].resid == 1 );
		assert ( res.items[2].isBind == 1 );
		assert ( res.items[2].itemres == ItemResUtil.findItemres(1) );
		assert ( res.items[3].resid == 2 );
		assert ( res.items[3].isBind == 1 );
		assert ( res.items[3].itemres == ItemResUtil.findItemres(2) );
		
		var res = {sitemIds:'1'};
		this.lc()._createResSaleItemIds(res);
		assert ( res.items.length == 1 );
		assert ( res.items[0].resid == 1 );
		assert ( res.items[0].itemres == ItemResUtil.findItemres(1) );
	};
	
	this.test__createSaleItems = function(){
		var res = {sitemIds:'1,2'};
		this.lc()._createResSaleItemIds(res);

		var g_item = {id:0, attrs:{'1':{val:1,u:0},'2':{val:2,u:0}}};
		this.mm.mock(SysItemMaker, 'make', [g_item] );
		this.lc()._createSaleItems(res.items);
		assert ( this.mm.walkLog == 'make,make' );
		assertListEQ ( this.mm.params['make.0'], [1, res.items[0].itemres] );
		assertListEQ ( this.mm.params['make.1'], [2, res.items[1].itemres] );
		assert ( this.lc().m_saleItems.length == 2 );
		assert ( this.lc().m_saleItems[0] == g_item );
		assert ( this.lc().m_saleItems[1] == g_item );
	};
	

});

TestCaseSplitArmOpPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		this.dlg = ArmOpDlg.snew(this.g);
		this.dlg.openDlg(0);
		this.panel = this.dlg.lc().m_panels[1];
		this.lc = this.panel.lc;
		
		res_items = [
			{id:1, bigpic:1001,  level:2, apos:2, name:'name1'}
			,{id:2, bigpic:1002, level:1, apos:2, name:'name2'}
			,{id:3, bigpic:1003, level:3, apos:2, name:'name3'}
			];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_initPanel = function(){
		this.mm.mock(this.lc(), '_regEvents');
		this.mm.mock(this.lc(), '_setCallers');
		this.mm.mock(this.lc(), '_setArmLevelDropList');
		this.panel.initPanel();
		assert ( this.lc().m_this == this.panel );
		assert ( this.mm.walkLog == '_regEvents,_setCallers,_setArmLevelDropList' );
	};
	
	this.test_armListHasTooltips = function(){
		this.panel.items.armList.setItemCount(1);
		assert ( this.panel.items.armList.getItem(0).exsubs.tooltips != null );
		assert ( this.panel.items.armList.getItem(0).exsubs.tooltips['$item'] != null );
	};	
	
	this.test_essenceListHasTooltips = function(){
		this.panel.items.essenceList.setItemCount(1);
		assert ( this.panel.items.essenceList.getItem(0).exsubs.tooltips != null );
		assert ( this.panel.items.essenceList.getItem(0).exsubs.tooltips['$item'] != null );
	};	
	
	this.test_update = function(){
		this.mm.mock(this.lc(), '_updateMyArmList');
		this.mm.mock(this.lc(), '_updateMyEssenceList');
		this.panel.update();
		assert ( this.mm.walkLog == '_updateMyArmList,_updateMyEssenceList' );
	};
	
	this.test__updateMyArmList = function(){ // sort 
		this.mm.mock(this.lc(), '_filterMyArms' );
		this.mm.mock(this.panel, 'sortArms' );
		this.mm.mock(this.lc(), '_setMyArmListItems' );
		this.mm.mock(this.lc(), '_setMyArmListTipCaller' );
		
		this.lc()._updateMyArmList();
		assert ( this.mm.walkLog == '_filterMyArms,sortArms,_setMyArmListItems,_setMyArmListTipCaller' );
		assertListEQ ( this.mm.params['sortArms'], [this.panel.myArms]);
	};
	
	this.test__filterMyArms = function(){
		this.panel.items.armLevelDropList.setCurSel(0);
		this.g.getImgr().getPkgs().items = [{id:1,itemres:{level:1,decomposeGet:0}},{id:2,itemres:{level:2,decomposeGet:1}},{id:3,itemres:{level:3,decomposeGet:1}}];
		this.lc()._filterMyArms();
		assert ( this.panel.myArms.length == 2 );
		assert ( this.panel.myArms[0].id == 2 );
		assert ( this.panel.myArms[1].id == 3 );
			
		this.panel.items.armLevelDropList.setCurSel(2);
		this.lc()._filterMyArms();
		assert ( this.panel.myArms.length == 1 );
		assert ( this.panel.myArms[0].id == 2 );
			
		this.panel.items.armLevelDropList.setCurSel(4);
		this.lc()._filterMyArms();
		assert ( this.panel.myArms.length == 0 );
	};
	
	this.test__setMyArmListItems = function(){
		this.mm.mock(this.panel, 'setMyArmListItems');
		this.lc()._setMyArmListItems();
		assert ( this.mm.walkLog == 'setMyArmListItems' );
		assertListEQ ( this.mm.params['setMyArmListItems'], [this.panel.items.armList, this.panel.myArms] );
	};
	
	this.test__setArmLevelDropList = function(){
		this.panel.items.armLevelDropList.deleteAllItem();
		this.lc()._setArmLevelDropList();
		assert ( this.panel.items.armLevelDropList.getCurSel() == 0 );
		assert ( this.panel.items.armLevelDropList.getCount() == rstr.armopdlg.splitarms.itemLevels.length );
	};	
	
	this.test__setMyArmListTipCaller = function(){
		this.panel.items.armList.setItemCount(2);
		this.mm.mock( TTIP, 'setCallerData' );
		this.lc()._setMyArmListTipCaller();
		assert( this.mm.walkLog == 'setCallerData,setCallerData' );
		
		assert( this.mm.params['setCallerData.0'][0] == this.panel.items.armList.getItem(0).exsubs.tooltips[TIP_PREFIX + 'item'] );
		assert( this.mm.params['setCallerData.0'][1].self == this.panel );
		assert( this.mm.params['setCallerData.0'][1].caller == this.lc()._onGetMyArmListTip );
		assert( this.mm.params['setCallerData.0'][2].idx == 0 );
		
		assert( this.mm.params['setCallerData.1'][0] == this.panel.items.armList.getItem(1).exsubs.tooltips[TIP_PREFIX + 'item'] );
		assert( this.mm.params['setCallerData.1'][2].idx == 1 );
	};
	
	this.test__setMyEssenceListTipCaller = function(){
		this.panel.items.essenceList.setItemCount(2);
		this.mm.mock( TTIP, 'setCallerData' );
		this.lc()._setMyEssenceListTipCaller();
		assert( this.mm.walkLog == 'setCallerData,setCallerData' );
		
		assert( this.mm.params['setCallerData.0'][0] == this.panel.items.essenceList.getItem(0).exsubs.tooltips[TIP_PREFIX + 'item'] );
		assert( this.mm.params['setCallerData.0'][1].self == this.panel );
		assert( this.mm.params['setCallerData.0'][1].caller == this.lc()._onGetEssenceListTip );
		assert( this.mm.params['setCallerData.0'][2].idx == 0 );
		
		assert( this.mm.params['setCallerData.1'][0] == this.panel.items.essenceList.getItem(1).exsubs.tooltips[TIP_PREFIX + 'item'] );
		assert( this.mm.params['setCallerData.1'][2].idx == 1 );
	};
	
	this.test__onGetMyArmListTip = function(){
		this.mm.mock( TIPM, 'getItemDesc', ['desc'] );
		this.panel.myArms = [{}];
		assert ( this.lc()._onGetMyArmListTip({idx:0}) == 'desc' );
		assert ( this.mm.params['getItemDesc'], [ this.panel.myArms[0] ] );		
	};
	
	this.test__onGetEssenceListTip = function(){
		this.mm.mock( TIPM, 'getItemDesc', ['desc'] );
		this.lc().m_essences = [{}];
		assert ( this.lc()._onGetEssenceListTip({idx:0}) == 'desc' );
		assert ( this.mm.params['getItemDesc'], [ this.lc().m_essences[0] ] );	
	};
	
	this.test__regEvents = function(){
		this.mm.mock(this.g, 'regEvent');
		this.lc()._regEvents();
		assert ( this.mm.walkLog == 'regEvent,regEvent' );
		assertListEQ ( this.mm.params['regEvent.0'], [EVT.PKG_CHANGE, 0, this.panel, this.lc()._onItemChanged] );
		assertListEQ ( this.mm.params['regEvent.1'], [EVT.NET, NETCMD.ITEMOP, this.panel, this.lc()._onItemOpSvrCmd] );
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.panel.items.selectAll, 'setCaller');
		this.mm.mock(this.panel.items.armLevelDropList, 'setCaller');
		this.mm.mock(this.panel.items.armList, 'setCaller');
		this.mm.mock(this.panel.items.splitBtn, 'setCaller');
		this.lc()._setCallers();
		assert ( this.mm.walkLog == 'setCaller,setCaller,setCaller,setCaller' );
		assert ( this.mm.params['setCaller.0'][0].self == this.panel );
		assert ( this.mm.params['setCaller.0'][0].caller == this.lc()._onClickSelectAll );
		assert ( this.mm.params['setCaller.1'][0].self == this.panel );
		assert ( this.mm.params['setCaller.1'][0].caller == this.lc()._onClickArmLevelDropList );
		assert ( this.mm.params['setCaller.2'][0].self == this.panel );
		assert ( this.mm.params['setCaller.2'][0].caller == this.lc()._onClickArmList );
		assert ( this.mm.params['setCaller.3'][0].self == this.panel );
		assert ( this.mm.params['setCaller.3'][0].caller == this.lc()._onClickSplitBtn );
	};
	
	this.test__updateMyEssenceList = function(){
		this.mm.mock(this.lc(),  '_setMyEssenceListItems' );
		this.mm.mock(this.lc(),  '_setMyEssenceListTipCaller' );
		this.lc()._updateMyEssenceList();
		assert ( this.mm.walkLog == '_setMyEssenceListItems,_setMyEssenceListTipCaller' );
	};
	
	this.test__setMyEssenceListItems = function(){
		var g_items = [{},{}];
		this.mm.mock(this.lc(),  '_getMyEssenceItems', [g_items] );
		this.mm.mock(CommDrawItem,  'drawIconAndNumber' );
		this.lc()._setMyEssenceListItems();
		assert ( this.mm.walkLog == '_getMyEssenceItems,drawIconAndNumber,drawIconAndNumber' );
		assert ( this.mm.params['drawIconAndNumber.0'], [this.lc().m_this.items.essenceList.getItem(0), g_items[0] ] );
		assert ( this.mm.params['drawIconAndNumber.1'], [this.lc().m_this.items.essenceList.getItem(1), g_items[1] ] );
	};
	
	this.test__getMyEssenceItems = function(){
		this.g.getImgr().getPkgs().items = [
			{id:1, number:1, resid:3000035, itemres:{}}
			,{id:2, number:2, resid:3000037, itemres:{}}
		];
		var items = this.lc()._getMyEssenceItems();
				
		assert ( items.length == 5 );
				
		assert ( items[0].number == 0 );
		assert ( items[0].resid == 3000034 );
		assert ( items[0].itemres.id == 3000034 );
				
		assert ( items[1].number == 1 );
		assert ( items[1].resid == 3000035 );
		assert ( items[1].itemres.id == 3000035 );
				
		assert ( items[2].number == 0 );
		assert ( items[2].resid == 3000036 );
		assert ( items[2].itemres.id == 3000036 );
				
		assert ( items[3].number == 2 );
		assert ( items[3].resid == 3000037 );
		assert ( items[3].itemres.id == 3000037 );
				
		assert ( items[4].number == 0 );
		assert ( items[4].resid == 3000038 );
		assert ( items[4].itemres.id == 3000038 );
	};
	
	this.test__onItemChanged = function(){
		this.dlg.lc().m_dlg.show();
		this.mm.mock(this.panel, 'update');
		this.lc()._onItemChanged();
		assert ( this.mm.walkLog == 'update' );
		
		this.mm.clear();
		this.dlg.lc().m_dlg.hide();
		this.lc()._onItemChanged();
		assert ( this.mm.walkLog == '' );
	};
	
	this.test__onItemOpSvrCmd = function(){
		this.mm.mock(TQ, 'setHtml');
		this.mm.mock(this.panel.items.result, 'refresh');
		this.mm.mock(this.panel.items.result, 'scrollEnd');
		
		var g_serverData = {data:{}};
		this.lc()._onItemOpSvrCmd(g_serverData);
		assert ( this.mm.walkLog == '' );
			
		g_serverData = {data:{splitResults:[{armResid:1, forceLevel:0, resid:2, number:3}] }};
		this.lc()._onItemOpSvrCmd(g_serverData);
		assert ( this.mm.walkLog == 'setHtml,refresh,scrollEnd' );
		var expectStr = TQ.format(rstr.armopdlg.splitarms.svr.splitResult, 'name1', 'name2', 3) ;
		assertListEQ ( this.mm.params['setHtml'], [ this.panel.items.result.getContainerObj(), expectStr] );
		
		this.mm.clear();
		g_serverData = {data:{splitResults:[{armResid:3, forceLevel:4, resid:FIXID.REFINESTONE, number:5}] }};
		this.lc()._onItemOpSvrCmd(g_serverData);
		assert ( this.mm.walkLog == 'setHtml,refresh,scrollEnd' );
		expectStr += TQ.format(rstr.armopdlg.splitarms.svr.returnResult, 4, 'name3', 5);
		assertListEQ ( this.mm.params['setHtml'], [ this.panel.items.result.getContainerObj(), expectStr] );
	};
	
	this.fillMyArmList = function(){
		this.panel.myArms = [{id:1,itemres:{name:'name1'}},{id:2,flevel:1,itemres:{name:'name2'}}]
		this.mm.mock(this.lc(), '_filterMyArms' );
		this.mm.mock(this.panel, 'sortArms' );
		this.lc()._updateMyArmList();
	};
	
	this.test__onClickSelectAll = function(){
		this.fillMyArmList();
		
		this.panel.items.selectAll.setCheck(1);
		this.lc()._onClickSelectAll(); // select all
		assert ( this.panel.items.armList.getItem(0).exsubs.sel.getCheck() == 1 );
		assert ( this.panel.items.armList.getItem(1).exsubs.sel.getCheck() == 1 );
		
		this.panel.items.selectAll.setCheck(0);
		this.lc()._onClickSelectAll(); // un select all
		assert ( this.panel.items.armList.getItem(0).exsubs.sel.getCheck() == 0 );
		assert ( this.panel.items.armList.getItem(1).exsubs.sel.getCheck() == 0 );
	};
	
	this.test__onClickArmLevelDropList = function(){
		this.mm.mock(this.lc(), '_updateMyArmList');
		this.mm.mock(this.lc(), '_unselectAllArms');
		this.lc()._onClickArmLevelDropList();
		assert ( this.mm.walkLog == '_updateMyArmList,_unselectAllArms' );
	};
	
	this.test__onClickArmList = function(){
		this.fillMyArmList();
		
		this.panel.items.armList.getItem(0).exsubs.sel.setCheck(1);
		this.lc()._onClickArmList(null, 100);
		assert ( this.panel.items.armList.getItem(0).exsubs.sel.getCheck() == 1);
		this.lc()._onClickArmList(null, -1);
		assert ( this.panel.items.armList.getItem(0).exsubs.sel.getCheck() == 1);
		
		this.lc()._onClickArmList(null, 0);
		assert ( this.panel.items.armList.getItem(0).exsubs.sel.getCheck() == 0);
		
		this.lc()._onClickArmList(null, 0);
		assert ( this.panel.items.armList.getItem(0).exsubs.sel.getCheck() == 1);
	};
	
	this.test__onClickSplitBtn = function(){
		this.fillMyArmList();
		
		this.mm.mock(ItemOpSender, 'sendDecomposeIds');
		this.mm.mock(this.lc(), '_unselectAllArms');
		
		this.panel.items.armList.getItem(0).exsubs.sel.setCheck(0);
		this.panel.items.armList.getItem(1).exsubs.sel.setCheck(0);
		this.lc()._onClickSplitBtn();
		assert ( TestCaseSysTip.eqSystipStr(rstr.ids[100025].msg) == true );
		
		this.mm.clear();
		TestCaseSysTip.clearTip();
		this.panel.items.armList.getItem(0).exsubs.sel.setCheck(1);
		this.lc()._onClickSplitBtn();
		assert ( TestCaseSysTip.hasSystip() == false );
		assert ( this.mm.walkLog == 'sendDecomposeIds,_unselectAllArms' );
		assert ( this.mm.params['sendDecomposeIds'][0] == this.g );
		assert ( this.mm.params['sendDecomposeIds'][1].length == 1 );
		assert ( this.mm.params['sendDecomposeIds'][1][0] == 1 );
		
		this.mm.clear();
		this.panel.items.armList.getItem(0).exsubs.sel.setCheck(1);
		this.panel.items.armList.getItem(1).exsubs.sel.setCheck(1);
		this.lc()._onClickSplitBtn();
		assert ( TestCaseSysTip.hasSystip() == false );
		assert ( this.mm.params['sendDecomposeIds'][0] == this.g );
		assert ( this.mm.params['sendDecomposeIds'][1].length == 2 );
		assert ( this.mm.params['sendDecomposeIds'][1][0] == 1 );
		assert ( this.mm.params['sendDecomposeIds'][1][1] == 2 );
	};
});

TestCaseIntensifyArmOpPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = ArmOpDlg.snew(this.g);
		this.dlg.openDlg(0);
		this.panel = this.dlg.lc().m_panels[2];
		this.lc = this.panel.lc;
		
		this.buyItemDlg = MockDialog.snew(this.g);
		UIM.regDlg('buyitem', this.buyItemDlg);
		this.buyItemListDlg = MockDialog.snew(this.g);
		UIM.regDlg('buyitemlist', this.buyItemListDlg);
		
		res_test_items = [{id:1,name:'name'}];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_initPanel = function(){
		this.mm.mock(this.lc(), '_regEvents');
		this.mm.mock(this.lc(), '_setCallers');
		this.mm.mock(this.lc(), '_setCurArmTipCaller');
		this.panel.initPanel();
		assert ( this.lc().m_this == this.panel );
		assert ( this.mm.walkLog == '_regEvents,_setCallers,_setCurArmTipCaller' );
	};
	
	this.test_armListHasTooltips = function(){
		this.panel.items.armList.setItemCount(1);
		assert ( this.panel.items.armList.getItem(0).exsubs.tooltips != null );
		assert ( this.panel.items.armList.getItem(0).exsubs.tooltips['$item'] != null );
	};
	
	this.test_update = function(){
		this.mm.mock(this.lc().m_armList, 'updateHeroList');
		this.mm.mock(this.lc().m_armList, 'updateArmList');
		this.mm.mock(this.lc(), '_updateMyHasMaterials');
		this.panel.update();
		assert ( this.mm.walkLog == 'updateHeroList,updateArmList,_updateMyHasMaterials' );
	};
	
	this.test__regEvents = function(){
		this.mm.mock(this.g, 'regEvent');
		this.lc()._regEvents();
		assert ( this.mm.walkLog == 'regEvent,regEvent' );
		assertListEQ ( this.mm.params['regEvent.0'], [EVT.PKG_CHANGE, 0, this.panel, this.lc()._onItemChanged] );
		assertListEQ ( this.mm.params['regEvent.1'], [EVT.NET, NETCMD.ITEMOP, this.panel, this.lc()._onItemOpSvrCmd] );
	};
	
	this.test__setCallers = function(){
		this.mm.mock( this.panel.items.armList, 'setCaller' );
		this.mm.mock( this.panel.items.buyMaterial1Btn, 'setCaller' );
		this.mm.mock( this.panel.items.buyMaterial2Btn, 'setCaller' );
		this.mm.mock( this.panel.items.intensifyBtn, 'setCaller' );
		this.lc()._setCallers();
		assert ( this.mm.walkLog == 'setCaller,setCaller,setCaller,setCaller' );
		assert ( this.mm.params['setCaller.0'][0].self == this.panel );
		assert ( this.mm.params['setCaller.0'][0].caller == this.lc()._onClickArmList );
		assert ( this.mm.params['setCaller.1'][0].self == this.panel );
		assert ( this.mm.params['setCaller.1'][0].caller == this.lc()._onClickBuyStone );
		assert ( this.mm.params['setCaller.2'][0].self == this.panel );
		assert ( this.mm.params['setCaller.2'][0].caller == this.lc()._onClickBuyEssence );
		assert ( this.mm.params['setCaller.3'][0].self == this.panel );
		assert ( this.mm.params['setCaller.3'][0].caller == this.lc()._onClickIntensify );
	};
	
	this.test__setCurArmTipCaller = function(){
		this.mm.mock( TTIP, 'setCallerData' );
		this.lc()._setCurArmTipCaller();
		assert( this.mm.walkLog == 'setCallerData' );
		
		assert( this.mm.params['setCallerData'][0] == this.panel.items.tooltips['$curarm'] );
		assert( this.mm.params['setCallerData'][1].self == this.panel );
		assert( this.mm.params['setCallerData'][1].caller == this.lc()._onGetCurArmTip );
	};
	
	this.test__onGetCurArmTip = function(){
		var g_getCurSelArmRt = [];
		this.mm.mock(this.lc().m_armList, 'getCurSelArm', g_getCurSelArmRt);
		assert ( this.lc()._onGetCurArmTip() == '' );

		this.mm.mock(TIPM, 'getItemDesc', ['desc']);
		
		this.mm.clear();
		g_getCurSelArmRt[0] = {};
		assert ( this.lc()._onGetCurArmTip() == 'desc' );
		assert ( this.mm.params['getItemDesc'], [ g_getCurSelArmRt[0] ] );
	};
	
	this.test__onItemChanged = function(){
		this.dlg.lc().m_dlg.show();
		this.mm.mock(this.lc().m_armList, 'updateArmList');
		this.mm.mock(this.lc(), '_updateMyHasMaterials');
		this.lc()._onItemChanged();
		assert ( this.mm.walkLog == 'updateArmList,_updateMyHasMaterials' );
		
		this.mm.clear();
		this.dlg.lc().m_dlg.hide();
		this.lc()._onItemChanged();
		assert ( this.mm.walkLog == '' );
	};
	
	this.test__onItemOpSvrCmd = function(){
		var netData = {data:{}};
		this.mm.mock(TQ, 'setTextEx' );
		
		this.lc()._onItemOpSvrCmd(netData);
		assert ( this.mm.walkLog == '' );
		
		this.mm.clear();
		netData.data.intensifyResult = {resid:1, forceLevel:1};
		this.lc()._onItemOpSvrCmd(netData);
		assert ( this.mm.walkLog == 'setTextEx' );
		var s = TQ.format(rstr.armopdlg.intensifyarms.svr.intensifyResult,
			RStrUtil.getNameByResId(1), res_force_arms[0].effect);
		
		assertListEQ ( this.mm.params['setTextEx'], [this.panel.items.result, s] );
	};
	
	this.test__onClickArmList = function(){
		var g_getCurSelfArmRt = [{}];
		this.mm.mock(this.lc().m_armList, 'getCurSelArm', g_getCurSelfArmRt);
		this.mm.mock(this.lc(), '_clearAllCurArmInfo');
		this.mm.mock(this.lc(), '_updateCurArmIconName');
		this.mm.mock(this.lc(), '_updateCurArmAttrs');
		this.mm.mock(this.lc(), '_updateCurForceLevelDesc');
		this.mm.mock(this.lc(), '_updateNextForceLevelDesc');
		this.mm.mock(this.lc(), '_updateNextForceLevelNeed');
		this.mm.mock(this.lc(), '_updateIntensifySuccessRate');
		this.mm.mock(this.lc(), '_updateMyHasMaterials');
		this.lc()._onClickArmList();
		assert ( this.mm.walkLog == 'getCurSelArm,_updateCurArmIconName,_updateCurArmAttrs,_updateCurForceLevelDesc,_updateNextForceLevelDesc,_updateNextForceLevelNeed,_updateIntensifySuccessRate,_updateMyHasMaterials' );
		assertListEQ ( this.mm.params['_updateCurArmIconName'], [g_getCurSelfArmRt[0]]);
		assertListEQ ( this.mm.params['_updateCurArmAttrs'], [g_getCurSelfArmRt[0]]);
		assertListEQ ( this.mm.params['_updateCurForceLevelDesc'], [g_getCurSelfArmRt[0]]);
		assertListEQ ( this.mm.params['_updateNextForceLevelDesc'], [g_getCurSelfArmRt[0]]);
		assertListEQ ( this.mm.params['_updateNextForceLevelNeed'], [g_getCurSelfArmRt[0]]);
		assertListEQ ( this.mm.params['_updateIntensifySuccessRate'], [g_getCurSelfArmRt[0]]);
		
		this.mm.clear();
		g_getCurSelfArmRt[0] = null;
		this.lc()._onClickArmList();
		assert ( this.mm.walkLog == 'getCurSelArm,_clearAllCurArmInfo');
	};
	
	this.test__onClickBuyStone = function(){
		this.mm.mock( this.buyItemDlg, 'openDlg' );
		this.lc()._onClickBuyStone();
		assert ( this.mm.walkLog == 'openDlg' );
		assert ( this.mm.params['openDlg'][0].id == 0 ); 
		assert ( this.mm.params['openDlg'][0].resid == FIXID.REFINESTONE ); 
		assert ( this.mm.params['openDlg'][0].number == 100000 ); 
	};
	
	this.test__onClickBuyEssence = function(){
		this.mm.mock( this.buyItemListDlg, 'openDlg' );
		this.lc()._onClickBuyEssence();
		assert ( this.mm.walkLog == 'openDlg' );
		assert ( this.mm.params['openDlg'][0].length == 3 );
		assert ( this.mm.params['openDlg'][0][0] == 3000074 );
		assert ( this.mm.params['openDlg'][0][1] == 3000075 );
		assert ( this.mm.params['openDlg'][0][2] == 3000076 );
	};
	
	this.test__onClickIntensify = function(){
		var g_getCurSelArmRt = [];
		var g_isArriveMaxForceLevelRt = [true];
		var g_hasEnoughExpendsRt = [false];
		
		this.mm.mock(this.lc().m_armList, 'getCurSelArm', g_getCurSelArmRt);
		this.mm.mock(this.lc(), '_isArriveMaxForceLevel', g_isArriveMaxForceLevelRt);
		this.mm.mock(this.lc(), '_hasEnoughExpends', g_hasEnoughExpendsRt);
		this.mm.mock(this.lc().m_armList, 'getCurHeroId', [2]);
		this.mm.mock(ItemOpSender, 'sendIntensifyArm');
		this.mm.mock(TQ, 'setTextEx');
		
		this.lc()._onClickIntensify();
		assert ( this.mm.walkLog == 'setTextEx,getCurSelArm' );
		assert ( TestCaseSysTip.eqSystipStr(rstr.armopdlg.intensifyarms.tips.noselectArm) == true );
		assertListEQ ( this.mm.params['setTextEx'], [this.panel.items.result, ''] );
		
		this.mm.clear();
		TestCaseSysTip.clearTip();
		g_getCurSelArmRt[0] = {id:1,flevel:2};
		this.lc()._onClickIntensify();
		assert ( this.mm.walkLog == 'setTextEx,getCurSelArm,_isArriveMaxForceLevel' );
		assert ( TestCaseSysTip.eqSystipStr(rstr.armopdlg.intensifyarms.tips.maxForceLevel) == true );
		assertListEQ ( this.mm.params['_isArriveMaxForceLevel'], [2] );
			
		this.mm.clear();
		TestCaseSysTip.clearTip();
		g_getCurSelArmRt[0] = {id:1,flevel:0};
		g_isArriveMaxForceLevelRt[0] = false;
		this.lc()._onClickIntensify();
		assert ( this.mm.walkLog == 'setTextEx,getCurSelArm,_isArriveMaxForceLevel,_hasEnoughExpends' );
		assertListEQ ( this.mm.params['_isArriveMaxForceLevel'], [0] );
		assertListEQ ( this.mm.params['_hasEnoughExpends'], [g_getCurSelArmRt[0]] );
		
		this.mm.clear();
		TestCaseSysTip.clearTip();
		g_hasEnoughExpendsRt[0] = true;
		this.lc()._onClickIntensify();
		assert ( this.mm.walkLog == 'setTextEx,getCurSelArm,_isArriveMaxForceLevel,_hasEnoughExpends,getCurHeroId,sendIntensifyArm' );
		assertListEQ ( this.mm.params['sendIntensifyArm'], [this.g, 2, 1] );
	};
	
	this.test__clearAllCurArmInfo = function(){
		this.mm.mock(TQ, 'setTextEx');
		this.mm.mock(IMG, 'setBKImage');
		
		this.lc()._clearAllCurArmInfo();
		assert ( this.mm.walkLog == 'setTextEx,setBKImage,setTextEx,setTextEx,setTextEx,setTextEx,setTextEx,setTextEx,setTextEx,setTextEx,setTextEx,setTextEx,setTextEx,setTextEx' );
		assertListEQ ( this.mm.params['setBKImage'], [this.panel.items.curIcon, ''] );
		assertListEQ ( this.mm.params['setTextEx.0'], [this.panel.items.curName, ''] );
		assertListEQ ( this.mm.params['setTextEx.1'], [this.panel.items.strength, ''] );
		assertListEQ ( this.mm.params['setTextEx.2'], [this.panel.items.agile, ''] );
		assertListEQ ( this.mm.params['setTextEx.3'], [this.panel.items.physical, ''] );
		assertListEQ ( this.mm.params['setTextEx.4'], [this.panel.items.curIntensifyLevel, ''] );
		assertListEQ ( this.mm.params['setTextEx.5'], [this.panel.items.curIntensifyEffect, ''] );
		assertListEQ ( this.mm.params['setTextEx.6'], [this.panel.items.nextIntensifyLevel, ''] );
		assertListEQ ( this.mm.params['setTextEx.7'], [this.panel.items.nextIntensifyEffect, ''] );
		assertListEQ ( this.mm.params['setTextEx.8'], [this.panel.items.needMaterial1, ''] );
		assertListEQ ( this.mm.params['setTextEx.9'], [this.panel.items.needMaterial2, ''] );
		assertListEQ ( this.mm.params['setTextEx.10'], [this.panel.items.hasMaterial1, ''] );
		assertListEQ ( this.mm.params['setTextEx.11'], [this.panel.items.hasMaterial2, ''] );
		assertListEQ ( this.mm.params['setTextEx.12'], [this.panel.items.succPro, ''] );
	};
	
	this.test__updateCurArmIconName = function(){
		var curArm = {id:1, itemres:{bigpic:1,name:'name'} };
		this.lc()._updateCurArmIconName(curArm);
		assert ( isInclude(IMG.getBKImage(this.panel.items.curIcon), '1.gif') == true );
		assert ( TQ.getTextEx(this.panel.items.curName) == ItemNameColorGetter.getColorVal(1,'name') );
	};
	
	this.test__updateCurArmAttrs = function(){
		var curArm = {id:1, flevel:0, attrs:{} };
		curArm.attrs[ATTR.ST_B] = {val:1};
		curArm.attrs[ATTR.ST_A] = {val:2};
		curArm.attrs[ATTR.AG_B] = {val:3};
		
		this.lc()._updateCurArmAttrs(curArm);
		
		assert ( TQ.getTextEx(this.panel.items.strength) == '1'+TQ.formatColorStr('(+2)', COLORS.APPEND_ATTR) );
		assert ( TQ.getTextEx(this.panel.items.agile) == '3');
		assert ( TQ.getTextEx(this.panel.items.physical) == '' );
	};
	
	this.test__updateCurForceLevelDesc = function(){
		var curArm = {};
		this.lc()._updateCurForceLevelDesc(curArm);
		assert ( TQ.getTextEx(this.panel.items.curIntensifyLevel) == TQ.format(rstr.armopdlg.intensifyarms.lbl.forceLevelTitle, 0) );
		assert ( TQ.getTextEx(this.panel.items.curIntensifyEffect) == TQ.format(rstr.armopdlg.intensifyarms.lbl.forceLevelEffect, 0) );
			
		var curArm = {flevel:5};
		this.lc()._updateCurForceLevelDesc(curArm);
		assert ( TQ.getTextEx(this.panel.items.curIntensifyLevel) == TQ.format(rstr.armopdlg.intensifyarms.lbl.forceLevelTitle, 5) );
		assert ( TQ.getTextEx(this.panel.items.curIntensifyEffect) == TQ.format(rstr.armopdlg.intensifyarms.lbl.forceLevelEffect, res_force_arms[4].effect) );
	};
	
	this.test__updateNextForceLevelDesc = function(){
		var curArm = {};
		this.lc()._updateNextForceLevelDesc(curArm);
		assert ( TQ.getTextEx(this.panel.items.nextIntensifyLevel) == TQ.format(rstr.armopdlg.intensifyarms.lbl.forceLevelTitle, 1) );
		assert ( TQ.getTextEx(this.panel.items.nextIntensifyEffect) == TQ.format(rstr.armopdlg.intensifyarms.lbl.forceLevelEffect, res_force_arms[0].effect) );
			
		var curArm = {flevel:5};
		this.lc()._updateNextForceLevelDesc(curArm);
		assert ( TQ.getTextEx(this.panel.items.nextIntensifyLevel) == TQ.format(rstr.armopdlg.intensifyarms.lbl.forceLevelTitle, 6) );
		assert ( TQ.getTextEx(this.panel.items.nextIntensifyEffect) == TQ.format(rstr.armopdlg.intensifyarms.lbl.forceLevelEffect, res_force_arms[5].effect) );
		
		var curArm = {flevel:res_max_forcelevel};
		this.lc()._updateNextForceLevelDesc(curArm);
		assert ( TQ.getTextEx(this.panel.items.nextIntensifyLevel) == rstr.armopdlg.intensifyarms.lbl.fullForceLevelTitle );
		assert ( TQ.getTextEx(this.panel.items.nextIntensifyEffect) == rstr.armopdlg.intensifyarms.lbl.fullForceLevelEffect );
	};
	
	this.test__updateNextForceLevelNeed = function(){
		var curArm = {flevel:res_max_forcelevel};
		this.lc()._updateNextForceLevelNeed(curArm);
		assert ( TQ.getTextEx(this.panel.items.needMaterial1) == '' );
		assert ( TQ.getTextEx(this.panel.items.needMaterial2) == '' );
		
		var curArm = {};
		this.lc()._updateNextForceLevelNeed(curArm);
		var expends = res_force_arms[0].expends;
		assert ( TQ.getTextEx(this.panel.items.needMaterial1) == TQ.format(rstr.armopdlg.intensifyarms.lbl.needItemNumber, RStrUtil.getNoBindNameByResId(expends[0].resid), expends[0].val) );
		assert ( TQ.getTextEx(this.panel.items.needMaterial2) == TQ.format(rstr.armopdlg.intensifyarms.lbl.needItemNumber, RStrUtil.getNoBindNameByResId(expends[1].resid), expends[1].val) );
		
		var curArm = {flevel:5};
		this.lc()._updateNextForceLevelNeed(curArm);
		var expends = res_force_arms[5].expends;
		assert ( TQ.getTextEx(this.panel.items.needMaterial1) == TQ.format(rstr.armopdlg.intensifyarms.lbl.needItemNumber, RStrUtil.getNoBindNameByResId(expends[0].resid), expends[0].val) );
		assert ( TQ.getTextEx(this.panel.items.needMaterial2) == TQ.format(rstr.armopdlg.intensifyarms.lbl.needItemNumber, RStrUtil.getNoBindNameByResId(expends[1].resid), expends[1].val) );
	};
	
	this.test__updateIntensifySuccessRate = function(){
		var curArm = {flevel:res_max_forcelevel};
		this.lc()._updateIntensifySuccessRate(curArm);
		assert ( TQ.getTextEx(this.panel.items.succPro) == '' );
		
		var curArm = {};
		this.lc()._updateIntensifySuccessRate(curArm);
		assert ( TQ.getTextEx(this.panel.items.succPro) == TQ.format(rstr.armopdlg.intensifyarms.lbl.successPro, 100) );
		
		var curArm = {flevel:5};
		this.lc()._updateIntensifySuccessRate(curArm);
		assert ( TQ.getTextEx(this.panel.items.succPro) == TQ.format(rstr.armopdlg.intensifyarms.lbl.successPro, 100) );
	};
	
	this.test__updateMyHasMaterials = function(){
		var g_getCurSelArmRt = [];
		this.mm.mock(this.lc().m_armList, 'getCurSelArm', g_getCurSelArmRt );
		this.lc()._updateMyHasMaterials();
		assert ( TQ.getTextEx(this.panel.items.hasMaterial1) == '' );
		assert ( TQ.getTextEx(this.panel.items.hasMaterial2) == '' );
		
		var expends = res_force_arms[0].expends;
		this.g.getImgr().addItem({id:1, resid:expends[0].resid, number:1})
		this.g.getImgr().addItem({id:2, resid:expends[1].resid, number:2})
		
		g_getCurSelArmRt[0] = {}
		this.lc()._updateMyHasMaterials();
		assert ( TQ.getTextEx(this.panel.items.hasMaterial1) == TQ.format(rstr.armopdlg.intensifyarms.lbl.curHasItemNumber, 1) );
		assert ( TQ.getTextEx(this.panel.items.hasMaterial2) == TQ.format(rstr.armopdlg.intensifyarms.lbl.curHasItemNumber, 2) );
		
		g_getCurSelArmRt[0] = {flevel:res_max_forcelevel};
		this.lc()._updateMyHasMaterials();
		assert ( TQ.getTextEx(this.panel.items.hasMaterial1) == '' );
		assert ( TQ.getTextEx(this.panel.items.hasMaterial2) == '' );
		
		var expends = res_force_arms[4].expends;
		this.g.getImgr().getPkgs().items = [];
		this.g.getImgr().addItem({id:1, resid:expends[0].resid, number:3})
		this.g.getImgr().addItem({id:2, resid:expends[1].resid, number:4})
		g_getCurSelArmRt[0] = {flevel:4};
		this.lc()._updateMyHasMaterials();
		assert ( TQ.getTextEx(this.panel.items.hasMaterial1) == TQ.format(rstr.armopdlg.intensifyarms.lbl.curHasItemNumber, 3) );
		assert ( TQ.getTextEx(this.panel.items.hasMaterial2) == TQ.format(rstr.armopdlg.intensifyarms.lbl.curHasItemNumber, 4) );
	};
	
	this.test__isArriveMaxForceLevel = function(){
		assert ( this.lc()._isArriveMaxForceLevel(0) == false );
		assert ( this.lc()._isArriveMaxForceLevel(res_max_forcelevel) == true );
		assert ( this.lc()._isArriveMaxForceLevel(res_max_forcelevel+1) == true );
	};
	
	this.test__hasEnoughExpends = function(){
		var expends = res_force_arms[0].expends;

		var curArm = {flevel:0};
		assert ( this.lc()._hasEnoughExpends(curArm) == false );
		assert ( TestCaseSysTip.eqSystipStr( TQ.format(rstr.armopdlg.intensifyarms.tips.noEnoughExpends, RStrUtil.getNoBindNameByResId(expends[0].resid)) ) == true );
		
		TestCaseSysTip.clearTip();
		this.g.getImgr().addItem({id:1, resid:expends[0].resid, number:expends[0].val});
		assert ( this.lc()._hasEnoughExpends(curArm) == false );
		assert ( TestCaseSysTip.eqSystipStr( TQ.format(rstr.armopdlg.intensifyarms.tips.noEnoughExpends, RStrUtil.getNoBindNameByResId(expends[1].resid)) ) == true );
		
		TestCaseSysTip.clearTip();
		this.g.getImgr().addItem({id:1, resid:expends[1].resid, number:expends[1].val});
		assert ( this.lc()._hasEnoughExpends(curArm) == true );
		assert ( TestCaseSysTip.hasSystip() == false );
	};
	
	this.test__getAttrStr = function(){
		assert ( this.lc()._getAttrStr(null, ATTR.ST_B, ATTR.ST_A) == '' );
		
		var arm = {};
		assert ( this.lc()._getAttrStr(arm, ATTR.ST_B, ATTR.ST_A) == '' );
		
		var arm = {attrs:{}};
		assert ( this.lc()._getAttrStr(arm, ATTR.ST_B, ATTR.ST_A) == '' );
		
		arm.attrs[ ATTR.ST_A] = {val:2};
		assert ( this.lc()._getAttrStr(arm, ATTR.ST_B, ATTR.ST_A) == '' );
		
		arm.attrs[ ATTR.ST_B] = {val:1};
		assert ( this.lc()._getAttrStr(arm, ATTR.ST_B, ATTR.ST_A) == '1' + TQ.formatColorStr('(+2)', COLORS.APPEND_ATTR) );
		
		arm.attrs[ ATTR.ST_A].val = 0;
		assert ( this.lc()._getAttrStr(arm, ATTR.ST_B, ATTR.ST_A) == '1' );
		
		arm.attrs[ ATTR.ST_B].val = 0;
		assert ( this.lc()._getAttrStr(arm, ATTR.ST_B, ATTR.ST_A) === '' );
	};
});

TestCaseBesetGemOpPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = ArmOpDlg.snew(this.g);
		this.dlg.openDlg(0);
		this.panel = this.dlg.lc().m_panels[4];
		this.lc = this.panel.lc;
		
		res_test_items = [{id:1001,bigpic:1001},{id:1002,bigpic:1002}
			,{id:2001, effects:[{unit:VAL_UNIT.VAL,id:RES_EFF.H_ADD_STR,val:18}]}
			,{id:2002, effects:[{unit:VAL_UNIT.VAL,id:RES_EFF.H_ADD_STR,val:18}]}
			,{id:2003, effects:[{unit:VAL_UNIT.VAL,id:RES_EFF.H_ADD_AGILE,val:18}]}
		];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_initPanel = function(){
		this.mm.mock(this.lc(), '_regEvents');
		this.mm.mock(this.lc(), '_setCallers');
		this.mm.mock(this.lc(), '_setCurArmTipCaller');
		this.mm.mock(this.lc(), '_setCurArmGemsTipCaller');
		this.panel.initPanel();
		assert ( this.mm.walkLog == '_regEvents,_setCallers,_setCurArmTipCaller,_setCurArmGemsTipCaller' );
	};
	
	this.test_armListHasTooltips = function(){
		this.panel.items.armList.setItemCount(1);
		assert ( this.panel.items.armList.getItem(0).exsubs.tooltips != null );
		assert ( this.panel.items.armList.getItem(0).exsubs.tooltips['$item'] != null );
	};
	
	this.test_update = function(){
		this.mm.mock(this.lc().m_armList, 'updateHeroList');
		this.mm.mock(this.lc().m_armList, 'updateArmList');
		this.panel.update();
		assert ( this.mm.walkLog == 'updateHeroList,updateArmList' );	
	};
	
	this.test__regEvents = function(){
		this.mm.mock(this.g, 'regEvent');
		this.lc()._regEvents();
		assert ( this.mm.walkLog == 'regEvent,regEvent' );
		assertListEQ ( this.mm.params['regEvent.0'], [EVT.PKG_CHANGE, 0, this.panel, this.lc()._onItemChanged] );
		assertListEQ ( this.mm.params['regEvent.1'], [EVT.NET, NETCMD.ITEMOP, this.panel, this.lc()._onItemOpSvrCmd] );		
	};
	
	this.test__setCallers = function(){
		this.mm.mock( this.panel.items.buyGemBtn, 'setCaller' );
		this.mm.mock( this.panel.items.upgradeGem1, 'setCaller' );
		this.mm.mock( this.panel.items.besetGem1, 'setCaller' );
		this.mm.mock( this.panel.items.upgradeGem2, 'setCaller' );
		this.mm.mock( this.panel.items.besetGem2, 'setCaller' );
		this.mm.mock( this.panel.items.upgradeGem3, 'setCaller' );
		this.mm.mock( this.panel.items.besetGem3, 'setCaller' );
		this.mm.mock( this.panel.items.unbesetAllBtn, 'setCaller' );
		this.mm.mock( this.panel.items.armList, 'setCaller' );
		
		this.lc()._setCallers();
		
		assert ( this.mm.walkLog == 'setCaller,setCaller,setCaller,setCaller,setCaller,setCaller,setCaller,setCaller,setCaller' );
		assert ( this.mm.params['setCaller.0'][0].caller == this.lc()._onClickBuyGem );
		assert ( this.mm.params['setCaller.1'][0].caller == this.lc()._onClickUpgradeGem );
		assert ( this.mm.params['setCaller.2'][0].caller == this.lc()._onClickBesetGem );
		assert ( this.mm.params['setCaller.3'][0].caller == this.lc()._onClickUpgradeGem );
		assert ( this.mm.params['setCaller.4'][0].caller == this.lc()._onClickBesetGem );
		assert ( this.mm.params['setCaller.5'][0].caller == this.lc()._onClickUpgradeGem );
		assert ( this.mm.params['setCaller.6'][0].caller == this.lc()._onClickBesetGem );
		assert ( this.mm.params['setCaller.7'][0].caller == this.lc()._onClickUnbesetAll );
		assert ( this.mm.params['setCaller.8'][0].caller == this.lc()._onClickArmList );
	};
	
	this.test__setCurArmTipCaller = function(){
		this.mm.mock( TTIP, 'setCallerData' );
		this.lc()._setCurArmTipCaller();
		assert( this.mm.walkLog == 'setCallerData' );
		
		assert( this.mm.params['setCallerData'][0] == this.panel.items.tooltips['$curarm'] );
		assert( this.mm.params['setCallerData'][1].self == this.panel );
		assert( this.mm.params['setCallerData'][1].caller == this.lc()._onGetCurArmTip );
	};
	
	this.test__setCurArmGemsTipCaller = function(){
		this.mm.mock( TTIP, 'setCallerData' );
		this.lc()._setCurArmGemsTipCaller();
		assert( this.mm.walkLog == 'setCallerData,setCallerData,setCallerData' );
		
		assert( this.mm.params['setCallerData.0'][0] == this.panel.items.tooltips['$gem1'] );
		assert( this.mm.params['setCallerData.0'][1].self == this.panel );
		assert( this.mm.params['setCallerData.0'][1].caller == this.lc()._onGetCurArmGemsTip );
		assert( this.mm.params['setCallerData.0'][2].idx == 0 );
		
		assert( this.mm.params['setCallerData.1'][0] == this.panel.items.tooltips['$gem2'] );
		assert( this.mm.params['setCallerData.1'][2].idx == 1 );
		
		assert( this.mm.params['setCallerData.2'][0] == this.panel.items.tooltips['$gem3'] );
		assert( this.mm.params['setCallerData.2'][2].idx == 2 );
	};
	
	this.test__onGetCurArmTip = function(){
		var g_getCurSelArmRt = [];
		this.mm.mock(this.lc().m_armList, 'getCurSelArm', g_getCurSelArmRt);
		assert ( this.lc()._onGetCurArmTip() == '' );

		this.mm.mock(TIPM, 'getItemDesc', ['desc']);
		
		this.mm.clear();
		g_getCurSelArmRt[0] = {};
		assert ( this.lc()._onGetCurArmTip() == 'desc' );
		assert ( this.mm.params['getItemDesc'], [ g_getCurSelArmRt[0] ] );
	};
	
	this.test__onGetCurArmGemsTip = function(){
		var g_getCurSelArmRt = [{}];
		var g_getArmGemResIdByIdxRt = [0];
		this.mm.mock(this.lc().m_armList, 'getCurSelArm', g_getCurSelArmRt);
		this.mm.mock(this.lc(), '_getArmGemResIdByIdx', g_getArmGemResIdByIdxRt);
		this.mm.mock(TIPM, 'getItemDesc', ['desc']);
			
		assert ( this.lc()._onGetCurArmGemsTip({idx:0}) == '' );
		assert ( this.mm.walkLog == 'getCurSelArm,_getArmGemResIdByIdx' );
		assertListEQ ( this.mm.params['_getArmGemResIdByIdx'], [g_getCurSelArmRt[0], 0] );
		
		this.mm.clear();
		g_getArmGemResIdByIdxRt[0] = 1001;
		assert ( this.lc()._onGetCurArmGemsTip({idx:0}) == 'desc' );
		assert ( this.mm.params['getItemDesc'][0].id == 0 );
		assert ( this.mm.params['getItemDesc'][0].resid == 1001 );
		assert ( this.mm.params['getItemDesc'][0].itemres == ItemResUtil.findItemres(1001) );
	};
	
	this.test__onItemChanged = function(){
		this.dlg.lc().m_dlg.show();
		this.mm.mock(this.lc().m_armList, 'updateArmList');
		this.mm.mock(this.lc(), '_updateCurArm');
		this.lc()._onItemChanged();
		assert ( this.mm.walkLog == 'updateArmList,_updateCurArm' );
		
		this.mm.clear();
		this.dlg.lc().m_dlg.hide();
		this.lc()._onItemChanged();
		assert ( this.mm.walkLog == '' );	
	};
	
	this.test__onItemOpSvrCmd = function(){
		// do nothing ...
	};
	
	this.test__onClickArmList = function(){
		this.mm.mock(this.lc(), '_updateCurArm');
		this.lc()._onClickArmList();
		assert ( this.mm.walkLog == '_updateCurArm' );
	};
	
	this.test__onClickBuyGem = function(){
		var buyItem = MockDialog.snew(this.g);
		UIM.regDlg('buyitemlist', buyItem);
		this.mm.mock(buyItem, 'openDlg')
		this.lc()._onClickBuyGem();
		assert (this.mm.walkLog == 'openDlg' );
		assertListEQ ( this.mm.params['openDlg'], [res_canbuy_gems] );
	};
	
	this.test__onClickUpgradeGem = function(){
		var upgradeDlg = MockDialog.snew(this.g);
		UIM.regDlg('upgradegem', upgradeDlg);
		this.mm.mock(upgradeDlg, 'openDlg')
		
		var g_getCurSelArmRt = [{id:10}];
		var g_getArmGemResIdByIdxRt = [0];
		this.mm.mock(this.lc().m_armList, 'getCurHeroId', [100]);
		this.mm.mock(this.lc().m_armList, 'getCurSelArm', g_getCurSelArmRt);
		this.mm.mock(this.lc(), '_getArmGemResIdByIdx', g_getArmGemResIdByIdxRt);
		
		this.lc()._onClickUpgradeGem(1);
		assert ( this.mm.walkLog == 'getCurSelArm,_getArmGemResIdByIdx' );
		assertListEQ ( this.mm.params['_getArmGemResIdByIdx'], [g_getCurSelArmRt[0], 1] );
		
		this.mm.clear();
		g_getArmGemResIdByIdxRt[0] = 1001;
		this.lc()._onClickUpgradeGem(1);
		assert ( this.mm.walkLog == 'getCurSelArm,_getArmGemResIdByIdx,getCurHeroId,getCurSelArm,openDlg' );
		assertListEQ ( this.mm.params['openDlg'], [100, 10, 1, 1001] );
	};
	
	this.test__onClickBesetGem = function(){
		var g_getCurSelArmRt = [];
		
		this.mm.mock(this.lc().m_armList, 'getCurSelArm', g_getCurSelArmRt);
		this.mm.mock(this.lc().m_armList, 'getCurHeroId', [3]);
		this.mm.mock(this.lc(), '_openSelectGemsDlg');
		this.mm.mock(ItemOpSender, 'sendUnbesetGem');
		
		this.lc()._onClickBesetGem(0);
		assert ( this.mm.walkLog == 'getCurSelArm' );
		
		this.mm.clear();
		g_getCurSelArmRt[0] = {id:1,gems:[1001]};
		this.lc()._onClickBesetGem(0);
		assert ( this.mm.walkLog == 'getCurSelArm,getCurHeroId,sendUnbesetGem' );
		assertListEQ ( this.mm.params['sendUnbesetGem'], [this.g, 3, 1, 0] );
		assert ( this.lc().m_gemPosIdx == 0);
		
		this.mm.clear();
		this.lc()._onClickBesetGem(1);
		assert ( this.mm.walkLog == 'getCurSelArm,_openSelectGemsDlg' );
		assert ( this.lc().m_gemPosIdx == 1);
	};
	
	this.test__onClickUnbesetAll = function(){
		var g_getCurSelArmRt = [];
		this.mm.mock(this.lc().m_armList, 'getCurSelArm', g_getCurSelArmRt);
		this.mm.mock(ItemOpSender, 'sendUnbesetAllGems');
		this.mm.mock(this.lc().m_armList, 'getCurHeroId', [3]);
		
		this.lc()._onClickUnbesetAll();
		assert ( this.mm.walkLog == 'getCurSelArm' );
		
		this.mm.clear();
		g_getCurSelArmRt[0] = {id:1};
		this.lc()._onClickUnbesetAll();
		assert ( this.mm.walkLog == 'getCurSelArm,getCurHeroId,sendUnbesetAllGems' );
		assertListEQ ( this.mm.params['sendUnbesetAllGems'], [this.g, 3, 1] );
	};
	
	this.test__onSelectBesetGem = function(){
		var gem = {id:2,resid:2003}
		this.lc().m_gemPosIdx = 2
		this.mm.mock(this.lc().m_armList, 'getCurHeroId', [4]);
		this.mm.mock(this.lc().m_armList, 'getCurSelArm', [{id:3,gems:[2001]}]);
		this.mm.mock(ItemOpSender, 'sendBesetGem' );
		
		assert ( this.lc()._onSelectBesetGem(gem) == RET_END );
		assertListEQ ( this.mm.params['sendBesetGem'], [this.g, 4, 3, 2, 2003]);
		
		this.mm.clear();
		var gem = {id:2,resid:2002}
		assertEQ ( this.lc()._onSelectBesetGem(gem), RET_CONTINUE );
		assertStrRepeatCount ( this.mm.walkLog, 'sendBesetGem', 0);
		assertEQ ( TestCaseSysTip.getSystip(), rstr.armopdlg.besetGems.tip.hasSameGem );
	};
	
	this.test__openSelectGemsDlg = function(){
		var gemsdlg = new FilterItemDlgEx(this.g);
		this.mm.mock(gemsdlg, 'setCaller');
		this.mm.mock(gemsdlg, 'openDlg');
		UIM.regDlg('filteritemex', gemsdlg);
		
		this.lc()._openSelectGemsDlg();
		assert ( this.mm.walkLog == 'setCaller,openDlg' );
		assert ( this.mm.params['setCaller'][0].self == this.panel);
		assert ( this.mm.params['setCaller'][0].caller == this.lc()._onSelectBesetGem );
		assert ( this.mm.params['openDlg'][0].title == rstr.getmlistdlg.title);
		assert ( this.mm.params['openDlg'][0].filter == 'gem' );
	};
	
	this.test__getArmGemResIdByIdx = function(){
		assert ( this.lc()._getArmGemResIdByIdx(null, 1) == 0 );
		assert ( this.lc()._getArmGemResIdByIdx({}, 1) == 0 );
		assert ( this.lc()._getArmGemResIdByIdx({gems:[]}, 1) == 0 );
		assert ( this.lc()._getArmGemResIdByIdx({gems:[1001]}, 1) == 0 );
		assert ( this.lc()._getArmGemResIdByIdx({gems:[1001,1002]}, 1) == 1002 );
	};	
	
	this.test__updateCurArm = function(){
		var g_getCurSelArmRt = [];
		this.mm.mock(this.lc().m_armList, 'getCurSelArm', g_getCurSelArmRt);
		this.mm.mock(this.lc(), '_clearCurArm');
		this.mm.mock(this.lc(), '_updateCurArmIcon');
		this.mm.mock(this.lc(), '_updateCurArmGemsList');
		this.mm.mock(this.lc(), '_toggleBesetBtnsText');
		this.mm.mock(this.lc(), '_enableBesetBtnsEnableState');
		this.mm.mock(this.lc(), '_toggleUpgradeBtnsEnableState');
		this.mm.mock(this.lc(), '_toggleUnbesetAllBtnEnableState');
		
		this.lc()._updateCurArm();
		assert ( this.mm.walkLog == 'getCurSelArm,_clearCurArm' );
		
		this.mm.clear();
		g_getCurSelArmRt[0] = {};
		this.lc()._updateCurArm();
		assert ( this.mm.walkLog == 'getCurSelArm,_updateCurArmIcon,_updateCurArmGemsList,_toggleBesetBtnsText,_enableBesetBtnsEnableState,_toggleUpgradeBtnsEnableState,_toggleUnbesetAllBtnEnableState' );
		assertListEQ ( this.mm.params['_updateCurArmIcon'],  g_getCurSelArmRt );
		assertListEQ ( this.mm.params['_updateCurArmGemsList'],  g_getCurSelArmRt );
		assertListEQ ( this.mm.params['_toggleBesetBtnsText'],  g_getCurSelArmRt );
		assertListEQ ( this.mm.params['_toggleUnbesetAllBtnEnableState'],  g_getCurSelArmRt );
		assertListEQ ( this.mm.params['_toggleUpgradeBtnsEnableState'],  g_getCurSelArmRt );
		assertListEQ ( this.mm.params['_enableBesetBtnsEnableState'],  g_getCurSelArmRt );
	};
	
	this.test__clearCurArm = function(){
		this.lc()._clearCurArm();
		assert ( IMG.getBKImage(this.panel.items.curIcon) == "url('')" );
		assert ( IMG.getBKImage(this.panel.items.gemIcon1) == "url('')" );
		assert ( IMG.getBKImage(this.panel.items.gemIcon2) == "url('')" );
		assert ( IMG.getBKImage(this.panel.items.gemIcon3) == "url('')" );
		assert ( this.panel.items.upgradeGem1.isEnable() == false );
		assert ( this.panel.items.upgradeGem2.isEnable() == false );
		assert ( this.panel.items.upgradeGem3.isEnable() == false );
		assert ( this.panel.items.besetGem1.isEnable() == false );
		assert ( this.panel.items.besetGem2.isEnable() == false );
		assert ( this.panel.items.besetGem3.isEnable() == false );
		assert ( this.panel.items.unbesetAllBtn.isEnable() == false );
	};
	
	this.test__updateCurArmIcon = function(){
		this.lc()._updateCurArmIcon({itemres:{bigpic:1001}});
		assert ( isInclude(IMG.getBKImage(this.panel.items.curIcon), '1001.gif') == true );
	};
	
	this.test__updateCurArmGemsList = function(){
		this.lc()._updateCurArmGemsList({gems:[1001,1002,1002]});
		assert ( isInclude(IMG.getBKImage(this.panel.items.gemIcon1), '1001.gif') == true );
		assert ( isInclude(IMG.getBKImage(this.panel.items.gemIcon2), '1002.gif') == true );
		assert ( isInclude(IMG.getBKImage(this.panel.items.gemIcon3), '1002.gif') == true );
		
		this.lc()._updateCurArmGemsList({gems:[1001,1002]});
		assert ( isInclude(IMG.getBKImage(this.panel.items.gemIcon1), '1001.gif') == true );
		assert ( isInclude(IMG.getBKImage(this.panel.items.gemIcon2), '1002.gif') == true );		
		assert ( IMG.getBKImage(this.panel.items.gemIcon3) == "url('')" );
	};
	
	this.test__toggleBesetBtnsText = function(){
		this.lc()._toggleBesetBtnsText( {gems:[1001,1002]} );
		assert ( this.panel.items.besetGem1.getText() == rstr.armopdlg.besetGems.btn.removeGem );
		assert ( this.panel.items.besetGem2.getText() == rstr.armopdlg.besetGems.btn.removeGem );
		assert ( this.panel.items.besetGem3.getText() == rstr.armopdlg.besetGems.btn.besetGem );
	};
	
	this.test__enableBesetBtnsEnableState = function(){
		this.panel.items.besetGem1.enable(false);
		this.panel.items.besetGem2.enable(false);
		this.panel.items.besetGem3.enable(false);
		
		this.lc()._enableBesetBtnsEnableState();
		
		assert ( this.panel.items.besetGem1.isEnable() == true );
		assert ( this.panel.items.besetGem2.isEnable() == true );
		assert ( this.panel.items.besetGem3.isEnable() == true );
	};
	
	this.test__toggleUpgradeBtnsEnableState = function(){
		var mm = MethodMock.snew();
		mm.mock( GemUtil, 'isMaxGemLevel', function(resid){
			if (resid == 1001) return false;
			else if (resid == 1002) return true; });
		
		this.lc()._toggleUpgradeBtnsEnableState( {gems:[1001,1002]} );
		assert ( this.panel.items.upgradeGem1.isEnable() == true );
		assert ( this.panel.items.upgradeGem2.isEnable() == false );
		assert ( this.panel.items.upgradeGem3.isEnable() == false );
		
		mm.restore();
	};
	
	this.test__toggleUnbesetAllBtnEnableState = function(){
		this.panel.items.unbesetAllBtn.enable(false);
		this.lc()._toggleUnbesetAllBtnEnableState( {gems:[1001]} );
		assert ( this.panel.items.unbesetAllBtn.isEnable() == true );
		
		this.panel.items.unbesetAllBtn.enable(true);
		this.lc()._toggleUnbesetAllBtnEnableState( {gems:[]} );
		assert ( this.panel.items.unbesetAllBtn.isEnable() == false );
	};
});

TestCaseCombineGemOpPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = ArmOpDlg.snew(this.g);
		this.dlg.openDlg(0);
		this.panel = this.dlg.lc().m_panels[3];
		this.lc = this.panel.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_initPanel = function(){
		this.mm.mock(this.lc(), '_regEvents');
		this.mm.mock(this.lc(), '_setCallers');
		this.mm.mock(this.lc(), '_setGemClassDorpList');
		this.mm.mock(this.lc(), '_setCombineLevelList');
		this.panel.initPanel();
		assert ( this.mm.walkLog == '_regEvents,_setCallers,_setGemClassDorpList,_setCombineLevelList' );
	};
	
	this.test_myGemsListHasTooltips = function(){
		this.panel.items.myGemsList.setItemCount(1);
		assert ( this.panel.items.myGemsList.getItem(0).exsubs.tooltips != null );
		assert ( this.panel.items.myGemsList.getItem(0).exsubs.tooltips['$item'] != null );
	};
	
	this.test_lowGemsListHasTooltips = function(){
		this.panel.items.lowGemsList.setItemCount(1);
		assert ( this.panel.items.lowGemsList.getItem(0).exsubs.tooltips != null );
		assert ( this.panel.items.lowGemsList.getItem(0).exsubs.tooltips['$item'] != null );
	};
	
	this.test_update = function(){
		this.mm.mock(this.lc(), '_updateMyGemsList');
		this.panel.update();
		assert ( this.mm.walkLog == '_updateMyGemsList' );
	};
	
	this.test_setListItemSecField = function(){
		var item = {exsubs:{levelOrNumber:MockDomEx.snew('div')}};
		var ritem = {number:1};
		this.panel.setListItemSecField(item, ritem);
		assert ( TQ.getTextEx(item.exsubs.levelOrNumber) == '1' );
	};
	
	this.test__regEvents = function(){
		this.mm.mock(this.g, 'regEvent');
		this.lc()._regEvents();
		assert ( this.mm.walkLog == 'regEvent,regEvent' );
		assertListEQ ( this.mm.params['regEvent.0'], [EVT.PKG_CHANGE, 0, this.panel, this.lc()._onItemChanged] );
		assertListEQ ( this.mm.params['regEvent.1'], [EVT.NET, NETCMD.ITEMOP, this.panel, this.lc()._onItemOpSvrCmd] );		
	};
	
	this.test__setCallers = function(){
		this.mm.mock(TTIP, 'setCallerData');
		this.mm.mock(this.panel.items.gemClassDorpList, 'setCaller');
		this.mm.mock(this.panel.items.myGemsList, 'setCaller');
		this.mm.mock(this.panel.items.combineLevelList, 'setCaller');
		this.mm.mock(this.panel.items.combineGem, 'setCaller');
		this.mm.mock(this.panel.items.combineGems, 'setCaller');
		this.mm.mock(this.panel.items.buyGem, 'setCaller');

		this.lc()._setCallers();
		assert ( this.mm.walkLog == 'setCallerData,setCallerData,setCallerData,setCallerData,setCallerData,setCallerData,setCaller,setCaller,setCaller,setCaller,setCaller,setCaller' );
		assert ( this.mm.params['setCallerData.0'][0] == this.panel.items.tooltips['$willGemIcon'] );
		assert ( this.mm.params['setCallerData.0'][1].caller == this.lc()._onGetWillGemTip );
		assert ( this.mm.params['setCallerData.1'][0] == this.panel.items.lowGemsList.getItem(0).exsubs.tooltips['$item'] );
		assert ( this.mm.params['setCallerData.1'][1].caller == this.lc()._onGetLowGemsTip );
		assert ( this.mm.params['setCallerData.1'][2].idx == 0 );
		assert ( this.mm.params['setCallerData.5'][0] == this.panel.items.lowGemsList.getItem(4).exsubs.tooltips['$item'] );
		assert ( this.mm.params['setCallerData.5'][1].caller == this.lc()._onGetLowGemsTip );
		assert ( this.mm.params['setCallerData.5'][2].idx == 4 );
		assert ( this.mm.params['setCaller.0'][0].caller == this.lc()._onClickGemClassDropList );
		assert ( this.mm.params['setCaller.1'][0].caller == this.lc()._onClickMyGemsList );
		assert ( this.mm.params['setCaller.2'][0].caller == this.lc()._onClickCombineLevelList );
		assert ( this.mm.params['setCaller.3'][0].caller == this.lc()._onClickCombineGem );
		assert ( this.mm.params['setCaller.4'][0].caller == this.lc()._onClickCombineGems );
		assert ( this.mm.params['setCaller.5'][0].caller == this.lc()._onClickBuyGem );
	};
	
	this.test__setGemClassDorpList = function(){
		this.panel.items.gemClassDorpList.deleteAllItem();
		this.lc()._setGemClassDorpList();
		assert ( this.panel.items.gemClassDorpList.getCurSel() == 0 );
		assert ( this.panel.items.gemClassDorpList.getCount() == rstr.armopdlg.combineGems.gemClassNames.length );
	};
	
	this.test__setCombineLevelList = function(){
		this.lc()._setCombineLevelList();
		assert ( this.panel.items.combineLevelList.getCount() == rstr.armopdlg.combineGems.combineLevels.length );
	};
	
	this.test__updateMyGemsList = function(){
		this.mm.mock(this.lc(), '_filterMyGems');
		this.mm.mock(this.lc(), '_mergeSameGems');
		this.mm.mock(this.lc(), '_sortGems');
		this.mm.mock(this.lc(), '_setMyGemsListItems');
		this.mm.mock(this.lc(), '_resetMyGemsListCurSel');
		this.mm.mock(this.lc(), '_setMyGemsListTipCaller');
		
		this.lc()._updateMyGemsList();
		
		assert ( this.mm.walkLog == '_filterMyGems,_mergeSameGems,_sortGems,_setMyGemsListItems,_resetMyGemsListCurSel,_setMyGemsListTipCaller' );
	};
	
	this.test__filterMyGems = function(){
		var g_gems = [];
		var g_filter = ItemClassRangeFilter.snew(this.g);
		this.mm.mock(ItemClassRangeFilter, 'snew', [g_filter] );
		this.mm.mock(g_filter, 'filter', [g_gems] );
		
		assert ( this.panel.items.gemClassDorpList.getCurSel() == 0 );
		this.lc()._filterMyGems();
		assert ( this.lc().m_myGems == g_gems );
		assert ( this.mm.walkLog == 'snew,filter' );
		assert ( this.mm.params['filter'][0].classId == RES_CLS.GEMITEM );
		
		this.panel.items.gemClassDorpList.setCurSel(1);
		this.lc()._filterMyGems();
		assert ( this.mm.params['filter'][0].classId == RES_CLS.ST_GEMITEM );
		
		this.panel.items.gemClassDorpList.setCurSel(2);
		this.lc()._filterMyGems();
		assert ( this.mm.params['filter'][0].classId == RES_CLS.AG_GEMITEM );
		
		this.panel.items.gemClassDorpList.setCurSel(3);
		this.lc()._filterMyGems();
		assert ( this.mm.params['filter'][0].classId == RES_CLS.PH_GEMITEM );
		
		this.panel.items.gemClassDorpList.setCurSel(4);
		this.lc()._filterMyGems();
		assert ( this.mm.params['filter'][0].classId == RES_CLS.CO_GEMITEM );
	};
	
	this.test__mergeSameGems = function(){
		var item1={resid:1,number:1};
		var item2={resid:1,number:2};
		this.lc().m_myGems = [item1,item2];
		this.lc()._mergeSameGems();
		assert ( this.lc().m_myGems.length == 1 );
		assert ( this.lc().m_myGems[0].number == 3 );
		assert ( item1.number == 1 );
		assert ( item2.number == 2 );
	};
	
	this.test__sortGems = function(){
		this.lc().m_myGems = [{id:1,resid:10},{id:2,resid:5},{id:3,resid:11}];
		this.lc()._sortGems();
		assert ( this.lc().m_myGems[0].id == 2 );
		assert ( this.lc().m_myGems[1].id == 1 );
		assert ( this.lc().m_myGems[2].id == 3 );
	};
	
	this.test__setMyGemsListItems = function(){
		this.lc().m_myGems = [];
		this.mm.mock(this.panel, 'setMyArmListItems');
		this.lc()._setMyGemsListItems();
		assert ( this.mm.walkLog == 'setMyArmListItems' );
		assertListEQ ( this.mm.params['setMyArmListItems'], [this.panel.items.myGemsList, this.lc().m_myGems] );
	};
	
	this.test__resetMyGemsListCurSel = function(){
		this.mm.mock(this.panel, 'resetListCurSel');
		this.lc()._resetMyGemsListCurSel();
		assert ( this.mm.walkLog == 'resetListCurSel' );
		assertListEQ ( this.mm.params['resetListCurSel'], [this.panel.items.myGemsList] );
	};
	
	this.test__setMyGemsListTipCaller = function(){
		this.panel.items.myGemsList.setItemCount(1);
		this.lc()._setMyGemsListTipCaller();
		
		this.mm.mock(this.panel, 'setListTipCaller');
		this.lc()._setMyGemsListTipCaller();
		assert ( this.mm.walkLog == 'setListTipCaller' );
		assertListEQ ( this.mm.params['setListTipCaller'], [this.panel.items.myGemsList, this.lc()._onGetMyGemsListTip] );
	};
	
	this.test__onGetMyGemsListTip = function(){
		this.lc().m_myGems = [{}];
		this.mm.mock(TIPM, 'getItemDesc', ['desc']);
		assert ( this.lc()._onGetMyGemsListTip({idx:0}) == 'desc' );
		assert ( this.mm.walkLog == 'getItemDesc' );
		assertListEQ ( this.mm.params['getItemDesc'], [ this.lc().m_myGems[0] ] );
	};
	
	this.test__onGetWillGemTip = function(){
		var g_willGem = {};
		this.mm.mock(TIPM, 'getItemDesc', ['desc']);
		this.mm.mock(this.lc(), '_getWillGem', [g_willGem]);
		assert ( this.lc()._onGetWillGemTip() == 'desc' );
		assert ( this.mm.walkLog == '_getWillGem,getItemDesc' );
		assert ( this.mm.params['getItemDesc'], [g_willGem] );
	};
	
	this.test__onGetLowGemsTip = function(){
		var g_lowGem = {};
		this.mm.mock(TIPM, 'getItemDesc', ['desc']);
		this.mm.mock(this.lc(), '_getLowGemByIdx', [g_lowGem]);
		assert ( this.lc()._onGetLowGemsTip({idx:0}) == 'desc' );
		assert ( this.mm.walkLog == '_getLowGemByIdx,getItemDesc' );
		assert ( this.mm.params['_getLowGemByIdx'], [0] );
		assert ( this.mm.params['getItemDesc'], [g_lowGem] );
	};
	
	this.test__onClickGemClassDropList = function(){
		this.mm.mock(this.lc(), '_updateMyGemsList' );
		this.lc()._onClickGemClassDropList();
		assert ( this.mm.walkLog == '_updateMyGemsList' );
	};
	
	this.test__onClickGemClassDropList = function(){
		this.mm.mock(this.lc(), '_reselectCombineLevelList' );
		this.lc()._onClickGemClassDropList();
		assert ( this.mm.walkLog == '_reselectCombineLevelList' );
	};
	
	this.test__onClickCombineLevelList = function(){
		var g_getLowGemNumberRt = [0];
		var g_isMaxLevelGemRt = [true];
		var g_getNeedLowGemNumberRt = [3];
		
		this.mm.mock(this.lc(), '_clearWillGem' );
		this.mm.mock(this.lc(), '_clearLowGemList' );
		this.mm.mock(this.lc(), '_clearCombineLevelListAllCheck' );
		this.mm.mock(this.lc(), '_getLowGemNumber', g_getLowGemNumberRt );
		this.mm.mock(this.lc(), '_getLowGemResId', [1001] );
		this.mm.mock(GemUtil, 'isMaxGemLevel', g_isMaxLevelGemRt );
		this.mm.mock(this.lc(), '_getNeedLowGemNumber', g_getNeedLowGemNumberRt );
		this.mm.mock(this.lc(), '_checkCombineLevelListItem' );
		this.mm.mock(this.lc(), '_updateWillGem' );
		this.mm.mock(this.lc(), '_updateLowGemList' );
		this.mm.mock(this.lc(), '_calcCanSelMaxCombineLevel', [2] );
		
		this.lc()._onClickCombineLevelList(null, -1);
		assert ( this.mm.walkLog == '_clearWillGem,_clearLowGemList,_clearCombineLevelListAllCheck' );
		
		this.mm.clear();
		TestCaseSysTip.clearTip();
		this.lc()._onClickCombineLevelList(null, 0);
		assert ( this.mm.walkLog == '_clearWillGem,_clearLowGemList,_clearCombineLevelListAllCheck,_getLowGemNumber' );
		
		this.mm.clear();
		TestCaseSysTip.clearTip();
		g_getLowGemNumberRt[0] = 1;
		this.lc()._onClickCombineLevelList(null, 0);
		assert ( this.mm.walkLog == '_clearWillGem,_clearLowGemList,_clearCombineLevelListAllCheck,_getLowGemNumber,_getLowGemNumber' );
		assert ( TestCaseSysTip.eqSystipStr(rstr.ids[100032].msg) == true );
		
		this.mm.clear();
		TestCaseSysTip.clearTip();
		g_getLowGemNumberRt[0] = 2;
		this.lc()._onClickCombineLevelList(null, 0);
		assert ( this.mm.walkLog == '_clearWillGem,_clearLowGemList,_clearCombineLevelListAllCheck,_getLowGemNumber,_getLowGemNumber,_getLowGemResId,isMaxGemLevel' );
		assertListEQ ( this.mm.params['isMaxGemLevel'] , [1001] );
		assert ( TestCaseSysTip.eqSystipStr(rstr.ids[100031].msg) == true );
		
		this.mm.clear();
		TestCaseSysTip.clearTip();
		g_isMaxLevelGemRt[0] = false;
		this.lc()._onClickCombineLevelList(null, 0);
		assert ( this.mm.walkLog == '_clearWillGem,_clearLowGemList,_clearCombineLevelListAllCheck,_getLowGemNumber,_getLowGemNumber,_getLowGemResId,isMaxGemLevel,_getNeedLowGemNumber,_getLowGemNumber,_calcCanSelMaxCombineLevel,_checkCombineLevelListItem,_updateWillGem,_updateLowGemList' );
		assertListEQ ( this.mm.params['_getNeedLowGemNumber'] , [0+1] );
		assertListEQ ( this.mm.params['_checkCombineLevelListItem'] , [1] );
		assert ( TestCaseSysTip.eqSystipStr(rstr.ids[100032].msg) == true );
		
		this.mm.clear();
		TestCaseSysTip.clearTip();
		g_getNeedLowGemNumberRt[0] = 1;
		this.lc()._onClickCombineLevelList(null, 0);
		assert ( this.mm.walkLog == '_clearWillGem,_clearLowGemList,_clearCombineLevelListAllCheck,_getLowGemNumber,_getLowGemNumber,_getLowGemResId,isMaxGemLevel,_getNeedLowGemNumber,_getLowGemNumber,_checkCombineLevelListItem,_updateWillGem,_updateLowGemList' );
		assertListEQ ( this.mm.params['_getNeedLowGemNumber'] , [0+1] );
		assertListEQ ( this.mm.params['_checkCombineLevelListItem'] , [0] );
	};
	
	this.test__onClickCombineGem = function(){
		this.mm.mock(this.lc(), '_doCommCombineGems' );
		this.lc().m_this.items.combineGem.click();
		assert ( this.mm.walkLog == '_doCommCombineGems' );
	};
	
	this.test__onClickCombineGems = function(){
		this.mm.mock(this.lc(), '_doBatchCombineGems' );
		this.lc().m_this.items.combineGems.click();
		assert ( this.mm.walkLog == '_doBatchCombineGems' );
	};
	
	this.test__onClickBuyGem = function(){
		var buyItem = MockDialog.snew(this.g);
		UIM.regDlg('buyitemlist', buyItem);
		this.mm.mock(buyItem, 'openDlg')
		this.lc()._onClickBuyGem();
		assert (this.mm.walkLog == 'openDlg' );
		assertListEQ ( this.mm.params['openDlg'], [res_canbuy_gems] );
	};
	
	this.test__onItemChanged = function(){
		this.dlg.lc().m_dlg.show();
		this.mm.mock(this.lc(), '_updateMyGemsList');
		this.lc()._onItemChanged();
		assert ( this.mm.walkLog == '_updateMyGemsList' );
		
		this.mm.clear();
		this.dlg.lc().m_dlg.hide();
		this.lc()._onItemChanged();
		assert ( this.mm.walkLog == '' );	
	};
	
	this.test__onItemOpSvrCmd = function(){
		// do nothing ... 
	};
	
	this.test__doCombineGems = function(){
		var g_getLowGemNumberRt = [0];
		var g_isMaxLevelGemRt = [true];
		var g_getCombineLevelRt = [0];
		
		this.mm.mock(this.lc(), '_getLowGemNumber', g_getLowGemNumberRt );
		this.mm.mock(this.lc(), '_getLowGemResId', [1001] );
		this.mm.mock(GemUtil, 'isMaxGemLevel',  g_isMaxLevelGemRt);
		this.mm.mock(this.lc(), '_getCombineLevel', g_getCombineLevelRt );
		this.mm.mock(ItemOpSender, 'sendCombineGems' );
		
		this.lc()._doCommCombineGems(false);
		assert ( this.mm.walkLog == '_getLowGemNumber' );
		
		this.mm.clear();
		g_getLowGemNumberRt[0] = 1;
		this.lc()._doCommCombineGems(false);
		assert ( this.mm.walkLog == '_getLowGemNumber,_getLowGemResId,isMaxGemLevel' );
		assert ( TestCaseSysTip.eqSystipStr(rstr.ids[100031].msg) == true );
		
		this.mm.clear();
		TestCaseSysTip.clearTip();
		g_isMaxLevelGemRt[0] = false;
		this.lc()._doCommCombineGems(false);
		assert ( this.mm.walkLog == '_getLowGemNumber,_getLowGemResId,isMaxGemLevel,_getCombineLevel' );
		assert ( TestCaseSysTip.eqSystipStr(rstr.ids[100032].msg) == true );
		
		this.mm.clear();
		TestCaseSysTip.clearTip();
		g_getCombineLevelRt[0] = 1;
		g_getLowGemNumberRt[0] = 5;
		this.lc()._doBatchCombineGems(true);
		var tip = rstr.armopdlg.combineGems.combineLevelNames[1 - 1];
		var msg = TQ.format(rstr.armopdlg.combineGems.batchCombine, tip.name, 2, tip.pro );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), msg );
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertStrRepeatCount(this.mm.walkLog, 'sendCombineGems', 0);
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertListEQ ( this.mm.params['sendCombineGems'], [this.g, 1001, 1,true] );
	};
	
	this.test_commCombineGemsNoMaxLevel = function(){
		this.mm.mock(ItemOpSender, 'sendCombineGems' );
		this.mm.mock(this.lc(), '_getCurSelGem', [{id:4500001, resid:4500001, itemres:ItemResUtil.findItemres(4500001), number:100}]);
		this.lc().m_this.items.combineLevelList.clickItem(null, 3);
		this.lc().m_this.items.combineGem.click();
		assertEQ ( this.mm.params['sendCombineGems'], [this.g, 4500001, 4, false] );
		assertEQ ( this.g.getGUI().isShowMsgBox(), false );
		
		this.mm.clear();
		this.lc().m_this.items.combineLevelList.clickItem(null, 2);
		this.lc().m_this.items.combineGem.click();
		var tip = rstr.armopdlg.combineGems.combineLevelNames[2];
		var msg = TQ.format(rstr.armopdlg.combineGems.proCommCombine, tip.pro );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), msg );
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertStrRepeatCount(this.mm.walkLog, 'sendCombineGems', 0);
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.params['sendCombineGems'], [this.g, 4500001, 3, false] );
	};
	
	this.test__getWillGem = function(){
		var g_getLowGemNumberRt = [0];
		var g_isMaxLevelGemRt = [true];
		var g_getNextLevelGemResIdRt = [1002];
		var g_findItemresRt = [{}];
		
		this.mm.mock(this.lc(), '_getLowGemNumber', g_getLowGemNumberRt );
		this.mm.mock(this.lc(), '_getLowGemResId', [1001] );
		this.mm.mock(GemUtil, 'isMaxGemLevel',  g_isMaxLevelGemRt);
		this.mm.mock(this.lc(), '_getNextLevelGemResId', g_getNextLevelGemResIdRt );
		this.mm.mock(ItemResUtil, 'findItemres', g_findItemresRt );
		
		assert ( this.lc()._getWillGem() == null );

		this.mm.clear();
		g_getLowGemNumberRt[0] = 1;
		assert ( this.lc()._getWillGem() == null );
		
		this.mm.clear();
		g_isMaxLevelGemRt[0] = false;
		var willGem = this.lc()._getWillGem();
		assert ( willGem.id == 0 );
		assert ( willGem.resid == 1002 );
		assert ( willGem.itemres == g_findItemresRt[0] );
	};
	
	this.test__getCurNeedLowGemNumber = function(){
		this.mm.mock(this.lc(), '_getCombineLevel', [4] );
		this.mm.mock(this.lc(), '_getNeedLowGemNumber', [1] );
		assert ( this.lc()._getCurNeedLowGemNumber() == 1 );
		assertListEQ ( this.mm.params['_getNeedLowGemNumber'], [4] );
	};
	
	this.test__getNeedLowGemNumber = function(){
		assert ( this.lc()._getNeedLowGemNumber(1) == 2 );
		assert ( this.lc()._getNeedLowGemNumber(2) == 3 );
		assert ( this.lc()._getNeedLowGemNumber(3) == 4 );
		assert ( this.lc()._getNeedLowGemNumber(4) == 5 );
	};
	
	this.test__getLowGemNumber = function(){
		var g_getCurSelGemRt = [];
		this.mm.mock(this.lc(), '_getCurSelGem', g_getCurSelGemRt );
		assert ( this.lc()._getLowGemNumber() == 0 );
		
		g_getCurSelGemRt[0] = {number:100};
		assert ( this.lc()._getLowGemNumber() == 100 );
	};
	
	this.test__getLowGemByIdx = function(){
		var g_getCurSelGemRt = [{resid:1001,itemres:{id:1001},number:100}];
		this.mm.mock(this.lc(), '_getCurNeedLowGemNumber', [1] );
		this.mm.mock(this.lc(), '_getCurSelGem', g_getCurSelGemRt );
		assert ( this.lc()._getLowGemByIdx(1) == null, 'overflow the need number 1' );
		assert ( this.lc()._getLowGemByIdx(0).id == 0 );
		assert ( this.lc()._getLowGemByIdx(0).resid == 1001 );
		assert ( this.lc()._getLowGemByIdx(0).itemres.id == 1001 );
		assert ( this.lc()._getLowGemByIdx(0).number == 1 );
		
		g_getCurSelGemRt[0] = null;
		assert ( this.lc()._getLowGemByIdx(0) == null );
	};
	
	this.test__getCurSelGem = function(){
		this.lc().m_myGems = [{id:1},{id:2}];
		this.panel.items.myGemsList.setItemCount(3);
		this.panel.items.myGemsList.setCurSel(0);
		assert ( this.lc()._getCurSelGem() == this.lc().m_myGems[0] );
		
		this.panel.items.myGemsList.setCurSel(1);
		assert ( this.lc()._getCurSelGem() == this.lc().m_myGems[1] );
		
		this.panel.items.myGemsList.setCurSel(2);
		assert ( this.lc()._getCurSelGem() == null );
	};
	
	this.test__getLowGemResId= function(){
		var g_getCurSelGemRt = [];
		this.mm.mock(this.lc(), '_getCurSelGem', g_getCurSelGemRt );
		assert ( this.lc()._getLowGemResId() == 0 );
		
		g_getCurSelGemRt[0] = {resid:1001};
		assert ( this.lc()._getLowGemResId() == 1001 );
	};
	
	this.test__reselectCombineLevelList = function(){
		this.mm.mock( this.lc(), '_calcCanSelMaxCombineLevel', [1]);
		this.mm.mock( this.panel.items.combineLevelList, 'setCurSel');
		
		this.lc()._reselectCombineLevelList();
		
		assert ( this.mm.walkLog == '_calcCanSelMaxCombineLevel,setCurSel' );
		assertListEQ ( this.mm.params['setCurSel'], [0] );
	};
	
	this.test__calcCanSelMaxCombineLevel = function(){
		var g_getLowGemNumberRt = [0];
		this.mm.mock( this.lc(), '_getLowGemNumber', g_getLowGemNumberRt);
		assert ( this.lc()._calcCanSelMaxCombineLevel() == -1 );
		
		g_getLowGemNumberRt[0] = 1;
		assert ( this.lc()._calcCanSelMaxCombineLevel() == 0 );
		
		g_getLowGemNumberRt[0] = 2;
		assert ( this.lc()._calcCanSelMaxCombineLevel() == 1 );
		
		g_getLowGemNumberRt[0] = 5;
		assert ( this.lc()._calcCanSelMaxCombineLevel() == 4 );
		
		g_getLowGemNumberRt[0] = 6;
		assert ( this.lc()._calcCanSelMaxCombineLevel() == 4 );
	};
	
	this.test__checkCombineLevelListItem_and_getCombineLevel = function(){
		this.lc()._checkCombineLevelListItem(0);
		assert ( this.lc()._getCombineLevel() == 1 );
		
		this.lc()._checkCombineLevelListItem(1);
		assert ( this.lc()._getCombineLevel() == 2 );
		
		this.lc()._checkCombineLevelListItem(2);
		assert ( this.lc()._getCombineLevel() == 3 );
		
		this.lc()._checkCombineLevelListItem(3);
		assert ( this.lc()._getCombineLevel() == 4 );
	};
	
	this.test__clearCombineLevelListAllCheck = function(){
		this.lc()._checkCombineLevelListItem(1);
		this.lc()._clearCombineLevelListAllCheck();
		assert ( this.lc()._getCombineLevel() == 0 );
	};
	
	this.test__getNextLevelGemResId = function(){
		assert ( this.lc()._getNextLevelGemResId(1) == 2 );
		assert ( this.lc()._getNextLevelGemResId(2) == 3 );
	};
	
	this.test__clearWillGem = function(){
		IMG.setBKImage(this.panel.items.willGemIcon, IMG.makeBigImg(1001));
		this.panel.items.combineGem.enable(true);
		this.panel.items.combineGems.enable(true);
		this.lc()._clearWillGem();
		assert ( IMG.getBKImage(this.panel.items.willGemIcon) == "url('')" );
		assert ( this.panel.items.combineGem.isEnable() == false );
		assert ( this.panel.items.combineGems.isEnable() == false );
	};
	
	this.test__clearLowGemList = function(){
		this.panel.items.lowGemsList.setItemCount(1);
		this.lc()._clearLowGemList();
		assert ( this.panel.items.lowGemsList.getCount() == 0 );
	};
	
	this.test__updateWillGem = function(){
		this.panel.items.combineGem.enable(false);
		this.panel.items.combineGems.enable(false);
		
		this.mm.mock(this.lc(), '_getWillGem', [{ itemres:{bigpic:1001} }]);
		this.lc()._updateWillGem();
		assert ( isInclude(IMG.getBKImage(this.panel.items.willGemIcon), '1001.gif') == true );
		assert ( this.panel.items.combineGem.isEnable() == true );
		assert ( this.panel.items.combineGems.isEnable() == true );
	};
	
	this.test__updateLowGemList = function(){
		this.mm.mock(this.lc(), '_getCurSelGem', [{ itemres:{bigpic:1001} }]);
		this.mm.mock(this.lc(), '_getCurNeedLowGemNumber', [2]);
		this.lc()._updateLowGemList();
		assert ( this.panel.items.lowGemsList.getCount() == 2 );
		assert ( isInclude(IMG.getBKImage(this.panel.items.lowGemsList.getItem(0).exsubs.icon), '1001.gif') == true );
		assert ( isInclude(IMG.getBKImage(this.panel.items.lowGemsList.getItem(1).exsubs.icon), '1001.gif') == true );
	};
});

TestCaseUpgradeGemDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		res_test_items = [{id:1001, name:'gem1', level:1, bigpic:1001},{id:1002, name:'gem2', level:2, bigpic:1002}];
		
		this.dlg = UpgradeGemDlg.snew(this.g);
		this.dlg.openDlg(3,2,1,1001);
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_openDlg = function(){
		var srcGemResId = 1001;
		this.dlg.openDlg(3,2,1,srcGemResId);
		assert ( this.dlg.lc().m_dlg.isShow() == true );
		assert ( this.dlg.lc().m_srcGemResId == srcGemResId );
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock(this.lc(), '_setCallers');
		this.mm.mock(this.lc(), '_setTipCallers');
		this.lc()._initDlg();
		assert ( this.mm.walkLog == '_setCallers,_setTipCallers' );
		assert ( this.lc().m_dlg != null );
		
		this.mm.clear();
		this.lc()._initDlg();
		assert ( this.mm.walkLog == '' );
	};
	
	this.test__openDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._openDlg();
		assert ( this.lc().m_dlg.isShow() == true );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(this.lc(), '_createSrcGemItem' );
		this.mm.mock(this.lc(), '_createDesGemItem' );
		this.mm.mock(this.lc(), '_setSrcGemIconAndName' );
		this.mm.mock(this.lc(), '_setDesGemIconAndName' );
		this.mm.mock(this.lc(), '_setUpgradeBtnEnableState' );
		this.mm.mock(this.lc(), '_setCanOrNeedDescVisible' );
		
		this.lc()._initInfo(3,2,1,1001);
		assert ( this.lc().m_srcGemResId == 1001 );
		assert ( this.lc().m_heroId == 3 );
		assert ( this.lc().m_armId == 2 );
		assert ( this.lc().m_gemPos == 1 );
		assert ( this.mm.walkLog == '_createSrcGemItem,_createDesGemItem,_setSrcGemIconAndName,_setDesGemIconAndName,_setUpgradeBtnEnableState,_setCanOrNeedDescVisible' );
	};
	
	this.test__createSrcGemItem = function(){
		this.lc().m_srcGemResId = 1001;
		this.mm.mock(this.lc(), '_createGemItem', [{id:1}] );
		this.lc()._createSrcGemItem();
		assert ( this.lc().m_srcGem.id == 1 );
		assertListEQ ( this.mm.params['_createGemItem'], [1001] );
	};
	
	this.test__createDesGemItem = function(){
		this.lc().m_srcGemResId = 1001;
		this.mm.mock(this.lc(), '_createGemItem', [{id:1002}] );
		this.mm.mock(this.lc(), '_getNextLevelGemResId', [1002] );
		this.lc()._createDesGemItem();
		assert ( this.lc().m_desGem.id == 1002 );
		assert ( this.mm.params['_getNextLevelGemResId'], [1001] );
		assert ( this.mm.params['_createGemItem'], [1002] );
	};

	this.test__setSrcGemIconAndName = function(){
		this.lc().m_srcGem = {};
		this.mm.mock(this.lc(), '_setGemIconAndName');
		this.lc()._setSrcGemIconAndName();
		assert ( this.mm.walkLog == '_setGemIconAndName' );
		assertListEQ ( this.mm.params['_setGemIconAndName'], [this.lc().m_items.srcIcon, this.lc().m_items.srcName, this.lc().m_srcGem] );
	};
	
	this.test__setDesGemIconAndName = function(){
		this.lc().m_desGem = {};
		this.mm.mock(this.lc(), '_setGemIconAndName');
		this.lc()._setDesGemIconAndName();
		assert ( this.mm.walkLog == '_setGemIconAndName' );
		assertListEQ ( this.mm.params['_setGemIconAndName'], [this.lc().m_items.desIcon, this.lc().m_items.desName, this.lc().m_desGem] );
	};
	
	this.test__setUpgradeBtnEnableState = function(){
		var g_hasEnoughGemsRt = [true];
		this.mm.mock(this.lc(), '_hasEnoughGems', g_hasEnoughGemsRt);
		this.lc()._setUpgradeBtnEnableState();
		assert ( this.lc().m_items.upgradeBtn.isEnable() == true );
		
		g_hasEnoughGemsRt[0] = false;
		this.lc()._setUpgradeBtnEnableState();
		assert ( this.lc().m_items.upgradeBtn.isEnable() == false );
	};
	
	this.test__setCanOrNeedDescVisible = function(){
		this.dlg.openDlg(3,2,1,1001);
		assert ( TQ.getCSS(this.lc().m_items.canDesc, 'display') == 'none' );
		assert ( TQ.getCSS(this.lc().m_items.needDesc, 'display') == 'block' );
		assert ( TQ.getTextEx(this.lc().m_items.needDesc) == HyperLinkMgr.formatLink(TQ.format(rstr.upgradegemdlg.lbl.needDesc, 5, 'gem1', 1)) );
		
		TestCaseCondition.setPreCond(null, { item:{id:1001, num:4} });
		this.dlg.openDlg(3,2,1,1001);
		assert ( TQ.getCSS(this.lc().m_items.canDesc, 'display') == 'block' );
		assert ( TQ.getCSS(this.lc().m_items.needDesc, 'display') == 'none' );
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc().m_items.upgradeBtn, 'setCaller' );
		this.lc()._setCallers();
		assert ( this.mm.walkLog == 'setCaller' );
		assert ( this.mm.params['setCaller'][0].self == this.dlg );
		assert ( this.mm.params['setCaller'][0].caller == this.lc()._onClickUpgrade );
	};
	
	this.test__setTipCallers = function(){
		this.mm.mock(TTIP, 'setCallerData');
		this.lc()._setTipCallers();
		assert ( this.mm.walkLog == 'setCallerData,setCallerData' );
		assert ( this.mm.params['setCallerData.0'][0] == this.lc().m_items.tooltips['$src'] );
		assert ( this.mm.params['setCallerData.0'][1].self == this.dlg );
		assert ( this.mm.params['setCallerData.0'][1].caller == this.lc()._onGetSrcGemTip );
		assert ( this.mm.params['setCallerData.1'][0] == this.lc().m_items.tooltips['$des'] );
		assert ( this.mm.params['setCallerData.1'][1].caller == this.lc()._onGetDesGemTip );
	};
	
	this.test__createGemItem = function(){
		var item = this.lc()._createGemItem(1001);
		assert ( item.resid == 1001 );
		assert ( item.itemres == res_test_items[0] );
	};
	
	this.test__setGemIconAndName = function(){
		this.lc()._setGemIconAndName(this.lc().m_items.srcIcon, this.lc().m_items.srcName, this.lc().m_srcGem);
		assert ( isInclude(IMG.getBKImage(this.lc().m_items.srcIcon), '1001.gif') == true );
		assert ( TQ.getTextEx(this.lc().m_items.srcName) == 'gem1' );
	};
	
	this.test__hasEnoughGems = function(){
		var g_getNoEnoughGemsNumberRt = [0];
		this.mm.mock( this.lc(), '_getNoEnoughGemsNumber', g_getNoEnoughGemsNumberRt);
		
		assert ( this.lc()._hasEnoughGems() == true );
		
		g_getNoEnoughGemsNumberRt[0] = -1;
		assert ( this.lc()._hasEnoughGems() == true );
		
		g_getNoEnoughGemsNumberRt[0] = 1;
		assert ( this.lc()._hasEnoughGems() == false );
	};
	
	this.test__getNoEnoughGemsNumber = function(){
		this.g.getImgr().addItem({resid:1001, number:3});
		assert ( this.lc()._getNoEnoughGemsNumber() == 1 );
		
		this.g.getImgr().addItem({resid:1001, number:1});
		assert ( this.lc()._getNoEnoughGemsNumber() == 0 );
		
		this.g.getImgr().addItem({resid:1001, number:1});
		assert ( this.lc()._getNoEnoughGemsNumber() == -1 );
	};
	
	this.test__getNextLevelGemResId = function(){
		assert ( this.lc()._getNextLevelGemResId(1001) == 1002 );
	};
	
	this.test__onClickUpgrade = function(){
		assert ( this.lc().m_dlg.isShow() == true );
		this.mm.mock(ItemOpSender, 'sendUpgradeGem' );
		this.lc()._onClickUpgrade();
		assert ( this.mm.walkLog == 'sendUpgradeGem' );
		assertListEQ ( this.mm.params['sendUpgradeGem'], [this.g, 3, 2, 1, 1001] );
		assert ( this.lc().m_dlg.isShow() == false );
	};
	
	this.test__onGetSrcGemTip = function(){
		this.mm.mock(TIPM, 'getItemDesc', ['desc']);
		assert ( this.lc()._onGetSrcGemTip() == 'desc' );
		assertListEQ ( this.mm.params['getItemDesc'], [this.lc().m_srcGem] );
	};
	
	this.test__onGetDesGemTip = function(){
		this.mm.mock(TIPM, 'getItemDesc', ['desc']);
		assert ( this.lc()._onGetDesGemTip() == 'desc' );
		assertListEQ ( this.mm.params['getItemDesc'], [this.lc().m_desGem] );
	};

});

tqArmOpDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseGemUtil, 'TestCaseGemUtil');
	suite.addTestCase(TestCaseSysItemMaker, 'TestCaseSysItemMaker');
	suite.addTestCase(TestCaseArmOpDlg, 'TestCaseArmOpDlg');
	suite.addTestCase(TestCaseArmListWithHerosAndArmPos, 'TestCaseArmListWithHerosAndArmPos');
	suite.addTestCase(TestCaseBaseArmOpPanel, 'TestCaseBaseArmOpPanel');
	suite.addTestCase(TestCaseBuyArmOpPanel, 'TestCaseBuyArmOpPanel');
	suite.addTestCase(TestCaseSplitArmOpPanel, 'TestCaseSplitArmOpPanel');
	suite.addTestCase(TestCaseIntensifyArmOpPanel, 'TestCaseIntensifyArmOpPanel');
	suite.addTestCase(TestCaseCombineGemOpPanel, 'TestCaseCombineGemOpPanel');
	suite.addTestCase(TestCaseBesetGemOpPanel, 'TestCaseBesetGemOpPanel');
	suite.addTestCase(TestCaseUpgradeGemDlg, 'TestCaseUpgradeGemDlg');
};