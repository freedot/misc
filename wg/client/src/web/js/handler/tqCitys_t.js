require('./tqCitys.js');

TestCaseCitys = TestCase.extern(function(){
	this.testOpenDlg = function(){
	};
});


tqCitys_t_main = function(suite) {
	suite.addTestCase(TestCaseCitys);
};
