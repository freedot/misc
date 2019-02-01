/*******************************************************************************/
HospitalDlg = Class.extern(function(){
	//HospitalDlg-unittest-start
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_hurtHeros = [];
	this.init = function(g){
		m_this = this;
		m_g = g;
		_regEvents();
	};
	
	this.openDlg = function(){
		_initDlg();
		_openDlg();
		_initInfo();
	};
	
	this.hideDlg = function(){
		if ( m_dlg ) m_dlg.hide();
	};
	
	var _regEvents = function(){
		m_g.regEvent(EVT.HERO_UPDATE, 0, m_this, _onHeroUpdate);
		m_g.regEvent(EVT.PKG_CHANGE, 0, m_this, _onItemChanged);
		m_g.regEvent(EVT.PKG_CHANGE, 2, m_this, _onItemChanged); // salve max info
	};
	
	var _initDlg = function(){
		if ( m_dlg ) return;
		
		_createDlg();
		_setCallers();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal:false, title:rstr.hospitaldlg.title, pos:{x:'center', y:50} });
		m_g.getGUI().initDlg(m_dlg, uicfg.hospitaldlg, m_items);
	};
	
	var _setCallers = function(){
		m_items.buy.setCaller({self:m_this, caller:_onClickBuy});
		m_items.treatmentAll.setCaller({self:m_this, caller:_onClickTreatmentAll});
	};
	
	var _openDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		_update();
	};
	
	var _update = function(){
		if ( !_isShow() ) return;
		
		_updateHeroList();
		_updateHasItemNumber();
		_updateNeedItemNumber();
	};
	
	var _isShow = function(){
		if ( !m_dlg ) return false;
		return m_dlg.isShow();
	};
	
	var _updateHeroList = function(){
		_collectHurtHeros();
		_setHeroListItems();
		_setHeroListCallers();
	};
	
	var _collectHurtHeros = function(){
		m_hurtHeros = [];
		var imgr = m_g.getImgr();
		var heros = imgr.getHeros().list;
		for ( var i=0; i<heros.length; ++i ) {
			var hero = heros[i];
			if ( imgr.getHeroAttrVal(hero, ATTR.HEALTH) == imgr.getHeroAttrVal(hero, ATTR.MHEALTH) ) continue;
			
			m_hurtHeros.push(hero);
		}
	};
	
	var _setHeroListItems = function(){
		m_items.list.setItemCount(m_hurtHeros.length);
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			var hero = m_hurtHeros[i];
			TQ.setTextEx(item.exsubs.name, hero.name);
			TQ.setTextEx(item.exsubs.level, hero.level);
			TQ.setTextEx(item.exsubs.health, m_g.getImgr().getHeroAttrVal(hero, ATTR.HEALTH));
			TQ.setTextEx(item.exsubs.neednum, TreatmentHeroHdr.getNeedItemNumber(m_g, [hero.id]));
		}
	};
	
	var _setHeroListCallers = function(){
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			item.exsubs.treatment.setId(i);
			item.exsubs.treatment.setCaller({self:m_this, caller:_onClickTreatment});
		}
	};
	
	var _updateHasItemNumber = function(){
		var salveInfo = m_g.getImgr().getSalveInfo();
		var hasNum = m_g.getImgr().getItemNumByResId(FIXID.SALVE);
		TQ.setTextEx(m_items.itemnum, hasNum + '/' + salveInfo.max);
	};
	
	var _updateNeedItemNumber = function(){
		var needNumber = TreatmentHeroHdr.getNeedItemNumber(m_g, _getHurtHeroIds());
		TQ.setTextEx(m_items.neednum, needNumber);
	};
	
	var _onClickBuy = function(){
		UIM.openDlg('buyitem', {id:0, resid:FIXID.PKG_SALVE, number:10000});
	};
	
	var _onClickTreatmentAll = function(){
		_treatmentHeros(_getHurtHeroIds());
	};
	
	var _onClickTreatment = function(idx){
		_treatmentHeros([m_hurtHeros[idx].id]);
	};
	
	var _getHurtHeroIds = function(){
		var heroIds = [];
		for ( var i=0; i<m_hurtHeros.length; ++i ) {
			heroIds.push(m_hurtHeros[i].id);
		}
		return heroIds;
	};
	
	var _treatmentHeros = function(heroIds){
		var needNum = TreatmentHeroHdr.getNeedItemNumber(m_g, heroIds);
		var hasNum = m_g.getImgr().getItemNumByResId(FIXID.SALVE);
		if ( needNum > hasNum ) {
			var msg = RStrUtil.makeNoSalveBuyMsg(FIXID.SALVE, needNum, hasNum);
			m_g.getGUI().msgBox(rstr.comm.msgts, msg, MB_F_CLOSE, null);
			return;
		}
		
		HeroSender.sendTreatments(m_g, heroIds);
	};
	
	var _onHeroUpdate = function(){
		if ( !_isShow() ) return;
		
		_updateHeroList();
		_updateNeedItemNumber();		
	};
	
	var _onItemChanged = function(){
		if ( !_isShow() ) return;
		
		_updateHasItemNumber();
	};
	//HospitalDlg-unittest-end
});
