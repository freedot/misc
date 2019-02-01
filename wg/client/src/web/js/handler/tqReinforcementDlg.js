/*******************************************************************************/
ReinforcementDlg = Class.extern(function(){
	//ReinforcementDlg-unittest-start
	var m_this = null;
	var m_g = null;
	var m_dlg = null;
	var m_items = {};
	
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.SELFALLI_DETAIL, 0, m_this, _onSelfAlliDetail);
		m_g.regEvent(EVT.PERSONAL_ARMY_UPDATE, 0, m_this, _onArmyUpdate);
	};
	
	this.openDlg = function(){
		_initDlg();
		_showDlg();
		_initInfo();
	};
	
	var _initDlg = function(){
		if (m_dlg) return;
		
		_createDlg();
		_setCallers();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal : false,
				title : rstr.alli.reinforcementdlg.title,
				pos : {x:'center', y:40}
			});
		m_g.getGUI().initDlg(m_dlg, uicfg.alli.reinforcementdlg, m_items);		
	};
	
	var _setCallers = function(){
		m_items.enterAllianceBtn.setCaller({self:m_this, caller:_onClickEnterAlliance});
	};

	var _showDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(){
		AllianceSender.sendGetMyAllianceDetail(m_g);
		_update();
	};
	
	var _onClickEnterAlliance = function(){
		UIM.getDlg('allimain').openDlg();
		UIM.getPanel('main').getToolbar().stopAllianceBlinking();
	};
	
	var _onClickRepatriateBtn = function(idx){
		var armyId = _collectReinforcementArmys()[idx].id;
		m_g.getGUI().msgBox(rstr.comm.msgts
			,rstr.military.opdlg.lbl.confirmRepatriate
			,MB_F_YESNO, {self:m_this, caller:function(id){
				if ( id == MB_IDYES ) {
					MilitarySender.sendRepatriateArmy(m_g, armyId);
				}
		}});
	};
	
	var _onSelfAlliDetail = function(){
		_update();
	};
	
	var _onArmyUpdate = function(){
		_update();
	};
	
	var _update = function() {
		if ( !m_dlg || !m_dlg.isShow() ) return;
		
		_updateAllianceDetail();
		_updateArmyList();
	};
	
	var _updateAllianceDetail = function(){
		var myAlliance = m_g.getImgr().getMyAlliance();
		TQ.setTextEx(m_items.name, myAlliance.getName());
		TQ.setTextEx(m_items.level, myAlliance.getLevel() );
		TQ.setTextEx(m_items.leader, myAlliance.getLeader() );
		TQ.setTextEx(m_items.flag, myAlliance.getAlliFlag() );
		TQ.setTextEx(m_items.rank, myAlliance.getRank() );
		TQ.setTextEx(m_items.number, _collectReinforcementArmys().length + '/5');
	};
	
	var _updateArmyList = function(){
		_setArmyListItems();
		_setArmyListItemBtnCallers();
	};
	
	var _setArmyListItems = function(){
		var armys = _collectReinforcementArmys();
		m_items.list.setItemCount(armys.length);
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			var army = armys[i];
			TQ.setTextEx(item.exsubs.roleName, army.sourceRole);
			TQ.setTextEx(item.exsubs.fightCap, _getFightCap(army.heros));
		}
	};
	
	var _setArmyListItemBtnCallers = function(){
		for ( var i=0; i<m_items.list.getCount(); ++i ) {
			var item = m_items.list.getItem(i);
			item.exsubs.repatriateBtn.setId(i);
			item.exsubs.repatriateBtn.setCaller({self:m_this, caller:_onClickRepatriateBtn});
		}
	};
	
	var _collectReinforcementArmys = function(){
		var reinforcementArmys = [];
		for ( var i=0; i<m_g.getImgr().getArmys().list.length; ++i ) {
			var army = m_g.getImgr().getArmys().list[i];
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
			fightCap += m_g.getImgr().getHeroAttrVal(hero, ATTR.FC);
		}
		return fightCap;
	};
	//ReinforcementDlg-unittest-end
});
