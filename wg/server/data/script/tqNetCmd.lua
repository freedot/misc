require('tqBaseClass')

-- 所有事件的定义
EET_USER_REQUEST			= 1 + EET_NET_EVENT_FIRST		--用户请求事件
EET_TIMER					= 2	+ EET_NET_EVENT_FIRST		--时钟事件
EET_COMMAND					= 3	+ EET_NET_EVENT_FIRST		--命令行命令事件

-- 所有消息的定义
SYSCMD_RELOADCODE			= 1		-- 重新加载代码
SYSCMD_EXITUSER				= 2		-- 用户退出游戏
SYSCMD_EXITSYS 				= 3        -- 退出server

NETCMD_GM						= 3		-- GM
NETCMD_SYSLAST				= 49 	-- 系统保留的最后一个cmdid

--需要在tqGameApp.js中同步维护
NETCMD = {
	ERROR					= 50,	-- 错误消息
	LOGIN					= 51,	-- 登录
	CREATEROLE				= 52, 	-- 创建角色
	ROLEBASE				= 53, 	-- 角色的基本数值变化
	RES						= 54, 	-- 下发资源信息
	--CITYRES					= 55, 	-- 城市资源信息
	HEARTBEAT				= 56, 	-- 心跳信息
	--SEL_CITY				= 57, 	-- 选择城市
	--GOLDRES					= 58, 	-- 银两、人口
	USEITEM					= 59, 	-- 使用道具
	CITYRES					= 60, 	-- 城池资源（粮食、木材、石料、生铁）
	BUILDRES				= 61, 	-- 建筑资源
	GENRES					= 62, 	-- 将领资源
	SOLDIERRES				= 63, 	-- 士兵资源
	DEFRES					= 64, 	-- 城防资源
	CHAT					= 65, 	-- 对话
	PKG						= 66, 	-- 包裹
	SHOP					= 67, 	-- 商城
	DEAL					= 68, 	-- 交易
	REPORT					= 69, 	-- 报告
	LETTER					= 70, 	-- 信件
	STORE					= 71, 	-- 仓库
	TASK					= 72,   -- 任务
	MAP						= 73,   -- 地图
	MILITARY				= 74,   -- 军事方面的
	FAVORITES				= 75,	-- 收藏列表
	FIGHT					= 76,	-- 战斗指挥（包括城防布局建造）
	RESPLANE				= 77,   -- 资源面板
	HERORES					= 78,   -- 英雄资源（取代GENRES）
	SVRCFG					= 79,   -- server上的配置
	FRIEND					= 80,   -- 好友
	TEAM					= 81,   -- 队伍
	SYSMSG				= 82,   -- 向客户端下发的系统消息
							  --[[
							  type:0,
							  flag:0,
							  msg
							  ]]
	ITEM					= 83, -- 道具相关的处理
	FARM					= 84, -- 农场相关的处理
	CULTURE				= 85, -- 国学相关的处理
	STRATEGY				= 86, -- 计谋
	RANKING					= 87, -- 排名
	ALLIANCE				= 88, -- 联盟
	MAKE				= 89, -- 制造
	NPCTALK					= 90, -- NPC对话协议
	MAPPLAYERS	= 91,	 -- 州城中玩家的列表
	BATTLE			= 92, -- 战场相关
	MAIL	= 93,				 -- 邮件
	CITYDEF	= 94,				 -- 城防
	TOWER	= 95,				 -- 箭塔
	SELFFIELD	= 96,				 -- 自己占领的野地
	ITEMOP = 97, -- 道具操作
	OUTFIELD = 98, -- 野地
	EXCHANGEEXP = 99, -- 祭坛兑换武将经验
	FIGHTREFSTATE = 100, -- 战斗关系
	ROLESTATE = 101, -- 角色状态
	OTHERPLAYERINFO = 102, -- 其他玩家的信息
	TRADING_AREA = 103, -- 商圈
	ACT_TOWER	= 104, --千层塔活动
	ACT_TERRACE	= 105, --点将台活动
	ACTIVITY_VAL	= 106, --活跃值
	NEWCOMERHELP = 107, -- 新手指引
	
	PROXY_QueryGold = 108, -- 代理服务器通知金币余额
	PROXY_GetBuyToken = 109, -- 代理服务器通知购买物品需要的token
	PROXY_DealResult = 110, -- 代理服务器通知交易结果
	
	PAYMENT = 111, -- 支付
	START_BuyByGold = 112, -- 通知客户端开始打开购买窗口
	RESULT_BuyByGold = 113, -- 客户端通知服务器购买道具的结果
	
	PROXY_QueryUserExist = 114, -- 
	PROXY_DealResult32Wan = 115, -- 
	PROXY_OS_GM = 116, -- 运营平台的gm指令
	
	EXCHANGE = 200, -- 兑换
	CLT_LOG = 201, -- 上报的客户端错误日志
	FULL_ROLES = 202, -- 服务器角色已满
	YELLOWDIAMOND = 203, -- 黄钻
	CLT_CFG = 204, -- 客户端配置
	VIP = 205, -- vip
	AUTOBUILD = 206, -- 自动建造
	PAYGOLD = 207,
	BLUEDIAMOND = 208, --  蓝钻
	CDKEY = 209 ,
	WORLDBOSS = 210, -- 世界boss
	SEND_REWARD = 211, -- 发送奖励
}

