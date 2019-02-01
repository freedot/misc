/*******************************************************************************/
requireEx('./handler/tqFieldDlg.js', [
	{
		start:'//ExpedUtil-unittest-start'
		,end:'//ExpedUtil-unittest-end'
		,items:['_makeRoleTarget'
		,'_makeFieldTarget'
		,'_makeCopyFieldTarget'
		,'_calcFightCaps'
		,'_calcSingleFightCaps'
		]
	}
	,{
		start:'//FieldDlg-unittest-start'
		,end:'//FieldDlg-unittest-end'
		,items:['m_g'
		,'m_this'
		,'m_dlg'
		,'m_btnCount'
		,'m_opHdr'
		,'m_items'
		,'m_field'
		,'_initParam'
		,'_initDlg'
		,'_openDlg'
		,'_initInfo'
		,'_createOpHdr'
		,'_setTitle'
		,'_updateInfo'
		,'_setCityNamePos'
		,'_setFieldDesc'
		,'_getFieldGetResDesc'
		,'_getFieldGetItemsDesc'
		,'_setRoleAndAlliacne'
		]
	}
]);

var TestCaseExpedUtil = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_expedTo = function(){
		var dlg = MockDialog.snew(this.g);
		UIM.regDlg('expedition', dlg);
		this.mm.mock(dlg, 'openDlg');
		
		var g_target = {};
		this.mm.mock(ExpedUtil, 'makeExpedTarget', [g_target] );
		
		var g_field = {};
		ExpedUtil.expedTo(g_field);
		assertEQ ( this.mm.walkLog, 'makeExpedTarget,openDlg' );
		assertEQ ( this.mm.params['openDlg'], [g_target]);
	};
	
	this.test_makeExpedTarget = function(){
		this.mm.mock(ExpedUtil.lc(), '_makeRoleTarget', [{id:1}] );
		this.mm.mock(ExpedUtil.lc(), '_makeFieldTarget', [{id:2}] );
		this.mm.mock(ExpedUtil.lc(), '_makeCopyFieldTarget', [{id:3}] );
		
		assertEQ ( ExpedUtil.makeExpedTarget(null), null );
		assertEQ ( ExpedUtil.makeExpedTarget({objType:OBJ_TYPE.ROLE}), {id:1} );
		assertEQ ( ExpedUtil.makeExpedTarget({objType:OBJ_TYPE.FIELD}), {id:2} );
		assertEQ ( ExpedUtil.makeExpedTarget({objType:OBJ_TYPE.COPYFIELD}), {id:3} );
		assertEQ ( ExpedUtil.makeExpedTarget({objType:OBJ_TYPE.NPCFIELD}), null );
	};
	
	this.test__makeRoleTarget = function(){
		var g_field = {gridId:1, roleId:10000, objType:OBJ_TYPE.ROLE, roleName:'role', alliance:{uid:2, name:'alli'} };
		assertEQ ( ExpedUtil.lc()._makeRoleTarget(g_field), {id:10000, roleId:10000, type:OBJ_TYPE.ROLE, resid:0, name:'role', pos:{x:0,y:0}, alliance:{uid:2, name:'alli'}, fightcap:'--', sfightcap:'--' });
	};
	
	this.test__makeFieldTarget = function(){
		var g_field = {gridId:1, resid:170001, level:1, roleId:10000, objType:OBJ_TYPE.FIELD, roleName:'role', alliance:{uid:2, name:'alli'} };
		assertEQ ( ExpedUtil.lc()._makeFieldTarget(g_field), {id:1, type:OBJ_TYPE.FIELD, resid:170001, level:1, roleId:10000, name:'湖泊.role', pos:{x:0,y:0}, alliance:{uid:2, name:'alli'}, fightcap:'--', sfightcap:'--' });
		
		this.mm.mock(ExpedUtil.lc(), '_calcFightCaps', [10] );
		this.mm.mock(ExpedUtil.lc(), '_calcSingleFightCaps', [1] );
		
		var g_field = {gridId:1, resid:170001, level:1, roleId:0, objType:OBJ_TYPE.FIELD, roleName:'', alliance:{uid:2, name:'alli'} };
		assertEQ ( ExpedUtil.lc()._makeFieldTarget(g_field), {id:1, type:OBJ_TYPE.FIELD, resid:170001, level:1, roleId:0, name:'湖泊.1级', pos:{x:0,y:0}, alliance:{uid:2, name:'alli'}, fightcap:10, sfightcap:1 });
		
		var fieldRes = ItemResUtil.findFieldLevelres(170001, 1);
		assertEQ ( this.mm.params['_calcFightCaps'], [fieldRes.heros] );
		assertEQ ( this.mm.params['_calcSingleFightCaps'], [fieldRes.heros] );
	};
	
	this.test__makeCopyFieldTarget = function(){
		var g_copyField = {id:7500001, objType:OBJ_TYPE.COPYFIELD, name:'copyField'};
		
		this.mm.mock(ExpedUtil.lc(), '_calcFightCaps', [10] );
		this.mm.mock(ExpedUtil.lc(), '_calcSingleFightCaps', [1] );
		assertEQ ( ExpedUtil.lc()._makeCopyFieldTarget(g_copyField), {id:7500001, type:OBJ_TYPE.COPYFIELD, objType:OBJ_TYPE.COPYFIELD, resid:7500001, name:'copyField', pos:{x:0,y:0}, fightcap:10, sfightcap:1 });
		
		var res = ItemResUtil.findItemres(7500001);
		assertEQ ( this.mm.params['_calcFightCaps'], [res.heros] );
		assertEQ ( this.mm.params['_calcSingleFightCaps'], [res.heros] );
	};
	
	this.test__calcFightCaps = function(){
		res_test_items = [{id:1, fightcap:10, singlefightcap:1},{id:2, fightcap:20, singlefightcap:2}];
		assertEQ ( ExpedUtil.lc()._calcFightCaps([0,1,0,2,0]), 30 );
	};
	
	this.test__calcSingleFightCaps = function(){
		res_test_items = [{id:1, fightcap:10, singlefightcap:1},{id:2, fightcap:20, singlefightcap:2}];
		assertEQ ( ExpedUtil.lc()._calcSingleFightCaps([0,1,0,2,0]), 1 );
	};
});

var BaseFieldOpHdrHelperForTestCase = Class.extern(function(){
	this.createItemWithBtns = function(g){
		var items = {};
		for ( var i=0; i<3; ++i ) {
			items['opbtn' + (i+1)] = new ComButton(g, new MockDom());
		}
		return items;
	};
}).snew();

var TestCaseBaseFieldOpHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);

		var dlg = MockDialog.snew();
		var btnCount = 3;
		this.g_items = BaseFieldOpHdrHelperForTestCase.createItemWithBtns(this.g);
		this.g_field = {gridId:1, roleId:10000, objType:OBJ_TYPE.FIELD, roleName:'role', alliance:{uid:2, name:'alli'} };
		this.hdr = BaseFieldOpHdr.snew(this.g, dlg, btnCount, this.g_items, this.g_field);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.hdr, 'setParams');
		this.mm.mock(this.hdr, 'initBtnsText');
		this.mm.mock(this.hdr, 'setBtnsText');
		this.mm.mock(this.hdr, 'initBtnsCaller');
		this.mm.mock(this.hdr, 'setBtnsCaller');
		this.mm.mock(this.hdr, 'setAllBtnsVisible');
		this.mm.mock(this.hdr, 'setSomeBtnsHidden');
		
		var dlg = MockDialog.snew();
		var btnCount = 3;
		this.hdr.init(this.g, dlg, btnCount, this.g_items, this.g_field);
		assertEQ ( this.mm.walkLog, 'setParams,initBtnsText,setBtnsText,initBtnsCaller,setBtnsCaller,setAllBtnsVisible,setSomeBtnsHidden' );
		assertEQ ( this.mm.params['setParams'], [this.g, dlg, btnCount, this.g_items, this.g_field] );	
	};
	
	this.test_setParams = function(){
		var dlg = MockDialog.snew();
		var btnCount = 3;
		this.hdr.setParams(this.g, dlg, btnCount, this.g_items, this.g_field);
		assertEQ ( this.hdr.g, this.g );
		assertEQ ( this.hdr.dlg, dlg );
		assertEQ ( this.hdr.btnCount, btnCount );
		assertEQ ( this.hdr.items, this.g_items );
		assertEQ ( this.hdr.field, this.g_field );
	};
	
	this.test_setBtnsText = function(){
		for ( var i=0; i<3; ++i ) {
			this.g_items['opbtn' + (i+1)].setText('');
		}
		
		this.hdr.btnTexts = ['btn1', 'btn2'];
		this.hdr.setBtnsText();
		for ( var i=0; i<2; ++i ) {
			assertEQ ( this.g_items['opbtn' + (i+1)].getText(), this.hdr.btnTexts[i] );
		}
	};
	
	this.test_setBtnsCaller = function(){
		for ( var i=0; i<3; ++i ) {
			this.mm.mock( this.g_items['opbtn' + (i+1)], 'setCallerEx' );
		}
		
		var caller1 = function(){};
		var caller2 = function(){};
		this.hdr.callers = [caller1, caller2];
		this.hdr.setBtnsCaller();
		assertEQ ( this.mm.walkLog, 'setCallerEx,setCallerEx' );
		assertEQ ( this.mm.params['setCallerEx.0'], [{self:this.hdr, caller:caller1}] );
		assertEQ ( this.mm.params['setCallerEx.1'], [{self:this.hdr, caller:caller2}] );
	};	
	
	this.test_setAllBtnsVisible = function(){
		this.g_items.opbtn1.hide();
		this.g_items.opbtn2.hide();
		this.g_items.opbtn3.hide();
		
		this.hdr.setAllBtnsVisible();
		
		assertEQ ( this.g_items.opbtn1.isShow(), true );
		assertEQ ( this.g_items.opbtn2.isShow(), true );
		assertEQ ( this.g_items.opbtn3.isShow(), true );
	};	
	
	this.test_onAddFavorite = function(){
		this.mm.mock( MilitarySender, 'sendAddFavorite' );
		this.hdr.onAddFavorite();
		assertEQ ( this.mm.walkLog, 'sendAddFavorite' );
		assertEQ ( this.mm.params['sendAddFavorite'], [this.g, 1] );	
	};
	
	this.test_onExped = function(){
		this.mm.mock( ExpedUtil, 'expedTo' );
		this.mm.mock( this.hdr.dlg, 'closeDlg' );
		this.hdr.onExped();
		assertEQ ( this.mm.walkLog, 'expedTo,closeDlg' );
		assertEQ ( this.mm.params['expedTo'], [this.g_field] );	
	};
	
	this.test_onSendMail = function(){
		this.mm.mock(UIM.getDlg('writeletter'), 'writeLetterTo');
		this.mm.mock( this.hdr.dlg, 'closeDlg' );

		this.hdr.onSendMail();
		
		assertEQ ( this.mm.walkLog, 'writeLetterTo,closeDlg' );
		assertEQ ( this.mm.params['writeLetterTo'], ['role'] );
	};
	
	this.test_onTalkTo = function(){
		var chatPanel = Class.extern(function(){ this.setChatTarget=function(){}; }).snew();
		UIM.forceRegPanel('chat', chatPanel);
		this.mm.mock(chatPanel, 'setChatTarget');
		this.mm.mock( this.hdr.dlg, 'closeDlg' );
		this.hdr.onTalkTo();
		assertEQ ( this.mm.walkLog, 'setChatTarget,closeDlg' );
		assertEQ ( this.mm.params['setChatTarget'], ['role'] );
	};

	this.test_onAddFriend = function(){
		this.mm.mock( FriendSender, 'sendApplyFriend' );
		this.hdr.onAddFriend();
		assertEQ ( this.mm.walkLog, 'sendApplyFriend' );
		assertEQ ( this.mm.params['sendApplyFriend'], [this.g, 'role'] );
	};
	
	this.test_onEnterFarm = function(){
		var farmPanel = Class.extern(function(){ this.open=function(){}; }).snew();
		if (!UIM.getPanel('farm')) UIM.regPanel('farm', farmPanel);
		
		this.mm.mock(UIM, 'closeMapPanels');
		this.mm.mock(UIM.getPanel('farm'), 'open');
		this.mm.mock( this.hdr.dlg, 'closeDlg' );
		
		this.hdr.onEnterFarm();
		assertEQ ( this.mm.walkLog, 'closeMapPanels,open,closeDlg' );
		assertEQ ( this.mm.params['open'], [10000] );
	};
});

var TestCaseNoOwnerFieldOpHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);

		var dlg = MockDialog.snew();
		var btnCount = 3;
		this.g_items = BaseFieldOpHdrHelperForTestCase.createItemWithBtns(this.g);
		this.g_field = {gridId:1, roleId:10000, objType:OBJ_TYPE.FIELD, roleName:'role', alliance:{uid:2, name:'alli'} };
		this.hdr = NoOwnerFieldOpHdr.snew(this.g, dlg, btnCount, this.g_items, this.g_field);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_initBtnsText = function(){
		this.hdr.btnTexts = null;
		this.hdr.initBtnsText();
		assertEQ ( this.hdr.btnTexts, rstr.field.fielddlg.btn.noOwnerField );
	};
	
	this.test_initBtnsCaller = function(){
		this.hdr.callers = null;
		this.hdr.initBtnsCaller();
		assertEQ ( this.hdr.callers, [this.hdr.onAddFavorite, null, this.hdr.onExped] );
	};
	
	this.test_setSomeBtnsHide = function(){
		this.hdr.setAllBtnsVisible();
		
		this.hdr.setSomeBtnsHidden();
		
		assertEQ ( this.g_items.opbtn2.isShow(), false );
	};
});

var TestCaseSelfFieldOpHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);

		var dlg = MockDialog.snew();
		var btnCount = 3;
		this.g_items = BaseFieldOpHdrHelperForTestCase.createItemWithBtns(this.g);
		this.g_field = {gridId:1, roleId:10000, objType:OBJ_TYPE.FIELD, roleName:'role', alliance:{uid:2, name:'alli'} };
		this.hdr = SelfFieldOpHdr.snew(this.g, dlg, btnCount, this.g_items, this.g_field);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};	
	
	this.test_initBtnsText = function(){
		this.hdr.btnTexts = null;
		this.hdr.initBtnsText();
		assertEQ ( this.hdr.btnTexts, rstr.field.fielddlg.btn.selfField );
	};
	
	this.test_initBtnsCaller = function(){
		this.hdr.callers = null;
		this.hdr.initBtnsCaller();
		assertEQ ( this.hdr.callers, [this.hdr.onAddFavorite, this.hdr.onEnterSelfField, this.hdr.onOpenSelfFieldList] );
	};
	
	this.test_onEnterSelfField = function(){
		var dlg = MockDialog.snew(this.g);
		UIM.regDlg('selffield', dlg);
		this.mm.mock(dlg, 'openDlg');
		this.mm.mock( this.hdr.dlg, 'closeDlg' );
		
		this.hdr.onEnterSelfField();
		assertEQ ( this.mm.walkLog, 'openDlg,closeDlg' );
		assertEQ ( this.mm.params['openDlg'], [this.g_field] );
	};
	
	this.test_onOpenSelfFieldList = function(){
		var dlg = MockDialog.snew(this.g);
		UIM.regDlg('selffieldslist', dlg);
		this.mm.mock(dlg, 'openDlg');
		this.mm.mock( this.hdr.dlg, 'closeDlg' );
		
		this.hdr.onOpenSelfFieldList();
		assertEQ ( this.mm.walkLog, 'openDlg,closeDlg' );
	};
});

var TestCaseAlliFieldOpHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);

		var dlg = MockDialog.snew();
		var btnCount = 3;
		this.g_items = BaseFieldOpHdrHelperForTestCase.createItemWithBtns(this.g);
		this.g_field = {gridId:1, roleId:10000, objType:OBJ_TYPE.FIELD, roleName:'role', alliance:{uid:2, name:'alli'} };
		this.hdr = AlliFieldOpHdr.snew(this.g, dlg, btnCount, this.g_items, this.g_field);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};	
	
	this.test_initBtnsText = function(){
		this.hdr.btnTexts = null;
		this.hdr.initBtnsText();
		assertEQ ( this.hdr.btnTexts, rstr.field.fielddlg.btn.alliOwnerField );
	};
	
	this.test_initBtnsCaller = function(){
		this.hdr.callers = null;
		this.hdr.initBtnsCaller();
		assertEQ ( this.hdr.callers, [this.hdr.onAddFavorite] );
	};
	
	this.test_setSomeBtnsHidden = function(){
		this.hdr.setAllBtnsVisible();
		
		this.hdr.setSomeBtnsHidden();
		
		assertEQ ( this.g_items.opbtn2.isShow(), false );
		assertEQ ( this.g_items.opbtn3.isShow(), false );
	};
});

var TestCaseOtherOwnerFieldOpHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);

		var dlg = MockDialog.snew();
		var btnCount = 3;
		this.g_items = BaseFieldOpHdrHelperForTestCase.createItemWithBtns(this.g);
		this.g_field = {gridId:1, roleId:10000, objType:OBJ_TYPE.FIELD, roleName:'role', alliance:{uid:2, name:'alli'} };
		this.hdr = OtherOwnerFieldOpHdr.snew(this.g, dlg, btnCount, this.g_items, this.g_field);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};	
	
	this.test_initBtnsText = function(){
		this.hdr.btnTexts = null;
		this.hdr.initBtnsText();
		assertEQ ( this.hdr.btnTexts, rstr.field.fielddlg.btn.otherOwnerField );
	};
	
	this.test_initBtnsCaller = function(){
		this.hdr.callers = null;
		this.hdr.initBtnsCaller();
		assertEQ ( this.hdr.callers, [this.hdr.onAddFavorite, null, this.hdr.onExped] );
	};
	
	this.test_setSomeBtnsHidden = function(){
		this.hdr.setAllBtnsVisible();
		
		this.hdr.setSomeBtnsHidden();
		
		assertEQ ( this.g_items.opbtn2.isShow(), false );
	};
});

var TestCaseFieldDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = FieldDlg.snew(this.g);
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		var dlg = FieldDlg.snew(this.g);
		assertEQ ( dlg.lc().m_g, this.g );
		assertEQ ( dlg.lc().m_this, dlg );
	};
	
	this.test_openDlg  = function(){
		this.mm.mock(UIM, 'closeAllFieldDlg' );
		this.mm.mock(this.lc(), '_initParam' );
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_openDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.dlg.openDlg({id:1});
		assertEQ ( this.mm.walkLog, 'closeAllFieldDlg,_initParam,_initDlg,_openDlg,_initInfo' );
		assertEQ ( this.mm.params['_initParam'], [{id:1}] );
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
	
	this.test__initParam = function(){
		assertEQ ( this.lc().m_field, null );
		this.lc()._initParam({id:1});
		assertEQ ( this.lc().m_field, {id:1} );
	};
	
	this.test__initDlg = function(){
		var g_dlg = {};
		this.mm.mock( Dialog, 'snew', [g_dlg] );
		this.mm.mock( this.g.getGUI(), 'initDlg' );
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, 'snew,initDlg' );
		assertEQ ( this.lc().m_dlg, g_dlg );
		assertEQ ( this.mm.params['snew'], [this.g, {modal:false, title:'...', pos:{x:'center', y:50}} ]); 
		assertEQ ( this.mm.params['initDlg'], [g_dlg, uicfg.field.fielddlg, this.lc().m_items] ); 
		
		this.mm.clear();
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '', 'only create one time' );
	};
	
	this.test__openDlg = function(){
		this.lc()._initDlg();
		
		this.lc().m_dlg.hide();
		this.lc()._openDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(this.lc(), '_createOpHdr');
		this.mm.mock(this.lc(), '_setTitle');
		this.mm.mock(this.lc(), '_updateInfo');
		this.lc()._initInfo();
		assertEQ ( this.mm.walkLog, '_createOpHdr,_setTitle,_updateInfo' );
	};
	
	this.test__createOpHdr = function(){
		this.lc()._initDlg();
		
		this.mm.mock(NoOwnerFieldOpHdr, 'snew', [{name:'NoOwnerFieldOpHdr'}]);
		this.mm.mock(SelfFieldOpHdr, 'snew', [{name:'SelfFieldOpHdr'}]);
		this.mm.mock(AlliFieldOpHdr, 'snew', [{name:'AlliFieldOpHdr'}]);
		this.mm.mock(OtherOwnerFieldOpHdr, 'snew', [{name:'OtherOwnerFieldOpHdr'}]);
		
		this.g.getImgr().getRoleRes().name = 'my';
		this.g.getImgr().getRoleRes().alliance.uid = 1;
		
		this.lc().m_field =  {roleId:0};
		this.lc()._createOpHdr();
		assertEQ ( this.lc().m_opHdr, {name:'NoOwnerFieldOpHdr'} );
		assertEQ ( this.mm.params['snew'], [this.g, this.dlg, this.lc().m_btnCount, this.lc().m_items, this.lc().m_field] );
		
		this.lc().m_field = {roleId:1, roleName:'my'};
		this.lc()._createOpHdr();
		assertEQ ( this.lc().m_opHdr, {name:'SelfFieldOpHdr'} );
		assertEQ ( this.mm.params['snew'], [this.g, this.dlg, this.lc().m_btnCount, this.lc().m_items, this.lc().m_field] );
		
		this.lc().m_field = {roleId:1, roleName:'you', alliance:{uid:1} };
		this.lc()._createOpHdr();
		assertEQ ( this.lc().m_opHdr, {name:'AlliFieldOpHdr'} );
		assertEQ ( this.mm.params['snew'], [this.g, this.dlg, this.lc().m_btnCount, this.lc().m_items, this.lc().m_field] );
		
		this.lc().m_field = {roleId:1, roleName:'other', alliance:{uid:2} };
		this.lc()._createOpHdr();
		assertEQ ( this.lc().m_opHdr, {name:'OtherOwnerFieldOpHdr'} );
		assertEQ ( this.mm.params['snew'], [this.g, this.dlg, this.lc().m_btnCount, this.lc().m_items, this.lc().m_field] );
	};
	
	this.test__setTitle = function(){
		this.lc()._initDlg();
		
		this.lc().m_field =  {objType:OBJ_TYPE.FIELD, resid:170001, level:1};
		this.mm.mock(this.lc().m_dlg, 'setTitle');
		this.lc()._setTitle();
		assertEQ ( this.mm.params['setTitle'], [FieldUtil.getFieldName(this.lc().m_field)] );
	};
	
	this.test__updateInfo = function(){
		this.mm.mock ( this.lc(), '_setCityNamePos' );
		this.mm.mock ( this.lc(), '_setFieldDesc' );
		this.mm.mock ( this.lc(), '_setRoleAndAlliacne' );
		this.lc()._updateInfo();
		assertEQ ( this.mm.walkLog, '_setCityNamePos,_setFieldDesc,_setRoleAndAlliacne' );
	};
	
	this.test__setCityNamePos = function(){
		this.lc()._initDlg();
		this.lc().m_field =  {gridId:147*600+310+1};
		this.lc()._setCityNamePos();
		assertEQ ( TQ.getTextEx(this.lc().m_items.cityNamePos), '魏国(310,147)' );
	};
	
	this.test__setFieldDesc = function(){
		this.lc()._initDlg();
		this.lc().m_field =  {};
		this.mm.mock(TQ, 'format', ['desc']);
		this.mm.mock(FieldUtil, 'getFieldName', ['fieldName']);
		this.mm.mock(this.lc(), '_getFieldGetResDesc', ['getRes']);
		this.mm.mock(this.lc(), '_getFieldGetItemsDesc', ['getItems']);
		this.lc()._setFieldDesc();
		assertEQ ( TQ.getTextEx(this.lc().m_items.desc), 'desc' );
		assertEQ ( this.mm.params['format'], [rstr.field.fielddlg.lbl.desc, 'fieldName', 'getRes', 'getItems'] );
		assertEQ ( this.mm.params['getFieldName'], [this.lc().m_field] );
	};
	
	this.test__getFieldGetResDesc = function(){
		res_fields_level = [{id:1002, getfood:1, getwood:2, getstone:3, getiron:4}];
		this.lc().m_field =  {resid:1, level:2};
		assertEQ ( this.lc()._getFieldGetResDesc(), rstr.comm.food + '1,' + rstr.comm.wood + '2,' + rstr.comm.stone + '3,' + rstr.comm.iron + '4' );
	};
	
	this.test__getFieldGetItemsDesc = function(){
		this.mm.mock(ItemResUtil, 'findFieldLevelres', [{peardropid:1}] );
		this.mm.mock(DropItemUtil, 'getProItemsDesc', ['desc'] );
		
		this.lc().m_field =  {resid:1001,level:2};
		assertEQ ( this.lc()._getFieldGetItemsDesc(), 'desc' );
		assertEQ ( this.mm.walkLog, 'findFieldLevelres,getProItemsDesc' );
		assertEQ ( this.mm.params['findFieldLevelres'], [1001, 2] );
		assertEQ ( this.mm.params['getProItemsDesc'], [1] );
	};
	
	this.test__setRoleAndAlliacne = function(){
		this.lc()._initDlg();
		
		this.lc().m_field = {};
		this.lc()._setRoleAndAlliacne();
		assertEQ ( TQ.getTextEx(this.lc().m_items.role), rstr.comm.norole );
		assertEQ ( TQ.getTextEx(this.lc().m_items.alliance), rstr.comm.noalli );
			
		this.lc().m_field = {roleName:''};
		this.lc()._setRoleAndAlliacne();
		assertEQ ( TQ.getTextEx(this.lc().m_items.role), rstr.comm.norole );
		
		this.lc().m_field = {roleName:'role'};
		this.lc()._setRoleAndAlliacne();
		assertEQ ( TQ.getTextEx(this.lc().m_items.role), 'role' );
		
		this.lc().m_field = {alliance:{name:''}};
		this.lc()._setRoleAndAlliacne();
		assertEQ ( TQ.getTextEx(this.lc().m_items.alliance), rstr.comm.noalli );
		
		this.lc().m_field = {alliance:{name:'alli'}};
		this.lc()._setRoleAndAlliacne();
		assertEQ ( TQ.getTextEx(this.lc().m_items.alliance), 'alli' );
	};
});

tqFieldDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseExpedUtil, 'TestCaseExpedUtil');
	suite.addTestCase(TestCaseBaseFieldOpHdr, 'TestCaseBaseFieldOpHdr');
	suite.addTestCase(TestCaseNoOwnerFieldOpHdr, 'TestCaseNoOwnerFieldOpHdr');
	suite.addTestCase(TestCaseSelfFieldOpHdr, 'TestCaseSelfFieldOpHdr');
	suite.addTestCase(TestCaseAlliFieldOpHdr, 'TestCaseAlliFieldOpHdr');
	suite.addTestCase(TestCaseOtherOwnerFieldOpHdr, 'TestCaseOtherOwnerFieldOpHdr');
	suite.addTestCase(TestCaseFieldDlg, 'TestCaseFieldDlg');
};
