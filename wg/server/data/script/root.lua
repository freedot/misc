------------------------------------------------------------------------
------------------------------------------------------------------------
RELOAD_ALL_SCRIPT_FLAG = 0
RELOAD_MODIFY_SCRIPT_FLAG = 1
MAX_BIGINT = 10000000000000

g_qqMembershipFields = {
	'is_yellow_vip',
	'is_yellow_year_vip',
	'yellow_vip_level',
	'is_yellow_high_vip',
	'is_blue_vip',
	'is_blue_year_vip',
	'blue_vip_level',
	'is_super_blue_vip',
	'_3366_grow_level',
}

g_qqYDFields = {
	'is_yellow_vip',
	'is_yellow_year_vip',
	'yellow_vip_level',
	'is_yellow_high_vip',
}

g_qqBDFields = {
	'is_blue_vip',
	'is_blue_year_vip',
	'blue_vip_level',
	'is_super_blue_vip',
	'_3366_grow_level',
}

g_use_self_gold = true


if _unit_test_ == nil then
	SPub = GetScriptPub()
	GridsMgr = GetGridsManager()
	RankMgrC = GetRankManager()
	ProxyServerC = GetProxyServer()
	SScriptSys = GetScriptSys()
end

debug.log = function(msg)
	if IsDebug() then
		print ( msg )
	end
end;

os.clockMs = function()
	if SPub == nil then return 0 end
	return SPub:getTimeMsEx()
end;

require('timer')
global={
	_timer = Timer:new(200)
}

global.getTimer = function()
	return global._timer
end;

global.makeInt64 = function(high, low)
	return high*4294967296 + low
end;

global.loadSvrCfg = function()
	local basePath = SPub:GetCfgBasePath()
	dofile(basePath .. '/cfg.lua')
end;

global.loadSvrAfterCfg = function()
	local basePath = SPub:GetCfgBasePath()
	local filename = basePath .. '/after_cfg.lua'
	local isExist = false
	local f = io.open(filename)
	if f ~= nil then
		io.close(f)
		isExist = true
	end
	
	if isExist then
		dofile(filename)
	end
end;

global.getLogBasePath = function()
	return SPub:GetLogBasePath()
end;

global.getSvrNameId = function()
	return SPub:GetSvrNameId()
end;

global.loadCodes = function(files)
	local unloadScript = function(sfile)
		package.loaded[sfile] = nil
	end
	
	local reloadScript = function(sfile)	
		print ( 'load script : ' .. sfile )
		require(sfile)
	end
	
	for _, s in pairs(files) do
		unloadScript(s)
		reloadScript(s)
	end
end

global.loadNpcScripts = function()
	local _reloadScript = function(npcfile)
		package.loaded['npctalks.'..npcfile] = nil
		require('npctalks.'..npcfile)
	end
	for _, s in pairs(global.npcscripts) do
		_reloadScript('npc'..s)
	end
end

global.reloadCodes = function(flag)
	print('-----------begin loading-----------')
	
	global.loadSvrCfg()
	global.loadCodes({'res.reloads'})
	global.loadCodes(global.reloadsFiles)
	global.loadSvrAfterCfg()
	app:reloadHandlers(global.reloadsHandlers) 

	print('--------reload and reinit ok!--------')
end

global.scriptFiles = {
	'tqBaseClass',	
	'tqClass',
	'tqDefs',
	'tqString',	
	'tqUtil',
	'tqUtfString',
	'tqDirtyWordChecker',
	'tqValidChecker',
	
	'res.res_string',
	'res.res_attrs',
	'res.res_fixid',
	'res.res_fixid_ex',
	'res.res_datas',
	
	'res.res_rolelevelexps',
	
	'res.res_items',
	'res.res_items_ex',
	'res.res_items_builds',
	'res.res_items_farms',
	
	'res.res_build',
	'res.res_inbuilds',
	
	'res.res_herolevelexps',
	'res.res_compose',
	'res.res_citylevelneeds',
	'res.res_officials',
	'res.res_herojingmai',
	'res.res_items_heroskills',
	'res.res_items_soldiers',
	'res.res_items_cultures',
	'res.res_soldiers_upd',
	'res.res_cultures_upd',
	'res.res_lineup',
	'res.res_copyfields',
	'res.res_fightmaps',
	'res.res_effects',
	'res.res_soldier_restriction',
	'res.res_fieldheros',
	'res.res_drops',
	'res.res_mailtemps',
	'res.res_fields',
	'res.res_acc_needgolds',
	'res.res_state_relations_raw',
	'res.res_smithy_salelist',
	'res.res_force_arms',
	'res.res_herosteel',
	'res.res_citydef',
	'res.res_xingming',
	'res.res_heronames_filter_names',
	'res.res_icons',
	'res.res_alli_upd_needs',
	'res.res_alli_lawlight_upd',
	'res.res_citys_npcs',
	'res.res_tasks',
	'res.res_svr_mics_cfg',
	'res.res_dayacts',
	'res.res_activityval_tasks',
	'res.res_shops',
	'res.res_gms',
	'res.res_dirtywords',
	'res.res_exchanges',
	'res.res_yd',
	'res.res_pay_act',
	'res.res_vip',
	'res.res_bd',
	'res.res_rankgifts',
	'res.res_worldboss',
	'res.res_maprects',
	'res.res_opensvract',
	'res.res_questions',
	
	'res.res_init',
	
	'npctalks.npcs',
	'tqService',
	'serverStartChecker',
	'tqRetDef',
	'tqItemResUtil',	
	'tqWUtil',
	'tqEffector',
	'tqGameApp',
	'tqBaseCmdHandler',
	'tqNetCmdHerosHdr',	
	'tqLoginHandler',
	'tqCreateRoleHandler',
	'tqBuildResHandler',
	'tqFavoritesHandler',
	'tqDealHandler',
	'tqUseItemHandler',
	'tqChatHandler',
	'tqHeartBeatHandler',
	'tqGoldResHandler',
	'tqGenResHandler',
	'tqHeroResHandler',
	'tqTowerHandler',
	'tqSoldierResHandler',
	'tqReportHandler',
	'tqTaskHandler',
	'tqStoreHandler',
	'tqMailHandler',
	'tqShopHandler',
	'tqDefResHandler',
	'tqPkgHandler',
	'tqNetCmd',
	'tqNetError',
	'tqSysCommander',
	'tqRankHdrTemplet',
	'tqRoleBaseHandler',
	'tqRequest',
	'tqMilitaryHandler',
	'tqRoleData',
	'tqCityResHandler',
	'tqFriendHandler',
	'tqTeamHandler',
	'tqItemHandler',
	'tqFarmResHandler',
	'tqCultureHandler',
	'tqStrategyHandler',
	'tqRankingHandler',
	'tqAllianceHandler',
	'tqMakeHandler',
	'tqNpcTalkHandler',
	'tqPlayers',
	'tqPlayerMgr',
	'tqAlliances',
	'tqExpend',
	'tqMsgSender',
	'tqTimerHdr',
	'tqUseTarget',
	'tqOutFieldHandler',	
	'tqCityManager',
	'tqExpeditionHdr',
	'tqExpeditionTimerHdr',
	'tqExpedReturnTimerHdr',
	'tqFieldHero',
	'tqFightHdr',
	'tqDropItemUtil',
	'tqUUIDMgr',
	'tqDBConn',
	'tqMailMgr',
	'tqFightResultMaker',
	'tqFieldPlayer',
	'tqPlayerCityDef',
	'tqPlayerWall',
	'tqFieldHeroMgr',
	'tqArmyMgr',
	'tqTowerPlayer',
	'tqFightResult',
	'tqPlayerSelfField',
	'tqCopyFieldPlayer',
	'tqArmyContainer',
	'tqArmyPlayerGetter',
	'tqArmyCampActorsGetter',
	'tqFieldArmyContainer',
	'tqOwnerFieldPlayer',
	'tqFieldCollector',
	'tqEnemyContainer',
	'tqFavoriteContainer',
	'tqSelfFieldChecker',
	'tqFieldLevelRefresher',
	'tqCityPosPlayer',
	'tqSelfFieldHandler',
	'tqCultureEffectMgr',
	'tqHeroActor',	
	'tqSoldierActor',
	'tqSoldierAttrHelper',
	'tqFightActor',
	'tqWallActorProxy',
	'tqCityDefActor',
	'tqCampActorInfoSetterForDebug',
	'tqHeroAttrHelper',
	'tqHero',
	'tqPlayerHeroMgr',
	'tqPlayerFarm',
	'tqPlayerCityRes',
	'tqStateContainer',
	'tqState',
	'tqMailHandler',
	'tqCppPlayerVar',
	'tqHeroWear',
	'tqItemEx',
	'tqPlayerPackage',
	'tqMapCppArrayList',
	'tqMapCppSet',
	'tqMail',
	'tqShopHandler',
	'tqItemOpHandler',
	'tqGemUtil',
	'tqPlayerFightRefState',
	'tqPlayerFightRefState',
	'tqPlayerFriendMgr',
	'tqSkillEffectUtil',
	'tqWorldBlessQueue',
	'tqPlayerCultures',
	'tqHeroSteel',
	'tqCityDefHandler',
	'tqExpendResMaker',
	'tqExchangeExpHandler',
	'tqOut',
	'tqFightRefStateHandler',
	'tqBriefPlayer',
	'tqRoleStateHandler',
	'tqWorldMsgQueue',
	'tqSet',
	'tqOtherPlayerInfoHdr',
	'tqTradingArea',
	'tqTradingAreaHdr',
	'tqExileRolesRefresher',
	'tqActTowerHdr',
	'tqPlayerActTower',
	'tqActTowerRank',
	'tqActTerraceHdr',
	'tqPlayerActTerrace',
	'tqStateCityHandler',
	'tqPlayerTask',
	'tqTaskFinisher',
	'tqActivityValHandler',
	'tqServerActEffect',
	'tqRoleRank',
	'tqNewcomerHelperHdr',
	'tqFightStateRepository',
	'tqPlayerClientCfg',
	'tqTimerCaller',
	'tqFixTimer',
	'tqExchangeHandler',
	'tqCltLogHandler',
	'tqPaymentHandler',
	'tqProxyServer',
	'tqQueryGoldHandler',
	'tqGetBuyTokenHandler',
	'tqDealResultHandler',
	'tqYellowDiamondHandler',
	'tqResultBuyHandler',
	'tqPlayerBuyLimiter',
	'tqClientCfgHandler',
	'tqAutoBuildsHandler',
	'tqBlueDiamondHandler',
	'tqQueryUserExistHandler',
	'tqDealResult32WanHandler',
	'tqOsGmHandler',
	'tqCDKeyHandler',
	'tqGMHdr',
	'tqWorldBossDlgHandler',
	'tqGameRoot',
	'tqCollector',
	'tqOpenSvrAct',
	'tqSendRewardHandler',
	'tqInvalidDataChecker',
	--<insert include before>
}

require('tqGameRoot')
if _unit_test_ == nil then
	GameRoot:run()
end

local proxy_conn_id = 1000000
function c_onCmd(event) -- called by c++
	local nevt = app.evtcast:Cast_ScriptEvent(event.eventData)
	if nevt.eventType == EET_USER_REQUEST then
		if nevt.connid == proxy_conn_id then
			app:onProxyRequest(nevt)
		else
			app:onRequest(nevt)
		end
	elseif nevt.eventType == EET_COMMAND then
		app:onCommand(nevt)
	end
end;

function c_onUpdate(timeMs) -- called by c++
	global.getTimer():update()
end;




