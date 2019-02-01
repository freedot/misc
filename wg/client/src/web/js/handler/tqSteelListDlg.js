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
	
	//SteelListDlg-unittest-start
	var C_TAB_STEEL_IDX = 0;
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	
	this.init = function(g){
		_initParam(this, g);
		_regEvents();
	};
	
	this.openDlg = function(){
		if (!_isCanOpen()) return;
		_initDlg();
		_openDlg();
		_initInfo();
	};
	
	this.hideDlg = function(){
		if ( m_dlg ) m_dlg.hide();
	};
	
	var _isCanOpen = function(){
		var buildLevel = m_g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.STEEL_BUILD);
		if ( buildLevel == 0 ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.steellistdlg.tip.hasNoBuild);
			return false;
		}
		return true;
	};
	
	var _initParam = function(selfThis, g){
		m_this = selfThis;
		m_g = g;
	};
	
	var _regEvents = function(){
		m_g.regEvent(EVT.HERO_UPDATE, 0, m_this, _onHeroUpdate);
		m_g.regEvent(EVT.ROLEBASE, 0, m_this, _onRolebaseChange);
	};
	
	var _initDlg = function(){
		if (m_dlg) return;
		
		_createDlg();
		_setCallers();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal:false, title:rstr.steellistdlg.title, pos:{x:'center', y:50} });
		m_g.getGUI().initDlg(m_dlg, uicfg.hero.steellistdlg, m_items);
	};
	
	var _setCallers = function(){
		var items = m_items.tabList.getTabItems(C_TAB_STEEL_IDX);
		items.list.setCaller({self:m_this, caller:_onClickListItem});
		items.selectAllBtn.setCaller({self:m_this, caller:_onClickSelectAll});
		items.unselectAllBtn.setCaller({self:m_this, caller:_onClickUnselectAll});
		items.stopsteelAllBtn.setCaller({self:m_this, caller:_onClickStopSteelAll});
		items.steelBtn.setCaller({self:m_this, caller:_onClickSteel});
		items.highsteelBtn.setCaller({self:m_this, caller:_onClickHighSteel});
		m_dlg.setCaller({self:m_this,caller:_onDlgEvent});
		m_items.vip1SteelBtn.setCaller({self:m_this, caller:_onClickVip1Steel});
		m_items.vip2SteelBtn.setCaller({self:m_this, caller:_onClickVip2Steel});
	};
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		m_items.tabList.activeTab(0);
		_updateHerosList();
		m_g.regUpdater(m_this, _onUpdate, 1000);
		_updateVipSteelBtns();
	};
	
	var _updateHerosList = function(){
		if ( !_isShow() ) return;
		_setHerosListItems();
		_updateSteelTimes();
		_updateSteelGetExps();
		_setHerosListCallers();
	};
	
	var _updateVipSteelBtns = function(){
		if ( m_g.getImgr().getVipEffectVal(VIP_EFF.HERO_HIGH_STEEL) >= 1 ) {
			m_items.vip1SteelBtn.visible();
		} else {
			m_items.vip1SteelBtn.hidden();
		}
		if ( m_g.getImgr().getVipEffectVal(VIP_EFF.HERO_HIGH_STEEL) == 2 ) {
			m_items.vip2SteelBtn.visible();
		} else {
			m_items.vip2SteelBtn.hidden();
		}
	};
	
	var _isShow = function(){
		if ( !m_dlg ) return false;
		
		return m_dlg.isShow();
	};
	
	var _setHerosListItems = function(){
		var heros = m_g.getImgr().getHeros().list;
		var items = m_items.tabList.getTabItems(C_TAB_STEEL_IDX);
		items.list.setItemCount(heros.length);
		
		var _setCommListItems = function(item, hero){
			var imgr = m_g.getImgr();
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
		
		_transferHeroList(_setListItemWhenNoSteel, _setListItemWhenSteel);
	};
	
	var _setHerosListCallers = function(){
		var _hideOpBtnListItem = function(item, hero){
			item.exsubs.opBtn.hide();
		};
		
		var _setOpBtnListItem = function(item, hero, listIdx){
			item.exsubs.opBtn.show();
			item.exsubs.opBtn.setId(listIdx);
			item.exsubs.opBtn.setCaller({self:m_this, caller:_onClickStopSteel});
		};
		
		_transferHeroList(_hideOpBtnListItem, _setOpBtnListItem);
	};
	
	var _updateSteelTimes = function(){
		var _clearSteelTimeListItem = function(item, hero) {
			TQ.setTextEx(item.exsubs.steeltime, '--' );
		};
		
		var _setSteelTimeListItem = function(item, hero) {
			var duration = Math.clamp(m_g.getSvrTimeS() - hero.steel.startTime,  0, hero.steel.steelQuarters*900);
			TQ.setTextEx(item.exsubs.steeltime, TQ.formatTime(0, duration) );
		};
		
		_transferHeroList(_clearSteelTimeListItem, _setSteelTimeListItem);
	};
	
	var _updateSteelGetExps = function(){
		var _clearGetExpListItem = function(item, hero) {
			TQ.setTextEx(item.exsubs.getexp, 0 );
		};
		
		var _setGetExpListItem = function(item, hero) {
			var multBySvrAct = m_g.getImgr().multHeroSteelBySvrAct();
			var duration = Math.clamp(m_g.getSvrTimeS() - hero.steel.startTime,  0, hero.steel.steelQuarters*900);
			var getExp = Math.floor(duration/900)*hero.steel.quarterRes;
			TQ.setTextEx(item.exsubs.getexp, getExp*multBySvrAct);
		};
		
		_transferHeroList(_clearGetExpListItem, _setGetExpListItem);
	};
	
	var _transferHeroList = function(notSteelHeroCallBack, steelHeroCallBack){
		var heros = m_g.getImgr().getHeros().list;
		var items = m_items.tabList.getTabItems(C_TAB_STEEL_IDX);
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
	
	var _onUpdate = function(){
		_updateSteelTimes();
		_updateSteelGetExps();
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			m_g.unregUpdater(m_this, _onUpdate);
		}
	};
	
	var _onHeroUpdate = function(){
		_updateHerosList();
	};
	
	var _onRolebaseChange = function(){
		if ( !_isShow() ) return;
		_updateVipSteelBtns();
	};
	
	var _onClickStopSteel = function(idx){
		var hero = m_g.getImgr().getHeros().list[idx];
		HeroSender.sendStopHeroSteel(m_g, hero.id);
	};
	
	var _onClickListItem = function(e, idx){
		var items = m_items.tabList.getTabItems(C_TAB_STEEL_IDX);
		var item = items.list.getItem(idx);
		if ( !item ) return;
		
		var toggleCheck = item.exsubs.sel.getCheck() ? 0 : 1;
		item.exsubs.sel.setCheck(toggleCheck);
	};
	
	var _onClickSelectAll = function(){
		_selectOrUnselectAllArms(1);
	};
	
	var _onClickUnselectAll = function(){
		_selectOrUnselectAllArms(0);
	};
	
	var _onClickStopSteelAll = function(){
		var _onStopCallback = function(id) {
			if ( id == MB_IDYES ) HeroSender.sendStopAllHerosSteel(m_g);
		};
		m_g.getGUI().msgBox(rstr.comm.msgts, rstr.steellistdlg.lbl.stopAllSteel,  MB_F_YESNO, {self:m_this, caller:_onStopCallback} );
	};
	
	var _onClickSteel = function(){
		var canSteelHeros = _getSelectCanSteelHeros('steel');
		if (canSteelHeros.length == 0)  return;
		
		UIM.openDlg('steelhero', 'steel', canSteelHeros);
	};
	
	var _onClickHighSteel = function(){
		var canSteelHeros = _getSelectCanSteelHeros('highsteel');
		if (canSteelHeros.length == 0) return;
		
		UIM.openDlg('steelhero', 'highsteel', canSteelHeros);
	};
	
	var _onClickVip1Steel = function(){
		var canSteelHeros = _getSelectCanSteelHeros('highsteel');
		if (canSteelHeros.length == 0) return;
		
		UIM.openDlg('steelhero', 'vip1steel', canSteelHeros);
	};
	
	var _onClickVip2Steel = function(){
		var canSteelHeros = _getSelectCanSteelHeros('highsteel');
		if (canSteelHeros.length == 0) return;
		
		UIM.openDlg('steelhero', 'vip2steel', canSteelHeros);
	};
	
	var _selectOrUnselectAllArms = function(checkFlag){
		var items = m_items.tabList.getTabItems(C_TAB_STEEL_IDX);
		for ( var i=0; i<items.list.getCount(); ++i ){
			var item = items.list.getItem(i);
			item.exsubs.sel.setCheck(checkFlag);
		}
	};
	
	var _getSelectCanSteelHeros = function(steelType){
		var canSteelHeros = _collectCanSteelHeros(steelType);
		var warningTip = _getWarningTip(canSteelHeros, steelType);
		if ( warningTip != '' ) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, warningTip);
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
			,NotSpec.snew(NoMaxLevelHeroSpec.snew(m_g))
			);
		return _collectHeros(spec).length;
	};
	
	var _getSelectArrivedMaxBuildLevelCount = function(steelType){
		var spec = AndSpec.snew(
			FreeHeroSpec.snew()
			,CheckSpec.snew()
			,NoMaxLevelHeroSpec.snew(m_g)
			,NotSpec.snew(NoMaxBuildLevelSpec.snew(m_g, steelType))
			);
		return _collectHeros(spec).length;
	};
	
	var _collectCanSteelHeros = function(steelType){
		var spec = AndSpec.snew(
			FreeHeroSpec.snew()
			,CheckSpec.snew()
			,NoMaxLevelHeroSpec.snew(m_g)
			,NoMaxBuildLevelSpec.snew(m_g, steelType)
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
		var heros = m_g.getImgr().getHeros().list;
		var items = m_items.tabList.getTabItems(C_TAB_STEEL_IDX);
		for ( var i=0; i<items.list.getCount(); ++i ){
			var item = items.list.getItem(i);
			var hero = heros[i];
			if ( spec.isSatisfiedBy(item, hero) ) {
				collectHeros.push(hero);
			}
		}
		return collectHeros;
	};

	var _isArriveMaxBuildLevel = function(hero){
		var steelBuildLevel = m_g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.STEEL_BUILD);
		var res = ItemResUtil.findBuildLevelres(FIXID.STEEL_BUILD, steelBuildLevel);
		return hero.level >= res.herosteelmaxlevel;
	};
	//SteelListDlg-unittest-end
});
