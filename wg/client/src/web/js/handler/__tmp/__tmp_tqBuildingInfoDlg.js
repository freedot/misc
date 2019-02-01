/*******************************************************************************/
BuildingOpMgr = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var m_g=null;
	var m_this=null;
	_lc_.m_nullOpHdr=null;
	var m_opHdrs=[];

	this.init = function(g){
		m_g = g;
		m_this = this;
		_lc_.m_nullOpHdr = BuildingInfoNullOpHdr.snew(m_g);
		m_opHdrs[ALLBUILDSGROUP_TYPE.CITY] = BuildingInfoCityOpHdr.snew(m_g);
		m_opHdrs[ALLBUILDSGROUP_TYPE.ALLI] = BuildingInfoAlliOpHdr.snew(m_g);
		m_opHdrs[ALLBUILDSGROUP_TYPE.CULTURE] = BuildingInfoCultureOpHdr.snew(m_g);
	};
	
	this.getStateName = function(item, groupIdx){
		var type = m_g.getImgr().getTypeInAllBuildsGroup(groupIdx);
		return _lc_._getHdrByBuildType(type).getStateName(item);
	};
	
	this.opSpeed = function(item, groupIdx){
		var type = m_g.getImgr().getTypeInAllBuildsGroup(groupIdx);
		_lc_._getHdrByBuildType(type).opSpeed(item);
	};
	
	this.opCancel = function(item, groupIdx){
		var type = m_g.getImgr().getTypeInAllBuildsGroup(groupIdx);
		_lc_._getHdrByBuildType(type).opCancel(item);
	};
	
	_lc_._getHdrByBuildType = function(type){
		var hdr = m_opHdrs[type];
		if (!hdr) return _lc_.m_nullOpHdr;
		return hdr;
	};	
	//BuildingOpMgr-unittest-end
});

BuildingInfoNullOpHdr = Class.extern(function(){
	this.opSpeed = function(item){};
	this.opCancel = function(item){};
	this.getStateName = function(item){ return ''; };
});

BuildingInfoCityOpHdr = Class.extern(function(){
	this.opSpeed = function(item){
		UIM.getPanel('inbuild').opSpeed(item);
	};
	
	this.opCancel = function(item){
		UIM.getPanel('inbuild').opCancel(item);
	};
	
	this.getStateName = function(item){ 
		if ( item.level == 0 ) {
			return rstr.comm.buildstates[BUILD_STATE.BUILD];
		} else {
			return rstr.comm.buildstates[item.state];
		}
	};
});

BuildingInfoAlliOpHdr = Class.extern(function(){
	this.opSpeed = function(item){};
	this.opCancel = function(item){};
	this.getStateName = function(item){ 
		if ( item.level == 0 ) {
			return rstr.comm.buildstates[BUILD_STATE.BUILD];
		}
		else {
			return rstr.comm.buildstates[item.state];
		}
	};
});

BuildingInfoCultureOpHdr = Class.extern(function(){
	this.opSpeed = function(item){
		UIM.getDlg('culture').opSpeed(item);
	};
	
	this.opCancel = function(item){
		UIM.getDlg('culture').opCancel(item);
	};
	
	this.getStateName = function(item){ 
		return rstr.comm.buildstates[BUILD_STATE.LEARNSKILL];
	};
});

BuildingInfoDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var m_g=null;
	var m_this=null;
	var m_dlg=null;
	var m_items={};
	var m_updater=null;
	var m_buildingOpMgr = null;

	this.init = function(g){
		m_g = g;
		m_this = this;
		m_buildingOpMgr = BuildingOpMgr.snew(g);
	};
	
	this.openDlg = function(){
		_initDlg();
		_initInfo();
		m_dlg.show();
		m_g.regUpdater(m_this, _onUpdate, 1000);
	};
	
	this.hideDlg = function(){
		if ( m_dlg ) m_dlg.hide();
	};
	
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:false
					,title:rstr.inbuild.buildinfo.title
					,pos:{x:"center", y:60}
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.inbuild.buildinginfo, m_items);
			m_dlg.setCaller({self:m_this,caller:_onDlgEvent});
			m_updater = CommBuildUpdater.snew(m_g, {
				list:m_items.list
				,rgroupList:m_g.getImgr().getAllBuildsGroup()
				,opspeed:m_buildingOpMgr.opSpeed
				,opcancel:m_buildingOpMgr.opCancel
				,getStateName:m_buildingOpMgr.getStateName
				,needitems:['name', 'state', 'curlevel', 'goallevel', 'lefttime', 'opbtn']
				});
			m_dlg.hide();
		}
	};
	
	var _initInfo = function(){
		m_updater.update();
	};
	
	var _onUpdate = function(cltTimeMs){
		m_updater.update();
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			m_g.unregUpdater(m_this, _onUpdate);
		}
	};
	//BuildingInfoDlg-unittest-end
});

/** 建筑中追踪对话框 */
BuildingTraceDlg = Class.extern(function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_items={};
	var m_ibuildpanel = null;
	var m_lastPos = {x:600, y:40};

	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.openDlg = function(){
		_initDlg();
		m_dlg.show();
		m_ibuildpanel.show();
		_setPosition();
	};
	
	this.closeDlg = function(){
		m_dlg.hide();
	};
	
	this.setPosition = function(pos){
		_savePosition(pos);
		_setPosition();
	};
	
	this.getSize = function(){
		return {cx:274, cy:160};
	};
	
	this.getCore = function(){
		return m_dlg;
	};
	
	//------------
	//private:method
	//------------
	var _initDlg = function(){
		if ( !m_dlg ){
			m_dlg = Dialog.snew(m_g,{modal:false,
					pos:{x:600, y:40},
					uiback:uiback.dlg.minihelp
				});
			m_g.getGUI().initDlg(m_dlg, uicfg.tracedlg.building, m_items);
			m_ibuildpanel = new IBuildTrace(m_g, m_items);
			m_items.closebtn.setCaller({self:m_this, caller:function(){m_dlg.hide();}});
			m_dlg.setCaller({self:m_this,caller:_onDlgEvent});
		}
	};
	
	var _savePosition = function(pos){
		m_lastPos = pos;
	};
	
	var _setPosition = function(){
		if (!m_dlg || !m_dlg.isShow()) return;
		m_dlg.setPosition(m_lastPos);
	};
	
	var _onDlgEvent = function(id) {
		if ( id == C_SYS_DLG_HIDE && UIM.getPanel('main') ){
			UIM.getPanel('main').notifyTraceClose('building');
			m_ibuildpanel.hide();
		}
	};
});


IBuildTrace = function(){
	var m_g;
	var m_this;
	var m_items;
	var m_updater;
	var m_buildingOpMgr = null;

	this.initialize = function(g, domitems){
		m_g = g;
		m_this = this;
		m_items = domitems;
		m_buildingOpMgr = BuildingOpMgr.snew(g);
		m_updater = CommBuildUpdater.snew(m_g, {
			list:m_items.list
			,firststatefmt:rstr.inbuild.buildstate
			,statefmt:rstr.inbuild.state
			,rgroupList:m_g.getImgr().getAllBuildsGroup()
			,opspeed:m_buildingOpMgr.opSpeed
			,opcancel:m_buildingOpMgr.opCancel
			,needitems:['stop', 'name', 'state', 'levelstate', 'lefttime', 'opbtn']
		});
	};
	
	this.show = function(){
		m_g.regUpdater(m_this, _onUpdate, 1000);
	};
	
	this.hide = function(){
		m_g.unregUpdater(m_this, _onUpdate);
	};
	
	var _onUpdate = function(cltTimeMs){
		m_updater.update();
	};

	this.initialize.apply(this, arguments);
};
