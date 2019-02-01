/** 检查地图是否处于拖动状态 */
DragMapChecker = Class.extern(function(){
	var m_isDragging = false;
	
	this.isDragging = function(){
		return m_isDragging;
	};
	
	this.startDrag = function(){
		m_isDragging = true;
	};
	
	this.endDrag = function(){
		m_isDragging = false;
	};
}).snew();

/** 游戏地图 */
GameMap = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var m_this=null;
	var m_g=null;
	var m_mapdom=null;
	var m_mapid=0;
	var m_mapres={id:0,name:'no',desc:'no',mapsize:{cx:2048,cy:1536},img:'000001.jpg',buildtips:[]};
	var m_blocksize = {cx:32,cy:32};
	var m_mappixelsize = {cx:30*m_blocksize.cx,cy:30*m_blocksize.cy};
	var m_mappixelrect = {x1:0, y1:0, x2:1, y2:1};
	var m_viewport = {x:0,y:0,w:2048,h:1536};
	
	var m_mdownpos={x:0,y:0};
	var m_previewport = {x:0,y:0,w:0,h:0}; // save pos before drag map
	var m_caller=null;
	
	var m_freeObjdoms = [];
	var m_objdoms = [];
	var m_mapObjsContainer = null;
	
	//public:method
	this.init = function(g,dom){
		m_this = this;
		m_g = g;
		m_mapdom = dom;
		m_mapObjsContainer = MapObjsContainer.snew(m_g, m_mapdom);
		_init();
	};
	
	this.getMapId = function(){
		return m_mapid;
	};
	
	/** 装载地图 */
	this.loadMap = function(id) {
		_loadMap(id);
	};
	
	this.setMapPixelRect = function(x1, y1, x2, y2){
		m_mappixelrect.x1 = x1;
		m_mappixelrect.y1 = y1;
		m_mappixelrect.x2 = x2;
		m_mappixelrect.y2 = y2;
	};
	
	this.getMapPixelRect = function(){
		return {x:m_mappixelrect.x1, y:m_mappixelrect.y1, w:m_mappixelrect.x2 - m_mappixelrect.x1, h:m_mappixelrect.y2 - m_mappixelrect.y1};
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	/** 获得块大小　*/
	this.getBlocksize = function() {
		return m_blocksize;
	};
	
	/** 获得地图像素级大小  */
	this.getMapPixelSize = function() {
		return m_mappixelsize;
	};
	
	/** 获得地图视口 */
	this.getViewport = function() {
		return m_viewport;
	};
	
	/** 设置地图视口的位置 */
	this.setViewportPos = function(pos){
		_setViewportPos(pos);
		if ( m_caller ){
			m_caller.caller.call(m_caller.self, m_this.getViewport());
		}
	};
	
	/** 设置地图视口的尺寸 */
	this.setViewportSize = function(size){
		m_viewport.w = size.cx;
		m_viewport.h = size.cy;
	};
	
	/** 获得地图资源 */
	this.getMapRes = function() {
		return m_mapres;
	};
	
	/** 检查两点间是否可移动 */
	this.isRoutePassed = function(x1,y1,x2,y2) {
		return _isRoutePassed(x1,y1,x2,y2);
	};

	/** 返回按键首次按下的位置 */
	this.getMouseDownPos = function(){
		return m_mdownpos;
	};
	
	// private:method
	var _init = function(){
		_bindMouseEvent();
	};
	
	var _bindMouseEvent = function(){
		TQ.addEvent(m_mapdom, 'dragstart', function(e){return false;});
		TQ.addEvent(m_mapdom, 'selectstart', function(e){return false;});
		TQ.captureMouseEvent(m_mapdom, {self:m_this, mouseDown:_onMouseDown, mouseMove:_onMouseMove, mouseUp:_onMouseUp});
		TQ.captureTouchEvent(m_mapdom, {self:m_this, touchStart:_onTouchStart, touchMove:_onTouchMove, touchEnd:_onTouchEnd, touchCancel:_onTouchEnd});
	};
	
	var _onTouchStart  = function(e, touch){
		_startDrag({x:touch.pageX, y:touch.pageY});
	};
	
	var _onTouchMove  = function(e, touch){
		_moveInDrag({x:touch.pageX, y:touch.pageY});
	};
	
	var _onTouchEnd  = function(e, touch){
		_endDrag({x:touch.pageX, y:touch.pageY});
	};
	
	var _onMouseDown = function(e){
		_startDrag(TQ.mouseCoords(e));
	};
	
	var _onMouseMove = function(e){
		_moveInDrag(TQ.mouseCoords(e));
	};
	
	var _onMouseUp = function(e){
		_endDrag(TQ.mouseCoords(e));
	};
	
	var _startDrag = function(pos){
		m_mdownpos = pos;
		var viewport = m_this.getViewport();
		m_previewport.x = viewport.x;
		m_previewport.y = viewport.y;
		DragMapChecker.startDrag();
	};
	
	var _moveInDrag = function(mPos){
		var offx = mPos.x - m_mdownpos.x;
		var offy = mPos.y - m_mdownpos.y;
		if ( Math.abs(offx) > 2 || Math.abs(offy) > 2 ) {
			var viewx = m_previewport.x - offx;
			var viewy = m_previewport.y - offy;
			_setViewportPos({x:viewx, y:viewy});
			if ( m_caller ){
				m_caller.caller.call(m_caller.self, m_this.getViewport());
			}
		}
	};
	
	var _endDrag = function(pos){
		DragMapChecker.endDrag();
	};
	
	var _loadMap = function(id){
		if (id == m_mapid) return;
		m_mapid = id;
		m_mapres = ItemResUtil.findItemres(m_mapid);
		
		IMG.setBKImage(m_mapdom, IMG.makeImg('map/'+m_mapres.img));
		TQ.setDomSize(m_mapdom, m_mapres.mapsize.cx, m_mapres.mapsize.cy);
		m_mapdom.style.backgroundPosition = '0px 0px';
		
		m_mappixelsize.cx = m_mapres.mapsize.cx;
		m_mappixelsize.cy = m_mapres.mapsize.cy;
		
		m_mappixelrect.x1 = 0;
		m_mappixelrect.y1 = 0;
		m_mappixelrect.x2 = m_mapres.mapsize.cx;
		m_mappixelrect.y2 = m_mapres.mapsize.cy;
		
		m_mapObjsContainer.load(m_mapid);
	};
	
	var _setViewportPos = function(pos){
		m_viewport.x = Math.floor(pos.x);
		m_viewport.y = Math.floor(pos.y);
		
		if ( m_viewport.x < m_mappixelrect.x1 ){
			m_viewport.x = m_mappixelrect.x1;
		} else if ( (m_viewport.x + m_viewport.w) > m_mappixelrect.x2 ) {
			m_viewport.x = m_mappixelrect.x2 - m_viewport.w;
		}
		
		if ( m_viewport.y < m_mappixelrect.y1 ){
			m_viewport.y = m_mappixelrect.y1;
		} else if ( (m_viewport.y + m_viewport.h) > m_mappixelrect.y2 ) {
			m_viewport.y = m_mappixelrect.y2 - m_viewport.h;
		}
		
		TQ.setDomPos(m_mapdom, -m_viewport.x, -m_viewport.y);
	};
	//GameMap-unittest-end
});

MapObjsContainer = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_mapDom = null;
	_lc_.m_mapId = 0;
	_lc_.m_objDoms = [];
	_lc_.m_freeObjDoms = [];
	_lc_.m_anims = [];
	
	this.init = function(g, mapDom){
		_lc_.m_g = g;
		_lc_.m_mapDom = mapDom;
	};
	
	this.load = function(mapId){
		_lc_._saveMapId(mapId);
		_lc_._freeLastMapObjs();
		_lc_._loadMapObjs();
	};
	
	_lc_._saveMapId = function(mapId){
		_lc_.m_mapId = mapId;
	};
	
	_lc_._freeLastMapObjs = function(){
		_lc_._freeLastGifMapObjs();
		_lc_._freeLastAnimMapObjs();
	};
	
	_lc_._freeLastGifMapObjs = function(){
		for ( var i=0; i<_lc_.m_objDoms.length; ++i ) {
			var dom = _lc_.m_objDoms[i];
			TQ.setCSS ( dom , 'display', 'none' );
			_lc_.m_freeObjDoms.push(dom);
		}
		_lc_.m_objDoms = [];
	};	

	_lc_._freeLastAnimMapObjs = function(){
		for ( var i=0; i<_lc_.m_anims.length; ++i ) {
			_lc_.m_anims[i].stop();
		}
		_lc_.m_anims = [];
	};
	
	_lc_._loadMapObjs = function(){
		var res = TQ.find(res_mapobjs, 'id', _lc_.m_mapId);
		if ( !res ) return;
		
		for ( var i=0; i<res.objs.length; ++i ){
			var objres = res.objs[i];
			if (objres.type == 'gif'){
				_lc_._loadGifObj(objres);
			}
			else if (objres.type == 'anim'){
				_lc_._loadAnimObj(objres);
			}
		}
	};
	
	_lc_._loadGifObj = function(objres){
		var dom = _lc_._allocMapObjDom();
		IMG.setBKImage(dom, IMG.makeImg(objres.path));
		TQ.setDomRect(dom, objres.pos.x, objres.pos.y, objres.size.cx, objres.size.cy);
	};
	
	_lc_._loadAnimObj  =function(objres){
		var anim = _lc_.m_g.getAnimMgr().alloc(objres.animId);
		anim.setPosition(objres.pos);
		anim.play();
		_lc_.m_anims.push(anim);
	};
	
	_lc_._allocMapObjDom = function(){
		if ( _lc_.m_freeObjDoms.length == 0 ) {
			var dom = TQ.createDom('div');
			TQ.setClass(dom, 'map_fixobject');
			TQ.append(_lc_.m_mapDom, dom);
			_lc_.m_freeObjDoms.push(dom);
		}
		
		var dom = _lc_.m_freeObjDoms[_lc_.m_freeObjDoms.length-1];
		_lc_.m_freeObjDoms.length -= 1;
		TQ.setCSS ( dom , 'display', 'block' );
		_lc_.m_objDoms.push(dom);
		return dom;
	};	
	//MapObjsContainer-unittest-end
});
