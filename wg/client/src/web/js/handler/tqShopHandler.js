/******************************************************************************
******************************************************************************/
/** 内嵌的使用道具UI */
InnerUseItem = function(){
	//-----------
	//private:const
	//-----------
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_parent;
	var m_itemgroups;
	var m_uselistdom;
	var m_itemdesc;
	var m_items;
	var m_id=-1;
	
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.initialize = function(g,parent){
		m_g = g;
		m_this = this;
		m_parent = parent;
		_init();
	};
	
	this.setItems = function(items){
		m_items = items;
		_setItems();
	};
	
	this.setCurIdx = function(idx){
		m_itemgroups.select(idx);
	};
	
	this.getItemId = function(){
		return m_id;
	};
	
	//--------------
	// private:method
	//--------------	
	var _init = function(){
		TQ.appendClass(m_parent,'inneruseitem');
		TQ.setHtml(m_parent, rui.useitem.useinner.con);
		m_uselistdom = TQ.getSubDom(m_parent, rui.useitem.useinner.items.uselist);
		m_itemdesc = TQ.getSubDom(m_parent, rui.useitem.useinner.items.desc);
		m_itemgroups = new RadioGroup(true);
		m_itemgroups.setCaller({self:m_this, caller:_onSelectedChange});
	};
	
	var _setItems = function(){
		for ( var i=0; i<m_items.length; ++i ){
			var it = m_items[i];
			var radioitem = new RadioBox(m_g,m_uselistdom);
			m_itemgroups.append(radioitem);
			var resitem = ItemResUtil.findItemres(it.id);
			if ( resitem != null ) {
				radioitem.setId(i);
				radioitem.setText(resitem.name);
			}
		}	
	};
	
	var _onSelectedChange = function(idx){
		_setItemDesc(idx);
	};
	
	var _setItemDesc = function(idx){
		m_id = -1;
		if ( idx >= 0 && idx < m_items.length ){
			var it = m_items[idx];
			var resitem = ItemResUtil.findItemres(it.id);
			if ( resitem != null ) {
				m_id = it.id;
				TQ.setHtml(m_itemdesc, resitem.desc);
			}
		}
		if ( m_id < 0 && m_items.length >= 2 ){
			TQ.setHtml(m_itemdesc, rstr.useitem.innerpanel.defaultdesc);
		}
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

BuyPrice = Class.extern(function(){
	this.getPrice = function(fixedPriceType, buyprice){
		if ( fixedPriceType >= 0 ) {
			return buyprice[fixedPriceType];
		}
		
		for ( var i=0; i<buyprice.length; ++i ){
			if ( buyprice[i]>0 ) return buyprice[i];
		}
		return 0;
	};
	
	this.getUnit = function(fixedPriceType, buyprice){
		if ( fixedPriceType >= 0 ) {
			return rstr.shop.buyitem.paynames[fixedPriceType];
		}
		
		var unit = '';
		for ( var i=0; i<buyprice.length; ++i ){
			if ( buyprice[i]==0 ) {
				continue;
			}
			
			if ( unit != '' ) {
				unit += '/';
			}
			
			unit += rstr.shop.buyitem.paynames[i];
		}
		return unit;		
	};
}).snew();

/** 购买道具对话框 */
BuyItemDlg = Class.extern(function(){
	//BuyItemDlg-unittest-start
	var m_g=null;
	var m_this=null;
	var m_items={};
	var m_dlg=null;
	var m_item=null;
	var m_resItem=null;
	var m_myhave=null;
	var m_buyprice=null;
	var m_maxnum=999;
	
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.openDlg = function(item, buycaller){
		_initParams(item);
		
		if ( !_isCanBuy() ) {
			return;
		}
		
		_initDlg();
		_initInfo();
	};
	
	this.hideDlg = function(){
		if ( m_dlg ) m_dlg.hide();
	};	
	
	var _initDlg = function(){
		if ( m_dlg ) {
			m_dlg.show();
		}
		else {
			m_dlg = Dialog.snew(m_g,{modal:false,
					title:rstr.shop.buyitem.title,
					pos:{x:"center", y:25},
					btns:[
					{btn:{id:0,text:rstr.comm.buyAndUse},caller:{self:m_this,caller:_onClickBuyAndUseBtn}}
					,{btn:{id:0,text:rstr.comm.buy},caller:{self:m_this,caller:_onClickBuyBtn}}
					,{btn:{id:0,text:rstr.comm.cancel},caller:{self:m_this,caller:_onClickCancelBtn}}
					]
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.buy.buyitemdlg, m_items);
			m_items.inum.setCaller({self:m_this,caller:_onNumChange});
			m_items.inum.setLimit(_getLimitNum);
		}
	};
	
	var _initInfo = function(){
		var imgr = m_g.getImgr();
		m_myhave = [imgr.getMoney(), imgr.getGold(), imgr.getGiftGold(),imgr.getPrestige(), imgr.getRoleRes().cityhonor];
		
		CommDrawItem.drawItemIconAndName(m_items.icon, m_items.name, m_resItem);
		TQ.setText(m_items.price, _getItemPrice());
		TQ.setTextEx(m_items.desc.getContainerObj(), m_resItem.desc);
		m_items.desc.refresh();
		m_items.inum.setVal(1);
		m_items.payment.select(m_items.payment.getRadio(0).getId());
		_showOrHideBuyAndUseBtn();
	};
	
	var _showOrHideBuyAndUseBtn = function(){
		if ( !m_resItem.targets || m_resItem.targets.length == 0 || !m_resItem.canBuyAndUse) {
			m_dlg.getBtns()[0].hidden();
		} else {
			m_dlg.getBtns()[0].visible();
		}
	};
	
	var _isCanBuy = function(){
		if ( !_hasPrice() ){
			m_g.getGUI().msgBox(rstr.comm.msgts, rstr.shop.buyitem.cannotbuy, MB_F_CLOSE, null);
			return false;
		}
		
		return true;
	};	
	
	var _initParams = function(item){
		m_item = item;
		m_maxnum = m_item.number ? m_item.number : m_maxnum;
		m_resItem = ItemResUtil.findItemres(item.resid);
		if (m_resItem.nobindid && !item.fixed ) { // find no bind resid
			m_item.resid = m_resItem.nobindid;
			m_resItem = ItemResUtil.findItemres(m_item.resid);
		}
		m_buyprice = m_item.buyprice ? m_item.buyprice : m_resItem.buyprice;
	};
	
	var _hasPrice = function(){
		if (!m_buyprice) {
			return false;
		}
		
		for ( var i=0; i<m_buyprice.length; ++i ){
			if ( m_buyprice[i] > 0 ) {
				return true;
			}
		}
		
		return false;
	};
	
	var _getItemPrice = function(){
		var price = 0;
		for ( var i=0; i<m_buyprice.length; ++i ){
			if ( m_buyprice[i]==0 ) {
				continue;
			}
			price = m_buyprice[i];
		}
		return BuyPrice.getPrice(-1, m_buyprice)+' '+ BuyPrice.getUnit(-1, m_buyprice);
	};
	
	var _onClickBuyBtn = function(){
		if ( _buyItem() ){
			m_dlg.hide();
		}
	};
	
	var _onClickBuyAndUseBtn = function(){
		if ( _buyItem() ) {
			_useItem();
			m_dlg.hide();
		}
	};
	
	var _buyItem = function(){
		var payment = _getPayment();
		if ( _getCanMaxNum() <= 0 ) {
			var msg = TQ.format(rstr.shop.buyitem.lessmoney, rstr.shop.buyitem.paynames[payment]);
			m_g.getGUI().sysMsgTips(SMT_ERROR, msg);
			return false;
		} 
		
		var buynum = m_items.inum.getVal();
		ShopSender.sendBuyItem(m_g, payment, buynum, m_item);
		return true;
	};
	
	var _useItem = function(){
		var useNum = m_items.inum.getVal();
		UseItemSender.send(m_g, m_item, useNum, {type:m_resItem.targets[0]});
	};
	
	var _onClickCancelBtn = function(){
		m_dlg.hide();
	};

	var _onNumChange = function(num){
		_recalPay(num);
	};
	
	var _getLimitNum = function(){
		var max = _getCanMaxNum();
		if ( max <= 0 ) max = 1;
		return {min:1,max:max};
	};
	
	var _getCanMaxNum = function(){
		var max = m_maxnum;
		var payment = _getPayment();
		if ( payment >= 0 ) { 
			var val = parseInt(m_myhave[payment] / m_buyprice[payment], 10);
			if ( val < max ) max = val;
		}
		return max;
	};
	
	var _recalPay = function(num){
		_hideAllPaymentRadios();
		_resetPaymentRadios(num);
	};
	
	var _hideAllPaymentRadios = function(){
		for ( var i=0; i<4; ++i ){
			m_items.payment.getRadio(i).hide();
			m_items.payment.getRadio(i).setId(i+100);
		}
	};
	
	var _resetPaymentRadios = function(num){
		for ( var buyType=0, radioIdx = 0; buyType<m_buyprice.length; ++buyType ){
			if ( m_buyprice[buyType]==0 ) {
				continue;
			}
			
			var radio = m_items.payment.getRadio(radioIdx++);
			var btntext = rstr.shop.buyitem.paynames[buyType] + ' ' + (m_buyprice[buyType]*num)  + ' (' + rstr.comm.have + ':' + m_myhave[buyType]+')';
			radio.setText(btntext);
			radio.setId(buyType);
			radio.show();
		}	
	};
	
	var _getPayment = function(){
		return m_items.payment.getCurSelId();
	};
	//BuyItemDlg-unittest-end
});

BuyItemListDlg = function(){
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_items = {};
		m_ids = [];
		m_dlg = null;
	};
	
	this.openDlg = function(itemids){
		m_ids = itemids;
		_initDlg();
		_initInfo();
		m_dlg.show();
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			
			m_dlg = Dialog.snew(m_g,{modal : false,
					title : rstr.shop.buyitemlist.title,
					pos : {x:'center', y:40}
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.buy.buyitemlistdlg, m_items);
			m_dlg.hide();
			m_items.list.setCaller({self:m_this, caller:_onClickListItem});
		}
	};
	
	var _initInfo = function(){
		m_items.list.setItemCount(m_ids.length);
		_setListItem();
	};
	
	var _setListItem = function(){
		for ( var i=0; i<m_ids.length; ++i ){
			var item = m_items.list.getItem(i);
			var itemres = ItemResUtil.findItemres(m_ids[i]);
			CommDrawItem.drawItemIconAndName(item.exsubs.icon, item.exsubs.name, itemres);
			TTIP.setCallerData(item.exsubs.tooltips['$item'], {self:m_this, caller:_onGetItemTip}, {res:itemres});
		}
	};
	
	var _onClickListItem = function(e, idx){
		UIM.getDlg('buyitem').openDlg({id:0,resid:m_ids[idx],number:10000});
	};
	
	var _onGetItemTip = function(data){
		var item = SysItemMaker.make(0, data.res);
		return TIPM.getItemDesc(item, 'sys');
	};
	


	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items;
	var m_ids=[];
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};


/** 店面管理对话框 */
ManageShopDlg = function(){
	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_items = {};
		m_dlg = null;
		m_dealitems = [];
		m_g.regEvent(EVT.NET, NETCMD.DEAL, m_this, _onSvrPkg);
	};
	
	this.openDlg = function(){
		_initDlg();
		_initInfo();
		m_dlg.show();
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal : true,
					title : rstr.shop.manageshop.title,
					pos : {x:'center', y:40}
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.shop.manageshop, m_items);
			m_dlg.hide();
			_initTooltips();
			_setCallers();
		}
	};
	
	var _initInfo = function(){
	};
	
	var _onSvrPkg = function(netevent){
		var netdata = netevent.data;
		_doManagepShop(netdata);
		_doUpdateList(netdata);
	};
	
	var _doManagepShop = function(netdata){
		if ( !netdata.manageshop )return;
		m_this.openDlg();
		m_items.list.setItemCount(netdata.poscnt);
		_getShopListFromSvr();
	};
	
	var _doUpdateList = function(netdata){
		if ( !netdata.dealitems )return;
		m_dealitems = netdata.dealitems;
		_initItemres(netdata.dealitems);
		_clearList();
		_setList(netdata.dealitems);
		_showUpBtnItem(netdata.dealitems);
	};
	
	var _getShopListFromSvr = function(){
		var sendmsg = '{cmd='+NETCMD.DEAL+',subcmd=2}';
		m_g.send(null, sendmsg);
	};
	
	var _initItemres = function(items){
		for ( var i=0; i<items.length; ++i ){
			items[i].itemres = ItemResUtil.findItemres(items[i].resid);
		}
	};
	
	var _initTooltips = function(){
		for(var i=0, n=m_items.list.getCount(); i<n; ++i){
			var item = m_items.list.getItem(i);
			TTIP.setCallerData(item.exsubs.tooltips['$item'], {self:m_this, caller:_onGetTooltip},{idx:i});
		}
	};
	
	var _setCallers = function(){
		for(var i=0, n=m_items.list.getCount(); i<n; ++i){
			var item = m_items.list.getItem(i);
			item.exsubs.opbtn.setId(i);
			item.exsubs.opbtn.setCaller({self:m_this, caller:_onClickOpBtn});
		}
	};
	
	var _clearList = function(){
		for(var i=0, n=m_items.list.getCount(); i<n; ++i){
			_setListItem(m_items.list.getItem(i), null);
		}
	};
	
	var _setList = function(items){
		for ( var i=0; i<items.length; ++i ){
			_setListItem(m_items.list.getItem(i), items[i]);
		}
	};
	
	var _setListItem = function(item, ritem){
		IMG.setBKImage(item.exsubs.icon, ritem ? IMG.makeBigImg(ritem.itemres.bigpic) : '');
		TQ.setTextEx(item.exsubs.fnum, ritem ? ritem.number : '');
		TQ.setTextEx(item.exsubs.bnum, ritem ? ritem.number : '');
		TQ.setTextEx(item.exsubs.name, ritem ? ritem.itemres.name : '');
		TQ.setTextEx(item.exsubs.price, ritem ? ritem.buyprice : '');
		item.exsubs.opbtn[ritem ? 'show' : 'hide']();
		item.exsubs.opbtn.setText(ritem ? rstr.shop.manageshop.btn.downitem : '');
	};
	
	var _showUpBtnItem = function(items){
		if ( items.length < m_items.list.getCount() ){
			var item = m_items.list.getItem(items.length);
			item.exsubs.opbtn.show();
			item.exsubs.opbtn.setText(rstr.shop.manageshop.btn.upitem);
		}
	};
	
	var _onGetTooltip = function(data){
		if ( m_dealitems[data.idx] ){
			return TIPM.getItemDesc(m_dealitems[data.idx], 'sys');
		}
	};
	
	var _onClickOpBtn = function(id){
		if ( id < m_dealitems.length ){
			_doDownItem(id);
		}
		else{
			_doUpItem();
		}
	};
	
	var _doDownItem = function(idx){
		m_g.getGUI().msgBox(rstr.comm.msgts, rstr.shop.manageshop.lbl.conformdown, MB_F_YESNO, {self:m_this, caller:function(id){
			if ( id == MB_IDYES ){
				_sendDownItemToSvr(idx);
			}
		}});
	};
	
	var _doUpItem = function(){
		UIM.getDlg('cansaleitem').openDlg({self: m_this, caller: function(item, price){
			_sendUpItemToSvr(item, price);
		}});
	};
	
	var _sendDownItemToSvr = function(idx){
		var sendmsg = '{cmd='+NETCMD.DEAL+',subcmd=3,idx='+idx+'}';
		m_g.send(null, sendmsg);
	};
	
	var _sendUpItemToSvr = function(item, price){
		var sendmsg = '{cmd='+NETCMD.DEAL+',subcmd=4,id='+item.id+',resid='+item.resid+',number='+item.number+',price='+price+'}';
		m_g.send(null, sendmsg);
	};

	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items;
	var m_dealitems;
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};

/** 可以出售的道具对话框 */
CanSaleItemDlg = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_caller;
	var m_item;
	
	//------------
	//public:method
	//------------
	this.initialize = function(g){
		m_this = this;
		m_g = g;
	};
	
	/** 打开对话框 
	@param caller 回调
	@param soldierpos 格子位置
	@param hero 英雄
	@param leftnum 可携带的最大个数（剩余空间）*/
	this.openDlg = function(caller){
		m_caller = caller;
		m_dlg = UIM.getDlg('filteritemex');
		m_dlg.setCaller({self:m_this,caller:_onDlgEvent});
		m_dlg.openDlg({title:rstr.military.expeddlg.soldiertitle, filter:'cansaleitem'});
	};
	
	//------------
	//private:method
	//------------
	var _onDlgEvent = function(item){	
		var _onInputOk = function(number, price){
			item = {};
			item.id = m_item.id;
			item.resid = m_item.itemres.id;
			item.number = number ? number : 1;
			price = price ? price : 1;
			if ( m_caller ){
				m_caller.caller.call(m_caller.self, item, price);
			}
		};
		m_item = item;
		var inputdlg = UIM.getDlg('saleupinput');
		
		inputdlg.openDlg(item.number, _getMaxPrice());
		inputdlg.setCaller({self:m_this, caller:_onInputOk});
	};
	
	var _getMaxPrice = function(){
		var maxprice = 99999999;
		if (m_item.itemres.buyprice && (m_item.itemres.buyprice[0] > 0 || m_item.itemres.buyprice[1] > 0 )) {
			var price = m_item.itemres.buyprice[0] > 0 ? m_item.itemres.buyprice[0] : m_item.itemres.buyprice[1];
			maxprice = parseInt(price * 1.2, 10);
		}
		return maxprice;
	};
		
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

/** 物品上架时的数量和价格输入对话框 */
SaleUpInputDlg = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items={};
	var m_maxnum=1;
	var m_maxprice=1;
	var m_caller;

	//------------
	//public:method
	//------------
	this.initialize = function(g){
		m_g = g;
		m_this = this;
	};
	
	/** 打开话框 
	@param maxnum 最大个数
	@param maxprice 最高价格	*/
	this.openDlg = function(maxnum, maxprice){
		_initDlg();
		_initInfo(maxnum, maxprice);
		m_dlg.show();
		m_items.inum.focus();
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:true,
					pos:{x:"center", y:60},
					uiback:uiback.dlg.npc
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.shop.saleupinput, m_items);
			m_dlg.hide();
			_setInputLimits();
			_setCallers();
			
		}
	};
	
	var _setInputLimits = function(){
		m_items.inum.setLimit(_getLimitNum);
		m_items.iprice.setLimit(_getLimitPrice);
	};
	
	var _setCallers = function(){
		var callers = {
			'okbtn':_onClickConfirm
			,'cancelbtn':_onClickCancel
		};
		for ( var k in callers ){
			m_items[k].setCaller({self:m_this, caller:callers[k]});
		}
	};
	
	var _initInfo = function(maxnum, maxprice){
		m_maxnum = maxnum;
		m_maxprice = maxprice;
		m_items.inum.setVal(m_maxnum);
		m_items.iprice.setVal(1);
	};
	
	var _getLimitNum = function(){
		return {min:0,max:m_maxnum};
	};
	
	var _getLimitPrice = function(){
		return {min:0,max:m_maxprice};
	};
	
	var _onClickConfirm = function(){
		if ( m_caller ){
			var num = m_items.inum.getVal();
			var price = m_items.iprice.getVal();
			m_caller.caller.call(m_caller.self, num, price);
		}
		m_dlg.hide();
	};
	
	var _onClickCancel = function(){
		m_dlg.hide();
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

ShopsListDlg = function(){
	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_items = {};
		m_dlg = null;
		m_g.regEvent(EVT.NET, NETCMD.DEAL, m_this, _onSvrPkg);
		m_g.regSendDelay('cmd_getshopslist', 200);
	};
	
	this.openDlg = function(){
		_initDlg();
		_initInfo();
		m_dlg.show();
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal : true,
					title : rstr.shop.shopslist.title,
					pos : {x:'center', y:40}
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.shop.shopslist, m_items);
			m_dlg.hide();
			_setCallers();
			_setInputLimit();
		}
	};
	
	var _setCallers = function(){
		m_items.list.setCaller(null, null, null, {self:m_this, caller:_onDBClickList});
		m_items.pagebar.setCaller({self:m_this, caller:_onPageBar});
		m_items.findbtn.setCaller({self:m_this, caller:_onClickFind});
	};
	
	var _setInputLimit = function(){
		TQ.maxLength(m_items.iname, JVALID.getMaxShopLen());
	};
	
	var _initInfo = function(){
		m_items.pagebar.activePage(1,true);
	};
	
	var _onSvrPkg = function(netevent){
		var netdata = netevent.data;
		_doOpenDlg(netdata);
		_doUpdateList(netdata);
	};
	
	var _onDBClickList = function(e, idx){
		_openShop(idx);
	};
	
	var _onPageBar = function(pageidx){
		_getShopsListFromSvr(pageidx);
	};
	
	var _doOpenDlg = function(netdata){
		if ( !netdata.showshops ) return;
		m_this.openDlg();
	};
	
	var _doUpdateList = function(netdata){
		if ( !netdata.shopslist ) return;
		m_shoplist = netdata.shopslist;
		if ( m_shoplist.pagecnt ) m_items.pagebar.setPageCnt(m_shoplist.pagecnt);
		m_items.list.setItemCount(m_shoplist.list.length);
		for ( var i=0; i<m_shoplist.list.length; ++i ){
			var item = m_items.list.getItem(i);
			var ritem = m_shoplist.list[i];
			TQ.setTextEx(item.exsubs.name, ritem.name);
			TQ.setTextEx(item.exsubs.cnt, ritem.cnt);
			item.exsubs.seeop.setId(i);
			item.exsubs.seeop.setCaller({self:m_this, caller:_onClickSeeOp});
			item.exsubs.letterop.setId(i);
			item.exsubs.letterop.setCaller({self:m_this, caller:_onClickLetterOp});
		}
		if ( m_shoplist.pageidx ) m_items.pagebar.activePage(m_shoplist.pageidx, false, false);
		if ( m_shoplist.selidx != undefined)  m_items.list.setCurSel(m_shoplist.selidx);
	};
	
	var _getShopsListFromSvr = function(pageidx){
		var sendmsg = '{cmd='+NETCMD.DEAL+',subcmd=5,pageidx='+pageidx+'}';
		m_g.send('cmd_getshopslist', sendmsg);
	};
	
	var _onClickSeeOp = function(id){
		_openShop(id);
	};
	
	var _onClickLetterOp = function(id){
		HDRM.getHdr('letter').writeLetter({name: m_shoplist.list[idx].rolename});
	};
	
	var _onClickFind = function(){
		if ( !JVALID.checkShopName(m_items.iname.value) ){
			m_g.getGUI().sysMsgTips(SMT_ERROR, rstr.shop.shopslist.err.invaildshop);
		}
		else{
			_sendFindNameToSvr(m_items.iname.value);
		}
	};
	
	var _openShop = function(idx){
		UIM.getDlg('saleshop').openDlg(m_shoplist.list[idx]);
	};
	
	var _sendFindNameToSvr = function(name){
		var sendmsg = '{cmd='+NETCMD.DEAL+',subcmd=8,name="'+name+'"}';
		m_g.send(null, sendmsg);
	};
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items;
	var m_shoplist;
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};

SaleShopDlg = function(){
	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_items = {};
		m_dlg = null;
		m_shopitems = [];
		m_g.regEvent(EVT.NET, NETCMD.DEAL, m_this, _onSvrPkg);
	};
	
	this.openDlg = function(shop){
		m_shopdata = shop;
		_initDlg();
		_initInfo();
		m_dlg.show();
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal : true,
					title : rstr.shop.manageshop.title,
					pos : {x:'center', y:40}
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.shop.manageshop, m_items);
			m_dlg.hide();
			_initTooltips();
			_setCallers();
		}
	};
	
	var _initInfo = function(){
		_getShopListFromSvr();
		m_dlg.setTitle(m_shopdata.name);
	};
	
	var _onSvrPkg = function(netevent){
		var netdata = netevent.data;
		_doUpdateList(netdata);
	};
	
	var _doUpdateList = function(netdata){
		if ( !netdata.shopitems )return;
		m_shopitems = netdata.shopitems;
		_initItemres(netdata.shopitems);
		_clearList();
		_setList(netdata.shopitems);
	};
	
	var _getShopListFromSvr = function(){
		var sendmsg = '{cmd='+NETCMD.DEAL+',subcmd=6}';
		m_g.send(null, sendmsg);
	};
	
	var _initItemres = function(items){
		for ( var i=0; i<items.length; ++i ){
			items[i].itemres = ItemResUtil.findItemres(items[i].resid);
		}
	};
	
	var _initTooltips = function(){
		for(var i=0, n=m_items.list.getCount(); i<n; ++i){
			var item = m_items.list.getItem(i);
			TTIP.setCallerData(item.exsubs.tooltips['$item'], {self:m_this, caller:_onGetTooltip},{idx:i});
		}
	};
	
	var _setCallers = function(){
		for(var i=0, n=m_items.list.getCount(); i<n; ++i){
			var item = m_items.list.getItem(i);
			item.exsubs.opbtn.setId(i);
			item.exsubs.opbtn.setCaller({self:m_this, caller:_onClickOpBtn});
		}
	};
	
	var _clearList = function(){
		for(var i=0, n=m_items.list.getCount(); i<n; ++i){
			_setListItem(m_items.list.getItem(i), null);
		}
	};
	
	var _setList = function(items){
		m_items.list.setItemCount(items.length);
		for ( var i=0; i<items.length; ++i ){
			_setListItem(m_items.list.getItem(i), items[i]);
		}
	};
	
	var _setListItem = function(item, ritem){
		IMG.setBKImage(item.exsubs.icon, ritem ? IMG.makeBigImg(ritem.itemres.bigpic) : '');
		TQ.setTextEx(item.exsubs.fnum, ritem ? ritem.number : '');
		TQ.setTextEx(item.exsubs.bnum, ritem ? ritem.number : '');
		TQ.setTextEx(item.exsubs.name, ritem ? ritem.itemres.name : '');
		TQ.setTextEx(item.exsubs.price, ritem ? ritem.buyprice : '');
		item.exsubs.opbtn[ritem ? 'show' : 'hide']();
		item.exsubs.opbtn.setText(ritem ? rstr.shop.manageshop.btn.buy : '');
	};
	
	var _onGetTooltip = function(data){
		if ( m_shopitems[data.idx] ){
			return TIPM.getItemDesc(m_shopitems[data.idx], 'sys');
		}
	};
	
	var _onClickOpBtn = function(id){
		var buyitem = {};
		TQ.dictCopy(buyitem, m_shopitems[id]);
		buyitem.buyprice = [m_shopitems[id].buyprice, 0, 0, 0];
		UIM.getDlg('buyitem').openDlg(buyitem, {self:m_this, caller:_sendBuyItemToSvr});
	};
	
	var _sendBuyItemToSvr = function(curpaytype, curbuynum, buyitem){
		var sendmsg = '{cmd='+NETCMD.DEAL+',subcmd=7,name="'+m_shopdata.rolename+'",id='+buyitem.id+',resid='+buyitem.resid+',number='+curbuynum+'}';
		m_g.send(null, sendmsg);
	};

	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items;
	var m_shopitems;
	var m_shopdata;
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};


ShopDlg = JBaseDlg.ex({
	_innerInit : function(){
		this.HOTLIST_MAX_COUNT_ = 6;
		this.FINDINPUT_MAX_LEN_ = 16;
		this.TAB_PRESTIGE_IDX = 5;
		this.TAB_HONOR_IDX = 6;
		
		this.g_.regEvent(EVT.NET, NETCMD.SHOP, this, this._onSvrPkg);
		this.g_.regEvent(EVT.PKG_CHANGE, 1, this, this._onGoldChanged);
		this.g_.regEvent(EVT.ROLEBASE, 0, this, this._onPrestigeAndCityhonorChanged);
	}
	
	,_getDlgCfg : function(){
		return {modal:false, title:rstr.shop.shopdlg.title, pos:{x:"center", y:40}, uicfg:uicfg.shop.shopdlg};
	}
	
	,_afterCreate : function(){
		TQ.maxLength(this.items_.findItemInput, this.FINDINPUT_MAX_LEN_);
		this._simulateSendSvrPkg();
	}
	
	,_simulateSendSvrPkg : function(){
		this.g_.sendEvent({eid:EVT.NET, sid:NETCMD.SHOP, data:{sales:res_shops_class}});
	}
	
	,_setCallers : function(){
		this.items_.rechargeBtn.setCaller({self:this, caller:this._onClickRecharge });
		this.items_.openPkgBtn.setCaller({self:this, caller:this._onClickOpenPkg });
		this.items_.findItemBtn.setCaller({self:this, caller:this._onFindItem });
		this.items_.cdkeyBtn.setCaller({self:this, caller:this._onClickCDKey });
	}
	
	,_initInfo : function(){
		this._getSalesList();
		this._updateTabList();
		this._updateGold();
		this._updatePrestigeAndCityhonor();
		this._updateHotList();
		this._updateGuangGao();
		
		this.items_.tablist.activeTab(0);
	}
	
	,_getSalesList : function(){
		ShopSender.sendGetShopSalesList(this.g_);
	}
	
	,_updateTabList : function(){
		if (!this.isShow()) return;
		
		var sales = this.g_.getImgr().getShopSales();
		this._setTabsText(sales);
		
		for (var i=0; i<sales.length; ++i ) {
			var items = this.items_.tablist.getTabItems(i);
			this._updateItemList(i, items.list, sales[i].list);
		}
	}
	
	,_setTabsText : function(ress){
		for (var i=0; i<ress.length; ++i ) {
			this.items_.tablist.setTabText(i, ress[i].name);
		}
	}
	
	,_updateItemList : function(tabIdx, uiList, salesList){
		uiList.setItemCount(salesList.length);
		for ( var i=0; i<uiList.getCount(); ++i ) {
			var sale = salesList[i];
			var item = uiList.getItem(i);
			
			CommDrawItem.drawItemIconAndName(item.exsubs.icon, item.exsubs.name, sale.itemres);
			if (sale.itemnumsec && sale.itemnumsec == 2 ) {
				IMG.setBKImage(item.exsubs.flag, IMG.getBuyLimitFlag());
				TQ.fixIE6Png(item.exsubs.flag);
			} else {
				IMG.setBKImage(item.exsubs.flag, '');
			}
			
			if ( !sale.itemres.buyprice ) {
				var a = 1;
			}
			
			var fixedPriceType = -1;
			if ( tabIdx == this.TAB_PRESTIGE_IDX ) {
				fixedPriceType = 3;
			} else if (tabIdx == this.TAB_HONOR_IDX ) {
				fixedPriceType = 4;
			}
			TQ.setTextEx(item.exsubs.price, BuyPrice.getUnit(fixedPriceType, sale.itemres.buyprice) + ' ' + BuyPrice.getPrice(fixedPriceType, sale.itemres.buyprice));			
			
			item.exsubs.buybtn.setId(sale.id);
			item.exsubs.buybtn.setCaller({self:this, caller:this._onClickBuyItem});
			TTIP.setCallerData(item.exsubs.tooltips['$item'], {self:this, caller:this._onGetItemTip}, {sale:sale});
		}
	}
	
	,_updateGold : function(){
		if (!this.isShow()) return;
		TQ.setTextEx(this.items_.gold, this.g_.getImgr().getGold());
		TQ.setTextEx(this.items_.giftgold, this.g_.getImgr().getGiftGold());
	}
	
	,_updatePrestigeAndCityhonor : function(){
		if (!this.isShow()) return;
		var roleRes = this.g_.getImgr().getRoleRes();
		TQ.setTextEx(this.items_.prestige, roleRes.prestige);
		TQ.setTextEx(this.items_.cityhonor, roleRes.cityhonor);
	}
	
	,_updateHotList : function(){
		var cnt = Math.min(this.HOTLIST_MAX_COUNT_, res_shophot_tags.length);
		this.items_.hotList.setItemCount(cnt);
		for ( var i=0; i<cnt; ++i ) {
			var res = res_shophot_tags[i];
			var item = this.items_.hotList.getItem(i);
			item.exsubs.tagBtn.setId(i);
			item.exsubs.tagBtn.setText(res.name);
			item.exsubs.tagBtn.setCaller({self:this,  caller:this._onClickHotTag});
		}
	}
	
	,_updateGuangGao : function(){
		var plats = {
			'qzone' : 'shopdlg/yd.gif'
			,'3366' : 'shopdlg/bd.gif'
			,'other' : 'shopdlg/ot.gif'
		};
		var img = plats[g_platform];
		if ( !img ) img = plats['other'];
		IMG.setBKImage(this.items_.guanggao, IMG.makeImg(img) );
	}
	
	,_onSvrPkg : function(netevent){
		if (netevent.data.sales) {
			TQ.dictCopy(this.g_.getImgr().getShopSales(), netevent.data.sales);
			this._initSaleIdsRes(this.g_.getImgr().getShopSales());
			this._updateTabList();
		}
	}
	
	,_initSaleIdsRes : function(sales){
		for ( var i=0; i<sales.length; ++i ) {
			var saleClass = sales[i];
			ItemResUtil.initItemsres(saleClass.list, 'id');
		}
	}
	
	,_onGoldChanged : function(){
		this._updateGold();
	}
	
	,_onPrestigeAndCityhonorChanged : function(){
		this._updatePrestigeAndCityhonor();
	}	
	
	,_onClickBuyItem : function(id){
		UIM.getDlg('buyitem').openDlg({id:0, resid:id, fixed:1, number:100000}); // fixed=1表示resid不能被修改
	}
	
	,_onGetItemTip : function(data){
		var buylimit = {itemnumsec:0, itemnum:0};
		if (data.sale.itemnumsec && data.sale.itemnumsec == 2 ) {
			buylimit.itemnumsec = data.sale.itemnumsec;
			buylimit.itemnum = data.sale.itemnum;
		}
		var item = SysItemMaker.make(0, data.sale.itemres, buylimit);
		return TIPM.getItemDesc(item, 'sys');
	}
	
	,_onClickRecharge : function(){
		JMISC.openPayWnd();
	}
	
	,_onClickOpenPkg : function(){
		UIM.openDlg('package');
	}
	
	,_onClickHotTag : function(idx){
		var ids = this._collectValidIds(res_shophot_tags[idx].ids);
		if (ids.length == 1) {
			UIM.getDlg('buyitem').openDlg({id:0, resid:ids[0], number:100000});
		} else {
			UIM.getDlg('buyitemlist').openDlg(ids);
		}
	}
	
	,_collectValidIds : function(ids){
		var rtids = [];
		for ( var i=0; i<ids.length; ++i ) {
			if (ids[i] > 0) rtids.push(ids[i]);
		}
		return rtids;
	}
	
	,_onFindItem : function(){
		var sales = this.g_.getImgr().getShopSales();
		for ( var classIdx=0; classIdx<sales.length; ++classIdx ) {
			var saleClass = sales[classIdx];
			for ( var saleIdx=0; saleIdx<saleClass.list.length; ++saleIdx) {
				if (saleClass.list[saleIdx].itemres.name == this.items_.findItemInput.value) {
					UIM.getDlg('buyitem').openDlg({id:0, resid:saleClass.list[saleIdx].id, number:100000});
					return;
				}
			}
		}
		this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.shop.shopdlg.tip.noFind);
	}
	
	,_onClickCDKey : function(){
		var inputdlg = UIM.getDlg('inputtext');
		inputdlg.openDlg(rstr.shop.shopdlg.lbl.inputcdkey, JVALID.getMaxCDKeyLen());
		inputdlg.setCaller({self:this, caller:this._onInputCDKey});		
	}
	
	,_onInputCDKey : function(cdkey){
		var result=cdkey.match('^([0-9A-F]{' + JVALID.getMaxCDKeyLen() + '})$'); 
		if ( result == null ){
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.shop.shopdlg.tip.validcdkey);
			return;
		}
		
		var sum = 0;
		var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
		var chars_map = {'0':0, '1':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, 'A':10, 'B':11, 'C':12, 'D':13, 'E':14, 'F':15};
		for ( var i=0; i<cdkey.length-1; ++i ) {
			var c = cdkey.charAt(i);
			sum += chars_map[c];
		}
		
		if (cdkey.charAt(cdkey.length-1) != chars[sum%16] ) {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.shop.shopdlg.tip.validcdkey);
			return;
		}
		
		CDKeySender.send(this.g_, cdkey);
	}
});