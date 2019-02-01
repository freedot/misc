/*******************************************************************************/
requireEx('./handler/tqFriendDlg.js', [
	{
		start:'//FriendDlg-unittest-start'
		,end:'//FriendDlg-unittest-end'
		,items:['m_g'
			,'m_this'
			,'m_dlg'
			,'m_items'
			,'m_tabListOps'
			,'m_lastTabListSelIdxs'
			,'m_chatCache'
			,'m_chatDlgs'
			,'m_blinkCtrls'
			,'m_blinkResIdxs'
			,'m_fromTopFarmBtn'
			,'m_headiconblink'
			,'C_ITEM_COUNT'
			,'C_ITEM_SEL_H'
			,'C_ITEM_ICON_SEL_W'
			,'C_ITEM_ICON_SEL_H'
			,'C_ITEM_NAME_SEL_L'
			,'C_ITEM_NAME_SEL_T'
			,'C_ITEM_NAME_SEL_W'
			,'C_ITEM_NAME_SEL_H'
			,'C_ITEM_H'
			,'C_ITEM_ICON_W'
			,'C_ITEM_ICON_H'
			,'C_ITEM_NAME_L'
			,'C_ITEM_NAME_T'
			,'C_ITEM_NAME_W'
			,'C_ITEM_NAME_H'
			,'C_TOGGLE_W'
			,'C_TOGGLE_H'
			,'C_TOGGLE_REF_TOP'
			,'C_NEWCHAT_DURATION_MS'		
			,'C_ITEMOP_ENTERFARM'		
			,'C_ITEMOP_TALK'		
			,'C_ITEMOP_DETAIL'		
			,'C_ITEMOP_LETTER'		
			,'C_ITEMOP_DEL'		
			,'C_DLG_W'		
			,'C_DLG_TOP'		
			,'_initDlg'
			,'_createToggleBtn'
			,'_createDlg'
			,'_setTabTexts'
			,'_setCallers'
			,'_openDlg'
			,'_initInfo'
			,'_onClickAddBtn'
			,'_onClickApplyListBtn'
			,'_createTabListItemCallers'
			,'_createPageBarCallers'
			,'_onSelectListItem'
			,'_onDblClickListItem'
			,'_createOpBtns'
			,'_innerCreateOpBtns'
			,'_getAllFriendsFromSvr'
			,'_handleCache'
			,'_handleApplyMsg'
			,'_handleChatCache'
			,'_getTopChatRoleIdFromChatCache'
			,'_getItemIdxInfoByRoleId'
			,'_getResListItem'
			,'_openChatDlgAndHandleCache'
			,'_openChatDlg'
			,'_stopItemBlink'
			,'_onChatMsg'
			,'_getFitIdOrAllocChatDlg'
			,'_getItemBlink'
			,'_getUIListItem'
			,'_updateTabList'
			,'_updateItemsBlink'
			,'_setPageBarsCount'
			,'_setTabListItems'
			,'_setTabListItemsBtnCallers'
			,'_initTabListSelectItem'
			,'_setListItem'
			,'_travelTabList'
			,'_getListRangeByPageIdx'
			,'_getTabResList'
			,'_onSvrPkg'
			,'_onHasApplyMsg'
			,'_handleChatPkgByChatDlgs'
			,'_isMostTopChatDlg'
			,'_pushToChatCache'
			,'_handleNewChatEvent'
			,'_startToggleBtnBlink'
			,'_startItemBlink'
			,'_allocItemBlink'
			,'_onItemBlinkEnd'
			,'_setTalkFlagPos'
			,'_expandCurSelItem'
			,'_collapseListSelItem'
			,'_getCurTabIdx'
			,'_setListItemHeight'
			,'_setListItemIconAndNameRect'
			,'_setListItemIconSmallBkImg'
			,'_setListItemIconBigBkImg'
			,'_removeListItemOpDom'
			,'_appendListItemOpDom'
			,'_getCurSelResItem'
			,'_onClickItemOpBtn'
			,'_onOpEnterFarm'
			,'_onOpTalkWith'
			,'_onOpShowDetail'
			,'_onOpWriteLetter'
			,'_onOpDeleteFriend'
			,'_delFriendCallback'
			,'_getMostTopZIndex'
			,'_allocChatDlg'
			,'_onClickToggleBtn'
			,'_resetPos'
			,'_resetDlgPos'
			,'_resetDlgVisible'
			,'_resetToggleBtnPos'
			,'_resetToggleBtnZIndex'
			,'_onLoginOk'
			,'_onPageNavigate'
			,'_isShow'
			,'_setListItemBtnCaller'
			,'_onClickTopFarmBtn'
			,'_setListCurSelByOpBtnId'
			,'_getCurSelItemIdx'
			,'_getCurSelResItemIdx'
			,'_getResIdxByUIItem'
			,'_getCurSelUIItem'
			,'_stopAllItemsBlink'
			,'_startAllItemsBlink'
			,'_onChatDlgUp'
			,'_popBlinkCache'
			,'_pushBlinkCache'
			,'_startHeadIconBlink'
			,'_stopHeadIconBlink'
			,'_findDlgIdxByResIdx'
			,'_isBlinkResIdx'
			,'_createHeadIconBlink'
			,'_onClickHeadIconName'
			,'_getCanGatherFarmFlags'
			,'_onClickRefreshBtn'
			,'_onSvrCanGatherFlags'
			,'_udpateListItemsGatherFlag'
			,'_initCanGatherFarmFlags'
			,'_clearCanGatherFarmFlags'
			,'_onEnemyUpdate'
		]
	}
]);

TestCaseFriendDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = FriendDlg.snew(this.g);
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
		this.lc().m_items.tablist.getTabItems(0).list.setItemCount(1);
		this.item = this.lc().m_items.tablist.getTabItems(0).list.getItem(0);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		this.mm.mock(this.g, 'regEvent' );
		this.dlg.init(this.g);
		assertEQ ( this.lc().m_fromTopFarmBtn, false );
		assertEQ ( this.mm.walkLog, 'regEvent,regEvent,regEvent,regEvent' );
		assertEQ ( this.mm.params['regEvent.0'], [EVT.LOGIN_OK, 0, this.dlg, this.lc()._onLoginOk] );
		assertEQ ( this.mm.params['regEvent.1'], [EVT.NET, NETCMD.FRIEND, this.dlg, this.lc()._onSvrPkg] );
		assertEQ ( this.mm.params['regEvent.2'], [EVT.NET, NETCMD.FARM, this.dlg, this.lc()._onSvrCanGatherFlags] );
		assertEQ ( this.mm.params['regEvent.3'], [EVT.ENEMY_UPDATE, 0, this.dlg, this.lc()._onEnemyUpdate] );
	};
	
	this.test_resetPos = function(){
		this.mm.mock(this.lc(), '_resetPos');
		this.lc().m_dlg = null;
		this.dlg.resetPos();
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_dlg = {};
		this.dlg.resetPos();
		assertEQ ( this.mm.walkLog, '_resetPos' );
	};	
	
	this.test_openDlg = function(){
		this.mm.mock(this.lc(), '_initDlg' );
		this.mm.mock(this.lc(), '_openDlg' );
		this.mm.mock(this.lc(), '_initInfo' );
		this.mm.mock(this.lc(), '_resetPos' );
		this.dlg.openDlg();
		assertEQ ( this.mm.walkLog, '_initDlg,_openDlg,_initInfo,_resetPos' );
	};
	
	this.test__initDlg = function(){
		this.lc().m_dlg = null;
		this.mm.mock(this.lc(), '_createDlg' );
		this.mm.mock(this.lc(), '_createToggleBtn' );
		this.mm.mock(this.lc(), '_setTabTexts' );
		this.mm.mock(this.lc(), '_setCallers' );
		this.mm.mock(this.lc(), '_createOpBtns' );
		this.mm.mock(this.lc(), '_createHeadIconBlink' );
		this.mm.mock(this.lc(), '_getAllFriendsFromSvr' );
	
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '_createDlg,_createToggleBtn,_setTabTexts,_setCallers,_createOpBtns,_createHeadIconBlink,_getAllFriendsFromSvr' );
		
		this.lc().m_dlg = {};
		this.mm.clear();
		this.lc()._initDlg();
		assertEQ ( this.mm.walkLog, '' );
	};
	
	this.test__createDlg = function(){
		var r_dlg = MockDialog.snew(this.g);
		this.mm.mock(Dialog, 'snew', [r_dlg]);
		this.mm.mock(this.g.getGUI(), 'initDlg' );
		this.mm.mock(InputLimit, 'maxGBKBytes' );
		this.lc()._createDlg();
		assertEQ ( this.mm.walkLog, 'snew,initDlg,maxGBKBytes' );
		if ( !TQ.isMobile() ) {
			assertEQ ( this.mm.params['snew'], [this.g,{modal:false, pos:{x:784, y:30}, uiback:uiback.dlg.friendmain}] );
			assertEQ ( this.mm.params['initDlg'], [r_dlg, uicfg.friend.maindlg, this.lc().m_items] );
			assertEQ ( this.mm.params['maxGBKBytes'], [this.lc().m_items.addName,  JVALID.getMaxUserLen()]);
		}
		assertEQ ( this.lc().m_dlg, r_dlg);
	};
	
	this.test__createToggleBtn = function(){
		this.lc()._createToggleBtn();
		assertEQ ( this.lc().m_items.toggleBtn instanceof ComButton, true);
		if ( !TQ.isMobile() ) {
			assertEQ ( this.lc().m_items.toggleBtn.getType(), BTN_TYPE.CHECK);
			var parentDom = this.lc().m_items.toggleBtn.getParent()
			assertEQ ( TQ.getCSS(parentDom, 'position'), 'absolute' );
			assertEQ ( TQ.getCSS(parentDom, 'zIndex'), 9999 );
			assertEQ ( TQ.getCSS(parentDom, 'width'), this.lc().C_TOGGLE_W + 'px' );
			assertEQ ( TQ.getCSS(parentDom, 'height'), this.lc().C_TOGGLE_H + 'px' );
		}
	};
	
	this.test__setTabTexts = function(){
		this.lc()._setTabTexts();
		assertEQ ( this.lc().m_items.tablist.getTabCount(), 2 );
		assertEQ ( this.lc().m_items.tablist.getTabText(0) , rstr.friend.maindlg.tabs[0] );
		assertEQ ( this.lc().m_items.tablist.getTabText(1) , rstr.friend.maindlg.tabs[1] );
	};
	
	this.test__setCallers = function(){
		this.mm.mock ( this.lc().m_items.toggleBtn, 'setCaller' );
		this.mm.mock ( this.lc().m_items.addBtn, 'setCaller' );
		this.mm.mock ( this.lc().m_items.applyListBtn, 'setCaller' );
		this.mm.mock ( this.lc().m_items.refreshBtn, 'setCaller' );
		this.mm.mock ( this.lc(), '_createTabListItemCallers' );
		this.mm.mock ( this.lc(), '_createPageBarCallers' );
		this.mm.mock ( TQ, 'addEvent' );
		this.lc()._setCallers();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller,setCaller,setCaller,addEvent,_createTabListItemCallers,_createPageBarCallers' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.dlg, caller:this.lc()._onClickToggleBtn}] );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.dlg, caller:this.lc()._onClickAddBtn}] );
		assertEQ ( this.mm.params['setCaller.2'], [{self:this.dlg, caller:this.lc()._onClickApplyListBtn}] );
		assertEQ ( this.mm.params['setCaller.3'], [{self:this.dlg, caller:this.lc()._onClickRefreshBtn}] );
		assertEQ ( this.mm.params['addEvent'], [this.lc().m_items.headiconname, 'click', this.lc()._onClickHeadIconName] );
	};
	
	this.test__createTabListItemCallers = function(){
		this.mm.mock ( this.lc().m_items.tablist.getTabItems(0).list, 'setCaller' );
		this.mm.mock ( this.lc().m_items.tablist.getTabItems(1).list, 'setCaller' );
		
		this.lc()._createTabListItemCallers();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.dlg, caller:this.lc()._onSelectListItem},null,null,{self:this.dlg, caller:this.lc()._onDblClickListItem}] );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.dlg, caller:this.lc()._onSelectListItem},null,null,{self:this.dlg, caller:this.lc()._onDblClickListItem}] );
	};
	
	this.test__createPageBarCallers = function(){
		this.mm.mock ( this.lc().m_items.tablist.getTabItems(0).pagebar, 'setCaller' );
		this.mm.mock ( this.lc().m_items.tablist.getTabItems(1).pagebar, 'setCaller' );
		
		this.lc()._createPageBarCallers();
		assertEQ ( this.mm.walkLog, 'setCaller,setCaller' );
		assertEQ ( this.mm.params['setCaller.0'], [{self:this.dlg, caller:this.lc()._onPageNavigate}] );
		assertEQ ( this.mm.params['setCaller.1'], [{self:this.dlg, caller:this.lc()._onPageNavigate}] );
	};
	
	this.test__createOpBtns = function(){
		this.lc().m_tabListOps = [];
		
		this.mm.mock( this.lc(), '_innerCreateOpBtns', [{id:1}] );
		this.lc()._createOpBtns();
		assertEQ ( this.mm.walkLog, '_innerCreateOpBtns,_innerCreateOpBtns' );
		assertEQ ( this.lc().m_tabListOps,  [{id:1},{id:1}]);
	};
	
	this.test__innerCreateOpBtns = function(){
		this.lc().m_tabListOps = [];
		
		var btns = [{id:1, rect:[1, 2, 3, 4], text:'btn1'},{id:2, rect:[10, 20, 30, 40], text:'btn2'}];
		var ops = this.lc()._innerCreateOpBtns(btns);
		assertEQ ( ops.opDom.childNodes.length, 2 );
		assertEQ ( ops.opBtns.length, 2 );
		assertEQ ( ops.opBtns[0].getId(), 1 );
		assertEQ ( ops.opBtns[0].getText(), 'btn1' );
		assertEQ ( ops.opBtns[1].getId(), 2 );
		assertEQ ( ops.opBtns[1].getText(), 'btn2' );
		assertEQ ( TQ.getDomRect(ops.opDom.childNodes[0]), {l:1, t:2, w:3, h:4} );
		assertEQ ( TQ.getDomRect(ops.opDom.childNodes[1]), {l:10, t:20, w:30, h:40} );
	};
	
	this.test__getAllFriendsFromSvr = function(){
		this.mm.mock ( FriendSender, 'sendGetAllFriends' );
		this.lc()._getAllFriendsFromSvr();
		assertEQ ( this.mm.walkLog, 'sendGetAllFriends' );
		assertEQ ( this.mm.params['sendGetAllFriends'], [this.g] );
	};
	
	this.test__openDlg = function(){
		this.mm.mock(this.lc().m_dlg, 'show');
		this.lc()._openDlg();
		assertEQ ( this.mm.walkLog, 'show' );
	};
	
	this.test__initInfo = function(){
		this.mm.mock( this.lc(), '_handleApplyMsg' );
		this.mm.mock( this.lc(), '_handleCache' );
		this.mm.mock( this.lc().m_items.tablist, 'activeTab' );
		this.lc()._initInfo();
		assertEQ ( this.mm.walkLog, '_handleApplyMsg,_handleCache,activeTab' );
		assertEQ ( this.mm.params['activeTab'], [0] );
	};
	
	this.test__initCanGatherFarmFlags = function(){
		this.mm.mock(this.lc(), '_clearCanGatherFarmFlags');
		this.mm.mock(this.lc(), '_getCanGatherFarmFlags');
		var tabIdx = 0;
		this.lc()._initCanGatherFarmFlags(tabIdx);
		assertEQ ( this.mm.walkLog, '_clearCanGatherFarmFlags,_getCanGatherFarmFlags' );
		assertEQ ( this.mm.params['_clearCanGatherFarmFlags'], [tabIdx] );
		assertEQ ( this.mm.params['_getCanGatherFarmFlags'], [tabIdx] );
	};
	
	this.test__clearCanGatherFarmFlags = function(){
		var tabIdx = 0;
		var list = this.lc().m_items.tablist.getTabItems(tabIdx).list;
		list.setItemCount(2);
		list.getItem(0).exsubs.farmBtn.setId(1);
		list.getItem(1).exsubs.farmBtn.setId(2);
		IMG.setBKImage(list.getItem(0).exsubs.canGatherFlag, IMG.makeImg('farm/cangather.gif') );
		IMG.setBKImage(list.getItem(1).exsubs.canGatherFlag, IMG.makeImg('farm/cangather.gif') );
		this.lc()._clearCanGatherFarmFlags(tabIdx);
		assertEQ ( IMG.getBKImage(list.getItem(0).exsubs.canGatherFlag), "url('')" );
		assertEQ ( IMG.getBKImage(list.getItem(1).exsubs.canGatherFlag), "url('')" );
	};
	
	this.test__getCanGatherFarmFlags = function(){
		this.mm.mock(this.lc(), '_getResListItem', null, function(tabIdx, resIdx){
			if (resIdx == 1) return {roleId:10000};
			if (resIdx == 2) return {roleId:10001};
		});
		this.mm.mock(FarmSender, 'sendGetCanGatherFlags');
		
		var tabIdx = 0;
		var list = this.lc().m_items.tablist.getTabItems(tabIdx).list;
		list.setItemCount(2);
		list.getItem(0).exsubs.farmBtn.setId(1);
		list.getItem(1).exsubs.farmBtn.setId(2);
		
		this.lc()._getCanGatherFarmFlags(tabIdx);
		assertEQ ( this.mm.params['sendGetCanGatherFlags'], [this.g,  [10000, 10001], tabIdx] );
	};
	
	this.test__handleApplyMsg = function(){
		this.mm.mock(this.lc().m_items.applyListBtn, 'startBlinking' );
		this.lc()._handleApplyMsg();
		assertEQ ( this.mm.walkLog, '' );
		
		this.g.getImgr().getFriends().applys = [{}];
		this.lc()._handleApplyMsg();
		assertEQ ( this.mm.walkLog, 'startBlinking' );
		assertEQ ( this.mm.params['startBlinking'], [0] );
	};
	
	this.test__handleCache = function(){
		var r_roleId = [0];
		var r_itemPos = [{tabidx:1, itemidx:2, residx:2}];
		var r_item = [{}];
		this.mm.mock(this.lc(), '_getTopChatRoleIdFromChatCache', r_roleId);
		this.mm.mock(this.lc(), '_getItemIdxInfoByRoleId', r_itemPos);
		this.mm.mock(this.lc(), '_getResListItem', r_item);
		this.mm.mock(this.lc(), '_openChatDlgAndHandleCache');
			
		this.lc()._handleCache();
		assertEQ ( this.mm.walkLog, '_getTopChatRoleIdFromChatCache' );
			
		this.mm.clear();
		r_roleId[0] = 10000;
		this.lc()._handleCache();
		assertEQ ( this.mm.walkLog, '_getTopChatRoleIdFromChatCache,_getItemIdxInfoByRoleId,_getResListItem,_openChatDlgAndHandleCache' );
		assertEQ ( this.mm.params['_getItemIdxInfoByRoleId'], [10000] );
		assertEQ ( this.mm.params['_getResListItem'], [1,2] );
		assertEQ ( this.mm.params['_openChatDlgAndHandleCache'], [r_item[0], 1, 2, 2] );
	};
	
	this.test__getTopChatRoleIdFromChatCache = function(){
		this.lc().m_chatCache = [];
		assertEQ ( this.lc()._getTopChatRoleIdFromChatCache(), 0 );
		
		this.lc().m_chatCache = [{roleId:1},{roleId:2}];
		assertEQ ( this.lc()._getTopChatRoleIdFromChatCache(), 1 );
	};
	
	this.test__openChatDlgAndHandleCache = function(){
		this.mm.mock( this.lc(), '_openChatDlg' );
		this.mm.mock( this.lc(), '_stopItemBlink' );
		this.mm.mock( this.lc(), '_popBlinkCache' );
		this.mm.mock( this.lc(), '_handleChatCache' );
		
		var p_item = {roleId:1};
		var p_tabIdx = 1;
		var p_itemIdx = 2;
		var p_resIdx = 3;
		this.lc()._openChatDlgAndHandleCache(p_item, p_tabIdx, p_itemIdx, p_resIdx);
		assertEQ ( this.mm.walkLog, '_openChatDlg,_stopItemBlink,_popBlinkCache,_handleChatCache' );
		assertEQ ( this.mm.params['_openChatDlg'], [p_item] );
		assertEQ ( this.mm.params['_stopItemBlink'], [p_tabIdx, p_itemIdx] );
		assertEQ ( this.mm.params['_popBlinkCache'], [p_resIdx] );
		assertEQ ( this.mm.params['_handleChatCache'], [p_item.roleId] );
	};
	
	this.test__openChatDlg = function(){
		var dlg = MockDialog.extern(function(){ this.focus=function(){} }).snew(this.g);
		this.mm.mock(this.lc(), '_getFitIdOrAllocChatDlg', [dlg]);
		this.mm.mock(dlg, 'openDlg');
		this.mm.mock(dlg, 'focus');
		
		var p_item = {roleId:1};
		this.lc()._openChatDlg(p_item);
		assertEQ ( this.mm.walkLog, '_getFitIdOrAllocChatDlg,openDlg,focus' );
		assertEQ ( this.mm.params['_getFitIdOrAllocChatDlg'], [p_item.roleId] );
		assertEQ ( this.mm.params['openDlg'], [p_item] );
	};
	
	this.test__stopItemBlink = function(){
		var b = Class.extern(function(){this.stop=function(){}; }).snew();
		var r_blink = {used:true, b:b};
		var r_item = {exsubs:{talkflag:{}}};
		
		this.mm.mock( this.lc(), '_getItemBlink', [r_blink] );
		this.mm.mock( this.lc(), '_getUIListItem', [r_item] );
		this.mm.mock( IMG, 'setBKImage' );
		
		var p_tabIdx = 1;
		var p_itemIdx = 2;
		this.lc()._stopItemBlink(p_tabIdx, p_itemIdx);
		assertEQ ( this.mm.walkLog, '_getItemBlink,_getUIListItem,setBKImage' );
		assertEQ ( this.mm.params['_getItemBlink'], [p_tabIdx, p_itemIdx] );
		assertEQ ( this.mm.params['_getUIListItem'], [p_tabIdx, p_itemIdx] );
		assertEQ ( this.mm.params['setBKImage'], [r_item.exsubs.talkflag, ''] );
	};
	
	this.test__handleChatCache = function(){
		this.lc().m_chatCache = [{roleId:1,chat:1},{roleId:1,chat:2},{roleId:2,chat:3}];
		
		this.mm.mock( this.lc(), '_onChatMsg' );
		this.lc()._handleChatCache(1);
		assertEQ ( this.lc().m_chatCache.length, 1 );
		assertEQ ( this.mm.walkLog, '_onChatMsg,_onChatMsg' );
		assertEQ ( this.mm.params['_onChatMsg.0'], [{roleId:1,chat:1}] );
		assertEQ ( this.mm.params['_onChatMsg.1'], [{roleId:1,chat:2}] );
	};
	
	this.test__updateTabList = function(){
		this.lc().m_dlg = null;
		this.mm.mock( this.lc(), '_setPageBarsCount' );
		this.mm.mock( this.lc(), '_setTabListItems' );
		this.mm.mock( this.lc(), '_setTabListItemsBtnCallers' );
		this.mm.mock( this.lc(), '_initTabListSelectItem' );
		
		this.lc()._updateTabList();
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._updateTabList();
		assertEQ ( this.mm.walkLog, '_setPageBarsCount,_setTabListItems,_setTabListItemsBtnCallers,_initTabListSelectItem' );
	};
	
	this.test__updateItemsBlink = function(){
		this.mm.mock(this.lc(), '_stopAllItemsBlink');
		this.mm.mock(this.lc(), '_startAllItemsBlink');
		this.lc()._updateItemsBlink();
		assertEQ ( this.mm.walkLog, '_stopAllItemsBlink,_startAllItemsBlink' );
	};
	
	this.test__stopAllItemsBlink = function(){
		this.lc().m_items.tablist.getTabItems(0).list.setItemCount(2);
		this.mm.mock(this.lc(), '_getCurTabIdx', [0] );
		this.mm.mock(this.lc(), '_stopItemBlink');
		this.lc()._stopAllItemsBlink();
		assertEQ ( this.mm.params['_stopItemBlink.0'], [0,0] );
		assertEQ ( this.mm.params['_stopItemBlink.1'], [0,1] );
	};
	
	this.test__startAllItemsBlink = function(){
		var list = this.lc().m_items.tablist.getTabItems(0).list;
		list.setItemCount(3);
		list.getItem(0).exsubs.farmBtn.setId(1);
		list.getItem(1).exsubs.farmBtn.setId(2);
		list.getItem(2).exsubs.farmBtn.setId(3);
		this.lc().m_blinkResIdxs = [2,3];
	
		this.mm.mock(this.lc(), '_getCurTabIdx', [0] );
		this.mm.mock(this.lc(), '_findDlgIdxByResIdx', null, function(residx){
			if (residx == 1) return 11;
			if (residx == 2) return 12;
			if (residx == 3) return 13;
		});
		this.mm.mock(this.lc(), '_isMostTopChatDlg', null, function(chatIdx){
			return chatIdx == 12;
		});
		this.mm.mock(this.lc(), '_popBlinkCache');
		this.mm.mock(this.lc(), '_startItemBlink');
		this.mm.mock(this.lc(), '_getResListItem', [{roleId:10000}]);
		
		this.lc()._startAllItemsBlink();
		assertEQ ( this.mm.params['_popBlinkCache'], [2] );
		assertEQ ( this.mm.params['_getResListItem'], [0, 3] );
		assertEQ ( this.mm.params['_startItemBlink'], [{roleId:10000}, 13] );
	};
	
	this.test__findDlgIdxByResIdx = function(){
		this.mm.mock(this.lc(), '_getCurTabIdx', [0] );
		this.mm.mock(this.lc(), '_getResListItem', null, function(tabIdx, resIdx){
			if ( resIdx == 1 ) return null;
			if ( resIdx == 2 ) return {roleId:10000};
			if ( resIdx == 3 ) return {roleId:10002};
		});
		
		this.lc().m_chatDlgs = [{roleId:10001}, {roleId:10002}];
		
		var resIdx = 1;
		assertEQ ( this.lc()._findDlgIdxByResIdx(resIdx), -1 );
		resIdx = 2;
		assertEQ ( this.lc()._findDlgIdxByResIdx(resIdx), -1 );
		resIdx = 3;
		assertEQ ( this.lc()._findDlgIdxByResIdx(resIdx), 1 );
	};
	
	this.test__setPageBarsCount = function(){
		this.vb.replace(this.lc(), 'C_ITEM_COUNT', 12);
		this.g.getImgr().getFriends().friends = [1,2,3];
		this.g.getImgr().getFriends().enemys = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
	
		this.mm.mock ( this.lc().m_items.tablist.getTabItems(0).pagebar, 'setPageCnt' );
		this.mm.mock ( this.lc().m_items.tablist.getTabItems(1).pagebar, 'setPageCnt' );
		this.lc()._setPageBarsCount();
		assertEQ ( this.mm.params['setPageCnt.0'], [1] );
		assertEQ ( this.mm.params['setPageCnt.1'], [2] );
	};
	
	this.test__setTabListItems = function(){
		this.mm.mock(this.lc(), '_travelTabList');
		this.lc()._setTabListItems();
		assertEQ ( this.mm.walkLog, '_travelTabList' );
		assertEQ ( this.mm.params['_travelTabList'], [this.lc()._setListItem] );
	};
	
	this.test__setTabListItems_setListItem = function(){
		g_platform = 'qzone';
		this.lc()._setTabListItems(); // init _setListItem function
		
		var p_resIdx = 1;
		var p_res = {roleName:'name', itemres:{smallpic:1, mini_smallpic:1001}, ydInfo:{is_yellow_vip:1,yellow_vip_level:2} };
		var p_item = {exsubs:{icon:{}, name:{}}};
		
		this.mm.mock(ItemResUtil, 'initItemres' );
		this.mm.mock(IMG, 'setBKImage' );
		this.mm.mock(TQ, 'setHtml' );
		
		this.lc()._setListItem(p_resIdx, p_res, p_item);
		assertEQ ( this.mm.walkLog, 'initItemres,setBKImage,setHtml' );
		assertEQ ( this.mm.params['initItemres'], [p_res, 'icon'] );
		assertEQ ( this.mm.params['setBKImage'], [p_item.exsubs.icon,IMG.makeSmallImg(1001)] );
		assertEQ ( this.mm.params['setHtml'], [p_item.exsubs.name, RStrUtil.makeYellowDiamondRoleName('name', p_res.ydInfo)] );
	};
	
	this.test__setTabListItemsBtnCallers = function(){
		this.mm.mock(this.lc(), '_travelTabList');
		this.lc()._setTabListItemsBtnCallers();
		assertEQ ( this.mm.walkLog, '_travelTabList' );
		assertEQ ( this.mm.params['_travelTabList'], [this.lc()._setListItemBtnCaller] );	
	};

	this.test__setTabListItemsBtnCallers__setListItemBtnCaller = function(){
		this.lc()._setTabListItemsBtnCallers(); // init _setListItemBtnCaller function
		
		var p_resIdx = 1;
		var p_res = {roleName:'name' };
		var p_item = {exsubs:{farmBtn:new ComButton(this.g, MockDom.snew())}};
		
		this.mm.mock(p_item.exsubs.farmBtn, 'setId')
		this.mm.mock(p_item.exsubs.farmBtn, 'setCaller')
		this.lc()._setListItemBtnCaller(p_resIdx, p_res, p_item);
		assertEQ ( this.mm.params['setId'], [p_resIdx] );
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onClickTopFarmBtn}] );
	};	
	
	this.test__travelTabList = function(){
		var g_params = [];
		var _callBack = function(rItem, item, itemIdx){
			g_params.push([rItem, item, itemIdx]);
		};
		
		var r_resList = [{id:1},{id:2},{id:3}];
		this.mm.mock( this.lc(), '_getTabResList', [r_resList] );
		this.mm.mock( this.lc(), '_getListRangeByPageIdx', [{start:1, count:2}] );
		
		this.lc()._travelTabList(_callBack);
		assertEQ ( g_params.length, 4 );
		assertEQ ( g_params[0], [1, r_resList[1], this.lc().m_items.tablist.getTabItems(0).list.getItem(0)] );
		assertEQ ( g_params[1], [2, r_resList[2], this.lc().m_items.tablist.getTabItems(0).list.getItem(1)] );
		assertEQ ( g_params[2], [1, r_resList[1], this.lc().m_items.tablist.getTabItems(1).list.getItem(0)] );
		assertEQ ( g_params[3], [2, r_resList[2], this.lc().m_items.tablist.getTabItems(1).list.getItem(1)] );
	};
	
	this.test__getListRangeByPageIdx = function(){
		this.vb.replace(this.lc(), 'C_ITEM_COUNT', 12);
		var resList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
		assertEQ ( this.lc()._getListRangeByPageIdx(resList, 1), {start:0, count:12} );
		assertEQ ( this.lc()._getListRangeByPageIdx(resList, 2), {start:12, count:2} );
	};
	
	this.test__initTabListSelectItem = function(){
		this.mm.mock( this.lc().m_items.tablist.getTabItems(0).list, 'setCurSel');
		this.mm.mock( this.lc().m_items.tablist.getTabItems(1).list, 'setCurSel');
		this.lc()._initTabListSelectItem();
		assertEQ ( this.mm.walkLog, 'setCurSel,setCurSel' );
		assertEQ ( this.mm.params['setCurSel.0'], [-1] );
		assertEQ ( this.mm.params['setCurSel.1'], [-1] );
	};
	
	this.test__onPageNavigate = function(){
		this.mm.mock(this.lc(), '_updateTabList');
		this.mm.mock(this.lc(), '_updateItemsBlink');
		this.mm.mock(this.lc(), '_initCanGatherFarmFlags');
		this.lc()._onPageNavigate();
		assertEQ ( this.mm.walkLog, '_updateTabList,_updateItemsBlink,_initCanGatherFarmFlags' );
		assertEQ ( this.mm.params['_initCanGatherFarmFlags'], [this.lc()._getCurTabIdx()] );
	};
	
	this.test__onLoginOk = function(){
		this.mm.mock(this.dlg, 'openDlg');
		this.lc()._onLoginOk();
		assertEQ ( this.mm.walkLog, 'openDlg' );
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock( this.lc(), '_updateTabList' );
		this.mm.mock( this.g, 'sendEvent' );
		this.mm.mock( this.lc(), '_onHasApplyMsg' );
		this.mm.mock( this.lc(), '_onChatMsg' );
		
		var ndata = {data:{friends:[{roleId:1}]}};		
		this.lc()._onSvrPkg(ndata);
		assertEQ ( this.mm.walkLog, '_updateTabList,sendEvent' );
		assertEQ ( this.mm.params['sendEvent'], [{eid:EVT.FRIENDLIST, sid:0}] );
		assertEQ ( this.g.getImgr().getFriends().friends, [{roleId:1}] );
		
		this.mm.clear();
		var ndata = {data:{hasApply:1}};		
		this.lc()._onSvrPkg(ndata);
		assertEQ ( this.mm.walkLog, '_onHasApplyMsg' );
		assertEQ ( this.mm.params['_onHasApplyMsg'], [ndata.data.hasApply] );
		
		this.mm.clear();
		var ndata = {data:{chat:{}}};		
		this.lc()._onSvrPkg(ndata);
		assertEQ ( this.mm.walkLog, '_onChatMsg' );
		assertEQ ( this.mm.params['_onChatMsg'], [ndata.data.chat] );
			
		this.mm.clear();
		var ndata = {data:{friends:[{roleId:1}],hasApply:1,chat:{}}};
		this.lc()._onSvrPkg(ndata);
		assertEQ ( this.mm.walkLog, '_updateTabList,sendEvent,_onHasApplyMsg,_onChatMsg' );
	};
	
	this.test__onSvrCanGatherFlags = function(){
		this.mm.mock(this.lc(), '_udpateListItemsGatherFlag');
		var netevent = {data:{}};
		this.lc()._onSvrCanGatherFlags(netevent);
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		netevent = {data:{farmflags:[{roleId:1,canGather:0},{roleId:2,canGather:1}]}};
		this.lc()._onSvrCanGatherFlags(netevent);
		assertEQ ( this.mm.walkLog, '_udpateListItemsGatherFlag,_udpateListItemsGatherFlag' );
		assertEQ ( this.mm.params['_udpateListItemsGatherFlag.0'], [0, netevent.data.farmflags] );
		assertEQ ( this.mm.params['_udpateListItemsGatherFlag.1'], [1, netevent.data.farmflags] );
	};
	
	this.test__onEnemyUpdate = function(){
		this.mm.mock(this.lc(), '_updateTabList' );
		this.lc()._onEnemyUpdate();
		assertEQ ( this.mm.walkLog, '_updateTabList' );
	};
	
	this.test__udpateListItemsGatherFlag = function(){
		this.mm.mock(this.lc(), '_getResListItem', null, function(tabIdx, resIdx){
			assertEQ ( tabIdx, 0);
			if (resIdx == 1) return {roleId:10001};
			if (resIdx == 2) return {roleId:10002};
			if (resIdx == 3) return {roleId:10003};
		});
		var tabIdx = 0;
		var list = this.lc().m_items.tablist.getTabItems(tabIdx).list;
		list.setItemCount(3);
		list.getItem(0).exsubs.farmBtn.setId(1); // residx
		list.getItem(1).exsubs.farmBtn.setId(2); // residx
		list.getItem(2).exsubs.farmBtn.setId(3); // residx
		IMG.setBKImage(list.getItem(2).exsubs.canGatherFlag, IMG.makeImg('farm/cangather.gif') );
		
		var flags = [{roleId:10001, flag:1}, {roleId:10002, flag:0}];
		this.lc()._udpateListItemsGatherFlag(tabIdx, flags);
		assertEQ ( isInclude(IMG.getBKImage(list.getItem(0).exsubs.canGatherFlag), 'farm/cangather.gif'), true );
		assertEQ ( IMG.getBKImage(list.getItem(1).exsubs.canGatherFlag), "url('')" );
		assertEQ ( isInclude(IMG.getBKImage(list.getItem(2).exsubs.canGatherFlag), 'farm/cangather.gif'), true );
	};
	
	this.test__onHasApplyMsg = function(){
		this.mm.mock(this.lc().m_items.applyListBtn, 'startBlinking' );
		this.mm.mock(this.lc(), '_startToggleBtnBlink' );

		this.lc()._onHasApplyMsg(1);
		assertEQ ( this.mm.params['startBlinking'], [0] );
		assertEQ ( this.mm.params['_startToggleBtnBlink'], [-1] );
	};
	
	this.test__onChatMsg = function(){
		var r_findChatIdx = 1;
		var r_isMostTopChatDlg = [true];
		var r_getItemIdxInfoByRoleId = [{tabidx:1, itemidx:2, residx:3}];
		this.mm.mock(this.lc(), '_handleChatPkgByChatDlgs', [r_findChatIdx]);
		this.mm.mock(this.lc(), '_isMostTopChatDlg', r_isMostTopChatDlg);
		this.mm.mock(this.lc(), '_getItemIdxInfoByRoleId', r_getItemIdxInfoByRoleId);
		this.mm.mock(this.lc(), '_stopItemBlink');

		this.mm.mock(this.lc(), '_pushToChatCache');
		this.mm.mock(this.lc(), '_handleNewChatEvent');
		this.mm.mock(this.lc(), '_startItemBlink');
		this.mm.mock(this.lc(), '_pushBlinkCache');
		
		var p_netchat = {roleId:10000};
		this.lc()._onChatMsg(p_netchat);
		assertEQ ( this.mm.walkLog, '_handleChatPkgByChatDlgs,_isMostTopChatDlg,_getItemIdxInfoByRoleId,_stopItemBlink' );
		assertEQ ( this.mm.params['_handleChatPkgByChatDlgs'], [p_netchat] );
		assertEQ ( this.mm.params['_isMostTopChatDlg'], [r_findChatIdx] );
		assertEQ ( this.mm.params['_getItemIdxInfoByRoleId'], [p_netchat.roleId] );
		assertEQ ( this.mm.params['_stopItemBlink'], [1, 2] );
		
		this.mm.clear();
		r_isMostTopChatDlg[0] = false;
		this.lc()._onChatMsg(p_netchat);
		assertEQ ( this.mm.walkLog, '_handleChatPkgByChatDlgs,_isMostTopChatDlg,_pushToChatCache,_handleNewChatEvent,_startItemBlink,_getItemIdxInfoByRoleId,_pushBlinkCache' );
		assertEQ ( this.mm.params['_startItemBlink'], [p_netchat, r_findChatIdx] );
		assertEQ ( this.mm.params['_pushBlinkCache'], [3] );
		assertEQ ( this.mm.params['_getItemIdxInfoByRoleId'], [p_netchat.roleId] );
		assertEQ ( this.mm.params['_pushBlinkCache'], [3] );
	};
	
	this.test__pushBlinkCache = function(){
		this.mm.mock(this.lc(), '_startHeadIconBlink');
		this.lc().m_blinkResIdxs = [1,2,3];
		this.lc()._pushBlinkCache(1); // (resid)
		assertEQ ( this.lc().m_blinkResIdxs, [2,3,1] );
		assertEQ ( this.mm.params['_startHeadIconBlink'], [1] );
	};
	
	this.test__popBlinkCache = function(){
		this.mm.mock(this.lc(), '_stopHeadIconBlink');
		this.mm.mock(this.lc(), '_startHeadIconBlink');
		this.lc().m_blinkResIdxs = {};
		this.lc().m_blinkResIdxs = [1,2];
		this.lc()._popBlinkCache(1); // (resid)
		assertEQ ( this.lc().m_blinkResIdxs, [2] );
		assertEQ ( this.mm.walkLog, '_stopHeadIconBlink,_startHeadIconBlink' );
		assertEQ ( this.mm.params['_stopHeadIconBlink'], [1] );
		assertEQ ( this.mm.params['_startHeadIconBlink'], [2] );
	};
	
	this.test__isBlinkResIdx = function(){
		this.lc().m_blinkResIdxs = [1,2];
		assertEQ ( this.lc()._isBlinkResIdx(1), true );
		assertEQ ( this.lc()._isBlinkResIdx(2), true );
		assertEQ ( this.lc()._isBlinkResIdx(3), false );
	};
	
	this.test__handleChatPkgByChatDlgs = function(){
		var chat1 = new function(){ this.handleChatPkg=function(){}; };
		var chat2 = new function(){ this.handleChatPkg=function(){}; };
		this.mm.mock(chat1, 'handleChatPkg', [EVENT_RET_OK] );
		this.mm.mock(chat2, 'handleChatPkg', [EVENT_RET_BREAK] );
		this.lc().m_chatDlgs = [{chat:chat1},{chat:chat2}];
		
		var p_netchat = {};
		assertEQ ( this.lc()._handleChatPkgByChatDlgs(p_netchat), 1 );
		assertEQ ( this.mm.params['handleChatPkg.0'], [p_netchat] );
		assertEQ ( this.mm.params['handleChatPkg.1'], [p_netchat] );
			
		this.lc().m_chatDlgs = [];
		assertEQ ( this.lc()._handleChatPkgByChatDlgs(p_netchat), -1 );
	};
	
	this.test__pushToChatCache = function(){
		this.lc().m_chatCache = [];
		
		var p_findChatIdx = 0;
		var p_netchat = {};
		this.lc()._pushToChatCache(p_findChatIdx, p_netchat);
		assertEQ ( this.lc().m_chatCache, [] );
			
		var p_findChatIdx = -1;
		this.lc()._pushToChatCache(p_findChatIdx, p_netchat);
		assertEQ ( this.lc().m_chatCache, [p_netchat] );
	};
	
	this.test__handleNewChatEvent = function(){
		this.mm.mock(this.lc(), '_startToggleBtnBlink' );
		
		var p_findChatIdx = 0;
		var p_netchat = {};
		this.lc()._handleNewChatEvent(p_findChatIdx, p_netchat);
		assertEQ ( this.mm.params['_startToggleBtnBlink'], [this.lc().C_NEWCHAT_DURATION_MS] );
		
		this.mm.clear();
		p_findChatIdx = -1;
		this.lc()._handleNewChatEvent(p_findChatIdx, p_netchat);
		assertEQ ( this.mm.params['_startToggleBtnBlink'], [-1] );
	};
	
	this.test__startToggleBtnBlink = function(){
		var r_isShow = [true];
		this.mm.mock(this.lc().m_items.toggleBtn, 'startBlinking');
		this.mm.mock(this.lc(), '_isShow', r_isShow);
		
		this.lc()._startToggleBtnBlink(1);
		assertEQ ( this.mm.walkLog,'_isShow');
		
		this.mm.clear();
		r_isShow[0] = false;
		this.lc()._startToggleBtnBlink(1);
		assertEQ ( this.mm.walkLog,'_isShow,startBlinking');
		assertEQ ( this.mm.params['startBlinking'], [1] );
	};
	
	this.test__startItemBlink = function(){
		var p_netchat = {roleId:10000};
		var p_findChatIdx = -1;
			
		var blink1 = BlinkingCtrl.snew(this.g);
		var blink2 = BlinkingCtrl.snew(this.g);
		this.mm.mock(blink1, 'bind');
		this.mm.mock(blink1, 'start');
		this.mm.mock(blink1, 'setCaller');
		this.mm.mock(blink2, 'bind');
		this.mm.mock(blink2, 'start');
		this.mm.mock(blink2, 'setCaller');
		
		var r_getItemIdxInfoByRoleId = [{tabidx:1, itemidx:2, residx:3}];
		var r_getUIListItem = [null];
		var r_getItemBlink = [{tabidx:0,itemidx:0,b:blink1}];
		var r_allocItemBlink = [{tabidx:0,itemidx:0,b:blink2}];
		this.mm.mock( this.lc(), '_getItemIdxInfoByRoleId', r_getItemIdxInfoByRoleId );
		this.mm.mock( this.lc(), '_getUIListItem', r_getUIListItem );
		this.mm.mock( this.lc(), '_getItemBlink', r_getItemBlink );
		this.mm.mock( this.lc(), '_allocItemBlink', r_allocItemBlink );
		
		this.lc().m_dlg = null;
		this.lc()._startItemBlink(p_netchat, p_findChatIdx);
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.lc().m_dlg = {};
		this.lc()._startItemBlink(p_netchat, p_findChatIdx);
		assertEQ ( this.mm.walkLog, '_getItemIdxInfoByRoleId,_getUIListItem' );
		assertEQ ( this.mm.params['_getUIListItem'], [1,2] );
		
		this.mm.clear();
		r_getUIListItem[0] = {exsubs:{icon:{}}};
		this.lc()._startItemBlink(p_netchat, p_findChatIdx);
		assertEQ ( this.mm.walkLog, '_getItemIdxInfoByRoleId,_getUIListItem,_getItemBlink,bind,start,setCaller' );
		assertEQ ( this.mm.params['_getItemBlink'], [1,2] );
		assertEQ ( this.mm.params['bind'], [r_getUIListItem[0].exsubs.icon, {tabidx:1, itemidx:2}] );
		assertEQ ( this.mm.params['start'], [-1] );
		assertEQ ( this.mm.params['setCaller'], [{self:this.dlg, caller:this.lc()._onItemBlinkEnd}] );
		assertEQ ( r_getItemBlink[0].tabidx, 1 );
		assertEQ ( r_getItemBlink[0].itemidx, 2 );
		
		this.mm.clear();
		p_findChatIdx = 0;
		this.lc()._startItemBlink(p_netchat, p_findChatIdx);
		assertEQ ( this.mm.params['start'], [this.lc().C_NEWCHAT_DURATION_MS] );
		
		this.mm.clear();
		r_getItemBlink[0] = null;
		this.lc()._startItemBlink(p_netchat, p_findChatIdx);
		assertEQ ( this.mm.walkLog, '_getItemIdxInfoByRoleId,_getUIListItem,_getItemBlink,_allocItemBlink,bind,start,setCaller' );
	};
	
	this.test__startHeadIconBlink = function(){
		var r_getResListItem = [null];
		this.mm.mock(this.lc(), '_getCurTabIdx', [0]);
		this.mm.mock(this.lc(), '_getResListItem', r_getResListItem);
		this.mm.mock(this.lc().m_headiconblink, 'start');
		
		this.lc()._startHeadIconBlink(1); // resid
		assertEQ ( this.mm.walkLog, '_getCurTabIdx,_getResListItem' );
		assertEQ ( this.mm.params['_getResListItem'], [0, 1] );
		
		this.mm.clear();
		r_getResListItem[0] = {roleId:10000, icon:101, roleName:'role'};
		this.lc()._startHeadIconBlink(1); // resid
		assertEQ ( this.mm.params['start'], [-1] );
		assertEQ ( isInclude(IMG.getBKImage(this.lc().m_items.headicon), '101_mini'), true);
		assertEQ ( TQ.getTextEx(this.lc().m_items.headname), 'role');
	};
	
	this.test__stopHeadIconBlink = function(){
		this.mm.mock(this.lc().m_headiconblink, 'stop');
		this.lc()._stopHeadIconBlink(1); // resid
		assertEQ ( IMG.getBKImage(this.lc().m_items.headicon), "url('')");
		assertEQ ( TQ.getTextEx(this.lc().m_items.headname), '');
		assertEQ ( this.mm.walkLog, 'stop' );
	};
	
	this.test__createHeadIconBlink = function(){
		this.lc().m_headiconblink = null;
		
		var ctrl = BlinkingCtrl.snew(this.g);
		this.mm.mock(BlinkingCtrl, 'snew', [ctrl]);
		this.mm.mock(ctrl, 'bind');
		
		this.lc()._createHeadIconBlink();
		assertEQ ( this.lc().m_headiconblink, ctrl );
		assertEQ ( this.mm.params['bind'], [this.lc().m_items.headiconname, {}] );
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
	
	this.test__onItemBlinkEnd = function(){
		var r_getUIListItem = [null];
		this.mm.mock(this.lc(), '_getUIListItem', r_getUIListItem);
		this.mm.mock(IMG, 'setBKImage');
		this.mm.mock(this.lc(), '_setTalkFlagPos');
		
		var p_param = {tabidx:1, itemidx:2};
		this.lc()._onItemBlinkEnd(p_param);
		assertEQ ( this.mm.walkLog, '_getUIListItem' );
		assertEQ ( this.mm.params['_getUIListItem'], [1,2] );
		
		this.mm.clear();
		r_getUIListItem[0] = {exsubs:{talkflag:{}}};
		this.lc()._onItemBlinkEnd(p_param);
		assertEQ ( this.mm.walkLog, '_getUIListItem,setBKImage,_setTalkFlagPos' );
		assertEQ ( this.mm.params['setBKImage'], [r_getUIListItem[0].exsubs.talkflag, IMG.getItemTalk()] );
		assertEQ ( this.mm.params['_setTalkFlagPos'], [r_getUIListItem[0]] );
	};
	
	this.test__onClickToggleBtn = function(){
		this.mm.mock(this.lc(), '_resetPos');
		this.mm.mock(this.lc().m_items.toggleBtn, 'stopBlinking');
		this.lc()._onClickToggleBtn();
		assertEQ ( this.mm.walkLog, '_resetPos,stopBlinking' );
	};
	
	this.test__onClickAddBtn = function(){
		this.mm.mock(this.g.getGUI(), 'sysMsgTips' );
		this.mm.mock(FriendSender, 'sendApplyFriend' );
		
		this.lc().m_items.addName.value = '';
		this.lc()._onClickAddBtn();
		assertEQ ( this.mm.walkLog, 'sysMsgTips' );
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, rstr.ids[100050].msg] );
		
		this.mm.clear();
		this.lc().m_items.addName.value = 'abc';
		this.lc()._onClickAddBtn();
		assertEQ ( this.mm.walkLog, 'sendApplyFriend' );
		assertEQ ( this.mm.params['sendApplyFriend'], [this.g, 'abc'] );
	};
	
	this.test__onClickApplyListBtn = function(){
		this.mm.mock(this.lc().m_items.applyListBtn, 'stopBlinking' );
		this.mm.mock( UIM, 'openDlg' );
		this.lc()._onClickApplyListBtn();
		assertEQ ( this.mm.walkLog, 'stopBlinking,openDlg');
		assertEQ ( this.mm.params['openDlg'], ['friendapplylist'] );
	};
	
	this.test__onClickRefreshBtn = function(){
		this.mm.mock(this.lc(), '_initCanGatherFarmFlags' );
		this.lc()._onClickRefreshBtn();
		assertEQ ( this.mm.walkLog, '_initCanGatherFarmFlags,_initCanGatherFarmFlags' );
		assertEQ ( this.mm.params['_initCanGatherFarmFlags.0'], [0]);
		assertEQ ( this.mm.params['_initCanGatherFarmFlags.1'], [1]);
	};
	
	this.test__onSelectListItem = function(){
		this.mm.mock(this.lc(), '_onOpEnterFarm');
		this.mm.mock(this.lc(), '_collapseListSelItem' );
		this.mm.mock(this.lc(), '_expandCurSelItem' );
		
		this.lc().m_fromTopFarmBtn = false;
		this.lc()._onSelectListItem(null, 1);
		assertEQ ( this.mm.walkLog, '_collapseListSelItem,_expandCurSelItem' );
		assertEQ ( this.mm.params['_collapseListSelItem'], [1] );
		assertEQ ( this.mm.params['_expandCurSelItem'], [1] );
		
		this.mm.clear();
		this.lc().m_fromTopFarmBtn = true;
		this.lc()._onSelectListItem(null, 1);
		assertEQ ( this.mm.walkLog, '_onOpEnterFarm' );
		assertEQ ( this.lc().m_fromTopFarmBtn, false );
	};
	
	this.test__onClickHeadIconName = function(){
		var r_getResListItem = [null];
		this.mm.mock(this.lc(), '_openChatDlgAndHandleCache' );
		this.mm.mock(this.lc(), '_getCurTabIdx', [0] );
		this.mm.mock(this.lc(), '_getResListItem', r_getResListItem );
		this.mm.mock(this.lc(), '_getItemIdxInfoByRoleId', [{itemidx:1}] );
		this.lc().m_blinkResIdxs = [];
		
		this.lc()._onClickHeadIconName();
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.lc().m_blinkResIdxs = [2];
		this.lc()._onClickHeadIconName();
		assertEQ ( this.mm.walkLog, '_getCurTabIdx,_getResListItem' );
		assertEQ ( this.mm.params['_getResListItem'], [0, 2] );
		
		this.mm.clear();
		r_getResListItem[0] = {roleId:10000};
		this.lc()._onClickHeadIconName();
		assertEQ ( this.mm.params['_getItemIdxInfoByRoleId'], [10000] );
		assertEQ ( this.mm.params['_openChatDlgAndHandleCache'], [{roleId:10000}, 0, 1, 2] );
	};
	
	this.test__resetPos = function(){
		this.mm.mock(this.lc(), '_resetDlgVisible');
		this.mm.mock(this.lc(), '_resetDlgPos');
		this.mm.mock(this.lc(), '_resetToggleBtnPos');
		this.mm.mock(this.lc(), '_resetToggleBtnZIndex');
		this.lc()._resetPos();
		if ( !TQ.isMobile() ) {
			assertEQ ( this.mm.walkLog, '_resetDlgVisible,_resetDlgPos,_resetToggleBtnPos,_resetToggleBtnZIndex' );
		}
	};
	
	this.test__resetDlgPos = function(){
		this.mm.mock(this.g.getWinSizer(), 'getValidClientSize', [{cx:1000,cy:800}] );
		this.mm.mock(this.lc().m_dlg, 'setPosition');
		this.lc()._resetDlgPos();
		if ( !TQ.isMobile() ) {
			assertEQ ( this.mm.params['setPosition'], [{x:1000-this.lc().C_DLG_W, y:this.lc().C_DLG_TOP}] );
		}
	};
	
	this.test__resetDlgVisible = function(){
		this.mm.mock(this.lc(), '_initCanGatherFarmFlags');
		this.lc().m_items.toggleBtn.setPress(false);
		this.lc()._resetDlgVisible();
		assertEQ ( this.lc().m_dlg.isShow(), false );
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_items.toggleBtn.setPress(true);
		this.lc()._resetDlgVisible();
		assertEQ ( this.lc().m_dlg.isShow(), true );
		assertEQ ( this.mm.walkLog, '_initCanGatherFarmFlags,_initCanGatherFarmFlags' );
		assertEQ ( this.mm.params['_initCanGatherFarmFlags.0'], [0]);
		assertEQ ( this.mm.params['_initCanGatherFarmFlags.1'], [1]);
	};
	
	this.test__resetToggleBtnPos = function(){
		if ( TQ.isMobile() ) return;
		this.mm.mock(this.g.getWinSizer(), 'getValidClientSize', [{cx:1000,cy:800}] );
		this.mm.mock( TQ, 'setDomPos' );
		this.lc().m_items.toggleBtn.setPress(false);
		this.lc()._resetToggleBtnPos();
		assertEQ ( this.mm.params['setDomPos'], [this.lc().m_items.toggleBtn.getParent(), 1000-this.lc().C_TOGGLE_W, this.lc().C_DLG_TOP+this.lc().C_TOGGLE_REF_TOP] );
	
		this.lc().m_items.toggleBtn.setPress(true);
		this.lc()._resetToggleBtnPos();
		assertEQ ( this.mm.params['setDomPos'], [this.lc().m_items.toggleBtn.getParent(), 1000-this.lc().C_DLG_W - this.lc().C_TOGGLE_W, this.lc().C_DLG_TOP+this.lc().C_TOGGLE_REF_TOP] );
	};
	
	this.test__resetToggleBtnZIndex = function(){
		if ( TQ.isMobile() ) return;
		var r_isShow = [false];
		this.mm.mock(this.lc().m_dlg, 'getZIndex', [1000]);
		this.mm.mock(this.lc(), '_isShow', r_isShow);
		
		this.lc()._resetToggleBtnZIndex();
		assertEQ ( TQ.getCSS(this.lc().m_items.toggleBtn.getParent(), 'zIndex'), 9999 );
		
		r_isShow[0] = true;
		this.lc()._resetToggleBtnZIndex();
		assertEQ ( TQ.getCSS(this.lc().m_items.toggleBtn.getParent(), 'zIndex'), 1000 );
	};
	
	this.test__collapseListSelItem = function(){
		var r_tabIdx = 0;
		var r_curSelResIdx = 0;
		var r_cu
		this.mm.mock( this.lc(), '_getCurTabIdx', [r_tabIdx] );
		this.mm.mock( this.lc(), '_getCurSelResItemIdx', [r_curSelResIdx] );
		this.mm.mock( this.lc(), '_setListItemHeight' );
		this.mm.mock( this.lc(), '_setListItemIconAndNameRect' );
		this.mm.mock( this.lc(), '_setListItemIconSmallBkImg' );
		this.mm.mock( this.lc(), '_removeListItemOpDom' );
		this.mm.mock( this.lc(), '_setTalkFlagPos' );
		this.mm.mock( this.lc(), '_getResIdxByUIItem', [100] );
		
		this.lc().m_lastTabListSelIdxs[r_tabIdx] = {resIdx:0, uiItem:null};
		this.lc()._collapseListSelItem();
		assertStrRepeatCount ( this.mm.walkLog, '_setListItemHeight', 0 );
		
		this.mm.clear();
		this.lc().m_lastTabListSelIdxs[r_tabIdx] = {resIdx:1, uiItem:null};
		this.lc()._collapseListSelItem();
		assertStrRepeatCount ( this.mm.walkLog, '_setListItemHeight', 0 );
		
		this.mm.clear();
		this.lc().m_lastTabListSelIdxs[r_tabIdx] = {resIdx:1, uiItem:{name:'uiItem'}};
		this.lc()._collapseListSelItem();
		assertEQ ( this.mm.params['_setListItemHeight'], [{name:'uiItem'}, this.lc().C_ITEM_H] );
		assertEQ ( this.mm.params['_setListItemIconAndNameRect'], [{name:'uiItem'}, this.lc().C_ITEM_ICON_W, this.lc().C_ITEM_ICON_H
			,this.lc().C_ITEM_NAME_L, this.lc().C_ITEM_NAME_T, this.lc().C_ITEM_NAME_W, this.lc().C_ITEM_NAME_H] );
		assertEQ ( this.mm.params['_setListItemIconSmallBkImg'], [{name:'uiItem'}, r_tabIdx, 100] );
		assertEQ ( this.mm.params['_removeListItemOpDom'], [{name:'uiItem'}, r_tabIdx] );
		assertEQ ( this.mm.params['_setTalkFlagPos'], [{name:'uiItem'}] );
		assertEQ ( this.mm.params['_getResIdxByUIItem'], [{name:'uiItem'}] );
	};
	
	this.test__expandCurSelItem = function(){
		var r_tabIdx = 0;
		var r_curSelResIdx = 0;
		var r_curSelItemIdx = 1;
		var r_uiItem = [null];
		this.mm.mock( this.lc(), '_getCurTabIdx', [r_tabIdx] );
		this.mm.mock( this.lc(), '_getCurSelResItemIdx', [r_curSelResIdx] );
		this.mm.mock( this.lc(), '_getCurSelUIItem', r_uiItem );
		this.mm.mock( this.lc(), '_setListItemHeight' );
		this.mm.mock( this.lc(), '_setListItemIconAndNameRect' );
		this.mm.mock( this.lc(), '_setListItemIconBigBkImg' );
		this.mm.mock( this.lc(), '_appendListItemOpDom' );
		this.mm.mock( this.lc(), '_getCurSelItemIdx', [r_curSelItemIdx] );
		this.mm.mock( this.lc(), '_setTalkFlagPos' );
		
		this.lc().m_lastTabListSelIdxs[r_tabIdx] = {resIdx:0, uiItem:null};
		this.lc()._expandCurSelItem();
		assertStrRepeatCount ( this.mm.walkLog, '_setListItemHeight', 0 );
		
		this.mm.clear();
		this.lc().m_lastTabListSelIdxs[r_tabIdx] = {resIdx:1, uiItem:null};
		this.lc()._expandCurSelItem();
		assertStrRepeatCount ( this.mm.walkLog, '_setListItemHeight', 0 );
		assertEQ ( this.lc().m_lastTabListSelIdxs[r_tabIdx], {resIdx:0, uiItem:null} );
		
		this.mm.clear();
		r_uiItem[0] = {name:'uiItem'};
		this.lc().m_lastTabListSelIdxs[r_tabIdx] = {resIdx:1, uiItem:null};
		this.lc()._expandCurSelItem();
		assertEQ ( this.lc().m_lastTabListSelIdxs[r_tabIdx], {resIdx:0, uiItem:r_uiItem[0]} );
		assertEQ ( this.mm.params['_setListItemHeight'], [r_uiItem[0], this.lc().C_ITEM_SEL_H] );
		assertEQ ( this.mm.params['_setListItemIconAndNameRect'], [r_uiItem[0], this.lc().C_ITEM_ICON_SEL_W, this.lc().C_ITEM_ICON_SEL_W
			,this.lc().C_ITEM_NAME_SEL_L, this.lc().C_ITEM_NAME_SEL_T, this.lc().C_ITEM_NAME_SEL_W, this.lc().C_ITEM_NAME_SEL_H] );
		assertEQ ( this.mm.params['_setListItemIconBigBkImg'], [r_uiItem[0], r_tabIdx, r_curSelResIdx] );
		assertEQ ( this.mm.params['_appendListItemOpDom'], [r_uiItem[0], r_tabIdx, r_curSelItemIdx] );
		assertEQ ( this.mm.params['_setTalkFlagPos'], [r_uiItem[0]] );	
	};
	
	this.test__setListItemHeight = function(){
		this.lc()._setListItemHeight(this.item, 100);
		assertEQ ( TQ.getCSS(this.item.item, 'height'), '100px' );
		assertEQ ( TQ.getCSS(this.item.item.childNodes[0], 'height'), '100px' );
	};
	
	this.test__setListItemIconAndNameRect = function(){
		this.lc()._setListItemIconAndNameRect(this.item, 10, 20, 1, 2, 3, 4);
		assertEQ ( TQ.getCSS(this.item.exsubs.icon, 'width'), '10px' );
		assertEQ ( TQ.getCSS(this.item.exsubs.icon, 'height'), '20px' );
		assertEQ ( TQ.getCSS(this.item.exsubs.name, 'left'), '1px' );
		assertEQ ( TQ.getCSS(this.item.exsubs.name, 'top'), '2px' );
		assertEQ ( TQ.getCSS(this.item.exsubs.name, 'width'), '3px' );
		assertEQ ( TQ.getCSS(this.item.exsubs.name, 'height'), '4px' );
	};
	
	this.test__setListItemIconBigBkImg = function(){
		var r_itemres = [null];
		this.mm.mock( this.lc(), '_getResListItem', r_itemres);
		this.mm.mock( IMG, 'setBKImage' );
		this.lc()._setListItemIconBigBkImg(this.item, 1, 2);
		assertEQ ( this.mm.walkLog, '_getResListItem' );
		assertEQ ( this.mm.params['_getResListItem'], [1,2] );
		
		r_itemres[0] = {itemres:{bigpic:1, mid_smallpic:10002}};
		this.lc()._setListItemIconBigBkImg(this.item, 1, 2);
		assertEQ ( this.mm.params['setBKImage'], [this.item.exsubs.icon, IMG.makeSmallImg(10002)] );
	};
	
	this.test__setListItemIconSmallBkImg = function(){
		var r_itemres = [null];
		this.mm.mock( this.lc(), '_getResListItem', r_itemres);
		this.mm.mock( IMG, 'setBKImage' );
		this.lc()._setListItemIconSmallBkImg(this.item, 1, 2);
		assertEQ ( this.mm.walkLog, '_getResListItem' );
		assertEQ ( this.mm.params['_getResListItem'], [1,2] );
		
		r_itemres[0] = {itemres:{smallpic:1, mini_smallpic:10001}};
		this.lc()._setListItemIconSmallBkImg(this.item, 1, 2);
		assertEQ ( this.mm.params['setBKImage'], [this.item.exsubs.icon, IMG.makeSmallImg(10001)] );
	};
	
	this.test__removeListItemOpDom = function(){
		this.mm.mock( TQ, 'remove' );
		this.lc()._removeListItemOpDom(this.item, 0);
		assertEQ ( this.mm.params['remove'], [this.item.item.childNodes[0], this.lc().m_tabListOps[0].opDom ] );
	};
	
	this.test__appendListItemOpDom = function(){
		var opBtn = this.lc().m_tabListOps[0].opBtns[0];
		opBtn.setId(1+10*100);
		
		this.mm.mock( TQ, 'append' );
		this.lc()._appendListItemOpDom(this.item, 0, 11);
		assertEQ ( this.mm.params['append'], [this.item.item.childNodes[0], this.lc().m_tabListOps[0].opDom ] );
		assertEQ ( opBtn.getId(), 1 + 11*100);
	};
	
	this.test__onChatDlgUp = function(){
		this.mm.mock(this.lc(), '_getItemIdxInfoByRoleId', [{tabidx:0, itemidx:1, residx:2}] );
		this.mm.mock(this.lc(), '_stopItemBlink' );
		this.mm.mock(this.lc(), '_popBlinkCache' );
		this.lc()._onChatDlgUp({roleId:10000});
		assertEQ ( this.mm.walkLog, '_getItemIdxInfoByRoleId,_stopItemBlink,_popBlinkCache'  );
		assertEQ ( this.mm.params['_getItemIdxInfoByRoleId'], [10000] );
		assertEQ ( this.mm.params['_stopItemBlink'], [0, 1] );
		assertEQ ( this.mm.params['_popBlinkCache'], [2] );
	};
	
	this.test__onDblClickListItem = function(){
		var r_getCurTabIdx = [0];
		this.mm.mock( this.lc(), '_getCurTabIdx', r_getCurTabIdx );
		this.mm.mock( this.lc(), '_onOpTalkWith' );
		this.lc()._onDblClickListItem(null, 0);
		assertEQ ( this.mm.walkLog, '_getCurTabIdx,_onOpTalkWith' );
		
		this.mm.clear();
		r_getCurTabIdx[0] = 1;
		this.lc()._onDblClickListItem(null, 0);
		assertEQ ( this.mm.walkLog, '_getCurTabIdx' );
	};
	
	this.test__onClickTopFarmBtn = function(){
		this.lc().m_fromTopFarmBtn = false;
		this.lc()._onClickTopFarmBtn()
		assertEQ ( this.lc().m_fromTopFarmBtn, true );
	};
	
	this.test__onClickItemOpBtn = function(){
		var r_getCurSelResItem = [{roleId:10000,died:1}];
		this.mm.mock(this.lc(), '_setListCurSelByOpBtnId');
		this.mm.mock(this.lc(), '_getCurSelResItem', r_getCurSelResItem);
		this.mm.mock(this.lc(), '_onOpEnterFarm');
		this.mm.mock(this.lc(), '_onOpTalkWith');
		this.mm.mock(this.lc(), '_onOpShowDetail');
		this.mm.mock(this.lc(), '_onOpWriteLetter');
		this.mm.mock(this.lc(), '_onOpDeleteFriend');
		
		var p_id = this.lc().C_ITEMOP_ENTERFARM + 10*100;
		this.lc()._onClickItemOpBtn(p_id);
		assertEQ ( this.mm.params['_setListCurSelByOpBtnId'], [p_id] );
		assertEQ ( this.mm.walkLog, '_setListCurSelByOpBtnId,_getCurSelResItem' );
		assertEQ ( TestCaseSysTip.getSystip(), rstr.friend.maindlg.tip.opDiedFriend  );
		
		TestCaseSysTip.clearTip();
		this.mm.clear();
		var p_id = this.lc().C_ITEMOP_TALK + 10*100;
		this.lc()._onClickItemOpBtn(p_id);
		assertEQ ( this.mm.walkLog, '_setListCurSelByOpBtnId,_getCurSelResItem' );
		assertEQ ( TestCaseSysTip.getSystip(), rstr.friend.maindlg.tip.opDiedFriend  );
		
		TestCaseSysTip.clearTip();
		this.mm.clear();
		var p_id = this.lc().C_ITEMOP_LETTER + 10*100;
		this.lc()._onClickItemOpBtn(p_id);
		assertEQ ( this.mm.walkLog, '_setListCurSelByOpBtnId,_getCurSelResItem' );
		assertEQ ( TestCaseSysTip.getSystip(), rstr.friend.maindlg.tip.opDiedFriend  );
		
		TestCaseSysTip.clearTip();
		this.mm.clear();
		var p_id = this.lc().C_ITEMOP_DETAIL + 10*100;
		this.lc()._onClickItemOpBtn(p_id);
		assertEQ ( this.mm.walkLog, '_setListCurSelByOpBtnId,_onOpShowDetail' );
		
		TestCaseSysTip.clearTip();
		this.mm.clear();
		var p_id = this.lc().C_ITEMOP_DEL + 10*100;
		this.lc()._onClickItemOpBtn(p_id);
		assertEQ ( this.mm.walkLog, '_setListCurSelByOpBtnId,_onOpDeleteFriend' );
		
		TestCaseSysTip.clearTip();
		this.mm.clear();
		r_getCurSelResItem[0] = {roleId:10000,died:0};
		var p_id = this.lc().C_ITEMOP_ENTERFARM + 10*100;
		this.lc()._onClickItemOpBtn(p_id);
		assertEQ ( this.mm.walkLog, '_setListCurSelByOpBtnId,_getCurSelResItem,_onOpEnterFarm' );
		assertEQ ( TestCaseSysTip.getSystip(), ''  );
		
		TestCaseSysTip.clearTip();
		this.mm.clear();
		var p_id = this.lc().C_ITEMOP_TALK + 10*100;
		this.lc()._onClickItemOpBtn(p_id);
		assertEQ ( this.mm.walkLog, '_setListCurSelByOpBtnId,_getCurSelResItem,_onOpTalkWith' );
		assertEQ ( TestCaseSysTip.getSystip(), ''  );
		
		TestCaseSysTip.clearTip();
		this.mm.clear();
		var p_id = this.lc().C_ITEMOP_LETTER + 10*100;
		this.lc()._onClickItemOpBtn(p_id);
		assertEQ ( this.mm.walkLog, '_setListCurSelByOpBtnId,_getCurSelResItem,_onOpWriteLetter' );
		assertEQ ( TestCaseSysTip.getSystip(), ''  );
		
	};
	
	this.test__onOpEnterFarm = function(){
		this.mm.mock(this.lc(), '_getCurSelResItem', [{roleId:10000}]);
		this.mm.mock(UIM, 'closeMapPanels');
		
		var farmPanel = new function(){this.open=function(){};};
		if (!UIM.getPanel('farm')) UIM.regPanel('farm', farmPanel);
		this.mm.mock(UIM.getPanel('farm'), 'open');
		
		this.lc()._onOpEnterFarm();
		assertEQ ( this.mm.walkLog, '_getCurSelResItem,closeMapPanels,open' );
		assertEQ ( this.mm.params['open'], [10000]);
	};
	
	this.test__onOpTalkWith = function(){
		this.mm.mock(this.lc(), '_getCurSelResItem', [{name:'item'}]);
		this.mm.mock(this.lc(), '_getCurTabIdx', [0]);
		this.mm.mock(this.lc(), '_getCurSelItemIdx',[1]);
		this.mm.mock(this.lc(), '_getCurSelResItemIdx',[2]);
		this.mm.mock(this.lc(), '_openChatDlgAndHandleCache');
		
		this.lc()._onOpTalkWith();
		assertEQ ( this.mm.params['_openChatDlgAndHandleCache'], [{name:'item'}, 0, 1, 2] );
	};
	
	this.test__onOpShowDetail = function(){
		this.mm.mock(this.lc(), '_getCurSelResItem', [{gridId:10}]);
		this.mm.mock(OutFieldSender, 'sendGetFieldDetail' );
		this.lc()._onOpShowDetail();
		assertEQ ( this.mm.params['sendGetFieldDetail'], [this.g, 10] );
	};
	
	this.test__onOpWriteLetter = function(){
		this.mm.mock( this.lc(), '_getCurSelResItem', [{roleName:'friend'}] );
		this.mm.mock( UIM.getDlg('writeletter'), 'openDlg' );
		this.mm.mock( UIM.getDlg('writeletter'), 'clear' );
		this.mm.mock( UIM.getDlg('writeletter'), 'setRecv' );
		this.mm.mock( UIM.getDlg('writeletter'), 'setFocus' );
		
		this.lc()._onOpWriteLetter();
		assertEQ ( this.mm.walkLog, 'openDlg,clear,_getCurSelResItem,setRecv,setFocus' );
		assertEQ ( this.mm.params['setRecv'], ['friend'] );
		assertEQ ( this.mm.params['setFocus'], ['title'] );
	};
	
	this.test__onOpDeleteFriend = function(){
		this.mm.mock( this.lc(), '_getCurSelResItem', [{roleId:10000, roleName:'role'}] );
		this.mm.mock( this.lc(), '_getCurTabIdx', [0] );
		this.mm.mock( this.g.getGUI(), 'msgBox' );
		this.lc()._onOpDeleteFriend();
		assertEQ ( this.mm.walkLog, '_getCurSelResItem,_getCurTabIdx,msgBox' );
		assertEQ ( this.mm.params['msgBox'], [rstr.comm.msgts,
			TQ.format(rstr.friend.maindlg.dels[0], 'role') ,
			MB_F_YESNO, {self:this.dlg, caller:this.lc()._delFriendCallback} ]);
	};
	
	this.test__delFriendCallback = function(){
		this.mm.mock( this.lc(), '_getCurSelResItem', [{roleId:10000, roleName:'role'}] );
		this.lc()._onOpDeleteFriend(); // init _delFriendCallback function
		this.mm.clear();
		
		this.mm.mock(FriendSender, 'sendDeleteFriend');
		this.lc()._delFriendCallback(MB_IDYES);
		assertEQ ( this.mm.walkLog, 'sendDeleteFriend' );
		assertEQ ( this.mm.params['sendDeleteFriend'], [this.g, 10000] );
	};
	
	this.test__isMostTopChatDlg = function(){
		var p_chatDlgIdx = -1;
		assertEQ ( this.lc()._isMostTopChatDlg(p_chatDlgIdx), false );
		
		var chatDlg = MockDialog.snew(this.g);
		this.lc().m_chatDlgs = [{chat:chatDlg}];
		this.mm.mock( this.lc(), '_getMostTopZIndex', [100] );
		var r_getZIndex = [99];
		this.mm.mock( chatDlg.getCore(), 'getZIndex', r_getZIndex );
		
		var p_chatDlgIdx = 0;
		assertEQ ( this.lc()._isMostTopChatDlg(p_chatDlgIdx), false );
		
		r_getZIndex[0] = 100;
		assertEQ ( this.lc()._isMostTopChatDlg(p_chatDlgIdx), true );
		
		r_getZIndex[0] = 101;
		assertEQ ( this.lc()._isMostTopChatDlg(p_chatDlgIdx), true );
	};
	
	this.test__getMostTopZIndex = function(){
		var chatDlg1 = MockDialog.snew(this.g);
		var chatDlg2 = MockDialog.snew(this.g);
		var chatDlg3 = MockDialog.snew(this.g);
		chatDlg1.getCore().setShow(true);
		chatDlg1.getCore().setZIndex(1);
		chatDlg2.getCore().setShow(true);
		chatDlg2.getCore().setZIndex(2);
		chatDlg3.getCore().setShow(false);
		chatDlg3.getCore().setZIndex(3);
		this.lc().m_chatDlgs = [{chat:chatDlg1},{chat:chatDlg2},{chat:chatDlg3}];
		assertEQ ( this.lc()._getMostTopZIndex(), 2 );
	};
	
	this.test__setTalkFlagPos = function(){
		this.item.exsubs.icon.offsetWidth = 100;
		this.item.exsubs.icon.w_ = 100;
		this.item.exsubs.icon.offsetHeight = 200;
		this.item.exsubs.icon.h_ = 200;
		this.item.exsubs.talkflag.offsetWidth = 10;
		this.item.exsubs.talkflag.w_ = 10;
		this.item.exsubs.talkflag.offsetHeight = 20;
		this.item.exsubs.talkflag.h_ = 20;
		this.lc()._setTalkFlagPos(this.item);
		assertEQ ( TQ.getCSS(this.item.exsubs.talkflag, 'left'), '90px' );
		assertEQ ( TQ.getCSS(this.item.exsubs.talkflag, 'top'), '180px' );
	};
	
	this.test__getItemIdxInfoByRoleId = function(){
		this.vb.replace(this.lc(), 'C_ITEM_COUNT', 1);
		this.g.getImgr().getFriends().friends = [{roleId:1},{roleId:2}];
		this.g.getImgr().getFriends().enemys = [{roleId:3},{roleId:4}];
		
		assertEQ ( this.lc()._getItemIdxInfoByRoleId(1), {tabidx:0, residx:0, itemidx:0} );
		assertEQ ( this.lc()._getItemIdxInfoByRoleId(2), {tabidx:0, residx:1, itemidx:-1} );
		assertEQ ( this.lc()._getItemIdxInfoByRoleId(3), {tabidx:1, residx:0, itemidx:0} );
		assertEQ ( this.lc()._getItemIdxInfoByRoleId(4), {tabidx:1, residx:1, itemidx:-1} );
		assertEQ ( this.lc()._getItemIdxInfoByRoleId(5), {tabidx:0, residx:-1, itemidx:-1} );
	};
	
	this.test__getTabResList = function(){
		assertEQ ( this.lc()._getTabResList(0), this.g.getImgr().getFriends().friends);
		assertEQ ( this.lc()._getTabResList(1), this.g.getImgr().getFriends().enemys);
	};
	
	this.test__getUIListItem = function(){
		this.lc().m_items.tablist.getTabItems(0).list.setItemCount(1);
		this.lc().m_items.tablist.getTabItems(1).list.setItemCount(1);
		assertEQ ( this.lc()._getUIListItem(0,0), this.lc().m_items.tablist.getTabItems(0).list.getItem(0) );
		assertEQ ( this.lc()._getUIListItem(1,0), this.lc().m_items.tablist.getTabItems(1).list.getItem(0) );
	};
	
	this.test__getResListItem = function(){
		var r_getTabResList = [{resid:1}];
		this.mm.mock(this.lc(), '_getTabResList', [r_getTabResList] );
		
		var p_tabIdx = 1;
		var p_itemIdx = 0;
		assertEQ ( this.lc()._getResListItem(p_tabIdx, p_itemIdx), {resid:1} );
		assertEQ ( this.mm.params['_getTabResList'], [p_tabIdx]);
	};
	
	this.test__getCurSelResItem = function(){
		var r_tabIdx = 0;
		this.mm.mock(this.lc(), '_getCurTabIdx', [r_tabIdx]);
		this.mm.mock(this.lc(), '_getResListItem', [{item:1}]);
		
		assertEQ ( this.lc()._getCurSelResItem(), {item:1} );
		assertEQ ( this.mm.params['_getResListItem'], [0, -1] );
	};
	
	this.test__getCurSelUIItem = function(){
		this.mm.mock(this.lc(), '_getUIListItem', [{name:'uiItem'}] );
		this.mm.mock(this.lc(), '_getCurTabIdx', [0] );
		this.mm.mock(this.lc(), '_getCurSelItemIdx', [1] );
		assertEQ ( this.lc()._getCurSelUIItem(), {name:'uiItem'} );
		assertEQ ( this.mm.params['_getUIListItem'], [0, 1] );
	};
	
	this.test__getCurSelItemIdx = function(){
		this.mm.mock(this.lc(), '_getCurTabIdx', [0]);
		this.lc().m_items.tablist.getTabItems(0).list.setItemCount(10);
		this.lc().m_items.tablist.getTabItems(0).list.setCurSel(1);
		assertEQ ( this.lc()._getCurSelItemIdx(), 1 );
	};
	
	this.test__getCurSelResItemIdx = function(){
		this.mm.mock(this.lc(), '_getUIListItem', [{name:'uiItem'}] );
		this.mm.mock(this.lc(), '_getCurTabIdx', [0] );
		this.mm.mock(this.lc(), '_getCurSelItemIdx', [1] );
		this.mm.mock(this.lc(), '_getResIdxByUIItem', [2] );
	
		assertEQ ( this.lc()._getCurSelResItemIdx(), 2 );
		assertEQ ( this.mm.params['_getUIListItem'], [0, 1] );
		assertEQ ( this.mm.params['_getResIdxByUIItem'], [{name:'uiItem'}] );
	};
	
	this.test__getResIdxByUIItem = function(){
		this.lc().m_items.tablist.getTabItems(0).list.setItemCount(1);
		var item = this.lc().m_items.tablist.getTabItems(0).list.getItem(0);
		item.exsubs.farmBtn.setId(100);
		assertEQ ( this.lc()._getResIdxByUIItem(item), 100 );		
	};	
	
	this.test__getItemBlink = function(){
		this.lc().m_blinkCtrls = [{used:false, tabidx:1, itemidx:2},{used:true, tabidx:1, itemidx:3}];
		var p_tabIdx = 1;
		var p_itemIdx = 2;
		assertEQ ( this.lc()._getItemBlink(p_tabIdx, p_itemIdx), null );
		
		var p_tabIdx = 1;
		var p_itemIdx = 3;
		assertEQ ( this.lc()._getItemBlink(p_tabIdx, p_itemIdx), {used:true, tabidx:1, itemidx:3} );
	};
	
	this.test__allocItemBlink = function(){
		this.lc().m_blinkCtrls = [{used:true, tabidx:1, itemidx:2},{used:false, tabidx:1, itemidx:3}];
		assertEQ ( this.lc()._allocItemBlink(), {used:true, tabidx:1, itemidx:3});
		var blink = this.lc()._allocItemBlink();
		assertEQ ( blink.used, true );
		assertEQ ( blink.tabidx, 0 );
		assertEQ ( blink.itemidx, 0 );
		assertEQ ( blink.b instanceof BlinkingCtrl, true );
		assertEQ ( this.lc().m_blinkCtrls.length, 3 );
		assertEQ ( this.lc().m_blinkCtrls[2], blink );
	};
	
	this.test__getFitIdOrAllocChatDlg = function(){
		this.lc().m_chatDlgs = [{roleId:1, chat:{name:'chat'}}];
		var p_roleId = 1;
		assertEQ ( this.lc()._getFitIdOrAllocChatDlg(p_roleId), {name:'chat'});
		
		this.mm.mock(this.lc(), '_allocChatDlg', [{name:'newchat'}]);
		p_roleId = 2;
		assertEQ ( this.lc()._getFitIdOrAllocChatDlg(p_roleId), {name:'newchat'});
	};
	
	this.test__allocChatDlg = function(){
		var chatDlg1 = MockDialog.extern(function(){this.clear = function(){};}).snew(this.g);
		var chatDlg2 = MockDialog.extern(function(){this.clear = function(){};}).snew(this.g);
		this.mm.mock(chatDlg2, 'clear' );
		chatDlg1.getCore().setShow(true);
		chatDlg1.getCore().setZIndex(1);
		chatDlg2.getCore().setShow(false);
		chatDlg2.getCore().setZIndex(2);
		this.lc().m_chatDlgs = [{chat:chatDlg1},{chat:chatDlg2}];
		assertEQ ( this.lc()._allocChatDlg(10000), chatDlg2 );
		assertEQ ( this.lc().m_chatDlgs[1].roleId, 10000);
		assertEQ ( this.mm.walkLog, 'clear' );
		
		this.mm.clear();
		this.lc().m_chatDlgs = [];
		assertEQ ( this.lc()._allocChatDlg(10000) instanceof ChatDlg, true );
		assertEQ ( this.lc().m_chatDlgs.length, 1 );
		assertEQ ( this.lc().m_chatDlgs[0].roleId, 10000 );
	};
	
	this.test__getCurTabIdx = function(){
		this.mm.mock(this.lc().m_items.tablist, 'getActiveTab', [1]);
		assertEQ ( this.lc()._getCurTabIdx(), 1 );
	};
	
	this.test__setListCurSelByOpBtnId = function(){
		this.mm.mock(this.lc(), '_getCurTabIdx', [0]);
		var list = this.lc().m_items.tablist.getTabItems(0).list;
		this.mm.mock(list, 'setCurSel' );
		this.lc()._setListCurSelByOpBtnId( 10*100 + 0 );
		assertEQ ( this.mm.params['setCurSel'], [10] );
	};
});

tqFriendDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseFriendDlg, 'TestCaseFriendDlg');
};
