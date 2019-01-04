--*******************************************************************************
--  
--*******************************************************************************
require('tqOutFieldHandler')

local TestCaseOutFieldHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.handler = OutFieldHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assert ( self.handler:getHandler(0):getClass() == NullHandler )
		assert ( self.handler:getHandler(1):getClass() == GetOutFieldHandler )
		assert ( self.handler:getHandler(2):getClass() == GetFieldDetailHandler )
		assert ( self.handler:getHandler(3):getClass() == RefreshCurFieldsHandler )
		assert ( self.handler:getHandler(4):getClass() == EnterOutFieldHandler )
	end;
})

local TestCaseGetOutFieldHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.handler = GetOutFieldHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local g_cmd = {}
		local g_initParamsRt = {false}
		local g_isArrivedIntervalRt = {false}
		
		self.mm:mock(self.handler, '_initParams', g_initParamsRt)
		self.mm:mock(self.handler, '_isArrivedInterval', g_isArrivedIntervalRt)
		self.mm:mock(self.handler, '_calcNeedSendBlocks')
		self.mm:mock(self.handler, '_sendBlocks')
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams' )
		assertListEQ ( self.mm.params['_initParams'], {self.player, g_cmd} )
		
		self.mm:clear()
		g_initParamsRt[1] = true
		assert ( self.handler:handle(self.player, g_cmd) == false )
		assert ( self.mm.walkLog == '_initParams,_isArrivedInterval' )
		
		self.mm:clear()
		g_isArrivedIntervalRt[1] = true
		assert ( self.handler:handle(self.player, g_cmd) == true )
		assert ( self.mm.walkLog == '_initParams,_isArrivedInterval,_calcNeedSendBlocks,_sendBlocks' )
	end;
	
	test__initParams = function(self)
		local g_cmd = {posX=-1, posY=2}
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		local g_cmd = {posX=GRIDS_COL*C_OUTFIELD_BLOCK_W, posY=2}
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		local g_cmd = {posX=1, posY=-1}
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		local g_cmd = {posX=1, posY=GRIDS_ROW*C_OUTFIELD_BLOCK_H}
		assert ( self.handler:_initParams(self.player, g_cmd) == false )
		
		local g_cmd = {posX=1, posY=2}
		assert ( self.handler:_initParams(self.player, g_cmd) == true )
		assert ( self.handler.player == self.player )
		assert ( self.handler.pos.x == 1 )
		assert ( self.handler.pos.y == 2 )
	end;
	
	test__isArrivedInterval = function(self)
		self.handler.player = self.player
	
		self.mm:mock(SPub, 'getTimeMs', {self.handler.CMD_GETFIELDSBYPOS_INTERVAL})
		
		self.player:setLastGetFieldsTimeMs(1)
		assert ( self.handler:_isArrivedInterval() == false )
		
		self.player:setLastGetFieldsTimeMs(0)
		assert ( self.handler:_isArrivedInterval() == true )
	end;
	
	test__calcNeedSendBlocks = function(self)
		self.handler.player = self.player
		self.handler.pos = {x=1,y=2}
		self.player:setLastGetFieldsPos(100, 200)
		
		local g_getClientViewPosRt1= {}
		local g_getClientViewPosRt2= {}
		local g_cnt = 1
		self.mm:mock( self.handler, '_calcBlockIdxs',  nil, function(self)
			if g_cnt == 1 then
				g_cnt = g_cnt + 1
				return g_getClientViewPosRt1
			else
				return g_getClientViewPosRt2
			end
			end)
		self.mm:mock( self.handler, '_removeLastBlockIdxs' )
		
		self.handler:_calcNeedSendBlocks()
		assert ( self.mm.walkLog == '_calcBlockIdxs,_calcBlockIdxs,_removeLastBlockIdxs' )
		assert ( self.handler.curBlockIdxs == g_getClientViewPosRt1 )
		assertListEQ ( self.mm.params['_calcBlockIdxs.1'], {self.handler.pos})
		assertListEQ ( self.mm.params['_calcBlockIdxs.2'], {self.player:getLastGetFieldsPos()})
		assertListEQ ( self.mm.params['_removeLastBlockIdxs'], {g_getClientViewPosRt2})
		
		local pos = self.player:getLastGetFieldsPos()
		assert ( pos.x == 1 )
		assert ( pos.y == 2 )
	end;
	
	test__calcBlockIdxs = function(self)
		local g_pos = {}
		local r_viewPosRt = {{left=200*319, top=200*160, right=201*319, bottom=201*160}}
		self.mm:mock( self.handler, '_getClientViewPos', r_viewPosRt )
		local ids = self.handler:_calcBlockIdxs(g_pos)
		assertEQ ( self.mm.walkLog, '_getClientViewPos' )
		assertEQ ( self.mm.params['_getClientViewPos'], {g_pos} )
		assert ( ids[200*600+200] == true )
		
		r_viewPosRt[1] = {left=0, top=600*160, right=199*320, bottom=799*160}
		ids = self.handler:_calcBlockIdxs(g_pos)
		assertEQ ( ids, {} )
	end;
	
	test__getClientViewPos = function(self)
		local g_pos = {x=0, y=0}
		local viewPort = self.handler:_getClientViewPos(g_pos)
		assert( viewPort.left == 0 )
		assert( viewPort.top == 0 )
		assert( viewPort.right == self.handler.MAX_SCREEN_W )
		assert( viewPort.bottom == self.handler.MAX_SCREEN_H )
		
		local g_pos = {x= MAX_CITYMAP_W, y=MAX_CITYMAP_H}
		local viewPort = self.handler:_getClientViewPos(g_pos)
		assert( viewPort.left == MAX_CITYMAP_W - self.handler.MAX_SCREEN_W )
		assert( viewPort.top == MAX_CITYMAP_H - self.handler.MAX_SCREEN_H )
		assert( viewPort.right == MAX_CITYMAP_W )
		assert( viewPort.bottom == MAX_CITYMAP_H )
		
		local g_pos = {x= 2000, y=3000}
		local viewPort = self.handler:_getClientViewPos(g_pos)
		assert( viewPort.left == 2000 - self.handler.MAX_SCREEN_W/2 )
		assert( viewPort.top == 3000 - self.handler.MAX_SCREEN_H/2 )
		assert( viewPort.right == viewPort.left + self.handler.MAX_SCREEN_W )
		assert( viewPort.bottom == viewPort.top + self.handler.MAX_SCREEN_H )
	end;
	
	test__removeLastBlockIdxs = function(self)
		self.handler.curBlockIdxs = {}
		self.handler.curBlockIdxs[1] = true
		self.handler.curBlockIdxs[2] = true
		
		local lastBlockIds = {}
		lastBlockIds[1] = true
		self.handler:_removeLastBlockIdxs(lastBlockIds)
		
		assert ( self.handler.curBlockIdxs[1] ~= true )
		assert ( self.handler.curBlockIdxs[2] == true )
	end;
	
	test__sendBlocks = function(self)
		self.handler.player = self.player
		self.handler.curBlockIdxs = {}
		self.handler.curBlockIdxs[1] = false
		self.handler.curBlockIdxs[2] = true
		
		self.mm:mock(OutFieldSender, 'sendFields')
		self.handler:_sendBlocks()
		
		assert ( self.mm.walkLog == 'sendFields' )
		assert ( self.mm.params['sendFields'][1] == self.player )
		assert ( table.getn(self.mm.params['sendFields'][2]) == 1 )
		assert ( self.mm.params['sendFields'][2][1] == 2 + 1, 'convert idx to id' )
	end;
})

local TestCaseGetFieldDetailHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.handler = GetFieldDetailHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local g_initParamsRt = {false}
		local g_isRoleFieldRt = {false}
		self.mm:mock(self.handler, '_initParams', g_initParamsRt)
		self.mm:mock(self.handler, '_isRoleField', g_isRoleFieldRt)
		self.mm:mock(OutFieldSender, 'sendFieldDetail')
		self.mm:nologMock(WUtil, 'sendWarningMsgArgs')
		
		local g_cmd = {}
		self.handler.grid = {objType = OBJ_TYPE.ROLE }
		assertEQ ( self.handler:handle(self.player, g_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParams' )
		assertEQ ( self.mm.params['_initParams'], {self.player, g_cmd} )
		
		self.mm:clear()
		g_initParamsRt[1] = true
		self.handler.grid = {objType = OBJ_TYPE.DIED_ROLE }
		assertEQ ( self.handler:handle(self.player, g_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParams' )
		assertEQ ( self.mm.params['sendWarningMsgArgs'], {self.player, 100170, ''} )
		
		self.mm:clear()
		self.handler.grid = {objType = OBJ_TYPE.ROLE }
		assertEQ ( self.handler:handle(self.player, g_cmd), false )
		assertEQ ( self.mm.walkLog, '_initParams,_isRoleField' )
		
		self.mm:clear()
		self.handler.grid = {gridId=1}
		g_isRoleFieldRt[1] = true
		assertEQ ( self.handler:handle(self.player, g_cmd), true )
		assertEQ ( self.mm.walkLog, '_initParams,_isRoleField,sendFieldDetail' )
		assertEQ ( self.mm.params['sendFieldDetail'], {self.player, self.handler.grid} )
	end;
	
	test__initParams = function(self)
		local r_getGridByGridId = {nil}
		local r_getGridByRole = {nil}
		self.mm:mock( self.handler, '_getGridByGridId', r_getGridByGridId )
		self.mm:mock( self.handler, '_getGridByRole', r_getGridByRole )
		local g_cmd = {gridId=0, roleName='role'}
		assertEQ ( self.handler:_initParams(self.player, g_cmd), false )
		
		r_getGridByGridId[1] = {gridId=1}
		assertEQ ( self.handler:_initParams(self.player, g_cmd), true )
		assertEQ ( self.handler.grid, {gridId=1} )
		assertEQ ( self.handler.player, self.player )
		
		r_getGridByGridId[1] = nil
		r_getGridByRole[1] = {gridId=2}
		assertEQ ( self.handler:_initParams(self.player, g_cmd), true )
		assertEQ ( self.handler.grid, {gridId=2} )
	end;
	
	test__getGridByGridId = function(self)
		self.mm:mock( app:getCityMgr(), 'getGridByGridId', {{gridId=1}} )
		local g_cmd = {gridId=0}
		assertEQ ( self.handler:_getGridByGridId(g_cmd), null )
		
		local g_cmd = {gridId=800*800+1}
		assertEQ ( self.handler:_getGridByGridId(g_cmd), null )
		
		local g_cmd = {gridId=1}
		assertEQ ( self.handler:_getGridByGridId(g_cmd), {gridId=1} )
	end;
	
	test__getGridByRole = function(self)
		self.mm:mock( app:getCityMgr(), 'getGridByRoleName', {{gridId=1}} )
		local g_cmd = {roleName='role'}
		assertEQ ( self.handler:_getGridByRole(g_cmd), {gridId=1} )
		assertEQ ( self.mm.params['getGridByRoleName'], {'role'} )
	end;
	
	test__isRoleField = function(self)
		self.handler.grid = {gridId=1, objType= OBJ_TYPE.ROLE }
		assertEQ ( self.handler:_isRoleField(), true )
		
		self.handler.grid = {gridId=1, objType= OBJ_TYPE.COPYFIELD }
		assertEQ ( self.handler:_isRoleField(), false )
	end;
})

local TestCaseRefreshCurFieldsHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = RefreshCurFieldsHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_init = function(self)
		assertEQ ( self.hdr.getFieldsHdr:getClass(), GetOutFieldHandler )
	end;
	
	test_handle = function(self)
		self.player:setLastGetFieldsPos(1,2)
		self.mm:travelMock(self.player, 'setLastGetFieldsPos')
		self.mm:mock(self.hdr.getFieldsHdr, 'handle')
		self.hdr:handle(self.player)
		assertEQ ( self.mm.walkLog, 'setLastGetFieldsPos,handle' )
		assertEQ ( self.mm.params['setLastGetFieldsPos'], {MAX_CITYMAP_W, MAX_CITYMAP_H} )
		assertEQ ( self.mm.params['handle'], {self.player, {posX=1, posY=2}} )
	end;
})

local TestCaseEnterOutFieldHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = OutFieldHandler():getHandler(4)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		self.mm:mock(MoneySender, 'send:moneySend')
		self.mm:mock(CommResSender, 'send:CommResSend')
		
		self.player:getCityRes():setMoney(self.player:getCitys():getMaxMoney() + 1)
		self.player:getCityRes():setFood(self.player:getCitys():getMaxCRes() + 1)
		self.player:getCityRes():setWood(self.player:getCitys():getMaxCRes() + 1)
		self.player:getCityRes():setStone(self.player:getCitys():getMaxCRes() + 1)
		self.player:getCityRes():setIron(self.player:getCitys():getMaxCRes() + 1)
		
		assertEQ (self.player:getCityRes():getMoney(), self.player:getCitys():getMaxMoney() + 1)
		assertEQ (self.player:getCityRes():getFood(), self.player:getCitys():getMaxCRes() + 1)
		
		self.hdr:handle(self.player)
		assertEQ (self.mm.params['moneySend'], {self.player, {'money'}})
		assertEQ (self.mm.params['CommResSend'], {self.player, {FIXID.FOOD, FIXID.WOOD, FIXID.STONE, FIXID.IRON}})
		assertEQ (self.player:getCityRes():getMoney(), self.player:getCitys():getMaxMoney())
		assertEQ (self.player:getCityRes():getFood(), self.player:getCitys():getMaxCRes())
		assertEQ (self.player:getCityRes():getWood(), self.player:getCitys():getMaxCRes())
		assertEQ (self.player:getCityRes():getStone(), self.player:getCitys():getMaxCRes())
		assertEQ (self.player:getCityRes():getIron(), self.player:getCitys():getMaxCRes())
	end;
})

tqOutFieldHandler_t_main = function(suite)
	suite:addTestCase(TestCaseOutFieldHandler, 'TestCaseOutFieldHandler')
	suite:addTestCase(TestCaseGetOutFieldHandler, 'TestCaseGetOutFieldHandler')
	suite:addTestCase(TestCaseGetFieldDetailHandler, 'TestCaseGetFieldDetailHandler')
	suite:addTestCase(TestCaseRefreshCurFieldsHandler, 'TestCaseRefreshCurFieldsHandler')
	suite:addTestCase(TestCaseEnterOutFieldHandler, 'TestCaseEnterOutFieldHandler')
end;


