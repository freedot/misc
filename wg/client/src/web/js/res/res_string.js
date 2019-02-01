/******************************************************************************
  Copyright (C) 2012. All rights reserved.
******************************************************************************/
rstr={
	ids:{
		'100000':{param:1, msg:"你的人口不足，需要{0}人"}
		,'100001':{param:2, msg:"道具『{0}』数量不足{1}个"}
		,'100002':{param:3, msg:"武将『{0}』{1}不足{2}点"}
		,'100003':{param:2, msg:"君主的 {0} 不足{1}点"}
		,'100004':{param:2, msg:"你的 {0} 不足{1}"}
		,'100005':{param:2, msg:"技能『{0}』升级到{1}级"}
		,'100006':{param:1, msg:"你的金币和礼金不足{0}"}
		,'100007':{param:1, msg:"{0}中已没可分配城池，请选择其他国家"}
		,'100008':{param:3, msg:"你已成功转到『{0}』，坐标位置[{1},{2}]"}
		,'100009':{param:1, msg:"你的武将『{0}』已成功解锁"}
		,'100010':{param:2, msg:"领悟到技能『{0}』，等级{1}级"}
		,'100011':{param:0, msg:"出征成功！"}
		,'100012':{param:3, msg:"你的野地[{0},{1}]等级降到{2}级！"}
		,'100013':{param:2, msg:"你的野地[{0},{1}]已放弃了！"}
		,'100014':{param:0, msg:"你的邮箱已满，赶快清理下吧！"}
		,'100015':{param:0, msg:"背包已满，整理完后再进行收获！"}
		,'100016':{param:0, msg:"含有未提取道具的系统邮件将无法删除！"}
		,'100017':{param:0, msg:"背包已满，整理完后再进行提取！"}
		,'100018':{param:0, msg:"武将非空闲状态不能穿脱装备！"}
		,'100019':{param:1, msg:"该装备需{0}级武将才能穿戴！"}
		,'100020':{param:1, msg:"当前{0}位置上的装备包含增加统帅的效果，请下脱下！"}
		,'100021':{param:0, msg:"背包已满，整理完后再进行脱装备！"}
		,'100022':{param:0, msg:"武将当前状态为非空闲！无法进行此操作！"}
		,'100023':{param:0, msg:"背包已满，整理完后再进行购买！"}
		,'100024':{param:0, msg:"你的声望不足，无法进行购买！"}
		,'100025':{param:0, msg:"请选择要拆分的装备！"}
		,'100026':{param:2, msg:"你获得『{0}』×{1}"}
		,'100027':{param:0, msg:"空闲中武将的装备才能被强化！"}
		,'100028':{param:0, msg:"空闲中武将的装备才可以镶嵌宝石！"}
		,'100029':{param:0, msg:"空闲中武将的装备才可以摘除宝石！"}
		,'100030':{param:0, msg:"背包已满，整理完后再进行摘除宝石操作！"}
		,'100031':{param:0, msg:"当前类别宝石已达到最高级！"}
		,'100032':{param:0, msg:"合成所需当前类别宝石数量不足！"}
		,'100033':{param:0, msg:"空闲中武将的装备宝石才可以升级！"}
		,'100034':{param:0, msg:"背包已满，整理完后再进行宝石合成操作！"}
		,'100035':{param:0, msg:"宝石合成失败！"}
		,'100036':{param:0, msg:"镶嵌宝石的装备不能出售！"}
		,'100037':{param:1, msg:"成功升级到『{0}』！"}
		,'100038':{param:1, msg:"成功合成出『{0}』！"}
		,'100039':{param:2, msg:"你的野地[{0},{1}]将为0级，被系统回收！"}
		,'100040':{param:2, msg:"出售道具『{0}』获得钱币 {1}！"}
		,'100041':{param:0, msg:"发送的消息中含有非法字！"}
		,'100042':{param:0, msg:"功能暂未开放，敬请期待！"}
		,'100043':{param:0, msg:"无法召回敌方的军队！"}
		,'100044':{param:0, msg:"军队正在还回的途中！"}
		,'100045':{param:0, msg:"该好友已存在！"}
		,'100046':{param:0, msg:"你的好友个数已满！"}
		,'100047':{param:0, msg:"你已向对方发出好友申请！"}
		,'100048':{param:0, msg:"对方未处理的好友申请个数已满！"}
		,'100049':{param:0, msg:"对方的好友个数已满！"}
		,'100050':{param:0, msg:"该玩家不存在！"}
		,'100051':{param:0, msg:"同联盟的玩家无法宣战！"}
		,'100052':{param:0, msg:"只有正常状态的目标玩家才能宣战！"}
		,'100053':{param:0, msg:"我方宣战队列已满，无法宣战！"}
		,'100054':{param:0, msg:"宣战成功！"}
		,'100055':{param:1, msg:"『{0}』向你宣战！"}
		,'100056':{param:0, msg:"必须驻扎携带士兵的武将才可以进行采集，请重新派遣！"}
		,'100057':{param:0, msg:"已有武将驻扎，无法派遣！"}
		,'100058':{param:0, msg:"必须驻扎携带士兵的武将才可以进行采集！"}
		,'100059':{param:0, msg:"你已发出好友请求！"}
		,'100060':{param:0, msg:"你已发的信息过长！"}
		,'100061':{param:0, msg:"只能在同国中迁城！"}
		,'100062':{param:0, msg:"需所有武将为非出征状态（派遣到自己野地的武将除外）！"}
		,'100063':{param:2, msg:"迁城成功，坐标位置[{0},{1}]！"}
		,'100064':{param:0, msg:"分城创建成功！"}
		,'100065':{param:0, msg:"分城类型没变，无需改建！"}
		,'100066':{param:4, msg:"{0}不够，需要{1}，当前拥有{2}<br/>可通过#[b:{3}:购买]获得"}
		,'100067':{param:0, msg:"君主精力不足！"}
		,'100068':{param:0, msg:"将所有建筑拆除，司徒署或司马署降为1级才可改建分城！"}
		,'100069':{param:0, msg:"司徒署或司马署降为1级才可改建分城！"}
		,'100070':{param:0, msg:"添加收藏成功！"}
		,'100071':{param:0, msg:"出征目标非法！"}
		,'100072':{param:0, msg:"出征目标不存在！"}
		,'100073':{param:0, msg:"出征目标已不是君主城池！"}
		,'100074':{param:0, msg:"目标城池还在新手保护期！"}
		,'100075':{param:0, msg:"目标城池在免战状态！"}
		,'100076':{param:0, msg:"目标城池和我方没在战争状态！"}
		,'100077':{param:0, msg:"目标是同盟城池！"}
		,'100078':{param:0, msg:"已超过当日出征其他君主城池次数！"}
		,'100079':{param:0, msg:"目标不是同盟城池！"}
		,'100080':{param:0, msg:"目标不是野地！"}
		,'100081':{param:0, msg:"目标是自己的附属野地！"}
		,'100082':{param:0, msg:"目标是盟友附属野地！"}
		,'100083':{param:0, msg:"目标不是自己的附属野地！"}
		,'100084':{param:0, msg:"我方还在新手保护期，无法宣战！"}
		,'100085':{param:0, msg:"对方还在新手保护期，无法宣战！"}
		,'100086':{param:0, msg:"我方在免战状态，无法宣战！"}
		,'100087':{param:0, msg:"对方在免战状态，无法宣战！"}
		,'100088':{param:0, msg:"对方宣战队列已满，无法宣战！"}		
		,'100089':{param:0, msg:"我方还在新手保护期，无法出征！"}		
		,'100090':{param:0, msg:"我方在免战状态，无法出征！"}		
		,'100091':{param:0, msg:"目标野地的拥有者还在新手保护期！"}
		,'100092':{param:0, msg:"目标野地的拥有者在免战状态！"}
		,'100093':{param:0, msg:"你的野地[{0},{1}]被攻陷！"}		
		,'100094':{param:0, msg:"我方出征队列已满，无法出征！"}		
		,'100095':{param:0, msg:"对方敌情队列已满，无法出征！"}		
		,'100096':{param:0, msg:"盟友受援队列已满，无法出征！"}		
		,'100097':{param:0, msg:"目标野地的拥有者敌情队列已满，无法出征！"}
		,'100098':{param:0, msg:"我方所占野地数已满，无法出征！"}
		,'100099':{param:0, msg:"目标野地不属于我方，无法出征！"}
		,'100100':{param:0, msg:"我方还在新手保护期，无法免战！"}
		,'100101':{param:2, msg:"目前有{0}，无法添加{1}！"}
		,'100102':{param:1, msg:"当前君主的『{0}』属性已达到最大值！"}
		,'100103':{param:0, msg:"距离上次退出联盟时间没到24小时！"}
		,'100104':{param:0, msg:"创建联盟需要外使院1级！"}
		,'100105':{param:0, msg:"创建联盟需要君主10级！"}
		,'100106':{param:0, msg:"你已经在联盟中，不能再创建！"}
		,'100107':{param:0, msg:"你已经在联盟中，不能加入其它联盟！"}
		,'100108':{param:0, msg:"你还处在退出联盟Buff中！"}
		,'100109':{param:0, msg:"加入联盟需要外使院1级！"}
		,'100110':{param:0, msg:"该联盟的申请人数已满！"}
		,'100111':{param:0, msg:"该联盟不存在！"}
		,'100112':{param:0, msg:"只能申请加入同国联盟！"}
		,'100113':{param:0, msg:"联盟成员已满！"}
		,'100114':{param:0, msg:"联盟正在解散中！"}
		,'100115':{param:0, msg:"你已经在该联盟申请列表中！"}
		,'100116':{param:0, msg:"该联盟不存在！"}
		,'100117':{param:0, msg:"在本国中该联盟不存在！"}
		,'100118':{param:1, msg:"升级联盟需要繁荣度{0}"}
		,'100119':{param:0, msg:"联盟解散倒计时期间不能做禅让操作！"}
		,'100120':{param:0, msg:"禅让盟主倒计时期间不能做联盟解散操作！"}
		,'100121':{param:0, msg:"先禅让盟主后，再做退盟操作！"}
		,'100122':{param:0, msg:"联盟正在升级中！"}
		,'100123':{param:0, msg:"联盟成员已满，无法邀请其他玩家！"}
		,'100124':{param:0, msg:"对方的受邀队列已满！"}
		,'100125':{param:0, msg:"该玩家已被邀请过！"}
		,'100126':{param:0, msg:"该玩家已有联盟！"}
		,'100127':{param:0, msg:"已想该玩家发出邀请！"}
		,'100128':{param:0, msg:"联盟贡献值不足！"}
		,'100129':{param:0, msg:"背包已满，整理完后再操作！"}
		,'100130':{param:0, msg:"联盟圣兽成功升级！"}
		,'100131':{param:0, msg:"联盟成员职位操作完成！"}
		,'100132':{param:0, msg:"你已将该成员开除！"}
		,'100133':{param:0, msg:"该玩家已不在申请队列中！"}
		,'100134':{param:0, msg:"该玩家不在同国中！"}
		,'100135':{param:0, msg:"该玩家还处在退出联盟Buff中！"}
		,'100136':{param:0, msg:"该玩家的外使院没到1级！"}
		,'100137':{param:0, msg:"该联盟不在邀请列表中！"}
		,'100138':{param:0, msg:"该联盟不在同国中！"}
		,'100139':{param:0, msg:"你今天开除人数已达上限！"}
		,'100140':{param:0, msg:"同联盟不能合并！"}
		,'100141':{param:0, msg:"只能合并同国联盟！"}
		,'100142':{param:0, msg:"对方联盟的合并申请列表已满！"}
		,'100143':{param:0, msg:"联盟成员总数超过最大值！"}
		,'100144':{param:0, msg:"已存在于合并申请列表中！"}
		,'100145':{param:0, msg:"不在合并申请列表中！"}
		,'100146':{param:1, msg:"{0}已不在我方联盟，请重新设置商圈！"}
		,'100147':{param:0, msg:"有的玩家已不存在，请重新设置商圈！"}
		,'100148':{param:0, msg:"开始跑商！"}
		,'100149':{param:0, msg:"市场建筑等级不够！"}
		,'100151':{param:0, msg:"选择的商圈中存在非同盟城池！"}
		,'100152':{param:0, msg:"选择的商圈中存在非法城池！"}
		,'100153':{param:0, msg:"没有选择的商圈城池！"}
		,'100154':{param:0, msg:"每天23:00至24:00不能开启跑商！"}
		,'100155':{param:1, msg:"{0}在流亡状态，请重新设置商圈！"}
		,'100156':{param:0, msg:"出征目标城池已流亡！"}
		,'100157':{param:0, msg:"今天你挑战千层塔的次数以达上限！"}
		,'100158':{param:0, msg:"今天你挑战点将台的次数以达上限！"}
		,'100159':{param:1, msg:"钱币不足 {0}！"}
		,'100160':{param:1, msg:"金币不足 {0}！"}
		,'100161':{param:1, msg:"金币和礼金不足 {0}！"}
		,'100162':{param:0, msg:"亲~今天的跑商次数已满，明天继续！"}
		,'100163':{param:1, msg:"{0} 未上榜！"}
		,'100164':{param:2, msg:"完成该任务需要收集道具<font color=yellow>{0}</font>{1}个！"}
		,'100165':{param:0, msg:"不能向自己宣战！"}
		,'100166':{param:0, msg:"不能给自己写邮件！"}
		,'100167':{param:0, msg:"城池建设度未受损，无需恢复！"}
		,'100168':{param:0, msg:"该道具已不存在！"}
		,'100169':{param:0, msg:"对方处于亡城状态，无法发送邮件！"}
		,'100170':{param:0, msg:"对方处于亡城状态，无法查看详情！"}
		,'100171':{param:0, msg:"对方处于亡城状态，无法宣战！"}
		,'100172':{param:0, msg:"对方处于亡城状态，无法出征！"}
		,'100173':{param:0, msg:"对方处于亡城状态，无法派遣！"}
		,'100174':{param:0, msg:"该位置非法或已被占用，无法用于重建！"}
		,'100175':{param:0, msg:"联盟该职位已满，无法任命！"}
		,'100176':{param:0, msg:"交易系统繁忙，请稍后再试！"}
		,'100177':{param:0, msg:"交易超时！"}
		,'100178':{param:0, msg:"交易异常！"}
		,'100179':{param:1, msg:"君主等级达到{0}级，才可以使用！"}
		,'100180':{param:1, msg:"今天购买『{0}』个数已达上限"}
		,'100181':{param:0, msg:"CDKEY暂时关闭！"}
		,'100182':{param:0, msg:"CDKEY兑换成功，请查收邮件！"}
		,'100183':{param:0, msg:"该CDKEY不存在！"}
		,'100184':{param:0, msg:"该CDKEY已被使用！"}
		,'100185':{param:0, msg:"该CDKEY已过期！"}
		,'100186':{param:0, msg:"你已兑换过该类型CDKEY！"}
		,'100187':{param:0, msg:"加入联盟后才能使用该道具！"}
		,'100188':{param:0, msg:"每天挑战BOSS达到3次才可以领奖！"}
		,'100189':{param:0, msg:"鼓舞成功！"}
		,'100190':{param:0, msg:"鼓舞失败！"}
		,'100191':{param:0, msg:"您榜上无名，无法领取排名礼包！"}
		,'100192':{param:0, msg:"您的势力榜上无名，无法领取排名BUFF！"}
		,'100193':{param:0, msg:"该奖励已领，不能重复领取！"}
		,'100194':{param:0, msg:"您的联盟贡献不足，或出价过低！"}
		,'100195':{param:0, msg:"有人已竞价，不能取消！"}
		,'100196':{param:2, msg:"{0}达到{1}级"}
		,'100197':{param:0, msg:"你的荣誉不足，无法进行购买！"}
		,'100198':{param:2, msg:"[{0}]升级啦！{1}"}
		
	}
	,comm:{
		gamename:'狂拽三国'
		,confirm:'确定'
		,close:'关闭'
		,agree:'同意'
		,refuse:'拒绝'
		,del:'删除'
		,buy:'购买'
		,buyAndUse:'购买并使用'
		,cancel:'取消'
		,king:'君主'
		,name:'名称'
		,level:'等级'
		,flevel:'{0}级'
		,flevelsomething:'{0}级{1}'
		,status:'状态'
		,msgts:'提示'
		,position:'职务'
		,recruit:'招募'
		,demob:'遣散'
		,make:'锻造'
		,have:'拥有'
		,playerid:'ID'
		,city:'城市'
		,sex:'性别'
		,see:'查看'
		,pay:'充值'
		,shop:'商城'
		,lefttime:'剩时'
		,cityfield:'城池'
		,npcfield:'NPC城池'
		,emptyfield:'平地'
		,star:'★'
		,isbind:'[已绑定]'
		,unkowncity:'未知城市'
		,sexs:['男','女']
		,alliance:'联盟'
		,perflag:'%'
		,popu:'人口'
		,food:'粮食'
		,wood:'木材'
		,stone:'石料'
		,iron:'生铁'
		,money:'钱币'
		,gold:'金币'
		,giftgold:'礼金'	
		,card:'令牌'	
		,pkg:'背包'		
		,hour:'{0}小时'
		,cooldown:'冷却:{0}'
		,armPosName:['','头盔','武器','盔甲','饰品','鞋子','武魂','坐骑']
		,armmenuops:['穿戴','脱下','修理','修复']
		,scutmenuops:['关联','解除']
		,armpos:'装备位置'
		,wearneed:'装备需求'
		,expendneed:'需要消耗'
		,rolestate:["正常","新手","免战"]
		,herostate:["<font color=#fff>空闲</font>","<font color=#ff0>出征</font>","<font color=#ff0>修炼</font>","<font color=#ff0>活动</font>","<font color=#ff0>派遣</font>","<font color=#ff0>千层塔</font>","<font color=#ff0>点将台</font>","<font color=#ff0>世界BOSS</font>"]
		,armystates:['占领行军','掠夺行军','任务行军','采集中','战斗中']
		,commress:['粮食','木材','石料','生铁']
		,hero:'武将'
		,colon:'：'
		,expend:'消耗'
		,perhour:'/时'
		,upgrade:'升级'
		,tenthousand:'万'
		,yiyi:'亿'
		,hznums : ['零','一','二','三','四','五','六','七','八','九']
		,cood_x: 'x'
		,cood_y: 'y'
		,cood:'坐标'
		,prof:'职业'
		,heroprofs:{'1':'勇士', '2':'刀将', '3':'戟将', '4':'弓将', '5':'骑将', '6':'器将'}
		,healthnames:['<font class=comm_greenfont>健康</font>','<font class=comm_yellowfont>轻伤</font>','<font class=comm_redfont>重伤</font>']
		,fulllevel:'已满级'
		,norole:'无'
		,noalli:'无'
		,noopen:'暂未开放，敬请期待'
		,numPrefix:'×'
		,prestige:'声望'
		,statehonour:'荣誉'
		,proget:'概率获得：'
		,attrs:{
			dur:'耐久度'
			,hp:'生命'
			,mp:'法力'
			,car:'携带兵力'
			,curhp:'当前生命'
			,maxhp:'最大生命'
			,curmp:'当前法力'
			,maxmp:'最大法力'
			,curca:'当前携带兵力'
			,maxca:'最大可携带力'
			,curhealth:'当前健康度'
			,maxhealth:'最大健康度'
			,curphy:'当前体力'
			,maxphy:'最大体力'
			,curexp:'当前经验'
			,nextexp:'下级需要'
		}
		,noenoughbuyitem:'{0}不够，需要{1}，当前拥有{2}<br/>可通过#[b:{3}:购买]获得'
		,noEnoughBuyMoney:'钱币不够，需要{0}，当前拥有{1}<br/>可通过#[b:{2}:购买]获得'
		,noEnoughRechargeGold:'金币不够，需要{0}，当前拥有{1}<br/>可通过#[c:充值]获得'
		,noenoughsalvebuyitem:'{0}不够，需要{1}，当前拥有{2}<br/>可以通过医馆获得，也可通过#[b:{3}:购买]获得'
		,rightmenu:['游戏帮助','关于蓝点']
		,buildstates:['', '升级中', '拆除中', '建造', '学习']
		,resname:{money:'钱币', food:'粮食', wood:'木材', stone:'石头', iron:'生铁'}
		,buildWillBeDestroy: '该建筑将被拆除'
		,countrys:['魏国', '蜀国', '吴国', '中立']
	}
	,clickplayer:{
		menus:['私聊', '加为好友', '写信', '复制名字', '详细信息']
	}
	,misc:{
		waitmiddlg:'首次资源载入中，请稍等...'
	}
	,itemTip:{
		forceLevel:'强化等级 '
		,binded:'已绑定'
		,unbind:'未绑定'
		,needLevel:'需求等级 '
		,baseAttrs:[ '武将力量 ', '武将身法 ', '武将根骨 ', '武将统率 ']
		,speedAttrs:['出征速度增加 ']
		,secAttrs:['武将攻击提升 ', '武将防御提升 ', '武将命中提升 ', '武将闪避提升 ', '武将体力提升 ']
		,skillLevelAttrs:['金系技能等级 ', '木系技能等级 ', '水系技能等级 ', '火系技能等级 ', '土系技能等级 ']
		,besetGems:'已经镶嵌宝石 {0}/3'
		,besetGemEffects:[' 武将根骨 ', ' 武将力量 ', ' 武将身法 ', ' 武将统率 ']
		,salePrice:'卖价 {0}'
		,buylimit:'今日可购买 {0} 个'
	}
	,skillTip:{
		fiveElems:['', '金系技能', '木系技能', '水系技能', '火系技能', '土系技能']
	}
	,mainface:{
		tip:{
			togglesyschat:'<div style="white-space:nowrap;">展开/收起系统消息</div>'
			,toggleplist:'<div style="white-space:nowrap;">展开/收起国家玩家列表</div>'
			,togglesmallmap:'<div style="white-space:nowrap;">展开/收起小地图</div>'
		}
	}
	,citylist:{
		maincity:'主城'
		,subcity:'分城'
		,tip:{
			maincity:'我的主城池'
			,seccity:'我的分城'
		}
		,outfield:'城外'
	}
	,createSubCity:{
		needCityLevel:'开启该分城，需要城池等级达到{0}！'
		,tip:{
			needCityLevel:'城池等级达到{0}可开启' 
			,enterCity:'进入分城'
			,createCity:'开启分城'
		}
	}
	,heroattr:{
		owner:'所属君主：{0} (ID:{1})'
	}
	,msgbox:{
		title:'消息对话框'
		,btn:{
			close:'关闭'
			,confirm:'确认'
			,cancel:'取消'
			,yes:'是'
			,no:'否'
		}
	}
	,login:{
		getdata:'登录成功，正在拉取游戏数据...'
		,needcreate:'登录成功，需要创建角色...'
	}
	,armdlg:{
		weararm:{
			title:'穿戴装备'
			,wearbtn:'穿戴'
		}
	}
	,map:{
		menus:['私聊','好友','农场','组队','宣战','掠夺','计谋','写信','详情']
		,detailmenu:'详情'
		,addfriend:'你已向 {0} 发出好友请求...'
		,tabs:['君主','武将']
		,worldmap:'[世界地图]'
	}
	,pkgdlg:{
		title:'我的包裹'
		,gold:'金币'
		,giftgold:'礼金'
		,money:'钱币'
		,buygold:'金币充值'
		,buygem:'购买宝物'
		,norepair:'当前装备不需要修理'
		,repairarm:'修理装备需要 {0} 钱币'
		,norestore:'当前装备不需要修复'
		,restorearm:'修复装备需要 {0} 金币'
		,nogold:'金币不足！现有{0}，需要{1}'
		,nomoney:'钱币不足！现有{0}，需要{1}'
		,tabs:['全部', '用品', '装备', '加速', '技能', '灵石', '收集']
		,addgrids:'增加格子'
		,menuops:['使用','批量使用','丢弃','展示']
		,tab:{
			arm:{armcnt:'装备数量'
				,armclass:'装备分类'
				,repair:'全部修理'
				,restore:'全部修复'
				,buyarm:'购买装备'
				,addgrid:'增加装备栏'
				,filters:['所有装备','头部','肩部','颈部','胸部','背部','手臂','腰部','手指','左手武器','右手武器','鞋子']}
		}
		,lbl:{
			useitems:'输入使用道具的数量'
			,dropitem:'确定要丢弃该格子中全部道具？'
			,inputbless:'输入全服祝福的话'
			,inputcood:'输入要迁移的地图坐标：<br/>当前坐标(x:{0},y:{1})<br/>可迁移范围(x:{2}-{3},y:{4}-{5})'
			,coodoutrange:'只能在本国内迁移，可迁移范围(x:{0}-{1},y:{2}-{3})'
		}
		,btn:{
			exchange:'兑换'
		}
	}
	,useitem:{
		innerpanel:{
			defaultdesc:'可以选择指定的道具使用（当前未选择）'
			,lbl:{
				useitem:'使用道具 [ 数量:1 ]'
			}
		}
		,filterdlg:{
			lbl:{
				target:'使用对象'
			}
			,title:{
				addPs:'增加君主精力'
			}
			,btn:{
				useItem:'使用'
			}
		}
		,uselistitemdlg:{
			noEnoughGold:'你的金币不足，是否需要充值？'
		}
		,targetdlg:{
			title:'使用道具'
			,use:'使用'
			,noitem:'道具数量为零，无法继续使用'
			,lefttime:'剩余时间'
			,confirmuse:'确定使用一个『{0}』道具？'
			,cannotuse:'该道具不能使用'
			,lbl:{
				seltarget:'选择道具使用对象'
			}
		}
	}
	,fight:{
		noinrange:'在可使用范围内选择对象'
		,noselobj:'必须选择具体对象'
		,noselobj1:'必须选择具体对象，请刷新重新登录！'
		,invalidobj:'不能对当前对象使用'
		,walllevel:'城墙等级：'
		,buildedunit:'已建单位：'
		,tooltip:{
			hp:'生命：'
			,mp:'法力：'
			,mstr:'兵力：'
			,allis:{self:'(己方)', friend:'(友方)', enemy:'(敌方)'}
			,noskill:'无技能'
			,noitem:'无关联道具'
		}
		,attrmenus:['攻击','技能','道具','待命','取消']
		,waitself:'出手倒计时 <font style="FONT-SIZE:16px;FONT-WEIGHT:bold;" color="#30ff30">{0}</font> 秒'
		,waitfriend:'等待友方出手中...'
		,waitenemy:'等待敌方出手中...'
		,canmove:'点击此地块可以移动武将'
		,fcancel:'撤销'
		,missatt:'未击中'
		,fround:'当前回合:{0}/{1}'
		,waitmove:'选择移动'
		,seltarget:'选择目标'
		,autofight:'自动战斗展现'
		,result:{
			needcd:'守方城防消耗：'
			,role:'君主'
			,hero:'武将'
			,level:'等级'
			,take:'携兵量'
			,lost:'损失'
			,selfget:'我方获得'
			,enemylost:'敌方损失'
		}
		,showfightdemo:'查看战斗过程'
		,fightdemo:{
			btn:{
				skip:'跳过动画'
			}
		}
		,effect:{
			miss:'未击中'
		}
	}
	,citydef:{
		cdbuilditem:'建造『{0}』'
		,cancelbuild:'取消建造'
		,downbuild:'拆除建筑'
		,tips:{
			buildunit:'此地可建造城防单位'
			,waterunit:'此地可建造护城河单位'
		}
	}
	,letter:{
		writedlg:{
			title:'写信'
			,sendbtn:'发送'
			,cancelbtn:'取消'
			,errmsgtitle:'输入错误提示'
			,errname:'输入的用户格式不正确，请重新输入！'
			,errtitle:'输入的标题长度不正确，请重新输入！'
			,errcontent:'输入的内容长度不正确，请重新输入！'
			,lbl:{
				revc:'收信人'
				,title:'主题'
				,titletip:'信件内容最多500个字'
			}
			,tip:{
				sendOk:'邮件发送成功！'
			}
		}
		,letterdlg:{
			title:'信件'
			,tabs:['未读信','系统信','收件箱']
			,status:['<b>未读</b>','已读']
			,read:'阅读'
			,confirmdel:'确定删除？'
			,sysFrom:'系统'
			,btns:{
				write:'写信'
				,selall:'全部选择'
				,unselall:'取消选择'
				,deleteall:'删除选择'
			}
			,lbl:{
				flag:'状态'
				,from:'发件人'
				,title:'主　题'
				,time:'日期'
				,op:'操作'
			}
		}
		,readdlg:{
			title:'查看邮件'
			,reply:'答复:'
			,btns:{
				prev:'上封'
				,next:'下封'
				,reply:'答复'
				,getItems:'提 取'
			}
			,lbl:{
				nosystag:'<br/><br/><div style="float:right;font-size:12px;color:#ff8030;">*此邮件非官方邮件，发布各种领奖的邮件均是骗局，请勿相信！</div>'
			}
		}
	}
	,military:{
		declaredlg:{
			title:'宣战'
		}
		,expeddlg:{
			title:'出征'
			,fastmove:'急行军'
			,supermove:'行军令'
			,autoback:'战斗完成后自动返回'
			,forceattack:'强制攻击'
			,nohero:'无武将'
			,scuttitle:'关联道具'
			,soldiertitle:'分派士兵'
			,soldiermenuops:['携带','卸下']
			,backup:'后备'
			,carrynum:'携带数量'
			,expebtn:'出征'
			,needdrill:'你必须建造『{0}』后，才可以进行出征操作！'
			,needupdrill:'你的出征军队支数已达上限，请升级『{0}』提升上限！'
			,maxexpe:'你的出征军队支数已达最大上限，请召回某支军队！'
			,nohealth:'君主的#[?:2:健康度不足]，无法出征！'
			,nofood:'粮食不足，无法出征！'
			,lbl:{
				herolist:'武将列表'
				,selhero:'选择出征武将'
				,takesolider:'携带士兵'
				,itemcut:'道具快捷'
				,arms:'武将装备'
				,takeres:'携带资源'
				,name:'名　称'
				,level:'等　级'
				,takesolider2:'率兵量'
				,phy:'体　力'
				,leftspace:'剩余空间'
				,needhealth:'消耗健康'
				,needfood:'消耗粮食'
				,needtime:'出征时间'
				,option:'行动指令'
				,expinfo:'出征信息'
				,efficiency:'行军效率'
				,target :'出发目标'
			}
			,tip:{
				fastmove:'行军时间减少20%，粮食消耗增加5倍。'
				,gemmove:'行军时间减少50%，消耗一个行军令。'
				,fattack:'不理会目标的所属和等级，强制进行攻击。'
				,imghelp:'#[H:100:说明]'
			}
		}
		,militarydlg:{
			title:'军情'
			,tabs:['个人军情','联盟军情']
			,lbl:{
				intent:'意图'
				,sourcePlayer:'君主'
				,state:'状态'
				,targetPlayer:'目的地'
				,leftTime:'剩余时间'
				,op:'操作'
				
				,attackPlayer:'攻防君主'
				,attackAlliance:'所属联盟'
				,enemyPlayer:'敌方城池'
				,alliancePlayer:'盟友城池'
			}
			,btns:{
				op:'操作'
				,see:'观战'
				,reinforce:'增援'
			}
			,intents:['NONE','讨伐','单挑','摧毁','挑衅','派遣','占领']
			,states:['前往','战斗','返回','驻守','采集']
			,playerName:'{0}({1},{2})'
		}
		,militarydlg_bak:{
			title:'军情动态'
			,tabs:['我军军情','军情警报','联盟军情']
			,lbl:{
				action:'行为'
				,role:'君主'
				,state:'状态'
				,pos:'地点'
				,lefttime:'剩余时间'
				,attrole:'攻防君主'
				,rolealli:'所属联盟'
				,enemycity:'敌方城池'
				,allicity:'联盟城池'
			}
			,actions:['掠夺','切磋','擂台']
			,states:['前往','战斗','返回']
			,opbtn:'操作'
			,seebtn:'观战'
			,fighting:'战斗中...'
		}
		,opdlg:{
			title:'查看'
			,roleName:'攻方君主'
			,fightCap:'战斗力'
			,lbl:{
				hero:'武将'
				,level:'等级'
				,health:'健康度'
				,soldier:'兵种'
				,number:'数量'
				,confirmCallBack:'确定要召回？'
				,confirmRepatriate:'确定要遣返盟军军队？'
				,arriveTime:'到达时间：'
			}
			,btn:{
				callback:'召回'
				,repatriate:'遣返'
				,enterfield:'进入'
				,strategy:'策略'
			}
		}
		,worldbossresult:{
			title:'战斗结果'
			,result:'<font color=#f0e020>您本次对BOSS造成的总伤害为</font><font color=#20ff20>{0}</font>'
		}	
		,fightresult:{
			title:'战斗结果'
			,tabs:['战斗结果','战斗过程']
			,lbl:{
				roleName:'君主'
				,level:'等级'
				,alliance:'联盟'
				,heroName:'武将'
				,soldierName:'士兵'
				,soldierNumber:'数量'
				,lostNumber:'损失'
				,reviveNumber:'恢复'
				,lostCityDefRes:'守方城防消耗：陷阱 {0}　滚木 {1}　拒马 {2}　礌石 {3}　弩箭 {4}'
				,attackGetRes:'攻方收获'
				,attackLostRes:'攻方损失'
				,targetGetRes:'守方收获'
				,targetLostRes:'守方损失'
				,exp:'经验'
				,credit:'武勋'
				,getRes:'获得资源：'
				,lostRes:'损失资源：'
				,getItems:'获得物品：'
				,no:'无'
			}
			,actions:{
				resultAttackPartyRole:'[{0}]{1}[{2}]，{3}'
				,resultAttackCopyField:'[{0}]{1}[{2}]，{3}'
				,resultAttackOwnerField:'[{0}]{1}[{2}]，{3}'
				,resultAttackTower:'[{0}]{1}[{2}]的[{3}]，{4}'
				,resultAttackAlliance:'[{0}]{1}[{2}]的援军[{3}]，{4}'
				,resultAttackField:'[{0}]{1}[{2}]，{3}'
				,resultExpedAttack:'攻打'
				,mySucc:'<font color=#20ff20>我方胜！</font>'
				,myFail:'<font color=#ff2000>我方败！</font>'
				,roundDetail:'战斗回合详情如下：<br/><br/>'
				,round:'<b><font color=#f0f000>第{0}回合</font></b><br/>'
				,myMove:'<font color=#30ff30>　我方[{0}]向敌方移动</font><br/>'
				,enemyMove:'<font color=#ff3000>　敌方[{0}]向我方移动</font><br/>'
				,myMiss:'<font color=#30ff30>　我方[{0}]攻击敌方[{1}]<b>未击中</b></font><br/>'
				,enemyMiss:'<font color=#ff3000>　敌方[{0}]攻击我方[{1}]<b>未击中</b></font><br/>'
				,myAttack:'<font color=#30ff30>　我方[{0}]攻击敌方[{1}]，敌方{2}<b>{3}</b></font><br/>'
				,enemyAttack:'<font color=#ff3000>　敌方[{0}]攻击我方[{1}]，我方{2}<b>{3}</b></font><br/>'
				,myBerserk:'<font color=#30ff30>　我方[{0}]<b>会心一击</b>敌方[{1}]，敌方{2}<b>{3}</b></font><br/>'
				,enemyBerserk:'<font color=#ff3000>　敌方[{0}]<b>会心一击</b>我方[{1}]，我方{2}<b>{3}</b></font><br/>'
				,myDie:'<font color=#ff3000>　我方[{0}]<b>死亡</b></font><br/>'
				,enemyDie:'<font color=#30ff30>　敌方[{0}]<b>死亡</b></font><br/>'
				,myAddEffect:'<font color=#30ff30>　我方[{0}]增加了[{1}]</font><br/>'
				,enemyAddEffect:'<font color=#ff3000>　敌方[{0}]增加了[{1}]</font><br/>'
				,myRemoveEffect:'<font color=#30ff30>　我方[{0}]的[{1}]消失</font><br/>'
				,enemyRemoveEffect:'<font color=#ff3000>　敌方[{0}]的[{1}]消失</font><br/>'	
				,addAttr:'增加{0}点{1}'
				,subAttr:'减少{0}点{1}'
				,addHPAttr:'{0}{1}'
				,subHPAttr:'{0}{1}'				
				,myUseToSelfEffect:'<font color=#30ff30>　我方[{0}]的[{1}]{2}</font><br/>'
				,myUseToOtherEffect:'<font color=#30ff30>　我方[{0}]施加到[{1}]的[{2}]{3}</font><br/>'
				,enemyUseToSelfEffect:'<font color=#ff3000>　敌方[{0}]的[{1}]{2}</font><br/>'
				,enemyUseToOtherEffect:'<font color=#ff3000>　敌方[{0}]施加到[{1}]的[{2}]{3}</font><br/>'
				,addHPLable:'加血'
				,subHPLable:'减血'
				,addSoldierLable:'恢复兵力'
				,subSoldierLable:'损兵'
				
				//
				,myGetHonor : '<font color=#f0f0f0>我方获得荣誉<font color=#30ff30><b>{0}</b></font>点！</font>'
				,enemyGetHonor : '<font color=#f0f0f0>对方获得荣誉<font color=#ff3000><b>{0}</b></font>点！</font>'
				
				// for test
				,attackCamp:'攻方'
				,defendCamp:'守方'
				,wallActorDetail:'[城墙] 血量:{0},最大血量:{1},防御:{2},攻击速度:{3},攻击范围:{4}<br/>'
				,heroActorDetail:'[{0}] 血量:{1},命中:{2},伤害:{3},防御:{4},闪避:{5},会心:{6},攻击速度:{7},攻击范围:{8}<br/>'
				,soldierActorDetail:'[{0}] 血量:{1},命中:{2},伤害:{3},防御:{4},闪避:{5},会心:{6},单位生命:{7},攻击速度:{8},攻击范围:{9}<br/>'
				,defActorDetail:'[{0}] 伤害:{1},单位数量:{2},攻击速度:{3},攻击范围:{4}<br/>'
			}
		}
	}
	,shop:{
		buyitem:{
			title:'购买道具'
			,paynames:['钱币','金币','礼金','声望','荣誉']
			,lessmoney:'你的{0}不够，无法进行购买！'
			,lbl:{
				item:'物品'
				,price:'价格'
				,buynum:'购买数量'
			}
			,cannotbuy:'此物品不能通过购买获得！'
		}
		,buyitemlist:{
			title:'购买列表'
		}
		,saleitem:{
			title:'出售物品'
			,lbl:{
				item:'物品'
				,price:'价格'
				,salenum:'出售数量'
				,saleprice:'出售总价'
			}
		}
		,shopdlg:{
			title:'商城'
			,btn:{
				openPkg:'我的包裹'
				,findItem:'查 找'
				,cdkey:'CDKEY兑换'
			}
			,lbl:{
				hotTag:'热门标签'
				,findItem:'查找商品'
				,yd:'<font color=#c0c000>黄钻贵族尊享金币充值<font color=#c02000 style="font-size:20px"><b>8</b></font>折优惠！</font>'
				,noyd:'<font color=#c0c000>成为黄钻贵族，金币充值<font color=#c02000 style="font-size:20px"><b>8</b></font>折优惠！</font>'
				,inputcdkey:'请输入兑换奖品CDKEY：'
			}
			,tip:{
				noFind:'在商城中没有找到该道具！'
				,validcdkey:'该CDKEY不存在！'
			}
		}
		,manageshop:{
			title:'店面管理'
			,lbl:{
				unitprice:'单价'
				,conformdown:'确定要下架该物品？'
			}
			,btn:{
				buy:'购买'
				,upitem:'上架'
				,downitem:'下架'
			}
		}
		,saleupinput:{
			title:'.'
			,inputnum:'输入上架数量'
			,inputprice:'输入单价(钱币)'
		}
		,shopslist:{
			title:'商店列表'
			,err:{
				invaildshop:'查找的商店名称不存在！'
			}
			,lbl:{
				name:'商店名'
				,sclass:'物品种类'
				,op:'操作'
			}
			,btn:{
				find:'查找'
				,see:'进入'
				,letter:'写信'
			}
		}
	}
	,task:{
		taskdlg:{
			title:'任务'
			,tabs:['活动任务', '成长任务', '君主任务', '日常任务']
			,states:['未完成', '未领取', '已完成', '不可执行', '可执行', '执行中']
			,roleps:'君主精力：{0}'
			,roleTask:'君主任务'
			,prestige:'当前声望：'
			,content:{
				name:'<font class=title>任务名称：</font>'
				,activeTime:'<font class=title>活动时间：</font>'
				,timeToTimeFmt:'{0} 至 {1}'
				,activeDesc:'<font class=title>活动简介：</font>'
				,activeTarget:'<font class=title>活动目标：</font>'
				,activeReward:'<font class=title>活动奖励：</font>'
				
				,growupDesc:'<font class=title>任务描述：</font>'
				,growupHelp:'<font class=title>任务指南：</font>'
				,growupTarget:'<font class=title>任务目标：</font>'
				,growupReward:'<font class=title>任务奖励：</font>'
				
				,taskHelp:'<font class=title>任务指南：</font>'
				,taskDifficulty:'<font class=title>任务难度：</font>'
				,taskDesc:'<font class=title>任务描述：</font>'
				,taskTarget:'<font class=title>任务目标：</font>'
				,taskPrecond:'<font class=title>任务前提：</font>'
				,taskPrecondFmt:'君主等级大于{0}级'
				,taskDetailDesc:'<font class=title>任务详情：</font>'
				,taskDDescFmt:'&nbsp;消耗君主精力：{0}<br/>&nbsp;任务时间：{1}<br/>&nbsp;冷却时间：{2}'
				,taskReward:'<font class=title>任务奖励：</font>'
				
				,doingRoleTask:'正在执行 {0} 剩余时间 {1}'
				,roleTaskCD:'冷却剩余时间 {0}'
				
				,longDuration:'长期有效'
				
				,roleTaskReward:'君主经验+{0} 一定概率出现{1}倍奖励'
			}
			,btn:{
				getReward:'领取奖励'
				,completed:'已完成'
				,useItem:'增 加'
				,doTask:'执 行'
				,speedTask:'加 速'
				,getByPrestige:'果断领之'
				,changeTask:'更换任务'
				,immediately:'立即完成'
				,getReward:'领取奖励'
								
				,seeMoreTasks:'查看更多任务'		// for taskguide		
				,getTaskReward:'领取'				// for taskguide		
				,seeTaskDetail:'详情'		 					// for taskguide		
				
				,paygold:' 充值 '
			}
			,tip:{
				changeEverydayTask:'你确定要花费10个金币更换当前日常任务？'
				,completeEverydayTask:'你确定要花费20个金币立刻完成当前日常任务？'
				,noEnoughPrestige:'你的声望不能获得任何奖励，赶紧加油做任务吧！'
			}
			,lbl:{
				mainGrowup:'主线任务'
				,subGrowup:'支线任务'
				,prestigeRewardLbl:'声望每日奖励'
				,prestigeRewardDesc:'<table><tr height=20><td><font color=#ffffff>1000 声望可领</font></td><td width=8></td><td>精力卡×1</td></tr><tr height=20><td><font color=#ffffff>5000 声望可领</font></td><td></td><td>武将经验20000</td></tr><tr height=20><td><font color=#ffffff>20000声望可领</font></td><td></td><td>精炼神石(赠)×1</td></tr></table>'
				,prestigeRewardTip:'每日只能领取一次，建议在能达到下一阶段奖励时，等达到后再领。'
				,everydayTaskLbl:'日常任务'
				,vipimm:'<font color=#ffff00>VIP{0}级立即完成</font>'
			}
		}
		,onlineTask:{
			leftTime:'<font class=comm_yellowfont>{0}</font>'
			,canGet:'<font class=comm_yellowfont>立即领取</font>'
			,tip:'保持在线，欢乐礼包拿不停！'
		}
		,onlineGoods:{
			tip:'礼包你懂的'
		}
	}
	,track:{
		tabs:['建筑','科技','招募','军情','宝物','计谋','任务']
		,tips:{
			task:'任务指引'
			,actdate:'每日活动'
			,autobuild:'自动建造队列'
			,building:'建造队列'
		}
	}
	,maintool:{
		btns:['君主','任务','联盟','武将','出征','','包裹','信件','排行','军情','商城']
		,secbtns:['城堡','农场','城防','武将','军情','排行','联盟']
	}
	,selcitytools:{
		mcity:'主城'
		,outfield:'野外'
		,mfarm:'农场'
		,mstatecity:'本国'
	}
	,help:{
		helpdlg:{
			helpid:1
			,title:'游戏帮助'
		}
		,spirit:{
			btn0:'帮助系统'
			,btn1:'游戏论坛'
			,btn2:'每日点滴'
			,btn3:'百度知道'
		}
		,helptaskdlg:{
			title:'精灵助手'
			,ops:['查看指引','跳过指引']
		}
	}
	,respanel:{
		tabs:['资源', '武将', '军队', '城防']
		,comres:{
			curnum:'当前数量: '
			,maxnum:'容量上限: '
			,maxout:'最大产量: '
			,armyexpend:'军队消耗: {0}/小时'
			,factout:'实际产量: '
			,curcanget:'当前可征收：'
			,gettip:'可到农场征收资源'
		}
		,herores:{
			see:'查看'
		}
	}
	,briefrespanel:{
		tips:{
			beyond:'<font color=red>当前{0}超出最大空间，超出部分切换城池将自动消失</font>'
			,canup:'升级城池到『{0}』'
		}
		,comres:{
			curnum:'当前数量: '
			,maxnum:'容量上限: '
			,maxout:'最大产量: '
			,factout:'实际产量: '
			,curcanget:'当前可征收：'
			,gettip:'可到农场征收资源'
			,ismaxres:'当前资源已达存储上限'
			,canget:'可收 '
		}
		,buildval:{
			name:'城池建设度'
			,curnum:'当前值: '
			,hurtnum:'受损值: '
			,nextnum:'下级所需: '
			,fulllevel:'已满级'
		}
	}
	,popupanel:{
		morale:'民心'
		,taxrate:'税率'
		,popu:'人口'
		,free:'空闲'
		,efficiency:'开工率'
		,money:'钱币'
		,output:'产量'
		,tips:{
			upmorale:'使用宝物提升民心，降低民怨'
			,mor_ind:'民心 / 民怨'
			,uppopu:'使用宝物提升人口'
			,freepopu:'空闲人口'
			,upgold:'使用宝物增加钱币税收'
			,goutput:'每小时银票的产量'
			,lcurmorale:'当前民心: '
			,lcurindig:'当前民怨: '
			,lmstate:'民心变化: '
			,states:['稳定','上升','下降']
			,lcurpopu:'当前人口: '
			,lmaxpopu:'人口上限: '
			,lworkpopu:'劳动人口: '
			,lbuildpopu:'建筑人口: '
			,lfreepopu:'空闲人口: '
			,lpstate:'人口变化: '
			,lcollect:'征税收入: '
			,lsalary:'武将俸禄: '
			,fewidlepopu:'<font color=red>人口过少，可通过升级民居增加人口</font>'
		}
	}
	,taxrate:{
		title:'调整税率'
		,popu:'人口'
		,morale:'民心'
		,taxrate:'税率'
		,output:'每小时可征收钱币:'
		,desc:'过于沉重的税收将导致民心下降，请谨慎调节税收。'
		,msginfo:'过于沉重的税收将导致民心下降，你确定税率调整为 {0}% ？'
	}
	,workerdlg:{
		title:'修改开工率'
		,lbl:{
			food:'粮食'
			,wood:'木材'
			,stone:'石头'
			,iron:'生铁'
			,outcap:'生产能力'
			,maxworker:'最大劳力'
			,workneed:'开工需要'
			,workeff:'开工率'
			,baseout:'基础产量'
			,skilladd:'科技加成'
			,armyadd:'军队加成'
			,heroadd:'武将加成'
			,gemadd:'宝物加成'
			,totalout:'总产量'
			
			,canuse:'可用劳力'
			,outeff:'生产效率'
		}
	}
	,rolepanel:{
		lbl:{
			phy:'体力'
			,health:'健康'
			,exp:'经验'
		}
		,tip:{
			icon:'打开君主面板'
		}
	}
	,friend:{
		maindlg:{
			tabs:['好友','仇人']
			,find:'查找'
			,creategroup:'建群'
			,opbtns:['农场','聊天','详情','邮件','删除']
			,dels:['你确定要将 {0} 从好友列表中删除？'
					,'你确定要将 {0} 从仇人列表中删除？'
					,'你确定要将 {0} 从群组列表中删除？']
			,resign:'你确定要辞去 {0} 群的副管理员职务？'
			,addenemy:'你确定要将 {0} 移到仇人列表中？'
			,delgroup:'你确定要将 {0} 群解散？'
			,exitgroup:'你确定要从 {0} 群中退出？'
			,agreeadd:'你是否同意 {0} 加你为好友？'
			,agreeinvite:'你是否同意加入 {0} 群中？'
			,agreeapply	:'你是否同意 {0} 加入 {1} 群中？'
			,addBtn:'添加'
			,refreshBtn:'刷新'
			,tip:{
				opDiedFriend:'对方处于亡城状态，无法此操作！'
			}
		}
		,chatdlg:{
			sendhot:'快捷键: CTRL+ENTER'
			,maxlen:'一次最多发送255个字'
			,gdesc:'[群说明]'
			,tips:{
				color:'设置颜色'
				,size:'设置字体大小'
				,face:'插入表情'
				,clear:'清空聊天内容'
			}
		}
		,finddlg:{
			title:'查找联系人/群组/武将'
			,findbtn:'查找'
			,showbtn:'查看详情'
			,addbtn:'加为好友'
			,iaddbtn:'邀请入群'
			,aaddbtn:'申请入群'
			,iteambtn:'邀请入队'
			,farmbtn:'进入农场'
			,validfind:'请输入要查找的名称或ID'
			,nofind:'没有找到'
			,contact:'联系人'
			,group:'群组'
			,hero:'武将'
			,addgroup:'你已向 {0} 群发出加入申请...'
			,invitegroup:'你已向 {0} 发出加入到 {1} 群的邀请...'
			,inviteteam:'你已向 {0} 发出组队邀请...'
			,noinviteteam:'你在队伍中并非队长，无法邀请他人入队！'
		}
		,detaildlg:{
			title:'查看详情'
			,titlesuffix:['(玩家)','(群组)','(武将)']
			,btns:['私聊','好友','宣战','掠夺','写信','申请入群','组队','农场']
		}
		,crtgroupdlg:{
			title:'新建群组'
			,inputname:'输入群名'
			,inputdesc:'输入说明'
			,maxdesc:'最多50个字'
			,confirmcreate:'你确定要新建群组？'
			,invalidname:'输入的#[?:2:群组名称]不正确，请重新输入！'
			,nomoney:'你的钱币不够，无法创建群组！'
			,types:[
				'普通群 容纳成员{0} 消耗钱币:{1}'
				,'中级群 容纳成员{0} 消耗钱币:{1}'
				,'高级群 容纳成员{0} 消耗钱币:{1}'
			]
		}
		,mgroupdlg:{
			title:'管理群组'
			,ops:['转交','任命','解雇','踢出']
			,transfer:'你确定要将 {0} 群的管理员权限移交给 {1} ？'
			,appoint:'你确定要将 {0} 任命为 {1} 群的副管理员？'
			,fire:'你确定要解雇 {0} 在 {1} 群的副管理员权限？'
			,kickout:'你确定要将 {0} 从 {1} 群中踢出？'
		}
		,applylistdlg:{
			title:'申请列表'
			,lbl:{
				name:'名称'
				,level:'等级'
				,sex:'性别'
				,cood:'坐标'
				,op:'操作'
			}
			,btn:{
				agree:'同意'
				,reject:'拒绝'
			}
		}
	}
	,sizepanel:{
		items:['小号字','中号字','大号字']
		,btnitems:['小','中','大']
	}
	,teampanel:{
		title:'队伍({0}/{1})'
		,popmenu:['私聊','好友','请离队伍','退出队伍','暂时离队','我要归队','申当队长','转让队长','写信']
		,tickout:'你确定要将 {0} 踢出队伍？'
		,exit:'你确定要将自己的武将 {0} 退出队伍？'
		,stepout:'你确定要将自己的武将 {0} 暂离队伍？'
		,applyleader:'你已向 {0} 发出当队长申请！'
		,tranleader:'你是否要将队长职务转让给 {0} ？'
		,invitemsg:'{0}的小队 邀请你加入队伍<br/><br/>队伍信息：{0}&nbsp;&nbsp;{1}级&nbsp;&nbsp;队员数:{2}/5'
		,onapplyleader:'你是否同意将队长职务转让给{0}？'
		,applyleaderfromme:'你是否同意将队长职务转让给{0}？'
		,changeleadertome:'你是否同意接受 {0}小队 的队长职务？'
	}
	,teamdlg:{
		title:'队伍面板'
		,tabs:['队伍信息','申请列表','落单武将','搜索队伍']
		,btns:{
			op1s:['建立队伍','申当队长','转让队长','请离队伍','邀请他人','暂时离队','离开队伍','加为好友','　密聊　','　写信　','我要归队']
			,op2s:['允许加入','拒绝加入','全部拒绝']
			,op3s:['搜索列表','加为好友','邀请组队']
			,op4s:['搜索列表','加为好友','申请入队']
		}
		,agreejoin:'你已同意 {0} 加入队伍中！'
		,refusejoin:'你已拒绝 {0} 加入队伍中！'
		,refuseall:'你确定要拒绝所有申请入队的武将？'
		,applyteam:'你已向 {0} 发出申请入队请求...'
		,teamnum:'队员数: {0}/5'
	}
	,chatpanel:{
		tabs:['全部','本国','联盟','私聊']
		,targetmenus:['世界','本国','联盟','私聊']
		,playername:'输入玩家名称或ID：'
		,errname:'玩家名中含有非法字符或长度不足'
		,tooFrequency:{
			world:'<font color=red>*发言太快，稍后再发</font>'
			,state:'<font color=red>*发言太快，稍后再发</font>'
			,alliance:'<font color=red>*发言太快，稍后再发</font>'
			,player:'<font color=red>*发言太快，稍后再发</font>'
		}
	}
	,itemdetail:{
	}
	,npc:{
		selnpcs:{
			title:'　　　选择NPC对话'
		}
	}
	,inbuild:{
		state:['','升级中','拆除中','<font color=#ffff00>[等待中]</font>','<font color=#ffff00>[等待中]</font>']
		,buildstate:'建造中'
		,panel:{
			btns:{
				up:'升级'
				,del:'拆除'
				,sp:'加速'
				,mg:'进入'
				,cs:'取消'
				,buildinfo:'城池动态'
				,culture:'科技研究'
				,soldier:'士兵训练'
				,recruithero:'武将招募'
				,resprotect:'资源保护'
				,herosteel:'武将修炼'
				,buyarm:'装备购买'
				,resolve:'装备分解'		
				,intensify:'装备强化'			
				,compose:'宝石合成'				
				,beset:'宝石镶嵌'
				,treat:'武将医疗'
				,citydef:'城防部署'
				,exchangeHeroExp:'兑换经验'
				,changeSubCity:'分城改建'
				,joinAlliance:'加入联盟'
				,seeReinforcement:'查看援军'
				,tradingArea:'跑商'
			}
			,tips:{
				eblock:'空地可建造'
				,undown:'『{0}』不允许拆除！'
				,undownWhenOneLevel:'『{0}』只允许拆除到1级！'
				,uptip:'<B>升级『{0}』到{1}级</B>'
				,fuptip:'<B>建造『{0}』到{1}级</B>'
				,downtip:'<B>拆除『{0}』到{1}级</B>'
				,needtitles:['建造条件','前提需要','当前拥有']
				,learntitles:['研究条件','前提需要','当前拥有']
				,recruittitles:['招募条件','前提需要','当前拥有']
				,rttitles:['返回类型','返回数量','当前拥有']
				,needtime:'原始耗时'
				,facttime:'实际耗时'
				,need:'消耗'
				,ret:'返回'
				,needcond:'建筑前提'
				,needclevel:'城池级别'
				,needitem:'消耗道具'
				,noprebuild:'{0}需求是：{1}级,当前是：{2}级，不满足条件！'
				,nopreclevel:'城池级别需求是：{0}，当前是：{1}，不满足条件！'
				,noneeditem:'{0}需要：{1}个，当前拥有：{2}个，不满足条件！'
				,noneedres:'{0}需要：{1}，当前拥有：{2}，不满足条件！'
				,maxlevel:'『{0}』已升级到最高等级{1}！'
				,curdesc:'[本级描述]'
				,nextdesc:'[下级描述]'
				,firstdesc:'[1级描述]'
				,learnuptip:'<B>升级『{0}』到{1}级</B>'
				,flearnuptip:'<B>研究『{0}』到{1}级</B>'
				,recruittip:'<B>{0}</B>'
				,disableblock:'城池达到『{0}』才能在此建造'
				,confirmDown:'确定拆除该建筑？'
				,confirmCancelUp:'确定取消当前建筑建造状态？'
			}
		}
		,sel:{
			fullbuilded:'『{0}』总数量({1})已经建满，无法继续建造！'
		}
		,buildinfo:{
			title:'城池动态'
			,listhead:['项目','状态','当前等级','目标等级','剩余时间','操作']
			,ops:['加速','取消']
		}
	}
	,soldierdlg:{
		title:'士兵训练'
		,recruitnum:'{0}'
		,lbl:{
			barbackinfo:'军营信息'
			,newsoldier:'<font class=comm_grayfont>新兵数</font> {0}/{1}'
			,totalsoldier:'<font class=comm_grayfont>总兵数</font> {0}/{1}'
			,soldieroutput:'<font class=comm_grayfont>新兵增长速度</font> {0}/小时'
			
			,soldiertype:'兵种'
			,soldiernum:'兵力'
			,soldierop:'操作'
			
			,str:'力量'
			,phy:'根骨'
			,agile:'身法'
			,mspeed:'移速'
			,attackrange:'射程'
			,aspeed:'机动'
			
			,trainingpre:'训练条件'
			,trainingneed:'训练消耗'
			,curnum:'当前数量'
			
			,food:'粮食'
			,money:'钱币'
			,newsoldiernum:'新兵'
			
			,trainingnum:'训练数量'
			
			,combinename:'{0}阶{1}'
			
			,relationshiptip:'兵种相克关系说明'
		}
		,btn:{
			training:'训练'
			,updsoldier:'进阶'
		}
		,err:{
			noNewSoldier:'新兵数量不足'
			,noMoney:'钱币数量不足'
			,noFood:'粮食不足'
			,noCapacity:'士兵总量已达到最大上限'
			,noCulture:'对应的科技『{0}』等级不够'
		}
	}
	,soldieropdlg:{
		title:'操作'
		,lbl:{
			upd:'进阶'
			,demob:'遣散'
			,arrivemaxlevel:'已达到当前科技最大兵阶，不可升阶'
			,updnum:'进阶数量'
			
			,needres:'消耗资源'
			,needmoney:'钱币 {0}'
			,needfood:'粮食 {0}'
			
			,demobnum:'遣散数量'
			,rtres:'返还资源'
			,rtmoney:'钱币 {0}'
			,rtfood:'粮食 {0}'
			
			,confrimdemob:'确定要遣散士兵？'
		}
		,btn:{
			upd:'进阶'
			,demob:'遣散'
		}
		,err:{
			noMoney:'钱币数量不足'
			,noFood:'粮食不足'
			,noSoldierForUpgrade:'没有足够的士兵供进阶'
			,noSoldierForDemob:'没有足够的士兵供遣散'
		}
	}
	,culturedlg:{
		title:'科技研究'
		,tabs:['内政','刀兵','戟兵','弓兵','骑兵','器械','策略']
		,lbl:{
			curlearn:'当前研究'
			,lefttime:'剩余时间 '
			,cancelLearn:'确定取消当前正在研究的科技？'
		}
		,btn:{
			learn:'研究'
			,speed:'加速'
			,cancel:'取消'
		}
		,tip:{
			curleveleff:'当前等级效果：'
			,nextleveleff:'下一等级效果：'
			,maxlevel:'科技最高等级：'
			,learnprecond:'研究条件：'
			,learnneed:'研究消耗：'
			,learnneedempty:'　　　　　'
			,rawneedtime:'原始耗时：'
			,needtime:'实际耗时：'
			,ismaxlevel:'已满级'
			,vipimm:'<font color=#ffff00>VIP{0}级立即完成</font>'
		}
		,err:{
			learning:'同一时刻只能研究一个科技！'
		}
	}
	,farm:{
		myfarm:'我的农场'
		,freepopu:'空闲人口'
		,blockcnt:'土地'
		,rolephy:'君主精力'
		,blockass:'土地分配'
		,whofarm:'{0} 的农场'
		,btntips:{
			opsel:'还原鼠标状态'
			,opinput:'打开种子选择面板'
			,opinit:'使土地成为空地，并补偿一定的资源'
			,opget:'用来收获资源'
			,oppre:'提前收获资源，会有一定的损失'
			,opall:'一键收获全部资源'
			,opotherget:'用来收获资源'
			,opotherall:'一键收获全部资源'
		}
		,tips:{
			empty:'种植类型未确定，请进行开工操作'
			,nextlevel:'城池等级达到『{0}』时，该地块才可用'
			,itemok:'『{0}』剩余产量/标准产量 {1}/{2}'
			,itemokex:'『{0}』剩余产量/标准产量 {1}/{2}<br/>剩余保护时间：{3}'
			,itemcontinue:'『{0}』{1} 后完工<br><div style="white-space:nowrap; padding-left:6px;">提前征收只能得到{0}：{2}({3}%)</div>'
			,otherempty:'空地无法采集'
			,othernextlevel:'空地无法采集'
			,othergreenblock:'『{0}』{1} 后完工'
			,getgreenblock:'该地块还未成熟，只能提前征收'
		}
		,selpip:{
			title:'选择种子'
			,tips:{
				usepopu:'占用人口：{0}'
				,usetime:'耗时：{0}'
				,baseout:'基础产量：{0}'
				,skilladd:'科技加成：{0}'
				,buildadd:'工坊加成：{0}'
				,roleadd:'君主加成：{0}'
				,alliadd:'联盟加成：{0}'
				,buffadd:'BUFF加成：{0}'
				,vipadd:'VIP 加成：{0}'
				,totalout:'总 产 量：{0}'
			}
		}
		,farminfo:{
			title:'农场动态'
			,getmy:'<font color=#ffffff>[{0}] 您收获了: 粮食{1} 木材{2} 石料{3} 生铁{4}</font>'
			,getother:'[{0}] <font color=#30ff30>您在\"{1}\"的农场摘取了: 粮食{2} 木材{3} 石料{4} 生铁{5}</font>'
			,otherget:'[{0}] <font color=red>\"{1}\"到您的农场摘取了: 粮食{2} 木材{3} 石料{4} 生铁{5}</font>'
		}
		,friendlist:{
			enterfarm:'农场'
		}
	}
	,strategydlg:{
		title:'锦囊妙计'
		,mycity:'我的城堡'
		,lbl:{
			havesleeve:'拥有锦囊'
			,target:'作用对象'
			,stpoint:'计谋点'
		}
	}
	,usestrategy:{
		title:'使用计谋'
		,name:'计谋名称'
		,target:'作用对象'
		,selhero:'使用武将'
		,nohero:'无武将可使用'
	}
	,strategytrack:{
		target:'对象:'
	}
	,appointherodlg:{
		title:'武将任命'
		,curname:'当前武将'
		,curpos:'当前职务'
		,newpos:'任命职务'
		,appointdescs:['辞去当前任命的职务。'
			,'任命武将为城守，可以增加城池资源产量，加快建筑和城防的建造速度。'
			,'任命武将为主将，可以加快军队的训练速度，并在敌人攻城时率军进行防守作战。未任命主将时，城守兼任主将、军师的职能。'
			,'任命武将为军师，可以加快科技的研究速度，并有机会识破敌人对城池使用的计谋。未任命军师时，城守兼任主将、军师的职能。']
		,resign:'确认要辞去武将『{0}』的 {1} 职务？'
		,transfer:'确认要将武将『{0}』的 {1} 职务转移到武将『{2}』身上?'
		,issteeling:'当前的武将在修炼中，无法任命操作。在『修炼馆』中可以查看操作！'
	}
	,herodlg:{
		title:'我的武将'
		,lbl:{
			name:'名称'
			,level:'等级'
			,state:'状态'
			,exp:'经验'
			,fightcap:'战力'
			,innerforce:'内功'
			,health:'健康'
			,morale:'士气'
			,official:'官职'
			,credit:'武勋'
			,prof:'职业'
			,command:'统率'
			,subject:'兵科'
			
			,hurt:'攻击'
			,def:'防御'
			,hitright:'命中'
			,hp:'体力'
			,escape:'闪避'
			,berserkattack:'会心'
			
			,strength:'力量'
			,agile:'身法'
			,physical:'根骨'
			,pps:'潜力'
			
			,nativestr:'力量资质'
			,nativeagile:'身法资质'
			,nativephy:'根骨资质'
			,naturefactor:'极品指数'
			
			,subjecttitle:'武将的统兵能力'
			,subjectlevel:{'3':'A', '2':'B', '1':'C', '0':'C'}
			,firehero:'确认要解雇『{0}』？<br/><font color=red>解雇后该武将将永久消失！</font>'
			,lockhero:'确认要锁定『{0}』？<br/><font color=red>解锁操作后需要7天才能生效！</font>'
			
			,curmo:'当前士气：{0}'
			,officialnum:'官职数量'
			,officialadd:'官职加成'
			,conferneed:'册封需要'
			
			,noofficial:'无'
			,getCreditDesc:'攻打野地、单挑副本将领、参加活动“点将台”都可以获得大量武勋。'
			,officialcomadd:'统率+{0}'
			,officialneed:'武勋{0} 兵符{1}'
			,congehero:'确认要免除『{0}』的官职？'
			
			,beginstr:'进行' //强化
			,strtimes:'次'
			,innerforcestr:'内功提升'
			,curinnerforce:'当前内功'
			,maxinnerforce:'内功上限'
			,strneeditem:'<font class=comm_grayfont>提升需要 赤灵丹</font>'
			,hasstritem:'<font class=comm_grayfont>当前拥有 赤灵丹</font>'
			,ifstrdesc:'<center>内功提升说明</center>1. 内功上限受脉络限制，达到上限后提升自动停止。<br/>2. 内功每增加100，下次提升需要的赤灵丹个数+1。<br/>3. 每次提升必然成功，增加的内功值随机。'
			,nextjingmaidesc:'[下级脉络]'
			,ssteeltime:'倒计时 '
			,maxifdesc:'提升内功上限至：'
			,nextprecond:'条件：武将等级 {0}<br/>　　　武将内功 {1}'
			,nextexpendmoney:'消耗：钱币 {0}'
			,nextexpenditem:'　　　{0} {1}个'
			,resultsuccstrif:'<font color="#20ff20">成功提升内功+{0}</font>'
			,resultsuccstriffull:'<font color="#f0f020">内功已达上限</font>'
			,baseskill:'基本技能'
			,tacticskill:'战略技能'
			,cursteelskillstate:'修炼信息'
			,skilldeschelp:'#[?:{0}:技能说明]'
			,skilldeschelptip:'技能说明的具体说明'
			,whichskillsteel:'{0} 修炼中'
			,noskillsteel:'空闲'
			,skillsteellefttime:'倒计时 '
			,noweartacticskill:'未装配'
			
			
			,leftskillsteeltimelbl:'剩余修炼时间：'
			,leftskillsteeltime:'{0} 小时'
			,skillsteelstate:'当前修炼状态：'
			,skilldex:'熟练度'
			,nextskill:'下级描述'
			,steelskilltip:'左键单击进行修炼'
			,insightskill:'确定要领悟技能？消耗领悟丹1粒。'
			,heronoskill:'武将60级开启技能'
			,heronojingmai:'武将12级开启经脉'
			,inputssitem:'输入修炼小时数'
			,ysspecskill:'勇士专精'
			,skilldesc:'技能说明'
			,skilldesccon:'1. 基本技能可以通过领悟或学习技能书获得。点击技能图标可进行技能修炼，修炼升级后的属性会大幅提升。<br/>2. 战略技能只能使用对应技能书学习，装配后生效。<br/>3.	勇士特有专精技能，可提升勇士对应兵种适应能力。'
			
			,learntacticskilltip:'左键单击进行学习'
			,weartacticskilltip:'左键单击可装配技能'
			,wearedtacticskilltip:'左键单击可卸下技能'
			
			,learnspecskilltip:'左键单击进行学习'
			,wearbyclick:'点击图片穿戴装备'
			
			,fmtfightcap:'战力{0}'
			,fmt2fightcap:'战力{0}'
			,fmtlevel:'{0}级'
		}
		,menu:{
			steelbaseskill:'修炼'
			,learntskill:'学习'
			,weartskill:'装配'
			,unweartskill:'卸下'
			,learnsskill:'学习'
		}
		,tabs:['信息','装备','经脉','技能','封官']
		,armTabs:['全部','头盔','武器','盔甲','饰品','鞋子','武魂','坐骑']
		,btns:{
			fire:'解雇'
			,lock:'锁定'
			,unlock:'解锁'
			,unlocking:'解锁中'
			
			,changename:'改名'
			,assignexp:'分配'
			,strengthen:'提升'
			,treatment:'医疗'
			,inspire:'鼓舞'
			,appoint:'封官'
			,advanced:'进阶'
			,autoassignpp:'自动'
			,confirmassignpp:'确定'
			,clearpp:'洗点'
			
			,strategy:'计谋'
			,endurance:'修炼'
			
			,uployal:'提升'
			,savepp:'确认'
			,uplevel:'升级'
			,upNAttr:'提升'
			
			,conge:'免除官职'
			,buyhufu:'购买虎符'
			,confer:'册封'
			
			,steeljingmai:'修炼'
			,ssteeling:'修炼中' //经脉
			
			,insightskill:'领悟'
			,learnskill:'学习'
		}
		,tips:{
			owner:'君主：{0}({1})'
			,mappos:'位置：{0}({1},{2})'
			,curexp:'当前经验：'
			,needexp:'下级需要：'
			,fulllevel:'已满级'
			,fullhealth:'该武将非常健康，无需医治'
			,fullmorale:'该武将的士气已达到最大值'
			,noppclear:'该武将没有潜力点可洗'
			,getClearPPItem:'共需要消耗{0}{1}个，你当前拥有{2}个，可通过#[b:'+FIXID.CLEARPP+':购买]获得'
			,needClearPPItem:'共需要消耗{0}{1}个，你确定要洗点？'
			,addNAttr1:'使用『资质炼化丹』后将随机增加某资质3点，是否确认使用？'
			,addNAttr2:'使用『资质炼化丹』后将会刷新武将资质，刷新后的武将资质有机会超过资质上限，是否确认使用？'
			,attr:{
				level:'<div class="itemtip">每升一级武将的基础属性都会增加，并且能得到一些潜力点</div>'
				,exp:'<div class="itemtip">武将经验达到100%即可升级</div>'
				,fc:'<div class="itemtip">武将的solo（单挑）能力值</div>'
				,iforce:'<div class="itemtip">内功值越高，武将的战斗属性增幅越强。内功同时也是武将打通经脉的前提条件。参加本国的点将台活动有概率提升内功值</div>'
				
				,health:'<div class="itemtip">健康度影响着武将基础属性的发挥，大于等于80时可发挥全部战力</div>'
				,official:'<div class="itemtip">给武将分配官职可以增加其统率</div>'
				,credit:'<div class="itemtip">武勋用于册封官职。官职越高册封需要的武勋值越多</div>'
				,prof:'<div class="itemtip">决定武将擅长带兵的种类</div>'
				,command:'<div class="itemtip">所能统率部队的士兵上限</div>'

				,hurt:'<div class="itemtip">武将的攻击力，值越大伤害越高</div>'
				,def:'<div class="itemtip">武将的防御力，值越大减伤越高</div>'
				,hitright:'<div class="itemtip">武将的命中值，值越大命中率越高</div>'
				,hp:'<div class="itemtip">武将的体力值，值越大生命值越高</div>'
				,escape:'<div class="itemtip">武将的闪避值，值越大闪避率越高</div>'
				,berserkattack:'<div class="itemtip">武将的会心值，值越大产生会心一击的概率越高</div>'

				,strength:'<div class="itemtip">影响武将的攻击力</div>'
				,agile:'<div class="itemtip">影响武将的命中、闪避和会心</div>'
				,physical:'<div class="itemtip">影响武将的防御和体力</div>'
				,pp:'<div class="itemtip">武将未分配的属性点，可以按1:1的比例任意分配给力量、身法或根骨</div>'

				,nativestr:'<div class="itemtip">影响力量对攻击力的影响效果</div>'
				,nativeagile:'<div class="itemtip">影响身法对武将的命中、闪避和会心的影响效果</div>'
				,nativephy:'<div class="itemtip">影响根骨对武将的防御和体力的影响效果</div>'
				,naturefactor:'<div class="itemtip">武将的资质评分，上限为16.5，极品指数越高的武将越值得培养</div>'
			}
			,skill:{
				baseskill:'<div class="itemtip">武将单挑战和战略战斗生效的技能</div>'
				,lockedskill:['','','<div class="itemtip">武将80级开启</div>','<div class="itemtip">武将100级开启</div>','<div class="itemtip">武将120级开启</div>','<div class="itemtip">武将140级开启</div>']
				,zhuanjingskill:'<div class="itemtip">勇士特有的专精技能，可增加其带某种士兵的兵种适应</div>'
				,zhanlueskill:'<div class="itemtip">武将战略战生效的技能，学习后点击装配即可生效</div>'
				,steelskill:'<div class="itemtip">武将修炼基本技能时的修炼时间</div>'
				,cursteelinfo:'<div class="itemtip">武将当前基本技能的修炼状态</div>'
				,noweartacticskill:'<div class="itemtip">当前未装配战略技能！可左键点击后面两个技能格进行装配。</div>'
			}
		}
		,err:{
			fire:{
				freestate:'只能解雇空闲中的武将'
				,hasarms:'请卸掉武将的装备'
				,locked:'该武将已被锁定，请先解锁！'
				,unlocking:'该武将正在解锁中，{0} 将完成解锁！'
			}
			,conge:{
				freestate:'只能免除空闲中武将的官职'
				,nosoldier:'只能免除没有带兵武将的官职'
			}
			,confer:{
				freestate:'武将需在空闲状态'
				,hasofficial:'该武将已有官职，先免除官职'
				,fullofficial:'该官职已经没有剩余'
				,noenoughitem:'册封所需的虎符道具不足'
				,noenoughcredit:'册封所需的武勋值不足'			
			}
			,strengthen:{
				freestate:'武将需在空闲状态'
				,noenoughitem:'提升内功所需的赤灵丹不足'
				,arrivemaxval:'内功值已达到上限，无法进行提升操作'
			}
			,skeleton:{
				lowherolevel:'武将等级太低'
				,noenoughif:'武将的内功值太低'
				,noenoughmoney:'所需钱币数量不够'
				,noenoughitem:'所需『{0}』数量不够'
			}
			,lock:{
				needunlocked:'需要解锁成功后，才能再次锁定'
			}
			,insight:{
				noemptygrid:'没有技能空位值供领悟！'
				,noenoughitem:'领悟丹不够，可通过#[b:'+FIXID.LINGWUDAN+':购买]获得'
			}
			,learn:{
				existskill:'学习的技能已存在！'
				,skillsteeling:'已有技能正在修炼中，无法进行学习！'
			}
			,ssteel:{
				issteeling:'已有技能正在修炼中！'
				,nosstime:'没有可用的修炼时间'
			}
			,noskill:'选择要升级的技能'
			,fulllevel:'当前技能已经满级'
			,nomoney:'钱币不足'
			,noexp:'经验不足'
			,nolevel:'需要武将等级{0}级'
			
		}
		,succ:{
			unlocking:'完成解锁操作，7天后将自动解锁！'
		}
		,changename:'当前名称：{0}<br/>新名称：2-4个汉字，消耗{1}金币'
		,nameinvalid:'名称长度不对或包含非法字符'
		,elements:['金','木','水','火','土']
	}
	,selectsteeltypedlg:{
		title:'修炼模式'
		,lbl:{
			comm:'普通模式（无增强效果）'
			,high:'加强模式（效率+100%，每小时多消耗{0}金币）'
			,desc:'高级修炼不足15分钟，返还全部金币'
		}
	}
	,steelherodlg:{
		title:'修炼'
		,highTitle:'高级修炼'
		,vip1Title:'黄金修炼'
		,vip2Title:'白金修炼'
		,lbl:{
			name:'武将'
			,level:'等级'
			,canGetExp:'可获经验'
			,needMoneyLbl:'消耗钱币'
			,needGoldLbl:'消耗金币'
			,needGold:'消耗金币：{0}'
			,needMoney:'消耗钱币：{0}'
			,inputHours:'请输入修炼时间'
			,addEfficiency:'{0}%效率'
			,needAddGold:'{0} +{1}'
			,steelDesc:'普通修炼最高等级为{0}级，最长修炼时间10小时，消耗钱币。<br/>高级修炼无等级限制，最长修炼时间24小时，消耗金币，效率有提升。'
			,speedHighSteelDesc:'你选择的武将中有{0}位等级较低，高修默认采用加强模式。该模式通过消耗金币使效率提升，你也可手动更改模式。'
		}
		,btn:{
			steel:'修炼'
			,change:'更改'
		}
	}
	,steellistdlg:{
		title:'武将修炼'
		,lbl:{
			name:'武将'
			,level:'等级'
			,state:'状态'
			,exp:'经验'
			,steeltime:'时间'
			,totalsteeltime:'修炼时间'
			,getexp:'已获经验'
			,op:'操作'
			,stopAllSteel:'确定要停止全部武将的修炼？'
			,desc:'高级修炼不足15分钟不得经验，返还全部金币'
			,commSteel:'普修'
			,highSteel:'<font class=comm_yellowfont>高修</font>'
			,vip1Steel:'<font class=comm_yellowfont>黄金</font>'
			,vip2Steel:'<font class=comm_yellowfont>白金</font>'
		}
		,btn:{
			stopsteel:'停止修炼'
			,selectAll:'全部选择'
			,unselectAll:'全部取消'
			,stopsteelAll:'全部停止'
			,steel:'修炼'
			,highsteel:'高级修炼'
			,vip1steel:'黄金修炼'
			,vip2steel:'白金修炼'
		}
		,tip:{
			emptySteelHeros:'请选择需要修炼的武将'
			,fullLevelHeros:'部分达到脉络上限的武将已被过滤'
			,arriveMaxBuildLevel:'部分达到武馆等级上限的武将已被过滤'
			,allHerosBusy:'所选武将都在非空闲状态！'
			,allFullLevelHeros:'所选武将等级已达到脉络上限！'
			,allArriveMaxBuildLevel:'所选武将等级已达武馆可修炼的上限'
			,hasNoBuild:'建造武馆后才可以修炼武将！'
		}
		,tabs:['武将修炼','武将领悟']
		
	}
	,recruitherodlg:{
		title:'武将招募'
		,curhero:'当前武将'
		,nexttime:'距离下次刷新时间'
		,refresh:'立即刷新'
		,buy:'购买'
		,recruit:'招募'
		,adept:'擅长'
		,growup:'成长'
		,subjects:['刀','戟','弓','骑','械']
		,equipoise:'均衡'
		,useitemrefresh:'使用武将刷新卡刷新武将列表吗？'
		,useitemrefreshex:'当前已出现<font color=#ffff00><b>最高极品指数</b></font>的武将，是否确定刷新？<br/>你真的确定不要这个武将？'
		,norefresh:'武将刷新卡不足，可通过#[b:'+FIXID.REFRESHCARD+':购买]获得'
		,recruithero:'确定要招募『{0}』吗？'
		,nomoney:'钱币不足'
		,level:'<font color=#b0b0b0>等　　级</font> '
		,prof:'<font color=#b0b0b0>职　　业</font> '
		,naturefactor:'<font color=#b0b0b0>极品指数</font> '
		,maxhero:'当前你拥有的武将个数已达到上限！'
		,tip:{
			heronum:'<div style="white-space:nowrap;">君主等级＜10级，武将上限=2；</div><div style="white-space:nowrap;">10级≤君主等级＜20级，武将上限=3；</div><div style="white-space:nowrap;">君主等级≥20级，武将上限=君主等级/5，余数不计</div>'
		}
		,desc:'君主等级和酒馆等级越高，刷出的武将等级上限越高。极品指数为全随机。'
		
	}
	,rankingdlg:{
		title:'排行榜'
		,tabs:['君主排行','联盟排行','千层塔排行']
		,lbl:{
			no:'名次'
			,role:'君主'
			,alli:'联盟'
			,level:'等级'
			,buildVal:'建设度'
			,op:'操作'
			,piponum:'人数'
			,alliprestige:'联盟声望'
			,allirole:'盟主'
			,go:'跳转'
			,seek:'查询名称'
			,myranking:'我的排名'
			,seebtn:'查看'
			,chatbtn:'私聊'
			,letterbtn:'写信'
			,maxTowerLayer:'记 录'
			,maxTowerTime:'时 间'
		}
		,invalidrolename:'输入的君主名含有非法字符或长度错误'
		,invalidalliname:'输入的联盟名含有非法字符或长度错误'
	}
	,alli:{
		alliposs: ['--', '成员','长老','副盟主','盟主']
		,allipostips:['--'
			, ''
			,'长老可以邀请和批准成员入盟'
			,'副盟主可以设置或罢免长老，邀请和批准成员入盟'
			,'盟主拥有联盟所有可操作权限：设置或罢免副盟主和长老，联盟升级、合并或解散，联盟圣兽升级和恩赐，联盟Q群设置与更改'
		]
		
		,nobuild:'请先建立自己的外使院，加入联盟'
		,noInAlliance:'请先加入或创建联盟'
		,main:{
			title:'联盟'
			,tabs:['联盟信息','联盟福利','联盟拍卖']
			,paimaiTabs:['全部','装备','用品','其它','我的竞价']
			,lbl:{
				alliinfo:'联盟信息'
				,allimanage:'联盟管理'
				,alliName:'联盟'
				,cityName:'国属'
				,alliFlag:'旗号'
				,level:'等级'
				,rank:'排名'
				,prestige:'声望'
				,honor:'荣誉'
				,leader:'盟主'
				,mem:'人数'
				,buildVal:'繁荣度'
				,card:'令牌'
				,qqgroup:'QQ群'
				,upgradeBar:'联盟升级'
				,transferBar:'联盟禅让'
				,dismissBar:'联盟解散'
				,introduction:'联盟简介(全服可见)'
				,bulletin:'联盟公告(盟内可见)'
				,inputQQGroup:'输入QQ群号码：'
				,inputInviteName:'输入邀请加入联盟的玩家名：'
				
				,modifyIntroduce:'修改联盟简介'
				,introduceDesc:'联盟简介最多可输入200中文字符'			
				,modifyBulletin:'修改联盟公告'
				,bulletinDesc:'联盟公告最多可输入200中文字符'	

				,worldboss:'世界BOSS掉落'
				,myContribution:'当前联盟贡献：'
				,myContributionDesc:'玩家可通过联盟贡献购买道具，亦可通过盟内拍卖道具获取贡献'
				,itemName:'物品名称'
				,itemNumber:'数量'
				,itemOwner:'所有者'
				,auctionPrice:'竞拍价'
				,fixedPrice:'一口价'
				,leftTime:'剩余时间'
				,op:'操作'
				,leftTimeNames : ['<font color=#FF000D>--</font>'
					,'<font color=#FF000D>很短</font>'
					,'<font color=#FF7F27>短</font>'
					,'<font color=#FFC90E>中</font>'
					,'<font color=#00A2E8>长</font>'
					,'<font color=#22B14C>很长</font>']
			}
			,lawLight:{
				lbl:{
					everyDayAward:'天天领奖'
					,herosexp:'武将经验池'
					,randItemGift:'随机奖励'
					,randItems:'随机道具'
					,getGiftNeedContribute:'领奖需消耗贡献值：'
					,hasContribute:'当前拥有贡献值：'
					,getGiftTip:'每日只能领取一次，零点刷新'
					,alliAttr:'联盟属性'
					,foodAdd:'粮食产量'
					,woodAdd:'木材产量'
					,stoneAdd:'石料产量'
					,ironAdd:'生铁产量'
					,moneyAdd:'钱币产量'
					,lawLight:'联盟圣兽'
					,growup:'成长值'
					,leftFeedTimes:'今日喂养剩余次数：'
					,feedNeedContribute:'喂养消耗联盟贡献：'
					,feedTip:'1、喂养联盟圣兽每次均可获得随机奖品。喂养消耗联盟贡献。<br/>2、圣兽成长值满以后全联盟会获得一次圣兽恩赐，有盟主领取，只有在线成员才能获得恩赐奖励。<br/>3、升级联盟圣兽能获得更多的每天喂养次数和更好的奖励，同时恩赐的奖励也会更丰厚。'
				}
				,btn:{
					getGift:'领取'
					,uplevel:'升级'
					,bestow:'恩赐'
					,feed:'喂养'
					,feedAll:'一键喂养'
				}
				,tip:{
					upgradeNeed:'升级需要消耗<br/><font color="{0}">联盟繁荣：{1}　当前拥有{2}</font><br/><font color="{3}">令　　牌：{4}个　当前拥有{5}个</font><br/>'
					,confirmUpgrade:'确定升级联盟圣兽？'
					,confirmBestow:'确定对当前在线的成员进行恩赐？'
				}
			}
			,btn:{
				uplevel:'升级'
				,transfer:'禅让'
				,'seeMems':'查看'
				,subscribe:'捐献'
			
				,invite:'邀请加盟'
				,agree:'批准申请'
				,events:'联盟事件'
				,merge:'联盟合并'
				,dismiss:'解散联盟'
				,undismiss:'取消解散'
				,quit:'退出联盟'
				
				,modify:'修改'
				
				,mySellBtn:'我要卖'
				
				,auctionBuy:'竞价'
				,fixedBuy:'拿下'
			}
			,tip:{
				confirmUpgradeAlli:'确定升级联盟？'
				,confirmDismissAlli:'确定要解散联盟？倒计时24小时结束后解散生效，倒计时期间可以随时取消解散。'
				,confirmUnDismissAlli:'确定要取消联盟的解散？'
				,confirmExitAlli:'确定要退出联盟吗？退出联盟后附有24小时的退盟BUFF，拥有此BUFF时不允许加入任何联盟。'
				,isMyAuctionItem:'当前道具已经是您出价最高，所以目前不能再次竞价！'
				,beyondFixedPrice:'再次竞价将超过一口价，请直接拿下！'
				,myIsSeller:'该物品的拍卖者是您自己！'
			}
		}
		,invitedlg:{
			title:'联盟邀请'
			,btn:{
				cancel:'取消'
				,invite:'邀请加入'
			}
			,lbl:{
				player:'玩家'
				,no:'排名'
				,level:'等级'
				,prestige:'声望'
				,inviter:'邀请人'
			}
			,inputname:'输入玩家'
			,invitenum:'邀请人数：{0}'
			,invalidrolename:'输入的玩家名含有非法字符或长度错误'
			,inviteme:'{0} 邀请你加入『{1}』联盟！'
		}
		,eventsdlg:{
			title:'联盟事件'
			,lbl:{
				desc:'联盟事件'
				,time:'发生时间'
			}
		}
		,createdlg:{
			title:'联盟加入/联盟创建'
			,tab_apply:'加入联盟'
			,tab_create:'创建联盟'
			,btn:{
				list:'联盟列表'
				,apply:'申请加入'
				,create:'创建联盟'
				,agree:'同意'
				,ignore:'忽略'
				,randflag:'随机'
			}
			,lbl:{
				invite:'收到的邀请'
				,apply:'申请加入'
				,applying:'申请中'
				,applydesc:'同一时间只能向本国的一个联盟发出申请，最多能收到10个联盟邀请。'
				,createdesc:'联盟名称全服唯一，3-12个字节，创建后不可修改。创建联盟需要1级外使院，君主10级，钱币30000两。<br/>旗号全服唯一，1个字符，点击“随机”，系统会推荐一个旗号。'
				,alliname:'联盟名称'
				,money:'钱币消耗'
				,no:'排名'
				,alliname:'联盟名称'
				,allilevel:'等级'
				,role:'盟主'
				,num:'人数'
				,honor:'联盟荣誉'
				,alliflag:'旗号'
			}
			,tips:{
				invalidalliflag:'输入旗号的长度错误或含有非法字符！'
				,createalliok:'联盟创建成功！'
			}
		}
		,listdlg:{
			title:'联盟列表'
			,lbl:{
				rank:'排名'
				,alliname:'联盟名称'
				,role:'盟主'
				,allilevel:'等级'
				,num:'人数'
				,honor:'联盟荣誉'
				,op:'操作'
				,searchalli:'查找联盟'
				,searchrole:'查找君主'
			}
			,btn:{
				search:'查找'
				,searchSelf:'我的排名'
				,gotoPage:'跳转'
				,join:'选择'
			}
			,tip:{
				invalidalli:'该联盟不存在！'
				,selfNoInAlli:'你还没加入联盟！'
				,invalidrole:'该玩家不存在！'
			}
		}
		,detaildlg:{
			title:'联盟详情'
			,sendapply:'你发出加入『{0}』联盟请求！'
			,btn:{
				apply:'申请加入'
				,memlist:'成员列表'
			}
			,lbl:{
				introduction:'联盟简介'
				,alliname:'联盟名'
				,level:'等级'
				,flag:'旗号'
				,role:'盟主'
				,num:'人数'
				,buildval:'繁荣'
				,specitem:'令牌'
				,honor:'荣誉'
			}
		}
		,selfmemlistdlg:{
			title:'联盟成员'
			,lbl:{
				mem:'成员'
				,pos:'职位'
				,rank:'排名'
				,level:'等级'
				,buildVal:'建设度'
				,contribute:'贡献值'
				,state:'状态'
				,op:'操作'
			}
			,btn:{
				see:'查看'
			}
			,tip:{
				noLoginDays:'{0}天未登录'
			}
		}
		,othermemlistdlg:{
			title:'联盟成员'
			,lbl:{
				mem:'成员'
				,pos:'职位'
				,rank:'排名'
				,level:'等级'
				,state:'状态'
				,cood:'坐标'
				,dis:'路程'
				,op:'操作'
			}
			,btn:{
				see:'查看'
				,declare:'宣战'
			}
		}
		,transferdlg:{
			title:'盟主禅让'
			,lbl:{
				newName:'请选择接位的副盟主：'
				,desc:'禅让后进入禅让倒计时，倒计时24小时结束后禅让生效，期间原盟主仍拥有联盟最高权限，并可随时取消禅让。'
				,dropTitle:'请选择'
			}
			,tip:{
				selectTransferTarget:'请选择要禅让的玩家名！'
				,confirmTransfer:'确定要讲盟主禅让给{0}？'
			}
		}
		,untransferdlg:{
			title:'盟主禅让'
			,lbl:{
				newname:'{0}正在接受盟主禅让'
				,lefttime:'禅让倒计时为：{0}'
			}
			,tip:{
				stopTransfer:'确定停止禅让？'
			}
		}
		,subscribedlg:{
			title:'联盟捐献'
			,tabs:['今日贡献排行', '历史贡献排行']
			,lbl:{
				myContributes:'联盟贡献值：'
				,tip:'1万资源=1点贡献+1点联盟繁荣<br/>1个令牌=100点联盟贡献'
				,curHas:'当前{0}{1}万'
				,curHasCard:'当前{0}{1}个'
				,wan:'万'
				,oneUnit:'个'
				,rank:'排名'
				,memName:'玩家名'
				,contributeRes:'捐献资源'
				,contributeCard:'捐献令牌'
			}
			,btn:{
				contribute:'捐献'
			}
		}
		,meminfodlg:{
			title:'成员信息'
			,lbl:{
				name:'君主'
				,alliance:'联盟'
				,alliPos:'职位'
				,level:'等级'
				,roleSort:'排名'
				,buildVal:'建设值'
				,contribute:'贡献值'
				,cood:'位置'
			}
			,btn:{
				appoint:'任命'
				,fire:'开除'
				,chat:'私聊'
				,mail:'邮件'
				,friend:'好友'
			}
			,tip:{
				noChangeAppoint:'职位没有改变'
				,confirmAppoint:'你确定要将{0}的联盟职位调整为{1}？'
				,confirmFire:'你确定要将{0}从联盟中开除？'
			}
		}
		,applylistdlg:{
			title:'申请列表'
			,lbl:{
				name:'君主'
				,level:'等级'
				,buildVal:'建设值'
				,op:'操作'
			}
		}
		,mergedlg:{
			title:'联盟合并'
			,lbl:{
				name:'联盟名称'
				,level:'等级'
				,leader:'盟主'
				,op:'操作'
				,applyMergeTip:'联盟合并后将保留小联盟成员的贡献值，并将小盟的繁荣度并入大盟<br/>请输入您想要合并和并入的联盟名称：'
			}
			,btn:{
				applyMerge:'发起联盟合并申请'
			}
			,tip:{
				confirmMerge:'确定要进行联盟合并？'
			}
		}
		,reinforcementdlg:{
			title:'援军'
			,lbl:{
				alliance:'所属联盟'
				,level:'联盟等级'
				,leader:'盟主'
				,flag:'旗号'
				,rank:'排名'
				,number:'援军数量'
				,armyName:'援军君主'
				,fightCap:'战斗力'
				,op:'操作'
			}
			,btn:{
				repatriate:'遣返'
				,enterAlliance:'进入联盟'
			}
		}
		,tradingareadlg:{
			title:'商圈'
			,lbl:{
				alliance:'所属联盟'
				,tradingRate:'跑商效率'
				,buildLevel:'城池市场等级'
				,teamLevel:'商队等级'
				,maxCitys:'商圈城池上限'
				,capacity:'商队运载量'
				,no:'编号'
				,cityName:'商圈城池'
				,cood:'坐标'
				,eachBuildLevel:'市场等级'
				,distance:'路程'
				,cityNumber:'商圈城池数量'
				,totaldistance:'总路程'
				,needTime:'跑商耗时'
				,todayTimes:'今日跑商次数'
				,curGain:'当前利润'
				,leftTime:'剩余时间 {0}'
				,vipMaxTimes:'<font color=#ffff00>无限次</font>'
				,noEnoughVip:'<font color=#ff3000>达到#[V:VIP{0}级]，才能连续跑商</font>'
				,confirmVipStart:'是否按照当前商圈进行连续跑商，将所剩跑商次数一次跑完？'
			}
			,tip:{
				canNotOpen:'加入联盟后，5级市场才可以跑商'
				,canTime:'每天23:00至24:00不能开启跑商'
				,confirmCancelTrading:'确定要取消正在进行的跑商？'
				,trading:'跑商'
			}
			,btn:{
				cancelTrading:'取消跑商'
				,speedTrading:'加速跑商'
				,setTradingArea:'设置商圈'
				,startTrading:'开始跑商'
				,startVipTrading:'连续跑商'
			}
		}
		,settradingareadlg:{
			title:'商圈城池选择'
			,lbl:{
				no:'编号'
				,cityName:'盟友城池'
				,cood:'坐标'
				,eachBuildLevel:'市场等级'
				,distance:'路程'
				,cityNumber:'商圈城池数量'
				,totaldistance:'总路程'
				,needTime:'跑商耗时'
				,gain:'利润'
			}
			,btn:{
				autoSel:'自动选择'
				,allCancel:'全部取消'
				,saveSel:'保存设置'
			}
			,tip:{
				desc:'提示：市场等级越高利润越高，路程越远利润越低。'
				,maxCount:'选择的商圈城池已达到上限！'
				,noSelected:'至少需要选择一个商圈城池！'
			}
		}
		,auctionbuydlg:{
			auctionTitle:'竞价'
			,fixedTitle:'一口价'
			,btn:{
				auction:'出价'
				,confirmFixed:'拿下'
			}
			,lbl:{
				tooLowPrice: '您的出价不能低于{0}'
				,buyNumber:'购买数量'
				,expendContribution:'消耗贡献'
			}
		}
		,myselldlg:{
			title:'拍卖道具'
			,tabs:['全部','装备','用品','其它']
			,lbl:{
				sellNumber:'拍卖数量'
				,auctionPrice:'起 拍 价'
				,fixedPrice:'一 口 价'
				
				,validityPeriodDesc:'拍卖时间为72小时，超过会自动下架'
				
				,curPrice:'当前价'
				,fixedPrice2:'一口价'
				
				,auctionStates:['<font color=#22B14C>等待出价</font>', '<font color=#FFF200>竞价中</font>', '<font color=#C3C3C3>拍卖超时</font>']				
			}
			,btn:{
				sellBtn:'拍卖'
			}
			,tip:{
				canNotSelectItemId:'请选择要拍卖的道具！'
				,canNotInputNumber:'输入的拍卖数量不能为0！'
				,notInputAuctionPrice:'输入的起拍价不能为0！'
				,notInputFixedPrice:'输入的一口价不能小于等于起拍价！'
			}
		}
	}
	,besetdlg:{
		title:'镶嵌对话框'
		,pkg:'背包'
		,pulldown:'确定要摘取该宝石？'
		,menu:{
			beset:'宝石镶嵌'
			,pulldown:'宝石摘取'
			,buygem:'宝石购买'
		}
		,lbl:{
			arm:'装备'
			,armname:'装备名称'
			,gemnum:'已镶嵌'
			,needmoney:'#[?:{0}:宝石镶嵌钱币消耗]'
			,needmoneytip:'各级宝石镶嵌钱币消耗：<br/>1级消耗：200<br/>2级消耗：400<br/>3级消耗：800<br/>4级消耗：1600<br/>5级消耗：3200<br/>6级消耗：6400<br/>7级消耗：12800<br/>8级消耗：25600<br/>9级消耗：51200'
			,besetinfo:'已镶嵌宝石({0}/3)'
		}
	}
	,composedlg: {
		title:'合成对话框'
		,btn:{
			compose:'合成'
		}
		,lbl:{
			target:'合成物品'
			,needmoney:'钱币消耗'
			,needphy:'体力消耗'
		}
		,err:{
			seltarget:'请选择要合成的物品'
			,nomoney:'钱币不足'
			,nophy:'君主体力不足'
			,nomaterial:'合成所需材料不足'
		}
		,menu:{
			buymitem:'材料购买'
		}
	}
	,intensifydlg: {
		title:'强化对话框'
		,err:{
			nomaterial:'强化所需材料不足'
		}
		,lbl:{
			ilevel:'强化等级'
			,intinfo:'下级({0}级)强化'
			,intlevel:'强化等级：{0}'
			,intdesc:'基础属性增加{0}%'
			,howgetitem:'#[?:{0}:获得精华]'
			,howgetitemtip:'·可以通过分解装备获得<br/>·可以通过金币购买<br/>'
		}
		,btn:{
			intensify:'强化'
		}
	}
	,resolvedlg: {
		title:'分解对话框'
		,err:{
			seltarget:'请选择要分解的物品'
			,nomoney:'钱币不足'
		}
		,btn:{
			resolve:'分解'
		}
		,lbl:{
			myhave:'当前拥有精华'
		}
	}
	,gemseldlg:{
		title:'选择宝石'
	}
	,roledlg:{
		title:'君主信息'
		,lbl:{
			name:'君主'
			,level:'等级'
			,phy:'精力'
			,health:'健康'
			,exp:'经验'
			,armforces:'兵力'
			,rsort:'排名'
			,alli:'联　盟'
			,allipos:'职位'
			,prestige:'声　望'
			,cityhonor:'荣　誉'
			,forceattr:'武力'
			,brains:'智力'
			,polityattr:'内政'
			,herosexp:'武将经验池'
			,rolepp:'潜力'
			,needpp:'潜力{0}点'
			,cityinfo:'城池信息'
			,selfsign:'个性签名'
			,friendeval:'好友评价'
			,selfsigndesc:'输入个性签名'
			,statecity:'位置'
			,position:'坐标'
			,rolestate:'状态'
			
			,avoidfight:'<font color=#30ff30>免战 {0}</font>'
			,youngstate:'<font color=#30ff30>新手 {0}</font>'
		}
		,tabs:{
			info:'资 料'
			,skill:'技 能'
			,arm:'装 备'
		}
		,btns:{
			confirm:'确定'
			,clear:'洗点'
			,assign:'分配'
			,movepopu:'转国'
			,changestate:'迁城'
			,avoidfight:'免战'
			,stopavoidfight:'解除'
			,savemodify:'保存'
			,cancelsave:'取消'
		}
		,tips:{
			changecity:'单击弹出转换国对话框'
			,cancelReset:'解除免战后可攻击其他玩家，也会收到其他玩家的攻击，确认解除免战么？'
			
			,levelattr : '<div class="itemtip">影响君主的健康值上限、精力值上限、兵力上限以及武将经验池上限</div>'
			,expattr : '<div class="itemtip">升级建筑和执行君主任务都能获得君主经验限</div>'
			,healthattr : '<div class="itemtip">君主健康可以用来君主技能，健康值每天零点后恢复至上限。君主健康随君主等级提升而增加（暂未开放）</div>'
			,phyattr : '<div class="itemtip">用来完成君主任务和采摘资源，精力每天零点后恢复至上限，也可以用行动之书恢复。君主精力随君主等级提升而增加</div>'
			,armforcesattr : '<div class="itemtip">君主可屯兵的数量上限</div>'
			,rankattr : '<div class="itemtip">君主的排名由建设度高低决定</div>'
			,prestigeattr : '<div class="itemtip">完成日常任务可以获得声望，声望可以在商城的声望商店兑换相关道具和装备，声望达到一定阶段后可以领取每日相关的声望奖励</div>'
			
			,forceattr : '<div class="itemtip">每点武力增加武将基本属性1%，提升总兵上限100</div>'
			,polityattr : '<div class="itemtip">每点内政增加资源产量1%，增加建筑建造速度2%，增加城防建造速度1%，提升武将经验池上限1000</div>'
			,ppattr : '<div class="itemtip">分配君主潜力点至不同属性，能获得不同的效果，君主每升一级获得2点潜力点</div>'
			,expsattr : '<div class="itemtip">武将经验池中的经验可以直接分配给麾下武将</div>'
			
			,roleFreeState:'<div class="itemtip">可与其他玩家正常交战</div>'
			,roleAvoidFightState:'<div class="itemtip">不可攻击其他玩家，可点击“解除”按钮解除此状态以便攻击其他玩家</div>'
			,roleAvoidFightCDState:'<div class="itemtip">可与其他玩家正常交战。冷却时间内不能再次使用免战道具</div>'
			,roleYoungState:'<div class="itemtip">您当前处于新手保护状态，不会受到其他玩家的攻击，也不能攻击其他玩家。在温床中光速发展，提升实力是当务之急。新手保护状态持续一周，城池等级达到<font style="font-size:14px;color:#00ff00"><b>村寨4级</b></font>会提前脱离此状态。</div>'
			
			,citylevel : '城池达到 {0}'
			,passtower : '千层塔闯过 {0} 层'
			,passterrace : '点将台 {0} 通关'
			,nopassterrace : '点将台未通关'
			,vip : 'VIP{0}'
			,novip : '未开通VIP'
		}
	}
	,changecitydlg:{
		title:'转换国'
		,lbl:{
			desc:'转换条件：<br>1. 没有加入联盟<br>2. 所有武将没有出征<br>3. 转换后声望降为原来的50%<br>4. 转换后荣誉降为0<br>5. 如有外派驻扎的武将最好召回，否则军队返程可能需要很长时间'
			,curcity:'当前国：'
			,canselcity:'可转国：'
			,colddown:'冷却时间：'
			,needgold:'转国消耗：'
			,gold:'金币'
			,newplayer:'新手免费'
		}
		,msg:{
			err_hasalli:'你在联盟中，无法转国'
			,err_heronofree:'有武将不在空闲状态，无法转国'
			,err_nosel:'请选择要转的目标国'
			,err_colddown:'你的转国冷却时间还没有结束，无法转国'
		}
		,btn:{
			confirm:'确定转国'
			,favorite:'收藏列表'
		}
	}
	,createroledlg:{
		btn:{
			selectIcon:'选择头像'
			,randname:'随机取名'
		}
		,lbl:{
			name:'君主'
			,city:'城市'
		}
		,err:{
			errlength:'* 必须为3-12个字节！'
			,invalidchar:'* 包含非法字符！'
			,empty:'输入君主名称'
			,checking:'正在验证中...'
			,okname:'√ 填写正确'
		}
	}
	,tracetaskdlg:{
		title:'任务指引'
	}
	,tracebuildingdlg:{
		title:'建造研究动态'
	}
	,clearroleppdlg:{
		title:'君主洗点'
		,lbl:{
			clearforce:'武力点数(可洗点:<font color=#f0f060>{0}</font>)'
			,clearpolity:'内政点数(可洗点:<font color=#f0f060>{0}</font>)'
			,needforceitem:'需要武力洗点卡:<font color=#f0f0f0>{0}</font> 拥有:{1}'
			,needpolityitem:'需要内政洗点卡:<font color=#f0f0f0>{0}</font> 拥有:{1}'
			,desc:'提示：<br/>1、每洗一点属性需要一张对应属性洗点卡。<br/>2、建筑和装备增加的属性不能洗去。'
		}
		,msg:{
			noneedclear:'无洗点操作'
		}
	}
	,roleassignexpdlg:{
		title:'经验分配'
		,lbl:{
			selhero:'选择武将'
			,heroexp:'武将经验'
			,assignexp:'经验分配'
			,exps:'经 验 池'
			,nohero:'--'
		}
		,btn:{
			upgradeneed:'升级需要'
		}
		,msg:{
			noexp:'无经验分配操作'
			,selname:'{0}(等级:{1})(经验:{2}%)'
			,maxlevel: '当前武将已达到最大等级，请打通经脉提升最大等级！'
		}
	}
	,worldmapdlg:{
		title:'世界地图'
	}
	,expeddlg:{
		title:'出征'
		,lbl:{
			target:'出征目标'
			,coordinate:'坐标'
			,expedtype:'出征方式'
			,todaybattleinfo:'今日战况'
			,helptip:'#[?:{0}:说明]'
			,helptipdesc:'每天可以免费攻击玩家10次，超过次数需要消耗出师令。'
			,fightcapcomp:'战力对比'
			,mycamp:'我方'
			,enemycamp:'敌方'
			,'todaybattlelbl':'今日战况'
			,todaybattleinfo:'攻击玩家: 讨伐{0}次、摧毁{1}次、挑衅{2}次<br/>攻打玩家野地{3}次 <br/><font color=#30ff30>(每天免费10次，超过消耗出师令)</font>'
			,paiqianplayertype:'将部队派遣至盟友城池，协助守城，可在军情中召回军队。'
			,paiqianfieldtype:'将部队派遣至自己占领的野地，协助守地和采集，可在军情中召回军队。'
			
			,taofaplayertype:'讨伐玩家城池能掠夺玩家城池的资源和钱币，但不会减少目标城池的建设度。'
			,cuihuiplayertype:'摧毁胜利后可以获取目标城池的资源、钱币和人口，并且打掉目标城池建设度。'
			,tiaoxinplayertype:'挑衅相差10级和10级以内的目标玩家，胜利后会获得士气值。'
			
			,taofaplayertypeex:'<font color=#ffff30>【跨国荣誉战】</font>讨伐玩家城池能掠夺玩家城池的资源和钱币，但不会减少目标城池的建设度。'
			,cuihuiplayertypeex:'<font color=#ffff30>【跨国荣誉战】</font>摧毁胜利后可以获取目标城池的资源、钱币和人口，并且打掉目标城池建设度。'
			,tiaoxinplayertypeex:'<font color=#ffff30>【跨国荣誉战】</font>挑衅相差10级和10级以内的目标玩家，胜利后会获得士气值。'
			
			
			,taofaplayertype_tip:'<font color=#ffff30>【荣誉战】</font><font color=#ffffff>讨伐模式，胜利后，有可能获得荣誉<font color=#ffff30>{0}</font>点</font>'
			,cuihuiplayertype_tip:'<font color=#ffff30>【荣誉战】</font><font color=#ffffff>摧毁模式，胜利后，有可能获得荣誉<font color=#ffff30>{0}</font>点</font>'
			,tiaoxinplayertype_tip:'<font color=#ffff30>【荣誉战】</font><font color=#ffffff>挑衅模式，胜利后，有可能获得荣誉<font color=#ffff30>{0}</font>点</font>'
			,countryfight_desc:'<br/><br/><div style="PADDING: 5px 5px;" class=comm_label>荣誉获得规则：<br/>1、君主等级相差少于{0}级才可以获得<br/>2、攻方每日获得的荣誉上限为50点<br/>3、守方每日可贡献荣誉上限为25点<br/>4、攻方胜利荣誉归攻方，守方胜利荣誉归守方</div>'
			
			,zhanlingfieldtype:'占领野地后可在野地中采集到资源和珠宝。'
			,winOver:'胜利后 '
			,defaultteam:'默认{0}队'
			,getOtherPlayerRes:'可以获得对方在野地采集的部分资源'
		}
		,btn:{
			selecttarget:'选择'
			,types:['讨伐','单挑','摧毁','挑衅','派遣','占领']
			,assignsoldier:'配　　兵'
			,fillsoldier:'快速补兵'
			,treatment:'快速医疗'
			,expedition:'　　'
			,defaultteam:'默认{0}队 战力{1}'
			,nosetteam:'(未设置)'
		}
		,err:{
			noLineup:'该默认小队还未设置'
			,hasBusyHero:'有武将{0}非空闲状态，无法再次布阵'
			,noTarget:'请选择出征目标'
			,noAssignHeros:'请布置出征的武将'
			,noDeclareFight:'对该城池宣战后才能出征'
			,declaringFight:'正在宣战状态中，宣战结束变为战斗状态后才能出征'
			,noHealth:'出征将领中存在重伤将领，请医疗'
			,noCarrySoldiers:'有没带兵的将领，请配兵'
		}
		,warning:{
			attackMaxTimes:'你今天攻击玩家次数已超过{0}次，本次需要消耗{1}<br/>'
		}
	}
	,selectexpedtarget:{
		title:'选择出征目标'
		,tabs:['野外势力','敌对势力']
		,lbl:{
			typename:'势力类型'
			,level:'等级'
			,taofa:'讨伐'
			,dantiao:'单挑'
			,needtime:'单程时间'
			,role:'君主'
			,cood:'坐标'
			,rolestate:'状态'
			,op:'操作'
			,fieldtype:'类型'
			,fightsucc:'成功'
			,fightnosucc:'未'
			,emenytypes:['收藏城池','仇人']
			,refstate:['正常','宣战','战争']
			,countryFight:'(跨国)'
		}
		,btn:{
			delop:'删除'
		}
		,err:{
			noSelTarget:'请选择可出征的目标'	
			,noEmptyFieldTarget:'请选择可迁往的空地'	
		}
	}
	,assignherosdlg:{
		title:'战斗部署'
		,lbl:{
			lineuppos:'阵位'
			,heroname:'武将姓名'
			,health:'状况'
			,prof:'职业'
			,level:'等级'
			,soldiertype:'统兵兵种'
			,soldiernumber:'统兵数量'
			,herostate:'状态'
			,setdefaultteam:'设为默认'
		}
		,btn:{
			autosel:'自动选择'
			,cancelall:'全部取消'
			,assignsoldier:'更改配兵'
			,setteam1:'一队'
			,setteam2:'二队'
			,setteam3:'三队'
		}
		,err:{
			fullHeros:'最多只能布置5名将领'
			,noHero:'请布置出征的武将'
			,noFreeHero:'没有空闲武将'
			,noFullHero:'只有5个武将布满，阵型才产生相应的效果'
			,noCarrySoldiers:'没有携带士兵，无法出征'
		}
	}
	,assignsoldierdlg:{
		title:'配兵'
		,lbl:{
			heroname:'武将姓名'
			,health:'状况'
			,prof:'职业'
			,level:'等级'
			,soldiertype:'统兵兵种'
			,soldiernumber:'统兵数量'
			,maxnumber:'上限'
			,herostate:'状态'
			,op:'操作'
			,freesoldiertype:'城内兵种'
			,freesoldiernumber:'空闲数量'
			,nohas:'无'
		}
		,btn:{
			clearall:'全部清空'
			,fullall:'全部补满'
			,confirmall:'全部确定'
		}
		,err:{
			noSoldierType:'请从下拉框中选择士兵的类型'
		}
	}
	,dropdesc:{
		mustget:'可获得：'
		,proget:'概率获得：'
		,credit:'武将武勋'
		,heroexp:'武将经验'
		,roleexp:'君主经验'
		,roleps:'君主精力'
		,iforce:'武将内功'
		,money:'钱币'
		,space:'　'
		,numPrefix:'×'
		,numAddPrefix:'+'
		,fourres:'四项资源'
		,idlepopu:'空闲人口'
		,giftgold:'礼金'
		,gold:'金币'
		,allicontribute:'联盟贡献'
		,prestige:'君主声望'
		,statehonour:'荣誉'
		,jibing1:'一阶戟兵'
		,xinbing:'新兵'
	}
	,armopdlg:{
		title:'装备宝石操作'
		,tabs:['装备购买','装备分解','装备强化','宝石合成','宝石镶嵌']
		,flevel:'{0}级强化'
		,buyarms:{
			lbl:{
				salelist:'购买装备'
				,mylist:'出售物品（物品出售后无法回购）'
				,saleMyItem:'确定要出售『{0}』（出售后无法回购）？<br/>出售价格：{1}'
			}
		}
		,splitarms:{
			lbl:{
				arm:'装备'
				,forceLevel:'强化等级'
				,splitInfo:'分解信息'
				,myHas:'当前拥有'
				,flevel:'{0}级强化'
			}
			,btn:{
				split:'确认分解'
			}
			,svr:{
				splitResult:'分解『{0}』成功，得到{1}个{2}<br/>'
				,returnResult:'分解强化{0}级的『{1}』，返还{2}个精炼神石<br/>'
			}
			,itemLevels:['全部','白色品质','绿色品质','蓝色品质','紫色品质','橙色品质']
		}
		,intensifyarms:{
			lbl:{
				arm:'装备'
				,forceLevel:'强化等级'
				,curSelArm:'所选装备'
				,intensifyDetailInfo:'强化详情'
				,intensifyInfo:'强化详情'
				,strength:'力量'
				,agile:'身法'
				,physical:'根骨'
				,intensifyNeed:'强化需求'
				,spec:'分解强化后的装备，会随机返还一定数量的精炼神石'
				,getMaterial:'<font color=#30ff30>材料说明</font>'
				,getMaterialHelpTip:'<div class="itemtip">每日的声望奖励、联盟圣兽喂养或商城购买都可获得精炼神石。精华可通过分解对应颜色装备获得，也可在商城用声望或金币购买。</div>'
				,forceLevelTitle:'{0}级强化'
				,forceLevelEffect:'基础属性提升{0}%'
				,fullForceLevelTitle:'强化已满级'
				,fullForceLevelEffect:'无法继续提升'
				,curHasItemNumber:'当前拥有：{0}'
				,needItemNumber:'{0}×{1}'
				,successPro:'成功率：{0}%'
			}
			,btn:{
				getMaterial:'获取材料'
				,intensify:' 强化 '
			}
			,tips:{
				noselectArm:'请选择要强化的装备！'
				,maxForceLevel:'当前装备强化等级已满级！'
				,noEnoughExpends:'当前装备强化所需的{0}不足！'
			}
			,svr:{
				intensifyResult:'『{0}』强化成功，基础属性提升{1}%'
			}
			,armPosName:['全部','头盔','武器','盔甲','饰品','鞋子']
		}
		,combineGems:{
			btn:{
				combineGem:' 合成 '
				,combineGems:' 批量 '
				,buyGem:' 购买 '
			}
			,lbl:{
				gemClass:'宝石类型'
				,combineRule:'#[?:{0}:合成规则]'
				,combineRuleTip:'合成规则详细说明'
				,gemName:'宝石名称'
				,gemNumber:'数量'
			}
			,combineLevels:[
				 '低级合成 消耗相同宝石2个，成功率25%'
				,'普通合成 消耗相同宝石3个，成功率50%'
				,'中级合成 消耗相同宝石4个，成功率75%'
				,'高级合成 消耗相同宝石5个，成功率100%<font color=#20ff20>（推荐）</font>'
				]
			,combineLevelNames:[{name:'低级合成', pro:'<font color=#ff3000>25%</font>'}
				,{name:'普通合成', pro:'<font color=#ff3000>50%</font>'}
				,{name:'中级合成', pro:'<font color=#ff3000>75%</font>'}
				,{name:'高级合成', pro:'<font color=#20ff20>100%</font>'}]
			,gemClassNames:['全部','力量宝石','身法宝石','根骨宝石','统率宝石']
			,batchCombine:'您选择的合成方式为 {0} ，将进行<b>{1}</b>次合成，单次合成成功率为{2}，确定要合成么？'
			,proCommCombine:'本次合成成功率为{0}，合成失败材料宝石将会消失，确定要合成么？'
		}
		,besetGems:{
			lbl:{
				arm:'装备名称'
				,beseted:'已镶嵌'
			}
			,btn:{
				buyGem:'宝石购买'
				,combineGem:' 升级 '
				,besetGem:' 镶嵌 '
				,removeGem:' 摘除 '
				,removeAllGems:'全部摘除'
			}
			,tip:{
				hasSameGem:'当前装备已镶嵌了同类型的宝石，不能再次镶嵌！'
			}
		}
	}
	,upgradegemdlg:{
		title:'宝石升级'
		,btn:{
			upgrade:'升级'
		}
		,lbl:{
			canDesc:'点击上方按钮进行升级'
			,needDesc:'升级需要消耗{0}颗{1}，你现在只有{2}颗'
		}
	}
	,getmlistdlg:{
		title:'宝石列表'
	}
	,field:{
		lbl:{
			emptyField:'空地'
			,xpos:'x'
			,ypos:'y'
			,invalidField:'此地块无所属国'
		}
		,gotoBar:{
			btn:{
				goHome:'本城'
				,gotoPos:'跳转'
			}
		}
		,tip:{
			goHome:'跳到我的城池位置'
			,gotoPos:'跳到指定位置'
			,roleInfo:'君主：{0}<br/>联盟：{1}<br/>位置：{2}<br/>国家：{3}<br/>'
		}
		,emptyfielddlg:{
			title:'空地'
			,lbl:{
				canbuild:'适宜营建城池的地方，可用高级迁城令迁往。'
				,cityNamePos:'{0}({1},{2})'
				,confirmTran:'你确定要将城池迁移到该位置？（将消耗一个高级迁城令）'
			}
			,btn:{
				favorite:'收藏'
				,transfer:'迁城'
			}
		}
		,rolecitydlg:{
			title:'君主：{0}'
			,lbl:{
				name:'君主'
				,alliance:'联盟'
				,fightState:'状态'
				,cityLevel:'城池'
				,roleLevel:'等　级'
				,cood:'坐　标'
				,sort:'排　名'
				,buildVal:'建设度'
				,refstate:['正常','宣战','战争']
				,selfsign:'个性签名：'
			}
			,btn:{
				empty:'　　'
				,mailTo:'邮件'
				,talkWith:'私聊'
				,enterCity:'进入'
				,dispatch:'派遣'
				,moveCity:'迁城'
				,enterFarm:'农场'
				,dispatchToAlli:'增援'
				,addFavorite:'收藏'
				,addFriend:'好友'
				,declareFight:'宣战'
				,fightTo:'进攻'
				,selfCityBtns:['　　', '　　', '　　', '　　', '进入', '农场']
				,sameAlliCityBtns:['邮件', '私聊', '增援', '收藏', '好友', '农场']
				,otherAlliCityBtns:['邮件', '私聊', '宣战', '收藏', '好友', '农场']
			}
		}
		,fielddlg:{
			title:''
			,lbl:{
				role:'君主：'
				,alliance:'联盟：'
				,desc:'{0}的单位采集量为{1}<br/>概率采集：{2}'
			}
			,btn:{
				empty:'　　'
				,noOwnerField:['收藏', '　　', '进攻']
				,selfField:['收藏', '进入', '查看']
				,alliOwnerField:['收藏', '　　', '　　']
				,otherOwnerField:['收藏', '　　', '进攻']
			}
		}
		,selffielddlg:{
			title:'我的野地'
			,lbl:{
				collectedTime:'已采集时间：'
				,canGetRes:'可　收　获：'
				,armyInfo:'{0}({1}级)　{2}({3}个)'
				,confirmGiveup:'确定放弃？'
			}
			,btn:{
				callback:'召回'
				,dispatch:'派遣'
				,start:'采集'
				,stop:'收获'
				,giveUp:'放弃'
			}
			,tip:{
				mySelfFieldBtn:'我的野地列表'
			}
		}
		,selffieldslistdlg:{
			title:'我的野地列表'
			,lbl:{
				fieldName:'野地名称'
				,heroName:'驻扎武将'
				,soldierName:'兵种'
				,soldierNum:'数量'
				,collectState:'状态'
				,op:'操作'
				,stopCollect:'停止'
				,collecting:'采集'
				,desc:'官府等级越高，可占领的野地块数越多'
			}
			,btn:{
				enter:'进入'
			}
		}
	}
	,createSubCityDlg:{
		title:'创建分城'
		,btns:{
			res:'创建封邑'
			,military:'创建军镇'
		}
		,lbl:{
			resDesc:' 　　获取赋税资源的经济领地（主民居），可以为主城提供源源不断的资源供给。如果你偏爱发展，那就选择封邑吧。'
			,militaryDesc:' 　　募兵练兵的军事领地（主军营），可以为主城提供大批训练有素的战斗人员。如果你喜欢战斗，那就选择军镇吧。'
		}	
	}
	,cityDefDlg:{
		title:'城防守备'
		,tabs:['城防建设', '城池守备', '哨塔']
		,lbl:{
			building:'建造中'
			,builded:'已建城防'
			,buildingLefttime:'剩余时间：'
			,buildingNumber:'{0}数量：'
			,defEffect:'防御效果：'
			,expend:'消耗资源：'
			,buildTime:'建造时间：'
			,capacity:'城防空间：'
			,build:'建造'
			,citydefdesc:'提示：守城战开始时，若守城武将在本城内(包括修炼武将)，则可出战，否则将无法出战'
			,towerAttr:'哨塔属性'
			,downInputNum:'输入拆除{0}数量（目前有 {1}）：<br/><font class=comm_yellowfont>拆除城防不返还任何资源</font>'
		}
		,btn:{
			speed:'加速'
			,cancel:'取消'
			,down:'拆除'
			,build:'建造'
			,changeforcetab:'更换部署'
			,assignsoldier:'配　　兵'
			,saveforcetab:'保存部署'
			,clearAll:'全部清空'
			,fillAll:'全部补满'
			,confirmAll:'全部确定'
		}
		,tip:{
			noEnoughCapacity:'城防空间不足，可通过提升城墙和角楼等级扩容'
			,noEnoughRes:'建造城防，以下资源不足：<br/>'
			,hasBuilding:'同一时刻只能建造一种城防！'
			,confirmCancel:'确定取消正在建造的城防？<br/><font class=comm_yellowfont>取消后不返还任何资源</font>！'
		}
	}
	,hospitaldlg:{
		title:'医馆'
		,lbl:{
			hurtname:'受伤武将'
			,level:'等级'
			,health:'健康度'
			,needitemnum:'需要药膏数量'
			,op:'操作'
			
			,itemnum:'药膏数量'
			,treatmentAllNeedNum:'全部医疗需要药膏数量'
		}
		,btn:{
			buy:'购买药膏'
			,treatmentAll:'全部医疗'
			,treatment:'医疗'
		}
	}
	,resprotectdlg:{
		title:'资源保护'
		,lbl:{
			storageCap:'仓库容量'
			,resProtect:'资源保护'
		}
	}
	,jitandlg:{
		title:'武将经验兑换'
		,lbl:{
			exchangeLbl:'兑换所需资源'
			,exchangeItem:'{0}千/{1}'
			,exchangeUnit:'兑换武将经验：1000 × '
			,helpTip:'小提示：4项资源各1千可兑换武将经验1千'
			,todayTimes:'今日已兑换次数：{0}/{1}'
		}
		,btn:{
			exchange:'兑换'
		}
		,tip:{
			noEnoughTimes:'今天的兑换次数已经用完！'
			,noEnoughRes:'兑换所需的资源不足！'
			,noEnoughCap:'武将经验池剩余空间不足！'
		}
	}
	,selectRoleIconDlg:{
		title:'选择头像'
	}
	,dieCitySetPos:{
		title:'<b><font color="#20ff20">城池重建</font></b>'
		,lbl:{
			desc:'你已进入亡城状态，亡城状态下不能进行任何操作。重建后会获得一个小强buff，建设度恢复速度增加5倍，祝你早日重振雄风。'
			,selPos:'请选择重建坐标'
			,pos_x:'X'
			,pos_y:'Y'
			,hasNoPos:'你回来晚了，本国已拥挤不堪！'
		}
		,btn:{
			changePos:'更换'
			,confirm:'我决定在这重新开始'
		}
	}
	,buffBar:{
		tip:{
			leftTime:'<font color="#ffff30">剩余时间 {0}</font>'
		}
	}
	,activity:{
		tower:{
			maindlg:{
				title:'千层塔'
				,dtitle:'千层塔 - 第{0}层'
				,lbl:{
					no:'第{0}名：'
					,maxLayer:'千层塔{0}层'
					,todayFreeTimes:'{0}/{1}次'
					,todayItemTimes:'{0}/1次'
					,noUseRecoverItem:'<font color=red>未使用</font>'
					,useRecoverItem:'<font color=green>已使用</font>'
					,confirmUseItem:'今日免费次数已用完，当次需要消耗1个黑木令，你确定要继续？'
					
					,activityIntr:'活动介绍'
					,expedPatternDesc:'<font class=comm_whitefont>模式：</font>策略战<br/>'
					,todayTimesDesc:'<font class=comm_whitefont>次数：</font>2次/天（免费进入）<br/>　　　1次/天（消耗[黑木令]*1）'
					,rewardDesc:'<font class=comm_whitefont>奖励：</font>丰厚武将经验、神秘套装、宝石'
					,ruleDesc:'<font class=comm_whitefont>规则：</font><br/>1、最多派出5名武将挑战<br/>2、战胜后开启下一层<br/>3、楼层越高，难度越大，奖励越好<br/>4、每天可以使用道具多挑战一次<br/>5、[闯塔多次]活动时可免费多挑战一次<br/>6、挑战每层后恢复80%兵力损失<br/>7、新手恢复100%兵力损失'
					,todayFreeTimeLbl:'今日免费参加：'
					,todayItemTimeLbl:'今日道具参加：'
					,maxLayerLbl:'最高记录：'
					,selectLayerLbl:'选层进入：'
				}
				,btn:{
					startLayers:['第1层','第41层','第81层']
					,addRevivePro:'增加回复率'
					,enterBtn:'进入'
				}
				,tip:{
					itemused:'已使用，无法再次使用！'
					,cannotSkip:'亲，不要捉急，请先通过前置楼层吧~'
					,roleLevelNotArrived:'君主等级达到{0}级才可参加千层塔'
				}
			}
			,expeddlg:{
				title:'千层塔'
				
				,fightResults : ['惜败', '小败', '失败', '大败', '完败',  '险胜',  '小胜', '胜利',  '大胜',  '完胜']
				,noItem : '无'
				,leftTime : '冷却时间：{0}'
				,tip:{
					lastLayerInfo:'{0}层：{1}　参战武将获得基础经验：{2}　获得道具：{3}'
					,layerDropTip:'第{0}层掉落：'
					,confirmExit:'你确定要退出本次千层塔挑战？'
					,inputAutoFightMaxLayer:'设置自动挑战到的层'
					,autoFightLessLayer:'设置自动挑战的层数必须大于等于当前层'
					
					,noLifeSysTip:'本次挑战次数已耗尽'
					,noLifeMsgTip:'本次挑战次数已耗尽，点击确定返回主界面！'					
					,passLayerSysTip:'千层塔已通过'
					,passLayerMsgTip:'千层塔已通过，点击确定返回主界面！'
					
					,autoFightBtnTip:'通过10层以后可以开启自动挑战'
				}
				,btn:{
					autoFight:'自动挑战'
					,cancelAutoFight:'取消自动'
					,changeForce:'更 换'
					,assignSoldier:'配 兵'
					,treatment:'医 疗'
					,showGetGifts:'本次获得奖励'
					,addRevivePro:'增加回复率'
					,exit:'退出'
				}
				,lbl:{
					fightCap:'战斗力'
					,leftLifes:'挑战机会'
					,enemyLbl:'守方部署'
				}
			}
			,skipLayerDlg:{
				title:'跳层询问'
				,desc:'前面楼层掉落的装备、宝石都不需要了么？给我好处可以帮你获得前面楼层的全部奖励哦~'
				,btn:{
					need:'必须需要'
					,noNeed:'不需要'
				}
			}
			,gainSkipLayerGift:{
				title:'跳层补领'
				,desc:'你当前通过的最高楼层为{0}层。<br/>补领1-{1}层奖励需要{2}金币，是否需要确认补领全部奖励？'
				,vip:'<font color=#ffff00>(你已拥有VIP条层特权)</font>'
				,tip:{
					noEnoughGold:'你的金币不足！'
				}
			}
			,lastGetGiftsDlg:{
				title:'本次获得奖励'
			}
		}
		,terrace:{
			maindlg:{
				title:'点将台'
				,lbl:{
					todayFreeTimes:'免费：{0}/{1}次'
					,todayItemTimes:'道具：{0}/1次'
					,confirmUseItem:'今日免费次数已用完，当次需要消耗1个黑木令，你确定要继续？'
					,descHead:'活动介绍'
					,fightType:'<font class=comm_grayfont>模式：</font>单挑战'
					,todayTimeLbl:'<font class=comm_grayfont>次数：</font>'
					,rule:'<font class=comm_grayfont>规则：</font><br/>1、派出一名武将参战<br/>2、通过前一关开启或继续下一关<br/>3、通过战役所有关卡开启下一战役<br/>4、击败各战役首领武将内功会增加'
					,gateNo:'关卡'
					,gateHeroName:'守关武将'
					,gateHeroSFC:'单挑力'
				}
				,tip:{
					roleLevelNotArrived:'君主等级达到{0}级才可参加点将台'
				}
			}
			,expeddlg:{
				title:'点将台'
				,giftLabel:'挑战奖励：'
				,position:'地点：'
				,gateNos:['','第一关','第二关','第三关','第四关','第五关','第六关','第七关','第八关','第九关']
				,results:['未通过', '★', '★★', '★★★', '★★★★', '★★★★★']
				,myHeroDropTitle:'请选择'
				,noLifeSysTip:'本次挑战次数已耗尽'
				,noLifeMsgTip:'本次挑战次数已耗尽，点击确定返回主界面！'
				,passGateSysTip:'本关卡已通过'
				,passGateMsgTip:'本关卡已通过，点击确定返回主界面！'
				,confirmExit:'你确定要退出本次点将台挑战？'
				,inputAutoFightMaxSubGateId:'设置自动挑战到的子关卡'
				,autoFightLessSubGateId:'设置自动挑战的关卡必须大于等于当前关卡'
				,leftTime : '冷却时间：{0}'
				,item_heroName:'守关武将：'
				,item_heroSFC:'单挑力：'
				,item_estimate:'评价：'
				,heroName:'武　将'
				,heroHealth:'健康度'
				,heroCredit:'武勋值'
				,heroSFC:'单挑力'
				,strBar:'力量'
				,agileBar:'身法'
				,phyBar:'根骨'
				,leftLifes:'挑战机会'
				,btn:{
					fight:'出　　战'
					,treatment:'医疗'
					,exit:'退出'
				}
			}
		}
	}
	,activityValDlg:{
		title:'每日活动'
		,lbl:{
			noFinishTaskTitle:'未完成项目({0}个)'
			,finishTaskTitle:'已完成项目({0}个)'
			,stars:['', '★', '★★', '★★★', '★★★★', '★★★★★']
			,activityValDesc:'活跃度≥{0}'
			,signinDays:'您已签到{0}天'
			,signinDesc:'签到{0}天奖励'
			,signinItemDays:'<font color="{0}">{1}</font>/<font color="green">{2}</font>'
			,todayActValLbl:'今日活跃度：'
			,mail:'邮件：'
			,roleps:'精力：'
			,getActRewardLbl:'活跃度抽奖'
			,signInLbl:'每日签到'
			,todaySvrAct:'今日活动'
		}
		,btn:{
			getActReward:'抽取奖励'
			,activityValNoEnough:'活跃值未达到'
			,gotActReward:'已抽取奖励'			
			,canSignIn:'我要签到'
			,signInOk:'今日已签'
			,signInFull:'本月已满'
			,signGet:'领取'
			,signGot:'已领'
		}
		,tip:{
		}
	}
	,exchangedlg:{
		title:'兑换'
		,tabs:['道具', '装备']
		,needNumber:'({0}/{1})'
		,exchangeList:'兑换列表'
		,canExchangeCnt:'可兑换数量'
		,exchangeBtn:'兑 换'
	}
	,yellowdiamondDlg:{
		tip:{
			openYellow:'开通黄钻后，才可领取'
			,openYearYellow:'开通年费黄钻后，才可领取'
			,levelYellow:'黄钻达到{0}级，才可领取'
			,seeyd:'查看黄钻特权'
		}
	}
	,bluediamondDlg:{
		tip:{
			openBlue:'开通蓝钻后，才可领取'
			,levelBlue:'蓝钻达到{0}级，才可领取'
			,openYearBlue:'开通年费蓝钻后，才可领取'
			,openHighBlue:'开通超级蓝钻后，才可领取'
			,seebd:'查看蓝钻特权'
			,seebd2:'<div class=itemtip>蓝钻贵族<br/>您已是蓝钻贵族应享受一下特权：<br/>1、每日特权礼包<br/>2、蓝钻年费每日将额外领取超级奖励<br/>3、蓝钻超级新人礼包<br/>4、蓝钻升级礼包<br/>5、商城所有道具8折优惠</div>'
			,see3366:'3366成长等级：LV{0}'
		}
	}
	,buyGoldDlg:{
		title:'充 值'
		,btn:{
			buy:'充 值'
			,see:'查看详情'
		}
		,tip:{
			firstpay:'<font color=#c0c000>用户首次进行充值，不论多少，均可获得价值<br/><font color=#c02000 style="font-size:20px"><b>888</b></font>金币的首充大礼包！</font>'
			,firstpay_libao:'<div class=itemtip><font color=#ffff20>用户首次进行充值，不论多少，均可获得价值<font color=#f02000><b>888</b></font>金币的首充大礼包！</font></div>'
		}
	}
	,smbtn:{
		shop:'商城'
		,rank:'排行'
		,mail:'邮件'
		,exchange:'兑换'
		,sound:'播放或禁止背景音乐'
		,friend:'好友'
		,set:'设置'
	}
	,payActDlg:{
		title:'充值活动'
		,tip:{
			//payact_libao:'<div class=itemtip><font color=#ffff20>最超值的充值活动，返利超过<font color=#f02000><b>100%！！</b></font>错过后悔一辈子！</font></div>'
			payact_libao:'<div class=itemtip><font color=#ffff20>稀有装备震撼来袭！</font></div>'
			,returnRule:'<font color=#ffff20>活动结束后，以邮件方式发放</font>'
		}
		,lbl:{
			payActTime:'<font class=comm_yellowfont>活动时间：</font><br/>　{0} 至<br/>　{1}'
			,leftTime:'活动剩余时间：{0}'
			,nextLevelPayGold:'（再充<font color=#30ff30>{0}</font>金币即可获得<b>{1}</b>）'
			,nextLevelGift:'{0}级充值礼包'
			,actDesc:'<font class=comm_yellowfont>活动说明：</font><br/>　活动期间充值金币，达到一定数量即可获得一定奖励，最高可获得总额150%的礼金返利！'
			,returnRule: '返利规则'
		}
	}
	,autobuilddlg:{
		title:'自动建造队列'
		,types:[
			'显示全部'
			,'主城'
			,'1号分城'
			,'2号分城'
			,'3号分城'
			,'4号分城'
		]
		,btn:{
			start:'开始自动建造'
			,starting:'自动建造中...'
			,confirm:'确定'
			,add:'添加'
			,remove:'移除'
		}
		,lbl:{
			buildname:'{0}({1}级)'
			,cityType:'建造列表'
			,waitList:'等待列表'
			,no:'序号'
			,name:'名称'
			,op:'操作'
			,noEnoughVip:'<font color=#ff3000>达到#[V:VIP3级]，才能开启自动建造</font>'
			,canBuildList:'仅显示可升级的建筑'
		}
		,tip:{
			fullAutoQueue:'自动建造队列已满！'
		}
	}
	,vipdlg:{
		title:'VIP特权'
		,steelNames:['', '黄金', '白金']
		,itemName:'礼包{0}'
		,progDesc:'再充值{0}金币，您将成为VIP{1}'
		,maxProgDesc:'您已经成为VIP{0}'
		,viptip:'查看VIP特权'
	}
	,newcomerHelp:{
		toggleTip:'最大/小化新手指引面板'
		,imgLink:'#[H:{0}:动画演示]'
		,btn:{
			seeAllHelp:'查看全部指引'
			,everydayTip:'换一条'
		}
		,lbl:{
			everydayTip:'每日提示：'
		}
		,txt:{
			jibing:'戟兵'
		}
		,tip:{
			getTaskAward:'领取任务奖励'
			,buildJiuGuan:'点击建筑酒馆'
			,learnZhongZhiShu:'研究种植术'
			,getAllFarmRes:'点击全部征收'
			,speed:'点击加速'
			,enterMainCity:'进入主城配兵'
			,enterMainCityExped:'进入主城出征'
			,clickPeibingBtn:'点击配兵'
			,selectSoldierType:'点击选择戟兵'
			,inputSoldierNumber:'输入{0}个戟兵'
			,confirmAssignSoldier:'点击完成配兵'
			,selInitFarmBlock:'选择犁地'
			,initFarmBlock:'犁锄某一地块'
			,seedFarmBlock:'点击地块播种'
			,selOnePip:'选择种子'
			,selPipBlock:'选择播种'
			,clickExpedBtn:'点击出征按钮'
			,selExpedTarget:'选择出征目标'
			,selCopyFieldTab:'选择野外势力'
			,selFirstCopyType:'选择初级势力'
			,selCopyFields:['选择一伙暴民', '选择愤怒暴民']
			,confirmSelCopyField:'点击确定'
			,setExpedHerosForce:'配置出征武将'
			,autoAssignHero:'自动布置武将'
			,confirmAssignHero:'确定布置武将'
			,confirmExped:'点击出征'
			,seeMilitary:'点击查看军情'
			,buildJunYing:'点击建筑军营'
			,enterMainCity2:'进入主城'
			,selCurPage:'进入此页'
			,learnJiBingCulture:'研究戟兵训练'
			,clickLearnCulture:'点击科技研究'
			,selJiBing:'选择戟兵'
			,input20JiBing:'输入20个戟兵'
			,confirmRecruitSoldier:'点击训练'
			,refreshHeros:'刷新武将'
			,enterPkg:'打开包裹'
			,useItem:'点击选择使用'
			,welcome:' <font color=#30ff40>欢迎进入<font color=#ffff30>『狂拽三国』</font></font>'
			,changeBrowser:' <font color=#30ff40>如果游戏比较卡，请切换到浏览器的极速模式或升级浏览器！</font>'
			,spiritBtn:'帮助指引'
			,seeFightDemo:'查看战斗演示'
			,changeCity:'点击弹出转换国对话框（新手保护期免费转国）'
			,upgradeCity:'升级城池'
			,openSubCity:'开启分城'
			,peibing:'武将配兵'
			,upguanfu:'升级官府'
			,upshuyuan:'升级书院'
			,fightoutfield:'进入野地<br/>选择【一级野地】进行单挑！'
			,acttowerfight:'<font class="comm_font12 comm_lineh14">挑战千层塔，装备宝石等你拿！</font>'
			,firstOpenShop:'此处打开商城面板'
			,firstOpenExchange:'此处打开兑换面板'
			,firstOpenLetter:'此处打开邮件面板'
			,firstOpenRank:'此处打开排行面板'
			,firstOpenVip:'此处打开VIP面板'
			,firstOpenPay:'此处打开充值面板'
			,firstOpenMyField:'此处打开我的野地列表'
		}
	}	
	,blue3366DiamondDlg:{
		getBtn:'领取今日礼包'
		,gotoBtn:'马上去升级'
		,lvl:'LV{0}-LV{1}'
		,maxlvl:'LV{0}以上'
		,getLbl:'可领取：'
		,curLevel:'您的3366成长等级是<font color=#f08010>LV{0}</font>，等级越高礼包越丰厚！'
		,goto3366Tip:'升级3366成长等级才可以领取！'
		,buyGold:'购买金币'
	}
	,worldboss:{
		maindlg:{
			title:'世界BOSS'
			,lbl:{
				event:'<font color=#ffff00>{0}</font>奋力挑战[麒麟]，对其造成了<font color=#ffff00>{1}</font>伤害，{2}'
				,todaytimes:'今日剩余挑战次数：{0}'
				,guwuLevel:'鼓舞等级'
				,addForcePer:'攻击力增加'
				,guwuDesc:'鼓舞等级越高，可获得的每日奖励越好。'
				,persongiftlbl:'查看排行奖励'
				,rankdesc: '1、请在每日24点前进行挑战，战斗恢复率100%<br/>2、排行记录每次挑战中所造成的一击最大伤害之和<br/>3、每日0时20分发放前一天的排名奖励，24时截至。个人及势力奖励在右上角的伤害排名奖励内领取，联盟排行掉落的物品会直接进入联盟拍卖行，通过联盟拍卖获得。'
				,guwugiftlbl: '查看鼓舞规则'
			}
			,tip:{
				guwuTimes:'确定要连续鼓舞{0}次吗？每次消耗40{1}，每次成功率为{2}%。'
				,guwugift:'<div class=itemtip3><b><font color=#ffff00>1、鼓舞的等级越高，部队伤害越高</font></b><br/><b><font color=#ffff00>2、鼓舞达到一定等级，每日奖励会更丰厚</font></b><br/><font color=#20ff20>鼓舞等级达到1级，</font>可获得绿色士气礼包（开启后必定获得铜钡*2，1级技能修炼卡*2，大喇叭*1，赤灵丹*2，精炼神石*2）<br/><font color=#20ff20>鼓舞等级达到3级，</font>可获得蓝色士气礼包（开启后必定获得铜钡*2，1级技能修炼卡*6，大喇叭*1，赤灵丹*4，精炼神石*4，武将经验卡*10）<br/><font color=#20ff20>鼓舞等级达到7级，</font>可获得紫色士气礼包（开启后必定获得铜钡*2，1级技能修炼卡*10，大喇叭*2，赤灵丹*6，精炼神石*6，武将经验卡*30，精力卡*2）<br/><font color=#20ff20>鼓舞等级达到10级，</font>可获得橙色士气礼包（开启后必定获得铜钡*2，1级技能修炼卡*15，大喇叭*2，赤灵丹*10，精炼神石*10，武将经验卡*50，精力卡*5）<br/><b><font color=#ffff00>3、鼓舞状态保留至当天24:00:00</font></b></div>'
				,persongift:'<div class=itemtip3><b><font color=#ffff00>个人伤害排名：</font></b><br/><font color=#20ff20>第1名</font>    天机丹*5 武将经验卡*50 精炼神石*20 大喇叭*5<br/><font color=#20ff20>第2名</font>    天机丹*4 武将经验卡*40 精炼神石*16 大喇叭*4<br/><font color=#20ff20>第3名</font>    天机丹*3 武将经验卡*30 精炼神石*12 大喇叭*3<br/><font color=#20ff20>第4名</font>    天机丹*2 武将经验卡*20 精炼神石*8 大喇叭*2<br/><font color=#20ff20>第5名</font>    天机丹*1 武将经验卡*10 精炼神石*4 大喇叭*1<br/><font color=#20ff20>第6~10名</font>    天机丹*1 武将经验卡*8 精炼神石*2 <br/><font color=#20ff20>第11~20名</font>    天机丹*1 武将经验卡*5 精炼神石*1 <br/><b><font color=#ffff00>联盟伤害排行爆率：</font></b><br/><font color=#20ff20>第1名</font>     100%概率获得天机丹2-6个 60%概率获得合成精华碎片 40%概率获得轩辕装备碎片 20%概率获得风云装备碎片等<br/><font color=#20ff20>第2名</font>     100%概率获得天机丹2-4个 30%概率获得合成精华碎片 20%概率获得轩辕装备碎片 10%概率获得风云装备碎片等<br/><font color=#20ff20>第3名</font>     100%概率获得天机丹2-3个 30%概率获得合成精华碎片 20%概率获得轩辕装备碎片等</br><font color=#20ff20>第4~6名</font>   100%概率获得天机丹2-2个等<br/><font color=#20ff20>第7~9名</font>   100%概率获得天机丹1-2个等<br/><b><font color=#ffff00>势力排行奖励：</font></b><br/><font color=#20ff20>第1名</font>     战神之光3级BUFF（部队攻防增加10%，钱币产量增加30%，持续3天）<br/><font color=#20ff20>第2名</font>     战神之光2级BUFF（部队攻防增加5%，钱币产量增加20%，持续3天）<br/><font color=#20ff20>第3名</font>     战神之光1级BUFF（部队攻防增加1%，钱币产量增加10%，持续3天）</div>'
				,needJoinAlliance:'您需要加入联盟后才能进入！'
			}
			,btn:{
				fightBtn:' 挑战 '
				,getTodayGift:'　每日奖励　'
				,selectType1:'鼓舞消耗40金币（成功率100%）'
				,selectType2:'鼓舞消耗40礼金（成功率50%）'
				,seeRankDlg:'伤害排行奖励'
			}
		}
		,rankdlg:{
			title:'伤害排行榜'
			,lbl:{
				randdateLbl:'{0}排行'
				,hurtNumber:'伤害{0}'
				,weekLbl:'第{0}周'
				,hurtTimes:'{0}击杀'
			}
		}
		,allidropgiftdlg:{
			title:'联盟奖励掉落'
			,lbl:{
				alliName:'<b>{0}</b>'
				,dropItem:'&nbsp;『{0}』×{1}'
				
				,personHead:'个人排行'
				,alliHead:'联盟排行'
				,countryHead:'势力排行'
				
				,personDesc:'排行每日0点20分刷新'
				,alliDesc:'排行每日0点25分刷新'
				,countryDesc:'排行每日0点30分刷新'
			}
			,btn:{
				getGift:'领取奖励'
				,seeDropAllianceGift:'查看本次掉落'
			}
		}
	}
	,gonggaodlg:{
		title:'公告'
	}
	,addFavorite:{
		title:'狂拽三国'
		,url:''
		,useHotKey:'请使用Ctrl+D进行添加'
	}
	,gameSuggest:{
		title:'我要吐槽'
		,desc:'<font color=#30ff30>说您想说的，真诚倾听您的心声！</font>（共512个字符）'
		,tip:'我要吐槽，不吐不快'
	}
	,firstRewardHero:{
		desc:'穿越到狼烟四起的三国，你最想拥有哪位名将？'
		,ops:['吕布', '马超', '赵云', '颜良', '关羽', '张飞']
	}
	,npcdlg:{
		closeop:' 关闭'
	}
	,startGlobalTip:{
		desc:'升级建筑、升级城池、发展科技、招募士兵、培养武将，在狼烟四起中，称霸三国！<br/><font color=#ffff30>标有<img src="{0}" />表示有事可做。</font>'
		,ops:['关闭']
	}
	,fightMapDlg:{
		notFindFightDemo:'数据已不存在，无法观看，请查看战报！'
	}
	,bindGuestDlg:{
		title:'绑定匿名用户'
		,tabs:['注册新用户', '登录']
		,lbl:{
			username:'用户名'
			,password:'密码'
			,repeatpassword:'重输密码'
			,mail:'邮箱'
		}
		,tip:{
			invalid_username_char:'<font color=red>填写6-16位字符，英文、数字组合！</font>'
			,please_input:'<font color=red> * 请输入</font>'
			,input_ok:'<font color=#00b000> √ 正确</font>'
			,not_same:'<font color=red> * 两次输入不同</font>'
			,psw_tooshort:'<font color=red> * 密码太短</font>'
			,email_error:'<font color=red> * 格式不对</font>'
			,psw_empty:'<font color=red> * 密码不能为空</font>'
		}
	}
	,chatPanelDlg:{
		title:'聊天'
		,btn:{
			sendchat:'发送'
		}
	}
};
