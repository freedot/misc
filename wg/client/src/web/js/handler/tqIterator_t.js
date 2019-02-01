/*******************************************************************************/
requireEx('./handler/tqIterator.js', [
	{
		start:'//Iterator-unittest-start'
		,end:'//Iterator-unittest-end'
		,items:['m_nodes'
			,'m_key'
			,'m_pos'
			]
	}
]);

TestCaseIterator = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_DictIterator = function(){
		var nodes = {'key1':1, 'key2':null, 'key3':2};
		
		var vals = [];
		var iter = DictIterator.snew(nodes);
		for ( ;iter.hasMoreNodes(); ){
			var val = iter.nextNode();
			vals.push(val);
		}
		assertEQ ( vals, [1,2] );
	};
});

tqIterator_t_main = function(suite) {
	suite.addTestCase(TestCaseIterator, 'TestCaseIterator');
};
