/*******************************************************************************/
SubBuildPanel = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_commBuildPanel = null;
	_lc_.m_cityId = 0;
	
	this.init = function(g, dom, params){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_cityId = params.cityId;
		_lc_.m_commBuildPanel = CommBuildPanel.snew(g, dom, params);
		_lc_.m_g.regEvent(EVT.NET, NETCMD.BUILDRES, _lc_.m_this, _lc_._onSvrPkg);
	};
	
	this.open = function(){
		_lc_.m_commBuildPanel.open();
	};
	
	this.hide = function(){
		_lc_.m_commBuildPanel.hide();
	};
	
	this.destroy = function(){
		this.hide();
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
	
	_lc_._onSvrPkg = function(netEvent){
		var netdata = netEvent.data;
		if ( netdata.builds && netdata.builds.cityId == _lc_.m_cityId ){
			_lc_.m_commBuildPanel.handleSvrBuildsData(netdata.builds.list);
		}
	};	

	this._setPossOffset = function(offx, offy){
		for ( var i=0; i<this.C_POSS.length; ++i ) {
			var p = this.C_POSS[i];
			p.x += offx;
			p.y += offy;
		}
	};

	//SubBuildPanel-unittest-end
});

ResSubBuildPanel = SubBuildPanel.extern(function(){
	this.C_POSS = [
		{ x: 684+7+9, y: 403+77},
		{ x: 303, y: 415 },
		{ x: 413, y: 345 },
		{ x: 538, y: 277 },
		{ x: 656, y: 238 },
		{ x: 808, y: 272 },
		{ x: 948, y: 348 },
		{ x: 1075, y: 414},
		{ x: 959, y: 485 },
		{ x: 832, y: 558 },
		{ x: 703, y: 634 },
		{ x: 573, y: 558 },
		{ x: 422, y: 490 }
	  ];
	  
	this.init = function(g, dom, cityId){
		this._setPossOffset(304, 318);
		var params = {cityResId:FIXID.SUBRESCITY, mapTitle:rstr.citylist.subcity, canUseBlockCnt:this.C_POSS.length, blockPoss:this.C_POSS, cityId:cityId};
		this.Super.init(g, dom, params);
	};
	
	this.getCityType = function(){
		return CITY_TYPE.SUBRES;
	};
});

MilitarySubBuildPanel = SubBuildPanel.extern(function(){
	this.C_POSS = [
		{ x: 684+5, y: 403+73},
		{ x: 303, y: 415 },
		{ x: 413, y: 345 },
		{ x: 538, y: 277 },
		{ x: 656, y: 238 },
		{ x: 808, y: 272 },
		{ x: 948, y: 348 },
		{ x: 1075, y: 414},
		{ x: 959, y: 485 },
		{ x: 832, y: 558 },
		{ x: 703, y: 634 },
		{ x: 573, y: 558 },
		{ x: 422, y: 490 }
		];
	  
	this.init = function(g, dom, cityId){
		this._setPossOffset(304, 318);
		var params = {cityResId:FIXID.SUBARMYCITY, mapTitle:rstr.citylist.subcity, canUseBlockCnt:this.C_POSS.length, blockPoss:this.C_POSS, cityId:cityId};
		this.Super.init(g, dom, params);
	};
	
	this.getCityType = function(){
		return CITY_TYPE.SUBARMY;
	};
});
