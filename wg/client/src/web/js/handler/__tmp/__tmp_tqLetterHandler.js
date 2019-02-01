//信件的消息处理
LetterNetCmdHdr = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var m_g = null;
	var m_this = null;
	
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.NET, NETCMD.MAIL, m_this, _lc_._onSvrMail);
	};
	
	_lc_._onSvrMail = function(netEvent){
		var netData = netEvent.data;
		if ( netData.mails ){
			_lc_._notifyNewMailEventStart(netData.mails);
			var letterRes = m_g.getImgr().getLetterRes();
			var decodeMails = _lc_._decodeMails(netData.mails);
			TQ.dictCopy(letterRes.all, decodeMails);
			_lc_._classifyFill();
			_lc_._notifyNewMailEventStop(letterRes.all);
			m_g.sendEvent({eid:EVT.LETTERUPDATE, sid:0});
		}
	};
	
	_lc_._notifyNewMailEventStart = function(mails){
		var hasNewMail = false;
		for ( var i=0; i<mails.length; ++i ) {
			if ( mails[i].read == 0 ) {
				hasNewMail = true;
				break;
			}
		}
		
		if (hasNewMail) {
			m_g.sendEvent({eid:EVT.NEW_MAIL, sid:0, start:true});
		}
	};
	
	_lc_._notifyNewMailEventStop = function(mails){
		var hasNewMail = false;
		for ( var i=0; i<mails.length; ++i ) {
			if ( mails[i].read == 0 ) {
				hasNewMail = true;
				break;
			}
		}
		
		if ( !hasNewMail ) {
			m_g.sendEvent({eid:EVT.NEW_MAIL, sid:0, stop:true});
		}
	};
	
	_lc_._decodeMails = function(netMails){
		var decodeMails = netMails;
		
		for ( var i=0; i<decodeMails.length; ++i ) {
			var mail = decodeMails[i];
			if ( mail.title ) {
				mail.title = TQ.decodeMessage(mail.title);
			}
			
			if ( mail.detail && mail.detail.msg ) {
				mail.detail.msg = TQ.decodeMessage(mail.detail.msg);
			}
		}
		return decodeMails;
	};
	
	_lc_._classifyFill = function(){
		var letterRes = m_g.getImgr().getLetterRes();
		letterRes.un = [];
		letterRes.sys = [];
		letterRes.com = [];
		
		for ( var i=0, n=letterRes.all.length; i<n; ++i ){
			var res = letterRes.all[i];
			if ( res.read == 0 ){
				letterRes.un.push(res);
			}
			
			if ( res.sys == 1 ){
				res.from = rstr.letter.letterdlg.sysFrom;
				letterRes.sys.push(res);
			}
			else{	
				letterRes.com.push(res);
			}
		}		
		
		var timeCompDesc = function(a, b){return b.time - a.time;};
		letterRes.un.sort(timeCompDesc);
		letterRes.sys.sort(timeCompDesc);
		letterRes.com.sort(timeCompDesc);
	};
	
	//LetterNetCmdHdr-unittest-end
});

//信件对话框
LetterDlg = BaseDlg.extern(function(){
	this._init = function(){
		this.PAGE_ITEM_CNT = 11;
		this.g_.regEvent(EVT.LOGIN_OK, 0, this, this._onLoginOk);
		this.g_.regEvent(EVT.LETTERUPDATE, 0, this, this._onLetterUpdate);
	};
		
	this._getDlgCfg = function(){
		return {modal:false, title:rstr.letter.letterdlg.title, pos:{x:"center", y:30}, uicfg:uicfg.letter.letterdlg, btns:[
			{btn:{id:0, text:rstr.letter.letterdlg.btns.write},caller:{self:this, caller:this._onClickWriteBtn}},
			{btn:{id:C_SYS_DLG_SEPARATOR},caller:null},
			{btn:{id:0, text:rstr.letter.letterdlg.btns.selall},caller:{self:this, caller:this._onClickSelectAllBtn}},
			{btn:{id:0, text:rstr.letter.letterdlg.btns.unselall},caller:{self:this, caller:this._onClickUnSelectAllBtn}},
			{btn:{id:0, text:rstr.letter.letterdlg.btns.deleteall},caller:{self:this, caller:this._onClickDeleteSelectedLettersBtn}},
			{btn:{id:C_SYS_DLG_SEPARATOR},caller:null},
			{btn:{id:0, text:rstr.comm.close},caller:{self:this, caller:this._onClickCloseDlgBtn}} ] };
	}; 
	
	this._afterCreate = function(){
		this._setTabsText();
		this._showSelAllBtn();
	};	
	
	this._setTabsText = function(){
		var tabs = rstr.letter.letterdlg.tabs;
		this.items_.lettertabs.setTabCount(tabs.length);
		for ( var i=0; i<this.items_.lettertabs.getTabCount(); ++i ){
			this.items_.lettertabs.setTabText(i, tabs[i]);
		}	
	};		
	
	this._setCallers = function(){
		this._setLetterListsCaller();
		this._setPageBarsCaller();
	};	
	
	this._setLetterListsCaller = function(){
		for ( var i=0; i<this.items_.lettertabs.getTabCount(); ++i ){
			var curdomitems = this.items_.lettertabs.getTabItems(i);
			var letterList = curdomitems.letterlist;
			letterList.setCaller(null,null,null,{self:this,caller:this._onDbClickList});
		}
	};	
	
	this._setPageBarsCaller = function(){
		for ( var i=0, count=this.items_.lettertabs.getTabCount(); i<count; ++i ){
			var curdomitems = this.items_.lettertabs.getTabItems(i);
			curdomitems.pagebar.setCaller({self:this, caller:this._onPageNavigate});
		}
	};
	
	this._initInfo = function(){
		this._initLetterLists();
		this.items_.lettertabs.activeTab(0);
	};
	
	this._initLetterLists = function(){
		if ( !this.isShow() ) return;
		
		for ( var tabIdx=0; tabIdx<this.items_.lettertabs.getTabCount(); ++tabIdx ) {
			var tabItems = this.items_.lettertabs.getTabItems(tabIdx);
			var letterResList = this._getLetterResList(tabIdx);
			this._initPageBarsCount(tabItems.pagebar, letterResList);
			this._initLetterList(tabItems.letterlist, letterResList, tabItems.pagebar.getCurPage() );
		}
	};
	
	this._getLetterResList = function(tabIdx){
		var letterres = this.g_.getImgr().getLetterRes();
		var keys = ['un','sys','com'];
		return letterres[keys[tabIdx]];
	};
	
	this._initPageBarsCount = function(pagebar, letterResList){
		var pageCount = Math.ceil(letterResList.length/this.PAGE_ITEM_CNT);
		pagebar.setPageCnt((pageCount>0) ? pageCount : 1);
	};
	
	this._initLetterList = function(letterList, letterResList, pageNo){
		this._setLetterListCount(letterList, letterResList, pageNo);
		this._initLetterListContent(letterList, letterResList, pageNo);
		this._initLetterListBtnCaller(letterList, letterResList, pageNo);
	};
	
	this._setLetterListCount = function(letterList, letterResList, pageNo){
		var range = this._getLettersRangeByPageIdx(letterResList, pageNo);
		letterList.setItemCount(range.count);
	};
	
	this._initLetterListContent = function(letterList, letterResList, pageNo){
		var _setItemCaller = function(resIdx, res, item){
			TQ.setTextEx(item.exsubs.flag, rstr.letter.letterdlg.status[res.read]);
			TQ.setTextEx(item.exsubs.from, res.from);
			
			var goodsImg = '';
			if ( res.hasgoods ) {
				goodsImg = '<img src="' + IMG.makeImg('item/small/1_1.gif') + '"/>';
			}
			TQ.setHtml(item.exsubs.title, res.title + goodsImg);
			TQ.setTextEx(item.exsubs.time, TQ.formatDateTime(res.time));
		};
		this._traveLetterList(letterList, letterResList, pageNo, _setItemCaller);
	};
	
	this._initLetterListBtnCaller = function(letterList, letterResList, pageNo){
		var this_l = this;
		var _setBtnCaller = function(resIdx, res, item){
			item.exsubs.delbtn.setId(resIdx);
			item.exsubs.delbtn.setCaller({self:this_l, caller:this_l._onDelLetter});
			item.exsubs.readbtn.setId(resIdx);
			item.exsubs.readbtn.setCaller({self:this_l, caller:this_l._onReadLetter});
		};
		this._traveLetterList(letterList, letterResList, pageNo, _setBtnCaller);
	};
	
	this._traveLetterList = function(letterList, letterResList, pageNo, callback){
		var range = this._getLettersRangeByPageIdx(letterResList, pageNo);
		for ( var resIdx=range.start; resIdx<(range.start+range.count); ++resIdx ) {
			var res = letterResList[resIdx];
			var item = letterList.getItem(resIdx-range.start);
			callback(resIdx, res, item);
		}
	};
	
	this._getLettersRangeByPageIdx = function(letterResList, pageNo){
		var pageIdx = pageNo - 1;
		var start = pageIdx*this.PAGE_ITEM_CNT;
		var count = Math.min(this.PAGE_ITEM_CNT, letterResList.length - start);
		return {count:count, start:start};
	};
	
	this._onLoginOk = function(){
		MailSender.sendGetMails(this.g_);
	};

	this._onLetterUpdate = function(){
		this._initLetterLists();
	};
	
	this._onPageNavigate = function(pageNo){
		var curTabIdx = this.items_.lettertabs.getActiveTab();
		var letterResList = this._getLetterResList( curTabIdx );
		var letterList = this.items_.lettertabs.getTabItems( curTabIdx ).letterlist;
		this._initLetterList(letterList, letterResList, pageNo );
	};
	
	this._onDelLetter = function(listResIdx){
		var curResList = this._getLetterResList( this.items_.lettertabs.getActiveTab() );
		var res = curResList[listResIdx];
		if ( res ){
			this._confirmSendDelCmd([res.id]);
		}
	};
	
	this._onReadLetter = function(listResIdx){
		this._readLetter(listResIdx);
	};
	
	this._onDbClickList = function(e,listItemIdx){
		var curTabIdx = this.items_.lettertabs.getActiveTab();
		var tabItems = this.items_.lettertabs.getTabItems(curTabIdx);
		var item = tabItems.letterlist.getItem(listItemIdx);
		var listResIdx = item.exsubs.readbtn.getId();
		this._readLetter(listResIdx);
	};
	
	this._readLetter = function(listResIdx){
		var resList = this._getLetterResList( this.items_.lettertabs.getActiveTab() );
		UIM.openDlg('readletter', resList, listResIdx);
	};	
	
	this._onClickWriteBtn = function(){
		var dlg = UIM.getDlg('writeletter');
		dlg.openDlg();
		dlg.clear();	
	};
	
	this._onClickSelectAllBtn = function(){
		this._selectCurListAllItem();
		this._showUnSelAllBtn();	
	};
	
	this._onClickUnSelectAllBtn = function(){
		this._unselectCurListAllItem();
		this._showSelAllBtn();	
	};
	
	this._onClickDeleteSelectedLettersBtn = function(){
		this._delSelLetters();
	};
	
	this._onClickCloseDlgBtn = function(){
		this.hideDlg();
	};

	this._selectCurListAllItem = function(){
		this._setCurListAllItemCheckState(1);
	};
	
	this._unselectCurListAllItem = function(){
		this._setCurListAllItemCheckState(0);
	};
	
	this._setCurListAllItemCheckState = function(check){
		var curdomitems = this.items_.lettertabs.getTabItems( this.items_.lettertabs.getActiveTab() );
		var letterList = curdomitems.letterlist;
		for ( var i=0; i<letterList.getCount(); ++i ){
			var litem = letterList.getItem(i);
			litem.exsubs.sel.setCheck(check);
		}
	};
	
	this._showSelAllBtn = function(){
		this._toggleSelAllAndUnSelAllBtn(1, 2);
	};	
	
	this._showUnSelAllBtn = function(){
		this._toggleSelAllAndUnSelAllBtn(2, 1);
	};	
	
	this._toggleSelAllAndUnSelAllBtn = function(showBtnIdx, hideBtnIdx){
		var btns = this.dlg_.getBtns();
		btns[showBtnIdx].show();
		btns[hideBtnIdx].hide();
		this.dlg_.refreshBtn();
	};

	this._delSelLetters = function(){
		var selectedIds = this._collectSelectedIds();
		if ( selectedIds.length > 0 ) {
			this._confirmSendDelCmd(selectedIds);
		}
	};
	
	this._collectSelectedIds = function(){
		var curTabIdx = this.items_.lettertabs.getActiveTab();
		var resList = this._getLetterResList( curTabIdx );
		var letterList = this.items_.lettertabs.getTabItems( curTabIdx ).letterlist;
		
		var selectedIds = [];
		for ( var itemIdx=0; itemIdx<letterList.getCount(); ++itemIdx ){
			var item = letterList.getItem(itemIdx);
			if ( item.exsubs.sel.getCheck() != 1 ) continue;
			
			var resIdx = item.exsubs.readbtn.getId();
			var res = resList[resIdx];
			selectedIds.push( res.id );
		}
		
		return selectedIds;
	};
	
	this._confirmSendDelCmd = function(ids){
		var g_l = this.g_;
		var _confirmCallback = function(id) {
			if ( id == MB_IDYES ){
				MailSender.sendDelMails(g_l, ids);
			}
		};
		
		this.g_.getGUI().msgBox(rstr.comm.msgts, 
			rstr.letter.letterdlg.confirmdel, 
			MB_F_YESNO, 
			{self:this, caller:_confirmCallback} );
	};
});

//阅读邮件对话框
ReadLetterDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	var m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	_lc_.m_resList = [];
	_lc_.m_curIdx = 0;
	_lc_.m_tempLetterMakerMgr = null;
	
	//public:method
	this.init = function(g){
		_lc_.m_g = g;
		m_this = this;
		_lc_.m_tempLetterMakerMgr = TempLetterMakerMgr.snew(_lc_.m_g);
		_lc_.m_g.regEvent(EVT.LETTERUPDATE, 0, m_this, _lc_._onLetterUpdate);
	};
	
	this.openDlg = function(resList,idx){
		_lc_._initParams(resList, idx);
		_initDlg(); 
		_lc_._showCurLetter();
	};
	
	// private:method
	_lc_._initParams = function(resList, idx){
		_lc_.m_resList = resList;
		_lc_.m_curIdx = idx;
	};
	
	var _initDlg = function(){
		if ( !_lc_.m_dlg ){
			    _lc_.m_dlg=Dialog.snew(_lc_.m_g,{modal:false,title:rstr.letter.readdlg.title,pos:{x:"center", y:38},
				btns:[
					{btn:{id:0, text:rstr.letter.readdlg.btns.prev},caller:{self:m_this,caller:_onClickPrevBtn}},
					{btn:{id:0, text:rstr.letter.readdlg.btns.next},caller:{self:m_this,caller:_onClickNextBtn}},
					{btn:{id:0, text:rstr.letter.readdlg.btns.reply},caller:{self:m_this,caller:_onClickReplyBtn}},
					{btn:{id:C_SYS_DLG_SEPARATOR}},
					{btn:{id:0, text:rstr.comm.close},caller:{self:m_this,caller:_onClickCloseDlgBtn}}]
				});
			_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.letter.readdlg, _lc_.m_items);
			_lc_._setCallers();
		}
		_lc_.m_dlg.show();
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.getbtn.setCaller({self:m_this, caller:_lc_._onGetItems});
	};
	
	_lc_._onLetterUpdate = function(){
		_lc_._showCurLetter();
	};
	
	var _onClickPrevBtn = function(){
		_lc_._prevIdx();
		_lc_._showCurLetter();
	};
	
	var _onClickNextBtn = function(){
		_lc_._nextIdx();
		_lc_._showCurLetter();
	};
	
	var _onClickReplyBtn = function(){
		var res = _lc_._getCurLetterRes();
		if ( !res ) {
			return;
		}
		
		var dlg = UIM.getDlg('writeletter');
		dlg.openDlg();
		dlg.setRecv( res.from );
		dlg.setTitle( rstr.letter.readdlg.reply + TQ.decodeMessageForText(res.title) );
		dlg.setContent('');
	};
	
	var _onClickCloseDlgBtn = function(){
		_lc_.m_dlg.hide();
	};
	
	_lc_._prevIdx = function() {
		_lc_.m_curIdx--;
		if ( _lc_.m_curIdx < 0 ){
			_lc_.m_curIdx = 0;
		}
	};
	
	_lc_._nextIdx = function() {
		_lc_.m_curIdx++;
		if ( _lc_.m_curIdx >= _lc_.m_resList.length ){
			_lc_.m_curIdx = _lc_.m_resList.length-1;
		}
	};
	
	_lc_._showCurLetter = function(){
		if ( !_lc_._isShow() ) {
			return;
		}
		
		var res = _lc_._getCurLetterRes();
		if ( !res ) {
			return;
		}
		
		if ( !res.detail ) {
			MailSender.sendGetDetailMail(_lc_.m_g, res.id);
			return;
		}
	
		_lc_._setLetter(res);
		_lc_._setLetterItems(res);
		_lc_._setDlgBtnsEnableState(res);
	};
	
	_lc_._isShow = function(){
		if ( !_lc_.m_dlg || !_lc_.m_dlg.isShow() ) {
			return false;
		}
		return true;
	};
	
	_lc_._getCurLetterRes = function() {
		return _lc_.m_resList[_lc_.m_curIdx];
	};
	
	_lc_._setLetter = function(res) {
		TQ.setTextEx(_lc_.m_items.from, res.from);
		TQ.setHtml(_lc_.m_items.title, res.title);
		TQ.setTextEx(_lc_.m_items.time, TQ.formatDateTime(res.time));
		var letterContent = _lc_._makeLetterContent(res.detail);
		if ( res.sys == 0 ) {
			letterContent += rstr.letter.readdlg.lbl.nosystag;
		}
		TQ.setHtml(_lc_.m_items.content.getContainerObj(), letterContent);
		_lc_.m_items.content.refresh();
	};
	
	_lc_._makeLetterContent = function(letterDetail){
		if ( letterDetail.msg ) {
			return HyperLinkMgr.formatLink(letterDetail.msg);
		}
		
		if ( !letterDetail.tmsg ) {
			return '';
		}
		
		return _lc_.m_tempLetterMakerMgr.make(letterDetail.tempId, letterDetail.tmsg);
	};
	
	_lc_._setLetterItems = function(res){
		var hasItem = res.items && res.items.length > 0;
		if ( !hasItem ) {
			TQ.setCSS(_lc_.m_items.itemsPanel, 'display', 'none');
			return;
		}
		
		TQ.setCSS(_lc_.m_items.itemsPanel, 'display', 'block');
		_lc_.m_items.itemsList.setItemCount(res.items.length);
		for ( var i=0, cnt=res.items.length; i<cnt; ++i ){
			var ritem = res.items[i];
			var item = _lc_.m_items.itemsList.getItem(i);
			ritem.itemres = ItemResUtil.findItemres(ritem.resid);
			CommDrawItem.drawIconAndNumber(item, ritem, true);
			TTIP.setCallerData(item.exsubs.tooltips['$item'], {self:m_this, caller:_lc_._onGetItemTip}, {idx:i});
		}
	};
	
	_lc_._setDlgBtnsEnableState = function(res){
		_lc_._setPrevBtnEnableState();
		_lc_._setNextBtnEnableState();
		_lc_._setReplyBtnEnableState(res);
	};
	
	_lc_._setPrevBtnEnableState = function(){
		var btns = _lc_.m_dlg.getBtns();
		var prevLetterBtn = btns[0];
		prevLetterBtn.enable(_lc_.m_curIdx > 0);
	};
	
	_lc_._setNextBtnEnableState = function(){
		var btns = _lc_.m_dlg.getBtns();
		var nextLetterBtn = btns[1];
		nextLetterBtn.enable(_lc_.m_curIdx < (_lc_.m_resList.length-1));
	};
	
	_lc_._setReplyBtnEnableState = function(res){
		var btns = _lc_.m_dlg.getBtns();
		var replyBtn = btns[2];
		replyBtn.enable(res.sys == 0);
	};
	
	_lc_._onGetItemTip = function(data) {	
		var res = _lc_._getCurLetterRes();
		if (!res) {
			return '';
		}
		
		if (!res.items) {
			return '';
		}
		
		var item = res.items[data.idx];
		if (!item) {
			return '';
		}
		
		return TIPM.getItemDesc(item);
	};
	
	_lc_._onGetItems = function(){
		var res = _lc_._getCurLetterRes();
		if (!res) {
			return;
		}
		
		MailSender.sendGetItems(_lc_.m_g, res.id);
	};
	
	//ReadLetterDlg-unittest-end
});

// 写信对话框
WriteLetterDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var C_SEND_ID = 1;
	var C_CANCEL_ID = 2;
	var MAX_MAILCON_LEN = 500;
	
	var m_g;
	_lc_.m_this;
	_lc_.m_dlg;
	_lc_.m_items = {};
	
	this.init = function(g){
		m_g = g;
		_lc_.m_this = this;
	};
	
	this.writeLetterTo = function(recvName){
		this.openDlg();
		this.clear();
		this.setRecv( recvName );
		this.setFocus('title');
	};
	
	this.setRecv = function( recvName ) {
		_lc_._initDlg(); 
		_lc_._setRecv(recvName);
	};
	
	this.setTitle = function( title ) {
		_lc_._initDlg(); 
		_lc_._setTitle(title);
	};
	
	this.setContent = function ( content ) {
		_lc_._initDlg(); 
		_lc_._setContent(content);
	};
	
	/** 打开写信对话框 */
	this.openDlg = function(){
		_lc_._initDlg(); 
		_lc_.m_dlg.show();
		_lc_.m_items.content.refresh();
	};
	
	/** 清空信件中内容 */
	this.clear = function(){
		_lc_.m_this.setRecv('');
		_lc_.m_this.setTitle('');
		_lc_.m_this.setContent('');
	};
	
	/** 设置输入框焦点 */
	this.setFocus = function(cname){
		_lc_._initDlg(); 
		_lc_._setFocus(cname);
	};
	
	_lc_._initDlg = function(){
		if ( !_lc_.m_dlg ) {
			_lc_.m_dlg = Dialog.snew(m_g,{modal:false,title:rstr.letter.writedlg.title,pos:{x:"center", y:30},
				btns:[{btn:{id:0,text:rstr.letter.writedlg.sendbtn},caller:{self:_lc_.m_this,caller:_lc_._onClickSendBtn}},
					{btn:{id:0,text:rstr.letter.writedlg.cancelbtn},caller:{self:_lc_.m_this,caller:_lc_._onClickCancelBtn}}]
				});
			m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.letter.writedlg, _lc_.m_items);
			
			_lc_._setInputMaxLen();
		}
	};
	
	_lc_._setInputMaxLen = function() {
		InputLimit.maxGBKBytes(_lc_.m_items.recv, JVALID.getMaxUserLen());
		InputLimit.maxGBKBytes(_lc_.m_items.title, JVALID.getMaxMailTitleLen());
		InputLimit.maxGBKBytes(_lc_.m_items.content.getContainerObj(), JVALID.getMaxMailContentLen());
	};
	
	_lc_._setRecv = function( recvName ) {
		_lc_.m_items.recv.value = recvName;
	};
	
	_lc_._setTitle = function( title ) {
		_lc_.m_items.title.value = title;
	};
	
	_lc_._setContent = function ( content ) {
		_lc_.m_items.content.getContainerObj().value = content;
	};	
	
	_lc_._setFocus = function(cname) {
		if (cname == 'recv') {
			_lc_.m_items.recv.focus();
		}
		else if (cname == 'title') {
			_lc_.m_items.title.focus();
		}
		else if (cname == 'content') {
			_lc_.m_items.content.getContainerObj().focus();
		}
	};
	
	_lc_._onClickSendBtn = function(){
		_lc_._sendMail();
		_lc_.m_dlg.hide();
	};
	
	_lc_._onClickCancelBtn = function(){
		_lc_.m_dlg.hide();
	};
	
	_lc_._sendMail = function() {
		if ( !_lc_._checkRecv() ) {
			return;
		}
		
		if ( !_lc_._checkTitle() ) {
			return;
		}
		
		if ( !_lc_._checkContent() ) {
			return;
		}
		
		MailSender.sendMail( m_g, 
			_lc_.m_items.recv.value, 
			_lc_.m_items.title.value, 
			_lc_.m_items.content.getContainerObj().value );
		
		m_g.getGUI().sysMsgTips(SMT_NORMAL, rstr.letter.writedlg.tip.sendOk);
	};
	
	_lc_._checkRecv = function(){	
		return _lc_._checkInputValue( JVALID.checkUsername, _lc_.m_items.recv.value, 'recv', rstr.letter.writedlg.errname );
	};
	
	_lc_._checkTitle = function(){
		return _lc_._checkInputValue( JVALID.checkEmailTitle, _lc_.m_items.title.value, 'title', rstr.letter.writedlg.errtitle );
	};
	
	_lc_._checkContent = function(){
		return _lc_._checkInputValue( JVALID.checkEmailContent, _lc_.m_items.content.getContainerObj().value, 'content', rstr.letter.writedlg.errcontent );
	};
	
	_lc_._checkInputValue = function(checker, val, valType, errMsg) {
		if ( !checker( val ) ) {
			var callBack = function() {
				_lc_.m_dlg.show();
				_lc_.m_this.setFocus(valType);
			};
			
			m_g.getGUI().msgBox(rstr.letter.writedlg.errmsgtitle, errMsg, MB_F_CLOSE, {self:_lc_.m_this, caller:callBack});
			return false;
		}
		return true;
	};
	//WriteLetterDlg-unittest-end
});

LetterHandlerEx = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	
	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.writeLetter = function(role){
		_writeLetter(role);
	};
	
	//------------
	//private:method
	//------------
	var _writeLetter = function(role){
		var wdlg = UIM.getDlg('writeletter');
		wdlg.setValue('recv', role.name);
		wdlg.setValue('title','');
		wdlg.setValue('content','');
		wdlg.openDlg();
		wdlg.setFocus('title');
	};
	
	//---------------------------------------
	this.init.apply(this, arguments);
};

FightResultTempLetterMaker = Class.extern(function(){
	var m_g = null;
	var m_fightResultMaker = null;
	
	this.init = function(g){
		m_g = g;
		m_fightResultMaker = FightResultMaker.snew(m_g);
	};
	
	this.make = function(tempRes, tempMsg){
		tempRes = tempRes.replace('#result#', m_fightResultMaker.getResultTitle(tempMsg));
		tempRes = tempRes.replace('#lines#', _getHeroTableLines(tempMsg));
		tempRes = tempRes.replace('#res#', _getFightRes(tempMsg));
		return tempRes;	
	};
	
	var _getHeroTableLines = function(tempMsg) {
		var heroLines = '';
		for ( var i=0; i<5; ++i ) {
			var ahero = tempMsg.attacker.heros[i];
			var dhero = tempMsg.defender.heros[i];
			heroLines += '<tr height=25 class=line>';
			if ( ahero ) {
				heroLines += _getHeroTableLine(true/*hasExp*/, ahero, 'attackline');
			}
			else {
				heroLines += _getEmptyTableLine(7, 'attackline');
			}
			
			if ( dhero ) {
				heroLines += _getHeroTableLine(false/*hasExp*/, dhero, 'defline');
			}
			else {
				heroLines += _getEmptyTableLine(6, 'defline');
			}
			
			heroLines += '</tr>';
		}
		return heroLines;
	};
	
	var _getHeroTableLine = function(hasExp, hero, cssclass){
		var heroLines = '';
		heroLines += '<td class=' +cssclass+ '>' + hero.name + '</td>';
		heroLines += '<td class=' +cssclass+ '>' + hero.level + '</td>';
		heroLines += '<td class=' +cssclass+ '>' + RStrUtil.getSoldierNameByResId(hero.soldier.resid) + '</td>';
		heroLines += '<td class=' +cssclass+ '>' + hero.soldier.number + '</td>';
		heroLines += '<td class=' +cssclass+ '>' + hero.soldier.loss + '</td>';
		heroLines += '<td class=' +cssclass+ '>' + hero.soldier.revive + '</td>';
		if ( hasExp ) {
			heroLines += '<td class=' +cssclass+ '>' + hero.addExp + '</td>';	
		}
		return heroLines;
	};
	
	var _getEmptyTableLine = function(tdNumber, cssclass) {
		var s = '';
		for ( var i=0; i<tdNumber; ++i ) {
			s += '<td class=' +cssclass+ '></td>';
		}
		return s;
	};
	
	var _getFightRes = function(tempMsg){
		var s = '';
		
		if ( m_fightResultMaker.hasDefExpend(tempMsg.defender.defexpend) ) {
			s += m_fightResultMaker.getDefExpend(tempMsg.defender.defexpend) + '<br/>';
		}
		
		var titles = m_fightResultMaker.getGetOrLostResTitle(tempMsg);
		s += _getRoleGetOrLostResString(titles.attack, tempMsg.attacker);
		s += _getRoleGetOrLostResString(titles.target, tempMsg.defender);
		
		return s;
	};
	
	var _getRoleGetOrLostResString = function(title, campData){
		var s = title + '：';
		var resString = m_fightResultMaker.getGetOrLostResString(campData) +
			m_fightResultMaker.getDropItemsString(campData);
		if ( resString == '' ) {
			resString = rstr.military.fightresult.lbl.no;
		}
		s += resString + '<br/>';
		return s;
	};	
});

CommSysTempLetterMaker = Class.extern(function(){
	var m_g = null;
	this.init = function(g){
		m_g = g;
	};
	
	this.make = function(tempRes, tempMsg){
		tempRes = tempRes.replace('#con#', HyperLinkMgr.formatLink(tempMsg.con));
		return tempRes;	
	};
});

TempLetterMakerMgr = Class.extern(function(){
	this.init = function(g){
		this.makers = {};
		this.makers[FIXID.FDEMO_MAILTEMP] = FightResultTempLetterMaker.snew(g);
		this.makers[FIXID.COMM_SYS_MAILTEMP] = CommSysTempLetterMaker.snew(g);
	};
	
	this.make = function(tempId, tmsg) {
		var maker = this.makers[tempId];
		if ( !maker ) {
			return '';
		}
		
		var tempRes = res_mailtemps_fact[tempId];
		if ( !tempRes ) {
			return '';
		}
		
		return maker.make(tempRes, tmsg);
	};
});
