/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
CreateRoleSender = Class.extern(function(){
	this.sendCreateRole = function(g, roleName, icon){
		var bd = window.bdbrowser ? 1 : 0;
		var msg = '{cmd=' + NETCMD.CREATEROLE + ',subcmd=0,rname="' + roleName + '",icon=' + icon + ',bd='  + bd + '}';
		g.send(null, msg);
	};
	
	this.sendCheckName = function(g, roleName){
		var key = 'CreateRoleSender.sendCheckName';
		g.regSendDelay(key, 100);
		var msg = '{cmd=' + NETCMD.CREATEROLE + ',subcmd=1,rname="' + roleName + '"}';
		g.send(key, msg);
	};
	
	this.sendGetRandName = function(g, sex){
		var msg = '{cmd=' + NETCMD.CREATEROLE + ',subcmd=2,sex=' + sex + '}';
		g.send(null, msg);
	};
	
	this.sendGetRandPos = function(g){
		var msg = '{cmd=' + NETCMD.CREATEROLE + ',subcmd=3}';
		g.send(null, msg);
	};
	
	this.sendSetPos = function(g, pos){
		var msg = '{cmd=' + NETCMD.CREATEROLE + ',subcmd=4,x=' +pos.x + ',y=' + pos.y + '}';
		g.send(null, msg);
	};
}).snew();

FarmSender = Class.extern(function(){
	var m_g=null;
	var m_this=null;
	
	this.init = function(g){
		m_this = this;
	};
	
	this.initg = function(g){
		m_g = g;
	};
	
	this.sendGetFarm = function(ver, roleId){
		var sendmsg = '{cmd='+NETCMD.FARM+',subcmd=1,ver='+ver+',roleId='+roleId+'}';
		m_g.send(null, sendmsg);
	};
	
	this.sendCompleteFarmBlocks = function(farmid, ids){
		if ( ids.length == 0 ) return;
		
		var sids = '';
		for ( var i=0; i<ids.length; ++i ) {
			if ( sids != '' ) sids += ',';
			sids += ids[i];
		}
		var sendmsg = '{cmd='+NETCMD.FARM+',subcmd=3,uid='+farmid+',ids={'+sids+'}}';
		m_g.send(null, sendmsg);
	};
	
	this.sendGetFarmLog = function(ver){
		var sendmsg = '{cmd='+NETCMD.FARM+',subcmd=4,ver='+ver+'}';
		m_g.send(null, sendmsg);
	};
	
	this.sendGatherFarmRes = function(roleId, blockId){
		var sendmsg = '{cmd='+NETCMD.FARM+',subcmd=5,roleId='+roleId+',blockId='+blockId+'}';
		m_g.send(null, sendmsg);
	};
	
	this.sendGatherAllFarmRes = function(roleId){
		var sendmsg = '{cmd='+NETCMD.FARM+',subcmd=6,roleId='+roleId+'}';
		m_g.send(null, sendmsg);
	};
	
	this.sendPreGatherFarmRes = function(roleId, blockId){
		var sendmsg = '{cmd='+NETCMD.FARM+',subcmd=7,roleId='+roleId+',blockId='+blockId+'}';
		m_g.send(null, sendmsg);
	};
	
	this.sendInitFarm = function(roleId, blockId){
		var sendmsg = '{cmd='+NETCMD.FARM+',subcmd=8,roleId='+roleId+',blockId='+blockId+'}';
		m_g.send(null, sendmsg);
	};
	
	this.sendInputFarm = function(blockId, pipresid){
		var sendmsg = '{cmd='+NETCMD.FARM+',subcmd=9,blockId='+blockId+',resid='+pipresid+'}';
		m_g.send(null, sendmsg);
	};
	
	this.sendGetCanGatherFlags = function(g, roleIds, tabIdx){
		if ( roleIds.length == 0 ) return;
		
		var key = 'cmd_getcangatherflags' + tabIdx;
		g.regSendDelay(key, 200);
		
		var s = '';
		for ( var i=0; i<roleIds.length; ++i ) {
			s += ',id' + (i+1) + '=' + roleIds[i];
		}
		
		var sendmsg = '{cmd='+NETCMD.FARM+',subcmd=10,count=' + roleIds.length + s + '}';
		g.send(key, sendmsg);
	};
}).snew();

HeroSender = Class.extern(function(){
	this.sendGetAllHeros = function(g){
		var s = 'subcmd=0';
		g.send(null, _getHeroMsg(s) );
	};
	
	this.sendGetDetail = function(g, heroid) {
		var key = 'cmd_getherodetail_'+heroid;
		g.regSendDelay(key, 10);
		var s = 'subcmd=1,id='+heroid;
		g.send(key, _getHeroMsg(s) );
	};
	
	this.sendFire = function(g, heroid) {
		var s = 'subcmd=8,id='+heroid;
		g.send(null, _getHeroMsg(s) );
	};
	
	this.sendLock = function(g, heroid) {
		var s = 'subcmd=33,id='+heroid;
		g.send(null, _getHeroMsg(s) );
	};
	
	this.sendUnLock = function(g, heroid) {
		var s = 'subcmd=34,id='+heroid;
		g.send(null, _getHeroMsg(s) );
	};
	
	this.sendChangeName = function(g, heroid, newname) {
		var s = 'subcmd=2,id='+heroid+',name="'+newname+'"';
		g.send(null, _getHeroMsg(s) );
	};
	
	this.sendTreatment = function(g, heroid){
		var s = 'subcmd=35,id='+heroid;
		g.send(null, _getHeroMsg(s) );
	};
	
	this.sendTreatments = function(g, heros){
		var validCount = 0;
		var sheros = '';
		for ( var i=0; i<heros.length; ++i ) {
			var heroId = heros[i];
			if ( heroId == 0 ) continue;
			
			var validIdx = validCount + 1;
			sheros += ',id'+validIdx+'='+heroId;
			validCount++;
		}
		
		var key = 'cmd_herostreatments';
		g.regSendDelay(key, 50);
		
		var s = 'subcmd=44,count='+validCount+sheros;
		g.send(key, _getHeroMsg(s) );
	};
	
	this.sendAssignPP = function(g, heroid, ppstr){
		var s = 'subcmd=4,id='+heroid+ppstr;
		g.send(null, _getHeroMsg(s) );
	};
	
	this.sendClearPP = function(g, heroid){
		var s = 'subcmd=6,id='+heroid;
		g.send(null, _getHeroMsg(s) );
	};
	
	this.sendConge = function(g, heroid){
		var s = 'subcmd=36,id='+heroid;
		g.send(null, _getHeroMsg(s) );
	};
	
	this.sendConfer = function(g, heroid, official) {
		var s = 'subcmd=37,id='+heroid+',official='+official;
		g.send(null, _getHeroMsg(s) );
	};
	
	this.sendSteelSkeleton = function(g, heroid){
		var s = 'subcmd=39,id='+heroid;
		g.send(null, _getHeroMsg(s) );
	};
	
	this.sendInsightSkill = function(g, heroid){
		var s = 'subcmd=40,id='+heroid;
		g.send(null, _getHeroMsg(s) );
	};
	
	this.sendSkillSteel = function(g, heroid, skillid, time){
		var s = 'subcmd=41,id='+heroid+',skillid='+skillid+',stime='+time;
		g.send(null, _getHeroMsg(s) );
	};
	
	this.sendWearTSkill = function(g, heroid, skillid){
		var s = 'subcmd=43,id='+heroid+',skillid='+skillid;
		g.send(null, _getHeroMsg(s) );
	};
	
	this.sendUnWearTSkill = function(g, heroid, skillid){
		var s = 'subcmd=45,id='+heroid;
		g.send(null, _getHeroMsg(s) );
	};
	
	this.sendWearArm = function(g, heroId, itemId){
		var s = 'subcmd=46,heroId='+heroId+',itemId='+itemId;
		g.send(null, _getHeroMsg(s) );
	};
	
	this.sendUnWearArm = function(g, heroId, armPos){
		var s = 'subcmd=47,heroId='+heroId+',armPos='+armPos;
		g.send(null, _getHeroMsg(s) );
	};
	
	this.sendStopHeroSteel = function(g, heroId){
		var s = 'subcmd=48,heroId='+heroId;
		g.send(null, _getHeroMsg(s) );
	};
	
	this.sendStopAllHerosSteel = function(g){
		var s = 'subcmd=48,heroId=-1';
		g.send(null, _getHeroMsg(s) );
	};
	
	this.sendHerosSteel = function(g, steelType, heros, steelQuarters, efficiencys){
		var s = '';
		for ( var i=0; i<heros.length; ++i ) {
			s += ',hid'+(i+1)+'='+heros[i].id;
			s += ',sq'+(i+1)+'='+steelQuarters[i];
			s += ',eff'+(i+1)+'='+((efficiencys && efficiencys[i].cur) ? 1 : 0);
		}
		
		var intSteelType = 0;
		if ( steelType == 'highsteel' ) intSteelType = 1;
		else if ( steelType == 'vip1steel' ) intSteelType = 2;
		else if ( steelType == 'vip2steel' ) intSteelType = 3;
		
		s = 'subcmd=49,steelType='+intSteelType+',count='+heros.length+s;
		g.send(null, _getHeroMsg(s) );
	};
	
	this.sendUpgradeNAttr = function(g, heroId){
		var s = 'subcmd=50,heroId='+heroId;
		g.send(null, _getHeroMsg(s) );
	};
	
	var _getHeroMsg = function(s) {
		return '{cmd='+NETCMD.HERORES+','+s+'}';
	};
}).snew();

RoleSender = Class.extern(function(){
	this.sendSavePP = function(g, pps) {
		var s = 'subcmd=2'+pps;
		g.send(null, _getRoleMsg(s));
	};
	
	this.sendChangeCity = function(g, cityid) {
		var s = 'subcmd=3,cid='+cityid;
		g.send(null, _getRoleMsg(s));
	};
	
	this.sendClearPP = function(g, forceval, polityval){
		var s = 'subcmd=4,fval='+forceval+',pval='+polityval;
		g.send(null, _getRoleMsg(s));
	};
	
	this.sendAssignExp = function(g, heroid, exp) {
		var s = 'subcmd=5,heroid='+heroid+',exp='+exp;
		g.send(null, _getRoleMsg(s));
	};	
	
	this.sendSelfSign = function(g, selfSign) {
		var s = 'subcmd=6,intr="' + selfSign + '"';
		g.send(null, _getRoleMsg(s));
	};
	
	this.sendSearchRoleForRank = function(g, roleName){
		var key = 'RoleSender.sendSearchRoleForRank';
		g.regSendDelay(key, 300);
		var s = 'subcmd=7,role="' + roleName + '"';
		g.send(key, _getRoleMsg(s));
	};
	
	this.sendGetPageRankRoles = function(g, pageNo){
		var key = 'RoleSender.sendGetPageRankRoles';
		g.regSendDelay(key, 300);
		var s = 'subcmd=8,pageNo=' + pageNo;
		g.send(key, _getRoleMsg(s));
	};
	
	var _getRoleMsg = function(s) {
		return '{cmd='+NETCMD.ROLEBASE+','+s+'}';
	};
}).snew();

UseItemSender = Class.extern(function(){
	this.send = function(g, item, number, target){
		var s = '{cmd='+NETCMD.USEITEM+',id='+item.id+',resid='+item.resid+',number='+number;
		for ( k in target ) {
			if (TQ.getTypeof(target[k]) == 'string' ){
				s += ',t'+k+'="'+target[k]+'"';
			}
			else {
				s += ',t'+k+'='+target[k];
			}
		}
		s += '}';
		g.send(null, s);
	};
}).snew();

CultureSender = Class.extern(function(){
	this.sendGetCultures = function(g) {
		var s = 'subcmd=1';
		g.send(null, _makeMsg(s) );
	};
	
	this.sendLearn = function(g, cultureId) {
		var s = 'subcmd=2,id='+cultureId;
		g.send(null, _makeMsg(s) );
	};
	
	this.sendCancelLearn = function(g) {
		var s = 'subcmd=3';
		g.send(null, _makeMsg(s) );
	};
	
	var _makeMsg = function(s) {
		return '{cmd='+NETCMD.CULTURE+','+s+'}';
	};
}).snew();


MilitarySender = Class.extern(function(){
	this.sendGetMilitary = function(g){
		g.send(null, _makeMsg('subcmd=0'));
	};
	
	this.sendExped = function(g, expedTarget, expedType, lineup, heroIds) {
		var s = 'subcmd=1';
		s += this.makeExpedStr(expedTarget, expedType, lineup, heroIds);
		g.send(null, _makeMsg(s));
	};
	
	this.makeExpedStr = function(expedTarget, expedType, lineup, heroIds){
		var s = '';
		s += ',ttype='+expedTarget.type;
		s += ',tid='+expedTarget.id;
		s += ',expedType='+expedType;
		s += ',lineup='+lineup;
		s += _makeHeros(heroIds);
		return s;
	};
	
	this.sendDelFavoriteTarget = function(g, targetId){
		var s = 'subcmd=2,id='+targetId;
		g.send(null, _makeMsg(s));
	};
	
	this.sendDefaultTeam = function(g, teamId, lineup, heroIds) {
		var s = 'subcmd=3';
		s += ',teamid='+teamId;
		s += ',lineup='+lineup;
		s += _makeHeros(heroIds);
		g.send(null, _makeMsg(s));
	};
	
	this.sendGetAllArmys = function(g){
		g.send(null, _makeMsg('subcmd=4'));
	};
	
	this.sendCallBackArmy = function(g, armyId){
		g.send(null, _makeMsg('subcmd=5,armyId=' + armyId));
	};
	
	this.sendRepatriateArmy = function(g, armyId){
		g.send(null, _makeMsg('subcmd=6,armyId=' + armyId));
	};
	
	this.sendAddFavorite = function(g, gridId){
		g.send(null, _makeMsg('subcmd=7,gridId=' + gridId));
	};
	
	this.sendDeclareFight = function(g, targetId){
		g.send(null, _makeMsg('subcmd=8,targetId=' + targetId));
	};
	
	this.sendGetFavorites = function(g){
		g.send(null, _makeMsg('subcmd=9'));
	};
	
	this.sendSaveForceLineUp = function(g, type, lineup, heroIds){
		var s = 'subcmd=10';
		s += ',type='+type;
		s += ',lineup='+lineup;
		s += _makeHeros(heroIds);
		g.send(null, _makeMsg(s));
	};
	
	this.sendGetForceLineUp = function(g){
		g.send(null, _makeMsg('subcmd=11'));
	};
	
	this.makeHeros = function(heros) {
		return _makeHeros(heros);
	};
	
	var _makeHeros = function(heros) {
		var sheros = '';
		for ( var i=0; i<heros.length; ++i ) {
			var heroId = heros[i];
			sheros += ',hid'+(i+1)+'='+heroId;
		}
		return ',count='+heros.length+sheros;
	};	
	
	var _makeMsg = function(s) {
		return '{cmd='+NETCMD.MILITARY+','+s+'}';
	};
}).snew();

MailSender = Class.extern(function(){
	this.sendGetMails = function(g){
		g.send(null, _makeMsg('subcmd=1') );
	};
	
	this.sendGetDetailMail = function(g, mailId){
		g.send(null, _makeMsg('subcmd=2,id='+mailId) );
	};
	
	this.sendMail = function(g, to, title, msg){
		var etitle = TQ.encodeMsgByBytesLimit(title, JVALID.getMaxMailTitleBytes());
		var emsg = TQ.encodeMsgByBytesLimit(msg, JVALID.getMaxMailContentBytes());
		
		g.send(null, _makeMsg('subcmd=3,to="'+to+'",title="'+etitle+'",msg="'+emsg+'"') );
	};
	
	this.sendDelMails = function(g, mailIds){
		if ( mailIds.length == 0 ) {
			return;
		}
		
		var s = '';
		for ( var i=0; i<mailIds.length; ++i ) {
			s += ',id' + (i+1) + '=' + mailIds[i];
		}
		g.send(null, _makeMsg('subcmd=4,cnt='+mailIds.length+s) );
	};
	
	this.sendGetItems = function(g, mailId){
		g.send(null, _makeMsg('subcmd=5,id='+mailId) );
	};
	
	var _makeMsg = function(s) {
		return '{cmd='+NETCMD.MAIL+','+s+'}';
	};
}).snew();


MapSender = Class.extern(function(){
	this.sendEnterCity = function(g, id){
		var sendmsg = '{cmd='+NETCMD.MAP+',subcmd=1,id='+id+'}';
		g.send(null,sendmsg);
	};
}).snew();

ShopSender = Class.extern(function(){
	this.sendBuyItem = function(g, payment, buynum, item){
		var s = 'subcmd=1'
			+',paytype='+payment
			+',id='+item.id
			+',resid='+item.resid
			+',num='+buynum;
		g.send(null, _makeMsg(s) );
	};
	
	this.sendGetShopSalesList = function(g){
		g.send(null, _makeMsg('subcmd=2') );
	};
	
	this.sendSaleItem = function(g, item){
		var s = 'subcmd=3,id='+item.id;
		g.send(null, _makeMsg(s) );
	};
	
	this.sendBuyGold = function(g, resid, number){
		var s = 'subcmd=4,id=' + resid + ',number=' + number;
		g.send(null, _makeMsg(s) );
	};
	
	var _makeMsg = function(s) {
		return '{cmd='+NETCMD.SHOP+','+s+'}';
	};
}).snew();

ItemOpSender = Class.extern(function(){
	this.sendDecomposeIds = function(g, ids){
		var s = '';
		for (var i=0; i<ids.length; ++i){
			s += ',id' + (i+1) + '=' + ids[i];
		}
		
		s = 'count=' + ids.length + s;
		g.send(null, _makeMsg('subcmd=1,' + s) );
	};
	
	this.sendIntensifyArm = function(g, heroId, armId){
		g.send(null, _makeMsg('subcmd=2,hid=' + heroId + ',id=' + armId) );
	};
	
	this.sendBesetGem = function(g, heroId, armId, gemPos, gemId){
		g.send(null, _makeMsg('subcmd=3,hid=' + heroId + ',id=' + armId + ',gpos=' + gemPos + ',gid=' + gemId) );
	};
	
	this.sendUnbesetGem = function(g, heroId, armId, gemPos){
		g.send(null, _makeMsg('subcmd=4,hid=' + heroId + ',id=' + armId + ',gpos=' + gemPos) );
	};
	
	this.sendUnbesetAllGems = function(g, heroId, armId){
		this.sendUnbesetGem(g, heroId, armId, -1);
	};
	
	this.sendCombineGems = function(g, gemResId, comblineLevel, isBatchCombine){
		g.send(null, _makeMsg('subcmd=5,gid=' + gemResId + ',clevel=' + comblineLevel + ',batch=' + (isBatchCombine ? 1 : 0) ) );
	};
	
	this.sendUpgradeGem = function(g, heroId, armId, gemPos, gemResId){
		g.send(null, _makeMsg('subcmd=6,hid=' + heroId + ',id=' + armId + ',gpos=' + gemPos + ',gid=' + gemResId ) );
	};
	
	this.sendDropItem = function(g, item){
		g.send(null, _makeMsg('subcmd=7,id=' + item.id));
	};

	var _makeMsg = function(s) {
		return '{cmd='+NETCMD.ITEMOP+','+s+'}';
	};
}).snew();

OutFieldSender = Class.extern(function(){
	var CMD_GETFIELDSBYPOS_INTERVAL = 120;
	var m_this = null;
	this.init = function(){
		m_this = this;
	};
	
	this.sendGetFieldsByPos = function(g, pos){
		var key = 'cmd_getfieldsbypos';
		g.regSendDelay(key, CMD_GETFIELDSBYPOS_INTERVAL);
		g.send(key, _makeMsg('subcmd=1,posX=' + pos.x + ',posY=' + pos.y));
	};
	
	this.sendGetFieldDetail = function(g, gridId){
		g.send(null, _makeMsg('subcmd=2,gridId=' + gridId));
	};
	
	this.sendGetFieldDetailByRole = function(g, roleName){
		g.send(null, _makeMsg('subcmd=2,roleName="' + roleName+'"'));
	};
	
	this.sendRefreshFieldsByLastViewPos = function(g){
		g.send(null, _makeMsg('subcmd=3'));
	};
	
	this.sendEnterOutField = function(g){
		g.send(null, _makeMsg('subcmd=4'));
	};
	
	var _makeMsg = function(s) {
		return '{cmd='+NETCMD.OUTFIELD+','+s+'}';
	};
}).snew();

FriendSender = Class.extern(function(){
	this.sendGetAllFriends = function(g){
		g.send(null, _makeMsg('subcmd=1'));
	};
	
	this.sendApplyFriend = function(g, roleName){
		if (g.getImgr().hasFriend(roleName)) {
			g.getGUI().sysMsgTips(SMT_NORMAL, rstr.ids[100045].msg);
		} else {
			var key = 'cmd_applyfriend';
			g.regSendDelay(key, 500);
			g.send(key, _makeMsg('subcmd=2,name="' + roleName + '"'));
			g.getGUI().sysMsgTips(SMT_NORMAL, rstr.ids[100059].msg);
		}
	};
	
	this.sendAgreeApplyFriend = function(g, roleId){
		g.send(null, _makeMsg('subcmd=3,id=' + roleId));
	};
	
	this.sendRejectApplyFriend = function(g, roleId){
		g.send(null, _makeMsg('subcmd=4,id=' + roleId));
	};
	
	this.sendDeleteFriend = function(g, roleId){
		g.send(null, _makeMsg('subcmd=5,id=' + roleId));
	};
	
	this.sendFriendChat = function(g, roleId, msg){
		g.send(null, _makeMsg('subcmd=6,id=' + roleId + ',msg="' + msg + '"'));
	};
	
	var _makeMsg = function(s) {
		return '{cmd=' + NETCMD.FRIEND + ',' + s + '}';
	};	
}).snew();

SelfFieldSender = Class.extern(function(){
	this.sendGetAllSelfFields = function(g){
		g.send(null, _makeMsg('subcmd=0'));
	};
	
	this.sendStartCollect = function(g, fieldId){
		g.send(null, _makeMsg('subcmd=1,fieldId=' + fieldId));
	};
	
	this.sendStopCollect = function(g, fieldId){
		g.send(null, _makeMsg('subcmd=2,fieldId=' + fieldId));
	};
	
	this.sendGiveUpField = function(g, fieldId){
		g.send(null, _makeMsg('subcmd=3,fieldId=' + fieldId));
	};
	
	this.sendRecallArmy = function(g, fieldId){
		g.send(null, _makeMsg('subcmd=4,fieldId=' + fieldId));
	};
	
	this.sendGetCanGetRes = function(g, fieldId){
		g.send(null, _makeMsg('subcmd=5,fieldId=' + fieldId));
	};
	
	var _makeMsg = function(s) {
		return '{cmd=' + NETCMD.SELFFIELD + ',' + s + '}';
	};	
}).snew();

CityBuildSender = Class.extern(function(){
	this.sendGetAllBuilds = function(g, cityId){
		g.send(null, _makeMsg('subcmd=1,cid='+cityId));
	};
	
	this.sendAddBuild = function(g, cityId, blockId, buildResId){
		g.send(null, _makeMsg('subcmd=2,cid='+cityId+',id='+blockId+',resid='+buildResId));
	};
	
	this.sendUpgradeBuild = function(g, cityId, blockId){
		g.send(null, _makeMsg('subcmd=3,cid='+cityId+',id='+blockId));
	};
	
	this.sendDownBuild = function(g, cityId, blockId){
		g.send(null, _makeMsg('subcmd=4,cid='+cityId+',id='+blockId));
	};
	
	this.sendCancelBuild = function(g, cityId, blockId) {
		g.send(null, _makeMsg('subcmd=5,cid='+cityId+',id='+blockId));
	};
	
	this.sendCreateSubCity = function(g, subCityId, subCityType){
		g.send(null, _makeMsg('subcmd=6,id='+subCityId+',type='+subCityType));
	};
	
	this.sendChangeSubCity = function(g, subCityId, subCityType){
		g.send(null, _makeMsg('subcmd=7,id='+subCityId+',type='+subCityType));
	};
	
	var _makeMsg = function(s) {
		return '{cmd=' + NETCMD.BUILDRES + ',' + s + '}';
	};	
}).snew();

AlliBuildSender = Class.extern(function(){
	this.sendUpgrade = function(g, id){
		g.send(null, _makeMsg('subcmd=8,id='+id));
	};
	
	this.sendStop = function(g, id){
		g.send(null, _makeMsg('subcmd=9,id='+id));
	};	
	
	var _makeMsg = function(s) {
		return '{cmd=' + NETCMD.BUILDRES + ',' + s + '}';
	};	
}).snew();

CityDefSender = Class.extern(function(){
	this.sendGetCityDefInfo = function(g){
		g.send(null, _makeMsg('subcmd=1'));
	};
	
	this.sendCancelBuilding = function(g){
		g.send(null, _makeMsg('subcmd=2'));
	};
	
	this.sendBuildCityDef = function(g, typeIdx, number){
		var type = CITYDEF_TYPE.FIRST + typeIdx;
		g.send(null, _makeMsg('subcmd=3,type=' + type + ',number='+number));
	};
	
	this.sendDownCityDef = function(g, typeIdx, number){
		var type = CITYDEF_TYPE.FIRST + typeIdx;
		g.send(null, _makeMsg('subcmd=4,type=' + type + ',number='+number));
	};
	
	this.sendSaveDefArmy = function(g, lineup, heros){
		g.send(null, _makeMsg('subcmd=5,lineup=' + lineup + _makeHeros(heros)));
	};
	
	var _makeHeros = function(heros) {
		var sheros = '';
		for ( var i=0; i<heros.length; ++i ) {
			var heroId = heros[i];
			sheros += ',hid'+(i+1)+'='+heroId;
		}
		return ',count='+heros.length+sheros;
	};	
	
	var _makeMsg = function(s) {
		return '{cmd=' + NETCMD.CITYDEF + ',' + s + '}';
	};	
}).snew();

BaseSender = Class.extern(function(){
	this.makeAssignSoldiers = function(assigns){
		var s = '';
		for ( var i=0; i<assigns.length; ++i ){
			var assign = assigns[i];
			s += ',hid' + (i+1) + '=' + assign.id;
			s += ',sid' + (i+1) + '=' + assign.resid;
			s += ',snum' + (i+1) + '=' + assign.number;
		}
		
		s = 'count=' + assigns.length + s;
		return s;
	};
});

SoldierSender = BaseSender.extern(function(){
	this.sendGetSoldiers = function(g) {
		var s = '{cmd='+NETCMD.SOLDIERRES+',subcmd=1}';
		g.send(null, s);
	};
	
	this.sendTraining = function(g, resid, number) {
		var s = '{cmd='+NETCMD.SOLDIERRES+',subcmd=2,id='+resid+',num='+number+'}';
		g.send(null, s);
	};
	
	this.sendUpgrade = function(g, resid, number) {
		var s = '{cmd='+NETCMD.SOLDIERRES+',subcmd=3,id='+resid+',num='+number+'}';
		g.send(null, s);
	};
	
	this.sendDemob = function(g, resid, number) {
		var s = '{cmd='+NETCMD.SOLDIERRES+',subcmd=4,id='+resid+',num='+number+'}';
		g.send(null, s);
	};
	
	this.sendConfirmSoldiersAssign = function(g, assigns){
		if (!assigns || assigns.length == 0 ) {
			return;
		}
		
		var key = 'cmd_confirmsoldiersassign';
		g.regSendDelay(key, 50);
		
		var s = 'subcmd=8,'+this.makeAssignSoldiers(assigns);
		g.send(key, _makeMsg(s));
	};
	
	var _makeMsg = function(s){
		return '{cmd='+NETCMD.SOLDIERRES+','+s+'}';
	};
}).snew();

TowerSender = BaseSender.extern(function(){
	this.sendConfirmSoldiersAssign = function(g, assigns){
		if (!assigns || assigns.length == 0 ) {
			return;
		}
		
		g.send(null, _makeMsg('subcmd=1,' + this.makeAssignSoldiers(assigns) ));
	};
	
	var _makeMsg = function(s) {
		return '{cmd=' + NETCMD.TOWER + ',' + s + '}';
	};	
}).snew();

ExchangeHeroExpSender = Class.extern(function(){
	this.sendGetTimes = function(g){
		g.send(null, _makeMsg('subcmd=1'));
	};
	
	this.sendExchange = function(g, exchangeTimes){
		g.send(null, _makeMsg('subcmd=2,times=' + exchangeTimes));
	};
	
	var _makeMsg = function(s) {
		return '{cmd=' + NETCMD.EXCHANGEEXP + ',' + s + '}';
	};	
}).snew();

FightResStateSender = Class.extern(function(){
	this.sendGetRefStates = function(g){
		g.send(null, _makeMsg('subcmd=1'));
	};
	
	var _makeMsg = function(s) {
		return '{cmd=' + NETCMD.FIGHTREFSTATE + ',' + s + '}';
	};	
}).snew();

RoleStateSender = Class.extern(function(){
	this.getAllStates = function(g){
		g.send(null, _makeMsg('subcmd=1'));
	};
	
	this.cancelState = function(g, effectId){
		g.send(null, _makeMsg('subcmd=2,state=' + effectId));
	};
	
	var _makeMsg = function(s) {
		return '{cmd=' + NETCMD.ROLESTATE + ',' + s + '}';
	};	
}).snew();

ChatSender = Class.extern(function(){
	this.init = function(){
		this.lastTimes = {};
		this.lastTimes[CHAT_TARGET.WORLD] = {lastTime:0, limitTime:15*1000,errorTip:rstr.chatpanel.tooFrequency.world};
		this.lastTimes[CHAT_TARGET.STATE] = {lastTime:0, limitTime:5*1000,errorTip:rstr.chatpanel.tooFrequency.state};
		this.lastTimes[CHAT_TARGET.ALLIANCE] = {lastTime:0, limitTime:10*1000,errorTip:rstr.chatpanel.tooFrequency.alliance};
		this.lastTimes[CHAT_TARGET.PLAYER] = {lastTime:0, limitTime:5*1000,errorTip:rstr.chatpanel.tooFrequency.player};
	};
	
	this.sendMsg = function(g, target, msg){
		if ( this._isTooFrequency(g, target, msg) )
			return;
			
		this._updateLastTimes(g, target, msg);
		msg = this._encodeMessage(msg);
		g.send(null, this._makeMsg('subcmd=0,target='+target+',msg="'+msg+'"') );
	};
	
	this._makeMsg = function(s){
		return '{cmd='+NETCMD.CHAT+',' + s + '}';
	};
	
	this._isTooFrequency = function(g, target, msg){
		var node = this.lastTimes[this._getCheckTarget(target, msg)];
		if (g.getCurTimeMs() - node.lastTime <= node.limitTime){
			UIM.getPanel('chat').appendMsgToCurChannel(node.errorTip);
			return true;
		}
		
		return false;
	};
	
	this._updateLastTimes = function(g, target, msg){
		var node = this.lastTimes[this._getCheckTarget(target, msg)];
		node.lastTime = g.getCurTimeMs();
	};
	
	this._encodeMessage = function(msg){
		msg = msg.replace('"', '\'');
		msg = msg.replace('\n', ' ');
		return msg.replace('\r', ' ');
	};
	
	this._getCheckTarget = function(target, msg){
		if (msg.indexOf('/') == 0) {
			return CHAT_TARGET.PLAYER;
		}
		return target;
	};
}).snew();

AllianceSender = Class.extern(function(){
	this.sendCreateAlli = function(g, allianceName, allianceFlag) {
		g.send(null, _makeMsg('subcmd=1,name="' + allianceName + '",flag="' + allianceFlag + '"') );
	};
	
	this.sendApplyJoin = function(g, allianceName) {
		g.send(null, _makeMsg('subcmd=2,name="' + allianceName + '"') );
	};
	
	this.sendGetCurApplying = function(g){
		g.send(null, _makeMsg('subcmd=3') );
	};
	
	this.sendGetAllianceDetail = function(g, allianceName){
		g.send(null, _makeMsg('subcmd=4,name="' + allianceName + '"') );
	};
	
	this.sendGetInviteList = function(g){
		g.send(null, _makeMsg('subcmd=5') );
	};
	
	this.sendAgreeInvite = function(g, roleId, allianceId){
		g.send(null, _makeMsg('subcmd=6,roleId=' + roleId + ',alliId=' + allianceId) );
	};
	
	this.sendIgnoreInvite = function(g, roleId, allianceId){
		g.send(null, _makeMsg('subcmd=7,roleId=' + roleId + ',alliId=' + allianceId) );
	};
	
	this.sendGetAlliList = function(g, cityResId, pageNo){
		var key = 'cmd_alli_sendGetAlliList';
		g.regSendDelay(key, 300);
		g.send(key, _makeMsg('subcmd=8,cityResId=' + cityResId + ',pageNo=' + pageNo) );
	};
	
	this.sendSearchAlliance = function(g, cityResId, allianceName){
		var key = 'cmd_alli_sendSearchAlliance';
		g.regSendDelay(key, 300);
		g.send(key, _makeMsg('subcmd=9,cityResId=' + cityResId + ',name="' + allianceName + '"') );
	};
	
	this.sendGetSelfMems = function(g, pageNo){
		var key = 'cmd_alli_sendGetSelfMems';
		g.regSendDelay(key, 300);
		g.send(key, _makeMsg('subcmd=10,pageNo=' + pageNo) );
	};
	
	this.sendGetOtherMems = function(g, allianceName, pageNo){
		var key = 'cmd_alli_sendGetOtherMems';
		g.regSendDelay(key, 300);
		g.send(key, _makeMsg('subcmd=11,name="' + allianceName + '",pageNo=' + pageNo) );
	};
	
	this.sendGetMyAllianceDetail = function(g){
		g.send(null, _makeMsg('subcmd=12') );
	};
	
	this.sendUpgradeAlliance = function(g){
		g.send(null, _makeMsg('subcmd=13') );
	};
	
	this.sendModifyQQGroup = function(g, qqGroup){
		g.send(null, _makeMsg('subcmd=14,qq=' + qqGroup) );
	};
	
	this.sendInvite = function(g, roleName){
		g.send(null, _makeMsg('subcmd=15,role="' + roleName + '"') );
	};
	
	this.sendDismiss = function(g){
		g.send(null, _makeMsg('subcmd=16') );
	};
	
	this.sendCancelDismiss = function(g){
		g.send(null, _makeMsg('subcmd=17') );
	};
	
	this.sendExitAlliance = function(g){
		g.send(null, _makeMsg('subcmd=18') );
	};
	
	this.sendModifyIntroduce = function(g, introduce){
		var eintroduce = TQ.encodeMsgByBytesLimit(introduce, JVALID.getMaxAllianceIntroduceBytes());
		g.send(null, _makeMsg('subcmd=19,introduce="' + eintroduce + '"') );
	};
		
	this.sendModifyBulletin = function(g, bulletin){
		var ebulletin = TQ.encodeMsgByBytesLimit(bulletin, JVALID.getMaxAllianceBulletinBytes());
		g.send(null, _makeMsg('subcmd=20,bulletin="' + ebulletin + '"') );
	};
	
	this.sendGainTodayGift = function(g){
		g.send(null, _makeMsg('subcmd=21') );
	};
	
	this.sendUpgradeLawLight = function(g){
		g.send(null, _makeMsg('subcmd=22') );
	};
	
	this.sendLawLightBestow = function(g){
		g.send(null, _makeMsg('subcmd=23') );
	};
	
	this.sendLawLightFeed = function(g){
		g.send(null, _makeMsg('subcmd=24,isAll=0') );
	};
	
	this.sendLawLightFeedAll = function(g){
		g.send(null, _makeMsg('subcmd=24,isAll=1') );
	};
	
	this.sendGetALeaders = function(g){
		g.send(null, _makeMsg('subcmd=25') );
	};
	
	this.sendTransferLeader = function(g, targetName){
		g.send(null, _makeMsg('subcmd=26,role="' + targetName + '"') );
	};
	
	this.sendStopTransfer = function(g){
		g.send(null, _makeMsg('subcmd=27') );
	};
	
	this.sendContributeRes = function(g, resIdx, times){
		g.send(null, _makeMsg('subcmd=28,resIdx=' + resIdx + ',times=' + times) );
	};
	
	this.sendGetTodaySortMems = function(g, pageNo){
		var key = 'cmd_alli_sendGetTodaySortMems';
		g.regSendDelay(key, 300);
		g.send(key, _makeMsg('subcmd=29,pageNo=' + pageNo) );
	};
	
	this.sendGetAllSortMems = function(g, pageNo){
		var key = 'cmd_alli_sendGetAllSortMems';
		g.regSendDelay(key, 300);
		g.send(key, _makeMsg('subcmd=30,pageNo=' + pageNo) );
	};
	
	this.sendAppointMember = function(g, role, alliancePos){
		g.send(null, _makeMsg('subcmd=31,role="' + role  + '",alliPos=' + alliancePos) );
	};
	
	this.sendFireMember = function(g, role){
		g.send(null, _makeMsg('subcmd=32,role="' + role  + '"') );
	};
	
	this.sendAgreeApply = function(g, roleId){
		g.send(null, _makeMsg('subcmd=33,roleId=' + roleId ) );
	};
	
	this.sendIgnoreApply = function(g, roleId){
		g.send(null, _makeMsg('subcmd=34,roleId=' + roleId ) );
	};
	
	this.sendGetEvents = function(g, pageNo){
		var key = 'cmd_alli_sendGetEvents';
		g.regSendDelay(key, 300);
		g.send(key, _makeMsg('subcmd=35,pageNo=' + pageNo) );
	};
	
	this.sendGetApplyMerges = function(g){
		g.send(null, _makeMsg('subcmd=36') );
	};
	
	this.sendApplyMerge = function(g, allianceName){
		g.send(null, _makeMsg('subcmd=37,name="' + allianceName + '"') );
	};
	
	this.sendAgreeMerge = function(g, allianceName){
		g.send(null, _makeMsg('subcmd=38,name="' + allianceName + '"') );
	};
	
	this.sendRefuseMerge = function(g, allianceName){
		g.send(null, _makeMsg('subcmd=39,name="' + allianceName + '"') );
	};
	
	this.sendGetAuctionInfo = function(g){  // need svr handle
		g.send(null, _makeMsg('subcmd=40') );
	};
	
	this.sendAuctionBuyItem = function(g, itemid, price){  // need svr handle
		g.send(null, _makeMsg('subcmd=41,id='+itemid+',price='+price) );
	};
	
	this.sendSellItem = function(g, itemId, number, auctionPrice, fixedPrice){  // need svr handle
		g.send(null, _makeMsg('subcmd=42,id='+itemId+',number='+number+',auctionPrice='+auctionPrice+',fixedPrice='+fixedPrice) );
	};
	
	this.sendCancelSellItem = function(g, itemId){  // need svr handle
		g.send(null, _makeMsg('subcmd=43,id='+itemId) );
	};
	
	this.sendGetSellItems = function(g){  // need svr handle
		g.send(null, _makeMsg('subcmd=44') );
	};

	var _makeMsg = function(s) {
		return '{cmd=' + NETCMD.ALLIANCE + ',' + s + '}';
	};	
}).snew();

OtherPlayerSender = Class.extern(function(){
	this.sendGetBuildAddSpeed = function(g, targetName){
		g.send(null, _makeMsg('subcmd=1,name="' + targetName + '"') );
	};
	
	var _makeMsg = function(s) {
		return '{cmd=' + NETCMD.OTHERPLAYERINFO + ',' + s + '}';
	};		
}).snew();

TradingAreaSender = Class.extern(function(){
	this.sendGetMyTradingInfo = function(g){
		g.send(null, _makeMsg('subcmd=1') );
	};
	
	this.sendStartTrading = function(g, isVip){
		var vip = isVip ? 1 : 0;
		g.send(null, _makeMsg('subcmd=2,vip=' + vip) );
	};
	
	this.sendCancelTrading = function(g){
		g.send(null, _makeMsg('subcmd=3') );
	};
	
	this.sendSetTradingArea = function(g, targets){
		var s = '';
		for ( var i=0; i<targets.length; ++i ) {
			s += ',t' + (i+1) + '=';
			s += targets[i];
		}
		g.send(null, _makeMsg('subcmd=4,count=' + targets.length + s) );
	};
	
	this.sendGetMembers = function(g){
		g.send(null, _makeMsg('subcmd=5') );
	};
	
	this.sendGetMemDetail = function(g, roleId){
		var key = 'cmd_trading_sendGetMemDetail' + roleId;
		g.regSendDelay(key, 100);
		g.send(key, _makeMsg('subcmd=6,roleId='+roleId) );
	};
	
	var _makeMsg = function(s) {
		return '{cmd=' + NETCMD.TRADING_AREA + ',' + s + '}';
	};
}).snew();

ActTowerSender = Class.extern(function(){
	this.sendGetBaseInfo = function(g){
		g.send(null, _makeMsg('subcmd=1') );
	};
	
	this.sendEnterTower = function(g, startLayer, isGainGift){
		var gainGift = isGainGift ? 1 : 0;
		g.send(null, _makeMsg('subcmd=2,startLayer=' + startLayer + ',gainGift=' + gainGift) );
	};
	
	this.sendExped = function(g, expedTarget, expedType, lineup, heroIds){
		var s = 'subcmd=3';
		s += MilitarySender.makeExpedStr(expedTarget, expedType, lineup, heroIds);
		g.send(null, _makeMsg(s) );
	};
	
	this.sendLeaveTower = function(g){
		g.send(null, _makeMsg('subcmd=4') );
	};	
	
	this.sendStartAutoFight = function(g, heroIds, toLayer){
		g.send(null, _makeMsg('subcmd=5' + MilitarySender.makeHeros(heroIds) + ',toLayer=' + toLayer));
	};
	
	this.sendStopAutoFight = function(g){
		g.send(null, _makeMsg('subcmd=6') );
	};
	
	this.sendSearchRoleForRank = function(g, roleName){
		var key = 'ActTowerSender.sendSearchRoleForRank';
		g.regSendDelay(key, 300);
		var s = 'subcmd=7,role="' + roleName + '"';
		g.send(key, _makeMsg(s));
	};
	
	this.sendGetPageRankRoles = function(g, pageNo){
		var key = 'ActTowerSender.sendGetPageRankRoles';
		g.regSendDelay(key, 300);
		var s = 'subcmd=8,pageNo=' + pageNo;
		g.send(key, _makeMsg(s));
	};
	
	this.sendCheckAutoFight = function(g){
		var s = 'subcmd=9';
		g.send('', _makeMsg(s));
	};
	
	var _makeMsg = function(s) {
		return '{cmd=' + NETCMD.ACT_TOWER + ',' + s + '}';
	};
}).snew();

ActTerraceSender = Class.extern(function(){
	this.sendGetBaseInfo = function(g){
		g.send(null, _makeMsg('subcmd=1') );
	};
	
	this.sendEnterTerrace = function(g, gateId){
		g.send(null, _makeMsg('subcmd=2,gateId=' + gateId) );
	};

	this.sendExped = function(g, expedTarget, expedType, lineup, heroIds){
		var s = 'subcmd=3';
		s += MilitarySender.makeExpedStr(expedTarget, expedType, lineup, heroIds);
		g.send(null, _makeMsg(s) );
	};
	
	this.sendLeaveTerrace = function(g){
		g.send(null, _makeMsg('subcmd=4') );
	};
	
	this.sendStartAutoFight = function(g, heroIds, toGate){
		g.send(null, _makeMsg('subcmd=5' + MilitarySender.makeHeros(heroIds) + ',toGate=' + toGate));
	};
	
	this.sendStopAutoFight = function(g){
		g.send(null, _makeMsg('subcmd=6') );
	};
	
	this.sendCheckAutoFight = function(g){
		var s = 'subcmd=7';
		g.send('', _makeMsg(s));
	};
	
	var _makeMsg = function(s) {
		return '{cmd=' + NETCMD.ACT_TERRACE + ',' + s + '}';
	};
}).snew();

TaskSender = Class.extern(function(){
	this.sendGetAllTasks = function(g){
		g.send(key, _makeMsg('subcmd=0') );
	};
	
	this.sendGetReward = function(g, taskId){
		var key = 'cmd_task_sendGetReward';
		g.regSendDelay(key, 50);
		g.send(key, _makeMsg('subcmd=1,taskId=' + taskId) );
	};
	
	this.sendDoRoleTask = function(g, taskId){
		var key = 'cmd_task_sendDoRoleTask';
		g.regSendDelay(key, 50);
		g.send(key, _makeMsg('subcmd=2,taskId=' + taskId) );
	};
	
	this.sendChangeEverydayTask = function(g, taskId){
		var key = 'cmd_task_sendChangeEverydayTask';
		g.regSendDelay(key, 50);
		g.send(key, _makeMsg('subcmd=3,taskId=' + taskId) );
	};
	
	this.sendCompleteEverydayTask = function(g, taskId){
		var key = 'cmd_task_sendCompleteEverydayTask';
		g.regSendDelay(key, 50);
		g.send(key, _makeMsg('subcmd=4,taskId=' + taskId) );
	};
	
	this.sendGetRewardByPrestige = function(g){
		var key = 'cmd_task_sendGetRewardByPrestige';
		g.regSendDelay(key, 50);
		g.send(key, _makeMsg('subcmd=5') );
	};
	
	this.sendGetOnlineTaskReward = function(g){
		var key = 'cmd_task_sendGetOnlineTaskReward';
		g.regSendDelay(key, 50);
		g.send(key, _makeMsg('subcmd=6') );
	};
	
	this.sendGetOnlineTaskInfo = function(g){
		g.send(null, _makeMsg('subcmd=7') );
	};
	
	this.sendAddFavorite = function(g){
		g.send(null, _makeMsg('subcmd=8') );
	};
	
	this.sendNewcomerTaskEnd = function(g){
		g.send(null, _makeMsg('subcmd=9') );
	};
	
	var _makeMsg = function(s) {
		return '{cmd=' + NETCMD.TASK + ',' + s + '}';
	};
}).snew();

ActivityValSender = Class.extern(function(){
	this.sendGetAllInfo = function(g){
		var key = 'cmd_ActivityValSender.sendGetAllInfo';
		g.regSendDelay(key, 1000);
		g.send(key, _makeMsg('subcmd=1') );
	};
	
	this.sendGetActReward = function(g, id){
		var key = 'cmd_ActivityValSender.sendGetActReward.' + id;
		g.regSendDelay(key, 50);
		g.send(key, _makeMsg('subcmd=2,id=' + id) );
	};
	
	this.sendSignIn = function(g){
		var key = 'cmd_ActivityValSender.sendSignIn';
		g.regSendDelay(key, 50);
		g.send(key, _makeMsg('subcmd=3') );
	};
	
	this.sendGetSignReward = function(g, id){
		var key = 'cmd_ActivityValSender.sendGetSignReward.' + id;
		g.regSendDelay(key, 50);
		g.send(key, _makeMsg('subcmd=4,id=' + id) );
	};
	
	this.sendGetOnlineGoods = function(g){
		g.send(null, _makeMsg('subcmd=5') );
	};
	
	this.sendGetPayActReward = function(g, idx){
		g.send(null, _makeMsg('subcmd=6,idx=' + idx) );
	};
	
	var _makeMsg = function(s){
		return '{cmd=' + NETCMD.ACTIVITY_VAL + ',' + s + '}';
	};
}).snew();

NewcomerHelpSender = Class.extern(function(){
	this.sendGetCurNode = function(g){
		g.send(key, _makeMsg('subcmd=1') );
	};
	
	var _makeMsg = function(s){
		return '{cmd=' + NETCMD.NEWCOMERHELP + ',' + s + '}';
	};
}).snew();

ItemInfoSender = Class.extern(function(){
	this.sendGetDetailItem = function(g, roleId, itemId){
		g.send(null, _makeMsg('subcmd=1,roleId=' + roleId + ',itemId=' + itemId) );
	};
	
	var _makeMsg = function(s) {
		return '{cmd='+NETCMD.ITEM+','+s+'}';
	};
}).snew();

ExchangeSender = Class.extern(function(){
	this.sendExchange = function(g, dropId, count){
		g.send(null, _makeMsg('subcmd=1,dropId=' + dropId + ',count=' + count) );
	};
	
	var _makeMsg = function(s) {
		return '{cmd='+NETCMD.EXCHANGE+','+s+'}';
	};
}).snew();


LogSender = Class.extern(function(){
	this.sendLog = function(g, msg){
		msg = _encodeMsg(msg);
		g.send(null, _makeMsg('subcmd=1,browser=' + TQ.getBrowserType() + ',ver=' + TQ.getBrowserVer() + ',msg="' + msg + '"' ));
	};
	
	this.sendSuggest = function(g, msg){
		msg = _encodeMsg(msg);
		g.send(null, _makeMsg('subcmd=2,msg="' + msg + '"') );
	};
	
	var _encodeMsg = function(msg){
		msg = msg.replace(new RegExp('\"',"g"), ' ');
		msg = msg.replace(new RegExp('\'',"g"), ' ');
		msg = msg.replace(new RegExp('\r\n',"g"), ' ');
		msg = msg.replace(new RegExp('\r',"g"), ' ');
		msg = msg.replace(new RegExp('\n',"g"), ' ');
		return msg.substr(0, 512);
	};
	
	var _makeMsg = function(s) {
		return '{cmd='+NETCMD.CLT_LOG+','+s+'}';
	};
}).snew();


PaymentSender = Class.extern(function(){
	this.sendStartPay = function(g){
		g.send(null, this._makeMsg('subcmd=1'));
	};
	
	this.sendStopPay = function(g){
		g.send(null, this._makeMsg('subcmd=2'));
	};
	
	this._makeMsg = function(s) {
		return '{cmd='+NETCMD.PAYMENT+','+s+'}';
	};
}).snew();


YellowDiamondSender = Class.extern(function(){
	this.sendGetNewGift = function(g){
		g.send(null, this._makeMsg('subcmd=1'));
	};
	
	this.sendGetCommEveryDayGift = function(g){
		g.send(null, this._makeMsg('subcmd=2'));
	};
	
	this.sendGetYearEveryDayGift = function(g){
		g.send(null, this._makeMsg('subcmd=3'));
	};
	
	this.sendGetLevelGift = function(g, id){
		g.send(null, this._makeMsg('subcmd=4,id=' + id));
	};
	
	this.sendGetInfo = function(g){
		g.send(null, this._makeMsg('subcmd=5'));
	};
	
	this._makeMsg = function(s) {
		return '{cmd='+NETCMD.YELLOWDIAMOND+','+s+'}';
	};
}).snew();

BlueDiamondSender = Class.extern(function(){
	this.sendGetNewGift = function(g){
		g.send(null, this._makeMsg('subcmd=1'));
	};
	
	this.sendGetCommEveryDayGift = function(g){
		g.send(null, this._makeMsg('subcmd=2'));
	};
	
	this.sendGetYearEveryDayGift = function(g){
		g.send(null, this._makeMsg('subcmd=3'));
	};
	
	this.sendGetLevelGift = function(g, id){
		g.send(null, this._makeMsg('subcmd=4,id=' + id));
	};
	
	this.sendGetInfo = function(g){
		g.send(null, this._makeMsg('subcmd=5'));
	};
	
	this.sendGetHighEveryDayGift = function(g){
		g.send(null, this._makeMsg('subcmd=6'));
	};
	
	this.sendGet3366EveryDayGift = function(g){
		g.send(null, this._makeMsg('subcmd=7'));
	};
	
	this._makeMsg = function(s) {
		return '{cmd='+NETCMD.BLUEDIAMOND+','+s+'}';
	};
}).snew();

DealGoldSender = Class.extern(function(){
	this.sendResultSucc = function(g){
		g.send(null, this._makeMsg('subcmd=1'));
	};
	
	this.sendResultCancel = function(g){
		g.send(null, this._makeMsg('subcmd=2'));
	};
	
	this._makeMsg = function(s) {
		return '{cmd='+NETCMD.RESULT_BuyByGold+','+s+'}';
	};
}).snew();

ClientCfgSender = Class.extern(function(){
	this.sendSoundFlag = function(g){
		var flag = g.getImgr().isCanPlayBackSound() ? 0 : 1;
		g.send(null, this._makeMsg('subcmd=1,idx=0,flag=' + flag));
	};
	
	this.sendGongGaoVer = function(g){
		g.send(null, this._makeMsg('subcmd=2,ver=' + res_gonggao.ver));
	};
	
	this.sendSetHelpTip = function(g, tipId){
		g.send(null, this._makeMsg('subcmd=3,tipId=' + tipId));
	};
	
	this._makeMsg = function(s) {
		return '{cmd='+NETCMD.CLT_CFG+','+s+'}';
	};
}).snew();

VipSender = Class.extern(function(){
	this._makeMsg = function(s) {
		return '{cmd='+NETCMD.VIP+','+s+'}';
	};
}).snew();

AutoBuildSender = Class.extern(function(){
	this.sendStartBuild = function(g, ids){
		var s = '';
		for ( var i=0; i<ids.length; ++i ) {
			s += ',id' + (i+1) + '=';
			s += ids[i];
		}
		
		s = 'count=' + ids.length + s;
		g.send(null, this._makeMsg('subcmd=1,' + s));
	};
	
	this._makeMsg = function(s) {
		return '{cmd='+NETCMD.AUTOBUILD+','+s+'}';
	};
}).snew();

CDKeySender = Class.extern(function(){
	this.send = function(g, cdkey){
		g.send(null, this._makeMsg('subcmd=1,cdkey="' + cdkey+'"'));
	};
	
	this._makeMsg = function(s) {
		return '{cmd='+NETCMD.CDKEY+','+s+'}';
	};
}).snew();

WorldBossrSender = Class.extern(function(){
	this.sendGetInfo = function(g){
		g.send(null, this._makeMsg('subcmd=1'));
	};
	
	this.sendExped = function(g, expedTarget, expedType, lineup, heroIds){
		var s = 'subcmd=2';
		s += MilitarySender.makeExpedStr(expedTarget, expedType, lineup, heroIds);
		g.send(null, this._makeMsg(s) );
	};
	
	this.sendGetTodayGift = function(g){
		g.send(null, this._makeMsg('subcmd=3'));
	};
	
	this.sendGuwu = function(g, guwuType, times){
		g.send(null, this._makeMsg('subcmd=4,t=' + guwuType + ',times=' + times));
	};
	
	this.sendGetPersonRankGift = function(g){
		g.send(null, this._makeMsg('subcmd=5'));
	};
	
	this.sendGetCountryRankGift = function(g){
		g.send(null, this._makeMsg('subcmd=6'));
	};
	
	this.sendGetRankInfo = function(g){
		g.send(null, this._makeMsg('subcmd=7'));
	};
	
	this.sendGetAlliGiftInfo = function(g){
		g.send(null, this._makeMsg('subcmd=8'));
	};
	
	this._makeMsg = function(s) {
		return '{cmd='+NETCMD.WORLDBOSS+','+s+'}';
	};
}).snew();

RewardSender = JClass.ex({
	sendFirstHero : function(g, nameIdx){
		g.send(null, this._makeMsg('subcmd=1,nameIdx=' + nameIdx));
	}
	
	,_makeMsg : function(s) {
		return '{cmd='+NETCMD.SEND_REWARD+','+s+'}';
	}
}).snew();

