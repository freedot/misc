requireEx('./handler/tqTooltipMgr.js', [
	{
		start:'//SkillTooltip-unittest-start'
		,end:'//SkillTooltip-unittest-end'
		,items:['_getSkillName', '_getSkillFiveElem', '_getSkillDescInfo', '_getSkillDex', '_getNextSkillDesc', '_getOpTip', '_getDescByLevel', '_getFinalSkillLevel' ]
	}
	,{
		start:'//CommAttrsTipGetter-unittest-start'
		,end:'//CommAttrsTipGetter-unittest-end'
		,items:['_getLabel'
		,'_getArmAttr'
		]
	}
	,{
		start:'//HeroTooltip-unittest-start'
		,end:'//HeroTooltip-unittest-end'
		,items:['_getNewHeroNatureFactorDesc'
		]
	}
	,{
		start:'//BuildTooltip-unittest-start'
		,end:'//BuildTooltip-unittest-end'
		,items:[
			'_replaceBuildDesc'
			,'_getDownBuildTip'
			,'_getItemTipDesc'
		]
	}
	,{
		start:'//ItemTooltip-unittest-start'
		,end:'//ItemTooltip-unittest-end'
		,items:['_getItemName'
		,'C_SMALLSPLITLINE'
		,'_getForceLevelStar'
		,'_getItemDescInfo'
		,'_getItemBindInfo'
		,'_getArmNeedLevel'
		,'_getArmBaseAttrs'
		,'_getArmSpeedAttr'
		,'_getArmSecondAttrs'
		,'_getArmSkillLevelAttrs'
		,'_getBesetGemsNumber'
		,'_getGemsList'
		,'_getSalePrice'
		,'m_who'
		]
	}
]);

TestCaseTooltipMgr = TestCase.extern(function(){
	this.setUp = function(){
		this.bak_inbuild = res_inbuild;
		res_inbuild=[{'stone':25,'conds':[{'id':0,'level':0},{'id':20011,'level':0}],'money':0,'popunum':0,'storenum':1000,'food':0,'wood':15,'iron':10,'ntime':120,'id':110001001},
			{'stone':25,'conds':[{'id':0,'level':0},{'id':20011,'level':1}],'items':[{id:3000025, num:10}],'money':0,'popunum':0,'storenum':1000,'food':0,'wood':15,'iron':10,'ntime':120,'id':110001002}];
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
		res_inbuild = this.bak_inbuild;
	};
		
	this.testBuildTooltip = function(){
		var resid = 110001;
		var build = {resid:resid,level:1,itemres:ItemResUtil.findItemres(resid)};
		var rtip = TIPM.getBuildDesc(1, 'up', build);
		assertNoInclude(rtip, 'undefined');
		
		rtip = TIPM.getBuildDesc(1, 'down', build);
		assertNoInclude(rtip, 'undefined');
		
		rtip = TIPM.getBuildDesc(1, 'build', build);
		assertNoInclude(rtip, 'undefined');
		
		rtip = TIPM.getSimpleBuildUpTip(1, build);
		assertNoInclude(rtip, 'undefined');
	};
	
	this.testFarmPipTooltip = function(){
		var resid = FIXID.PIPSTART;
		var pip = {resid:resid,itemres:ItemResUtil.findItemres(resid)};
		var rtip = TIPM.getFarmPipDesc(pip);
		assertNoInclude(rtip, 'undefined');
	};
	
	this.testPopuTooltip = function(){
		var ptip = TIPM.getPopuDesc();
		assertNoInclude(ptip, 'undefined');
		assertNoInclude(ptip, 'NaN');
	};
	
	this.testMoneyTooltip = function(){
		var mtip = TIPM.getMoneyDesc();
		assertNoInclude(mtip, 'undefined');
		assertNoInclude(mtip, 'NaN');
		
		g_app.getImgr().setMoney(100);
		g_app.getImgr().setMaxMoney(100);
		mtip = TIPM.getMoneyDesc();
		assertNoInclude(mtip, 'undefined');
		assertNoInclude(mtip, 'NaN');
		
		g_app.getImgr().setMoney(200);
		g_app.getImgr().setMaxMoney(100);
		mtip = TIPM.getMoneyDesc();
		assertNoInclude(mtip, 'undefined');
		assertNoInclude(mtip, 'NaN');
	};
});

TestCaseCommAttrsTipGetter = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.lc = CommAttrsTipGetter.lc;
	};
	
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getArmAttrs = function(){
		var item = {id:2500001};
		assert ( CommAttrsTipGetter.get(item) == '' );
		
		var attrIds = [{base:ATTR.PH_B,append:ATTR.PH_A}
			,{base:ATTR.ST_B,append:ATTR.ST_A}
			,{base:ATTR.AG_B,append:ATTR.AG_A}];		
		
		item.attrs = {};
		item.attrs[ATTR.PH_B] = {val:100, u:0};
		assert ( CommAttrsTipGetter.get(item, rstr.itemTip.baseAttrs, attrIds, COLORS.ITEM_TIP_BASEATTR) == 
			rstr.itemTip.baseAttrs[0] + TQ.formatColorStr('100', COLORS.ITEM_TIP_BASEATTR) + C_TIP_NEWLINE );
			
		item.attrs[ATTR.PH_B] = {val:100, u:0};
		item.attrs[ATTR.ST_B] = {val:200, u:0};
		item.attrs[ATTR.AG_B] = {val:300, u:0};
		assert ( CommAttrsTipGetter.get(item, rstr.itemTip.baseAttrs, attrIds, COLORS.ITEM_TIP_BASEATTR) == 
			rstr.itemTip.baseAttrs[0] + TQ.formatColorStr('100', COLORS.ITEM_TIP_BASEATTR) + C_TIP_NEWLINE
			+ rstr.itemTip.baseAttrs[1] + TQ.formatColorStr('200', COLORS.ITEM_TIP_BASEATTR) +  C_TIP_NEWLINE
			+ rstr.itemTip.baseAttrs[2] + TQ.formatColorStr('300', COLORS.ITEM_TIP_BASEATTR) + C_TIP_NEWLINE );
			
		item.attrs[ATTR.PH_A] = {val:10, u:0};
		item.attrs[ATTR.ST_A] = {val:20, u:0};
		item.attrs[ATTR.AG_A] = {val:30, u:0};
		
		assert ( CommAttrsTipGetter.get(item, rstr.itemTip.baseAttrs, attrIds, COLORS.ITEM_TIP_BASEATTR) == 
			rstr.itemTip.baseAttrs[0] + TQ.formatColorStr('100(+10)', COLORS.ITEM_TIP_BASEATTR) + C_TIP_NEWLINE
			+ rstr.itemTip.baseAttrs[1] + TQ.formatColorStr('200(+20)', COLORS.ITEM_TIP_BASEATTR) +  C_TIP_NEWLINE
			+ rstr.itemTip.baseAttrs[2] + TQ.formatColorStr('300(+30)', COLORS.ITEM_TIP_BASEATTR) + C_TIP_NEWLINE );
		
		// per unit
		item.attrs = {};
		item.attrs[ATTR.HU] = {val:10, u:VAL_UNIT.PER};
		attrIds = [{base:ATTR.HU,append:0}];
		
		assert ( CommAttrsTipGetter.get(item, rstr.itemTip.secAttrs, attrIds, COLORS.ITEM_TIP_SECATTR) == 
			rstr.itemTip.secAttrs[0] + TQ.formatColorStr('10%', COLORS.ITEM_TIP_SECATTR) + C_TIP_NEWLINE );
			
		// only append val
		item.attrs = {};
		item.attrs[ATTR.JIN_SKILL_LEVEL] = {val:1, u:VAL_UNIT.VAL};
		attrIds = [{base:0,append:ATTR.JIN_SKILL_LEVEL}];
		
		assert ( CommAttrsTipGetter.get(item, rstr.itemTip.skillLevelAttrs, attrIds, COLORS.ITEM_TIP_SKILLLEVELATTR) == 
			rstr.itemTip.skillLevelAttrs[0] + TQ.formatColorStr('+1', COLORS.ITEM_TIP_SKILLLEVELATTR) + C_TIP_NEWLINE );
	};	
	
	this.test__getLabel = function(){
		res_attrs = [{id:ATTR.LVL, name:'等级'},{id:ATTR.XP}];
		assertEQ ( this.lc()._getLabel(['lbl1','lbl2'], 0, null), 'lbl1' );
		assertEQ ( this.lc()._getLabel(['lbl1','lbl2'], 1, null), 'lbl2' );
		assertEQ ( this.lc()._getLabel(null, 1, ATTR.LVL), '等级：' );
		assertEQ ( this.lc()._getLabel(null, 1, ATTR.NXP), ATTR.NXP );
		assertEQ ( this.lc()._getLabel(null, 1, ATTR.XP), ATTR.XP );
	};
});

TestCaseSkillTooltip = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.skillTooltip = SkillTooltip.snew(this.g);
		res_items_heroskills = [
			{'name':'必杀','progalias':'','fiveelem':FIVEELEM_TYPE.JIN,'effects':[{'pro':'LV+10','u':VAL_UNIT.VAL,'id':RES_EFF.F_BISHA,'val':'5.0'},{'pro':'','unit':'','id':0,'val':''},{'pro':'','unit':'','id':0,'val':''},{'pro':'','unit':'','id':0,'val':''}],'smallpic':6001008,'id':6001008,'desc':'物理攻击时的必杀几率增加{1.pro}%，出现必杀时伤害结果乘以{1.val}.'} ];
	};
	
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.testGetItemDesc = function(){
		var g_hero = {};
		var g_skill = {};
			
		this.mm.mock(ItemResUtil, 'initItemres');
		this.mm.mock(this.skillTooltip.lc(), '_getSkillName', ['name,']);
		this.mm.mock(this.skillTooltip.lc(), '_getSkillFiveElem', ['felem,']);
		this.mm.mock(this.skillTooltip.lc(), '_getSkillDescInfo', ['desc,']);
		this.mm.mock(this.skillTooltip.lc(), '_getSkillDex', ['dex,']);
		this.mm.mock(this.skillTooltip.lc(), '_getNextSkillDesc', ['nextdesc,']);
		this.mm.mock(this.skillTooltip.lc(), '_getOpTip', ['op']);
		
		assert ( this.skillTooltip.getItemDesc(g_hero, g_skill) 
			== '<div class="itemtip">name,felem,desc,dex,nextdesc,op</div>' );
		assertListEQ ( this.mm.params['initItemres'], [g_skill, 'id'] );
		assertListEQ ( this.mm.params['_getSkillName'], [g_hero, g_skill] );
		assertListEQ ( this.mm.params['_getSkillFiveElem'], [g_hero, g_skill] );
		assertListEQ ( this.mm.params['_getSkillDescInfo'], [g_hero, g_skill] );
		assertListEQ ( this.mm.params['_getSkillDex'], [g_skill] );
		assertListEQ ( this.mm.params['_getNextSkillDesc'], [g_hero, g_skill] );
		assertListEQ ( this.mm.params['_getOpTip'], [g_skill] );
	};
	
	this.test__getSkillName = function(){
		var hero = {attrs:{}};
		hero.attrs[ATTR.JIN_SKILL_LEVEL] = {val:2};
		
		var skill = {id:6001008,level:1};
		ItemResUtil.initItemres(skill, 'id');
		
		assert ( this.skillTooltip.lc()._getSkillName(hero, skill) == TQ.formatColorStr('<center><b>必杀</b> 1(<font color="' + COLORS.APPEND_ATTR + '">+2</font>)级</center>', COLORS.SKILL_TIP_NAME) );
		
		hero.attrs[ATTR.JIN_SKILL_LEVEL] = {val:0};
		assert ( this.skillTooltip.lc()._getSkillName(hero, skill) == TQ.formatColorStr('<center><b>必杀</b> 1级</center>', COLORS.SKILL_TIP_NAME) );
	};
	
	this.test__getSkillFiveElem = function(){
		var hero = {attrs:{}};
		var skill = {id:6001008,level:1};
		ItemResUtil.initItemres(skill, 'id');
		assert ( this.skillTooltip.lc()._getSkillFiveElem(hero, skill) == TQ.formatColorStr(rstr.skillTip.fiveElems[FIVEELEM_TYPE.JIN], COLORS.SKILL_TIP_FIVE_ELEM) + C_TIP_NEWLINE );
	};
	
	this.test__getSkillDescInfo = function(){
		var hero = {attrs:{}};
		var skill = {id:6001008,level:1};
		ItemResUtil.initItemres(skill, 'id');
		
		assert ( this.skillTooltip.lc()._getSkillDescInfo(hero, skill) == TQ.formatColorStr('物理攻击时的必杀几率增加11%，出现必杀时伤害结果乘以5.', COLORS.SKILL_TIP_DESC) + C_TIP_NEWLINE);
		
		hero.attrs[ATTR.JIN_SKILL_LEVEL] = {val:1};
		assert ( this.skillTooltip.lc()._getSkillDescInfo(hero, skill) == TQ.formatColorStr('物理攻击时的必杀几率增加12%，出现必杀时伤害结果乘以5.', COLORS.SKILL_TIP_DESC) + C_TIP_NEWLINE);
	};
	
	this.test__getSkillDex = function(){
		var skill = {id:6001008,level:1,dex:1};
		ItemResUtil.initItemres(skill, 'id');
		var updnextres = TQ.qfind(res_heroskills_upd, 'level', skill.level+1);
		
		assert ( this.skillTooltip.lc()._getSkillDex(skill) == rstr.herodlg.lbl.skilldex + ' ' + skill.dex + '/' + updnextres.needdex + C_TIP_NEWLINE );
		
		skill.level = res_hero_baseskill_maxlevel;
		assert ( this.skillTooltip.lc()._getSkillDex(skill) == '' );
	};
	
	this.test__getNextSkillDesc = function(){
		var hero = {attrs:{}};
		var skill = {id:6001008,level:res_hero_baseskill_maxlevel,dex:1};
		ItemResUtil.initItemres(skill, 'id');
		assert ( this.skillTooltip.lc()._getNextSkillDesc(hero, skill) == '' );
		
		skill.level = 1;
		assert ( this.skillTooltip.lc()._getNextSkillDesc(hero, skill) 
			== TQ.formatColorStr(C_TIP_NEWLINE + rstr.herodlg.lbl.nextskill + C_TIP_NEWLINE 
				+ this.skillTooltip.lc()._getDescByLevel(skill.itemres, 1+1) + C_TIP_NEWLINE,
				COLORS.SKILL_TIP_NEXTLEVEL));
		
		hero.attrs[ATTR.JIN_SKILL_LEVEL] = {val:1};
		assert ( this.skillTooltip.lc()._getNextSkillDesc(hero, skill) 
			== TQ.formatColorStr(C_TIP_NEWLINE + rstr.herodlg.lbl.nextskill + C_TIP_NEWLINE 
				+ this.skillTooltip.lc()._getDescByLevel(skill.itemres, (1+1)+1) + C_TIP_NEWLINE,
				COLORS.SKILL_TIP_NEXTLEVEL));
	};
	
	this.test__getOpTip = function(){
		var skill = {id:6001008,level:res_hero_baseskill_maxlevel,dex:1};
		ItemResUtil.initItemres(skill, 'id');
		
		assert ( this.skillTooltip.lc()._getOpTip(skill) == '' );
		
		skill.level = 1;
		assert ( this.skillTooltip.lc()._getOpTip(skill) == C_TIP_NEWLINE + rstr.herodlg.lbl.steelskilltip );
	};
	
	this.test__getDescByLevel = function(){
		var skill = {id:6001008,level:1};
		ItemResUtil.initItemres(skill, 'id');
		
		assert ( this.skillTooltip.lc()._getDescByLevel(skill.itemres, 1) == '物理攻击时的必杀几率增加11%，出现必杀时伤害结果乘以5.' );
		assert ( this.skillTooltip.lc()._getDescByLevel(skill.itemres, 2) == '物理攻击时的必杀几率增加12%，出现必杀时伤害结果乘以5.' );
	};
	
	this.test__getFinalSkillLevel = function(){
		var hero = {attrs:{}};
		hero.attrs[ATTR.JIN_SKILL_LEVEL] = {val:0};
		
		var skill = {id:6001008,level:1};
		ItemResUtil.initItemres(skill, 'id');
		
		assert ( this.skillTooltip.lc()._getFinalSkillLevel(hero, skill) == 1 );
		
		hero.attrs[ATTR.JIN_SKILL_LEVEL] = {val:1};
		assert ( this.skillTooltip.lc()._getFinalSkillLevel(hero, skill) == 2 );
	};
});

TestCaseHeroTooltip = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.tip = new HeroTooltip(this.g);
		this.lc = this.tip.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getNewHeroNatureFactorDesc = function(){
		this.mm.mock(this.lc(), '_getNewHeroNatureFactorDesc', ['desc']);
		assertEQ ( this.tip.getNewHeroNatureFactorDesc({name:'hero'}), 'desc' );
		assertEQ ( this.mm.params['_getNewHeroNatureFactorDesc'], [{name:'hero'}] );
	};
	
	this.test__getNewHeroNatureFactorDesc = function(){
		var bak = NatureAttrsCommHdr;
		NatureAttrsCommHdr = function(hero, heroattrs, resattrs){
			r_hero = hero;
			r_heroattrs = heroattrs;
			r_resattrs = resattrs;
			return 'desc';
		};
		assertEQ ( this.lc()._getNewHeroNatureFactorDesc(null), '' );
		assertEQ ( this.lc()._getNewHeroNatureFactorDesc({name:'hero', attrs:{name:'attrs'}}), '<div class=itemtip>desc</div>' );
		assertEQ ( r_hero, {name:'hero', attrs:{name:'attrs'}});
		assertEQ ( r_heroattrs, {name:'attrs'});
		assertEQ ( r_resattrs, res_attrs);
		NatureAttrsCommHdr = bak;
	};
});

TestCaseBuildTooltip = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.tip = new BuildTooltip(this.g);
		this.lc = this.tip.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getUpgradeBuildTip = function(){
		var item = {resid:FIXID.ALLIINBUILD, level:2};
		ItemResUtil.initItemres(item, 'resid');
		var nextLevelres = ItemResUtil.findBuildLevelres(item.itemres.id, 2+1);	
		assertEQ ( isInclude(this.lc()._getItemTipDesc('up', item), this.lc()._replaceBuildDesc(item.level+1, nextLevelres, item.itemres.desc) ), true );
	}
	
	this.test__getDownBuildTip = function(){
		var item = {resid:FIXID.ALLIINBUILD, level:2}
		ItemResUtil.initItemres(item, 'resid');
		var preLevelres = ItemResUtil.findBuildLevelres(item.itemres.id, 2-1);	
		assertEQ ( isInclude(this.lc()._getItemTipDesc('down', item), this.lc()._replaceBuildDesc(item.level-1, preLevelres, item.itemres.desc) ), true );
		
		item = {resid:FIXID.ALLIINBUILD, level:1}
		ItemResUtil.initItemres(item, 'resid');
		assertEQ ( isInclude(this.lc()._getItemTipDesc('down', item), rstr.comm.buildWillBeDestroy ), true );
	};
	
	this.test__replaceBuildDesc = function(){
		var level = 3;
		var levelres = {number:10, pos:2};
		var desc = '升级可加固城墙，增大城防空间。{level}级角楼增加城墙耐久eval({level}*5)%，增加城防空间eval({level}*5)%。';
		assertEQ ( this.lc()._replaceBuildDesc(level, levelres, desc), '升级可加固城墙，增大城防空间。3级角楼增加城墙耐久15%，增加城防空间15%。' );
	};
});

TestCaseItemTooltip = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.tip = ItemTooltip.snew(this.g);
		res_items_ex=[
			{'id':2500001,'buyprice':[0,5,5],'level':1,'bigpic':2500001,'effects':[{'max':4,'pro':100,'id':200,'min':4},{'max':3,'pro':100,'id':202,'min':2},{'id':201},{'id':203},{'id':204},{'id':205},{'id':206},{'id':207},{'id':208},{'id':209,'unit':1},{'max':3,'pro':1,'id':210,'unit':1,'min':1},{'id':211,'unit':1},{'id':212,'unit':1},{'id':213,'unit':1},{'id':214,'unit':1}],'targets':[3],'desc':'1级白武器','name':'1级白武器','needlevel':2,'decomposeGet':3000153,'pile':1,'apos':2,'salePrice':500}
			,{'id':4500001,'buyprice':[0,5,0],'bigpic':4500001,'isbind':1,'desc':'增加武将力量18','name':'1级力量原石','targets':[3],'pile':99,'salePrice':500,effects:[{id:RES_EFF.H_ADD_STR,val:18,unit:0}]}
			,{'id':4500016,'buyprice':[0,20,0],'bigpic':4500002,'isbind':1,'desc':'增加武将根骨80','name':'2级根骨原石','targets':[3],'pile':99,'salePrice':2000,effects:[{id:RES_EFF.H_ADD_PHY,val:80,unit:0}]}
			];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.testGetItemDesc = function(){
		this.mm.mock(this.tip.lc(), '_getItemName', ['name']);
		this.mm.mock(this.tip.lc(), '_getForceLevelStar', [',flevel']);
		this.mm.mock(this.tip.lc(), '_getItemDescInfo', [',desc']);
		this.mm.mock(this.tip.lc(), '_getItemBindInfo', [',bind']);
		this.mm.mock(this.tip.lc(), '_getArmNeedLevel', [',needLevel']);
		this.mm.mock(this.tip.lc(), '_getArmBaseAttrs', [',baseAttrs']);
		this.mm.mock(this.tip.lc(), '_getArmSpeedAttr', [',speedAttr']);
		this.mm.mock(this.tip.lc(), '_getArmSecondAttrs', [',secAttrs']);
		this.mm.mock(this.tip.lc(), '_getArmSkillLevelAttrs', [',skillLevelAttrs']);
		this.mm.mock(this.tip.lc(), '_getBesetGemsNumber', [',gemNumber']);
		this.mm.mock(this.tip.lc(), '_getGemsList', [',gemsList']);
		this.mm.mock(this.tip.lc(), '_getSalePrice', [',salePrice']);
		
		assert ( this.tip.getItemDesc(null) == '' );
		assert ( this.tip.getItemDesc({}) == '' );
		
		var item = {id:2500001};
		ItemResUtil.initItemres(item, 'id');
		var sicon = '<div class="itemtipicon item_icon_border_level1" style="BACKGROUND:url(\'' + IMG.makeBigImg(item.itemres.bigpic) + '\') -1px -1px;"></div>'
		assert ( this.tip.getItemDesc(item, null, false) == '<div class=itemtip>' + sicon + 'name,desc,bind,needLevel,baseAttrs,speedAttr,secAttrs,skillLevelAttrs,gemNumber,gemsList,salePrice</div>' );
		assertListEQ ( this.mm.params['_getItemName'], [item] );
		assertListEQ ( this.mm.params['_getItemDescInfo'], [item] );
		assertListEQ ( this.mm.params['_getItemBindInfo'], [item] );
		assertListEQ ( this.mm.params['_getArmNeedLevel'], [item] );
		assertListEQ ( this.mm.params['_getArmBaseAttrs'], [item] );
		assertListEQ ( this.mm.params['_getArmSpeedAttr'], [item] );
		assertListEQ ( this.mm.params['_getArmSecondAttrs'], [item] );
		assertListEQ ( this.mm.params['_getArmSkillLevelAttrs'], [item] );
		assertListEQ ( this.mm.params['_getBesetGemsNumber'], [item] );
		assertListEQ ( this.mm.params['_getGemsList'], [item] );
		assertListEQ ( this.mm.params['_getSalePrice'], [item] );
		
		assert ( this.tip.getItemDesc(item, null, true) == '<div class=wearitemtip>' + sicon + 'name,desc,bind,needLevel,baseAttrs,speedAttr,secAttrs,skillLevelAttrs,gemNumber,gemsList,salePrice</div>' );
		this.mm.mock(TQ, 'isIE6', [true] );
		assert ( this.tip.getItemDesc(item, null, true) == '<div class=wearitemtip_ie6>' + sicon + 'name,desc,bind,needLevel,baseAttrs,speedAttr,secAttrs,skillLevelAttrs,gemNumber,gemsList,salePrice</div>' );
	};
	
	this.test_getItemName = function(){
		var item = {id:2500001};
		ItemResUtil.initItemres(item, 'id');
		
		IS_DEBUG = false;
		assert ( this.tip.lc()._getItemName(item) == '<center><b>' + ItemNameColorGetter.getColorVal(1, '1级白武器') + '</b></center>' + this.tip.lc().C_SMALLSPLITLINE );
		
		item.flevel = 1
		assert ( this.tip.lc()._getItemName(item) == '<center><b>' + ItemNameColorGetter.getColorVal(1, '1级白武器+1') + '</b></center>' + this.tip.lc().C_SMALLSPLITLINE );
		
		IS_DEBUG = true;
		item.flevel = 0
		assert ( this.tip.lc()._getItemName(item) == '<center><b>' + ItemNameColorGetter.getColorVal(1, '1级白武器') + '(2500001)</b></center>' + this.tip.lc().C_SMALLSPLITLINE);
	};
	
	this.test_getForceLevelStar = function(){
		var item = {id:2500001};
		assert ( this.tip.lc()._getForceLevelStar(item) == '' );
		item.flevel = 0;
		assert ( this.tip.lc()._getForceLevelStar(item) == '' );
		item.flevel = 1;
		assert ( this.tip.lc()._getForceLevelStar(item) == TQ.formatColorStr(rstr.itemTip.forceLevel, COLORS.ITEM_TIP_FORCELEVELLBL) + TQ.formatColorStr('★', COLORS.FORCELEVELSTAR) + TQ.formatColorStr('☆☆☆☆☆☆☆☆☆', COLORS.EMPTY_FORCELEVELSTAR) + C_TIP_NEWLINE );
		item.flevel = 2;
		assert ( this.tip.lc()._getForceLevelStar(item) == TQ.formatColorStr(rstr.itemTip.forceLevel, COLORS.ITEM_TIP_FORCELEVELLBL) + TQ.formatColorStr('★★', COLORS.FORCELEVELSTAR) + TQ.formatColorStr('☆☆☆☆☆☆☆☆', COLORS.EMPTY_FORCELEVELSTAR) + C_TIP_NEWLINE );
	};
	
	this.test_getItemDescInfo = function(){
		var item = {id:2500001, appendDesc:'append'};
		ItemResUtil.initItemres(item, 'id');
		
		assert ( this.tip.lc()._getItemDescInfo(item) == TQ.formatColorStr('1级白武器append', COLORS.ITEM_TIP_DESC) + C_TIP_NEWLINE + C_TIP_VSPACE);
		
		item.itemres.desc = '';
		item.appendDesc = '';
		assert ( this.tip.lc()._getItemDescInfo(item) == '' );
	};
	
	this.test_getItemBindInfo = function(){
		var item = {id:2500001};
		ItemResUtil.initItemres(item, 'id');
		
		item.itemres.isbind = null;
		assert ( this.tip.lc()._getItemBindInfo(item) == TQ.formatColorStr(rstr.itemTip.unbind, COLORS.ITEM_TIP_BIND) + C_TIP_NEWLINE);
		item.itemres.isbind = 0;
		assert ( this.tip.lc()._getItemBindInfo(item) == TQ.formatColorStr(rstr.itemTip.unbind, COLORS.ITEM_TIP_BIND) + C_TIP_NEWLINE);
		
		item.itemres.isbind = 1;
		assert ( this.tip.lc()._getItemBindInfo(item) == TQ.formatColorStr(rstr.itemTip.binded, COLORS.ITEM_TIP_BIND) + C_TIP_NEWLINE);
		
		item.itemres.isbind = 0;
		item.isBind = 1;
		assert ( this.tip.lc()._getItemBindInfo(item) == TQ.formatColorStr(rstr.itemTip.binded, COLORS.ITEM_TIP_BIND) + C_TIP_NEWLINE);
		
		this.tip.lc().m_who = 'sys';
		assert ( this.tip.lc()._getItemBindInfo(item) == '');
	};
	
	this.test_getArmNeedLevel = function(){
		var item = {id:2500001};
		ItemResUtil.initItemres(item, 'id');
		
		assert ( this.tip.lc()._getArmNeedLevel(item) == ItemNameColorGetter.getColorVal(1, rstr.itemTip.needLevel + '2') + C_TIP_NEWLINE);
		
		item.itemres.needlevel = 0;
		assert ( this.tip.lc()._getArmNeedLevel(item) == '' );
	};
	
	this.test_getArmBaseAttrs = function(){
		var item = {id:2500001};
		this.mm.mock ( CommAttrsTipGetter, 'get', ['attrs'] );
		
		assertEQ ( this.tip.lc()._getArmBaseAttrs(item), 'attrs' );
		assertEQ ( this.mm.params['get'], [item, rstr.itemTip.baseAttrs
			, [{base:ATTR.ST_B, append:ATTR.ST_A},{base:ATTR.AG_B, append:ATTR.AG_A},{base:ATTR.PH_B, append:ATTR.PH_A},{base:ATTR.CO, append:0}]
			, COLORS.ITEM_TIP_BASEATTR] );
	};
	
	this.test_getArmSpeedAttr = function(){
		var item = {id:2500001};
		this.mm.mock ( CommAttrsTipGetter, 'get', ['attrs'] );
		
		assertEQ ( this.tip.lc()._getArmSpeedAttr(item), 'attrs' );
		assertEQ ( this.mm.params['get'], [item, rstr.itemTip.speedAttrs, [{base:ATTR.SP, append:0}], COLORS.ITEM_TIP_SPEEDATTR ] );
	};
	
	this.test_getArmSecondAttrs = function(){
		var item = {id:2500001};
		this.mm.mock ( CommAttrsTipGetter, 'get', ['attrs'] );
		
		assertEQ ( this.tip.lc()._getArmSecondAttrs(item) , 'attrs' );
		assertEQ ( this.mm.params['get'],  [item, rstr.itemTip.secAttrs
			, [{base:ATTR.HU,append:0},{base:ATTR.DE,append:0},{base: ATTR.HI,append:0},{base:ATTR.ES,append:0},{base:ATTR.MPS,append:0}]
			, COLORS.ITEM_TIP_SECATTR] );
	};
	
	this.test_getArmSkillLevelAttrs = function(){
		var item = {id:2500001};
		this.mm.mock ( CommAttrsTipGetter, 'get', ['attrs'] );
		
		assertEQ ( this.tip.lc()._getArmSkillLevelAttrs(item), 'attrs' );
		assertEQ ( this.mm.params['get'], [item, rstr.itemTip.skillLevelAttrs
			, [
				{append:ATTR.JIN_SKILL_LEVEL, base:0}
				,{append:ATTR.MU_SKILL_LEVEL, base:0}
				,{append:ATTR.SHUI_SKILL_LEVEL, base:0}
				,{append:ATTR.HUO_SKILL_LEVEL, base:0}
				,{append:ATTR.TU_SKILL_LEVEL, base:0}
			], COLORS.ITEM_TIP_SKILLLEVELATTR] );
	};
	
	this.test_getBesetGemsNumber = function(){
		var item = {id:2500001};
		ItemResUtil.initItemres(item, 'id');
		item.itemres.apos = null;
		assert ( this.tip.lc()._getBesetGemsNumber(item) == '' );
		
		item.itemres.apos = 0;
		assert ( this.tip.lc()._getBesetGemsNumber(item) == '' );
		
		item.itemres.apos = HEROARM_POS.HORSE;
		item.gems = [];
		assert ( this.tip.lc()._getBesetGemsNumber(item) == '' );
		
		item.itemres.apos = HEROARM_POS.FIRST-1;
		item.gems = [];
		assert ( this.tip.lc()._getBesetGemsNumber(item) == '' );
		
		item.itemres.apos = HEROARM_POS.LAST6+1;
		item.gems = [];
		assert ( this.tip.lc()._getBesetGemsNumber(item) == '' );
		
		item.itemres.apos = HEROARM_POS.FIRST;
		item.gems = null;
		assert ( this.tip.lc()._getBesetGemsNumber(item) == TQ.formatColorStr( TQ.format(rstr.itemTip.besetGems, '0'),  COLORS.ITEM_TIP_BESETGEMLBL)  + C_TIP_NEWLINE );
		
		item.itemres.apos = HEROARM_POS.FIRST;
		item.gems = [];
		assert ( this.tip.lc()._getBesetGemsNumber(item) == TQ.formatColorStr( TQ.format(rstr.itemTip.besetGems, '0'),  COLORS.ITEM_TIP_BESETGEMLBL)  + C_TIP_NEWLINE );
		
		item.gems = [4500001];
		assert ( this.tip.lc()._getBesetGemsNumber(item) == TQ.formatColorStr( TQ.format(rstr.itemTip.besetGems, '1'),  COLORS.ITEM_TIP_BESETGEMLBL)  + C_TIP_NEWLINE );
	};
	
	this.test_getGemsList = function(){
		var item = {id:2500001};
		assert ( this.tip.lc()._getGemsList(item) == '' );
		
		item.gems = [];
		assert ( this.tip.lc()._getGemsList(item) == '' );
		
		item.gems = [4500001, 4500016];
		assert ( this.tip.lc()._getGemsList(item) == 
			TQ.formatColorStr('1级力量原石', COLORS.ITEM_TIP_BESETGEMNAME) + ' 武将力量 ' + TQ.formatColorStr('+18', COLORS.APPEND_ATTR) + C_TIP_NEWLINE 
			+TQ.formatColorStr('2级根骨原石', COLORS.ITEM_TIP_BESETGEMNAME) + ' 武将根骨 ' + TQ.formatColorStr('+80', COLORS.APPEND_ATTR) + C_TIP_NEWLINE 
			);
	};
	
	this.test_getSalePrice = function(){
		var item = {id:2500001};
		ItemResUtil.initItemres(item, 'id');
		item.itemres.salePrice = null;
		assert ( this.tip.lc()._getSalePrice(item) == '' );
		
		item.itemres.salePrice = 0;
		assert ( this.tip.lc()._getSalePrice(item) == '' );
		
		item.itemres.salePrice = 1000;
		assert ( this.tip.lc()._getSalePrice(item) == TQ.formatColorStr( TQ.format(rstr.itemTip.salePrice, 1000), COLORS.ITEM_TIP_SALELPRICE) + C_TIP_NEWLINE );
		
		this.tip.lc().m_who = 'sys';
		assert ( this.tip.lc()._getSalePrice(item) == '');
	};
});

tqTooltipMgr_t_main = function(suite) {
	suite.addTestCase(TestCaseTooltipMgr, 'TestCaseTooltipMgr');
	suite.addTestCase(TestCaseSkillTooltip, 'TestCaseSkillTooltip');
	suite.addTestCase(TestCaseCommAttrsTipGetter, 'TestCaseCommAttrsTipGetter');
	suite.addTestCase(TestCaseHeroTooltip, 'TestCaseHeroTooltip');
	suite.addTestCase(TestCaseBuildTooltip, 'TestCaseBuildTooltip');
	suite.addTestCase(TestCaseItemTooltip, 'TestCaseItemTooltip');
};