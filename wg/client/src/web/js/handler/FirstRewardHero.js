/*******************************************************************************/
FirstRewardHero = JClass.ex({
	_init : function(g){
		this.REWARD_EFFECT = 3;
		this._g = g;
		this._startEffect = null;
	}
	
	,start : function(){
		//this._playStartEffect();
		this._openDlg();
	}
	
	,_playStartEffect : function(){
		this._startEffect = this._g.getAnimMgr().alloc(this.REWARD_EFFECT);
		this._startEffect.addCaller({self:this, caller:this._onEffectStop});
		this._startEffect.setZIndex(1000000);
		var pos = {x : this._g.getWinSizer().getValidClientSize().cx/2, y : 300 };
		this._startEffect.setPosition(pos);
		this._startEffect.play();
	}
	
	,_onEffectStop : function(){
		this._openDlg();
	}
	
	,_openDlg : function(){
		UIM.getDlg('npc').openDlg({desc:rstr.firstRewardHero.desc
			,ops:rstr.firstRewardHero.ops
			,caller:Caller.snew(this, this._onSelectOption)});
	}
	
	,_onSelectOption : function(optionIdx){
		RewardSender.sendFirstHero(this._g, optionIdx);
	}
});
