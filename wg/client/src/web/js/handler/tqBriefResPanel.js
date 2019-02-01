/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
IntervalTips = function(){
	//-----------
	//private:data
	//-----------
	var m_g = null;
	var m_this = null;
	var m_interval = 1000*60*5;
	var m_lasttime = 0;
	
	//------------
	//public:method
	//------------
	this.init = function(g, interval){
		m_g = g;
		m_this = this;
		if ( !isNull(interval) ) {
			m_interval = interval;
		}
	};
	
	this.send = function(s){
		var curtime = m_g.getCurTimeMs();
		if ( (curtime - m_lasttime) >= m_interval ) {
			UIM.getPanel('sysmsg').append(CHAT_TAG.SYS, s);
			m_lasttime = curtime;
		}
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};

// 资源面板
BriefResPanel = Class.extern(function(){
	var C_INC_COLOR = '#FFFF00';
	var C_DEC_COLOR = '#FF3300';
	var C_COMM_COLOR = '#FFFFFF';
	var C_ALERT_COLOR = '#FF3300';
	var C_LAST_FARMOUT_INTERVAL = 10000;
	var C_CITY_UPGRADE_ANIM = 1;
	
	//private:data
	var m_g=null;
	var m_this=null;
	var m_items={};
	var m_intervaltips=null;
	var m_lastCityLevel = -1;
	var m_newres={food:0, wood:0, stone:0, iron:0, money:0, maxfood:0, maxwood:0, maxstone:0, maxiron:0, maxmoney:0};
	var m_lastRes = {food:0, wood:0, stone:0, iron:0, money:0, maxfood:0, maxwood:0, maxstone:0, maxiron:0, maxmoney:0};
		
	this.init = function(g, domitems){
		m_g = g;
		m_this = this;
		m_items = domitems;
		var ops = {uiback:uiback.progress.buildvarprog,showflag:0,count:2};
		m_items.buildvalbar = new ProgressBarEx(m_g, m_items.buildvalbar, ops);
		m_intervaltips = new IntervalTips(m_g, 0);
		m_g.regEvent(EVT.LOGIN_OK, 0, m_this, _onLoginOk);
		m_g.regEvent(EVT.NET, NETCMD.CITYRES, m_this, _onSvrPkg);
		m_g.regEvent(EVT.PKG_CHANGE, 1, m_this, _onPkgMiscChange);
		
		m_items.rechargebtn2.setCaller({self:m_this, caller:_onClickRecharge});
		m_items.cityupgradebtn.setCaller({self:m_this, caller:_onClickCityUpgrade});
		_initTagIcons();
		_initToolTips();
		_saveLastRes();
		_updateInfo();
	};
	
	this.show = function(){
		TQ.setCSS(m_items.briefres, 'display', 'block');
		TQ.setCSS(m_items.briefres, 'visibility', 'visible');
	};
	
	
	this.hide = function(){
		TQ.setCSS(m_items.briefres, 'display', 'none');
		TQ.setCSS(m_items.briefres, 'visibility', 'hidden');
	};
	
	this.isCanUpgradeCityLevel = function(){
		return _isCanUpgradeCityLevel();
	};
	
	this.getUpgradeCityBtn = function(){
		return m_items.cityupgradebtn;
	};
	
	var _initTagIcons = function(){
		var tagmaps = [
				{tag:'foodtag', resid:FIXID.FOOD}
				,{tag:'woodtag', resid:FIXID.WOOD}
				,{tag:'stonetag', resid:FIXID.STONE}
				,{tag:'irontag', resid:FIXID.IRON}
				,{tag:'poputag', resid:FIXID.POPU}
				,{tag:'moneytag', resid:FIXID.MONEY}
				,{tag:'goldtag', resid:FIXID.GOLD}
				,{tag:'giftgoldtag', resid:FIXID.GIFTGOLD}
			];
		for ( var i=0; i<tagmaps.length; ++i ) {
			var t = tagmaps[i];
			var res = ItemResUtil.findItemres(t.resid);
			IMG.setBKImage(m_items[t.tag], IMG.makeSmallImg(res.smallpic));
		}
	};	
	
	var _initToolTips = function(){
		var tags = {'food':FIXID.FOOD,'wood':FIXID.WOOD,'stone':FIXID.STONE,'iron':FIXID.IRON};
		for ( var k in tags ) {
			var resid = tags[k];
			for ( var i=1; i<=2; ++i ) {
				TTIP.setCallerData(m_items.tooltips['$'+k+'item'+i], {self:m_this, caller:_onGetCommResTip}, {tag:k, resid:resid} );
			}
		}
		var tipmaps = [{id:'$popu1', caller:_onGetPopuTip},
			{id:'$popu2', caller:_onGetPopuTip},
			{id:'$buildvalbar', caller:_onGetBuildVarTip},
			{id:'$cityupgradebtn', caller:_onGetCityUpgradeBtnTip},
			{id:'$moneyitem1', caller:_onGetMoneyTip},
			{id:'$moneyitem2', caller:_onGetMoneyTip}];
		for ( var i=0; i<tipmaps.length; ++i ) { 
			var tm = tipmaps[i];
			TTIP.setCallerData(m_items.tooltips[tm.id], {self:m_this, caller:tm.caller}, {} );
		}
	};
	
	var _saveLastRes = function() {
		var imgr = m_g.getImgr();
		var cityres = imgr.getCityRes();
		var cres = cityres.cres;	
		m_lastRes = {food:cres.food, wood:cres.wood, stone:cres.stone, iron:cres.iron, money:imgr.getMoney(),
			maxfood:cres.max, maxwood:cres.max, maxstone:cres.max, maxiron:cres.max, maxmoney:imgr.getMaxMoney()};
	};	
	
	var _tipBeyondChangeRes = function(){
		var tagmaps = ['food','wood','stone','iron','money'];
		var changetags =[];
		for ( var i=0; i<tagmaps.length; ++i ) {
			var t = tagmaps[i];
			if ( m_newres[t] != m_lastRes[t] || m_newres['max'+t] != m_lastRes['max'+t] ) {
				changetags.push(t);
			}
		}
		
		for ( var i=0; i<changetags.length; ++i ) {
			var t = changetags[i];
			var beyond = (m_newres[t] > m_newres['max'+t]) && (m_newres['max'+t] > 0);
			if ( beyond ) {
				m_intervaltips.send(TQ.format(rstr.briefrespanel.tips.beyond, rstr.comm[t]));
			}
		}
	};
	
	var _onLoginOk = function(){
		_getCityResFromSvr();
	};
	
	var _onSvrPkg = function(netevent){
		_saveLastRes();
		var cmdpkg = netevent.data;
		if ( cmdpkg.res ){
			var cityres =  m_g.getImgr().getCityRes();
			TQ.dictCopy(cityres, cmdpkg.res);
			if ( cmdpkg.res.buildval && cmdpkg.res.buildval.level != undefined ) {
				m_g.sendEvent({eid:EVT.SETCITYLEVEL, sid:0, level:cmdpkg.res.buildval.level});
				_handleCityUpgrade(cmdpkg.res.buildval.level);
			}
			m_g.sendEvent({eid:EVT.CITYRES, sid:0});
			_updateInfo();
		}
	};
	
	var _handleCityUpgrade = function(curLevel) {
		if ( curLevel > m_lastCityLevel ) {
			if ( m_lastCityLevel != -1 ) {
				_onCityUpgrade(curLevel);
			}
			m_lastCityLevel = curLevel;
		}
	};
	
	var _onCityUpgrade = function(curLevel){
		var size = {cx:308, cy:70};
		var clientSize = m_g.getWinSizer().getValidClientSize();
		var cfg = {
			parent : TQ.getUiBody(),
			size : size,
			imageClass : 'city_upgrade_effect',
			zorder : UI_ZORDER_SCREEN_EFFECT + 1,
			pos :{x:(clientSize.cx - size.cx)/2, y:(clientSize.cy - size.cy)/2}
		};
		m_g.getEntityfactory().playImageEffect(cfg);
		HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
	};
	
	var _onPkgMiscChange = function(){
		_showGold();
	};
	
	var _onClickRecharge = function(){
		JMISC.openPayWnd();
	};
	
	var _onClickCityUpgrade = function(){
		_sendUpgradeCityCmd();
	};
	
	var _onGetCommResTip = function(data){
		return TIPM.getCommResDesc(data.tag, data.resid);
	};
	
	var _onGetBuildVarTip = function(data){
		return TIPM.getBuildVarBarDesc();
	};
	
	var _onGetCityUpgradeBtnTip = function(data){
		if ( _isCanUpgradeCityLevel() ) {
			var cityres = m_g.getImgr().getCityRes();
			var nextlevel = cityres.buildval.level+1;
			return TQ.format(rstr.briefrespanel.tips.canup, RStrUtil.getCityNameByLevel(nextlevel));
		}
		else if ( _isFullCityLevel() ) {
			return rstr.briefrespanel.buildval.fulllevel;
		}
		else {
			return TIPM.getBuildVarBarDesc();
		}
	};
	
	var _onGetPopuTip = function(data){
		return TIPM.getPopuDesc();
	};
	
	var _onGetMoneyTip = function(data){
		return TIPM.getMoneyDesc();
	};
	
	var _updateInfo = function(){
		var imgr = m_g.getImgr();
		var cityres = imgr.getCityRes();
		var cres = cityres.cres;
		m_newres = {food:cres.food, wood:cres.wood, stone:cres.stone, iron:cres.iron, money:imgr.getMoney(),
			maxfood:cres.max, maxwood:cres.max, maxstone:cres.max, maxiron:cres.max, maxmoney:imgr.getMaxMoney()};
		_showCommRes(['food','wood','stone','iron','money']);
		_showGold();
		_showBuildVal();
		_showPopu();
		_toggleUpgrageBtn();
		_tipBeyondChangeRes();
	};
	
	var _showCommRes = function(tagmaps){
		for ( var i=0; i<tagmaps.length; ++i ) {
			var t = tagmaps[i];
			var beyond = (m_newres[t] > m_newres['max'+t]) && (m_newres['max'+t] > 0);
			var resnum = RStrUtil.formatResNumStr(m_newres[t]);
			var szres =  beyond ? TQ.formatColorStr(resnum,C_ALERT_COLOR) : resnum;
			TQ.setHtml(m_items['cur'+t], szres);
		}
	};
	
	var _showPopu = function(){
		var mgr = m_g.getImgr();
		TQ.setTextEx(m_items.curpopu, RStrUtil.formatResNumStr(mgr.getIdlePopu()));
	};
	
	var _showGold = function(){
		TQ.setHtml(m_items.curgold, m_g.getImgr().getGold());
		TQ.setHtml(m_items.curgiftgold, m_g.getImgr().getGiftGold());
	};
	
	var _showBuildVal = function(){
		var cityres = m_g.getImgr().getCityRes();
		var premax = 0;
		if ( cityres.buildval.level > 0 ) {
			var res = TQ.qfind(res_citylevelneeds, 'level', cityres.buildval.level);
			premax = res.needbuildval;
		}
		m_items.buildvalbar.setRange(cityres.buildval.max - premax);// 下级所需
		m_items.buildvalbar.setValue(0, cityres.buildval.cur - premax);// 曾经达到的最大值
		m_items.buildvalbar.setValue(1, cityres.buildval.cur-cityres.buildval.hurt - premax);// 减去受损的值得到的当前值
		IMG.setBKImage(m_items.buildlevel, IMG.getCityNameImgByLevel(cityres.buildval.level));
	};
	
	var _toggleUpgrageBtn = function(){
		if ( _isCanUpgradeCityLevel() ) {
			m_items.cityupgradebtn.enable(true);
			m_items.cityupgradebtn.startBlinking(0);
			TQ.setCSS(m_items.cityupgradebk, 'display', 'block' );
			HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
		} else {
			m_items.cityupgradebtn.enable(false);
			m_items.cityupgradebtn.stopBlinking();
			TQ.setCSS(m_items.cityupgradebk, 'display', 'none' );
		}
	};
	
	var _isCanUpgradeCityLevel = function(){
		var cityres = m_g.getImgr().getCityRes();
		var enough = (_getFactBuildVal() >= cityres.buildval.max);
		return enough && !_isFullCityLevel();
	};
	
	var _isFullCityLevel = function(){
		var cityres = m_g.getImgr().getCityRes();
		return cityres.buildval.level >= res_max_city_level;
	};
	
	var _getFactBuildVal = function(){
		var cityres = m_g.getImgr().getCityRes();
		return cityres.buildval.cur - cityres.buildval.hurt;
	};
	
	var _getCityResFromSvr = function(){
		var sendmsg = '{cmd='+NETCMD.CITYRES+',subcmd=1}';
		m_g.send(null, sendmsg);
	};
	
	var _sendUpgradeCityCmd = function(){
		var sendmsg = '{cmd='+NETCMD.CITYRES+',subcmd=2}';
		m_g.send(null, sendmsg);
	};
	
	//BriefResPanel-testunit
});