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
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	_lc_.m_flag = null;
	_lc_.m_heros = null;
	_lc_.m_steelOpHdr = null;
	var m_efficiencys = null;
	
	this.init = function(g){
		_lc_._initParams(this, g);
		_lc_._regEvents();
	};
	
	this.openDlg = function(flag, heros){
		_lc_._initParamsWhenOpen(flag, heros);
		_lc_._initDlg();
		_lc_._createSteelOpHdr();
		_lc_._openDlg();
		_lc_._setTitleAndExpendLbl();
		_lc_._initInfo();
	};
	
	this.hideDlg = function(){
		if (_lc_.m_dlg) _lc_.m_dlg.hide();
	};
	
	_lc_._initParams = function(selfThis, g){
		_lc_.m_this = selfThis;
		_lc_.m_g = g;
	};
	
	_lc_._regEvents = function(){
		_lc_.m_g.regEvent(EVT.HERO_UPDATE, 0, _lc_.m_this, _lc_._onHeroUpdate);
	};
	
	_lc_._initParamsWhenOpen = function(flag, heros){
		_lc_.m_flag = flag;
		_lc_.m_heros = heros;
	};
	
	_lc_._initDlg = function(){
		if (_lc_.m_dlg) return;
		
		_lc_._createDlg();
		_lc_._setCallers();		
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:false, title:rstr.steelherodlg.title, pos:{x:'center', y:50} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.hero.steelherodlg, _lc_.m_items);
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.ihour.setLimit(_lc_._getHoursLimit);
		_lc_.m_items.ihour.setCaller({self:_lc_.m_this,caller:_lc_._onHoursChange});
		_lc_.m_items.steelBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickSteel});
	};
	
	_lc_._createSteelOpHdr = function(){
		if ( _lc_.m_flag == 'steel' ){
			_lc_.m_steelOpHdr = CommHeroSteelOpHdr.snew(_lc_.m_g, _lc_.m_heros, _lc_.m_dlg, _lc_.m_items);
		} else if ( _lc_.m_flag == 'highsteel' ) {
			_lc_.m_steelOpHdr = HighHeroSteelOpHdr.snew(_lc_.m_g, _lc_.m_heros, _lc_.m_dlg, _lc_.m_items);
		} else if ( _lc_.m_flag == 'vip1steel' ) {
			_lc_.m_steelOpHdr = Vip1HeroSteelOpHdr.snew(_lc_.m_g, _lc_.m_heros, _lc_.m_dlg, _lc_.m_items);
		} else if ( _lc_.m_flag == 'vip2steel' ) {
			_lc_.m_steelOpHdr = Vip2HeroSteelOpHdr.snew(_lc_.m_g, _lc_.m_heros, _lc_.m_dlg, _lc_.m_items);
		}
	};	
	
	_lc_._openDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._setTitleAndExpendLbl = function(){
		_lc_.m_dlg.setTitle(_lc_.m_steelOpHdr.getTitle());
		TQ.setTextEx(_lc_.m_items.needExpendLbl, _lc_.m_steelOpHdr.getNeedExpendLbl());
	};
	
	_lc_._initInfo = function(){
		_lc_.m_items.ihour.setVal(1);
		_lc_._setSteelDesc();
		_lc_._setSpeedHighSteelDesc();
		_lc_._update();
	};
	
	_lc_._setSteelDesc = function(){
		var steelBuildLevel = _lc_.m_g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.STEEL_BUILD);
		var res = ItemResUtil.findBuildLevelres(FIXID.STEEL_BUILD, steelBuildLevel);
		TQ.setTextEx(_lc_.m_items.steelDesc, TQ.format(rstr.steelherodlg.lbl.steelDesc, res.herosteelmaxlevel) );
	};
	
	_lc_._setSpeedHighSteelDesc = function(){
		var count = _lc_.m_steelOpHdr.getSpeedEffectSteelHeroCount();
		if ( count == 0 ) {
			TQ.setTextEx(_lc_.m_items.speedHighSteelDesc, '');
		}
		else {
			TQ.setTextEx(_lc_.m_items.speedHighSteelDesc, TQ.format(rstr.steelherodlg.lbl.speedHighSteelDesc, count));
		}
	};
	
	_lc_._update = function(){
		if ( !_lc_._isShow() ) return;
		
		_lc_._updateHerosList();
		_lc_._updateExpendDesc();
	};
	
	_lc_._isShow = function(){
		if ( !_lc_.m_dlg ) return false;
		
		return _lc_.m_dlg.isShow();
	};
	
	_lc_._updateHerosList = function(){
		_lc_._setHerosListItems();
		_lc_._setHerosListCallers();
	};
	
	_lc_._setHerosListItems = function(){
		var multBySvrAct = _lc_.m_g.getImgr().multHeroSteelBySvrAct();
		var steelQuarters = _lc_._getInputSteelQuarters();
		_lc_.m_items.list.setItemCount(_lc_.m_heros.length);
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ){
			var item = _lc_.m_items.list.getItem(i);
			var hero = _lc_.m_heros[i];
			TQ.setTextEx(item.exsubs.name, hero.name);
			TQ.setTextEx(item.exsubs.level, hero.level);
			TQ.setTextEx(item.exsubs.canGetExp, _lc_.m_steelOpHdr.getCanGetExp(i, hero, steelQuarters)*multBySvrAct );
			TQ.setTextEx(item.exsubs.needExpend, _lc_.m_steelOpHdr.getNeedExpendStr(i, hero, steelQuarters) );
			_lc_.m_steelOpHdr.setOpDom(i, hero, item);
		}
	};
	
	_lc_._setHerosListCallers = function(){
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ){
			var item = _lc_.m_items.list.getItem(i);
			item.exsubs.changeBtn.setId(i);
			item.exsubs.changeBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickChangeBtn});
		}
	};
	
	_lc_._updateExpendDesc = function(){
		var steelQuarters = _lc_._getInputSteelQuarters();
		TQ.setTextEx(_lc_.m_items.needDesc, _lc_.m_steelOpHdr.getExpendDesc(steelQuarters));
	};
	
	_lc_._onHeroUpdate = function(){
		_lc_._update();
	};
	
	_lc_._getHoursLimit = function() {
		return {min:1, max:_lc_.m_steelOpHdr.getMaxSteelHours()};
	};
	
	_lc_._onClickChangeBtn = function(idx){
		var dlg = UIM.getDlg('selectsteeltype');
		dlg.setCaller({self:_lc_.m_this, caller:_lc_._onSelectSteelType});
		dlg.openDlg(idx, _lc_.m_steelOpHdr.getSteelEfficiencyType(idx), _lc_.m_steelOpHdr.getSteelType());
	};
	
	_lc_._onSelectSteelType = function(idx, efficiencyType){
		_lc_.m_steelOpHdr.setSteelEfficiencyType(idx, efficiencyType);
		_lc_._update();
	};
	
	_lc_._onHoursChange = function(num) {
		_lc_._update();
	};
	
	_lc_._onClickSteel = function(){
		var steelQuarters = _lc_._getInputSteelQuarters();
		if (!_lc_.m_steelOpHdr.isEnoughExpend(steelQuarters)){
			_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, _lc_.m_steelOpHdr.getNotEnoughExpendMsg(steelQuarters), MB_F_CLOSE, null);
			return;
		}
		
		_lc_.m_steelOpHdr.sendSteelMsg(steelQuarters);
		_lc_.m_dlg.hide();
	};
	
	_lc_._getInputSteelQuarters = function(){
		return _lc_.m_items.ihour.getVal()*4;
	};
	//SteelHeroDlg-unittest-end
});