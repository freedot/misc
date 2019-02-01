/*******************************************************************************/
require('./tqRoleAchievement.js')

TestCaseRoleAchievement = TestCase.extern(function(){
	this.setUp = function(){
		TestCaseHelper.setUp(this);
		var role = {cityMaxLevel:8, actTower:9, actTerrace:0, vip:0};
		this.ra = RoleAchievement.snew(this.g, MockDomEx.snew('div'));
		this.ra.setRole(role);
	};
	
	this.tearDown = function(){
		TestCaseHelper.tearDown(this);
	};
	
	this.test_createList = function(){
		var ra = RoleAchievement.snew(this.g, MockDomEx.snew('div'));
		assertEQ ( ra.items_.list instanceof List, true );
	};
	
	this.test_setRole = function(){
		var role = {cityMaxLevel:8, actTower:10, actTerrace:9, vip:12};
		var ra = RoleAchievement.snew(this.g, MockDomEx.snew('div'));
		ra.setRole(role);
		assertEQ ( ra.items_.list.getCount(), 4 );
		assertEQ ( isInclude(IMG.getBKImage(ra.items_.list.getItem(0).exsubs.icon), IMG.getCityBigLevelIcon(2)), true );
		assertEQ ( TQ.getTextEx(ra.items_.list.getItem(0).exsubs.num), IMG.getImgNumber('com', 3) );

		var isEnable = true;
		assertEQ ( isInclude(IMG.getBKImage(ra.items_.list.getItem(1).exsubs.icon), IMG.getActTowerIcon(isEnable)), true );
		assertEQ ( TQ.getTextEx(ra.items_.list.getItem(1).exsubs.num), IMG.getImgNumber('com', 1) );
	
		var isEnable = true;
		assertEQ ( isInclude(IMG.getBKImage(ra.items_.list.getItem(2).exsubs.icon), IMG.getActTerraceIcon(isEnable)), true );
		assertEQ ( TQ.getTextEx(ra.items_.list.getItem(2).exsubs.num), IMG.getImgNumber('com', 9) );
		
		var isEnable = true;
		assertEQ ( isInclude(IMG.getBKImage(ra.items_.list.getItem(3).exsubs.icon), IMG.getVipIcon(isEnable)), true );
		assertEQ ( TQ.getTextEx(ra.items_.list.getItem(3).exsubs.num), IMG.getImgNumber('com', 12) );

		
		var role = {cityLevel:0, actTower:9, actTerrace:0, vip:0};
		var ra = RoleAchievement.snew(this.g, MockDomEx.snew('div'));
		ra.setRole(role);
		assertEQ ( isInclude(IMG.getBKImage(ra.items_.list.getItem(0).exsubs.icon), IMG.getCityBigLevelIcon(0)), true );
		assertEQ ( TQ.getTextEx(ra.items_.list.getItem(0).exsubs.num), IMG.getImgNumber('com', 0) );
		
		var isEnable = false;
		assertEQ ( isInclude(IMG.getBKImage(ra.items_.list.getItem(1).exsubs.icon), IMG.getActTowerIcon(isEnable)), true );
		assertEQ ( TQ.getTextEx(ra.items_.list.getItem(1).exsubs.num), IMG.getImgNumber('com', 0) );
	
		var isEnable = false;
		assertEQ ( isInclude(IMG.getBKImage(ra.items_.list.getItem(2).exsubs.icon), IMG.getActTerraceIcon(isEnable)), true );
		assertEQ ( TQ.getTextEx(ra.items_.list.getItem(2).exsubs.num), IMG.getImgNumber('com', 0) );
		
		var isEnable = false;
		assertEQ ( isInclude(IMG.getBKImage(ra.items_.list.getItem(3).exsubs.icon), IMG.getVipIcon(isEnable)), true );
		assertEQ ( TQ.getTextEx(ra.items_.list.getItem(3).exsubs.num), IMG.getImgNumber('com', 0) );
	};
	
	this.test_getRoleCityTip = function(){
		var tip = TTIP.getTipById(this.ra.items_.list.getItem(0).exsubs.tooltips['$item']);
		var res = TQ.qfind(res_citylevelneeds, 'level', 8);
		tip.getTip(); assertEQ ( tip.getTipMsg(), TQ.format(rstr.roledlg.tips.citylevel, res.name) );
	};
	
	this.test_getActTowerTip = function(){
		var tip = TTIP.getTipById(this.ra.items_.list.getItem(1).exsubs.tooltips['$item']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), TQ.format(rstr.roledlg.tips.passtower, 0) );
		
		var role = {cityMaxLevel:8, actTower:11, actTerrace:9, vip:0};
		this.ra.setRole(role);
		tip.getTip(); assertEQ ( tip.getTipMsg(), TQ.format(rstr.roledlg.tips.passtower, 10) );
	};
	
	this.test_getActTerraceTip = function(){
		var tip = TTIP.getTipById(this.ra.items_.list.getItem(2).exsubs.tooltips['$item']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), rstr.roledlg.tips.nopassterrace );
		
		var role = {cityMaxLevel:8, actTower:11, actTerrace:3, vip:0};
		this.ra.setRole(role);
		var res = res_terrace[3][0];
		tip.getTip(); 
		assertEQ ( tip.getTipMsg(), TQ.format(rstr.roledlg.tips.passterrace, res.gateName) );
	}
	
	this.test_getVipTip = function(){
		var tip = TTIP.getTipById(this.ra.items_.list.getItem(3).exsubs.tooltips['$item']);
		tip.getTip(); assertEQ ( tip.getTipMsg(), rstr.roledlg.tips.novip );
		
		var role = {cityMaxLevel:8, actTower:11, actTerrace:3, vip:1};
		this.ra.setRole(role);
		tip.getTip();  assertEQ ( tip.getTipMsg(), TQ.format(rstr.roledlg.tips.vip, 1) );
	}
});

tqRoleAchievement_t_main = function(suite) {
	suite.addTestCase(TestCaseRoleAchievement, 'TestCaseRoleAchievement');
};
