/** 
	version: 0.1
	writer: bill825
	date: 2014.12.10
*/

var res_s = {
	confirmButton:'确认'
	,cancelButton:'取消'
	,closeButton:'关闭'
	,edit:'编辑'
	,undo:'撤销修改'
}

var VKEY = {
	ESC : 27
};

var Widget = JClass.ex({
	tip_line_bytes : 36
	
	,_init : function(){
		this._name = '';
		this._elem = null;
		this._duplicateElem = null;
		this._children = [];
		this._parent = null;
		this._templ = null;
		this._id = 0;
		this._show = true;
	}
	
	,create : function(parent, templ){
		this._templ = templ;
		this._name = templ.name
		this._elem = this._createInnerElem();
		JUtil.appendElem(parent.getElem(), this._elem);
		if ( templ.duplicate ) {
			this._duplicateElem = this._elem;
			this._elem = this._createInnerElem();
			JUtil.appendElem(this._duplicateElem, this._elem);
			
			JUtil.setClass(this._duplicateElem, templ.style);
			JUtil.setElemRelativePosition(this._duplicateElem);
			JUtil.setElemRect(this._duplicateElem, templ.rect);
			JUtil.setElemSize(this._duplicateElem, templ.size);
			JUtil.setElemPos(this._duplicateElem, templ.pos);
		}
		
		JUtil.setClass(this._elem, templ.style);
		JUtil.setElemRect(this._elem, templ.rect);
		JUtil.setElemSize(this._elem, templ.size);
		JUtil.setElemPos(this._elem, templ.pos);
		this._setText(this._elem, templ.text);
		this.setTip(templ.tip);
		if ( templ.hide ) this.hide();
		
		parent.appendChild(this);
		this._createEnd();
	}
	
	,createFinished : function(){
	}
	
	,getType : function(){
		return this._templ.type;
	}
	
	,setStyle : function(style){
		JUtil.setClass(this._elem, style);
	}
	
	,getStyle : function(){
		return JUtil.getClass(this._elem);
	}
	
	,setCaller : function(){
	}
	
	,setTip : function(tip){
		if ( !tip || tip == '' ) return;
		JUtil.setElemTip(this._elem, this._splitTipToLines(tip));
	}
	
	,getName : function(){
		return this._name;
	}
	
	,setId : function(id){
		this._id = id;
	}
	
	,getId : function(){
		return this._id;
	}
	
	,appendChild : function(child){
		child.setParent(this);
		this._children.push(child);
	}
	
	,insertBefore : function(newchild,refchild){
		for ( var i=0; i<this._children.length; ++i ) {
			if ( this._children[i] === refchild ){
				this._children.splice(i, 0, newchild);
				break;
			}
		}
	}
	
	,removeElem : function(child){
		for ( var i=0; i<this._children.length; ++i ) {
			if ( this._children[i] === child ){
				this._children.splice(i, 1);
				break;
			}
		}
	}
	
	,findWidget : function(spaths){
		var paths = spaths.split('.');
		if (!paths || paths.length == 0) {
			return null;
		}

		if (this.getName() != paths[0]) {
			return null;
		}
		
		if ( paths.length == 1 ) {
			return this;
		}
		
		return this._findChild(1, paths);
	}
	
	,getChildrenCount : function(){
		return this._children.length;
	}
	
	,getChild : function(index){
		return this._children[index];
	}
	
	,getParent : function(){
		return this._parent;
	}
	
	,setParent : function(parent){
		this._parent = parent;
	}
	
	,setElem : function(elem){
		this._elem = elem;
	}
	
	,getElem : function(){
		return this._elem;
	}
	
	,getDuplicateElem : function(){
		return this._duplicateElem;
	}
	
	,show : function(){
		this._show = true;
		JUtil.showElem(this._elem);
	}
	
	,hide : function(){
		this._show = false;
		JUtil.hideElem(this._elem);
	}
	
	,isShow : function(){
		return this._show;
	}
	
	,_findChild : function(pathpos, paths){
		if ( !paths || (paths.length - pathpos) == 0 ) {
			return null;
		}
		
		for ( var i=0; i<this._children.length; ++i ) {
			var child = this._children[i];
			if ( paths[pathpos] != child.getName() ) continue;
			
			if ( (paths.length - pathpos) == 1 ) {
				return child;
			}

			return child._findChild(++pathpos, paths);
		}
		
		return null;
	}
	
	,_createInnerElem : function(){
		return JUtil.createElem();
	}
	
	,_setText : function(elem, text){
		if ( JUtil.isNull(text) ) return;
		JUtil.setText(elem, text);
	}
	
	,_createEnd : function(){
	}
	
	,_splitTipToLines : function(tip){
		var newline = '\n';
		var splitPos = [];
		var lineBytes = 0;
		for ( var i=0; i<tip.length; ++i ) {
			var code = tip.charCodeAt(i);
			if ( code <= 255 ) lineBytes++;
			else lineBytes+=2;

			if ( lineBytes >= Widget.tip_line_bytes ) {
				splitPos.push(i+1);
				lineBytes = 0;
			}
		}
		splitPos.push(tip.length);
		
		var stip = '';
		var lastpos = 0;
		for ( var i=0; i<splitPos.length; ++i ) {
			var curpos = splitPos[i];
			var linestr = tip.substring(lastpos, curpos);
			if ( linestr == '' ) break;
			
			if ( stip != '' ) stip += newline;
			stip += linestr;
			lastpos = curpos;
		}
		return stip;
	}
});

var UiManager = JClass.ex({
	_init : function(){
		this._normalZOrderRange = {min:100000001,max:200000000};
		this._modalZOrderRange = {min:200000001,max:300000000};
		this._panelZOrderRange = {min:300000001,max:400000000};
		this._normalZOrder = this._normalZOrderRange.min;
		this._modalZOrder = this._modalZOrderRange.min;
		this._panelZOrder = this._panelZOrderRange.min;
		this._dlgs = [];
		this._mapDlgs = {};
		this._editLabelRegs = [];
			
		this._panels = [];
		this._mapPanels = {};
			
		this._addEvent();
	}
	
	,_addEvent : function() {
		var this_l = this;
		JUtil.addEvent(document, 'keydown', function(e){
			e = e ? e : window.event;
			this_l._closeDlgsByEscapeKey(e);
			return true;
		});
		JUtil.addEvent(document, 'mousedown', function(e){
			e = e ? e : window.event;
			this_l._hideNotBeClickedPanels(e);
			return true;
		});
		JUtil.addEvent(document, 'mousewheel', function(e){
			e = e ? e : window.event;
			this_l._hideAllPanels(e);
			return true;
		});
	}

	,regDlg : function(dlg){
		this.unregDlg(dlg);
		var zorder = 0;
		if ( dlg.isModal() ) {
			zorder = this._modalZOrder++;
		} else {
			zorder = this._normalZOrder++;
		}
		
		this._dlgs.push(dlg);
		this._mapDlgs[dlg] = this._dlgs.length - 1;
		return zorder;
	}
	
	,unregDlg : function(dlg){
		if ( JUtil.isNull(this._mapDlgs[dlg]) ) return;
		var index = this._mapDlgs[dlg];
		this._dlgs.splice(index, 1);
		this._mapDlgs[dlg] = null;
	}
	
	,regPanel : function(panel){
		this.unregPanel();
		
		var zorder = this._panelZOrder++;
		this._panels.push(panel);
		this._mapPanels[panel] = this._panels.length - 1;
		return zorder;
	}
	
	,unregPanel : function(panel){
		if ( JUtil.isNull(this._mapPanels[panel]) ) return;
		var index = this._mapPanels[panel];
		this._panels.splice(index, 1);
		this._mapPanels[panel] = null;
	}
	
	,regEditLabel : function(editLabel){
		this._editLabelRegs.push(editLabel);
	}
	
	,saveEditLabels : function(){
		for ( var i=0; i<this._editLabelRegs.length; ++i ) {
			this._editLabelRegs[i].endAndSaveEdit();
		}
		this._editLabelRegs = [];
	}
	
	,_closeDlgsByEscapeKey: function(e){
		var key = JUtil.getKeyCode(e);
		if ( key != VKEY.ESC ) return true;
		if ( this._dlgs.length == 0 ) return true;
		
		var dlg = this._dlgs[this._dlgs.length-1];
		if ( dlg.isCanEscape() ) {
			dlg.close();
		}
	}
	
	,_hideNotBeClickedPanels: function(e){
		if (this._panels.length == 0) return;
		var pos = JUtil.mouseCoords(e);
		for ( var i=this._panels.length-1; i>=0; --i ) {
			var panel = this._panels[i];
			var rect = JUtil.getElemRect(panel.getElem());
			if ( pos.x < rect.left || pos.x > (rect.left + rect.width)
				|| pos.y < rect.top || pos.y > (rect.top + rect.height) ) {
				panel.hide();
				this.unregPanel(panel);
			}
		}
	}
	
	,_hideAllPanels: function(){
		for ( var i=this._panels.length-1; i>=0; --i ) {
			var panel = this._panels[i];
			panel.hide();
			this.unregPanel(panel);
		}
	}
}).snew();

var Dialog = JClass.ex({
	_init : function(){
		this._templ = null;
		this._panel = null;
		this._modal = false;
		this._overLayer = null;
		this._lastMousePos = {x:0, y:0};
		this._lastDlgPos = {x:0, y:0};
		this._param = null;
		this._onInit();
	}
	
	,create : function(){
		this._onCreateBefore();
		this._templ = this._getTempl();
		this._modal = this._templ.modal ? this._templ.modal : false;
		if ( this._modal ) this._createOverLayer();
		this._panel = WidgetFactory.createItemByTempl(this._getParent(), this._templ);
		if ( this._templ.dragTitle ) this._appendDragEvent();
		this._hide();
		this._setCallers();
		this._onCreateAfter();
	}
	
	,isCanEscape : function(){
		return this._templ.escape ? true : false;
	}
	
	,_createOverLayer : function(){
		var templ = {type:'widget'
			,name: '_modalOverLayer_'
			,style:'modalOverLayer'
			,rect:{left:0, top:0, width:'100%', height:'100%'}};
		this._overLayer = WidgetFactory.createItemByTempl(this._getParent(), templ);
		JUtil.setElemOpacity(this._overLayer.getElem(), 50);
	}
	
	,_appendDragEvent : function(){
		JUtil.addEvent(this._panel.getElem(), 'dragstart', function(){return false;});
		JUtil.addEvent(this._panel.getElem(), 'selectstart', function(){return false;});
		JUtil.captureMouseEvent(this._panel.getElem()
			,{isCanCapture:JCaller.snew(this, this._isCanCapture)
			,mouseDown:JCaller.snew(this, this._onTitleMouseDown)
			,mouseMove:JCaller.snew(this, this._onTitleMouseMove)});
	}
	
	,_isCanCapture : function(e){
		var mpos = JUtil.mouseCoords(e);
		var dlgPos = this._getPosition();
		return (mpos.y - dlgPos.y) < this._templ.dragTitle;
	}
	
	,_onTitleMouseDown : function(e){
		this._upDlg();
		this._lastMousePos = JUtil.mouseCoords(e);
		this._lastDlgPos = this._getPosition();
	}
	
	,_onTitleMouseMove : function(e){
		var curMousePos = JUtil.mouseCoords(e);
		var offset = {x:(curMousePos.x - this._lastMousePos.x), y:(curMousePos.y - this._lastMousePos.y)};
		var dlgPos = {x:(this._lastDlgPos.x + offset.x), y:(this._lastDlgPos.y + offset.y)};
		this._setPosition(dlgPos);
	}
	
	,_upDlg : function(){
		this._show();
	}
	
	,_getPosition : function(){
		return JUtil.getElemPos(this._panel.getElem());
	}
	
	,_setPosition : function(dlgPos){
		JUtil.setElemPos(this._panel.getElem(), dlgPos);
	}
	
	,open : function(param){
		this._param = param;
		this._onOpenBefore();
		if ( !this._isCanOpen() ) return;
		
		this._show();
		
		this._onOpenAfter();
	}
	
	,close : function(){
		this._onCloseBefore();
		if ( !this._isCanClose() ) return;
		
		this._hide();
		UiManager.unregDlg(this);
		this._onCloseAfter();
	}
	
	,isModal : function(){
		return this._modal;
	}
	
	,_setItemCaller : function(itempath, callerType, caller){
		var widget = this._panel.findWidget(itempath);
		if ( widget ) {
			widget.setCaller(callerType, caller );
		}
	}
	
	,_show : function(){
		if ( this._overLayer ) {
			this._overLayer.show();
			JUtil.setZOrder(this._overLayer.getElem(), UiManager.regDlg(this));
		}
		
		this._panel.show();
		JUtil.setZOrder(this._panel.getElem(), UiManager.regDlg(this));
	}
	
	,_hide : function(){
		this._panel.hide();
		if ( this._overLayer ) this._overLayer.hide();
		UiManager.unregDlg(this);
	}
	
	,_getParent : function(){}
	,_getTempl : function(){}
	,_onCreateBefore : function(){}
	,_onCreateAfter : function(){}
	,_setCallers : function(){}
	,_isCanOpen : function(){ return true; }
	,_onInit : function(){}
	,_onOpenBefore : function(){}
	,_onOpenAfter : function(){}
	,_isCanClose : function(){ return true; }
	,_onCloseBefore : function(){}
	,_onCloseAfter : function(){}
});

var Label = Widget.ex({
	_init : function(){
		Widget._init.call(this);
		this._text = '';
	}

	,setText : function(text){
		this._text  = text;
		JUtil.setText(this._elem, this._text);
	}
	
	,getText : function(){
		return this._text;
	}
});

var RichLabel = Widget.ex({
	_init : function(){
		Widget._init.call(this);
		this._text = '';
	}

	,setText : function(text){
		this._text  = text;
		JUtil.setRichText(this._elem, this._text);
	}
	
	,getText : function(){
		return this._text;
	}
});

var EditLabel = Widget.ex({
	_init : function(){
		Widget._init.call(this);
		this._label = null;
		this._editBtn = null;
		this._input = null;
		this._undoBtn = null;
		this._text = '';
		this._isEditMode = false;
		this._callers = {};
		this._defaultText = '--';
		this._lastText = ''
	}
	
	,create : function(parent, templ){
		Widget.create.call(this, parent, this._createNewTempl(templ));
	}
	
	,setCaller : function(callerType, caller){ // 'LABEL_CHANGED', 'INPUT_QUERY', 'INPUT_AUTOCOMPLETE'
		this._callers[callerType] = caller;
	}
	
	,createFinished: function(){
		this._label = this.findWidget(this.getName() + '.label');
		this._editBtn = this.findWidget(this.getName() + '.editBtn');
		this._input = this.findWidget(this.getName() + '.input');
		this._undoBtn = this.findWidget(this.getName() + '.undoBtn');
		
		JUtil.setElemMaxWidth(this._label.getElem(),  this._templ.rect.width - JUtil.getElemRect(this._editBtn.getElem()).width );
		var inputW = this._templ.rect.width - JUtil.getElemRect(this._undoBtn.getElem()).width;
		JUtil.setElemWidth(this._input.getElem(),  inputW );
		JUtil.setElemLeft(this._undoBtn.getElem(),  inputW );
		
		this._addQueryPanelEvents();
		
		this._editBtn.hide();
		this._input.hide();
		this._undoBtn.hide();
		
		this._setCallers();
	}
	
	,getQueryDataList : function(){
		var caller = this._callers['INPUT_QUERY'];
		if ( !caller ) return [];
		return caller.invoke(this, this._input.getText());
	}
	
	,autoComplete : function(selectText){
		this.beginEdit();
		var caller = this._callers['INPUT_AUTOCOMPLETE'];
		if ( !caller ) return false;
		return caller.invoke(this, this._input.getText(), selectText);
	}
	
	,endAndSaveEdit : function(){
		if ( !this._isEditMode ) return;
		this._endEdit();
		this.setText(this._input.getText());
		var caller = this._callers['LABEL_CHANGED'];
		if ( caller ) caller.invoke(this);
	}
	
	,_addQueryPanelEvents : function(){
		if ( this._templ.querypanel ) {
			var this_l = this;
			JUtil.addEvent(this._input.getElem(),'focus',function(e){
				JUI.getInputQueryPanel().show(this_l);
			});
			JUtil.addEvent(this._input.getElem(),'mousedown',function(e){
				JUI.getInputQueryPanel().show(this_l);
				JUtil.stopPropagation(e);
			});
			JUtil.addEvent(this._input.getElem(),'keydown',function(e){
				JUtil.setTimer(1, JCaller.snew(this_l, function(){
					JUI.getInputQueryPanel().show(this_l);
				}));
			});
		}
	}
	
	,_setCallers : function(){
		var this_l = this;
		JUtil.addEvent(this.getElem(),'mouseover',function(e){
				this_l._mouseOver();
			});
		JUtil.addEvent(this.getElem(),'mouseout',function(e){
				this_l._mouseOut();
			});
		JUtil.addEvent(this._input.getElem(),'blur',function(e){
				JUtil.setTimer(1, JCaller.snew(this_l, this_l.endAndSaveEdit));
				return true;
			});
		JUtil.addEvent(this._input.getElem(),'focus',function(e){
			var caller = this_l._callers['INPUT_FOCUS'];
			if ( caller ) caller.invoke(this_l._input);
			return true;
		});		
		JUtil.addEvent(this._input.getElem(),'keydown',function(e){
				e = e ? e : window.event;
				if ( JUtil.getKeyCode(e) == VKEY.ESC ) {
					this_l._cancelEdit();
				}
				return true;
			});
		this._editBtn.setCaller('BTN_CLICK', JCaller.snew(this, this._beginEdit));
		this._undoBtn.setCaller('BTN_PUSH', JCaller.snew(this, this._cancelEdit));
	}
	
	,setText : function(text){
		this._text  = text;
		this._label.setText(this._text);
		this._label.setTip(this._text);
		this._input.setText(this._text);
	}
	
	,setDefaultText : function(text){
		this._defaultText = text;
	}
	
	,getText : function(){
		return this._text;
	}
	
	,beginEdit : function(){
		this._beginEdit();
	}
	
	,_createNewTempl : function(templ){
		if ( templ.items && templ.items.length > 1) {
			return templ;
		}
		
		templ.items = [];
		templ.items.push(this._getLabelTempl(templ));
		templ.items.push(this._getEditBtnTempl(templ));
		templ.items.push(this._getUndoBtnTempl(templ));
		templ.items.push(this._getInputTempl(templ));

		return templ;
	}
	
	,_mouseOver : function(){
		if ( this._isEditMode ) return;
		this._editBtn.show();
	}
	
	,_mouseOut : function(){
		if ( this._isEditMode ) return;
		this._editBtn.hide();
	}
	
	,_beginEdit : function(){
		this._isEditMode = true;
		this._lastText = this._label.getText();
		this._label.hide();
		this._editBtn.hide();
		this._input.show();
		this._undoBtn.show();
		this._input.focus();
		if ( this._input.getText() == this._defaultText ){
			this._input.select();
		}
		UiManager.regEditLabel(this);
	}
	
	,_cancelEdit : function(){
		this._endEdit();
		this.setText(this._lastText);
	}
	
	,_endEdit : function(){
		this._isEditMode = false;
		this._label.show();
		this._editBtn.hide();
		this._input.hide();
		this._undoBtn.hide();
	}
	
	,_getLabelTempl : function(templ){
		var subTempl = {};
		subTempl.type = 'label';
		subTempl.name = 'label';
		subTempl.style = templ.labelStyle + ' commEditLabel';
		return subTempl;
	}
	
	,_getEditBtnTempl : function(templ){
		var subTempl = {};
		subTempl.type = 'image_button';
		subTempl.name = 'editBtn';
		subTempl.style = templ.editBtnStyle;
		subTempl.tip = res_s.edit;
		return subTempl;
	}
	
	,_getUndoBtnTempl : function(templ){
		var subTempl = {};
		subTempl.type = 'image_button';
		subTempl.name = 'undoBtn';
		subTempl.style = templ.undoBtnStyle;
		subTempl.tip = res_s.undo;
		return subTempl;
	}
	
	,_getInputTempl : function(templ){
		var subTempl = {};
		subTempl.type = this._getInputTemplType();
		subTempl.name = 'input';
		//subTempl.querypanel = templ.querypanel;
		subTempl.style = templ.inputStyle;
		if ( templ.rect ) {
			subTempl.size = {cx:templ.rect.width, cy:templ.rect.height};
		} else if ( templ.size ) {
			subTempl.size = templ.size;
		}
		return subTempl;
	}
	
	,_getInputTemplType : function(){
		return 'input';
	}
});

var EditNumerLabel = EditLabel.ex({
	_getInputTemplType : function(){
		return 'number_input';
	}
});

var Button = Widget.ex({
	_init : function(){
		Widget._init.call(this);
		this._callers = {};
	}
	
	,setText : function(text){
		this._setText(this._elem, text);
	}
	
	,setCaller : function(callerType, caller){
		this._callers[callerType] = caller;
	}
	
	,_createEnd : function(){
		this._initStyles();
		this.setStyle(this._templ.style);
		this._setVerticalMiddle();
		this._regCallers();
	}
	
	,_regCallers : function(){
		var this_l = this;
		JUtil.addEvent(this._elem, 'click', function(e){
			e = e ? e : window.event;
			//JUtil.stopPropagation(e);
			var caller = this_l._callers['BTN_CLICK'];
			if (caller) caller.invoke(this_l);
			return true;
		});	
		JUtil.addEvent(this._elem, 'mousedown', function(e){
			e = e ? e : window.event;
			//JUtil.stopPropagation(e);
			var caller = this_l._callers['BTN_PUSH'];
			this_l._onMouseDown(e);
			if (caller) caller.invoke(this_l);
			return true;
		});	
		JUtil.addEvent(this._elem,'mouseover',function(e){
			e = e ? e : window.event;
			this_l._mouseOver();
		});
		JUtil.addEvent(this._elem,'mouseout',function(e){
			e = e ? e : window.event;
			this_l._mouseOut();
		});		
	}
	
	,_onMouseDown : function(e){
	}
	
	,_initStyles : function(){
		if ( !this._templ.style ) this._templ.style = 'commButton';
		if ( !this._templ.pressStyle ) this._templ.pressStyle = 'commPressButton';
		if ( !this._templ.hotStyle ) this._templ.hotStyle = 'commHotButton';
	}
	
	,_setVerticalMiddle : function(){
		JUtil.setVerticalMiddle(this.getElem());
	}
	
	,_mouseOver : function(){
		this.setStyle(this._templ.hotStyle);
	}
	
	,_mouseOut : function(){
		this.setStyle(this._templ.style);
	}
});

var ImageButton = Button.ex({
	_setVerticalMiddle : function(){
	}
	
	,_initStyles : function(){
		if ( !this._templ.pressStyle ) this._templ.pressStyle = this._templ.style;
		if ( !this._templ.hotStyle ) this._templ.hotStyle = this._templ.style
	}
});

var CheckButton = Button.ex({
	_init : function(){
		Button._init.call(this);
		this._press = false;
	}
	
	,setPress : function(isPress){
		this._press = isPress;
		if ( this._press && this._templ.pressStyle) {
			this.setStyle(this._templ.pressStyle);
		} else {
			this.setStyle(this._templ.style);
		}
	}
	
	,isPress : function(){
		return this._press;
	}

	,_onMouseDown : function(e){
		this.setPress(!this._press);
	}
	
	,_initStyles : function(){
		if ( !this._templ.style ) this._templ.style = 'commTabBtn';
		if ( !this._templ.pressStyle ) this._templ.pressStyle = 'commPressTabBtn';
		if ( !this._templ.hotStyle ) this._templ.hotStyle = 'commHotTabBtn';
		if ( !this._templ.pressHotStyle ) this._templ.pressHotStyle = 'commPressHotTabBtn';
	}

	,_mouseOver : function(){
		if ( this._press ) {
			this.setStyle(this._templ.pressHotStyle);
		} else {
			this.setStyle(this._templ.hotStyle);
		}
	}
	
	,_mouseOut : function(){
		if ( this._press ) {
			this.setStyle(this._templ.pressStyle);
		} else {
			this.setStyle(this._templ.style);
		}
	}	
});

var NullButton = JClass.ex({
	show : function(){}
	,hide : function(){}
	,setCaller:function(){}
	,getElem: function(){return null;}
}).snew();

var InputQueryPanel = JClass.ex({
	_init : function(){
		this._list = null;
		this._bindInput = null;
		this._create();
	}
	
	,_create : function(){
		var listTempl = {};
		listTempl.type = 'list';
		listTempl.style = 'inputQueryPanel';
		listTempl.size = {cx:100, cy:100};
		listTempl.name = '';
		listTempl.itemTempl = {
			type:'widget'
			,name:'item'
			,style:'item'
			,hotstyle:'item-hot'
			,selstyle:'item-sel'
			,duplicate:true
			,size:{cx:24, cy:20}
			,items:[
				{
					type:'label'
					,name:'name'
					,style:'commLbl'
					,rect:{left:4, top:4, width:20, height:12}
				}
			]
		};		
		this._list = WidgetFactory.createItemByTempl(JUI.getRoot(), listTempl);
		this._list.hide();
		this._list.setCaller('LIST_CLICKITEM', JCaller.snew(this, this._onClickItem));
	}
	
	,show : function(input){
		this._bindInput = input;
		this._fillListData(this._bindInput.getQueryDataList());
		
		var offset = JUtil.elemABOffset(this._bindInput.getElem());
		var rect = JUtil.getElemRect(this._bindInput.getElem());
		var top = offset.top + rect.height + 1;
		JUtil.setElemPos(this._list.getElem(), {x:offset.left, y:top});
		JUtil.setZOrder(this._list.getElem(), UiManager.regPanel(this._list));
		this._list.show();
	}
	
	,_onClickItem : function(e, item){
		var selectText = item.findWidget('item.name').getText();
		if ( !this._bindInput.autoComplete(selectText) ) {
			this._bindInput.setText(selectText);
		}
		this._list.hide();
	}
	
	,_fillListData : function(dataList){
		var rect = JUtil.getElemRect(this._bindInput.getElem());
		JUtil.setElemWidth(this._list.getElem(), rect.width);
		this._list.setCount(dataList.length);
		for ( var i=0; i<dataList.length; ++i ) {
			var item = this._list.getItem(i, 'item');
			var name = this._list.getItem(i, 'item.name');
			name.setText(dataList[i]);
			JUtil.setElemWidth(item.getElem(), rect.width);
			JUtil.setElemWidth(name.getElem(), rect.width-2*4);
		}
		if ( dataList.length > 0 ) this._list.select(0); 
		else this._list.select(-1); 
	}
});

var Input = Widget.ex({
	_init : function(){
		Widget._init.call(this);
		this._callers = {};
	}
	
	,setCaller : function(callerType, caller){ // 'INPUT_QUERY', 'INPUT_AUTOCOMPLETE' 'INPUT_FOCUS'
		this._callers[callerType] = caller;
	}
	
	,setText : function(text){
		this._setText(this._elem, text);
	}
	
	,getText : function(){
		return JUtil.getInputText(this._elem);
	}
	
	,focus : function(){
		JUtil.setElemFocus(this._elem);
	}
	
	,select : function(){
		JUtil.selectInputElemText(this._elem);
	}
	
	,getQueryDataList : function(){
		var caller = this._callers['INPUT_QUERY'];
		if ( !caller ) return [];
		return caller.invoke(this, this.getText());
	}
	
	,autoComplete : function(selectText){
		var caller = this._callers['INPUT_AUTOCOMPLETE'];
		if ( !caller ) return false;
		return caller.invoke(this, this.getText(), selectText);
	}
	
	,_createInnerElem : function(){
		return JUtil.createInputElem();
	}
	
	,_setText : function(elem, text){
		if ( JUtil.isNull(text) ) return;
		JUtil.setInputText(elem, text);
	}
	
	,_createEnd : function(){
		Widget._createEnd.call(this);
		var this_l = this;
		JUtil.addEvent(this.getElem(),'focus',function(e){
			var caller = this_l._callers['INPUT_FOCUS'];
			if ( caller ) caller.invoke(this_l);
			return true;
		});
		
		if ( this._templ.querypanel ) {
			var this_l = this;
			JUtil.addEvent(this.getElem(),'focus',function(e){
				JUI.getInputQueryPanel().show(this_l);
				return true;
			});
			JUtil.addEvent(this.getElem(),'mousedown',function(e){
				JUI.getInputQueryPanel().show(this_l);
				JUtil.stopPropagation(e);
				return true;
			});
			JUtil.addEvent(this.getElem(),'keydown',function(e){
				JUtil.setTimer(1, JCaller.snew(this_l, function(){
					JUI.getInputQueryPanel().show(this_l);
					}));
				return true;
			});
		}
	}
});

var NumberInput = Input.ex({
	_createEnd : function(){
		Input._createEnd.call(this);
		
		var this_l = this;
		JUtil.addEvent(this.getElem(),'blur',function(e){
			var t = parseInt(this_l.getText(), 10);
			if ( isNaN(t) ) t = 0;
			this_l.setText(t.toString());
			return true;
		});
	}
});

var MInput = Input.ex({
	_init: function(){
		Input._init.call(this);
		this._callers = {};
	}
	
	,_createInnerElem : function(){
		return JUtil.createMInputElem();
	}
	
	,_createEnd : function(){
		var this_l = this;
		JUtil.addEvent(this.getElem(), 'input', function(){
			this_l._onInput();
		});
	}
	
	,setCaller : function(callerType, caller){
		this._callers[callerType] = caller;
	}
	
	,_onInput : function() {
		var caller = this._callers['MINPUT_INPUT'];
		if ( caller ) caller.invoke();
	}
});

var Radio = Widget.ex({ 
	alloc_name_id : 0
	
	,_init : function(){
		Widget._init.call(this);
		this._idname = '__inner_radio_' + (Radio.alloc_name_id++);
		this._options = [];
	}

	,select : function(optionVal){
		for ( var i=0; i<this._options.length; ++i ) {
			var option = this._options[i];
			if ( JUtil.getRadioValue(option) == optionVal ) {
				JUtil.setRadioCheckFlag(option, true);
			} else {
				JUtil.setRadioCheckFlag(option, false);
			}
		}
	}
	
	,getSelect : function(){
		for ( var i=0; i<this._options.length; ++i ) {
			var option = this._options[i];
			if ( JUtil.getRadioCheckFlag(option) == true ) {
				return JUtil.getRadioValue(option);
			}
		}
		return -1;
	}
	
	,addOption : function(option, optionText){
		var optionId = this._idname + '_' + this._options.length;
		var op = JUtil.createRadioElem(this._name, optionId, option, optionText);
		JUtil.appendElem(this._elem, op.radio);
		JUtil.appendElem(this._elem, op.label);
		JUtil.setClass(op.radio, this._templ.optionStyle);
		JUtil.setClass(op.label, this._templ.optionTextStyle);
		this._options.push(op.radio);
	}
	
	,_createInnerElem : function(){
		return JUtil.createElem();
	}
	
	,_setText : function(elem, text){
	}
	
	,_createEnd : function(){
		if (!this._templ.radios) return;
		for ( var i=0; i<this._templ.radios.length; ++i ) {
			var op = this._templ.radios[i];
			this.addOption(op.option, op.text);
		}
	}
});

var Check = Widget.ex({ 
	alloc_name_id : 0
	
	,_init : function(){
		Widget._init.call(this);
		this._idname = '__inner_check_' + (Radio.alloc_name_id++);
		this._check = null;
	}
	
	,_createInnerElem : function(){
		var rt = JUtil.createCheckElem(this._idname, this._idname, this._templ.text);
		this._check = rt.check;
		return rt.container;
	}
	
	,_setText : function(elem, text){
		//if ( JUtil.isNull(text) ) return;
		//JUtil.setInputText(elem, text);
	}
	
	,check : function(){
		this._check.checked = true;
	}
	
	,unCheck : function(){
		this._check.checked = false;
	}
	
	,isChecked : function(){
		return this._check.checked;
	}
	//checkbox
});

var ListDrag = JClass.ex({
	DRAG_SPACE : 10
	,_init : function(){
		this._list = null;
		this._templ = null;
		
		this._lastMousePos = {x:0, y:0};
		this._lastSelectItem = null;
		this._lastElem = null;
		this._lastElemParent = null;
		this._globalElem = null;
		this._curSelectItem = null;
		this._caller = JNullCaller;
	}
	
	,create : function(list, templ){
		this._list = list;
		this._templ = templ;
		if ( !this._templ.canDrag ) return;
		this._createDragGlobalElem();
	}
	
	,setCaller : function(callerType, caller){
		if ( callerType != 'LIST_DRAGITEM' ) return;
		this._caller = caller;
	}
	
	,setItemEvent : function(item){
		if ( !this._templ.canDrag ) return;
		JUtil.addEvent(item.getElem(), 'dragstart', function(){return false;});
		JUtil.addEvent(item.getElem(), 'selectstart', function(){return false;});
		JUtil.captureMouseEvent(item.getElem()
			,{
			mouseDown:JCaller.snew(this, this._onMouseDown)
			,mouseMove:JCaller.snew(this, this._onMouseMove)
			,mouseUp:JCaller.snew(this, this._onMouseUp)	});
	}
	
	,selectItem : function(item){
		this._curSelectItem = item;
	}
	
	,_createDragGlobalElem : function(){
		this._globalElem = JUtil.createElem();
		JUtil.setZOrder(this._globalElem, 100000000);
		JUtil.setClass(this._globalElem, this._templ.itemTempl.style);
		JUtil.setElemPos(this._globalElem, this._templ.itemTempl.pos);		
		JUtil.setElemSize(this._globalElem, this._templ.itemTempl.size);
		JUtil.setElemRect(this._globalElem, this._templ.itemTempl.rect);
		JUtil.setElemOpacity(this._globalElem, 80);
		JUtil.hideElem(this._globalElem);
		JUtil.appendElem(this._list.getElem(), this._globalElem);
	}
	
	,_onMouseDown : function(e){
		this._revert();
		this._lastMousePos = JUtil.mouseRelativeCoords(this._list.getElem(), e);
		this._lastSelectItem = this._curSelectItem;
		UiManager.saveEditLabels();
	}
	
	,_onMouseMove : function(e, elem){
		var pos = JUtil.mouseRelativeCoords(this._list.getElem(), e);
		if ( Math.abs(pos.y - this._lastMousePos.y) > 5 ) {
			if ( !this._lastElem ) {
				this._lastElem = elem;
				this._lastElemParent = JUtil.getElemParent(elem);
				JUtil.removeElem(this._lastElemParent, this._lastElem);
				JUtil.appendElem(this._globalElem, this._lastElem);
				JUtil.showElem(this._globalElem);
			}
		}
		
		if ( this._lastElem ) {
			JUtil.setElemTop(this._globalElem, pos.y - JUtil.getElemHeight(this._lastElem) - ListDrag.DRAG_SPACE + JUtil.getElemScrollTop(this._list.getElem()));
		}
	}
	
	,_onMouseUp : function(e, elem){
		if ( !this._lastElem ) return;
		if ( !this._curSelectItem || !this._lastSelectItem ) {
			this._revert();
			return;
		}
		
		var fromId = this._lastSelectItem.getId();
		var toId = this._curSelectItem.getId();
		if ( fromId == toId ) {
			this._revert();
			return;
		}
		
		if ( !this._caller.invoke(this._lastSelectItem, this._curSelectItem) ) {
			this._revert();
			return;
		}
		
		this._dragInsertItem();
		this._resetItemsIndex(fromId, toId);
	}	
	
	,_revert : function(){
		if ( !this._lastElem ) return;
		JUtil.removeElem(this._globalElem, this._lastElem);
		JUtil.appendElem(this._lastElemParent, this._lastElem);
		JUtil.hideElem(this._globalElem);
		this._reinitLastInfo();
	}
	
	,_dragInsertItem : function(){
		JUtil.removeElem(this._globalElem, this._lastElem);
		JUtil.appendElem(this._lastElemParent, this._lastElem);
		JUtil.removeElem(this._list.getElem(), this._lastElemParent);
		JUtil.insertElemBefore(this._list.getElem(), this._lastElemParent, JUtil.getElemParent(this._curSelectItem.getElem()));
		this._list.removeElem(this._lastSelectItem);
		this._list.insertBefore(this._lastSelectItem, this._curSelectItem);
		JUtil.hideElem(this._globalElem);
		this._reinitLastInfo();
	}
	
	,_resetItemsIndex : function(fromId, toId){
		var startId = fromId < toId ? fromId : toId;
		var endId = toId > fromId ? toId : fromId;
		for ( var i=startId; i<=endId; ++i) {
			var child = this._list.getChild(i);
			child.setId(i);
		}
	}
	
	,_reinitLastInfo : function(){
		this._lastElemParent = null;
		this._lastElem = null;
		this._lastSelectItem = null;
	}
});

var List = Widget.ex({
	_init : function(){
		Widget._init.call(this);
		this._listItemTempl = null;
		this._count = 0;
		this._callers = {};
		this._itemsCallers = {};
		this._drag = ListDrag.snew();
		this._select = -1;
	}
	
	,create : function(parent, templ){
		Widget.create.call(this, parent, templ);
		this._listItemTempl = templ.itemTempl;
		this._drag.create(this, templ);
	}
	
	,setCount : function(count){
		this._allocItems(count);
		this._setCount(count);
		this._showItems();
		this._hideItems();
	}
	
	,getCount : function(){
		return this._count;
	}
	
	,getItem : function(index, sitemPath){
		return this._children[index].findWidget(sitemPath);
	}
	
	,scrollTop : function(){
		JUtil.setElemScrollTop(this.getElem(), 0);
	}
	
	,scrollBottom : function(){
		JUtil.setElemScrollTop(this.getElem(), 0xffffffff);
	}
	
	,setCaller : function(callerType, caller){
		this._callers[callerType] = caller;
		this._drag.setCaller(callerType, caller);
	}
	
	,setItemCaller : function(itemName, callerType, caller){
		if (!this._itemsCallers[itemName]) {
			this._itemsCallers[itemName] = {};
		}
		this._itemsCallers[itemName][callerType] = caller;
	}
	
	,select : function(index){
		this._select = index;
		if ( this._listItemTempl.selstyle && this._select >= 0 && this._select < this._children.length ) {
			var item = this._children[this._select];
			JUtil.setClass(item.getElem(),  this._listItemTempl.selstyle);
		} 
	}
	
	,getCurSelect : function(){
		return this._select;
	}
	
	,_allocItems : function(count){
		if ( count <= this._children.length ) return;
		
		var incCount = count - this._children.length;
		for ( var i=0; i<incCount; ++i ) {
			var item = WidgetFactory.createItemByTempl(this, this._listItemTempl);
			this._addItemEvents(item);
		}
	}
	
	,_addItemEvents : function(item){
		var this_l = this;
		JUtil.addEvent(item.getElem(), 'dragstart', function(e){return false;});
		JUtil.addEvent(item.getElem(),'mouseover',function(e){
				e = e ? e : window.event;
				this_l._mouseOver(item);
			});
		JUtil.addEvent(item.getElem(),'mouseout',function(e){
				e = e ? e : window.event;
				this_l._mouseOut(item);
			});
		JUtil.addEvent(item.getElem(),'click',function(e){
				e = e ? e : window.event;
				this_l._select = item.getId();
				var caller = this_l._callers['LIST_CLICKITEM'];
				if ( caller ) caller.invoke(e, item);
				//JUtil.stopPropagation(e);
			});
		JUtil.addEvent(item.getElem(),'dblclick',function(e){
				e = e ? e : window.event;
				//JUtil.stopPropagation(e);
				this_l._select = item.getId();
				var caller = this_l._callers['LIST_DCLICKITEM'];
				if ( caller ) caller.invoke(e, item);
			});
		this._drag.setItemEvent(item);
			
		for ( var itempath in this._itemsCallers ) {
			var callers = this._itemsCallers[itempath];
			var widget = item.findWidget(itempath);
			if ( !widget ) continue;
			for ( var callerType in callers ) {
				widget.setCaller(callerType, callers[callerType] );
			}
		}
	}
	
	,_setCount : function(count){
		this._count = count;
	}
	
	,_showItems : function(){
		for ( var i=0; i<this._count; ++i ) {
			var item = this._children[i];
			JUtil.showElem(item.getDuplicateElem() ? item.getDuplicateElem() : item.getElem());
			item.setId(i);
		}
	}
	
	,_hideItems : function(){
		for ( var i=this._count; i<this._children.length; ++i ) {
			var item = this._children[i];
			JUtil.hideElem(item.getDuplicateElem() ? item.getDuplicateElem() : item.getElem());
		}
	}
	
	,_mouseOver : function(item){
		JUtil.setClass(item.getElem(),  this._listItemTempl.hotstyle);
		this._drag.selectItem(item);
		var caller = this._callers['LIST_MOUSEOVER'];
		if ( caller ) caller.invoke(item);
	}
	
	,_mouseOut : function(item){
		if ( this._listItemTempl.selstyle && item.getId() == this._select) {
			JUtil.setClass(item.getElem(),  this._listItemTempl.selstyle);
		} else {
			JUtil.setClass(item.getElem(),  this._listItemTempl.style);
		}
		this._drag.selectItem(null);
		var caller = this._callers['LIST_MOUSEOUT'];
		if ( caller ) caller.invoke(item);
	}
});

var DropList = Widget.ex({
	_init : function(){
		Widget._init.call(this);
		this._title = null;
		this._dropBtn = null;
		this._list = null;
		this._cursel = -1;
		this._callers = {};
		this._itemsCallers = {};
		this._enable = true;
	}
	
	,create : function(parent, templ){
		Widget.create.call(this, parent, templ);
	}
	
	,createFinished: function(){
		this._createTitle();
		this._createDropBtn();
		this._createList();
		this._setCallers();
	}
	
	,enable: function(){
		this._enable = true;
	}
	
	,disable: function(){
		this._enable = false;
		if ( this._dropBtn ) this._dropBtn.hide();
	}
	
	,setCount : function(count){
		this._list.setCount(count);
	}
	
	,getCount : function(){
		return this._list.getCount();
	}
	
	,getItem : function(index, sitemPath){
		return this._list.getItem(index, sitemPath);
	}
	
	,scrollTop : function(){
		this._list.scrollTop();
	}
	
	,scrollBottom : function(){
		this._list.scrollBottom();
	}
	
	,setCaller : function(callerType, caller){
		this._callers[callerType] = caller;
		this._list.setCaller(callerType, caller);
	}
	
	,setItemCaller : function(itemName, callerType, caller){
		if (!this._itemsCallers[itemName]) {
			this._itemsCallers[itemName] = {};
		}
		this._itemsCallers[itemName][callerType] = caller;
		this._list.setItemCaller(itemName, callerType, caller);
	}
	
	,select : function(listIdx){
		this._cursel = listIdx;
		this._setCurTitle();
	}
	
	,getCurSelect : function(){
		return this._cursel;
	}
	
	,_setCurTitle : function(){
		for ( var subItemIdx=0; subItemIdx<this._templ.listItemsData.dataTempl.length; ++subItemIdx){
			var dataTempl = this._templ.listItemsData.dataTempl[subItemIdx];
			if ( dataTempl.dataType == 'text' ) {
				var text = this._list.getItem(this._cursel, dataTempl.path).getText();
				this._title.findWidget(dataTempl.path).setText(text);
			}
			if ( dataTempl.dataType == 'style' ) {
				var style = this._list.getItem(this._cursel, dataTempl.path).getStyle();
				this._title.findWidget(dataTempl.path).setStyle(style);
			}
		}
	}
	
	,_createTitle : function(templ){
		var titleTempl = {};
		titleTempl.type = 'image_button';
		titleTempl.name = this._templ.itemTempl.name;
		titleTempl.rect = this._templ.itemTempl.rect;
		titleTempl.size = this._templ.itemTempl.size;
		titleTempl.pos = this._templ.itemTempl.pos;
		titleTempl.style = 'dropPanelTitle';
		titleTempl.items = this._templ.itemTempl.items;
			
		this._title = WidgetFactory.createItemByTempl(this, titleTempl);
	}
	
	,_createDropBtn : function(){
		var btnTempl = {type:'image_button', style:'drop_icon', rect:{top:3, left:this._templ.rect.width - 14, width:14, height:14}};
		this._dropBtn = WidgetFactory.createItemByTempl(this, btnTempl);
		this._dropBtn.hide();
	}
	
	,_createList : function(templ){
		var listTempl = {};
		listTempl.type = 'list';
		listTempl.style = 'dropPanel';
		listTempl.size = this._templ.listSize;
		listTempl.name = this._templ.name;			
		listTempl.itemTempl = this._templ.itemTempl;
		this._list = WidgetFactory.createItemByTempl(JUI.getRoot(), listTempl);
		this._fillListData();
		this._list.hide();
	}
	
	,_fillListData : function(){
		if ( !this._templ.listItemsData.datas ) return;
		
		this._list.setCount(this._templ.listItemsData.datas.length);
		for ( var listIdx=0; listIdx<this._templ.listItemsData.datas.length; ++listIdx ) {
			var itemDatas = this._templ.listItemsData.datas[listIdx];
			for ( var subItemIdx=0; subItemIdx<this._templ.listItemsData.dataTempl.length; ++subItemIdx){
				var dataTempl = this._templ.listItemsData.dataTempl[subItemIdx];
				if ( dataTempl.dataType == 'text' ) this._list.getItem(listIdx, dataTempl.path).setText(itemDatas.text);
				if ( dataTempl.dataType == 'style' ) this._list.getItem(listIdx, dataTempl.path).setStyle(itemDatas.style);
			}
		}
	}
	
	,_setCallers : function(){
		this._title.setCaller('BTN_CLICK', JCaller.snew(this, this._onDropDown));
		this._dropBtn.setCaller('BTN_CLICK', JCaller.snew(this, this._onDropDown));
		var this_l = this;
		JUtil.addEvent(this.getElem(),'mouseover',function(e){
			this_l._mouseOver();
		});
		JUtil.addEvent(this.getElem(),'mouseout',function(e){
			this_l._mouseOut();
		});
		this._list.setCaller('LIST_CLICKITEM', JCaller.snew(this, this._onClickItem));
	}
	
	,_onDropDown : function(){
		if ( !this._enable ) return;
		
		var offset = JUtil.elemABOffset(this.getElem());
		var top = offset.top + this._templ.rect.height;
		JUtil.setElemPos(this._list.getElem(), {x:offset.left, y:top});
		JUtil.setZOrder(this._list.getElem(), UiManager.regPanel(this._list));
		this._list.show();
	}
	
	,_onClickItem : function(e, item){
		var caller = this._callers['DROPLIST_CHANGING'];
		if ( caller && !caller.invoke(this, item) ) {
			this._list.hide();
			return;
		}
		
		this.select(item.getId());
		this._list.hide();
		UiManager.unregPanel(this._list);
		
		var caller = this._callers['DROPLIST_CHANGED'];
		if ( caller ) caller.invoke(this);
	}
	
	,_mouseOver : function(){
		if ( this._enable ) this._dropBtn.show();
	}
	
	,_mouseOut : function(){
		this._dropBtn.hide();
	}
});


var TabCtrl = Widget.ex({
	_init : function(){
		Widget._init.call(this);
		this._btnsBar = null;
		this._panelContainer = null;
		this._tabs = [];
	}
	
	,create : function(parent, templ){
		Widget.create.call(this, parent, templ);
		this._createTabs();
	}
	
	,addTab : function(tabText, panelTempl){
		var tabBtn = WidgetFactory.createItemByTempl(this._btnsBar, this._templ.tabBtnTempl);
		var tabPanel = WidgetFactory.createItemByTempl(this._panelContainer, panelTempl);
		this._tabs.push({tabBtn:tabBtn, tabPanel:tabPanel});
		tabPanel.hide();
		tabBtn.setId(this._tabs.length-1);
		tabBtn.setText(tabText);
		tabBtn.setCaller('BTN_PUSH', JCaller.snew(this, this._onClickTabBtn));
	}
	
	,activeTab : function(tabIndex){
		for ( var i=0; i<this._tabs.length; ++i ) {
			var tab = this._tabs[i];
			if ( i == tabIndex ) {
				tab.tabBtn.setPress(true);
				tab.tabPanel.show();
			} else {
				tab.tabBtn.setPress(false);
				tab.tabPanel.hide();
			}
		}
	}
	
	,getPanel : function(tabIndex){
		return this._tabs[tabIndex].tabPanel;
	}
	
	,_onClickTabBtn : function(tabBtn){
		var tabIndex = tabBtn.getId();
		this.activeTab(tabIndex);
	}
	
	,_createTabs : function(){
		this._btnsBar = WidgetFactory.createItemByTempl(this, this._templ.tabBarTempl);
		this._panelContainer = WidgetFactory.createItemByTempl(this, this._templ.panelContainerTempl);
		for ( var i=0; i<this._templ.tabs.length; ++i ) {
			var tabInfo = this._templ.tabs[i];
			this.addTab(tabInfo.tabText, tabInfo.panelTempl);
		}
	}
});

var WidgetFactory = JClass.ex({
	createItemByTempl : function(parent, templ){
		var cur = null;
		if (templ.type == 'widget') {
			cur = Widget.snew();
		} else if (templ.type == 'edit_number_label') {
			cur = EditNumerLabel.snew();
		} else if (templ.type == 'edit_label') {
			cur = EditLabel.snew();
		} else if (templ.type == 'rich_label') {
			cur = RichLabel.snew();
		} else if (templ.type == 'label') {
			cur = Label.snew();
		} else if (templ.type == 'image_button') {
			cur = ImageButton.snew();
		} else if (templ.type == 'check_button') {
			cur = CheckButton.snew();
		} else if (templ.type == 'button') {
			cur = Button.snew();
		} else if (templ.type == 'check') {
			cur = Check.snew();
		} else if (templ.type == 'radio') {
			cur = Radio.snew();
		} else if (templ.type == 'minput') {
			cur = MInput.snew();
		} else if (templ.type == 'input') {
			cur = Input.snew();
		} else if (templ.type == 'number_input') {
			cur = NumberInput.snew();
		} else if (templ.type == 'list') {
			cur = List.snew();
		} else if (templ.type == 'tabctrl') {
			cur = TabCtrl.snew();
		} else if (templ.type == 'drop_list') {
			cur = DropList.snew();
		} else {
			alert('error widget type: ' + templ.type);
			return;
		}
		
		cur.create(parent, templ);
		this._createItemsByTempl(cur, templ.items);
		cur.createFinished();		
		
		return cur;
	}
	
	,createEmptyWidget : function(elem){
		var w = Widget.snew();
		w.setElem(elem);
		return w;
	}
	
	,_createItemsByTempl : function(parent, templItems){
		if (!templItems) return;
		for ( var i=0; i<templItems.length; ++i ) {
			this.createItemByTempl(parent, templItems[i]);
		}
	}
}).snew();

var MsgBox = Dialog.ex({
	_getParent : function(){
		return WidgetFactory.createEmptyWidget(JUtil.getElemById('g_root'));
	}
	
	,_getTempl : function(){
		return {
			type:'widget'
			,modal: true
			,name: 'root'
			,dragTitle: 40
			,style:'dialog'
			,rect:{left:100, top:100, width:350, height:200}
			,items:[
				{
					type:'label'
					,name:'title'
					,style:'dlgTitle'
					,rect:{left:0, top:0, width:350, height:35}
				}
				,{
					type:'image_button'
					,name:'closeBtn'
					,style:'dlgclose_icon'
					,rect:{left:320, top:7, width:22, height:22}
				}
				,{
					type:'label'
					,name:'msg'
					,style:'commLbl'
					,rect:{left:10, top:50, width:320, height:100}
				}
				,{
					type:'button'
					,name:'confirmButton'
					,style:'commButton'
					,text:res_s.confirmButton
					,rect:{left:150, top:160, width:80, height:25}
				}
				,{
					type:'button'
					,name:'cancelButton'
					,style:'commButton'
					,text:res_s.cancelButton
					,rect:{left:250, top:160, width:80, height:25}
				}
			]
		};
	}
	
	,_setCallers : function(){
		this._setItemCaller('root.closeBtn', 'BTN_CLICK', JCaller.snew(this, this._onCancelButton));
		this._setItemCaller('root.confirmButton', 'BTN_CLICK', JCaller.snew(this, this._onConfirmButton));
		this._setItemCaller('root.cancelButton', 'BTN_CLICK', JCaller.snew(this, this._onCancelButton));
	}
	
	,_onOpenBefore : function(){
		this._panel.findWidget('root.title').setText(this._param.title);
		this._panel.findWidget('root.msg').setText(this._param.msg);
		this._setButtons();
	}
	
	,_setButtons : function(){
		if ( this._param.type == 'CONFIRM_CANCEL' ) {
			this._panel.findWidget('root.confirmButton').show();
			this._panel.findWidget('root.cancelButton').show();
			this._panel.findWidget('root.confirmButton').setText(res_s.confirmButton);
			this._panel.findWidget('root.cancelButton').setText(res_s.cancelButton);
		} else if ( this._param.type == 'CLOSE' ) {
			this._panel.findWidget('root.confirmButton').hide();
			this._panel.findWidget('root.cancelButton').show();
			this._panel.findWidget('root.cancelButton').setText(res_s.closeButton);
		}
	}
	
	,_onConfirmButton : function(){
		this.close();
		if ( this._param.caller) this._param.caller.invoke(this._getConfirmText());
	}
	
	,_onCancelButton : function(){
		this.close();
		if ( this._param.caller) this._param.caller.invoke(this._getCancelText());
	}
	
	,_getConfirmText : function(){
		if ( this._param.type == 'CONFIRM_CANCEL' ) return 'CONFIRM';
		return '';
	}
	
	,_getCancelText : function(){
		if ( this._param.type == 'CONFIRM_CANCEL' ) return 'CANCEL';
		else if ( this._param.type == 'CLOSE' ) return 'CLOSE';
		return '';
	}
});

JUI = JClass.ex({
	Widget : Widget
	,Dialog : Dialog
	,Label : Label
	,RichLabel : RichLabel
	,EditLabel : EditLabel
	,EditNumerLabel : EditNumerLabel
	,Button : Button
	,ImageButton : ImageButton
	,CheckButton : CheckButton
	,Input : Input
	,NumberInput : NumberInput
	,MInput : MInput
	,Radio : Radio
	,Check : Check
	,List : List
	,DropList : DropList
	,TabCtrl : TabCtrl
	
	,_init : function(){
		this._root = null;
		this._inputQueryPanel = null;
		this._msg = this.createDialog(MsgBox);
	}
	
	,createEmptyWidget : function(elem){
		return WidgetFactory.createEmptyWidget(elem);
	}
	
	,createPanel : function(parent, templ){
		return WidgetFactory.createItemByTempl(parent, templ);
	}
	
	,createDialog : function(dialogClass){
		var dlg = dialogClass.snew();
		dlg.create();
		return dlg;
	}

	,openMsgBox : function(title, msg, type, caller){
		this._msg.open({title:title, msg:msg, type:type, caller:caller});
	}
	
	,setRootElem : function(root){
		this._root = this.createEmptyWidget(root);
	}
	
	,getRoot : function(){
		return this._root;
	}
	
	,getInputQueryPanel : function(){
		if ( !this._inputQueryPanel ) {
			this._inputQueryPanel = InputQueryPanel.snew();
		}
		return this._inputQueryPanel;
	}
}).snew();


