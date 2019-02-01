////////////////////////////////////////////////////////////////////////////////////////////////////
var FRAME_BORDER = 2;
WindowResizer = Class.extern(function(){
	var MAX_W = 2048;
	var MIN_W = 900;
	var MAX_H = 1536;
	var MIN_H = 500;
	
	this.g = null;
	this.lastSize = {cx:0, cy:0};
	this.curSize = {cx:0, cy:0};
	this.regPanelSizers = [];
	this.hasActivePanelFlag = false;
	this.updateTimes = 0;
	this.init = function(g){
		this.g = g;
		this.g.regUpdater(this, this.onUpdate, 1000);
	};
	
	this.regPanelSizer = function() {
		this.regPanelSizers.push( GlobalBodySizer.snew(this.g, this) );
		this.regPanelSizers.push( MainPanelMapSizer.snew(this.g, this) );
		this.regPanelSizers.push( FarmPanelSizer.snew(this.g, this) );
		this.regPanelSizers.push( MapPanelSizer.snew(this.g, this) );
		this.regPanelSizers.push( InbuildPanelSizer.snew(this.g, this) );
		this.regPanelSizers.push( ChatPanelSizer.snew(this.g, this) );
		this.regPanelSizers.push( BriefresPanelSizer.snew(this.g, this) );
		this.regPanelSizers.push( QueueMsgBarSizer.snew(this.g, this) );
		this.regPanelSizers.push( NewcomerHelperSizer.snew(this.g, this) );
		this.regPanelSizers.push( SmallMapSizer.snew(this.g, this) );
		this.regPanelSizers.push( ScutbarSizer.snew(this.g, this) );
		this.regPanelSizers.push( FarmMainToolBarSizer.snew(this.g, this) );
		this.regPanelSizers.push( FarmSecToolBarSizer.snew(this.g, this) );
		this.regPanelSizers.push( FriendDlgSizer.snew(this.g, this) );
		this.regPanelSizers.push( OutFieldPanelSizer.snew(this.g, this) );
		this.regPanelSizers.push( this.g.getGUI().getSysMsgTipBox() );
		this.regPanelSizers.push( this.g.getGUI().getSysMsgTipBox2() );
		this.regPanelSizers.push( UIM.getDlg('createrole') );
		this.regPanelSizers.push( UIM.getDlg('fightmap') );
		this.regPanelSizers.push( UIM.getDlg('imghelp') );
		this.regPanelSizers.push( GameSuggestBtnSizer.snew(this.g, this) );
		this.regPanelSizers.push( LeftPanelSizer.snew(this.g, this) );
	};
	
	this.onUpdate = function() {
		this.resize();
	};
	
	this.resize = function() {
		if ( !this.hasMainPanel() ) {
			return;
		}
		
		this.updateCurSize();
		this.updateTimes++;
		
		if ( !this.isSizeChange() && this.updateTimes > 10 ) {
			return;
		}
		
		this.resizeAndPositionAllPanels();
		
		this.updateLastSize();
	};
	
	this.getMaxClientSize = function(){
		return {cx:MAX_W, cy:MAX_H};
	};
	
	this.getValidClientSize = function(){
		var winSize = TQ.getWinInnerSize();
		var validSize = {cx:0, cy:0};
		validSize.cx = Math.clamp(winSize.cx-FRAME_BORDER, MIN_W, MAX_W);
		validSize.cy = Math.clamp(winSize.cy-FRAME_BORDER, MIN_H, MAX_H);
		
		var adjustedCX = this._adjustClientSizeCX(winSize, validSize);
		var adjustedCY = this._adjustClientSizeCY(winSize, validSize);
		
		if (!adjustedCX) {
			this._adjustClientSizeCX(winSize, validSize);
		}
		
		if (!adjustedCY) {
			this._adjustClientSizeCY(winSize, validSize);
		}
		
		return validSize;
	};
	
	this._adjustClientSizeCX = function(winSize, validSize){
		if (TQ.isIE6() || TQ.isIE7()) return false;
		
		var hasVerticalScrollBar = validSize.cy > winSize.cy;
		if ( hasVerticalScrollBar ) {
			winSize.cx -=  TQ.getBrowserScollBarW();
			validSize.cx = Math.clamp(winSize.cx-FRAME_BORDER, MIN_W, MAX_W);
			return true;
		}
		return false;
	};
	
	this._adjustClientSizeCY = function(winSize, validSize){
		var hasHorizontalScrollBar = validSize.cx > winSize.cx;
		if ( hasHorizontalScrollBar ) {
			winSize.cy -= TQ.getBrowserScollBarH();
			validSize.cy = Math.clamp(winSize.cy-FRAME_BORDER, MIN_H, MAX_H);
			return true;
		}
		return false;
	};
	
	this.hasMainPanel = function(){
		return UIM.getPanel('main') ? true : false;
	};
	
	this.updateCurSize = function(){
		var validSize = this.getValidClientSize();
		this.curSize.cx = validSize.cx;
		this.curSize.cy = validSize.cy;	
	};
	
	this.isSizeChange = function(){
		return this.curSize.cx != this.lastSize.cx || this.curSize.cy != this.lastSize.cy;
	};
	
	this.resizeAndPositionAllPanels = function(){
		for ( var i=0; i<this.regPanelSizers.length; ++i ) {
			var sizer = this.regPanelSizers[i];
			if (sizer.resize) {
				sizer.resize(this.curSize);
			}
			if (sizer.reposition) {
				sizer.reposition(this.curSize);
			}
		}
	};
	
	this.updateLastSize = function(){
		if (!this.hasActivePanel()) return;
		
		var validSize = this.getValidClientSize();
		this.lastSize.cx = this.curSize.cx;
		this.lastSize.cy = this.curSize.cy;
	};
	
	this.panelActive = function(){
		this.hasActivePanelFlag = true;
	};
	
	this.hasActivePanel = function(){
		return this.hasActivePanelFlag;
	};
	
	this.getCurSize = function(){
		return {cx:this.curSize.cx, cy:this.curSize.cy};
	};
});

PanelSizer = Class.extern(function(){
	this.init = function(g, sizerMgr){
		this.g = g;
		this.sizerMgr = sizerMgr;
	};
	
	this.resize = function(size) {
	};
	
	this.reposition = function(size) {
	};
	
	this.resizeInnerMapPanel = function(mapPanel, size){
		var items = mapPanel.getItems();
		TQ.setDomSize(items.gamemap, size.cx, size.cy);
		TQ.setDomSize(items.mousemap, size.cx, size.cy);
		mapPanel.resize(size);
		if (mapPanel.isActive()){
			mapPanel.resetViewPos();
		}
		
		if (mapPanel.isActive() && this.isMainBuildPanel(mapPanel)) {
			this.sizerMgr.panelActive();
		}
	};
	
	this.isMainBuildPanel = function(mapPanel){
		return mapPanel == UIM.getPanel('inbuild');
	};
});

GlobalBodySizer = PanelSizer.extern(function(){
	this.resize = function(size) {
		var gbody = TQ.getUiBody();
		
		var winSize = TQ.getWinInnerSize();
		var screenCX = winSize.cx - FRAME_BORDER;
		var hasVerticalScrollBar = size.cy > winSize.cy;
		if ( hasVerticalScrollBar ) {
			screenCX -= TQ.getBrowserScollBarW();
		}
		
		TQ.setDomSize(gbody, size.cx, size.cy);
		if ( screenCX > size.cx ){
			TQ.setDomPos(gbody, (screenCX - size.cx)/2, 0);
		} else {
			TQ.setDomPos(gbody, 0, 0);
		}
	};
});

MainPanelMapSizer = PanelSizer.extern(function(){
	this.resize = function(size) {
		var mainItems = UIM.getPanel('main').getItems();
		TQ.setDomSize(mainItems.rootmap, size.cx, size.cy);
		TQ.setDomSize(mainItems.map, size.cx, size.cy);
	};
});

FarmPanelSizer = PanelSizer.extern(function(){
	this.resize = function(size) {
		this.resizeInnerMapPanel(UIM.getPanel('farm').getView(), size);
	};
});

MapPanelSizer = PanelSizer.extern(function(){
	this.resize = function(size) {
		this.resizeInnerMapPanel(UIM.getPanel('statecity'), size);
	};
});

InbuildPanelSizer = PanelSizer.extern(function(){
	this.resize = function(size) {
		this._resizeMainBuildPanel(size);
		this._resizeSubBuildPanels(size);
	};
	
	this._resizeMainBuildPanel = function(size){
		this.resizeInnerMapPanel(UIM.getPanel('inbuild'), size);
	};
	
	this._resizeSubBuildPanels = function(size){
		var iter = UIM.getPanel('main').getSubCityPanels().getIterator();
		for ( ; iter.hasMoreNodes(); ){
			var panel = iter.nextNode();
			this.resizeInnerMapPanel(panel, size);
		}
	};
});

ChatPanelSizer = PanelSizer.extern(function(){
	this.reposition = function(size) {
		var chatPanel = UIM.getPanel('chat');
		chatPanel.setPosition(0, size.cy - chatPanel.getSize().cy);
	};
});

BriefresPanelSizer = PanelSizer.extern(function(){
	var W_SPACE = 10;
	var W_W = 656;
	var W_H = 75;
	
	this.reposition = function(size) {
		var items = UIM.getPanel('main').getItems();
		var pos = this.getBriefBarPos(size);
		if ( TQ.isMobile() ) {
			TQ.setDomPos(items.briefres, pos.x-5, pos.y);
		} else {
			TQ.setDomPos(items.briefres, pos.x, pos.y);
		}
	};
	
	this.getBriefBarPos = function(size) {
		return {x:this._getBriefBarX(size), y:size.cy - W_H};
	};
	
	this._getBriefBarX = function(size){
		var centerX = ( size.cx - W_W )/2;
		var isOverlapChatPanel = centerX < (this._getChatPanelWidth() + W_SPACE);
		if ( !isOverlapChatPanel ) return centerX;
		
		return this._getChatPanelWidth() + W_SPACE;
	};
	
	this._getChatPanelWidth = function(){
		var chatPanel = UIM.getPanel('chat');
		return chatPanel.getSize().cx;
	};
});

QueueMsgBarSizer = PanelSizer.extern(function(){
	var W_W = 350;
	var W_H = 30;
	var W_VSPACE = 25;
	this.init = function(g, sizerMgr){
		this.g = g;
		this.sizerMgr = sizerMgr;
		this.briefSizer = BriefresPanelSizer.snew();
	};
	
	this.reposition = function(size) {
		var briefPos = this.briefSizer.getBriefBarPos(size);
		var queueMsgBar = UIM.getPanel('main').getQueueMsgBar();
		queueMsgBar.setPosition({x:briefPos.x, y:briefPos.y - W_H - W_VSPACE});
		queueMsgBar.setSize({cx:W_W, cy:W_H});
	};
});

NewcomerHelperSizer = PanelSizer.extern(function(){
	var W_W = 410;
	var W_H = 30;
	var W_VSPACE = 25;
	
	this.init = function(g, sizerMgr){
		this.g = g;
		this.sizerMgr = sizerMgr;
		this.briefSizer = BriefresPanelSizer.snew();
	};
	
	this.reposition = function(size) {
		if ( TQ.isMobile() ) {
			W_W = 390;
			W_H = 45;
		}
		var briefPos = this.briefSizer.getBriefBarPos(size);
		UIM.getDlg('newcomerhelper').setPosition({x:briefPos.x + W_W , y:briefPos.y - W_H - W_VSPACE});
	};
});

SmallMapSizer = PanelSizer.extern(function(){
	this.reposition = function(size) {
		this.respositionSmallmap(size);
		this.respositionBtns(size);
		this.respositionFieldToolBar(size);
	};
	
	this.respositionSmallmap = function(size){
		var smallMapSize = UIM.getPanel('smallmap').getMapSize();
		TQ.setCSS(UIM.getPanel('main').getItems().smallmap, 'left', (size.cx - smallMapSize.cx)+'px');
	};
	
	this.respositionBtns = function(size){
		var items = UIM.getPanel('main').getItems();
		if ( TQ.isMobile() ) {
			var x = size.cx - 60 - 5;
			var y = size.cy - 248 - 100;
			TQ.setDomPos(items.rightToolBar, x, y );
		} else {
			var smallMapSize = UIM.getPanel('smallmap').getMapSize();
			var x = size.cx - smallMapSize.cx - UIM.getPanel('main').getSmallMapBtnBar().getBtnSize().cx;
			TQ.setCSS(items.smbtn_shop.getParent(), 'left', x + 'px');
			TQ.setCSS(items.smbtn_rank.getParent(), 'left', x + 'px');
			TQ.setCSS(items.smbtn_letter.getParent(), 'left', x + 'px');
			TQ.setCSS(items.smbtn_exchange.getParent(), 'left', x + 'px');
			TQ.setCSS(items.smbtn_toggle_bgsound.getParent(), 'left', x + 'px');
		}
	};
	
	this.respositionFieldToolBar = function(size){
		var smallMapSize = UIM.getPanel('smallmap').getMapSize();
		var x = size.cx - smallMapSize.cx;
		var barPos = {x:x, y:smallMapSize.cy};
		if ( TQ.isMobile() ) {
			var gotoToolBar = UIM.getPanel('main').getItems().gotoToolBar;
			TQ.setDomPos(gotoToolBar, barPos.x, barPos.y);
		} else {
			var outFieldToolBar = UIM.getPanel('main').getItems().outFieldToolBar;
			TQ.setDomPos(outFieldToolBar, barPos.x, barPos.y);
		}
	};
});

ScutbarSizer = PanelSizer.extern(function(){
	this.reposition = function(size) {
		if ( TQ.isMobile() ) {
			var RIGHT_SPACE = 210;
			var BAR_W = 60;
			var items = UIM.getPanel('main').getItems();
			var barLeft = (size.cx - RIGHT_SPACE);
			TQ.setCSS(items.scutbar, 'left', barLeft+'px');
			
			var traceDlgLeft = barLeft + BAR_W - UIM.getDlg('buildingtrace').getSize().cx;
			var traceDlgTop = 165;
			UIM.getDlg('buildingtrace').setPosition({x:traceDlgLeft, y:traceDlgTop});
		} else {
			var RIGHT_SPACE = 404;
			var BAR_W = 115;
			var items = UIM.getPanel('main').getItems();
			var barLeft = (size.cx - RIGHT_SPACE);
			TQ.setCSS(items.scutbar, 'left', barLeft+'px');
			
			var traceDlgLeft = barLeft + BAR_W - UIM.getDlg('buildingtrace').getSize().cx + 39  + 36;
			var traceDlgTop = 49;
			UIM.getDlg('buildingtrace').setPosition({x:traceDlgLeft, y:traceDlgTop});
		}
	};
});

FarmMainToolBarSizer = PanelSizer.extern(function(){
	var W_SPACE = 10;
	this.reposition = function(size) {
		var view = UIM.getPanel('farm').getView();
		view.setMainToolBarPos(this.getMainToolBarPos(size));
	};
	
	this.getMainToolBarPos = function(size){
		var view = UIM.getPanel('farm').getView();
		return {x:this._getMainToolBarX(size), y:size.cy - view.getMainToolBarSize().cy};	
	};
	
	this._getMainToolBarX = function(size){
		var view = UIM.getPanel('farm').getView();
		var centerX = ( size.cx - view.getMainToolBarSize().cx )/2;
		var isOverlapChatPanel = centerX < (this._getChatPanelWidth() + W_SPACE);
		if ( !isOverlapChatPanel ) return centerX;
		
		return this._getChatPanelWidth() + W_SPACE;
	};
	
	this._getChatPanelWidth = function(){
		var chatPanel = UIM.getPanel('chat');
		return chatPanel.getSize().cx;
	};
});

FarmSecToolBarSizer = PanelSizer.extern(function(){
	var W_SPACE = 10;
	this.init = function(g, sizerMgr){
		this.g = g;
		this.sizerMgr = sizerMgr;
		this.mainToolBarSizer = FarmMainToolBarSizer.snew();
	};
	
	this.reposition = function(size) {
		var view = UIM.getPanel('farm').getView();
		var mainBarPos = this.mainToolBarSizer.getMainToolBarPos(size);
		view.setSecToolBarPos({x:mainBarPos.x + view.getMainToolBarSize().cx + W_SPACE
			,y:size.cy - view.getSecToolBarSize().cy});
	};
});

FriendDlgSizer = PanelSizer.extern(function(){
	this.reposition = function(size) {
		UIM.getDlg('friend').resetPos();
	};
});

OutFieldPanelSizer = PanelSizer.extern(function(){
	this.resize = function(size) {
		this.resizeInnerMapPanel(UIM.getPanel('field'), size);
	};
});

GameSuggestBtnSizer = PanelSizer.extern(function(){
	this.init = function(g, sizerMgr){
		this.g = g;
		this.sizerMgr = sizerMgr;
		this.briefSizer = BriefresPanelSizer.snew();
	};
	
	this.reposition = function(size) {
		var main = UIM.getPanel('main');
		if ( !main ) return;
		var items = main.getItems();
		if ( !items) return;
		
		var briefPos = this.briefSizer.getBriefBarPos(size);
		var dom = items.gameSuggestBtn.getParent();
		var bottomH = 130;
		if ( TQ.isMobile() ) bottomH = 145;
		TQ.setDomPos(dom, briefPos.x + 410 + 45, size.cy - bottomH);
	};
});

LeftPanelSizer = PanelSizer.extern(function(){
	this.init = function(g, sizerMgr){
		this.g = g;
	};
	
	this.reposition = function(size) {
		if ( !TQ.isMobile() ) return;
		var main = UIM.getPanel('main');
		if ( !main ) return;
		var items = main.getItems();
		if ( !items) return;
		
		var PANEL_W = 265;
		var TASK_GUIDE_PANEL_H = 103;
		var SYSMSG_PANEL_H = 80;
		var CHAT_PANEL_H = 70;
		
		var collapseTaskGuideBtn = items.collapseTaskGuideBtn.getParent();
		var expandTaskGuideBtn = items.expandTaskGuideBtn.getParent();
		var y = size.cy - CHAT_PANEL_H - 5 - SYSMSG_PANEL_H - 5 - TASK_GUIDE_PANEL_H;
		TQ.setDomPos(items.taskGuide, 0, y);
		TQ.setDomPos(collapseTaskGuideBtn, PANEL_W, y);
		TQ.setDomPos(expandTaskGuideBtn, 0, y);
		
		var collapseSysMsgBtn = items.collapseSysMsgBtn.getParent();
		var expandSysMsgBtn = items.expandSysMsgBtn.getParent();
		var y = size.cy - CHAT_PANEL_H - 5 - SYSMSG_PANEL_H;
		TQ.setDomPos(items.sysmsg, 0, y);
		TQ.setDomPos(collapseSysMsgBtn, PANEL_W, y);
		TQ.setDomPos(expandSysMsgBtn, 0, y);
	};
});
