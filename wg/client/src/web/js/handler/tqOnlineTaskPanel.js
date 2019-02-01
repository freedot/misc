/*******************************************************************************/
OnlineTaskPanel = Class.extern(function(){
	this.g_ = null;
	this.items_ = null;
	this.state_ = -1;
	this.init = function(g, items){
		this.g_ = g;
		this.items_ = items;
		this.g_.regUpdater(this, this._onUpdate, 1000);
		this.g_.regEvent(EVT.NET, NETCMD.TASK, this, this._onSvrTask);
		this.g_.regEvent(EVT.LOGIN_OK, 0, this, this._onLoginOk);
		this.items_.onlineTask_get.setCaller({self:this, caller:this._onClickGet});
		this._update();
	};
	
	this._update = function(){
		var onlineTask = this.g_.getImgr().getOnlineTask();
		var hasTask = onlineTask.id > 0;
		TQ.setCSS(this.items_.onlineTask_panel, 'display', hasTask ? 'block' : 'none' );
		if (!hasTask) return;
		
		var leftTime = onlineTask.stopTime - this.g_.getSvrTimeS();
		if (leftTime > 0) {
			TQ.setTextEx(this.items_.onlineTask_leftTime, TQ.format(rstr.task.onlineTask.leftTime, TQ.formatTime(0, leftTime)));
			IMG.setBKImage(this.items_.onlineTask_icon, IMG.makeImg('actbar/onlinetask/commicon.png'));
			this.items_.onlineTask_get.enable(false);
		} else {
			TQ.setTextEx(this.items_.onlineTask_leftTime, rstr.task.onlineTask.canGet);
			IMG.setBKImage(this.items_.onlineTask_icon, IMG.makeImg('actbar/onlinetask/openicon.png'));
			this.items_.onlineTask_get.enable(true);
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
});
