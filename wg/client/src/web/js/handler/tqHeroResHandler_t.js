//
requireEx('./handler/tqHeroResHandler.js', [
	{
		start:'//RecruitHeroDlg-unittest-start'
		,end:'//RecruitHeroDlg-unittest-end'
		,items:[
			'm_g'
			,'m_this'
			,'m_dlg'
			,'m_heros'
			,'m_items'
			,'_onGetNatureFactorTooltip'
			,'_refreshHerosFromSvr'
			,'_setHeroList'
		]
	}
]);

TestCaseRecruitHeroDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = new RecruitHeroDlg(this.g);
		this.dlg.openDlg();
		this.lc = this.dlg.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__onGetNatureFactorTooltip = function(){
		this.lc().m_heros = [{id:1}];
		this.mm.mock(TIPM, 'getNewHeroNatureFactorDesc', ['desc']);
		assertEQ ( this.lc()._onGetNatureFactorTooltip({idx:0}), 'desc' );
		assertEQ ( this.mm.params['getNewHeroNatureFactorDesc'], [{id:1}] );
	};
	
	this.test__onClickRefresh = function(){
		this.mm.mock(this.lc(), '_refreshHerosFromSvr');
		this.lc().m_heros = [{id:1, prof:1, attrs:{}},{id:2, prof:1, attrs:{}}];
		this.lc().m_heros[0].attrs[ATTR.NST] = {val:100};
		this.lc().m_heros[0].attrs[ATTR.NPH] = {val:100};
		this.lc().m_heros[0].attrs[ATTR.NAG] = {val:100};
		this.lc().m_heros[1].attrs[ATTR.NST] = {val:110};
		this.lc().m_heros[1].attrs[ATTR.NPH] = {val:110};
		this.lc().m_heros[1].attrs[ATTR.NAG] = {val:110};
		
		this.lc().m_items.refreshbtn.click();
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.recruitherodlg.useitemrefresh );
		
		this.lc().m_heros[1].attrs[ATTR.NST] = {val:145};
		this.lc().m_heros[1].attrs[ATTR.NPH] = {val:145};
		this.lc().m_heros[1].attrs[ATTR.NAG] = {val:145};
			
		this.lc().m_items.refreshbtn.click();
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), rstr.recruitherodlg.useitemrefreshex );
		
		this.g.getGUI().hideMsgBox();
		this.g.getGUI().msgBoxClick(MB_IDNO);
		assertEQ ( this.g.getGUI().isShowMsgBox(), false);
		assertEQ ( this.mm.walkLog, '' );
		
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.g.getGUI().isShowMsgBox(), true);
		assertEQ ( this.g.getGUI().getMsgBoxMsg(), HyperLinkMgr.formatLink(rstr.recruitherodlg.norefresh) );
		assertEQ ( this.mm.walkLog, '' );
		
		TestCaseCondition.setPreCond(null, {item:{id:FIXID.REFRESHCARD,num:1}});
		this.lc().m_items.refreshbtn.click();
		this.g.getGUI().msgBoxClick(MB_IDYES);
		assertEQ ( this.mm.walkLog, '_refreshHerosFromSvr' );
	};
	
	this.test__setListItemWhenMaxNVAL = function(){
		this.lc().m_heros = [{id:1, prof:1, attrs:{}},{id:2, prof:1, attrs:{}},{id:3, prof:1, attrs:{}}];
		this.lc().m_heros[0].attrs[ATTR.NST] = {val:100};
		this.lc().m_heros[0].attrs[ATTR.NPH] = {val:100};
		this.lc().m_heros[0].attrs[ATTR.NAG] = {val:100};
		this.lc().m_heros[1].attrs[ATTR.NST] = {val:145};
		this.lc().m_heros[1].attrs[ATTR.NPH] = {val:145};
		this.lc().m_heros[1].attrs[ATTR.NAG] = {val:145};		
		this.lc().m_heros[2].attrs[ATTR.NST] = {val:145};
		this.lc().m_heros[2].attrs[ATTR.NPH] = {val:145};
		this.lc().m_heros[2].attrs[ATTR.NAG] = {val:145};
		
		this.lc()._setHeroList(this.lc().m_heros);
		assertEQ ( TQ.getClass(this.lc().m_items.list.getItem(0).exsubs.naturefactorbak), '');
		assertEQ ( TQ.getCSS(this.lc().m_items.list.getItem(0).exsubs.naturefactorbak, 'display'), 'none' );
		assertEQ ( TQ.getClass(this.lc().m_items.list.getItem(1).exsubs.naturefactorbak), 'maxnvalback');
		assertEQ ( TQ.getCSS(this.lc().m_items.list.getItem(1).exsubs.naturefactorbak, 'display'), 'block' );
		assertEQ ( TQ.getClass(this.lc().m_items.list.getItem(2).exsubs.naturefactorbak), 'maxnvalback');
		assertEQ ( TQ.getCSS(this.lc().m_items.list.getItem(2).exsubs.naturefactorbak, 'display'), 'block' );
		assertEQ ( TQ.getClass(this.lc().m_items.list.getItem(3).exsubs.naturefactorbak), '');
		assertEQ ( TQ.getCSS(this.lc().m_items.list.getItem(3).exsubs.naturefactorbak, 'display'), 'none' );
		assertEQ ( TQ.getClass(this.lc().m_items.list.getItem(4).exsubs.naturefactorbak), '');
		assertEQ ( TQ.getClass(this.lc().m_items.list.getItem(5).exsubs.naturefactorbak), '');
		
		this.lc().m_heros = [{id:1, prof:1, attrs:{}},{id:2, prof:1, attrs:{}}];
		this.lc().m_heros[0].attrs[ATTR.NST] = {val:145};
		this.lc().m_heros[0].attrs[ATTR.NPH] = {val:145};
		this.lc().m_heros[0].attrs[ATTR.NAG] = {val:145};
		this.lc().m_heros[1].attrs[ATTR.NST] = {val:100};
		this.lc().m_heros[1].attrs[ATTR.NPH] = {val:100};
		this.lc().m_heros[1].attrs[ATTR.NAG] = {val:100};		
		
		this.lc()._setHeroList(this.lc().m_heros);
		assertEQ ( TQ.getClass(this.lc().m_items.list.getItem(0).exsubs.naturefactorbak), 'maxnvalback');
		assertEQ ( TQ.getCSS(this.lc().m_items.list.getItem(0).exsubs.naturefactorbak, 'display'), 'block' );
		assertEQ ( TQ.getClass(this.lc().m_items.list.getItem(1).exsubs.naturefactorbak), '');
		assertEQ ( TQ.getCSS(this.lc().m_items.list.getItem(1).exsubs.naturefactorbak, 'display'), 'none' );
		assertEQ ( TQ.getClass(this.lc().m_items.list.getItem(2).exsubs.naturefactorbak), '');
		assertEQ ( TQ.getCSS(this.lc().m_items.list.getItem(2).exsubs.naturefactorbak, 'display'), 'none' );
		assertEQ ( TQ.getClass(this.lc().m_items.list.getItem(3).exsubs.naturefactorbak), '');
		assertEQ ( TQ.getClass(this.lc().m_items.list.getItem(4).exsubs.naturefactorbak), '');
		assertEQ ( TQ.getClass(this.lc().m_items.list.getItem(5).exsubs.naturefactorbak), '');
	};
});

tqHeroResHandler_t_main = function(suite) {
	suite.addTestCase(TestCaseRecruitHeroDlg, 'TestCaseRecruitHeroDlg');
};