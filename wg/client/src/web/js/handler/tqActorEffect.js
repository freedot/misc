/*******************************************************************************/
ActorEffect = Class.extern(function(){
	//ActorEffect-unittest-start
	var m_effectUID = 0;
	var m_offsetZIndex = 0;
	var m_offsetPos = {x:0, y:0};
	var m_zIndex = 0;
	var m_pos = {x:0, y:0};
	
	this.setId = function(uid){
		m_effectUID = uid;
	};
	
	this.getId = function(){
		return m_effectUID;
	};
	
	this.setOffsetZIndex = function(offsetZIndex){
		m_offsetZIndex = offsetZIndex;
	};
	
	this.setOffsetPos = function(offsetPos){
		TQ.dictCopy(m_offsetPos, offsetPos);
	};
	
	this.setZIndex = function(zIndex){
		m_zIndex = zIndex;
		this.update(this._getFactZIndex(), this._getFactPos());
	};
	
	this.setPosition = function(pos){
		TQ.dictCopy(m_pos, pos);
		this.update(this._getFactZIndex(), this._getFactPos());
	};
	
	this.update = function(zIndex, pos){};
	
	this._getFactZIndex = function(){
		return m_offsetZIndex + m_zIndex;
	};
	
	this._getFactPos = function(){
		return {x:m_pos.x + m_offsetPos.x, y:m_pos.y + m_offsetPos.y};
	};
	
	this.getAddHP = function(){return 0;};	
	
	this.getSubHP = function(){return 0;};	
	
	this.destory = function(){};
	//ActorEffect-unittest-end
});

ActorValueEffect = ActorEffect.extern(function(){
	//ActorValueEffect-unittest-start
	var m_g = null;
	var m_effect = null;
	var m_value = null;
	var m_subHP = 0;
	var m_addHP = 0;
	var m_isPlaying = false;
	
	this.init = function(g, parent){
		m_g = g;
		m_effect = g.getEntityfactory().allocNumEffect(parent);
		m_effect.setSize({cx:100, cy:30});
		m_effect.getEntity().setClass('actorValueEffect_front');
		m_effect.getBakEntity().setClass('actorValueEffect_back');
		//effect.setPos({x:x,y:y});
		//effect.setZOrder(80000);
	};
	
	this.setValue = function(val){
		m_value = val;
		m_effect.setNumber(val);
	};
	
	this.setColor = function(color){
		TQ.setCSS(m_effect.getEntity().getDomObj(), 'color', color);
	};
	
	this.setFontSize = function(fontSize, isBold){
		TQ.setCSS(m_effect.getEntity().getDomObj(), 'fontSize', fontSize + 'px');
		TQ.setCSS(m_effect.getBakEntity().getDomObj(), 'fontSize', fontSize + 'px');
		if ( isBold ) {
			TQ.setCSS(m_effect.getEntity().getDomObj(), 'fontWeight', 'bold');
			TQ.setCSS(m_effect.getBakEntity().getDomObj(), 'fontWeight', 'bold');
		}
	};
	
	this.setSubHP = function(subHP){
		m_subHP = subHP;
	};
	
	this.getSubHP = function(){
		return m_subHP;
	};
	
	this.setAddHP = function(addHP){
		m_addHP = addHP;
	};
	
	this.getAddHP = function(addHP){
		return m_addHP;
	};
	
	this.play = function(){
		if (m_isPlaying) return;
		
		m_effect.start();
		EUPD.appendEffect(m_effect, m_g.getEntityfactory().freeNumEffect);
		m_isPlaying = true;
	};
	
	this.update = function(zIndex, pos){
		m_effect.setZOrder(zIndex);
		m_effect.setPos(pos);
	};
	//ActorValueEffect-unittest-end
});

ActorAnimEffect = ActorEffect.extern(function(){
	//ActorAnimEffect-unittest-start
	var m_animId = 0;
	var m_anim = null;
	var m_isPlaying = false;
	
	this.init = function(g, parent, animId){
		m_animId = animId;
		m_anim = g.getAnimMgr().alloc(m_animId, parent);
	};
	
	this.play = function(){
		if (m_isPlaying) return;
		
		m_anim.play();
		m_isPlaying = true;
	};
	
	this.update = function(zIndex, pos){
		m_anim.setZIndex(zIndex);
		m_anim.setPosition(pos);
	};
	
	this.destory = function(){
		m_anim.stop();
	};
	//ActorAnimEffect-unittest-end
});

EffectManager = Class.extern(function(){
	//EffectManager-unittest-start
	var C_ADDEFF_BASE = 10000;
	var C_HEROEFF_BASE = 100000000;
	var m_g = null;
	var m_this = null;
	var m_effectsCfg = {};
	this.init = function() {
		m_effectsCfg[RES_EFF.F_CLT_SUBHP] = [{type:'value', subhp:true, zIndex:20000, pos:{x:0, y:-60}, color:'#ff0000', fontSize:12}];
		m_effectsCfg[RES_EFF.F_CLT_BERSERK_SUBHP] = [{type:'value', subhp:true, zIndex:20001, pos:{x:0, y:-60}, color:'#ff0000', fontSize:20, isBold:true}];
		m_effectsCfg[RES_EFF.F_CLT_MISS] = [{type:'value', zIndex:20002, pos:{x:0, y:-60}, color:'#ffff00', fontSize:12}];

		m_effectsCfg[RES_EFF.F_CUIDU3] = [{type:'value', subhp:true, zIndex:5, pos:{x:0, y:-50}, color:'#00ff00', fontSize:12}];
		m_effectsCfg[RES_EFF.F_SHENYI] = [{type:'anim',animId:10001, zIndex:6, pos:{x:0, y:-20}}, {type:'value', addhp:true, zIndex:7, pos:{x:0, y:-50}, color:'#0030ff', fontSize:12}];
		
		m_effectsCfg[RES_EFF.F_BISHA] = [{type:'anim',animId:10002, zIndex:9, pos:{x:0, y:-20}}, {type:'value', subhp:true, zIndex:10, pos:{x:0, y:-50}, color:'#ff0000', fontSize:20, isBold:true}];
		m_effectsCfg[RES_EFF.F_HUOGONG] = [{type:'anim',animId:10003, zIndex:11, pos:{x:0, y:-20}}, {type:'value', subhp:true, zIndex:12, pos:{x:0, y:-50}, color:'#ff0000', fontSize:16, isBold:true}];
		m_effectsCfg[RES_EFF.F_CHENGSHANG] = [{type:'anim',animId:10004, zIndex:13, pos:{x:0, y:-20}}];
		m_effectsCfg[RES_EFF.F_XIXUE] = [{type:'anim',animId:10005, zIndex:15, pos:{x:0, y:-20}}, {type:'value', addhp:true, zIndex:16, pos:{x:0, y:-50}, color:'#0030ff', fontSize:12}];
		m_effectsCfg[RES_EFF.F_JIPO] = [{type:'anim',animId:10011, zIndex:17, pos:{x:0, y:-20}}, {type:'value', subhp:true, zIndex:18, pos:{x:0, y:-50}, color:'#ff0000', fontSize:20, isBold:true}];
		m_effectsCfg[RES_EFF.F_ADD_HU] = [{type:'value', subhp:true, zIndex:19, pos:{x:0, y:-50}, color:'#ff0000', fontSize:12}]; // 偷袭
			
		m_effectsCfg[RES_EFF.F_ADD_FULLATTRS+C_ADDEFF_BASE] = [{type:'anim',animId:10006, zIndex:-100, pos:{x:0, y:1}}];
		m_effectsCfg[RES_EFF.F_XINGYUN+C_ADDEFF_BASE] = [{type:'anim',animId:10007, zIndex:-101, pos:{x:0, y:1}}];
		m_effectsCfg[RES_EFF.F_CUIDU3+C_ADDEFF_BASE] = [{type:'anim',animId:10008, zIndex:-102, pos:{x:0, y:1}}];
		m_effectsCfg[RES_EFF.F_XUERUO+C_ADDEFF_BASE] = [{type:'anim',animId:10009, zIndex:-106, pos:{x:0, y:1}}];
		
		// HERO EFFECT
		m_effectsCfg[RES_EFF.F_CLT_SUBHP + C_HEROEFF_BASE] = [{type:'value', subhp:true, zIndex:1, pos:{x:0, y:-60}, color:'#ff0000', fontSize:16}];
		m_effectsCfg[RES_EFF.F_CLT_BERSERK_SUBHP + C_HEROEFF_BASE] = [{type:'value', subhp:true, zIndex:2, pos:{x:0, y:-60}, color:'#ff0000', fontSize:26, isBold:true}];
		m_effectsCfg[RES_EFF.F_CLT_MISS + C_HEROEFF_BASE] = [{type:'value', zIndex:3, pos:{x:0, y:-60}, color:'#ffff00', fontSize:16}];

		m_effectsCfg[RES_EFF.F_CUIDU3 + C_HEROEFF_BASE] = [{type:'value', subhp:true, zIndex:5, pos:{x:0, y:-50}, color:'#00ff00', fontSize:16}];
		m_effectsCfg[RES_EFF.F_SHENYI + C_HEROEFF_BASE] = [{type:'anim',animId:20001, zIndex:6, pos:{x:0, y:-20}}, {type:'value', addhp:true, zIndex:7, pos:{x:0, y:-50}, color:'#0030ff', fontSize:16}];
		
		m_effectsCfg[RES_EFF.F_BISHA + C_HEROEFF_BASE] = [{type:'anim',animId:20002, zIndex:9, pos:{x:0, y:-20}}, {type:'value', subhp:true, zIndex:10, pos:{x:0, y:-60}, color:'#ff0000', fontSize:26, isBold:true}];
		m_effectsCfg[RES_EFF.F_HUOGONG + C_HEROEFF_BASE] = [{type:'anim',animId:20003, zIndex:11, pos:{x:0, y:-20}}, {type:'value', subhp:true, zIndex:12, pos:{x:0, y:-50}, color:'#ff0000', fontSize:16}];
		m_effectsCfg[RES_EFF.F_CHENGSHANG + C_HEROEFF_BASE] = [{type:'anim',animId:20004, zIndex:13, pos:{x:0, y:-20}}];
		m_effectsCfg[RES_EFF.F_XIXUE + C_HEROEFF_BASE] = [{type:'anim',animId:20005, zIndex:15, pos:{x:0, y:-20}}, {type:'value', addhp:true, zIndex:16, pos:{x:0, y:-50}, color:'#0030ff', fontSize:16}];
		m_effectsCfg[RES_EFF.F_JIPO + C_HEROEFF_BASE] = [{type:'anim',animId:20011, zIndex:17, pos:{x:0, y:-20}}, {type:'value', subhp:true, zIndex:18, pos:{x:0, y:-50}, color:'#ff0000', fontSize:26, isBold:true}];
		m_effectsCfg[RES_EFF.F_ADD_HU + C_HEROEFF_BASE] = [{type:'value', subhp:true, zIndex:19, pos:{x:0, y:-60}, color:'#ff0000', fontSize:16}];
			
		m_effectsCfg[RES_EFF.F_ADD_FULLATTRS+C_ADDEFF_BASE + C_HEROEFF_BASE] = [{type:'anim',animId:20006, zIndex:-100, pos:{x:0, y:1}}];
		m_effectsCfg[RES_EFF.F_XINGYUN+C_ADDEFF_BASE + C_HEROEFF_BASE] = [{type:'anim',animId:20007, zIndex:-101, pos:{x:0, y:1}}];
		m_effectsCfg[RES_EFF.F_CUIDU3+C_ADDEFF_BASE + C_HEROEFF_BASE] = [{type:'anim',animId:20008, zIndex:-102, pos:{x:0, y:1}}];
		m_effectsCfg[RES_EFF.F_XUERUO+C_ADDEFF_BASE + C_HEROEFF_BASE] = [{type:'anim',animId:20009, zIndex:-106, pos:{x:0, y:1}}];
	};
	
	this.initOneTime = function(g){
		m_g = g;
		m_this = this;
	};
	
	this.addMapEffect = function(isHero, action){
		if ( action.effects ) {
			for ( var k in action.effects ) {
				_addMapEffect(isHero, action.effects[k]);
			}
		} else {
			_addMapEffect(isHero, action);
		}
	};
	
	this.createEffects = function(actor, effectAction){
		var parent = actor.getParent();
		var isHero = actor.isHero();
		
		var cfgs = _findCfgBy(effectAction.event, isHero, effectAction.effid);
		if ( !cfgs ) return [];
		
		var effects = [];
		for ( var i=0; i<cfgs.length; ++i ) {
			var cfg = cfgs[i];
			if ( cfg.type == 'value' ) {
				effects.push ( _createValueEffect(parent, cfg, effectAction.val, actor.getHP(), actor.getMaxHP(), actor.getUnitHP()) );
			} else if ( cfg.type == 'anim' ) {
				var effuid = effectAction.effuid ? effectAction.effuid : (100000 + effectAction.effid);
				effects.push ( _createAnimEffect(effuid, parent, cfg) );
			}
		}
		return effects;
	};
	
	var _addMapEffect = function(isHero, effectRes){
		var user = m_g.getActorMgr().getById(effectRes.userid);
		var target = m_g.getActorMgr().getById(effectRes.targetid);
		var effects = m_this.createEffects(target, effectRes);
		for ( var k in effects ) {
			var effect = effects[k];
			effect.setPosition( target.getPosition() );
			effect.setZIndex( target.getZIndex() );
			target.addHP(effect.getAddHP());
			target.subHP(effect.getSubHP());
			if (user.isDef()) user.subHP(_calcCityDefActorHP(user, effect.getSubHP()));
			effect.play();
		}
	};
	
	var _calcCityDefActorHP = function(user, rawHP){
		var defType = user.getResId() - 150301 + CITYDEF_TYPE.FIRST;
		return Math.floor(rawHP/res_citydefs_hurt_bytype[defType]);
	};
	
	var _findCfgBy = function(eventName, isHero, effectId){
		if (eventName == 'addeff' ) effectId += C_ADDEFF_BASE;
		if (isHero ) effectId += C_HEROEFF_BASE;
		return m_effectsCfg[effectId];
	};
	
	var _createValueEffect = function(parent, cfg, value, curHP, maxHP, unitHP){
		var effect = ActorValueEffect.snew(m_g, parent);
		effect.setValue(_calcSoldierNumber(cfg.subhp, cfg.addhp, value, curHP, maxHP, unitHP));
		effect.setOffsetZIndex(cfg.zIndex);
		var offsetPos = {x:cfg.pos.x - 50, y:cfg.pos.y};
		effect.setOffsetPos(offsetPos);
		effect.setColor(cfg.color);
		effect.setFontSize(cfg.fontSize, cfg.isBold);
		if (cfg.subhp ) {
			effect.setSubHP(value);
		} else if ( cfg.addhp ) {
			effect.setAddHP(value);
		}
		return effect;
	};
	
	var _calcSoldierNumber = function(isSubHP, isAddHP, changeHP, curHP, maxHP, unitHP) {
		var curSoldierNum = Math.floor(curHP/unitHP);
		var maxSoldierNum = Math.floor(maxHP/unitHP);
		if (isSubHP) {
			var changeSoldierNum = Math.ceil(changeHP/unitHP);
			var ret = Math.min(changeSoldierNum, curSoldierNum);
			if ( isNaN(ret) ) {
				ret = 0;
				_errorValAlert(isSubHP,isAddHP,changeHP,curHP,maxHP,unitHP,curSoldierNum,maxSoldierNum,changeSoldierNum);
			}			
			return ret;
		} else if (isAddHP) {
			var changeSoldierNum = Math.ceil(changeHP/unitHP);
			var ret = Math.min(changeSoldierNum, maxSoldierNum - curSoldierNum);
			if ( isNaN(ret) ) {
				ret = 0;
				_errorValAlert(isSubHP,isAddHP,changeHP,curHP,maxHP,unitHP,curSoldierNum,maxSoldierNum,changeSoldierNum);
			}
			return ret;
		} else {
			return changeHP;
		}
	};
	
	var _errorValAlert = function(isSubHP,isAddHP,changeHP,curHP,maxHP,unitHP,curSoldierNum,maxSoldierNum,changeSoldierNum){
		if (IS_DEBUG == true) {
			alert('isSubHP:' + isSubHP
				+ ',isAddHP:' + isAddHP
				+ ',changeHP:' + changeHP
				+ ',curHP:' + curHP
				+ ',maxHP:' + maxHP
				+ ',unitHP:' + unitHP
				+ ',curSoldierNum:' + curSoldierNum
				+ ',maxSoldierNum:' + maxSoldierNum
				+ ',changeSoldierNum:' + changeSoldierNum
			);
		}		
	};
	
	var _createAnimEffect = function(effuid, parent, cfg) {
		var effect = ActorAnimEffect.snew(m_g, parent, cfg.animId);
		effect.setId(effuid);
		effect.setOffsetZIndex(cfg.zIndex);
		effect.setOffsetPos(cfg.pos);
		return effect;
	};
	//EffectManager-unittest-end
}).snew();
