/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
CreateRoleDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g;
	_lc_.m_this;
	_lc_.m_dlg;
	_lc_.m_items = {};
	_lc_.m_isvalidrole = false;
	var m_lastRoleName = '';
	var m_dlgsize = {cx:2048, cy:1536};
	var C_RANDNAMEDELAY = 500;

	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_g.regEvent(EVT.NET, NETCMD.CREATEROLE, _lc_.m_this, _lc_._onSvrPkg);
	};
	
	this.openDlg = function(){
		_lc_._initDlg();
		_lc_._initInfo();
		_lc_._showDlg();
		g_loading.hide();
		SoundMgr.playBackSound(res_baksounds.createRole);
	};
	
	this.resize = function(size){
		if ( !_lc_._isShow() ) return;
		
		var x = (size.cx - m_dlgsize.cx) / 2;
		_lc_.m_dlg.setPosition({x:x, y:0});
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		
		_lc_._createDlg();
		_lc_._setBtnType();
		_lc_._setCallers();
		_lc_._setListItems();
		_lc_._initInputLength();
	};
	
	_lc_._isShow = function(){
		if ( !_lc_.m_dlg ) return false; 
		return _lc_.m_dlg.isShow();
	};	
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal : false,
				pos : {x:'center', y:0},
				uiback:uiback.dlg.noborder
			});
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.createrole, _lc_.m_items);	
	};
	
	_lc_._setBtnType = function(){
		_lc_.m_items.randName.setType(BTN_TYPE.DELAY);
		_lc_.m_items.randName.setDelay(C_RANDNAMEDELAY);
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.list.setCaller({self:_lc_.m_this, caller:_lc_._onClickList});
		_lc_.m_items.entergame.setCaller({self:_lc_.m_this, caller:_lc_._onClickEnterGame});
		_lc_.m_items.randName.setCaller({self:_lc_.m_this, caller:_lc_._onClickGetRandName});
		_lc_._setListItemBtnCallers();
	};
	
	_lc_._setListItemBtnCallers = function(){
		for (var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			item.exsubs.selectIcon.setId(i);
			item.exsubs.selectIcon.setCaller({self:_lc_.m_this, caller:_lc_._onClickSelectIconBtn});
		}
	};
	
	_lc_._setListItems = function(){
		for (var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			var iconIdx = Math.floor(Math.random()*res_role_icons.length);
			var iconId = res_role_icons[iconIdx].icon[i];
			_lc_._setListItemIcon(item, iconId);
		}
	};
	
	_lc_._setListItemIcon = function(item, iconId){
		item.exsubs.iconId = iconId;
		var itemres = ItemResUtil.findItemres(item.exsubs.iconId); 
		IMG.setBKImage(item.exsubs.icon, IMG.makeBigImg(itemres.bigpic));
	};
	
	_lc_._initInputLength = function(){
		InputLimit.maxGBKBytes(_lc_.m_items.rolename, JVALID.getMaxUserLen(), Caller.snew(_lc_.m_this, _lc_._onRoleNameChange));
	};
	
	_lc_._initInfo = function(){
		_lc_.m_items.list.setCurSel(0);
		TQ.setTextEx(_lc_.m_items.namedesc, TQ.formatColorStr(rstr.createroledlg.err.empty, COLORS.INVALID_ROLE_NAME) );
	};
	
	_lc_._showDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._doCheckNameValid = function(){
		_lc_.m_isvalidrole = false;
		var bytes = UnicodeStr.gbkLen(_lc_.m_items.rolename.value);
		if ( bytes == 0 ){
			TQ.setTextEx(_lc_.m_items.namedesc, TQ.formatColorStr(rstr.createroledlg.err.empty, COLORS.INVALID_ROLE_NAME));
		} else if (bytes < JVALID.getMinUserLen() || bytes > JVALID.getMaxUserLen() ) {
			TQ.setTextEx(_lc_.m_items.namedesc, TQ.formatColorStr(rstr.createroledlg.err.errlength, COLORS.INVALID_ROLE_NAME));
		} else if (!JVALID.checkUsername(_lc_.m_items.rolename.value)){
			TQ.setTextEx(_lc_.m_items.namedesc, TQ.formatColorStr(rstr.createroledlg.err.invalidchar, COLORS.INVALID_ROLE_NAME));
		} else{
			CreateRoleSender.sendCheckName(_lc_.m_g, _lc_.m_items.rolename.value);
		}
	};
	
	_lc_._onRoleNameChange = function(){
		if (m_lastRoleName != _lc_.m_items.rolename.value) {
			m_lastRoleName = _lc_.m_items.rolename.value;
			_lc_._doCheckNameValid();
		}			
	};

	_lc_._onSvrPkg = function(netevent){
		var netdata = netevent.data;
		if ( netdata.subid == 0 ){
			_lc_.m_this.openDlg();
		}
		else if ( netdata.subid == 1 ){
			_lc_._onSvrValidCheck(netdata);
		}
		else if ( netdata.subid == 2 ){
			_lc_._setRoleName(netdata.randname);
		}
		else if ( netdata.subid == 99 ){
			_lc_._onFinishCreate(netdata);
		}
	};
	
	_lc_._onSvrValidCheck = function(netdata){
		_lc_.m_isvalidrole = false;
		if ( netdata.result == 'OK' ) {
			TQ.setTextEx(_lc_.m_items.namedesc, TQ.formatColorStr(rstr.createroledlg.err.okname, COLORS.VALID_ROLE_NAME));
			_lc_.m_isvalidrole = true;
		}
		else {
			TQ.setTextEx(_lc_.m_items.namedesc, TQ.formatColorStr(netdata.result, COLORS.INVALID_ROLE_NAME));
			_lc_.m_items.entergame.enable(true);
		}
	};
	
	_lc_._setRoleName = function(randname){
		_lc_.m_items.rolename.value = randname;
		CreateRoleSender.sendCheckName(_lc_.m_g, randname);
	};
	
	_lc_._onFinishCreate = function(netdata){
		if ( netdata.result == 0 ) {
			_lc_.m_dlg.hide();
			_lc_.m_g.getImgr().setFirstCreateGame(true);
		} else {
			_lc_.m_items.entergame.enable(true);
		}
	};
	
	_lc_._onClickList = function(e, idx){
		for (var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			if ( i == idx ) {
				_lc_.m_items.list.getItem(i).exsubs.selectIcon.show();
			} else {
				_lc_.m_items.list.getItem(i).exsubs.selectIcon.hide();
			}
		}
	};
	
	_lc_._onClickGetRandName = function(){
		CreateRoleSender.sendGetRandName(_lc_.m_g, _lc_.m_items.list.getCurSel());
	};
	
	_lc_._onClickEnterGame = function(){
		if ( _lc_.m_isvalidrole ){
			CreateRoleSender.sendCreateRole(_lc_.m_g, _lc_.m_items.rolename.value, _lc_._getCurSelIcon());
			_lc_.m_items.entergame.enable(false);
		}
	};
	
	_lc_._onClickSelectIconBtn = function(idx){
		var item = _lc_.m_items.list.getItem(idx);
		_lc_._onSelectIconCallback = function(iconId){
			_lc_._setListItemIcon(item, iconId);
		};
		
		var dlg = UIM.getDlg('selecticon');
		dlg.setCaller({self:_lc_.m_this, caller:_lc_._onSelectIconCallback});
		
		var icons = [];
		for ( var i=0; i<res_role_icons.length; ++i ) {
			icons.push(res_role_icons[i].icon[idx]);
		}
		dlg.openDlg(icons, item.exsubs.iconId);
	};

	_lc_._getCurSelIcon = function(){
		var curIdx = _lc_.m_items.list.getCurSel();
		return _lc_.m_items.list.getItem(curIdx).exsubs.iconId;
	};
	//CreateRoleDlg-unittest-end
});
