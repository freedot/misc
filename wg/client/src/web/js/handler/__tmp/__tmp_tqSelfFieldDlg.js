/*******************************************************************************/
SelfFieldsHdr = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	this.init = function(g){
        _lc_.m_g = g;
        _lc_.m_this = this;
		_lc_._regEvents();
    };
	
	_lc_._regEvents = function(){
        _lc_.m_g.regEvent(EVT.LOGIN_OK, 0, _lc_.m_this, _lc_._onLoginOk);
        _lc_.m_g.regEvent(EVT.NET, NETCMD.SELFFIELD, _lc_.m_this, _lc_._onSvrPkg);		
	};
	
	_lc_._onLoginOk = function(){
		SelfFieldSender.sendGetAllSelfFields(_lc_.m_g);
	};
	
	_lc_._onSvrPkg = function(netevent){
		var netdata = netevent.data;
		if (netdata.selffields) {
			TQ.dictCopy(_lc_.m_g.getImgr().getSelfFields().list, netdata.selffields);
			_lc_.m_g.sendEvent({eid:EVT.SELFFIELD_UPDATE,sid:0});
		}
	};
	//SelfFieldsHdr-unittest-end
});
	
SelfFieldDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_field = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};

	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_._regEvents();
	};	
	
	this.openDlg = function(field){
		UIM.closeAllFieldDlg();
		_lc_._initParam(field);
		_lc_._initDlg();
		_lc_._openDlg();
		_lc_._initInfo();
	};
	
	this.closeDlg = function(){
		if (!_lc_.m_dlg) return;
		_lc_.m_dlg.hide();
	};
	
	_lc_._regEvents = function(){
		_lc_.m_g.regEvent(EVT.SELFFIELD_UPDATE, 0, _lc_.m_this, _lc_._onSelfFieldUpdate);
		_lc_.m_g.regEvent(EVT.PERSONAL_ARMY_UPDATE, 0, _lc_.m_this, _lc_._onSelfFieldUpdate);
	};
	
	_lc_._initParam = function(field){
		_lc_.m_field = field;
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ){
			return;
		}
		
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:false, title:rstr.field.selffielddlg.title, pos:{x:'center', y:50} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.field.selffielddlg, _lc_.m_items);
		_lc_._setCallers();
	};
	
	_lc_._setCallers = function(){
		_lc_.m_dlg.setCaller({self:_lc_.m_this, caller:_lc_._onDlgEvent});
		_lc_.m_items.callbackBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickCallBack});
		_lc_.m_items.dispatchBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickDispatch});
		_lc_.m_items.startOrStopBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickStartOrStop});
		_lc_.m_items.giveUpBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickGiveUp});
	};
	
	_lc_._openDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		_lc_._firstGetCanGetRes();
		_lc_._startUpdater();
		_lc_._setFieldNameAndPos();
		_lc_._setArmyInfo();
		_lc_._setCollectedTime();
		_lc_._setCanGetRes();
		_lc_._setStartOrStopBtnName();
		_lc_._setBtnsEnableState();
	};
	
	_lc_._firstGetCanGetRes = function(){
		SelfFieldSender.sendGetCanGetRes(_lc_.m_g, _lc_.m_field.gridId);		
	};
	
	_lc_._startUpdater = function(){
		_lc_.m_g.regUpdater(_lc_.m_this, _lc_._onUpdate, 1000);
		_lc_.m_g.regUpdater(_lc_.m_this, _lc_._onUpdateSendCmd, 30000);
	};

	_lc_._setFieldNameAndPos = function(){
		var fieldPos = FieldUtil.getPosByGridId(_lc_.m_field.gridId);
		var sfieldName = FieldUtil.getFieldName(_lc_.m_field);
		var sfieldPos = ' (' + fieldPos.x + ', ' + fieldPos.y + ')';
		TQ.setTextEx(_lc_.m_items.fieldName, sfieldName + sfieldPos);
	};
	
	_lc_._setArmyInfo = function(){
		var hero = SelfFieldUtil.getCurDispatchHero(_lc_.m_field);
		if (!hero){
			TQ.setTextEx(_lc_.m_items.armyInfo, '');
			return;
		}
		
		var s = TQ.format(rstr.field.selffielddlg.lbl.armyInfo,
			hero.name, hero.level,
			RStrUtil.getSoldierNameByResId(hero.soldier.resid), hero.soldier.number);
		TQ.setTextEx(_lc_.m_items.armyInfo, s);
	};
	
	_lc_._setCollectedTime = function(){
		var selfField = _lc_.m_g.getImgr().getSelfFieldByGridId(_lc_.m_field.gridId);
		if (!selfField || !selfField.startTime) {
			TQ.setTextEx(_lc_.m_items.collectedTime, '');
			return;
		}
		
		var duration = _lc_.m_g.getSvrTimeS() - selfField.startTime;
		duration = Math.clamp(duration, 0, res_max_collect_time);
		TQ.setTextEx( _lc_.m_items.collectedTime, TQ.formatTime(0, duration) );
	};
	
	_lc_._setCanGetRes = function(){
		var selfField = _lc_.m_g.getImgr().getSelfFieldByGridId(_lc_.m_field.gridId);
		if (!selfField || !selfField.canGetRes) {
			TQ.setTextEx(_lc_.m_items.canGetRes, '0');
			return;
		}
		
		var s = '';
		var resNames = ['food', 'wood', 'stone', 'iron'];
		for (var i=0; i<resNames.length; ++i ) {
			var name = resNames[i];
			if (!selfField.canGetRes[name]) continue;
			
			if (s != '') s += ' ';
			s += rstr.comm[name];
			s += selfField.canGetRes[name];
		}
		
		TQ.setTextEx(_lc_.m_items.canGetRes, s);
	};
	
	_lc_._setStartOrStopBtnName = function(){
		var btnText = '';
		var selfField = _lc_.m_g.getImgr().getSelfFieldByGridId(_lc_.m_field.gridId);
		if (!selfField || !selfField.startTime) {
			btnText = rstr.field.selffielddlg.btn.start;
		}
		else {
			btnText = rstr.field.selffielddlg.btn.stop;
		}
		_lc_.m_items.startOrStopBtn.setText(btnText);
	};
	
	_lc_._setBtnsEnableState = function(){
		_lc_.m_items.callbackBtn.enable( SelfFieldUtil.hasArmyDispatched(_lc_.m_field) ? true : false );
	};
	
	_lc_._onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			_lc_.m_g.unregUpdater(_lc_.m_this, _lc_._onUpdate);
			_lc_.m_g.unregUpdater(_lc_.m_this, _lc_._onUpdateSendCmd);
		}
	};
	
	_lc_._onSelfFieldUpdate = function(){
		if ( !_lc_._isShow() ) return;
		
		_lc_._setArmyInfo();
		_lc_._setCollectedTime();
		_lc_._setCanGetRes();
		_lc_._setStartOrStopBtnName();
		_lc_._setBtnsEnableState();
	};
	
	_lc_._onUpdate = function(){
		_lc_._setCollectedTime();
	};
	
	_lc_._onUpdateSendCmd = function(){
		SelfFieldSender.sendGetCanGetRes(_lc_.m_g, _lc_.m_field.gridId);
	};
	
	_lc_._onClickCallBack = function(){
		var _onCallbackArmy = function(id) {
			if ( id == MB_IDYES ) SelfFieldSender.sendRecallArmy(_lc_.m_g, _lc_.m_field.gridId);
		};
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rstr.military.opdlg.lbl.confirmCallBack,  MB_F_YESNO, {self:_lc_.m_this, caller:_onCallbackArmy} );
	};
	
	_lc_._onClickDispatch = function(){
		if (SelfFieldUtil.hasArmyDispatched(_lc_.m_field)) {
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100057].msg);
			return;
		}
		
		ExpedUtil.expedTo(_lc_.m_field);
	};
	
	_lc_._onClickStartOrStop = function(){
		var selfField = _lc_.m_g.getImgr().getSelfFieldByGridId(_lc_.m_field.gridId);
		if (!selfField || !selfField.startTime) {
			_lc_._onClickStart();
		}
		else{
			_lc_._onClickStop();
		}
	};
	
	_lc_._onClickStart = function(){
		if (!SelfFieldUtil.hasArmyDispatched(_lc_.m_field)) {
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100058].msg);
			return;
		}
		
		if (!SelfFieldUtil.hasSoldiersDispatched(_lc_.m_field)){
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100056].msg);
			return;
		}
		
		SelfFieldSender.sendStartCollect(_lc_.m_g, _lc_.m_field.gridId);
	};
	
	_lc_._onClickStop = function(){
		SelfFieldSender.sendStopCollect(_lc_.m_g, _lc_.m_field.gridId);
	};
	
	_lc_._onClickGiveUp = function(){
		var _onCallbackGiveUp = function(id) {
			if ( id == MB_IDYES ) SelfFieldSender.sendGiveUpField(_lc_.m_g, _lc_.m_field.gridId);
		};
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rstr.field.selffielddlg.lbl.confirmGiveup,  MB_F_YESNO, {self:_lc_.m_this, caller:_onCallbackGiveUp} );
	};
	
	_lc_._isShow = function(){
		if (!_lc_.m_dlg) return false;
		
		return _lc_.m_dlg.isShow();
	};
	//SelfFieldDlg-unittest-end
});
