/*******************************************************************************/
FriendDlg = ListenerBaseDlg.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.C_ITEM_COUNT = 12;
	
	var C_CONFIRM_ID = 1;
	var C_CANCEL_ID = 2;
	
	_lc_.C_ITEM_H = 24;
	_lc_.C_ITEM_ICON_W = 20;
	_lc_.C_ITEM_ICON_H = 20;	
	_lc_.C_ITEM_NAME_L = 24;
	_lc_.C_ITEM_NAME_T = 3;
	_lc_.C_ITEM_NAME_W = 153;
	_lc_.C_ITEM_NAME_H = 18;
	
	_lc_.C_ITEM_SEL_H = 49;
	_lc_.C_ITEM_ICON_SEL_W = 45;
	_lc_.C_ITEM_ICON_SEL_H = 45;
	_lc_.C_ITEM_NAME_SEL_L = 50;
	_lc_.C_ITEM_NAME_SEL_T = 3;
	_lc_.C_ITEM_NAME_SEL_W = 127;
	_lc_.C_ITEM_NAME_SEL_H = 18;
	
	var C_ITEM_OP_SEL_L = 50;
	var C_ITEM_OP_SEL_T = 29;
	var C_ITEM_OP_SEL_W = 127;
	var C_ITEM_OP_SEL_H = 18;
	
	var C_FRIEND_TABIDX = 0;
	var C_ENEMY_TABIDX = 1;
	var C_TAB_CNT = 2;
	
	_lc_.C_ITEMOP_ENTERFARM = 1;
	_lc_.C_ITEMOP_TALK = 2;
	_lc_.C_ITEMOP_DETAIL = 3;
	_lc_.C_ITEMOP_LETTER = 4;
	_lc_.C_ITEMOP_DEL = 5;
	var C_ITEMOP_MAX = 100;
	
	_lc_.C_NEWCHAT_DURATION_MS = 5000;
	
	_lc_.C_DLG_W = 210;
	_lc_.C_DLG_TOP = 192;
	_lc_.C_TOGGLE_W = 24;
	_lc_.C_TOGGLE_H = 97;
	_lc_.C_TOGGLE_REF_TOP = 50;
	
	_lc_.m_g;
	_lc_.m_this;
	_lc_.m_dlg;
	_lc_.m_items = {toggleBtn:NullButton.snew()};
	_lc_.m_lastTabListSelIdxs=[{resIdx:-1,  uiItem:null},{resIdx:-1, uiItem:null}];
	_lc_.m_chatDlgs=[];
	_lc_.m_tabListOps = [];
	var m_addfriendtoemenyopbtn;
	_lc_.m_chatCache=[];
	_lc_.m_blinkCtrls=[];
	_lc_.m_fromTopFarmBtn=false;
	_lc_.m_blinkResIdxs=[];
	_lc_.m_headiconblink = null;

	this._init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_g.regEvent(EVT.LOGIN_OK, 0, _lc_.m_this, _lc_._onLoginOk);
		_lc_.m_g.regEvent(EVT.NET, NETCMD.FRIEND, _lc_.m_this, _lc_._onSvrPkg);
		_lc_.m_g.regEvent(EVT.NET, NETCMD.FARM, _lc_.m_this, _lc_._onSvrCanGatherFlags);
		_lc_.m_g.regEvent(EVT.ENEMY_UPDATE, 0, _lc_.m_this, _lc_._onEnemyUpdate );
	};
	
	this.resetPos = function(){
		if ( !_lc_.m_dlg ) return;
		_lc_._resetPos();
	};
	
	this.openDlg = function(){
		_lc_._initDlg();
		_lc_._openDlg();
		_lc_._initInfo();
		_lc_._resetPos();
		this._notifyOpenDlg();
	};
	
	this.hideDlg = function(){
		if ( _lc_.m_dlg ) {
			_lc_.m_dlg.hide();
		}
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		
		_lc_._createDlg();
		_lc_._createToggleBtn();
		_lc_._setTabTexts();
		_lc_._setCallers();
		_lc_._createOpBtns();
		_lc_._createHeadIconBlink();
		_lc_._getAllFriendsFromSvr();
	};
	
	_lc_._createDlg = function(){
		if ( TQ.isMobile() ) {
			_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:false, title:'xxx', pos:{x:'center', y:30}});
		} else {
			_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:false, pos:{x:784, y:30}, uiback:uiback.dlg.friendmain});
		}
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.friend.maindlg, _lc_.m_items);
		InputLimit.maxGBKBytes(_lc_.m_items.addName, JVALID.getMaxUserLen());
	};
	
	_lc_._createToggleBtn = function(){
		if ( TQ.isMobile() ) {
			_lc_.m_items.toggleBtn = UIM.getPanel('main').getItems().smbtn_friend;
		} else {
			var toggleDom = TQ.createDom('div');
			TQ.setCSS(toggleDom, 'position', 'absolute');
			TQ.setCSS(toggleDom, 'zIndex', 9999);
			TQ.setDomRect(toggleDom, 0, 0, _lc_.C_TOGGLE_W, _lc_.C_TOGGLE_H);
			TQ.append(TQ.getUiBody(), toggleDom);
			_lc_.m_items.toggleBtn = new ComButton(_lc_.m_g, toggleDom, {uiback:uiback.btn.friendListtoggle});	
			_lc_.m_items.toggleBtn.setType(BTN_TYPE.CHECK);
		}
	};
	
	_lc_._setTabTexts = function(){
		for ( var i=0; i<rstr.friend.maindlg.tabs.length; ++i ){
			_lc_.m_items.tablist.setTabText(i, rstr.friend.maindlg.tabs[i]);
		}
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.toggleBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickToggleBtn});
		_lc_.m_items.addBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickAddBtn});
		_lc_.m_items.applyListBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickApplyListBtn});
		_lc_.m_items.refreshBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickRefreshBtn});
		TQ.addEvent(_lc_.m_items.headiconname, 'click', _lc_._onClickHeadIconName);
		_lc_._createTabListItemCallers();
		_lc_._createPageBarCallers();
	};
	
	_lc_._createTabListItemCallers = function(){
		for (var i=0; i<_lc_.m_items.tablist.getTabCount(); ++i){
			var tabitems = _lc_.m_items.tablist.getTabItems(i);
			tabitems.list.setCaller({self:_lc_.m_this, caller:_lc_._onSelectListItem},null,null,{self:_lc_.m_this, caller:_lc_._onDblClickListItem});
		}
	};
	
	_lc_._createPageBarCallers = function(){
		for (var i=0; i<_lc_.m_items.tablist.getTabCount(); ++i){
			var tabitems = _lc_.m_items.tablist.getTabItems(i);
			tabitems.pagebar.setCaller({self:_lc_.m_this, caller:_lc_._onPageNavigate});
		}
	};
	
	_lc_._createOpBtns = function(){
		var friendOpBtns = [{rect:[0,1,25,20], id:_lc_.C_ITEMOP_TALK, text:rstr.friend.maindlg.opbtns[_lc_.C_ITEMOP_TALK-1]}
			,{rect:[30,1,25,20], id:_lc_.C_ITEMOP_DETAIL, text:rstr.friend.maindlg.opbtns[_lc_.C_ITEMOP_DETAIL-1]} 
			,{rect:[60,1,25,20], id:_lc_.C_ITEMOP_LETTER, text:rstr.friend.maindlg.opbtns[_lc_.C_ITEMOP_LETTER-1]} 
			,{rect:[90,1,25,20], id:_lc_.C_ITEMOP_DEL, text:rstr.friend.maindlg.opbtns[_lc_.C_ITEMOP_DEL-1]} 
			];
		_lc_.m_tabListOps.push(_lc_._innerCreateOpBtns(friendOpBtns));
		
		var enemyOpBtns = [
			{rect:[0,1,25,20], id:_lc_.C_ITEMOP_DETAIL, text:rstr.friend.maindlg.opbtns[_lc_.C_ITEMOP_DETAIL-1]} 
			,{rect:[30,1,25,20], id:_lc_.C_ITEMOP_LETTER, text:rstr.friend.maindlg.opbtns[_lc_.C_ITEMOP_LETTER-1]} 
		];
		_lc_.m_tabListOps.push(_lc_._innerCreateOpBtns(enemyOpBtns));
	};
	
	_lc_._innerCreateOpBtns = function(opbtns){
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
			var opbtn = new ComButton(_lc_.m_g, opdom, {uiback:uiback.btn.blinebtn});
			opBtns.push(opbtn);
			opbtn.setText(o.text);
			opbtn.setId(o.id);
			opbtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickItemOpBtn});
		}
		return {opDom:itemopdom, opBtns:opBtns};
	};
	
	_lc_._getAllFriendsFromSvr = function(){
		FriendSender.sendGetAllFriends(_lc_.m_g);
	};
	
	_lc_._openDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		_lc_._handleApplyMsg();
		_lc_._handleCache();
		_lc_.m_items.tablist.activeTab(0);
	};
	
	_lc_._initCanGatherFarmFlags = function(tabIdx){
		_lc_._clearCanGatherFarmFlags(tabIdx);
		_lc_._getCanGatherFarmFlags(tabIdx);
	};
	
	_lc_._clearCanGatherFarmFlags = function(tabIdx){
		var list = _lc_.m_items.tablist.getTabItems(tabIdx).list;
		for ( var i=0; i<list.getCount(); ++i ){
			var item = list.getItem(i);
			IMG.setBKImage(item.exsubs.canGatherFlag, '');
		}
	};
	
	_lc_._getCanGatherFarmFlags = function(tabIdx){
		var roleIds = [];
		var list = _lc_.m_items.tablist.getTabItems(tabIdx).list;
		for ( var i=0; i<list.getCount(); ++i ){
			var item = list.getItem(i);
			var resIdx = _lc_._getResIdxByUIItem(item);
			var res = _lc_._getResListItem(tabIdx, resIdx);
			roleIds.push(res.roleId);
		}
		FarmSender.sendGetCanGatherFlags(_lc_.m_g, roleIds, tabIdx);
	};
	
	_lc_._handleApplyMsg = function(){
		if ( _lc_.m_g.getImgr().getFriends().applys.length == 0 ){
			return;
		}
		
		_lc_.m_items.applyListBtn.startBlinking(0);
	};
	
	_lc_._handleCache = function(){
		var roleId = _lc_._getTopChatRoleIdFromChatCache();
		if ( roleId <= 0 ) return;
		
		var ret = _lc_._getItemIdxInfoByRoleId(roleId);
		var res = _lc_._getResListItem(ret.tabidx, ret.residx);
		if ( !res ) return;
		
		_lc_._openChatDlgAndHandleCache(res, ret.tabidx, ret.itemidx, ret.residx);
	};
	
	_lc_._getTopChatRoleIdFromChatCache = function(){
		if ( _lc_.m_chatCache.length == 0 ){
			return 0;
		}
		
		return _lc_.m_chatCache[0].roleId;
	};
	
	_lc_._openChatDlgAndHandleCache = function(resItem, tabIdx, uiItemIdx, resIdx){
		_lc_._openChatDlg(resItem);
		_lc_._stopItemBlink(tabIdx, uiItemIdx);
		_lc_._popBlinkCache(resIdx);
		_lc_._handleChatCache(resItem.roleId);
	};
	
	_lc_._openChatDlg = function(item){
		var chatdlg = _lc_._getFitIdOrAllocChatDlg(item.roleId);
		chatdlg.openDlg(item);
		chatdlg.focus();
	};
	
	_lc_._stopItemBlink = function(tabIdx, uiItemIdx){
		var b = _lc_._getItemBlink(tabIdx, uiItemIdx);
		if ( b ){
			b.used = false;
			b.b.stop();
		}
		
		var item = _lc_._getUIListItem(tabIdx, uiItemIdx);
		if ( item ){
			IMG.setBKImage(item.exsubs.talkflag, '');
		}
	};
	
	_lc_._handleChatCache = function(roleId){
		var netchats = []; // collect chat msg where chat.roleId = roleId
		for ( var i=_lc_.m_chatCache.length-1; i>=0; --i ){
			var cc = _lc_.m_chatCache[i];
			if ( cc.roleId == roleId ){
				TQ.removeElement(_lc_.m_chatCache, i);
				netchats.push(cc);
			}
		}
		
		for ( var i=netchats.length-1; i>=0; --i ){
			var netchat = netchats[i];
			_lc_._onChatMsg(netchat);
		}
	};
	
	_lc_._updateTabList = function(){
		if (!_lc_.m_dlg) return;
		
		_lc_._setPageBarsCount();
		_lc_._setTabListItems();
		_lc_._setTabListItemsBtnCallers();
		_lc_._initTabListSelectItem();
	};
	
	_lc_._updateItemsBlink = function(){
		_lc_._stopAllItemsBlink();
		_lc_._startAllItemsBlink();
	};
	
	_lc_._stopAllItemsBlink = function(){
		var list = _lc_.m_items.tablist.getTabItems(_lc_._getCurTabIdx()).list;
		for ( var i=0; i<list.getCount(); ++i ){
			_lc_._stopItemBlink(_lc_._getCurTabIdx(), i);
		}
	};
	
	_lc_._startAllItemsBlink = function(){
		var list = _lc_.m_items.tablist.getTabItems(_lc_._getCurTabIdx()).list;
		for ( var i=0; i<list.getCount(); ++i ){
			var item = list.getItem(i);
			var residx = _lc_._getResIdxByUIItem(item);
			if ( !_lc_._isBlinkResIdx(residx) ) {
				continue;
			}
			
			if ( _lc_._isMostTopChatDlg(_lc_._findDlgIdxByResIdx(residx)) ){
				_lc_._popBlinkCache(residx);
				continue;
			}
			
			_lc_._startItemBlink(_lc_._getResListItem(_lc_._getCurTabIdx(), residx), _lc_._findDlgIdxByResIdx(residx));
		}
	};
	
	_lc_._findDlgIdxByResIdx = function(residx){
		var resItem = _lc_._getResListItem(_lc_._getCurTabIdx(), residx);
		if ( !resItem ) return -1;
		
		TQ.find(_lc_.m_chatDlgs, 'roleId', resItem.roleId);
		return TQ.getLastFindIdx();
	};
	
	_lc_._setPageBarsCount = function(){
		for ( var tabIdx=0; tabIdx<C_TAB_CNT; ++tabIdx ){
			var resList = _lc_._getTabResList(tabIdx);
			var tabItems = _lc_.m_items.tablist.getTabItems(tabIdx);
			var pageCount = Math.ceil(resList.length/_lc_.C_ITEM_COUNT);
			tabItems.pagebar.setPageCnt((pageCount>0) ? pageCount : 1);
		}
	};
	
	_lc_._setTabListItems = function(){
		_lc_._setListItem = function(resIdx, res, item){
			ItemResUtil.initItemres(res, 'icon');
			IMG.setBKImage(item.exsubs.icon,IMG.makeSmallImg(res.itemres.mini_smallpic));
			var name = RStrUtil.makeXDiamondRoleName(res.roleName, res);
			TQ.setHtml(item.exsubs.name, name);
		};
		
		_lc_._travelTabList(_lc_._setListItem);
	};
	
	_lc_._setTabListItemsBtnCallers = function(){
		_lc_._setListItemBtnCaller = function(resIdx, res, item){
			item.exsubs.farmBtn.setId(resIdx);
			item.exsubs.farmBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickTopFarmBtn});
		};
		
		_lc_._travelTabList(_lc_._setListItemBtnCaller);
	};
	
	_lc_._travelTabList = function(callBack){
		for ( var tabIdx=0; tabIdx<C_TAB_CNT; ++tabIdx ){
			_travelList(tabIdx, callBack);
		}
	};
	
	var _travelList = function(tabIdx, callBack){
		var tabItems = _lc_.m_items.tablist.getTabItems(tabIdx);
		var resList = _lc_._getTabResList(tabIdx);
		var pageNo = tabItems.pagebar.getCurPage();
		var range = _lc_._getListRangeByPageIdx(resList, pageNo);
		tabItems.list.setItemCount(range.count);
		for ( var resIdx=range.start; resIdx<(range.start+range.count); ++resIdx ) {
			var res = resList[resIdx];
			var item = tabItems.list.getItem(resIdx-range.start);
			callBack(resIdx, res, item);
		}
	};
	
	_lc_._getListRangeByPageIdx = function(resList, pageNo){
		var pageIdx = pageNo - 1;
		var start = pageIdx*_lc_.C_ITEM_COUNT;
		var count = Math.min(_lc_.C_ITEM_COUNT, resList.length - start);
		return {count:count, start:start};
	};
	
	_lc_._initTabListSelectItem = function(){
		for ( var i=0; i<C_TAB_CNT; ++i ){
			_lc_.m_items.tablist.getTabItems(i).list.setCurSel(-1);
		}
	};
	
	_lc_._onPageNavigate = function(pageNo){
		_lc_._updateTabList();
		_lc_._updateItemsBlink();
		_lc_._initCanGatherFarmFlags(_lc_._getCurTabIdx());
	};
	
	_lc_._onLoginOk = function(){
		_lc_.m_this.openDlg();
		_lc_.m_dlg.hide();
	};
	
	_lc_._onSvrPkg = function(netevent){
		var cmdpkg = netevent.data;
		if ( cmdpkg.friends ){
			var friends = _lc_.m_g.getImgr().getFriends().friends;
			TQ.dictCopy(friends, cmdpkg.friends);
			_lc_._updateTabList();
			_lc_.m_g.sendEvent({eid:EVT.FRIENDLIST, sid:0});
		}
		
		if ( cmdpkg.hasApply ){
			_lc_._onHasApplyMsg(cmdpkg.hasApply);
		}
		
		if ( cmdpkg.chat ){
			_lc_._onChatMsg(cmdpkg.chat);
		}
		
		return EVENT_RET_OK;
	};
	
	_lc_._onSvrCanGatherFlags = function(netevent){
		var cmdpkg = netevent.data;
		if ( !cmdpkg.farmflags ) return;
		
		_lc_._udpateListItemsGatherFlag(0, cmdpkg.farmflags);
		_lc_._udpateListItemsGatherFlag(1, cmdpkg.farmflags);
	};
	
	_lc_._onEnemyUpdate = function(){
		_lc_._updateTabList();
	};
	
	_lc_._udpateListItemsGatherFlag = function(tabIdx, flags){
		var list = _lc_.m_items.tablist.getTabItems(tabIdx).list;
		for ( var i=0; i<list.getCount(); ++i ) {
			var item = list.getItem(i);
			var resIdx = _lc_._getResIdxByUIItem(item);
			var res = _lc_._getResListItem(tabIdx, resIdx);
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
	
	_lc_._onHasApplyMsg = function(hasApply){
		_lc_.m_items.applyListBtn.startBlinking(0);
		_lc_._startToggleBtnBlink(-1);
	};
	
	_lc_._onChatMsg = function(netchat){
		var findChatIdx = _lc_._handleChatPkgByChatDlgs(netchat);
		if ( _lc_._isMostTopChatDlg(findChatIdx) ){
			var ret = _lc_._getItemIdxInfoByRoleId(netchat.roleId);
			_lc_._stopItemBlink(ret.tabidx, ret.itemidx);
			_lc_._popBlinkCache(ret.residx);
		}
		else {
			_lc_._pushToChatCache(findChatIdx, netchat);
			_lc_._handleNewChatEvent(findChatIdx, netchat);
			_lc_._startItemBlink(netchat, findChatIdx);
			
			var ret = _lc_._getItemIdxInfoByRoleId(netchat.roleId);
			_lc_._pushBlinkCache(ret.residx);
		}
	};
	
	_lc_._pushBlinkCache = function(residx){	
		TQ.find(_lc_.m_blinkResIdxs, null, residx);
		TQ.removeElement(_lc_.m_blinkResIdxs, TQ.getLastFindIdx());
		_lc_.m_blinkResIdxs.push(residx);
		_lc_._startHeadIconBlink(residx);
	};
	
	_lc_._popBlinkCache = function(residx){
		TQ.find(_lc_.m_blinkResIdxs, null, residx);
		TQ.removeElement(_lc_.m_blinkResIdxs, TQ.getLastFindIdx());
		_lc_._stopHeadIconBlink(residx);
		_lc_._startHeadIconBlink(_lc_.m_blinkResIdxs[_lc_.m_blinkResIdxs.length-1]);
	};
	
	_lc_._isBlinkResIdx = function(residx){
		TQ.find(_lc_.m_blinkResIdxs, null, residx);
		return TQ.getLastFindIdx() >= 0;
	};
	
	_lc_._handleChatPkgByChatDlgs = function(netchat){
		for (var i=0; i<_lc_.m_chatDlgs.length; ++i) {
			if (_lc_.m_chatDlgs[i].chat.handleChatPkg(netchat) == EVENT_RET_BREAK) {
				return i;
			}
		}
		return -1;
	};
	
	_lc_._pushToChatCache = function(findChatIdx, netchat){
		if ( findChatIdx < 0 ){
			_lc_.m_chatCache.push(netchat);
		}
	};
	
	_lc_._handleNewChatEvent = function(findChatIdx, netchat){
		_lc_._startToggleBtnBlink(_getDuration(findChatIdx));
	};
	
	_lc_._startToggleBtnBlink = function(duration){
		if (_lc_._isShow()) return;
		_lc_.m_items.toggleBtn.startBlinking(duration);
	};
	
	_lc_._startItemBlink = function(netchat, findChatDlgIdx){
		if ( !_lc_.m_dlg ) return;
		
		var ret = _lc_._getItemIdxInfoByRoleId(netchat.roleId);
		var item = _lc_._getUIListItem(ret.tabidx, ret.itemidx);
		if (!item) return;
		
		var b = _lc_._getItemBlink(ret.tabidx, ret.itemidx);
		if ( !b ){
			b = _lc_._allocItemBlink();
		}
		
		b.tabidx = ret.tabidx;
		b.itemidx = ret.itemidx;		
		b.b.bind(item.exsubs.icon, {tabidx:ret.tabidx, itemidx:ret.itemidx});
		b.b.start(_getDuration(findChatDlgIdx));
		b.b.setCaller({self:_lc_.m_this, caller:_lc_._onItemBlinkEnd});
	};
	
	_lc_._startHeadIconBlink = function(resIdx){
		var res = _lc_._getResListItem(_lc_._getCurTabIdx(), resIdx);
		if (!res) return;
		
		ItemResUtil.initItemres(res, 'icon');
		IMG.setBKImage(_lc_.m_items.headicon,IMG.makeSmallImg(res.itemres.mini_smallpic));
		TQ.setTextEx(_lc_.m_items.headname, res.roleName);

		_lc_.m_headiconblink.start(-1);
	};
	
	_lc_._stopHeadIconBlink = function(resIdx){
		IMG.setBKImage(_lc_.m_items.headicon,'');
		TQ.setTextEx(_lc_.m_items.headname, '');

		_lc_.m_headiconblink.stop();
	};
	
	_lc_._createHeadIconBlink = function(){
		_lc_.m_headiconblink = BlinkingCtrl.snew(_lc_.m_g);
		_lc_.m_headiconblink.bind(_lc_.m_items.headiconname, {});
	};
	
	_lc_._isShow = function(){
		if ( !_lc_.m_dlg ) return false;
		return _lc_.m_dlg.isShow();
	};
	
	_lc_._onItemBlinkEnd = function(param){
		var item = _lc_._getUIListItem(param.tabidx, param.itemidx);
		if ( !item ) return;
		
		IMG.setBKImage(item.exsubs.talkflag, IMG.getItemTalk());
		_lc_._setTalkFlagPos(item);
	};
	
	_lc_._onClickToggleBtn = function(){
		_lc_._resetPos();
		_lc_.m_items.toggleBtn.stopBlinking();
		if ( TQ.isMobile() ) {
			if ( _lc_._isShow() ){
				_lc_.m_dlg.hide();
			} else {
				_lc_.m_dlg.show();
				_lc_._initCanGatherFarmFlags(0);
				_lc_._initCanGatherFarmFlags(1);
				_lc_.m_this._notifyOpenDlg();
			}
		}
	};
	
	_lc_._onClickAddBtn = function(){
		if (!JVALID.checkUsername(_lc_.m_items.addName.value)){
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100050].msg);
			return;
		}
		
		FriendSender.sendApplyFriend(_lc_.m_g, _lc_.m_items.addName.value);
	};
	
	_lc_._onClickApplyListBtn = function(){
		_lc_.m_items.applyListBtn.stopBlinking();
		UIM.openDlg('friendapplylist');
	};
	
	_lc_._onClickRefreshBtn = function(){
		_lc_._initCanGatherFarmFlags(0);
		_lc_._initCanGatherFarmFlags(1);
	};
	
	_lc_._onSelectListItem = function(e, idx){
		if (_lc_.m_fromTopFarmBtn) {
			_lc_._onOpEnterFarm();
			_lc_.m_fromTopFarmBtn = false;
			return;
		}
		
		_lc_._collapseListSelItem(idx);
		_lc_._expandCurSelItem(idx);
	};
	
	_lc_._onClickHeadIconName = function(){
		if ( _lc_.m_blinkResIdxs.length == 0 ) return;
		
		var resIdx = _lc_.m_blinkResIdxs[_lc_.m_blinkResIdxs.length-1];
		var resItem = _lc_._getResListItem(_lc_._getCurTabIdx(), resIdx);
		if (!resItem) return;
		
		var ret = _lc_._getItemIdxInfoByRoleId(resItem.roleId);
		_lc_._openChatDlgAndHandleCache(resItem,  _lc_._getCurTabIdx(), ret.itemidx, resIdx);
	};
	
	_lc_._resetPos = function(){	
		if ( TQ.isMobile() ) return;
		_lc_._resetDlgVisible();
		_lc_._resetDlgPos();
		_lc_._resetToggleBtnPos();
		_lc_._resetToggleBtnZIndex();
	};
	
	_lc_._resetDlgPos = function(){
		if ( TQ.isMobile() ) return;
		var clientSize = _lc_.m_g.getWinSizer().getValidClientSize();
		var dlgPos = { x:clientSize.cx - _lc_.C_DLG_W, y:_lc_.C_DLG_TOP };
		_lc_.m_dlg.setPosition(dlgPos);
	};
	
	_lc_._resetDlgVisible = function(){
		if ( !_lc_.m_items.toggleBtn.isPress() ){
			_lc_.m_dlg.hide();
		} else {
			_lc_.m_dlg.show();
			_lc_._initCanGatherFarmFlags(0);
			_lc_._initCanGatherFarmFlags(1);
		}
	};
	
	_lc_._resetToggleBtnPos = function(){
		if ( TQ.isMobile() ) return;		
		var clientSize = _lc_.m_g.getWinSizer().getValidClientSize();
		var btnPos = { x:clientSize.cx - _lc_.C_TOGGLE_W, y:_lc_.C_DLG_TOP + _lc_.C_TOGGLE_REF_TOP};
		if ( _lc_.m_items.toggleBtn.isPress() ){
			btnPos.x -= _lc_.C_DLG_W;
		}
		TQ.setDomPos(_lc_.m_items.toggleBtn.getParent(), btnPos.x, btnPos.y);
	};
	
	_lc_._resetToggleBtnZIndex = function(){
		if ( !_lc_._isShow() || TQ.isMobile() ) return;
		TQ.setCSS(_lc_.m_items.toggleBtn.getParent(), 'zIndex', _lc_.m_dlg.getZIndex());
	};
	
	_lc_._collapseListSelItem = function(){
		var lastNode = _lc_.m_lastTabListSelIdxs[_lc_._getCurTabIdx()];
		if (lastNode.resIdx == _lc_._getCurSelResItemIdx()) {
			return;
		}
		
		if (!lastNode.uiItem) {
			return;
		}
		
		_lc_._setListItemHeight(lastNode.uiItem, _lc_.C_ITEM_H);
		_lc_._setListItemIconAndNameRect(lastNode.uiItem, _lc_.C_ITEM_ICON_W, _lc_.C_ITEM_ICON_H
			,_lc_.C_ITEM_NAME_L, _lc_.C_ITEM_NAME_T, _lc_.C_ITEM_NAME_W, _lc_.C_ITEM_NAME_H );
		_lc_._setListItemIconSmallBkImg(lastNode.uiItem, _lc_._getCurTabIdx(), _lc_._getResIdxByUIItem(lastNode.uiItem));
		_lc_._removeListItemOpDom(lastNode.uiItem, _lc_._getCurTabIdx());
		_lc_._setTalkFlagPos(lastNode.uiItem);
	};
	
	_lc_._expandCurSelItem = function(){
		var lastNode = _lc_.m_lastTabListSelIdxs[_lc_._getCurTabIdx()];
		if (lastNode.resIdx == _lc_._getCurSelResItemIdx()) {
			return;
		}
		
		lastNode.resIdx = _lc_._getCurSelResItemIdx();
		lastNode.uiItem = _lc_._getCurSelUIItem();
		if (!lastNode.uiItem) {
			return;
		}
		
		var curItem = lastNode.uiItem;
		_lc_._setListItemHeight(curItem, _lc_.C_ITEM_SEL_H);
		_lc_._setListItemIconAndNameRect(curItem, _lc_.C_ITEM_ICON_SEL_W, _lc_.C_ITEM_ICON_SEL_W
			,_lc_.C_ITEM_NAME_SEL_L, _lc_.C_ITEM_NAME_SEL_T, _lc_.C_ITEM_NAME_SEL_W, _lc_.C_ITEM_NAME_SEL_H );
		_lc_._setListItemIconBigBkImg(curItem, _lc_._getCurTabIdx(), _lc_._getCurSelResItemIdx());
		_lc_._appendListItemOpDom(curItem, _lc_._getCurTabIdx(), _lc_._getCurSelItemIdx());
		_lc_._setTalkFlagPos(curItem);
	};	
	
	_lc_._setListItemHeight = function(item, itemHeight){
		TQ.setDomHeight(item.item, itemHeight );
		TQ.setDomHeight(item.item.childNodes[0], itemHeight );
	};
	
	_lc_._setListItemIconAndNameRect = function(item, iconW, iconH, nameL, nameT, nameW, nameH){
		TQ.setDomSize(item.exsubs.icon, iconW, iconH);
		TQ.setDomRect(item.exsubs.name, nameL, nameT, nameW, nameH);
	};
	
	_lc_._setListItemIconBigBkImg = function(item, tabIdx, resIdx){
		var resItem = _lc_._getResListItem(tabIdx, resIdx);
		if (!resItem) return;
		IMG.setBKImage(item.exsubs.icon,IMG.makeSmallImg(resItem.itemres.mid_smallpic));
	};
	
	_lc_._setListItemIconSmallBkImg = function(item, tabIdx, resIdx){
		var resItem = _lc_._getResListItem(tabIdx, resIdx);
		if (!resItem) return;
		IMG.setBKImage(item.exsubs.icon,IMG.makeSmallImg(resItem.itemres.mini_smallpic));
	};
	
	_lc_._removeListItemOpDom = function(item, tabIdx){
		var itemcon = item.item.childNodes[0];
		TQ.remove(itemcon, _lc_.m_tabListOps[tabIdx].opDom);
	};
	
	_lc_._appendListItemOpDom = function(item, tabIdx, itemIdx){
		var itemcon = item.item.childNodes[0];
		TQ.append(itemcon, _lc_.m_tabListOps[tabIdx].opDom);
		var opBtns = _lc_.m_tabListOps[tabIdx].opBtns;
		for ( var i=0; i<opBtns.length; ++i ) {
			var opBtn = opBtns[i];
			opBtn.setId( (opBtn.getId()%C_ITEMOP_MAX) + itemIdx*C_ITEMOP_MAX );
		}
	};
	
	_lc_._onChatDlgUp = function(role){
		var ret = _lc_._getItemIdxInfoByRoleId(role.roleId);
		_lc_._stopItemBlink(ret.tabidx, ret.itemidx);
		_lc_._popBlinkCache(ret.residx);
	};
	
	_lc_._onDblClickListItem = function(e, idx){
		if (_lc_._getCurTabIdx() != C_FRIEND_TABIDX) 
			return;
			
		_lc_._onOpTalkWith();
	};
	

	_lc_._onClickTopFarmBtn = function(id){
		_lc_.m_fromTopFarmBtn = true;
	};
	
	_lc_._onClickItemOpBtn = function(id){
		_lc_._setListCurSelByOpBtnId(id);
		
		var opId = (id%C_ITEMOP_MAX);
		if ( _cannotOpWhenRoleDied(opId) ){
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.friend.maindlg.tip.opDiedFriend);
			return;
		}
		
		if ( opId == _lc_.C_ITEMOP_ENTERFARM ){
			_lc_._onOpEnterFarm();
		} else if ( opId == _lc_.C_ITEMOP_TALK ){
			_lc_._onOpTalkWith();
		} else if ( opId == _lc_.C_ITEMOP_DETAIL ){
			_lc_._onOpShowDetail();
		} else if ( opId == _lc_.C_ITEMOP_LETTER ){
			_lc_._onOpWriteLetter();
		} else if ( opId == _lc_.C_ITEMOP_DEL ){
			_lc_._onOpDeleteFriend();
		}
	};
	
	var _cannotOpWhenRoleDied = function(opId){
		if ( opId == _lc_.C_ITEMOP_ENTERFARM || opId == _lc_.C_ITEMOP_TALK || opId == _lc_.C_ITEMOP_LETTER ) {
			var curItem = _lc_._getCurSelResItem();
			if (curItem.died == 1) return true;
		}
		return false;
	};
	
	_lc_._onOpEnterFarm = function(){
		var curItem = _lc_._getCurSelResItem();
		UIM.closeMapPanels();
		UIM.getPanel('farm').open(curItem.roleId);
	};
	
	_lc_._onOpTalkWith = function(){
		_lc_._openChatDlgAndHandleCache(_lc_._getCurSelResItem(), _lc_._getCurTabIdx(), _lc_._getCurSelItemIdx(), _lc_._getCurSelResItemIdx());
	};
	
	_lc_._onOpShowDetail = function(){
		var curItem = _lc_._getCurSelResItem();
		OutFieldSender.sendGetFieldDetail(_lc_.m_g, curItem.gridId);
	};
	
	_lc_._onOpWriteLetter = function(){
		var dlg = UIM.getDlg('writeletter');
		dlg.openDlg();
		dlg.clear();
		dlg.setRecv( _lc_._getCurSelResItem().roleName );
		dlg.setFocus('title');
	};
	
	_lc_._onOpDeleteFriend = function(){
		var curItem = _lc_._getCurSelResItem();
		
		_lc_._delFriendCallback = function(id){
			if ( id == MB_IDYES ){
				FriendSender.sendDeleteFriend(_lc_.m_g, curItem.roleId);
			}
		};
		
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, 
			TQ.format(rstr.friend.maindlg.dels[_lc_._getCurTabIdx()], curItem.roleName),
			MB_F_YESNO, {self:_lc_.m_this, caller:_lc_._delFriendCallback} );
	};
	
	_lc_._isMostTopChatDlg = function(chatIdx){
		if (chatIdx<0) return false;
		
		var chat = _lc_.m_chatDlgs[chatIdx].chat;
		var maxz = _lc_._getMostTopZIndex();
		return ( chat.getCore().getZIndex() >= maxz );
	};
	
	_lc_._getMostTopZIndex = function(){
		var maxZIndex = 0;
		for ( var i=0; i<_lc_.m_chatDlgs.length; ++i ){
			var chatCoreDlg = _lc_.m_chatDlgs[i].chat.getCore();
			if ( !chatCoreDlg.isShow() ) continue;
			if ( chatCoreDlg.getZIndex() <= maxZIndex ) continue;
			
			maxZIndex = chatCoreDlg.getZIndex();
		}
		return maxZIndex;
	};	
	
	_lc_._setTalkFlagPos = function(item){
		var icon = item.exsubs.icon;
		var w = TQ.getDomWidth(icon);
		var h = TQ.getDomHeight(icon);
		var talkflag = item.exsubs.talkflag;
		var tw = TQ.getDomWidth(talkflag);
		var th = TQ.getDomHeight(talkflag);
		TQ.setCSS(talkflag, 'left', (w-tw)+'px');
		TQ.setCSS(talkflag, 'top', (h-th)+'px');
	};
	
	_lc_._getItemIdxInfoByRoleId = function(roleId){
		var tabIdxs = [C_FRIEND_TABIDX, C_ENEMY_TABIDX];
		for ( var i=0; i<tabIdxs.length; ++i ){
			var tabIdx = tabIdxs[i];
			var resList = _lc_._getTabResList(tabIdx);
			if ( TQ.find(resList, 'roleId', roleId) ){
				var tabItems = _lc_.m_items.tablist.getTabItems(tabIdx);
				var pageNo = tabItems.pagebar.getCurPage();
				var range = _lc_._getListRangeByPageIdx(resList, pageNo);
				var itemidx = TQ.getLastFindIdx()-range.start;
				if ( itemidx < 0 ) itemidx = -1;
				if ( itemidx >= _lc_.C_ITEM_COUNT ) itemidx = -1;
				return {tabidx:tabIdxs[i], residx:TQ.getLastFindIdx(), itemidx:itemidx};
			}
		}
		return {tabidx:0, residx:-1, itemidx:-1};
	};
	
	_lc_._getTabResList = function(tabidx){
		var friends = _lc_.m_g.getImgr().getFriends();
		var maps = {'0':friends.friends, '1':friends.enemys};
		return maps[tabidx];
	};
	
	_lc_._getUIListItem = function(tabidx, itemidx){
		var list = _lc_.m_items.tablist.getTabItems(tabidx).list;
		return list.getItem(itemidx);
	};
	
	_lc_._getResListItem = function(tabidx, resIdx){
		var lists = _lc_._getTabResList(tabidx);
		return lists[resIdx];
	};
	
	_lc_._getCurSelResItem = function(){ 
		return _lc_._getResListItem(_lc_._getCurTabIdx(), _lc_._getCurSelResItemIdx());
	};
	
	_lc_._getCurSelUIItem = function(){ 
		return _lc_._getUIListItem(_lc_._getCurTabIdx(), _lc_._getCurSelItemIdx());
	};
	
	_lc_._getCurSelItemIdx = function(){ 
		var tabIdx = _lc_._getCurTabIdx();
		return  _lc_.m_items.tablist.getTabItems(tabIdx).list.getCurSel();
	};
	
	_lc_._getCurSelResItemIdx = function(){ 
		var uiItem = _lc_._getUIListItem(_lc_._getCurTabIdx(), _lc_._getCurSelItemIdx());
		return _lc_._getResIdxByUIItem(uiItem);
	};
	
	_lc_._getResIdxByUIItem = function(uiItem){
		if (!uiItem) return -1;
		return uiItem.exsubs.farmBtn.getId();
	};
	
	_lc_._getItemBlink = function(tabidx, itemidx){
		for ( var i=0; i<_lc_.m_blinkCtrls.length; ++i ){
			var blink = _lc_.m_blinkCtrls[i];
			if (!blink.used) continue;
			if (blink.tabidx != tabidx) continue;
			if (blink.itemidx != itemidx) continue;
			
			return blink;
		}
		return null;
	};
	
	_lc_._allocItemBlink = function(){
		for ( var i=0; i<_lc_.m_blinkCtrls.length; ++i ){
			var blink = _lc_.m_blinkCtrls[i];
			if ( blink.used ) continue;
			
			blink.used = true;
			return blink;
		}
		
		var blink = BlinkingCtrl.snew(_lc_.m_g);
		_lc_.m_blinkCtrls.push({used:true,tabidx:0,itemidx:0,b:blink});
		return _lc_.m_blinkCtrls[_lc_.m_blinkCtrls.length-1];
	};
	
	_lc_._getFitIdOrAllocChatDlg = function(roleId){
		var chat = TQ.find(_lc_.m_chatDlgs, 'roleId', roleId);
		if ( chat ){
			return chat.chat;
		}
		
		return _lc_._allocChatDlg(roleId);
	};
	
	_lc_._allocChatDlg = function(roleId){
		var chat = null;
		for ( var i=0; i<_lc_.m_chatDlgs.length; ++i ){
			var c = _lc_.m_chatDlgs[i].chat;
			if ( c.getCore().isShow() ) continue; // 查找已被关闭的
			
			_lc_.m_chatDlgs[i].roleId = roleId;
			chat = c;
			break;
		}
		
		if ( !chat ){
			chat = ChatDlg.snew(_lc_.m_g);
			chat.setUpCaller(Caller.snew(_lc_.m_this, _lc_._onChatDlgUp));
			_lc_.m_chatDlgs.push({chat:chat,roleId:roleId});
		}
		
		chat.clear();
		return chat;
	};
	
	_lc_._getCurTabIdx = function(){
		return _lc_.m_items.tablist.getActiveTab();
	};
	
	_lc_._setListCurSelByOpBtnId = function(id){
		var listIdx = Math.floor(id/C_ITEMOP_MAX);
		var list = _lc_.m_items.tablist.getTabItems(_lc_._getCurTabIdx()).list;
		list.setCurSel(listIdx);
	};
	
	var _getDuration = function(findChatIdx){
		return findChatIdx < 0 ? -1 : _lc_.C_NEWCHAT_DURATION_MS;
	};
	
	//FriendDlg-unittest-end
});

