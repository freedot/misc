require('timer')

local TestCaseTimerEx = TestCase:extends({
	test_forFreeMgr = function()
		local freeMgr = FreeMgr:new(3)
		assert ( freeMgr:top() == -1 )
		assert ( freeMgr:pop() == -1 )
		freeMgr:push(1)
		assert ( freeMgr:top() == 1 )
		assert ( freeMgr:top() == 1 )
		assert ( freeMgr:pop() == 1 )
		assert ( freeMgr:pop() == -1 )
		freeMgr:push(1)
		freeMgr:push(2)
		freeMgr:push(3)
		freeMgr:push(4)
		freeMgr:push(5)
		assert ( freeMgr:pop() == 5 )
		assert ( freeMgr:pop() == 4 )
		assert ( freeMgr:pop() == 3 )
		assert ( freeMgr:pop() == 2 )
		assert ( freeMgr:pop() == 1 )
		assert ( freeMgr:pop() == -1 )
		assert ( freeMgr:pop() == -1 )

		local freeMgr = FreeMgr:new()
		freeMgr:push(1)
		assert ( freeMgr:pop() == 1 )
	end;

	test_forNodeMgr = function()
		local nodeMgr = NodeMgr:new('Node', 3)
		local node1 = nodeMgr:alloc()
		local node2 = nodeMgr:alloc()
		local node3 = nodeMgr:alloc()
		local node4 = nodeMgr:alloc()
		local node5 = nodeMgr:alloc()
		local node6 = nodeMgr:alloc()
		assert ( node1.pos == 0 )
		assert ( node2.pos == 1 )
		assert ( node3.pos == 2 )
		assert ( node4.pos == 3 ) 
		assert ( node5.pos == 4 )
		assert ( node6.pos == 5 )
		nodeMgr:free(node4)
		nodeMgr:free(node5)
		nodeMgr:free(node6)
		local node7 = nodeMgr:alloc()
		local node8 = nodeMgr:alloc()
		local node9 = nodeMgr:alloc()
		assert ( node7.pos == node6.pos )
		assert ( node8.pos == node5.pos )
		assert ( node9.pos == node4.pos )
		assert ( node9.prev == nil )

		nodeMgr:insertAfter(node8, node9)
		assert ( node9.prev.pos == node8.pos )
		assert ( node8.next.pos == node9.pos )

		nodeMgr:insertAfter(node8, node7)
		assert ( node7.prev.pos == node8.pos )
		assert ( node8.next.pos == node7.pos )
		assert ( node7.next.pos == node9.pos )
		assert ( node9.prev.pos == node7.pos )

		nodeMgr:pick(node7)
		assert ( node7.prev == nil )
		assert ( node7.next == nil )
		assert ( node9.prev.pos == node8.pos )
		assert ( node8.next.pos == node9.pos )

		nodeMgr:insertAfter(node8, node7)
		nodeMgr:pick(node9)
		assert ( node7.next == nil )

		nodeMgr:insertAfter(node7, node9)
		nodeMgr:pick(node8)
		assert ( node7.prev == nil )

		nodeMgr:insertAfter(node7, node8)  -- node7 -> node8 -> node9
		nodeMgr:free(node8)
		assert ( node8.prev == nil )
		assert ( node8.next == nil )
		assert ( node7.next.pos == node9.pos )
		assert ( node9.prev.pos == node7.pos )

		nodeMgr = NodeMgr:new('Node')
		node1 = nodeMgr:alloc()
		assert ( node1.pos == 0 )
	end;

	test_forBucketMgr = function()
		local nodeMgr = NodeMgr:new('Node')
		local bucketMgr = BucketMgr:new(100, nodeMgr)
		assert ( bucketMgr:getSize() == 1800*1000/100 )
		assert ( bucketMgr:getBucket(0) ~= nil )
		assert ( bucketMgr:getBucket(99).pos == bucketMgr:getBucket(0).pos )
		assert ( bucketMgr:getBucket(100) ~= nil )
		assert ( bucketMgr:getBucket(199).pos == bucketMgr:getBucket(100).pos )
		assert ( bucketMgr:getBucket(0).pos ~= bucketMgr:getBucket(100).pos )
		assert ( bucketMgr:getBucket(0).pos == bucketMgr:getBucket(18000*100).pos )
		assert ( bucketMgr:getBucket(0).pos == bucketMgr:getBucket(18000*100+99).pos )
		
		bucketMgr:initPos(99)
		assert ( bucketMgr:getCurNode().pos == 18000-1 )
		bucketMgr:initPos(100)
		assert ( bucketMgr:getCurNode().pos == 0 )
		bucketMgr:initPos(199)
		assert ( bucketMgr:getCurNode().pos == 0 )
		bucketMgr:initPos(18000*100)
		assert ( bucketMgr:getCurNode().pos == 17999 )
		
		bucketMgr:moveNext()
		assert ( bucketMgr:getCurNode().pos == 0 )
		bucketMgr:initPos(99)
		assert ( bucketMgr:getCurNode().pos == 18000-1 )
		bucketMgr:moveNext()
		assert ( bucketMgr:getCurNode().pos == 0 )
		
		bucketMgr:initPos(200)
		assert ( bucketMgr:getCurNode().pos == 1 )
		assert ( bucketMgr:getSkipDistance(299) == 1 )
		assert ( bucketMgr:getSkipDistance(399) == 2 )
		assert ( bucketMgr:getSkipDistance(499) == 3 )
		assert ( bucketMgr:getSkipDistance(18000*100) == 17999 )
	end;
	
	helper_createTimer = function(self, elapse)
		self._isStop = false
		local OnTimerStub = Class:extends({
			init = function(self)
				self._params = nil
				self._count = 0
				self._seq = 0
			end;
			
			onTimer = function(self, timer, seq, curTime, params)
				self._seq = seq
				self._params = params
				self._count = self._count + 1
				if isStop then
					timer:stop()
				end
			end;
			
			getParams = function(self)
				return self._params
			end;
			
			getCount = function(self)
				return self._count
			end;
			
			getSeq = function(self)
				return self._seq
			end;
		})
		
		os.setClockMs(0)
		self._timer = Timer:new(100) -- 精度100MS
		
		self._objId = 0
		self._eventId = 1
		self._elapse = elapse
		self._params = {10, 11}
		self._timerSub = OnTimerStub:new()
		self._caller = Caller:new(1, self._timerSub, self._timerSub.onTimer)
	end;
	
	_test_forTimer_Ex = function(self)
		self:helper_createTimer(99)
		assert ( self._timer:start(self._elapse, self._params, self._caller) == 1, '如果elapse小于精度，则按精度值计算' )
		self._isStop = true
		os.setClockMs(100)
		self._timer:update()
		self._isStop = false
		assert ( self._timerSub:getCount() == 1 )
		assert ( self._timerSub:getSeq() == 1 )
		assert ( self._timerSub:getParams()[1] == 10 )
		assert ( self._timerSub:getParams()[2] == 11 )
		
		os.setClockMs(199)
		self._elapse = 1099
		assert ( self._timer:start(self._elapse, self._params, self._caller) == 2 )
		self._timer:update()
		assert ( self._timerSub:getCount() == 1 )  
		
		os.setClockMs(1298)
		self._timer:update()
		assert ( self._timerSub:getCount() == 1 )  
		
		os.setClockMs(1300)
		self._timer:update()
		assert ( self._timerSub:getCount() == 2 )
		assert ( self._timerSub:getSeq() == 2 )	
		assert ( self._timerSub:getParams()[1] == 10 )
		assert ( self._timerSub:getParams()[2] == 11 )
		
		os.setClockMs(1319)
		self._timer:update()
		assert ( self._timerSub:getCount() == 2, '改节点已经处理过了' )
		
		self._elapse = 230
		assert ( self._timer:start(self._elapse, self._params, self._caller) == 3 )
		os.setClockMs(1500)
		self._timer:update()
		assert ( self._timerSub:getSeq() == 3 )	
		assert ( self._timerSub:getCount() == 3, '' )
		
		os.setClockMs(1700)
		self._timer:update()
		assert ( self._timerSub:getCount() == 3, 'reattach, 下次精度补全的的问题' )
		
		os.setClockMs(1800)
		self._timer:update()
		assert ( tself._imerSub:getCount() == 4, 'reattach, 下次精度补全的的问题' )
		
		os.setClockMs(2360)
		self._timer:update()
		assert ( self._timerSub:getCount() == 6, '把跳过的节点也要执行 ' )  
		
		os.setClockMs(2500)
		self._isStop = true
		self._timer:update()
		assert ( self._timer:isStoped() == true )
		assert ( self._timerSub:getCount() == 8, '两个时钟同时执行, 同时将它们都停止')
		
		os.setClockMs(2300 + 1800*1000)
		self._timer:update()
		assert ( self._timer:isStoped() == false )
		os.setClockMs(2800 + 1800*1000)
		self._timer:update()
		assert ( self._timer:isStoped() == false )
		assert ( self._timerSub:getCount() == 8, 'stop')
		
		isStop = false
		assert ( self._timer:start(self._elapse, self._params, self._caller) == 4 )
		self._timer:clearCaller(self._caller:getId())
		os.setClockMs(3800 + 1800*1000)
		self._timer:update()
		assert ( self._timerSub:getCount() == 8, 'clear caller by callerid ')
	end;	
	
	test_forTimer = function()
		local isStop = false
		local OnTimerStub = Class:extends({
			init = function(self)
				self._params = nil
				self._count = 0
				self._seq = 0
			end;
			
			onTimer = function(self, timer, seq, curTime, params)
				self._seq = seq
				self._params = params
				self._count = self._count + 1
				if isStop then
					timer:stop()
				end
			end;
			
			getParams = function(self)
				return self._params
			end;
			
			getCount = function(self)
				return self._count
			end;
			
			getSeq = function(self)
				return self._seq
			end;
		})
		
		os.setClockMs(0)
		local timer = Timer:new(100) -- 精度100MS
		
		local objId = 0
		local eventId = 1
		local elapse = 99
		local params = {10, 11}
		local timerSub = OnTimerStub:new()
		local caller = Caller:new(1, timerSub, timerSub.onTimer)
		
		assert ( timer:start(elapse, params, caller) == 1, '如果elapse小于精度，则按精度值计算' )
		isStop = true
		os.setClockMs(100)
		timer:update()
		isStop = false
		assert ( timerSub:getCount() == 1 )
		assert ( timerSub:getSeq() == 1 )
		assert ( timerSub:getParams()[1] == 10 )
		assert ( timerSub:getParams()[2] == 11 )
		
		os.setClockMs(199)
		elapse = 1099
		assert ( timer:start(elapse, params, caller) == 2 )
		timer:update()
		assert ( timerSub:getCount() == 1 )  
		
		os.setClockMs(1298)
		timer:update()
		assert ( timerSub:getCount() == 1 )  
		
		os.setClockMs(1300)
		timer:update()
		assert ( timerSub:getCount() == 2 )
		assert ( timerSub:getSeq() == 2 )	
		assert ( timerSub:getParams()[1] == 10 )
		assert ( timerSub:getParams()[2] == 11 )
		
		os.setClockMs(1319)
		timer:update()
		assert ( timerSub:getCount() == 2, '改节点已经处理过了' )
		
		elapse = 230
		assert ( timer:start(elapse, params, caller) == 3 )
		os.setClockMs(1500)
		timer:update()
		assert ( timerSub:getSeq() == 3 )	
		assert ( timerSub:getCount() == 3, '' )
		
		os.setClockMs(1700)
		timer:update()
		assert ( timerSub:getCount() == 3, 'reattach, 下次精度补全的的问题' )
		
		os.setClockMs(1800)
		timer:update()
		assert ( timerSub:getCount() == 4, 'reattach, 下次精度补全的的问题' )
		
		os.setClockMs(2360)
		timer:update()
		assert ( timerSub:getCount() == 6, '把跳过的节点也要执行 ' )  
		
		os.setClockMs(2500)
		isStop = true
		timer:update()
		assert ( timer:isStoped() == true )
		assert ( timerSub:getCount() == 8, '两个时钟同时执行, 同时将它们都停止')
		
		os.setClockMs(2300 + 1800*1000)
		timer:update()
		assert ( timer:isStoped() == false )
		os.setClockMs(2800 + 1800*1000)
		timer:update()
		assert ( timer:isStoped() == false )
		assert ( timerSub:getCount() == 8, 'stop')
		
		isStop = false
		assert ( timer:start(elapse, params, caller) == 4 )
		timer:clearCaller(caller:getId())
		os.setClockMs(3800 + 1800*1000)
		timer:update()
		assert ( timerSub:getCount() == 8, 'clear caller by callerid ')
	end;
	
	test_tooLongElapse = function(self)
		self:helper_createTimer(1800*1000*10)
		
		self._timer:start(self._elapse, self._params, self._caller)
		
		os.setClockMs(1800*1000*10)
		self._timer:update()
		assert ( self._timerSub:getCount() == 1)
		
		os.setClockMs(1800*1000*10 + 100)
		self._timer:update()
		assert ( self._timerSub:getCount() == 1)
		
		os.setClockMs(1800*1000*10 + 200)
		self._timer:update()
		assert ( self._timerSub:getCount() == 1)
		
		os.setClockMs(1800*1000*10 + 1800*1000)
		self._timer:update()
		assert ( self._timerSub:getCount() == 1)
		
		os.setClockMs(2*1800*1000*10 - 1)
		self._timer:update()
		assert ( self._timerSub:getCount() == 1)
		
		os.setClockMs(2*1800*1000*10 )
		self._timer:update()
		assert ( self._timerSub:getCount() == 2)
	end;
})

tqTimerEx_t_main = function(suite)
	suite:addTestCase(TestCaseTimerEx, 'TestCaseTimerEx')
end;



