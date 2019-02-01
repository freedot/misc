/** 角色基本属性面板 */
RoleBasePanel = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var m_g = null;
	var m_this = null;
	var m_tabs = null;
	_lc_.m_items={};
	var m_panel = null;
	var m_lastRoleLevel = -1;
	
	//public:method
	this.init = function(g, panel){
		m_g = g;
		m_this = this;
		m_panel = panel;
		_init();
	};
	
	//private:method
	var _init = function(){
		_createPanel();
		m_g.regEvent(EVT.LOGIN_OK, 0, m_this, _onLoginOk);
		m_g.regEvent(EVT.NET, NETCMD.ROLEBASE, m_this, _lc_._onSvrPkg);
		m_g.regEvent(EVT.ROLEBASE, 2, m_this, _onRoleUpgrade); // level change
	};
	
	var _createPanel = function(){
		m_g.getGUI().initPanel(m_panel, uicfg.rolepanel, _lc_.m_items);
		TQ.addEvent(_lc_.m_items.icon, 'click', _onClickIcon);
		TQ.fixIE6Png(_lc_.m_items.roleback);
		TQ.fixIE6Png(_lc_.m_items.cityflag);
		TQ.fixIE6Png(_lc_.m_items.level);
		_setTipsCallback();
	};
	
	var _setTipsCallback = function(){
		var tipids = ['exp'];
		for ( var i=0; i<tipids.length; ++i ){
			var t = tipids[i];
			var tipid = _lc_.m_items['tooltips'][TIP_PREFIX+t];
			var tip = TTIP.getTipById(tipid);
			tip.setCaller({self:m_this, caller:_lc_._onGetTooltip});
			tip.setData({type:t});
		}
	};
	
	_lc_._updateInfo = function(){
		var imgr = m_g.getImgr();
		var roleres = imgr.getRoleRes();
		if ( !roleres.itemres ) {
			return;
		}
		
		IMG.setBKImage(_lc_.m_items.icon, IMG.makeMidImg(roleres.itemres.bigpic));
		TQ.setHtml(_lc_.m_items.name, RStrUtil.makeXDiamondRoleName(roleres.name, roleres));
		TQ.setTextEx(_lc_.m_items.level, roleres.level);
		TQ.setTextEx(_lc_.m_items.alliance, roleres.alliance.name);
		_lc_.m_items.exp.setRange(imgr.getRoleAttrVal(ATTR.NXP));
		_lc_.m_items.exp.setValue(0,imgr.getRoleAttrVal(ATTR.XP));
		var cityres = ItemResUtil.findItemres(roleres.cityid);
		IMG.setBKImage(_lc_.m_items.cityflag, IMG.makeStateCityFlag(cityres.flagimg));
	};
	
	var _onClickIcon = function(e){
		UIM.openDlg('role');
	};
	
	_lc_._onGetTooltip = function(data){
		var tip = null;
		if ( data.type == 'exp' ){
			var imgr = m_g.getImgr();
			if ( !imgr.isArrivedMaxRoleLevel() ) {
				tip = rstr.comm.attrs.curexp + ':' + imgr.getRoleAttrVal(ATTR.XP) + '<br/>';
				tip += rstr.comm.attrs.nextexp + ':' + imgr.getRoleAttrVal(ATTR.NXP);
			}
			else {
				tip = rstr.comm.fulllevel;
			}
		}
		return tip;
	};
	
	var _onLoginOk = function(){
		// 拉取角色的属性
		var sendmsg = '{cmd='+NETCMD.ROLEBASE+',subcmd=1}';
		m_g.send(null, sendmsg);
	};
	
	_lc_._onSvrPkg = function(netevent){
		var cmdpkg = netevent.data;
		var roleres = m_g.getImgr().getRoleRes();
		if ( cmdpkg.res ){
			TQ.dictCopy(roleres, cmdpkg.res);
			roleres.itemres = ItemResUtil.findItemres(roleres.resid);
			_lc_._updateInfo();
			m_g.sendEvent({eid:EVT.ROLEBASE,sid:0});
			HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
		}
		
		if ( cmdpkg.res && !isNull(cmdpkg.res.introduction)) {
			m_g.sendEvent({eid:EVT.ROLEBASE,sid:1});
		}
		
		if ( cmdpkg.res && cmdpkg.res.level && cmdpkg.res.level > m_lastRoleLevel){
			if (m_lastRoleLevel != -1) {
				m_g.sendEvent({eid:EVT.ROLEBASE,sid:2});
			}
			m_lastRoleLevel = cmdpkg.res.level;
		}
		
		if ( cmdpkg.res && cmdpkg.res.ydInfo ) {
			m_g.sendEvent({eid:EVT.ROLEBASE,sid:3});
		}
		
		if ( cmdpkg.res && cmdpkg.res.bdInfo ) {
			m_g.sendEvent({eid:EVT.ROLEBASE,sid:4});
		}
		
		if ( cmdpkg.res && cmdpkg.res.firsthero == 0 ) {
			FirstRewardHero.snew(m_g).start();
		}
	};
	
	var _onRoleUpgrade = function(){
		var size = {cx:308, cy:70};
		var clientSize = m_g.getWinSizer().getValidClientSize();
		var cfg = {
			parent : TQ.getUiBody(),
			size : size,
			imageClass : 'role_upgrade_effect',
			zorder : UI_ZORDER_SCREEN_EFFECT + 2,
			pos :{x:(clientSize.cx - size.cx)/2, y:(clientSize.cy - size.cy)/2}
		};
		m_g.getEntityfactory().playImageEffect(cfg);		
	};

	//RoleBasePanel-unittest-end
});
