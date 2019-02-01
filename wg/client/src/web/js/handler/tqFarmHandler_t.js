////////////////////////////////////////////////////////////////////////////////////////////////
require('./tqHandlerMgr.js');
requireEx('./handler/tqFarmHandler.js', [
	{
		start:'//FarmPresenter-testunit-start'
		,end:'//FarmPresenter-testunit-end'
		,items:['m_model'
			,'m_view'
			,'_onClickMyFarm'
			,'_getFarmFromSvr'
			,'_regClickCaller'
			,'_onClickFarmRefresh'
			,'_onClickBlock'
			,'_blockIdFromIdx'
			,'_handleSelStateClickBlock'
			,'_handleInputStateClickBlock'
			,'_handleInitStateClickBlock'
			,'_handlePreGetStateClickBlock'
			,'_handleGetStateClickBlock'
			]
	}
	,{
		start:'//FarmBuildBlock-testunit-start'
		,end:'//FarmBuildBlock-testunit-end'
		,items:['m_canGatherDom'
			,'m_protectDom'
			,'m_dom'
			,'m_commobj'
			,'m_item'
			,'_onProtectStop'
			,'_createCanGatherDom'
			,'_setItem'
			,'_setCanGatherVisible'
			,'_setProtectDomVisible'
			]
	}
	,{
		start:'//FarmModel-testunit-start'
		,end:'//FarmModel-testunit-end'
		,items:['m_g'
			,'m_curfarm'
			,'_handleFarmData'
			,'_resetFarmBlocksByCityLevel'
			,'_resetSelCityToolFarmBtnState'
			,'_resetFarmEmptyBlocksByCityLevel'
			,'_resetFarmNextBlocksByCityLevel'
			,'_clearBlocksWhenChangeRole'
			]
	}
	,{
		start:'//FarmView-testunit-start'
		,end:'//FarmView-testunit-end'
		,items:['m_g'
			,'C_MAINTOOLBAR_W'
			,'C_MAINBTNBAR_H'
			,'C_MAINTOOLBAR_H'
			,'C_SECTOOLBAR_W'
			,'C_SECTOOLBAR_H'
			]
	}
]);

TestCaseFarmBuildBlock = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.block = new FarmBuildBlock(this.g, MockDomEx.snew('div'), 'rect');
		this.lc = this.block.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_clear= function(){
		this.mm.mock(this.lc().m_commobj, 'setItem');
		this.mm.mock(this.g, 'unregUpdater');
		this.block.clear();
		assertEQ ( this.mm.walkLog, 'setItem,unregUpdater' );
		assertEQ ( this.mm.params['setItem'], [null] );
		assertEQ ( this.mm.params['unregUpdater'], [this.block, this.lc()._onProtectStop] );
	};
	
	this.test_setItem = function(){
		this.mm.mock(this.lc(), '_setItem' );
		this.mm.mock(this.lc().m_commobj, 'setItem' );
		this.mm.mock(this.block, 'normal' );
		this.mm.mock(this.lc(), '_setCanGatherVisible' );
		this.mm.mock(this.lc(), '_setProtectDomVisible' );
		
		var p_item = {name:'item'};
		this.block.setItem(p_item);
		assertEQ ( this.mm.walkLog, '_setItem,setItem,normal,_setCanGatherVisible,_setProtectDomVisible' );
		assertEQ ( this.mm.params['_setItem'], [p_item] );
		assertEQ ( this.mm.params['setItem'], [p_item] );
	};
	
	this.test_hide = function(){
		this.mm.mock(this.lc().m_commobj, 'hide');
		this.mm.mock(this.g, 'unregUpdater');
		this.mm.mock(TQ, 'setCSS');
		this.block.hide();
		assertEQ ( this.mm.walkLog, 'hide,setCSS,setCSS,unregUpdater' );
		assertEQ ( this.mm.params['setCSS.0'], [this.lc().m_canGatherDom, 'visibility', 'hidden'] );
		assertEQ ( this.mm.params['setCSS.1'], [this.lc().m_protectDom, 'visibility', 'hidden'] );
		assertEQ ( this.mm.params['unregUpdater'], [this.block, this.lc()._onProtectStop] );
	};
	
	this.test__setItem = function(){
		var p_item = {name:'item'};
		this.lc()._setItem(p_item);
		assertEQ ( this.lc().m_item, p_item);
	};
		
	this.test__createCanGatherDom = function(){
		var r_dom = MockDomEx.snew('div');
		this.mm.mock(TQ, 'createDom', [r_dom] );
		this.mm.mock(TQ, 'append' );
		this.mm.mock(TQ, 'setClass' );
		this.lc()._createCanGatherDom();
		assertEQ ( this.mm.walkLog, 'createDom,append,setClass' );
		assertEQ ( this.mm.params['createDom'], ['div'] );
		assertEQ ( this.mm.params['append'], [this.lc().m_dom, r_dom] );
		assertEQ ( this.mm.params['setClass'], [this.lc().m_canGatherDom, 'farmblockcangather'] );
		assertEQ ( this.lc().m_canGatherDom, r_dom );
	};
	
	this.test__setCanGatherVisible = function(){
		this.mm.mock(TQ, 'setCSS');
		
		this.lc().m_item = null;
		this.lc()._setCanGatherVisible();
		assertEQ ( this.mm.params['setCSS'], [this.lc().m_canGatherDom, 'visibility', 'hidden'] );
		
		this.lc().m_item = {canGather:0};
		this.lc()._setCanGatherVisible();
		assertEQ ( this.mm.params['setCSS'], [this.lc().m_canGatherDom, 'visibility', 'hidden'] );
		
		this.lc().m_item = {canGather:1};
		this.lc()._setCanGatherVisible();
		assertEQ ( this.mm.params['setCSS'], [this.lc().m_canGatherDom, 'visibility', 'visible'] );
	};
	
	this.test__setProtectDomVisible = function(){
		this.g.setSvrTimeS(10001);
		this.mm.mock(this.g, 'regUpdater');
		var block = {id:1,resid:100001,level:1,state:2,totalres:1200,canGather:1,leftres:1200,pStopTime:10000,itemres:ItemResUtil.findItemres(100001) };
		this.block.setItem(block);
		assertEQ ( isInclude(this.mm.walkLog, 'regUpdater'), false );
		assertEQ ( TQ.getCSS(this.lc().m_protectDom, 'visibility'), 'hidden' );
			
		block = {id:1,resid:100001,level:1,state:2,totalres:1200,canGather:1,leftres:1200,pStopTime:10002,itemres:ItemResUtil.findItemres(100001) };
		this.block.setItem(block);
		assertEQ ( isInclude(this.mm.walkLog, 'regUpdater'), true );
		assertEQ ( this.mm.params['regUpdater'], [this.block, this.lc()._onProtectStop, (10002 - 10001)*1000, true] );
		assertEQ ( TQ.getCSS(this.lc().m_protectDom, 'visibility'), 'visible' );
	};
	
	this.test__onProtectStop = function(){
		this.g.setSvrTimeS(10001);
		var block = {id:1,resid:100001,level:1,state:2,totalres:1200,canGather:1,leftres:1200,pStopTime:10002,itemres:ItemResUtil.findItemres(100001) };
		this.block.setItem(block);
		
		this.mm.mock(this.g, 'unregUpdater');
		this.g.setSvrTimeS(10003);
		this.g.update();
		assertEQ ( this.mm.params['unregUpdater'], [this.block, this.lc()._onProtectStop] );
		assertEQ ( TQ.getCSS(this.lc().m_protectDom, 'visibility'), 'hidden' );
	};
});

FarmHandlerHelper = Class.extern(function(){
	this.setRoleId = function(uid) {
		g_app.getImgr().getRoleRes().uid = uid;
	};
	
	this.makeEmptyBlockFarmData = function(){
		var svrcmd = {cmd:NETCMD.FARM,farm:{
			role:{resid:100,uid:1,name:"rolename",citylevel:4}
			,blocks:[ {id:1,resid:FIXID.EMPTYFARMBLOCK,level:0,state:0,starttime:0,stoptime:0} ]}};
		return svrcmd;
	};
	
	this.makeNextBlockFarmData = function(){
		var svrcmd = {cmd:NETCMD.FARM,farm:{
			role:{resid:100,uid:1,name:"rolename",citylevel:4}
			,blocks:[ {id:1,resid:FIXID.NEXTFARMBLOCK,level:0,state:0,starttime:0,stoptime:0} ]}};
		return svrcmd;
	};
	
	this.makeGreenBlockFarmData = function(){
		var svrcmd = {cmd:NETCMD.FARM,farm:{
			role:{resid:100,uid:1,name:"rolename",citylevel:4}
			,blocks:[ {id:1,resid:FIXID.FARM,level:1,state:FARM_STATE.SAPLING,totalres:1000,starttime:10,stoptime:110} ]}};
		return svrcmd;
	};
	
	this.makeYellowBlockFarmData = function(){
		var svrcmd = {cmd:NETCMD.FARM,farm:{
			role:{resid:100,uid:1,name:"rolename",citylevel:4}
			,blocks:[ {id:1,resid:FIXID.FARM,level:1,state:FARM_STATE.COMPLETE,totalres:1000,leftres:800} ]}};
		return svrcmd;
	};
	
	this.makeErrorInputData = function(){
		var svrcmd = {cmd:NETCMD.FARM,farminput:{result:-1}};
		return svrcmd;
	};
	
	this.makeFarmResNumberData = function(){
		var svrcmd = {cmd:NETCMD.FARM,farmgets:{nums:[{id:1,num:2000}]}};
		return svrcmd;
	};
	
	this.makeFullBlocksFarmData = function(){
		var svrcmd = {cmd:NETCMD.FARM,farm:{
			role:{resid:100,uid:1,name:"rolename",citylevel:2}
			,blocks:[ 
				{id:1,resid:FIXID.EMPTYFARMBLOCK,level:0,state:0,starttime:0,stoptime:0}
				,{id:2,resid:FIXID.NEXTFARMBLOCK,level:0,state:0,starttime:0,stoptime:0}
				,{id:3,resid:FIXID.FARM,level:1,state:FARM_STATE.SAPLING,totalres:1000,starttime:10,stoptime:110} 
				,{id:4,resid:FIXID.FARM,level:1,state:FARM_STATE.COMPLETE,totalres:1000,leftres:800}
				]}};
		return svrcmd;
	};
}).snew();

TestCaseFarmModel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.svrcmd = FarmHandlerHelper.makeGreenBlockFarmData();
		this.model = FarmModel.snew(g_app);
		this.lc = this.model.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.getEmptyBlockTip = function(isself) {
		var roleid = isself ? 1 : 2;
		FarmHandlerHelper.setRoleId(roleid);
		var emptyblockcmd = FarmHandlerHelper.makeEmptyBlockFarmData();
		this.model.handleFarmSvrData({data:emptyblockcmd});
		return this.model.getBlockTip(1);
	};
	
	this.getNextBlockTip = function(isself, citylevel){
		var roleid = isself ? 1 : 2;
		FarmHandlerHelper.setRoleId(roleid);
		var nextblockcmd = FarmHandlerHelper.makeNextBlockFarmData();
		this.model.handleFarmSvrData({data:nextblockcmd});
		g_app.getImgr().setCityLevel(citylevel);
		return this.model.getBlockTip(1);
	};
	
	this.getGreenBlockTip = function(isself){
		var roleid = isself ? 1 : 2;
		FarmHandlerHelper.setRoleId(roleid);
		var greenblockcmd = FarmHandlerHelper.makeGreenBlockFarmData();
		this.model.handleFarmSvrData({data:greenblockcmd});
		return this.model.getBlockTip(1);
	};
	
	this.getYellowBlockTip = function(isself){
		var roleid = isself ? 1 : 2;
		FarmHandlerHelper.setRoleId(roleid);
		var yellowblockcmd = FarmHandlerHelper.makeYellowBlockFarmData();
		this.model.handleFarmSvrData({data:yellowblockcmd});
		return this.model.getBlockTip(1);
	};
	
	this.testFarmSvrPkg = function() {
		var getevent = 0;
		g_app.regEvent(EVT.FARMINFO, 0, this, function(){ getevent++; } );
		
		var self_roleid = 1;
		FarmHandlerHelper.setRoleId(self_roleid);
		var svrcmd = FarmHandlerHelper.makeGreenBlockFarmData();
		this.model.handleFarmSvrData({data:svrcmd});
		var expectcnt = this.model.getTotalBlockCount() + this.model.getNextBlockCount();
		var curfarm = this.model.getCurFarm();
		assert(curfarm.blocks.length == expectcnt);
		assert(this.model.isMyFarm(curfarm) == true);
		assert(g_app.getImgr().getMyFarm().blocks.length == expectcnt);
		
		var other_roleid = 2;
		FarmHandlerHelper.setRoleId(other_roleid);
		assert(this.model.isMyFarm(curfarm) == false);
		
		assert(getevent == 1, 'must send farminfo event');
	};
	
	this.test__handleFarmData = function(){
		this.lc().m_curfarm = {blocks:[1,2,3]};
		
		var r_isMyFarm = [false];
		this.mm.mock(this.lc(), '_resetFarmBlocksByCityLevel');
		this.mm.mock(this.lc(), '_clearBlocksWhenChangeRole');
		this.mm.mock(TQ, 'dictCopy');
		this.mm.mock(this.lc(), '_resetSelCityToolFarmBtnState');
		this.mm.mock(ItemResUtil, 'initItemsres');
		this.mm.mock(this.model, 'isMyFarm', r_isMyFarm);
		this.mm.mock(this.g, 'sendEvent');
		
		this.lc()._handleFarmData(null);
		assertEQ ( this.mm.walkLog, '' );
		
		var p_netfarm = {blocks:[]};
		this.lc()._handleFarmData(p_netfarm);
		assertEQ ( this.mm.walkLog, '_resetFarmBlocksByCityLevel,_clearBlocksWhenChangeRole,dictCopy,_resetSelCityToolFarmBtnState,initItemsres,isMyFarm,sendEvent' );
		assertEQ ( this.mm.params['_resetFarmBlocksByCityLevel'], [p_netfarm, this.lc().m_curfarm] );
		assertEQ ( this.mm.params['_clearBlocksWhenChangeRole'], [p_netfarm, this.lc().m_curfarm] );
		assertEQ ( this.mm.params['dictCopy'], [this.lc().m_curfarm, p_netfarm] );
		assertEQ ( this.mm.params['initItemsres'], [this.lc().m_curfarm.blocks] );
		assertEQ ( this.mm.params['isMyFarm'], [this.lc().m_curfarm] );
		assertEQ ( this.mm.params['sendEvent'], [{eid:EVT.FARMINFO,sid:0}] );
		
		this.mm.clear();
		r_isMyFarm[0] = true;
		this.lc()._handleFarmData(p_netfarm);
		var expectWalkLog = '_resetFarmBlocksByCityLevel,_clearBlocksWhenChangeRole,dictCopy,_resetSelCityToolFarmBtnState,initItemsres,isMyFarm,_resetFarmBlocksByCityLevel,dictCopy,initItemsres,sendEvent,sendEvent';
		assertEQ ( this.mm.walkLog, expectWalkLog );
		var myfarm = this.g.getImgr().getMyFarm();
		assertEQ ( this.mm.params['_resetFarmBlocksByCityLevel.1'], [p_netfarm, myfarm] );
		assertEQ ( this.mm.params['dictCopy.1'], [myfarm, p_netfarm] );
		assertEQ ( this.mm.params['initItemsres.1'], [myfarm.blocks] );
	};
	
	this.test__resetSelCityToolFarmBtnState = function(){
		var r_show = [false];
		this.mm.mock(UIM.getPanel('farm').getView(), 'isShow', r_show );
		this.mm.mock(UIM.getPanel('main').getSelCityTool(), 'setCurLoadCity');
		this.lc()._resetSelCityToolFarmBtnState();
		assertEQ ( this.mm.walkLog, 'isShow' );
		
		this.mm.clear();
		r_show[0] = true;
		this.lc()._resetSelCityToolFarmBtnState();
		assertEQ ( this.mm.walkLog, 'isShow,setCurLoadCity' );
		assertEQ ( this.mm.params['setCurLoadCity'], [FIXID.FARMMAP] );
	};
	
	this.test_getBlockResInfo_getProcessBlockRes = function(){
		var _getProcessBlockResInfo = function(block) {
			var duration = block.stoptime - block.starttime;
			var lefttime = block.stoptime - g_app.getSvrTimeS();
			if ( lefttime > duration )  lefttime = duration;
			else if ( lefttime < 0 )  lefttime = 0;
			var lapse = duration - lefttime;
			var per = lapse / duration;
			return {lefttime:lefttime, per:per, res:parseInt(per*block.totalres*res_getfarmres_pre, 10),state:block.state};
		};
		var assertResEQ = function(res1, res2) {
			assert( res1.lefttime == res2.lefttime && res1.per == res2.per && res1.res == res2.res && res1.state == res2.state );
		};
		
		g_app.setSvrTimeS(9);
		var self_roleid = 1;
		FarmHandlerHelper.setRoleId(self_roleid);
		var svrcmd = FarmHandlerHelper.makeGreenBlockFarmData();
		this.model.handleFarmSvrData({data:svrcmd});
		var block = this.model.getBlock(1);
		assertResEQ(this.model.getBlockResInfo(block), _getProcessBlockResInfo(block) );
		
		g_app.setSvrTimeS(10);
		assertResEQ(this.model.getBlockResInfo(block), _getProcessBlockResInfo(block) );
		
		g_app.setSvrTimeS(50);
		assertResEQ(this.model.getBlockResInfo(block), _getProcessBlockResInfo(block) );
		
		g_app.setSvrTimeS(110);
		assertResEQ(this.model.getBlockResInfo(block), _getProcessBlockResInfo(block) );
		
		g_app.setSvrTimeS(111);
		assertResEQ(this.model.getBlockResInfo(block), _getProcessBlockResInfo(block) );
	};
	
	this.test_getBlockResInfo_getCompleteBlockRes = function(){
		var self_roleid = 1;
		FarmHandlerHelper.setRoleId(self_roleid);
		var svrcmd = FarmHandlerHelper.makeYellowBlockFarmData();
		this.model.handleFarmSvrData({data:svrcmd});
		var block = this.model.getBlock(1);
		
		var info = this.model.getBlockResInfo(block);
		assert ( info.lefttime == 0 );
		assert ( info.per == 1 );
		assert ( info.res == 800 );
		assert ( info.state == FARM_STATE.COMPLETE );
	};
	
	this.test__resetFarmBlocksByCityLevel = function(){
		this.mm.mock(this.lc(), '_resetFarmEmptyBlocksByCityLevel');
		this.mm.mock(this.lc(), '_resetFarmNextBlocksByCityLevel');
		
		var netfarm = {};
		var farm = {role:{citylevel:1}};
		this.lc()._resetFarmBlocksByCityLevel(netfarm, farm);
		assertEQ ( this.mm.walkLog, '' );
		
		var netfarm = {role:{}};
		this.lc()._resetFarmBlocksByCityLevel(netfarm, farm);
		assertEQ ( this.mm.walkLog, '' );
		
		var netfarm = {role:{citylevel:1}};
		this.lc()._resetFarmBlocksByCityLevel(netfarm, farm);
		assertEQ ( this.mm.walkLog, '' );
		
		var netfarm = {role:{citylevel:2}};
		this.lc()._resetFarmBlocksByCityLevel(netfarm, farm);
		assertEQ ( this.mm.walkLog, '_resetFarmEmptyBlocksByCityLevel,_resetFarmNextBlocksByCityLevel' );
		assertEQ ( this.mm.params['_resetFarmEmptyBlocksByCityLevel'], [farm] );
		assertEQ ( this.mm.params['_resetFarmNextBlocksByCityLevel'], [farm] );
		assertEQ ( farm.role.citylevel, 2 );
	};
	
	this.test__clearBlocksWhenChangeRole = function(){
		var netfarm = {};
		var farm = {role:{uid:1, citylevel:1}, blocks:[{id:1, resid:FIXID.IRONORE, state:1, canGather:1},{id:2, resid:FIXID.NEXTFARMBLOCK, state:0}] };
		this.lc()._clearBlocksWhenChangeRole(netfarm, farm);
		assertEQ ( farm.blocks, [{id:1, resid:FIXID.IRONORE, state:1, canGather:1},{id:2, resid:FIXID.NEXTFARMBLOCK, state:0}] );
		
		netfarm = {role:{}};
		this.lc()._clearBlocksWhenChangeRole(netfarm, farm);
		assertEQ ( farm.blocks, [{id:1, resid:FIXID.IRONORE, state:1, canGather:1},{id:2, resid:FIXID.NEXTFARMBLOCK, state:0}] );
		
		netfarm = {role:{uid:1}};
		this.lc()._clearBlocksWhenChangeRole(netfarm, farm);
		assertEQ ( farm.blocks, [{id:1, resid:FIXID.IRONORE, state:1, canGather:1},{id:2, resid:FIXID.NEXTFARMBLOCK, state:0}] );
		
		netfarm = {role:{uid:2}};
		this.lc()._clearBlocksWhenChangeRole(netfarm, farm);
		assertEQ ( farm.blocks, [{id:1, resid:FIXID.EMPTYFARMBLOCK, state:0, canGather:0},{id:2, resid:FIXID.NEXTFARMBLOCK, state:0}] );
	};
	
	this.testCanGetRes = function(){
		g_app.setSvrTimeS(50);
		var self_roleid = 1;
		FarmHandlerHelper.setRoleId(self_roleid);
		var svrcmd = FarmHandlerHelper.makeGreenBlockFarmData();
		this.model.handleFarmSvrData({data:svrcmd});
		var block = this.model.getBlock(1);
		assert(this.model.getCanGetMyRes(FIXID.IRONORE) == 0);
		assert(this.model.getCanGetMyRes(FIXID.FARM) == 0 );
		
		var svrcmd = FarmHandlerHelper.makeYellowBlockFarmData();
		this.model.handleFarmSvrData({data:svrcmd});
		assert(this.model.getCanGetMyRes(FIXID.FARM) == 800);
	};
	
	this.testInValidBlockTip = function(){
		assert( this.model.getBlockTip(-1) == '' );
	};	
	
	this.testMyEmptyBlockTip = function(){
		var str = this.getEmptyBlockTip(true);
		assert( str == TQ.formatLine(rstr.farm.tips.empty) );
	};
	
	this.testOtherEmptyBlockTip = function(){
		var str = this.getEmptyBlockTip(false);
		assert( str == TQ.formatLine(rstr.farm.tips.otherempty) );
	};
	
	this.testMyNextBlockTip = function(){
		var _getExpectStr = function(citylevel) {
			return TQ.formatLine(TQ.format(rstr.farm.tips.nextlevel, RStrUtil.getCityNameByLevel(citylevel)));
		};
		
		var citylevel = 1;
		var str = this.getNextBlockTip(true, citylevel);
		assert( str == _getExpectStr(citylevel+1) );
		
		citylevel = 2;
		str = this.getNextBlockTip(true, citylevel);
		assert( str == _getExpectStr(citylevel+1) );
	};
	
	this.testOtherNextBlockTip = function(){
		var citylevel = 1;
		var str = this.getNextBlockTip(false, citylevel);
		assert( str == TQ.formatLine(rstr.farm.tips.othernextlevel) );
	};
	
	this.testMyGreenBlockTip = function(){
		var _getExpectStr = function(model, block) {
			var info = model.getBlockResInfo(block);
			return TQ.format(rstr.farm.tips.itemcontinue, 
				block.itemres.outputname,
				TQ.formatTime(2, info.lefttime),
				info.res,
				parseInt(info.per*100, 10) );
		};
		
		g_app.setSvrTimeS(50);
		var str = this.getGreenBlockTip(true)
		var block = this.model.getBlock(1);
		assert(str == _getExpectStr(this.model, block));
	};
	
	this.testOtherGreenBlockTip = function(){
		var _getExpectStr = function(model, block) {
			var info = model.getBlockResInfo(block);
			return TQ.formatLine(TQ.format(rstr.farm.tips.othergreenblock, 
				block.itemres.outputname,
				TQ.formatTime(2, info.lefttime)));
		};
		
		g_app.setSvrTimeS(50);
		assert(this.getGreenBlockTip(false) == _getExpectStr(this.model, this.model.getBlock(1)) );
		
		g_app.setSvrTimeS(110);
		assert(this.getGreenBlockTip(false) == _getExpectStr(this.model, this.model.getBlock(1)) );
	};
	
	this.testMyYellowBlockTip = function(){
		var g_ = this.g;
		var _getExpectStr = function(block) {
			return TQ.format(rstr.farm.tips.itemok, 
				block.itemres.outputname,
				block.leftres,
				block.totalres);
		};
		
		var _getExpectStrEx = function(block) {
			return TQ.format(rstr.farm.tips.itemokex, 
				block.itemres.outputname,
				block.leftres,
				block.totalres,
				TQ.formatTime(2, block.pStopTime - g_.getSvrTimeS())
				);
		};
		
		var str = this.getYellowBlockTip(true);
		var block = this.model.getBlock(1);
		assert(str == _getExpectStr(block) );
		
		this.g.setSvrTimeS(100001);
		block.pStopTime = 100000;
		str = this.getYellowBlockTip(true);
		assert(str == _getExpectStr(block) );
		
		block.pStopTime = 100002;
		str = this.getYellowBlockTip(true);
		assert(str == _getExpectStrEx(block) );
	};		
	
	this.testOtherYellowBlockTip = function(){
		var _getExpectStr = function(block) {
			return TQ.format(rstr.farm.tips.itemok, 
				block.itemres.outputname,
				block.leftres,
				block.totalres);
		};
		var str = this.getYellowBlockTip(false);
		assert(str == _getExpectStr(this.model.getBlock(1)) );
	};
	
	this.testUpdateBlocks = function(){
		var greenblockcmd = FarmHandlerHelper.makeGreenBlockFarmData();
		this.model.handleFarmSvrData({data:greenblockcmd});
		
		g_app.clearSendMsg();
		g_app.setSvrTimeS(50);
		this.model.updateBlocks();
		assert(g_app.getSendMsg() == '');
		
		g_app.clearSendMsg();
		g_app.setSvrTimeS(110);
		this.model.updateBlocks();
		assertInclude(g_app.getSendMsg(), 'ids');
		assertNoInclude(g_app.getSendMsg(), 'undefined');
		
		g_app.clearSendMsg();
		g_app.setSvrTimeS(111);
		this.model.updateBlocks();
		assertInclude(g_app.getSendMsg(), 'ids');
		assertNoInclude(g_app.getSendMsg(), 'undefined');
	};
	
	this.testGetBlockCount = function(){
		var self_roleid = 1;
		FarmHandlerHelper.setRoleId(self_roleid);
		var svrcmd = FarmHandlerHelper.makeGreenBlockFarmData();
		this.model.handleFarmSvrData({data:svrcmd});
		assert(this.model.getBlockCount(FIXID.IRONORE) == 0);
		assert(this.model.getBlockCount(FIXID.FARM) == 1);
	};
	
	this.test_getTotalBlockCount = function(){
		var svrcmd = FarmHandlerHelper.makeGreenBlockFarmData();
		svrcmd.farm.role.citylevel = 4;
		this.model.handleFarmSvrData({data:svrcmd});
		var res =  TQ.qfind(res_citylevelneeds, 'level', 4);
		assert(this.model.getTotalBlockCount() == res.farmBlock );
		
		svrcmd.farm.role.citylevel = 100;
		this.model.handleFarmSvrData({data:svrcmd});
		assert(this.model.getTotalBlockCount() == 0);
	};
	
	this.test_getNextBlockCount = function(){
		var svrcmd = FarmHandlerHelper.makeGreenBlockFarmData();
		svrcmd.farm.role.citylevel = 4;
		this.model.handleFarmSvrData({data:svrcmd});
		var nextCount = TQ.qfind(res_citylevelneeds, 'level', 5).farmBlock - TQ.qfind(res_citylevelneeds, 'level', 4).farmBlock;
		assert(this.model.getNextBlockCount() == nextCount );
		
		svrcmd.farm.role.citylevel = res_max_city_level;
		this.model.handleFarmSvrData({data:svrcmd});
		assert(this.model.getNextBlockCount() == 0);
	};
	
	this.testCurFarmBlocks = function(){
		var svrcmd = FarmHandlerHelper.makeGreenBlockFarmData();
		this.model.handleFarmSvrData({data:svrcmd});
		
		var curfarm = this.model.getCurFarm();
		var totalcnt = this.model.getTotalBlockCount();
		var nextcnt = this.model.getNextBlockCount();
		assert(totalcnt+nextcnt == curfarm.blocks.length)
		var lastlevelcnt = curfarm.blocks.length;
		assert(curfarm.blocks[lastlevelcnt - 1].resid == FIXID.NEXTFARMBLOCK)
		
		svrcmd.farm.role.citylevel = svrcmd.farm.role.citylevel + 1;
		this.model.handleFarmSvrData({data:svrcmd});
		
		var totalcnt = this.model.getTotalBlockCount();
		var nextcnt = this.model.getNextBlockCount();
		assert(totalcnt+nextcnt == curfarm.blocks.length);
		assert(curfarm.blocks[lastlevelcnt - 1].resid == FIXID.EMPTYFARMBLOCK)
		
		svrcmd.farm.role.citylevel = svrcmd.farm.role.citylevel - 1;
		this.model.handleFarmSvrData({data:svrcmd});
		assert(curfarm.blocks[lastlevelcnt - 1].resid == FIXID.NEXTFARMBLOCK)
		
	};
	

});

TestCaseFarmPresenter = TestCase.extern(function(){
	this.setUp = function() {
		TestCaseHelper.setUp(this);
		
		g_app.clearRegEvent();
		g_app.getGUI().clearCursors();
		UIM.clearPanels();
		UIM.regDlg('selpip', new SelPipDlg(g_app));
		UIM.forceRegPanel('main', new MainPanel(g_app));
		UIM.forceRegPanel('sysmsg', new function() { this.append = function() {} } );
		
		this.presenter = UIM.getPanel('farm');
		this.view = UIM.getPanel('farm').getView();
		this.model = UIM.getPanel('farm').getModel();
		this.lc = this.presenter.lc;
		
		var self_roleid = 1;
		FarmHandlerHelper.setRoleId(self_roleid);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.setActive = function(){
		this.mm.mock(this.view, 'setActive');
		this.presenter.setActive(true);
		assertEQ ( this.mm.params['setActive'], [true] );
	};
	
	this.testOpState = function(){
		assert(this.model.getOpState() == FARMOP_STATE.SEL);
		this.model.setOpState(FARMOP_STATE.INPUT);
		assert(this.model.getOpState() == FARMOP_STATE.INPUT);
	};
	
	this.testFarmSvrPkg = function(){
		var svrcmd = FarmHandlerHelper.makeGreenBlockFarmData();
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.FARM, data:svrcmd});
		assert(this.model.getCurFarm().blocks.length > 0);
	};
	
	this.testInputErrorResultSvrPkg = function(){
		var getevent = 0;
		g_app.regEvent(EVT.FARMINFO, 1, this, function(){ getevent++; } );
		var svrcmd = FarmHandlerHelper.makeErrorInputData();
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.FARM, data:svrcmd});
		assert(getevent == 1);
	};
	
	this.testGetFarmResNumberSvrPkg = function() {
		var svrcmd = FarmHandlerHelper.makeFarmResNumberData();
		var gnums = null;
		this.view.popGetResNum = function(nums) {
			gnums = nums;
		};
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.FARM, data:svrcmd});
		assert(gnums != null);
		assert(gnums.length == 1);
	};
	
	this.testFarmInfoEvent = function(){
		g_app.sendEvent({eid:EVT.FARMINFO, sid:0}); //call default refreshFarm
	
		var getevent = 0;
		this.view.refreshFarm = function() {
			getevent++;
		};
		g_app.sendEvent({eid:EVT.FARMINFO, sid:0});
		assert(getevent == 1);
	};
	
	this.testCancelInputEvent = function(){
		this.model.setOpState(FARMOP_STATE.INPUT);
		g_app.sendEvent({eid:EVT.FARMINFO, sid:1, result:-1});
		assert(this.model.getOpState() == FARMOP_STATE.SEL);
	};
	
	this.testRoleBaseInfoEvent = function(){
		g_app.sendEvent({eid:EVT.ROLEBASE,sid:0});
		
		var callcnt = 0;
		this.view.refreshTitle = function() {
			callcnt++;
		};
		g_app.sendEvent({eid:EVT.ROLEBASE,sid:0});
		assert(callcnt == 1);
	};
	
	this.testMyFarmBtnClick = function(){
		this.mm.mock(FarmSender, 'sendGetFarm');
		this.view.getCtrl('myfarmbtn').click();
		assertEQ ( this.mm.walkLog, 'sendGetFarm' );
	};
	
	this.testFarmInfoBtnClick = function(){
		UIM.regDlg('farminfo', MockDialog.snew(g_app));
		this.view.getCtrl('farminfobtn').click();
		assert(UIM.getDlg('farminfo').isShow() == true);
	};
	
	this.testFarmRuleBtnClick = function(){
		UIM.regDlg('minihelp', MockDialog.snew(g_app));
		this.view.getCtrl('farmrulebtn').click();
		assert(UIM.getDlg('minihelp').isShow() == true);
	};
	
	this.testOpSelBtnClick = function(){
		this.model.setOpState(FARMOP_STATE.INPUT);
		this.view.getCtrl('opsel').click();
		assert(this.model.getOpState() == FARMOP_STATE.SEL);
	};
	
	this.testOpInputBtnClick = function(){
		this.view.getCtrl('opinput').click();
		assert(UIM.getDlg('selpip').isShow() == true);
		
		this.view.getCtrl('opinput').click();
		assert(UIM.getDlg('selpip').isShow() == false, 'toggle the dlg hide');
	};
	
	this.testOpInitBtnClick = function(){
		this.model.setOpState(FARMOP_STATE.SEL);
		this.view.getCtrl('opinit').click();
		assert(this.model.getOpState() == FARMOP_STATE.INIT);
	};
	
	this.testOpGetBtnClick = function(){
		this.model.setOpState(FARMOP_STATE.SEL);
		this.view.getCtrl('opget').click();
		assert(this.model.getOpState() == FARMOP_STATE.GET);
	};
	
	this.testOpPreGetBtnClick = function(){
		this.model.setOpState(FARMOP_STATE.SEL);
		this.view.getCtrl('oppre').click();
		assert(this.model.getOpState() == FARMOP_STATE.PREGET);
	};
	
	this.testOpGetAllBtnClick = function(){
		g_app.clearSendMsg();
		this.view.getCtrl('opall').click();
		assertInclude(g_app.getSendMsg(), 'roleId=-1');
		assertNoInclude(g_app.getSendMsg(), 'undefined');
	};
	
	this.testOpGetOtherBtnClick = function(){
		this.model.setOpState(FARMOP_STATE.SEL);
		this.view.getCtrl('opgetother').click();
		assert(this.model.getOpState() == FARMOP_STATE.GET);
	};
	
	this.testOpGetAllOtherBtnClick = function(){
		g_app.clearSendMsg();
		this.view.getCtrl('opallother').click();
		assertInclude(g_app.getSendMsg(), 'roleId=-1');
		assertNoInclude(g_app.getSendMsg(), 'undefined');
	};
	
	this.testSelectPipClickEvent = function(){
		this.model.setPipResid(0);
		assert(this.model.getPipResid() == 0);
		
		this.view.getCtrl('opinput').click();
		UIM.getDlg('selpip').click(10);
		assert(this.model.getOpState() == FARMOP_STATE.INPUT);
		assert(this.model.getPipResid() > 0);
	};
	
	this.testStateCursors = function() {
		this.model.setOpState(FARMOP_STATE.SEL);
		assert(g_app.getGUI().getCursor() == 'farm_sel');
		
		this.model.setOpState(FARMOP_STATE.INIT);
		assert(g_app.getGUI().getCursor() == 'farm_init');
		
		this.model.setOpState(FARMOP_STATE.GET);
		assert(g_app.getGUI().getCursor() == 'farm_get');
		
		this.model.setOpState(FARMOP_STATE.PREGET);
		assert(g_app.getGUI().getCursor() == 'farm_preget');
		
		for ( var i=FIXID.PIPSTART; i <= FIXID.PIPEND; ++i ) {
			this.model.setPipResid(i);
			this.model.setOpState(FARMOP_STATE.INPUT);
			assert(g_app.getGUI().getCursor() == 'farm_pip_'+i);
		}
	};	
	
	this.testStateSelBLinkBtn = function(){
		/*
		var selopblink = this.view.getCtrl('selopblink');
		this.model.setOpState(FARMOP_STATE.SEL);
		assert(selopblink.isStart() == false);
		
		this.model.setOpState(FARMOP_STATE.GET);
		assert(selopblink.isStart() == true);
		
		this.model.setOpState(FARMOP_STATE.SEL);
		assert(selopblink.isStart() == false);
		*/
	};
	
	this.test__onClickBlock = function(){
		var r_block = [null];
		var r_isDragged = [true];
		var r_getOpState = [FARMOP_STATE.SEL];
		this.mm.mock(this.lc().m_model, 'getBlock', r_block);
		this.mm.mock(this.lc().m_view, 'isDragged', r_isDragged);
		this.mm.mock(this.lc().m_model, 'getOpState', r_getOpState);
		this.mm.mock(this.lc(), '_handleSelStateClickBlock');
		this.mm.mock(this.lc(), '_handleInputStateClickBlock');
		this.mm.mock(this.lc(), '_handleInitStateClickBlock');
		this.mm.mock(this.lc(), '_handlePreGetStateClickBlock');
		this.mm.mock(this.lc(), '_handleGetStateClickBlock');
		
		var p_event = {name:'event'};
		var p_idx = 1;
		this.lc()._onClickBlock(p_event, p_idx);
		assertEQ ( this.mm.walkLog, 'getBlock');
		assertEQ ( this.mm.params['getBlock'], [2]);
		
		this.mm.clear();
		r_block[0] = {resid:FIXID.NEXTFARMBLOCK};
		this.lc()._onClickBlock(p_event, p_idx);
		assertEQ ( this.mm.walkLog, 'getBlock');
		
		this.mm.clear();
		r_block[0] = {resid:FIXID.EMPTYFARMBLOCK};
		this.lc()._onClickBlock(p_event, p_idx);
		assertEQ ( this.mm.walkLog, 'getBlock,isDragged');
		assertEQ ( this.mm.params['isDragged'], [p_event]);
		
		this.mm.clear();
		r_isDragged[0] = false;
		r_getOpState[0] = FARMOP_STATE.SEL;
		this.lc()._onClickBlock(p_event, p_idx);
		assertEQ ( this.mm.walkLog, 'getBlock,isDragged,getOpState,_handleSelStateClickBlock');
		assertEQ ( this.mm.params['_handleSelStateClickBlock'], [r_block[0]]);
		
		this.mm.clear();
		r_getOpState[0] = FARMOP_STATE.INPUT;
		this.lc()._onClickBlock(p_event, p_idx);
		assertEQ ( this.mm.walkLog, 'getBlock,isDragged,getOpState,_handleInputStateClickBlock');
		assertEQ ( this.mm.params['_handleInputStateClickBlock'], [r_block[0]]);
		
		this.mm.clear();
		r_getOpState[0] = FARMOP_STATE.INIT;
		this.lc()._onClickBlock(p_event, p_idx);
		assertEQ ( this.mm.walkLog, 'getBlock,isDragged,getOpState,_handleInitStateClickBlock');
		assertEQ ( this.mm.params['_handleInitStateClickBlock'], [r_block[0]]);
		
		this.mm.clear();
		r_getOpState[0] = FARMOP_STATE.PREGET;
		this.lc()._onClickBlock(p_event, p_idx);
		assertEQ ( this.mm.walkLog, 'getBlock,isDragged,getOpState,_handlePreGetStateClickBlock');
		assertEQ ( this.mm.params['_handlePreGetStateClickBlock'], [r_block[0]]);

		this.mm.clear();
		r_getOpState[0] = FARMOP_STATE.GET;
		this.lc()._onClickBlock(p_event, p_idx);
		assertEQ ( this.mm.walkLog, 'getBlock,isDragged,getOpState,_handleGetStateClickBlock');
		assertEQ ( this.mm.params['_handleGetStateClickBlock'], [r_block[0]]);
	};
	
	this.testClickBlock = function(){
		var _this = this;
		var _isClickBlockNoSendCmd = function(opstate, blockidx) {
			g_app.clearSendMsg();
			_this.model.setOpState(opstate);
			_this.view.getCtrl('buildblocks').click(blockidx);
			return (g_app.getSendMsg() == '');
		};
		
		var _isClickBlockSendCmd = function(opstate, blockidx){
			g_app.clearSendMsg();
			_this.model.setOpState(opstate);
			_this.view.getCtrl('buildblocks').click(blockidx);
			return (g_app.getSendMsg() != '' && g_app.getSendMsg().indexOf('undefined') < 0 );
		};
		
		var invalid_block_idx = -1;
		var empty_block_idx = 0;
		var next_block_idx = 1;
		var green_block_idx = 2;
		var yellow_block_idx = 3;
		
		// my self farm
		var self_roleid = 1;
		FarmHandlerHelper.setRoleId(self_roleid);
		var svrcmd = FarmHandlerHelper.makeFullBlocksFarmData();
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.FARM, data:svrcmd});
		//--
		this.view.getCtrl('buildblocks').click(invalid_block_idx);
		//--
		this.model.setOpState(FARMOP_STATE.SEL);
		assert(UIM.getDlg('selpip').isShow() == false);
		this.view.getCtrl('buildblocks').click(empty_block_idx);
		assert(UIM.getDlg('selpip').isShow() == true);
		
		UIM.getDlg('selpip').closeDlg();
		this.view.getCtrl('buildblocks').click(next_block_idx);
		this.view.getCtrl('buildblocks').click(green_block_idx);
		this.view.getCtrl('buildblocks').click(yellow_block_idx);
		assert(UIM.getDlg('selpip').isShow() == false);
		//--
		assert(_isClickBlockSendCmd(FARMOP_STATE.INPUT, empty_block_idx));
		assert(_isClickBlockNoSendCmd(FARMOP_STATE.INPUT, next_block_idx));
		assert(_isClickBlockNoSendCmd(FARMOP_STATE.INPUT, green_block_idx));
		assert(_isClickBlockNoSendCmd(FARMOP_STATE.INPUT, yellow_block_idx));
		//--
		assert(_isClickBlockNoSendCmd(FARMOP_STATE.INIT, empty_block_idx));
		assert(_isClickBlockNoSendCmd(FARMOP_STATE.INIT, next_block_idx));
		assert(_isClickBlockSendCmd(FARMOP_STATE.INIT, green_block_idx));
		assert(_isClickBlockSendCmd(FARMOP_STATE.INIT, yellow_block_idx));
		//--
		assert(_isClickBlockNoSendCmd(FARMOP_STATE.PREGET, empty_block_idx));
		assert(_isClickBlockNoSendCmd(FARMOP_STATE.PREGET, next_block_idx));
		assert(_isClickBlockSendCmd(FARMOP_STATE.PREGET, green_block_idx));
		assert(_isClickBlockSendCmd(FARMOP_STATE.PREGET, yellow_block_idx));
		//--
		assert(_isClickBlockNoSendCmd(FARMOP_STATE.GET, empty_block_idx));
		assert(_isClickBlockNoSendCmd(FARMOP_STATE.GET, next_block_idx));
		assert(_isClickBlockNoSendCmd(FARMOP_STATE.GET, green_block_idx));
		assert(_isClickBlockSendCmd(FARMOP_STATE.GET, yellow_block_idx));

		// other farm
		var other_roleid = 2;
		FarmHandlerHelper.setRoleId(other_roleid);
		assert(_isClickBlockNoSendCmd(FARMOP_STATE.GET, empty_block_idx));
		assert(_isClickBlockNoSendCmd(FARMOP_STATE.GET, next_block_idx));
		assert(_isClickBlockNoSendCmd(FARMOP_STATE.GET, green_block_idx));
		assert(_isClickBlockSendCmd(FARMOP_STATE.GET, yellow_block_idx));
	};
	
	this.testGetBlockTooltip = function(){
		var testtip = 'hello';
		var get_blockid = -1;
		this.model.getBlockTip = function(blockid) {
			get_blockid = blockid;
			return testtip;
		};
		var block_idx = 0;
		assert(this.view.getCtrl('buildblocks').getTip(block_idx), testtip);
		assert(get_blockid == 1);
	};
	
	this.testOnUpdater = function(){
		this.mm.mock(this.presenter.lc(), '_getFarmFromSvr');
		var updatecnt = 0;
		this.view.getCtrl('buildblocks').updateTip = function(){
			updatecnt++;
		};
		
		this.presenter.open(1001);
		assertEQ( this.mm.walkLog, '_getFarmFromSvr' );
		assertEQ( this.mm.params['_getFarmFromSvr'], [1001] );
		g_app.setCurTimeMs(10000);
		g_app.update();
		assertEQ(updatecnt, 1);
		
		updatecnt = 0;
		this.presenter.hide();
		g_app.setCurTimeMs(20000);
		g_app.update();
		assertEQ(updatecnt, 0);
	};
	
	this.testBlocksShowState = function(){
		var _update = function(servertime) {
			g_app.setSvrTimeS(servertime);
			g_app.setCurTimeMs(servertime*1000);
			g_app.update();
		};
		
		var svrcmd = FarmHandlerHelper.makeGreenBlockFarmData();
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.FARM, data:svrcmd});
		
		this.presenter.open();
		
		var servertime = 40;
		_update(servertime);
		var block = this.view.getCtrl('buildblocks').getBlock(0);
		assert(block.getItem().state == 0);
		
		servertime = 60;
		_update(servertime);
		assert(block.getItem().state == 1, 'servertime in the center of starttime and stoptime, state is changed');
	};
	
	this.test__onClickMyFarm = function(){
		this.mm.mock(this.g.getImgr(), 'getRoleId', [10000]);
		this.mm.mock(this.presenter.lc(), '_getFarmFromSvr');
		this.presenter.lc()._onClickMyFarm();
		assertEQ ( this.mm.params['_getFarmFromSvr'], [10000] );
	};
	
	this.test__getFarmFromSvr = function(){
		this.mm.mock(FarmSender, 'sendGetFarm');
		this.mm.mock(this.g.getImgr(), 'getRoleId', [10000]);
		this.mm.mock(this.presenter.lc().m_model, 'getCurFarm', [{role:{uid:10000}, ver:1}]);
		this.presenter.lc()._getFarmFromSvr();
		assertEQ ( this.mm.params['sendGetFarm'], [1, 10000] );
		
		this.presenter.lc()._getFarmFromSvr(20000);
		assertEQ ( this.mm.params['sendGetFarm'], [-1, 20000] );
	};
	
	this.test__regClickCaller = function(){
		this.mm.mock( this.view.getCtrl('farmrefreshbtn'), 'setCaller' );
		this.presenter.lc()._regClickCaller();
		assertEQ ( this.mm.walkLog, 'setCaller' );
		assertEQ ( this.mm.params['setCaller'], [{self:this.presenter, caller:this.presenter.lc()._onClickFarmRefresh}] );
	};
	
	this.test__onClickFarmRefresh = function(){
		this.mm.mock ( this.presenter.lc().m_model, 'getCurFarm', [{role:{uid:10000}}] );
		this.mm.mock ( this.presenter.lc(), '_getFarmFromSvr' );
		this.presenter.lc()._onClickFarmRefresh();
		assertEQ ( this.mm.walkLog, 'getCurFarm,_getFarmFromSvr' );
		assertEQ ( this.mm.params['_getFarmFromSvr'], [10000] );
	};
});

TestCaseFarmView = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.mm.nologMock( this.g.getWinSizer(), 'getValidClientSize', [{cx:1000, cy:600}] );
		this.g.clearRegEvent();
		this.g.getGUI().clearCursors();
		UIM.clearPanels();
		if (!UIM.getPanel('main')) UIM.regPanel('main', new MainPanel(this.g));
		UIM.regDlg('selpip', new SelPipDlg(this.g));
		
		this.presenter = UIM.getPanel('farm');
		this.view = UIM.getPanel('farm').getView();
		this.model = UIM.getPanel('farm').getModel();
		this.lc = this.view.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.testHasCtrls = function(){
		assert( this.view.getCtrl('myfarmbtn') );
		assert( this.view.getCtrl('farminfobtn') );
		assert( this.view.getCtrl('farmrulebtn') );
		
		assert( this.view.getCtrl('opsel') );
		assert( this.view.getCtrl('opinput') );
		assert( this.view.getCtrl('opinit') );
		assert( this.view.getCtrl('opget') );
		assert( this.view.getCtrl('oppre') );
		assert( this.view.getCtrl('opall') );
		assert( this.view.getCtrl('opgetother') );
		assert( this.view.getCtrl('opallother') );
		
		assert( this.view.getCtrl('buildblocks') );
		
		assert( this.view.getCtrl('mousemap') );
		assert( this.view.getCtrl('mapscene') );
		assert( this.view.getCtrl('gamemap') );
	};
	
	this.testSetResTagIcon = function(){
		assertInclude(IMG.getBKImage(this.view.getCtrl('foodtag')), 'image');
		assertInclude(IMG.getBKImage(this.view.getCtrl('woodtag')), 'image');
		assertInclude(IMG.getBKImage(this.view.getCtrl('stonetag')), 'image');
		assertInclude(IMG.getBKImage(this.view.getCtrl('irontag')), 'image');
	};
	
	this.testOpen = function(){
		this.view.open();
	};
	
	this.testHide = function(){
		this.view.hide();
	};
	
	this.testBlockCounts = function(){
		this.view.open();
		
		var self_roleid = 1;
		FarmHandlerHelper.setRoleId(self_roleid);
		var svrcmd = FarmHandlerHelper.makeFullBlocksFarmData();
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.FARM, data:svrcmd});
		var cnt =  this.model.getTotalBlockCount() + this.model.getNextBlockCount();
		assert( this.view.getCtrl('buildblocks').getShowBlocks() == cnt );
		
		svrcmd.farm.role.citylevel = svrcmd.farm.role.citylevel + 1;
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.FARM, data:svrcmd});
		var cnt =  this.model.getTotalBlockCount() + this.model.getNextBlockCount();
		assert( this.view.getCtrl('buildblocks').getShowBlocks() == cnt );
		
		svrcmd.farm.role.citylevel = svrcmd.farm.role.citylevel - 1;
		g_app.sendEvent({eid:EVT.NET, sid:NETCMD.FARM, data:svrcmd});
		var cnt =  this.model.getTotalBlockCount() + this.model.getNextBlockCount();
		assert( this.view.getCtrl('buildblocks').getShowBlocks() == cnt );
	};
	
	this.test_getMainToolBarSize = function(){
		assertEQ ( this.view.getMainToolBarSize(), {cx:this.lc().C_MAINTOOLBAR_W, cy:this.lc().C_MAINTOOLBAR_H} );
	};

	this.test_getSecToolBarSize = function(){
		assertEQ ( this.view.getSecToolBarSize(), {cx:this.lc().C_SECTOOLBAR_W, cy:this.lc().C_SECTOOLBAR_H} );
	};
	
	this.test_setMainToolBarPos = function(){
		this.mm.mock(TQ, 'setDomPos');
		this.view.setMainToolBarPos({x:1, y:2});
		assertEQ ( this.mm.params['setDomPos.0'], [this.view.items.opbtnbar, 1, 2] );
		assertEQ ( this.mm.params['setDomPos.1'], [this.view.items.roleinfobar, 1, 2+(50 - 18)] );
	};
	
	this.test_setSecToolBarPos = function(){
		this.mm.mock(TQ, 'setDomPos');
		this.view.setSecToolBarPos({x:1, y:2});
		assertEQ ( this.mm.params['setDomPos'], [this.view.items.infohelpbar, 1, 2] );
	};
	
	this.test_setViewportWhenFirstOpen = function(){
		this.presenter.open();
		var center = {x:995, y:690};
		var x = Math.max(0, (center.x - 1000/2));
		var y = Math.max(0, (center.y - 600/2));		
		assertEQ ( this.view.getLastViewport(), {x:x, y:y} );
		
		this.view.setLastViewport({x:0, y:0})
		this.presenter.open();
		assertEQ ( this.view.getLastViewport(), {x:0, y:0} );
	};
});


tqFarmHandler_t_main = function(suite) {
	suite.addTestCase(TestCaseFarmBuildBlock,'TestCaseFarmBuildBlock');
	suite.addTestCase(TestCaseFarmModel,'TestCaseFarmModel');
	suite.addTestCase(TestCaseFarmPresenter, 'TestCaseFarmPresenter');
	suite.addTestCase(TestCaseFarmView, 'TestCaseFarmView');
};