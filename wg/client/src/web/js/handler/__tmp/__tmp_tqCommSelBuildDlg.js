/*******************************************************************************/
CityBuildUtil = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_cityBuildIds = {}; // cityType is key
		
	this.init = function(){
		_lc_.m_cityBuildIds[CITY_TYPE.MAIN] = [110002, 110003, 110004, 110005,
			110006, 110007, 110008, 110009, 110010, 110011,110012];
		_lc_.m_cityBuildIds[CITY_TYPE.SUBRES] = [110002,110013,110014,110015,110016,110017];
		_lc_.m_cityBuildIds[CITY_TYPE.SUBARMY] = [110006,110018,110019,110020,110021,110022];
	};
	
	this.initOneTime = function(g){
		_lc_.m_g = g;
	};
	
	this.isCanBuildInCity = function(cityId, buildResId) {
		var cityType = _lc_.m_g.getImgr().getCityTypeByCityId(cityId);
		var buildIds = _lc_.m_cityBuildIds[cityType];
		if (!buildIds) {
			return false;
		}
		
		return TQ.find(buildIds, null, buildResId) != null;
	};
	//CityBuildUtil-unittest-end
}).snew();

BaseCitySelBuildDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	_lc_.m_caller = null;
	_lc_.m_cityId = 0;
	_lc_.m_cfg = {ids:[], backImgClass:''};
	
	//------------
	//public:method
	//------------
	this.init = function(g){
		_lc_.m_g = g;
		this.g_ = g;
		_lc_.m_this = this;
		this.initCfg(_lc_.m_cfg);
		_lc_._initIds();
	};
	
	this.initCfg = function(cfg){
	};
	
	this.setCaller = function(caller){
		_lc_.m_caller = caller;
	};
	
	this.openDlg = function(cityId){
		_lc_._initParam(cityId);
		_lc_._initDlg();
		_lc_._openDlg();
		_lc_._initInfo();
	};
	
	this._onOpen = function(items) {
	};
	
	this._onClose = function(){
	};
	
	_lc_._initIds = function(){
		for ( var i=0; i<_lc_.m_cfg.ids.length; ++i ){
			var oneid = _lc_.m_cfg.ids[i];
			oneid.id = 0;
			oneid.level = 0;
			oneid.itemres = ItemResUtil.findItemres(oneid.resid);
			oneid.maxcnt = oneid.itemres.maxCount;
		}
	};
	
	_lc_._initParam = function(cityId){
		_lc_.m_cityId = cityId;
	};
	
	_lc_._initDlg = function(){
		if (_lc_.m_dlg) return;
		
		_lc_._createDlg();
		_lc_._setListItemCount();
		_lc_._setListItemsPos();
		_lc_._setListItemsName();
		_lc_._setCallers();
		_lc_._initTooltip();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:true, title:'', pos:{x:'center', y:50}, uiback:uiback.dlg.noborder });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.selCityBuildDlg, _lc_.m_items);
		TQ.setClass(_lc_.m_items.backImg, _lc_.m_cfg.backImgClass);
	};
	
	_lc_._setListItemCount = function(){
		_lc_.m_items.list.setItemCount(_lc_.m_cfg.ids.length);
	};
	
	_lc_._setListItemsPos = function(){
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i).item;
			TQ.setCSS(item, 'float', 'none');
			TQ.setCSS(item, 'position', 'absolute');
			TQ.setDomPos(item, _lc_.m_cfg.ids[i].pos.x, _lc_.m_cfg.ids[i].pos.y);
		}
	};
	
	_lc_._setListItemsName = function(){
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			TQ.setTextEx(item.exsubs.name, _lc_.m_cfg.ids[i].itemres.name);
		}
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.closeBtn.setCaller({self:_lc_.m_this, caller:_lc_._onCloseDlg});
		_lc_.m_items.list.setCaller({self:_lc_.m_this, caller:_lc_._onClickItem});
		_lc_.m_dlg.setCaller({self:_lc_.m_this,caller:_lc_._onDlgEvent});
	};
	
	_lc_._initTooltip = function(){
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			TTIP.setCallerData(item.exsubs.tooltips['$item'], {self:_lc_.m_this, caller:_lc_._onGetTooltip},{idx:i});
		}
	};
	
	_lc_._openDlg = function(){
		_lc_.m_dlg.show();
		_lc_.m_g.regUpdater(_lc_.m_this, _lc_._onUpdate, 3000);
	};
	
	_lc_._initInfo = function(){
		_lc_._updateInfo();
		_lc_.m_this._onOpen(_lc_.m_items);
	};
	
	_lc_._updateInfo = function(){
		if (!_lc_._isShow()) return;
		
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			_lc_._setListItem(_lc_.m_items.list.getItem(i), _lc_.m_cfg.ids[i]);
		}
	};
	
	_lc_._isShow = function(){
		if (!_lc_.m_dlg) return false;
		
		return _lc_.m_dlg.isShow();
	};
	
	_lc_._setListItem = function(item, resItem){
		_lc_._setListItemIcon(item, resItem);
		_lc_._setListItemBuildedCnt(item, resItem);
		_lc_._setListItemBuildedFlag(item, resItem);
	};
	
	_lc_._setListItemIcon = function(item, resItem) {
		var disableFlag = 'd';
		if ( _lc_._isFullBuildCount(resItem) || TIPM.isCanBuildUpgrade(_lc_.m_cityId, resItem) ) {
			disableFlag = null;
		}
		IMG.setBKImage(item.exsubs.icon, IMG.makeBigImg(resItem.itemres.bigpic, disableFlag));
	};
	
	_lc_._setListItemBuildedCnt = function(item, resItem) {
		if (_lc_._isFullBuildCount(resItem)) return;

		TQ.setCSS(item.exsubs.cnt, 'display', 'block');	
		TQ.setCSS(item.exsubs.flag, 'display', 'none');
		
		var buildedCnt = _lc_.m_g.getImgr().getBuildCntByResid(_lc_.m_cityId, resItem.resid);
		TQ.setText(item.exsubs.cnt, buildedCnt);
	};
	
	_lc_._setListItemBuildedFlag = function(item, resItem) {
		if (!_lc_._isFullBuildCount(resItem)) return;

		TQ.setCSS(item.exsubs.flag, 'display', 'block');
		TQ.setCSS(item.exsubs.cnt, 'display', 'none');		

		var isUnique = (resItem.maxcnt==1);
		var buildFlag = isUnique ? IMG.getBuildedFlag() : IMG.getFullBuildedFlag();
		IMG.setBKImage(item.exsubs.flag, buildFlag);
	};
	
	_lc_._onCloseDlg = function(){
		_lc_.m_dlg.hide();
	};
	
	_lc_._onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			_lc_.m_g.unregUpdater(_lc_.m_this, _lc_._onUpdate);
			_lc_.m_this._onClose();
		}
	};
	
	_lc_._onUpdate = function(cltTimeMs){
		_lc_._updateInfo();
	};
	
	_lc_._onClickItem = function(e, idx){
		_lc_._updateInfo();
		
		var item = _lc_.m_cfg.ids[idx];
		if ( _lc_._isFullBuildCount(item) ){
			_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, 
				TQ.format(rstr.inbuild.sel.fullbuilded, item.itemres.name, item.maxcnt), 
				MB_F_CLOSE, null);
			return;
		}
		
		var rt = TIPM.getSimpleBuildUpTip(_lc_.m_cityId, item);
		if ( rt != '' ){
			_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rt, MB_F_CLOSE, null);
			return;
		}
			
		if ( _lc_.m_caller ){
			_lc_.m_caller.caller.call(_lc_.m_caller.self, item.resid);
			_lc_.m_dlg.hide();
		}
	};
	
	_lc_._onGetTooltip = function(data){
		var item = _lc_.m_cfg.ids[data.idx];
		if ( _lc_._isFullBuildCount(item) ){
			return TQ.format(rstr.inbuild.sel.fullbuilded, item.itemres.name, item.maxcnt);
		}

		return TIPM.getBuildDesc(_lc_.m_cityId, 'firstup', item);
	};
	
	_lc_._isFullBuildCount = function(item){
		var curcnt = _lc_.m_g.getImgr().getBuildCntByResid(_lc_.m_cityId, item.resid);
		return curcnt == item.maxcnt;
	};
	//BaseCitySelBuildDlg-unittest-end
});

MainCitySelBuildDlg = BaseCitySelBuildDlg.extern(function(){
	this.initCfg = function(cfg){
		var xs = [45, 207, 372, 528];
		var ys = [43, 167, 294];
		
		cfg.ids = [
				{resid:110002, pos:{x:xs[0], y:ys[0]}}
				,{resid:110003, pos:{x:xs[0], y:ys[1]}}
				,{resid:110004, pos:{x:xs[0], y:ys[2]}}
				
				,{resid:110005, pos:{x:xs[1], y:ys[0]}}
				,{resid:110006, pos:{x:xs[2], y:ys[0]}}
				,{resid:110008, pos:{x:xs[3], y:ys[0]}}
				
				,{resid:110009, pos:{x:xs[3], y:ys[1]}}
				,{resid:110010, pos:{x:xs[1], y:ys[2]}}
				,{resid:110011, pos:{x:xs[2], y:ys[2]}}
				
				,{resid:110012, pos:{x:xs[3], y:ys[2]}}
			];
		cfg.backImgClass = 'mainback';
	};
	
	this._onOpen = function(items) {
		HelpGuider.getNewcomerSpirit().onDlgOpen('mainselbuild', items);
	};
	
	this._onClose = function(){
		HelpGuider.getNewcomerSpirit().onDlgClose('mainselbuild');
	};
});

ResCitySelBuildDlg = BaseCitySelBuildDlg.extern(function(){
	this.initCfg = function(cfg){
		var xs = [45, 278, 528];
		var ys = [43, 168, 295];
		cfg.ids = [
				{resid:110002, pos:{x:xs[0], y:ys[1]}}
				,{resid:110014, pos:{x:xs[1], y:ys[1]}}
				,{resid:110015, pos:{x:xs[2], y:ys[1]}}
				,{resid:110016, pos:{x:xs[2], y:ys[2]}}
				,{resid:110017, pos:{x:xs[2], y:ys[0]}}
			];
		cfg.backImgClass = 'ressubback';
	};
});

MilitaryCitySelBuildDlg = BaseCitySelBuildDlg.extern(function(){
	this.initCfg = function(cfg){
		var xs = [45, 278, 528];
		var ys = [43, 168, 295];
		cfg.ids = [
				{resid:110006, pos:{x:xs[0], y:ys[1]}}
				,{resid:110019, pos:{x:xs[1], y:ys[1]}}
				,{resid:110020, pos:{x:xs[2], y:ys[1]}}
				,{resid:110021, pos:{x:xs[2], y:ys[0]}}
				,{resid:110022, pos:{x:xs[2], y:ys[2]}}
			];
		cfg.backImgClass = 'militarysubback';
	};
});