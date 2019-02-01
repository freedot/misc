/*******************************************************************************/
PayActDlg = BaseDlg.extern(function(){
	this._init = function(){
		this.g_.regEvent(EVT.NET, NETCMD.ACTIVITY_VAL, this, this._onSvrPkg);
		this.g_.regEvent(EVT.PAYACT, 0, this, this._onPayAct);
	};
	
	this._getDlgCfg = function(){
		return {modal:false, title:rstr.payActDlg.title, pos:{x:"center", y:40}, uicfg:uicfg.payActDlg};
	};
	
	this._setCallers = function(){
		this.dlg_.setCaller({self:this, caller:this._onDlgEvent});
		this.items_.payBtn.setCaller({self:this, caller:this._onClickPayBtn});
		
	};
	
	this._afterCreate = function(){
		for ( var i=0; i<this.items_.list.getCount(); ++i ) {
			var item = this.items_.list.getItem(i);
			var res = res_pay_act_gifts[i];
			TTIP.setCallerData(item.exsubs.tooltips['$item'], {self:this, caller:this._onGetRewardItemTip}, {itemtip:res.itemtip});
			item.exsubs.getBtn.setId(i);
			item.exsubs.getBtn.setCaller({self:this, caller:this._onClickGetBtn});
			TQ.setText(item.exsubs.number, res.allpay);
		}
		
		TTIP.setCallerData( this.items_.tooltips['$returntip'], {self:this, caller:this._onGetReturnRuleTip}, {});
	};
	
	this._initInfo = function(){
		this._update();
		this.g_.regUpdater(this, this._onUpdater, 1000);
	};
	
	this._onUpdater = function(){
		this._updateLeftTime();
	};
	
	this._onSvrPkg = function(netevent){
		var data = netevent.data;
		if ( data.payGiftGots ) {
			this.g_.getImgr().getPayAct().payGiftGots = data.payGiftGots;
		}
		if ( data.payActAllGold ) {
			this.g_.getImgr().getPayAct().payActAllGold = data.payActAllGold;
		}
		if ( data.payActTime ) {
			TQ.dictCopy(this.g_.getImgr().getPayAct().payActTime, data.payActTime);
		}
		
		if (data.payGiftGots || data.payActAllGold || data.payActTime ) {
			this.g_.sendEvent({eid:EVT.PAYACT, sid:0});
		}
	};
	
	this._onPayAct = function(){
		this._update();
	};
	
	this._onClickPayBtn = function(){
		JMISC.openPayWnd();
	};
	
	this._onDlgEvent = function(id){
		if ( id == C_SYS_DLG_HIDE ){
			this.g_.unregUpdater(this, this._onUpdater);
		}		
	};
	
	this._onGetRewardItemTip = function(data){
		return TIPM.makeItemTip(data.itemtip);
	};
	
	this._onGetReturnRuleTip = function(){
		var s = '';
		for ( var i=0; i<res_pay_act_returns.length; ++i ) {
			s += res_pay_act_returns[i].desc + '<br/>';
		}
		s += rstr.payActDlg.tip.returnRule;
		return TIPM.makeItemTip2(s);
	};
	
	this._onClickGetBtn = function(idx){
		ActivityValSender.sendGetPayActReward(this.g_, idx);
	};
	
	this._update = function(){
		if (!this.isShow()) return;
		this._updateActTime();
		this._updateLeftTime();
		this._updatePayGold();
		this._updateReturnPer();
		this._updatePayGoldProg();
		this._updateGetBtnsState();
		this._updateBkImage();
		this._updateReturnRuleDesc();
	};
	
	this._updateActTime = function(){
		var payActTime = this.g_.getImgr().getPayAct().payActTime;
		var s = TQ.format(rstr.payActDlg.lbl.payActTime, TQ.formatDate(payActTime.start), TQ.formatDate(payActTime.stop));
		TQ.setRichText(this.items_.actTime, s);
	};
	
	this._updateLeftTime = function(){
		var payActTime = this.g_.getImgr().getPayAct().payActTime;
		var leftTime = (payActTime.stop + 24*3600) - this.g_.getSvrTimeS();
		var s = TQ.format(rstr.payActDlg.lbl.leftTime, TQ.formatTime(2, leftTime));
		TQ.setRichText(this.items_.leftTime, s);
	};
	
	this._updatePayGold = function(){
		TQ.setRichText(this.items_.payGold, this.g_.getImgr().getPayAct().payActAllGold);
		var giftLevel = this._getCurGiftLevel();
		if ( giftLevel < res_pay_act_gifts.length) {
			var nextLevelIdx = (giftLevel + 1) - 1;
			var res = res_pay_act_gifts[nextLevelIdx];
			var nextNeedLevelGold = res.allpay - this.g_.getImgr().getPayAct().payActAllGold;
			var nextLevelGift = TQ.format(rstr.payActDlg.lbl.nextLevelGift, giftLevel + 1);
			TQ.setRichText(this.items_.nextLevelPayGold, TQ.format(rstr.payActDlg.lbl.nextLevelPayGold, nextNeedLevelGold, nextLevelGift) );
		} else {
			TQ.setRichText(this.items_.nextLevelPayGold, '');
		}
	};
	
	this._updateReturnPer = function(){
		if (this._hasReturn()) {
			TQ.setRichText(this.items_.returnPer, this._getReturnPer() + '%');
			var returnVal =  Math.ceil(this.g_.getImgr().getPayAct().payActAllGold*this._getReturnPer()/(100*10))*10;
			TQ.setRichText(this.items_.returnVal, returnVal + rstr.comm.giftgold );
		} else {
			TQ.setRichText(this.items_.returnPer, '');
			TQ.setRichText(this.items_.returnVal, '');			
		}
	};
	
	this._updatePayGoldProg = function(){
		var progbarLen = 458;
		var subLen = progbarLen/res_pay_act_gifts.length;
		
		var giftLevel = this._getCurGiftLevel();
		var levelIdx = giftLevel - 1;
		var nextLevelIdx = (giftLevel + 1) - 1;
		var curValDis = 0;
		var leftVal = this.g_.getImgr().getPayAct().payActAllGold;
		if ( giftLevel == 0 ) {
			curValDis = res_pay_act_gifts[nextLevelIdx].allpay;
		} else if ( giftLevel < res_pay_act_gifts.length ) {
			curValDis = res_pay_act_gifts[nextLevelIdx].allpay - res_pay_act_gifts[levelIdx].allpay;
			leftVal -= res_pay_act_gifts[levelIdx].allpay;
		} else {
			curValDis = 1;
			leftVal = 0;
		}
		
		var w = giftLevel*subLen + leftVal/curValDis*subLen;
		TQ.setCSS(this.items_.valProg, 'width', w+'px');
	};
	
	this._updateGetBtnsState = function(){
		var payGiftGots = this.g_.getImgr().getPayAct().payGiftGots;
		var curGiftLevel = this._getCurGiftLevel();
		for ( var i=0; i<this.items_.list.getCount(); ++i ) {
			var item = this.items_.list.getItem(i);
			var gotFlag = payGiftGots[i];
			var isEnable = (gotFlag==0) && (i < curGiftLevel);
			item.exsubs.getBtn.enable(isEnable);
		}
	};
	
	this._updateBkImage = function(){
		if ( this._hasReturn() ) {
			IMG.setBKImage(this.items_.bk_img, IMG.makeImg('payactdlg/bk.jpg'));
		} else {
			IMG.setBKImage(this.items_.bk_img, IMG.makeImg('payactdlg/bk_noret.jpg'));
		}
	};
	
	this._updateReturnRuleDesc = function(){
		if ( this._hasReturn() ) {
			TQ.setCSS(this.items_.returnRuleTip, 'display', 'block');
			TQ.setCSS(this.items_.returnRuleDesc, 'display', 'block');
		} else {
			TQ.setCSS(this.items_.returnRuleTip, 'display', 'none');
			TQ.setCSS(this.items_.returnRuleDesc, 'display', 'none');
		}
	};
	
	this._getCurGiftLevel = function(){
		var level = 0;
		for ( var i=0; i<res_pay_act_gifts.length; ++i ) {
			var res = res_pay_act_gifts[i];
			if ( this.g_.getImgr().getPayAct().payActAllGold >= res.allpay ) {
				level = i + 1;
			}
		}
		return level;
	};
	
	this._getReturnPer = function() {
		var returnper = 100;
		for ( var i=0; i<res_pay_act_returns.length; ++i ) {
			var res = res_pay_act_returns[i];
			if ( this.g_.getImgr().getPayAct().payActAllGold < res.allpay ) {
				returnper = res.returnper;
				break;
			}
		}
		return returnper;
	};
	
	this._hasReturn = function() {
		return res_pay_act_returns[res_pay_act_returns.length-1].returnper > 0;
	};
});
