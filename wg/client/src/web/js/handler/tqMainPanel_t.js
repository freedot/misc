/////////////////////////////////////////////////////////////////////////////////
require('./tqChatHandler.js');

requireEx('./handler/tqMainPanel.js', [
	{
		start:'//SelCityTool-unittest-start'
		,end:'//SelCityTool-unittest-end'
		,items:['m_this'
			,'m_g'
			,'m_items'
			,'_onClickMyCityBtn'
			,'_onClickOutFieldBtn'
			,'_onClickMyFarmBtn'
			,'_onClickMyStateCityBtn'
			,'_resetBtns'
			,'_isMyCity'
			,'_isOutField'
			,'_isMyFarm'
			,'_isMyStateCity'
			,'_setCaller'
			]
	}
	,{
		start:'//MainPanel-testunit-start'
		,end:'//MainPanel-testunit-end'
		,items:['m_this'
			,'m_g'
			,'m_items'
			]
	}
	,{
		start:'//MainToolbar-testunit-start'
		,end:'//MainToolbar-testunit-end'
		,items:[
			'm_btns'
			,'m_items'
			,'C_BTN_LETTER_ID'
			]
	}
	,{
		start:'//SmallMapBtnBar-testunit-start'
		,end:'//SmallMapBtnBar-testunit-end'
		,items:['m_g'
			,'m_this'
			,'m_items'
			,'C_LETTER_INTERVAL'
			,'_setCallers'
			,'_regEvents'
			,'_onClickShopBtn'
			,'_onClickRankBtn'
			,'_onClickLetterBtn'
			,'_onClickExchangeBtn'
			,'_onNewLetter'
			]
	}
	,{
		start:'//QueueMsgBtn-testunit-start'
		,end:'//QueueMsgBtn-testunit-end'
		,items:['m_dom']
	}
	,{
		start:'//SubCityBtnsBar-testunit-start'
		,end:'//SubCityBtnsBar-testunit-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_btns'
			,'m_items'
			,'_initParams'
			,'_setCallers'
			,'_regEvents'
			,'_setBtnsTipCaller'			
			,'_onClickSubCity'
			,'_onClickSelfField'
			,'_onClickEmptySubCityBtn'
			,'_onClickExistSubCityBtn'
			,'_hasSubCity'
			,'_hasEnoughCityLevel'
			,'_getSubCityPanel'
			,'_onCityTypesUpdate'
			,'_onSetCityLevel'
			,'_setBtnsImage'
			,'_setBtnEnableState'
			,'_setBtnUIBack'
			,'_onGetToolTip'
			,'_setCurSubCityId'
			,'_setAllBtnsNormalState'
			,'_setCurBtnPressState'
			]
	}
	,{
		start:'//SubCityPanels-testunit-start'
		,end:'//SubCityPanels-testunit-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_mapDom'
			,'m_panels'
			,'_initParams'
			,'_regEvents'
			,'_onCityTypesUpdate'
			,'_isNeedCreate'
			,'_destroyLastPanel'			
			,'_createPanel'
			,'_openNewPanel'
			]
	}
])

TestCaseSelCityTool = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		var myCityBtn = new ComButton(this.g, MockDomEx.snew());
		myCityBtn.setId(1);
		
		var outFieldBtn = new ComButton(this.g, MockDomEx.snew());
		outFieldBtn.setId(2);
		
		var myFarmBtn = new ComButton(this.g, MockDomEx.snew());
		myFarmBtn.setId(3);
		
		var myStateCityBtn = new ComButton(this.g, MockDomEx.snew());
		myStateCityBtn.setId(4);
		
		this.items = {myCityBtn: myCityBtn,
			outFieldBtn:outFieldBtn,
			myFarmBtn:myFarmBtn,
			myStateCityBtn:myStateCityBtn};
			
		this.selCityTool = SelCityTool.snew(this.g, this.items );
		
		this.lc = this.selCityTool.lc;
		//UIM.forceRegPanel('inbuild', MockDialog.snew());
		if (!UIM.getPanel('farm')) UIM.regPanel('farm', MockDialog.snew());
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_onClickMyCityBtn = function() {
		var mm = MethodMock.snew();
		mm.mock( UIM, 'closeMapPanels', function() {
			mm.walkLog = 'closeMapPanels';
			});
		mm.mock( UIM.getPanel('inbuild'), 'open', function(){
			mm.walkLog += ',open';
			});
			
		this.lc()._onClickMyCityBtn();
		mm.restore();
		
		assert ( mm.walkLog == 'closeMapPanels,open' );
	};
	
	this.test__onClickOutFieldBtn = function(){
		this.mm.mock( UIM, 'closeMapPanels' );
		this.mm.mock( UIM.getPanel('field'), 'open' );
		this.lc()._onClickOutFieldBtn();
		assertEQ ( this.mm.walkLog, 'closeMapPanels,open' );
	};
	
	this.test_onClickMyFarmBtn = function() {
		var mm = MethodMock.snew();
		mm.mock( UIM, 'closeMapPanels', function() {
			mm.walkLog = 'closeMapPanels';
			});
		mm.mock( UIM.getPanel('farm'), 'open', function(){
			mm.walkLog += ',open';
			});
			
		this.lc()._onClickMyFarmBtn();
		mm.restore();
		
		assert ( mm.walkLog == 'closeMapPanels,open' );
	};
	
	this.test_onClickMyStateCityBtn = function(){
		var mm = MethodMock.snew();
		mm.mock( this.g.getImgr(), 'getStateCity', function() {
			return 1 ; });
		this.lc()._onClickMyStateCityBtn();
		mm.restore();
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.MAP+',subcmd=1,id=1}' );
	};
	
	this.test_resetBtns = function(){
		var mm = MethodMock.snew();
		mm.mock( this.lc().m_items.myCityBtn, 'setPress', function(press) {
			mm.press1 = press; });
		mm.mock( this.lc().m_items.myCityBtn, 'getId', function(press) {
			return 1; });
		mm.mock( this.lc().m_items.myStateCityBtn, 'setPress', function(press) {
			mm.press4 = press; });
		mm.mock( this.lc().m_items.myStateCityBtn, 'getId', function(press) {
			return 4; });
			
		this.lc()._resetBtns(1);
		assert ( mm.press1 == true );
		assert ( mm.press4 == false );
		
		this.lc()._resetBtns(2);
		assert ( mm.press1 == false );
		assert ( mm.press4 == false );
		
		this.lc()._resetBtns(4);
		mm.restore();
		assert ( mm.press1 == false );
		assert ( mm.press4 == true );
	};
	
	this.test_isMyCity = function(){
		assert ( this.lc()._isMyCity(-1) == false );
		assert ( this.lc()._isMyCity(FIXID.MAINCITY) == true );
	};
	
	this.test_isOutField = function(){
		assert ( this.lc()._isOutField(-1) == false );
		assert ( this.lc()._isOutField(FIXID.OUTFIELD) == true );
	};
	
	this.test_isMyFarm = function(){
		assert ( this.lc()._isMyFarm(-1) == false );
		
		var mm = MethodMock.snew();
		mm.mock( UIM.getPanel('farm'), 'isMyCurFarm', function() { return true; });
		assert ( this.lc()._isMyFarm(FIXID.FARMMAP) == true );
		mm.restore();
		
		var mm = MethodMock.snew();
		mm.mock( UIM.getPanel('farm'), 'isMyCurFarm', function() { return false; });
		assert ( this.lc()._isMyFarm(FIXID.FARMMAP) == false );
		mm.restore();
	};
	
	this.test_isMyStateCity = function(){
		var mm = MethodMock.snew();
		mm.mock( this.g.getImgr(), 'getStateCity', function() { return 1; });
		assert ( this.lc()._isMyStateCity(1) == true );
		assert ( this.lc()._isMyStateCity(2) == false );
		mm.restore();
	};
	
	this.test_setCaller = function(){
		var mm = MethodMock.snew();
		mm.mock( this.lc().m_items.myCityBtn, 'setCaller', function(caller) { mm.caller1 = caller; } );
		mm.mock( this.lc().m_items.outFieldBtn, 'setCaller', function(caller) { mm.caller2 = caller; } );
		mm.mock( this.lc().m_items.myFarmBtn, 'setCaller', function(caller) { mm.caller3 = caller; } );
		mm.mock( this.lc().m_items.myStateCityBtn, 'setCaller', function(caller) { mm.caller4 = caller; } );
		
		this.lc()._setCaller();
		mm.restore();
		
		assert ( mm.caller1.self == this.selCityTool );
		assert ( mm.caller2.self == this.selCityTool );
		assert ( mm.caller3.self == this.selCityTool );
		assert ( mm.caller4.self == this.selCityTool );
		
		assert ( mm.caller1.caller == this.lc()._onClickMyCityBtn );
		assert ( mm.caller2.caller == this.lc()._onClickOutFieldBtn );
		assert ( mm.caller3.caller == this.lc()._onClickMyFarmBtn );
		assert ( mm.caller4.caller == this.lc()._onClickMyStateCityBtn );
	};
	
	this.test_setCurLoadCity = function(){
		var mm = MethodMock.snew();
		mm.mock( UIM.getPanel('farm'), 'isMyCurFarm', function() { return true; });
		mm.mock( this.g.getImgr(), 'getStateCity', function() { return 100000000; });
		
		this.selCityTool.setCurLoadCity(-1);
		assert ( this.lc().m_items.myCityBtn.isPress() == false );
		assert ( this.lc().m_items.outFieldBtn.isPress() == false );
		assert ( this.lc().m_items.myFarmBtn.isPress() == false );
		assert ( this.lc().m_items.myStateCityBtn.isPress() == false );
		
		this.selCityTool.setCurLoadCity(FIXID.MAINCITY);
		assert ( this.lc().m_items.myCityBtn.isPress() == true );
		assert ( this.lc().m_items.outFieldBtn.isPress() == false );
		assert ( this.lc().m_items.myFarmBtn.isPress() == false );
		assert ( this.lc().m_items.myStateCityBtn.isPress() == false );
		
		this.selCityTool.setCurLoadCity(FIXID.OUTFIELD);
		assert ( this.lc().m_items.myCityBtn.isPress() == false );
		assert ( this.lc().m_items.outFieldBtn.isPress() == true );
		assert ( this.lc().m_items.myFarmBtn.isPress() == false );
		assert ( this.lc().m_items.myStateCityBtn.isPress() == false );
		
		this.selCityTool.setCurLoadCity(FIXID.FARMMAP);
		assert ( this.lc().m_items.myCityBtn.isPress() == false );
		assert ( this.lc().m_items.outFieldBtn.isPress() == false );
		assert ( this.lc().m_items.myFarmBtn.isPress() == true );
		assert ( this.lc().m_items.myStateCityBtn.isPress() == false );
		
		this.selCityTool.setCurLoadCity(100000000);
		assert ( this.lc().m_items.myCityBtn.isPress() == false );
		assert ( this.lc().m_items.outFieldBtn.isPress() == false );
		assert ( this.lc().m_items.myFarmBtn.isPress() == false );
		assert ( this.lc().m_items.myStateCityBtn.isPress() == true );
		
		mm.restore();
	};
	
	this.test_init = function(){
		assert ( this.lc().m_this == this.selCityTool );
		assert ( this.lc().m_g == this.g );
		assert ( this.lc().m_items == this.items );
	};
});


TestCaseMainPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		//this.mainPanel = new MainPanel(this.g);
		//this.lc = this.mainPanel.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getStateBuffBar = function(){
		assertEQ ( UIM.getPanel('main').getStateBuffBar() instanceof StateBuffBar, true );
		assertEQ ( UIM.getPanel('main').getTaskGuide() instanceof TaskGuide, true );
		//assertEQ ( UIM.getPanel('main').getOnlineTask() instanceof OnlineTaskPanel, true );
		assertEQ ( UIM.getPanel('main').getOnlineGoods() instanceof OnlineGoodsPanel, true );
	};
	
	this.test_clickGameSuggestBtn = function(){
		this.mm.travelMock(UIM.getDlg('inputareatext'), 'openDlg');
		this.mm.mock(LogSender, 'sendSuggest');
		
		UIM.getPanel('main').getItems().gameSuggestBtn.click();
		assertEQ ( this.mm.params['openDlg'], [rstr.gameSuggest.title, '', rstr.gameSuggest.desc, 512] );
		
		UIM.getDlg('inputareatext').setContent('content');
		UIM.getDlg('inputareatext').clickOk();
		assertEQ ( this.mm.params['sendSuggest'], [this.g, 'content'] );
	};
	
	this.test_evidentSuggestBtnWhenLowBuildVal = function(){
		UIM.getPanel('main').regEvents();
		var suggestBtn = UIM.getPanel('main').getItems().gameSuggestBtn;
		assert ( suggestBtn.getUIBack() == uiback.btn.suggest );
		
		this.g.getImgr().getCityRes().buildval.cur = 1000;
		this.g.sendEvent({eid:EVT.CITYRES, sid:0});
		assert ( suggestBtn.getUIBack() == uiback.btn.suggest_new );
		
		this.g.getImgr().getCityRes().buildval.cur = 1999;
		this.g.sendEvent({eid:EVT.CITYRES, sid:0});
		assert ( suggestBtn.getUIBack() == uiback.btn.suggest_new );
		
		this.g.getImgr().getCityRes().buildval.cur = 2000;
		this.g.sendEvent({eid:EVT.CITYRES, sid:0});
		assert ( suggestBtn.getUIBack() == uiback.btn.suggest );
	};
});

TestCaseMainToolbar = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.mainToolbar = new MainToolbar(this.g, UIM.getPanel('main').getItems() );
		this.lc = this.mainToolbar.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_startAllianceBlinking = function(){
		this.mm.mock(this.lc().m_items.mbtn_alli, 'startBlinking');
		this.mainToolbar.startAllianceBlinking(30)
		assertEQ ( this.mm.params['startBlinking'], [30] );
	};
	
	this.test_stopAllianceBlinking= function(){
		this.mm.mock(this.lc().m_items.mbtn_alli, 'stopBlinking');
		this.mainToolbar.stopAllianceBlinking()
		assertEQ ( this.mm.params['stopBlinking'], [] );
	};
	
	this.test_onNewLetter = function(){
	};
});

TestCaseSmallMapBtnBar = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.bar = SmallMapBtnBar.snew(this.g, UIM.getPanel('main').getItems());
		this.lc = this.bar.lc;
		HDRM.regHdr('clientcfg', ClientCfgHandler.snew(this.g));
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_setCallers');
		this.mm.mock(this.lc(), '_regEvents');
		this.bar.init(this.g, UIM.getPanel('main').getItems());
		assertEQ ( this.mm.walkLog, '_setCallers,_regEvents');
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.bar );
		assertEQ ( this.lc().m_items, UIM.getPanel('main').getItems() );
	};
	
	this.test_getBtnSize = function(){
		assertEQ ( this.bar.getBtnSize(), {cx:26, cy:26});
	};	
	
	this.test__setCallers = function(){
		this.mm.mock( this.lc().m_items.smbtn_shop, 'setCaller' );
		this.mm.mock( this.lc().m_items.smbtn_rank, 'setCaller' );
		this.mm.mock( this.lc().m_items.smbtn_letter, 'setCaller' );
		this.mm.mock( this.lc().m_items.smbtn_exchange, 'setCaller' );
		this.mm.mock( SoundMgr, 'toggleBackSound' );
		this.lc()._setCallers();
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.bar, caller:this.lc()._onClickShopBtn}] );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.bar, caller:this.lc()._onClickRankBtn}] );
		assertEQ ( this.mm.params['setCaller.2'], [{self:this.bar, caller:this.lc()._onClickLetterBtn}] );
		assertEQ ( this.mm.params['setCaller.3'], [{self:this.bar, caller:this.lc()._onClickExchangeBtn}] );
		
		this.lc().m_items.smbtn_toggle_bgsound.click();
		assertEQ ( this.mm.params['toggleBackSound'], [] );
	};
	
	this.test_openDlgs = function(){
		this.lc().m_items.smbtn_shop.click();
		assertEQ ( UIM.getDlg('shop').isShow(), true );
		this.lc().m_items.smbtn_shop.click();
		assertEQ ( UIM.getDlg('shop').isShow(), false );
		
		this.lc().m_items.smbtn_rank.click();
		assertEQ ( UIM.getDlg('rank').isShow(), true );
		this.lc().m_items.smbtn_rank.click();
		assertEQ ( UIM.getDlg('rank').isShow(), false );
		
		this.lc().m_items.smbtn_letter.click();
		assertEQ ( UIM.getDlg('letter').isShow(), true );
		this.lc().m_items.smbtn_letter.click();
		assertEQ ( UIM.getDlg('letter').isShow(), false );
		
		this.lc().m_items.smbtn_exchange.click();
		assertEQ ( UIM.getDlg('exchange').isShow(), true );
		this.lc().m_items.smbtn_exchange.click();
		assertEQ ( UIM.getDlg('exchange').isShow(), false );
	};
	
	this.test__regEvents = function(){
		this.mm.mock(this.g, 'regEvent');
		this.lc()._regEvents();
		assertListEQ ( this.mm.params['regEvent.0'], [EVT.NEW_MAIL, 0, this.bar, this.lc()._onNewLetter]);
	};
	
	this.test__onClickShopBtn = function(){
		UIM.getDlg('shop').hideDlg();
		this.mm.mock(UIM, 'openDlg' );
		this.lc()._onClickShopBtn();
		assertEQ ( this.mm.params['openDlg'], ['shop', 0] );
	};
	
	this.test__onClickRankBtn = function(){
		this.mm.mock(UIM, 'openDlg' );
		this.lc()._onClickRankBtn();
		assertEQ ( this.mm.params['openDlg'], ['rank'] );
	};
	
	this.test__onClickLetterBtn = function(){
		this.mm.mock(UIM, 'openDlg' );
		this.mm.mock(this.lc().m_items.smbtn_letter, 'stopBlinking');
		this.lc()._onClickLetterBtn();
		assertEQ ( this.mm.walkLog, 'openDlg,stopBlinking' );
		assertEQ ( this.mm.params['openDlg'], ['letter'] );
	};
	
	this.test__onClickExchangeBtn = function(){
		UIM.getDlg('exchange').hideDlg();
		this.mm.mock(UIM, 'openDlg' );
		this.lc()._onClickExchangeBtn();
		assertEQ ( this.mm.params['openDlg'], ['exchange'] );
	};
	
	this.test__onNewLetter = function(){
		this.mm.mock(this.lc().m_items.smbtn_letter, 'startBlinking');
		this.mm.mock(this.lc().m_items.smbtn_letter, 'stopBlinking');
		var evt = {start:1};
		this.lc()._onNewLetter(evt);
		assertEQ ( this.mm.walkLog, 'startBlinking' );
		assertEQ ( this.mm.params['startBlinking'], [this.lc().C_LETTER_INTERVAL] );
		
		this.mm.clear();
		evt = {stop:1};
		this.lc()._onNewLetter(evt);
		assertEQ ( this.mm.walkLog, 'stopBlinking' );
	};
});

TestCaseQueueMsgBtn = TestCase.extern(function(){
	this.setUp = function(){
		this.g = g_app;
		this.queueBar = new QueueMsgBtn(this.g);
		this.lc = this.queueBar.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.test_setPosition = function(){
		var mm = MMock.snew();
		mm.mock(TQ, 'setDomPos');
		
		this.lc().m_dom = null;
		this.queueBar.setPosition({x:1, y:2});
		assert ( mm.walkLog == '' );
		
		mm.clear();
		this.lc().m_dom = {};
		this.queueBar.setPosition({x:1, y:2});
		assert ( mm.walkLog == 'setDomPos' );
		assertListEQ ( mm.params['setDomPos'], [this.lc().m_dom, 1, 2] );
		
		mm.restore();
	};
});

TestCaseSubCityBtnsBar = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.items = UIM.getPanel('main').getItems();
		this.bar = SubCityBtnsBar.snew(this.g, this.items);
		this.lc = this.bar.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock ( this.lc(), '_initParams' );
		this.mm.mock ( this.lc(), '_setCallers' );
		this.mm.mock ( this.lc(), '_regEvents' );
		this.mm.mock ( this.lc(), '_setBtnsTipCaller' );
		this.bar.init ( this.g, this.items );
		assertEQ ( this.mm.walkLog, '_initParams,_setCallers,_regEvents,_setBtnsTipCaller' );
		assertEQ ( this.mm.params['_initParams'], [this.bar, this.g, this.items] );
	};
	
	this.test_setCurSubCityId = function(){
		this.mm.mock(this.lc(), '_setCurSubCityId');
		this.mm.mock(this.lc(), '_setAllBtnsNormalState');
		this.mm.mock(this.lc(), '_setCurBtnPressState');
		
		var p_cityId = 2;
		this.bar.setCurSubCityId(p_cityId);
		assertEQ ( this.mm.walkLog, '_setCurSubCityId,_setAllBtnsNormalState,_setCurBtnPressState' );
		assertEQ ( this.mm.params['_setCurSubCityId'], [p_cityId] );
	};
	
	this.test__initParams = function(){
		this.lc()._initParams(this.bar, this.g, this.items);
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.bar );
		assertEQ ( this.lc().m_items, this.items );
	};
	
	this.test__setCallers = function(){
		this.mm.mock ( this.items.city1btn, 'setCaller' );
		this.mm.mock ( this.items.city2btn, 'setCaller' );
		this.mm.mock ( this.items.city3btn, 'setCaller' );
		this.mm.mock ( this.items.city4btn, 'setCaller' );
		this.mm.mock ( this.items.myfieldsBtn, 'setCaller' );
		this.lc()._setCallers();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller,setCaller,setCaller,setCaller' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.bar, caller:this.lc()._onClickSubCity}] );
		assertEQ ( this.mm.params['setCaller.3'], [{self:this.bar, caller:this.lc()._onClickSubCity}] );
		assertEQ ( this.mm.params['setCaller.4'], [{self:this.bar, caller:this.lc()._onClickSelfField}] );
	};
	
	this.test__regEvents = function(){
		this.mm.mock(this.g, 'regEvent');
		this.lc()._regEvents();
		assertEQ ( this.mm.walkLog, 'regEvent,regEvent' );
		assertEQ ( this.mm.params['regEvent.0'], [EVT.CITYTYPES, 0, this.bar, this.lc(). _onCityTypesUpdate] );
		assertEQ ( this.mm.params['regEvent.1'], [EVT.SETCITYLEVEL, 0, this.bar, this.lc(). _onSetCityLevel] );
	};
	
	this.test__onCityTypesUpdate = function(){
		this.mm.mock(this.lc(), '_setBtnsImage' );
		this.lc()._onCityTypesUpdate();
		assertEQ ( this.mm.walkLog, '_setBtnsImage' );
	};
	
	this.test__onSetCityLevel = function(){
		this.mm.mock(this.lc(), '_setBtnsImage' );
		this.lc()._onSetCityLevel();
		assertEQ ( this.mm.walkLog, '_setBtnsImage' );
	};
	
	this.test__setBtnsImage = function(){
		this.mm.mock ( this.lc(), '_setBtnEnableState' );
		this.mm.mock ( this.lc(), '_setBtnUIBack' );
		this.lc()._setBtnsImage();
		assertEQ ( this.mm.walkLog, '_setBtnEnableState,_setBtnUIBack,_setBtnEnableState,_setBtnUIBack,_setBtnEnableState,_setBtnUIBack,_setBtnEnableState,_setBtnUIBack' );
		assertEQ ( this.mm.params['_setBtnEnableState.0'], [this.items.city1btn] );
		assertEQ ( this.mm.params['_setBtnUIBack.0'], [this.items.city1btn] );
		assertEQ ( this.mm.params['_setBtnEnableState.3'], [this.items.city4btn] );
		assertEQ ( this.mm.params['_setBtnUIBack.3'], [this.items.city4btn] );
	};
	
	this.test__setBtnEnableState = function(){
		var r_hasSubCity = [false];
		var r_hasEnoughCityLevel = [false];
		this.mm.mock( this.lc(), '_hasSubCity', r_hasSubCity );
		this.mm.mock( this.lc(), '_hasEnoughCityLevel', r_hasEnoughCityLevel );
		this.mm.mock( this.items.city1btn, 'enable' );
		
		this.lc()._setBtnEnableState(this.items.city1btn);
		assertEQ ( this.mm.params['enable'], [false] );
		assertEQ ( this.mm.params['_hasSubCity'], [BUILDCITY_ID.SUB1] );
		assertEQ ( this.mm.params['_hasEnoughCityLevel'], [BUILDCITY_ID.SUB1] );
		
		this.mm.clear();
		r_hasSubCity[0] = true;
		r_hasEnoughCityLevel[0] = false;
		this.lc()._setBtnEnableState(this.items.city1btn);
		assertEQ ( this.mm.params['enable'], [true] );
		
		this.mm.clear();
		r_hasSubCity[0] = false;
		r_hasEnoughCityLevel[0] = true;
		this.lc()._setBtnEnableState(this.items.city1btn);
		assertEQ ( this.mm.params['enable'], [true] );
		
		this.mm.clear();
		r_hasSubCity[0] = true;
		r_hasEnoughCityLevel[0] = true;
		this.lc()._setBtnEnableState(this.items.city1btn);
		assertEQ ( this.mm.params['enable'], [true] );
	};
	
	this.test__setBtnUIBack = function(){
		this.g.getImgr().getCityTypes()[1] = CITY_TYPE.SUBRES;
		this.g.getImgr().getCityTypes()[2] = CITY_TYPE.SUBARMY;
		this.g.getImgr().getCityTypes()[3] = CITY_TYPE.NONE;
		this.g.getImgr().getCityTypes()[4] = CITY_TYPE.NONE;
		
		this.mm.mock( this.items.city1btn, 'resetUIBack' );
		this.mm.mock( this.items.city2btn, 'resetUIBack' );
		this.mm.mock( this.items.city3btn, 'resetUIBack' );
		
		this.mm.clear();
		this.lc()._setBtnUIBack(this.items.city1btn);
		assertEQ ( this.mm.params['resetUIBack'], [uiback.btn.subCityBtns.resBtn] );
		
		this.mm.clear();
		this.lc()._setBtnUIBack(this.items.city2btn);
		assertEQ ( this.mm.params['resetUIBack'], [uiback.btn.subCityBtns.militaryBtn] );
		
		this.mm.clear();
		this.lc()._setBtnUIBack(this.items.city3btn);
		assertEQ ( this.mm.params['resetUIBack'], [uiback.btn.subCityBtns.emptyBtn] );
	};
	
	this.test__setBtnsTipCaller = function(){
		this.mm.mock( TTIP, 'setCallerData' );
		this.lc()._setBtnsTipCaller();
		assertEQ ( this.mm.walkLog, 'setCallerData,setCallerData,setCallerData,setCallerData' );
		assertEQ ( this.mm.params['setCallerData.0'], [this.lc().m_items.tooltips[TIP_PREFIX + 'city1Btn'], {self:this.bar, caller:this.lc()._onGetToolTip}, {idx:0}] );
		assertEQ ( this.mm.params['setCallerData.1'], [this.lc().m_items.tooltips[TIP_PREFIX + 'city2Btn'], {self:this.bar, caller:this.lc()._onGetToolTip}, {idx:1}] );
		assertEQ ( this.mm.params['setCallerData.2'], [this.lc().m_items.tooltips[TIP_PREFIX + 'city3Btn'], {self:this.bar, caller:this.lc()._onGetToolTip}, {idx:2}] );
		assertEQ ( this.mm.params['setCallerData.3'], [this.lc().m_items.tooltips[TIP_PREFIX + 'city4Btn'], {self:this.bar, caller:this.lc()._onGetToolTip}, {idx:3}] );
	};
	
	this.test__onGetToolTip = function(){
		var r_hasSubCity = [true];
		var r_hasEnoughCityLevel = [true];
		this.mm.mock(this.lc(), '_hasSubCity', r_hasSubCity);
		this.mm.mock(this.lc(), '_hasEnoughCityLevel', r_hasEnoughCityLevel);
		
		assertEQ ( this.lc()._onGetToolTip({idx:0}), rstr.createSubCity.tip.enterCity);
		assertEQ ( this.mm.params['_hasSubCity'], [BUILDCITY_ID.SUB1] );
		
		this.mm.clear();
		r_hasSubCity[0] = false;
		assertEQ ( this.lc()._onGetToolTip({idx:0}), rstr.createSubCity.tip.createCity);
		assertEQ ( this.mm.params['_hasEnoughCityLevel'], [BUILDCITY_ID.SUB1] );
		
		this.mm.clear();
		r_hasEnoughCityLevel[0] = false;
		assertEQ ( this.lc()._onGetToolTip({idx:0}),  TQ.format(rstr.createSubCity.tip.needCityLevel, RStrUtil.getCityNameByLevel(4)) );
	};
	
	this.test__onClickSubCity = function(){
		var r_hasSubCity = [false];
		this.mm.mock(this.lc(), '_hasSubCity', r_hasSubCity);
		this.mm.mock(this.lc(), '_onClickEmptySubCityBtn' );
		this.mm.mock(this.lc(), '_onClickExistSubCityBtn' );
		
		var p_cityId = 2;
		this.lc()._onClickSubCity(p_cityId);
		assertEQ ( this.mm.walkLog, '_hasSubCity,_onClickEmptySubCityBtn' );
		assertEQ ( this.mm.params['_hasSubCity'], [p_cityId] );
		assertEQ ( this.mm.params['_onClickEmptySubCityBtn'], [p_cityId] );
		
		this.mm.clear();
		r_hasSubCity[0] = true;
		this.lc()._onClickSubCity(p_cityId);
		assertEQ ( this.mm.walkLog, '_hasSubCity,_onClickExistSubCityBtn' );
		assertEQ ( this.mm.params['_onClickExistSubCityBtn'], [p_cityId] );
	};
	
	this.test__onClickSelfField = function(){
		this.mm.mock(UIM, 'openDlg');
		this.lc()._onClickSelfField();
		assertEQ ( this.mm.params['openDlg'], ['selffieldslist'] );
	};
	
	this.test__hasSubCity = function(){
		this.g.getImgr().getCityTypes()[1] = CITY_TYPE.SUBRES;
		this.g.getImgr().getCityTypes()[2] = CITY_TYPE.NONE;
		this.g.getImgr().getCityTypes()[3] = CITY_TYPE.NONE;
		this.g.getImgr().getCityTypes()[4] = CITY_TYPE.NONE;
		
		assertEQ ( this.lc()._hasSubCity(BUILDCITY_ID.SUB1), true );
		assertEQ ( this.lc()._hasSubCity(BUILDCITY_ID.SUB2), false );
	};
	
	this.test__onClickEmptySubCityBtn = function(){
		var r_hasEnoughCityLevel = [false];
		this.mm.mock(this.lc(), '_hasEnoughCityLevel', r_hasEnoughCityLevel);
		this.mm.mock(this.g.getGUI(), 'sysMsgTips', r_hasEnoughCityLevel);
		this.mm.mock(UIM, 'openDlg');
		
		var p_subCityId = 2;
		this.lc()._onClickEmptySubCityBtn(p_subCityId);
		assertEQ ( this.mm.walkLog, '_hasEnoughCityLevel,sysMsgTips' );
		assertEQ ( this.mm.params['_hasEnoughCityLevel'], [p_subCityId] );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING,  TQ.format(rstr.createSubCity.needCityLevel, RStrUtil.getCityNameByLevel(4))] );
		
		this.mm.clear();
		r_hasEnoughCityLevel[0] = true;
		this.lc()._onClickEmptySubCityBtn(p_subCityId);
		assertEQ ( this.mm.walkLog, '_hasEnoughCityLevel,openDlg' );
		assertEQ ( this.mm.params['openDlg'], ['createsubcity', p_subCityId, 'create'] );
	};
	
	this.test__hasEnoughCityLevel = function(){
		this.g.getImgr().setCityLevel(3);
		
		var p_subCityId = 2;
		assertEQ ( this.lc()._hasEnoughCityLevel(p_subCityId), false);
		
		this.g.getImgr().setCityLevel(4);
		assertEQ ( this.lc()._hasEnoughCityLevel(p_subCityId), true);
	};
	
	this.test__onClickExistSubCityBtn = function(){
		var r_panel = new function(){this.open = function(){};};
		this.mm.mock(this.lc(), '_getSubCityPanel', [r_panel]);
		this.mm.mock(UIM, 'closeMapPanels');
		this.mm.mock(r_panel, 'open');
			
		var p_subCityId = 2;
		this.lc()._onClickExistSubCityBtn(p_subCityId);
		assertEQ ( this.mm.walkLog, 'closeMapPanels,_getSubCityPanel,open' );
		assertEQ ( this.mm.params['_getSubCityPanel'], [p_subCityId] );
	};
	
	this.test__getSubCityPanel = function(){
		var r_panel = {name:'panel'};
		this.mm.mock(UIM.getPanel('main').getSubCityPanels(), 'getPanel', [r_panel]);
		
		var p_subCityId = 2;
		assertEQ ( this.lc()._getSubCityPanel(p_subCityId), r_panel);
		assertEQ ( this.mm.params['getPanel'], [p_subCityId] );
	};
	
	this.test__setCurSubCityId = function(){
		this.lc()._setCurSubCityId(0);
		assertEQ ( this.bar.getCurSubCityId(), 0);
		
		this.lc()._setCurSubCityId(2);
		assertEQ ( this.bar.getCurSubCityId(), 2);
	};
	
	this.test__setAllBtnsNormalState = function(){
		this.lc().m_btns[0].setPress(true);
		this.lc().m_btns[1].setPress(true);
		this.lc().m_btns[2].setPress(true);
		this.lc().m_btns[3].setPress(true);
		
		this.lc()._setAllBtnsNormalState();
		assertEQ ( this.lc().m_btns[0].isPress(), false )
		assertEQ ( this.lc().m_btns[1].isPress(), false )
		assertEQ ( this.lc().m_btns[2].isPress(), false )
		assertEQ ( this.lc().m_btns[3].isPress(), false )
	};
	
	this.test__setCurBtnPressState = function(){
		var r_getCurSubCityId = [BUILDCITY_ID.SUB1];
		this.mm.mock(this.bar, 'getCurSubCityId', r_getCurSubCityId);
		this.lc()._setAllBtnsNormalState();
		this.lc()._setCurBtnPressState();
		assertEQ ( this.lc().m_btns[0].isPress(), true );
		this.lc()._setAllBtnsNormalState();
		r_getCurSubCityId[0] = BUILDCITY_ID.SUB2;
		this.lc()._setCurBtnPressState();
		assertEQ ( this.lc().m_btns[1].isPress(), true )
		
		this.lc()._setAllBtnsNormalState();
		r_getCurSubCityId[0] = BUILDCITY_ID.SUB4;
		this.lc()._setCurBtnPressState();
		assertEQ ( this.lc().m_btns[3].isPress(), true )
		
		this.lc()._setAllBtnsNormalState();
		r_getCurSubCityId[0] = BUILDCITY_ID.NONE;
		this.lc()._setCurBtnPressState();
		assertEQ ( this.lc().m_btns[0].isPress(), false )
		assertEQ ( this.lc().m_btns[1].isPress(), false )
		assertEQ ( this.lc().m_btns[2].isPress(), false )
		assertEQ ( this.lc().m_btns[3].isPress(), false )
	};
});

TestCaseSubCityPanels = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.panels = UIM.getPanel('main').getSubCityPanels();
		this.lc = this.panels.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock( this.lc(), '_initParams' );
		this.mm.mock( this.lc(), '_regEvents' );
		var p_mapDom = MockDom.snew();
		this.panels.init ( this.g, p_mapDom );
		assertEQ ( this.mm.walkLog, '_initParams,_regEvents' );
		assertEQ ( this.mm.params['_initParams'], [this.panels, this.g, p_mapDom] );
	};
	
	this.test_getIterator = function(){
		this.mm.mock(DictIterator, 'snew', [{name:'iter'}]);
		assertEQ ( this.panels.getIterator(), {name:'iter'} );
		assertEQ ( this.mm.params['snew'], [this.lc().m_panels] );
	};
	
	this.test_getPanel = function(){
		this.lc().m_panels[BUILDCITY_ID.SUB1] = {name:'sub1'};
		assertEQ ( this.panels.getPanel(BUILDCITY_ID.SUB1), {name:'sub1'} );
		assertEQ ( this.panels.getPanel(BUILDCITY_ID.SUB2), undefined );
	};
	
	this.test_hideAllPanels = function(){
		this.lc().m_panels[BUILDCITY_ID.SUB1] = new function(){this.hide=function(){};this.setActive=function(){};};
		this.lc().m_panels[BUILDCITY_ID.SUB2] = new function(){this.hide=function(){};this.setActive=function(){};};
		this.lc().m_panels[BUILDCITY_ID.SUB3] = null;
		this.lc().m_panels[BUILDCITY_ID.SUB4] = null;
		
		this.mm.mock ( this.lc().m_panels[BUILDCITY_ID.SUB1], 'hide' );
		this.mm.mock ( this.lc().m_panels[BUILDCITY_ID.SUB1], 'setActive' );
		this.mm.mock ( this.lc().m_panels[BUILDCITY_ID.SUB2], 'hide' );
		this.mm.mock ( this.lc().m_panels[BUILDCITY_ID.SUB2], 'setActive' );
		
		this.panels.hideAllPanels();
		assertEQ ( this.mm.walkLog, 'hide,setActive,hide,setActive' );
		assertEQ ( this.mm.params['setActive'], [false] );
		assertEQ ( this.mm.params['setActive'], [false] );
	};
	
	this.test__initParams = function(){
		var p_mapDom = UIM.getPanel('main').getItems().map;
		this.lc()._initParams(this.panels, this.g, p_mapDom);
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.panels );
		assertEQ ( this.lc().m_mapDom, p_mapDom );
	};
	
	this.test__regEvents = function(){
		this.mm.mock( this.g, 'regEvent' );
		this.lc()._regEvents();
		assertEQ ( this.mm.params['regEvent'], [EVT.CITYTYPES, 0, this.panels, this.lc()._onCityTypesUpdate] );
	};
	
	this.test__onCityTypesUpdate = function(){
		var r_isNeedCreate = [false];
		this.mm.mock( this.lc(), '_isNeedCreate', r_isNeedCreate );
		this.mm.mock( this.lc(), '_destroyLastPanel' );
		this.mm.mock( this.lc(), '_createPanel' );
		this.mm.mock( this.lc(), '_openNewPanel' );
		
		this.lc()._onCityTypesUpdate();
		assertEQ ( this.mm.walkLog, '_isNeedCreate,_isNeedCreate,_isNeedCreate,_isNeedCreate' );
		assertEQ ( this.mm.params['_isNeedCreate.0'], [BUILDCITY_ID.SUB1] );
		
		this.mm.clear();
		r_isNeedCreate[0] = true;
		this.lc()._onCityTypesUpdate();
		assertEQ ( this.mm.walkLog, '_isNeedCreate,_destroyLastPanel,_createPanel,_openNewPanel,_isNeedCreate,_destroyLastPanel,_createPanel,_openNewPanel,_isNeedCreate,_destroyLastPanel,_createPanel,_openNewPanel,_isNeedCreate,_destroyLastPanel,_createPanel,_openNewPanel' );
		assertEQ ( this.mm.params['_destroyLastPanel.0'], [BUILDCITY_ID.SUB1] );
		assertEQ ( this.mm.params['_createPanel.0'], [BUILDCITY_ID.SUB1] );
		assertEQ ( this.mm.params['_openNewPanel.0'], [BUILDCITY_ID.SUB1] );
	};
	
	this.test__isNeedCreate = function(){
		var mapDom = UIM.getPanel('main').getItems().map;
		this.lc().m_panels[BUILDCITY_ID.SUB1] = ResSubBuildPanel.snew(this.g, mapDom, BUILDCITY_ID.SUB1);
		this.lc().m_panels[BUILDCITY_ID.SUB2] = ResSubBuildPanel.snew(this.g, mapDom, BUILDCITY_ID.SUB2);
		this.lc().m_panels[BUILDCITY_ID.SUB3] = null;
		this.lc().m_panels[BUILDCITY_ID.SUB4] = null;
		
		this.g.getImgr().getCityTypes()[1] = CITY_TYPE.SUBRES;
		this.g.getImgr().getCityTypes()[2] = CITY_TYPE.SUBARMY;
		this.g.getImgr().getCityTypes()[3] = CITY_TYPE.SUBARMY;
		this.g.getImgr().getCityTypes()[4] = CITY_TYPE.NONE;
		
		assertEQ ( this.lc()._isNeedCreate(BUILDCITY_ID.SUB1), false );
		assertEQ ( this.lc()._isNeedCreate(BUILDCITY_ID.SUB2), true );
		assertEQ ( this.lc()._isNeedCreate(BUILDCITY_ID.SUB3), true );
		assertEQ ( this.lc()._isNeedCreate(BUILDCITY_ID.SUB4), false );
	};
	
	this.test__destroyLastPanel = function(){
		this.lc().m_panels[BUILDCITY_ID.SUB1] = null;
		this.lc()._destroyLastPanel(BUILDCITY_ID.SUB1);
		this.lc().m_panels[BUILDCITY_ID.SUB1] = ResSubBuildPanel.snew(this.lc().m_g, this.lc().m_mapDom, BUILDCITY_ID.SUB1);
		this.mm.mock(this.lc().m_panels[BUILDCITY_ID.SUB1], 'destroy');
		this.lc()._destroyLastPanel(BUILDCITY_ID.SUB1);
		assertEQ ( this.mm.walkLog, 'destroy' );
	};
	
	this.test__createPanel = function(){
		this.lc().m_panels[BUILDCITY_ID.SUB1] = null;
		this.lc().m_panels[BUILDCITY_ID.SUB2] = null;
		this.lc().m_panels[BUILDCITY_ID.SUB3] = null;
		this.lc().m_panels[BUILDCITY_ID.SUB4] = null;
		
		this.g.getImgr().getCityTypes()[1] = CITY_TYPE.SUBRES;
		this.g.getImgr().getCityTypes()[2] = CITY_TYPE.SUBARMY;
		this.g.getImgr().getCityTypes()[3] = CITY_TYPE.NONE;
		
		this.lc()._createPanel(BUILDCITY_ID.SUB1);
		this.lc()._createPanel(BUILDCITY_ID.SUB2);
		this.lc()._createPanel(BUILDCITY_ID.SUB3);
		
		assertEQ ( this.lc().m_panels[BUILDCITY_ID.SUB1] instanceof ResSubBuildPanel, true );
		assertEQ ( this.lc().m_panels[BUILDCITY_ID.SUB2] instanceof MilitarySubBuildPanel, true );
		assertEQ ( this.lc().m_panels[BUILDCITY_ID.SUB3], null );
	};
	
	this.test__openNewPanel = function(){
		this.lc().m_panels[BUILDCITY_ID.SUB1] = null;
		this.lc()._destroyLastPanel(BUILDCITY_ID.SUB1);
		this.lc().m_panels[BUILDCITY_ID.SUB1] = ResSubBuildPanel.snew(this.lc().m_g, this.lc().m_mapDom, BUILDCITY_ID.SUB1);
		this.mm.mock(this.g.getWinSizer(), 'getCurSize', [{cx:100,cy:200}]);
		this.mm.mock(this.lc().m_panels[BUILDCITY_ID.SUB1], 'open');
		this.mm.mock(this.lc().m_panels[BUILDCITY_ID.SUB1], 'resize');
		this.mm.mock(this.lc().m_panels[BUILDCITY_ID.SUB1], 'resetViewPos');
		this.lc()._openNewPanel(BUILDCITY_ID.SUB1);
		assertEQ ( this.mm.walkLog, 'open,getCurSize,resize,resetViewPos' );
		assertEQ ( this.mm.params['resize'], [{cx:100,cy:200}] );
	};
});


TestCaseTrackToolbar = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.items = {};
		this.g.getGUI().initPanel(new MockDom('div'), uicfg.main.mainpanel, this.items);
		this.bar = TrackToolbar.snew(this.g, this.items);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_click_trackactbtn = function(){
		this.items.trackactbtn.click();
		assertEQ ( UIM.getDlg('activityval').isShow() , true );
	
		this.items.trackactbtn.click();
		assertEQ ( UIM.getDlg('activityval').isShow() , false );
	};
	
	this.test_click_trackbuildingbtn = function(){
		this.mm.mock(UIM, 'openDlg' );
		this.mm.mock(UIM.getDlg('buildingtrace'), 'closeDlg' );
		
		assertEQ ( this.items.trackbuildingbtn.isPress(), false );
		this.items.trackbuildingbtn.click();
		assertEQ ( this.items.trackbuildingbtn.isPress(), true );
		assertEQ ( this.mm.params['openDlg'], ['buildingtrace'] );
		
		this.mm.clear();
		this.items.trackbuildingbtn.click();
		assertEQ ( this.items.trackbuildingbtn.isPress(), false );
		assertEQ ( this.mm.params['closeDlg'], [] );
	};
	
	this.test_click_trackautobuildbtn = function(){
		this.items.trackautobuildbtn.click();
		assertEQ ( UIM.getDlg('autobuild').isShow() , true );
	
		this.items.trackautobuildbtn.click();
		assertEQ ( UIM.getDlg('autobuild').isShow() , false );
	};	
});

tqMainPanel_t_main = function(suite) {
	suite.addTestCase(TestCaseSelCityTool, 'TestCaseSelCityTool');
	suite.addTestCase(TestCaseMainPanel, 'TestCaseMainPanel');
	suite.addTestCase(TestCaseMainToolbar, 'TestCaseMainToolbar');
	suite.addTestCase(TestCaseSmallMapBtnBar, 'TestCaseSmallMapBtnBar');
	suite.addTestCase(TestCaseQueueMsgBtn, 'TestCaseQueueMsgBtn');
	suite.addTestCase(TestCaseSubCityBtnsBar, 'TestCaseSubCityBtnsBar');
	suite.addTestCase(TestCaseSubCityPanels, 'TestCaseSubCityPanels');
	suite.addTestCase(TestCaseTrackToolbar, 'TestCaseTrackToolbar');
};
