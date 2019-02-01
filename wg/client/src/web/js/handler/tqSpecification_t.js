/*******************************************************************************/
require('./tqSpecification.js')

TestCaseAndSpec = TestCase.extern(function(){
	this.test_isSatisfiedBy = function(){
		var MySpec1 = Class.extern(function(){
			this.isSatisfiedBy = function(val){
				return val >= 0;
			};
		});
		
		var MySpec2 = Class.extern(function(){
			this.isSatisfiedBy = function(val){
				return val < 10;
			};
		});
		
		var spec = AndSpec.snew(MySpec1.snew(), MySpec2.snew());
		assertEQ ( spec.isSatisfiedBy(-1), false );
		assertEQ ( spec.isSatisfiedBy(0), true );
		assertEQ ( spec.isSatisfiedBy(9), true );
		assertEQ ( spec.isSatisfiedBy(10), false );
	};
});

TestCaseOrSpec = TestCase.extern(function(){
	this.test_isSatisfiedBy = function(){
		var MySpec1 = Class.extern(function(){
			this.isSatisfiedBy = function(val){
				return val == 0;
			};
		});
		
		var MySpec2 = Class.extern(function(){
			this.isSatisfiedBy = function(val){
				return val == 10;
			};
		});
		
		var spec = OrSpec.snew(MySpec1.snew(), MySpec2.snew());
		assertEQ ( spec.isSatisfiedBy(-1), false );
		assertEQ ( spec.isSatisfiedBy(0), true );
		assertEQ ( spec.isSatisfiedBy(10), true );
		assertEQ ( spec.isSatisfiedBy(11), false );
	};
});

TestCaseNotSpec = TestCase.extern(function(){
	this.test_isSatisfiedBy = function(){
		var MySpec1 = Class.extern(function(){
			this.isSatisfiedBy = function(val){
				return val == 0;
			};
		});
		
		var spec = NotSpec.snew(MySpec1.snew());
		assertEQ ( spec.isSatisfiedBy(0), false );
		assertEQ ( spec.isSatisfiedBy(1), true );
	};
});

tqSpecification_t_main = function(suite) {
	suite.addTestCase(TestCaseAndSpec, 'TestCaseAndSpec');
	suite.addTestCase(TestCaseOrSpec, 'TestCaseOrSpec');
	suite.addTestCase(TestCaseNotSpec, 'TestCaseNotSpec');
};