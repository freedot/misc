/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
StrategyDlg = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items = {};
	var m_targettype = RES_TRG.MYCITY;
	var m_targetuid = 0;
	var m_targetname = '';

	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.openDlg = function(targettype, targetuid, targetname){
		m_targettype = targettype;
		m_targetuid = targetuid;
		m_targetname = targetname;
		_initDlg();
		_initInfo();
		m_dlg.show();
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:true,
					title:rstr.strategydlg.title,
					pos:{x:"center", y:30}
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.strategydlg, m_items);
			m_items.list.setCaller({self:m_this, caller:_onClickListItem});
			m_g.regEvent(EVT.ROLEBASE, 0, m_this, _onRolebaseChange);
			m_dlg.hide();
		}
	};
	
	var _initInfo = function(){
		var item = m_g.getImgr().getItemByResId(FIXID.SLEEVE);
		TQ.setTextEx(m_items.num, item ? item.number : 0);
		TQ.setTextEx(m_items.target, m_targetname);
		_updateStrategyPoint();
		_updateList();
	};
	
	var _updateList = function(){
		m_items.list.setItemCount(FIXID.LASTSTRATEGY - FIXID.FIRSTSTRATEGY + 1);
		for ( var id=FIXID.FIRSTSTRATEGY; id<=FIXID.LASTSTRATEGY; ++id ){
			var item = m_items.list.getItem(id-FIXID.FIRSTSTRATEGY);
			var itemres = ItemResUtil.findItemres(id);
			IMG.setBKImage(item.exsubs.icon, IMG.makeBigImg(itemres.bigpic));
			TQ.setText(item.exsubs.name, itemres.name);
			var isenable = _hasTargetType(itemres.targets, m_targettype);
			TQ.setClass(item.exsubs.flag, isenable ? '' : 'disable_icon');
			m_items.list.enableItem(id-FIXID.FIRSTSTRATEGY, isenable);
			
			var tipid = m_items.list.getSubItem(item,'tooltips')['$item'];
			var tip = TTIP.getTipById(tipid);
			tip.setCaller({self:m_this, caller:_onGetTooltip});
			tip.setData({id:id});
		}
	};
	
	var _hasTargetType = function(targets, type){
		for ( var i=0; i<targets.length; ++i ){
			if ( targets[i] == type ) return true;
		}
		return false;
	};
	
	var _onGetTooltip = function(data){
		var itemres = ItemResUtil.findItemres(data.id);
		return TIPM.getItemDesc({id:0,itemres:itemres});
	};
	
	var _onClickListItem = function(e, idx){
		UIM.getDlg('usestrategy').openDlg(
			FIXID.FIRSTSTRATEGY+idx,
			m_targettype,
			m_targetuid,
			m_targetname);
	};
	
	var _onRolebaseChange = function(){
		_updateStrategyPoint();
	};
	
	var _updateStrategyPoint = function(){
		var imgr = m_g.getImgr();
		TQ.setTextEx(m_items.stpoint, imgr.getRoleAttrVal(ATTR.STP) + '/' + imgr.getRoleAttrVal(ATTR.MSTP));
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};

UseStrategyDlg = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items = {};
	var m_id;
	var m_targettype = RES_TRG.MYCITY;
	var m_targetuid = 0;
	var m_targetname = '';

	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.openDlg = function(id, targettype, targetuid, targetname){
		m_id = id;
		m_targettype = targettype;
		m_targetuid = targetuid;
		m_targetname = targetname;
		_initDlg();
		_initInfo();
		m_dlg.show();
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:true
					,title:rstr.usestrategy.title
					,pos:{x:"center", y:30}
					,btns:[{btn:{id:0,text:rstr.comm.confirm},caller:{self:m_this,caller:_onClickConfirm}},
					{btn:{id:0,text:rstr.comm.cancel},caller:{self:m_this,caller:function(){m_dlg.hide();} }}]
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.usestrategy, m_items);
			m_dlg.hide();
		}
	};
	
	var _initInfo = function(){
		var itemres = ItemResUtil.findItemres(m_id);
		TQ.setText(m_items.name, itemres.name);
		TQ.setTextEx(m_items.desc, itemres.desc +  TIPM.getItemExpends({id:0,itemres:itemres}, null));
		TQ.setTextEx(m_items.target, m_targetname);
	};
	
	var _onClickConfirm = function(){
		_sendUseStrategyToSvr();
	};
	
	var _sendUseStrategyToSvr = function(){
		var sendmsg = '{cmd='+NETCMD.STRATEGY+',subcmd=2';
		sendmsg += ',itemid='+m_id;
		sendmsg += ',ttype='+m_targettype+',tuid='+m_targetuid;
		sendmsg += '}';
		m_g.send(null, sendmsg);
		m_dlg.hide();
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};

AppointHeroDlg = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items = {};
	var m_hero;

	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.openDlg = function(hero){
		m_hero = hero ? hero : null;
		if ( !_isCanOpen() ) return;
		_initDlg();
		_initInfo();
		m_dlg.show();
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:true
					,title:rstr.appointherodlg.title
					,pos:{x:"center",y:40}
					,btns:[{btn:{id:0,text:rstr.comm.confirm},caller:{self:m_this,caller:_onClickConfirm}},
					{btn:{id:0,text:rstr.comm.cancel},caller:{self:m_this,caller:function(){m_dlg.hide();} }}]
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.hero.appointdlg, m_items);
			m_dlg.hide();
			_initPosDropList();
		}
	};
	
	var _isCanOpen = function(){
		if ( m_hero.state == HERO_STATE.STEEL ) {
			m_g.getGUI().msgBox(rstr.comm.msgts, rstr.appointherodlg.issteeling, MB_F_CLOSE, null);
			return false;
		}
		else {
			return true;
		}
	};
	
	var _initInfo = function(){
		TQ.setTextEx(m_items.heroname, m_hero.name);
		TQ.setRichText(m_items.curpos, rstr.comm.herostate[m_hero.state]);
		m_items.poslist.setCurSel(m_hero.state);
	};
	
	var _initPosDropList = function(){
		var states = _getStatesSkipSteel();
		for ( var i=0; i<states.length; ++i ) {
			m_items.poslist.addItem({text:states[i]});
		}
		m_items.poslist.setCaller({self:m_this, caller:_onSelectPos});
	};
	
	var _getStatesSkipSteel = function() {
		return rstr.comm.herostate.slice(0, rstr.comm.herostate.length-1);
	};
	
	var _onSelectPos = function(e, idx){
		TQ.setTextEx(m_items.desc, rstr.appointherodlg.appointdescs[idx]);
	};
	
	var _onClickConfirm = function(){
		var curstate = m_items.poslist.getCurSel();
		if ( m_hero.state == curstate ){
		}
		else if ( curstate == 0 ){
			var _msgCallback = function(id){
				if ( id == MB_IDYES ){
					_sendCmdToSvr();
				}
			};
			m_g.getGUI().msgBox(rstr.comm.msgts, 
				TQ.format(rstr.appointherodlg.resign, m_hero.name, rstr.comm.herostate[m_hero.state]), 
				MB_F_YESNO, {self:m_this, caller:_msgCallback});
		}
		else {
			var heroress = m_g.getImgr().getHeros().list;
			var oldhero = TQ.find(heroress, 'state', curstate);
			if ( oldhero ){
				var _msgCallback = function(id){
					if ( id == MB_IDYES ){
						_sendCmdToSvr();
					}
				};
				m_g.getGUI().msgBox(rstr.comm.msgts, 
					TQ.format(rstr.appointherodlg.transfer, oldhero.name, rstr.comm.herostate[oldhero.state], m_hero.name), 
					MB_F_YESNO, {self:m_this, caller:_msgCallback});
			}
			else{
				_sendCmdToSvr();
			}
		}
		m_dlg.hide();
	};
	
	var _sendCmdToSvr = function(){
		var curstate = m_items.poslist.getCurSel();
		var sendmsg = '{cmd='+NETCMD.HERORES+',subcmd=7,id='+m_hero.id+',state='+curstate+'}';
		m_g.send(null, sendmsg);
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};

ItemBuffTrace = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_items;
	var m_updater;

	//------------
	//public:method
	//------------
	this.init = function(g, domitems){
		m_g = g;
		m_this = this;
		m_items = domitems;
		m_g.regEvent(EVT.LOGIN_OK, 0, m_this, _onLoginOk);
		m_g.regEvent(EVT.NET, NETCMD.ITEM, m_this, _onSvrData);
	};

	//------------
	//private:method
	//------------
	var _onUpdate = function(cltTimeMs){
		_updateBuffs();
	};
	
	var _onLoginOk = function(){
		_getAllBuffsFromSvr();
		m_g.regUpdater(m_this, _onUpdate, 1000);
	};
	
	var _onSvrData = function(event){
		if ( event.data.buffs ){
			var buffs = m_g.getImgr().getItemBuffs();
			TQ.dictCopy(buffs.list, event.data.buffs);
			_setBuffs();
		}
	};
	
	var _getAllBuffsFromSvr = function(){
		m_g.send(null, '{cmd='+NETCMD.ITEM+',subcmd=2}');
	};
	
	var _setBuffs = function(){
		m_items.list.setItemCount(m_g.getImgr().getItemBuffs().list.length);
		_traversalList( function(idx, svrtime, buff, item){
			var itemres = ItemResUtil.findItemres(buff.id);
			TQ.setTextEx(item.exsubs.name, itemres.name);
			TQ.setTextEx(item.exsubs.target, _combineTargetName(buff.target));
			_setLeftTime(svrtime, buff, item);
			item.exsubs.usebtn.setId(idx);
			item.exsubs.usebtn.setCaller({self:m_this, caller:_onClickUseBtn});
		});
	};
	
	var _updateBuffs = function(){
		_traversalList( function(idx, svrtime, buff, item){
			_setLeftTime(svrtime, buff, item);
		});
	};
	
	var _traversalList = function(callback){
		var svrtime = parseInt(m_g.getSvrTimeMs()/1000);
		var buffs = m_g.getImgr().getItemBuffs().list;
		for ( var i=0, n=m_items.list.getCount(); i<n; ++i ){
			var buff = buffs[i];
			var item = m_items.list.getItem(i);
			callback(i, svrtime, buff, item);
		};
	};
	
	var _setLeftTime = function(svrtime, buff, item){
		var lefttime = buff.stoptime > svrtime ? buff.stoptime - svrtime : 0;
		if ( lefttime == 0 ) _sendStopCmdToSvr(buff);
		TQ.setTextEx(item.exsubs.lefttime, TQ.formatTime(0, lefttime));
	};
	
	var _combineTargetName = function(target){
		var targetname = '';
		if ( target.type == RES_TRG.FARM 
			|| target.type == RES_TRG.TIMBERYARD 
			|| target.type == RES_TRG.QUARRY 
			|| target.type == RES_TRG.IRONORE ){
			targetname = TQ.qfind(res_targets, 'id', target.type).desc;
		}
		return targetname;
	};
	var _sendStopCmdToSvr = function(buff){
		var sendmsg = '{cmd='+NETCMD.ITEM+',subcmd=3,id='+buff.id+'}';
		m_g.send(null, sendmsg);
	};
	
	var _onClickUseBtn = function(id){
		var b = m_g.getImgr().getItemBuffs().list[id];
		var item = {id:0, resid:b.id, itemres:ItemResUtil.findItemres(b.id)};
		UIM.getDlg('package').useItem(item);
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);		
};

RecruitHeroDlg = function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g=null;
	_lc_.m_this=null;
	_lc_.m_dlg=null;
	_lc_.m_items = {};
	var m_stoptime;
	_lc_.m_heros=[];
	
	//------------
	//public:method
	//------------
	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_g.regEvent(EVT.NET, NETCMD.HERORES, _lc_.m_this, _onSvrData);
		_lc_.m_g.regEvent(EVT.HERO_UPDATE, 0, _lc_.m_this, _onHeroUpdate);
	};
	
	this.openDlg = function(){
		_initDlg();
		_initInfo();
		_lc_.m_g.regUpdater(_lc_.m_this, _onUpdate, 1000);
		HelpGuider.getNewcomerSpirit().onDlgOpen('recruithero', {parent:_lc_.m_dlg.getParent(), items:_lc_.m_items});
	};
	
	this.hideDlg = function(){
		if ( _lc_.m_dlg ) _lc_.m_dlg.hide();
	};
	
	this.getNewHeros = function(){
		return _lc_.m_heros;
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !_lc_.m_dlg ){
			_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:false
					,title:rstr.recruitherodlg.title
					,pos:{x:"center", y:40}
				});
			_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.hero.recruitherodlg, _lc_.m_items);
			_lc_.m_dlg.hide();
			_lc_.m_dlg.setCaller({self:_lc_.m_this,caller:_onDlgEvent});
			_setBtnsCaller();
			_setListBtnsCaller();
			_setListTooltip();
		}
		_lc_.m_dlg.show();
	};
	
	var _setBtnsCaller = function(){
		_lc_.m_items.curherobtn.setCaller({self:_lc_.m_this, caller:_onClickCurHero});
		_lc_.m_items.refreshbtn.setCaller({self:_lc_.m_this, caller:_onClickRefresh});
		_lc_.m_items.buybtn.setCaller({self:_lc_.m_this, caller:_onClickBuy});
	};
	
	var _setListBtnsCaller = function(){
		for ( var i=0, n=_lc_.m_items.list.getCount(); i<n; ++i ){
			var item = _lc_.m_items.list.getItem(i);
			item.exsubs.recruitbtn.setId(i);
			item.exsubs.recruitbtn.setCaller({self:_lc_.m_this, caller:_onClickRecruit});
		}
	};
	
	var _setListTooltip = function(){
		for ( var i=0, n=_lc_.m_items.list.getCount(); i<n; ++i ){
			var item = _lc_.m_items.list.getItem(i);
			TTIP.setCallerData(item.exsubs.tooltips['$item'], {self:_lc_.m_this, caller:_onGetTooltip}, {idx:i});
			TTIP.setCallerData(item.exsubs.tooltips['$nfitem'], {self:_lc_.m_this, caller:_lc_._onGetNatureFactorTooltip}, {idx:i});
		}	
	};
	
	var _initInfo = function(){
		m_stoptime = parseInt(_lc_.m_g.getSvrTimeMs()/1000) + 3600;
		_getNewHerosFromSvr();
	};
	
	var _updateInfo = function(newheros){
		_setHeroNumber();
		_lc_._setHeroList(newheros);
	};
	
	_lc_._setHeroList = function(newheros){
		if ( !_isShow() ) return;
		for ( var i=0, n=_lc_.m_items.list.getCount(); i<n; ++i ){
			var item = _lc_.m_items.list.getItem(i);
			var hero = newheros[i];
			if ( hero ) _setListItem(item, hero);
			else _clearListItem(item);
		}
	};
	
	var _setHeroNumber = function(){
		if ( !_isShow() ) return;
		var imgr = _lc_.m_g.getImgr();
		var curnum = imgr.getHeros().list.length;
		var maxnum = res_gethero_maxcnt( imgr.getRoleLevel() );
		TQ.setTextEx(_lc_.m_items.curheronum, curnum + '/' + maxnum);
	};
	
	var _setListItem = function(item, hero){
		item.exsubs.recruitbtn.show();
		IMG.setBKImage(item.exsubs.icon, IMG.makeBigImg(hero.icon));
		TQ.setTextEx(item.exsubs.name, hero.name);
		TQ.setTextEx(item.exsubs.level, rstr.recruitherodlg.level + hero.level);
		TQ.setTextEx(item.exsubs.prof, rstr.recruitherodlg.prof + rstr.comm.heroprofs[hero.prof]);
		TQ.setTextEx(item.exsubs.naturefactor, rstr.recruitherodlg.naturefactor + HeroNAttrFactorColorGetter.getColorVal(hero));
		TQ.setClass(item.exsubs.border, HeroNAttrFactorColorGetter.getBorderClass(hero));
		if ( HeroNAttrFactorColorGetter.isMaxVal(hero) ) {
			TQ.setClass(item.exsubs.naturefactorbak, 'maxnvalback' );
			TQ.setCSS(item.exsubs.naturefactorbak, 'display', 'block');
		} else {
			TQ.setClass(item.exsubs.naturefactorbak, '' );
			TQ.setCSS(item.exsubs.naturefactorbak, 'display', 'none');
		}
	};
	
	var _clearListItem = function(item){
		item.exsubs.recruitbtn.hide();
		IMG.setBKImage(item.exsubs.icon, '');
		TQ.setTextEx(item.exsubs.name, '');
		TQ.setTextEx(item.exsubs.level, '');
		TQ.setTextEx(item.exsubs.prof, '');
		TQ.setHtml(item.exsubs.naturefactor, '');
		TQ.setClass(item.exsubs.naturefactorbak, '' );
		TQ.setCSS(item.exsubs.naturefactorbak, 'display', 'none');
		TQ.setClass(item.exsubs.border, '' );
	};
	
	var _onClickCurHero = function(){
		UIM.openDlg('hero');
	};
	
	var _onClickRefresh = function(){
		var _msgCallback = function(id){
			if ( id != MB_IDYES ) {
				return;
			}
			
			if ( _lc_.m_g.getImgr().getItemNumByResId(FIXID.REFRESHCARD) == 0 ){
				_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rstr.recruitherodlg.norefresh, MB_F_CLOSE, null);
				return;
			}
			
			_lc_._refreshHerosFromSvr();
		};
		
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, 
			_hasMaxNValHero() ? rstr.recruitherodlg.useitemrefreshex : rstr.recruitherodlg.useitemrefresh, 
			MB_F_YESNO, {self:_lc_.m_this, caller:_msgCallback});
	};
	
	var _hasMaxNValHero = function(){
		for ( var i=0; i<_lc_.m_heros.length; ++i ) {
			if ( HeroNAttrFactorColorGetter.isMaxVal(_lc_.m_heros[i]) ) return true;
		}
		return false;
	};
	
	var _onClickBuy = function(){
		UIM.getDlg('buyitem').openDlg({id:0, resid:FIXID.REFRESHCARD, number:10000});
	};
	
	var _onClickRecruit = function(idx){
		var hero = _lc_.m_heros[idx];
		var imgr = _lc_.m_g.getImgr();
		var curnum = imgr.getHeros().list.length;
		var maxnum = res_gethero_maxcnt( imgr.getRoleLevel() );
		if ( curnum >= maxnum ) {
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.recruitherodlg.maxhero);
			return;
		}
		var _msgCallback = function(id){
			if ( id == MB_IDYES )  {
				_recruitHeroFromSvr(hero.id);
			}
		};
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, 
			TQ.format(rstr.recruitherodlg.recruithero, hero.name), 
			MB_F_YESNO, {self:_lc_.m_this, caller:_msgCallback});
	};

	var _onSvrData = function(netevent){
		var newheros = netevent.data.newheros;
		if ( !newheros ) return;
		if ( newheros.del ) {
			TQ.dictCopy(_lc_.m_heros, netevent.data.newheros.list);
		}
		else {
			_lc_.m_heros = netevent.data.newheros.list;
		}
		m_stoptime = newheros.stoptime ? newheros.stoptime : m_stoptime;
		_updateInfo(_lc_.m_heros);
		HelpGuider.getNewcomerSpirit().onDlgOpen('recruithero', {parent:_lc_.m_dlg.getParent(), items:_lc_.m_items});
	};
	
	var _onHeroUpdate = function(){
		_setHeroNumber();
	};
	
	var _onUpdate = function(cltTimeMs){
		var curtime = _lc_.m_g.getSvrTimeS();
		var lefttime = m_stoptime > curtime ? m_stoptime - curtime : 0;
		TQ.setTextEx(_lc_.m_items.lefttime, TQ.formatTime(1, lefttime));
		if ( lefttime == 0 ) _getNewHerosFromSvr();
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			_lc_.m_g.unregUpdater(_lc_.m_this, _onUpdate);
			HelpGuider.getNewcomerSpirit().onDlgClose('recruithero');
		}
	};
	
	var _onGetTooltip = function(data){
		return TIPM.getNewHeroDesc(_lc_.m_heros[data.idx]);
	};
	
	_lc_._onGetNatureFactorTooltip = function(data){
		return TIPM.getNewHeroNatureFactorDesc(_lc_.m_heros[data.idx]);
	};
	
	var _getNewHerosFromSvr = function(){
		var sendmsg = '{cmd='+NETCMD.HERORES+',subcmd=13}';
		_lc_.m_g.send(null, sendmsg);
	};
	
	var _isShow = function(){
		return _lc_.m_dlg && _lc_.m_dlg.isShow();
	};
	
	_lc_._refreshHerosFromSvr = function(){
		var sendmsg = '{cmd='+NETCMD.HERORES+',subcmd=13,useitem=1}';
		_lc_.m_g.send(null, sendmsg);
	};
	
	var _recruitHeroFromSvr = function(id){
		var sendmsg = '{cmd='+NETCMD.HERORES+',subcmd=15,id='+id+'}';
		_lc_.m_g.send(null, sendmsg);
	};
	
	this.init.apply(this, arguments);
	//RecruitHeroDlg-unittest-end
};