/*******************************************************************************/
FaceUtil = Class.extern(function(){
	this.facetips = ['#愤怒','#生气','#汗','#耍宝','#大笑'
		,'#得瑟','#捏脸','#晕','#吐','#害羞'
		,'#惊讶','#偷笑','#亲亲','#无辜','#委屈'
		,'#酷','#坏笑','#鼓掌','#抠鼻','#抓狂'
		,'#享受','#哭','#喜欢','#鄙视','#阴险'];
		
	var C_DIRIDXLEN = 2;
	this.init = function(g){
		this.g = g;
	};
	
	this.getFaceCount = function(){
		return this.facetips.length;
	};
	
	this.getFaceTip = function(idx){
		return this.facetips[idx];
	};
	
	this.faceFormat = function(msg){
		var mode = IMG.getMode();
		for ( var i=0, n=this.facetips.length; i<n; ++i ) {
			var idx = i+1;
			var szimg = '<img width=35 height=35 align="middle" src="' + IMG.makeImg('chat/face/01/'+TQ.formatNumber(i+1,C_DIRIDXLEN)+'.gif') + '"/>';
			msg = msg.replace(new RegExp(this.facetips[i],"g"), szimg);
		}
		return msg;	
	};
});

FacePanel = Class.extern(function(){
	//FacePanel-unittest-start
	var m_g;
	var m_this;
	var m_panel;
	var m_caller;
	var m_items={};
	var m_uibackres = uiback.dlg.minihelp;
	var m_faceUtil = null;

	//------------
	//public:method
	//------------
	this.init = function(g){
		m_g = g;
		m_this = this;
		m_faceUtil = FaceUtil.snew(m_g);
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};
	
	this.show = function(pos){
		_initPanel();
		m_panel.show(pos);
		var item = m_items.list.getItem(6);
		var p = item.exsubs.face;
	};
	
	this.getSize = function(){
		_initPanel();
		return {cx:m_panel.getWidth(), cy:m_panel.getHeight()};
	};

	var _initPanel = function(){
		if ( !m_panel ){
			m_panel = new PopPanel(m_g, {});
			var panel = m_panel.getDom();
			var gui = m_g.getGUI();
			gui.initPanel(panel, uicfg.facepanel, m_items);
			m_panelback = gui.createPanelUIBack(panel, m_uibackres);
			var w = TQ.getDomWidth(panel);
			var h = TQ.getDomHeight(panel);
			gui.setUIBack(m_panelback, w, h, m_uibackres.type);
			m_items.list.setItemCount(m_faceUtil.getFaceCount());
			for ( var i=0, n=m_items.list.getCount(); i<n; ++i ){
				var item = m_items.list.getItem(i);
				_setAnimFace(i);
				var tipid = m_items.list.getSubItem(item,'tooltips')['$item'];
				var tip = TTIP.getTipById(tipid);
				tip.setCaller({self:m_this,caller:_onGetTooltip});
				tip.setData({idx:i});
			}
			m_items.list.setCaller({self:m_this, caller:_onSelectFaceItem});
			m_panel.hide();
		}
	};
	
	var _onSelectFaceItem = function(e, idx){
		m_panel.hide();
		if ( m_caller ){
			m_caller.caller.call(m_caller.self, {face:m_faceUtil.getFaceTip(idx)});
		}
	};
	
	var _onGetTooltip = function(data){
		return m_faceUtil.getFaceTip(data.idx);
	};
	
	var _setAnimFace = function(idx){
		var item = m_items.list.getItem(idx);
		IMG.setBKImage(item.exsubs.face, IMG.makeFaceImg(1, 1, idx+1));
	};
	//FacePanel-unittest-end
});

FacePanelBtn = Class.extern(function(){
	var m_g;
	var m_this;
	var m_btn;
	var m_panel;
	var m_caller;

	this.init = function(g, dom, ops){
		m_g = g;
		m_this = this;
		_init(dom, ops);
	};
	
	this.setCaller = function(caller){
		m_caller = caller;
	};

	var _init = function(dom, ops){
		if ( !ops ){
			ops = {};
		}
		if ( !ops.uiback ){
			if ( TQ.isMobile() ) {
				ops.uiback = uiback.mb.facebtn;
			} else {
				ops.uiback = uiback.btn.face;
			}
		}
		m_btn = new ComButton(m_g, dom, ops);
		m_btn.setCaller({self:m_this, caller:_onClickBtn});
		m_panel = FacePanel.snew(m_g);
		m_panel.setCaller({self:m_this, caller:_onInsertFace});
	};
	
	var _onClickBtn = function(){
		m_g.getGUI().showBtnPanel(0, m_btn.getDom(), m_panel);
	};
	
	var _onInsertFace = function(data){
		if ( m_caller ){
			m_caller.caller.call(m_caller.self, data);
		}
	};
});
