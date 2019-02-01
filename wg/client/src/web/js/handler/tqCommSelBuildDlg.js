/*******************************************************************************/
CityBuildUtil = Class.extern(function(){
	//CityBuildUtil-unittest-start
	var m_g = null;
	var m_cityBuildIds = {}; // cityType is key
		
	this.init = function(){
		m_cityBuildIds[CITY_TYPE.MAIN] = [110002, 110003, 110004, 110005,
			110006, 110007, 110008, 110009, 110010, 110011,110012];
		m_cityBuildIds[CITY_TYPE.SUBRES] = [110002,110013,110014,110015,110016,110017];
		m_cityBuildIds[CITY_TYPE.SUBARMY] = [110006,110018,110019,110020,110021,110022];
	};
	
	this.initOneTime = function(g){
		m_g = g;
	};
	
	this.isCanBuildInCity = function(cityId, buildResId) {
		var cityType = m_g.getImgr().getCityTypeByCityId(cityId);
		var buildIds = m_cityBuildIds[cityType];
		if (!buildIds) {
			return false;
		}
		
		return TQ.find(buildIds, null, buildResId) != null;
	};
	//CityBuildUtil-unittest-end
}).snew();

BaseCitySelBuildDlg = Class.extern(function(){
	//BaseCitySelBuildDlg-unittest-start
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_caller = null;
	var m_cityId = 0;
	var m_cfg = {ids:[], backImgClass:''};
	
	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		this.g_ = g;
		m_this = this;
		this.initCfg(m_cfg);
		_initIds();
	};
	
	this.initCfg = function(cfg){
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.openDlg = function(cityId){
		_initParam(cityId);
		_initDlg();
		_openDlg();
		_initInfo();
	};
	
	this._onOpen = function(items) {
	};
	
	this._onClose = function(){
	};
	
	var _initIds = function(){
		for ( var i=0; i<m_cfg.ids.length; ++i ){
			var oneid = m_cfg.ids[i];
			oneid.id = 0;
			oneid.level = 0;
			oneid.itemres = ItemResUtil.findItemres(oneid.resid);
			oneid.maxcnt = oneid.itemres.maxCount;
		}
	};
	
	var _initParam = function(cityId){
		m_cityId = cityId;
	};
	
	var _initDlg = function(){
		if (m_dlg) return;
		
		_createDlg();
		_setListItemCount();
		_setListItemsPos();
		_setListItemsName();
		_setCallers();
		_initTooltip();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal:true, title:'', pos:{x:'center', y:50}, uiback:uiback.dlg.noborder });
		m_g.getGUI().initDlg(m_dlg, uicfg.selCityBuildDlg, m_items);
		TQ.setClass(m_items.backImg, m_cfg.backImgClass);
	};
	
	var _setListItemCount = function(){
		m_items.list.setItemCount(m_cfg.ids.length);
	};
	
	var _setListItemsPos = function(){
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i).item;
			TQ.setCSS(item, 'float', 'none');
			TQ.setCSS(item, 'position', 'absolute');
			TQ.setDomPos(item, m_cfg.ids[i].pos.x, m_cfg.ids[i].pos.y);
		}
	};
	
	var _setListItemsName = function(){
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			TQ.setTextEx(item.exsubs.name, m_cfg.ids[i].itemres.name);
		}
	};
	
	var _setCallers = function(){
		m_items.closeBtn.setCaller({self:m_this, caller:_onCloseDlg});
		m_items.list.setCaller({self:m_this, caller:_onClickItem});
		m_dlg.setCaller({self:m_this,caller:_onDlgEvent});
	};
	
	var _initTooltip = function(){
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			TTIP.setCallerData(item.exsubs.tooltips['$item'], {self:m_this, caller:_onGetTooltip},{idx:i});
		}
	};
	
	var _openDlg = function(){
		m_dlg.show();
		m_g.regUpdater(m_this, _onUpdate, 3000);
	};
	
	var _initInfo = function(){
		_updateInfo();
		m_this._onOpen(m_items);
	};
	
	var _updateInfo = function(){
		if (!_isShow()) return;
		
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			_setListItem(m_items.list.getItem(i), m_cfg.ids[i]);
		}
	};
	
	var _isShow = function(){
		if (!m_dlg) return false;
		
		return m_dlg.isShow();
	};
	
	var _setListItem = function(item, resItem){
		_setListItemIcon(item, resItem);
		_setListItemBuildedCnt(item, resItem);
		_setListItemBuildedFlag(item, resItem);
	};
	
	var _setListItemIcon = function(item, resItem) {
		var disableFlag = 'd';
		if ( _isFullBuildCount(resItem) || TIPM.isCanBuildUpgrade(m_cityId, resItem) ) {
			disableFlag = null;
		}
		IMG.setBKImage(item.exsubs.icon, IMG.makeBigImg(resItem.itemres.bigpic, disableFlag));
	};
	
	var _setListItemBuildedCnt = function(item, resItem) {
		if (_isFullBuildCount(resItem)) return;

		TQ.setCSS(item.exsubs.cnt, 'display', 'block');	
		TQ.setCSS(item.exsubs.flag, 'display', 'none');
		
		var buildedCnt = m_g.getImgr().getBuildCntByResid(m_cityId, resItem.resid);
		TQ.setText(item.exsubs.cnt, buildedCnt);
	};
	
	var _setListItemBuildedFlag = function(item, resItem) {
		if (!_isFullBuildCount(resItem)) return;

		TQ.setCSS(item.exsubs.flag, 'display', 'block');
		TQ.setCSS(item.exsubs.cnt, 'display', 'none');		

		var isUnique = (resItem.maxcnt==1);
		var buildFlag = isUnique ? IMG.getBuildedFlag() : IMG.getFullBuildedFlag();
		IMG.setBKImage(item.exsubs.flag, buildFlag);
	};
	
	var _onCloseDlg = function(){
		m_dlg.hide();
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			m_g.unregUpdater(m_this, _onUpdate);
			m_this._onClose();
		}
	};
	
	var _onUpdate = function(cltTimeMs){
		_updateInfo();
	};
	
	var _onClickItem = function(e, idx){
		_updateInfo();
		
		var item = m_cfg.ids[idx];
		if ( _isFullBuildCount(item) ){
			m_g.getGUI().msgBox(rstr.comm.msgts, 
				TQ.format(rstr.inbuild.sel.fullbuilded, item.itemres.name, item.maxcnt), 
				MB_F_CLOSE, null);
			return;
		}
		
		var rt = TIPM.getSimpleBuildUpTip(m_cityId, item);
		if ( rt != '' ){
			m_g.getGUI().msgBox(rstr.comm.msgts, rt, MB_F_CLOSE, null);
			return;
		}
			
		if ( m_caller ){
			m_caller.caller.call(m_caller.self, item.resid);
			m_dlg.hide();
		}
	};
	
	var _onGetTooltip = function(data){
		var item = m_cfg.ids[data.idx];
		if ( _isFullBuildCount(item) ){
			return TQ.format(rstr.inbuild.sel.fullbuilded, item.itemres.name, item.maxcnt);
		}

		return TIPM.getBuildDesc(m_cityId, 'firstup', item);
	};
	
	var _isFullBuildCount = function(item){
		var curcnt = m_g.getImgr().getBuildCntByResid(m_cityId, item.resid);
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