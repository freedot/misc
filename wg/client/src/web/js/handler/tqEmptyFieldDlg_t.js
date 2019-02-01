/*******************************************************************************/
requireEx('./handler/tqEmptyFieldDlg.js', [
	{
		start:'//EmptyFieldDlg-unittest-start'
		,end:'//EmptyFieldDlg-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_field'
			,'m_dlg'
			,'m_items'
			,'_initDlg'
			,'_openDlg'
			,'_initInfo'
			,'_setCallers'
			,'_onClickFavoriteBtn'
			,'_onClickTransferBtn'
			]
	}
]);
	
TestCaseFieldUtil = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( FieldUtil.cityIdMapResId[1], 9900001);
		assertEQ ( FieldUtil.cityIdMapResId[2], 9900002);
		assertEQ ( FieldUtil.cityIdMapResId[3], 9900003);
		assertEQ ( FieldUtil.cityIdMapResId[4], 9900004);
	};
	
	this.test_getPosByGridId = function(){
		assertEQ ( FieldUtil.getPosByGridId(1), {x:0, y:0});
		assertEQ ( FieldUtil.getPosByGridId(2), {x:1, y:0});
		assertEQ ( FieldUtil.getPosByGridId(201), {x:200, y:0});
	};
	
	this.test_getCityResIdByGridId = function(){
		assertEQ ( FieldUtil.getCityResIdByGridId(1), FieldUtil.cityIdMapResId[1]);
		assertEQ ( FieldUtil.getCityResIdByGridId(201), FieldUtil.cityIdMapResId[1]);
		assertEQ ( FieldUtil.getCityResIdByGridId(320*600+172), FieldUtil.cityIdMapResId[2]);
		assertEQ ( FieldUtil.getCityResIdByGridId(478*600+355), FieldUtil.cityIdMapResId[3]);
		assertEQ ( FieldUtil.getCityResIdByGridId(300*600 + 300), FieldUtil.cityIdMapResId[4]);
	};
	
	this.test_getCityNameByGridId = function(){
		var r_getCityResIdByGridId = [-1];
		this.mm.mock(FieldUtil, 'getCityResIdByGridId', r_getCityResIdByGridId);
		
		var p_gridId = -1;
		assertEQ ( FieldUtil.getCityNameByGridId(p_gridId), '');
		assertEQ ( this.mm.params['getCityResIdByGridId'], [-1] );
		
		p_gridId = 1;
		r_getCityResIdByGridId[0] = 9900001;
		assertEQ ( FieldUtil.getCityNameByGridId(p_gridId), ItemResUtil.findItemres(9900001).name);
	};
	
	this.test_getFieldName = function(){
		g_field = {objType:OBJ_TYPE.ROLE, resid:1, level:1 };
		assertEQ ( FieldUtil.getFieldName(g_field), rstr.comm.cityfield );
		
		g_field = {objType:OBJ_TYPE.NPCFIELD, resid:1, level:1 };
		assertEQ ( FieldUtil.getFieldName(g_field), rstr.comm.npcfield );
		
		g_field = {objType:OBJ_TYPE.NONE };
		assertEQ ( FieldUtil.getFieldName(g_field), rstr.comm.emptyfield );
		
		res_test_items = [{id:170001, name:'field'}];
		g_field = {objType:OBJ_TYPE.FIELD, resid:170001, level:2 };
		assertEQ ( FieldUtil.getFieldName(g_field), TQ.format(rstr.comm.flevelsomething, 2, 'field' ) );
	};
	
	this.test_makeFieldFromSelfField = function(){
		var selfField = {id:1, resid:170001, level:1, startTime:1};
		var field = FieldUtil.makeFieldFromSelfField(selfField);
		assertEQ ( field, {gridId:1, resid:170001, level:1, objType:OBJ_TYPE.FIELD} );
	};
	
});

TestCaseEmptyFieldDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = EmptyFieldDlg.snew(this.g);
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		var dlg = EmptyFieldDlg.snew(this.g);
		assert ( dlg.lc().m_g == this.g );
		assert ( dlg.lc().m_this == dlg );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(UIM, 'closeAllFieldDlg');
		this.mm.mock(this.lc(), '_initDlg');
		this.mm.mock(this.lc(), '_openDlg');
		this.mm.mock(this.lc(), '_initInfo');
		
		var g_field = {};
		this.dlg.openDlg(g_field);
		assert ( this.mm.walkLog == 'closeAllFieldDlg,_initDlg,_openDlg,_initInfo' );
		assert ( this.lc().m_field == g_field);
	};
	
	this.test_closeDlg = function(){
		this.lc().m_dlg = null;
		this.dlg.closeDlg();
		
		this.lc()._initDlg();
		this.lc()._openDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
		this.dlg.closeDlg();
		assertEQ ( this.lc().m_dlg.isShow(), false );
	};
	
	this.test__initDlg = function(){
		var g_dlg = {};
		this.mm.mock( Dialog, 'snew', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		this.mm.mock( this.lc(), '_setCallers' );
		this.lc()._initDlg();
		assert ( this.mm.walkLog == 'snew,initDlg,_setCallers' );
		assert ( this.lc().m_dlg == g_dlg );
		assert ( this.mm.params['snew'][0] == this.g ); 
		assert ( this.mm.params['snew'][1].modal == false ); 
		assert ( this.mm.params['snew'][1].title == rstr.field.emptyfielddlg.title ); 
		assert ( this.mm.params['snew'][1].pos.x == 'center' ); 
		assert ( this.mm.params['snew'][1].pos.y == 50 );
		
		assertListEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.field.emptyfielddlg, this.lc().m_items] ); 
		
		this.mm.clear();
		this.lc()._initDlg();
		assert ( this.mm.walkLog == '', 'only create one time' );
	};
	
	this.test__setCallers = function(){
		this.lc()._initDlg();
		
		this.mm.mock(this.lc().m_items.favoriteBtn, 'setCaller');
		this.mm.mock(this.lc().m_items.transferBtn, 'setCaller');

		this.lc()._setCallers();
		assert ( this.mm.walkLog == 'setCaller,setCaller' );
		assert ( this.mm.params['setCaller.0'][0].caller == this.lc()._onClickFavoriteBtn);
		assert ( this.mm.params['setCaller.1'][0].caller == this.lc()._onClickTransferBtn);
	};
	
	this.test__openDlg = function(){
		this.lc()._initDlg();
		
		this.lc().m_dlg.hide();
		this.lc()._openDlg();
		assert ( this.lc().m_dlg.isShow() == true );
	};
	
	this.test__initInfo = function(){
		this.lc()._initDlg();
		this.lc().m_field = {gridId:1};
		
		res_test_items = [{id:1001,name:'cityName'}];
		this.mm.mock(FieldUtil, 'getPosByGridId', [{x:1, y:2}]);
		this.mm.mock(FieldUtil, 'getCityResIdByGridId', [1001]);
		this.lc()._initInfo();
		var expectStr = TQ.format(rstr.field.emptyfielddlg.lbl.cityNamePos, 'cityName', 1, 2); 
		assert ( TQ.getTextEx(this.lc().m_items.cityNamePos) == expectStr );
		assertEQ ( this.mm.params['getPosByGridId'], [1] );
		assertEQ ( this.mm.params['getCityResIdByGridId'], [1] );
	};
	
	this.test__onClickFavoriteBtn = function(){
		this.lc().m_field = {gridId:1};
		this.mm.mock(MilitarySender, 'sendAddFavorite');
		this.lc()._onClickFavoriteBtn();
		assertEQ ( this.mm.walkLog, 'sendAddFavorite' );
		assertEQ ( this.mm.params['sendAddFavorite'], [this.g, 1] );
	};
	
	this.test__onClickTransferBtn = function(){
		this.lc()._initDlg();
		
		res_test_items = [{id:1,name:'item',targets:[100]}];
		var g_getItemResByEffectRt = [res_test_items[0]];
		var g_getItemNumByResIdRt = [0];
		
		this.mm.mock(this.g.getImgr(), 'getItemResByEffect', g_getItemResByEffectRt);
		this.mm.mock(this.g.getImgr(), 'getItemNumByResId', g_getItemNumByResIdRt);
		this.mm.mock(UseItemSender, 'send');
		this.mm.mock(OutFieldSender, 'sendRefreshFieldsByLastViewPos');
		this.mm.mock(this.lc().m_dlg, 'hide');
		
		this.lc()._onClickTransferBtn();
		assertEQ ( this.mm.walkLog, 'getItemResByEffect,getItemNumByResId,getItemNumByResId' );
		assertEQ ( this.mm.params['getItemResByEffect'], [RES_EFF.SETPOS_MOVECITY] );
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), HyperLinkMgr.formatLink(RStrUtil.makeNoItemBuyMsg(this.g, 1, 1)) );
		this.g.getGUI().hideMsgBox();
		
		this.mm.clear();
		this.lc().m_field = {gridId:2};
		g_getItemNumByResIdRt[0] = 1;
		this.lc()._onClickTransferBtn();
		assertEQ ( this.mm.walkLog, 'getItemResByEffect,getItemNumByResId' );
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.field.emptyfielddlg.lbl.confirmTran );
		
		this.mm.clear();
		g_app.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.walkLog, 'send,sendRefreshFieldsByLastViewPos,hide' );
		assertEQ ( this.mm.params['sendRefreshFieldsByLastViewPos'], [this.g] );
		assertEQ ( this.mm.params['send'], [this.g, {id:0, resid:1}, 1, {type:100, posX:1, posY:0}] );
	};
});

tqEmptyFieldDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseFieldUtil, 'TestCaseFieldUtil');
	suite.addTestCase(TestCaseEmptyFieldDlg, 'TestCaseEmptyFieldDlg');
};
