navigator = {userAgent:'NODE mobile'};
//navigator = {userAgent:'NODE'};

IS_DEBUG = true;

C_OUTFIELD_BLOCK_W = (320-1);
C_OUTFIELD_BLOCK_H = 160;
C_OUTFIELD_COL_GRIDS = 600;
C_OUTFIELD_ROW_GRIDS = 600;

image_base_url = 'images/'
TIP_PREFIX = '$';

g_platform = '3366';
g_isguest = true;
g_guestuser = '';
g_serverid = '';
g_guestsign = '';

G_ID_ASCCOMP = function(a, b){return a.id - b.id;};
G_ID_DESCCOMP = function(a, b){return b.id - a.id;};
require('./jclass.js');
require('./commutil.js');
require('./base/tqclass.js');
require('./base/jajax.js');
require('./tqTQ');
require('./unittest/testunit.js');

//ui
require('./ui/tqUI.js');
require('./ui/tqDialog.js');
require('./ui/tqTabPanel.js');
require('./ui/tqComButton.js');
require('./ui/tqList.js');
require('./ui/tqScroller.js');
require('./ui/tqCheckBox.js');
require('./ui/tqDropList.js');
require('./ui/tqMenu.js');
require('./ui/tqMessageBox.js');
require('./ui/tqPageNavigate.js');
require('./ui/tqPopPanel.js');
require('./ui/tqProgressBar.js');
require('./ui/tqSpinInput.js');
require('./ui/tqSysMsgTipsBox.js');
require('./ui/tqTooltip.js');
//res
require('./res/res_fixid.js');
require('./res/res_fixid_ex.js');
require('./res/res_string.js');
require('./res/res_uiback.js');
require('./res/res_defs_forpy.js');
require('./res/res_defs.js');
require('./res/res_all_helps.js');
if (navigator.userAgent.indexOf('mobile') < 0) {
	require('./res/res_newui_cls.js');
} else {
	require('./res/res_newui_mb_cls.js');
}
require('./res/res_ui.js');
require('./res/res_attrs.js');
require('./res/res_items.js');
require('./res/res_items_base.js');
require('./res/res_items_ex.js');
require('./res/res_efftiems_ex.js');
require('./res/res_items_builds.js');
require('./res/res_items_farms.js');
require('./res/res_inbuilds.js');
require('./res/res_images.js');
require('./res/res_classs.js');
require('./res/res_map.js');
require('./res/res_datas.js');
require('./res/res_blockposs.js');
require('./res/res_citylevelneeds.js');
require('./res/res_officials.js');
require('./res/res_herojingmai.js');
require('./res/res_items_heroskills.js');
require('./res/res_items_soldiers.js');
require('./res/res_soldiers_upd.js');
require('./res/res_items_cultures.js');
require('./res/res_cultures_upd.js');
require('./res/res_fields.js');
require('./res/res_drops.js');
require('./res/res_fieldheros.js');
require('./res/res_lineup.js');
require('./res/res_copyfields.js');
require('./res/res_effects.js');
require('./res/res_mailtemps.js');
require('./res/res_mailtemps_fact.js');
require('./res/res_acc_needgolds.js');
require('./res/res_smithy_salelist.js');
require('./res/res_force_arms.js');
require('./res/res_herosteel.js');
require('./res/res_herolevelexps.js');
require('./res/res_citydef.js');
require('./res/res_animations.js');
require('./res/res_mapobjs.js');
require('./res/res_avatarclts.js');
require('./res/res_icons.js');
require('./res/res_alli_upd_needs.js');
require('./res/res_alli_lawlight_upd.js');
require('./res/res_state_effects.js');
require('./res/res_npcs.js');
require('./res/res_tasks.js');
require('./res/res_activityval_tasks.js');
require('./res/res_shophot_tags.js');
require('./res/res_shops.js');
require('./res/res_dayact_defs.js');
require('./res/res_helps.js');
require('./res/res_exchanges.js');
require('./res/res_yd.js');
require('./res/res_sounds.js');
require('./res/res_pay_act.js');
require('./res/res_vip.js');
require('./res/res_bd.js');
require('./res/res_maprects.js');
require('./res/res_gonggao.js');

require('./res/res_init.js');

//require('./handler/tqUIMgr.js');
require('./handler/tqEntity.js');
require('./handler/tqFightResultMaker.js');

require('./manager/tqItemMgrEx.js');
require('./tqGameApp.js');
require('./handler/tqHyperLinkMgr.js');

pay_zone_id = 0;
fusion2 = {
	canvas:{getClientRect:function(){	}}
	,dialog:{pay:function(){}, buy:function(data){}}
};


g_loading = new function(){
	this.hide = function(){};
};


TestCaseHelper = Class.extern(function(){
	this.setUp = function(o){
		o.g = g_app;
		TIPM.init(o.g);
		o.mm = MMock.snew();
		o.vb = ValueBack.snew();
		this.clearAll();
		this.backRes();
		FixTimer.initOneTime(g_app);
		m_g = null;
		m_this = null;
	};
	
	this.tearDown = function(o){
		o.mm.restore();
		this.restoreRes();
		this.clearAll();
		FixTimer.clear();
	};
	
	this.clearAll = function() {
		g_app.getImgr().clearHeros();
		g_app.getImgr().clearPkgItems();
		g_app.getImgr().setCanUseSkillSteelTime(0);
		g_app.getImgr().setMoney(0);
		g_app.getImgr().getBuilds().cityBuilds[1] = [];
		g_app.getImgr().getBuilds().cityBuilds[2] = [];
		g_app.getImgr().getBuilds().cityBuilds[3] = [];
		g_app.getImgr().getBuilds().cityBuilds[4] = [];
		g_app.getImgr().getBuilds().cityBuilds[5] = [];
		g_app.getImgr().getRoleRes().attrs = {};
		g_app.getImgr().getRoleRes().level = 0;
		g_app.getImgr().getRoleRes().prestige = 0;
		g_app.getImgr().getRoleRes().cityhonor = 0;
		g_app.getImgr().getRoleRes().uid = 0;
		g_app.getImgr().getRoleRes().bdInfo = {};
		g_app.getImgr().getRoleRes().ydInfo = {};
			
		g_app.getImgr().getSoldiers().length = 0;
		g_app.getImgr().getLearningCulture().id = 0;
		g_app.getImgr().getCityRes().cres.food = 0;
		g_app.getImgr().getCityRes().cres.wood = 0;
		g_app.getImgr().getCityRes().cres.stone = 0;
		g_app.getImgr().getCityRes().cres.iron = 0;
		g_app.getImgr().getFriends().friends = [];
		g_app.getImgr().getFriends().enemys = [];
		g_app.getImgr().getFriends().groups = [];
		g_app.getImgr().getTargetsFavorite().length = 0;
		g_app.getImgr().getLineups().length = 0;
		g_app.getImgr().getTodayBattleTimes().taofa = 0;
		g_app.getImgr().getTodayBattleTimes().cuihui = 0;
		g_app.getImgr().getTodayBattleTimes().tiaoxin = 0;
		g_app.getImgr().getDefaultTeams()[0] = {id:1,lineup:0,heros:[]};
		g_app.getImgr().getDefaultTeams()[1] = {id:2,lineup:0,heros:[]};
		g_app.getImgr().getDefaultTeams()[2] = {id:3,lineup:0,heros:[]};
		g_app.getImgr().getSelfFields().list.length = 0;
		g_app.getImgr().getFightRefStates().length = 0;
		g_app.getImgr().getMyFields().length = 0;
		g_app.getImgr().getArmys().list.length = 0;
		g_app.getImgr().getArmys().samealli.length = 0;
		g_app.getImgr().getTask().tasks = [];
		g_app.getImgr().getTask().actives = [];
		g_app.getImgr().getTask().growups = [];
		g_app.getImgr().getTask().subGrowups = [];
		g_app.getImgr().getTask().roles = [];
		g_app.getImgr().getTask().everydays = [];
		g_app.getImgr().getTask().activityVals = [];
		g_app.getImgr().getTask().roleTask = {doing:{id:0, stopTime:0}, cdStopTime:0};
		g_app.getImgr().getTask().prestigeTask = {lastTime:0};
		
		g_app.getImgr().getLetterRes().all.length = 0;
		g_app.getImgr().getLetterRes().un.length = 0;
		g_app.getImgr().getLetterRes().sys.length = 0;
		g_app.getImgr().getLetterRes().com.length = 0;
		
		g_app.getImgr().getCultures().length = 0;
		g_app.getImgr().getLearningCulture().id = 0;
		g_app.getImgr().getLearningCulture().stoptime = 0;
		
		g_app.getImgr().getWears().dict = {};
			
		g_app.getImgr().getCityDefs().building.id = 0;
		g_app.getImgr().getCityDefs().building.stoptime = 0;
		g_app.getImgr().getCityDefs().building.number = 0;		
		g_app.getImgr().getCityDefs().defs = [0, 0, 0, 0, 0];
		g_app.getImgr().getTower().lineupId = 180004;
		g_app.getImgr().getTower().soldiers = [{resid:0,number:0},{resid:0,number:0},{resid:0,number:0},{resid:0,number:0},{resid:0,number:0}];
		g_app.getImgr().getSalveInfo().max = 0;
		g_app.getImgr().getRoleStates().length = 0;
		g_app.getImgr().getFightDemos().length = 0;
		g_app.getImgr().getMyAlliance().clear();
		g_app.getImgr().getRoleRes().alliance = {uid:0,name:'--'};
		g_app.getImgr().getSaveForces().length = 0;
		g_app.getImgr().getSaveForces().push({type:1, lineup:0, heros:[]});
		g_app.getImgr().getSaveForces().push({type:2, lineup:0, heros:[]});
		g_app.getImgr().getSaveForces().push({type:3, lineup:0, heros:[]});
		g_app.getImgr().getActTower().baseInfo.maxLayer = 0;
		g_app.getImgr().setGold(0);
		g_app.getImgr().getRoleRes().vip = 0;
		
		g_app.getImgr().getAutoBuild().starting = 0;
		g_app.getImgr().getAutoBuild().max = 0;
		g_app.getImgr().getAutoBuild().list.length = 0;
		
		g_app.getActorMgr().clear();
			
		g_app.getImgr().getShopSales().length = 0;
		
		g_app.getImgr().getWorldBoss().events.length = 0;
		g_app.getImgr().getWorldBoss().today = {times:0, maxTimes:3, gotGift:0, gotPRankGift:0, guwu:0, maxGuwu:10, gotCRankGift:0};
		g_app.getImgr().getWorldBoss().prank = [];
		g_app.getImgr().getWorldBoss().arank = [];
		g_app.getImgr().getWorldBoss().crankweek = 0;
		g_app.getImgr().getWorldBoss().crank = [];
		g_app.getImgr().getWorldBoss().alligifts = [];
		g_app.getImgr().getMyAlliance().copyAuction({items:[{_r:1}]});
		g_app.getImgr().getRoleRes().name = '--';
		
		g_app.clearSendMsg();
		//UIM.clearDlgs();
		//UIM.clearPanels();
		HDRM.clear();
		g_app.getGUI().getSysMsgTip().clear();
		g_app.getGUI().hideMsgBox();
		g_app.clearRegEvent();
		DragMapChecker.endDrag();
		TestCaseSysTip.clearTip();

		m_g = null;
	};
	
	this.backRes = function(){
		this.res_efftiems_ex_ = res_efftiems_ex;
		this.res_citydefs_ = res_citydefs;
		this.res_inbuild_ = res_inbuild;
		this.res_items_builds_ = res_items_builds;
		this.res_copyfields_ = res_copyfields;
		this.res_drops_ = res_drops;
		this.res_items_ = res_items;
		this.res_items_base_ = res_items_base;
		this.res_items_ex_ = res_items_ex;
		this.res_fields_level_ = res_fields_level;
		this.res_items_cultures_ = res_items_cultures;
		this.res_acc_needgolds_ = res_acc_needgolds;
		this.res_items_heroskills_ = res_items_heroskills;
		this.res_smithy_salelist_ = res_smithy_salelist;
		this.res_fields_ = res_fields;
		this.res_npcfields_ = res_npcfields;
		this.res_citydef_ = res_citydef;
		this.res_lineup_ = res_lineup;
		this.res_mapobjs_ = res_mapobjs;
		this.res_animations_ = res_animations;
		this.res_attrs_ = res_attrs;
		this.alert_ = alert;
		this.res_avatarclts_ = res_avatarclts;
		this.res_role_icons_ = res_role_icons;
		this.res_state_effects_ = res_state_effects;
		this.res_tasks_ = res_tasks;
		this.res_exchanges_ = res_exchanges;
	};
	
	this.restoreRes = function(){
		res_efftiems_ex = this.res_efftiems_ex_;
		res_citydefs = this.res_citydefs_;
		res_inbuild = this.res_inbuild_;
		res_items_builds = this.res_items_builds_;
		res_copyfields = this.res_copyfields_;
		res_drops = this.res_drops_;
		res_items = this.res_items_;
		res_items_base = this.res_items_base_;
		res_items_ex = this.res_items_ex_;
		res_fields_level = this.res_fields_level_;
		res_items_cultures = this.res_items_cultures_;
		res_acc_needgolds = this.res_acc_needgolds_;
		res_items_heroskills = this.res_items_heroskills_;
		res_smithy_salelist = this.res_smithy_salelist_;
		res_fields = this.res_fields_;
		res_npcfields = this.res_npcfields_;
		res_citydef = this.res_citydef_;
		res_lineup = this.res_lineup_;
		res_mapobjs = this.res_mapobjs_;
		res_animations = this.res_animations_;
		res_attrs = this.res_attrs_;
		res_avatarclts = this.res_avatarclts_;
		res_role_icons = this.res_role_icons_;
		res_state_effects = this.res_state_effects_;
		res_tasks = this.res_tasks_;
		res_exchanges = this.res_exchanges_;
		res_test_items = [];
		alert = this.alert_;
	};
}).snew();

TestCaseCondition = Class.extern(function(){
	this.setPreCond = function(hero, p) {
		this.hero = hero;
		
		if ( p.todaybattletimes ) {
			var battleTimes = g_app.getImgr().getTodayBattleTimes();
			TQ.dictCopy(battleTimes, p.todaybattletimes);
		}
		if ( p.herolevel ) {
			this.hero.level = p.herolevel;
		}
		if ( p.lineups ) {
			var lineups = g_app.getImgr().getLineups();
			lineups.length = 0;
			for ( var i in p.lineups ) {
				lineups.push( p.lineups[i] );
			}
		}
		if ( p.heroprof ) {
			this.hero.prof = p.heroprof;
		}
		if ( p.herocurtacticskill ) {
			this.hero.curtskill = p.herocurtacticskill;
		}
		if ( p.item ) {
			g_app.getImgr().addItem({id:1,gpos:1,resid:p.item.id, number:p.item.num, itemres:ItemResUtil.findItemres(p.item.id) });
		}
		if ( p.heros ) {
			g_app.getImgr().getHeros().list = p.heros;
		}
		if ( p.heroskills ) {
			this.hero.skills = p.heroskills;
		}
		if ( p.skillsteel ) {
			this.hero.skillsteel = p.skillsteel;
		}
		if ( p.canusesstime != undefined ) {
			g_app.getImgr().setCanUseSkillSteelTime(p.canusesstime);
		}
		if ( p.builds != undefined ) {
			var builds = g_app.getImgr().getBuilds();
			builds.cityBuilds[1] = p.builds;
		}
		if ( p.roleattrs ) {
			for ( var i in p.roleattrs ) {
				var a = p.roleattrs[i];
				var attr = g_app.getImgr().getRoleAttr(a.id);
				if ( attr ) attr.val = a.val;
				else g_app.getImgr().addRoleAttr(a);
			}
		}
		if ( p.soldiers ) {
			var soldiers = g_app.getImgr().getSoldiers();
			soldiers.length = 0;
			for ( var i in p.soldiers ) {
				soldiers.push( p.soldiers[i] );
			}
		}
		if ( p.cultures ) {
			var cultures = g_app.getImgr().getCultures();
			cultures.length = 0;
			for ( var i in p.cultures ) {
				cultures.push( p.cultures[i] );
			}
		}
		if ( p.money != undefined ) {
			g_app.getImgr().setMoney(p.money);
		}
		if ( p.food != undefined ) {
			g_app.getImgr().getCityRes().cres.food = p.food;
		}
		if ( p.wood != undefined ) {
			g_app.getImgr().getCityRes().cres.wood = p.wood;
		}
		if ( p.stone != undefined ) {
			g_app.getImgr().getCityRes().cres.stone = p.stone;
		}
		if ( p.iron != undefined ) {
			g_app.getImgr().getCityRes().cres.iron = p.iron;
		}
		if ( p.learningculture ) {
			var learningculture = g_app.getImgr().getLearningCulture();
			learningculture.id = p.learningculture.id; 
			learningculture.stoptime = p.learningculture.stoptime; 
		}
		if ( p.rolepos ) {
			var roleres = g_app.getImgr().getRoleRes();
			roleres.pos.x = p.rolepos.x;
			roleres.pos.y = p.rolepos.y;
		}
	};
}).snew();


TestCaseSysTip = TestCase.extern(function(){
	this.getSystip = function(){
		return g_app.getGUI().getSysMsgTip().isShow() ?  g_app.getGUI().getSysMsgTip().getMsg() : '' ;
	};
	
	this.clearTip =  function(){
		g_app.getGUI().getSysMsgTip().clear()
	};
	
	this.hasSystip = function(){
		return g_app.getGUI().getSysMsgTip().isShow() && isNotInclude( g_app.getGUI().getSysMsgTip().getMsg(), 'undefined' );
	};
	
	this.eqSystipStr = function(str){
		if ( !this.hasSystip() ) {
			return false;
		}
		
		return g_app.getGUI().getSysMsgTip().getMsg() == str;
	};
	
}).snew();


log = function(msg){
	print(msg);
};

alert = function(msg){
	throw new Error('<alert>: '+msg);
};

MockMouseEvent = Class.extern(function(){
	this.init = function(x, y){
		this.pageX = x;
		this.pageY = y;
	};
});

MockPanel = Class.extern(function(){
	this.init = function(g){
	};
});


MockSysMsgTipsBox = Class.extern(function(){
	this.init = function(g){
		this.isshow = false;
		this.type = 0;
		this.msg = '';
	};
	
	this.show = function(type, msg){
		this.type = type;
		this.msg = msg;
		this.isshow = true;
	};
	
	this.getType = function(){
		return this.type;
	};
	
	this.getMsg = function(){
		return this.msg;
	};
	
	this.isShow = function(){
		return this.isshow;
	};
	
	this.clear = function(){
		this.type = 0;
		this.msg = '';
		this.isshow = false;	
	};
});


MockGlobalPub = Class.extern(function(){
	var m_this=null;
	this.eventregs = {};
	this.sendmsg = '';
	this.svrtimems = 0;
	this.updater = [];
	this.curTimeMs = 0;
	this.actormgr = null;
	this.winResizer = null;
	this.state_ = 0;

	this.init = function(){
		m_this = this;
		this.sysmsgtipbox = MockSysMsgTipsBox.snew();
		this.ui = new UI(this);
		this.ui.sysMsgTips = function(type,msg) { m_this.sysmsgtipbox.show(type, msg); };
		this.ui.getSysMsgTip = function() { return m_this.sysmsgtipbox; };
		this.imgr = new ItemMgrEx(this);
	};
	
	this.getWinSizer = function() {
		if ( !this.winResizer ) {
			this.winResizer = WindowResizer.snew(this);
		}
		return this.winResizer;
	};
	
	this.getAnimMgr = function(){
		if ( !this.animMgr ) {
			this.animMgr = PngAnimMgr.snew(this);
		}
		return this.animMgr;
	};
	
	this.getActorMgr = function(){
		if ( !this.actormgr ) {
			this.actormgr = ActorManager.snew(this);
		}
		return this.actormgr;
	};
	
	this.getGUI = function(){
		return this.ui;
	};
	
	this.getImgr = function(){
		return this.imgr;
	};
	
	this.clearRegEvent = function(){
		this.eventregs = {};
	};
	
	this.setState = function(state){
		this.state_ = state;
	};
	
	this.getState = function(){
		return this.state_;
	};
	
	this.regEvent = function(eid, sid, self, fun){
		var key = eid+'.'+sid;
		var enode = null;
		enode = this.eventregs[key];
		if ( !enode ) {
			this.eventregs[key] = [];
			enode = this.eventregs[key];
		}
		enode.push({self:self, fun:fun});
	};
	
	this.send = function(key, msg){
		this.sendmsg = msg;
	};
	
	this.clearSendMsg = function(){
		this.sendmsg = '';
	};
	
	this.getSendMsg = function(){
		return this.sendmsg;
	};
	
	this.getRegEventNode = function(eid, sid){
		var key = eid + '.' + sid;
		return this.eventregs[key];
	};
	
	this.sendEvent = function(e){
		var enode = this.getRegEventNode(e.eid, e.sid);
		if ( enode ) {
			this._sendNodeEvent(enode, e);
		}
	};
	
	this.pendReplaceEvent = function(e){
		this.sendEvent(e);
	};
	
	this.getSig = function(){
		return 'jsunit123';
	};
	
	this._sendNodeEvent = function(enode, e){
		for ( var i=0; i<enode.length; ++i ) {
			if ( enode[i].fun.call(enode[i].self, e) == EVENT_RET_BREAK ) break;
		}
	};
	
	this.regSendDelay = function(key, delaytime){
	};

	this.getEntityfactory = function(){
		if ( !this.m_enityFactory ) {
			this.m_enityFactory = new EntityFactory(this);
		}
		return this.m_enityFactory;
	};
	
	this.regUpdater = function(self, fun, timeMs){
		if ( _hasRegUpdater(self, fun) ) return;
		
		this.updater.push({self:self, fun:fun, interval:timeMs, lasttime:0});
	};
	
	this.unregUpdater = function(self, fun){
		for ( var i=0; i<this.updater.length; ++i ){
			if ( this.updater[i].self == self && this.updater[i].fun == fun ){
				TQ.removeElement(this.updater, i);
				break;
			}
		}
	};
	
	this.clearUpdater = function(){
		this.updater = [];
	};
	
	this.update = function(){
		for ( var i=0; i<this.updater.length; ++i) {
			var node = this.updater[i];
			if ( (this.curTimeMs - node.lasttime) >= node.interval ) {
				node.fun.call(node.self, this.curTimeMs);
				node.lasttime = this.curTimeMs;
			}
		}
	};
	
	this.setCurTimeMs = function(curTimeMs){
		this.curTimeMs = curTimeMs;
		this.svrtimems = this.curTimeMs;
	};
	
	this.getCurTimeMs = function(){
		return this.curTimeMs;
	};
	
	this.getSvrTimeMs = function(){
		return this.svrtimems;
	};
	
	this.getSvrTimeS = function(){
		return this.svrtimems/1000;
	};
	
	this.setSvrTimeS = function(svrtime){
		this.svrtimems = svrtime*1000;
		this.curTimeMs = this.svrtimems;
	};

	var _hasRegUpdater = function(self, fun){
		for ( var i=0; i<m_this.updater.length; ++i ){
			if ( m_this.updater[i].self == self && m_this.updater[i].fun == fun ){
				return true;
			}
		}
		return false;
	};	
});

CoreDialog = Class.extern(function(){
	var m_isShow = false;
	this.init = function(){
		this.zIndex = 0;
	};
	
	this.setZIndex = function(zIndex){
		this.zIndex = zIndex;
	};
	
	this.getZIndex = function(){
		return this.zIndex;
	};
	
	this.setShow = function(isShow){
		m_isShow = isShow;
	};
	
	this.isShow = function(){
		return m_isShow;
	};
});


MockDialog = Class.extern(function(){
	this.init = function(){
		this.isshow = false;
		this.core = CoreDialog.snew();
	};
	
	this.getCore = function(){
		return this.core;
	};
	
	this.openDlg = function(){
		this.isshow = true;
	};
	
	this.closeDlg = function(){
		this.isshow = false;
	};
	
	this.isShow = function(){
		return this.isshow;
	};
	
	this.toggle = function(){
		this.isshow = !this.isshow;
	};
	
	this.setPosition = function(pos){
	};
	
	this.setCaller = function(){
	};
	
	this.setUpCaller = function(){
	};
	
	this.show = function(){
	};
	
	this.hide = function(){
	};
});

MockBlinkingCtrl = Class.extern(function(){
	var m_start = false;
	this.start = function(interval){
		m_start = true;
	};
	
	this.stop = function(){
		m_start = false;
	};
	
	this.isStart = function(){
		return m_start;
	};
});

MockFightDemoDlg = Class.extern(function(){
	this.hideCaller_ = null;
	this.armyId_ = null;
	this.fightId_ = null;
	this.isShow_ = false;
	this.setHideCaller = function(caller) {
		this.hideCaller_ = caller;
	};
	
	this.getHideCaller = function(){
		return this.hideCaller_;
	};
	
	this.openDlg = function(armyId, fightId) {
		this.armyId_ = armyId;
		this.fightId_ = fightId;
		this.isShow_ = true;
	};
	
	this.hideDlg = function(){
		this.hideCaller_.caller.call(this.hideCaller_.self);
	};
	
	this.isShow = function(){
		return this.isShow_;
	};
});


MockDom = function(){
	this.childNodes = [];
	this.parentNode = null;
	this.props={};
	this.style={};
	this.tagName='';
	this.innerHTML='';
	this.innerText='';
	this.offsetWidth = 0;
	this.className = '';
	this.firstChild = null;
	this.lastChild = null;
	this.value = '';
	
	this.fireEvent = function(evtName, e){
		if ( this['on'+evtName] != undefined ) {
			this['on'+evtName](e);
		}
	};
	
	this.init = function(tname){
		this.tagName= tname ? tname : 'div';
	};
	
	this.reinit = function() {
		this.childNodes = [];
		this.parentNode = null;
		this.firstChild = null;
		this.lastChild = null;		
		this.props={};
		this.style={};
		this.innerHTML='';
		this.innerText='';
		this.offsetWidth = 0;
		this.className = '';
	};
	
	this.appendChild = function(subdom){
		this.childNodes.push(subdom);
		subdom.parentNode = this;
		this.firstChild = ( this.childNodes.length > 0 ) ? this.childNodes[0] : null;
		this.lastChild = ( this.childNodes.length > 0 ) ? this.childNodes[this.childNodes.length-1] : null;
	};
	
	this.removeChild = function(subdom){
		for ( var i=0; i<this.childNodes.length; ++i ){
			if ( this.childNodes[i] != subdom ) continue;
			
			for ( var j=i; j<this.childNodes.length-1; ++j ) {
				this.childNodes[i] = this.childNodes[i+1];
			}
			
			this.childNodes.length = this.childNodes.length - 1;
			break;
		}
		
		this.lastChild = ( this.childNodes.length > 0 ) ? this.childNodes[this.childNodes.length-1] : null;
	};
	
	this.setAttribute = function(key,val){
		this.props[key] = val;
	};
	
	this.focus = function() {
	};
	
	this.init.apply(this, arguments);
};

MockDomEx = Class.extern(MockDom);

document = MockDomEx.extern(function(){
	this.firstHead = new MockDom('div');
	this.body = new MockDom('body');
	this.doms = [];
	this.elems = {};
	this.documentElement = {};
	this.documentElement['onmouseup'] = {};
	this.createElement = function(tag){
		return new MockDom(tag);
	};
	
	this.getElementById = function(id){
		if ( !this.elems[id] ) {
			this.elems[id] = new MockDom('div');
		}
		return this.elems[id];
	};
	
	this.getElementsByTagName = function(tag){
		if ( tag == 'head' ) {
			return [this.firstHead];
		}
		else {
			return null;
		}
	};
}).snew();

window = MockDomEx.extern(function(){
	this.event = {type:'windowEvent'};
	
	this.init = function(){
		this.obj = null;
	};
	
	this.setTimeout = function(obj, delay) {
		obj.call();
	};
	
	this.setInterval = function(obj, delay){
		this.obj = obj;
		obj.call();
		return Math.random();
	};
	
	this.clearInterval = function(hdr) {
		this.obj = null;
	};
	
	this.updateTimer = function(){
		if ( this.obj ) this.obj.call();
	};
	
	this.open = function(){
	};
}).snew();

MethodMock = Class.extern(function(){	
	this.init = function() {
		this.nodes = [];
	};
	
	this.mock = function(obj, methodName, newMethod){
		if (obj == null) {
			alert('obj is null');
		}
		this.nodes.push({obj:obj, methodName:methodName, method:obj[methodName]});
		obj[methodName] = newMethod;
	};
	
	this.restore = function(){
		for ( var k in this.nodes ) {
			var node = this.nodes[k];
			node.obj[node.methodName] = node.method;
		}
		this.nodes = [];
	};
});

MMock = Class.extern(function(){	
	this.init = function() {
		this.nodes = [];
		this.walkLog = '';
		this.params = {};
	};
	
	this.travelMock = function(obj, methodName, rt, method) {
		this.mock(obj, methodName, rt, method, 'travel');
	};
	
	this.nologMock = function(obj, methodName, rt, method){
		this.mock(obj, methodName, rt, method, 'nolog');
	};
	
	this.mock = function(obj, methodName, rt, method, travelFlag) {
		if ( !obj ) {
			alert('obj is null');
		}
		
		var alias = methodName.split(':');
		methodName = alias[0];
		var methodAlias = (alias.length == 2) ? alias[1] : alias[0];
		
		if ( (!obj[methodName])  || (typeof obj[methodName]  != 'function') ) {
			alert('mock error method : ' + methodName );
		}
		
		var originalMethod = obj[methodName];
		this.nodes.push({obj:obj, methodName:methodName, method:obj[methodName]});
		
		this.params[methodName] = {};
		var mm = this;
		
		var newMethod = function() {
			var methodNameTime = methodAlias + '.0';
			for ( var i=0; ; ++i ) {
				methodNameTime = methodAlias + '.' + i;
				if ( !mm.params[methodNameTime] ) {
					break;
				}
			}
			mm.params[methodNameTime] = [];
			mm.params[methodAlias] = [];
			
			mm.params[methodNameTime + '.self'] =obj;
			mm.params[methodAlias + '.self'] = obj;
			
			for ( var i=0; i<arguments.length; ++i ) {
				mm.params[methodNameTime].push( arguments[i] );
				mm.params[methodAlias].push( arguments[i] );
			}
			
			if ( !travelFlag || travelFlag != 'nolog' ) { 
				if (mm.walkLog != '' ) {
					mm.walkLog += ',';
				}
				mm.walkLog += methodAlias;
			}
			
			var args = arguments;
			var _callOriginalMethod = function(){
				if (!travelFlag || travelFlag != 'travel' ) return null;
				
				
				return originalMethod.apply(obj, args);
			};
			
			if (method) {
				return method.apply(this, arguments);
			}
			
			var originalRt = _callOriginalMethod();
			if ( !isNull(originalRt) ) {
				return originalRt;
			}
			
			if ( rt ) {
				return rt[0];
			}
		};
		
		obj[methodName] = newMethod;
	};
	
	this.clear = function(){
		this.walkLog = '';
		this.params = {};
	};
	
	this.restore = function(){
		for ( var k in this.nodes ) {
			var node = this.nodes[k];
			node.obj[node.methodName] = node.method;
		}
		this.nodes = [];
	};
});

ValueBack = Class.extern(function(){	
	this.init = function(){
		this.nodes = [];
	};
	
	this.replace = function(obj, valName, newVal){
		if ( !obj ) {
			alert('obj is null');
		}
		
		this.nodes.push(this.nodes, {obj:obj, valName:valName, originVal:obj[valName]});
		obj[valName] = newVal;
	};
	
	this.restore = function(self){
		for (k in this.nodes){
			var node = nodes[k];
			node.obj[node.valName] = node.originVal;
		}
		this.nodes = [];
	};
});


g_app = MockGlobalPub.snew();
IMG.setGameObj(g_app);
HyperLinkMgr.initOneTime(g_app);
