NpcTalkHandler = Class:extends({
	OnRequest = function(self, player, netevt, cmdtb)
		if cmdtb.subcmd == 1 then
			self:talkWithNpc(player, cmdtb.npcid, 1);
		elseif cmdtb.subcmd == 2 then
			self:selTalkOp(player, cmdtb.opidx);
		elseif cmdtb.subcmd == 3 then
			-- 结束和NPC对话
		end
	end;
	
	--和某个npc对话
	talkWithNpc = function(self, player, npcid, curnode)
		local resnpc = RES_NPCTALKS['n'..npcid]
		if resnpc['npcs'] ~= nil then
			self:sendNpcList(player, resnpc.npcs)
		else
			self:initUserNpcTalk(player, npcid, curnode)
			local usertalk = self:getUserNpcTalk(player)
			self:sendNpcTalkNode(player, resnpc.nodes[usertalk.curnode])
		end
	end;
	
	-- 选择对话的某个选项
	selTalkOp = function(self, player, opidx)
		local usertalk = self:getUserNpcTalk(player)
		local op = RES_NPCTALKS['n'..usertalk.npcid].nodes[usertalk.curnode].ops[opidx+1]
		self:doOpScript(player, op)
		self:doOpJump(player, op)
	end;
	
	sendNpcList = function(self, player, npcs)
		local npcids = ''
		for _, nid in pairs(npcs) do
			if npcids ~= '' then 
				npcids = npcids..','
			end
			npcids = npcids..'{id:'..nid..'}';
		end
		local sendmsg = '{cmd:'..NETCMD.NPCTALK..',tasknpcs:['..npcids..']}';
		player:sendMsg(sendmsg)
	end;
	
	sendNpcTalkNode = function(self, player, npcnode)
		local szops = ''
		for _, op in ipairs(npcnode.ops) do
			if szops ~= '' then 
				szops = szops..','
			end
			szops = szops..'"'..op.s..'"';
		end
		local sendmsg = '{cmd:'..NETCMD.NPCTALK..',task:{npcid:'..npcnode.npcid..',con:"'..npcnode.say..'",op:['..szops..']}}';
		player:sendMsg(sendmsg)
	end;
	
	initUserNpcTalk = function(self, player, npcid, curnode)
		player['npctalk'] = {npcid=npcid, curnode=curnode}
	end;
	
	getUserNpcTalk = function(self, player)
		return player['npctalk']
	end;
	
	doOpScript = function(self, player, op)
		if op['script'] ~= nil then
			op:script(player)
		end
	end;
	
	doOpJump = function(self, player, op)
		if op['jump'] ~= nil then
			local usertalk = self:getUserNpcTalk(player)
			self:talkWithNpc(player, usertalk.npcid, op.jump)
		end
	end;
})


