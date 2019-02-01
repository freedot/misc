/*******************************************************************************/
FieldUtil = Class.extern(function(){
	this.init = function(){
		this.cityIdMapResId = {};
		this.cityIdMapResId[1] = 9900001;
		this.cityIdMapResId[2] = 9900002;
		this.cityIdMapResId[3] = 9900003;
		this.cityIdMapResId[4] = 9900004;
	};
	
	this.getPosByGridId = function(gridId){
		var idx = gridId - 1;
		var pos = {x:0, y:0};
		pos.x = Math.floor(idx % C_OUTFIELD_ROW_GRIDS);
		pos.y = Math.floor(idx / C_OUTFIELD_ROW_GRIDS);
		return pos;
	};
	
	this.getGridIdByPos = function(pos){
		return pos.y*C_OUTFIELD_ROW_GRIDS + pos.x + 1;
	};
	
	this.getCityResIdByGridId = function(gridId){
		var pos = this.getPosByGridId(gridId);
		var cityId = 1;
		for ( var i=4; i>=1; --i ) {
			if ( this._isInRects(res_maprects[i], pos) ) {
				cityId = i;
				break;
			}
		}
		return this.cityIdMapResId[cityId];
	};
	
	this.getCityResIdByPos = function(pos){
		var gridId = this.getGridIdByPos(pos);
		return this.getCityResIdByGridId(gridId);
	};
	
	this.getCityNameByGridId = function(gridId){
		var cityResId = this.getCityResIdByGridId(gridId);
		var res = ItemResUtil.findItemres(cityResId);
		if ( !res ) return '';
		
		return res.name;
	};

	
	this.getFieldName = function(field){
		if (field.objType == OBJ_TYPE.ROLE){
			return rstr.comm.cityfield;
		} else if (field.objType == OBJ_TYPE.NPCFIELD){
			return rstr.comm.npcfield;
		} else if (field.objType == OBJ_TYPE.NONE){
			return rstr.comm.emptyfield;
		} else{
			var res = ItemResUtil.findItemres(field.resid);
			return TQ.format(rstr.comm.flevelsomething, field.level, res.name);
		}
	};
	
	this.makeFieldFromSelfField = function(selfField){
		return {gridId:selfField.id, resid:selfField.resid, level:selfField.level, objType:OBJ_TYPE.FIELD};
	};
	
	this._isInRects = function(rects, pos){
		for (var i = 0; i < rects.length; ++i) {
			var rect = rects[i];
			if ((pos.x >= rect[0] && pos.x < rect[2])
					&& (pos.y >= rect[1] && pos.y < rect[3])) {
				return true;
			}
		}
		return false;
	};
}).snew();

EmptyFieldDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g=null;
	_lc_.m_this=null;
	_lc_.m_field=null;
	_lc_.m_dlg=null;
	_lc_.m_items={};
	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
	};
	
	this.openDlg = function(field){
		_lc_.m_field = field;
		UIM.closeAllFieldDlg();
		_lc_._initDlg();
		_lc_._openDlg();
		_lc_._initInfo();
	};
	
	this.closeDlg = function(){
		if (!_lc_.m_dlg) return;
		_lc_.m_dlg.hide();
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ){
			return;
		}
		
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:false,
				title:rstr.field.emptyfielddlg.title,
				pos:{x:'center', y:50} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.field.emptyfielddlg, _lc_.m_items);
		
		_lc_._setCallers();
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.favoriteBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickFavoriteBtn});
		_lc_.m_items.transferBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickTransferBtn});
	};	
	
	_lc_._openDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		var pos = FieldUtil.getPosByGridId(_lc_.m_field.gridId);
		var cityResId = FieldUtil.getCityResIdByGridId(_lc_.m_field.gridId);
		var res = ItemResUtil.findItemres(cityResId);
		var cityNamePos = TQ.format(rstr.field.emptyfielddlg.lbl.cityNamePos, res.name, pos.x, pos.y);
		TQ.setTextEx(_lc_.m_items.cityNamePos, cityNamePos);
	};
	
	_lc_._onClickFavoriteBtn = function(){
		MilitarySender.sendAddFavorite(_lc_.m_g, _lc_.m_field.gridId);
	};
	
	_lc_._onClickTransferBtn = function(){
		var itemres = _lc_.m_g.getImgr().getItemResByEffect(RES_EFF.SETPOS_MOVECITY);
		var hasNumber = _lc_.m_g.getImgr().getItemNumByResId(itemres.id);
		if (hasNumber == 0){
			var msg = RStrUtil.makeNoItemBuyMsg(_lc_.m_g, itemres.id, 1);
			_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_CLOSE, null);
			return;
		}
		
		var _onTransfer = function(id) {
			if ( id == MB_IDYES ) {
				var item = {id:0, resid:itemres.id};
				var pos = FieldUtil.getPosByGridId(_lc_.m_field.gridId);
				UseItemSender.send(_lc_.m_g, item, 1, {type:itemres.targets[0], posX:pos.x, posY:pos.y});
				OutFieldSender.sendRefreshFieldsByLastViewPos(_lc_.m_g);
				_lc_.m_dlg.hide();
			}
		};
		
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, 
			rstr.field.emptyfielddlg.lbl.confirmTran,  
			MB_F_YESNO, {self:this, caller:_onTransfer} );
	};
	//EmptyFieldDlg-unittest-end
});
