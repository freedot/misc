/*******************************************************************************/
BaseDlg = Class.extern(function(){
	this.g_ = null;
	this.imgr_ = null;
	this.dlg_ = null;
	this.items_ = {};
	this.params_ = null;
	this.dlgName_ = '';
	this.openListener_ = null;
	
	this.init = function(g, dlgName, openListener){
		this.g_ = g;
		this.dlgName_ = dlgName ? dlgName : '';
		this.openListener_ = openListener ? openListener : NullCaller;
		this.imgr_ = this.g_.getImgr();
		this._init();
	};
	
	this.openDlg = function(params){
		this._initParams(params);
		if (!this._isCanOpen()) return;
		this._initDlg();
		this._showDlg();
		this._initInfo();
		this.openListener_.invoke(this.dlgName_);
	};
	
	this.hideDlg = function(){
		if ( this.dlg_ ) {
			this.dlg_.hide();
		}
	};
	
	this.isShow = function(){
		if (!this.dlg_) return false;
		return this.dlg_.isShow();
	};
	
	this._initParams = function(params){
		this.params_ = params;
	};
	
	this._initDlg = function(){
		if (this.dlg_) return;
		this._createDlg();
		this._afterCreate();		
		this._setCallers();
	};
	
	this._createDlg = function(){
		var dlgCfg = this._getDlgCfg();
		dlgCfg.uiback = dlgCfg.uiback ? dlgCfg.uiback : null;
		
		this.dlg_ = Dialog.snew(this.g_,{
				modal : dlgCfg.modal,
				title : dlgCfg.title,
				uiback : dlgCfg.uiback,
				btns: dlgCfg.btns,
				pos : dlgCfg.pos });
		this.g_.getGUI().initDlg(this.dlg_, dlgCfg.uicfg, this.items_);
	};
	
	this._showDlg = function(){
		this.dlg_.show();
	};	
	
	/* for test */
	this.getItems = function(){return this.items_;};
	this.getParams = function(){return this.params_;};
	this.getCoreDlg = function(){return this.dlg_;};
	
	/* for sub class */
	this._init = function(){/*need implement by sub class*/}; 
	this._isCanOpen = function(){return true;};
	this._getDlgCfg = function(){/*need implement by sub class*/}; 
	this._afterCreate = function(){/*need implement by sub class*/};	
	this._setCallers = function(){/*need implement by sub class*/};	
	this._initInfo = function(){/*need implement by sub class*/};
});


JBaseDlg = JClass.ex({
	_init : function(g, dlgName, openListener){
		this.g_ = g;
		this.dlgName_ = dlgName ? dlgName : '';
		this.openListener_ = openListener ? openListener : NullCaller;
		this.imgr_ = this.g_.getImgr();
		this.dlg_ = null;
		this.items_ = {};
		this.params_ = null;
		this._innerInit();
	}
	
	,openDlg : function(params){
		this._initParams(params);
		if (!this._isCanOpen()) return;
		this._initDlg();
		this._showDlg();
		this._initInfo();
		this.openListener_.invoke(this.dlgName_);
	}
	
	,hideDlg : function(){
		if ( this.dlg_ ) {
			this.dlg_.hide();
		}
	}
	
	,isShow : function(){
		if (!this.dlg_) return false;
		return this.dlg_.isShow();
	}
	
	,_initParams : function(params){
		this.params_ = params;
	}
	
	,_initDlg : function(){
		if (this.dlg_) return;
		this._createDlg();
		this._afterCreate();		
		this._setCallers();
	}
	
	,_createDlg : function(){
		var dlgCfg = this._getDlgCfg();
		dlgCfg.uiback = dlgCfg.uiback ? dlgCfg.uiback : null;
		
		if ( dlgCfg.uicfg.c_.a == 22 ) { /*is C_WINTYPE_DIALOG type*/
			dlgCfg.modal = (dlgCfg.uicfg.c_.modal == 1);
			if ( dlgCfg.uicfg.c_.title && dlgCfg.uicfg.c_.title != '' ) dlgCfg.title = dlgCfg.uicfg.c_.title;
			if ( dlgCfg.uicfg.c_.aj && dlgCfg.uicfg.c_.aj != '' ) dlgCfg.uiback = dlgCfg.uicfg.c_.aj;
			if ( dlgCfg.uicfg.c_.dlgpos && dlgCfg.uicfg.c_.dlgpos != '' ) {
				var poss = dlgCfg.uicfg.c_.dlgpos.split(',');
				var x;
				if ( poss[0] in ['center', 'left', 'right'] ) {
					x = poss[0];
				} else {
					x = parseInt(poss[0]);
				}
				var y;
				if ( poss[1] in ['top', 'vcenter', 'bottom'] ) {
					y = poss[1];
				} else {
					y = parseInt(poss[1]);
				}
				dlgCfg.pos = {x:x, y:y};
			}
		}

		this.dlg_ = Dialog.snew(this.g_,{
				modal : dlgCfg.modal,
				title : dlgCfg.title,
				uiback : dlgCfg.uiback,
				pos : dlgCfg.pos });
		this.g_.getGUI().initDlg(this.dlg_, dlgCfg.uicfg, this.items_);
	}
	
	,_showDlg : function(){
		this.dlg_.show();
	}	
	
	/* for test */
	,getItems : function(){return this.items_;}
	,getParams : function(){return this.params_;}
	,getCoreDlg : function(){return this.dlg_;}
	
	/* for sub class */
	,_innerInit : function(){/*need implement by sub class*/}
	,_isCanOpen : function(){return true;}
	,_getDlgCfg : function(){/*need implement by sub class*/}
	,_afterCreate : function(){/*need implement by sub class*/}	
	,_setCallers : function(){/*need implement by sub class*/}
	,_initInfo : function(){/*need implement by sub class*/}
});

/* 为兼容老版本的class方式创建的dlg
*/
ListenerBaseDlg = Class.extern(function(){
	this.dlgName_ = '';
	this.openListener_ = null;
	this.imgr_ = null;
	this.init = function(g, dlgName, openListener){
		this.g_ = g;
		this.dlgName_ = dlgName ? dlgName : '';
		this.openListener_ = openListener ? openListener : NullCaller;
		this.imgr_ = this.g_.getImgr();
		this._init(g);
	};	
	
	this._notifyOpenDlg = function(){
		this.openListener_.invoke(this.dlgName_);
	};
});

