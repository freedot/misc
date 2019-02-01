/*******************************************************************************/
InBuildPanel = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.C_POSS = [ { x: 1068+217-1, y: 581-55+1 },// 帅府
	  { x: 361 + 507, y: 1174+90},// 城墙
	  
	  
	  { x: 940, y: 650  },
	  { x: 1067, y: 710 },
	  { x: 1194, y: 770 },
	  { x: 1333, y: 836 },
	  { x: 1482, y: 905 },
	  { x: 1232, y: 908 },
	  { x: 1366, y: 974 },
	  
	  { x: 583, y: 831 },
	  { x: 690, y: 775 },
	  { x: 785, y: 722 },
	  { x: 816, y: 828 },
	  { x: 912, y: 775 },
	  { x: 940, y: 889 },
	  { x: 1033, y: 833 },
	  
	  { x: 534, y: 1015 },
	  { x: 649, y: 1073 },
	  { x: 782, y: 1115 },
	  { x: 658, y: 958 },
	  { x: 786, y: 1018 },
	  { x: 909, y: 1072 },
	  { x: 1033, y: 1015 },
	  
	  { x: 112, y: 581 },
	  { x: 259, y: 567 },
	  { x: 153, y: 676 },
	  { x: 285, y: 676 },
	  { x: 124, y: 761 },
	  { x: 300, y: 756 },
	  { x: 215, y: 819 }
	  ];
  
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_commBuildPanel = null;
	_lc_.m_cityId = 0;
	
	this.init = function(g, dom){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_cityId = BUILDCITY_ID.MAIN;
		
		for ( var i=0; i<_lc_.C_POSS.length; ++i ) {
			p = _lc_.C_POSS[i];
			p.x += 106;
			p.y += 154;
		}
		
		var params = {cityResId:FIXID.MAINCITY, mapTitle:rstr.citylist.maincity, canUseBlockCnt:_lc_.C_POSS.length, blockPoss:_lc_.C_POSS, cityId:_lc_.m_cityId};
		_lc_.m_commBuildPanel = CommBuildPanel.snew(g, dom, params);
		
		var size = _lc_.m_g.getWinSizer().getValidClientSize();
		var x = Math.max(0, 1200 - size.cx);
		_lc_.m_commBuildPanel.setFirstPos({x:x, y:430});
		
		_lc_.m_g.regEvent(EVT.LOGIN_OK, 0, _lc_.m_this, _lc_._onLoginOk);
		_lc_.m_g.regEvent(EVT.SETCITYLEVEL, 0, _lc_.m_this, _lc_._onSetCityLevel);
		_lc_.m_g.regEvent(EVT.NET, NETCMD.BUILDRES, _lc_.m_this, _lc_._onSvrPkg);
	};
	
	this.open = function(){
		_lc_.m_commBuildPanel.open();
		_lc_.m_commBuildPanel.setBlocksCanUseCnt( _lc_._getBlocksCanUseCnt() );
		SoundMgr.playBackSound(res_baksounds.mainCity);
	};
	
	this.hide = function(){
		_lc_.m_commBuildPanel.hide();
	};
	
	this.setViewPos = function(pos){
		_lc_.m_commBuildPanel.setViewportPos(pos);
	};
	
	this.getViewPos = function(){
		return _lc_.m_commBuildPanel.getViewport();
	};
	
	this.opSpeed = function(item){
		_lc_.m_commBuildPanel.opSpeed(item);
	};
	
	this.opCancel = function(item){
		_lc_.m_commBuildPanel.opCancel(item);
	};	
	
	this.resize = function(size){
		_lc_.m_commBuildPanel.resize(size);
	};
	
	this.setActive = function(isActive){
		_lc_.m_commBuildPanel.setActive(isActive);
	};
	
	this.isActive = function(){
		return _lc_.m_commBuildPanel.isActive();
	};
	
	this.resetViewPos = function(){
		_lc_.m_commBuildPanel.resetViewPos();
	};
	
	this.getItems = function(){
		return _lc_.m_commBuildPanel.getItems();
	};
	
	this.getCityType = function(){
		return CITY_TYPE.MAIN;
	};
	
	this.getFirstFreeBlock = function(){
		var buildBlocks = _lc_.m_commBuildPanel.getBuildBlocks();
		for ( var i=0; buildBlocks.getCanUseBlockCnt(); ++i ) {
			var block = buildBlocks.getBlock(i);
			if ( !block.getItem() ) return block;
		}
		return NullInBuildBlock;
	};
	
	this.getBlocksByResId = function(spec){
		var blocks = [];
		var buildBlocks = _lc_.m_commBuildPanel.getBuildBlocks();
		for ( var i=0; i<buildBlocks.getCanUseBlockCnt(); ++i ) {
			var block = buildBlocks.getBlock(i);
			if ( !block || !block.getItem() ) continue;
			if ( spec.isSatisfiedBy( block.getItem() ) ) blocks.push(block);
		}
		return blocks;
	};
	
	_lc_._onLoginOk = function(){
		CityBuildSender.sendGetAllBuilds(_lc_.m_g, _lc_.m_cityId);
	};
	
	_lc_._onSetCityLevel = function(){
		_lc_.m_commBuildPanel.setBlocksCanUseCnt( _lc_._getBlocksCanUseCnt() );
	};
	
	_lc_._onSvrPkg = function(netEvent){
		var netdata = netEvent.data;
		if ( netdata.cityTypes ){
			TQ.dictCopy(_lc_.m_g.getImgr().getCityTypes(), netdata.cityTypes);
			_lc_.m_g.sendEvent({eid:EVT.CITYTYPES,sid:0});
		}
		
		if ( netdata.builds && netdata.builds.cityId == _lc_.m_cityId ){
			_lc_.m_commBuildPanel.handleSvrBuildsData(netdata.builds.list);
			HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
		}
		
		if ( netdata.openMainCity ) {
			_lc_.m_commBuildPanel.open();
			SoundMgr.playBackSound(res_baksounds.mainCity);
			g_loading.hide();
			_lc_.m_g.setState(GSTATE.INGAME);
			UIM.getDlg('newcomerhelper').handleCaches();
			HelpGuider.enterGame(_lc_.m_g);
		}
	};
	
	_lc_._getBlocksCanUseCnt = function(){
		var cityLevel = _lc_.m_g.getImgr().getCityLevel();
		return CityLevelUtil.getBlocksCntByCityLevel(cityLevel);
	};
	//InBuildPanel-unittest-end
});
