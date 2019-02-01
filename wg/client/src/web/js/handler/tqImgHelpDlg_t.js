/*******************************************************************************/
require('./tqImgHelpDlg.js')

TestCaseImgHelpDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = ImgHelpDlg.snew(this.g);
		this.dlg.openDlg(1001);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.getRightSpace = function(){
		return 175;
	};
	
	this.test_resize = function(){
		this.mm.mock(this.dlg.dlg_, 'refreshBack');
		var size = {cx:400, cy:500};
		this.dlg.resize(size);
		
		var condom = this.dlg.dlg_.getConDom();
		assertEQ ( TQ.getDomSize(condom.parentNode), size );
		assertEQ ( TQ.getDomSize(condom), size );
		assertEQ ( TQ.getDomSize(condom.firstChild), size );
		assertEQ ( TQ.getDomSize(this.dlg.items_.img), size );
		assertEQ ( this.mm.params['refreshBack'], [] );
		
		assertEQ ( TQ.getCSS(this.dlg.items_.btnArea, 'left'), (size.cx - this.getRightSpace()) + 'px' );
		
		this.dlg.hideDlg();
		var size2 = {cx:4000, cy:5000};
		this.dlg.resize(size2);
		assertEQ ( TQ.getDomSize(condom), size );
		assertEQ ( TQ.getCSS(this.dlg.items_.btnArea, 'left'), (size.cx - this.getRightSpace()) + 'px' );		
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:true, pos:{x:0, y:0}, uiback:uiback.dlg.noborder2, uicfg:uicfg.ImgHelpDlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this.test_clickCloseBtn = function(){
		assertEQ ( this.dlg.isShow(), true );
		this.dlg.items_.closeBtn.click();
		assertEQ ( this.dlg.isShow(), false );
	};
	
	this.test_openDlgShowImg = function(){
		this.g.setCurTimeMs(0);
		this.mm.mock(this.g, 'unregUpdater' );
		var size = {cx:700,cy:600};
		this.mm.mock(this.g.getWinSizer(), 'getCurSize', [size] );
		this.dlg.openDlg(1002);
		assertEQ ( IMG.getBKImage(this.dlg.items_.img), "url('')" );
		this.g.setCurTimeMs(100);
		this.g.update();
		assertEQ ( isInclude(IMG.getBKImage(this.dlg.items_.img), 'helpimg/1002.jpg'), true, '小于 10000 为 jpg' );
		var condom = this.dlg.dlg_.getConDom();
		assertEQ ( TQ.getDomSize(condom), size );
		assertEQ ( TQ.getCSS(this.dlg.items_.btnArea, 'left'), (size.cx - this.getRightSpace()) + 'px' );
		assertEQ ( this.mm.params['unregUpdater'], [this.dlg, this.dlg._setImg] );
		
		this.dlg.openDlg(10001);
		this.g.setCurTimeMs(200);
		this.g.update();
		assertEQ ( isInclude(IMG.getBKImage(this.dlg.items_.img), 'helpimg/10001.gif'), true, '大于 10000 为 gif' );
	};
	
	this.test_clickReplayBtn = function(){
		this.mm.mock(IMG, 'setBKImage');
		this.mm.mock(this.g, 'regUpdater' );
		this.dlg.items_.replayBtn.click();
		assertEQ ( this.mm.params['setBKImage'], [this.dlg.items_.img, ''] );
		assertEQ ( this.mm.params['regUpdater'], [this.dlg, this.dlg._setImg, 10] );
	};
});

tqImgHelpDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseImgHelpDlg, 'TestCaseImgHelpDlg');
};
