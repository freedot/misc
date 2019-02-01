// 包裹对话框
PackageDlg = ListenerBaseDlg.extern(function(){
	//PackageDlg-unittest-start
	//const data
	var CMD_USEITEM = 0;
	var CMD_USEITEMS = 1;
	var CMD_DROPITEM = 2;
	var CMD_SENDCHAT = 3;
 	
	//private:data
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_classitemObj = null;
	var m_itemsOpHdr = null;
	var m_opmenu = null;
	var m_modifys = null;
	
	this._init = function(){
		m_g = this.g_;
		m_this = this;
		m_classitemObj = PackageClassifyItems.snew(m_g);
		m_itemsOpHdr = ItemsOpHdr.snew(m_g);
		m_g.regEvent(EVT.NET, NETCMD.PKG, m_this, _onSvrPkg);
		m_g.regEvent(EVT.LOGIN_OK, 0, m_this, _onLoginOk);
		_setModifys();
	};
	
	this.getCore = function(){
		return m_dlg; 
	};
	
	this.getCtrl = function(ctrlname){
		return m_items[ctrlname];
	};
	
	this.getOpMenu = function(){
		return m_opmenu;
	};
	
	this.openDlg = function(){
		_initDlg();
		_setInfo();
		_setRedDot();
		HelpGuider.getNewcomerSpirit().onDlgOpen('package', {parent:m_dlg.getParent(), items:m_items});
		this._notifyOpenDlg();
	};
	
	this.hideDlg = function(){
		if ( m_dlg ) {
			m_dlg.hide();
		}
	};
	
	this.isShow = function(){
		if (!m_dlg) return false;
		return m_dlg.isShow();
	};
	
	this.getIdxByTabIdxAndItemResId = function(tabIdx, resid){
		var items = m_classitemObj.getClassItems(tabIdx).items;
		for ( var i=0; i<items.length; ++i ) {
			var item = items[i];
			if ( item.itemres.id == resid 
				|| item.itemres.bindid == resid 
				|| item.itemres.nobindid == resid ){
				return i;
			}
		}
		
		return -1;
	};
	
	var _initDlg = function(){
		if ( m_dlg ) {
			m_dlg.show();
		}
		else {
			m_dlg = Dialog.snew(m_g,{modal:false,
				title:rstr.pkgdlg.title,
				pos:{x:"center", y:25} });
			m_g.getGUI().initDlg(m_dlg, uicfg.pkgdlg, m_items);
			m_dlg.setCaller({self:m_this,caller:_onDlgEvent});
			_initTabs();
			_initLists();
			_initOpBtns();
			_initOpMenu();
		}
	};
	
	var _initTabs = function(){
		for ( var i=0; i<rstr.pkgdlg.tabs.length; ++i ) {
			m_items.tab.setTabText(i, rstr.pkgdlg.tabs[i]);
		}
		m_items.tab.setCaller({self:m_this, caller:_onClickTabBtn});
	};
	
	var _initLists = function(){
		for ( var i=0; i<rstr.pkgdlg.tabs.length; ++i ) {
			m_items.tab.getTabItems(i).list.setCaller({self:m_this,caller:_onSelectListItem});
		}
	};
	
	var _initOpBtns = function(){
		m_items.paybtn.setCaller({self:m_this, caller:_onClickPayBtn});
		m_items.shopbtn.setCaller({self:m_this, caller:_onClickShop});
		m_items.exchangebtn.setCaller({self:m_this, caller:_onClickExchange});
	};
	
	var _initOpMenu = function(){
		m_opmenu = new Menu(m_g,{width:86});
		m_opmenu.addMenuItem({id:CMD_USEITEM,icon:null,text:rstr.pkgdlg.menuops[0]});
		m_opmenu.addMenuItem({id:CMD_USEITEMS,icon:null,text:rstr.pkgdlg.menuops[1]});
		m_opmenu.addMenuItem({id:CMD_DROPITEM,icon:null,text:rstr.pkgdlg.menuops[2]});
		m_opmenu.addMenuItem({id:CMD_SENDCHAT,icon:null,text:rstr.pkgdlg.menuops[3]});
		m_opmenu.setCaller({self:m_this,caller:_onOpMenuCmd});
	};
	
	var _setInfo = function(){
		m_items.tab.activeTab(1);
		_updateGoldNumber();
		_updateGridnumber();
	};
	
	var _setRedDot = function(){
		var hasCanExchange = ( UIM.getDlg('exchange').hasCanExChangeItem(0) 
			|| UIM.getDlg('exchange').hasCanExChangeItem(1) );
		m_items.exchangebtn.setNewFlag(hasCanExchange);
	};
	
	var _updateGridnumber = function(){
		if ( !m_dlg || !m_dlg.isShow() )  return; 
		var imgr = m_g.getImgr();
		TQ.setTextEx(m_items.gridnum, imgr.getPkgs().items.length+'/'+imgr.getMaxGrids());
	};
	
	var _updateGoldNumber = function(){
		if ( !m_dlg || !m_dlg.isShow() )  return; 
		var imgr = m_g.getImgr();
		TQ.setTextEx(m_items.gold, imgr.getGold());
		TQ.setTextEx(m_items.giftgold, imgr.getGiftGold());
	};
	
	var _updateItemList = function(){
		if ( !m_dlg || !m_dlg.isShow() )  return; 
		_setOneClassItemsList(m_items.tab.getActiveTab());
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			HelpGuider.getNewcomerSpirit().onDlgClose('package');
		}
	};	

	var _onLoginOk = function(){
		var sendmsg = '{cmd='+NETCMD.PKG+',subcmd=0}';
		m_g.send(null, sendmsg);
	};
	
	var _onSvrPkg = function(netevent){
		var cmdpkg = netevent.data;
		if ( !cmdpkg.pkg )  return; 
		
		_onPkgItems(cmdpkg.pkg.items);
		_onPkgMisc(cmdpkg.pkg.misc);
		_onPkgSalveMax(cmdpkg.pkg.salveMax);
		
		_updateGoldNumber();
		_updateGridnumber();
		_updateItemList();
		
		if ( m_this.isShow() ) {
			HelpGuider.getNewcomerSpirit().onDlgOpen('package', {parent:m_dlg.getParent(), items:m_items});
		}
	};
	
	var _onPkgItems = function(netItems){
		if ( !netItems ) return;
		
		_deleteInvalidItem(netItems);
		_setModifys();
		_initNetItemsResId(netItems);
		var pkgs = m_g.getImgr().getPkgs();
		TQ.dictCopy(pkgs.items, netItems);
		m_classitemObj.refresh();
		ItemResUtil.initItemsres(pkgs.items);
		m_g.sendEvent({eid: EVT.PKG_CHANGE, sid: 0});
	};
	
	var _deleteInvalidItem = function(netItems) {
		var lastLen = netItems.length;
		for ( var i=netItems.length-1; i>=0; --i ) {
			var item = netItems[i];
			if ( item.resid == 0 ) {
				netItems.splice(i, 1);
			}
		}
		if (lastLen != netItems.length) {
			LogSender.sendLog(m_g, 'pkg item resid==0');
		}	
	};
	
	var _onPkgMisc = function(netMisc){
		if ( !netMisc ) return;
		
		var pkgs = m_g.getImgr().getPkgs();
		TQ.dictCopy(pkgs.misc, netMisc);
		m_g.sendEvent({eid: EVT.PKG_CHANGE, sid: 1});
	};
	
	var _onPkgSalveMax = function(netSalveMax){
		if ( !netSalveMax ) return;
		
		var salveInfo = m_g.getImgr().getSalveInfo();
		salveInfo.max = netSalveMax;
		m_g.sendEvent({eid: EVT.PKG_CHANGE, sid: 2});
	};
	
	var _onClickTabBtn = function(idx){
		_setOneClassItemsList(idx);
	};

	var _onClickPayBtn = function() {
		JMISC.openPayWnd();
	};
	
	var _onClickShop = function() {
		UIM.openDlg('shop', 0);
	};
	
	var _onClickExchange = function(){
		UIM.openDlg('exchange');
	};
	
	var _onSelectListItem = function(e,idx){
		var mPos = TQ.mouseCoords(e);
		m_opmenu.show({x:mPos.x+3,y:mPos.y});
		_setOpMenuItemsEnableState();
	};
	
	var _onOpMenuCmd = function(id){
		var ret = true;
		var item = _getCurSel();
		if (!item){
			return;
		}
		
		if ( id == CMD_USEITEM ) {
			ret = m_itemsOpHdr.useItem(item);
		} else if ( id == CMD_USEITEMS ) {
			ret = m_itemsOpHdr.useItems(item);
		} else if ( id == CMD_DROPITEM ) {
			ret = m_itemsOpHdr.dropItem(item);
		} else if ( id == CMD_SENDCHAT ) {
			ret = m_itemsOpHdr.sendChat(item);
		}
		if ( ret ) m_g.getGUI().hideAllMenu();
	};
	
	var _setOpMenuItemsEnableState = function(){
		var item = _getCurSel();
		if (!item){
			return;
		}
		
		m_opmenu.enableItem(CMD_USEITEM, item.itemres.canUse ? true : false);
		m_opmenu.enableItem(CMD_USEITEMS, item.itemres.canUses ? true : false);
		m_opmenu.enableItem(CMD_DROPITEM, item.itemres.canDrop ? true : false);
	};
	
	var _getCurSel = function(){
		var tabidx = m_items.tab.getActiveTab();
		var listidx = m_items.tab.getTabItems(tabidx).list.getCurSel();
		return m_classitemObj.getItem(tabidx, listidx);
	};
	
	var _setOneClassItemsList = function(idx){
		if (!m_modifys[idx]) return;
		var ci = m_classitemObj.getClassItems(idx);
		var list = m_items.tab.getTabItems(idx).list;
		list.setItemCount(ci.items.length);
		for ( var i=0; i<ci.items.length; ++i ){
			var listitem = list.getItem(i);
			CommDrawItem.drawPkgItem(listitem, ci.items[i]);
			TTIP.setCallerData(listitem.exsubs.tooltips['$item'], {self:m_this, caller:_onGetTooltip},{tabidx:idx,idx:i});
		}
		list.scrollPos(0);
		m_modifys[idx] = false;
	};
	
	var _onGetTooltip = function(data){
		var item = m_classitemObj.getItem(data.tabidx, data.idx);
		return item ? TIPM.getItemDesc(item) : null;
	};
	
	var _initNetItemsResId  =function(netItems){
		var pkgs = m_g.getImgr().getPkgs();
		for ( var i=0; i<netItems.length; ++i ) {
			var netItem = netItems[i];
			if (netItem.resid) continue;
			
			var pkgItem = TQ.find(pkgs.items, 'id', netItem.id);
			if (!pkgItem) continue;
			
			netItem.resid = pkgItem.resid;
		}
	};
	
	var _setModifys = function(){
		m_modifys = [true, true, true, true, true, true, true];
	};
	//PackageDlg-unittest-end
});


BaseClassifyItems = JClass.ex({
	init : function(g){
		this.g_ = g;
		this.classitems_ = [];
		this._initClassItems();
		this._initIdRanges();
	}
	
	,getCount : function(){
		return this.classitems_.length;
	}
	
	,getClassItems : function(idx){
		return this.classitems_[idx];
	}
	
	,getItem : function(tabidx, listidx){
		var ci = this.getClassItems(tabidx);
		return ci.items[listidx];
	}
	
	,refresh : function(){
		this._clearItems();
		this._recollectItems();
		this._resortItems();
	}
	
	,_clearItems : function(){
		for ( var i=0; i<this.classitems_.length; ++i ) {
			var ci = this.classitems_[i];
			ci.items = [];
		}
	}
	
	,_recollectItems : function(){
		var items = this._getItems();
		for ( var itemIdx=0; itemIdx<items.length; ++itemIdx ) {
			var item = items[itemIdx];
			var cis = this._getClassItems(item);
			for ( var ciIdx=0; ciIdx<cis.length; ++ciIdx) {
				cis[ciIdx].items.push(item);
			}
		}		
	}
	
	,_resortItems : function(){
		for ( var i=0; i<this.classitems_.length; ++i ) {
			var c = this.classitems_[i];
			c.items.sort(this._sortFun);
		}
	}
	
	,_getClassItems : function(item){
		var cis = [];
		for ( var i=0; i<this.classitems_.length; ++i ) {
			var ci = this.classitems_[i];
			if ( this._isSatisfiedBy(ci, item) ) {
				cis.push(ci);
			}
		}
		return cis;
	}
	
	,_isInRange : function(ci, item){
		return (item.resid >= ci.idrange.min) && (item.resid < ci.idrange.max);
	}
	
	,_initIdRanges : function() {
		for ( var i=0; i<this.classitems_.length; ++i ) {
			var ci = this.classitems_[i];
			ci.idrange = ItemClassRange.getRange(ci.classid).idrange;
		}
	}
	
	,_initClassItems : function(){}
	,_getItems : function() { return []; }
	,_isSatisfiedBy : function(ci, item) { return true; }
	,_sortFun : function(a, b) { return true; }
});

// 处理包裹中分类的物品
PackageClassifyItems = BaseClassifyItems.ex({
	_initClassItems : function(){
		this.classitems_ = [
			{classid:RES_CLS.PKGITEM,items:[]}
			,{classid:RES_CLS.CANUSEITEM,items:[]}
			,{classid:RES_CLS.EQUIPITEM,items:[]}
			,{classid:RES_CLS.SPEEDITEM,items:[]}
			,{classid:RES_CLS.BOOKITEM,items:[]}
			,{classid:RES_CLS.GEMITEM,items:[]}
			,{classid:RES_CLS.TASKITEM,items:[]}];
	}
	
	,_getItems : function(){
		return this.g_.getImgr().getPkgs().items;
	}
	
	,_isSatisfiedBy : function(ci, item) { 
		return this._isInRange(ci, item);
	}
	
	,_sortFun : function(a, b){
		return a.resid - b.resid;
	}
});

//道具的操作的处理（含有ui的操作）
ItemsOpHdr = Class.extern(function(){
	this.init = function(g){
		this.g = g;
	};
	
	this.useItem = function(item){
		if ( item.itemres.id == FIXID.PAICHENGKA 
			|| item.itemres.bindid == FIXID.PAICHENGKA
			|| item.itemres.nobindid == FIXID.PAICHENGKA
			|| HelpGuider.isUsePaiChengKa ) {
			HelpGuider.isUsePaiChengKa = false;
			UIM.getDlg('package').hideDlg();
		}
		var hdr = DirectUseItemHdrMgr.getHdr(item.itemres);
		return hdr.useItem(this.g, item);
	};
	
	this.useItems = function(item){
		var number = this.g.getImgr().getItemNumByResId(item.resid);
		if ( number == 1 ) {
			return this.useItem(item);
		}
		
		var _onInputOk = function(num) {
			UseItemSender.send(this.g, item, num, {type:item.itemres.targets[0]});
		};
		var inputdlg = UIM.getDlg('inputnum');
		inputdlg.openDlg(rstr.pkgdlg.lbl.useitems, Math.min(res_max_canuseitem_number, number));
		inputdlg.setCaller({self:this, caller:_onInputOk});
		
		return true;
	};
	
	this.dropItem = function(item){
		var _g = this.g;
		var _onDropCallback = function(id) {
			if ( id == MB_IDYES ) {
				ItemOpSender.sendDropItem(_g, item);
			}
		};
		
		this.g.getGUI().msgBox(rstr.comm.msgts, rstr.pkgdlg.lbl.dropitem,  MB_F_YESNO, {self:this, caller:_onDropCallback} );
		
		return true;
	};
	
	this.sendChat = function(item){
		var msg = '#[i:' + item.resid + ':' + item.id + ':' + this.g.getImgr().getRoleId() + ']';
		UIM.getPanel('chat').sendMessageToCurChannel(msg);
		
		return true;
	};
});

DirectCommUseItemHdr = Class.extern(function(){
	this.useItem = function(g, item){
		UseItemSender.send(g, item, 1, {type:item.itemres.targets[0]});
		return true;
	};
});

DirectSendWorldBlessUseItemHdr = Class.extern(function(){
	var MAX_MSG_LEN = 40;
	this.useItem = function(g, item){
		var _onMsgCallback = function(msg){
			var msg = TQ.encodeMessage(msg);
			UseItemSender.send(g, item, 1, {type:item.itemres.targets[0], msg:msg});
		};
		
		var dlg = UIM.getDlg('inputtext');
		dlg.setCaller({self:this, caller:_onMsgCallback});
		dlg.openDlg(rstr.pkgdlg.lbl.inputbless, MAX_MSG_LEN);
		
		return true;
	};
});

DirectSetPosMoveCityUseItemHdr = Class.extern(function(){
	//DirectSetPosMoveCityUseItemHdr-unittest-start
	var GRID_ROWS_OR_COLS = 200;
	
	this.useItem = function(g, item){
		this._g = g;
		var _onCoodCallback = function(x, y){
			UseItemSender.send(g, item, 1, {type:item.itemres.targets[0], posX:x, posY:y});
			OutFieldSender.sendRefreshFieldsByLastViewPos(g);
		};
		
		var dlg = UIM.getDlg('inputcood');
		dlg.setCaller({self:this, caller:_onCoodCallback});
		
		var rolePos = g.getImgr().getRoleRes().pos;
		
		var view = this._g.getImgr().getMapView();
		var xRange = {min:view.x1, max:view.x2-1};
		var yRange = {min:view.y1, max:view.y2-1};
		var lbl = TQ.format(rstr.pkgdlg.lbl.inputcood
			,rolePos.x, rolePos.y
			,xRange.min, xRange.max
			,yRange.min, yRange.max);
		var outRangeTip = TQ.format(rstr.pkgdlg.lbl.coodoutrange
			,xRange.min, xRange.max
			,yRange.min, yRange.max);		
		dlg.openDlg(lbl, xRange, yRange, outRangeTip);
		return true;
	};
	//DirectSetPosMoveCityUseItemHdr-unittest-end
});

DirectUseItemHdrMgr = Class.extern(function(){
	//DirectUseItemHdrMgr-unittest-start
	var m_specUseItemHdrs = {};
	this.init = function(){
		m_specUseItemHdrs[RES_EFF.SEND_WORLD_BLESS] = DirectSendWorldBlessUseItemHdr.snew();
		m_specUseItemHdrs[RES_EFF.SETPOS_MOVECITY] = DirectSetPosMoveCityUseItemHdr.snew();
	};
	
	this.getHdr = function(itemres){
		if (!this.isSpec(itemres)) {
			return DirectCommUseItemHdr.snew();
		}
		
		return m_specUseItemHdrs[itemres.effects[0].id];
	};
	
	this.isSpec = function(itemres) {
		if (!itemres || !itemres.effects || itemres.effects.length != 1) {
			return false;
		}
		
		return m_specUseItemHdrs[itemres.effects[0].id] != null;
	};
	//DirectUseItemHdrMgr-unittest-end
}).snew();