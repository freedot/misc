/*******************************************************************************/
CommMapPanel = Class.extern(function(){
	//CommMapPanel-unittest-start
	var MAP_SCENE_W = 2048;
	var MAP_SCENE_H = 1536;
	var m_g=null;
	var m_this=null;
	var m_gamemap=null;
	var m_smallmap=null;
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
		_loadMap(id);
	};
	
	this.setMapPixelRect = function(x1, y1, x2, y2){
		m_gamemap.setMapPixelRect(x1, y1, x2, y2);
		m_smallmap.setMapPixelRect(x1, y1, x2, y2);
	};
	
	this.getMapPixelRect = function(){
		return m_gamemap.getMapPixelRect();
	};
	
	this.setName = function(name){
		m_smallmap.setTitle(name);
	};
	
	this.setViewportPos = function(pos){
		m_gamemap.setViewportPos(pos);
		m_smallmap.setViewportPos(m_smallmap.convertLTSPos(m_gamemap.getViewport()));
	};
	
	this.setLastViewport = function(pos){
		m_lastViewPort.x = pos.x;
		m_lastViewPort.y = pos.y;
	};
	
	this.getLastViewport = function(pos){
		return m_lastViewPort;
	};
	
	this.getViewport = function(){
		if ( !m_gamemap ) {
			return {x:0, y:0, w:MAP_SCENE_W, h:MAP_SCENE_H};
		}
		
		return m_gamemap.getViewport();
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
		var lastPos = m_gamemap.getMouseDownPos();
		var pos = TQ.mouseCoords(e);
		return (Math.abs(lastPos.x - pos.x) > 8) || (Math.abs(lastPos.y - pos.y) > 8);
	};
	
	this.resetSMapCaller = function(){
		_setObjectCallback();
	};
	
	this.resize = function(size){
		if ( !m_gamemap ) return;
		m_gamemap.setViewportSize(size);
	};
	
	this.setActive = function(isActive){
		m_isActive = isActive;
	};
	
	this.isActive = function(){
		return m_isActive;
	};
	
	this.resetViewPos = function(){
		var viewPort = m_gamemap.getViewport();
		m_gamemap.setViewportPos({x:viewPort.x, y:viewPort.y});
		
		_resetSmallMap();
		m_smallmap.setViewportPos( m_smallmap.convertLTSPos(viewPort) );
	};
	
	this.setLastViewPort = function(){
		m_this.setViewportPos(m_lastViewPort);
		_resetSmallMap();
	};

	var _initAfterLoginOk = function() {
		_createSomeObjects();
		_setMapSizeAndViewPort();
		_setObjectCallback();
	};
	
	var _createSomeObjects = function(){
		m_gamemap = GameMap.snew(m_g, m_items.mapscene);
		m_smallmap = UIM.getPanel('smallmap');
	};
	
	var _setMapSizeAndViewPort = function(){
		m_gamemap.setViewportPos({x:0,y:0});
		var size = m_g.getWinSizer().getValidClientSize();
		m_gamemap.setViewportSize({cx:size.cx, cy:size.cy});
	};
	
	var _setObjectCallback = function(){
		m_gamemap.setCaller({self:m_this, caller:_onSceneMapViewPortChange});
		m_smallmap.setCaller({self:m_this, caller:_onSmallmapViewPortChange});
	};
	
	var _onSceneMapViewPortChange = function(viewport){
		if ( !m_isshow ) { 
			return;
		}
		
		m_smallmap.setViewportPos( m_smallmap.convertLTSPos(viewport) );
		if (m_viewportcaller) m_viewportcaller.caller.call(m_viewportcaller.self, viewport);
	};
	
	var _onSmallmapViewPortChange = function(viewport) {
		if ( !m_isshow ) {
			return;
		}
		
		m_gamemap.setViewportPos( m_smallmap.convertSTLPos(viewport) );
		if (m_viewportcaller) m_viewportcaller.caller.call(m_viewportcaller.self, m_gamemap.getViewport());
	};
	
	var _loadMap = function(id){
		m_gamemap.loadMap(id);
		m_smallmap.loadMap(id);
		m_this.setLastViewPort();
	};
	
	var _resetSmallMap = function() {
		var mapsize = m_gamemap.getMapPixelSize();
		var viewport = m_gamemap.getViewport();
		var smapsize = m_smallmap.getMapPixelSize();
		var sviewsize = {cx:0,cy:0};
		sviewsize.cx = parseInt(viewport.w/mapsize.cx*smapsize.cx);
		sviewsize.cy = parseInt(viewport.h/mapsize.cy*smapsize.cy);
		m_smallmap.setViewportSize(sviewsize);
	};	
	//CommMapPanel-unittest-end
});
