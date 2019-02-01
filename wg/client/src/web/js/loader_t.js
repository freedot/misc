/*******************************************************************************/
Image = function(){};
require('./loader.js')

TestCaseJsLoader = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.loader = JsLoader.snew();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_xxx = function(){
		var invoke_times = 0;
		this.loader.setCaller(Caller.snew(this, function(succ){
			invoke_times++;
		}));
		
		this.loader.load(['js/1.js', 'js/2.js', 'js/3.js', 'js/4.js']);
		
		assertEQ ( this.loader.getTotalCount(), 4);
		assertEQ ( this.loader.getLoadedCount(), 0);
		assertFloatEQ ( this.loader.getPercent(), 0);
		
		this.loader.getJs('js/1.js').onload();
		assertEQ ( this.loader.getLoadedCount(), 1);
		this.loader.getJs('js/2.js').onload();
		assertEQ ( this.loader.getLoadedCount(), 2);
		assertFloatEQ ( this.loader.getPercent(), 0.5);
		assertEQ ( this.loader.isCompleted(), false);
		
		this.loader.getJs('js/3.js').onload();
		this.loader.getJs('js/4.js').onload();
		assertFloatEQ ( this.loader.getPercent(), 1);
		assertEQ ( this.loader.isCompleted(), true);
		assertEQ ( invoke_times, 4 );
	};
});

TestCaseImageLoader = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.imageLoader = ImageLoader.snew();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_load = function(){
		var invoke_times = 0;
		this.imageLoader.setCaller(Caller.snew(this, function(succ){
			invoke_times++;
		}));
		
		this.imageLoader.load(['images/1.png'
			,'images/2.png'
			,'http://images/3.png'
			,'HTTPS://images/4.png']);
		
		assertEQ ( this.imageLoader.getTotalCount(), 4);
		assertEQ ( this.imageLoader.getLoadedCount(), 0);
		assertFloatEQ ( this.imageLoader.getPercent(), 0);
		
		this.imageLoader.getImage('images/1.png').onload();
		assertEQ ( this.imageLoader.getImage('images/1.png').src, IMG.makeImg('images/1.png') );
		assertEQ ( this.imageLoader.getLoadedCount(), 1);
		this.imageLoader.getImage('images/2.png').onload();
		assertEQ ( this.imageLoader.getLoadedCount(), 2);
		assertFloatEQ ( this.imageLoader.getPercent(), 0.5);
		assertEQ ( this.imageLoader.isCompleted(), false);
		
		this.imageLoader.getImage('http://images/3.png').onload();
		assertEQ ( this.imageLoader.getImage('http://images/3.png').src, 'http://images/3.png' );
		this.imageLoader.getImage('HTTPS://images/4.png').onload();
		assertEQ ( this.imageLoader.getImage('HTTPS://images/4.png').src, 'HTTPS://images/4.png' );
		assertFloatEQ ( this.imageLoader.getPercent(), 1);
		assertEQ ( this.imageLoader.isCompleted(), true);
		assertEQ ( invoke_times, 4 );
	};
});

tqLoader_t_main = function(suite) {
	suite.addTestCase(TestCaseJsLoader, 'TestCaseJsLoader');
	suite.addTestCase(TestCaseImageLoader, 'TestCaseImageLoader');
};
