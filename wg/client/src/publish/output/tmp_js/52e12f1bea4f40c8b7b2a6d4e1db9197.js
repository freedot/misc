MilitaryHandler=Class.extern(function(){var a,b;this.init=function(e){a=e,b=this,a.regEvent(EVT.LOGIN_OK,0,b,c),a.regEvent(EVT.NET,NETCMD.MILITARY,b,d)};var c=function(){MilitarySender.sendGetMilitary(a),MilitarySender.sendGetAllArmys(a),MilitarySender.sendGetForceLineUp(a)},d=function(b){var c=b.data;if(c.favorites){var d=a.getImgr().getTargetsFavorite();TQ.dictCopy(d,c.favorites),a.sendEvent({eid:EVT.FAVORITE_UPDATE,sid:0})}c.enemys&&(TQ.dictCopy(a.getImgr().getEnemys(),c.enemys),a.sendEvent({eid:EVT.ENEMY_UPDATE,sid:0}));if(c.todaytimes){var e=a.getImgr().getTodayBattleTimes();TQ.dictCopy(e,c.todaytimes),a.sendEvent({eid:EVT.BATTLETIMES_UPDATE,sid:0})}if(c.defaultteams){var f=a.getImgr().getDefaultTeams();TQ.dictCopy(f,c.defaultteams),a.sendEvent({eid:EVT.BDEFAULT_TEAMS_UPDATE,sid:0})}if(c.lineups){var g=a.getImgr().getLineups();TQ.dictCopy(g,c.lineups)}if(c.fightdemo){var h=a.getImgr().getFightDemos();h.push(c.fightdemo)}if(c.armys){var i=a.getImgr().getArmys();TQ.dictCopy(i,c.armys),c.armys.list&&(i.list.sort(G_ID_DESCCOMP),a.sendEvent({eid:EVT.PERSONAL_ARMY_UPDATE,sid:0})),c.armys.samealli&&(i.samealli.sort(G_ID_DESCCOMP),a.sendEvent({eid:EVT.SALLIANCE_ARMY_UPDATE,sid:0})),HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask()}c.saveforces&&(TQ.dictCopy(a.getImgr().getSaveForces(),c.saveforces),a.sendEvent({eid:EVT.SAVE_FORCES,sid:0}))}})