/*******************************************************************************/
CreateMapObjs = Class.extern(function(){
	var m_g = null;
	var m_this = null;
	var m_dom = null;
	var m_caller = null;
	this.init = function(g, dom, caller){
		m_g = g;
		m_dom = dom;
		m_caller = caller;
		m_this = this;
		this.objs = [];
	};
	
	this.load = function(objs){
		this.unload();
		ItemResUtil.initItemsres(objs, 'id');
		this.objs = objs;
		this.filter(objs);
		_createMapObjs();
	};
	
	this.unload = function(){
		for ( var i=0; i<this.objs.length; ++i ){
			var obj = this.objs[i];
			if ( obj.obj ){
				m_g.getEntityfactory().freeMapObj(obj.obj);
				obj.obj = null;
			}	
		}
		this.objs = [];
	};
	
	this.clickObj = function(objid){
		var obj = TQ.find(this.objs, 'id', objid);
		obj.obj.click();
	};	

	this.filter = function(objs){};
		
	this.getObjDom = function(objId){
		for ( var i=0; i<m_this.objs.length; ++i ){
			var obj = m_this.objs[i].obj;
			if ( obj.getId() == objId ) {
				return obj.getEntity().getDomObj();
			}
		}
		return null;
	};
	
	var _createMapObjs = function(){
		for ( var i=0; i<m_this.objs.length; ++i ){
			_createMapObj(m_this.objs[i]);
		}
	};
	
	var _createMapObj = function(obj){
		if ( !obj.obj ){
			obj.obj = m_g.getEntityfactory().allocMapObj(m_dom);
		}
		obj.obj.setNameTagImg(IMG.makeImg('npc/' + obj.itemres.resId + '_tag.png'));
		obj.obj.setId(obj.id);
		obj.obj.setResId(obj.itemres.resId);
		obj.obj.setSize(obj.itemres.size);
		obj.obj.setCaller(m_caller);
		obj.obj.setPos(obj.pos);
	};
});

StateCityPanel = CommMapPanel.extern(function(){
	//private:data
	var m_this=null;
	var m_g=null;
	var m_items={};
	var m_mapid=0;
	var m_lastview={};
	var m_citys = [];
	var m_objs = null;
	
	this.init = function(g, dom){
		m_this = this;
		m_g = g;
		this.Super.init(g, dom);
		m_items = this.Super.getItems();
		m_g.regEvent(EVT.LOGIN_OK, 0, m_this, _onLoginOk);
		m_g.regEvent(EVT.NET, NETCMD.MAP, m_this, _onSvrPkg);
		ItemResUtil.initItemsres(res_map_worlds.list, 'id');
		m_objs = CreateMapObjs.snew(m_g, m_items.mapscene, {self:m_this, caller:_onClickMapObj});
	};
	
	this.getActTowerDom = function(){
		return m_objs.getObjDom(FIXID.ACT_TOWER_NPC);
	};
	
	var _onLoginOk = function(){
		m_this.create();
	};
	
	var _onSvrPkg = function(netevent){
		var pkg = netevent.data;
		if ( pkg.entercity ){
			_onHandleEnterCity(pkg.entercity);
		}
		if ( pkg.npcs ){
			_onHandleNpcs(pkg.npcs);
		}
		if ( pkg.mapview ) {
			m_g.getImgr().setMapView(pkg.mapview.x1,pkg.mapview.y1,pkg.mapview.x2,pkg.mapview.y2);
		}
	};
	
	var _loadCityMap = function(id){
		var cityname = '['+TQ.find(res_map_worlds.list, 'id', id).itemres.name+']';
		var npcs = TQ.find(m_citys, 'id', id).npcs;
		_loadMap(id, cityname, npcs);
		m_g.getImgr().setCurLoadCity(id);
		m_this.resetSMapCaller();
	};
	
	var _loadMap = function(id, name, nodes){
		_backupViewPortByMapId(m_mapid);
		m_this.loadMap(id, name);
		m_objs.load(nodes);
		m_this.setViewportPos(_getLastviewByMapId(id));
		m_mapid = id;
	};
	
	var _getLastviewByMapId = function(mapid){
		if ( !m_lastview[mapid] ) {
			var size = m_g.getWinSizer().getValidClientSize();
			var center = {x:907, y:468};
			var x = Math.max(0, (center.x - size.cx/2));
			var y = Math.max(0, (center.y - size.cy/2));
			m_lastview[mapid] = {x:x,y:y};
		}
		return m_lastview[mapid];
	};
	
	var _backupViewPortByMapId = function(mapid){
		if ( mapid == 0 ) return;
		var v = m_this.getViewport();
		m_lastview[mapid] = {x:v.x,y:v.y};
	};
	
	var _onHandleEnterCity = function(entercity) {
		var city = TQ.find(m_citys, 'id', entercity.id);
		if ( !city ) {
			m_citys.push({id:entercity.id, npcs:[]});
		}
		UIM.closeMapPanels();
		UIM.getPanel('statecity').show();
		_loadCityMap(entercity.id);
		SoundMgr.playBackSound(res_baksounds.stateCity);
		HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
	};
	
	var _onHandleNpcs = function(npcs){
		var city = TQ.find(m_citys, 'id', npcs.cityid);
		city.npcs = npcs.add;
		m_objs.load(city.npcs);
		HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
	};
	
	var _onClickMapObj = function(id) {
		if ( id == FIXID.ACT_TOWER_NPC ) {
			UIM.openActTowerDlg();
			HelpGuider.sendHelpTip(m_g, HelpGuider.HELP_TIP.ACTTOWER_FIGHT);
			HelpGuider.hideAllSpirits();
		} else if ( id == FIXID.ACT_TERRACE_NPC ) {
			UIM.openActTerraceDlg();
		} else if ( id == FIXID.ACT_WORLD_BOSS ) {
			UIM.openDlg('worldboss');
		}
	};
});