/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
MilitaryHandler = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g;
	_lc_.m_this;
	
	this.init = function(g){
		_lc_.m_g = g;
		_lc_.m_this = this;
		_lc_.m_g.regEvent(EVT.LOGIN_OK, 0, _lc_.m_this, _lc_._onLoginOk);
		_lc_.m_g.regEvent(EVT.NET, NETCMD.MILITARY, _lc_.m_this, _onSvrMilitaryData);
	};
	
	_lc_._onLoginOk = function(){
		MilitarySender.sendGetMilitary(_lc_.m_g);
		MilitarySender.sendGetAllArmys(_lc_.m_g);
		MilitarySender.sendGetForceLineUp(_lc_.m_g);
	};
	
	var _onSvrMilitaryData = function(netevent){
		var netdata = netevent.data;
		if ( netdata.favorites ) {
			var favorites = _lc_.m_g.getImgr().getTargetsFavorite();
			TQ.dictCopy(favorites, netdata.favorites);
			_lc_.m_g.sendEvent({eid:EVT.FAVORITE_UPDATE, sid:0});
		}
		if ( netdata.enemys ) {
			TQ.dictCopy(_lc_.m_g.getImgr().getEnemys(), netdata.enemys);
			_lc_.m_g.sendEvent({eid:EVT.ENEMY_UPDATE, sid:0});
		}
		if ( netdata.todaytimes ) {
			var times = _lc_.m_g.getImgr().getTodayBattleTimes();
			TQ.dictCopy(times, netdata.todaytimes);
			_lc_.m_g.sendEvent({eid:EVT.BATTLETIMES_UPDATE, sid:0});
		}
		if ( netdata.defaultteams ) {
			var teams = _lc_.m_g.getImgr().getDefaultTeams();
			TQ.dictCopy(teams, netdata.defaultteams);
			_lc_.m_g.sendEvent({eid:EVT.BDEFAULT_TEAMS_UPDATE, sid:0});
		}
		if ( netdata.lineups ) {
			var lineups = _lc_.m_g.getImgr().getLineups();
			TQ.dictCopy(lineups, netdata.lineups);
		}
		if ( netdata.fightdemo ) {
			var fightDemos = _lc_.m_g.getImgr().getFightDemos();
			fightDemos.push(netdata.fightdemo);
		}
		if ( netdata.armys ) {
			var armys = _lc_.m_g.getImgr().getArmys();
			TQ.dictCopy(armys, netdata.armys);
			if ( netdata.armys.list ) {	
				armys.list.sort(G_ID_DESCCOMP);
				_lc_.m_g.sendEvent({eid:EVT.PERSONAL_ARMY_UPDATE, sid:0});
			}
			if ( netdata.armys.samealli ) {
				armys.samealli.sort(G_ID_DESCCOMP);
				_lc_.m_g.sendEvent({eid:EVT.SALLIANCE_ARMY_UPDATE, sid:0});
			}
			HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
		}
		if ( netdata.saveforces ) {
			TQ.dictCopy(_lc_.m_g.getImgr().getSaveForces(), netdata.saveforces);
			_lc_.m_g.sendEvent({eid:EVT.SAVE_FORCES, sid:0});
		}
	};
	//MilitaryHandler-unittest-end
});


