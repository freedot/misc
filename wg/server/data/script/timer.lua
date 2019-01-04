require('tqClass')

TIMER_DRT_TIME = 1 -- 误差时间为1秒

Caller = Class:extends({
	init = function(self, objId, obj, fun)
		self._s = {objId = objId, obj = obj, fun = fun}
	end;
	
	getId = function(self)
		return self._s.objId
	end;
	
	setId = function(self, id)
		self._s.objId = id
	end;
	
	invoke = function(self, timer, ... )
		self._s.fun(self._s.obj, timer, ... )
	end;
})

_use_luajit_ = false
local ffi = nil
if _use_luajit_ then
ffi = require("ffi")
ffi.cdef[[
typedef struct TimerNode{ 
	uint32_t elapse;
	uint32_t startTime;
	int32_t drtTime;
	int64_t objectId;
	int64_t params[6];  // 有效位置为1-5，0位置序列号
}TimerNode;

typedef struct Node{ 
	int pos; 
	struct Node * prev; 
	struct Node * next;
	TimerNode timerNode;
} Node;
]]
end

FreeMgr = Class:extends({
	init = function(self, blockSize)
		self._blockSize = blockSize or 4096
		self._frees = {}
		self._curPos = -1
		self._maxSize = 0
	end;
	
	top = function(self)
		if self._curPos == -1 then
			return -1
		end
		
		local blockIdx, arrIdx = self:_getBlockPos(self._curPos)
		return self._frees[blockIdx][arrIdx]
	end;
	
	pop = function(self)
		local id = self:top()
		if self._curPos >= 0 then
			self._curPos = self._curPos - 1
		end
		return id
	end;
	
	push = function(self, id)
		self._curPos = self._curPos + 1
		if self._curPos == self._maxSize then
			if _use_luajit_ then
				self:_allocOneBlockForJit()
			else
				self:_allocOneBlock()
			end
			self._maxSize = self._maxSize + self._blockSize
		end
		local blockIdx, arrIdx = self:_getBlockPos(self._curPos)
		self._frees[blockIdx][arrIdx] = id
	end;
	
	_allocOneBlockForJit = function(self)
		table.insert(self._frees, ffi:new("int[?]", self._blockSize))
	end;
	
	_allocOneBlock = function(self)
		local block = {}
		for i=0, self._blockSize-1 do
			block[i] = 0
		end
		table.insert(self._frees, block)
	end;
	
	_getBlockPos = function(self, pos)
		local blockIdx = math.floor(pos/self._blockSize) + 1 -- from 1 to n
		local arrIdx = pos%self._blockSize
		return blockIdx, arrIdx
	end;
})

NodeMgr = Class:extends({
	init = function(self, structName, blockSize)
		self._structName = structName
		self._blockSize = blockSize or 4096
		self._freeMgr = FreeMgr:new()
		self._nodes = {}
	end;
	
	alloc = function(self)
		local pos = self._freeMgr:pop()
		if pos < 0 then
			local nodes = nil
			if _use_luajit_ then
				nodes = self:_allocOneBlockForJit()
			else
				nodes = self:_allocOneBlock()
			end
			local fromIdx = #self._nodes*self._blockSize
			local toIdx = fromIdx + self._blockSize - 1
			for i=toIdx, fromIdx, -1 do
				nodes[i-fromIdx].pos = i
				self._freeMgr:push(i)
			end
			table.insert(self._nodes, nodes)
			pos = self._freeMgr:pop()
		end
		
		local blockIdx, arrIdx = self:_getBlockPos(pos)
		return self._nodes[blockIdx][arrIdx]
	end;
	
	free = function(self, node)
		self:pick(node)
		self._freeMgr:push(node.pos)
	end;
	
	insertAfter = function(self, preNode, nextNode)
		if preNode.next ~= nil then
			nextNode.next = preNode.next
			nextNode.next.prev = nextNode
		end
		preNode.next = nextNode
		nextNode.prev = preNode
	end;
	
	pick = function(self, node)
		if node.prev ~= nil then
			node.prev.next = node.next
		end
		
		if node.next ~= nil then
			node.next.prev = node.prev
		end
		
		node.prev = nil
		node.next = nil
	end;
	
	_allocOneBlockForJit = function(self)
		return ffi:new( self._structName .. "[?]", self._blockSize)
	end;
	
	_allocOneBlock = function(self)
		local nodes = {}
		for i=0, self._blockSize-1 do
			local node = {pos=0, prev=nil, next=nil, timerNode={elapse=0,startTime=0,drtTime=0,objectId=0,params={0,0,0,0,0}}}
			node.timerNode.params[0] = 0
			nodes[i] = node
		end
		return nodes
	end;
	
	_getBlockPos = function(self, pos)
		local blockIdx = math.floor(pos/self._blockSize) + 1 -- from 0 to n  1
		local arrIdx = pos%self._blockSize
		return blockIdx, arrIdx
	end;	
})

BucketMgr = Class:extends({
	init = function(self, precision, nodeMgr)
		self._curPos = -1
		self._totalS = 1800
		self._precision = precision
		self._nodeMgr = nodeMgr
		self._buckets = {}
		self:_initBuckets()
	end;
	
	initPos = function(self, time)
		self._curPos = self:_getBucketIdx(time - self._precision)
	end;
	
	getCurNode = function(self)
		return self._buckets[self._curPos]
	end;
	
	moveNext = function(self)
		self._curPos = self:_wrapBucketIdx(self._curPos + 1)
	end;
	
	getSkipDistance = function(self, time)
		local toPos = self:_getBucketIdx(time)
		return (toPos - self._curPos + self:getSize())%self:getSize()
	end;
	
	getSize = function(self)
		return self._totalS*1000/self._precision
	end;
	
	getBucket = function(self, time)
		return self._buckets[self:_getBucketIdx(time)]
	end;
	
	_getBucketIdx = function(self, time)
		local idx = math.floor(time/self._precision)
		local bucketIdx = self:_wrapBucketIdx(idx + 1)
		return bucketIdx
	end;
	
	_wrapBucketIdx = function(self, rawBucketIdx) -- from 1 to n
		return (rawBucketIdx-1)%self:getSize() + 1
	end;
	
	_initBuckets = function(self)
		local size = self:getSize()
		for i=1, size do
			table.insert( self._buckets, self._nodeMgr:alloc() )
		end
	end;
})

Timer = Class:extends({
	init = function(self, precision)
		self._stopTimerFlag = false
		self._callers = {}
		self._curTime = 0
		self._seq = 1
		self._precision = precision
		self._nodeMgr = NodeMgr:new('Node')
		self._bucketMgr = BucketMgr:new(self._precision, self._nodeMgr)
		self._bucketMgr:initPos(os.clockMs())
	end;
	
	start = function(self, elapse, params, caller)
		if elapse < self._precision then
			elapse = self._precision
		end
		
		local curTime = os.clockMs()

		local node = self._nodeMgr:alloc()
		node.timerNode.elapse = elapse
		node.timerNode.startTime = curTime
		local stopTime = curTime + elapse
		local fmtStopTime = math.floor(stopTime/self._precision + 0.5)*self._precision
		node.timerNode.drtTime = stopTime - fmtStopTime
		
		node.timerNode.objectId = caller:getId()
		self._callers[tonumber(caller:getId())] = caller
		local paramNum = math.min(#params, 5)
		for i=1, paramNum do
			node.timerNode.params[i] = params[i]
		end
		
		local seq = self._seq
		self._seq = self._seq + 1
		node.timerNode.params[0] = seq
		
		local bucketNode = self._bucketMgr:getBucket(fmtStopTime)
		self._nodeMgr:insertAfter(bucketNode, node)
		return seq
	end;
	
	stop = function(self)
		self._stopTimerFlag = true
	end;	
	
	isStoped = function(self)
		return self._stopTimerFlag
	end;
	
	update = function(self)
		self._stopTimerFlag = false
		self._curTime = os.clockMs()
		local skipCount = self._bucketMgr:getSkipDistance(self._curTime)
		local startTime = self._curTime - skipCount*self._precision
		for i=1, skipCount do
			self._bucketMgr:moveNext()
			local bucketNode = self._bucketMgr:getCurNode()
			local curTime = startTime + i*self._precision
			self:_handleNodeList(curTime, bucketNode)
		end
	end;
	
	clearCaller = function(self, callerId)
		self._callers[callerId] = nil
	end;
	
	_handleNodeList = function(self, curTime, bucketNode)
		local curNode = bucketNode.next
		local nextNode = nil
		while curNode ~= nil do
			nextNode = curNode.next
			self:_handleNode(curTime, curNode)
			curNode = nextNode
		end
	end;
	
	_handleNode = function(self, curTime, node)
		local elapse = curTime - node.timerNode.startTime + node.timerNode.drtTime
		if elapse < node.timerNode.elapse then
			return
		end
		
		self._stopTimerFlag = false
		local caller = self._callers[ tonumber(node.timerNode.objectId) ]
		if caller == nil then
			self._nodeMgr:free(node)
			return
		end
		
		caller:invoke(self, node.timerNode.params[0], curTime, node.timerNode.params)
		if not self._stopTimerFlag then
			self:_reattachNodeToNextFitBucketNode(curTime, node)
		else
			self._nodeMgr:free(node)
		end
	end;

	_reattachNodeToNextFitBucketNode = function(self, curTime, node)
		node.timerNode.startTime = node.timerNode.startTime + node.timerNode.elapse
		local stopTime = node.timerNode.startTime + node.timerNode.elapse
		local fmtStopTime = math.floor(stopTime/self._precision + 0.5)*self._precision
		node.timerNode.drtTime = stopTime - fmtStopTime
		self._nodeMgr:pick(node)
		
		local bucketNode = self._bucketMgr:getBucket(fmtStopTime)
		self._nodeMgr:insertAfter(bucketNode, node)
	end;
})


