/*******************************************************************************/
/** 角色方向定义
           4   
	      |   
	3 ------- 1
           |  
           2
*/
ACTOR_ACTS_NAMEID = {
	'stand':1
	,'attack':2
	,'mattack':2
	,'walk':3
	,'hurt':4
	,'die':5
};

EffectContainer = Class.extern(function(){
	//EffectContainer-unittest-start
	var m_effects = [];
	this.add = function(effect){
		m_effects.push(effect);
	};
	
	this.remove = function(effectUId){
		var spec = function(findUID) {
			this.isSatisfiedBy = function(effect) {
				return effect.getId() == findUID;
			}; 
		};
		
		var effect = TQ.find(m_effects, null, null, new spec(effectUId));
		if ( effect ) {
			effect.destory();
			m_effects.splice(TQ.getLastFindIdx(), 1);
		}
	};
	
	this.update = function(zIndex, pos){
		for ( var i=0; i<m_effects.length; ++i ) {
			var effect = m_effects[i];
			effect.setZIndex(zIndex);
			effect.setPosition(pos);
			effect.play();
		}
	};
	
	this.release = function(){
		for ( var i=0; i<m_effects.length; ++i ) {
			m_effects[i].destory();
		}
		m_effects = [];
	};
	//EffectContainer-unittest-end
});

NullProgressBar = Class.extern(function(){
	var m_curVal = 0;
	var m_maxVal = 0;
	this.isNull = true;
	this.setPos = function(pos){};
	this.setZOrder = function(zIndex){};
	this.setVal = function(val){m_curVal=val;};
	this.getVal = function(){return m_curVal;};
	this.setMaxVal = function(val){m_maxVal = val;};
	this.getMaxVal = function(){return m_maxVal;};
});

Actor = Class.extern(function(){
	//Actor-unittest-start
	var C_BASE_Z = 2000;
	var C_HPBAR_W = 45;
	var C_HPBAR_H = 5;
	var C_HPBAR_TOP_Y = 60;
	var C_HPBAR_OFFSET_Z = 10;
	
	var m_this = null;
	var m_g = null;
	var m_id = null;
	var m_type = null;
	var m_name = '';
	
	var m_parent = null;
	var m_resId = null;
	var m_actionId = null;
	var m_dir = null;
	
	var m_avatarRes = null;
	var m_actionName = null;
	var m_actionRes = null;
	
	var m_pos = {x:0, y:0};
	var m_state = NullState;
	var m_anim = NullPngAnim.snew(0);
	var m_effectContainer = EffectContainer.snew();
	var m_hpbar = NullProgressBar.snew();
	var m_observer = null;//function(){};
	var m_unitHP = 1;
	var m_campName = '';
	var m_icon = 0;
	
	this.init = function(g){
		m_this = this;
		m_g = g;
		m_hpbar.setMaxVal(100);
		m_hpbar.setVal(100);
	};
	
	this.setParent = function(parentDom){
		m_parent = parentDom;
	};
	
	this.getParent = function(){
		return m_parent;
	};
	
	this.setId = function(id){
		m_id = id;
	};
	
	this.getId = function(){
		return m_id;
	};
	
	this.setType = function(type){
		m_type = type;
	};
	
	this.getType = function(){
		return m_type;
	};
	
	this.setName = function(name){
		m_name = name;
	};
	
	this.getName = function(){
		return m_name;
	};
	
	this.setCampName = function(campName){
		m_campName = campName;
	};
	
	this.getCampName = function(){
		return m_campName;
	};
	
	this.setIcon = function(icon){
		m_icon = icon;
	};
	
	this.getIcon = function(){
		return m_icon;
	};
	
	this.isHero = function(){
		return m_type == ACTOR_TYPE.HERO;
	};
	
	this.isDef = function(){
		return m_type == ACTOR_TYPE.DEF;
	};
	
	this.getEffectContainer = function(){
		return m_effectContainer;
	};
	
	this.setResId = function(resId){
		m_resId = resId;
	};
	
	this.getResId = function(){
		return m_resId;
	};
	
	this.setDirection = function(dir){
		m_dir = dir;
		_loadAvatar();
	};
	
	this.getDirection = function(){
		return m_dir;
	};
	
	this.setPosition = function(pos){
		m_pos.x = pos.x;
		m_pos.y = pos.y;
		_updateAvatarPos();
	};
	
	this.getPosition = function(){
		return m_pos;
	};
	
	this.getZIndex = function(){
		return C_BASE_Z + m_pos.y; 
	};
	
	this.setAction = function(actName) {
		m_actionId = ACTOR_ACTS_NAMEID[actName];
		_loadAvatar();
	};
	
	this.setState = function(state){
		m_state.end();
		m_state = state;
		m_state.start();
	};
	
	this.getAnim = function(){
		return m_anim;
	};
	
	this.setObserver = function(ob){
		m_observer = ob;
	};
	
	this.isIdle = function(){
		return m_state.isIdle();
	};
	
	this.setHP = function(maxhp, hp){
		m_hpbar.setMaxVal(maxhp);
		m_hpbar.setVal(hp);
	};
	
	this.getMaxHP = function(){
		return m_hpbar.getMaxVal();
	};
	
	this.getHP = function(){
		return m_hpbar.getVal();
	};
	
	this.setUnitHP = function(uhp){
		m_unitHP = uhp;
	};
	
	this.getUnitHP = function(){
		return m_unitHP;
	};
	
	this.subHP = function(subVal){
		if ( subVal <= 0 ) return;
		
		var curVal = m_hpbar.getVal();
		var val = Math.max(0, curVal - subVal);
		m_hpbar.setVal(val);
		m_observer(m_id, 'subhp', curVal - val );
	};
	
	this.addHP = function(addVal){
		if ( addVal <= 0 ) return;
		
		var maxVal = m_hpbar.getMaxVal();
		var curVal = m_hpbar.getVal();
		var val = Math.min(maxVal, curVal + addVal);
		m_hpbar.setVal(val);
		m_observer(m_id, 'addhp', val - curVal);
	};
	
	this.die = function(){
		m_observer(m_id, 'die');
		m_effectContainer.release();
	};
	
	this.update = function(delta){
		_updateAvatarPos();
		m_state.update();
	};
	
	this.destory = function(){
		if ( !m_hpbar.isNull ) {
			m_g.getEntityfactory().freePBar(m_hpbar);
			m_hpbar = NullProgressBar.snew();
		}
		m_state.end();
		m_anim.stop();
		m_effectContainer.release();
	};
	
	var _loadAvatar = function(){
		if ( !_isInited() ) return;
		
		_createHPBar();
	
		if ( m_anim.getId() == m_g.getAnimMgr().makeAvatarAnimId(m_resId, m_dir, m_actionId) ) {
			return;
		}
		
		m_anim.stop();
		m_anim = m_g.getAnimMgr().allocAvatar(m_this.getResId(), m_dir, m_actionId, m_parent);
		m_anim.setPosition(m_pos);
		m_anim.play();
	};
	
	var _updateAvatarPos = function(){
		m_anim.setPosition(m_pos);
		var zIndex = C_BASE_Z + m_pos.y;
		m_anim.setZIndex(zIndex);
		m_effectContainer.update(zIndex, m_pos);
		m_hpbar.setPos({x:m_pos.x - C_HPBAR_W/2,  y:m_pos.y-C_HPBAR_TOP_Y});
		m_hpbar.setZOrder(zIndex + C_HPBAR_OFFSET_Z);
	};
	
	var _isInited = function(){
		if ( isNull(m_parent) ) return false;
		if ( isNull(m_resId) ) return false;
		if ( isNull(m_actionId) ) return false;
		if ( isNull(m_dir) ) return false;
		return true;
	};
	
	var _createHPBar = function() {
		if ( !m_hpbar.isNull ) return;
		if ( m_type != ACTOR_TYPE.SOLDIER) return;
		
		var maxVal = m_hpbar.getMaxVal();
		var curVal = m_hpbar.getVal();
		m_hpbar = m_g.getEntityfactory().allocPBar(m_parent);
		m_hpbar.setSize({cx:C_HPBAR_W,cy:C_HPBAR_H});
		
		m_hpbar.setBarBorder( IMG.makeImg('comm/perbarbak45.gif') );
		m_hpbar.setBarImage( IMG.makeImg('comm/perbar45.gif') );
		m_hpbar.setZOrder(0);
		m_hpbar.setVal(curVal);
		m_hpbar.setMaxVal(maxVal);
	};
	//Actor-unittest-end
});

ActorManager = Class.extern(function(){
	//ActorManager-unittest-start
	var m_actors = [];
	var m_mainWallId = 0;
	this.init = function(g){};
		
	this.add = function(actor){
		m_actors.push(actor);
	};
	
	this.getById = function(actorId) {
		if ( isNull(actorId) ) return null;
		
		var pos = _findActorPos(actorId);
		if ( pos < 0 ) return null;
		return m_actors[pos];
	};
	
	this.remove = function(actor) {
		actor.destory();
		var pos = _findActorPos(actor.getId());
		m_actors.splice(pos, 1);
	};
	
	this.clear = function() {
		for ( var i=0; i<m_actors.length; ++i ) {
			m_actors[i].destory();
		}
		m_actors = [];
	};
	
	this.getCount = function(){
		return m_actors.length;
	};
	
	this.getByIdx = function(idx){
		return m_actors[idx];
	};
	
	this.update = function(){
		for ( var i=0; i<m_actors.length; ++i ) {
			m_actors[i].update();
		}
	};
	
	this.getMainWallId = function(){
		return m_mainWallId;
	};
	
	this.setMainWallId = function(mainWallId){
		m_mainWallId = mainWallId;
	};
	
	var _findActorPos = function(actorId) {
		for ( var i=0; i<m_actors.length; ++i ) {
			if (m_actors[i].getId() == actorId) {
				return i;
			}
		}
		return -1;
	};
	//ActorManager-unittest-end
});

FightMapDlg = Class.extern(function(){
	//FightMapDlg-unittest-start
	var m_g = null;
	var m_this = null;
	var m_dlg = null;
	var m_items = {};
	var m_showFight = null;
	var m_sizer = null;
	var m_hideCaller = null;
		
	this.init = function(g) {
		m_g = g;
		m_this = this;
	};
	
	this.openDlg = function(armyId, fightId, append){
		if ( !m_g.getImgr().getFightDemoRounds(armyId, fightId) ) {
			m_g.getGUI().msgBox(rstr.comm.msgts, rstr.fightMapDlg.notFindFightDemo, MB_F_CLOSE, null);
			return;
		}
		_initDlg();
		_showDlg();
		_initInfo(armyId, fightId, append);
	};
	
	this.resize = function(size){
		if ( m_dlg && m_dlg.isShow() ) {
			m_sizer.resize(m_dlg, m_items, size);
		}
	};
	
	this.setHideCaller = function(caller){
		m_hideCaller = caller;
	};
	
	var _initDlg = function(){
		if ( m_dlg ){
			return;
		}
		
		_createDlg();
		_createMapDlgSize();
		_createRoleItemsByTmpl();
		_createShowFight();
		_setCaller();
	};
	
	var _createDlg = function(){
		m_dlg = Dialog.snew(m_g,{modal:false, uiback:uiback.dlg.noborder, pos:{x:0, y:0} });
		m_g.getGUI().initDlg(m_dlg, uicfg.military.fightmapdlg, m_items);
	};
	
	var _createMapDlgSize = function(){
		m_sizer = FightMapDlgSizer.snew(m_g);
	};
	
	var _createRoleItemsByTmpl = function(){
		var camps = ['attacker', 'defender'];
		var roleInfoTmpls = [uicfg.military.fightmapdlg.t_[0], uicfg.military.fightmapdlg.t_[2]]; 
		for ( var i=0; i<camps.length; ++i ) {
			var campItem = m_items[camps[i] + 'Role'];
			campItem.items = {};
			m_g.getGUI().buildDomItems(campItem, roleInfoTmpls[i], null, campItem.items);
		}
	};
	
	var _createShowFight = function(){
		m_showFight = ShowFight.snew(m_g, m_dlg, m_items, m_sizer);
	};
	
	var _setCaller = function(){
		m_dlg.setCaller({self:m_this, caller:_onDlgEvent});
		m_items.skipBtn.setCaller({self:m_this, caller:_onClickSkip});
	};
	
	var _onClickSkip = function(){
		m_showFight.skip();
	};
	
	var _showDlg = function(){
		m_dlg.show();
	};
	
	var _initInfo = function(armyId, fightId, append){
		m_g.regUpdater(m_this, _onUpdate, 10);
		m_this.resize(m_g.getWinSizer().getValidClientSize());
		m_showFight.initFight(armyId, fightId, append);
		m_this.resize(m_g.getWinSizer().getValidClientSize());
	};
	
	var _onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			m_g.unregUpdater(m_this, _onUpdate);
			if ( m_hideCaller ) {
				m_hideCaller.caller.call(m_hideCaller.self);
			}
		}
	};
	
	var _onUpdate = function(){
		m_showFight.update();
	};
	//FightMapDlg-unittest-end
});

FightMapDlgSizer = Class.extern(function(){
	//FightMapDlgSizer-unittest-start
	var C_HEROLIST_W = 380;
	var C_HEROLIST_ITEM_W = C_HEROLIST_W/5;
	var C_HEROLIST_H = 66;
	var m_g = null;
	var m_dlg = null;
	var m_items = null;
	var m_size = null;
	
	this.init = function(g){
		m_g = g;
	};
	
	this.resize = function(dlg, items, size){
		_setParams(dlg, items, size);
		_resizeDlg();
		_resetMapDomPosition();
		_resetRoleInfoPosition();
		_resetHPProgBarPosition();
		_resetHeroListPosition();
		_resetDefBarPosition();
		_resetWallBarPosition();
		_resetSkipBtnPosition();
	};
	
	this.resetHeroListPosition = function(){
		_resetDefenderHeroListPosition();
		_resetAttackerHeroListPosition();
	};
	
	var _setParams = function(dlg, items, size){
		m_dlg = dlg;
		m_items = items;
		m_size = size;		
	};
	
	var _resizeDlg = function(){
		var condom = m_dlg.getConDom();
		TQ.setDomSize(condom, m_size.cx, m_size.cy);
		TQ.setDomSize(condom.firstChild, m_size.cx, m_size.cy);
		m_dlg.refreshBack();
	};
	
	var _resetMapDomPosition = function(){
		var maxSize = m_g.getWinSizer().getMaxClientSize();
		var x = (m_size.cx - maxSize.cx)/2;
		var y = (m_size.cy - maxSize.cy)/2;
		TQ.setDomPos(m_items.map, x, y);
		TQ.setDomSize(m_items.map, maxSize.cx, maxSize.cy);
	};
	
	var _resetRoleInfoPosition = function(){
		var left = m_size.cx - TQ.getDomWidth(m_items.defenderRole);
		TQ.setCSS(m_items.defenderRole, 'left', left + 'px');
	};
	
	var _resetHPProgBarPosition = function(){
		var left = (m_size.cx - TQ.getDomWidth(m_items.HPProgBar))/2;
		TQ.setCSS(m_items.HPProgBar, 'left', left + 'px');
	};
	
	var _resetHeroListPosition = function(){
		_resetAttackerHeroListPosition();
		_resetDefenderHeroListPosition();
	};
	
	var _resetDefBarPosition = function(){
		var left = m_size.cx - TQ.getDomWidth(m_items.defBar) - 50;
		var top = m_size.cy - C_HEROLIST_H - TQ.getDomHeight(m_items.wallBar) - TQ.getDomHeight(m_items.defBar) - 50;
		TQ.setDomPos(m_items.defBar, left, top);
	};
	
	var _resetWallBarPosition = function(){
		var left = m_size.cx - TQ.getDomWidth(m_items.wallBar) - 50;
		var top = m_size.cy - C_HEROLIST_H - TQ.getDomHeight(m_items.wallBar) - 50;
		TQ.setDomPos(m_items.wallBar, left, top);
	};
	
	var _resetSkipBtnPosition = function(){
		var x = (m_size.cx - 131)/2;
		var y = m_size.cy - 40;
		TQ.setDomPos(m_items.skipBtn.getParent(), x, y);
	};
	
	var _resetAttackerHeroListPosition = function(){
		var left = 0;
		var top = m_size.cy - C_HEROLIST_H;
		TQ.setDomPos(m_items.attackerHeroList.getParent(), left, top);
	};
	
	var _resetDefenderHeroListPosition = function(){
		var itemCount = m_items.defenderHeroList.getCount();
		var left =m_size.cx - C_HEROLIST_ITEM_W*itemCount;
		var top = m_size.cy - C_HEROLIST_H;
		TQ.setDomPos(m_items.defenderHeroList.getParent(), left, top);
	};
	//FightMapDlgSizer-unittest-end
});

ShowFight = Class.extern(function(){
	//ShowFight-unittest-start
	var m_g = null;
	var m_dlg = null;
	var m_items = null;
	var m_showRounds = null;
	var m_showFightResult = null;
	var m_subShowFight = null;
	var m_fightDemo = null;
	var m_sizer = null;
	
	this.init = function(g, dlg, items, sizer){
		m_g = g;
		m_dlg = dlg;
		m_items = items;
		m_sizer = sizer;
		m_showRounds = ShowRounds.snew(g);
		m_showFightResult = ShowFightResult.snew(g, dlg, items);
	};
	
	this.initFight = function(armyId, fightId, append){
		m_showFightResult.initFight(armyId, fightId, append);
		_initFight(m_g.getImgr().getFightDemoRounds(armyId, fightId) );
	};
	
	this.update = function(){
		if ( !m_showRounds.isEnd() ) {
			m_showRounds.update();
		} else {
			m_showFightResult.update();
		}
	};
	
	this.skip = function(){
		m_showRounds.skip();
	};
	
	var _initFight = function(fightDemo){
		m_fightDemo = fightDemo;
		m_g.getActorMgr().clear();
		
		_loadMap(fightDemo);
		
		_createSubShowFight(fightDemo.attacker.actors);
		
		_createActors('attacker',  fightDemo.attacker.actors, 1);
		_createActors('defender', fightDemo.defender.actors, 3);
		
		_setHeadPartyInfo('attacker', fightDemo.attacker);
		_setHeadPartyInfo('defender', fightDemo.defender);
		
		_updateHerosInfo('attacker');
		_updateHerosInfo('defender');
		
		_updateWallsInfo();
		_updateDefsInfo();
		
		m_showRounds.setRounds(fightDemo.rounds);
	};	
	
	var _loadMap = function(fightDemo){
		var res = ItemResUtil.findItemres(fightDemo.mapId);
		m_showRounds.setMapPosInfo(res.offsetPos, res.gridPixel);
		IMG.setBKImage(m_items.map, IMG.makeImg('map/' + res.img));
	};
	
	var _createSubShowFight = function(actors){
		if (actors[0].type == ACTOR_TYPE.HERO) {
			m_subShowFight = ShowSingleHeroFight.snew();
		} else {
			m_subShowFight = ShowSoldiersFight.snew();
		}
	};
	
	var _setHeadPartyInfo = function(campName, campRes){
		if ( _isHeroSingleFight() ) {
			_setHeroHeadPartyInfo(campName, campRes);
		} else {
			_setRoleHeadPartyInfo(campName, campRes);
		}
		
		_setHPProgBarMaxVal(campName);
		_updateHPProgBar(campName);
	};
	
	var _isHeroSingleFight = function(){
		return m_g.getActorMgr().getCount() == 2
			&& m_g.getActorMgr().getByIdx(0).getType() == ACTOR_TYPE.HERO; 
	};
	
	var _setHeroHeadPartyInfo = function(campName, campRes){
		var campRoleItem = m_items[campName + 'Role'];
		var actor = _collectCampActors(campName)[0];
		IMG.setBKImage(campRoleItem.items.icon, IMG.makeMidImg(actor.getIcon()));
		TQ.setTextEx(campRoleItem.items.name, actor.getName());
		TQ.setTextEx(campRoleItem.items.alliance, '');
		TQ.setTextEx(campRoleItem.items.fightCap, m_subShowFight.calcFightCap(campRes.actors));
		TQ.setClass(campRoleItem.items[campName + 'Bak'], campName + 'HeroBak');
	};
	
	var _setRoleHeadPartyInfo = function(campName, campRes){
		var campRoleItem = m_items[campName + 'Role'];
		IMG.setBKImage(campRoleItem.items.icon, IMG.makeMidImg(campRes.role.icon));
		TQ.setTextEx(campRoleItem.items.name, campRes.role.name);
		TQ.setTextEx(campRoleItem.items.alliance, campRes.role.alli);
		TQ.setTextEx(campRoleItem.items.fightCap, m_subShowFight.calcFightCap(campRes.actors));
		TQ.setClass(campRoleItem.items[campName + 'Bak'], campName + 'RoleBak');
	};
	
	var _setHPProgBarMaxVal = function(campName){
		var campRoleItem = m_items[campName + 'Role'];
		campRoleItem.items.hpProgBar.setRange(_calcActorsMaxHP(campName));
		campRoleItem.items.hpProgBar.setMirror(campName == 'defender');
	};
	
	var _updateHPProgBar = function(campName){
		var campRoleItem = m_items[campName + 'Role'];
		campRoleItem.items.hpProgBar.setValue(0, _calcActorsHP(campName));
	};
	
	var _calcActorsMaxHP = function(campName){
		var maxHP = 0;
		_travelCampActors( campName, function(actor){
			if (actor.getType() == ACTOR_TYPE.DEF) return;
			if (actor.getType() == ACTOR_TYPE.WALL) return;
			maxHP += Math.floor(actor.getMaxHP()/actor.getUnitHP() + 0.00001); });
		return maxHP;
	};
	
	var _calcActorsHP = function(campName){
		var hp = 0;
		_travelCampActors( campName, function(actor){
			if (actor.getType() == ACTOR_TYPE.DEF) return;
			if (actor.getType() == ACTOR_TYPE.WALL) return;
			hp +=  Math.floor(actor.getHP()/actor.getUnitHP() + 0.00001);  });
		return hp;
	};
	
	var _updateHerosInfo = function(campName){
		var pos = 0;
		var heroList = m_items[campName + 'HeroList'];
		_travelCampActors( campName, function(actor){
			if (actor.getType() != ACTOR_TYPE.SOLDIER) return;
			var item = heroList.getItem(pos++);
			IMG.setBKImage(item.exsubs.icon, IMG.makeSmallImg(actor.getIcon()));
			var curSoldierNum = Math.floor(actor.getHP()/actor.getUnitHP() + 0.00001);
			var maxSoldierNum = Math.floor(actor.getMaxHP()/actor.getUnitHP() + 0.00001);
			TQ.setTextEx(item.exsubs.number, curSoldierNum + '/' + maxSoldierNum );
			TQ.setTextEx(item.exsubs.number_bak, curSoldierNum + '/' + maxSoldierNum );
			});
		heroList.setItemCount(pos);
		m_sizer.resetHeroListPosition();
	};
	
	var _updateWallsInfo = function(){
		var actor = _getWallActor();
		if ( !actor ) {
			TQ.setCSS(m_items.wallBar, 'display', 'none');
		} else {
			TQ.setCSS(m_items.wallBar, 'display', 'block');
			TQ.setTextEx(m_items.wallHP, actor.getHP() + '/' + actor.getMaxHP());
		}
	};
	
	var _updateDefsInfo = function(){
		if ( !_hasWallActor() ) {
			TQ.setCSS(m_items.defBar, 'display', 'none');
			return;
		}
		
		TQ.setCSS(m_items.defBar, 'display', 'block');
		var tags = {'150301':'XIANJING', '150302':'GUNMU', '150303':'JUMA', '150304':'LEISHI', '150305':'NUJIAN'};
		
		for ( var resId in tags ) { // clear
			TQ.setTextEx(m_items['def_' + tags[resId] ], 0 );
		}
		
		var defActors = _collectDefActors();
		for ( var i=0; i<defActors.length; ++i ) {
			var actor = defActors[i];
			TQ.setTextEx(m_items['def_' + tags[actor.getResId()] ], actor.getHP());
		}
	};
	
	var _createActors = function(campName, actors, defaultDir){
		for ( var i=0; i<actors.length; ++i ) {
			var res = actors[i];
			var actor = Actor.snew(m_g);
			actor.setParent(m_items.map);
			actor.setId(res.id);
			actor.setType(res.type);
			actor.setName(res.name);
			actor.setCampName(campName);
			actor.setIcon(res.detail.icon);
			actor.setResId(_getCombineResId(res));
			actor.setDirection(defaultDir);
			actor.setPosition(m_showRounds.getAbsPosition(res.pos));
			actor.setAction('stand');
			actor.setHP(res.detail.attrs[ATTR.HP], res.detail.attrs[ATTR.HP]);
			actor.setUnitHP(res.detail.attrs[ATTR.UHP]);
			actor.setObserver(_onActorHPChange);
			m_g.getActorMgr().add(actor);
			if ( actor.getResId() == 150201 ) {
				m_g.getActorMgr().setMainWallId(actor.getId());
			}
		}
	};
	
	var _getCombineResId = function(res){
		var combineResId = 0;
		if ( res.type == ACTOR_TYPE.SOLDIER ) {
			combineResId = res.resid;
		} else if ( res.type == ACTOR_TYPE.HERO ) {
			var sexFlag = Math.floor(res.detail.icon/100);
			combineResId = 150100 + sexFlag;
		} else if ( (res.type == ACTOR_TYPE.WALL) && (res.pos.y == 1) ) {
			combineResId = 150201;
		} else if ( res.type == ACTOR_TYPE.DEF ) {
			combineResId = 150300 + res.resid;
		}
		return combineResId;
	};
	
	var _getWallActor = function(){
		var wallActor = null;
		_travelCampActors( 'defender', function(actor){
			if (actor.getType() == ACTOR_TYPE.WALL 
				&& actor.getId() == m_g.getActorMgr().getMainWallId() ){
				wallActor = actor;
			} });
		return wallActor;
	};	
	
	var _hasWallActor = function(){
		return _getWallActor() != null;
	};		
	
	var _collectDefActors = function(){
		var defActors = [];
		_travelCampActors( 'defender', function(actor){
			if (actor.getType() == ACTOR_TYPE.DEF){
				defActors.push(actor);
			} });
		return defActors;
	};
	
	var _collectCampActors = function(camp){
		var actors = [];
		_travelCampActors( camp, function(actor){
			actors.push(actor);
			});
		return actors;
	};
	
	var _travelCampActors = function(campName, travelCallback){
		for ( var i=0; i<m_g.getActorMgr().getCount(); ++i ) {
			var actor = m_g.getActorMgr().getByIdx(i);
			if (actor.getCampName() == campName) {
				travelCallback(actor);
			}
		}
	};	
	
	var _onActorHPChange = function(actorId, type, value){
		_updateHPProgBar('attacker');
		_updateHPProgBar('defender');
		
		_updateHerosInfo('attacker');
		_updateHerosInfo('defender');
		
		_updateWallsInfo();
		_updateDefsInfo();
	};
	//ShowFight-unittest-end
});

ShowSingleHeroFight = Class.extern(function(){
	this.calcFightCap = function(actors){
		return actors[0].detail.attrs[ATTR.SFC];
	};
});

ShowSoldiersFight = Class.extern(function(){
	this.calcFightCap = function(actors){
		var fcSum = 0;
		for ( var i=0; i<actors.length; ++i ) {
			if ( actors[i].type != ACTOR_TYPE.SOLDIER ) continue;
			fcSum += actors[i].detail.attrs[ATTR.FC];
		}
		return fcSum;
	};
});

ShowRounds = Class.extern(function(){
	//ShowRounds-unittest-start
	var m_g = null;
	var m_this = null;
	var m_rounds = [];
	var m_mapOffsetPos = {x:0, y:0};
	var m_gridPixel = 1;
	
	this.init = function(g){
		m_this = this;
		m_g = g;
	};
	
	this.setMapPosInfo = function(mapOffsetPos, gridPixel){
		m_mapOffsetPos = mapOffsetPos;
		m_gridPixel = gridPixel;
	};
	
	this.getAbsPosition = function(refPos){
		return { x:m_mapOffsetPos.x + refPos.x*m_gridPixel
			,y:m_mapOffsetPos.y + refPos.y*m_gridPixel };
	};
	
	this.setRounds = function(rounds){
		m_rounds = ConvertFightRounds.snew().splitRounds(rounds);
	};

	this.update = function(){
		m_g.getActorMgr().update();
		
		if ( _isAllRoundsEnd() ) {
			return;
		} 
		
		if ( _isCurRoundEnd() ) {
			_popRound();
		} else {
			_updateRound(_getCurRound());
			_removeDeletedActions(_getCurRound());
		}
	};
	
	this.isEnd = function(){
		return _isAllRoundsEnd();
	};
	
	this.skip = function(){
		m_rounds = [];
		m_g.getActorMgr().clear();
	};
	
	var _isAllRoundsEnd = function(){
		if ( m_rounds.length > 0 ) return false;
		return _isAllActorsIdle();
	};
	
	var _isCurRoundEnd = function(){
		if ( m_rounds.length == 0 ) {
			return _isAllRoundsEnd();
		}
		
		var actions = m_rounds[0];
		if (actions.length > 0) return false;
		return _isAllActorsIdle();
	};
	
	var _isAllActorsIdle = function(){
		var count = m_g.getActorMgr().getCount();
		for ( var i=0; i<count; ++i ) {
			var actor = m_g.getActorMgr().getByIdx(i);
			if ( !actor.isIdle() ) return false;
		}
		return true;
	};	
	
	var _popRound = function(){
		m_rounds.splice(0,1);
	};
	
	var _getCurRound = function(){
		return m_rounds[0];
	};
	
	var _updateRound = function(roundActions){
		for ( var i=0; i<roundActions.length; ++i ) {
			var action = roundActions[i];
			if (action.event == 'effect') {
				action.isDelete = _updateEffectEvent(action);
			} else if (action.event == 'addeff') {
				action.isDelete = _updateAddEffectEvent(action);
			} else if (action.event == 'removeeff') {
				action.isDelete = _updateRemoveEffectEvent(action);
			} else {
				_resetWallActorAction(action);
				action.isDelete = _updateStateEvent(action);
			}
		}
	};
	
	var _updateEffectEvent = function(action){
		var target = m_g.getActorMgr().getById(action.targetid);
		if (!target) return true;
		if (!target.isIdle()) return false;
		
		EffectManager.addMapEffect(target.isHero(), action);
		return true;
	};
	
	var _updateAddEffectEvent = function(action){
		var actor = m_g.getActorMgr().getById(action.id);
		if (!actor) return true;
		if (!actor.isIdle()) return false;
		
		var effects = EffectManager.createEffects(actor, action);
		for ( var k in effects ) {
			actor.getEffectContainer().add(effects[k]);
		}
		return true;
	};
	
	var _updateRemoveEffectEvent = function(action){
		var actor = m_g.getActorMgr().getById(action.id);
		if (!actor) return true;
		if (!actor.isIdle()) return false;
		
		actor.getEffectContainer().remove(action.effuid);
		return true;
	};
	
	var _resetWallActorAction = function(action){
		var stateType = _getStateType(action);
		if (!stateType) return;
		
		if (stateType == 'attackstate') {
			var target = m_g.getActorMgr().getById(action.targetid);
			if (!target ) return;
			if (target.getType() != ACTOR_TYPE.WALL) return;
			
			for ( var i=0; action.effects && i<action.effects.length; ++i ) {
				var effect = action.effects[i];
				if ( !effect.targetid || effect.targetid != action.targetid ) continue;
				effect.targetid = m_g.getActorMgr().getMainWallId();
			}
			action.targetid = m_g.getActorMgr().getMainWallId();
		} else if (stateType == 'diestate') {
			var user = m_g.getActorMgr().getById(action.id);
			if (!user) return;
			if (user.getType() != ACTOR_TYPE.WALL) return;
			
			action.id = m_g.getActorMgr().getMainWallId();
		}
	};
	
	var _updateStateEvent = function(action){
		var stateType = _getStateType(action);
		if (!stateType) return true;
		
		var userid = action.id ? action.id : action.userid;
		var user = m_g.getActorMgr().getById(userid);
		if (!user) return true;
		if (!user.isIdle()) return false;
		
		if (_hasPreAction(action.seq, action.subseq)){
			return false;
		}
		
		var target = m_g.getActorMgr().getById(action.targetid);
		if (target && !target.isIdle()) {
			return false;
		}
		
		if ( stateType == 'attackstate' && !target ) {
			return true;
		}
		
		var newAction = _convertMoveActionPaths(action);
		var state = StateFactory.createByType(user, target, stateType, newAction);
		user.setState(state);
		return true;
	};
	
	var _hasPreAction = function(seq, subseq){
		var actions = _getCurRound();
		for ( var i=0; actions && i<actions.length; ++i ) {
			var action = actions[i];
			if (action.seq == seq && action.subseq < subseq) {
				return true;
			}
		}
		return false;
	};
	
	var _removeDeletedActions = function(roundActions){
		for ( var i=roundActions.length-1; i>=0; --i ) {
			if (roundActions[i].isDelete) {
				roundActions.splice(i, 1);
			}
		}		
	};
	
	var _getStateType = function(action){
		if ( action.event == 'move' ) {
			return 'movestate';
		} else if ( action.event == 'attack' 
			|| action.event == 'miss' 
			|| action.event == 'berserk' ) {
			return 'attackstate';
		} else if ( action.event == 'die' ) {
			return 'diestate';
		} else {
			return null;
		}
	};
	
	var _convertMoveActionPaths = function(action){
		if (action.event != 'move') return action;
		
		var newAction = {};
		TQ.dictCopy(newAction, action);
		newAction.paths = [];
		for ( var i=0; i<action.paths.length; ++i ) {
			newAction.paths.push(m_this.getAbsPosition(action.paths[i]));
		}
		return newAction;
	};
	//ShowRounds-unittest-end
});

ShowFightResult = Class.extern(function(){
	//ShowFightResult-unittest-start
	var C_RESULT_WIN_ANIMID = 10000;
	var C_RESULT_FAIL_ANIMID = 10001;
	var C_RESULT_ZINDEX = 100000;
	var m_g = null;
	var m_dlg = null;
	var m_this = null;
	var m_items = null;
	var m_resultAnim = null;
	var m_armyId = null;
	var m_fightId = null;
	var m_append = null;
	
	this.init = function(g, dlg, items){
		m_this = this;
		m_g = g;
		m_dlg = dlg;
		m_items = items;
	};
	
	this.initFight = function(armyId, fightId, append){
		if ( m_resultAnim )  {
			m_resultAnim.stop();
			m_resultAnim = null;
		}
		
		m_armyId = armyId;
		m_fightId = fightId;
		m_append = append;
	};
	
	this.update = function(){
		_startResultEffect();
		if ( this._isWorldBossType() ) {
			this._worldBossResultCheck();
		} else {
			this._commResultCheck();
		}
	};
	
	this._isWorldBossType = function(){
		if ( !m_append ) return false;
		return m_append.type == 'worldboss';
	};
	
	this._worldBossResultCheck = function(){
		if ( m_resultAnim.isEnd() && !UIM.getDlg('worldbossresult').isShow() ) {
			var dlg = UIM.getDlg('worldbossresult');
			dlg.openDlg({hurt:m_append.hurt});
			dlg.setHideCaller({self:m_this, caller:_hideFightMapDlg});
		}
	};
	
	this._commResultCheck = function(){
		if ( m_resultAnim.isEnd() && !_isResultUIShow() ) {
			_showResultUI();
		}
	};
	
	var _startResultEffect = function(){
		if ( !m_resultAnim ) {
			var fightDemo = m_g.getImgr().getFightDemoRounds(m_armyId, m_fightId);
			var isMySucc = FightResultMaker.snew(m_g).isMySucc(fightDemo);
			var animId = isMySucc ? C_RESULT_WIN_ANIMID : C_RESULT_FAIL_ANIMID;
			m_resultAnim = m_g.getAnimMgr().alloc(m_items.map, animId);
			m_resultAnim.setZIndex(C_RESULT_ZINDEX);
			m_resultAnim.setPosition(_getResultAnimPos());
			m_resultAnim.play();
		}
	};
	
	var _getResultAnimPos = function(){
		var clientSize = m_g.getWinSizer().getValidClientSize();
		var animSize = m_resultAnim.getSize();
		return {x:(clientSize.cx - animSize.cx)/2, y:(clientSize.cy - animSize.cy)/2};
	};
	
	var _isResultUIShow = function(){
		return UIM.getDlg('fightresult').isShow();
	};
	
	var _showResultUI = function(){
		var dlg = UIM.getDlg('fightresult');
		dlg.openDlg(m_armyId, m_fightId);
		dlg.setHideCaller({self:m_this, caller:_hideFightMapDlg});
	};
	
	var _hideFightMapDlg = function(){
		m_dlg.hide();
	};
	//ShowFightResult-unittest-end
});

WorldBossResultDlg = JBaseDlg.ex({
	setHideCaller : function(caller){
		this.hideCaller_ = caller;
	}
	
	,_getDlgCfg : function(){
		return {modal:true, title:rstr.military.worldbossresult.title, pos:{x:"center", y:100}, uicfg:uicfg.military.worldbossresult};
	}
	
	,_setCallers : function(){
		this.dlg_.setCaller({self:this, caller:this._onDlgEvent});
	}
	
	,_initInfo : function(){
		TQ.setTextEx(this.items_.desc, TQ.format(rstr.military.worldbossresult.result, RStrUtil.formatResNumStr(this.params_.hurt)));
	}	
	
	,_onDlgEvent : function(id){
		if ( id == C_SYS_DLG_HIDE ){
			if ( this.hideCaller_ )  {
				this.hideCaller_.caller.call(this.hideCaller_.self);
			}
		}
	}
});	
	




