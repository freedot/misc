/*******************************************************************************/
CommMapPanel = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var MAP_SCENE_W = 2048;
	var MAP_SCENE_H = 1536;
	var m_g=null;
	var m_this=null;
	_lc_.m_gamemap=null;
	_lc_.m_smallmap=null;
	var m_items={};
	var m_viewportcaller=null;
	var m_lastViewPort = {x:0, y:0};
	var m_isshow=true;
	var m_isActive=false;
	
	this.init = function(g, dom){
		m_g = g;
		m_this = this;
		m_g.getGUI().initPanel(dom, uicfg.main.mappanel, m_items);
	};
	
	this.getItems = function(){
		return m_items;
	};
	
	this.create = function(){
		_initAfterLoginOk();
	};
	
	this.loadMap = function(id, name){
		this.setName(name);
		this.setActive(true);
		_lc_._loadMap(id);
	};
	
	this.setMapPixelRect = function(x1, y1, x2, y2){
		_lc_.m_gamemap.setMapPixelRect(x1, y1, x2, y2);
		_lc_.m_smallmap.setMapPixelRect(x1, y1, x2, y2);
	};
	
	this.getMapPixelRect = function(){
		return _lc_.m_gamemap.getMapPixelRect();
	};
	
	this.setName = function(name){
		_lc_.m_smallmap.setTitle(name);
	};
	
	this.setViewportPos = function(pos){
		_lc_.m_gamemap.setViewportPos(pos);
		_lc_.m_smallmap.setViewportPos(_lc_.m_smallmap.convertLTSPos(_lc_.m_gamemap.getViewport()));
	};
	
	this.setLastViewport = function(pos){
		m_lastViewPort.x = pos.x;
		m_lastViewPort.y = pos.y;
	};
	
	this.getLastViewport = function(pos){
		return m_lastViewPort;
	};
	
	this.getViewport = function(){
		if ( !_lc_.m_gamemap ) {
			return {x:0, y:0, w:MAP_SCENE_W, h:MAP_SCENE_H};
		}
		
		return _lc_.m_gamemap.getViewport();
	};
	
	this.show = function(){
		TQ.setCSS(m_items.gamemap, 'visibility', 'visible');
		TQ.setCSS(m_items.gamemap, 'display', 'block');
		m_isshow = true;
	};
	
	this.hide = function(){
		TQ.setCSS(m_items.gamemap, 'visibility', 'hidden');
		TQ.setCSS(m_items.gamemap, 'display', 'none');	
		
		var viewPort = m_this.getViewport();
		m_lastViewPort.x = viewPort.x;
		m_lastViewPort.y = viewPort.y;
		
		m_isshow = false;
	};
	
	this.isShow = function(){
		return m_isshow;
	};
	
	this.setViewportCaller = function(caller){
		m_viewportcaller = caller;
	};
	
	this.isDragged = function(e){
		var lastPos = _lc_.m_gamemap.getMouseDownPos();
		var pos = TQ.mouseCoords(e);
		return (Math.abs(lastPos.x - pos.x) > 8) || (Math.abs(lastPos.y - pos.y) > 8);
	};
	
	this.resetSMapCaller = function(){
		_setObjectCallback();
	};
	
	this.resize = function(size){
		if ( !_lc_.m_gamemap ) return;
		_lc_.m_gamemap.setViewportSize(size);
	};
	
	this.setActive = function(isActive){
		m_isActive = isActive;
	};
	
	this.isActive = function(){
		return m_isActive;
	};
	
	this.resetViewPos = function(){
		var viewPort = _lc_.m_gamemap.getViewport();
		_lc_.m_gamemap.setViewportPos({x:viewPort.x, y:viewPort.y});
		
		_lc_._resetSmallMap();
		_lc_.m_smallmap.setViewportPos( _lc_.m_smallmap.convertLTSPos(viewPort) );
	};
	
	this.setLastViewPort = function(){
		m_this.setViewportPos(m_lastViewPort);
		_lc_._resetSmallMap();
	};

	var _initAfterLoginOk = function() {
		_createSomeObjects();
		_setMapSizeAndViewPort();
		_setObjectCallback();
	};
	
	var _createSomeObjects = function(){
		_lc_.m_gamemap = GameMap.snew(m_g, m_items.mapscene);
		_lc_.m_smallmap = UIM.getPanel('smallmap');
	};
	
	var _setMapSizeAndViewPort = function(){
		_lc_.m_gamemap.setViewportPos({x:0,y:0});
		var size = m_g.getWinSizer().getValidClientSize();
		_lc_.m_gamemap.setViewportSize({cx:size.cx, cy:size.cy});
	};
	
	var _setObjectCallback = function(){
		_lc_.m_gamemap.setCaller({self:m_this, caller:_onSceneMapViewPortChange});
		_lc_.m_smallmap.setCaller({self:m_this, caller:_onSmallmapViewPortChange});
	};
	
	var _onSceneMapViewPortChange = function(viewport){
		if ( !m_isshow ) { 
			return;
		}
		
		_lc_.m_smallmap.setViewportPos( _lc_.m_smallmap.convertLTSPos(viewport) );
		if (m_viewportcaller) m_viewportcaller.caller.call(m_viewportcaller.self, viewport);
	};
	
	var _onSmallmapViewPortChange = function(viewport) {
		if ( !m_isshow ) {
			return;
		}
		
		_lc_.m_gamemap.setViewportPos( _lc_.m_smallmap.convertSTLPos(viewport) );
		if (m_viewportcaller) m_viewportcaller.caller.call(m_viewportcaller.self, _lc_.m_gamemap.getViewport());
	};
	
	_lc_._loadMap = function(id){
		_lc_.m_gamemap.loadMap(id);
		_lc_.m_smallmap.loadMap(id);
		m_this.setLastViewPort();
	};
	
	_lc_._resetSmallMap = function() {
		var mapsize = _lc_.m_gamemap.getMapPixelSize();
		var viewport = _lc_.m_gamemap.getViewport();
		var smapsize = _lc_.m_smallmap.getMapPixelSize();
		var sviewsize = {cx:0,cy:0};
		sviewsize.cx = parseInt(viewport.w/mapsize.cx*smapsize.cx);
		sviewsize.cy = parseInt(viewport.h/mapsize.cy*smapsize.cy);
		_lc_.m_smallmap.setViewportSize(sviewsize);
	};	
	//CommMapPanel-unittest-end
});
