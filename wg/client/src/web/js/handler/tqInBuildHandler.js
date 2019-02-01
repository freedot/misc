//  内城建筑块
NullInBuildBlock = new function(){
	this.init = function(g, dom, checkInRectFlag){};
	this.clear = function(){};
	this.isInRect = function(pos){return false;};
	this.setDisable = function(disable){};
	this.setItem = function(item){};
	this.hot = function(){};
	this.normal = function(){};
	this.getItem = function(){return null;};
	this.setTime = function(sztime){};
	this.show = function(){};
	this.hide = function(){};
	this.getDom = function(){return null;};	
};

InBuildBlock = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dom;
	var m_commobj=null;
	var m_item;
	var m_statedom;
	var m_levelnamedom;
	var m_leveldom;
	var m_namedom;
	var m_timedom;
	var m_disable;
	
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.init = function(g, dom, checkInRectFlag){
		m_g = g;
		m_this = this;
		m_dom = dom;
		m_disable = false;
		m_commobj = new CommBuildBlock(m_g, m_dom, checkInRectFlag);
		_createDoms();
		_hideAllDoms();
		m_this.normal();
	};
	
	this.clear = function(){
		m_commobj.setItem(null);
	};
	
	this.isInRect = function(pos){
		return m_commobj.isInRect(pos);
	};
	
	this.setDisable = function(disable){
		m_disable = disable;
	};
	
	this.setItem = function(item){
		m_commobj.setItem(item);
		m_item = item;
		if ( m_item ){
			var stateimg = '';
			if ( m_item.state == 0 ){
				TQ.setCSS(m_timedom, 'display', 'none');
			}
			else if ( m_item.state == 1 ){
				stateimg = IMG.makeImg('build/block/up.gif');
			}
			else if ( m_item.state == 2 ){
				stateimg = IMG.makeImg('build/block/del.gif');
			}
			TQ.setCSS(m_statedom, 'display', (stateimg=='')?'none':'block');
			TQ.setCSS(m_levelnamedom, 'display', 'block');

			IMG.setBKImage(m_statedom, stateimg);
			
			TQ.setText(m_leveldom, m_item.level);
			TQ.setText(m_namedom, m_item.itemres.name);
			
			IMG.setBKImage(m_statedom, stateimg);
			_setDomsPos();
		}
		else{
			_hideAllDoms();
		}
		m_this.normal();
	};
	
	this.hot = function(){
		if ( m_item ){
			_hot();
		}
		else if ( m_disable ){
			_disableBlank();
		}
		else {
			_hotBlank();
		}
	};
	
	this.normal = function(){
		if ( m_item ){
			_normal();
		}
		else if ( m_disable ){
			_disableBlank();
		}
		else {
			_normalBlank();
		}
	};

	this.getItem = function(){
		return m_commobj.getItem();
	};
	
	this.setTime = function(sztime){
		TQ.setCSS(m_timedom, 'display', 'block');
		TQ.setText(m_timedom, sztime);
	};
	
	this.show = function(){
		m_commobj.show();
	};
	
	this.hide = function(){
		m_commobj.hide();
	};
	
	this.getDom = function(){
		return m_commobj.getDom();
	};	

	//------------
	//private:method
	//------------
	var _createDoms = function(){
		m_statedom = TQ.createDom('div');
		TQ.append(m_dom, m_statedom);
		TQ.setClass(m_statedom, 'state');
		
		m_levelnamedom = TQ.createDom('div');
		TQ.append(m_dom, m_levelnamedom);
		TQ.setClass(m_levelnamedom, 'levelname');
		
		m_leveldom = TQ.createDom('div');
		TQ.append(m_levelnamedom, m_leveldom);
		TQ.setClass(m_leveldom, 'level');
		
		m_namedom = TQ.createDom('div');
		TQ.append(m_levelnamedom, m_namedom);
		TQ.setClass(m_namedom, 'name');
		
		m_timedom = TQ.createDom('div');
		TQ.append(m_dom, m_timedom);
		TQ.setClass(m_timedom, 'time');
	};
	
	var _setDomsPos = function(){
		TQ.setDomPos(m_statedom, m_item.itemres.updpos.x, m_item.itemres.updpos.y);
		TQ.setDomPos(m_levelnamedom, m_item.itemres.titlepos.x, m_item.itemres.titlepos.y);
		TQ.setDomPos(m_timedom, m_item.itemres.titlepos.x, m_item.itemres.titlepos.y+20);
	};
	
	var _hideAllDoms = function(){
		TQ.setCSS(m_statedom, 'display', 'none');
		TQ.setCSS(m_levelnamedom, 'display', 'none');
		TQ.setCSS(m_timedom, 'display', 'none');
	};
	
	var _hotBlank = function(){
		IMG.setBKImage(m_dom, IMG.makeImg("build/block/blank_hot.gif"));
	};
	
	var _normalBlank = function(){
		IMG.setBKImage(m_dom, IMG.makeImg("build/block/blank.gif"));
	};
	
	var _disableBlank = function(){
		IMG.setBKImage(m_dom, IMG.makeImg('build/block/blank_dis.gif'));
	};
	
	var _hot = function(){
		IMG.setBKImage(m_dom, IMG.makeInBuildImg(m_item.itemres.img, true, m_item.state));
	};
	
	var _normal = function(){
		IMG.setBKImage(m_dom, IMG.makeInBuildImg(m_item.itemres.img, false, m_item.state));
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);
};

CultureTrace = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_items;
	var m_updater;

	//------------
	//public:method
	//------------
	this.initialize = function(g, domitems){
		m_g = g;
		m_this = this;
		m_items = domitems;
		m_updater = CommBuildUpdater.snew(m_g, {
				list:m_items.list
				,rlist:m_g.getImgr().getCultures().list
				,sendStopCmdToSvr:_sendStopCmdToSvr
				,firststatefmt:rstr.inbuild.culturedlg.learnstate
				,statefmt:rstr.inbuild.state
				,opspeed:UIM.getDlg('culture').opSpeed
				,opcancel:UIM.getDlg('culture').opCancel
				,needitems:['stop', 'name', 'state', 'levelstate', 'lefttime', 'opbtn']
				});
		m_g.regUpdater(m_this, _onUpdate, 1000);
	};
	
	//------------
	//private:method
	//------------
	var _onUpdate = function(cltTimeMs){
		m_updater.update();
	};
	
	var _sendStopCmdToSvr = function(ritem){
		var sendmsg = '{cmd='+NETCMD.CULTURE+',subcmd=3,resid='+ritem.resid+'}';
		m_g.send(null, sendmsg);
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

RecruitTrace = function(){
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_items;
	var m_updater;

	//------------
	//public:method
	//------------
	this.initialize = function(g, domitems){
		m_g = g;
		m_this = this;
		m_items = domitems;
		m_updater = CommBuildUpdater.snew(m_g, {
				list:m_items.list
				,rlist: m_g.getImgr().getSoldiers().recruiting
				,sendStopCmdToSvr: _sendStopCmdToSvr
				,firststatefmt: rstr.inbuild.soldierdlg.recruitstate
				,statefmt: rstr.inbuild.state
				,opspeed: UIM.getDlg('soldier').opSpeed
				,opcancel: UIM.getDlg('soldier').opCancel
				,needitems: ['stop', 'name', 'state', 'number', 'lefttime', 'opbtn']
				});
		m_g.regUpdater(m_this, _onUpdate, 1000);
	};

	//------------
	//private:method
	//------------
	var _onUpdate = function(cltTimeMs){
		m_updater.update();
	};
	
	var _sendStopCmdToSvr = function(ritem){
		var sendmsg = '{cmd='+NETCMD.SOLDIERRES+',subcmd=3,id='+ritem.id+'}';
		m_g.send(null, sendmsg);
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};


CityLevelUtil = Class.extern(function(){
	this.getCityLevelByCanUseBlockIdx = function(blockidx) {
		var citylevel = 100;
		for ( var i=0; i<res_maincity_inbuildnums.length; ++i ) {
			var r = res_maincity_inbuildnums[i];
			if ( blockidx < r.cnt ) {
				citylevel = r.clevel;
				break;
			}
		}
		return citylevel;
	};
	
	this.getBlocksCntByCityLevel = function(citylevel) {
		var blockcnt = 0;
		for ( var i=res_maincity_inbuildnums.length-1; i>=0; --i ) {
			var r = res_maincity_inbuildnums[i];
			if ( citylevel >= r.clevel ) {
				blockcnt = r.cnt;
				break;
			}
		}
		return blockcnt;
	};
}).snew();