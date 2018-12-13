var CaseHelpDlg = JUI.Dialog.ex({
	_getParent : function(){
		return JUI.getRoot();
	}
	
	,_getTempl : function(){
		return ui_res.caseHelpDlg;
	}
	
	,_setCallers : function(){
		this._setItemCaller('root.closeBtn', 'BTN_CLICK', JCaller.snew(this, this._onClickClose));
	}
	
	,_onClickClose : function(){
		this.close();
	}
});

var CaseDlg = JUI.Dialog.ex({
	_onInit : function(){
		this._helpDlg = JUI.createDialog(CaseHelpDlg);
		this._case = {id:0, storyId:0, name:'', content:''};
		this._previewStateRect = {border:{left:10, top:75, width:970-2, height:810}, preview:{left:10, top:5, width:970-20, height:810-10}};
		this._editRect = {editor:{left:10, top:75, width:970, height:400}, border:{left:10, top:75+410, width:970-2, height:400}, preview:{left:10, top:5, width:970-20, height:400-10}};
	}
	
	,_getParent : function(){
		return JUI.getRoot();
	}
	
	,_getTempl : function(){
		return ui_res.caseDlg;
	}
	
	,_setCallers : function(){
		this._setItemCaller('root.closeBtn', 'BTN_CLICK', JCaller.snew(this, this._onClickClose));
		
		this._setItemCaller('root.editBtn', 'BTN_CLICK', JCaller.snew(this, this._onClickEdit));
		this._setItemCaller('root.deleteBtn', 'BTN_CLICK', JCaller.snew(this, this._onClickDelete));
		
		this._setItemCaller('root.saveBtn', 'BTN_CLICK', JCaller.snew(this, this._onClickSave));
		this._setItemCaller('root.cancelBtn', 'BTN_CLICK', JCaller.snew(this, this._onClickCancel));
		
		this._setItemCaller('root.runBtn', 'BTN_CLICK', JCaller.snew(this, this._onClickRun));
		
		this._setItemCaller('root.helpBtn', 'BTN_CLICK', JCaller.snew(this, this._onClickHelp));
		this._setItemCaller('root.editor', 'MINPUT_INPUT', JCaller.snew(this, this._onEditorInput));
	}
	
	,_onOpenAfter : function(){
		var caseId = this._param.caseId;
		ServerStub.get('CaseObject').getAutoCase(caseId, JCaller.snew(this, function(tcase){
			this._case = tcase;
			this._updateInfo();
		}));
		this._cancelEdit();
	}
	
	,_onClickClose : function(){
		this.close();
	}
	
	,_onClickDelete : function(){
		JUI.openMsgBox(string_res.CaseDlg.msgbox.deleteTitle
			,string_res.CaseDlg.msgbox.deleteMsg
			,'CONFIRM_CANCEL'
			,JCaller.snew(this, function(op){
				if ( op != 'CONFIRM' ) return;
				ServerStub.get('CaseObject').deleteStoryCase(this._case.id, JCaller.snew(this, function(tcase){
					this.close();
				}));
				
				if (this._param.deleteCaller){
					this._param.deleteCaller.invoke();
				}
		}));
	}
	
	,_onClickEdit : function(){
		this._startEdit();
	}
	
	,_onClickSave : function(){
		this._save();
	}
	
	,_onClickCancel : function(){
		this._cancelEdit();
	}	
	
	,_onClickRun : function(){
		ServerStub.get('CaseObject').runCase(this._case.id, JCaller.snew(this, function(ret){
			Register.get('StoryEditDlg').updateStoryState(this._case.id, ret.result.state);
			this._handleRunResult(ret.result.list);
		}));
	}
	
	,_handleRunResult : function(result){
		this._updateTotalInfo(result);
		this._replaceContentByResults(result);
	}
	
	,_updateTotalInfo : function(result){
		var passTotal = 0;
		var unpassTotal = 0;
		for ( var i=0; i<result.length; ++i ) {
			if ( result[i].state ) passTotal++;
			else unpassTotal++;
		}
		this._panel.findWidget('root.passInfo.total').setText(passTotal);
		this._panel.findWidget('root.unpassInfo.total').setText(unpassTotal);
	}
	
	,_replaceContentByResults : function(result){
		var s = '';
		var lastpos = 0;
		for ( var i=0; i<result.length; ++i ) {
			var rt = result[i];
			if ( rt.range.pos > this._case.content.length ) break;
			s += this._case.content.substring(lastpos, rt.range.pos);
			if ( rt.state == 1 ) {
				s += '![test success](./images/testsucc.gif "test success")'
			} else {
				s += '![test fail](./images/testfail.gif "test fail")'
			}
			s += rt.str;
			lastpos = rt.range.pos + rt.range.len;
		}
		s += this._case.content.substring(lastpos, this._case.content.length);
		var txt = markdown.toHTML(this._makeContent(s), 'Maruku');
		this._panel.findWidget('root.border.preview').setText(txt);
	}
	
	,_onClickHelp : function(){
		this._helpDlg.open();
	}
	
	,_onEditorInput : function(){
		var txt = markdown.toHTML(this._makeContent(this._panel.findWidget('root.editor').getText()), 'Maruku');
		this._panel.findWidget('root.border.preview').setText(txt);
	}
	
	,_updateInfo : function(){
		this._setPreview();
	}
	
	,_makeContent : function(content){
		return this._case.name + '\n---\n' + content;
	}
	
	,_cancelEdit : function(){
		this._hideEdit();
		this._setPreview();
	}
	
	,_hideEdit : function(){
		this._panel.findWidget('root.editBtn').show();
		this._panel.findWidget('root.runBtn').show();
		this._panel.findWidget('root.deleteBtn').show();
		this._panel.findWidget('root.saveBtn').hide();
		this._panel.findWidget('root.cancelBtn').hide();
		this._panel.findWidget('root.editor').hide();
		JUtil.setElemRect(this._panel.findWidget('root.border').getElem(), this._previewStateRect.border);
		JUtil.setElemRect(this._panel.findWidget('root.border.preview').getElem(), this._previewStateRect.preview);
	}
	
	,_setPreview : function(){
		this._case.content = this._case.content;
		var txt = markdown.toHTML(this._makeContent(this._case.content), 'Maruku');
		this._panel.findWidget('root.border.preview').setText(txt);
	}
	
	,_startEdit : function(){
		this._panel.findWidget('root.editBtn').hide();
		this._panel.findWidget('root.runBtn').hide();
		this._panel.findWidget('root.deleteBtn').hide();
		this._panel.findWidget('root.saveBtn').show();
		this._panel.findWidget('root.cancelBtn').show();
		this._panel.findWidget('root.editor').show();
		JUtil.setElemRect(this._panel.findWidget('root.editor').getElem(), this._editRect.editor);
		JUtil.setElemRect(this._panel.findWidget('root.border').getElem(), this._editRect.border);
		JUtil.setElemRect(this._panel.findWidget('root.border.preview').getElem(), this._editRect.preview);
		this._panel.findWidget('root.editor').setText(this._case.content);
		this._panel.findWidget('root.editor').focus();
	}
	
	,_save : function(){
		this._setPreview();
		var newContent = this._panel.findWidget('root.editor').getText();
		ServerStub.get('CaseObject').saveAutoCase(this._case.id, this._case.name, newContent, JCaller.snew(this, function(tcase){
			this._case.content = tcase.content;
			this._setPreview();
		}));
		this._hideEdit();
	}
});

Register.reg('CaseDlg', JUI.createDialog(CaseDlg));


