/*******************************************************************************/
CityDefDlg = Class.extern(function(){
	//CityDefDlg-unittest-start
	var TAB_COUNT = 3;
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_panels = {};
	
	this.init = function(g){
		_initParams(this, g);
		_regEvents();
	};
	
	this.openDlg = function(tabIdx){
		_initDlg();
		_openDlg();
		_initInfo(tabIdx);
	};
	
	var _initParams = function(selfThis, g){
		m_this = selfThis;
		m_g = g;
	};
	
	var _regEvents = function(){
		m_g.regEvent(EVT.HERO_UPDATE, 0, m_this, _onHeroUpdate);
		m_g.regEvent(EVT.SOLDIERRES, 0, m_this, _onUpdateSoldiersRes);
		m_g.regEvent(EVT.LOGIN_OK, 0, m_this, _onLoginOk);
		m_g.regEvent(EVT.NET, NETCMD.CITYDEF, m_this, _onSvrPkg);
		m_g.regEvent(EVT.NET, NETCMD.TOWER, m_this, _onSvrPkg);
	};
	
	var _initDlg = function(){
		if (m_dlg) return;
		
		_createDlg();
		_createPanels();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal:false, title:rstr.cityDefDlg.title, pos:{x:'center', y:50} });
		m_g.getGUI().initDlg(m_dlg, uicfg.cityDefDlg, m_items);
		m_dlg.setCaller({self:m_this,caller:_onDlgEvent});
	};
	
	var _createPanels = function(){
		m_panels['create'] = CityDefCreatePanel.snew(m_g, m_items.tabList.getTabItems(0));
		m_panels['city'] = CityDefCityPanel.snew(m_g, m_items.tabList.getTabItems(1));
		m_panels['tower'] = CityDefTowerPanel.snew(m_g, m_items.tabList.getTabItems(2));
	};
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(tabIdx){
		for ( var k in m_panels ) {
			_getPanel(k).open();
		}
		
		var towerLevel = m_g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.TOWERBUILD);
		if (!towerLevel) {// hide tower tabpage
			m_items.tabList.setTabCount(TAB_COUNT-1);
		}
		else {
			m_items.tabList.setTabCount(TAB_COUNT);
		}
		
		m_items.tabList.activeTab(tabIdx);
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			for ( var k in m_panels ) {
				_getPanel(k).hide();
			}
		}
	};
	
	var _onHeroUpdate = function(){
		_getPanel('city').update();
	};
	
	var _onUpdateSoldiersRes = function(){
		_getPanel('tower').update();
	};
	
	var _onLoginOk = function(){
		CityDefSender.sendGetCityDefInfo(m_g);
	};
	
	var _onSvrPkg = function(netevent){
		var ndata = netevent.data;
		if ( ndata.citydefs ) {
			TQ.dictCopy(m_g.getImgr().getCityDefs().defs, ndata.citydefs);
			_getPanel('create').update();
		}
		
		if ( ndata.building ) {
			TQ.dictCopy(m_g.getImgr().getCityDefs().building, ndata.building);
			_getPanel('create').update();
		}
		
		if ( ndata.defarmy ){
			TQ.dictCopy(m_g.getImgr().getCityDefs().defarmy, ndata.defarmy);
			_getPanel('city').update();
		}
		
		if ( ndata.tower ){
			TQ.dictCopy(m_g.getImgr().getTower(), ndata.tower);
			_getPanel('tower').update();
		}
	};
	
	var _getPanel = function(panelName){
		if ( m_panels[panelName] ) {
			return m_panels[panelName];
		}
		return NullCityDefPanel.snew();
	};
	//CityDefDlg-unittest-end
});

NullCityDefPanel = Class.extern(function(){
	this.init = function(g, items){};
	this.open = function(){};
	this.hide = function(){};
	this.update = function(){};
});

CityDefCreatePanel = Class.extern(function(){
	//CityDefCreatePanel-unittest-start
	var m_g = null;
	var m_items = null;
	var m_this = null;
	var m_isShow = false;
	
	this.init = function(g, items){
		_initParams(this, g, items);
		_setSelList();
		_setBuildInputNumLimit();
		_setCallers();
	};
	
	this.open = function(){
		m_isShow = true;
		m_items.selList.setCurSel(0);
		m_items.inum.setVal(1);
		this.update();
		m_g.regUpdater(m_this, _onUpdate, 1000);
	};
	
	this.hide = function(){
		m_isShow = false;
		m_g.unregUpdater(m_this, _onUpdate);
	};
	
	this.update = function(){
		if ( !m_isShow ) return;
		
		_updateBuildingInfos();
		_udpateBuildedList();
		_updateCurSelInfo();
		_updateCapacity();
	};
	
	var _initParams = function(selfThis, g, items){
		m_this = selfThis;
		m_g = g;
		m_items = items;
	};
	
	var _setSelList = function(){
		for ( var i=0; i<m_items.selList.getCount(); ++i ) {
			var item = m_items.selList.getItem(i);
			var res = res_citydef[i];
			IMG.setBKImage(item.exsubs.icon, IMG.makeBigImg(res.bigpic) );
			TQ.setTextEx( item.exsubs.name, res.name );
		}
	};
	
	var _setBuildInputNumLimit = function(){
		m_items.inum.setLimit(_getInputNumLimit);
	};
	
	var _setCallers = function(){
		m_items.speedBtn.setCaller({self:m_this, caller:_onClickSpeed});
		m_items.cancelBtn.setCaller({self:m_this, caller:_onClickCancel});
		m_items.selList.setCaller({self:m_this, caller:_onClickSelList});
		m_items.buildBtn.setCaller({self:m_this, caller:_onClickBuild});
		m_items.inum.setCaller({self:m_this, caller:_onNumberChange});
		
		for ( var i=0; i<m_items.buildedList.getCount(); ++i ){
			var item = m_items.buildedList.getItem(i);
			item.exsubs.downBtn.setId(i);
			item.exsubs.downBtn.setCaller({self:m_this, caller:_onClickDown});
		}
	};
	
	var _getInputNumLimit = function(){
		var maxNum = 0xffffffff;
		var _compareMaxNumByExpend = function(tag, oneNeedNumber){
			var num = Math.floor(_getMyHasNumber(tag)/oneNeedNumber);
			if ( num < maxNum ) maxNum = num;
		};
		_traversalExpends(_compareMaxNumByExpend);
		
		maxNum = Math.min(maxNum, _getLeftCapacity());
		maxNum = Math.max(1, maxNum);
		
		return {min:1, max:maxNum};
	};
	
	var _updateBuildingInfos = function(){
		var building = m_g.getImgr().getCityDefs().building;
		if ( building.id == 0 ) {
			TQ.setCSS(m_items.buildingInfo, 'display', 'none');
			return;
		}
		
		var res = ItemResUtil.findItemres(building.id);
		TQ.setCSS(m_items.buildingInfo, 'display', 'block');
		TQ.setTextEx ( m_items.buildingName, TQ.format(rstr.cityDefDlg.lbl.buildingNumber, res.name) );
		TQ.setTextEx ( m_items.buildingNumber, building.number);
		var leftTime = Math.max(0, building.stoptime - m_g.getSvrTimeS());
		TQ.setTextEx ( m_items.buildingLefttime, TQ.formatTime(0, leftTime));
	};
	
	var _udpateBuildedList = function(){
		var defs = m_g.getImgr().getCityDefs().defs;
		for ( var i=0; i<res_citydef.length; ++i ) {
			var res = res_citydef[i];
			var defNumber = defs[i];
			var item = m_items.buildedList.getItem(i);
			
			TQ.setTextEx(item.exsubs.name, res.name);
			TQ.setTextEx(item.exsubs.number, defNumber);
			if ( defNumber>0 ) {
				item.exsubs.downBtn.show();
			}
			else {
				item.exsubs.downBtn.hide();
			}
		}
	};
	
	var _updateCurSelInfo = function(){
		_updateCurSelDefName();
		_updateCurSelEffectDesc();
		_updateCurSelExpendDesc();
		_updateCurSelBuildNeedTime();
	};
	
	var _updateCurSelDefName = function(){
		var res = res_citydef[_getCurSelBuild()];
		TQ.setTextEx(m_items.selName, res.name);
	};
	
	var _updateCurSelEffectDesc = function(){
		var res = res_citydef[_getCurSelBuild()];
		TQ.setTextEx(m_items.effDesc, res.desc);
	};
	
	var _updateCurSelExpendDesc = function(){
		var inputNum = m_items.inum.getVal();
		var desc = '';
		var _combineExpendDesc = function(tag, oneNeedNumber){
			var needResNumber = inputNum*oneNeedNumber;
			var color = (needResNumber <= _getMyHasNumber(tag)) ? C_TIP_VALIDCOLOR : C_TIP_INVALIDCOLOR;
			var s = rstr.comm.resname[tag] + C_TIP_SPACE + needResNumber + C_TIP_FOUR_SPACE;
			desc += TQ.formatColorStr(s, color);
		};
		_traversalExpends(_combineExpendDesc);
		TQ.setTextEx(m_items.expendDesc, desc);
	};
	
	var _updateCurSelBuildNeedTime = function(){
		var res = res_citydef[_getCurSelBuild()];
		var role_interior = m_g.getImgr().getRoleAttrVal(ATTR.IN_B) + m_g.getImgr().getRoleAttrVal(ATTR.IN_A);
		var wallBuildLevel = m_g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.WALLBUILD);
		var unitTime = Math.ceil(res.ntime/(1 + role_interior/100 + wallBuildLevel/20));
		TQ.setTextEx(m_items.needTime, unitTime*m_items.inum.getVal());
	};
	
	var _updateCapacity = function(){
		TQ.setTextEx(m_items.capacityDesc, _getHasCityDefs() + '/' + _getTotalCapacity());
	};
	
	var _getCurSelBuild = function(){
		return m_items.selList.getCurSel();
	};
	
	var _getResTags = function(){
		return ['money', 'food', 'wood', 'stone', 'iron'];
	};
	
	var _getMyHasNumber = function(tag) {
		if ( tag == 'money' ) return m_g.getImgr().getMoney();
		else return m_g.getImgr().getCityRes().cres[tag];
	};
	
	var _getLeftCapacity = function(){
		return _getTotalCapacity() - _getHasCityDefs();
	};
	
	var _getTotalCapacity = function(){
		var wallBuildLevel = m_g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.WALLBUILD);
		
		var jiaolouLevels = 0;
		var jiaolouBuilds = m_g.getImgr().getBuildsByResid(BUILDCITY_ID.ALL, FIXID.JIAOLOUBUILD);
		for ( var i=0; i<jiaolouBuilds.length; ++i ){
			jiaolouLevels += jiaolouBuilds[i].level;
		}
		
		return Math.floor(wallBuildLevel*200*(1 + jiaolouLevels/20));
	};
	
	var _getHasCityDefs = function(){
		var defs = m_g.getImgr().getCityDefs().defs;
		return defs[0] + defs[1] + defs[2] + defs[3] + defs[4];
	};
	
	var _onUpdate = function(){
		_updateBuildingInfos();
	};
	
	var _onClickSpeed = function(){
		var building = m_g.getImgr().getCityDefs().building;
		var res = ItemResUtil.findItemres(building.id);
		UIM.openDlg('uselistitem', [RES_EFF.ACC_CITYDEF], {id:building.id, stoptime:building.stoptime, name:res.name, type:RES_TRG.SELF_ROLE} );
	};
	
	var _onClickCancel = function(){
		var _onCancelCallback = function(id){
			if ( id == MB_IDYES ) {
				CityDefSender.sendCancelBuilding(m_g);
			}
		};
		
		m_g.getGUI().msgBox(rstr.comm.msgts, 
			rstr.cityDefDlg.tip.confirmCancel,
			MB_F_YESNO, 
			{self:m_this, caller:_onCancelCallback} );
	};
	
	var _onClickSelList = function(){
		m_items.inum.setVal(1);
		_updateCurSelInfo();
	};
	
	var _onNumberChange = function(num){
		_updateCurSelInfo();
	};
	
	var _onClickDown = function(idx){
		var _onInputDownNumberOk = function(num) {
			CityDefSender.sendDownCityDef(m_g, idx, num);
		};
		
		// make tip msg
		var res = res_citydef[idx];
		var defNumber = m_g.getImgr().getCityDefs().defs[idx];
		var msg = TQ.format(rstr.cityDefDlg.lbl.downInputNum, res.name, defNumber);
		
		var inputdlg = UIM.getDlg('inputnum');
		inputdlg.openDlg(msg, defNumber);
		inputdlg.setCaller({self:m_this, caller:_onInputDownNumberOk});
	};
	
	var _onClickBuild = function(){
		var building = m_g.getImgr().getCityDefs().building;
		if ( building.id > 0 ) {
			m_g.getGUI().sysMsgTips( SMT_WARNING, rstr.cityDefDlg.tip.hasBuilding);
			return;
		}
		
		var buildNum = m_items.inum.getVal();
		if ( buildNum > _getLeftCapacity() ) {
			m_g.getGUI().msgBox(rstr.comm.msgts, rstr.cityDefDlg.tip.noEnoughCapacity, MB_F_CLOSE, null);
			return;
		}
		
		var expendTip = _getCurSelInvalidExpendTip();
		if (expendTip != ''){
			m_g.getGUI().msgBox(rstr.comm.msgts, rstr.cityDefDlg.tip.noEnoughRes + expendTip, MB_F_CLOSE, null);
			return;
		}
		
		CityDefSender.sendBuildCityDef(m_g, _getCurSelBuild(), buildNum);
		
		m_items.inum.setVal(1);
	};
	
	var _getCurSelInvalidExpendTip = function(){
		var inputNum = m_items.inum.getVal();
		var desc = '';
		var _combineInvalidExpendTip = function(tag, oneNeedNumber){
			var needResNumber = inputNum*oneNeedNumber;
			if ( needResNumber > _getMyHasNumber(tag) ) { // has no enough res
				var s = rstr.comm.resname[tag] + C_TIP_SPACE + needResNumber + C_TIP_NEWLINE;
				desc += TQ.formatColorStr(s, C_TIP_INVALIDCOLOR);
			}
		};
		_traversalExpends(_combineInvalidExpendTip);
		return desc;
	};
	
	var _traversalExpends = function(callBackFun){
		var res = res_citydef[_getCurSelBuild()];
		var tags = _getResTags();
		for ( var i=0; i<tags.length; ++i ) {
			var tag = tags[i];
			if ( !res[tag] ) continue;
			
			callBackFun(tag, res[tag]);
		}
	};
	
	//CityDefCreatePanel-unittest-end
});

CityDefForceTabHdr = ExpedForceTabHdr.extern(function(){
	this.isNeedSingleHero = function(){
		return false;
	};
});

CityDefCityPanel = Class.extern(function(){
	//CityDefCityPanel-unittest-start
	var m_g = null;
	var m_items = null;
	var m_this = null;
	var m_forceTabHdr = null;
	var m_isShow = false;
	var C_BTN_DELAY_MS = 300;
		
	this.init = function(g, items){
		_initParams(this, g, items);
		_setCallers();
	};
	
	this.open = function(){
		m_isShow = true;
		this.update();
	};
	
	this.hide = function(){
		m_isShow = false;
	};
	
	this.update = function(){
		if ( !m_isShow ) return;
		
		_updateForcetabList();
	};
	
	var _initParams = function(selfThis, g, items){
		m_this = selfThis;
		m_g = g;
		m_items = items;
		m_forceTabHdr = CityDefForceTabHdr.snew(g, items);
	};
	
	var _setCallers = function(){
		m_items.saveForcetab.setType(BTN_TYPE.DELAY);
		m_items.saveForcetab.setDelay(C_BTN_DELAY_MS);
		
		m_items.changeForcetab.setCaller({self:m_this, caller:_onClickChangeForcetab});
		m_items.assignSoldier.setCaller({self:m_this, caller:_onClickAssignSoldier});
		m_items.saveForcetab.setCaller({self:m_this, caller:_onClickSaveForcetab});
	};
	
	var _updateForcetabList = function(){
		var defArmy = m_g.getImgr().getCityDefs().defarmy;
		m_forceTabHdr.setLineup(defArmy.lineupId, defArmy.heros);
		m_forceTabHdr.refresh();
	};
	
	var _onClickChangeForcetab = function(){
		var _assignHerosCallback = function(lineup, heroIds){
			m_forceTabHdr.setLineup(lineup, heroIds);
			m_forceTabHdr.refresh();
		};
		
		var dlg = UIM.getDlg('assignheros');
		dlg.setCaller({self:m_this, caller:_assignHerosCallback});
		dlg.openDlg({canEmpty:true});
	};
	
	var _onClickAssignSoldier = function(){
		UIM.openDlg('assignsoldiers');
	};
	
	var _onClickSaveForcetab = function(){
		CityDefSender.sendSaveDefArmy(m_g, m_forceTabHdr.getLineup(), m_forceTabHdr.getHeroIds());
	};
	//CityDefCityPanel-unittest-end
});

FillSoldiersHdr = Class.extern(function(){
	//FillSoldiersHdr-unittest-start
	var m_g = null;
	var m_list = null;
	var m_heros = null;
	var m_msgSender = null;
	this.init = function(g, list, msgSender){
		m_g = g;
		m_list = list;
		m_msgSender = msgSender;
	};
	
	this.setHeros = function(heros){
		m_heros = heros;
	};
	
	this.confirm = function(heroIdx){
		var changedSoldier = _getChangedSoldier(heroIdx);
		if ( !changedSoldier ) {
			return;
		}
		
		m_msgSender.sendConfirmSoldiersAssign(m_g, [changedSoldier]);
	};	
	
	this.confirmAll = function(){
		var changedSoldiers = [];
		for ( var i=0; i<m_heros.length; ++i ) {
			var changedSoldier = _getChangedSoldier(i);
			if ( !changedSoldier ) continue;
			
			changedSoldiers.push(changedSoldier);
		}
		
		m_msgSender.sendConfirmSoldiersAssign(m_g, changedSoldiers);		
	};	
	
	this.fillAll = function(){
		var changedSoldiers = [];
		var filledSoldiers = MyDict.snew(0);
		for ( var i=0; i<m_heros.length; ++i ) {
			var hero = m_heros[i];
			if ( !hero.id ) continue;
			
			var curSoldier = _getCurSetSoldier(i);
			var newFillNumber = 0;
			if ( curSoldier.resid > 0 ){
				var hasNumber = _getSoldierNumber(curSoldier.resid);
				var leftNumber = hasNumber - filledSoldiers.get(curSoldier.resid);
				newFillNumber = Math.min(leftNumber, m_g.getImgr().getHeroAttrVal(hero, ATTR.CO));
				filledSoldiers.set(curSoldier.resid, filledSoldiers.get(curSoldier.resid) + newFillNumber);
			}
			
			var fillSoldier = {resid:curSoldier.resid, number:newFillNumber};
			if ( _isChanged(hero.soldier, fillSoldier) ) {
				changedSoldiers.push({id:hero.id, resid:fillSoldier.resid, number:fillSoldier.number});
			}
		}
		
		m_msgSender.sendConfirmSoldiersAssign(m_g, changedSoldiers);
	};
	
	this.clearAllSoldiers = function(){
		var changedSoldiers = [];
		for ( var i=0; i<m_heros.length; ++i ) {
			var hero = m_heros[i];
			if ( !hero.id ) continue;
			if ( hero.soldier.number == 0 ) continue;
			
			changedSoldiers.push({id:hero.id, resid:hero.soldier.resid, number:0});
		}
		
		m_msgSender.sendConfirmSoldiersAssign(m_g, changedSoldiers);
	};
	
	var _getChangedSoldier = function(heroIdx){
		var hero = m_heros[heroIdx];
		if ( !hero.id ) {
			return null;
		}
		
		var curSoldier = _getCurSetSoldier(heroIdx);
		if ( !_isChanged(hero.soldier, curSoldier) ) {
			return null;
		}
		
		return {id:hero.id, resid:curSoldier.resid, number:curSoldier.number};
	};
	
	var _isChanged = function(soldier1, soldier2){
		return (soldier1.resid != soldier2.resid) || (soldier1.number != soldier2.number);
	};
	
	var _getCurSetSoldier = function(heroIdx){
		if ( m_list == null ) {
			var hero = m_heros[heroIdx];
			return {resid:hero.soldier.resid, number:hero.soldier.number};
		}
		
		var listItem = m_list.getItem(heroIdx);
		var soldierTypeIdx = listItem.exsubs.soldiertype.getCurSel();
		
		var soldierResId= listItem.exsubs.userdata.soldiertypes[soldierTypeIdx];
		var soldierNumber = listItem.exsubs.soldiernumber.getVal();
		return {resid:soldierResId, number:soldierNumber};
	};
	
	var _getSoldierNumber = function(resid){
		var number = m_g.getImgr().getSoldierNumber(resid);
		for ( var i=0; i<m_heros.length; ++i ) {
			var hero = m_heros[i];
			if ( !hero.id ) continue;
			if ( hero.soldier.resid != resid) continue;
			
			number += hero.soldier.number;
		}
		return number;
	};
	
	//FillSoldiersHdr-unittest-end
});

CityDefTowerPanel = Class.extern(function(){
	//CityDefTowerPanel-unittest-start
	var C_BTN_DELAY_MS = 300;
	var m_this = null;
	var m_g = null;
	var m_items = null;
	var m_isShow = false;
	var m_heros = null;
	var m_assignSoldierHdr = null;
	var m_fillSoliderHdr = null;
	
	this.init = function(g, items){
		_initParams(this, g, items);
		_initDelayBtns();
		_setCallers();
	};
	
	this.open = function(){
		m_isShow = true;
		this.update();
	};
	
	this.hide = function(){
		m_isShow = false;
	};
	
	this.update = function(){
		if ( !m_isShow ) return;
		
		_updateForcetabList();
		_updateTowerAttrs();
		_updateFreeSoldierList();
	};
	
	var _initParams = function(selfThis, g, items){
		m_this = selfThis;
		m_g = g;
		m_items = items;
		m_assignSoldierHdr = AssignSoldiersHdr.snew(m_g, m_items.forcetablist);
		m_fillSoliderHdr = FillSoldiersHdr.snew(m_g, m_items.forcetablist, TowerSender);
	};
	
	var _initDelayBtns = function(){
		m_items.clearAll.setType(BTN_TYPE.DELAY);
		m_items.clearAll.setDelay(C_BTN_DELAY_MS);
		m_items.fillAll.setType(BTN_TYPE.DELAY);
		m_items.fillAll.setDelay(C_BTN_DELAY_MS);
	};
	
	var _setCallers = function(){
		m_items.clearAll.setCaller({self:m_this, caller:_onClickClearAll});
		m_items.fillAll.setCaller({self:m_this, caller:_onClickFillAll});
		m_items.confirmAll.setCaller({self:m_this, caller:_onClickConfirmAll});
	};
	
	var _updateForcetabList = function(){
		_disableAllForcetabListGrids();
		_enableForcetabListGrids();
		_createTowerHeros();
		_setForcetabListItems();
		_setForcetabListCaller();
	};
	
	var _disableAllForcetabListGrids = function(){
		for ( var gridIdx=0; gridIdx<m_items.forcetablist.getCount(); ++gridIdx ) {
			_disableForcetabListGrid(gridIdx);
		}
	};
	
	var _enableForcetabListGrids = function(){
		var tower = m_g.getImgr().getTower();
		var lineupRes = ItemResUtil.findItemres(tower.lineupId);
		for ( var i=0; i<lineupRes.grids.length; ++i ) {
			var gridIdx = lineupRes.grids[i];
			_enableForcetabListGrid(gridIdx);
		}
	};
	
	var _createTowerHeros = function(){
		m_heros = [];
		for ( var i=0; i<m_items.forcetablist.getCount(); ++i ){
			m_heros.push({id:0, soldier:{resid:0, number:0}});
		}
		
		var heroRes = _getHeroRes();
		var tower = m_g.getImgr().getTower();
		var lineupRes = ItemResUtil.findItemres(tower.lineupId);
		for ( var i=0; i<lineupRes.grids.length; ++i ) {
			var gridIdx = lineupRes.grids[i];
			var soldier = tower.soldiers[i];
			m_heros[gridIdx].id = (i+1);
			m_heros[gridIdx].soldier.resid = soldier.resid;
			m_heros[gridIdx].soldier.number = soldier.number;
			m_heros[gridIdx].attrs = {};
			m_heros[gridIdx].attrs[ATTR.CO] = {val:heroRes ? heroRes.maxnum : 0};
		}
		
		m_fillSoliderHdr.setHeros(m_heros);
		m_assignSoldierHdr.setHeros(m_heros);
	};
	
	var _setForcetabListItems = function(){
		for ( var i=0; i<m_items.forcetablist.getCount(); ++i ) {
			m_assignSoldierHdr.fillSoldierDropType(m_items.forcetablist.getItem(i), m_heros[i].soldier);
		}
	};
	
	var _setForcetabListCaller = function(){
		m_assignSoldierHdr.setCallers({self:m_this, caller:_onClickConfirmBtn});
	};
	
	var _disableForcetabListGrid = function(gridIdx){
		var item = m_items.forcetablist.getItem(gridIdx);
		TQ.setCSS ( item.exsubs.container, 'display', 'none');
		IMG.setBKImage(item.exsubs.bak, IMG.makeImg('expedition/forcetab/disablebak.gif'));
	};
	
	var _enableForcetabListGrid = function(gridIdx){
		var item = m_items.forcetablist.getItem(gridIdx);
		TQ.setCSS ( item.exsubs.container, 'display', 'block');
		IMG.setBKImage(item.exsubs.bak, IMG.makeImg('expedition/forcetab/emptybak.gif'));
	};
	
	var _updateTowerAttrs = function(){
		var heroRes = _getHeroRes();
		if (!heroRes) return;
		
		TQ.setTextEx(m_items.strength, heroRes.str);
		TQ.setTextEx(m_items.agile, heroRes.agile);
		TQ.setTextEx(m_items.physical, heroRes.phy);
		TQ.setTextEx(m_items.command, heroRes.maxnum);
	};
	
	var _updateFreeSoldierList = function(){
		UpdateFreeSoldierList.setListItems(m_g, m_items.freeSoldierList);
	};
	
	var _onClickConfirmBtn = function(heroIdx){
		m_fillSoliderHdr.confirm(heroIdx);
	};
	
	var _onClickClearAll = function(){
		m_fillSoliderHdr.clearAllSoldiers();
	};
	
	var _onClickConfirmAll = function(){
		m_fillSoliderHdr.confirmAll();
	};
	
	var _onClickFillAll = function(){
		m_fillSoliderHdr.fillAll();
	};
	
	var _getHeroRes = function(){
		var towerLevel = m_g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.TOWERBUILD);
		if (!towerLevel) return null;
		
		var towerLevelRes = ItemResUtil.findBuildLevelres(FIXID.TOWERBUILD, towerLevel);
		return ItemResUtil.findItemres(towerLevelRes.fieldheroid);
	};
	//CityDefTowerPanel-unittest-end
});

