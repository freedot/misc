/*******************************************************************************/
require('./tqNewcomerHelper.js')

TestCaseNewcomerHelper = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = NewcomerHelper.snew(this.g);
		this.dlg.openDlg();
		this.items = this.dlg.items_;
			
		res_newhelp_tasks = [
			{id:120001, name:'name1', desc:"desc120001", helpimg:1001}
			,{id:120002, name:'name2', desc:"desc120002", helpimg:0}
			,{id:120003, name:'name3', desc:"desc120003"}
			];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_setPositionForDlgPosition = function(){
		this.dlg.setPosition({x:1000, y:2000});
		assertEQ ( this.dlg.dlg_.getPosition(), {x:1000+this.dlg.C_BTN_W_-this.dlg.C_DLG_W_, y:2000+this.dlg.C_BTN_H_-this.dlg.C_DLG_H_} );
			
		this.dlg.hideDlg();
		this.dlg.setPosition({x:10000, y:20000});
		assertEQ ( this.dlg.dlg_.getPosition(), {x:1000+this.dlg.C_BTN_W_-this.dlg.C_DLG_W_, y:2000+this.dlg.C_BTN_H_-this.dlg.C_DLG_H_}, 'when dlg hide, not reset' );
	};	
	
	this.test_setPositionForSpiritDom = function(){
		this.dlg.setPosition({x:1000, y:2000});
		assertEQ ( TQ.getDomRect(this.items.spiritDom), {l:1000, t:2000, w:this.dlg.C_BTN_W_, h:this.dlg.C_BTN_H_});
		
		this.items.spiritDom = null;
		this.dlg.setPosition({x:1000, y:2000});
	};
	
	this.test_openDlgResetPosition = function(){
		this.dlg.hideDlg();
		this.dlg.setPosition({x:1000, y:2000});
		assertNotEQ ( this.dlg.dlg_.getPosition(), {x:1000+this.dlg.C_BTN_W_-this.dlg.C_DLG_W_, y:2000+this.dlg.C_BTN_H_-this.dlg.C_DLG_H_} );
		this.dlg.openDlg();
		assertEQ ( this.dlg.dlg_.getPosition(), {x:1000+this.dlg.C_BTN_W_-this.dlg.C_DLG_W_, y:2000+this.dlg.C_BTN_H_-this.dlg.C_DLG_H_} );
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, pos:{x:"center", y:0}, uiback:uiback.dlg.noborder, uicfg:uicfg.help.NewcomerHelper};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this._test_fixBakPng = function(){
		this.mm.mock(TQ, 'fixIE6Png');
		this.dlg = NewcomerHelper.snew(this.g);
		this.dlg.openDlg();
		assertEQ ( this.mm.params['fixIE6Png.0'], [this.items.bak] );
		assertEQ ( this.mm.params['fixIE6Png.1'], [this.items.subbak] );
		
		this.mm.clear();
		this.dlg.openDlg();
		assertEQ ( this.mm.walkLog, '', 'only one time' );
	};
	
	this.test_createSpiritBtn = function(){
		this.dlg = NewcomerHelper.snew(this.g);
		this.items = this.dlg.items_;
		assertEQ ( this.items.spiritDom.parentNode, TQ.getUiBody() );
		assertEQ ( TQ.getCSS(this.items.spiritDom, 'position'), 'absolute' );
		assertEQ ( TQ.getCSS(this.items.spiritDom, 'zIndex'), '1000' );
		assertEQ ( TQ.getDomRect(this.items.spiritDom), { l: this.dlg.C_MINBTN_RT_[0], t: this.dlg.C_MINBTN_RT_[1], w: this.dlg.C_MINBTN_RT_[2], h: this.dlg.C_MINBTN_RT_[3] });
		assertEQ ( this.items.spiritBtn.getParent(), this.items.spiritDom );
		assertEQ ( this.items.spiritBtn.getUIBack(), uiback.btn.helpspirit );
	};
	
	this.test_clickSpiritBtn = function(){
		this.dlg = NewcomerHelper.snew(this.g);
		this.items = this.dlg.items_;
		this.items.spiritBtn.click();
		assertEQ ( this.dlg.isShow(), true );
	};
	
	this.test_clickCloseBtn = function(){
		assertEQ ( this.dlg.isShow(), true );
		this.items.closeBtn.click();
		assertEQ ( this.dlg.isShow(), false );
	};
	
	this.test_openDlgNeedHideSpiritBtn = function(){
		this.items.spiritBtn.show();
		assertEQ ( this.items.spiritBtn.isShow(), true );
		this.dlg.openDlg();
		assertEQ ( this.items.spiritBtn.isShow(), false );
	};
	
	this.test_hideDlgNeedShowSpiritBtn = function(){
		this.items.spiritBtn.hide();
		assertEQ ( this.items.spiritBtn.isShow(), false );
		this.dlg.hideDlg();
		assertEQ ( this.items.spiritBtn.isShow(), true );
	};
	
	this.test_loginOkSendGetCurNode = function(){
		this.mm.mock(NewcomerHelpSender, 'sendGetCurNode');
		this.g.sendEvent({eid:EVT.LOGIN_OK, sid:0});
		assertEQ ( this.mm.params['sendGetCurNode'], [this.g] );
	};
	
	this.test__onSvrPkg = function(){
		this.dlg = NewcomerHelper.snew(this.g);
		this.g.setState(GSTATE.INGAME);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.NEWCOMERHELP, data:{newhelp:{id:120001}}});
		assertEQ ( this.dlg.isShow(), false );
		var link = TQ.format(rstr.newcomerHelp.imgLink, 1001);
		var nativeLink = HyperLinkMgr.formatLink(link);
		assertEQ ( TQ.getTextEx(this.items.con), 'desc120001' + nativeLink);
		
		this.dlg.openDlg();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.NEWCOMERHELP, data:{newhelp:{id:120002}}});
		assertEQ ( TQ.getTextEx(this.items.con), 'desc120002');
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.NEWCOMERHELP, data:{newhelp:{id:120003}}});
		assertEQ ( TQ.getTextEx(this.items.con), 'desc120003');
	};
	
	this.test__onSvrPkg_randtip = function(){
		this.mm.mock(Math, 'randomInt', [2] );
		res_tip_helps = [{id:1, desc:'tip1'},{id:2, desc:'tip2'},{id:3, desc:'tip3'}];
		this.g.setState(GSTATE.INGAME);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.NEWCOMERHELP, data:{newhelp:{id:0}}});
		assertEQ ( this.dlg.isShow(), true );
		assertEQ ( this.dlg.getCurId(), 0);
		assertEQ ( this.mm.params['randomInt'], [3] );
		var btnS = '<div class=changetipbtn id=new_comer_helper_tip>' + rstr.newcomerHelp.btn.everydayTip + '</div>';
		assertEQ ( TQ.getTextEx(this.items.con), rstr.newcomerHelp.lbl.everydayTip + 'tip3' + btnS);
	};
	
	this.test_clickSeeAllHelp = function(){
		this.mm.mock(UIM.getDlg('help'), 'openDlg' );
		this.items.seeAllHelp.click();
		assertEQ ( this.mm.walkLog, 'openDlg' );
	};
});

tqNewcomerHelper_t_main = function(suite) {
	suite.addTestCase(TestCaseNewcomerHelper, 'TestCaseNewcomerHelper');
};
