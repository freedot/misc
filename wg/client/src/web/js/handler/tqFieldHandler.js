/*******************************************************************************/
var L_IS_DEBUG = false;
FieldBlock = function(){
	//FieldBlock-unittest-start
	var B_W = C_OUTFIELD_BLOCK_W;
	var B_H = C_OUTFIELD_BLOCK_H;
	
	var CITY_W = B_W;
	var CITY_H = 250;
	var BAK_TOP = CITY_H - B_H;	
	
	var NAME_W = 90;
	var NAME_H = 16;
	var ROLE_NAME_BOTTOMSPACE = 80 - BAK_TOP;
	var NPC_NAME_BOTTOMSPACE = 80 - BAK_TOP;
	var FIELD_NAME_BOTTOMSPACE = 80 - BAK_TOP;
	
	var MYALLIFLAG_W = 24;
	var MYALLIFLAG_H = 25;
	var ENEMY_ALLIFLAG_TOPSPACE = 11 + BAK_TOP;
	
	var SUB_CITYW = 82;
	var SUB_CITYH = 55;
	var SUB_TOPSPACE = 14;
	var SUB_BOTTOMSPACE = 10;
	var SUB_LEFTSPACE = 40;
	var SUB_RIGHTSPACE = 40;
		
	var m_g = null;
	var m_this = null;
	
	var m_dom = null;
	var m_cityDom = null;
	var m_nameDom = null;
	var m_mySubCityDoms = [];
	var m_myAlliFlagDom = null;
	var m_enemyAlliFlagDom = null;
	var m_debugInfo = null;
	var m_fieldRefFlag = null;
	
	var m_blockRes = null;
	
	var m_worldRect = {x:-20000, y:-20000, w:B_W, h:B_H};
	var m_gridId = -1;
	
	this.init = function(g, dom, checkInRectFlag){
		m_g = g;
		m_this = this;
		m_dom = dom;
		TQ.setCSS(m_dom, 'height', CITY_H + 'px' );
		TQ.setClass(m_dom, 'fieldblock');
		_createDoms();
		_setDomsPos();
		_hideAllDoms();
	};
	
	this.clear = function(){
	};
	
	this.isInRect = function(pos){
		var rect = {x:m_worldRect.x, y:m_worldRect.y+BAK_TOP, w:m_worldRect.w, h:m_worldRect.h};
		return TQ.isInRect(rect, pos);
	};
	
	this.setItem = function(blockRes){
		_copyBlockRes(blockRes);
		_setFieldBackImg();
		_setCityImg();
	};
	
	this.getItem = function(){
		return m_blockRes;
	};
	
	this.show = function(){
		TQ.setCSS(m_dom, 'visibility', 'visible');
	};
	
	this.hide = function(){
		TQ.setCSS(m_dom, 'visibility', 'hidden');
	};
	
	this.getFieldGridId = function(){
		return m_gridId;
	};
	
	this.setFieldGridId = function(gridId){
		m_gridId = gridId;
		_setWorldPos();
		_printDebugInfo();
	};
	
	this.normal = function(){
	};
	
	this.hot = function(){
	};
	
	var _copyBlockRes = function(blockRes){
		m_blockRes = {};
		TQ.dictCopy(m_blockRes, blockRes);
	};
	
	var _createDoms = function(){
		m_cityDom = TQ.createDom('div');
		TQ.append(m_dom, m_cityDom);
		TQ.setClass(m_cityDom, 'cityBuild');
		TQ.setCSS(m_cityDom, 'zIndex', 2);
		
		m_nameDom = TQ.createDom('div');
		TQ.append(m_dom, m_nameDom);
		TQ.setClass(m_nameDom, 'name');
		TQ.setCSS(m_nameDom, 'zIndex', 10);
		
		m_myAlliFlagDom = TQ.createDom('div');
		TQ.append(m_dom, m_myAlliFlagDom);
		TQ.setClass(m_myAlliFlagDom, 'myAlliFlag');
		TQ.setCSS(m_myAlliFlagDom, 'zIndex', 10);
		
		m_enemyAlliFlagDom = TQ.createDom('div');
		TQ.append(m_dom, m_enemyAlliFlagDom);
		TQ.setClass(m_enemyAlliFlagDom, 'enemyAlliFlag');
		TQ.setCSS(m_enemyAlliFlagDom, 'zIndex', 10);
		
		m_fieldRefFlag = TQ.createDom('div');
		TQ.append(m_dom, m_fieldRefFlag);
		TQ.setClass(m_fieldRefFlag, 'noFieldFlag');
		TQ.setCSS(m_fieldRefFlag, 'zIndex', 11);

		if ( L_IS_DEBUG ) {
			m_debugInfo = TQ.createDom('div');
			TQ.append(m_dom, m_debugInfo);
			TQ.setDomRect(m_debugInfo, 50, 50, 200,100);
			TQ.setCSS(m_debugInfo, 'zIndex', 100);
		}
		
		var subZIndexs = [1,3,3,1];
		for ( var i=0; i<4; ++i ) {
			var subCityDom = TQ.createDom('div');
			TQ.append(m_dom, subCityDom);
			m_mySubCityDoms.push(subCityDom);
			TQ.setClass(subCityDom, 'subCity');
			TQ.setCSS(subCityDom, 'zIndex', subZIndexs[i]);
		}
	};
	
	var _setDomsPos = function(){
		_setCityDomPos();
		_setRoleCityNamePos();
		_setMyAlliFlagPos();
		_setEnemyAlliFlagPos();
		_setSubCityDomsPos();
	};
	
	var _setCityDomPos = function(){
		TQ.setDomPos( m_cityDom, 0, 0 );	
	};
	
	var _setRoleCityNamePos = function(){
		var pos = _getRoleCityNamePos();
		TQ.setDomPos( m_nameDom, pos.x, pos.y);
	};
	
	var _setMyAlliFlagPos = function(){
		var namePos = _getRoleCityNamePos();
		var myAlliFlagX = namePos.x - MYALLIFLAG_W;
		var myAlliFlagY = namePos.y + NAME_H - MYALLIFLAG_H;
		TQ.setDomPos( m_myAlliFlagDom, myAlliFlagX, myAlliFlagY);
	};
	
	var _setEnemyAlliFlagPos = function(){
		var namePos = _getRoleCityNamePos();
		var enemyAlliFlagX = namePos.x + NAME_W;
		var enemyAlliFlagY = ENEMY_ALLIFLAG_TOPSPACE;
		TQ.setDomPos( m_enemyAlliFlagDom, enemyAlliFlagX, enemyAlliFlagY);	
	};
	
	var _getRoleCityNamePos = function(){
		return _getNamePosByBottomSpace(ROLE_NAME_BOTTOMSPACE);
	};
	
	var _setSubCityDomsPos = function(){
		var innerW = B_W - SUB_LEFTSPACE - SUB_RIGHTSPACE;
		var innerH = B_H - SUB_TOPSPACE - SUB_BOTTOMSPACE;
		
		var offsetX = SUB_LEFTSPACE;
		var offsetY = SUB_TOPSPACE + BAK_TOP;
		
		var subCitysInnerPos = [
			{x:0, y:0}
			,{x:0, y:innerH - SUB_CITYH}
			,{x:innerW - SUB_CITYW, y:innerH - SUB_CITYH}
			,{x:innerW - SUB_CITYW, y:0} ];
		for ( var i=0; i<subCitysInnerPos.length; ++i ){
			TQ.setDomPos( m_mySubCityDoms[i], subCitysInnerPos[i].x + offsetX, subCitysInnerPos[i].y + offsetY);
		}
	};
	
	var _hideAllDoms = function(){
		TQ.setCSS(m_cityDom, 'display', 'none');
		TQ.setCSS(m_nameDom, 'display', 'none');
		TQ.setCSS(m_myAlliFlagDom, 'display', 'none');
		TQ.setCSS(m_enemyAlliFlagDom, 'display', 'none');
		TQ.setClass(m_fieldRefFlag, 'noFieldFlag');
		for ( var i=0; i<4; ++i ) {
			TQ.setCSS(m_mySubCityDoms[i], 'display', 'none');
		}
	};
	
	var _setWorldPos = function(){
		var idx = m_gridId - 1;
		var colIdx = idx % C_OUTFIELD_ROW_GRIDS;
		var rowIdx = Math.floor(idx / C_OUTFIELD_ROW_GRIDS);
		_setFieldBackEmptyImg(colIdx, rowIdx);
		_copyBlockRes(_newInvalidFieldRes(m_gridId));
		m_worldRect.x = colIdx * C_OUTFIELD_BLOCK_W;
		m_worldRect.y = rowIdx * C_OUTFIELD_BLOCK_H - BAK_TOP;
		TQ.setCSS(m_dom, 'zIndex', m_worldRect.y);
		TQ.setDomPos(m_dom, m_worldRect.x, m_worldRect.y);
	};
	
	var _newInvalidFieldRes = function(gridId){
		return {gridId:gridId, objType:OBJ_TYPE.INVALID, resid:170005, modelId:17000501};
	};
	
	var _setFieldBackEmptyImg = function(colIdx, rowIdx){
		_hideAllDoms();
		IMG.setBKImage(m_dom, IMG.makeImg('fields/block/17000501.jpg'), '0px ' + BAK_TOP + 'px');
	};
	
	var _setFieldBackImg = function(){
		var modelId = 0;
		if (m_blockRes.objType == OBJ_TYPE.FIELD) {
			modelId = m_blockRes.modelId;
		}
		else {
			modelId = res_fields[FIXID.PINGDIFIELDID - FIXID.FIRSTFIELDID].models[0];
		}
		
		IMG.setBKImage(m_dom, IMG.makeImg('fields/block/' + modelId + '.jpg'), '0px ' + BAK_TOP + 'px');
		_printDebugInfo();
	};
	
	var _setCityImg = function(){
		if (m_blockRes.objType == OBJ_TYPE.ROLE) {
			_setRoleCityImg();
		}
		else if (m_blockRes.objType == OBJ_TYPE.NPCFIELD) {
			_setNpcCityImg();
		}
		else if (m_blockRes.objType == OBJ_TYPE.FIELD) {
			_setFieldImg();
		}
		else if (m_blockRes.objType == OBJ_TYPE.NONE) {
			_setEmptyFieldImg();
		}
		else {
			_hideAllDoms();
		}
	};	
	
	var _setRoleCityImg = function(){
		_setCityDomsVisible();
		_setRoleCityNamePos();
		_setRoleCityBackImg();
		_setSubCitysImg();
		_setRoleName();
		_setMyAlliFlag();
		_setEnemyAlliFlag();
	};
	
	var _setCityDomsVisible = function(){
		_hideAllDoms();
		TQ.setCSS( m_cityDom, 'display', 'block' );
		TQ.setCSS( m_nameDom, 'display', 'block' );
	};
	
	var _setRoleCityBackImg = function(){
		if ( m_blockRes.vip > 0 ) {
			var modelId = Math.ceil(m_blockRes.vip/2);
			IMG.setBKImage(m_cityDom, IMG.makeImg('fields/rolecity/vip/' + modelId + '.png'));
		} else {
			IMG.setBKImage(m_cityDom, IMG.makeImg('fields/rolecity/' + m_blockRes.modelId + '.gif'));
		}
	};
	
	var _setSubCitysImg = function() {
		for (var i=0; i<m_blockRes.subCitys.length; ++i ){
			var subCityType = m_blockRes.subCitys[i];
			var cityResId = CITYTYPE_MAP_RESIDS[subCityType];
			IMG.setBKImage(m_mySubCityDoms[i], IMG.makeImg('fields/rolecity/' + cityResId + '.gif'));
			TQ.setCSS(m_mySubCityDoms[i], 'display', 'block');
		}
	};
	
	var _setRoleName = function() {
		var fightRefState = m_g.getImgr().getFightRefState(m_blockRes.roleId);
		if ( fightRefState == REF_ROLESTATE.DECLARING_FIGHT ) {
			TQ.setClass(m_nameDom, 'declaring_fight_name');
		} else if ( fightRefState == REF_ROLESTATE.FIGHTING ) {
			TQ.setClass(m_nameDom, 'fighting_name');
		} else {
			TQ.setClass(m_nameDom, 'role_name');
		}
		TQ.setTextEx(m_nameDom, m_blockRes.roleName);
	};
	
	var _setMyAlliFlag = function() {
		if (m_blockRes.myAlliFlag) {
			TQ.setCSS(m_myAlliFlagDom, 'display', 'block');
			TQ.setTextEx(m_myAlliFlagDom, m_blockRes.myAlliFlag);
		}
	};	
	
	var _setEnemyAlliFlag = function() {
		if (m_blockRes.enemyAlliFlag) {
			TQ.setCSS(m_enemyAlliFlagDom, 'display', 'block');
			TQ.setTextEx(m_enemyAlliFlagDom, m_blockRes.enemyAlliFlag);
		}
	};	
	
	var _setNpcCityImg = function(){
		_setCityDomsVisible();
		_setNpcCityNamePos();	
		_setNpcCityBackImg();
		_setNpcName();
	};
	
	var _setNpcCityNamePos = function(){
		var pos = _getNamePosByBottomSpace(NPC_NAME_BOTTOMSPACE);
		TQ.setDomPos( m_nameDom, pos.x, pos.y);
	};
	
	var _setNpcCityBackImg = function(){
		IMG.setBKImage(m_cityDom, IMG.makeImg('fields/npccity/' + m_blockRes.modelId + '.gif'));
	};
	
	var _setNpcName = function(){
		var res = TQ.qfind(res_npcfields, 'id', m_blockRes.resid);
		TQ.setClass(m_nameDom, 'name');
		TQ.setTextEx(m_nameDom, res.name);
	};	
	
	var _setFieldImg = function(){
		_setFieldDomsVisible();
		_setFieldNamePos();
		_setFieldName();
		_setFieldFlag();
	};
	
	var _setFieldDomsVisible = function(){
		_hideAllDoms();
		TQ.setCSS( m_nameDom, 'display', 'block' );
	};
	
	var _setFieldNamePos = function(){
		var pos = _getNamePosByBottomSpace(FIELD_NAME_BOTTOMSPACE);
		TQ.setDomPos( m_nameDom, pos.x, pos.y);
	};
	
	var _setFieldName = function(){
		var fieldRes = res_fields[m_blockRes.resid - FIXID.FIRSTFIELDID];
		TQ.setClass(m_nameDom, 'name');
		TQ.setTextEx(m_nameDom, TQ.format(rstr.comm.flevelsomething, m_blockRes.level, fieldRes.name));
	};
	
	var _setFieldFlag = function(){
		var className = '';
		if (!m_blockRes.roleId){
			className = 'noFieldFlag';
		} else if (m_g.getImgr().isSameRole(m_blockRes.roleName)){
			className = 'myFieldFlag';
		} else if (m_g.getImgr().isSameAlliance(m_blockRes.alliance.uid) ){
			className = 'alliFieldFlag';
		} else {
			className = 'noalliFieldFlag';
		}
		
		TQ.setClass(m_fieldRefFlag, className);
	};
	
	var _setEmptyFieldImg = function(){
		_setEmptyFieldDomsVisible();
		_setEmptyFieldNamePos();
		_setEmptyFieldName();
	};
	
	var _setEmptyFieldDomsVisible = function(){
		_hideAllDoms();
		TQ.setCSS( m_nameDom, 'display', 'block' );
	};
	
	var _setEmptyFieldNamePos = function(){
		var pos = _getNamePosByBottomSpace(FIELD_NAME_BOTTOMSPACE);
		TQ.setDomPos( m_nameDom, pos.x, pos.y);
	};
	
	var _setEmptyFieldName = function(){
		TQ.setClass(m_nameDom, 'name');
		TQ.setTextEx(m_nameDom, rstr.field.lbl.emptyField);
	};	
	
	var _getNamePosByBottomSpace = function(bottomSpace){
		var nameX = (B_W - NAME_W)/2;
		var nameY = B_H - NAME_H - bottomSpace;
		return {x:nameX, y:nameY};
	};
	
	var _printDebugInfo = function(){
		if ( !L_IS_DEBUG ) return;
		
		TQ.setTextEx(m_debugInfo, m_gridId);
	};
	
	this.init.apply(this, arguments);
	//FieldBlock-unittest-end
};

MoveFieldBlocksHdr = Class.extern(function(){
	//MoveFieldBlocksHdr-unittest-start
	var m_fieldBlocks = null;
	
	this.init = function(fieldBlocks){
		m_fieldBlocks = fieldBlocks;
	};
	
	this.moveBlocks = function(viewport){
		var needShowBlockFlags = _getNeedShowBlockFlags(viewport);
		var outoffBoundBlocks = _getOutoffBoundBlocks(needShowBlockFlags);
		var hasExistBlockFlags = _getExistBlockFlags(needShowBlockFlags);
		_allocAndResetBlocks(needShowBlockFlags, outoffBoundBlocks, hasExistBlockFlags);
	};
	
	var _getNeedShowBlockFlags = function(viewport){
		var viewport = _adjustViewPort(viewport);
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
	
	var _adjustViewPort = function(viewport){
		var x = (viewport.x >= 0) ? viewport.x : 0;
		var y = (viewport.y >= 0) ? viewport.y : 0;
		return {x:x, y:y, w:viewport.w, h:viewport.h};
	};
	
	var _getOutoffBoundBlocks = function(needShowBlockFlags){
		var outoffBoundBlocks = [];
		var count = m_fieldBlocks.getCount();
		for ( var i=0; i<count; ++i ) {
			var block = m_fieldBlocks.getBlock(i);
			if ( !needShowBlockFlags[block.getFieldGridId()] ) {
				outoffBoundBlocks.push(block);
			}
		}
		
		return outoffBoundBlocks;
	};
	
	var _getExistBlockFlags = function(needShowBlockFlags){
		var hasExistBlocks = {};
		var count = m_fieldBlocks.getCount();
		for ( var i=0; i<count; ++i ) {
			var block = m_fieldBlocks.getBlock(i);
			var isNeedShow = needShowBlockFlags[block.getFieldGridId()];
			if ( isNeedShow ) {
				hasExistBlocks[block.getFieldGridId()] = true;
			}
		}
		
		return hasExistBlocks;
	};
	
	var _allocAndResetBlocks = function(needShowBlockFlags, outoffBoundBlocks,  hasExistBlockFlags){
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
	//FieldGotoBar-unittest-start
	var m_g = null;
	var m_this = null;
	var m_items = null;
	var m_view = null;
	this.init = function(g, items, view){
		m_g = g;
		m_this = this;
		m_items = items;
		m_view = view;
		_setCallers();
	};
	
	this.show = function(){
		TQ.setCSS(m_items.outFieldToolBar, 'visibility', 'visible');
	};
	
	this.hide = function(){
		TQ.setCSS(m_items.outFieldToolBar, 'visibility', 'hidden');
	};
	
	this.setViewport = function(viewport){
		var pixelX = viewport.x + viewport.w/2;
		var pixelY = viewport.y + viewport.h/2;
		var x = Math.floor(pixelX / C_OUTFIELD_BLOCK_W);
		var y = Math.floor(pixelY / C_OUTFIELD_BLOCK_H);
		m_items.ifieldX.setVal(x);
		m_items.ifieldY.setVal(y);
	};
	
	var _setCallers = function(){
		m_items.goHomeBtn.setCaller({self:m_this, caller:_onClickGoHomeBtn});
		m_items.gotoPosBtn.setCaller({self:m_this, caller:_onClickGotoPosBtn});
		m_items.ifieldX.setLimit(_onGetXLimit);
		m_items.ifieldY.setLimit(_onGetYLimit);
	};
	
	var _onClickGoHomeBtn = function(){
		m_view.goHome();
	};
	
	var _onClickGotoPosBtn = function(){
		var pos = {x:m_items.ifieldX.getVal(), y:m_items.ifieldY.getVal()};
		m_view.gotoPos(pos);
	};
	
	var _onGetXLimit = function(){
		var view = m_g.getImgr().getMapView();
		return {min:0, max:view.x2-1};
	};
	
	var _onGetYLimit = function(){
		var view = m_g.getImgr().getMapView();
		return {min:0, max:view.y2-1};
	};
	//FieldGotoBar-unittest-end
});

FieldSmallMapTip = Class.extern(function(){
	//FieldSmallMapTip-unittest-start
	var m_g = null;
	var m_this = null;
	var m_smallMap = null;
	var m_isShow = false;
	var m_tip = null;
	
	this.init = function(g, smallMap){
		_initParams(this, g, smallMap);
		_createTipObj();
		_setMouseEvents();
	};
	
	this.show = function(){
		m_isShow = true;
	};
	
	this.hide = function() {
		m_isShow = false;
		m_tip.hide();
	};
	
	var _initParams = function(selfThis, g, smallMap){
		m_g = g;
		m_this = selfThis;
		m_smallMap = smallMap;
	};
	
	var _createTipObj = function(){
		var tipid = TTIP.addTip(m_smallMap.getMapEventDom(), 'no');
		m_tip = TTIP.getTipById(tipid);
		m_tip.setFlag(TIP_FLAG.CUSTOM);
		m_tip.setCaller({self:m_this, caller:_onGetGridPosTip});
	};
	
	var _setMouseEvents = function(){
		TQ.addEvent(m_smallMap.getMapEventDom(), 'mouseover', _onMouseOver);
		TQ.addEvent(m_smallMap.getMapEventDom(), 'mousemove', _onMouseMove);
		TQ.addEvent(m_smallMap.getMapEventDom(), 'mouseout', _onMouseOut);
	};
	
	var _onMouseOver = function(e){
		if ( !m_isShow ) return;
		_updateTip(e);
	};
	
	var _onMouseMove = function(e){
		if ( !m_isShow ) return;
		_updateTip(e);
	};
	
	var _onMouseOut = function(){
		if ( !m_isShow ) return;
		m_tip.hide();
	};
	
	var _onGetGridPosTip = function(data){
		return data.x + ',' + data.y;
	};
	
	var _updateTip = function(e){
		m_tip.setData(_getGridPos(e));
		m_tip.reset();
		m_tip.show(TQ.mouseCoords(e));
	};

	var _getGridPos = function(e){
		var smallMapPos = TQ.mouseRelativeCoords(m_smallMap.getMapEventDom(), e);
		var mapPos = m_smallMap.convertSTLPos(smallMapPos);
		var gridX = Math.floor(mapPos.x/C_OUTFIELD_BLOCK_W);
		var gridY = Math.floor(mapPos.y/C_OUTFIELD_BLOCK_H);
		return {x:gridX, y:gridY};	
	};
	
	//FieldSmallMapTip-unittest-end
});

FieldMapBlockSelector = Class.extern(function(){
	//FieldMapBlockSelector-unittest-start
	var m_g = null;
	var m_this = null;
	var m_mapPanel = null;
	var m_selectBlock = null;
	
	this.init = function(g, mapPanel){
		_initParams(this, g, mapPanel);
		_createSelectBlock();
		_setMouseEvents();
	};
	
	var _initParams = function(pthis, g, mapPanel){
		m_this = pthis;
		m_g = g;
		m_mapPanel = mapPanel;
	};
	
	var _createSelectBlock = function(){
		m_selectBlock = TQ.createDom('div');
		TQ.append(m_mapPanel.getItems().mapscene, m_selectBlock);
		TQ.setClass(m_selectBlock, 'fieldselectblock');
		TQ.setDomSize(m_selectBlock, C_OUTFIELD_BLOCK_W, C_OUTFIELD_BLOCK_H);
	};
	
	var _setMouseEvents = function(){
		TQ.addEvent(m_mapPanel.getItems().mousemap, 'mousemove', _onMouseMove);
	};
	
	var _onMouseMove = function(e){
		var pos = TQ.mouseRelativeCoords(m_mapPanel.getItems().mousemap, e);
		var viewport = m_mapPanel.getViewport();
		var mapPosX = Math.floor((viewport.x+pos.x)/C_OUTFIELD_BLOCK_W)*C_OUTFIELD_BLOCK_W;
		var mapPosY = Math.floor((viewport.y+pos.y)/C_OUTFIELD_BLOCK_H)*C_OUTFIELD_BLOCK_H;
		TQ.setDomPos(m_selectBlock, mapPosX, mapPosY);
	};
	//FieldMapBlockSelector-unittest-end
});	

FieldMapView = CommMapPanel.extern(function(){
	//FieldMapView-unittest-start
	var m_g = null;
	var m_this = null;
	var m_isFirst = true;
	var m_items = null;
	var m_moveFieldsHdr = null;
	var m_gotoBar = null;
	var m_smallMapTip = null;
	var m_blockSelector = null;

	this.init = function(g, items){
		m_g = g;
		m_this = this;
	
		m_this.Super.init(g, items.map);
		m_this.create();
		m_items = m_this.getItems();

		m_gotoBar = FieldGotoBar.snew(m_g, items, m_this);
		m_smallMapTip = FieldSmallMapTip.snew(m_g, UIM.getPanel('smallmap'));

		_regEvents();
		_createBlocks();
	};
	
	this.open = function(){
		if (!this.isShow()) OutFieldSender.sendEnterOutField(m_g);
		this.show();
		
		_firstOpen();
		this.loadMap(FIXID.OUTFIELD, rstr.citylist.outfield);
		m_g.getImgr().setCurLoadCity(FIXID.OUTFIELD);
		this.resetSMapCaller();
		_setMapPixelRect();
		this.setLastViewPort();
		
		SoundMgr.playBackSound(res_baksounds.field);
		OutFieldSender.sendRefreshFieldsByLastViewPos(m_g);
	};
	
	this.show = function(){
		m_this.Super.show();
		m_gotoBar.show();
		m_smallMapTip.show();
	};
	
	this.hide = function(){
		m_this.Super.hide();
		m_gotoBar.hide();
		m_smallMapTip.hide();
	};	
	
	this.goHome = function(){
		m_this.gotoPos(m_g.getImgr().getRoleRes().pos);
		OutFieldSender.sendRefreshFieldsByLastViewPos(m_g);
	};
	
	this.gotoPos = function(pos){
		var clientSize = m_g.getWinSizer().getValidClientSize();
		var x = Math.floor((pos.x*C_OUTFIELD_BLOCK_W + C_OUTFIELD_BLOCK_W/2) - clientSize.cx/2);
		var y = Math.floor((pos.y*C_OUTFIELD_BLOCK_H + C_OUTFIELD_BLOCK_H/2) - clientSize.cy/2);
		var adjustPos = {x:x, y:y};
		m_this.setLastViewport(adjustPos);
		m_items.fieldBlocks.setViewPos(adjustPos.x, adjustPos.y);
		m_this.setViewportPos(adjustPos);
	};
	
	var _setMapPixelRect = function(){
		var mview = m_g.getImgr().getMapView();
		m_this.setMapPixelRect(mview.x1*C_OUTFIELD_BLOCK_W, mview.y1*C_OUTFIELD_BLOCK_H,mview.x2*C_OUTFIELD_BLOCK_W, mview.y2*C_OUTFIELD_BLOCK_H	);
	};
	
	var _regEvents = function(){
		m_g.regEvent(EVT.NET, NETCMD.OUTFIELD, m_this, _onSvrData);
	};
	
	var _createBlocks = function(){
		m_items.fieldBlocks = BuildBlocks.snew(m_g, 
			{	 map:m_items.mapscene,
				 mousemap:m_items.mousemap,
				 blockclass:FieldBlock,
				 poss:_getBlockPoss(), 
				 blockw:C_OUTFIELD_BLOCK_W, 
				 blockh:C_OUTFIELD_BLOCK_H,
				 clickcaller:{self:m_this, caller:_onClickBlock},
				 tipcaller:{self:m_this, caller:_onGetBlockTooltip}
			 },
			 'rect' );
		m_items.mapBoundary = MapBoundary.snew(m_g, m_items.mapscene);
		m_moveFieldsHdr = MoveFieldBlocksHdr.snew(m_items.fieldBlocks);
		m_items.fieldBlocks.hideAllBlock();
		m_this.setViewportCaller({self:m_this, caller:_onViewportChange});
	};	
	
	var _firstOpen = function(){
		if ( !m_isFirst ) return;
		
		m_blockSelector = FieldMapBlockSelector.snew(m_g, m_this);
		m_this.goHome();
		m_isFirst = false;
	};
	
	var _getBlockPoss = function(){
		var size = m_g.getWinSizer().getMaxClientSize();
		var rows = Math.floor((size.cx + 2*C_OUTFIELD_BLOCK_W)/C_OUTFIELD_BLOCK_W);
		var cols = Math.floor((size.cy + 2*C_OUTFIELD_BLOCK_H)/C_OUTFIELD_BLOCK_H);
		
		var poss = [];
		for ( var i=0; i<rows*cols; ++i ) {
			poss.push({x:0, y:0});
		}
		return poss;
	};
	
	var _onViewportChange = function(viewport){
		var size = m_g.getWinSizer().getMaxClientSize();
		var newViewPort = {x:viewport.x, y:viewport.y, w:size.cx, h:size.cy};
		m_moveFieldsHdr.moveBlocks(newViewPort);
		m_items.mapBoundary.setViewPort(newViewPort);
		_sendGetFieldsCmd(newViewPort);
		m_gotoBar.setViewport(viewport);
		m_items.fieldBlocks.setViewPos(viewport.x, viewport.y);
	};
	
	var _onSvrData = function(ndata){
		if ( !ndata.data.outFields ) {
			return;
		}
		
		var hasDetailField = false;
		for ( var i=0; i<ndata.data.outFields.length; ++i ) {
			var blockRes = ndata.data.outFields[i];
			if (blockRes['_k']) continue;
			
			if (blockRes.isDetail){
				hasDetailField = true;
				m_g.getImgr().setCurDetailField(blockRes);
			}
			
			var block = _getBlockByGridId(blockRes.gridId);
			if ( !block ) continue;
			
			block.setItem(blockRes);
		}
		
		if (hasDetailField) {
			UIM.getDlg('rolecity').openDlg(m_g.getImgr().getCurDetailField());
			m_g.sendEvent({eid:EVT.OUTFIELD_DETAIL,sid:0});
		}
	};
	
	var _sendGetFieldsCmd = function(viewport){
		var centerPos = {x: viewport.x + Math.floor(viewport.w/2), y:viewport.y + Math.floor(viewport.h/2)};
		OutFieldSender.sendGetFieldsByPos(m_g, centerPos);
	};
	
	var _getBlockByGridId = function(gridId){
		for ( var i=0; i<m_items.fieldBlocks.getCount(); ++i ) {
			var block = m_items.fieldBlocks.getBlock(i);
			if ( block.getFieldGridId() == gridId ) {
				return block;
			}
		}
		
		return null;
	};
	
	var _onClickBlock = function(e, idx){
		if ( m_this.isDragged(e) ) {
			return;
		}
		
		var block = m_items.fieldBlocks.getBlock(idx);
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
			m_g.getGUI().sysMsgTips(SMT_WARNING, rstr.field.lbl.invalidField);
		}
	};
	
	var _onGetBlockTooltip = function(data){
		var block = m_items.fieldBlocks.getBlock(data.idx);
		var field = block.getItem();
		if (!field) {
			return '';
		}
		
		if (field.objType == OBJ_TYPE.ROLE){
			return _getRoleInfoTip(field);
		}
		
		return '';
	};
	
	var _getRoleInfoTip = function(field){
		var cityPos = FieldUtil.getPosByGridId(field.gridId);
		var cityName = FieldUtil.getCityNameByGridId(field.gridId);
		return TQ.format(rstr.field.tip.roleInfo, field.roleName, field.alliance.name, cityPos.x + ',' + cityPos.y, cityName);
	};

	//FieldMapView-unittest-end
});
