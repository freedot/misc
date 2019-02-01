/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
/** 消息框返回值 */
MB_IDCLOSE = 1;
MB_IDOK = 2;
MB_IDCANCEL = 3;
MB_IDYES = 4;
MB_IDNO = 5;
/** 消息框按钮类型值 */
MB_F_CLOSE = 1;
MB_F_OKCANCEL = 2;
MB_F_YESNO = 3;
MB_F_NOBTNS = 4;

/** 消息对话框 */
MessageBox = function(){
	//-----------
	//private:const
	//-----------
	var C_NEWLINE = '<BR/>';
	
	//-----------
	//private:data
	//-----------
	var m_g;
	var m_this;
	var m_dlg;
	var m_caller;
	var m_msg;
	
	//------------
	//public:method
	//------------
	/** 初始化 */
	this.initialize = function(g){
		m_g = g;
		m_this = this;
		_initDlg();
	};
	
	/** 显示消息框 */
	this.show = function(title, msg, flag, caller, btnTxts){
		m_caller = caller;
		m_msg= HyperLinkMgr.formatLink(msg);
		m_dlg.show();
		m_dlg.setContent(C_NEWLINE+m_msg+C_NEWLINE+C_NEWLINE);
		m_dlg.setTitle(title);
		var btns = m_dlg.getBtns();
		var showBtns = [];
		for ( var i=0; i<btns.length; ++i ){
			var btn = btns[i];
			var isshow = false;
			if ( flag == MB_F_CLOSE && btn.getId() == MB_IDCLOSE ){
				btn.show();
				isshow = true;
			}
			else if ( flag == MB_F_OKCANCEL && ( btn.getId() == MB_IDOK || btn.getId() == MB_IDCANCEL ) ){
				btn.show();
				isshow = true;
			}
			else if ( flag == MB_F_YESNO && ( btn.getId() == MB_IDYES ||  btn.getId() == MB_IDNO ) ){
				btn.show();
				isshow = true;
			}
			
			if ( !isshow ){
				btn.hide();
			} else {
				showBtns.push(btn);
			}
		}
		
		if (btnTxts) {
			for ( var i=0; i<btnTxts.length && i<showBtns.length; ++i ) {
				showBtns[i].setText( btnTxts[i] );
			}
		}
		m_dlg.refresh();
	};
	
	this.click = function(id) {
		_onClickBtn(id);
	};
	
	this.isShow = function() {
		return m_dlg && m_dlg.isShow();
	};
	
	this.hide = function(){
		if ( !m_dlg ) return ;
		m_dlg.hide();
	};
	
	this.getMsg = function(){
		return m_msg;
	};
	
	//--------------
	// private:method
	//--------------
	var _initDlg = function(){
		m_dlg = Dialog.snew(m_g,{width:350,modal:true,zIndex:UI_ZORDER_MSGDLG,title:rstr.msgbox.title,pos:{x:"center", y:70+90},
			btns:[{btn:{id:MB_IDCLOSE,text:rstr.msgbox.btn.close},caller:{self:m_this,caller:_onClickBtn}},
				{btn:{id:MB_IDOK,text:rstr.msgbox.btn.confirm},caller:{self:m_this,caller:_onClickBtn}},
				{btn:{id:MB_IDCANCEL,text:rstr.msgbox.btn.cancel},caller:{self:m_this,caller:_onClickBtn}},
				{btn:{id:MB_IDYES,text:rstr.msgbox.btn.yes},caller:{self:m_this,caller:_onClickBtn}},
				{btn:{id:MB_IDNO,text:rstr.msgbox.btn.no},caller:{self:m_this,caller:_onClickBtn}}]
			});
		TQ.appendClass(m_dlg.getConDom(), 'ui-messagebox');
		m_dlg.hide();
	};
	
	var _onClickBtn = function(id){
		m_dlg.hide();
		if ( m_caller ){
			m_caller.caller.call(m_caller.self, id);
		}
	};
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

NoButtonTitleMessageBox = function(){
	var C_NEWLINE = '<BR/>';
	
	var m_g;
	var m_this;
	var m_dlg;
	var m_msg;
	
	this.initialize = function(g){
		m_g = g;
		m_this = this;
		_initDlg();
	};
	
	this.show = function(msg){
		m_msg= HyperLinkMgr.formatLink(msg);
		m_dlg.show();
		m_dlg.setContent(C_NEWLINE+m_msg+C_NEWLINE+C_NEWLINE);
		m_dlg.refresh();
	};
	
	this.click = function(id) {
		_onClickBtn(id);
	};
	
	this.isShow = function() {
		return m_dlg && m_dlg.isShow();
	};
	
	this.hide = function(){
		if ( !m_dlg ) return ;
		m_dlg.hide();
	};
	
	this.getMsg = function(){
		return m_msg;
	};
	
	var _initDlg = function(){
		m_dlg = Dialog.snew(m_g,{width:350,modal:true,uiback:uiback.dlg.npc,zIndex:UI_ZORDER_MSGDLG,pos:{x:"center", y:250}});
		TQ.appendClass(m_dlg.getConDom(), 'ui-messagebox');
		m_dlg.hide();
	};
	
	this.initialize.apply(this, arguments);
};