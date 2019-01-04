-------------------------------------------------
--所有角色数据的处理
-------------------------------------------------
RoleData = Class:extends({
	-- 下发用户的所有信息
	--@param player 用户对象
	SendAllData = function(self, player)
		self:SendRoleInfos(player)
		self:SendCityLists(player)
		
		--数据拉去完成，发送登录完成
		local sendmsg = 'L{cmd='..NETCMD.LOGIN..',result=2}'
		player:sendMsg(sendmsg)
	end;
	
	-- 下发用户的角色信息
	--@param player 用户对象
	SendRoleInfos = function(self, player)
		print('SendRoleInfos1')
		local roleVar = player:GetRoleVar()
		local dbvar = roleVar.stDBVar
		local binfos = dbvar.stBInfos
		local sendmsg = 'L{cmd='..NETCMD.ROLEBASE..', rname="'..dbvar.szRName..'", design="'..dbvar.stFixVar.szFlagName..'",'
		sendmsg = sendmsg..'prestige='..binfos.ulPrestige..', icon=1, sorter=32041, opos=2, jpos=10, alliance={uid=1,name="无敌风火"}, apos=3, state=2, xiujianum=10, }'
		player:sendMsg(sendmsg)
	end;
	
	-- 下发用户的城市列表
	--@param player 用户对象
	SendCityLists = function(self, player)
		print('SendCityLists2')
		local roleVar = player:GetRoleVar()
		local dbvar = roleVar.stDBVar
		local oneCity = dbvar.stCitys.astCitys[0]
		
		-- 下发城市列表
		local city = SPub:GetCityByMapId(oneCity.ullId)
		local sendmsg = 'L{cmd='..NETCMD.CITYRES..', curcity=7, citys={"'..city.szName..'市列表90","市列表31","市列表2","市列表3","市列表4","市列表5","市列表6","市列表7","市列表8","市列表9"},'
		sendmsg = sendmsg..'poss = {{234,432},{234,432},{234,432},{234,432},{234,432},{234,432},{234,432},{234,432},{234,432},{234,432}},ids={1,2,3,4,5,6,7,8,9,10}}'
		player:sendMsg(sendmsg)
		
		-- 下发收藏列表
		sendmsg = 'L{cmd='..NETCMD.CITYRES..', favorites={{id=0,name="xxx1",pos={230,230},},'
		sendmsg = sendmsg..'{id=1,name="ddd2",pos={230,230},},'
		sendmsg = sendmsg..'{id=2,name="ttt3",pos={230,230},},'
		sendmsg = sendmsg..'{id=3,name="rrr4",pos={230,230},},'
		sendmsg = sendmsg..'{id=4,name="sss5",pos={230,230},},'
		sendmsg = sendmsg..'{id=5,name="ddd6",pos={230,230},},'
		sendmsg = sendmsg..'{id=6,name="ccc7",pos={230,230},},'
		sendmsg = sendmsg..'{id=7,name="eee8",pos={230,230},},'
		sendmsg = sendmsg..'{id=8,name="bbb9",pos={230,230},},'
		sendmsg = sendmsg..'{id=9,name="ccc10",pos={230,230},},'
		sendmsg = sendmsg..'}}'
		player:sendMsg(sendmsg)
		
		-- 下发野地列表
		sendmsg = 'L{cmd='..NETCMD.CITYRES..', fields={{id=0, flag=1, pos={230, 230}, level=2, state=0},'
		sendmsg = sendmsg..'{id=1, flag=1, pos={230, 230}, level=2, state=0},'
		sendmsg = sendmsg..'{id=2, flag=2, pos={230, 230}, level=2, state=0},'
		sendmsg = sendmsg..'{id=3, flag=3, pos={230, 230}, level=2, state=0},'
		sendmsg = sendmsg..'{id=4, flag=4, pos={230, 230}, level=2, state=0},'
		sendmsg = sendmsg..'{id=5, flag=5, pos={230, 230}, level=2, state=0},'
		sendmsg = sendmsg..'{id=6, flag=6, pos={230, 230}, level=2, state=0},'
		sendmsg = sendmsg..'{id=7, flag=0, pos={230, 230}, level=2, state=0},'
		sendmsg = sendmsg..'{id=8, flag=1, pos={230, 230}, level=2, state=0},'
		sendmsg = sendmsg..'{id=9, flag=2, pos={230, 230}, level=2, state=0},'
		sendmsg = sendmsg..'{id=10, flag=3, pos={230, 230}, level=2, state=0},'
		sendmsg = sendmsg..'{id=11, flag=4, pos={230, 230}, level=2, state=0},'
		sendmsg = sendmsg..'{id=12, flag=5, pos={230, 230}, level=2, state=0},'
		sendmsg = sendmsg..'{id=13, flag=6, pos={230, 230}, level=2, state=0},'
		sendmsg = sendmsg..'} }'
		player:sendMsg(sendmsg)
		
		-- 在内城建造中的每个兵营都可以自己的招募队列，其中car_total表示整个可用队列，包括在建的
		-- 兵营一
		curtime = Util:getTime() + 356000
		sendmsg = 'L{cmd='..NETCMD.BUILDRES..', cgridpos=5, car_total=5, car_full=true, car_builds={'
		sendmsg = sendmsg..'{id=150002, gridpos=1, level=0, number=120, flag=1, stoptime='..curtime..', },'
		sendmsg = sendmsg..'{id=150004, gridpos=2, level=0, number=200, flag=0, time=3000},'
		sendmsg = sendmsg..'{id=150006, gridpos=3, level=0, number=100, flag=0, time=3000},'
		sendmsg = sendmsg..'{id=150008, gridpos=4, level=0, number=200, flag=0, time=3000},'
		sendmsg = sendmsg..'{id=150010, gridpos=5, level=0, number=100, flag=0, time=3000},'
		sendmsg = sendmsg..'},}'
		player:sendMsg(sendmsg)
		-- 兵营二
		curtime = Util:getTime() + 6000
		sendmsg = 'L{cmd='..NETCMD.BUILDRES..', cgridpos=4, car_total=16, car_full=true, car_builds={'
		sendmsg = sendmsg..'{id=150001, gridpos=1, level=0, number=320, flag=1, stoptime='..curtime..', },'
		sendmsg = sendmsg..'{id=150002, gridpos=2, level=0, number=200, flag=0, time=3000},'
		sendmsg = sendmsg..'{id=150003, gridpos=3, level=0, number=100, flag=0, time=3000},'
		sendmsg = sendmsg..'{id=150004, gridpos=4, level=0, number=200, flag=0, time=3000},'
		sendmsg = sendmsg..'{id=150005, gridpos=5, level=0, number=100, flag=0, time=3000},'
		sendmsg = sendmsg..'},}'
		player:sendMsg(sendmsg)
		
		
		--科技技能
		curtime = Util:getTime() + 2000
		sendmsg = 'L{cmd='..NETCMD.BUILDRES..', te_full=true, te_builds={'
		sendmsg = sendmsg..'{id=120001, gridpos=1, level=1, flag=1, stoptime='..curtime..', },'
		sendmsg = sendmsg..'{id=120002, gridpos=2, level=2, },'
		sendmsg = sendmsg..'{id=120003, gridpos=3, level=0, },'
		sendmsg = sendmsg..'{id=120004, gridpos=4, level=1, },'
		sendmsg = sendmsg..'{id=120005, gridpos=5, level=1, },'
		sendmsg = sendmsg..'{id=120006, gridpos=6, level=1, },'
		sendmsg = sendmsg..'{id=120007, gridpos=7, level=1, },'
		sendmsg = sendmsg..'{id=120008, gridpos=8, level=1, },'
		sendmsg = sendmsg..'{id=120009, gridpos=9, level=1, },'
		sendmsg = sendmsg..'{id=120010, gridpos=10, level=1, },'
		sendmsg = sendmsg..'{id=120011, gridpos=11, level=1, },'
		sendmsg = sendmsg..'{id=120012, gridpos=12, level=1, },'
		sendmsg = sendmsg..'{id=120013, gridpos=13, level=1, },'
		sendmsg = sendmsg..'{id=120014, gridpos=14, level=1, },'
		sendmsg = sendmsg..'{id=120015, gridpos=15, level=1, },'
		sendmsg = sendmsg..'{id=120016, gridpos=16, level=1, },'
		sendmsg = sendmsg..'{id=120017, gridpos=17, level=1, },'
		sendmsg = sendmsg..'{id=120018, gridpos=18, level=1, },'
		sendmsg = sendmsg..'{id=120019, gridpos=19, level=1, },'
		sendmsg = sendmsg..'{id=120020, gridpos=20, level=1, },'
		sendmsg = sendmsg..'}, }'
		player:sendMsg(sendmsg)
		
		--主面板军队(右边供选择的面板，是固定不变的，只通知一次)
		sendmsg = 'L{cmd='..NETCMD.BUILDRES..', ar_full=true, ar_builds={'
		sendmsg = sendmsg..'{id=150001, gridpos=1, level=0, },'
		sendmsg = sendmsg..'{id=150002, gridpos=2, level=0, },'
		sendmsg = sendmsg..'{id=150003, gridpos=3, level=0, },'
		sendmsg = sendmsg..'{id=150004, gridpos=4, level=0, },'
		sendmsg = sendmsg..'{id=150005, gridpos=5, level=0, },'
		sendmsg = sendmsg..'{id=150006, gridpos=6, level=0, },'
		sendmsg = sendmsg..'{id=150007, gridpos=7, level=0, },'
		sendmsg = sendmsg..'{id=150008, gridpos=8, level=0, },'
		sendmsg = sendmsg..'{id=150009, gridpos=9, level=0, },'
		sendmsg = sendmsg..'{id=150010, gridpos=10, level=0, },'
		sendmsg = sendmsg..'{id=150011, gridpos=11, level=0, },'
		sendmsg = sendmsg..'{id=150012, gridpos=12, level=0, },'
		sendmsg = sendmsg..'}, }'
		player:sendMsg(sendmsg)
		
		--主面板城防(右边供选择的面板，是固定不变的，只通知一次)
		sendmsg = 'L{cmd='..NETCMD.BUILDRES..', cd_full=true, cd_builds={'
		sendmsg = sendmsg..'{id=160001, gridpos=1, level=0, },'
		sendmsg = sendmsg..'{id=160002, gridpos=2, level=0, },'
		sendmsg = sendmsg..'{id=160003, gridpos=3, level=0, },'
		sendmsg = sendmsg..'{id=160004, gridpos=4, level=0, },'
		sendmsg = sendmsg..'{id=160005, gridpos=5, level=0, },'
		sendmsg = sendmsg..'}, }'
		player:sendMsg(sendmsg)
	end;
	
	-- 下发用户的当前城市资源信息
	--@param player 用户对象
	SendResInfos = function(self, player)
	end;
	
	-- 下发用户的当前城市建筑信息
	--@param player 用户对象
	SendBuilds = function(self, player)
	end;
	
	-- 下发用户的当前城市在建队列信息
	--@param player 用户对象
	SendQueues = function(self, player)
	end;
	
	-- 下发用户背包中道具列表
	--@param player 用户对象
	SendItems = function(self, player)
	end;
	
	-- 下发用户任务列表
	--@param player 用户对象
	SendTasks = function(self, player)
	end;
	
	-- 下发用户Buff列表
	--@param player 用户对象
	SendBuffs = function(self, player)
	end;
})

--初始化为单件
InitObj(RoleData)

