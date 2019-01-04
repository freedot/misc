TeamHandler = Class:extends({
	OnRequest = function(self, player, netevt, cmdtb)
		if cmdtb.subcmd == 1 then
			-- 拉取team列表
			local sendmsg = '{cmd:'..NETCMD.TEAM..',newteam:1}'
			player:sendMsg(sendmsg)
			
			local attrs = ''
			attrs = attrs..'attrs:{'
			attrs = attrs..'"'..ATTR.HP..'":{val:100,u:0}'
			attrs = attrs..',"'..ATTR.MHP..'":{val:500,u:0}'
			attrs = attrs..',"'..ATTR.MP..'":{val:100,u:0}'
			attrs = attrs..',"'..ATTR.MMP..'":{val:150,u:0}'
			attrs = attrs..',"'..ATTR.CA..'":{val:260,u:0}'
			attrs = attrs..',"'..ATTR.MCA..'":{val:300,u:0}'
			attrs = attrs..'}'--attrs end
			
			local owner = 'owner:{id:0,name:"小石头1",cityid:9900001,uid:100021,pos:{x:0,y:0}}'
			
			sendmsg = '{cmd:'..NETCMD.TEAM..',teams:['
			sendmsg = sendmsg..'{id:1001,teampos:0,state:1,name:"butiful1",resid:140001,uid:200121,level:21,cityid:9900001,pos:{x:100,y:100},'..attrs..','..owner..'}'
			sendmsg = sendmsg..',{id:1002,teampos:1,state:1,name:"butiful2",resid:140001,uid:3100122,level:22,cityid:9900001,pos:{x:100,y:100},'..attrs..','..owner..'}'
			sendmsg = sendmsg..',{id:1003,teampos:0,state:1,name:"butiful3",resid:140001,uid:3100123,level:23,cityid:9900001,pos:{x:100,y:100},'..attrs..','..owner..'}'
			sendmsg = sendmsg..',{id:1004,teampos:0,state:1,name:"butiful4",resid:140001,uid:3100124,level:24,cityid:9900001,pos:{x:100,y:100},'..attrs..','..owner..'}'
			sendmsg = sendmsg..',{id:1005,teampos:0,state:1,name:"butiful5",resid:140001,uid:3100125,level:160,cityid:9900001,pos:{x:100,y:100},'..attrs..','..owner..'}'
			sendmsg = sendmsg..']}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 2 then
			-- 建队伍
			local sendmsg = '{cmd:'..NETCMD.SYSMSG..',type:'..SMSGT.POP..',flag:0,msg:"你已成功创建xxx小队"}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 3 then
			-- 将某人踢出队伍
		elseif cmdtb.subcmd == 4 then
			-- 自己退出队伍
			--local sendmsg = '{cmd:'..NETCMD.TEAM..',delteam:1}'
			--player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 5 then
			-- 暂时离开队伍
			local sendmsg = '{cmd:'..NETCMD.TEAM..',teams:['
			sendmsg = sendmsg..'{id:1001,state:0}'
			sendmsg = sendmsg..']}'
			player:sendMsg(sendmsg)
			
			-- 测试，通知申请人列表
			local sendmsg = '{cmd:'..NETCMD.TEAM..',applys:['
			sendmsg = sendmsg..'{id:1002,teampos:0,state:1,name:"butiful2",resid:140001,uid:3100122,level:22,cityid:9900001,pos:{x:100,y:100}}'
			sendmsg = sendmsg..',{id:1003,teampos:0,state:1,name:"butiful3",resid:140001,uid:3100123,level:23,cityid:9900001,pos:{x:100,y:100}}'
			sendmsg = sendmsg..',{id:1004,teampos:0,state:1,name:"butiful4",resid:140001,uid:3100124,level:24,cityid:9900001,pos:{x:100,y:100}}'
			sendmsg = sendmsg..',{id:1005,teampos:0,state:1,name:"butiful5",resid:140001,uid:3100125,level:160,cityid:9900001,pos:{x:100,y:100}}'
			sendmsg = sendmsg..',{id:1006,teampos:0,state:1,name:"butiful5",resid:140001,uid:3100125,level:160,cityid:9900001,pos:{x:100,y:100}}'
			sendmsg = sendmsg..',{id:1007,teampos:0,state:1,name:"butiful5",resid:140001,uid:3100125,level:160,cityid:9900001,pos:{x:100,y:100}}'
			sendmsg = sendmsg..',{id:1008,teampos:0,state:1,name:"butiful5",resid:140001,uid:3100125,level:160,cityid:9900001,pos:{x:100,y:100}}'
			sendmsg = sendmsg..',{id:1009,teampos:0,state:1,name:"butiful5",resid:140001,uid:3100125,level:160,cityid:9900001,pos:{x:100,y:100}}'
			sendmsg = sendmsg..',{id:1010,teampos:0,state:1,name:"butiful5",resid:140001,uid:3100125,level:160,cityid:9900001,pos:{x:100,y:100}}'
			sendmsg = sendmsg..',{id:1011,teampos:0,state:1,name:"butiful5",resid:140001,uid:3100125,level:160,cityid:9900001,pos:{x:100,y:100}}'
			sendmsg = sendmsg..',{id:1012,teampos:0,state:1,name:"butiful5",resid:140001,uid:3100125,level:160,cityid:9900001,pos:{x:100,y:100}}'
			sendmsg = sendmsg..',{id:1013,teampos:0,state:1,name:"butiful5",resid:140001,uid:3100125,level:160,cityid:9900001,pos:{x:100,y:100}}'
			sendmsg = sendmsg..']}'
			player:sendMsg(sendmsg)
			
			-- 测试，通知有新的申请人
			local sendmsg = '{cmd:'..NETCMD.TEAM..',newapply:1}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 6 then
			-- 申请队长
			local sendmsg = '{cmd:'..NETCMD.TEAM..',applyleader:{uid:12001,name:"xxbb",level:33}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 7 then
			-- 转让队长
			local sendmsg = '{cmd:'..NETCMD.TEAM..',changeleader:{uid:12001,name:"xxbb",level:33}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 8 then
			-- 邀请某人入队 / 和 subcmd==14 对应
			local sendmsg = '{cmd:'..NETCMD.TEAM..',invite:{uid:12001,name:"xxbb",level:33,num:2}}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 9 then
			-- 我要归队
			local sendmsg = '{cmd:'..NETCMD.TEAM..',teams:['
			sendmsg = sendmsg..'{id:1001,state:1}'
			sendmsg = sendmsg..']}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 10 then
			-- 申请入队
		elseif cmdtb.subcmd == 11 then
			-- 同意申请入队 agree=1表示同意，agree=0表示拒绝，uid=-1表示所有人
			if cmdtb.agree == 0 and cmdtb.uid == -1 then
				local sendmsg = '{cmd:'..NETCMD.TEAM..',applys:['
				sendmsg = sendmsg..'{id:1002,_d:1}'
				sendmsg = sendmsg..',{id:1003,_d:1}'
				sendmsg = sendmsg..',{id:1004,_d:1}'
				sendmsg = sendmsg..',{id:1005,_d:1}'
				sendmsg = sendmsg..',{id:1006,_d:1}'
				sendmsg = sendmsg..',{id:1007,_d:1}'
				sendmsg = sendmsg..',{id:1008,_d:1}'
				sendmsg = sendmsg..',{id:1009,_d:1}'
				sendmsg = sendmsg..',{id:1010,_d:1}'
				sendmsg = sendmsg..',{id:1011,_d:1}'
				sendmsg = sendmsg..',{id:1012,_d:1}'
				sendmsg = sendmsg..',{id:1013,_d:1}'
				sendmsg = sendmsg..']}'
				player:sendMsg(sendmsg)
			end
		elseif cmdtb.subcmd == 12 then
			-- 拉取落单玩家(要判断上次是否改变)
			local attrs = ''
			attrs = attrs..'attrs:{'
			attrs = attrs..'"'..ATTR.HP..'":{val:100,u:0}'
			attrs = attrs..',"'..ATTR.MHP..'":{val:500,u:0}'
			attrs = attrs..',"'..ATTR.MP..'":{val:100,u:0}'
			attrs = attrs..',"'..ATTR.MMP..'":{val:150,u:0}'
			attrs = attrs..',"'..ATTR.CA..'":{val:200,u:0}'
			attrs = attrs..',"'..ATTR.MCA..'":{val:300,u:0}'
			attrs = attrs..'}'--attrs end
			local owner = 'owner:{id:0,name:"小石头1",cityid:9900001,uid:100021,pos:{x:0,y:0}}'
			sendmsg = '{cmd:'..NETCMD.TEAM..',singles:['
			sendmsg = sendmsg..'{id:1001,teampos:0,state:1,name:"butiful1",resid:140001,uid:200121,level:21,cityid:9900001,pos:{x:100,y:100},'..attrs..','..owner..'}'
			sendmsg = sendmsg..',{id:1002,teampos:1,state:1,name:"butiful2",resid:140001,uid:3100122,level:22,cityid:9900001,pos:{x:100,y:100},'..attrs..','..owner..'}'
			sendmsg = sendmsg..',{id:1003,teampos:0,state:1,name:"butiful3",resid:140001,uid:3100123,level:23,cityid:9900001,pos:{x:100,y:100},'..attrs..','..owner..'}'
			sendmsg = sendmsg..',{id:1004,teampos:0,state:1,name:"butiful4",resid:140001,uid:3100124,level:24,cityid:9900001,pos:{x:100,y:100},'..attrs..','..owner..'}'
			sendmsg = sendmsg..',{id:1005,teampos:0,state:1,name:"butiful5",resid:140001,uid:3100125,level:160,cityid:9900001,pos:{x:100,y:100},'..attrs..','..owner..'}'
			sendmsg = sendmsg..']}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 13 then
			-- 拉取未满的队伍(要判断上次是否改变)
			local attrs = ''
			attrs = attrs..'attrs:{'
			attrs = attrs..'"'..ATTR.HP..'":{val:100,u:0}'
			attrs = attrs..',"'..ATTR.MHP..'":{val:500,u:0}'
			attrs = attrs..',"'..ATTR.MP..'":{val:100,u:0}'
			attrs = attrs..',"'..ATTR.MMP..'":{val:150,u:0}'
			attrs = attrs..',"'..ATTR.CA..'":{val:200,u:0}'
			attrs = attrs..',"'..ATTR.MCA..'":{val:300,u:0}'
			attrs = attrs..'}'--attrs end
			local owner = 'owner:{id:0,name:"小石头1",cityid:9900001,uid:100021,pos:{x:0,y:0}}'
			sendmsg = '{cmd:'..NETCMD.TEAM..',oteams:['
			sendmsg = sendmsg..'{id:1001,teampos:0,state:1,name:"butiful1",resid:140001,uid:200121,level:21,cityid:9900001,pos:{x:100,y:100},'..attrs..','..owner..',num:2}'
			sendmsg = sendmsg..',{id:1002,teampos:1,state:1,name:"butiful2",resid:140001,uid:3100122,level:22,cityid:9900001,pos:{x:100,y:100},'..attrs..','..owner..',num:3}'
			sendmsg = sendmsg..',{id:1003,teampos:0,state:1,name:"butiful3",resid:140001,uid:3100123,level:23,cityid:9900001,pos:{x:100,y:100},'..attrs..','..owner..',num:1}'
			sendmsg = sendmsg..',{id:1004,teampos:0,state:1,name:"butiful4",resid:140001,uid:3100124,level:24,cityid:9900001,pos:{x:100,y:100},'..attrs..','..owner..',num:4}'
			sendmsg = sendmsg..',{id:1005,teampos:0,state:1,name:"butiful5",resid:140001,uid:3100125,level:160,cityid:9900001,pos:{x:100,y:100},'..attrs..','..owner..',num:2}'
			sendmsg = sendmsg..']}'
			player:sendMsg(sendmsg)
		elseif cmdtb.subcmd == 14 then
			-- 同意邀请入队 agree=1表示同意，agree=0表示拒绝
		elseif cmdtb.subcmd == 15 then
			-- 同意别人向我申请队长 agree=1表示同意，agree=0表示拒绝
		elseif cmdtb.subcmd == 16 then
			-- 同意别人转让队长给我 agree=1表示同意，agree=0表示拒绝
		end
	end;
})


