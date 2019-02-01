rstr_loading = {
	loadjs:'加载资源中…'
	,loadimage:'加载资源中2…'
	,connect:'正在连接服务器，请稍后…'
	,connectok:'连接成功，拉取游戏数据…'
	,loginok:'登录成功，初始化数据…'
	,connectfailed:'连接服务器失败，请稍后再试，或留意官方信息！'
	,deconn:'你已和服务器断开连接！请重新 <a class="start_link" href="#" onclick="javascript:refresh_page(); return false;">登录游戏</a>'
	,fullroles:'当前服务器<b>已爆满</b>！请 <a class="start_link" href="#" onclick="javascript:refresh_page(); return false;">登录游戏</a> 选择其它服务器'
	,reconnecting:'网络连接丢失，尝试重连中...'
	,reconnectedok : ' 　　　<font color=#30ff30>重接成功！</font>'
};

LoadingFace = JClass.ex({
	_init : function(url, port, proxy, sig){
		this._url = url;
		this._port = port;		
		this._proxy = proxy;		
		this._sig = sig;
		
		this._isShow = true;
		
		var ua = navigator.userAgent.toLowerCase();
		this._isMobile = true;//ua.indexOf('mobile') !== -1 || ua.indexOf('android') !== -1;
		
		this._loadingPanelBak = null;
		this._loadingPanel = null;
		this._loadingTip = null;
		this._loadingProgBar = null;
		this._progBarInfo = {left:14, right:0, width:561};
		
		this._jsLoader = JsLoader.snew();
		this._jsLoader.setCaller(Caller.snew(this, this._onLoadJs));
		
		this._imageLoader = ImageLoader.snew();
		this._imageLoader.setCaller(Caller.snew(this, this._onLoadImage));
		
		this._timer = window.setInterval(this._onCheckLoadTimer(), 5);
	}
	
	,setTipText : function(tip){
		if ( this._loadingTip ) {
			this._loadingTip.innerHTML = tip;
		}
	}
	
	,setPercent : function(per){
		if (!this._loadingProgBar) {
			return;
		}
		
		var barw = this._progBarInfo.left + Math.floor(this._progBarInfo.width*per);
		this._loadingProgBar.style.width = barw + 'px';
	}
	
	,isShow : function(){
		return this._isShow;
	}
	
	,hide : function(){
		this._isShow = false;
		if ( this._loadingPanel ) {
			this._loadingPanelBak.style.display = 'none';
			this._loadingPanel.style.display = 'none';
		}
	}
	
	,getJsLoader : function(){
		return this._jsLoader;
	}
	
	,getImageLoader : function(){
		return this._imageLoader;
	}
	
	,isMobile : function() {
		return this._isMobile;
	}
	
	,_onCheckLoadTimer : function(){
		var this_l = this;
		return function(){
			if (!this_l._initDivs()) {
				return;
			}
			
			window.clearInterval(this_l._timer);
			this_l._timer = null;
			this_l._loadJss();
		};
	}
	
	,_loadJss : function(){
		this.setTipText(rstr_loading.loadjs);
		this._preHandleScriptLists(g_scriptlists);
		this._jsLoader.load( g_scriptlists );
	}
	
	,_preHandleScriptLists : function(lists){
		for ( var i=0; i<lists.length; i++ ) {
			if ( this.isMobile() && lists[i].indexOf('res_newui_cls') >= 0 ) {
				lists.splice(i, 1);
				break;
			} else if ( !this.isMobile() && lists[i].indexOf('res_newui_mb_cls') >= 0 ) {
				lists.splice(i, 1);
				break;
			}
		}
	}
	
	,_onLoadJs : function(){
		var cur = this._jsLoader.getPercent()*60;
		this.setPercent(cur/100);
		
		if ( this._jsLoader.isCompleted() ) {
			this._loadImages();
		}
	}
	
	,_loadImages : function(){
		this.setTipText(rstr_loading.loadimage);
		this._imageLoader.load( g_preImgSrcs );
	}
	
	,_onLoadImage : function(succ){
		var cur = 60 + this._imageLoader.getPercent()*(95-60);
		this.setPercent(cur/100);
		
		if ( this._imageLoader.isCompleted() ) {
			this._startInitGame();
		}
	}
	
	,_startInitGame : function(){
		log('start init game ... ');
		this.setTipText(rstr_loading.connect);
		this._timer = window.setInterval(this._initGame(), 1000);
	}
	
	,_initGame : function(){
		var this_l = this;
		return function(){
			try{
				log('init game');
				initGame(this_l._url, this_l._port, this_l._proxy, this_l._sig);
				log('init game ok');
				window.clearInterval(this_l._timer);
				this_l._timer = null;
			} catch (e) {
				log('init game failed');
				if ( e.description ) log(e.description);
				if ( e.name ) log(e.name);
				if ( e.message ) log(e.message);
			}
		};
	}
	
	,_initDivs : function(){
		if (this._loadingPanel) return true;
		
		this._loadingPanelBak = document.getElementById('g_loading_div_bak');
		this._loadingPanel = document.getElementById('g_loading_div');
		this._loadingTip = document.getElementById('g_loading_tip_div');
		this._loadingProgBar = document.getElementById('g_loading_progress_bar_div');
		return this._loadingPanel ? true : false;
	}
});
