/*******************************************************************************/
requireEx('./ui/tqSysMsgTipsBox.js', [
	{
		start:'//SysMsgTipsBox-unittest-start'
		,end:'//SysMsgTipsBox-unittest-end'
		,items:[]
	}
]);

var TestCaseSysMsgTipsBox = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.box = SysMsgTipsBox.snew();
		this.lc = this.box.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_resize = function(){
		this.mm.mock(TQ, 'setDomPos');
		this.box.resize({cx:1000, y:600});	
		//assertEQ ( this.mm.params['setDomPos'], [this.lc().m_dom, (1000-this.lc().C_W)/2, this.lc().C_TOP] );
	};
});

tqSysMsgTipsBox_t_main = function(suite) {
	suite.addTestCase(TestCaseSysMsgTipsBox, 'TestCaseSysMsgTipsBox');
};
