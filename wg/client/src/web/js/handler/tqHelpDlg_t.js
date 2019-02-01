require('./tqHelpDlg.js');

TestCaseHelpDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		
		res_helps={
			catalog:[
				{
					name:'新手指引',
					id:1,
					catalog:[{name:'n1', res:{desc:'d1', helpimg:1} },{name:'n2', res:{desc:'d2' } }]
				}
			]
		};

		this.dlg = HelpDlg.snew(this.g);
		this.dlg.openDlg();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, pos:{x:"center", y:30}, title:rstr.help.helpdlg.title, uicfg:uicfg.help.helpdlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this.test_fillHelpTree = function(){
		var root = this.dlg.items_.helptree.getRoot();
		var newcomerHelp = this.dlg.items_.helptree.getItemFirstChild(root);
		assertEQ ( this.dlg.items_.helptree.getItemText(newcomerHelp), '新手指引' );
		var items = this.dlg.items_.helptree.getItemChildren(newcomerHelp);
		assertEQ ( items.length, 2 );
		assertEQ ( items[0].userdata, {desc:'d1', helpimg:1} );
		assertEQ ( items[1].userdata, {desc:'d2'} );
		assertEQ ( this.dlg.items_.helptree.getItemText(items[0]), 'n1' );
		assertEQ ( this.dlg.items_.helptree.getItemText(items[1]), 'n2' );
	};
	
	this.test_selectFirstItemWhenOpen = function(){
		var root = this.dlg.items_.helptree.getRoot();
		var newcomerHelp = this.dlg.items_.helptree.getItemFirstChild(root);
		assertEQ ( this.dlg.items_.helptree.getCurSel(), this.dlg.items_.helptree.getItemFirstChild(newcomerHelp));
		assertEQ ( this.dlg.items_.helptree.getScroller().getScrollPos(), 0 );
	};
	
	this.test_helpContent = function(){
		var root = this.dlg.items_.helptree.getRoot();
		var newcomerHelp = this.dlg.items_.helptree.getItemFirstChild(root);
		var items = this.dlg.items_.helptree.getItemChildren(newcomerHelp);
		
		var nativeLink = ' ';
		var link = TQ.format(rstr.newcomerHelp.imgLink, 1);
		nativeLink += HyperLinkMgr.formatLink(link);
		assertEQ ( TQ.getTextEx(this.dlg.items_.helpcon.getContainerObj()), 'd1' + nativeLink);
		this.dlg.items_.helptree.setCurSel(newcomerHelp);
		assertEQ ( TQ.getTextEx(this.dlg.items_.helpcon.getContainerObj()), 'd1' + nativeLink);
		
		this.dlg.items_.helptree.setCurSel(items[1]);
		assertEQ ( TQ.getTextEx(this.dlg.items_.helpcon.getContainerObj()), 'd2 ');
	};
});	

tqHelpDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseHelpDlg, 'TestCaseHelpDlg');
};

