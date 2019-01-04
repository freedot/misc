SysCommander = Class:extends({
	onCommand = function(self, nevt, cmdtb)
		local cmd = Util:getNumber(cmdtb, 'cmd')
		if cmd == SYSCMD_RELOADCODE then
			global.reloadCodes(Util:getNumber(cmdtb, 'flag'))
		elseif cmd == SYSCMD_EXITUSER then
			local player = app:getPlayerMgr():getPlayerById(nevt.playerid, nevt.connid)
			if player ~= nil then
				if player:isDeleted() then
					LOG('<error> save player after player is deleted!, [onCommand] ')
				end
				player:save()
				app:getPlayerMgr():freePlayer(player)
			end
		elseif cmd == SYSCMD_EXITSYS then
			app:getPlayerMgr():safeExit()
			app:getAlliMgr():safeExit()
			app:getCityMgr():safeExit()
			out:print('safe exit system!')
		end
	end;
})

