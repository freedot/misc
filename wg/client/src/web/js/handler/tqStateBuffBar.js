/*******************************************************************************/
StateBuffBar = Class.extern(function(){
	var C_ICON_W = 36;
	var C_SPACE = 0;
	var m_this;
	var m_states=[];
	this.init = function(g, buffList){
		m_this = this;
		this.g_ = g;
		this.buffList_ = buffList;
		this.g_.regEvent(EVT.ROLESPECSTATE_CHANGE, 0, this, this._onStateChange);
		_update();
	};
	
	this._onStateChange = function(){
		_update();
	};
	
	var _update = function(){
		m_states = _getCanShowStates();
		m_this.buffList_.setItemCount(m_states.length);
		_setListItems();
		_setListWidth();
	};
	
	var _getCanShowStates = function(){
		var canShowStates = [];
		var states = m_this.g_.getImgr().getRoleStates();
		for ( var i=0; i<states.length; ++i ) {
			var state = states[i];
			var res = TQ.find(res_state_effects, 'effectid', state.id);
			if (!res) continue;
			if (!res.isshow) continue;
			state.res = res;
			canShowStates.push(state);
		}
		return canShowStates;
	};
	
	var _setListItems = function(){
		for (var i=0; i<m_this.buffList_.getCount(); ++i ) {
			var item = m_this.buffList_.getItem(i);
			IMG.setBKImage(item.exsubs.icon, IMG.makeSmallImg(m_states[i].res.smallpic) );
			TTIP.getTipById(item.exsubs.tooltips['$item']).setFlag(TIP_FLAG.TIMER);
			TTIP.setCallerData(item.exsubs.tooltips['$item'], {self:m_this, caller:_onGetTooltip},{idx:i});
		}		
	};
	
	var _setListWidth = function(){
		var w = (m_this.buffList_.getCount()*C_ICON_W + C_SPACE);
		TQ.setDomWidth(m_this.buffList_.getParent(), w);
	};
	
	var _onGetTooltip = function(data){
		var state = m_states[data.idx];
		var leftTime = Math.max(0, state.stoptime - m_this.g_.getSvrTimeS());
		
		var s = state.res.desc.replace(/{val}/g, state.val);
		s = _replaceDescByEval(s);
		return TIPM.makeItemTip(s + C_TIP_NEWLINE + TQ.format(rstr.buffBar.tip.leftTime, TQ.formatTime(0, leftTime) ));
	};
	
	var _replaceDescByEval = function(desc){
		var replaces = {};
		var evals = desc.match(/eval\[[^\]]+\]/g);
		for ( var i=0; evals && i<evals.length; ++i ) {
			var oneEval = evals[i];
			oneEval = oneEval.replace(/eval\[([^\]]+)\]/g, '$1');
			replaces[ evals[i] ] = eval(oneEval);
		}
		return _replaceDescByPairs(desc, replaces);
	};
	
	var _replaceDescByPairs = function(desc, replaces){
		for ( var k in replaces ) {
			while (desc.indexOf(k) >= 0) {
				desc = desc.replace(k, replaces[k] );
			}
		}
		return desc;
	};
});
