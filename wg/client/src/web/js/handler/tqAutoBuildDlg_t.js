/*******************************************************************************/
require('./tqAutoBuildDlg.js')

TestCaseAutoBuildDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = AutoBuildDlg.snew(this.g);
		this.dlg.openDlg();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getDlgCfg = function(){
		assertEQ ( this.dlg._getDlgCfg(), {modal:false, title:rstr.autobuilddlg.title, pos:{x:"center", y:40}, uicfg:uicfg.inbuild.autobuilddlg} );
	};
	
	this.test_clickStartBtn = function(){
		this.helper_makeCityBuilds();
		this.dlg.openDlg();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.AUTOBUILD, data:{autobuild:{max:2, starting:1, list:[2005]}}});
		this.dlg.items_.canBuildsList.getItem(1).exsubs.addBtn.click();
		this.mm.mock(AutoBuildSender, 'sendStartBuild');
		this.dlg.items_.startBtn.click();
		assertEQ ( this.mm.params['sendStartBuild'], [this.g, [2005, 2001]] );
	};
	
	this.test_startBtnStateAndText = function(){
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.AUTOBUILD, data:{autobuild:{starting:0}}});
		assertEQ ( this.dlg.items_.startBtn.isEnable(), true );
		assertEQ ( this.dlg.items_.startBtn.getText(), rstr.autobuilddlg.btn.start );
		
		this.dlg.hideDlg();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.AUTOBUILD, data:{autobuild:{starting:1}}});
		assertEQ ( this.dlg.items_.startBtn.isEnable(), true );
		assertEQ ( this.dlg.items_.startBtn.getText(), rstr.autobuilddlg.btn.start );
		
		this.dlg.openDlg();
		assertEQ ( this.dlg.items_.startBtn.isEnable(), false );
		assertEQ ( this.dlg.items_.startBtn.getText(), rstr.autobuilddlg.btn.starting );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.AUTOBUILD, data:{autobuild:{starting:0}}});
		assertEQ ( this.dlg.items_.startBtn.isEnable(), true );
		assertEQ ( this.dlg.items_.startBtn.getText(), rstr.autobuilddlg.btn.start );
	};
	
	this.test_udpateNumber = function(){
		this.dlg.openDlg();
		assertEQ ( TQ.getTextEx(this.dlg.items_.number), '0/0' );
		assertEQ ( TQ.getTextEx(this.dlg.items_.desc), HyperLinkMgr.formatLink(rstr.autobuilddlg.lbl.noEnoughVip) );
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.AUTOBUILD, data:{autobuild:{max:10}}});
		assertEQ ( TQ.getTextEx(this.dlg.items_.number), '0/10' );
		assertEQ ( TQ.getTextEx(this.dlg.items_.desc), rstr.autobuilddlg.lbl.canBuildList );
	};
	
	this.test_cityType_fillItems = function(){
		assertEQ ( this.dlg.items_.cityType.getCount(), rstr.autobuilddlg.types.length);
		assertEQ ( this.dlg.items_.cityType.getItemText(0), rstr.autobuilddlg.types[0] );
		assertEQ ( this.dlg.items_.cityType.getItemText(1), rstr.autobuilddlg.types[1] );
		assertEQ ( this.dlg.items_.cityType.getItemText(2), rstr.autobuilddlg.types[2] );
		assertEQ ( this.dlg.items_.cityType.getItemText(3), rstr.autobuilddlg.types[3] );
		assertEQ ( this.dlg.items_.cityType.getItemText(4), rstr.autobuilddlg.types[4] );
		assertEQ ( this.dlg.items_.cityType.getItemText(5), rstr.autobuilddlg.types[5] );
	};
	
	this.test_cityType_firstSel = function(){
		assertEQ ( this.dlg.items_.cityType.getCurSel(), 0 );
		this.dlg.items_.cityType.setCurSel(1);
		assertEQ ( this.dlg.items_.cityType.getCurSel(), 1 );
		this.dlg.openDlg();
		assertEQ ( this.dlg.items_.cityType.getCurSel(), 0 );
	};
	
	this.helper_makeCityBuilds = function(){
		this.g.getImgr().getCityRes().cres = {food:10000,wood:10000,stone:10000,iron:10000,max:10000};
		this.g.getImgr().getBuildsByCityId(1).push({id:1,cid:1,resid:110001,state:0,level:2,itemres:ItemResUtil.findItemres(110001)}); 
		this.g.getImgr().getBuildsByCityId(1).push({id:2,cid:1,resid:110002,state:0,level:1,itemres:ItemResUtil.findItemres(110002)}); // ok
		this.g.getImgr().getBuildsByCityId(1).push({id:3,cid:1,resid:110002,state:1,level:1,itemres:ItemResUtil.findItemres(110002)});
		this.g.getImgr().getBuildsByCityId(1).push({id:4,cid:1,resid:110002,state:0,level:5,itemres:ItemResUtil.findItemres(110002)});
		
		this.g.getImgr().getBuildsByCityId(2).push({id:1,cid:2,resid:110013,state:0,level:1,itemres:ItemResUtil.findItemres(110013)}); // ok
		this.g.getImgr().getBuildsByCityId(2).push({id:2,cid:2,resid:110002,state:0,level:1,itemres:ItemResUtil.findItemres(110002)}); // ok
		this.g.getImgr().getBuildsByCityId(2).push({id:3,cid:2,resid:110002,state:1,level:1,itemres:ItemResUtil.findItemres(110002)});
		this.g.getImgr().getBuildsByCityId(2).push({id:4,cid:2,resid:110002,state:0,level:10,itemres:ItemResUtil.findItemres(110002)});
		this.g.getImgr().getBuildsByCityId(2).push({id:5,cid:2,resid:110002,state:0,level:1,itemres:ItemResUtil.findItemres(110002)}); // exist
	};
	
	this.test_cityType_select = function(){
		this.helper_makeCityBuilds();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.AUTOBUILD, data:{autobuild:{list:[2005]}}});
		
		this.dlg.openDlg();
		assertEQ ( this.dlg.items_.canBuildsList.getCount(), 3 );
		assertEQ ( this.dlg.collectBuilds_[0].id, 2 );
		assertEQ ( this.dlg.collectBuilds_[0].cid, 1 );
		assertEQ ( this.dlg.collectBuilds_[1].id, 1 );
		assertEQ ( this.dlg.collectBuilds_[1].cid, 2 );
		assertEQ ( this.dlg.collectBuilds_[2].id, 2 );
		assertEQ ( this.dlg.collectBuilds_[2].cid, 2 );
		assertEQ ( TQ.getTextEx(this.dlg.items_.canBuildsList.getItem(0).exsubs.name), TQ.format(rstr.autobuilddlg.lbl.buildname, ItemResUtil.findItemres(110002).name, 1) );
		
		this.dlg.items_.cityType.setCurSel(1);
		assertEQ ( this.dlg.items_.canBuildsList.getCount(), 1 );
		
		this.dlg.items_.cityType.setCurSel(2);
		assertEQ ( this.dlg.items_.canBuildsList.getCount(), 2 );
		
		this.dlg.items_.cityType.setCurSel(3);
		assertEQ ( this.dlg.items_.canBuildsList.getCount(), 0 );
	};
	
	this.test_autoBuildsList = function(){
		this.helper_makeCityBuilds();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.AUTOBUILD, data:{autobuild:{list:[2005]}}});
		assertEQ ( this.dlg.items_.autoBuildsList.getCount(), 1 );
		assertEQ ( TQ.getTextEx(this.dlg.items_.autoBuildsList.getItem(0).exsubs.name), TQ.format(rstr.autobuilddlg.lbl.buildname, ItemResUtil.findItemres(110002).name, 1) );
		assertEQ ( TQ.getTextEx(this.dlg.items_.autoBuildsList.getItem(0).exsubs.no), '1' );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.AUTOBUILD, data:{autobuild:{list:[]}}});
		assertEQ ( this.dlg.items_.autoBuildsList.getCount(), 0 );
	};
	
	this.test_addAutoBuild = function(){
		this.helper_makeCityBuilds();
		this.dlg.openDlg();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.AUTOBUILD, data:{autobuild:{max:2, starting:1, list:[2005]}}});
		assertEQ ( this.dlg.items_.canBuildsList.getCount(), 3 );
		assertEQ ( this.dlg.items_.autoBuildsList.getCount(), 1 );
		this.dlg.items_.canBuildsList.getItem(1).exsubs.addBtn.click();
		assertEQ ( this.dlg.items_.canBuildsList.getCount(), 2 );
		assertEQ ( TQ.getTextEx(this.dlg.items_.canBuildsList.getItem(0).exsubs.name), TQ.format(rstr.autobuilddlg.lbl.buildname, ItemResUtil.findItemres(110002).name, 1) );
		assertEQ ( TQ.getTextEx(this.dlg.items_.canBuildsList.getItem(1).exsubs.name), TQ.format(rstr.autobuilddlg.lbl.buildname, ItemResUtil.findItemres(110002).name, 1) );
		
		assertEQ ( this.dlg.items_.autoBuildsList.getCount(), 2 );
		assertEQ ( TQ.getTextEx(this.dlg.items_.autoBuildsList.getItem(0).exsubs.name), TQ.format(rstr.autobuilddlg.lbl.buildname, ItemResUtil.findItemres(110002).name, 1) );
		assertEQ ( TQ.getTextEx(this.dlg.items_.autoBuildsList.getItem(1).exsubs.name), TQ.format(rstr.autobuilddlg.lbl.buildname, ItemResUtil.findItemres(110013).name, 1) );
		
		// enable start button
		assertEQ ( this.dlg.items_.startBtn.isEnable(), true );
		assertEQ ( this.dlg.items_.startBtn.getText(), rstr.autobuilddlg.btn.start );
		
		// number change 
		assertEQ ( TQ.getTextEx(this.dlg.items_.number), '2/2' );
		
		// when select city type, not change auto build list
		this.dlg.items_.cityType.setCurSel(2);
		assertEQ ( this.dlg.items_.canBuildsList.getCount(), 1 );
		assertEQ ( this.dlg.items_.autoBuildsList.getCount(), 2 );
		
		// max auto build count limit
		this.dlg.items_.cityType.setCurSel(0);
		this.dlg.items_.canBuildsList.getItem(0).exsubs.addBtn.click();
		assertEQ ( this.dlg.items_.autoBuildsList.getCount(), 2 );
		assertEQ ( TestCaseSysTip.getSystip(), rstr.autobuilddlg.tip.fullAutoQueue );
	};
	
	this.test_removeAutoBuild = function(){
		this.helper_makeCityBuilds();
		this.dlg.openDlg();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.AUTOBUILD, data:{autobuild:{starting:1, list:[2005]}}});
		assertEQ ( this.dlg.items_.autoBuildsList.getCount(), 1 );
		
		this.dlg.items_.autoBuildsList.getItem(0).exsubs.removeBtn.click();
		assertEQ ( this.dlg.items_.canBuildsList.getCount(), 4 );
		assertEQ ( this.dlg.items_.autoBuildsList.getCount(), 0 );
		
		// enable start button
		assertEQ ( this.dlg.items_.startBtn.isEnable(), true );
		assertEQ ( this.dlg.items_.startBtn.getText(), rstr.autobuilddlg.btn.confirm );
	};
});

tqAutoBuildDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseAutoBuildDlg, 'TestCaseAutoBuildDlg');
};
