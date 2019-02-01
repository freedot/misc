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
	//ArmOpDlg-unittest-start
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_panels = [];
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.openDlg = function(tabIdx){
		_initDlg();
		_openDlg();
		_initInfo(tabIdx);
	};
	
	this.isShow = function(){
		if (!m_dlg) {
			return false;
		}
		
		return m_dlg.isShow();
	};
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		
		m_dlg = Dialog.snew(m_g, {modal:false, title:rstr.armopdlg.title, pos:{x:"center", y:30} });
		m_g.getGUI().initDlg(m_dlg, uicfg.armopdlg, m_items);
		_initTabsText();
		_createOpPanels();
	};
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(tabIdx){
		m_items.tabList.activeTab(tabIdx);
		_updatePanels();
	};
	
	var _updatePanels = function(){
		for ( var i=0;  i<m_panels.length; ++i ) {
			m_panels[i].update();
		}
	};
	
	var _initTabsText = function(){
		for ( var i=0, cnt=m_items.tabList.getTabCount(); i<cnt; ++i ){
			m_items.tabList.setTabText(i, rstr.armopdlg.tabs[i]);
		}
	};

	var _createOpPanels = function(){
		m_panels = [];
		m_panels.push( BuyArmOpPanel.snew(m_g, m_this, m_items.tabList.getTabItems(0) ) );
		m_panels.push( SplitArmOpPanel.snew(m_g, m_this, m_items.tabList.getTabItems(1) ) );
		m_panels.push( IntensifyArmOpPanel.snew(m_g, m_this, m_items.tabList.getTabItems(2) ) );
		m_panels.push( CombineGemOpPanel.snew(m_g, m_this, m_items.tabList.getTabItems(3) ) );
		m_panels.push( BesetGemOpPanel.snew(m_g, m_this, m_items.tabList.getTabItems(4) ) );
	};

	//ArmOpDlg-unittest-end
});

ArmListWithHerosAndArmPos = Class.extern(function(){
	//ArmListWithHerosAndArmPos-unittest-start
	var m_this = null;
	this.g = null;
	this.panel = null;
	this.items = null;
	this.myArms = [];
	
	this.init = function(g, panel, items){
		m_this = this;
		this.g = g;
		this.panel = panel;
		this.items = items;
		
		_regEvents();
		_setCallers();
		_setArmPosDropList();
	};
	
	this.updateArmList = function(){
		var itemId = this._getLastSelItemId();
		this.myArms = _filterMyArms();
		this.panel.sortArms(this.myArms);
		this.panel.setMyArmListItems(this.items.armList, this.myArms);
		_resetArmListCurSel(itemId);
		this.panel.setListTipCaller(this.items.armList, _onGetMyArmListTip);
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
		var hero = this.g.getImgr().getHeroByIdx(_getCurHeroIdx() );
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
	
	var _resetArmListCurSel = function(itemId){
		if ( !TQ.find(m_this.myArms, 'id', itemId) ) {
			m_this.items.armList.setCurSel(0);
		} else {
			m_this.items.armList.setCurSel(TQ.getLastFindIdx());
		}
	};

	var _regEvents = function(){
		m_this.g.regEvent(EVT.HERO_UPDATE, 0, m_this, _onHeroUpdate);
	};
	
	var _setCallers = function(){
		m_this.items.armPosDropList.setCaller({self:m_this, caller:_onClickArmPosDropList});
		m_this.items.heroDropList.setCaller({self:m_this, caller:_onClickHeroDropList});
	};
	
	var _setArmPosDropList =function(){
		var armPosNames = rstr.armopdlg.intensifyarms.armPosName;
		for (var k in armPosNames) {
			m_this.items.armPosDropList.addItem({text:armPosNames[k]});
		}
		m_this.items.armPosDropList.setCurSel(0);
	};
	
	var _filterMyArms = function(){
		var armPosFilter = CanIntensifyArmPosFilter.snew(m_this.g);
		return armPosFilter.filter({armPos:_getCurArmPos(), items:_getCurSelPkgOrHeroWears()});
	};
	
		
	
	var _onGetMyArmListTip = function(data){
		return TIPM.getItemDesc(m_this.myArms[data.idx]);
	};
	
	var _onClickArmPosDropList = function(e, idx){
		m_this.updateArmList();
		_selectFirstArmInList();
	};
	
	var _onClickHeroDropList = function(e, idx){
		m_this.updateArmList();
		_selectFirstArmInList();
	};	
	
	var _onHeroUpdate = function(){
		if ( !m_this.panel.dlg.isShow() ) return;
		
		m_this.updateArmList();
	};
	
	var _selectFirstArmInList = function(){
		m_this.items.armList.setCurSel(0);
	};
	
	var _getCurArmPos = function(){
		return m_this.items.armPosDropList.getCurSel();
	};
	
	var _getCurSelPkgOrHeroWears = function(){
		var imgr = m_this.g.getImgr();
		
		if ( _isSelectedPkg() ) {
			return imgr.getPkgs().items;
		}
		
		var hero = imgr.getHeroByIdx(_getCurHeroIdx());
		if (!hero) {
			return [];
		}
		
		if (!imgr.isDetailHero(hero)) {
			HeroSender.sendGetDetail(m_this.g, hero.id);
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

	var _isSelectedPkg = function(){
		return m_this.items.heroDropList.getCurSel() <= 0;
	};	
	
	var _getCurHeroIdx = function(){
		return m_this.items.heroDropList.getCurSel() - 1; // trim first item pkg idx
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
	//BuyArmOpPanel-unittest-start
	var m_this = null;
	var m_saleItems = [];
	var m_myCanSaleItems = [];
	this.initPanel = function(){
		m_this = this;
		_regEvents();
		_setCallers();
	};
	
	this.update = function(){
		_updateSaleList();
		_updateMyItemList();
	};
	
	var _regEvents = function(){
		m_this.g.regEvent(EVT.PKG_CHANGE, 0, m_this, _onItemChanged);
	};
	
	var _setCallers = function(){
		m_this.items.saleList.setCaller({self:m_this, caller:_onClickSaleList});
		m_this.items.myItemList.setCaller({self:m_this, caller:_onClickMyItemList});
	};
	
	var _updateSaleList = function(){
		_setSaleListItems();
		_setSaleListTipCaller();
	};
	
	var _updateMyItemList = function(){
		_setMyItemListItems();
		_setMyItemListCaller();
	};
	
	var _setSaleListItems = function(){
		var res = res_smithy_salelist[ m_this.g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.SMITHY) - 1 ];
		if (!res) {
			m_this.items.saleList.setItemCount(0);
			return;
		}
		
		_createResSaleItemIds(res);
		_createSaleItems(res.items);
		m_this.items.saleList.setItemCount(m_saleItems.length);
		for (var i=0, cnt=m_this.items.saleList.getCount(); i<cnt; ++i ) {
			var item = m_this.items.saleList.getItem(i);
			CommDrawItem.drawItemIcon(item.exsubs.icon, m_saleItems[i].itemres);
		}
	};
	
	var _setMyItemListItems = function(){
		var filter = CanSaleFilterEx.snew(m_this.g);
		m_myCanSaleItems = filter.filter();
		m_this.items.myItemList.setItemCount(m_myCanSaleItems.length);
		for (var i=0, cnt=m_this.items.myItemList.getCount(); i<cnt; ++i ) {
			var item = m_this.items.myItemList.getItem(i);
			CommDrawItem.drawItemIcon(item.exsubs.icon, m_myCanSaleItems[i].itemres);
		}
	};	
	
	var _setSaleListTipCaller = function(){
		m_this.setListTipCaller(m_this.items.saleList, _onGetSaleListTip);
	};
	
	var _setMyItemListCaller = function(){
		m_this.setListTipCaller(m_this.items.myItemList, _onGetMyItemListTip);
	};
	
	var _onGetSaleListTip = function(data){
		return TIPM.getItemDesc(m_saleItems[data.idx], 'sys');
	};
	
	var _onGetMyItemListTip = function(data){
		return TIPM.getItemDesc(m_myCanSaleItems[data.idx]);
	};
	
	var _onItemChanged = function(){
		if ( !m_this.dlg.isShow() ) return;
		
		_updateMyItemList();
	};
	
	var _onClickSaleList = function(e, idx){
		var curItem = m_saleItems[idx];
		if (!curItem) return;
		
		var buyItemDlg = UIM.getDlg('buyitem');
		buyItemDlg.openDlg({id:0, resid:curItem.resid, number:10000});
	};
	
	var _onClickMyItemList = function(e, idx){
		var curItem = m_myCanSaleItems[idx];
		if (!curItem) return;
		
		var _onSaleCallback = function(id){
			if ( id == MB_IDYES ) ShopSender.sendSaleItem(m_this.g, curItem);
		};
		
		var name = ItemNameColorGetter.getColorVal(curItem.itemres.level, curItem.itemres.name);
		var msg = TQ.format(rstr.armopdlg.buyarms.lbl.saleMyItem, name, curItem.itemres.salePrice);
		m_this.g.getGUI().msgBox(rstr.comm.msgts, msg,  MB_F_YESNO, {self:m_this, caller:_onSaleCallback} );
	};
	
	var _createResSaleItemIds = function(res){
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
	
	var _createSaleItems = function(items){
		m_saleItems = [];
		for (var i=0; i<items.length; ++i ) {
			var ritem = items[i];
			var sysItem = SysItemMaker.make(i+1, ritem.itemres);
			sysItem.isBind = ritem.isBind;
			m_saleItems.push(sysItem);
		}
	};
	
	//BuyArmOpPanel-unittest-end
});

SplitArmOpPanel = BaseArmOpPanel.extern(function(){
	//SplitArmOpPanel-unittest-start
	var m_this = null;
	
	var m_essences = [];
	var m_opResult = '';
	this.myArms = [];
	this.initPanel = function(){
		m_this = this;
		_regEvents();
		_setCallers();
		_setArmLevelDropList();		
	};
	
	this.update = function(){
		_updateMyArmList();
		_updateMyEssenceList();
	};
	
	var _regEvents = function(){
		m_this.g.regEvent(EVT.PKG_CHANGE, 0, m_this, _onItemChanged);
		m_this.g.regEvent(EVT.NET, NETCMD.ITEMOP, m_this, _onItemOpSvrCmd);
	};
	
	var _setCallers = function(){
		m_this.items.selectAll.setCaller({self:m_this, caller:_onClickSelectAll});
		m_this.items.armLevelDropList.setCaller({self:m_this, caller:_onClickArmLevelDropList});
		m_this.items.armList.setCaller({self:m_this, caller:_onClickArmList});
		m_this.items.splitBtn.setCaller({self:m_this, caller:_onClickSplitBtn});
	};
	
	var _setArmLevelDropList = function(){
		var itemLevels = rstr.armopdlg.splitarms.itemLevels;
		for (var k in itemLevels) {
			m_this.items.armLevelDropList.addItem({text:itemLevels[k]});
		}
		m_this.items.armLevelDropList.setCurSel(0);
	};
	
	var _updateMyArmList = function(){
		_filterMyArms();
		m_this.sortArms(m_this.myArms);
		_setMyArmListItems();
		_setMyArmListTipCaller();
	};
	
	var _filterMyArms = function(){
		var decomposeFilter = CanSplitArmFilter.snew(m_this.g);
		var canDecomposeArms = decomposeFilter.filter();
		
		var itemLevelFilter = ItemLevelFilter.snew();
		m_this.myArms = itemLevelFilter.filter({itemLevel:_getCurSelArmLevel(), items:canDecomposeArms});
	};
	
	var _setMyArmListItems = function(){
		m_this.setMyArmListItems(m_this.items.armList, m_this.myArms);
	};
	
	var _updateMyEssenceList = function(){
		_setMyEssenceListItems();
		_setMyEssenceListTipCaller();
	};
	
	var _setMyEssenceListItems = function(){
		m_essences = _getMyEssenceItems();
		m_this.items.essenceList.setItemCount(m_essences.length);
		for (var i=0, cnt=m_this.items.essenceList.getCount(); i<cnt; ++i ) {
			var item = m_this.items.essenceList.getItem(i);
			var ritem = m_essences[i];
			CommDrawItem.drawIconAndNumber(item, ritem);
		}
	};
	
	var _setMyArmListTipCaller = function(){
		m_this.setListTipCaller(m_this.items.armList, _onGetMyArmListTip);
	};
	
	var _setMyEssenceListTipCaller = function(){
		m_this.setListTipCaller(m_this.items.essenceList, _onGetEssenceListTip);
	};
	
	var _getMyEssenceItems = function(){
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
			var number = m_this.g.getImgr().getItemNumByResId( resId );
			var itemres = ItemResUtil.findItemres(resId);
			if (itemres.nobindid) itemres = ItemResUtil.findItemres(itemres.nobindid);
			items.push ( {number:number, resid:itemres.id, itemres:itemres} );
		}
		
		return items;
	};
	
	var _onItemChanged = function(){
		if ( !m_this.dlg.isShow() ) return;
		
		m_this.update();
	};
	
	var _onItemOpSvrCmd = function(netData){
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
		
		TQ.setHtml(m_this.items.result.getContainerObj(), m_opResult);
		m_this.items.result.refresh();
		m_this.items.result.scrollEnd();
	};
	
	var _onGetMyArmListTip = function(data){
		return TIPM.getItemDesc(m_this.myArms[data.idx]);
	};
	
	var _onGetEssenceListTip = function(data){
		return TIPM.getItemDesc(m_essences[data.idx]);
	};
	
	var _onClickSelectAll = function(){
		var checkFlag = m_this.items.selectAll.getCheck();
		_selectOrUnselectAllArms(checkFlag);
	};
	
	var _onClickArmLevelDropList = function(e, idx){
		_updateMyArmList();
		_unselectAllArms();
	};
	
	var _onClickArmList = function(e, idx){
		if ( idx < 0 || idx >= m_this.items.armList.getCount() ) {
			return;
		}
		
		var item = m_this.items.armList.getItem(idx);
		var toggleCheck = item.exsubs.sel.getCheck() ? 0 : 1;
		item.exsubs.sel.setCheck(toggleCheck);
	};
	
	var _onClickSplitBtn = function(){
		var needSplitItemIds = [];
		for ( var i=0; i<m_this.myArms.length; ++i ) {
			var listItem = m_this.items.armList.getItem(i);
			if (listItem.exsubs.sel.getCheck() == 1){
				needSplitItemIds.push(m_this.myArms[i].id);
			}
		}
		
		if (needSplitItemIds.length == 0){
			m_this.g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100025].msg);
		}
		else {
			ItemOpSender.sendDecomposeIds(m_this.g, needSplitItemIds);
			_unselectAllArms();
		}
	};
	
	var _getCurSelArmLevel = function(){
		return m_this.items.armLevelDropList.getCurSel();
	};
	
	var _unselectAllArms = function(){
		_selectOrUnselectAllArms(0);
	};
	
	var _selectOrUnselectAllArms = function(checkFlag){
		for (var i=0, cnt=m_this.items.armList.getCount(); i<cnt; ++i ) {
			var item = m_this.items.armList.getItem(i);
			item.exsubs.sel.setCheck(checkFlag);
		}
	};
	
	//SplitArmOpPanel-unittest-end
});

IntensifyArmOpPanel = BaseArmOpPanel.extern(function(){
	//IntensifyArmOpPanel-unittest-start
	var m_this = null;
	var m_armList = null;
	this.initPanel = function(){
		m_this = this;
		m_armList = ArmListWithHerosAndArmPos.snew(this.g, this, this.items);
		
		_regEvents();
		_setCallers();
		_setCurArmTipCaller();
	};
	
	this.update = function(){
		m_armList.updateHeroList();
		m_armList.updateArmList();
		_updateMyHasMaterials();
	};
	
	var _regEvents = function(){
		m_this.g.regEvent(EVT.PKG_CHANGE, 0, m_this, _onItemChanged);
		m_this.g.regEvent(EVT.NET, NETCMD.ITEMOP, m_this, _onItemOpSvrCmd);
	};
	
	var _setCallers = function(){
		m_this.items.armList.setCaller({self:m_this, caller:_onClickArmList});
		m_this.items.buyMaterial1Btn.setCaller({self:m_this, caller:_onClickBuyStone});
		m_this.items.buyMaterial2Btn.setCaller({self:m_this, caller:_onClickBuyEssence});
		m_this.items.intensifyBtn.setCaller({self:m_this, caller:_onClickIntensify});
	};
	
	var _setCurArmTipCaller = function(){
		TTIP.setCallerData(m_this.items.tooltips[TIP_PREFIX + 'curarm'], {self:m_this, caller:_onGetCurArmTip}, {});
	};
	
	var _onGetCurArmTip = function(){
		return TIPM.getItemDesc( m_armList.getCurSelArm() );
	};
	
	var _onItemChanged = function(){
		if ( !m_this.dlg.isShow() ) return;
		
		m_armList.updateArmList();
		_updateMyHasMaterials();
	};
	
	var _onItemOpSvrCmd = function(netData){
		if (!netData.data.intensifyResult) {
			return;
		}
		
		var resIdx = netData.data.intensifyResult.forceLevel-1;
		var forceRes = res_force_arms[resIdx];
		
		var s = TQ.format(rstr.armopdlg.intensifyarms.svr.intensifyResult,
			RStrUtil.getNameByResId(netData.data.intensifyResult.resid),
			forceRes.effect);
		TQ.setTextEx(m_this.items.result, s);
	};
	
	var _onClickArmList = function(e, idx){
		var curArm = m_armList.getCurSelArm();
		if (!curArm){
			_clearAllCurArmInfo();
			return;
		}
		
		_updateCurArmIconName(curArm);
		_updateCurArmAttrs(curArm);
		_updateCurForceLevelDesc(curArm);
		_updateNextForceLevelDesc(curArm);
		_updateNextForceLevelNeed(curArm);
		_updateIntensifySuccessRate(curArm);
		_updateMyHasMaterials();
	};
	
	var _onClickBuyStone = function(){
		var buyitemdlg = UIM.getDlg('buyitem');
		buyitemdlg.openDlg({id:0, resid:FIXID.REFINESTONE, number:100000});
	};
	
	var _onClickBuyEssence = function(){
		var ids = [3000074,3000075,3000076];
		UIM.getDlg('buyitemlist').openDlg(ids);
	};

	var _onClickIntensify = function(){
		TQ.setTextEx(m_this.items.result, '');
		
		var curArm = m_armList.getCurSelArm();
		
		if (!curArm) {
			m_this.g.getGUI().sysMsgTips(SMT_WARNING, rstr.armopdlg.intensifyarms.tips.noselectArm);
			return;
		}
			
		if (_isArriveMaxForceLevel( _getForceLevelFromArm(curArm) )){
			m_this.g.getGUI().sysMsgTips(SMT_WARNING, rstr.armopdlg.intensifyarms.tips.maxForceLevel);
			return;
		}
		
		if (!_hasEnoughExpends(curArm)){
			return;
		}
		
		ItemOpSender.sendIntensifyArm(m_this.g, m_armList.getCurHeroId(), curArm.id);
	};
	
	var _clearAllCurArmInfo = function(){
		_clearCurArmIconName();
		_clearCurArmAttrs();
		_clearCurForceLevelDesc();
		_clearNextForceLevelDesc();
		_clearForceNeedMaterials();
		_clearMyHasMaterials();
		_clearForceSuccRate();
	};
	
	var _updateCurArmIconName = function(curArm){
		CommDrawItem.drawItemIconAndName(m_this.items.curIcon, m_this.items.curName, curArm.itemres);
	};
	
	var _updateCurArmAttrs = function(curArm){
		TQ.setTextEx(m_this.items.strength, _getAttrStr(curArm, ATTR.ST_B, ATTR.ST_A) );
		TQ.setTextEx(m_this.items.agile, _getAttrStr(curArm, ATTR.AG_B, ATTR.AG_A) );
		TQ.setTextEx(m_this.items.physical, _getAttrStr(curArm, ATTR.PH_B, ATTR.PH_A) );
	};
	
	var _updateCurForceLevelDesc = function(curArm){
		TQ.setTextEx(m_this.items.curIntensifyLevel, TQ.format(rstr.armopdlg.intensifyarms.lbl.forceLevelTitle, _getForceLevelFromArm(curArm)) );

		var forceRes = _getForceLevelRes( _getForceLevelFromArm(curArm) );
		var effect = forceRes ? forceRes.effect : 0;
		TQ.setTextEx(m_this.items.curIntensifyEffect, TQ.format(rstr.armopdlg.intensifyarms.lbl.forceLevelEffect, effect) );
	};
	
	var _updateNextForceLevelDesc = function(curArm){
		if (_isArriveMaxForceLevel( _getForceLevelFromArm(curArm) )) {
			_setNextForceLevelDescIsMax();
			return;
		}
		
		var nextLevel = _getForceLevelFromArm(curArm) + 1;
		TQ.setTextEx(m_this.items.nextIntensifyLevel, TQ.format(rstr.armopdlg.intensifyarms.lbl.forceLevelTitle, nextLevel) );
		
		var forceRes = _getNextForceLevelRes( _getForceLevelFromArm(curArm) );
		TQ.setTextEx(m_this.items.nextIntensifyEffect, TQ.format(rstr.armopdlg.intensifyarms.lbl.forceLevelEffect, forceRes.effect) );
	};
	
	var _updateNextForceLevelNeed = function(curArm){
		if (_isArriveMaxForceLevel( _getForceLevelFromArm(curArm) )) {
			_clearForceNeedMaterials();
			return;
		}
		
		var forceRes = _getNextForceLevelRes( _getForceLevelFromArm(curArm) );
		for ( var i=0; i<2; ++i ){
			var expend = forceRes.expends[i];
			TQ.setTextEx(m_this.items['needMaterial' + (i+1)],
				TQ.format(rstr.armopdlg.intensifyarms.lbl.needItemNumber, RStrUtil.getNoBindNameByResId(expend.resid), expend.val) );
		}
	};
	
	var _updateIntensifySuccessRate = function(curArm){
		if (_isArriveMaxForceLevel( _getForceLevelFromArm(curArm) )) {
			TQ.setTextEx(m_this.items.succPro, '');
			return;
		}
		
		var forceRes = _getNextForceLevelRes( _getForceLevelFromArm(curArm) );
		TQ.setTextEx(m_this.items.succPro, TQ.format(rstr.armopdlg.intensifyarms.lbl.successPro, forceRes.succPro));
	};
	
	var _updateMyHasMaterials = function(){
		var curArm = m_armList.getCurSelArm();
		if (!curArm){
			_clearMyHasMaterials();
			return;
		}
		
		if (_isArriveMaxForceLevel( _getForceLevelFromArm(curArm) )) {
			_clearMyHasMaterials();
			return;
		}
		
		var forceRes = _getNextForceLevelRes( _getForceLevelFromArm(curArm) );
		for ( var i=0; i<2; ++i ){
			var expend = forceRes.expends[i];
			TQ.setTextEx(m_this.items['hasMaterial' + (i+1)],
				TQ.format(rstr.armopdlg.intensifyarms.lbl.curHasItemNumber, 
					m_this.g.getImgr().getItemNumByResId(expend.resid)) );
		}
	};	
	
	var _setNextForceLevelDescIsMax = function(){
		TQ.setTextEx(m_this.items.nextIntensifyLevel, rstr.armopdlg.intensifyarms.lbl.fullForceLevelTitle );
		TQ.setTextEx(m_this.items.nextIntensifyEffect, rstr.armopdlg.intensifyarms.lbl.fullForceLevelEffect );
	};
	
	var _clearCurArmIconName = function(){
		_clearDomsText(['curName']);
		IMG.setBKImage(m_this.items.curIcon, '');
		TQ.setClass(m_this.items.curIcon, '');
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
			TQ.setTextEx(m_this.items[ domNames[k] ], '');
		}
	};
	
	
	var _isArriveMaxForceLevel = function(forceLevel){
		return forceLevel >= res_max_forcelevel;
	};
	
	var _hasEnoughExpends = function(curArm){
		var forceRes = _getNextForceLevelRes( _getForceLevelFromArm(curArm) );
		for ( var i=0; i<2; ++i ){
			var expend = forceRes.expends[i];
			if ( m_this.g.getImgr().getItemNumByResId(expend.resid) < expend.val ) {
				m_this.g.getGUI().sysMsgTips(SMT_WARNING, 
					TQ.format(rstr.armopdlg.intensifyarms.tips.noEnoughExpends, RStrUtil.getNoBindNameByResId(expend.resid) ));
				return false;
			}
		}
		
		return true;
	};
	
	var _getAttrStr = function(curArm, baseAttr, appendAttr){
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
	//BesetGemOpPanel-unittest-start
	var m_this = null;
	var m_armList = null;	
	var m_gemPosIdx = 0;
	this.initPanel = function(){
		m_this = this;
		m_armList = ArmListWithHerosAndArmPos.snew(this.g, this, this.items);
		
		_regEvents();
		_setCallers();
		_setCurArmTipCaller();
		_setCurArmGemsTipCaller();
	};
	
	this.update = function(){
		m_armList.updateHeroList();
		m_armList.updateArmList();
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
	
	var _regEvents = function(){
		m_this.g.regEvent(EVT.PKG_CHANGE, 0, m_this, _onItemChanged);
		m_this.g.regEvent(EVT.NET, NETCMD.ITEMOP, m_this, _onItemOpSvrCmd);
	};
	
	var _setCallers = function(){
		m_this.items.buyGemBtn.setCaller({self:m_this, caller:_onClickBuyGem});
		
		for (var i=1; i<=MAX_GEMS_POS_COUNT; ++i ) {
			m_this.items['upgradeGem' + i].setCaller({self:m_this, caller:_onClickUpgradeGem});
			m_this.items['besetGem' + i].setCaller({self:m_this, caller:_onClickBesetGem});
		}

		m_this.items.unbesetAllBtn.setCaller({self:m_this, caller:_onClickUnbesetAll});
		
		m_this.items.armList.setCaller({self:m_this, caller:_onClickArmList});
	};
	
	var _setCurArmTipCaller = function(){
		TTIP.setCallerData(m_this.items.tooltips[TIP_PREFIX + 'curarm'], {self:m_this, caller:_onGetCurArmTip}, {});
	};
	
	var _setCurArmGemsTipCaller = function(){
		for ( var i=0; i<MAX_GEMS_POS_COUNT; ++i ) {
			TTIP.setCallerData(m_this.items.tooltips[TIP_PREFIX + 'gem' + (i+1)], {self:m_this, caller:_onGetCurArmGemsTip}, {idx:i});
		}
	};
	
	var _onGetCurArmTip = function(){
		return TIPM.getItemDesc( m_armList.getCurSelArm() );
	};
	
	var _onGetCurArmGemsTip = function(data){
		var gemResId = _getArmGemResIdByIdx(m_armList.getCurSelArm(), data.idx);
		if (!gemResId) {
			return '';
		}
		
		var gemItem = {id:0, resid:gemResId, itemres:ItemResUtil.findItemres(gemResId)};
		return TIPM.getItemDesc( gemItem );
	};
	
	var _onItemChanged = function(){
		if ( !m_this.dlg.isShow() ) return;
		
		m_armList.updateArmList();
		_updateCurArm();
	};
	
	var _onItemOpSvrCmd = function(netData){
		// do nothing ... 
	};
	
	var _onClickArmList = function(e, idx){
		_updateCurArm();
	};
	
	var _onClickBuyGem = function(){
		UIM.getDlg('buyitemlist').openDlg(res_canbuy_gems);
	};
	
	var _onClickUpgradeGem = function(id){
		var gemResId = _getArmGemResIdByIdx(m_armList.getCurSelArm(), id);
		if (!gemResId) {
			return;
		}
		
		var gemPosIdx = id;
		UIM.getDlg('upgradegem').openDlg(m_armList.getCurHeroId(), m_armList.getCurSelArm().id, gemPosIdx, gemResId);
	};
	
	var _onClickBesetGem = function(id){
		var curArm = m_armList.getCurSelArm();
		if (!curArm) {
			return;
		}
		
		m_gemPosIdx = id;
		
		var gemResId = _getArmGemResIdByIdx(curArm, m_gemPosIdx);
		if (!gemResId) {
			_openSelectGemsDlg();
		}
		else {
			ItemOpSender.sendUnbesetGem(m_this.g, m_armList.getCurHeroId(), curArm.id, m_gemPosIdx);
		}
	};
	
	var _onClickUnbesetAll = function(){
		var curArm = m_armList.getCurSelArm();
		if (!curArm) {
			return;
		}
		
		ItemOpSender.sendUnbesetAllGems(m_this.g, m_armList.getCurHeroId(), curArm.id);
	};
	
	var _onSelectBesetGem = function(gem){
		var curArm = m_armList.getCurSelArm();
		if ( GemUtil.hasSameTypeGems(curArm, gem.resid) ) {
			m_this.g.getGUI().sysMsgTips(SMT_WARNING, rstr.armopdlg.besetGems.tip.hasSameGem);
			return RET_CONTINUE;
		}
		
		ItemOpSender.sendBesetGem(m_this.g, 
			m_armList.getCurHeroId(), 
			curArm.id, 
			m_gemPosIdx, gem.resid);
		
		return RET_END;
	};
	
	var _openSelectGemsDlg = function(){
		var dlg = UIM.getDlg('filteritemex');
		dlg.setCaller({self:m_this,caller:_onSelectBesetGem});
		dlg.openDlg({title:rstr.getmlistdlg.title, filter:'gem'});
	};
	
	var _getArmGemResIdByIdx = function(curArm, idx){
		if (!curArm || !curArm.gems || !curArm.gems[idx] ) {
			return 0;
		}
		
		return curArm.gems[idx];
	};
	
	var _updateCurArm = function(){
		var curArm = m_armList.getCurSelArm();
		if (!curArm) {
			_clearCurArm();
			return;
		}
		
		_updateCurArmIcon(curArm);
		_updateCurArmGemsList(curArm);
		_toggleBesetBtnsText(curArm);
		_enableBesetBtnsEnableState(curArm);
		_toggleUpgradeBtnsEnableState(curArm);
		_toggleUnbesetAllBtnEnableState(curArm);
	};	
	
	var _clearCurArm = function(){
		IMG.setBKImage(m_this.items.curIcon, '');
		TQ.setClass(m_this.items.curIcon, '');
		for ( var i=1; i<=MAX_GEMS_POS_COUNT; ++i ) {
			IMG.setBKImage(m_this.items['gemIcon' + i], '');
			TQ.setClass(m_this.items['gemIcon' + i], '');
			m_this.items['upgradeGem' + i].enable(false);
			m_this.items['besetGem' + i].enable(false);
		}
		
		m_this.items.unbesetAllBtn.enable(false);
	};
	
	var _updateCurArmIcon = function(curArm){
		CommDrawItem.drawItemIcon(m_this.items.curIcon, curArm.itemres);
	};
	
	var _updateCurArmGemsList = function(curArm){
		for ( var i=0; i<MAX_GEMS_POS_COUNT; ++i ){
			IMG.setBKImage(m_this.items['gemIcon' + (i+1)], '' );
			TQ.setClass(m_this.items['gemIcon' + (i+1)], '');
		}
		
		for ( var i=0; i<curArm.gems.length; ++i ) {
			var resid = curArm.gems[i];
			if (!resid) continue;
			
			var itemres = ItemResUtil.findItemres(resid);
			CommDrawItem.drawItemIcon(m_this.items['gemIcon' + (i+1)], itemres);
		}
	};

	var _toggleBesetBtnsText = function(curArm){
		for ( var i=1; i<=MAX_GEMS_POS_COUNT; ++i ) {
			var btn = m_this.items['besetGem' + i];
			btn.setText(!curArm.gems[i-1] ? rstr.armopdlg.besetGems.btn.besetGem : rstr.armopdlg.besetGems.btn.removeGem);
		}
	};
	
	var _enableBesetBtnsEnableState = function(curArm){
		for ( var i=1; i<=MAX_GEMS_POS_COUNT; ++i ) {
			m_this.items['besetGem' + i].enable(true);
		};
	};	
	
	var _toggleUpgradeBtnsEnableState = function(curArm){
		for ( var i=1; i<=MAX_GEMS_POS_COUNT; ++i ) {
			var btn = m_this.items['upgradeGem' + i];
			var resid = curArm.gems[i-1];
			if (!resid || GemUtil.isMaxGemLevel(resid)) {
				btn.enable(false);
			}
			else {
				btn.enable(true);
			}
		}
	};
	
	var _toggleUnbesetAllBtnEnableState = function(curArm){
		for ( var i=0; i<MAX_GEMS_POS_COUNT; ++i ) {
			if (curArm.gems[i]) {
				m_this.items.unbesetAllBtn.enable(true);
				return;
			}
		}
		
		m_this.items.unbesetAllBtn.enable(false);
	};
	//BesetGemOpPanel-unittest-end
});

CombineGemOpPanel = BaseArmOpPanel.extern(function(){
	//CombineGemOpPanel-unittest-start
	var NEED_MIN_GEMCOUNT = 2;
	var COMBINE_LEVEL_COUNT = 4;
	var m_this = null;
	var m_myGems = [];
	this.initPanel = function(){
		m_this = this;
		
		_regEvents();
		_setCallers();
		_setGemClassDorpList();
		_setCombineLevelList();
	};
	
	this.update = function(){
		_updateMyGemsList();
	};
	
	this.setListItemSecField = function(item, ritem){
		TQ.setTextEx(item.exsubs.levelOrNumber, ritem.number);
	};	
	
	var _regEvents = function(){
		m_this.g.regEvent(EVT.PKG_CHANGE, 0, m_this, _onItemChanged);
		m_this.g.regEvent(EVT.NET, NETCMD.ITEMOP, m_this, _onItemOpSvrCmd);	
	};
	
	var _setCallers = function(){
		TTIP.setCallerData(m_this.items.tooltips[TIP_PREFIX + 'willGemIcon'], {self:m_this, caller:_onGetWillGemTip}, {});
		
		m_this.items.lowGemsList.setItemCount(5);
		for ( var i=0, n=m_this.items.lowGemsList.getCount(); i<n; ++i ) {
			var item = m_this.items.lowGemsList.getItem(i);
			TTIP.setCallerData(item.exsubs.tooltips[TIP_PREFIX + 'item'], {self:m_this, caller:_onGetLowGemsTip}, {idx:i});
		}
		
		m_this.items.gemClassDorpList.setCaller({self:m_this, caller:_onClickGemClassDropList});
		m_this.items.myGemsList.setCaller({self:m_this, caller:_onClickMyGemsList});
		m_this.items.combineLevelList.setCaller({self:m_this, caller:_onClickCombineLevelList});
		m_this.items.combineGem.setCaller({self:m_this, caller:_onClickCombineGem});
		m_this.items.combineGems.setCaller({self:m_this, caller:_onClickCombineGems});
		m_this.items.buyGem.setCaller({self:m_this, caller:_onClickBuyGem});
	};
	
	var _setGemClassDorpList = function(){
		var gemClassNames = rstr.armopdlg.combineGems.gemClassNames;
		for (var k in gemClassNames) {
			m_this.items.gemClassDorpList.addItem({text:gemClassNames[k]});
		}
		m_this.items.gemClassDorpList.setCurSel(0);	
	};
	
	var _setCombineLevelList = function(){
		var combineLevels = rstr.armopdlg.combineGems.combineLevels;
		m_this.items.combineLevelList.setItemCount(combineLevels.length);
		for ( var i=0; i<combineLevels.length; ++i ){
			var item = m_this.items.combineLevelList.getItem(i);
			TQ.setTextEx(item.exsubs.desc, combineLevels[i] );
		}
	};
	
	var _updateMyGemsList = function(){
		_filterMyGems();
		_mergeSameGems();
		_sortGems();
		_setMyGemsListItems();
		_resetMyGemsListCurSel();
		_setMyGemsListTipCaller();
	};
	
	var _filterMyGems = function(){
		var classIds = [RES_CLS.GEMITEM, RES_CLS.ST_GEMITEM, RES_CLS.AG_GEMITEM, RES_CLS.PH_GEMITEM, RES_CLS.CO_GEMITEM];
		var filter = ItemClassRangeFilter.snew(m_this.g);
		var curSelClassId =  classIds[ m_this.items.gemClassDorpList.getCurSel() ];
		m_myGems = filter.filter({classId : curSelClassId});
	};
	
	var _mergeSameGems = function(){
		var gems = {};
		for ( var k in m_myGems ){
			var gem = m_myGems[k];
			if (!gems[gem.resid]){
				var newgem = {};
				TQ.dictCopy(newgem, gem);
				gems[gem.resid] = newgem;
			} else {
				gems[gem.resid].number += gem.number;
			}
		}
		
		m_myGems = TQ.dictToList( gems );
	};
	
	var _sortGems = function(){
		var _sortCmp = function(a, b) {
			return a.resid - b.resid;
		};
		
		m_myGems.sort(_sortCmp);
	};
	
	var _setMyGemsListItems = function(){
		m_this.setMyArmListItems(m_this.items.myGemsList, m_myGems);
	};
	
	var _resetMyGemsListCurSel = function(){
		m_this.resetListCurSel(m_this.items.myGemsList);
	};
	
	var _setMyGemsListTipCaller = function(){
		m_this.setListTipCaller(m_this.items.myGemsList, _onGetMyGemsListTip);
	};
	
	var _onGetMyGemsListTip = function(data){
		return TIPM.getItemDesc(m_myGems[data.idx]);
	};
	
	var _onGetWillGemTip = function(data){
		return TIPM.getItemDesc(_getWillGem());
	};
	
	var _onGetLowGemsTip = function(data){
		return TIPM.getItemDesc(_getLowGemByIdx(data.idx));
	};
	
	var _onClickGemClassDropList = function(e, idx){
		_updateMyGemsList();
	};
	
	var _onClickMyGemsList = function(e, idx){
		_reselectCombineLevelList();
	};
	
	var _onClickCombineLevelList = function(e, idx){
		_clearWillGem();
		_clearLowGemList();
		_clearCombineLevelListAllCheck();
		
		if ( idx < 0 ) {
			return;
		}
		
		if (_getLowGemNumber() == 0 ){ // no gems
			return;
		}
		
		if (_getLowGemNumber() < NEED_MIN_GEMCOUNT){// no enough gems
			m_this.g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100032].msg);
			return;
		}
		
		if (GemUtil.isMaxGemLevel(_getLowGemResId()) ){
			m_this.g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100031].msg);
			return;
		}
		
		var combineLevel = idx+1;
		if ( _getNeedLowGemNumber(combineLevel) > _getLowGemNumber() ) {
			m_this.g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100032].msg);
			idx = _calcCanSelMaxCombineLevel() - 1;
		}
		
		_checkCombineLevelListItem(idx);
		_updateWillGem();
		_updateLowGemList();
	};
	
	var _onClickCombineGem = function(){
		_doCommCombineGems();
	};
	
	var _onClickCombineGems = function(){
		_doBatchCombineGems();
	};
	
	var _onClickBuyGem = function(){
		UIM.getDlg('buyitemlist').openDlg(res_canbuy_gems);
	};
	
	var _onItemChanged = function(){
		if ( !m_this.dlg.isShow() ) return;
		
		_updateMyGemsList();
	};	
	
	var _onItemOpSvrCmd = function(netData){
		// do nothing ... 
	};
	
	var _doBatchCombineGems = function(){
		if ( !_isCanCombine() ) {
			return;
		}
		
		var times = Math.floor(_getLowGemNumber()/GemUtil.getCombineNeedNumber(_getCombineLevel()));
		var tip = rstr.armopdlg.combineGems.combineLevelNames[_getCombineLevel() - 1];
		var msg = TQ.format(rstr.armopdlg.combineGems.batchCombine, tip.name, times, tip.pro );
		m_this.g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_YESNO, {self:m_this, caller:function(id){
			if ( id == MB_IDYES ) {
				ItemOpSender.sendCombineGems(m_this.g, _getLowGemResId(), _getCombineLevel(), true);
			}
		}});
	};
	
	var _doCommCombineGems = function(){
		if ( !_isCanCombine() ) {
			return;
		}
		
		if ( _getCombineLevel() == 4 ) {
			ItemOpSender.sendCombineGems(m_this.g, _getLowGemResId(), _getCombineLevel(), false);
			return;
		}
		
		var tip = rstr.armopdlg.combineGems.combineLevelNames[_getCombineLevel() - 1];
		var msg = TQ.format(rstr.armopdlg.combineGems.proCommCombine, tip.pro );
		m_this.g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_YESNO, {self:m_this, caller:function(id){
			if ( id == MB_IDYES ) {
				ItemOpSender.sendCombineGems(m_this.g, _getLowGemResId(), _getCombineLevel(), false);
			}
		}});
	};
	
	var _isCanCombine = function(){
		if (_getLowGemNumber() == 0){
			return false;
		}
		
		if (GemUtil.isMaxGemLevel(_getLowGemResId()) ){
			m_this.g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100031].msg);
			return false;
		}
		
		if (_getCombineLevel() == 0){
			m_this.g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100032].msg);
			return false ;
		}
		
		return true;
	};
	
	var _getWillGem = function(){
		if (_getLowGemNumber() == 0 || GemUtil.isMaxGemLevel(_getLowGemResId()) ){
			return null;
		}
		
		var nextGemResId = _getNextLevelGemResId(_getLowGemResId());
		return {id:0, resid:nextGemResId, itemres:ItemResUtil.findItemres(nextGemResId)};
	};
	
	var _getCurNeedLowGemNumber = function(){
		return _getNeedLowGemNumber(_getCombineLevel());
	};
	
	var _getNeedLowGemNumber = function(combineLevel){
		var levelNeedNumbers = {'1':2, '2':3, '3':4, '4':5};
		var number = levelNeedNumbers[combineLevel];
		return number ? number : 0;
	};
	
	var _getLowGemNumber = function(){
		var curGem = _getCurSelGem();
		if (!curGem) return 0;
		
		return curGem.number ? curGem.number : 0;
	};
	
	var _getLowGemByIdx = function(idx){
		if (idx >= _getCurNeedLowGemNumber()){
			return null;
		}
		
		var curGem = _getCurSelGem();
		if (!curGem) {
			return null;
		}
		return {id:0, resid:curGem.resid, itemres:curGem.itemres, number:1};
	};
	
	var _getCurSelGem = function(){
		return m_myGems[ m_this.items.myGemsList.getCurSel() ];
	};
	
	var _getLowGemResId = function(){
		var curGem = _getCurSelGem();
		if (!curGem) return 0;
		
		return curGem.resid;
	};
	
	var _reselectCombineLevelList = function(){
		var idx = _calcCanSelMaxCombineLevel() - 1;
		m_this.items.combineLevelList.setCurSel(idx);
	};
	
	var _calcCanSelMaxCombineLevel = function(){
		return Math.min((_getLowGemNumber() - NEED_MIN_GEMCOUNT + 1), COMBINE_LEVEL_COUNT);
	};
	
	var _checkCombineLevelListItem = function(idx){
		_clearCombineLevelListAllCheck();
		m_this.items.combineLevelList.getItem(idx).exsubs.sel.setCheck(1);
	};
	
	var _clearCombineLevelListAllCheck = function(){
		for ( var i=0, n=m_this.items.combineLevelList.getCount(); i<n; ++i ) {
			var item = m_this.items.combineLevelList.getItem(i);
			item.exsubs.sel.setCheck(0);
		}
	};
	
	var _getCombineLevel = function(){
		for ( var i=0, n=m_this.items.combineLevelList.getCount(); i<n; ++i ) {
			var item = m_this.items.combineLevelList.getItem(i);
			if ( item.exsubs.sel.getCheck() == 1 ) {
				return i + 1;
			}
		}
		
		return 0;
	};
	
	var _getNextLevelGemResId = function(lowGemResId){
		return lowGemResId + 1;
	};
	
	var _clearWillGem = function(){
		IMG.setBKImage(m_this.items.willGemIcon, '');
		TQ.setClass(m_this.items.willGemIcon, '');
		m_this.items.combineGem.enable(false);
		m_this.items.combineGems.enable(false);
	};
	
	var _clearLowGemList = function(){
		m_this.items.lowGemsList.setItemCount(0);
	};
	
	var _updateWillGem = function(){
		var nextGem = _getWillGem();
		CommDrawItem.drawItemIcon(m_this.items.willGemIcon, nextGem.itemres);
		m_this.items.combineGem.enable(true);
		m_this.items.combineGems.enable(true);
	};
	
	var _updateLowGemList = function(){
		var lowGem = _getCurSelGem();
		var showNumber = _getCurNeedLowGemNumber();
		m_this.items.lowGemsList.setItemCount(showNumber);
		for ( var i=0; i<showNumber; ++i ){
			var item = m_this.items.lowGemsList.getItem(i);
			CommDrawItem.drawItemIcon(item.exsubs.icon, lowGem.itemres);
		}
	};
	
	//CombineGemOpPanel-unittest-end
});

UpgradeGemDlg = Class.extern(function(){
	//UpgradeGemDlg-unittest-start
	var NEED_GEM_NUMBER = 5;

	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_heroId = 0;
	var m_armId = 0;
	var m_gemPos = 0;
	var m_srcGemResId = 0;
	var m_srcGem = {};
	var m_desGem = {};
	
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.openDlg = function(heroId, armId, gemPos, srcGemResId){
		_initDlg();
		_openDlg();
		_initInfo(heroId, armId, gemPos, srcGemResId);
	};
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		
		m_dlg = Dialog.snew(m_g, {modal:true, title:rstr.upgradegemdlg.title, pos:{x:"center", y:30} });
		m_g.getGUI().initDlg(m_dlg, uicfg.upgradegemdlg, m_items);
		_setCallers();
		_setTipCallers();
	};
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(heroId, armId, gemPos, srcGemResId){
		m_srcGemResId = srcGemResId;
		m_heroId = heroId;
		m_armId = armId;
		m_gemPos = gemPos;
		
		_createSrcGemItem();
		_createDesGemItem();
		_setSrcGemIconAndName();
		_setDesGemIconAndName();
		_setUpgradeBtnEnableState();
		_setCanOrNeedDescVisible();
		//assert ( false, 'hero wear gems change (pkg delete ), attrs recal ... ...' );
	};
	
	var _createSrcGemItem = function(){
		m_srcGem = _createGemItem(m_srcGemResId);
	};
	
	var _createDesGemItem = function(){
		m_desGem = _createGemItem( _getNextLevelGemResId(m_srcGemResId) );
	};
	
	var _setSrcGemIconAndName = function(){
		_setGemIconAndName(m_items.srcIcon, m_items.srcName, m_srcGem);
	};
	
	var _setDesGemIconAndName = function(){
		_setGemIconAndName(m_items.desIcon, m_items.desName, m_desGem);
	};
	
	var _setUpgradeBtnEnableState = function(){
		m_items.upgradeBtn.enable( _hasEnoughGems() );
	};
	
	var _setCanOrNeedDescVisible = function(){
		TQ.setCSS(m_items.canDesc, 'display', _hasEnoughGems() ? 'block' : 'none');
		TQ.setCSS(m_items.needDesc, 'display', _hasEnoughGems() ? 'none' : 'block' );
			
		if ( !_hasEnoughGems() ) {
			var patternStr = rstr.upgradegemdlg.lbl.needDesc;
			var s = TQ.format(patternStr, NEED_GEM_NUMBER, m_srcGem.itemres.name, _getMyHasGemIncludeCurArmBested());
			TQ.setTextEx(m_items.needDesc, HyperLinkMgr.formatLink(s));
		}
	};
	
	var _setCallers = function(){
		m_items.upgradeBtn.setCaller({self:m_this, caller:_onClickUpgrade});
	};
	
	var _setTipCallers = function(){
		TTIP.setCallerData(m_items.tooltips[TIP_PREFIX + 'src'], {self:m_this, caller:_onGetSrcGemTip}, {});
		TTIP.setCallerData(m_items.tooltips[TIP_PREFIX + 'des'], {self:m_this, caller:_onGetDesGemTip}, {});
	};
	
	var _createGemItem = function(resid){
		return {resid:resid, itemres:ItemResUtil.findItemres(resid)};
	};
	
	var _setGemIconAndName = function(iconDom, nameDom, gemItem){
		IMG.setBKImage(iconDom, IMG.makeBigImg(gemItem.itemres.bigpic));
		TQ.setTextEx(nameDom, gemItem.itemres.name);
	};
	
	var _hasEnoughGems = function(){
		return _getNoEnoughGemsNumber() <= 0;
	};
	
	var _getNoEnoughGemsNumber = function(){
		return NEED_GEM_NUMBER -  _getMyHasGemIncludeCurArmBested();
	};
	
	var _getMyHasGemIncludeCurArmBested = function(){
		return m_g.getImgr().getItemNumByResId(m_srcGem.resid) + 1; // add beseted in arm gem
	};
	
	var _getNextLevelGemResId = function(resid){
		return resid + 1;
	};
	
	var _onClickUpgrade = function(){
		ItemOpSender.sendUpgradeGem(m_g, m_heroId, m_armId, m_gemPos, m_srcGem.resid);
		m_dlg.hide();
	};
	
	var _onGetSrcGemTip = function(){
		return TIPM.getItemDesc( m_srcGem );
	};
	
	var _onGetDesGemTip = function(){
		return TIPM.getItemDesc( m_desGem );
	};
	
	//UpgradeGemDlg-unittest-end
});

