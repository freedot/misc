/*******************************************************************************/
require('./tqStateCityPanel.js')

TestCaseStateCityPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.panel = StateCityPanel.snew(this.g, MockDomEx.snew('div'));
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_firstLoadNotShowPanel = function(){
		//assertEQ ( false );
	};
	
	this.test_setMapVew = function(){
		var svrcmd = {mapview:{x1:100,y1:100,x2:200,y2:200}};
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.MAP, data:svrcmd});
		assertEQ (this.g.getImgr().getMapView(), {x1:100,y1:100,x2:200,y2:200} );
	};
});

tqStateCityPanel_t_main = function(suite) {
	suite.addTestCase(TestCaseStateCityPanel, 'TestCaseStateCityPanel');
};
