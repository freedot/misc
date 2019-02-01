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
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_effects = [];
	this.add = function(effect){
		_lc_.m_effects.push(effect);
	};
	
	this.remove = function(effectUId){
		var spec = function(findUID) {
			this.isSatisfiedBy = function(effect) {
				return effect.getId() == findUID;
			}; 
		};
		
		var effect = TQ.find(_lc_.m_effects, null, null, new spec(effectUId));
		if ( effect ) {
			effect.destory();
			_lc_.m_effects.splice(TQ.getLastFindIdx(), 1);
		}
	};
	
	this.update = function(zIndex, pos){
		for ( var i=0; i<_lc_.m_effects.length; ++i ) {
			var effect = _lc_.m_effects[i];
			effect.setZIndex(zIndex);
			effect.setPosition(pos);
			effect.play();
		}
	};
	
	this.release = function(){
		for ( var i=0; i<_lc_.m_effects.length; ++i ) {
			_lc_.m_effects[i].destory();
		}
		_lc_.m_effects = [];
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
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.C_BASE_Z = 2000;
	var C_HPBAR_W = 45;
	var C_HPBAR_H = 5;
	var C_HPBAR_TOP_Y = 60;
	_lc_.C_HPBAR_OFFSET_Z = 10;
	
	_lc_.m_this = null;
	_lc_.m_g = null;
	var m_id = null;
	_lc_.m_type = null;
	var m_name = '';
	
	_lc_.m_parent = null;
	_lc_.m_resId = null;
	_lc_.m_actionId = null;
	_lc_.m_dir = null;
	
	_lc_.m_avatarRes = null;
	_lc_.m_actionName = null;
	_lc_.m_actionRes = null;
	
	_lc_.m_pos = {x:0, y:0};
	_lc_.m_state = NullState;
	_lc_.m_anim = NullPngAnim.snew(0);
	_lc_.m_effectContainer = EffectContainer.snew();
	_lc_.m_hpbar = NullProgressBar.snew();
	_lc_.m_observer = null;//function(){};
	var m_unitHP = 1;
	var m_campName = '';
	var m_icon = 0;
	
	this.init = function(g){
		_lc_.m_this = this;
		_lc_.m_g = g;
		_lc_.m_hpbar.setMaxVal(100);
		_lc_.m_hpbar.setVal(100);
	};
	
	this.setParent = function(parentDom){
		_lc_.m_parent = parentDom;
	};
	
	this.getParent = function(){
		return _lc_.m_parent;
	};
	
	this.setId = function(id){
		m_id = id;
	};
	
	this.getId = function(){
		return m_id;
	};
	
	this.setType = function(type){
		_lc_.m_type = type;
	};
	
	this.getType = function(){
		return _lc_.m_type;
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
		return _lc_.m_type == ACTOR_TYPE.HERO;
	};
	
	this.isDef = function(){
		return _lc_.m_type == ACTOR_TYPE.DEF;
	};
	
	this.getEffectContainer = function(){
		return _lc_.m_effectContainer;
	};
	
	this.setResId = function(resId){
		_lc_.m_resId = resId;
	};
	
	this.getResId = function(){
		return _lc_.m_resId;
	};
	
	this.setDirection = function(dir){
		_lc_.m_dir = dir;
		_lc_._loadAvatar();
	};
	
	this.getDirection = function(){
		return _lc_.m_dir;
	};
	
	this.setPosition = function(pos){
		_lc_.m_pos.x = pos.x;
		_lc_.m_pos.y = pos.y;
		_lc_._updateAvatarPos();
	};
	
	this.getPosition = function(){
		return _lc_.m_pos;
	};
	
	this.getZIndex = function(){
		return _lc_.C_BASE_Z + _lc_.m_pos.y; 
	};
	
	this.setAction = function(actName) {
		_lc_.m_actionId = ACTOR_ACTS_NAMEID[actName];
		_lc_._loadAvatar();
	};
	
	this.setState = function(state){
		_lc_.m_state.end();
		_lc_.m_state = state;
		_lc_.m_state.start();
	};
	
	this.getAnim = function(){
		return _lc_.m_anim;
	};
	
	this.setObserver = function(ob){
		_lc_.m_observer = ob;
	};
	
	this.isIdle = function(){
		return _lc_.m_state.isIdle();
	};
	
	this.setHP = function(maxhp, hp){
		_lc_.m_hpbar.setMaxVal(maxhp);
		_lc_.m_hpbar.setVal(hp);
	};
	
	this.getMaxHP = function(){
		return _lc_.m_hpbar.getMaxVal();
	};
	
	this.getHP = function(){
		return _lc_.m_hpbar.getVal();
	};
	
	this.setUnitHP = function(uhp){
		m_unitHP = uhp;
	};
	
	this.getUnitHP = function(){
		return m_unitHP;
	};
	
	this.subHP = function(subVal){
		if ( subVal <= 0 ) return;
		
		var curVal = _lc_.m_hpbar.getVal();
		var val = Math.max(0, curVal - subVal);
		_lc_.m_hpbar.setVal(val);
		_lc_.m_observer(m_id, 'subhp', curVal - val );
	};
	
	this.addHP = function(addVal){
		if ( addVal <= 0 ) return;
		
		var maxVal = _lc_.m_hpbar.getMaxVal();
		var curVal = _lc_.m_hpbar.getVal();
		var val = Math.min(maxVal, curVal + addVal);
		_lc_.m_hpbar.setVal(val);
		_lc_.m_observer(m_id, 'addhp', val - curVal);
	};
	
	this.die = function(){
		_lc_.m_observer(m_id, 'die');
		_lc_.m_effectContainer.release();
	};
	
	this.update = function(delta){
		_lc_._updateAvatarPos();
		_lc_.m_state.update();
	};
	
	this.destory = function(){
		if ( !_lc_.m_hpbar.isNull ) {
			_lc_.m_g.getEntityfactory().freePBar(_lc_.m_hpbar);
			_lc_.m_hpbar = NullProgressBar.snew();
		}
		_lc_.m_state.end();
		_lc_.m_anim.stop();
		_lc_.m_effectContainer.release();
	};
	
	_lc_._loadAvatar = function(){
		if ( !_lc_._isInited() ) return;
		
		_lc_._createHPBar();
	
		if ( _lc_.m_anim.getId() == _lc_.m_g.getAnimMgr().makeAvatarAnimId(_lc_.m_resId, _lc_.m_dir, _lc_.m_actionId) ) {
			return;
		}
		
		_lc_.m_anim.stop();
		_lc_.m_anim = _lc_.m_g.getAnimMgr().allocAvatar(_lc_.m_this.getResId(), _lc_.m_dir, _lc_.m_actionId, _lc_.m_parent);
		_lc_.m_anim.setPosition(_lc_.m_pos);
		_lc_.m_anim.play();
	};
	
	_lc_._updateAvatarPos = function(){
		_lc_.m_anim.setPosition(_lc_.m_pos);
		var zIndex = _lc_.C_BASE_Z + _lc_.m_pos.y;
		_lc_.m_anim.setZIndex(zIndex);
		_lc_.m_effectContainer.update(zIndex, _lc_.m_pos);
		_lc_.m_hpbar.setPos({x:_lc_.m_pos.x - C_HPBAR_W/2,  y:_lc_.m_pos.y-C_HPBAR_TOP_Y});
		_lc_.m_hpbar.setZOrder(zIndex + _lc_.C_HPBAR_OFFSET_Z);
	};
	
	_lc_._isInited = function(){
		if ( isNull(_lc_.m_parent) ) return false;
		if ( isNull(_lc_.m_resId) ) return false;
		if ( isNull(_lc_.m_actionId) ) return false;
		if ( isNull(_lc_.m_dir) ) return false;
		return true;
	};
	
	_lc_._createHPBar = function() {
		if ( !_lc_.m_hpbar.isNull ) return;
		if ( _lc_.m_type != ACTOR_TYPE.SOLDIER) return;
		
		var maxVal = _lc_.m_hpbar.getMaxVal();
		var curVal = _lc_.m_hpbar.getVal();
		_lc_.m_hpbar = _lc_.m_g.getEntityfactory().allocPBar(_lc_.m_parent);
		_lc_.m_hpbar.setSize({cx:C_HPBAR_W,cy:C_HPBAR_H});
		
		_lc_.m_hpbar.setBarBorder( IMG.makeImg('comm/perbarbak45.gif') );
		_lc_.m_hpbar.setBarImage( IMG.makeImg('comm/perbar45.gif') );
		_lc_.m_hpbar.setZOrder(0);
		_lc_.m_hpbar.setVal(curVal);
		_lc_.m_hpbar.setMaxVal(maxVal);
	};
	//Actor-unittest-end
});

ActorManager = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_actors = [];
	var m_mainWallId = 0;
	this.init = function(g){};
		
	this.add = function(actor){
		_lc_.m_actors.push(actor);
	};
	
	this.getById = function(actorId) {
		if ( isNull(actorId) ) return null;
		
		var pos = _lc_._findActorPos(actorId);
		if ( pos < 0 ) return null;
		return _lc_.m_actors[pos];
	};
	
	this.remove = function(actor) {
		actor.destory();
		var pos = _lc_._findActorPos(actor.getId());
		_lc_.m_actors.splice(pos, 1);
	};
	
	this.clear = function() {
		for ( var i=0; i<_lc_.m_actors.length; ++i ) {
			_lc_.m_actors[i].destory();
		}
		_lc_.m_actors = [];
	};
	
	this.getCount = function(){
		return _lc_.m_actors.length;
	};
	
	this.getByIdx = function(idx){
		return _lc_.m_actors[idx];
	};
	
	this.update = function(){
		for ( var i=0; i<_lc_.m_actors.length; ++i ) {
			_lc_.m_actors[i].update();
		}
	};
	
	this.getMainWallId = function(){
		return m_mainWallId;
	};
	
	this.setMainWallId = function(mainWallId){
		m_mainWallId = mainWallId;
	};
	
	_lc_._findActorPos = function(actorId) {
		for ( var i=0; i<_lc_.m_actors.length; ++i ) {
			if (_lc_.m_actors[i].getId() == actorId) {
				return i;
			}
		}
		return -1;
	};
	//ActorManager-unittest-end
});

FightMapDlg = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_this = null;
	_lc_.m_dlg = null;
	_lc_.m_items = {};
	_lc_.m_showFight = null;
	_lc_.m_sizer = null;
	var m_hideCaller = null;
		
	this.init = function(g) {
		_lc_.m_g = g;
		_lc_.m_this = this;
	};
	
	this.openDlg = function(armyId, fightId, append){
		if ( !_lc_.m_g.getImgr().getFightDemoRounds(armyId, fightId) ) {
			_lc_.m_g.getGUI().msgBox(rstr.comm.msgts, rstr.fightMapDlg.notFindFightDemo, MB_F_CLOSE, null);
			return;
		}
		_lc_._initDlg();
		_lc_._showDlg();
		_lc_._initInfo(armyId, fightId, append);
	};
	
	this.resize = function(size){
		if ( _lc_.m_dlg && _lc_.m_dlg.isShow() ) {
			_lc_.m_sizer.resize(_lc_.m_dlg, _lc_.m_items, size);
		}
	};
	
	this.setHideCaller = function(caller){
		m_hideCaller = caller;
	};
	
	_lc_._initDlg = function(){
		if ( _lc_.m_dlg ){
			return;
		}
		
		_lc_._createDlg();
		_createMapDlgSize();
		_lc_._createRoleItemsByTmpl();
		_lc_._createShowFight();
		_lc_._setCaller();
	};
	
	_lc_._createDlg = function(){
		_lc_.m_dlg = Dialog.snew(_lc_.m_g,{modal:false, uiback:uiback.dlg.noborder, pos:{x:0, y:0} });
		_lc_.m_g.getGUI().initDlg(_lc_.m_dlg, uicfg.military.fightmapdlg, _lc_.m_items);
	};
	
	var _createMapDlgSize = function(){
		_lc_.m_sizer = FightMapDlgSizer.snew(_lc_.m_g);
	};
	
	_lc_._createRoleItemsByTmpl = function(){
		var camps = ['attacker', 'defender'];
		var roleInfoTmpls = [uicfg.military.fightmapdlg.t_[0], uicfg.military.fightmapdlg.t_[2]]; 
		for ( var i=0; i<camps.length; ++i ) {
			var campItem = _lc_.m_items[camps[i] + 'Role'];
			campItem.items = {};
			_lc_.m_g.getGUI().buildDomItems(campItem, roleInfoTmpls[i], null, campItem.items);
		}
	};
	
	_lc_._createShowFight = function(){
		_lc_.m_showFight = ShowFight.snew(_lc_.m_g, _lc_.m_dlg, _lc_.m_items, _lc_.m_sizer);
	};
	
	_lc_._setCaller = function(){
		_lc_.m_dlg.setCaller({self:_lc_.m_this, caller:_lc_._onDlgEvent});
		_lc_.m_items.skipBtn.setCaller({self:_lc_.m_this, caller:_onClickSkip});
	};
	
	var _onClickSkip = function(){
		_lc_.m_showFight.skip();
	};
	
	_lc_._showDlg = function(){
		_lc_.m_dlg.show();
	};
	
	_lc_._initInfo = function(armyId, fightId, append){
		_lc_.m_g.regUpdater(_lc_.m_this, _lc_._onUpdate, 10);
		_lc_.m_this.resize(_lc_.m_g.getWinSizer().getValidClientSize());
		_lc_.m_showFight.initFight(armyId, fightId, append);
		_lc_.m_this.resize(_lc_.m_g.getWinSizer().getValidClientSize());
	};
	
	_lc_._onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			_lc_.m_g.unregUpdater(_lc_.m_this, _lc_._onUpdate);
			if ( m_hideCaller ) {
				m_hideCaller.caller.call(m_hideCaller.self);
			}
		}
	};
	
	_lc_._onUpdate = function(){
		_lc_.m_showFight.update();
	};
	//FightMapDlg-unittest-end
});

FightMapDlgSizer = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.C_HEROLIST_W = 380;
	var C_HEROLIST_ITEM_W = _lc_.C_HEROLIST_W/5;
	_lc_.C_HEROLIST_H = 66;
	var m_g = null;
	_lc_.m_dlg = null;
	_lc_.m_items = null;
	_lc_.m_size = null;
	
	this.init = function(g){
		m_g = g;
	};
	
	this.resize = function(dlg, items, size){
		_lc_._setParams(dlg, items, size);
		_lc_._resizeDlg();
		_lc_._resetMapDomPosition();
		_lc_._resetRoleInfoPosition();
		_lc_._resetHPProgBarPosition();
		_lc_._resetHeroListPosition();
		_lc_._resetDefBarPosition();
		_lc_._resetWallBarPosition();
		_lc_._resetSkipBtnPosition();
	};
	
	this.resetHeroListPosition = function(){
		_lc_._resetDefenderHeroListPosition();
		_lc_._resetAttackerHeroListPosition();
	};
	
	_lc_._setParams = function(dlg, items, size){
		_lc_.m_dlg = dlg;
		_lc_.m_items = items;
		_lc_.m_size = size;		
	};
	
	_lc_._resizeDlg = function(){
		var condom = _lc_.m_dlg.getConDom();
		TQ.setDomSize(condom, _lc_.m_size.cx, _lc_.m_size.cy);
		TQ.setDomSize(condom.firstChild, _lc_.m_size.cx, _lc_.m_size.cy);
		_lc_.m_dlg.refreshBack();
	};
	
	_lc_._resetMapDomPosition = function(){
		var maxSize = m_g.getWinSizer().getMaxClientSize();
		var x = (_lc_.m_size.cx - maxSize.cx)/2;
		var y = (_lc_.m_size.cy - maxSize.cy)/2;
		TQ.setDomPos(_lc_.m_items.map, x, y);
		TQ.setDomSize(_lc_.m_items.map, maxSize.cx, maxSize.cy);
	};
	
	_lc_._resetRoleInfoPosition = function(){
		var left = _lc_.m_size.cx - TQ.getDomWidth(_lc_.m_items.defenderRole);
		TQ.setCSS(_lc_.m_items.defenderRole, 'left', left + 'px');
	};
	
	_lc_._resetHPProgBarPosition = function(){
		var left = (_lc_.m_size.cx - TQ.getDomWidth(_lc_.m_items.HPProgBar))/2;
		TQ.setCSS(_lc_.m_items.HPProgBar, 'left', left + 'px');
	};
	
	_lc_._resetHeroListPosition = function(){
		_lc_._resetAttackerHeroListPosition();
		_lc_._resetDefenderHeroListPosition();
	};
	
	_lc_._resetDefBarPosition = function(){
		var left = _lc_.m_size.cx - TQ.getDomWidth(_lc_.m_items.defBar) - 50;
		var top = _lc_.m_size.cy - _lc_.C_HEROLIST_H - TQ.getDomHeight(_lc_.m_items.wallBar) - TQ.getDomHeight(_lc_.m_items.defBar) - 50;
		TQ.setDomPos(_lc_.m_items.defBar, left, top);
	};
	
	_lc_._resetWallBarPosition = function(){
		var left = _lc_.m_size.cx - TQ.getDomWidth(_lc_.m_items.wallBar) - 50;
		var top = _lc_.m_size.cy - _lc_.C_HEROLIST_H - TQ.getDomHeight(_lc_.m_items.wallBar) - 50;
		TQ.setDomPos(_lc_.m_items.wallBar, left, top);
	};
	
	_lc_._resetSkipBtnPosition = function(){
		var x = (_lc_.m_size.cx - 131)/2;
		var y = _lc_.m_size.cy - 40;
		TQ.setDomPos(_lc_.m_items.skipBtn.getParent(), x, y);
	};
	
	_lc_._resetAttackerHeroListPosition = function(){
		var left = 0;
		var top = _lc_.m_size.cy - _lc_.C_HEROLIST_H;
		TQ.setDomPos(_lc_.m_items.attackerHeroList.getParent(), left, top);
	};
	
	_lc_._resetDefenderHeroListPosition = function(){
		var itemCount = _lc_.m_items.defenderHeroList.getCount();
		var left =_lc_.m_size.cx - C_HEROLIST_ITEM_W*itemCount;
		var top = _lc_.m_size.cy - _lc_.C_HEROLIST_H;
		TQ.setDomPos(_lc_.m_items.defenderHeroList.getParent(), left, top);
	};
	//FightMapDlgSizer-unittest-end
});

ShowFight = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.m_g = null;
	_lc_.m_dlg = null;
	_lc_.m_items = null;
	_lc_.m_showRounds = null;
	_lc_.m_showFightResult = null;
	_lc_.m_subShowFight = null;
	_lc_.m_fightDemo = null;
	var m_sizer = null;
	
	this.init = function(g, dlg, items, sizer){
		_lc_.m_g = g;
		_lc_.m_dlg = dlg;
		_lc_.m_items = items;
		m_sizer = sizer;
		_lc_.m_showRounds = ShowRounds.snew(g);
		_lc_.m_showFightResult = ShowFightResult.snew(g, dlg, items);
	};
	
	this.initFight = function(armyId, fightId, append){
		_lc_.m_showFightResult.initFight(armyId, fightId, append);
		_lc_._initFight(_lc_.m_g.getImgr().getFightDemoRounds(armyId, fightId) );
	};
	
	this.update = function(){
		if ( !_lc_.m_showRounds.isEnd() ) {
			_lc_.m_showRounds.update();
		} else {
			_lc_.m_showFightResult.update();
		}
	};
	
	this.skip = function(){
		_lc_.m_showRounds.skip();
	};
	
	_lc_._initFight = function(fightDemo){
		_lc_.m_fightDemo = fightDemo;
		_lc_.m_g.getActorMgr().clear();
		
		_lc_._loadMap(fightDemo);
		
		_lc_._createSubShowFight(fightDemo.attacker.actors);
		
		_lc_._createActors('attacker',  fightDemo.attacker.actors, 1);
		_lc_._createActors('defender', fightDemo.defender.actors, 3);
		
		_lc_._setHeadPartyInfo('attacker', fightDemo.attacker);
		_lc_._setHeadPartyInfo('defender', fightDemo.defender);
		
		_lc_._updateHerosInfo('attacker');
		_lc_._updateHerosInfo('defender');
		
		_lc_._updateWallsInfo();
		_lc_._updateDefsInfo();
		
		_lc_.m_showRounds.setRounds(fightDemo.rounds);
	};	
	
	_lc_._loadMap = function(fightDemo){
		var res = ItemResUtil.findItemres(fightDemo.mapId);
		_lc_.m_showRounds.setMapPosInfo(res.offsetPos, res.gridPixel);
		IMG.setBKImage(_lc_.m_items.map, IMG.makeImg('map/' + res.img));
	};
	
	_lc_._createSubShowFight = function(actors){
		if (actors[0].type == ACTOR_TYPE.HERO) {
			_lc_.m_subShowFight = ShowSingleHeroFight.snew();
		} else {
			_lc_.m_subShowFight = ShowSoldiersFight.snew();
		}
	};
	
	_lc_._setHeadPartyInfo = function(campName, campRes){
		if ( _isHeroSingleFight() ) {
			_setHeroHeadPartyInfo(campName, campRes);
		} else {
			_setRoleHeadPartyInfo(campName, campRes);
		}
		
		_lc_._setHPProgBarMaxVal(campName);
		_lc_._updateHPProgBar(campName);
	};
	
	var _isHeroSingleFight = function(){
		return _lc_.m_g.getActorMgr().getCount() == 2
			&& _lc_.m_g.getActorMgr().getByIdx(0).getType() == ACTOR_TYPE.HERO; 
	};
	
	var _setHeroHeadPartyInfo = function(campName, campRes){
		var campRoleItem = _lc_.m_items[campName + 'Role'];
		var actor = _collectCampActors(campName)[0];
		IMG.setBKImage(campRoleItem.items.icon, IMG.makeMidImg(actor.getIcon()));
		TQ.setTextEx(campRoleItem.items.name, actor.getName());
		TQ.setTextEx(campRoleItem.items.alliance, '');
		TQ.setTextEx(campRoleItem.items.fightCap, _lc_.m_subShowFight.calcFightCap(campRes.actors));
		TQ.setClass(campRoleItem.items[campName + 'Bak'], campName + 'HeroBak');
	};
	
	var _setRoleHeadPartyInfo = function(campName, campRes){
		var campRoleItem = _lc_.m_items[campName + 'Role'];
		IMG.setBKImage(campRoleItem.items.icon, IMG.makeMidImg(campRes.role.icon));
		TQ.setTextEx(campRoleItem.items.name, campRes.role.name);
		TQ.setTextEx(campRoleItem.items.alliance, campRes.role.alli);
		TQ.setTextEx(campRoleItem.items.fightCap, _lc_.m_subShowFight.calcFightCap(campRes.actors));
		TQ.setClass(campRoleItem.items[campName + 'Bak'], campName + 'RoleBak');
	};
	
	_lc_._setHPProgBarMaxVal = function(campName){
		var campRoleItem = _lc_.m_items[campName + 'Role'];
		campRoleItem.items.hpProgBar.setRange(_lc_._calcActorsMaxHP(campName));
		campRoleItem.items.hpProgBar.setMirror(campName == 'defender');
	};
	
	_lc_._updateHPProgBar = function(campName){
		var campRoleItem = _lc_.m_items[campName + 'Role'];
		campRoleItem.items.hpProgBar.setValue(0, _lc_._calcActorsHP(campName));
	};
	
	_lc_._calcActorsMaxHP = function(campName){
		var maxHP = 0;
		_travelCampActors( campName, function(actor){
			if (actor.getType() == ACTOR_TYPE.DEF) return;
			if (actor.getType() == ACTOR_TYPE.WALL) return;
			maxHP += Math.floor(actor.getMaxHP()/actor.getUnitHP() + 0.00001); });
		return maxHP;
	};
	
	_lc_._calcActorsHP = function(campName){
		var hp = 0;
		_travelCampActors( campName, function(actor){
			if (actor.getType() == ACTOR_TYPE.DEF) return;
			if (actor.getType() == ACTOR_TYPE.WALL) return;
			hp +=  Math.floor(actor.getHP()/actor.getUnitHP() + 0.00001);  });
		return hp;
	};
	
	_lc_._updateHerosInfo = function(campName){
		var pos = 0;
		var heroList = _lc_.m_items[campName + 'HeroList'];
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
	
	_lc_._updateWallsInfo = function(){
		var actor = _lc_._getWallActor();
		if ( !actor ) {
			TQ.setCSS(_lc_.m_items.wallBar, 'display', 'none');
		} else {
			TQ.setCSS(_lc_.m_items.wallBar, 'display', 'block');
			TQ.setTextEx(_lc_.m_items.wallHP, actor.getHP() + '/' + actor.getMaxHP());
		}
	};
	
	_lc_._updateDefsInfo = function(){
		if ( !_lc_._hasWallActor() ) {
			TQ.setCSS(_lc_.m_items.defBar, 'display', 'none');
			return;
		}
		
		TQ.setCSS(_lc_.m_items.defBar, 'display', 'block');
		var tags = {'150301':'XIANJING', '150302':'GUNMU', '150303':'JUMA', '150304':'LEISHI', '150305':'NUJIAN'};
		
		for ( var resId in tags ) { // clear
			TQ.setTextEx(_lc_.m_items['def_' + tags[resId] ], 0 );
		}
		
		var defActors = _lc_._collectDefActors();
		for ( var i=0; i<defActors.length; ++i ) {
			var actor = defActors[i];
			TQ.setTextEx(_lc_.m_items['def_' + tags[actor.getResId()] ], actor.getHP());
		}
	};
	
	_lc_._createActors = function(campName, actors, defaultDir){
		for ( var i=0; i<actors.length; ++i ) {
			var res = actors[i];
			var actor = Actor.snew(_lc_.m_g);
			actor.setParent(_lc_.m_items.map);
			actor.setId(res.id);
			actor.setType(res.type);
			actor.setName(res.name);
			actor.setCampName(campName);
			actor.setIcon(res.detail.icon);
			actor.setResId(_getCombineResId(res));
			actor.setDirection(defaultDir);
			actor.setPosition(_lc_.m_showRounds.getAbsPosition(res.pos));
			actor.setAction('stand');
			actor.setHP(res.detail.attrs[ATTR.HP], res.detail.attrs[ATTR.HP]);
			actor.setUnitHP(res.detail.attrs[ATTR.UHP]);
			actor.setObserver(_lc_._onActorHPChange);
			_lc_.m_g.getActorMgr().add(actor);
			if ( actor.getResId() == 150201 ) {
				_lc_.m_g.getActorMgr().setMainWallId(actor.getId());
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
	
	_lc_._getWallActor = function(){
		var wallActor = null;
		_travelCampActors( 'defender', function(actor){
			if (actor.getType() == ACTOR_TYPE.WALL 
				&& actor.getId() == _lc_.m_g.getActorMgr().getMainWallId() ){
				wallActor = actor;
			} });
		return wallActor;
	};	
	
	_lc_._hasWallActor = function(){
		return _lc_._getWallActor() != null;
	};		
	
	_lc_._collectDefActors = function(){
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
		for ( var i=0; i<_lc_.m_g.getActorMgr().getCount(); ++i ) {
			var actor = _lc_.m_g.getActorMgr().getByIdx(i);
			if (actor.getCampName() == campName) {
				travelCallback(actor);
			}
		}
	};	
	
	_lc_._onActorHPChange = function(actorId, type, value){
		_lc_._updateHPProgBar('attacker');
		_lc_._updateHPProgBar('defender');
		
		_lc_._updateHerosInfo('attacker');
		_lc_._updateHerosInfo('defender');
		
		_lc_._updateWallsInfo();
		_lc_._updateDefsInfo();
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
	var _lc_={};this.lc=function(){return _lc_;};
	var m_g = null;
	var m_this = null;
	_lc_.m_rounds = [];
	_lc_.m_mapOffsetPos = {x:0, y:0};
	_lc_.m_gridPixel = 1;
	
	this.init = function(g){
		m_this = this;
		m_g = g;
	};
	
	this.setMapPosInfo = function(mapOffsetPos, gridPixel){
		_lc_.m_mapOffsetPos = mapOffsetPos;
		_lc_.m_gridPixel = gridPixel;
	};
	
	this.getAbsPosition = function(refPos){
		return { x:_lc_.m_mapOffsetPos.x + refPos.x*_lc_.m_gridPixel
			,y:_lc_.m_mapOffsetPos.y + refPos.y*_lc_.m_gridPixel };
	};
	
	this.setRounds = function(rounds){
		_lc_.m_rounds = ConvertFightRounds.snew().splitRounds(rounds);
	};

	this.update = function(){
		m_g.getActorMgr().update();
		
		if ( _lc_._isAllRoundsEnd() ) {
			return;
		} 
		
		if ( _lc_._isCurRoundEnd() ) {
			_lc_._popRound();
		} else {
			_lc_._updateRound(_lc_._getCurRound());
			_lc_._removeDeletedActions(_lc_._getCurRound());
		}
	};
	
	this.isEnd = function(){
		return _lc_._isAllRoundsEnd();
	};
	
	this.skip = function(){
		_lc_.m_rounds = [];
		m_g.getActorMgr().clear();
	};
	
	_lc_._isAllRoundsEnd = function(){
		if ( _lc_.m_rounds.length > 0 ) return false;
		return _isAllActorsIdle();
	};
	
	_lc_._isCurRoundEnd = function(){
		if ( _lc_.m_rounds.length == 0 ) {
			return _lc_._isAllRoundsEnd();
		}
		
		var actions = _lc_.m_rounds[0];
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
	
	_lc_._popRound = function(){
		_lc_.m_rounds.splice(0,1);
	};
	
	_lc_._getCurRound = function(){
		return _lc_.m_rounds[0];
	};
	
	_lc_._updateRound = function(roundActions){
		for ( var i=0; i<roundActions.length; ++i ) {
			var action = roundActions[i];
			if (action.event == 'effect') {
				action.isDelete = _lc_._updateEffectEvent(action);
			} else if (action.event == 'addeff') {
				action.isDelete = _lc_._updateAddEffectEvent(action);
			} else if (action.event == 'removeeff') {
				action.isDelete = _lc_._updateRemoveEffectEvent(action);
			} else {
				_lc_._resetWallActorAction(action);
				action.isDelete = _lc_._updateStateEvent(action);
			}
		}
	};
	
	_lc_._updateEffectEvent = function(action){
		var target = m_g.getActorMgr().getById(action.targetid);
		if (!target) return true;
		if (!target.isIdle()) return false;
		
		EffectManager.addMapEffect(target.isHero(), action);
		return true;
	};
	
	_lc_._updateAddEffectEvent = function(action){
		var actor = m_g.getActorMgr().getById(action.id);
		if (!actor) return true;
		if (!actor.isIdle()) return false;
		
		var effects = EffectManager.createEffects(actor, action);
		for ( var k in effects ) {
			actor.getEffectContainer().add(effects[k]);
		}
		return true;
	};
	
	_lc_._updateRemoveEffectEvent = function(action){
		var actor = m_g.getActorMgr().getById(action.id);
		if (!actor) return true;
		if (!actor.isIdle()) return false;
		
		actor.getEffectContainer().remove(action.effuid);
		return true;
	};
	
	_lc_._resetWallActorAction = function(action){
		var stateType = _lc_._getStateType(action);
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
	
	_lc_._updateStateEvent = function(action){
		var stateType = _lc_._getStateType(action);
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
		
		var newAction = _lc_._convertMoveActionPaths(action);
		var state = StateFactory.createByType(user, target, stateType, newAction);
		user.setState(state);
		return true;
	};
	
	var _hasPreAction = function(seq, subseq){
		var actions = _lc_._getCurRound();
		for ( var i=0; actions && i<actions.length; ++i ) {
			var action = actions[i];
			if (action.seq == seq && action.subseq < subseq) {
				return true;
			}
		}
		return false;
	};
	
	_lc_._removeDeletedActions = function(roundActions){
		for ( var i=roundActions.length-1; i>=0; --i ) {
			if (roundActions[i].isDelete) {
				roundActions.splice(i, 1);
			}
		}		
	};
	
	_lc_._getStateType = function(action){
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
	
	_lc_._convertMoveActionPaths = function(action){
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
	var _lc_={};this.lc=function(){return _lc_;};
	_lc_.C_RESULT_WIN_ANIMID = 10000;
	_lc_.C_RESULT_FAIL_ANIMID = 10001;
	_lc_.C_RESULT_ZINDEX = 100000;
	_lc_.m_g = null;
	_lc_.m_dlg = null;
	var m_this = null;
	_lc_.m_items = null;
	_lc_.m_resultAnim = null;
	_lc_.m_armyId = null;
	_lc_.m_fightId = null;
	var m_append = null;
	
	this.init = function(g, dlg, items){
		m_this = this;
		_lc_.m_g = g;
		_lc_.m_dlg = dlg;
		_lc_.m_items = items;
	};
	
	this.initFight = function(armyId, fightId, append){
		if ( _lc_.m_resultAnim )  {
			_lc_.m_resultAnim.stop();
			_lc_.m_resultAnim = null;
		}
		
		_lc_.m_armyId = armyId;
		_lc_.m_fightId = fightId;
		m_append = append;
	};
	
	this.update = function(){
		_lc_._startResultEffect();
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
		if ( _lc_.m_resultAnim.isEnd() && !UIM.getDlg('worldbossresult').isShow() ) {
			var dlg = UIM.getDlg('worldbossresult');
			dlg.openDlg({hurt:m_append.hurt});
			dlg.setHideCaller({self:m_this, caller:_lc_._hideFightMapDlg});
		}
	};
	
	this._commResultCheck = function(){
		if ( _lc_.m_resultAnim.isEnd() && !_lc_._isResultUIShow() ) {
			_lc_._showResultUI();
		}
	};
	
	_lc_._startResultEffect = function(){
		if ( !_lc_.m_resultAnim ) {
			var fightDemo = _lc_.m_g.getImgr().getFightDemoRounds(_lc_.m_armyId, _lc_.m_fightId);
			var isMySucc = FightResultMaker.snew(_lc_.m_g).isMySucc(fightDemo);
			var animId = isMySucc ? _lc_.C_RESULT_WIN_ANIMID : _lc_.C_RESULT_FAIL_ANIMID;
			_lc_.m_resultAnim = _lc_.m_g.getAnimMgr().alloc(_lc_.m_items.map, animId);
			_lc_.m_resultAnim.setZIndex(_lc_.C_RESULT_ZINDEX);
			_lc_.m_resultAnim.setPosition(_lc_._getResultAnimPos());
			_lc_.m_resultAnim.play();
		}
	};
	
	_lc_._getResultAnimPos = function(){
		var clientSize = _lc_.m_g.getWinSizer().getValidClientSize();
		var animSize = _lc_.m_resultAnim.getSize();
		return {x:(clientSize.cx - animSize.cx)/2, y:(clientSize.cy - animSize.cy)/2};
	};
	
	_lc_._isResultUIShow = function(){
		return UIM.getDlg('fightresult').isShow();
	};
	
	_lc_._showResultUI = function(){
		var dlg = UIM.getDlg('fightresult');
		dlg.openDlg(_lc_.m_armyId, _lc_.m_fightId);
		dlg.setHideCaller({self:m_this, caller:_lc_._hideFightMapDlg});
	};
	
	_lc_._hideFightMapDlg = function(){
		_lc_.m_dlg.hide();
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
	




