require('./tqItemMgrEx.js');
require('../handler/tqFightResultDlg_data_t.js');

TestCaseItemMgrEx = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.mgr = g_app.getImgr();
	};

	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getFactLearnCultureTime = function(){
		assertEQ ( this.mgr.getFactLearnCultureTime(10000), 10000 );
		this.mgr.getRoleStates().push({uid:1, id:RES_EFF.ADD_CULTURE_SPEED_AND_MONEY_OUTPUT, val:100});
		assertEQ ( this.mgr.getFactLearnCultureTime(10000), 5000 );
	};
	
	this.test_getFactBuildTimeWhenHasStateEffect = function(){
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.GOV_BUILD, level:1}] });
		assertEQ ( this.mgr.getFactBuildTime(10000), 10000 );
		
		this.mgr.getRoleStates().push({uid:1, id:RES_EFF.ADD_BUILD_SPEED, val:100});
		assertEQ ( this.mgr.getFactBuildTime(10000), 5000 );
	};
	
	this.test_getSaveForces = function(){
		assertEQ ( this.mgr.getSaveForces(), [{type:1, lineup:0, heros:[]},{type:2, lineup:0, heros:[]},{type:3, lineup:0, heros:[]}] );
	};
	
	this.test_getSaveForceByType = function(){
		TQ.dictCopy(this.mgr.getSaveForces(), [{_k:'type'},{type:FORCELINE_TYPE.COMM, lineup:180001, heros:[1,2]}] );
		TQ.dictCopy(this.mgr.getSaveForces(), [{_k:'type'},{type:FORCELINE_TYPE.ACTTOWER, lineup:180002, heros:[1,2,3]}] );
		assertEQ ( this.mgr.getSaveForceByType(FORCELINE_TYPE.COMM), {type:FORCELINE_TYPE.COMM, lineup:180001, heros:[1,2]} );
		assertEQ ( this.mgr.getSaveForceByType(FORCELINE_TYPE.ACTTOWER), {type:FORCELINE_TYPE.ACTTOWER, lineup:180002, heros:[1,2,3]} );
	};
	
	this.test_isArrivedMaxRoleLevel = function(){
		this.mgr.getRoleRes().level = 1
		assert ( this.mgr.isArrivedMaxRoleLevel() == false )
		
		this.mgr.getRoleRes().level = res_max_role_level
		assert ( this.mgr.isArrivedMaxRoleLevel() == true )
		
		this.mgr.getRoleRes().level = res_max_role_level + 1
		assert ( this.mgr.isArrivedMaxRoleLevel() == true )
	};
	
	this.test_getSalveInfo = function(){
		assertEQ ( this.mgr.getSalveInfo(), {max:0} );
	};
	
	this.testGetFarmRoleAddOutput = function(){
		var baseout = 10;
		var attrs = this.mgr.getRoleAttrs();
		attrs[ATTR.IN_B] = {val:10};
		attrs[ATTR.IN_A] = {val:10};
		var role_interior =attrs[ATTR.IN_B].val + attrs[ATTR.IN_A].val;
		
		var rt = this.mgr.getFarmRoleAddOutput(baseout);
		var expectrt = parseInt((role_interior*res_farm_roleinterior_addper)*baseout, 10);
		assert( rt == expectrt );
	};
	
	this.testGetFarmSkillAddOutput = function(){
		var baseout = 10;
		var teresid = FIXID.FOODCBUILD;
		var clevel = 1;
		
		var methodMock = MethodMock.snew();
		methodMock.mock(this.mgr, 'getCultureLevel', function(teresid) {return clevel;} );
		var rt = this.mgr.getFarmCultureAddOutput(teresid, baseout);
		methodMock.restore();
		
		var expectrt = parseInt((clevel*res_farm_culture_addper)*baseout, 10);
		assert( rt == expectrt );
	};
	
	this.test_getFarmBuildAddOutput = function(){
		var baseout = 10;
		var wslevel = 1;
		
		this.mm.mock(this.mgr, 'getBuildsSumLevel', [wslevel] );
		var rt = this.mgr.getFarmBuildAddOutput(baseout);
		assertEQ ( this.mm.params['getBuildsSumLevel'], [FIXID.WORKSHOPBUILD] );
		
		var expectrt = parseInt((wslevel*res_farm_wsbuild_addper)*baseout, 10);
		assert( rt == expectrt );
	};
	
	this.test_getBuildsSumLevel = function(){
		TestCaseCondition.setPreCond(null, { builds:[{resid:FIXID.WORKSHOPBUILD, level:1},{resid:FIXID.WORKSHOPBUILD, level:2}] });
		assertEQ ( this.mgr.getBuildsSumLevel(FIXID.WORKSHOPBUILD), 3 )
	};
	
	this.testGetFarmAlliAddOutput = function(){
		var allilevel = 1;
		var baseout = 10;
		
		this.mgr.getMyAlliance().copyDetail({level:allilevel});
		
		var rt = this.mgr.getFarmAlliAddOutput(baseout);
		var expectrt = parseInt((allilevel*res_farm_alli_addper)*baseout, 10);
		assert( rt == expectrt );
	};
	
	this.test_getFarmBuffStateAddOutput = function(){
		assertEQ ( this.mgr.getFarmBuffStateAddOutput(10000), 0 );
		
		this.mgr.getRoleStates().push({uid:1, id:RES_EFF.ADD_COMMRES_OUTPUT, val:50});
		assertEQ ( this.mgr.getFarmBuffStateAddOutput(10000), 5000 );
	};
	
	this.testMaxPopu = function(){
		this.mgr.setMaxPopu(100); 
		assert( this.mgr.getMaxPopu() == 100 );
	}
	
	this.testWorkPopu = function(){
		this.mgr.setWorkPopu(100);
		assert( this.mgr.getWorkPopu() == 100 );
	};
	
	this.testIdlePopu = function(){
		this.mgr.setIdlePopu(10);
		assert( this.mgr.getIdlePopu() == 10 );
	};
	
	this.test_getSelfFields = function(){
		assertEQ ( this.mgr.getSelfFields().list, [] );
	};
	
	this.test_getSelfFieldByGridId = function(){
		this.mgr.getSelfFields().list = [{id:1}];
		assertEQ ( this.mgr.getSelfFieldByGridId(1), {id:1} );
		assertEQ ( this.mgr.getSelfFieldByGridId(0), null );
	};
	
	this.test_getSelfFieldByIdx = function(){
		this.mgr.getSelfFields().list = [{id:1}];
		assertEQ ( this.mgr.getSelfFieldByIdx(1), undefined );
		assertEQ ( this.mgr.getSelfFieldByIdx(0), {id:1} );
	};
	
	this.testGetFightDemosByArmyId = function(){
		this.mgr.getFightDemos().push(fightdemocmd.fightdemo);
		
		var armyId = 3;
		var fd = this.mgr.getFightDemosByArmyId(armyId);
		assert ( fd.fightId == 3 );
		
		var fd = this.mgr.getFightDemosByArmyId(0);
		assert ( fd == null );
	};
	
	this.testGetFightDemoResult = function(){
		this.mgr.getRoleRes().name = 'target_r';
		this.mgr.getFightDemos().push(fightdemocmd.fightdemo);
		
		var armyId = 3;
		var fightId = -1;
		var fdr = this.mgr.getFightDemoResult(armyId, fightId);
		assert ( fdr.defender.heros[0].name == 'hero1' );
		
		this.mgr.getRoleRes().name = '70级黄巾叛军';
		var armyId = 3;
		var fightId = 1;
		var fdr = this.mgr.getFightDemoResult(armyId, fightId);
		assert ( fdr.defender.role.name == 'alliance_r' );
	};
	
	this.testGetFightDemoAction = function(){
		this.mgr.getRoleRes().name = 'target_r';
		this.mgr.getFightDemos().push(fightdemocmd.fightdemo);
		
		var armyId = 3;
		var fightId = -1;
		var fda = this.mgr.getFightDemoActions(armyId, fightId);
		assert ( fda[0].event == 'fightstart' );
		assert ( fda[0].attacker.role.name == '70级黄巾叛军' );
		assert ( fda[0].defender.role.name == 'target_r' );
		
		var armyId = 3;
		var fightId = 1;
		var fda = this.mgr.getFightDemoActions(armyId, fightId);
		assert ( fda[0].event == 'fightstart' );
		assert ( fda[0].attacker.role.name == '70级黄巾叛军' );
		assert ( fda[0].defender.role.name == 'alliance_r' );
	};
	
	this.testGetFightDemoRounds = function(){
		this.mgr.getRoleRes().name = 'target_r';
		this.mgr.getFightDemos().push(fightdemocmd.fightdemo); 	
		
		var armyId = 3;
		var fightId = -1;
		var fightDemo = this.mgr.getFightDemoRounds(armyId, fightId);
		
		assert ( fightDemo.attacker.role.name == '70级黄巾叛军');
		assert ( fightDemo.defender.role.name == 'target_r');
		assert ( fightDemo.defenderParty == 'target_r' );
		assert ( fightDemo.myIsAttacker == false );
		assert ( fightDemo.rounds.length == 29);
		assert ( fightDemo.rounds[0][0].event == 'round' );
		assert ( fightDemo.rounds[0][0].round == 1 );
		assert ( fightDemo.rounds[28][0].event == 'round' );
		assert ( fightDemo.rounds[28][0].round == 29 );
	};
	
	this.test_setHerosDefaultInfo_initSkills = function(){
		this.mgr.getHeros().list.push({id:1});
		this.mgr.setHerosDefaultInfo();
		assert ( this.mgr.getHeroByIdx(0).skills.length == 0 );
		
		this.mgr.getHeroByIdx(0).skills.push({});
		assert ( this.mgr.getHeroByIdx(0).skills.length == 1 );
		this.mgr.setHerosDefaultInfo();
		assert ( this.mgr.getHeroByIdx(0).skills.length == 1 );
	};
	
	this.test_setHerosDefaultInfo_initSkeleton = function(){
		this.mgr.getHeros().list.push({id:1});
		this.mgr.setHerosDefaultInfo();
		assert ( this.mgr.getHeroByIdx(0).skeleton.level == 0 );
		assert ( this.mgr.getHeroByIdx(0).skeleton.stoptime == 0 );
		
		this.mgr.getHeroByIdx(0).skeleton.level = 1;
		this.mgr.getHeroByIdx(0).skeleton.stoptime = 2;
		this.mgr.setHerosDefaultInfo();
		assert ( this.mgr.getHeroByIdx(0).skeleton.level == 1 );
		assert ( this.mgr.getHeroByIdx(0).skeleton.stoptime == 2 );
	};
	
	this.test_setHerosDefaultInfo_initOfficial = function(){
		this.mgr.getHeros().list.push({id:1});
		this.mgr.setHerosDefaultInfo();
		assert ( this.mgr.getHeroByIdx(0).official == 0 );
		
		this.mgr.getHeroByIdx(0).official = 1;
		this.mgr.setHerosDefaultInfo();
		assert ( this.mgr.getHeroByIdx(0).official == 1 );
	};
	
	this.test_setHerosDefaultInfo_initLockstate = function(){
		this.mgr.getHeros().list.push({id:1});
		this.mgr.setHerosDefaultInfo();
		assert ( this.mgr.getHeroByIdx(0).lockstate == 0 );
		
		this.mgr.getHeroByIdx(0).lockstate = 1;
		this.mgr.setHerosDefaultInfo();
		assert ( this.mgr.getHeroByIdx(0).lockstate == 1 );
	};
	
	this.test_setHerosDefaultInfo_initUnlocktime = function(){
		this.mgr.getHeros().list.push({id:1});
		this.mgr.setHerosDefaultInfo();
		assert ( this.mgr.getHeroByIdx(0).unlocktime == 0 );
		
		this.mgr.getHeroByIdx(0).unlocktime = 1;
		this.mgr.setHerosDefaultInfo();
		assert ( this.mgr.getHeroByIdx(0).unlocktime == 1 );
	};
	
	this.test_setHerosDefaultInfo_initSubjects = function(){
		this.mgr.getHeros().list.push({id:1});
		this.mgr.setHerosDefaultInfo();
		assert ( this.mgr.getHeroByIdx(0).subjects[0] == 0 );
		assert ( this.mgr.getHeroByIdx(0).subjects[1] == 0 );
		assert ( this.mgr.getHeroByIdx(0).subjects[2] == 0 );
		assert ( this.mgr.getHeroByIdx(0).subjects[3] == 0 );
		assert ( this.mgr.getHeroByIdx(0).subjects[4] == 0 );
		
		this.mgr.getHeroByIdx(0).subjects = [1,2,3,4,5];
		this.mgr.setHerosDefaultInfo();
		assert ( this.mgr.getHeroByIdx(0).subjects[0] == 1 );
		assert ( this.mgr.getHeroByIdx(0).subjects[1] == 2 );
		assert ( this.mgr.getHeroByIdx(0).subjects[2] == 3 );
		assert ( this.mgr.getHeroByIdx(0).subjects[3] == 4 );
		assert ( this.mgr.getHeroByIdx(0).subjects[4] == 5 );
	};
	
	this.test_setHerosDefaultInfo_initAttrs = function(){
		this.mgr.getHeros().list.push({id:1});
		this.mgr.setHerosDefaultInfo();
		assert ( this.mgr.getHeroByIdx(0).attrs );
		
		this.mgr.getHeroByIdx(0).attrs = {'1':{val:10,u:1}};
		this.mgr.setHerosDefaultInfo();
		assert ( this.mgr.getHeroByIdx(0).attrs[1].val == 10 );
		assert ( this.mgr.getHeroByIdx(0).attrs[1].u == 1 );
	};
	
	this.test_setHerosDefaultInfo_initSkillsteel = function(){
		this.mgr.getHeros().list.push({id:1});
		this.mgr.setHerosDefaultInfo();
		assert ( this.mgr.getHeroByIdx(0).skillsteel.id == 0 );
		assert ( this.mgr.getHeroByIdx(0).skillsteel.stoptime == 0 );
		
		this.mgr.getHeroByIdx(0).skillsteel.id = 1;
		this.mgr.getHeroByIdx(0).skillsteel.stoptime = 2;
		this.mgr.setHerosDefaultInfo();
		assert ( this.mgr.getHeroByIdx(0).skillsteel.id == 1 );
		assert ( this.mgr.getHeroByIdx(0).skillsteel.stoptime == 2 );
	};
	
	this.test_setHerosDefaultInfo_initCurtskill = function(){
		this.mgr.getHeros().list.push({id:1});
		this.mgr.setHerosDefaultInfo();
		assert ( this.mgr.getHeroByIdx(0).curtskill == 0 );
		
		this.mgr.getHeroByIdx(0).curtskill = 1;
		this.mgr.setHerosDefaultInfo();
		assert ( this.mgr.getHeroByIdx(0).curtskill == 1 );
	};
	
	this.test_isDetailHero = function(){
		assert ( this.mgr.isDetailHero({id:1}) == false );
		assert ( this.mgr.isDetailHero({id:1,isDetail:0}) == false );
		assert ( this.mgr.isDetailHero({id:1,isDetail:1}) == true );
	};
	
	this.test_getItemNumByResId = function(){
		res_test_items = [{id:1,bindid:2},{id:2,nobindid:1},{id:3}];
		this.mgr.getPkgs().items = [{resid:1,number:1},{resid:2,number:1},{resid:3,number:1}];
		assert ( this.mgr.getItemNumByResId(1) == 2 );
		assert ( this.mgr.getItemNumByResId(2) == 2 );
		assert ( this.mgr.getItemNumByResId(3) == 1 );
	};
	
	this.test_getItemResByEffect = function(){
		res_test_items = [{id:1, isbind:1},{id:2, isbind:0}];
		res_efftiems_ex = [{id:1,items:[1,2]},{id:2,items:[1]}];
		assert ( this.mgr.getItemResByEffect(0) == null );
		assert ( this.mgr.getItemResByEffect(1).id == 2 );
		assert ( this.mgr.getItemResByEffect(2).id == 1 );
	};
	
	this.test_getEnemys = function(){
		this.mgr.getFriends().enemys = {};
		assert ( this.mgr.getEnemys() == this.mgr.getFriends().enemys );
	};
	
	this.test_getBuildsByCityId = function(){
		assert ( this.mgr.getBuildsByCityId(1) == this.mgr.getBuilds().cityBuilds[1]);
		assert ( this.mgr.getBuildsByCityId(3) == this.mgr.getBuilds().cityBuilds[3]);
		assert ( this.mgr.getBuildsByCityId(5) == this.mgr.getBuilds().cityBuilds[5]);
	};
	
	this.test__getBuildsGroup = function(){
		assertEQ ( this.mgr._getBuildsGroup(), [this.mgr.getBuilds().cityBuilds[1], 
			this.mgr.getBuilds().cityBuilds[2], 
			this.mgr.getBuilds().cityBuilds[3], 
			this.mgr.getBuilds().cityBuilds[4], 
			this.mgr.getBuilds().cityBuilds[5], 
			this.mgr.getBuilds().abuild] ); 
	};
	
	this.test_getCityBuildsGroup = function(){
		assertEQ ( this.mgr.getCityBuildsGroup(), [this.mgr.getBuilds().cityBuilds[1], 
			this.mgr.getBuilds().cityBuilds[2], 
			this.mgr.getBuilds().cityBuilds[3], 
			this.mgr.getBuilds().cityBuilds[4], 
			this.mgr.getBuilds().cityBuilds[5] ] ); 
	};
	
	this.test_getAllBuildsGroup = function(){
		assertEQ ( this.mgr.getAllBuildsGroup(), [this.mgr.getBuilds().cityBuilds[1], 
			this.mgr.getBuilds().cityBuilds[2], 
			this.mgr.getBuilds().cityBuilds[3], 
			this.mgr.getBuilds().cityBuilds[4], 
			this.mgr.getBuilds().cityBuilds[5],
			this.mgr.getBuilds().abuild,
			[this.mgr.getLearningCulture()],
			[this.mgr.getCityDefs().building] 
		] ); 
	};
	
	this.test_getTypeInAllBuildsGroup = function(){
		assertEQ ( this.mgr.getTypeInAllBuildsGroup(0), ALLBUILDSGROUP_TYPE.CITY );
		assertEQ ( this.mgr.getTypeInAllBuildsGroup(4), ALLBUILDSGROUP_TYPE.CITY );
		assertEQ ( this.mgr.getTypeInAllBuildsGroup(5), ALLBUILDSGROUP_TYPE.ALLI );
		assertEQ ( this.mgr.getTypeInAllBuildsGroup(6), ALLBUILDSGROUP_TYPE.CULTURE );
		assertEQ ( this.mgr.getTypeInAllBuildsGroup(7), ALLBUILDSGROUP_TYPE.CITYDEF );
		assertEQ ( this.mgr.getTypeInAllBuildsGroup(8), ALLBUILDSGROUP_TYPE.NONE );
	};
	
	this.test_getBuildByResid = function(){
		var r_buildsGroup = [[{resid:1, level:1, cityId:1}],[{resid:1, level:2, cityId:2}]];
		this.mm.mock(this.mgr, '_getBuildsGroup', [r_buildsGroup] );
		assertEQ ( this.mgr.getBuildByResid(BUILDCITY_ID.ALL, 2), null );
		assertEQ ( this.mgr.getBuildByResid(BUILDCITY_ID.ALL, 1), {resid:1, level:2, cityId:2} );
		assertEQ ( this.mgr.getBuildByResid(1, 1), {resid:1, level:1, cityId:1} );
		assertEQ ( this.mgr.getBuildByResid(2, 1), {resid:1, level:2, cityId:2} );
	};
	
	this.test_getBuildsByResid = function(){
		var r_buildsGroup = [[{resid:1, level:1, cityId:1},{resid:1, level:3, cityId:1}],[{resid:1, level:2, cityId:2},{resid:3, level:2, cityId:2}]];
		this.mm.mock(this.mgr, '_getBuildsGroup', [r_buildsGroup] );
		assertEQ ( this.mgr.getBuildsByResid(BUILDCITY_ID.ALL, 2), [] );
		assertEQ ( this.mgr.getBuildsByResid(BUILDCITY_ID.ALL, 1), [{resid:1, level:1, cityId:1},{resid:1, level:3, cityId:1},{resid:1, level:2, cityId:2}] );
		assertEQ ( this.mgr.getBuildsByResid(1, 1), [{resid:1, level:1, cityId:1},{resid:1, level:3, cityId:1}] );	
		assertEQ ( this.mgr.getBuildsByResid(2, 1), [{resid:1, level:2, cityId:2}] );	
	};
	
	this.test_getBuildCntByResid = function(){
		var r_builds = [{resid:1},{resid:1}];
		this.mm.mock(this.mgr, 'getBuildsByResid', [r_builds] );
		assertEQ ( this.mgr.getBuildCntByResid(BUILDCITY_ID.ALL, 1), 2 );
		assertEQ ( this.mm.params['getBuildsByResid'], [BUILDCITY_ID.ALL, 1] );
	};
	
	this.test_getBuildLevelByResId = function(){
		var r_build = [null];
		this.mm.mock(this.mgr, 'getBuildByResid', r_build );
		assertEQ ( this.mgr.getBuildLevelByResId(BUILDCITY_ID.ALL, 1), 0 );
		assertEQ ( this.mm.params['getBuildByResid'], [BUILDCITY_ID.ALL, 1] );
		
		r_build[0] = {level:10};
		assertEQ ( this.mgr.getBuildLevelByResId(BUILDCITY_ID.ALL, 1), 10 );
	};
	
	this.test_getCityTypes = function(){
		TQ.dictCopy ( this.mgr.getCityTypes(), [1,2,3] );
		assertEQ ( this.mgr.getCityTypes(), [1,2,3] );
		
		TQ.dictCopy ( this.mgr.getCityTypes(), [{"_r":1}] );
		assertEQ ( this.mgr.getCityTypes(), [] );
	};
	
	this.test_getCityTypeByCityId = function(){
		TQ.dictCopy ( this.mgr.getCityTypes(), [1,2,3,2] );
		assertEQ ( this.mgr.getCityTypeByCityId(1), 1 );
		assertEQ ( this.mgr.getCityTypeByCityId(2), 2 );
		assertEQ ( this.mgr.getCityTypeByCityId(3), 3 );
		assertEQ ( this.mgr.getCityTypeByCityId(4), 2 );
	};
	
	this.test_setCurLoadCity = function(){
		this.mm.mock(UIM.getPanel('main').getSelCityTool(), 'setCurLoadCity' );
		this.mm.mock(UIM.getPanel('main').getSubCityBtnsBar(), 'setCurSubCityId' );
		var p_cityResId = 1;
		this.mgr.setCurLoadCity(p_cityResId);
		assertEQ ( this.mm.params['setCurLoadCity'], [p_cityResId] );
		assertEQ ( this.mm.params['setCurSubCityId'], [BUILDCITY_ID.NONE] );
	};
	
	this.test_setGold = function(){
		this.mgr.setGold(1);
		assertEQ ( this.mgr.getGold(), 1 );
	};
	
	this.test_isMaxHeroLevel = function(){
		var p_hero = {level:res_base_max_hero_level-1, skeleton:{level:0}};
		assertEQ ( this.mgr.isMaxHeroLevel(p_hero), false );
		
		p_hero.level = res_base_max_hero_level;
		assertEQ ( this.mgr.isMaxHeroLevel(p_hero), true );
	};
	
	this.test_getMaxHeroLevel = function(){
		var p_hero = {skeleton:{level:0}};
		assertEQ ( this.mgr.getMaxHeroLevel(p_hero), res_base_max_hero_level );
		
		p_hero.skeleton.level = 1;
		assertEQ ( this.mgr.getMaxHeroLevel(p_hero), res_herojingmai[0].maxLevel );
	};
	
	this.test_getTower = function(){
		var p_tower = {lineupId:1	,soldiers:[{resid:0,number:0},{resid:0,number:10},{resid:1,number:3},{resid:0,number:1},{resid:0,number:2}]};
		TQ.dictCopy(this.mgr.getTower(), p_tower);
		assertEQ ( this.mgr.getTower(), p_tower );
	};
	
	this.test_getCityResValByIdx = function(){
		this.mgr.getCityRes().cres.food = 10;
		this.mgr.getCityRes().cres.wood = 20;
		this.mgr.getCityRes().cres.stone = 30;
		this.mgr.getCityRes().cres.iron = 40;
		assertEQ ( this.mgr.getCityResValByIdx(0), 10 );
		assertEQ ( this.mgr.getCityResValByIdx(1), 20 );
		assertEQ ( this.mgr.getCityResValByIdx(2), 30 );
		assertEQ ( this.mgr.getCityResValByIdx(3), 40 );
	};
	
	this.test_getCityResResIdByIdx = function(){
		assertEQ ( this.mgr.getCityResResIdByIdx(0), FIXID.FOOD );
		assertEQ ( this.mgr.getCityResResIdByIdx(1), FIXID.WOOD );
		assertEQ ( this.mgr.getCityResResIdByIdx(2), FIXID.STONE );
		assertEQ ( this.mgr.getCityResResIdByIdx(3), FIXID.IRON );
	};
	
	this.test_getExchangeExp = function(){
		assertEQ ( this.mgr.getExchangeExp(), {todaytimes:{cur:0,max:0}} );
	};
	
	this.test_getFightRefStates = function(){
		assertEQ ( this.mgr.getFightRefStates(), [] );
	};
	
	this.test_getFightRefState = function(){
		var p_roleId = 1;
		assertEQ ( this.mgr.getFightRefState(p_roleId), REF_ROLESTATE.NORMAL);
		
		this.mgr.getFightRefStates().push({id:1, state:REF_ROLESTATE.FIGHTING, stoptime:1});
		assertEQ ( this.mgr.getFightRefState(p_roleId), REF_ROLESTATE.FIGHTING);
	};
	
	this.test_getFightRefStateStopTime = function(){
		var p_roleId = 1;
		assertEQ ( this.mgr.getFightRefStateStopTime(p_roleId), 0);
		this.mgr.getFightRefStates().push({id:1, state:REF_ROLESTATE.FIGHTING, stoptime:10});
		assertEQ ( this.mgr.getFightRefStateStopTime(p_roleId), 10);
	};
	
	this.test_getArmys = function(){
		assertEQ ( this.mgr.getArmys(), {list:[],samealli:[]} );
	};
	
	this.test_isSelfArmy = function(){
		var armyId = 1;
		assertEQ ( this.mgr.isSelfArmy(armyId), false );
		this.mgr.getArmys().list = [{id:1,armyType:ARMY_TYPE.ENEMY}];
		assertEQ ( this.mgr.isSelfArmy(armyId), false );
		this.mgr.getArmys().list = [{id:1,armyType:ARMY_TYPE.SELF}];
		assertEQ ( this.mgr.isSelfArmy(armyId), true );
	};
	
	this.test_isEnemyArmy = function(){
		var armyId = 1;
		assertEQ ( this.mgr.isEnemyArmy(armyId), false );
		this.mgr.getArmys().list = [{id:1,armyType:ARMY_TYPE.SELF}];
		assertEQ ( this.mgr.isEnemyArmy(armyId), false );
		this.mgr.getArmys().list = [{id:1,armyType:ARMY_TYPE.ENEMY}];
		assertEQ ( this.mgr.isEnemyArmy(armyId), true );
	};
	
	this.test_isEnemyArmy = function(){
		var armyId = 1;
		assertEQ ( this.mgr.isEnemyArmy(armyId), false );
		this.mgr.getArmys().list = [{id:1,armyType:ARMY_TYPE.SELF}];
		assertEQ ( this.mgr.isEnemyArmy(armyId), false );
		this.mgr.getArmys().list = [{id:1,armyType:ARMY_TYPE.ENEMY}];
		assertEQ ( this.mgr.isEnemyArmy(armyId), true );
	};
	
	this.test_isAlliArmy = function(){
		var armyId = 1;
		assertEQ ( this.mgr.isAlliArmy(armyId), false );
		this.mgr.getArmys().list = [{id:1,armyType:ARMY_TYPE.ENEMY}];
		assertEQ ( this.mgr.isAlliArmy(armyId), false );
		this.mgr.getArmys().list = [{id:1,armyType:ARMY_TYPE.ALLI}];
		assertEQ ( this.mgr.isAlliArmy(armyId), true );
	};
	
	this.test_getRoleState = function(){
		assertEQ ( this.mgr.getRoleState(1), null );
		this.mgr.getRoleStates().push({id:1, stoptime:10});
		assertEQ ( this.mgr.getRoleState(1), {id:1, stoptime:10} );
	};
	
	this.test_hasRoleState = function(){
		assertEQ ( this.mgr.hasRoleState(1), false );
		this.mgr.getRoleStates().push({id:1, stoptime:10});
		assertEQ ( this.mgr.hasRoleState(1), true );
	};
	
	this.test__initFightDemoBaseInfo = function(){
		var p_actions = [];
		var p_result = {result:2, defenderParty:'defenderParty'};
		var r_fightDemo = {};
		
		this.mgr._initFightDemoBaseInfo(p_actions, p_result, r_fightDemo);
		assertEQ ( r_fightDemo, {} );
		
		p_actions = [{event:'attack'}];
		this.mgr._initFightDemoBaseInfo(p_actions, p_result, r_fightDemo);
		assertEQ ( r_fightDemo, {} );
		
		this.mgr.getRoleRes().name = 'my';
		p_actions = [{event:'fightstart', attacker:{role:{name:'my'}},defender:{role:{name:'you'}}}];
		this.mgr._initFightDemoBaseInfo(p_actions, p_result, r_fightDemo);
		assertEQ ( r_fightDemo, {attacker:{role:{name:'my'}}, defender:{role:{name:'you'}}, result:2, defenderParty:'defenderParty', myIsAttacker:true} );
	};
	
	this.test_setCurDetailField = function(){
		assertEQ ( this.mgr.getCurDetailField(), null );
		this.mgr.setCurDetailField({isDetail:1});
		assertEQ ( this.mgr.getCurDetailField(), {isDetail:1} );
		this.mgr.setCurDetailField(null);
		assertEQ ( this.mgr.getCurDetailField(), null );
	};
	
	this.test_isSameAllianceByName = function(){
		this.mgr.getRoleRes().alliance.uid = 0;
		this.mgr.getRoleRes().alliance.name = '--';
		assertEQ ( this.mgr.isSameAllianceByName('--'), false );
		assertEQ ( this.mgr.isSameAllianceByName('name'), false );
		
		this.mgr.getRoleRes().alliance.uid = 1;
		this.mgr.getRoleRes().alliance.name = 'name';
		assertEQ ( this.mgr.isSameAllianceByName('--'), false );
		assertEQ ( this.mgr.isSameAllianceByName('name'), true );		
	};
	
	this.test_getActivityVal = function(){
		assertEQ ( this.mgr.getActivityVal().val , 0);
	};
	
	this.test_getLastArmyIdAndFightId = function(){
		assertEQ ( this.mgr.getLastArmyIdAndFightId(), null );
		this.mgr.getFightDemos().push(fightdemocmd.fightdemo);
		assertEQ ( this.mgr.getLastArmyIdAndFightId(), {armyId:3, fightId:3} );
	};
	
	this.test_hasFriend = function(){
		this.mgr.getFriends().friends = [{roleName:'role1'}];
		assertEQ ( this.mgr.hasFriend('role1'), true );
		assertEQ ( this.mgr.hasFriend('role2'), false );
	};
	
	this.test_hasServerAct = function(){
		var dayacts = this.mgr.getActivityVal().dayacts;
		var todayActs = TQ.find(dayacts, 'day', 0).acts;
		
		//SVR_TODAY_ACT_TYPE.HERO_STEEL_2
		this.g.setSvrTimeS(1379520000 + 20*3600 - 1);
		assertEQ ( this.mgr.hasServerAct(SVR_TODAY_ACT_TYPE.HERO_STEEL_2), false );
		assertEQ ( this.mgr.hasServerAct(SVR_TODAY_ACT_TYPE.HERO_STEEL_3), false );
		
		todayActs.push(SVR_TODAY_ACT_TYPE.HERO_STEEL_2);
		todayActs.push(SVR_TODAY_ACT_TYPE.HERO_STEEL_3);
		todayActs.push(SVR_TODAY_ACT_TYPE.ACT_TOWER_TIMES_1);
		assertEQ ( this.mgr.hasServerAct(SVR_TODAY_ACT_TYPE.HERO_STEEL_2), false );
		assertEQ ( this.mgr.hasServerAct(SVR_TODAY_ACT_TYPE.HERO_STEEL_3), false );
		assertEQ ( this.mgr.hasServerAct(SVR_TODAY_ACT_TYPE.ACT_TOWER_TIMES_1), true );
		
		this.g.setSvrTimeS(1379520000 + 20*3600);
		assertEQ ( this.mgr.hasServerAct(SVR_TODAY_ACT_TYPE.HERO_STEEL_2), true );
		assertEQ ( this.mgr.hasServerAct(SVR_TODAY_ACT_TYPE.HERO_STEEL_3), true );
		
		this.g.setSvrTimeS(1379520000 + 23*3600 - 1);
		assertEQ ( this.mgr.hasServerAct(SVR_TODAY_ACT_TYPE.HERO_STEEL_2), true );
		assertEQ ( this.mgr.hasServerAct(SVR_TODAY_ACT_TYPE.HERO_STEEL_3), true );
		
		this.g.setSvrTimeS(1379520000 + 23*3600);
		assertEQ ( this.mgr.hasServerAct(SVR_TODAY_ACT_TYPE.HERO_STEEL_2), false );
		assertEQ ( this.mgr.hasServerAct(SVR_TODAY_ACT_TYPE.HERO_STEEL_3), false );
	};
});


tqItemMgrEx_t_main = function(suite) {
	suite.addTestCase(TestCaseItemMgrEx, 'TestCaseItemMgrEx');
};