
COLORS = {
	APPEND_ATTR : '#33ff33' // 君主和武将附加属性的显示颜色
	,ITEM_TIP_FORCELEVELLBL : '#EAD16D' // 道具tip装备的强化等级标签颜色
	,FORCELEVELSTAR : '#F3D825' // 装备的强化等级星星颜色
	,EMPTY_FORCELEVELSTAR : '#808080' // 装备的强化等级空星颜色
	,ITEM_TIP_DESC : '#FEFEFE' // 道具tip中描述文字的颜色
	,ITEM_TIP_BIND : '#FEFEFE' // 道具tip中绑定文字的颜色
	,ITEM_TIP_BASEATTR : '#33ff33' // 道具tip中基础属性的颜色
	,ITEM_TIP_SPEEDATTR : '#5685A1' // 道具tip中出阵速度属性的颜色
	,ITEM_TIP_SECATTR : '#8D5989' // 道具tip中二级属性的颜色
	,ITEM_TIP_SKILLLEVELATTR : '#8E5989' // 道具tip中增加技能属性的颜色
	,ITEM_TIP_BESETGEMLBL : '#EAD16D' // 道具tip中宝石镶嵌数量的颜色
	,ITEM_TIP_BESETGEMNAME : '#33ff33' //  道具tip中镶嵌的宝石名称的颜色
	,ITEM_TIP_SALELPRICE : '#EAD16D' //  道具tip中卖价的颜色
	,ITEM_TIP_BUYLIMIT : '#EAD16D' //  道具tip中可购买次数的颜色
	,FRIENDCHAT_MYCOLOR: '#00FFFF' // 朋友聊天中我方的颜色
	,FRIENDCHAT_OTHERCOLOR: '#FFFFFF' // 朋友聊天中对方的颜色
	,NO_ENOUGH_ITEM: '#FF3300' // 所需道具不足
	,ENOUGH_ITEM: '#33ff33' // 所需道具足
	,HERO_TIP_BASEATTR : '#FEFEFE' // 武将基础属性的颜色
	,VALID_ROLE_NAME : '#20ff20'
	,INVALID_ROLE_NAME : '#ff0000'
	,ENOUGH_SIGNINDAYS: 'green' // 签到时间够
	,NOENOUGH_SIGNINDAYS: 'red' // 签到时间不够
	,ROLESTATE_NORMAL : '#20ff20' // 君主战斗关系-正常
	,ROLESTATE_DECLARING_FIGHT : '#f3d825' // 君主战斗关系-宣战
	,ROLESTATE_FIGHTING : '#ff3300' // 君主战斗关系-战斗
	,HEALTH_HEALTH : '#20ff20' // 武将健康
	,HEALTH_FLESH_WOUND : '#f0f060' // 武将轻伤
	,HEALTH_DEEP_WOUND : '#ff3300' // 武将重伤
	
	,SKILL_TIP_NAME : '#00FFFF' // 技能名称
	,SKILL_TIP_FIVE_ELEM : '#FFFF00' // 技能五行
	,SKILL_TIP_DESC : '#40FF00' // 技能描述
	,SKILL_TIP_NEXTLEVEL : '#FF0000' // 技能下级描述
	
	,ENOUGH_GOLD : '#33ff33' // 
	,NOTENOUGH_GOLD : '#FF3300' // 
};

HEALTH_TYPE = {
	HEALTH : 0 // 健康
	,FLESH_WOUND : 1 //  轻伤
	,DEEP_WOUND : 2 // 重伤
};


ITEM_COLORS = [
	'#fefefe'  // 白色
	,'#30ff30' // 绿色
	,'#3080ff' // 蓝色
	,'#AD23CE' // 紫色
	,'#ff8040' // 橙色
	,'#ff3030' // 红色
];

HERO_COLORS = [
	'#fefefe'  // 白色     内功 < 50
	,'#30ff30' // 绿色    内功 < 150
	,'#3080ff' // 蓝色    内功 < 250
	,'#AD23CE' // 紫色  内功 < 350
	,'#ff8040' // 橙色    内功 < 450
	,'#ff3030' // 红色    内功 < 10000
];

HeroNAttrColorGetter = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var m_this = null;
	
	this.init = function(g){
		m_this = this;
	};
	
	this.getColorVal = function(prof, attr, val){
		var colorVal = TQ.formatColorStr(val, _lc_._getColor(prof, attr, val));
		return colorVal;
	};
	
	this.getLevel = function(prof, attr, val){
		var maxLevel = 5;
		var maxVal = res_heronature_max_attrs[prof][attr];
		if (val > maxVal) {
			maxLevel = 6;
		}
		var perLevelVal = (maxVal - res_heronature_min_attrval)/maxLevel;
		var curLevel = Math.floor((val - res_heronature_min_attrval)/perLevelVal) + 1;
		return (curLevel > maxLevel) ? maxLevel : curLevel; 
	};
	
	_lc_._getColor = function(prof, attr, val) {
		var color = ITEM_COLORS[m_this.getLevel(prof, attr, val)-1];
		if ( !color ) return ITEM_COLORS[0];
		return color;
	};
	//HeroNAttrColorGetter-unittest-end
}).snew();

HeroNAttrFactorColorGetter = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var m_this = null;
	var m_g = null;
	var m_valranges = [
		{min:3.3, max:12.1}
		,{min:12.2, max:13.2}
		,{min:13.3, max:14.3}
		,{min:14.4, max:15.4}
		,{min:15.5, max:res_nattr_max_level}
		,{min:res_nattr_max_level+1, max:1000}
		];
	
	this.init = function(){
		m_this = this;
	};
	
	this.initOneTime = function(g){
		m_g = g;
	};
	
	this.getNatureFactor = function(hero){
		return _lc_._getNatureFactor(hero);
	};
	
	this.getColorVal = function(hero){
		var val = _lc_._getNatureFactor(hero);
		var colorVal = TQ.formatColorStr(val, _lc_._getColor(val));
		return colorVal;
	};
	
	this.isMaxVal = function(hero){
		var val = _lc_._getNatureFactor(hero);
		return Math.abs(val - res_nattr_max_level) < 0.0001;
	};
	
	this.getBorderClass = function(hero){
		var val = _lc_._getNatureFactor(hero);
		return 'item_icon_border_level' + _lc_._getLevel(val);
	};
	
	_lc_._getColor = function(val) {
		var color = ITEM_COLORS[_lc_._getLevel(val)-1];
		if ( !color ) return ITEM_COLORS[0];
		return color;
	};
	
	_lc_._getLevel = function(val){
		for ( var i=0; i<m_valranges.length; ++i ) {
			var vr = m_valranges[i];
			if ( val >= vr.min && val <= vr.max ) {
				return i+1;
			}
		}
		return 0;
	};
	
	_lc_._getNatureFactor = function(hero){
		var nattrs = {};
		nattrs[ATTR.AG_B] = ATTR.NAG;
		nattrs[ATTR.PH_B] = ATTR.NPH;
		nattrs[ATTR.ST_B] = ATTR.NST;
		
		var resattrs = res_hero_main_sec_last_attrs['prof'+hero.prof].attrs;
		var mainNAttr = nattrs[resattrs[0]];
		var secNAttr = nattrs[resattrs[1]];
		var lastNAttr = nattrs[resattrs[2]];
		
		var imgr = m_g.getImgr();
		var mainFactor = HeroNAttrColorGetter.getLevel( hero.prof, mainNAttr, imgr.getHeroAttrVal(hero, mainNAttr) );
		var secFactor = HeroNAttrColorGetter.getLevel( hero.prof, secNAttr, imgr.getHeroAttrVal(hero, secNAttr) );
		var lastFactor = HeroNAttrColorGetter.getLevel( hero.prof, lastNAttr, imgr.getHeroAttrVal(hero, lastNAttr) );
		
		if ( hero.prof == HERO_PROF.YONGSHI ) {
			return (1.1*mainFactor + 1.1*secFactor + 1.1*lastFactor).toFixed(1);
		} else {
			return (1.2*mainFactor + 1.1*secFactor + 1.0*lastFactor).toFixed(1);
		}
	};
	
	//HeroNAttrFactorColorGetter-unittest-end
}).snew();


SubjectColorGetter = Class.extern(function(){
	this.getColorVal = function(subjectLevel) {
		var colorIdx = subjectLevel - 1;
		if ( colorIdx < 0 ) {
			colorIdx = 0;
		}
		return TQ.formatColorStr(rstr.herodlg.lbl.subjectlevel[subjectLevel], ITEM_COLORS[colorIdx]);
	};
}).snew();

ItemNameColorGetter = Class.extern(function(){
	this.getColorVal = function(itemLevel, itemName) {
		var colorIdx = 0;
		if ( itemLevel ) {
			colorIdx = itemLevel - 1;
		}
		
		if ( colorIdx < 0 ) {
			colorIdx = 0;
		}
		return TQ.formatColorStr(itemName, ITEM_COLORS[colorIdx]);
	};
}).snew();

HeroNameColorGetter = Class.extern(function(){
	var m_g = null;
	this.initOneTime = function(g){
		m_g = g;
	};
	
	this.getColorName = function(hero) {
		var innerForce = m_g.getImgr().getHeroAttrVal(hero, ATTR.IF);
		var colorIdx = 0;
		if ( innerForce < 50 ) {
			colorIdx = 0;
		} else if ( innerForce < 150 ) {
			colorIdx = 1;
		} else if ( innerForce < 250 ) {
			colorIdx = 2;
		} else if ( innerForce < 350 ) {
			colorIdx = 3;
		} else if ( innerForce < 450 ) {
			colorIdx = 4;
		} else {
			colorIdx = 5;
		}
		return TQ.formatColorStr( hero.name, HERO_COLORS[colorIdx] );
	};
}).snew();