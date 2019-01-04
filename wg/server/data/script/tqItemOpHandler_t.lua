--*******************************************************************************
--*******************************************************************************
require('tqItemOpHandler')

local TestCaseItemOpHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.handler = ItemOpHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assert ( self.handler:getHandler(0):getClass() == NullHandler )
		assert ( self.handler:getHandler(1):getClass() == SplitArmOpHandler )
		assert ( self.handler:getHandler(2):getClass() == IntensifyArmOpHandler )
		assert ( self.handler:getHandler(3):getClass() == BesetGemOpHandler )
		assert ( self.handler:getHandler(4):getClass() == UnbesetGemOpHandler )
		assert ( self.handler:getHandler(5):getClass() == CombineGemOpHandler )
		assert ( self.handler:getHandler(6):getClass() == UpgradeGemOpHandler )
		assert ( self.handler:getHandler(7):getClass() == DropItemFromPkgHandler )
	end;
})

local TestCaseSplitArmOpHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:backRes()

		res_test_items = {
			{id=1,pile=1,decomposeGet=100}
			,{id=2,pile=1,unique=1}
			,{id=3,pile=1,unique=1}
			,{level=1,buyprice={0,0,0,0},targets={RES_TRG.MYCITY},isbind=0,pile=99,effects={{id=0,val=0}},salePrice=0,id=3000034,nobindid=0}
			,{level=2,buyprice={0,0,0,0},targets={RES_TRG.MYCITY},isbind=0,pile=99,effects={{id=0,val=0}},salePrice=0,id=3000035,nobindid=0}
			,{level=3,buyprice={0,0,0,0},targets={RES_TRG.MYCITY},isbind=0,pile=99,effects={{id=0,val=0}},salePrice=0,id=3000036,nobindid=0}
			,{level=4,buyprice={0,0,0,0},targets={RES_TRG.MYCITY},isbind=0,pile=99,effects={{id=0,val=0}},salePrice=0,id=3000037,nobindid=0}
			,{level=5,buyprice={0,0,0,0},targets={RES_TRG.MYCITY},isbind=0,pile=99,effects={{id=0,val=0}},salePrice=0,id=3000038,nobindid=0}		
			,{level=1,buyprice={0,0,0,0},targets={RES_TRG.MYCITY},isbind=1,pile=99,effects={{id=0,val=0}},salePrice=0,id=3000153,nobindid=3000034}
			,{level=2,buyprice={0,0,0,0},targets={RES_TRG.MYCITY},isbind=1,pile=99,effects={{id=0,val=0}},salePrice=0,id=3000154,nobindid=3000035}
			,{level=3,buyprice={0,0,0,0},targets={RES_TRG.MYCITY},isbind=1,pile=99,effects={{id=0,val=0}},salePrice=0,id=3000155,nobindid=3000036}
			,{level=4,buyprice={0,0,0,0},targets={RES_TRG.MYCITY},isbind=1,pile=99,effects={{id=0,val=0}},salePrice=0,id=3000156,nobindid=3000037}
			,{level=5,buyprice={0,0,0,0},targets={RES_TRG.MYCITY},isbind=1,pile=99,effects={{id=0,val=0}},salePrice=0,id=3000157,nobindid=3000038}		
		}
			
		self.handler = SplitArmOpHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	test_handle = function(self)
		local g_player = self.player
		local g_cmd = {}
		
		local g_initParamsRt = {false}
		local g_collectArmsRt = {false}
		local g_collectItemRessRt = {false}
		local g_hasCanNoSplitArmsRt = {true}
		
		self.mm:mock(self.handler, '_initParams', g_initParamsRt)
		self.mm:mock(self.handler, '_collectArms', g_collectArmsRt)
		self.mm:mock(self.handler, '_collectItemRess', g_collectItemRessRt)
		self.mm:mock(self.handler, '_hasCanNoSplitArms', g_hasCanNoSplitArmsRt)
		self.mm:mock(self.handler, '_splitArms')
		
		assert ( self.handler:handle(g_player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams' )
		assertListEQ ( self.mm.params['_initParams'], {g_player, g_cmd} )
		
		self.mm:clear()
		g_initParamsRt[1] = true
		assert ( self.handler:handle(g_player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,_collectArms' )
		
		self.mm:clear()
		g_collectArmsRt[1] = true
		assert ( self.handler:handle(g_player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,_collectArms,_collectItemRess' )
		
		self.mm:clear()
		g_collectItemRessRt[1] = true
		assert ( self.handler:handle(g_player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,_collectArms,_collectItemRess,_hasCanNoSplitArms' )
		
		self.mm:clear()
		g_hasCanNoSplitArmsRt[1] = false
		assert ( self.handler:handle(g_player, g_cmd) == true )
		assert ( self.mm.walkLog == '_initParams,_collectArms,_collectItemRess,_hasCanNoSplitArms,_splitArms' )
	end;
	
	test__initParams = function(self)
		local g_player = self.player
		
		local g_cmd = {count=0}
		assert ( self.handler:_initParams(g_player, g_cmd) == false )
		
		g_cmd = {count=-1}
		assert ( self.handler:_initParams(g_player, g_cmd) == false )
		
		g_cmd = {count=MAX_SPLITARM_COUNT+1}
		assert ( self.handler:_initParams(g_player, g_cmd) == false )
		
		g_cmd = {count=1, id1=0}
		assert ( self.handler:_initParams(g_player, g_cmd) == false )
		
		g_cmd = {count=1, id1=-1}
		assert ( self.handler:_initParams(g_player, g_cmd) == false )
		
		g_cmd = {count=2, id1=1, id2=1}
		assert ( self.handler:_initParams(g_player, g_cmd) == false )
		
		g_cmd = {count=2, id1=1, id2=2}
		assert ( self.handler:_initParams(g_player, g_cmd) == true )
		assert ( table.getn(self.handler.itemIds) == 2 )
		assert ( self.handler.itemIds[1] == 1 )
		assert ( self.handler.itemIds[2] == 2 )
		assert ( self.handler.player == g_player )
	end;
	
	test__collectArms = function(self)
		self.player:getPkg():addItems({RawItemEx({resId=1, number=1}) })
		local item = self.player:getPkg():getItemByIdx(0)
		
		self.handler.player = self.player
		self.handler.itemIds = {item:getId(), 100}
		assert ( self.handler:_collectArms() == false )
		
		self.handler.itemIds = {item:getId()}
		assert ( self.handler:_collectArms() == true )
		assert ( table.getn(self.handler.items) == 1 )
		assert ( self.handler.items[1] == item )
	end;
	
	test__collectItemRess = function(self)
		self.player:getPkg():addItems({RawItemEx({resId=1, number=1}),RawItemEx({resId=2, number=1}) })
		local item1 = self.player:getPkg():getItemByIdx(0)
		local item2 = self.player:getPkg():getItemByIdx(1)
		item2:setResId(200)
		
		self.handler.items = {item1, item2}
		assert ( self.handler:_collectItemRess() == false )
		
		self.handler.items = {item1}
		assert ( self.handler:_collectItemRess() == true )
		assert ( table.getn(self.handler.itemRess) == 1 )
		assert ( self.handler.itemRess[1].id == 1 )
	end;
	
	test__hasCanNoSplitArms = function(self)
		self.handler.itemRess = {res_test_items[1], res_test_items[2]}
		assert ( self.handler:_hasCanNoSplitArms() == true )
		
		self.handler.itemRess = {res_test_items[1]}
		assert ( self.handler:_hasCanNoSplitArms() == false )
	end;
	
	test__splitArms = function(self)
		local g_getResIds = {}
		local g_combineSameItems = {}
		self.mm:mock(self.handler, '_calcSplitGetItems', {g_getResIds})
		self.mm:mock(self.handler, '_combineSameItems', {g_combineSameItems})
		self.mm:mock(self.handler, '_deleteSplitArms' )
		self.mm:mock(ItemOpSender, 'sendDecomposeResult' )
		self.mm:mock(self.handler, '_addGetItems')
		
		self.handler.player = self.player
		self.handler:_splitArms()
		assert ( self.mm.walkLog == '_calcSplitGetItems,_combineSameItems,sendDecomposeResult,_deleteSplitArms,_addGetItems' )
		assertListEQ ( self.mm.params['sendDecomposeResult'], {self.player, g_getResIds} )
		assertListEQ ( self.mm.params['_addGetItems'], {g_combineSameItems} )
	end;
	
	test__calcSplitGetItems = function(self)
		self.mm:mock(self.handler, '_getEssenceNumber', {1})
		self.mm:mock(self.handler, '_getStoneNumber', {1})
		
		self.player:getPkg():addItems({RawItemEx({resId=1, number=1}), RawItemEx({resId=1, number=1}) })
		local item1 = self.player:getPkg():getItemByIdx(0)
		local item2 = self.player:getPkg():getItemByIdx(1)
		item2:setForceLevel(1)
		
		self.handler.items = {item1, item2}
		self.handler.itemRess = {res_test_items[1], res_test_items[1]}
		local itemResIds = self.handler:_calcSplitGetItems()
		assert ( table.getn(itemResIds) == 3 )
		assert ( itemResIds[1].armResid == 1 )
		assert ( itemResIds[1].forceLevel == 0 )
		assert ( itemResIds[1].resid == 100 )
		assert ( itemResIds[1].number == 1 )

		assert ( itemResIds[2].armResid == 1 )
		assert ( itemResIds[2].forceLevel == 1 )
		assert ( itemResIds[2].resid == 100 )
		assert ( itemResIds[2].number == 1 )
		
		assert ( itemResIds[3].armResid == 1 )
		assert ( itemResIds[3].forceLevel == 1 )
		assert ( itemResIds[3].resid == FIXID.REFINESTONE )
		assert ( itemResIds[3].number == 1 )
	end;
	
	test__getEssenceNumber = function(self)
		self.mm:mock( math, 'random', {10} )
		self.mm:mock( Util, 'getRoundRandVal', {{num=1}} )
		assert ( self.handler:_getEssenceNumber() == 1 )
		assert ( self.mm.walkLog == 'random,getRoundRandVal' )
		assertListEQ ( self.mm.params['getRoundRandVal'], {res_splitarm_get_essence_num, 0.1} )
	end;
	
	test__getStoneNumber = function(self)
		self.mm:mock( math, 'random', {10} )
		self.mm:mock( Util, 'getRoundRandVal', {{num=2}} )
		self.mm:mock( math, 'min', {1} )
		assert ( self.handler:_getStoneNumber(1) == 1 )
		assert ( self.mm.walkLog == 'random,getRoundRandVal,min' )
		assertListEQ ( self.mm.params['getRoundRandVal'], {res_splitarm_get_stone_num, 0.1} )
		assertListEQ ( self.mm.params['min'], {2,1} )
	end;
	
	test__deleteSplitArms = function(self)
		self.mm:mock( ItemMsgSender, 'sendDelItem' )
		self.mm:mock( self.player:getPkg(), 'delItemById' )
		
		self.handler.player = self.player
		self.handler.itemIds = {1,2}
		self.handler:_deleteSplitArms()
		
		assert ( self.mm.walkLog == 'sendDelItem,delItemById,sendDelItem,delItemById' )
		assertListEQ ( self.mm.params['sendDelItem.1'],  {self.player, 1} )
		assertListEQ ( self.mm.params['sendDelItem.2'],  {self.player, 2} )
		assertListEQ ( self.mm.params['delItemById.1'],  {1} )
		assertListEQ ( self.mm.params['delItemById.2'],  {2} )
	end;
	
	test__combineSameItems = function(self)
		local resIds = {{resid=1,number=1},{resid=1,number=2},{resid=2,number=1}}
		local ids = self.handler:_combineSameItems(resIds)
		assert ( table.getn(ids) == 2 )
		assert ( ids[1].resid == 1 )
		assert ( ids[1].number == 3 )
		assert ( ids[2].resid == 2 )
		assert ( ids[2].number == 1 )
	end;

	test__addGetItems = function(self)
		g_resIds = {{resid=FIXID.ESSENCE_LVL1,number=1}}
		self.handler.player = self.player
		self.handler:_addGetItems(g_resIds)
		assert ( self.player:getPkg():getItemNumber(FIXID.ESSENCE_LVL1) == 1 )
	end;
})

local TestCaseHeroWearOrPkgItemBaseOp = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		TestCaseHelper:backRes()
		self.handler = HeroWearOrPkgItemBaseOp()
		
		res_test_items = {{id=1,pile=1},{id=2,pile=1},{id=3,pile=1,apos=HEROARM_POS.HEAD-1},{id=4,pile=1,apos=HEROARM_POS.SHOES+1},{id=5,pile=1,apos=HEROARM_POS.SHOES}}
		self.resItem = {id=10000, resId=3, number=3, forceLevel=1, isBind=0, attrs={count=0,attrs={}}, gems={count=0,gems={}} }
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	test__baseInitParams = function(self)
		local g_cmd = {}
		local g_getHeroRt = {{}}
		local g_getItemRt = {}
		self.mm:mock(self.handler, '_getHero', g_getHeroRt)
		self.mm:mock(self.handler, '_getItem', g_getItemRt)
		assert ( self.handler:_baseInitParams(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_getHero,_getItem' )
		assertListEQ ( self.mm.params['_getHero'], {self.player, g_cmd} )
		assertListEQ ( self.mm.params['_getItem'], {self.player, g_getHeroRt[1], g_cmd} )
		
		self.mm:clear()
		g_getItemRt[1] = {}
		g_getItemRt[2] = 2
		assert ( self.handler:_baseInitParams(self.player, g_cmd) == true )
		assert ( self.handler.player == self.player )
		assert ( self.handler.hero == g_getHeroRt[1] )
		assert ( self.handler.item == g_getItemRt[1] )
		assert ( self.handler.armPos == g_getItemRt[2] )
	end;	
	
	test__getHero = function(self)
		assert ( self.handler:_getHero(self.player, {hid=0}) == nil )
		assert ( self.handler:_getHero(self.player, {hid=self.hero:getId()}) == self.hero )
	end;
	
	test__getItem = function(self)
		assert ( self.handler:_getItem(self.player, nil, {id=0}) == nil )
		
		self.player:getPkg():addItems({RawItemEx({resId=1, number=1})})
		local item = self.player:getPkg():getItemByResId(1)
		local rtItem, armPos = self.handler:_getItem(self.player, nil, {id=item:getId()})
		assert ( rtItem == item )
		assert ( armPos == 0 )
		
		local rtItem, armPos = self.handler:_getItem(self.player, self.hero, {id=10000})
		assert ( rtItem == nil )
		assert ( armPos == 0 )
		
		self.hero:getWearContainer():wear(1, LuaItemEx(self.resItem))
		local rtItem, armPos = self.handler:_getItem(self.player, self.hero, {id=10000})
		assert ( rtItem:getId() == 10000 )
		assert ( armPos == 1 )
	end;
	
	test__isNullHeroOrHeroFree = function(self)
		self.handler.hero = nil;
		assert ( self.handler:_isNullHeroOrHeroFree() == true )
		
		self.handler.hero = self.hero
		self.hero:setState(1)
		assert ( self.handler:_isNullHeroOrHeroFree() == false )
		
		self.hero:setState(0)
		assert ( self.handler:_isNullHeroOrHeroFree() == true )
	end;	
	
	test__isCanBesetForceArm = function(self)
		self.handler.item = LuaItemEx(self.resItem)
		assert ( self.handler:_isCanBesetForceArm() == false )
		
		self.handler.item:setResId(4)
		assert ( self.handler:_isCanBesetForceArm() == false )
		
		self.handler.item:setResId(5)
		assert ( self.handler:_isCanBesetForceArm() == true )	
	end;
	
	test__recalHeroAttrs = function(self)
		self.mm:mock( HeroAttrHelper, 'recalcAttrs' )
		
		self.handler:_recalHeroAttrs()
		assert ( self.mm.walkLog == '' )
		
		self.handler.player = self.player
		self.handler.hero = self.hero
		self.handler:_recalHeroAttrs()
		assert ( self.mm.walkLog == 'recalcAttrs' )
		assertListEQ ( self.mm.params['recalcAttrs'], {self.player, self.hero} )		
	end;	

	test__sendItem = function(self)
		self.handler.player = self.player
		self.handler.item = {}
		
		self.mm:mock(ItemMsgSender, 'sendItem')
		self.mm:mock(HeroAttrSender, 'sendWear')
		
		self.handler:_sendItem()
		assert ( self.mm.walkLog == 'sendItem' )
		assertListEQ ( self.mm.params['sendItem'], {self.player, self.handler.item} )
		
		self.handler.hero = self.hero
		self.handler.armPos = 1
		self.mm:clear()
		self.handler:_sendItem()
		assert ( self.mm.walkLog == 'sendWear' )
		assertListEQ ( self.mm.params['sendWear'], {self.player, self.hero, 1} )		
	end;
})

local TestCaseIntensifyArmOpHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		TestCaseHelper:backRes()
		self.handler = IntensifyArmOpHandler()
		
		res_test_items = {{id=1,pile=1},{id=2,pile=1},{id=3,pile=1,apos=HEROARM_POS.HEAD-1},{id=4,pile=1,apos=HEROARM_POS.SHOES+1},{id=5,pile=1,apos=HEROARM_POS.SHOES}}
		self.resItem = {id=10000, resId=3, number=3, forceLevel=1, isBind=0, attrs={count=0,attrs={}}, gems={count=0,gems={}} }
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	test_handle = function(self)
		local g_cmd = {}
		
		local g_initParamsRt = {false}
		local g_isNullHeroOrHeroFreeRt = {false}
		local g_isMaxForceLevelRt = {true}
		local g_isCanForceArmRt = {false}
		local g_isEnoughExpendsRt = {false}
		local g_expends = {}
		
		self.mm:mock(self.handler, '_initParams', g_initParamsRt )
		self.mm:mock(self.handler, '_isNullHeroOrHeroFree', g_isNullHeroOrHeroFreeRt )
		self.mm:mock(self.handler, '_isMaxForceLevel', g_isMaxForceLevelRt )
		self.mm:mock(self.handler, '_isCanForceArm', g_isCanForceArmRt )
		self.mm:mock(self.handler, '_getExpends', {g_expends} )
		self.mm:mock(WUtil, 'subExpends' )
		self.mm:mock(self.handler, '_intensifyArm')
		self.mm:mock(WUtil, 'isEnoughExpends', g_isEnoughExpendsRt )
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(TaskFinisher, 'trigerTask')
		
		assert ( self.handler:handle(self.player, g_cmd) == false )
		
		assertListEQ ( self.mm.params['_initParams'], {self.player, g_cmd} )
		
		self.mm:clear()
		g_initParamsRt[1] = true
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,_isNullHeroOrHeroFree,sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100027, ''} )
		
		self.mm:clear()
		g_isNullHeroOrHeroFreeRt[1] = true
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,_isNullHeroOrHeroFree,_isMaxForceLevel' )
		
		self.mm:clear()
		g_isMaxForceLevelRt[1] = false
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,_isNullHeroOrHeroFree,_isMaxForceLevel,_isCanForceArm' )
		
		self.mm:clear()
		g_isCanForceArmRt [1] = true
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,_isNullHeroOrHeroFree,_isMaxForceLevel,_isCanForceArm,_getExpends,isEnoughExpends' )
		assertListEQ ( self.mm.params['isEnoughExpends'], {g_expends} )
		
		self.mm:clear()
		g_isEnoughExpendsRt [1] = true
		assert ( self.handler:handle(self.player, g_cmd) == true )
		assert ( self.mm.walkLog == '_initParams,_isNullHeroOrHeroFree,_isMaxForceLevel,_isCanForceArm,_getExpends,isEnoughExpends,subExpends,_intensifyArm,trigerTask' )
		assertListEQ ( self.mm.params['subExpends'], {g_expends} )
		assertListEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.STRONG_ARM} )
	end;
	
	test__initParams = function(self)
		local g_cmd = {}
		local g_baseInitParamsRt = {false}
		self.mm:mock(self.handler, '_baseInitParams', g_baseInitParamsRt)
		
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		assert ( self.mm.walkLog == '_baseInitParams' )
		assertListEQ ( self.mm.params['_baseInitParams'], {self.player, g_cmd} )
		
		self.mm:clear()
		g_baseInitParamsRt[1] = true
		assert ( self.handler:_initParams(self.player, g_cmd) == true )
		assert ( self.mm.walkLog == '_baseInitParams' )
	end;
	
	test__isMaxForceLevel = function(self)
		self.handler.item = LuaItemEx(self.resItem)
		self.handler.item:setForceLevel(res_max_forcelevel)
		assert ( self.handler:_isMaxForceLevel() == true )
		
		self.handler.item:setForceLevel(res_max_forcelevel + 1)
		assert ( self.handler:_isMaxForceLevel() == true )
		
		self.handler.item:setForceLevel(res_max_forcelevel - 1)
		assert ( self.handler:_isMaxForceLevel() == false )
	end;
	
	test__isCanForceArm = function(self)
		self.handler.item = LuaItemEx(self.resItem)
		assert ( self.handler:_isCanForceArm() == false )
		
		self.handler.item:setResId(4)
		assert ( self.handler:_isCanForceArm() == false )
		
		self.handler.item:setResId(5)
		assert ( self.handler:_isCanForceArm() == true )
	end;
	
	test__getExpends = function(self)
		local g_expends = {}
		
		self.handler.item = LuaItemEx(self.resItem)
		self.handler.player = self.player
		
		self.mm:mock(WUtil, 'createExpendObjs', {g_expends})
		assert ( self.handler:_getExpends() == g_expends )
		assert ( self.mm.walkLog == 'createExpendObjs' )
		assertListEQ ( self.mm.params['createExpendObjs'], {self.player, 'nil', res_force_arms[2].expends} )
	end;
	
	test__intensifyArm = function(self)
		self.handler.player = self.player
		self.handler.item = LuaItemEx(self.resItem)
		
		self.mm:mock(self.handler, '_armUpgradeForceLevel' )
		self.mm:mock(self.handler, '_recalItemAppendAttrs' )
		self.mm:mock(self.handler.item, 'bind' )
		self.mm:mock(self.handler, '_recalHeroAttrs' )
		self.mm:mock(self.handler, '_sendItem' )
		self.mm:mock(ItemOpSender, 'sendIntensifyResult')
		
		self.handler:_intensifyArm()
		
		assert ( self.mm.walkLog == '_armUpgradeForceLevel,_recalItemAppendAttrs,bind,_recalHeroAttrs,_sendItem,sendIntensifyResult' )
		assertListEQ ( self.mm.params['sendIntensifyResult'], {self.player, self.handler.item} )
	end;
	
	test__armUpgradeForceLevel = function(self)
		self.handler.item = LuaItemEx(self.resItem)
		local oldForceLevel = self.handler.item:getForceLevel()
		self.handler:_armUpgradeForceLevel()
		assert ( self.handler.item:getForceLevel() == oldForceLevel + 1 )
	end;
	
	test__recalItemAppendAttrs = function(self)
		self.resItem.attrs.attrs[1] = {attr=0,val=0,unit=0}
		self.resItem.attrs.attrs[2] = {attr=0,val=0,unit=0}
		self.resItem.attrs.attrs[3] = {attr=0,val=0,unit=0}
		self.resItem.attrs.attrs[4] = {attr=0,val=0,unit=0}
		self.resItem.attrs.attrs[5] = {attr=0,val=0,unit=0}
		self.resItem.attrs.attrs[6] = {attr=0,val=0,unit=0}
		self.handler.item = LuaItemEx(self.resItem)
		
		self.handler.item:addAttr({attr=ATTR.ST_B, val=3, unit=0})
		self.handler.item:addAttr({attr=ATTR.PH_B, val=0, unit=0})
		self.handler.item:addAttr({attr=ATTR.AG_B, val=111, unit=0})
		
		local effect = res_force_arms[self.handler.item:getForceLevel()].effect
		self.handler:_recalItemAppendAttrs()
		
		assert ( self.handler.item:getAttr(ATTR.ST_A).val == 1 )  -- min value is 1
		assert ( self.handler.item:getAttr(ATTR.PH_A).val == 0 )
		assert ( self.handler.item:getAttr(ATTR.AG_A).val == math.floor(effect*111/100) )
	end;
})
	
local TestCaseBesetGemOpHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		TestCaseHelper:backRes()
		self.handler = BesetGemOpHandler()
		
		res_test_items = {{id=1,pile=1},{id=2,pile=1},{id=3,pile=1,apos=HEROARM_POS.HEAD-1},{id=4,pile=1,apos=HEROARM_POS.SHOES+1},{id=5,pile=1,apos=HEROARM_POS.SHOES}
			,{id=1001, effects={{unit=VAL_UNIT.VAL,id=RES_EFF.H_ADD_STR,val=18}}}
			,{id=1002, effects={{unit=VAL_UNIT.VAL,id=RES_EFF.H_ADD_STR,val=18}}}
			,{id=1003, effects={{unit=VAL_UNIT.VAL,id=RES_EFF.H_ADD_AGILE,val=18}}}
			,{id=1004, effects={{unit=VAL_UNIT.VAL,id=RES_EFF.H_ADD_PHY,val=18}}}
		}
		self.resItem = {id=10000, resId=3, number=3, forceLevel=1, isBind=0, attrs={count=0,attrs={}}, gems={count=0,gems={}} }
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	test_handle = function(self)
		local g_cmd = {}
		
		local g_initParamsRt = {false}
		local g_isValidGemRt = {false}
		local g_isNullHeroOrHeroFreeRt = {false}
		local g_isCanBesetArmRt = {false}
		local g_isBesetGemstFullRt = {true}
		local g_hasBesetedSameTypeGem = {true}
		
		self.mm:mock(self.handler, '_initParams', g_initParamsRt )
		self.mm:mock(self.handler, '_isValidGem', g_isValidGemRt )
		self.mm:mock(self.handler, '_isNullHeroOrHeroFree', g_isNullHeroOrHeroFreeRt )
		self.mm:mock(self.handler, '_isCanBesetArm', g_isCanBesetArmRt )
		self.mm:mock(self.handler, '_isBesetGemstFull', g_isBesetGemstFullRt )
		self.mm:mock(self.handler, '_hasBesetedSameTypeGem', g_hasBesetedSameTypeGem )
		self.mm:mock(self.handler, '_besetGem')
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(TaskFinisher, 'trigerTask')
		
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assertListEQ ( self.mm.params['_initParams'], {self.player, g_cmd} )
		
		self.mm:clear()
		g_initParamsRt[1] = true
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,_isValidGem' )
		
		self.mm:clear()
		g_isValidGemRt[1] = true
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,_isValidGem,_isNullHeroOrHeroFree,sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100028, ''} )
		
		self.mm:clear()
		g_isNullHeroOrHeroFreeRt[1] = true
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,_isValidGem,_isNullHeroOrHeroFree,_isCanBesetArm' )
		
		self.mm:clear()
		g_isCanBesetArmRt[1] = true
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,_isValidGem,_isNullHeroOrHeroFree,_isCanBesetArm,_isBesetGemstFull' )
		
		self.mm:clear()
		g_isBesetGemstFullRt [1] = false
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,_isValidGem,_isNullHeroOrHeroFree,_isCanBesetArm,_isBesetGemstFull,_hasBesetedSameTypeGem' )
		
		self.mm:clear()
		g_hasBesetedSameTypeGem [1] = false
		assert ( self.handler:handle(self.player, g_cmd) == true )
		assert ( self.mm.walkLog == '_initParams,_isValidGem,_isNullHeroOrHeroFree,_isCanBesetArm,_isBesetGemstFull,_hasBesetedSameTypeGem,_besetGem,trigerTask' )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.BESET_GEM} )
	end;
	
	test__initParams = function(self)
		local g_cmd = {gid=1001}
		
		local g_baseInitParamsRt = {false}
		self.mm:mock(self.handler, '_baseInitParams', g_baseInitParamsRt)
		
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_baseInitParams' )
		assertListEQ ( self.mm.params['_baseInitParams'], {self.player, g_cmd} )

		self.mm:clear()
		g_baseInitParamsRt[1] = true
		assert ( self.handler:_initParams(self.player, g_cmd) == true )
		assert ( self.mm.walkLog == '_baseInitParams' )
		assert ( self.handler.gemResId == 1001 )
	end;
	
	test__isValidGem = function(self)
		self.handler.player = self.player
		self.handler.gemResId = FIXID.FIRSTGEM - 1
		assert ( self.handler:_isValidGem() == false )
		
		self.handler.gemResId = FIXID.LASTGEM + 1
		assert ( self.handler:_isValidGem() == false )
		
		self.handler.gemResId = FIXID.FIRSTGEM
		assert ( self.handler:_isValidGem() == false )
		
		self.player:getPkg():addItems({RawItemEx({resId=FIXID.FIRSTGEM, number=1})})
		assert ( self.handler:_isValidGem() == true )
	end;
	
	test__isCanBesetArm = function(self)
		self.handler.item = LuaItemEx(self.resItem)
		assert ( self.handler:_isCanBesetArm() == false )
		
		self.handler.item:setResId(4)
		assert ( self.handler:_isCanBesetArm() == false )
		
		self.handler.item:setResId(5)
		assert ( self.handler:_isCanBesetArm() == true )
	end;
	
	test__isBesetGemstFull = function(self)
		self.handler.item = LuaItemEx(self.resItem)
		assert ( self.handler:_isBesetGemstFull() == false )
		
		self.handler.item:addGem(1001)
		self.handler.item:addGem(1003)
		self.handler.item:addGem(1004)
		assert ( self.handler:_isBesetGemstFull() == true )
	end;
	
	test__hasBesetedSameTypeGem = function(self)
		self.handler.item = LuaItemEx(self.resItem)
		self.handler.gemResId = 1003
		assertEQ ( self.handler:_hasBesetedSameTypeGem(), false )
		self.handler.item:addGem(1001)
		assertEQ ( self.handler:_hasBesetedSameTypeGem(), false )
		self.handler.gemResId = 1003
		assertEQ ( self.handler:_hasBesetedSameTypeGem(), false )
		self.handler.gemResId = 1002
		assertEQ ( self.handler:_hasBesetedSameTypeGem(), true )
	end;
	
	test__besetGem = function(self)
		self.handler.item = LuaItemEx(self.resItem)
		
		self.mm:mock(self.handler.item, 'bind')
		self.mm:mock(self.handler, '_besetGemToArm')
		self.mm:mock(self.handler, '_subGemFromPkg')
		self.mm:mock(self.handler, '_recalHeroAttrs')
		self.mm:mock(self.handler, '_sendItem')
		self.mm:mock(ItemOpSender, 'sendBesetResult')

		self.handler.player = self.player
		
		self.handler:_besetGem()
		
		assert ( self.mm.walkLog == '_besetGemToArm,bind,_subGemFromPkg,_recalHeroAttrs,_sendItem,sendBesetResult' )
		assertListEQ ( self.mm.params['sendBesetResult'], {self.player, self.handler.item} )
	end;
	
	test__besetGemToArm = function(self)
		self.handler.gemResId = 1
		self.handler.item = LuaItemEx(self.resItem)
		
		self.handler:_besetGemToArm()
		assert ( self.handler.item:getGemsCount() == 1 )
		assert ( self.handler.item:getGemByIdx(0) == 1 )
	end;
	
	test__subGemFromPkg = function(self)
		self.handler.gemResId = 1
		self.handler.player = self.player
		
		self.player:getPkg():addItems({RawItemEx({resId=1, number=1})})
		assert ( self.player:getPkg():getItemNumber(1) == 1 )
		self.handler:_subGemFromPkg()
		assert ( self.player:getPkg():getItemNumber(1) == 0 )
		assert ( selectSendMsgCnt_t('has@_d:1') == 1 )
	end;
})

local TestCaseUnbesetGemOpHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		TestCaseHelper:backRes()
		self.handler = UnbesetGemOpHandler()
		
		res_test_items = {{id=1,pile=1},{id=2,pile=1},{id=3,pile=1,apos=HEROARM_POS.HEAD-1},{id=4,pile=1,apos=HEROARM_POS.SHOES+1},{id=5,pile=1,apos=HEROARM_POS.SHOES}}
		self.resItem = {id=10000, resId=3, number=3, forceLevel=1, isBind=0, attrs={count=0,attrs={}}, gems={count=0,gems={}} }	
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	test_handle = function(self)
		local g_cmd = {}
		
		local g_initParamsRt = {false}
		local g_isValidGemGridPosRt = {false}
		local g_isNullHeroOrHeroFreeRt = {false}
		local g_addGemsToPkgRt = {false}
		
		self.mm:mock(self.handler, '_initParams', g_initParamsRt )
		self.mm:mock(self.handler, '_isValidGemGridPos', g_isValidGemGridPosRt )
		self.mm:mock(self.handler, '_isNullHeroOrHeroFree', g_isNullHeroOrHeroFreeRt )
		self.mm:mock(self.handler, '_addGemsToPkg', g_addGemsToPkgRt )
		self.mm:mock(self.handler, '_unbesetGems')
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assertListEQ ( self.mm.params['_initParams'], {self.player, g_cmd} )
		
		self.mm:clear()
		g_initParamsRt[1] = true
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,_isValidGemGridPos' )
		
		self.mm:clear()
		g_isValidGemGridPosRt[1] = true
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,_isValidGemGridPos,_isNullHeroOrHeroFree,sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100029, ''} )
		
		self.mm:clear()
		g_isNullHeroOrHeroFreeRt[1] = true
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,_isValidGemGridPos,_isNullHeroOrHeroFree,_addGemsToPkg,sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100030, ''} )
		
		self.mm:clear()
		g_addGemsToPkgRt [1] = true
		assert ( self.handler:handle(self.player, g_cmd) == true )
		assert ( self.mm.walkLog == '_initParams,_isValidGemGridPos,_isNullHeroOrHeroFree,_addGemsToPkg,_unbesetGems' )	
	end;
	
	test__initParams = function(self)
		local g_cmd = {gpos=1}
		
		local g_baseInitParamsRt = {false}
		self.mm:mock(self.handler, '_baseInitParams', g_baseInitParamsRt)
		
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_baseInitParams' )
		assertListEQ ( self.mm.params['_baseInitParams'], {self.player, g_cmd} )

		self.mm:clear()
		g_baseInitParamsRt[1] = true
		assert ( self.handler:_initParams(self.player, g_cmd) == true )
		assert ( self.mm.walkLog == '_baseInitParams' )
		assert ( self.handler.removeGemPos == 1 )	
	end;
	
	test__isValidGemGridPos = function(self)
		self.handler.item = LuaItemEx(self.resItem)
		
		self.handler.removeGemPos = 0
		assert ( self.handler:_isValidGemGridPos() == false )
		
		self.handler.removeGemPos = -1
		assert ( self.handler:_isValidGemGridPos() == false )
		
		self.handler.item:addGem(1001)
		self.handler.removeGemPos = 0
		assert ( self.handler:_isValidGemGridPos() == true )
		
		self.handler.removeGemPos = 1
		assert ( self.handler:_isValidGemGridPos() == false )
		
		self.handler.removeGemPos = -1
		assert ( self.handler:_isValidGemGridPos() == true )
	end;
	
	test__addGemsToPkg = function(self)
		self.handler.item = LuaItemEx(self.resItem)
		self.handler.item:addGem(1)
		self.handler.item:addGem(2)
		
		self.handler.player = self.player
		self.handler.removeGemPos = -1
		assert ( self.handler:_addGemsToPkg() == true )
		assert ( self.player:getPkg():getItemNumber(1) == 1 )
		assert ( self.player:getPkg():getItemNumber(2) == 1 )
	
		self.handler.removeGemPos = 0
		assert ( self.handler:_addGemsToPkg() == true )
		assert ( self.player:getPkg():getItemNumber(1) == 2 )
		assert ( self.player:getPkg():getItemNumber(2) == 1 )
		
		self.handler.removeGemPos = 1
		assert ( self.handler:_addGemsToPkg() == true )
		assert ( self.player:getPkg():getItemNumber(1) == 2 )
		assert ( self.player:getPkg():getItemNumber(2) == 2 )
		
		self.mm:mock(self.player:getPkg(), 'addItemsNoTip', {false})
		assert ( self.handler:_addGemsToPkg() == false )
	end;
	
	test__unbesetGems = function(self)
		self.handler.player = self.player
		self.handler.item = {}
		
		self.mm:mock(self.handler, '_unbesetGemsFromArm')
		self.mm:mock(self.handler, '_recalHeroAttrs')
		self.mm:mock(self.handler, '_sendItem')
		self.mm:mock(ItemOpSender, 'sendBesetResult')
		
		self.handler:_unbesetGems()
		
		assert ( self.mm.walkLog == '_unbesetGemsFromArm,_recalHeroAttrs,_sendItem,sendBesetResult' )
		assertListEQ ( self.mm.params['sendBesetResult'], {self.player, self.handler.item} )
	end;
	
	test__unbesetGemsFromArm = function(self)
		self.handler.item = LuaItemEx(self.resItem)
		self.handler.item:addGem(1)
		self.handler.item:addGem(2)
		
		self.handler.removeGemPos = -1
		self.handler:_unbesetGemsFromArm()
		assert ( self.handler.item:getGemsCount() == 0 )
		
		self.handler.item:clearGems()
		self.handler.item:addGem(1)
		self.handler.item:addGem(2)
		self.handler.removeGemPos = 0
		self.handler:_unbesetGemsFromArm()
		assert ( self.handler.item:getGemsCount() == 1 )
		assert ( self.handler.item:getGemByIdx(0) == 2 )
		
		self.handler.item:clearGems()
		self.handler.item:addGem(1)
		self.handler.item:addGem(2)
		self.handler.removeGemPos = 1
		self.handler:_unbesetGemsFromArm()
		assert ( self.handler.item:getGemsCount() == 1 )
		assert ( self.handler.item:getGemByIdx(0) == 1 )
	end;
})


local TestCaseCombineGemOpHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.handler = CombineGemOpHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local g_isValidRt = {false}
		local g_addGemsToPkgRt = {false}
		
		self.mm:mock(self.handler, '_initParams')
		self.mm:mock(self.handler, '_isValid', g_isValidRt)
		self.mm:mock(self.handler, '_addGemsToPkg', g_addGemsToPkgRt)
		self.mm:mock(self.handler, '_subExpendGems')
		self.mm:mock(self.handler, '_sendResult')
		self.mm:mock(TaskFinisher, 'trigerTask')
		
		local g_cmd = {}
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,_isValid' )
		assertListEQ ( self.mm.params['_initParams'], {self.player, g_cmd} )
		
		self.mm:clear()
		g_isValidRt[1] = true
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,_isValid,_addGemsToPkg' )
		
		self.mm:clear()
		g_addGemsToPkgRt[1] = true
		assert ( self.handler:handle(self.player, g_cmd) == true )
		assert ( self.mm.walkLog == '_initParams,_isValid,_addGemsToPkg,_subExpendGems,_sendResult,trigerTask' )
		assertListEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.MERGE_GEM} )
	end;
	
	test__initParams = function(self)
		local g_cmd = {gid=1, clevel=2, batch=1}
		self.handler:_initParams(self.player, g_cmd)
		assert ( self.handler.player == self.player )
		assert ( self.handler.gemResId == 1 )
		assert ( self.handler.comblineLevel == 2 )
		assert ( self.handler.isBatch == true )
	end;
	
	test__isValid = function(self)
		self.handler.gemResId = 1
		self.handler.comblineLevel = 2
		local g_isGemRt = {false}
		local g_isMaxGemLevelRt = {true}
		local g_isValidCombineLevelRt = {false}
		local g_hasEnoughGemsRt = {false}
		
		self.mm:mock(GemUtil, 'isGem', g_isGemRt)
		self.mm:mock(GemUtil, 'isMaxGemLevel', g_isMaxGemLevelRt)
		self.mm:mock(GemUtil, 'isValidCombineLevel', g_isValidCombineLevelRt)
		self.mm:mock(self.handler, '_hasEnoughGems', g_hasEnoughGemsRt)
		
		assert ( self.handler:_isValid() == false )
		assert ( self.mm.walkLog == 'isGem' )
		assertListEQ ( self.mm.params['isGem'], {1} )
		
		self.mm:clear()
		g_isGemRt[1] = true
		assert ( self.handler:_isValid() == false )
		assert ( self.mm.walkLog == 'isGem,isMaxGemLevel' )
		assertListEQ ( self.mm.params['isMaxGemLevel'], {1} )
		
		self.mm:clear()
		g_isMaxGemLevelRt[1] = false
		assert ( self.handler:_isValid() == false )
		assert ( self.mm.walkLog == 'isGem,isMaxGemLevel,isValidCombineLevel' )
		assertListEQ ( self.mm.params['isValidCombineLevel'], {2} )
		
		self.mm:clear()
		g_isValidCombineLevelRt[1] = true
		assert ( self.handler:_isValid() == false )
		assert ( self.mm.walkLog == 'isGem,isMaxGemLevel,isValidCombineLevel,_hasEnoughGems' )
		
		self.mm:clear()
		g_hasEnoughGemsRt[1] = true
		assert ( self.handler:_isValid() == true )
		assert ( self.mm.walkLog == 'isGem,isMaxGemLevel,isValidCombineLevel,_hasEnoughGems' )
	end;
	
	test__addGemsToPkg = function(self)
		self.handler.gemResId = 1001
		self.handler.player = self.player
		
		local g_calcSuccCombineNumberRt = {0}
		local g_addItemsRt = {false}
		self.mm:mock(self.handler, '_calcSuccCombineNumber', g_calcSuccCombineNumberRt)
		self.mm:mock(self.handler, '_getCanCombineTimes', {1})
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(GemUtil, 'getNextLevelResId', {1002})
		self.mm:mock(self.player:getPkg(), 'addItems', g_addItemsRt)
		
		assert ( self.handler:_addGemsToPkg() == true )
		assert ( self.mm.walkLog == '_getCanCombineTimes,_calcSuccCombineNumber,sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100035, ''} )
		assert ( self.handler.succNumber == 0 )
		
		self.mm:clear()
		g_calcSuccCombineNumberRt[1] = 2
		assert ( self.handler:_addGemsToPkg() == false )
		assert ( self.mm.walkLog == '_getCanCombineTimes,_calcSuccCombineNumber,getNextLevelResId,addItems,sendWarningMsgArgs' )
		assert ( self.mm.params['addItems'][1][1]:getNumber() == 2 )
		assert ( self.mm.params['addItems'][1][1]:getResId() == 1002 )
		assertListEQ ( self.mm.params['getNextLevelResId'], {1001} )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100034, ''} )
		assert ( self.handler.succNumber == 2 )
		
		self.mm:clear()
		g_addItemsRt[1] = true
		assert ( self.handler:_addGemsToPkg() == true )
		assert ( self.mm.walkLog == '_getCanCombineTimes,_calcSuccCombineNumber,getNextLevelResId,addItems' )
	end;
	
	test__subExpendGems = function(self)
		self.handler.gemResId = 1001
		self.handler.comblineLevel = 1
		self.handler.player = self.player
		
		local g_expends = {}
		
		self.mm:mock(self.handler, '_getCanCombineTimes', {2})
		self.mm:mock(GemUtil, 'getCombineNeedNumber', {3})
		self.mm:mock(WUtil, 'createExpendObjs', {g_expends})
		self.mm:mock(WUtil, 'subExpends')
		
		self.handler:_subExpendGems()
		assert ( self.mm.walkLog == '_getCanCombineTimes,getCombineNeedNumber,createExpendObjs,subExpends' )
		assertListEQ ( self.mm.params['getCombineNeedNumber'], {1} )
		assert ( self.mm.params['createExpendObjs'][1] == self.player )
		assert ( self.mm.params['createExpendObjs'][2] == 'nil' )
		assert ( table.getn(self.mm.params['createExpendObjs'][3]) == 1 )
		assert ( self.mm.params['createExpendObjs'][3][1].type == EXPEND_TYPE.ITEM )
		assert ( self.mm.params['createExpendObjs'][3][1].resid == 1001 )
		assert ( self.mm.params['createExpendObjs'][3][1].val == 2 * 3 )
		assertListEQ ( self.mm.params['subExpends'], {g_expends} )
	end;
	
	test__sendResult = function(self)
		self.handler.player = self.player
		self.handler.gemResId = 1
		
		self.mm:mock(GemUtil, 'getNextLevelResId', {2})
		self.mm:mock(WUtil, 'sendSuccMsgArgs')
		
		self.handler.succNumber = 0
		self.handler:_sendResult()
		assert ( self.mm.walkLog == '' )
		
		self.handler.succNumber = 1
		self.handler:_sendResult()
		assert ( self.mm.walkLog == 'getNextLevelResId,sendSuccMsgArgs' )
		assertListEQ ( self.mm.params['getNextLevelResId'], {1} )
		assertListEQ ( self.mm.params['sendSuccMsgArgs'], {self.player, 100038, '"@itemid2"'} )
	end;
	
	test__calcSuccCombineNumber = function(self)
		self.handler.gemResId = 1001
		self.handler.comblineLevel = 1
		self.handler.player = self.player

		local g_randomRt = {24}
		self.mm:mock(self.handler, '_getCanCombineTimes', {2})
		self.mm:mock(math, 'random', g_randomRt)
		assert ( self.handler:_calcSuccCombineNumber() == 2 )
		assertListEQ ( self.mm.params['random'], {100} )		
		
		g_randomRt[1] = 25
		assert ( self.handler:_calcSuccCombineNumber() == 2 )
		
		g_randomRt[1] = 26
		assert ( self.handler:_calcSuccCombineNumber() == 0 )
	end;
	
	test__hasEnoughGems = function(self)
		local g_getCanCombineTimesRt = {1}
		self.mm:mock(self.handler, '_getCanCombineTimes', g_getCanCombineTimesRt)
		assert ( self.handler:_hasEnoughGems() == true )
		
		g_getCanCombineTimesRt[1] = 0
		assert ( self.handler:_hasEnoughGems() == false )
	end;
	
	test__getCanCombineTimes = function(self)
		self.handler.gemResId = 1001
		self.handler.comblineLevel = 1
		self.handler.player = self.player
		self.handler.isBatch = false
		
		local g_getItemNumberRt = {1}
		self.mm:mock(self.player:getPkg(), 'getItemNumber', g_getItemNumberRt)
		
		assert ( self.handler:_getCanCombineTimes() == 0 )
		assertListEQ ( self.mm.params['getItemNumber'], {1001} )
		
		g_getItemNumberRt[1] = 2
		assert ( self.handler:_getCanCombineTimes() == 1 )
		
		g_getItemNumberRt[1] = 3
		assert ( self.handler:_getCanCombineTimes() == 1 )
		
		g_getItemNumberRt[1] = 4
		assert ( self.handler:_getCanCombineTimes() == 1 )
		
		self.handler.isBatch = true
		g_getItemNumberRt[1] = 1
		assert ( self.handler:_getCanCombineTimes() == 0 )
		
		g_getItemNumberRt[1] = 2
		assert ( self.handler:_getCanCombineTimes() == 1 )
		
		g_getItemNumberRt[1] = 3
		assert ( self.handler:_getCanCombineTimes() == 1 )
		
		g_getItemNumberRt[1] = 4
		assert ( self.handler:_getCanCombineTimes() == 2 )
	end;
	
	test_handleBatchCombine = function(self)
		local rt_random = 75
		self.mm:mock(math, 'random', nil, function(val)
			if val == 100 then return rt_random
			else return 0 end
			end )
		
		self.mm:mock(WUtil, 'sendPopBoxMsg')
		self.player:getPkg():addItems({RawItemEx({resId=4500001, number=11})})
		local cmd = {gid=4500001,clevel=3,batch=1}
		assertEQ ( self.handler:handle(self.player, cmd), true )
		assertEQ ( self.mm.params['sendPopBoxMsg'], {self.player, string.format(rstr.armop.msg.batchSucces, 2, 0) } )
		
		self.mm:clear()
		rt_random = 100
		self.player:getPkg():addItems({RawItemEx({resId=4500001, number=11})})
		assertEQ ( self.handler:handle(self.player, cmd), true )
		assertEQ ( self.mm.params['sendPopBoxMsg'], {self.player, string.format(rstr.armop.msg.batchFail, 0, 3) } )
	end;
})

local TestCaseUpgradeGemOpHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		
		res_test_items = {{id=1001,level=1,pile=99},{id=1002,level=7,pile=99}}
		self.resItem = {id=10000, resId=3, number=3, forceLevel=1, isBind=0, attrs={count=0,attrs={}}, gems={count=1,gems={1001}} }	
		
		self.handler = UpgradeGemOpHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local g_cmd = {}
		
		local g_initParamsRt = {false}
		local g_isValidRt = {false}
		
		self.mm:mock(self.handler, '_initParams', g_initParamsRt)
		self.mm:mock(self.handler, '_isValid', g_isValidRt)
		self.mm:mock(self.handler, '_upgradeGemInArm')
		
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams' )
		assertListEQ ( self.mm.params['_initParams'], {self.player, g_cmd} )
		
		self.mm:clear()
		g_initParamsRt[1] = true
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,_isValid' )
		
		self.mm:clear()
		g_isValidRt[1] = true
		assert ( self.handler:handle(self.player, g_cmd) == true )
		assert ( self.mm.walkLog == '_initParams,_isValid,_upgradeGemInArm' )
	end;
	
	test__initParams = function(self)
		local g_cmd = {gpos=1}
		local g_baseInitParamsRt = {false}
		self.mm:mock(self.handler, '_baseInitParams', g_baseInitParamsRt)
		
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_baseInitParams' )
		assertListEQ ( self.mm.params['_baseInitParams'], {self.player, g_cmd} )
		
		self.mm:clear()
		self.handler.item = LuaItemEx(self.resItem)
		g_baseInitParamsRt[1] = true
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_baseInitParams' )
		
		self.mm:clear()
		g_cmd.gpos = 0
		assert ( self.handler:_initParams(self.player, g_cmd) == true )
		assert ( self.handler.gemResId == 1001 )
	end;
	
	test__isValid = function(self)
		self.handler.player = self.player
		self.handler.gemResId = 1001
		
		local g_isNullHeroOrHeroFreeRt = {false}
		local g_isMaxGemLevelRt = {true}
		local g_hasEnoughGemsRt = {false}
		
		self.mm:mock(self.handler, '_isNullHeroOrHeroFree', g_isNullHeroOrHeroFreeRt)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.mm:mock(GemUtil, 'isMaxGemLevel', g_isMaxGemLevelRt)
		self.mm:mock(self.handler, '_hasEnoughGems', g_hasEnoughGemsRt)
		
		assert ( self.handler:_isValid() == false )
		assert ( self.mm.walkLog == '_isNullHeroOrHeroFree,sendWarningMsgArgs' )
		assertListEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100033, ''})
		
		self.mm:clear()
		g_isNullHeroOrHeroFreeRt[1] = true
		assert ( self.handler:_isValid() == false )
		assert ( self.mm.walkLog == '_isNullHeroOrHeroFree,isMaxGemLevel' )
		assertListEQ ( self.mm.params['isMaxGemLevel'], {1001})
		
		self.mm:clear()
		g_isMaxGemLevelRt[1] = false
		assert ( self.handler:_isValid() == false )
		assert ( self.mm.walkLog == '_isNullHeroOrHeroFree,isMaxGemLevel,_hasEnoughGems' )
		
		self.mm:clear()
		g_hasEnoughGemsRt[1] = true
		assert ( self.handler:_isValid() == true )
		assert ( self.mm.walkLog == '_isNullHeroOrHeroFree,isMaxGemLevel,_hasEnoughGems' )
	end;
	
	test__upgradeGemInArm = function(self)
		self.handler.player = self.player
		self.handler.item = LuaItemEx(self.resItem)
		
		self.mm:mock(self.handler, '_resetGemResIdInArm')
		self.mm:mock(self.handler, '_recalHeroAttrs')
		self.mm:mock(self.handler, '_sendItem')
		self.mm:mock(self.handler, '_subExpendGems')
		self.mm:mock(self.handler, '_sendSuccResult')
		
		self.handler:_upgradeGemInArm()
		
		assert ( self.mm.walkLog == '_resetGemResIdInArm,_recalHeroAttrs,_sendItem,_subExpendGems,_sendSuccResult' )
	end;
	
	test__hasEnoughGems = function(self)
		self.handler.player = self.player
		
		local g_getItemNumberRt = {3}
		self.mm:mock(self.player:getPkg(), 'getItemNumber', g_getItemNumberRt)
		
		assert ( self.handler:_hasEnoughGems() == false )
		
		g_getItemNumberRt[1] = 4
		assert ( self.handler:_hasEnoughGems() == true )
		
		g_getItemNumberRt[1] = 5
		assert ( self.handler:_hasEnoughGems() == true )
	end;
	
	test__resetGemResIdInArm = function(self)
		self.resItem.gems.count = 1
		self.resItem.gems.gems = {1001}
		self.handler.item = LuaItemEx(self.resItem)
		self.handler.gemResId = 1001
		self.handler.gemPos = 0
		
		self.handler:_resetGemResIdInArm()
		assert ( self.handler.item:getGemByIdx(0) == 1002 )
	end;
	
	test__subExpendGems = function(self)
		self.handler.gemResId = 1001
		self.handler.player = self.player
		
		local g_expends = {}
		self.mm:mock(WUtil, 'createExpendObjs', {g_expends})
		self.mm:mock(WUtil, 'subExpends')
		
		self.handler:_subExpendGems()
		assert ( self.mm.walkLog == 'createExpendObjs,subExpends' )
		assert ( self.mm.params['createExpendObjs'][1] == self.player )
		assert ( self.mm.params['createExpendObjs'][2] == 'nil' )
		assert ( table.getn(self.mm.params['createExpendObjs'][3]) == 1 )
		assert ( self.mm.params['createExpendObjs'][3][1].type == EXPEND_TYPE.ITEM )
		assert ( self.mm.params['createExpendObjs'][3][1].resid == 1001 )
		assert ( self.mm.params['createExpendObjs'][3][1].val == 4 )
		assertListEQ ( self.mm.params['subExpends'], {g_expends} )	
	end;
	
	test__sendSuccResult = function(self)
		self.handler.player = self.player
		self.handler.gemResId = 1
		
		self.mm:mock(GemUtil, 'getNextLevelResId', {2})
		self.mm:mock(WUtil, 'sendSuccMsgArgs')
		self.handler:_sendSuccResult()
		assert ( self.mm.walkLog == 'getNextLevelResId,sendSuccMsgArgs' )
		assertListEQ ( self.mm.params['getNextLevelResId'], {1} )
		assertListEQ ( self.mm.params['sendSuccMsgArgs'], {self.player, 100037, '"@itemid2"'} )
	end;
	
	test__getFactNeedNumber = function(self)
		assert ( self.handler:_getFactNeedNumber() == GemUtil:getCombineNeedNumber(MAX_GEM_COMBINE_LEVEL) - 1 )
	end;
})

local TestCaseDropItemFromPkgHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		TestCaseHelper:createHero(self)
		self.handler = DropItemFromPkgHandler()
		
		res_test_items = { {id=1,pile=1} };
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local g_initParamsRt = {false}
		self.mm:mock(self.handler, '_initParams', g_initParamsRt)
		self.mm:mock(self.player:getPkg(), 'delItemById')
		self.mm:mock(ItemMsgSender, 'sendDelItem')
		
		g_cmd = {id=1}
		self.handler.itemId = 1
		self.handler.player = self.player
		
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams' )
		assertListEQ ( self.mm.params['_initParams'], {self.player, g_cmd} )
		
		self.mm:clear()
		g_initParamsRt[1] = true
		assert ( self.handler:handle(self.player, g_cmd) == true )
		assert ( self.mm.walkLog == '_initParams,delItemById,sendDelItem' )
		assertListEQ ( self.mm.params['delItemById'], {1} )
		assertListEQ ( self.mm.params['sendDelItem'], {self.player, 1} )
	end;
	
	test__initParams = function(self)
		self.player:getPkg():addItems({RawItemEx({resId=1, number=1}) })
		local g_item = self.player:getPkg():getItemByIdx(0)
		
		local g_cmd = {id=g_item:getId()+1}
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		g_cmd = {id=g_item:getId()}
		assert ( self.handler:_initParams(self.player, g_cmd) == true )
		assert ( self.handler.itemId ==  g_item:getId() )
		assert ( self.handler.player ==  self.player )
	end;
})

tqItemOpHandler_t_main = function(suite)
	suite:addTestCase(TestCaseItemOpHandler, 'TestCaseItemOpHandler')
	suite:addTestCase(TestCaseSplitArmOpHandler, 'TestCaseSplitArmOpHandler')
	suite:addTestCase(TestCaseHeroWearOrPkgItemBaseOp, 'TestCaseHeroWearOrPkgItemBaseOp')
	suite:addTestCase(TestCaseIntensifyArmOpHandler, 'TestCaseIntensifyArmOpHandler')
	suite:addTestCase(TestCaseBesetGemOpHandler, 'TestCaseBesetGemOpHandler')
	suite:addTestCase(TestCaseUnbesetGemOpHandler, 'TestCaseUnbesetGemOpHandler')
	suite:addTestCase(TestCaseCombineGemOpHandler, 'TestCaseCombineGemOpHandler')
	suite:addTestCase(TestCaseUpgradeGemOpHandler, 'TestCaseUpgradeGemOpHandler')
	suite:addTestCase(TestCaseDropItemFromPkgHandler, 'TestCaseDropItemFromPkgHandler')
end;


