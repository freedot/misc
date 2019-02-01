/*******************************************************************************/
SteelListDlg = Class.extern(function(){
	var FreeHeroSpec = Class.extern(function(){
		this.isSatisfiedBy = function(item, hero){
			return (hero.state == HERO_STATE.FREE);
		};
	});
	
	var CheckSpec = Class.extern(function(){
		this.isSatisfiedBy = function(item, hero){
			return item.exsubs.sel.getCheck() > 0;
		};
	});
	
	var NoMaxLevelHeroSpec = Class.extern(function(){
		this.init = function(g){
			this.g_ = g;
		};
		this.isSatisfiedBy = function(item, hero){
			return !this.g_.getImgr().isMaxHeroLevel(hero);
		};
	});
	
	var NoMaxBuildLevelSpec = Class.extern(function(){
		this.init = function(g, steelType){
			this.g_ = g;
			this.steelType_ = steelType;
		};
		this.isSatisfiedBy = function(item, hero){
			return this.steelType_ != 'steel' || !this._isArriveMaxBuildLevel(hero);
		};
		this._isArriveMaxBuildLevel = function(hero){
			var steelBuildLevel = this.g_.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.STEEL_BUILD);
			var res = ItemResUtil.findBuildLevelres(FIXID.STEEL_BUILD, steelBuildLevel);
			return hero.level >= res.herosteelmaxlevel;
		};		
	});	
	
	var _lc_={};this.lc=function(){return _lc_;};
	var C_TAB_STEEL_IDX = 0;
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	
	this.init = function(g){
		_lc_._initParam(this, g);
		_lc_._regEvents();
	};
	
	this.openDlg = function(){
		if (!_isCanOpen()) return;
		_lc_._initDlg();
		_lc_._openDlg();
		_lc_._initInfo();
	};
	
	this.hideDlg = function(){
		if ( _lc_.m_dlg ) _lc_.m_dlg.hide();
	};
	
	var _isCanOpen = function(){
		var buildLevel = _lc_.m_g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.STEEL_BUILD);
		if ( buildLevel == 0 ) {
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.steellistdlg.tip.hasNoBuild);
			return false;
		}
		return true;
	};
	
	_lc_._initParam = function(selfThis, g){
		_lc_.m_this = selfThis;
		_lc_.m_g = g;
	};
	
	_lc_._regEvents = function(){
		_lc_.m_g.regEvent(EVT.HERO_UPDATE, 0, _lc_.m_this, _lc_._onHeroUpdate);
		_lc_.m_g.regEvent(EVT.ROLEBASE, 0, _lc_.m_this, _onRolebaseChange);
	};
	
	_lc_._initDlg = function(){
		if (_lc_.m_dlg) return;
		
		_lc_._createDlg();
		_lc_._setCallers();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:false, title:rstr.steellistdlg.title, pos:{x:'center', y:50} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.hero.steellistdlg, _lc_.m_items);
	};
	
	_lc_._setCallers = function(){
		var items = _lc_.m_items.tabList.getTabItems(C_TAB_STEEL_IDX);
		items.list.setCaller({self:_lc_.m_this, caller:_lc_._onClickListItem});
		items.selectAllBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickSelectAll});
		items.unselectAllBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickUnselectAll});
		items.stopsteelAllBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickStopSteelAll});
		items.steelBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickSteel});
		items.highsteelBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickHighSteel});
		_lc_.m_dlg.setCaller({self:_lc_.m_this,caller:_lc_._onDlgEvent});
		_lc_.m_items.vip1SteelBtn.setCaller({self:_lc_.m_this, caller:_onClickVip1Steel});
		_lc_.m_items.vip2SteelBtn.setCaller({self:_lc_.m_this, caller:_onClickVip2Steel});
	};
	
	_lc_._openDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		_lc_.m_items.tabList.activeTab(0);
		_lc_._updateHerosList();
		_lc_.m_g.regUpdater(_lc_.m_this, _lc_._onUpdate, 1000);
		_updateVipSteelBtns();
	};
	
	_lc_._updateHerosList = function(){
		if ( !_lc_._isShow() ) return;
		_lc_._setHerosListItems();
		_lc_._updateSteelTimes();
		_lc_._updateSteelGetExps();
		_lc_._setHerosListCallers();
	};
	
	var _updateVipSteelBtns = function(){
		if ( _lc_.m_g.getImgr().getVipEffectVal(VIP_EFF.HERO_HIGH_STEEL) >= 1 ) {
			_lc_.m_items.vip1SteelBtn.visible();
		} else {
			_lc_.m_items.vip1SteelBtn.hidden();
		}
		if ( _lc_.m_g.getImgr().getVipEffectVal(VIP_EFF.HERO_HIGH_STEEL) == 2 ) {
			_lc_.m_items.vip2SteelBtn.visible();
		} else {
			_lc_.m_items.vip2SteelBtn.hidden();
		}
	};
	
	_lc_._isShow = function(){
		if ( !_lc_.m_dlg ) return false;
		
		return _lc_.m_dlg.isShow();
	};
	
	_lc_._setHerosListItems = function(){
		var heros = _lc_.m_g.getImgr().getHeros().list;
		var items = _lc_.m_items.tabList.getTabItems(C_TAB_STEEL_IDX);
		items.list.setItemCount(heros.length);
		
		var _setCommListItems = function(item, hero){
			var imgr = _lc_.m_g.getImgr();
			TQ.setTextEx(item.exsubs.name, hero.name);
			TQ.setTextEx(item.exsubs.level, hero.level);
			if ( hero.state != HERO_STATE.STEEL ) {
				TQ.setRichText(item.exsubs.state, rstr.comm.herostate[hero.state]);
			} else if (hero.steel.type == HSTEEL_TYPE.COMM){
				TQ.setTextEx(item.exsubs.state, rstr.steellistdlg.lbl.commSteel);
			} else if (hero.steel.type == HSTEEL_TYPE.HIGH){
				TQ.setTextEx(item.exsubs.state, rstr.steellistdlg.lbl.highSteel);
			} else if (hero.steel.type == HSTEEL_TYPE.VIP1){
				TQ.setTextEx(item.exsubs.state, rstr.steellistdlg.lbl.vip1Steel);
			} else if (hero.steel.type == HSTEEL_TYPE.VIP2){
				TQ.setTextEx(item.exsubs.state, rstr.steellistdlg.lbl.vip2Steel);
			}
			var xpPer = Math.floor(imgr.getHeroAttrVal(hero, ATTR.XP)*100/imgr.getHeroAttrVal(hero, ATTR.NXP));
			TQ.setTextEx(item.exsubs.exp, xpPer + '%');
		};
		
		var _setListItemWhenNoSteel = function(item, hero){
			_setCommListItems(item, hero);
			TQ.setTextEx(item.exsubs.totalsteeltime, '--' );
		};
		
		var _setListItemWhenSteel = function(item, hero, idx){
			_setCommListItems(item, hero);
			TQ.setTextEx(item.exsubs.totalsteeltime, TQ.format(rstr.comm.hour, hero.steel.steelQuarters/4));
		};
		
		_lc_._transferHeroList(_setListItemWhenNoSteel, _setListItemWhenSteel);
	};
	
	_lc_._setHerosListCallers = function(){
		var _hideOpBtnListItem = function(item, hero){
			item.exsubs.opBtn.hide();
		};
		
		var _setOpBtnListItem = function(item, hero, listIdx){
			item.exsubs.opBtn.show();
			item.exsubs.opBtn.setId(listIdx);
			item.exsubs.opBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickStopSteel});
		};
		
		_lc_._transferHeroList(_hideOpBtnListItem, _setOpBtnListItem);
	};
	
	_lc_._updateSteelTimes = function(){
		var _clearSteelTimeListItem = function(item, hero) {
			TQ.setTextEx(item.exsubs.steeltime, '--' );
		};
		
		var _setSteelTimeListItem = function(item, hero) {
			var duration = Math.clamp(_lc_.m_g.getSvrTimeS() - hero.steel.startTime,  0, hero.steel.steelQuarters*900);
			TQ.setTextEx(item.exsubs.steeltime, TQ.formatTime(0, duration) );
		};
		
		_lc_._transferHeroList(_clearSteelTimeListItem, _setSteelTimeListItem);
	};
	
	_lc_._updateSteelGetExps = function(){
		var _clearGetExpListItem = function(item, hero) {
			TQ.setTextEx(item.exsubs.getexp, 0 );
		};
		
		var _setGetExpListItem = function(item, hero) {
			var multBySvrAct = _lc_.m_g.getImgr().multHeroSteelBySvrAct();
			var duration = Math.clamp(_lc_.m_g.getSvrTimeS() - hero.steel.startTime,  0, hero.steel.steelQuarters*900);
			var getExp = Math.floor(duration/900)*hero.steel.quarterRes;
			TQ.setTextEx(item.exsubs.getexp, getExp*multBySvrAct);
		};
		
		_lc_._transferHeroList(_clearGetExpListItem, _setGetExpListItem);
	};
	
	_lc_._transferHeroList = function(notSteelHeroCallBack, steelHeroCallBack){
		var heros = _lc_.m_g.getImgr().getHeros().list;
		var items = _lc_.m_items.tabList.getTabItems(C_TAB_STEEL_IDX);
		for ( var i=0; i<items.list.getCount(); ++i ){
			var item = items.list.getItem(i);
			var hero = heros[i];
			
			if ( hero.state != HERO_STATE.STEEL ) {
				notSteelHeroCallBack(item, hero, i);
				continue;
			}
			
			steelHeroCallBack(item, hero, i);
		}
	};
	
	_lc_._onUpdate = function(){
		_lc_._updateSteelTimes();
		_lc_._updateSteelGetExps();
	};
	
	_lc_._onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			_lc_.m_g.unregUpdater(_lc_.m_this, _lc_._onUpdate);
		}
	};
	
	_lc_._onHeroUpdate = function(){
		_lc_._updateHerosList();
	};
	
	var _onRolebaseChange = function(){
		if ( !_lc_._isShow() ) return;
		_updateVipSteelBtns();
	};
	
	_lc_._onClickStopSteel = function(idx){
		var hero = _lc_.m_g.getImgr().getHeros().list[idx];
		HeroSender.sendStopHeroSteel(_lc_.m_g, hero.id);
	};
	
	_lc_._onClickListItem = function(e, idx){
		var items = _lc_.m_items.tabList.getTabItems(C_TAB_STEEL_IDX);
		var item = items.list.getItem(idx);
		if ( !item ) return;
		
		var toggleCheck = item.exsubs.sel.getCheck() ? 0 : 1;
		item.exsubs.sel.setCheck(toggleCheck);
	};
	
	_lc_._onClickSelectAll = function(){
		_lc_._selectOrUnselectAllArms(1);
	};
	
	_lc_._onClickUnselectAll = function(){
		_lc_._selectOrUnselectAllArms(0);
	};
	
	_lc_._onClickStopSteelAll = function(){
		_lc_._onStopCallback = function(id) {
			if ( id == MB_IDYES ) HeroSender.sendStopAllHerosSteel(_lc_.m_g);
		};
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rstr.steellistdlg.lbl.stopAllSteel,  MB_F_YESNO, {self:_lc_.m_this, caller:_lc_._onStopCallback} );
	};
	
	_lc_._onClickSteel = function(){
		var canSteelHeros = _lc_._getSelectCanSteelHeros('steel');
		if (canSteelHeros.length == 0)  return;
		
		UIM.openDlg('steelhero', 'steel', canSteelHeros);
	};
	
	_lc_._onClickHighSteel = function(){
		var canSteelHeros = _lc_._getSelectCanSteelHeros('highsteel');
		if (canSteelHeros.length == 0) return;
		
		UIM.openDlg('steelhero', 'highsteel', canSteelHeros);
	};
	
	var _onClickVip1Steel = function(){
		var canSteelHeros = _lc_._getSelectCanSteelHeros('highsteel');
		if (canSteelHeros.length == 0) return;
		
		UIM.openDlg('steelhero', 'vip1steel', canSteelHeros);
	};
	
	var _onClickVip2Steel = function(){
		var canSteelHeros = _lc_._getSelectCanSteelHeros('highsteel');
		if (canSteelHeros.length == 0) return;
		
		UIM.openDlg('steelhero', 'vip2steel', canSteelHeros);
	};
	
	_lc_._selectOrUnselectAllArms = function(checkFlag){
		var items = _lc_.m_items.tabList.getTabItems(C_TAB_STEEL_IDX);
		for ( var i=0; i<items.list.getCount(); ++i ){
			var item = items.list.getItem(i);
			item.exsubs.sel.setCheck(checkFlag);
		}
	};
	
	_lc_._getSelectCanSteelHeros = function(steelType){
		var canSteelHeros = _collectCanSteelHeros(steelType);
		var warningTip = _getWarningTip(canSteelHeros, steelType);
		if ( warningTip != '' ) {
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, warningTip);
		}
		return canSteelHeros;
	};
	
	var _getSelectCount = function(){
		var spec = CheckSpec.snew();
		return _collectHeros(spec).length;
	};
	
	var _getSelectArrivedMaxLevelCount = function(){
		var spec = AndSpec.snew(
			CheckSpec.snew()
			,NotSpec.snew(NoMaxLevelHeroSpec.snew(_lc_.m_g))
			);
		return _collectHeros(spec).length;
	};
	
	var _getSelectArrivedMaxBuildLevelCount = function(steelType){
		var spec = AndSpec.snew(
			FreeHeroSpec.snew()
			,CheckSpec.snew()
			,NoMaxLevelHeroSpec.snew(_lc_.m_g)
			,NotSpec.snew(NoMaxBuildLevelSpec.snew(_lc_.m_g, steelType))
			);
		return _collectHeros(spec).length;
	};
	
	var _collectCanSteelHeros = function(steelType){
		var spec = AndSpec.snew(
			FreeHeroSpec.snew()
			,CheckSpec.snew()
			,NoMaxLevelHeroSpec.snew(_lc_.m_g)
			,NoMaxBuildLevelSpec.snew(_lc_.m_g, steelType)
			);
		return _collectHeros(spec);
	};
	
	var _getWarningTip = function(canSteelHeros, steelType){
		var warningTip = '';
		if ( canSteelHeros.length == 0 ){
			if ( _getSelectCount() == 0 ) {
				warningTip = rstr.steellistdlg.tip.emptySteelHeros;
			} else if (_getSelectArrivedMaxLevelCount() > 0) {
				warningTip = rstr.steellistdlg.tip.allFullLevelHeros;
			} else if (_getSelectArrivedMaxBuildLevelCount(steelType) > 0) {
				warningTip = rstr.steellistdlg.tip.allArriveMaxBuildLevel;
			} else {
				warningTip = rstr.steellistdlg.tip.allHerosBusy;
			}
		} else if ( _getSelectArrivedMaxLevelCount() > 0 ) {
			warningTip = rstr.steellistdlg.tip.fullLevelHeros;
		} else if ( _getSelectArrivedMaxBuildLevelCount(steelType) > 0 ) {
			warningTip = rstr.steellistdlg.tip.arriveMaxBuildLevel;
		}
		return warningTip;
	};
	
	var _collectHeros = function(spec){
		var collectHeros = [];
		var heros = _lc_.m_g.getImgr().getHeros().list;
		var items = _lc_.m_items.tabList.getTabItems(C_TAB_STEEL_IDX);
		for ( var i=0; i<items.list.getCount(); ++i ){
			var item = items.list.getItem(i);
			var hero = heros[i];
			if ( spec.isSatisfiedBy(item, hero) ) {
				collectHeros.push(hero);
			}
		}
		return collectHeros;
	};

	_lc_._isArriveMaxBuildLevel = function(hero){
		var steelBuildLevel = _lc_.m_g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.STEEL_BUILD);
		var res = ItemResUtil.findBuildLevelres(FIXID.STEEL_BUILD, steelBuildLevel);
		return hero.level >= res.herosteelmaxlevel;
	};
	//SteelListDlg-unittest-end
});
