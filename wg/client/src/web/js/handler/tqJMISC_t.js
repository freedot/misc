require('./tqJMISC.js');
TestCaseJMISC = TestCase.extern(function(){
	this.testXXX = function(){
	};
});

tqJMISC_t_main = function(suite) {
	suite.addTestCase(TestCaseJMISC, 'TestCaseJMISC');
};



