rstr={
	validname={
		role={
			empty='* 君主名不能为空！',
			short='* 君主名太短！',
			long='* 君主名太长！',
			mask='* 含有屏蔽字！',
			invalid='* 含有非法字！',
			exist='* 君主名已存在！',
		},
		hero={
			empty='* 武将名不能为空！',
			short='* 武将名太短！',
			long='* 武将名太长！',
			mask='* 含有屏蔽字！',
			invalid='* 含有非法字！',
		},
		alli={
			empty='* 联盟名不能为空！',
			short='* 联盟名太短！',
			long='* 联盟名太长！',
			mask='* 含有屏蔽字！',
			invalid='* 含有非法字！',
			exist='* 联盟名已存在！',
		},
		alliflag={
			empty='* 联盟旗号不能为空！',
			short='* 联盟旗号太短！',
			long='* 联盟旗号太长！',
			mask='* 含有屏蔽字！',
			invalid='* 含有非法字！',
			exist='* 联盟旗号已存在！',
		},
	},
	err={
		invalidparam='错误的数据包',
		fulllevel='等级已达到最高级，无法继续升级！',
		noenoughexp='经验不足！',
		appointsteel='在修炼状态下无法任命！',
		fullbuildings='建筑队列已达到上限！',
		noenoughgold='金币不足！',
		gminvalidparam='参数错误',
		gminvalidfun='指令错误',
	},
	succ={
		changeheroname='您的武将名改为：%s',
		upgradeherolevel='您的武将『%s』等级升为：%d级',
		goldexexp='恭喜！您意外得到经验：%d',
		steelgetexp='这次修炼共获得经验：%d',
		clearppok='洗点成功！',
		treatmentsok='医疗成功！',
		gmexecok='执行成功！',
	},
	comm={
		armpkgfull='装备栏已满！',
	},
	warning={
		steel={
			maxlevel= '该武将已达到该修炼方式的最高等级[%s级]',
		},
	},
	fight={
		showdemo='#[f:{0}:{1}]',
		jianta='箭塔',
	},
	declareFight={
		declareTo = '使臣回报，[%s]接受了您的战书，约定与您一决死战。1小时后双方将进入战争状态，请您厉兵秣马，做好出征准备！目标的坐标位置为(x:%d, y:%d)'
		,declareFrom = '使臣回报，[%s]向您下了战书，约定与您一决死战。1小时后双方将进入战争状态，请您厉兵秣马，做好迎战准备！宣战方的坐标位置为(x:%d, y:%d)'
	},
	mail={
		title={
			fightresult='战报',
			collectitems='采集获得',
			dropitem='物品掉落',
			declareFight='宣战邮件',
			autoGiveUpField='野地被自动回收',
			beAttackedGiveUpField='野地被攻陷',
			allianceDismissed='联盟解散',
			transferLeader='盟主禅让',
			appointAlliPos='联盟职位',
			fireAlliMem='开除联盟成员',
			applyMergeAlliance='申请联盟合并',
			mergeAlliance='联盟合并',
			youngStateEnd='脱离新手保护期提示',
			payAct='充值返利',
			cdkey='CDKEY兑换礼包',
			exitAlliReturnContrib = '折返联盟贡献券',
			biddingAlliItem = '竞价成功获得物品',
			sellAlliItemTimeOut = '拍卖物品超时返还',
			sellAlliItemSucc = '物品拍卖成功',
			returnSellItemWhenExitAlli = '联盟拍卖返还',
			returnContributeWhenExitAlli = '联盟拍卖返还',
			returnContributeWhenLow = '联盟拍卖返还',
			sendItemNoEnoughPkg = '背包空间不足，请查收物品',
		},
		content={
			collectitems='您的背包满了，采集的物品只能通过邮件寄给您了。',
			dropitem='您的背包满了，获得的物品只能通过邮件寄给您了。',
			autoGiveUpField='您的野地#[m:%d:%d]已降至0级，助手帮您自动放弃了。采集所得会自动收获，驻扎军队将自动返回。',
			beAttackedGiveUpField='您的野地#[m:%d:%d]被[%s]#[m:%d:%d]攻陷。',
			declareTo = '使臣回报，[%s]接受了您的战书，约定与您一决死战。1小时后双方将进入战争状态，请您厉兵秣马，做好出征准备！目标的坐标位置为#[m:%d:%d]',
			declareFrom = '使臣回报，[%s]向您下了战书，约定与您一决死战。1小时后双方将进入战争状态，请您厉兵秣马，做好迎战准备！宣战方的坐标位置为#[m:%d:%d]',
			allianceDismissed='您的联盟已经解散！',
			becomLeader='您已成为盟主！',
			verbLeader='您已辞去盟主职位，降级为副盟主！',
			transferingLeader='%s正将盟主职位禅让给您，24小时后生效！',
			appointAlliPos='您的联盟职位被设置为[%s]',
			fireAlliMem='您已脱离联盟！此处不留爷，自有留爷处！',
			applyMergeAlliance='[%s]联盟的盟主[%s]申请和您的联盟合并！共商发展大计！',
			mergeAlliance='您所在的联盟已经合并到[%s]联盟中！',
			youngStateEnd='您已脱离新手保护，现在可以对玩家进行出征了。同时也有可能受到其他玩家的攻击。快速提升武将实力或者加入强大的联盟是乱世中的生存之道。如果完全不想受到来自其他玩家攻击，可以使用免战牌获取宝贵的发展时间。',
			payAct='充值返利，请及时查收！',
			cdkey='CDKEY兑换礼包，请及时查收！',
			exitAlliReturnContrib = '您已退出联盟，联盟贡献*0.6/100 取整后折返对应个数的联盟贡献券，请及时查收！',
			biddingAlliItem = '竞价成功获得物品，请注意查收！',
			sellAlliItemTimeOut = '拍卖物品超时返还，请注意查收！',
			sellAlliItemSucc = '物品拍卖成功，获得联盟贡献%d！',
			returnSellItemWhenExitAlli = '由于您已退出联盟，在联盟拍卖的物品自动返还！',
			returnContributeWhenExitAlli = '拍卖者已退出联盟，自动返还您的竞价贡献%d！',
			returnContributeWhenLow = '有人出价比您高，自动返还您的竞价贡献%d！',
			sendItemNoEnoughPkg = '背包空间不足，物品通过邮件发送，请查收！',
		},
		err={
			title={
				empty='* 标题不能为空！',
				short='* 标题太短！',
				long='* 标题太长！',
				mask='* 含有屏蔽字！',
			}
			,msg={
				empty='* 内容不能为空！',
				short='* 内容太短！',
				long='* 内容太长！',
				mask='* 含有屏蔽字！',
			}		
		},
	},
	fieldhero={
		levelname='%d级%s'
	},
	fieldplayer={
		levelname='%d级%s'
	},
	occupyfieldplayer={
		playername='%s的野地'
	},
	actor = {
		wallActorName = '城墙',
	},
	chat = {
		noalliance = '<font color=red>*您还没有加入联盟</font>',
		noplayer = '<font color=red>*该玩家不存在</font>',
	},
	alliance = {
		invitejion = '%s 邀请您加入联盟 #[a:%s]'
		,alliPoss = {'成员', '长老', '副盟主', '盟主'}
		,events = {
			addMember = '<font color=#33ff33>%s加入联盟，联盟荣誉+%d</font>'
			,delMember = '<font color=#ff3300>%s退出联盟，联盟荣誉-%d</font>'
			,upgradeAlliance = '<font color=#ffff00>联盟升到%d级，联盟荣誉+%d</font>'
			,upgradeLawLight = '<font color=#ffff00>联盟圣兽升到%d级，联盟荣誉+%d</font>'
			,lawLightBestow = '<font color=#ffff00>联盟圣兽恩赐，联盟荣誉+%d</font>'
			,mergeAlliance = '<font color=#33ff33>[%s]联盟合并到[%s]联盟中，联盟荣誉+%d</font>'
			,changeAlliPos = '<font color=#ffff00>[%s]的联盟职位调整为[%s]</font>'
			,pkAttacker = '<font color=#33ff33>[%s]攻破了[%s]的城池，联盟荣誉+%d</font>'
			,pkDefender = '<font color=#ff3300>[%s]攻破了[%s]的城池，联盟荣誉-%d</font>'
			,roleTask = '<font color=#ffffff>[%s]完成了君主任务，联盟荣誉+%d</font>'
			,cardContribute = '捐献<font color=#ffff30>%d</font>个令牌成功，获得联盟贡献<font color=#30ff30>%d</font>点'
			,resContribute = '捐献<font color=#ffff30>%d</font>万资源成功，获得联盟贡献<font color=#30ff30>%d</font>点'
		}
	},
	armop = {
		msg = {
			batchSucces = '本次合成 成功 %d 个，失败  %d 个。Everything is under control！'
			,batchFail = '本次合成 成功 %d 个，失败 %d 个。元芳表示还是高级合成比较靠谱。。'
		}
	},
	autobuild = {
		stop = '自动建造列表因资源不足已自动停止！'
	},
	worldboss = {
		guwu={
			succ='第%d次，鼓舞等级成功+1'
			,fail='第%d次，鼓舞失败'
			,nogold='第%d次，金币不足'
			,nogiftgold='第%d次，礼金不足'
		},
	},
	speedByGiftGold = '花费了%d礼金，加速成功',
	speedByGiftGoldAndGold = '花费了%d礼金，%d金币，加速成功',
	zhanshenzhiguang = '获得战神之光%d级BUFF！',
	expedTowerLayer = '<font color=#f78e38><font color=#ffffff>[%s]</font>千层塔过了 <font color=#ffffff>%d</font> 层</font>',
	firstRewardHeroNames = {{name='刘备', icon=101, sex=ROLE_SEX.MALE}
		,{name='孙权', icon=106, sex=ROLE_SEX.MALE}
		,{name='曹操', icon=115, sex=ROLE_SEX.MALE}
		,{name='董卓', icon=110, sex=ROLE_SEX.MALE}
		,{name='关羽', icon=103, sex=ROLE_SEX.MALE}
		,{name='张飞', icon=103, sex=ROLE_SEX.MALE}
		,{name='诸葛亮', icon=101, sex=ROLE_SEX.MALE}
		,{name='许褚', icon=116, sex=ROLE_SEX.MALE}},
	firstHeroPopMsg = '主公，[%s]已归入您的麾下，助您称霸天下！',
	questions = {
		starttip = '#[TIP:亲们，每日有奖抢答开始啦:每日%d点-%d点，每隔%d分钟开始一次，每次答题有效时间%d秒]'
		,endtip = '本次答题已结束！'
		,endranktip = '恭喜以下才思敏捷，身手不凡的玩家！'
	},
}

rstr.herotypenames={}
rstr.herotypenames[HERO_PROF.YONGSHI] = '勇士'
rstr.herotypenames[HERO_PROF.DAOJIANG] = '刀将'
rstr.herotypenames[HERO_PROF.JIJIANG] = '戟将'
rstr.herotypenames[HERO_PROF.GONGJIANG] = '弓将'
rstr.herotypenames[HERO_PROF.QIJIANG] = '骑将'
rstr.herotypenames[HERO_PROF.QIXIE] = '器将'

rstr.cityDefActorNames={}
rstr.cityDefActorNames[CITYDEF_TYPE.XIANJING] = '陷阱'
rstr.cityDefActorNames[CITYDEF_TYPE.GUNMU] = '滚木'
rstr.cityDefActorNames[CITYDEF_TYPE.JUMA] = '拒马'
rstr.cityDefActorNames[CITYDEF_TYPE.LEISHI] = '礌石'
rstr.cityDefActorNames[CITYDEF_TYPE.NUJIAN] = '弩箭'

country_names = {}
country_names[9900001] = 'wei'
country_names[9900002] = 'shu'
country_names[9900003] = 'wu'
country_names[9900004] = 'zhong'



