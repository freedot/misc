UIM = Class.extern(function(){
	var _lc_={};this.lc=function(){return _lc_;};
	var m_g;
	var m_this;
	var m_dlgs = {};
	var m_panels = {};
	var m_willopens = [];
	var m_openeds = {};
	var m_syncs = {};
	var m_openListener = null;
	var m_dlgOpenMutex = {};
	
	this.init = function(){
		m_this = this;
		m_openListener = Caller.snew(this, this._onDlgOpen);
	};
	
	this.initOneTime = function(g){
		m_g = g;
		_init();
	};
	
	this.getDlg = function(key){
		return m_dlgs[key];
	};
	
	this.isSync = function(key){
		if (m_syncs[key]) return true;
		else return false;
	};
	
	this.getPanel = function(key){
		return m_panels[key];
	};
	
	this.forceRegPanel = function(key, panel){
		m_panels[key] = panel;
	};
	
	this.regPanel = function(key, panel){
		if ( m_panels[key] ){
			log('*error: the panel is exist, key:'+key);
		}
		else{
			m_panels[key] = panel;
		}
	};
	
	this.regDlg = function(key, dlg){
		m_dlgs[key] = dlg;
	};
	
	this.clearDlgs = function(){
		m_dlgs = {};
	};
	
	this.clearPanels = function(){
		m_panels = {};
	};
	
	this.openDlg = function(){
		var args = [];
		for ( var i=1; i<arguments.length; ++i ) {
			args.push(arguments[i]);
		}

		var dlgkey = arguments[0];
		var dlg = m_this.getDlg(dlgkey);
		if ( m_this.isSync(dlgkey) || m_openeds[dlgkey] ) {
			dlg.openDlg.apply(dlg, args);
		} else {
			if ( m_this.getDlg('midwait') ) m_this.getDlg('midwait').openDlg();
			m_willopens.push({dlg:dlg,args:args});
			window.setTimeout(m_this.onOpenDlg, 1);
			m_openeds[dlgkey] = true;
		}
	};
	
	this.onOpenDlg = function(){
		if ( m_willopens.length > 0 ) {
			var wo = m_willopens[0];
			wo.dlg.openDlg.apply(wo.dlg, wo.args);
			TQ.removeElement(m_willopens, 0);
			if ( m_this.getDlg('midwait') ) m_this.getDlg('midwait').closeDlg();
		}
	};
	
	this.closeMapPanels = function(){
		var tags = ['statecity', 'inbuild', 'farm', 'field'];
		for ( var k in tags ) {
			var p = m_panels[tags[k]];
			if ( !p ) continue;
			
			p.hide();
			p.setActive(false);
		}
		this.getPanel('main').getSubCityPanels().hideAllPanels();
		this._resetFarm();
		SoundMgr.stopBackSound();
	};
	
	this._resetFarm = function(){
		UIM.getDlg('selpip').closeDlg();
		UIM.getPanel('farm').getModel().setOpState(FARMOP_STATE.SEL);
	};
	
	this.closeMainCityDlgs = function(){
		var dlgs = ['culture', 'task', 'package', 'shop', 'expedition', 'soldier'
			,'hero', 'steelhero', 'steellist', 'military', 'allievents', 'allicreate', 'allimain'
			,'allidetail', 'buildinginfo', 'resprotect', 'hospital', 'role', 'changecity', 'soldierop'
			,'allidetail', 'assignheros', 'selectexpedtarget', 'assignsoldiers', 'tradingarea'
			,'buyitem', 'saleitem'
		];
		this._closeDlgs(dlgs);
	};
	
	this.closeStateCityDlgs = function(){
		var dlgs = ['acttower', 'acttowerexped', 'actterrace', 'actterraceexped', 'buyitem', 'saleitem'];
		this._closeDlgs(dlgs);
	};
	
	this._closeDlgs = function(dlgs){
		for ( var i=0; i<dlgs.length; ++i ) {
			var dlg = UIM.getDlg(dlgs[i]);
			try {
				if ( dlg.closeDlg ) {
					dlg.closeDlg();
				} else if ( dlg.hideDlg ) {
					dlg.hideDlg();
				}
			} catch (e){
				alert (dlgs[i]);
			}
		}
	};
	
	this.closeAllFieldDlg = function(){
		this.getDlg('rolecity').closeDlg();
		this.getDlg('selffield').closeDlg();
		this.getDlg('field').closeDlg();
		this.getDlg('emptyfield').closeDlg();
	};
	
	this.openActTowerDlg = function(){
		UIM._openActDlg('acttower', 'acttowerexped');
	};
	
	this.openActTerraceDlg = function(){
		UIM._openActDlg('actterrace', 'actterraceexped');
	};
	
	this._openActDlg = function(mainDlg, expedDlg){
		if ( UIM.getDlg(expedDlg).isRunning() ) {
			log('act terrace is running...');
			UIM.getDlg(expedDlg).forceShow();
		} else {
			log('act terrace is not running');
			UIM.getDlg(mainDlg).openDlg();
		}
	};
	
	this._onDlgOpen = function(dlgName){
		var needCloseDlgs = m_dlgOpenMutex[dlgName];
		if ( !needCloseDlgs ) return;
		this._closeOthersDlg(dlgName, needCloseDlgs);
	};
	
	this._closeOthersDlg = function(selfName, needCloseDlgs){
		for ( var i=0; i<needCloseDlgs.length; ++i ) {
			var itdlgName = needCloseDlgs[i];
			if (itdlgName == selfName) continue;
			this._closeDlgs([itdlgName]);
		}
	};
	
	//--------------
	// private:method
	//--------------
	var _init = function(){
		_initDlgOpenMutex();
		_initDlgs();
		_initPanels();
	};
	
	var _initDlgOpenMutex = function() {
		// 对话框打开时的互斥表
		m_dlgOpenMutex['shop'] = 
		m_dlgOpenMutex['rank'] = 
		m_dlgOpenMutex['letter'] = 
		m_dlgOpenMutex['role'] = 
		m_dlgOpenMutex['task'] = 
		m_dlgOpenMutex['hero'] = 
		m_dlgOpenMutex['alli'] = 
		m_dlgOpenMutex['expedition'] = 
		m_dlgOpenMutex['military'] = 
		m_dlgOpenMutex['exchange'] = 
		m_dlgOpenMutex['friend'] = 
		m_dlgOpenMutex['package'] = ['shop', 'rank', 'letter', 'role', 'task', 'hero', 'alli', 'expedition', 'military', 'exchange', 'friend', 'package'];
	};
	
	var _initDlgs = function(){
		// 非模式对话框
		m_dlgs['shop'] = ShopDlg.snew(m_g, 'shop', m_openListener); // 商城
		m_dlgs['package'] =  PackageDlg.snew(m_g, 'package', m_openListener); // 背包对话框
		m_dlgs['task'] = TaskDlg.snew(m_g, 'task', m_openListener); // 任务对话框
		m_dlgs['letter'] = LetterDlg.snew(m_g, 'letter', m_openListener); // 信件对话框
		m_dlgs['help'] = HelpDlg.snew(m_g); // 帮助对话框
		m_dlgs['expedition'] = ExpeditionDlg.snew(m_g, 'expedition', m_openListener);//出征对话框		
		m_dlgs['farminfo'] = new FarmInfoDlg(m_g); // 农场动态		
		m_dlgs['culture'] = CultureDlg.snew(m_g); // 国学对话框
		m_dlgs['soldier'] = SoldierDlgPresenter.snew(m_g, SoldierDlgView.snew(m_g), SoldierDlgModel.snew(m_g));  // 士兵招募对话框
		m_dlgs['hero'] = HeroDlgPresenter.snew(m_g, HeroDlgView.snew(m_g, 'hero', m_openListener), HeroDlgModel.snew(m_g)); // 英雄对话框		
		m_dlgs['steelhero'] = SteelHeroDlg.snew(m_g); m_syncs['steelhero'] = true;// 英雄修炼对话框
		m_dlgs['steellist'] = SteelListDlg.snew(m_g); // 英雄修炼列表对话框
		m_dlgs['military'] = MilitaryDlg.snew(m_g, 'military', m_openListener); // 军情动态对话框
		m_dlgs['allievents'] = AlliEventsDlg.snew(m_g); // 联盟事件对话框
		m_dlgs['allicreate'] = AlliCreateDlg.snew(m_g); // 联盟创建对话框
		m_dlgs['alli'] = AlliDlg.snew(m_g, 'alli', m_openListener); // 联盟相关对话框
		m_dlgs['allimain'] = AlliMainDlg.snew(m_g); // 联盟对话框
		m_dlgs['allidetail'] = AlliDetailDlg.snew(m_g); // 联盟详情对话框		
		m_dlgs['buildinginfo'] = BuildingInfoDlg.snew(m_g); m_syncs['buildinginfo'] = true;// 正在建造的建筑
		m_dlgs['resprotect'] = ResProtectDlg.snew(m_g); m_syncs['resprotect'] = true;// 仓库资源保护对话框
		m_dlgs['hospital'] = HospitalDlg.snew(m_g); // 医馆对话框
		m_dlgs['role'] = RoleDlg.snew(m_g, 'role', m_openListener); // 打开角色对话框
		m_dlgs['changecity'] = ChangeCityDlg.snew(m_g); // 更换州对话框
		m_dlgs['buildingtrace'] = BuildingTraceDlg.snew(m_g); m_syncs['buildingtrace'] = true;// 建筑中跟踪对话框
		m_dlgs['soldierop'] = SoldierOpDlg.snew(m_g);// 士兵操作对话框
		m_dlgs['assignheros'] = AssignHerosDlg.snew(m_g);// 分配英雄对话框
		m_dlgs['selectexpedtarget'] = SelectExpedTargetDlg.snew(m_g);// 选择出征目标对话框
		m_dlgs['assignsoldiers'] = AssignSoldiersDlg.snew(m_g);// 英雄配兵对话框
		m_dlgs['tradingarea'] = TradingAreaDlg.snew(m_g);// 商圈对话框
		m_dlgs['acttower'] = ActTowerDlg.snew(m_g);// 千层塔主对话框
		m_dlgs['acttowerexped'] = ActTowerExpedDlg.snew(m_g);// 千层塔出征对话框
		m_dlgs['actterrace'] = ActTerraceDlg.snew(m_g); // 点将台主对话框
		m_dlgs['actterraceexped'] = ActTerraceExpedDlg.snew(m_g); // 点将台出征对话框
		m_dlgs['activityval'] = ActivityValDlg.snew(m_g); // 活跃度对话框
		m_dlgs['rank'] = RankDlg.snew(m_g, 'rank', m_openListener); // 排行对话框
		m_dlgs['friendapplylist'] = FriendApplyListDlg.snew(m_g); m_syncs['friendapplylist'] = true;//申请好友列表对话框
		m_dlgs['buyitem'] = BuyItemDlg.snew(m_g); m_syncs['buyitem'] = true;// 购买道具对话框
		m_dlgs['saleitem'] = new SaleItemDlg(m_g); // 出售道具对话框
		m_dlgs['declarewar'] = new DeclareWarDlg(m_g); // 宣战对话框
		m_dlgs['seltargetuseitem'] = new UseItemSelTargetDlg(m_g); // 选择目标使用道具对话框
		m_dlgs['uselistitem'] = UseListItemDlg.snew(m_g); m_syncs['uselistitem'] = true;// 使用可用道具列表对话框
		m_dlgs['filteritem'] = FilterItemDlg.snew(m_g); // 特定道具使用对话框
		m_dlgs['filteritemex'] = new FilterItemDlgEx(m_g); // 特定道具使用对话框
		m_dlgs['weararm'] = new WearArmDlg(m_g); // 穿戴装备对话框
		m_dlgs['writeletter'] = WriteLetterDlg.snew(m_g); // 写信对话框
		m_dlgs['readletter'] = ReadLetterDlg.snew(m_g); // 读信对话框
		m_dlgs['minihelp'] = new MiniHelpDlg(m_g); //mini帮助对话框
		m_dlgs['friend'] = FriendDlg.snew(m_g, 'friend', m_openListener); m_syncs['friend'] = true;//好友主面板
		
		m_dlgs['findinfo'] = new FindInfoDlg(m_g);//查找联系人/群组/英雄对话框
		m_dlgs['playerdetail'] = new PlayerDetailDlg(m_g); // 玩家详情对话框
		m_dlgs['team'] = new TeamDlg(m_g); // 队伍对话框
		m_dlgs['inviteconfirm'] = new InviteConfirmDlg(m_g); // 队伍队伍邀请等待确认对话框
		m_dlgs['mainselbuild'] = MainCitySelBuildDlg.snew(m_g); m_syncs['mainselbuild'] = true; // 选择主城建筑条目对话框
		m_dlgs['resselbuild'] = ResCitySelBuildDlg.snew(m_g); // 选择资源分城建筑条目对话框
		m_dlgs['militaryselbuild'] = MilitaryCitySelBuildDlg.snew(m_g); // 选择军政分城建筑条目对话框
		m_dlgs['citydef'] = CityDefDlg.snew(m_g); // 城市防御对话框
		m_dlgs['fightresult'] = FightResultDlg.snew(m_g); // 战斗结果对话框
		m_dlgs['worldbossresult'] = WorldBossResultDlg.snew(m_g); m_syncs['worldbossresult'] = true;// 战斗结果对话框
		m_dlgs['strategy'] = new StrategyDlg(m_g); // 计谋对话框
		m_dlgs['usestrategy'] = new UseStrategyDlg(m_g); // 使用计谋对话框
		m_dlgs['appointhero'] = new AppointHeroDlg(m_g); // 任命英雄对话框
		m_dlgs['selectsteeltype'] = SelectSteelTypeDlg.snew(m_g); // 选择修炼模式对话框
		m_dlgs['recruithero'] = new RecruitHeroDlg(m_g); m_syncs['recruithero'] = true;// 招募英雄对话框
		m_dlgs['militaryop'] = MilitaryOpDlg.snew(m_g); // 军情操作对话框
		m_dlgs['buyitemlist'] = new BuyItemListDlg(m_g); // 购买道具列表对话框
		m_dlgs['manageshop'] = new ManageShopDlg(m_g); // 店面管理对话框
		m_dlgs['cansaleitem'] = new CanSaleItemDlg(m_g); // 开店对话框
		m_dlgs['saleupinput'] = new SaleUpInputDlg(m_g); // 物品上架时的数量和价格输入对话框
		m_dlgs['shopslist'] = new ShopsListDlg(m_g); // 商城列表对话框
		m_dlgs['saleshop'] = new SaleShopDlg(m_g); // 某人的商店对话框
		
		m_dlgs['midwait'] = new WaitmidDlg(m_g); // 打开其他对话框时显示的等待进度对话框
		
		m_dlgs['clearrolepp'] = new ClearRolePPDlg(m_g);// 主角洗点对话框
		m_dlgs['roleassignexp'] = RoleAssignExpDlg.snew(m_g);// 英雄经验池分配对话框
		m_dlgs['worldmap'] = WorldMapDlg.snew(m_g);// 世界地图对话框
		
		m_dlgs['armop'] = ArmOpDlg.snew(m_g);// 装备操作对话框
		m_dlgs['upgradegem'] = UpgradeGemDlg.snew(m_g);// 宝石升级对话框
		m_dlgs['inputcood'] = InputCoodDlg.snew(m_g);// 输入坐标位置对话框
		m_dlgs['selffield'] = SelfFieldDlg.snew(m_g);// 我的野地操作dlg
		m_dlgs['selffieldslist'] = SelfFieldsListDlg.snew(m_g);// 我的野地列表对话框
		m_dlgs['emptyfield'] = EmptyFieldDlg.snew(m_g); m_syncs['emptyfield'] = true;// 空地对话框
		m_dlgs['rolecity'] = RoleCityDlg.snew(m_g); m_syncs['rolecity'] = true;// 君主的地块对话框
		m_dlgs['rolecitymodal'] = RoleCityDlg.snew(m_g, true); m_syncs['rolecity'] = true;// 君主的地块对话框
		m_dlgs['field'] = FieldDlg.snew(m_g); m_syncs['field'] = true;// 野地地块对话框
		m_dlgs['createsubcity'] = CreateSubCityDlg.snew(m_g); m_syncs['createsubcity'] = true;// 野地地块对话框
		m_dlgs['jitan'] = JiTanDlg.snew(m_g); m_syncs['jitan'] = true;// 祭坛对话框
		m_dlgs['selecticon'] = SelectIconDlg.snew(m_g); m_syncs['selecticon'] = true;// 选择君主头像
		m_dlgs['testanim'] = TestAnimDlg.snew(m_g); m_syncs['testanim'] = true;// 测试动画
		m_dlgs['fightmap'] = FightMapDlg.snew(m_g); // 战斗对话框
		m_dlgs['allilist'] = AlliListDlg.snew(m_g); // 联盟列表
		m_dlgs['selfallimemlist'] = SelfAlliMemListDlg.snew(m_g); // 自己联盟成员列表
		m_dlgs['otherallimemlist'] = OtherAlliMemListDlg.snew(m_g); // 其他联盟成员列表
		m_dlgs['allitransfer'] = AlliTransferDlg.snew(m_g); m_syncs['allitransfer'] = true; // 盟主禅让
		m_dlgs['alliuntransfer'] = AlliUnTransferDlg.snew(m_g); m_syncs['alliuntransfer'] = true; // 取消盟主禅让
		m_dlgs['allisubscribe'] = AlliSubscribeDlg.snew(m_g);  // 联盟捐献
		m_dlgs['alliapplylist'] = AlliApplyListDlg.snew(m_g);  // 联盟申请列表
		m_dlgs['allimerge'] = AlliMergeDlg.snew(m_g);  m_syncs['allimerge'] = true;// 联盟合并
		m_dlgs['allimeminfo'] = AlliMemInfoDlg.snew(m_g);  m_syncs['allimeminfo'] = true;// 联盟成员操作表
		m_dlgs['alliauctionbuy'] = AlliAuctionBuyDlg.snew(m_g);  m_syncs['alliauctionbuy'] = true;// 联盟竞价操作界面
		m_dlgs['allimysell'] = AlliMySellDlg.snew(m_g);  m_syncs['allimysell'] = true;// 联盟中我要拍卖
		m_dlgs['reinforcement'] = ReinforcementDlg.snew(m_g);// 查看援军面板
		
		m_dlgs['settradingarea'] = SetTradingAreaDlg.snew(m_g);// 设置商圈对话框
		m_dlgs['tipmsgbox'] = TipMsgBox.snew(m_g); m_syncs['tipmsgbox'] = true;// 提示msgbox，无法主动关闭
		m_dlgs['diecitysetpos'] = DieCitySetPos.snew(m_g); // 忘城设置位置对话框
		
		m_dlgs['actskiplayer'] = ActSkipLayerDlg.snew(m_g); // 跳层询问对话框
		m_dlgs['actgainskiplayergift'] = ActGainSkipLayerGiftDlg.snew(m_g); // 跳层补领对话框
		m_dlgs['acttowerlastgetgifts'] = ActTowerLastGetGiftsDlg.snew(m_g); // 查看本次千层塔的物品获得列表
		
		m_dlgs['imghelp'] = ImgHelpDlg.snew(m_g); // 图像形式的帮助对话框
		m_dlgs['newcomerhelper'] = NewcomerHelper.snew(m_g); // 新手帮助对话框
		
		// 已经是非模式的
		m_dlgs['selpip'] = new SelPipDlg(m_g); // 选择种子
		m_dlgs['exchange'] = ExchangeDlg.snew(m_g, 'exchange', m_openListener); // 兑换对话框
		m_dlgs['buygold'] = BuyGoldDlg.snew(m_g); m_syncs['buygold'] = true;// 金币充值对话框
		m_dlgs['yellowdiamond'] = YellowdiamondDlg.snew(m_g); // 黄砖特权对话框
		m_dlgs['bluediamond'] = BluediamondDlg.snew(m_g); // 蓝砖特权对话框
		m_dlgs['blue3366diamond'] = Blue3366DiamondDlg.snew(m_g); // 3366特权对话框

		m_dlgs['payact'] = PayActDlg.snew(m_g); // 充值活动
		m_dlgs['worldboss'] = WorldBossDlg.snew(m_g); // 世界boss主界面
		m_dlgs['worldbossrank'] = WorldBossRankDlg.snew(m_g); // 世界boss排名界面
		m_dlgs['worldbossalligift'] = WorldBossAlliGiftDlg.snew(m_g); // 世界boss联盟排名物品掉落

		// 模式对话框
		m_dlgs['createrole'] = CreateRoleDlg.snew(m_g); // 创建角色对话框
		m_dlgs['inputnum'] = new InputNumDlg(m_g);//数字输入对话框
		m_dlgs['inputnumex'] = new InputNumDlg(m_g, uicfg.comm.inputnumdlgex);//数字输入对话框
		m_dlgs['inputtext'] = new InputTextDlg(m_g);//文本输入对话框
		m_dlgs['inputareatext'] = new InputAreaTextDlg(m_g);//文本输入对话框
		m_dlgs['waiting'] = WaitingDlg.snew(m_g); m_syncs['waiting'] = true;//等待对话框
		
		if ( TQ.isMobile() ) {
			m_dlgs['chatpanel'] = ChatPanelDlg.snew(m_g);//聊天对话框
		}
		
		m_dlgs['autobuild'] = AutoBuildDlg.snew(m_g);//自动建造对话框
		m_dlgs['vip'] = VipDlg.snew(m_g);//vip对话框
		m_dlgs['gonggao'] = GongGaoDlg.snew(m_g);  m_syncs['gonggao'] = true;//公告
		
		m_dlgs['npc'] = NpcDlg.snew(m_g);  m_syncs['npc'] = true;//npc
		log('....uimgr: 1 ');
		m_dlgs['bindguest'] = BindGuestDlg.snew(m_g);  m_syncs['bindguest'] = true;//npc
		log('....uimgr: 2 ');
	};
	
	var _initPanels = function(){
		m_panels['main'] = new MainPanel(m_g); // 游戏主面板
	};

	//UIMgr-unittest-end
}).snew();
