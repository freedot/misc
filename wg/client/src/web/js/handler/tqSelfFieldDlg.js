/*******************************************************************************/
SelfFieldsHdr = Class.extern(function(){
	//SelfFieldsHdr-unittest-start
	var m_g = null;
	var m_this = null;
	this.init = function(g){
        m_g = g;
        m_this = this;
		_regEvents();
    };
	
	var _regEvents = function(){
        m_g.regEvent(EVT.LOGIN_OK, 0, m_this, _onLoginOk);
        m_g.regEvent(EVT.NET, NETCMD.SELFFIELD, m_this, _onSvrPkg);		
	};
	
	var _onLoginOk = function(){
		SelfFieldSender.sendGetAllSelfFields(m_g);
	};
	
	var _onSvrPkg = function(netevent){
		var netdata = netevent.data;
		if (netdata.selffields) {
			TQ.dictCopy(m_g.getImgr().getSelfFields().list, netdata.selffields);
			m_g.sendEvent({eid:EVT.SELFFIELD_UPDATE,sid:0});
		}
	};
	//SelfFieldsHdr-unittest-end
});
	
SelfFieldDlg = Class.extern(function(){
	//SelfFieldDlg-unittest-start
	var m_g = null;
	var m_this = null;
	var m_field = null;
	var m_dlg = null;
	var m_items = {};

	this.init = function(g){
		m_g = g;
		m_this = this;
		_regEvents();
	};	
	
	this.openDlg = function(field){
		UIM.closeAllFieldDlg();
		_initParam(field);
		_initDlg();
		_openDlg();
		_initInfo();
	};
	
	this.closeDlg = function(){
		if (!m_dlg) return;
		m_dlg.hide();
	};
	
	var _regEvents = function(){
		m_g.regEvent(EVT.SELFFIELD_UPDATE, 0, m_this, _onSelfFieldUpdate);
		m_g.regEvent(EVT.PERSONAL_ARMY_UPDATE, 0, m_this, _onSelfFieldUpdate);
	};
	
	var _initParam = function(field){
		m_field = field;
	};
	
	var _initDlg = function(){
		if ( m_dlg ){
			return;
		}
		
		m_dlg = Dialog.snew(m_g,{modal:false, title:rstr.field.selffielddlg.title, pos:{x:'center', y:50} });
		m_g.getGUI().initDlg(m_dlg, uicfg.field.selffielddlg, m_items);
		_setCallers();
	};
	
	var _setCallers = function(){
		m_dlg.setCaller({self:m_this, caller:_onDlgEvent});
		m_items.callbackBtn.setCaller({self:m_this, caller:_onClickCallBack});
		m_items.dispatchBtn.setCaller({self:m_this, caller:_onClickDispatch});
		m_items.startOrStopBtn.setCaller({self:m_this, caller:_onClickStartOrStop});
		m_items.giveUpBtn.setCaller({self:m_this, caller:_onClickGiveUp});
	};
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		_firstGetCanGetRes();
		_startUpdater();
		_setFieldNameAndPos();
		_setArmyInfo();
		_setCollectedTime();
		_setCanGetRes();
		_setStartOrStopBtnName();
		_setBtnsEnableState();
	};
	
	var _firstGetCanGetRes = function(){
		SelfFieldSender.sendGetCanGetRes(m_g, m_field.gridId);		
	};
	
	var _startUpdater = function(){
		m_g.regUpdater(m_this, _onUpdate, 1000);
		m_g.regUpdater(m_this, _onUpdateSendCmd, 30000);
	};

	var _setFieldNameAndPos = function(){
		var fieldPos = FieldUtil.getPosByGridId(m_field.gridId);
		var sfieldName = FieldUtil.getFieldName(m_field);
		var sfieldPos = ' (' + fieldPos.x + ', ' + fieldPos.y + ')';
		TQ.setTextEx(m_items.fieldName, sfieldName + sfieldPos);
	};
	
	var _setArmyInfo = function(){
		var hero = SelfFieldUtil.getCurDispatchHero(m_field);
		if (!hero){
			TQ.setTextEx(m_items.armyInfo, '');
			return;
		}
		
		var s = TQ.format(rstr.field.selffielddlg.lbl.armyInfo,
			hero.name, hero.level,
			RStrUtil.getSoldierNameByResId(hero.soldier.resid), hero.soldier.number);
		TQ.setTextEx(m_items.armyInfo, s);
	};
	
	var _setCollectedTime = function(){
		var selfField = m_g.getImgr().getSelfFieldByGridId(m_field.gridId);
		if (!selfField || !selfField.startTime) {
			TQ.setTextEx(m_items.collectedTime, '');
			return;
		}
		
		var duration = m_g.getSvrTimeS() - selfField.startTime;
		duration = Math.clamp(duration, 0, res_max_collect_time);
		TQ.setTextEx( m_items.collectedTime, TQ.formatTime(0, duration) );
	};
	
	var _setCanGetRes = function(){
		var selfField = m_g.getImgr().getSelfFieldByGridId(m_field.gridId);
		if (!selfField || !selfField.canGetRes) {
			TQ.setTextEx(m_items.canGetRes, '0');
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
		
		TQ.setTextEx(m_items.canGetRes, s);
	};
	
	var _setStartOrStopBtnName = function(){
		var btnText = '';
		var selfField = m_g.getImgr().getSelfFieldByGridId(m_field.gridId);
		if (!selfField || !selfField.startTime) {
			btnText = rstr.field.selffielddlg.btn.start;
		}
		else {
			btnText = rstr.field.selffielddlg.btn.stop;
		}
		m_items.startOrStopBtn.setText(btnText);
	};
	
	var _setBtnsEnableState = function(){
		m_items.callbackBtn.enable( SelfFieldUtil.hasArmyDispatched(m_field) ? true : false );
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			m_g.unregUpdater(m_this, _onUpdate);
			m_g.unregUpdater(m_this, _onUpdateSendCmd);
		}
	};
	
	var _onSelfFieldUpdate = function(){
		if ( !_isShow() ) return;
		
		_setArmyInfo();
		_setCollectedTime();
		_setCanGetRes();
		_setStartOrStopBtnName();
		_setBtnsEnableState();
	};
	
	var _onUpdate = function(){
		_setCollectedTime();
	};
	
	var _onUpdateSendCmd = function(){
		SelfFieldSender.sendGetCanGetRes(m_g, m_field.gridId);
	};
	
	var _onClickCallBack = function(){
		var _onCallbackArmy = function(id) {
			if ( id == MB_IDYES ) SelfFieldSender.sendRecallArmy(m_g, m_field.gridId);
		};
		m_g.getGUI().msgBox(rstr.comm.msgts, rstr.military.opdlg.lbl.confirmCallBack,  MB_F_YESNO, {self:m_this, caller:_onCallbackArmy} );
	};
	
	var _onClickDispatch = function(){
		if (SelfFieldUtil.hasArmyDispatched(m_field)) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100057].msg);
			return;
		}
		
		ExpedUtil.expedTo(m_field);
	};
	
	var _onClickStartOrStop = function(){
		var selfField = m_g.getImgr().getSelfFieldByGridId(m_field.gridId);
		if (!selfField || !selfField.startTime) {
			_onClickStart();
		}
		else{
			_onClickStop();
		}
	};
	
	var _onClickStart = function(){
		if (!SelfFieldUtil.hasArmyDispatched(m_field)) {
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100058].msg);
			return;
		}
		
		if (!SelfFieldUtil.hasSoldiersDispatched(m_field)){
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.ids[100056].msg);
			return;
		}
		
		SelfFieldSender.sendStartCollect(m_g, m_field.gridId);
	};
	
	var _onClickStop = function(){
		SelfFieldSender.sendStopCollect(m_g, m_field.gridId);
	};
	
	var _onClickGiveUp = function(){
		var _onCallbackGiveUp = function(id) {
			if ( id == MB_IDYES ) SelfFieldSender.sendGiveUpField(m_g, m_field.gridId);
		};
		m_g.getGUI().msgBox(rstr.comm.msgts, rstr.field.selffielddlg.lbl.confirmGiveup,  MB_F_YESNO, {self:m_this, caller:_onCallbackGiveUp} );
	};
	
	var _isShow = function(){
		if (!m_dlg) return false;
		
		return m_dlg.isShow();
	};
	//SelfFieldDlg-unittest-end
});
