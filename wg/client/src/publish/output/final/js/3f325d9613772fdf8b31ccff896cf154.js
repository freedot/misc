SvrConfigHandler=JClass.ex({init:function(a){this.g_=a,this.g_.regEvent(EVT.NET,NETCMD.SVRCFG,this,this._onSvrConfig)},_onSvrConfig:function(a){var b=a.data;b.honorcfg&&TQ.dictCopy(this.g_.getImgr().getSvrCfg().honorcfg,b.honorcfg)}})