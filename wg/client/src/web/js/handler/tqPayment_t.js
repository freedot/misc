/*******************************************************************************/
require('./tqPayment.js')
TestCasePayment = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_pay = function(){
		pay_zone_id = 0;
		this.mm.mock(fusion2.dialog, 'pay');
		this.mm.mock(PaymentSender, 'sendStartPay');
		this.mm.mock(PaymentSender, 'sendStopPay');
		Payment.pay();
		assertEQ ( this.mm.walkLog, 'pay,sendStartPay' );
		assertEQ ( this.mm.params['sendStartPay'], [this.g] );
		
		var _data = this.mm.params['pay'][0];
		this.mm.clear();
		_data.onClose();
		assertEQ ( this.mm.walkLog, 'sendStopPay' );
		assertEQ ( this.mm.params['sendStopPay'], [this.g] );
	};
});

tqPayment_t_main = function(suite) {
	suite.addTestCase(TestCasePayment, 'TestCasePayment');
};
