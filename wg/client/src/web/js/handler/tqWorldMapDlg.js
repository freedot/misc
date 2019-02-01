/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
CreateWorldMapObjs = CreateMapObjs.extern(function(){
	this.setMyCity = function(id) {
		this.mycityid = id;
	};
	
	this.filter = function(objs) {
		for ( var i=0; i<objs.length; ++i ){
			var obj = objs[i];
			this.objs.push({id:obj.id, itemres:obj.itemres, pos:{x:obj.itemres.pos.x, y:obj.itemres.pos.y}});
		}	
	};
	
	this.getResId = function(id){
		if ( this.mycityid == id ) {
			return 1002;
		}
		else {
			return 1001;
		}
	};
});

BaseDlgEx = Class.extern(function(){
	this.isShow = function(){
		return this.dlg.isShow();
	};
});

WorldMapDlg = BaseDlgEx.extern(function(){
	var m_g=null;
	var m_this=null;	
	var m_items = {};
	var m_objs = null;
	this.init = function(g){
		m_this = this;
		m_g = g;
		this.dlg = null;
	};
	
	this.openDlg = function(){
		_initDlg();
	};
	
	this.clickCity = function(cityid){
		m_objs.clickObj(cityid);
	};
	
	var _initDlg = function(){
		if ( m_this.dlg ) {
			m_this.dlg.show();
		}
		else {
			m_this.dlg = Dialog.snew(m_g,{modal:true,
				//uiback:uiback.dlg.npc,
				uiback:uiback.dlg.minihelp,
				title:rstr.worldmapdlg.title,
				pos:{x:"center", y:10} });
			m_g.getGUI().initDlg(m_this.dlg, uicfg.worldmapdlg, m_items);
			_setBkImg();
			m_objs = CreateWorldMapObjs.snew(m_g, m_items.worldmap, {self:m_this, caller:_onClickMapObj});
			m_objs.setMyCity(m_g.getImgr().getRoleRes().cityid);
			m_objs.load(res_map_worlds.list);
		}
	};
	
	var _setBkImg = function(){
		var mapres = ItemResUtil.findItemres(FIXID.WORLDMAP);
		IMG.setBKImage(m_items.worldmap, IMG.makeImg('map/'+mapres.img));
	};
	
	var _onClickMapObj = function(id){
		MapSender.sendEnterCity(m_g, id);
		m_this.dlg.hide();
	};
});

