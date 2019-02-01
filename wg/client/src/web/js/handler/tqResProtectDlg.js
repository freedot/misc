/*******************************************************************************/
ResProtectDlg = Class.extern(function(){
	//ResProtectDlg-unittest-start
	var BAR_LEFT = 37;
	var BAR_BOTTOM = 165;
	var BAR_W = 50;
	var BAR_MAXH = 164;
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	
	this.init = function(g){
		m_this = this;
		m_g = g;
	};
	
	this.openDlg = function(){
		_initDlg();
		_openDlg();
		_initInfo();
	};
	
	this.hideDlg = function(){
		if ( m_dlg ) m_dlg.hide();
	};
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		_createDlg();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal:false, title:rstr.resprotectdlg.title, pos:{x:'center', y:50} });
		m_g.getGUI().initDlg(m_dlg, uicfg.resprotectdlg, m_items);
	};
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		_setStorageCap();
		_setResProtectNum();
		_setResProtectList();
	};
	
	var _setStorageCap = function(){
		TQ.setTextEx(m_items.storageCap, m_g.getImgr().getCityRes().cres.max);
	};
	
	var _setResProtectNum = function(){
		TQ.setTextEx(m_items.resProtect, _getResProtectNum());
	};
	
	var _setResProtectList = function(){
		for ( var i=0; i<m_items.list.getCount(); ++i ){
			var item = m_items.list.getItem(i);
			_setListItemCurHasBar(i, item);
			_setListItemResProtectBar(i, item);
			_setListItemResIconName(i, item);
			_setListItemCurHasNumber(i, item);
		}
	};
	
	var _setListItemCurHasBar = function(idx, item){
		var maxVal = m_g.getImgr().getCityRes().cres.max;
		var curVal = m_g.getImgr().getCityResValByIdx(idx);
		maxVal = Math.max(maxVal, curVal);
		
		var barH = Math.floor(curVal*BAR_MAXH/maxVal );
		var barTop = BAR_BOTTOM - barH;
		TQ.setDomRect(item.exsubs.curhas, BAR_LEFT, barTop, BAR_W, barH);
	};
	
	var _setListItemResProtectBar = function(idx, item){
		var maxVal = m_g.getImgr().getCityRes().cres.max;
		var curVal = m_g.getImgr().getCityResValByIdx(idx);
		var protectVal = _getResProtectNum();
		maxVal = Math.max(maxVal, curVal, protectVal);
		curVal = Math.min(curVal, protectVal);
		
		var barH = Math.floor(curVal*BAR_MAXH/maxVal );
		var barTop = BAR_BOTTOM - barH;
		TQ.setDomRect(item.exsubs.curprotect, BAR_LEFT, barTop, BAR_W, barH);
	};
	
	var _setListItemResIconName = function(idx, item){
		var res = ItemResUtil.findItemres( m_g.getImgr().getCityResResIdByIdx(idx) );
		IMG.setBKImage(item.exsubs.icon, IMG.makeSmallImg(res.smallpic));
		TQ.setTextEx(item.exsubs.name, res.name);
	};
	
	var _setListItemCurHasNumber = function(idx, item){
		TQ.setTextEx(item.exsubs.curhasnum, m_g.getImgr().getCityResValByIdx(idx));
	};
	
	var _getResProtectNum = function(){
		var protectNum = 0;
		var builds = m_g.getImgr().getBuildsByResid(BUILDCITY_ID.ALL, FIXID.DIJIAOBUILD);
		for ( var i=0; i<builds.length; ++i ) {
			var build = builds[i];
			var res = ItemResUtil.findBuildLevelres(build.resid, build.level);
			if ( !res ) continue;
			
			protectNum += res.addresprotectnum;
		}
		return protectNum;
	};
	//ResProtectDlg-unittest-end
});
