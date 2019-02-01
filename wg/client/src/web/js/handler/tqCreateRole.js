/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
CreateRoleDlg = Class.extern(function(){
	//CreateRoleDlg-unittest-start
	var m_g;
	var m_this;
	var m_dlg;
	var m_items = {};
	var m_isvalidrole = false;
	var m_lastRoleName = '';
	var m_dlgsize = {cx:2048, cy:1536};
	var C_RANDNAMEDELAY = 500;

	this.init = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.NET, NETCMD.CREATEROLE, m_this, _onSvrPkg);
	};
	
	this.openDlg = function(){
		_initDlg();
		_initInfo();
		_showDlg();
		g_loading.hide();
		SoundMgr.playBackSound(res_baksounds.createRole);
	};
	
	this.resize = function(size){
		if ( !_isShow() ) return;
		
		var x = (size.cx - m_dlgsize.cx) / 2;
		m_dlg.setPosition({x:x, y:0});
	};
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		
		_createDlg();
		_setBtnType();
		_setCallers();
		_setListItems();
		_initInputLength();
	};
	
	var _isShow = function(){
		if ( !m_dlg ) return false; 
		return m_dlg.isShow();
	};	
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal : false,
				pos : {x:'center', y:0},
				uiback:uiback.dlg.noborder
			});
		m_g.getGUI().initDlg(m_dlg, uicfg.createrole, m_items);	
	};
	
	var _setBtnType = function(){
		m_items.randName.setType(BTN_TYPE.DELAY);
		m_items.randName.setDelay(C_RANDNAMEDELAY);
	};
	
	var _setCallers = function(){
		m_items.list.setCaller({self:m_this, caller:_onClickList});
		m_items.entergame.setCaller({self:m_this, caller:_onClickEnterGame});
		m_items.randName.setCaller({self:m_this, caller:_onClickGetRandName});
		_setListItemBtnCallers();
	};
	
	var _setListItemBtnCallers = function(){
		for (var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			item.exsubs.selectIcon.setId(i);
			item.exsubs.selectIcon.setCaller({self:m_this, caller:_onClickSelectIconBtn});
		}
	};
	
	var _setListItems = function(){
		for (var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			var iconIdx = Math.floor(Math.random()*res_role_icons.length);
			var iconId = res_role_icons[iconIdx].icon[i];
			_setListItemIcon(item, iconId);
		}
	};
	
	var _setListItemIcon = function(item, iconId){
		item.exsubs.iconId = iconId;
		var itemres = ItemResUtil.findItemres(item.exsubs.iconId); 
		IMG.setBKImage(item.exsubs.icon, IMG.makeBigImg(itemres.bigpic));
	};
	
	var _initInputLength = function(){
		InputLimit.maxGBKBytes(m_items.rolename, JVALID.getMaxUserLen(), Caller.snew(m_this, _onRoleNameChange));
	};
	
	var _initInfo = function(){
		m_items.list.setCurSel(0);
		TQ.setTextEx(m_items.namedesc, TQ.formatColorStr(rstr.createroledlg.err.empty, COLORS.INVALID_ROLE_NAME) );
	};
	
	var _showDlg = function(){
		m_dlg.show();
	};
	
	var _doCheckNameValid = function(){
		m_isvalidrole = false;
		var bytes = UnicodeStr.gbkLen(m_items.rolename.value);
		if ( bytes == 0 ){
			TQ.setTextEx(m_items.namedesc, TQ.formatColorStr(rstr.createroledlg.err.empty, COLORS.INVALID_ROLE_NAME));
		} else if (bytes < JVALID.getMinUserLen() || bytes > JVALID.getMaxUserLen() ) {
			TQ.setTextEx(m_items.namedesc, TQ.formatColorStr(rstr.createroledlg.err.errlength, COLORS.INVALID_ROLE_NAME));
		} else if (!JVALID.checkUsername(m_items.rolename.value)){
			TQ.setTextEx(m_items.namedesc, TQ.formatColorStr(rstr.createroledlg.err.invalidchar, COLORS.INVALID_ROLE_NAME));
		} else{
			CreateRoleSender.sendCheckName(m_g, m_items.rolename.value);
		}
	};
	
	var _onRoleNameChange = function(){
		if (m_lastRoleName != m_items.rolename.value) {
			m_lastRoleName = m_items.rolename.value;
			_doCheckNameValid();
		}			
	};

	var _onSvrPkg = function(netevent){
		var netdata = netevent.data;
		if ( netdata.subid == 0 ){
			m_this.openDlg();
		}
		else if ( netdata.subid == 1 ){
			_onSvrValidCheck(netdata);
		}
		else if ( netdata.subid == 2 ){
			_setRoleName(netdata.randname);
		}
		else if ( netdata.subid == 99 ){
			_onFinishCreate(netdata);
		}
	};
	
	var _onSvrValidCheck = function(netdata){
		m_isvalidrole = false;
		if ( netdata.result == 'OK' ) {
			TQ.setTextEx(m_items.namedesc, TQ.formatColorStr(rstr.createroledlg.err.okname, COLORS.VALID_ROLE_NAME));
			m_isvalidrole = true;
		}
		else {
			TQ.setTextEx(m_items.namedesc, TQ.formatColorStr(netdata.result, COLORS.INVALID_ROLE_NAME));
			m_items.entergame.enable(true);
		}
	};
	
	var _setRoleName = function(randname){
		m_items.rolename.value = randname;
		CreateRoleSender.sendCheckName(m_g, randname);
	};
	
	var _onFinishCreate = function(netdata){
		if ( netdata.result == 0 ) {
			m_dlg.hide();
			m_g.getImgr().setFirstCreateGame(true);
		} else {
			m_items.entergame.enable(true);
		}
	};
	
	var _onClickList = function(e, idx){
		for (var i=0; i<m_items.list.getCount(); ++i ) {
			if ( i == idx ) {
				m_items.list.getItem(i).exsubs.selectIcon.show();
			} else {
				m_items.list.getItem(i).exsubs.selectIcon.hide();
			}
		}
	};
	
	var _onClickGetRandName = function(){
		CreateRoleSender.sendGetRandName(m_g, m_items.list.getCurSel());
	};
	
	var _onClickEnterGame = function(){
		if ( m_isvalidrole ){
			CreateRoleSender.sendCreateRole(m_g, m_items.rolename.value, _getCurSelIcon());
			m_items.entergame.enable(false);
		}
	};
	
	var _onClickSelectIconBtn = function(idx){
		var item = m_items.list.getItem(idx);
		var _onSelectIconCallback = function(iconId){
			_setListItemIcon(item, iconId);
		};
		
		var dlg = UIM.getDlg('selecticon');
		dlg.setCaller({self:m_this, caller:_onSelectIconCallback});
		
		var icons = [];
		for ( var i=0; i<res_role_icons.length; ++i ) {
			icons.push(res_role_icons[i].icon[idx]);
		}
		dlg.openDlg(icons, item.exsubs.iconId);
	};

	var _getCurSelIcon = function(){
		var curIdx = m_items.list.getCurSel();
		return m_items.list.getItem(curIdx).exsubs.iconId;
	};
	//CreateRoleDlg-unittest-end
});
