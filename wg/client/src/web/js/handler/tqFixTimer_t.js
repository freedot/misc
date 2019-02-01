/*******************************************************************************/
require('./tqFixTimer.js')

TestCaseFixTimer = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.timerSeq_ = 0;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.onTimer = function(){
		this.timerSeq_++;
	};
	
	this.test_regTimer = function(){
		FixTimer.regTimer({hour:20, min:0, sec:0}, {self:this, caller:this.onTimer});
		this.g.setSvrTimeS(1379520000 + 19*3600);
		this.g.update();
		assertEQ ( this.timerSeq_, 0 );
		
		this.g.setSvrTimeS(1379520000 + 20*3600);
		this.g.update();
		assertEQ ( this.timerSeq_, 1 );
		
		this.g.setSvrTimeS(1379520000 + 21*3600);
		this.g.update();
		assertEQ ( this.timerSeq_, 1 );
		
		this.g.setSvrTimeS(1379520000 + 24*3600 + 21*3600);
		this.g.update();
		assertEQ ( this.timerSeq_, 2, 'second day' );
		
		FixTimer.unregTimer({self:this, caller:this.onTimer});
		this.g.setSvrTimeS(1379520000 + 2*24*3600 + 21*3600);
		this.g.update();
		assertEQ ( this.timerSeq_, 2, 'third day when unreg' );
	};
	
	this.test_regTimer = function(){
		FixTimer.regTimer({hour:20, min:0, sec:0}, {self:this, caller:this.onTimer});
		this.g.setSvrTimeS(1379520000 + 19*3600);
		this.g.update();
		assertEQ ( this.timerSeq_, 0 );
		
		FixTimer.clear();
		this.g.setSvrTimeS(1379520000 + 20*3600);
		this.g.update();
		assertEQ ( this.timerSeq_, 0 );
	};
});

tqFixTimer_t_main = function(suite) {
	suite.addTestCase(TestCaseFixTimer, 'TestCaseFixTimer');
};
