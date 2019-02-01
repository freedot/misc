/*******************************************************************************/
FilterItemDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.C_ITEM_H = 74;
	var C_SPACE_H = 5;
	_lc_.C_MAX_CNT = 6;
	
	_lc_.m_g=null;
	_lc_.m_this=null;
	_lc_.m_dlg=null;
	_lc_.m_filters={};
	_lc_.m_itemInfoGetters = {};
	_lc_.m_items={};
	_lc_.m_curfilter=null;
	_lc_.m_caller=null;
	_lc_.m_resitems=null;// 当前过滤出来的itemlist
	_lc_.m_paramdata=null;

	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_g.regEvent(EVT.PKG_CHANGE,0,_lc_.m_this,_lc_._onUpdateNumber);
		_lc_._registerFilter();
		_lc_._registerItemInfoGetters();
	};
	
	this.openDlg = function(data){
		_lc_._initParams(data);
		_lc_._initFilter();
		_lc_._initDlg();
		_lc_._openDlg();
		_lc_._initInfo();
		_lc_._startUpdater();
		HelpGuider.getNewcomerSpirit().onDlgOpen('uselistitem', {parent:_lc_.m_dlg.getParent(), items:_lc_.m_items, data:_lc_.m_paramdata});
	};
	
	this.setCaller = function(caller){
		_lc_.m_caller = caller;
	};
	
	this.isShow = function(){
		if (!_lc_.m_dlg) return false;
		return _lc_.m_dlg.isShow();
	};
	
	this.clickItem = function(idx){
		var usebtn = _lc_.m_items.itemlist.getItem(idx).exsubs.usebtn;
		usebtn.click();	
	};
	
	_lc_._registerFilter = function(){
		_lc_.m_filters['effect'] = UseItemByEffectFilter.snew(_lc_.m_g);
		_lc_.m_filters['itemids'] = UseItemByItemIdsFilter.snew(_lc_.m_g);
	};
	
	_lc_._registerItemInfoGetters = function(){
		_lc_.m_itemInfoGetters['comm'] = CommItemInfoGetter.snew(_lc_.m_g);
		_lc_.m_itemInfoGetters['buildGold'] = BuildGoldItemInfoGetter.snew(_lc_.m_g);
		_lc_.m_itemInfoGetters['cultureGold'] = CultureLearnGoldItemInfoGetter.snew(_lc_.m_g);
		_lc_.m_itemInfoGetters['skeletonGold'] = SkeletonSteelGoldItemInfoGetter.snew(_lc_.m_g);
		_lc_.m_itemInfoGetters['skillGold'] = SkillSteelGoldItemInfoGetter.snew(_lc_.m_g);
		_lc_.m_itemInfoGetters['cityDefGold'] = CityDefGoldItemInfoGetter.snew(_lc_.m_g);
		_lc_.m_itemInfoGetters['tradingGold'] = TradingGoldItemInfoGetter.snew(_lc_.m_g);
		_lc_.m_itemInfoGetters['roletaskGold'] = RoleTaskGoldItemInfoGetter.snew(_lc_.m_g);
	};
	
	_lc_._initParams = function(data){
		_lc_.m_paramdata = data;
	};
	
	_lc_._initFilter = function(){
		_lc_.m_curfilter = _lc_.m_filters[_lc_.m_paramdata.filter];
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		
		_lc_._createDlg();
		_lc_._setCallers();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:false, title:'.', 	pos:{x:"center", y:25} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.useitem.filterdlg, _lc_.m_items);	
	};
	
	_lc_._setCallers = function(){
		_lc_.m_dlg.setCaller({self:_lc_.m_this,caller:_lc_._onDlgEvent});
	};
	
	_lc_._openDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		_lc_.m_dlg.setTitle(_lc_.m_paramdata.title);
		_lc_._resetResItems();
		_lc_._resetDlgSize();
		_lc_._initTarget();
		_lc_._initList();
	};
	
	_lc_._resetDlgSize = function(){
		var listh = _lc_._getFitListHeight();
		_lc_._resetListScrollerHeight(listh);
		_lc_._resetDlgPanelHeight(listh);
	};
	
	_lc_._getFitListHeight = function(){
		var cnt = _lc_.m_resitems.length;
		if ( cnt > _lc_.C_MAX_CNT ){
			cnt = _lc_.C_MAX_CNT;
		}
		return _lc_.C_ITEM_H*cnt;
	};
	
	_lc_._resetListScrollerHeight = function(listh){
		var listscroller = _lc_.m_items.itemlist.getScroller();
		listscroller.setSize(-1,listh);
		listscroller.refresh();
	};
	
	_lc_._resetDlgPanelHeight = function(listh){
		var listscroller = _lc_.m_items.itemlist.getScroller();
		var listdom = listscroller.getDom();
		var allh = parseInt(listdom.style.top)+listh+C_SPACE_H;
		var condom = _lc_.m_dlg.getConDom();
		TQ.setDomHeight(condom, allh );
		TQ.setDomHeight(condom.firstChild, allh );
		_lc_.m_dlg.refreshBack();
	};
	
	_lc_._initTarget = function(){
		TQ.setTextEx(_lc_.m_items.desc, typeof(_lc_.m_paramdata.desc) == 'function' ? _lc_.m_paramdata.desc() : _lc_.m_paramdata.desc );
	};
	
	_lc_._initList = function(){
		var tlist = _lc_.m_items.itemlist;
		tlist.setItemCount(_lc_.m_resitems.length);
		for ( var i=0; i<_lc_.m_resitems.length; ++i ){
			var ritem = _lc_.m_resitems[i];
			var listitem = tlist.getItem(i);
			
			CommDrawItem.drawItemIconAndName(listitem.exsubs.icon, listitem.exsubs.name, ritem.itemres);
			
			TQ.setTextEx(listitem.exsubs.number, ritem.number);
			TQ.setTextEx(listitem.exsubs.desc, ritem.desc);
			
			var usebtn = listitem.exsubs.usebtn;
			usebtn.setId(i);
			usebtn.setText(_lc_.m_paramdata.btntext);
			usebtn.setCaller({self:_lc_.m_this,caller:_lc_._onUseItem});
		}
		tlist.scrollPos(0);
	};
	
	_lc_._startUpdater = function(){
		if ( !_lc_.m_paramdata.targetitem ) return;
		
		if ( _lc_.m_paramdata.targetitem.stoptime 
			|| _lc_.m_paramdata.targetitem.starttime
			|| typeof(_lc_.m_paramdata.desc) == 'function' ) {
			_lc_.m_g.regUpdater(_lc_.m_this, _lc_._onUpdate, 1000);
		}
	};
	
	_lc_._onUseItem = function(idx){
		if ( !_lc_.m_caller ) return;
		
		var item = _lc_.m_resitems[idx];
		var rt = _lc_.m_caller.caller.call(_lc_.m_caller.self, item);
		if ( rt == RET_END ){
			_lc_.m_dlg.hide();
		}
	};
	
	_lc_._onUpdate = function(curTimeMs){
		if ( _lc_.m_paramdata.targetitem.stoptime ){
			var showtime = Math.max(0, _lc_.m_paramdata.targetitem.stoptime - _lc_.m_g.getSvrTimeS());
			TQ.setTextEx(_lc_.m_items.desc, TQ.formatTime(0,showtime));
		}
		else if ( _lc_.m_paramdata.targetitem.starttime ){
			var showtime = Math.max(0, _lc_.m_g.getSvrTimeS() - _lc_.m_paramdata.targetitem.starttime);
			TQ.setTextEx(_lc_.m_items.desc, TQ.formatTime(0,showtime));
		}
		else {
			TQ.setTextEx(_lc_.m_items.desc, _lc_.m_paramdata.desc() );
		}
	};
	
	_lc_._onUpdateNumber = function(){
		if (!_lc_.m_this.isShow()) return;
		
		_lc_._resetResItems();

		for ( var i=0; i<_lc_.m_items.itemlist.getCount(); ++i ) {
			var resItem = _lc_.m_resitems[i];
			var listItem = _lc_.m_items.itemlist.getItem(i);
			TQ.setTextEx(listItem.exsubs.number, resItem.number);
		}
		
		_lc_.m_items.itemlist.scrollPos(0);
	};
	
	_lc_._resetResItems = function(){
		_lc_.m_resitems = _lc_.m_curfilter.filter(_lc_.m_paramdata);
		for ( var i in _lc_.m_resitems ){
			var ritem = _lc_.m_resitems[i];
			var info = _lc_._getItemInfo(ritem);
			ritem.needNumber = info.needNumber;
			ritem.isGiftGold = info.isGiftGold;
			ritem.number = info.number;
			ritem.desc = info.desc;
		}
	};
	
	_lc_._onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			_lc_.m_g.unregUpdater(_lc_.m_this, _lc_._onUpdate);
			HelpGuider.getNewcomerSpirit().onDlgClose('uselistitem');
		}
	};
	
	_lc_._getItemInfo = function(item){
		return _lc_._getItemInfoGetter(item).getInfo(item, _lc_._getDurationTimeToStopTime());
	};
	
	_lc_._getItemInfoGetter = function(item){
		var itemInfoGetter = null;
		if ( _lc_._hasEffect(item, RES_EFF.FULL_ACC_BUILDING_USEGIFTGOLD) ) {
			itemInfoGetter = _lc_.m_itemInfoGetters['buildGold'];
		}
		else if ( _lc_._hasEffect(item, RES_EFF.FULL_ACC_CULTURELEARN_USEGIFTGOLD)) {
			itemInfoGetter = _lc_.m_itemInfoGetters['cultureGold'];
		}
		else if ( _lc_._hasEffect(item, RES_EFF.FULL_ACC_SKELETONSTEEL_USEGIFTGOLD)) {
			itemInfoGetter = _lc_.m_itemInfoGetters['skeletonGold'];
		}
		else if ( _lc_._hasEffect(item, RES_EFF.FULL_ACC_SKILLSTEEL_USEGIFTGOLD)) {
			itemInfoGetter = _lc_.m_itemInfoGetters['skillGold'];
		}
		else if ( _lc_._hasEffect(item, RES_EFF.FULL_ACC_CITYDEF_USEGIFTGOLD)) {
			itemInfoGetter = _lc_.m_itemInfoGetters['cityDefGold'];
		}
		else if ( _lc_._hasEffect(item, RES_EFF.FULL_ACC_TRADING_USEGIFTGOLD)) {
			itemInfoGetter = _lc_.m_itemInfoGetters['tradingGold'];
		}
		else if ( _lc_._hasEffect(item, RES_EFF.FULL_ACC_TASK_USEGIFTGOLD)) {
			itemInfoGetter = _lc_.m_itemInfoGetters['roletaskGold'];
		}
		else {
			itemInfoGetter = _lc_.m_itemInfoGetters['comm'];
		}
		return itemInfoGetter;
	};
	
	_lc_._hasEffect = function(item, effectId) {
		return TQ.find(item.itemres.effects, 'id', effectId) != null;
	};
	
	_lc_._getDurationTimeToStopTime = function() {
		var duration = 0;
		if ( _lc_.m_paramdata.targetitem.stoptime ){
			var duration = _lc_.m_paramdata.targetitem.stoptime - _lc_.m_g.getSvrTimeS();
			if (duration < 0) {
				duration = 0;
			}
		}
		return duration;
	};
	//FilterItemDlg-unittest-end
});
