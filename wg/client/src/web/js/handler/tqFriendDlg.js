/*******************************************************************************/
FriendDlg = ListenerBaseDlg.extern(function(){
	//FriendDlg-unittest-start
	var C_ITEM_COUNT = 12;
	
	var C_CONFIRM_ID = 1;
	var C_CANCEL_ID = 2;
	
	var C_ITEM_H = 24;
	var C_ITEM_ICON_W = 20;
	var C_ITEM_ICON_H = 20;	
	var C_ITEM_NAME_L = 24;
	var C_ITEM_NAME_T = 3;
	var C_ITEM_NAME_W = 153;
	var C_ITEM_NAME_H = 18;
	
	var C_ITEM_SEL_H = 49;
	var C_ITEM_ICON_SEL_W = 45;
	var C_ITEM_ICON_SEL_H = 45;
	var C_ITEM_NAME_SEL_L = 50;
	var C_ITEM_NAME_SEL_T = 3;
	var C_ITEM_NAME_SEL_W = 127;
	var C_ITEM_NAME_SEL_H = 18;
	
	var C_ITEM_OP_SEL_L = 50;
	var C_ITEM_OP_SEL_T = 29;
	var C_ITEM_OP_SEL_W = 127;
	var C_ITEM_OP_SEL_H = 18;
	
	var C_FRIEND_TABIDX = 0;
	var C_ENEMY_TABIDX = 1;
	var C_TAB_CNT = 2;
	
	var C_ITEMOP_ENTERFARM = 1;
	var C_ITEMOP_TALK = 2;
	var C_ITEMOP_DETAIL = 3;
	var C_ITEMOP_LETTER = 4;
	var C_ITEMOP_DEL = 5;
	var C_ITEMOP_MAX = 100;
	
	var C_NEWCHAT_DURATION_MS = 5000;
	
	var C_DLG_W = 210;
	var C_DLG_TOP = 192;
	var C_TOGGLE_W = 24;
	var C_TOGGLE_H = 97;
	var C_TOGGLE_REF_TOP = 50;
	
	var m_g;
	var m_this;
	var m_dlg;
	var m_items = {toggleBtn:NullButton.snew()};
	var m_lastTabListSelIdxs=[{resIdx:-1,  uiItem:null},{resIdx:-1, uiItem:null}];
	var m_chatDlgs=[];
	var m_tabListOps = [];
	var m_addfriendtoemenyopbtn;
	var m_chatCache=[];
	var m_blinkCtrls=[];
	var m_fromTopFarmBtn=false;
	var m_blinkResIdxs=[];
	var m_headiconblink = null;

	this._init = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.LOGIN_OK, 0, m_this, _onLoginOk);
		m_g.regEvent(EVT.NET, NETCMD.FRIEND, m_this, _onSvrPkg);
		m_g.regEvent(EVT.NET, NETCMD.FARM, m_this, _onSvrCanGatherFlags);
		m_g.regEvent(EVT.ENEMY_UPDATE, 0, m_this, _onEnemyUpdate );
	};
	
	this.resetPos = function(){
		if ( !m_dlg ) return;
		_resetPos();
	};
	
	this.openDlg = function(){
		_initDlg();
		_openDlg();
		_initInfo();
		_resetPos();
		this._notifyOpenDlg();
	};
	
	this.hideDlg = function(){
		if ( m_dlg ) {
			m_dlg.hide();
		}
	};
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		
		_createDlg();
		_createToggleBtn();
		_setTabTexts();
		_setCallers();
		_createOpBtns();
		_createHeadIconBlink();
		_getAllFriendsFromSvr();
	};
	
	var _createDlg = function(){
		if ( TQ.isMobile() ) {
			m_dlg = Dialog.snew(m_g,{modal:false, title:'xxx', pos:{x:'center', y:30}});
		} else {
			m_dlg = Dialog.snew(m_g,{modal:false, pos:{x:784, y:30}, uiback:uiback.dlg.friendmain});
		}
		m_g.getGUI().initDlg(m_dlg, uicfg.friend.maindlg, m_items);
		InputLimit.maxGBKBytes(m_items.addName, JVALID.getMaxUserLen());
	};
	
	var _createToggleBtn = function(){
		if ( TQ.isMobile() ) {
			m_items.toggleBtn = UIM.getPanel('main').getItems().smbtn_friend;
		} else {
			var toggleDom = TQ.createDom('div');
			TQ.setCSS(toggleDom, 'position', 'absolute');
			TQ.setCSS(toggleDom, 'zIndex', 9999);
			TQ.setDomRect(toggleDom, 0, 0, C_TOGGLE_W, C_TOGGLE_H);
			TQ.append(TQ.getUiBody(), toggleDom);
			m_items.toggleBtn = new ComButton(m_g, toggleDom, {uiback:uiback.btn.friendListtoggle});	
			m_items.toggleBtn.setType(BTN_TYPE.CHECK);
		}
	};
	
	var _setTabTexts = function(){
		for ( var i=0; i<rstr.friend.maindlg.tabs.length; ++i ){
			m_items.tablist.setTabText(i, rstr.friend.maindlg.tabs[i]);
		}
	};
	
	var _setCallers = function(){
		m_items.toggleBtn.setCaller({self:m_this, caller:_onClickToggleBtn});
		m_items.addBtn.setCaller({self:m_this, caller:_onClickAddBtn});
		m_items.applyListBtn.setCaller({self:m_this, caller:_onClickApplyListBtn});
		m_items.refreshBtn.setCaller({self:m_this, caller:_onClickRefreshBtn});
		TQ.addEvent(m_items.headiconname, 'click', _onClickHeadIconName);
		_createTabListItemCallers();
		_createPageBarCallers();
	};
	
	var _createTabListItemCallers = function(){
		for (var i=0; i<m_items.tablist.getTabCount(); ++i){
			var tabitems = m_items.tablist.getTabItems(i);
			tabitems.list.setCaller({self:m_this, caller:_onSelectListItem},null,null,{self:m_this, caller:_onDblClickListItem});
		}
	};
	
	var _createPageBarCallers = function(){
		for (var i=0; i<m_items.tablist.getTabCount(); ++i){
			var tabitems = m_items.tablist.getTabItems(i);
			tabitems.pagebar.setCaller({self:m_this, caller:_onPageNavigate});
		}
	};
	
	var _createOpBtns = function(){
		var friendOpBtns = [{rect:[0,1,25,20], id:C_ITEMOP_TALK, text:rstr.friend.maindlg.opbtns[C_ITEMOP_TALK-1]}
			,{rect:[30,1,25,20], id:C_ITEMOP_DETAIL, text:rstr.friend.maindlg.opbtns[C_ITEMOP_DETAIL-1]} 
			,{rect:[60,1,25,20], id:C_ITEMOP_LETTER, text:rstr.friend.maindlg.opbtns[C_ITEMOP_LETTER-1]} 
			,{rect:[90,1,25,20], id:C_ITEMOP_DEL, text:rstr.friend.maindlg.opbtns[C_ITEMOP_DEL-1]} 
			];
		m_tabListOps.push(_innerCreateOpBtns(friendOpBtns));
		
		var enemyOpBtns = [
			{rect:[0,1,25,20], id:C_ITEMOP_DETAIL, text:rstr.friend.maindlg.opbtns[C_ITEMOP_DETAIL-1]} 
			,{rect:[30,1,25,20], id:C_ITEMOP_LETTER, text:rstr.friend.maindlg.opbtns[C_ITEMOP_LETTER-1]} 
		];
		m_tabListOps.push(_innerCreateOpBtns(enemyOpBtns));
	};
	
	var _innerCreateOpBtns = function(opbtns){
		var opBtns = [];
		var itemopdom = TQ.createDom('div');
		TQ.setCSS(itemopdom, 'position', 'absolute');
		TQ.setDomRect(itemopdom, C_ITEM_OP_SEL_L, C_ITEM_OP_SEL_T, C_ITEM_OP_SEL_W, C_ITEM_OP_SEL_H);
		for ( var i=0; i<opbtns.length; ++i ){
			var o = opbtns[i];
			var opdom = TQ.createDom('div');
			TQ.setCSS(opdom, 'position', 'absolute');
			TQ.setDomRect(opdom, o.rect[0],o.rect[1],o.rect[2],o.rect[3]);
			TQ.append(itemopdom, opdom);
			var opbtn = new ComButton(m_g, opdom, {uiback:uiback.btn.blinebtn});
			opBtns.push(opbtn);
			opbtn.setText(o.text);
			opbtn.setId(o.id);
			opbtn.setCaller({self:m_this, caller:_onClickItemOpBtn});
		}
		return {opDom:itemopdom, opBtns:opBtns};
	};
	
	var _getAllFriendsFromSvr = function(){
		FriendSender.sendGetAllFriends(m_g);
	};
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		_handleApplyMsg();
		_handleCache();
		m_items.tablist.activeTab(0);
	};
	
	var _initCanGatherFarmFlags = function(tabIdx){
		_clearCanGatherFarmFlags(tabIdx);
		_getCanGatherFarmFlags(tabIdx);
	};
	
	var _clearCanGatherFarmFlags = function(tabIdx){
		var list = m_items.tablist.getTabItems(tabIdx).list;
		for ( var i=0; i<list.getCount(); ++i ){
			var item = list.getItem(i);
			IMG.setBKImage(item.exsubs.canGatherFlag, '');
		}
	};
	
	var _getCanGatherFarmFlags = function(tabIdx){
		var roleIds = [];
		var list = m_items.tablist.getTabItems(tabIdx).list;
		for ( var i=0; i<list.getCount(); ++i ){
			var item = list.getItem(i);
			var resIdx = _getResIdxByUIItem(item);
			var res = _getResListItem(tabIdx, resIdx);
			roleIds.push(res.roleId);
		}
		FarmSender.sendGetCanGatherFlags(m_g, roleIds, tabIdx);
	};
	
	var _handleApplyMsg = function(){
		if ( m_g.getImgr().getFriends().applys.length == 0 ){
			return;
		}
		
		m_items.applyListBtn.startBlinking(0);
	};
	
	var _handleCache = function(){
		var roleId = _getTopChatRoleIdFromChatCache();
		if ( roleId <= 0 ) return;
		
		var ret = _getItemIdxInfoByRoleId(roleId);
		var res = _getResListItem(ret.tabidx, ret.residx);
		if ( !res ) return;
		
		_openChatDlgAndHandleCache(res, ret.tabidx, ret.itemidx, ret.residx);
	};
	
	var _getTopChatRoleIdFromChatCache = function(){
		if ( m_chatCache.length == 0 ){
			return 0;
		}
		
		return m_chatCache[0].roleId;
	};
	
	var _openChatDlgAndHandleCache = function(resItem, tabIdx, uiItemIdx, resIdx){
		_openChatDlg(resItem);
		_stopItemBlink(tabIdx, uiItemIdx);
		_popBlinkCache(resIdx);
		_handleChatCache(resItem.roleId);
	};
	
	var _openChatDlg = function(item){
		var chatdlg = _getFitIdOrAllocChatDlg(item.roleId);
		chatdlg.openDlg(item);
		chatdlg.focus();
	};
	
	var _stopItemBlink = function(tabIdx, uiItemIdx){
		var b = _getItemBlink(tabIdx, uiItemIdx);
		if ( b ){
			b.used = false;
			b.b.stop();
		}
		
		var item = _getUIListItem(tabIdx, uiItemIdx);
		if ( item ){
			IMG.setBKImage(item.exsubs.talkflag, '');
		}
	};
	
	var _handleChatCache = function(roleId){
		var netchats = []; // collect chat msg where chat.roleId = roleId
		for ( var i=m_chatCache.length-1; i>=0; --i ){
			var cc = m_chatCache[i];
			if ( cc.roleId == roleId ){
				TQ.removeElement(m_chatCache, i);
				netchats.push(cc);
			}
		}
		
		for ( var i=netchats.length-1; i>=0; --i ){
			var netchat = netchats[i];
			_onChatMsg(netchat);
		}
	};
	
	var _updateTabList = function(){
		if (!m_dlg) return;
		
		_setPageBarsCount();
		_setTabListItems();
		_setTabListItemsBtnCallers();
		_initTabListSelectItem();
	};
	
	var _updateItemsBlink = function(){
		_stopAllItemsBlink();
		_startAllItemsBlink();
	};
	
	var _stopAllItemsBlink = function(){
		var list = m_items.tablist.getTabItems(_getCurTabIdx()).list;
		for ( var i=0; i<list.getCount(); ++i ){
			_stopItemBlink(_getCurTabIdx(), i);
		}
	};
	
	var _startAllItemsBlink = function(){
		var list = m_items.tablist.getTabItems(_getCurTabIdx()).list;
		for ( var i=0; i<list.getCount(); ++i ){
			var item = list.getItem(i);
			var residx = _getResIdxByUIItem(item);
			if ( !_isBlinkResIdx(residx) ) {
				continue;
			}
			
			if ( _isMostTopChatDlg(_findDlgIdxByResIdx(residx)) ){
				_popBlinkCache(residx);
				continue;
			}
			
			_startItemBlink(_getResListItem(_getCurTabIdx(), residx), _findDlgIdxByResIdx(residx));
		}
	};
	
	var _findDlgIdxByResIdx = function(residx){
		var resItem = _getResListItem(_getCurTabIdx(), residx);
		if ( !resItem ) return -1;
		
		TQ.find(m_chatDlgs, 'roleId', resItem.roleId);
		return TQ.getLastFindIdx();
	};
	
	var _setPageBarsCount = function(){
		for ( var tabIdx=0; tabIdx<C_TAB_CNT; ++tabIdx ){
			var resList = _getTabResList(tabIdx);
			var tabItems = m_items.tablist.getTabItems(tabIdx);
			var pageCount = Math.ceil(resList.length/C_ITEM_COUNT);
			tabItems.pagebar.setPageCnt((pageCount>0) ? pageCount : 1);
		}
	};
	
	var _setTabListItems = function(){
		var _setListItem = function(resIdx, res, item){
			ItemResUtil.initItemres(res, 'icon');
			IMG.setBKImage(item.exsubs.icon,IMG.makeSmallImg(res.itemres.mini_smallpic));
			var name = RStrUtil.makeXDiamondRoleName(res.roleName, res);
			TQ.setHtml(item.exsubs.name, name);
		};
		
		_travelTabList(_setListItem);
	};
	
	var _setTabListItemsBtnCallers = function(){
		var _setListItemBtnCaller = function(resIdx, res, item){
			item.exsubs.farmBtn.setId(resIdx);
			item.exsubs.farmBtn.setCaller({self:m_this, caller:_onClickTopFarmBtn});
		};
		
		_travelTabList(_setListItemBtnCaller);
	};
	
	var _travelTabList = function(callBack){
		for ( var tabIdx=0; tabIdx<C_TAB_CNT; ++tabIdx ){
			_travelList(tabIdx, callBack);
		}
	};
	
	var _travelList = function(tabIdx, callBack){
		var tabItems = m_items.tablist.getTabItems(tabIdx);
		var resList = _getTabResList(tabIdx);
		var pageNo = tabItems.pagebar.getCurPage();
		var range = _getListRangeByPageIdx(resList, pageNo);
		tabItems.list.setItemCount(range.count);
		for ( var resIdx=range.start; resIdx<(range.start+range.count); ++resIdx ) {
			var res = resList[resIdx];
			var item = tabItems.list.getItem(resIdx-range.start);
			callBack(resIdx, res, item);
		}
	};
	
	var _getListRangeByPageIdx = function(resList, pageNo){
		var pageIdx = pageNo - 1;
		var start = pageIdx*C_ITEM_COUNT;
		var count = Math.min(C_ITEM_COUNT, resList.length - start);
		return {count:count, start:start};
	};
	
	var _initTabListSelectItem = function(){
		for ( var i=0; i<C_TAB_CNT; ++i ){
			m_items.tablist.getTabItems(i).list.setCurSel(-1);
		}
	};
	
	var _onPageNavigate = function(pageNo){
		_updateTabList();
		_updateItemsBlink();
		_initCanGatherFarmFlags(_getCurTabIdx());
	};
	
	var _onLoginOk = function(){
		m_this.openDlg();
		m_dlg.hide();
	};
	
	var _onSvrPkg = function(netevent){
		var cmdpkg = netevent.data;
		if ( cmdpkg.friends ){
			var friends = m_g.getImgr().getFriends().friends;
			TQ.dictCopy(friends, cmdpkg.friends);
			_updateTabList();
			m_g.sendEvent({eid:EVT.FRIENDLIST, sid:0});
		}
		
		if ( cmdpkg.hasApply ){
			_onHasApplyMsg(cmdpkg.hasApply);
		}
		
		if ( cmdpkg.chat ){
			_onChatMsg(cmdpkg.chat);
		}
		
		return EVENT_RET_OK;
	};
	
	var _onSvrCanGatherFlags = function(netevent){
		var cmdpkg = netevent.data;
		if ( !cmdpkg.farmflags ) return;
		
		_udpateListItemsGatherFlag(0, cmdpkg.farmflags);
		_udpateListItemsGatherFlag(1, cmdpkg.farmflags);
	};
	
	var _onEnemyUpdate = function(){
		_updateTabList();
	};
	
	var _udpateListItemsGatherFlag = function(tabIdx, flags){
		var list = m_items.tablist.getTabItems(tabIdx).list;
		for ( var i=0; i<list.getCount(); ++i ) {
			var item = list.getItem(i);
			var resIdx = _getResIdxByUIItem(item);
			var res = _getResListItem(tabIdx, resIdx);
			var findNode = TQ.find(flags, 'roleId', res.roleId);
			if ( !findNode ) continue;
			
			if ( findNode.flag == 1 ) {
				IMG.setBKImage(item.exsubs.canGatherFlag, IMG.makeImg('farm/cangather.gif'));
			}
			else {
				IMG.setBKImage(item.exsubs.canGatherFlag, '');
			}
		}
	};
	
	var _onHasApplyMsg = function(hasApply){
		m_items.applyListBtn.startBlinking(0);
		_startToggleBtnBlink(-1);
	};
	
	var _onChatMsg = function(netchat){
		var findChatIdx = _handleChatPkgByChatDlgs(netchat);
		if ( _isMostTopChatDlg(findChatIdx) ){
			var ret = _getItemIdxInfoByRoleId(netchat.roleId);
			_stopItemBlink(ret.tabidx, ret.itemidx);
			_popBlinkCache(ret.residx);
		}
		else {
			_pushToChatCache(findChatIdx, netchat);
			_handleNewChatEvent(findChatIdx, netchat);
			_startItemBlink(netchat, findChatIdx);
			
			var ret = _getItemIdxInfoByRoleId(netchat.roleId);
			_pushBlinkCache(ret.residx);
		}
	};
	
	var _pushBlinkCache = function(residx){	
		TQ.find(m_blinkResIdxs, null, residx);
		TQ.removeElement(m_blinkResIdxs, TQ.getLastFindIdx());
		m_blinkResIdxs.push(residx);
		_startHeadIconBlink(residx);
	};
	
	var _popBlinkCache = function(residx){
		TQ.find(m_blinkResIdxs, null, residx);
		TQ.removeElement(m_blinkResIdxs, TQ.getLastFindIdx());
		_stopHeadIconBlink(residx);
		_startHeadIconBlink(m_blinkResIdxs[m_blinkResIdxs.length-1]);
	};
	
	var _isBlinkResIdx = function(residx){
		TQ.find(m_blinkResIdxs, null, residx);
		return TQ.getLastFindIdx() >= 0;
	};
	
	var _handleChatPkgByChatDlgs = function(netchat){
		for (var i=0; i<m_chatDlgs.length; ++i) {
			if (m_chatDlgs[i].chat.handleChatPkg(netchat) == EVENT_RET_BREAK) {
				return i;
			}
		}
		return -1;
	};
	
	var _pushToChatCache = function(findChatIdx, netchat){
		if ( findChatIdx < 0 ){
			m_chatCache.push(netchat);
		}
	};
	
	var _handleNewChatEvent = function(findChatIdx, netchat){
		_startToggleBtnBlink(_getDuration(findChatIdx));
	};
	
	var _startToggleBtnBlink = function(duration){
		if (_isShow()) return;
		m_items.toggleBtn.startBlinking(duration);
	};
	
	var _startItemBlink = function(netchat, findChatDlgIdx){
		if ( !m_dlg ) return;
		
		var ret = _getItemIdxInfoByRoleId(netchat.roleId);
		var item = _getUIListItem(ret.tabidx, ret.itemidx);
		if (!item) return;
		
		var b = _getItemBlink(ret.tabidx, ret.itemidx);
		if ( !b ){
			b = _allocItemBlink();
		}
		
		b.tabidx = ret.tabidx;
		b.itemidx = ret.itemidx;		
		b.b.bind(item.exsubs.icon, {tabidx:ret.tabidx, itemidx:ret.itemidx});
		b.b.start(_getDuration(findChatDlgIdx));
		b.b.setCaller({self:m_this, caller:_onItemBlinkEnd});
	};
	
	var _startHeadIconBlink = function(resIdx){
		var res = _getResListItem(_getCurTabIdx(), resIdx);
		if (!res) return;
		
		ItemResUtil.initItemres(res, 'icon');
		IMG.setBKImage(m_items.headicon,IMG.makeSmallImg(res.itemres.mini_smallpic));
		TQ.setTextEx(m_items.headname, res.roleName);

		m_headiconblink.start(-1);
	};
	
	var _stopHeadIconBlink = function(resIdx){
		IMG.setBKImage(m_items.headicon,'');
		TQ.setTextEx(m_items.headname, '');

		m_headiconblink.stop();
	};
	
	var _createHeadIconBlink = function(){
		m_headiconblink = BlinkingCtrl.snew(m_g);
		m_headiconblink.bind(m_items.headiconname, {});
	};
	
	var _isShow = function(){
		if ( !m_dlg ) return false;
		return m_dlg.isShow();
	};
	
	var _onItemBlinkEnd = function(param){
		var item = _getUIListItem(param.tabidx, param.itemidx);
		if ( !item ) return;
		
		IMG.setBKImage(item.exsubs.talkflag, IMG.getItemTalk());
		_setTalkFlagPos(item);
	};
	
	var _onClickToggleBtn = function(){
		_resetPos();
		m_items.toggleBtn.stopBlinking();
		if ( TQ.isMobile() ) {
			if ( _isShow() ){
				m_dlg.hide();
			} else {
				m_dlg.show();
				_initCanGatherFarmFlags(0);
				_initCanGatherFarmFlags(1);
				m_this._notifyOpenDlg();
			}
		}
	};
	
	var _onClickAddBtn = function(){
		if (!JVALID.checkUsername(m_items.addName.value)){
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100050].msg);
			return;
		}
		
		FriendSender.sendApplyFriend(m_g, m_items.addName.value);
	};
	
	var _onClickApplyListBtn = function(){
		m_items.applyListBtn.stopBlinking();
		UIM.openDlg('friendapplylist');
	};
	
	var _onClickRefreshBtn = function(){
		_initCanGatherFarmFlags(0);
		_initCanGatherFarmFlags(1);
	};
	
	var _onSelectListItem = function(e, idx){
		if (m_fromTopFarmBtn) {
			_onOpEnterFarm();
			m_fromTopFarmBtn = false;
			return;
		}
		
		_collapseListSelItem(idx);
		_expandCurSelItem(idx);
	};
	
	var _onClickHeadIconName = function(){
		if ( m_blinkResIdxs.length == 0 ) return;
		
		var resIdx = m_blinkResIdxs[m_blinkResIdxs.length-1];
		var resItem = _getResListItem(_getCurTabIdx(), resIdx);
		if (!resItem) return;
		
		var ret = _getItemIdxInfoByRoleId(resItem.roleId);
		_openChatDlgAndHandleCache(resItem,  _getCurTabIdx(), ret.itemidx, resIdx);
	};
	
	var _resetPos = function(){	
		if ( TQ.isMobile() ) return;
		_resetDlgVisible();
		_resetDlgPos();
		_resetToggleBtnPos();
		_resetToggleBtnZIndex();
	};
	
	var _resetDlgPos = function(){
		if ( TQ.isMobile() ) return;
		var clientSize = m_g.getWinSizer().getValidClientSize();
		var dlgPos = { x:clientSize.cx - C_DLG_W, y:C_DLG_TOP };
		m_dlg.setPosition(dlgPos);
	};
	
	var _resetDlgVisible = function(){
		if ( !m_items.toggleBtn.isPress() ){
			m_dlg.hide();
		} else {
			m_dlg.show();
			_initCanGatherFarmFlags(0);
			_initCanGatherFarmFlags(1);
		}
	};
	
	var _resetToggleBtnPos = function(){
		if ( TQ.isMobile() ) return;		
		var clientSize = m_g.getWinSizer().getValidClientSize();
		var btnPos = { x:clientSize.cx - C_TOGGLE_W, y:C_DLG_TOP + C_TOGGLE_REF_TOP};
		if ( m_items.toggleBtn.isPress() ){
			btnPos.x -= C_DLG_W;
		}
		TQ.setDomPos(m_items.toggleBtn.getParent(), btnPos.x, btnPos.y);
	};
	
	var _resetToggleBtnZIndex = function(){
		if ( !_isShow() || TQ.isMobile() ) return;
		TQ.setCSS(m_items.toggleBtn.getParent(), 'zIndex', m_dlg.getZIndex());
	};
	
	var _collapseListSelItem = function(){
		var lastNode = m_lastTabListSelIdxs[_getCurTabIdx()];
		if (lastNode.resIdx == _getCurSelResItemIdx()) {
			return;
		}
		
		if (!lastNode.uiItem) {
			return;
		}
		
		_setListItemHeight(lastNode.uiItem, C_ITEM_H);
		_setListItemIconAndNameRect(lastNode.uiItem, C_ITEM_ICON_W, C_ITEM_ICON_H
			,C_ITEM_NAME_L, C_ITEM_NAME_T, C_ITEM_NAME_W, C_ITEM_NAME_H );
		_setListItemIconSmallBkImg(lastNode.uiItem, _getCurTabIdx(), _getResIdxByUIItem(lastNode.uiItem));
		_removeListItemOpDom(lastNode.uiItem, _getCurTabIdx());
		_setTalkFlagPos(lastNode.uiItem);
	};
	
	var _expandCurSelItem = function(){
		var lastNode = m_lastTabListSelIdxs[_getCurTabIdx()];
		if (lastNode.resIdx == _getCurSelResItemIdx()) {
			return;
		}
		
		lastNode.resIdx = _getCurSelResItemIdx();
		lastNode.uiItem = _getCurSelUIItem();
		if (!lastNode.uiItem) {
			return;
		}
		
		var curItem = lastNode.uiItem;
		_setListItemHeight(curItem, C_ITEM_SEL_H);
		_setListItemIconAndNameRect(curItem, C_ITEM_ICON_SEL_W, C_ITEM_ICON_SEL_W
			,C_ITEM_NAME_SEL_L, C_ITEM_NAME_SEL_T, C_ITEM_NAME_SEL_W, C_ITEM_NAME_SEL_H );
		_setListItemIconBigBkImg(curItem, _getCurTabIdx(), _getCurSelResItemIdx());
		_appendListItemOpDom(curItem, _getCurTabIdx(), _getCurSelItemIdx());
		_setTalkFlagPos(curItem);
	};	
	
	var _setListItemHeight = function(item, itemHeight){
		TQ.setDomHeight(item.item, itemHeight );
		TQ.setDomHeight(item.item.childNodes[0], itemHeight );
	};
	
	var _setListItemIconAndNameRect = function(item, iconW, iconH, nameL, nameT, nameW, nameH){
		TQ.setDomSize(item.exsubs.icon, iconW, iconH);
		TQ.setDomRect(item.exsubs.name, nameL, nameT, nameW, nameH);
	};
	
	var _setListItemIconBigBkImg = function(item, tabIdx, resIdx){
		var resItem = _getResListItem(tabIdx, resIdx);
		if (!resItem) return;
		IMG.setBKImage(item.exsubs.icon,IMG.makeSmallImg(resItem.itemres.mid_smallpic));
	};
	
	var _setListItemIconSmallBkImg = function(item, tabIdx, resIdx){
		var resItem = _getResListItem(tabIdx, resIdx);
		if (!resItem) return;
		IMG.setBKImage(item.exsubs.icon,IMG.makeSmallImg(resItem.itemres.mini_smallpic));
	};
	
	var _removeListItemOpDom = function(item, tabIdx){
		var itemcon = item.item.childNodes[0];
		TQ.remove(itemcon, m_tabListOps[tabIdx].opDom);
	};
	
	var _appendListItemOpDom = function(item, tabIdx, itemIdx){
		var itemcon = item.item.childNodes[0];
		TQ.append(itemcon, m_tabListOps[tabIdx].opDom);
		var opBtns = m_tabListOps[tabIdx].opBtns;
		for ( var i=0; i<opBtns.length; ++i ) {
			var opBtn = opBtns[i];
			opBtn.setId( (opBtn.getId()%C_ITEMOP_MAX) + itemIdx*C_ITEMOP_MAX );
		}
	};
	
	var _onChatDlgUp = function(role){
		var ret = _getItemIdxInfoByRoleId(role.roleId);
		_stopItemBlink(ret.tabidx, ret.itemidx);
		_popBlinkCache(ret.residx);
	};
	
	var _onDblClickListItem = function(e, idx){
		if (_getCurTabIdx() != C_FRIEND_TABIDX) 
			return;
			
		_onOpTalkWith();
	};
	

	var _onClickTopFarmBtn = function(id){
		m_fromTopFarmBtn = true;
	};
	
	var _onClickItemOpBtn = function(id){
		_setListCurSelByOpBtnId(id);
		
		var opId = (id%C_ITEMOP_MAX);
		if ( _cannotOpWhenRoleDied(opId) ){
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.friend.maindlg.tip.opDiedFriend);
			return;
		}
		
		if ( opId == C_ITEMOP_ENTERFARM ){
			_onOpEnterFarm();
		} else if ( opId == C_ITEMOP_TALK ){
			_onOpTalkWith();
		} else if ( opId == C_ITEMOP_DETAIL ){
			_onOpShowDetail();
		} else if ( opId == C_ITEMOP_LETTER ){
			_onOpWriteLetter();
		} else if ( opId == C_ITEMOP_DEL ){
			_onOpDeleteFriend();
		}
	};
	
	var _cannotOpWhenRoleDied = function(opId){
		if ( opId == C_ITEMOP_ENTERFARM || opId == C_ITEMOP_TALK || opId == C_ITEMOP_LETTER ) {
			var curItem = _getCurSelResItem();
			if (curItem.died == 1) return true;
		}
		return false;
	};
	
	var _onOpEnterFarm = function(){
		var curItem = _getCurSelResItem();
		UIM.closeMapPanels();
		UIM.getPanel('farm').open(curItem.roleId);
	};
	
	var _onOpTalkWith = function(){
		_openChatDlgAndHandleCache(_getCurSelResItem(), _getCurTabIdx(), _getCurSelItemIdx(), _getCurSelResItemIdx());
	};
	
	var _onOpShowDetail = function(){
		var curItem = _getCurSelResItem();
		OutFieldSender.sendGetFieldDetail(m_g, curItem.gridId);
	};
	
	var _onOpWriteLetter = function(){
		var dlg = UIM.getDlg('writeletter');
		dlg.openDlg();
		dlg.clear();
		dlg.setRecv( _getCurSelResItem().roleName );
		dlg.setFocus('title');
	};
	
	var _onOpDeleteFriend = function(){
		var curItem = _getCurSelResItem();
		
		var _delFriendCallback = function(id){
			if ( id == MB_IDYES ){
				FriendSender.sendDeleteFriend(m_g, curItem.roleId);
			}
		};
		
		m_g.getGUI().msgBox(rstr.comm.msgts, 
			TQ.format(rstr.friend.maindlg.dels[_getCurTabIdx()], curItem.roleName),
			MB_F_YESNO, {self:m_this, caller:_delFriendCallback} );
	};
	
	var _isMostTopChatDlg = function(chatIdx){
		if (chatIdx<0) return false;
		
		var chat = m_chatDlgs[chatIdx].chat;
		var maxz = _getMostTopZIndex();
		return ( chat.getCore().getZIndex() >= maxz );
	};
	
	var _getMostTopZIndex = function(){
		var maxZIndex = 0;
		for ( var i=0; i<m_chatDlgs.length; ++i ){
			var chatCoreDlg = m_chatDlgs[i].chat.getCore();
			if ( !chatCoreDlg.isShow() ) continue;
			if ( chatCoreDlg.getZIndex() <= maxZIndex ) continue;
			
			maxZIndex = chatCoreDlg.getZIndex();
		}
		return maxZIndex;
	};	
	
	var _setTalkFlagPos = function(item){
		var icon = item.exsubs.icon;
		var w = TQ.getDomWidth(icon);
		var h = TQ.getDomHeight(icon);
		var talkflag = item.exsubs.talkflag;
		var tw = TQ.getDomWidth(talkflag);
		var th = TQ.getDomHeight(talkflag);
		TQ.setCSS(talkflag, 'left', (w-tw)+'px');
		TQ.setCSS(talkflag, 'top', (h-th)+'px');
	};
	
	var _getItemIdxInfoByRoleId = function(roleId){
		var tabIdxs = [C_FRIEND_TABIDX, C_ENEMY_TABIDX];
		for ( var i=0; i<tabIdxs.length; ++i ){
			var tabIdx = tabIdxs[i];
			var resList = _getTabResList(tabIdx);
			if ( TQ.find(resList, 'roleId', roleId) ){
				var tabItems = m_items.tablist.getTabItems(tabIdx);
				var pageNo = tabItems.pagebar.getCurPage();
				var range = _getListRangeByPageIdx(resList, pageNo);
				var itemidx = TQ.getLastFindIdx()-range.start;
				if ( itemidx < 0 ) itemidx = -1;
				if ( itemidx >= C_ITEM_COUNT ) itemidx = -1;
				return {tabidx:tabIdxs[i], residx:TQ.getLastFindIdx(), itemidx:itemidx};
			}
		}
		return {tabidx:0, residx:-1, itemidx:-1};
	};
	
	var _getTabResList = function(tabidx){
		var friends = m_g.getImgr().getFriends();
		var maps = {'0':friends.friends, '1':friends.enemys};
		return maps[tabidx];
	};
	
	var _getUIListItem = function(tabidx, itemidx){
		var list = m_items.tablist.getTabItems(tabidx).list;
		return list.getItem(itemidx);
	};
	
	var _getResListItem = function(tabidx, resIdx){
		var lists = _getTabResList(tabidx);
		return lists[resIdx];
	};
	
	var _getCurSelResItem = function(){ 
		return _getResListItem(_getCurTabIdx(), _getCurSelResItemIdx());
	};
	
	var _getCurSelUIItem = function(){ 
		return _getUIListItem(_getCurTabIdx(), _getCurSelItemIdx());
	};
	
	var _getCurSelItemIdx = function(){ 
		var tabIdx = _getCurTabIdx();
		return  m_items.tablist.getTabItems(tabIdx).list.getCurSel();
	};
	
	var _getCurSelResItemIdx = function(){ 
		var uiItem = _getUIListItem(_getCurTabIdx(), _getCurSelItemIdx());
		return _getResIdxByUIItem(uiItem);
	};
	
	var _getResIdxByUIItem = function(uiItem){
		if (!uiItem) return -1;
		return uiItem.exsubs.farmBtn.getId();
	};
	
	var _getItemBlink = function(tabidx, itemidx){
		for ( var i=0; i<m_blinkCtrls.length; ++i ){
			var blink = m_blinkCtrls[i];
			if (!blink.used) continue;
			if (blink.tabidx != tabidx) continue;
			if (blink.itemidx != itemidx) continue;
			
			return blink;
		}
		return null;
	};
	
	var _allocItemBlink = function(){
		for ( var i=0; i<m_blinkCtrls.length; ++i ){
			var blink = m_blinkCtrls[i];
			if ( blink.used ) continue;
			
			blink.used = true;
			return blink;
		}
		
		var blink = BlinkingCtrl.snew(m_g);
		m_blinkCtrls.push({used:true,tabidx:0,itemidx:0,b:blink});
		return m_blinkCtrls[m_blinkCtrls.length-1];
	};
	
	var _getFitIdOrAllocChatDlg = function(roleId){
		var chat = TQ.find(m_chatDlgs, 'roleId', roleId);
		if ( chat ){
			return chat.chat;
		}
		
		return _allocChatDlg(roleId);
	};
	
	var _allocChatDlg = function(roleId){
		var chat = null;
		for ( var i=0; i<m_chatDlgs.length; ++i ){
			var c = m_chatDlgs[i].chat;
			if ( c.getCore().isShow() ) continue; // 查找已被关闭的
			
			m_chatDlgs[i].roleId = roleId;
			chat = c;
			break;
		}
		
		if ( !chat ){
			chat = ChatDlg.snew(m_g);
			chat.setUpCaller(Caller.snew(m_this, _onChatDlgUp));
			m_chatDlgs.push({chat:chat,roleId:roleId});
		}
		
		chat.clear();
		return chat;
	};
	
	var _getCurTabIdx = function(){
		return m_items.tablist.getActiveTab();
	};
	
	var _setListCurSelByOpBtnId = function(id){
		var listIdx = Math.floor(id/C_ITEMOP_MAX);
		var list = m_items.tablist.getTabItems(_getCurTabIdx()).list;
		list.setCurSel(listIdx);
	};
	
	var _getDuration = function(findChatIdx){
		return findChatIdx < 0 ? -1 : C_NEWCHAT_DURATION_MS;
	};
	
	//FriendDlg-unittest-end
});

