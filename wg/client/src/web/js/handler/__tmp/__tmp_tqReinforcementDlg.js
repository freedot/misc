/*******************************************************************************/
ReinforcementDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_this = null;
	_lc_.m_g = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	
	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_g.regEvent(EVT.SELFALLI_DETAIL, 0, _lc_.m_this, _lc_._onSelfAlliDetail);
		_lc_.m_g.regEvent(EVT.PERSONAL_ARMY_UPDATE, 0, _lc_.m_this, _lc_._onArmyUpdate);
	};
	
	this.openDlg = function(){
		_lc_._initDlg();
		_lc_._showDlg();
		_lc_._initInfo();
	};
	
	_lc_._initDlg = function(){
		if (_lc_.m_dlg) return;
		
		_lc_._createDlg();
		_lc_._setCallers();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal : false,
				title : rstr.alli.reinforcementdlg.title,
				pos : {x:'center', y:40}
			});
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.alli.reinforcementdlg, _lc_.m_items);		
	};
	
	_lc_._setCallers = function(){
		_lc_.m_items.enterAllianceBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickEnterAlliance});
	};

	_lc_._showDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(){
		AllianceSender.sendGetMyAllianceDetail(_lc_.m_g);
		_update();
	};
	
	_lc_._onClickEnterAlliance = function(){
		UIM.getDlg('allimain').openDlg();
		UIM.getPanel('main').getToolbar().stopAllianceBlinking();
	};
	
	_lc_._onClickRepatriateBtn = function(idx){
		var armyId = _collectReinforcementArmys()[idx].id;
		_lc_.m_g.getGUI().msgBox(rstr.comm.msgts
			,rstr.military.opdlg.lbl.confirmRepatriate
			,MB_F_YESNO, {self:_lc_.m_this, caller:function(id){
				if ( id == MB_IDYES ) {
					MilitarySender.sendRepatriateArmy(_lc_.m_g, armyId);
				}
		}});
	};
	
	_lc_._onSelfAlliDetail = function(){
		_update();
	};
	
	_lc_._onArmyUpdate = function(){
		_update();
	};
	
	var _update = function() {
		if ( !_lc_.m_dlg || !_lc_.m_dlg.isShow() ) return;
		
		_updateAllianceDetail();
		_updateArmyList();
	};
	
	var _updateAllianceDetail = function(){
		var myAlliance = _lc_.m_g.getImgr().getMyAlliance();
		TQ.setTextEx(_lc_.m_items.name, myAlliance.getName());
		TQ.setTextEx(_lc_.m_items.level, myAlliance.getLevel() );
		TQ.setTextEx(_lc_.m_items.leader, myAlliance.getLeader() );
		TQ.setTextEx(_lc_.m_items.flag, myAlliance.getAlliFlag() );
		TQ.setTextEx(_lc_.m_items.rank, myAlliance.getRank() );
		TQ.setTextEx(_lc_.m_items.number, _collectReinforcementArmys().length + '/5');
	};
	
	var _updateArmyList = function(){
		_setArmyListItems();
		_setArmyListItemBtnCallers();
	};
	
	var _setArmyListItems = function(){
		var armys = _collectReinforcementArmys();
		_lc_.m_items.list.setItemCount(armys.length);
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			var army = armys[i];
			TQ.setTextEx(item.exsubs.roleName, army.sourceRole);
			TQ.setTextEx(item.exsubs.fightCap, _getFightCap(army.heros));
		}
	};
	
	var _setArmyListItemBtnCallers = function(){
		for ( var i=0; i<_lc_.m_items.list.getCount(); ++i ) {
			var item = _lc_.m_items.list.getItem(i);
			item.exsubs.repatriateBtn.setId(i);
			item.exsubs.repatriateBtn.setCaller({self:_lc_.m_this, caller:_lc_._onClickRepatriateBtn});
		}
	};
	
	var _collectReinforcementArmys = function(){
		var reinforcementArmys = [];
		for ( var i=0; i<_lc_.m_g.getImgr().getArmys().list.length; ++i ) {
			var army = _lc_.m_g.getImgr().getArmys().list[i];
			if (army.armyType == ARMY_TYPE.ALLI) {
				reinforcementArmys.push(army);
			}
		}
		return reinforcementArmys;
	};
	
	var _getFightCap = function(heros){
		var fightCap = 0;
		for ( var i=0; i<heros.length; ++i ) {
			var hero = heros[i];
			if (hero.id == 0) continue;
			fightCap += _lc_.m_g.getImgr().getHeroAttrVal(hero, ATTR.FC);
		}
		return fightCap;
	};
	//ReinforcementDlg-unittest-end
});
