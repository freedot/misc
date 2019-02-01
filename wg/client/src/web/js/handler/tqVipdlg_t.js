/*******************************************************************************/
require('./tqVipdlg.js')

TestCaseVipDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		ItemResUtil.findItemres(3000267).desc = 'desc1';
		this.dlg = VipDlg.snew(this.g);
		this.dlg.openDlg();
		this.rolepanel = RoleBasePanel.snew(this.g, MockDomEx.snew('div'));
		
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getDlgCfg = function(){
		assertEQ ( this.dlg._getDlgCfg(), {modal:false, title:rstr.vipdlg.title, pos:{x:"center", y:40}, uicfg:uicfg.vipdlg} );
	};
	
	this.test_vipLevelNumber = function(){
		assertEQ ( isInclude(IMG.getBKImage(this.dlg.items_.vipLevel), 'vip/ui/0.png' ), true );
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:{res:{vip:4}}});
		assertEQ ( isInclude(IMG.getBKImage(this.dlg.items_.vipLevel), 'vip/ui/4.png' ), true );
		
		this.dlg.hideDlg();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:{res:{vip:5}}});
		assertEQ ( isInclude(IMG.getBKImage(this.dlg.items_.vipLevel), 'vip/ui/4.png' ), true, 'not update when dlg hide' );
	};
	
	this.test_vipProg = function(){
		var progbarLen = 455;
		assertEQ ( TQ.getCSS(this.dlg.items_.vipProg, 'width'), '0px' );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:{res:{vip:0}}});
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.PAYGOLD, data:{paygold:199}});
		assertEQ ( TQ.getCSS(this.dlg.items_.vipProg, 'width'), Math.round(progbarLen*199/200) + 'px' );
		assertEQ ( TQ.getTextEx(this.dlg.items_.payGold), '199/200' );
		assertEQ ( TQ.getTextEx(this.dlg.items_.vipProgDesc), TQ.format(rstr.vipdlg.progDesc, 1, 1) );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:{res:{vip:1}}});
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.PAYGOLD, data:{paygold:300}});
		assertEQ ( TQ.getCSS(this.dlg.items_.vipProg, 'width'), Math.round(progbarLen*(300-200)/(500-200)) + 'px' );
		assertEQ ( TQ.getTextEx(this.dlg.items_.payGold), '100/300' );
		assertEQ ( TQ.getTextEx(this.dlg.items_.vipProgDesc), TQ.format(rstr.vipdlg.progDesc, 200, 2) );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:{res:{vip:12}}});
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.PAYGOLD, data:{paygold:900000}});
		assertEQ ( TQ.getCSS(this.dlg.items_.vipProg, 'width'), Math.round(progbarLen*50000/50000) + 'px' );
		assertEQ ( TQ.getTextEx(this.dlg.items_.payGold), '50000/50000' );
		assertEQ ( TQ.getTextEx(this.dlg.items_.vipProgDesc), TQ.format(rstr.vipdlg.maxProgDesc, 12) );
	};
	
	this.test_curLevelSelBlock = function(){
		var orgin_left = 196;
		var totalLen = 634;
		assertEQ ( TQ.getCSS(this.dlg.items_.curLevel, 'display'), 'none' );
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:{res:{vip:5}}});
		assertEQ ( TQ.getCSS(this.dlg.items_.curLevel, 'display'), 'block' );
		assertEQ ( TQ.getCSS(this.dlg.items_.curLevel, 'left'), (orgin_left + Math.round(totalLen*(5-1)/12)) + 'px' );
	};
	
	this.test_clickPayBtn = function(){
		this.mm.mock(JMISC, 'openPayWnd');
		this.dlg.items_.payBtn.click();
		assertEQ ( this.mm.walkLog, 'openPayWnd' );
	};
	
	this.test_setItem = function(){
		assertEQ ( this.dlg.items_.effectList.getCount(), res_vip.length - 1 );
		var item0 = this.dlg.items_.effectList.getItem(0+1);
		assertEQ ( TQ.getTextEx(item0.exsubs.name), res_vip[1+1].name );
		assertEQ ( TQ.getClass(item0.exsubs.level1), 'yesflag' );
		assertEQ ( TQ.getClass(item0.exsubs.level2), 'yesflag' );
		
		var item1 = this.dlg.items_.effectList.getItem(1+1);
		assertEQ ( TQ.getTextEx(item1.exsubs.name), res_vip[1+1+1].name );
		assertEQ ( TQ.getClass(item1.exsubs.level1), 'yesflag' );
		
		var item3 = this.dlg.items_.effectList.getItem(3+1);
		assertEQ ( TQ.getTextEx(item3.exsubs.name), res_vip[3+1+1].name );
		assertEQ ( TQ.getTextEx(item3.exsubs.level1), TQ.format(res_vip[3+1+1].unit, res_vip[3+1+1].effs[1]) );
		
		var item7 = this.dlg.items_.effectList.getItem(7+1);
		assertEQ ( TQ.getTextEx(item7.exsubs.name), res_vip[7+1+1].name );
		assertEQ ( TQ.getClass(item7.exsubs.level1), 'noflag' );
		assertEQ ( TQ.getClass(item7.exsubs.level2), 'yesflag' );
		
		var item19 = this.dlg.items_.effectList.getItem(19+1);
		assertEQ ( TQ.getClass(item19.exsubs.level1), 'noflag' );
		assertEQ ( TQ.getTextEx(item19.exsubs.level7), rstr.vipdlg.steelNames[1] );
		assertEQ ( TQ.getTextEx(item19.exsubs.level10), rstr.vipdlg.steelNames[2] );
		
		var item20 = this.dlg.items_.effectList.getItem(0);
		assertEQ ( TQ.getTextEx(item20.exsubs.level1), TQ.format(rstr.vipdlg.itemName, 1) );
		assertEQ ( TQ.getTextEx(item20.exsubs.level2), TQ.format(rstr.vipdlg.itemName, 2) );
	};
	
	this.test_itemTip = function(){
		var item1 = this.dlg.items_.effectList.getItem(1);
		var tip = TTIP.getTipById(item1.exsubs.tooltips['$level1']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), '' );
		
		var item0 = this.dlg.items_.effectList.getItem(0);
		var tip = TTIP.getTipById(item0.exsubs.tooltips['$level1']);
		var item = {id:0, resid:3000267, itemres:ItemResUtil.findItemres(3000267) };
		tip.getTip(); assertEQ ( tip.getTipMsg(), TIPM.getItemDesc(item, 'sys') );
	};
});

tqVipdlg_t_main = function(suite) {
	suite.addTestCase(TestCaseVipDlg, 'TestCaseVipDlg');
};
