////////////////////////////////////////////////////////////////////
requireEx('./handler/tqCC.js', [
	{
		start:'//CommDrawItem-unittest-start'
		,end:'//CommDrawItem-unittest-end'
		,items:['_drawNumber','_isNeedDrawNumber','_getNeedDrawNumber']
	}
])

TestCaseUseItemByEffectFilter = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		res_efftiems_ex=[ {'items':[3000009,3000010,3000128,3000129],'id':19} ];
		res_items_ex=[{targets:[RES_TRG.SELF_HERO],isbind:0,pile:99,effects:[{id:RES_EFF.ADD_CANSTEELSKILL,val:8}],id:3000009,nobindid:0}
			,{targets:[RES_TRG.SELF_HERO],isbind:0,pile:99,effects:[{id:RES_EFF.ADD_CANSTEELSKILL,val:8}],id:3000010,nobindid:0}
			,{targets:[RES_TRG.SELF_HERO],isbind:1,pile:99,effects:[{id:RES_EFF.ADD_CANSTEELSKILL,val:8}],id:3000128,nobindid:3000009}
			,{targets:[RES_TRG.SELF_HERO],isbind:1,pile:99,effects:[{id:RES_EFF.ADD_CANSTEELSKILL,val:8}],id:3000129,nobindid:3000010}
			];
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_filter = function() {
		var filter = UseItemByEffectFilter.snew(this.g);
		
		var itemid = 10;
		var params = [];
		this.mm.mock(filter, '_filterByEffectId', null, function(effid, outputItems){
			params.push(effid);
			outputItems.push({id:itemid++});
		});
		
		var data = {effids:[1,2]};
		assertEQ ( filter.filter(data), [{id:10},{id:11}] );
		assertEQ ( params, [1, 2] );
	};
	
	this.test__filterByEffectId_pileItems = function() {
		var filter = UseItemByEffectFilter.snew(this.g);
		
		var effid = 19;
		var curitems = [];
		filter._filterByEffectId( effid, curitems );
		assert ( curitems.length == 2 );
		assert ( curitems[0].id == 0 );
		assert ( curitems[1].id == 0 );
		
		TestCaseCondition.setPreCond(null, {item:{id:3000010, num:1} });
		var curitems = [];
		filter._filterByEffectId( effid,  curitems );
		assert ( curitems.length == 2 );
		assert ( curitems[0].id == 0 );
		assert ( curitems[1].id > 0 );
		
		TestCaseCondition.setPreCond(null, {item:{id:3000129, num:1} });
		var curitems = [];
		filter._filterByEffectId(effid, curitems );
		assert ( curitems.length == 2 );
		assert ( curitems[0].id == 0 );
		assert ( curitems[0].resid == 3000128 );
		assert ( curitems[0].number == 0 );
		assert ( curitems[0].itemres.id == 3000009 );
		assert ( curitems[0].valid == true );
		
		assert ( curitems[1].id > 0 );
		assert ( curitems[1].resid == 3000129 );
		assert ( curitems[1].number == 2 );
		assert ( curitems[1].itemres.id == 3000010 );
		assert ( curitems[1].valid == true );
	};
});

TestCaseUseItemByItemIdsFilter = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.filter = UseItemByItemIdsFilter.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_filter = function(){
		this.g.getImgr().addItem({id:1, resid:FIXID.SALVE, number:1});
		var items = this.filter.filter({itemids:[FIXID.SALVE, FIXID.REFRESHCARD]});
		assertEQ ( items, [{id:1, resid:FIXID.SALVE, number:1, itemres:ItemResUtil.findItemres(FIXID.SALVE), valid:true}
			,{id:0, resid:FIXID.REFRESHCARD, number:0, itemres:ItemResUtil.findItemres(FIXID.REFRESHCARD), valid:true}]
			);
	};
});

TestCaseCommItemInfoGetter = TestCase.extern(function(){
	this.setUp = function(){
		this.g = g_app;
		this.getter = CommItemInfoGetter.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.test_getInfo = function(){
		var item_ = {number:1, itemres:{desc:2}};
		
		var info = this.getter.getInfo(item_);
		
		assert ( info.number == 1 );
		assert ( info.desc == 2 );
		assert ( info.needNumber == 1 );
		assert ( info.isGiftGold == false );
	};
});

TestCaseGoldItemInfoGetter = TestCase.extern(function(){
	this.setUp = function(){
		this.g = g_app;
		this.getter = GoldItemInfoGetter.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.test_getInfo = function(){
		var item_ = {number:1, itemres:{desc:"{0}"}};
		
		this.g.getImgr().getPkgs().misc.giftgold = 1;
		this.g.getImgr().getPkgs().misc.gold = 2;
		
		var mm = MethodMock.snew();
		mm.mock(AccNeedGoldCalculator, 'getNeedGold', function(type, timeS){
			mm.type = type;
			mm.timeS = timeS;
			return 3;
			});
		mm.mock(this.getter, 'getAccType', function(){
			return 'build';
			});
		
		var info = this.getter.getInfo(item_, 2);
		mm.restore();
		
		assert ( mm.type == 'build' );
		assert ( mm.timeS == 2 );
		
		assert ( info.number == rstr.comm.giftgold + '1,' + rstr.comm.gold + '2');
		assert ( info.desc == 3 );
		assert ( info.needNumber == 3 );
		assert ( info.isGiftGold == true );
	};
});

TestCaseBuildGoldItemInfoGetter = TestCase.extern(function(){
	this.setUp = function(){
		this.g = g_app;
		this.getter = BuildGoldItemInfoGetter.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.test_getAccType = function(){
		assert ( this.getter.getAccType() == 'build' )
	};
});

TestCaseCultureLearnGoldItemInfoGetter = TestCase.extern(function(){
	this.setUp = function(){
		this.g = g_app;
		this.getter = CultureLearnGoldItemInfoGetter.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.test_getAccType = function(){
		assert ( this.getter.getAccType() == 'culture' )
	};
});

TestCaseSkeletonSteelGoldItemInfoGetter = TestCase.extern(function(){
	this.setUp = function(){
		this.g = g_app;
		this.getter = SkeletonSteelGoldItemInfoGetter.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.test_getAccType = function(){
		assert ( this.getter.getAccType() == 'skeleton' )
	};
});

TestCaseSkillSteelGoldItemInfoGetter = TestCase.extern(function(){
	this.setUp = function(){
		this.g = g_app;
		this.getter = SkillSteelGoldItemInfoGetter.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.test_getAccType = function(){
		assert ( this.getter.getAccType() == 'skill' )
	};
});

TestCaseCityDefGoldItemInfoGetter = TestCase.extern(function(){
	this.setUp = function(){
		this.g = g_app;
		this.getter = CityDefGoldItemInfoGetter.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.test_getAccType = function(){
		assert ( this.getter.getAccType() == 'citydef' )
	};
});

TestCaseTradingGoldItemInfoGetter = TestCase.extern(function(){
	this.setUp = function(){
		this.g = g_app;
		this.getter = TradingGoldItemInfoGetter.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.test_getAccType = function(){
		assert ( this.getter.getAccType() == 'trading' )
	};
});

TestCaseRoleTaskGoldItemInfoGetter = TestCase.extern(function(){
	this.setUp = function(){
		this.g = g_app;
		this.getter = RoleTaskGoldItemInfoGetter.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.test_getAccType = function(){
		assert ( this.getter.getAccType() == 'roletask' )
	};
});



TestCaseAccNeedGoldCalculator = TestCase.extern(function(){
	this.setUp = function(){
		this.g = g_app;
		TestCaseHelper.backRes();
		this.calc = AccNeedGoldCalculator;
		res_acc_needgolds = [{id:1,type:'build',phases:[{timeS:600,gold:3},{timeS:3600,gold:12},{timeS:21600,gold:40},{timeS:86400,gold:120}]}];
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
		TestCaseHelper.restoreRes()
	};
	
	this.test_getNeedGold = function(){
		assert ( this.calc.getNeedGold('build', 0) == 0 )
		assert ( this.calc.getNeedGold('build', 1) == 1 )
		assert ( this.calc.getNeedGold('build', 500) == 3 )
		assert ( this.calc.getNeedGold('build', 600) == 4 )
		assert ( this.calc.getNeedGold('build', 601) == 4 )
		assert ( this.calc.getNeedGold('build', 3599) == 12 )
		assert ( this.calc.getNeedGold('build', 86400) == 121 )
		assert ( this.calc.getNeedGold('build', 86400*2) == 241 )
		
		res_acc_needgolds = [{id:1,type:'build',phases:[{timeS:600,gold:3},{timeS:3600,gold:12},{timeS:21600,gold:40},{timeS:86400,gold:120},{timeS:0,gold:0}]}];
		assert ( this.calc.getNeedGold('build', 86400*2) == 241 )
		
		var alert_bak = alert;
		alert = function(msg){};
		assert ( this.calc.getNeedGold('xxx', 86400) == 0 );
		alert = alert_bak;
	};
});

TestCaseCommDrawItem = TestCase.extern(function(){
	this.setUp = function(){
		this.g = g_app;
	};
	
	this.tearDown = function(){
		TestCaseHelper.clearAll();
	};
	
	this.test__drawNumber = function(){
		var item = {exsubs:{fnum:MockDomEx.snew(), bnum:MockDomEx.snew()}};
		CommDrawItem.lc()._drawNumber(item, 1);
		assert ( TQ.getTextEx(item.exsubs.fnum) == '1' );
		assert ( TQ.getTextEx(item.exsubs.bnum) == '1' );
	};
	
	this.test__isNeedDrawNumber = function(){
		var ritem = {};
		assert ( CommDrawItem.lc()._isNeedDrawNumber(ritem) == false );
		
		var ritem = {number:0, itemres:{unique:0, pile:2}};
		assert ( CommDrawItem.lc()._isNeedDrawNumber(ritem) == true );
		
		var ritem = {number:1, itemres:{unique:1}};
		assert ( CommDrawItem.lc()._isNeedDrawNumber(ritem) == false );
		
		var ritem = {number:1, itemres:{unique:0}};
		assert ( CommDrawItem.lc()._isNeedDrawNumber(ritem) == false );
		
		var ritem = {number:1, itemres:{unique:0, pile:1}};
		assert ( CommDrawItem.lc()._isNeedDrawNumber(ritem) == false );
		
		var ritem = {number:1, itemres:{unique:0, pile:2}};
		assert ( CommDrawItem.lc()._isNeedDrawNumber(ritem) == true );
		
		var ritem = {number:1, itemres:{pile:2}};
		assert ( CommDrawItem.lc()._isNeedDrawNumber(ritem) == true );
	};
	
	this.test__getNeedDrawNumber = function() {
		var g_ritem = {number:1};
		var g_isNeedDrawNumberRt = [false];
		var mm = MMock.snew();
		mm.mock( CommDrawItem.lc(), '_isNeedDrawNumber', g_isNeedDrawNumberRt);
		
		assert ( CommDrawItem.lc()._getNeedDrawNumber(g_ritem) == '' );
		assert ( mm.params['_isNeedDrawNumber'], [g_ritem] );
	
		mm.clear();
		g_isNeedDrawNumberRt[0] = true;
		assert ( CommDrawItem.lc()._getNeedDrawNumber(g_ritem) == '1' );
		
		mm.restore();
	};
	
	this.test_drawPkgItem = function() {
		var g_item = {exsubs:{fnum:MockDomEx.snew(), bnum:MockDomEx.snew(), icon:MockDomEx.snew(), name:MockDomEx.snew()}};
		var g_ritem = {itemres:{unique:0, pile:2, name:'name', bigpic:1001}};
		
		var mm = MMock.snew();
		mm.mock( CommDrawItem.lc(), '_getNeedDrawNumber', ['1']);
		mm.mock( CommDrawItem.lc(), '_drawNumber');
		
		CommDrawItem.drawPkgItem(g_item, g_ritem);
		mm.restore();
		
		assert ( mm.walkLog == '_getNeedDrawNumber,_drawNumber' );
		assertListEQ ( mm.params['_getNeedDrawNumber'], [g_ritem, undefined] );
		assertListEQ ( mm.params['_drawNumber'], [g_item, '1'] );
		
		assert ( TQ.getTextEx(g_item.exsubs.name) == ItemNameColorGetter.getColorVal(1, 'name') );
		assert ( isInclude(IMG.getBKImage(g_item.exsubs.icon), '1001.gif') == true );
		
		assertEQ ( TQ.getClass(g_item.exsubs.icon), 'item_icon_border_level1' );
	};
	
	this.test_drawPkgItem_noNameDom = function(){
		var g_item = {exsubs:{fnum:MockDomEx.snew(), bnum:MockDomEx.snew(), icon:MockDomEx.snew()}};
		var g_ritem = {itemres:{unique:0, pile:2, bigpic:1001}};
		var mm = MMock.snew();
		mm.mock( CommDrawItem.lc(), '_getNeedDrawNumber', ['1']);
		mm.mock( CommDrawItem.lc(), '_drawNumber');
		
		CommDrawItem.drawPkgItem(g_item, g_ritem);
		mm.restore();
		
		assert ( mm.walkLog == '_getNeedDrawNumber,_drawNumber' );
		assertListEQ ( mm.params['_getNeedDrawNumber'], [g_ritem, undefined] );
		assertListEQ ( mm.params['_drawNumber'], [g_item, '1'] );
	};
});

TestCaseArmPosFilter = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.filter = ArmPosFilter.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_isFitArmPos = function(){
		assert ( this.filter.isFit({armPos:0}, {itemres:{apos:1}}) == true );
		assert ( this.filter.isFit({armPos:1}, {itemres:{apos:1}}) == true );
		assert ( this.filter.isFit({armPos:1}, {itemres:{apos:2}}) == false );
		assert ( this.filter.isFit({armPos:0}, {itemres:{}}) == false );
	};
	
	this.test_filter = function(){
		var g_filterData = {armPos:3};
		
		var g_srcItemsRt = [[{id:1,itemres:{id:1,apos:1}},{id:2,itemres:{id:2,apos:2}}]];
		var g_isFitArmPosRt = [true];
		
		this.mm.mock(this.filter, 'getSrcItems', g_srcItemsRt);
		this.mm.mock(this.filter, 'isFit', g_isFitArmPosRt);
		
		var items = this.filter.filter(g_filterData);
		assert ( items.length == 2 );
		assert ( items[0].id == 1 );
		assert ( items[1].id == 2 );
		assertEQ ( this.mm.walkLog, 'getSrcItems,isFit,isFit' );
		assertListEQ ( this.mm.params['isFit.0'], [g_filterData, g_srcItemsRt[0][0]] );
		assertListEQ ( this.mm.params['isFit.1'], [g_filterData, g_srcItemsRt[0][1]] );
		
		this.mm.clear();
		g_isFitArmPosRt[0] = false;
		items = this.filter.filter(g_filterData);
		assert ( items.length == 0 );
	};
});

TestCaseCanIntensifyArmPosFilter = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.filter = CanIntensifyArmPosFilter.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_isFit = function(){
		assert ( this.filter.isFit({armPos:0}, {itemres:{apos:1}}) == true );
		assert ( this.filter.isFit({armPos:1}, {itemres:{apos:1}}) == true );
		assert ( this.filter.isFit({armPos:1}, {itemres:{apos:2}}) == false );
		
		assert ( this.filter.isFit({armPos:0}, {itemres:{apos:0}}) == false );
		assert ( this.filter.isFit({armPos:0}, {itemres:{apos:HEROARM_POS.SHOES}}) == true );
		assert ( this.filter.isFit({armPos:0}, {itemres:{apos:HEROARM_POS.TRUMP}}) == false );
		assert ( this.filter.isFit({armPos:0}, {itemres:{apos:HEROARM_POS.HORSE}}) == false );
		
		assert ( this.filter.isFit({armPos:0}, {itemres:{}}) == false );
	};
});

TestCaseCanSaleFilterEx = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.filter = CanSaleFilterEx.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_filter = function(){
		this.g.getImgr().getPkgs().items = [{id:1,itemres:{salePrice:0}},{id:2,itemres:{salePrice:1}}];
		var items = this.filter.filter();
		assert ( items.length == 1 );
		assert ( items[0].id == 2 );
		
		var items = this.filter.filter({items:  [{id:1,itemres:{salePrice:0}},{id:2,itemres:{salePrice:1}},{id:3,itemres:{salePrice:1}}]   });
		assert ( items.length == 2 );
		assert ( items[0].id == 2 );
		assert ( items[1].id == 3 );
		
		var items = this.filter.filter({items:  [{id:1,itemres:{salePrice:1}},{id:2,gems:[],itemres:{salePrice:1}},{id:3,gems:[1001],itemres:{salePrice:1}}]   });
		assert ( items.length == 2 );
		assert ( items[0].id == 1 );
		assert ( items[1].id == 2 );
	};
});

TestCaseCanSplitArmFilter = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.filter = CanSplitArmFilter.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_filter = function(){
		this.g.getImgr().getPkgs().items = [{id:1,itemres:{decomposeGet:0}},{id:2,itemres:{decomposeGet:1}}];
		var items = this.filter.filter();
		assert ( items.length == 1 );
		assert ( items[0].id == 2 );
		
		var items = this.filter.filter({items: [{id:1,itemres:{decomposeGet:0}},{id:2,itemres:{decomposeGet:1}},{id:3,itemres:{decomposeGet:1}}] });
		assert ( items.length == 2 );
		assert ( items[0].id == 2 );
		assert ( items[1].id == 3 );
		
		var items = this.filter.filter({items: [{id:1,itemres:{decomposeGet:1}},{id:2,gems:[],itemres:{decomposeGet:1}},{id:3,gems:[1001],itemres:{decomposeGet:1}}] });
		assert ( items.length == 2 );
		assert ( items[0].id == 1 );
		assert ( items[1].id == 2 );
	};
});

TestCaseItemClassRangeFilter = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.filter = ItemClassRangeFilter.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_filter = function(){
		var g_srcItemsRt = [[{id:1,itemres:{id:1}},{id:2,itemres:{id:2}}]];
		var g_filterData = {classId:10};
		var g_needRangeRt = [{}];
		var g_isInRangeRt = [true];
		
		this.mm.mock(this.filter, 'getSrcItems', g_srcItemsRt);
		this.mm.mock(ItemClassRange, 'getRange', g_needRangeRt);
		this.mm.mock(ItemClassRange, 'isInRange', g_isInRangeRt);
			
		var items = this.filter.filter(g_filterData);
		assert ( items.length == 2 );
		assert ( items[0].id == 1 );
		assert ( items[1].id == 2 );
		assertEQ ( this.mm.walkLog, 'getSrcItems,getRange,isInRange,isInRange' );
		assertListEQ ( this.mm.params['getRange'], [10] );
		assertListEQ ( this.mm.params['isInRange.0'], [g_needRangeRt[0], 1] );
		assertListEQ ( this.mm.params['isInRange.1'], [g_needRangeRt[0], 2] );
			
		this.mm.clear();
		g_isInRangeRt[0] = false;
		items = this.filter.filter(g_filterData);
		assert ( items.length == 0 );
	};
	
	this.test_getSrcItems = function(){
		var g_items={};
		assert ( this.filter.getSrcItems() == this.g.getImgr().getPkgs().items );
		assert ( this.filter.getSrcItems({}) == this.g.getImgr().getPkgs().items );
		assert ( this.filter.getSrcItems({items:g_items}) == g_items );
	};
});

TestCaseItemLevelFilter = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.filter = ItemLevelFilter.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_isFit = function(){
		assert ( this.filter.isFit({itemLevel:0}, {itemres:{level:1}}) == true );
		assert ( this.filter.isFit({itemLevel:1}, {itemres:{level:1}}) == true );
		assert ( this.filter.isFit({itemLevel:1}, {itemres:{level:2}}) == false );
	};
});

TestCaseGemFilter = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		this.filter = GemFilter.snew(this.g);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_filter = function(){
		var g_filterData = {items:[{id:1,resid:4500001},{id:2,resid:4500002},{id:3,resid:4500003},{id:4,resid:4500014},{id:5,resid:4500011}]};
		ItemResUtil.initItemsres(g_filterData.items, 'resid');
		var items = this.filter.filter(g_filterData);
		assert ( items.length == 5 );
		assert ( items[0].id == 4 );
		assert ( items[1].id == 3 );
		assert ( items[2].id == 2 );
		assert ( items[3].id == 1 );
		assert ( items[4].id == 5 );			
	};
});



tqCC_t_main = function(suite) {
	suite.addTestCase(TestCaseUseItemByEffectFilter, 'TestCaseUseItemByEffectFilter');
	suite.addTestCase(TestCaseUseItemByItemIdsFilter, 'TestCaseUseItemByItemIdsFilter');
	suite.addTestCase(TestCaseCommItemInfoGetter, 'TestCaseCommItemInfoGetter');
	suite.addTestCase(TestCaseGoldItemInfoGetter, 'TestCaseGoldItemInfoGetter');
	suite.addTestCase(TestCaseBuildGoldItemInfoGetter, 'TestCaseBuildGoldItemInfoGetter');
	suite.addTestCase(TestCaseCultureLearnGoldItemInfoGetter, 'TestCaseCultureLearnGoldItemInfoGetter');
	suite.addTestCase(TestCaseSkeletonSteelGoldItemInfoGetter, 'TestCaseSkeletonSteelGoldItemInfoGetter');
	suite.addTestCase(TestCaseSkeletonSteelGoldItemInfoGetter, 'TestCaseSkeletonSteelGoldItemInfoGetter');
	suite.addTestCase(TestCaseSkillSteelGoldItemInfoGetter, 'TestCaseSkillSteelGoldItemInfoGetter');
	suite.addTestCase(TestCaseCityDefGoldItemInfoGetter, 'TestCaseCityDefGoldItemInfoGetter');
	suite.addTestCase(TestCaseAccNeedGoldCalculator, 'TestCaseAccNeedGoldCalculator');
	suite.addTestCase(TestCaseTradingGoldItemInfoGetter, 'TestCaseTradingGoldItemInfoGetter');
	suite.addTestCase(TestCaseRoleTaskGoldItemInfoGetter, 'TestCaseRoleTaskGoldItemInfoGetter');
	suite.addTestCase(TestCaseCommDrawItem, 'TestCaseCommDrawItem');
	suite.addTestCase(TestCaseArmPosFilter, 'TestCaseArmPosFilter');
	suite.addTestCase(TestCaseCanIntensifyArmPosFilter, 'TestCaseCanIntensifyArmPosFilter');
	suite.addTestCase(TestCaseCanSaleFilterEx, 'TestCaseCanSaleFilterEx');
	suite.addTestCase(TestCaseCanSplitArmFilter, 'TestCaseCanSplitArmFilter');
	suite.addTestCase(TestCaseItemClassRangeFilter, 'TestCaseItemClassRangeFilter');
	suite.addTestCase(TestCaseItemLevelFilter, 'TestCaseItemLevelFilter');
	suite.addTestCase(TestCaseGemFilter, 'TestCaseGemFilter');
};
