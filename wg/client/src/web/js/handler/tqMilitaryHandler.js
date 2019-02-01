/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
MilitaryHandler = Class.extern(function(){
	//MilitaryHandler-unittest-start
	var m_g;
	var m_this;
	
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_g.regEvent(EVT.LOGIN_OK, 0, m_this, _onLoginOk);
		m_g.regEvent(EVT.NET, NETCMD.MILITARY, m_this, _onSvrMilitaryData);
	};
	
	var _onLoginOk = function(){
		MilitarySender.sendGetMilitary(m_g);
		MilitarySender.sendGetAllArmys(m_g);
		MilitarySender.sendGetForceLineUp(m_g);
	};
	
	var _onSvrMilitaryData = function(netevent){
		var netdata = netevent.data;
		if ( netdata.favorites ) {
			var favorites = m_g.getImgr().getTargetsFavorite();
			TQ.dictCopy(favorites, netdata.favorites);
			m_g.sendEvent({eid:EVT.FAVORITE_UPDATE, sid:0});
		}
		if ( netdata.enemys ) {
			TQ.dictCopy(m_g.getImgr().getEnemys(), netdata.enemys);
			m_g.sendEvent({eid:EVT.ENEMY_UPDATE, sid:0});
		}
		if ( netdata.todaytimes ) {
			var times = m_g.getImgr().getTodayBattleTimes();
			TQ.dictCopy(times, netdata.todaytimes);
			m_g.sendEvent({eid:EVT.BATTLETIMES_UPDATE, sid:0});
		}
		if ( netdata.defaultteams ) {
			var teams = m_g.getImgr().getDefaultTeams();
			TQ.dictCopy(teams, netdata.defaultteams);
			m_g.sendEvent({eid:EVT.BDEFAULT_TEAMS_UPDATE, sid:0});
		}
		if ( netdata.lineups ) {
			var lineups = m_g.getImgr().getLineups();
			TQ.dictCopy(lineups, netdata.lineups);
		}
		if ( netdata.fightdemo ) {
			var fightDemos = m_g.getImgr().getFightDemos();
			fightDemos.push(netdata.fightdemo);
		}
		if ( netdata.armys ) {
			var armys = m_g.getImgr().getArmys();
			TQ.dictCopy(armys, netdata.armys);
			if ( netdata.armys.list ) {	
				armys.list.sort(G_ID_DESCCOMP);
				m_g.sendEvent({eid:EVT.PERSONAL_ARMY_UPDATE, sid:0});
			}
			if ( netdata.armys.samealli ) {
				armys.samealli.sort(G_ID_DESCCOMP);
				m_g.sendEvent({eid:EVT.SALLIANCE_ARMY_UPDATE, sid:0});
			}
			HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
		}
		if ( netdata.saveforces ) {
			TQ.dictCopy(m_g.getImgr().getSaveForces(), netdata.saveforces);
			m_g.sendEvent({eid:EVT.SAVE_FORCES, sid:0});
		}
	};
	//MilitaryHandler-unittest-end
});


