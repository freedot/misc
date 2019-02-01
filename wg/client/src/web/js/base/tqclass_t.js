MyBaseClass = Class.extern(function(){
	var m_this = null;
	var m_say = 'hello';
	this.init = function(){
		this.init_p();
	};
	
	this.init_p = function(){
		m_this = this;
	};
	
	this.set = function(say){
		m_say = say;
	};
	
	this.get = function(){
		return m_say;
	};
	
	this.getThis = function(){
		return m_this;
	};
});

MyClass = MyBaseClass.extern(function(){
	var m_this = null;
	var m_say = 'hello';
	this.init = function(){
		this.Super.init();
		this.init_p();
	};
	
	this.setp = function(say){
		m_say = say;
	};
	
	this.getp = function(){
		return m_say;
	};
});

MyClassEx = MyBaseClass.extern(function(){
});

TestCaseClass = TestCase.extern(function(){
	this.testPrivateVar = function(){
		var mbase = MyBaseClass.snew();
		mbase.set('ok');
		assert(mbase.get() == 'ok');
		
		var myc = MyClass.snew();
		assert(myc.get() == 'hello');
		myc.set('good');
		assert(myc.get() == 'good');
		
		assert(mbase.get() == 'ok');
		
		var myc2 = MyClass.snew();
		assert(myc2.get() == 'hello');
		myc2.set('he');
		assert(myc2.get() == 'he');
		
		assert(myc.get() == 'good');
		
		var myex = MyClassEx.snew();
		assert(myex.get() == 'hello');
	};
});


tqclass_t_main = function(suite) {
	suite.addTestCase(TestCaseClass);
};
