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
	//EmptyFieldDlg-unittest-start
	var m_g=null;
	var m_this=null;
	var m_field=null;
	var m_dlg=null;
	var m_items={};
	this.init = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.openDlg = function(field){
		m_field = field;
		UIM.closeAllFieldDlg();
		_initDlg();
		_openDlg();
		_initInfo();
	};
	
	this.closeDlg = function(){
		if (!m_dlg) return;
		m_dlg.hide();
	};
	
	var _initDlg = function(){
		if ( m_dlg ){
			return;
		}
		
		m_dlg = Dialog.snew(m_g,{modal:false,
				title:rstr.field.emptyfielddlg.title,
				pos:{x:'center', y:50} });
		m_g.getGUI().initDlg(m_dlg, uicfg.field.emptyfielddlg, m_items);
		
		_setCallers();
	};
	
	var _setCallers = function(){
		m_items.favoriteBtn.setCaller({self:m_this, caller:_onClickFavoriteBtn});
		m_items.transferBtn.setCaller({self:m_this, caller:_onClickTransferBtn});
	};	
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		var pos = FieldUtil.getPosByGridId(m_field.gridId);
		var cityResId = FieldUtil.getCityResIdByGridId(m_field.gridId);
		var res = ItemResUtil.findItemres(cityResId);
		var cityNamePos = TQ.format(rstr.field.emptyfielddlg.lbl.cityNamePos, res.name, pos.x, pos.y);
		TQ.setTextEx(m_items.cityNamePos, cityNamePos);
	};
	
	var _onClickFavoriteBtn = function(){
		MilitarySender.sendAddFavorite(m_g, m_field.gridId);
	};
	
	var _onClickTransferBtn = function(){
		var itemres = m_g.getImgr().getItemResByEffect(RES_EFF.SETPOS_MOVECITY);
		var hasNumber = m_g.getImgr().getItemNumByResId(itemres.id);
		if (hasNumber == 0){
			var msg = RStrUtil.makeNoItemBuyMsg(m_g, itemres.id, 1);
			m_g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_CLOSE, null);
			return;
		}
		
		var _onTransfer = function(id) {
			if ( id == MB_IDYES ) {
				var item = {id:0, resid:itemres.id};
				var pos = FieldUtil.getPosByGridId(m_field.gridId);
				UseItemSender.send(m_g, item, 1, {type:itemres.targets[0], posX:pos.x, posY:pos.y});
				OutFieldSender.sendRefreshFieldsByLastViewPos(m_g);
				m_dlg.hide();
			}
		};
		
		m_g.getGUI().msgBox(rstr.comm.msgts, 
			rstr.field.emptyfielddlg.lbl.confirmTran,  
			MB_F_YESNO, {self:this, caller:_onTransfer} );
	};
	//EmptyFieldDlg-unittest-end
});
