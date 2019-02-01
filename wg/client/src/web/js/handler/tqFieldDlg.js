/*******************************************************************************/
ExpedUtil = Class.extern(function(){
	//ExpedUtil-unittest-start
	this.expedTo = function(field){
		UIM.getDlg('expedition').openDlg(this.makeExpedTarget(field));
	};	
	
	this.makeExpedTarget =function(field){
		if (!field) return null;
		
		if (field.objType == OBJ_TYPE.ROLE) {
			return _makeRoleTarget(field);
		}
		else if (field.objType == OBJ_TYPE.FIELD){
			return _makeFieldTarget(field);
		}
		else if (field.objType == OBJ_TYPE.COPYFIELD){
			return _makeCopyFieldTarget(field);
		}
		else {
			return null;
		}
	};
	
	var _makeRoleTarget = function(field){
		var pos = FieldUtil.getPosByGridId(field.gridId);
		return {id:field.roleId, roleId:field.roleId, type:field.objType, resid:0, name:field.roleName, pos:pos, alliance:field.alliance, fightcap:'--', sfightcap:'--'};
	};
	
	var _makeFieldTarget = function(field){
		var res = ItemResUtil.findItemres(field.resid);
		var pos = FieldUtil.getPosByGridId(field.gridId);
		var target = {id:field.gridId, type:field.objType, resid:field.resid, level:field.level, roleId:field.roleId, name:res.name, pos:pos, alliance:field.alliance};
		if (field.roleId > 0){
			target.name += '.' + field.roleName;
			target.fightcap = '--';
			target.sfightcap = '--';
		} else {
			var fieldRes = ItemResUtil.findFieldLevelres(field.resid, field.level);
			target.name += '.' + TQ.format(rstr.comm.flevel, field.level);
			target.fightcap = _calcFightCaps(fieldRes.heros);
			target.sfightcap = _calcSingleFightCaps(fieldRes.heros);
		}
		return target;
	};
	
	var _makeCopyFieldTarget = function(field){
		var target = field;
		target.pos = {x:0, y:0};
		target.resid = target.id;
		target.fightcap = _calcFightCaps(target.heros);
		target.sfightcap = _calcSingleFightCaps(target.heros);
		target.type = OBJ_TYPE.COPYFIELD;
		return target;
	};
	
	var _calcFightCaps = function(heroIds) {
		var fightCaps = 0;
		for ( var i=0; i<heroIds.length; ++i ) {
			var heroId = heroIds[i];
			if ( heroId == 0 ) continue;
			
			var heroRes = ItemResUtil.findItemres(heroId);
			fightCaps += heroRes.fightcap;
		}
		
		return fightCaps;
	};
	
	var _calcSingleFightCaps = function(heroIds){
		for ( var i=0; i<heroIds.length; ++i ) {
			var heroId = heroIds[i];
			if ( heroId == 0 ) continue;
			
			var heroRes = ItemResUtil.findItemres(heroId);
			return heroRes.singlefightcap;
		}
		return 0;
	};	
	//ExpedUtil-unittest-end
}).snew();

BaseFieldOpHdr = Class.extern(function(){
	this.btnCount = 0;
	this.g = null;
	this.dlg = null;
	this.items = null;
	this.field = null;
	this.btnTexts = [];
	this.callers = [];
	
	this.init = function(g, dlg, btnCount, items, field){
		this.setParams(g, dlg, btnCount, items, field);
		this.initBtnsText();
		this.setBtnsText();
		this.initBtnsCaller();
		this.setBtnsCaller();
		this.setAllBtnsVisible();
		this.setSomeBtnsHidden();
	};
	
	this.update = function(){
	};
	
	this.setParams = function(g, dlg, btnCount, items, field){
		this.g = g;
		this.dlg = dlg;
		this.btnCount = btnCount;
		this.items = items;
		this.field = field;
	};	
	
	this.initBtnsText = function(){
		//do nothing
	};
	
	this.setBtnsText = function(){
		for ( var i=0; i<this.btnTexts.length; ++i ){
			this.items['opbtn' + (i+1)].setText( this.btnTexts[i] );
		}
	};	
	
	this.initBtnsCaller = function(){
		//do nothing
	};
	
	this.setBtnsCaller = function(){
		for ( var i=0; i<this.callers.length; ++i ){
			this.items['opbtn' + (i+1)].setCallerEx({self:this, caller:this.callers[i]});
		}
	};	
	
	this.setAllBtnsVisible = function(){
		for ( var i=0; i<this.btnCount; ++i ){
			this.items['opbtn' + (i+1)].visible();
		}
	};	
	
	this.setSomeBtnsHidden = function(){
		//do nothing
	};	
	
	this.onAddFavorite = function(){
		MilitarySender.sendAddFavorite(this.g, this.field.gridId);
	};	
	
	this.onExped = function(){
		ExpedUtil.expedTo(this.field);
		this.dlg.closeDlg();
	};
	
	this.onSendMail = function(){
		UIM.getDlg('writeletter').writeLetterTo(this.field.roleName);
		this.dlg.closeDlg();
	};
	
	this.onTalkTo = function(){
		UIM.getPanel('chat').setChatTarget(this.field.roleName);
		this.dlg.closeDlg();
	};	
	
	this.onAddFriend = function(){
		FriendSender.sendApplyFriend(this.g, this.field.roleName);
	};	
	
	this.onEnterFarm = function(){
		UIM.closeMapPanels();
		UIM.getPanel('farm').open(this.field.roleId);
		this.dlg.closeDlg();
	};	
});

NoOwnerFieldOpHdr = BaseFieldOpHdr.extern(function(){
	this.initBtnsText = function(){
		this.btnTexts = rstr.field.fielddlg.btn.noOwnerField;
	};
	
	this.initBtnsCaller = function(){
		this.callers = [this.onAddFavorite, null, this.onExped];
	};
	
	this.setSomeBtnsHidden = function(){
		this.items.opbtn2.hidden();
	};
});

SelfFieldOpHdr = BaseFieldOpHdr.extern(function(){
	this.initBtnsText = function(){
		this.btnTexts = rstr.field.fielddlg.btn.selfField;
	};
	
	this.initBtnsCaller = function(){
		this.callers = [this.onAddFavorite, this.onEnterSelfField, this.onOpenSelfFieldList];
	};
	
	this.onEnterSelfField = function(){
		var dlg = UIM.getDlg('selffield');
		dlg.openDlg(this.field);
		this.dlg.closeDlg();
	};
	
	this.onOpenSelfFieldList = function(){
		var dlg = UIM.getDlg('selffieldslist');
		dlg.openDlg(this.field);
		this.dlg.closeDlg();
	};
});

AlliFieldOpHdr = BaseFieldOpHdr.extern(function(){
	this.initBtnsText = function(){
		this.btnTexts = rstr.field.fielddlg.btn.alliOwnerField;
	};
	
	this.initBtnsCaller = function(){
		this.callers = [this.onAddFavorite];
	};
	
	this.setSomeBtnsHidden = function(){
		this.items.opbtn2.hidden();
		this.items.opbtn3.hidden();
	};
});

OtherOwnerFieldOpHdr = BaseFieldOpHdr.extern(function(){
	this.initBtnsText = function(){
		this.btnTexts = rstr.field.fielddlg.btn.otherOwnerField;
	};
	
	this.initBtnsCaller = function(){
		this.callers = [this.onAddFavorite, null, this.onExped];
	};
	
	this.setSomeBtnsHidden = function(){
		this.items.opbtn2.hidden();
	};
});

FieldDlg = Class.extern(function(){
	//FieldDlg-unittest-start
	var m_btnCount = 3;
	var m_g = null;
	var m_this = null;
	var m_field = null;
	var m_dlg = null;
	var m_opHdr = null;
	var m_items = {};
	
	this.init = function(g){
		m_g = g;
		m_this = this;
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
	
	var _initParam = function(field){
		m_field = field;
	};
	
	var _initDlg = function(){
		if ( m_dlg ){
			return;
		}
		
		m_dlg = Dialog.snew(m_g,{modal:false, title:'...', pos:{x:'center', y:50} });
		m_g.getGUI().initDlg(m_dlg, uicfg.field.fielddlg, m_items);		
	};
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		_createOpHdr();
		_setTitle();
		_updateInfo();
	};
	
	var _createOpHdr = function(){
		if (!m_field.roleId){
			m_opHdr = NoOwnerFieldOpHdr.snew(m_g, m_this, m_btnCount, m_items, m_field);
		}
		else if (m_g.getImgr().isSameRole(m_field.roleName)){
			m_opHdr = SelfFieldOpHdr.snew(m_g, m_this, m_btnCount, m_items, m_field);
		}
		else if (m_g.getImgr().isSameAlliance(m_field.alliance.uid) ){
			m_opHdr = AlliFieldOpHdr.snew(m_g, m_this, m_btnCount, m_items, m_field);
		}
		else {
			m_opHdr = OtherOwnerFieldOpHdr.snew(m_g, m_this, m_btnCount, m_items, m_field);
		}
	};
	
	var _setTitle = function(){
		m_dlg.setTitle( FieldUtil.getFieldName(m_field) );
	};
	
	var _updateInfo = function(){
		_setCityNamePos();
		_setFieldDesc();
		_setRoleAndAlliacne();
	};
	
	var _setCityNamePos = function(){
		var pos = FieldUtil.getPosByGridId(m_field.gridId);
		var cityResId = FieldUtil.getCityResIdByGridId(m_field.gridId);
		var res = ItemResUtil.findItemres(cityResId);
		var cityNamePos = TQ.format(rstr.field.emptyfielddlg.lbl.cityNamePos, res.name, pos.x, pos.y);
		TQ.setTextEx(m_items.cityNamePos, cityNamePos);
	};
	
	var _setFieldDesc = function(){
		var s = TQ.format( rstr.field.fielddlg.lbl.desc, 
			FieldUtil.getFieldName(m_field), 
			_getFieldGetResDesc(), 
			_getFieldGetItemsDesc() );
		TQ.setTextEx(m_items.desc, s);
	};
	
	var _getFieldGetResDesc = function(){
		var levelRes = ItemResUtil.findFieldLevelres(m_field.resid, m_field.level);
		var s = '';
		var getRess = [{fieldName:'getfood', resName:rstr.comm.food}
			,{fieldName:'getwood', resName:rstr.comm.wood}
			,{fieldName:'getstone', resName:rstr.comm.stone}
			,{fieldName:'getiron', resName:rstr.comm.iron}];
		for (var i=0; i<getRess.length; ++i ) {
			var g = getRess[i];
			if (!levelRes[ g.fieldName ]) continue;
			
			if (s != '') s += ',';
			s += g.resName + levelRes[ g.fieldName ];
		}	
		return s;
	};
	
	var _getFieldGetItemsDesc = function(){
		var levelRes = ItemResUtil.findFieldLevelres(m_field.resid, m_field.level);
		return DropItemUtil.getProItemsDesc(levelRes.peardropid);
	};
	
	var _setRoleAndAlliacne = function(){
		TQ.setTextEx(m_items.role, m_field.roleName ? m_field.roleName : rstr.comm.norole);
		TQ.setTextEx(m_items.alliance, (m_field.alliance && m_field.alliance.name) ? m_field.alliance.name : rstr.comm.noalli);
	};
	
	//FieldDlg-unittest-end
});
