/*******************************************************************************/
CommBuildPanel = CommMapPanel.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var C_BLOCK_W = 100;
	var C_BLOCK_H = 54;
	
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_isCreated = false;
	_lc_.m_params = null;
	_lc_.m_items = {};
	_lc_.m_buildBlocks = NullBuildBlocks;
	_lc_.m_opMenuHdr = null;
	_lc_.m_isFirstOpen = true;
	_lc_.m_firstPos = {x:184, y:206};
	
	_lc_.m_modifyFlag = true;
	_lc_.m_cityId = 0;
	
	this.init = function(g, dom, params){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_params = params;
		_lc_.m_cityId = params.cityId;
		this.Super.init(_lc_.m_g, dom);
		
		var size = _lc_.m_g.getWinSizer().getValidClientSize();
		var mapSize = {cx:2048, cy:1536};//_lc_.m_g.getWinSizer().getMaxClientSize();
		var x = Math.max(0, (mapSize.cx - size.cx)/2);
		var y = Math.max(0, (mapSize.cy - size.cy)/2);
		this.setFirstPos({x:x, y:y});
		
		this.hide();
	};
	
	this.setFirstPos = function(firstPos){
		_lc_.m_firstPos = firstPos;
	};
	
	this.open = function(){
		if (_lc_.m_isFirstOpen){
			_lc_._firstOpen();
		}
		else {
			_lc_._open();
		}
	};
	
	this.hide = function(){
		_lc_.m_g.unregUpdater(_lc_.m_this, _lc_._onUpdate);
		this.Super.hide();
	};
	
	this.opSpeed = function(item){
		_lc_.m_opMenuHdr.opSpeed(item);
	};
	
	this.opCancel = function(item){
		_lc_.m_opMenuHdr.opCancel(item);
	};
	
	this.setBlocksCanUseCnt = function(canUseBlockCnt){
		_lc_._setBlocksCanUseCnt(canUseBlockCnt);
	};
	
	this.handleSvrBuildsData = function(netBuilds){
		_lc_._setModify(true);
		var builds = _lc_.m_g.getImgr().getBuildsByCityId(_lc_.m_cityId);
		var oldState = _lc_._getCurSelBlockState();
		TQ.dictCopy(builds, netBuilds);
		ItemResUtil.initItemsres(builds);
		_lc_._addCityIdToBuilds(builds);
		_lc_._setBuildsContent();
		if ( _lc_._isNeedResetOpMenu(oldState) ){
			_lc_.m_opMenuHdr.resetOpMenuItemsShow();
		}
		_lc_._update();
	};
	
	this.getBuildBlocks = function(){
		return _lc_.m_buildBlocks;
	};
	
	_lc_._firstOpen = function(){
		UIM.closeMapPanels();
		_lc_.m_this.setLastViewport(_lc_.m_firstPos);
		_lc_._open();
		_lc_.m_buildBlocks.setViewPos(_lc_.m_firstPos.x, _lc_.m_firstPos.y);
		_lc_.m_isFirstOpen = false;
	};
	
	_lc_._open = function(){
		_lc_.m_this.show();
		_lc_._firstCreate();
		_lc_.m_this.loadMap(_lc_.m_params.cityResId, _lc_.m_params.mapTitle);
		_lc_.m_g.regUpdater(_lc_.m_this, _lc_._onUpdate, 1000);
		_lc_._setBuildsContent();
		_lc_.m_g.getImgr().setCurLoadCity(_lc_.m_params.cityResId);
		UIM.getPanel('main').getSubCityBtnsBar().setCurSubCityId(_lc_.m_cityId);
		_lc_.m_this.resetSMapCaller();	
	};
	
	_lc_._setModify = function(flag){
		_lc_.m_modifyFlag = flag;
	};
	
	_lc_._getCurSelBlockState = function(){
		var b = _lc_.m_buildBlocks.getCurBlock();
		if (!b) {
			return -1;
		}
		
		var item = b.getItem();
		if (!item) {
			return -1;
		}
		
		return item.state;		
	};
	
	_lc_._addCityIdToBuilds = function(builds){
		for ( var i=0; i<builds.length; ++i ) {
			builds[i].cityId = _lc_.m_cityId;
		}
	};
	
	_lc_._isNeedResetOpMenu = function(lastState){
		if ( !_lc_.m_isCreated ) return false;
		if ( !_lc_.m_this.isShow() ) return false;
		if ( !_lc_.m_opMenuHdr.isShow() ) return false;
		
		return _lc_._getCurSelBlockState() != lastState;
	};
	
	_lc_._firstCreate = function(){
		if ( _lc_.m_isCreated ) return;
		_lc_.m_this.create();
		
		_lc_.m_this.setViewportCaller({self:_lc_.m_this, caller:_lc_._onViewportChange});
		_lc_._createBuildBlocks();
		_lc_._setBlocksCanUseCnt(_lc_.m_params.canUseBlockCnt);
		_lc_._createOpMenuHdr();
		_lc_.m_isCreated = true;
	};	
	
	_lc_._createBuildBlocks = function(){
		_lc_.m_items = _lc_.m_this.getItems();
		_lc_.m_buildBlocks = BuildBlocks.snew(_lc_.m_g, {
			 map:_lc_.m_items.mapscene,
			 mousemap:_lc_.m_items.mousemap,
			 blockclass:InBuildBlock,
			 poss:_lc_.m_params.blockPoss,
			 blockw:C_BLOCK_W, 
			 blockh:C_BLOCK_H,
			 clickcaller:{self:_lc_.m_this, caller:_lc_._onClickBlock},
			 tipcaller:{self:_lc_.m_this, caller:_lc_._onGetBlockTooltip}
			 });	
	};
	
	_lc_._setBlocksCanUseCnt = function(canUseBlockCnt){
		_lc_.m_buildBlocks.setCanUseBlockCnt( canUseBlockCnt );
	};

	_lc_._createOpMenuHdr = function(){
		_lc_.m_opMenuHdr = BuildsOpHdr.snew(_lc_.m_g, _lc_.m_buildBlocks);
		_lc_.m_opMenuHdr.createOpMenu();
	};	
	
	_lc_._setBuildsContent = function(){
		if ( !_lc_.m_isCreated ) return;
		if ( !_lc_.m_this.isShow() ) return;
		if ( !_lc_.m_modifyFlag ) return;
		
		_lc_._clearBlocks();
		_lc_._setNewBuildBlocks();
		_lc_.m_modifyFlag = false;
	};

	_lc_._clearBlocks = function(){
		for ( var i=0; i<_lc_.m_buildBlocks.getCount(); ++i ){
			_lc_.m_buildBlocks.getBlock(i).setItem(null);
		}
	};
	
	_lc_._setNewBuildBlocks = function(){
		var builds = _lc_.m_g.getImgr().getBuildsByCityId(_lc_.m_cityId);
		for ( var i=0; i<builds.length; ++i ){
			var build = builds[i];
			_lc_.m_buildBlocks.getBlock(_lc_._getIdxFromId(build.id)).setItem(build);
		}
	};
	
	_lc_._onViewportChange = function(viewport){
		_lc_.m_buildBlocks.setViewPos(viewport.x, viewport.y);
	};
	
	_lc_._onClickBlock = function(e, idx){
		if ( _lc_.m_this.isDragged(e) || !_lc_._isEnableBlock(idx) ) {
			_lc_.m_g.getGUI().hideAllMenu();
			return;
		}
		
		if ( _lc_._isEmptyBlock(idx) ){
			_lc_._openSelBuildDlg(idx);
		}
		else{
			_lc_._showOpMenu( TQ.mouseCoords(e) );
		}
	};
	
	_lc_._isEnableBlock = function(idx){
		return idx >= 0 && idx < _lc_.m_buildBlocks.getCanUseBlockCnt();
	};
	
	_lc_._isEmptyBlock = function(idx){
		return _lc_.m_buildBlocks.getBlock(idx).getItem() == null;
	};
	
	_lc_._openSelBuildDlg = function(blockIdx){
		var dlg = _lc_._getSelBuildDlgByCityId();
		dlg.openDlg(_lc_.m_cityId);
		dlg.setCaller({self:_lc_.m_this, caller:_lc_._onSelectOneBuild});
	};
	
	_lc_._getSelBuildDlgByCityId = function(){
		var typeMapDlgs = {};
		typeMapDlgs[CITY_TYPE.MAIN] = 'mainselbuild';
		typeMapDlgs[CITY_TYPE.SUBRES] = 'resselbuild';
		typeMapDlgs[CITY_TYPE.SUBARMY] = 'militaryselbuild';
		
		var cityType = _lc_.m_g.getImgr().getCityTypeByCityId(_lc_.m_cityId);
		return UIM.getDlg ( typeMapDlgs[cityType] );
	};
	
	_lc_._showOpMenu = function(pos){
		_lc_.m_opMenuHdr.resetOpMenuItemsShow();
		_lc_.m_opMenuHdr.show(pos);
		_lc_.m_opMenuHdr.updateOpMenuItem();		
	};
	
	_lc_._onGetBlockTooltip = function(data){// 建筑物或空地
		if ( !_lc_._isEnableBlock(data.idx) ) {
			var citylevel = CityLevelUtil.getCityLevelByCanUseBlockIdx(data.idx);
			var levelname = RStrUtil.getCityNameByLevel(citylevel);
			return TQ.formatLine(TQ.format(rstr.inbuild.panel.tips.disableblock, levelname));
		}
		
		if ( _lc_._isEmptyBlock(data.idx) ) {
			return TQ.formatLine(rstr.inbuild.panel.tips.eblock);
		}
		
		var item = _lc_.m_buildBlocks.getBlock(data.idx).getItem();
		return TIPM.getBuildDesc(_lc_.m_cityId, 'build', item);
	};	
	
	_lc_._onSelectOneBuild = function(resid){
		var blockId = _lc_._getIdFromIdx(_lc_.m_buildBlocks.getCurSel());
		CityBuildSender.sendAddBuild(_lc_.m_g, _lc_.m_cityId, blockId, resid);
	};

	_lc_._onUpdate = function(cltTimeMs){
		_lc_._update();
	};
	
	_lc_._update = function(){
		if ( !_lc_.m_isCreated ) return false;
		if ( !_lc_.m_this.isShow() ) return false;
		
		_lc_._onUpdateBuildTime();
		_lc_.m_opMenuHdr.updateOpMenuItem();
	};
	
	_lc_._onUpdateBuildTime = function(){
		var svrTime = _lc_.m_g.getSvrTimeS();
		for ( var i=0; i<_lc_.m_buildBlocks.getCount(); ++i ){
			var block = _lc_.m_buildBlocks.getBlock(i);
			var item = block.getItem();
			if (!item || item.state == 0) continue;
			
			var leftTime =  Math.max(0, item.stoptime - svrTime);
			block.setTime( TQ.formatTime(0, leftTime) );
		}
	};	
	
	_lc_._getIdFromIdx = function(idx){
		return idx+1;
	};
	
	_lc_._getIdxFromId = function(id){
		return id-1;
	};
	//CommBuildPanel-unittest-end
});
