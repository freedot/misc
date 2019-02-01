/*******************************************************************************/
HospitalDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	_lc_.m_hurtHeros = [];
	this.init = function(g){
		_lc_.m_this = this;
		_lc_.m_g = g;
		_lc_._regEvents();
	};
	
	this.openDlg = function(){
		_lc_._initDlg();
		_lc_._openDlg();
		_lc_._initInfo();
	};
	
	this.hideDlg = function(){
		if ( _lc_.m_dlg ) _lc_.m_dlg.hide();
	};
	
	_lc_._regEvents = function(){
		_lc_.m_g.regEvent(EVT.HERO_UPDATE, 0, _lc_.m_this, _lc_._onHeroUpdate);
		_lc_.m_g.regEvent(EVT.PKG_CHANGE, 0, _lc_.m_this, _lc_._onItemChanged);
		_lc_.m_g.regEvent(EVT.PKG_CHANGE, 2, _lc_.m_this, _lc_._onItemChanged); // salve max info
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ) return;
		
		_lc_._createDlg();
		_lc_._setCallers();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:false, title:rstr.hospitaldlg.title, pos:{x:'center', y:50} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.hospitaldlg, _lc_.m_items);
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.buy.setCaller({self:_lc_.m_this, caller:_lc_._onClickBuy});
		_lc_.m_items.treatmentAll.setCaller({self:_lc_.m_this, caller:_lc_._onClickTreatmentAll});
	};
	
	_lc_._openDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		_lc_._update();
	};
	
	_lc_._update = function(){
		if ( !_lc_._isShow() ) return;
		
		_lc_._updateHeroList();
		_lc_._updateHasItemNumber();
		_lc_._updateNeedItemNumber();
	};
	
	_lc_._isShow = function(){
		if ( !_lc_.m_dlg ) return false;
		return _lc_.m_dlg.isShow();
	};
	
	_lc_._updateHeroList = function(){
		_lc_._collectHurtHeros();
		_lc_._setHeroListItems();
		_lc_._setHeroListCallers();
	};
	
	_lc_._collectHurtHeros = function(){
		_lc_.m_hurtHeros = [];
		var imgr = _lc_.m_g.getImgr();
		var heros = imgr.getHeros().list;
		for ( var i=0; i<heros.length; ++i ) {
			var hero = heros[i];
			if ( imgr.getHeroAttrVal(hero, ATTR.HEALTH) == imgr.getHeroAttrVal(hero, ATTR.MHEALTH) ) continue;
			
			_lc_.m_hurtHeros.push(hero);
		}
	};
	
	_lc_._setHeroListItems = function(){
		_lc_.m_items.list.setItemCount(_lc_.m_hurtHeros.length);
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			var hero = _lc_.m_hurtHeros[i];
			TQ.setTextEx(item.exsubs.name, hero.name);
			TQ.setTextEx(item.exsubs.level, hero.level);
			TQ.setTextEx(item.exsubs.health, _lc_.m_g.getImgr().getHeroAttrVal(hero, ATTR.HEALTH));
			TQ.setTextEx(item.exsubs.neednum, TreatmentHeroHdr.getNeedItemNumber(_lc_.m_g, [hero.id]));
		}
	};
	
	_lc_._setHeroListCallers = function(){
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			item.exsubs.treatment.setId(i);
			item.exsubs.treatment.setCaller({self:_lc_.m_this, caller:_lc_._onClickTreatment});
		}
	};
	
	_lc_._updateHasItemNumber = function(){
		var salveInfo = _lc_.m_g.getImgr().getSalveInfo();
		var hasNum = _lc_.m_g.getImgr().getItemNumByResId(FIXID.SALVE);
		TQ.setTextEx(_lc_.m_items.itemnum, hasNum + '/' + salveInfo.max);
	};
	
	_lc_._updateNeedItemNumber = function(){
		var needNumber = TreatmentHeroHdr.getNeedItemNumber(_lc_.m_g, _lc_._getHurtHeroIds());
		TQ.setTextEx(_lc_.m_items.neednum, needNumber);
	};
	
	_lc_._onClickBuy = function(){
		UIM.openDlg('buyitem', {id:0, resid:FIXID.PKG_SALVE, number:10000});
	};
	
	_lc_._onClickTreatmentAll = function(){
		_lc_._treatmentHeros(_lc_._getHurtHeroIds());
	};
	
	_lc_._onClickTreatment = function(idx){
		_lc_._treatmentHeros([_lc_.m_hurtHeros[idx].id]);
	};
	
	_lc_._getHurtHeroIds = function(){
		var heroIds = [];
		for ( var i=0; i<_lc_.m_hurtHeros.length; ++i ) {
			heroIds.push(_lc_.m_hurtHeros[i].id);
		}
		return heroIds;
	};
	
	_lc_._treatmentHeros = function(heroIds){
		var needNum = TreatmentHeroHdr.getNeedItemNumber(_lc_.m_g, heroIds);
		var hasNum = _lc_.m_g.getImgr().getItemNumByResId(FIXID.SALVE);
		if ( needNum > hasNum ) {
			var msg = RStrUtil.makeNoSalveBuyMsg(FIXID.SALVE, needNum, hasNum);
			_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_CLOSE, null);
			return;
		}
		
		HeroSender.sendTreatments(_lc_.m_g, heroIds);
	};
	
	_lc_._onHeroUpdate = function(){
		if ( !_lc_._isShow() ) return;
		
		_lc_._updateHeroList();
		_lc_._updateNeedItemNumber();		
	};
	
	_lc_._onItemChanged = function(){
		if ( !_lc_._isShow() ) return;
		
		_lc_._updateHasItemNumber();
	};
	//HospitalDlg-unittest-end
});
