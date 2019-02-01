TestCaseTQ = TestCase.extern(function(){
	this.testDiscCopy = function(){
		var src = [];
		var des = [];
		TQ.dictCopy(des, src);
		assert(des.length==0, 
			'empty array copy');
			
		var src = [{_k:'id'},{id:1,_d:1}];
		var des = [{id:1}];
		TQ.dictCopy(des, src);
		assert(des.length==0, 
			'delete the des array one item');
		
		var src = [{_k:'id'},{id:1,num:10,flag:0}];
		var des = [{id:1,flag:20}];
		TQ.dictCopy(des, src);
		assert(des.length==1&&des[0].num==10&&des[0].flag==0, 
			'update the des array one item');
		
		var src = [{_k:'id'},{id:1,num:10,arr:[1]}];
		var des = [{id:1,flag:20,arr:[5,6,7,8]}];
		TQ.dictCopy(des, src);
		assert(des.length==1
			&& des[0].num==10
			&& des[0].flag==20
			&& des[0].arr[0] == 1 && des[0].arr.length == 1
			,'if arr not has _k, only copy');
			
		var src = [{_k:'id'},{id:1,num:10,arr:[{_k:'id'},{id:10,num:10},{id:11,num:12}],subs:{a:{b:2},b:1} }];
		var des = [{id:1,flag:20,arr:[{id:10, num:1}],subs:{a:{b:1}}} ];
		TQ.dictCopy(des, src);
		assert(des.length==1
			&& des[0].num==10
			&& des[0].arr.length == 2 && des[0].arr[0].num == 10 && des[0].arr[1].num == 12
			&& des[0].subs.a.b == 2 && des[0].subs.b == 1
			,'deep disc copy');
			
		var src = {id:1,num:10};
		var des = {flag:1};
		TQ.dictCopy(des, src);
		assert( des.id == 1
			&& des.num == 10
			&& des.flag == 1
			,'same level disc copy');
			
		var src = [{_k:'id'},{id:1,sub:[{_k:'id'},{id:10}]}];
		var des = [];
		TQ.dictCopy(des, src);
		assert( des.length == 1
			&& des[0].sub.length == 1
			,'array copy 1');
			
		var src = [{id:1,sub:[{_k:'id'},{id:10}]}];
		var des = [];
		TQ.dictCopy(des, src);
		assert( des.length == 1
			&& des[0].sub.length == 1
			,'array copy 2');
			
		var src = [1,2,3,[{id:1},{id:2},{id:3,sub:[1,2,3]}]];
		var des = [];
		TQ.dictCopy(des, src);
		assert( des.length == 4
			&& des[0] == 1
			&& des[1] == 2
			&& des[2] == 3
			&& des[3].length == 3
			&& des[3][0].id == 1
			&& des[3][1].id == 2
			&& des[3][2].id == 3
			&& des[3][2].sub.length == 3
			&& des[3][2].sub[0] == 1
			&& des[3][2].sub[1] == 2
			&& des[3][2].sub[2] == 3
			,'array copy 3');
			
		var src = [1,2,3,[1,2,3]];
		var des = [];
		TQ.dictCopy(des, src);
		assert( des.length == 4
			&& des[0] == 1
			&& des[1] == 2
			&& des[2] == 3
			&& des[3][0] == 1
			&& des[3][1] == 2
			&& des[3][2] == 3
			,'array copy 4');
	};
	
	this.testIsEmptyDict = function() {
		assert( TQ.isEmptyDict( {} ) == true );
		assert( TQ.isEmptyDict( [] ) == true );
		assert( TQ.isEmptyDict( null ) == true );
		assert( TQ.isEmptyDict( {c:1} ) == false );
		assert( TQ.isEmptyDict( {c:null} ) == true );
		assert( TQ.isEmptyDict( {c:null, a:1} ) == false );
		assert( TQ.isEmptyDict( [1] ) == false );
	};
	
	this.test_getValidEvent = function(){
		assertEQ( TQ.getValidEvent(null), window.event );
		
		var p_event = MockMouseEvent.snew(1,2);
		assertEQ( TQ.getValidEvent(p_event), p_event );
	};
	
	this.test_formatTime = function(){
		assertEQ ( TQ.formatTime(0, 50), '00:00:50' );
		assertEQ ( TQ.formatTime(0, -1), '00:00:00' );
		assertEQ ( TQ.formatTime(1, 50), '00小时00分50秒' );
		assertEQ ( TQ.formatTime(2, 50), '00分50秒' );
	};
});

TestCaseUtfString = TestCase.extern(function(){
	this.testGBKLen = function(){
		assert(UnicodeStr.gbkLen('abc') == 3);
		assert(UnicodeStr.gbkLen('abc我的!') == 8);
	};
	
	this.testGBKSubStr = function(){
		assert(UnicodeStr.gbkSubStr('abc', 2) == 'ab');
		assert(UnicodeStr.gbkSubStr('a我bc', 2) == 'a');
		assert(UnicodeStr.gbkSubStr('a我bc', 3) == 'a我');
		assert(UnicodeStr.gbkSubStr('a我bc', 4) == 'a我b');
		assert(UnicodeStr.gbkSubStr('a我bc', 40) == 'a我bc');
	};
	
	this.testByteSubStr = function(){
		assert(UnicodeStr.byteSubStr('abc', 2) == 'ab');
		assert(UnicodeStr.byteSubStr('a我bc', 2) == 'a');
		assert(UnicodeStr.byteSubStr('a我bc', 3) == 'a');
		assert(UnicodeStr.byteSubStr('a我bc', 4) == 'a我');	
		assert(UnicodeStr.byteSubStr('a我bc', 40) == 'a我bc');	
	};
});

TestCaseEscapeString = TestCase.extern(function(){
	this.test_subStr = function(){
		assert ( EscapeString.subStr('1234', 4 ) == '1234' );
		assert ( EscapeString.subStr('1234', 5 ) == '1234' );
		assert ( EscapeString.subStr('1234&quot;', 5 ) == '1234' );
		assert ( EscapeString.subStr('1234&quot;', 6 ) == '1234' );
		assert ( EscapeString.subStr('1234&quot;ccdd', 9 ) == '1234' );
		assert ( EscapeString.subStr('1234&quot;ccdd', 10 ) == '1234&quot;' );
		assert ( EscapeString.subStr('1234&adadfd&asdf;', 5 ) == '1234&' );
	}
});

tqTQ_t_main = function(suite) {
	suite.addTestCase(TestCaseTQ, 'TestCaseTQ');
	suite.addTestCase(TestCaseUtfString, 'TestCaseUtfString');
	suite.addTestCase(TestCaseEscapeString, 'TestCaseEscapeString');
};

