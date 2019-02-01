try{
	require('../handler/tqAlliance.js');
} catch(e) {
};

ItemMgrEx = function(){
	var m_g;
	var m_this;
	var m_scalePrecisionAttrs = [ATTR.HEALTH, ATTR.MO];
	var m_role = {id:0,uid:-1,name:'--', state:0, cityid:9900001, allipos:ALLI_POS.NONE, level:0, prestige:0, alliproffer:0,pos:{x:0,y:0},attrs:{},skeleton:{level:0},alliance:{uid:0,name:'--'},introduction:'', gm:0, svrOpenTime:0, firstLoginTime:0, actTower:0, actTerrace:0,cityMaxLevel:0,ydInfo:{},bdInfo:{},vip:0,userId:0,cltKey:''};
	var m_heros = {list:[],canusesstime:0};
	var m_packages = {items:[],misc:{giftgold:0,gold:0,maxgrids:0}};
	var m_fightdemos = [];
	var m_armys = {
		list:[]
		,samealli:[]
		};
	var m_builds = {// state:0 -- 已建好的，state:1 -- 在升级的，state:2 -- 在拆除的
		cityBuilds:{'1':[], '2':[], '3':[], '4':[], '5':[]}
		,abuild:[]//联盟建筑
	};
	var m_soldiers = {
		list:[]
	};
	var m_fightres = {fround:{},list:[]};
	var m_cultures = {
		list:[]
		,learning:{id:0,isCulture:true,state:0,level:0,stoptime:0}
	};
	var m_citydefs = {
		defs:[0,0,0,0,0]
		,building:{id:0,isCityDef:true, state:0, level:'--',stoptime:0,number:0} // need init itemres
		,defarmy:{heros:[0,0,0,0,0],lineupId:180001}
	};
	var m_tower = {
		lineupId:180004
		,soldiers:[{resid:0,number:0},{resid:0,number:0},{resid:0,number:0},{resid:0,number:0},{resid:0,number:0}]
	};
	var m_weaponrys = {
		making:[
		{id:1,resid:0,number:100,stoptime:1287291460+300000,itemres:{smallpic:1001,name:'we1'}},
		{id:2,resid:0,number:200,stoptime:1287291460+300000,itemres:{smallpic:1001,name:'we2'}},
		{id:3,resid:0,number:300,stoptime:1287291460+300000,itemres:{smallpic:1001,name:'we3'}}
		]
	};
	var m_taskres = [];
	var m_letterres = {all:[],un:[],sys:[],com:[]};
	var m_friends = {
		friends:[]
		,enemys:[]
		,groups:[]
		,applys:[]
	};
	var m_teams = {
		list:[]
	};
	var m_farm = {
		ver:-1,role:{uid:-1,name:'',citylevel:-1},blocks:[]
	};
	var m_itembuffs = {list:[]};
	var m_ranking = { roles:{cnt:1,list:[]}, allis:{cnt:1,list:[]} };
	var m_myAlliance = null;
	var m_cityres = {
		money:{cur:0,max:0,output:1}
		,buildval:{level:0,cur:0,max:0,hurt:10}
		,cres:{food:0,wood:0,stone:0,iron:0,max:0}
		,popu:{idle:0,work:0,max:0}
	};
	var m_battle = {
		todaytimes:{taofa:0,cuihui:0,tiaoxin:0,fightowner:0}
		,defaultteams:[{id:1,heros:[]},{id:2,heros:[]},{id:3,heros:[]}]
	};
	var m_wears = { dict:{} };
	var m_myfields=[];
	var m_succcopyfields = {taofa:[]};//挑战成功的副本列表
	var m_targetsfavorite=[];//目标城池收藏夹
	var m_lineups = [180001];
	var m_selfFields = {list:[]};
	var m_cityTypes = [1];
	var m_salveInfo = {max:0};
	var m_exchangeExp = {todaytimes:{cur:0,max:0}};
	var m_fightRefStates = [];
	var m_roleStates = [];
	var m_detailField = null;
	var m_actTower = {
		baseInfo:{today:{maxTimes:0, freeTimes:0, itemTimes:0}, maxLayer:0}
	};
	var m_actTerrace = {
		baseInfo:{ today:{maxTimes:0, freeTimes:0, itemTimes:0}, maxGate:{gateId:0, subGateId:0}, curGate:{gateId:0, subGateId:0}  }
		,results:[]
	};
	var m_task = {
		tasks:[]
		,actives:[]
		,growups:[]
		,subGrowups:[]
		,roles:[]
		,everydays:[]
		,activityVals:[]
		,roleTask:{doing:{id:0, stopTime:0}, cdStopTime:0}
		,prestigeTask:{lastTime:0}
	};
	var m_activityVal = {
		val:0
		,gotActRewards:[]
		,signin:{days:0, gotRewards:[], todaySign:0}
		,dayacts:[{day:0, acts:[]}]
		,gotOnlineGoods:0
		,onlineGoodsId:0
	};
	var m_shopsales = [
	];
	var m_onlineTask = {id:0, stopTime:0};
	var m_saveForces = [{type:1, lineup:0, heros:[]},{type:2, lineup:0, heros:[]},{type:3, lineup:0, heros:[]}];
	var m_cltCfg = {
		togglemap:[0,0,0,0]
		,gongGaoVer:0
	};
	var m_payact = {
		payGiftGots:[1,1,1,1,1,1]
		,payActAllGold:0
		,payActTime:{start:0, stop:0}
	};
	var m_autobuild = {
		starting:0
		,max:0
		//,list:[{id:cityId*1000 + buildId}]
		,list:[]
	};
	var m_mapview = {x1:200,y1:200,x2:400,y2:400};
	var m_worldboss = {
		events:[]
		,today:{times:0, maxTimes:3, gotGift:0, gotPRankGift:0, guwu:0, maxGuwu:10}
		,prank:[]
		,arank:[]
		,crankweek:0
		,crank:[]
		,alligifts:[]
	};
	
	var m_sellingItems = [];
	var m_svrcfg = {honorcfg:{taofa:3,cuihui:5,tiaoxin:1,leveldiff:10}};
	var m_isFirstCreate = false; // 是否初次创建游戏
	var m_isNewcomerHelpEnd = false;
	
	//public:method
	this.initialize = function(g){
		m_g = g;
		m_this = this;
		m_myAlliance = Alliance.snew(m_g);
	};
	
	this.getSvrCfg = function(){
		return m_svrcfg;
	};
	
	this.getWorldBoss = function(){
		return m_worldboss;
	};
	
	this.setFirstCreateGame = function(){
		m_isFirstCreate = true;
	};
	
	this.isFirstCreateGame = function(){
		return m_isFirstCreate;
	};
	
	this.getMapView = function(){
		return m_mapview;
	};
	
	this.copySellingItems = function(sellingItems){
		TQ.dictCopy(m_sellingItems, sellingItems);
		ItemResUtil.initItemsres(m_sellingItems);
	};
	
	this.getSellingItems = function(){
		return m_sellingItems;
	};
	
	this.setMapView = function(x1, y1, x2, y2){
		m_mapview.x1 = x1;
		m_mapview.y1 = y1;
		m_mapview.x2 = x2;
		m_mapview.y2 = y2;
	};
	
	this.multHeroSteelBySvrAct = function(){
		var multBySvrAct = 0;
		if ( this.hasServerAct(SVR_TODAY_ACT_TYPE.HERO_STEEL_2) ) {
			multBySvrAct += 2;
		}
		if ( this.hasServerAct(SVR_TODAY_ACT_TYPE.HERO_STEEL_3) ) {
			multBySvrAct += 3;
		}
		return Math.max(1, multBySvrAct );
	};
	
	this.getAutoBuild = function(){
		return m_autobuild;
	};
	
	this.getVipLevel = function(){
		return m_role.vip;
	};
	
	this.get3366GrowLevel = function(){
		var level = this.getRoleRes().bdInfo._3366_grow_level;
		return level ? level : 0;
	};
	
	this.isCanPlayBackSound = function(){
		return m_cltCfg.togglemap[0] == 0;
	};
	
	this.setCanPlayBackSound = function(flag){
		m_cltCfg.togglemap[0] = flag ? 0 : 1;
	};
	
	this.getCltCfg = function(){
		return m_cltCfg;
	};
	
	this.getPayAct = function(){
		return m_payact;
	};
	
	this.getSaveForces = function(){
		return m_saveForces;
	};
	
	this.getSaveForceByType = function(type){
		return TQ.find(m_saveForces, 'type', type);
	};
	
	this.getOnlineTask = function(){
		return m_onlineTask;
	};
	
	this.getShopSales = function(){
		return m_shopsales;
	};
	
	this.collectFreeHeros = function(){
		var includeStates = {};
		includeStates[HERO_STATE.FREE] = true;
		return this.collectHeros(includeStates);
	};
	
	this.collectHeros = function(includeStates, filterStates){
		var heros = [];
		var allheros = this.getHeros().list;
		for ( var i=0; i<allheros.length; ++i ) {
			var hero = allheros[i];
			if ( !includeStates[hero.state] ) continue;
			
			heros.push(hero);
		}
		return heros;				
	};
	
	this.isArrivedMaxRoleLevel = function(){
		return m_role.level >= res_max_role_level;
	};
	
	this.getActivityVal = function(){
		return m_activityVal;
	};
	
	this.getTask = function(){
		return m_task;
	};
	
	this.getTaskById = function(resid){
		return TQ.find(m_task.growups, 'id', resid);
	};
	
	this.getActTower = function(){
		return m_actTower;
	};
	
	this.getActTerrace = function(){
		return m_actTerrace;
	};	
	
	this.getSalveInfo = function(){
		return m_salveInfo;
	};
	
	this.getWears = function(){
		return m_wears;
	};
	
	this.getLineups = function(){
		return m_lineups;
	};
	
	this.getPrestige = function(){
		return m_role.prestige;
	};
	
	this.getSelfFields = function(){
		return m_selfFields;
	};
	
	this.getSelfFieldByGridId = function(gridId){
		return TQ.find(m_selfFields.list, 'id', gridId);
	};
	
	this.getSelfFieldByIdx = function(idx){
		return m_selfFields.list[idx];
	};
	
	this.getFightDemos = function(){
		return m_fightdemos;
	};
	
	this.getLastArmyIdAndFightId = function(){
		if ( m_fightdemos.length == 0 ) return null;
		var lastFd = m_fightdemos[m_fightdemos.length - 1];
		return {armyId:lastFd.id, fightId:lastFd.fightId};
	};
	
	this.getFightDemosByArmyId = function(armyId){
		for ( var k in m_fightdemos ) {
			var fd = m_fightdemos[k];
			if ( fd.id == armyId ) {
				return fd;
			}
		}
		return null;
	};
	
	this.getFightDemoResult = function(armyId, fightId){
		var fd = this.getFightDemosByArmyId(armyId);
		if ( !fd ) {
			return null;
		}
		
		if ( fightId < 0 ) {
			fightId = fd.fightId;
		}
		
		var result = fd.result[fightId - 1];
		return result;
	};
	
	this.getFightDemoActions = function(armyId, fightId){
		var fd = this.getFightDemosByArmyId(armyId);
		if ( !fd ) {
			return null;
		}
		
		if ( fightId < 0 ) {
			fightId = fd.fightId;
		}
		
		var actions = [];
		for ( var i=0, curId=0; i<fd.actions.length; ++i ) {
			var action = fd.actions[i];
			if ( (action.event == 'fightstart') ) {
				curId++;
			}
			
			if ( fightId == curId ) {
				actions.push(action);
			}
		}
		return actions;
	};
	
	this.getFightDemoRounds = function(armyId, fightId){
		var actions = this.getFightDemoActions(armyId, fightId);
		if ( actions == null ) {
			return null;
		}
		
		var fightDemo = { 
			attacker:{role:{},actors:[]}
			,defender:{role:{},actors:[]}
			,defenderParty:''
			,expedType:0
			,myIsAttacker:true 
			,mapId:this.getFightDemosByArmyId(armyId).mapId
			,rounds:[] };
		this._initFightDemoBaseInfo(actions, this.getFightDemoResult(armyId, fightId), fightDemo);
		this._initFightDemoRounds(actions, fightDemo);
		return fightDemo;
	};
	
	this.hasServerAct = function(actType){
		var dayacts = this.getActivityVal().dayacts;
		var todayActs = TQ.find(dayacts, 'day', 0).acts;
		for ( var i=0; i<todayActs.length; ++i ) {
			if (todayActs[i] == actType && this._serverActInTime(actType) ) {
				return true;
			}
		}
		return false;
	};
	
	this._serverActInTime = function(actType) {
		if (actType != SVR_TODAY_ACT_TYPE.HERO_STEEL_2 
			&& actType != SVR_TODAY_ACT_TYPE.HERO_STEEL_3 ) {
			return true;
		}
		
		var d = new Date(m_g.getSvrTimeS()*1000);
		var hour = d.getHours();
		if (hour < 20 || hour >= 23) {
			return false;
		}
		return true;
	};
	
	this._initFightDemoBaseInfo = function(actions, result, fightDemo){
		var action = actions[0];
		if ( !action ) return;
		if ( action.event != 'fightstart' ) return;
		
		fightDemo.attacker = action.attacker;
		fightDemo.defender = action.defender;
		if ( result.attacker ) TQ.dictCopy(fightDemo.attacker.role, result.attacker.role);
		if ( result.defender ) TQ.dictCopy(fightDemo.defender.role, result.defender.role);
		fightDemo.result = result.result;
		fightDemo.defenderParty = result.defenderParty;
		fightDemo.expedType = result.expedType;
		fightDemo.myIsAttacker = ( m_role.name == fightDemo.attacker.role.name );
	};
	
	this._initFightDemoRounds = function(actions, fightDemo){
		ConvertFightRounds.snew().convert(fightDemo.rounds, actions);
	};

	this.getSuccCopyFields = function(){
		return m_succcopyfields;
	};
	
	this.getTargetsFavorite = function(){
		return m_targetsfavorite;
	};
	
	this.getTodayBattleTimes = function(){
		return m_battle.todaytimes;
	};
	
	this.getDefaultTeams = function(){
		return m_battle.defaultteams;
	};
	
	this.getRoleRes = function(){
		return m_role;
	};
	
	this.getRoleId = function(){
		return m_role.uid;
	};
	
	this.getRoleName = function(){
		return m_role.name;
	};
	
	this.getAllianceId = function(){
		return m_role.alliance.uid;
	};
	
	this.getAllianceName = function(){
		return m_role.alliance.name;
	};
	
	this.isSameRole = function(roleName){
		return m_role.name == roleName;
	};
	
	this.isSameAlliance = function(allianceId){
		if (allianceId == 0) return false;
		
		return m_role.alliance.uid == allianceId;
	};
	
	this.isSameAllianceByName = function(name){
		if (m_role.alliance.uid == 0) return false;
		return m_role.alliance.name == name;
	};
	
	this.getRoleLevel = function(){
		return m_role.level;
	};
	
	this.getMyFields = function(){
		return m_myfields;
	};
	
	this.getCityRes = function(){
		return m_cityres;
	};
	
	this.clearPkgItems = function(){
		m_packages.items = [];
	};
	
	this.addItem = function(item){
		m_packages.items.push(item);
	};
	
	/** 获得的钱，我的银两 */
	this.getMoney = function(){
		return m_cityres.money.cur;
	};
	
	/** 设置我的绑定银（银票） */
	this.setMoney = function(money){
		m_cityres.money.cur = money;
	};
	
	this.getMaxMoney = function(){
		return m_cityres.money.max;
	};
	
	this.setMaxMoney = function(max){
		m_cityres.money.max = max;
	};
	
	this.getMoneyOutput = function(){
		return m_cityres.money.output;
	};
	
	/** 获得的金币 */
	this.getGold = function(){
		return m_packages.misc.gold;
	};
	
	this.setGold = function(gold){
		m_packages.misc.gold = gold;
	};
	
	/** 获得私有的金币，我的礼金 */
	this.getGiftGold = function(){
		return m_packages.misc.giftgold;
	};
	
	this.setGiftGold = function(giftgold){
		m_packages.misc.giftgold = giftgold;
	};
	
	/** 获得背包最大的格子数 */
	this.getMaxGrids = function(){
		return m_packages.misc.maxgrids;
	};
	
	/** 获得我所有的金币，包括礼金 */
	this.getAllGold = function(){
		return this.getGold() + this.getGiftGold();
	};
	
	/** 获得城市防御 */
	this.getCityDefs = function(){
		return m_citydefs;
	};
	
	/** 获得哨塔 */
	this.getTower = function(){
		return m_tower;
	};
	
	this.getFightRes = function(){
		return m_fightres;
	};
	
	/** 获得当前英雄列表 */
	this.getHeros = function(){
		return m_heros;
	};
	
	this.setHerosDefaultInfo = function(){
		for ( var i=0; i<m_heros.list.length; ++i ) {
			var hero = m_heros.list[i];
			if ( !hero.skills ) {
				hero.skills = [];
			}
			
			if ( !hero.skeleton ) {
				hero.skeleton = {level:0,stoptime:0};
			}
			
			if ( !hero.official ) {
				hero.official = 0;
			}
			
			if ( !hero.lockstate ) {
				hero.lockstate = 0;
			}
			
			if ( !hero.unlocktime ) {
				hero.unlocktime = 0;
			}
			
			if ( !hero.subjects ) {
				hero.subjects = [0,0,0,0,0];
			}
			
			if ( !hero.attrs ) {
				hero.attrs = {};
			}
			
			if ( !hero.skillsteel ) {
				hero.skillsteel = {id:0, stoptime:0};
			}
			
			if ( !hero.curtskill ) {
				hero.curtskill = 0;
			}
		}
	};
	
	this.isDetailHero = function(hero){
		return (hero.isDetail == 1);
	};
	
	this.getHerosCount = function(){
		return m_heros.list.length;
	};
	
	this.clearHeros = function(){
		m_heros.list = [];
	};
	
	/** 获得指定英雄 */
	this.getHero = function(id){
		return TQ.find(m_heros.list, 'id', id);
	};
	
	/** 获得玩家背包 */
	this.getPkgs = function(){
		return m_packages;
	};
	
	/** 通过resid获得道具对象 */
	this.getItemByResId = function(resid){
		return TQ.find(m_packages.items,'resid',resid);
	};
	
	this.getItemById = function(id){
		return TQ.find(m_packages.items, 'id', id);
	};
	
	/** 通过resid获得道具个数 */
	this.getItemNumByFixResId = function(resid){
		var number = 0;
		for ( var i=0; i<m_packages.items.length; ++i ){
			var item = m_packages.items[i];
			if ( item.resid == resid ) {
				number += item.number;
			}
		}
		return number;
	};
	
	/** 通过resid获得道具个数, 包括绑定和未绑定的 */
	this.getItemNumByResId = function(resid){
		var res = ItemResUtil.findItemres(resid);
		if (res && res.nobindid ) {
			return this.getItemNumByFixResId(resid) + this.getItemNumByFixResId(res.nobindid);
		}
		else if (res && res.bindid ) {
			return this.getItemNumByFixResId(resid) + this.getItemNumByFixResId(res.bindid);
		}
		else {
			return this.getItemNumByFixResId(resid);
		}
	};
	
	this.getItemResByEffect = function(effectId){
		var res = TQ.qfind(res_efftiems_ex, 'id', effectId);
		if (!res) return null;
		
		var itemres = null;
		for (var i=0; i<res.items.length; ++i ) {
			itemres = ItemResUtil.findItemres(res.items[i]);
			if (itemres.isbind == 0) {
				return itemres;
			}
		}
		
		return itemres;
	};
	
	/** 获得军事动态 */
	this.getArmys = function(){
		return m_armys;
	};
	
	/** 获得建筑对象 */
	this.getBuilds = function(){
		return m_builds;
	};
	
	/** 获得指定城或分城的建筑列表 */
	this.getBuildsByCityId = function(cityId){
		return m_builds.cityBuilds[cityId];
	};
	
	/** 获得士兵列表 */
	this.getSoldiers = function(){
		return m_soldiers.list;
	};
	
	this.getSoldierNumber = function(resid){
		var soldier = TQ.find(m_soldiers.list, 'id', resid);
		if ( soldier == null ) return 0;
		return soldier.number;
	};
	
	/** 获得国学列表 */
	this.getCultures = function(){
		return m_cultures.list;
	};
	
	this.getLearningCulture = function(){
		return m_cultures.learning;
	};
	
	this.getCultureLevel = function(id){
		var c = TQ.find(m_cultures.list, 'id', id);
		return c ? c.level : 0;
	};
	
	/** 获得兵器列表 */
	this.getWeaponrys = function(){
		return m_weaponrys;
	};
	
	/** 获得指定状态的英雄 */
	this.getHeroByState = function(state){
		var hero = TQ.find(m_heros.list, 'state', state);
		return hero;
	};
	
	/** 获得当前的任务资源 */
	this.getTaskRes = function(){
		return m_taskres;
	};
	
	/** 获得当前的信件资源 */
	this.getLetterRes = function(){
		return m_letterres;
	};
	
	/** 获得好友资源 */
	this.getFriends = function(){
		return m_friends;
	};
	
	this.hasFriend = function(roleName){
		return TQ.find(m_friends.friends, 'roleName', roleName) != null;
	};
	
	/** 获得敌人列表 */
	this.getEnemys = function(){
		return m_friends.enemys;
	};
	
	/** 获得队友资源 */
	this.getTeams = function(){
		return m_teams;
	};
	
	/** 获取我的农场信息 */
	this.getMyFarm = function(){
		return m_farm;
	};
	
	/** 检查是否是我的hero */
	this.isMyHero = function(uid){
		return this.getHero(uid) != null ;
	};
	
	/** 通过资源id获得建筑对象 */
	this.getBuildByResid = function(cityId, resid){
		var matchBuild = null;
		
		var buildsGroup = this._getBuildsGroup();
		for ( var groupIdx=0; groupIdx<buildsGroup.length; groupIdx++ ){
			var builds = buildsGroup[groupIdx];
			for ( var buildIdx=0; buildIdx<builds.length; buildIdx++ ){
				var build = builds[buildIdx];
				if ( (cityId != BUILDCITY_ID.ALL) && (build.cityId != cityId) ) continue;
				if ( build.resid != resid ) continue;
				if ( matchBuild && matchBuild.level >= build.level ) continue;
				
				matchBuild = build;
			}
		}

		return matchBuild;
	};
	
	this.getBuildsByResid = function(cityId, resid){
		var matchBuilds = [];
		
		var buildsGroup = this._getBuildsGroup();
		for ( var groupIdx=0; groupIdx<buildsGroup.length; groupIdx++ ){
			var builds = buildsGroup[groupIdx];
			for ( var buildIdx=0; buildIdx<builds.length; buildIdx++ ){
				var build = builds[buildIdx];
				if ( (cityId != BUILDCITY_ID.ALL) && (build.cityId != cityId) ) continue;
				if ( build.resid != resid ) continue;
				
				matchBuilds.push(build);
			}
		}
		
		return matchBuilds;
	};
	
	this.getBuildCntByResid = function(cityId, resid){
		var builds = this.getBuildsByResid(cityId, resid);
		return builds.length;
	};
	
	this.getBuildLevelByResId = function(cityId, resid){
		var build = this.getBuildByResid(cityId, resid);
		if ( !build ) {
			return 0;
		}
		
		return build.level;
	};
	
	this._getBuildsGroup = function(){
		return [m_builds.cityBuilds[1]
			,m_builds.cityBuilds[2]
			,m_builds.cityBuilds[3]
			,m_builds.cityBuilds[4]
			,m_builds.cityBuilds[5]
			,m_builds.abuild];
	};
	
	this.getCityBuildsGroup = function(){
		return [m_builds.cityBuilds[1]
			,m_builds.cityBuilds[2]
			,m_builds.cityBuilds[3]
			,m_builds.cityBuilds[4]
			,m_builds.cityBuilds[5] ];
	};
	
	this.getAllBuildsGroup = function(){
		var learningCultures = [];
		learningCultures.push(m_cultures.learning);
		
		var buildingCityDefs = [];
		buildingCityDefs.push(m_citydefs.building);
		
		return [m_builds.cityBuilds[1]
			,m_builds.cityBuilds[2]
			,m_builds.cityBuilds[3]
			,m_builds.cityBuilds[4]
			,m_builds.cityBuilds[5] 
			,m_builds.abuild
			,learningCultures
			,buildingCityDefs
		];
	};
	
	this.getTypeInAllBuildsGroup = function(groupIdx){
		if (groupIdx >=0 && groupIdx <= 4 ) {
			return ALLBUILDSGROUP_TYPE.CITY;
		}
		else if ( groupIdx == 5 ) {
			return ALLBUILDSGROUP_TYPE.ALLI;
		}
		else if ( groupIdx == 6 ) {
			return ALLBUILDSGROUP_TYPE.CULTURE;
		}
		else if ( groupIdx == 7 ) {
			return ALLBUILDSGROUP_TYPE.CITYDEF;
		}
		else {
			return ALLBUILDSGROUP_TYPE.NONE;
		}
	};
	
	this.getItemBuffs = function(){
		return m_itembuffs;
	};
	
	this.getRanking = function(){
		return m_ranking;
	};
	
	this.getMyAlliance = function(){
		return m_myAlliance;
	};
	
	this.isInAlliance = function(){
		return ( m_role.alliance.uid > 0 );
	};
	
	this.setAllianceId = function(id){
		m_role.alliance.uid = id;
	};
	
	this.addRoleAttr = function(attrres){
		m_role.attrs[attrres.id] = {val:attrres.val};
	};
	
	this.getRoleAttr = function(attr){
		return m_role.attrs[attr] ? m_role.attrs[attr] : null;
	};
	
	this.getRoleAttrVal = function(attrid){
		var attr = this.getRoleAttr(attrid);
		return attr ? attr.val : 0;
	};
	
	this.getRoleAttrs = function(){
		return m_role.attrs;
	};
	
	this.getRoleInitAttrVal = function(attrid){
		var attr = TQ.find(res_role_initdata.attrs, 'attr', attrid);
		return attr ? attr.val : 0;
	};
	
	this.isNewPlayer = function() {
		return (m_role.state == ROLE_STATE.YOUNG);
	};
	
	this.isRestPlayer = function() {
		return (m_role.state == ROLE_STATE.REST);
	};
	
	this.setHeroAttrVal = function(hero, attrid, val) {
		var attr = this.getHeroAttr(hero, attrid);
		if ( !attr ) return;

		if ( _isScalePrecisionAttr(attrid) ) {
			val = val * ATTR_PRECISION;
		}
		attr.val = val;
	};
	
	this.getHeroAttrVal = function(hero, attrid) {
		var attr = this.getHeroAttr(hero, attrid);
		if ( !attr ) return 0;
		
		var val = attr.val;
		if ( _isScalePrecisionAttr(attrid) ) {
			val = parseInt(val/ATTR_PRECISION, 10);
		}
		return val;
	};
	
	this.getHeroAttr = function(hero, attrid) {
		if ( !hero ) {
			return null;
		}
		
		if ( !hero.attrs ) {
			HeroSender.sendGetDetail(m_g, hero.id);
			return null;
		}
		return hero.attrs[attrid];
	};
	
	this.getHeroByIdx = function(idx) {
		return m_heros.list[idx];
	};
	
	this.getHeroIdxFromId = function(id) {
		TQ.find(m_heros.list, 'id', id);
		return TQ.getLastFindIdx();
	};
	
	this.setCityLevel = function(level) {
		m_cityres.buildval.level = level;
	};
	
	this.getCityLevel = function() {
		return m_cityres.buildval.level;
	};
	
	this.getGMFlag = function(){
		return m_role.gm;
	};
	
	this.getFactBuildTime = function(ntime){
		ntime = this.__speedBuildByStateEffect(ntime);
		var culturelevel = this.getCultureLevel(FIXID.BUILDCBUILD);
		var govlevel = this.getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.GOV_BUILD);
		var role_interior = this.getRoleAttrVal(ATTR.IN_B) + this.getRoleAttrVal(ATTR.IN_A);
		var facttime = res_calc_fact_inbuild_time(ntime, culturelevel, govlevel, role_interior);
		return parseInt(facttime, 10);
	};
	
	this.__speedBuildByStateEffect = function(ntime){
		var state = this.getRoleState(RES_EFF.ADD_BUILD_SPEED);
		if ( !state ) return ntime;
		return ntime/(1 + state.val/100);
	};
	
	this.getFactLearnCultureTime = function(ntime){
		var collegeLevel = this.getBuildLevelByResId(BUILDCITY_ID.ALL, FIXID.COLLEGEBUILD);
		var roleBrains = this.getRoleAttrVal(ATTR.BR_B) + this.getRoleAttrVal(ATTR.BR_A);
		var addBuff = 0;
		var state = this.getRoleState(RES_EFF.ADD_CULTURE_SPEED_AND_MONEY_OUTPUT);
		if ( state ) addBuff = state.val/100;
		var facttime = res_calc_fact_learn_culture_time(ntime, collegeLevel, roleBrains, addBuff);
		return Math.floor(facttime);
	};
	
	this.setCurLoadCity = function(cityResId){
		var mpanel = UIM.getPanel('main');
		mpanel.getSelCityTool().setCurLoadCity(cityResId);
		mpanel.getSubCityBtnsBar().setCurSubCityId(BUILDCITY_ID.NONE);
	};
	
	this.getStateCity = function(){
		return m_role.cityid;
	};
	
	this.getFarmRoleAddOutput = function(baseout){
		var role_interior = this.getRoleAttrVal(ATTR.IN_B) + this.getRoleAttrVal(ATTR.IN_A);
		return parseInt((role_interior*res_farm_roleinterior_addper)*baseout, 10);
	};
	
	this.getFarmCultureAddOutput = function(teid, baseout){
		var clevel = this.getCultureLevel(teid);
		return parseInt((clevel*res_farm_culture_addper)*baseout, 10);
	};
	
	this.getFarmBuildAddOutput = function(baseout){
		var wslevel = this.getBuildsSumLevel(FIXID.WORKSHOPBUILD);
		return parseInt((wslevel*res_farm_wsbuild_addper)*baseout, 10);
	};
	
	this.getBuildsSumLevel = function(resid){
		var levelSum = 0;
		var builds = this.getBuildsByResid(BUILDCITY_ID.ALL, resid);
		for ( var i=0; i<builds.length; ++i ) {
			levelSum += builds[i].level;
		}
		return levelSum;
	};
	
	this.getFarmAlliAddOutput = function(baseout){
		return parseInt((m_myAlliance.getLevel()*res_farm_alli_addper)*baseout, 10);
	};
	
	this.getFarmBuffStateAddOutput = function(baseout){
		var state = this.getRoleState(RES_EFF.ADD_COMMRES_OUTPUT);
		if ( !state ) return 0;
		return Math.floor(baseout*state.val/100);
	};
	
	this.getFarmVipAddOutput = function(baseout){
		var per = this.getVipEffectVal(VIP_EFF.ADD_COMMRES_OUTPUT);
		return Math.floor(baseout*per/100);
	};
	
	this.hasVipEffectMinLevel = function(effectId){
		var res = TQ.find(res_vip, 'effid', effectId);
		for ( var level=0; level<res.effs.length; ++level ) {
			if ( res.effs[level] > 0 ) return level;
		}
		return 0;
	};
	
	this.getVipEffectVal = function(effectId){
		var res = TQ.find(res_vip, 'effid', effectId);
		return res.effs[this.getVipLevel()];
	};
	
	this.hasVipEffect = function(effectId){
		return this.getVipEffectVal(effectId) > 0;
	};
	
	this.setIdlePopu = function(idle){
		m_cityres.popu.idle = idle;
	};
	
	this.getIdlePopu = function(){
		return m_cityres.popu.idle;
	};
	
	this.setMaxPopu = function(max){
		m_cityres.popu.max = max;
	};
	
	this.getMaxPopu = function(){
		return m_cityres.popu.max;
	};
	
	this.setWorkPopu = function(work){
		m_cityres.popu.work = work;
	};
	
	this.getWorkPopu = function() {
		return m_cityres.popu.work;
	};
	
	this.getCanUseSkillSteelTime = function() {
		return m_heros.canusesstime;
	};
	
	this.setCanUseSkillSteelTime = function(sstime) {
		m_heros.canusesstime = sstime;
	};
	
	this.getHeroSkillById = function(hero, skillid) {
		if ( !hero.skills ) return null;
		return TQ.find(hero.skills, 'id', skillid);
	};
	
	this.getCultureById = function(cid){
		var culture = TQ.find(m_cultures.list, 'id', cid);
		if ( !culture ) culture = {id:cid, level:0};
		return culture;
	};
	
	this.getTacticSkillByIdx = function(hero, idx) {
		var tids = [6001001,6001002];
		return _getFixIdsSkillByIdx(hero, tids, idx);
	};
	
	this.getSpecSkillByIdx = function(hero, idx) {
		var sids = [6001003,6001004,6001005,6001006,6001007];
		return _getFixIdsSkillByIdx(hero, sids, idx);
	};
	
	this.getTrainCultureByIdx = function(idx) {
		var cids = [120006,120011,120016,120021,120026];
		var cid = cids[idx];
		if ( !cid ) return {id:0, level:0};
		
		var culture = m_this.getCultureById(cid);
		if ( culture ) return culture;
		
		return {id:cid, level:0};
	};
	
	this.isSelfArmy = function(armyId){
		var army = TQ.find(m_armys.list, 'id', armyId);
		if (!army) return false;
		return army.armyType == ARMY_TYPE.SELF;
	};
	
	this.isEnemyArmy = function(armyId){
		var army = TQ.find(m_armys.list, 'id', armyId);
		if (!army) return false;
		return army.armyType == ARMY_TYPE.ENEMY;
	};
	
	this.isAlliArmy = function(armyId){
		var army = TQ.find(m_armys.list, 'id', armyId);
		if (!army) return false;
		return army.armyType == ARMY_TYPE.ALLI;
	};
	
	this.getCityTypes = function(){
		return m_cityTypes;
	};
	
	this.getCityTypeByCityId = function(cityId){
		var cityIdx = cityId - 1;
		var type = m_cityTypes[cityIdx];
		if ( !type ) {
			return CITY_TYPE.NONE;
		}
		
		return type;
	};
	
	this.isMaxHeroLevel = function(hero){
		return hero.level == this.getMaxHeroLevel(hero);
	};
	
	this.isMaxMaxHeroLevel = function(hero){
		return hero.level == res_max_hero_level;
	};
	
	this.getMaxHeroLevel = function(hero){
		var sLevel = hero.skeleton.level;
		if (sLevel == 0) {
			return res_base_max_hero_level;
		} else {
			return res_herojingmai[sLevel-1].maxLevel;
		}
	};
	
	this.getCityResValByIdx = function(idx){
		var tags = ['food', 'wood', 'stone', 'iron'];
		return m_cityres.cres[ tags[idx] ];
	};
	
	this.getCityResResIdByIdx = function(idx){
		var resids = [FIXID.FOOD, FIXID.WOOD, FIXID.STONE, FIXID.IRON];
		return resids[idx];
	};
	
	this.getExchangeExp = function(){
		return m_exchangeExp;
	};
	
	this.getFightRefStates = function(){
		return m_fightRefStates;
	};
	
	this.getFightRefState = function(roleId){
		var node = TQ.find(m_fightRefStates, 'id', roleId);
		if (!node) return REF_ROLESTATE.NORMAL;
		
		return node.state;
	};
	
	this.getFightRefStateStopTime = function(roleId){
		var node = TQ.find(m_fightRefStates, 'id', roleId);
		if (!node) return 0;
		
		return node.stoptime;	
	};
	
	this.getRoleStates = function(){
		return m_roleStates;
	};
	
	this.getRoleState = function(stateId){
		return TQ.find(m_roleStates, 'id', stateId);
	};
	
	this.hasRoleState = function(stateId){
		return this.getRoleState(stateId) != null;
	};
	
	this.setCurDetailField = function(detailField){
		if (detailField == null ) {
			m_detailField = null;
		}
		else {
			m_detailField = {};
			TQ.dictCopy(m_detailField, detailField);
		}
	};
	
	this.getCurDetailField = function(){
		return m_detailField;
	};
	
	this.isNewcomerHelpEnd = function(){
		return m_isNewcomerHelpEnd;
	};
	
	this.setNewcomerHelpEnd = function(){
		m_isNewcomerHelpEnd = true;
	};
	
	var _getFixIdsSkillByIdx = function(hero, ids, idx) {
		var skillid = ids[idx];
		if ( !skillid ) return null;
		
		var skill = m_this.getHeroSkillById(hero, skillid);
		if ( skill ) return skill;
		
		return {id:skillid,level:0};
	};

	var _isScalePrecisionAttr = function(attrid) {
		return TQ.find(m_scalePrecisionAttrs, null, attrid) != null;
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);	
};


