/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
// 游戏地图缩略图
SmallViewmap = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var m_this=null;
	_lc_.m_g=null;
	var m_caller=null;
	var m_mapdom=null;
	_lc_.m_viewblock=null;
	var m_eventdom=null;
	var m_mappixelsize={cx:137,cy:115};
	var m_largemappixelrect={x1:0, y1:0, x2:1, y2:1};
	var m_viewport={x:0,y:0,w:65,h:53};
	var m_largemapsize={cx:137,cy:115};

	//------------
	//public:method
	//------------
	/** 初始化 */
	this.init = function(g, mapdom, viewblock, eventdom){
		m_this = this;
		_lc_.m_g = g;
		m_mapdom = mapdom;
		_lc_.m_viewblock = viewblock;
		m_eventdom = eventdom;
		_init();	
	};
	
	/** 装载地图 */
	this.loadMap = function(id) {
		_loadMap(id);
	};
	
	this.setMapPixelRect = function(x1,y1,x2,y2){
		m_largemappixelrect.x1 = x1;
		m_largemappixelrect.y1 = y1;
		m_largemappixelrect.x2 = x2;
		m_largemappixelrect.y2 = y2;
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	/** 设置地图视口的位置 */
	this.setViewportPos = function(pos) {
		_setViewportPos(pos);
	};
	
	/** 获得地图像素级大小  */
	this.getMapPixelSize = function() {
		return m_mappixelsize;
	};
	
	/** 设置整个小地图的像素大小 */
	this.setMapPixelSize = function(size) {
		m_mappixelsize.cx = size.cx;
		m_mappixelsize.cy = size.cy;
	};

	/** 获得地图视口 */
	this.getViewport = function() {
		return m_viewport;
	};
	
	/** 设置视口大小 */
	this.setViewportSize = function(size) {
		_lc_._setViewportSize(size);
		_lc_._setViewBockSize();
	};
	
	/** 将大地图坐标转换成对应小地图上的坐标 */
	this.convertLTSPos = function(pos) {
		var off = _getLargetMapOffset();
		var largeSize = _getLargetMapSize();
		var x = parseInt(m_mappixelsize.cx*(pos.x - off.x)/largeSize.cx);
		var y = parseInt(m_mappixelsize.cy*(pos.y - off.y)/largeSize.cy);
		return {x:x,y:y};
	};
	
	/** 将小地图坐标转换成对应大地图上的坐标 */
	this.convertSTLPos = function(pos) {
		var off = _getLargetMapOffset();
		var largeSize = _getLargetMapSize();
		var x = parseInt(largeSize.cx*pos.x/m_mappixelsize.cx + off.x );
		var y = parseInt(largeSize.cy*pos.y/m_mappixelsize.cy + off.y );
		return {x:x,y:y};
	};
	
	//--------------
	// private:method
	//--------------
	var _init = function(){
		_bindMouseEvent();
	};
	
	var _bindMouseEvent = function(){
		TQ.addEvent(m_eventdom, 'dragstart', function(e){return false;});
		TQ.addEvent(m_eventdom, 'selectstart', function(e){return false;});
		TQ.captureMouseEvent(m_eventdom, {self:m_this, mouseDown:_onMouseDown, mouseMove:_onMouseMove});
		TQ.captureTouchEvent(m_eventdom, {self:m_this, touchStart:_onTouchStart, touchMove:_onTouchMove});
	};
	
	var _onMouseDown = function(e){
		_setViewPortByMousePos(e);
	};
	
	var _onMouseMove = function(e){
		_setViewPortByMousePos(e);
	};
	
	var _onTouchStart  = function(e, touch){
		_setViewPortByMousePos(TQ.makeMouseEvent(touch.pageX, touch.pageY, BTN_LEFT) );
	};
	
	var _onTouchMove  = function(e, touch){
		_setViewPortByMousePos(TQ.makeMouseEvent(touch.pageX, touch.pageY, BTN_LEFT) );
	};
	
	var _setViewPortByMousePos = function(e){
		var mPos = TQ.mouseRelativeCoords(m_eventdom, e);
		var sviewport = m_this.getViewport();
		var sx = parseInt(mPos.x - sviewport.w/2);
		var sy = parseInt(mPos.y - sviewport.h/2);
		_setViewportPos({x:sx,y:sy});
		if ( m_caller ){
			m_caller.caller.call(m_caller.self, m_this.getViewport());
		}
	};
	
	_lc_._setViewportSize = function(size){
		m_viewport.w = size.cx;
		m_viewport.h = size.cy;
	};
	
	_lc_._setViewBockSize = function(){
		var w = Math.max(5, m_viewport.w);
		var h = Math.max(5, m_viewport.h);	
		TQ.setDomSize(_lc_.m_viewblock, w, h);
	};	
	
	var _loadMap = function(id){
		m_mapid = id;
		m_mapres = ItemResUtil.findItemres(m_mapid);
		m_largemapsize.cx = m_mapres.mapsize.cx;
		m_largemapsize.cy = m_mapres.mapsize.cy;
		m_largemappixelrect.x1 = 0;
		m_largemappixelrect.y1 = 0;
		m_largemappixelrect.x2 = m_mapres.mapsize.cx;
		m_largemappixelrect.y2 = m_mapres.mapsize.cy;
		IMG.setBKImage(m_mapdom, IMG.makeImg('map/'+m_mapres.simg));
	};

	var _setViewportPos = function(pos){
		m_viewport.x = pos.x;
		m_viewport.y = pos.y;
		
		if ( m_viewport.x < 0 ){
			m_viewport.x = 0;
		}
		else if ( (m_viewport.x + m_viewport.w) > m_mappixelsize.cx ) {
			m_viewport.x = m_mappixelsize.cx - m_viewport.w;
		}
		
		if ( m_viewport.y < 0 ){
			m_viewport.y = 0;
		}
		else if ( (m_viewport.y + m_viewport.h) > m_mappixelsize.cy ) {
			m_viewport.y = m_mappixelsize.cy - m_viewport.h;
		}
		
		_lc_.m_viewblock.style.left = m_viewport.x+'px';
		_lc_.m_viewblock.style.top = m_viewport.y+'px';
	};
	
	var _getLargetMapOffset = function(){
		return {x:m_largemappixelrect.x1, y:m_largemappixelrect.y1};
	};
	
	var _getLargetMapSize = function(){
		return {cx:m_largemappixelrect.x2 - m_largemappixelrect.x1 , cy:m_largemappixelrect.y2 - m_largemappixelrect.y1};
	};
	//SmallViewmap-unittest-end
});

// 主界面中的小地图
SmallMapPanel = SmallViewmap.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var MAP_SMAP_W = 137; //? 偏移量如何产生的
	var MAP_SMAP_H = 115;
	
	var MAP_W = 149;
	var MAP_H = 146;

	var m_this = null;
	var m_g = null;
	var m_parent = null;
	var m_map = null;
	_lc_.m_items = {};
	
	this.init = function(g, dom){
		_lc_._initParams(this, g, dom);
		_lc_._createUIItems();
		_lc_._callSuperInit();
		this.setMapPixelSize({cx:MAP_SMAP_W, cy:MAP_SMAP_H});
	};
	
	this.setTitle = function(title){
		TQ.setTextEx(_lc_.m_items.title, title);
	};
	
	this.getMapSize = function(){
		return {cx:MAP_W, cy:MAP_H};
	};
	
	this.getMapEventDom = function(){
		return _lc_.m_items.smap_event;
	};
	
	_lc_._initParams = function(selfThis, g, dom){
		m_this = selfThis;
		m_g = g;
		m_parent = dom;
	};
	
	_lc_._createUIItems = function(){
		m_g.getGUI().initPanel(m_parent, uicfg.main.smallmap, _lc_.m_items);
		TQ.setCSS(_lc_.m_items.smap_viewblock_i, 'opacity', 15);
	};
	
	_lc_._callSuperInit = function(){
		// super的实现有问题，只能在一层次的继承中调用，慎用！！！
		// 当 init(...)的参数中又调用了当前层次的方法，下面的保护措施将发生错误。
		// 目前还想不到好的方法，所以慎用！！！
		var Super = m_this.Super;
		m_this.Super = m_this.Super.Super;
		Super.init(m_g, _lc_.m_items.smallmap, _lc_.m_items.smap_viewblock, _lc_.m_items.smap_event);
		m_this.Super = Super;
	};
	//SmallMapPanel-unittest-end
});
