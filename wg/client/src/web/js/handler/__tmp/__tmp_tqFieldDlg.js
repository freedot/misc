/*******************************************************************************/
ExpedUtil = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	this.expedTo = function(field){
		UIM.getDlg('expedition').openDlg(this.makeExpedTarget(field));
	};	
	
	this.makeExpedTarget =function(field){
		if (!field) return null;
		
		if (field.objType == OBJ_TYPE.ROLE) {
			return _lc_._makeRoleTarget(field);
		}
		else if (field.objType == OBJ_TYPE.FIELD){
			return _lc_._makeFieldTarget(field);
		}
		else if (field.objType == OBJ_TYPE.COPYFIELD){
			return _lc_._makeCopyFieldTarget(field);
		}
		else {
			return null;
		}
	};
	
	_lc_._makeRoleTarget = function(field){
		var pos = FieldUtil.getPosByGridId(field.gridId);
		return {id:field.roleId, roleId:field.roleId, type:field.objType, resid:0, name:field.roleName, pos:pos, alliance:field.alliance, fightcap:'--', sfightcap:'--'};
	};
	
	_lc_._makeFieldTarget = function(field){
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
			target.fightcap = _lc_._calcFightCaps(fieldRes.heros);
			target.sfightcap = _lc_._calcSingleFightCaps(fieldRes.heros);
		}
		return target;
	};
	
	_lc_._makeCopyFieldTarget = function(field){
		var target = field;
		target.pos = {x:0, y:0};
		target.resid = target.id;
		target.fightcap = _lc_._calcFightCaps(target.heros);
		target.sfightcap = _lc_._calcSingleFightCaps(target.heros);
		target.type = OBJ_TYPE.COPYFIELD;
		return target;
	};
	
	_lc_._calcFightCaps = function(heroIds) {
		var fightCaps = 0;
		for ( var i=0; i<heroIds.length; ++i ) {
			var heroId = heroIds[i];
			if ( heroId == 0 ) continue;
			
			var heroRes = ItemResUtil.findItemres(heroId);
			fightCaps += heroRes.fightcap;
		}
		
		return fightCaps;
	};
	
	_lc_._calcSingleFightCaps = function(heroIds){
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
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_btnCount = 3;
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_field = null;
	_lc_.m_dlg = null;
	_lc_.m_opHdr = null;
	_lc_.m_items = {};
	
	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
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
	
	_lc_._initParam = function(field){
		_lc_.m_field = field;
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ){
			return;
		}
		
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:false, title:'...', pos:{x:'center', y:50} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.field.fielddlg, _lc_.m_items);		
	};
	
	_lc_._openDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		_lc_._createOpHdr();
		_lc_._setTitle();
		_lc_._updateInfo();
	};
	
	_lc_._createOpHdr = function(){
		if (!_lc_.m_field.roleId){
			_lc_.m_opHdr = NoOwnerFieldOpHdr.snew(_lc_.m_g, _lc_.m_this, _lc_.m_btnCount, _lc_.m_items, _lc_.m_field);
		}
		else if (_lc_.m_g.getImgr().isSameRole(_lc_.m_field.roleName)){
			_lc_.m_opHdr = SelfFieldOpHdr.snew(_lc_.m_g, _lc_.m_this, _lc_.m_btnCount, _lc_.m_items, _lc_.m_field);
		}
		else if (_lc_.m_g.getImgr().isSameAlliance(_lc_.m_field.alliance.uid) ){
			_lc_.m_opHdr = AlliFieldOpHdr.snew(_lc_.m_g, _lc_.m_this, _lc_.m_btnCount, _lc_.m_items, _lc_.m_field);
		}
		else {
			_lc_.m_opHdr = OtherOwnerFieldOpHdr.snew(_lc_.m_g, _lc_.m_this, _lc_.m_btnCount, _lc_.m_items, _lc_.m_field);
		}
	};
	
	_lc_._setTitle = function(){
		_lc_.m_dlg.setTitle( FieldUtil.getFieldName(_lc_.m_field) );
	};
	
	_lc_._updateInfo = function(){
		_lc_._setCityNamePos();
		_lc_._setFieldDesc();
		_lc_._setRoleAndAlliacne();
	};
	
	_lc_._setCityNamePos = function(){
		var pos = FieldUtil.getPosByGridId(_lc_.m_field.gridId);
		var cityResId = FieldUtil.getCityResIdByGridId(_lc_.m_field.gridId);
		var res = ItemResUtil.findItemres(cityResId);
		var cityNamePos = TQ.format(rstr.field.emptyfielddlg.lbl.cityNamePos, res.name, pos.x, pos.y);
		TQ.setTextEx(_lc_.m_items.cityNamePos, cityNamePos);
	};
	
	_lc_._setFieldDesc = function(){
		var s = TQ.format( rstr.field.fielddlg.lbl.desc, 
			FieldUtil.getFieldName(_lc_.m_field), 
			_lc_._getFieldGetResDesc(), 
			_lc_._getFieldGetItemsDesc() );
		TQ.setTextEx(_lc_.m_items.desc, s);
	};
	
	_lc_._getFieldGetResDesc = function(){
		var levelRes = ItemResUtil.findFieldLevelres(_lc_.m_field.resid, _lc_.m_field.level);
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
	
	_lc_._getFieldGetItemsDesc = function(){
		var levelRes = ItemResUtil.findFieldLevelres(_lc_.m_field.resid, _lc_.m_field.level);
		return DropItemUtil.getProItemsDesc(levelRes.peardropid);
	};
	
	_lc_._setRoleAndAlliacne = function(){
		TQ.setTextEx(_lc_.m_items.role, _lc_.m_field.roleName ? _lc_.m_field.roleName : rstr.comm.norole);
		TQ.setTextEx(_lc_.m_items.alliance, (_lc_.m_field.alliance && _lc_.m_field.alliance.name) ? _lc_.m_field.alliance.name : rstr.comm.noalli);
	};
	
	//FieldDlg-unittest-end
});
