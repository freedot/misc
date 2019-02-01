//require('./tqExpeditionDlg.js');
requireEx('./handler/tqExpeditionDlg.js', [
	{
		start:'//ExpedLineupInfoHdr-unittest-start'
		,end:'//ExpedLineupInfoHdr-unittest-end'
		,items:['m_this'
			,'m_items'
			,'m_myFightCapRefresher'
			,'m_forceTabHdr'
			,'_onUpdateHero'
			,'_setBtnsState'
		]
	}
	,{
		start:'//ExpedMyFightCapRefresher-unittest-start'
		,end:'//ExpedMyFightCapRefresher-unittest-end'
		,items:['m_g'
			,'m_items'
			,'m_this'
			,'m_targetChecker'
			,'m_target'
			,'m_lineupId'
			,'m_heroIds'
			,'m_expedType'
			,'_getFirstHeroSingleFightCap'
			,'_getFirstHeroFightCap'
			,'_getHerosFightCap'
			,'_getFirstValidHero'
			,'_isValidLineUp'
		]
	}
	,{
		start:'//ExpedForceTabHdr-unittest-start'
		,end:'//ExpedForceTabHdr-unittest-end'
		,items:['m_g'
			,'m_items'
			,'m_this'
			,'m_targetChecker'
			,'m_target'
			,'m_expedType'
			,'m_lineupId'
			,'m_heroIds'
			,'_updateLineupName'
			,'_updateForceTabList'
			,'_getCanExpedHeros'
			,'_getExpedHerosInLineup'
			,'_showFirstHeroInLineupGrid'
			,'_showHeroInMidGrid'
			,'_showEmptyMidGrid'
			,'_showHerosInLineupGrids'
			,'_disableAllGrids'
			,'_collectValidHeroIds'
			,'_getFirstValidHeroGrid'
			,'_enableGrid'
			,'_showHeroInGrid'
			,'_enableEmptyGrid'
			,'_disableGrid'
			,'_hideGridDetailLabels'
			,'_showGridDetailLbls'
			,'_showOrHideGridDetailLabels'
		]
	}
	,{
		start:'//ExpedTargetChecker-unittest-start'
		,end:'//ExpedTargetChecker-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_target'
			,'_isPlayerTarget'
			,'_isFieldTarget'
		]
	}
]);
require('./tqAssignHerosDlg.js');
require('./tqSelectExpedTargetDlg.js');
require('./tqAssignSoldiersDlg.js');
	
TestCaseSameAlliPlayerTargetHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.hdr = SameAlliPlayerTargetHdr.snew(this.g, {needtime:MockDomEx.snew()});
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_updateMoveNeedTime = function(){
		this.hdr.setTarget({name:'target', pos:{x:100,y:100}});
		this.hdr.updateMoveNeedTime(res_army_movespeed);
		var timeSecond = ExpedTargetUtil.getMoveNeedTime(this.g, {x:100,y:100}, res_army_movespeed);
		assertEQ ( TQ.getTextEx(this.hdr.items.needtime), TQ.formatTime(0, timeSecond) );
		
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.ALLIINBUILD, level:10}] });
		this.mm.clear();
		this.hdr.updateMoveNeedTime(res_army_movespeed);
		assertEQ ( this.mm.walkLog, '' );
		var speed = res_army_movespeed + 10*0.1*res_army_movespeed;
		var timeSecond = ExpedTargetUtil.getMoveNeedTime(this.g, {x:100,y:100}, speed);
		assertEQ ( TQ.getTextEx(this.hdr.items.needtime), TQ.formatTime(0, timeSecond) );
		
		this.hdr.setTarget({name:'target', pos:{x:100,y:100}});
	};
});

TestCaseExpedTargetSpec = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_isSatisfiedBy = function(){
		var r_makeExpedTarget = [{id:1}];
		this.mm.mock(ExpedUtil, 'makeExpedTarget', r_makeExpedTarget);
		var field = {id:1,name:'xxx'};
		assertEQ ( ExpedTargetSpec.snew().isSatisfiedBy(field), true );
		assertEQ ( this.mm.params['makeExpedTarget'], [field] );
		
		r_makeExpedTarget[0] = null;
		assertEQ ( ExpedTargetSpec.snew().isSatisfiedBy(field), false );
	};
	
	this.test_getInvalidTip = function(){
		assertEQ ( ExpedTargetSpec.snew().getInvalidTip(),  rstr.selectexpedtarget.err.noSelTarget);
	};
});

TestCaseBaseExpedition = TestCase.extern(function(){
	this.isDisableForceTabListItem = function(idx){
		var ftlItem = this.dlg.getCtrl('forcetablist').getItem(idx);
		return ( ( TQ.getCSS(ftlItem.exsubs.icon, 'display') == 'none' )
			&& ( TQ.getCSS(ftlItem.exsubs.level, 'display') == 'none' )
			&& ( TQ.getCSS(ftlItem.exsubs.name, 'display') == 'none' )
			&& ( TQ.getCSS(ftlItem.exsubs.health, 'display') == 'none' )
			&& ( TQ.getCSS(ftlItem.exsubs.soldiername, 'display') == 'none' )
			&& ( TQ.getCSS(ftlItem.exsubs.soldiernum, 'display') == 'none' )
			&& ( TQ.getCSS(ftlItem.exsubs.stateflag, 'display') == 'none' )
			&& ( isInclude ( IMG.getBKImage(ftlItem.exsubs.icon.parentNode), 'disablebak.gif') ) );	
	};
	
	this.isEnableEmptyForceTabListItem = function(idx){
		var ftlItem = this.dlg.getCtrl('forcetablist').getItem(idx);
		return ( ( TQ.getCSS(ftlItem.exsubs.icon, 'display') == 'none' )
			&& ( TQ.getCSS(ftlItem.exsubs.level, 'display') == 'none' )
			&& ( TQ.getCSS(ftlItem.exsubs.name, 'display') == 'none' )
			&& ( TQ.getCSS(ftlItem.exsubs.health, 'display') == 'none' )
			&& ( TQ.getCSS(ftlItem.exsubs.soldiername, 'display') == 'none' )
			&& ( TQ.getCSS(ftlItem.exsubs.soldiernum, 'display') == 'none' )
			&& ( TQ.getCSS(ftlItem.exsubs.stateflag, 'display') == 'none' )
			&& ( isInclude ( IMG.getBKImage(ftlItem.exsubs.icon.parentNode), 'emptybak.gif') ) );	
	};
	
	this.isEnableForceTabListItem = function(idx){
		var ftlItem = this.dlg.getCtrl('forcetablist').getItem(idx);
		return ( ( TQ.getCSS(ftlItem.exsubs.icon, 'display') == 'block' )
			&& ( TQ.getCSS(ftlItem.exsubs.level, 'display') == 'block' )
			&& ( TQ.getCSS(ftlItem.exsubs.name, 'display') == 'block' )
			&& ( TQ.getCSS(ftlItem.exsubs.health, 'display') == 'block' )
			&& ( TQ.getCSS(ftlItem.exsubs.soldiername, 'display') == 'block' )
			&& ( TQ.getCSS(ftlItem.exsubs.soldiernum, 'display') == 'block' )
			&& ( TQ.getCSS(ftlItem.exsubs.stateflag, 'display') == 'block' )
			&& ( isInclude ( IMG.getBKImage(ftlItem.exsubs.icon.parentNode), 'emptybak.gif') ) );	
	};
	
	this.isDisableForceTabList = function(){
		for ( var i=0; i<9; ++i ) {
			var ftlItem = this.dlg.getCtrl('forcetablist').getItem(i);
			if ( this.isDisableForceTabListItem(i) == false ) return false;
		}
		return true;
	};
	
	this.getForceTabItemIcon = function(idx){
		var ftlItem = this.dlg.getCtrl('forcetablist').getItem(idx);
		return IMG.getBKImage(ftlItem.exsubs.icon);
	};
	
	this.getForceTabItemName = function(idx){
		var ftlItem = this.dlg.getCtrl('forcetablist').getItem(idx);
		return TQ.getTextEx(ftlItem.exsubs.name);
	};
	
	this.getForceTabItemLevel = function(idx){
		var ftlItem = this.dlg.getCtrl('forcetablist').getItem(idx);
		return TQ.getTextEx(ftlItem.exsubs.level);
	};
	
	this.getForceTabItemHealth = function(idx){
		var ftlItem = this.dlg.getCtrl('forcetablist').getItem(idx);
		return TQ.getTextEx(ftlItem.exsubs.health);
	};
	
	this.getForceTabItemSoldierName = function(idx){
		var ftlItem = this.dlg.getCtrl('forcetablist').getItem(idx);
		return TQ.getTextEx(ftlItem.exsubs.soldiername);
	};
	
	this.getForceTabItemSoldierNum = function(idx){
		var ftlItem = this.dlg.getCtrl('forcetablist').getItem(idx);
		return TQ.getTextEx(ftlItem.exsubs.soldiernum);
	};
	
	this.getForceTabItemHeroBusyFlagImg = function(idx){
		var ftlItem = this.dlg.getCtrl('forcetablist').getItem(idx);
		return IMG.getBKImage(ftlItem.exsubs.stateflag);
	};
});

TestCaseOhterFieldTargetHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getDantiaoDropDesc = function(){
		var hdr = OhterFieldTargetHdr.snew(this.g, {});
		
		var target = {id:1, resid:170001, level:1, roleId:10000};
		hdr.setTarget(target);
		assertEQ ( hdr.getDantiaoDropDesc(), rstr.expeddlg.lbl.winOver + rstr.expeddlg.lbl.getOtherPlayerRes );
		
		var target = {id:1, resid:170001, level:1, roleId:0};
		hdr.setTarget(target);
		var dropId = ItemResUtil.findFieldLevelres(170001, 1).dantiaodrop;
		assertEQ ( hdr.getDantiaoDropDesc(), rstr.expeddlg.lbl.winOver + DropItemUtil.getDesc(dropId) );
	};
});

TestCaseExpeditionDlg = TestCaseBaseExpedition.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = ExpeditionDlg.snew(g_app);
		UIM.regDlg('assignheros', AssignHerosDlg.snew(g_app));
		UIM.regDlg('selectexpedtarget', SelectExpedTargetDlg.snew(g_app));
		UIM.regDlg('assignsoldiers', AssignSoldiersDlg.snew(g_app));
		MilitaryHandler.snew(g_app);
		this.g.getImgr().getSelfFields().list.push({id:1});
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.testFirstOpenDlg = function(){
		this.dlg.openDlg();
		assert( this.dlg.isShow() == true );
		assert( TQ.getTextEx(this.dlg.getCtrl('target')) === '' );
		assert( TQ.getTextEx(this.dlg.getCtrl('coordinate')) === 'x:0, y:0' );
		assert( TQ.getTextEx(this.dlg.getCtrl('needtime')) === '00:00:00' );
		assert ( this.dlg.getCtrl('selecttype').getRadio(0).isShow() == false);
		assert ( this.dlg.getCtrl('selecttype').getRadio(1).isShow() == false);
		assert ( this.dlg.getCtrl('selecttype').getRadio(2).isShow() == false);
		assert ( this.dlg.getCtrl('selecttype').getRadio(3).isShow() == false);
		
		assert ( TQ.getTextEx(this.dlg.getCtrl('typedesc')) === '' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('myfightcap')) === 0 );
		assert ( TQ.getTextEx(this.dlg.getCtrl('enemyfightcap')) === '' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('evaluate')) === '' );
		
		assert ( this.isDisableForceTabList() == true );
	};
	
	this.test_setImgHelp_firstOpenDlg = function(){
		this.dlg.openDlg();
		assertEQ ( TQ.getTextEx(this.dlg.getCtrl('imghelp')), HyperLinkMgr.formatLink(rstr.military.expeddlg.tip.imghelp) );
	};

	this.testTodayBattleInfoShow = function(){
		this.dlg.openDlg();
		assertNoInclude ( TQ.getTextEx(this.dlg.getCtrl('todaybattleinfo')), 'undefined' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('todaybattleinfo')) == TQ.format(rstr.expeddlg.lbl.todaybattleinfo, 0, 0, 0, 0) );
		
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:{todaytimes:{taofa:1, cuihui:2,tiaoxin:3,fightowner:4}}});
		assert ( TQ.getTextEx(this.dlg.getCtrl('todaybattleinfo')) == TQ.format(rstr.expeddlg.lbl.todaybattleinfo, 1, 2, 3, 4) );
	};
	
	this.test_loadSaveForceWhenOpenDlg = function(){
		TQ.dictCopy(this.g.getImgr().getSaveForces(), [{_k:'type'},{type:FORCELINE_TYPE.COMM, lineup:180001, heros:[1,2]}] );
		this.dlg.openDlg();
		assert ( this.isDisableForceTabList() == false );
	};
	
	this.testOpenDlgWithSameAlliPlayerTarget = function(){
		TestCaseCondition.setPreCond(this.hero, {rolepos:{x:0,y:0}});
		this.g.getImgr().getRoleRes().alliance.uid = 1;
		var alliplayer = {type:OBJ_TYPE.ROLE,name:'xxx', pos:{x:100,y:200}, alliance:{uid:1}};
		this.dlg.openDlg(alliplayer);
		
		assert( TQ.getTextEx(this.dlg.getCtrl('target')) === 'xxx' );
		assert( TQ.getTextEx(this.dlg.getCtrl('coordinate')) === 'x:100, y:200' );
		var timeS = parseInt(Math.sqrt(100*100+200*200)/res_army_movespeed*3600+res_army_preparetime, 10);
		assert( TQ.getTextEx(this.dlg.getCtrl('needtime')) === TQ.formatTime(0, timeS) );
		
		assert ( TQ.getTextEx(this.dlg.getCtrl('enemyfightcap')) === '' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('evaluate')) === '' );
		
		assert ( this.isDisableForceTabList() == true );
		
		assert ( this.dlg.getCtrl('selecttype').getRadio(0).isShow() == true);
		assert ( this.dlg.getCtrl('selecttype').getRadio(0).getText() == rstr.expeddlg.btn.types[4]);
		assert ( this.dlg.getCtrl('selecttype').getRadio(1).isShow() == false);
		assert ( this.dlg.getCtrl('selecttype').getRadio(2).isShow() == false);
		assert ( this.dlg.getCtrl('selecttype').getRadio(3).isShow() == false);
		
		assert ( this.dlg.getCtrl('selecttype').getRadio(0).getCheck() == 1);
	};
	
	this.testOpenDlgWithSelfFieldTarget = function(){
		TestCaseCondition.setPreCond(this.hero, {rolepos:{x:0,y:0}});
		var selffield = {id:1,type:OBJ_TYPE.FIELD,name:'xxx', pos:{x:100,y:200}};
		this.dlg.openDlg(selffield);
		
		assert( TQ.getTextEx(this.dlg.getCtrl('target')) === 'xxx' );
		assert( TQ.getTextEx(this.dlg.getCtrl('coordinate')) === 'x:100, y:200' );
		var speed = res_army_movespeed * 10;
		var timeS = parseInt(Math.sqrt(100*100+200*200)/speed*3600+res_army_preparetime*res_army_movespeed/speed, 10);
		assert( TQ.getTextEx(this.dlg.getCtrl('needtime')) === TQ.formatTime(0, timeS) );
		
		assert ( TQ.getTextEx(this.dlg.getCtrl('enemyfightcap')) === '' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('evaluate')) === '' );
		
		assert ( this.isEnableEmptyForceTabListItem(4) == true );
		
		assert ( this.dlg.getCtrl('selecttype').getRadio(0).isShow() == true);
		assert ( this.dlg.getCtrl('selecttype').getRadio(0).getText() == rstr.expeddlg.btn.types[4]);
		assert ( this.dlg.getCtrl('selecttype').getRadio(1).isShow() == false);
		assert ( this.dlg.getCtrl('selecttype').getRadio(2).isShow() == false);
		assert ( this.dlg.getCtrl('selecttype').getRadio(3).isShow() == false);
		
		assert ( this.dlg.getCtrl('selecttype').getRadio(0).getCheck() == 1);
	};
	
	this.testOpenDlgWithOtherPlayerTarget = function(){
		TestCaseCondition.setPreCond(this.hero, {rolepos:{x:338,y:160}});
		var otherplayer = {type:OBJ_TYPE.ROLE,name:'xxx', pos:{x:313,y:257}};
		this.dlg.openDlg(otherplayer);
		
		assert( TQ.getTextEx(this.dlg.getCtrl('target')) === 'xxx' );
		assert( TQ.getTextEx(this.dlg.getCtrl('coordinate')) === 'x:313, y:257' );
		var timeS = parseInt(Math.sqrt((338-313)*(338-313)+(257-160)*(257-160))/res_army_movespeed*3600+res_army_preparetime, 10);
		assert( TQ.getTextEx(this.dlg.getCtrl('needtime')) === TQ.formatTime(0, timeS) );
		
		assert ( TQ.getTextEx(this.dlg.getCtrl('enemyfightcap')) === '' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('evaluate')) === '' );
		
		assert ( this.isDisableForceTabList() == true );
		
		assert ( this.dlg.getCtrl('selecttype').getRadio(0).isShow() == true);
		assert ( this.dlg.getCtrl('selecttype').getRadio(0).getText() == rstr.expeddlg.btn.types[0]);
		assert ( this.dlg.getCtrl('selecttype').getRadio(1).isShow() == true);
		assert ( this.dlg.getCtrl('selecttype').getRadio(1).getText() == rstr.expeddlg.btn.types[2]);
		assert ( this.dlg.getCtrl('selecttype').getRadio(2).isShow() == true);
		assert ( this.dlg.getCtrl('selecttype').getRadio(2).getText() == rstr.expeddlg.btn.types[3]);
		assert ( this.dlg.getCtrl('selecttype').getRadio(3).isShow() == false);
		
		assert ( this.dlg.getCtrl('selecttype').getRadio(0).getCheck() == 1);
	};
	
	this.testOpenDlgWithOtherPlayerTarget_countryFight = function(){
		TestCaseCondition.setPreCond(this.hero, {rolepos:{x:341,y:268}});
		var otherplayer = {type:OBJ_TYPE.ROLE,name:'xxx', pos:{x:134,y:40}};
		this.dlg.openDlg(otherplayer);
		
		assert( TQ.getTextEx(this.dlg.getCtrl('target')) === 'xxx' );
		assert( TQ.getTextEx(this.dlg.getCtrl('coordinate')) === 'x:134, y:40' );
		assert( TQ.getTextEx(this.dlg.getCtrl('needtime')) === TQ.formatTime(0, res_countryfight_needtime) );
		
		assert ( TQ.getTextEx(this.dlg.getCtrl('enemyfightcap')) === '' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('evaluate')) === '' );
		
		assert ( this.isDisableForceTabList() == true );
		
		assert ( this.dlg.getCtrl('selecttype').getRadio(0).isShow() == true);
		assert ( this.dlg.getCtrl('selecttype').getRadio(0).getText() == rstr.expeddlg.btn.types[0]);
		assert ( this.dlg.getCtrl('selecttype').getRadio(1).isShow() == true);
		assert ( this.dlg.getCtrl('selecttype').getRadio(1).getText() == rstr.expeddlg.btn.types[2]);
		assert ( this.dlg.getCtrl('selecttype').getRadio(2).isShow() == true);
		assert ( this.dlg.getCtrl('selecttype').getRadio(2).getText() == rstr.expeddlg.btn.types[3]);
		assert ( this.dlg.getCtrl('selecttype').getRadio(3).isShow() == false);
		
		assert ( this.dlg.getCtrl('selecttype').getRadio(0).getCheck() == 1);
	};
	
	this.testOpenDlgWithOtherFieldTarget = function(){
		TestCaseCondition.setPreCond(this.hero, {rolepos:{x:0,y:0}});
		var otherfield = {id:2,resid:170001,type:OBJ_TYPE.FIELD,name:'xxx', level:1, pos:{x:100,y:200},sfightcap:100,fightcap:1000};
		this.dlg.openDlg(otherfield);
		
		assert( TQ.getTextEx(this.dlg.getCtrl('target')) === 'xxx' );
		assert( TQ.getTextEx(this.dlg.getCtrl('coordinate')) === 'x:100, y:200' );
		var timeS = parseInt(Math.sqrt(100*100+200*200)/res_army_movespeed*3600+res_army_preparetime, 10);
		assert( TQ.getTextEx(this.dlg.getCtrl('needtime')) === TQ.formatTime(0, timeS) );
		
		assert ( TQ.getTextEx(this.dlg.getCtrl('enemyfightcap')) == '100' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('evaluate')) === '' );
		
		assert ( this.isEnableEmptyForceTabListItem(4) == true );
		
		assert ( this.dlg.getCtrl('selecttype').getRadio(0).isShow() == true);
		assert ( this.dlg.getCtrl('selecttype').getRadio(0).getText() == rstr.expeddlg.btn.types[1]);
		assert ( this.dlg.getCtrl('selecttype').getRadio(1).isShow() == true);
		assert ( this.dlg.getCtrl('selecttype').getRadio(1).getText() == rstr.expeddlg.btn.types[5]);
		assert ( this.dlg.getCtrl('selecttype').getRadio(2).isShow() == false);
		assert ( this.dlg.getCtrl('selecttype').getRadio(3).isShow() == false);
		
		assert ( this.dlg.getCtrl('selecttype').getRadio(0).getCheck() == 1);
	};
	
	this.testOpenDlgWithCopyFieldTarget = function(){
		TestCaseCondition.setPreCond(this.hero, {rolepos:{x:0,y:0}});
		var copyfield = {id:1,resid:171001,type:OBJ_TYPE.COPYFIELD,name:'xxx', level:1, pos:{x:0,y:0},needtime:10,fightcap:1000};
		this.dlg.openDlg(copyfield);
		
		assert( TQ.getTextEx(this.dlg.getCtrl('target')) === 'xxx.'+TQ.format(rstr.comm.flevel, 1) );
		assert( TQ.getTextEx(this.dlg.getCtrl('coordinate')) === 'x:0, y:0' );
		assert( TQ.getTextEx(this.dlg.getCtrl('needtime')) === '00:00:10' );
		
		assert ( TQ.getTextEx(this.dlg.getCtrl('enemyfightcap')) == '1000' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('evaluate')) === '' );
		
		assert ( this.isDisableForceTabList() == true );
		
		assert ( this.dlg.getCtrl('selecttype').getRadio(0).isShow() == true);
		assert ( this.dlg.getCtrl('selecttype').getRadio(0).getText() == rstr.expeddlg.btn.types[0]);
		assert ( this.dlg.getCtrl('selecttype').getRadio(1).isShow() == false);
		assert ( this.dlg.getCtrl('selecttype').getRadio(2).isShow() == false);
		assert ( this.dlg.getCtrl('selecttype').getRadio(3).isShow() == false);
		
		assert ( this.dlg.getCtrl('selecttype').getRadio(0).getCheck() == 1);
	};
	
	this.testSelectPaiqianTypeWhenSameAlliPlayerTarget = function(){
		this.g.getImgr().getRoleRes().alliance.uid = 1;
		var alliplayer = {type:OBJ_TYPE.ROLE,name:'xxx', pos:{x:100,y:200}, alliance:{uid:1}};
		this.dlg.openDlg(alliplayer);
		assert ( TQ.getTextEx(this.dlg.getCtrl('typedesc')) == rstr.expeddlg.lbl.paiqianplayertype );
		assert ( this.isDisableForceTabList() == true );
	};
	
	this.testSelectPaiqianTypeWhenSelfFieldTarget = function(){
		var selffield = {id:1,type:OBJ_TYPE.FIELD,name:'xxx', pos:{x:100,y:200}};
		this.dlg.openDlg(selffield);
		assert ( TQ.getTextEx(this.dlg.getCtrl('typedesc')) == rstr.expeddlg.lbl.paiqianfieldtype );
		assert ( this.isEnableEmptyForceTabListItem(4) == true );
	};
	
	this.testSelectTaofaTypeWhenOtherPlayerTarget = function(){
		TestCaseCondition.setPreCond(this.hero, {rolepos:{x:338,y:160}});
		var otherplayer = {type:OBJ_TYPE.ROLE,name:'xxx', pos:{x:313,y:257}};
		this.dlg.openDlg(otherplayer);
		assert ( TQ.getTextEx(this.dlg.getCtrl('typedesc')) == rstr.expeddlg.lbl.taofaplayertype );
		assert ( this.isDisableForceTabList() == true );
	};
	
	this.testSelectTaofaTypeWhenCopyFieldTarget = function(){
		var copyfield = {id:2,resid:171001,type:OBJ_TYPE.COPYFIELD,name:'xxx', level:1, pos:{x:100,y:200},fightcap:1000};
		this.dlg.openDlg(copyfield);
		assertNoInclude ( TQ.getTextEx(this.dlg.getCtrl('typedesc')), 'undefined' );
		assert ( this.isDisableForceTabList() == true );
	};
	
	this.testSelectCuihuiTypeWhenOtherPlayerTarget = function(){
		TestCaseCondition.setPreCond(this.hero, {rolepos:{x:338,y:160}});
		var otherplayer = {type:OBJ_TYPE.ROLE,name:'xxx', pos:{x:313,y:257}};
		this.dlg.openDlg(otherplayer);
		
		this.dlg.getCtrl('selecttype').select(1);
		assert ( TQ.getTextEx(this.dlg.getCtrl('typedesc')) == rstr.expeddlg.lbl.cuihuiplayertype );
		assert ( this.isDisableForceTabList() == true );
	};
	
	this.testSelectCuihuiTypeWhenOtherPlayerTarget_countryFight = function(){
		TestCaseCondition.setPreCond(this.hero, {rolepos:{x:341,y:268}});
		var otherplayer = {type:OBJ_TYPE.ROLE,name:'xxx', pos:{x:134,y:40}};
		this.dlg.openDlg(otherplayer);
		
		this.dlg.getCtrl('selecttype').select(1);
		assert ( TQ.getTextEx(this.dlg.getCtrl('typedesc')) == rstr.expeddlg.lbl.cuihuiplayertypeex );
		assert ( this.isDisableForceTabList() == true );
	};
	
	this.testSelectTaofaTypeWhenOtherPlayerTarget_countryFight = function(){
		TestCaseCondition.setPreCond(this.hero, {rolepos:{x:341,y:268}});
		var otherplayer = {type:OBJ_TYPE.ROLE,name:'xxx', pos:{x:134,y:40}};
		this.dlg.openDlg(otherplayer);
		assert ( TQ.getTextEx(this.dlg.getCtrl('typedesc')) == rstr.expeddlg.lbl.taofaplayertypeex );
		assert ( this.isDisableForceTabList() == true );
	};
	
	this.testSelectTiaoxinTypeWhenOtherPlayerTarget = function(){
		TestCaseCondition.setPreCond(this.hero, {rolepos:{x:338,y:160}});
		var otherplayer = {type:OBJ_TYPE.ROLE,name:'xxx', pos:{x:313,y:257}};
		this.dlg.openDlg(otherplayer);
		
		this.dlg.getCtrl('selecttype').select(2);
		assert ( TQ.getTextEx(this.dlg.getCtrl('typedesc')) == rstr.expeddlg.lbl.tiaoxinplayertype );
		assert ( this.isEnableEmptyForceTabListItem(4) == true );
		assert( TQ.getTextEx(this.dlg.getCtrl('needtime')) === '00:05:00' );
		
		this.dlg.getCtrl('selecttype').select(1);
		assert( TQ.getTextEx(this.dlg.getCtrl('needtime')) !== '00:05:00' );
	};
	
	this.testSelectTiaoxinTypeWhenOtherPlayerTarget_countryFight = function(){
		TestCaseCondition.setPreCond(this.hero, {rolepos:{x:341,y:268}});
		var otherplayer = {type:OBJ_TYPE.ROLE,name:'xxx', pos:{x:134,y:40}};
		this.dlg.openDlg(otherplayer);
		
		this.dlg.getCtrl('selecttype').select(2);
		assert ( TQ.getTextEx(this.dlg.getCtrl('typedesc')) == rstr.expeddlg.lbl.tiaoxinplayertypeex );
		assert ( this.isEnableEmptyForceTabListItem(4) == true );
		assert( TQ.getTextEx(this.dlg.getCtrl('needtime')) === '00:15:00' );
	};
	
	this.testSelectDantiaoTypeWhenOtherFieldTarget = function(){
		var otherfield = {id:2,resid:170001,type:OBJ_TYPE.FIELD,name:'xxx', level:1, pos:{x:100,y:200},fightcap:1000,sfightcap:500};
		this.dlg.openDlg(otherfield);
		
		this.dlg.getCtrl('selecttype').select(0);
		assertNoInclude ( TQ.getTextEx(this.dlg.getCtrl('typedesc')), 'undefined');
		assert ( this.isEnableEmptyForceTabListItem(4) == true );
		assert ( TQ.getTextEx(this.dlg.getCtrl('enemyfightcap')) == '500' );
	};
	
	this.testSelectZhanlingTypeWhenOtherFieldTarget = function(){
		var otherfield = {id:2,resid:170001,type:OBJ_TYPE.FIELD,name:'xxx', level:1, pos:{x:100,y:200},fightcap:1000};
		this.dlg.openDlg(otherfield);
		
		this.dlg.getCtrl('selecttype').select(1);
		assert ( TQ.getTextEx(this.dlg.getCtrl('typedesc')) == rstr.expeddlg.lbl.zhanlingfieldtype );
		assert ( this.isEnableEmptyForceTabListItem(4) == true );
	};

	this.testClickChangeForceTabBtn = function(){
		this.dlg.openDlg();
		this.dlg.getCtrl('changeforcetab').click();
		assert ( TestCaseSysTip.getSystip() == rstr.expeddlg.err.noTarget );
		
		var copyfield = {id:1,resid:171001,type:OBJ_TYPE.COPYFIELD,name:'xxx', level:1, pos:{x:0,y:0},needtime:10,fightcap:1000};
		this.dlg.setTarget(copyfield);
		this.dlg.getCtrl('selecttype').select(0);

		this.dlg.getCtrl('changeforcetab').click();
		assert ( UIM.getDlg('assignheros').isShow() == true );
	};
	
	this.testAssignHeroDlgCallback = function(){
		var copyfield = {id:1,resid:171001,type:OBJ_TYPE.COPYFIELD,name:'xxx', level:1, pos:{x:0,y:0},needtime:10,fightcap:1000};
		this.dlg.openDlg(copyfield);
		var caller = null;
		
		this.mm.mock(MilitarySender, 'sendSaveForceLineUp');

		UIM.getDlg('assignheros').setCaller = function(c){ caller = c; };
		this.dlg.getCtrl('changeforcetab').click();
		assert ( caller != null );
		caller.caller.call(caller.self, 0, []);
		assert ( this.isDisableForceTabList() == true );
		
		TestCaseCondition.setPreCond(null, { heros:[ 
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:2,icon:101,name:"name2",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:3,icon:101,name:"name3",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:4,icon:101,name:"name4",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:5,icon:101,name:"name5",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			] });
		caller.caller.call(caller.self, 180001, [1,2,3,4,5]);
		assert ( this.isDisableForceTabList() == false );
		assertEQ ( this.mm.params['sendSaveForceLineUp'], [this.g, FORCELINE_TYPE.COMM, 180001, [1,2,3,4,5]] );
		assertEQ ( this.g.getImgr().getSaveForces(), [{type:FORCELINE_TYPE.COMM,lineup:180001,heros:[1,2,3,4,5]},{type:2,lineup:0,heros:[]},{type:3,lineup:0,heros:[]}] );
	};
	
	this.testClickSelectTargetBtn = function(){
		this.dlg.openDlg();
		this.dlg.getCtrl('selecttarget').click();
		assert( UIM.getDlg('selectexpedtarget').isShow() == true );
	};
	
	this.testSelectExpedTargetDlgCallback = function(){
		this.dlg.openDlg();
		var caller = null;
		UIM.getDlg('selectexpedtarget').setCaller = function(c){ caller = c; };
		this.dlg.getCtrl('selecttarget').click();
		
		var copyfield = {id:171001, objType:OBJ_TYPE.COPYFIELD, level:1, name:'xxx', heros:[]};
		assert ( caller != null );
		caller.caller.call(caller.self, copyfield);
		assert( TQ.getTextEx(this.dlg.getCtrl('target')) === 'xxx.'+TQ.format(rstr.comm.flevel, 1) );
	};
	
	this.testSelectExpedTargetDlg = function(){
		this.dlg.openDlg();
		this.dlg.getCtrl('selecttarget').click();
		
		var targetDlg = UIM.getDlg('selectexpedtarget');
		assert ( targetDlg.isShow() == true );
		
		targetDlg.getCtrl('tablist').activeTab(0);
		var targetItems = targetDlg.getCtrl('tablist').getTabItems(0);
		targetItems.targetlist.setCurSel(0);
		targetDlg.click();
	};
	
	this.testClickAssignSoldierBtn = function(){
		this.dlg.openDlg();
		this.dlg.getCtrl('assignsoldier').click();
		assert( UIM.getDlg('assignsoldiers').isShow() == true );
	};
	
	this.testClickFillSoldierBtn = function(){
		TestCaseCondition.setPreCond(null, { heros:[ 
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0},ATTR.CO, {val:20,u:0}]) }
			] });
		g_app.getImgr().getSoldiers().push({id:150001001,number:1});
		var copyfield = {id:1,resid:171001,type:OBJ_TYPE.COPYFIELD,name:'xxx', level:1, pos:{x:0,y:0},needtime:10,fightcap:1000};
		this.dlg.openDlg(copyfield);
		
		assert( this.dlg.getCtrl('fillsoldier').isEnable() == false );
		
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:{defaultteams:[{id:1,lineup:180001,heros:[1,0,0,0,0]},{id:2,lineup:0,heros:[]},{id:3,lineup:0,heros:[]}]}});
		this.dlg.getCtrl('defaultteam').select(0);
		
		assert( this.dlg.getCtrl('fillsoldier').isEnable() == true );
		
		this.dlg.getCtrl('fillsoldier').click();
		assertNoInclude(g_app.getSendMsg(), 'undefined');
	};
	
	this.testClickTreatmentBtn = function(){
		TestCaseCondition.setPreCond(null, { heros:[ 
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC, {val:10,u:0}]) }
			,{id:2,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC, {val:10,u:0}]) }
			] });
		var copyfield = {id:1,resid:171001,type:OBJ_TYPE.COPYFIELD,name:'xxx', level:1, pos:{x:0,y:0},needtime:10,fightcap:1000};
		this.dlg.openDlg(copyfield);
		
		assert( this.dlg.getCtrl('treatment').isEnable() == false );
		
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:{defaultteams:[{id:1,lineup:180001,heros:[1,0,2,0,0]},{id:2,lineup:0,heros:[]},{id:3,lineup:0,heros:[]}]}});
		this.dlg.getCtrl('defaultteam').select(0);
		
		assert( this.dlg.getCtrl('treatment').isEnable() == true );
		
		this.dlg.getCtrl('treatment').click();
		assert ( TestCaseSysTip.getSystip() == rstr.herodlg.tips.fullhealth );
		
		TestCaseCondition.setPreCond(null, { heros:[ 
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:200,u:0}, ATTR.SFC, {val:10,u:0}]) }
			,{id:2,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:200,u:0}, ATTR.SFC, {val:10,u:0}]) }
			] });
		this.dlg.getCtrl('treatment').click();
		assert(g_app.getGUI().isShowMsgBox() == true);
		
		TestCaseCondition.setPreCond(null, { item:{id:FIXID.SALVE, num:1000000}, heros:[ 
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:200,u:0}, ATTR.SFC, {val:10,u:0}]) }
			,{id:2,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:200,u:0}, ATTR.SFC, {val:10,u:0}]) }
			] });
		this.dlg.getCtrl('treatment').click();
		assertNoInclude(g_app.getSendMsg(), 'undefined');
	};
	
	this.testSecondOpenDlg = function(){
		TestCaseCondition.setPreCond(null, { heros:[ 
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:2,icon:101,name:"name2",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:3,icon:101,name:"name3",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:4,icon:101,name:"name4",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:5,icon:101,name:"name5",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			] });
		var copyfield = {id:2,resid:170001,type:OBJ_TYPE.FIELD,name:'xxx', level:1, pos:{x:0,y:0},needtime:10,fightcap:1000};
		this.dlg.openDlg(copyfield);
		
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:{defaultteams:[{id:1,lineup:180001,heros:[1,2,3,4,5]},{id:2,lineup:180001,heros:[1,0,3,4,5]},{id:3,lineup:0,heros:[]}]}});
		this.dlg.getCtrl('defaultteam').select(0);
		
		this.dlg.getCtrl('selecttype').select(1);
		assert( this.dlg.getCtrl('defaultteam').getCurSelId() == 0 );
		assert( this.dlg.getCtrl('selecttype').getCurSelId() == 1 );
		assert( this.isDisableForceTabList() == false );
		assert( TQ.getTextEx(this.dlg.getCtrl('target')) === 'xxx' );
		
		this.dlg.closeDlg();
		this.dlg.openDlg();
		this.dlg.getCtrl('defaultteam').select(0);
		this.dlg.getCtrl('selecttype').select(1);
		assert( this.dlg.getCtrl('defaultteam').getCurSelId() == 0 );
		assert( this.dlg.getCtrl('selecttype').getCurSelId() == 1 );
		assert( this.isDisableForceTabList() == false );
		assert( TQ.getTextEx(this.dlg.getCtrl('target')) === 'xxx' );
	};
});

TestCaseExpedLineupInfoHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.items = { fillsoldier:new ComButton(this.g, MockDomEx.snew())
			,treatment:new ComButton(this.g, MockDomEx.snew()) 	};
		this.hdr = ExpedLineupInfoHdr.snew(this.g, this.items);
		this.lc = this.hdr.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(ExpedMyFightCapRefresher, 'snew', [{name:'refresher'}] );
		this.mm.mock(ExpedForceTabHdr, 'snew', [{name:'forceTab'}] );
		this.mm.mock(this.g, 'regEvent');
		
		this.hdr.init(this.g, this.items);
		assertEQ ( this.mm.walkLog, 'snew,snew,regEvent' );
		assertEQ ( this.mm.params['snew.0'], [this.g, this.items] );
		assertEQ ( this.mm.params['snew.1'], [this.g, this.items] );
		assertEQ ( this.mm.params['regEvent'], [EVT.HERO_UPDATE, 0, this.hdr, this.lc()._onUpdateHero] );
		assertEQ ( this.lc().m_this, this.hdr);
		assertEQ ( this.lc().m_items, this.items);
		assertEQ ( this.lc().m_myFightCapRefresher, {name:'refresher'});
		assertEQ ( this.lc().m_forceTabHdr, {name:'forceTab'});
	};
	
	this.test_setTarget = function(){
		this.mm.mock(this.lc().m_myFightCapRefresher, 'setTarget');
		this.mm.mock(this.lc().m_forceTabHdr, 'setTarget');
		
		var p_target = {};
		this.hdr.setTarget(p_target);
		assertEQ ( this.mm.walkLog, 'setTarget,setTarget' );
		assertEQ ( this.mm.params['setTarget.0'], [p_target] );
		assertEQ ( this.mm.params['setTarget.1'], [p_target] );
	};
	
	this.test_setExpedType = function(){
		this.mm.mock(this.lc().m_myFightCapRefresher, 'setExpedType');
		this.mm.mock(this.lc().m_forceTabHdr, 'setExpedType');
		
		var p_expedType = 1;
		this.hdr.setExpedType(p_expedType);
		assertEQ ( this.mm.walkLog, 'setExpedType,setExpedType' );
		assertEQ ( this.mm.params['setExpedType.0'], [p_expedType] );
		assertEQ ( this.mm.params['setExpedType.1'], [p_expedType] );
	};
	
	this.test_setLineup = function(){
		this.mm.mock(this.lc().m_myFightCapRefresher, 'setLineup');
		this.mm.mock(this.lc().m_forceTabHdr, 'setLineup');
		this.mm.mock(this.lc(), '_setBtnsState');
		
		var p_lineupId = 0;
		var p_heroIds = [1,2,3,4,5];
		this.hdr.setLineup(p_lineupId, p_heroIds);
		assertEQ ( this.mm.walkLog, 'setLineup,setLineup,_setBtnsState' );
		assertEQ ( this.mm.params['setLineup.0'], [p_lineupId, p_heroIds] );
		assertEQ ( this.mm.params['setLineup.1'], [p_lineupId, p_heroIds] );
	};
	
	this.test_refresh = function(){
		this.mm.mock(this.lc().m_myFightCapRefresher, 'refresh');
		this.mm.mock(this.lc().m_forceTabHdr, 'refresh');
		
		this.hdr.refresh();
		assertEQ ( this.mm.walkLog, 'refresh,refresh' );
	};
	
	this.test_getLineup = function(){
		this.mm.mock(this.lc().m_forceTabHdr, 'getLineup', [1] );
		assertEQ ( this.hdr.getLineup(), 1 );
	};
	
	this.test_getHeroIds = function(){
		this.mm.mock(this.lc().m_forceTabHdr, 'getHeroIds', [[1,2,3,4,5]] );
		assertEQ ( this.hdr.getHeroIds(), [1,2,3,4,5] );
	};
	
	this.test_getFreeHeros = function(){
		this.mm.mock(this.lc().m_forceTabHdr, 'getFreeHeros', [[{id:1},{id:2}]] );
		assertEQ ( this.hdr.getFreeHeros(), [{id:1},{id:2}] );
	};
	
	this.test_isNeedSingleHero = function(){
		this.mm.mock(this.lc().m_forceTabHdr, 'isNeedSingleHero', [true] );
		assertEQ ( this.hdr.isNeedSingleHero(), true );
	};
	
	this.test_getCanExpedHeros = function(){
		this.mm.mock(this.lc().m_forceTabHdr, 'getCanExpedHeros', [[1,2]] );
		assertEQ ( this.hdr.getCanExpedHeros(), [1,2] );
	};
	
	this.test_getExpedHerosInLineup = function(){
		this.mm.mock(this.lc().m_forceTabHdr, 'getExpedHerosInLineup', [[1,2]] );
		assertEQ ( this.hdr.getExpedHerosInLineup(), [1,2] );
	};
	
	this.test__setBtnsState = function(){
		var r_getFirstValidHero = [null];
		this.mm.mock(this.lc().m_myFightCapRefresher, 'getFirstValidHero', r_getFirstValidHero);
		this.lc()._setBtnsState();
		assertEQ ( this.items.fillsoldier.isEnable(), false );
		assertEQ ( this.items.treatment.isEnable(), false );
		
		r_getFirstValidHero[0] = {id:1};
		this.lc()._setBtnsState();
		assertEQ ( this.items.fillsoldier.isEnable(), true );
		assertEQ ( this.items.treatment.isEnable(), true );
	};
	
	this.test__onUpdateHero = function(){
		this.mm.mock(this.hdr, 'refresh');
		this.lc()._onUpdateHero();
		assertEQ ( this.mm.walkLog, 'refresh' );
	};
});

TestCaseExpedMyFightCapRefresher = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.items = {myfightcap:MockDom.snew('div')};
		this.refresher = ExpedMyFightCapRefresher.snew(this.g, this.items);
		this.lc = this.refresher.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.refresher );
		assertEQ ( this.lc().m_items, this.items );
		assertEQ ( this.lc().m_targetChecker instanceof ExpedTargetChecker, true );
	};
	
	this.test_setTarget = function(){
		var p_copyField = {name:'target1'};
		var r_copyField = {name:'target2'};
		this.mm.mock(ExpedTargetUtil, 'getValidTarget', [r_copyField] );
		this.mm.mock(this.lc().m_targetChecker, 'setTarget' );
		this.refresher.setTarget(p_copyField);
		assertEQ ( this.lc().m_target, r_copyField);
		assertEQ ( this.mm.params['getValidTarget'], [p_copyField] );
		assertEQ ( this.mm.params['setTarget'], [r_copyField] );
	};
	
	this.test_setExpedType = function(){
		this.refresher.setExpedType(1);
		assertEQ ( this.lc().m_expedType, 1 );
	};
	
	this.test_setLineup = function(){
		var p_lineupId = 1;
		var p_heroIds = [1,2,3,4,5];
		this.refresher.setLineup(p_lineupId, p_heroIds);
		assertEQ ( this.lc().m_lineupId, p_lineupId);
		assertEQ ( this.lc().m_heroIds, p_heroIds);
	};
	
	this.test_refresh = function(){
		var r_isSelfFieldTarget = [true];
		this.mm.mock(this.lc().m_targetChecker, 'isSelfFieldTarget', r_isSelfFieldTarget);
		this.mm.mock(this.lc(), '_getFirstHeroSingleFightCap', [1000]);
		this.mm.mock(this.lc(), '_getFirstHeroFightCap', [100]);
		this.mm.mock(this.lc(), '_getHerosFightCap', [10]);
		
		this.refresher.setExpedType(EXPED_TYPE.TIAOXIN);
		this.refresher.refresh();
		assertEQ ( TQ.getTextEx(this.lc().m_items.myfightcap), 1000);
		
		this.refresher.setExpedType(EXPED_TYPE.DANTIAO);
		this.refresher.refresh();
		assertEQ ( TQ.getTextEx(this.lc().m_items.myfightcap), 1000);
		
		this.refresher.setExpedType(EXPED_TYPE.PAIQIAN);
		this.refresher.refresh();
		assertEQ ( TQ.getTextEx(this.lc().m_items.myfightcap), 100);
		
		r_isSelfFieldTarget[0] = false;
		this.refresher.refresh();
		assertEQ ( TQ.getTextEx(this.lc().m_items.myfightcap), 10);
		
		this.refresher.setExpedType(EXPED_TYPE.TAOFA);
		this.refresher.refresh();
		assertEQ ( TQ.getTextEx(this.lc().m_items.myfightcap), 10);
		
		this.refresher.setExpedType(EXPED_TYPE.CUIHUI);
		this.refresher.refresh();
		assertEQ ( TQ.getTextEx(this.lc().m_items.myfightcap), 10);
		
		this.refresher.setExpedType(EXPED_TYPE.ZHANLING);
		this.refresher.refresh();
		assertEQ ( TQ.getTextEx(this.lc().m_items.myfightcap), 100);
	};
	
	this.test_getFirstValidHero = function(){
		this.mm.mock(this.lc(), '_getFirstValidHero', [{id:1}]);
		assertEQ ( this.refresher.getFirstValidHero(), {id:1} );
	};
	
	this.test__getFirstHeroFightCap = function(){
		var r_hero = [null];
		this.mm.mock(this.lc(), '_getFirstValidHero', r_hero);
		assertEQ ( this.lc()._getFirstHeroFightCap(), 0 );
		
		r_hero[0] = {attrs:{}}; r_hero[0].attrs[ATTR.FC] = {val:10};
		assertEQ ( this.lc()._getFirstHeroFightCap(), 10 );
	};
	
	this.test__getFirstHeroSingleFightCap = function(){
		var r_hero = [null];
		this.mm.mock(this.lc(), '_getFirstValidHero', r_hero);
		assertEQ ( this.lc()._getFirstHeroSingleFightCap(), 0 );
		
		r_hero[0] = {attrs:{}}; r_hero[0].attrs[ATTR.SFC] = {val:10};
		assertEQ ( this.lc()._getFirstHeroSingleFightCap(), 10 );
	};
	
	this.test__getHerosFightCap = function(){
		var r_isValidLineUp = [false];
		this.mm.mock(this.lc(), '_isValidLineUp', r_isValidLineUp);
		assertEQ ( this.lc()._getHerosFightCap(), 0 );
		
		this.g.getImgr().getHeros().list = [{id:1, attrs:{}},{id:2, attrs:{}}];
		this.g.getImgr().getHeros().list[0].attrs[ATTR.FC] = {val:10};
		this.g.getImgr().getHeros().list[1].attrs[ATTR.FC] = {val:20};
		
		r_isValidLineUp[0] = true;
		this.lc().m_heroIds = [0,1,0,2,0];
		assertEQ ( this.lc()._getHerosFightCap(), 30 );
	};
	
	this.test__isValidLineUp = function(){
		assertEQ ( this.lc()._isValidLineUp(), false );
		this.lc().m_lineupId = 180001;
		assertEQ ( this.lc()._isValidLineUp(), true );
	};
	
	this.test__getFirstValidHero = function(){
		this.g.getImgr().getHeros().list = [{id:1},{id:2}];
		this.lc().m_heroIds = [0,3,0,4,0];
		assertEQ ( this.lc()._getFirstValidHero(), null );
		
		this.lc().m_heroIds = [0,1,0,2,0];
		assertEQ ( this.lc()._getFirstValidHero(), {id:1} );
	};
});

TestCaseExpedForceTabHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		var dlg = ExpeditionDlg.snew(this.g);
		dlg.openDlg();
		this.items = dlg.getItems();
		this.hdr = ExpedForceTabHdr.snew(this.g, this.items);
		this.lc = this.hdr.lc;
		
		res_lineup=[{'id':180001,'name':'xxx','grids':[4,0,2,6,8],'bigpic':0,'smallpic':0,'desc':''}];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.hdr );
		assertEQ ( this.lc().m_items, this.items );
		assertEQ ( this.lc().m_targetChecker instanceof ExpedTargetChecker, true );
	};
	
	this.test_setTarget = function(){
		var p_copyField = {name:'target1'};
		var r_copyField = {name:'target2'};
		this.mm.mock(ExpedTargetUtil, 'getValidTarget', [r_copyField] );
		this.mm.mock(this.lc().m_targetChecker, 'setTarget' );
		this.hdr.setTarget(p_copyField);
		assertEQ ( this.lc().m_target, r_copyField);
		assertEQ ( this.mm.params['getValidTarget'], [p_copyField] );
		assertEQ ( this.mm.params['setTarget'], [r_copyField] );
	};
	
	this.test_setExpedType = function(){
		this.hdr.setExpedType(1);
		assertEQ ( this.lc().m_expedType, 1 );
	};
	
	this.test_setLineup = function(){
		var p_lineupId = 1;
		var p_heroIds = [1,2,3,4,5];
		this.hdr.setLineup(p_lineupId, p_heroIds);
		assertEQ ( this.lc().m_lineupId, p_lineupId);
		assertEQ ( this.lc().m_heroIds, p_heroIds);
	};
	
	this.test_getLineup = function(){
		var p_lineupId = 1;
		var p_heroIds = [1,2,3,4,5];
		this.hdr.setLineup(p_lineupId, p_heroIds);
		
		var r_isNeedSingleHero = [true];
		this.mm.mock(this.hdr, 'isNeedSingleHero', r_isNeedSingleHero );
		assertEQ ( this.hdr.getLineup(), FIXID.DEFAULTLINEUP );
		
		r_isNeedSingleHero[0] = false;
		assertEQ ( this.hdr.getLineup(), 1 );
	};
	
	this.test_getHeroIds = function(){
		var p_lineupId = 1;
		var p_heroIds = [1,2,3,4,5];
		this.hdr.setLineup(p_lineupId, p_heroIds);
		assertEQ ( this.hdr.getHeroIds(), [1,2,3,4,5] );
	};
	
	this.test_getFreeHeros = function(){
		TestCaseCondition.setPreCond(null, { heros:[{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}]) },
																	 {id:2,icon:102,name:"name2",level:2,state:1,soldier:{resid:150002002,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}])},
																	 {id:3,icon:103,name:"name3",level:3,state:0,soldier:{resid:0,number:0},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}])}
																	 ] } );
		var p_lineupId = 1;
		var p_heroIds = [1,2,3,0,0];
		this.hdr.setLineup(p_lineupId, p_heroIds);
		assertEQ ( this.hdr.getFreeHeros().length, 2 );
		assertEQ ( this.hdr.getFreeHeros()[0].id, 1 );
		assertEQ ( this.hdr.getFreeHeros()[1].id, 3 );
	};
	
	this.test_refresh = function(){
		this.mm.mock(this.lc(), '_updateLineupName');
		this.mm.mock(this.lc(), '_updateForceTabList');
		this.hdr.refresh();
		assertEQ ( this.mm.walkLog, '_updateLineupName,_updateForceTabList' );
	};
	
	this.test_isNeedSingleHero = function(){
		var r_isOtherFieldTarget = [true];
		var r_isSelfFieldTarget = [true];
		this.mm.mock ( this.lc().m_targetChecker, 'isOtherFieldTarget', r_isOtherFieldTarget);
		this.mm.mock ( this.lc().m_targetChecker, 'isSelfFieldTarget', r_isSelfFieldTarget);
		
		this.lc().m_expedType = EXPED_TYPE.TIAOXIN;
		assertEQ ( this.hdr.isNeedSingleHero(), true );
		
		this.lc().m_expedType = EXPED_TYPE.DANTIAO;
		assertEQ ( this.hdr.isNeedSingleHero(), true );
		
		this.lc().m_expedType = EXPED_TYPE.ZHANLING;
		assertEQ ( this.hdr.isNeedSingleHero(), true );
		
		this.lc().m_expedType = EXPED_TYPE.TAOFA;
		assertEQ ( this.hdr.isNeedSingleHero(), true );
		
		r_isOtherFieldTarget[0] = false;
		assertEQ ( this.hdr.isNeedSingleHero(), false );
		
		this.lc().m_expedType = EXPED_TYPE.PAIQIAN;
		assertEQ ( this.hdr.isNeedSingleHero(), true );
		
		r_isSelfFieldTarget[0] = false;
		assertEQ ( this.hdr.isNeedSingleHero(), false );
	};
	
	this.test_getCanExpedHeros = function(){
		this.mm.mock(this.lc(), '_getCanExpedHeros', [[1,2,3]] );
		assertEQ ( this.hdr.getCanExpedHeros(), [1,2,3] );
	};
	
	this.test_getExpedHerosInLineup = function(){
		this.mm.mock(this.lc(), '_getExpedHerosInLineup', [[1,2,3]] );
		assertEQ ( this.hdr.getExpedHerosInLineup(), [1,2,3] );
	};
	
	this.test__updateLineupName = function(){
		this.mm.mock( TQ, 'setCSS' );
		
		var p_lineupId = 180001;
		var p_heroIds = [];
		this.hdr.setLineup(p_lineupId, p_heroIds);
		
		this.lc()._updateLineupName();
		assertEQ ( this.mm.params['setCSS'], [this.lc().m_items.curlineup, 'display', 'block'] );
		assertEQ ( TQ.getTextEx(this.lc().m_items.curlineup_txt), 'xxx' );
		
		p_lineupId = 0;
		this.hdr.setLineup(p_lineupId, p_heroIds);
		this.lc()._updateLineupName();
		assertEQ ( this.mm.params['setCSS'], [this.lc().m_items.curlineup, 'display', 'none'] );
	};
	
	this.test__updateForceTabList = function(){
		var r_isNeedSingleHero = [true];
		this.mm.mock(this.hdr, 'isNeedSingleHero', r_isNeedSingleHero );
		this.mm.mock(this.lc(), '_showFirstHeroInLineupGrid' );
		this.mm.mock(this.lc(), '_showHeroInMidGrid' );
		this.mm.mock(this.lc(), '_showEmptyMidGrid' );
		this.mm.mock(this.lc(), '_showHerosInLineupGrids' );
		this.mm.mock(this.lc(), '_disableAllGrids' );
		
		var p_lineupId = 180001;
		var p_heroIds = [1,2];
		this.hdr.setLineup(p_lineupId, p_heroIds);
		this.lc()._updateForceTabList();
		assertEQ ( this.mm.walkLog, 'isNeedSingleHero,_showFirstHeroInLineupGrid' );
		
		this.mm.clear();
		p_heroIds = [1];
		this.hdr.setLineup(p_lineupId, p_heroIds);
		this.lc()._updateForceTabList();
		assertEQ ( this.mm.walkLog, 'isNeedSingleHero,_showHeroInMidGrid' );
		
		this.mm.clear();
		p_heroIds = [];
		this.hdr.setLineup(p_lineupId, p_heroIds);
		this.lc()._updateForceTabList();
		assertEQ ( this.mm.walkLog, 'isNeedSingleHero,_showEmptyMidGrid' );
		
		this.mm.clear();
		r_isNeedSingleHero[0] = false;
		p_heroIds = [1];
		this.hdr.setLineup(p_lineupId, p_heroIds);
		this.lc()._updateForceTabList();
		assertEQ ( this.mm.walkLog, 'isNeedSingleHero,_showHerosInLineupGrids' );
		
		this.mm.clear();
		r_isNeedSingleHero[0] = false;
		p_heroIds = [];
		this.hdr.setLineup(p_lineupId, p_heroIds);
		this.lc()._updateForceTabList();
		assertEQ ( this.mm.walkLog, 'isNeedSingleHero,_disableAllGrids' );
	};
	
	this.test__getCanExpedHeros = function(){
		var r_collectValidHeroIds = [[1,2,3]];
		var r_isNeedSingleHero = [true];
		this.mm.mock(this.lc(), '_collectValidHeroIds', r_collectValidHeroIds );
		this.mm.mock(this.hdr, 'isNeedSingleHero', r_isNeedSingleHero );
		
		assertEQ ( this.lc()._getCanExpedHeros(), [1] );
		
		r_collectValidHeroIds[0] = [];
		assertEQ ( this.lc()._getCanExpedHeros(), [] );
		
		r_isNeedSingleHero[0] = false;
		r_collectValidHeroIds[0] = [1,2,3];
		this.lc().m_heroIds = [0,1,2,3];
		assertEQ ( this.lc()._getCanExpedHeros(), [] );
		
		this.lc().m_heroIds = [0,1,2,3,0];
		assertEQ ( this.lc()._getCanExpedHeros(), [1,2,3] );
	};
	
	this.test__getExpedHerosInLineup = function(){
		var r_collectValidHeroIds = [[1,2,3]];
		var r_isNeedSingleHero = [true];
		this.mm.mock(this.lc(), '_collectValidHeroIds', r_collectValidHeroIds );
		this.mm.mock(this.hdr, 'isNeedSingleHero', r_isNeedSingleHero );
		
		assertEQ ( this.lc()._getExpedHerosInLineup(), [1] );
		
		r_collectValidHeroIds[0] = [];
		assertEQ ( this.lc()._getExpedHerosInLineup(), [] );
		
		r_isNeedSingleHero[0] = false;
		this.lc().m_heroIds = [0,1,2,3];
		assertEQ ( this.lc()._getExpedHerosInLineup(), [] );
		
		this.lc().m_heroIds = [0,1,2,3,0];
		assertEQ ( this.lc()._getExpedHerosInLineup(), [0,1,2,3,0] );
	};
	
	this.test__collectValidHeroIds = function(){
		this.lc().m_heroIds = [0,1,2,3,0];
		assertEQ ( this.lc()._collectValidHeroIds(), [1,2,3] );
	};
	
	this.test__showFirstHeroInLineupGrid = function(){
		var r_getFirstValidHeroGrid = [null];
		this.mm.mock( this.lc(), '_disableAllGrids' );
		this.mm.mock( this.lc(), '_getFirstValidHeroGrid', r_getFirstValidHeroGrid );
		this.mm.mock( this.lc(), '_enableGrid' );
		this.mm.mock( this.lc(), '_showHeroInGrid' );
		this.lc()._showFirstHeroInLineupGrid();
		assertEQ ( this.mm.walkLog, '_disableAllGrids,_getFirstValidHeroGrid' );
		
		this.mm.clear();
		r_getFirstValidHeroGrid[0] = {grid:1, hero:{id:2}};
		this.lc()._showFirstHeroInLineupGrid();
		assertEQ ( this.mm.walkLog, '_disableAllGrids,_getFirstValidHeroGrid,_enableGrid,_showHeroInGrid' );
		assertEQ ( this.mm.params['_enableGrid'], [1] );
		assertEQ ( this.mm.params['_showHeroInGrid'], [1, {id:2}] );
	};
	
	this.test__showHeroInMidGrid = function(){
		this.lc().m_heroIds = [1,2,3];
		this.g.getImgr().getHeros().list = [{id:1}];
			
		this.mm.mock( this.lc(), '_disableAllGrids' );
		this.mm.mock( this.lc(), '_enableGrid' );
		this.mm.mock( this.lc(), '_showHeroInGrid' );
		
		this.lc()._showHeroInMidGrid();
		assertEQ ( this.mm.walkLog, '_disableAllGrids,_enableGrid,_showHeroInGrid' );
		assertEQ ( this.mm.params['_enableGrid'], [4] );
		assertEQ ( this.mm.params['_showHeroInGrid'], [4, {id:1}] );
	};
	
	this.test__showEmptyMidGrid = function(){
		this.mm.mock( this.lc(), '_disableAllGrids' );
		this.mm.mock( this.lc(), '_enableEmptyGrid' );
		this.lc()._showEmptyMidGrid();
		assertEQ ( this.mm.walkLog, '_disableAllGrids,_enableEmptyGrid' );
		assertEQ ( this.mm.params['_enableEmptyGrid'], [4] );
	};
	
	this.test__showHerosInLineupGrids = function(){
		this.mm.mock( this.lc(), '_disableAllGrids' );
		this.mm.mock( this.lc(), '_enableEmptyGrid' );
		this.mm.mock( this.lc(), '_enableGrid' );
		this.mm.mock( this.lc(), '_showHeroInGrid' );
		
		this.lc().m_lineupId = 0;
		this.lc().m_heroIds = [0,1,0,2,0];
		this.g.getImgr().getHeros().list = [{id:1},{id:2}];
		
		this.lc()._showHerosInLineupGrids();
		assertEQ ( this.mm.walkLog, '_disableAllGrids' );
		
		this.mm.clear();
		this.lc().m_lineupId = 180001;
		this.lc()._showHerosInLineupGrids();
		assertEQ ( this.mm.walkLog, '_disableAllGrids,_enableEmptyGrid,_enableGrid,_showHeroInGrid,_enableEmptyGrid,_enableGrid,_showHeroInGrid,_enableEmptyGrid' );
		assertEQ ( this.mm.params['_enableEmptyGrid.0'], [4] );
		assertEQ ( this.mm.params['_enableEmptyGrid.1'], [2] );
		assertEQ ( this.mm.params['_enableEmptyGrid.2'], [8] );
		
		assertEQ ( this.mm.params['_enableGrid.0'], [0] );
		assertEQ ( this.mm.params['_showHeroInGrid.0'], [0, {id:1}] );
		assertEQ ( this.mm.params['_enableGrid.1'], [6] );
		assertEQ ( this.mm.params['_showHeroInGrid.1'], [6, {id:2}] );
	};
	
	this.test__disableAllGrids = function(){
		this.mm.mock(this.lc(), '_disableGrid');
		this.lc()._disableAllGrids();
		assertEQ ( this.mm.params['_disableGrid.0'], [0] );
		assertEQ ( this.mm.params['_disableGrid.8'], [8] );
	};
	
	this.test__disableGrid = function(){
		this.mm.mock(this.lc(), '_hideGridDetailLabels' );
		this.mm.mock(IMG, 'setBKImage' );
		
		var p_gridIdx = 0;
		this.lc()._disableGrid(p_gridIdx);
		assertEQ ( this.mm.walkLog, '_hideGridDetailLabels,setBKImage' );
		assertEQ ( this.mm.params['_hideGridDetailLabels'], [p_gridIdx] );
		var listItem = this.lc().m_items.forcetablist.getItem(p_gridIdx);
		assertEQ ( this.mm.params['setBKImage'], [listItem.exsubs.icon.parentNode, IMG.makeImg('expedition/forcetab/disablebak.gif')] );
	};
	
	this.test__enableEmptyGrid = function(){
		this.mm.mock(this.lc(), '_hideGridDetailLabels' );
		this.mm.mock(IMG, 'setBKImage' );
		
		var p_gridIdx = 0;
		this.lc()._enableEmptyGrid(p_gridIdx);
		assertEQ ( this.mm.walkLog, '_hideGridDetailLabels,setBKImage' );
		assertEQ ( this.mm.params['_hideGridDetailLabels'], [p_gridIdx] );
		var listItem = this.lc().m_items.forcetablist.getItem(p_gridIdx);
		assertEQ ( this.mm.params['setBKImage'], [listItem.exsubs.icon.parentNode, IMG.makeImg('expedition/forcetab/emptybak.gif')] );
	};
	
	this.test__enableGrid = function(){
		this.mm.mock(this.lc(), '_showGridDetailLbls' );
		this.mm.mock(IMG, 'setBKImage' );
		
		var p_gridIdx = 0;
		this.lc()._enableGrid(p_gridIdx);
		assertEQ ( this.mm.walkLog, '_showGridDetailLbls,setBKImage' );
		assertEQ ( this.mm.params['_showGridDetailLbls'], [p_gridIdx] );
		var listItem = this.lc().m_items.forcetablist.getItem(p_gridIdx);
		assertEQ ( this.mm.params['setBKImage'], [listItem.exsubs.icon.parentNode, IMG.makeImg('expedition/forcetab/emptybak.gif')] );
	};
	
	this.test__hideGridDetailLabels = function(){
		this.mm.mock(this.lc(), '_showOrHideGridDetailLabels' );
		
		var p_gridIdx = 0;
		this.lc()._hideGridDetailLabels(p_gridIdx);
		assertEQ ( this.mm.params['_showOrHideGridDetailLabels'], [p_gridIdx, 'hide'] );
	};
	
	this.test__showGridDetailLbls = function(){
		this.mm.mock(this.lc(), '_showOrHideGridDetailLabels' );
		
		var p_gridIdx = 0;
		this.lc()._showGridDetailLbls(p_gridIdx);
		assertEQ ( this.mm.params['_showOrHideGridDetailLabels'], [p_gridIdx, 'show'] );
	};
	
	this.test__showOrHideGridDetailLabels = function(){
		this.mm.mock(TQ, 'setCSS');
		
		var p_gridIdx = 0;
		var listItem = this.lc().m_items.forcetablist.getItem(p_gridIdx);
		this.lc()._showOrHideGridDetailLabels(p_gridIdx, 'hide');
		assertEQ ( this.mm.params['setCSS.0'], [listItem.exsubs.icon, 'display', 'none'] );
		assertEQ ( this.mm.params['setCSS.1'], [listItem.exsubs.level, 'display', 'none'] );
		assertEQ ( this.mm.params['setCSS.2'], [listItem.exsubs.name, 'display', 'none'] );
		assertEQ ( this.mm.params['setCSS.3'], [listItem.exsubs.health, 'display', 'none'] );
		assertEQ ( this.mm.params['setCSS.4'], [listItem.exsubs.soldiername, 'display', 'none'] );
		assertEQ ( this.mm.params['setCSS.5'], [listItem.exsubs.soldiernum, 'display', 'none'] );
		assertEQ ( this.mm.params['setCSS.6'], [listItem.exsubs.stateflag, 'display', 'none'] );
		
		this.mm.clear();
		this.lc()._showOrHideGridDetailLabels(p_gridIdx, 'show');
		assertEQ ( this.mm.params['setCSS.0'], [listItem.exsubs.icon, 'display', 'block'] );
		assertEQ ( this.mm.params['setCSS.6'], [listItem.exsubs.stateflag, 'display', 'block'] );
	};
	
	this.test__showHeroInGrid = function(){
		var p_gridIdx = 0;
		var p_hero = {id:0, name:'hero', icon:101, level:2, attrs:{}, soldier:{resid:150001001, number:10}, state:HERO_STATE.FREE};
		p_hero.attrs[ATTR.HEALTH] = {val:3};
		this.lc()._showHeroInGrid(p_gridIdx, p_hero);
		var listItem = this.lc().m_items.forcetablist.getItem(p_gridIdx);
		assertEQ ( isInclude(IMG.getBKImage(listItem.exsubs.icon), '101.gif'), true );
		assertEQ ( TQ.getTextEx(listItem.exsubs.level), TQ.format(rstr.comm.flevel, p_hero.level) );
		assertEQ ( TQ.getTextEx(listItem.exsubs.name), 'hero' );
		assertEQ ( TQ.getTextEx(listItem.exsubs.health), RStrUtil.getHealthStr(3) );
		assertEQ ( TQ.getTextEx(listItem.exsubs.soldiername), RStrUtil.getSoldierNameByResId(p_hero.soldier.resid) );
		assertEQ ( TQ.getTextEx(listItem.exsubs.soldiernum), 10 );
		assertEQ ( IMG.getBKImage(listItem.exsubs.stateflag), "url('')");
		
		p_hero.state = HERO_STATE.STEEL;
		this.lc()._showHeroInGrid(p_gridIdx, p_hero);
		assertEQ ( isInclude(IMG.getBKImage(listItem.exsubs.stateflag), 'expedition/forcetab/herobusy.gif'), true );
	};
	
	this.test__getFirstValidHeroGrid = function(){
		this.lc().m_lineupId = 0;
		assertEQ ( this.lc()._getFirstValidHeroGrid(), null );
		
		this.lc().m_lineupId = 180001;
		this.lc().m_heroIds = [0,0,1,2,0];
		
		this.g.getImgr().getHeros().list = [{id:1}];
		assertEQ ( this.lc()._getFirstValidHeroGrid(), {grid:2, hero:{id:1}} );
	};
});

TestExpedForceTabHdr_bak = TestCaseBaseExpedition.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = ExpeditionDlg.snew(g_app);
		res_lineup=[{'name':'xxx阵','grids':[4,0,2,6,8],'bigpic':0,'smallpic':0,'id':180001,'desc':''}];
		this.dlg.openDlg();
		MilitaryHandler.snew(g_app);
		this.g.getImgr().getSelfFields().list.push({id:1});
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.isOnlyMidForceTabListItemEmptyEnable = function(){
		return ( this.isEnableEmptyForceTabListItem(4) == true )
			&& ( this.isDisableForceTabListItem(0) == true )
			&& ( this.isDisableForceTabListItem(1) == true )
			&& ( this.isDisableForceTabListItem(2) == true )
			&& ( this.isDisableForceTabListItem(3) == true )
			&& ( this.isDisableForceTabListItem(5) == true )
			&& ( this.isDisableForceTabListItem(6) == true )
			&& ( this.isDisableForceTabListItem(7) == true )
			&& ( this.isDisableForceTabListItem(8) == true );	
	};
	
	this.isOnlyMidForceTabListItemEnable = function(){
		return this.isOnlyOneForceTabListItemEnable(4) == true;
	};
	
	this.isOnlyOneForceTabListItemEnable = function(idx){
		for ( var i=0; i<9; ++i ) {
			if ( i == idx ) {
				if ( this.isEnableForceTabListItem(i) == false ) return false;
			}
			else {
				if ( this.isDisableForceTabListItem(i) == false ) return false;
			}
		}
		return true;
	};

	this.testNoLineupCopyFieldTarget = function(){
		var copyfield = {id:1,resid:171001,type:OBJ_TYPE.COPYFIELD,name:'xxx', level:1, pos:{x:0,y:0},needtime:10,fightcap:1000};

		var hdr = ExpedForceTabHdr.snew(g_app, this.dlg.getItems());
		hdr.setTarget(copyfield);
		hdr.setExpedType(EXPED_TYPE.DANTIAO);
		hdr.setLineup(0,[]);
		hdr.refresh();
		assert ( TQ.getCSS( this.dlg.getCtrl('curlineup'), 'display' ) == 'none' );
		assert ( this.isOnlyMidForceTabListItemEmptyEnable() == true );
		assert ( TQ.getTextEx(this.dlg.getCtrl('myfightcap')) === 0);
		
		hdr.setExpedType(EXPED_TYPE.TAOFA);
		hdr.refresh();
		assert ( TQ.getCSS( this.dlg.getCtrl('curlineup'), 'display' ) == 'none' );
		assert ( this.isDisableForceTabList() == true );
		assert ( TQ.getTextEx(this.dlg.getCtrl('myfightcap')) === 0);
		
		hdr.setExpedType(EXPED_TYPE.DANTIAO);
		hdr.refresh();
		assert ( this.isOnlyMidForceTabListItemEmptyEnable() == true );
		assert ( TQ.getCSS( this.dlg.getCtrl('curlineup'), 'display' ) == 'none' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('myfightcap')) === 0);
	};
	
	this.testOneHeroLineUpCopyFieldTarget = function(){
		TestCaseCondition.setPreCond(null, { heros:[ {id:1,icon:101,name:"name1",level:1,state:1,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}]) } ] });	
		var copyfield = {id:1,resid:171001,type:OBJ_TYPE.COPYFIELD,name:'xxx', level:1, pos:{x:0,y:0},needtime:10,fightcap:1000};
		
		var midgrid = 4;
		
		var hdr = ExpedLineupInfoHdr.snew(g_app, this.dlg.getItems());
		hdr.setTarget(copyfield);
		hdr.setExpedType(EXPED_TYPE.DANTIAO);
		hdr.setLineup(0,[1]);
		hdr.refresh();
		assert ( this.isOnlyMidForceTabListItemEnable() == true );
		assert ( TQ.getCSS( this.dlg.getCtrl('curlineup'), 'display' ) == 'none' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('myfightcap')) === 100);
		assertInclude ( this.getForceTabItemHeroBusyFlagImg(midgrid), 'images');
		
		hdr.setLineup(0,[1]);
		hdr.setExpedType(EXPED_TYPE.TAOFA);
		hdr.refresh();
		assert ( this.isDisableForceTabList() == true );
		assert ( TQ.getCSS( this.dlg.getCtrl('curlineup'), 'display' ) == 'none' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('myfightcap')) === 0 );
		
		TestCaseCondition.setPreCond(null, { heros:[ {id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}]) } ] });
		hdr.setExpedType(EXPED_TYPE.DANTIAO);
		hdr.refresh();
		
		assert ( this.isOnlyMidForceTabListItemEnable() == true );
		assertInclude ( this.getForceTabItemIcon(midgrid), '101');
		assert ( this.getForceTabItemName(midgrid) == 'name1' );
		assertInclude ( this.getForceTabItemLevel(midgrid), '1' );
		assert ( this.getForceTabItemHealth(midgrid) == rstr.comm.healthnames[0] );
		assert ( this.getForceTabItemSoldierName(midgrid) == '1阶刀兵' );
		assert ( this.getForceTabItemSoldierNum(midgrid) == '10' );
		assert ( TQ.getCSS( this.dlg.getCtrl('curlineup'), 'display' ) == 'none' );
		assertNoInclude ( this.getForceTabItemHeroBusyFlagImg(midgrid), 'images');
	};

	this.testMultiHerosLineUpCopyFieldTarget = function(){
		TestCaseCondition.setPreCond(null, { heros:[{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}]) },
																	 {id:2,icon:102,name:"name2",level:2,state:0,soldier:{resid:150002002,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}])},
																	 {id:3,icon:103,name:"name3",level:3,state:0,soldier:{resid:0,number:0},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}])}
																	 ] } );
		var copyfield = {id:1,resid:171001,type:OBJ_TYPE.COPYFIELD,name:'xxx', level:1, pos:{x:0,y:0},needtime:10,fightcap:1000};
		var hdr = ExpedLineupInfoHdr.snew(g_app, this.dlg.getItems());
		hdr.setTarget(copyfield);
		hdr.setExpedType(EXPED_TYPE.DANTIAO);
		hdr.setLineup(180001,[0,1,2,3,0]);
		hdr.refresh();
		assert ( this.isOnlyOneForceTabListItemEnable(0) == true );	
		assert ( TQ.getCSS( this.dlg.getCtrl('curlineup'), 'display' ) == 'block' );
		assert ( TQ.getTextEx( this.dlg.getCtrl('curlineup_txt') ) == 'xxx阵' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('myfightcap')) == 100);
		
		hdr.setExpedType(EXPED_TYPE.TAOFA);
		hdr.refresh();
		assert ( this.isEnableEmptyForceTabListItem(4) == true );
		assert ( this.isEnableForceTabListItem(0) == true );
		assert ( this.isEnableForceTabListItem(2) == true );
		assert ( this.isEnableForceTabListItem(6) == true );
		assert ( this.isEnableEmptyForceTabListItem(8) == true );
		assert ( TQ.getCSS( this.dlg.getCtrl('curlineup'), 'display' ) == 'block' );
		assert ( TQ.getTextEx( this.dlg.getCtrl('curlineup_txt') ) == 'xxx阵' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('myfightcap')) == 600);
		
		hdr.setExpedType(EXPED_TYPE.DANTIAO);
		hdr.refresh();
		assert ( this.isOnlyOneForceTabListItemEnable(0) == true );
		assert ( TQ.getCSS( this.dlg.getCtrl('curlineup'), 'display' ) == 'block' );
		assert ( TQ.getTextEx( this.dlg.getCtrl('curlineup_txt') ) == 'xxx阵' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('myfightcap')) == 100);
	};
	
	this.testOneHeroLineUpSelfFieldTarget = function() {
		TestCaseCondition.setPreCond(null, { heros:[{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}]) },
																	 {id:2,icon:102,name:"name2",level:2,state:0,soldier:{resid:150002002,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}])},
																	 {id:3,icon:103,name:"name3",level:3,state:0,soldier:{resid:0,number:0},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}])}
																	 ] } );
		var selffield = {id:1,type:OBJ_TYPE.FIELD,name:'xxx', pos:{x:100,y:200}};
		var hdr = ExpedLineupInfoHdr.snew(g_app, this.dlg.getItems());
		hdr.setTarget(selffield);
		hdr.setExpedType(EXPED_TYPE.PAIQIAN);
		hdr.setLineup(180001,[0,1,2,3,0]);
		hdr.refresh();
		assert ( this.isOnlyOneForceTabListItemEnable(0) == true );	
		assert ( TQ.getCSS( this.dlg.getCtrl('curlineup'), 'display' ) == 'block' );
		assert ( TQ.getTextEx( this.dlg.getCtrl('curlineup_txt') ) == 'xxx阵' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('myfightcap')) == 200);
	};
	
	this.testOneHeroLineUpOtherFieldTarget = function() {
		TestCaseCondition.setPreCond(null, { heros:[{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}]) },
																	 {id:2,icon:102,name:"name2",level:2,state:0,soldier:{resid:150002002,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}])},
																	 {id:3,icon:103,name:"name3",level:3,state:0,soldier:{resid:0,number:0},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}])}
																	 ] } );
		var otherfield = {id:2,resid:170001,type:OBJ_TYPE.FIELD,name:'xxx', level:1, pos:{x:100,y:200},fightcap:1000};
		var hdr = ExpedLineupInfoHdr.snew(g_app, this.dlg.getItems());
		hdr.setTarget(otherfield);
		hdr.setExpedType(EXPED_TYPE.DANTIAO);
		hdr.setLineup(180001,[0,1,2,3,0]);
		hdr.refresh();
		assert ( this.isOnlyOneForceTabListItemEnable(0) == true );	
		assert ( TQ.getCSS( this.dlg.getCtrl('curlineup'), 'display' ) == 'block' );
		assert ( TQ.getTextEx( this.dlg.getCtrl('curlineup_txt') ) == 'xxx阵' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('myfightcap')) == 100);
		
		hdr.setExpedType(EXPED_TYPE.ZHANLING);
		hdr.refresh();
		assert ( TQ.getTextEx(this.dlg.getCtrl('myfightcap')) == 200);
	};
	
	this.testHerosLineUpSameAlliPlayerTarget = function() {
		TestCaseCondition.setPreCond(null, { heros:[{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}]) },
																	 {id:2,icon:102,name:"name2",level:2,state:0,soldier:{resid:150002002,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}])},
																	 {id:3,icon:103,name:"name3",level:3,state:0,soldier:{resid:0,number:0},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}])}
																	 ] } );
		var alliplayer = {type:OBJ_TYPE.ROLE,name:'xxx', pos:{x:100,y:200}, alliance:{uid:1}};
		var hdr = ExpedLineupInfoHdr.snew(g_app, this.dlg.getItems());
		hdr.setTarget(alliplayer);
		hdr.setExpedType(EXPED_TYPE.PAIQIAN);
		hdr.setLineup(180001,[0,1,2,3,0]);
		hdr.refresh();
		assert ( TQ.getCSS( this.dlg.getCtrl('curlineup'), 'display' ) == 'block' );
		assert ( TQ.getTextEx( this.dlg.getCtrl('curlineup_txt') ) == 'xxx阵' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('myfightcap')) == 600);	
	};
	
	this.testHerosLineUpOtherPlayerTarget = function(){
		TestCaseCondition.setPreCond(null, { heros:[{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}]) },
																	 {id:2,icon:102,name:"name2",level:2,state:0,soldier:{resid:150002002,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}])},
																	 {id:3,icon:103,name:"name3",level:3,state:0,soldier:{resid:0,number:0},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC,{val:100,u:0}, ATTR.FC,{val:200,u:0}])}
																	 ] } );
		var otherplayer = {type:OBJ_TYPE.ROLE,name:'xxx', pos:{x:100,y:200}};
		var hdr = ExpedLineupInfoHdr.snew(g_app, this.dlg.getItems());
		hdr.setTarget(otherplayer);
		hdr.setExpedType(EXPED_TYPE.TAOFA);
		hdr.setLineup(180001,[0,1,2,3,0]);
		hdr.refresh();

		assert ( TQ.getCSS( this.dlg.getCtrl('curlineup'), 'display' ) == 'block' );
		assert ( TQ.getTextEx( this.dlg.getCtrl('curlineup_txt') ) == 'xxx阵' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('myfightcap')) == 600);

		hdr.setExpedType(EXPED_TYPE.CUIHUI);
		hdr.refresh();
		assert ( TQ.getTextEx(this.dlg.getCtrl('myfightcap')) == 600);
		
		hdr.setExpedType(EXPED_TYPE.TIAOXIN);
		hdr.refresh();
		assert ( TQ.getTextEx(this.dlg.getCtrl('myfightcap')) == 100);
	};
	
	this.testNeedSingleHeroPaiQianWhenSelfField = function() {
		var hdr = ExpedForceTabHdr.snew(g_app, this.dlg.getItems());
		var selffield = {id:1,type:OBJ_TYPE.FIELD,name:'xxx', pos:{x:100,y:200}};
		hdr.setTarget(selffield);
		hdr.setExpedType(EXPED_TYPE.PAIQIAN);
		hdr.refresh();
		assert ( hdr.isNeedSingleHero() == true );
	};
	
	this.testNoNeedSingleHeroPaiQianWhenAlliPlayer = function() {
		var hdr = ExpedForceTabHdr.snew(g_app, this.dlg.getItems());
		var alliplayer = {type:OBJ_TYPE.ROLE,name:'xxx', pos:{x:100,y:200}, alliance:{uid:1}};
		hdr.setTarget(alliplayer);
		hdr.setExpedType(EXPED_TYPE.PAIQIAN);
		hdr.refresh();
		assert ( hdr.isNeedSingleHero() == false );
	};
	
	this.testNeedSingleHeroTaofaWhenOtherField = function() {
		var hdr = ExpedForceTabHdr.snew(g_app, this.dlg.getItems());
		var otherfield = {id:2,type:OBJ_TYPE.FIELD,name:'xxx', pos:{x:100,y:200}};
		hdr.setTarget(otherfield);
		hdr.setExpedType(EXPED_TYPE.TAOFA);
		hdr.refresh();
		assert ( hdr.isNeedSingleHero() == true );
	};
	
	this.testNoNeedSingleHeroTaofaWhenOtherPlayer = function() {
		var hdr = ExpedForceTabHdr.snew(g_app, this.dlg.getItems());
		var otherplayer = {type:OBJ_TYPE.ROLE,name:'xxx', pos:{x:100,y:200}};
		hdr.setTarget(otherplayer);
		hdr.setExpedType(EXPED_TYPE.TAOFA);
		hdr.refresh();
		assert ( hdr.isNeedSingleHero() == false );
	};
	
	this.testNoNeedSingleHeroTaofaWhenCopyField = function() {
		var hdr = ExpedForceTabHdr.snew(g_app, this.dlg.getItems());
		var copyfield = {id:1,resid:171001,type:OBJ_TYPE.COPYFIELD,name:'xxx', level:1, pos:{x:0,y:0},needtime:10,fightcap:1000};
		hdr.setTarget(copyfield);
		hdr.setExpedType(EXPED_TYPE.TAOFA);
		hdr.refresh();
		assert ( hdr.isNeedSingleHero() == false );
	};
	
	this.testNeedSingleHeroDantiaoWhenOtherField = function() {
		var hdr = ExpedForceTabHdr.snew(g_app, this.dlg.getItems());
		var otherfield = {id:2,type:OBJ_TYPE.FIELD,name:'xxx', pos:{x:100,y:200}};
		hdr.setTarget(otherfield);
		hdr.setExpedType(EXPED_TYPE.DANTIAO);
		hdr.refresh();
		assert ( hdr.isNeedSingleHero() == true );
	};

	this.testNeedSingleHeroDantiaoWhenCopyField = function() {
		var hdr = ExpedForceTabHdr.snew(g_app, this.dlg.getItems());
		var copyfield = {id:1,resid:171001,type:OBJ_TYPE.COPYFIELD,name:'xxx', level:1, pos:{x:0,y:0},needtime:10,fightcap:1000};
		hdr.setTarget(copyfield);
		hdr.setExpedType(EXPED_TYPE.DANTIAO);
		hdr.refresh();
		assert ( hdr.isNeedSingleHero() == true );
	};
	
	this.testNoNeedSingleHeroCuihuiWhenOtherPlayer = function() {
		var hdr = ExpedForceTabHdr.snew(g_app, this.dlg.getItems());
		var otherplayer = {type:OBJ_TYPE.ROLE,name:'xxx', pos:{x:100,y:200}};
		hdr.setTarget(otherplayer);
		hdr.setExpedType(EXPED_TYPE.CUIHUI);
		hdr.refresh();
		assert ( hdr.isNeedSingleHero() == false );
	};
	
	this.testNeedSingleHeroTiaoxinWhenOtherPlayer = function() {
		var hdr = ExpedForceTabHdr.snew(g_app, this.dlg.getItems());
		var otherplayer = {type:OBJ_TYPE.ROLE,name:'xxx', pos:{x:100,y:200}};
		hdr.setTarget(otherplayer);
		hdr.setExpedType(EXPED_TYPE.TIAOXIN);
		hdr.refresh();
		assert ( hdr.isNeedSingleHero() == true );
	};
	
	this.testNeedSingleHeroZhanlingWhenOtherField = function() {
		var hdr = ExpedForceTabHdr.snew(g_app, this.dlg.getItems());
		var otherfield = {id:2,type:OBJ_TYPE.FIELD,name:'xxx', pos:{x:100,y:200}};
		hdr.setTarget(otherfield);
		hdr.setExpedType(EXPED_TYPE.ZHANLING);
		hdr.refresh();
		assert ( hdr.isNeedSingleHero() == true );
	};
	
	this.testCallRefreshWhenHerosUpdateEvent = function(){
		var hdr = ExpedLineupInfoHdr.snew(g_app, this.dlg.getItems());
		var otherfield = {id:2,type:OBJ_TYPE.FIELD,name:'xxx', pos:{x:100,y:200}};
		hdr.setTarget(otherfield);
		hdr.setExpedType(EXPED_TYPE.ZHANLING);
		hdr.refresh();
		
		var refreshCount = 0;
		hdr.refresh = function() { refreshCount++; };
		g_app.sendEvent({eid:EVT.HERO_UPDATE, sid:0});
		assert( refreshCount == 1 );
	};
});

TestExpedDefaultTeamHdr = TestCaseBaseExpedition.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		this.dlg = ExpeditionDlg.snew(g_app);
		this.target = {id:1,resid:171001,type:OBJ_TYPE.COPYFIELD,name:'xxx', level:1, pos:{x:0,y:0},needtime:10,fightcap:1000};
		this.bak_res_lineup = res_lineup;
		res_lineup=[{'name':'xxx阵','grids':[4,0,2,6,8],'bigpic':0,'smallpic':0,'id':180001,'desc':''}];
		this.dlg.openDlg(this.target);
		MilitaryHandler.snew(g_app);
	};
	
	this.tearDown = function(){
		res_lineup = this.bak_res_lineup;
		TestCaseHelper.tearDown(this);
	};
	
	this.testDefaultTeamsShow = function(){
		assert ( this.dlg.getCtrl('defaultteam').getRadio(0).getText() == TQ.format(rstr.expeddlg.btn.defaultteam, rstr.comm.hznums[1], rstr.expeddlg.btn.nosetteam));
		assert ( this.dlg.getCtrl('defaultteam').getRadio(1).getText() == TQ.format(rstr.expeddlg.btn.defaultteam, rstr.comm.hznums[2], rstr.expeddlg.btn.nosetteam));
		assert ( this.dlg.getCtrl('defaultteam').getRadio(2).getText() == TQ.format(rstr.expeddlg.btn.defaultteam, rstr.comm.hznums[3], rstr.expeddlg.btn.nosetteam));
		
		TestCaseCondition.setPreCond(null, { heros:[ 
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.FC, {val:100,u:0}]) }
			,{id:2,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.FC, {val:100,u:0}]) }
			,{id:3,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.FC, {val:100,u:0}]) }
			,{id:4,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.FC, {val:100,u:0}]) }
			,{id:5,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.FC, {val:100,u:0}]) }
			] });	
		
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:{defaultteams:[{id:1,lineup:180001,heros:[1,2,3,4,5]},{id:2,lineup:180001,heros:[1,0,3,4,5]},{id:3,lineup:0,heros:[]}]}});
		assert ( this.dlg.getCtrl('defaultteam').getRadio(0).getText() == TQ.format(rstr.expeddlg.btn.defaultteam, rstr.comm.hznums[1], 500));
		assert ( this.dlg.getCtrl('defaultteam').getRadio(1).getText() == TQ.format(rstr.expeddlg.btn.defaultteam, rstr.comm.hznums[2], 400));
		assert ( this.dlg.getCtrl('defaultteam').getRadio(2).getText() == TQ.format(rstr.expeddlg.btn.defaultteam, rstr.comm.hznums[3], rstr.expeddlg.btn.nosetteam));
		
		TestCaseCondition.setPreCond(null, { heros:[ 
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.FC, {val:100,u:0}]) }
			,{id:2,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.FC, {val:100,u:0}]) }
			,{id:3,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.FC, {val:100,u:0}]) }
			,{id:4,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.FC, {val:100,u:0}]) }
			] });	
		g_app.sendEvent({eid:EVT.HERO_UPDATE, sid:0});
		assert ( this.dlg.getCtrl('defaultteam').getRadio(0).getText() == TQ.format(rstr.expeddlg.btn.defaultteam, rstr.comm.hznums[1], 400));
		assert ( this.dlg.getCtrl('defaultteam').getRadio(1).getText() == TQ.format(rstr.expeddlg.btn.defaultteam, rstr.comm.hznums[2], 300));
		assert ( this.dlg.getCtrl('defaultteam').getRadio(2).getText() == TQ.format(rstr.expeddlg.btn.defaultteam, rstr.comm.hznums[3], rstr.expeddlg.btn.nosetteam));
		
		TestCaseCondition.setPreCond(null, { heros:[ 
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.FC, {val:10,u:0}]) }
			,{id:2,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.FC, {val:10,u:0}]) }
			,{id:3,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.FC, {val:10,u:0}]) }
			,{id:4,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.FC, {val:10,u:0}]) }
			,{id:5,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.FC, {val:10,u:0}]) }
			] });
		g_app.sendEvent({eid:EVT.HERO_UPDATE, sid:0});
		assert ( this.dlg.getCtrl('defaultteam').getRadio(0).getText() == TQ.format(rstr.expeddlg.btn.defaultteam, rstr.comm.hznums[1], 50));
		assert ( this.dlg.getCtrl('defaultteam').getRadio(1).getText() == TQ.format(rstr.expeddlg.btn.defaultteam, rstr.comm.hznums[2], 40));
		assert ( this.dlg.getCtrl('defaultteam').getRadio(2).getText() == TQ.format(rstr.expeddlg.btn.defaultteam, rstr.comm.hznums[3], rstr.expeddlg.btn.nosetteam));
	};
	
	this.testSelectTeamWhenNoHasLineup = function(){
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:{defaultteams:[{id:1,lineup:180001,heros:[1,2,3,4,5]},{id:2,lineup:180001,heros:[1,0,3,4,5]},{id:3,lineup:0,heros:[]}]}});
		this.dlg.getCtrl('defaultteam').select(2);
		assert ( TestCaseSysTip.getSystip() == rstr.expeddlg.err.noLineup );
		assert ( this.dlg.getCtrl('defaultteam').getCurSelId() == -1 );
	};

	this.testSelectTeamWhenNoFullHeroOK = function(){
		TestCaseCondition.setPreCond(null, { heros:[ 
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:2,icon:101,name:"name2",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:3,icon:101,name:"name3",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:4,icon:101,name:"name4",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:5,icon:101,name:"name5",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			] });
		this.dlg.openDlg(this.target);
		assert ( TQ.getCSS(this.dlg.getCtrl('curdefaultteam'), 'display') == 'none' );
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:{defaultteams:[{id:1,lineup:180001,heros:[1,2,3,4,5]},{id:2,lineup:180001,heros:[1,0,3,4,5]},{id:3,lineup:0,heros:[]}]}});
		this.dlg.getCtrl('defaultteam').select(1);
		assert ( TestCaseSysTip.getSystip() == '' );
		assert ( this.dlg.getCtrl('defaultteam').getCurSelId() == 1 );
		assert ( TQ.getCSS(this.dlg.getCtrl('curdefaultteam'), 'display') == 'block' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('curdefaultteam_txt')) === TQ.format(rstr.expeddlg.lbl.defaultteam, rstr.comm.hznums[2]) );
	};
	
	this.testSelectTeamWithoutTarget = function(){
		TestCaseCondition.setPreCond(null, { heros:[ 
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:2,icon:101,name:"name2",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:3,icon:101,name:"name3",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:4,icon:101,name:"name4",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:5,icon:101,name:"name5",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			] });
		this.dlg.openDlg(this.target);
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:{defaultteams:[{id:1,lineup:180001,heros:[1,2,3,4,5]},{id:2,lineup:180001,heros:[1,0,3,4,5]},{id:3,lineup:0,heros:[]}]}});
		this.dlg.getCtrl('defaultteam').select(0);
		
		this.dlg.setTarget(null);
		this.dlg.getCtrl('defaultteam').select(-1);
		this.dlg.getCtrl('defaultteam').select(0);
		assert ( this.dlg.getCtrl('defaultteam').getCurSelId() == -1 );
		assert ( TestCaseSysTip.getSystip() == rstr.expeddlg.err.noTarget );
	};
	
	this.testSelectTeamOK = function(){
		this.mm.mock(MilitarySender, 'sendSaveForceLineUp');

		TestCaseCondition.setPreCond(null, { heros:[ 
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:2,icon:101,name:"name2",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:3,icon:101,name:"name3",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:4,icon:101,name:"name4",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:5,icon:101,name:"name5",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			] });
		this.dlg.openDlg(this.target);
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:{defaultteams:[{id:1,lineup:180001,heros:[1,2,3,4,5]},{id:2,lineup:180001,heros:[1,0,3,4,5]},{id:3,lineup:0,heros:[]}]}});
		this.dlg.getCtrl('defaultteam').select(0);
		assert ( TestCaseSysTip.hasSystip() == false );
		assert ( TQ.getCSS(this.dlg.getCtrl('curdefaultteam'), 'display') == 'block' );
		assert ( TQ.getTextEx(this.dlg.getCtrl('curdefaultteam_txt')) === TQ.format(rstr.expeddlg.lbl.defaultteam, rstr.comm.hznums[1]) );
		assert ( this.isDisableForceTabList() == false );
		assertEQ ( this.mm.params['sendSaveForceLineUp'], [this.g, FORCELINE_TYPE.COMM, 180001, [1,2,3,4,5]] );
		assertEQ ( this.g.getImgr().getSaveForces(), [{type:FORCELINE_TYPE.COMM,lineup:180001,heros:[1,2,3,4,5]},{type:2,lineup:0,heros:[]},{type:3,lineup:0,heros:[]}] );
			
		this.mm.clear();
		this.dlg.getCtrl('defaultteam').select(-1);
		assert ( this.dlg.getCtrl('defaultteam').getCurSelId() == -1 );
		assert ( TQ.getCSS(this.dlg.getCtrl('curdefaultteam'), 'display') == 'none' );
		assert ( this.isDisableForceTabList() == true );
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.testChangeTargetSaveDefaultTeamSel = function(){
		TestCaseCondition.setPreCond(null, { heros:[ 
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:2,icon:101,name:"name2",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:3,icon:101,name:"name3",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:4,icon:101,name:"name4",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			,{id:5,icon:101,name:"name5",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.SFC, {val:10,u:0}]) }
			] });
		this.dlg.openDlg(this.target);
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:{defaultteams:[{id:1,lineup:180001,heros:[1,2,3,4,5]},{id:2,lineup:180001,heros:[1,0,3,4,5]},{id:3,lineup:0,heros:[]}]}});
		this.dlg.getCtrl('defaultteam').select(0);
		
		var otherfield = {id:2,resid:170001,type:OBJ_TYPE.FIELD,name:'xxx', level:1, pos:{x:100,y:200},fightcap:1000,sfightcap:500};
		this.dlg.setTarget(otherfield);
		assert ( this.dlg.getCtrl('defaultteam').getCurSelId() == 0 );
		assert ( TQ.getCSS(this.dlg.getCtrl('curdefaultteam'), 'display') == 'block' );
	};
});

TestCaseSendExpeditionCmd = TestCaseBaseExpedition.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = ExpeditionDlg.snew(g_app);
		MilitaryHandler.snew(g_app);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.testClickExpeditionBtn = function(){
		this.mm.mock(MilitarySender, 'sendSaveForceLineUp');
		this.dlg.openDlg();
		
		var r_getFightRefState = [REF_ROLESTATE.NORMAL];
		this.mm.mock(this.g.getImgr(), 'getFightRefState', r_getFightRefState);
		
		this.dlg.getCtrl('expedition').click();
		assert ( TestCaseSysTip.getSystip() == rstr.expeddlg.err.noTarget );
		assert(g_app.getSendMsg() === '');
		
		r_getFightRefState[0] = REF_ROLESTATE.NORMAL;
		var otherplayer = {id:1,type:OBJ_TYPE.ROLE,name:'xxx', roleId:10000, pos:{x:100,y:200}};
		this.dlg.setTarget(otherplayer);
		this.dlg.getCtrl('expedition').click();
		assert ( TestCaseSysTip.getSystip() == rstr.expeddlg.err.noAssignHeros );
		assert(g_app.getSendMsg() === '');
		
		TestCaseCondition.setPreCond(null, { heros:[ 
			{id:1,icon:101,name:"name1",level:1,state:1,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC, {val:10,u:0}]) }
			,{id:2,icon:101,name:"name2",level:1,state:1,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC, {val:10,u:0}]) }
			] });
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:{defaultteams:[{id:1,lineup:180001,heros:[1,0,2,0,0]},{id:2,lineup:0,heros:[]},{id:3,lineup:0,heros:[]}]}});
		
		this.dlg.getCtrl('defaultteam').select(0);
		this.dlg.getCtrl('expedition').click();
		assert ( TestCaseSysTip.getSystip() == TQ.format(rstr.expeddlg.err.hasBusyHero, ' name1 name2 ') );
		assert(g_app.getSendMsg() === '');
		
		TestCaseCondition.setPreCond(null, { heros:[ 
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:20*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC, {val:10,u:0}]) }
			,{id:2,icon:101,name:"name2",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC, {val:10,u:0}]) }
			] });
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:{defaultteams:[{id:1,lineup:180001,heros:[1,0,2,0,0]},{id:2,lineup:0,heros:[]},{id:3,lineup:0,heros:[]}]}});
		this.dlg.getCtrl('defaultteam').select(0);
		this.dlg.getCtrl('expedition').click();
		assert ( TestCaseSysTip.getSystip() == rstr.expeddlg.err.noHealth );
		assert(g_app.getSendMsg() === '');
		
		TestCaseCondition.setPreCond(null, { heros:[ 
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC, {val:10,u:0}]) }
			,{id:2,icon:101,name:"name2",level:1,state:0,soldier:{resid:150001001,number:0},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC, {val:10,u:0}]) }
			] });
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:{defaultteams:[{id:1,lineup:180001,heros:[1,0,2,0,0]},{id:2,lineup:0,heros:[]},{id:3,lineup:0,heros:[]}]}});
		this.dlg.getCtrl('defaultteam').select(0);
		this.dlg.getCtrl('expedition').click();
		assert ( TestCaseSysTip.getSystip() == rstr.expeddlg.err.noCarrySoldiers );
		assert(g_app.getSendMsg() === '');		
		
		TestCaseCondition.setPreCond(null, { heros:[ 
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC, {val:10,u:0}]) }
			,{id:2,icon:101,name:"name2",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC, {val:10,u:0}]) }
			] });
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:{defaultteams:[{id:1,lineup:180001,heros:[1,0,2,0,0]},{id:2,lineup:0,heros:[]},{id:3,lineup:0,heros:[]}]}});
		this.dlg.getCtrl('defaultteam').select(0);
		this.dlg.getCtrl('expedition').click();
		assert ( TestCaseSysTip.getSystip() == rstr.expeddlg.err.noDeclareFight );
		assert(g_app.getSendMsg() === '');
		
		this.g.getImgr().getRoleRes().alliance.uid = 1;
		r_getFightRefState[0] = REF_ROLESTATE.NORMAL;
		var alliplayer = {id:1,type:OBJ_TYPE.ROLE,name:'xxx', pos:{x:100,y:200},alliance:{uid:1}};
		this.dlg.setTarget(alliplayer);
		this.dlg.getCtrl('expedition').click();
		assertInclude(g_app.getSendMsg(), 'count=5');
		assert(this.dlg.isShow() == false);
		g_app.clearSendMsg();
		
		r_getFightRefState[0] = REF_ROLESTATE.DECLARING_FIGHT;
		var otherplayer = {id:1,type:OBJ_TYPE.ROLE,name:'xxx', roleId:10000, pos:{x:100,y:200}};
		this.dlg.openDlg(otherplayer);
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:{defaultteams:[{id:1,lineup:180001,heros:[1,0,2,0,0]},{id:2,lineup:0,heros:[]},{id:3,lineup:0,heros:[]}]}});
		this.dlg.getCtrl('defaultteam').select(0);
		this.dlg.getCtrl('expedition').click();
		assert ( TestCaseSysTip.getSystip() == rstr.expeddlg.err.declaringFight );
		assert(g_app.getSendMsg() === '');
		
		r_getFightRefState[0] = REF_ROLESTATE.FIGHTING;
		TestCaseCondition.setPreCond(this.hero, {rolepos:{x:338,y:160}});
		var otherplayer = {type:OBJ_TYPE.ROLE,name:'xxx', pos:{x:313,y:257}};
		this.dlg.setTarget(otherplayer);
		this.dlg.getCtrl('expedition').click();
		assertInclude(g_app.getSendMsg(), 'count=5');
		assert(this.dlg.isShow() == false);
		g_app.clearSendMsg();
		
		// country fight
		this.dlg.openDlg();
		this.dlg.getCtrl('selecttype').select(0);
		TestCaseCondition.setPreCond(this.hero, {rolepos:{x:341,y:268}});
		var otherplayer = {type:OBJ_TYPE.ROLE,name:'xxx', pos:{x:134,y:40}};
		this.dlg.setTarget(otherplayer);
		this.mm.clear();
		g_app.clearSendMsg();
		this.dlg.getCtrl('expedition').click();
		assertEQ ( g_app.getSendMsg(), '' );
		assertEQ ( this.g.getGUI().isShowMsgBox(), true );
		assertEQ ( this.g.getGUI().getMsgBoxMsg(),  TQ.format(rstr.expeddlg.lbl.taofaplayertype_tip,3)  + TQ.format(rstr.expeddlg.lbl.countryfight_desc,10) );
		this.g.getGUI().msgBoxClick(MB_IDCLOSE);
		assertInclude(g_app.getSendMsg(), 'count=5');
		
		this.dlg.openDlg();
		this.dlg.setTarget(otherplayer);
		this.dlg.getCtrl('selecttype').select(1);
		this.mm.clear();
		g_app.clearSendMsg();
		this.dlg.getCtrl('expedition').click();
		assertEQ ( this.g.getGUI().getMsgBoxMsg(),  TQ.format(rstr.expeddlg.lbl.cuihuiplayertype_tip, 5) + TQ.format(rstr.expeddlg.lbl.countryfight_desc, 10) );
		
		this.dlg.openDlg();
		this.dlg.setTarget(otherplayer);
		this.dlg.getCtrl('selecttype').select(2);		
		this.mm.clear();
		g_app.clearSendMsg();
		this.dlg.getCtrl('expedition').click();
		assertEQ ( this.g.getGUI().getMsgBoxMsg(),  TQ.format(rstr.expeddlg.lbl.tiaoxinplayertype_tip, 1) + TQ.format(rstr.expeddlg.lbl.countryfight_desc, 10) );
	};
	
	this.testExpeditionBeyondFightTimes = function(){
		this.mm.mock(MilitarySender, 'sendSaveForceLineUp');
		var r_getFightRefState = [REF_ROLESTATE.FIGHTING];
		this.mm.mock(this.g.getImgr(), 'getFightRefState', r_getFightRefState);
		TestCaseCondition.setPreCond(null, { todaybattletimes:{taofa:4,cuihui:5,tiaoxin:1}, heros:[ 
			{id:1,icon:101,name:"name1",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC, {val:10,u:0}]) }
			,{id:2,icon:101,name:"name2",level:1,state:0,soldier:{resid:150001001,number:10},attrs:TQ.pairListToDict([ATTR.HEALTH, {val:100*ATTR_PRECISION,u:0}, ATTR.MHEALTH, {val:100,u:0}, ATTR.SFC, {val:10,u:0}]) }
			] });
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.MILITARY, data:{defaultteams:[{id:1,lineup:180001,heros:[1,0,2,0,0]},{id:2,lineup:0,heros:[]},{id:3,lineup:0,heros:[]}]}});
		var otherplayer = {id:1,type:OBJ_TYPE.ROLE,roleId:10000, name:'xxx', pos:{x:100,y:200}};
		this.dlg.openDlg(otherplayer);
		this.dlg.getCtrl('defaultteam').select(0);
		this.dlg.getCtrl('selecttype').select(0); // taofa type
		this.dlg.getCtrl('expedition').click();
		
		var itemRes = ItemResUtil.findItemres(FIXID.CHUSHILING);
		var maxFightTimes = 10;
		var msg = TQ.format(rstr.expeddlg.warning.attackMaxTimes, maxFightTimes, itemRes.name);
		
		assert(g_app.getGUI().isShowMsgBox() == true);
		assertInclude( g_app.getGUI().getMsgBoxMsg(), msg);
		assertInclude( g_app.getGUI().getMsgBoxMsg(), FIXID.CHUSHILING);
		assert( g_app.getSendMsg() === '' );
		g_app.getGUI().hideMsgBox();
		
		TestCaseCondition.setPreCond(null, {item:{id:FIXID.CHUSHILING, num:1} });
		this.dlg.getCtrl('expedition').click();
		assert(g_app.getGUI().isShowMsgBox() == true);
		assert( g_app.getGUI().getMsgBoxMsg() == msg );
		g_app.getGUI().msgBoxClick(MB_IDYES);
		assertInclude(g_app.getSendMsg(), 'count=5,hid1=1,hid2=0,hid3=2,hid4=0,hid5=0');
		assert(this.dlg.isShow() == false);
	};	
});

TestCaseDropDesc = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = ExpeditionDlg.snew(g_app);
		res_test_items = [{id:1,name:'itemName'}];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.testShowMustDropItem = function(){
		var dropId = 2;
		res_drops = [{id:2, items:[{'pro':100,'id':1,'minnum':1,'maxnum':2}]}];
		assert( DropItemUtil.getDesc(dropId) == '可获得：itemName　' );
	};
	
	this.testShowRandDropItem = function(){
		var dropId = 2;
		res_drops = [{id:2, items:[{'pro':80,'id':1,'minnum':1,'maxnum':2}]}];
		assert( DropItemUtil.getDesc(dropId) == '' );
	};
	
	this.testShowMustDropItemWithNumber = function(){
		var dropId = 2;
		res_drops = [{id:2, items:[{'pro':100,'id':1,'minnum':2,'maxnum':2}]}];
		assert( DropItemUtil.getDesc(dropId) == '可获得：itemName×2　' );
	};
	
	this.testShowRandDropItemWithNumber = function(){
		var dropId = 2;
		res_drops = [{id:2, items:[{'pro':80,'id':1,'minnum':1,'maxnum':1}]}];
		assert( DropItemUtil.getDesc(dropId) == '' );	
	};
	
	this.testShowCombine = function(){
		var dropId = 2;
		res_drops = [{id:2, items:[{'pro':80,'id':1,'minnum':4,'maxnum':4},{'pro':100,'id':1,'minnum':1,'maxnum':3}],roleexp:{'pro':80,'minnum':1,'maxnum':1},roleps:{'pro':100,'minnum':1,'maxnum':1},heroexp:{'pro':100,'minnum':1,'maxnum':2},credit:{'pro':100,'minnum':1,'maxnum':1},iforce:{'pro':100,'minnum':8,'maxnum':8},money:{'pro':100,'minnum':9,'maxnum':9}}];
		assert( DropItemUtil.getDesc(dropId) == '可获得：君主精力+1　可获得：武将经验　可获得：武将武勋+1　可获得：武将内功+8　可获得：钱币+9　可获得：itemName　' );	
	};
	
	this.testShowCombineNoGainLbl = function(){
		var dropId = 2;
		res_drops = [{id:2, items:[{'pro':80,'id':1,'minnum':4,'maxnum':4},{'pro':100,'id':1,'minnum':1,'maxnum':3}],roleexp:{'pro':80,'minnum':1,'maxnum':1},roleps:{'pro':100,'minnum':1,'maxnum':1},heroexp:{'pro':100,'minnum':1,'maxnum':2},credit:{'pro':100,'minnum':1,'maxnum':1},iforce:{'pro':100,'minnum':8,'maxnum':8},money:{'pro':100,'minnum':9,'maxnum':9}}];
		assert( DropItemUtil.getDescNoGainLbl(dropId) == '君主精力+1　武将经验　武将武勋+1　武将内功+8　钱币+9　itemName　' );	
	};
	
	this.test_getProItemsDesc = function(){
		var dropId = 2;
		res_drops = [{id:2, items:[{'pro':80,'id':1,'minnum':1,'maxnum':1},{'pro':80,'id':1,'minnum':1,'maxnum':1}]}];
		assert ( DropItemUtil.getProItemsDesc(dropId) == 'itemName itemName');
	};
	
	this.test_getSimpleDesc = function(){
		var dropId = 2;
		res_drops = [{id:2, items:[{'pro':80,'id':1,'minnum':4,'maxnum':4},{'pro':100,'id':1,'minnum':1,'maxnum':3}],roleexp:{'pro':80,'minnum':1,'maxnum':1},roleps:{'pro':100,'minnum':1,'maxnum':1},heroexp:{'pro':100,'minnum':1,'maxnum':2},credit:{'pro':100,'minnum':1,'maxnum':1},iforce:{'pro':100,'minnum':8,'maxnum':8},money:{'pro':100,'minnum':9,'maxnum':9},fourres:{'pro':100,'minnum':10,'maxnum':10},idlepopu:{'pro':100,'minnum':11,'maxnum':11},giftgold:{'pro':100,'minnum':12,'maxnum':12},gold:{'pro':100,'minnum':13,'maxnum':13},allicontribute:{'pro':100,'minnum':13,'maxnum':13},prestige:{'pro':100,'minnum':14,'maxnum':14},statehonour:{'pro':100,'minnum':15,'maxnum':15},jibing1:{'pro':100,'minnum':16,'maxnum':16},xinbing:{'pro':100,'minnum':17,'maxnum':17}}];
		var expectStr = '君主精力+1　武将经验　武将武勋+1　武将内功+8　钱币+9　四项资源+10　空闲人口+11　礼金+12　金币+13　联盟贡献+13　君主声望+14　荣誉+15　一阶戟兵+16　新兵+17　';
		assertEQ( DropItemUtil.getSimpleDesc(dropId), expectStr );
	};
	
	this.test_getDropItems = function(){
		var dropId = 2;
		res_drops = [{id:2}];
		assertEQ( DropItemUtil.getDropItems(dropId), []);	
		res_drops = [{id:2, items:[{'pro':80,'id':1,'minnum':4,'maxnum':4},{'pro':100,'id':1,'minnum':1,'maxnum':3},{'pro':100,'id':1,'minnum':2,'maxnum':2},{'pro':100,'id':2,'minnum':3,'maxnum':3}]}];
		assertEQ( DropItemUtil.getDropItems(dropId), [{id:1,number:2},{id:2, number:3}]);
	};
});

TestCaseExpedTargetChecker = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.checker = ExpedTargetChecker.snew(g_app);
		this.lc = this.checker.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.checker );
		assertEQ ( this.lc().m_target, ExpedTargetUtil.createNull() );
	};
	
	this.test_setTarget = function(){
		this.mm.mock(ExpedTargetUtil, 'getValidTarget', [{name:'vtarget'}]);
		var p_target = {name:'target'};
		this.checker.setTarget(p_target);
		assertEQ ( this.mm.params['getValidTarget'], [p_target] );
		assertEQ ( this.lc().m_target, {name:'vtarget'} );
	};
	
	this.test_isSameAlliPlayer = function(){
		var p_target = {type:OBJ_TYPE.NONE};
		this.checker.setTarget(p_target);
		assertEQ ( this.checker.isSameAlliPlayer(), false );
		
		p_target = {type:OBJ_TYPE.ROLE};
		this.checker.setTarget(p_target);
		assertEQ ( this.checker.isSameAlliPlayer(), false );
		
		this.g.getImgr().getRoleRes().alliance.uid = 0;
		p_target = {type:OBJ_TYPE.ROLE, alliance:{uid:0}};
		this.checker.setTarget(p_target);
		assertEQ ( this.checker.isSameAlliPlayer(), false );
		
		this.g.getImgr().getRoleRes().alliance.uid = 1;
		p_target = {type:OBJ_TYPE.ROLE, alliance:{uid:2}};
		this.checker.setTarget(p_target);
		assertEQ ( this.checker.isSameAlliPlayer(), false );
		
		this.g.getImgr().getRoleRes().alliance.uid = 1;
		p_target = {type:OBJ_TYPE.ROLE, alliance:{uid:1}};
		this.checker.setTarget(p_target);
		assertEQ ( this.checker.isSameAlliPlayer(), true );
	};
	
	this.test_isSelfFieldTarget = function(){
		var p_target = {type:OBJ_TYPE.NONE};
		this.checker.setTarget(p_target);
		assertEQ ( this.checker.isSelfFieldTarget(), false );
		
		p_target = {type:OBJ_TYPE.FIELD, id:1};
		this.checker.setTarget(p_target);
		assertEQ ( this.checker.isSelfFieldTarget(), false );
		
		p_target = {type:OBJ_TYPE.FIELD, id:1};
		this.g.getImgr().getSelfFields().list.push({id:1});
		this.checker.setTarget(p_target);
		assertEQ ( this.checker.isSelfFieldTarget(), true );
	};
	
	this.test_isOtherPlayer = function(){
		var r_isSameAlliPlayer = [false];
		this.mm.mock(this.checker, 'isSameAlliPlayer', r_isSameAlliPlayer );
		
		var p_target = {type:OBJ_TYPE.NONE};
		this.checker.setTarget(p_target);
		assertEQ ( this.checker.isOtherPlayer(), false );
		
		p_target = {type:OBJ_TYPE.ROLE};
		this.checker.setTarget(p_target);
		assertEQ ( this.checker.isOtherPlayer(), true );
		
		r_isSameAlliPlayer[0] = true;
		assertEQ ( this.checker.isOtherPlayer(), false );
	};
	
	this.test_isOtherFieldTarget = function(){
		var r_isSelfFieldTarget = [false];
		this.mm.mock(this.checker, 'isSelfFieldTarget', r_isSelfFieldTarget );
		
		var p_target = {type:OBJ_TYPE.NONE};
		this.checker.setTarget(p_target);
		assertEQ ( this.checker.isOtherFieldTarget(), false );
		
		p_target = {type:OBJ_TYPE.FIELD};
		this.checker.setTarget(p_target);
		assertEQ ( this.checker.isOtherFieldTarget(), true );
		
		r_isSelfFieldTarget[0] = true;
		assertEQ ( this.checker.isOtherFieldTarget(), false );
	};
	
	this.test_isCopyFieldTarget = function(){
		var p_target = {type:OBJ_TYPE.NONE};
		this.checker.setTarget(p_target);
		assertEQ ( this.checker.isCopyFieldTarget(), false );
		
		p_target = {type:OBJ_TYPE.COPYFIELD};
		this.checker.setTarget(p_target);
		assertEQ ( this.checker.isCopyFieldTarget(), true );
	};
	
	this.test__isPlayerTarget = function(){
		var p_target = {type:OBJ_TYPE.NONE};
		this.checker.setTarget(p_target);
		assertEQ ( this.lc()._isPlayerTarget(), false );
		
		p_target = {type:OBJ_TYPE.ROLE};
		this.checker.setTarget(p_target);
		assertEQ ( this.lc()._isPlayerTarget(), true );
	};

	this.test__isFieldTarget = function(){
		var p_target = {type:OBJ_TYPE.NONE};
		this.checker.setTarget(p_target);
		assertEQ ( this.lc()._isFieldTarget(), false );
		
		p_target = {type:OBJ_TYPE.FIELD};
		this.checker.setTarget(p_target);
		assertEQ ( this.lc()._isFieldTarget(), true );	
	};
});

tqExpeditionDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseExpedTargetSpec, 'TestCaseExpedTargetSpec');
	suite.addTestCase(TestCaseExpeditionDlg, 'TestCaseExpeditionDlg');
	suite.addTestCase(TestCaseOhterFieldTargetHdr, 'TestCaseOhterFieldTargetHdr');
	suite.addTestCase(TestCaseExpedLineupInfoHdr, 'TestCaseExpedLineupInfoHdr');
	suite.addTestCase(TestCaseExpedMyFightCapRefresher, 'TestCaseExpedMyFightCapRefresher');
	suite.addTestCase(TestCaseExpedForceTabHdr, 'TestCaseExpedForceTabHdr');
	suite.addTestCase(TestExpedForceTabHdr_bak, 'TestExpedForceTabHdr_bak');
	suite.addTestCase(TestExpedDefaultTeamHdr, 'TestExpedDefaultTeamHdr');
	suite.addTestCase(TestCaseSendExpeditionCmd, 'TestCaseSendExpeditionCmd');
	suite.addTestCase(TestCaseDropDesc, 'TestCaseDropDesc');
	suite.addTestCase(TestCaseExpedTargetChecker, 'TestCaseExpedTargetChecker');
	suite.addTestCase(TestCaseSameAlliPlayerTargetHdr, 'TestCaseSameAlliPlayerTargetHdr');
};