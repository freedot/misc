/*******************************************************************************/
require('./tqAlliAuctionBuyDlg.js')
TestCaseAlliAuctionBuyDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = AlliAuctionBuyDlg.snew(this.g);
		this.item = {id:1, resid:2500001, num:10, auction:100, fixed:200, itemres:ItemResUtil.findItemres(2500001)};
		this.fixedItem = {id:1, resid:2500001, num:10, auction:100, fixed:109, itemres:ItemResUtil.findItemres(2500001)};
		this.dlg.openDlg({type:'auction', item:this.item});
		this.items = this.dlg.getItems();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test__getDlgCfg = function(){
		var dlgCfg = {modal:false, title:rstr.alli.auctionbuydlg.auctionTitle, pos:{x:"center", y:40}, uicfg:uicfg.alli.auctionbuydlg};
		assertEQ ( this.dlg._getDlgCfg(), dlgCfg);
	};
	
	this.test_icon = function(){
		assertEQ ( isInclude( IMG.getBKImage(this.items.icon), IMG.makeBigImg(this.item.itemres.bigpic) ), true );
	};
	
	this.test_desc = function(){
		assertEQ ( TQ.getTextEx(this.items.desc), this.item.itemres.desc );
	};
	
	this.test_itemTip = function(){
		var tip = TTIP.getTipById(this.items.tooltips['$item']);
		tip.getTip(); 
		assertEQ ( tip.getTipMsg(),  TIPM.getItemDesc(SysItemMaker.make(0, this.item.itemres), 'sys'));
	};
	
	this.test_itemNumber = function(){
		assertEQ ( TQ.getTextEx(this.items.itemNumber), 10 );
	};
	
	this.test_firstInitContributionVal = function(){
		assertEQ ( this.items.contribution.getVal(), 100 + 10 )
	};
	
	this.test_contribution = function(){
		this.dlg.openDlg({type:'fixed', item:this.item});
		this.items.contribution.setVal(199);
		assertEQ(this.items.contribution.getVal(), 200);
		
		this.dlg.openDlg({type:'auction', item:this.item});
		this.items.contribution.setVal(200);
		assertEQ(this.items.contribution.getVal(), 199);
	};	
	
	this.test_buyBtn = function(){
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		this.mm.mock(AllianceSender, 'sendAuctionBuyItem');
		
		this.items.contribution.setVal(100+10 - 1);
		this.items.buyBtn.click();
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_WARNING, TQ.format(rstr.alli.auctionbuydlg.lbl.tooLowPrice, 100+10)] );
		
		this.mm.clear();
		this.items.contribution.setVal(100+20);
		this.items.buyBtn.click();
		assertEQ ( this.mm.params['sendAuctionBuyItem'], [this.g, 1, 100+20] );
	};
	
	this.test_buyBtn_arriveFixedPrice = function(){
		this.mm.mock(AllianceSender, 'sendAuctionBuyItem');
		this.dlg.openDlg({type:'fixed', item:this.fixedItem});
		this.items.contribution.setVal(109);
		this.items.buyBtn.click();
		assertEQ ( this.mm.params['sendAuctionBuyItem'], [this.g, 1, 109] );
	};
	
	this.test_buyBtnText = function(){
		this.dlg.openDlg({type:'fixed', item:this.item});
		assertEQ(this.items.buyBtn.getText(), rstr.alli.auctionbuydlg.btn.confirmFixed);

		this.dlg.openDlg({type:'auction', item:this.item});
		assertEQ(this.items.buyBtn.getText(), rstr.alli.auctionbuydlg.btn.auction);
	};
	
	this.test_cancelBtn = function(){
		assertEQ ( this.dlg.isShow(), true );
		this.items.cancelBtn.click();
		assertEQ ( this.dlg.isShow(), false );
	};
	
	this.test_title = function(){
		this.dlg.openDlg({type:'fixed', item:this.item});
		assertEQ ( this.dlg.dlg_.getTitle(), rstr.alli.auctionbuydlg.fixedTitle );
		
		this.dlg.openDlg({type:'auction', item:this.item});
		assertEQ ( this.dlg.dlg_.getTitle(), rstr.alli.auctionbuydlg.auctionTitle );
	};
});

tqAlliAuctionBuyDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseAlliAuctionBuyDlg, 'TestCaseAlliAuctionBuyDlg');
};
