/*******************************************************************************/
require('./tqWorldBossAlliGiftDlg.js')

TestCaseWorldBossAlliGiftDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = WorldBossAlliGiftDlg.snew(this.g);
		this.dlg.openDlg();
		this.items = this.dlg.getItems();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, title:rstr.worldboss.allidropgiftdlg.title, pos:{x:"center", y:40}, uicfg:uicfg.worldboss.allidropgiftdlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this.test_sendGetInfoWhenOpen = function(){
		this.mm.mock(WorldBossrSender, 'sendGetAlliGiftInfo');
		assertEQ ( this.dlg.openDlg() );
		assertEQ ( this.mm.params['sendGetAlliGiftInfo'], [this.g] );
	};
	
	this.test_dropsCon = function(){
		var cmd = {alligifts:[{alli:'alli1',drops:[{id:FIXID.SALVE,num:2},{id:FIXID.TIANGONGTU,num:3}]},{alli:'alli2',drops:[{id:FIXID.CLEARFORCARD,num:1}]}]};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.WORLDBOSS, data:cmd});
		var s = '';
		s += TQ.format(rstr.worldboss.allidropgiftdlg.lbl.alliName, 'alli1') + '<br/>';
		var res = ItemResUtil.findItemres(FIXID.SALVE);
		var name = ItemNameColorGetter.getColorVal(res.level, res.name);
		s += TQ.format(rstr.worldboss.allidropgiftdlg.lbl.dropItem, name, 2) + '<br/>';
		res = ItemResUtil.findItemres(FIXID.TIANGONGTU);
		name = ItemNameColorGetter.getColorVal(res.level, res.name);
		s += TQ.format(rstr.worldboss.allidropgiftdlg.lbl.dropItem, name, 3) + '<br/>';
		
		s += TQ.format(rstr.worldboss.allidropgiftdlg.lbl.alliName, 'alli2') + '<br/>';
		res = ItemResUtil.findItemres(FIXID.CLEARFORCARD);
		name = ItemNameColorGetter.getColorVal(res.level, res.name);
		s += TQ.format(rstr.worldboss.allidropgiftdlg.lbl.dropItem, name, 1) + '<br/>';
		
		assertEQ ( TQ.getTextEx(this.items.dropsCon.getContainerObj()), s);
	};
});

tqWorldBossAlliGiftDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseWorldBossAlliGiftDlg, 'TestCaseWorldBossAlliGiftDlg');
};
