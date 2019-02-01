/******************************************************************************/
CommBuildBlock = function(){
	var m_g;
	var m_this;
	var m_dom;
	var m_item=null;
	var m_x=0;
	var m_y=0;	
	var m_w=0;
	var m_h=0;
	var m_ox=0;
	var m_oy=0;	
	var m_ow=0;
	var m_oh=0;
	var m_bottom=0;
	var m_isshow=true;
	var m_checkInRectFlag='comm';
	
	this.init = function(g, dom, checkInRectFlag){
		m_g = g;
		m_this = this;
		m_dom = dom;
		m_checkInRectFlag = checkInRectFlag ? checkInRectFlag : 'comm';
		TQ.setClass(m_dom, 'inbldblock');
		_init();
	};
	
	this.clear = function(){
		m_this.setItem(null);
	};
	
	this.getORect = function(){
		return {x:m_ox, y:m_oy, w:m_ow, h:m_oh};
	};
	
	this.isInRect = function(pos){
		if ( !m_isshow ){
			return false;
		}
		else if ( m_checkInRectFlag == 'rect' ){
			return TQ.isInRect(m_this.getORect(), pos);
		}
		else if ( m_checkInRectFlag == 'rhombus' ){
			return TQ.isInRhombus(m_this.getORect(), pos);
		}
		else if ( !m_item ){
			return TQ.isInRhombus({x:m_x, y:m_y, w:TQ.getDomWidth(m_dom), h:TQ.getDomHeight(m_dom)}, pos);
		}
		else if ( !m_item.itemres.irects ){
			return TQ.isInRect({x:m_x, y:m_y, w:TQ.getDomWidth(m_dom), h:TQ.getDomHeight(m_dom)}, pos);
		}
		else {
			return _isInCombinedRects(m_item.itemres.irects, pos);
		}
		return false;
	};
	
	this.setItem = function(item){
		m_item = item;
		var imgh = m_h;
		var imgw = m_w;
		if ( m_item ){
			imgh = m_item.itemres.imgh;
			imgw = m_item.itemres.imgw;
		}
		
		m_x = m_ox + (m_ow - imgw)/2 ;
		m_y = m_bottom - imgh;
		TQ.setCSS(m_dom, 'left', m_x+'px');
		TQ.setCSS(m_dom, 'top', m_y+'px');
		TQ.setDomWidth(m_dom, imgw);
		TQ.setDomHeight(m_dom, imgh);
	};

	this.getItem = function(){
		return m_item;
	};
	
	this.show = function(){
		TQ.setCSS(m_dom, 'visibility', 'visible');
		m_isshow = true;
	};
	
	this.hide = function(){
		TQ.setCSS(m_dom, 'visibility', 'hidden');
		m_isshow = false;
	};
	
	this.isShow = function(){
		return m_isshow;
	};
	
	this.getDom = function(){
		return m_dom;
	};

	//------------
	//private:method
	//------------
	var _init = function(){
		m_ox = m_x = parseInt(TQ.curCSS(m_dom, 'left'), 10);
		m_oy = m_y = parseInt(TQ.curCSS(m_dom, 'top'), 10);
		m_oh = m_h = TQ.getDomHeight(m_dom);
		m_ow = m_w = TQ.getDomWidth(m_dom);
		m_bottom = parseInt(TQ.curCSS(m_dom, 'top')) + m_h;
	};
	
	var _isInCombinedRects = function(rects, pos){
		for ( var i=0; i<rects.length; ++i ){
			var rct = rects[i];
			if ( TQ.isInRect({x:rct[0]+m_x, y:rct[1]+m_y, w:rct[2], h:rct[3]}, pos)){
				return true;
			}
		}
		return false;
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};

FarmBuildBlock = function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var m_g=null;
	var m_this=null;
	_lc_.m_dom=null;
	_lc_.m_commobj=null;
	_lc_.m_item=null;
	_lc_.m_canGatherDom=null;
	_lc_.m_protectDom=null;
	
	this.init = function(g, dom, checkInRectFlag){
		m_g = g;
		m_this = this;
		_lc_.m_dom = dom;
		_lc_.m_commobj = new CommBuildBlock(m_g, _lc_.m_dom, checkInRectFlag);
		_lc_._createCanGatherDom();
		_createProtectDom();
	};
	
	this.clear = function(){
		_lc_.m_commobj.setItem(null);
		m_g.unregUpdater(m_this, _lc_._onProtectStop);
	};
	
	this.getORect = function(){
		return _lc_.m_commobj.getORect();
	};
	
	this.isInRect = function(pos){
		return _lc_.m_commobj.isInRect(pos);
	};
	
	this.setItem = function(item){
		_lc_._setItem(item);
		_lc_.m_commobj.setItem(item);
		m_this.normal();
		_lc_._setCanGatherVisible();
		_lc_._setProtectDomVisible();
	};
	
	this.hot = function(){
		_hot();
	};
	
	this.normal = function(){
		_normal();
	};
	
	this.getItem = function(){
		return _lc_.m_commobj.getItem();
	};
	
	this.show = function(){
		_lc_.m_commobj.show();
	};
	
	this.hide = function(){
		_lc_.m_commobj.hide();
		TQ.setCSS(_lc_.m_canGatherDom, 'visibility', 'hidden' );
		TQ.setCSS(_lc_.m_protectDom, 'visibility', 'hidden' );
		m_g.unregUpdater(m_this, _lc_._onProtectStop);
	};
	
	this.isShow = function(){
		return _lc_.m_commobj.isShow();
	};
	
	this.getDom = function(){
		return _lc_.m_commobj.getDom();
	};

	_lc_._createCanGatherDom = function(){
		_lc_.m_canGatherDom = TQ.createDom('div');
		TQ.append(_lc_.m_dom, _lc_.m_canGatherDom);
		TQ.setClass(_lc_.m_canGatherDom, 'farmblockcangather');
	};
	
	var _createProtectDom = function(){
		_lc_.m_protectDom = TQ.createDom('div');
		TQ.append(_lc_.m_dom, _lc_.m_protectDom);
		TQ.setClass(_lc_.m_protectDom, 'farmblockprotect');
	};
	
	var _hot = function(){
		IMG.setBKImage(_lc_.m_dom, IMG.makeFarmBuildImg(_lc_.m_item.itemres.img, true, _lc_.m_item.state));
	};
	
	var _normal = function(){
		IMG.setBKImage(_lc_.m_dom, IMG.makeFarmBuildImg(_lc_.m_item.itemres.img, false, _lc_.m_item.state));
	};
	
	_lc_._setItem = function(item){
		_lc_.m_item = item;
	};
	
	_lc_._setCanGatherVisible = function(){
		if ( _lc_.m_item && _lc_.m_item.canGather ) {
			TQ.setCSS(_lc_.m_canGatherDom, 'visibility', 'visible' );
		}
		else {
			TQ.setCSS(_lc_.m_canGatherDom, 'visibility', 'hidden' );
		}
	};
	
	_lc_._setProtectDomVisible = function(){
		if ( _isInProtectTime() ) {
			TQ.setCSS(_lc_.m_protectDom, 'visibility', 'visible' );
			var leftTime = (_lc_.m_item.pStopTime - m_g.getSvrTimeS())*1000;
			m_g.regUpdater(m_this, _lc_._onProtectStop, leftTime, true);
		}
		else {
			TQ.setCSS(_lc_.m_protectDom, 'visibility', 'hidden' );
			m_g.unregUpdater(m_this, _lc_._onProtectStop);
		}
	};
	
	var _isInProtectTime = function(){
		return _lc_.m_item 
			&& _lc_.m_item.state
			&& (_lc_.m_item.state == FARM_STATE.COMPLETE)
			&& _lc_.m_item.pStopTime 
			&& (m_g.getSvrTimeS() < _lc_.m_item.pStopTime);
	};
	
	_lc_._onProtectStop = function(){
		TQ.setCSS(_lc_.m_protectDom, 'visibility', 'hidden' );
		m_g.unregUpdater(m_this, _lc_._onProtectStop);
	};
	
	this.init.apply(this, arguments);
	//FarmBuildBlock-testunit-end
};

NullBuildBlocks = Class.extern(function(){
	this.init = function(){};
	this.setCanUseBlockCnt = function(cnt){};
	this.getCanUseBlockCnt = function(){return 0;};
	this.setViewPos = function(x, y){};
	this.getViewPos = function(){	return {x:0, y:0}; };
	this.getCount = function(){ return 0; };	
	this.getBlock = function(idx){ return null; };
	this.getCurBlock = function(){ return null; };
	this.getCurSel = function(){ return -1; };
	this.hideAllBlock = function(){};
	this.updateTip = function(){};
	this.setCaller = function(caller){};
	this.setTipCaller = function(caller){};
	this.click = function(idx){};
	this.getTip = function(idx){	return null; };
	this.getShowBlocks = function(){	return 0; };
}).snew();

BuildBlocks = Class.extern(function(){
	//-----------
	//private:data
	//-----------
	var m_g=null;
	var m_this=null;
	var m_map=null;
	var m_mousemap=null;
	var m_poss=[];
	var m_blocks=[];
	var m_blockw=100;
	var m_blockh=54;
	var m_mouseinmap=false;
	var m_mouseinblock=false;
	var m_lastidx=-1;
	var m_curmpos={x:0,y:0};
	var m_tip=null;
	var m_clickcaller=null;
	var m_tipcaller=null;
	var m_cursel=-1;
	var m_checkInRectFlag='comm';
	var m_blockclass=null;
	var m_viewpos={x:0, y:0};
	var m_canusecnt=0;
	
	//------------
	//public:method
	//------------
	this.init = function(g, info, checkInRectFlag){
		m_g = g;
		m_this = this;
		m_map = info.map;
		m_mousemap = info.mousemap;
		m_poss = info.poss;
		m_blockw = info.blockw;
		m_blockh = info.blockh;
		m_clickcaller = info.clickcaller;
		m_tipcaller = info.tipcaller;
		m_blockclass = info.blockclass;
		m_checkInRectFlag = checkInRectFlag ? checkInRectFlag : 'comm';
		m_canusecnt = m_poss.length;
		_createBlocks();
		_regMEvents();
		_createTip();
	};
	
	this.setCanUseBlockCnt = function(cnt){
		m_canusecnt = cnt;
		for ( var i=0; i<m_blocks.length; ++i ) {
			var block = m_blocks[i];
			block.setDisable(i >= m_canusecnt);
			block.normal();
		}
	};
	
	this.getCanUseBlockCnt = function(){
		return m_canusecnt;
	};
	
	this.setViewPos = function(x, y){
		m_viewpos.x = x;
		m_viewpos.y = y;
	};
	
	this.getViewPos = function(){
		return m_viewpos;
	};
	
	this.getCount = function(){
		return m_blocks.length;
	};	
	
	this.getBlock = function(idx){
		return m_blocks[idx];
	};
	
	this.getCurBlock = function(){
		return m_this.getBlock(m_cursel);
	};
	
	this.getCurSel = function(){
		return m_cursel;
	};
	
	this.hideAllBlock = function(){
		for ( var i=0; i<m_blocks.length; ++i ){
			m_blocks[i].hide();
		}
	};
	
	this.updateTip = function(){
		_updateTip();
	};
	
	this.setCaller = function(caller){
		m_clickcaller = caller;
	};
	
	this.setTipCaller = function(caller){
		m_tipcaller = caller;
	};
	
	this.click = function(idx){
		m_clickcaller.caller.call(m_clickcaller.self, null, idx);
	};
	
	this.getTip = function(idx){
		return _onGetBlockTooltip({idx:idx});
	};
	
	this.getShowBlocks = function(){
		var showblocks = 0;
		for ( var i=0; i<m_blocks.length; ++i ){
			var block = m_blocks[i];
			if ( block.isShow() ) showblocks++;
		}
		return showblocks;
	};
	
	//------------
	//private:method
	//------------	
	var _createBlocks = function(){
		for ( var i=0; i<m_poss.length; ++i ){
			var dom = TQ.createDom('div');
			TQ.append(m_map, dom);
			TQ.setCSS(dom, 'position', 'absolute');
			TQ.setCSS(dom, 'zIndex', m_poss[i].y); // sort by pos.y
			TQ.setDomRect(dom, m_poss[i].x, m_poss[i].y, m_blockw, m_blockh);
			m_blocks.push(new m_blockclass(m_g, dom, m_checkInRectFlag));
		}
	};
	
	var _regMEvents = function(){
		TQ.addEvent(m_mousemap, 'mouseover', _onMouseOver);
		TQ.addEvent(m_mousemap, 'mousemove', _onMouseMove);
		TQ.addEvent(m_mousemap, 'mouseout', _onMouseOut);
		TQ.addEvent(m_mousemap, 'mouseup', _onClickBlock);
		TQ.captureTouchEvent(m_mousemap, {self:m_this, touchEnd:_onTouchEnd});
	};
	
	var _createTip = function(){
		var tipid = TTIP.addTip(m_mousemap, 'no');
		m_tip = TTIP.getTipById(tipid);
		m_tip.setFlag(TIP_FLAG.CUSTOM);
		m_tip.setCaller({self:m_this, caller:_onGetBlockTooltip});
	};
	
	var _onMouseOver = function(e){
		m_mouseinmap = true;
		m_curmpos = TQ.mouseCoords(e);
		_handleMouse(e);
	};
	
	var _onMouseMove = function(e){
		if ( m_mouseinmap ){
			_handleMouse(e);
			m_curmpos = TQ.mouseCoords(e);
			if ( m_mouseinblock ){
				m_tip.show(m_curmpos);
			}
		}
	};
	
	var _onMouseOut = function(e){
		m_mouseinmap = false;
		_selectBlock(-1);
	};
	
	var _onClickBlock = function(e){
		e = e ? e : window.event;
		if ( !m_mouseinmap ){
			return;
		}
		m_cursel = _getBlockIdx(e);
		m_clickcaller.caller.call(m_clickcaller.self, e, m_cursel);
	};
	
	var _onTouchEnd = function(e, touch, element){
		m_mouseinmap = true;
		_onClickBlock(TQ.makeMouseEvent(touch.pageX, touch.pageY, BTN_LEFT, element));
	};
	
	var _onGetBlockTooltip = function(data){
		return m_tipcaller.caller.call(m_tipcaller.self, data);
	};
	
	var _selectBlock = function(idx){
		_leaveBlock(m_lastidx);
		_enterBlock(idx);
		m_lastidx = idx;
	};
	
	var _handleMouse = function(e){
		_selectBlockByMouse(e);
	};
	
	var _selectBlockByMouse = function(e){
		if ( DragMapChecker.isDragging() ) { // just lifting efficiency for ie
			return;
		}
		
		var idx = _getBlockIdx(e);
		if ( m_lastidx != idx ){
			_selectBlock(idx);
		}
	};
	
	var _enterBlock = function(idx){
		if ( idx >= 0 ){
			m_blocks[idx].hot();
			m_tip.setData({idx:idx});
			m_tip.show(m_curmpos);
			m_mouseinblock = true;
		}
	};
	
	var _leaveBlock = function(idx){
		if ( idx >= 0 ){
			m_blocks[idx].normal();
			m_tip.hide();
			m_mouseinblock = false;
		}
	};
	
	var _updateTip = function(){
		if ( m_mouseinblock ){
			m_tip.reset();
			m_tip.show(m_curmpos);
		}
	};

	var _getBlockIdx = function(e){
		var pos = TQ.mouseRelativeCoords(m_mousemap, e);
		pos.x += m_viewpos.x;
		pos.y += m_viewpos.y;
		for ( var i=0; i<m_poss.length; ++i ){
			if ( m_blocks[i].isInRect(pos) ){
				return i;
			}
		}
		return -1;
	};
});

SelPipDlg = function(){
	//-----------
	//private:data
	//-----------
	var m_g=null;
	var m_this=null;
	var m_dlg=null;
	var m_items={};
	var m_pipitems=[];
	var m_caller=null;

	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.toggle = function(){
		if ( !this.isShow() ){
			this.openDlg();
		}
		else{
			this.closeDlg();
		}
	};
	
	this.openDlg = function(){
		_initDlg();
		m_dlg.show();
		HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
		this.refreshNewComerSpirit();
	};
	
	this.closeDlg = function(){
		if ( m_dlg ){
			m_dlg.hide();
			HelpGuider.getNewcomerSpirit().onDlgClose('selpip');
		}
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.isShow = function(){
		if ( !m_dlg ) return false;
		return m_dlg.isShow();
	};
	
	this.click = function(idx) {
		_onClickItem(null, idx);
	};
	
	this.refreshNewComerSpirit = function(){
		HelpGuider.getNewcomerSpirit().onDlgOpen('selpip', {parent:m_dlg.getParent(), items:m_items});
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:false
					,canDrag:true
					,dragTitleH:35
					,pos:{x:0, y:300}
					,uiback:uiback.dlg.minihelp
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.farm.selpipdlg, m_items);
			m_items.closebtn.setCaller({self:m_this, caller:function(){m_this.closeDlg();}});
			m_dlg.hide();
			_initList();
		}
	};
	
	var _initList = function(){
		for ( var id=FIXID.PIPSTART; id<=FIXID.PIPEND; ++id ){
			m_pipitems.push({itemres:ItemResUtil.findItemres(id)});
		}
		m_items.list.setItemCount(m_pipitems.length);
		for ( var i=0; i<m_pipitems.length; ++i ){
			var item = m_items.list.getItem(i);
			var ritem = m_pipitems[i];
			IMG.setBKImage(item.exsubs.icon,IMG.makeBigImg(ritem.itemres.bigpic));
			var tipid = m_items.list.getSubItem(item,'tooltips')[TIP_PREFIX+'item'];
			var tip = TTIP.getTipById(tipid);
			tip.setCaller({self:m_this,caller:_onGetTooltip});
			tip.setData({idx:i});
		}
		m_items.list.setCaller({self:m_this, caller:_onClickItem});
	};
	
	var _onGetTooltip = function(data){
		return TIPM.getFarmPipDesc(m_pipitems[data.idx]);
	};
	
	var _onClickItem = function(e, idx){
		if ( m_caller ){
			m_caller.caller.call(m_caller.self, m_pipitems[idx].itemres.id, idx);
		}
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};

FarmInfoDlg = function(){
	//-----------
	//private:data
	//-----------
	var m_g=null;
	var m_this=null;
	var m_dlg=null;
	var m_items={};
	var m_infos={ver:-1,list:[]};

	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		m_this = this;
		FarmSender.initg(m_g);
		m_g.regEvent(EVT.NET, NETCMD.FARM, m_this, _onSvrPkg);
	};
	
	this.openDlg = function(){
		_initDlg();
		_initInfo();
		m_dlg.show();
	};
	
	this.closeDlg = function(){
		if ( m_dlg ){
			m_dlg.hide();
		}
	};
	
	this.isShow = function(){
		return (m_dlg != null) && m_dlg.isShow();
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:false
					,title:rstr.farm.farminfo.title
					,pos:{x:'center', y:50}
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.farm.infolistdlg, m_items);
			m_dlg.hide();
		}
	};
	
	var _initInfo = function(){
		_updateList();
		FarmSender.sendGetFarmLog(m_infos.ver);
	};
	
	var _onSvrPkg = function(netevent){
		var netdata = netevent.data;
		if ( netdata.farminfo ){
			m_infos.ver = netdata.farminfo.ver;
			m_infos.list = netdata.farminfo.list;
			_updateList();
		}
	};
	
	var _updateList = function(){
		m_items.list.setItemCount(m_infos.list.length);
		for ( var i=0; i<m_infos.list.length; ++i ){
			var item = m_items.list.getItem(i);
			TQ.setTextEx(item.exsubs.con, _makeItemString(m_infos.list[i]));
		}
	};
	
	var _makeItemString = function(item){
		var ltype = item[0];
		var rolename = item[1];
		var datatime = TQ.formatDateTime(item[2]);
		var param1 = item[3];
		var param2 = item[4];
		var param3 = item[5];
		var param4 = item[6];
		if ( ltype ==  FARMLOG_TYPE.GETSELF ) {
			return TQ.format(rstr.farm.farminfo.getmy, datatime, param1,param2,param3,param4);
		}
		else if ( ltype ==  FARMLOG_TYPE.GETOTHER ) {
			return TQ.format(rstr.farm.farminfo.getother, datatime, rolename, param1,param2,param3,param4);
		}
		else if ( ltype ==  FARMLOG_TYPE.OTHERGET ) {
			return TQ.format(rstr.farm.farminfo.otherget, datatime, rolename, param1,param2,param3,param4);
		}
		return '';
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};

FarmBlockTip = Class.extern(function(){
	var m_g=null;
	var m_this=null;
	var m_model=null;
	this.init = function(g, model){
		m_g = g;
		m_this = this;
		m_model = model;
	};
	
	this.getBlockTip = function(blockid){
		var block = m_model.getBlock(blockid);
		if ( !block ) return '';
		
		if ( block.resid == FIXID.EMPTYFARMBLOCK ) {
			return _getEmptyBlockTip();
		}
		else if ( block.resid == FIXID.NEXTFARMBLOCK ) {
			return _getNextBlockTip();
		}
		else if ( block.state == FARM_STATE.COMPLETE ) {
			return _getYellowBlockTip(block);
		}
		else {
			return _getGreenBlockTip(block);
		}		
	};
	
	var _getEmptyBlockTip = function(){
		if ( m_model.isMyCurFarm() ) {
			return TQ.formatLine(rstr.farm.tips.empty);
		}
		else {
			return TQ.formatLine(rstr.farm.tips.otherempty);
		}
	};
	
	var _getNextBlockTip = function(){
		if ( m_model.isMyCurFarm() ) {
			var citylevel = m_g.getImgr().getCityLevel();
			return TQ.formatLine(TQ.format(rstr.farm.tips.nextlevel, RStrUtil.getCityNameByLevel(citylevel+1)));
		}
		else {
			return TQ.formatLine(rstr.farm.tips.othernextlevel);
		}
	};
	
	var _getGreenBlockTip = function(block){
		if ( m_model.isMyCurFarm() ) {
			var info = m_model.getBlockResInfo(block);
			return TQ.format(rstr.farm.tips.itemcontinue,
				block.itemres.outputname, TQ.formatTime(2, info.lefttime), info.res, parseInt(info.per*100, 10) );
		}
		else {
			var info = m_model.getBlockResInfo(block);
			return TQ.formatLine(	TQ.format(rstr.farm.tips.othergreenblock, block.itemres.outputname, TQ.formatTime(2, info.lefttime)) );
		}
	};
	
	var _getYellowBlockTip = function(block){
		if ( block.pStopTime && (m_g.getSvrTimeS() < block.pStopTime) ) {
			return TQ.format(rstr.farm.tips.itemokex, 
				block.itemres.outputname,
				block.leftres,
				block.totalres,
				TQ.formatTime(2, block.pStopTime - m_g.getSvrTimeS()));
		} else {
			return TQ.format(rstr.farm.tips.itemok, 
				block.itemres.outputname,
				block.leftres,
				block.totalres);
		}
	};
});

FarmModel = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g=null;
	var m_this=null;
	var m_blocktip=null;
	_lc_.m_curfarm={ver:-1,role:{uid:-1, citylevel:-1},blocks:[]};
	var m_observer=null;
	var m_opstate=FARMOP_STATE.SEL;
	var m_pipresid=0;
	this.init = function(g) {
		_lc_.m_g = g;
		m_this = this;
		m_blocktip = FarmBlockTip.snew(_lc_.m_g, this);
		FarmSender.initg(_lc_.m_g);
	};
	
	this.regObserver = function(ob) {
		m_observer = ob;
	};
	
	this.getOpState = function(){
		return m_opstate;
	};
	
	this.setOpState = function(opstate){
		m_opstate = opstate;
		if ( m_observer ) m_observer.onSetOpState(m_opstate);
		HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
	};
	
	this.getPipResid = function(){
		return m_pipresid;
	};
	
	this.setPipResid = function(resid) {
		m_pipresid = resid;
	};
	
	this.handleFarmSvrData = function(ndata) {
		_lc_._handleFarmData(ndata.data.farm);
		_handleFarmInputResult(ndata.data.farminput);
		_handleFarmGetsNumbers(ndata.data.farmgets);
		HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
	};
	
	this.updateBlocks = function(){
		var servertime = _lc_.m_g.getSvrTimeS();
		var completeids = [];
		var statechangeids = [];
		for ( var i=0; i<_lc_.m_curfarm.blocks.length; ++i ) {
			var block = _lc_.m_curfarm.blocks[i];
			if ( block.resid == FIXID.EMPTYFARMBLOCK ) continue;
			if ( block.resid == FIXID.NEXTFARMBLOCK ) continue;
			if ( block.state == FARM_STATE.COMPLETE ) continue;
			if ( block.stoptime <= servertime && !this.isMyCurFarm() ) {
				completeids.push(block.id);
			}
			
			if ( block.state == FARM_STATE.SAPLING ) {
				var duration = block.stoptime - block.starttime;
				var lapse = servertime - block.starttime;
				if ( lapse >= duration/2 ) { 
					statechangeids.push(block.id);
					block.state = FARM_STATE.GROWUP;
				}
			}
		}
		FarmSender.sendCompleteFarmBlocks(_lc_.m_curfarm.role.uid, completeids);
		if ( m_observer ) m_observer.updateBlocksState(statechangeids);
	};
	
	this.getCurFarm = function(){
		return _lc_.m_curfarm;
	};
	
	this.isMyFarm = function(farm){
		if ( !farm.role || !farm.role.uid ) return false; 
		var roleid = _lc_.m_g.getImgr().getRoleRes().uid;
		return (roleid == farm.role.uid);
	};
	
	this.isMyCurFarm = function(){
		return this.isMyFarm(this.getCurFarm());
	};
	
	this.getCanGetMyRes = function(resid){
		var totalres = 0;
		var myfarm = _lc_.m_g.getImgr().getMyFarm();
		for ( var i=0; i<myfarm.blocks.length; ++i ) {
			var block = myfarm.blocks[i];
			if ( block.resid != resid ) continue;
			
			var info = this.getBlockResInfo(block);
			if ( info.state != FARM_STATE.COMPLETE ) continue;
			
			totalres += info.res;
		}
		return totalres;
	};
	
	this.getBlockCount = function(resid){
		var blockcnt = 0;
		for ( var i=0; i<_lc_.m_curfarm.blocks.length; ++i ) {
			var block = _lc_.m_curfarm.blocks[i];
			if ( block.resid != resid ) continue;
			blockcnt++;
		}
		return blockcnt;
	};	
	
	this.getTotalBlockCount = function(){
		return _getTotalBlockCount(_lc_.m_curfarm.role.citylevel);
	};
	
	this.getNextBlockCount = function(){
		return _getNextBlockCount(_lc_.m_curfarm.role.citylevel);
	};
	
	this.getBlock = function(blockid) {
		return TQ.find(_lc_.m_curfarm.blocks, 'id', blockid);
	};
	
	this.getBlockTip = function(blockid){
		return m_blocktip.getBlockTip(blockid);
	};
	
	this.getBlockRes = function(block){
		return this.getBlockResInfo(block).res;
	};
	
	this.getBlockResInfo = function(block){
		if ( block.state == FARM_STATE.COMPLETE ) {
			return {lefttime:0, per:1, res:block.leftres, state:block.state};
		} else {
			var duration = block.stoptime - block.starttime;
			var lefttime = block.stoptime - _lc_.m_g.getSvrTimeS();
			if ( lefttime <= 0 ) lefttime = 0;
			else if ( lefttime > duration )  lefttime = duration;
			var lapse = duration - lefttime;
			var per = lapse / duration;
			var res = parseInt(per*block.totalres*res_getfarmres_pre, 10);
			return {lefttime:lefttime, per:per, res:res, state:block.state};
		}
	};
	
	_lc_._resetFarmBlocksByCityLevel = function(netfarm, farm){
		if ( !netfarm.role || netfarm.role.citylevel == undefined ) return;
		if ( netfarm.role.citylevel == farm.role.citylevel ) return;
		
		farm.role.citylevel = netfarm.role.citylevel;
		_lc_._resetFarmEmptyBlocksByCityLevel(farm);
		_lc_._resetFarmNextBlocksByCityLevel(farm);
	};
	
	_lc_._resetFarmEmptyBlocksByCityLevel = function(farm) {
		_cutNextBlocks(farm);
		var curlen = farm.blocks.length;
		var totalcnt = m_this.getTotalBlockCount();
		if ( curlen >= totalcnt ) {
			farm.blocks.length = totalcnt;
		}
		else {
			for ( var i=curlen; i<totalcnt; ++i ) {
				farm.blocks.push( {id:i+1, resid:FIXID.EMPTYFARMBLOCK, state:0} );
			}
		}
	};
	
	_lc_._resetFarmNextBlocksByCityLevel = function(farm) {
		var totalcnt = m_this.getTotalBlockCount();
		var nextlevel_addcnt = m_this.getNextBlockCount();
		for ( var i=totalcnt; i<(totalcnt + nextlevel_addcnt); ++i ) {
			farm.blocks.push( {id:i+1, resid:FIXID.NEXTFARMBLOCK, state:0} );
		}
	};
	
	var _cutNextBlocks = function(farm){
		var lastnextcnt = _getNextBlockCount(farm.role.citylevel - 1);
		farm.blocks.length = farm.blocks.length >= lastnextcnt ? farm.blocks.length - lastnextcnt : 0;
	};
	
	_lc_._clearBlocksWhenChangeRole = function(netfarm, farm){
		if ( !netfarm.role || !netfarm.role.uid ) return;
		if ( netfarm.role.uid == farm.role.uid ) return;
		
		for ( var i=0; i<farm.blocks.length; ++i ) {
			var block = farm.blocks[i];
			if ( block.resid == FIXID.NEXTFARMBLOCK ) continue;
			
			block.resid = FIXID.EMPTYFARMBLOCK;
			block.state = 0;
			block.canGather = 0;
		}
	};
	
	var _getTotalBlockCount = function(citylevel) {
		var res = TQ.qfind(res_citylevelneeds, 'level', citylevel);
		if (!res) return 0;
		
		return res.farmBlock;
	};
	
	var _getNextBlockCount = function(citylevel){
		return ( citylevel < res_max_city_level ) ? 
			(_getTotalBlockCount(citylevel+1) - _getTotalBlockCount(citylevel)) : 0;
	};
	
	_lc_._handleFarmData = function(netfarm) {
		if ( !netfarm ) return;
		_lc_._resetFarmBlocksByCityLevel(netfarm, _lc_.m_curfarm);
		_lc_._clearBlocksWhenChangeRole(netfarm, _lc_.m_curfarm);
		TQ.dictCopy(_lc_.m_curfarm, netfarm);
		_lc_._resetSelCityToolFarmBtnState();
		ItemResUtil.initItemsres(_lc_.m_curfarm.blocks);
		if ( m_this.isMyFarm(_lc_.m_curfarm) ) {
			var myfarm = _lc_.m_g.getImgr().getMyFarm();
			_lc_._resetFarmBlocksByCityLevel(netfarm, myfarm);
			TQ.dictCopy(myfarm, netfarm);
			ItemResUtil.initItemsres(myfarm.blocks);
			_lc_.m_g.sendEvent({eid:EVT.FARMINFO,sid:2});
		}
		_lc_.m_g.sendEvent({eid:EVT.FARMINFO,sid:0});
	};
	
	var _handleFarmInputResult = function(farminput) {
		if ( farminput && farminput.result != 0 ){
			_lc_.m_g.sendEvent({eid:EVT.FARMINFO,sid:1, result:farminput.result});
		}
	};
	
	var _handleFarmGetsNumbers = function(farmgets) {
		if ( farmgets && m_observer ){
			m_observer.onGetResNums(farmgets.nums);
		}
	};
	
	_lc_._resetSelCityToolFarmBtnState = function(){
		if ( !UIM.getPanel('farm').getView().isShow() ) return;
		UIM.getPanel('main').getSelCityTool().setCurLoadCity(FIXID.FARMMAP);
	};
	//FarmModel-testunit-end
});

FarmPresenter = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var m_g=null;
	var m_this=null;
	_lc_.m_view=null;
	_lc_.m_model=null;
	
	this.init = function(g, view, model) {
		m_g = g;
		m_this = this;
		_lc_.m_view = view;
		_lc_.m_model = model;
		_lc_.m_view.setModel(_lc_.m_model);
		FarmSender.initg(m_g);
		_lc_.m_model.regObserver(this);
		_addCursors();
		_regEvents();
		_lc_._regClickCaller();
		_regTipCaller();
	};
	
	this.open = function(roleId){
		_lc_.m_view.open();
		m_g.unregUpdater(m_this, _onUpdate);
		m_g.regUpdater(m_this, _onUpdate, 5000);
		_lc_._getFarmFromSvr(roleId);
		SoundMgr.playBackSound(res_baksounds.farm);
	};
	
	this.hide = function(){
		_lc_.m_view.hide();
		m_g.unregUpdater(m_this, _onUpdate);
	};
	
	this.setActive = function(isActive){
		
	};
	
	this.getView = function(){
		return _lc_.m_view;
	};
	
	this.getModel = function(){
		return _lc_.m_model;
	};
	
	this.isMyCurFarm = function(){
		return _lc_.m_model.isMyCurFarm();
	};
	
	this.getCanGetMyRes = function(resid){
		return _lc_.m_model.getCanGetMyRes(resid);
	};
	
	this.onGetResNums = function(nums){
		_lc_.m_view.popGetResNum(nums);
	};
	
	this.onSetOpState = function(opstate) {
		_setCursorByState(opstate);
		_setSelOpBLinkBtn(opstate);
	};
	
	this.updateBlocksState = function(statechangeids) {
		var buildblocks = _lc_.m_view.getCtrl('buildblocks');
		for ( var i=0; i<statechangeids.length; ++i ) {
			var block = buildblocks.getBlock(statechangeids[i]-1);
			block.normal();
		}
	};
	
	var _regEvents = function(){
		m_g.regEvent(EVT.NET, NETCMD.FARM, m_this, _onFarmSvrPkg);
		m_g.regEvent(EVT.FARMINFO, 0, m_this, _onFarmInfo);
		m_g.regEvent(EVT.FARMINFO, 1, m_this, _onCancelInput);
		m_g.regEvent(EVT.ROLEBASE, 0, m_this, _onRolebaseChange);
	};
	
	_lc_._regClickCaller = function(){
		_lc_.m_view.getCtrl('myfarmbtn').setCaller({self:m_this, caller:_lc_._onClickMyFarm});
		_lc_.m_view.getCtrl('farminfobtn').setCaller({self:m_this, caller:_onClickFarmInfo});
		_lc_.m_view.getCtrl('farmrefreshbtn').setCaller({self:m_this, caller:_lc_._onClickFarmRefresh});
		_lc_.m_view.getCtrl('farmrulebtn').setCaller({self:m_this, caller:_onClickFarmRule});
		
		_lc_.m_view.getCtrl('opsel').setCaller({self:m_this, caller:_onClickOpSel});
		_lc_.m_view.getCtrl('opinput').setCaller({self:m_this, caller:_onClickOpInput});
		_lc_.m_view.getCtrl('opinit').setCaller({self:m_this, caller:_onClickOpInit});
		_lc_.m_view.getCtrl('opget').setCaller({self:m_this, caller:_onClickOpGet});
		_lc_.m_view.getCtrl('oppre').setCaller({self:m_this, caller:_onClickOpPreGet});
		_lc_.m_view.getCtrl('opall').setCaller({self:m_this, caller:_onClickOpAllGet});
		_lc_.m_view.getCtrl('opgetother').setCaller({self:m_this, caller:_onClickOpGet});
		_lc_.m_view.getCtrl('opallother').setCaller({self:m_this, caller:_onClickOpAllGet});
		
		_lc_.m_view.getCtrl('buildblocks').setCaller({self:m_this, caller:_lc_._onClickBlock});
		
		UIM.getDlg('selpip').setCaller({self:m_this, caller:_onSelPip});
	};
	
	var _regTipCaller = function(){
		_lc_.m_view.getCtrl('buildblocks').setTipCaller({self:m_this, caller:_onGetBlockTip});
	};
	
	var _onFarmSvrPkg = function(netdata) {
		_lc_.m_model.handleFarmSvrData(netdata);
	};
	
	var _onFarmInfo = function(){
		_lc_.m_view.refreshFarm();
	};
	
	var _onCancelInput = function(){
		_lc_.m_model.setOpState(FARMOP_STATE.SEL);
	};
	
	var _onRolebaseChange = function(){
		_lc_.m_view.refreshTitle();
	};
	
	_lc_._onClickMyFarm = function(){
		_lc_._getFarmFromSvr(m_g.getImgr().getRoleId());
	};
	
	var _onClickFarmInfo = function(){
		UIM.getDlg('farminfo').openDlg();
	};
	
	_lc_._onClickFarmRefresh = function(){
		var curFarm = _lc_.m_model.getCurFarm();
		_lc_._getFarmFromSvr(curFarm.role.uid);
	};
	
	var _onClickFarmRule = function(){
		UIM.getDlg('minihelp').openDlg(1, {x:'center', y:100});
	};
	
	var _onClickOpSel = function(){
		_lc_.m_model.setOpState(FARMOP_STATE.SEL);
	};
	
	var _onClickOpInput = function(){
		UIM.getDlg('selpip').toggle();
	};
	
	var _onClickOpInit = function(){
		_lc_.m_model.setOpState(FARMOP_STATE.INIT);
	};
	
	var _onClickOpGet = function(){
		_lc_.m_model.setOpState(FARMOP_STATE.GET);
	};
	
	var _onClickOpPreGet = function(){
		_lc_.m_model.setOpState(FARMOP_STATE.PREGET);
	};
	
	var _onClickOpAllGet = function(){
		var curfarm = _lc_.m_model.getCurFarm();
		FarmSender.sendGatherAllFarmRes(curfarm.role.uid);
	};
	
	var _onSelPip = function(resid, idx){
		_lc_.m_model.setPipResid(resid);
		_lc_.m_model.setOpState(FARMOP_STATE.INPUT);
	};
	
	_lc_._onClickBlock = function(e, idx){
		var block = _lc_.m_model.getBlock(_lc_._blockIdFromIdx(idx));
		if ( !block || (block.resid == FIXID.NEXTFARMBLOCK) ) return;
		if ( _lc_.m_view.isDragged(e) ) return;
		
		var opstate = _lc_.m_model.getOpState();
		if ( opstate == FARMOP_STATE.SEL ) {
			_lc_._handleSelStateClickBlock(block);
		}
		else if ( opstate == FARMOP_STATE.INPUT ) {
			_lc_._handleInputStateClickBlock(block);
		}
		else if ( opstate == FARMOP_STATE.INIT ) {
			_lc_._handleInitStateClickBlock(block);
		}
		else if ( opstate == FARMOP_STATE.PREGET ) {
			_lc_._handlePreGetStateClickBlock(block);
		}
		else if ( opstate == FARMOP_STATE.GET ) {
			_lc_._handleGetStateClickBlock(block);
		}
	};
	
	var _onGetBlockTip = function(data){
		var blockid = _lc_._blockIdFromIdx(data.idx);
		return _lc_.m_model.getBlockTip(blockid);
	};
	
	var _onUpdate = function(cltTimeMs){
		_lc_.m_view.getCtrl('buildblocks').updateTip();
		_lc_.m_model.updateBlocks();
		_lc_.m_view.refreshPopu();
	};
	
	_lc_._handleSelStateClickBlock = function(block){
		if ( block.resid != FIXID.EMPTYFARMBLOCK ) return;
		UIM.getDlg('selpip').openDlg();
	};
	
	_lc_._handleInputStateClickBlock = function(block){
		if ( block.resid != FIXID.EMPTYFARMBLOCK ) return;
		var pipresid = _lc_.m_model.getPipResid();
		FarmSender.sendInputFarm(block.id, pipresid);
	};
	
	_lc_._handleInitStateClickBlock = function(block){
		if ( block.resid == FIXID.EMPTYFARMBLOCK ) return;
		FarmSender.sendInitFarm(m_g.getImgr().getRoleId(), block.id);
	};
	
	_lc_._handlePreGetStateClickBlock = function(block){
		if ( block.resid == FIXID.EMPTYFARMBLOCK ) return;
		if ( !_lc_.m_model.isMyCurFarm() ) return;
		var res = _lc_.m_model.getBlockRes(block);
		if ( res == 0 ) _sendSimulateGetResNumPkg(block.id);
		else FarmSender.sendPreGatherFarmRes(m_g.getImgr().getRoleId(), block.id);
	};
	
	_lc_._handleGetStateClickBlock = function(block){
		if ( block.resid == FIXID.EMPTYFARMBLOCK ) return;
		if ( block.state != FARM_STATE.COMPLETE ) {
			UIM.getPanel('sysmsg').append(CHAT_TAG.SYS, rstr.farm.tips.getgreenblock);
			return;
		}
		
		var curfarm = _lc_.m_model.getCurFarm();
		FarmSender.sendGatherFarmRes(curfarm.role.uid, block.id);
	};
	
	var _addCursors = function() {
		var dom = _lc_.m_view.getCtrl('mousemap');
		m_g.getGUI().addCursor('farm_sel', dom, 'default');
		if ( TQ.isIE() ) {
			m_g.getGUI().addCursor('farm_init', dom, IMG.getCursorImg('farm/cursor/init.cur', 0, 0) );
			m_g.getGUI().addCursor('farm_get', dom, IMG.getCursorImg('farm/cursor/get.cur', 0, 0) );
			m_g.getGUI().addCursor('farm_preget', dom, IMG.getCursorImg('farm/cursor/preget.cur', 0, 0) );
		} else {
			m_g.getGUI().addCursor('farm_init', dom, IMG.getCursorImg('farm/cursor/init.png', 10, 13) );
			m_g.getGUI().addCursor('farm_get', dom, IMG.getCursorImg('farm/cursor/get.png', 11, 14) );
			m_g.getGUI().addCursor('farm_preget', dom, IMG.getCursorImg('farm/cursor/preget.png', 11, 14) );
		}
		
		var hots = [{x:32, y:27},{x:33, y:27},{x:32, y:24},{x:32, y:27}
			,{x:32, y:27},{x:33, y:27},{x:32, y:24},{x:32, y:27}
			,{x:32, y:27},{x:33, y:27},{x:32, y:24},{x:32, y:27}
			,{x:32, y:27},{x:33, y:27},{x:32, y:24},{x:32, y:27}];
		for ( var i=FIXID.PIPSTART; i <= FIXID.PIPEND; ++i ) {
			hot = hots[i - FIXID.PIPSTART];
			if ( TQ.isIE() ) {
				m_g.getGUI().addCursor('farm_pip_'+i, dom, IMG.getCursorImg('farm/cursor/'+i+'.cur', 0, 0) );
			} else {
				m_g.getGUI().addCursor('farm_pip_'+i, dom, IMG.getCursorImg('farm/cursor/'+i+'.png', hot.x, hot.y) );
			}
		}
	};
	
	var _setCursorByState = function(opstate) {
		var gui = m_g.getGUI();
		if ( opstate == FARMOP_STATE.SEL ) {
			gui.setCursor('farm_sel');
		}
		else if ( opstate == FARMOP_STATE.INIT ) {
			gui.setCursor('farm_init');
		}
		else if ( opstate == FARMOP_STATE.GET ) {
			gui.setCursor('farm_get');
		}
		else if ( opstate == FARMOP_STATE.PREGET ) {
			gui.setCursor('farm_preget');
		}
		else if ( opstate == FARMOP_STATE.INPUT ) {
			var pipresid = _lc_.m_model.getPipResid();
			if ( pipresid > 0 ) gui.setCursor('farm_pip_'+pipresid);
		}
	};
	
	var _setSelOpBLinkBtn = function(opstate){
		if ( opstate == FARMOP_STATE.SEL ){
			//_lc_.m_view.getCtrl('selopblink').stop();
		}
		else{
			//_lc_.m_view.getCtrl('selopblink').start(-1);
		}
	};
	
	var _sendSimulateGetResNumPkg = function(blockid){
		var svrcmd = {cmd:NETCMD.FARM,farmgets:{nums:[{id:blockid,num:0}]}};
		m_g.sendEvent({eid:EVT.NET, sid:NETCMD.FARM, data:svrcmd});
	};
	
	_lc_._blockIdFromIdx = function(idx) {
		return idx + 1;
	};
	
	_lc_._getFarmFromSvr = function(roleId){
		roleId = roleId ? roleId : m_g.getImgr().getRoleId();
		var curFarm = _lc_.m_model.getCurFarm();
		var isCurFarmRoleId = (curFarm.role.uid == roleId);
		var farmVer = isCurFarmRoleId ? curFarm.ver : -1;
		
		FarmSender.sendGetFarm(farmVer, roleId);
	};
	
	//FarmPresenter-testunit-end
});

FarmView = CommMapPanel.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var C_BLOCK_W = 100;
	var C_BLOCK_H = 54;
	
	_lc_.C_MAINTOOLBAR_W = 442;
	_lc_.C_MAINBTNBAR_H = 50 - 18;
	_lc_.C_MAINTOOLBAR_H = 70;
	_lc_.C_SECTOOLBAR_W = 240;
	_lc_.C_SECTOOLBAR_H = 50;
	
	_lc_.m_g=null;
	var m_this=null;
	var m_model=null;
	var m_isFirstOpen = true;
	this.items = null;
	this.init = function(g, dom){
		_lc_.m_g = g;
		m_this = this;
		this.Super.init(g, dom);
		_create();
		this.hide();
	};
	
	this.getCtrl = function(key){
		return this.items[key];
	};
	
	this.setModel = function(model){
		m_model = model;
	};
	
	this.open = function(){
		this.show();
		this._initViewPortWhenFirstOpen();
		this.loadMap(FIXID.FARMMAP, rstr.farm.myfarm);
		_lc_.m_g.getImgr().setCurLoadCity(FIXID.FARMMAP);
		this.resetSMapCaller();
		_showFarmOpToolBar();
		_setOpBtnsVisible();
		_refreshTitle();
		_showBlocks();
		HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
		UIM.closeMainCityDlgs();
		UIM.closeStateCityDlgs();
	};
	
	this._initViewPortWhenFirstOpen = function(){
		if ( m_isFirstOpen ) {
			m_isFirstOpen = false;
			var center = {x:995, y:690};
			var size = _lc_.m_g.getWinSizer().getValidClientSize();
			var x = Math.max(0, (center.x - size.cx/2));
			var y = Math.max(0, (center.y - size.cy/2));
			this.setLastViewport({x:x, y:y});
		}
	};
	
	this.hide = function(){
		this.Super.hide();
		_hideFarmOpToolBar();
	};	
	
	this.refreshTitle = function() {
		_refreshTitle();
	};
	
	this.refreshPopu = function() {
		if (  m_model.isMyCurFarm() ) {
			TQ.setText(m_this.items.freepopu, _lc_.m_g.getImgr().getIdlePopu());
		}
	};
	
	this.refreshFarm = function() {
		_refreshTitle();
		_setOpBtnsVisible();
		_showBlocks();
		HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
	};
	
	this.popGetResNum = function(nums) {
		for ( var i=0; i<nums.length; ++i ){
			var item = nums[i];
			var blockidx = _getIdxFromId(item.id);
			_createNumberEffect(m_this.items.buildblocks.getBlock(blockidx), item.num);
		}	
	};
	
	this.getMainToolBarSize = function(){
		return {cx:_lc_.C_MAINTOOLBAR_W, cy:_lc_.C_MAINTOOLBAR_H};
	};
	
	this.getSecToolBarSize = function(){
		return {cx:_lc_.C_SECTOOLBAR_W, cy:_lc_.C_SECTOOLBAR_H};
	};
	
	this.setMainToolBarPos = function(pos){
		TQ.setDomPos(m_this.items.opbtnbar, pos.x, pos.y);
		TQ.setDomPos(m_this.items.roleinfobar, pos.x, pos.y+_lc_.C_MAINBTNBAR_H);
	};
	
	this.setSecToolBarPos = function(pos){
		TQ.setDomPos(m_this.items.infohelpbar, pos.x, pos.y);
	};	
	
	this.getFirstBlock = function(){
		if ( !this.isShow() ) return null;
		var cnt = this.items.buildblocks.getShowBlocks();
		if ( cnt == 0 ) return null;
		return this.items.buildblocks.getBlock(0);
	};
	
	this.getEmptyBlock = function(){
		if ( !this.isShow() ) return null;
		var cnt = this.items.buildblocks.getShowBlocks();
		for ( var i=0; i<cnt; ++i ){
			var block = this.items.buildblocks.getBlock(i);
			var item = block.getItem();
			if ( item.empty ) return block;
		}
		return null;
	};
	
	this.getBuildblocks = function(){
		return this.items.buildblocks;
	};
	
	var _create = function(){
		if ( m_this.items ){
			return;
		}
		
		m_this.create();
		m_this.items = m_this.getItems();
		_createOpToolBars();
		_createBlocks();
		_createResIconTag();
	};

	var _onViewportChange = function(viewport){
		m_this.items.buildblocks.setViewPos(viewport.x, viewport.y);
	};
	
	var _showFarmOpToolBar = function() {
		var bpanel = UIM.getPanel('briefres');
		if ( bpanel ) bpanel.hide();
		
		var mpanel = UIM.getPanel('main');
		if ( mpanel ) mpanel.getToolbar().hide();
	};
	
	var _hideFarmOpToolBar = function() {
		var bpanel = UIM.getPanel('briefres');
		if ( bpanel ) bpanel.show();
		
		var mpanel = UIM.getPanel('main');
		if ( mpanel ) mpanel.getToolbar().show();
	};
	
	var _createOpToolBars = function(){
		TQ.appendClass(m_this.items.gamemap, 'farmpanel');
		var tmps = uicfg.farm.maindlg.t_;
		for ( var i=0; i<tmps.length; ++i ) {
			_lc_.m_g.getGUI().buildDomItems(m_this.items.gamemap, tmps[i], null, m_this.items);
		}
	};
	
	var _createBlocks = function(){
		for ( var i=0; i<res_farm_block_poss.length; ++i ) {
			var p = res_farm_block_poss[i];
			p.x += 260;
			p.y += 320;
		}
		
		m_this.items.buildblocks = BuildBlocks.snew(_lc_.m_g, 
			{
			 map:m_this.items.mapscene,
			 mousemap:m_this.items.mousemap,
			 blockclass:FarmBuildBlock,
			 poss:res_farm_block_poss, 
			 blockw:C_BLOCK_W, 
			 blockh:C_BLOCK_H,
			 clickcaller:null,
			 tipcaller:null},
			 'rhombus' );
		m_this.items.buildblocks.hideAllBlock();
		m_this.setViewportCaller({self:m_this, caller:_onViewportChange});
	};
	
	var _createResIconTag = function() {
		var tagmaps = [
				{tag:'foodtag', resid:FIXID.FOOD}
				,{tag:'woodtag', resid:FIXID.WOOD}
				,{tag:'stonetag', resid:FIXID.STONE}
				,{tag:'irontag', resid:FIXID.IRON}
			];
		for ( var i=0; i<tagmaps.length; ++i ) {
			var t = tagmaps[i];
			var res = ItemResUtil.findItemres(t.resid);
			IMG.setBKImage(m_this.items[t.tag], IMG.makeSmallImg(res.smallpic));
		}
	};
	
	var _setOpBtnsVisible = function(){
		if ( !m_this.isShow() ) return;
		var tags = [{name:'opgetother', ismyfarm:false}, 
			{name:'opallother', ismyfarm:false},
			{name:'opinput', ismyfarm:true},
			{name:'opinit', ismyfarm:true},
			{name:'opget', ismyfarm:true},
			{name:'oppre', ismyfarm:true},
			{name:'opall', ismyfarm:true} ];
		for ( var i=0; i<tags.length; ++i ) {
			t = tags[i];
			var dom = m_this.items[t.name].getParent();
			TQ.setCSS(dom, 'display', (t.ismyfarm == m_model.isMyCurFarm()) ? 'block' : 'none' );
		}
	};
	
	var _refreshTitle = function() {
		if ( !m_this.isShow() ) return;
		
		var curphy = _lc_.m_g.getImgr().getRoleAttrVal(ATTR.PS);
		TQ.setText(m_this.items.rolephy, curphy);
		
		var smallmaptitle = rstr.farm.myfarm;
		if (  m_model.isMyCurFarm() ) {
			TQ.setText(m_this.items.freepopu, _lc_.m_g.getImgr().getIdlePopu());
			var usedblocks = m_model.getBlockCount(FIXID.FARM) 
				+ m_model.getBlockCount(FIXID.TIMBERYARD)
				+ m_model.getBlockCount(FIXID.QUARRY)
				+ m_model.getBlockCount(FIXID.IRONORE);
			TQ.setText(m_this.items.blockcnt, usedblocks+'/'+m_model.getTotalBlockCount());
			TQ.setText(m_this.items.foodcnt, m_model.getBlockCount(FIXID.FARM) );
			TQ.setText(m_this.items.woodcnt, m_model.getBlockCount(FIXID.TIMBERYARD) );
			TQ.setText(m_this.items.stonecnt, m_model.getBlockCount(FIXID.QUARRY) );
			TQ.setText(m_this.items.ironcnt, m_model.getBlockCount(FIXID.IRONORE) );
		}
		else {
			var curfarm = m_model.getCurFarm();
			smallmaptitle = TQ.format(rstr.farm.whofarm, curfarm.role.name);
		}
		
		UIM.getPanel('smallmap').setTitle(smallmaptitle);
		TQ.setCSS(m_this.items.otherinfo, 'display',  m_model.isMyCurFarm() ? 'block' : 'none' );	
	};
	
	var _showBlocks = function(){
		if ( !m_this.isShow() ) return;
		var oldshowcnt = m_this.items.buildblocks.getShowBlocks();
		var curfarm = m_model.getCurFarm();
		for ( var i=0; i<curfarm.blocks.length; ++i ){
			var item = curfarm.blocks[i];
			item.empty = (item.resid == FIXID.EMPTYFARMBLOCK);
			item.next = (item.resid == FIXID.NEXTFARMBLOCK);
			var block = m_this.items.buildblocks.getBlock(_getIdxFromId(item.id));
			block.setItem(item);
			block.show();
		}
		
		for ( var i=curfarm.blocks.length; i<oldshowcnt; ++i ) {
			var block = m_this.items.buildblocks.getBlock(i);
			block.hide();
		}
	};
	
	var _createNumberEffect = function(block, num){
		var item = block.getItem();
		if ( !item ) return;
		var orect = block.getORect();
		var effect = _lc_.m_g.getEntityfactory().allocNumEffect(m_this.items.mapscene);
		var x = orect.x + orect.w / 2 - 40;
		var y = orect.y + orect.h / 2;
		effect.setSize({cx:180, cy:20});
		effect.setPos({x:x,y:y});
		effect.setZOrder(80000);
		effect.getEntity().setClass('upfarmresnum');
		effect.getBakEntity().setClass('upfarmresnumback');
		effect.setNumber(item.itemres.outputname+'+'+num);
		effect.start();
		EUPD.appendEffect(effect, _lc_.m_g.getEntityfactory().freeNumEffect);
	};	
	
	var _getIdxFromId = function(id) {
		return (id - 1);
	};
	//FarmView-testunit-end
});