// ------------------------------------ 任务类别 ------------------------------------
res_tattrs = [
	{
		id:RES_TATTR.NONE
		,name:'无定义'
	}
	,{
		id:RES_TATTR.ADDFAVORITE
		,name:'添加收藏夹'
		,target: 0
	}
	,{
		id:RES_TATTR.RECOMMEND
		,name:'推荐人数'
		,target: 0
	}
	,{
		id:RES_TATTR.KILLMONSTER
		,name:'已杀死[{0}]'
		,target: 1
	}
	,{
		id:RES_TATTR.UPLEVEL
		,name:'已达等级'
		,target: 0
	}
	,{
		id:RES_TATTR.FINDNPC
		,name:'已找到[{0}]'
		,target: 1
	}
	,{
		id:RES_TATTR.FINDMONSTER
		,name:'已找到[{0}]'
		,target: 1
	}
	,{
		id:RES_TATTR.FINDPLAYER
		,name:'已找到[{0}]'
		,target: 1
	}
	,{
		id:RES_TATTR.FINDITEM
		,name:'已找到[{0}]'
		,target: 1
	}
	,{
		id:RES_TATTR.REACHPOS
		,name:'已到达[{0}]'
		,target: 1
	}
	,{
		id:RES_TATTR.GIVEAS
		,name:'赠送[{0}]给[{1}]'
		,target: 2
	}
	,{
		id:RES_TATTR.GAINWHOGIFT
		,name:' 得到要赠与[{0}]的物品'
		,target: 1
	}
].sort(G_ID_ASCCOMP);

// ------------------------------ 使用效果的描述 ------------------------------
res_effects = [
	{
		id:RES_EFF.NONE
	}
	,{
		id:RES_EFF.ACCELERATE
		,dlg:{
			title:'加速'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ADDARMGRID
		,dlg:{
			title:'增加装备栏格子'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ACC_FOOD
		,dlg:{
			title:'粮食增产'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ACC_WOOD
		,dlg:{
			title:'木材增产'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ACC_STONE
		,dlg:{
			title:'石料增产'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ACC_IRON
		,dlg:{
			title:'生铁增产'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ACC_MORALE
		,dlg:{
			title:'提升民心'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ACC_POPU
		,dlg:{
			title:'提升人口'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ACC_MONEY
		,dlg:{
			title:'增加银两税收'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ACC_LOYAL
		,dlg:{
			title:'提升忠诚度'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ADDHEROMORALE
		,dlg:{
			title:'提升士气'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ACC_STEELMAILUO
		,dlg:{
			title:'加速'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ACC_TRADING
		,dlg:{
			title:'加速'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ACC_DOINGROLETASK
		,dlg:{
			title:'加速'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.LEARN_HERO_BSKILL
		,dlg:{
			title:'使用技能书'
			,btntext:'学习'
		}
	}
	,{
		id:RES_EFF.LEARN_HERO_TSKILL
		,dlg:{
			title:'使用技能书'
			,btntext:'学习'
		}
	}
	,{
		id:RES_EFF.LEARN_HERO_SSKILL
		,dlg:{
			title:'使用技能书'
			,btntext:'学习'
		}
	}
	,{
		id:RES_EFF.ACC_STEELSKILL
		,dlg:{
			title:'加速'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ADD_CANSTEELSKILL
		,dlg:{
			title:'增加技能可修炼时间'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ADD_NEWSOLDIER
		,dlg:{
			title:'增加新兵'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ACC_CULTURELEARN
		,dlg:{
			title:'加速科技研究'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ACC_CITYDEF
		,dlg:{
			title:'加速城防建造'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ADD_FOOD
		,dlg:{
			title:'增加粮食'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ADD_WOOD
		,dlg:{
			title:'增加木材'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ADD_STONE
		,dlg:{
			title:'增加石料'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ADD_IRON
		,dlg:{
			title:'增加铁锭'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ADD_MONEY
		,dlg:{
			title:'增加钱币'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.ADD_FOURRES
		,dlg:{
			title:'增加四项资源'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.SETPOS_MOVECITY
		,dlg:{
			title:'迁城'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.RAND_MOVECITY
		,dlg:{
			title:'迁城'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.AVOIDFIGHT
		,name:'免战效果'
		,dlg:{
			title:'免战'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.YOUNG_STATE
		,name:'新手保护'
		,dlg:{
			title:'新手保护'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.AVOIDFIGHTCD
		,name:'免战冷却效果'
		,dlg:{
			title:'免战冷却'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.TOWER_RECOVER_SOLDIER
		,name:'千层塔后援补给'
		,dlg:{
			title:'千层塔后援补给'
			,btntext:'使用'
		}
	}
	,{
		id:RES_EFF.TOWER_RECOVER_SOLDIER_BYACT
		,name:'千层塔后援补给'
		,dlg:{
			title:'千层塔后援补给'
			,btntext:'使用'
		}
	}	
	
	,{
		id:RES_EFF.ADD_BUILD_SPEED
		,name:'建设速度提高效果'
		,dlg:{
			title:'建设速度提高效果'
			,btntext:'使用'
		}
	}	
	
	,{
		id:RES_EFF.ADD_COMMRES_OUTPUT
		,name:'资源产量增加效果'
		,dlg:{
			title:'资源产量增加效果'
			,btntext:'使用'
		}
	}
	
	,{
		id:RES_EFF.ADD_CULTURE_SPEED_AND_MONEY_OUTPUT
		,name:'增加科研钱币效果'
		,dlg:{
			title:'增加科研钱币效果'
			,btntext:'使用'
		}
	}
	
	,{
		id:RES_EFF.ZHANSHENZHIGUANG
		,name:'战神之光'
		,dlg:{
			title:'战神之光'
			,btntext:'使用'
		}		
	}	
].sort(G_ID_ASCCOMP);


// ------------------------------ 使用对象的描述 ------------------------------
res_targets = [
	{
		id:RES_TRG.NONE
	}	
	,{
		id:RES_TRG.SELF_DEF_BUILDING
		,isrange:true // 表示当前类别是否表示的是一个范围的id
		,desc:'自己的正在建造的城防'
	}
	,{
		id:RES_TRG.SELF_DEF_BUILDED
		,isrange:true
		,desc:'自己的已经建造的城防'
	}
	,{
		id:RES_TRG.SELF_HERO
		,isrange:true
		,desc:'自己的英雄'
	}
	,{
		id:RES_TRG.SELF_SOLDIER
		,isrange:true
		,desc:'自己的士兵'
	}
	,{
		id:RES_TRG.FRIEND_DEF_BUILDING
		,isrange:true
		,desc:'友方的正在建造的城防'
	}
	,{
		id:RES_TRG.FRIEND_DEF_BUILDED
		,isrange:true
		,desc:'友方的已经建造的城防'
	}
	,{
		id:RES_TRG.FRIEND_HERO
		,isrange:true
		,desc:'友方的英雄'
	}
	,{
		id:RES_TRG.FRIEND_SOLDIER
		,isrange:true
		,desc:'友方的士兵'
	}
	,{
		id:RES_TRG.ENEMY_DEF_BUILDING
		,isrange:true
		,desc:'敌方的正在建造的城防'
	}
	,{
		id:RES_TRG.ENEMY_DEF_BUILDED
		,isrange:true
		,desc:'敌方的已经建造的城防'
	}
	,{
		id:RES_TRG.ENEMY_HERO
		,isrange:true
		,desc:'敌方的英雄'
	}
	,{
		id:RES_TRG.ENEMY_SOLDIER
		,isrange:true
		,desc:'敌方的士兵'
	}
	,{
		id:RES_TRG.SELF_ARMY
		,isrange:true
		,desc:'自己的军队'
	}
	,{
		id:RES_TRG.ALLI_ARMY
		,isrange:true
		,desc:'队友的军队'
	}
	,{
		id:RES_TRG.ENEMY_ARMY
		,isrange:true
		,desc:'敌放的军队'
	}
	,{
		id:RES_TRG.LEARNING_CULTURE
		,isrange:true
		,desc:'自己的正在研究的国学'
	}
	,{
		id:RES_TRG.MAKING_WEAPONRY
		,isrange:true
		,desc:'自己的正在锻造的武器'
	}
	,{
		id:RES_TRG.BUILDING_OBUILD
		,isrange:true
		,desc:'自己的正在建造的外城建筑'
	}
	,{
		id:RES_TRG.BUILDING_IBUILD
		,isrange:true
		,desc:'自己的正在建造的内城建筑'
	}
	,{
		id:RES_TRG.RECRUITING_SOLDIER
		,isrange:true
		,desc:'自己的正在招募的士兵'
	}
	,{
		id:RES_TRG.OBUILD
		,isrange:true
		,desc:'自己的已建好的外城建筑'
	}
	,{
		id:RES_TRG.IBUILD
		,isrange:true
		,desc:'自己的已建好的内城建筑'
	}
	,{
		id:RES_TRG.OBUILDRES
		,isrange:true
		,desc:'自己的外城资源'
	}
	,{
		id:RES_TRG.ADDARMGRID
		,isrange:false
		,desc:'装备栏个数'
	}
	,{
		id:RES_TRG.FARM
		,isrange:true
		,desc:'增加农田产量'
	}
	,{
		id:RES_TRG.TIMBERYARD
		,isrange:true
		,desc:'增加木场产量'
	}
	,{
		id:RES_TRG.QUARRY
		,isrange:true
		,desc:'增加石场产量'
	}
	,{
		id:RES_TRG.IRONORE
		,isrange:true
		,desc:'增加铁场产量'
	}
].sort(G_ID_ASCCOMP);



//==============================================================================================
// 1 - 1000 表示城防配置组id

// 1001 - 9999       表示杂类一
// 10001 - 99999    表示杂类二

// 100001 - 110000  表示的是外城建筑id
// 110001 - 120000  表示的是内城建筑id

// 120001 - 130000  表示的是国学id
// 130001 - 140000  ----------------------
  //130001 - 132000 表示信件的模板id
// 140001 - 150000  表示的是将领类型id
// 150001 - 150100  表示的是士兵类型id
// 150101 - 150200  表示的是城防类型id
// 160001 - 170000  表示的是城市防御id

// 170001 - 170009  表示野地编号
// 170010 - 170400  表示npc城id
// 170401 - 170500  表示分城外观id
// 170501 - 171000  表示主城外观

// 171001 - 180000  表示副本编号
// 180001 - 181000 表示阵型id

// 1000001 - 2000000 表示任务的id


// 6000001 - 6001000   表示计谋id
// 6001001 - 7000000   表示将领和士兵的技能id

// 7000001 - 7500000  表示npcid
// 7500001 - 7600000  表示掉落id
// 7600001 - 8000000  表示野将id

// 9000001 - 9999999   表示地图id
//    9000001 - 9900000 战斗地图 
//    9900001 - 9910000 城市地图
//    9910001 - 9920000 世界地图
// 10000000 - 10100000 商城id范围

ItemClassRange = Class.extern(function(){
	this.classrangeids = [
		{
			classid:RES_CLS.PKGITEM,
			idrange:{min:2000001,max:6000000},
			name:'包裹物品',
			desc:'包裹物品' 
		}
			,{
				classid:RES_CLS.EQUIPITEM,
				idrange:{min:2000001,max:3000000},
				name:'装备道具',
				desc:'装备道具' 
			}
				,{
					classid:RES_CLS.ROLEEQUIPITEM,
					idrange:{min:2000001,max:2500000},
					name:'君主装备道具',
					desc:'君主装备道具' 
				}
				,{
					classid:RES_CLS.HEROEQUIPITEM,
					idrange:{min:2500001,max:3000000},
					name:'英雄装备道具',
					desc:'英雄装备道具' 
				}
			,{
				classid:RES_CLS.CANUSEITEM,
				idrange:{min:3000001,max:3500000},
				name:'用品道具',
				desc:'用品道具' 		
			}
			,{
				classid:RES_CLS.SPEEDITEM,
				idrange:{min:3500001,max:4000000},
				name:'加速道具',
				desc:'加速道具' 		
			}
			,{
				classid:RES_CLS.BOOKITEM,
				idrange:{min:4000001,max:4500000},
				name:'书籍道具',
				desc:'书籍道具' 		
			}
			,{
				classid:RES_CLS.GEMITEM,
				idrange:{min:FIXID.FIRSTGEM,max:FIXID.LASTGEM},
				name:'灵石道具',
				desc:'灵石道具'
			}
				,{
					classid:RES_CLS.ST_GEMITEM,
					idrange:{min:FIXID.FIRST_ST_GEM,max:FIXID.LAST_ST_GEM},
					name:'力量灵石道具',
					desc:'力量灵石道具'
				}			
				,{
					classid:RES_CLS.AG_GEMITEM,
					idrange:{min:FIXID.FIRST_AG_GEM,max:FIXID.LAST_AG_GEM},
					name:'身法灵石道具',
					desc:'身法灵石道具'
				}			
				,{
					classid:RES_CLS.PH_GEMITEM,
					idrange:{min:FIXID.FIRST_PH_GEM,max:FIXID.LAST_PH_GEM},
					name:'根骨灵石道具',
					desc:'根骨灵石道具'
				}			
				,{
					classid:RES_CLS.CO_GEMITEM,
					idrange:{min:FIXID.FIRST_CO_GEM,max:FIXID.LAST_CO_GEM},
					name:'统率灵石道具',
					desc:'统率灵石道具'
				}			
			,{
				classid:RES_CLS.TASKITEM,
				idrange:{min:5000001,max:5500000},
				name:'任务道具',
				desc:'任务道具'
			}
			,{
				classid:RES_CLS.OTHERITEM,
				idrange:{min:3500001,max:6000000},
				name:'其他道具',
				desc:'除装备和用品外的其他道具'
			}
			,{
				classid:RES_CLS.MY_AUCTION_ITEM,
				idrange:{min:2000001,max:6000000},
				name:'我正在竞拍的道具',
				desc:'我正在竞拍的道具'
			}
		,{
			classid:RES_CLS.TASK,
			idrange:{min:1000001,max:2000000},
			name:'任务',
			desc:'任务id' 
		}
		,{
			classid:RES_CLS.IBUILD
			,idrange:{min:110001,max:120000}
			,name:'国学'
			,desc:'国学'
		}
		,{
			classid:RES_CLS.CULTURE
			,idrange:{min:120001,max:130000}
			,name:'国学'
			,desc:'国学'
		}
		,{
			classid:RES_CLS.NPC
			,idrange:{min:7000001,max:7500000}
			,name:'NPC'
			,desc:'NPC'
		}
		,{
			classid:RES_CLS.FIGHTMAP
			,idrange:{min:9000001,max:9900000}
			,name:'战斗地图' 
			,desc:'战斗地图' 
		}
		,{
			classid:RES_CLS.CITYMAP
			,idrange:{min:9900001,max:9910000}
			,name:'城市地图' 
			,desc:'城市地图' 
		}
		,{
			classid:RES_CLS.WORLDMAP
			,idrange:{min:9910001,max:9920000}
			,name:'世界地图'
			,desc:'世界地图'
		}
	];
	
	this.getRange = function(classid) {
		return TQ.find(this.classrangeids, 'classid', classid);
	};
	
	this.getFirstClass = function(id) {
		for ( var i=0; i<this.classrangeids.length; ++i ) {
			var r = this.classrangeids[i];
			if ( id >= r.idrange.min && id <= r.idrange.max ) {
				return r;
			}
		}
		return null;
	};
	
	this.getFirstClassId = function(id) {
		var c = this.getFirstClass(id);
		return c ? c.classid : 0;
	};
	
	this.isInRange = function(classRange, id) {
		return id >= classRange.idrange.min && id <= classRange.idrange.max;
	};
}).snew();





