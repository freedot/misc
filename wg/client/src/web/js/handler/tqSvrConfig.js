SvrConfigHandler = JClass.ex({
	init : function(g){
		this.g_ = g;
		this.g_.regEvent(EVT.NET, NETCMD.SVRCFG, this, this._onSvrConfig);
	}
	
	,_onSvrConfig : function(netevent){
		var netdata = netevent.data;
		if ( netdata.honorcfg ) {
			TQ.dictCopy(this.g_.getImgr().getSvrCfg().honorcfg, netdata.honorcfg);
		}
	}
});

