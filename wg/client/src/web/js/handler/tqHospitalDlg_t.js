/*******************************************************************************/
requireEx('./handler/tqHospitalDlg.js', [
	{
		start:'//HospitalDlg-unittest-start'
		,end:'//HospitalDlg-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_dlg'
			,'m_items'
			,'m_hurtHeros'
			,'_regEvents'
			,'_initDlg'
			,'_openDlg'
			,'_initInfo'
			,'_createDlg'
			,'_setCallers'
			,'_onClickBuy'
			,'_onClickTreatmentAll'
			,'_update'
			,'_isShow'
			,'_updateHasItemNumber'
			,'_updateNeedItemNumber'
			,'_updateHeroList'
			,'_collectHurtHeros'
			,'_setHeroListItems'
			,'_setHeroListCallers'
			,'_onClickTreatment'
			,'_onHeroUpdate'
			,'_onItemChanged'
			,'_treatmentHeros'
			,'_getHurtHeroIds'
		]
	}
]);
	
TestCaseHospitalDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = HospitalDlg.snew(this.g);
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.lc(), '_regEvents');
		this.dlg.init(this.g);
		assertEQ ( this.lc().m_g , this.g);
		assertEQ ( this.lc().m_this , this.dlg);
		assertEQ ( this.mm.walkLog, '_regEvents' );
	};
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg');
		this.mm.mock(this.lc(), '_openDlg');
		this.mm.mock(this.lc(), '_initInfo');
		this.dlg.openDlg();
		assertEQ ( this.mm.walkLog, '_initDlg,_openDlg,_initInfo' );
	};
	
	this.test__regEvents = function(){
		this.mm.mock(this.g, 'regEvent');
		this.lc()._regEvents();
		assertEQ ( this.mm.walkLog, 'regEvent,regEvent,regEvent' );
		assertEQ ( this.mm.params['regEvent.0'], [EVT.HERO_UPDATE, 0, this.dlg, this.lc()._onHeroUpdate] );
		assertEQ ( this.mm.params['regEvent.1'], [EVT.PKG_CHANGE, 0, this.dlg, this.lc()._onItemChanged] );
		assertEQ ( this.mm.params['regEvent.2'], [EVT.PKG_CHANGE, 2, this.dlg, this.lc()._onItemChanged] );
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
		assertEQ ( this.mm.params['snew'], [this.g,{modal:false, title:rstr.hospitaldlg.title, pos:{x:'center', y:50}}] );
		assertEQ ( this.mm.params['initDlg'], [r_dlg, uicfg.hospitaldlg, this.lc().m_items] );
		assertEQ ( this.lc().m_dlg, r_dlg);
	};
	
	this.test__setCallers = function(){
		this.mm.mock(this.lc().m_items.buy, 'setCaller' );
		this.mm.mock(this.lc().m_items.treatmentAll, 'setCaller' );
		this.lc()._setCallers();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.dlg, caller:this.lc()._onClickBuy}] );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.dlg, caller:this.lc()._onClickTreatmentAll}] );
	};
	
	this.test__openDlg = function(){
		this.lc().m_dlg.hide();
		this.lc()._openDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
	};
	
	this.test__initInfo = function(){
		this.mm.mock(this.lc(), '_update');
		this.lc()._initInfo();
		assertEQ ( this.mm.walkLog, '_update' );
	};
	
	this.test__update = function(){
		var r_isShow = [false];
		this.mm.mock(this.lc(), '_isShow', r_isShow );
		this.mm.mock(this.lc(), '_updateHeroList' );
		this.mm.mock(this.lc(), '_updateHasItemNumber' );
		this.mm.mock(this.lc(), '_updateNeedItemNumber' );
		this.lc()._update();
		assertEQ ( this.mm.walkLog, '_isShow' );
		
		this.mm.clear();
		r_isShow[0] = true;
		this.lc()._update();
		assertEQ ( this.mm.walkLog, '_isShow,_updateHeroList,_updateHasItemNumber,_updateNeedItemNumber' );
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
	
	this.test__updateHeroList = function(){
		this.mm.mock(this.lc(), '_collectHurtHeros');
		this.mm.mock(this.lc(), '_setHeroListItems');
		this.mm.mock(this.lc(), '_setHeroListCallers');
		this.lc()._updateHeroList();
		assertEQ ( this.mm.walkLog, '_collectHurtHeros,_setHeroListItems,_setHeroListCallers' );
	};
	
	this.createCollectHurtHeros = function(){
		var heros = [{id:1,icon:101,name:"name1",level:1,state:0,prof:1,soldier:{resid:150001002,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}]) },
						 {id:2,icon:102,name:"name2",level:2,state:1,prof:2,soldier:{resid:150002002,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:90*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}])},
						 ];
		TestCaseCondition.setPreCond(null, {heros:heros} );
		this.lc()._collectHurtHeros();
	};
	
	this.test__collectHurtHeros = function(){
		this.createCollectHurtHeros();
		assertEQ ( this.lc().m_hurtHeros.length, 1 );
		assertEQ ( this.lc().m_hurtHeros[0].name, 'name2' );
	};
	
	this.test__setHeroListItems = function(){
		this.createCollectHurtHeros();
		this.lc()._setHeroListItems();
		assertEQ ( this.lc().m_items.list.getCount(), 1 );
		var item = this.lc().m_items.list.getItem(0);
		assertEQ ( TQ.getTextEx(item.exsubs.name), 'name2' );
		assertEQ ( TQ.getTextEx(item.exsubs.level), 2 );
		assertEQ ( TQ.getTextEx(item.exsubs.health), 90 );
		assertEQ ( TQ.getTextEx(item.exsubs.neednum), TreatmentHeroHdr.getNeedItemNumber(this.g, [2]) );
	};
	
	this.test__setHeroListCallers = function(){
		this.createCollectHurtHeros();
		this.lc()._setHeroListItems();
		var item = this.lc().m_items.list.getItem(0);
		this.mm.mock(item.exsubs.treatment, 'setId');
		this.mm.mock(item.exsubs.treatment, 'setCaller');
		this.lc()._setHeroListCallers();
		assertEQ ( this.mm.walkLog, 'setId,setCaller' );
		assertEQ ( this.mm.params['setId'], [0] );
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onClickTreatment}] );
	};
	
	this.test__updateHasItemNumber = function(){
		var salveInfo = this.g.getImgr().getSalveInfo();
		salveInfo.max = 10;
		TestCaseCondition.setPreCond(null, { item:{id:FIXID.SALVE, num:5} } );
		this.lc()._updateHasItemNumber();
		assertEQ ( TQ.getTextEx(this.lc().m_items.itemnum), '5/10' );
	};
	
	this.test__updateNeedItemNumber = function(){
		this.createCollectHurtHeros();
		this.mm.mock(TreatmentHeroHdr, 'getNeedItemNumber', [10] );
		this.lc()._updateNeedItemNumber();
		assertEQ ( TQ.getTextEx(this.lc().m_items.neednum), 10 );
		assertEQ ( this.mm.params['getNeedItemNumber'], [this.g, [2]] );
	};
	
	this.test__onClickBuy = function(){
		this.mm.mock(UIM, 'openDlg' );
		this.lc()._onClickBuy();
		assertEQ ( this.mm.params['openDlg'],  ['buyitem', {id:0, resid:FIXID.PKG_SALVE, number:10000}]);
	};
	
	this.test__onClickTreatmentAll = function(){
		this.mm.mock(this.lc(), '_getHurtHeroIds', [[1,2]] );
		this.mm.mock(this.lc(), '_treatmentHeros' );
		this.lc()._onClickTreatmentAll();
		assertEQ ( this.mm.walkLog, '_getHurtHeroIds,_treatmentHeros' );
		assertEQ ( this.mm.params['_treatmentHeros'], [[1,2]] );
	};
	
	this.test__onClickTreatment = function(){
		this.createCollectHurtHeros();
		this.mm.mock(this.lc(), '_treatmentHeros' );
		this.lc()._onClickTreatment(0);
		assertEQ ( this.mm.params['_treatmentHeros'], [[2]] );
	};
	
	this.test__getHurtHeroIds = function(){
		this.createCollectHurtHeros();
		assertEQ ( this.lc()._getHurtHeroIds(), [2] );
	};
	
	this.test__treatmentHeros = function(){
		TestCaseCondition.setPreCond(null, { item:{id:FIXID.SALVE, num:1} } );
		var r_needNumber = [1];
		this.mm.mock(TreatmentHeroHdr, 'getNeedItemNumber', r_needNumber );
		this.mm.mock(this.g.getGUI(), 'msgBox');
		this.mm.mock(HeroSender, 'sendTreatments');

		var p_heroIds = [1,2];
		this.lc()._treatmentHeros(p_heroIds);
		assertEQ ( this.mm.walkLog, 'getNeedItemNumber,sendTreatments' );
		assertEQ ( this.mm.params['getNeedItemNumber'], [this.g, p_heroIds] );
		
		this.mm.clear()
		r_needNumber[0] = 2;
		this.lc()._treatmentHeros(p_heroIds);
		assertEQ ( this.mm.walkLog, 'getNeedItemNumber,msgBox' );
		var msg = RStrUtil.makeNoSalveBuyMsg(FIXID.SALVE, 2, 1);
		assertEQ ( this.mm.params['msgBox'], [rstr.comm.msgts, msg, MB_F_CLOSE, null] );
	};
	
	this.test__onHeroUpdate = function(){
		var r_isShow = [false];
		this.mm.mock(this.lc(), '_isShow', r_isShow );
		this.mm.mock(this.lc(), '_updateHeroList' );
		this.mm.mock(this.lc(), '_updateNeedItemNumber' );
		this.lc()._onHeroUpdate();
		assertEQ ( this.mm.walkLog, '_isShow' );
		
		this.mm.clear();
		r_isShow[0] = true;
		this.lc()._onHeroUpdate();
		assertEQ ( this.mm.walkLog, '_isShow,_updateHeroList,_updateNeedItemNumber' );
	};
	
	this.test__onItemChanged = function(){
		var r_isShow = [false];
		this.mm.mock(this.lc(), '_isShow', r_isShow );
		this.mm.mock(this.lc(), '_updateHasItemNumber' );
		this.lc()._onItemChanged();
		assertEQ ( this.mm.walkLog, '_isShow' );
		
		this.mm.clear();
		r_isShow[0] = true;
		this.lc()._onItemChanged();
		assertEQ ( this.mm.walkLog, '_isShow,_updateHasItemNumber' );
	};
});

tqHospitalDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseHospitalDlg, 'TestCaseHospitalDlg');
};
