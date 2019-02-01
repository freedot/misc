/*******************************************************************************/
MiniChatPanel = JClass.ex({
	init : function(g, dom) {
		this._g = g;
		this._dom = dom;
		this._items = {};
		var gui = this._g.getGUI();
		gui.initPanel(this._dom, uicfg.mb_chatpanel, this._items);
		var uibackres = uiback.dlg.chatpanel;
		this._panelback = gui.createPanelUIBack(this._dom, uibackres);
		var w = TQ.getDomWidth(this._dom);
		var h = TQ.getDomHeight(this._dom);
		gui.setUIBack(this._panelback, w, h, uibackres.type);
		TQ.addEvent(this._items.con, 'click', function(){
			UIM.getDlg('chatpanel').openDlg();
		});
	}
	
	,getSize : function(){
		return {cx:266, cy:75};
	}
	
	,setPosition : function(x, y){
		TQ.setDomPos(this._dom, x, y);
	}
	
	,appendMsgToCurChannel : function(msg){
	}
	
	,sendMessageToCurChannel : function(msg){
	}
	
	,setChatTarget : function(name){
	}
	
	,insertMsg : function(msg){
	}
});
