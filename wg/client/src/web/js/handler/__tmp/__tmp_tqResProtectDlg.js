/*******************************************************************************/
ResProtectDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var BAR_LEFT = 37;
	var BAR_BOTTOM = 165;
	var BAR_W = 50;
	var BAR_MAXH = 164;
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	
	this.init = function(g){
		_lc_.m_this = this;
		_lc_.m_g = g;
	};
	
	this.openDlg = function(){
		_lc_._initDlg();
		_lc_._openDlg();
		_lc_._initInfo();
	};
	
	this.hideDlg = function(){
		if ( _lc_.m_dlg ) _lc_.m_dlg.hide();
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		_lc_._createDlg();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:false, title:rstr.resprotectdlg.title, pos:{x:'center', y:50} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.resprotectdlg, _lc_.m_items);
	};
	
	_lc_._openDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		_lc_._setStorageCap();
		_lc_._setResProtectNum();
		_lc_._setResProtectList();
	};
	
	_lc_._setStorageCap = function(){
		TQ.setTextEx(_lc_.m_items.storageCap, _lc_.m_g.getImgr().getCityRes().cres.max);
	};
	
	_lc_._setResProtectNum = function(){
		TQ.setTextEx(_lc_.m_items.resProtect, _lc_._getResProtectNum());
	};
	
	_lc_._setResProtectList = function(){
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ){
			var item = _lc_.m_items.list.getItem(i);
			_lc_._setListItemCurHasBar(i, item);
			_lc_._setListItemResProtectBar(i, item);
			_lc_._setListItemResIconName(i, item);
			_lc_._setListItemCurHasNumber(i, item);
		}
	};
	
	_lc_._setListItemCurHasBar = function(idx, item){
		var maxVal = _lc_.m_g.getImgr().getCityRes().cres.max;
		var curVal = _lc_.m_g.getImgr().getCityResValByIdx(idx);
		maxVal = Math.max(maxVal, curVal);
		
		var barH = Math.floor(curVal*BAR_MAXH/maxVal );
		var barTop = BAR_BOTTOM - barH;
		TQ.setDomRect(item.exsubs.curhas, BAR_LEFT, barTop, BAR_W, barH);
	};
	
	_lc_._setListItemResProtectBar = function(idx, item){
		var maxVal = _lc_.m_g.getImgr().getCityRes().cres.max;
		var curVal = _lc_.m_g.getImgr().getCityResValByIdx(idx);
		var protectVal = _lc_._getResProtectNum();
		maxVal = Math.max(maxVal, curVal, protectVal);
		curVal = Math.min(curVal, protectVal);
		
		var barH = Math.floor(curVal*BAR_MAXH/maxVal );
		var barTop = BAR_BOTTOM - barH;
		TQ.setDomRect(item.exsubs.curprotect, BAR_LEFT, barTop, BAR_W, barH);
	};
	
	_lc_._setListItemResIconName = function(idx, item){
		var res = ItemResUtil.findItemres( _lc_.m_g.getImgr().getCityResResIdByIdx(idx) );
		IMG.setBKImage(item.exsubs.icon, IMG.makeSmallImg(res.smallpic));
		TQ.setTextEx(item.exsubs.name, res.name);
	};
	
	_lc_._setListItemCurHasNumber = function(idx, item){
		TQ.setTextEx(item.exsubs.curhasnum, _lc_.m_g.getImgr().getCityResValByIdx(idx));
	};
	
	_lc_._getResProtectNum = function(){
		var protectNum = 0;
		var builds = _lc_.m_g.getImgr().getBuildsByResid(BUILDCITY_ID.ALL, FIXID.DIJIAOBUILD);
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
