/*******************************************************************************/
RankDlg = JBaseDlg.ex({
	_innerInit : function(){
		this.TAB_ROLE_IDX_ = 0;
		this.TAB_ALLI_IDX_ = 1;
		this.TAB_ACTTOWER_IDX_ = 2;
		this.rolePanel_ = null;
		this.alliPanel_ = null;
		this.actTowerPanel_ = null;
	}
	
	,_getDlgCfg : function(){
		return {modal:false, title:rstr.rankingdlg.title, pos:{x:"center", y:40}, uicfg:uicfg.rankingdlg};
	}
	
	,_afterCreate : function(){
		this._createRolePanel();
		this._createAlliancePanel();
		this._createActTowerPanel();
	}
	
	,_createRolePanel : function(){
		var items = this.items_.tablist.getTabItems(this.TAB_ROLE_IDX_);
		this.rolePanel_ = RankRolePanel.snew(this.g_, this, items);
	}
	
	,_createAlliancePanel : function(){
		var con = this.items_.tablist.getTabItems(this.TAB_ALLI_IDX_).con;
		this.alliPanel_ = AlliListDlgTempl.snew(this.g_, this, con, 'rank');
	}
	
	,_createActTowerPanel : function(){
		var items = this.items_.tablist.getTabItems(this.TAB_ACTTOWER_IDX_);
		this.actTowerPanel_ = RankActTowerPanel.snew(this.g_, this, items);
	}
	
	,_initInfo : function(){
		this.alliPanel_.openDlg(0);
		this.items_.tablist.activeTab(0);
		this.rolePanel_.refreshCurPage();
		this.actTowerPanel_.refreshCurPage();
	}
});

RankBasePanel = Class.extern(function(){
	this.g_ = null;
	this.dlg_ = null;
	this.items_ = null;
	this.pageBar_ = null;
	this.rankroles_ = null;
	this.lastPageNo_ = 1;
	this.init = function(g, dlg, items){
		this.g_ = g;
		this.dlg_ = dlg;
		this.items_ = items;
		this._createPageBar();
		this._regEvents();
	};
	
	this.refreshCurPage = function(){
		this._sendGetPageRank(this.lastPageNo_);
	};
	
	this._createPageBar = function(){
		this.pageBar_ = RankPageBar.snew(this.g_, rstr.alli.listdlg.lbl.searchrole, JVALID.getMaxUserLen(), this.items_.pageBarCon, this.items_);
		this.pageBar_.regObServer(this);
	};
	
	// callback for pageBar
	this.onPageBarClickSearch = function(name){ 
		if ( name == '' ) {
			return;
		}
		
		if ( !JVALID.checkUsername(name) ){
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.alli.listdlg.tip.invalidrole);
			return;
		}
		
		this._sendSearchRoleForRank(name);
	};
	
	// callback for pageBar
	this.onPageBarClickGetSelf = function(){ 
		this._sendSearchRoleForRank(this.g_.getImgr().getRoleName());
	};
	
	// callback for pageBar
	this.onPageNavigate = function(pageNo){
		this.lastPageNo_ = pageNo;
		this._sendGetPageRank(pageNo);
	};
	
	this._onSvrPkg = function(netevent){
		if ( !this.dlg_.isShow() ) return;
		this._updateBySvrPkg(netevent);
	};
	
	this._updateBySvrPkg = function(netevent){
		var netdata = netevent.data;
		if (!netdata.ranks) return;
		
		this.rankroles_ = netdata.ranks;
		this.pageBar_.setPageBarNoActive(netdata.pageNo, netdata.pageCount);
		this._setListItems(this.rankroles_);
		this._setListItemBtnsCaller();
		this._setCurSelectItem(netdata.curSelIdx);
	};
	
	this._setListItems = function(ranks){
		this.items_.list.setItemCount(ranks.length);
		for ( var i=0; i<this.items_.list.getCount(); ++i ) {
			var item = this.items_.list.getItem(i);
			var res = ranks[i];
			this._setListItem(item, res);
		}
	};
	
	this._setListItemBtnsCaller = function(){
		for ( var i=0; i<this.items_.list.getCount(); ++i ) {
			var item = this.items_.list.getItem(i);
			item.exsubs.seebtn.setId(i);
			item.exsubs.seebtn.setCaller({self:this, caller:this._onClickSeeOp});
			item.exsubs.chatbtn.setId(i);
			item.exsubs.chatbtn.setCaller({self:this, caller:this._onClickChatOp});
			item.exsubs.letterbtn.setId(i);
			item.exsubs.letterbtn.setCaller({self:this, caller:this._onClickLetterOp});
		}
	};
	
	this._setCurSelectItem = function(curSelIdx){
		this.items_.list.setCurSel(curSelIdx);
	};
	
	this._onClickSeeOp = function(idx){
		var role = this.rankroles_[idx];
		var field = {gridId:role.gridId, objType:OBJ_TYPE.ROLE, roleId:role.roleId, roleName:role.name, alliance:{uid:-1,name:'--'}};
		UIM.getDlg('rolecity').openDlg(field);
	};
	
	this._onClickChatOp = function(idx){
		var role = this.rankroles_[idx];
		UIM.getPanel('chat').setChatTarget(role.name);
	};
	
	this._onClickLetterOp = function(idx){
		var role = this.rankroles_[idx];
		UIM.getDlg('writeletter').writeLetterTo(role.name);
	};	
	
	this._regEvents = function(){};
	this._sendSearchRoleForRank = function(name){};
	this._sendGetPageRank = function(pageNo){};
	this._setListItem = function(item, res){};
});

RankRolePanel = RankBasePanel.extern(function(){
	this._regEvents = function(){
		this.g_.regEvent(EVT.NET, NETCMD.ROLEBASE, this, this._onSvrPkg);
	};
	
	this._sendSearchRoleForRank = function(name) {
		RoleSender.sendSearchRoleForRank(this.g_, name);
	};
	
	this._sendGetPageRank = function(pageNo){
		RoleSender.sendGetPageRankRoles(this.g_, pageNo);
	};
	
	this._setListItem = function(item, res){
		TQ.setTextEx(item.exsubs.rank, res.rank);
		TQ.setTextEx(item.exsubs.role, res.name);
		TQ.setTextEx(item.exsubs.alli, res.alli);
		TQ.setTextEx(item.exsubs.level, res.level);
		TQ.setTextEx(item.exsubs.buildVal, res.buildVal);
	};
});

RankActTowerPanel = RankBasePanel.extern(function(){
	this._regEvents = function(){
		this.g_.regEvent(EVT.NET, NETCMD.ACT_TOWER, this, this._onSvrPkg);
	};
	
	this._sendSearchRoleForRank = function(name) {
		ActTowerSender.sendSearchRoleForRank(this.g_, name);
	};
	
	this._sendGetPageRank = function(pageNo){
		ActTowerSender.sendGetPageRankRoles(this.g_, pageNo);
	};	
	
	this._setListItem = function(item, res){
		TQ.setTextEx(item.exsubs.rank, res.rank);
		TQ.setTextEx(item.exsubs.role, res.name);
		TQ.setTextEx(item.exsubs.maxLayer, res.maxLayer);
		TQ.setTextEx(item.exsubs.maxTime, TQ.formatDateTime(res.maxTime));
	};
});