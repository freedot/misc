/*******************************************************************************/
BuildsOpHdr = Class.extern(function(){
	//BuildsOpHdr-unittest-start
	var m_g = null;
	var m_this = null;
	var m_buildBlocks = null;
	var m_opMenu = null;
	var m_buildOpidMaps = null;
	var m_canNotDowns=null; //不容许拆除的建筑
	var m_canNotDownsWhenOneLevel=null; //当建筑为1级时不容许拆除的建筑
	var m_menuCfgs = null;
	var m_opShows={};
	var m_menuBlink = null;
	
	this.init = function(g, buildBlocks){
		m_g = g;
		m_this = this;
		m_buildBlocks = buildBlocks;
		m_menuBlink = BlinkingPanel.snew(m_g,{borderw:2});
		m_canNotDowns={'110001':true,'110007':true};
		m_canNotDownsWhenOneLevel={'110013':true,'110018':true};
		
		m_buildOpidMaps={
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
		
		m_menuCfgs = [
			{text:rstr.inbuild.panel.btns.buildinfo, id:'BUILDINGINFO', icon:null, opCaller:_onBuildingInfo} 
			,{text:rstr.inbuild.panel.btns.soldier, id:'SOLDIER', icon:null, opCaller:_onSoldier} 
			,{text:rstr.inbuild.panel.btns.culture, id:'CULTURE', icon:null, opCaller:_onCulture} 
			,{text:rstr.inbuild.panel.btns.recruithero, id:'RECRUITHERO', icon:null, opCaller:_onRecruitHero} 
			,{text:rstr.inbuild.panel.btns.resprotect, id:'RESPROTECT', icon:null, opCaller:_onResProtect}
			,{text:rstr.inbuild.panel.btns.herosteel, id:'HEROSTEEL', icon:null, opCaller:_onHeroSteel}
			,{text:rstr.inbuild.panel.btns.buyarm, id:'BUYARM', icon:null, opCaller:_onOpenArmOpDlg, params:{tabIdx:0}} 
			,{text:rstr.inbuild.panel.btns.resolve, id:'RESOLVE', icon:null, opCaller:_onOpenArmOpDlg, params:{tabIdx:1}} 
			,{text:rstr.inbuild.panel.btns.intensify, id:'INTENSIFY', icon:null, opCaller:_onOpenArmOpDlg, params:{tabIdx:2}} 
			,{text:rstr.inbuild.panel.btns.compose, id:'COMPOSE', icon:null, opCaller:_onOpenArmOpDlg, params:{tabIdx:3}} 
			,{text:rstr.inbuild.panel.btns.beset, id:'BESET', icon:null, opCaller:_onOpenArmOpDlg, params:{tabIdx:4}}
			,{text:rstr.inbuild.panel.btns.treat, id:'HEROTREAT', icon:null, opCaller:_onHeroTreat} 
			,{text:rstr.inbuild.panel.btns.citydef, id:'CITYDEF', icon:null, opCaller:_onCityDef, params:{tabIdx:0}} 
			,{text:rstr.inbuild.panel.btns.citydef, id:'TOWERDEF', icon:null, opCaller:_onCityDef, params:{tabIdx:2}} 
			,{text:rstr.inbuild.panel.btns.exchangeHeroExp, id:'EXCHANGEHEROEXP', icon:null, opCaller:_onExchangeHeroExp} 
			,{text:rstr.inbuild.panel.btns.changeSubCity, id:'CHANGESUBCITY', icon:null, opCaller:_onChangeSubCity} 
			,{text:rstr.inbuild.panel.btns.joinAlliance, id:'JOINALLIANCE', icon:null, opCaller:_onJoinAlliance} 
			,{text:rstr.inbuild.panel.btns.seeReinforcement, id:'REINFORCEMENT', icon:null, opCaller:_onSeeReinforcement} 
			,{text:rstr.inbuild.panel.btns.tradingArea, id:'TRADINGAREA', icon:null, opCaller:_onTradingArea} 
			,{text:rstr.inbuild.panel.btns.up, id:'UPGRADE', icon:null, opCaller:_onUpgradeBuild}
			,{text:rstr.inbuild.panel.btns.del, id:'DOWN', icon:null, opCaller:_onDownBuild}
			,{text:rstr.inbuild.panel.btns.sp, id:'SPEED', icon:null, opCaller:_onSpeedBuilding}
			,{text:rstr.inbuild.panel.btns.cs, id:'CANCEL', icon:null, opCaller:_onCancelBuilding}
			];
	};
	
	this.createOpMenu = function(){
		m_opMenu = _allocMenu();
		m_opMenu.setDisableCanClick(true);
		m_opMenu.setCaller({self:m_this,caller:_onOpCommand});
		
		for ( var i=0; i<m_menuCfgs.length; ++i ){
			var menuCfg = m_menuCfgs[i];
			var it = m_opMenu.addMenuItem({id:i, icon:menuCfg.icon, text:menuCfg.text});
			if ( menuCfg.id == 'UPGRADE' || menuCfg.id == 'DOWN' ){
				var tipid = TTIP.addTip(it.item, '.');
				TTIP.setCallerData(tipid, {self:m_this, caller:_onGetTooltip}, {id:menuCfg.id});
			}
		}
	};
	
	this.isShow = function(){
		if (!m_opMenu) return false;
		return m_opMenu.isShow();
	};
	
	this.show = function(pos){
		if (!m_opMenu) return false;
		m_opMenu.show(pos);
		_blinkMenuItem();
	};
	
	this.resetOpMenuItemsShow = function(){
		m_opShows = {};
		var item = m_buildBlocks.getCurBlock().getItem();
		if ( !item ){
			return;
		}
		
		_setMenuCommItemsShowFlag(item);
		_setMenuSpecItemsShowFlag(item);
		_setMenuWSYItemsShowFlag(item);
		_resetOpMenuItemsShowByFlag();
	};	
	
	this.updateOpMenuItem = function(){
		if (!m_opMenu.isShow()) {
			return;
		}
		
		if (!m_opShows['UPGRADE']) {
			return;
		}
		
		var item = m_buildBlocks.getCurBlock().getItem();
		if (!item) {
			return;
		}
		
		var canUpgrade = TIPM.isCanBuildUpgrade(item.cityId, item);
		m_opMenu.enableItem(_getMenuId('UPGRADE'), canUpgrade);
	};
	
	this.opSpeed = function(item){
		UIM.openDlg('uselistitem', [RES_EFF.ACCELERATE], {id:item.id, cid:item.cityId, stoptime:item.stoptime, resid:item.resid, type:RES_TRG.BUILDING_IBUILD});
	};
	
	this.opCancel = function(item){
		CityBuildSender.sendCancelBuild(m_g, item.cityId, item.id);
	};	
	
	var _blinkMenuItem = function(){
		var blockItem = m_buildBlocks.getCurBlock().getItem();
		if ( !blockItem 
			|| HelpGuider.buildOpMenu.itemId == ''
			|| HelpGuider.buildOpMenu.buildId != blockItem.resid 
			|| (HelpGuider.buildOpMenu.buildState >= 0 && HelpGuider.buildOpMenu.buildState != blockItem.state) ){
			m_menuBlink.unbind();
			return;
		}
		
		var idx = _getShowIdxByItemNameId(HelpGuider.buildOpMenu.itemId);
		var item = m_opMenu.getItem(_getMenuId(HelpGuider.buildOpMenu.itemId)).vitem.item;
		m_menuBlink.bind(
			item,
			item,
			BLINKING_TYPE.INSERT,
			0, idx*TQ.getDomHeight(item), TQ.getDomWidth(item), TQ.getDomHeight(item));
		m_menuBlink.start(-1);
	};
	
	var _getShowIdxByItemNameId = function(findNameId){
		var idx = 0;
		for ( var menuId=0; menuId<m_opMenu.getCount(); ++menuId ){
			var nameId = m_menuCfgs[menuId].id;
			if ( findNameId == nameId ) break;
			if ( m_opShows[nameId] ) idx++;
		}
		return idx;
	};
	
	var _getMenuId = function(nameId){
		TQ.find(m_menuCfgs, 'id', nameId);
		return TQ.getLastFindIdx();
	};
	
	var _setMenuCommItemsShowFlag = function(item){
		if ( item.state == BUILD_STATE.COMM ) {
			m_opShows['UPGRADE'] = true;
			m_opShows['DOWN'] = true;
		}
		else if ( item.state == BUILD_STATE.UPGRADE || item.state == BUILD_STATE.DOWN ) {
			m_opShows['SPEED'] = true;
			m_opShows['CANCEL'] = true;
		}
	};
	
	var _setMenuSpecItemsShowFlag = function(item){
		if (!item.level) {
			return;
		}
		
		var hasSpecCmd = m_buildOpidMaps[item.itemres.id].length > 0;
		if (!hasSpecCmd) {
			return;
		}
		
		m_opShows['SEP'] = true;
		var ids = m_buildOpidMaps[item.itemres.id];
		for ( var i=0; i<ids.length; ++i ){
			m_opShows[ids[i]] = true;
		}
	};
	
	var _setMenuWSYItemsShowFlag = function(item){
		if (!item.level) return;
		if (item.itemres.id != FIXID.ALLIINBUILD ) return;
		if (m_g.getImgr().isInAlliance()) {
			m_opShows['JOINALLIANCE'] = false;
			m_opShows['REINFORCEMENT'] = true;
		} else {
			m_opShows['JOINALLIANCE'] = true;
			m_opShows['REINFORCEMENT'] = false;			
		}
	};
	
	var _resetOpMenuItemsShowByFlag = function(){
		for ( var menuId=0; menuId<m_opMenu.getCount(); ++menuId ){
			var nameId = m_menuCfgs[menuId].id;
			m_opMenu.showItem(menuId, m_opShows[nameId] ? true:false);
		}
	};	
	
	var _allocMenu = function(){
		return new Menu(m_g,{width:112, className:'build_menu_panel'});
	};
	
	var _onOpCommand = function(idx){
		m_g.getGUI().hideAllMenu();
		
		var cfg = m_menuCfgs[idx];
		if (!cfg || !cfg.opCaller) {
			return;
		}
		
		cfg.opCaller(idx, cfg.params);
	};
	
	var _onGetTooltip = function(data){
		var tip = _getCanNotDownTip(data.id);
		if (tip != '') {
			return tip;
		}
		
		var item = m_buildBlocks.getCurBlock().getItem();
		if (!item) {
			return '';
		}
		
		return TIPM.getBuildDesc(item.cityId, _getTipTagByNameId(data.id), item);
	};
	
	var _getTipTagByNameId = function(nameId){
		return (nameId == 'UPGRADE') ? 'up' : 'down';
	};
	
	var _getCanNotDownTip = function(nameId){
		if ( nameId != 'DOWN' ) {
			return '';
		}
		
		var item = m_buildBlocks.getCurBlock().getItem();
		if ( !item ) {
			return '';
		}
		
		if ( m_canNotDowns[item.resid] ) {
			return TQ.formatLine(TQ.format(rstr.inbuild.panel.tips.undown, item.itemres.name));
		}
		
		if ( (item.level == 1) && m_canNotDownsWhenOneLevel[item.resid] ) {
			return TQ.formatLine(TQ.format(rstr.inbuild.panel.tips.undownWhenOneLevel, item.itemres.name));
		}
		
		return '';
	};
	
	/*--------------------------------------------------------------------------------*/
	var _onBuildingInfo = function(){
		UIM.openDlg('buildinginfo');
	};
	
	var _onSoldier = function(){
		UIM.openDlg('soldier');
	};	
	
	var _onCulture = function(){
		UIM.openDlg('culture');
	};	
	
	var _onRecruitHero = function(){
		UIM.openDlg('recruithero');
	};
	
	var _onResProtect = function(){
		UIM.openDlg('resprotect');
	};
	
	var _onHeroSteel = function(){
		UIM.openDlg('steellist');
	};
	
	var _onOpenArmOpDlg = function(id, params){
		UIM.openDlg('armop', params.tabIdx);
	};
	
	var _onHeroTreat = function(){
		UIM.openDlg('hospital');
	};
	
	var _onCityDef = function(id, params){
		UIM.openDlg('citydef', params.tabIdx);
	};
	
	var _onExchangeHeroExp = function(){
		UIM.openDlg('jitan');
	};
	
	var _onChangeSubCity = function(){
		var subCityId = UIM.getPanel('main').getSubCityBtnsBar().getCurSubCityId();
		var builds = m_g.getImgr().getBuildsByCityId(subCityId);
		if (builds.length > 1){
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100068].msg);
			return;
		}
		
		if (builds[0].level > 1){
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100069].msg);
			return;
		}
		
		UIM.openDlg('createsubcity', subCityId, 'change');
	};
	
	var _onJoinAlliance = function(){
		UIM.getDlg('allicreate').openDlg();
		UIM.getPanel('main').getToolbar().stopAllianceBlinking();
	};
	
	var _onSeeReinforcement = function(){
		UIM.getDlg('reinforcement').openDlg();
	};
	
	var _onTradingArea = function(){
		UIM.getDlg('tradingarea').openDlg();
	};
	
	var _onUpgradeBuild = function(){
		var build = m_buildBlocks.getCurBlock().getItem();
		var rt = TIPM.getSimpleBuildUpTip(build.cityId, build);
		if ( rt != '' ){
			m_g.getGUI().msgBox(rstr.comm.msgts, rt, MB_F_CLOSE, null);
		}
		else{
			CityBuildSender.sendUpgradeBuild(m_g, build.cityId, build.id);
		}
	};
	
	var _onDownBuild = function(){
		var build = m_buildBlocks.getCurBlock().getItem();
		if ( m_canNotDowns[ build.resid ] ) {
			var msg = TQ.format(rstr.inbuild.panel.tips.undown, build.itemres.name);
			m_g.getGUI().sysMsgTips(SMT_WARNING, msg);
			return;
		}
		
		if ( (build.level == 1) && m_canNotDownsWhenOneLevel[ build.resid ] ) {
			var msg = TQ.format(rstr.inbuild.panel.tips.undownWhenOneLevel, build.itemres.name);
			m_g.getGUI().sysMsgTips(SMT_WARNING, msg);
			return;
		}
		
		var _onDownCallback = function(id) {
			if ( id == MB_IDYES ) {
				CityBuildSender.sendDownBuild(m_g, build.cityId, build.id);
			}
		};
		m_g.getGUI().msgBox(rstr.comm.msgts, rstr.inbuild.panel.tips.confirmDown,  MB_F_YESNO, {self:m_this, caller:_onDownCallback} );
	};
	
	var _onSpeedBuilding = function(){
		m_this.opSpeed(m_buildBlocks.getCurBlock().getItem());
	};
	
	var _onCancelBuilding = function(){
		var _onCancelCallback = function(id) {
			if ( id == MB_IDYES ) m_this.opCancel(m_buildBlocks.getCurBlock().getItem());
		};
		m_g.getGUI().msgBox(rstr.comm.msgts, rstr.inbuild.panel.tips.confirmCancelUp,  MB_F_YESNO, {self:m_this, caller:_onCancelCallback} );
	};
	
	//BuildsOpHdr-unittest-end
});
