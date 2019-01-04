-- default  or
creator = 10
creator2 = creator 
if a==10 or b==10 then end

if a==10 or
   b==10 then end
   
if a==10 or
orgin ==10 then end

if a==10 or creator
==10 then end

if a==10 or 
   b==10 then end
   
if a==10 
   or b==10 then end
   
if (a == 10)or(b==10) then end


--and  -> &&
if a==10 and b==10 then end

if a==10 and
   b==10 then end
   
if a==10 and
arand ==10 then end

if a==10 and arand
==10 then end

if a==10 and 
   b==10 then end
   
if a==10 
   and b==10 then end
   
if (a == 10)and(b==10) then end

-- ~=  ->   !=
if a~=10 then end

-- nil -> null
a = nil
a=nil
a=
nil
a==nil
a==
nil
init(nil)
(a==nil)and(c==10)
a==nilll
 nill==a
cc = aanil

-- self -> this
init(self)
self.a = 0
c=self
c = self
aself = 1


-- test for i=1, 10, 1 do
for i=10, 1, -1 do
end

for i=10, -1, -1 do 
end

for i=-10, -1, -1 do 
end

for i=1, 10, 3 do 
end

for i1=s, #a, -1 do 
end

for i1=s.c, #a.c, -1 do
end

for i1=s.c, a.c, 2 do
end

for i1=#s.c, #a.c, 3 do
end

for i1=s.c, #a.c, step.s do
end

for i=1, 20 do
end

for i1=s, #a do
end

for i1=s.a, a.a do
end

for i1=#s.a, #a.a do
end

-- test for a in ipairs() do
for i in ipairs(x1.b) do
end

-- test for a,_ in ipairs() do
for i, _ in ipairs(x1.b) do
end

-- test for _,b in ipairs() do
for _, b in ipairs(x1.b) do
end

-- test for a, b in ipairs() do
for a, b in ipairs(x1.b) do
end

-- test for a in pairs() do
for a in pairs(x1.b) do
end

-- test for a,_ in pairs() do
for a, _ in pairs(x1.b) do
end

-- test for _,b in pairs() do
for _, b in pairs(x1.b) do
end

-- test for a, b in pairs() do
for a, b in pairs(x1.b) do
end

--test while xxx do
while xxx<10 or ccc > 10 do
end

--test while xxx 
	--do
while xxx<10 
	or ccc > 10 do
end

-- test ... params
-- test [[]] string or comment , 手工处理
-- test -- comment
-- test string.xxxx  以及string对象的 xxx.xxxx   -》 lua_string.xxx
-- test table.xxx  -> lua_table.xxx

--- 独立的 function
--- enum
--- 对   :    #   等特殊符号的处理


-- 对init中初始化的成员变量处理
-- 对new一个新对象的处理
-- 

-- test class
QuestionAct = Class.extern({
})
local QuestionAct = Class.extern({
})
QuestionAct = OtherClass.extern({
})
local QuestionAct = OtherClass.extern({
})
QuestionAct = OtherClass.extern({
	setTimePeriod = function(self, period)
		self._period = period
	end;
	setTimePeriod2 = function(self, period, p2)
		self._period = period
	end
	setTimePeriod0 = function(self)
	end
})


-- test if --

if hdr == nil then
	return self.nullHandler
end
	
if hdr ~= nil then return 0 end



if hdr == nil then a = a .. 'abc'
	return self.nullHandler
end


if hdr == nil and 
	a ~= nil then end
	

if 
	a ~= nil then end
	
	
if hdr == nil and 
	a ~= nil then 
end


if 
	hdr == nil and 
	a ~= nil then 
end
	

-- test elseif --

elseif hdr == nil then
	return self.nullHandler
end


elseif hdr == '' then return 0 end


elseif hdr == '' then a = a .. 'abc'
	return 0
end


elseif hdr == nil and 
	a ~= nil then end
	
	
elseif 
	a ~= nil then end
	

	
elseif hdr == nil and 
	a ~= nil then 
end


elseif 
	hdr == nil and 
	a ~= nil then 
end


-- test else --

else  a = a .. 'abc' end


else  a = a .. 'abc' 
end


else  
	a = a .. 'abc' 
end	


-- test if_then_else_end
if a == 1 then  a =2 else a == 5 end

