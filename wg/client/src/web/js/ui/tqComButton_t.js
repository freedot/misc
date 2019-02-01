/*******************************************************************************/
requireEx('./ui/tqComButton.js', [
	{
		start:'//ButtonBlinking-unittest-start'
		,end:'//ButtonBlinking-unittest-end'
		,items:['C_DRTTIME'
			,'m_this'
			,'m_timer'
			,'m_interval'
			,'m_curtime'
			,'m_isBlinkingFrame'
			,'m_resetStatusCaller'
			,'_onTimer'
			,'_killTimer'
			,'_resetBtnStatus'
			,'_setBlinkingFrameFlag'
		]
	}
]);

var TestCaseButtonBlinking = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		var THIS = this;
		THIS.becalled = false;
		this.resetStatusCaller = function(){THIS.becalled=true;};
		this.blinking = ButtonBlinking.snew({self:this, caller:this.resetStatusCaller});
		this.lc = this.blinking.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.lc().m_resetStatusCaller, {self:this, caller:this.resetStatusCaller} );
		assertEQ ( this.lc().m_this, this.blinking );
	};
	
	this.test_start = function(){
		this.lc().m_curtime = 1;
		this.mm.mock(window, 'setInterval', [{name:'timer'}]);
		this.blinking.start(0);
		assertEQ ( this.mm.walkLog, 'setInterval' );
		assertEQ ( this.mm.params['setInterval'], [this.lc()._onTimer, this.lc().C_DRTTIME] );
		assertEQ ( this.lc().m_interval, 0x7fffffff );
		assertEQ ( this.lc().m_curtime, 0 );
		assertEQ ( this.lc().m_timer, {name:'timer'} );
		
		this.mm.clear();
		this.blinking.start(1);
		assertEQ ( this.mm.walkLog, '' );
		assertEQ ( this.lc().m_interval, 1 );
		assertEQ ( this.lc().m_curtime, 0 );
	};
	
	this.test_stop = function(){
		this.mm.mock(this.lc(), '_setBlinkingFrameFlag');
		this.mm.mock(this.lc(), '_killTimer');
		this.mm.mock(this.lc(), '_resetBtnStatus');
		this.blinking.stop();
		assertEQ ( this.mm.walkLog, '_setBlinkingFrameFlag,_killTimer,_resetBtnStatus' );
		assertEQ ( this.mm.params['_setBlinkingFrameFlag'], [false] );
	};
	
	this.test_isBlinkingFrame = function(){
		this.lc()._setBlinkingFrameFlag(false);
		assertEQ ( this.blinking.isBlinkingFrame(), false);
		this.lc()._setBlinkingFrameFlag(true);
		assertEQ ( this.blinking.isBlinkingFrame(), true);
	};
	
	this.test__onTimer = function(){
		this.lc()._setBlinkingFrameFlag(false);
		this.mm.mock(this.blinking, 'stop');
		this.mm.mock(this.lc(), '_resetBtnStatus');
		this.lc().m_interval = this.lc().C_DRTTIME + 1;
		this.lc()._onTimer();
		assertEQ ( this.mm.walkLog, '_resetBtnStatus' );
		assertEQ ( this.blinking.isBlinkingFrame(), true);
		assertEQ ( this.lc().m_curtime, this.lc().C_DRTTIME);

		this.mm.clear();
		this.lc()._onTimer();
		assertEQ ( this.mm.walkLog, 'stop' );
		assertEQ ( this.blinking.isBlinkingFrame(), false);
		assertEQ ( this.lc().m_curtime, this.lc().C_DRTTIME + this.lc().C_DRTTIME);
	};
	
	this.test__killTimer = function(){
		this.mm.mock(window, 'clearInterval');
		this.lc().m_timer = null;
		this.lc()._killTimer();
		assertEQ ( this.mm.walkLog, '' );
		
		this.lc().m_timer = {name:'timer'};
		this.lc()._killTimer();
		assertEQ ( this.mm.walkLog, 'clearInterval' );
		assertEQ ( this.mm.params['clearInterval'], [{name:'timer'}] );
	};
	
	this.test__resetBtnStatus = function(){
		this.becalled = false;
		this.lc()._resetBtnStatus();
		assertEQ ( this.becalled, true );
	};
});

tqComButton_t_main = function(suite) {
	suite.addTestCase(TestCaseButtonBlinking, 'TestCaseButtonBlinking');
};
