/*******************************************************************************/
CityDefDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var TAB_COUNT = 3;
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	_lc_.m_panels = {};
	
	this.init = function(g){
		_lc_._initParams(this, g);
		_lc_._regEvents();
	};
	
	this.openDlg = function(tabIdx){
		_lc_._initDlg();
		_lc_._openDlg();
		_lc_._initInfo(tabIdx);
	};
	
	_lc_._initParams = function(selfThis, g){
		_lc_.m_this = selfThis;
		_lc_.m_g = g;
	};
	
	_lc_._regEvents = function(){
		_lc_.m_g.regEvent(EVT.HERO_UPDATE, 0, _lc_.m_this, _lc_._onHeroUpdate);
		_lc_.m_g.regEvent(EVT.SOLDIERRES, 0, _lc_.m_this, _lc_._onUpdateSoldiersRes);
		_lc_.m_g.regEvent(EVT.LOGIN_OK, 0, _lc_.m_this, _lc_._onLoginOk);
		_lc_.m_g.regEvent(EVT.NET, NETCMD.CITYDEF, _lc_.m_this, _lc_._onSvrPkg);
		_lc_.m_g.regEvent(EVT.NET, NETCMD.TOWER, _lc_.m_this, _lc_._onSvrPkg);
	};
	
	_lc_._initDlg = function(){
		if (_lc_.m_dlg) return;
		
		_lc_._createDlg();
		_lc_._createPanels();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:false, title:rstr.cityDefDlg.title, pos:{x:'center', y:50} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.cityDefDlg, _lc_.m_items);
		_lc_.m_dlg.setCaller({self:_lc_.m_this,caller:_lc_._onDlgEvent});
	};
	
	_lc_._createPanels = function(){
		_lc_.m_panels['create'] = CityDefCreatePanel.snew(_lc_.m_g, _lc_.m_items.tabList.getTabItems(0));
		_lc_.m_panels['city'] = CityDefCityPanel.snew(_lc_.m_g, _lc_.m_items.tabList.getTabItems(1));
		_lc_.m_panels['tower'] = CityDefTowerPanel.snew(_lc_.m_g, _lc_.m_items.tabList.getTabItems(2));
	};
	
	_lc_._openDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(tabIdx){
		for ( var k in _lc_.m_panels ) {
			_lc_._getPanel(k).open();
		}
		
		var towerLevel = _lc_.m_g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.TOWERBUILD);
		if (!towerLevel) {// hide tower tabpage
			_lc_.m_items.tabList.setTabCount(TAB_COUNT-1);
		}
		else {
			_lc_.m_items.tabList.setTabCount(TAB_COUNT);
		}
		
		_lc_.m_items.tabList.activeTab(tabIdx);
	};
	
	_lc_._onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			for ( var k in _lc_.m_panels ) {
				_lc_._getPanel(k).hide();
			}
		}
	};
	
	_lc_._onHeroUpdate = function(){
		_lc_._getPanel('city').update();
	};
	
	_lc_._onUpdateSoldiersRes = function(){
		_lc_._getPanel('tower').update();
	};
	
	_lc_._onLoginOk = function(){
		CityDefSender.sendGetCityDefInfo(_lc_.m_g);
	};
	
	_lc_._onSvrPkg = function(netevent){
		var ndata = netevent.data;
		if ( ndata.citydefs ) {
			TQ.dictCopy(_lc_.m_g.getImgr().getCityDefs().defs, ndata.citydefs);
			_lc_._getPanel('create').update();
		}
		
		if ( ndata.building ) {
			TQ.dictCopy(_lc_.m_g.getImgr().getCityDefs().building, ndata.building);
			_lc_._getPanel('create').update();
		}
		
		if ( ndata.defarmy ){
			TQ.dictCopy(_lc_.m_g.getImgr().getCityDefs().defarmy, ndata.defarmy);
			_lc_._getPanel('city').update();
		}
		
		if ( ndata.tower ){
			TQ.dictCopy(_lc_.m_g.getImgr().getTower(), ndata.tower);
			_lc_._getPanel('tower').update();
		}
	};
	
	_lc_._getPanel = function(panelName){
		if ( _lc_.m_panels[panelName] ) {
			return _lc_.m_panels[panelName];
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
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_items = null;
	_lc_.m_this = null;
	_lc_.m_isShow = false;
	
	this.init = function(g, items){
		_lc_._initParams(this, g, items);
		_lc_._setSelList();
		_lc_._setBuildInputNumLimit();
		_lc_._setCallers();
	};
	
	this.open = function(){
		_lc_.m_isShow = true;
		_lc_.m_items.selList.setCurSel(0);
		_lc_.m_items.inum.setVal(1);
		this.update();
		_lc_.m_g.regUpdater(_lc_.m_this, _lc_._onUpdate, 1000);
	};
	
	this.hide = function(){
		_lc_.m_isShow = false;
		_lc_.m_g.unregUpdater(_lc_.m_this, _lc_._onUpdate);
	};
	
	this.update = function(){
		if ( !_lc_.m_isShow ) return;
		
		_lc_._updateBuildingInfos();
		_lc_._udpateBuildedList();
		_lc_._updateCurSelInfo();
		_lc_._updateCapacity();
	};
	
	_lc_._initParams = function(selfThis, g, items){
		_lc_.m_this = selfThis;
		_lc_.m_g = g;
		_lc_.m_items = items;
	};
	
	_lc_._setSelList = function(){
		for ( var i=0; i<_lc_.m_items.selList.getCount(); ++i ) {
			var item = _lc_.m_items.selList.getItem(i);
			var res = res_citydef[i];
			IMG.setBKImage(item.exsubs.icon, IMG.makeBigImg(res.bigpic) );
			TQ.setTextEx( item.exsubs.name, res.name );
		}
	};
	
	_lc_._setBuildInputNumLimit = function(){
		_lc_.m_items.inum.setLimit(_lc_._getInputNumLimit);
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.speedBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickSpeed});
		_lc_.m_items.cancelBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickCancel});
		_lc_.m_items.selList.setCaller({self:_lc_.m_this, caller:_lc_._onClickSelList});
		_lc_.m_items.buildBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickBuild});
		_lc_.m_items.inum.setCaller({self:_lc_.m_this, caller:_lc_._onNumberChange});
		
		for ( var i=0; i<_lc_.m_items.buildedList.getCount(); ++i ){
			var item = _lc_.m_items.buildedList.getItem(i);
			item.exsubs.downBtn.setId(i);
			item.exsubs.downBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickDown});
		}
	};
	
	_lc_._getInputNumLimit = function(){
		var maxNum = 0xffffffff;
		var _compareMaxNumByExpend = function(tag, oneNeedNumber){
			var num = Math.floor(_lc_._getMyHasNumber(tag)/oneNeedNumber);
			if ( num < maxNum ) maxNum = num;
		};
		_lc_._traversalExpends(_compareMaxNumByExpend);
		
		maxNum = Math.min(maxNum, _lc_._getLeftCapacity());
		maxNum = Math.max(1, maxNum);
		
		return {min:1, max:maxNum};
	};
	
	_lc_._updateBuildingInfos = function(){
		var building = _lc_.m_g.getImgr().getCityDefs().building;
		if ( building.id == 0 ) {
			TQ.setCSS(_lc_.m_items.buildingInfo, 'display', 'none');
			return;
		}
		
		var res = ItemResUtil.findItemres(building.id);
		TQ.setCSS(_lc_.m_items.buildingInfo, 'display', 'block');
		TQ.setTextEx ( _lc_.m_items.buildingName, TQ.format(rstr.cityDefDlg.lbl.buildingNumber, res.name) );
		TQ.setTextEx ( _lc_.m_items.buildingNumber, building.number);
		var leftTime = Math.max(0, building.stoptime - _lc_.m_g.getSvrTimeS());
		TQ.setTextEx ( _lc_.m_items.buildingLefttime, TQ.formatTime(0, leftTime));
	};
	
	_lc_._udpateBuildedList = function(){
		var defs = _lc_.m_g.getImgr().getCityDefs().defs;
		for ( var i=0; i<res_citydef.length; ++i ) {
			var res = res_citydef[i];
			var defNumber = defs[i];
			var item = _lc_.m_items.buildedList.getItem(i);
			
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
	
	_lc_._updateCurSelInfo = function(){
		_lc_._updateCurSelDefName();
		_lc_._updateCurSelEffectDesc();
		_lc_._updateCurSelExpendDesc();
		_lc_._updateCurSelBuildNeedTime();
	};
	
	_lc_._updateCurSelDefName = function(){
		var res = res_citydef[_lc_._getCurSelBuild()];
		TQ.setTextEx(_lc_.m_items.selName, res.name);
	};
	
	_lc_._updateCurSelEffectDesc = function(){
		var res = res_citydef[_lc_._getCurSelBuild()];
		TQ.setTextEx(_lc_.m_items.effDesc, res.desc);
	};
	
	_lc_._updateCurSelExpendDesc = function(){
		var inputNum = _lc_.m_items.inum.getVal();
		var desc = '';
		var _combineExpendDesc = function(tag, oneNeedNumber){
			var needResNumber = inputNum*oneNeedNumber;
			var color = (needResNumber <= _lc_._getMyHasNumber(tag)) ? C_TIP_VALIDCOLOR : C_TIP_INVALIDCOLOR;
			var s = rstr.comm.resname[tag] + C_TIP_SPACE + needResNumber + C_TIP_FOUR_SPACE;
			desc += TQ.formatColorStr(s, color);
		};
		_lc_._traversalExpends(_combineExpendDesc);
		TQ.setTextEx(_lc_.m_items.expendDesc, desc);
	};
	
	_lc_._updateCurSelBuildNeedTime = function(){
		var res = res_citydef[_lc_._getCurSelBuild()];
		var role_interior = _lc_.m_g.getImgr().getRoleAttrVal(ATTR.IN_B) + _lc_.m_g.getImgr().getRoleAttrVal(ATTR.IN_A);
		var wallBuildLevel = _lc_.m_g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.WALLBUILD);
		var unitTime = Math.ceil(res.ntime/(1 + role_interior/100 + wallBuildLevel/20));
		TQ.setTextEx(_lc_.m_items.needTime, unitTime*_lc_.m_items.inum.getVal());
	};
	
	_lc_._updateCapacity = function(){
		TQ.setTextEx(_lc_.m_items.capacityDesc, _lc_._getHasCityDefs() + '/' + _lc_._getTotalCapacity());
	};
	
	_lc_._getCurSelBuild = function(){
		return _lc_.m_items.selList.getCurSel();
	};
	
	_lc_._getResTags = function(){
		return ['money', 'food', 'wood', 'stone', 'iron'];
	};
	
	_lc_._getMyHasNumber = function(tag) {
		if ( tag == 'money' ) return _lc_.m_g.getImgr().getMoney();
		else return _lc_.m_g.getImgr().getCityRes().cres[tag];
	};
	
	_lc_._getLeftCapacity = function(){
		return _lc_._getTotalCapacity() - _lc_._getHasCityDefs();
	};
	
	_lc_._getTotalCapacity = function(){
		var wallBuildLevel = _lc_.m_g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.WALLBUILD);
		
		var jiaolouLevels = 0;
		var jiaolouBuilds = _lc_.m_g.getImgr().getBuildsByResid(BUILDCITY_ID.ALL, FIXID.JIAOLOUBUILD);
		for ( var i=0; i<jiaolouBuilds.length; ++i ){
			jiaolouLevels += jiaolouBuilds[i].level;
		}
		
		return Math.floor(wallBuildLevel*200*(1 + jiaolouLevels/20));
	};
	
	_lc_._getHasCityDefs = function(){
		var defs = _lc_.m_g.getImgr().getCityDefs().defs;
		return defs[0] + defs[1] + defs[2] + defs[3] + defs[4];
	};
	
	_lc_._onUpdate = function(){
		_lc_._updateBuildingInfos();
	};
	
	_lc_._onClickSpeed = function(){
		var building = _lc_.m_g.getImgr().getCityDefs().building;
		var res = ItemResUtil.findItemres(building.id);
		UIM.openDlg('uselistitem', [RES_EFF.ACC_CITYDEF], {id:building.id, stoptime:building.stoptime, name:res.name, type:RES_TRG.SELF_ROLE} );
	};
	
	_lc_._onClickCancel = function(){
		_lc_._onCancelCallback = function(id){
			if ( id == MB_IDYES ) {
				CityDefSender.sendCancelBuilding(_lc_.m_g);
			}
		};
		
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, 
			rstr.cityDefDlg.tip.confirmCancel,
			MB_F_YESNO, 
			{self:_lc_.m_this, caller:_lc_._onCancelCallback} );
	};
	
	_lc_._onClickSelList = function(){
		_lc_.m_items.inum.setVal(1);
		_lc_._updateCurSelInfo();
	};
	
	_lc_._onNumberChange = function(num){
		_lc_._updateCurSelInfo();
	};
	
	_lc_._onClickDown = function(idx){
		_lc_._onInputDownNumberOk = function(num) {
			CityDefSender.sendDownCityDef(_lc_.m_g, idx, num);
		};
		
		// make tip msg
		var res = res_citydef[idx];
		var defNumber = _lc_.m_g.getImgr().getCityDefs().defs[idx];
		var msg = TQ.format(rstr.cityDefDlg.lbl.downInputNum, res.name, defNumber);
		
		var inputdlg = UIM.getDlg('inputnum');
		inputdlg.openDlg(msg, defNumber);
		inputdlg.setCaller({self:_lc_.m_this, caller:_lc_._onInputDownNumberOk});
	};
	
	_lc_._onClickBuild = function(){
		var building = _lc_.m_g.getImgr().getCityDefs().building;
		if ( building.id > 0 ) {
			_lc_.m_g.getGUI().sysMsgTips( SMT_WARNING, rstr.cityDefDlg.tip.hasBuilding);
			return;
		}
		
		var buildNum = _lc_.m_items.inum.getVal();
		if ( buildNum > _lc_._getLeftCapacity() ) {
			_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rstr.cityDefDlg.tip.noEnoughCapacity, MB_F_CLOSE, null);
			return;
		}
		
		var expendTip = _lc_._getCurSelInvalidExpendTip();
		if (expendTip != ''){
			_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rstr.cityDefDlg.tip.noEnoughRes + expendTip, MB_F_CLOSE, null);
			return;
		}
		
		CityDefSender.sendBuildCityDef(_lc_.m_g, _lc_._getCurSelBuild(), buildNum);
		
		_lc_.m_items.inum.setVal(1);
	};
	
	_lc_._getCurSelInvalidExpendTip = function(){
		var inputNum = _lc_.m_items.inum.getVal();
		var desc = '';
		var _combineInvalidExpendTip = function(tag, oneNeedNumber){
			var needResNumber = inputNum*oneNeedNumber;
			if ( needResNumber > _lc_._getMyHasNumber(tag) ) { // has no enough res
				var s = rstr.comm.resname[tag] + C_TIP_SPACE + needResNumber + C_TIP_NEWLINE;
				desc += TQ.formatColorStr(s, C_TIP_INVALIDCOLOR);
			}
		};
		_lc_._traversalExpends(_combineInvalidExpendTip);
		return desc;
	};
	
	_lc_._traversalExpends = function(callBackFun){
		var res = res_citydef[_lc_._getCurSelBuild()];
		var tags = _lc_._getResTags();
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
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_items = null;
	_lc_.m_this = null;
	_lc_.m_forceTabHdr = null;
	_lc_.m_isShow = false;
	var C_BTN_DELAY_MS = 300;
		
	this.init = function(g, items){
		_lc_._initParams(this, g, items);
		_lc_._setCallers();
	};
	
	this.open = function(){
		_lc_.m_isShow = true;
		this.update();
	};
	
	this.hide = function(){
		_lc_.m_isShow = false;
	};
	
	this.update = function(){
		if ( !_lc_.m_isShow ) return;
		
		_lc_._updateForcetabList();
	};
	
	_lc_._initParams = function(selfThis, g, items){
		_lc_.m_this = selfThis;
		_lc_.m_g = g;
		_lc_.m_items = items;
		_lc_.m_forceTabHdr = CityDefForceTabHdr.snew(g, items);
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.saveForcetab.setType(BTN_TYPE.DELAY);
		_lc_.m_items.saveForcetab.setDelay(C_BTN_DELAY_MS);
		
		_lc_.m_items.changeForcetab.setCaller({self:_lc_.m_this, caller:_lc_._onClickChangeForcetab});
		_lc_.m_items.assignSoldier.setCaller({self:_lc_.m_this, caller:_lc_._onClickAssignSoldier});
		_lc_.m_items.saveForcetab.setCaller({self:_lc_.m_this, caller:_lc_._onClickSaveForcetab});
	};
	
	_lc_._updateForcetabList = function(){
		var defArmy = _lc_.m_g.getImgr().getCityDefs().defarmy;
		_lc_.m_forceTabHdr.setLineup(defArmy.lineupId, defArmy.heros);
		_lc_.m_forceTabHdr.refresh();
	};
	
	_lc_._onClickChangeForcetab = function(){
		_lc_._assignHerosCallback = function(lineup, heroIds){
			_lc_.m_forceTabHdr.setLineup(lineup, heroIds);
			_lc_.m_forceTabHdr.refresh();
		};
		
		var dlg = UIM.getDlg('assignheros');
		dlg.setCaller({self:_lc_.m_this, caller:_lc_._assignHerosCallback});
		dlg.openDlg({canEmpty:true});
	};
	
	_lc_._onClickAssignSoldier = function(){
		UIM.openDlg('assignsoldiers');
	};
	
	_lc_._onClickSaveForcetab = function(){
		CityDefSender.sendSaveDefArmy(_lc_.m_g, _lc_.m_forceTabHdr.getLineup(), _lc_.m_forceTabHdr.getHeroIds());
	};
	//CityDefCityPanel-unittest-end
});

FillSoldiersHdr = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_list = null;
	_lc_.m_heros = null;
	_lc_.m_msgSender = null;
	this.init = function(g, list, msgSender){
		_lc_.m_g = g;
		_lc_.m_list = list;
		_lc_.m_msgSender = msgSender;
	};
	
	this.setHeros = function(heros){
		_lc_.m_heros = heros;
	};
	
	this.confirm = function(heroIdx){
		var changedSoldier = _lc_._getChangedSoldier(heroIdx);
		if ( !changedSoldier ) {
			return;
		}
		
		_lc_.m_msgSender.sendConfirmSoldiersAssign(_lc_.m_g, [changedSoldier]);
	};	
	
	this.confirmAll = function(){
		var changedSoldiers = [];
		for ( var i=0; i<_lc_.m_heros.length; ++i ) {
			var changedSoldier = _lc_._getChangedSoldier(i);
			if ( !changedSoldier ) continue;
			
			changedSoldiers.push(changedSoldier);
		}
		
		_lc_.m_msgSender.sendConfirmSoldiersAssign(_lc_.m_g, changedSoldiers);		
	};	
	
	this.fillAll = function(){
		var changedSoldiers = [];
		var filledSoldiers = MyDict.snew(0);
		for ( var i=0; i<_lc_.m_heros.length; ++i ) {
			var hero = _lc_.m_heros[i];
			if ( !hero.id ) continue;
			
			var curSoldier = _lc_._getCurSetSoldier(i);
			var newFillNumber = 0;
			if ( curSoldier.resid > 0 ){
				var hasNumber = _lc_._getSoldierNumber(curSoldier.resid);
				var leftNumber = hasNumber - filledSoldiers.get(curSoldier.resid);
				newFillNumber = Math.min(leftNumber, _lc_.m_g.getImgr().getHeroAttrVal(hero, ATTR.CO));
				filledSoldiers.set(curSoldier.resid, filledSoldiers.get(curSoldier.resid) + newFillNumber);
			}
			
			var fillSoldier = {resid:curSoldier.resid, number:newFillNumber};
			if ( _lc_._isChanged(hero.soldier, fillSoldier) ) {
				changedSoldiers.push({id:hero.id, resid:fillSoldier.resid, number:fillSoldier.number});
			}
		}
		
		_lc_.m_msgSender.sendConfirmSoldiersAssign(_lc_.m_g, changedSoldiers);
	};
	
	this.clearAllSoldiers = function(){
		var changedSoldiers = [];
		for ( var i=0; i<_lc_.m_heros.length; ++i ) {
			var hero = _lc_.m_heros[i];
			if ( !hero.id ) continue;
			if ( hero.soldier.number == 0 ) continue;
			
			changedSoldiers.push({id:hero.id, resid:hero.soldier.resid, number:0});
		}
		
		_lc_.m_msgSender.sendConfirmSoldiersAssign(_lc_.m_g, changedSoldiers);
	};
	
	_lc_._getChangedSoldier = function(heroIdx){
		var hero = _lc_.m_heros[heroIdx];
		if ( !hero.id ) {
			return null;
		}
		
		var curSoldier = _lc_._getCurSetSoldier(heroIdx);
		if ( !_lc_._isChanged(hero.soldier, curSoldier) ) {
			return null;
		}
		
		return {id:hero.id, resid:curSoldier.resid, number:curSoldier.number};
	};
	
	_lc_._isChanged = function(soldier1, soldier2){
		return (soldier1.resid != soldier2.resid) || (soldier1.number != soldier2.number);
	};
	
	_lc_._getCurSetSoldier = function(heroIdx){
		if ( _lc_.m_list == null ) {
			var hero = _lc_.m_heros[heroIdx];
			return {resid:hero.soldier.resid, number:hero.soldier.number};
		}
		
		var listItem = _lc_.m_list.getItem(heroIdx);
		var soldierTypeIdx = listItem.exsubs.soldiertype.getCurSel();
		
		var soldierResId= listItem.exsubs.userdata.soldiertypes[soldierTypeIdx];
		var soldierNumber = listItem.exsubs.soldiernumber.getVal();
		return {resid:soldierResId, number:soldierNumber};
	};
	
	_lc_._getSoldierNumber = function(resid){
		var number = _lc_.m_g.getImgr().getSoldierNumber(resid);
		for ( var i=0; i<_lc_.m_heros.length; ++i ) {
			var hero = _lc_.m_heros[i];
			if ( !hero.id ) continue;
			if ( hero.soldier.resid != resid) continue;
			
			number += hero.soldier.number;
		}
		return number;
	};
	
	//FillSoldiersHdr-unittest-end
});

CityDefTowerPanel = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.C_BTN_DELAY_MS = 300;
	_lc_.m_this = null;
	_lc_.m_g = null;
	_lc_.m_items = null;
	_lc_.m_isShow = false;
	_lc_.m_heros = null;
	_lc_.m_assignSoldierHdr = null;
	_lc_.m_fillSoliderHdr = null;
	
	this.init = function(g, items){
		_lc_._initParams(this, g, items);
		_lc_._initDelayBtns();
		_lc_._setCallers();
	};
	
	this.open = function(){
		_lc_.m_isShow = true;
		this.update();
	};
	
	this.hide = function(){
		_lc_.m_isShow = false;
	};
	
	this.update = function(){
		if ( !_lc_.m_isShow ) return;
		
		_lc_._updateForcetabList();
		_lc_._updateTowerAttrs();
		_lc_._updateFreeSoldierList();
	};
	
	_lc_._initParams = function(selfThis, g, items){
		_lc_.m_this = selfThis;
		_lc_.m_g = g;
		_lc_.m_items = items;
		_lc_.m_assignSoldierHdr = AssignSoldiersHdr.snew(_lc_.m_g, _lc_.m_items.forcetablist);
		_lc_.m_fillSoliderHdr = FillSoldiersHdr.snew(_lc_.m_g, _lc_.m_items.forcetablist, TowerSender);
	};
	
	_lc_._initDelayBtns = function(){
		_lc_.m_items.clearAll.setType(BTN_TYPE.DELAY);
		_lc_.m_items.clearAll.setDelay(_lc_.C_BTN_DELAY_MS);
		_lc_.m_items.fillAll.setType(BTN_TYPE.DELAY);
		_lc_.m_items.fillAll.setDelay(_lc_.C_BTN_DELAY_MS);
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.clearAll.setCaller({self:_lc_.m_this, caller:_lc_._onClickClearAll});
		_lc_.m_items.fillAll.setCaller({self:_lc_.m_this, caller:_lc_._onClickFillAll});
		_lc_.m_items.confirmAll.setCaller({self:_lc_.m_this, caller:_lc_._onClickConfirmAll});
	};
	
	_lc_._updateForcetabList = function(){
		_lc_._disableAllForcetabListGrids();
		_lc_._enableForcetabListGrids();
		_lc_._createTowerHeros();
		_lc_._setForcetabListItems();
		_lc_._setForcetabListCaller();
	};
	
	_lc_._disableAllForcetabListGrids = function(){
		for ( var gridIdx=0; gridIdx<_lc_.m_items.forcetablist.getCount(); ++gridIdx ) {
			_lc_._disableForcetabListGrid(gridIdx);
		}
	};
	
	_lc_._enableForcetabListGrids = function(){
		var tower = _lc_.m_g.getImgr().getTower();
		var lineupRes = ItemResUtil.findItemres(tower.lineupId);
		for ( var i=0; i<lineupRes.grids.length; ++i ) {
			var gridIdx = lineupRes.grids[i];
			_lc_._enableForcetabListGrid(gridIdx);
		}
	};
	
	_lc_._createTowerHeros = function(){
		_lc_.m_heros = [];
		for ( var i=0; i<_lc_.m_items.forcetablist.getCount(); ++i ){
			_lc_.m_heros.push({id:0, soldier:{resid:0, number:0}});
		}
		
		var heroRes = _lc_._getHeroRes();
		var tower = _lc_.m_g.getImgr().getTower();
		var lineupRes = ItemResUtil.findItemres(tower.lineupId);
		for ( var i=0; i<lineupRes.grids.length; ++i ) {
			var gridIdx = lineupRes.grids[i];
			var soldier = tower.soldiers[i];
			_lc_.m_heros[gridIdx].id = (i+1);
			_lc_.m_heros[gridIdx].soldier.resid = soldier.resid;
			_lc_.m_heros[gridIdx].soldier.number = soldier.number;
			_lc_.m_heros[gridIdx].attrs = {};
			_lc_.m_heros[gridIdx].attrs[ATTR.CO] = {val:heroRes ? heroRes.maxnum : 0};
		}
		
		_lc_.m_fillSoliderHdr.setHeros(_lc_.m_heros);
		_lc_.m_assignSoldierHdr.setHeros(_lc_.m_heros);
	};
	
	_lc_._setForcetabListItems = function(){
		for ( var i=0; i<_lc_.m_items.forcetablist.getCount(); ++i ) {
			_lc_.m_assignSoldierHdr.fillSoldierDropType(_lc_.m_items.forcetablist.getItem(i), _lc_.m_heros[i].soldier);
		}
	};
	
	_lc_._setForcetabListCaller = function(){
		_lc_.m_assignSoldierHdr.setCallers({self:_lc_.m_this, caller:_lc_._onClickConfirmBtn});
	};
	
	_lc_._disableForcetabListGrid = function(gridIdx){
		var item = _lc_.m_items.forcetablist.getItem(gridIdx);
		TQ.setCSS ( item.exsubs.container, 'display', 'none');
		IMG.setBKImage(item.exsubs.bak, IMG.makeImg('expedition/forcetab/disablebak.gif'));
	};
	
	_lc_._enableForcetabListGrid = function(gridIdx){
		var item = _lc_.m_items.forcetablist.getItem(gridIdx);
		TQ.setCSS ( item.exsubs.container, 'display', 'block');
		IMG.setBKImage(item.exsubs.bak, IMG.makeImg('expedition/forcetab/emptybak.gif'));
	};
	
	_lc_._updateTowerAttrs = function(){
		var heroRes = _lc_._getHeroRes();
		if (!heroRes) return;
		
		TQ.setTextEx(_lc_.m_items.strength, heroRes.str);
		TQ.setTextEx(_lc_.m_items.agile, heroRes.agile);
		TQ.setTextEx(_lc_.m_items.physical, heroRes.phy);
		TQ.setTextEx(_lc_.m_items.command, heroRes.maxnum);
	};
	
	_lc_._updateFreeSoldierList = function(){
		UpdateFreeSoldierList.setListItems(_lc_.m_g, _lc_.m_items.freeSoldierList);
	};
	
	_lc_._onClickConfirmBtn = function(heroIdx){
		_lc_.m_fillSoliderHdr.confirm(heroIdx);
	};
	
	_lc_._onClickClearAll = function(){
		_lc_.m_fillSoliderHdr.clearAllSoldiers();
	};
	
	_lc_._onClickConfirmAll = function(){
		_lc_.m_fillSoliderHdr.confirmAll();
	};
	
	_lc_._onClickFillAll = function(){
		_lc_.m_fillSoliderHdr.fillAll();
	};
	
	_lc_._getHeroRes = function(){
		var towerLevel = _lc_.m_g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.TOWERBUILD);
		if (!towerLevel) return null;
		
		var towerLevelRes = ItemResUtil.findBuildLevelres(FIXID.TOWERBUILD, towerLevel);
		return ItemResUtil.findItemres(towerLevelRes.fieldheroid);
	};
	//CityDefTowerPanel-unittest-end
});

