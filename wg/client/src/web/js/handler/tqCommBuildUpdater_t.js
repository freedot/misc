/*******************************************************************************/
requireEx('./handler/tqCommBuildUpdater.js', [
	{
		start:'//CommBuildUpdater-unittest-start'
		,end:'//CommBuildUpdater-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_info'
			,'m_list'
			,'m_rlist'
			,'m_rgroupList'
			,'_updateListByResList'
			,'_updateListByGroupResList'
			,'_updateOneList'
			,'_getGroupResListItemCount'
			,'_combineResIdx'
			,'_setItemCon'
			,'_onSpeedBtn'
			,'_onCancelBtn'
			,'_getResItemByCombineResIdx'
			,'_getSetterByLableName'
			,'_setItemIcon'
			,'_checkSendStopCmd'
			,'_setItemName'			
			,'_setItemState'			
			,'_setItemLevelState'			
			,'_setItemNumber'			
			,'_setItemLefttime'			
			,'_setItemCurLevel'			
			,'_setItemGoalLevel'			
			,'_setItemOp'			
			,'_sendStopCmdToSvr'			
			,'_getGoalLevel'			
			,'_getListGroupIdx'			
			,'_getItemIdxInList'			
		]
	}
]);

TestCaseCommBuildUpdater = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.info = {list:{name:'list'},rlist:{name:'rlist'},rgroupList:{name:'rgroupList'}};
		this.upd = CommBuildUpdater.snew(this.g, this.info);
		this.lc = this.upd.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.lc().m_g, this.g );
		assertEQ ( this.lc().m_this, this.upd );
		assertEQ ( this.lc().m_info, this.info );
		assertEQ ( this.lc().m_list, this.info.list );
		assertEQ ( this.lc().m_rlist, this.info.rlist );
		assertEQ ( this.lc().m_rgroupList, this.info.rgroupList );
	};
	
	this.test_update = function(){
		this.mm.mock(this.lc(), '_updateListByResList');
		this.mm.mock(this.lc(), '_updateListByGroupResList');
		
		this.lc().m_rlist = {name:'rlist'};
		this.upd.update();
		assertEQ ( this.mm.walkLog, '_updateListByResList' );
		
		this.mm.clear();
		this.lc().m_rlist = null;
		this.lc().m_rgroupList = {name:'rgroupList'};
		this.upd.update();
		assertEQ ( this.mm.walkLog, '_updateListByGroupResList' );
		
		this.mm.clear();
		this.lc().m_rlist = null;
		this.lc().m_rgroupList = null;
		this.upd.update();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__updateListByResList = function(){
		this.lc().m_list = List.snew(this.g, MockDom.snew('div'));
		this.lc().m_rlist = [{id:1},{id:2}];
		
		this.mm.mock(this.lc().m_list, 'setItemCount' );
		this.mm.mock(this.lc(), '_updateOneList', [1] );
		
		this.lc()._updateListByResList();
		assertEQ ( this.mm.walkLog, 'setItemCount,_updateOneList,setItemCount' );
		assertEQ ( this.mm.params['setItemCount.0'], [2] );
		assertEQ ( this.mm.params['_updateOneList'], [0, 0, this.lc().m_rlist] );
		assertEQ ( this.mm.params['setItemCount.1'], [1] );
	};
	
	this.test__updateListByGroupResList = function(){
		this.lc().m_list = List.snew(this.g, MockDom.snew('div'));
		this.lc().m_rgroupList = [{name:'group1'},{name:'group2'}];
		
		this.mm.mock(this.lc().m_list, 'setItemCount' );
		this.mm.mock(this.lc(), '_getGroupResListItemCount', [10] );
		this.mm.mock(this.lc(), '_updateOneList', [1] );
		
		this.lc()._updateListByGroupResList();
		assertEQ ( this.mm.walkLog, '_getGroupResListItemCount,setItemCount,_updateOneList,_updateOneList,setItemCount' );
		assertEQ ( this.mm.params['setItemCount.0'], [10] );
		assertEQ ( this.mm.params['_updateOneList.0'], [0, 0, {name:'group1'}] );
		assertEQ ( this.mm.params['_updateOneList.1'], [1, 1, {name:'group2'}] );
		assertEQ ( this.mm.params['setItemCount.1'], [1] );
	};
	
	this.test__updateOneList = function(){
		this.lc().m_list = List.snew(this.g, MockDom.snew('div'));
		this.lc().m_list.setItemCount(10);
		
		this.mm.mock( this.lc(), '_setItemCon' );
		this.mm.mock( this.lc(), '_combineResIdx', [20001] );
		
		var p_startListIdx = 1;
		var p_groupIdx = 2;
		var p_resList = [{id:1, state:0},{id:2, state:1}];
		assertEQ ( this.lc()._updateOneList(p_startListIdx, p_groupIdx, p_resList), 2);
		assertEQ ( this.mm.walkLog, '_combineResIdx,_setItemCon' );
		assertEQ ( this.mm.params['_combineResIdx'], [2, 1] );
		assertEQ ( this.mm.params['_setItemCon'], [20001, this.lc().m_list.getItem(1), {id:2, state:1}] );
	};
	
	this.test__getGroupResListItemCount = function(){
		this.lc().m_rgroupList = [[{id:1}],[{id:2},{id:3}]];
		assertEQ ( this.lc()._getGroupResListItemCount(), 3 );
	};
	
	this.test__combineResIdx = function(){
		assertEQ ( this.lc()._combineResIdx(1,2), 10002 );
		assertEQ ( this.lc()._combineResIdx(0,1), 1 );
	};
	
	this.test__setItemCon = function(){
		this.lc().m_info.needitems = ['icon','name'];
		this.mm.mock(this.lc(), '_setItemIcon' );
		this.mm.mock(this.lc(), '_setItemName' );
		
		var p_combineResIdx = 1;
		var p_item = {name:'item'};
		var p_ritem = {name:'ritem'};
		this.lc()._setItemCon(p_combineResIdx, p_item, p_ritem);
		assertEQ ( this.mm.walkLog, '_setItemIcon,_setItemName' );
		assertEQ ( this.mm.params['_setItemIcon'], [p_combineResIdx, p_item, p_ritem] );
		assertEQ ( this.mm.params['_setItemName'], [p_combineResIdx, p_item, p_ritem] );
	};
	
	this.test__getSetterByLableName = function(){
		assertEQ ( this.lc()._getSetterByLableName('icon'), this.lc()._setItemIcon );
		assertEQ ( this.lc()._getSetterByLableName('stop'), this.lc()._checkSendStopCmd );
		assertEQ ( this.lc()._getSetterByLableName('name'), this.lc()._setItemName );
		assertEQ ( this.lc()._getSetterByLableName('state'), this.lc()._setItemState );
		assertEQ ( this.lc()._getSetterByLableName('levelstate'), this.lc()._setItemLevelState );
		assertEQ ( this.lc()._getSetterByLableName('number'), this.lc()._setItemNumber );
		assertEQ ( this.lc()._getSetterByLableName('lefttime'), this.lc()._setItemLefttime );
		assertEQ ( this.lc()._getSetterByLableName('curlevel'), this.lc()._setItemCurLevel );
		assertEQ ( this.lc()._getSetterByLableName('goallevel'), this.lc()._setItemGoalLevel );
		assertEQ ( this.lc()._getSetterByLableName('opbtn'), this.lc()._setItemOp );
		assertEQ ( typeof( this.lc()._getSetterByLableName('null') ), 'function');
		assertEQ ( this.lc()._getSetterByLableName('xxxx'), this.lc()._getSetterByLableName('null') );
	};
	
	this.test__setItemIcon = function(){
		this.mm.mock(IMG, 'setBKImage' );
		var p_item = {exsubs:{icon:{name:'iconlbl'}}};
		var p_resItem = {itemres:{smallpic:101}};
		this.lc()._setItemIcon(0, p_item, p_resItem);
		assertEQ ( this.mm.params['setBKImage'], [{name:'iconlbl'}, IMG.makeSmallImg(101) ] );
	};
	
	this.test__checkSendStopCmd = function(){
		this.mm.mock(this.lc(), '_sendStopCmdToSvr');
		this.lc().m_info.sendStopCmdToSvr = null;
		
		var p_item = {};
		
		this.mm.clear();
		var p_resItem = {state:BUILD_STATE.UPGRADE, stoptime:this.g.getSvrTimeS()+1};
		this.lc()._checkSendStopCmd(0, p_item, p_resItem);
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		var p_resItem = {state:BUILD_STATE.DOWN, stoptime:this.g.getSvrTimeS()+1};
		this.lc()._checkSendStopCmd(0, p_item, p_resItem);
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.lc().m_info.sendStopCmdToSvr = function(){};
		var p_resItem = {state:BUILD_STATE.UPGRADE, stoptime:this.g.getSvrTimeS()+1};
		this.lc()._checkSendStopCmd(0, p_item, p_resItem);
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		var p_resItem = {state:BUILD_STATE.DOWN, stoptime:this.g.getSvrTimeS()+1};
		this.lc()._checkSendStopCmd(0, p_item, p_resItem);
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		var p_resItem = {state:BUILD_STATE.UPGRADE, stoptime:this.g.getSvrTimeS()};
		this.lc()._checkSendStopCmd(0, p_item, p_resItem);
		assertEQ ( this.mm.walkLog, '_sendStopCmdToSvr' );
		assertEQ ( this.mm.params['_sendStopCmdToSvr'], [p_resItem] );
		
		this.mm.clear();
		var p_resItem = {state:BUILD_STATE.DOWN, stoptime:this.g.getSvrTimeS()};
		this.lc()._checkSendStopCmd(0, p_item, p_resItem);
		assertEQ ( this.mm.walkLog, '_sendStopCmdToSvr' );
		assertEQ ( this.mm.params['_sendStopCmdToSvr'], [p_resItem] );
	};
	
	this.test__setItemName = function(){
		this.mm.mock(TQ, 'setTextEx' );
		
		var p_item = {exsubs:{name:{name:'namelbl'}}};
		var p_resItem = {itemres:{name:'name'}};
		this.lc()._setItemName(0, p_item, p_resItem);
		assertEQ ( this.mm.params['setTextEx'], [{name:'namelbl', className:'comm_whitefont'}, 'name'] );
		
		p_resItem = {isCulture:true, itemres:{name:'name'}};
		this.lc()._setItemName(0, p_item, p_resItem);
		assertEQ ( this.mm.params['setTextEx'], [{name:'namelbl', className:'comm_yellowfont'}, 'name'] );
	};
	
	this.test__setItemState = function(){
		this.lc().m_info.firststatefmt = 'firststate';
		this.lc().m_info.statefmt = ['1','2','3','4','5'];
		this.mm.mock(TQ, 'setTextEx' );
		var p_combineResIdx = 20000;
		var p_item = {exsubs:{state:{name:'statelbl'}}};
		var p_resItem = {level:0,state:BUILD_STATE.UPGRADE};
		this.lc()._setItemState(p_combineResIdx, p_item, p_resItem);
		assertEQ ( this.mm.params['setTextEx'], [{name:'statelbl', className:'comm_whitefont'}, 'firststate'] );
		
		this.mm.clear();
		p_resItem.level = 1;
		this.lc()._setItemState(p_combineResIdx, p_item, p_resItem);
		assertEQ ( this.mm.params['setTextEx'], [ {name:'statelbl', className:'comm_whitefont'}, this.lc().m_info.statefmt[BUILD_STATE.UPGRADE] ] );
		
		this.mm.clear();
		var r_resItem = null;
		this.lc().m_info.getStateName = function(resItem, groupIdx){ 
			r_resItem = resItem;
			r_groupIdx = groupIdx;
			return 'commstate'; };
		this.lc()._setItemState(p_combineResIdx, p_item, p_resItem);
		assertEQ ( this.mm.params['setTextEx'], [ {name:'statelbl', className:'comm_whitefont'}, 'commstate' ] );
		assertEQ ( r_resItem, p_resItem );
		assertEQ ( r_groupIdx,  this.lc()._getListGroupIdx(p_combineResIdx) );
	};
	
	this.test__setItemLevelState = function(){
		this.mm.mock(TQ, 'setTextEx' );
		this.mm.mock(this.lc(), '_getGoalLevel', [1] );
		
		var p_item = {exsubs:{levelstate:{name:'levelstate'}}};
		var p_resItem = {level:0,state:BUILD_STATE.UPGRADE};
		this.lc()._setItemLevelState(0, p_item, p_resItem);
		assertEQ ( this.mm.params['setTextEx'], [{name:'levelstate', className:'comm_whitefont'}, '0->1'] );
		assertEQ ( this.mm.params['_getGoalLevel'], [p_resItem] );
	};
	
	this.test__setItemNumber = function(){
		this.mm.mock(TQ, 'setTextEx' );
		
		var p_item = {exsubs:{levelstate:{name:'levelstate'}}};
		var p_resItem = {number:10};
		this.lc()._setItemNumber(0, p_item, p_resItem);
		assertEQ ( this.mm.params['setTextEx'], [{name:'levelstate', className:'comm_whitefont'}, '10'] );
	};
	
	this.test__setItemLefttime = function(){
		this.mm.mock(TQ, 'setTextEx' );
		
		var p_item = {exsubs:{lefttime:{name:'lefttime'}}};
		var p_resItem = {state:BUILD_STATE.UPGRADE, stoptime:this.g.getSvrTimeS() + 10};
		this.lc()._setItemLefttime(0, p_item, p_resItem);
		assertEQ ( this.mm.params['setTextEx'], [{name:'lefttime', className:'comm_whitefont'}, TQ.formatTime(0,  10)] );
		
		this.mm.clear();
		p_resItem.state = BUILD_STATE.DOWN;
		this.lc()._setItemLefttime(0, p_item, p_resItem);
		assertEQ ( this.mm.params['setTextEx'], [{name:'lefttime', className:'comm_whitefont'}, TQ.formatTime(0,  10)] );
	};
	
	this.test__setItemCurLevel = function(){
		this.mm.mock(TQ, 'setTextEx' );
		var p_item = {exsubs:{curlevel:{name:'curlevel'}}};
		var p_resItem = {level:10};
		this.lc()._setItemCurLevel(0, p_item, p_resItem);
		assertEQ ( this.mm.params['setTextEx'], [{name:'curlevel', className:'comm_whitefont'},10] );
	};
	
	this.test__setItemGoalLevel = function(){
		this.mm.mock(TQ, 'setTextEx' );
		this.mm.mock(this.lc(), '_getGoalLevel', [1] );
		
		var p_item = {exsubs:{nextlevel:{name:'nextlevel'}}};
		var p_resItem = {level:0};
		this.lc()._setItemGoalLevel(0, p_item, p_resItem);
		assertEQ ( this.mm.params['setTextEx'], [{name:'nextlevel', className:'comm_whitefont'}, 1] );
		assertEQ ( this.mm.params['_getGoalLevel'], [p_resItem] );
	};
	
	this.test__setItemOp = function(){
		var opspeedBtn = new ComButton(this.g, MockDom.snew());
		var opcancelBtn = new ComButton(this.g, MockDom.snew());
		this.mm.mock(opspeedBtn, 'setId');
		this.mm.mock(opcancelBtn, 'setId');
		this.mm.mock(opspeedBtn, 'setCaller');
		this.mm.mock(opcancelBtn, 'setCaller');
		
		var p_combineResIdx = 1;
		var p_item = {exsubs:{opspeed:opspeedBtn, opcancel:opcancelBtn}};
		var p_resItem = {};
		this.lc()._setItemOp(p_combineResIdx, p_item, p_resItem);
		assertEQ ( this.mm.walkLog, 'setId,setId,setCaller,setCaller' );
		assertEQ ( this.mm.params['setId.0'], [1] );
		assertEQ ( this.mm.params['setId.1'], [1] );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.upd, caller:this.lc()._onSpeedBtn}] );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.upd, caller:this.lc()._onCancelBtn}] );
	};
	
	this.test__onSpeedBtn = function(){
		var r_item = null;
		var r_groupIdx = -1;
		this.lc().m_info.opspeed = function(item, groupIdx){
			r_item = item;
			r_groupIdx = groupIdx;
		};

		this.mm.mock( this.lc(), '_getResItemByCombineResIdx', [{id:1}]);
		this.mm.mock( this.lc(), '_getListGroupIdx', [2] );
		this.lc()._onSpeedBtn(1);
		assertEQ ( r_item, {id:1} );
		assertEQ ( r_groupIdx, 2 );
		assertEQ ( this.mm.params['_getResItemByCombineResIdx'], [1] );
		assertEQ ( this.mm.params['_getListGroupIdx'], [1] );
	};	
	
	this.test__onCancelBtn = function(){
		var r_item = null;
		var r_groupIdx = -1;
		this.lc().m_info.opcancel = function(item, groupIdx){
			r_item = item;
			r_groupIdx = groupIdx;
		};

		this.mm.mock( this.lc(), '_getResItemByCombineResIdx', [{id:1}]);
		this.mm.mock( this.lc(), '_getListGroupIdx', [2] );
		this.lc()._onCancelBtn(1);
		assertEQ ( r_item, {id:1} );
		assertEQ ( r_groupIdx, 2 );
		assertEQ ( this.mm.params['_getResItemByCombineResIdx'], [1] );
		assertEQ ( this.mm.params['_getListGroupIdx'], [1] );
	};
	
	this.test__getResItemByCombineResIdx = function(){
		this.lc().m_rlist = [{id:1}];
		assertEQ ( this.lc()._getResItemByCombineResIdx(0), {id:1} );
		
		this.lc().m_rlist = null;
		this.lc().m_rgroupList = [[{id:1}],[{id:2}],[{id:3},{id:4}]];
		assertEQ ( this.lc()._getResItemByCombineResIdx(this.lc()._combineResIdx(2, 1)), {id:4} );
	};
	
	this.test__getListGroupIdx = function(){
		assertEQ ( this.lc()._getListGroupIdx(20000), 2 );
		assertEQ ( this.lc()._getListGroupIdx(10001), 1 );
		assertEQ ( this.lc()._getListGroupIdx(9000), 0 );
	};
	
	this.test__getItemIdxInList = function(){
		assertEQ ( this.lc()._getItemIdxInList(20000), 0 );
		assertEQ ( this.lc()._getItemIdxInList(10001), 1 );
		assertEQ ( this.lc()._getItemIdxInList(9000), 9000 );
	};
	
	this.test__getGoalLevel = function(){
		var p_item = {state:BUILD_STATE.UPGRADE,level:1};
		assertEQ ( this.lc()._getGoalLevel(p_item), 2 );
		
		p_item.state = BUILD_STATE.DOWN;
		assertEQ ( this.lc()._getGoalLevel(p_item), 0 );
		
		p_item.level = '--';
		assertEQ ( this.lc()._getGoalLevel(p_item), '--' );
	};
	
	this.test__sendStopCmdToSvr = function(){
		var p_resItem = {state:1};
		var r_resItem = null;
		this.lc().m_info.sendStopCmdToSvr = function(resItem){ r_resItem = resItem; };
		this.lc()._sendStopCmdToSvr(p_resItem);
		assertEQ ( r_resItem, p_resItem );
	};
});

tqCommBuildUpdater_t_main = function(suite) {
	suite.addTestCase(TestCaseCommBuildUpdater, 'TestCaseCommBuildUpdater');
};
