require('./tqMsgSender.js');

var TestCaseMsgSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		FarmSender.initg(this.g);
		this.g.clearSendMsg();
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.testSendGetFarm = function(){
		FarmSender.sendGetFarm(1, 2);
		assert(this.g.getSendMsg() == '{cmd=84,subcmd=1,ver=1,roleId=2}');
	};
	
	this.testSendGetFarmBlocks = function(){
		FarmSender.sendCompleteFarmBlocks(1, [2,3]);
		assert(this.g.getSendMsg() == '{cmd=84,subcmd=3,uid=1,ids={2,3}}');
	};
	
	this.testSendGetFarmInfo = function(){
		FarmSender.sendGetFarmLog(1);
		assert(this.g.getSendMsg() == '{cmd=84,subcmd=4,ver=1}');
	};
	
	this.testSendGatherFarmRes = function(){
		FarmSender.sendGatherFarmRes(1,2);
		assert(this.g.getSendMsg() == '{cmd=84,subcmd=5,roleId=1,blockId=2}');
	};
	
	this.testSendGatherAllFarmRes = function(){
		FarmSender.sendGatherAllFarmRes(1);
		assert(this.g.getSendMsg() == '{cmd=84,subcmd=6,roleId=1}');
	};
	
	this.testSendPreGatherFarmRes = function(){
		FarmSender.sendPreGatherFarmRes(1,2);
		assert(this.g.getSendMsg() == '{cmd=84,subcmd=7,roleId=1,blockId=2}');
	};
	
	this.testSendInitFarm = function(){
		FarmSender.sendInitFarm(1,2);
		assert(this.g.getSendMsg() == '{cmd=84,subcmd=8,roleId=1,blockId=2}');
	};
	
	this.testSendInputFarm = function(){
		FarmSender.sendInputFarm(1,2);
		assert(this.g.getSendMsg() == '{cmd=84,subcmd=9,blockId=1,resid=2}');
	};
	
	this.test_sendGetCanGatherFlags = function(){
		var roleIds = [];
		FarmSender.sendGetCanGatherFlags(this.g, roleIds, 0);
		assert(this.g.getSendMsg() == '');
		
		roleIds = [1,2];
		FarmSender.sendGetCanGatherFlags(this.g, roleIds, 0);
		assert(this.g.getSendMsg() == '{cmd=84,subcmd=10,count=2,id1=1,id2=2}');
	};
	
	this.testSendGetDetailHero = function(){
		HeroSender.sendGetDetail(this.g, 1);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=1,id=1}');
	};
	
	this.testSendGetAllHeros = function(){
		HeroSender.sendGetAllHeros(this.g);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=0}');
	};
	
	this.testSendFireHero = function(){
		HeroSender.sendFire(this.g, 1);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=8,id=1}');
	};
	
	this.testSendLockHero = function(){
		HeroSender.sendLock(this.g, 1);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=33,id=1}');
	};
	
	this.testSendUnLockHero = function(){
		HeroSender.sendUnLock(this.g, 1);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=34,id=1}');
	};
	
	this.testSendChangeName = function(){
		HeroSender.sendChangeName(this.g, 1, "name1");
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=2,id=1,name="name1"}');
	};
	
	this.testRoleSendAssignExp = function(){
		RoleSender.sendAssignExp(this.g, 1, 100)
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.ROLEBASE+',subcmd=5,heroid=1,exp=100}');
		
		this.g.clearSendMsg();
		RoleSender.sendAssignExp(this.g, 2, 200)
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.ROLEBASE+',subcmd=5,heroid=2,exp=200}');
	};
	
	this.testRoleSendSavePP = function(){
		RoleSender.sendSavePP(this.g, ',p0=1,p1=2,p3=3')
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.ROLEBASE+',subcmd=2,p0=1,p1=2,p3=3}');
	};
	
	this.testRoleSendChangeCity = function(){
		RoleSender.sendChangeCity(this.g, 1)
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.ROLEBASE+',subcmd=3,cid=1}');
		
		this.g.clearSendMsg();
		RoleSender.sendChangeCity(this.g, 2)
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.ROLEBASE+',subcmd=3,cid=2}');
	};
	
	this.testRoleSendClearPP = function(){
		RoleSender.sendClearPP(this.g, 1,2);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.ROLEBASE+',subcmd=4,fval=1,pval=2}');
	};
	
	this.test_sendSelfSign = function(){
		RoleSender.sendSelfSign(this.g, 'I am good man');
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.ROLEBASE+',subcmd=6,intr="I am good man"}');
	};
	
	this.test_role_sendSearchRoleForRank = function(){
		RoleSender.sendSearchRoleForRank(this.g, 'role');
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.ROLEBASE+',subcmd=7,role="role"}');
	};
	
	this.test_role_sendGetPageRankRoles = function(){
		RoleSender.sendGetPageRankRoles(this.g, 1);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.ROLEBASE+',subcmd=8,pageNo=1}');
	};
	
	this.testSendUseItem = function(){
		UseItemSender.send(this.g, {id:1,resid:2}, 3, {type:4,id:5,cid:6,msg:'1'});
		assert(this.g.getSendMsg() == '{cmd=59,id=1,resid=2,number=3,ttype=4,tid=5,tcid=6,tmsg="1"}' );
	};
	
	this.testTreatmentHero = function(){
		HeroSender.sendTreatment(this.g, 1);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=35,id=1}');
	};
	
	this.testTreatmentHeros = function(){
		HeroSender.sendTreatments(this.g, [1,2,0,6]);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=44,count=3,id1=1,id2=2,id3=6}');
	};
	
	this.testSendHeroAssignPP = function(){
		HeroSender.sendAssignPP(this.g, 1, ',p0=0,p1=1,p2=2');
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=4,id=1,p0=0,p1=1,p2=2}');
	};
	
	this.testHeroSendClearPP = function(){
		HeroSender.sendClearPP(this.g, 1);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=6,id=1}');
	};
	
	this.testHeroSendConge = function(){
		HeroSender.sendConge(this.g, 1);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=36,id=1}');
	};
	
	this.testHeroSendConfer = function(){
		HeroSender.sendConfer(this.g, 1, 2);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=37,id=1,official=2}');
	};
	
	this.testHeroSendSteelSkeleton = function(){
		HeroSender.sendSteelSkeleton(this.g, 1);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=39,id=1}');
	};
	
	this.testHeroSendInsightSkill = function(){
		HeroSender.sendInsightSkill(this.g, 1);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=40,id=1}');
	};
	
	this.testHeroSendSkillSteel = function(){
		HeroSender.sendSkillSteel(this.g, 1, 2, 10);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=41,id=1,skillid=2,stime=10}');
	};

	this.testHeroSendWearTSkill = function(){
		HeroSender.sendWearTSkill(this.g, 1, 2);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=43,id=1,skillid=2}');
	};
	
	this.testHeroSendUnWearTSkill = function(){
		HeroSender.sendUnWearTSkill(this.g, 1);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=45,id=1}');
	};
	
	this.testHeroSendWearArm = function(){
		HeroSender.sendWearArm(this.g, 1, 2);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=46,heroId=1,itemId=2}');
	};
	
	this.testHeroSendUnWearArm = function(){
		HeroSender.sendUnWearArm(this.g, 1, 2);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=47,heroId=1,armPos=2}');
	};
	
	this.testSendStopHeroSteel = function(){
		HeroSender.sendStopHeroSteel(this.g, 1);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=48,heroId=1}');
	};
	
	this.testSendStopAllHerosSteel = function(){
		HeroSender.sendStopAllHerosSteel(this.g);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=48,heroId=-1}');
	};
	
	this.test_sendHerosSteel = function(){
		var p_steelType = 'steel';
		var p_heros = [{id:1},{id:2}];
		var p_steelQuarters = [10,20];
		var p_efficiencys = null;
		HeroSender.sendHerosSteel(this.g, p_steelType, p_heros, p_steelQuarters, p_efficiencys);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=49,steelType=0,count=2,hid1=1,sq1=10,eff1=0,hid2=2,sq2=20,eff2=0}');
		
		p_efficiencys = [{cur:false},{cur:true}];
		HeroSender.sendHerosSteel(this.g, p_steelType, p_heros, p_steelQuarters, p_efficiencys);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=49,steelType=0,count=2,hid1=1,sq1=10,eff1=0,hid2=2,sq2=20,eff2=1}');
		
		p_steelType = 'highsteel';
		HeroSender.sendHerosSteel(this.g, p_steelType, p_heros, p_steelQuarters, p_efficiencys);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=49,steelType=1,count=2,hid1=1,sq1=10,eff1=0,hid2=2,sq2=20,eff2=1}');
		
		p_steelType = 'vip1steel';
		HeroSender.sendHerosSteel(this.g, p_steelType, p_heros, p_steelQuarters, p_efficiencys);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=49,steelType=2,count=2,hid1=1,sq1=10,eff1=0,hid2=2,sq2=20,eff2=1}');
		
		p_steelType = 'vip2steel';
		HeroSender.sendHerosSteel(this.g, p_steelType, p_heros, p_steelQuarters, p_efficiencys);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=49,steelType=3,count=2,hid1=1,sq1=10,eff1=0,hid2=2,sq2=20,eff2=1}');
	};
	
	this.test_sendUpgradeNAttr = function(){
		HeroSender.sendUpgradeNAttr(this.g, 1);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.HERORES+',subcmd=50,heroId=1}');
	};
	
	this.testSendGetSoldiers = function(){
		SoldierSender.sendGetSoldiers(this.g);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.SOLDIERRES+',subcmd=1}');
	};
	
	this.testSendTrainingSoldiers = function(){
		SoldierSender.sendTraining(this.g, 1, 2);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.SOLDIERRES+',subcmd=2,id=1,num=2}');
	};
	
	this.testSendUpdSoldier = function(){
		SoldierSender.sendUpgrade(this.g, 1, 2);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.SOLDIERRES+',subcmd=3,id=1,num=2}');
	};
	
	this.testSendDemobSoldier = function(){
		SoldierSender.sendDemob(this.g, 1, 2);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.SOLDIERRES+',subcmd=4,id=1,num=2}');
	};
	
	this.testConfrimSoldiersAssign = function(){
		var p_assigns = [];
		SoldierSender.sendConfirmSoldiersAssign(this.g, p_assigns);
		assertEQ ( this.g.getSendMsg(), '' );
		
		var p_assigns = [{id:1,resid:2,number:3},{id:2,resid:4,number:6}];
		SoldierSender.sendConfirmSoldiersAssign(this.g, p_assigns);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.SOLDIERRES+',subcmd=8,count=2,hid1=1,sid1=2,snum1=3,hid2=2,sid2=4,snum2=6}');
	};	
	
	this.testGetCultures = function(){
		CultureSender.sendGetCultures(this.g);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.CULTURE+',subcmd=1}');
	};
	
	this.testLearnCulture = function(){
		CultureSender.sendLearn(this.g, 1);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.CULTURE+',subcmd=2,id=1}');
	};
	
	this.testCancelLearnCulture = function(){
		CultureSender.sendCancelLearn(this.g);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.CULTURE+',subcmd=3}');
	};
	
	this.getSendGetMilitary = function(){
		MilitarySender.sendGetMilitary(this.g);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.MILITARY+',subcmd=0}')
	};
	
	this.testSendExped= function(){
		MilitarySender.sendExped(this.g, {type:1,id:2}, 1, 1001, [1,2,0,6]); // (g, target, expedType, lineup, heroIds)
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.MILITARY+',subcmd=1,ttype=1,tid=2,expedType=1,lineup=1001,count=4,hid1=1,hid2=2,hid3=0,hid4=6}');
	};
	
	this.testSendDeleteFavoriteTarget = function(){
		MilitarySender.sendDelFavoriteTarget(this.g, 1);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.MILITARY+',subcmd=2,id=1}');
	};
	
	this.testSendDefaultTeam = function(){
		MilitarySender.sendDefaultTeam(this.g, 1, 1001, [0,2,3,5,0]);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.MILITARY+',subcmd=3,teamid=1,lineup=1001,count=5,hid1=0,hid2=2,hid3=3,hid4=5,hid5=0}');
	};
	
	this.testSendGetAllArmys = function(){
		MilitarySender.sendGetAllArmys(this.g);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.MILITARY+',subcmd=4}');
	};
	
	this.testSendCallBackArmy = function(){
		MilitarySender.sendCallBackArmy(this.g, 1);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.MILITARY+',subcmd=5,armyId=1}');
	};
	
	this.test_sendRepatriateArmy = function(){
		MilitarySender.sendRepatriateArmy(this.g, 1);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.MILITARY+',subcmd=6,armyId=1}');
	};
	
	this.test_sendAddFavorite = function(){
		MilitarySender.sendAddFavorite(this.g, 1);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.MILITARY+',subcmd=7,gridId=1}');
	};
	
	this.test_sendDeclareFight = function(){
		MilitarySender.sendDeclareFight(this.g, 1);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.MILITARY+',subcmd=8,targetId=1}');
	};
	
	this.test_sendGetFavorites = function(){
		MilitarySender.sendGetFavorites(this.g);
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.MILITARY+',subcmd=9}');
	};
	
	this.test_sendSaveForceLineUp = function(){
		var type = 1;
		var lineup = 180001;
		var heroIds = [1,0,2];
		MilitarySender.sendSaveForceLineUp(this.g, type, lineup, heroIds);
		var expectStr =  '{cmd='+NETCMD.MILITARY+',subcmd=10,type=1,lineup=180001,count=3,hid1=1,hid2=0,hid3=2}'
		assertEQ(this.g.getSendMsg(), expectStr);
	};
	
	this.test_sendGetForceLineUp = function(){
		MilitarySender.sendGetForceLineUp(this.g);
		var expectStr =  '{cmd='+NETCMD.MILITARY+',subcmd=11}'
		assertEQ(this.g.getSendMsg(), expectStr);
	};
	
	this.test_sendGetMails = function(){
		MailSender.sendGetMails(this.g);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.MAIL+',subcmd=1}' );
	};
	
	this.test_sendGetDetailMail = function(){
		MailSender.sendGetDetailMail(this.g, 1);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.MAIL+',subcmd=2,id=1}' );
	};
	
	this.test_sendMail = function(){
		MailSender.sendMail(this.g, 'to', 'title', 'msg');
		assert ( this.g.getSendMsg() == '{cmd=93,subcmd=3,to="to",title="title",msg="msg"}' );
	};
	
	this.test_sendDelMails = function(){
		MailSender.sendDelMails(this.g, []);
		assert ( this.g.getSendMsg() == '' );
		
		MailSender.sendDelMails(this.g, [1,2]);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.MAIL+',subcmd=4,cnt=2,id1=1,id2=2}' );
	};	
	
	this.test_sendGetMailItems = function(){
		MailSender.sendGetItems(this.g, 1);
		assert ( this.g.getSendMsg() == '{cmd=93,subcmd=5,id=1}' );
	};
	
	this.test_sendEnterCity = function(){
		MapSender.sendEnterCity(this.g, 1);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.MAP+',subcmd=1,id=1}' );
	};
	
	this.test_sendBuyItem_shop = function(){
		ShopSender.sendBuyItem(this.g, 1, 2, {id:0, resid:3});
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.SHOP+',subcmd=1,paytype=1,id=0,resid=3,num=2}' );
	};
	
	this.test_sendGetShopSalesList_shop = function(){
		ShopSender.sendGetShopSalesList(this.g);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.SHOP+',subcmd=2}' );
	};
	
	this.test_sendSaleItem_shop = function(){
		ShopSender.sendSaleItem(this.g, {id:1});
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.SHOP+',subcmd=3,id=1}' );
	};
	
	this.test_sendBuyGold = function(){
		var resid = 1000;
		var number = 2;
		ShopSender.sendBuyGold(this.g, resid, number);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.SHOP+',subcmd=4,id=1000,number=2}' );
	};
	
	this.test_sendDecomposeIds = function(){
		ItemOpSender.sendDecomposeIds(this.g, [1,2]);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.ITEMOP+',subcmd=1,count=2,id1=1,id2=2}' );
	};
	
	this.test_sendIntensifyArm = function(){
		ItemOpSender.sendIntensifyArm(this.g, 2, 1);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.ITEMOP+',subcmd=2,hid=2,id=1}' );
	};
	
	this.test_sendBesetGem = function(){
		ItemOpSender.sendBesetGem(this.g, 1, 2, 0, 3);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.ITEMOP+',subcmd=3,hid=1,id=2,gpos=0,gid=3}' );
	};
	
	this.test_sendUnbesetGem = function(){
		ItemOpSender.sendUnbesetGem(this.g, 1, 2, 0);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.ITEMOP+',subcmd=4,hid=1,id=2,gpos=0}' );
	};
	
	this.test_sendUnbesetAllGems = function(){
		ItemOpSender.sendUnbesetAllGems(this.g, 1, 2);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.ITEMOP+',subcmd=4,hid=1,id=2,gpos=-1}' );
	};
	
	this.test_sendCombineGems = function(){
		ItemOpSender.sendCombineGems(this.g, 5, 4, false);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.ITEMOP+',subcmd=5,gid=5,clevel=4,batch=0}' );
		
		ItemOpSender.sendCombineGems(this.g, 5, 4, true);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.ITEMOP+',subcmd=5,gid=5,clevel=4,batch=1}' );
	};
	
	this.test_sendUpgradeGem = function(){
		ItemOpSender.sendUpgradeGem(this.g, 3, 2, 1, 5);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.ITEMOP+',subcmd=6,hid=3,id=2,gpos=1,gid=5}' );
	};
	
	this.test_sendDropItem = function(){
		ItemOpSender.sendDropItem(this.g, {id:1});
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.ITEMOP+',subcmd=7,id=1}' );
	};
	
	this.test_sendGetFieldsByPos = function(){
		OutFieldSender.sendGetFieldsByPos(this.g, {x:1, y:2});
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.OUTFIELD+',subcmd=1,posX=1,posY=2}');
	};
	
	this.test_sendGetFieldDetail = function(){
		OutFieldSender.sendGetFieldDetail(this.g, 1);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.OUTFIELD+',subcmd=2,gridId=1}');
	};
	
	this.test_sendGetFieldDetailByRole = function(){
		OutFieldSender.sendGetFieldDetailByRole(this.g, 'role');
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.OUTFIELD+',subcmd=2,roleName="role"}');
	};
	
	this.test_sendRefreshFieldsByLastViewPos = function(){
		OutFieldSender.sendRefreshFieldsByLastViewPos(this.g);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.OUTFIELD+',subcmd=3}');
	};
	
	this.test_sendEnterOutField = function(){
		OutFieldSender.sendEnterOutField (this.g);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.OUTFIELD+',subcmd=4}');
	};	
	
	this.test_sendGetAllFriends = function(){
		FriendSender.sendGetAllFriends(this.g);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.FRIEND+',subcmd=1}');
	};
	
	this.test_sendApplyFriend = function(){
		this.g.getImgr().getFriends().friends = [{roleName:'role1'}];
		this.mm.mock(this.g.getGUI(), 'sysMsgTips');
		FriendSender.sendApplyFriend(this.g, 'role');
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.FRIEND+',subcmd=2,name="role"}');
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_NORMAL, rstr.ids[100059].msg] );
		
		this.mm.clear();
		FriendSender.sendApplyFriend(this.g, 'role1');
		assertEQ ( this.mm.params['sysMsgTips'], [SMT_NORMAL, rstr.ids[100045].msg] );
	};
	
	this.test_sendAgreeApplyFriend = function(){
		FriendSender.sendAgreeApplyFriend(this.g, 1);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.FRIEND+',subcmd=3,id=1}');
	};
	
	this.test_sendRejectApplyFriend = function(){
		FriendSender.sendRejectApplyFriend(this.g, 1);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.FRIEND+',subcmd=4,id=1}');
	};
	
	this.test_sendDeleteFriend = function(){
		FriendSender.sendDeleteFriend(this.g, 1);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.FRIEND+',subcmd=5,id=1}');
	};
	
	this.test_sendFriendChat = function(){
		FriendSender.sendFriendChat(this.g, 1, 'hello');
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.FRIEND+',subcmd=6,id=1,msg="hello"}');
	};
	
	this.test_sendGetAllSelfFields = function(){
		SelfFieldSender.sendGetAllSelfFields(this.g, 1);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.SELFFIELD+',subcmd=0}');
	};
	
	this.test_sendStartCollect = function(){
		SelfFieldSender.sendStartCollect(this.g, 1);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.SELFFIELD+',subcmd=1,fieldId=1}');
	};
	
	this.test_sendStopCollect = function(){
		SelfFieldSender.sendStopCollect(this.g, 1);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.SELFFIELD+',subcmd=2,fieldId=1}');
	};
	
	this.test_sendGiveUpField = function(){
		SelfFieldSender.sendGiveUpField(this.g, 1);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.SELFFIELD+',subcmd=3,fieldId=1}');
	};
	
	this.test_sendRecallArmy = function(){
		SelfFieldSender.sendRecallArmy(this.g, 1);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.SELFFIELD+',subcmd=4,fieldId=1}');
	};
	
	this.test_sendGetCanGetRes = function(){
		this.mm.mock(this.g, 'send');
		SelfFieldSender.sendGetCanGetRes(this.g, 1, 2);
		assertEQ ( this.mm.params['send'], [null, '{cmd='+NETCMD.SELFFIELD+',subcmd=5,fieldId=1}']);
	};
});

var TestCaseCreateRoleSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendCreateRole = function(){
		CreateRoleSender.sendCreateRole(this.g, 'role', 101);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.CREATEROLE+',subcmd=0,rname="role",icon=101,bd=0}');
	};
	
	this.test_sendCheckName = function(){
		CreateRoleSender.sendCheckName(this.g, 'role');
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.CREATEROLE+',subcmd=1,rname="role"}');
	};
	
	this.test_sendGetRandName = function(){
		CreateRoleSender.sendGetRandName(this.g, ROLE_SEX.FEMALE);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.CREATEROLE+',subcmd=2,sex=' + ROLE_SEX.FEMALE  + '}');
	};
	
	this.test_sendGetRandPos = function(){
		CreateRoleSender.sendGetRandPos(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.CREATEROLE+',subcmd=3}');
	};
	
	this.test_sendSetPos = function(){
		CreateRoleSender.sendSetPos(this.g, {x:1, y:2});
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.CREATEROLE+',subcmd=4,x=1,y=2}');
	};
});

var TestCaseCityBuildSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendGetAllBuilds = function(){
		CityBuildSender.sendGetAllBuilds(this.g, 1);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.BUILDRES+',subcmd=1,cid=1}');
	};
	
	this.test_sendAddBuild = function(){
		CityBuildSender.sendAddBuild(this.g, 1, 2, 3);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.BUILDRES+',subcmd=2,cid=1,id=2,resid=3}');
	};
	
	this.test_sendUpgradeBuild = function(){
		CityBuildSender.sendUpgradeBuild(this.g, 1, 2);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.BUILDRES+',subcmd=3,cid=1,id=2}');
	};
	
	this.test_sendDownBuild = function(){
		CityBuildSender.sendDownBuild(this.g, 1, 2);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.BUILDRES+',subcmd=4,cid=1,id=2}');
	};
	
	this.test_sendCancelBuild = function(){
		CityBuildSender.sendCancelBuild(this.g, 1, 2);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.BUILDRES+',subcmd=5,cid=1,id=2}');
	};
	
	this.test_sendCreateSubCity = function(){
		CityBuildSender.sendCreateSubCity(this.g, 3, 2);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.BUILDRES+',subcmd=6,id=3,type=2}');
	};
	
	this.test_sendChangeSubCity = function(){
		CityBuildSender.sendChangeSubCity(this.g, 3, 2);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.BUILDRES+',subcmd=7,id=3,type=2}');
	};
});

var TestCaseAlliBuildSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendUpgrade = function(){
		AlliBuildSender.sendUpgrade(this.g, 1);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.BUILDRES+',subcmd=8,id=1}');
	};
	
	this.test_sendStop = function(){
		AlliBuildSender.sendStop(this.g, 1);
		assert ( this.g.getSendMsg() == '{cmd='+NETCMD.BUILDRES+',subcmd=9,id=1}');
	};
});

var TestCaseCityDefSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendGetCityDefInfo = function(){
		CityDefSender.sendGetCityDefInfo(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.CITYDEF+',subcmd=1}');
	};
	
	this.test_sendCancelBuilding = function(){
		CityDefSender.sendCancelBuilding(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.CITYDEF+',subcmd=2}');
	};	
	
	this.test_sendBuildCityDef = function(){
		var p_typeIdx = 1
		var p_number = 3
		CityDefSender.sendBuildCityDef(this.g, p_typeIdx, p_number);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.CITYDEF+',subcmd=3,type=2,number=3}');
	};
	
	this.test_sendDownCityDef = function(){
		var p_typeIdx = 1
		var p_number = 3
		CityDefSender.sendDownCityDef(this.g, p_typeIdx, p_number);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.CITYDEF+',subcmd=4,type=2,number=3}');
	};
	
	this.test_sendSaveDefArmy = function(){
		var p_lineup = 1;
		var p_heros = [1,2,3];
		CityDefSender.sendSaveDefArmy(this.g, p_lineup, p_heros);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.CITYDEF+',subcmd=5,lineup=1,count=3,hid1=1,hid2=2,hid3=3}');
	};
});

var TestCaseTowerSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendConfirmSoldiersAssign = function(){
		var p_assigns = [];
		TowerSender.sendConfirmSoldiersAssign(this.g, p_assigns);
		assertEQ ( this.g.getSendMsg(), '' );
		
		p_assigns = [{id:1, resid:150001001, number:10},{id:2, resid:150001002, number:20}];
		TowerSender.sendConfirmSoldiersAssign(this.g, p_assigns);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.TOWER+',subcmd=1,count=2,hid1=1,sid1=150001001,snum1=10,hid2=2,sid2=150001002,snum2=20}' );
	};
});

var TestCaseExchangeHeroExpSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendGetTimes = function(){
		ExchangeHeroExpSender.sendGetTimes(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.EXCHANGEEXP+',subcmd=1}' );
	};	
	
	this.test_sendExchange = function(){
		ExchangeHeroExpSender.sendExchange(this.g, 2);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.EXCHANGEEXP+',subcmd=2,times=2}' );
	};	
});

var TestCaseFightResStateSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendGetRefStates = function(){
		FightResStateSender.sendGetRefStates(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.FIGHTREFSTATE+',subcmd=1}' );
	};
});

var TestCaseRoleStateSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_getAllStates = function(){
		RoleStateSender.getAllStates(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ROLESTATE+',subcmd=1}' );
	};
	
	this.test_cancelState = function(){
		RoleStateSender.cancelState(this.g, 2);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ROLESTATE+',subcmd=2,state=2}' );
	};
});

var TestCaseChatSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendMsg = function(){
		var r_isTooFrequency = [true];
		this.mm.mock(ChatSender, '_isTooFrequency', r_isTooFrequency);
		this.mm.mock(ChatSender, '_updateLastTimes');
		this.mm.mock(ChatSender, '_encodeMessage', ['emsg']);
		
		ChatSender.sendMsg(this.g, CHAT_TARGET.WORLD, 'msg');
		assertEQ ( this.mm.walkLog, '_isTooFrequency' );
		assertEQ ( this.mm.params['_isTooFrequency'], [this.g, CHAT_TARGET.WORLD, 'msg'] );
		
		this.mm.clear();
		r_isTooFrequency[0] = false;
		ChatSender.sendMsg(this.g, CHAT_TARGET.WORLD, 'msg');
		assertEQ ( this.mm.walkLog, '_isTooFrequency,_updateLastTimes,_encodeMessage' );
		assertEQ ( this.mm.params['_updateLastTimes'], [this.g, CHAT_TARGET.WORLD, 'msg'] );
		assertEQ ( this.mm.params['_encodeMessage'], ['msg'] );
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.CHAT+',subcmd=0,target=' + CHAT_TARGET.WORLD + ',msg="emsg"}' );
	};
	
	this.test__isTooFrequency = function(){
		ChatSender.lastTimes[CHAT_TARGET.WORLD].lastTime = 10
		//ChatSender._updateLastTimes(this.g, CHAT_TARGET.WORLD, 'msg');
		this.g.setCurTimeMs(10 + ChatSender.lastTimes[CHAT_TARGET.WORLD].limitTime + 1);
		assertEQ ( ChatSender._isTooFrequency(this.g, CHAT_TARGET.WORLD, 'msg'), false );
		
		this.mm.mock(UIM.getPanel('chat'), 'appendMsgToCurChannel');
		this.g.setCurTimeMs(10 + ChatSender.lastTimes[CHAT_TARGET.WORLD].limitTime);
		ChatSender._updateLastTimes(this.g, CHAT_TARGET.WORLD, 'msg');
		assertEQ ( ChatSender._isTooFrequency(this.g, CHAT_TARGET.WORLD, 'msg'), true );
		assertEQ ( this.mm.params['appendMsgToCurChannel'], [ChatSender.lastTimes[CHAT_TARGET.WORLD].errorTip] );
		
		this.g.setCurTimeMs(10 + ChatSender.lastTimes[CHAT_TARGET.WORLD].limitTime-1);
		ChatSender._updateLastTimes(this.g, CHAT_TARGET.WORLD, 'msg');
		assertEQ ( ChatSender._isTooFrequency(this.g, CHAT_TARGET.WORLD, 'msg'), true );
	};
	
	this.test__updateLastTimes = function(){
		this.g.setCurTimeMs(10);
		ChatSender._updateLastTimes(this.g, CHAT_TARGET.WORLD, 'msg');
		assertEQ ( ChatSender.lastTimes[CHAT_TARGET.WORLD].lastTime, 10);
	};
	
	this.test__encodeMessage = function(){
		assertEQ ( ChatSender._encodeMessage('abc\n'), 'abc ');
		assertEQ ( ChatSender._encodeMessage('abc\n\r'), 'abc  ');
		assertEQ ( ChatSender._encodeMessage('abc\n\r"'), 'abc  \'');
	};
	
	this.test__getCheckTarget = function(){
		assertEQ ( ChatSender._getCheckTarget(CHAT_TARGET.WORLD, 'msg/'), CHAT_TARGET.WORLD );
		assertEQ ( ChatSender._getCheckTarget(CHAT_TARGET.STATE, 'msg/'), CHAT_TARGET.STATE );
		assertEQ ( ChatSender._getCheckTarget(CHAT_TARGET.ALLIANCE, 'msg/'), CHAT_TARGET.ALLIANCE );
		assertEQ ( ChatSender._getCheckTarget(CHAT_TARGET.ALLIANCE, '/msg'), CHAT_TARGET.PLAYER );
	};
});

var TestCaseAllianceSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};

	this.test_sendCreateAlli = function(){
		AllianceSender.sendCreateAlli(this.g, 'alliance', '好');
		var sendmsg = '{cmd='+NETCMD.ALLIANCE+',subcmd=1,name="alliance",flag="好"}';
		assertEQ ( this.g.getSendMsg(), sendmsg );
	};
	
	this.test_sendApplyJoin = function(){
		AllianceSender.sendApplyJoin(this.g, 'alliance');
		var sendmsg = '{cmd='+NETCMD.ALLIANCE+',subcmd=2,name="alliance"}';
		assertEQ ( this.g.getSendMsg(), sendmsg );
	};
	
	this.test_sendGetCurApplying = function(){
		AllianceSender.sendGetCurApplying(this.g);
		var sendmsg = '{cmd='+NETCMD.ALLIANCE+',subcmd=3}';
		assertEQ ( this.g.getSendMsg(), sendmsg );
	};
	
	this.test_sendGetAllianceDetail = function(){
		AllianceSender.sendGetAllianceDetail(this.g, 'alliance');
		var sendmsg = '{cmd='+NETCMD.ALLIANCE+',subcmd=4,name="alliance"}';
		assertEQ ( this.g.getSendMsg(), sendmsg );
	};
	
	this.test_sendGetInviteList = function(){
		AllianceSender.sendGetInviteList(this.g);
		var sendmsg = '{cmd='+NETCMD.ALLIANCE+',subcmd=5}';
		assertEQ ( this.g.getSendMsg(), sendmsg );
	};
	
	this.test_sendAgreeInvite = function(){
		var roleId = 1;
		var allianceId = 2;
		AllianceSender.sendAgreeInvite(this.g, roleId, allianceId);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=6,roleId=1,alliId=2}' );
	};
	
	this.test_sendIgnoreInvite = function(){
		var roleId = 1;
		var allianceId = 2;		
		AllianceSender.sendIgnoreInvite(this.g, roleId, allianceId);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=7,roleId=1,alliId=2}' );
	};
	
	this.test_sendGetAlliList = function(){
		var cityResId = 9900001;
		var pageNo = 2;
		AllianceSender.sendGetAlliList(this.g, cityResId, pageNo);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=8,cityResId=9900001,pageNo=2}' );
	};
	
	this.test_sendSearchAlliance = function(){
		var cityResId = 9900001;
		var allianceName = 'alli';
		AllianceSender.sendSearchAlliance(this.g, cityResId, allianceName);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=9,cityResId=9900001,name="alli"}' );
	};
	
	this.test_sendGetSelfMems = function(){
		var pageNo = 1;
		AllianceSender.sendGetSelfMems(this.g, pageNo);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=10,pageNo=1}' );
	};
	
	this.test_sendGetOtherMems = function(){
		var allianceName = 'name'
		var pageNo = 1;
		AllianceSender.sendGetOtherMems(this.g, allianceName, pageNo);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=11,name="name",pageNo=1}' );
	};
	
	this.test_sendGetMyAllianceDetail = function(){
		AllianceSender.sendGetMyAllianceDetail(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=12}' );
	};
	
	this.test_sendUpgradeAlliance = function(){
		AllianceSender.sendUpgradeAlliance(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=13}' );
	};
	
	this.test_sendModifyQQGroup = function(){
		AllianceSender.sendModifyQQGroup(this.g, 123);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=14,qq=123}' );
	};
	
	this.test_sendInvite = function(){
		AllianceSender.sendInvite(this.g, 'role');
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=15,role="role"}' );
	};
	
	this.test_sendDismiss = function(){
		AllianceSender.sendDismiss(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=16}' );
	};
	
	this.test_sendCancelDismiss = function(){
		AllianceSender.sendCancelDismiss(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=17}' );
	};
	
	this.test_sendExitAlliance = function(){
		AllianceSender.sendExitAlliance(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=18}' );
	};
	
	this.test_sendModifyIntroduce = function(){
		AllianceSender.sendModifyIntroduce(this.g, 'intro');
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=19,introduce="intro"}' );
	};
	
	this.test_sendModifyBulletin = function(){
		AllianceSender.sendModifyBulletin(this.g, 'bulletin');
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=20,bulletin="bulletin"}' );
	};
	
	this.test_sendGainTodayGift = function(){
		AllianceSender.sendGainTodayGift(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=21}' );
	};
	
	this.test_sendUpgradeLawLight = function(){
		AllianceSender.sendUpgradeLawLight(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=22}' );
	};
	
	this.test_sendLawLightBestow = function(){
		AllianceSender.sendLawLightBestow(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=23}' );
	};
	
	this.test_sendLawLightFeed = function(){
		AllianceSender.sendLawLightFeed(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=24,isAll=0}' );
	};
	
	this.test_sendLawLightFeedAll = function(){
		AllianceSender.sendLawLightFeedAll(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=24,isAll=1}' );
	};
	
	this.test_sendGetALeaders = function(){
		AllianceSender.sendGetALeaders(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=25}' );
	};
	
	this.test_sendTransferLeader = function(){
		AllianceSender.sendTransferLeader(this.g, 'role');
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=26,role="role"}' );
	};
	
	this.test_sendStopTransfer = function(){
		AllianceSender.sendStopTransfer(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=27}' );
	};
	
	this.test_sendContributeRes = function(){
		var resIdx = 1;
		var times = 2;
		AllianceSender.sendContributeRes(this.g, resIdx, times);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=28,resIdx=1,times=2}' );
	};
	
	this.test_sendGetTodaySortMems = function(){
		var pageNo = 1;
		AllianceSender.sendGetTodaySortMems(this.g, pageNo);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=29,pageNo=1}' );
	};
	
	this.test_sendGetAllSortMems = function(){
		var pageNo = 1;
		AllianceSender.sendGetAllSortMems(this.g, pageNo);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=30,pageNo=1}' );
	};
	
	this.test_sendAppointMember = function(){
		var role = 'role';
		var alliancePos = 1;
		AllianceSender.sendAppointMember(this.g, role, alliancePos);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=31,role="role",alliPos=1}' );
	};
	
	this.test_sendFireMember = function(){
		var role = 'role';
		AllianceSender.sendFireMember(this.g, role);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=32,role="role"}' );
	};
	
	this.test_sendAgreeApply = function(){
		var roleId = 10000;
		AllianceSender.sendAgreeApply(this.g, roleId);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=33,roleId=10000}' );
	};
	
	this.test_sendIgnoreApply = function(){
		var roleId = 10000;
		AllianceSender.sendIgnoreApply(this.g, roleId);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=34,roleId=10000}' );
	};
	
	this.test_sendGetEvents = function(){
		var pageNo = 1;
		AllianceSender.sendGetEvents(this.g, pageNo);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=35,pageNo=1}' );
	};
	
	this.test_sendGetApplyMerges = function(){
		AllianceSender.sendGetApplyMerges(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=36}' );
	};
	
	this.test_sendApplyMerge = function(){
		var allianceName = 'alliance';
		AllianceSender.sendApplyMerge(this.g, allianceName);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=37,name="alliance"}' );
	};
	
	this.test_sendAgreeMerge = function(){
		var allianceName = 'alliance';
		AllianceSender.sendAgreeMerge(this.g, allianceName);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=38,name="alliance"}' );
	};
	
	this.test_sendRefuseMerge = function(){
		var allianceName = 'alliance';
		AllianceSender.sendRefuseMerge(this.g, allianceName);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=39,name="alliance"}' );
	};
	
	this.test_sendGetAuctionInfo = function(){
		AllianceSender.sendGetAuctionInfo(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=40}' );
	};
	
	this.test_sendAuctionBuyItem = function(){
		var itemid = 1;
		var price = 10;
		AllianceSender.sendAuctionBuyItem(this.g, itemid, price);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=41,id=1,price=10}' );
	};
	
	this.test_sendSellItem = function(){
		var itemId = 1;
		var number = 2;
		var auctionPrice = 3;
		var fixedPrice = 4;
		AllianceSender.sendSellItem(this.g,  itemId, number, auctionPrice, fixedPrice);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=42,id=1,number=2,auctionPrice=3,fixedPrice=4}' );
	};
	
	this.test_sendCancelSellItem = function(){
		var itemId = 1;
		AllianceSender.sendCancelSellItem(this.g,  itemId);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=43,id=1}' );
	};
	
	this.test_sendGetSellItems = function(g){
		AllianceSender.sendGetSellItems(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ALLIANCE+',subcmd=44}' );
	};
});

var TestCaseOtherPlayerSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendGetBuildAddSpeed = function(){
		OtherPlayerSender.sendGetBuildAddSpeed(this.g, 'target');
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.OTHERPLAYERINFO+',subcmd=1,name="target"}' );
	};
});

var TestCaseTradingAreaSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendGetBuildAddSpeed = function(){
		TradingAreaSender.sendGetMyTradingInfo(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.TRADING_AREA+',subcmd=1}' );
	};
	
	this.test_sendStartTrading = function(){
		TradingAreaSender.sendStartTrading(this.g, false);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.TRADING_AREA+',subcmd=2,vip=0}' );
		TradingAreaSender.sendStartTrading(this.g, true);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.TRADING_AREA+',subcmd=2,vip=1}' );
	};
	
	this.test_sendCancelTrading = function(){
		TradingAreaSender.sendCancelTrading(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.TRADING_AREA+',subcmd=3}' );
	};
	
	this.test_sendSetTradingArea = function(){
		TradingAreaSender.sendSetTradingArea(this.g, [1000,2000]);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.TRADING_AREA+',subcmd=4,count=2,t1=1000,t2=2000}' );
	};
	
	this.test_sendGetMembers = function(){
		TradingAreaSender.sendGetMembers(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.TRADING_AREA+',subcmd=5}' );
	};
	
	this.test_sendGetMemDetail = function(){
		var roleId = 1;
		TradingAreaSender.sendGetMemDetail(this.g, roleId);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.TRADING_AREA+',subcmd=6,roleId=1}' );
	};
});

var TestCaseActTowerSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendGetBaseInfo = function(){
		ActTowerSender.sendGetBaseInfo(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACT_TOWER+',subcmd=1}' );
	};
	
	this.test_sendEnterTower = function(){
		var startLayer = 40;
		ActTowerSender.sendEnterTower(this.g, startLayer);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACT_TOWER+',subcmd=2,startLayer=40,gainGift=0}' );
		
		ActTowerSender.sendEnterTower(this.g, startLayer, false);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACT_TOWER+',subcmd=2,startLayer=40,gainGift=0}' );
		
		ActTowerSender.sendEnterTower(this.g, startLayer, true);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACT_TOWER+',subcmd=2,startLayer=40,gainGift=1}' );
	};
	
	this.test_sendExped = function(){
		ActTowerSender.sendExped(this.g, {type:1,id:2}, 1, 1001, [1,2,0,6]); // (g, target, expedType, lineup, heroIds)
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.ACT_TOWER+',subcmd=3,ttype=1,tid=2,expedType=1,lineup=1001,count=4,hid1=1,hid2=2,hid3=0,hid4=6}');
	};	
	
	this.test_sendLeaveTower = function(){
		ActTowerSender.sendLeaveTower(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACT_TOWER+',subcmd=4}' );
	};
	
	this.test_sendStartAutoFight = function(){
		ActTowerSender.sendStartAutoFight(this.g, [1,2],10);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACT_TOWER+',subcmd=5,count=2,hid1=1,hid2=2,toLayer=10}');
	};
	
	this.test_sendStopAutoFight = function(){
		ActTowerSender.sendStopAutoFight(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACT_TOWER+',subcmd=6}');
	};
	
	this.test_sendSearchRoleForRank = function(){
		ActTowerSender.sendSearchRoleForRank(this.g, 'role');
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACT_TOWER+',subcmd=7,role="role"}');
	};
	
	this.test_sendGetPageRankRoles = function(){
		ActTowerSender.sendGetPageRankRoles(this.g, 1);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACT_TOWER+',subcmd=8,pageNo=1}');
	};
	
	this.test_sendCheckAutoFight = function(){
		ActTowerSender.sendCheckAutoFight(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACT_TOWER+',subcmd=9}');
	};
});

var TestCaseActTerraceSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendGetBaseInfo = function(){
		ActTerraceSender.sendGetBaseInfo(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACT_TERRACE+',subcmd=1}' );
	};
	
	this.test_sendEnterTerrace = function(){
		var gateId = 3;
		ActTerraceSender.sendEnterTerrace(this.g, gateId);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACT_TERRACE+',subcmd=2,gateId=3}' );
	};
	
	this.sendExped = function(){
		ActTerraceSender.sendExped(this.g,{type:1,id:2}, 1, 1001, [1]);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACT_TERRACE+',subcmd=3,ttype=1,tid=2,expedType=1,lineup=1001,count=1,hid1=1}');
	};
	
	this.test_sendLeaveTerrace = function(){
		ActTerraceSender.sendLeaveTerrace(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACT_TERRACE+',subcmd=4}' );
	};
	
	this.test_sendStartAutoFight = function(){
		ActTerraceSender.sendStartAutoFight(this.g, [1], 4);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACT_TERRACE+',subcmd=5,count=1,hid1=1,toGate=4}');
	};
	
	this.test_sendStopAutoFight = function(){
		ActTerraceSender.sendStopAutoFight(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACT_TERRACE+',subcmd=6}');
	};
	
	this.test_sendCheckAutoFight = function(){
		ActTerraceSender.sendCheckAutoFight(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACT_TERRACE+',subcmd=7}');
	};
});

var TestCaseTaskSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendGetAllTasks = function(){
		TaskSender.sendGetAllTasks(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.TASK+',subcmd=0}' );
	};
	
	this.test_sendGetReward = function(){
		var taskId = 2;
		TaskSender.sendGetReward(this.g, taskId);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.TASK+',subcmd=1,taskId=2}' );
	};
	
	this.test_sendDoRoleTask = function(){
		var taskId = 3;
		TaskSender.sendDoRoleTask(this.g, taskId);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.TASK+',subcmd=2,taskId=3}' );
	};
	
	this.test_sendChangeEverydayTask = function(){
		var taskId = 4;
		TaskSender.sendChangeEverydayTask(this.g, taskId);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.TASK+',subcmd=3,taskId=4}' );
	};
	
	this.test_sendCompleteEverydayTask = function(){
		var taskId = 5;
		TaskSender.sendCompleteEverydayTask(this.g, taskId);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.TASK+',subcmd=4,taskId=5}' );
	};
	
	this.test_sendGetRewardByPrestige = function(){
		TaskSender.sendGetRewardByPrestige(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.TASK+',subcmd=5}' );
	};
	
	this.test_sendGetOnlineTaskReward = function(){
		TaskSender.sendGetOnlineTaskReward(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.TASK+',subcmd=6}' );
	};
	
	this.test_sendGetOnlineTaskInfo = function(){
		TaskSender.sendGetOnlineTaskInfo(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.TASK+',subcmd=7}' );
	};
	
	this.test_sendAddFavorite = function(){
		TaskSender.sendAddFavorite(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.TASK+',subcmd=8}' );
	};
	
	this.test_sendNewcomerTaskEnd = function(){
		TaskSender.sendNewcomerTaskEnd(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.TASK+',subcmd=9}' );
	};
});

var TestCaseActivityValSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendGetAllInfo = function(){
		ActivityValSender.sendGetAllInfo(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACTIVITY_VAL+',subcmd=1}' );
	};
	
	this.test_sendGetActReward = function(){
		ActivityValSender.sendGetActReward(this.g, 1);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACTIVITY_VAL+',subcmd=2,id=1}' );
	};
	
	this.test_sendSignIn = function(){
		ActivityValSender.sendSignIn(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACTIVITY_VAL+',subcmd=3}' );
	};
	
	this.test_sendGetSignReward = function(){
		ActivityValSender.sendGetSignReward(this.g, 1);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACTIVITY_VAL+',subcmd=4,id=1}' );
	};
	
	this.test_sendGetOnlineGoods = function(){
		ActivityValSender.sendGetOnlineGoods(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACTIVITY_VAL+',subcmd=5}' );
	};
	
	this.test_sendGetPayActReward = function(){
		var idx = 1;
		ActivityValSender.sendGetPayActReward(this.g, idx);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ACTIVITY_VAL+',subcmd=6,idx=1}' );
	};
});

var TestCaseNewcomerHelpSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendGetCurNode = function(){
		NewcomerHelpSender.sendGetCurNode(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.NEWCOMERHELP+',subcmd=1}' );
	};
});

var TestCaseItemInfoSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendGetCurNode = function(){
		ItemInfoSender.sendGetDetailItem(this.g, 10000, 1000);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.ITEM+',subcmd=1,roleId=10000,itemId=1000}' );
	};
});

var TestCaseExchangeSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendGetCurNode = function(){
		var dropId = 7000125;
		var count = 10;
		ExchangeSender.sendExchange(this.g, dropId, count);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.EXCHANGE+',subcmd=1,dropId=7000125,count=10}' );
	};
});

var TestCaseLogSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendLog = function(){
		LogSender.sendLog(this.g, 'msg1\"msg2\' \r\n msg3\rmsg4\nmsg5');
		var expectStr =  '{cmd='+NETCMD.CLT_LOG+',subcmd=1,browser=' + TQ.getBrowserType() + ',ver=0,msg="msg1 msg2    msg3 msg4 msg5"}';
		assertEQ ( this.g.getSendMsg(), expectStr );
	};
	
	this.test_sendSuggest = function(){
		LogSender.sendSuggest(this.g, 'msg1\"msg2\' \r\n msg3\rmsg4\nmsg5');
		var expectStr = '{cmd='+NETCMD.CLT_LOG+',subcmd=2,msg="msg1 msg2    msg3 msg4 msg5"}'
		assertEQ ( this.g.getSendMsg(), expectStr );
	};
});

var TestCasePaymentSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendStartPay = function(){
		PaymentSender.sendStartPay(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.PAYMENT+',subcmd=1}' );
	};
	
	this.test_sendStopPay = function(){
		PaymentSender.sendStopPay(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.PAYMENT+',subcmd=2}' );
	};
});

var TestCaseYellowDiamondSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendGetNewGift = function(){
		YellowDiamondSender.sendGetNewGift(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.YELLOWDIAMOND+',subcmd=1}' );
	};
	
	this.test_sendGetCommEveryDayGift = function(){
		YellowDiamondSender.sendGetCommEveryDayGift(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.YELLOWDIAMOND+',subcmd=2}' );
	};
	
	this.test_sendGetYearEveryDayGift = function(){
		YellowDiamondSender.sendGetYearEveryDayGift(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.YELLOWDIAMOND+',subcmd=3}' );
	};
	
	this.test_sendGetLevelGift = function(){
		YellowDiamondSender.sendGetLevelGift(this.g, 1);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.YELLOWDIAMOND+',subcmd=4,id=1}' );
	};
	
	this.test_sendGetInfo = function(){
		YellowDiamondSender.sendGetInfo(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.YELLOWDIAMOND+',subcmd=5}' );
	};
});

var TestCaseBlueDiamondSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendGetNewGift = function(){
		BlueDiamondSender.sendGetNewGift(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.BLUEDIAMOND+',subcmd=1}' );
	};
	
	this.test_sendGetCommEveryDayGift = function(){
		BlueDiamondSender.sendGetCommEveryDayGift(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.BLUEDIAMOND+',subcmd=2}' );
	};
	
	this.test_sendGetYearEveryDayGift = function(){
		BlueDiamondSender.sendGetYearEveryDayGift(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.BLUEDIAMOND+',subcmd=3}' );
	};
	
	this.test_sendGetLevelGift = function(){
		BlueDiamondSender.sendGetLevelGift(this.g, 1);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.BLUEDIAMOND+',subcmd=4,id=1}' );
	};
	
	this.test_sendGetInfo = function(){
		BlueDiamondSender.sendGetInfo(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.BLUEDIAMOND+',subcmd=5}' );
	};
	
	this.test_sendGetHighEveryDayGift = function(){
		BlueDiamondSender.sendGetHighEveryDayGift(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.BLUEDIAMOND+',subcmd=6}' );
	};
	
	this.test_sendGet3366EveryDayGift = function(){
		BlueDiamondSender.sendGet3366EveryDayGift(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.BLUEDIAMOND+',subcmd=7}' );
	};
});

var TestCaseDealGoldSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendResultSucc = function(){
		DealGoldSender.sendResultSucc(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.RESULT_BuyByGold+',subcmd=1}' );
	};
	
	this.test_sendResultCancel = function(){
		DealGoldSender.sendResultCancel(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.RESULT_BuyByGold+',subcmd=2}' );
	};
});

var TestCaseClientCfgSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendResultSucc = function(){
		this.g.getImgr().setCanPlayBackSound(true);
		ClientCfgSender.sendSoundFlag(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.CLT_CFG+',subcmd=1,idx=0,flag=0}' );
	};
	
	this.test_sendGongGaoVer = function(){
		res_gonggao.ver = 4;
		ClientCfgSender.sendGongGaoVer(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.CLT_CFG+',subcmd=2,ver=4}' );
	};
	
	this.test_sendSetHelpTip = function(){
		ClientCfgSender.sendSetHelpTip(this.g, 1);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.CLT_CFG+',subcmd=3,tipId=1}' );
	};
});

var TestCaseVipSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
});

var TestCaseAutoBuildSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_sendStartBuild = function(){
		AutoBuildSender.sendStartBuild(this.g, [2001, 1001, 3001]);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.AUTOBUILD+',subcmd=1,count=3,id1=2001,id2=1001,id3=3001}' );
	};
});

var TestCaseCDKeySender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_send = function(){
		CDKeySender.send(this.g, '151527FC6FE6516C2BDB');
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.CDKEY+',subcmd=1,cdkey="151527FC6FE6516C2BDB"}' );
	};
});

var TestCaseWorldBossrSender = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};

	this.test_sendGetInfo = function(){
		WorldBossrSender.sendGetInfo(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.WORLDBOSS+',subcmd=1}' );
	};
	
	this.test_sendExped = function(){
		WorldBossrSender.sendExped(this.g, {type:1,id:2}, 1, 1001, [1,2,0,6]); // (g, target, expedType, lineup, heroIds)
		assert(this.g.getSendMsg() == '{cmd='+NETCMD.WORLDBOSS+',subcmd=2,ttype=1,tid=2,expedType=1,lineup=1001,count=4,hid1=1,hid2=2,hid3=0,hid4=6}');
	};
	
	this.test_sendGetTodayGift = function(){
		WorldBossrSender.sendGetTodayGift(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.WORLDBOSS+',subcmd=3}' );
	};
	
	this.test_sendGuwu = function(){
		var guwuType = 1;
		var times = 10;
		WorldBossrSender.sendGuwu(this.g, guwuType, times);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.WORLDBOSS+',subcmd=4,t=1,times=10}' );
	};
	
	this.test_sendGetPersonRankGift = function(){
		WorldBossrSender.sendGetPersonRankGift(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.WORLDBOSS+',subcmd=5}' );
	};
	
	this.test_sendGetCountryRankGift = function(){
		WorldBossrSender.sendGetCountryRankGift(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.WORLDBOSS+',subcmd=6}' );
	};
	
	this.test_sendGetRankInfo = function(){
		WorldBossrSender.sendGetRankInfo(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.WORLDBOSS+',subcmd=7}' );
	};
	
	this.test_sendGetAlliGiftInfo = function(){
		WorldBossrSender.sendGetAlliGiftInfo(this.g);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.WORLDBOSS+',subcmd=8}' );
	};
});

var TestCaseRewardSender = JTestCase.ex({
	setUp : function(){
		TestCaseHelper.setUp(this);
	}
	
	,tearDown : function(){
		TestCaseHelper.tearDown(this);
	}
	
	,test_sendFirstHero : function(){
		RewardSender.sendFirstHero(this.g, 1);
		assertEQ ( this.g.getSendMsg(), '{cmd='+NETCMD.SEND_REWARD+',subcmd=1,nameIdx=1}' );
	}
});

tqMsgSender_t_main = function(suite) {
	suite.addTestCase(TestCaseMsgSender, 'TestCaseMsgSender');
	suite.addTestCase(TestCaseCreateRoleSender, 'TestCaseCreateRoleSender');
	suite.addTestCase(TestCaseCityBuildSender, 'TestCaseCityBuildSender');
	suite.addTestCase(TestCaseAlliBuildSender, 'TestCaseAlliBuildSender');
	suite.addTestCase(TestCaseCityDefSender, 'TestCaseCityDefSender');
	suite.addTestCase(TestCaseTowerSender, 'TestCaseTowerSender');
	suite.addTestCase(TestCaseExchangeHeroExpSender, 'TestCaseExchangeHeroExpSender');
	suite.addTestCase(TestCaseFightResStateSender, 'TestCaseFightResStateSender');
	suite.addTestCase(TestCaseRoleStateSender, 'TestCaseRoleStateSender');
	suite.addTestCase(TestCaseChatSender, 'TestCaseChatSender');
	suite.addTestCase(TestCaseAllianceSender, 'TestCaseAllianceSender');
	suite.addTestCase(TestCaseOtherPlayerSender, 'TestCaseOtherPlayerSender');
	suite.addTestCase(TestCaseTradingAreaSender, 'TestCaseTradingAreaSender');
	suite.addTestCase(TestCaseActTowerSender, 'TestCaseActTowerSender');
	suite.addTestCase(TestCaseActTerraceSender, 'TestCaseActTerraceSender');
	suite.addTestCase(TestCaseTaskSender, 'TestCaseTaskSender');
	suite.addTestCase(TestCaseActivityValSender, 'TestCaseActivityValSender');
	suite.addTestCase(TestCaseNewcomerHelpSender, 'TestCaseNewcomerHelpSender');
	suite.addTestCase(TestCaseItemInfoSender, 'TestCaseItemInfoSender');
	suite.addTestCase(TestCaseExchangeSender, 'TestCaseExchangeSender');
	suite.addTestCase(TestCaseLogSender, 'TestCaseLogSender');
	suite.addTestCase(TestCasePaymentSender, 'TestCasePaymentSender');
	suite.addTestCase(TestCaseYellowDiamondSender, 'TestCaseYellowDiamondSender');
	suite.addTestCase(TestCaseBlueDiamondSender, 'TestCaseBlueDiamondSender');
	suite.addTestCase(TestCaseDealGoldSender, 'TestCaseDealGoldSender');
	suite.addTestCase(TestCaseClientCfgSender, 'TestCaseClientCfgSender');
	suite.addTestCase(TestCaseVipSender, 'TestCaseVipSender');
	suite.addTestCase(TestCaseAutoBuildSender, 'TestCaseAutoBuildSender');
	suite.addTestCase(TestCaseCDKeySender, 'TestCaseCDKeySender');
	suite.addTestCase(TestCaseWorldBossrSender, 'TestCaseWorldBossrSender');
	suite.addTestCase(TestCaseRewardSender, 'TestCaseRewardSender');
};