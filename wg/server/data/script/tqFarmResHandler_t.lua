require('tqFarmResHandler')

local TestCaseFarmResHandler = TestCase:extends({
	test_regHandlers = function(self)
		local hdr = FarmResHandler()
		assert ( hdr:getHandler(0):getClass() == NullHandler )
		assert ( hdr:getHandler(1):getClass() == GetFarmHdr )
		assert ( hdr:getHandler(4):getClass() == GetFarmLogHdr )
		assert ( hdr:getHandler(5):getClass() == GatherFarmResHdr )
		assert ( hdr:getHandler(6):getClass() == GatherAllFarmResHdr )
		assert ( hdr:getHandler(7):getClass() == PreGatherFarmResHdr )
		assert ( hdr:getHandler(8):getClass() == InitFarmBlockHdr )
		assert ( hdr:getHandler(9):getClass() == SeedFarmHdr )
		assert ( hdr:getHandler(10):getClass() == GetFarmsGetCanFlagHdr )
	end;
})

local TestCaseGetFarmHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = GetFarmHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local g_player = TestCaseHelper:loadPlayerByUserNameEx('player', 'player_r', 100000)
		local g_otherPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200000)
		self.mm:mock(FarmSender, 'sendAll')
		
		self.hdr:handle(g_player, {ver=0, roleId=200000})
		assertEQ ( self.mm.walkLog, '' )
		
		g_otherPlayer:setCityGrid({objType=OBJ_TYPE.DIED_ROLE})
		self.hdr:handle(g_player, {ver=-1, roleId=200000})
		assertEQ ( self.mm.walkLog, '' )
		
		self.mm:clear()
		g_otherPlayer:setCityGrid({objType=OBJ_TYPE.ROLE})
		self.hdr:handle(g_player, {ver=-1, roleId=200000})
		assertEQ ( self.mm.walkLog, 'sendAll' )
		assertEQ ( self.mm.params['sendAll'], {g_player, g_otherPlayer} )
		
		self.mm:clear()
		self.hdr:handle(g_player, {ver=-1, roleId=-1})
		assertEQ ( self.mm.params['sendAll'], {g_player, g_player} )
	end;
})

local TestCaseSeedFarmHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = SeedFarmHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local g_initParamRt = {false}
		local g_isValidRt = {false}
		
		self.mm:mock( self.hdr, '_initParam', g_initParamRt )
		self.mm:mock( self.hdr, '_isValid', g_isValidRt )
		self.mm:mock( self.hdr, '_handle' )
		
		local g_cmd = {}
		self.hdr:handle(self.player, g_cmd)
		assertEQ ( self.mm.walkLog, '_initParam' )
		assertEQ ( self.mm.params['_initParam'], {self.player, g_cmd} )
		
		self.mm:clear()
		g_initParamRt[1] = true
		self.hdr:handle(self.player, g_cmd)
		assertEQ ( self.mm.walkLog, '_initParam,_isValid' )
		
		self.mm:clear()
		g_isValidRt[1] = true
		self.hdr:handle(self.player, g_cmd)
		assertEQ ( self.mm.walkLog, '_initParam,_isValid,_handle' )
	end;
	
	test__initParam = function(self)
		local g_expends = {}
		self.mm:mock(WUtil, 'createExpendObjs', {g_expends})
		
		local g_cmd = {blockId=1, resid=FIXID.PIPSTART-1}
		assertEQ ( self.hdr:_initParam(self.player, g_cmd), false )
		
		local g_cmd = {blockId=1, resid=FIXID.PIPEND+1}
		assertEQ ( self.hdr:_initParam(self.player, g_cmd), false )
		
		local g_cmd = {blockId=1, resid=FIXID.PIPEND}
		assertEQ ( self.hdr:_initParam(self.player, g_cmd), true )
		assertEQ ( self.hdr.player, self.player )
		assertEQ ( self.hdr.blockId, 1 )
		
		local pipres = ItemResUtil:findItemres(FIXID.PIPEND)
		assertEQ ( self.hdr.blockId, 1 )
		assertEQ ( self.hdr.resid, pipres.bresid )
		assertEQ ( self.hdr.level, pipres.level )
		assertEQ ( self.hdr.expends, g_expends )
		assertEQ ( self.mm.params['createExpendObjs'], {self.player, 'nil', {{attr=ATTR.IDLEPOPU, type=EXPEND_TYPE.IDLEPOPU, val=res_farmblock_needpopu}}} )
	end;
	
	test__isValid = function(self)
		self.hdr.expends = {}
		
		local g_isSeedBlockInMaxRangeRt = {false}
		local g_hasPipInWillSeekBlockRt = {true}
		local g_isEnoughExpendsRt = {false}
		
		self.mm:mock(self.hdr, '_isSeedBlockInMaxRange', g_isSeedBlockInMaxRangeRt)
		self.mm:mock(self.hdr, '_hasPipInWillSeekBlock', g_hasPipInWillSeekBlockRt)
		self.mm:mock(WUtil, 'isEnoughExpends', g_isEnoughExpendsRt)
		
		assertEQ ( self.hdr:_isValid(), false )
		
		self.mm:clear()
		g_isSeedBlockInMaxRangeRt[1] = true
		assertEQ ( self.hdr:_isValid(), false )
		
		self.mm:clear()
		g_hasPipInWillSeekBlockRt[1] = false
		assertEQ ( self.hdr:_isValid(), false )
		
		self.mm:clear()
		g_isEnoughExpendsRt[1] = true
		assertEQ ( self.hdr:_isValid(), true )
		assertEQ ( self.mm.params['isEnoughExpends'], {self.hdr.expends} )
	end;
	
	test__isValidFarmId = function(self)
		local g_isSeedBlockInMaxRangeRt = {false}
		local g_hasPipInWillSeekBlockRt = {true}
		self.mm:mock(self.hdr, '_isSeedBlockInMaxRange', g_isSeedBlockInMaxRangeRt )
		self.mm:mock(self.hdr, '_hasPipInWillSeekBlock', g_hasPipInWillSeekBlockRt )
		
		assertEQ ( self.hdr:_isValidFarmId(), false )
		
		g_isSeedBlockInMaxRangeRt[1] = true
		assertEQ ( self.hdr:_isValidFarmId(), false )
		
		g_hasPipInWillSeekBlockRt[1] = false
		assertEQ ( self.hdr:_isValidFarmId(), true )
	end;
	
	test__isSeedBlockInMaxRange = function(self)
		self.hdr.blockId = 0
		self.hdr.player = self.player
		
		self.mm:mock( self.player:getCityRes(), 'getFarmMaxBlockCount', {10})
		
		assertEQ ( self.hdr:_isSeedBlockInMaxRange(), false )
		
		self.hdr.blockId = 11
		assertEQ ( self.hdr:_isSeedBlockInMaxRange(), false )
		
		self.hdr.blockId = 10
		assertEQ ( self.hdr:_isSeedBlockInMaxRange(), true )
	end;
	
	test__hasPipInWillSeekBlock = function(self)
		self.hdr.blockId = 1
		self.hdr.player = self.player
		
		local g_getBlockByIdRt = {nil}
		self.mm:mock( self.player:getFarm(), 'getBlockById', g_getBlockByIdRt)
		assertEQ ( self.hdr:_hasPipInWillSeekBlock(), false )
		
		g_getBlockByIdRt[1] = {}
		assertEQ ( self.hdr:_hasPipInWillSeekBlock(), true )
	end;
	
	test__handle = function(self)
		self.hdr.expends = {}
		self.hdr.player = self.player
		self.hdr.blockId = 1
		self.hdr.level = 2
		self.hdr.resid = 3
		
		local g_seedBlockRt = {nil}
		local g_count = {3}
		self.mm:mock(WUtil, 'subExpends' )
		self.mm:mock(self.player:getFarm(), 'seedBlock', g_seedBlockRt)
		self.mm:mock(FarmSender, 'sendBlock' )
		self.mm:mock(TaskFinisher, 'trigerTask')
		self.mm:mock(TaskFinisher, 'checkTasks')
		self.mm:mock(FarmSender, 'sendCancelInput')
		self.mm:mock(self.player:getFarm(), 'getBlockCount', g_count)
		
		self.hdr:_handle()
		assertEQ ( self.mm.walkLog, 'subExpends,seedBlock' )
		assertEQ ( self.mm.params['subExpends'], {self.hdr.expends} )
		assertEQ ( self.mm.params['seedBlock'], {{id=1, level=2, resid=3, state=FARM_STATE.SAPLING}} )
		
		self.mm:clear()
		local g_block = {}
		g_seedBlockRt[1] = g_block
		self.hdr:_handle()
		assertEQ ( self.mm.walkLog, 'subExpends,seedBlock,sendBlock,getBlockCount,trigerTask,checkTasks' )
		assertEQ ( self.mm.params['sendBlock'], {self.player, self.player:getFarm(), g_block} )
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.PLANT_ONE_FARMBLOCK} )
		assertEQ ( self.mm.params['checkTasks'], {self.player} )
		
		self.mm:clear()
		g_count[1] = 4
		self.hdr:_handle()
		assertEQ ( self.mm.params['sendCancelInput'], {self.player} )
	end;
})

local TestCaseBaseGatherFarmResHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = BaseGatherFarmResHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local g_initParamRt = {false}
		local g_isValidRt = {false}
		self.mm:mock( self.hdr, '_initParam', g_initParamRt )
		self.mm:mock( self.hdr, '_isValid', g_isValidRt )
		self.mm:mock( self.hdr, '_handle' )
		self.mm:mock( self.hdr, '_endHandle' )
		
		local g_cmd = {}
		assertEQ ( self.hdr:handle( self.player, g_cmd ), false )
		assertEQ ( self.mm.params['_initParam'], {self.player, g_cmd} )
		
		self.mm:clear()
		g_initParamRt[1] = true
		assertEQ ( self.hdr:handle( self.player, g_cmd ), false )
		
		self.mm:clear()
		g_isValidRt[1] = true
		assertEQ ( self.hdr:handle( self.player, g_cmd ), true )
		assertEQ ( self.mm.walkLog, '_initParam,_isValid,_handle,_endHandle' )
	end;
	
	test__initParam = function(self)
		local g_cmdtb = {roleId=20000000,blockId=1}
		local g_getPlayer = {NullPlayer}
		self.mm:mock(	ArmyPlayerGetter, 'getPlayer', g_getPlayer )
		assertEQ ( self.hdr:_initParam(self.player, g_cmdtb), true )
		assertEQ ( self.hdr.player, self.player )
		assertEQ ( self.hdr.roleId, 20000000 )
		assertEQ ( self.hdr.blockId, 1 )
		assertEQ ( self.hdr.targetPlayer, NullPlayer )
		assertEQ ( self.hdr.farm, NullPlayer:getFarm())
		assertEQ ( self.hdr.isSelfTarget, false)
		assertEQ ( self.mm.params['getPlayer'], {OBJ_TYPE.ROLE, g_cmdtb.roleId} )
	end;
	
	test__isValid = function(self)
		self.hdr.player = self.player
		
		local g_isValidFarmIdRt = {false}
		local g_isValidStateRt = {false}
		local g_isEnoughExpendRt = {false}
		self.mm:mock(self.hdr, '_isValidFarmId',  g_isValidFarmIdRt)
		self.mm:mock(self.hdr, '_isValidState',  g_isValidStateRt)
		self.mm:mock(self.hdr, '_isEnoughExpend',  g_isEnoughExpendRt)
		self.mm:mock( WUtil, 'sendWarningMsgArgs' )
		
		self.mm:clear()
		assertEQ ( self.hdr:_isValid(), false )
		assertEQ ( self.mm.walkLog, '_isValidFarmId' )
		
		self.mm:clear()
		g_isValidFarmIdRt[1] = true
		assertEQ ( self.hdr:_isValid(), false )
		assertEQ ( self.mm.walkLog, '_isValidFarmId,_isValidState' )
		
		self.mm:clear()
		g_isValidStateRt[1] = true
		assertEQ ( self.hdr:_isValid(), false )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100067, ''} )
		assertEQ ( self.mm.walkLog, '_isValidFarmId,_isValidState,_isEnoughExpend,sendWarningMsgArgs' )
		
		self.mm:clear()
		g_isEnoughExpendRt[1] = true
		assertEQ ( self.hdr:_isValid(), true )
		assertEQ ( self.mm.walkLog, '_isValidFarmId,_isValidState,_isEnoughExpend' )
	end;
	
	test__isValidFarmId = function(self)
		assertEQ ( self.hdr:_isValidFarmId(), nil )
	end;
	
	test__isValidState = function(self)
		assertEQ ( self.hdr:_isValidState(), nil )
	end;
	
	test__isEnoughExpend = function(self)
		self.hdr.player = self.player
		
		local g_getNeedPSAttrValRt = {1000000}
		self.mm:mock( self.hdr, '_getNeedPSAttrVal', g_getNeedPSAttrValRt)
	
		assertEQ ( self.hdr:_isEnoughExpend(), false )
		
		g_getNeedPSAttrValRt[1] = 0
		assertEQ ( self.hdr:_isEnoughExpend(), true )
	end;
	
	test__getNeedPSAttrVal = function(self)
		assertEQ ( self.hdr:_getNeedPSAttrVal(), nil )
	end;
	
	test__handle = function(self)
		self.mm:mock( self.hdr, '_initNumsAndBlocks' )
		self.mm:mock( self.hdr, '_handleCurBlocks' )
		self.mm:mock( self.hdr, '_sendMsgs' )
		self.mm:mock( self.hdr, '_addGetSelfResLogs' )
		
		local g_cmd = {}
		self.hdr:_handle(self.player, g_cmd)
		assertEQ ( self.mm.walkLog, '_initNumsAndBlocks,_handleCurBlocks,_sendMsgs,_addGetSelfResLogs' )
	end;
	
	test__initNumsAndBlocks = function(self)
		self.hdr:_initNumsAndBlocks()
		assertEQ ( self.hdr.nums, {} )
		assertEQ ( self.hdr.blocks, {} )
	end;
	
	test__handleCurBlocks = function(self)
		-- no implement
	end;
	
	test__setCurBlockAndId = function(self)
		local g_block = {ulId=1}
		self.hdr:_setCurBlockAndId(g_block)
		assertEQ ( self.hdr.block, g_block )
		assertEQ ( self.hdr.blockId, 1 )
	end;
	
	test__handleCurBlock = function(self)
		self.hdr.farm = self.player:getFarm()
		self.hdr.block = {}
		self.hdr.isSelfTarget = true
		
		self.mm:mock( self.hdr, '_collectHandledBlocks' )
		self.mm:mock( self.hdr, '_gatherFarmRes' )
		self.mm:mock( self.hdr.farm, 'reseedBlock' )
		
		self.hdr:_handleCurBlock()
		assertEQ ( self.mm.walkLog, '_collectHandledBlocks,_gatherFarmRes,reseedBlock' )
		assertEQ ( self.mm.params['reseedBlock'], {self.hdr.block} )
		
		self.mm:clear()
		self.hdr.isSelfTarget = false
		self.hdr:_handleCurBlock()
		assertEQ ( self.mm.walkLog, '_collectHandledBlocks,_gatherFarmRes' )
	end;
	
	test__collectHandledBlocks = function(self)
		self.hdr.blocks = {}
		self.hdr.block = {}
		self.hdr:_collectHandledBlocks()
		assertEQ ( self.hdr.blocks, {self.hdr.block} )
	end;
	
	test__gatherFarmRes = function(self)
		local g_otherPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200000)
		self.hdr.farm = g_otherPlayer:getFarm()
		self.hdr.isSelfTarget = false
		self.hdr.player = self.player
		self.hdr.block = {ulResId=FIXID.FARM}
		
		self.mm:mock( self.hdr.farm, 'getBlockRes', {10} )
		self.mm:mock( self.hdr.farm, 'subBlockRes' )
		self.mm:mock( self.hdr.farm, 'addCollector' )
		self.mm:mock( self.player:getCityRes(), 'addFood' )
		self.mm:mock( self.hdr, '_collectHandledNums' )
		
		self.hdr:_gatherFarmRes()
		assertEQ ( self.mm.walkLog, 'getBlockRes,subBlockRes,addCollector,addFood,_collectHandledNums' )
		assertEQ ( self.mm.params['addFood'], {10, true} )
		assertEQ ( self.mm.params['_collectHandledNums'], {10} )
		assertEQ ( self.mm.params['subBlockRes'], {self.hdr.block, 10} )
		assertEQ ( self.mm.params['addCollector'], {self.player:getRoleId(), self.hdr.block} )
	end;
	
	test__getResIdMapAddFunName = function(self)
		assertEQ ( self.hdr:_getResIdMapAddFunName(FIXID.FARM), 'addFood' )
		assertEQ ( self.hdr:_getResIdMapAddFunName(FIXID.TIMBERYARD), 'addWood' )
		assertEQ ( self.hdr:_getResIdMapAddFunName(FIXID.QUARRY), 'addStone' )
		assertEQ ( self.hdr:_getResIdMapAddFunName(FIXID.IRONORE), 'addIron' )
		assertEQ ( self.hdr:_getResIdMapAddFunName(FIXID.IRONORE+100), nil )
	end;
	
	test__collectHandledNums = function(self)
		self.hdr.blockId = 3
		self.hdr.block = {ucState=1, ulResId=2}
		self.hdr.nums = {}
		self.hdr:_collectHandledNums(10)
		assertEQ ( self.hdr.nums, {{id=3, state=1, resid=2, num=10}} )
	end;
	
	test__sendMsgs = function(self)
		self.hdr.player = self.player
		self.hdr.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200000)
		self.hdr.farm = self.hdr.targetPlayer:getFarm()
		self.hdr.blocks = {}
		self.hdr.nums = {}
		self.hdr.isSelfTarget = false
		
		self.mm:mock( FarmSender, 'sendBlocks' )
		self.mm:mock( CommResSender, 'sendAll' )
		self.mm:mock( FarmSender, 'sendGetResNum' )
		
		self.hdr:_sendMsgs()
		assertEQ ( self.mm.walkLog, 'sendBlocks,sendBlocks,sendAll,sendGetResNum' )
		assertEQ ( self.mm.params['sendBlocks.1'], {self.player, self.hdr.farm, self.hdr.blocks} )
		assertEQ ( self.mm.params['sendBlocks.2'], {self.hdr.targetPlayer, self.hdr.farm, self.hdr.blocks} )
		assertEQ ( self.mm.params['sendAll'], {self.player} )
		assertEQ ( self.mm.params['sendGetResNum'], {self.player, self.hdr.nums} )
		
		self.mm:clear()
		self.hdr.isSelfTarget = true
		self.hdr:_sendMsgs()
		assertEQ ( self.mm.walkLog, 'sendBlocks,sendAll,sendGetResNum' )
		assertEQ ( self.mm.params['sendBlocks'], {self.player, self.hdr.farm, self.hdr.blocks} )
	end;
	
	test_sendCombinedCommRes = function(self)
		self.mm:mock(WUtil, 'sendSysMsgArgs' )
		self.hdr.nums = {{resid=FIXID.FARM, num=10},{resid=FIXID.FARM, num=20}
			,{resid=FIXID.TIMBERYARD, num=1} 
			,{resid=FIXID.QUARRY, num=2} 
			,{resid=FIXID.IRONORE, num=3} 
			}
		self.hdr.player = self.player
		self.hdr:_sendCombinedCommRes()
		assertEQ ( self.mm.walkLog, 'sendSysMsgArgs,sendSysMsgArgs,sendSysMsgArgs,sendSysMsgArgs' )
		assertEQ ( self.mm.params['sendSysMsgArgs.1'], {self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid' .. FIXID.WOOD .. '",' .. 1} )
		assertEQ ( self.mm.params['sendSysMsgArgs.2'], {self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid' .. FIXID.STONE .. '",' .. 2} )
		assertEQ ( self.mm.params['sendSysMsgArgs.3'], {self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid' .. FIXID.FOOD .. '",' .. 30} )
		assertEQ ( self.mm.params['sendSysMsgArgs.4'], {self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid' .. FIXID.IRON .. '",' .. 3} )
		
		self.hdr.nums = {{resid=FIXID.FARM, num=10},{resid=FIXID.FARM, num=20}
			,{resid=FIXID.TIMBERYARD, num=1} 
			,{resid=FIXID.QUARRY, num=2} 
			}
		self.mm:clear()
		self.hdr:_sendCombinedCommRes()
		assertEQ ( self.mm.walkLog, 'sendSysMsgArgs,sendSysMsgArgs,sendSysMsgArgs' )
		assertEQ ( self.mm.params['sendSysMsgArgs.1'], {self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid' .. FIXID.WOOD .. '",' .. 1} )
		assertEQ ( self.mm.params['sendSysMsgArgs.2'], {self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid' .. FIXID.STONE .. '",' .. 2} )
		assertEQ ( self.mm.params['sendSysMsgArgs.3'], {self.player, SMSGT.SYSCHANNEL, CHAT_TAG.SYS, 100026, '"@itemid' .. FIXID.FOOD .. '",' .. 30} )
	end;
	
	test__addGetSelfResLogs = function(self)
		self.hdr.isSelfTarget = true
		self.hdr.player = self.player
		self.player:setRoleName('my_r')
		self.hdr.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200000)
		
		self.mm:mock( self.hdr, '_addGetSelfResLog' )
		self.hdr:_addGetSelfResLogs()
		assertEQ ( self.mm.walkLog, '_addGetSelfResLog' )
		assertEQ ( self.mm.params['_addGetSelfResLog'], {self.player, FARMLOG_TYPE.GETSELF, 'my_r'} )
		
		self.mm:clear()
		self.hdr.isSelfTarget = false
		self.hdr:_addGetSelfResLogs()
		assertEQ ( self.mm.walkLog, '_addGetSelfResLog,_addGetSelfResLog' )
		assertEQ ( self.mm.params['_addGetSelfResLog.1'], {self.player, FARMLOG_TYPE.GETOTHER, 'target_r'} )
		assertEQ ( self.mm.params['_addGetSelfResLog.2'], {self.hdr.targetPlayer, FARMLOG_TYPE.OTHERGET, 'my_r'} )
	end;
	
	test__addGetSelfResLog = function(self)
		local player = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200000)
		self.hdr.nums = {}
		
		self.mm:mock( player:getFarm(), 'addLog' )
		self.hdr:_addGetSelfResLog(player, 1, 'role')
		assertEQ ( self.mm.walkLog, '' )
		
		self.hdr.nums = {{resid=FIXID.FARM, state=FARM_STATE.COMPLETE, num=1},{resid=FIXID.FARM, state=FARM_STATE.SAPLING, num=2},{resid=FIXID.FARM, state=FARM_STATE.COMPLETE, num=3}}
		self.hdr:_addGetSelfResLog(player, 1, 'role')
		assertEQ ( self.mm.walkLog, 'addLog' )
		assertEQ ( self.mm.params['addLog'], {{ltype=1, role='role', param1=4, param2=0, param3=0, param4=0 }} )
	end;
	
	test__endHandle = function(self)
		self.hdr.targetPlayer = {}
		self.hdr.expend = RoleAttrExpend(self.player, {attr=ATTR.PS, val=0})
		self.mm:mock(self.hdr.expend, 'sub' )
		self.mm:mock(self.hdr, '_sendFarmsCanGetFlags' )
		self.hdr:_endHandle()
		assertEQ ( self.mm.walkLog, 'sub,_sendFarmsCanGetFlags' )
	end;
	
	test__sendFarmsCanGetFlags = function(self)
		self.hdr.player = self.player
		self.hdr.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r', 200000)
		self.mm:mock(self.hdr.targetPlayer:getFarm(), 'isCanGathers', {true})
		self.mm:mock(FarmSender, 'sendFarmsCanGetFlags')
		
		self.hdr.isSelfTarget = true
		self.hdr:_sendFarmsCanGetFlags()
		assertEQ ( self.mm.walkLog, '' )
		
		self.hdr.isSelfTarget = false
		self.hdr:_sendFarmsCanGetFlags()
		assertEQ ( self.mm.walkLog, 'isCanGathers,sendFarmsCanGetFlags' )
		assertEQ ( self.mm.params['isCanGathers'], {self.player:getRoleId()} )
		assertEQ ( self.mm.params['sendFarmsCanGetFlags'], {self.player, {{roleId=200000,flag=1}} } )
	end;
})

local TestCaseGatherFarmResHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = GatherFarmResHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test__isValidFarmId = function(self)
		self.hdr.player = self.player
		self.hdr.farm = self.player:getFarm()
		self.hdr.blockId = 1
		
		local g_getBlockByIdRt = {nil}
		local g_isCanGatherRt = {true}
		self.mm:mock( self.hdr.farm, 'getBlockById', g_getBlockByIdRt)
		self.mm:mock( self.hdr.farm, 'isCanGather', g_isCanGatherRt)
		
		assertEQ ( self.hdr:_isValidFarmId(), false )
		assertEQ ( self.mm.params['getBlockById'], {1} )
		
		self.mm:clear()
		g_getBlockByIdRt[1] = {}
		assertEQ ( self.hdr:_isValidFarmId(), true )
		assertEQ ( self.mm.params['isCanGather'], {self.player:getRoleId(), g_getBlockByIdRt[1]} )
		
		self.mm:clear()
		g_isCanGatherRt[1] = false
		assertEQ ( self.hdr:_isValidFarmId(), false )
	end;
	
	test__isValidState = function(self)
		self.hdr.block = {ucState=FARM_STATE.COMPLETE}
		assertEQ ( self.hdr:_isValidState(), true )
		
		self.hdr.block = {ucState=FARM_STATE.SAPLING}
		assertEQ ( self.hdr:_isValidState(), false )
	end;
	
	test__getNeedPSAttrVal = function(self)
		self.hdr.isSelfTarget = true
		assertEQ ( self.hdr:_getNeedPSAttrVal(), 0 )
		
		self.hdr.isSelfTarget = false
		assertEQ ( self.hdr:_getNeedPSAttrVal(), 1 )
	end;
	
	test__handleCurBlocks = function(self)
		self.mm:mock(self.hdr, '_handleCurBlock' )
		self.hdr:_handleCurBlocks()
		assertEQ ( self.mm.walkLog, '_handleCurBlock' )
	end;
})

local TestCaseGatherAllFarmResHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = GatherAllFarmResHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test__isValidFarmId = function(self)
		assertEQ ( self.hdr:_isValidFarmId(), true )
	end;
	
	test__isValidState = function(self)
		local r_getCanGatherCount = {0}
		self.mm:mock( self.hdr, '_getCanGatherCount', r_getCanGatherCount )
		assertEQ ( self.hdr:_isValidState(), false )
		
		r_getCanGatherCount[1] = 10
		assertEQ ( self.hdr:_isValidState(), true )
	end;
	
	test__getNeedPSAttrVal = function(self)
		self.hdr.isSelfTarget = true
		assertEQ ( self.hdr:_getNeedPSAttrVal(), 0 )
		
		self.mm:mock( self.hdr, '_getCanGatherCount', {10} )
		
		self.hdr.isSelfTarget = false
		assertEQ ( self.hdr:_getNeedPSAttrVal(), 10 )
	end;	
	
	test__handleCurBlocks = function(self)
		self.hdr.player = self.player
		self.hdr.farm = self.player:getFarm()
		self.hdr.farm:seedBlock({id=1, level=1, resid=1, state=FARM_STATE.SAPLING})
		
		local g_isCanGatherRt = {true}
		self.mm:mock( self.hdr, '_isCanGather', g_isCanGatherRt )
		self.mm:mock( self.hdr, '_setCurBlockAndId' )
		self.mm:mock( self.hdr, '_handleCurBlock' )
		
		self.hdr:_handleCurBlocks()
		assertEQ ( self.mm.walkLog, '_isCanGather,_setCurBlockAndId,_handleCurBlock' )
		assertEQ ( self.mm.params['_isCanGather'], {self.hdr.farm:getBlockByIdx(0)} )
		assertEQ ( self.mm.params['_setCurBlockAndId'], {self.hdr.farm:getBlockByIdx(0)} )
		
		self.mm:clear()
		g_isCanGatherRt[1] = false
		self.hdr:_handleCurBlocks()
		assertEQ ( self.mm.walkLog, '_isCanGather' )
	end;	
	
	test__isCanGather = function(self)
		self.hdr.player = self.player
		self.hdr.farm = self.player:getFarm()
		self.hdr.farm:seedBlock({id=1, level=1, resid=1, state=FARM_STATE.SAPLING})
		local block = self.hdr.farm:getBlockByIdx(0)
		
		local g_isCanGatherRt = {true}
		self.mm:mock( self.hdr.farm, 'isCanGather', g_isCanGatherRt )
		
		assertEQ ( self.hdr:_isCanGather(block), false )
		assertEQ ( self.mm.params['isCanGather'], {self.player:getRoleId(), block} )
		
		g_isCanGatherRt[1] = true 
		assertEQ ( self.hdr:_isCanGather(block), false )
		
		block.ucState = FARM_STATE.COMPLETE
		assertEQ ( self.hdr:_isCanGather(block), true )
		
		g_isCanGatherRt[1] = false 
		assertEQ ( self.hdr:_isCanGather(block), false )
	end;
	
	test__getCanGatherCount = function(self)
		self.hdr.player = self.player
		self.hdr.farm = self.player:getFarm()
		self.hdr.farm:seedBlock({id=1, level=1, resid=1, state=FARM_STATE.COMPLETE})
		self.hdr.farm:seedBlock({id=2, level=2, resid=1, state=FARM_STATE.COMPLETE})
		self.mm:mock( self.hdr, '_isCanGather', {true} )
		
		assertEQ ( self.hdr:_getCanGatherCount(), 2 )	
	end;
	
	test__doTasks = function(self)
		self.mm:mock(TaskFinisher, 'trigerTask')
		self.hdr.player = self.player
		self.hdr.isSelfTarget = false
		self.hdr:_doTasks()
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.GET_ALL_OTHERFARMRES} )
		
		self.hdr.isSelfTarget = true
		self.hdr:_doTasks()
		assertEQ ( self.mm.params['trigerTask'], {self.player, TASK_FINISH_TYPE.GET_ALL_FARMRES} )
	end;
})

local TestCasePreGatherFarmResHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = PreGatherFarmResHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test__isValidFarmId = function(self)
		self.hdr.isSelfTarget = false
		self.hdr.farm = self.player:getFarm()
		
		local g_getBlockByIdRt = {nil}
		self.mm:mock( self.hdr.farm, 'getBlockById', g_getBlockByIdRt)
		
		assertEQ ( self.hdr:_isValidFarmId(), false )
		
		self.hdr.isSelfTarget = true
		assertEQ ( self.hdr:_isValidFarmId(), false )
		
		g_getBlockByIdRt[1] = {}
		assertEQ ( self.hdr:_isValidFarmId(), true )
	end;
	
	test__isValidState = function(self)
		assertEQ ( self.hdr:_isValidState(), true )
	end;
	
	test__getNeedPSAttrVal = function(self)
		assertEQ ( self.hdr:_getNeedPSAttrVal(), 0 )
	end;		
	
	test__handleCurBlocks = function(self)
		self.mm:mock(self.hdr, '_handleCurBlock' )
		self.hdr:_handleCurBlocks()
		assertEQ ( self.mm.walkLog, '_handleCurBlock' )
	end;
})

local TestCaseInitFarmBlockHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = InitFarmBlockHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_init = function(self)
		assertEQ ( self.hdr.preGatherHdr:getClass(), PreGatherFarmResHdr )
	end;
	
	test_handle = function(self)
		local g_initParamRt = {false}
		local g_isValidFarmIdRt = {false}
		
		self.mm:mock(self.hdr, '_initParam', g_initParamRt)
		self.mm:mock(self.hdr, '_isValidFarmId', g_isValidFarmIdRt)
		self.mm:mock(self.hdr, '_gatherAndInitBlock')
		self.mm:mock(self.hdr, '_recalIdlePopu')
		self.mm:mock(self.hdr, '_sendMsgs')		
		
		local g_cmd = {}
		assertEQ ( self.hdr:handle(self.player, g_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam' )
		assertEQ ( self.mm.params['_initParam'], {self.player, g_cmd} )
		
		self.mm:clear()
		g_initParamRt[1] = true
		assertEQ ( self.hdr:handle(self.player, g_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam,_isValidFarmId' )
		
		self.mm:clear()
		g_isValidFarmIdRt[1] = true
		assertEQ ( self.hdr:handle(self.player, g_cmd), true )
		assertEQ ( self.mm.walkLog, '_initParam,_isValidFarmId,_gatherAndInitBlock,_recalIdlePopu,_sendMsgs' )
	end;
	
	test__initParam = function(self)
		local g_cmd = {blockId=1}
		assertEQ ( self.hdr:_initParam(self.player, g_cmd), true )
		assertEQ ( self.hdr.player, self.player )
		assertEQ ( self.hdr.cmdtb, g_cmd )
		assertEQ ( self.hdr.blockId, 1 )
		assertEQ ( self.hdr.farm, self.player:getFarm() )
	end;
	
	test__isValidFarmId = function(self)
		self.hdr.blockId = 1
		self.hdr.farm = self.player:getFarm()
		
		local g_block = {}
		local g_getBlockByIdRt = {g_block}
		self.mm:mock(self.player:getFarm(), 'getBlockById', g_getBlockByIdRt)
		assertEQ ( self.hdr:_isValidFarmId(), true )
		assertEQ ( self.hdr.block, g_block)
		
		g_getBlockByIdRt[1] = nil
		assertEQ ( self.hdr:_isValidFarmId(), false )
	end;
	
	test__gatherAndInitBlock = function(self)
		self.hdr.player = self.player
		self.hdr.cmdtb = {}
		self.hdr.blockId = 1
		self.hdr.farm = self.player:getFarm()
		
		self.mm:mock(self.hdr.preGatherHdr, 'handle' )
		self.mm:mock(self.player:getFarm(), 'delBlock' )
		
		self.hdr:_gatherAndInitBlock()
		assertEQ ( self.mm.walkLog, 'handle,delBlock' )
		assertEQ ( self.mm.params['handle'], {self.player, self.hdr.cmdtb} )
		assertEQ ( self.mm.params['delBlock'], {1} )
	end;
	
	test__recalIdlePopu = function(self)
		self.hdr.player = self.player
		self.mm:mock( self.player:getCityRes(), 'getIdlePopu', {1} )
		self.mm:mock( self.player:getCityRes(), 'setIdlePopu' )
		self.hdr:_recalIdlePopu()
		assertEQ ( self.mm.walkLog, 'getIdlePopu,setIdlePopu' )
		assertEQ ( self.mm.params['setIdlePopu'], {1 + res_farmblock_needpopu} )
	end;
	
	test__sendMsgs = function(self)
		self.hdr.player = self.player
		self.hdr.blockId = 1
		self.mm:mock( PopuSender, 'send')
		self.mm:mock( FarmSender, 'sendDelBlock')
		
		self.hdr:_sendMsgs()
		assertEQ ( self.mm.walkLog, 'send,sendDelBlock' )
		assertEQ ( self.mm.params['send'], {self.player, {'idle'}} )
		assertEQ ( self.mm.params['sendDelBlock'], {self.player, 1} )
	end;
})

local TestCaseGetFarmLogHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = GetFarmLogHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(FarmSender, 'sendLogs')
		self.hdr:handle(self.player, {ver=0})
		assertEQ ( self.mm.walkLog, '' )
		
		self.hdr:handle(self.player, {ver=-1})
		assertEQ ( self.mm.walkLog, 'sendLogs' )
		assertEQ ( self.mm.params['sendLogs'], {self.player} )
	end;
})

local TestCaseGetFarmsGetCanFlagHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = GetFarmsGetCanFlagHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)	
		local r_initParam = {false}
		local r_collects = {{{roleId=1,flag=1},{roleId=2,flag=1}}}
		self.mm:mock(self.hdr, '_initParam', r_initParam)
		self.mm:mock(self.hdr, '_collects', r_collects)
		self.mm:mock(FarmSender, 'sendFarmsCanGetFlags')
		
		local cmd = {}
		assertEQ ( self.hdr:handle(self.player, cmd), false )
		assertEQ ( self.mm.walkLog, '_initParam' )
		assertEQ ( self.mm.params['_initParam'], {self.player, cmd} )
		
		self.mm:clear()
		r_initParam[1] = true
		self.hdr.player = self.player
		assertEQ ( self.hdr:handle(self.player, cmd), true )
		assertEQ ( self.mm.walkLog, '_initParam,_collects,sendFarmsCanGetFlags' )
		assertEQ ( self.mm.params['sendFarmsCanGetFlags'], {self.player, r_collects[1]} )
	end;
	
	test__initParam = function(self)
		local cmd = {count=0}
		assertEQ ( self.hdr:_initParam(self.player, cmd), false )
		
		cmd = {count=-1}
		assertEQ ( self.hdr:_initParam(self.player, cmd), false )
		
		cmd = {count=self.hdr.C_ITEM_COUNT+1}
		assertEQ ( self.hdr:_initParam(self.player, cmd), false )
		
		local g_player = TestCaseHelper:loadPlayerByUserNameEx('player', 'player_r', 100000)
		cmd = {count=2, id1=100000, id2=0}
		assertEQ ( self.hdr:_initParam(self.player, cmd), true )
		assertEQ ( self.hdr.roles, {g_player} )
		assertEQ ( self.hdr.player, self.player )
	end;
	
	test__collects = function(self)
		local g_player = TestCaseHelper:loadPlayerByUserNameEx('player', 'player_r', 100000)
		self.hdr.roles = {g_player}
		self.hdr.player = self.player
		self.mm:mock(g_player:getFarm(), 'isCanGathers', {true})
		assertEQ ( self.hdr:_collects(), {{roleId=100000,flag=1}} )
		assertEQ ( self.mm.params['isCanGathers'], {self.player:getRoleId()} )
		
		g_player:setCityGrid({objType=OBJ_TYPE.DIED_ROLE})
		assertEQ ( self.hdr:_collects(), {{roleId=100000,flag=0}} )
	end;
})

tqFarmResHandler_t_main = function(suite)
	suite:addTestCase(TestCaseFarmResHandler, 'TestCaseFarmResHandler')
	suite:addTestCase(TestCaseGetFarmHdr, 'TestCaseGetFarmHdr')
	suite:addTestCase(TestCaseSeedFarmHdr, 'TestCaseSeedFarmHdr')
	suite:addTestCase(TestCaseBaseGatherFarmResHdr, 'TestCaseBaseGatherFarmResHdr')
	suite:addTestCase(TestCaseGatherFarmResHdr, 'TestCaseGatherFarmResHdr')
	suite:addTestCase(TestCaseGatherAllFarmResHdr, 'TestCaseGatherAllFarmResHdr')
	suite:addTestCase(TestCasePreGatherFarmResHdr, 'TestCasePreGatherFarmResHdr')
	suite:addTestCase(TestCaseInitFarmBlockHdr, 'TestCaseInitFarmBlockHdr')
	suite:addTestCase(TestCaseGetFarmLogHdr, 'TestCaseGetFarmLogHdr')
	suite:addTestCase(TestCaseGetFarmsGetCanFlagHdr, 'TestCaseGetFarmsGetCanFlagHdr')
end;

