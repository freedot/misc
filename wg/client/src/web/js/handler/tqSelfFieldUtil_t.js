/*******************************************************************************/
requireEx('./handler/tqSelfFieldUtil.js', [
	{
		start:'//SelfFieldUtil-unittest-start'
		,end:'//SelfFieldUtil-unittest-end'
		,items:[]
	}
]);

TestCaseSelfFieldUtil = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_hasSoldiersDispatched = function(){
		var g_field = {};
		var g_getCurDispatchHeroRt = [null];
		this.mm.mock(SelfFieldUtil, 'getCurDispatchHero', g_getCurDispatchHeroRt);
		assertEQ ( SelfFieldUtil.hasSoldiersDispatched(g_field), false);
		assertEQ ( this.mm.params['getCurDispatchHero'], [g_field] );
		
		g_getCurDispatchHeroRt[0] = {soldier:{number:0}};
		assertEQ ( SelfFieldUtil.hasSoldiersDispatched(), false );
		
		g_getCurDispatchHeroRt[0] = {soldier:{number:1}};
		assertEQ ( SelfFieldUtil.hasSoldiersDispatched(), true );
	};
	
	this.test_getCurDispatchHero = function(){
		var g_field = {};
		var g_getDispatchArmyRt = [null];
		this.mm.mock(SelfFieldUtil, 'getCurDispatchArmy', g_getDispatchArmyRt);
		assertEQ ( SelfFieldUtil.getCurDispatchHero(g_field), null);
		assertEQ ( this.mm.params['getCurDispatchArmy'], [g_field] );
		
		g_getDispatchArmyRt[0] = {heros:[{id:0}]};
		assertEQ ( SelfFieldUtil.getCurDispatchHero(g_field), null);
		
		g_getDispatchArmyRt[0] = {heros:[{id:0},{id:1}]};
		assertEQ ( SelfFieldUtil.getCurDispatchHero(g_field), {id:1});
	};
	
	this.test_hasArmyDispatched = function(){
		var g_field = {};
		var g_getDispatchArmyRt = [null];
		this.mm.mock(SelfFieldUtil, 'getCurDispatchArmy', g_getDispatchArmyRt);
		assertEQ ( SelfFieldUtil.hasArmyDispatched(g_field), false);
		assertEQ ( this.mm.params['getCurDispatchArmy'], [g_field] );
		
		g_getDispatchArmyRt[0] = {};
		assertEQ ( SelfFieldUtil.hasArmyDispatched(g_field), true );
	};
	
	this.test_getCurDispatchArmy = function(){
		var g_field = {gridId:1, objType:OBJ_TYPE.FIELD};
		var g_selfArmys = [{targetType:OBJ_TYPE.NPCFIELD, targetPos:{x:0,y:0}, state:ARMYDYN_STATE.DISPATCH}];
		this.g.getImgr().getArmys().list = g_selfArmys;
		assertEQ ( SelfFieldUtil.getCurDispatchArmy(g_field), null );
		
		g_selfArmys[0] = {targetType:OBJ_TYPE.FIELD, targetPos:{x:1,y:0}, state:ARMYDYN_STATE.DISPATCH};
		assertEQ ( SelfFieldUtil.getCurDispatchArmy(g_field), null );
		
		g_selfArmys[0] = {targetType:OBJ_TYPE.FIELD, targetPos:{x:0,y:0}, state:ARMYDYN_STATE.GOTO};
		assertEQ ( SelfFieldUtil.getCurDispatchArmy(g_field), null );
		
		g_selfArmys[0] = {armyType:ARMY_TYPE.ENEMY, targetType:OBJ_TYPE.FIELD, targetPos:{x:0,y:0}, state:ARMYDYN_STATE.DISPATCH};
		assertEQ ( SelfFieldUtil.getCurDispatchArmy(g_field), null );
		
		g_selfArmys[0] = {armyType:ARMY_TYPE.SELF, targetType:OBJ_TYPE.FIELD, targetPos:{x:0,y:0}, state:ARMYDYN_STATE.DISPATCH};
		assertEQ ( SelfFieldUtil.getCurDispatchArmy(g_field), g_selfArmys[0] );
	};	
});

tqSelfFieldUtil_t_main = function(suite) {
	suite.addTestCase(TestCaseSelfFieldUtil, 'TestCaseSelfFieldUtil');
};
