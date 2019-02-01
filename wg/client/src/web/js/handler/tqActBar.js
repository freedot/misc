/*******************************************************************************/
ActBar = Class.extern(function(){
	var C_ICON_W = 68;
	var C_SPACE = 5;
	this.init = function(g, actList){
		this.g_ = g;
		this.actList_ = actList;
		this.actObjs_ = [];
		this._regActObjs();
		this._setItems();
		this._setListWidth();
	};
	
	this.showChange = function(){
		this._setListWidth();
	};
	
	this._regActObjs = function() {
		this.actObjs_.push(ActOnlineTask.snew(this.g_, this));
		this.actObjs_.push(ActYDTask.snew(this.g_, this));
		this.actObjs_.push(ActBDTask.snew(this.g_, this));
		this.actObjs_.push(Act3366Task.snew(this.g_, this));
		this.actObjs_.push(ActFirstPayTask.snew(this.g_, this));		
		this.actObjs_.push(PayActTask.snew(this.g_, this));		
	};
	
	this._setItems = function(){
		this.actList_.setItemCount(this.actObjs_.length);
		for ( var i=0; i<this.actList_.getCount(); ++i ) {
			var item = this.actList_.getItem(i);
			var obj = this.actObjs_[i];
			obj.set(item);
		}
	};
	
	this._setListWidth = function(){
		var cnt = this._getShowCnt();
		var w = (cnt*C_ICON_W + C_SPACE);
		TQ.setDomWidth(this.actList_.getParent(), w);
	};	
	
	this._getShowCnt = function(){
		var cnt = 0;
		for ( var i=0; i<this.actObjs_.length; ++i ) {
			var obj = this.actObjs_[i];
			if ( obj.isShow() ) {
				cnt++;
			}
		}		
		return cnt;
	};
});

ActBarBaseTask = Class.extern(function(){
	this.set = function(item){
		this.item_ = item;
		this.item_.exsubs.btn.setCaller({self:this, caller:this._onClickGet});
		TTIP.setCallerData(this.item_.exsubs.tooltips['$item'], {self:this, caller:this._onGetTooltip}, {});
		TQ.fixIE6Png(this.item_.label_bak);
		this._update();
	};
});

ActOnlineTask = ActBarBaseTask.extern(function(){
	this.g_ = null;
	this.item_ = null;
	this.isShow_ = true;
	this.observer_ = null;
	this.lastState_ = -1;
	this.init = function(g, observer){
		this.g_ = g;
		this.observer_ = observer;
		this.g_.regUpdater(this, this._onUpdate, 1000);
		this.g_.regEvent(EVT.NET, NETCMD.TASK, this, this._onSvrTask);
		this.g_.regEvent(EVT.LOGIN_OK, 0, this, this._onLoginOk);
	};
	
	this.isShow = function(){
		return this.isShow_;
	};
	
	this._update = function(){
		var onlineTask = this.g_.getImgr().getOnlineTask();
		var isShow = onlineTask.id > 0;
		TQ.setCSS(this.item_.item, 'display', isShow ? 'block' : 'none' );
		if (isShow != this.isShow_) {
			this.isShow_ = isShow;
			this.observer_.showChange();
		}

		if (!this.isShow_) {
			return;
		}
		
		var state = 0;
		var leftTime = onlineTask.stopTime - this.g_.getSvrTimeS();
		if (leftTime > 0) {
			TQ.setTextEx(this.item_.exsubs.label, TQ.format(rstr.task.onlineTask.leftTime, TQ.formatTime(0, leftTime)));
			IMG.setBKImage(this.item_.exsubs.icon, IMG.makeImg('actbar/onlinetask/commicon.png'));
			this.item_.exsubs.btn.enable(false);
			state = 0;
		} else {
			TQ.setTextEx(this.item_.exsubs.label, rstr.task.onlineTask.canGet);
			IMG.setBKImage(this.item_.exsubs.icon, IMG.makeImg('actbar/onlinetask/openicon.png'));
			this.item_.exsubs.btn.enable(true);
			state = 1;
		}
		
		if (this.lastState_ != state ) {
			this.lastState_ = state;
			TQ.fixIE6Png(this.item_.exsubs.icon);
		}
	};
	
	this._onUpdate = function(){
		this._update();
	};
	
	this._onClickGet = function(){
		TaskSender.sendGetOnlineTaskReward(this.g_);
	};
	
	this._onSvrTask = function(netevent){
		if ( netevent.data.onlinetask ) {
			TQ.dictCopy ( this.g_.getImgr().getOnlineTask(), netevent.data.onlinetask );
			this._update();
		}
	};
	
	this._onLoginOk = function(){
		TaskSender.sendGetOnlineTaskInfo(this.g_);
	};
	
	this._onGetTooltip = function(data){
		return rstr.task.onlineTask.tip;
	};
});

ActYDTask = ActBarBaseTask.extern(function(){
	this.isShow = function(){
		return g_platform == 'qzone';
	};
	
	this._update = function(){
		if ( !this.isShow() ) {
			TQ.setCSS(this.item_.item, 'display', 'none' );
		} else {
			TQ.setCSS(this.item_.exsubs.label_bak, 'display', 'none' );
			IMG.setBKImage(this.item_.exsubs.icon, IMG.makeImg('actbar/yd/bk.png'));
			TQ.fixIE6Png(this.item_.exsubs.icon);
		}
	};
	
	this._onClickGet = function(){
		UIM.openDlg('yellowdiamond');
	};

	this._onGetTooltip = function(data){
		return rstr.yellowdiamondDlg.tip.seeyd;
	};	
});

ActBDTask = ActBarBaseTask.extern(function(){
	this.init = function(g){
		this.g_ = g;
		this.g_.regEvent(EVT.ROLEBASE, 4, this, this._onDiamondInfo);
	};
	
	this.isShow = function(){
		return g_platform == '3366';
	};
	
	this._update = function(){
		if ( !this.isShow() ) {
			TQ.setCSS(this.item_.item, 'display', 'none' );
		} else {
			TQ.setCSS(this.item_.exsubs.label_bak, 'display', 'none' );
			if ( this._hasGift() ) {
				IMG.setBKImage(this.item_.exsubs.icon, IMG.makeImg('actbar/bd/bk.png'));
			} else {
				IMG.setBKImage(this.item_.exsubs.icon, IMG.makeImg('actbar/bd/bk_open.png'));
			}
			TQ.fixIE6Png(this.item_.exsubs.icon);
		}
	};
	
	this._onClickGet = function(){
		UIM.openDlg('bluediamond');
	};

	this._onGetTooltip = function(data){
		return rstr.bluediamondDlg.tip.seebd;
	};

	this._hasGift = function(){
		var bdInfo = this.g_.getImgr().getRoleRes().bdInfo;
		if (this._getXDLevel(bdInfo) == 0) {
			return true;
		}
		
		return this._hasHighGift(bdInfo)
			|| this._hasNewGift(bdInfo)
			|| this._hasCommGift(bdInfo)
			|| this._hasYearGift(bdInfo)
			|| this._hasLvlGift(bdInfo);
	};
	
	this._onDiamondInfo = function(){
		this._update();
	};
	
	this._hasHighGift = function(bdInfo){
		return !TQ.isSameDay(bdInfo.got_highgift, this.g_.getSvrTimeS());
	};
	
	this._hasNewGift = function(bdInfo){
		return bdInfo.got_newgift ? false : true;
	};
	
	this._hasCommGift = function(bdInfo){
		return !TQ.isSameDay(bdInfo.got_commgift, this.g_.getSvrTimeS());
	};
	
	this._hasYearGift = function(bdInfo){
		return !TQ.isSameDay(bdInfo.got_yeargift, this.g_.getSvrTimeS());
	};
	
	this._hasLvlGift = function(bdInfo){
		var roleLevel = this.g_.getImgr().getRoleRes().level;
		var xdLevel = this._getXDLevel(bdInfo);
		for ( var i=0; i<res_bd_lvlgifts.length; ++i ) {
			var res = res_bd_lvlgifts[i];
			if (res.level > roleLevel) continue;
			if (res.bdlvl > xdLevel) continue;
			if (!bdInfo.got_lvlgifts) continue;
			if (TQ.find(bdInfo.got_lvlgifts, null, res.id) == null ) return true;
		}
		
		return !bdInfo.got_lvlgifts || bdInfo.got_lvlgifts.length == 0;
	};
	
	this._getXDLevel = function(bdInfo){
		return bdInfo.blue_vip_level ? bdInfo.blue_vip_level : 0;
	};
});

Act3366Task = ActBarBaseTask.extern(function(){
	this.init = function(g){
		this.g_ = g;
	};
	
	this.isShow = function(){
		return g_platform == '3366';
	};
	
	this._update = function(){
		if ( !this.isShow() ) {
			TQ.setCSS(this.item_.item, 'display', 'none' );
		} else {
			TQ.setCSS(this.item_.exsubs.label_bak, 'display', 'none' );
			IMG.setBKImage(this.item_.exsubs.icon, IMG.makeImg('actbar/3366/bk.png'));
			TQ.fixIE6Png(this.item_.exsubs.icon);
		}
	};
	
	this._onClickGet = function(){
		UIM.openDlg('blue3366diamond');
	};

	this._onGetTooltip = function(data){
		return TQ.format(rstr.bluediamondDlg.tip.see3366, this.g_.getImgr().get3366GrowLevel());
	};	
});

ActFirstPayTask = ActBarBaseTask.extern(function(){
	this.isShow_ = true;
	this.g_ = null;
	this.init = function(g, observer){
		this.g_ = g;
		this.observer_ = observer;
		this.g_.regEvent(EVT.TASKCHANGE, 0, this, this._onTaskChange);
		this.isShow_ = true;
	};
	
	this.isShow = function(){
		return this.isShow_;
	};
	
	this._update = function(){
		var isShow = !this._firstPayTaskFinished();
		if ( this.isShow_ != isShow ) {
			this.isShow_ = isShow;
			this.observer_.showChange();
		}
		TQ.setCSS(this.item_.item, 'display', this.isShow_ ? 'block' : 'none' );
		if ( !this.isShow_ ) {
			return;
		}
		
		TQ.setCSS(this.item_.exsubs.label_bak, 'display', 'none' );
		IMG.setBKImage(this.item_.exsubs.icon, IMG.makeImg('actbar/firstpay/bk.png'));
		TQ.fixIE6Png(this.item_.exsubs.icon);
	};
	
	this._onClickGet = function(){
		var task = TQ.find(this.g_.getImgr().getTask().actives, 'id', FIXID.FIRST_PAYGOLD);
		UIM.getDlg('task').openDlg();
		UIM.getDlg('task').selectTask('activity', TQ.getLastFindIdx());
	};
	
	this._onGetTooltip = function(data){
		return rstr.buyGoldDlg.tip.firstpay_libao;
	};	
	
	this._onTaskChange = function(){
		this._update();
	};
	
	this._firstPayTaskFinished = function(){
		var task = TQ.find(this.g_.getImgr().getTask().actives, 'id', FIXID.FIRST_PAYGOLD);
		if (!task) return true;
		return task.state == TASK_STATE.COMPLETE;
	};
});

PayActTask = ActBarBaseTask.extern(function(){
	this.isShow_ = true;
	this.g_ = null;
	this.init = function(g, observer){
		this.g_ = g;
		this.observer_ = observer;
		this.g_.regEvent(EVT.PAYACT, 0, this, this._onPayAct);
		this.isShow_ = true;
	};
	
	this.isShow = function(){
		return this.isShow_;
	};
	
	this._update = function(){
		var isShow = this._isInActTime();
		if ( this.isShow_ != isShow ) {
			this.isShow_ = isShow;
			this.observer_.showChange();
		}
		TQ.setCSS(this.item_.item, 'display', this.isShow_ ? 'block' : 'none' );
		if ( !this.isShow_ ) {
			return;
		}
		
		TQ.setCSS(this.item_.exsubs.label_bak, 'display', 'none' );
		IMG.setBKImage(this.item_.exsubs.icon, IMG.makeImg('actbar/payact/bk.png'));
		TQ.fixIE6Png(this.item_.exsubs.icon);
	};
	
	this._onClickGet = function(){
		UIM.openDlg('payact');
	};
	
	this._onGetTooltip = function(data){
		return rstr.payActDlg.tip.payact_libao;
	};	
	
	this._onPayAct = function(){
		this._update();
	};
	
	this._isInActTime = function(){
		return this.g_.getImgr().getPayAct().payActTime.start > 0;
	};
});