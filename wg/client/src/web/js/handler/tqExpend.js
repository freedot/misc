/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
Expend = Class.extern(function(){
	this.init = function(g, expend) {
		this.g = g;
		this.expend = expend;
	};
	
	this.getAttr = function() {
		return this.expend.attr;
	};
	
	this.getVal = function() {
		return this.expend.val;
	};
});

ItemExpend = Expend.extern(function(){
	this.isEnough = function() {
		var item = this.g.getImgr().getItemNumByResId(this.expend.resid);
		var rt = item && (item.number >= this.expend.val);
		return rt;
	};
});

RoleAttrExpend = Expend.extern(function(){
	this.isEnough = function(){
		var attr = this.g.getImgr().getRoleAttrVal(this.expend.attr);
		var rt = ( attr && (attr.val >= this.expend.val) );
	};
});


HeroAttrExpend = Expend.extern(function(){
	this.init = function(g, heroid, expend){
		this.g = g;
		this.heroid = heroid;
		this.expend = expend;
	};
	
	this.isEnough = function(filterlog){
		var hero = this.g.getImgr().getHero(this.heroid);
		var attr = hero.attrs[this.expend.attr];
		var rt = ( attr && (attr.val >= this.expend.val) );
		if ( !rt && !filterlog ) {
			var msg = MsgTipUtil.formatIdMsg(this.g, 100002, ['@heroid'+this.heroid, '@attrid'+this.expend.attr, this.expend.val]);
			this.g.getGUI().sysMsgTips(SMT_ERROR, msg);
		}
		return rt;
	};
});

MoneyExpend = Expend.extern(function(){
	this.isEnough = function(filterlog){
		var rt = (this.g.getImgr().getMoney() >= this.expend.val);
		if ( !rt && !filterlog ) {
			var msg = MsgTipUtil.formatIdMsg(this.g, 100004, ['@attrid'+this.expend.attr, this.expend.val]);
			this.g.getGUI().sysMsgTips(SMT_ERROR, msg);
		}
		return rt;
	};
});

BindMoneyExpend = Expend.extern(function(){
	this.isEnough = function(filterlog){
		var rt = (this.g.getImgr().getMoney() >= this.expend.val);
		if ( !rt && !filterlog ) {
			var msg = MsgTipUtil.formatIdMsg(this.g, 100004, ['@attrid'+this.expend.attr, this.expend.val]);
			this.g.getGUI().sysMsgTips(SMT_ERROR, msg);
		}
		return rt;
	};
});

GoldExpend = Expend.extern(function(){
	this.isEnough = function(){
		return (this.g.getImgr().getGold() >= this.expend.val);
	};
});

GiftGoldExpend = Expend.extern(function(){
	this.isEnough = function(filterlog){
		var rt = (this.g.getImgr().getAllGold() >= this.expend.val);
		if ( !rt && !filterlog ) {
			var msg = MsgTipUtil.formatIdMsg(this.g, 100006, [this.expend.val]);
			this.g.getGUI().sysMsgTips(SMT_ERROR, msg);
		}
		return rt;
	};
});

ExpendUtil = new function(){
	this.createExpendObjs = function(g, heroid, expends){
		var expendobjs = [];
		for ( var i=0; i<expends.length; ++i ) {
			var expend = expends[i];
			if ( expend.type == EXPEND_TYPE.ROLEATTR ) {
				expendobjs.push(RoleAttrExpend.snew(g, expend));
			} 
			else if ( expend.type == EXPEND_TYPE.HEROATTR ) {
				expendobjs.push(HeroAttrExpend.snew(g, heroid, expend));
			} 
			else if ( expend.type == EXPEND_TYPE.ITEM ) {
				expendobjs.push(ItemExpend.snew(g, expend));
			} 
			else if ( expend.type == EXPEND_TYPE.MONEY ) {
				expendobjs.push(MoneyExpend.snew(g, expend));
			} 
			else if ( expend.type == EXPEND_TYPE.GOLD ) {
				expendobjs.push(GoldExpend.snew(g, expend));
			} 
			else if ( expend.type == EXPEND_TYPE.GIFTGOLD ) {
				expendobjs.push(GiftGoldExpend.snew(g, expend));
			}
		}
		return expendobjs;
	};
	
	this.isEnough = function(expends) {
		for ( var i=0; i<expends.length; ++i ) {
			if ( !expends[i].isEnough() ) return false;
		}
		return true;
	};
	
	this.getExpend = function(expends, attr) {
		for ( var i=0; i<expends.length; ++i ) {
			if ( expends[i].getAttr() == attr ) return expends[i];
		}
		return null;
	};
};

MsgTipUtil = new function(){
	var C_ITEMIDTAG = '@itemid';
	var C_HEROIDTAG = '@heroid';
	var C_ATTRIDTAG = '@attrid';
	var C_SKILLIDTAG = '@skillid';
	var C_CITYIDTAG = '@cityid';
	var C_ARMPOSTAG = '@armpos';
	var C_EFFECTIDTAG = '@effid';
	var C_BUILD_UP_TIP_TAG = '@buptip';
	var C_CULTURES_UP_TIP_TAG = '@cuptip';
	
	this.formatIdMsg = function(g, msgid, params) {
		this.formatParams(g, params);
		return TQ.formatArgs(rstr.ids[msgid].msg, params);
	};
	
	this.formatParams = function(g, params) {
		for ( var i=0; i<params.length; ++i ) {
			params[i] = _formatParam(g, params[i]);
		}
	};
	
	var _formatParam = function(g, param) {
		if ( typeof(param) != 'string' ) {
		} else if ( param.indexOf(C_ITEMIDTAG) == 0 ) {
			var itemid = _getIdFromString(param, C_ITEMIDTAG.length);
			var res = ItemResUtil.findItemres(itemid);
			if (!res) return '';
			
			if ( res.level ) {
				return ItemNameColorGetter.getColorVal(res.level, res.name);
			} else {
				return TQ.formatColorStr(res.name, ITEM_COLORS[0]);
			}
		} else if ( param.indexOf(C_HEROIDTAG) == 0 ) {
			var heroid = _getIdFromString(param, C_HEROIDTAG.length);
			var hero = g.getImgr().getHero(heroid);
			if ( hero ) return hero.name;
		} else if ( param.indexOf(C_ATTRIDTAG) == 0 ) {
			var attrid = _getIdFromString(param, C_ATTRIDTAG.length);
			var res = TQ.qfind(res_attrs, 'id', attrid);
			if ( res ) return res.name;
		} else if ( param.indexOf(C_SKILLIDTAG) == 0 ) {
			var skillid = _getIdFromString(param, C_SKILLIDTAG.length);
			var res = ItemResUtil.findItemres(skillid);
			if ( res ) return res.name;
		} else if ( param.indexOf(C_CITYIDTAG) == 0 ) {
			var cityid = _getIdFromString(param, C_CITYIDTAG.length);
			var res = ItemResUtil.findItemres(cityid);
			if ( res ) return res.name;
		} else if ( param.indexOf(C_ARMPOSTAG) == 0 ) {
			var armpos = _getIdFromString(param, C_ARMPOSTAG.length);
			return rstr.comm.armPosName[armpos];
		} else if ( param.indexOf(C_EFFECTIDTAG) == 0 ) {
			var effid = _getIdFromString(param, C_EFFECTIDTAG.length);
			var res = TQ.qfind(res_effects, 'id', effid);
			if (res && res.name) return res.name;
		} else if ( param.indexOf(C_BUILD_UP_TIP_TAG) == 0 ) {
			var buildid = _getIdFromString(param, C_BUILD_UP_TIP_TAG.length);
			var res = TQ.qfind(res_items_builds, 'id', buildid);
			if (res && res.uptip) return res.uptip;
		} else if ( param.indexOf(C_CULTURES_UP_TIP_TAG) == 0 ) {
			var cid = _getIdFromString(param, C_CULTURES_UP_TIP_TAG.length);
			var res = TQ.qfind(res_items_cultures, 'id', cid);
			if (res && res.uptip) return res.uptip;
		}
		return param;	
	};
	
	var _getIdFromString = function(s, pos) {
		return parseInt(s.substr(pos, s.length-pos), 10);
	};
};


