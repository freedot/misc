/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
HyperLinkHdr = Class.extern(function(){
	this.init = function(g){
		this.g = g;
	};
	
	this.getAHeadFixParams = function(params){
		return 'event,\"'+params[0]+'\"';
	};
	
	this.makeCommLink = function(tipClass, sparams, tip, startTag, endTag, domid){
		if ( isNull(startTag) ) startTag = '[';
		if ( isNull(endTag) ) endTag = ']';
		
		var s = "<a class='"+tipClass+"'";
		if ( domid ) {
			s += " id='" + domid + "' name='" + domid + "'";
		}
		s += " href='#' onclick='javascript:HyperLinkMgr.onClickLink("+sparams+"); return false;' ondragstart='return false;' onselectstart='return false;'>" + startTag + tip + endTag + "</a>";
		return s;
	};	
	
	this.makeCommLinkEx = function(tipClass, sparams, tip, startTag, endTag){
		if ( isNull(startTag) ) startTag = '[';
		if ( isNull(endTag) ) endTag = ']';
		return "<a class='"+tipClass+"' href='#' onclick='javascript:HyperLinkMgr.onClickLink("+sparams+"); return false;' onMouseOver='javascript:HyperLinkMgr.onMouseOver("+sparams+"); return false;' onMouseOut='javascript:HyperLinkMgr.onMouseOut("+sparams+"); return false;' onMouseMove='javascript:HyperLinkMgr.onMouseMove("+sparams+"); return false;' ondragstart='return false;' onselectstart='return false;'>" + startTag + tip + endTag + "</a>";
	};	
});

HelpLinkHdr = HyperLinkHdr.extern(function(){
	this.makeLink = function(params){
		if ( params.length != 3 ) return null;
		var helpmsg = params[1];
		var tip = params[2];
		var sparams = this.getAHeadFixParams(params)+',\"'+helpmsg+'\"';
		return this.makeCommLink('ui-inner-help', sparams, tip);	
	};
	
	this.handleLink = function(e, params){
		var id = params[2];
		var dlg = UIM.getDlg('minihelp');
		dlg.openDlg(id);
	};
});

ImgHelpLinkHdr = HyperLinkHdr.extern(function(){
	this.makeLink = function(params){
		if ( params.length != 3 ) return null;
		var imgid = params[1];
		var tip = params[2];
		var sparams = this.getAHeadFixParams(params)+','+imgid;
		return this.makeCommLink('ui-link-imghelp', sparams, tip);	
	};
	
	this.handleLink = function(e, params){
		var id = params[2];
		var dlg = UIM.getDlg('imghelp');
		dlg.openDlg(id);
	};
});

RoleLinkHdr = HyperLinkHdr.extern(function(){
	this.makeLink = function(params){
		if ( params.length != 3 ) return null;
		var id = params[1];
		var name = params[2];
		var sparams = this.getAHeadFixParams(params)+','+id+',\"'+name+'\"';
		return  this.makeCommLink('ui-chat-link-player', sparams, name);
	};
	
	this.handleLink = function(e, params){
		var roleId = params[2];
		var roleName = params[3];
		var roleres = this.g.getImgr().getRoleRes();
		if ( roleName != roleres.name ){
			HDRM.getHdr('clickrole').click( TQ.mouseCoords(e), roleId, roleName);
		}
	};
});

HeroLinkHdr = HyperLinkHdr.extern(function(){
	this.makeLink = function(params){
		if ( params.length != 3 ) return null;
		var id = params[1];
		var name = params[2];
		var sparams = this.getAHeadFixParams(params)+','+id+',\"'+name+'\"';
		return  this.makeCommLink('ui-chat-link-hero', sparams, name);	
	};
	
	this.handleLink = function(e, params){
	};
});

ShowItemLinkHdr = HyperLinkHdr.extern(function(){
	this.makeLink = function(params){
		if ( params.length != 4 ) return null;
		var resid = params[1];
		var uid = params[2];
		var roleid = params[3];
		var tip = RStrUtil.getItemColorNameByResId(resid);
		var sparams = this.getAHeadFixParams(params)+','+resid+','+uid+','+roleid;
		return  this.makeCommLink('ui-chat-link-item', sparams, tip, '', '');	
	};
	
	this.handleLink = function(e, params){
		var resid = params[2];
		var uid = params[3];
		var roleid = params[4];
		var itemres = ItemResUtil.findItemres(resid);
		var ch = HDRM.getHdr('clickitem');
		ch.click( TQ.mouseCoords(e),  roleid, {id:uid, resid:resid, itemres:itemres});	
	};
});

BuyItemLinkHdr = HyperLinkHdr.extern(function(){
	this.makeLink = function(params){
		if ( params.length != 3 ) return null;
		var resid = params[1];
		var tip = params[2];
		var sparams = this.getAHeadFixParams(params)+','+resid;
		return  this.makeCommLink('ui-link-buyitem', sparams, tip);	
	};
	
	this.handleLink = function(e, params){
		var resid = params[2];
		var buyitemdlg = UIM.getDlg('buyitem');
		buyitemdlg.openDlg({id:0,resid:resid,number:10000});
		this.g.getGUI().hideMsgBox();
	};
});

FightDemoLinkHdr = HyperLinkHdr.extern(function(){
	var _super = this.init;
	this.init = function(g){
		_super(g);
		this._id = 0;
	};
	
	this.makeLink = function(params){
		if ( params.length != 3 ) return null;
		var armyId = params[1];
		var fightId = params[2];
		var sparams = this.getAHeadFixParams(params)+','+armyId+','+fightId;
		var id = 'fight_demo_a_' + (this._id++);
		return  this.makeCommLink('ui-link-fightdemo', sparams, rstr.fight.showfightdemo,  '[', ']', id);	
	};
	
	this.handleLink = function(e, params){
		var armyId = params[2];
		var fightId = params[3];
		UIM.openDlg('fightmap', armyId, fightId);
		HelpGuider.hideSpiritTip();
	};
});

RechargeLinkHdr = HyperLinkHdr.extern(function(){
	this.makeLink = function(params){
		if ( params.length != 2 ) return null;
		var tip = params[1];
		return  this.makeCommLink('ui-link-buyitem', this.getAHeadFixParams(params), tip);	
	};
	
	this.handleLink = function(e, params){
		JMISC.openPayWnd();
		this.g.getGUI().hideMsgBox();
	};
});

GotoMapLinkHdr = HyperLinkHdr.extern(function(){
	this.makeLink = function(params){
		if ( params.length != 3 ) return null;
		var sparams = this.getAHeadFixParams(params) + ',' + params[1] + ',' + params[2];
		var tip = params[1] + ',' + params[2];
		return  this.makeCommLink('ui-link-gotomap', sparams, tip, '(', ')');	
	};
	
	this.handleLink = function(e, params){
		UIM.closeMapPanels();
		UIM.getPanel('field').open();
		UIM.getPanel('field').gotoPos({x:params[2], y:params[3]});
	};
});

AllianceLinkHdr = HyperLinkHdr.extern(function(){
	this.makeLink = function(params){
		if ( params.length != 2 ) return null;
		var sparams = this.getAHeadFixParams(params) + ',' + '\"' + params[1] + '\"';
		var tip = params[1];
		return  this.makeCommLink('ui-link-alliance', sparams, tip);
	};
	
	this.handleLink = function(e, params){
		AllianceSender.sendGetAllianceDetail(this.g, params[2]);
	};
});

YellowLinkHdr = HyperLinkHdr.extern(function(){
	this.init = function(g){
		this.g = g;
		var tipid = TTIP.addTip(TQ.getUiBody(), rstr.yellowdiamondDlg.tip.seeyd);
		this.tip_ = TTIP.getTipById(tipid);
		this.tip_.setFlag(TIP_FLAG.CUSTOM);
	};
	
	this.handleLink = function(e, params){
		UIM.openDlg('yellowdiamond');
	};
	
	this.onMouseOver = function(e){
		var pos = TQ.mouseCoords(e);
		this.tip_.show(pos);
	};
	
	this.onMouseMove = function(e){
		var pos = TQ.mouseCoords(e);
		this.tip_.show(pos);
	};
	
	this.onMouseOut = function(e){
		this.tip_.hide();
	};
});


BlueLinkHdr = HyperLinkHdr.extern(function(){
	this.init = function(g, flag){
		this.g = g;
		var tipid = 0;
		if (flag == 'self') {
			tipid = TTIP.addTip(TQ.getUiBody(), rstr.bluediamondDlg.tip.seebd2);
		} else {
			tipid = TTIP.addTip(TQ.getUiBody(), rstr.bluediamondDlg.tip.seebd);
		}
		this.tip_ = TTIP.getTipById(tipid);
		this.tip_.setFlag(TIP_FLAG.CUSTOM);
	};
	
	this.handleLink = function(e, params){
		UIM.openDlg('bluediamond');
	};
	
	this.onMouseOver = function(e){
		var pos = TQ.mouseCoords(e);
		this.tip_.show(pos);
	};
	
	this.onMouseMove = function(e){
		var pos = TQ.mouseCoords(e);
		this.tip_.show(pos);
	};
	
	this.onMouseOut = function(e){
		this.tip_.hide();
	};
});

Blue3366LinkHdr = HyperLinkHdr.extern(function(){
	this.init = function(g, flag){
		this.g = g;
		var tipid = TTIP.addTip(TQ.getUiBody(), '');
		this.tip_ = TTIP.getTipById(tipid);
		this.tip_.setFlag(TIP_FLAG.CUSTOM);
		this.tip_.setCaller({self:this, caller:this.onGetTip});
		this.level_ = 0;
	};
	
	this.handleLink = function(e, params){
		UIM.openDlg('blue3366diamond');
	};
	
	this.onMouseOver = function(e, params){
		this.level_ = params[2];
		var pos = TQ.mouseCoords(e);
		this.tip_.show(pos);
	};
	
	this.onMouseMove = function(e){
		var pos = TQ.mouseCoords(e);
		this.tip_.show(pos);
	};
	
	this.onMouseOut = function(e){
		this.tip_.hide();
	};
	
	this.onGetTip = function(){
		return TQ.format(rstr.bluediamondDlg.tip.see3366, this.level_);
	};
});

VipLinkHdr = HyperLinkHdr.extern(function(){
	this.makeLink = function(params){
		if ( params.length != 2 ) return null;
		var tip = params[1];
		return  this.makeCommLink('ui-link-openvip',  this.getAHeadFixParams(params), tip);	
	};
	
	this.handleLink = function(e, params){
		UIM.openDlg('vip');
		this.g.getGUI().hideMsgBox();
	};
});

ALinkHdr = HyperLinkHdr.extern(function(){
	this.makeLink = function(params){
		if ( params.length != 3 ) return null;
		var tip = params[1];
		var sparams = this.getAHeadFixParams(params) + ',"' + params[1] + '","' + params[2] + '"';
		return  this.makeCommLink('ui-link-alink',  sparams, tip);	
	};
	
	this.handleLink = function(e, params){
		window.open('http://' + params[3]);
	};
});

TipLinkHdr = HyperLinkHdr.extern(function(){
	this.init = function(g){
		this.g = g;
		var tipid = TTIP.addTip(TQ.getUiBody(), '');
		this.tip_ = TTIP.getTipById(tipid);
		this.tip_.setFlag(TIP_FLAG.CUSTOM);
		this.tip_.setCaller({self:this, caller:this._onGetBlockTooltip});
		this.tipmsg_ = 'xxx';
	};
	
	this.makeLink = function(params){
		if ( params.length != 3 ) return null;
		var txt = params[1];
		var tip = params[2];
		var sparams = this.getAHeadFixParams(params)+',\"'+tip+'\"';
		return this.makeCommLinkEx('ui-link-openvip',  sparams, txt, '', '');	
	};
	
	this.handleLink = function(e, params){
		var pos = TQ.mouseCoords(e);
		this.tip_.show(pos);
	};
	
	this.onMouseOver = function(e, params){
		this.tipmsg_ =  '<div class="itemtip2">' + params[2] + '</div>';
		var pos = TQ.mouseCoords(e);
		this.tip_.show(pos);
	};
	
	this.onMouseMove = function(e){
		var pos = TQ.mouseCoords(e);
		this.tip_.show(pos);
	};
	
	this.onMouseOut = function(e){
		this.tipmsg_ = '';
		this.tip_.hide();
	};
	
	this._onGetBlockTooltip = function(){
		return this.tipmsg_;
	};
});

HyperLinkMgr = Class.extern(function(){
	var LINKID_INNER_HELP = '?';
	var LINKID_ROLE = 'r';
	var LINKID_HERO = 'h';
	var LINKID_SHOWITEM = 'i';
	var LINKID_BUYITEM = 'b';
	var LINKID_FIGHTDEMO = 'f';
	var LINKID_RECHARGE = 'c';
	var LINKID_GOTOMAP = 'm';
	var LINKID_ALLI = 'a';
	var LINKID_IMGHELP = 'H';
	var LINKID_YELLOWDIAMOND = 'Y';
	var LINKID_BLUEDIAMOND = 'B';
	var LINKID_OTHER_BLUEDIAMOND = 'OB';
	var LINKID_3366_BLUEDIAMOND = '3366';
	var LINKID_VIP = 'V';
	var LINKID_A_LINK = 'A';
	var LINKID_TIP = 'TIP';

	var m_g;
	var m_this;
	var m_formatLinkHdrs={};
	
	this.init = function(){
		m_this = this;
	};
	
	this.initOneTime = function(g){
		m_g = g;
		m_formatLinkHdrs[LINKID_INNER_HELP] = HelpLinkHdr.snew(m_g);
		m_formatLinkHdrs[LINKID_ROLE] = RoleLinkHdr.snew(m_g);
		m_formatLinkHdrs[LINKID_HERO] = HeroLinkHdr.snew(m_g);
		m_formatLinkHdrs[LINKID_SHOWITEM] = ShowItemLinkHdr.snew(m_g);
		m_formatLinkHdrs[LINKID_BUYITEM] = BuyItemLinkHdr.snew(m_g);
		m_formatLinkHdrs[LINKID_FIGHTDEMO] = FightDemoLinkHdr.snew(m_g);
		m_formatLinkHdrs[LINKID_RECHARGE] = RechargeLinkHdr.snew(m_g);
		m_formatLinkHdrs[LINKID_GOTOMAP] = GotoMapLinkHdr.snew(m_g);
		m_formatLinkHdrs[LINKID_ALLI] = AllianceLinkHdr.snew(m_g);
		m_formatLinkHdrs[LINKID_IMGHELP] = ImgHelpLinkHdr.snew(m_g);
		m_formatLinkHdrs[LINKID_YELLOWDIAMOND] = YellowLinkHdr.snew(m_g);
		m_formatLinkHdrs[LINKID_BLUEDIAMOND] = BlueLinkHdr.snew(m_g, 'self');
		m_formatLinkHdrs[LINKID_OTHER_BLUEDIAMOND] = BlueLinkHdr.snew(m_g, 'other');
		m_formatLinkHdrs[LINKID_3366_BLUEDIAMOND] = Blue3366LinkHdr.snew(m_g);
		m_formatLinkHdrs[LINKID_VIP] = VipLinkHdr.snew(m_g);
		m_formatLinkHdrs[LINKID_A_LINK] = ALinkHdr.snew(m_g);
		m_formatLinkHdrs[LINKID_TIP] = TipLinkHdr.snew(m_g);
	};
	
	this.getHdr = function(key){
		return m_formatLinkHdrs[key];
	};
	
	this.onClickLink = function(){
		var e = arguments[0] ? arguments[0] : window.event;
		var key = arguments[1];
		var linkHdr = m_formatLinkHdrs[key];
		if ( !linkHdr ) return false;
		
		linkHdr.handleLink(e, arguments);
		return false;
	};
	
	this.onMouseOver = function(){
		var e = arguments[0] ? arguments[0] : window.event;
		var key = arguments[1];
		var linkHdr = m_formatLinkHdrs[key];
		if ( !linkHdr ) return false;
		linkHdr.onMouseOver(e, arguments);
		return false;
	};
	
	this.onMouseMove = function(){
		var e = arguments[0] ? arguments[0] : window.event;
		var key = arguments[1];
		var linkHdr = m_formatLinkHdrs[key];
		if ( !linkHdr ) return false;
		linkHdr.onMouseMove(e, arguments);
		return false;
	};
	
	this.onMouseOut = function(){
		var e = arguments[0] ? arguments[0] : window.event;
		var key = arguments[1];
		var linkHdr = m_formatLinkHdrs[key];
		if ( !linkHdr ) return false;
		linkHdr.onMouseOut(e, arguments);
		return false;
	};
	
	// 内嵌格式： 例如帮助的 #[?:1000:文本] 
	this.formatLink = function(s){
		return _formatLink(s);
	};
	
	this.formatChatName = function(uid,name){
		var encodeLink = '#[r:'+uid+':'+name+']';
		return _formatLink(encodeLink);
	};
	
	var _formatLink = function(s){
		var decodeLink = s.replace(/#\[[^\]]*\]/g, function(word){
			var w = word.substr(2, word.length - 3); // 减去 #[]  3个字符的长度
			var params = w.split(':');
			if ( params.length >= 2 ){
				var key = params[0];
				var linkHdr = m_formatLinkHdrs[key];
				if ( !linkHdr ) return word;
				
				var decodeWord = linkHdr.makeLink(params);
				if ( decodeWord ) return decodeWord;
			}
			return word;
		});
		return decodeLink;
	};
}).snew();

