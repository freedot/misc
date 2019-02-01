/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
ARM_EFF_MAP_ATTR = {};
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_STR] = ATTR.ST_B;
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_PHY] = ATTR.PH_B;
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_AGILE] = ATTR.AG_B;
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_CO] = ATTR.CO;
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_JIN_SKILL_LEVEL] = ATTR.JIN_SKILL_LEVEL;
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_MU_SKILL_LEVEL] = ATTR.MU_SKILL_LEVEL;
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_SHUI_SKILL_LEVEL] = ATTR.SHUI_SKILL_LEVEL;
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_HUO_SKILL_LEVEL] = ATTR.HUO_SKILL_LEVEL;
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_TU_SKILL_LEVEL] = ATTR.TU_SKILL_LEVEL;
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_SP] = ATTR.SP;
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_ATT] = ATTR.HU;
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_DEF] = ATTR.DE;
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_HIT] = ATTR.HI;
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_ES] = ATTR.ES;
ARM_EFF_MAP_ATTR[RES_EFF.H_ADD_MPS] = ATTR.MPS;
	
MAX_GEMS_POS_COUNT = 3;

GemUtil = Class.extern(function(){
	this.isMaxGemLevel = function(resid){
		var res = ItemResUtil.findItemres(resid);
		return (res.gemLevel >= res_max_gem_level);
	};
	
	this.getCombineNeedNumber = function(level){
		return res_gem_combinelevels[level-1].needNumber;
	};
	
	this.hasSameTypeGems = function(armItem, gemResId){
		for ( var i=0; i<armItem.gems.length; ++i ) {
			var curGemResId = armItem.gems[i];
			if ( this._getGemEffectId(curGemResId) == this._getGemEffectId(gemResId) ) {
				return true;
			}
		}
		return false;
	};
	
	this._getGemEffectId = function(resid){
		var res = ItemResUtil.findItemres(resid);
		return res.effects[0].id;
	};
	
}).snew();

SysItemMaker = Class.extern(function(){
	this.make = function(id, itemres, buylimit) {
		return {id:id, itemres:itemres, appendDesc:this._makeProAttrsDesc(itemres), resid:itemres.id,  attrs:this._makeAttrs(itemres), buylimit:buylimit};
	};
	
	this._makeAttrs = function(itemres){
		if (!itemres.effects) {
			return {};
		}
		
		var attrs = {};
		for (var i=0; i<itemres.effects.length; ++i ) {
			var effect = itemres.effects[i];
			if (effect.id && effect.pro && effect.pro == 100 && effect.min > 0){
				var val = effect.min;
				var unit = effect.unit ? effect.unit : 0;
				attrs[ ARM_EFF_MAP_ATTR[effect.id] ] = {val:effect.min, u:unit};
			}
		}
		
		return attrs;
	};
	
	this._makeProAttrsDesc = function(itemres){
		if (!itemres.effects) {
			return '';
		}
		
		var s = '';
		for (var i=0; i<itemres.effects.length; ++i ) {
			var effect = itemres.effects[i];
			if (effect.id && effect.pro && effect.pro < 100) {
				var attrRes = TQ.qfind(res_attrs , 'id', effect.id);
				if (!attrRes) continue;
				s += attrRes.name;
				s += ' ';
			}
		}
		
		if (s == '') return s;
		return rstr.comm.proget + s;
	};
}).snew();

ArmOpDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	_lc_.m_panels = [];
	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
	};
	
	this.openDlg = function(tabIdx){
		_lc_._initDlg();
		_lc_._openDlg();
		_lc_._initInfo(tabIdx);
	};
	
	this.isShow = function(){
		if (!_lc_.m_dlg) {
			return false;
		}
		
		return _lc_.m_dlg.isShow();
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		
		_lc_.m_dlg = Dialog.snew(_lc_.m_g, {modal:false, title:rstr.armopdlg.title, pos:{x:"center", y:30} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.armopdlg, _lc_.m_items);
		_lc_._initTabsText();
		_lc_._createOpPanels();
	};
	
	_lc_._openDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(tabIdx){
		_lc_.m_items.tabList.activeTab(tabIdx);
		_lc_._updatePanels();
	};
	
	_lc_._updatePanels = function(){
		for ( var i=0;  i<_lc_.m_panels.length; ++i ) {
			_lc_.m_panels[i].update();
		}
	};
	
	_lc_._initTabsText = function(){
		for ( var i=0, cnt=_lc_.m_items.tabList.getTabCount(); i<cnt; ++i ){
			_lc_.m_items.tabList.setTabText(i, rstr.armopdlg.tabs[i]);
		}
	};

	_lc_._createOpPanels = function(){
		_lc_.m_panels = [];
		_lc_.m_panels.push( BuyArmOpPanel.snew(_lc_.m_g, _lc_.m_this, _lc_.m_items.tabList.getTabItems(0) ) );
		_lc_.m_panels.push( SplitArmOpPanel.snew(_lc_.m_g, _lc_.m_this, _lc_.m_items.tabList.getTabItems(1) ) );
		_lc_.m_panels.push( IntensifyArmOpPanel.snew(_lc_.m_g, _lc_.m_this, _lc_.m_items.tabList.getTabItems(2) ) );
		_lc_.m_panels.push( CombineGemOpPanel.snew(_lc_.m_g, _lc_.m_this, _lc_.m_items.tabList.getTabItems(3) ) );
		_lc_.m_panels.push( BesetGemOpPanel.snew(_lc_.m_g, _lc_.m_this, _lc_.m_items.tabList.getTabItems(4) ) );
	};

	//ArmOpDlg-unittest-end
});

ArmListWithHerosAndArmPos = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_this = null;
	this.g = null;
	this.panel = null;
	this.items = null;
	this.myArms = [];
	
	this.init = function(g, panel, items){
		_lc_.m_this = this;
		this.g = g;
		this.panel = panel;
		this.items = items;
		
		_lc_._regEvents();
		_lc_._setCallers();
		_lc_._setArmPosDropList();
	};
	
	this.updateArmList = function(){
		var itemId = this._getLastSelItemId();
		this.myArms = _lc_._filterMyArms();
		this.panel.sortArms(this.myArms);
		this.panel.setMyArmListItems(this.items.armList, this.myArms);
		_lc_._resetArmListCurSel(itemId);
		this.panel.setListTipCaller(this.items.armList, _lc_._onGetMyArmListTip);
	};
	
	this.updateHeroList = function(){
		this.items.heroDropList.deleteAllItem();
		
		var heros = this.g.getImgr().getHeros().list;
		this.items.heroDropList.addItem( {text:rstr.comm.pkg} );
		for (var i=0; i<heros.length; ++i ) {
			this.items.heroDropList.addItem( { text:heros[i].name } );
		}
		
		if (this.items.heroDropList.getCurSel() < 0) {
			this.items.heroDropList.setCurSel(1);
		} else {
			this.items.heroDropList.setCurSel(this.items.heroDropList.getCurSel());
		}
	};	
	
	this.getCurSelArm = function(){
		var curArm = this.myArms[this.items.armList.getCurSel()];
		if (curArm && !curArm.gems) {
			curArm.gems = [];
		}
		return curArm;
	};
	
	this.getCurHeroId = function(){
		var hero = this.g.getImgr().getHeroByIdx(_lc_._getCurHeroIdx() );
		if (!hero) {
			return 0;
		}
		
		return hero.id;
	};
	
	this._getLastSelItemId = function(){
		var idx = this.items.armList.getCurSel();
		if ( idx >= 0 && idx < this.myArms.length ) {
			return this.myArms[idx].id;
		} else {
			return 0;
		}
	};
	
	_lc_._resetArmListCurSel = function(itemId){
		if ( !TQ.find(_lc_.m_this.myArms, 'id', itemId) ) {
			_lc_.m_this.items.armList.setCurSel(0);
		} else {
			_lc_.m_this.items.armList.setCurSel(TQ.getLastFindIdx());
		}
	};

	_lc_._regEvents = function(){
		_lc_.m_this.g.regEvent(EVT.HERO_UPDATE, 0, _lc_.m_this, _lc_._onHeroUpdate);
	};
	
	_lc_._setCallers = function(){
		_lc_.m_this.items.armPosDropList.setCaller({self:_lc_.m_this, caller:_lc_._onClickArmPosDropList});
		_lc_.m_this.items.heroDropList.setCaller({self:_lc_.m_this, caller:_lc_._onClickHeroDropList});
	};
	
	_lc_._setArmPosDropList =function(){
		var armPosNames = rstr.armopdlg.intensifyarms.armPosName;
		for (var k in armPosNames) {
			_lc_.m_this.items.armPosDropList.addItem({text:armPosNames[k]});
		}
		_lc_.m_this.items.armPosDropList.setCurSel(0);
	};
	
	_lc_._filterMyArms = function(){
		var armPosFilter = CanIntensifyArmPosFilter.snew(_lc_.m_this.g);
		return armPosFilter.filter({armPos:_lc_._getCurArmPos(), items:_lc_._getCurSelPkgOrHeroWears()});
	};
	
		
	
	_lc_._onGetMyArmListTip = function(data){
		return TIPM.getItemDesc(_lc_.m_this.myArms[data.idx]);
	};
	
	_lc_._onClickArmPosDropList = function(e, idx){
		_lc_.m_this.updateArmList();
		_lc_._selectFirstArmInList();
	};
	
	_lc_._onClickHeroDropList = function(e, idx){
		_lc_.m_this.updateArmList();
		_lc_._selectFirstArmInList();
	};	
	
	_lc_._onHeroUpdate = function(){
		if ( !_lc_.m_this.panel.dlg.isShow() ) return;
		
		_lc_.m_this.updateArmList();
	};
	
	_lc_._selectFirstArmInList = function(){
		_lc_.m_this.items.armList.setCurSel(0);
	};
	
	_lc_._getCurArmPos = function(){
		return _lc_.m_this.items.armPosDropList.getCurSel();
	};
	
	_lc_._getCurSelPkgOrHeroWears = function(){
		var imgr = _lc_.m_this.g.getImgr();
		
		if ( _lc_._isSelectedPkg() ) {
			return imgr.getPkgs().items;
		}
		
		var hero = imgr.getHeroByIdx(_lc_._getCurHeroIdx());
		if (!hero) {
			return [];
		}
		
		if (!imgr.isDetailHero(hero)) {
			HeroSender.sendGetDetail(_lc_.m_this.g, hero.id);
			return [];
		}
		
		var arms = [];
		for ( var k in hero.wears ) {
			var wear = hero.wears[k];
			if (!wear) continue;
			
			arms.push(wear);
		}
		
		return arms;
	};

	_lc_._isSelectedPkg = function(){
		return _lc_.m_this.items.heroDropList.getCurSel() <= 0;
	};	
	
	_lc_._getCurHeroIdx = function(){
		return _lc_.m_this.items.heroDropList.getCurSel() - 1; // trim first item pkg idx
	};
	
	//ArmListWithHerosAndArmPos-unittest-end
});

BaseArmOpPanel = Class.extern(function(){
	this.g = null;
	this.dlg = null;
	this.items = null;
	this.init = function(g, dlg, items){
		this.g = g;
		this.dlg = dlg;
		this.items = items;
		this.initPanel();
	};
	
	this.initPanel = function(){
	};
	
	this.update = function(){
	};
	
	this.sortArms = function(arms){
		var _sortCmp = function(a, b) {
			if ( !a.flevel ) {
				a.flevel = 0;
			}
			
			if ( !b.flevel ) {
				b.flevel = 0;
			}
			
			if (a.flevel != b.flevel) {
				return b.flevel - a.flevel;
			}
			
			if (a.itemres.level != b.itemres.level){
				return b.itemres.level - a.itemres.level;
			}
			
			return a.itemres.apos - b.itemres.apos;
		};
		
		arms.sort(_sortCmp);		
	};
	
	this.setMyArmListItems = function(armList, arms){
		armList.setItemCount(arms.length);
		for (var i=0, cnt=armList.getCount(); i<cnt; ++i ) {
			var item = armList.getItem(i);
			var ritem = arms[i];
			CommDrawItem.drawItemName(item.exsubs.name, ritem.itemres);
			this.setListItemSecField(item, ritem);
		}
	};
	
	this.setListTipCaller = function(list, caller){
		for (var i=0, cnt=list.getCount(); i<cnt; ++i ) {
			var item = list.getItem(i);
			TTIP.setCallerData(item.exsubs.tooltips[TIP_PREFIX + 'item'], {self:this, caller:caller}, {idx:i});
		};
	};
	
	this.setListItemSecField = function(item, ritem){
		TQ.setTextEx(item.exsubs.levelOrNumber, ritem.flevel ? TQ.format(rstr.armopdlg.flevel, ritem.flevel) : '');
	};
	
	this.resetListCurSel = function(list){
		var isNotSelected = list.getCurSel() < 0;
		if (isNotSelected) { // default select first arm
			list.setCurSel(0);
		}
		else { // reset the select pos, if the last select item be remove, this call will reposition
			list.setCurSel( list.getCurSel() );
		}
	};	
});

BuyArmOpPanel = BaseArmOpPanel.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var m_this = null;
	_lc_.m_saleItems = [];
	_lc_.m_myCanSaleItems = [];
	this.initPanel = function(){
		m_this = this;
		_lc_._regEvents();
		_lc_._setCallers();
	};
	
	this.update = function(){
		_lc_._updateSaleList();
		_lc_._updateMyItemList();
	};
	
	_lc_._regEvents = function(){
		m_this.g.regEvent(EVT.PKG_CHANGE, 0, m_this, _lc_._onItemChanged);
	};
	
	_lc_._setCallers = function(){
		m_this.items.saleList.setCaller({self:m_this, caller:_lc_._onClickSaleList});
		m_this.items.myItemList.setCaller({self:m_this, caller:_lc_._onClickMyItemList});
	};
	
	_lc_._updateSaleList = function(){
		_lc_._setSaleListItems();
		_lc_._setSaleListTipCaller();
	};
	
	_lc_._updateMyItemList = function(){
		_lc_._setMyItemListItems();
		_lc_._setMyItemListCaller();
	};
	
	_lc_._setSaleListItems = function(){
		var res = res_smithy_salelist[ m_this.g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.SMITHY) - 1 ];
		if (!res) {
			m_this.items.saleList.setItemCount(0);
			return;
		}
		
		_lc_._createResSaleItemIds(res);
		_lc_._createSaleItems(res.items);
		m_this.items.saleList.setItemCount(_lc_.m_saleItems.length);
		for (var i=0, cnt=m_this.items.saleList.getCount(); i<cnt; ++i ) {
			var item = m_this.items.saleList.getItem(i);
			CommDrawItem.drawItemIcon(item.exsubs.icon, _lc_.m_saleItems[i].itemres);
		}
	};
	
	_lc_._setMyItemListItems = function(){
		var filter = CanSaleFilterEx.snew(m_this.g);
		_lc_.m_myCanSaleItems = filter.filter();
		m_this.items.myItemList.setItemCount(_lc_.m_myCanSaleItems.length);
		for (var i=0, cnt=m_this.items.myItemList.getCount(); i<cnt; ++i ) {
			var item = m_this.items.myItemList.getItem(i);
			CommDrawItem.drawItemIcon(item.exsubs.icon, _lc_.m_myCanSaleItems[i].itemres);
		}
	};	
	
	_lc_._setSaleListTipCaller = function(){
		m_this.setListTipCaller(m_this.items.saleList, _lc_._onGetSaleListTip);
	};
	
	_lc_._setMyItemListCaller = function(){
		m_this.setListTipCaller(m_this.items.myItemList, _lc_._onGetMyItemListTip);
	};
	
	_lc_._onGetSaleListTip = function(data){
		return TIPM.getItemDesc(_lc_.m_saleItems[data.idx], 'sys');
	};
	
	_lc_._onGetMyItemListTip = function(data){
		return TIPM.getItemDesc(_lc_.m_myCanSaleItems[data.idx]);
	};
	
	_lc_._onItemChanged = function(){
		if ( !m_this.dlg.isShow() ) return;
		
		_lc_._updateMyItemList();
	};
	
	_lc_._onClickSaleList = function(e, idx){
		var curItem = _lc_.m_saleItems[idx];
		if (!curItem) return;
		
		var buyItemDlg = UIM.getDlg('buyitem');
		buyItemDlg.openDlg({id:0, resid:curItem.resid, number:10000});
	};
	
	_lc_._onClickMyItemList = function(e, idx){
		var curItem = _lc_.m_myCanSaleItems[idx];
		if (!curItem) return;
		
		var _onSaleCallback = function(id){
			if ( id == MB_IDYES ) ShopSender.sendSaleItem(m_this.g, curItem);
		};
		
		var name = ItemNameColorGetter.getColorVal(curItem.itemres.level, curItem.itemres.name);
		var msg = TQ.format(rstr.armopdlg.buyarms.lbl.saleMyItem, name, curItem.itemres.salePrice);
		m_this.g.getGUI().msgBox(rstr.comm.msgts, msg,  MB_F_YESNO, {self:m_this, caller:_onSaleCallback} );
	};
	
	_lc_._createResSaleItemIds = function(res){
		if (res.items) return;
		
		res.items = [];
		var sitemIds = res.sitemIds.split(',');
		for ( var i=0; i<sitemIds.length; ++i ){
			var sid = TQ.trim(sitemIds[i]);
			if ( sid != '' ) {
				var resid = parseInt(sid, 10);
				res.items.push({resid:resid, isBind:1, itemres:ItemResUtil.findItemres(resid)});
			}
		};
		
		var _sortCmp = function(a, b) {
			if (a.itemres.level == b.itemres.level){
				return a.itemres.apos - b.itemres.apos;
			}
			else {
				return b.itemres.level - a.itemres.level;
			}
		};
		
		res.items.sort(_sortCmp);
	};
	
	_lc_._createSaleItems = function(items){
		_lc_.m_saleItems = [];
		for (var i=0; i<items.length; ++i ) {
			var ritem = items[i];
			var sysItem = SysItemMaker.make(i+1, ritem.itemres);
			sysItem.isBind = ritem.isBind;
			_lc_.m_saleItems.push(sysItem);
		}
	};
	
	//BuyArmOpPanel-unittest-end
});

SplitArmOpPanel = BaseArmOpPanel.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_this = null;
	
	_lc_.m_essences = [];
	var m_opResult = '';
	this.myArms = [];
	this.initPanel = function(){
		_lc_.m_this = this;
		_lc_._regEvents();
		_lc_._setCallers();
		_lc_._setArmLevelDropList();		
	};
	
	this.update = function(){
		_lc_._updateMyArmList();
		_lc_._updateMyEssenceList();
	};
	
	_lc_._regEvents = function(){
		_lc_.m_this.g.regEvent(EVT.PKG_CHANGE, 0, _lc_.m_this, _lc_._onItemChanged);
		_lc_.m_this.g.regEvent(EVT.NET, NETCMD.ITEMOP, _lc_.m_this, _lc_._onItemOpSvrCmd);
	};
	
	_lc_._setCallers = function(){
		_lc_.m_this.items.selectAll.setCaller({self:_lc_.m_this, caller:_lc_._onClickSelectAll});
		_lc_.m_this.items.armLevelDropList.setCaller({self:_lc_.m_this, caller:_lc_._onClickArmLevelDropList});
		_lc_.m_this.items.armList.setCaller({self:_lc_.m_this, caller:_lc_._onClickArmList});
		_lc_.m_this.items.splitBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickSplitBtn});
	};
	
	_lc_._setArmLevelDropList = function(){
		var itemLevels = rstr.armopdlg.splitarms.itemLevels;
		for (var k in itemLevels) {
			_lc_.m_this.items.armLevelDropList.addItem({text:itemLevels[k]});
		}
		_lc_.m_this.items.armLevelDropList.setCurSel(0);
	};
	
	_lc_._updateMyArmList = function(){
		_lc_._filterMyArms();
		_lc_.m_this.sortArms(_lc_.m_this.myArms);
		_lc_._setMyArmListItems();
		_lc_._setMyArmListTipCaller();
	};
	
	_lc_._filterMyArms = function(){
		var decomposeFilter = CanSplitArmFilter.snew(_lc_.m_this.g);
		var canDecomposeArms = decomposeFilter.filter();
		
		var itemLevelFilter = ItemLevelFilter.snew();
		_lc_.m_this.myArms = itemLevelFilter.filter({itemLevel:_getCurSelArmLevel(), items:canDecomposeArms});
	};
	
	_lc_._setMyArmListItems = function(){
		_lc_.m_this.setMyArmListItems(_lc_.m_this.items.armList, _lc_.m_this.myArms);
	};
	
	_lc_._updateMyEssenceList = function(){
		_lc_._setMyEssenceListItems();
		_lc_._setMyEssenceListTipCaller();
	};
	
	_lc_._setMyEssenceListItems = function(){
		_lc_.m_essences = _lc_._getMyEssenceItems();
		_lc_.m_this.items.essenceList.setItemCount(_lc_.m_essences.length);
		for (var i=0, cnt=_lc_.m_this.items.essenceList.getCount(); i<cnt; ++i ) {
			var item = _lc_.m_this.items.essenceList.getItem(i);
			var ritem = _lc_.m_essences[i];
			CommDrawItem.drawIconAndNumber(item, ritem);
		}
	};
	
	_lc_._setMyArmListTipCaller = function(){
		_lc_.m_this.setListTipCaller(_lc_.m_this.items.armList, _lc_._onGetMyArmListTip);
	};
	
	_lc_._setMyEssenceListTipCaller = function(){
		_lc_.m_this.setListTipCaller(_lc_.m_this.items.essenceList, _lc_._onGetEssenceListTip);
	};
	
	_lc_._getMyEssenceItems = function(){
		var resIds = [
			FIXID.ESSENCE_LVL1
			,FIXID.ESSENCE_LVL2
			,FIXID.ESSENCE_LVL3
			,FIXID.ESSENCE_LVL4
			,FIXID.ESSENCE_LVL5
			];
			
		var items = [];
		for (var i=0; i<resIds.length; ++i ) {
			var resId = resIds[i];
			var number = _lc_.m_this.g.getImgr().getItemNumByResId( resId );
			var itemres = ItemResUtil.findItemres(resId);
			if (itemres.nobindid) itemres = ItemResUtil.findItemres(itemres.nobindid);
			items.push ( {number:number, resid:itemres.id, itemres:itemres} );
		}
		
		return items;
	};
	
	_lc_._onItemChanged = function(){
		if ( !_lc_.m_this.dlg.isShow() ) return;
		
		_lc_.m_this.update();
	};
	
	_lc_._onItemOpSvrCmd = function(netData){
		if (!netData.data.splitResults) {
			return;
		}
		
		for (var i=0; i<netData.data.splitResults.length; ++i ) {
			var result = netData.data.splitResults[i];
			if (result.resid == FIXID.REFINESTONE){
				m_opResult += TQ.format(rstr.armopdlg.splitarms.svr.returnResult 
					,result.forceLevel
					,RStrUtil.getNameByResId(result.armResid)
					,result.number);				
			}
			else {
				m_opResult += TQ.format( rstr.armopdlg.splitarms.svr.splitResult 
					,RStrUtil.getNameByResId( result.armResid )
					,RStrUtil.getNameByResId( result.resid )
					,result.number );
			}
		}
		
		TQ.setHtml(_lc_.m_this.items.result.getContainerObj(), m_opResult);
		_lc_.m_this.items.result.refresh();
		_lc_.m_this.items.result.scrollEnd();
	};
	
	_lc_._onGetMyArmListTip = function(data){
		return TIPM.getItemDesc(_lc_.m_this.myArms[data.idx]);
	};
	
	_lc_._onGetEssenceListTip = function(data){
		return TIPM.getItemDesc(_lc_.m_essences[data.idx]);
	};
	
	_lc_._onClickSelectAll = function(){
		var checkFlag = _lc_.m_this.items.selectAll.getCheck();
		_selectOrUnselectAllArms(checkFlag);
	};
	
	_lc_._onClickArmLevelDropList = function(e, idx){
		_lc_._updateMyArmList();
		_lc_._unselectAllArms();
	};
	
	_lc_._onClickArmList = function(e, idx){
		if ( idx < 0 || idx >= _lc_.m_this.items.armList.getCount() ) {
			return;
		}
		
		var item = _lc_.m_this.items.armList.getItem(idx);
		var toggleCheck = item.exsubs.sel.getCheck() ? 0 : 1;
		item.exsubs.sel.setCheck(toggleCheck);
	};
	
	_lc_._onClickSplitBtn = function(){
		var needSplitItemIds = [];
		for ( var i=0; i<_lc_.m_this.myArms.length; ++i ) {
			var listItem = _lc_.m_this.items.armList.getItem(i);
			if (listItem.exsubs.sel.getCheck() == 1){
				needSplitItemIds.push(_lc_.m_this.myArms[i].id);
			}
		}
		
		if (needSplitItemIds.length == 0){
			_lc_.m_this.g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100025].msg);
		}
		else {
			ItemOpSender.sendDecomposeIds(_lc_.m_this.g, needSplitItemIds);
			_lc_._unselectAllArms();
		}
	};
	
	var _getCurSelArmLevel = function(){
		return _lc_.m_this.items.armLevelDropList.getCurSel();
	};
	
	_lc_._unselectAllArms = function(){
		_selectOrUnselectAllArms(0);
	};
	
	var _selectOrUnselectAllArms = function(checkFlag){
		for (var i=0, cnt=_lc_.m_this.items.armList.getCount(); i<cnt; ++i ) {
			var item = _lc_.m_this.items.armList.getItem(i);
			item.exsubs.sel.setCheck(checkFlag);
		}
	};
	
	//SplitArmOpPanel-unittest-end
});

IntensifyArmOpPanel = BaseArmOpPanel.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_this = null;
	_lc_.m_armList = null;
	this.initPanel = function(){
		_lc_.m_this = this;
		_lc_.m_armList = ArmListWithHerosAndArmPos.snew(this.g, this, this.items);
		
		_lc_._regEvents();
		_lc_._setCallers();
		_lc_._setCurArmTipCaller();
	};
	
	this.update = function(){
		_lc_.m_armList.updateHeroList();
		_lc_.m_armList.updateArmList();
		_lc_._updateMyHasMaterials();
	};
	
	_lc_._regEvents = function(){
		_lc_.m_this.g.regEvent(EVT.PKG_CHANGE, 0, _lc_.m_this, _lc_._onItemChanged);
		_lc_.m_this.g.regEvent(EVT.NET, NETCMD.ITEMOP, _lc_.m_this, _lc_._onItemOpSvrCmd);
	};
	
	_lc_._setCallers = function(){
		_lc_.m_this.items.armList.setCaller({self:_lc_.m_this, caller:_lc_._onClickArmList});
		_lc_.m_this.items.buyMaterial1Btn.setCaller({self:_lc_.m_this, caller:_lc_._onClickBuyStone});
		_lc_.m_this.items.buyMaterial2Btn.setCaller({self:_lc_.m_this, caller:_lc_._onClickBuyEssence});
		_lc_.m_this.items.intensifyBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickIntensify});
	};
	
	_lc_._setCurArmTipCaller = function(){
		TTIP.setCallerData(_lc_.m_this.items.tooltips[TIP_PREFIX + 'curarm'], {self:_lc_.m_this, caller:_lc_._onGetCurArmTip}, {});
	};
	
	_lc_._onGetCurArmTip = function(){
		return TIPM.getItemDesc( _lc_.m_armList.getCurSelArm() );
	};
	
	_lc_._onItemChanged = function(){
		if ( !_lc_.m_this.dlg.isShow() ) return;
		
		_lc_.m_armList.updateArmList();
		_lc_._updateMyHasMaterials();
	};
	
	_lc_._onItemOpSvrCmd = function(netData){
		if (!netData.data.intensifyResult) {
			return;
		}
		
		var resIdx = netData.data.intensifyResult.forceLevel-1;
		var forceRes = res_force_arms[resIdx];
		
		var s = TQ.format(rstr.armopdlg.intensifyarms.svr.intensifyResult,
			RStrUtil.getNameByResId(netData.data.intensifyResult.resid),
			forceRes.effect);
		TQ.setTextEx(_lc_.m_this.items.result, s);
	};
	
	_lc_._onClickArmList = function(e, idx){
		var curArm = _lc_.m_armList.getCurSelArm();
		if (!curArm){
			_lc_._clearAllCurArmInfo();
			return;
		}
		
		_lc_._updateCurArmIconName(curArm);
		_lc_._updateCurArmAttrs(curArm);
		_lc_._updateCurForceLevelDesc(curArm);
		_lc_._updateNextForceLevelDesc(curArm);
		_lc_._updateNextForceLevelNeed(curArm);
		_lc_._updateIntensifySuccessRate(curArm);
		_lc_._updateMyHasMaterials();
	};
	
	_lc_._onClickBuyStone = function(){
		var buyitemdlg = UIM.getDlg('buyitem');
		buyitemdlg.openDlg({id:0, resid:FIXID.REFINESTONE, number:100000});
	};
	
	_lc_._onClickBuyEssence = function(){
		var ids = [3000074,3000075,3000076];
		UIM.getDlg('buyitemlist').openDlg(ids);
	};

	_lc_._onClickIntensify = function(){
		TQ.setTextEx(_lc_.m_this.items.result, '');
		
		var curArm = _lc_.m_armList.getCurSelArm();
		
		if (!curArm) {
			_lc_.m_this.g.getGUI().sysMsgTips(SMT_WARNING, rstr.armopdlg.intensifyarms.tips.noselectArm);
			return;
		}
			
		if (_lc_._isArriveMaxForceLevel( _getForceLevelFromArm(curArm) )){
			_lc_.m_this.g.getGUI().sysMsgTips(SMT_WARNING, rstr.armopdlg.intensifyarms.tips.maxForceLevel);
			return;
		}
		
		if (!_lc_._hasEnoughExpends(curArm)){
			return;
		}
		
		ItemOpSender.sendIntensifyArm(_lc_.m_this.g, _lc_.m_armList.getCurHeroId(), curArm.id);
	};
	
	_lc_._clearAllCurArmInfo = function(){
		_clearCurArmIconName();
		_clearCurArmAttrs();
		_clearCurForceLevelDesc();
		_clearNextForceLevelDesc();
		_clearForceNeedMaterials();
		_clearMyHasMaterials();
		_clearForceSuccRate();
	};
	
	_lc_._updateCurArmIconName = function(curArm){
		CommDrawItem.drawItemIconAndName(_lc_.m_this.items.curIcon, _lc_.m_this.items.curName, curArm.itemres);
	};
	
	_lc_._updateCurArmAttrs = function(curArm){
		TQ.setTextEx(_lc_.m_this.items.strength, _lc_._getAttrStr(curArm, ATTR.ST_B, ATTR.ST_A) );
		TQ.setTextEx(_lc_.m_this.items.agile, _lc_._getAttrStr(curArm, ATTR.AG_B, ATTR.AG_A) );
		TQ.setTextEx(_lc_.m_this.items.physical, _lc_._getAttrStr(curArm, ATTR.PH_B, ATTR.PH_A) );
	};
	
	_lc_._updateCurForceLevelDesc = function(curArm){
		TQ.setTextEx(_lc_.m_this.items.curIntensifyLevel, TQ.format(rstr.armopdlg.intensifyarms.lbl.forceLevelTitle, _getForceLevelFromArm(curArm)) );

		var forceRes = _getForceLevelRes( _getForceLevelFromArm(curArm) );
		var effect = forceRes ? forceRes.effect : 0;
		TQ.setTextEx(_lc_.m_this.items.curIntensifyEffect, TQ.format(rstr.armopdlg.intensifyarms.lbl.forceLevelEffect, effect) );
	};
	
	_lc_._updateNextForceLevelDesc = function(curArm){
		if (_lc_._isArriveMaxForceLevel( _getForceLevelFromArm(curArm) )) {
			_setNextForceLevelDescIsMax();
			return;
		}
		
		var nextLevel = _getForceLevelFromArm(curArm) + 1;
		TQ.setTextEx(_lc_.m_this.items.nextIntensifyLevel, TQ.format(rstr.armopdlg.intensifyarms.lbl.forceLevelTitle, nextLevel) );
		
		var forceRes = _getNextForceLevelRes( _getForceLevelFromArm(curArm) );
		TQ.setTextEx(_lc_.m_this.items.nextIntensifyEffect, TQ.format(rstr.armopdlg.intensifyarms.lbl.forceLevelEffect, forceRes.effect) );
	};
	
	_lc_._updateNextForceLevelNeed = function(curArm){
		if (_lc_._isArriveMaxForceLevel( _getForceLevelFromArm(curArm) )) {
			_clearForceNeedMaterials();
			return;
		}
		
		var forceRes = _getNextForceLevelRes( _getForceLevelFromArm(curArm) );
		for ( var i=0; i<2; ++i ){
			var expend = forceRes.expends[i];
			TQ.setTextEx(_lc_.m_this.items['needMaterial' + (i+1)],
				TQ.format(rstr.armopdlg.intensifyarms.lbl.needItemNumber, RStrUtil.getNoBindNameByResId(expend.resid), expend.val) );
		}
	};
	
	_lc_._updateIntensifySuccessRate = function(curArm){
		if (_lc_._isArriveMaxForceLevel( _getForceLevelFromArm(curArm) )) {
			TQ.setTextEx(_lc_.m_this.items.succPro, '');
			return;
		}
		
		var forceRes = _getNextForceLevelRes( _getForceLevelFromArm(curArm) );
		TQ.setTextEx(_lc_.m_this.items.succPro, TQ.format(rstr.armopdlg.intensifyarms.lbl.successPro, forceRes.succPro));
	};
	
	_lc_._updateMyHasMaterials = function(){
		var curArm = _lc_.m_armList.getCurSelArm();
		if (!curArm){
			_clearMyHasMaterials();
			return;
		}
		
		if (_lc_._isArriveMaxForceLevel( _getForceLevelFromArm(curArm) )) {
			_clearMyHasMaterials();
			return;
		}
		
		var forceRes = _getNextForceLevelRes( _getForceLevelFromArm(curArm) );
		for ( var i=0; i<2; ++i ){
			var expend = forceRes.expends[i];
			TQ.setTextEx(_lc_.m_this.items['hasMaterial' + (i+1)],
				TQ.format(rstr.armopdlg.intensifyarms.lbl.curHasItemNumber, 
					_lc_.m_this.g.getImgr().getItemNumByResId(expend.resid)) );
		}
	};	
	
	var _setNextForceLevelDescIsMax = function(){
		TQ.setTextEx(_lc_.m_this.items.nextIntensifyLevel, rstr.armopdlg.intensifyarms.lbl.fullForceLevelTitle );
		TQ.setTextEx(_lc_.m_this.items.nextIntensifyEffect, rstr.armopdlg.intensifyarms.lbl.fullForceLevelEffect );
	};
	
	var _clearCurArmIconName = function(){
		_clearDomsText(['curName']);
		IMG.setBKImage(_lc_.m_this.items.curIcon, '');
		TQ.setClass(_lc_.m_this.items.curIcon, '');
	};
	
	var _clearCurArmAttrs = function(){
		_clearDomsText(['strength', 'agile', 'physical']);
	};
	
	var _clearCurForceLevelDesc = function(){
		_clearDomsText(['curIntensifyLevel', 'curIntensifyEffect']);
	};
	
	var _clearNextForceLevelDesc = function(){
		_clearDomsText(['nextIntensifyLevel', 'nextIntensifyEffect']);
	};
	
	var _clearForceNeedMaterials = function(){
		_clearDomsText(['needMaterial1', 'needMaterial2']);
	};

	var _clearMyHasMaterials = function(){
		_clearDomsText(['hasMaterial1', 'hasMaterial2']);
	};
	
	var _clearForceSuccRate = function(){
		_clearDomsText(['succPro']);
	};
	
	var _clearDomsText = function(domNames){
		for ( var k in domNames ) {
			TQ.setTextEx(_lc_.m_this.items[ domNames[k] ], '');
		}
	};
	
	
	_lc_._isArriveMaxForceLevel = function(forceLevel){
		return forceLevel >= res_max_forcelevel;
	};
	
	_lc_._hasEnoughExpends = function(curArm){
		var forceRes = _getNextForceLevelRes( _getForceLevelFromArm(curArm) );
		for ( var i=0; i<2; ++i ){
			var expend = forceRes.expends[i];
			if ( _lc_.m_this.g.getImgr().getItemNumByResId(expend.resid) < expend.val ) {
				_lc_.m_this.g.getGUI().sysMsgTips(SMT_WARNING, 
					TQ.format(rstr.armopdlg.intensifyarms.tips.noEnoughExpends, RStrUtil.getNoBindNameByResId(expend.resid) ));
				return false;
			}
		}
		
		return true;
	};
	
	_lc_._getAttrStr = function(curArm, baseAttr, appendAttr){
		if ( !curArm || !curArm.attrs ){
			return '';
		}
	
		if (!curArm.attrs[baseAttr] || curArm.attrs[baseAttr].val == 0) {
			return '';
		}
		
		var s = curArm.attrs[baseAttr].val;
		
		if (curArm.attrs[appendAttr] && curArm.attrs[appendAttr].val > 0) {
			s += TQ.formatColorStr('(+' + curArm.attrs[appendAttr].val + ')', COLORS.APPEND_ATTR);
		}
		
		return s;
	};
	
	var _getForceLevelFromArm = function(arm){
		if (!arm || !arm.flevel) {
			return 0;
		}
		
		return arm.flevel;
	};
	
	var _getForceLevelRes = function(forceLevel){
		var resIdx = forceLevel-1;
		return res_force_arms[resIdx];
	};
	
	var _getNextForceLevelRes = function(forceLevel){
		return _getForceLevelRes(forceLevel+1);
	};
	
	//IntensifyArmOpPanel-unittest-end
});

BesetGemOpPanel = BaseArmOpPanel.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_this = null;
	_lc_.m_armList = null;	
	_lc_.m_gemPosIdx = 0;
	this.initPanel = function(){
		_lc_.m_this = this;
		_lc_.m_armList = ArmListWithHerosAndArmPos.snew(this.g, this, this.items);
		
		_lc_._regEvents();
		_lc_._setCallers();
		_lc_._setCurArmTipCaller();
		_lc_._setCurArmGemsTipCaller();
	};
	
	this.update = function(){
		_lc_.m_armList.updateHeroList();
		_lc_.m_armList.updateArmList();
	};
	
	this.setListItemSecField = function(item, ritem){
		for ( var i=0; i<MAX_GEMS_POS_COUNT; ++i ) {
			var gemDom = item.exsubs['gem'+(i+1)];
			if ( ritem.gems && ritem.gems[i] ) {
				var gemres = ItemResUtil.findItemres(ritem.gems[i]);
				IMG.setBKImage(gemDom, IMG.makeSmallImg(gemres.smallpic));
				TQ.setTextEx(gemDom, gemres.gemLevel);
			}
			else {
				IMG.setBKImage(gemDom, '');
				TQ.setTextEx(gemDom, '');
			}
		}
	};
	
	_lc_._regEvents = function(){
		_lc_.m_this.g.regEvent(EVT.PKG_CHANGE, 0, _lc_.m_this, _lc_._onItemChanged);
		_lc_.m_this.g.regEvent(EVT.NET, NETCMD.ITEMOP, _lc_.m_this, _lc_._onItemOpSvrCmd);
	};
	
	_lc_._setCallers = function(){
		_lc_.m_this.items.buyGemBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickBuyGem});
		
		for (var i=1; i<=MAX_GEMS_POS_COUNT; ++i ) {
			_lc_.m_this.items['upgradeGem' + i].setCaller({self:_lc_.m_this, caller:_lc_._onClickUpgradeGem});
			_lc_.m_this.items['besetGem' + i].setCaller({self:_lc_.m_this, caller:_lc_._onClickBesetGem});
		}

		_lc_.m_this.items.unbesetAllBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickUnbesetAll});
		
		_lc_.m_this.items.armList.setCaller({self:_lc_.m_this, caller:_lc_._onClickArmList});
	};
	
	_lc_._setCurArmTipCaller = function(){
		TTIP.setCallerData(_lc_.m_this.items.tooltips[TIP_PREFIX + 'curarm'], {self:_lc_.m_this, caller:_lc_._onGetCurArmTip}, {});
	};
	
	_lc_._setCurArmGemsTipCaller = function(){
		for ( var i=0; i<MAX_GEMS_POS_COUNT; ++i ) {
			TTIP.setCallerData(_lc_.m_this.items.tooltips[TIP_PREFIX + 'gem' + (i+1)], {self:_lc_.m_this, caller:_lc_._onGetCurArmGemsTip}, {idx:i});
		}
	};
	
	_lc_._onGetCurArmTip = function(){
		return TIPM.getItemDesc( _lc_.m_armList.getCurSelArm() );
	};
	
	_lc_._onGetCurArmGemsTip = function(data){
		var gemResId = _lc_._getArmGemResIdByIdx(_lc_.m_armList.getCurSelArm(), data.idx);
		if (!gemResId) {
			return '';
		}
		
		var gemItem = {id:0, resid:gemResId, itemres:ItemResUtil.findItemres(gemResId)};
		return TIPM.getItemDesc( gemItem );
	};
	
	_lc_._onItemChanged = function(){
		if ( !_lc_.m_this.dlg.isShow() ) return;
		
		_lc_.m_armList.updateArmList();
		_lc_._updateCurArm();
	};
	
	_lc_._onItemOpSvrCmd = function(netData){
		// do nothing ... 
	};
	
	_lc_._onClickArmList = function(e, idx){
		_lc_._updateCurArm();
	};
	
	_lc_._onClickBuyGem = function(){
		UIM.getDlg('buyitemlist').openDlg(res_canbuy_gems);
	};
	
	_lc_._onClickUpgradeGem = function(id){
		var gemResId = _lc_._getArmGemResIdByIdx(_lc_.m_armList.getCurSelArm(), id);
		if (!gemResId) {
			return;
		}
		
		var gemPosIdx = id;
		UIM.getDlg('upgradegem').openDlg(_lc_.m_armList.getCurHeroId(), _lc_.m_armList.getCurSelArm().id, gemPosIdx, gemResId);
	};
	
	_lc_._onClickBesetGem = function(id){
		var curArm = _lc_.m_armList.getCurSelArm();
		if (!curArm) {
			return;
		}
		
		_lc_.m_gemPosIdx = id;
		
		var gemResId = _lc_._getArmGemResIdByIdx(curArm, _lc_.m_gemPosIdx);
		if (!gemResId) {
			_lc_._openSelectGemsDlg();
		}
		else {
			ItemOpSender.sendUnbesetGem(_lc_.m_this.g, _lc_.m_armList.getCurHeroId(), curArm.id, _lc_.m_gemPosIdx);
		}
	};
	
	_lc_._onClickUnbesetAll = function(){
		var curArm = _lc_.m_armList.getCurSelArm();
		if (!curArm) {
			return;
		}
		
		ItemOpSender.sendUnbesetAllGems(_lc_.m_this.g, _lc_.m_armList.getCurHeroId(), curArm.id);
	};
	
	_lc_._onSelectBesetGem = function(gem){
		var curArm = _lc_.m_armList.getCurSelArm();
		if ( GemUtil.hasSameTypeGems(curArm, gem.resid) ) {
			_lc_.m_this.g.getGUI().sysMsgTips(SMT_WARNING, rstr.armopdlg.besetGems.tip.hasSameGem);
			return RET_CONTINUE;
		}
		
		ItemOpSender.sendBesetGem(_lc_.m_this.g, 
			_lc_.m_armList.getCurHeroId(), 
			curArm.id, 
			_lc_.m_gemPosIdx, gem.resid);
		
		return RET_END;
	};
	
	_lc_._openSelectGemsDlg = function(){
		var dlg = UIM.getDlg('filteritemex');
		dlg.setCaller({self:_lc_.m_this,caller:_lc_._onSelectBesetGem});
		dlg.openDlg({title:rstr.getmlistdlg.title, filter:'gem'});
	};
	
	_lc_._getArmGemResIdByIdx = function(curArm, idx){
		if (!curArm || !curArm.gems || !curArm.gems[idx] ) {
			return 0;
		}
		
		return curArm.gems[idx];
	};
	
	_lc_._updateCurArm = function(){
		var curArm = _lc_.m_armList.getCurSelArm();
		if (!curArm) {
			_lc_._clearCurArm();
			return;
		}
		
		_lc_._updateCurArmIcon(curArm);
		_lc_._updateCurArmGemsList(curArm);
		_lc_._toggleBesetBtnsText(curArm);
		_lc_._enableBesetBtnsEnableState(curArm);
		_lc_._toggleUpgradeBtnsEnableState(curArm);
		_lc_._toggleUnbesetAllBtnEnableState(curArm);
	};	
	
	_lc_._clearCurArm = function(){
		IMG.setBKImage(_lc_.m_this.items.curIcon, '');
		TQ.setClass(_lc_.m_this.items.curIcon, '');
		for ( var i=1; i<=MAX_GEMS_POS_COUNT; ++i ) {
			IMG.setBKImage(_lc_.m_this.items['gemIcon' + i], '');
			TQ.setClass(_lc_.m_this.items['gemIcon' + i], '');
			_lc_.m_this.items['upgradeGem' + i].enable(false);
			_lc_.m_this.items['besetGem' + i].enable(false);
		}
		
		_lc_.m_this.items.unbesetAllBtn.enable(false);
	};
	
	_lc_._updateCurArmIcon = function(curArm){
		CommDrawItem.drawItemIcon(_lc_.m_this.items.curIcon, curArm.itemres);
	};
	
	_lc_._updateCurArmGemsList = function(curArm){
		for ( var i=0; i<MAX_GEMS_POS_COUNT; ++i ){
			IMG.setBKImage(_lc_.m_this.items['gemIcon' + (i+1)], '' );
			TQ.setClass(_lc_.m_this.items['gemIcon' + (i+1)], '');
		}
		
		for ( var i=0; i<curArm.gems.length; ++i ) {
			var resid = curArm.gems[i];
			if (!resid) continue;
			
			var itemres = ItemResUtil.findItemres(resid);
			CommDrawItem.drawItemIcon(_lc_.m_this.items['gemIcon' + (i+1)], itemres);
		}
	};

	_lc_._toggleBesetBtnsText = function(curArm){
		for ( var i=1; i<=MAX_GEMS_POS_COUNT; ++i ) {
			var btn = _lc_.m_this.items['besetGem' + i];
			btn.setText(!curArm.gems[i-1] ? rstr.armopdlg.besetGems.btn.besetGem : rstr.armopdlg.besetGems.btn.removeGem);
		}
	};
	
	_lc_._enableBesetBtnsEnableState = function(curArm){
		for ( var i=1; i<=MAX_GEMS_POS_COUNT; ++i ) {
			_lc_.m_this.items['besetGem' + i].enable(true);
		};
	};	
	
	_lc_._toggleUpgradeBtnsEnableState = function(curArm){
		for ( var i=1; i<=MAX_GEMS_POS_COUNT; ++i ) {
			var btn = _lc_.m_this.items['upgradeGem' + i];
			var resid = curArm.gems[i-1];
			if (!resid || GemUtil.isMaxGemLevel(resid)) {
				btn.enable(false);
			}
			else {
				btn.enable(true);
			}
		}
	};
	
	_lc_._toggleUnbesetAllBtnEnableState = function(curArm){
		for ( var i=0; i<MAX_GEMS_POS_COUNT; ++i ) {
			if (curArm.gems[i]) {
				_lc_.m_this.items.unbesetAllBtn.enable(true);
				return;
			}
		}
		
		_lc_.m_this.items.unbesetAllBtn.enable(false);
	};
	//BesetGemOpPanel-unittest-end
});

CombineGemOpPanel = BaseArmOpPanel.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var NEED_MIN_GEMCOUNT = 2;
	var COMBINE_LEVEL_COUNT = 4;
	_lc_.m_this = null;
	_lc_.m_myGems = [];
	this.initPanel = function(){
		_lc_.m_this = this;
		
		_lc_._regEvents();
		_lc_._setCallers();
		_lc_._setGemClassDorpList();
		_lc_._setCombineLevelList();
	};
	
	this.update = function(){
		_lc_._updateMyGemsList();
	};
	
	this.setListItemSecField = function(item, ritem){
		TQ.setTextEx(item.exsubs.levelOrNumber, ritem.number);
	};	
	
	_lc_._regEvents = function(){
		_lc_.m_this.g.regEvent(EVT.PKG_CHANGE, 0, _lc_.m_this, _lc_._onItemChanged);
		_lc_.m_this.g.regEvent(EVT.NET, NETCMD.ITEMOP, _lc_.m_this, _lc_._onItemOpSvrCmd);	
	};
	
	_lc_._setCallers = function(){
		TTIP.setCallerData(_lc_.m_this.items.tooltips[TIP_PREFIX + 'willGemIcon'], {self:_lc_.m_this, caller:_lc_._onGetWillGemTip}, {});
		
		_lc_.m_this.items.lowGemsList.setItemCount(5);
		for ( var i=0, n=_lc_.m_this.items.lowGemsList.getCount(); i<n; ++i ) {
			var item = _lc_.m_this.items.lowGemsList.getItem(i);
			TTIP.setCallerData(item.exsubs.tooltips[TIP_PREFIX + 'item'], {self:_lc_.m_this, caller:_lc_._onGetLowGemsTip}, {idx:i});
		}
		
		_lc_.m_this.items.gemClassDorpList.setCaller({self:_lc_.m_this, caller:_lc_._onClickGemClassDropList});
		_lc_.m_this.items.myGemsList.setCaller({self:_lc_.m_this, caller:_lc_._onClickMyGemsList});
		_lc_.m_this.items.combineLevelList.setCaller({self:_lc_.m_this, caller:_lc_._onClickCombineLevelList});
		_lc_.m_this.items.combineGem.setCaller({self:_lc_.m_this, caller:_lc_._onClickCombineGem});
		_lc_.m_this.items.combineGems.setCaller({self:_lc_.m_this, caller:_lc_._onClickCombineGems});
		_lc_.m_this.items.buyGem.setCaller({self:_lc_.m_this, caller:_lc_._onClickBuyGem});
	};
	
	_lc_._setGemClassDorpList = function(){
		var gemClassNames = rstr.armopdlg.combineGems.gemClassNames;
		for (var k in gemClassNames) {
			_lc_.m_this.items.gemClassDorpList.addItem({text:gemClassNames[k]});
		}
		_lc_.m_this.items.gemClassDorpList.setCurSel(0);	
	};
	
	_lc_._setCombineLevelList = function(){
		var combineLevels = rstr.armopdlg.combineGems.combineLevels;
		_lc_.m_this.items.combineLevelList.setItemCount(combineLevels.length);
		for ( var i=0; i<combineLevels.length; ++i ){
			var item = _lc_.m_this.items.combineLevelList.getItem(i);
			TQ.setTextEx(item.exsubs.desc, combineLevels[i] );
		}
	};
	
	_lc_._updateMyGemsList = function(){
		_lc_._filterMyGems();
		_lc_._mergeSameGems();
		_lc_._sortGems();
		_lc_._setMyGemsListItems();
		_lc_._resetMyGemsListCurSel();
		_lc_._setMyGemsListTipCaller();
	};
	
	_lc_._filterMyGems = function(){
		var classIds = [RES_CLS.GEMITEM, RES_CLS.ST_GEMITEM, RES_CLS.AG_GEMITEM, RES_CLS.PH_GEMITEM, RES_CLS.CO_GEMITEM];
		var filter = ItemClassRangeFilter.snew(_lc_.m_this.g);
		var curSelClassId =  classIds[ _lc_.m_this.items.gemClassDorpList.getCurSel() ];
		_lc_.m_myGems = filter.filter({classId : curSelClassId});
	};
	
	_lc_._mergeSameGems = function(){
		var gems = {};
		for ( var k in _lc_.m_myGems ){
			var gem = _lc_.m_myGems[k];
			if (!gems[gem.resid]){
				var newgem = {};
				TQ.dictCopy(newgem, gem);
				gems[gem.resid] = newgem;
			} else {
				gems[gem.resid].number += gem.number;
			}
		}
		
		_lc_.m_myGems = TQ.dictToList( gems );
	};
	
	_lc_._sortGems = function(){
		var _sortCmp = function(a, b) {
			return a.resid - b.resid;
		};
		
		_lc_.m_myGems.sort(_sortCmp);
	};
	
	_lc_._setMyGemsListItems = function(){
		_lc_.m_this.setMyArmListItems(_lc_.m_this.items.myGemsList, _lc_.m_myGems);
	};
	
	_lc_._resetMyGemsListCurSel = function(){
		_lc_.m_this.resetListCurSel(_lc_.m_this.items.myGemsList);
	};
	
	_lc_._setMyGemsListTipCaller = function(){
		_lc_.m_this.setListTipCaller(_lc_.m_this.items.myGemsList, _lc_._onGetMyGemsListTip);
	};
	
	_lc_._onGetMyGemsListTip = function(data){
		return TIPM.getItemDesc(_lc_.m_myGems[data.idx]);
	};
	
	_lc_._onGetWillGemTip = function(data){
		return TIPM.getItemDesc(_lc_._getWillGem());
	};
	
	_lc_._onGetLowGemsTip = function(data){
		return TIPM.getItemDesc(_lc_._getLowGemByIdx(data.idx));
	};
	
	_lc_._onClickGemClassDropList = function(e, idx){
		_lc_._updateMyGemsList();
	};
	
	_lc_._onClickMyGemsList = function(e, idx){
		_lc_._reselectCombineLevelList();
	};
	
	_lc_._onClickCombineLevelList = function(e, idx){
		_lc_._clearWillGem();
		_lc_._clearLowGemList();
		_lc_._clearCombineLevelListAllCheck();
		
		if ( idx < 0 ) {
			return;
		}
		
		if (_lc_._getLowGemNumber() == 0 ){ // no gems
			return;
		}
		
		if (_lc_._getLowGemNumber() < NEED_MIN_GEMCOUNT){// no enough gems
			_lc_.m_this.g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100032].msg);
			return;
		}
		
		if (GemUtil.isMaxGemLevel(_lc_._getLowGemResId()) ){
			_lc_.m_this.g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100031].msg);
			return;
		}
		
		var combineLevel = idx+1;
		if ( _lc_._getNeedLowGemNumber(combineLevel) > _lc_._getLowGemNumber() ) {
			_lc_.m_this.g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100032].msg);
			idx = _lc_._calcCanSelMaxCombineLevel() - 1;
		}
		
		_lc_._checkCombineLevelListItem(idx);
		_lc_._updateWillGem();
		_lc_._updateLowGemList();
	};
	
	_lc_._onClickCombineGem = function(){
		_lc_._doCommCombineGems();
	};
	
	_lc_._onClickCombineGems = function(){
		_lc_._doBatchCombineGems();
	};
	
	_lc_._onClickBuyGem = function(){
		UIM.getDlg('buyitemlist').openDlg(res_canbuy_gems);
	};
	
	_lc_._onItemChanged = function(){
		if ( !_lc_.m_this.dlg.isShow() ) return;
		
		_lc_._updateMyGemsList();
	};	
	
	_lc_._onItemOpSvrCmd = function(netData){
		// do nothing ... 
	};
	
	_lc_._doBatchCombineGems = function(){
		if ( !_isCanCombine() ) {
			return;
		}
		
		var times = Math.floor(_lc_._getLowGemNumber()/GemUtil.getCombineNeedNumber(_lc_._getCombineLevel()));
		var tip = rstr.armopdlg.combineGems.combineLevelNames[_lc_._getCombineLevel() - 1];
		var msg = TQ.format(rstr.armopdlg.combineGems.batchCombine, tip.name, times, tip.pro );
		_lc_.m_this.g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_YESNO, {self:_lc_.m_this, caller:function(id){
			if ( id == MB_IDYES ) {
				ItemOpSender.sendCombineGems(_lc_.m_this.g, _lc_._getLowGemResId(), _lc_._getCombineLevel(), true);
			}
		}});
	};
	
	_lc_._doCommCombineGems = function(){
		if ( !_isCanCombine() ) {
			return;
		}
		
		if ( _lc_._getCombineLevel() == 4 ) {
			ItemOpSender.sendCombineGems(_lc_.m_this.g, _lc_._getLowGemResId(), _lc_._getCombineLevel(), false);
			return;
		}
		
		var tip = rstr.armopdlg.combineGems.combineLevelNames[_lc_._getCombineLevel() - 1];
		var msg = TQ.format(rstr.armopdlg.combineGems.proCommCombine, tip.pro );
		_lc_.m_this.g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_YESNO, {self:_lc_.m_this, caller:function(id){
			if ( id == MB_IDYES ) {
				ItemOpSender.sendCombineGems(_lc_.m_this.g, _lc_._getLowGemResId(), _lc_._getCombineLevel(), false);
			}
		}});
	};
	
	var _isCanCombine = function(){
		if (_lc_._getLowGemNumber() == 0){
			return false;
		}
		
		if (GemUtil.isMaxGemLevel(_lc_._getLowGemResId()) ){
			_lc_.m_this.g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100031].msg);
			return false;
		}
		
		if (_lc_._getCombineLevel() == 0){
			_lc_.m_this.g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100032].msg);
			return false ;
		}
		
		return true;
	};
	
	_lc_._getWillGem = function(){
		if (_lc_._getLowGemNumber() == 0 || GemUtil.isMaxGemLevel(_lc_._getLowGemResId()) ){
			return null;
		}
		
		var nextGemResId = _lc_._getNextLevelGemResId(_lc_._getLowGemResId());
		return {id:0, resid:nextGemResId, itemres:ItemResUtil.findItemres(nextGemResId)};
	};
	
	_lc_._getCurNeedLowGemNumber = function(){
		return _lc_._getNeedLowGemNumber(_lc_._getCombineLevel());
	};
	
	_lc_._getNeedLowGemNumber = function(combineLevel){
		var levelNeedNumbers = {'1':2, '2':3, '3':4, '4':5};
		var number = levelNeedNumbers[combineLevel];
		return number ? number : 0;
	};
	
	_lc_._getLowGemNumber = function(){
		var curGem = _lc_._getCurSelGem();
		if (!curGem) return 0;
		
		return curGem.number ? curGem.number : 0;
	};
	
	_lc_._getLowGemByIdx = function(idx){
		if (idx >= _lc_._getCurNeedLowGemNumber()){
			return null;
		}
		
		var curGem = _lc_._getCurSelGem();
		if (!curGem) {
			return null;
		}
		return {id:0, resid:curGem.resid, itemres:curGem.itemres, number:1};
	};
	
	_lc_._getCurSelGem = function(){
		return _lc_.m_myGems[ _lc_.m_this.items.myGemsList.getCurSel() ];
	};
	
	_lc_._getLowGemResId = function(){
		var curGem = _lc_._getCurSelGem();
		if (!curGem) return 0;
		
		return curGem.resid;
	};
	
	_lc_._reselectCombineLevelList = function(){
		var idx = _lc_._calcCanSelMaxCombineLevel() - 1;
		_lc_.m_this.items.combineLevelList.setCurSel(idx);
	};
	
	_lc_._calcCanSelMaxCombineLevel = function(){
		return Math.min((_lc_._getLowGemNumber() - NEED_MIN_GEMCOUNT + 1), COMBINE_LEVEL_COUNT);
	};
	
	_lc_._checkCombineLevelListItem = function(idx){
		_lc_._clearCombineLevelListAllCheck();
		_lc_.m_this.items.combineLevelList.getItem(idx).exsubs.sel.setCheck(1);
	};
	
	_lc_._clearCombineLevelListAllCheck = function(){
		for ( var i=0, n=_lc_.m_this.items.combineLevelList.getCount(); i<n; ++i ) {
			var item = _lc_.m_this.items.combineLevelList.getItem(i);
			item.exsubs.sel.setCheck(0);
		}
	};
	
	_lc_._getCombineLevel = function(){
		for ( var i=0, n=_lc_.m_this.items.combineLevelList.getCount(); i<n; ++i ) {
			var item = _lc_.m_this.items.combineLevelList.getItem(i);
			if ( item.exsubs.sel.getCheck() == 1 ) {
				return i + 1;
			}
		}
		
		return 0;
	};
	
	_lc_._getNextLevelGemResId = function(lowGemResId){
		return lowGemResId + 1;
	};
	
	_lc_._clearWillGem = function(){
		IMG.setBKImage(_lc_.m_this.items.willGemIcon, '');
		TQ.setClass(_lc_.m_this.items.willGemIcon, '');
		_lc_.m_this.items.combineGem.enable(false);
		_lc_.m_this.items.combineGems.enable(false);
	};
	
	_lc_._clearLowGemList = function(){
		_lc_.m_this.items.lowGemsList.setItemCount(0);
	};
	
	_lc_._updateWillGem = function(){
		var nextGem = _lc_._getWillGem();
		CommDrawItem.drawItemIcon(_lc_.m_this.items.willGemIcon, nextGem.itemres);
		_lc_.m_this.items.combineGem.enable(true);
		_lc_.m_this.items.combineGems.enable(true);
	};
	
	_lc_._updateLowGemList = function(){
		var lowGem = _lc_._getCurSelGem();
		var showNumber = _lc_._getCurNeedLowGemNumber();
		_lc_.m_this.items.lowGemsList.setItemCount(showNumber);
		for ( var i=0; i<showNumber; ++i ){
			var item = _lc_.m_this.items.lowGemsList.getItem(i);
			CommDrawItem.drawItemIcon(item.exsubs.icon, lowGem.itemres);
		}
	};
	
	//CombineGemOpPanel-unittest-end
});

UpgradeGemDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var NEED_GEM_NUMBER = 5;

	var m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	_lc_.m_heroId = 0;
	_lc_.m_armId = 0;
	_lc_.m_gemPos = 0;
	_lc_.m_srcGemResId = 0;
	_lc_.m_srcGem = {};
	_lc_.m_desGem = {};
	
	this.init = function(g){
		m_g = g;
		_lc_.m_this = this;
	};
	
	this.openDlg = function(heroId, armId, gemPos, srcGemResId){
		_lc_._initDlg();
		_lc_._openDlg();
		_lc_._initInfo(heroId, armId, gemPos, srcGemResId);
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		
		_lc_.m_dlg = Dialog.snew(m_g, {modal:true, title:rstr.upgradegemdlg.title, pos:{x:"center", y:30} });
		m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.upgradegemdlg, _lc_.m_items);
		_lc_._setCallers();
		_lc_._setTipCallers();
	};
	
	_lc_._openDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(heroId, armId, gemPos, srcGemResId){
		_lc_.m_srcGemResId = srcGemResId;
		_lc_.m_heroId = heroId;
		_lc_.m_armId = armId;
		_lc_.m_gemPos = gemPos;
		
		_lc_._createSrcGemItem();
		_lc_._createDesGemItem();
		_lc_._setSrcGemIconAndName();
		_lc_._setDesGemIconAndName();
		_lc_._setUpgradeBtnEnableState();
		_lc_._setCanOrNeedDescVisible();
		//assert ( false, 'hero wear gems change (pkg delete ), attrs recal ... ...' );
	};
	
	_lc_._createSrcGemItem = function(){
		_lc_.m_srcGem = _lc_._createGemItem(_lc_.m_srcGemResId);
	};
	
	_lc_._createDesGemItem = function(){
		_lc_.m_desGem = _lc_._createGemItem( _lc_._getNextLevelGemResId(_lc_.m_srcGemResId) );
	};
	
	_lc_._setSrcGemIconAndName = function(){
		_lc_._setGemIconAndName(_lc_.m_items.srcIcon, _lc_.m_items.srcName, _lc_.m_srcGem);
	};
	
	_lc_._setDesGemIconAndName = function(){
		_lc_._setGemIconAndName(_lc_.m_items.desIcon, _lc_.m_items.desName, _lc_.m_desGem);
	};
	
	_lc_._setUpgradeBtnEnableState = function(){
		_lc_.m_items.upgradeBtn.enable( _lc_._hasEnoughGems() );
	};
	
	_lc_._setCanOrNeedDescVisible = function(){
		TQ.setCSS(_lc_.m_items.canDesc, 'display', _lc_._hasEnoughGems() ? 'block' : 'none');
		TQ.setCSS(_lc_.m_items.needDesc, 'display', _lc_._hasEnoughGems() ? 'none' : 'block' );
			
		if ( !_lc_._hasEnoughGems() ) {
			var patternStr = rstr.upgradegemdlg.lbl.needDesc;
			var s = TQ.format(patternStr, NEED_GEM_NUMBER, _lc_.m_srcGem.itemres.name, _getMyHasGemIncludeCurArmBested());
			TQ.setTextEx(_lc_.m_items.needDesc, HyperLinkMgr.formatLink(s));
		}
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.upgradeBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickUpgrade});
	};
	
	_lc_._setTipCallers = function(){
		TTIP.setCallerData(_lc_.m_items.tooltips[TIP_PREFIX + 'src'], {self:_lc_.m_this, caller:_lc_._onGetSrcGemTip}, {});
		TTIP.setCallerData(_lc_.m_items.tooltips[TIP_PREFIX + 'des'], {self:_lc_.m_this, caller:_lc_._onGetDesGemTip}, {});
	};
	
	_lc_._createGemItem = function(resid){
		return {resid:resid, itemres:ItemResUtil.findItemres(resid)};
	};
	
	_lc_._setGemIconAndName = function(iconDom, nameDom, gemItem){
		IMG.setBKImage(iconDom, IMG.makeBigImg(gemItem.itemres.bigpic));
		TQ.setTextEx(nameDom, gemItem.itemres.name);
	};
	
	_lc_._hasEnoughGems = function(){
		return _lc_._getNoEnoughGemsNumber() <= 0;
	};
	
	_lc_._getNoEnoughGemsNumber = function(){
		return NEED_GEM_NUMBER -  _getMyHasGemIncludeCurArmBested();
	};
	
	var _getMyHasGemIncludeCurArmBested = function(){
		return m_g.getImgr().getItemNumByResId(_lc_.m_srcGem.resid) + 1; // add beseted in arm gem
	};
	
	_lc_._getNextLevelGemResId = function(resid){
		return resid + 1;
	};
	
	_lc_._onClickUpgrade = function(){
		ItemOpSender.sendUpgradeGem(m_g, _lc_.m_heroId, _lc_.m_armId, _lc_.m_gemPos, _lc_.m_srcGem.resid);
		_lc_.m_dlg.hide();
	};
	
	_lc_._onGetSrcGemTip = function(){
		return TIPM.getItemDesc( _lc_.m_srcGem );
	};
	
	_lc_._onGetDesGemTip = function(){
		return TIPM.getItemDesc( _lc_.m_desGem );
	};
	
	//UpgradeGemDlg-unittest-end
});

