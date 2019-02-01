/*******************************************************************************/
require('./tqStateBuffBar.js')

TestCaseStateBuffBar = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.bar = UIM.getPanel('main').getStateBuffBar();
		
		res_state_effects=[{'id':1,'desc':'desc1','effectid':RES_EFF.HURT_BUILDVAL,'isshow':0,'smallpic':101}
			,{'id':2,'desc':'desc2','effectid':RES_EFF.ADD_THREE_BUILDINGPOS,'isshow':1,'smallpic':102}
			,{'id':3,'desc':'desc3','effectid':RES_EFF.AVOIDFIGHT,'isshow':1,'smallpic':103}
			,{'id':4,'desc':'desc4','effectid':RES_EFF.AVOIDFIGHTCD,'isshow':0,'smallpic':104}
			,{'id':5,'desc':'desc5:{val}%','effectid':RES_EFF.HURT_SPEED_BUILDVAL,'isshow':1,'smallpic':105}
			,{'id':6,'desc':'level{val}：attr: eval[Math.max(1, 5*({val}-1))]%，money: eval[{val}*10]%，xxx','effectid':RES_EFF.ZHANSHENZHIGUANG,'isshow':1,'smallpic':105}
			];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.helper_makeEmptyStates = function(){
		var states = this.g.getImgr().getRoleStates();
		TQ.dictCopy(states, [] );
		TQ.dictCopy(states, [{_k:'uid'},{uid:1, id:RES_EFF.HURT_BUILDVAL, stoptime:20}] );
	};
	
	this.helper_makeStates = function(){
		var states = this.g.getImgr().getRoleStates();
		TQ.dictCopy(states, [] );
		TQ.dictCopy(states, [{_k:'uid'},{uid:1, id:RES_EFF.ADD_THREE_BUILDINGPOS, val:100, stoptime:20},{uid:2, id:RES_EFF.HURT_SPEED_BUILDVAL, val:200, stoptime:30}] );
	};
	
	this.test_init = function(){
		this.helper_makeEmptyStates();
		
		this.mm.mock(this.g, 'regEvent' );
		this.bar.init(this.g, UIM.getPanel('main').getItems().buffBar);
		assertEQ ( this.mm.params['regEvent'], [EVT.ROLESPECSTATE_CHANGE, 0, this.bar, this.bar._onStateChange] );
		assertEQ ( this.bar.buffList_.getCount(), 0 );
		assertEQ ( TQ.getCSS(this.bar.buffList_.getParent(), 'width'), '0px');
		
		this.helper_makeStates();
		this.bar.init(this.g, UIM.getPanel('main').getItems().buffBar);
		assertEQ ( this.bar.buffList_.getCount(), 2 );
		assertEQ ( isInclude(IMG.getBKImage(this.bar.buffList_.getItem(0).exsubs.icon), 'small/102.gif'), true );
		assertEQ ( isInclude(IMG.getBKImage(this.bar.buffList_.getItem(1).exsubs.icon), 'small/105.gif'), true );
		assertEQ ( TQ.getCSS(this.bar.buffList_.getParent(), 'width'), (2*36) + 'px');
		
		this.g.setSvrTimeS(21);
		var tip0 = TTIP.getTipById(this.bar.buffList_.getItem(0).exsubs.tooltips['$item']);
		assertEQ ( tip0.getFlag(), TIP_FLAG.TIMER);
		tip0.getTip(); assertEQ ( tip0.getTipMsg(), TIPM.makeItemTip('desc2' + '<br/>' + TQ.format(rstr.buffBar.tip.leftTime, '00:00:00')) );
		
		
		var tip1 = TTIP.getTipById(this.bar.buffList_.getItem(1).exsubs.tooltips['$item']);
		assertEQ ( tip1.getFlag(), TIP_FLAG.TIMER);
		tip1.getTip(); assertEQ ( tip1.getTipMsg(), TIPM.makeItemTip('desc5:200%' + '<br/>' + TQ.format(rstr.buffBar.tip.leftTime, '00:00:09')) );
	};
	
	this.test__onStateChange = function(){
		this.helper_makeEmptyStates();
		this.bar._onStateChange();
		assertEQ ( this.bar.buffList_.getCount(), 0 );
		
		this.helper_makeStates();
		this.bar._onStateChange();
		assertEQ ( this.bar.buffList_.getCount(), 2 );
	};
	
	this.test_onGetTooltip = function(){
		this.g.getImgr().getRoleStates().length = 0;
		this.g.getImgr().getRoleStates().push({uid:1, id:RES_EFF.ZHANSHENZHIGUANG, val:1, stoptime:20});
		this.g.getImgr().getRoleStates().push({uid:2, id:RES_EFF.ZHANSHENZHIGUANG, val:2, stoptime:20});
		this.g.getImgr().getRoleStates().push({uid:3, id:RES_EFF.ZHANSHENZHIGUANG, val:3, stoptime:20});
		this.bar._onStateChange();
		
		var tip = TTIP.getTipById(this.bar.buffList_.getItem(0).exsubs.tooltips['$item']);
		tip.getTip(); assertEQ (tip.getTipMsg(), '<div class="itemtip">level1：attr: 1%，money: 10%，xxx<br/><font color="#ffff30">剩余时间 00:00:00</font></div>');
		
		var tip = TTIP.getTipById(this.bar.buffList_.getItem(1).exsubs.tooltips['$item']);
		tip.getTip(); assertEQ (tip.getTipMsg(), '<div class="itemtip">level2：attr: 5%，money: 20%，xxx<br/><font color="#ffff30">剩余时间 00:00:00</font></div>');
		
		var tip = TTIP.getTipById(this.bar.buffList_.getItem(2).exsubs.tooltips['$item']);
		tip.getTip(); assertEQ (tip.getTipMsg(), '<div class="itemtip">level3：attr: 10%，money: 30%，xxx<br/><font color="#ffff30">剩余时间 00:00:00</font></div>');
	};
});

tqStateBuffBar_t_main = function(suite) {
	suite.addTestCase(TestCaseStateBuffBar, 'TestCaseStateBuffBar');
};
