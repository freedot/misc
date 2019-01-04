require('tqUseItemHandler')
require('tqHeroResHandler_t')

local TestCaseUniqueItemHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		self.itemHdr = UniqueItemHdr()
		res_test_items={{targets={RES_TRG.SELF_HERO},isbind=0,pile=1,effects={{id=RES_EFF.ADD_CANSTEELSKILL,val=8}},id=3000009,nobindid=0}}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	test_setParam = function(self)
		local itemId = 1
		local itemres = {}
		self.itemHdr:setParam(self.player, itemId, itemres)
		
		assert ( self.itemHdr.player == self.player )
		assert ( self.itemHdr.itemId == itemId )
		assert ( self.itemHdr.itemres == itemres )
	end;
	
	setParam = function(self)
		self.resid = 3000009
		self.itemId = 1
		self.itemres = ItemResUtil:findItemres(self.resid)
		self.itemHdr:setParam(self.player, self.itemId, self.itemres)
	end;
	
	test_getNumber = function(self)
		self:setParam()
		
		assert ( self.itemHdr:getNumber() == 0 )
		
		TestCaseCondition:setPreCond(self.player, nil, {item={id=self.resid, num=1} })
		assert ( self.itemHdr:getNumber() == 1 )
	end;
	
	test_hasEnoughNumber = function(self)
		self:setParam()
		
		local needNumber = 1
		assert ( self.itemHdr:hasEnoughNumber(needNumber) == false )
		
		TestCaseCondition:setPreCond(self.player, nil, {item={id=self.resid, num=1} })
		assert ( self.itemHdr:hasEnoughNumber(needNumber) == true )
	end;
	
	test_isValidTarget = function(self)
		self:setParam()
		
		assert ( self.itemHdr:isValidTarget(RES_TRG.SELF_HERO) == true )
		assert ( self.itemHdr:isValidTarget(RES_TRG.SELF_DEF_BUILDING) == false )
	end;
	
	test_subItem = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask')
		self:setParam()
		
		TestCaseCondition:setPreCond(self.player, nil, {item={id=self.resid, num=1} })
		assert ( self.itemHdr:getNumber() == 1 )
		self.itemHdr:subItem(1)
		
		assert ( self.itemHdr:getNumber() == 0 )
		assert ( self.player:getPkg():getItemNumber(self.resid) == 0 )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.USE_ITEM, self.resid, 0} )
	end;
})

local TestCasePileItemHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		self.itemHdr = PileItemHdr()
		res_test_items={{targets={RES_TRG.SELF_HERO},isbind=0,pile=99,effects={{id=RES_EFF.ADD_CANSTEELSKILL,val=8}},id=3000009,nobindid=0}
							,{targets={RES_TRG.SELF_HERO},isbind=1,pile=99,effects={{id=RES_EFF.ADD_CANSTEELSKILL,val=8}},id=3000128,nobindid=3000009}}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	test_setParam = function(self)
		local itemId = 1
		local itemres = {}
		self.itemHdr:setParam(self.player, itemId, itemres)
		
		assert ( self.itemHdr.player == self.player )
		assert ( self.itemHdr.itemId == itemId )
		assert ( self.itemHdr.itemres == itemres )
	end;
	
	test_getNumber = function(self)
		self.itemHdr.player = self.player
		self.itemHdr.itemres = {id=1001}
		self.mm:mock(self.player:getPkg(), 'getItemNumber', {1} )
		assertEQ ( self.itemHdr:getNumber() , 1 )
		assertEQ ( self.mm.params['getItemNumber.1'], {1001}) 
	end;
	
	test_subItem = function(self)
		self.itemHdr.player = self.player
		self.itemHdr.itemres = {id=1001}
		self.mm:mock(self.player:getPkg(), 'subItemByResId')
		self.mm:mock(self.itemHdr, '_getBindOrNoBindId', {1002} )
		self.mm:mock(TaskFinisher, 'trigerTask')
		
		self.itemHdr:subItem(3)
		assertEQ ( self.mm.walkLog, 'subItemByResId,_getBindOrNoBindId,trigerTask' )
		assertEQ ( self.mm.params['subItemByResId'], {1001, 3} )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.USE_ITEM, 1001, 1002} )
	end;
	
	test__getBindOrNoBindId = function(self)
		self.itemHdr.itemres = {nobindid = 1};
		assert ( self.itemHdr:_getBindOrNoBindId() == 1 )
		
		self.itemHdr.itemres = {bindid = 2};
		assert ( self.itemHdr:_getBindOrNoBindId() == 2 )
		
		self.itemHdr.itemres = {};
		assert ( self.itemHdr:_getBindOrNoBindId() == 0 )
	end;
})

local TestCaseGiftGoldItemHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.itemHdr = GiftGoldItemHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	setParam = function(self)
		local itemId = 0
		local resid = 1003
		local itemres = ItemResUtil:findItemres(resid)
		self.itemHdr:setParam(self.player, itemId, itemres)
	end;
	
	test_getNumber = function(self)
		self:setParam()
		
		assert ( self.itemHdr:getNumber() == 0 )
		
		self.player:getPkg():setGold(1)
		assert ( self.itemHdr:getNumber() == 1 )
		
		self.player:getPkg():setGiftGold(1)
		assert ( self.itemHdr:getNumber() == 2 )
	end;
	
	test_subItem = function(self)
		self.mm:mock(WUtil, 'sendSysMsg')
	
		self:setParam()
		
		self.player:getPkg():setGiftGold(2)
		self.player:getPkg():setGold(1)
		
		self.itemHdr:subItem(1)
		assert ( self.player:getPkg():getGiftGold() == 1 )
		assert ( self.player:getPkg():getGold() == 1 )
		assertEQ ( self.mm.params['sendSysMsg'], {self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, string.format(rstr.speedByGiftGold, 1) } )
		
		local mm = MethodMock()
		mm:mock(PkgMiscSender, 'send', function(self, player, keys)
			mm.player = player
			mm.keys = keys
			end)
		self.itemHdr:subItem(2)
		mm:restore()
		assertEQ ( self.mm.params['sendSysMsg'], {self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, string.format(rstr.speedByGiftGoldAndGold, 1, 1) } )
		
		assert ( self.player:getPkg():getGiftGold() == 0 )
		assert ( self.player:getPkg():getGold() == 0 )
		assert ( mm.player == self.player )
		assert ( table.getn(mm.keys) == 2 )
		assert ( mm.keys[1] == 'gold' )
		assert ( mm.keys[2] == 'giftgold' )
	end;
})

local TestCaseSubItemHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		res_test_items={{id=101,pile=1,unique=1},{id=102,pile=99,unique=0}}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_hasEnoughNumber = function(self)
		self.mm:mock(SubItemHdr.itemHdrs['unique'], 'setParam:uniqueSetParam' )
		self.mm:mock(SubItemHdr.itemHdrs['unique'], 'hasEnoughNumber:uniqueHasEnoughNumber', {true} )
		self.mm:mock(SubItemHdr.itemHdrs['pile'], 'setParam:pileSetParam' )
		self.mm:mock(SubItemHdr.itemHdrs['pile'], 'hasEnoughNumber:pileHasEnoughNumber', {true} )
		self.mm:mock(NullItemHdr, 'setParam:nullSetParam' )
		self.mm:mock(NullItemHdr, 'hasEnoughNumber:nullHasEnoughNumber', {false} )
		
		local itemid = 1
		local resid = 101
		local number = 2
		assertEQ ( SubItemHdr:hasEnoughNumber(self.player, itemid, resid, number), true );
		assertEQ ( self.mm.walkLog, 'uniqueSetParam,uniqueHasEnoughNumber' )
		assertEQ ( self.mm.params['uniqueSetParam'], {self.player, itemid, res_test_items[1]} )
		assertEQ ( self.mm.params['uniqueHasEnoughNumber'], {number} )
		
		self.mm:clear()
		itemid = 0
		resid = 102
		number = 2
		assertEQ ( SubItemHdr:hasEnoughNumber(self.player, itemid, resid, number), true );
		assertEQ ( self.mm.walkLog, 'pileSetParam,pileHasEnoughNumber' )
		assertEQ ( self.mm.params['pileSetParam'], {self.player, itemid, res_test_items[2]} )
		assertEQ ( self.mm.params['pileHasEnoughNumber'], {number} )
		
		self.mm:clear()
		itemid = 0
		resid = 0
		number = 2
		assertEQ ( SubItemHdr:hasEnoughNumber(self.player, itemid, resid, number), false );
		assertEQ ( self.mm.walkLog, 'nullSetParam,nullHasEnoughNumber' )
		assertEQ ( self.mm.params['nullSetParam'], {self.player, itemid} )
		assertEQ ( self.mm.params['nullHasEnoughNumber'], {number} )
	end;
	
	test_subItem = function(self)
		self.mm:mock(SubItemHdr.itemHdrs['unique'], 'setParam:uniqueSetParam' )
		self.mm:mock(SubItemHdr.itemHdrs['unique'], 'subItem:uniqueSubItem' )
		self.mm:mock(SubItemHdr.itemHdrs['pile'], 'setParam:pileSetParam' )
		self.mm:mock(SubItemHdr.itemHdrs['pile'], 'subItem:pileSubItem' )
		self.mm:mock(NullItemHdr, 'setParam:nullSetParam' )
		self.mm:mock(NullItemHdr, 'subItem:nullSubItem' )
		
		local itemid = 1
		local resid = 101
		local number = 2
		SubItemHdr:subItem(self.player, itemid, resid, number)
		assertEQ ( self.mm.walkLog, 'uniqueSetParam,uniqueSubItem' )
		assertEQ ( self.mm.params['uniqueSetParam'], {self.player, itemid, res_test_items[1]} )
		assertEQ ( self.mm.params['uniqueSubItem'], {number} )
		
		self.mm:clear()
		itemid = 0
		resid = 102
		number = 2
		SubItemHdr:subItem(self.player, itemid, resid, number)
		assertEQ ( self.mm.walkLog, 'pileSetParam,pileSubItem' )
		assertEQ ( self.mm.params['pileSetParam'], {self.player, itemid, res_test_items[2]} )
		assertEQ ( self.mm.params['pileSubItem'], {number} )
		
		self.mm:clear()
		itemid = 0
		resid = 0
		number = 2
		SubItemHdr:subItem(self.player, itemid, resid, number)
		assertEQ ( self.mm.walkLog, 'nullSetParam,nullSubItem' )
		assertEQ ( self.mm.params['nullSetParam'], {self.player, itemid} )
		assertEQ ( self.mm.params['nullSubItem'], {number} )
	end;
})

local TestCaseUseItemHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:backRes()
		TestCaseHelper:createPlayer(self)
		self.hero = HeroTestCaseHelper:createOneNewHero( self.player, self.player:getHeroMgr() )
		
		res_items = {
			{id=1,pile=99,targets={RES_TRG.BUILDING_IBUILD},effects={{id=RES_EFF.ACCELERATE,val=60,u=0}}}
			,{id=2,pile=99,targets={RES_TRG.SELF_HERO},effects={{id=RES_EFF.ADDHEROHEALTH,val=1}}}
			,{id=3,pile=1,unique=1,targets={RES_TRG.SELF_HERO},effects={{id=RES_EFF.ADDHEROHEALTH,val=1}}}
			,{id=4,pile=99,targets={RES_TRG.BUILDING_IBUILD},effects={{id=RES_EFF.FULL_ACC_BUILDING_USEGIFTGOLD,val=0},{id=RES_EFF.ADDHEROHEALTH,val=1}}}
			,{id=5,pile=99,targets={RES_TRG.SELF_ROLE},effects={{id=RES_EFF.FULL_ACC_CULTURELEARN_USEGIFTGOLD,val=0},{id=RES_EFF.ADDHEROHEALTH,val=1}}}
			,{id=6,pile=99,targets={RES_TRG.SELF_HERO},effects={{id=RES_EFF.FULL_ACC_SKELETONSTEEL_USEGIFTGOLD,val=0},{id=RES_EFF.ADDHEROHEALTH,val=1}}}
			,{id=7,pile=99,targets={RES_TRG.SELF_HERO},effects={{id=RES_EFF.FULL_ACC_SKILLSTEEL_USEGIFTGOLD,val=0},{id=RES_EFF.ADDHEROHEALTH,val=1}}}
			,{id=8,pile=99,targets={RES_TRG.SELF_ROLE},effects={{id=RES_EFF.FULL_ACC_CITYDEF_USEGIFTGOLD,val=0},{id=RES_EFF.ADDHEROHEALTH,val=1}}}
			,{id=9,pile=99,targets={RES_TRG.SELF_ROLE},effects={{id=RES_EFF.FULL_ACC_TRADING_USEGIFTGOLD,val=0},{id=RES_EFF.ADDHEROHEALTH,val=1}}}
			,{id=10,pile=99,targets={RES_TRG.SELF_ROLE},effects={{id=RES_EFF.FULL_ACC_TASK_USEGIFTGOLD,val=0},{id=RES_EFF.ADDHEROHEALTH,val=1}}}
			,{id=11,pile=99,roleLevel=10,targets={RES_TRG.SELF_ROLE},effects={{id=RES_EFF.ADD_IRON, val=1}}}
			,{id=FIXID.ALLI_CONTRIB_CARD,pile=99,targets={RES_TRG.SELF_ROLE},effects={{id=RES_EFF.ADD_IRON, val=1}}}
		}
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
		TestCaseHelper:restoreRes()
	end;
	
	preCondition = function(self)
		local citys = self.player:getCitys()
		local city = citys:getCityById(1)
		local build = city:getBuildById(1)
		build.ucState = BUILD_STATE.UPGRADE
		build.ulStoptime = Util:getTime() - 10
		
		local pkg = self.player:getPkg()
		pkg:addItems({RawItemEx({resId=1,number=1})})
		pkg:addItems({RawItemEx({resId=FIXID.ALLI_CONTRIB_CARD,number=1})})
		clearSendMsg_t()
	end;
	
	test_getParam_inValidNumber = function(self)
		local cmd = {number=0};
		assert ( UseItemHdr:getParam(self.player, cmd) == false )
	end;
	
	test_getParam_inValidResid = function(self)
		local cmd = {number=1, resid=-1};
		assert ( UseItemHdr:getParam(self.player, cmd) == false )
	end;
	
	test_getParam_inValidTarget = function(self)
		local cmd = {number=1, resid=1, ttype=RES_TRG.BUILDING_IBUILD,tid=1,tcid=1};
		
		local mm = MethodMock()
		mm:mock(UseTarget, 'parse', function(self, player, cmdtb) 
			mm.player = player
			mm.cmdtb = cmdtb
			return nil
			end)
		
		assert ( UseItemHdr:getParam(self.player, cmd) == false )
		mm:restore()
		
		assert ( mm.player == self.player )
		assert ( mm.cmdtb == cmd )
	end;
	
	test_getParam_ok = function(self)
		local cmd = {resid=1, number=2, id=3, ttype=RES_TRG.BUILDING_IBUILD,tid=1,tcid=1};
		assert ( UseItemHdr:getParam(self.player, cmd) == true )
		
		assert ( UseItemHdr.resid == 1 )
		assert ( UseItemHdr.itemres == ItemResUtil:findItemres(1) )
		assert ( UseItemHdr.number == 2 )
		assert ( UseItemHdr.params ~=  nil )
		assert ( UseItemHdr.player ==  self.player )
		assert ( UseItemHdr.itemId ==  3 )
		assert ( UseItemHdr.targetType ==  RES_TRG.BUILDING_IBUILD )
		assert ( UseItemHdr.itemHdr ==  UseItemHdr:getItemHdr() )
		
		assert ( UseItemHdr.itemHdr.player == self.player )
		assert ( UseItemHdr.itemHdr.itemId == 3 )
		assert ( UseItemHdr.itemHdr.itemres == UseItemHdr.itemres )
	end;
	
	test_isCanExecEffects = function(self)
		self:preCondition()
		
		local cmd = {cmd=NETCMD.USEITEM,id=1,resid=1,number=1,ttype=RES_TRG.BUILDING_IBUILD,tid=1,tcid=1};
		UseItemHdr:getParam(self.player, cmd)
		
		local mm = MethodMock()
		mm:mock(EffectorMgr, 'getEffector', function(self) 
			return Class:extends({ isCanExec = function(self) return true end }):new()
			end)
		assert ( UseItemHdr:isCanExecEffects() == true )
		mm:restore()
		
		mm = MethodMock()
		mm:mock(EffectorMgr, 'getEffector', function(self) 
			return Class:extends({ isCanExec = function(self) return false end }):new()
			end)
		assert ( UseItemHdr:isCanExecEffects() == false )
		mm:restore()
	end;
	
	test_getNeedNumber = function(self)
		self:preCondition()
		
		local cmd = {cmd=NETCMD.USEITEM,id=1,resid=1,number=10,ttype=RES_TRG.BUILDING_IBUILD,tid=1,tcid=1};
		UseItemHdr:getParam(self.player, cmd)
		
		local mm = MethodMock()
		mm:mock(EffectorMgr, 'getEffector', function(self) 
			return Class:extends({ getNeedNumber = function(self) return 0 end }):new()
			end)
		assert ( UseItemHdr:getNeedNumber() == 0 )
		mm:restore()
		
		mm = MethodMock()
		mm:mock(EffectorMgr, 'getEffector', function(self) 
			return Class:extends({ getNeedNumber = function(self) return 2 end }):new()
			end)
		assert ( UseItemHdr:getNeedNumber() == 2 )
		mm:restore()
	end;
	
	test_hasEffect = function(self)
		local cmd = {cmd=NETCMD.USEITEM,id=1,resid=1,number=1,ttype=RES_TRG.BUILDING_IBUILD,tid=1,tcid=1};
		UseItemHdr:getParam(self.player, cmd)
		
		assert ( UseItemHdr:hasEffect(RES_EFF.ACCELERATE) == true )
		assert ( UseItemHdr:hasEffect(RES_EFF.FULL_ACC_BUILDING_USEGIFTGOLD) == false )
	end;
	
	test_getItemHdr = function(self)
		local cmd = {cmd=NETCMD.USEITEM,id=1,resid=1,number=1,ttype=RES_TRG.BUILDING_IBUILD,tid=1,tcid=1};
		UseItemHdr:getParam(self.player, cmd)
		assert ( UseItemHdr:getItemHdr():getClass() == PileItemHdr )
		
		local cmd = {cmd=NETCMD.USEITEM,id=1,resid=3,number=1,ttype=RES_TRG.BUILDING_IBUILD,tid=1,tcid=1};
		UseItemHdr:getParam(self.player, cmd)
		assert ( UseItemHdr:getItemHdr():getClass() == UniqueItemHdr )
		
		local cmd = {cmd=NETCMD.USEITEM,id=1,resid=4,number=1,ttype=RES_TRG.BUILDING_IBUILD,tid=1,tcid=1};
		UseItemHdr:getParam(self.player, cmd)
		assert ( UseItemHdr:getItemHdr():getClass() == GiftGoldItemHdr )
		
		local cmd = {cmd=NETCMD.USEITEM,id=1,resid=5,number=1,ttype=RES_TRG.SELF_ROLE,tid=1,tcid=1};
		UseItemHdr:getParam(self.player, cmd)
		assert ( UseItemHdr:getItemHdr():getClass() == GiftGoldItemHdr )
		
		local cmd = {cmd=NETCMD.USEITEM,id=1,resid=6,number=1,ttype=RES_TRG.SELF_HERO,tid=1,tcid=1};
		UseItemHdr:getParam(self.player, cmd)
		assert ( UseItemHdr:getItemHdr():getClass() == GiftGoldItemHdr )
		
		local cmd = {cmd=NETCMD.USEITEM,id=1,resid=7,number=1,ttype=RES_TRG.SELF_HERO,tid=1,tcid=1};
		UseItemHdr:getParam(self.player, cmd)
		assert ( UseItemHdr:getItemHdr():getClass() == GiftGoldItemHdr )
		
		local cmd = {cmd=NETCMD.USEITEM,id=1,resid=8,number=1,ttype=RES_TRG.SELF_ROLE,tid=1,tcid=1};
		UseItemHdr:getParam(self.player, cmd)
		assert ( UseItemHdr:getItemHdr():getClass() == GiftGoldItemHdr )
		
		local cmd = {cmd=NETCMD.USEITEM,id=1,resid=9,number=1,ttype=RES_TRG.SELF_ROLE,tid=1,tcid=1};
		UseItemHdr:getParam(self.player, cmd)
		assert ( UseItemHdr:getItemHdr():getClass() == GiftGoldItemHdr )
		
		local cmd = {cmd=NETCMD.USEITEM,id=1,resid=10,number=1,ttype=RES_TRG.SELF_ROLE,tid=1,tcid=1};
		UseItemHdr:getParam(self.player, cmd)
		assert ( UseItemHdr:getItemHdr():getClass() == GiftGoldItemHdr )
	end;
	
	test_handle = function(self)
		local ret_getParam = true
		local ret_isValid = true
		local ret_isCanExecEffects = true
		local ret_needNumber = 0
		
		local mm = MethodMock()
		mm:mock(UseItemHdr, 'getParam', function(self) 
			return ret_getParam
			end)
		mm:mock(UseItemHdr, 'isValid', function(self) 
			return ret_isValid
			end)
		mm:mock(UseItemHdr, 'isCanExecEffects', function(self) 
			return ret_isCanExecEffects
			end)
		mm:mock(UseItemHdr, 'getNeedNumber', function(self) 
			return ret_needNumber
			end)
		mm:mock(UseItemHdr, 'subItem', function(self) 
			mm.walkLog = 'subItem'
			end)
		mm:mock(UseItemHdr, 'execEffects', function(self) 
			mm.walkLog = mm.walkLog..',execEffects'
			end)
		
		ret_getParam = false
		ret_isValid = false
		ret_isCanExecEffects = false
		ret_needNumber = 0
		mm.walkLog = ''
		UseItemHdr:handle(self.player, {})
		assert ( mm.walkLog == '' )
		
		ret_getParam = true
		ret_isValid = false
		ret_isCanExecEffects = false
		ret_needNumber = 0
		mm.walkLog = ''
		UseItemHdr:handle(self.player, {})
		assert ( mm.walkLog == '' )
		
		ret_getParam = true
		ret_isValid = true
		ret_isCanExecEffects = false
		ret_needNumber = 0
		mm.walkLog = ''
		UseItemHdr:handle(self.player, {})
		assert ( mm.walkLog == '' )
		
		ret_getParam = true
		ret_isValid = true
		ret_isCanExecEffects = true
		ret_needNumber = 0
		mm.walkLog = ''
		UseItemHdr:handle(self.player, {})
		assert ( mm.walkLog == '' )
		
		ret_getParam = true
		ret_isValid = true
		ret_isCanExecEffects = true
		ret_needNumber = 1
		mm.walkLog = ''
		UseItemHdr:handle(self.player, {})
		assert ( mm.walkLog == 'subItem,execEffects' )
		
		mm:restore()
	end;
	
	testHasNoEnoughLevel = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self.player:setLevel(9)
		local cmd = {cmd=NETCMD.USEITEM,id=1,resid=11,number=1,ttype=RES_TRG.SELF_ROLE,tid=1,tcid=1}
		self.player:getPkg():addItems({RawItemEx({resId=11,number=2})})
		assertEQ ( UseItemHdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100179, '10'} )
		
		self.player:setLevel(10)
		assertEQ ( UseItemHdr:handle(self.player, cmd), true )
	end;
	
	testUseAlliContribCard = function(self)
		self.mm:mock(WUtil, 'sendWarningMsgArgs')
		self:preCondition()
		local cmd = {cmd=NETCMD.USEITEM,id=1,resid=FIXID.ALLI_CONTRIB_CARD,number=1,ttype=RES_TRG.SELF_ROLE,tid=1,tcid=1};
		assert(UseItemHdr:getParam(self.player, cmd) == true)
		assert(UseItemHdr:_canUseById() == false)
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100187, ''} )
		
		self.mm:clear()
		self.player:setAlliId(1)
		assertEQ(UseItemHdr:_canUseById(), true)
		assertEQ(self.mm.walkLog, '')
	end;
	
	testUseItemHdr = function(self)
		self:preCondition()
		
		local cmd = {cmd=NETCMD.USEITEM,id=1,resid=1,number=1,ttype=RES_TRG.BUILDING_IBUILD,tid=1,tcid=1};
		assert(UseItemHdr:getParam(self.player, cmd) == true)
		assert(UseItemHdr:isValid() == true)
		UseItemHdr:subItem()
		UseItemHdr:execEffects()
		assert(getSendMsgCnt_t() >= 2)
		
		local pkg = self.player:getPkg()
		pkg:addItems({RawItemEx({resId=1,number=1})})
		clearSendMsg_t()
		UseItemHandler():onRequest(self.player, nil, cmd)
		assert(getSendMsgCnt_t() >= 2)
	end;
	
	testUseItemHdr_ForSelfHero = function(self)
		local pkg = self.player:getPkg()
		pkg:addItems({RawItemEx({resId=2,number=1})})
		clearSendMsg_t()
		self.hero:setAttrVal(ATTR.HEALTH, 90)
		local cmd = {cmd=NETCMD.USEITEM,id=2,resid=2,number=1,ttype=RES_TRG.SELF_HERO,tid=1};
		UseItemHandler():onRequest(self.player, nil, cmd)
		assert( getSendMsgCnt_t() > 0 )
	end;
	
	test_useXPSCardByDrop = function(self)
		self.player:setLevel(10)
		assertEQ ( self.player:getAttr(ATTR.XPS).ulVal, 100 )
		local pkg = self.player:getPkg()
		pkg:addItems({RawItemEx({resId=3000230,number=1000})})
		local cmd = {cmd=NETCMD.USEITEM,id=2,resid=3000230,number=100,ttype=RES_TRG.SELF_ROLE,tid=1};
		UseItemHandler():onRequest(self.player, nil, cmd)
		assertEQ ( self.player:getAttr(ATTR.XPS).ulVal > self.player:getAttr(ATTR.MXPS).ulVal, true  )
	end;
})

tqUseItemHandler_t_main = function(suite)
	suite:addTestCase(TestCaseUniqueItemHdr,'TestCaseUniqueItemHdr')
	suite:addTestCase(TestCasePileItemHdr,'TestCasePileItemHdr')
	suite:addTestCase(TestCaseGiftGoldItemHdr,'TestCaseGiftGoldItemHdr')
	suite:addTestCase(TestCaseSubItemHdr,'TestCaseSubItemHdr')
	suite:addTestCase(TestCaseUseItemHandler,'TestCaseUseItemHandler')
end;

