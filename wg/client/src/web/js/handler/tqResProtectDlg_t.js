/*******************************************************************************/
requireEx('./handler/tqResProtectDlg.js', [
	{
		start:'//ResProtectDlg-unittest-start'
		,end:'//ResProtectDlg-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_dlg'
			,'m_items'
			,'_initDlg'
			,'_openDlg'
			,'_initInfo'
			,'_createDlg'
			,'_setStorageCap'
			,'_setResProtectNum'
			,'_setResProtectList'
			,'_getResProtectNum'
			,'_setListItemCurHasBar'
			,'_setListItemResProtectBar'
			,'_setListItemResIconName'
			,'_setListItemCurHasNumber'
			]
	}
]);

TestCaseResProtectDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = ResProtectDlg.snew(this.g);
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ (this.lc().m_g, this.g);
		assertEQ (this.lc().m_this, this.dlg);
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_openDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.dlg.openDlg();
		assertEQ ( this.mm.walkLog, '_initDlg,_openDlg,_initInfo' );
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock( this.lc(), '_createDlg' );
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg' );
		
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
		assertEQ ( this.mm.params['snew'], [this.g,{modal:false, title:rstr.resprotectdlg.title, pos:{x:'center', y:50}}] );
		assertEQ ( this.mm.params['initDlg'], [r_dlg, uicfg.resprotectdlg, this.lc().m_items] );
		assertEQ ( this.lc().m_dlg, r_dlg);
	};
	
	this.test__openDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._openDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
	};
	
	this.test__initInfo = function(){
		this.mm.mock( this.lc(), '_setStorageCap' );
		this.mm.mock( this.lc(), '_setResProtectNum' );
		this.mm.mock( this.lc(), '_setResProtectList' );
		this.lc()._initInfo();
		assertEQ ( this.mm.walkLog, '_setStorageCap,_setResProtectNum,_setResProtectList' );
	};
	
	this.test__setStorageCap = function(){
		this.g.getImgr().getCityRes().cres.max = 10;
		this.lc()._setStorageCap();
		assertEQ ( TQ.getTextEx(this.lc().m_items.storageCap), 10 );
	};
	
	this.test__setResProtectNum = function(){
		this.mm.mock( this.lc(), '_getResProtectNum', [1] );
		this.lc()._setResProtectNum();
		assertEQ ( TQ.getTextEx(this.lc().m_items.resProtect), 1 );
	};
	
	this.test__setResProtectList = function(){
		this.mm.mock(this.lc(), '_setListItemCurHasBar' );
		this.mm.mock(this.lc(), '_setListItemResProtectBar' );
		this.mm.mock(this.lc(), '_setListItemResIconName' );
		this.mm.mock(this.lc(), '_setListItemCurHasNumber' );
		this.lc()._setResProtectList();
		assertEQ ( this.mm.params['_setListItemCurHasBar.0'], [0, this.lc().m_items.list.getItem(0)] );
		assertEQ ( this.mm.params['_setListItemResProtectBar.0'], [0, this.lc().m_items.list.getItem(0)] );
		assertEQ ( this.mm.params['_setListItemResIconName.0'], [0, this.lc().m_items.list.getItem(0)] );
		assertEQ ( this.mm.params['_setListItemCurHasNumber.0'], [0, this.lc().m_items.list.getItem(0)] );
		assertEQ ( this.mm.params['_setListItemCurHasBar.3'], [3, this.lc().m_items.list.getItem(3)] );
		assertEQ ( this.mm.params['_setListItemResProtectBar.3'], [3, this.lc().m_items.list.getItem(3)] );
		assertEQ ( this.mm.params['_setListItemResIconName.3'], [3, this.lc().m_items.list.getItem(3)] );
		assertEQ ( this.mm.params['_setListItemCurHasNumber.3'], [3, this.lc().m_items.list.getItem(3)] );
	};
	
	this.test__setListItemCurHasBar = function(){
		this.g.getImgr().getCityRes().cres.max = 100;
		this.g.getImgr().getCityRes().cres.food = 50;
		
		this.lc()._setListItemCurHasBar(0, this.lc().m_items.list.getItem(0) );
		var barH = 164 * 50 / 100;
		assertEQ( TQ.getDomRect(this.lc().m_items.list.getItem(0).exsubs.curhas),  { l: 37, t: 165 - barH, w: 50, h: barH });
			
		this.g.getImgr().getCityRes().cres.max = 100;
		this.g.getImgr().getCityRes().cres.wood = 150;
		this.lc()._setListItemCurHasBar(1, this.lc().m_items.list.getItem(1) );
		assertEQ( TQ.getDomRect(this.lc().m_items.list.getItem(1).exsubs.curhas),  { l: 37, t: 1, w: 50, h: 164 });
	};
	
	this.test__setListItemResProtectBar = function(){
		var r_getResProtectNum = [50];
		this.mm.mock(this.lc(), '_getResProtectNum', r_getResProtectNum );
		this.g.getImgr().getCityRes().cres.max = 100;
		this.g.getImgr().getCityRes().cres.food = 20;
		
		this.lc()._setListItemResProtectBar(0, this.lc().m_items.list.getItem(0) );
		var barH = Math.floor(164 * 20 / 100);
		assertEQ( TQ.getDomRect(this.lc().m_items.list.getItem(0).exsubs.curprotect),  { l: 37, t: 165 - barH, w: 50, h: barH });
		
		var barH = Math.floor(164 * 50 / 100);
		this.g.getImgr().getCityRes().cres.max = 80;
		this.g.getImgr().getCityRes().cres.wood = 100;
		this.lc()._setListItemResProtectBar(1, this.lc().m_items.list.getItem(1) );
		assertEQ( TQ.getDomRect(this.lc().m_items.list.getItem(1).exsubs.curprotect),  { l: 37, t: 165 - barH, w: 50, h: barH });
			
		r_getResProtectNum[0] = 100;
		this.g.getImgr().getCityRes().cres.max = 80;
		this.g.getImgr().getCityRes().cres.wood = 50;
		this.lc()._setListItemResProtectBar(1, this.lc().m_items.list.getItem(1) );
		assertEQ( TQ.getDomRect(this.lc().m_items.list.getItem(1).exsubs.curprotect),  { l: 37, t: 165 - barH, w: 50, h: barH });
	};
	
	this.test__setListItemResIconName = function(){
		this.lc()._setListItemResProtectBar(0, this.lc().m_items.list.getItem(0) );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(0).exsubs.name), ItemResUtil.findItemres(FIXID.FOOD).name);
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_items.list.getItem(0).exsubs.icon), ItemResUtil.findItemres(FIXID.FOOD).smallpic), true );
		
		this.lc()._setListItemResProtectBar(1, this.lc().m_items.list.getItem(1) );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(1).exsubs.name), ItemResUtil.findItemres(FIXID.WOOD).name);
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_items.list.getItem(1).exsubs.icon), ItemResUtil.findItemres(FIXID.WOOD).smallpic), true );
		
		this.lc()._setListItemResProtectBar(2, this.lc().m_items.list.getItem(2) );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(2).exsubs.name), ItemResUtil.findItemres(FIXID.STONE).name);
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_items.list.getItem(2).exsubs.icon), ItemResUtil.findItemres(FIXID.STONE).smallpic), true );
		
		this.lc()._setListItemResProtectBar(3, this.lc().m_items.list.getItem(3) );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(3).exsubs.name), ItemResUtil.findItemres(FIXID.IRON).name);
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_items.list.getItem(3).exsubs.icon), ItemResUtil.findItemres(FIXID.IRON).smallpic), true );
	};
	
	this.test__setListItemCurHasNumber = function(){
		this.g.getImgr().getCityRes().cres.food = 10;
		this.lc()._setListItemCurHasNumber(0, this.lc().m_items.list.getItem(0));
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(0).exsubs.curhasnum), 10 );
	};
	
	this.test__getResProtectNum = function(){
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.DIJIAOBUILD, level:1},{resid:FIXID.DIJIAOBUILD, level:2}] });
		var level1Res = ItemResUtil.findBuildLevelres(FIXID.DIJIAOBUILD, 1);
		var level2Res = ItemResUtil.findBuildLevelres(FIXID.DIJIAOBUILD, 2);
		assertEQ ( this.lc()._getResProtectNum(), level1Res.addresprotectnum + level2Res.addresprotectnum );
	};
});

tqResProtectDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseResProtectDlg, 'TestCaseResProtectDlg');
};
