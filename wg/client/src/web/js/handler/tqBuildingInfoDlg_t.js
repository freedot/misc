/*******************************************************************************/
requireEx('./handler/tqBuildingInfoDlg.js', [
	{
		start:'//BuildingOpMgr-unittest-start'
		,end:'//BuildingOpMgr-unittest-end'
		,items:[
			'm_nullOpHdr'
			,'_getHdrByBuildType'
		]
	}
	,{
		start:'//BuildingInfoDlg-unittest-start'
		,end:'//BuildingInfoDlg-unittest-end'
		,items:[]
	}
]);
	
TestCaseBuildingOpMgr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.mgr = BuildingOpMgr.snew(this.g);
		this.lc = this.mgr.lc;
		this.mockOpHdr =  this.lc().m_nullOpHdr;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getStateName = function(){
		this.mm.mock(this.lc(), '_getHdrByBuildType', [ this.mockOpHdr]);
		this.mm.mock(this.mockOpHdr, 'getStateName', ['commstate']);
		
		var p_item = {};
		var p_groupIdx = 0;
		assertEQ ( this.mgr.getStateName(p_item, p_groupIdx), 'commstate' );
		assertEQ ( this.mm.params['_getHdrByBuildType'], [ this.g.getImgr().getTypeInAllBuildsGroup(p_groupIdx)] );
		assertEQ ( this.mm.params['getStateName'], [ p_item ] );
	};
	
	this.test_opSpeed = function(){
		this.mm.mock(this.lc(), '_getHdrByBuildType', [ this.mockOpHdr]);
		this.mm.mock(this.mockOpHdr, 'opSpeed');
		
		var p_item = {};
		var p_groupIdx = 0;
		this.mgr.opSpeed(p_item, p_groupIdx);
		assertEQ ( this.mm.params['_getHdrByBuildType'], [ this.g.getImgr().getTypeInAllBuildsGroup(p_groupIdx)] );
		assertEQ ( this.mm.params['opSpeed'], [ p_item ] );
	};
	
	this.test_opCancel = function(){
		this.mm.mock(this.lc(), '_getHdrByBuildType', [ this.mockOpHdr]);
		this.mm.mock(this.mockOpHdr, 'opCancel');
		
		var p_item = {};
		var p_groupIdx = 0;
		this.mgr.opCancel(p_item, p_groupIdx);
		assertEQ ( this.mm.params['_getHdrByBuildType'], [ this.g.getImgr().getTypeInAllBuildsGroup(p_groupIdx)] );
		assertEQ ( this.mm.params['opCancel'], [ p_item ] );
	};
	
	this.test__getHdrByBuildType = function(){
		assertEQ ( this.lc()._getHdrByBuildType(ALLBUILDSGROUP_TYPE.CITY) instanceof BuildingInfoCityOpHdr, true );
		assertEQ ( this.lc()._getHdrByBuildType(ALLBUILDSGROUP_TYPE.ALLI) instanceof BuildingInfoAlliOpHdr, true );
		assertEQ ( this.lc()._getHdrByBuildType(ALLBUILDSGROUP_TYPE.CULTURE) instanceof BuildingInfoCultureOpHdr, true );
		assertEQ ( this.lc()._getHdrByBuildType(-1) instanceof BuildingInfoNullOpHdr, true );
	};
});
	
TestCaseBuildingInfoCityOpHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.hdr = BuildingInfoCityOpHdr.snew();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_opSpeed = function(){
		this.mm.mock( UIM.getPanel('inbuild'), 'opSpeed' );
		var p_item = {};
		this.hdr.opSpeed(p_item);
		assertEQ ( this.mm.params['opSpeed'], [p_item] );
	};
	
	this.test_opCancel = function(){
		this.mm.mock( UIM.getPanel('inbuild'), 'opCancel' );
		var p_item = {};
		this.hdr.opCancel(p_item);
		assertEQ ( this.mm.params['opCancel'], [p_item] );
	};
	
	this.test_getStateName = function(){
		var p_item = {level:0};
		assertEQ ( this.hdr.getStateName(p_item), rstr.comm.buildstates[BUILD_STATE.BUILD] );
		
		p_item = {level:1, state:BUILD_STATE.UPGRADE};
		assertEQ ( this.hdr.getStateName(p_item), rstr.comm.buildstates[BUILD_STATE.UPGRADE] );
		p_item = {level:1, state:BUILD_STATE.DOWN};
		assertEQ ( this.hdr.getStateName(p_item), rstr.comm.buildstates[BUILD_STATE.DOWN] );
	};
});

TestCaseBuildingInfoAlliOpHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.hdr = BuildingInfoAlliOpHdr.snew();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getStateName = function(){
		var p_item = {level:0};
		assertEQ ( this.hdr.getStateName(p_item), rstr.comm.buildstates[BUILD_STATE.BUILD] );
		
		p_item = {level:1, state:BUILD_STATE.UPGRADE};
		assertEQ ( this.hdr.getStateName(p_item), rstr.comm.buildstates[BUILD_STATE.UPGRADE] );
		p_item = {level:1, state:BUILD_STATE.DOWN};
		assertEQ ( this.hdr.getStateName(p_item), rstr.comm.buildstates[BUILD_STATE.DOWN] );
	};
});

TestCaseBuildingInfoCultureOpHdr = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.hdr = BuildingInfoCultureOpHdr.snew();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_opSpeed = function(){
		this.mm.mock( UIM.getDlg('culture'), 'opSpeed' );
		var p_item = {};
		this.hdr.opSpeed(p_item);
		assertEQ ( this.mm.params['opSpeed'], [p_item] );
	};
	
	this.test_opCancel = function(){
		this.mm.mock( UIM.getDlg('culture'), 'opCancel' );
		var p_item = {};
		this.hdr.opCancel(p_item);
		assertEQ ( this.mm.params['opCancel'], [p_item] );
	};
	
	this.test_getStateName = function(){
		assertEQ ( this.hdr.getStateName(),  rstr.comm.buildstates[BUILD_STATE.LEARNSKILL]);
	};
});

TestCaseBuildingInfoDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = BuildingInfoDlg.snew(this.g);
		this.lc = this.dlg.lc;
		this.mockOpHdr =  this.lc().m_nullOpHdr;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
});

TestCaseBuildingTraceDlg = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.dlg = BuildingTraceDlg.snew(this.g);
		this.dlg.openDlg();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_setPosition = function(){
		this.dlg = BuildingTraceDlg.snew(this.g);
		this.dlg.setPosition({x:2000, y:40});
		this.dlg.openDlg();
		assertEQ ( this.dlg.getCore().getPosition(), {x:2000, y:40} );
		
		this.dlg.setPosition({x:3000, y:40});
		assertEQ ( this.dlg.getCore().getPosition(), {x:3000, y:40} );
	};
	
	this.test_getSize = function(){
		assertEQ ( this.dlg.getSize(), {cx:274, cy:160} );
	};
});

tqBuildingInfoDlg_t_main = function(suite) {
	suite.addTestCase(TestCaseBuildingOpMgr, 'TestCaseBuildingOpMgr');
	suite.addTestCase(TestCaseBuildingInfoCityOpHdr, 'TestCaseBuildingInfoCityOpHdr');
	suite.addTestCase(TestCaseBuildingInfoAlliOpHdr, 'TestCaseBuildingInfoAlliOpHdr');
	suite.addTestCase(TestCaseBuildingInfoCultureOpHdr, 'TestCaseBuildingInfoCultureOpHdr');
	suite.addTestCase(TestCaseBuildingInfoDlg, 'TestCaseBuildingInfoDlg');
	suite.addTestCase(TestCaseBuildingTraceDlg, 'TestCaseBuildingTraceDlg');
};
