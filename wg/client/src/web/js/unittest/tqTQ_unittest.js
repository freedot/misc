var tqTQ_testDiscCopy = function(){
	//------------
	//public:method
	//------------
	var m_this;
	this.initialize = function(){
		m_this = this;
	};
	
	this.test1 = function(){ // empty array copy
		var src = [];
		var des = [];
		TQ.dictCopy(des, src);
		jassert(des.length==0, 'tqTQ_unittest.test1');
	};
	
	this.test2 = function(){ // delete
		var src = [{_k:'id'},{id:1,_d:1}];
		var des = [{id:1}];
		TQ.dictCopy(des, src);
		jassert(des.length==0, 'tqTQ_unittest.test2');
	};
	
	this.test3 = function(){ // update
		var src = [{_k:'id'},{id:1,num:10,flag:0}];
		var des = [{id:1,flag:20}];
		TQ.dictCopy(des, src);
		jassert(des.length==1&&des[0].num==10&&des[0].flag==0, 'tqTQ_unittest.test3');
	};
	
	this.test4 = function(){ // if array not has _k, only copy
		var src = [{_k:'id'},{id:1,num:10,arr:[1]}];
		var des = [{id:1,flag:20,arr:[5,6,7,8]}];
		TQ.dictCopy(des, src);
		jassert(des.length==1
			&& des[0].num==10
			&& des[0].flag==20
			&& des[0].arr[0] == 1 && des[0].arr.length == 1
			,'tqTQ_unittest.test4');
	};
	
	this.test5 = function(){ // deep copy
		var src = [{_k:'id'},{id:1,num:10,arr:[{_k:'id'},{id:10,num:10},{id:11,num:12}],subs:{a:{b:2},b:1} }];
		var des = [{id:1,flag:20,arr:[{id:10, num:1}],subs:{a:{b:1}}} ];
		TQ.dictCopy(des, src);
		jassert(des.length==1
			&& des[0].num==10
			&& des[0].arr.length == 2 && des[0].arr[0].num == 10 && des[0].arr[1].num == 12
			&& des[0].subs.a.b == 2 && des[0].subs.b == 1
			,'tqTQ_unittest.test5');
	};
	
	this.test6 = function(){ // disc copy
		var src = {id:1,num:10};
		var des = {flag:1};
		TQ.dictCopy(des, src);
		jassert( des.id == 1
			&& des.num == 10
			&& des.flag == 1
			,'tqTQ_unittest.test6');
	};
	
	this.test7 = function(){ // disc copy
		var src = [{_k:'id'},{id:1,sub:[{_k:'id'},{id:10}]}];
		var des = [];
		TQ.dictCopy(des, src);
		jassert( des.length == 1
			&& des[0].sub.length == 1
			,'tqTQ_unittest.test7');
	};
	
	this.test8 = function(){ // disc copy
		var src = [{id:1,sub:[{_k:'id'},{id:10}]}];
		var des = [];
		TQ.dictCopy(des, src);
		jassert( des.length == 1
			&& des[0].sub.length == 1
			,'tqTQ_unittest.test8');
	};
	
	this.test9 = function(){ // disc copy
		var src = [1,2,3,[{id:1},{id:2},{id:3,sub:[1,2,3]}]];
		var des = [];
		TQ.dictCopy(des, src);
		jassert( des.length == 4
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
			,'tqTQ_unittest.test9');
	};
	
	this.test10 = function(){ // array copy
		var src = [1,2,3,[1,2,3]];
		var des = [];
		TQ.dictCopy(des, src);
		jassert( des.length == 4
			&& des[0] == 1
			&& des[1] == 2
			&& des[2] == 3
			&& des[3][0] == 1
			&& des[3][1] == 2
			&& des[3][2] == 3
			,'tqTQ_unittest.test10');
	};
	
	//------------
	//private:method
	//------------
	
	//--------------
	// call constructor
	//--------------
	this.initialize.apply(this, arguments);
};

var tqTQ_testPPoints = function() {
	this.testLeft = function() {
		
	};
};

var tqTQ_testDiscCopy_ins = new tqTQ_testDiscCopy();
tqTQ_testDiscCopy_ins.test1();
tqTQ_testDiscCopy_ins.test2();
tqTQ_testDiscCopy_ins.test3();
tqTQ_testDiscCopy_ins.test4();
tqTQ_testDiscCopy_ins.test5();
tqTQ_testDiscCopy_ins.test6();
tqTQ_testDiscCopy_ins.test7();
tqTQ_testDiscCopy_ins.test8();
tqTQ_testDiscCopy_ins.test9();
tqTQ_testDiscCopy_ins.test10();

var tqTQ_testPPoints_ins = new tqTQ_testPPoints();
tqTQ_testPPoints_ins.testLeft();

