/*******************************************************************************/
AutoBuildDlg = BaseDlg.extern(function(){
	this._init = function(){
		this.collectBuilds_ = [];
		this.autoBuilds_ = [];
		this.isModify_ = false;
		this.g_.regEvent(EVT.NET, NETCMD.AUTOBUILD, this, this._onSvrPkg);
	};
	
	this._getDlgCfg = function(){
		return {modal:false, title:rstr.autobuilddlg.title, pos:{x:"center", y:40}, uicfg:uicfg.inbuild.autobuilddlg};
	}; 
	
	this._afterCreate = function(){
		for ( var i=0; i<rstr.autobuilddlg.types.length; ++i ) {
			this.items_.cityType.addItem({text:rstr.autobuilddlg.types[i]});
		}
	};	
	
	this._setCallers = function(){
		this.items_.startBtn.setCaller({self:this, caller:this._onClickStartBtn});
		this.items_.cityType.setCaller({self:this, caller:this._onSelCityType});
	};	
	
	this._initInfo = function(){
		this._update();
		this.items_.cityType.setCurSel(0);
	};
	
	this._update = function(){
		if ( !this.isShow() ) return;
		this._reset();
		this._updateStartBtn();
		this._updateAutoBuildsList(true);
		this._updateCanBuildsList();
		this._updateNumber();
	};
	
	this._reset = function(){
		this.isModify_ = false;
	};
	
	this._updateStartBtn = function(){
		if ( this.imgr_.getAutoBuild().starting == 0 || this.isModify_ ) {
			this.items_.startBtn.enable(true);
			this.items_.startBtn.setText(rstr.autobuilddlg.btn.start);
			if ( this.isModify_ && this.autoBuilds_.length == 0 ) {
				this.items_.startBtn.setText(rstr.autobuilddlg.btn.confirm);
			}
		} else {
			this.items_.startBtn.enable(false);
			this.items_.startBtn.setText(rstr.autobuilddlg.btn.starting);
		}
	};
	
	this._updateCanBuildsList = function(){
		this.collectBuilds_ = this._collectCanBuilds();
		this.items_.canBuildsList.setItemCount(this.collectBuilds_.length);
		for ( var i=0; i<this.items_.canBuildsList.getCount(); ++i ) {
			var item = this.items_.canBuildsList.getItem(i);
			var build = this.collectBuilds_[i];
			TQ.setRichText(item.exsubs.name, TQ.format(rstr.autobuilddlg.lbl.buildname, build.itemres.name, build.level) );
			item.exsubs.addBtn.setId( i );
			item.exsubs.addBtn.setCaller({self:this, caller:this._onClickAddBtn});
		}
	};
	
	this._updateNumber = function(){
		var autoBuild = this.imgr_.getAutoBuild();
		TQ.setRichText(this.items_.number, this.autoBuilds_.length + '/' + autoBuild.max);
		if ( autoBuild.max == 0 ) {
			TQ.setRichText(this.items_.desc, HyperLinkMgr.formatLink(rstr.autobuilddlg.lbl.noEnoughVip));
		} else {
			TQ.setRichText(this.items_.desc, rstr.autobuilddlg.lbl.canBuildList);
		}
	};
	
	this._updateAutoBuildsList = function(isNeedUpdateData){
		if ( isNeedUpdateData ) {
			this.autoBuilds_ = [];
			TQ.dictCopy(this.autoBuilds_, this.imgr_.getAutoBuild().list);
		}
		
		this.items_.autoBuildsList.setItemCount(this.autoBuilds_.length);
		for ( var i=0; i<this.items_.autoBuildsList.getCount(); ++i ) {
			var item = this.items_.autoBuildsList.getItem(i);
			TQ.setRichText(item.exsubs.no, (i+1).toString() );
			var combineId = this._splitCombineId(this.autoBuilds_[i]);
			var build = this._getBuild(combineId.cid, combineId.id);
			if ( !build ) {
				TQ.setRichText(item.exsubs.name, '--' );
			} else {
				TQ.setRichText(item.exsubs.name, TQ.format(rstr.autobuilddlg.lbl.buildname, build.itemres.name, build.level) );
			}
			item.exsubs.removeBtn.setId( i );
			item.exsubs.removeBtn.setCaller({self:this, caller:this._onClickRemoveBtn});
		}
	};
	
	this._getBuild = function(cityId, buildId){
		var builds = this.imgr_.getBuildsByCityId(cityId);
		return TQ.find(builds, 'id', buildId );
	};
	
	this._collectCanBuilds = function() {
		var selType = this.items_.cityType.getCurSel();
		var cityIds = [];
		if ( selType == 0 ) {
			cityIds = [BUILDCITY_ID.MAIN, BUILDCITY_ID.SUB1, BUILDCITY_ID.SUB2, BUILDCITY_ID.SUB3, BUILDCITY_ID.SUB4];
		} else if ( selType > 0 ) {
			cityIds = [selType];
		}
		
		var collectBuilds = [];
		for ( var i=0; i<cityIds.length; ++i ) {
			var cityId = cityIds[i];
			var builds = this.imgr_.getBuildsByCityId(cityId);
			for ( var buildIdx=0; buildIdx<builds.length; buildIdx++ ) {
				var build = builds[buildIdx];
				if ( TIPM.isCanBuildUpgrade(cityId, build) && build.state == 0 && !this._isInAutoQueue(build) ) {
					collectBuilds.push(build);
				}
			}		
		}
		
		return collectBuilds;
	};
	
	this._isInAutoQueue = function(build) {
		for ( var i=0; i<this.autoBuilds_.length; ++i ) {
			var abuild = this.autoBuilds_[i];
			if ( abuild == this._combineId(build.cid, build.id) ) {
				return true;
			}
		}
		return false;
	};
	
	this._splitCombineId = function(combineId){
		var rt = {cid:0, id:0};
		rt.cid = Math.floor(combineId/1000);
		rt.id = combineId%1000;
		return rt;
	};
	
	this._combineId = function(cityId, buildId){
		return cityId*1000 + buildId;
	};	
	
	this._onClickStartBtn = function(){
		var ids = [];
		for ( var i=0; i<this.autoBuilds_.length; ++i ) {
			ids.push(this.autoBuilds_[i]);
		}
		AutoBuildSender.sendStartBuild(this.g_, ids);
	};
	
	this._onSelCityType = function(){
		this._updateCanBuildsList();
	};
	
	this._onClickAddBtn = function(idx){
		if ( this._isArriveMaxCount() ) {
			this.g_.getGUI().sysMsgTips(SMT_WARNING, rstr.autobuilddlg.tip.fullAutoQueue);
			return;
		}
		
		var build = this.collectBuilds_[idx];
		this.autoBuilds_.push(this._combineId(build.cid, build.id));
		this._updateWhenModify();
	};
	
	this._onClickRemoveBtn = function(idx){
		this.autoBuilds_.splice(idx, 1);
		this._updateWhenModify();
	};
	
	this._updateWhenModify = function(){
		this.isModify_ = true;
		this._updateStartBtn();
		this._updateAutoBuildsList(false);
		this._updateCanBuildsList();
		this._updateNumber();
	};
	
	this._onSvrPkg = function(netevent){
		var data = netevent.data;
		if ( !data.autobuild ) return;
		
		TQ.dictCopy(this.g_.getImgr().getAutoBuild(), data.autobuild);
		if ( data.autobuild.list && data.autobuild.list.length == 0 ) {
			this.g_.getImgr().getAutoBuild().list = [];
		}
		this.g_.sendEvent({eid:EVT.AUTOBUILD, sid:0});
		this._update();
	};
	
	this._isArriveMaxCount = function(){
		return this.autoBuilds_.length >= this.imgr_.getAutoBuild().max;
	};
});