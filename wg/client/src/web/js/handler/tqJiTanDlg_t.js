/*******************************************************************************/
requireEx('./handler/tqJiTanDlg.js', [
	{
		start:'//JiTanDlg-unittest-start'
		,end:'//JiTanDlg-unittest-end'
		,items:['m_g'
				,'m_this'
				,'m_dlg'
				,'m_items'
				,'_initParams'
				,'_regEvents'
				,'_initDlg'
				,'_openDlg'
				,'_initInfo'
				,'_onLoginOk'
				,'_onRolebaseChange'
				,'_onCityResChange'
				,'_onSvrPkg'
				,'_createDlg'
				,'_setCallers'
				,'_onClickAssignHerosExp'
				,'_onClickExchange'
				,'_onGetNumLimit'
				,'_updateExpsBar'
				,'_updateCityRes'
				,'_updateTodayTimes'
				,'_isShow'
				,'_setListItemResIcon'
				,'_setListItemResNeedAndHasNum'
				,'_onNumChange'
				,'_hasEnoughTimes'
				,'_hasEnoughRes'
				,'_hasEnoughCapacity'
				,'_getCanMaxTimes'
				,'_getTodayLeftTimes'
				,'_getResCanTimes'
				,'_getCapacityCanTimes'
			]
	}
]);

TestCaseJiTanDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = JiTanDlg.snew(this.g);
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_initParams' );
		this.mm.mock(this.lc(), '_regEvents' );
		this.dlg.init( this.g ) ;
		assertEQ ( this.mm.walkLog, '_initParams,_regEvents' );
		assertEQ ( this.mm.params['_initParams'], [this.dlg, this.g] );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_openDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.dlg.openDlg();
		assertEQ ( this.mm.walkLog, '_initDlg,_openDlg,_initInfo' );		
	};
	
	this.test__initParams = function(){
		assertEQ ( this.lc().m_this, this.dlg);
		assertEQ ( this.lc().m_g, this.g);
	};
	
	this.test__regEvents = function(){
		this.mm.mock(this.g, 'regEvent' );
		this.lc()._regEvents();
		assertEQ ( this.mm.walkLog, 'regEvent,regEvent,regEvent,regEvent' );
		assertEQ ( this.mm.params['regEvent.0'], [EVT.LOGIN_OK, 0, this.dlg, this.lc()._onLoginOk] );
		assertEQ ( this.mm.params['regEvent.1'], [EVT.ROLEBASE, 0, this.dlg, this.lc()._onRolebaseChange] );
		assertEQ ( this.mm.params['regEvent.2'], [EVT.CITYRES, 0, this.dlg, this.lc()._onCityResChange] );
		assertEQ ( this.mm.params['regEvent.3'], [EVT.NET, NETCMD.EXCHANGEEXP, this.dlg, this.lc()._onSvrPkg] );
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
		assertEQ ( this.mm.params['snew'], [this.g,{modal:true, title:rstr.jitandlg.title, pos:{x:'center', y:50}}] );
		assertEQ ( this.mm.params['initDlg'], [r_dlg, uicfg.jitandlg, this.lc().m_items] );
		assertEQ ( this.lc().m_dlg, r_dlg);
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc().m_items.assign, 'setCaller');
		this.mm.mock(this.lc().m_items.exchange, 'setCaller');
		this.mm.mock(this.lc().m_items.inum, 'setCaller');
		this.mm.mock(this.lc().m_items.inum, 'setLimit');
		this.lc()._setCallers();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller,setCaller,setLimit' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.dlg, caller:this.lc()._onClickAssignHerosExp}] );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.dlg, caller:this.lc()._onClickExchange}] );
		assertEQ ( this.mm.params['setCaller.2'], [{self:this.dlg, caller:this.lc()._onNumChange}] );
		assertEQ ( this.mm.params['setLimit'], [this.lc()._onGetNumLimit] );
	};
	
	this.test__openDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._openDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(this.lc(), '_updateExpsBar' );
		this.mm.mock(this.lc(), '_updateCityRes' );
		this.mm.mock(this.lc(), '_updateTodayTimes' );
		this.lc()._initInfo();
		assertEQ ( this.mm.walkLog, '_updateExpsBar,_updateCityRes,_updateTodayTimes' );
	};
	
	this.test__updateExpsBar = function(){
		var r_isShow = [false];
		this.mm.mock(this.lc(), '_isShow', r_isShow );
		this.mm.mock(this.lc().m_items.herosexpbar, 'setRange' );
		this.mm.mock(this.lc().m_items.herosexpbar, 'setValue' );
		this.g.getImgr().addRoleAttr({id:ATTR.MXPS, val:10});
		this.g.getImgr().addRoleAttr({id:ATTR.XPS, val:5});
		this.lc()._updateExpsBar();
		assertEQ ( this.mm.walkLog, '_isShow' );
		
		this.mm.clear();
		r_isShow[0] = true;
		this.lc()._updateExpsBar();
		assertEQ ( this.mm.params['setRange'], [10] );
		assertEQ ( this.mm.params['setValue'], [0, 5] );
	};
	
	this.test__updateCityRes = function(){
		var r_isShow = [false];
		this.mm.mock(this.lc(), '_isShow', r_isShow );
		this.mm.mock(this.lc(), '_setListItemResIcon' );
		this.mm.mock(this.lc(), '_setListItemResNeedAndHasNum' );
		this.lc()._updateCityRes();
		assertEQ ( this.mm.walkLog, '_isShow' );
		
		this.mm.clear();
		r_isShow[0] = true;
		this.lc()._updateCityRes();
		assertStrRepeatCount ( this.mm.walkLog, '_setListItemResIcon', 4 );
		assertStrRepeatCount ( this.mm.walkLog, '_setListItemResNeedAndHasNum', 4 );
		assertEQ ( this.mm.params['_setListItemResIcon.0'], [0] );
		assertEQ ( this.mm.params['_setListItemResNeedAndHasNum.0'], [0] );
		assertEQ ( this.mm.params['_setListItemResIcon.3'], [3] );
		assertEQ ( this.mm.params['_setListItemResNeedAndHasNum.3'], [3] );
	};
	
	this.test__setListItemResIcon = function(){
		this.mm.mock( IMG, 'setBKImage' );
		var p_idx = 0;
		this.lc()._setListItemResIcon(p_idx);
		var res = ItemResUtil.findItemres(FIXID.FOOD);
		assertEQ ( this.mm.params['setBKImage'], [this.lc().m_items.icon0, IMG.makeSmallImg(res.smallpic)] );
	};
	
	this.test__setListItemResNeedAndHasNum = function(){
		this.mm.mock(this.lc().m_items.inum, 'getVal', [1] );
		this.mm.mock(this.g.getImgr(), 'getCityResValByIdx', [20000] );
		var p_idx = 0;
		this.lc()._setListItemResNeedAndHasNum(p_idx);
		assertEQ ( TQ.getTextEx(this.lc().m_items.res0), TQ.format(rstr.jitandlg.lbl.exchangeItem, 1, RStrUtil.formatResNumStr(20000)) )
	};
	
	this.test__updateTodayTimes = function(){
		var r_isShow = [false];
		this.mm.mock(this.lc(), '_isShow', r_isShow );
		this.mm.mock(TQ, 'setTextEx' );
		
		this.g.getImgr().getExchangeExp().todaytimes = {cur:1, max:2};
		this.lc()._updateTodayTimes();
		assertEQ ( this.mm.walkLog, '_isShow' );
		
		this.mm.clear();
		r_isShow[0] = true;
		this.lc()._updateTodayTimes();
		assertEQ ( this.mm.walkLog, '_isShow,setTextEx' );
		var msg = TQ.format(rstr.jitandlg.lbl.todayTimes, 1, 2);
		assertEQ ( this.mm.params['setTextEx'], [this.lc().m_items.todayTimes, msg] );
	};
	
	this.test__isShow = function(){
		this.lc().m_dlg = null;
		assertEQ ( this.lc()._isShow(), false );
		this.lc()._initDlg();
		this.lc().m_dlg.hide();
		assertEQ ( this.lc()._isShow(), false );
		this.lc().m_dlg.show();
		assertEQ ( this.lc()._isShow(), true );
	};
	
	this.test__onLoginOk = function(){
		this.mm.mock(ExchangeHeroExpSender, 'sendGetTimes' );
		this.lc()._onLoginOk();
		assertEQ ( this.mm.params['sendGetTimes'], [this.g] );
	};
	
	this.test__onRolebaseChange = function(){
		this.mm.mock(this.lc(), '_updateExpsBar');
		this.lc()._onRolebaseChange();
		assertEQ ( this.mm.walkLog, '_updateExpsBar' );
	};
	
	this.test__onCityResChange = function(){
		this.mm.mock(this.lc(), '_updateCityRes' );
		this.lc()._onCityResChange();
		assertEQ ( this.mm.walkLog, '_updateCityRes' );
	};
	
	this.test__onNumChange = function(){
		this.mm.mock(this.lc(), '_updateCityRes' );
		this.lc()._onNumChange();
		assertEQ ( this.mm.walkLog, '_updateCityRes' );
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock(TQ, 'dictCopy');
		this.mm.mock(this.lc(), '_updateTodayTimes');
		var p_netevent = {data:{}};
		this.lc()._onSvrPkg(p_netevent);
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		p_netevent = {data:{todaytimes:{cur:10,max:20}}};
		this.lc()._onSvrPkg(p_netevent);
		assertEQ ( this.mm.walkLog, 'dictCopy,_updateTodayTimes' );
		assertEQ ( this.mm.params['dictCopy'], [this.g.getImgr().getExchangeExp().todaytimes, {cur:10, max:20}] );
	};
	
	this.test__onClickAssignHerosExp = function(){
		this.mm.mock(UIM, 'openDlg' );
		this.lc()._onClickAssignHerosExp();
		assertEQ ( this.mm.params['openDlg'], ['roleassignexp'] );
	};
	
	this.test__onClickExchange = function(){
		var r_hasEnoughTimes = [false];
		var r_hasEnoughRes = [false];
		var r_hasEnoughCapacity = [false];
		this.mm.mock(this.lc(), '_hasEnoughTimes', r_hasEnoughTimes );
		this.mm.mock(this.lc(), '_hasEnoughRes', r_hasEnoughRes );
		this.mm.mock(this.lc(), '_hasEnoughCapacity', r_hasEnoughCapacity );
		this.mm.mock(this.g.getGUI(), 'sysMsgTips' );
		this.mm.mock(ExchangeHeroExpSender, 'sendExchange' );
		this.mm.mock(this.lc().m_items.inum, 'setVal' );
		
		this.lc()._onClickExchange();
		assertEQ ( this.mm.walkLog, '_hasEnoughTimes,sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.jitandlg.tip.noEnoughTimes] );
		
		this.mm.clear();
		r_hasEnoughTimes[0] = true;
		this.lc()._onClickExchange();
		assertEQ ( this.mm.walkLog, '_hasEnoughTimes,_hasEnoughRes,sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.jitandlg.tip.noEnoughRes] );
		
		this.mm.clear();
		r_hasEnoughRes[0] = true;
		this.lc()._onClickExchange();
		assertEQ ( this.mm.walkLog, '_hasEnoughTimes,_hasEnoughRes,_hasEnoughCapacity,sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.jitandlg.tip.noEnoughCap] );
		
		this.mm.clear();
		r_hasEnoughCapacity[0] = true;
		this.lc()._onClickExchange();
		assertEQ ( this.mm.walkLog, '_hasEnoughTimes,_hasEnoughRes,_hasEnoughCapacity,sendExchange,setVal' );
		assertEQ ( this.mm.params['sendExchange'], [this.g, this.lc().m_items.inum.getVal()] );
		assertEQ ( this.mm.params['setVal'], [1] );
	};
	
	this.test__onGetNumLimit = function(){
		this.mm.mock(this.lc(), '_getCanMaxTimes', [2]);
		assertEQ ( this.lc()._onGetNumLimit(), {min:1, max:2} );
	};
	
	this.test__hasEnoughTimes = function(){
		var r_getTodayLeftTimes = [0];
		this.mm.mock(this.lc(), '_getTodayLeftTimes', r_getTodayLeftTimes );
		assertEQ ( this.lc()._hasEnoughTimes(), false );
		
		r_getTodayLeftTimes[0] = 1;
		assertEQ ( this.lc()._hasEnoughTimes(), true );
	};
	
	this.test__hasEnoughRes = function(){
		var r_getResCanTimes = [0];
		this.mm.mock(this.lc(), '_getResCanTimes', r_getResCanTimes );
		assertEQ ( this.lc()._hasEnoughRes(), false );
		
		r_getResCanTimes[0] = 1;
		assertEQ ( this.lc()._hasEnoughRes(), true );
	};
	
	this.test__hasEnoughCapacity = function(){
		var r_getCapacityCanTimes = [0];
		this.mm.mock(this.lc(), '_getCapacityCanTimes', r_getCapacityCanTimes );
		assertEQ ( this.lc()._hasEnoughCapacity(), false );
		
		r_getCapacityCanTimes[0] = 1;
		assertEQ ( this.lc()._hasEnoughCapacity(), true );
	};
	
	this.test__getCanMaxTimes = function(){
		var r_getResCanTimes = [0];
		var r_getTodayLeftTimes = [0];
		var r_getCapacityCanTimes = [0];
		this.mm.mock(this.lc(), '_getResCanTimes', r_getResCanTimes );
		this.mm.mock(this.lc(), '_getTodayLeftTimes', r_getTodayLeftTimes );
		this.mm.mock(this.lc(), '_getCapacityCanTimes', r_getCapacityCanTimes );
		assertEQ ( this.lc()._getCanMaxTimes(), 1 );
		
		r_getResCanTimes[0] = 10;
		assertEQ ( this.lc()._getCanMaxTimes(), 1 );
		
		r_getTodayLeftTimes[0] = 11;
		assertEQ ( this.lc()._getCanMaxTimes(), 1 );
		
		r_getResCanTimes[0] = 11;
		r_getTodayLeftTimes[0] = 10;
		r_getCapacityCanTimes[0] = 11;
		assertEQ ( this.lc()._getCanMaxTimes(), 10 );
		
		r_getResCanTimes[0] = 11;
		r_getTodayLeftTimes[0] = 11;
		r_getCapacityCanTimes[0] =10;
		assertEQ ( this.lc()._getCanMaxTimes(), 10 );
		
		r_getResCanTimes[0] = 10;
		r_getTodayLeftTimes[0] = 11;
		r_getCapacityCanTimes[0] =11;
		assertEQ ( this.lc()._getCanMaxTimes(), 10 );
	};
	
	this.test__getTodayLeftTimes = function(){
		this.g.getImgr().getExchangeExp().todaytimes = {cur:1, max:2};
		assertEQ ( this.lc()._getTodayLeftTimes(), 2-1 );
	};
	
	this.test__getResCanTimes = function(){
		this.g.getImgr().getCityRes().cres.food = 1000;
		this.g.getImgr().getCityRes().cres.wood = 1000;
		this.g.getImgr().getCityRes().cres.stone = 1000;
		this.g.getImgr().getCityRes().cres.iron = 999;
		
		assertEQ ( this.lc()._getResCanTimes(), 0 );
		
		this.g.getImgr().getCityRes().cres.iron = 1000;
		assertEQ ( this.lc()._getResCanTimes(), 1 );
	};
	
	this.test__getCapacityCanTimes = function(){
		this.g.getImgr().addRoleAttr({id:ATTR.MXPS, val:3000});
		this.g.getImgr().addRoleAttr({id:ATTR.XPS, val:5});
		assertEQ ( this.lc()._getCapacityCanTimes(), 2 );
	};
});

tqJiTanDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseJiTanDlg, 'TestCaseJiTanDlg');
};
