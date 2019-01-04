------------------------------------------------------------------------
global.reloadsFiles = {
	--'res.res_citys_npcs',
	--'res.res_fieldheros',
	--'res.res_copyfields',
	--'res.res_items_ex',
	'res.res_gms',
	--'res.res_init',
	
	--'tqMsgSender',
	--'tqFieldHero',
	--'tqEffector',
	
	--'tqActTowerHdr',
	--'tqActTerraceHdr',
	--'tqTaskHandler',
	--'tqUseItemHandler',
	--'tqItemOpHandler',
	'tqCDKeyHandler',
	'tqGMHdr',
	
	--'tqFieldCollector',
	--'tqSelfFieldHandler',
}

global.reloadsHandlers = {--customcfgs {cmdid, handlerClass}
	--{NETCMD.ACT_TOWER, ActTowerHdr},
	--{NETCMD.ACT_TERRACE, ActTerraceHdr},
	--{NETCMD.TASK, TaskHandler},
	--{NETCMD.USEITEM, UseItemHandler},
	{NETCMD.CDKEY, CDKeyHandler},
	{NETCMD_GM, GMHandler},
	--{NETCMD.ITEMOP, ItemOpHandler},
	--{NETCMD.SELFFIELD, CmdSelfFieldHandler},
}




