/** 游戏中的Entity */
Entity = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_parentdom;
	var m_pos;
	var m_domobj;
	var m_size;
	var m_domtype;
	var m_entitytype;
	
	//------------
	//public:method
	//------------
	/** 构造函数 */
	this.init = function(g,parentdom){
		m_g = g;
		m_parentdom = parentdom;
		m_domobj = null;
		m_pos = {x:0,y:0};
		m_size = {cx:32, cy:32};
		m_domtype = 'img';
		m_entitytype = 'avatar';
	};
	
	/** 设置实体的dom类型 */
	this.setDomType = function(type) {
		m_domtype = type;
	};
	
	/** 设置实体的类型 */
	this.setType = function(type) {
		m_entitytype = type;
	};
	
	/** 设置dom的class */
	this.setClass = function(cname) {
		m_domobj.className = cname;
	};
	
	/** 创建实体 */
	this.create = function(){
		m_domobj = document.createElement(m_domtype);
		m_parentdom.appendChild(m_domobj);
		m_domobj.style.zIndex = '1';
		m_domobj.style.position = 'absolute';
	};
	
	/** 销毁实体 */
	this.destroy = function() {
		if ( m_domobj != null ) {
			m_parentdom.removeChild(m_domobj);
			m_domobj = null;
		}
		m_parentdom = null; // 取消对parentdom的引用，ie6bug
	};
	
	/** 设置实体的大小 */
	this.setSize = function(size) {
		m_size.cx = size.cx;
		m_size.cy = size.cy;
		TQ.setDomSize(m_domobj, m_size.cx, m_size.cy);
	};
	
	/** 获得实体的大小 */
	this.getSize = function() {
		return m_size;
	};
	
	/** 设置位置 */
	this.setPos = function(pos){
		m_pos.x = pos.x; 
		m_pos.y = pos.y;
		TQ.setDomPos(m_domobj, m_pos.x, m_pos.y);
	};
	
	/** 显示当前对象 */
	this.show = function() {
		if ( m_domobj != null ) {
			m_domobj.style.display = 'block';
		}
	};

	/** 隐藏当前对象 */
	this.hide = function() {
		if ( m_domobj != null ) {
			m_domobj.style.display = 'none';
		}
	};
	
	/** 设置图像资源 */
	this.setRes = function(resid,tag){
		tag = tag ? tag : '';
		var imageid = resid + tag;
		var imgsrc = m_entitytype+'/'+imageid;
		imgsrc += '.gif';
		this.setImage(IMG.makeImg(imgsrc));
	};
	
	/** 设置图像 */
	this.setImage = function(imgsrc) {
		if ( m_domtype == 'img' ) {
			m_domobj.src = imgsrc;
		} else if ( m_domtype == 'bkimg') {
			IMG.setBKImage(m_domobj, imgsrc);
		}
	};
	
	/** 设置背景图像 */
	this.setBKImage = function(imgsrc) {
		IMG.setBKImage(m_domobj, imgsrc);
	};
	
	/** 获得domobj对象 */
	this.getDomObj = function() {
		return m_domobj;
	};
	
	/** 设置entity的zorder */
	this.setZOrder = function(zorder) {
		m_domobj.style.zIndex = zorder.toString();
	};
	
	/** 设置entity的alpha */
	this.setAlpha = function(alpha) {
		TQ.setCSS(m_domobj, 'opacity', parseInt(alpha*100));
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};

/** 进度条对象 */
ProgressBar = function(){
	//-----------
	//private:data
	//-----------
	var m_parentdom;
	var m_entity;
	var m_curval;
	var m_maxval;
	
	//------------
	//public:method
	//------------
	/** 构造函数 */
	this.init = function(g,parentdom){
		m_parentdom = parentdom;
		m_entity = new Entity(g,m_parentdom);
		m_curval = 0;
		m_maxval = 100;
	};

	/** 设置进度条的值 */
	this.setMaxVal = function(val) {
		m_maxval = val;
		this.refreshBar();
	};
	
	this.getMaxVal = function() {
		return m_maxval;
	};
	
	/** 设置进度条的值 */
	this.setVal = function(val) {
		m_curval = val;
		this.refreshBar();
	};
	
	this.getVal = function() {
		return m_curval;
	};
	
	/** 刷新bar的显示 */
	this.refreshBar = function() {
		var size = m_entity.getSize();
		var perpixel = parseInt(size.cx*m_curval/m_maxval)-size.cx;
		var domobj = m_entity.getDomObj();
		domobj.style.backgroundPosition = perpixel+'px 50%';
	};
	
	/** 设置实体的大小 */
	this.setSize = function(size) {
		m_entity.setSize(size);
	};
	
	/** 创建实体 */
	this.create = function() {
		m_entity.create();
	};
	
	/** 销毁实体 */
	this.destroy = function() {
		m_entity.destroy();
	};
	
	/** 获得实体 */
	this.getEntity = function() {
		return m_entity;
	};
	
	/** 设置位置 */
	this.setPos = function(pos){
		m_entity.setPos(pos);
	};
	
	/** 设置进度条边界图像 */
	this.setBarBorder = function(imgsrc){
		m_entity.setImage(imgsrc);
	};
	
	/** 设置进度条的图像 */
	this.setBarImage = function(imgsrc) {
		m_entity.setBKImage(imgsrc);
	};
	
	/** 设置ProgressBar的zorder */
	this.setZOrder = function(zorder) {
		m_entity.setZOrder(zorder);
	};
	
	/** 显示当前对象 */
	this.show = function() {
		m_entity.show();
	};
	
	/** 隐藏当前对象 */
	this.hide = function() {
		m_entity.hide();
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);	
};

/** 帧特效 */
FrameEffect = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_parentdom;
	var m_entity;
	var m_pos;
	var m_starttime;
	var m_isEnd;
	var m_durition=0;
	
	//------------
	//public:method
	//------------
	/** 构造函数 */
	this.init = function(g, parentdom){
		m_parentdom = parentdom;
		m_entity = new Entity(g,m_parentdom);
		m_pos = {x:0,y:0};
		m_g = g;
		m_starttime = 0;
		m_isEnd = false;
	};
	
	this.setDurition = function(durition){
		m_durition = durition;
	};
	
	/** 设置实体的大小 */
	this.setSize = function(size) {
		m_entity.setSize(size);
	};
	
	/** 创建实体 */
	this.create = function() {
		m_entity.setDomType('div');
		m_entity.create();
		m_starttime = m_g.getCurTimeMs();
	};
	
	/** 销毁实体 */
	this.destroy = function() {
		m_entity.destroy();
	};
	
	this.setBKImage = function(img){
		m_entity.setBKImage(img);
	};
	
	/** 获得实体 */
	this.getEntity = function() {
		return m_entity;
	};
	
	/** 设置位置 */
	this.setPos = function(pos){
		m_pos.x = pos.x;
		m_pos.y = pos.y;
		m_entity.setPos(pos);
	};
	
	/** 设置zorder */
	this.setZOrder = function(zorder) {
		m_entity.setZOrder(zorder);
	};
	
	/** 更新数字特效 */
	this.update = function(curTime) {
		var t = curTime - m_starttime;
		if ( t >= m_durition ){
			m_isEnd = true;
		}
	};
	
	/** 开始特效的播放 */
	this.start = function() {
		m_starttime = EUPD.getTime();
		m_isEnd = false;
	};
	
	/** 特效是否结束 */
	this.isEnd = function() {
		return m_isEnd;
	};
	
	/** 显示当前对象 */
	this.show = function() {
		m_entity.show();
	};
	
	/** 隐藏当前对象 */
	this.hide = function() {
		m_entity.hide();
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);	
};

/** 数字特效 */
NumberEffect = function(){
	//-----------
	//private:const 
	//-----------
	var UP_SPEED_ADD = 0.08;
	var UP_SPEED = 50;
	var UP_DIS = 80;
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_parentdom;
	var m_entity;
	var m_backentity;
	var m_pos;
	var m_starttime;
	var m_isEnd;
	var m_speed=UP_SPEED;
	
	//------------
	//public:method
	//------------
	/** 构造函数 */
	this.initialize = function(g, parentdom){
		m_parentdom = parentdom;
		m_entity = new Entity(g,m_parentdom);
		m_backentity = new Entity(g,m_parentdom);
		m_pos = {x:0,y:0};
		m_g = g;
		m_starttime = 0;
		m_isEnd = false;
	};
	
	/** 设置显示的数字 */
	this.setNumber = function(num){
		var dom = m_entity.getDomObj();
		dom.innerHTML = num;
		dom = m_backentity.getDomObj();
		dom.innerHTML = num;
	};
	
	/** 设置实体的大小 */
	this.setSize = function(size) {
		m_entity.setSize(size);
		m_backentity.setSize(size);
	};
	
	/** 创建实体 */
	this.create = function() {
		m_entity.setDomType('div');
		m_entity.create();
		m_starttime = m_g.getCurTimeMs();
		m_backentity.setDomType('div');
		m_backentity.create();
		m_backentity.setClass('upnumback');
	};
	
	/** 销毁实体 */
	this.destroy = function() {
		m_entity.destroy();
		m_backentity.destroy();
	};
	
	/** 获得实体 */
	this.getEntity = function() {
		return m_entity;
	};
	
	/** 获得实体的背景 */
	this.getBakEntity = function() {
		return m_backentity;
	};
	
	/** 设置位置 */
	this.setPos = function(pos){
		m_pos.x = pos.x;
		m_pos.y = pos.y;
		m_entity.setPos(pos);
		m_backentity.setPos({x:pos.x+1,y:pos.y+1});
	};
	
	/** 设置zorder */
	this.setZOrder = function(zorder) {
		m_entity.setZOrder(zorder);
		m_backentity.setZOrder(zorder-1);
	};
	
	/** 更新数字特效 */
	this.update = function(curTime) {
		var t = curTime - m_starttime;
		var speed = UP_SPEED_ADD*t;
		speed = (speed < m_speed) ? speed : m_speed;
		
		var y = parseInt(t*speed/1000, 10);
		if ( y >= UP_DIS ) {
			y = UP_DIS;
			m_isEnd = true;
		}
		
		var alphah = UP_DIS/2;
		var alpha = 1.0;
		if ( y > alphah ){
			alpha = 1.0 - (y-alphah)/alphah;
		}
		m_entity.setPos({x:m_pos.x,y:m_pos.y-y});
		m_entity.setAlpha(alpha);
		m_backentity.setPos({x:m_pos.x+1,y:m_pos.y-y+1});
		m_backentity.setAlpha(alpha);
	};
	
	/** 开始特效的播放 */
	this.start = function() {
		m_starttime = EUPD.getTime();
		m_isEnd = false;
	};
	
	/** 特效是否结束 */
	this.isEnd = function() {
		return m_isEnd;
	};
	
	/** 显示当前对象 */
	this.show = function() {
		m_entity.show();
		m_backentity.show();
	};
	
	/** 隐藏当前对象 */
	this.hide = function() {
		m_entity.hide();
		m_backentity.hide();
	};
	
	this.setSpeed = function(speed){
		m_speed = speed;
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);	
};

ImageEffect = function(){ // for role upgrade, city upgrade
	var UP_SPEED_ADD = 0.2;
	var UP_SPEED = 120;
	var UP_DIS = 280;
	
	var m_g;
	var m_parentdom;
	var m_entity;
	var m_pos;
	var m_starttime;
	var m_isEnd;
	var m_speed=UP_SPEED;
	
	/** 构造函数 */
	this.initialize = function(g, parentdom){
		m_parentdom = parentdom;
		m_entity = new Entity(g,m_parentdom);
		m_pos = {x:0,y:0};
		m_g = g;
		m_starttime = 0;
		m_isEnd = false;
	};
	
	this.setImageClass = function(imageCls){
		m_entity.setClass(imageCls);
	};
	
	/** 设置实体的大小 */
	this.setSize = function(size) {
		m_entity.setSize(size);
	};
	
	/** 创建实体 */
	this.create = function() {
		m_entity.setDomType('div');
		m_entity.create();
		m_starttime = m_g.getCurTimeMs();
	};
	
	/** 销毁实体 */
	this.destroy = function() {
		m_entity.destroy();
	};
	
	/** 获得实体 */
	this.getEntity = function() {
		return m_entity;
	};
	
	/** 设置位置 */
	this.setPos = function(pos){
		m_pos.x = pos.x;
		m_pos.y = pos.y;
		m_entity.setPos(pos);
	};
	
	/** 设置zorder */
	this.setZOrder = function(zorder) {
		m_entity.setZOrder(zorder);
	};
	
	/** 更新数字特效 */
	this.update = function(curTime) {
		var t = curTime - m_starttime;
		var speed = UP_SPEED_ADD*t;
		speed = (speed < m_speed) ? speed : m_speed;
		
		var y = parseInt(t*speed/1000, 10);
		if ( y >= UP_DIS ) {
			y = UP_DIS;
			m_isEnd = true;
		}
		
		var alphah = UP_DIS/2;
		var alpha = 1.0;
		if ( y > alphah ){
			alpha = 1.0 - (y-alphah)/alphah;
		}
		m_entity.setPos({x:m_pos.x,y:m_pos.y-y});
		if ( !TQ.isIE6() && !TQ.isIE7() && !TQ.isIE8() ) {
			m_entity.setAlpha(alpha);
		}
	};
	
	/** 开始特效的播放 */
	this.start = function() {
		m_starttime = EUPD.getTime();
		m_isEnd = false;
	};
	
	/** 特效是否结束 */
	this.isEnd = function() {
		return m_isEnd;
	};
	
	/** 显示当前对象 */
	this.show = function() {
		m_entity.show();
	};
	
	/** 隐藏当前对象 */
	this.hide = function() {
		m_entity.hide();
	};
	
	this.setSpeed = function(speed){
		m_speed = speed;
	};
	
	this.initialize.apply(this, arguments);	
};

/** 地图中的物件对象 */
MapObject = function(){
	//-----------
	//private:const
	//-----------
	var C_NAMETAG_H = -7;
	
	//-----------
	//private:data
	//-----------
	var m_this=null;
	var m_g=null;
	var m_parentdom=null;
	var m_id=0;
	var m_entity=null;
	var m_nametag=null;
	var m_caller=null;
	var m_resid = 0;
	
	//------------
	//public:method
	//------------
	/** 构造函数 */
	this.initialize = function(g,parentdom){
		m_this = this;
		m_g = g;
		m_parentdom = parentdom;
	};
	
	this.getEntity = function(){
		return m_entity;
	};
	
	this.setName = function(name){
		var dom = m_nametag.getDomObj();
		TQ.setTextEx(dom, name);
	};
	
	this.setNameTagImg = function(img){
		var dom = m_nametag.getDomObj();
		IMG.setBKImage(dom, img);
		TQ.fixIE6Png(dom);
	};
	
	this.setId = function(id) {
		m_id = id;
	};
	
	this.getId = function(id){
		return m_id;
	};
	
	this.setResId = function(resid){
		_setResId(resid);
	};
	
	this.setSize = function(size){
		m_entity.setSize(size);
	};
	
	/** 创建实体 */
	this.create = function() {
		_createEntity();
		_createNameTag();
	};
	
	/** 销毁实体 */
	this.destroy = function() {
		_destroyEntity();
		_destroyNameTag();
	};
	
	/** 设置位置 */
	this.setPos = function(pos){
		_setPos(pos);
	};
	
	/** 设置响应点击事件的回调 */
	this.setCaller = function(caller) {
		m_caller = caller;
	};
	
	this.show = function(){
		m_entity.show();
		m_nametag.show();
	};
	
	this.hide = function(){
		m_entity.hide();
		m_nametag.hide();		
	};
	
	this.click = function(){
		_onEntityClick(null);
	};
	
	//------------
	//private:method
	//------------
	var _onEntityMouseOver = function(e){
		_high();
	};
	
	var _onEntityMouseOut = function(e){
		_unHigh();
	};
	
	var _onEntityClick = function(e){
		if ( m_caller ){
			m_caller.caller.call(m_caller.self, m_id);
		}
	};
	
	var _onNameTagMouseOver = function(e){
		_high();
	};
	
	var _onNameTagMouseOut = function(e){
		_unHigh();
	};
	
	var _onNameTagClick = function(e){
		if ( m_caller ){
			m_caller.caller.call(m_caller.self, m_id);
		}
	};
	
	var _createEntity = function(){
		m_entity = new Entity(m_g, m_parentdom);
		m_entity.setType('npc');
		_createInnerObj(m_entity, 'bkimg', _onEntityMouseOver, _onEntityMouseOut, _onEntityClick);
	};
	
	var _createNameTag = function(){
		m_nametag = new Entity(m_g, m_parentdom);
		_createInnerObj(m_nametag, 'div', _onNameTagMouseOver, _onNameTagMouseOut, _onNameTagClick);
		m_nametag.setClass('map_objecttag');
	};
	
	var _destroyEntity = function(){
		_destroyInnerObj(m_entity, _onEntityMouseOver, _onEntityMouseOut, _onEntityClick);
	};
	
	var _destroyNameTag = function(){
		_destroyInnerObj(m_entity, _onNameTagMouseOver, _onNameTagMouseOut, _onNameTagClick);
	};
	
	var _createInnerObj = function(obj, domtype, mouseOver, mouseOut, click){
		obj.setDomType(domtype);
		obj.create();
		var dom = obj.getDomObj();
		TQ.addEvent(dom, 'mouseover', mouseOver);
		TQ.addEvent(dom, 'mouseout', mouseOut);
		TQ.addEvent(dom, 'click', click);
	};	
	
	var _destroyInnerObj = function(obj, mouseOver, mouseOut, click){
		var dom = obj.getDomObj();
		TQ.removeEvent(dom, 'mouseover', mouseOver);
		TQ.removeEvent(dom, 'mouseout', mouseOut);
		TQ.removeEvent(dom, 'click', click);
		obj.destroy();		
	};
	
	var _setPos = function(pos){
		m_entity.setPos(pos);
		var sz = m_entity.getSize();
		m_nametag.setPos({x:(pos.x+sz.cx/2-60), y:(pos.y + 30 -C_NAMETAG_H)});
	};
	
	var _setResId = function(resid){
		m_resid = resid;
		m_entity.setRes(m_resid);
	};
	
	var _high = function(){
		m_entity.setRes(m_resid, '_h');
		m_entity.setClass('map_object');
		m_nametag.setClass('map_objecttag');
	};
	
	var _unHigh = function(){
		m_entity.setRes(m_resid);
		m_nametag.setClass('map_objecttag');
	};

	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};



/** 创建游戏中Entity的工厂 */
EntityFactory = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_entitys={};
	var m_progressbars=[];
	var m_numeffects=[];
	var m_imageeffects=[];
	var m_frameffects=[];
	var m_mapobjs=[];
	var m_dommaps=[];
	
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.initialize = function(g){
		m_g = g;
	};
	
	/** 创建一个实体 */
	this.alloc = function(mapdom){
		var entity = _allocObj(m_entitys, Entity, mapdom);
		entity.setType('avatar');
		return entity;
	};
	
	/** 释放一个实体 */
	this.free = function(entity) {
		_freeObj(m_entitys, entity);
	};
	
	/** 创建一个进度条实体 */
	this.allocPBar = function(mapdom) {
		return _allocObj(m_progressbars, ProgressBar, mapdom);
	};
	
	/** 释放一个进度条实体 */
	this.freePBar = function(pbar) {
		_freeObj(m_progressbars, pbar);
	};
	
	/** 创建一个数字特效实体 */
	this.allocNumEffect = function(mapdom) {
		return _allocObj(m_numeffects, NumberEffect, mapdom);
	};
	
	/** 释放一个数字特效实体 */
	this.freeNumEffect = function(effect) {
		_freeObj(m_numeffects, effect);
	};
	
	this.playImageEffect = function(cfg){
		var effect = this.allocImageEffect(cfg.parent);
		effect.setSize(cfg.size);
		effect.setImageClass(cfg.imageClass);
		effect.setZOrder(cfg.zorder);
		effect.setPos(cfg.pos);
		effect.start();
		EUPD.appendEffect(effect, this.freeImageEffect);
	};
	
	/** 创建一个图像飘起的特效实体 */
	this.allocImageEffect = function(mapdom) {
		return _allocObj(m_imageeffects, ImageEffect, mapdom);
	};
	
	/** 释放一个图像飘起的特效实体 */
	this.freeImageEffect = function(effect) {
		_freeObj(m_imageeffects, effect);
	};
	
	/** 创建一个帧特效实体 */
	this.allocFrameEffect = function(mapdom) {
		return _allocObj(m_frameffects, FrameEffect, mapdom);
	};
	
	/** 释放一个帧特效实体 */
	this.freeFrameEffect = function(effect) {
		_freeObj(m_frameffects, effect);
	};
	
	/** 创建一个特效实体 */
	this.allocEffect = function(mapdom) {
		var effect = this.alloc(mapdom);
		effect.setType('effect');
		return effect;
	};
	
	/** 释放一个特效实体 */
	this.freeEffect = function(effect) {
		this.free(effect);
	};
	
	/** 创建一个地图实体 */
	this.allocMapObj = function(mapdom) {
		return _allocObj(m_mapobjs, MapObject, mapdom);
	};
	
	/** 释放一个地图实体 */
	this.freeMapObj = function(obj) {
		_freeObj(m_mapobjs, obj);
	};
	
	var _allocObj = function(disc, classobj, mapdom){
		var obj = null;
		var alloclist = _getAllocList(disc, mapdom);
		if ( alloclist.length > 0 ) {
			obj = alloclist[alloclist.length-1];
			alloclist.length = alloclist.length - 1;
			obj.show();
		}
		else {
			obj = new classobj(m_g,mapdom);
			obj.create();
			obj._mapdom = mapdom;
		}	
		return obj;
	};
	
	var _freeObj = function(disc, obj){
		if ( obj != null ) {
			var alloclist = _getAllocList(disc, obj._mapdom);
			alloclist.push(obj);
			obj.hide();
		}
	};
	
	var _getDomKey = function(dom){
		for ( var i=0; i<m_dommaps.length; ++i ){
			if ( m_dommaps[i] == dom ){
				return i;
			}
		}
		m_dommaps.push(dom);
		return m_dommaps.length - 1;
	};
	
	var _getAllocList = function(listdisc, dom){
		var key = _getDomKey(dom);
		if ( !listdisc[key] ){
			listdisc[key] = [];
		}
		return listdisc[key];
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);	
};
