/*******************************************************************************/
requireEx('./handler/tqSteelHeroDlg.js', [
	{
		start:'//SteelHeroDlg-unittest-start'
		,end:'//SteelHeroDlg-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_dlg'
			,'m_items'
			,'m_flag'
			,'m_heros'
			,'m_steelOpHdr'
			,'_initParams'
			,'_regEvents'
			,'_initParamsWhenOpen'
			,'_createSteelOpHdr'
			,'_setTitleAndExpendLbl'
			,'_initDlg'
			,'_createDlg'
			,'_setCallers'
			,'_openDlg'
			,'_initInfo'
			,'_onHeroUpdate'
			,'_getHoursLimit'
			,'_onHoursChange'
			,'_onClickSteel'
			,'_setSteelDesc'
			,'_setSpeedHighSteelDesc'
			,'_update'
			,'_updateHerosList'
			,'_updateExpendDesc'
			,'_isShow'
			,'_setHerosListItems'
			,'_setHerosListCallers'
			,'_onClickChangeBtn'
			,'_onSelectSteelType'
			,'_getInputSteelQuarters'
			]
	}
]);
	
TestBaseHeroSteelOpHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.hdr = BaseHeroSteelOpHdr.snew(this.g, []);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getNeedExpends = function(){
		this.hdr.heros = [{id:1},{id:2}];
		this.mm.mock(this.hdr, '_getNeedExpend', [1]);
		
		var p_steelQuarters = 10;
		assertEQ ( this.hdr._getNeedExpends(p_steelQuarters), 2 );
		assertEQ ( this.mm.params['_getNeedExpend.0'], [0, p_steelQuarters] );
		assertEQ ( this.mm.params['_getNeedExpend.1'], [1, p_steelQuarters] );
	};
	
	this.test__getMaxLevelNeedExp = function(){
		var p_hero = {level:59, attrs:{}, skeleton:{level:0}};
		p_hero.attrs[ATTR.XP] = {val:10};
		assertEQ ( this.hdr._getMaxLevelNeedExp(p_hero), res_herolevelexps[60-1].needexp - 10 );
			
		var p_hero = {level:58, attrs:{}, skeleton:{level:0}};
		p_hero.attrs[ATTR.XP] = {val:10};
		var expectExp = (res_herolevelexps[59-1].needexp - 10) + res_herolevelexps[60-1].needexp;
		assertEQ ( this.hdr._getMaxLevelNeedExp(p_hero), expectExp );
	};
	
	this.test__getHerosSteelQuarters = function(){
		this.hdr.heros = [{id:1, level:1},{id:2, level:1}];
		this.mm.mock( this.hdr, '_getHeroSteelQuarters', [1] );
		
		var p_steelQuarters = 10;
		assertEQ ( this.hdr._getHerosSteelQuarters(p_steelQuarters), [1,1] );
		assertEQ ( this.mm.params['_getHeroSteelQuarters.0'], [0, p_steelQuarters] );
		assertEQ ( this.mm.params['_getHeroSteelQuarters.1'], [1, p_steelQuarters] );
	};	
	
	this.test__getHeroSteelQuarters = function(){
		
		this.hdr.heros = [{id:1, level:1}];
		var r__getMaxLevelNeedExp = [100000000];
		this.mm.mock( this.hdr, '_getMaxLevelNeedExp', r__getMaxLevelNeedExp );
		this.mm.mock( this.hdr, '_getCanGetExpPerQuarter', [100] );
		
		var p_steelQuarters = 10;
		assertEQ ( this.hdr._getHeroSteelQuarters(0, p_steelQuarters), 10 );
		
		r__getMaxLevelNeedExp[0] = 1;
		assertEQ ( this.hdr._getHeroSteelQuarters(0, p_steelQuarters), 1 );
	};
});

TestCommHeroSteelOpHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.hdr = CommHeroSteelOpHdr.snew(this.g, []);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getTitle = function(){
		assertEQ ( this.hdr.getTitle(), rstr.steelherodlg.title );
	};
	
	this.test_getNeedExpendLbl = function(){
		assertEQ ( this.hdr.getNeedExpendLbl(), rstr.steelherodlg.lbl.needMoneyLbl );
	};
	
	this.test_getCanGetExp = function(){
		this.mm.mock(this.hdr, '_getHeroSteelQuarters', [2] );
		var p_idx = 0;
		var p_hero = {id:1, level:1};
		var p_steelQuarters = 8;
		assertEQ ( this.hdr.getCanGetExp(p_idx, p_hero, p_steelQuarters), res_herosteel[0].commGetExp*2 );
		assertEQ ( this.mm.params['_getHeroSteelQuarters'], [p_idx, p_steelQuarters] );
	};
	
	this.test_getNeedExpendStr = function(){
		var p_idx = 0;
		var p_hero = {id:1, level:1};
		var p_steelQuarters = 2;
		this.mm.mock(this.hdr, '_getNeedExpend', [10]);
		assertEQ ( this.hdr.getNeedExpendStr(p_idx, p_hero, p_steelQuarters), 10 );
		assertEQ ( this.mm.params['_getNeedExpend'], [p_idx, p_steelQuarters] );
	};
	
	this.test_setOpDom = function(){
		var p_idx = 0;
		var p_hero = {id:1};
		var p_uiItem = {exsubs:{opDom:MockDom.snew('div')}};
		this.mm.mock(TQ, 'setCSS');
		this.hdr.setOpDom(p_idx, p_hero, p_uiItem);
		assertEQ ( this.mm.params['setCSS'], [p_uiItem.exsubs.opDom, 'display', 'none' ] );
	};
	
	this.test_getMaxSteelHours = function(){
		assertEQ( this.hdr.getMaxSteelHours(), res_comm_herosteel_max_hours);
	};
	
	this.test_getExpendDesc = function(){
		this.mm.mock(this.hdr, '_getNeedExpend', [1] );
		this.hdr.heros = [{id:1},{id:2}];
		var p_steelQuarters = 10;
		assertEQ ( this.hdr.getExpendDesc(p_steelQuarters), TQ.format(rstr.steelherodlg.lbl.needMoney, 2));
		assertEQ ( this.mm.walkLog, '_getNeedExpend,_getNeedExpend' );
		assertEQ ( this.mm.params['_getNeedExpend.0'], [0, p_steelQuarters] );
		assertEQ ( this.mm.params['_getNeedExpend.1'], [1, p_steelQuarters] );
	};
	
	this.test__getNeedExpend = function(){
		this.hdr.heros = [{id:1, level:1}];
		
		this.mm.mock(this.hdr, '_getHeroSteelQuarters', [1] );
		
		var p_idx = 0;
		var p_steelQuarters = 2;
		
		assertEQ ( this.hdr._getNeedExpend(p_idx, p_steelQuarters), res_herosteel[0].expendMoney*1 );
		assertEQ ( this.mm.params['_getHeroSteelQuarters'], [p_idx, p_steelQuarters] );
	};
	
	this.test_isEnoughExpend = function(){
		this.mm.mock(this.hdr, '_getNeedExpends', [10] );
		this.g.getImgr().setMoney(10);
		var p_steelQuarters = 1;
		assertEQ ( this.hdr.isEnoughExpend(p_steelQuarters), true )
		assertEQ ( this.mm.params['_getNeedExpends'], [p_steelQuarters] );
		
		this.g.getImgr().setMoney(9);
		assertEQ ( this.hdr.isEnoughExpend(p_steelQuarters), false )
	};
	
	this.test_getNotEnoughExpendMsg = function(){
		this.g.getImgr().setMoney(10);
		
		var p_steelQuarters = 1;
		
		var expectMsg = TQ.format(rstr.comm.noEnoughBuyMoney
			,this.hdr._getNeedExpends(p_steelQuarters)
			,this.g.getImgr().getMoney()
			,FIXID.MONEYPKGID);
		assertEQ ( this.hdr.getNotEnoughExpendMsg(p_steelQuarters), expectMsg );
	};
	
	this.test_sendSteelMsg = function(){
		this.mm.mock( this.hdr, '_getHerosSteelQuarters', [ [1,2,3] ] );
		this.mm.mock( HeroSender, 'sendHerosSteel' );
		var p_steelQuarters = 10;
		this.hdr.sendSteelMsg(p_steelQuarters);
		assertEQ ( this.mm.params['_getHerosSteelQuarters'], [p_steelQuarters] );
		assertEQ ( this.mm.params['sendHerosSteel'], [this.g, 'steel', [], [1,2,3], null] );
	};
	
	this.test__getCanGetExpPerQuarter = function(){
		this.hdr.heros = [{level:1}];
		var p_idx = 0;
		assertEQ ( this.hdr._getCanGetExpPerQuarter( p_idx ), res_herosteel[0].commGetExp );
	};
	
	this.test_getSpeedEffectSteelHeroCount = function(){
		assertEQ ( this.hdr.getSpeedEffectSteelHeroCount(), 0 );
	};
});

TestHighHeroSteelOpHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.p_heros = [{id:1,level:1},{id:2,level:res_hero_lowsteel_level+1},{id:3,level:res_hero_lowsteel_level}];
		this.hdr = HighHeroSteelOpHdr.snew(this.g, this.p_heros);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__initOneTime = function(){
		this.hdr._initOneTime();
		assertEQ ( this.hdr.efficiencys, [{can:true,cur:true},{can:false,cur:false},{can:true,cur:true}] );
	};
	
	this.test_getTitle = function(){
		assertEQ ( this.hdr.getTitle(), rstr.steelherodlg.highTitle );
	};
	
	this.test_getNeedExpendLbl = function(){
		assertEQ ( this.hdr.getNeedExpendLbl(), rstr.steelherodlg.lbl.needGoldLbl );
	};
	
	this.test_getCanGetExp = function(){
		var p_idx = 0;
		var p_hero = {id:1, level:1};
		var p_steelQuarters = 8;
		
		this.mm.mock(this.hdr, '_getHeroSteelQuarters', [2] );
		
		this.hdr.efficiencys = [{can:true, cur:true}];
		assertEQ ( this.hdr.getCanGetExp(p_idx, p_hero, p_steelQuarters), res_herosteel[0].highGetExp*2*2 );
		assertEQ ( this.mm.params['_getHeroSteelQuarters'], [p_idx, p_steelQuarters] );
		
		this.hdr.efficiencys = [{can:true, cur:false}];
		assertEQ ( this.hdr.getCanGetExp(p_idx, p_hero, p_steelQuarters), res_herosteel[0].highGetExp*2*1 );
	};
	
	this.test_getNeedExpendStr = function(){
		var p_idx = 0;
		var p_hero = {id:1, level:1};
		var p_steelQuarters = 8;
		
		var r_getHeroSteelQuarters = [2];
		this.mm.mock(this.hdr, '_getHeroSteelQuarters', r_getHeroSteelQuarters );
		
		this.hdr.efficiencys = [{can:true, cur:true}];
		assertEQ ( this.hdr.getNeedExpendStr(p_idx, p_hero, p_steelQuarters), TQ.format(rstr.steelherodlg.lbl.needAddGold, 1, 2) );
		assertEQ ( this.mm.params['_getHeroSteelQuarters'], [p_idx, p_steelQuarters] );
		
		p_steelQuarters = 16;
		r_getHeroSteelQuarters[0] = 4;
		this.hdr.efficiencys = [{can:true, cur:false}];
		assertEQ ( this.hdr.getNeedExpendStr(p_idx, p_hero, p_steelQuarters), 2 );
	};
	
	this.test_setOpDom = function(){
		var p_idx = 0;
		var p_hero = {id:1};
		var p_uiItem = {exsubs:{opDom:MockDom.snew('div'), addEfficiency:MockDom.snew('div')}};
		
		this.hdr.efficiencys = [{can:true, cur:true}];
		this.mm.mock(TQ, 'setCSS');
		this.hdr.setOpDom(p_idx, p_hero, p_uiItem);
		assertEQ ( this.mm.params['setCSS'], [p_uiItem.exsubs.opDom, 'display', 'block' ] );
		assertEQ ( TQ.getTextEx(p_uiItem.exsubs.addEfficiency), TQ.format(rstr.steelherodlg.lbl.addEfficiency, 100) );
		
		this.mm.clear();
		this.hdr.efficiencys = [{can:false, cur:false}];
		this.hdr.setOpDom(p_idx, p_hero, p_uiItem);
		assertEQ ( this.mm.params['setCSS'], [p_uiItem.exsubs.opDom, 'display', 'none' ] );
		assertEQ ( TQ.getTextEx(p_uiItem.exsubs.addEfficiency), '' );
	};
	
	this.test_getMaxSteelHours = function(){
		assertEQ( this.hdr.getMaxSteelHours(), res_high_herosteel_max_hours);
	};
	
	this.test_getExpendDesc = function(){
		this.mm.mock(this.hdr, '_getNeedExpends', [1]);
		var p_steelQuarters = 2;
		assertEQ ( this.hdr.getExpendDesc(p_steelQuarters), TQ.format(rstr.steelherodlg.lbl.needGold, 1) );
		assertEQ ( this.mm.params['_getNeedExpends'], [p_steelQuarters] );
	};
	
	this.test_getSteelEfficiencyType = function(){
		this.hdr.efficiencys = [{can:true, cur:true},{can:true, cur:false}];
		var p_idx = 0;
		assertEQ ( this.hdr.getSteelEfficiencyType(p_idx), 'speed' );
		var p_idx = 1;
		assertEQ ( this.hdr.getSteelEfficiencyType(p_idx), 'normal' );
	};
	
	this.test_setSteelEfficiencyType = function(){
		this.hdr.efficiencys = [{can:true, cur:true}];
		var p_idx = 0;
		this.hdr.setSteelEfficiencyType(p_idx, 'normal' );
		assertEQ ( this.hdr.getSteelEfficiencyType(p_idx), 'normal' );
		
		this.hdr.setSteelEfficiencyType(p_idx, 'speed' );
		assertEQ ( this.hdr.getSteelEfficiencyType(p_idx), 'speed' );
	};
	
	this.test__getNeedExpend = function(){
		this.hdr.heros = [{id:1},{id:2}];
		this.hdr.efficiencys = [{can:true, cur:true},{can:true, cur:false}];
		var p_idx = 0;
		var p_hero = {};
		var p_steelQuarters = 2;
		var r_getHeroSteelQuarters = [2];
		this.mm.mock(this.hdr, '_getHeroSteelQuarters', r_getHeroSteelQuarters );
		assertEQ ( this.hdr._getNeedExpend(p_idx, p_steelQuarters),  Math.ceil(2*(2/4 + 3/4)) );
		assertEQ ( this.mm.params['_getHeroSteelQuarters'], [p_idx, p_steelQuarters] );
		
		p_idx = 1;
		p_steelQuarters = 4;
		r_getHeroSteelQuarters[0] = 4;
		assertEQ ( this.hdr._getNeedExpend(p_idx, p_steelQuarters),  2);
	};
	
	this.test_isEnoughExpend = function(){
		this.mm.mock(this.hdr, '_getNeedExpends', [10] );
		this.g.getImgr().setGold(10);
		var p_steelQuarters = 1;
		assertEQ ( this.hdr.isEnoughExpend(p_steelQuarters), true )
		assertEQ ( this.mm.params['_getNeedExpends'], [p_steelQuarters] );
		
		this.g.getImgr().setGold(9);
		assertEQ ( this.hdr.isEnoughExpend(p_steelQuarters), false )
	};
	
	this.test_getNotEnoughExpendMsg = function(){
		this.g.getImgr().setGold(10);
		this.hdr.heros = [{id:1},{id:2}];
		
		var p_steelQuarters = 1;
		this.mm.mock(this.hdr, '_getNeedExpends', [10] );
		
		var expectMsg = TQ.format(rstr.comm.noEnoughRechargeGold, 10, this.g.getImgr().getGold());
		assertEQ ( this.hdr.getNotEnoughExpendMsg(p_steelQuarters), expectMsg );
		assertEQ ( this.mm.params['_getNeedExpends'], [p_steelQuarters] );
	};
	
	this.test_sendSteelMsg = function(){
		this.mm.mock( this.hdr, '_getHerosSteelQuarters', [ [1,2,3] ] );
		this.mm.mock( HeroSender, 'sendHerosSteel' );
		var p_steelQuarters = 10;
		this.hdr.sendSteelMsg(p_steelQuarters);
		assertEQ ( this.mm.params['_getHerosSteelQuarters'], [p_steelQuarters] );
		assertEQ ( this.mm.params['sendHerosSteel'], [this.g, 'highsteel', this.p_heros, [1,2,3], this.hdr.efficiencys] );
	};
	
	this.test__getCanGetExpPerQuarter = function(){
		this.hdr.heros = [{id:1,level:1},{id:2, level:1}];
		this.hdr.efficiencys = [{cur:true},{cur:false}];
		
		var p_idx = 0;
		var steelRes = res_herosteel[0];
		assertEQ ( this.hdr._getCanGetExpPerQuarter(p_idx), steelRes.highGetExp*2 );
		
		var p_idx = 1;
		assertEQ ( this.hdr._getCanGetExpPerQuarter(p_idx), steelRes.highGetExp );
	};
	
	this.test_getSpeedEffectSteelHeroCount = function(){
		this.hdr.efficiencys = [{can:true, cur:true},{can:true, cur:false},{can:false, cur:false}];
		assertEQ ( this.hdr.getSpeedEffectSteelHeroCount(), 1 );
	};
});

TestCaseVip1HeroSteelOpHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.p_heros = [{id:1,level:1},{id:2,level:res_hero_lowsteel_level+1},{id:3,level:res_hero_lowsteel_level}];
		this.hdr = Vip1HeroSteelOpHdr.snew(this.g, this.p_heros);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getTitle = function(){
		assertEQ ( this.hdr.getTitle(), rstr.steelherodlg.vip1Title );
	};
	
	this.test_getCanGetExp = function(){
		var p_idx = 0;
		var p_hero = {id:1, level:1};
		var p_steelQuarters = 8;
		
		this.mm.mock(this.hdr, '_getHeroSteelQuarters', [2] );
		
		this.hdr.efficiencys = [{can:true, cur:true}];
		assertEQ ( this.hdr.getCanGetExp(p_idx, p_hero, p_steelQuarters), res_herosteel[0].high1GetExp*2*2 );
		assertEQ ( this.mm.params['_getHeroSteelQuarters'], [p_idx, p_steelQuarters] );
		
		this.hdr.efficiencys = [{can:true, cur:false}];
		assertEQ ( this.hdr.getCanGetExp(p_idx, p_hero, p_steelQuarters), res_herosteel[0].high1GetExp*2*1 );
	};
	
	this.test_getNeedExpendStr = function(){
		var p_idx = 0;
		var p_hero = {id:1, level:1};
		var p_steelQuarters = 8;
		
		var r_getHeroSteelQuarters = [4];
		this.mm.mock(this.hdr, '_getHeroSteelQuarters', r_getHeroSteelQuarters );
		
		this.hdr.efficiencys = [{can:true, cur:true}];
		assertEQ ( this.hdr.getNeedExpendStr(p_idx, p_hero, p_steelQuarters), TQ.format(rstr.steelherodlg.lbl.needAddGold, 5, 6) );
		assertEQ ( this.mm.params['_getHeroSteelQuarters'], [p_idx, p_steelQuarters] );
		
		p_steelQuarters = 16;
		r_getHeroSteelQuarters[0] = 4;
		this.hdr.efficiencys = [{can:true, cur:false}];
		assertEQ ( this.hdr.getNeedExpendStr(p_idx, p_hero, p_steelQuarters), 5 );
	};	
	
	this.test_sendSteelMsg = function(){
		this.mm.mock( this.hdr, '_getHerosSteelQuarters', [ [1,2,3] ] );
		this.mm.mock( HeroSender, 'sendHerosSteel' );
		var p_steelQuarters = 10;
		this.hdr.sendSteelMsg(p_steelQuarters);
		assertEQ ( this.mm.params['_getHerosSteelQuarters'], [p_steelQuarters] );
		assertEQ ( this.mm.params['sendHerosSteel'], [this.g, 'vip1steel', this.p_heros, [1,2,3], this.hdr.efficiencys] );
	};
});

TestCaseVip2HeroSteelOpHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.p_heros = [{id:1,level:1},{id:2,level:res_hero_lowsteel_level+1},{id:3,level:res_hero_lowsteel_level}];
		this.hdr = Vip2HeroSteelOpHdr.snew(this.g, this.p_heros);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getTitle = function(){
		assertEQ ( this.hdr.getTitle(), rstr.steelherodlg.vip2Title );
	};
	
	this.test_getCanGetExp = function(){
		var p_idx = 0;
		var p_hero = {id:1, level:1};
		var p_steelQuarters = 8;
		
		this.mm.mock(this.hdr, '_getHeroSteelQuarters', [2] );
		
		this.hdr.efficiencys = [{can:true, cur:true}];
		assertEQ ( this.hdr.getCanGetExp(p_idx, p_hero, p_steelQuarters), res_herosteel[0].high2GetExp*2*2 );
		assertEQ ( this.mm.params['_getHeroSteelQuarters'], [p_idx, p_steelQuarters] );
		
		this.hdr.efficiencys = [{can:true, cur:false}];
		assertEQ ( this.hdr.getCanGetExp(p_idx, p_hero, p_steelQuarters), res_herosteel[0].high2GetExp*2*1 );
	};
	
	this.test_getNeedExpendStr = function(){
		var p_idx = 0;
		var p_hero = {id:1, level:1};
		var p_steelQuarters = 8;
		
		var r_getHeroSteelQuarters = [4];
		this.mm.mock(this.hdr, '_getHeroSteelQuarters', r_getHeroSteelQuarters );
		
		this.hdr.efficiencys = [{can:true, cur:true}];
		assertEQ ( this.hdr.getNeedExpendStr(p_idx, p_hero, p_steelQuarters), TQ.format(rstr.steelherodlg.lbl.needAddGold, 10, 12) );
		assertEQ ( this.mm.params['_getHeroSteelQuarters'], [p_idx, p_steelQuarters] );
		
		p_steelQuarters = 16;
		r_getHeroSteelQuarters[0] = 4;
		this.hdr.efficiencys = [{can:true, cur:false}];
		assertEQ ( this.hdr.getNeedExpendStr(p_idx, p_hero, p_steelQuarters), 10 );
	};	
	
	this.test_sendSteelMsg = function(){
		this.mm.mock( this.hdr, '_getHerosSteelQuarters', [ [1,2,3] ] );
		this.mm.mock( HeroSender, 'sendHerosSteel' );
		var p_steelQuarters = 10;
		this.hdr.sendSteelMsg(p_steelQuarters);
		assertEQ ( this.mm.params['_getHerosSteelQuarters'], [p_steelQuarters] );
		assertEQ ( this.mm.params['sendHerosSteel'], [this.g, 'vip2steel', this.p_heros, [1,2,3], this.hdr.efficiencys] );
	};
});

TestCaseSteelHeroDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = SteelHeroDlg.snew(this.g);
		this.lc = this.dlg.lc;
		this.lc().m_heros = [];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock ( this.lc(), '_initParams' );
		this.mm.mock ( this.lc(), '_regEvents' );
		this.dlg.init ( this.g );
		assertEQ ( this.mm.walkLog, '_initParams,_regEvents' );
		assertEQ ( this.mm.params['_initParams'], [this.dlg, this.g] );
	};
	
	this.test_openDlg = function(){
		this.mm.mock ( this.lc(), '_initParamsWhenOpen' );
		this.mm.mock ( this.lc(), '_initDlg' );
		this.mm.mock ( this.lc(), '_createSteelOpHdr' );
		this.mm.mock ( this.lc(), '_openDlg' );
		this.mm.mock ( this.lc(), '_setTitleAndExpendLbl' );
		this.mm.mock ( this.lc(), '_initInfo' );
		
		var p_needSteelHeros = [{}];
		this.dlg.openDlg('steel', p_needSteelHeros);
		assertEQ ( this.mm.walkLog, '_initParamsWhenOpen,_initDlg,_createSteelOpHdr,_openDlg,_setTitleAndExpendLbl,_initInfo' );
		assertEQ ( this.mm.params['_initParamsWhenOpen'], ['steel', p_needSteelHeros] );
	};
	
	this.test__initParams = function(){
		this.lc()._initParams(this.dlg, this.g);
		assertEQ ( this.lc().m_this, this.dlg);
		assertEQ ( this.lc().m_g, this.g);
	};
	
	this.test__regEvents = function(){
		this.mm.mock( this.g, 'regEvent' );
		this.lc()._regEvents();
		assertEQ ( this.mm.walkLog, 'regEvent' );
		assertEQ ( this.mm.params['regEvent'], [EVT.HERO_UPDATE, 0, this.dlg, this.lc()._onHeroUpdate] );
	};
	
	this.test__initParamsWhenOpen = function(){
		var p_needSteelHeros = [{}];
		this.lc()._initParamsWhenOpen('steel', p_needSteelHeros);
		assertEQ ( this.lc().m_flag, 'steel' );
		assertEQ ( this.lc().m_heros, p_needSteelHeros );
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
		assertEQ ( this.mm.params['snew'], [this.g,{modal:false, title:rstr.steelherodlg.title, pos:{x:'center', y:50}}] );
		assertEQ ( this.mm.params['initDlg'], [r_dlg, uicfg.hero.steelherodlg, this.lc().m_items] );
		assertEQ ( this.lc().m_dlg, r_dlg);
	};
	
	this.test__setCallers = function(){
		this.lc()._initDlg();
		this.mm.mock(this.lc().m_items.ihour, 'setLimit' );
		this.mm.mock(this.lc().m_items.ihour, 'setCaller' );
		this.mm.mock(this.lc().m_items.steelBtn, 'setCaller' );
		this.lc()._setCallers();
		assertEQ ( this.mm.walkLog, 'setLimit,setCaller,setCaller' );
		assertEQ ( this.mm.params['setLimit'], [this.lc()._getHoursLimit] );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.dlg, caller:this.lc()._onHoursChange}] );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.dlg, caller:this.lc()._onClickSteel}] );
	};
	
	this.test__createSteelOpHdr = function(){
		this.lc()._initDlg();
		this.mm.mock ( CommHeroSteelOpHdr, 'snew', [CommHeroSteelOpHdr.snew(this.g, [])]);
		this.mm.mock ( HighHeroSteelOpHdr, 'snew', [HighHeroSteelOpHdr.snew(this.g, [])]);
		this.lc().m_flag = 'steel';
		this.lc()._createSteelOpHdr();
		//assertEQ ( this.lc().m_steelOpHdr instanceof CommHeroSteelOpHdr, true );
		assertEQ ( this.mm.params['snew'], [this.g, this.lc().m_heros, this.lc().m_dlg, this.lc().m_items] );
		
		this.lc().m_flag = 'vip1steel';
		this.lc()._createSteelOpHdr();
		//assertEQ ( this.lc().m_steelOpHdr instanceof Vip1HeroSteelOpHdr, true );
		assertEQ ( this.mm.params['snew'], [this.g, this.lc().m_heros, this.lc().m_dlg, this.lc().m_items] );
		
		this.lc().m_flag = 'vip2steel';
		this.lc()._createSteelOpHdr();
		//assertEQ ( this.lc().m_steelOpHdr instanceof Vip2HeroSteelOpHdr, true );
		assertEQ ( this.mm.params['snew'], [this.g, this.lc().m_heros, this.lc().m_dlg, this.lc().m_items] );
	};
	
	this.test__openDlg = function(){
		this.lc()._createDlg();
		this.lc().m_dlg.hide();
		this.lc()._openDlg();
		assertEQ ( this.lc().m_dlg.isShow(), true );
	};
	
	this.test__setTitleAndExpendLbl = function(){
		this.lc()._initDlg();
		this.lc().m_flag = 'steel';
		this.lc()._createSteelOpHdr();
		
		this.mm.mock ( this.lc().m_steelOpHdr, 'getTitle', ['title']);
		this.mm.mock ( this.lc().m_steelOpHdr, 'getNeedExpendLbl', ['expendLbl']);
		this.lc()._setTitleAndExpendLbl();
		assertEQ ( this.lc().m_dlg.getTitle(), 'title' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.needExpendLbl), 'expendLbl' );
	};	
	
	this.test__initInfo = function(){
		this.lc()._initDlg();
		
		this.mm.mock(this.lc().m_items.ihour, 'setVal');
		this.mm.mock(this.lc(), '_setSteelDesc');
		this.mm.mock(this.lc(), '_setSpeedHighSteelDesc');
		this.mm.mock(this.lc(), '_update');
		this.lc()._initInfo();
		assertEQ ( this.mm.walkLog, 'setVal,_setSteelDesc,_setSpeedHighSteelDesc,_update' );
		assertEQ ( this.mm.params['setVal'], [1] );
	};
	
	this.test__setSteelDesc = function(){
		this.lc()._initDlg();
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.STEEL_BUILD, level:1}] });
		this.lc()._setSteelDesc();
		var res = ItemResUtil.findBuildLevelres(FIXID.STEEL_BUILD, 1);
		assertEQ ( TQ.getTextEx(this.lc().m_items.steelDesc), TQ.format(rstr.steelherodlg.lbl.steelDesc, res.herosteelmaxlevel));
	};
	
	this.test__setSpeedHighSteelDesc = function(){
		this.lc()._initDlg();
		this.lc().m_flag = 'steel';
		this.lc()._createSteelOpHdr();
		
		var r_getSpeedEffectSteelHeroCount = [1];
		this.mm.mock(this.lc().m_steelOpHdr, 'getSpeedEffectSteelHeroCount', r_getSpeedEffectSteelHeroCount );
		this.lc()._setSpeedHighSteelDesc();
		assertEQ ( TQ.getTextEx(this.lc().m_items.speedHighSteelDesc), TQ.format(rstr.steelherodlg.lbl.speedHighSteelDesc, 1));
		
		r_getSpeedEffectSteelHeroCount[0] = 0;
		this.lc()._setSpeedHighSteelDesc();
		assertEQ ( TQ.getTextEx(this.lc().m_items.speedHighSteelDesc), '');
	};
	
	this.test__update = function(){
		var r_isShow = [false];
		this.mm.mock(this.lc(), '_isShow', r_isShow);
		this.mm.mock(this.lc(), '_updateHerosList');
		this.mm.mock(this.lc(), '_updateExpendDesc');
		this.lc()._update();
		assertEQ ( this.mm.walkLog, '_isShow' );
		
		this.mm.clear();
		r_isShow[0] = true;
		this.lc()._update();
		assertEQ ( this.mm.walkLog, '_isShow,_updateHerosList,_updateExpendDesc' );
	};
	
	this.test__isShow = function(){
		assertEQ ( this.lc()._isShow(), false );
		this.lc()._initDlg();
		this.lc().m_dlg.hide();
		assertEQ ( this.lc()._isShow(), false );
		this.lc().m_dlg.show();
		assertEQ ( this.lc()._isShow(), true );
	};
	
	this.test__updateHerosList = function(){
		this.mm.mock(this.lc(), '_setHerosListItems');
		this.mm.mock(this.lc(), '_setHerosListCallers');

		this.lc()._updateHerosList();
		assertEQ ( this.mm.walkLog, '_setHerosListItems,_setHerosListCallers' );
	};
	
	this.test__setHerosListItems = function(){
		var dayacts = this.g.getImgr().getActivityVal().dayacts;
		var todayActs = TQ.find(dayacts, 'day', 0).acts;
		this.g.setSvrTimeS(1379520000 + 20*3600);
		todayActs.push(SVR_TODAY_ACT_TYPE.HERO_STEEL_2);
		todayActs.push(SVR_TODAY_ACT_TYPE.HERO_STEEL_3);
		
		this.lc()._initDlg();
		this.lc().m_flag = 'steel';
		this.lc()._createSteelOpHdr();
		
		this.lc().m_heros = [{name:'hero1', level:1},{name:'hero2', level:2}];
		
		this.mm.mock(this.lc(), '_getInputSteelQuarters', [2] );
		this.mm.mock(this.lc().m_steelOpHdr, 'getCanGetExp', [1] );
		this.mm.mock(this.lc().m_steelOpHdr, 'getNeedExpendStr', [2] );
		this.mm.mock(this.lc().m_steelOpHdr, 'setOpDom' );
		this.lc()._setHerosListItems();
		assertEQ ( this.lc().m_items.list.getCount(), 2 );
		assertEQ ( this.mm.walkLog, '_getInputSteelQuarters,getCanGetExp,getNeedExpendStr,setOpDom,getCanGetExp,getNeedExpendStr,setOpDom' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(0).exsubs.name), 'hero1' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(0).exsubs.level), 1 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(0).exsubs.canGetExp), 1*(2+3) );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(0).exsubs.needExpend), 2 );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(1).exsubs.name), 'hero2' );
		assertEQ ( TQ.getTextEx(this.lc().m_items.list.getItem(1).exsubs.level), 2 );
		assertEQ ( this.mm.params['getCanGetExp.0'], [0, this.lc().m_heros[0], 2] ); 
		assertEQ ( this.mm.params['getNeedExpendStr.0'], [0, this.lc().m_heros[0], 2] ); 
		assertEQ ( this.mm.params['setOpDom.0'], [0, this.lc().m_heros[0], this.lc().m_items.list.getItem(0)] ); 
		assertEQ ( this.mm.params['getCanGetExp.1'], [1, this.lc().m_heros[1], 2] ); 
		assertEQ ( this.mm.params['getNeedExpendStr.1'], [1, this.lc().m_heros[1], 2] ); 
		assertEQ ( this.mm.params['setOpDom.1'], [1, this.lc().m_heros[1], this.lc().m_items.list.getItem(1)] ); 
	};
	
	this.test__setHerosListCallers = function(){
		this.lc()._initDlg();
		this.lc().m_items.list.setItemCount(2);
		this.mm.mock(this.lc().m_items.list.getItem(0).exsubs.changeBtn, 'setId' );
		this.mm.mock(this.lc().m_items.list.getItem(0).exsubs.changeBtn, 'setCaller' );
		this.mm.mock(this.lc().m_items.list.getItem(1).exsubs.changeBtn, 'setId' );
		this.mm.mock(this.lc().m_items.list.getItem(1).exsubs.changeBtn, 'setCaller' );
		this.lc()._setHerosListCallers();
		assertEQ ( this.mm.walkLog, 'setId,setCaller,setId,setCaller' );
		assertEQ ( this.mm.params['setId.0'], [0] );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.dlg, caller:this.lc()._onClickChangeBtn}] );
		assertEQ ( this.mm.params['setId.1'], [1] );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.dlg, caller:this.lc()._onClickChangeBtn}] );
	};
	
	this.test__updateExpendDesc = function(){
		this.lc()._initDlg();
		this.lc().m_flag = 'steel';
		this.lc()._createSteelOpHdr();
		this.mm.mock(this.lc(), '_getInputSteelQuarters', [2] );
		this.mm.mock(this.lc().m_steelOpHdr, 'getExpendDesc', ['desc'] );
		this.lc()._updateExpendDesc();
		assertEQ ( TQ.getTextEx(this.lc().m_items.needDesc), 'desc' );
		assertEQ ( this.mm.params['getExpendDesc'], [2] );
	};
	
	this.test__onHeroUpdate = function(){
		this.mm.mock(this.lc(), '_update' );
		this.lc()._onHeroUpdate();
		assertEQ ( this.mm.walkLog, '_update' );
	};
	
	this.test__getHoursLimit = function(){
		this.lc()._initDlg();
		this.lc().m_flag = 'steel';
		this.lc()._createSteelOpHdr();
		assertEQ ( this.lc()._getHoursLimit(), {min:1, max:res_comm_herosteel_max_hours});
	};
	
	this.test__onClickChangeBtn = function(){
		this.lc()._initDlg();
		this.lc().m_flag = 'highsteel';
		this.lc().m_heros = [];
		this.lc()._createSteelOpHdr();
		
		this.mm.mock(UIM.getDlg('selectsteeltype'), 'setCaller' );
		this.mm.mock(UIM.getDlg('selectsteeltype'), 'openDlg' );
		this.mm.mock(this.lc().m_steelOpHdr, 'getSteelEfficiencyType', [1] );
		
		var p_idx = 0;
		var p_efficiencyType = 1;
		this.lc()._onClickChangeBtn(p_idx, p_efficiencyType);
		assertEQ ( this.mm.walkLog, 'setCaller,getSteelEfficiencyType,openDlg' );
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onSelectSteelType}] );
		assertEQ ( this.mm.params['getSteelEfficiencyType'], [p_idx] );
		assertEQ ( this.mm.params['openDlg'], [p_idx, 1, 'highsteel' ] );
	};
	
	this.test__onSelectSteelType = function(){
		this.lc()._initDlg();
		this.lc().m_flag = 'highsteel';
		this.lc().m_heros = [];
		this.lc()._createSteelOpHdr();
		
		this.mm.mock(this.lc().m_steelOpHdr, 'setSteelEfficiencyType' );
		this.mm.mock(this.lc(), '_update' );
		
		var p_idx = 0;
		var p_efficiencyType = 'speed';
		this.lc()._onSelectSteelType(p_idx, p_efficiencyType);
		assertEQ ( this.mm.walkLog, 'setSteelEfficiencyType,_update' );
		assertEQ ( this.mm.params['setSteelEfficiencyType'], [p_idx, p_efficiencyType] );
	};
	
	this.test__onHoursChange = function(){
		this.mm.mock(this.lc(), '_update' );
		this.lc()._onHoursChange();
		assertEQ ( this.mm.walkLog, '_update' );
	};
	
	this.test__onClickSteel = function(){
		this.lc()._initDlg();
		this.lc().m_flag = 'highsteel';
		this.lc().m_heros = [];
		this.lc()._createSteelOpHdr();
		
		var r_isEnoughExpend = [false];
		this.mm.mock(this.lc(), '_getInputSteelQuarters', [10] );
		this.mm.mock(this.lc().m_steelOpHdr, 'isEnoughExpend', r_isEnoughExpend);
		this.mm.mock(this.lc().m_steelOpHdr, 'getNotEnoughExpendMsg', ['notEnoughMsg']);
		this.mm.mock(this.g.getGUI(), 'msgBox');
		this.mm.mock(this.lc().m_steelOpHdr, 'sendSteelMsg');
		this.mm.mock(this.lc().m_dlg, 'hide');
		
		this.lc()._onClickSteel();
		assertEQ ( this.mm.walkLog, '_getInputSteelQuarters,isEnoughExpend,getNotEnoughExpendMsg,msgBox' );
		assertEQ ( this.mm.params['isEnoughExpend'], [10] );
		assertEQ ( this.mm.params['getNotEnoughExpendMsg'], [10] );
		assertEQ ( this.mm.params['msgBox'], [rstr.comm.msgts, 'notEnoughMsg', MB_F_CLOSE, null] );
		
		this.mm.clear();
		r_isEnoughExpend[0] = true;
		this.lc()._onClickSteel();
		assertEQ ( this.mm.walkLog, '_getInputSteelQuarters,isEnoughExpend,sendSteelMsg,hide' );
		assertEQ ( this.mm.params['sendSteelMsg'], [10] );
	};
	
	this.test__getInputSteelQuarters = function(){
		this.lc()._initDlg();
		this.lc().m_flag = 'highsteel';
		this.lc().m_heros = [];
		this.lc()._createSteelOpHdr();
		
		this.lc().m_items.ihour.setVal(1);
		assertEQ ( this.lc()._getInputSteelQuarters(), 4 );
	};
});

tqSteelHeroDlg_t_main = function(suite) {
	suite.addTestCase(TestBaseHeroSteelOpHdr, 'TestBaseHeroSteelOpHdr');
	suite.addTestCase(TestCommHeroSteelOpHdr, 'TestCommHeroSteelOpHdr');
	suite.addTestCase(TestHighHeroSteelOpHdr, 'TestHighHeroSteelOpHdr');
	suite.addTestCase(TestCaseVip1HeroSteelOpHdr, 'TestCaseVip1HeroSteelOpHdr');
	suite.addTestCase(TestCaseVip2HeroSteelOpHdr, 'TestCaseVip2HeroSteelOpHdr');
	suite.addTestCase(TestCaseSteelHeroDlg, 'TestCaseSteelHeroDlg');
};
