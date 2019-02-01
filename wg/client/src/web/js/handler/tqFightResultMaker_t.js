requireEx('./handler/tqFightResultMaker.js', [
	{
		start:'//FightResultMaker-unittest-start'
		,end:'//FightResultMaker-unittest-end'
		,items:['_hasRes'
			,'_makeResString'
			,'_isMainArmyDefender'
			,'_isAlliArmyDefender'
			,'_isTowerArmyDefender'
			,'_isCopyFieldArmyDefender'
			,'_isOwnerFieldArmyDefender'
			,'_isFieldArmyDefender'
			,'_getMainArmyDefenderResultTitle'
			,'_getAlliArmyDefenderResultTitle'
			,'_getTowerArmyDefenderResultTitle'
			,'_getCopyFieldArmyDefenderResultTitle'
			,'_getOwnerFieldArmyDefenderResultTitle'
			,'_getFieldArmyDefenderResultTitle'
			,'_getMyFightResult'
		]
	}
]);


TestCaseFightResultMaker = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.maker = FightResultMaker.snew(this.g);
		this.lc = this.maker.lc;
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getGetOrLostResString = function(){
		assert ( this.maker.getGetOrLostResString({gainres:{},lossres:{}}) == '' );
		assert ( this.maker.getGetOrLostResString({gainres:{food:1, money:2}}) == '获得资源：<div class=comm_inlineline_block>粮食 +1</div>, <div class=comm_inlineline_block>钱币 +2</div>' );
		assert ( this.maker.getGetOrLostResString({lossres:{food:1, money:2}}) == '损失资源：<div class=comm_inlineline_block>粮食 -1</div>, <div class=comm_inlineline_block>钱币 -2</div>' );
	};
	

	this.test_getDropItemsString = function(){
		assert ( this.maker.getDropItemsString({getdrop:[{type:'exp'}]}) == '' );
		assert ( this.maker.getDropItemsString({getdrop:[{type:'item',id:FIXID.SALVE,number:1}]}) == '获得物品：药膏×1' );
	};	
	
	this.testHasRes = function(){
		assert ( this.lc()._hasRes({food:1,wood:2,stone:3,iron:4}) == true );
		assert ( this.lc()._hasRes({wood:1}) == true );
		assert ( this.lc()._hasRes({wood:0}) == false );
		assert ( this.lc()._hasRes({}) == false );
	};
	
	this.testMakeResString = function(){
		var s = this.lc()._makeResString('-', {food:1,wood:2,stone:3,iron:4});
		assert ( s == '<div class=comm_inlineline_block>粮食 -1</div>, <div class=comm_inlineline_block>木材 -2</div>, <div class=comm_inlineline_block>石料 -3</div>, <div class=comm_inlineline_block>生铁 -4</div>' );
		
		var s = this.lc()._makeResString('+', {food:1,wood:2,stone:3,iron:4,popu:10});
		assert ( s == '<div class=comm_inlineline_block>粮食 +1</div>, <div class=comm_inlineline_block>木材 +2</div>, <div class=comm_inlineline_block>石料 +3</div>, <div class=comm_inlineline_block>生铁 +4</div>, <div class=comm_inlineline_block>人口 +10</div>' );
	};	
	
	this.test_hasDefExpend = function(){
		assert ( this.maker.hasDefExpend({xianjing:0, gunmu:0, juma:0, leishi:0, nujian:0}) == false );
		assert ( this.maker.hasDefExpend({xianjing:1, gunmu:0, juma:0, leishi:0, nujian:0}) == true );
	};
	
	this.test_getGetOrLostResTitle = function(){
		var title = this.maker.getGetOrLostResTitle({result:1});
		assert ( title.attack == rstr.military.fightresult.lbl.attackGetRes );
		assert ( title.target == rstr.military.fightresult.lbl.targetLostRes );
		
		var title = this.maker.getGetOrLostResTitle({result:0});
		assert ( title.attack == rstr.military.fightresult.lbl.attackLostRes );
		assert ( title.target == rstr.military.fightresult.lbl.targetGetRes );
	};
	
	this.test_getResultTitle = function(){
		var r_isMainArmyDefender = [false];
		var r_isAlliArmyDefender = [false];
		var r_isTowerArmyDefender = [false];
		var r_isCopyFieldArmyDefender = [false];
		var r_isOwnerFieldArmyDefender = [false];
		var r_isFieldArmyDefender = [false];
		this.mm.mock(this.lc(), '_isMainArmyDefender', r_isMainArmyDefender);
		this.mm.mock(this.lc(), '_isAlliArmyDefender', r_isAlliArmyDefender);
		this.mm.mock(this.lc(), '_isTowerArmyDefender', r_isTowerArmyDefender);
		this.mm.mock(this.lc(), '_isCopyFieldArmyDefender', r_isCopyFieldArmyDefender);
		this.mm.mock(this.lc(), '_isOwnerFieldArmyDefender', r_isOwnerFieldArmyDefender);
		this.mm.mock(this.lc(), '_isFieldArmyDefender', r_isFieldArmyDefender);
		this.mm.mock(this.lc(), '_getMainArmyDefenderResultTitle', ['mainArmy']);
		this.mm.mock(this.lc(), '_getAlliArmyDefenderResultTitle', ['alliArmy']);
		this.mm.mock(this.lc(), '_getTowerArmyDefenderResultTitle', ['towerArmy']);
		this.mm.mock(this.lc(), '_getCopyFieldArmyDefenderResultTitle', ['copyFieldArmy']);
		this.mm.mock(this.lc(), '_getOwnerFieldArmyDefenderResultTitle', ['ownerFieldArmy']);
		this.mm.mock(this.lc(), '_getFieldArmyDefenderResultTitle', ['fieldArmy']);
		
		var results = {name:'results'};
		assertEQ ( this.maker.getResultTitle(results), 'error result defender!' );
		
		r_isMainArmyDefender[0] = true;
		assertEQ ( this.maker.getResultTitle(results), 'mainArmy' );
		assertEQ ( this.mm.params['_isMainArmyDefender'], [results] )
		assertEQ ( this.mm.params['_getMainArmyDefenderResultTitle'], [results] )
		
		r_isMainArmyDefender[0] = false;
		r_isAlliArmyDefender[0] = true;
		assertEQ ( this.maker.getResultTitle(results), 'alliArmy' );
		assertEQ ( this.mm.params['_isAlliArmyDefender'], [results] )
		assertEQ ( this.mm.params['_getAlliArmyDefenderResultTitle'], [results] )
		
		r_isAlliArmyDefender[0] = false;
		r_isTowerArmyDefender[0] = true;
		assertEQ ( this.maker.getResultTitle(results), 'towerArmy' );
		assertEQ ( this.mm.params['_isTowerArmyDefender'], [results] )
		assertEQ ( this.mm.params['_getTowerArmyDefenderResultTitle'], [results] )
		
		r_isTowerArmyDefender[0] = false;
		r_isCopyFieldArmyDefender[0] = true;
		assertEQ ( this.maker.getResultTitle(results), 'copyFieldArmy' );
		assertEQ ( this.mm.params['_isCopyFieldArmyDefender'], [results] )
		assertEQ ( this.mm.params['_getCopyFieldArmyDefenderResultTitle'], [results] )
		
		r_isCopyFieldArmyDefender[0] = false;
		r_isOwnerFieldArmyDefender[0] = true;
		assertEQ ( this.maker.getResultTitle(results), 'ownerFieldArmy' );
		assertEQ ( this.mm.params['_isOwnerFieldArmyDefender'], [results] )
		assertEQ ( this.mm.params['_getOwnerFieldArmyDefenderResultTitle'], [results] )
		
		r_isOwnerFieldArmyDefender[0] = false;
		r_isFieldArmyDefender[0] = true;
		assertEQ ( this.maker.getResultTitle(results), 'fieldArmy' );
		assertEQ ( this.mm.params['_isFieldArmyDefender'], [results] )
		assertEQ ( this.mm.params['_getFieldArmyDefenderResultTitle'], [results] )
	};
	
	this.test__isMainArmyDefender = function(){
		var fightResult = {defenderParty:'defender',defender:{role:{objType:OBJ_TYPE.NONE, name:'defender'}}};
		assertEQ ( this.lc()._isMainArmyDefender(fightResult), false );
		fightResult = {defenderParty:'defender1',defender:{role:{objType:OBJ_TYPE.ROLE, name:'defender'}}};
		assertEQ ( this.lc()._isMainArmyDefender(fightResult), false );
		fightResult = {defenderParty:'defender',defender:{role:{objType:OBJ_TYPE.ROLE, name:'defender'}}};
		assertEQ ( this.lc()._isMainArmyDefender(fightResult), true );
	};
	
	this.test__isAlliArmyDefender = function(){
		var fightResult = {defenderParty:'defender',defender:{role:{objType:OBJ_TYPE.NONE, name:'defender'}}};
		assertEQ ( this.lc()._isAlliArmyDefender(fightResult), false );
		fightResult = {defenderParty:'defender1',defender:{role:{objType:OBJ_TYPE.ROLE, name:'defender'}}};
		assertEQ ( this.lc()._isAlliArmyDefender(fightResult), true );
		fightResult = {defenderParty:'defender',defender:{role:{objType:OBJ_TYPE.ROLE, name:'defender'}}};
		assertEQ ( this.lc()._isAlliArmyDefender(fightResult), false );
	};
	
	this.test__isTowerArmyDefender = function(){
		var fightResult = {defender:{role:{objType:OBJ_TYPE.NONE}}};
		assertEQ ( this.lc()._isTowerArmyDefender(fightResult), false );
		fightResult = {defender:{role:{objType:OBJ_TYPE.TOWER}}};
		assertEQ ( this.lc()._isTowerArmyDefender(fightResult), true );
	};
	
	this.test__isCopyFieldArmyDefender = function(){
		var fightResult = {defender:{role:{objType:OBJ_TYPE.NONE}}};
		assertEQ ( this.lc()._isCopyFieldArmyDefender(fightResult), false );
		fightResult = {defender:{role:{objType:OBJ_TYPE.COPYFIELD}}};
		assertEQ ( this.lc()._isCopyFieldArmyDefender(fightResult), true );
	};
	
	this.test__isOwnerFieldArmyDefender = function(){
		var fightResult = {defender:{role:{objType:OBJ_TYPE.NONE}}};
		assertEQ ( this.lc()._isOwnerFieldArmyDefender(fightResult), false );
		fightResult = {defender:{role:{objType:OBJ_TYPE.OWNERFIELD}}};
		assertEQ ( this.lc()._isOwnerFieldArmyDefender(fightResult), true );
	};
	
	this.test__isFieldArmyDefender = function(){
		var fightResult = {defender:{role:{objType:OBJ_TYPE.NONE}}};
		assertEQ ( this.lc()._isFieldArmyDefender(fightResult), false );
		fightResult = {defender:{role:{objType:OBJ_TYPE.FIELD}}};
		assertEQ ( this.lc()._isFieldArmyDefender(fightResult), true );
	};
	
	this.test__getMyFightResult = function(){
		var r_isMySucc = [true];
		this.mm.mock(this.maker, 'isMySucc', r_isMySucc);
		var fightResult = {name:'result'};
		assertEQ ( this.lc()._getMyFightResult(fightResult), rstr.military.fightresult.actions.mySucc );
		assertEQ ( this.mm.params['isMySucc'], [fightResult] );
		r_isMySucc[0] = false;
		assertEQ ( this.lc()._getMyFightResult(fightResult), rstr.military.fightresult.actions.myFail );
	};
	
	this.test__getMainArmyDefenderResultTitle = function(){
		this.mm.mock(this.lc(), '_getMyFightResult', ['result']);
		var fightResult = {attacker:{role:{name:'att'} }, defender:{role:{name:'def'} }};
		var s = TQ.format(rstr.military.fightresult.actions.resultAttackPartyRole , 'att', '攻打', 'def', 'result');
		assertEQ ( this.lc()._getMainArmyDefenderResultTitle(fightResult), s );
		assertEQ ( this.mm.params['_getMyFightResult'], [fightResult] );
	};
	
	this.test__getMainArmyDefenderResultTitle_hasHonor = function(){
		this.g.getImgr().getRoleRes().name = 'att';
		this.mm.mock(this.lc(), '_getMyFightResult', ['result']);
		var fightResult = {result:FIGHT_RESULT.ATTACKSUCC,defenderParty:'def',attacker:{role:{name:'att'},gainres:{honor:5}}, defender:{role:{name:'def', objType:OBJ_TYPE.ROLE},lossres:{honor:5}}};
		var s = TQ.format(rstr.military.fightresult.actions.resultAttackPartyRole , 'att', '攻打', 'def', 'result');
		var shonor = TQ.format(rstr.military.fightresult.actions.myGetHonor, 5 );
		assertEQ ( this.maker.getResultTitle(fightResult), s+shonor );
		assertEQ ( this.mm.params['_getMyFightResult'], [fightResult] );
		
		this.g.getImgr().getRoleRes().name = 'def';
		var shonor = TQ.format(rstr.military.fightresult.actions.enemyGetHonor, 5 );
		assertEQ ( this.maker.getResultTitle(fightResult), s+shonor );
	};
	
	this.test__getAlliArmyDefenderResultTitle = function(){
		this.mm.mock(this.lc(), '_getMyFightResult', ['result']);
		var fightResult = {defenderParty:'defender',attacker:{role:{name:'att'}}, defender:{role:{name:'def'}}};
		var s = TQ.format(rstr.military.fightresult.actions.resultAttackAlliance , 'att', '攻打', 'defender', 'def', 'result');
		assertEQ ( this.lc()._getAlliArmyDefenderResultTitle(fightResult), s );
		assertEQ ( this.mm.params['_getMyFightResult'], [fightResult] );
	};
	
	this.test__getTowerArmyDefenderResultTitle = function(){
		this.mm.mock(this.lc(), '_getMyFightResult', ['result']);
		var fightResult = {defenderParty:'defender',attacker:{role:{name:'att'}}, defender:{role:{name:'def'}}};
		var s = TQ.format(rstr.military.fightresult.actions.resultAttackTower , 'att', '攻打', 'defender', 'def', 'result');
		assertEQ ( this.lc()._getTowerArmyDefenderResultTitle(fightResult), s );
		assertEQ ( this.mm.params['_getMyFightResult'], [fightResult] );
	};
	
	this.test__getCopyFieldArmyDefenderResultTitle = function(){
		this.mm.mock(this.lc(), '_getMyFightResult', ['result']);
		var fightResult = {defenderParty:'defender',attacker:{role:{name:'att'}}, defender:{role:{name:'def'}}};
		var s = TQ.format(rstr.military.fightresult.actions.resultAttackCopyField , 'att','攻打',  'def', 'result');
		assertEQ ( this.lc()._getCopyFieldArmyDefenderResultTitle(fightResult), s );
		assertEQ ( this.mm.params['_getMyFightResult'], [fightResult] );
	};
	
	this.test__getOwnerFieldArmyDefenderResultTitle = function(){
		this.mm.mock(this.lc(), '_getMyFightResult', ['result']);
		var fightResult = {defenderParty:'defender',attacker:{role:{name:'att'}}, defender:{role:{name:'def'}}};
		var s = TQ.format(rstr.military.fightresult.actions.resultAttackOwnerField , 'att','攻打',  'def', 'result');
		assertEQ ( this.lc()._getOwnerFieldArmyDefenderResultTitle(fightResult), s );
		assertEQ ( this.mm.params['_getMyFightResult'], [fightResult] );
	};
	
	this.test__getFieldArmyDefenderResultTitle = function(){
		this.mm.mock(this.lc(), '_getMyFightResult', ['result']);
		var fightResult = {defenderParty:'defender',attacker:{role:{name:'att'}}, defender:{role:{name:'def'}}};
		var s = TQ.format(rstr.military.fightresult.actions.resultAttackField , 'att', '攻打', 'def', 'result');
		assertEQ ( this.lc()._getFieldArmyDefenderResultTitle(fightResult), s );
		assertEQ ( this.mm.params['_getMyFightResult'], [fightResult] );
	};
	
	this.test_isMySucc = function(){
		g_app.getImgr().getRoleRes().name = 'my';
		assert ( this.maker.isMySucc({result:FIGHT_RESULT.ATTACKSUCC, attacker:{role:{name:'my'}}, defender:{role:{name:'nomy'}} }) == true );
		assert ( this.maker.isMySucc({result:FIGHT_RESULT.ATTACKFAIL, attacker:{role:{name:'my'}}, defender:{role:{name:'nomy'}} }) == false );
		
		assert ( this.maker.isMySucc({result:FIGHT_RESULT.ATTACKSUCC, attacker:{role:{name:'nomy'}}, defender:{role:{name:'nomy'}} }) == false );
		assert ( this.maker.isMySucc({result:FIGHT_RESULT.ATTACKFAIL, attacker:{role:{name:'nomy'}}, defender:{role:{name:'nomy'}} }) == true );
		
		assert ( this.maker.isMySucc({result:FIGHT_RESULT.ATTACKSUCC, attacker:{role:{name:'nomy'}}, defender:{role:{name:'my'}} }) == false );
		assert ( this.maker.isMySucc({result:FIGHT_RESULT.ATTACKFAIL, attacker:{role:{name:'nomy'}}, defender:{role:{name:'my'}} }) == true );
	};
});

tqFightResultMaker_t_main = function(suite) {
	suite.addTestCase(TestCaseFightResultMaker, 'TestCaseFightResultMaker');
};