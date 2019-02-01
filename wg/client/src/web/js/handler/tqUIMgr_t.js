//----------------------------------------------------------------------
res_intensify= [];

requireEx('./handler/tqUIMgr.js', [
	{
		start:'//UIMgr-unittest-start'
		,end:'//UIMgr-unittest-end'
		,items:[]
	}
]);
	
TestCaseUIMgr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.assertValidDlg = function(dlgName, dlgClass, isSync){
		if ( !UIM.getDlg(dlgName) ) {
			 assertEQ ( 1, 2, 'dlg Name : "' + dlgName + '", dlg is not reg');
		} else if ( UIM.getDlg(dlgName)._class && UIM.getDlg(dlgName)._class != dlgClass ) {
			assertEQ ( 1, 2, 'dlg Name : "' + dlgName + '", dlg class is wrong');
		} else if ( !(UIM.getDlg(dlgName)._class) && !(UIM.getDlg(dlgName) instanceof dlgClass) ) {
			assertEQ ( 1, 2, 'dlg Name : "' + dlgName + '", dlg class is wrong');
		} else if ( typeof(UIM.getDlg(dlgName).openDlg) != 'function' ) {
			  assertEQ ( 1, 2, 'dlg Name : "' + dlgName + '", dlg has not openDlg function');
		} else if (UIM.isSync(dlgName) != isSync ) {
			 if ( isSync ) {
				assertEQ ( 1, 2, 'dlg Name : "' + dlgName + '", dlg is not sync');
			 } else {
				 assertEQ ( 1, 2, 'dlg Name : "' + dlgName + '", dlg is sync');
			 }
		} else if ( dlgClass.snew && !(UIM.getDlg(dlgName).Super) && !(UIM.getDlg(dlgName)._super) ) {
			 assertEQ ( 1, 2, 'dlg Name : "' + dlgName + '", dlg is class, need use snew create');
		}
	};
	
	this.test_closeMapPanels = function(){
		UIM.getPanel('farm').getModel().setOpState(FARMOP_STATE.INIT);
		this.mm.mock(UIM.getPanel('statecity'), 'hide');
		this.mm.mock(UIM.getPanel('statecity'), 'setActive');
		this.mm.mock(UIM.getPanel('inbuild'), 'hide');
		this.mm.mock(UIM.getPanel('inbuild'), 'setActive');
		this.mm.mock(UIM.getPanel('farm'), 'hide');
		this.mm.mock(UIM.getPanel('farm'), 'setActive');
		this.mm.mock(UIM.getPanel('field'), 'hide');
		this.mm.mock(UIM.getPanel('field'), 'setActive');
		this.mm.mock(UIM.getPanel('main').getSubCityPanels(), 'hideAllPanels');
		this.mm.mock(UIM.getDlg('selpip'), 'closeDlg' );
		UIM.closeMapPanels();
		assertEQ ( this.mm.walkLog, 'hide,setActive,hide,setActive,hide,setActive,hide,setActive,hideAllPanels,closeDlg' );
		assertEQ ( this.mm.params['setActive.0'], [false] );
		assertEQ ( this.mm.params['setActive.1'], [false] );
		assertEQ ( this.mm.params['setActive.2'], [false] );
		assertEQ ( this.mm.params['setActive.3'], [false] );
		assertEQ ( UIM.getPanel('farm').getModel().getOpState(), FARMOP_STATE.SEL );
	};

	this.test_getDlg = function(){
		var RES_SYNC = true;
		var NORES_SYNC = false;
		
		this.assertValidDlg('buyitem', BuyItemDlg, RES_SYNC);
		this.assertValidDlg('mainselbuild', MainCitySelBuildDlg, RES_SYNC);
		this.assertValidDlg('createsubcity', CreateSubCityDlg, RES_SYNC);
		this.assertValidDlg('buildinginfo', BuildingInfoDlg, RES_SYNC);
		this.assertValidDlg('uselistitem', UseListItemDlg, RES_SYNC);
		this.assertValidDlg('steellist', SteelListDlg, NORES_SYNC);
		this.assertValidDlg('steelhero', SteelHeroDlg, RES_SYNC);
		this.assertValidDlg('selectsteeltype', SelectSteelTypeDlg, NORES_SYNC);
		this.assertValidDlg('friend', FriendDlg, RES_SYNC);
		this.assertValidDlg('citydef', CityDefDlg, NORES_SYNC);
		this.assertValidDlg('hospital', HospitalDlg, NORES_SYNC);
		this.assertValidDlg('resprotect', ResProtectDlg, RES_SYNC);
		this.assertValidDlg('jitan', JiTanDlg, RES_SYNC);
		this.assertValidDlg('selecticon', SelectIconDlg, RES_SYNC);
		this.assertValidDlg('fightmap', FightMapDlg, NORES_SYNC);
		this.assertValidDlg('selfallimemlist', SelfAlliMemListDlg, NORES_SYNC);
		this.assertValidDlg('otherallimemlist', OtherAlliMemListDlg, NORES_SYNC);
		this.assertValidDlg('allitransfer', AlliTransferDlg, RES_SYNC);
		this.assertValidDlg('alliuntransfer', AlliUnTransferDlg, RES_SYNC);
		this.assertValidDlg('allisubscribe', AlliSubscribeDlg, NORES_SYNC);
		this.assertValidDlg('alliapplylist', AlliApplyListDlg, NORES_SYNC);
		this.assertValidDlg('allimerge', AlliMergeDlg, RES_SYNC);
		this.assertValidDlg('allimeminfo', AlliMemInfoDlg, RES_SYNC);
		this.assertValidDlg('alliauctionbuy', AlliAuctionBuyDlg, RES_SYNC);
		this.assertValidDlg('allimysell', AlliMySellDlg, RES_SYNC);
		this.assertValidDlg('reinforcement', ReinforcementDlg, NORES_SYNC);
		this.assertValidDlg('tradingarea', TradingAreaDlg, NORES_SYNC);
		this.assertValidDlg('settradingarea', SetTradingAreaDlg, NORES_SYNC);
		this.assertValidDlg('acttower', ActTowerDlg, NORES_SYNC);
		this.assertValidDlg('acttowerexped', ActTowerExpedDlg, NORES_SYNC);
		this.assertValidDlg('tipmsgbox', TipMsgBox, RES_SYNC);
		this.assertValidDlg('diecitysetpos', DieCitySetPos, NORES_SYNC);
		this.assertValidDlg('actskiplayer', ActSkipLayerDlg, NORES_SYNC);
		this.assertValidDlg('actgainskiplayergift', ActGainSkipLayerGiftDlg, NORES_SYNC);
		this.assertValidDlg('acttowerlastgetgifts', ActTowerLastGetGiftsDlg, NORES_SYNC);
		this.assertValidDlg('actterrace', ActTerraceDlg, NORES_SYNC);
		this.assertValidDlg('actterraceexped', ActTerraceExpedDlg, NORES_SYNC);
		this.assertValidDlg('activityval', ActivityValDlg, NORES_SYNC);
		this.assertValidDlg('rank', RankDlg, NORES_SYNC);
		this.assertValidDlg('imghelp', ImgHelpDlg, NORES_SYNC);
		this.assertValidDlg('newcomerhelper', NewcomerHelper, NORES_SYNC);
		this.assertValidDlg('exchange', ExchangeDlg, NORES_SYNC);
		this.assertValidDlg('buygold', BuyGoldDlg, RES_SYNC);
		this.assertValidDlg('yellowdiamond', YellowdiamondDlg, NORES_SYNC);
		this.assertValidDlg('payact', PayActDlg, NORES_SYNC);
		this.assertValidDlg('autobuild', AutoBuildDlg, NORES_SYNC);
		this.assertValidDlg('vip', VipDlg, NORES_SYNC);
		this.assertValidDlg('bluediamond', BluediamondDlg, NORES_SYNC);
		this.assertValidDlg('blue3366diamond', Blue3366DiamondDlg, NORES_SYNC);
		
		this.assertValidDlg('worldboss', WorldBossDlg, NORES_SYNC);
		this.assertValidDlg('worldbossrank', WorldBossRankDlg, NORES_SYNC);
		this.assertValidDlg('worldbossresult', WorldBossResultDlg, RES_SYNC);
		this.assertValidDlg('gonggao', GongGaoDlg, RES_SYNC);
		this.assertValidDlg('npc', NpcDlg, RES_SYNC);
		this.assertValidDlg('bindguest', BindGuestDlg, RES_SYNC);
		this.assertValidDlg('waiting', WaitingDlg, RES_SYNC);
		
		if ( TQ.isMobile() ) {
			this.assertValidDlg('chatpanel', ChatPanelDlg, NORES_SYNC);
		}
	};
	
	this.test_closeAllFieldDlg = function(){
		this.mm.mock(UIM.getDlg('rolecity'), 'closeDlg');
		this.mm.mock(UIM.getDlg('selffield'), 'closeDlg');
		this.mm.mock(UIM.getDlg('field'), 'closeDlg');
		this.mm.mock(UIM.getDlg('emptyfield'), 'closeDlg');
		UIM.closeAllFieldDlg();
		assertEQ ( this.mm.walkLog, 'closeDlg,closeDlg,closeDlg,closeDlg' );
	};
});

tqUIMgr_t_main = function(suite) {
	suite.addTestCase(TestCaseUIMgr, 'TestCaseUIMgr');
};
