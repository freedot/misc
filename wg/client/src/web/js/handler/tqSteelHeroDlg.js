/*******************************************************************************/
BaseHeroSteelOpHdr = JClass.ex({
	_init : function(g, heros, dlg, items){
		this.g = g;
		this.heros = heros;
		this.dlg = dlg;
		this.items = items;
		this.efficiencys = [];
		this._initOneTime();
	}
	
	,_initOneTime : function(){}
	,_getNeedExpend : function(){}
	,_getCanGetExpPerQuarter : function(){}
	
	,_getNeedExpends : function(inputSteelQuarters){
		var totalExpends = 0;
		for ( var i=0; i<this.heros.length; ++i ) {
			totalExpends += this._getNeedExpend(i, inputSteelQuarters);
		}
		return totalExpends;
	}
	
	,_getMaxLevelNeedExp : function(hero){
		var needExps = 0;
		var maxLevel = this.g.getImgr().getMaxHeroLevel(hero);
		var curHasExp = this.g.getImgr().getHeroAttr(hero, ATTR.XP).val;
		for ( var level=hero.level; level<maxLevel; level++ ){
			var nextLevel = level+1;
			needExps += (res_herolevelexps[nextLevel-1].needexp - curHasExp);
			curHasExp = 0;
		}
		
		return needExps;
	}
	
	,_getHerosSteelQuarters : function(inputSteelQuarters){
		var steelQuartersArray = [];
		for ( var i=0; i<this.heros.length; ++i ) {
			steelQuartersArray.push(this._getHeroSteelQuarters(i, inputSteelQuarters));
		}
		return steelQuartersArray;
	}
	
	,_getHeroSteelQuarters : function(idx, inputSteelQuarters){
		var hero = this.heros[idx];
		var maxLevelNeedExp = this._getMaxLevelNeedExp(hero);
		var maxLevelNeedQuarters = Math.ceil(maxLevelNeedExp/this._getCanGetExpPerQuarter(idx));
		return Math.min(inputSteelQuarters, maxLevelNeedQuarters);
	}
});

CommHeroSteelOpHdr = BaseHeroSteelOpHdr.ex({
	getTitle : function(){
		return rstr.steelherodlg.title;
	}
	
	,getNeedExpendLbl : function(){
		return rstr.steelherodlg.lbl.needMoneyLbl;
	}
	
	,getCanGetExp : function(idx, hero, inputSteelQuarters){
		var steelRes = res_herosteel[hero.level-1];
		return steelRes.commGetExp*this._getHeroSteelQuarters(idx, inputSteelQuarters);
	}
	
	,getNeedExpendStr : function(idx, hero, inputSteelQuarters){
		return this._getNeedExpend(idx, inputSteelQuarters);
	}
	
	,_getNeedExpend : function(idx, inputSteelQuarters){
		var hero = this.heros[idx];
		var steelRes = res_herosteel[hero.level-1];
		return steelRes.expendMoney*this._getHeroSteelQuarters(idx, inputSteelQuarters);
	}	

	,setOpDom : function(idx, hero, uiItem){
		TQ.setCSS(uiItem.exsubs.opDom, 'display', 'none' );
	}
	
	,getMaxSteelHours : function(){
		return res_comm_herosteel_max_hours;
	}
	
	,getExpendDesc : function(inputSteelQuarters){
		return TQ.format(rstr.steelherodlg.lbl.needMoney, this._getNeedExpends(inputSteelQuarters));
	}
	
	,isEnoughExpend : function(inputSteelQuarters){
		return this._getNeedExpends(inputSteelQuarters) <= this.g.getImgr().getMoney();
	}
	
	,getNotEnoughExpendMsg : function(inputSteelQuarters){
		return TQ.format(rstr.comm.noEnoughBuyMoney
			,this._getNeedExpends(inputSteelQuarters)
			,this.g.getImgr().getMoney()
			,FIXID.MONEYPKGID);
	}
	
	,sendSteelMsg : function(inputSteelQuarters){
		var steelQuartersArray = this._getHerosSteelQuarters(inputSteelQuarters);
		HeroSender.sendHerosSteel(this.g, 'steel', this.heros, steelQuartersArray, null);
	}
	
	,_getCanGetExpPerQuarter : function(idx){
		var hero = this.heros[idx];
		var steelRes = res_herosteel[hero.level-1];
		return steelRes.commGetExp;
	}
	
	,getSpeedEffectSteelHeroCount : function(){
		return 0;
	}
});

HighHeroSteelOpHdr = BaseHeroSteelOpHdr.ex({
	_initOneTime : function(){
		this.efficiencys = [];
		for ( var i=0; i<this.heros.length; ++i ) {
			if (this.heros[i].level <= res_hero_lowsteel_level) {
				this.efficiencys.push({can:true, cur:true});
			}
			else {
				this.efficiencys.push({can:false, cur:false});
			}
		}
	}
	
	,getTitle : function(){
		return rstr.steelherodlg.highTitle;
	}
	
	,getNeedExpendLbl : function(){
		return rstr.steelherodlg.lbl.needGoldLbl;
	}
	
	,getCanGetExp : function(idx, hero, inputSteelQuarters){
		return this._getCanGetExp(idx, hero, inputSteelQuarters, 'highGetExp');
	}
	
	,getNeedExpendStr : function(idx, hero, inputSteelQuarters){
		var factSteelQuarters = this._getHeroSteelQuarters(idx, inputSteelQuarters);
		var effInfo = this.efficiencys[idx];
		var baseNumber = Math.ceil(this._getBaseNeedGold()/4*factSteelQuarters);
		if (!effInfo.cur) {
			return baseNumber;
		}
		
		var addNumber = Math.ceil(this._getSpeedNeedGold()/4*factSteelQuarters);
		return TQ.format(rstr.steelherodlg.lbl.needAddGold, baseNumber, addNumber);
	}
	
	,setOpDom : function(idx, hero, uiItem){
		var effInfo = this.efficiencys[idx];
		TQ.setCSS(uiItem.exsubs.opDom, 'display', effInfo.can ? 'block' : 'none' );
		TQ.setTextEx(uiItem.exsubs.addEfficiency, effInfo.cur ? TQ.format(rstr.steelherodlg.lbl.addEfficiency, 100) : '' );
	}
	
	,getMaxSteelHours : function(){
		return res_high_herosteel_max_hours;
	}
	
	,getExpendDesc : function(inputSteelQuarters){
		return TQ.format(rstr.steelherodlg.lbl.needGold, this._getNeedExpends(inputSteelQuarters));
	}
	
	,getSteelEfficiencyType : function(idx){
		var effInfo = this.efficiencys[idx];
		return effInfo.cur ? 'speed' : 'normal';
	}
	
	,setSteelEfficiencyType : function(idx, type){
		var effInfo = this.efficiencys[idx];
		if ( type == 'normal' ) {
			effInfo.cur = false;
		} else if ( type == 'speed' ) {
			effInfo.cur = true;
		}
	}
	
	,isEnoughExpend : function(inputSteelQuarters){
		return this._getNeedExpends(inputSteelQuarters) <= this.g.getImgr().getGold();
	}
	
	,getNotEnoughExpendMsg : function(inputSteelQuarters){
		return TQ.format(rstr.comm.noEnoughRechargeGold
			,this._getNeedExpends(inputSteelQuarters)
			,this.g.getImgr().getGold());
	}
	
	,sendSteelMsg : function(inputSteelQuarters){
		var steelQuartersArray = this._getHerosSteelQuarters(inputSteelQuarters);
		HeroSender.sendHerosSteel(this.g, this.getSteelType(), this.heros, steelQuartersArray, this.efficiencys);
	}
	
	,getSpeedEffectSteelHeroCount : function(){
		var count = 0;
		for ( var i=0; i<this.efficiencys.length; ++i ) {
			if ( this.efficiencys[i].cur ) count++; 
		};
		return count;
	}
	
	,_getNeedExpend : function(idx, inputSteelQuarters){
		var factSteelQuarters = this._getHeroSteelQuarters(idx, inputSteelQuarters);
		var effInfo = this.efficiencys[idx];
		var oneQuarterNeed = this._getBaseNeedGold()/4;
		var addQuarterNeed = effInfo.cur ? this._getSpeedNeedGold()/4 : 0;
		return Math.ceil(factSteelQuarters*(oneQuarterNeed+addQuarterNeed));
	}	
	
	,_getCanGetExpPerQuarter : function(idx){
		var hero = this.heros[idx];
		var steelRes = res_herosteel[hero.level-1];
		
		var canGetExpPerQuarter = steelRes.highGetExp;
		if ( this.efficiencys[idx].cur ) {
			canGetExpPerQuarter *= 2;
		}
		
		return canGetExpPerQuarter;
	}	
	
	,_getCanGetExp : function(idx, hero, inputSteelQuarters, resExpName){
		var effInfo = this.efficiencys[idx];
		var steelRes = res_herosteel[hero.level-1];
		var factor = effInfo.cur ? 2 : 1;
		return steelRes[resExpName]*this._getHeroSteelQuarters(idx, inputSteelQuarters)*factor;
	}
	
	,_getNeedExpendStr : function(idx, hero, inputSteelQuarters, baseNeedGold, speedNeedGold){
		var factSteelQuarters = this._getHeroSteelQuarters(idx, inputSteelQuarters);
		var effInfo = this.efficiencys[idx];
		var baseNumber = Math.ceil(baseNeedGold/4*factSteelQuarters);
		if (!effInfo.cur) {
			return baseNumber;
		}
		
		var addNumber = Math.ceil(speedNeedGold/4*factSteelQuarters);
		return TQ.format(rstr.steelherodlg.lbl.needAddGold, baseNumber, addNumber);
	}
	
	,_getBaseNeedGold : function() {
		return 2;
	}
	
	,_getSpeedNeedGold : function(){
		return 3;
	}
	
	,getSteelType : function(){
		return 'highsteel';
	}
});

Vip1HeroSteelOpHdr = HighHeroSteelOpHdr.ex({
	getTitle : function(){
		return rstr.steelherodlg.vip1Title;
	}
	
	,getCanGetExp : function(idx, hero, inputSteelQuarters){
		return this._getCanGetExp(idx, hero, inputSteelQuarters, 'high1GetExp');
	}
	
	,getSteelType : function(){
		return 'vip1steel';
	}
	
	,_getBaseNeedGold : function() {
		return 5;
	}
	
	,_getSpeedNeedGold : function(){
		return 6;
	}
});

Vip2HeroSteelOpHdr = HighHeroSteelOpHdr.ex({
	getTitle : function(){
		return rstr.steelherodlg.vip2Title;
	}
	
	,getCanGetExp : function(idx, hero, inputSteelQuarters){
		return this._getCanGetExp(idx, hero, inputSteelQuarters, 'high2GetExp');
	}
	
	,getSteelType : function(){
		return 'vip2steel';
	}
	
	,_getBaseNeedGold : function() {
		return 10;
	}
	
	,_getSpeedNeedGold : function(){
		return 12;
	}
});

SteelHeroDlg = Class.extern(function(){
	//SteelHeroDlg-unittest-start
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_flag = null;
	var m_heros = null;
	var m_steelOpHdr = null;
	var m_efficiencys = null;
	
	this.init = function(g){
		_initParams(this, g);
		_regEvents();
	};
	
	this.openDlg = function(flag, heros){
		_initParamsWhenOpen(flag, heros);
		_initDlg();
		_createSteelOpHdr();
		_openDlg();
		_setTitleAndExpendLbl();
		_initInfo();
	};
	
	this.hideDlg = function(){
		if (m_dlg) m_dlg.hide();
	};
	
	var _initParams = function(selfThis, g){
		m_this = selfThis;
		m_g = g;
	};
	
	var _regEvents = function(){
		m_g.regEvent(EVT.HERO_UPDATE, 0, m_this, _onHeroUpdate);
	};
	
	var _initParamsWhenOpen = function(flag, heros){
		m_flag = flag;
		m_heros = heros;
	};
	
	var _initDlg = function(){
		if (m_dlg) return;
		
		_createDlg();
		_setCallers();		
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal:false, title:rstr.steelherodlg.title, pos:{x:'center', y:50} });
		m_g.getGUI().initDlg(m_dlg, uicfg.hero.steelherodlg, m_items);
	};
	
	var _setCallers = function(){
		m_items.ihour.setLimit(_getHoursLimit);
		m_items.ihour.setCaller({self:m_this,caller:_onHoursChange});
		m_items.steelBtn.setCaller({self:m_this, caller:_onClickSteel});
	};
	
	var _createSteelOpHdr = function(){
		if ( m_flag == 'steel' ){
			m_steelOpHdr = CommHeroSteelOpHdr.snew(m_g, m_heros, m_dlg, m_items);
		} else if ( m_flag == 'highsteel' ) {
			m_steelOpHdr = HighHeroSteelOpHdr.snew(m_g, m_heros, m_dlg, m_items);
		} else if ( m_flag == 'vip1steel' ) {
			m_steelOpHdr = Vip1HeroSteelOpHdr.snew(m_g, m_heros, m_dlg, m_items);
		} else if ( m_flag == 'vip2steel' ) {
			m_steelOpHdr = Vip2HeroSteelOpHdr.snew(m_g, m_heros, m_dlg, m_items);
		}
	};	
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _setTitleAndExpendLbl = function(){
		m_dlg.setTitle(m_steelOpHdr.getTitle());
		TQ.setTextEx(m_items.needExpendLbl, m_steelOpHdr.getNeedExpendLbl());
	};
	
	var _initInfo = function(){
		m_items.ihour.setVal(1);
		_setSteelDesc();
		_setSpeedHighSteelDesc();
		_update();
	};
	
	var _setSteelDesc = function(){
		var steelBuildLevel = m_g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.STEEL_BUILD);
		var res = ItemResUtil.findBuildLevelres(FIXID.STEEL_BUILD, steelBuildLevel);
		TQ.setTextEx(m_items.steelDesc, TQ.format(rstr.steelherodlg.lbl.steelDesc, res.herosteelmaxlevel) );
	};
	
	var _setSpeedHighSteelDesc = function(){
		var count = m_steelOpHdr.getSpeedEffectSteelHeroCount();
		if ( count == 0 ) {
			TQ.setTextEx(m_items.speedHighSteelDesc, '');
		}
		else {
			TQ.setTextEx(m_items.speedHighSteelDesc, TQ.format(rstr.steelherodlg.lbl.speedHighSteelDesc, count));
		}
	};
	
	var _update = function(){
		if ( !_isShow() ) return;
		
		_updateHerosList();
		_updateExpendDesc();
	};
	
	var _isShow = function(){
		if ( !m_dlg ) return false;
		
		return m_dlg.isShow();
	};
	
	var _updateHerosList = function(){
		_setHerosListItems();
		_setHerosListCallers();
	};
	
	var _setHerosListItems = function(){
		var multBySvrAct = m_g.getImgr().multHeroSteelBySvrAct();
		var steelQuarters = _getInputSteelQuarters();
		m_items.list.setItemCount(m_heros.length);
		for ( var i=0; i<m_items.list.getCount(); ++i ){
			var item = m_items.list.getItem(i);
			var hero = m_heros[i];
			TQ.setTextEx(item.exsubs.name, hero.name);
			TQ.setTextEx(item.exsubs.level, hero.level);
			TQ.setTextEx(item.exsubs.canGetExp, m_steelOpHdr.getCanGetExp(i, hero, steelQuarters)*multBySvrAct );
			TQ.setTextEx(item.exsubs.needExpend, m_steelOpHdr.getNeedExpendStr(i, hero, steelQuarters) );
			m_steelOpHdr.setOpDom(i, hero, item);
		}
	};
	
	var _setHerosListCallers = function(){
		for ( var i=0; i<m_items.list.getCount(); ++i ){
			var item = m_items.list.getItem(i);
			item.exsubs.changeBtn.setId(i);
			item.exsubs.changeBtn.setCaller({self:m_this, caller:_onClickChangeBtn});
		}
	};
	
	var _updateExpendDesc = function(){
		var steelQuarters = _getInputSteelQuarters();
		TQ.setTextEx(m_items.needDesc, m_steelOpHdr.getExpendDesc(steelQuarters));
	};
	
	var _onHeroUpdate = function(){
		_update();
	};
	
	var _getHoursLimit = function() {
		return {min:1, max:m_steelOpHdr.getMaxSteelHours()};
	};
	
	var _onClickChangeBtn = function(idx){
		var dlg = UIM.getDlg('selectsteeltype');
		dlg.setCaller({self:m_this, caller:_onSelectSteelType});
		dlg.openDlg(idx, m_steelOpHdr.getSteelEfficiencyType(idx), m_steelOpHdr.getSteelType());
	};
	
	var _onSelectSteelType = function(idx, efficiencyType){
		m_steelOpHdr.setSteelEfficiencyType(idx, efficiencyType);
		_update();
	};
	
	var _onHoursChange = function(num) {
		_update();
	};
	
	var _onClickSteel = function(){
		var steelQuarters = _getInputSteelQuarters();
		if (!m_steelOpHdr.isEnoughExpend(steelQuarters)){
			m_g.getGUI().msgBox(rstr.comm.msgts, m_steelOpHdr.getNotEnoughExpendMsg(steelQuarters), MB_F_CLOSE, null);
			return;
		}
		
		m_steelOpHdr.sendSteelMsg(steelQuarters);
		m_dlg.hide();
	};
	
	var _getInputSteelQuarters = function(){
		return m_items.ihour.getVal()*4;
	};
	//SteelHeroDlg-unittest-end
});