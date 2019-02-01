requireEx('./handler/tqRoleBaseChangeHandler.js', [
	{
		start:'//RoleBasePanel-unittest-start'
		,end:'//RoleBasePanel-unittest-end'
		,items:['_onGetTooltip','_updateInfo','m_items','_onSvrPkg']
	}
])


TestCaseRoleBasePanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = RoleBasePanel.snew(this.g, MockDomEx.snew('div'));
		this.lc = this.dlg.lc;	
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_onGetTooltip = function(){
		assert ( this.lc()._onGetTooltip({type:'xxx'}) == null );
		
		var xp = this.g.getImgr().getRoleAttrVal(ATTR.XP);
		var nxp = this.g.getImgr().getRoleAttrVal(ATTR.NXP);
		
		var mm = MMock.snew();
		mm.mock(this.g.getImgr(), 'isArrivedMaxRoleLevel', [false]);
		assert ( this.lc()._onGetTooltip({type:'exp'}) == rstr.comm.attrs.curexp + ':' + xp + '<br/>' + rstr.comm.attrs.nextexp + ':' + nxp );
		mm.restore();
		
		mm.mock(this.g.getImgr(), 'isArrivedMaxRoleLevel', [true]);
		assert ( this.lc()._onGetTooltip({type:'exp'}) == rstr.comm.fulllevel );
		mm.restore();
	};
	
	this.test_updateInfo = function() {
		this.g.getImgr().getRoleRes().itemres = null;
		this.lc()._updateInfo();
		
		assert ( IMG.getBKImage(this.lc().m_items.icon) == undefined );
		
		this.g.getImgr().getRoleRes().name = 'my';
		this.g.getImgr().getRoleRes().itemres = {bigpic:1};
		this.g.getImgr().getRoleRes().level = 1;
		this.g.getImgr().getRoleRes().alliance = {name:'--'};
		this.g.getImgr().getRoleRes().cityid = 9900001;
		this.g.getImgr().getRoleRes().attrs = {};
		this.g.getImgr().getRoleRes().attrs[ATTR.XP] = {val:1};
		this.g.getImgr().getRoleRes().attrs[ATTR.NXP] = {val:2};
		 
		var mm = MMock.snew();
		mm.mock(this.lc().m_items.exp, 'setRange');
		mm.mock(this.lc().m_items.exp, 'setValue');
		
		this.lc()._updateInfo();
		mm.restore();
		
		assert ( isInclude(IMG.getBKImage(this.lc().m_items.icon), '1.gif' ) == true ); 
		assert ( TQ.getTextEx(this.lc().m_items.name) == RStrUtil.makeYellowDiamondRoleName('my',this.g.getImgr().getRoleRes().ydInfo) )
		assert ( TQ.getTextEx(this.lc().m_items.level) == '1' )
		assert ( TQ.getTextEx(this.lc().m_items.alliance) == '--' )
		assert ( isInclude(IMG.getBKImage(this.lc().m_items.cityflag), '1.png' ) == true ); 
		
		assert ( mm.walkLog == 'setRange,setValue' );
		assertListEQ ( mm.params['setRange'], [2]);
		assertListEQ ( mm.params['setValue'], [0, 1]);
	};
	
	this.test__onSvrPkg = function(){
		this.mm.mock(this.g.getWinSizer(), 'getValidClientSize', [{cx:1000, cy:800}]);
		this.mm.mock(this.g.getEntityfactory(), 'playImageEffect');
		
		this.mm.travelMock(this.g, 'sendEvent');
		var netcmd = {data:{res:{}}};
		this.lc()._onSvrPkg(netcmd);
		assertEQ ( this.mm.walkLog, 'sendEvent' );
		assertEQ ( this.mm.params['sendEvent'], [{eid:EVT.ROLEBASE,sid:0}] );
		
		this.mm.clear();
		netcmd = {data:{res:{introduction:''}}};
		this.lc()._onSvrPkg(netcmd);
		assertEQ ( this.mm.walkLog, 'sendEvent,sendEvent' );
		assertEQ ( this.mm.params['sendEvent.0'], [{eid:EVT.ROLEBASE,sid:0}] );
		assertEQ ( this.mm.params['sendEvent.1'], [{eid:EVT.ROLEBASE,sid:1}] );
		
		this.mm.clear();
		var netcmd = {data:{res:{level:20}}};
		this.lc()._onSvrPkg(netcmd);
		assertEQ ( this.mm.walkLog, 'sendEvent' );
			
		this.mm.clear();
		var netcmd = {data:{res:{level:21}}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:netcmd.data});
		var cfg = {
			parent:TQ.getUiBody(),
			size:{cx:308, cy:70},
			imageClass:'role_upgrade_effect',
			zorder:UI_ZORDER_SCREEN_EFFECT + 2,
			pos:{x:(1000 - 308)/2, y:(800 - 70)/2} };
		assertEQ ( this.mm.params['playImageEffect'], [cfg] );
	};
	
	this.test_firstRewardHero = function(){
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:{res:{firsthero:0}}});
		//assertEQ ( UIM.getDlg('npc').isShow(), false );
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.ROLEBASE, data:{res:{firsthero:1}}});
		//assertEQ ( UIM.getDlg('npc').isShow(), true );
	};
});

tqRoleBaseChangeHandler_t_main = function(suite) {
	suite.addTestCase(TestCaseRoleBasePanel, 'TestCaseRoleBasePanel');
};