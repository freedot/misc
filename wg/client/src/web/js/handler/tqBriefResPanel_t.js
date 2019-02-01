//require('./tqBriefResPanel.js');
myrequire('./handler/tqBriefResPanel.js', {
	"//BriefResPanel-testunit":
	"this._getLocal_= function(){"+
	"	var local = {};"+
	"	local.m_items = m_items;"+
	"	local.m_intervaltips = m_intervaltips;"+
	"	return local;"+
	"};"
});

TestCaseBriefResPanel = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		var items = {};
		this.g.getGUI().initPanel(new MockDom('div'), uicfg.main.mainpanel, items);
		this.brief = BriefResPanel.snew(g_app, items)
		this.lc = this.brief._getLocal_;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_init = function(){
		assertEQ ( this.lc().m_items.cityupgradebtn.isEnable(), false );
		assertEQ ( TQ.getCSS(this.lc().m_items.cityupgradebk, 'display'), 'none' );
	};

	this.test_onSvrPkg = function() {
		// can upgrade city level state
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.CITYRES, data:{res:{buildval:{cur:1010,hurt:10,max:1000,level:5}}}  });
		assertEQ ( this.lc().m_items.cityupgradebtn.isEnable(), true );
		assertEQ ( TQ.getCSS(this.lc().m_items.cityupgradebk, 'display'), 'block' );
		
		
		// idle popu server msg
		this.g.setCurTimeMs(0);
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.CITYRES, data:{res:{popu:{idle:10,work:0,max:1000}}}  });
		assertEQ(this.g.getImgr().getIdlePopu(), 10);
	};
	
	this.test_tipWillLostWhenBeyondMaxRes = function(){
		this.mm.mock(this.lc().m_intervaltips, 'send');
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.CITYRES, data:{res:{money:{cur:100,max:0}}}  });
		assertEQ ( this.mm.walkLog, '' );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.CITYRES, data:{res:{money:{cur:100,max:100}}}  });
		assertEQ ( this.mm.walkLog, '' );
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.CITYRES, data:{res:{money:{cur:110,max:100}}}  });
		assertEQ ( this.mm.params['send'], [TQ.format(rstr.briefrespanel.tips.beyond, rstr.comm['money'])] );
		
		this.mm.clear();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.CITYRES, data:{res:{cres:{food:0,wood:0,stone:0,iron:0,max:0}}}  });
		assertEQ ( this.mm.walkLog, '' );
			
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.CITYRES, data:{res:{cres:{food:0,wood:1,stone:0,iron:0,max:0}}}  });
		assertEQ ( this.mm.walkLog, '' );
			
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.CITYRES, data:{res:{cres:{food:0,wood:1,stone:0,iron:0,max:1}}}  });
		assertEQ ( this.mm.walkLog, '' );
			
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.CITYRES, data:{res:{cres:{food:0,wood:2,stone:0,iron:3,max:1}}}  });
		assertEQ ( this.mm.params['send.0'], [TQ.format(rstr.briefrespanel.tips.beyond, rstr.comm['wood'])] );
		assertEQ ( this.mm.params['send.1'], [TQ.format(rstr.briefrespanel.tips.beyond, rstr.comm['iron'])] );
	};
	
	this.test_onSvrPkg_cityUpgrade = function(){
		this.mm.mock(this.g.getWinSizer(), 'getValidClientSize', [{cx:1000, cy:800}]);
		this.mm.mock(this.g.getEntityfactory(), 'playImageEffect');
		
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.CITYRES, data:{res:{buildval:{level:5}}}  });
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.CITYRES, data:{res:{buildval:{level:5}}}  });
		assertEQ ( this.mm.walkLog, '' );
		
		this.mm.clear();
		this.g.sendEvent({eid:EVT.NET, sid:NETCMD.CITYRES, data:{res:{buildval:{level:6}}}  });
		var cfg = {
			parent:TQ.getUiBody(),
			size:{cx:308, cy:70},
			imageClass:'city_upgrade_effect',
			zorder:UI_ZORDER_SCREEN_EFFECT + 1,
			pos:{x:(1000 - 308)/2, y:(800 - 70)/2} };
		assertEQ ( this.mm.params['playImageEffect'], [cfg] );
	};
	
	this._test_getTaskNode = function(){
		var fillSubTasks = function(parentTaskId, subs){
			for ( var i=0; i<res_tasks.length; ++i ) {
				var task = res_tasks[i];
				if ( task.type != TASK_TYPE.GROWUP ) continue;
				if ( task.precond.taskId == parentTaskId ) {
					subs.push({id:task.id, subs:[]}); 
				}
			}
			
			for ( var i=0; i<subs.length; ++i ) {
				fillSubTasks(subs[i].id, subs[i].subs);
			}
		};
		
		var printTree = function(treeNode, level){
			var res = TQ.qfind(res_tasks, 'id', treeNode.id);
			print ( level + treeNode.id + '-(' + treeNode.subs.length + ')-' + (res ? res.name : 'root') );
			level += '  ';
			for ( var i=0; i<treeNode.subs.length; ++i ) {
				printTree ( treeNode.subs[i], level );
			}
			
		};
		
		var tree = {id:0, subs:[]};
		var level = '';
		fillSubTasks(tree.id, tree.subs); 
		printTree ( tree, level );
		
	};
});

tqBriefResPanel_t_main = function(suite) {
	suite.addTestCase(TestCaseBriefResPanel, 'TestCaseBriefResPanel');
};