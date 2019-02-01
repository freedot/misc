/*******************************************************************************/
var UserReg = JClass.ex({
	_init : function(params){
		this._seq = 0;
		this._params = params;
		this._doms = this._params.doms;
		this._ajax = JAjax.snew(this._params.url);
		this._ajax.setCaller(Caller.snew(this, this._onServerData));
		this._validUser = false;
		this._validPsw = false;
		this._validRepeatPsw = false;
		this._validEmail = true;
		this._firstInit();
	}
	
	,_onServerData : function(msg){
		var m = eval('(' + msg + ')');
		if (m.isbind == 1 ) { // bind ok
			this._handleRegBindMsg(m);
		} else {
			this._handleCheckUserMsg(m);
		}
	}
	
	,_handleRegBindMsg : function(m){
		if (m.ret == 0) {
			this._params.dlg.hideDlg();
			UIM.getPanel('main').hideGuestBindBtn();
			this._params.g.getGUI().msgBox(rstr.comm.msgts, m.msg, MB_F_CLOSE, null);
		} else {
			this._params.g.getGUI().msgBox(rstr.comm.msgts, m.msg, MB_F_CLOSE, null);
		}
	}
	
	,_handleCheckUserMsg : function(m){
		TQ.setRichText(this._doms.regUsernameResult, m.msg);
		this._validUser = (m.ret == 0);
	}
	
	,_firstInit : function(){
		var this_l = this;
		TQ.addEvent(this._doms.regUsername, 'blur', function(event){
			this_l.checkUserName();
		});
		TQ.addEvent(this._doms.regPassword, 'blur', function(event){
			this_l.checkRegPassword();
		});
		TQ.addEvent(this._doms.repeatRegPassword, 'blur', function(event){
			this_l.checkRepeatRegPassword();
		});
		TQ.addEvent(this._doms.regEmail, 'blur', function(event){
			this_l.checkRegEmail();
		});
		
		this._doms.regPassword.type = 'password';
		this._doms.repeatRegPassword.type = 'password';
		
		this._addUserNameInputEvent();
		TQ.setRichText(this._doms.regUsernameResult,  rstr.bindGuestDlg.tip.please_input);
		TQ.setRichText(this._doms.regPasswordResult,  rstr.bindGuestDlg.tip.please_input);
		TQ.setRichText(this._doms.repeatRegPasswordResult,  rstr.bindGuestDlg.tip.please_input);
		
		this._hideUserNameInValidTip();
	}
	
	,checkUserName : function(){
		var name = this._doms.regUsername.value;
		this._ajax.asyncSend('act=checkuser&user=' + name + '&seq=' + (this._seq++));
	}
	
	,checkRegPassword : function(){
		var psw = this._doms.regPassword.value;
		if (psw == '') {
			TQ.setRichText(this._doms.regPasswordResult, rstr.bindGuestDlg.tip.psw_empty);
			this._validPsw = false;
		} else if (this._isValidPassword(psw)){
			TQ.setRichText(this._doms.regPasswordResult, rstr.bindGuestDlg.tip.input_ok);
			this._validPsw = true;
		} else {
			TQ.setRichText(this._doms.regPasswordResult, rstr.bindGuestDlg.tip.psw_tooshort);
			this._validPsw = false;
		}
	}
	
	,checkRepeatRegPassword : function(){
		var psw = this._doms.regPassword.value;
		var repeatPsw = this._doms.repeatRegPassword.value;
		if ( repeatPsw == '' ) {
			TQ.setRichText(this._doms.repeatRegPasswordResult, rstr.bindGuestDlg.tip.psw_empty);
			this._validRepeatPsw = false;
		} else if ( psw != repeatPsw){
			TQ.setRichText(this._doms.repeatRegPasswordResult, rstr.bindGuestDlg.tip.not_same);
			this._validRepeatPsw = false;
		} else if ( !this._isValidPassword(repeatPsw) ) {
			TQ.setRichText(this._doms.repeatRegPasswordResult, rstr.bindGuestDlg.tip.psw_tooshort);
			this._validRepeatPsw = false;
		} else {
			TQ.setRichText(this._doms.repeatRegPasswordResult, rstr.bindGuestDlg.tip.input_ok);
			this._validRepeatPsw = true;
		}
	}
	
	,checkRegEmail : function(){
		var email = this._doms.regEmail.value;
		if ( email == '') {
			TQ.setRichText(this._doms.regEmailResult, '');
			this._validEmail = true;
		} else if (this._isValidEmail(email) ){
			TQ.setRichText(this._doms.regEmailResult, rstr.bindGuestDlg.tip.input_ok);
			this._validEmail = true;
		} else {
			TQ.setRichText(this._doms.regEmailResult, rstr.bindGuestDlg.tip.email_error);
			this._validEmail = false;
		}
	}
	
	,submit : function(){
		if ( !this._validUser ) {
			this._doms.regUsername.focus();
		} else if (!this._validPsw) {
			this._doms.regPassword.focus();
		} else if (!this._validRepeatPsw) {
			this._doms.repeatRegPassword.focus();
		} else if (!this._validEmail) {
			this._doms.regEmail.focus();
		} else {
			var name = this._doms.regUsername.value;
			var psw = this._doms.regPassword.value;
			this._ajax.asyncSend('act=regbind&user=' + name + '&psw=' + psw + '&guestuser=' + this._params.guestuser + '&guestsign=' + this._params.guestsign + '&serverid=' + this._params.serverid + '&seq=' + (this._seq++));
		}
	}
	
	,_isValidPassword : function(psw){
		if ( psw == '' ) return false;
		return psw.length >= 6;
	}
	
	,_isValidEmail : function(email){
		var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,7}$/;
		return reg.test(email);
	}

	,_addUserNameInputEvent : function(){
		var this_l = this;
		var userName = this._doms.regUsername;
		TQ.addEvent(userName, 'keypress', function(event){
			event = event ? event : window.event;
			var keyCode = TQ.getKeyCode(event);
			var isNumber = ( keyCode >= 48 && keyCode <= 57 );
			var isChar = (keyCode >= 97 && keyCode <= 122) || (keyCode >= 65 && keyCode <= 90);
			var isOtherChar = (keyCode == 95); // _
			var isValid = isNumber || isChar || isOtherChar;
			if( !isValid ) {
				TQ.preventDefault(event);
				this_l._showUserNameInValidTip();
			} else {
				this_l._hideUserNameInValidTip();
			}
		});
		TQ.addEvent(userName, 'keyup', function(event){
			if ( userName.value.match(/[^\w\.\/]/ig) ) {
				userName.value = userName.value.replace(/[^\w\.\/]/ig,'');
				this_l._showUserNameInValidTip();
			}
		});
	}
	
	,_showUserNameInValidTip : function(){
		var tip = this._doms.regUsernameValidTip;
		TQ.setRichText(this._doms.regUsernameValidTipCon, rstr.bindGuestDlg.tip.invalid_username_char);
		TQ.showElem(tip);
		setTimeout(function(){
			TQ.hideElem(tip);
		}, 1500);
	}
	
	,_hideUserNameInValidTip : function(){
		TQ.hideElem(this._doms.regUsernameValidTip);
	}
});


var BindGuestRegTabPanel = JClass.ex({
	_init : function(g, dlg, items){
		this._dlg = dlg;
		this._regHandler = UserReg.snew({url:'./plat/reg.py', doms:{
			regUsernameResult : items.usernameResult
			,regPasswordResult : items.passwordResult
			,repeatRegPasswordResult : items.repeatPasswordResult
			,regUsername : items.username
			,regPassword : items.password
			,repeatRegPassword : items.repeatPassword
			,regEmail : items.email
			,regEmailResult : items.emailResult
			,formReg : null
			,regUsernameValidTip : items.regUsernameValidTip
			,regUsernameValidTipCon : items.regUsernameValidTipCon}, dlg:dlg, g:g, guestuser:g_guestuser, guestsign:g_guestsign, serverid:g_serverid});
		
		items.confirm.setCaller({self:this, caller:this._onClickComfirm});
		items.cancel.setCaller({self:this, caller:this._onClickCancel});
	}
	
	,_onClickComfirm:function(){
		this._regHandler.submit();
	}
	
	,_onClickCancel:function(){
		this._dlg.hideDlg();
	}
});

var BindGuestLoginTabPanel = JClass.ex({
	_init : function(g, dlg, items){
		this._g = g;
		this._dlg = dlg;
		this._items = items;
		this._seq = 1;
		this._ajax = JAjax.snew('./plat/login.py');
		this._ajax.setCaller(Caller.snew(this, this._onServerData));
		
		this._items.password.type = 'password';
		
		items.confirm.setCaller({self:this, caller:this._onClickComfirm});
		items.cancel.setCaller({self:this, caller:this._onClickCancel});
	}
	
	,_onServerData : function(msg){
		var m = eval('(' + msg + ')');
		if (m.ret == 0) {
			this._dlg.hideDlg();
			UIM.getPanel('main').hideGuestBindBtn();
			this._g.getGUI().msgBox(rstr.comm.msgts, m.msg, MB_F_CLOSE, null);
		} else {
			this._g.getGUI().msgBox(rstr.comm.msgts, m.msg, MB_F_CLOSE, null);
		}
	}
	
	,_onClickComfirm : function(){
		var name = this._items.username.value;
		var psw = this._items.password.value;
		this._ajax.asyncSend('act=loginbind&user=' + name + '&psw=' + psw + '&guestuser=' + g_guestuser + '&guestsign=' + g_guestsign + '&serverid=' + g_serverid + '&seq=' + (this._seq++));
	}
	
	,_onClickCancel : function(){
		this._dlg.hideDlg();
	}
});

BindGuestDlg = JBaseDlg.ex({
	_getDlgCfg : function(){
		return {modal:true, pos:{x:"center", y:40}, title:rstr.bindGuestDlg.title, uicfg:uicfg.bindGuestDlg};
	}
	
	,_afterCreate : function(){
		this._setTabTexts();
		this._createPanels();
	}
	
	,_setTabTexts : function(){
		for ( var i=0; i<rstr.bindGuestDlg.tabs.length; ++i ) {
			this.getItems().tabs.setTabText(i, rstr.bindGuestDlg.tabs[i]);
		}
	}
	
	,_createPanels : function(){
		this._panels = {};
		this._panels['reg'] = BindGuestRegTabPanel.snew(this.g_, this, this.getItems().tabs.getTabItems(0));
		this._panels['login'] = BindGuestLoginTabPanel.snew(this.g_, this, this.getItems().tabs.getTabItems(1));
	}
	
	,_initInfo : function(){
		this.getItems().tabs.activeTab(0);
	}
});
