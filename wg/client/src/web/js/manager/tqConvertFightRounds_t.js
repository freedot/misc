/*******************************************************************************/
require('./tqConvertFightRounds.js');
/*
requireEx('./manager/tqConvertFightRounds.js', [
	{
		start:'//ConvertFightRounds-unittest-start'
		,end:'//ConvertFightRounds-unittest-end'
		,items:[]
	}
]); */

TestCaseConvertFightRounds = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_convert = function(){
		var desRounds = [];
		var srcActions = [{event:'fightstart'},{event:'round',round:1},{event:'movestart'},{event:'move', paths:[{x:1,y:2}]},{event:'round',round:2},{event:'move', paths:[{x:1,y:3}]}];
		ConvertFightRounds.snew().convert(desRounds, srcActions);
		assertEQ ( desRounds, [[{event:'round',round:1, seq: 2, subseq: 0}, {event:'movestart', seq: 3, subseq: 0},{event:'move', seq: 4, subseq: 0, paths:[{x:1,y:2}]} ], [{event:'round',round:2, seq: 5, subseq: 0}, {event:'move', paths:[{x:1,y:3}], seq: 6, subseq: 0}] ] );
		
		desRounds = [];
		srcActions = [{event:'round',round:1},{id:1, event:'move', paths:[{x:1,y:2}]},{id:2, event:'move', paths:[{x:2,y:3}]}];
		ConvertFightRounds.snew().convert(desRounds, srcActions);
		assertEQ ( desRounds, [ [ {event:'round',round:1, seq: 1, subseq: 0}, {id:1, event:'move', paths:[{x:1,y:2}], seq: 2, subseq: 0}, {id:2, event:'move', paths:[{x:2,y:3}], seq: 3, subseq: 0} ] ] );
			
		desRounds = [];
		srcActions = [{event:'round',round:1},{id:1, event:'move', paths:[{x:1,y:2}]},{id:1, event:'move', paths:[{x:2,y:3}]}];
		ConvertFightRounds.snew().convert(desRounds, srcActions);
		assertEQ ( desRounds, [ [ {event:'round',round:1, seq:1, subseq:0}, {id:1, event:'move', paths:[{x:1,y:2},{x:2,y:3}], seq:2, subseq: 0} ] ] );
		assertEQ ( srcActions[1].paths, [{x:1,y:2}]);
		assertEQ ( srcActions[2].paths, [{x:2,y:3}]);
		desRounds = [];
		srcActions = [{event:'round',round:1},{id:1, event:'move', paths:[{x:1,y:2}]},{id:1, event:'move', paths:[{x:2,y:3}]},{id:1, event:'move', paths:[{x:2,y:4}]}];
		ConvertFightRounds.snew().convert(desRounds, srcActions);
		assertEQ ( desRounds, [ [ {event:'round',round:1, seq:1, subseq:0}, {id:1, event:'move', paths:[{x:1,y:2},{x:2,y:3},{x:2,y:4}], seq:2, subseq: 0} ] ] );
		assertEQ ( srcActions[1].paths, [{x:1,y:2}]);
		assertEQ ( srcActions[2].paths, [{x:2,y:3}]);
		assertEQ ( srcActions[3].paths, [{x:2,y:4}]);
		
		desRounds = [];
		srcActions = [{event:'round',round:1},{userid:1, targetid:2, event:'attack', val:1},{event:'attackend'},{id:1, event:'move', paths:[{x:2,y:3}]}];
		ConvertFightRounds.snew().convert(desRounds, srcActions);
		assertEQ ( desRounds, [ [ {event:'round',round:1, seq:1, subseq:0},{userid:1, targetid:2, event:'attack', val:1, effects:[{userid:1, targetid:2, effid:RES_EFF.F_CLT_SUBHP, val:1}], seq:2, subseq:0},{id:1, event:'move', paths:[{x:2,y:3}], seq:3, subseq:0} ] ] );
			
		desRounds = [];
		srcActions = [{event:'round',round:1},{userid:1, targetid:2, event:'attack', val:1},{userid:1, targetid:2, event:'berserk', val:2},{event:'attackend'}];
		ConvertFightRounds.snew().convert(desRounds, srcActions);
		assertEQ ( desRounds, [ [ {event:'round',round:1, seq:1, subseq:0},{userid:1, targetid:2, event:'berserk', val:2, effects:[{userid:1, targetid:2, effid:RES_EFF.F_CLT_BERSERK_SUBHP, val:2}], seq:2, subseq:0} ] ] );			
		
		desRounds = [];
		srcActions = [{event:'round',round:1},{userid:1, targetid:2, event:'attack', val:1},{userid:2, targetid:1, event:'effect', effid:RES_EFF.F_ADD_HU, val:2},{event:'attackend'}];
		ConvertFightRounds.snew().convert(desRounds, srcActions);
		assertEQ ( desRounds, [ [ {event:'round',round:1, seq:1, subseq:0},{userid:1, targetid:2, event:'attack', val:1, seq:2, subseq:0, effects:[
			{userid:1, targetid:2, effid:RES_EFF.F_CLT_SUBHP, val:1}
			,{userid:2, targetid:1, event:'effect', effid:RES_EFF.F_ADD_HU, val:2, seq:2, subseq:1}
			]} ] ] );

		desRounds = [];
		srcActions = [{event:'round',round:1}
			,{userid:1, targetid:2, event:'attack', val:1}
			,{userid:2, targetid:1, event:'effect', effid:RES_EFF.F_ADD_HU, val:2}
			,{userid:1, targetid:2, event:'effect', effid:RES_EFF.F_LIANJI, val:3}
			,{userid:2, targetid:1, event:'effect', effid:RES_EFF.F_FANJI, val:5}
			,{userid:1, targetid:2, event:'effect', effid:RES_EFF.F_HUOGONG, val:4}
			,{event:'die', id:2}
			,{event:'attackend'}
			];
		ConvertFightRounds.snew().convert(desRounds, srcActions);
		assertEQ ( desRounds, [ [ 
			{event:'round',round:1, seq: 1, subseq: 0}
			,{userid:1, targetid:2, event:'attack', val:1, seq: 2, subseq: 0, effects:[
				{userid:1, targetid:2, effid:RES_EFF.F_CLT_SUBHP, val:1}
				,{userid:2, targetid:1, event:'effect', effid:RES_EFF.F_ADD_HU, val:2, seq: 2, subseq: 1}
				,{userid:1, targetid:2, event:'effect', effid:RES_EFF.F_HUOGONG, val:4, seq: 2, subseq: 4}
			]}
			,{userid:1, targetid:2, event:'attack', val:3, seq: 2, subseq: 2, effects:[
				{userid:1, targetid:2, effid:RES_EFF.F_CLT_SUBHP, val:3}
			]}
			,{userid:2, targetid:1, event:'attack', val:5, seq: 2, subseq: 3, effects:[
				{userid:2, targetid:1, effid:RES_EFF.F_CLT_SUBHP, val:5}
			]}
			,{event:'die', id:2, seq: 2, subseq: 5}
			] ] );
			
		desRounds = [];
		srcActions = [{event:'round',round:1}
			,{userid:1, targetid:2, event:'miss'}
			];
		ConvertFightRounds.snew().convert(desRounds, srcActions);
		assertEQ ( desRounds, [ [ 
			{event:'round',round:1, seq: 1, subseq: 0}
			,{userid:1, targetid:2, event:'miss', seq: 2, subseq: 0, effects:[
				{userid:1, targetid:2, effid:RES_EFF.F_CLT_MISS, val:rstr.fight.effect.miss}
			]}
			] ] );
	};
	
	this.test_splitRounds = function(){
		var srcRounds = [
			[{event:'round',round:1}, {event:'movestart'}, {event:'move', paths:[{x:1,y:2}]}, {event:'movesplit'}, {event:'move', paths:[{x:1,y:3}]}, {event:'moveend'}, {event:'die'} ]
			, [{event:'round',round:2}, {event:'move', paths:[{x:1,y:3}]}] 
		];
		
		var desRounds = ConvertFightRounds.snew().splitRounds(srcRounds);
		assertEQ ( desRounds , [
			[{event:'round',round:1} ]
			,[{event:'round',round:1}, {event:'move', paths:[{x:1,y:2}]}]
			,[{event:'round',round:1}, {event:'move', paths:[{x:1,y:3}]}] 
			,[{event:'round',round:1}, {event:'die'} ]
			,[{event:'round',round:2}, {event:'move', paths:[{x:1,y:3}]}] 
		])
	};
});

tqConvertFightRounds_t_main = function(suite) {
	suite.addTestCase(TestCaseConvertFightRounds, 'TestCaseConvertFightRounds');
};
