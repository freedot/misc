/*******************************************************************************/
CommBuildPanel = CommMapPanel.extern(function(){
	//CommBuildPanel-unittest-start
	var C_BLOCK_W = 100;
	var C_BLOCK_H = 54;
	
	var m_g = null;
	var m_this = null;
	var m_isCreated = false;
	var m_params = null;
	var m_items = {};
	var m_buildBlocks = NullBuildBlocks;
	var m_opMenuHdr = null;
	var m_isFirstOpen = true;
	var m_firstPos = {x:184, y:206};
	
	var m_modifyFlag = true;
	var m_cityId = 0;
	
	this.init = function(g, dom, params){
		m_g = g;
		m_this = this;
		m_params = params;
		m_cityId = params.cityId;
		this.Super.init(m_g, dom);
		
		var size = m_g.getWinSizer().getValidClientSize();
		var mapSize = {cx:2048, cy:1536};//m_g.getWinSizer().getMaxClientSize();
		var x = Math.max(0, (mapSize.cx - size.cx)/2);
		var y = Math.max(0, (mapSize.cy - size.cy)/2);
		this.setFirstPos({x:x, y:y});
		
		this.hide();
	};
	
	this.setFirstPos = function(firstPos){
		m_firstPos = firstPos;
	};
	
	this.open = function(){
		if (m_isFirstOpen){
			_firstOpen();
		}
		else {
			_open();
		}
	};
	
	this.hide = function(){
		m_g.unregUpdater(m_this, _onUpdate);
		this.Super.hide();
	};
	
	this.opSpeed = function(item){
		m_opMenuHdr.opSpeed(item);
	};
	
	this.opCancel = function(item){
		m_opMenuHdr.opCancel(item);
	};
	
	this.setBlocksCanUseCnt = function(canUseBlockCnt){
		_setBlocksCanUseCnt(canUseBlockCnt);
	};
	
	this.handleSvrBuildsData = function(netBuilds){
		_setModify(true);
		var builds = m_g.getImgr().getBuildsByCityId(m_cityId);
		var oldState = _getCurSelBlockState();
		TQ.dictCopy(builds, netBuilds);
		ItemResUtil.initItemsres(builds);
		_addCityIdToBuilds(builds);
		_setBuildsContent();
		if ( _isNeedResetOpMenu(oldState) ){
			m_opMenuHdr.resetOpMenuItemsShow();
		}
		_update();
	};
	
	this.getBuildBlocks = function(){
		return m_buildBlocks;
	};
	
	var _firstOpen = function(){
		UIM.closeMapPanels();
		m_this.setLastViewport(m_firstPos);
		_open();
		m_buildBlocks.setViewPos(m_firstPos.x, m_firstPos.y);
		m_isFirstOpen = false;
	};
	
	var _open = function(){
		m_this.show();
		_firstCreate();
		m_this.loadMap(m_params.cityResId, m_params.mapTitle);
		m_g.regUpdater(m_this, _onUpdate, 1000);
		_setBuildsContent();
		m_g.getImgr().setCurLoadCity(m_params.cityResId);
		UIM.getPanel('main').getSubCityBtnsBar().setCurSubCityId(m_cityId);
		m_this.resetSMapCaller();	
	};
	
	var _setModify = function(flag){
		m_modifyFlag = flag;
	};
	
	var _getCurSelBlockState = function(){
		var b = m_buildBlocks.getCurBlock();
		if (!b) {
			return -1;
		}
		
		var item = b.getItem();
		if (!item) {
			return -1;
		}
		
		return item.state;		
	};
	
	var _addCityIdToBuilds = function(builds){
		for ( var i=0; i<builds.length; ++i ) {
			builds[i].cityId = m_cityId;
		}
	};
	
	var _isNeedResetOpMenu = function(lastState){
		if ( !m_isCreated ) return false;
		if ( !m_this.isShow() ) return false;
		if ( !m_opMenuHdr.isShow() ) return false;
		
		return _getCurSelBlockState() != lastState;
	};
	
	var _firstCreate = function(){
		if ( m_isCreated ) return;
		m_this.create();
		
		m_this.setViewportCaller({self:m_this, caller:_onViewportChange});
		_createBuildBlocks();
		_setBlocksCanUseCnt(m_params.canUseBlockCnt);
		_createOpMenuHdr();
		m_isCreated = true;
	};	
	
	var _createBuildBlocks = function(){
		m_items = m_this.getItems();
		m_buildBlocks = BuildBlocks.snew(m_g, {
			 map:m_items.mapscene,
			 mousemap:m_items.mousemap,
			 blockclass:InBuildBlock,
			 poss:m_params.blockPoss,
			 blockw:C_BLOCK_W, 
			 blockh:C_BLOCK_H,
			 clickcaller:{self:m_this, caller:_onClickBlock},
			 tipcaller:{self:m_this, caller:_onGetBlockTooltip}
			 });	
	};
	
	var _setBlocksCanUseCnt = function(canUseBlockCnt){
		m_buildBlocks.setCanUseBlockCnt( canUseBlockCnt );
	};

	var _createOpMenuHdr = function(){
		m_opMenuHdr = BuildsOpHdr.snew(m_g, m_buildBlocks);
		m_opMenuHdr.createOpMenu();
	};	
	
	var _setBuildsContent = function(){
		if ( !m_isCreated ) return;
		if ( !m_this.isShow() ) return;
		if ( !m_modifyFlag ) return;
		
		_clearBlocks();
		_setNewBuildBlocks();
		m_modifyFlag = false;
	};

	var _clearBlocks = function(){
		for ( var i=0; i<m_buildBlocks.getCount(); ++i ){
			m_buildBlocks.getBlock(i).setItem(null);
		}
	};
	
	var _setNewBuildBlocks = function(){
		var builds = m_g.getImgr().getBuildsByCityId(m_cityId);
		for ( var i=0; i<builds.length; ++i ){
			var build = builds[i];
			m_buildBlocks.getBlock(_getIdxFromId(build.id)).setItem(build);
		}
	};
	
	var _onViewportChange = function(viewport){
		m_buildBlocks.setViewPos(viewport.x, viewport.y);
	};
	
	var _onClickBlock = function(e, idx){
		if ( m_this.isDragged(e) || !_isEnableBlock(idx) ) {
			m_g.getGUI().hideAllMenu();
			return;
		}
		
		if ( _isEmptyBlock(idx) ){
			_openSelBuildDlg(idx);
		}
		else{
			_showOpMenu( TQ.mouseCoords(e) );
		}
	};
	
	var _isEnableBlock = function(idx){
		return idx >= 0 && idx < m_buildBlocks.getCanUseBlockCnt();
	};
	
	var _isEmptyBlock = function(idx){
		return m_buildBlocks.getBlock(idx).getItem() == null;
	};
	
	var _openSelBuildDlg = function(blockIdx){
		var dlg = _getSelBuildDlgByCityId();
		dlg.openDlg(m_cityId);
		dlg.setCaller({self:m_this, caller:_onSelectOneBuild});
	};
	
	var _getSelBuildDlgByCityId = function(){
		var typeMapDlgs = {};
		typeMapDlgs[CITY_TYPE.MAIN] = 'mainselbuild';
		typeMapDlgs[CITY_TYPE.SUBRES] = 'resselbuild';
		typeMapDlgs[CITY_TYPE.SUBARMY] = 'militaryselbuild';
		
		var cityType = m_g.getImgr().getCityTypeByCityId(m_cityId);
		return UIM.getDlg ( typeMapDlgs[cityType] );
	};
	
	var _showOpMenu = function(pos){
		m_opMenuHdr.resetOpMenuItemsShow();
		m_opMenuHdr.show(pos);
		m_opMenuHdr.updateOpMenuItem();		
	};
	
	var _onGetBlockTooltip = function(data){// 建筑物或空地
		if ( !_isEnableBlock(data.idx) ) {
			var citylevel = CityLevelUtil.getCityLevelByCanUseBlockIdx(data.idx);
			var levelname = RStrUtil.getCityNameByLevel(citylevel);
			return TQ.formatLine(TQ.format(rstr.inbuild.panel.tips.disableblock, levelname));
		}
		
		if ( _isEmptyBlock(data.idx) ) {
			return TQ.formatLine(rstr.inbuild.panel.tips.eblock);
		}
		
		var item = m_buildBlocks.getBlock(data.idx).getItem();
		return TIPM.getBuildDesc(m_cityId, 'build', item);
	};	
	
	var _onSelectOneBuild = function(resid){
		var blockId = _getIdFromIdx(m_buildBlocks.getCurSel());
		CityBuildSender.sendAddBuild(m_g, m_cityId, blockId, resid);
	};

	var _onUpdate = function(cltTimeMs){
		_update();
	};
	
	var _update = function(){
		if ( !m_isCreated ) return false;
		if ( !m_this.isShow() ) return false;
		
		_onUpdateBuildTime();
		m_opMenuHdr.updateOpMenuItem();
	};
	
	var _onUpdateBuildTime = function(){
		var svrTime = m_g.getSvrTimeS();
		for ( var i=0; i<m_buildBlocks.getCount(); ++i ){
			var block = m_buildBlocks.getBlock(i);
			var item = block.getItem();
			if (!item || item.state == 0) continue;
			
			var leftTime =  Math.max(0, item.stoptime - svrTime);
			block.setTime( TQ.formatTime(0, leftTime) );
		}
	};	
	
	var _getIdFromIdx = function(idx){
		return idx+1;
	};
	
	var _getIdxFromId = function(id){
		return id-1;
	};
	//CommBuildPanel-unittest-end
});
