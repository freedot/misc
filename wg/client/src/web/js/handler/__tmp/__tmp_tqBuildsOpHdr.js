/*******************************************************************************/
BuildsOpHdr = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_buildBlocks = null;
	_lc_.m_opMenu = null;
	_lc_.m_buildOpidMaps = null;
	_lc_.m_canNotDowns=null; //不容许拆除的建筑
	_lc_.m_canNotDownsWhenOneLevel=null; //当建筑为1级时不容许拆除的建筑
	_lc_.m_menuCfgs = null;
	_lc_.m_opShows={};
	var m_menuBlink = null;
	
	this.init = function(g, buildBlocks){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_buildBlocks = buildBlocks;
		m_menuBlink = BlinkingPanel.snew(_lc_.m_g,{borderw:2});
		_lc_.m_canNotDowns={'110001':true,'110007':true};
		_lc_.m_canNotDownsWhenOneLevel={'110013':true,'110018':true};
		
		_lc_.m_buildOpidMaps={
			 '110001':['BUILDINGINFO']
			,'110002':[]
			,'110003':[]
			,'110004':['TRADINGAREA']
			,'110005':['RECRUITHERO']
			,'110006':['SOLDIER']
			,'110007':['CITYDEF']
			,'110008':['HEROTREAT']
			,'110009':['HEROSTEEL']
			,'110010':['CULTURE']
			,'110011':['BUYARM','RESOLVE','INTENSIFY','COMPOSE','BESET']
			,'110012':['JOINALLIANCE','REINFORCEMENT']
			,'110013':['CHANGESUBCITY']
			,'110014':[]
			,'110015':['RESPROTECT']
			,'110016':[]
			,'110017':['EXCHANGEHEROEXP']
			,'110018':['CHANGESUBCITY']
			,'110019':[]
			,'110020':[]
			,'110021':[]
			,'110022':['TOWERDEF']
			};
		
		_lc_.m_menuCfgs = [
			{text:rstr.inbuild.panel.btns.buildinfo, id:'BUILDINGINFO', icon:null, opCaller:_lc_._onBuildingInfo} 
			,{text:rstr.inbuild.panel.btns.soldier, id:'SOLDIER', icon:null, opCaller:_lc_._onSoldier} 
			,{text:rstr.inbuild.panel.btns.culture, id:'CULTURE', icon:null, opCaller:_lc_._onCulture} 
			,{text:rstr.inbuild.panel.btns.recruithero, id:'RECRUITHERO', icon:null, opCaller:_lc_._onRecruitHero} 
			,{text:rstr.inbuild.panel.btns.resprotect, id:'RESPROTECT', icon:null, opCaller:_lc_._onResProtect}
			,{text:rstr.inbuild.panel.btns.herosteel, id:'HEROSTEEL', icon:null, opCaller:_lc_._onHeroSteel}
			,{text:rstr.inbuild.panel.btns.buyarm, id:'BUYARM', icon:null, opCaller:_lc_._onOpenArmOpDlg, params:{tabIdx:0}} 
			,{text:rstr.inbuild.panel.btns.resolve, id:'RESOLVE', icon:null, opCaller:_lc_._onOpenArmOpDlg, params:{tabIdx:1}} 
			,{text:rstr.inbuild.panel.btns.intensify, id:'INTENSIFY', icon:null, opCaller:_lc_._onOpenArmOpDlg, params:{tabIdx:2}} 
			,{text:rstr.inbuild.panel.btns.compose, id:'COMPOSE', icon:null, opCaller:_lc_._onOpenArmOpDlg, params:{tabIdx:3}} 
			,{text:rstr.inbuild.panel.btns.beset, id:'BESET', icon:null, opCaller:_lc_._onOpenArmOpDlg, params:{tabIdx:4}}
			,{text:rstr.inbuild.panel.btns.treat, id:'HEROTREAT', icon:null, opCaller:_lc_._onHeroTreat} 
			,{text:rstr.inbuild.panel.btns.citydef, id:'CITYDEF', icon:null, opCaller:_lc_._onCityDef, params:{tabIdx:0}} 
			,{text:rstr.inbuild.panel.btns.citydef, id:'TOWERDEF', icon:null, opCaller:_lc_._onCityDef, params:{tabIdx:2}} 
			,{text:rstr.inbuild.panel.btns.exchangeHeroExp, id:'EXCHANGEHEROEXP', icon:null, opCaller:_lc_._onExchangeHeroExp} 
			,{text:rstr.inbuild.panel.btns.changeSubCity, id:'CHANGESUBCITY', icon:null, opCaller:_lc_._onChangeSubCity} 
			,{text:rstr.inbuild.panel.btns.joinAlliance, id:'JOINALLIANCE', icon:null, opCaller:_lc_._onJoinAlliance} 
			,{text:rstr.inbuild.panel.btns.seeReinforcement, id:'REINFORCEMENT', icon:null, opCaller:_lc_._onSeeReinforcement} 
			,{text:rstr.inbuild.panel.btns.tradingArea, id:'TRADINGAREA', icon:null, opCaller:_lc_._onTradingArea} 
			,{text:rstr.inbuild.panel.btns.up, id:'UPGRADE', icon:null, opCaller:_lc_._onUpgradeBuild}
			,{text:rstr.inbuild.panel.btns.del, id:'DOWN', icon:null, opCaller:_lc_._onDownBuild}
			,{text:rstr.inbuild.panel.btns.sp, id:'SPEED', icon:null, opCaller:_lc_._onSpeedBuilding}
			,{text:rstr.inbuild.panel.btns.cs, id:'CANCEL', icon:null, opCaller:_lc_._onCancelBuilding}
			];
	};
	
	this.createOpMenu = function(){
		_lc_.m_opMenu = _lc_._allocMenu();
		_lc_.m_opMenu.setDisableCanClick(true);
		_lc_.m_opMenu.setCaller({self:_lc_.m_this,caller:_lc_._onOpCommand});
		
		for ( var i=0; i<_lc_.m_menuCfgs.length; ++i ){
			var menuCfg = _lc_.m_menuCfgs[i];
			var it = _lc_.m_opMenu.addMenuItem({id:i, icon:menuCfg.icon, text:menuCfg.text});
			if ( menuCfg.id == 'UPGRADE' || menuCfg.id == 'DOWN' ){
				var tipid = TTIP.addTip(it.item, '.');
				TTIP.setCallerData(tipid, {self:_lc_.m_this, caller:_lc_._onGetTooltip}, {id:menuCfg.id});
			}
		}
	};
	
	this.isShow = function(){
		if (!_lc_.m_opMenu) return false;
		return _lc_.m_opMenu.isShow();
	};
	
	this.show = function(pos){
		if (!_lc_.m_opMenu) return false;
		_lc_.m_opMenu.show(pos);
		_blinkMenuItem();
	};
	
	this.resetOpMenuItemsShow = function(){
		_lc_.m_opShows = {};
		var item = _lc_.m_buildBlocks.getCurBlock().getItem();
		if ( !item ){
			return;
		}
		
		_lc_._setMenuCommItemsShowFlag(item);
		_lc_._setMenuSpecItemsShowFlag(item);
		_lc_._setMenuWSYItemsShowFlag(item);
		_lc_._resetOpMenuItemsShowByFlag();
	};	
	
	this.updateOpMenuItem = function(){
		if (!_lc_.m_opMenu.isShow()) {
			return;
		}
		
		if (!_lc_.m_opShows['UPGRADE']) {
			return;
		}
		
		var item = _lc_.m_buildBlocks.getCurBlock().getItem();
		if (!item) {
			return;
		}
		
		var canUpgrade = TIPM.isCanBuildUpgrade(item.cityId, item);
		_lc_.m_opMenu.enableItem(_lc_._getMenuId('UPGRADE'), canUpgrade);
	};
	
	this.opSpeed = function(item){
		UIM.openDlg('uselistitem', [RES_EFF.ACCELERATE], {id:item.id, cid:item.cityId, stoptime:item.stoptime, resid:item.resid, type:RES_TRG.BUILDING_IBUILD});
	};
	
	this.opCancel = function(item){
		CityBuildSender.sendCancelBuild(_lc_.m_g, item.cityId, item.id);
	};	
	
	var _blinkMenuItem = function(){
		var blockItem = _lc_.m_buildBlocks.getCurBlock().getItem();
		if ( !blockItem 
			|| HelpGuider.buildOpMenu.itemId == ''
			|| HelpGuider.buildOpMenu.buildId != blockItem.resid 
			|| (HelpGuider.buildOpMenu.buildState >= 0 && HelpGuider.buildOpMenu.buildState != blockItem.state) ){
			m_menuBlink.unbind();
			return;
		}
		
		var idx = _getShowIdxByItemNameId(HelpGuider.buildOpMenu.itemId);
		var item = _lc_.m_opMenu.getItem(_lc_._getMenuId(HelpGuider.buildOpMenu.itemId)).vitem.item;
		m_menuBlink.bind(
			item,
			item,
			BLINKING_TYPE.INSERT,
			0, idx*TQ.getDomHeight(item), TQ.getDomWidth(item), TQ.getDomHeight(item));
		m_menuBlink.start(-1);
	};
	
	var _getShowIdxByItemNameId = function(findNameId){
		var idx = 0;
		for ( var menuId=0; menuId<_lc_.m_opMenu.getCount(); ++menuId ){
			var nameId = _lc_.m_menuCfgs[menuId].id;
			if ( findNameId == nameId ) break;
			if ( _lc_.m_opShows[nameId] ) idx++;
		}
		return idx;
	};
	
	_lc_._getMenuId = function(nameId){
		TQ.find(_lc_.m_menuCfgs, 'id', nameId);
		return TQ.getLastFindIdx();
	};
	
	_lc_._setMenuCommItemsShowFlag = function(item){
		if ( item.state == BUILD_STATE.COMM ) {
			_lc_.m_opShows['UPGRADE'] = true;
			_lc_.m_opShows['DOWN'] = true;
		}
		else if ( item.state == BUILD_STATE.UPGRADE || item.state == BUILD_STATE.DOWN ) {
			_lc_.m_opShows['SPEED'] = true;
			_lc_.m_opShows['CANCEL'] = true;
		}
	};
	
	_lc_._setMenuSpecItemsShowFlag = function(item){
		if (!item.level) {
			return;
		}
		
		var hasSpecCmd = _lc_.m_buildOpidMaps[item.itemres.id].length > 0;
		if (!hasSpecCmd) {
			return;
		}
		
		_lc_.m_opShows['SEP'] = true;
		var ids = _lc_.m_buildOpidMaps[item.itemres.id];
		for ( var i=0; i<ids.length; ++i ){
			_lc_.m_opShows[ids[i]] = true;
		}
	};
	
	_lc_._setMenuWSYItemsShowFlag = function(item){
		if (!item.level) return;
		if (item.itemres.id != FIXID.ALLIINBUILD ) return;
		if (_lc_.m_g.getImgr().isInAlliance()) {
			_lc_.m_opShows['JOINALLIANCE'] = false;
			_lc_.m_opShows['REINFORCEMENT'] = true;
		} else {
			_lc_.m_opShows['JOINALLIANCE'] = true;
			_lc_.m_opShows['REINFORCEMENT'] = false;			
		}
	};
	
	_lc_._resetOpMenuItemsShowByFlag = function(){
		for ( var menuId=0; menuId<_lc_.m_opMenu.getCount(); ++menuId ){
			var nameId = _lc_.m_menuCfgs[menuId].id;
			_lc_.m_opMenu.showItem(menuId, _lc_.m_opShows[nameId] ? true:false);
		}
	};	
	
	_lc_._allocMenu = function(){
		return new Menu(_lc_.m_g,{width:112, className:'build_menu_panel'});
	};
	
	_lc_._onOpCommand = function(idx){
		_lc_.m_g.getGUI().hideAllMenu();
		
		var cfg = _lc_.m_menuCfgs[idx];
		if (!cfg || !cfg.opCaller) {
			return;
		}
		
		cfg.opCaller(idx, cfg.params);
	};
	
	_lc_._onGetTooltip = function(data){
		var tip = _lc_._getCanNotDownTip(data.id);
		if (tip != '') {
			return tip;
		}
		
		var item = _lc_.m_buildBlocks.getCurBlock().getItem();
		if (!item) {
			return '';
		}
		
		return TIPM.getBuildDesc(item.cityId, _lc_._getTipTagByNameId(data.id), item);
	};
	
	_lc_._getTipTagByNameId = function(nameId){
		return (nameId == 'UPGRADE') ? 'up' : 'down';
	};
	
	_lc_._getCanNotDownTip = function(nameId){
		if ( nameId != 'DOWN' ) {
			return '';
		}
		
		var item = _lc_.m_buildBlocks.getCurBlock().getItem();
		if ( !item ) {
			return '';
		}
		
		if ( _lc_.m_canNotDowns[item.resid] ) {
			return TQ.formatLine(TQ.format(rstr.inbuild.panel.tips.undown, item.itemres.name));
		}
		
		if ( (item.level == 1) && _lc_.m_canNotDownsWhenOneLevel[item.resid] ) {
			return TQ.formatLine(TQ.format(rstr.inbuild.panel.tips.undownWhenOneLevel, item.itemres.name));
		}
		
		return '';
	};
	
	/*--------------------------------------------------------------------------------*/
	_lc_._onBuildingInfo = function(){
		UIM.openDlg('buildinginfo');
	};
	
	_lc_._onSoldier = function(){
		UIM.openDlg('soldier');
	};	
	
	_lc_._onCulture = function(){
		UIM.openDlg('culture');
	};	
	
	_lc_._onRecruitHero = function(){
		UIM.openDlg('recruithero');
	};
	
	_lc_._onResProtect = function(){
		UIM.openDlg('resprotect');
	};
	
	_lc_._onHeroSteel = function(){
		UIM.openDlg('steellist');
	};
	
	_lc_._onOpenArmOpDlg = function(id, params){
		UIM.openDlg('armop', params.tabIdx);
	};
	
	_lc_._onHeroTreat = function(){
		UIM.openDlg('hospital');
	};
	
	_lc_._onCityDef = function(id, params){
		UIM.openDlg('citydef', params.tabIdx);
	};
	
	_lc_._onExchangeHeroExp = function(){
		UIM.openDlg('jitan');
	};
	
	_lc_._onChangeSubCity = function(){
		var subCityId = UIM.getPanel('main').getSubCityBtnsBar().getCurSubCityId();
		var builds = _lc_.m_g.getImgr().getBuildsByCityId(subCityId);
		if (builds.length > 1){
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100068].msg);
			return;
		}
		
		if (builds[0].level > 1){
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100069].msg);
			return;
		}
		
		UIM.openDlg('createsubcity', subCityId, 'change');
	};
	
	_lc_._onJoinAlliance = function(){
		UIM.getDlg('allicreate').openDlg();
		UIM.getPanel('main').getToolbar().stopAllianceBlinking();
	};
	
	_lc_._onSeeReinforcement = function(){
		UIM.getDlg('reinforcement').openDlg();
	};
	
	_lc_._onTradingArea = function(){
		UIM.getDlg('tradingarea').openDlg();
	};
	
	_lc_._onUpgradeBuild = function(){
		var build = _lc_.m_buildBlocks.getCurBlock().getItem();
		var rt = TIPM.getSimpleBuildUpTip(build.cityId, build);
		if ( rt != '' ){
			_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rt, MB_F_CLOSE, null);
		}
		else{
			CityBuildSender.sendUpgradeBuild(_lc_.m_g, build.cityId, build.id);
		}
	};
	
	_lc_._onDownBuild = function(){
		var build = _lc_.m_buildBlocks.getCurBlock().getItem();
		if ( _lc_.m_canNotDowns[ build.resid ] ) {
			var msg = TQ.format(rstr.inbuild.panel.tips.undown, build.itemres.name);
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, msg);
			return;
		}
		
		if ( (build.level == 1) && _lc_.m_canNotDownsWhenOneLevel[ build.resid ] ) {
			var msg = TQ.format(rstr.inbuild.panel.tips.undownWhenOneLevel, build.itemres.name);
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, msg);
			return;
		}
		
		_lc_._onDownCallback = function(id) {
			if ( id == MB_IDYES ) {
				CityBuildSender.sendDownBuild(_lc_.m_g, build.cityId, build.id);
			}
		};
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rstr.inbuild.panel.tips.confirmDown,  MB_F_YESNO, {self:_lc_.m_this, caller:_lc_._onDownCallback} );
	};
	
	_lc_._onSpeedBuilding = function(){
		_lc_.m_this.opSpeed(_lc_.m_buildBlocks.getCurBlock().getItem());
	};
	
	_lc_._onCancelBuilding = function(){
		_lc_._onCancelCallback = function(id) {
			if ( id == MB_IDYES ) _lc_.m_this.opCancel(_lc_.m_buildBlocks.getCurBlock().getItem());
		};
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rstr.inbuild.panel.tips.confirmCancelUp,  MB_F_YESNO, {self:_lc_.m_this, caller:_lc_._onCancelCallback} );
	};
	
	//BuildsOpHdr-unittest-end
});
