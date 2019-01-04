require('tqChatHandler')

local TestCaseChatHandler = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ChatHandler()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_getHandler = function(self)
		assertEQ ( self.hdr:getHandler(0):getClass(), ChatSendMsgHdr )
	end;
})

local TestCaseChatSendMsgHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ChatHandler():getHandler(0)
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local chatHdr = ChatSendPlayerHdr()
		self.mm:mock(self.hdr, '_getChatHdr', {chatHdr})
		self.mm:mock(chatHdr, 'handle')
		
		cmd = {target=CHAT_TARGET.STATE, msg=""}
		self.hdr:handle(self.player, cmd)
		assertEQ ( self.mm.walkLog, '' )
		
		cmd = {target=CHAT_TARGET.STATE, msg="hello state"}
		self.hdr:handle(self.player, cmd)
		assertEQ ( self.mm.walkLog, '_getChatHdr,handle' )
		assertEQ ( self.mm.params['_getChatHdr'], {CHAT_TARGET.STATE} )
		assertEQ ( self.mm.params['handle'], {self.player, CHAT_TARGET.STATE, "hello state"} )
	end;
	
	test__setParams = function(self)
		local cmd = {target=CHAT_TARGET.STATE, msg="    "}
		assertEQ ( self.hdr:_setParams(self.player, cmd), false )
		
		cmd = {target=CHAT_TARGET.STATE, msg="/role hello\nworld"}
		assertEQ ( self.hdr:_setParams(self.player, cmd), true )
		assertEQ ( self.hdr.msg, '/role hello world' )
		assertEQ ( self.hdr.player, self.player )
		assertEQ ( self.hdr.target, CHAT_TARGET.PLAYER )
	end;
	
	test__isValidLength = function(self)
		local r_len = {0}
		self.mm:mock(string, 'len', r_len)
		
		local msg = 'msg ... '
		assertEQ ( self.hdr:_isValidLength(msg), false )
		
		r_len[1] = 1
		assertEQ ( self.hdr:_isValidLength(msg), true )
		
		r_len[1] = chat_msg_max_len
		assertEQ ( self.hdr:_isValidLength(msg), true )
		
		r_len[1] = chat_msg_max_len + 1
		assertEQ ( self.hdr:_isValidLength(msg), false )
	end;
	
	test__filterMsg = function(self)
		local msg="fuck,GM,\rworld\nhello"
		assertEQ ( self.hdr:_filterMsg(msg), '*,*, world hello' )
	end;
	
	test__formatWhenChatToRole = function(self)
		assertEQ ( self.hdr:_formatWhenChatToRole(CHAT_TARGET.ALLIANCE, 'msg'), CHAT_TARGET.ALLIANCE)
		assertEQ ( self.hdr:_formatWhenChatToRole(CHAT_TARGET.WORLD, 'msg'), CHAT_TARGET.WORLD)
		assertEQ ( self.hdr:_formatWhenChatToRole(CHAT_TARGET.STATE, 'msg'), CHAT_TARGET.STATE)
		assertEQ ( self.hdr:_formatWhenChatToRole(CHAT_TARGET.STATE, '/role msg'), CHAT_TARGET.PLAYER)
		assertEQ ( self.hdr:_formatWhenChatToRole(CHAT_TARGET.WORLD, '/role msg'), CHAT_TARGET.PLAYER)
		assertEQ ( self.hdr:_formatWhenChatToRole(CHAT_TARGET.ALLIANCE, '/role msg'), CHAT_TARGET.PLAYER)
	end;
	
	test__getChatHdr = function(self)
		assertEQ ( self.hdr:_getChatHdr(CHAT_TARGET.PLAYER):getClass(), ChatSendPlayerHdr)
		assertEQ ( self.hdr:_getChatHdr(CHAT_TARGET.STATE):getClass(), ChatSendStateHdr)
		assertEQ ( self.hdr:_getChatHdr(CHAT_TARGET.ALLIANCE):getClass(), ChatSendAllianceHdr)
		assertEQ ( self.hdr:_getChatHdr(CHAT_TARGET.WORLD):getClass(), ChatSendWorldHdr)
		assertEQ ( self.hdr:_getChatHdr(CHAT_TARGET.WORLD+100):getClass(), NullHandler:getClass())
	end;
})

local TestCaseChatSendBaseHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ChatSendBaseHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test_handle = function(self)
		local r_hasQualificatione = {false}
		local r_isTooFrequency = {true}
		local r_isEnoughExpends = {false}
		self.mm:travelMock(self.hdr, '_setParams')
		self.mm:mock(self.hdr, '_hasQualificatione', r_hasQualificatione)
		self.mm:mock(self.hdr, '_isTooFrequency', r_isTooFrequency)
		self.mm:mock(WUtil, 'isEnoughExpends', r_isEnoughExpends)
		self.mm:mock(WUtil, 'subExpends')
		self.mm:mock(self.hdr, '_collectPlayers', {'players'})
		self.mm:mock(self.hdr, '_sendChatMsg')
		
		self.hdr:handle(self.player, CHAT_TARGET.STATE, 'msg')
		assertEQ ( self.mm.walkLog, '_setParams,_hasQualificatione' )
		assertEQ ( self.mm.params['_setParams'], {self.player, CHAT_TARGET.STATE, 'msg'} )
		
		self.mm:clear()
		r_hasQualificatione[1] = true
		self.hdr:handle(self.player, CHAT_TARGET.STATE, 'msg')
		assertEQ ( self.mm.walkLog, '_setParams,_hasQualificatione,_isTooFrequency' )
		
		self.mm:clear()
		r_isTooFrequency[1] = false
		self.hdr:handle(self.player, CHAT_TARGET.STATE, 'msg')
		assertEQ ( self.mm.walkLog, '_setParams,_hasQualificatione,_isTooFrequency,isEnoughExpends' )
		assertEQ ( self.mm.params['isEnoughExpends'], {{}} )
		
		self.mm:clear()
		Util:setTimeDrt(10)
		r_isEnoughExpends[1] = true
		self.hdr:handle(self.player, CHAT_TARGET.STATE, 'msg')
		assertEQ ( self.mm.walkLog, '_setParams,_hasQualificatione,_isTooFrequency,isEnoughExpends,subExpends,_collectPlayers,_sendChatMsg' )
		assertEQ ( self.mm.params['isEnoughExpends'], {{}} )
		assertEQ ( self.mm.params['subExpends'], {{}} )
		assertEQ ( self.mm.params['_sendChatMsg'], {'players'} )
		assertEQ ( self.player:getChatLastTime(CHAT_TARGET.STATE), Util:getTime())
	end;
	
	test__setParams = function(self)
		self.hdr:_setParams(self.player, CHAT_TARGET.PLAYER, 'msg')
		assertEQ ( self.hdr.player, self.player)
		assertEQ ( self.hdr.target, CHAT_TARGET.PLAYER)
		assertEQ ( self.hdr.msg, 'msg')
	end;
	
	test__hasQualificatione = function(self)
		assertEQ ( self.hdr:_hasQualificatione(), true )
	end;
	
	test__isTooFrequency = function(self)
		self.hdr.player = self.player
		self.player:setChatLastTime(CHAT_TARGET.STATE, 100)
		Util:setTimeDrt(100 + self.hdr.lastLimitTimes[CHAT_TARGET.STATE])
		assertEQ ( self.hdr:_isTooFrequency(CHAT_TARGET.STATE), false )
		
		Util:setTimeDrt(100 + self.hdr.lastLimitTimes[CHAT_TARGET.STATE] - 1)
		assertEQ ( self.hdr:_isTooFrequency(CHAT_TARGET.STATE), true )
	end;
	
	test__createExpends = function(self)
		assertEQ ( self.hdr:_createExpends(), {} )
	end;
	
	test__collectPlayers = function(self)
		assertEQ ( self.hdr:_collectPlayers(), nil )
	end;
	
	test__sendChatMsg = function(self)
		self.player:setRoleId(10000)
		self.player:setRoleName('myrole')
		
		self.mm:mock( ChatSender, 'sendMsg' )
		local fromInfo = {vip=0,blue={level=0,year=0,super=0,grow=0}}
		local players = {{name='player1'},{name='player2'}}
		self.hdr:_setParams(self.player, CHAT_TARGET.STATE, 'msg')
		self.hdr:_sendChatMsg(players)
		assertEQ ( self.mm.walkLog, 'sendMsg,sendMsg' )
		assertEQ ( self.mm.params['sendMsg.1'], {{name='player1'}, self.player:getCityId(),10000, 'myrole', fromInfo, CHAT_CHANNEL.STATE, 'msg'} )
		assertEQ ( self.mm.params['sendMsg.2'], {{name='player2'}, self.player:getCityId(), 10000, 'myrole', fromInfo, CHAT_CHANNEL.STATE, 'msg'} )
	end;	
})

local TestCaseChatSendPlayerHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ChatSendPlayerHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test__setParams = function(self)
		self.hdr:_setParams(self.player, CHAT_TARGET.PLAYER, '/role msg')
		assertEQ ( self.hdr.player, self.player)
		assertEQ ( self.hdr.target, CHAT_TARGET.PLAYER)
		assertEQ ( self.hdr.targetRoleName, 'role')
		assertEQ ( self.hdr.msg, 'msg')
		assertEQ ( self.hdr.targetPlayer, NullPlayer)
	end;
	
	test__hasQualificatione = function(self)
		local r_isHasTargetPlayer = {false}
		self.mm:mock(self.hdr, '_isHasTargetPlayer', r_isHasTargetPlayer)
		self.mm:mock(ChatSender, 'sendMsg')
		
		self.hdr.targetRoleName = ''
		self.hdr.msg = 'msg'
		self.hdr.player = self.player
		assertEQ ( self.hdr:_hasQualificatione(), false )
		
		self.hdr.targetRoleName = 'target'
		self.hdr.msg = ''
		assertEQ ( self.hdr:_hasQualificatione(), false )
		
		local fromInfo = {vip=0,blue={level=0,year=0,super=0,grow=0}}
		self.hdr.targetRoleName = 'target'
		self.hdr.msg = 'msg'
		assertEQ ( self.hdr:_hasQualificatione(), false )
		assertEQ ( self.mm.params['sendMsg'], {self.player, 0, CHAT_SYSPLAYER.SYS, '', fromInfo, CHAT_CHANNEL.PRIVATE, rstr.chat.noplayer} )
		
		r_isHasTargetPlayer[1] = true
		assertEQ ( self.hdr:_hasQualificatione(), true )
	end;
	
	test__splitToPlayerMsg = function(self)
		local msg = '/abc'
		self.hdr:_splitToPlayerMsg(msg)
		assertEQ ( self.hdr.targetRoleName, 'abc' )
		assertEQ ( self.hdr.msg, '' )
		
		msg = '/abc hello'
		self.hdr:_splitToPlayerMsg(msg)
		assertEQ ( self.hdr.targetRoleName, 'abc' )
		assertEQ ( self.hdr.msg, 'hello' )
		
		msg = '/abc     '
		self.hdr:_splitToPlayerMsg(msg)
		assertEQ ( self.hdr.targetRoleName, 'abc' )
		assertEQ ( self.hdr.msg, '' )
		
		msg = '/ hello     '
		self.hdr:_splitToPlayerMsg(msg)
		assertEQ ( self.hdr.targetRoleName, '' )
		assertEQ ( self.hdr.msg, 'hello' )
	end;
	
	test__initTargetPlayer = function(self)
		self.hdr.player = self.player
		self.hdr.targetRoleName = 'targetName'
		local r_getGridByRoleName = {nil}
		local r_getPlayerByName = {nil}
		self.mm:mock(app:getCityMgr(), 'getGridByRoleName', r_getGridByRoleName)
		self.mm:mock(app:getPlayerMgr(), 'getPlayerByName', r_getPlayerByName)
		self.hdr:_initTargetPlayer()
		assertEQ ( self.hdr.targetPlayer, NullPlayer )
		
		r_getGridByRoleName[1] = {userName='targetUser'}
		self.hdr:_initTargetPlayer()
		assertEQ ( self.hdr.targetPlayer, NullPlayer )
		assertEQ ( self.mm.params['getPlayerByName'], {'targetUser'})
		
		r_getPlayerByName[1] = {name='targetPlayer'}
		self.hdr:_initTargetPlayer()
		assertEQ ( self.hdr.targetPlayer, {name='targetPlayer'} )
		
		r_getPlayerByName[1] = self.player
		self.hdr:_initTargetPlayer()
		assertEQ ( self.hdr.targetPlayer, NullPlayer )
	end;
	
	test__isHasTargetPlayer = function(self)
		self.hdr.targetRoleName = 'targetName'
		local r_getGridByRoleName = {nil}
		self.mm:mock(app:getCityMgr(), 'getGridByRoleName', r_getGridByRoleName)
		assertEQ ( self.hdr:_isHasTargetPlayer(), false )
		r_getGridByRoleName[1] = {userName='targetUser'}
		assertEQ ( self.hdr:_isHasTargetPlayer(), true )
	end;
	
	test__collectPlayers = function(self)
		self.hdr.player = self.player
		self.hdr.targetPlayer = {name='targetPlayer'}
		assertEQ ( self.hdr:_collectPlayers(), {self.player, {name='targetPlayer'}} )
	end;
	
	test__sendChatMsg = function(self)
		self.mm:mock(ChatSender, 'sendPlayerMsg')
		
		self.player:setRoleId(10000)
		self.player:setRoleName('myrole')
		self.hdr.target = CHAT_TARGET.PLAYER
		self.hdr.msg = 'msg'
		self.hdr.player = self.player
		self.hdr.targetPlayer = TestCaseHelper:loadPlayerByUserNameEx('target', 'target_r',200000)

		local fromInfo = {vip=0,blue={level=0,year=0,super=0,grow=0}}
		local toInfo = {vip=0,blue={level=0,year=0,super=0,grow=0}}
		local players = {self.hdr.player, self.hdr.targetPlayer}
		self.hdr:_sendChatMsg(players)
		assertEQ ( self.mm.walkLog, 'sendPlayerMsg,sendPlayerMsg' )
		assertEQ ( self.mm.params['sendPlayerMsg.1'], {self.hdr.player, 10000, 'myrole',fromInfo, 200000, 'target_r', toInfo, CHAT_CHANNEL.PRIVATE, 'msg'} )
		assertEQ ( self.mm.params['sendPlayerMsg.2'], {self.hdr.targetPlayer, 10000, 'myrole', fromInfo, 200000, 'target_r', toInfo, CHAT_CHANNEL.PRIVATE, 'msg'} )
	end;
})

local TestCaseChatSendStateHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ChatSendStateHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	
	test__createExpends = function(self)
		self.mm:mock(WUtil, 'createExpendObjs', {'objs'})
		self.hdr:_setParams(self.player, CHAT_TARGET.STATE, 'msg')
		assertEQ ( self.hdr:_createExpends(), 'objs' )
		assertEQ ( self.mm.params['createExpendObjs'], {self.player, 'nil', {{resid=FIXID.SMALLSPEAKER, type=EXPEND_TYPE.ITEM,val=1}} } )
	end;
	
	test__collectPlayers = function(self)
		self.player:setCityId(1)
		self.hdr:_setParams(self.player, CHAT_TARGET.STATE, 'msg')
		--self.mm.mock(app.getPlayerMgr(), 'collectOnlinePlayersBy', {'players'})
		self.mm:mock(app:getPlayerMgr(), 'getAllOnlinePlayers', {'players'})
		assertEQ ( self.hdr:_collectPlayers(), 'players' )
		--assertEQ ( self.mm.params['collectOnlinePlayersBy'], {CityStatePlayerSpec(self.player.getCityId())} )
	end;
})

local TestCaseChatSendAllianceHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ChatSendAllianceHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test__hasQualificatione = function(self)
		self.mm:mock(ChatSender, 'sendMsg')
		self.hdr:_setParams(self.player, CHAT_TARGET.ALLIANCE, 'msg')
		self.player:setAlliId(0)
		local fromInfo = {vip=0,blue={level=0,year=0,super=0,grow=0}}
		assertEQ ( self.hdr:_hasQualificatione(), false )
		assertEQ ( self.mm.params['sendMsg'], {self.player, 0, CHAT_SYSPLAYER.ALLIANCE, '', fromInfo, CHAT_CHANNEL.ALLIANCE, rstr.chat.noalliance} )
		
		self.mm:clear()
		self.player:setAlliId(1)
		assertEQ ( self.hdr:_hasQualificatione(), true )
		assertEQ ( self.mm.walkLog, '' )
	end;
	
	test__collectPlayers = function(self)
		self.player:setAlliId(10000)
		self.hdr:_setParams(self.player, CHAT_TARGET.ALLIANCE, 'msg')
		self.mm:mock(app:getPlayerMgr(), 'collectOnlinePlayersBy', {'players'})
		assertEQ ( self.hdr:_collectPlayers(), 'players' )
		assertEQ ( self.mm.params['collectOnlinePlayersBy'], {AlliancePlayerSpec(self.player:getAlliId())} )
	end;
})

local TestCaseChatSendWorldHdr = TestCase:extends({
	setUp = function(self)
		TestCaseHelper:createPlayer(self)
		self.hdr = ChatSendWorldHdr()
	end;
	
	tearDown = function(self)
		TestCaseHelper:clearAll(self)
	end;
	
	test__createExpends = function(self)
		self.mm:mock(WUtil, 'createExpendObjs', {'objs'})
		self.hdr:_setParams(self.player, CHAT_TARGET.WORLD, 'msg')
		assertEQ ( self.hdr:_createExpends(), 'objs' )
		assertEQ ( self.mm.params['createExpendObjs'], {self.player, 'nil', {{resid=FIXID.BIGSPEAKER, type=EXPEND_TYPE.ITEM,val=1}} } )
	end;
	
	test__sendChatMsg = function(self)
		self.mm:mock(app:getWorldMsgQueue(), 'appendMsg')
		self.hdr.player = self.player
		self.hdr.msg = 'msg'
		self.hdr:_sendChatMsg()
		assertEQ ( self.mm.params['appendMsg'], {self.player:getRoleId(), self.player:getRoleName(), 'msg'} )
	end;
})

tqChatHandler_t_main = function(suite)
	suite:addTestCase(TestCaseChatHandler, 'TestCaseChatHandler')
	suite:addTestCase(TestCaseChatSendMsgHdr, 'TestCaseChatSendMsgHdr')
	suite:addTestCase(TestCaseChatSendBaseHdr, 'TestCaseChatSendBaseHdr')
	suite:addTestCase(TestCaseChatSendPlayerHdr, 'TestCaseChatSendPlayerHdr')
	suite:addTestCase(TestCaseChatSendStateHdr, 'TestCaseChatSendStateHdr')
	suite:addTestCase(TestCaseChatSendAllianceHdr, 'TestCaseChatSendAllianceHdr')
	suite:addTestCase(TestCaseChatSendWorldHdr, 'TestCaseChatSendWorldHdr')
end;

