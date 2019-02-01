/*******************************************************************************/
var L_IS_DEBUG = false;
FieldBlock = function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.B_W = C_OUTFIELD_BLOCK_W;
	_lc_.B_H = C_OUTFIELD_BLOCK_H;
	
	_lc_.CITY_W = _lc_.B_W;
	_lc_.CITY_H = 250;
	var BAK_TOP = _lc_.CITY_H - _lc_.B_H;	
	
	_lc_.NAME_W = 90;
	_lc_.NAME_H = 16;
	_lc_.ROLE_NAME_BOTTOMSPACE = 80 - BAK_TOP;
	_lc_.NPC_NAME_BOTTOMSPACE = 80 - BAK_TOP;
	_lc_.FIELD_NAME_BOTTOMSPACE = 80 - BAK_TOP;
	
	_lc_.MYALLIFLAG_W = 24;
	_lc_.MYALLIFLAG_H = 25;
	_lc_.ENEMY_ALLIFLAG_TOPSPACE = 11 + BAK_TOP;
	
	_lc_.SUB_CITYW = 82;
	_lc_.SUB_CITYH = 55;
	_lc_.SUB_TOPSPACE = 14;
	_lc_.SUB_BOTTOMSPACE = 10;
	_lc_.SUB_LEFTSPACE = 40;
	_lc_.SUB_RIGHTSPACE = 40;
		
	_lc_.m_g = null;
	_lc_.m_this = null;
	
	_lc_.m_dom = null;
	_lc_.m_cityDom = null;
	_lc_.m_nameDom = null;
	_lc_.m_mySubCityDoms = [];
	_lc_.m_myAlliFlagDom = null;
	_lc_.m_enemyAlliFlagDom = null;
	var m_debugInfo = null;
	_lc_.m_fieldRefFlag = null;
	
	_lc_.m_blockRes = null;
	
	_lc_.m_worldRect = {x:-20000, y:-20000, w:_lc_.B_W, h:_lc_.B_H};
	_lc_.m_gridId = -1;
	
	this.init = function(g, dom, checkInRectFlag){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_dom = dom;
		TQ.setCSS(_lc_.m_dom, 'height', _lc_.CITY_H + 'px' );
		TQ.setClass(_lc_.m_dom, 'fieldblock');
		_lc_._createDoms();
		_lc_._setDomsPos();
		_lc_._hideAllDoms();
	};
	
	this.clear = function(){
	};
	
	this.isInRect = function(pos){
		var rect = {x:_lc_.m_worldRect.x, y:_lc_.m_worldRect.y+BAK_TOP, w:_lc_.m_worldRect.w, h:_lc_.m_worldRect.h};
		return TQ.isInRect(rect, pos);
	};
	
	this.setItem = function(blockRes){
		_lc_._copyBlockRes(blockRes);
		_lc_._setFieldBackImg();
		_lc_._setCityImg();
	};
	
	this.getItem = function(){
		return _lc_.m_blockRes;
	};
	
	this.show = function(){
		TQ.setCSS(_lc_.m_dom, 'visibility', 'visible');
	};
	
	this.hide = function(){
		TQ.setCSS(_lc_.m_dom, 'visibility', 'hidden');
	};
	
	this.getFieldGridId = function(){
		return _lc_.m_gridId;
	};
	
	this.setFieldGridId = function(gridId){
		_lc_.m_gridId = gridId;
		_lc_._setWorldPos();
		_printDebugInfo();
	};
	
	this.normal = function(){
	};
	
	this.hot = function(){
	};
	
	_lc_._copyBlockRes = function(blockRes){
		_lc_.m_blockRes = {};
		TQ.dictCopy(_lc_.m_blockRes, blockRes);
	};
	
	_lc_._createDoms = function(){
		_lc_.m_cityDom = TQ.createDom('div');
		TQ.append(_lc_.m_dom, _lc_.m_cityDom);
		TQ.setClass(_lc_.m_cityDom, 'cityBuild');
		TQ.setCSS(_lc_.m_cityDom, 'zIndex', 2);
		
		_lc_.m_nameDom = TQ.createDom('div');
		TQ.append(_lc_.m_dom, _lc_.m_nameDom);
		TQ.setClass(_lc_.m_nameDom, 'name');
		TQ.setCSS(_lc_.m_nameDom, 'zIndex', 10);
		
		_lc_.m_myAlliFlagDom = TQ.createDom('div');
		TQ.append(_lc_.m_dom, _lc_.m_myAlliFlagDom);
		TQ.setClass(_lc_.m_myAlliFlagDom, 'myAlliFlag');
		TQ.setCSS(_lc_.m_myAlliFlagDom, 'zIndex', 10);
		
		_lc_.m_enemyAlliFlagDom = TQ.createDom('div');
		TQ.append(_lc_.m_dom, _lc_.m_enemyAlliFlagDom);
		TQ.setClass(_lc_.m_enemyAlliFlagDom, 'enemyAlliFlag');
		TQ.setCSS(_lc_.m_enemyAlliFlagDom, 'zIndex', 10);
		
		_lc_.m_fieldRefFlag = TQ.createDom('div');
		TQ.append(_lc_.m_dom, _lc_.m_fieldRefFlag);
		TQ.setClass(_lc_.m_fieldRefFlag, 'noFieldFlag');
		TQ.setCSS(_lc_.m_fieldRefFlag, 'zIndex', 11);

		if ( L_IS_DEBUG ) {
			m_debugInfo = TQ.createDom('div');
			TQ.append(_lc_.m_dom, m_debugInfo);
			TQ.setDomRect(m_debugInfo, 50, 50, 200,100);
			TQ.setCSS(m_debugInfo, 'zIndex', 100);
		}
		
		var subZIndexs = [1,3,3,1];
		for ( var i=0; i<4; ++i ) {
			var subCityDom = TQ.createDom('div');
			TQ.append(_lc_.m_dom, subCityDom);
			_lc_.m_mySubCityDoms.push(subCityDom);
			TQ.setClass(subCityDom, 'subCity');
			TQ.setCSS(subCityDom, 'zIndex', subZIndexs[i]);
		}
	};
	
	_lc_._setDomsPos = function(){
		_lc_._setCityDomPos();
		_lc_._setRoleCityNamePos();
		_lc_._setMyAlliFlagPos();
		_lc_._setEnemyAlliFlagPos();
		_lc_._setSubCityDomsPos();
	};
	
	_lc_._setCityDomPos = function(){
		TQ.setDomPos( _lc_.m_cityDom, 0, 0 );	
	};
	
	_lc_._setRoleCityNamePos = function(){
		var pos = _lc_._getRoleCityNamePos();
		TQ.setDomPos( _lc_.m_nameDom, pos.x, pos.y);
	};
	
	_lc_._setMyAlliFlagPos = function(){
		var namePos = _lc_._getRoleCityNamePos();
		var myAlliFlagX = namePos.x - _lc_.MYALLIFLAG_W;
		var myAlliFlagY = namePos.y + _lc_.NAME_H - _lc_.MYALLIFLAG_H;
		TQ.setDomPos( _lc_.m_myAlliFlagDom, myAlliFlagX, myAlliFlagY);
	};
	
	_lc_._setEnemyAlliFlagPos = function(){
		var namePos = _lc_._getRoleCityNamePos();
		var enemyAlliFlagX = namePos.x + _lc_.NAME_W;
		var enemyAlliFlagY = _lc_.ENEMY_ALLIFLAG_TOPSPACE;
		TQ.setDomPos( _lc_.m_enemyAlliFlagDom, enemyAlliFlagX, enemyAlliFlagY);	
	};
	
	_lc_._getRoleCityNamePos = function(){
		return _lc_._getNamePosByBottomSpace(_lc_.ROLE_NAME_BOTTOMSPACE);
	};
	
	_lc_._setSubCityDomsPos = function(){
		var innerW = _lc_.B_W - _lc_.SUB_LEFTSPACE - _lc_.SUB_RIGHTSPACE;
		var innerH = _lc_.B_H - _lc_.SUB_TOPSPACE - _lc_.SUB_BOTTOMSPACE;
		
		var offsetX = _lc_.SUB_LEFTSPACE;
		var offsetY = _lc_.SUB_TOPSPACE + BAK_TOP;
		
		var subCitysInnerPos = [
			{x:0, y:0}
			,{x:0, y:innerH - _lc_.SUB_CITYH}
			,{x:innerW - _lc_.SUB_CITYW, y:innerH - _lc_.SUB_CITYH}
			,{x:innerW - _lc_.SUB_CITYW, y:0} ];
		for ( var i=0; i<subCitysInnerPos.length; ++i ){
			TQ.setDomPos( _lc_.m_mySubCityDoms[i], subCitysInnerPos[i].x + offsetX, subCitysInnerPos[i].y + offsetY);
		}
	};
	
	_lc_._hideAllDoms = function(){
		TQ.setCSS(_lc_.m_cityDom, 'display', 'none');
		TQ.setCSS(_lc_.m_nameDom, 'display', 'none');
		TQ.setCSS(_lc_.m_myAlliFlagDom, 'display', 'none');
		TQ.setCSS(_lc_.m_enemyAlliFlagDom, 'display', 'none');
		TQ.setClass(_lc_.m_fieldRefFlag, 'noFieldFlag');
		for ( var i=0; i<4; ++i ) {
			TQ.setCSS(_lc_.m_mySubCityDoms[i], 'display', 'none');
		}
	};
	
	_lc_._setWorldPos = function(){
		var idx = _lc_.m_gridId - 1;
		var colIdx = idx % C_OUTFIELD_ROW_GRIDS;
		var rowIdx = Math.floor(idx / C_OUTFIELD_ROW_GRIDS);
		_lc_._setFieldBackEmptyImg(colIdx, rowIdx);
		_lc_._copyBlockRes(_lc_._newInvalidFieldRes(_lc_.m_gridId));
		_lc_.m_worldRect.x = colIdx * C_OUTFIELD_BLOCK_W;
		_lc_.m_worldRect.y = rowIdx * C_OUTFIELD_BLOCK_H - BAK_TOP;
		TQ.setCSS(_lc_.m_dom, 'zIndex', _lc_.m_worldRect.y);
		TQ.setDomPos(_lc_.m_dom, _lc_.m_worldRect.x, _lc_.m_worldRect.y);
	};
	
	_lc_._newInvalidFieldRes = function(gridId){
		return {gridId:gridId, objType:OBJ_TYPE.INVALID, resid:170005, modelId:17000501};
	};
	
	_lc_._setFieldBackEmptyImg = function(colIdx, rowIdx){
		_lc_._hideAllDoms();
		IMG.setBKImage(_lc_.m_dom, IMG.makeImg('fields/block/17000501.jpg'), '0px ' + BAK_TOP + 'px');
	};
	
	_lc_._setFieldBackImg = function(){
		var modelId = 0;
		if (_lc_.m_blockRes.objType == OBJ_TYPE.FIELD) {
			modelId = _lc_.m_blockRes.modelId;
		}
		else {
			modelId = res_fields[FIXID.PINGDIFIELDID - FIXID.FIRSTFIELDID].models[0];
		}
		
		IMG.setBKImage(_lc_.m_dom, IMG.makeImg('fields/block/' + modelId + '.jpg'), '0px ' + BAK_TOP + 'px');
		_printDebugInfo();
	};
	
	_lc_._setCityImg = function(){
		if (_lc_.m_blockRes.objType == OBJ_TYPE.ROLE) {
			_lc_._setRoleCityImg();
		}
		else if (_lc_.m_blockRes.objType == OBJ_TYPE.NPCFIELD) {
			_lc_._setNpcCityImg();
		}
		else if (_lc_.m_blockRes.objType == OBJ_TYPE.FIELD) {
			_lc_._setFieldImg();
		}
		else if (_lc_.m_blockRes.objType == OBJ_TYPE.NONE) {
			_lc_._setEmptyFieldImg();
		}
		else {
			_lc_._hideAllDoms();
		}
	};	
	
	_lc_._setRoleCityImg = function(){
		_lc_._setCityDomsVisible();
		_lc_._setRoleCityNamePos();
		_lc_._setRoleCityBackImg();
		_lc_._setSubCitysImg();
		_lc_._setRoleName();
		_lc_._setMyAlliFlag();
		_lc_._setEnemyAlliFlag();
	};
	
	_lc_._setCityDomsVisible = function(){
		_lc_._hideAllDoms();
		TQ.setCSS( _lc_.m_cityDom, 'display', 'block' );
		TQ.setCSS( _lc_.m_nameDom, 'display', 'block' );
	};
	
	_lc_._setRoleCityBackImg = function(){
		if ( _lc_.m_blockRes.vip > 0 ) {
			var modelId = Math.ceil(_lc_.m_blockRes.vip/2);
			IMG.setBKImage(_lc_.m_cityDom, IMG.makeImg('fields/rolecity/vip/' + modelId + '.png'));
		} else {
			IMG.setBKImage(_lc_.m_cityDom, IMG.makeImg('fields/rolecity/' + _lc_.m_blockRes.modelId + '.gif'));
		}
	};
	
	_lc_._setSubCitysImg = function() {
		for (var i=0; i<_lc_.m_blockRes.subCitys.length; ++i ){
			var subCityType = _lc_.m_blockRes.subCitys[i];
			var cityResId = CITYTYPE_MAP_RESIDS[subCityType];
			IMG.setBKImage(_lc_.m_mySubCityDoms[i], IMG.makeImg('fields/rolecity/' + cityResId + '.gif'));
			TQ.setCSS(_lc_.m_mySubCityDoms[i], 'display', 'block');
		}
	};
	
	_lc_._setRoleName = function() {
		var fightRefState = _lc_.m_g.getImgr().getFightRefState(_lc_.m_blockRes.roleId);
		if ( fightRefState == REF_ROLESTATE.DECLARING_FIGHT ) {
			TQ.setClass(_lc_.m_nameDom, 'declaring_fight_name');
		} else if ( fightRefState == REF_ROLESTATE.FIGHTING ) {
			TQ.setClass(_lc_.m_nameDom, 'fighting_name');
		} else {
			TQ.setClass(_lc_.m_nameDom, 'role_name');
		}
		TQ.setTextEx(_lc_.m_nameDom, _lc_.m_blockRes.roleName);
	};
	
	_lc_._setMyAlliFlag = function() {
		if (_lc_.m_blockRes.myAlliFlag) {
			TQ.setCSS(_lc_.m_myAlliFlagDom, 'display', 'block');
			TQ.setTextEx(_lc_.m_myAlliFlagDom, _lc_.m_blockRes.myAlliFlag);
		}
	};	
	
	_lc_._setEnemyAlliFlag = function() {
		if (_lc_.m_blockRes.enemyAlliFlag) {
			TQ.setCSS(_lc_.m_enemyAlliFlagDom, 'display', 'block');
			TQ.setTextEx(_lc_.m_enemyAlliFlagDom, _lc_.m_blockRes.enemyAlliFlag);
		}
	};	
	
	_lc_._setNpcCityImg = function(){
		_lc_._setCityDomsVisible();
		_lc_._setNpcCityNamePos();	
		_lc_._setNpcCityBackImg();
		_lc_._setNpcName();
	};
	
	_lc_._setNpcCityNamePos = function(){
		var pos = _lc_._getNamePosByBottomSpace(_lc_.NPC_NAME_BOTTOMSPACE);
		TQ.setDomPos( _lc_.m_nameDom, pos.x, pos.y);
	};
	
	_lc_._setNpcCityBackImg = function(){
		IMG.setBKImage(_lc_.m_cityDom, IMG.makeImg('fields/npccity/' + _lc_.m_blockRes.modelId + '.gif'));
	};
	
	_lc_._setNpcName = function(){
		var res = TQ.qfind(res_npcfields, 'id', _lc_.m_blockRes.resid);
		TQ.setClass(_lc_.m_nameDom, 'name');
		TQ.setTextEx(_lc_.m_nameDom, res.name);
	};	
	
	_lc_._setFieldImg = function(){
		_lc_._setFieldDomsVisible();
		_lc_._setFieldNamePos();
		_lc_._setFieldName();
		_lc_._setFieldFlag();
	};
	
	_lc_._setFieldDomsVisible = function(){
		_lc_._hideAllDoms();
		TQ.setCSS( _lc_.m_nameDom, 'display', 'block' );
	};
	
	_lc_._setFieldNamePos = function(){
		var pos = _lc_._getNamePosByBottomSpace(_lc_.FIELD_NAME_BOTTOMSPACE);
		TQ.setDomPos( _lc_.m_nameDom, pos.x, pos.y);
	};
	
	_lc_._setFieldName = function(){
		var fieldRes = res_fields[_lc_.m_blockRes.resid - FIXID.FIRSTFIELDID];
		TQ.setClass(_lc_.m_nameDom, 'name');
		TQ.setTextEx(_lc_.m_nameDom, TQ.format(rstr.comm.flevelsomething, _lc_.m_blockRes.level, fieldRes.name));
	};
	
	_lc_._setFieldFlag = function(){
		var className = '';
		if (!_lc_.m_blockRes.roleId){
			className = 'noFieldFlag';
		} else if (_lc_.m_g.getImgr().isSameRole(_lc_.m_blockRes.roleName)){
			className = 'myFieldFlag';
		} else if (_lc_.m_g.getImgr().isSameAlliance(_lc_.m_blockRes.alliance.uid) ){
			className = 'alliFieldFlag';
		} else {
			className = 'noalliFieldFlag';
		}
		
		TQ.setClass(_lc_.m_fieldRefFlag, className);
	};
	
	_lc_._setEmptyFieldImg = function(){
		_lc_._setEmptyFieldDomsVisible();
		_lc_._setEmptyFieldNamePos();
		_lc_._setEmptyFieldName();
	};
	
	_lc_._setEmptyFieldDomsVisible = function(){
		_lc_._hideAllDoms();
		TQ.setCSS( _lc_.m_nameDom, 'display', 'block' );
	};
	
	_lc_._setEmptyFieldNamePos = function(){
		var pos = _lc_._getNamePosByBottomSpace(_lc_.FIELD_NAME_BOTTOMSPACE);
		TQ.setDomPos( _lc_.m_nameDom, pos.x, pos.y);
	};
	
	_lc_._setEmptyFieldName = function(){
		TQ.setClass(_lc_.m_nameDom, 'name');
		TQ.setTextEx(_lc_.m_nameDom, rstr.field.lbl.emptyField);
	};	
	
	_lc_._getNamePosByBottomSpace = function(bottomSpace){
		var nameX = (_lc_.B_W - _lc_.NAME_W)/2;
		var nameY = _lc_.B_H - _lc_.NAME_H - bottomSpace;
		return {x:nameX, y:nameY};
	};
	
	var _printDebugInfo = function(){
		if ( !L_IS_DEBUG ) return;
		
		TQ.setTextEx(m_debugInfo, _lc_.m_gridId);
	};
	
	this.init.apply(this, arguments);
	//FieldBlock-unittest-end
};

MoveFieldBlocksHdr = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_fieldBlocks = null;
	
	this.init = function(fieldBlocks){
		_lc_.m_fieldBlocks = fieldBlocks;
	};
	
	this.moveBlocks = function(viewport){
		var needShowBlockFlags = _lc_._getNeedShowBlockFlags(viewport);
		var outoffBoundBlocks = _lc_._getOutoffBoundBlocks(needShowBlockFlags);
		var hasExistBlockFlags = _lc_._getExistBlockFlags(needShowBlockFlags);
		_lc_._allocAndResetBlocks(needShowBlockFlags, outoffBoundBlocks, hasExistBlockFlags);
	};
	
	_lc_._getNeedShowBlockFlags = function(viewport){
		var viewport = _lc_._adjustViewPort(viewport);
		var x0 = Math.floor(viewport.x/C_OUTFIELD_BLOCK_W);
		var x1 = Math.floor((viewport.x + viewport.w)/C_OUTFIELD_BLOCK_W);
		var y0 = Math.floor(viewport.y/C_OUTFIELD_BLOCK_H);
		var y1 = Math.floor((viewport.y + viewport.h)/C_OUTFIELD_BLOCK_H);
		
		var needShowBlockFlags = {};
		for ( var y=y0; y<=y1; ++y ){
			for ( var x=x0; x<=x1; ++x ){
				var gridId = FieldUtil.getGridIdByPos({x:x, y:y});//y * C_OUTFIELD_ROW_GRIDS + x + 1;
				needShowBlockFlags[gridId] = true;
			}
		}
		
		return needShowBlockFlags;
	};
	
	_lc_._adjustViewPort = function(viewport){
		var x = (viewport.x >= 0) ? viewport.x : 0;
		var y = (viewport.y >= 0) ? viewport.y : 0;
		return {x:x, y:y, w:viewport.w, h:viewport.h};
	};
	
	_lc_._getOutoffBoundBlocks = function(needShowBlockFlags){
		var outoffBoundBlocks = [];
		var count = _lc_.m_fieldBlocks.getCount();
		for ( var i=0; i<count; ++i ) {
			var block = _lc_.m_fieldBlocks.getBlock(i);
			if ( !needShowBlockFlags[block.getFieldGridId()] ) {
				outoffBoundBlocks.push(block);
			}
		}
		
		return outoffBoundBlocks;
	};
	
	_lc_._getExistBlockFlags = function(needShowBlockFlags){
		var hasExistBlocks = {};
		var count = _lc_.m_fieldBlocks.getCount();
		for ( var i=0; i<count; ++i ) {
			var block = _lc_.m_fieldBlocks.getBlock(i);
			var isNeedShow = needShowBlockFlags[block.getFieldGridId()];
			if ( isNeedShow ) {
				hasExistBlocks[block.getFieldGridId()] = true;
			}
		}
		
		return hasExistBlocks;
	};
	
	_lc_._allocAndResetBlocks = function(needShowBlockFlags, outoffBoundBlocks,  hasExistBlockFlags){
		for ( var gridId in needShowBlockFlags ) {
			if ( hasExistBlockFlags[gridId] ) {
				continue;
			}
			
			// alloc block from outBoundBlocks
			var gridId = parseInt(gridId, 10);
			var block = outoffBoundBlocks[outoffBoundBlocks.length-1];
			outoffBoundBlocks.length = outoffBoundBlocks.length - 1;
			block.show();
			block.setFieldGridId(gridId);
		}
	};
	//MoveFieldBlocksHdr-unittest-end
});

MapBoundary = JClass.ex({
	init : function(g, map){
		this._g = g;
		this._map = map;
		this._xlines = {pos:0, lines:[]};
		this._ylines = {pos:0, lines:[]};
	}
	
	,setViewPort : function(viewport){
		this._hideLines(this._xlines);
		this._hideLines(this._ylines);
		this._showLines(res_mapboundarys.xlines, this._checkXInRect, this._showXLine, viewport);
		this._showLines(res_mapboundarys.ylines, this._checkYInRect, this._showYLine, viewport);
	}
	
	,_hideLines : function(lines){
		lines.pos = 0;
		for ( var i=0; i<lines.lines.length; ++i ) {
			TQ.setCSS(lines.lines[i], 'display', 'none');
		}
	}
	
	,_showLines : function(boundarys, check, showLine, viewport){
		for ( var i=0; i<boundarys.length; ++i ) {
			var line = boundarys[i];
			var x1 = line[0]*C_OUTFIELD_BLOCK_W;
			var y1 = line[1]*C_OUTFIELD_BLOCK_H;
			var x2 = line[2]*C_OUTFIELD_BLOCK_W;
			var y2 = line[3]*C_OUTFIELD_BLOCK_H;
			if ( !check.call(this,x1, y1, x2, y2, viewport) ) continue;
			
			var linex1 = x1;
			if ( x1 < viewport.x ) {
				linex1 = (viewport.x - (viewport.x - x1)%C_OUTFIELD_BLOCK_W);
			}
			var linex2 = Math.min(x2, viewport.x+viewport.w);
			
			var liney1 = y1;
			if ( y1 < viewport.y ) {
				liney1 = (viewport.y - (viewport.y - y1)%C_OUTFIELD_BLOCK_H);
			}
			var liney2 = Math.min(y2, viewport.y+viewport.h);
			
			showLine.call(this, linex1, liney1, linex2, liney2); 
		}
	}
	
	,_checkXInRect : function(x1, y1, x2, y2, viewport) {
		if ( y1 < viewport.y || y1 > (viewport.y + viewport.h) ) return false;
		return ( (x1 >= viewport.x && x1 < (viewport.x + viewport.w)) 
			|| (x2 >= viewport.x && x2 < (viewport.x + viewport.w)) 
			|| (x1 < viewport.x && x2 >= (viewport.x + viewport.w)) );
	}
	
	,_checkYInRect : function(x1, y1, x2, y2, viewport) {
		if ( x1 < viewport.x || x1 > (viewport.x + viewport.w) ) return false;
		return ( (y1 >= viewport.y && y1 < (viewport.y + viewport.h)) 
			|| (y2 >= viewport.y && y2 < (viewport.y + viewport.h)) 
			|| (y1 < viewport.y && y2 >= (viewport.y + viewport.h)) );
	}
		
	,_showXLine : function(x1, y1, x2, y2) {
		var dom = this._allocLine(this._xlines, 'mapboundary_h', 100000);
		TQ.setDomRect(dom, x1, y1-5, x2-x1, 14);
	}
	
	,_showYLine : function(x1, y1, x2, y2) {
		var dom = this._allocLine(this._ylines, 'mapboundary_v', 100001);
		TQ.setDomRect(dom, x1-5, y1, 14, y2-y1);
	}
	
	,_allocLine : function(lines, className, zIndex) {
		if ( lines.pos == lines.lines.length ) {
			var dom = TQ.createDom('div');
			TQ.append(this._map, dom);
			TQ.setCSS(dom, 'position', 'absolute');
			TQ.setCSS(dom, 'zIndex', zIndex);
			TQ.setClass(dom, className);
			lines.lines.push(dom);
		}
		var dom = lines.lines[lines.pos++];
		TQ.setCSS(dom, 'display', 'block');
		return dom;
	}
});

FieldGotoBar = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_items = null;
	_lc_.m_view = null;
	this.init = function(g, items, view){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_items = items;
		_lc_.m_view = view;
		_lc_._setCallers();
	};
	
	this.show = function(){
		TQ.setCSS(_lc_.m_items.outFieldToolBar, 'visibility', 'visible');
	};
	
	this.hide = function(){
		TQ.setCSS(_lc_.m_items.outFieldToolBar, 'visibility', 'hidden');
	};
	
	this.setViewport = function(viewport){
		var pixelX = viewport.x + viewport.w/2;
		var pixelY = viewport.y + viewport.h/2;
		var x = Math.floor(pixelX / C_OUTFIELD_BLOCK_W);
		var y = Math.floor(pixelY / C_OUTFIELD_BLOCK_H);
		_lc_.m_items.ifieldX.setVal(x);
		_lc_.m_items.ifieldY.setVal(y);
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.goHomeBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickGoHomeBtn});
		_lc_.m_items.gotoPosBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickGotoPosBtn});
		_lc_.m_items.ifieldX.setLimit(_onGetXLimit);
		_lc_.m_items.ifieldY.setLimit(_onGetYLimit);
	};
	
	_lc_._onClickGoHomeBtn = function(){
		_lc_.m_view.goHome();
	};
	
	_lc_._onClickGotoPosBtn = function(){
		var pos = {x:_lc_.m_items.ifieldX.getVal(), y:_lc_.m_items.ifieldY.getVal()};
		_lc_.m_view.gotoPos(pos);
	};
	
	var _onGetXLimit = function(){
		var view = _lc_.m_g.getImgr().getMapView();
		return {min:0, max:view.x2-1};
	};
	
	var _onGetYLimit = function(){
		var view = _lc_.m_g.getImgr().getMapView();
		return {min:0, max:view.y2-1};
	};
	//FieldGotoBar-unittest-end
});

FieldSmallMapTip = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_smallMap = null;
	_lc_.m_isShow = false;
	_lc_.m_tip = null;
	
	this.init = function(g, smallMap){
		_lc_._initParams(this, g, smallMap);
		_lc_._createTipObj();
		_lc_._setMouseEvents();
	};
	
	this.show = function(){
		_lc_.m_isShow = true;
	};
	
	this.hide = function() {
		_lc_.m_isShow = false;
		_lc_.m_tip.hide();
	};
	
	_lc_._initParams = function(selfThis, g, smallMap){
		_lc_.m_g = g;
		_lc_.m_this = selfThis;
		_lc_.m_smallMap = smallMap;
	};
	
	_lc_._createTipObj = function(){
		var tipid = TTIP.addTip(_lc_.m_smallMap.getMapEventDom(), 'no');
		_lc_.m_tip = TTIP.getTipById(tipid);
		_lc_.m_tip.setFlag(TIP_FLAG.CUSTOM);
		_lc_.m_tip.setCaller({self:_lc_.m_this, caller:_lc_._onGetGridPosTip});
	};
	
	_lc_._setMouseEvents = function(){
		TQ.addEvent(_lc_.m_smallMap.getMapEventDom(), 'mouseover', _lc_._onMouseOver);
		TQ.addEvent(_lc_.m_smallMap.getMapEventDom(), 'mousemove', _lc_._onMouseMove);
		TQ.addEvent(_lc_.m_smallMap.getMapEventDom(), 'mouseout', _lc_._onMouseOut);
	};
	
	_lc_._onMouseOver = function(e){
		if ( !_lc_.m_isShow ) return;
		_lc_._updateTip(e);
	};
	
	_lc_._onMouseMove = function(e){
		if ( !_lc_.m_isShow ) return;
		_lc_._updateTip(e);
	};
	
	_lc_._onMouseOut = function(){
		if ( !_lc_.m_isShow ) return;
		_lc_.m_tip.hide();
	};
	
	_lc_._onGetGridPosTip = function(data){
		return data.x + ',' + data.y;
	};
	
	_lc_._updateTip = function(e){
		_lc_.m_tip.setData(_lc_._getGridPos(e));
		_lc_.m_tip.reset();
		_lc_.m_tip.show(TQ.mouseCoords(e));
	};

	_lc_._getGridPos = function(e){
		var smallMapPos = TQ.mouseRelativeCoords(_lc_.m_smallMap.getMapEventDom(), e);
		var mapPos = _lc_.m_smallMap.convertSTLPos(smallMapPos);
		var gridX = Math.floor(mapPos.x/C_OUTFIELD_BLOCK_W);
		var gridY = Math.floor(mapPos.y/C_OUTFIELD_BLOCK_H);
		return {x:gridX, y:gridY};	
	};
	
	//FieldSmallMapTip-unittest-end
});

FieldMapBlockSelector = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_mapPanel = null;
	_lc_.m_selectBlock = null;
	
	this.init = function(g, mapPanel){
		_lc_._initParams(this, g, mapPanel);
		_lc_._createSelectBlock();
		_lc_._setMouseEvents();
	};
	
	_lc_._initParams = function(pthis, g, mapPanel){
		_lc_.m_this = pthis;
		_lc_.m_g = g;
		_lc_.m_mapPanel = mapPanel;
	};
	
	_lc_._createSelectBlock = function(){
		_lc_.m_selectBlock = TQ.createDom('div');
		TQ.append(_lc_.m_mapPanel.getItems().mapscene, _lc_.m_selectBlock);
		TQ.setClass(_lc_.m_selectBlock, 'fieldselectblock');
		TQ.setDomSize(_lc_.m_selectBlock, C_OUTFIELD_BLOCK_W, C_OUTFIELD_BLOCK_H);
	};
	
	_lc_._setMouseEvents = function(){
		TQ.addEvent(_lc_.m_mapPanel.getItems().mousemap, 'mousemove', _lc_._onMouseMove);
	};
	
	_lc_._onMouseMove = function(e){
		var pos = TQ.mouseRelativeCoords(_lc_.m_mapPanel.getItems().mousemap, e);
		var viewport = _lc_.m_mapPanel.getViewport();
		var mapPosX = Math.floor((viewport.x+pos.x)/C_OUTFIELD_BLOCK_W)*C_OUTFIELD_BLOCK_W;
		var mapPosY = Math.floor((viewport.y+pos.y)/C_OUTFIELD_BLOCK_H)*C_OUTFIELD_BLOCK_H;
		TQ.setDomPos(_lc_.m_selectBlock, mapPosX, mapPosY);
	};
	//FieldMapBlockSelector-unittest-end
});	

FieldMapView = CommMapPanel.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_isFirst = true;
	_lc_.m_items = null;
	_lc_.m_moveFieldsHdr = null;
	_lc_.m_gotoBar = null;
	_lc_.m_smallMapTip = null;
	_lc_.m_blockSelector = null;

	this.init = function(g, items){
		_lc_.m_g = g;
		_lc_.m_this = this;
	
		_lc_.m_this.Super.init(g, items.map);
		_lc_.m_this.create();
		_lc_.m_items = _lc_.m_this.getItems();

		_lc_.m_gotoBar = FieldGotoBar.snew(_lc_.m_g, items, _lc_.m_this);
		_lc_.m_smallMapTip = FieldSmallMapTip.snew(_lc_.m_g, UIM.getPanel('smallmap'));

		_lc_._regEvents();
		_lc_._createBlocks();
	};
	
	this.open = function(){
		if (!this.isShow()) OutFieldSender.sendEnterOutField(_lc_.m_g);
		this.show();
		
		_lc_._firstOpen();
		this.loadMap(FIXID.OUTFIELD, rstr.citylist.outfield);
		_lc_.m_g.getImgr().setCurLoadCity(FIXID.OUTFIELD);
		this.resetSMapCaller();
		_setMapPixelRect();
		this.setLastViewPort();
		
		SoundMgr.playBackSound(res_baksounds.field);
		OutFieldSender.sendRefreshFieldsByLastViewPos(_lc_.m_g);
	};
	
	this.show = function(){
		_lc_.m_this.Super.show();
		_lc_.m_gotoBar.show();
		_lc_.m_smallMapTip.show();
	};
	
	this.hide = function(){
		_lc_.m_this.Super.hide();
		_lc_.m_gotoBar.hide();
		_lc_.m_smallMapTip.hide();
	};	
	
	this.goHome = function(){
		_lc_.m_this.gotoPos(_lc_.m_g.getImgr().getRoleRes().pos);
		OutFieldSender.sendRefreshFieldsByLastViewPos(_lc_.m_g);
	};
	
	this.gotoPos = function(pos){
		var clientSize = _lc_.m_g.getWinSizer().getValidClientSize();
		var x = Math.floor((pos.x*C_OUTFIELD_BLOCK_W + C_OUTFIELD_BLOCK_W/2) - clientSize.cx/2);
		var y = Math.floor((pos.y*C_OUTFIELD_BLOCK_H + C_OUTFIELD_BLOCK_H/2) - clientSize.cy/2);
		var adjustPos = {x:x, y:y};
		_lc_.m_this.setLastViewport(adjustPos);
		_lc_.m_items.fieldBlocks.setViewPos(adjustPos.x, adjustPos.y);
		_lc_.m_this.setViewportPos(adjustPos);
	};
	
	var _setMapPixelRect = function(){
		var mview = _lc_.m_g.getImgr().getMapView();
		_lc_.m_this.setMapPixelRect(mview.x1*C_OUTFIELD_BLOCK_W, mview.y1*C_OUTFIELD_BLOCK_H,mview.x2*C_OUTFIELD_BLOCK_W, mview.y2*C_OUTFIELD_BLOCK_H	);
	};
	
	_lc_._regEvents = function(){
		_lc_.m_g.regEvent(EVT.NET, NETCMD.OUTFIELD, _lc_.m_this, _lc_._onSvrData);
	};
	
	_lc_._createBlocks = function(){
		_lc_.m_items.fieldBlocks = BuildBlocks.snew(_lc_.m_g, 
			{	 map:_lc_.m_items.mapscene,
				 mousemap:_lc_.m_items.mousemap,
				 blockclass:FieldBlock,
				 poss:_lc_._getBlockPoss(), 
				 blockw:C_OUTFIELD_BLOCK_W, 
				 blockh:C_OUTFIELD_BLOCK_H,
				 clickcaller:{self:_lc_.m_this, caller:_lc_._onClickBlock},
				 tipcaller:{self:_lc_.m_this, caller:_lc_._onGetBlockTooltip}
			 },
			 'rect' );
		_lc_.m_items.mapBoundary = MapBoundary.snew(_lc_.m_g, _lc_.m_items.mapscene);
		_lc_.m_moveFieldsHdr = MoveFieldBlocksHdr.snew(_lc_.m_items.fieldBlocks);
		_lc_.m_items.fieldBlocks.hideAllBlock();
		_lc_.m_this.setViewportCaller({self:_lc_.m_this, caller:_lc_._onViewportChange});
	};	
	
	_lc_._firstOpen = function(){
		if ( !_lc_.m_isFirst ) return;
		
		_lc_.m_blockSelector = FieldMapBlockSelector.snew(_lc_.m_g, _lc_.m_this);
		_lc_.m_this.goHome();
		_lc_.m_isFirst = false;
	};
	
	_lc_._getBlockPoss = function(){
		var size = _lc_.m_g.getWinSizer().getMaxClientSize();
		var rows = Math.floor((size.cx + 2*C_OUTFIELD_BLOCK_W)/C_OUTFIELD_BLOCK_W);
		var cols = Math.floor((size.cy + 2*C_OUTFIELD_BLOCK_H)/C_OUTFIELD_BLOCK_H);
		
		var poss = [];
		for ( var i=0; i<rows*cols; ++i ) {
			poss.push({x:0, y:0});
		}
		return poss;
	};
	
	_lc_._onViewportChange = function(viewport){
		var size = _lc_.m_g.getWinSizer().getMaxClientSize();
		var newViewPort = {x:viewport.x, y:viewport.y, w:size.cx, h:size.cy};
		_lc_.m_moveFieldsHdr.moveBlocks(newViewPort);
		_lc_.m_items.mapBoundary.setViewPort(newViewPort);
		_lc_._sendGetFieldsCmd(newViewPort);
		_lc_.m_gotoBar.setViewport(viewport);
		_lc_.m_items.fieldBlocks.setViewPos(viewport.x, viewport.y);
	};
	
	_lc_._onSvrData = function(ndata){
		if ( !ndata.data.outFields ) {
			return;
		}
		
		var hasDetailField = false;
		for ( var i=0; i<ndata.data.outFields.length; ++i ) {
			var blockRes = ndata.data.outFields[i];
			if (blockRes['_k']) continue;
			
			if (blockRes.isDetail){
				hasDetailField = true;
				_lc_.m_g.getImgr().setCurDetailField(blockRes);
			}
			
			var block = _lc_._getBlockByGridId(blockRes.gridId);
			if ( !block ) continue;
			
			block.setItem(blockRes);
		}
		
		if (hasDetailField) {
			UIM.getDlg('rolecity').openDlg(_lc_.m_g.getImgr().getCurDetailField());
			_lc_.m_g.sendEvent({eid:EVT.OUTFIELD_DETAIL,sid:0});
		}
	};
	
	_lc_._sendGetFieldsCmd = function(viewport){
		var centerPos = {x: viewport.x + Math.floor(viewport.w/2), y:viewport.y + Math.floor(viewport.h/2)};
		OutFieldSender.sendGetFieldsByPos(_lc_.m_g, centerPos);
	};
	
	_lc_._getBlockByGridId = function(gridId){
		for ( var i=0; i<_lc_.m_items.fieldBlocks.getCount(); ++i ) {
			var block = _lc_.m_items.fieldBlocks.getBlock(i);
			if ( block.getFieldGridId() == gridId ) {
				return block;
			}
		}
		
		return null;
	};
	
	_lc_._onClickBlock = function(e, idx){
		if ( _lc_.m_this.isDragged(e) ) {
			return;
		}
		
		var block = _lc_.m_items.fieldBlocks.getBlock(idx);
		if (!block){
			return;
		}
		
		var field = block.getItem();
		if (!field) {
			return;
		}
		
		if (field.objType == OBJ_TYPE.NONE){
			UIM.openDlg('emptyfield', field);
		}
		else if (field.objType == OBJ_TYPE.ROLE){
			UIM.openDlg('rolecity', field);
		}
		else if (field.objType == OBJ_TYPE.FIELD){
			UIM.openDlg('field', field);
		}
		else {
			_lc_.m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.field.lbl.invalidField);
		}
	};
	
	_lc_._onGetBlockTooltip = function(data){
		var block = _lc_.m_items.fieldBlocks.getBlock(data.idx);
		var field = block.getItem();
		if (!field) {
			return '';
		}
		
		if (field.objType == OBJ_TYPE.ROLE){
			return _lc_._getRoleInfoTip(field);
		}
		
		return '';
	};
	
	_lc_._getRoleInfoTip = function(field){
		var cityPos = FieldUtil.getPosByGridId(field.gridId);
		var cityName = FieldUtil.getCityNameByGridId(field.gridId);
		return TQ.format(rstr.field.tip.roleInfo, field.roleName, field.alliance.name, cityPos.x + ',' + cityPos.y, cityName);
	};

	//FieldMapView-unittest-end
});
