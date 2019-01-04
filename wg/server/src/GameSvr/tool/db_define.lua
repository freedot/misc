-------------------------------------------
--定义所有数据库的表结构
-------------------------------------------
--[[
ALTER TABLE tablename ADD newfield bigint(20) unsigned NOT NULL DEFAULT 0 AFTER beforefieldname;
ALTER TABLE tablename DROP fieldname;
ALTER TABLE 【表名字】 CHANGE 【列名称】【新列名称】 int(10) unsigned NOT NULL


ALTER TABLE alliances ADD lastLevel int(10) unsigned NOT NULL DEFAULT 0 AFTER createTime;
ALTER TABLE alliances ADD lastHonour int(10) unsigned NOT NULL DEFAULT 0 AFTER lastLevel;
ALTER TABLE alliances ADD rank int(10) unsigned NOT NULL DEFAULT 0 AFTER lastHonour;

]]

--数据库字段定义
g_dbtb = 
{
	zone_id = 1,
	
	----------------
	--角色表定义
	{
		name = 'roles', -- role_table
		table_id = 0,
		table_name = 'roles',
		output_file = 'c:/myweb/sql/roles.sql',
		{
			field = 'id',
			attr = 'int(10) unsigned NOT NULL auto_increment',
			keytype = 'UNIQUE',
			desc = '自增加的id',
			default_fill = {flag='const', fmt='\\"\\"'},
		},
		
		{
			field = 'roleid',
			attr = 'bigint(20) unsigned NOT NULL',
			keytype = 'UNIQUE',
			desc = '角色唯一id',
		},
		
		{
			field = 'uname',
			attr = 'varchar(32) NOT NULL',
			keytype = 'UNIQUE',
			desc = '用户名', 
		},
		
		{
			field = 'rname',
			attr = 'varchar(21) NOT NULL',
			keytype = 'PRIMARY',
			desc = '角色名',
		},
		
		{
			field = 'sex',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '性别',
		},
		
		{
			field = 'bfixvars',
			attr = 'BLOB',
			desc = '固定属性',
		},
		
		{
			field = 'bbinfos',
			attr = 'BLOB',
			desc = '基本可变属性',
		},
		
		{
			field = 'bmilitary',
			attr = 'BLOB',
			desc = '军事信息',
		},		
		
		{
			field = 'bheros',
			attr = 'BLOB',
			desc = '英雄',
		},
		
		{
			field = 'bsoldiers',
			attr = 'BLOB',
			desc = '士兵',
		},
		
		{
			field = 'bcitys',
			attr = 'BLOB',
			desc = '城市列表',
		},
		
		{
			field = 'bfarms',
			attr = 'BLOB',
			desc = '农场',
		},
		
		{
			field = 'bcultures',
			attr = 'BLOB',
			desc = '科技',
		},

		{
			field = 'bitems',
			attr = 'BLOB',
			desc = '道具列表',
		},
		
		{
			field = 'bbuffs',
			attr = 'BLOB',
			desc = '道具列表',
		},
		
		{
			field = 'btasks',
			attr = 'BLOB',
			desc = '任务列表',
		},
		
		{
			field = 'bbulletins',
			attr = 'BLOB',
			desc = '战报列表',
		},
		
		{
			field = 'bbuddys',
			attr = 'BLOB',
			desc = '好友列表',
		},
		
		{
			field = 'bmiscs',
			attr = 'BLOB',
			desc = '杂项属性',
		},
		
		{
			field = 'regtime',
			attr = 'int(10) unsigned NOT NULL',
			desc = '注册时间',
		},
		
		{
			field = 'locktotime',
			attr = 'int(10) unsigned',
			desc = '该角色被封的截止时间',
		},
	},
	
	---------------------
	--野外地图格子定义
	{
		name = 'mapgrids',
		table_name = 'mapgrids',
		output_file = 'c:/myweb/sql/mapgrids.sql',
		{
			field = 'gridId',
			attr = 'int(10) unsigned NOT NULL',
			keytype = 'PRIMARY',
			desc = '格子编号',
		},
		
		{
			field = 'objType',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '对象类型（玩家、野地、npc城、空地）',
		},
		
		{
			field = 'resId',
			attr = 'int(10) unsigned NOT NULL',
			desc = '对象类型是野地、npc城时，对应的资源id',
		},
		
		{
			field = 'modelId', --@modelId
			attr = 'int(10) unsigned NOT NULL',
			desc = '对应的模型id',
		},
		
		{
			field = 'subCitys', --@subCitys
			attr = 'varchar(30) NOT NULL',
			desc = '分城ID列表字符串，形式如： 170001,170001,170001,170001 ',
		},
		
		{
			field = 'roleId',
			attr = 'bigint(20) unsigned NOT NULL',
			desc = '角色的id',
		},
		
		{
			field = 'roleName',
			attr = 'varchar(21) NOT NULL',
			desc = '角色名称',
		},
		
		{
			field = 'userName',
			attr = 'varchar(32) NOT NULL',
			desc = '用户名称',
		},
		
		{
			field = 'icon',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '角色头像',
		},
		
		{
			field = 'level',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '等级',
		},
		
		{
			field = 'sex',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '性别',
		},
		
		{
			field = 'state',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '君主状态',
		},
		
		{
			field = 'allianceId',
			attr = 'bigint(20) unsigned NOT NULL',
			desc = '联盟id',
		},
		
		{
			field = 'enemyAlliId',
			attr = 'bigint(20) unsigned NOT NULL',
			desc = '敌人联盟id',
		},
		
		{
			field = 'refreshTime',
			attr = 'int(10) unsigned NOT NULL',
			desc = '上次刷新时间',
		},
		
		{
			field = 'alliName',
			attr = 'varchar(21) NOT NULL',
			desc = '联盟名称',
		},
		
		{
			field = 'cityLevel',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '城池等级',
		},
		
		{
			field = 'buildCurVal',
			attr = 'int(10) unsigned NOT NULL',
			desc = '建设度',
		},
		
		{
			field = 'roleRank',
			attr = 'int(10) unsigned NOT NULL',
			desc = '角色排名',
		},
		
		{
			field = 'introduction',
			attr = 'varchar(51) NOT NULL',
			desc = '个人简介',
		},
		
		{
			field = 'loginTime',
			attr = 'int(10) unsigned NOT NULL',
			desc = '最近登录时间',
		},
		
		{
			field = 'misc',
			attr = 'BLOB',
			desc = '杂项',
		},		
	},
	
	---------------------------
	--亡城野外地图格子定义
	{
		name = 'exilegrids',
		table_name = 'exilegrids',
		output_file = 'c:/myweb/sql/exilegrids.sql',
		{
			field = 'gridId',
			attr = 'int(10) NOT NULL',
			desc = '流亡时的格子编号',
		},
		
		{
			field = 'objType',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '对象类型（玩家、野地、npc城、空地）',
		},
		
		{
			field = 'resId',
			attr = 'int(10) unsigned NOT NULL',
			desc = '对象类型是野地、npc城时，对应的资源id',
		},
		
		{
			field = 'modelId', --@modelId
			attr = 'int(10) unsigned NOT NULL',
			desc = '对应的模型id',
		},
		
		{
			field = 'subCitys', --@subCitys
			attr = 'varchar(30) NOT NULL',
			desc = '分城ID列表字符串，形式如： 170001,170001,170001,170001 ',
		},
		
		{
			field = 'roleId',
			attr = 'bigint(20) unsigned NOT NULL',
			keytype = 'PRIMARY',
			desc = '角色的id',
		},
		
		{
			field = 'roleName',
			attr = 'varchar(21) NOT NULL',
			desc = '角色名称',
		},
		
		{
			field = 'userName',
			attr = 'varchar(32) NOT NULL',
			desc = '用户名称',
		},
		
		{
			field = 'icon',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '角色头像',
		},
		
		{
			field = 'level',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '等级',
		},
		
		{
			field = 'sex',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '性别',
		},
		
		{
			field = 'state',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '君主状态',
		},
		
		{
			field = 'allianceId',
			attr = 'bigint(20) unsigned NOT NULL',
			desc = '联盟id',
		},
		
		{
			field = 'enemyAlliId',
			attr = 'bigint(20) unsigned NOT NULL',
			desc = '敌人联盟id',
		},
		
		{
			field = 'refreshTime',
			attr = 'int(10) unsigned NOT NULL',
			desc = '上次刷新时间',
		},
		
		{
			field = 'alliName',
			attr = 'varchar(21) NOT NULL',
			desc = '联盟名称',
		},
		
		{
			field = 'cityLevel',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '城池等级',
		},
		
		{
			field = 'buildCurVal',
			attr = 'int(10) unsigned NOT NULL',
			desc = '建设度',
		},
		
		{
			field = 'roleRank',
			attr = 'int(10) unsigned NOT NULL',
			desc = '角色排名',
		},
		
		{
			field = 'introduction',
			attr = 'varchar(51) NOT NULL',
			desc = '个人简介',
		},
		
		{
			field = 'loginTime',
			attr = 'int(10) unsigned NOT NULL',
			desc = '最近登录时间',
		},
		
		{
			field = 'misc',
			attr = 'varchar(2) NOT NULL', -- 现在只存放 市场等级
			desc = '杂项',
		},	
	},	
	
	----------------
	--军队表格
	{
		name = 'armys',
		table_name = 'armys',
		output_file = 'c:/myweb/sql/armys.sql',
		{
			field = 'armyId',
			attr = 'bigint(20) unsigned NOT NULL',
			keytype = 'PRIMARY',
			desc = '出征军队ID',
		},
		
		{
			field = 'sourceId',
			attr = 'bigint(20) unsigned NOT NULL',
			desc = '出发者id',
		},
		
		{
			field = 'sourceType',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '出发者类型',
		},
		
		{
			field = 'targetId',
			attr = 'bigint(20) unsigned NOT NULL',
			desc = '目标id',
		},
		
		{
			field = 'targetType',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '目标者类型',
		},
		
		{
			field = 'expedType',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '出征类型',
		},
		
		{
			field = 'lineupId',
			attr = 'int(10) unsigned NOT NULL',
			desc = '阵型ID',
		},
		
		{
			field = 'simpleHeros',
			attr = 'BLOB  NOT NULL',
			desc = '简易英雄描述列表',
		},
		
		{
			field = 'state',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '军队状态',
		},
		
		{
			field = 'startTime',
			attr = 'int(10) unsigned NOT NULL',
			desc = '军队开始时间',
		},
		
		{
			field = 'needTime',
			attr = 'int(10) unsigned NOT NULL',
			desc = '军队出阵需要的基本时间',
		},		
		
		{
			field = 'stopTime',
			attr = 'int(10) unsigned NOT NULL',
			desc = '军队结束时间',
		},
		
		{
			field = 'fighted',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '是否发生过战斗',
		},
		
		{
			field = 'buff',
			attr = 'BLOB  NOT NULL',
			desc = '该军队中的buff',
		},
	},
	
	
	----------------
	--邮件表格
	{
		name = 'mails',
		table_name = 'mails',
		output_file = 'c:/myweb/sql/mails.sql',
		{
			field = 'mailId',
			attr = 'bigint(20) unsigned NOT NULL',
			keytype = 'PRIMARY',
			desc = '邮件ID',
		},
		
		{
			field = 'receiver',
			attr = 'varchar(21) NOT NULL',
			desc = '接收者',
		},	
		
		{
			field = 'sender',
			attr = 'varchar(21) NOT NULL',
			desc = '发送者',
		},
		
		{
			field = 'isSys',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '是否为系统邮件',
		},		
		
		{
			field = 'isRead',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '是否已读',
		},
		
		{
			field = 'title',
			attr = 'varchar(45) NOT NULL',
			desc = '标题',
		},	
		
		{
			field = 'tempId',
			attr = 'int(10) unsigned NOT NULL',
			desc = '邮件内容模板Id',
		},
		
		{
			field = 'bcontent',
			attr = 'BLOB',
			desc = '邮件内容',
		},
		
		{
			field = 'itemCount',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '包裹道具数量',
		},		
		
		{
			field = 'bpkg',
			attr = 'BLOB',
			desc = '邮件包裹',
		},
		
		{
			field = 'addTime',
			attr = 'int(10) unsigned NOT NULL',
			desc = '时间',
		},	
	},
	
	----------------
	--联盟表格
	{
		name = 'alliances',
		table_name = 'alliances',
		output_file = 'c:/myweb/sql/alliances.sql',
		{
			field = 'allianceId',
			attr = 'bigint(20) unsigned NOT NULL',
			keytype = 'PRIMARY',
			desc = '联盟ID',
		},
		
		{
			field = 'level',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '等级',
		},
		
		{
			field = 'name',
			attr = 'varchar(21) NOT NULL',
			desc = '联盟名称', 
		},
		
		{
			field = 'flagName',
			attr = 'varchar(3) NOT NULL',
			desc = '联盟旗号', 
		},
		
		{
			field = 'cityResId',
			attr = 'int(10) unsigned NOT NULL',
			desc = '州城resid',
		},

		{
			field = 'honour',
			attr = 'int(10) unsigned NOT NULL',
			desc = '荣誉',
		},		
		
		{
			field = 'leader',
			attr = 'varchar(21) NOT NULL',
			desc = '盟主', 
		},

		{
			field = 'buildVal',
			attr = 'int(10) unsigned NOT NULL',
			desc = '建设', 
		},
		
		{
			field = 'card',
			attr = 'int(10) unsigned NOT NULL',
			desc = '令牌', 
		},
		
		{
			field = 'qqGroup',
			attr = 'varchar(11) NOT NULL',
			desc = 'qq群', 
		},
		
		{
			field = 'introduction',
			attr = 'varchar(600) NOT NULL',
			desc = '群介绍', 
		},
		
		{
			field = 'bulletin',
			attr = 'varchar(600) NOT NULL',
			desc = '群内公告', 
		},
		
		{
			field = 'member',
			attr = 'BLOB NOT NULL',
			desc = '联盟成员', 
		},
		
		{
			field = 'lawLight',
			attr = 'BLOB NOT NULL',
			desc = '神兽', 
		},
		
		{
			field = 'misc',
			attr = 'BLOB NOT NULL',
			desc = '其它杂项',
		},
		
		{
			field = 'createTime',
			attr = 'int(10) unsigned NOT NULL',
			desc = '时间',
		},
		
		{
			field = 'lastLevel',
			attr = 'int(10) unsigned NOT NULL',
			desc = '联盟等级',
		},
		{
			field = 'lastHonour',
			attr = 'int(10) unsigned NOT NULL',
			desc = '联盟荣誉',
		},
		{
			field = 'rank',
			attr = 'int(10) unsigned NOT NULL',
			desc = '联盟排名',
		},	
	},
	
	----------------
	--联盟表格
	{
		name = 'allianceevents',
		table_name = 'allianceevents',
		output_file = 'c:/myweb/sql/allianceevents.sql',
		{
			field = 'id',
			attr = 'int(10) unsigned NOT NULL auto_increment',
			keytype = 'PRIMARY',
			desc = 'id',
		},
		
		{
			field = 'allianceId',
			attr = 'bigint(20) unsigned NOT NULL',
			desc = '联盟ID',
		},
		
		{
			field = 'event',
			attr = 'varchar(255) NOT NULL',
			desc = '盟主', 
		},

		{
			field = 'createTime',
			attr = 'int(10) unsigned NOT NULL',
			desc = '时间',
		},
	},
	

	----------------
	--唯一ID表定义
	{
		name = 'uuids', -- xsg_uuid_table
		table_name = 'uuids', -- 
		output_file = 'c:/myweb/sql/uuids.sql',
		{
			field = 'id',
			attr = 'int(10) unsigned NOT NULL auto_increment',
			keytype = 'UNIQUE',
			desc = '自增加的id',
		},
		
		{
			field = 'name',
			attr = 'varchar(100) NOT NULL',
			keytype = 'PRIMARY',
			desc = 'ID的名称',
		},
		
		{
			field = 'uuid',
			attr = 'bigint(20) unsigned NOT NULL',
			desc = '唯一ID',
		},
		
		append_sql = [[
			LOCK TABLES `uuids` WRITE;
			INSERT INTO uuids VALUES('', 'allianceId', '1');
			INSERT INTO uuids VALUES('', 'armyId', '1');
			INSERT INTO uuids VALUES('', 'itemId', '1');
			INSERT INTO uuids VALUES('', 'mailId', '1');
			UNLOCK TABLES;
		]]
	},
	
	----------------
	--目录服务器
	--[[
	{
		name = 'dirs',
		table_id = 0,
		table_name = 'dirs',
		output_file = 'c:/myweb/sql/dirs.sql',
		{
			field = 'id',
			attr = 'int(10) unsigned NOT NULL',
			keytype = 'PRIMARY',
			desc = '服务器唯一ID',
		},
		
		{
			field = 'name',
			attr = 'varchar(21) NOT NULL',
			desc = '服务器名称', 
		},
		
		{
			field = 'url',
			attr = 'varchar(100) NOT NULL',
			desc = '服务器url', 
		},
	},	
	]]
	
	-----------------------
	--登录信息数据库
	--[[
	{
		name = 'logins',
		table_id = 0,
		table_name = 'logins',
		output_file = 'c:/myweb/sql/logins.sql',
		{
			field = 'id',
			attr = 'int(10) unsigned NOT NULL',
			keytype = 'PRIMARY',
		},
		
		{
			field = 'uname',
			attr = 'varchar(32) NOT NULL',
			desc = '用户名', 
		},
		
		{
			field = 'lastsvr',
			attr = 'int(10) unsigned NOT NULL',
			desc = '最近登录服务器id', 
		},
		
		{
			field = 'regsvrs',
			attr = 'BLOB',
			desc = '该用户已注册的服务器id列表', 
		},
	},
	]]
	
	--玩家间的战斗状态数据库
	{
		name = 'fightstates',
		table_id = 0,
		table_name = 'fightstates',
		output_file = 'c:/myweb/sql/fightstates.sql',
		{
			field = 'id',
			attr = 'bigint(20) unsigned NOT NULL',
			desc = '关键id',
			keytype = 'PRIMARY',
		},
		{
			field = 'roleId1',
			attr = 'bigint(20) unsigned NOT NULL',
			desc = '角色的id',
		},
		{
			field = 'roleId2',
			attr = 'bigint(20) unsigned NOT NULL',
			desc = '角色的id',
		},
		{
			field = 'fightState',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '战斗状态',
		},
		{
			field = 'stopTime',
			attr = 'int(10) unsigned NOT NULL',
			desc = '结束时间',
		},
	},
	
	--cdkey数据库
	{
		name = 'cdkey',
		table_id = 0,
		table_name = 'cdkey',
		output_file = 'c:/myweb/sql/cdkey.sql',
		{
			field = 'cdkey',
			attr = 'varchar(21) NOT NULL',
			desc = 'cdkey',
			keytype = 'PRIMARY',
		},
		{
			field = 'type',
			attr = 'int(10) unsigned NOT NULL',
			desc = 'cdkey类别',
		},
		{
			field = 'resid',
			attr = 'int(10) unsigned NOT NULL',
			desc = '礼包id',
		},
		{
			field = 'number',
			attr = 'int(10) unsigned NOT NULL',
			desc = '礼包个数',
		},
		{
			field = 'createTime',
			attr = 'int(10) unsigned NOT NULL',
			desc = '创建时间',
		},
		{
			field = 'isUsed',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '是否使用',
		},
	},
	
	--32wan订单号
	{
		name = 'wan32order',
		table_id = 0,
		table_name = 'wan32order',
		output_file = 'c:/myweb/sql/wan32order.sql',
		{
			field = 'orderno',
			attr = 'varchar(32) NOT NULL',
			desc = 'orderno',
			keytype = 'PRIMARY',
		},
		{
			field = 'name',
			attr = 'varchar(21) NOT NULL',
			desc = '角色名',
		},
		{
			field = 'gold',
			attr = 'int(10) unsigned NOT NULL',
			desc = '金币',
		},
	},
	
	-- 角色排名
	{
		name = 'rolerank',
		table_id = 0,
		table_name = 'rolerank',
		output_file = 'c:/myweb/sql/rolerank.sql',
		{
			field = 'roleid',
			attr = 'bigint(20) unsigned NOT NULL',
			keytype = 'PRIMARY',
			desc = '角色唯一id',
		},
		{
			field = 'roleName',
			attr = 'varchar(21) NOT NULL',
			keytype = 'UNIQUE',
			desc = '角色名',
		},
		{
			field = 'lastWorldBossHurt',
			attr = 'int(10) unsigned NOT NULL',
			desc = '世界boss的昨天伤害',
		},
		{
			field = 'curWorldBossHurt',
			attr = 'int(10) unsigned NOT NULL',
			desc = '世界boss的今天伤害',
		},
		{
			field = 'worldBossRank',
			attr = 'int(10) unsigned NOT NULL',
			desc = '世界boss的伤害个人排名',
		},
	},
	
	-- 联盟排名
	{
		name = 'allirank',
		table_id = 0,
		table_name = 'allirank',
		output_file = 'c:/myweb/sql/allirank.sql',
		{
			field = 'alliid',
			attr = 'bigint(20) unsigned NOT NULL',
			keytype = 'PRIMARY',
			desc = '联盟唯一id',
		},
		{
			field = 'alliName',
			attr = 'varchar(21) NOT NULL',
			desc = '联盟名称',
		},
		{
			field = 'lastWorldBossHurt',
			attr = 'bigint(20) unsigned NOT NULL',
			desc = '世界boss的昨天伤害',
		},
		{
			field = 'curWorldBossHurt',
			attr = 'bigint(20) unsigned NOT NULL',
			desc = '世界boss的今天伤害',
		},
		{
			field = 'worldBossRank',
			attr = 'int(10) unsigned NOT NULL',
			desc = '世界boss的伤害排名',
		},
	},
		
	-- 国家排名
	{
		name = 'countryrank',
		table_id = 0,
		table_name = 'countryrank',
		output_file = 'c:/myweb/sql/countryrank.sql',
		{
			field = 'id',
			attr = 'int(10) unsigned NOT NULL',
			keytype = 'PRIMARY',
			desc = 'id',
		},
		{
			field = 'country',
			attr = 'varchar(21) NOT NULL',
			desc = '国家名称',
		},
		{
			field = 'weekWorldBossHurt',
			attr = 'bigint(20) unsigned NOT NULL',
			desc = '世界boss的昨天伤害',
		},
		{
			field = 'curWorldBossHurt',
			attr = 'bigint(20) unsigned NOT NULL',
			desc = '世界boss的今天伤害',
		},
		{
			field = 'lastWorldBossHurtTimes',
			attr = 'int(10) unsigned NOT NULL',
			desc = '世界boss的上周的击杀次数',
		},
		{
			field = 'curWorldBossHurtTimes',
			attr = 'int(10) unsigned NOT NULL',
			desc = '世界boss的本周的击杀次数',
		},
		{
			field = 'worldBossRank',
			attr = 'int(10) unsigned NOT NULL',
			desc = '世界boss的伤害排名',
		},
		
		append_sql = [[
			LOCK TABLES `countryrank` WRITE;
			INSERT INTO countryrank VALUES('9900001', 'wei', '0', '0', '0', '0', '0');
			INSERT INTO countryrank VALUES('9900002', 'shu', '0', '0', '0', '0', '0');
			INSERT INTO countryrank VALUES('9900003', 'wu', '0', '0', '0', '0', '0');
			UNLOCK TABLES;
		]],
	},
	
	-- 排名刷新时间
	{
		name = 'rankrefresh',
		table_id = 0,
		table_name = 'rankrefresh',
		output_file = 'c:/myweb/sql/rankrefresh.sql',
		{
			field = 'id',
			attr = 'int(10) unsigned NOT NULL auto_increment',
			keytype = 'PRIMARY',
			desc = 'jid',
		},
		{
			field = 'name',
			attr = 'varchar(21) NOT NULL',
			keytype = 'UNIQUE',
			desc = '排名名称',
		},
		{
			field = 'refreshTime',
			attr = 'int(10) unsigned NOT NULL',
			desc = '排名每日刷新时间',
		},
		{
			field = 'sortTime',
			attr = 'int(10) unsigned NOT NULL',
			desc = '排名时间,对周排名的这个值和refreshTime不同', 
		},
		{
			field = 'sortTimes',
			attr = 'int(10) unsigned NOT NULL',
			desc = '排名的次数', 
		},
	},
	
	-- gms
	{
		name = 'gms',
		table_id = 0,
		table_name = 'gms',
		output_file = 'c:/myweb/sql/gms.sql',
		{
			field = 'name',
			attr = 'varchar(33) NOT NULL',
			keytype = 'PRIMARY',
			desc = '用户名',
		},
		{
			field = 'flag',
			attr = 'int(10) unsigned NOT NULL',
			desc = '级别标志',
		},
	},
	
	-- svrvar
	{
		name = 'svrvar',
		table_id = 0,
		table_name = 'svrvar',
		output_file = 'c:/myweb/sql/svrvar.sql',
		{
			field = 'name',
			attr = 'varchar(33) NOT NULL',
			keytype = 'PRIMARY',
			desc = '变量名',
		},
		{
			field = 'var',
			attr = 'int(10) unsigned NOT NULL',
			desc = '变量值',
		},
	},
	
	--guestsmap
	{
		name = 'guestsmap',
		table_id = 0,
		table_name = 'guestsmap',
		output_file = 'c:/myweb/sql/guestsmap.sql',
		{
			field = 'userName',
			attr = 'varchar(32) NOT NULL',
			keytype = 'PRIMARY',
			desc = '用户名称',
		},
		{
			field = 'guestName',
			attr = 'varchar(32) NOT NULL',
			desc = '游客名称', -- 在server实际的名称
		},
	},
	
	--guests
	--当在guestsmap中映射完成后，则从该表中删除
	--定时遍历该表，删除不在线的
	{
		name = 'guests',
		table_id = 0,
		table_name = 'guests',
		output_file = 'c:/myweb/sql/guests.sql',
		{
			field = 'id',
			attr = 'int(10) unsigned NOT NULL auto_increment',
			keytype = 'UNIQUE',
			desc = '自增加的id',
		},
		{
			field = 'guestName',
			attr = 'varchar(32) NOT NULL',
			keytype = 'PRIMARY',
			desc = '游客名称',
		},
	},
	
	--for [users] db
	--userlogins
	{
		name = 'userlogins',
		table_id = 0,
		table_name = 'userlogins',
		output_file = 'c:/myweb/sql/userlogins.sql',
		{
			field = 'id',
			attr = 'int(10) unsigned NOT NULL auto_increment',
			keytype = 'UNIQUE',
			desc = '自增加的id',
		},
		{
			field = 'user',
			attr = 'varchar(32) NOT NULL',
			keytype = 'PRIMARY',
			desc = '用户名',
		},
		{
			field = 'password',
			attr = 'varchar(32) NOT NULL',
			desc = '密码',
		},
		{
			field = 'mail',
			attr = 'varchar(50) NOT NULL',
			desc = '密邮',
		},
		{
			field = 'regtime',
			attr = 'int(10) unsigned NOT NULL',
			desc = '注册时间',
		},
	},
	
	--for [kzsg-dirs] db
	--dirs
	{
		name = 'dirs',
		table_id = 0,
		table_name = 'dirs',
		output_file = 'c:/myweb/sql/dirs.sql',
		{
			field = 'serverid',
			attr = 'int(10) unsigned NOT NULL',
			keytype = 'PRIMARY',
			desc = 'serverid',
		},
		{
			field = 'name',
			attr = 'varchar(32) NOT NULL',
			desc = '服务器名',
		},
		{
			field = 'url',
			attr = 'varchar(256) NOT NULL',
			desc = '路径',
		},
		{
			field = 'state',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '状态',
		},
		{
			field = 'recommendflag',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '推荐',
		},
		{
			field = 'fulflag',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '服务器满',
		},
		{
			field = 'newflag',
			attr = 'tinyint(3) unsigned NOT NULL',
			desc = '新服务器',
		},
	},
	
	--for [kzsg-dirs] db
	--lastlogins
	{
		name = 'lastlogins',
		table_id = 0,
		table_name = 'lastlogins',
		output_file = 'c:/myweb/sql/lastlogins.sql',
		{
			field = 'user',
			attr = 'varchar(32) NOT NULL',
			keytype = 'PRIMARY',
			desc = '用户名',
		},
		{
			field = 'lastserver1',
			attr = 'int(10) unsigned NOT NULL',
			desc = 'lastserver',
		},
		{
			field = 'lastserver2',
			attr = 'int(10) unsigned NOT NULL',
			desc = 'lastserver',
		},
		{
			field = 'lastserver3',
			attr = 'int(10) unsigned NOT NULL',
			desc = 'lastserver',
		},
		{
			field = 'lastserver4',
			attr = 'int(10) unsigned NOT NULL',
			desc = 'lastserver',
		},
		{
			field = 'lastserver5',
			attr = 'int(10) unsigned NOT NULL',
			desc = 'lastserver',
		},
		{
			field = 'lastserver6',
			attr = 'int(10) unsigned NOT NULL',
			desc = 'lastserver',
		},
	}
};

--独立运行
if package.loaded['db_define'] == nil then
	require('lua_tool.tools')
	output_dbsql(g_dbtb)
end
