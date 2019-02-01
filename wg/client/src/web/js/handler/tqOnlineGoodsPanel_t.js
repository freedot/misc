/*******************************************************************************/
require('./tqOnlineGoodsPanel.js')

TestCaseOnlineGoodsPanel = TestCase.extern(function(){
	this.setUp = function(){
		this.IS_DEBUG_ = IS_DEBUG;
		IS_DEBUG = true;

		TestCaseHelper.setUp(this);
		this.items = {};
		this.g.getGUI().initPanel(new MockDom('div'), uicfg.main.mainpanel, this.items);
		this.panel = OnlineGoodsPanel.snew(this.g, this.items);		
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
		IS_DEBUG = this.IS_DEBUG_;
	};
	
	this.test_clickGetBtn = function(){
		this.mm.mock(ActivityValSender, 'sendGetOnlineGoods');
		this.items.onlineGetGoods_btn.click();
		assertEQ ( this.mm.params['sendGetOnlineGoods'], [this.g] );
	};
	
	this.test_initUpdateHasGoodsAndNoGot = function(){
		this.g.getImgr().getActivityVal().gotOnlineGoods = 0;
		this.g.getImgr().getActivityVal().onlineGoodsId = 200001;
		var items = {};
		this.g.getGUI().initPanel(new MockDom('div'), uicfg.main.mainpanel, items);
		var panel = OnlineGoodsPanel.snew(this.g, items);
		assertEQ ( TQ.getCSS(items.onlineGetGoods_panel, 'display' ), 'block' );
	};
	
	this.test_initUpdateHasGoodsAndGot = function(){
		this.g.getImgr().getActivityVal().gotOnlineGoods = 1;
		this.g.getImgr().getActivityVal().onlineGoodsId = 200001;
		var items = {};
		this.g.getGUI().initPanel(new MockDom('div'), uicfg.main.mainpanel, items);
		var panel = OnlineGoodsPanel.snew(this.g, items);
		assertEQ ( TQ.getCSS(items.onlineGetGoods_panel, 'display' ), 'none' );
	};
	
	this.test_initUpdateHasNoGoods = function(){
		this.g.getImgr().getActivityVal().gotOnlineGoods = 0;
		this.g.getImgr().getActivityVal().onlineGoodsId = 0;
		var items = {};
		this.g.getGUI().initPanel(new MockDom('div'), uicfg.main.mainpanel, items);
		var panel = OnlineGoodsPanel.snew(this.g, items);
		assertEQ ( TQ.getCSS(items.onlineGetGoods_panel, 'display' ), 'none' );
	};
	
	this.test_onActivityValChange = function(){
		this.g.getImgr().getActivityVal().gotOnlineGoods = 0;
		this.g.getImgr().getActivityVal().onlineGoodsId = 0;
		var items = {};
		this.g.getGUI().initPanel(new MockDom('div'), uicfg.main.mainpanel, items);
		var panel = OnlineGoodsPanel.snew(this.g, items);
		assertEQ ( TQ.getCSS(items.onlineGetGoods_panel, 'display' ), 'none' );

		this.g.getImgr().getActivityVal().gotOnlineGoods = 0;
		this.g.getImgr().getActivityVal().onlineGoodsId = 200001;
		this.g.sendEvent({eid:EVT.ACTIVITY_VAL, sid:0});
		assertEQ ( TQ.getCSS(items.onlineGetGoods_panel, 'display' ), 'block' );
		
		this.g.getImgr().getActivityVal().gotOnlineGoods = 1;
		this.g.getImgr().getActivityVal().onlineGoodsId = 200001;
		this.g.sendEvent({eid:EVT.ACTIVITY_VAL, sid:0});
		assertEQ ( TQ.getCSS(items.onlineGetGoods_panel, 'display' ), 'none' );
		
		this.g.getImgr().getActivityVal().gotOnlineGoods = 0;
		this.g.getImgr().getActivityVal().onlineGoodsId = 200001;
		this.g.sendEvent({eid:EVT.ACTIVITY_VAL, sid:0});
		this.g.getImgr().getActivityVal().gotOnlineGoods = 0;
		this.g.getImgr().getActivityVal().onlineGoodsId = 0;
		this.g.sendEvent({eid:EVT.ACTIVITY_VAL, sid:0});
		assertEQ ( TQ.getCSS(items.onlineGetGoods_panel, 'display' ), 'none' );
	};
	
	this.test_fixIEPng = function(){
		this.mm.mock(TQ, 'fixIE6Png');//(this.items_.onlineGetGoods_icon);
		this.panel.init(this.g, this.items);
		assertEQ ( this.mm.params['fixIE6Png'], [this.items.onlineGetGoods_icon] );
	};
});

tqOnlineGoodsPanel_t_main = function(suite) {
	suite.addTestCase(TestCaseOnlineGoodsPanel, 'TestCaseOnlineGoodsPanel');
};
