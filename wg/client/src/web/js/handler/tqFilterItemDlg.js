/*******************************************************************************/
FilterItemDlg = Class.extern(function(){
	//FilterItemDlg-unittest-start
	var C_ITEM_H = 74;
	var C_SPACE_H = 5;
	var C_MAX_CNT = 6;
	
	var m_g=null;
	var m_this=null;
	var m_dlg=null;
	var m_filters={};
	var m_itemInfoGetters = {};
	var m_items={};
	var m_curfilter=null;
	var m_caller=null;
	var m_resitems=null;// 当前过滤出来的itemlist
	var m_paramdata=null;

	this.init = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.PKG_CHANGE,0,m_this,_onUpdateNumber);
		_registerFilter();
		_registerItemInfoGetters();
	};
	
	this.openDlg = function(data){
		_initParams(data);
		_initFilter();
		_initDlg();
		_openDlg();
		_initInfo();
		_startUpdater();
		HelpGuider.getNewcomerSpirit().onDlgOpen('uselistitem', {parent:m_dlg.getParent(), items:m_items, data:m_paramdata});
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.isShow = function(){
		if (!m_dlg) return false;
		return m_dlg.isShow();
	};
	
	this.clickItem = function(idx){
		var usebtn = m_items.itemlist.getItem(idx).exsubs.usebtn;
		usebtn.click();	
	};
	
	var _registerFilter = function(){
		m_filters['effect'] = UseItemByEffectFilter.snew(m_g);
		m_filters['itemids'] = UseItemByItemIdsFilter.snew(m_g);
	};
	
	var _registerItemInfoGetters = function(){
		m_itemInfoGetters['comm'] = CommItemInfoGetter.snew(m_g);
		m_itemInfoGetters['buildGold'] = BuildGoldItemInfoGetter.snew(m_g);
		m_itemInfoGetters['cultureGold'] = CultureLearnGoldItemInfoGetter.snew(m_g);
		m_itemInfoGetters['skeletonGold'] = SkeletonSteelGoldItemInfoGetter.snew(m_g);
		m_itemInfoGetters['skillGold'] = SkillSteelGoldItemInfoGetter.snew(m_g);
		m_itemInfoGetters['cityDefGold'] = CityDefGoldItemInfoGetter.snew(m_g);
		m_itemInfoGetters['tradingGold'] = TradingGoldItemInfoGetter.snew(m_g);
		m_itemInfoGetters['roletaskGold'] = RoleTaskGoldItemInfoGetter.snew(m_g);
	};
	
	var _initParams = function(data){
		m_paramdata = data;
	};
	
	var _initFilter = function(){
		m_curfilter = m_filters[m_paramdata.filter];
	};
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		
		_createDlg();
		_setCallers();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal:false, title:'.', 	pos:{x:"center", y:25} });
		m_g.getGUI().initDlg(m_dlg, uicfg.useitem.filterdlg, m_items);	
	};
	
	var _setCallers = function(){
		m_dlg.setCaller({self:m_this,caller:_onDlgEvent});
	};
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		m_dlg.setTitle(m_paramdata.title);
		_resetResItems();
		_resetDlgSize();
		_initTarget();
		_initList();
	};
	
	var _resetDlgSize = function(){
		var listh = _getFitListHeight();
		_resetListScrollerHeight(listh);
		_resetDlgPanelHeight(listh);
	};
	
	var _getFitListHeight = function(){
		var cnt = m_resitems.length;
		if ( cnt > C_MAX_CNT ){
			cnt = C_MAX_CNT;
		}
		return C_ITEM_H*cnt;
	};
	
	var _resetListScrollerHeight = function(listh){
		var listscroller = m_items.itemlist.getScroller();
		listscroller.setSize(-1,listh);
		listscroller.refresh();
	};
	
	var _resetDlgPanelHeight = function(listh){
		var listscroller = m_items.itemlist.getScroller();
		var listdom = listscroller.getDom();
		var allh = parseInt(listdom.style.top)+listh+C_SPACE_H;
		var condom = m_dlg.getConDom();
		TQ.setDomHeight(condom, allh );
		TQ.setDomHeight(condom.firstChild, allh );
		m_dlg.refreshBack();
	};
	
	var _initTarget = function(){
		TQ.setTextEx(m_items.desc, typeof(m_paramdata.desc) == 'function' ? m_paramdata.desc() : m_paramdata.desc );
	};
	
	var _initList = function(){
		var tlist = m_items.itemlist;
		tlist.setItemCount(m_resitems.length);
		for ( var i=0; i<m_resitems.length; ++i ){
			var ritem = m_resitems[i];
			var listitem = tlist.getItem(i);
			
			CommDrawItem.drawItemIconAndName(listitem.exsubs.icon, listitem.exsubs.name, ritem.itemres);
			
			TQ.setTextEx(listitem.exsubs.number, ritem.number);
			TQ.setTextEx(listitem.exsubs.desc, ritem.desc);
			
			var usebtn = listitem.exsubs.usebtn;
			usebtn.setId(i);
			usebtn.setText(m_paramdata.btntext);
			usebtn.setCaller({self:m_this,caller:_onUseItem});
		}
		tlist.scrollPos(0);
	};
	
	var _startUpdater = function(){
		if ( !m_paramdata.targetitem ) return;
		
		if ( m_paramdata.targetitem.stoptime 
			|| m_paramdata.targetitem.starttime
			|| typeof(m_paramdata.desc) == 'function' ) {
			m_g.regUpdater(m_this, _onUpdate, 1000);
		}
	};
	
	var _onUseItem = function(idx){
		if ( !m_caller ) return;
		
		var item = m_resitems[idx];
		var rt = m_caller.caller.call(m_caller.self, item);
		if ( rt == RET_END ){
			m_dlg.hide();
		}
	};
	
	var _onUpdate = function(curTimeMs){
		if ( m_paramdata.targetitem.stoptime ){
			var showtime = Math.max(0, m_paramdata.targetitem.stoptime - m_g.getSvrTimeS());
			TQ.setTextEx(m_items.desc, TQ.formatTime(0,showtime));
		}
		else if ( m_paramdata.targetitem.starttime ){
			var showtime = Math.max(0, m_g.getSvrTimeS() - m_paramdata.targetitem.starttime);
			TQ.setTextEx(m_items.desc, TQ.formatTime(0,showtime));
		}
		else {
			TQ.setTextEx(m_items.desc, m_paramdata.desc() );
		}
	};
	
	var _onUpdateNumber = function(){
		if (!m_this.isShow()) return;
		
		_resetResItems();

		for ( var i=0; i<m_items.itemlist.getCount(); ++i ) {
			var resItem = m_resitems[i];
			var listItem = m_items.itemlist.getItem(i);
			TQ.setTextEx(listItem.exsubs.number, resItem.number);
		}
		
		m_items.itemlist.scrollPos(0);
	};
	
	var _resetResItems = function(){
		m_resitems = m_curfilter.filter(m_paramdata);
		for ( var i in m_resitems ){
			var ritem = m_resitems[i];
			var info = _getItemInfo(ritem);
			ritem.needNumber = info.needNumber;
			ritem.isGiftGold = info.isGiftGold;
			ritem.number = info.number;
			ritem.desc = info.desc;
		}
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			m_g.unregUpdater(m_this, _onUpdate);
			HelpGuider.getNewcomerSpirit().onDlgClose('uselistitem');
		}
	};
	
	var _getItemInfo = function(item){
		return _getItemInfoGetter(item).getInfo(item, _getDurationTimeToStopTime());
	};
	
	var _getItemInfoGetter = function(item){
		var itemInfoGetter = null;
		if ( _hasEffect(item, RES_EFF.FULL_ACC_BUILDING_USEGIFTGOLD) ) {
			itemInfoGetter = m_itemInfoGetters['buildGold'];
		}
		else if ( _hasEffect(item, RES_EFF.FULL_ACC_CULTURELEARN_USEGIFTGOLD)) {
			itemInfoGetter = m_itemInfoGetters['cultureGold'];
		}
		else if ( _hasEffect(item, RES_EFF.FULL_ACC_SKELETONSTEEL_USEGIFTGOLD)) {
			itemInfoGetter = m_itemInfoGetters['skeletonGold'];
		}
		else if ( _hasEffect(item, RES_EFF.FULL_ACC_SKILLSTEEL_USEGIFTGOLD)) {
			itemInfoGetter = m_itemInfoGetters['skillGold'];
		}
		else if ( _hasEffect(item, RES_EFF.FULL_ACC_CITYDEF_USEGIFTGOLD)) {
			itemInfoGetter = m_itemInfoGetters['cityDefGold'];
		}
		else if ( _hasEffect(item, RES_EFF.FULL_ACC_TRADING_USEGIFTGOLD)) {
			itemInfoGetter = m_itemInfoGetters['tradingGold'];
		}
		else if ( _hasEffect(item, RES_EFF.FULL_ACC_TASK_USEGIFTGOLD)) {
			itemInfoGetter = m_itemInfoGetters['roletaskGold'];
		}
		else {
			itemInfoGetter = m_itemInfoGetters['comm'];
		}
		return itemInfoGetter;
	};
	
	var _hasEffect = function(item, effectId) {
		return TQ.find(item.itemres.effects, 'id', effectId) != null;
	};
	
	var _getDurationTimeToStopTime = function() {
		var duration = 0;
		if ( m_paramdata.targetitem.stoptime ){
			var duration = m_paramdata.targetitem.stoptime - m_g.getSvrTimeS();
			if (duration < 0) {
				duration = 0;
			}
		}
		return duration;
	};
	//FilterItemDlg-unittest-end
});
