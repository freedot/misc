C_BESETGEMCOLOR = '#Ef9000';
C_INTENSIFYCOLOR = '#00F0FF';
C_BASE_ATTRS_SET = null;
C_TIP_NEWLINE = '<br/>';
C_TIP_SPACE = '&nbsp;';
C_TIP_TWO_SPACE = C_TIP_SPACE + C_TIP_SPACE;
C_TIP_FOUR_SPACE = C_TIP_TWO_SPACE + C_TIP_TWO_SPACE;
C_TIP_SPLITLINE = '<hr class="ui-split"/>';
C_TIP_REDCOLOR = '#FF2000';
C_TIP_GREENCOLOR = '#20FF20';
C_TIP_VALIDCOLOR = C_TIP_GREENCOLOR;
C_TIP_INVALIDCOLOR = C_TIP_REDCOLOR;
C_TIP_VSPACE = '<div style="HEIGHT:8px;FONT-SIZE:8px;OVERFLOW:hidden;"></div>';

ListToDisc = function(list){
	var disc = {};
	for ( var k in list ){
		disc[list[k]] = true;
	}
	return disc;
};

AttrsCommHdr = function(item, attrs, resattrs, filters){
	if ( !attrs ) return szTip;
	
	var _getIntensifyAttr = function(attrid, attr){
		var tip = '';
		if ( !C_BASE_ATTRS_SET ) {
			C_BASE_ATTRS_SET = TQ.listToSet([ATTR.CO, ATTR.HI, ATTR.HU, ATTR.DE, ATTR.SP, ATTR.ES, ATTR.MA]);			
		}
		if ( C_BASE_ATTRS_SET[attrid] && item.ilevel ){
			var addbattrper = res_intensify[item.ilevel-1].addbattrper;
			var addval = parseInt(attr.val * addbattrper / 100, 10);
			if ( addval > 0 ) tip = '<font color="'+C_INTENSIFYCOLOR+'">(+' + addval + ')</font>';
		}
		return tip;
	};
	
	var _combineAttr = function(szTip, attrid, attrRes, attr, name){
		szTip += szTip != '' ? '<br/>' : '';
		szTip += attrRes.name + rstr.comm.colon + name;
		szTip += _getIntensifyAttr(attrid, attr);
		szTip += (attr.u == VAL_UNIT.PER) ? '%' : '';
		return szTip;
	};
	
	var pairattrs = [ [ATTR.ST_B, ATTR.ST_A], [ATTR.AG_B, ATTR.AG_A], [ATTR.PH_B, ATTR.PH_A] ];
	var _isPairBaseAttr = function(attrid) {
		for ( i in pairattrs ) {
			if ( pairattrs[i][0] == attrid ) return true;
		}
		return false;
	};
	
	var _isPairAppendAttr = function(attrid) {
		for ( i in pairattrs ) {
			if ( pairattrs[i][1] == attrid ) return true;
		}
		return false;
	};
	
	var _getRefAppendAttrVal = function(attrs, baseattrid) {
		var appendattrid = 0;
		for ( i in pairattrs ) {
			if ( pairattrs[i][0] == baseattrid )  {
				appendattrid = pairattrs[i][1];
			}
		}
		
		for ( var k in attrs ) {
			var attr = attrs[k];
			var attrid = attr.id ? attr.id : k;
			if ( attrid == appendattrid ) return attr.val;
		}
		return 0;
	};
	
	var szTip = '';
	for ( var k in attrs ) {
		var attr = attrs[k];
		var attrid = attr.id ? attr.id : parseInt(k, 10);
		if ( filters[attrid] ){
			continue;
		}
		var attrRes = TQ.qfind(resattrs , 'id', attrid );
		if ( !attrRes ){
		}
		else if ( _isPairAppendAttr(attrid) ) { 
			// skip, it be add to base attr val
		}
		else if ( _isPairBaseAttr(attrid) ) {
			var appendval = _getRefAppendAttrVal(attrs, attrid);
			szTip = _combineAttr(szTip, attrid, attrRes, attr, attr.val + appendval);
		}
		else if ( attrid == ATTR.EL ){
			szTip = _combineAttr(szTip, attrid, attrRes, attr, rstr.herodlg.elements[attr.val]);
		}
		else{
			szTip = _combineAttr(szTip, attrid, attrRes, attr, attr.val);
		}
	}
	return szTip != '' ? szTip + '<br/>' : '';
};


CommAttrsTipGetter = Class.extern(function(){
//CommAttrsTipGetter-unittest-start
	this.get = function(item, lbls, attrIds, color){
		if ( !item.attrs ) {
			return '';
		}
		
		var s = '';
		for ( var i=0; i<attrIds.length; ++i ) {
			var attrId = attrIds[i];
			var baseAttr = item.attrs[attrId.base];
			var appendAttr = item.attrs[attrId.append];
	
			var hasBaseAttr = baseAttr && baseAttr.val > 0 ;
			var hasAppendAttr = appendAttr && appendAttr.val > 0 ;
			if ( !hasBaseAttr && !hasAppendAttr ) {
				continue;
			}
			
			var attrVal = _getArmAttr(baseAttr);
			
			if ( hasBaseAttr && hasAppendAttr ) {
				attrVal += '(';
			}
			
			if ( hasAppendAttr ) {
				attrVal += '+';
			}
			
			attrVal += _getArmAttr(appendAttr);
			
			if ( hasBaseAttr && hasAppendAttr ) {
				attrVal += ')';
			}
			
			s += _getLabel(lbls, i, (attrId.base>0) ? attrId.base:attrId.append) + TQ.formatColorStr(attrVal, color) + C_TIP_NEWLINE;
		}
		return s;
	};
	
	var _getArmAttr = function(attr){
		if (!attr) {
			return '';
		}
		
		if (attr.val==0) {
			return '';
		}
		
		if (attr.u == VAL_UNIT.VAL) {
			return attr.val;
		}
		else if (attr.u == VAL_UNIT.PER) {
			return attr.val + '%';
		}
		
		return '';
	};	
	
	var _getLabel = function(lbls, index, attrId){
		if (lbls != null) { 
			return lbls[index];
		}
		
		var attrRes = TQ.qfind(res_attrs , 'id', attrId );
		if (!attrRes || !attrRes.name) {
			return attrId;
		}
		
		return attrRes.name + rstr.comm.colon;
	};
	
//CommAttrsTipGetter-unittest-end
}).snew();

NatureAttrsCommHdr = function(hero, attrs, resattrs){
	if ( !attrs ) return '';
	
	var szTip = '';
	var nattrIds = [ATTR.NST, ATTR.NAG, ATTR.NPH];
	for ( var i=0; i<nattrIds.length; ++i ) {
		var attrid = nattrIds[i];
		var attrRes = TQ.qfind(resattrs , 'id', attrid );
		var attr = attrs[attrid];
		szTip += (szTip != '') ? '<br/>' : '';
		szTip += attrRes.name + rstr.comm.colon + HeroNAttrColorGetter.getColorVal(hero.prof, attrid, attr.val);
	}
	return szTip;
};

ExpendCommHdr = function(g, item, expend, hero){
	var val = 0;
	var actor = g.getActorMgr().getMainActor();
	try{
		var HLVL = (actor && actor.getAttr(ATTR.LVL)) ? actor.getAttr(ATTR.LVL).val : 1; // hero level
		if ( hero && !actor ) HLVL = hero.level;
		var SLVL = item.level; // skill level
		val = parseInt(eval(expend.val), 10);
	}
	catch(e){
		val = expend.val;
	}
	var isvalid = ( actor && (actor.getAttr(expend.attr).val > val) );
	if ( hero ) isvalid = hero.attrs(expend.attr).val > val;
	return {val:val, valid:isvalid};
};

PerBarHdr = function(){
	var C_TIP_NEWLINE = '<br/>';
	
	this.init = function(){
	};
	
	this.getHeroHpInfo = function(hero){
		return _getHeroAttrBarInfo(hero.attrs, 'hp', ATTR.HP, ATTR.MHP, _getHpPerBar);
	};
	
	this.getHeroMpInfo = function(hero){
		return _getHeroAttrBarInfo(hero.attrs, 'mp', ATTR.MP, ATTR.MMP, _getMpPerBar);
	};
	
	this.getHeroMStrInfo = function(hero){
		return _getHeroAttrBarInfo(hero.attrs, 'mstr', ATTR.CA, ATTR.MCA, _getMStrPerBar);
	};
	
	this.getActorHpInfo = function(actor){
		return _getHeroAttrBarInfo(actor.getAttrs(), 'hp', ATTR.HP, ATTR.MHP, _getHpPerBar);
	};
	
	this.getActorMpInfo = function(actor){
		return _getHeroAttrBarInfo(actor.getAttrs(), 'mp', ATTR.MP, ATTR.MMP, _getMpPerBar);
	};
	
	this.getActorMStrInfo = function(actor){
		return _getHeroAttrBarInfo(actor.getAttrs(), 'mstr', ATTR.CA, ATTR.MCA, _getMStrPerBar);
	};
	
	var _getHeroAttrBarInfo = function(attrs, tiptag, curattr, maxattr, getbarcaller){
		if ( attrs && attrs[curattr] && attrs[maxattr] ){
			return rstr.fight.tooltip[tiptag] + getbarcaller(attrs[curattr].val, attrs[maxattr].val)+C_TIP_NEWLINE;
		}
		return '';
	};
	
	var _getHpPerBar = function(curval, range){
		return _getPerBar('perbarred50.gif', 'perbarborder50.gif', 50, curval, range, true);
	};
	
	var _getMpPerBar = function(curval, range){
		return _getPerBar('perbarblue50.gif', 'perbarborder50.gif', 50, curval, range, true);
	};
	
	var _getMStrPerBar = function(curval, range){
		return _getPerBar('perbargreen50.gif', 'perbarborder50.gif', 50, curval, range, true);
	};
	
	var _getPerBar = function(barimg, borderimg, barwidth, curval, range, isshowval){
		var perpixel = parseInt(barwidth*curval/range)-barwidth;
		var fullbarimg = IMG.makeImg('comm/perbar/'+barimg);
		var fullborderimg = IMG.makeImg('comm/perbar/'+borderimg);
		var szTip  = '<img src="'+fullborderimg+'"';
		szTip += ' style="WIDTH:'+barwidth+'px; HEIGHT:7px; BACKGROUND:url('+fullbarimg+') '+perpixel+'px 50%;"/>';
		if ( isshowval ){
			szTip += ' '+curval+'/'+range;
		}
		return szTip;
	};
	
	this.init.apply(this, arguments);		
};

PERBARHDR = new PerBarHdr();

ActorTooltip = function(){
	//-----------
	//private:const
	//-----------
	var C_TIP_NEWLINE = '<br/>';
	
	//-----------
	//private:data
	//-----------
	var m_g;

	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
	};
	
	this.getItemDesc = function(actor){
		return _getActorTipDesc(actor);
	};
	
	//-----------
	//private:method
	//-----------
	var _getActorTipDesc = function(actor){
		var szTip = '<div class=actortip>';
		szTip += _getActorName(actor);
		szTip += _getActorResDesc(actor);
		var attrs = {};
		attrs[ATTR.LVL] = actor.getAttr(ATTR.LVL);
		szTip += AttrsCommHdr(actor, attrs, res_attrs, []);
		szTip += PERBARHDR.getActorHpInfo(actor);
		szTip += PERBARHDR.getActorMpInfo(actor);
		szTip += PERBARHDR.getActorMStrInfo(actor);
		var filters = [ATTR.LVL,ATTR.HP,ATTR.MHP,ATTR.MP,ATTR.MMP,ATTR.AR]; 
		szTip += AttrsCommHdr(actor, actor.getAttrs(), res_attrs, ListToDisc(filters));
		szTip += '</div>';
		return szTip;
	};
	
	var _getActorName = function(actor){
		var szTip = '<center><b>'+actor.getName() + '</b> ';
		if ( actor.getFlag() <= FACTOR_FLAG.SELF_SOLDIER){
			szTip += rstr.fight.tooltip.allis.self;
		}
		else if ( actor.getFlag() <= FACTOR_FLAG.FRIEND_SOLDIER){
			szTip += rstr.fight.tooltip.allis.friend;
		}
		else{
			szTip += rstr.fight.tooltip.allis.enemy;
		}
		return szTip+'</center>';
	};
	
	var _getActorResDesc = function(actor){
		var itemres = actor.getItemres();
		if ( itemres && itemres.desc && itemres.desc != '' ){
			return itemres.desc + C_TIP_NEWLINE;
		}
		return '';
	};

	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);		
};

SkillTooltip = Class.extern(function(){
	//SkillTooltip-unittest-start
	var m_g;

	this.init = function(g){
		m_g = g;
	};
	
	this.getItemDesc = function(hero, skill){
		ItemResUtil.initItemres(skill, 'id');
		var s = '<div class="itemtip">';
		s += _getSkillName(hero, skill);
		s += _getSkillFiveElem(hero, skill);
		s += _getSkillDescInfo(hero, skill);
		s += _getSkillDex(skill);
		s += _getNextSkillDesc(hero, skill);
		s += _getOpTip(skill);
		s += '</div>';
		return s;
	};
	
	var _getSkillName = function(hero, skill){
		var skillLevel = skill.level;
		var addLevelVal = AddLevelByHeroFiveElemAttr.getAddLevel(m_g, hero, skill.itemres);
		if (addLevelVal > 0) {
			skillLevel = skillLevel + '(' + TQ.formatColorStr('+' + addLevelVal, COLORS.APPEND_ATTR) + ')';
		}
		
		var s = '<center><b>'+skill.itemres.name+'</b> '+TQ.format(rstr.comm.flevel, skillLevel)+'</center>';
		return TQ.formatColorStr(s, COLORS.SKILL_TIP_NAME);
	};
	
	var _getSkillFiveElem = function(hero, skill){
		var s = rstr.skillTip.fiveElems[skill.itemres.fiveelem];
		return TQ.formatColorStr(s, COLORS.SKILL_TIP_FIVE_ELEM) + C_TIP_NEWLINE;
	};
	
	var _getSkillDescInfo = function(hero, skill){
		var s = _getDescByLevel(skill.itemres, _getFinalSkillLevel(hero, skill));
		return TQ.formatColorStr(s, COLORS.SKILL_TIP_DESC) + C_TIP_NEWLINE;
	};
	
	var _getSkillDex = function(skill){
		if ( skill.level == res_hero_baseskill_maxlevel ) return '';
		
		var updnextres = TQ.qfind(res_heroskills_upd, 'level', skill.level+1);
		if ( updnextres == null ) return '';
		
		var s = rstr.herodlg.lbl.skilldex + ' ' + skill.dex + '/' + updnextres.needdex;
		return s + C_TIP_NEWLINE;
	};
	
	var _getNextSkillDesc = function(hero, skill){
		if ( skill.level == res_hero_baseskill_maxlevel ) return '';
		
		var s = C_TIP_NEWLINE;
		s += rstr.herodlg.lbl.nextskill + C_TIP_NEWLINE;
		s += _getDescByLevel(skill.itemres, _getFinalSkillLevel(hero, skill)+1);
		s += C_TIP_NEWLINE;
		s = TQ.formatColorStr(s, COLORS.SKILL_TIP_NEXTLEVEL);
		return s;
	};
	
	var _getOpTip = function(skill){
		if ( skill.level == res_hero_baseskill_maxlevel ) return '';
		
		return C_TIP_NEWLINE + rstr.herodlg.lbl.steelskilltip;
	};
	
	var _getDescByLevel = function(itemres, level) {
		var replaces = {};
		for ( var i=0; i<itemres.effects.length; ++i ) {
			var effect = itemres.effects[i];
			if ( effect.id == 0 ) continue;
			
			var LV = level;
			replaces['{'+(i+1)+'.'+'pro}'] = Math.round(eval(effect.pro)*10)/10;
			replaces['{'+(i+1)+'.'+'val}'] = Math.round(eval(effect.val)*10)/10;
		}
		
		var s = itemres.desc;
		for ( var k in replaces ) {
			s = s.replace(k, replaces[k]);
		}
		return s;
	};
	
	var _getFinalSkillLevel = function(hero, skill){
		var addLevelVal = AddLevelByHeroFiveElemAttr.getAddLevel(m_g, hero, skill.itemres);
		return skill.level + addLevelVal;
	};
	
	//SkillTooltip-unittest-end
});


TacticSkillTooltip = function(){
	var m_g;

	this.init = function(g){
		m_g = g;
	};
	
	this.getItemDesc = function(skill, showop){
		return _getItemTipDesc(skill, showop);
	};
	
	// showop : 'original', 'weared'
	var _getItemTipDesc = function(skill, showop){
		ItemResUtil.initItemres(skill, 'id');
		var s = '<div class="itemtip">';
		s += _getSkillName(skill);
		s += _getSkillDescInfo(skill);
		if (showop == 'original') s += _getOriginalOpTip(skill);
		else if (showop == 'weared') s += _getWearedOpTip(skill);
		s += '</div>';
		return s;
	};
	
	var _getSkillName = function(skill){
		return '<center><b>'+skill.itemres.name+'</b> '+TQ.format(rstr.comm.flevel, skill.level)+'</center>';
	};
	
	var _getSkillDescInfo = function(skill){
		return skill.itemres.desc + C_TIP_NEWLINE;
	};
	
	var _getOriginalOpTip = function(skill){
		if ( skill.level == 0 ) {
			return C_TIP_NEWLINE + rstr.herodlg.lbl.learntacticskilltip;
		}
		else {
			return C_TIP_NEWLINE + rstr.herodlg.lbl.weartacticskilltip;
		}
	};
	
	var _getWearedOpTip = function(){
		return C_TIP_NEWLINE + rstr.herodlg.lbl.wearedtacticskilltip;
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);	
};

SpecSkillTooltip = function(){
	var m_g;

	this.init = function(g){
		m_g = g;
	};
	
	this.getItemDesc = function(skill){
		return _getItemTipDesc(skill);
	};
	
	var _getItemTipDesc = function(skill, showop){
		ItemResUtil.initItemres(skill, 'id');
		var s = '<div class="itemtip">';
		s += _getSkillName(skill);
		s += _getSkillDescInfo(skill);
		s += _getOpTip(skill);
		s += '</div>';
		return s;
	};
	
	var _getSkillName = function(skill){
		return '<center><b>'+skill.itemres.name+'</b> '+TQ.format(rstr.comm.flevel, skill.level)+'</center>';
	};
	
	var _getSkillDescInfo = function(skill){
		return skill.itemres.desc + C_TIP_NEWLINE;
	};
	
	var _getOpTip = function(skill){
		if ( skill.level == 1 )  return '';
		
		return C_TIP_NEWLINE + rstr.herodlg.lbl.learnspecskilltip;
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);	
};

FarmPipTooltip = Class.extern(function(){
	var m_g;
	this.init = function(g){
		m_g = g;
	};
	
	this.getItemDesc = function(item){
		return _getItemTipDesc(item);
	};

	var _getItemTipDesc = function(item){
		var sztip = '<div class="farmpiptip">';
		sztip += _getNameStr(item);
		sztip += _getWorkForcePopuStr(item);
		sztip += _getUseTimeStr(item);
		sztip += _getBaseOutputStr(item);
		sztip += _getSkillAddOutputStr(item); 
		sztip += _getBuildAddOutputStr(item); 
		sztip += _getRoleAddOutputStr(item); 
		sztip += _getAlliAddOutputStr(item); 
		sztip += _getBuffStateOutputStr(item); 
		sztip += _getVipAddOutputStr(item); 
		sztip += _getTotalOutputStr(item);
		sztip += '</div>';
		return sztip;
	};
	
	var _getNameStr = function(item) {
		return '<center><b>'+item.itemres.name+'</b></center>';
	};
	
	var _getWorkForcePopuStr = function(item) {
		return TQ.format(rstr.farm.selpip.tips.usepopu, res_farmblock_needpopu) + C_TIP_NEWLINE;
	};
	
	var _getUseTimeStr = function(item) {
		var needtime = res_farmpip_needtime['LV'+item.itemres.level];
		return TQ.format(rstr.farm.selpip.tips.usetime, TQ.formatTime(2,needtime) ) + C_TIP_NEWLINE;
	};
	
	var _getBaseOutputStr = function(item) {
		return TQ.format(rstr.farm.selpip.tips.baseout, _getBaseOutput(item)) + C_TIP_NEWLINE;
	};
	
	var _getSkillAddOutputStr = function(item){
		return TQ.format(rstr.farm.selpip.tips.skilladd, _getCultureAddOutput(item)) + C_TIP_NEWLINE;
	};
	
	var _getBuildAddOutputStr = function(item){
		return TQ.format(rstr.farm.selpip.tips.buildadd, _getBuildAddOutput(item)) + C_TIP_NEWLINE;
	};
	
	var _getRoleAddOutputStr = function(item){
		return TQ.format(rstr.farm.selpip.tips.roleadd, _getRoleAddOutput(item)) + C_TIP_NEWLINE;
	};
	
	var _getAlliAddOutputStr = function(item){
		return TQ.format(rstr.farm.selpip.tips.alliadd, _getAlliAddOutput(item)) + C_TIP_NEWLINE;
	};
	
	var _getBuffStateOutputStr = function(item){
		return TQ.format(rstr.farm.selpip.tips.buffadd, _getBuffStateOutput(item)) + C_TIP_NEWLINE;
	};
	
	var _getVipAddOutputStr = function(item){
		return TQ.format(rstr.farm.selpip.tips.vipadd, _getVipAddOutput(item)) + C_TIP_NEWLINE;
	};
	
	var _getTotalOutputStr = function(item){
		return TQ.format(rstr.farm.selpip.tips.totalout, _getTotalOutput(item)) + C_TIP_NEWLINE;
	};
	
	var _getBaseOutput = function(item){
		var needtime = res_farmpip_needtime['LV'+item.itemres.level];
		return parseInt(needtime*res_farm_sec_output, 10);
	};
	
	var _getCultureAddOutput = function(item){
		var tid = 0;
		if ( item.itemres.bresid == FIXID.FARM ) tid = FIXID.FOODCBUILD;
		else if ( item.itemres.bresid == FIXID.TIMBERYARD ) tid = FIXID.WOODCBUILD;
		else if ( item.itemres.bresid == FIXID.QUARRY ) tid = FIXID.STONECBUILD;
		else if ( item.itemres.bresid == FIXID.IRONORE ) tid = FIXID.IRONCBUILD;
		return m_g.getImgr().getFarmCultureAddOutput(tid, _getBaseOutput(item));
	};
	
	var _getBuildAddOutput = function(item){
		return m_g.getImgr().getFarmBuildAddOutput(_getBaseOutput(item));
	};
	
	var _getRoleAddOutput = function(item){
		return m_g.getImgr().getFarmRoleAddOutput(_getBaseOutput(item));
	};
	
	var _getAlliAddOutput = function(item){
		return m_g.getImgr().getFarmAlliAddOutput(_getBaseOutput(item));
	};
	
	var _getBuffStateOutput = function(item){
		return m_g.getImgr().getFarmBuffStateAddOutput(_getBaseOutput(item));
	};
	
	var _getVipAddOutput = function(item){
		return m_g.getImgr().getFarmVipAddOutput(_getBaseOutput(item));
	};
	
	var _getTotalOutput = function(item){
		var total = _getBaseOutput(item);
		total += _getCultureAddOutput(item);
		total += _getBuildAddOutput(item);
		total += _getRoleAddOutput(item);
		total += _getAlliAddOutput(item);
		total += _getBuffStateOutput(item);
		total += _getVipAddOutput(item);
		return total;
	};
});

BuildTooltip = function(){
	//BuildTooltip-unittest-start
	var C_TIP_NEWLINE = '<br/>';
	var C_SPLITLINE = '<hr class="ui-split"/>';
	var C_EN_COLOR = '#30ff30'; // 满足的颜色
	var C_NOEN_COLOR = '#ff3000'; // 不满足的颜色
	
	//-----------
	//private:data
	//-----------
	var m_g = 0;
	var m_cityId = 0;

	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
	};
	
	this.getItemDesc = function(cityId, tag, item){
		m_cityId = cityId;
		return _getItemTipDesc(tag, item);
	};
	
	this.getSimpleUpgradeTip = function(cityId, item){
		m_cityId = cityId;
		return _getSimpleUpgradeTip(item);
	};
	
	this.isCanUpgrade = function(cityId, item){
		m_cityId = cityId;
		return _isCanUpgrade(item);
	};
	
	this.isFullLevel = function(item){
		return _isFullLevel(item);
	};

	var _formatHave = function(need, have){
		return ( need > have ) ? TQ.formatColorStr(have, C_NOEN_COLOR) : have;
	};
	
	var _isFullLevel = function(item){
		var levelres = ItemResUtil.findBuildLevelres(item.itemres.id, item.level+1);//next level
		return (!levelres);
	};
	
	var _isCanUpgrade = function(item){
		var cres = _getCommRes();
		var levelres = ItemResUtil.findBuildLevelres(item.itemres.id, item.level+1);//next level
		
		if ( !levelres ){
			return false;
		}
		
		var _checkPreBuild = function(isEnough){
			return isEnough;
		};
		if ( !_traversalPreBuild(levelres, _checkPreBuild) ){
			return false;
		}
		
		var _checkNeedItem = function(it, res, mynum){
			return it.num <= mynum;
		};
		if ( !_traversalNeedItem(levelres, _checkNeedItem) ){
			return false;
		}
		
		var _checkNeedRes = function(rs, key, name){
			return rs.num <= cres[key];
		};
		if ( !_traversalNeedRes(levelres, _checkNeedRes) ){
			return false;
		}
		
		return true;
	};
	
	var _getSimpleUpgradeTip = function(item){
		var cres = _getCommRes();
		var levelres = ItemResUtil.findBuildLevelres(item.itemres.id, item.level+1);//next level
		if ( !levelres ) return _getSimpleUpTipMaxLevel(item);
		
		var rtstr = _getSimpleUpTipPreBuild(levelres);
		rtstr += _getSimpleUpTipNeedItem(levelres);
		rtstr += _getSimpleUpTipNeedCommRes(cres, levelres);
		return rtstr;
	};
	
	var _getSimpleUpTipMaxLevel = function(item){
		return TQ.format(rstr.inbuild.panel.tips.maxlevel, item.itemres.name, item.level);
	};
	
	var _getSimpleUpTipPreBuild = function(levelres){
		var stip = '';
		var _checkPreBuild = function(isEnough, cd, res, needlevel, mylevel){
			if ( isEnough ) return true;
			var s = '';
			if ( cd.id == FIXID.CITYLEVEL ) {
				var needlevelStr = RStrUtil.getCityNameByLevel(needlevel);
				var mylevelStr = RStrUtil.getCityNameByLevel(mylevel);
				s = TQ.format(rstr.inbuild.panel.tips.nopreclevel, needlevelStr, mylevelStr);
			} else {
				s = TQ.format(rstr.inbuild.panel.tips.noprebuild, res.name, needlevel, mylevel);
			}
			var color = isEnough ? C_EN_COLOR : C_NOEN_COLOR;
			stip += TQ.formatColorStr(s, color) + '<br/>';
			return true;
		};
		_traversalPreBuild(levelres, _checkPreBuild);	
		return stip;
	};
	
	var _getSimpleUpTipNeedItem = function(levelres){
		var stip = '';
		var _checkNeedItem = function(it, res, mynum){
			var isEnough = (it.num <= mynum);
			if ( isEnough ) return true;
			var color = isEnough ? C_EN_COLOR : C_NOEN_COLOR;
			var s = TQ.format(rstr.inbuild.panel.tips.noneeditem, res.name, it.num, mynum);
			stip += TQ.formatColorStr(s, color) + '<br/>';
			return true;
		};
		_traversalNeedItem(levelres, _checkNeedItem);
		return stip;
	};
	
	var _getSimpleUpTipNeedCommRes = function(cres, levelres) {
		var stip = '';
		var _checkNeedRes = function(rs, key, name){
			var isEnough = rs.num <= cres[key];
			if ( isEnough ) return true;
			var color = isEnough ? C_EN_COLOR : C_NOEN_COLOR;
			var s = TQ.format(rstr.inbuild.panel.tips.noneedres, name, rs.num, cres[key]);
			stip += TQ.formatColorStr(s, color) + '<br/>';
			return true;
		};
		_traversalNeedRes(levelres, _checkNeedRes);
		return stip;
	};
	
	var _getMaxLevelTip = function(item){
		var stip = '<div class=buildtipauto>';
		stip += TQ.formatLine(TQ.format(rstr.inbuild.panel.tips.maxlevel, item.itemres.name, item.level));
		stip += '</div>';
		return stip;
	};
	
	var _getItemTipDesc = function(tag, item){
		var cres = _getCommRes();
		var tiptags = _getTags(tag, item.resid);
		if ( tag == 'up' || tag == 'firstup' ){
			return _getUpgradeBuildTip(item, cres, tiptags);
		}
		else if ( tag == 'down' ){
			return _getDownBuildTip(item, cres, tiptags);
		}
		else if ( tag == 'build' ){
			return _getCommBuildTip(item, cres, tiptags);
		}
		else if ( tag == 'recruit' ){
			return _getRecruitTip(item, cres, tiptags);
		}		
		return '';
	};
	
	var _getUpgradeBuildTip = function(item, cres, tiptags){
		var levelres = ItemResUtil.findBuildLevelres(item.itemres.id, item.level+1);
		if ( !levelres ) return _getMaxLevelTip(item);
		
		var szTip = '<div class=buildtip>';
		szTip += _getTipBuildName(tiptags.uptip, item, item.level+1);
		szTip += C_TIP_NEWLINE;
		
		szTip += _replaceBuildDesc(item.level+1, levelres, item.itemres.desc);
		szTip += C_TIP_NEWLINE;
		szTip += C_TIP_NEWLINE;
		
		szTip += _getTipNeedTitle(tiptags);
		szTip += _getTipPreBuildNeed(levelres);
		szTip += _getTipItemNeed(levelres);
		szTip += _getTipCommResNeed(cres, levelres);
		szTip += _getTipNeedFoot(tiptags);
		
		szTip += _getTipTimeNeed(levelres.ntime);
		szTip += '</div>';
		return szTip;
	};
	
	var _getDownBuildTip = function(item, cres, tiptags) {
		var levelres = ItemResUtil.findBuildLevelres(item.itemres.id, item.level);
		var preLevelRes = ItemResUtil.findBuildLevelres(item.itemres.id, item.level-1);
		if ( !levelres ) return false;
		var szTip = '<div class=buildtip>';
		szTip += _getTipBuildName(tiptags.downtip, item, item.level-1);
		szTip += C_TIP_NEWLINE;
		
		if (preLevelRes){
			szTip += _replaceBuildDesc(item.level-1, preLevelRes, item.itemres.desc);
		} else {
			szTip += rstr.comm.buildWillBeDestroy;
		}
		
		szTip += C_TIP_NEWLINE;
		szTip += C_TIP_NEWLINE;
		
		szTip += _getTipRetTitle(tiptags);
		szTip += _getTipCommResRet(cres, levelres);
		szTip += _getTipRetFoot();
		
		szTip += _getTipTimeNeed(levelres.ntime*res_down_retres_per);
		szTip += '</div>';
		return szTip;
	};	
	
	var _getCommBuildTip = function(item, cres, tiptags){
		var levelres = ItemResUtil.findBuildLevelres(item.itemres.id, item.level);
		if ( !levelres ) return '';
		var stip = '<div class=buildtipbuild>';
		stip += '<center><b>'+item.itemres.name+'</b> '+TQ.format(rstr.comm.flevel, item.level)+'</center>';
		
		stip += _replaceBuildDesc(item.level, levelres, item.itemres.desc);
		stip += '</div>';
		return stip;
	};
	
	var _replaceBuildDesc = function(level, levelres, desc){
		var desc = _replaceBuildDescByEval(level, levelres, desc);
		return _replaceBuildDescByTmpl(level, levelres, desc);
	};
	
	var _replaceBuildDescByEval = function(level, levelres, desc){
		var replaces = {};
		var evals = desc.match(/eval\([^)]+\)/g);
		for ( var i=0; evals && i<evals.length; ++i ) {
			var oneEval = evals[i];
			oneEval = oneEval.replace(/eval\(([^)]+)\)/g, '$1');
			oneEval = _replaceBuildDescByTmpl(level, levelres, oneEval);
			replaces[ evals[i] ] = eval(oneEval);
		}
		
		return _replaceBuildDescByPairs(desc, replaces);
	};
	
	var _replaceBuildDescByTmpl = function(level, levelres, desc){
		var replaces = {};
		var tmpls = desc.match(/\{[^\}]+\}/g);
		for ( var i=0; tmpls && i<tmpls.length; ++i ) {
			var oneTmpl = tmpls[i];
			oneTmpl = oneTmpl.replace(/\{([^\}]+)\}/g, '$1');
			if (oneTmpl == 'level') {
				replaces[tmpls[i]] = level;
			} else {
				replaces[tmpls[i]] = levelres[oneTmpl];
			}
		}
		
		return _replaceBuildDescByPairs(desc, replaces);
	};
	
	var _replaceBuildDescByPairs = function(desc, replaces){
		for ( var k in replaces ) {
			while (desc.indexOf(k) >= 0) {
				desc = desc.replace(k, replaces[k] );
			}
		}
		return desc;
	};
	
	var _getRecruitTip = function(item, cres, tiptags) {
		var levelres = ItemResUtil.findBuildLevelres(item.itemres.id, item.level+1);
		if ( !levelres ) return '';
		
		var szTip = '<div class=buildtip>';
		szTip += TQ.format(rstr.inbuild.panel.tips.recruittip, item.itemres.name) + C_TIP_NEWLINE;
		szTip += C_TIP_NEWLINE;
		
		szTip += item.itemres.desc + C_TIP_NEWLINE;
		szTip += C_TIP_NEWLINE;
		
		szTip += _getTipNeedTitle(tiptags);
		szTip += _getTipPreBuildNeed(levelres);
		szTip += _getTipItemNeed(levelres);
		szTip += _getTipCommResNeed(cres, levelres);
		szTip += _getTipNeedFoot(tiptags);
		
		szTip += _getTipTimeNeed(levelres.ntime);
		szTip += '</div>';
		return szTip;
	};	
	
	var _getTipBuildName = function(tip, item, level){
		return TQ.format(tip, item.itemres.name, level) + C_TIP_NEWLINE;
	};
	
	var _getTipNeedTitle = function(tiptags) {
		var stip = '<table width=100%><tr><td width=33%>'+tiptags.needtitle1+'</td><td width=33%>'+tiptags.needtitle2+'</td><td width=34%>'+tiptags.needtitle3+'</td></tr></table>';
		stip += C_SPLITLINE;
		stip += '<table width=100%>';
		stip += '<tr><td width=33%></td><td width=33%></td><td width=34%></td></tr>';
		return stip;
	};

	var _getTipPreBuildNeed = function(levelres) {
		var stip = '';
		var _combinePreBuild = function(isEnough, cd, res, needlevel, mylevel){
			var titleStr = ''; var needStr = '';  var hasStr = '';
			var color = isEnough ? C_EN_COLOR : C_NOEN_COLOR;
			if ( cd.id == FIXID.CITYLEVEL ) {
				titleStr = TQ.formatColorStr(rstr.inbuild.panel.tips.needclevel, color);
				needStr = TQ.formatColorStr(RStrUtil.getCityNameByLevel(needlevel), color);
				hasStr = TQ.formatColorStr(RStrUtil.getCityNameByLevel(mylevel), color);
			} else {
				titleStr = TQ.formatColorStr(rstr.inbuild.panel.tips.needcond, color);
				needStr = TQ.formatColorStr(res.name+'('+TQ.format(rstr.comm.flevel, needlevel)+')', color);
				hasStr = TQ.formatColorStr(mylevel, color);
			}
			stip += '<tr><td>'+titleStr+'</td><td>'+needStr+'</td><td>'+hasStr+'</td></tr>';
			return true;
		};
		_traversalPreBuild(levelres, _combinePreBuild);	
		return stip;
	};
	
	var _getTipItemNeed = function(levelres) {
		var stip = '';
		var _combineNeedItem = function(it, res, mynum){
			var isEnough = (it.num <= mynum);
			var color = isEnough ? C_EN_COLOR : C_NOEN_COLOR;
			var title = TQ.formatColorStr(rstr.inbuild.panel.tips.needitem, color);
			var needStr = TQ.formatColorStr(res.name+'('+it.num+')', color);
			var hasStr = TQ.formatColorStr(mynum, color);
			stip += '<tr><td>'+title+'</td><td>' + needStr + '</td><td>'+hasStr+'</td></tr>';
			return true;
		};
		_traversalNeedItem(levelres, _combineNeedItem);
		return stip;
	};
	
	var _getTipCommResNeed = function(cres, levelres){
		var stip = '';
		var _combineNeedRes = function(rs, key, name){
			var isEnough = rs.num <= cres[key];
			var color = isEnough ? C_EN_COLOR : C_NOEN_COLOR;
			var title = TQ.formatColorStr(rstr.inbuild.panel.tips.need+name, color);
			var needStr = TQ.formatColorStr(rs.num, color);
			var hasStr = TQ.formatColorStr(cres[key], color);
			stip += '<tr><td>'+title+'</td><td>'+needStr+'</td><td>'+hasStr+'</td></tr>';
			return true;
		};
		_traversalNeedRes(levelres, _combineNeedRes);
		return stip;
	};
	
	var _getTipNeedFoot = function() {
		return '</table>' + C_SPLITLINE;
	};
	
	var _getTipRetTitle = function(tiptags){
		return _getTipNeedTitle(tiptags);
	};
	
	var _getTipCommResRet = function(cres, levelres){
		var stip = '';
		var _combineReturnRes = function(rs, key, name){
			stip += '<tr><td>'+rstr.inbuild.panel.tips.ret+name+'</td><td>'+parseInt(rs.num*res_down_retres_per)+'</td><td>'+cres[key]+'</td></tr>';
			return true;
		};
		_traversalNeedRes(levelres, _combineReturnRes);
		return stip;
	};
	
	var _getTipRetFoot = function() {
		return _getTipNeedFoot();
	};
	
	var _getTipTimeNeed = function(ntime){
		var sneedtime = rstr.inbuild.panel.tips.needtime + ' ' + TQ.formatTime(0, ntime);
		var facttime = m_g.getImgr().getFactBuildTime(ntime);
		var sfacttime = rstr.inbuild.panel.tips.facttime + ' ' + TQ.formatTime(0, facttime);
		return sneedtime + C_TIP_NEWLINE + sfacttime;
	};
	
	var _traversalPreBuild = function(levelres, callback){
		if ( !levelres.conds ) return true;
		for ( var i=0; i<levelres.conds.length; ++i ){
			var cd = levelres.conds[i];
			if ( !cd.id || !cd.level ) continue;
			var res = ItemResUtil.findItemres(cd.id);
			var mylevel = 0;
			var needlevel = 0;
			if ( cd.id == FIXID.CITYLEVEL ) {
				mylevel = m_g.getImgr().getCityRes().buildval.level;
				needlevel = cd.level;
			} else {
				if ( CityBuildUtil.isCanBuildInCity(m_cityId, cd.id) ) {
					mylevel = m_g.getImgr().getBuildLevelByResId(m_cityId, cd.id);
				} else {
					mylevel = m_g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, cd.id);
				}
				needlevel = cd.level;
			}
			
			var isEnough = (mylevel >= needlevel);
			if ( !callback(isEnough, cd, res, needlevel, mylevel) ){
				return false;
			}
		}
		return true;
	};
	
	var _traversalNeedItem = function(levelres, callback){
		if ( !levelres.items ) return true;
		for ( var i=0; i<levelres.items.length; ++i ){
			var it = levelres.items[i];
			if ( !it.id || !it.num ) continue;
			var res = ItemResUtil.findItemres(it.id );
			var mynum = m_g.getImgr().getItemNumByResId(it.id);
			if ( !callback(it, res, mynum) ){
				return false;
			}
		}
		return true;
	};
	
	var _traversalNeedRes = function(levelres, callback){
		var ids = [FIXID.FOOD, FIXID.WOOD, FIXID.STONE, FIXID.IRON, FIXID.POPU];
		for ( var i=0; i<ids.length; ++i ) {
			var id = ids[i];
			var res = ItemResUtil.findItemres(id );
			var key = res.ename;
			var neednum = levelres[key];
			if ( !neednum ) continue;
			if ( id == FIXID.POPU ) {
				neednum = levelres.addpopu;
			}
			var rs = {num:neednum};
			if ( !callback(rs, key, res.name) ){
				return false;
			}
		}
		return true;
	};	
	
	var _getCommRes = function(){
		var imgr = m_g.getImgr();
		var cityres = imgr.getCityRes();
		var commres = {};
		TQ.dictCopy(commres, cityres.cres);
		commres.money = imgr.getMoney();
		commres.popu = imgr.getIdlePopu();
		commres.buildval = {cltres:0};
		return commres;
	};	
	
	var _getTags = function(tag, resid){
		var tags = {};
		if ( _isInBuildResid(resid) 
		  || _isAlliBuildResid(resid) 
		  || _isCityDefResid(resid) ){
			_setTagsCommBuild(tag, tags);
		}
		else if ( _isTeBuildResid(resid) ){
			_setTagsTeBuild(tag, tags);
		}
		else if ( _isSkillResid(resid) ) {
			_setTagsSkill(tag, tags);
		}
		else if ( _isSoldierResid(resid) ){
			_setTagsSoldier(tag, tags);
		}
		else {
			alert ( 'error: u3f942314, [can not find class] resid=' + resid );
		}
		return tags;
	};
	
	var _setTagsCommBuild = function(tag, tags) {
		if ( tag == 'firstup' || tag == 'up' ) {
			tags.needtitle1 = rstr.inbuild.panel.tips.needtitles[0];
			tags.needtitle2 = rstr.inbuild.panel.tips.needtitles[1];
			tags.needtitle3 = rstr.inbuild.panel.tips.needtitles[2];
		}
	
		if ( tag == 'down' ) {
			tags.downtip = rstr.inbuild.panel.tips.downtip;
			tags.needtitle1 = rstr.inbuild.panel.tips.rttitles[0];
			tags.needtitle2 = rstr.inbuild.panel.tips.rttitles[1];
			tags.needtitle3 = rstr.inbuild.panel.tips.rttitles[2];
		}
		else if ( tag == 'firstup' ) {
			tags.uptip = rstr.inbuild.panel.tips.fuptip;
			tags.nextdesclbl = rstr.inbuild.panel.tips.firstdesc;
		}
		else if ( tag == 'up' ) {
			tags.uptip = rstr.inbuild.panel.tips.uptip;
			tags.nextdesclbl = rstr.inbuild.panel.tips.nextdesc;
		}
	};
	
	var _setTagsTeBuild = function(tag, tags) {
		tags.needtitle1 = rstr.inbuild.panel.tips.learntitles[0];
		tags.needtitle2 = rstr.inbuild.panel.tips.learntitles[1];
		tags.needtitle3 = rstr.inbuild.panel.tips.learntitles[2];
		
		if ( tag == 'firstup' ){
			tags.uptip = rstr.inbuild.panel.tips.flearnuptip;
			tags.nextdesclbl = rstr.inbuild.panel.tips.firstdesc;
		}
		else{
			tags.uptip = rstr.inbuild.panel.tips.learnuptip;
			tags.nextdesclbl = rstr.inbuild.panel.tips.nextdesc;
		}
	};
	
	var _setTagsSkill = function(tag, tags) {
		tags.needtitle2 = rstr.alli.skill.learntitles[1];
		tags.needtitle3 = rstr.alli.skill.learntitles[2];
		
		if ( tag == 'firstup' ){
			tags.needtitle1 = rstr.alli.skill.learntitles[0];
			tags.uptip = rstr.alli.skill.flearnuptip;
			tags.nextdesclbl = rstr.inbuild.panel.tips.firstdesc;
		}
		else{
			tags.needtitle1 = rstr.alli.skill.learntitles[3];
			tags.uptip = rstr.alli.skill.learnuptip;
			tags.nextdesclbl = rstr.inbuild.panel.tips.nextdesc;
		}
	};
	
	var _setTagsSoldier = function(tag, tags) {
		tags.needtitle1 = rstr.inbuild.panel.tips.recruittitles[0];
		tags.needtitle2 = rstr.inbuild.panel.tips.recruittitles[1];
		tags.needtitle3 = rstr.inbuild.panel.tips.recruittitles[2];
	};
	
	var _isInBuildResid = function(resid){
		return (resid >= FIXID.FIRSTINBUILD && resid <= FIXID.LASTINBUILD);
	};
	
	var _isAlliBuildResid = function(resid){
		return (resid >= FIXID.FIRSTALLIBUILD && resid <= FIXID.LASTALLIBUILD);
	};
	
	var _isTeBuildResid = function(resid){
		return (resid >= FIXID.FIRSTCBUILD && resid <= FIXID.LASTCBUILD);
	};
	
	var _isSoldierResid = function(resid){
		return (resid >= FIXID.FIRSTSOLDIER && resid <= FIXID.LASTSOLDIER);
	};
	
	var _isCityDefResid = function(resid){
		return (resid >= FIXID.FIRSTCDBUILD && resid <= FIXID.LASTCDBUILD);
	};
	
	var _isSkillResid = function(resid){
		return ( resid >= FIXID.FIRSTSKILL && resid <= FIXID.LASTSKILL );
	};
	
	this.init.apply(this, arguments);	
	//BuildTooltip-unittest-end
};

CultureTooltip = Class.extern(function(){
	var m_g = null;
	var m_this = null;
	this.init = function(g) {
		m_this = this;
		m_g = g;
	};
	
	this.isValid = function(culture){
		var nextLevelRes = ItemResUtil.findCultureLevelres(culture.id, culture.level+1);
		if ( !nextLevelRes ) return false;
		
		for ( var i=0; i<nextLevelRes.conds.length; ++i ) {
			var cond = nextLevelRes.conds[i];
			if ( !cond.id ) continue;
			if ( !_isValidCondition(cond) ) return false;
		}
		
		var tags = _getResTags();
		for ( var i=0; i<tags.length; ++i ) {
			var tag = tags[i];
			if ( !nextLevelRes[tag] ) continue;
			if ( !_isValidResNumber(nextLevelRes[tag], tag) ) return false;
		}
		
		return true;
	};
	
	this.getCultureDesc = function(culture){
		var res = ItemResUtil.findItemres(culture.id);
		var s = '<div class="culturetip">';
		s += '<center><B>' + res.name + '</B> (' + TQ.format(rstr.comm.flevel, culture.level) + ')</center>';
		s += _getBaseDesc(culture);
		s += '</div>';
		return s;
	};
	
	this.getLearnDesc = function(culture){
		var s = _getBaseDesc(culture);
		var nextLevelRes = ItemResUtil.findCultureLevelres(culture.id, culture.level+1);
		if ( nextLevelRes ) {
			s += rstr.culturedlg.tip.learnprecond + _getLearnPreCond(nextLevelRes) + C_TIP_NEWLINE;
			s += rstr.culturedlg.tip.learnneed + _getLearnNeed(nextLevelRes) + C_TIP_NEWLINE;
			s += C_TIP_SPLITLINE;
			s += rstr.culturedlg.tip.rawneedtime + _getRawNeedTime(nextLevelRes);
			s += '&nbsp;&nbsp;&nbsp;&nbsp;';
			s += rstr.culturedlg.tip.needtime + _getFaceNeedTime(nextLevelRes) + C_TIP_NEWLINE;
		}
		return s;
	};
	
	var _getBaseDesc = function(culture){
		var levelRes = ItemResUtil.findCultureLevelres(culture.id, culture.level);
		var nextLevelRes = ItemResUtil.findCultureLevelres(culture.id, culture.level+1);
		var res = ItemResUtil.findItemres(culture.id);
		var s = '';
		if ( levelRes ) {
			s += rstr.culturedlg.tip.curleveleff + _getDescByLevel(res, culture.level) + C_TIP_NEWLINE;
		}
		
		if ( nextLevelRes ) {
			s += rstr.culturedlg.tip.nextleveleff + _getDescByLevel(res, culture.level+1) + C_TIP_NEWLINE;
		}
		else {
			s += rstr.culturedlg.tip.ismaxlevel + C_TIP_NEWLINE;
		}
		
		s += rstr.culturedlg.tip.maxlevel + res.maxlevel + C_TIP_NEWLINE;
		return s;	
	};
	
	var _getResTags = function(){
		return ['money', 'food', 'wood', 'stone', 'iron'];
	};
	
	var _getDescByLevel = function(itemres, level) {
		var reps = {};
		for ( var i=0; i<itemres.effects.length; ++i ) {
			var effect = itemres.effects[i];
			if ( !effect.id ) continue;
			if ( !effect.val ) continue;
			if ( effect.val == '' ) continue;
			
			var LV = level;
			reps['{'+(i+1)+'.'+'pro}'] = eval(effect.pro);
			reps['{'+(i+1)+'.'+'val}'] = eval(effect.val);
		}
		
		var s = itemres.desc;
		for ( var k in reps ) {
			s = s.replace(k, reps[k]);
		}
		return s;
	};
	
	var _getLearnPreCond = function(nextLevelRes) {
		var s = '';
		for ( var i=0; i<nextLevelRes.conds.length; ++i ) {
			var cond = nextLevelRes.conds[i];
			if ( !cond.id ) continue;
			
			var res = ItemResUtil.findItemres(cond.id);
			var nameLevel = res.name + TQ.format(rstr.comm.flevel, cond.level);
			var nameColor = _isValidCondition(cond) ? C_TIP_VALIDCOLOR : C_TIP_INVALIDCOLOR;
			s += TQ.formatColorStr(nameLevel, nameColor);
			s += C_TIP_TWO_SPACE;
		}
		return s;
	};
	
	var _getLearnNeed = function(nextLevelRes) {
		var s = '';
		var tags = _getResTags();
		for ( var i=0, factIdx=0; i<tags.length; ++i ) {
			var tag = tags[i];
			if ( !nextLevelRes[tag] ) continue;
			
			if ( (factIdx%3 == 0) && (factIdx > 0) ) s += C_TIP_NEWLINE + rstr.culturedlg.tip.learnneedempty;
			factIdx++;
			
			var nameNumber = rstr.comm[tag] + nextLevelRes[tag];
			var nameColor = _isValidResNumber(nextLevelRes[tag], tag) ? C_TIP_VALIDCOLOR : C_TIP_INVALIDCOLOR;
			s += TQ.formatColorStr(nameNumber, nameColor);
			s += C_TIP_TWO_SPACE;
		}
		return s;
	};
	
	var _getRawNeedTime = function(nextLevelRes) {
		return TQ.formatTime(0, nextLevelRes.ntime);
	};
	
	var _getFaceNeedTime = function(nextLevelRes) {
		if ( m_g.getImgr().hasVipEffect(VIP_EFF.SPEED_CULTURELEARN) ) {
			return TQ.format(rstr.culturedlg.tip.vipimm, m_g.getImgr().getVipLevel());
		} else {
			var facttime = m_g.getImgr().getFactLearnCultureTime(nextLevelRes.ntime);
			return TQ.formatTime(0, facttime);
		}
	};
	
	var _isValidCondition = function(cond) {
		return cond.level <= _getMyHasLevel(cond.id);
	};
	
	var _getMyHasLevel = function(condId) {
		var classType = ItemClassRange.getFirstClassId(condId);
		if ( classType == RES_CLS.IBUILD ) {
			return m_g.getImgr().getBuildLevelByResId(BUILDCITY_ID.ALL, condId);
		}
		else if ( classType == RES_CLS.CULTURE ) {
			return m_g.getImgr().getCultureLevel(condId);
		}
		return 0;
	};
	
	var _isValidResNumber = function(needNumber, tag) {
		return needNumber <= _getMyHasNumber(tag);
	};
	
	var _getMyHasNumber = function(tag) {
		if ( tag == 'money' ) return m_g.getImgr().getMoney();
		else return m_g.getImgr().getCityRes().cres[tag];
	};
});

PlayerTooltip = function(){
	//-----------
	//private:const
	//-----------
	var C_TIP_NEWLINE = '<br>';
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_tipdom;

	//------------
	//public:method
	//------------
	this.initialize = function(g){
		m_g = g;
	};
	
	this.getItemDesc = function(player){
		return _getItemTipDesc(player);
	};
	
	//-----------
	//private:method
	//-----------
	/** get item tips description */
	var _getItemTipDesc = function(player){
		var szTip = '<div class="itemtip">';
		szTip += '<center><B>' + player.name + '</B>';
		if (player.uid) {
			szTip += '(' + player.uid + ')';
		}
		szTip += '</center>';
		if (player.level) {
			szTip += rstr.comm.level + rstr.comm.colon + player.level + C_TIP_NEWLINE;
		}
		if (player.sex != undefined ) {
			szTip += rstr.comm.sex + rstr.comm.colon + rstr.comm.sexs[player.sex] + C_TIP_NEWLINE;
		}
		if (player.allipos){
			szTip += rstr.alli.main.lbl.pos + rstr.comm.colon + rstr.alli.alliposs[player.allipos] + C_TIP_NEWLINE;
		}
		if (player.ranking){
			szTip += rstr.alli.main.lbl.ranking + rstr.comm.colon + player.ranking + C_TIP_NEWLINE;
		}
		if (player.prestige){
			szTip += rstr.alli.main.lbl.prestige + rstr.comm.colon + player.prestige + C_TIP_NEWLINE;
		}
		if (player.cityid) {
			var cityres = ItemResUtil.findItemres(player.cityid);
			szTip += rstr.comm.city + rstr.comm.colon + cityres.name;
		}
		szTip += '</div>';
		return szTip;
	};

	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);	
};

PopuTooltip = Class.extern(function(){
	var m_g;

	this.init = function(g){
		m_g = g;
	};
	
	this.getItemDesc = function(){
		return _getItemDesc();
	};
	
	var _getItemDesc = function(){
		var imgr = m_g.getImgr();
		var s = '<div class=itemtip>';
		s += '<center><b>'+rstr.popupanel.popu+'</b></center>';
		s += rstr.popupanel.tips.lfreepopu + imgr.getIdlePopu() + C_TIP_NEWLINE;
		s += rstr.popupanel.tips.lworkpopu + imgr.getWorkPopu() + C_TIP_NEWLINE;
		s += C_TIP_SPLITLINE;
		s += rstr.popupanel.tips.lcurpopu + (imgr.getIdlePopu() + imgr.getWorkPopu()) + C_TIP_NEWLINE;
		s += rstr.popupanel.tips.lmaxpopu + imgr.getMaxPopu() + C_TIP_NEWLINE;
		if ( imgr.getIdlePopu() < 0 ) {
			s += rstr.popupanel.tips.fewidlepopu;
		}
		s += '</div>';
		return s;
	};
});

MoneyTooltip = Class.extern(function(){
	var m_g;

	this.init = function(g){
		m_g = g;
	};
	
	this.getItemDesc = function(){
		return _getItemDesc();
	};
	
	var _getItemDesc = function(){
		var imgr = m_g.getImgr();
		var s = '<div class=itemtip>';
		s += '<center><b>'+rstr.popupanel.money+'</b></center>';
		s += rstr.respanel.comres.curnum + imgr.getMoney() + C_TIP_NEWLINE;
		s += rstr.respanel.comres.maxnum + imgr.getMaxMoney() + C_TIP_NEWLINE;
		s += rstr.respanel.comres.factout + imgr.getMoneyOutput() + C_TIP_NEWLINE;
		if ( imgr.getMoney() >= imgr.getMaxMoney() ) {	
			var sbeyod = rstr.briefrespanel.comres.ismaxres;
			if ( imgr.getMoney() > imgr.getMaxMoney() ) {
				sbeyod = TQ.formatColorStr(sbeyod, C_TIP_REDCOLOR);
			}
			s +=sbeyod + C_TIP_NEWLINE;
		}
		s += '</div>';
		return s;
	};
});

HeroTooltip = function(){
	//HeroTooltip-unittest-start
	var C_TIP_NEWLINE = '<br>';
	var C_SPLITLINE = '<div style="HEIGHT:12px;FONT-SIZE:8px;OVERFLOW:hidden;"></div>';
	var C_EXCOLOR = '#a0a0a0';
	
	//-----------
	//private:data
	//-----------
	var m_g;

	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
	};
	
	this.getItemDesc = function(hero){
		return _getHeroTipDesc(hero);
	};
	
	this.getNewHeroDesc = function(hero){
		return _getNewHeroTipDesc(hero);
	};
	
	this.getNewHeroNatureFactorDesc = function(hero){
		return _getNewHeroNatureFactorDesc(hero);
	};
	
	//-----------
	//private:method
	//-----------
	var _getHeroName = function(hero){
		return '<center><b>'+(hero.name ? hero.name : hero.itemres.name)+'</b></center>';
	};
	
	var _getHeroOwner = function(hero){
		if ( !hero.owner ) return '';
		return '<font color='+C_EXCOLOR+'>'+TQ.format(rstr.herodlg.tips.owner, hero.owner.name, hero.owner.uid) + '</font>' + C_TIP_NEWLINE;
	};
	
	var _getHeroMapPos = function(hero){
		if ( !hero.cityid ) return '';
		var cityres = ItemResUtil.findItemres(hero.cityid);
		return '<font color='+C_EXCOLOR+'>'+TQ.format(rstr.herodlg.tips.mappos, cityres.name, hero.pos.x, hero.pos.y) + '</font>' + C_TIP_NEWLINE;
	};

	var _getHeroTipDesc = function(hero){
		if ( !hero || !hero.itemres ) return '';
		var szTip = '<div class=itemtip>';
		szTip += _getHeroName(hero);
		szTip += PERBARHDR.getHeroHpInfo(hero);
		szTip += PERBARHDR.getHeroMpInfo(hero);
		szTip += PERBARHDR.getHeroMStrInfo(hero);
		var filters = [ATTR.LVL,ATTR.HP,ATTR.MHP,ATTR.MP,ATTR.MMP,ATTR.AR,ATTR.CA,ATTR.MCA,ATTR.AN,ATTR.MAN,ATTR.PS,ATTR.MPS,ATTR.XP,ATTR.NXP]; 
		szTip += AttrsCommHdr(hero, hero.attrs, res_attrs, ListToDisc(filters));
		var szex = _getHeroOwner(hero);
		szex += _getHeroMapPos(hero);
		szTip += szex ? (C_SPLITLINE + szex) : '';
		szTip += '</div>';
		return szTip;
	};
	
	var _getNewHeroTipDesc = function(hero){
		if ( !hero ) return '';
		var s = '<div class=itemtip>';
		s += _getHeroName(hero);
		s += rstr.comm.level + rstr.comm.colon + hero.level + C_TIP_NEWLINE;
		
		var attrIds = [{base:ATTR.ST_B, append:ATTR.ST_A}
			,{base:ATTR.AG_B, append:ATTR.AG_A}
			,{base:ATTR.PH_B, append:ATTR.PH_A}];
		s += CommAttrsTipGetter.get(hero, null, attrIds, COLORS.HERO_TIP_BASEATTR);

		s += NatureAttrsCommHdr(hero, hero.attrs, res_attrs);
		s += '</div>';
		return s;
	};
	
	var _getNewHeroNatureFactorDesc = function(hero){
		if ( !hero ) return '';
		var s = '<div class=itemtip>';
		s += NatureAttrsCommHdr(hero, hero.attrs, res_attrs);
		s += '</div>';
		return s;
	};
	
	//--------------
	// call constructor
	//--------------
	this.init.apply(this, arguments);	
	
	//HeroTooltip-unittest-end
};

CommResTooltip = function(){
	//-----------
	//private:const
	//-----------
	var C_TIP_NEWLINE = '<br/>';
	var C_INC_COLOR = '#FFFF00';
	var C_DEC_COLOR = '#FF3300';
	var C_COMM_COLOR = '#FFFFFF';
		
	//-----------
	//private:data
	//-----------
	var m_g;

	this.init = function(g){
		m_g = g;
	};
	
	this.getItemDesc = function(tag,resid){
		return _getItemTipDesc(tag, resid);
	};
	
	var _getItemTipDesc = function(tag, resid){
		var cres = m_g.getImgr().getCityRes().cres;
		var itemres = ItemResUtil.findItemres(resid);
		var szTip = '<div class=itemtip>';
		szTip += '<B>'+itemres.name+'</B>' + C_TIP_NEWLINE; // name
		szTip += C_TIP_NEWLINE;
		szTip += rstr.briefrespanel.comres.curnum + cres[tag] + C_TIP_NEWLINE;
		szTip += rstr.briefrespanel.comres.maxnum + cres.max + C_TIP_NEWLINE;

		var idmaps = {};
		idmaps[FIXID.FOOD] = FIXID.FARM; idmaps[FIXID.WOOD] = FIXID.TIMBERYARD;
		idmaps[FIXID.STONE] = FIXID.QUARRY; idmaps[FIXID.IRON] = FIXID.IRONORE;
		szTip += rstr.briefrespanel.comres.curcanget + UIM.getPanel('farm').getCanGetMyRes(idmaps[resid]) + C_TIP_NEWLINE;
		
		szTip +=rstr.briefrespanel.comres.gettip + C_TIP_NEWLINE;
		
		if ( cres[tag] >= cres.max ) {	
			var sbeyod = rstr.briefrespanel.comres.ismaxres;
			if ( cres[tag] > cres.max ) sbeyod = TQ.formatColorStr(sbeyod, C_TIP_REDCOLOR);
			szTip +=sbeyod + C_TIP_NEWLINE;
		}
	
		szTip += '</div>';
		
		return szTip;
	};

	this.init.apply(this, arguments);
};

ItemTooltip = Class.extern(function(){
	//ItemTooltip-unittest-start
	var C_SMALLSPLITLINE = '<div style="HEIGHT:8px;FONT-SIZE:6px;OVERFLOW:hidden;"></div>';
	var C_COMMCOLOR = '#eeeea0';
	var C_VALIDCOLOR = '#20ff20';
	var C_INVALIDCOLOR = '#ff3300';
		
	var m_g = null;
	var m_who = 'self';
	this.init = function(g){
		m_g = g;
	};
	
	//@param who = 'self', 'sys', 'other', default is 'self'
	this.getItemDesc = function(item, who, isWear){
		m_who = who ? who : 'self';
		
		if (!item || !item.itemres) {
			return '';
		}
		
		var style = 'itemtip';
		if ( TQ.isIE6() && isWear ) {
			style = 'wearitemtip_ie6';
		} else if ( isWear ) {
			style = 'wearitemtip';
		}
		
		var s = '<div class=' + style + '>';
		s += _getItemIcon(item);
		s += _getItemName(item);
		//s += _getForceLevelStar(item);
		s += _getItemDescInfo(item);
		s += _getItemBindInfo(item);
		s += _getArmNeedLevel(item);
		s += _getArmBaseAttrs(item);
		s += _getArmSpeedAttr(item);
		s += _getArmSecondAttrs(item);
		s += _getArmSkillLevelAttrs(item);
		s += _getBesetGemsNumber(item);
		s += _getGemsList(item);
		s += _getSalePrice(item);
		s += _getBuyLimit(item);
		s += '</div>';
		
		return s;
	};
	
	this.getItemExpends = function(item){
		return '';
	};
	
	this.getItemDescText = function(item){
		return '';
	};
	
	this.getItemAttrDesc = function(item){
		return '';
	};
	
	var _getItemIcon = function(item){
		var simg = IMG.makeBigImg(item.itemres.bigpic);
		var level = item.itemres.level ? item.itemres.level : 1;
		var borderClass = 'item_icon_border_level' + level;
		return '<div class="itemtipicon ' + borderClass + '" style="BACKGROUND:url(\'' + simg + '\') -1px -1px;"></div>';
	};
	
	var _getItemName = function(item){
		var sforceLevel = item.flevel ? '+'+item.flevel : '';
		var s = '<center><b>'+ItemNameColorGetter.getColorVal(item.itemres.level, item.itemres.name + sforceLevel);
		if ( IS_DEBUG ) {
			s += '('+item.itemres.id+')';
		}
		s += '</b></center>';
		return s + C_SMALLSPLITLINE;
	};
	
	var _getForceLevelStar = function(item){
		if ( !item.flevel ) {
			return '';
		}
		
		var star = '';
		for (var i=0; i<item.flevel; ++i ) {
			star += '★';
		}
		
		var emptyStar = '';
		for (var i=item.flevel; i<10; ++i ) {
			emptyStar += '☆';
		}
		
		return TQ.formatColorStr(rstr.itemTip.forceLevel, COLORS.ITEM_TIP_FORCELEVELLBL)
			+ TQ.formatColorStr(star, COLORS.FORCELEVELSTAR) 
			+ TQ.formatColorStr(emptyStar, COLORS.EMPTY_FORCELEVELSTAR)
			+ C_TIP_NEWLINE;
	};
	
	var _getItemDescInfo = function(item){
		if (item.itemres.desc) {
			var desc = item.itemres.desc;
			if ( item.appendDesc ) {
				desc += item.appendDesc;
			}
			
			return TQ.formatColorStr(desc, COLORS.ITEM_TIP_DESC) + C_TIP_NEWLINE	+ C_TIP_VSPACE;
		}
		else {
			return '';
		}
	};
	
	var _getItemBindInfo = function(item){
		if (m_who == 'sys') return '';
		if ( item.isBind || item.itemres.isbind ) {
			return TQ.formatColorStr(rstr.itemTip.binded, COLORS.ITEM_TIP_BIND) + C_TIP_NEWLINE;
		}
		else {
			return TQ.formatColorStr(rstr.itemTip.unbind, COLORS.ITEM_TIP_BIND) + C_TIP_NEWLINE;
		}
	};
	
	var _getArmNeedLevel = function(item){
		if ( !item.itemres.needlevel ) {
			return '';
		}
		
		return ItemNameColorGetter.getColorVal(item.itemres.level, rstr.itemTip.needLevel + item.itemres.needlevel) + C_TIP_NEWLINE;
	};
	
	var _getArmBaseAttrs = function(item){
		var attrIds = [{base:ATTR.ST_B, append:ATTR.ST_A}
			,{base:ATTR.AG_B, append:ATTR.AG_A}
			,{base:ATTR.PH_B, append:ATTR.PH_A}
			,{base:ATTR.CO, append:0}];
		return CommAttrsTipGetter.get(item, rstr.itemTip.baseAttrs, attrIds, COLORS.ITEM_TIP_BASEATTR);
	};
	
	var _getArmSpeedAttr = function(item){
		var attrIds = [{base:ATTR.SP, append:0}];
		return CommAttrsTipGetter.get(item, rstr.itemTip.speedAttrs, attrIds, COLORS.ITEM_TIP_SPEEDATTR);
	};
	
	var _getArmSecondAttrs = function(item){
		var attrIds = [{base:ATTR.HU, append:0}
			,{base:ATTR.DE, append:0}
			,{base:ATTR.HI, append:0}
			,{base:ATTR.ES, append:0}
			,{base:ATTR.MPS, append:0}];
		return CommAttrsTipGetter.get(item,  rstr.itemTip.secAttrs, attrIds, COLORS.ITEM_TIP_SECATTR );
	};
	
	var _getArmSkillLevelAttrs = function(item){
		var attrIds = [{base:0, append:ATTR.JIN_SKILL_LEVEL}
			,{base:0, append:ATTR.MU_SKILL_LEVEL}
			,{base:0, append:ATTR.SHUI_SKILL_LEVEL}
			,{base:0, append:ATTR.HUO_SKILL_LEVEL}
			,{base:0, append:ATTR.TU_SKILL_LEVEL}];
		return CommAttrsTipGetter.get(item, rstr.itemTip.skillLevelAttrs, attrIds, COLORS.ITEM_TIP_SKILLLEVELATTR );	
	};
	
	var _getBesetGemsNumber = function(item){
		if (!item.itemres.apos) {
			return '';
		}
		
		if (item.itemres.apos < HEROARM_POS.FIRST 
			|| item.itemres.apos > HEROARM_POS.LAST
			|| item.itemres.apos == HEROARM_POS.HORSE) {
			return '';
		}
		
		var gemNumber = 0;
		if (item.gems) {
			gemNumber = item.gems.length;
		}
	
		var numberLable = TQ.format(rstr.itemTip.besetGems, gemNumber);
		return TQ.formatColorStr( numberLable, COLORS.ITEM_TIP_BESETGEMLBL) + C_TIP_NEWLINE;
	};
	
	var _getGemsList = function(item){
		if ( !item.gems || item.gems.length == 0 ) {
			return '';
		}
		
		var effectMapIdx = {};
		effectMapIdx[RES_EFF.H_ADD_PHY] = 0;
		effectMapIdx[RES_EFF.H_ADD_STR] = 1;
		effectMapIdx[RES_EFF.H_ADD_AGILE] = 2;
		effectMapIdx[RES_EFF.H_ADD_CO] = 3;
		
		var s = '';
		for (var i=0; i<item.gems.length; ++i ) {
			var gemId = item.gems[i];
			var itemres = ItemResUtil.findItemres(gemId);
			var effect = itemres.effects[0];
			
			s += TQ.formatColorStr(itemres.name, COLORS.ITEM_TIP_BESETGEMNAME);
			s += rstr.itemTip.besetGemEffects[ effectMapIdx[effect.id] ];
			s += TQ.formatColorStr('+' + effect.val, COLORS.APPEND_ATTR);
			s += C_TIP_NEWLINE;
		}
		
		return s;
	};
	
	var _getSalePrice = function(item){
		if (m_who == 'sys') return '';
		if (m_who == 'other') return '';
		if ( !item.itemres.salePrice ) return '';
		
		var s = TQ.format(rstr.itemTip.salePrice, item.itemres.salePrice);
		return TQ.formatColorStr(s, COLORS.ITEM_TIP_SALELPRICE) + C_TIP_NEWLINE;
	};
	
	var _getBuyLimit = function(item){
		if (!item.buylimit || item.buylimit.itemnumsec != 2 ) return '';
		
		var s = TQ.format(rstr.itemTip.buylimit, item.buylimit.itemnum);
		return TQ.formatColorStr(s, COLORS.ITEM_TIP_BUYLIMIT) + C_TIP_NEWLINE;
	};
	//ItemTooltip-unittest-end
});

BuildVarBarTooltip = function(){
	//-----------
	//private:const
	//-----------
	var C_TIP_NEWLINE = '<br/>';
	var C_YELLOW = '#FFFF00';
		
	//-----------
	//private:data
	//-----------
	var m_g;

	this.init = function(g){
		m_g = g;
	};
	
	this.getItemDesc = function(){
		var buildval = m_g.getImgr().getCityRes().buildval;
		var szTip = '<div class=itemtip>';
		szTip += '<B>'+rstr.briefrespanel.buildval.name+'</B>' + C_TIP_NEWLINE; // name
		szTip += C_TIP_NEWLINE;
		szTip += rstr.briefrespanel.buildval.curnum + (buildval.cur-buildval.hurt) + C_TIP_NEWLINE;
		szTip += rstr.briefrespanel.buildval.hurtnum + buildval.hurt + C_TIP_NEWLINE;	
		if (buildval.level < res_max_city_level) {
			szTip += rstr.briefrespanel.buildval.nextnum + buildval.max + C_TIP_NEWLINE;	
		}
		else {
			szTip += TQ.formatColorStr(rstr.briefrespanel.buildval.fulllevel, C_YELLOW) + C_TIP_NEWLINE;
		}
		szTip += '</div>';
		return szTip;		
	};
	
	this.init.apply(this, arguments);
};

TooltipMgr = function(){
	//-----------
	//private:const
	//-----------

	//-----------
	//private:data
	//-----------
	var m_g;
	var m_itemtip;
	var m_commrestip;
	var m_herotooltip;
	var m_poputooltip;
	var m_buildtooltip;
	var m_farmpiptooltip;
	var m_skilltooltip;
	var m_tacticskilltooltip;
	var m_specskilltooltip;
	var m_actortooltip;
	var m_playertooltip;
	var m_buildvalbartip;
	var m_moneytooltip;
	var m_cultureTooltip;

	//------------
	//public:method
	//------------
	this.initialize = function(){};
	
	this.init = function(g){
		m_g = g;
		m_itemtip = ItemTooltip.snew(m_g);
		m_commrestip = new CommResTooltip(m_g);
		m_herotooltip = new HeroTooltip(m_g);
		m_poputooltip = PopuTooltip.snew(m_g);
		m_buildtooltip = new BuildTooltip(m_g);
		m_farmpiptooltip = FarmPipTooltip.snew(m_g);
		m_skilltooltip = SkillTooltip.snew(m_g);
		m_actortooltip = new ActorTooltip(m_g);
		m_playertooltip = new PlayerTooltip(m_g);
		m_buildvalbartip = new BuildVarBarTooltip(m_g);
		m_moneytooltip = MoneyTooltip.snew(m_g);
		m_tacticskilltooltip = new TacticSkillTooltip(m_g);
		m_specskilltooltip = new SpecSkillTooltip(m_g);
		m_cultureTooltip = CultureTooltip.snew(m_g);
	};
	
	this.getItemAttrDesc = function(ritem){
		return m_itemtip.getItemAttrDesc(ritem);
	};
	
	this.getItemDescText = function(ritem, hero){
		return m_itemtip.getItemDescText(ritem, hero);
	};
	
	this.getItemDesc = function(ritem, who, isWear) {
		return m_itemtip.getItemDesc(ritem, who, isWear);
	};
	
	this.getCommResDesc = function(tag, resid) {
		return m_commrestip.getItemDesc(tag, resid);
	};
	
	this.getHeroDesc = function(hero){
		return m_herotooltip.getItemDesc(hero);
	};
	
	this.getNewHeroDesc = function(hero){
		return m_herotooltip.getNewHeroDesc(hero);
	};
	
	this.getNewHeroNatureFactorDesc = function(hero){
		return m_herotooltip.getNewHeroNatureFactorDesc(hero);
	};
	
	this.getPopuDesc = function(){
		return m_poputooltip.getItemDesc();
	};
	
	this.getFriendDesc = function(player){
		return m_playertooltip.getItemDesc(player);
	};
	
	this.getPlayerDesc = function(player){
		return m_playertooltip.getItemDesc(player);
	};
	
	this.getBuildDesc = function(cityId, tag, item){
		return m_buildtooltip.getItemDesc(cityId, tag, item);
	};
	
	this.getSimpleBuildUpTip = function(cityId, item){
		return m_buildtooltip.getSimpleUpgradeTip(cityId, item);
	};
	
	this.isCanBuildUpgrade = function(cityId, item){
		return m_buildtooltip.isCanUpgrade(cityId, item);
	};
	
	this.isFullBuildLevel = function(item){
		return m_buildtooltip.isFullLevel(item);
	};
	
	this.getFarmPipDesc = function(item){
		return m_farmpiptooltip.getItemDesc(item);
	};
	
	this.getSkillDesc = function(hero, item){
		return m_skilltooltip.getItemDesc(hero, item);
	};
	
	this.getTacticSkillDesc = function(item, showop){
		return m_tacticskilltooltip.getItemDesc(item, showop);
	};
	
	this.getSpecSkillDesc = function(item){
		return m_specskilltooltip.getItemDesc(item);
	};
	
	this.getActorDesc = function(actor){
		return m_actortooltip.getItemDesc(actor);
	};
	
	this.getItemExpends = function(ritem,hero){
		return  m_itemtip.getItemExpends(ritem,hero);
	};
	
	this.getBuildVarBarDesc = function(){
		return m_buildvalbartip.getItemDesc();
	};
	
	this.getMoneyDesc = function(){
		return m_moneytooltip.getItemDesc();
	};
	
	this.getCultureLearnDesc = function(culture){
		return m_cultureTooltip.getLearnDesc(culture);
	};
	
	this.getCultureDesc = function(culture){
		return m_cultureTooltip.getCultureDesc(culture);
	};
	
	this.isCultureCanLearn = function(culture){
		return m_cultureTooltip.isValid(culture);
	};
	
	this.makeItemTip = function(msg){
		return '<div class="itemtip">' + msg + '</div>';
	};
	
	this.makeItemTip2 = function(msg){
		return '<div class="itemtip2">' + msg + '</div>';
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

TIPM = new TooltipMgr();