/*******************************************************************************/
HelpGuider.HELP_TIP = {
	CHANGE_CITY : 1
	,ASSIGN_ROLEPP : 2
	,FIGHT_OUTFIELD : 3
	,ACTTOWER_FIGHT : 4
	,OPEN_SHOPDLG : 5
	,OPEN_RANKDLG : 6
	,OPEN_LETTERDLG : 7
	,OPEN_EXCHANGEDLG : 8
	,OPEN_VIPDLG : 9
	,OPEN_PAYDLG : 10
	,OPEN_MYFIELD : 11
};
			

HelpGuider.opbitmaps_ = {};
HelpGuider.curHelpTipId_ = 0;
HelpGuider.buildOpMenu = {itemId:'', buildId:0, buildState:-1};
HelpGuider.isUsePaiChengKa = false;

HelpGuider.SpiritUtil = Class.extern(function(){
	this.startSpirit = function(parent, target, res){
		if (!parent || !target) return;
		var ops = {parent:parent, text:res.spiritCon, blinktime:0xffffffff, arrawdir:res.spiritArrawDir
			,binfo:{dom:target, x:-8, y:-8, w:res.spiritTargetW, h:res.spiritTargetH, offsetx:res.spiritTargetOffX, offsety:res.spiritTargetOffY, isShow: (res.spiritTargetShow == 1)}};
		if (res.shape) ops.shape = res.shape;
		if (res.spiritSelectType == 0) {
			HelpGuider.spirit(ops);
		} else if (res.spiritSelectType == 99) {
			HelpGuider.spiritTip(ops);
		} else {
			ops.x = -10;
			ops.y = -6;
			HelpGuider.spiritRhombus(ops);
		}
	};
	
	this.getCurRes = function(g){
		var id = UIM.getDlg('newcomerhelper').getCurId();
		var res = ItemResUtil.findTaskRes(id);
		if ( res ) return res;
		
		res = this._getResFromRoleLevel(g);
		res = this._getResFromGrowupTask(g, res);
		return res;
	};
	
	this._getResFromRoleLevel = function(g){
		var res = this._getEmptyRes();
		if ( g.getImgr().getRoleLevel() >= 10 ) {
			this._setActTowerFight(res, 'rolelevel');
		}
		return res;
	};
	
	this._getResFromGrowupTask = function(g, res){
		var growups = g.getImgr().getTask().growups;
		for ( var i=0; i<growups.length; ++i ) {
			var task = growups[i];
			if ( task.state != 0 ) continue; 
			if ( task.id == FIXID.FIRST_FIGHT) {
				res.spiritTarget = 'inbuild.firstfight';
				res.spiritCon = rstr.newcomerHelp.tip.clickExpedBtn;
				res.spiritArrawDir = 3;
				res.spiritTargetW = 80;
				res.spiritTargetH = 30;
				res.spiritTargetOffY = 25;
				break;
			} else if ( task.id == FIXID.BUILD_JUNYING_TASK ) {
				res.spiritTarget = 'inbuild.firstfreeblock.junying';
				res.spiritSelectType = 1;
				res.spiritCon = rstr.newcomerHelp.tip.buildJunYing;
				res.spiritArrawDir = 3;
				res.spiritTargetW = 113;
				res.spiritTargetH = 65;
				res.spiritTargetShow = 1;
				break;
			} else if ( task.id == 1600056 ) { // 统率20个戟兵
				res.spiritTarget = 'inbuild.peibing2';
				res.spiritSelectType = 1;
				res.spiritCon = rstr.newcomerHelp.tip.peibing;
				res.spiritArrawDir = 3;
				res.spiritTargetW = 80;
				res.spiritTargetH = 30;
				res.spiritTargetOffY = 25;
				break;
			} else if ( task.id == 1600029 ) { // 再助乡里
				res.spiritTarget = 'inbuild.secfight';
				res.spiritCon = rstr.newcomerHelp.tip.clickExpedBtn;
				res.spiritArrawDir = 3;
				res.spiritTargetW = 80;
				res.spiritTargetH = 30;
				res.spiritTargetOffY = 25;
				break;
			} else if ( task.id == 1600071 ) { // 升级3级官府
				res.spiritTarget = 'inbuild.upbuild.guanfu2';
				res.spiritSelectType = 1;
				res.spiritCon = rstr.newcomerHelp.tip.upguanfu;
				res.spiritArrawDir = 2;
				res.spiritTargetW = 100;
				res.spiritTargetH = 100;
				res.spiritTargetOffX = 50;
				res.spiritTargetOffY = 427;
				break;
			} else if ( task.id == 1600023 ) { // 建筑排程卡
				break;
			} else if ( task.id == 1600072 ) { // 升级2级书院
				res.spiritTarget = 'inbuild.upbuild.shuyuan';
				res.spiritSelectType = 1;
				res.spiritCon = rstr.newcomerHelp.tip.upshuyuan;
				res.spiritArrawDir = 3;
				res.spiritTargetW = 100;
				res.spiritTargetH = 100;
				res.spiritTargetOffX = 40;
				res.spiritTargetOffY = 5;
				break;
			} else if ( task.id == 1600036 ) { // 尝试单挑野地
				HelpGuider.firstFightOutField();
				break;
			} else if ( task.id == 1600042 ) { // 千层塔
				this._setActTowerFight(res, 'task');
				break;
			}
		}
		return res;
	};
	
	this._getEmptyRes = function(){
		return {spiritSelectType:0, from:'', spiritTarget:'*.*.*.*', spiritCon:'', spiritArrawDir:0, spiritTargetW:0, spiritTargetH:0, spiritTargetOffX:0, spiritTargetOffY:0, spiritTargetShow:0};
	};
	
	this._setActTowerFight = function(res, from){
		res.spiritTarget = 'inbuild.firstActTowerFight';
		res.spiritSelectType = 1;
		res.spiritCon = rstr.newcomerHelp.tip.acttowerfight;
		res.spiritArrawDir = 2;
		res.spiritTargetW = 100;
		res.spiritTargetH = 100;
		res.spiritTargetOffX = 40;
		res.spiritTargetOffY = 5;
		res.from = from;
	};
}).snew();

HelpGuider.GetTaskAwardsChecker = Class.extern(function(){
	this.init = function(g){
		this.g_ = g;
	};
	
	this.check = function(){
		var tasks = UIM.getPanel('main').getTaskGuide().getTasks();
		for ( var i=0; i<tasks.length; ++i ) {
			if ( this._checkGetTaskAward(tasks[i].id) ) return true;
		}
		return false;
	};
	
	this._checkGetTaskAward = function(taskId){
		var task = this.g_.getImgr().getTaskById(taskId);
		if ( !task || task.state != TASK_STATE.WAIT_GET ) return false;
		
		this._closeSomeDlgs(taskId);
		UIM.getPanel('main').getTaskGuide().scrollTop();
		var target = this._getGetTaskAwardBtn(task).getParent();
		var parent =UIM.getPanel('main').getItems().rootmap;
		var res = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.getTaskAward, spiritArrawDir:0, spiritTargetW:50, spiritTargetH:30, spiritTargetOffX:0, spiritTargetOffY:0, spiritTargetShow:0};
		HelpGuider.SpiritUtil.startSpirit(parent, target, res);
		
		return true;
	};	
	
	this._closeSomeDlgs = function(taskId){
		if ( taskId == FIXID.RECRUIT_JI_HERO ) {
			UIM.getDlg('recruithero').hideDlg();
		} else if (taskId == FIXID.CARRY_ONELEVEL_JI_SOLDIER ) {
			UIM.getDlg('assignsoldiers').hideDlg();
		} else if (taskId == FIXID.BUILD_JIBING_TASK ) {
			UIM.getDlg('soldier').hideDlg();
		}
	};
	
	this._getGetTaskAwardBtn = function(task){
		UIM.getPanel('main').getTaskGuide().expandPanel();
		return UIM.getPanel('main').getTaskGuide().getTaskBtnById(task.id);
	};	
});

HelpGuider.GetCityUpgradeChecker = Class.extern(function(){
	this.init = function(g){
		this.g_ = g;
	};
	
	this.check = function(){
		if ( !UIM.getPanel('briefres').isCanUpgradeCityLevel() ) return false;
		
		var target = UIM.getPanel('briefres').getUpgradeCityBtn().getDom();
		var parent =UIM.getPanel('main').getItems().rootmap;
		var res = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.upgradeCity, spiritArrawDir:3, spiritTargetW:50, spiritTargetH:30, spiritTargetOffX:24, spiritTargetOffY:5, spiritTargetShow:0};
		HelpGuider.SpiritUtil.startSpirit(parent, target, res);
		return true;
	};
});

HelpGuider.SubCityOpenChecker = Class.extern(function(){
	this.init = function(g){
		this.g_ = g;
	};
	
	this.check = function(){
		var btn = UIM.getPanel('main').getSubCityBtnsBar().getEmptySubCity();
		if ( !btn ) return false;
		
		var target = btn.getDom();
		var parent =UIM.getPanel('main').getItems().rootmap;
		var res = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.openSubCity, spiritArrawDir:1, spiritTargetW:50, spiritTargetH:30, spiritTargetOffX:2, spiritTargetOffY:5, spiritTargetShow:0};
		HelpGuider.SpiritUtil.startSpirit(parent, target, res);
		return true;
	};
});

HelpGuider.BaseChecker = Class.extern(function(){
	this.init = function(g){
		this.g_ = g;
	};
	
	this._getPaths = function(){
		var res = this._getRes();
		return res.spiritTarget.split(".");
	};
	
	this._getRes = function(){
		return HelpGuider.SpiritUtil.getCurRes(this.g_);
	};
	
	this._isFirstFight = function(paths, items){
		return paths[0] == 'inbuild' && paths[1] == 'firstfight';
	};	
	
	this._isSecFight = function(paths, items){
		return paths[0] == 'inbuild' && paths[1] == 'secfight';
	};	
	
	this._hasGotoFirstArmy = function(){
		return this._hasGotoArmy(0);
	};	
	
	this._hasGotoSecArmy = function(){
		return this._hasGotoArmy(1);
	};	
	
	this._hasGotoArmy = function(index){
		var personalArmys = this.g_.getImgr().getArmys().list;
		for ( var i=0; i<personalArmys.length; ++i ) {
			var army = personalArmys[i];
			var copyFieldId = res_copyfields[index].id;
			if (army.targetId == copyFieldId 
				&& army.targetType == OBJ_TYPE.COPYFIELD 
				&& army.state == ARMYDYN_STATE.GOTO){
				return true;
			}
		}
		return false;
	};	
	
	this._centerViewToTarget = function(target, res){
		var pos = TQ.getDomPos(target);
		var viewPos = UIM.getPanel('inbuild').getViewPos();
		var x = pos.x + res.spiritTargetOffX - viewPos.w/2;
		var y = pos.y + res.spiritTargetOffY - viewPos.h/2;
		var x = x < 0 ? 0 : x;
		var y = y < 0 ? 0 : y;
		UIM.getPanel('inbuild').setViewPos({x:x, y:y});
	};
	
});

HelpGuider.BuildOpMenuChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(items){
	};
});

HelpGuider.SelBuildDlgChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(items){
		var paths = this._getPaths();
		var res = this._getRes();
		if ( paths[0] != 'inbuild') return;
		
		var text = res.spiritCon;
		var target = null;
		if ( paths[1] == 'refreshhero' && this.g_.getImgr().getBuildCntByResid(BUILDCITY_ID.MAIN, FIXID.TAVERNBUILD) == 0 ) {
			target = items.list.getItem(3).item;
			text = rstr.newcomerHelp.tip.buildJiuGuan;
		} if ( paths[2] == 'minju' && this.g_.getImgr().getBuildCntByResid(BUILDCITY_ID.MAIN, FIXID.HOUSEBUILD) == 0 ) {
			target = items.list.getItem(0).item;
		} else if ( paths[2] == 'cangku' ) {
			if ( this.g_.getImgr().getBuildCntByResid(BUILDCITY_ID.MAIN, FIXID.HOUSEBUILD) == 0 ) {
				target = items.list.getItem(0).item;
				res = ItemResUtil.findTaskRes(FIXID.NEWER_TASK_BUILD_MINJU);
				text = res.spiritCon;
			} else if ( this.g_.getImgr().getBuildCntByResid(BUILDCITY_ID.MAIN, FIXID.STOREINBUILD) == 0 ) {
				target = items.list.getItem(1).item;
			}
		} else if ( paths[2] == 'shuyuan' && this.g_.getImgr().getBuildCntByResid(BUILDCITY_ID.MAIN, FIXID.COLLEGEBUILD) == 0) {
			target = items.list.getItem(7).item;
		} else if ( paths[2] == 'jiuguan' && this.g_.getImgr().getBuildCntByResid(BUILDCITY_ID.MAIN, FIXID.TAVERNBUILD) == 0) {
			target = items.list.getItem(3).item;
		} else if ( paths[2] == 'junying' && this.g_.getImgr().getBuildCntByResid(BUILDCITY_ID.MAIN, FIXID.BARBACK) == 0) {
			target = items.list.getItem(4).item;
		}
		
		if (!target) {
			HelpGuider.hideSpirit();
			return;
		}
		
		var newRes = {spiritSelectType:0, spiritCon:text, spiritArrawDir:0, 
			spiritTargetW:77+16, spiritTargetH:91+16, spiritTargetOffX:0, spiritTargetOffY:0, spiritTargetShow:1 };
		HelpGuider.SpiritUtil.startSpirit(TQ.getDomParent(target), target, newRes);
	};
});

HelpGuider.UseListItemDlgChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(items){
		var paths = this._getPaths();
		var res = this._getRes();
		var text = res.spiritCon;
		if ( !this._isSpeedBuildState(paths, items) 
			&& !this._isHasUpgradeMinJu(paths, items) 
			&& !this._isHasUpgradeGuanFu(paths, items) 
			&& !this._isHasUpgradeShuYuan(paths, items) 
			&& !this._isLearnZhongZhiShuState(paths, items)
			&& !this._isLearnJiBingCultureState(paths, items) ) return;
		
		if ( this._isLearnJiBingCultureState(paths, items) ) {
			text = rstr.newcomerHelp.tip.speed;
		}
		
		var usebtn = items.items.itemlist.getItem(0).exsubs.usebtn;
		var target = usebtn.getDom();
		
		var newRes = {spiritSelectType:0, spiritCon:text, spiritArrawDir:0, 
			spiritTargetW:40, spiritTargetH:40, spiritTargetOffX:0, spiritTargetOffY:0, spiritTargetShow:1 };
		HelpGuider.SpiritUtil.startSpirit(items.parent, target, newRes);
		UIM.getDlg('culture').closeDlg();
	};
	
	this._isSpeedBuildState = function(paths, items) {
		return ( paths[0] == 'inbuild' && paths[1] == 'speedbuild' ) && this._isSpeedBuildItem(paths, items);
	};
	
	this._isHasUpgradeMinJu = function(paths, items){
		return this._isHasUpgradeBuild(paths, items, 'minju', FIXID.HOUSEBUILD, 1);
	};
	
	this._isHasUpgradeGuanFu = function(paths, items){
		return this._isHasUpgradeBuild(paths, items, 'guanfu2', FIXID.GOV_BUILD, 2);
	};
	
	this._isHasUpgradeShuYuan = function(paths, items){
		return this._isHasUpgradeBuild(paths, items, 'shuyuan', FIXID.COLLEGEBUILD, 1);
	};
	
	this._isHasUpgradeBuild = function(paths, items, name, buildId, buildLevel){
		if ( paths[0] == 'inbuild' && paths[1] == 'upbuild' && paths[2] == name ) {
			var spec = HelpGuider.AndSpec.snew(HelpGuider.SameResIdSpec.snew(buildId), HelpGuider.GreatLevelSpec.snew(buildLevel-1), HelpGuider.SameStateSpec.snew(BUILD_STATE.UPGRADE) );
			var blocks = UIM.getPanel('inbuild').getBlocksByResId(spec);
			return (blocks.length > 0) && this._isSpeedBuildItem(paths, items);
		}
		return false;
	};
	
	this._isSpeedBuildItem = function(paths, items){
		var a = ( items.data.effids && items.data.effids.length > 0 && items.data.effids[0] == RES_EFF.ACCELERATE );
		var b = ( items.data.targetitem.type && items.data.targetitem.type == RES_TRG.BUILDING_IBUILD );
		return a && b;
	};
	
	this._isLearnZhongZhiShuState = function(paths, items) {
		return ( paths[0] == 'inbuild' && paths[1] == 'learnculture' )
			&& (this.g_.getImgr().getLearningCulture().id == FIXID.FOODCBUILD)
			&& (items.data.effids && items.data.effids.length > 0 && items.data.effids[0] == RES_EFF.ACC_CULTURELEARN );
	};
	
	this._isLearnZhongZhiShuState = function(paths, items) {
		return ( paths[0] == 'inbuild' && paths[1] == 'learnculture' )
			&& (this.g_.getImgr().getLearningCulture().id == FIXID.FOODCBUILD)
			&& (items.data.effids && items.data.effids.length > 0 && items.data.effids[0] == RES_EFF.ACC_CULTURELEARN );
	};
	
	this._isLearnJiBingCultureState = function(paths, items){
		return (paths[0] == 'inbuild' && paths[1] == 'recruitsoldier' && paths[2] == 'jibing')
			&& (this.g_.getImgr().getLearningCulture().id == FIXID.JIBINGCBUILD)
			&& (items.data.effids && items.data.effids.length > 0 && items.data.effids[0] == RES_EFF.ACC_CULTURELEARN );
	};
});

HelpGuider.RecruitHeroDlgChecker = HelpGuider.BaseChecker.extern(function(){
	this.init = function(g){
		this.g_ = g;
	};
	
	this.check = function(items){
		var target = null;
		var newRes = null;
		var paths = this._getPaths();
		var res = this._getRes();
		if ( this._isRecruitHeroState(paths) ) {
			TQ.find(UIM.getDlg('recruithero').getNewHeros(), 'prof', HERO_PROF.JIJIANG);
			var idx = TQ.getLastFindIdx();
			if ( idx >= 0 ) {
				var recruitbtn = items.items.list.getItem(idx).exsubs.recruitbtn;
				target = recruitbtn.getDom();
				newRes = {spiritSelectType:0, spiritCon:res.spiritCon, spiritArrawDir:0, 
					spiritTargetW:65, spiritTargetH:40, spiritTargetOffX:0, spiritTargetOffY:0, spiritTargetShow:0 };
			}
		} else if ( this._isRefreshHeroState(paths) ) {
			target = items.items.refreshbtn.getDom();
			newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.refreshHeros, spiritArrawDir:0, 
				spiritTargetW:60+20, spiritTargetH:14+12, spiritTargetOffX:-20, spiritTargetOffY:0, spiritTargetShow:0 };
		}
		
		if ( !target ) {
			return;
		}

		HelpGuider.SpiritUtil.startSpirit(items.parent, target, newRes);
	};
	
	this._isRecruitHeroState = function(paths){
		return paths[0] == 'inbuild' && paths[1] == 'recruithero';
	};
	
	this._isRefreshHeroState = function(paths){
		var task = this.g_.getImgr().getTaskById(FIXID.REFRESH_HERO_TASK);
		return (paths[0] == 'inbuild' && paths[1] == 'refreshhero') 
			&& (task == null || task.state == TASK_STATE.WAIT_COMPLETE );
	};
});

HelpGuider.CultureDlgChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(items){
		var paths = this._getPaths();
		var res = this._getRes();
		var ret = {target:null, newRes:null};
		if ( this._isLearnZhongZhiShuState(paths) ) {
			var params = {
				text:rstr.newcomerHelp.tip.learnZhongZhiShu
				,tabText:rstr.newcomerHelp.tip.selCurPage
				,cultureId:FIXID.FOODCBUILD
				,tabIdx:0 
				,itemIdx:0};
			this._learnCulture(items, params, ret);
		} else if ( this._isLearnJiBingCultureState(paths) ) {
			var params = {
				text:rstr.newcomerHelp.tip.learnJiBingCulture
				,tabText:rstr.newcomerHelp.tip.selCurPage
				,cultureId:FIXID.JIBINGCBUILD
				,tabIdx:2 
				,itemIdx:0};
			this._learnCulture(items, params, ret);
		}
		
		if ( !ret.target ) {
			return;
		}
		
		HelpGuider.SpiritUtil.startSpirit(items.parent, ret.target, ret.newRes);
	};
	
	this._isLearnZhongZhiShuState = function(paths){
		return paths[0] == 'inbuild' && paths[1] == 'learnculture' && paths[2] == 'zhongzhishu';
	};
	
	this._isLearnJiBingCultureState = function(paths){
		return paths[0] == 'inbuild' && paths[1] == 'recruitsoldier' && paths[2] == 'jibing';
	};
	
	this._learnCulture = function(items, params, output){
		output.target = null;
		output.newRes = null;
		var tabIdx = items.items.tablist.getActiveTab();
		var itemIdx = items.items.tablist.getTabItems(tabIdx).list.getCurSel();
		var level = this.g_.getImgr().getCultureLevel(params.cultureId);
		if (tabIdx != params.tabIdx && this.g_.getImgr().getLearningCulture().id != params.cultureId && level == 0 ) {
			output.target = items.items.tablist.getTabBtn(params.tabIdx).getDom();
			items.parent = TQ.getDomParent(output.target);
			output.newRes = {spiritSelectType:0, spiritCon:params.tabText, spiritArrawDir:1, 
				spiritTargetW:50+20, spiritTargetH:22+12, spiritTargetOffX:0, spiritTargetOffY:-10, spiritTargetShow:0 };			
		} else if (tabIdx == params.tabIdx && itemIdx == params.itemIdx && this.g_.getImgr().getLearningCulture().id != params.cultureId && level == 0) {
			output.target = items.items.learnbtn.getDom();
			output.newRes = {spiritSelectType:0, spiritCon:params.text, spiritArrawDir:0, 
				spiritTargetW:65, spiritTargetH:40, spiritTargetOffX:0, spiritTargetOffY:0, spiritTargetShow:0 };
		} else if (tabIdx == params.tabIdx && itemIdx != params.itemIdx && this.g_.getImgr().getLearningCulture().id != params.cultureId && level == 0) {
			output.target = items.items.tablist.getTabItems(params.tabIdx).list.getItem(params.itemIdx).item;
			output.newRes = {spiritSelectType:0, spiritCon:params.text, spiritArrawDir:1, 
				spiritTargetW:55+16, spiritTargetH:55+16, spiritTargetOffX:15, spiritTargetOffY:0, spiritTargetShow:0 };
		} else if ( this.g_.getImgr().getLearningCulture().id == params.cultureId ) {
			output.target = items.items.speedbtn.getDom();
			output.newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.speed, spiritArrawDir:1, 
				spiritTargetW:37+16, spiritTargetH:22+10, spiritTargetOffX:0, spiritTargetOffY:0, spiritTargetShow:0 };
		} else {
			HelpGuider.hideAllSpirits();
		}
	};
});

HelpGuider.ExpeditionDlgChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(items){
		var paths = this._getPaths();
		var rt = {target:null, newRes:null};
		if ( this._isPeiBingState(paths, items) || this._isPeiBing2State(paths, items) ) {
			rt.target = items.items.assignsoldier.getDom();
			rt.newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.clickPeibingBtn, spiritArrawDir:0, 
				spiritTargetW:65, spiritTargetH:40, spiritTargetOffX:0, spiritTargetOffY:0, spiritTargetShow:0 };			
		} else if ( this._isFirstFight(paths, items) && !this._hasGotoFirstArmy() ) {
			rt = this._guide(items, 171001);
		} else if ( this._isSecFight(paths, items) && !this._hasGotoSecArmy() ) {
			rt = this._guide(items, 171002);			
		}
		
		if ( !rt.target ) {
			return;
		}
		
		HelpGuider.SpiritUtil.startSpirit(items.parent, rt.target, rt.newRes);		
	};
	
	this._guide = function(items, fieldId){
		var rt = {target:null, newRes:null};
		if (!this._isCopyFieldTarget(fieldId)) {
			rt.target = items.items.selecttarget.getDom();
			rt.newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.selExpedTarget, spiritArrawDir:0, 
				spiritTargetW:71+20, spiritTargetH:25+12, spiritTargetOffX:-10, spiritTargetOffY:0, spiritTargetShow:0 };
		} else if (!UIM.getDlg('expedition').hasExpedHeros() ) {
			rt.target = items.items.changeforcetab.getDom();
			rt.newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.setExpedHerosForce, spiritArrawDir:0, 
				spiritTargetW:30+20, spiritTargetH:70+12, spiritTargetOffX:-15, spiritTargetOffY:0, spiritTargetShow:0 };
		} else {
			rt.target = items.items.expedition.getDom();
			rt.newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.confirmExped, spiritArrawDir:0, 
				spiritTargetW:90+20, spiritTargetH:39+12, spiritTargetOffX:-15, spiritTargetOffY:0, spiritTargetShow:0 };
		}
		return rt;
	};
	
	this._isPeiBingState = function(paths, items){
		if ( paths[0] != 'inbuild' || paths[1] != 'peibing' ) return false;
		return true;
	};
	
	this._isPeiBing2State = function(paths, items){
		if ( paths[0] != 'inbuild' || paths[1] != 'peibing2' ) return false;
		return true;
	};

	this._isCopyFieldTarget = function(id){
		var expedTarget = UIM.getDlg('expedition').getTarget();
		return (expedTarget != null && expedTarget.type == OBJ_TYPE.COPYFIELD && expedTarget.resid == id);
	};
});

HelpGuider.AssignSoldiersDlgChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(items, checkType){
		var rt = {target:null, newRes:null};
		var paths = this._getPaths();
		if ( this._isPeiBingState(paths, items) ) {
			rt = this._guide(items, checkType, 10);
		} else if ( this._isPeiBing2State(paths, items) ) {
			rt = this._guide(items, checkType, 20);
		}
		
		if ( !rt.target ) {
			return;
		}
		
		HelpGuider.SpiritUtil.startSpirit(items.parent, rt.target, rt.newRes);		
	};
	
	this._guide = function(items, checkType, number){
		var rt = {target:null, newRes:null};
		var item = items.items.herolist.getItem(0).exsubs;
		if ( item.soldiertype.getTitle().indexOf(rstr.newcomerHelp.txt.jibing) < 0 ) {
			rt.target = item.soldiertype.getTitleDom();
			rt.newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.selectSoldierType, spiritArrawDir:2, 
				spiritTargetW:67+20, spiritTargetH:14+12, spiritTargetOffX:10, spiritTargetOffY:0, spiritTargetShow:0 };			
		} else if ( item.soldiernumber.getVal() < number ) {
			rt.target = item.soldiernumber.getDom();
			var inputNumber = TQ.format(rstr.newcomerHelp.tip.inputSoldierNumber, number);
			rt.newRes = {spiritSelectType:0, spiritCon:inputNumber, spiritArrawDir:1, 
				spiritTargetW:70+20, spiritTargetH:22+12, spiritTargetOffX:0, spiritTargetOffY:-6, spiritTargetShow:0 };			
		} else {
			item.soldiernumber.setVal(number);
			rt.target = item.confirm.getDom();
			rt.newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.confirmAssignSoldier, spiritArrawDir:1, 
				spiritTargetW:39+20, spiritTargetH:22+12, spiritTargetOffX:0, spiritTargetOffY:-6, spiritTargetShow:0 };			
		}
		
		if (checkType == 'dlgOpen' && UIM.getDlg('expedition').isShow() ) {
			UIM.getDlg('expedition').hideDlg();
		}
		return rt;
	};
	
	this._isPeiBingState = function(paths, items){
		return this._isCommPeiBingState(paths, items, 'peibing');
	};
	
	this._isPeiBing2State = function(paths, items){
		return this._isCommPeiBingState(paths, items, 'peibing2');
	};
	
	this._isCommPeiBingState = function(paths, items, name){
		if ( paths[0] != 'inbuild' || paths[1] != name ) return false;
		if ( items.items.herolist.getCount() == 0 ) return false;
		return true;
	};
});

HelpGuider.SelPipDlgChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(items){
		var target = null;
		var newRes = null;
		var paths = this._getPaths();
		var res = this._getRes();
		if ( this._isSeedState(paths, items) ) {
			var item = this._getItem(items.items.list);
			target = item.exsubs.icon;
			items.parent = TQ.getDomParent(target);
			newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.selOnePip, spiritArrawDir:0, 
				spiritTargetW:60+16, spiritTargetH:60+16, spiritTargetOffX:0, spiritTargetOffY:0, spiritTargetShow:1 };			
		}
		
		if ( !target ) {
			return;
		}
		
		HelpGuider.SpiritUtil.startSpirit(items.parent, target, newRes);		
	};
	
	this._isSeedState = function(paths, items){
		if ( paths[0] != 'farm' || paths[1] != 'seed' ) return false;
		if ( UIM.getPanel('farm').getView().getEmptyBlock() == null ) return false;
		return true;
	};
	
	this._getItem = function(list){
		var hasPips = [{resid:FIXID.FARM, has:false}
			,{resid:FIXID.TIMBERYARD, has:false}
			,{resid:FIXID.QUARRY, has:false}
			,{resid:FIXID.IRONORE, has:false} ];
		var blocks = UIM.getPanel('farm').getView().getBuildblocks();
		var cnt = blocks.getShowBlocks();
		for ( var i=0; i<cnt; ++i ){
			var block = blocks.getBlock(i);
			var item = block.getItem();
			if ( item.empty ) continue;
			if ( item.next ) continue;
			var node = TQ.find(hasPips, 'resid', item.resid);
			node.has = true;
		}
		
		hasNotIdx = 0;
		for ( var i=0; i<4; ++i ) {
			var node = hasPips[i];
			if ( !node.has ) {
				hasNotIdx = i;
				break;
			}
		}
		
		return list.getItem(hasNotIdx*4+3);
	};
}); 

HelpGuider.SelectExpedTargetDlgChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(items){
		var rt = {target:null, newRes:null};
		var paths = this._getPaths();
		if ( this._isFirstFight(paths, items) ) {
			rt = this._guide(items, 0);
		} else if (this._isSecFight(paths, items)) {
			rt = this._guide(items, 1);
		}
		
		if ( !rt.target ) {
			return;
		}
		
		HelpGuider.SpiritUtil.startSpirit(items.parent, rt.target, rt.newRes);		
	};
	
	this._guide = function(items, index){
		var rt = {target:null, newRes:null};
		var tabItems = items.items.tablist.getTabItems(0);
		if ( items.items.tablist.getActiveTab() != 0 ) {
			rt.target = items.items.tablist.getTabBtn(0).getDom();
			items.parent = TQ.getDomParent(rt.target);
			rt.newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.selCopyFieldTab, spiritArrawDir:1, 
				spiritTargetW:72+20, spiritTargetH:22+12, spiritTargetOffX:0, spiritTargetOffY:-10, spiritTargetShow:0 };			
		} else if ( tabItems.typelist.getCurSel() != 0 ) {
			rt.target = tabItems.typelist.getItem(0).exsubs.name;
			items.parent = TQ.getDomParent(rt.target);
			rt.newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.selFirstCopyType, spiritArrawDir:0, 
				spiritTargetW:116+20, spiritTargetH:12+12, spiritTargetOffX:-40, spiritTargetOffY:0, spiritTargetShow:0 };			
		} else if ( tabItems.targetlist.getCurSel() != index ) {
			rt.target = tabItems.targetlist.getItem(index).item;
			items.parent = tabItems.target_bak;
			rt.newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.selCopyFields[index], spiritArrawDir:0, 
				spiritTargetW:90+20, spiritTargetH:30+12, spiritTargetOffX:0, spiritTargetOffY:0, spiritTargetShow:0 };			
		} else {
			rt.target = items.items.confirmBtn.getDom();
			items.parent = TQ.getDomParent(rt.target);
			rt.newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.confirmSelCopyField, spiritArrawDir:0, 
				spiritTargetW:67+20, spiritTargetH:22+12, spiritTargetOffX:-10, spiritTargetOffY:0, spiritTargetShow:0 };	
		}
		return rt;
	};
});

HelpGuider.AssignHerosDlgChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(items){
		var target = null;
		var newRes = null;
		var paths = this._getPaths();
		var res = this._getRes();
		if ( this._isFirstFight(paths) || this._isSecFight(paths) ) {
			if ( !UIM.getDlg('assignheros').hasAssignedHero() ) {
				target = items.items.autosel.getDom();
				newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.autoAssignHero, spiritArrawDir:3, 
					spiritTargetW:60+20, spiritTargetH:22+12, spiritTargetOffX:0, spiritTargetOffY:10, spiritTargetShow:0 };
			} else {
				target = UIM.getDlg('assignheros').getCoreDlg().getBtns()[0].getDom();
				newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.confirmAssignHero, spiritArrawDir:3, 
					spiritTargetW:60+20, spiritTargetH:22+12, spiritTargetOffX:0, spiritTargetOffY:10, spiritTargetShow:0 };
			}
		}
		
		if ( !target ) {
			return;
		}
		
		HelpGuider.SpiritUtil.startSpirit(items.parent, target, newRes);		
	};
});

HelpGuider.MilitaryDlgChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(items){
		var target = null;
		var newRes = null;
		var paths = this._getPaths();
		var res = this._getRes();
		if ( this._isFirstFight(paths, items) || this._isSecFight(paths, items) ) {
			HelpGuider.hideAllSpirits();
			HelpGuider.opbitmaps_['openedMiliraryDlg'] = true;
			return;
		}
	};
});

HelpGuider.SoldierDlgChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(items){
		var target = null;
		var newRes = null;
		var paths = this._getPaths();
		var res = this._getRes();
		var view = UIM.getDlg('soldier').getView();
		var idx = view.getCtrl('cantraininglist').getCurSel();
		var val = view.getCtrl('isoldiernum').getVal();
		if ( this._isCanRecruitSoldier(paths, items) ) {
			if ( idx != 1 ) {
				target = view.getCtrl('cantraininglist').getItem(1).exsubs.icon;
				newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.selJiBing, spiritArrawDir:1, 
					spiritTargetW:60+20, spiritTargetH:60+12, spiritTargetOffX:0, spiritTargetOffY:-10, spiritTargetShow:0 };						
			} else if ( val < 20 ) {
				target = view.getCtrl('isoldiernum').getDom();
				newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.input20JiBing, spiritArrawDir:2, 
					spiritTargetW:64+20, spiritTargetH:22+12, spiritTargetOffX:10, spiritTargetOffY:0, spiritTargetShow:0 };			
			} else {
				target = view.getCtrl('trainingbtn').getDom();
				newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.confirmRecruitSoldier, spiritArrawDir:2, 
					spiritTargetW:67+20, spiritTargetH:22+12, spiritTargetOffX:10, spiritTargetOffY:0, spiritTargetShow:0 };			
			}
		}
		
		if ( !target ) {
			return;
		}
		
		HelpGuider.SpiritUtil.startSpirit(items.parent, target, newRes);		
	};
	
	this._isCanRecruitSoldier = function(paths, items){
		return ( paths[0] == 'inbuild' && paths[1] == 'recruitsoldier' )
			&& (this.g_.getImgr().getCultureLevel(FIXID.JIBINGCBUILD) > 0);
	};
});

HelpGuider.PackageDlgChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(items){
		var target = null;
		var newRes = null;
		var paths = this._getPaths();
		var res = this._getRes();
		if ( !this._isUseItemState(paths, items) ) {
			return;
		}

		var tabList = UIM.getDlg('package').getCtrl('tab');
		var tabIdx = tabList.getActiveTab();
		if ( tabIdx != 0 && tabIdx != 1 ) {
			target = tabList.getTabBtn(1).getDom();
			newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.selCurPage, spiritArrawDir:1, 
				spiritTargetW:60+20, spiritTargetH:22+12, spiritTargetOffX:0, spiritTargetOffY:-10, spiritTargetShow:0 };						
		} else {
			var listIdx = UIM.getDlg('package').getIdxByTabIdxAndItemResId(tabIdx, FIXID.PAICHENGKA);
			if ( listIdx >= 0 ) {
				var list = tabList.getTabItems(tabIdx).list;
				target = list.getItem(listIdx).exsubs.icon;
				newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.useItem, spiritArrawDir:2, 
					spiritTargetW:53+20, spiritTargetH:53+12, spiritTargetOffX:0, spiritTargetOffY:0, spiritTargetShow:0 };			
				HelpGuider.isUsePaiChengKa = true;
			}
		}
		
		if ( !target ) {
			return;
		}
		
		HelpGuider.SpiritUtil.startSpirit(items.parent, target, newRes);		
	};
	
	this._isUseItemState = function(paths, items){
		return ( paths[0] == 'pkg' && paths[1] == 'useitem' );
	};
});

HelpGuider.InBuildFirstfreeblockChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(res, paths){
		var hasMinJu = UIM.getPanel('inbuild').getBlocksByResId(HelpGuider.SameResIdSpec.snew(FIXID.HOUSEBUILD)).length > 0;
		var hasCangku = UIM.getPanel('inbuild').getBlocksByResId(HelpGuider.SameResIdSpec.snew(FIXID.STOREINBUILD)).length > 0;
		var spec = HelpGuider.AndSpec.snew(HelpGuider.SameResIdSpec.snew(FIXID.HOUSEBUILD), HelpGuider.GreatLevelSpec.snew(0));
		var hasOneLevelMinJu = UIM.getPanel('inbuild').getBlocksByResId(spec).length > 0;
		var hasShuYuan = UIM.getPanel('inbuild').getBlocksByResId(HelpGuider.SameResIdSpec.snew(FIXID.COLLEGEBUILD)).length > 0;
		var hasJiuGuan = UIM.getPanel('inbuild').getBlocksByResId(HelpGuider.SameResIdSpec.snew(FIXID.TAVERNBUILD)).length > 0;
		var hasJunYing = UIM.getPanel('inbuild').getBlocksByResId(HelpGuider.SameResIdSpec.snew(FIXID.BARBACK)).length > 0;
		
		var target = null;
		if (paths[2] == 'minju' && !hasMinJu ) {
			target = UIM.getPanel('inbuild').getFirstFreeBlock().getDom();
		} else if (paths[2] == 'cangku' && !hasMinJu) {
			target = UIM.getPanel('inbuild').getFirstFreeBlock().getDom();
			res = ItemResUtil.findTaskRes(FIXID.NEWER_TASK_BUILD_MINJU);
		} else if (paths[2] == 'cangku' && !hasCangku && hasOneLevelMinJu ) {
			target = UIM.getPanel('inbuild').getFirstFreeBlock().getDom();
		} else if (paths[2] == 'shuyuan' && !hasShuYuan ) {
			target = UIM.getPanel('inbuild').getFirstFreeBlock().getDom();
		} else if (paths[2] == 'jiuguan' && !hasJiuGuan ) {
			target = UIM.getPanel('inbuild').getFirstFreeBlock().getDom();
		} else if (paths[2] == 'junying' && !hasJunYing ) {
			target = UIM.getPanel('inbuild').getFirstFreeBlock().getDom();
		}
		
		if (!target) {
			HelpGuider.hideAllSpirits();
			return;
		}
		
		this._centerViewToTarget(target, res);
		HelpGuider.SpiritUtil.startSpirit(TQ.getDomParent(target), target, res);
	};
});

HelpGuider.SameResIdSpec = Class.extern(function(){
	this.init = function(resid){
		this.resid_ = resid;
	};
	this.isSatisfiedBy = function(item){
		return item.resid == this.resid_;
	};
});
HelpGuider.SameLevelSpec = Class.extern(function(){
	this.init = function(level){
		this.level_ = level;
	};
	this.isSatisfiedBy = function(item){
		return item.level == this.level_;
	};
});
HelpGuider.GreatLevelSpec = Class.extern(function(){
	this.init = function(level){
		this.level_ = level;
	};
	this.isSatisfiedBy = function(item){
		return item.level > this.level_;
	};
});
HelpGuider.SameStateSpec = Class.extern(function(){
	this.init = function(state){
		this.state_ = state;
	};
	this.isSatisfiedBy = function(item){
		return item.state == this.state_;
	};
});
HelpGuider.AndSpec = Class.extern(function(){
	this.init = function(){
		this.specs_ = [];
		for ( var i=0; i<arguments.length; ++i ) {
			this.specs_.push(arguments[i]);
		}
	};
	this.isSatisfiedBy = function(item){
		for ( var i=0; i<this.specs_.length; ++i ) {
			if (!this.specs_[i].isSatisfiedBy(item)) return false;
		}
		return true;
	};
});

HelpGuider.InBuildUpbuildChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(res, paths){
		var rt = {target:null, tres:res};
		if (paths[2] == 'guanfu'){
			var spec = HelpGuider.AndSpec.snew(HelpGuider.SameResIdSpec.snew(FIXID.GOV_BUILD), HelpGuider.SameLevelSpec.snew(1), HelpGuider.SameStateSpec.snew(0) );
			var blocks = UIM.getPanel('inbuild').getBlocksByResId(spec);
			var hasGuanfu = blocks.length > 0;
			if (hasGuanfu){
				rt.target = blocks[0].getDom();
				HelpGuider.buildOpMenu.itemId = 'UPGRADE';
				HelpGuider.buildOpMenu.buildId = FIXID.GOV_BUILD;
				HelpGuider.buildOpMenu.buildState = 0;
			}
		} else if (paths[2] == 'guanfu2'){
			rt = this._upBuildOrSpeedBuilding(res, FIXID.GOV_BUILD, 2);
		} else if (paths[2] == 'minju') {
			var spec = HelpGuider.SameResIdSpec.snew(FIXID.HOUSEBUILD);
			var hasMinJu = UIM.getPanel('inbuild').getBlocksByResId(spec).length > 0;
			if ( !hasMinJu ) {
				rt.target = UIM.getPanel('inbuild').getFirstFreeBlock().getDom();
				rt.tres = ItemResUtil.findTaskRes(FIXID.NEWER_TASK_BUILD_MINJU);
			} else {
				rt = this._upBuildOrSpeedBuilding(res, FIXID.HOUSEBUILD, 1);
			}
		} else if (paths[2] == 'shuyuan') {
			rt = this._upBuildOrSpeedBuilding(res, FIXID.COLLEGEBUILD, 1);
		}

		if (!rt.target) {
			HelpGuider.hideAllSpirits();
			return;
		}
		
		this._centerViewToTarget(rt.target, rt.tres);
		HelpGuider.SpiritUtil.startSpirit(TQ.getDomParent(rt.target), rt.target, rt.tres);
	};
	
	this._upBuildOrSpeedBuilding = function(res, buildId, buildLevel){
		var rt = {target:null, tres:res};
		var spec = HelpGuider.AndSpec.snew(HelpGuider.SameResIdSpec.snew(buildId), HelpGuider.GreatLevelSpec.snew(buildLevel-1), HelpGuider.SameStateSpec.snew(BUILD_STATE.UPGRADE) );
		var blocks = UIM.getPanel('inbuild').getBlocksByResId(spec);
		var upBlock = null;
		if ( blocks.length > 0 ) {
			upBlock = blocks[0];
		}
		
		var spec = HelpGuider.AndSpec.snew( HelpGuider.SameResIdSpec.snew(buildId), HelpGuider.SameLevelSpec.snew(buildLevel), HelpGuider.SameStateSpec.snew(0) );
		var blocks = UIM.getPanel('inbuild').getBlocksByResId(spec);
		var fitBlock = null;
		if ( blocks.length > 0 ) {
			fitBlock = blocks[0];
		}
		
		if ( upBlock ) {
			rt.target = upBlock.getDom();
			var newRes = {};
			TQ.dictCopy(newRes, res);
			newRes.spiritCon = ItemResUtil.findTaskRes(FIXID.NEWER_TASK_SPEED_BUILD).spiritCon;
			rt.tres = newRes;
			HelpGuider.buildOpMenu.itemId = 'SPEED';
			HelpGuider.buildOpMenu.buildId = buildId;
			HelpGuider.buildOpMenu.buildState = BUILD_STATE.UPGRADE;
		} else if ( fitBlock ) {
			rt.target = fitBlock.getDom();
			HelpGuider.buildOpMenu.itemId = 'UPGRADE';
			HelpGuider.buildOpMenu.buildId = buildId;
			HelpGuider.buildOpMenu.buildState = BUILD_STATE.COMM;
		}
		return rt;
	};
});

HelpGuider.InBuildSpeedBuildChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(res, paths){
		var block = null;
		var spec = HelpGuider.AndSpec.snew(HelpGuider.GreatLevelSpec.snew(0), HelpGuider.SameStateSpec.snew(BUILD_STATE.UPGRADE));
		var blocks = UIM.getPanel('inbuild').getBlocksByResId(spec);
		if (blocks.length > 0) {
			block = blocks[0];
		}
		
		if (!block) {
			HelpGuider.hideAllSpirits();
			return;
		}
		
		var target = block.getDom();
		
		var resid = block.getItem().resid;
		var buildres = ItemResUtil.findItemres(resid);
		var newRes = {};
		TQ.dictCopy(newRes, res);
		newRes.spiritArrawDir = buildres.spiritArrawDir;
		newRes.spiritTargetW = buildres.spiritTargetW;
		newRes.spiritTargetH = buildres.spiritTargetH;
		newRes.spiritTargetOffX = buildres.spiritTargetOffX;
		newRes.spiritTargetOffY = buildres.spiritTargetOffY;
		
		HelpGuider.SpiritUtil.startSpirit(TQ.getDomParent(target), target, newRes);
			
		HelpGuider.buildOpMenu.itemId = 'SPEED';
		HelpGuider.buildOpMenu.buildId = resid;
		HelpGuider.buildOpMenu.buildState = BUILD_STATE.UPGRADE;
			
		this._centerViewToTarget(target, newRes);
	};
});

HelpGuider.InBuildRecruitHeroChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(res, paths){
		var newRes = {};
		TQ.dictCopy(newRes, res);
			
		var block = null;
		var spec = HelpGuider.AndSpec.snew(HelpGuider.GreatLevelSpec.snew(0), HelpGuider.SameResIdSpec.snew(FIXID.TAVERNBUILD));
		var blocks = UIM.getPanel('inbuild').getBlocksByResId(spec);
		if (blocks.length > 0) {
			block = blocks[0];
			HelpGuider.buildOpMenu.itemId = 'RECRUITHERO';
			HelpGuider.buildOpMenu.buildId = FIXID.TAVERNBUILD;
			HelpGuider.buildOpMenu.buildState = -1;
		} else {
			var hasBuild = UIM.getPanel('inbuild').getBlocksByResId(HelpGuider.SameResIdSpec.snew(FIXID.TAVERNBUILD)).length > 0;
			if ( !hasBuild ) {
				block = UIM.getPanel('inbuild').getFirstFreeBlock();
				newRes = ItemResUtil.findTaskRes(FIXID.NEWER_TASK_BUILD_JIUGUAN);
			}
		}
		
		if (!block) {
			HelpGuider.hideAllSpirits();
			return;
		}
		
		var target = block.getDom();
		HelpGuider.SpiritUtil.startSpirit(TQ.getDomParent(target), target, newRes);
		this._centerViewToTarget(target, newRes);
	};
});

HelpGuider.InBuildRefreshHeroChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(res, paths){
		var newRes = {};
		TQ.dictCopy(newRes, res);
			
		var block = null;
		var spec = HelpGuider.AndSpec.snew(HelpGuider.GreatLevelSpec.snew(-1), HelpGuider.SameResIdSpec.snew(FIXID.TAVERNBUILD));
		var blocks = UIM.getPanel('inbuild').getBlocksByResId(spec);
		if (blocks.length > 0) {
			block = blocks[0];
			HelpGuider.buildOpMenu.itemId = 'RECRUITHERO';
			HelpGuider.buildOpMenu.buildId = FIXID.TAVERNBUILD;
			HelpGuider.buildOpMenu.buildState = -1;			
		} else {
			block = UIM.getPanel('inbuild').getFirstFreeBlock();
			newRes = {spiritSelectType:1, spiritCon:rstr.newcomerHelp.tip.buildJiuGuan, spiritArrawDir:3, spiritTargetW:113, spiritTargetH:64, spiritTargetOffX:0, spiritTargetOffY:0, spiritTargetShow:1 };
		}
		
		if (!block) {
			HelpGuider.hideAllSpirits();
			return;
		}
		
		var target = block.getDom();
		HelpGuider.SpiritUtil.startSpirit(TQ.getDomParent(target), target, newRes);
		this._centerViewToTarget(target, newRes);
	};
});

HelpGuider.InBuildLearnCultureChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(res, paths){
		var newRes = {};
		TQ.dictCopy(newRes, res);
			
		var block = null;
		var spec = HelpGuider.AndSpec.snew(HelpGuider.GreatLevelSpec.snew(-1), HelpGuider.SameResIdSpec.snew(FIXID.COLLEGEBUILD));
		var blocks = UIM.getPanel('inbuild').getBlocksByResId(spec);
		var level = this.g_.getImgr().getCultureLevel(FIXID.FOODCBUILD);
		if (blocks.length > 0 && this.g_.getImgr().getLearningCulture().id != FIXID.FOODCBUILD && level == 0) {
			block = blocks[0];
			HelpGuider.buildOpMenu.itemId = 'CULTURE';
			HelpGuider.buildOpMenu.buildId = FIXID.COLLEGEBUILD;
			HelpGuider.buildOpMenu.buildState = -1;
		} else if (blocks.length == 0) {
			block = UIM.getPanel('inbuild').getFirstFreeBlock();
			newRes = ItemResUtil.findTaskRes(FIXID.NEWER_TASK_BUILD_SHUYUAN);
		} else if (UIM.getDlg('culture').isShow()) {
			return;
		}
		
		if (!block) {
			HelpGuider.hideAllSpirits();
			return;
		}
		
		var target = block.getDom();
		HelpGuider.SpiritUtil.startSpirit(TQ.getDomParent(target), target, newRes);
		this._centerViewToTarget(target, newRes);
	};
});

HelpGuider.FarmGetAllResChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(res, paths){
		var newRes = {};
		TQ.dictCopy(newRes, res);
		var target = null;
		var parent = null;
		var farmBtn = UIM.getPanel('main').getSelCityTool().getBtn('myfarm');
		if ( !farmBtn.isPress() ) {
			target = farmBtn.getDom();
			parent =UIM.getPanel('main').getItems().rootmap;
		} else {
			target = UIM.getPanel('farm').getView().getCtrl('opall').getDom();
			parent = TQ.getUiBody();
			newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.getAllFarmRes, spiritArrawDir:3, 
				spiritTargetW:70, spiritTargetH:0, spiritTargetOffX:0, spiritTargetOffY:0, spiritTargetShow:0 };
		}
		
		if ( !target ) {
			HelpGuider.hideAllSpirits();
			return;
		}
		
		HelpGuider.SpiritUtil.startSpirit(parent, target, newRes);
	};
});

HelpGuider.FarmSeedChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(res, paths){
		var newRes = {};
		TQ.dictCopy(newRes, res);
		var target = null;
		var parent = null;
		var opState = UIM.getPanel('farm').getModel().getOpState();
		var farmBtn = UIM.getPanel('main').getSelCityTool().getBtn('myfarm');
		if ( !farmBtn.isPress() ) {
			target = farmBtn.getDom();
			parent =UIM.getPanel('main').getItems().rootmap;
		} else if ( this._hasEmptyBlock() ) {
			if ( UIM.getDlg('selpip').isShow() && opState != FARMOP_STATE.INPUT ) {
				UIM.getDlg('selpip').refreshNewComerSpirit();
				return;
			}
			
			if (opState != FARMOP_STATE.INPUT
				&& opState != FARMOP_STATE.SEL ) {
				target = UIM.getPanel('farm').getView().getCtrl('opinput').getDom();
				parent = TQ.getUiBody();
				newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.selPipBlock, spiritArrawDir:3, 
					spiritTargetW:50+20, spiritTargetH:54+12, spiritTargetOffX:0, spiritTargetOffY:15, spiritTargetShow:0 };
			} else if (opState == FARMOP_STATE.INPUT) {
				var block = this._getEmptyBlock();
				target = block.getDom();
				parent = TQ.getDomParent(target);
				newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.seedFarmBlock, spiritArrawDir:3, 
					spiritTargetW:100+20, spiritTargetH:54+12, spiritTargetOffX:0, spiritTargetOffY:25, spiritTargetShow:0 };
			} else {
				var block = this._getEmptyBlock();
				target = block.getDom();
				parent = TQ.getDomParent(target);
				newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.seedFarmBlock, spiritArrawDir:3, 
					spiritTargetW:100+20, spiritTargetH:54+12, spiritTargetOffX:0, spiritTargetOffY:25, spiritTargetShow:0 };
			}
		} else {
			if (opState != FARMOP_STATE.INIT) {
				target = UIM.getPanel('farm').getView().getCtrl('opinit').getDom();
				parent = TQ.getUiBody();
				newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.selInitFarmBlock, spiritArrawDir:3, 
					spiritTargetW:50+20, spiritTargetH:54+12, spiritTargetOffX:0, spiritTargetOffY:15, spiritTargetShow:0 };
			} else {
				var block = this._getFirstBlock();
				target = block.getDom();
				parent = TQ.getDomParent(target);
				newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.initFarmBlock, spiritArrawDir:3, 
					spiritTargetW:100+20, spiritTargetH:54+12, spiritTargetOffX:0, spiritTargetOffY:15, spiritTargetShow:0 };
			}
		}
		
		if ( !target ) {
			HelpGuider.hideAllSpirits();
			return;
		}
		
		HelpGuider.SpiritUtil.startSpirit(parent, target, newRes);
	};
	
	this._hasEmptyBlock = function(){
		return this._getEmptyBlock() != null;
	};
	
	this._getEmptyBlock = function(){
		return UIM.getPanel('farm').getView().getEmptyBlock();
	};
	
	this._getFirstBlock = function(){
		return UIM.getPanel('farm').getView().getFirstBlock();
	};
});

HelpGuider.InBuildPeiBingChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(res, paths){
		var newRes = {};
		TQ.dictCopy(newRes, res);
		var target = null;
		var parent = null;
		var myCityBtn = UIM.getPanel('main').getSelCityTool().getBtn('mycity');
		if ( !myCityBtn.isPress() ) {
			target = myCityBtn.getDom();
			parent =UIM.getPanel('main').getItems().rootmap;
			newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.enterMainCity, spiritArrawDir:1, 
				spiritTargetW:70, spiritTargetH:40, spiritTargetOffX:7, spiritTargetOffY:0, spiritTargetShow:0};
		} else {
			target = UIM.getPanel('main').getToolbar().getBtn('exped').getDom();
			parent = TQ.getUiBody();
		}
		
		if ( !target ) {
			HelpGuider.hideAllSpirits();
			return;
		}
		
		HelpGuider.SpiritUtil.startSpirit(parent, target, newRes);
	};
});

HelpGuider.InbuildFightChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(res, paths, armyIdx){
		var newRes = {};
		TQ.dictCopy(newRes, res);
		var target = null;
		var parent = null;
		var myCityBtn = UIM.getPanel('main').getSelCityTool().getBtn('mycity');
		if ( !myCityBtn.isPress() ) {
			target = myCityBtn.getDom();
			parent =UIM.getPanel('main').getItems().rootmap;
			newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.enterMainCityExped, spiritArrawDir:1, 
				spiritTargetW:70, spiritTargetH:40, spiritTargetOffX:7, spiritTargetOffY:0, spiritTargetShow:0};
		} else if (!this._hasGotoArmy(armyIdx)){
			target = UIM.getPanel('main').getToolbar().getBtn('exped').getDom();
			parent = TQ.getUiBody();
		} else if ( !HelpGuider.opbitmaps_['openedMiliraryDlg'] ) {
			target = UIM.getPanel('main').getToolbar().getBtn('military').getDom();
			parent = TQ.getUiBody();
			newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.seeMilitary, spiritArrawDir:3, 
				spiritTargetW:70, spiritTargetH:40, spiritTargetOffX:7, spiritTargetOffY:0, spiritTargetShow:0};
		}
		
		if ( !target ) {
			HelpGuider.hideAllSpirits();
			return;
		}
		
		HelpGuider.SpiritUtil.startSpirit(parent, target, newRes);
	};
});

HelpGuider.InbuildFirstFightChecker = Class.extern(function(){
	this.init = function(g){
		this._checker = HelpGuider.InbuildFightChecker.snew(g);
	};
	
	this.check = function(res, paths){
		this._checker.check(res, paths, 0);
	};
});

HelpGuider.InbuildSecFightChecker = Class.extern(function(){
	this.init = function(g){
		this._checker = HelpGuider.InbuildFightChecker.snew(g);
	};
	
	this.check = function(res, paths){
		this._checker.check(res, paths, 1);
	};
});

HelpGuider.InbuildActTowerFightChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(res, paths){
		if ( res.from == 'rolelevel' ) {
			var times = HDRM.getHdr('clientcfg').getHelpTipTimes(HelpGuider.HELP_TIP.ACTTOWER_FIGHT);
			if ( times > 0 ) {
				HelpGuider.hideAllSpirits();
				return;
			}
			HelpGuider.curHelpTipId_ = HelpGuider.HELP_TIP.ACTTOWER_FIGHT;
		}
		
		var newRes = {};
		TQ.dictCopy(newRes, res);
		var target = null;
		var parent = null;
		var statecityBtn = UIM.getPanel('main').getSelCityTool().getBtn('statecity');
		if ( !statecityBtn.isPress() ) {
			target = statecityBtn.getDom();
			parent =UIM.getPanel('main').getItems().rootmap;
			newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.acttowerfight, spiritArrawDir:1, 
				spiritTargetW:70, spiritTargetH:40, spiritTargetOffX:7, spiritTargetOffY:0, spiritTargetShow:0};
		} else {
			target = UIM.getPanel('statecity').getActTowerDom();
			parent = TQ.getDomParent(target);
		}
		
		if ( !target ) {
			HelpGuider.hideAllSpirits();
			return;
		}
		
		HelpGuider.SpiritUtil.startSpirit(parent, target, newRes);
	};
});

HelpGuider.InbuildRecruitSoldierChecker = HelpGuider.BaseChecker.extern(function(){
	this.check = function(res, paths){
		var newRes = {};
		TQ.dictCopy(newRes, res);
		var target = null;
		var parent = null;
		var myCityBtn = UIM.getPanel('main').getSelCityTool().getBtn('mycity');
		if ( !myCityBtn.isPress() ) {
			target = myCityBtn.getDom();
			parent =UIM.getPanel('main').getItems().rootmap;
			newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.enterMainCity2, spiritArrawDir:1, 
				spiritTargetW:70, spiritTargetH:40, spiritTargetOffX:7, spiritTargetOffY:0, spiritTargetShow:0};
		} else if (!this._hasJiBingCulture()){
			if ( UIM.getDlg('culture').isShow() ) {
				return;
			}
			
			var spec = HelpGuider.AndSpec.snew(HelpGuider.GreatLevelSpec.snew(0), HelpGuider.SameResIdSpec.snew(FIXID.COLLEGEBUILD));
			var blocks = UIM.getPanel('inbuild').getBlocksByResId(spec);
			if (blocks.length > 0) {
				target = blocks[0].getDom();
				parent = TQ.getDomParent(target);
				newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.clickLearnCulture, spiritArrawDir:3, 
					spiritTargetW:50, spiritTargetH:65, spiritTargetOffX:70, spiritTargetOffY:0, spiritTargetShow:0};
				HelpGuider.buildOpMenu.itemId = 'CULTURE';
				HelpGuider.buildOpMenu.buildId = FIXID.COLLEGEBUILD;
				HelpGuider.buildOpMenu.buildState = -1;
				this._centerViewToTarget(target, newRes);
			}
		} else {
			var spec = HelpGuider.AndSpec.snew(HelpGuider.SameResIdSpec.snew(FIXID.BARBACK), HelpGuider.GreatLevelSpec.snew(0));
			var blocks = UIM.getPanel('inbuild').getBlocksByResId(spec);
			var hasJunYing = blocks.length > 0;
			if (hasJunYing){
				target = blocks[0].getDom();
				parent = TQ.getDomParent(target);
				HelpGuider.buildOpMenu.itemId = 'SOLDIER';
				HelpGuider.buildOpMenu.buildId = FIXID.BARBACK;
				HelpGuider.buildOpMenu.buildState = -1;		
				this._centerViewToTarget(target, newRes);				
			}
		}
		
		if ( !target ) {
			HelpGuider.hideAllSpirits();
			return;
		}
		
		HelpGuider.SpiritUtil.startSpirit(parent, target, newRes);
	};
	
	this._hasJiBingCulture = function(){
		return this.g_.getImgr().getCultureLevel(FIXID.JIBINGCBUILD) > 0;
	};
});

HelpGuider.PkgUseItemChecker  = HelpGuider.BaseChecker.extern(function(){
	this.check = function(res, paths){
		var newRes = {};
		TQ.dictCopy(newRes, res);
		var target = null;
		var parent = null;
		var farmBtn = UIM.getPanel('main').getSelCityTool().getBtn('myfarm');
		if ( farmBtn.isPress() ) {
			/*
			var myCityBtn = UIM.getPanel('main').getSelCityTool().getBtn('mycity');
			target = myCityBtn.getDom();
			parent =UIM.getPanel('main').getItems().rootmap;
			newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.enterMainCity2, spiritArrawDir:1, 
				spiritTargetW:70, spiritTargetH:40, spiritTargetOffX:7, spiritTargetOffY:0, spiritTargetShow:0};
			*/
		} else {
			target = UIM.getPanel('main').getToolbar().getBtn('pkg').getDom();
			parent = TQ.getUiBody();
			newRes = {spiritSelectType:0, spiritCon:rstr.newcomerHelp.tip.enterPkg, spiritArrawDir:3, 
				spiritTargetW:70, spiritTargetH:40, spiritTargetOffX:0, spiritTargetOffY:10, spiritTargetShow:0};
		}
		
		if ( !target ) {
			HelpGuider.hideAllSpirits();
			return;
		}
		
		HelpGuider.SpiritUtil.startSpirit(parent, target, newRes);
	};
	
	this._hasJiBingCulture = function(){
		return this.g_.getImgr().getCultureLevel(FIXID.JIBINGCBUILD) > 0;
	};
});

HelpGuider.startFirstFightDemo = function(dom){
	var target = dom;
	var parent = TQ.getUiBody();
	var newRes = {spiritSelectType:99, spiritArrawDir:0, spiritCon:rstr.newcomerHelp.tip.seeFightDemo, spiritTargetOffX:20, spiritTargetOffY:10};
	HelpGuider.SpiritUtil.startSpirit(parent, target, newRes);
};

HelpGuider.firstChangeCountry = function(dom){
	var times = HDRM.getHdr('clientcfg').getHelpTipTimes(HelpGuider.HELP_TIP.CHANGE_CITY);
	if ( times > 0 ) return;
	var target = dom;
	var parent = TQ.getUiBody();
	var newRes = {spiritSelectType:99, spiritArrawDir:0, spiritCon:rstr.newcomerHelp.tip.changeCity, spiritTargetOffX:-30, spiritTargetOffY:10};
	HelpGuider.SpiritUtil.startSpirit(parent, target, newRes);
	HelpGuider.curHelpTipId_ = HelpGuider.HELP_TIP.CHANGE_CITY;
};

HelpGuider.firstAssignRolePP = function(dom, attrPP){
	var times = HDRM.getHdr('clientcfg').getHelpTipTimes(HelpGuider.HELP_TIP.ASSIGN_ROLEPP);
	if ( times >= 3 ) return;
	if ( attrPP == 0 ) return;
	var target = dom;
	var parent = TQ.getUiBody();
	var newRes = {spiritSelectType:99, spiritArrawDir:0, spiritCon:rstr.newcomerHelp.tip.changeCity, spiritTargetOffX:-30, spiritTargetOffY:10};
	HelpGuider.SpiritUtil.startSpirit(parent, target, newRes);
	HelpGuider.curHelpTipId_ = HelpGuider.HELP_TIP.ASSIGN_ROLEPP;
};

HelpGuider.firstFightOutField = function(){
	var times = HDRM.getHdr('clientcfg').getHelpTipTimes(HelpGuider.HELP_TIP.FIGHT_OUTFIELD);
	if ( times > 3 ) return;
	var outFieldBtn = UIM.getPanel('main').getSelCityTool().getBtn('outfield');
	if ( outFieldBtn.isPress() )  return;
	
	var target = outFieldBtn.getDom();
	var parent =UIM.getPanel('main').getItems().rootmap;
	var newRes = {spiritSelectType:99, spiritArrawDir:1, spiritCon:rstr.newcomerHelp.tip.fightoutfield, spiritTargetOffX:-30-129, spiritTargetOffY:100+32};
	HelpGuider.SpiritUtil.startSpirit(parent, target, newRes);
	HelpGuider.curHelpTipId_ = HelpGuider.HELP_TIP.FIGHT_OUTFIELD;
};

HelpGuider.firstClickShopBtn = function(g){
	var tip = rstr.newcomerHelp.tip.firstOpenShop;
	HelpGuider._firstClickRightSmallBtn(g, HelpGuider.HELP_TIP.OPEN_SHOPDLG, 'shop', tip, -100-103, 110);
};

HelpGuider.firstClickRankBtn = function(g){
	var tip = rstr.newcomerHelp.tip.firstOpenRank;
	HelpGuider._firstClickRightSmallBtn(g, HelpGuider.HELP_TIP.OPEN_RANKDLG, 'rank', tip, -100-103, 110);
};

HelpGuider.firstClickLetterBtn = function(g){
	var tip = rstr.newcomerHelp.tip.firstOpenLetter;
	HelpGuider._firstClickRightSmallBtn(g, HelpGuider.HELP_TIP.OPEN_LETTERDLG, 'letter', tip, -100-103, 110);
};

HelpGuider.firstClickExchangeBtn = function(g){
	var tip = rstr.newcomerHelp.tip.firstOpenExchange;
	HelpGuider._firstClickRightSmallBtn(g, HelpGuider.HELP_TIP.OPEN_EXCHANGEDLG, 'exchange', tip, -100-103, 110);
};

HelpGuider._firstClickRightSmallBtn = function(g, tipId, dlgName, tip, x, y){
	if ( !g.getImgr().isNewcomerHelpEnd() ) return;
	var times = HDRM.getHdr('clientcfg').getHelpTipTimes(tipId);
	if ( times > 2 ) return;
	if ( UIM.getDlg(dlgName).isShow() ) return;

	var btn = UIM.getPanel('main').getSmallMapBtnBar().getBtn(dlgName);
	var target = btn.getDom();
	var parent =UIM.getPanel('main').getItems().rootmap;
	var newRes = {spiritSelectType:99, spiritArrawDir:1, spiritCon:tip, spiritTargetOffX:x, spiritTargetOffY:y};
	HelpGuider.SpiritUtil.startSpirit(parent, target, newRes);
	HelpGuider.curHelpTipId_ = tipId;
};

HelpGuider.firstClickVipBtn = function(g){
	if ( !g.getImgr().isNewcomerHelpEnd() ) return;
	var times = HDRM.getHdr('clientcfg').getHelpTipTimes(HelpGuider.HELP_TIP.OPEN_VIPDLG);
	if ( times > 2 ) return;

	var tip = rstr.newcomerHelp.tip.firstOpenVip;
	var btn = UIM.getPanel('main').getItems().vipBtn;
	var target = btn.getDom();
	var parent =UIM.getPanel('main').getItems().rootmap;
	var newRes = {spiritSelectType:99, spiritArrawDir:2, spiritCon:tip, spiritTargetOffX:10-73, spiritTargetOffY:10+140-22};
	HelpGuider.SpiritUtil.startSpirit(parent, target, newRes);
	HelpGuider.curHelpTipId_ = HelpGuider.HELP_TIP.OPEN_VIPDLG;
};

HelpGuider.firstClickPayBtn = function(){
	if ( !g.getImgr().isNewcomerHelpEnd() ) return;
	var times = HDRM.getHdr('clientcfg').getHelpTipTimes(HelpGuider.HELP_TIP.OPEN_PAYDLG);
	if ( times > 2 ) return;

	var tip = rstr.newcomerHelp.tip.firstOpenPay;
	var btn = UIM.getPanel('main').getItems().rechargebtn;
	var target = btn.getDom();
	var parent =UIM.getPanel('main').getItems().rootmap;
	var newRes = {spiritSelectType:99, spiritArrawDir:2, spiritCon:tip, spiritTargetOffX:10-73, spiritTargetOffY:10+140-22-12};
	HelpGuider.SpiritUtil.startSpirit(parent, target, newRes);
	HelpGuider.curHelpTipId_ = HelpGuider.HELP_TIP.OPEN_PAYDLG;
};

HelpGuider.firstClickMyFieldBtn = function(){
	if ( !g.getImgr().isNewcomerHelpEnd() ) return;
	var times = HDRM.getHdr('clientcfg').getHelpTipTimes(HelpGuider.HELP_TIP.OPEN_MYFIELD);
	if ( times > 2 ) return;

	var tip = rstr.newcomerHelp.tip.firstOpenMyField;
	var btn = UIM.getPanel('main').getItems().myfieldsBtn;
	var target = btn.getDom();
	var parent =UIM.getPanel('main').getItems().rootmap;
	var newRes = {spiritSelectType:99, spiritArrawDir:2, spiritCon:tip, spiritTargetOffX:10-73, spiritTargetOffY:10+140-22-12+5};
	HelpGuider.SpiritUtil.startSpirit(parent, target, newRes);
	HelpGuider.curHelpTipId_ = HelpGuider.HELP_TIP.OPEN_MYFIELD;
};

HelpGuider.hideTipDlg = function(){
	if (HelpGuider.spiritTip_) {
		HelpGuider.spiritTip_.hideDlg();
	}
};

HelpGuider.hideTipDlgById = function(tipId){
	if ( tipId == HelpGuider.curHelpTipId_ ) {
		HelpGuider.hideTipDlg();
	}
};

HelpGuider.sendHelpTip = function(g, tipId){
	if ( tipId == HelpGuider.curHelpTipId_ ) {
		ClientCfgSender.sendSetHelpTip(g, tipId);
		HelpGuider.hideTipDlgById(tipId);
		HelpGuider.curHelpTipId_ = 0;
	}
};

HelpGuider.NewcomerSpirit = Class.extern(function(){
	this.init = function(g){
		this.g_ = g;
		this.dlgs_ = [];
		this.dlgCheckers_ = {};
		this.chechers_ = {};
		this.dlgCheckers_['buildopmenu'] = HelpGuider.BuildOpMenuChecker.snew(g);
		this.dlgCheckers_['mainselbuild'] = HelpGuider.SelBuildDlgChecker.snew(g);
		this.dlgCheckers_['uselistitem'] = HelpGuider.UseListItemDlgChecker.snew(g);
		this.dlgCheckers_['recruithero'] = HelpGuider.RecruitHeroDlgChecker.snew(g);
		this.dlgCheckers_['culture'] = HelpGuider.CultureDlgChecker.snew(g);
		this.dlgCheckers_['expedition'] = HelpGuider.ExpeditionDlgChecker.snew(g);
		this.dlgCheckers_['assignsoldiers'] = HelpGuider.AssignSoldiersDlgChecker.snew(g);
		this.dlgCheckers_['selpip'] = HelpGuider.SelPipDlgChecker.snew(g);
		this.dlgCheckers_['selectexpedtarget'] = HelpGuider.SelectExpedTargetDlgChecker.snew(g);
		this.dlgCheckers_['assignheros'] = HelpGuider.AssignHerosDlgChecker.snew(g);
		this.dlgCheckers_['military'] = HelpGuider.MilitaryDlgChecker.snew(g);
		this.dlgCheckers_['soldier'] = HelpGuider.SoldierDlgChecker.snew(g);
		this.dlgCheckers_['package'] = HelpGuider.PackageDlgChecker.snew(g);
			
		this.chechers_['inbuild.firstfreeblock'] = HelpGuider.InBuildFirstfreeblockChecker.snew(g);
		this.chechers_['inbuild.upbuild'] = HelpGuider.InBuildUpbuildChecker.snew(g);
		this.chechers_['inbuild.speedbuild'] = HelpGuider.InBuildSpeedBuildChecker.snew(g);
		this.chechers_['inbuild.recruithero'] = HelpGuider.InBuildRecruitHeroChecker.snew(g);
		this.chechers_['inbuild.refreshhero'] = HelpGuider.InBuildRefreshHeroChecker.snew(g);
		this.chechers_['inbuild.learnculture'] = HelpGuider.InBuildLearnCultureChecker.snew(g);
		this.chechers_['farm.getallres'] = HelpGuider.FarmGetAllResChecker.snew(g);
		this.chechers_['inbuild.peibing'] = HelpGuider.InBuildPeiBingChecker.snew(g);
		this.chechers_['inbuild.peibing2'] = HelpGuider.InBuildPeiBingChecker.snew(g);
		this.chechers_['farm.seed'] = HelpGuider.FarmSeedChecker.snew(g);
		this.chechers_['inbuild.firstfight'] = HelpGuider.InbuildFirstFightChecker.snew(g);
		this.chechers_['inbuild.secfight'] = HelpGuider.InbuildSecFightChecker.snew(g);
		this.chechers_['inbuild.firstActTowerFight'] = HelpGuider.InbuildActTowerFightChecker.snew(g);
		this.chechers_['inbuild.recruitsoldier'] = HelpGuider.InbuildRecruitSoldierChecker.snew(g);
		this.chechers_['pkg.useitem'] = HelpGuider.PkgUseItemChecker.snew(g);
			
		this.preCheckers_ = [];
		this.preCheckers_.push(HelpGuider.GetTaskAwardsChecker.snew(g));
		this.preCheckers_.push(HelpGuider.GetCityUpgradeChecker.snew(g));
		this.preCheckers_.push(HelpGuider.SubCityOpenChecker.snew(g));
			
		this.g_.regUpdater(this, this._onUpdate, 100);
		this.refreshStacks_ = [];
	};
	
	this.refreshCurNewcomerTask = function(){
		if ( this.refreshStacks_.length == 0 ) {
			this.refreshStacks_.push({type:'refresh'});
		} else if ( this.refreshStacks_[this.refreshStacks_.length-1].type != 'refresh' ) {
			this.refreshStacks_.push({type:'refresh'});
		}
	};
	
	this._updateNewcomerTask = function(res){
		for ( var i=0; i<this.preCheckers_.length; ++i ) {
			var preChecker = this.preCheckers_[i];
			if ( preChecker.check() ) return;
		}
		
		if ( !res || !res.spiritCon || res.spiritCon == '' ) {
			HelpGuider.hideSpirit();
			HelpGuider.hideSpiritRhombus();
			return;
		}
		
		var paths = res.spiritTarget.split(".");
		var checker = this.chechers_[paths[0]];
		if ( !checker ) {
			checker = this.chechers_[paths[0] + '.' + paths[1]];
		}
		if ( checker ) {
			checker.check(res, paths);
		}
	};
	
	this.onDlgOpen = function(dlgName, items){
		this.refreshStacks_.push({type:'dlgOpen', dlgName:dlgName, items:items});
	};
	
	this.onDlgClose = function(dlgName){
		this.refreshStacks_.push({type:'dlgClose', dlgName:dlgName});
	};
	
	this._refreshDlg = function(type, dlgName, items){
		this.dlgCheckers_[dlgName].check(items, type);
	};
	
	this._findDlgIdx = function(dlgName){
		TQ.find(this.dlgs_, 'name', dlgName);
		return TQ.getLastFindIdx();
	};
	
	this._onUpdate = function(){
		if ( this.refreshStacks_.length == 0 ) return;
		
		var node = this.refreshStacks_[0];
		if (node.type == 'refresh') {
			this._updateNewcomerTask(HelpGuider.SpiritUtil.getCurRes(this.g_));
		} else if (node.type == 'dlgOpen') {
			var idx = this._findDlgIdx(node.dlgName);
			if ( idx >= 0 ) this.dlgs_.splice(idx, 1);
			this.dlgs_.push({name:node.dlgName, items:node.items});
			var dlgNode = this.dlgs_[this.dlgs_.length-1];
			this._refreshDlg(node.type, dlgNode.name, dlgNode.items);
		} else if (node.type == 'dlgClose') {
			var idx = this._findDlgIdx(node.dlgName);
			if ( idx >= 0 ) this.dlgs_.splice(idx, 1);
			if ( idx == this.dlgs_.length && this.dlgs_.length > 0 ) {
				var dlgNode = this.dlgs_[this.dlgs_.length-1];
				this._refreshDlg(node.type, dlgNode.name, dlgNode.items);
			}
			if ( this.dlgs_.length == 0 ) {
				HelpGuider.getNewcomerSpirit().refreshCurNewcomerTask();
			}
		}
		
		this.refreshStacks_.splice(0, 1);
	};
});

HelpGuider.enterGame = function(g){
	UIM.getPanel('sysmsg').append(0, rstr.newcomerHelp.tip.welcome);
	if ( TQ.isIE6() || TQ.isIE7() || TQ.isIE8() ) { // low ie
		UIM.getPanel('sysmsg').append(0, rstr.newcomerHelp.tip.changeBrowser);
	}
	HelpGuider._g = g;
	g.regUpdater(HelpGuider, HelpGuider._onUpdateCommonHelpTip, 30*1000);
};

HelpGuider._onUpdateCommonHelpTip = function(){
	var tipMethods = [
		'firstClickShopBtn'
		,'firstClickRankBtn'
		,'firstClickLetterBtn'
		,'firstClickExchangeBtn'
		,'firstClickVipBtn'
		,'firstClickPayBtn'
		,'firstClickMyFieldBtn'
	];
	
	var idxs = [];
	for ( var i=0; i<tipMethods.length; ++i ) {
		idxs.push(i);
	}
	
	for ( var i=0; i<idxs.length; ++i ) {
		var index = Math.randomInt(idxs.length);
		if ( index != i ) {
			var tmp = idxs[i];
			idxs[i] = idxs[index];
			idxs[index] = tmp;
		}
	}
	
	for ( var i=0; i<idxs.length; ++i ) {
		HelpGuider[tipMethods[idxs[i]]](this._g);
	}
};