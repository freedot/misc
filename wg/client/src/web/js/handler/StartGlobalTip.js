/*******************************************************************************/
StartGlobalTip = JClass.ex({
	_init : function(g){
		this._g = g;
	}
	
	,openDlg : function(){
		UIM.getDlg('npc').openDlg({desc:TQ.format(rstr.startGlobalTip.desc, IMG.makeImg('reddot/02.png') )
			,ops:rstr.startGlobalTip.ops
			,caller:Caller.snew(this, this._onSelectOption)});
	}
	
	,_onSelectOption : function(optionIdx){
		TaskSender.sendNewcomerTaskEnd(this._g);
	}
});
